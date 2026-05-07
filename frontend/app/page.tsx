"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { CollectionGrid } from "../components/CollectionGrid";
import { FAQSection } from "../components/FAQSection";
import { LuxuryButton } from "../components/DesignSystem";
import { useDesignSystem } from "../components/DesignSystemProvider";

export default function Home() {
  const { mentalState } = useDesignSystem();

  return (
    <main className="min-h-screen bg-hueso-seda arousal-low">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-section_image.JPG" 
            alt="Minerva Alcaraz Hero" 
            fill 
            className="object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
            priority
          />
          {/* Subtle Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-verde-ebano/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="text-7xl md:text-9xl mb-4 font-display tracking-widest text-oro-antiguo drop-shadow-2xl">
              Eternidad
            </h1>
            <p className="text-hueso-seda text-sm md:text-lg uppercase tracking-[0.5em] mb-12 font-light opacity-90">
              Diseño para la Emoción
            </p>
            <LuxuryButton variant="primary" className="!bg-hueso-seda/10 !text-hueso-seda !border-hueso-seda hover:!bg-hueso-seda hover:!text-verde-ebano">
              Comenzar Experiencia
            </LuxuryButton>
          </motion.div>
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
      <section className="py-32 px-8 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xs uppercase tracking-[0.6em] text-plata-niebla mb-8">Nuestra Filosofía</h2>
          <p className="text-2xl md:text-3xl text-verde-ebano font-light leading-relaxed">
            "No vendemos objetos, vendemos herencia y simbolismo. Cada pieza es una obra de arte con una ficha técnica emocional."
          </p>
        </motion.div>
      </section>

      {/* Collection Grid */}
      <CollectionGrid />

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

      <footer className="bg-authority py-32 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl tracking-[0.3em] font-display mb-8">THE CIRCLE</div>
            <p className="opacity-70 text-sm max-w-sm leading-loose">
              Únase a nuestra comunidad exclusiva para recibir acceso anticipado a colecciones cápsula y servicios de preservación de tesoros.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 text-oro-antiguo">Explorar</h4>
            <ul className="flex flex-col gap-4 text-xs opacity-50 tracking-widest">
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Colecciones</a></li>
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Atelier</a></li>
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Personalizados</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 text-oro-antiguo">Soporte</h4>
            <ul className="flex flex-col gap-4 text-xs opacity-50 tracking-widest">
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Guía de Tallas</a></li>
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Ritual de Cuidado</a></li>
              <li><a href="#" className="hover:text-oro-antiguo transition-colors nav-link">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-32 pt-8 border-t border-hueso-seda/10 text-center text-[8px] uppercase tracking-[0.4em] opacity-30">
          Minerva Alcaraz Joyería &copy; 2026 | Desarrollado por E-vior Developments
        </div>
      </footer>
    </main>
  );
}
