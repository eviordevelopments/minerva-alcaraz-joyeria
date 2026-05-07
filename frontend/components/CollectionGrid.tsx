"use client";

import React from "react";
import { motion } from "framer-motion";

interface CollectionItemProps {
  title: string;
  narrative: string;
  imagePath: string;
  size: "large" | "small" | "full";
}

const CollectionItem: React.FC<CollectionItemProps> = ({ title, narrative, imagePath, size }) => {
  const sizeClass = {
    large: "grid-item-large",
    small: "grid-item-small",
    full: "grid-item-full"
  }[size];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`relative h-[500px] overflow-hidden group cursor-pointer rounded-none ${sizeClass}`}
    >
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-plata-niebla/10 transition-transform duration-700 group-hover:scale-105">
        {/* Actual Image would go here */}
        <div className="w-full h-full flex items-center justify-center text-xs tracking-[0.3em] opacity-20 uppercase">
          {title}
        </div>
      </div>

      {/* Narrative Overlay */}
      <div className="absolute inset-0 narrative-overlay opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-oro-antiguo text-2xl mb-4 font-display tracking-widest">{title}</h3>
        <p className="text-hueso-seda text-sm italic font-light tracking-wide leading-relaxed">
          "{narrative}"
        </p>
        <div className="mt-8 w-12 h-[1px] bg-oro-antiguo" />
      </div>
    </motion.div>
  );
};

export const CollectionGrid = () => {
  const collections: CollectionItemProps[] = [
    {
      title: "Anillos de Piedras",
      narrative: "Donde la tierra susurra secretos de eternidad a través del cristal.",
      imagePath: "",
      size: "large"
    },
    {
      title: "Chai",
      narrative: "La vitalidad del metal enlazada en el ciclo infinito de la vida.",
      imagePath: "",
      size: "small"
    },
    {
      title: "Etérea",
      narrative: "Formas que desafían la gravedad, capturando la esencia del viento.",
      imagePath: "",
      size: "small"
    },
    {
      title: "Floral",
      narrative: "La belleza efímera de la naturaleza inmortalizada en oro.",
      imagePath: "",
      size: "large"
    }
  ];

  return (
    <section className="px-8 md:px-16 py-32">
      <div className="asymmetric-grid">
        {collections.map((col, idx) => (
          <CollectionItem key={idx} {...col} />
        ))}
      </div>
    </section>
  );
};
