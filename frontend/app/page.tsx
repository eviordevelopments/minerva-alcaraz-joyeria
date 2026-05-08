"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { CollectionGrid } from "../components/CollectionGrid";
import { FAQSection } from "../components/FAQSection";
import { LuxuryButton, ProductCard } from "../components/DesignSystem";
import { Footer } from "../components/Footer";
import { useDesignSystem } from "../components/DesignSystemProvider";
import Link from "next/link";
import { PRODUCTS } from "../constants/products";

export default function Home() {
  const { mentalState } = useDesignSystem();

  return (
    <main className="min-h-screen bg-hueso-seda arousal-low">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ position: 'absolute' }}>
          <Image 
            src="/hero-section_image.JPG" 
            alt="Minerva Alcaraz Hero" 
            fill 
            className="object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
            priority
          />
          {/* Darker Overlay to ensure text pops */}
          <div className="absolute inset-0 bg-verde-ebano/50" />
        </div>

        {/* Narrative Overlay with Contrast Fix */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 hero-gradient">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-4xl md:text-7xl font-display text-oro-antiguo max-w-5xl leading-tight mb-8"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Donde el <span className="text-hueso-seda">arte</span> encuentra su <span className="text-hueso-seda">esencia</span> y la <span className="text-hueso-seda">eternidad</span> su <span className="text-hueso-seda">presencia</span>.
          </motion.h1>
          <LuxuryButton variant="primary" className="!bg-hueso-seda/10 !text-hueso-seda !border-hueso-seda hover:!bg-hueso-seda hover:!text-verde-ebano">
            Comenzar Experiencia
          </LuxuryButton>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-16 bg-hueso-seda/50" />
          <span className="text-[8px] text-hueso-seda uppercase tracking-[0.3em] opacity-50">Explorar</span>
        </motion.div>
      </section>

      {/* Narrative Section */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="border border-verde-ebano p-8 md:p-20 lg:p-32 text-center max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-display text-verde-ebano mb-16 tracking-[0.1em]">Nuestra Filosofía</h2>
            <p className="text-2xl md:text-4xl lg:text-5xl text-verde-ebano font-sans font-light leading-relaxed max-w-5xl mx-auto uppercase tracking-[0.1em]">
              "TRANSFORMAMOS LA MATERIA EN MEMORIA. CADA CREACIÓN ES UNA OBRA IRREPETIBLE, UN VÍNCULO ANCESTRAL QUE TRASCIENDE EL OBJETO PARA CONVERTIRSE EN UN LEGADO DE VALOR ETERNO."
            </p>
            <span className="block mt-12 text-[10px] md:text-xs tracking-[0.5em] text-oro-antiguo font-sans uppercase">
              - Minerva Alcaraz
            </span>
            <div className="mt-20">
              <Link href="/nuestra-historia">
                <LuxuryButton variant="primary">
                  Descubrir Nuestra Historia
                </LuxuryButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collection Grid */}
      <CollectionGrid />

      {/* Catalog Section */}
      <section className="w-full px-4 md:px-12 lg:px-24 py-24 bg-hueso-seda">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-sm md:text-base uppercase tracking-[0.6em] text-verde-ebano/60 mb-4">Catálogo Exclusivo</span>
          <h2 className="text-5xl md:text-7xl font-display text-verde-ebano mb-6">Piezas Únicas & Sets</h2>
          <p className="text-lg md:text-xl text-verde-ebano/80 italic font-light max-w-2xl">
            "Descubra nuestra curaduría de objetos preciosos. Cada joya es una obra irrepetible. Adquiérala como pieza individual o complete su legado con nuestros sets completos diseñados en perfecta armonía."
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Floating Action Button (WhatsApp - Mobile First) */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-verde-ebano rounded-full flex items-center justify-center text-oro-antiguo shadow-2xl border border-oro-antiguo/20"
          title="Asesoría Personalizada"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 7.6 10.6Z" />
            <path d="M15 10l-4 4 6 6" />
          </svg>
        </motion.button>
      </div>

      <FAQSection />

      <Footer />
    </main>
  );
}
