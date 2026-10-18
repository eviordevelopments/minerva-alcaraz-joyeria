"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Gem, ArrowRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { LuxuryGoldConfetti } from "./LuxuryGoldConfetti";
import { safeLocalStorage, safeSessionStorage } from "../lib/safeStorage";

// Hora oficial de lanzamiento: Viernes 16 de Octubre de 2026 a las 5:00 PM (Hora Centro de México, UTC-6)
const LAUNCH_DATE_ISO = "2026-10-16T17:00:00-06:00";
const LAUNCH_TIMESTAMP = new Date(LAUNCH_DATE_ISO).getTime();

export function LaunchCelebrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [isCountFinished, setIsCountFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Evitar desplegar en el panel de administración
    if (pathname?.startsWith("/admin")) return;

    // 2. Verificar condición de lanzamiento o modo de previsualización
    const previewParam =
      searchParams?.get("launch") === "preview" ||
      searchParams?.get("launch") === "true" ||
      searchParams?.get("preview_launch") === "true";

    const isAfterLaunch = Date.now() >= LAUNCH_TIMESTAMP;

    // Si aún no son las 5:00 PM y no hay parámetro de prueba, no activar
    if (!isAfterLaunch && !previewParam) return;

    // 3. Verificar si el usuario ya vio la bienvenida en su sesión actual (a menos que fuerce preview)
    const hasSeenInSession = safeSessionStorage.getItem("ma_launch_celebration_shown");
    if (hasSeenInSession === "true" && !previewParam) return;

    // 4. Iniciar experiencia de lanzamiento con una entrada suave
    safeSessionStorage.setItem("ma_launch_is_open", "true");
    setIsOpen(true);
    setShowConfetti(true);

    // 5. Consultar y registrar el número de visitante en Supabase
    const fetchVisitorNumber = async () => {
      try {
        let visitorId = safeLocalStorage.getItem("ma_visitor_uuid");
        if (!visitorId) {
          visitorId = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          safeLocalStorage.setItem("ma_visitor_uuid", visitorId);
        }

        const storedNumber = safeLocalStorage.getItem("ma_visitor_number");
        const existingNumber = storedNumber ? parseInt(storedNumber, 10) : undefined;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch("/api/launch/visitor-counter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, existingNumber }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const targetNum = Number(data.visitorNumber) || 1;
          setVisitorNumber(targetNum);
          safeLocalStorage.setItem("ma_visitor_number", targetNum.toString());
        } else {
          setVisitorNumber(1);
        }
      } catch {
        setVisitorNumber(1);
      }
    };

    fetchVisitorNumber();
  }, [pathname, searchParams]);

  // Animación suave de conteo del número de visitante
  useEffect(() => {
    if (!visitorNumber || visitorNumber <= 0) return;

    let animationFrameId: number;
    const duration = 2400; // 2.4 segundos de conteo elegante
    const startTime = performance.now();
    const startVal = Math.max(0, visitorNumber - Math.min(visitorNumber, 80));

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Curva de desaceleración exponencial (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (visitorNumber - startVal) * ease);

      setDisplayCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayCount(visitorNumber);
        setIsCountFinished(true);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [visitorNumber]);

  const handleClose = () => {
    setIsOpen(false);
    setShowConfetti(false);
    safeSessionStorage.setItem("ma_launch_celebration_shown", "true");
    safeSessionStorage.setItem("ma_launch_is_open", "false");
    safeLocalStorage.setItem("ma_launch_dismissed_at", Date.now().toString());
  };

  // Formato acolchado con ceros sutiles (ej: 000,042)
  const formatNumberWithPaddedZeros = (num: number) => {
    const padded = num.toString().padStart(5, "0");
    const formatted = Number(padded).toLocaleString("es-MX", { minimumIntegerDigits: 5 });
    return formatted;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100060] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90">
          {/* Confetti Elegante de Oro y Diamantes */}
          {showConfetti && <LuxuryGoldConfetti durationMs={10000} particleCount={85} />}

          {/* Modal en Verde Ébano */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full max-w-2xl my-auto overflow-hidden text-center shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-[#CBB67B]/40"
            style={{
              backgroundColor: "#2C3729",
              backgroundImage:
                "radial-gradient(circle at 50% 20%, rgba(203, 182, 123, 0.18) 0%, rgba(44, 55, 41, 0.98) 70%, #1E261C 100%)",
            }}
          >
            {/* Esquinas ornamentales estilo joyero */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#CBB67B]/60 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#CBB67B]/60 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#CBB67B]/60 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#CBB67B]/60 pointer-events-none" />

            {/* Línea superior dorada */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CBB67B] to-transparent" />

            {/* Botón de cierre superior */}
            <button
              onClick={handleClose}
              aria-label="Cerrar ventana de lanzamiento"
              className="absolute top-4 right-4 z-20 p-2 text-[#CBB67B]/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="p-7 sm:p-11 md:p-14 relative z-10 flex flex-col items-center">
              {/* Monograma y Escudo del Atelier */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-8 h-[1px] bg-[#CBB67B]/50" />
                <span className="text-[10px] md:text-[11px] uppercase tracking-[0.45em] text-[#CBB67B] font-mono font-medium">
                  Atelier Digital · Inauguración
                </span>
                <div className="w-8 h-[1px] bg-[#CBB67B]/50" />
              </motion.div>

              {/* Título Oficial: Lanzamiento Minerva Alcaraz Joyería */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-[#E5DBD6] tracking-tight leading-tight mb-3"
              >
                Lanzamiento{" "}
                <span className="font-serif italic text-white drop-shadow-[0_2px_15px_rgba(203,182,123,0.35)]">
                  Minerva Alcaraz
                </span>{" "}
                Joyería
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-[11px] uppercase tracking-[0.35em] text-[#CBB67B]/90 font-serif mb-6"
              >
                Tu Esencia, Hecha Joya
              </motion.p>

              {/* Caja de Conteo Especial: Número de usuario que ha entrado a la página */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="w-full max-w-md my-4 p-5 sm:p-6 bg-[#1E261C]/80 border border-[#CBB67B]/40 relative overflow-hidden backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#CBB67B]/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#CBB67B]/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-center gap-2 mb-2 text-[#CBB67B]">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-mono font-medium">
                    Invitado de Honor Registrado
                  </span>
                  <Sparkles size={14} className="animate-pulse" />
                </div>

                <div className="flex items-baseline justify-center gap-2 my-2">
                  <span className="text-2xl sm:text-3xl font-serif text-[#CBB67B]/70 tracking-wider">
                    N°
                  </span>
                  <motion.span
                    key={displayCount}
                    className={`text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-widest text-white transition-all ${
                      isCountFinished
                        ? "drop-shadow-[0_0_25px_rgba(203,182,123,0.7)]"
                        : ""
                    }`}
                  >
                    {formatNumberWithPaddedZeros(displayCount)}
                  </motion.span>
                </div>

                <p className="text-[10px] uppercase tracking-widest text-white/60 font-mono mt-1">
                  Acceso inaugural en vivo al Atelier
                </p>
              </motion.div>

              {/* Mensaje de agradecimiento solicitado */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="max-w-xl mx-auto my-5 px-5 py-4 bg-black/20 border-l-2 border-[#CBB67B] text-left sm:text-center"
              >
                <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed tracking-wide">
                  “¡Gracias por formar parte de Minerva Alcaraz Joyería y acompañarnos en esta nueva etapa especial para nosotros, esperamos que la experiencia sea de tu agrado!”
                </p>
              </motion.div>

              {/* Botón de Entrada al Atelier */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="w-full max-w-sm mt-3"
              >
                <button
                  onClick={handleClose}
                  className="w-full py-4 px-8 bg-gradient-to-r from-[#CBB67B] via-[#E2D2A4] to-[#CBB67B] text-[#2C3729] font-mono text-xs uppercase tracking-[0.3em] font-bold hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_4px_25px_rgba(203,182,123,0.35)] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Ingresar al Atelier</span>
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
