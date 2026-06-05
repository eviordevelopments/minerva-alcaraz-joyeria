"use client";

/**
 * ProductPDPPreview
 * ─────────────────────────────────────────────────────────────────────────
 * The canonical PDP layout used BOTH by:
 *   1. The public product page  (/product/[slug])
 *   2. The admin inventory preview  (/admin/inventario)
 *
 * All products — static or DB-created — render this same component so the
 * experience is always identical.
 *
 * Props mirror the unified AdminProduct shape used in the inventory.
 * Optional fields render gracefully with fallbacks.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingBag, Heart, Ruler, Info,
  Box, BookOpen, ClipboardCheck, Truck, ShieldCheck,
} from "lucide-react";
import { EmpaqueCarousel } from "./EmpaqueCarousel";

export interface PDPProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  long_description?: string | null;
  significado?: string | null;
  price: number;
  currency: string;
  category: string;
  collection: string;
  materials: string[];
  occasions?: string[];
  outfits?: string[];
  style?: string | null;
  purity?: string | null;
  images: string[];
  stock: number;
  is_featured?: boolean;
  is_circle_exclusive?: boolean;
  is_unique_piece?: boolean;
  is_author_design?: boolean;
  is_limited_edition?: boolean;
  available_sizes?: string[];
}

interface ProductPDPPreviewProps {
  product: PDPProduct;
  /** When true, wraps in a bordered admin preview frame */
  isAdminPreview?: boolean;
  onAddToCart?: () => void;
  onFavorite?: () => void;
}

const FALLBACK_SIZES = ["5", "6", "7", "8", "9"];

