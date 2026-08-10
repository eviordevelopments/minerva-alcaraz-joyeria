import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// ─── PUT: Update a DB product or create if static ─────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      description,
      long_description,
      significado,
      price,
      category,
      collection,
      collection_id,
      materials,
      occasions,
      outfits,
      style,
      purity,
      finish,
      available_sizes,
      images,
      stock,
      is_active,
      is_featured,
      is_author_design,
      is_limited_edition,
      is_unique_piece,
      is_circle_exclusive,
      seo_keywords,
      sku,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = toSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (long_description !== undefined) updateData.long_description = long_description;
    if (significado !== undefined) updateData.significado = significado;
    if (price !== undefined) updateData.price_cents = Math.round(parseFloat(price) * 100);
    if (category !== undefined) updateData.category = category;
    if (collection !== undefined) updateData.collection_name = collection;
    if (collection_id !== undefined) updateData.collection_id = collection_id;
    if (materials !== undefined) {
      updateData.materials = materials;
      updateData.primary_material = materials[0] ?? null;
    }
    if (occasions !== undefined) updateData.occasions = occasions;
    if (outfits !== undefined) updateData.outfit_suggestions = outfits;
    if (style !== undefined) updateData.style = style;
    if (purity !== undefined) updateData.purity = purity;
    if (finish !== undefined) updateData.finish = finish;
    if (available_sizes !== undefined) updateData.available_sizes = available_sizes;
    if (images !== undefined) {
      updateData.images = images;
      updateData.primary_image = images[0] ?? null;
    }
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_featured !== undefined) updateData.is_featured = is_featured;
    if (is_author_design !== undefined) updateData.is_author_design = is_author_design;
    if (is_limited_edition !== undefined) updateData.is_limited_edition = is_limited_edition;
    if (is_unique_piece !== undefined) updateData.is_unique_piece = is_unique_piece;
    if (is_circle_exclusive !== undefined) updateData.is_circle_exclusive = is_circle_exclusive;
    if (seo_keywords !== undefined) {
      updateData.seo_keywords = Array.isArray(seo_keywords)
        ? seo_keywords
        : String(seo_keywords).split(",").map((k: string) => k.trim()).filter(Boolean);
    }
    if (body.payment_link !== undefined) updateData.payment_link = body.payment_link || null;

    updateData.updated_at = new Date().toISOString();

    // Safely query existing row without UUID syntax errors
    let existingQuery = supabaseAdmin.from("products").select("id");
    const skuVal = sku || id;

    if (isUUID(id)) {
      existingQuery = existingQuery.or(`id.eq.${id},sku.eq.${skuVal},slug.eq.${id}`);
    } else {
      existingQuery = existingQuery.or(`sku.eq.${skuVal},slug.eq.${id}`);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      let { data, error } = await supabaseAdmin
        .from("products")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error && (error.message?.includes("payment_link") || error.code === "PGRST204")) {
        delete updateData.payment_link;
        const retry = await supabaseAdmin
          .from("products")
          .update(updateData)
          .eq("id", existing.id)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, product: data });
    } else {
      // Upsert static product into DB
      const insertData: Record<string, unknown> = {
        sku: skuVal,
        slug: toSlug(name || id),
        name: name || "Pieza Minerva Alcaraz",
        description: description || "",
        price_cents: price ? Math.round(parseFloat(price) * 100) : 0,
        category: category || "Piezas Únicas",
        collection_name: collection || "",
        stock: stock !== undefined ? parseInt(stock, 10) : 1,
        images: images || [],
        primary_image: images?.[0] || null,
        is_active: is_active ?? true,
        ...updateData,
      };

      let { data, error } = await supabaseAdmin
        .from("products")
        .insert(insertData)
        .select()
        .single();

      if (error && (error.message?.includes("payment_link") || error.code === "PGRST204")) {
        delete insertData.payment_link;
        const retry = await supabaseAdmin
          .from("products")
          .insert(insertData)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, product: data });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE: Delete DB or static product ──────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const skuParam = searchParams.get("sku") || id;

    let query = supabaseAdmin.from("products").select("id");
    if (isUUID(id)) {
      query = query.or(`id.eq.${id},sku.eq.${skuParam},slug.eq.${id}`);
    } else {
      query = query.or(`sku.eq.${skuParam},slug.eq.${id}`);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      // Mark inactive (tombstone) or delete
      const { error } = await supabaseAdmin
        .from("products")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) {
        await supabaseAdmin.from("products").delete().eq("id", existing.id);
      }
      return NextResponse.json({ success: true, deleted: true });
    } else {
      // Static mock product: insert tombstone row into DB with is_active = false
      const { error } = await supabaseAdmin
        .from("products")
        .insert({
          sku: skuParam,
          slug: id,
          name: `[Eliminado] ${skuParam}`,
          description: "Producto mock eliminado",
          price_cents: 0,
          category: "Eliminado",
          is_active: false,
          stock: 0,
        });

      if (error) {
        console.warn("Notice marking static product deleted in DB:", error.message);
      }
      return NextResponse.json({ success: true, deleted: true });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
