"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "../../components/Header";
import { FAQSection } from "../../components/FAQSection";
import { Footer } from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";

const CollectionCard = ({ title, description, image, align = "left", theme = "bone" }: { title: string, description: string, image: string, align?: "left" | "right", theme?: "bone" | "green" | "gold" }) => {
  const themeStyles = {
    bone: {
      bg: "bg-hueso-seda",
      textMain: "text-verde-ebano",
      textSub: "text-verde-ebano/80",
      button: "border-verde-ebano text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda"
    },
    green: {
      bg: "bg-verde-ebano",
      textMain: "text-oro-antiguo",
      textSub: "text-hueso-seda/80",
      button: "border-oro-antiguo text-oro-antiguo hover:bg-oro-antiguo hover:text-verde-ebano"
    },
    gold: {
      bg: "bg-oro-antiguo",
      textMain: "text-verde-ebano",
      textSub: "text-verde-ebano/90",
      button: "border-verde-ebano text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda"
    }
  }[theme];

  return (
    <section className={`w-full ${themeStyles.bg}`}>
      <div className={`flex flex-col ${align === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-stretch min-h-[80vh]`}>
        {/* Imagen Esquinada */}
        <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-full bg-plata-niebla/10 group overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-verde-ebano/5 group-hover:bg-transparent transition-colors duration-700" />
        </div>
        
        {/* Contenido Narrativo */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center gap-8 p-12 md:p-24 lg:p-32 ${themeStyles.textMain}`}>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.8em] opacity-60">Narrativa de Marca</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display leading-tight italic uppercase">{title}</h2>
          <p className={`text-base md:text-xl lg:text-2xl leading-loose font-light max-w-xl italic ${themeStyles.textSub}`}>
            &quot;{description}&quot;
          </p>
          <Link 
            href={`/shop?collection=${encodeURIComponent(title)}`} 
            className={`w-fit mt-8 text-[10px] uppercase tracking-[0.4em] py-6 px-12 border transition-all inline-block ${themeStyles.button}`}
          >
            Explorar el Legado
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function CollectionsPage() {
  const collections = [
    {
      title: "Diseños de Autor",
      description: "La cumbre de la expresión artística de Minerva Alcaraz. Piezas escultóricas que desafían la joyería convencional, nacidas de una visión pura y sin compromisos.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-51.JPG",
      theme: "bone" as const
    },
    {
      title: "Escencia",
      description: "Un viaje al corazón del misticismo mexicano. Los Milagritos transformados en reliquias de oro y plata, portadores de fe, esperanza y devoción eterna.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg",
      align: "right" as const,
      theme: "green" as const
    },
    {
      title: "Chai",
      description: "Celebración de la vitalidad y el número 18. Líneas fluidas y grabados ancestrales que honran el flujo constante de la vida en todas sus formas.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275631/minerva_joyeria/products/chai/CHAI-21.jpg",
      theme: "gold" as const
    },
    {
      title: "Serpientes",
      description: "Símbolo de renovación perpetua. La serpiente que muda su piel es el eco de nuestra propia capacidad de transformación y sabiduría interior.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275755/minerva_joyeria/products/serpientes/SMA_MINERVA-102.jpg",
      align: "right" as const,
      theme: "bone" as const
    },
    {
      title: "Piezas Únicas",
      description: "Objetos de deseo irrepetibles. Piedras seleccionadas por su alma y monturas forjadas para jamás ser replicadas. Una joya que solo pertenece a un portador.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg",
      theme: "green" as const
    },
    {
      title: "Etérea",
      description: "Minimalismo que roza lo divino. Formas que parecen levitar y capturar la luz del viento, diseñadas para elevar la esencia de quien las porta.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-3.JPG",
      align: "right" as const,
      theme: "gold" as const
    },
    {
      title: "Ecos de la Tierra",
      description: "La geología convertida en arte táctil. Texturas brutales y formas orgánicas que resuenan con la fuerza primordial de nuestro planeta.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4318.JPG",
      theme: "bone" as const
    },
    {
      title: "Floral",
      description: "La botánica mexicana preservada en metales preciosos. Un jardín eterno donde la fragilidad de la naturaleza se vuelve inmortalidad.",
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280270/minerva_joyeria/products/floral/Coleccio_n_3_3.jpg",
      align: "right" as const,
      theme: "green" as const
    }
  ];

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 md:pt-48 pb-24 luxury-container border-b border-verde-ebano/10">
        <div className="flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] md:text-xs uppercase tracking-[1em] text-verde-ebano/40 mb-6"
          >
            Antología del Diseño
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display text-verde-ebano uppercase"
          >
            Colecciones
          </motion.h1>
          <p className="mt-8 text-xs md:text-sm uppercase tracking-[0.4em] text-verde-ebano/60 max-w-2xl leading-loose">
            Cada colección es un capítulo en la historia de Minerva Alcaraz. Explore los diferentes universos que componen nuestro legado artístico.
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {collections.map((col, idx) => (
          <CollectionCard key={idx} {...col} />
        ))}
      </div>

      <FAQSection />
      <Footer />
    </main>
  );
}
