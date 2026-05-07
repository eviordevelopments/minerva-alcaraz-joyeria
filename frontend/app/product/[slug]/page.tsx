"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../components/Header";
import { FAQSection } from "../../../components/FAQSection";
import { LuxuryButton } from "../../../components/DesignSystem";
import { ShoppingBag, Heart, Ruler, Info, Gift, Box, MessageCircle } from "lucide-react";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Mock product data based on prompt requirements
  const product = {
    name: "Anillo Luna de Plata",
    sku: "MA-AN-001-LUNA",
    price: "$1,200 USD",
    category: "Plata .925",
    narrative: "Donde la tierra susurra secretos de eternidad a través del cristal.",
    meaning: "El Anillo Luna no es solo metal; es un talismán de serenidad. Inspirado en el reflejo de la luna sobre el agua quieta de los cenotes, simboliza la intuición y el renacimiento cíclico. Cada golpe de martillo en su superficie captura una fracción de luz que solo pertenece a quien lo porta.",
    details: {
      material: "Plata Esterlina .925 con acabado artesanal",
      weight: "8.5 gramos",
      gemstone: "Piedra de Luna de origen ético",
      origin: "Taxco, Guerrero - Taller Minerva Alcaraz"
    },
    isUnique: true,
    isSoldOut: false,
    outfits: ["Vestido de seda blanco", "Traje de lino crudo", "Atuendo de noche minimalista"],
    occasions: ["Renacimiento Personal", "Compromiso Eterno", "Gala Minimalista"]
  };

  return (
    <main className="min-h-screen bg-hueso-seda arousal-low">
      <Header />
      
      <div className="pt-24 md:pt-32 px-8 md:px-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. Carousel & Images (Lifestyle & Studio) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Vertical Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-plata-niebla/20 border border-transparent hover:border-oro-antiguo cursor-pointer transition-all" />
              ))}
            </div>
            
            {/* Main Image Viewport (Lifestyle/Studio) */}
            <div className="flex-1 relative aspect-[3/4] bg-plata-niebla/10 rounded-none overflow-hidden group cursor-zoom-in">
              <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.3em] opacity-30 uppercase">
                Imagen Lifestyle Principal
              </div>
              {/* AI 3D Scan Button */}
              <button className="absolute bottom-6 right-6 bg-hueso-seda/80 backdrop-blur-md px-4 py-2 text-[8px] tracking-widest uppercase border border-verde-ebano/20 flex items-center gap-2 hover:bg-verde-ebano hover:text-hueso-seda transition-all">
                <Box size={12} /> Escaneo RV 3D
              </button>
            </div>
          </div>

          {/* 2. Discovery Hierarchy: Details & Purchase */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-display text-verde-ebano">{product.name}</h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xl text-verde-ebano">{product.price}</span>
                <span className="text-[8px] tracking-widest text-plata-niebla uppercase">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Narrative Sub-header */}
            <p className="text-sm italic text-verde-ebano/70 font-light border-l border-oro-antiguo pl-4 py-1">
              "{product.narrative}"
            </p>

            {/* Size Selector & Guide */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest">Seleccionar Talla</span>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-plata-niebla hover:text-oro-antiguo transition-colors"
                >
                  <Ruler size={14} /> Guía de Tallas Interactiva
                </button>
              </div>
              <div className="flex gap-2">
                {["5", "6", "7", "8", "9"].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border flex items-center justify-center text-xs transition-all ${selectedSize === size ? 'border-verde-ebano bg-verde-ebano text-hueso-seda' : 'border-plata-niebla/30 hover:border-oro-antiguo'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                disabled={product.isSoldOut}
                className="w-full py-4 bg-bosque-profundo text-hueso-seda text-xs uppercase tracking-[0.3em] hover:bg-verde-ebano transition-all flex items-center justify-center gap-3 disabled:bg-plata-niebla disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} /> 
                {product.isSoldOut ? "Pieza Agotada" : "Añadir a la Bolsa"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-4 border border-verde-ebano text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-hueso-seda/50 transition-all">
                  <Heart size={14} /> Favoritos
                </button>
                <button className="py-4 border border-verde-ebano text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-hueso-seda/50 transition-all">
                   THE CIRCLE
                </button>
              </div>
            </div>

            {/* 3. Poetic Meaning (Hierarchical Reveal) */}
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-oro-antiguo">El Significado</span>
                  <div className="h-[1px] flex-1 bg-oro-antiguo/20" />
                </div>
                <p className="text-sm leading-relaxed text-verde-ebano/80 font-light">
                  {product.meaning}
                </p>
              </div>

              {/* Technical Details (Accordion-style implied) */}
              <div className="flex flex-col gap-4 bg-plata-niebla/5 p-6 border-l-2 border-oro-antiguo">
                <span className="text-[10px] uppercase tracking-widest text-verde-ebano">Ficha Técnica</span>
                <div className="grid grid-cols-2 gap-y-4 text-[10px] uppercase tracking-wider opacity-70">
                  <span className="text-plata-niebla">Material</span>
                  <span>{product.details.material}</span>
                  <span className="text-plata-niebla">Peso</span>
                  <span>{product.details.weight}</span>
                  <span className="text-plata-niebla">Piedra</span>
                  <span>{product.details.gemstone}</span>
                  <span className="text-plata-niebla">Origen</span>
                  <span>{product.details.origin}</span>
                </div>
              </div>
            </div>

            {/* AI Recommendations: Outfits & Occasions */}
            <div className="mt-8 flex flex-col gap-6 border-t border-plata-niebla/20 pt-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-oro-antiguo">
                  <Info size={14} /> Sugerencias de IA
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.occasions.map((occ) => (
                    <span key={occ} className="px-3 py-1 bg-hueso-seda border border-plata-niebla/20 text-[9px] uppercase tracking-widest text-verde-ebano">
                      {occ}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-plata-niebla italic">
                  Ideal con: {product.outfits.join(", ")}.
                </p>
              </div>
            </div>

            {/* Personalization & Ritual Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
               <button className="flex items-center gap-3 p-4 border border-plata-niebla/20 text-[10px] uppercase tracking-widest hover:border-oro-antiguo transition-all">
                 <Gift size={16} /> Enviar como Regalo
               </button>
               <button className="flex items-center gap-3 p-4 border border-plata-niebla/20 text-[10px] uppercase tracking-widest hover:border-oro-antiguo transition-all">
                 <MessageCircle size={16} /> Tarjeta Personalizada
               </button>
            </div>
          </div>
        </div>

        {/* 4. Complement the Ritual Section */}
        <section className="mt-48">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-display text-verde-ebano mb-4">Complementar el Ritual</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Basado en la armonía del diseño</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[3/4] bg-plata-niebla/10 rounded-none" />
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                  <span>Pieza Complementaria {i}</span>
                  <span className="text-plata-niebla">$850 USD</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FAQSection />

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8"
          >
            <div className="absolute inset-0 bg-verde-ebano/90 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-hueso-seda w-full max-w-4xl p-12 md:p-20 flex flex-col gap-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-8 right-8 text-verde-ebano hover:text-oro-antiguo transition-colors"
              >
                CERRAR
              </button>
              <h2 className="text-4xl font-display text-verde-ebano">Guía de Tallas Interactiva</h2>
              <div className="h-[400px] bg-plata-niebla/10 flex items-center justify-center border border-dashed border-plata-niebla">
                <span className="text-xs uppercase tracking-widest opacity-30">Contenido Interactivo de Medición</span>
              </div>
              <p className="text-sm text-verde-ebano/70 leading-relaxed max-w-2xl">
                Nuestro ritual de medición asegura que su pieza sea tan única como su portador. Si tiene dudas, nuestro concierge digital está disponible vía WhatsApp para asesoría personalizada.
              </p>
              <LuxuryButton className="w-fit">Contactar Concierge</LuxuryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
