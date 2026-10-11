"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";

const THREE_MINUTES_MS = 3 * 60 * 1000; // 180,000 ms (3 minutos)

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup or completed a purchase
    const hasSeenPopup = localStorage.getItem("minerva-has-seen-welcome");
    const hasPurchased = localStorage.getItem("minerva-has-purchased");

    if (hasSeenPopup || hasPurchased) return;

    // Track when user first visited the site
    let visitStart = Number(localStorage.getItem("ma_first_visit_time"));
    if (!visitStart) {
      visitStart = Date.now();
      localStorage.setItem("ma_first_visit_time", visitStart.toString());
    }

    const elapsed = Date.now() - visitStart;
    const initialDelay = Math.max(0, THREE_MINUTES_MS - elapsed);

    const checkAndShow = () => {
      const lastPopup = Number(localStorage.getItem("ma_last_popup_time") || 0);
      const timeSinceLastPopup = Date.now() - lastPopup;

      if (lastPopup > 0 && timeSinceLastPopup < THREE_MINUTES_MS) {
        // Enforce 3-minute margin if another popup was triggered recently
        const remaining = THREE_MINUTES_MS - timeSinceLastPopup;
        const retryTimer = setTimeout(() => {
          setIsVisible(true);
          localStorage.setItem("ma_last_popup_time", Date.now().toString());
        }, remaining);
        return () => clearTimeout(retryTimer);
      }

      setIsVisible(true);
      localStorage.setItem("ma_last_popup_time", Date.now().toString());
    };

    const timer = setTimeout(checkAndShow, initialDelay);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("minerva-has-seen-welcome", "true");
    localStorage.setItem("ma_last_popup_time", Date.now().toString());
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
              aria-label="Cerrar ventana de bienvenida"
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
