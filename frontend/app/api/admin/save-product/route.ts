import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role to bypass RLS for admin inserts
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Convert a product name to a URL-safe slug */
function toSlug(name: string, sku: string): string {
  const namePart = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const skuPart = sku.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  return `${namePart}-${skuPart}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nombre,
      sku,
      precio,
      tipo,        // → category
      coleccion,   // → collection_name
      preferencia, // → maps to flags
      narrativa,   // → description
      detalles,    // → long_description
      materiales,
      imagenes,
      isExclusive, // → is_circle_exclusive
      seoKeywords, // string → TEXT[]
      paymentLink, // → payment_link URL
    } = body;

    if (!nombre || !sku || !precio || !tipo) {
      return NextResponse.json(
        { error: "Nombre, SKU, precio y tipo son requeridos" },
        { status: 400 }
      );
    }

    // Build slug — ensure uniqueness by appending timestamp if needed
    const slug = toSlug(nombre, sku);

    // Parse price (admin sends MXN pesos as string, DB stores cents)
    const priceCents = Math.round(parseFloat(precio) * 100);

    // Map preferencia → boolean flags
    const isUnique     = preferencia === "Piezas Únicas";
    const isLimited    = preferencia === "Edición Limitada";
    const isAuthor     = preferencia === "Diseño de Autor";

    // seoKeywords arrives as a comma-separated string, split to array
    const seoArr: string[] = seoKeywords
      ? seoKeywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean)
      : [];

    const productRow = {
      name:               nombre,
      sku:                sku,
      slug:               slug,
      description:        narrativa ?? null,
      long_description:   detalles ?? null,
      price_cents:        priceCents,
      currency:           "MXN",
      category:           tipo,          // must match product_category enum
      collection_name:    coleccion,
      materials:          materiales ?? [],
      primary_material:   materiales?.[0] ?? null,
      images:             imagenes ?? [],
      primary_image:      imagenes?.[0] ?? null,
      is_active:          true,
      is_featured:        false,
      is_circle_exclusive: isExclusive ?? false,
      is_unique_piece:    isUnique,
      is_limited_edition: isLimited,
      is_author_design:   isAuthor,
      seo_keywords:       seoArr,
      stock:              1,
      payment_link:       paymentLink ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(productRow)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Fallback 1: If payment_link column is missing in DB schema cache
      if (error.message?.includes("payment_link") || error.code === "PGRST204") {
        console.warn("Retrying insert without payment_link column...");
        const { payment_link, ...rowWithoutPaymentLink } = productRow;
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from("products")
          .insert(rowWithoutPaymentLink)
          .select()
          .single();

        if (!retryError) {
          return NextResponse.json({ success: true, product: retryData });
        }
      }

      // Fallback 2: If slug conflict, retry with a unique suffix
      if (error.code === "23505" && error.message?.includes("slug")) {
        const uniqueSlug = `${slug}-${Date.now()}`;
        const { data: data2, error: error2 } = await supabaseAdmin
          .from("products")
          .insert({ ...productRow, slug: uniqueSlug })
          .select()
          .single();
        if (error2) {
          return NextResponse.json({ error: error2.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, product: data2 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Save product route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
