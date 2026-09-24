"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup or completed a purchase
    const hasSeenPopup = localStorage.getItem("minerva-has-seen-welcome");
    const hasPurchased = localStorage.getItem("minerva-has-purchased");

    if (!hasSeenPopup && !hasPurchased) {
      // Delay showing the popup slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("minerva-has-seen-welcome", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-verde-ebano/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-hueso-seda w-full max-w-lg max-h-[90vh] relative overflow-y-auto flex flex-col p-8 md:p-12 text-center shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-verde-ebano/50 hover:text-verde-ebano transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-oro-antiguo/20 via-oro-antiguo to-oro-antiguo/20" />

            <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo mb-6 font-medium">
              Bienvenido al Atelier
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display text-verde-ebano leading-tight mb-4">
              10% de Cortesía en tu Primera Adquisición
            </h2>
            
            <p className="text-xs text-verde-ebano/70 uppercase tracking-widest leading-relaxed mb-8">
              Descubre el legado de Minerva Alcaraz. El descuento se aplicará automáticamente al finalizar tu compra.
            </p>

            <LuxuryButton onClick={handleClose} className="w-full">
              Explorar Colecciones
            </LuxuryButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
