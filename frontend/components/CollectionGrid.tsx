"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CollectionItemProps {
  title: string;
  narrative: string;
  imagePath: string;
  size: "large" | "small" | "full";
  theme: "bone" | "green" | "gold" | "silver";
}

import Image from "next/image";

const CollectionItem: React.FC<CollectionItemProps> = ({ title, narrative, imagePath, size, theme }) => {
  const sizeClass = {
    large: "grid-item-large",
    small: "grid-item-small",
    full: "grid-item-full"
  }[size];

  const themeStyles = {
    bone: {
      bg: "bg-hueso-seda",
      overlay: "bg-hueso-seda/95",
      textMain: "text-verde-ebano",
      textSub: "text-verde-ebano/80",
      line: "bg-verde-ebano"
    },
    green: {
      bg: "bg-verde-ebano",
      overlay: "bg-verde-ebano/95",
      textMain: "text-oro-antiguo",
      textSub: "text-hueso-seda",
      line: "bg-oro-antiguo"
    },
    gold: {
      bg: "bg-oro-antiguo",
      overlay: "bg-oro-antiguo/95",
      textMain: "text-verde-ebano",
      textSub: "text-verde-ebano/90",
      line: "bg-verde-ebano"
    },
    silver: {
      bg: "bg-plata-niebla",
      overlay: "bg-plata-niebla/95",
      textMain: "text-verde-ebano",
      textSub: "text-verde-ebano/80",
      line: "bg-verde-ebano"
    }
  }[theme];

  return (
    <Link href={`/shop?collection=${encodeURIComponent(title)}`} className={sizeClass}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className={`relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden group cursor-pointer rounded-none border border-verde-ebano/10 w-full ${themeStyles.bg}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
          <Image 
            src={imagePath || "/placeholder.webp"} 
            alt={title} 
            fill 
            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
          />
        </div>

        {/* Narrative Overlay */}
        <div className={`absolute inset-0 ${themeStyles.overlay} opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-12 text-center transition-all duration-700`}>
          <h3 className={`${themeStyles.textMain} text-4xl md:text-5xl lg:text-7xl mb-8 font-display tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700`}>{title}</h3>
          <p className={`${themeStyles.textSub} text-lg md:text-xl lg:text-2xl italic font-light tracking-wide leading-relaxed max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100`}>
            &quot;{narrative}&quot;
          </p>
          <div className={`mt-10 w-24 h-[2px] ${themeStyles.line} transition-transform duration-1000 origin-left scale-x-0 group-hover:scale-x-100 delay-200`} />
        </div>
      </motion.div>
    </Link>
  );
};

export const CollectionGrid = () => {
  const collections: CollectionItemProps[] = [
    {
      title: "Anillos de Piedras",
      narrative: "Donde la tierra susurra secretos de eternidad a través del cristal.",
      imagePath: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.JPG",
      size: "large",
      theme: "bone"
    },
    {
      title: "Chai",
      narrative: "La vitalidad del metal enlazada en el ciclo infinito de la vida.",
      imagePath: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/chai/CHAI-18.JPG",
      size: "small",
      theme: "green"
    },
    {
      title: "Etérea",
      narrative: "Formas que desafían la gravedad, capturando la esencia del viento.",
      imagePath: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-3.JPG",
      size: "small",
      theme: "gold"
    },
    {
      title: "Floral",
      narrative: "La belleza efímera de la naturaleza inmortalizada en oro.",
      imagePath: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/floral/Colección 3_3.jpg",
      size: "large",
      theme: "silver"
    }
  ];

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="asymmetric-grid">
          {collections.map((col, idx) => (
            <CollectionItem key={idx} {...col} />
          ))}
        </div>
      </div>
    </section>
  );
};
