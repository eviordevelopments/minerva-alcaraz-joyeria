"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesignSystem } from "./DesignSystemProvider";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const MentalStateOverlay = () => {
  const { mentalState } = useDesignSystem();
  const isLowArousal = mentalState === "LOW_AROUSAL";

  return (
    <AnimatePresence>
      {isLowArousal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] bg-verde-ebano/95 flex flex-col items-center justify-center p-6 text-center"
        >
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
              ¿Qué historia buscas hoy?
            </h2>
            
            <p className="text-hueso-seda/60 text-sm md:text-base font-light tracking-widest mb-16 italic max-w-md mx-auto leading-relaxed">
              Permita que la artesanía le guíe a través de una herencia de oro y significado.
            </p>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link 
                href="/shop"
                className="group flex items-center gap-4 text-hueso-seda text-[11px] uppercase tracking-[0.3em] hover:text-oro-antiguo transition-colors"
              >
                Explorar la colección
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="w-[1px] h-8 bg-hueso-seda/10 hidden md:block" />

              <Link 
                href="/personalized"
                className="group flex items-center gap-4 text-hueso-seda text-[11px] uppercase tracking-[0.3em] hover:text-oro-antiguo transition-colors"
              >
                Comenzar un diseño personalizado
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
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
