"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, X, Sparkles, SlidersHorizontal, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ProductFilters = () => {
  const [isTopOpen, setIsTopOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterSections = [
    { title: "Colección", options: ["Alquimia", "Chai", "Etérea", "Floral"] },
    { title: "Tipo de Joya", options: ["Anillos", "Collares", "Pulseras", "Aretes", "Broches"] },
    { title: "Género", options: ["Mujer", "Hombre", "Ambos"] },
    { title: "Edición", options: ["Piezas Únicas", "Edición Limitada", "Diseño de Autor"] },
    { title: "Materiales", options: ["Oro 24K", "Oro 18K", "Plata .925", "Chapa de Oro", "Piedras Preciosas"] },
    { title: "Ocasión", options: ["Compromiso", "Gala", "Legado", "Cotidiano", "Regalo"] },
    { title: "Colores", options: ["Dorado", "Plateado", "Verde Esmeralda", "Azul Zafiro", "Blanco Perla"] },
    { title: "Rango de Precio", options: ["$0 - $500", "$500 - $1,500", "$1,500 - $5,000", "$5,000+"] }
  ];

  return (
    <div className="w-full mb-12 flex flex-col gap-6">
      {/* 1. Global Filter Control Bar */}
      <div className="flex justify-between items-center py-6 border-y border-plata-niebla/10 bg-hueso-seda z-30">
        <div className="flex gap-12 items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 text-[10px] uppercase tracking-widest hover:text-oro-antiguo transition-colors"
          >
            <Filter size={14} /> {isSidebarOpen ? "Cerrar Filtros" : "Filtrar por..."}
          </button>
          
          <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-widest text-plata-niebla">
            {["Oro", "Plata", "Únicos"].map(tag => (
              <button key={tag} className="hover:text-verde-ebano transition-colors">{tag}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-plata-niebla">Ordenar:</span>
            <select className="bg-transparent text-[10px] uppercase tracking-widest outline-none border-none cursor-pointer hover:text-oro-antiguo transition-colors">
              <option>Destacados</option>
              <option>Precio: Mayor a Menor</option>
              <option>Precio: Menor a Mayor</option>
            </select>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-medium">84 Piezas</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* 2. Luxury Left Sidebar Filters */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="lg:w-64 flex flex-col gap-12 py-8 border-r border-plata-niebla/10 pr-12 h-fit"
            >
              {filterSections.map((section) => (
                <div key={section.title} className="flex flex-col gap-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-oro-antiguo font-medium border-l border-oro-antiguo pl-3">{section.title}</h4>
                  <div className="flex flex-col gap-3">
                    {section.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-3 h-3 border border-plata-niebla/30 group-hover:border-oro-antiguo transition-colors flex items-center justify-center">
                          {/* Checkmark logic here */}
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-verde-ebano/60 group-hover:text-verde-ebano transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* AI Intelligent Discovery Sidebar Block */}
              <div className="mt-8 p-6 bg-authority flex flex-col gap-4">
                <div className="flex items-center gap-2 text-oro-antiguo">
                  <Sparkles size={14} />
                  <span className="text-[9px] uppercase tracking-widest">Atelier IA</span>
                </div>
                <p className="text-[9px] text-hueso-seda/50 leading-relaxed uppercase tracking-tighter">
                  Describa su visión para una recomendación única.
                </p>
                <textarea 
                  rows={3}
                  className="bg-hueso-seda/5 border border-hueso-seda/10 p-3 text-[10px] text-hueso-seda focus:border-oro-antiguo outline-none transition-all resize-none"
                  placeholder="Ej: Collares minimalistas para gala..."
                />
                <button className="text-[9px] uppercase tracking-widest text-oro-antiguo flex items-center justify-between group">
                  Descubrir <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* This div would contain the actual Product Grid in a real page */}
        <div className="flex-1 min-h-[1000px] bg-plata-niebla/5 border border-dashed border-plata-niebla/20 flex items-center justify-center">
          <span className="text-[10px] uppercase tracking-widest opacity-20">Contenedor de Galería de Productos</span>
        </div>
      </div>
    </div>
  );
};
