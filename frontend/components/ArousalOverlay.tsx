"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesignSystem } from "./DesignSystemProvider";
import { LuxuryButton } from "./DesignSystem";
import Link from "next/link";

export const ArousalOverlay = () => {
  const { mentalState } = useDesignSystem();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Only show "Vínculo Ancestral" if user is in LOW_AROUSAL and hasn't dismissed it
    if (mentalState === "LOW_AROUSAL") {
      const timer = setTimeout(() => setShowOverlay(true), 12000); // Wait 12s of idle
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }
  }, [mentalState]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-verde-ebano/95 flex items-center justify-center text-center px-8"
        >
          <div className="max-w-2xl flex flex-col gap-10">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo"
            >
              Vínculo Ancestral
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-display text-hueso-seda leading-tight"
            >
              ¿Qué historia buscas hoy?
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col md:flex-row gap-6 justify-center mt-8"
            >
              <Link href="/collections">
                <LuxuryButton variant="primary" className="!border-hueso-seda !text-hueso-seda hover:!bg-hueso-seda hover:!text-verde-ebano">
                  Explorar la Herencia
                </LuxuryButton>
              </Link>
              <Link href="/personalized">
                <LuxuryButton variant="secondary" className="!bg-oro-antiguo !text-verde-ebano border-none">
                  Crear un Diseño Eterno
                </LuxuryButton>
              </Link>
            </motion.div>

            <button 
              onClick={() => setShowOverlay(false)}
              className="text-[9px] uppercase tracking-[0.4em] text-hueso-seda/40 hover:text-hueso-seda transition-colors mt-8"
            >
              Seguir en Silencio
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
