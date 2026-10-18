"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";
import { safeLocalStorage, safeSessionStorage } from "../lib/safeStorage";
import { isRestrictedMobileWebView } from "../lib/deviceDetect";

const WELCOME_DELAY_MS = 2500; // 2.5 segundos para entrada suave en desktop
const MOBILE_RESTRICTED_DELAY_MS = 6000; // 6 segundos en Android WebView para permitir carga fluida

export function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup or completed a purchase
    const hasSeenPopup = safeLocalStorage.getItem("minerva-has-seen-welcome");
    const hasPurchased = safeLocalStorage.getItem("minerva-has-purchased");

    if (hasSeenPopup || hasPurchased) return;

    // Track when user first visited the site
    let visitStart = Number(safeLocalStorage.getItem("ma_first_visit_time"));
    if (!visitStart) {
      visitStart = Date.now();
      safeLocalStorage.setItem("ma_first_visit_time", visitStart.toString());
    }

    const delay = isRestrictedMobileWebView() ? MOBILE_RESTRICTED_DELAY_MS : WELCOME_DELAY_MS;

    const timer = setTimeout(() => {
      if (safeSessionStorage.getItem("ma_launch_is_open") === "true") return;
      setIsVisible(true);
      const now = Date.now();
      safeLocalStorage.setItem("ma_welcome_shown_at", now.toString());
      safeLocalStorage.setItem("ma_last_popup_time", now.toString());
      safeSessionStorage.setItem("ma_welcome_is_open", "true");
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    safeSessionStorage.setItem("ma_welcome_is_open", "false");
    safeLocalStorage.setItem("minerva-has-seen-welcome", "true");
    safeLocalStorage.setItem("ma_welcome_closed_at", Date.now().toString());
    safeLocalStorage.setItem("ma_last_popup_time", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100050] flex items-center justify-center bg-verde-ebano/90 p-4 cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-hueso-seda w-full max-w-lg max-h-[90dvh] relative overflow-y-auto flex flex-col p-8 md:p-12 text-center shadow-2xl cursor-default"
          >
            <button
              onClick={handleClose}
              aria-label="Cerrar ventana de bienvenida"
              className="absolute top-3 right-3 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-verde-ebano/60 hover:text-verde-ebano hover:bg-verde-ebano/5 rounded-full transition-colors touch-manipulation cursor-pointer"
            >
              <X size={22} strokeWidth={1.5} />
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
