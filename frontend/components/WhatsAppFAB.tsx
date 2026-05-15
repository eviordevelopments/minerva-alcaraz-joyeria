"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WhatsAppFAB = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[60] flex items-center gap-3 group"
      >
        <div className="bg-hueso-seda px-4 py-2 shadow-xl border border-oro-antiguo/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
          <span className="text-[10px] uppercase tracking-widest text-verde-ebano whitespace-nowrap">
            Deseo asesoría experta
          </span>
        </div>
        
        <button 
          className="w-12 h-12 md:w-16 md:h-16 bg-oro-antiguo text-verde-ebano shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          style={{ borderRadius: '50%' }}
          title="Concierge WhatsApp"
        >
          <MessageCircle className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
