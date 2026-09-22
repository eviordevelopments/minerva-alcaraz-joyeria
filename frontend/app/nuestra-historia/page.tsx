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
          <div className="w-full h-full bg-[url('/taller/1.jpg')] bg-cover bg-center grayscale mix-blend-overlay scale-105 animate-slow-zoom" />
        </div>
        <div className="relative z-10 text-center px-8 pt-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-oro-antiguo text-xs uppercase tracking-[0.8em] mb-8 block"
          >
            Una Herencia Viva
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-hueso-seda text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display leading-tight italic"
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
          <Image src="/taller/2.jpg" alt="Raíces" fill className="object-cover" />
        </motion.div>
        <div className="flex flex-col gap-12">
          <span className="text-oro-antiguo text-xs uppercase tracking-[0.6em]">El Origen</span>
          <h2 className="text-4xl md:text-6xl font-display text-verde-ebano italic">La Materia que Respira</h2>
          <div className="flex flex-col gap-6 max-w-xl text-base text-verde-ebano/80 leading-relaxed font-sans font-light">
            <p className="text-lg md:text-xl text-verde-ebano font-light leading-loose italic mb-2">
              "MI HISTORIA NO COMENZÓ CON LA CERTEZA DE SER JOYERA, SINO CON EL DESCUBRIMIENTO DE QUE CREAR CON MIS MANOS SE SENTÍA NATURAL EN MÍ."
            </p>
            <p>
              En San Miguel de Allende entendí que la joyería era mi manera de transmutar, que una joya puede ser mucho más que un objeto; es una forma de hablar sin palabras.
            </p>
            <p>
              Han pasado diez años de aprender y experimentar, dando vida a la manera en que observo mí entorno y percibo la belleza: imperfecta, sensible y profundamente conectada con lo esencial.
            </p>
            <p>
              La joyería me concede el honor de trabajar con mis manos un pequeño fragmento de la tierra, sentir su vida a través del metal y las piedras. Porque la tierra guarda historias. Y nuestras manos pueden darles forma.
            </p>
            <p>
              He aprendido que una joya nunca termina cuando sale del taller, comienza cuando encuentra a la persona para quien fue creada. Porque, al final, crear una joya es tocar la historia de alguien y darle un lugar donde perdurar. Ahí es cuando la materia continúa: en un amor, un vínculo, una identidad, un recuerdo o un momento que merece permanecer. Se convierte en algo íntimo, tangible y profundamente personal.
            </p>
            <p>
              Eso es lo que más amo de hacer joyería: transformar la materia con mis manos y después tener el privilegio de verla formar parte de la vida de alguien más.
            </p>
            <p>
              Para mí, cada pieza es un acto de conexión: entre la materia y la emoción; entre lo que la tierra nos ofrece y aquello que llevamos dentro. Es mi manera de hacer tangible lo que sentimos, de celebrar quiénes somos y de dejar una pequeña huella de nuestra historia en el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: El Ritual de Creación */}
      <section className="bg-verde-ebano py-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-hueso-seda/5" />
        <div className="luxury-container relative z-10 flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-oro-antiguo text-xs uppercase tracking-[0.8em] mb-12"
          >
            Artesanía Pura
          </motion.span>
          <h2 className="text-hueso-seda text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display mb-16 italic">El Silencio del Martillo</h2>
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
                <h3 className="text-hueso-seda text-base uppercase tracking-[0.4em]">{step.title}</h3>
                <p className="text-hueso-seda/60 text-sm font-light max-w-[200px] leading-relaxed">
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
           <span className="text-oro-antiguo text-xs uppercase tracking-[0.6em]">Nuestra Visión</span>
           <h2 className="text-5xl md:text-7xl font-display text-verde-ebano leading-tight italic">
             "Convertir la esencia en joyas que expresen, conecten y trasciendan"
           </h2>
           <p className="text-base md:text-lg text-verde-ebano/70 font-sans leading-loose max-w-2xl mx-auto">
             En Minerva Alcaraz no diseñamos para temporadas. Cada pieza nace de un proceso artesanal cuidadoso, elaborada para acompañarte en tu historia. Trabajamos piezas únicas para crear diseños que reflejen quién eres y conecten con lo que más te importa.
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
            className="relative aspect-square bg-plata-niebla/10 overflow-hidden group border border-verde-ebano/5"
          >
            <Image 
              src={`/taller/${i}.jpg`} 
              alt={`Detalle de Taller ${i}`} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </motion.div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
