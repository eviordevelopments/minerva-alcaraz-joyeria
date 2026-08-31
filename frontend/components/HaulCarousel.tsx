"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Eye, RefreshCw } from "lucide-react";
import { Product } from "../constants/products";

export const HaulCarousel: React.FC = () => {
  const [haulItems, setHaulItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const { products } = await res.json();
          const items = (products || [])
            .filter((p: Product) => p.featured || ["Amatista", "Chai", "Escencia", "Diseños de Autor", "Etérea", "Serpientes"].includes(p.collection))
            .slice(0, 6);
          setHaulItems(items);
        }
      } catch (err) {
        console.error("Error fetching haul products", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Always auto-advance continuously every 5 seconds (5000ms)
  useEffect(() => {
    if (haulItems.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % haulItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [haulItems.length]);

  if (isLoading) {
    return (
      <section className="w-full bg-verde-ebano text-hueso-seda py-32 flex justify-center items-center">
        <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-oro-antiguo">
          <RefreshCw className="animate-spin" size={14} /> Preparando Selección
        </span>
      </section>
    );
  }

  if (haulItems.length === 0) return null;

  const currentItem = haulItems[currentIndex];

  return (
    <section className="w-full bg-verde-ebano text-hueso-seda py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 border-t border-b border-oro-antiguo/20 relative overflow-hidden">
      {/* Delicate background ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-oro-antiguo/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-oro-antiguo/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hueso-seda/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-oro-antiguo text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-semibold mb-2">
              <Sparkles size={13} /> Nuestra Selección para Ti
            </div>
            <h2 className="text-2xl sm:text-4xl font-display text-hueso-seda">
              Colecciones Minerva Alcaraz
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-hueso-seda/60 font-mono">
              0{currentIndex + 1} / 0{haulItems.length}
            </span>
          </div>
        </div>

        {/* Continuous 5-Second Progress Bar */}
        <div className="w-full bg-hueso-seda/10 h-0.5 relative overflow-hidden rounded-full">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.0, ease: "linear" }}
            className="h-full bg-oro-antiguo"
          />
        </div>

        {/* Carousel Slide Card */}
        <div className="relative min-h-[420px] sm:min-h-[480px] bg-verde-ebano/60 border border-hueso-seda/15 p-6 sm:p-10 lg:p-12 rounded-sm shadow-2xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
            >
              {/* Product Image — Exactly 50% (Half Page/Card Width) */}
              <div className="lg:col-span-1 relative w-full aspect-square lg:aspect-[4/3.5] overflow-hidden bg-hueso-seda/5 border border-oro-antiguo/30 shadow-2xl group">
                <Image
                  src={currentItem.images[0]}
                  alt={currentItem.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <span className="absolute top-4 left-4 bg-verde-ebano/85 backdrop-blur-md px-3.5 py-1.5 text-[9px] uppercase tracking-[0.3em] text-oro-antiguo border border-oro-antiguo/40 font-mono shadow-md">
                  {currentItem.collection}
                </span>
                <span className="absolute bottom-4 right-4 bg-hueso-seda/95 backdrop-blur-md text-verde-ebano px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold shadow-lg">
                  ${currentItem.price.toLocaleString("es-MX")} {currentItem.currency}
                </span>
              </div>

              {/* Product Content Details — Exactly 50% */}
              <div className="lg:col-span-1 flex flex-col space-y-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-oro-antiguo font-mono">
                      SKU: {currentItem.sku}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest px-2.5 py-0.5 border border-hueso-seda/30 text-hueso-seda/80">
                      {currentItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-display text-hueso-seda leading-tight">
                    {currentItem.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-light text-hueso-seda/85 leading-relaxed italic border-l-2 border-oro-antiguo pl-4 py-1">
                  &quot;{currentItem.description}&quot;
                </p>

                {/* Materials & Significado badge */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {currentItem.materials.map((m) => (
                      <span
                        key={m}
                        className="text-[9px] uppercase tracking-widest px-3 py-1 bg-hueso-seda/10 border border-hueso-seda/15 text-hueso-seda/90"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {currentItem.significado && (
                    <p className="text-[11px] text-hueso-seda/70 font-light pt-1">
                      ✨ <strong className="text-oro-antiguo font-medium">Esencia:</strong> {currentItem.significado}
                    </p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href={`/product/${currentItem.id}`}>
                    <button className="px-6 py-3.5 bg-oro-antiguo text-verde-ebano text-xs uppercase tracking-[0.25em] font-semibold hover:bg-hueso-seda transition-all shadow-xl flex items-center gap-2 group">
                      <Eye size={14} /> Explorar Pieza <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/shop">
                    <button className="px-6 py-3.5 border border-hueso-seda/30 text-hueso-seda text-xs uppercase tracking-[0.25em] hover:border-oro-antiguo hover:text-oro-antiguo transition-all">
                      Ver Colección Completa
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Selector Strip (Click to view immediately) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
          {haulItems.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-[4/3] overflow-hidden border transition-all ${
                  isActive
                    ? "border-oro-antiguo ring-1 ring-oro-antiguo scale-[1.02]"
                    : "border-hueso-seda/20 opacity-60 hover:opacity-100 hover:border-hueso-seda/50"
                }`}
              >
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-verde-ebano/30" />
                <span className="absolute bottom-1 left-1.5 text-[8px] font-mono text-hueso-seda uppercase truncate max-w-[90%]">
                  {item.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
