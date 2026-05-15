"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../components/Header";
import { FAQSection } from "../../../components/FAQSection";
import { Footer } from "../../../components/Footer";
import { LuxuryButton, ProductCard } from "../../../components/DesignSystem";
import { ShoppingBag, Heart, Ruler, Info, Gift, Box, MessageCircle, Share2, ClipboardCheck, Truck, BookOpen, ShieldCheck } from "lucide-react";
import { useDesignSystem } from "../../../components/DesignSystemProvider";
import Image from "next/image";

import { PRODUCTS, Product } from "../../../constants/products";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { setIsCartOpen } = useDesignSystem();
  const [selectedSize, setSelectedSize] = useState("");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Find real product by ID
  const product = PRODUCTS.find(p => p.id === slug) || PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-hueso-seda arousal-low">
      <Header />
      
      <div className="pt-40 md:pt-56 px-8 md:px-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 1. Carousel & Images (Dynamic Gallery) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Vertical Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-24">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-[3/4] bg-plata-niebla/20 border cursor-pointer relative overflow-hidden transition-all ${selectedImage === idx ? 'border-oro-antiguo' : 'border-transparent hover:border-oro-antiguo/30'}`}
                >
                  <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            
            {/* Main Image Viewport */}
            <div className="flex-1 relative aspect-[3/4] bg-plata-niebla/10 rounded-none overflow-hidden group cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={product.images[selectedImage]} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* AI 3D Scan Button */}
              <button className="absolute bottom-6 right-6 bg-hueso-seda/80 backdrop-blur-md px-4 py-2 text-[8px] tracking-widest uppercase border border-verde-ebano/20 flex items-center gap-2 hover:bg-verde-ebano hover:text-hueso-seda transition-all shadow-lg">
                <Box size={12} /> Realidad Virtual 360°
              </button>
            </div>
          </div>

          {/* 2. Discovery Hierarchy: Details & Purchase */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Colección {product.collection}</span>
                <span className="px-2 py-0.5 border border-oro-antiguo text-[8px] uppercase tracking-widest text-oro-antiguo bg-oro-antiguo/5">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display text-verde-ebano">{product.name}</h1>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xl text-verde-ebano">${product.price.toLocaleString()} {product.currency}</span>
                <span className="text-[8px] tracking-widest text-plata-niebla uppercase">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Narrative Sub-header */}
            <p className="text-sm italic text-verde-ebano/70 font-light border-l border-oro-antiguo pl-4 py-1">
              &quot;{product.description}&quot;
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
                onClick={() => setIsCartOpen(true)}
                disabled={product.stock === 0}
                className="w-full py-4 bg-bosque-profundo text-hueso-seda text-xs uppercase tracking-[0.3em] hover:bg-verde-ebano transition-all flex items-center justify-center gap-3 disabled:bg-plata-niebla disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} /> 
                {product.stock === 0 ? "Pieza Agotada" : "Añadir a la Bolsa"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`py-4 border border-verde-ebano text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${isFavorite ? "text-oro-antiguo border-oro-antiguo bg-hueso-seda/20" : "hover:bg-hueso-seda/50 text-verde-ebano"}`}
                >
                  <Heart size={14} className={isFavorite ? "fill-oro-antiguo" : ""} /> Favoritos
                </button>
                <button 
                  onClick={() => setIsAlbumModalOpen(true)}
                  className="py-4 border border-verde-ebano text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-hueso-seda/50 transition-all text-verde-ebano"
                >
                   <BookOpen size={14} /> Añadir al Álbum
                </button>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4 bg-plata-niebla/5 p-6 border-l-2 border-oro-antiguo">
                <span className="text-[10px] uppercase tracking-widest text-verde-ebano">Detalle Técnico</span>
                <div className="grid grid-cols-2 gap-y-4 text-[10px] uppercase tracking-wider opacity-70">
                  <span className="text-plata-niebla">Material</span>
                  <span>{product.materials.join(", ")}</span>
                  <span className="text-plata-niebla">Estilo</span>
                  <span>{product.metadata?.style || "Clásico Atemporal"}</span>
                </div>
              </div>

              {/* 4. Poetic Meaning (Gradual Discovery Step 2) */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-oro-antiguo">El Significado</span>
                  <div className="h-[1px] flex-1 bg-oro-antiguo/20" />
                </div>
                <p className="text-sm leading-relaxed text-verde-ebano/80 font-light">
                  {product.significado || "Una pieza diseñada para habitar en la eternidad, capturando la esencia de la herencia y el arte joyero."}
                </p>
              </div>
            </div>

            {/* AI Recommendations: Outfits & Occasions */}
            <div className="mt-8 flex flex-col gap-6 border-t border-plata-niebla/20 pt-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-oro-antiguo">
                  <Info size={14} /> Sugerencias de IA
                </span>
                <div className="flex flex-wrap gap-2">
                  {(product.occasions || product.metadata?.occasion || ["Gala", "Ritual", "Legado"]).map((occ) => (
                    <span key={occ} className="px-3 py-1 bg-hueso-seda border border-plata-niebla/20 text-[9px] uppercase tracking-widest text-verde-ebano">
                      {occ}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-plata-niebla italic">
                  Ideal con: {(product.outfits || ["Seda Cruda", "Lino Minimalista", "Texturas Orgánicas"]).join(", ")}.
                </p>
              </div>
            </div>

            {/* Personalization & Ritual Options (Old buttons replaced by new ones in action section) */}
          </div>
        </div>

        {/* Inside the Box & Authenticity */}
        <section className="mt-32 border-y border-plata-niebla/10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.6em] text-oro-antiguo">El Ritual de Desempaque</span>
                <h2 className="text-4xl font-display text-verde-ebano italic">Dentro de la Caja</h2>
                <p className="text-sm text-verde-ebano/70 leading-relaxed font-light">
                  Cada pieza de Minerva Alcaraz llega en un ecosistema diseñado para proteger su alma y exaltar su belleza.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4 p-6 border border-plata-niebla/10 hover:border-oro-antiguo/30 transition-colors">
                  <Box className="text-oro-antiguo" size={24} strokeWidth={1} />
                  <h3 className="text-xs uppercase tracking-widest text-verde-ebano font-medium">Empaque de Lujo</h3>
                  <p className="text-[13px] text-plata-niebla leading-relaxed font-light">Estuche rígido forrado en seda hueso con interiores de terciopelo verde.</p>
                </div>
                <div className="flex flex-col gap-4 p-6 border border-plata-niebla/10 hover:border-oro-antiguo/30 transition-colors">
                  <ClipboardCheck className="text-oro-antiguo" size={24} strokeWidth={1} />
                  <h3 className="text-xs uppercase tracking-widest text-verde-ebano font-medium">Certificado de Autenticidad</h3>
                  <p className="text-[13px] text-plata-niebla leading-relaxed font-light">Documento seriado que avala el material, quilataje y carácter único de la pieza.</p>
                </div>
                <div className="flex flex-col gap-4 p-6 border border-plata-niebla/10 hover:border-oro-antiguo/30 transition-colors">
                  <Truck className="text-oro-antiguo" size={24} strokeWidth={1} />
                  <h3 className="text-xs uppercase tracking-widest text-verde-ebano font-medium">Envíos Asegurados</h3>
                  <p className="text-[13px] text-plata-niebla leading-relaxed font-light">Logística de alta seguridad con rastreo en tiempo real y entrega bajo firma.</p>
                </div>
                <div className="flex flex-col gap-4 p-6 border border-plata-niebla/10 hover:border-oro-antiguo/30 transition-colors">
                  <ShieldCheck className="text-oro-antiguo" size={24} strokeWidth={1} />
                  <h3 className="text-xs uppercase tracking-widest text-verde-ebano font-medium">Garantía Vitalicia</h3>
                  <p className="text-[13px] text-plata-niebla leading-relaxed font-light">Asistencia técnica y mantenimiento anual incluido para miembros de The Circle.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-plata-niebla/5 flex items-center justify-center border border-verde-ebano/5 overflow-hidden group">
               <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[10px] uppercase tracking-[0.8em] text-center p-12 pointer-events-none group-hover:opacity-10 transition-opacity">
                  Visualización del Packaging & Certificado<br/>(Render de Alta Resolución)
               </div>
               {/* Mock packaging image placeholder */}
               <div className="w-64 h-64 border border-oro-antiguo/20 relative flex items-center justify-center animate-pulse">
                  <div className="w-32 h-40 border border-oro-antiguo/40 transform -rotate-12 absolute -left-8 bg-hueso-seda shadow-xl" />
                  <div className="w-48 h-48 bg-verde-ebano shadow-2xl relative z-10 flex items-center justify-center">
                    <div className="w-12 h-12 border border-oro-antiguo/50 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 4. Complement the Ritual Section */}
        <section className="mt-48 border-t border-plata-niebla/10 pt-24">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-4xl font-display text-verde-ebano mb-4 italic">Complementar el Ritual</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla max-w-md">
              Piezas seleccionadas por nuestro atelier basándose en la armonía de proporciones y el flujo energético del diseño.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
            {relatedProducts.length === 0 && PRODUCTS.slice(0, 4).map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>

        {/* 5. AI Harmony Section */}
        <section className="mt-48 bg-verde-ebano text-hueso-seda p-12 md:p-24 lg:p-32 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <span className="text-[10px] uppercase tracking-[0.6em] text-oro-antiguo">Armonía de Estilo</span>
              <h2 className="text-5xl md:text-7xl font-display leading-tight italic">El Ritual del Atuendo</h2>
              <p className="text-lg md:text-xl font-light text-hueso-seda/70 leading-relaxed max-w-xl">
                Nuestro curador de IA ha analizado la caída de la luz sobre el metal y sugiere portar esta pieza con texturas orgánicas. Ideal para elevar un vestido de seda cruda o añadir autoridad a un traje de lino minimalista.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 border border-oro-antiguo text-[10px] uppercase tracking-widest text-oro-antiguo hover:bg-oro-antiguo hover:text-verde-ebano transition-all">
                  Explorar Outfits Sugeridos
                </button>
              </div>
            </div>
            <div className="aspect-square bg-hueso-seda/5 border border-hueso-seda/10 flex items-center justify-center relative group">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[10px] uppercase tracking-[0.8em] text-center p-12">
                Visualización de Armonía de IA<br/>(Detección de Texturas & Color)
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 border border-oro-antiguo/20 rounded-full flex items-center justify-center"
              >
                <div className="w-48 h-48 border border-oro-antiguo/40 rounded-full" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <FAQSection />

      {/* Size Guide Modal */}
      <AnimatePresence mode="wait">
        {isSizeGuideOpen && (
          <motion.div 
            key="size-guide-modal"
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
                className="absolute top-8 right-8 text-verde-ebano hover:text-oro-antiguo transition-colors text-[10px] uppercase tracking-widest"
              >
                CERRAR
              </button>
              <h2 className="text-4xl font-display text-verde-ebano italic">Guía de Tallas Interactiva</h2>
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

        {/* Gift Modal */}
        {isGiftModalOpen && (
          <motion.div key="gift-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-verde-ebano/90 backdrop-blur-sm" onClick={() => setIsGiftModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-hueso-seda w-full max-w-lg p-12 flex flex-col gap-6 shadow-2xl">
              <button onClick={() => setIsGiftModalOpen(false)} className="absolute top-6 right-6 text-verde-ebano text-[10px] uppercase tracking-widest">Cerrar</button>
              <h2 className="text-2xl font-display text-verde-ebano italic text-center">Enviar como Regalo</h2>
              <p className="text-xs text-verde-ebano/60 text-center uppercase tracking-widest">Su legado en manos de otro</p>
              <div className="flex flex-col gap-4 mt-4">
                <input type="text" placeholder="NOMBRE DEL DESTINATARIO" className="w-full p-4 bg-transparent border border-verde-ebano/20 text-[10px] tracking-widest outline-none focus:border-oro-antiguo" />
                <input type="text" placeholder="DIRECCIÓN DE ENTREGA" className="w-full p-4 bg-transparent border border-verde-ebano/20 text-[10px] tracking-widest outline-none focus:border-oro-antiguo" />
                <textarea placeholder="MENSAJE DE REGALO" className="w-full p-4 bg-transparent border border-verde-ebano/20 text-[10px] tracking-widest outline-none focus:border-oro-antiguo h-32" />
              </div>
              <LuxuryButton variant="secondary" className="w-full" onClick={() => setIsGiftModalOpen(false)}>Confirmar Envío Especial</LuxuryButton>
            </motion.div>
          </motion.div>
        )}

        {/* Card Modal */}
        {isCardModalOpen && (
          <motion.div key="card-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-verde-ebano/90 backdrop-blur-sm" onClick={() => setIsCardModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-hueso-seda w-full max-w-lg p-12 flex flex-col gap-6 shadow-2xl">
              <button onClick={() => setIsCardModalOpen(false)} className="absolute top-6 right-6 text-verde-ebano text-[10px] uppercase tracking-widest">Cerrar</button>
              <h2 className="text-2xl font-display text-verde-ebano italic text-center">Tarjeta Personalizada</h2>
              <p className="text-xs text-verde-ebano/60 text-center uppercase tracking-widest">Palabras que perduran</p>
              <div className="aspect-[16/9] border border-oro-antiguo/30 bg-hueso-seda p-8 flex flex-col items-center justify-center text-center gap-4 shadow-inner">
                <span className="text-[10px] uppercase tracking-[0.5em] text-oro-antiguo opacity-50">Minerva Alcaraz</span>
                <p className="text-sm font-light italic text-verde-ebano">"Sus palabras se grabarán aquí con tinta de caligrafía."</p>
              </div>
              <textarea placeholder="ESCRIBA SU MENSAJE..." className="w-full p-4 bg-transparent border border-verde-ebano/20 text-[10px] tracking-widest outline-none focus:border-oro-antiguo h-24" />
              <LuxuryButton className="w-full" onClick={() => setIsCardModalOpen(false)}>Guardar Mensaje</LuxuryButton>
            </motion.div>
          </motion.div>
        )}

        {/* Album Modal */}
        {isAlbumModalOpen && (
          <motion.div key="album-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-verde-ebano/90 backdrop-blur-sm" onClick={() => setIsAlbumModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative bg-hueso-seda w-full max-w-lg p-12 flex flex-col gap-6 shadow-2xl text-center">
              <button onClick={() => setIsAlbumModalOpen(false)} className="absolute top-6 right-6 text-verde-ebano text-[10px] uppercase tracking-widest">Cerrar</button>
              <BookOpen className="mx-auto text-oro-antiguo" size={32} strokeWidth={1} />
              <h2 className="text-2xl font-display text-verde-ebano italic">Mi Álbum de Legado</h2>
              <p className="text-xs text-verde-ebano/70 leading-relaxed">Esta pieza ha sido añadida a su colección personal. Podrá visualizarla y compararla en su panel de THE CIRCLE.</p>
              <div className="mt-4 flex flex-col gap-2">
                <LuxuryButton variant="primary" className="w-full">Ver mi Álbum</LuxuryButton>
                <button onClick={() => setIsAlbumModalOpen(false)} className="text-[10px] uppercase tracking-widest text-verde-ebano/40 hover:text-verde-ebano transition-colors mt-2">Continuar Explorando</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
