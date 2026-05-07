"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WhatsAppFAB = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down fast, hide
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      // Show after stopping scroll
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-3 group"
        >
          <div className="bg-hueso-seda px-4 py-2 shadow-xl border border-oro-antiguo/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] uppercase tracking-widest text-verde-ebano whitespace-nowrap">
              Deseo asesoría experta
            </span>
          </div>
          
          <button 
            className="w-16 h-16 bg-oro-antiguo text-verde-ebano shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
            title="Concierge WhatsApp"
          >
            <MessageCircle size={28} strokeWidth={1} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
