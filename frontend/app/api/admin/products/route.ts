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
    let allDbRows: Record<string, any>[] = [];
    let salesData: { product_sku: string; quantity: number }[] = [];

    // Fetch DB products with select("*") for maximum schema flexibility
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Notice fetching DB products, falling back to static catalog:", error.message);
      } else if (data) {
        allDbRows = data;
      }
    } catch (dbErr) {
      console.warn("DB query error, using static catalog fallback:", dbErr);
    }

    // Fetch sales data if order_items table exists
    try {
      const { data } = await supabaseAdmin
        .from("order_items")
        .select("product_sku, quantity");
      if (data) salesData = data as any;
    } catch {
      // Ignore order items error
    }

    // Build sku → sold map
    const soldMap: Record<string, number> = {};
    salesData.forEach((row) => {
      if (row.product_sku) {
        soldMap[row.product_sku] = (soldMap[row.product_sku] ?? 0) + (row.quantity ?? 1);
      }
    });

    // Set of ALL DB skus and slugs (used to suppress deleted static items)
    const dbSkus = new Set<string>();
    const dbSlugs = new Set<string>();
    allDbRows.forEach((row) => {
      if (row.sku) dbSkus.add(row.sku);
      if (row.slug) dbSlugs.add(row.slug);
      if (row.id) dbSlugs.add(row.id);
    });

    // ── Normalize active DB rows (is_active !== false) ─────────────────────
    const activeDbProducts = allDbRows
      .filter((row) => row.is_active !== false)
      .map((row) => ({
        _source: "db" as const,
        id: row.id,
        sku: row.sku || `SKU-${row.id}`,
        slug: row.slug || row.id,
        name: row.name || "Pieza Minerva Alcaraz",
        description: row.description ?? "",
        long_description: row.long_description ?? row.description ?? null,
        significado: row.significado ?? null,
        price: Math.round((row.price_cents ?? 0) / 100),
        price_cents: row.price_cents ?? 0,
        currency: row.currency ?? "MXN",
        category: row.category ?? "Piezas Únicas",
        collection: row.collection_name ?? row.collection ?? "",
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
        payment_link: row.payment_link ?? null,
        created_at: row.created_at ?? new Date().toISOString(),
        updated_at: row.updated_at ?? new Date().toISOString(),
      }));

    return NextResponse.json({
      products: activeDbProducts,
      total: activeDbProducts.length,
      db_count: activeDbProducts.length,
      static_count: 0,
    });
  } catch (err: unknown) {
    console.error("Admin products API error:", err);
    return NextResponse.json({
      products: [],
      total: 0,
      db_count: 0,
      static_count: 0,
    });
  }
}
