import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../../../constants/products";

// Public anon key is fine here — products are publicly readable per RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");

    let allDbRows: Record<string, any>[] = [];

    try {
      // Fetch ALL products from DB (both active and inactive tombstones)
      let query = supabase.from("products").select("*");

      if (slugParam) {
        query = query.or(`slug.eq.${slugParam},sku.eq.${slugParam},id.eq.${slugParam}`);
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase products fetch notice:", error.message);
      } else if (data) {
        allDbRows = data;
      }
    } catch (dbErr) {
      console.warn("Products DB fetch error:", dbErr);
    }

    // Set of ALL DB skus and slugs (used to suppress deleted static items)
    const dbSkus = new Set<string>();
    const dbSlugs = new Set<string>();
    allDbRows.forEach((row) => {
      if (row.sku) dbSkus.add(row.sku);
      if (row.slug) dbSlugs.add(row.slug);
      if (row.id) dbSlugs.add(row.id);
    });

    // Normalize ONLY active DB rows (is_active !== false)
    const activeDbProducts = allDbRows
      .filter((row) => row.is_active !== false)
      .map((row) => ({
        id: row.id,
        sku: row.sku,
        slug: row.slug,
        name: row.name,
        description: row.description ?? "",
        long_description: row.long_description ?? row.description ?? null,
        significado: row.significado ?? null,
        price: Math.round((row.price_cents ?? 0) / 100),
        price_cents: row.price_cents,
        currency: row.currency ?? "MXN",
        category: row.category,
        collection: row.collection_name ?? row.collection ?? "",
        collection_name: row.collection_name ?? row.collection ?? "",
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
        payment_link: row.payment_link ?? null,
        _source: "db" as const,
      }));

    // Filter static PRODUCTS to exclude any that match a DB SKU or Slug (active or deleted tombstone)
    const activeStaticProducts = PRODUCTS.filter(
      (p) => !dbSkus.has(p.sku) && !dbSlugs.has(p.id)
    );

    // If DB has real products, show ONLY DB products. Otherwise show non-deleted static items.
    const finalProducts = activeDbProducts.length > 0 ? activeDbProducts : activeStaticProducts;

    return NextResponse.json({
      products: finalProducts,
    });
  } catch (err: unknown) {
    console.error("Public products API error:", err);
    return NextResponse.json({ products: PRODUCTS });
  }
}
