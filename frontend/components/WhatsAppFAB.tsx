"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { 
  CONTACT_PHONE_INTL, 
  CONTACT_PHONE_DISPLAY, 
  WHATSAPP_LINK, 
  WHATSAPP_PHONE 
} from "../lib/contact";

export { WHATSAPP_PHONE, WHATSAPP_LINK };

export const WhatsAppFAB = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100010]"
      >
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block group text-decoration-none"
          aria-label={`Contactar por WhatsApp ${CONTACT_PHONE_DISPLAY}`}
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-hueso-seda px-4 py-2 shadow-xl border border-oro-antiguo/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 hidden md:block whitespace-nowrap">
            <span className="text-xs uppercase tracking-widest text-verde-ebano font-medium block">
              WhatsApp Concierge
            </span>
            <span className="text-[10px] font-mono text-verde-ebano/70 block text-right">
              {CONTACT_PHONE_DISPLAY}
            </span>
          </div>
          
          <div className="w-12 h-12 md:w-16 md:h-16 bg-oro-antiguo text-verde-ebano shadow-2xl flex items-center justify-center rounded-full group-hover:scale-105 hover:bg-hueso-seda transition-all relative z-10">
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};
