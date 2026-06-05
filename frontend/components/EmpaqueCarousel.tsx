"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── All packaging images served from /public/assets/empaques/ ───────────────
export const EMPAQUE_IMAGES = [
  "/assets/empaques/empaque.JPG",
  "/assets/empaques/empaque-3.JPG",
  "/assets/empaques/empaque-4.JPG",
  "/assets/empaques/empaque-5.JPG",
  "/assets/empaques/empaque-8.JPG",
  "/assets/empaques/empaque-9.JPG",
  "/assets/empaques/empaque-10.JPG",
  "/assets/empaques/empaque-11.JPG",
  "/assets/empaques/empaque-12.JPG",
  "/assets/empaques/empaque-13.JPG",
  "/assets/empaques/empaque-14.JPG",
];

interface EmpaqueCarouselProps {
  /** Interval in ms between auto-advances. Defaults to 2000 (2 s). */
  interval?: number;
  /** Aspect ratio class. Defaults to "aspect-square". */
  aspectClass?: string;
  /** Optional extra class names on the outer wrapper. */
  className?: string;
  /** Show dot navigation below the image. */
  showDots?: boolean;
}

export const EmpaqueCarousel: React.FC<EmpaqueCarouselProps> = ({
  interval = 2000,
  aspectClass = "aspect-square",
  className = "",
  showDots = true,
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auto-advance ──────────────────────────────────────────────────────────
  const advance = () => setCurrent((c) => (c + 1) % EMPAQUE_IMAGES.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(advance, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, interval]);

  // ── Manual dot navigation — reset timer ──────────────────────────────────
  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) timerRef.current = setInterval(advance, interval);
  };

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Main image viewport ────────────────────────────────────────────── */}
      <div className={`relative w-full ${aspectClass} bg-[#2C3729]/5`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={EMPAQUE_IMAGES[current]}
              alt={`Empaque Minerva Alcaraz ${current + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Pause indicator — visible on hover */}
        {paused && (
          <div className="absolute top-3 right-3 bg-[#2C3729]/60 backdrop-blur-sm px-2 py-1 text-[7px] uppercase tracking-[0.4em] text-[#E5DBD6]/70 pointer-events-none">
            Pausado
          </div>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 left-3 bg-[#2C3729]/50 backdrop-blur-sm px-2 py-1 text-[7px] uppercase tracking-[0.35em] text-[#CBB67B]">
          {String(current + 1).padStart(2, "0")} / {String(EMPAQUE_IMAGES.length).padStart(2, "0")}
        </div>
      </div>

      {/* ── Dot navigation ─────────────────────────────────────────────────── */}
      {showDots && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {EMPAQUE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Ir a imagen ${idx + 1}`}
              className={`transition-all duration-300 ${
                idx === current
                  ? "w-6 h-[2px] bg-[#CBB67B]"
                  : "w-2 h-[2px] bg-[#2C3729]/20 hover:bg-[#CBB67B]/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmpaqueCarousel;
