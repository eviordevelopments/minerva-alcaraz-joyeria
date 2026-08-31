"use client";

import React from "react";
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
import { HeroSection } from "../components/HeroSection";

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
          &ldquo;CREAMOS PARA QUE PUEDAS EXPRESAR LO QUE SIENTES. CADA PIEZA ES UNA FORMA DE AMOR, IDENTIDAD Y CONEXIÓN CON QUIENES MÁS IMPORTAN.&rdquo;
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
        <p className="text-base sm:text-lg md:text-2xl lg:text-4xl text-verde-ebano font-sans font-light leading-relaxed max-w-5xl mx-auto uppercase tracking-[0.05em] md:tracking-[0.1em]">
          &ldquo;CREEMOS QUE LA JOYERÍA ES UNA FORMA ESENCIAL DE CONEXIÓN Y EXPRESIÓN PERSONAL. CADA PIEZA QUE CREAMOS NACE DE UN PROCESO ARTESANAL COMPARTIDO, ELABORADA ENTRE NOSOTROS Y TÚ.&rdquo;
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
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const { products } = await res.json();
          setFeaturedProducts((products || []).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      {/* Hero Section */}
      <HeroSection />

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
        
        {isLoading ? (
           <div className="w-full flex justify-center py-20 text-xs uppercase tracking-widest text-verde-ebano/50">Cargando catálogo...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Second Philosophy Section below Catalog */}
      <LongPhilosophySection />

      <FAQSection />

      <Footer />
    </main>
  );
}
