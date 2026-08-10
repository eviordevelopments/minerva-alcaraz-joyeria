"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WHATSAPP_PHONE = "524626217960";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}?text=Hola%20Minerva%20Alcaraz,%20deseo%20asesor%C3%ADa%20personalizada%20sobre%20las%20piezas%20de%20alta%20joyer%C3%ADa.`;

export const WhatsAppFAB = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[60]"
      >
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group text-decoration-none"
          title="Contactar a Minerva Alcaraz vía WhatsApp (+52 462 621 7960)"
        >
          <div className="bg-hueso-seda px-4 py-2 shadow-xl border border-oro-antiguo/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <span className="text-[10px] uppercase tracking-widest text-verde-ebano whitespace-nowrap font-medium">
              Deseo asesoría experta
            </span>
          </div>
          
          <div className="w-12 h-12 md:w-16 md:h-16 bg-oro-antiguo text-verde-ebano shadow-2xl flex items-center justify-center rounded-full group-hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};
