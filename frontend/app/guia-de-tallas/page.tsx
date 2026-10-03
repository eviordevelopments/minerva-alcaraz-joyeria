"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { FAQSection } from "../../components/FAQSection";
import { Check, Sparkles, Ruler } from "lucide-react";
import { RING_SIZE_DATA } from "../../components/RingSizeGuideModal";

export default function GuiaDeTallasPage() {
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcType, setCalcType] = useState<"diameter" | "circumference">("diameter");
  const [highlightedSize, setHighlightedSize] = useState<string | null>(null);

  const handleCalculate = (val: string) => {
    setCalcInput(val);
    const num = parseFloat(val);
    if (!num || isNaN(num)) {
      setHighlightedSize(null);
      return;
    }

    let closest = RING_SIZE_DATA[0];
    let minDiff = Infinity;

    RING_SIZE_DATA.forEach((item) => {
      const targetVal = calcType === "diameter" ? item.diameter : item.circumference;
      const diff = Math.abs(targetVal - num);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    });

    setHighlightedSize(closest.size);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-hueso-seda text-verde-ebano">
      <Header />

      {/* Hero Header */}
      <section className="pt-36 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 md:px-16 border-b border-verde-ebano/10 relative overflow-hidden bg-verde-ebano text-hueso-seda">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">
              Atelier & Ritual de Medición
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-tight">
              Guía de Medidas Oficiales
            </h1>
            <p className="text-base sm:text-base font-light text-hueso-seda/80 leading-relaxed max-w-xl">
              Cada joya en Minerva Alcaraz es forjada con proporciones anatómicas perfectas. 
              Explora nuestras herramientas y guías integradas para encontrar tu talla perfecta en anillos, pulseras y collares.
            </p>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-hueso-seda/10 border border-oro-antiguo/30 rounded-full p-6 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <Image
              src="/assets/guia-tallas/medida-anillo-diametro.png"
              alt="Ilustración Guía de Medidas Minerva Alcaraz"
              fill
              className="object-contain p-6 brightness-110"
              priority
            />
          </div>
        </div>
      </section>

      {/* Navigation Section with Silhouettes */}
      <section className="border-b border-verde-ebano/15 bg-white/40">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Descubre tu Proporción Ideal</span>
            <h2 className="text-2xl sm:text-3xl font-display text-verde-ebano mt-2">Selecciona tu Pieza</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => scrollToSection("anillos")}
              className="group cursor-pointer flex flex-col items-center text-center space-y-4 p-8 border border-verde-ebano/10 hover:border-oro-antiguo hover:bg-hueso-seda transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-full bg-verde-ebano/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* SVG Ring */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-verde-ebano/80">
                  <circle cx="12" cy="14" r="6" />
                  <path d="M10.5 8l1.5-3 1.5 3" />
                  <path d="M8.5 10l3-1.5 3 1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-display text-verde-ebano uppercase tracking-widest">Anillos</h3>
              <p className="text-xs text-verde-ebano/60 uppercase tracking-widest">Guía & Calculadora</p>
            </div>
            
            <div 
              onClick={() => scrollToSection("pulseras")}
              className="group cursor-pointer flex flex-col items-center text-center space-y-4 p-8 border border-verde-ebano/10 hover:border-oro-antiguo hover:bg-hueso-seda transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-full bg-verde-ebano/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* SVG Bracelet */}
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-verde-ebano/80">
                  <ellipse cx="12" cy="12" rx="9" ry="4" />
                </svg>
              </div>
              <h3 className="text-xl font-display text-verde-ebano uppercase tracking-widest">Pulseras</h3>
              <p className="text-xs text-verde-ebano/60 uppercase tracking-widest">Guía Visual</p>
            </div>

            <div 
              onClick={() => scrollToSection("collares")}
              className="group cursor-pointer flex flex-col items-center text-center space-y-4 p-8 border border-verde-ebano/10 hover:border-oro-antiguo hover:bg-hueso-seda transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-24 h-24 rounded-full bg-verde-ebano/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* SVG Necklace */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-verde-ebano/80">
                  <path d="M5 4c0 7 4 14 7 14s7-7 7-14" />
                  <circle cx="12" cy="18" r="2" />
                </svg>
              </div>
              <h3 className="text-xl font-display text-verde-ebano uppercase tracking-widest">Collares</h3>
              <p className="text-xs text-verde-ebano/60 uppercase tracking-widest">Siluetas de Caída</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 space-y-32">

        {/* SECTION 1: ANILLOS */}
        <section id="anillos" className="space-y-16 scroll-mt-32">
          <div className="text-center max-w-2xl mx-auto space-y-3 border-b border-verde-ebano/15 pb-8">
            <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Medidas Oficiales</span>
            <h2 className="text-4xl sm:text-5xl font-display text-verde-ebano">Guía de Anillos</h2>
          </div>

          {/* Calculator and Table */}
          <div className="space-y-8">
            <div className="bg-verde-ebano text-hueso-seda p-6 sm:p-8 border-2 border-oro-antiguo/40 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-oro-antiguo" />
                  <div>
                    <h3 className="text-lg font-display">Calculadora Interactiva</h3>
                    <p className="text-sm text-hueso-seda/70">Ingresa tus milímetros medidos con la regla</p>
                  </div>
                </div>
                <div className="flex bg-hueso-seda/10 p-1 rounded text-sm uppercase tracking-wider">
                  <button
                    onClick={() => { setCalcType("diameter"); handleCalculate(calcInput); }}
                    className={`px-4 py-1.5 rounded transition-colors ${calcType === "diameter" ? "bg-oro-antiguo text-verde-ebano font-semibold" : "text-hueso-seda/70"}`}
                  >
                    Diámetro (mm)
                  </button>
                  <button
                    onClick={() => { setCalcType("circumference"); handleCalculate(calcInput); }}
                    className={`px-4 py-1.5 rounded transition-colors ${calcType === "circumference" ? "bg-oro-antiguo text-verde-ebano font-semibold" : "text-hueso-seda/70"}`}
                  >
                    Circunferencia (mm)
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder={calcType === "diameter" ? "Ej. 16.5 mm" : "Ej. 51.9 mm"}
                  value={calcInput}
                  onChange={(e) => handleCalculate(e.target.value)}
                  className="w-full sm:w-64 bg-hueso-seda text-verde-ebano px-4 py-3 text-base font-medium outline-none border border-oro-antiguo focus:ring-2 focus:ring-oro-antiguo"
                />
                <div className="flex-1 text-base text-hueso-seda/80">
                  {highlightedSize ? (
                    <div className="flex items-center gap-3 bg-hueso-seda/10 border border-oro-antiguo/50 px-4 py-2 rounded">
                      <Check className="text-oro-antiguo" size={20} />
                      <span>
                        Tu talla sugerida en México es: <strong className="text-oro-antiguo text-xl font-display underline">{highlightedSize}</strong>
                      </span>
                    </div>
                  ) : (
                    <span className="italic text-sm text-hueso-seda/60">
                      Ingresa tus mm para resaltar automáticamente tu talla en la tabla de abajo.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border border-verde-ebano/20 overflow-hidden bg-white/80 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-verde-ebano text-hueso-seda text-sm uppercase tracking-widest border-b border-verde-ebano">
                    <th className="p-4 text-center font-display">Tamaño México</th>
                    <th className="p-4 text-center font-display">Diámetro Interior (mm)</th>
                    <th className="p-4 text-center font-display">Circunferencia Interior (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-verde-ebano/10 text-base">
                  {RING_SIZE_DATA.map((item) => {
                    const isHighlighted = highlightedSize === item.size;
                    return (
                      <tr
                        key={item.size}
                        className={`transition-colors ${
                          isHighlighted
                            ? "bg-oro-antiguo/30 font-bold text-verde-ebano scale-[1.01]"
                            : "hover:bg-verde-ebano/5"
                        }`}
                      >
                        <td className="p-4 text-center font-display text-base text-verde-ebano">
                          Talla {item.size}
                        </td>
                        <td className="p-4 text-center text-verde-ebano/85">{item.diameter} mm</td>
                        <td className="p-4 text-center text-verde-ebano/85">{item.circumference} mm</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrated Images */}
          <div className="flex flex-col gap-12 mt-12">
            {/* Diámetro y Circunferencia (Side by side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {[
                "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/Medida%20anillo-01%20(3).png",
                "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/Medida%20anillo-02%20(3).png",
              ].map((src, idx) => (
                <div key={idx} className="w-full relative group mix-blend-multiply flex justify-center">
                  <Image
                    src={src}
                    alt={`Guía de Medición Anillos ${idx + 1}`}
                    width={600}
                    height={450}
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {/* Guías Extendidas */}
            <div className="flex flex-col gap-12 mt-8">
              {[
                "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/GUIA%20DE%20ANILLOS%202.png",
                "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/GUIA%20DE%20ANILLOS%203.png",
              ].map((src, idx) => (
                <div key={idx} className="w-full relative group mix-blend-multiply flex justify-center">
                  <Image
                    src={src}
                    alt={`Guía de Anillos ${idx + 1}`}
                    width={1200}
                    height={900}
                    className="w-full h-auto object-contain max-w-4xl"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: PULSERAS */}
        <section id="pulseras" className="space-y-16 scroll-mt-32 pt-16 border-t border-verde-ebano/15">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Ajuste Perfecto</span>
            <h2 className="text-4xl sm:text-5xl font-display text-verde-ebano">Guía de Pulseras</h2>
            <p className="text-base text-verde-ebano/70 font-light">
              Nuestras pulseras están diseñadas para ajustarse elegantemente a la muñeca. Utiliza estas guías visuales para determinar la medida ideal que te brinde comodidad y sofisticación.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {[
              "https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/GUIA%20DE%20MEDIDA%20PULSERAS%20(1).png"
            ].map((src, idx) => (
              <div key={idx} className="relative w-full group mix-blend-multiply flex justify-center">
                <Image
                  src={src}
                  alt={`Guía de Medida Pulseras ${idx + 1}`}
                  width={1200}
                  height={900}
                  className="w-full h-auto object-contain max-w-4xl"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: COLLARES */}
        <section id="collares" className="space-y-16 scroll-mt-32 pt-16 border-t border-verde-ebano/15">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">La Caída Perfecta</span>
            <h2 className="text-4xl sm:text-5xl font-display text-verde-ebano">Guía de Collares</h2>
            <p className="text-base text-verde-ebano/70 font-light">
              Descubre cómo lucirá tu collar. Nuestra guía de referencia muestra las diferentes longitudes y caídas en silueta para que elijas la proporción ideal que realce tu escote y atuendo.
            </p>
          </div>

          <div className="relative w-full group mix-blend-multiply flex justify-center mt-12">
            <Image
              src="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/MEDIDA%20COLLARES%20MUJER%20(1).png"
              alt="Guía de Medida Collares"
              width={1200}
              height={900}
              className="w-full h-auto object-contain max-w-4xl"
              unoptimized
            />
          </div>
        </section>

      </div>

      <FAQSection />
      <Footer />
    </main>
  );
}
