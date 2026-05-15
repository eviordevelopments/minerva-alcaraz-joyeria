"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";
import Link from "next/link";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:max-w-md z-[100]"
        >
          <div className="bg-hueso-seda border border-verde-ebano/10 shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-oro-antiguo" />
            
            <div className="flex justify-between items-start">
              <Shield className="text-oro-antiguo" size={24} strokeWidth={1} />
              <button onClick={() => setIsVisible(false)} className="text-verde-ebano/40 hover:text-verde-ebano transition-colors">
                <X size={18} strokeWidth={1} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-verde-ebano font-medium">Privacidad & Legado</h3>
              <p className="text-[10px] md:text-xs text-verde-ebano/70 leading-relaxed font-light italic">
                "Nuestra curaduría digital utiliza cookies para asegurar que tu experiencia sea tan impecable como nuestras piezas. Al continuar, aceptas nuestro <Link href="/privacy" className="underline decoration-oro-antiguo/30 hover:text-oro-antiguo transition-colors">Aviso de Privacidad</Link> y el uso de tecnologías de personalización."
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <button 
                onClick={acceptCookies}
                className="bg-verde-ebano text-hueso-seda text-[9px] uppercase tracking-[0.3em] px-6 py-3 hover:bg-bosque-profundo transition-all"
              >
                Aceptar Experiencia
              </button>
              <Link href="/policies" className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano/40 hover:text-verde-ebano transition-colors">
                Políticas
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
