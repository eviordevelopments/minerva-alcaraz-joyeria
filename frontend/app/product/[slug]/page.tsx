"use client";

import React, { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import { FAQSection } from "../../../components/FAQSection";
import { Footer } from "../../../components/Footer";
import { ProductCard } from "../../../components/DesignSystem";
import { ProductPDPPreview, PDPProduct } from "../../../components/ProductPDPPreview";
import { PRODUCTS } from "../../../constants/products";
import { Loader2 } from "lucide-react";

// ─── Normalize Supabase DB row → PDPProduct ────────────────────────────────
function dbRowToPDP(row: Record<string, unknown>): PDPProduct {
  const priceCents = (row.price_cents as number) ?? 0;
  return {
    id: row.id as string,
    sku: row.sku as string,
    name: row.name as string,
    description: (row.description as string) ?? (row.long_description as string) ?? "",
    long_description: row.long_description as string | null,
    significado: row.significado as string | null,
    price: Math.round(priceCents / 100),
    currency: (row.currency as string) ?? "MXN",
    category: row.category as string,
    collection: (row.collection_name as string) ?? "",
    materials: (row.materials as string[]) ?? [],
    occasions: (row.occasions as string[]) ?? [],
    outfits: (row.outfit_suggestions as string[]) ?? [],
    style: row.style as string | null,
    purity: row.purity as string | null,
    images: (row.images as string[]) ?? (row.primary_image ? [row.primary_image] : []),
    stock: (row.stock as number) ?? 0,
    is_featured: (row.is_featured as boolean) ?? false,
    is_circle_exclusive: (row.is_circle_exclusive as boolean) ?? false,
    is_unique_piece: (row.is_unique_piece as boolean) ?? false,
    is_author_design: (row.is_author_design as boolean) ?? false,
    is_limited_edition: (row.is_limited_edition as boolean) ?? false,
    available_sizes: (row.available_sizes as string[]) ?? [],
  };
}

// ─── Normalize static product → PDPProduct ────────────────────────────────
function staticToPDP(p: (typeof PRODUCTS)[0]): PDPProduct {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    description: p.description,
    long_description: null,
    significado: p.significado ?? null,
    price: p.price,
    currency: p.currency,
    category: p.category,
    collection: p.collection,
    materials: p.materials,
    occasions: p.occasions ?? [],
    outfits: p.outfits ?? [],
    style: p.metadata?.style ?? null,
    purity: null,
    images: p.images,
    stock: p.stock,
    is_featured: p.featured ?? false,
    is_circle_exclusive: false,
    is_unique_piece: p.category === "Piezas Únicas",
    is_author_design: p.metadata?.isAuthorDesign ?? false,
    is_limited_edition: false,
    available_sizes: [],
  };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const [product, setProduct] = useState<PDPProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);

      // 1. Try static array first (instant, no network)
      const staticMatch = PRODUCTS.find(
        (p) => p.id === slug || p.sku === slug
      );
      if (staticMatch) {
        setProduct(staticToPDP(staticMatch));
        setIsLoading(false);
        return;
      }

      // 2. Try DB via public API — search by slug or sku
      try {
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
        const json = await res.json();
        const row = (json.products ?? [])[0];
        if (row) {
          setProduct(dbRowToPDP(row));
          setIsLoading(false);
          return;
        }
      } catch {
        // fallthrough
      }

      // 3. Fall back to first static product (prevents blank page)
      const fallback = PRODUCTS[0];
      if (fallback) {
        setProduct(staticToPDP(fallback));
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }

    loadProduct();
  }, [slug]);

  // Related products (same collection, at most 4)
  const relatedProducts = product
    ? PRODUCTS.filter(
        (p) =>
          p.collection === product.collection &&
          p.id !== product.id &&
          p.sku !== product.sku
      ).slice(0, 4)
    : [];

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-hueso-seda">
        <Header />
        <div className="pt-40 md:pt-56 px-8 md:px-16 pb-32 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
          <Loader2 size={24} className="animate-spin text-oro-antiguo" />
          <span className="text-[9px] uppercase tracking-[0.5em] text-plata-niebla">
            Cargando pieza...
          </span>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-hueso-seda">
        <Header />
        <div className="pt-40 md:pt-56 px-8 md:px-16 pb-32 flex flex-col items-center gap-6 min-h-[60vh]">
          <h1 className="text-4xl font-display text-verde-ebano">Pieza no encontrada</h1>
          <p className="text-sm text-plata-niebla">Esta pieza no existe en nuestro atelier.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      <div className="pt-40 md:pt-56 px-4 sm:px-8 md:px-16 pb-32">
        {/* ── Standardized PDP ─────────────────────────────────────────────── */}
        <ProductPDPPreview product={product} isAdminPreview={false} />

        {/* ── Complementar el Ritual ───────────────────────────────────────── */}
        {(relatedProducts.length > 0 || PRODUCTS.length > 0) && (
          <section className="mt-24 border-t border-plata-niebla/10 pt-20">
            <div className="flex flex-col items-center mb-12 text-center gap-3">
              <h2 className="text-4xl font-display text-verde-ebano italic">
                Complementar el Ritual
              </h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla max-w-md">
                Piezas seleccionadas por el atelier basándose en armonía de proporciones.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {(relatedProducts.length > 0 ? relatedProducts : PRODUCTS.slice(0, 4)).map(
                (rp) => <ProductCard key={rp.id} product={rp} />
              )}
            </div>
          </section>
        )}
      </div>

      <FAQSection />
      <Footer />
    </main>
  );
}
