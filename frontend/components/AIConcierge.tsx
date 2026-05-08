"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles, Send, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../constants/products";

export const AIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className={`fixed z-[100] transition-all duration-700 ${isFullScreen ? 'inset-0' : 'bottom-8 right-28'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-chat-window"
            initial={isFullScreen ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-hueso-seda shadow-2xl border border-verde-ebano/10 flex flex-col overflow-hidden transition-all duration-700 ${isFullScreen ? 'w-full h-full' : 'absolute bottom-20 right-0 w-[550px] md:w-[700px] h-[850px] max-h-[85vh]'}`}
          >
            {/* Header */}
            <div className="p-5 bg-verde-ebano text-hueso-seda flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-oro-antiguo/30" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-oro-antiguo/30 flex items-center justify-center">
                    <Sparkles size={14} className="text-oro-antiguo" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-verde-ebano" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-medium">Oráculo Digital</span>
                  <span className="text-[8px] uppercase tracking-widest opacity-60">En línea</span>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="text-hueso-seda/40 hover:text-oro-antiguo transition-colors"
                  title={isFullScreen ? "Minimizar" : "Pantalla Completa"}
                >
                  {isFullScreen ? <Minimize2 size={16} strokeWidth={1} /> : <Maximize2 size={16} strokeWidth={1} />}
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setIsFullScreen(false); }}
                  className="text-hueso-seda/40 hover:text-hueso-seda transition-colors"
                >
                  <X size={18} strokeWidth={1} />
                </button>
              </div>
            </div>

            {/* Chat Content / Iframe */}
            <div className={`flex-1 bg-white/50 relative flex ${isFullScreen ? 'flex-row' : 'flex-col'}`}>
              <div className={`flex-1 flex flex-col border-r border-verde-ebano/5 bg-hueso-seda/30`}>
                <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    <div className="bg-verde-ebano text-hueso-seda p-4 text-[11px] md:text-xs leading-relaxed font-light italic border-l-2 border-oro-antiguo">
                      {isFullScreen 
                        ? "He expandido mi consciencia para brindarle una asesoría total. Basado en sus preferencias, he curado una selección de piezas que resuenan con su legado personal."
                        : "Bienvenido a la cofradía de Minerva Alcaraz. Soy su guía en este viaje a través de la materia y el símbolo. ¿En qué puedo asesorarle hoy?"}
                    </div>
                  </div>
                  
                  {/* ... rest of chat content ... */}
                </div>
                
                {/* Input Area */}
                <div className="p-4 bg-hueso-seda border-t border-verde-ebano/5">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="Pregunte sobre materiales, simbolismo o legado..." 
                      className="w-full p-4 pr-12 bg-transparent border border-verde-ebano/10 text-[10px] tracking-widest outline-none focus:border-oro-antiguo transition-colors"
                    />
                    <button className="absolute right-4 text-oro-antiguo hover:text-verde-ebano transition-colors">
                      <Send size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-1/3 bg-verde-ebano text-hueso-seda p-12 overflow-y-auto"
                >
                  <span className="text-[10px] uppercase tracking-[0.5em] text-oro-antiguo mb-8 block">Selección Curada por IA</span>
                  <h3 className="text-3xl font-display italic mb-12">Sugerencias del Oráculo</h3>
                  
                  <div className="flex flex-col gap-12">
                    {PRODUCTS.filter(p => p.featured).slice(0, 3).map((p) => (
                      <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer block">
                        <div className="aspect-[3/4] bg-hueso-seda/5 border border-hueso-seda/10 mb-4 overflow-hidden relative">
                           <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <h4 className="text-xs uppercase tracking-widest mb-1 group-hover:text-oro-antiguo transition-colors">{p.name}</h4>
                        <p className="text-[10px] text-hueso-seda/50 italic">&quot;{p.description.slice(0, 80)}...&quot;</p>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-16 p-8 border border-oro-antiguo/20 bg-oro-antiguo/5">
                    <p className="text-[11px] font-light leading-relaxed">
                      &quot;He detectado una armonía particular entre su esencia y estas piezas de la colección {PRODUCTS[0].collection}.&quot;
                    </p>
                  </div>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border border-oro-antiguo/20 ${
          isOpen ? "bg-oro-antiguo text-verde-ebano" : "bg-verde-ebano text-oro-antiguo"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Sparkles size={24} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
