"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

import { PRODUCTS } from "../constants/products";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todo");

  const filters = ["Todo", "Piezas Únicas", "Sets", "Anillos", "Collares", "Amatista", "Chai"];

  // Real search logic
  const results = query.length > 1 
    ? PRODUCTS.filter(p => 
        (p.name.toLowerCase().includes(query.toLowerCase()) || 
         p.category.toLowerCase().includes(query.toLowerCase()) ||
         p.collection.toLowerCase().includes(query.toLowerCase())) &&
        (activeFilter === "Todo" || p.category.includes(activeFilter) || p.collection === activeFilter)
      ).slice(0, 6) 
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-verde-ebano/80 backdrop-blur-md" 
            onClick={onClose} 
          />

          {/* Search Panel */}
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-hueso-seda w-full p-8 md:p-16 lg:p-24 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 md:right-16 text-verde-ebano hover:text-oro-antiguo transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <div className="max-w-5xl mx-auto flex flex-col gap-12">
              
              {/* Search Input */}
              <div className="flex items-end gap-6 border-b-2 border-verde-ebano/20 pb-4 group focus-within:border-oro-antiguo transition-colors">
                <Search size={32} className="text-verde-ebano/50 group-focus-within:text-oro-antiguo transition-colors" strokeWidth={1} />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca tu legado..." 
                  className="w-full bg-transparent text-3xl md:text-5xl lg:text-7xl font-display text-verde-ebano placeholder:text-verde-ebano/20 outline-none"
                  autoFocus
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-verde-ebano/60 mb-2">
                  <SlidersHorizontal size={14} /> Filtros de Colección
                </div>
                <div className="flex flex-wrap gap-3">
                  {filters.map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${
                        activeFilter === filter 
                          ? "border-verde-ebano bg-verde-ebano text-hueso-seda" 
                          : "border-verde-ebano/20 text-verde-ebano hover:border-oro-antiguo"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Predictive Results */}
              {query.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <h3 className="text-xs uppercase tracking-[0.3em] text-verde-ebano/60 mb-6">Sugerencias para su Legado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {results.map((item) => (
                      <Link 
                        key={item.id} 
                        href={`/product/${item.id}`}
                        onClick={onClose}
                        className="group cursor-pointer flex items-center gap-6 p-4 border border-transparent hover:border-oro-antiguo/30 hover:bg-verde-ebano/5 transition-all"
                      >
                        <div className="relative w-24 h-32 bg-plata-niebla/20 overflow-hidden flex-shrink-0">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] uppercase tracking-[0.3em] text-oro-antiguo font-medium">{item.category}</span>
                          <span className="text-base font-display text-verde-ebano leading-tight">{item.name}</span>
                          <span className="text-[10px] text-verde-ebano/60 tracking-widest">${item.price.toLocaleString()} {item.currency}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
