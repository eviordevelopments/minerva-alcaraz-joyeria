import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public anon key is fine here — products are publicly readable per RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");

    let query = supabase
      .from("products")
      .select(
        "id, sku, slug, name, description, long_description, significado, price_cents, currency, category, collection_name, materials, occasions, outfit_suggestions, style, purity, available_sizes, images, primary_image, is_featured, is_circle_exclusive, is_unique_piece, is_author_design, is_limited_edition, stock, seo_keywords, created_at"
      )
      .eq("is_active", true);

    // If slug param provided, search by slug OR sku
    if (slugParam) {
      query = query.or(`slug.eq.${slugParam},sku.eq.${slugParam}`);
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase products fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize DB rows into the Product interface shape used on the frontend
    const products = (data ?? []).map((row) => ({
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      name: row.name,
      description: row.description ?? row.long_description ?? "",
      long_description: row.long_description ?? null,
      significado: row.significado ?? null,
      // DB stores price in cents → convert to pesos for the frontend
      price: Math.round((row.price_cents ?? 0) / 100),
      price_cents: row.price_cents,
      currency: row.currency ?? "MXN",
      category: row.category,
      collection: row.collection_name ?? "",
      collection_name: row.collection_name ?? "",
      materials: row.materials ?? [],
      occasions: row.occasions ?? [],
      outfit_suggestions: row.outfit_suggestions ?? [],
      style: row.style ?? null,
      purity: row.purity ?? null,
      available_sizes: row.available_sizes ?? [],
      images: row.images ?? (row.primary_image ? [row.primary_image] : []),
      primary_image: row.primary_image ?? null,
      stock: row.stock ?? 0,
      featured: row.is_featured ?? false,
      isCircleExclusive: row.is_circle_exclusive ?? false,
      is_featured: row.is_featured ?? false,
      is_circle_exclusive: row.is_circle_exclusive ?? false,
      is_unique_piece: row.is_unique_piece ?? false,
      is_author_design: row.is_author_design ?? false,
      is_limited_edition: row.is_limited_edition ?? false,
      // Source tag so the UI can distinguish DB products
      _source: "db" as const,
    }));

    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
