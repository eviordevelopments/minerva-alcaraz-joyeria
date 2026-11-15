"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import {
  isBuenFinActive,
  getBuenFinTimeRemaining,
  BuenFinCountdown,
} from "../lib/promotions/buenFin";
import { safeSessionStorage } from "../lib/safeStorage";

const BUEN_FIN_POPUP_KEY = "ma_buen_fin_popup_seen_2026";

export const BuenFinPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState<BuenFinCountdown>(() =>
    getBuenFinTimeRemaining()
  );

  useEffect(() => {
    if (!isBuenFinActive()) return;

    const alreadySeen = safeSessionStorage.getItem(BUEN_FIN_POPUP_KEY);
    if (alreadySeen === "true") return;

    const timer = setTimeout(() => {
      if (isBuenFinActive()) {
        setIsOpen(true);
      }
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const remaining = getBuenFinTimeRemaining();
      setCountdown(remaining);
      if (remaining.isExpired) {
        setIsOpen(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    safeSessionStorage.setItem(BUEN_FIN_POPUP_KEY, "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-verde-ebano/70 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-verde-ebano text-hueso-seda border border-oro-antiguo/40 shadow-2xl p-8 sm:p-10 overflow-hidden"
          >
            {/* Subtle animated gold glow */}
            <motion.div
              aria-hidden
              animate={{ opacity: [0.12, 0.28, 0.12] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-oro-antiguo/20 blur-3xl"
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Cerrar promoción Buen Fin"
              className="absolute top-4 right-4 p-2 text-hueso-seda/60 hover:text-oro-antiguo transition-colors"
            >
              <X size={20} strokeWidth={1.2} />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center gap-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-oro-antiguo/40 bg-oro-antiguo/10 text-oro-antiguo text-[10px] uppercase tracking-[0.35em] font-medium">
                <Sparkles size={12} />
                <span>Buen Fin · Edición Limitada</span>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-4xl sm:text-5xl font-display italic text-oro-antiguo leading-none">
                  15% OFF
                </h2>
                <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-hueso-seda/90 mt-1">
                  En Toda la Tienda
                </p>
              </div>

              <p className="text-xs sm:text-sm text-hueso-seda/80 font-light leading-relaxed max-w-md">
                Disfruta de un <strong className="text-oro-antiguo font-medium">15% de descuento</strong> en todos los productos sobre el <strong className="text-hueso-seda font-medium">total incluyendo el envío</strong>.
              </p>

              {/* Stacking benefits box */}
              <div className="w-full border border-oro-antiguo/25 bg-hueso-seda/[0.04] p-4 flex flex-col gap-2 text-left text-[11px] sm:text-xs text-hueso-seda/85">
                <div className="flex items-start gap-2">
                  <span className="text-oro-antiguo font-bold">✦</span>
                  <span>
                    <strong className="text-oro-antiguo">Acumulable con Primera Compra:</strong> 10% de bienvenida y luego +15% de Buen Fin sobre el total con envío.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-oro-antiguo font-bold">✦</span>
                  <span>
                    <strong className="text-oro-antiguo">THE CIRCLE:</strong> Aplica también sobre los beneficios y envíos de tu membresía.
                  </span>
                </div>
              </div>

              {/* Countdown */}
              {!countdown.isExpired && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-oro-antiguo/90">
                    <Clock size={12} />
                    <span>Válido hasta el 17 de Nov · 11:00 PM</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                    {[
                      { label: "Días", value: countdown.days },
                      { label: "Hrs", value: countdown.hours },
                      { label: "Min", value: countdown.minutes },
                      { label: "Seg", value: countdown.seconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="border border-oro-antiguo/30 bg-verde-ebano py-2 px-1 flex flex-col items-center"
                      >
                        <span className="text-lg font-mono text-oro-antiguo leading-none">
                          {String(unit.value).padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-hueso-seda/50 mt-1">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="flex-1 bg-oro-antiguo text-verde-ebano py-3.5 px-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-hueso-seda transition-colors"
                >
                  <span>Explorar Tienda 15% OFF</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