export const ProductPDPPreview: React.FC<ProductPDPPreviewProps> = ({
  product,
  isAdminPreview = false,
  onAddToCart,
  onFavorite,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = product.available_sizes?.length
    ? product.available_sizes
    : FALLBACK_SIZES;

  const occasions = product.occasions?.length
    ? product.occasions
    : ["Gala", "Ritual", "Legado"];

  const outfits = product.outfits?.length
    ? product.outfits
    : ["Seda Cruda", "Lino Minimalista"];

  // ── Admin preview frame ──────────────────────────────────────────────────
  const wrapper = (content: React.ReactNode) =>
    isAdminPreview ? (
      <div className="bg-[#E5DBD6] text-[#2C3729] border-4 border-[#CBB67B] shadow-2xl relative">
        <div className="sticky top-0 z-10 bg-[#CBB67B]/10 border-b border-[#CBB67B]/30 px-6 py-3 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.5em] text-[#2C3729]/50">
            Vista Previa del PDP · Simulación Exacta
          </span>
          <div className="flex gap-2">
            {product.is_circle_exclusive && (
              <span className="text-[8px] uppercase tracking-widest border border-[#CBB67B] text-[#CBB67B] px-2 py-0.5 bg-[#2C3729]">
                Exclusivo The Circle
              </span>
            )}
            {product.is_unique_piece && (
              <span className="text-[8px] uppercase tracking-widest border border-[#2C3729]/30 text-[#2C3729]/60 px-2 py-0.5">
                Pieza Única
              </span>
            )}
          </div>
        </div>
        <div className="p-8 md:p-12 lg:p-16">{content}</div>
      </div>
    ) : (
      <>{content}</>
    );

  const body = (
    <>
      {/* ── Main grid: gallery + details ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
          {/* Vertical thumbnails */}
          <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-[3/4] relative overflow-hidden border transition-all ${
                  selectedImage === idx
                    ? "border-[#CBB67B]"
                    : "border-transparent hover:border-[#CBB67B]/30"
                }`}
              >
                <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main viewport */}
          <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-[#C3C9C0]/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Box size={48} strokeWidth={0.5} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* 360° button */}
            <button className="absolute bottom-4 right-4 bg-[#E5DBD6]/80 backdrop-blur-md px-3 py-1.5 text-[8px] tracking-widest uppercase border border-[#2C3729]/20 flex items-center gap-2 hover:bg-[#2C3729] hover:text-[#E5DBD6] transition-all">
              <Box size={10} /> Vista 360°
            </button>

            {/* Mobile thumbnail strip */}
            <div className="md:hidden absolute bottom-14 left-0 right-0 flex gap-2 px-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-10 h-12 relative overflow-hidden border ${
                    selectedImage === idx ? "border-[#CBB67B]" : "border-[#2C3729]/20"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 flex flex-col gap-7">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C3C9C0]">
                Colección {product.collection}
              </span>
              <span className="px-2 py-0.5 border border-[#CBB67B] text-[8px] uppercase tracking-widest text-[#CBB67B] bg-[#CBB67B]/5">
                {product.category}
              </span>
              {product.is_limited_edition && (
                <span className="px-2 py-0.5 border border-[#C3C9C0]/40 text-[8px] uppercase tracking-widest text-[#C3C9C0]">
                  Ed. Limitada
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-[#2C3729] leading-tight">
              {product.name || "Nombre de la Pieza"}
            </h1>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xl font-light text-[#2C3729]">
                ${product.price.toLocaleString("es-MX")} {product.currency}
              </span>
              <span className="text-[8px] tracking-widest text-[#C3C9C0] uppercase font-mono">
                SKU: {product.sku}
              </span>
            </div>
          </div>

          {/* Narrative quote */}
          <p className="text-sm italic text-[#2C3729]/70 font-light border-l-2 border-[#CBB67B] pl-4 py-1 leading-relaxed">
            &quot;{product.description || "Una pieza diseñada para habitar en la eternidad."}&quot;
          </p>

          {/* Size selector */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-[#2C3729]">
                Seleccionar Talla
              </span>
              <button className="text-[10px] uppercase tracking-widest flex items-center gap-1.5 text-[#C3C9C0] hover:text-[#CBB67B] transition-colors">
                <Ruler size={12} /> Guía de Tallas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 border text-xs transition-all ${
                    selectedSize === size
                      ? "border-[#2C3729] bg-[#2C3729] text-[#E5DBD6]"
                      : "border-[#C3C9C0]/40 text-[#2C3729] hover:border-[#CBB67B]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              disabled={product.stock === 0}
              onClick={onAddToCart}
              className="w-full py-4 bg-[#294127] text-[#E5DBD6] text-xs uppercase tracking-[0.3em] hover:bg-[#2C3729] transition-all flex items-center justify-center gap-3 disabled:bg-[#C3C9C0] disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} />
              {product.stock === 0 ? "Pieza Agotada" : "Añadir a la Bolsa"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setIsFavorite(!isFavorite); onFavorite?.(); }}
                className={`py-3.5 border text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                  isFavorite
                    ? "border-[#CBB67B] text-[#CBB67B]"
                    : "border-[#2C3729] text-[#2C3729] hover:border-[#CBB67B]"
                }`}
              >
                <Heart size={13} className={isFavorite ? "fill-[#CBB67B]" : ""} />
                Favoritos
              </button>
              <button className="py-3.5 border border-[#2C3729] text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:border-[#CBB67B] transition-all text-[#2C3729]">
                <BookOpen size={13} /> Mi Álbum
              </button>
            </div>
          </div>

          {/* Technical panel */}
          <div className="flex flex-col gap-5">
            <div className="bg-[#C3C9C0]/10 p-5 border-l-2 border-[#CBB67B]">
              <span className="text-[9px] uppercase tracking-widest text-[#2C3729] font-medium block mb-3">
                Detalle Técnico
              </span>
              <div className="grid grid-cols-2 gap-y-3 text-[9px] uppercase tracking-wider">
                <span className="text-[#C3C9C0]">Material</span>
                <span className="text-[#2C3729]">
                  {product.materials.join(", ") || "—"}
                </span>
                {product.purity && (
                  <>
                    <span className="text-[#C3C9C0]">Pureza</span>
                    <span className="text-[#2C3729]">{product.purity}</span>
                  </>
                )}
                <span className="text-[#C3C9C0]">Estilo</span>
                <span className="text-[#2C3729]">
                  {product.style || "Clásico Atemporal"}
                </span>
                <span className="text-[#C3C9C0]">Existencias</span>
                <span className={product.stock <= 2 ? "text-amber-600" : "text-[#2C3729]"}>
                  {product.stock} {product.stock === 1 ? "pieza" : "piezas"}
                </span>
              </div>
            </div>

            {/* El Significado */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-[#CBB67B]">
                  El Significado
                </span>
                <div className="h-px flex-1 bg-[#CBB67B]/20" />
              </div>
              <p className="text-sm leading-relaxed text-[#2C3729]/75 font-light">
                {product.significado ||
                  "Una pieza diseñada para habitar en la eternidad, capturando la esencia de la herencia y el arte joyero."}
              </p>
            </div>

            {/* AI suggestions */}
            <div className="border-t border-[#C3C9C0]/20 pt-5 flex flex-col gap-3">
              <span className="text-[9px] uppercase tracking-widest flex items-center gap-2 text-[#CBB67B]">
                <Info size={12} /> Sugerencias
              </span>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <span
                    key={occ}
                    className="px-3 py-1 bg-[#E5DBD6] border border-[#C3C9C0]/30 text-[9px] uppercase tracking-widest text-[#2C3729]"
                  >
                    {occ}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#C3C9C0] italic">
                Ideal con: {outfits.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dentro de la Caja ──────────────────────────────────────────────── */}
      <section className="mt-20 border-y border-[#C3C9C0]/15 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-[0.6em] text-[#CBB67B]">
                El Ritual de Desempaque
              </span>
              <h2 className="text-3xl font-display text-[#2C3729] italic">
                Dentro de la Caja
              </h2>
              <p className="text-sm text-[#2C3729]/65 leading-relaxed font-light">
                Cada pieza llega en un ecosistema diseñado para proteger su alma y exaltar su belleza.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Box, title: "Empaque de Lujo", desc: "Estuche rígido forrado en seda hueso con interiores de terciopelo verde." },
                { icon: ClipboardCheck, title: "Certificado", desc: "Documento seriado que avala el material, quilataje y carácter único." },
                { icon: Truck, title: "Envíos Asegurados", desc: "Logística de alta seguridad con rastreo en tiempo real." },
                { icon: ShieldCheck, title: "Garantía Vitalicia", desc: "Mantenimiento anual incluido para miembros de The Circle." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 p-4 border border-[#C3C9C0]/15 hover:border-[#CBB67B]/30 transition-colors"
                >
                  <Icon className="text-[#CBB67B]" size={20} strokeWidth={1} />
                  <h3 className="text-[10px] uppercase tracking-widest text-[#2C3729] font-medium">
                    {title}
                  </h3>
                  <p className="text-[11px] text-[#C3C9C0] leading-relaxed font-light">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#CBB67B]/70">
              Galería del Empaque
            </span>
            <EmpaqueCarousel
              aspectClass="aspect-[4/3]"
              className="border border-[#C3C9C0]/15"
            />
          </div>
        </div>
      </section>

      {/* ── El Ritual del Atuendo ──────────────────────────────────────────── */}
      <section className="mt-16 bg-[#2C3729] text-[#E5DBD6] p-8 md:p-16 lg:p-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#CBB67B]">
              Armonía de Estilo
            </span>
            <h2 className="text-4xl md:text-5xl font-display leading-tight italic">
              El Ritual del Atuendo
            </h2>
            <p className="text-base font-light text-[#E5DBD6]/65 leading-relaxed max-w-md">
              Nuestro curador ha analizado la caída de la luz sobre el metal y sugiere portar
              esta pieza con texturas orgánicas. Ideal para un vestido de seda cruda o un traje
              de lino minimalista.
            </p>
            <div className="flex flex-wrap gap-2">
              {outfits.map((outfit) => (
                <span
                  key={outfit}
                  className="px-3 py-1.5 border border-[#CBB67B]/30 text-[9px] uppercase tracking-widest text-[#CBB67B]"
                >
                  {outfit}
                </span>
              ))}
            </div>
          </div>
          <div>
            <EmpaqueCarousel
              aspectClass="aspect-square"
              className="border border-[#E5DBD6]/10"
              showDots={false}
            />
          </div>
        </div>
      </section>
    </>
  );

  return wrapper(body);
};

export default ProductPDPPreview;
