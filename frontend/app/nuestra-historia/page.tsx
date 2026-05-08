"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import Image from "next/image";

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      {/* Hero: El Origen de la Luz */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-verde-ebano">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-[url('/story_hero.jpg')] bg-cover bg-center grayscale mix-blend-overlay scale-105 animate-slow-zoom" />
        </div>
        <div className="relative z-10 text-center px-8">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-oro-antiguo text-[10px] uppercase tracking-[0.8em] mb-8 block"
          >
            Una Herencia Viva
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-hueso-seda text-6xl md:text-8xl lg:text-9xl font-display leading-tight italic"
          >
            Nuestra Historia
          </motion.h1>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
           <div className="w-[1px] h-24 bg-oro-antiguo/30 origin-top animate-scale-y" />
        </div>
      </section>

      {/* Section 1: La Raíz Ancestral */}
      <section className="py-32 md:py-48 luxury-container grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] bg-plata-niebla/10 overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.4em] opacity-30 p-12 text-center">
            Fotografía Documental:<br/>Talleres de Taxco y Raíces de Zacatecas
          </div>
          {/* <Image src="/story_roots.webp" alt="Raíces" fill className="object-cover" /> */}
        </motion.div>
        <div className="flex flex-col gap-12">
          <span className="text-oro-antiguo text-[10px] uppercase tracking-[0.6em]">El Origen</span>
          <h2 className="text-4xl md:text-6xl font-display text-verde-ebano italic">La Materia que Respira</h2>
          <p className="text-lg md:text-xl text-verde-ebano/80 font-light leading-loose italic">
            "Mi historia no comienza en un boceto, sino en el murmullo del metal siendo transformado por el fuego en los antiguos talleres de México. Crecí entre el polvo de plata de Taxco y la luz dorada de Zacatecas, aprendiendo que una joya no es un adorno, sino un recipiente de la memoria."
          </p>
          <p className="text-sm md:text-base text-verde-ebano/70 leading-relaxed font-sans max-w-lg">
            Para Minerva Alcaraz, la joyería es un ejercicio de arqueología emocional. Cada técnica utilizada —desde la filigrana más delicada hasta el martillado más rudo— es una conversación con las manos de quienes nos precedieron.
          </p>
        </div>
      </section>

      {/* Section 2: El Ritual de Creación */}
      <section className="bg-verde-ebano py-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-hueso-seda/5" />
        <div className="luxury-container relative z-10 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-oro-antiguo text-[10px] uppercase tracking-[0.8em] mb-12"
          >
            Artesanía Pura
          </motion.span>
          <h2 className="text-hueso-seda text-5xl md:text-7xl lg:text-8xl font-display mb-16 italic">El Silencio del Martillo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mt-12">
            {[
              { title: "Inspiración", desc: "El momento donde el concepto se encuentra con la intuición." },
              { title: "Forjado", desc: "Transformación física del metal bajo el calor y la voluntad." },
              { title: "Alma", desc: "La pieza finalizada, lista para iniciar su propio legado." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-12 h-12 rounded-full border border-oro-antiguo/30 flex items-center justify-center text-oro-antiguo font-display italic text-xl">
                  {i + 1}
                </div>
                <h3 className="text-hueso-seda text-sm uppercase tracking-[0.4em]">{step.title}</h3>
                <p className="text-hueso-seda/60 text-xs font-light max-w-[200px] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: El Manifiesto de la Eternidad */}
      <section className="py-48 luxury-container">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-12">
           <span className="text-oro-antiguo text-[10px] uppercase tracking-[0.6em]">Nuestra Visión</span>
           <h2 className="text-5xl md:text-7xl font-display text-verde-ebano leading-tight italic">
             "Crear objetos que el tiempo no pueda borrar, sino enriquecer."
           </h2>
           <p className="text-base md:text-lg text-verde-ebano/70 font-sans leading-loose max-w-2xl mx-auto">
             En un mundo que celebra lo efímero, Minerva Alcaraz apuesta por la permanencia. No diseñamos para temporadas; diseñamos para generaciones. Cada pieza es una promesa de eternidad, un vínculo que une el pasado con el futuro a través de la belleza absoluta de la artesanía mexicana de alto nivel.
           </p>
           <div className="mt-8 flex justify-center">
             <div className="w-32 h-[1px] bg-oro-antiguo" />
           </div>
        </div>
      </section>

      {/* Section 4: Galería de Intención */}
      <section className="pb-48 luxury-container grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 0.98 }}
            className="aspect-square bg-plata-niebla/10 flex items-center justify-center text-[8px] uppercase tracking-widest opacity-20 border border-verde-ebano/5"
          >
            Detalle de Taller {i}
          </motion.div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
