import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../../../../constants/products";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── GET: Full product list (DB + static seed merged) ─────────────────────
export async function GET() {
  try {
    const { data: dbProducts, error } = await supabaseAdmin
      .from("products")
      .select(
        `id, sku, slug, name, description, long_description, significado,
         price_cents, currency, category, collection_name, collection_id,
         materials, primary_material, occasions, outfit_suggestions,
         is_active, is_featured, is_author_design, is_limited_edition,
         is_unique_piece, is_circle_exclusive, available_sizes,
         stock, stock_reserved, images, primary_image,
         seo_keywords, style, purity, finish,
         created_at, updated_at, published_at`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // ── Fetch sold units per product from order_items ─────────────────────
    const { data: salesData } = await supabaseAdmin
      .from("order_items")
      .select("product_sku, quantity");

    // Build sku → sold map
    const soldMap: Record<string, number> = {};
    (salesData ?? []).forEach((row: { product_sku: string; quantity: number }) => {
      soldMap[row.product_sku] = (soldMap[row.product_sku] ?? 0) + row.quantity;
    });

    // ── Normalize DB rows ─────────────────────────────────────────────────
    const normalized = (dbProducts ?? []).map((row) => ({
      _source: "db" as const,
      id: row.id,
      sku: row.sku,
      slug: row.slug,
      name: row.name,
      description: row.description ?? row.long_description ?? "",
      long_description: row.long_description ?? null,
      significado: row.significado ?? null,
      price: Math.round((row.price_cents ?? 0) / 100),
      price_cents: row.price_cents,
      currency: row.currency ?? "MXN",
      category: row.category,
      collection: row.collection_name ?? "",
      collection_id: row.collection_id ?? null,
      materials: row.materials ?? [],
      primary_material: row.primary_material ?? null,
      occasions: row.occasions ?? [],
      outfits: row.outfit_suggestions ?? [],
      style: row.style ?? null,
      purity: row.purity ?? null,
      finish: row.finish ?? null,
      available_sizes: row.available_sizes ?? [],
      images: row.images ?? (row.primary_image ? [row.primary_image] : []),
      primary_image: row.primary_image ?? null,
      stock: row.stock ?? 0,
      stock_reserved: row.stock_reserved ?? 0,
      sold: soldMap[row.sku] ?? 0,
      is_active: row.is_active ?? true,
      is_featured: row.is_featured ?? false,
      is_author_design: row.is_author_design ?? false,
      is_limited_edition: row.is_limited_edition ?? false,
      is_unique_piece: row.is_unique_piece ?? false,
      is_circle_exclusive: row.is_circle_exclusive ?? false,
      seo_keywords: row.seo_keywords ?? [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    // ── Merge static PRODUCTS not already in DB (by SKU) ─────────────────
    const dbSkus = new Set(normalized.map((p) => p.sku));
    const staticOnly = PRODUCTS
      .filter((p) => !dbSkus.has(p.sku))
      .map((p) => ({
        _source: "static" as const,
        id: p.id,
        sku: p.sku,
        slug: p.id,
        name: p.name,
        description: p.description,
        long_description: null,
        significado: p.significado ?? null,
        price: p.price,
        price_cents: p.price * 100,
        currency: p.currency,
        category: p.category,
        collection: p.collection,
        collection_id: null,
        materials: p.materials,
        primary_material: p.materials[0] ?? null,
        occasions: p.occasions ?? [],
        outfits: p.outfits ?? [],
        style: p.metadata?.style ?? null,
        purity: null,
        finish: null,
        available_sizes: [],
        images: p.images,
        primary_image: p.images[0] ?? null,
        stock: p.stock,
        stock_reserved: 0,
        sold: soldMap[p.sku] ?? 0,
        is_active: true,
        is_featured: p.featured ?? false,
        is_author_design: p.metadata?.isAuthorDesign ?? false,
        is_limited_edition: false,
        is_unique_piece: p.category === "Piezas Únicas",
        is_circle_exclusive: false,
        seo_keywords: p.tags ?? [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    return NextResponse.json({
      products: [...normalized, ...staticOnly],
      total: normalized.length + staticOnly.length,
      db_count: normalized.length,
      static_count: staticOnly.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
