"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { LuxuryButton } from "./DesignSystem";
import { HaulCarousel } from "./HaulCarousel";

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Track scroll progress specifically relative to the Hero screen banner
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // High stiffness spring for crisp, zero-latency scroll response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 350,
    damping: 30,
    restDelta: 0.001,
  });

  // Background overlay: starts 100% clear (0.0), darkens softly & gradually (0.0 -> 0.4) across the hero scroll
  const overlayOpacity = useTransform(smoothProgress, [0, 0.5], [0.0, 0.4]);

  // Subtle 3D zoom for cinematic depth
  const imageScale = useTransform(smoothProgress, [0, 0.7], [1.0, 1.08]);

  // Heading & CTA reveal animations:
  // Invisible at scroll 0, reaches 100% FULL opacity by 0.05 scroll progress (first ~40px of scroll)
  const headingOpacity = useTransform(smoothProgress, [0.005, 0.05], [0, 1]);
  const headingY = useTransform(smoothProgress, [0.005, 0.05], [25, 0]);
  const headingScale = useTransform(smoothProgress, [0.005, 0.05], [0.98, 1]);

  // Initial scroll indicator: visible on arrival, fades out instantly on scroll start
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.02], [1, 0]);

  return (
    <div className="relative w-full bg-verde-ebano">
      {/* Pinned Cinematic Hero Screen */}
      <div ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden z-0">
        
        {/* Background Jewel Image with soft initial entrance and smooth scroll zoom */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale: imageScale }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          <img 
            src="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/hero-section_image.JPG" 
            alt="Minerva Alcaraz Joyería" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Dynamic Dark Vignette Overlay */}
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-verde-ebano z-0 transition-colors" 
        />

        {/* Animated Narrative Content (Appears gracefully on scroll) */}
        <motion.div 
          style={{ 
            opacity: headingOpacity, 
            y: headingY,
            scale: headingScale
          }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto mt-12 md:mt-0"
        >
          <h1 
            className="hero-title-no-hyphens text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-oro-antiguo leading-[1.15] sm:leading-tight mb-6 sm:mb-8 px-2 text-center"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.7)' }}
          >
            Donde el <span className="text-hueso-seda font-semibold">arte</span> encuentra su <span className="text-hueso-seda font-semibold">esencia</span><br />
            y la <span className="text-hueso-seda font-semibold">eternidad</span><br />
            su <span className="text-hueso-seda font-semibold">presencia</span>.
          </h1>

          <LuxuryButton 
            variant="primary" 
            className="!bg-hueso-seda/10 !text-hueso-seda !border-hueso-seda hover:!bg-hueso-seda hover:!text-verde-ebano backdrop-blur-md shadow-2xl transition-luxury text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] py-3 sm:py-4 px-6 sm:px-10"
          >
            Comenzar Experiencia
          </LuxuryButton>
        </motion.div>

        {/* Initial Scroll Cue Badge — Soft entrance animation */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.35, ease: "easeOut" }}
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[8px] sm:text-[10px] text-hueso-seda uppercase tracking-[0.3em] sm:tracking-[0.4em] font-light shadow-lg bg-verde-ebano/40 px-3 py-1.5 border border-hueso-seda/20 backdrop-blur-md">
              Desliza para descubrir
            </span>
            <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-oro-antiguo to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Feed Personalizado — Haul de Piezas Recientes de Nuevas Colecciones (Cambia cada 2 segundos) */}
      <div className="relative z-10 bg-verde-ebano">
        <HaulCarousel />
      </div>
    </div>
  );
};
