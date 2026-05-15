"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesignSystem } from "./DesignSystemProvider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const MentalStateOverlay = () => {
  const { mentalState, setMentalState, handleInteraction } = useDesignSystem();
  const isLowArousal = mentalState === "LOW_AROUSAL";

  const handleDismiss = () => {
    handleInteraction(); // Reset timer
    setMentalState("HIGH_AROUSAL");
  };

  return (
    <AnimatePresence>
      {isLowArousal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] bg-verde-ebano/98 flex flex-col items-center justify-center p-6 text-center"
        >
          {/* Close button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-10 right-10 text-hueso-seda/40 hover:text-oro-antiguo transition-colors uppercase tracking-[0.3em] text-[10px] flex items-center gap-2"
          >
            Cerrar [esc]
          </button>

          {/* Subtle background texture or element */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] border border-hueso-seda/20 rounded-full blur-3xl" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] border border-hueso-seda/20 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-2xl relative z-10"
          >
            <span className="text-oro-antiguo text-[10px] uppercase tracking-[0.5em] mb-8 block">
              Vínculo Ancestral
            </span>
            
            <h2 className="text-hueso-seda text-4xl md:text-6xl font-display italic mb-12 leading-tight">
              ¿Deseas continuar tu viaje a través del arte?
            </h2>
            
            <p className="text-hueso-seda/60 text-sm md:text-base font-light tracking-widest mb-16 italic max-w-md mx-auto leading-relaxed">
              Permite que la herencia de Minerva Alcaraz guíe tu búsqueda de la pieza perfecta.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/shop"
                onClick={handleDismiss}
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-oro-antiguo text-oro-antiguo text-[10px] uppercase tracking-[0.3em] hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 w-full sm:w-auto"
              >
                Explorar el Catálogo
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={handleDismiss}
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-hueso-seda/20 text-hueso-seda/70 text-[10px] uppercase tracking-[0.3em] hover:border-hueso-seda hover:text-hueso-seda transition-all duration-500 w-full sm:w-auto"
              >
                Continuar Navegando
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 text-[8px] uppercase tracking-[0.4em] text-hueso-seda/20"
          >
            Deslice para continuar el viaje
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
