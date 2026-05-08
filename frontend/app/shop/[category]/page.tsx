"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProductCard } from "../../../components/DesignSystem";
import { SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";

interface CategoryData {
  title: string;
  subtitle: string;
  narrative: string;
}

const CATEGORY_MAP: Record<string, CategoryData> = {
  anillos: {
    title: "Círculos de Eternidad",
    subtitle: "Anillos",
    narrative: "Símbolos de compromiso con el presente y promesas que trascienden el tiempo. Cada anillo es una escultura minúscula diseñada para abrazar la mano con autoridad y gracia."
  },
  collares: {
    title: "Caídas de Luz",
    subtitle: "Collares",
    narrative: "Piezas que custodian el latido y enmarcan el rostro con destellos de metal precioso. Una oda a la elegancia que desciende sobre la piel como seda líquida."
  },
  pulseras: {
    title: "Vínculos de Oro",
    subtitle: "Pulseras",
    narrative: "El movimiento capturado en metal. Nuestras pulseras son gestos de elegancia que acompañan cada ademán, creando un diálogo entre la joya y el portador."
  },
  pendientes: {
    title: "Destellos del Alma",
    subtitle: "Pendientes",
    narrative: "Susurros de luz que iluminan el semblante. Diseñados para captar cada reflejo y convertirlo en un testimonio de maestría joyera."
  },
  sets: {
    title: "Sinfonías de Legado",
    subtitle: "Sets Completos",
    narrative: "La culminación de nuestra herencia. Conjuntos diseñados en perfecta armonía para quienes buscan una presencia total y unificada en el arte de la joyería."
  }
};

import { PRODUCTS, Product } from "../../../constants/products";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = React.use(params);
  const data = CATEGORY_MAP[category.toLowerCase()] || {
    title: category.toUpperCase(),
    subtitle: "Colección",
    narrative: "Explorando la maestría y el detalle en cada pieza de nuestra cofradía."
  };

  // Filter real products by category
  const products = PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      <section className="pt-48 pb-32 luxury-container">
        {/* Category Header - Striking Titles */}
        <div className="flex flex-col gap-8 mb-24 max-w-4xl">
          <span className="text-[10px] uppercase tracking-[1em] text-oro-antiguo">{data.subtitle}</span>
          <h1 className="text-6xl md:text-8xl font-display text-verde-ebano leading-none italic">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl font-light text-verde-ebano/60 leading-relaxed italic border-l border-oro-antiguo/30 pl-8">
            &quot;{data.narrative}&quot;
          </p>
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>

        {/* Intelligent Suggestion Banner */}
        <section className="mt-48 p-12 md:p-24 bg-verde-ebano text-hueso-seda relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
            <Sparkles className="text-oro-antiguo" size={32} strokeWidth={1} />
            <h2 className="text-4xl font-display uppercase tracking-widest italic">¿Busca una pieza irrepetible?</h2>
            <p className="text-sm font-light opacity-70 leading-relaxed uppercase tracking-widest">
              Nuestra IA ha seleccionado estas piezas para usted basándose en la armonía de su estilo.
            </p>
            <button className="px-12 py-4 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.4em] hover:bg-hueso-seda transition-all">
              Consultar al Oráculo
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 border border-oro-antiguo/10 rounded-full -mr-32 -mt-32" />
        </section>
      </section>

      <Footer />
    </main>
  );
}
