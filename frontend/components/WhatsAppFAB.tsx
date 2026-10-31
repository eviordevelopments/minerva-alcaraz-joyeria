"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeadphonesIcon } from "lucide-react";

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
        <Link
          href="/atencion-al-cliente"
          className="relative block group text-decoration-none"
          aria-label="Atención al Cliente"
        >
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-hueso-seda px-4 py-2 shadow-xl border border-oro-antiguo/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 hidden md:block">
            <span className="text-xs uppercase tracking-widest text-verde-ebano whitespace-nowrap font-medium">
              Atención al Cliente
            </span>
          </div>
          
          <div className="w-12 h-12 md:w-16 md:h-16 bg-oro-antiguo text-verde-ebano shadow-2xl flex items-center justify-center rounded-full group-hover:scale-105 transition-transform relative z-10">
            <HeadphonesIcon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
