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
// [TEMP] Selector de tipografía — solo para revisión del cliente
import { FontSelectorPanel } from "../components/FontSelectorPanel";

const ShortPhilosophySection = () => (
  <section className="w-full px-4 md:px-12 lg:px-24 py-12 md:py-20">
    <div className="border border-verde-ebano p-5 sm:p-8 md:p-12 lg:p-20 text-center max-w-[1440px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-verde-ebano mb-6 md:mb-10">Nuestra Filosofía</h2>
        <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl text-verde-ebano font-sans font-light leading-relaxed max-w-4xl mx-auto uppercase tracking-[0.05em] md:tracking-[0.1em]">
          &ldquo;TRANSFORMAMOS LA MATERIA EN MEMORIA. CADA JOYA ES UN VÍNCULO ANCESTRAL Y UN LEGADO ETERNO.&rdquo;
        </p>
        <span className="block mt-6 md:mt-10 text-[9px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] text-oro-antiguo font-sans uppercase">
          - Minerva Alcaraz
        </span>
        <div className="mt-8 md:mt-12">
          <Link href="/nuestra-historia">
            <LuxuryButton variant="primary">
              Descubrir Nuestra Historia
            </LuxuryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const LongPhilosophySection = () => (
  <section className="w-full px-4 md:px-12 lg:px-24 py-16 md:py-32">
    <div className="border border-verde-ebano p-5 sm:p-8 md:p-20 lg:p-32 text-center max-w-[1440px] mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-verde-ebano mb-8 md:mb-16">Nuestra Filosofía</h2>
        <p className="text-base sm:text-lg md:text-2xl lg:text-4xl text-verde-ebano font-sans font-light leading-relaxed max-w-5xl mx-auto uppercase tracking-[0.05em] md:tracking-[0.1em]">
          &ldquo;TRANSFORMAMOS LA MATERIA EN MEMORIA. CADA CREACIÓN ES UNA OBRA IRREPETIBLE, UN VÍNCULO ANCESTRAL QUE TRASCIENDE EL OBJETO PARA CONVERTIRSE EN UN LEGADO DE VALOR ETERNO.&rdquo;
        </p>
        <span className="block mt-8 md:mt-12 text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] text-oro-antiguo font-sans uppercase">
          - Minerva Alcaraz
        </span>
        <div className="mt-10 md:mt-20">
          <Link href="/nuestra-historia">
            <LuxuryButton variant="primary">
              Descubrir Nuestra Historia
            </LuxuryButton>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-hueso-seda">
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 hero-gradient">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hero-title-no-hyphens mt-20 md:mt-0 text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-oro-antiguo max-w-5xl leading-tight mb-8 px-2 text-center"
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

      <ShortPhilosophySection />

      {/* Collection Grid */}
      <CollectionGrid />

      {/* Catalog Section — top padding ensures clear separation from CollectionGrid on all screens */}
      <section className="w-full px-4 md:px-12 lg:px-24 pt-16 md:pt-24 pb-16 md:pb-24 bg-hueso-seda relative z-10">
        <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
          <span className="text-[10px] sm:text-sm md:text-base uppercase tracking-[0.3em] sm:tracking-[0.6em] text-verde-ebano/60 mb-3 md:mb-4">Catálogo Exclusivo</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-display text-verde-ebano mb-4 md:mb-6">Piezas Únicas &amp; Sets</h2>
          <p className="text-sm md:text-lg lg:text-xl text-verde-ebano/80 italic font-light max-w-2xl px-2">
            &ldquo;Descubre nuestra curaduría de objetos preciosos. Cada joya es una obra irrepetible. Adquiérela como pieza individual o completa tu legado con nuestros sets completos diseñados en perfecta armonía.&rdquo;
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Second Philosophy Section below Catalog */}
      <LongPhilosophySection />

      {/* [TEMP] Font Selector Panel — Revisión tipográfica para cliente */}
      <FontSelectorPanel />



      <FAQSection />

      <Footer />
    </main>
  );
}
