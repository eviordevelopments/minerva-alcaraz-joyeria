"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { FAQSection } from "../../components/FAQSection";
import { Ruler, Download, ArrowRight, Check, Sparkles } from "lucide-react";
import { RING_SIZE_DATA, RingSizeGuideModal } from "../../components/RingSizeGuideModal";

export default function GuiaDeTallasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <main className="min-h-screen bg-hueso-seda text-verde-ebano">
      <Header />

      {/* Hero Header */}
      <section className="pt-36 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 md:px-16 border-b border-verde-ebano/10 relative overflow-hidden bg-verde-ebano text-hueso-seda">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-oro-antiguo font-medium">
              Atelier & Ritual de Medición
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-tight">
              Guía para el Tamaño de Anillos
            </h1>
            <p className="text-sm sm:text-base font-light text-hueso-seda/80 leading-relaxed max-w-xl">
              Cada joya en Minerva Alcaraz es forjada con proporciones anatómicas perfectas. 
              Utiliza esta guía ilustrada para determinar con precisión matemática tu talla de anillo.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 bg-oro-antiguo text-verde-ebano text-xs uppercase tracking-[0.25em] font-semibold hover:bg-hueso-seda transition-all shadow-lg flex items-center gap-2"
              >
                <Ruler size={16} /> Abrir Modal Interactivo
              </button>
              <a
                href="/assets/guia-tallas/guia-tallas-completa.png"
                download="Guia_Tallas_Anillos_Minerva_Alcaraz.png"
                className="px-6 py-3.5 border border-hueso-seda/40 text-hueso-seda text-xs uppercase tracking-[0.25em] hover:border-oro-antiguo hover:text-oro-antiguo transition-all flex items-center gap-2"
              >
                <Download size={16} /> Descargar Infografía PNG
              </a>
            </div>
          </div>

          {/* Line-Art Illustration Header Hero */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-hueso-seda/10 border border-oro-antiguo/30 rounded-full p-6 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <Image
              src="/assets/guia-tallas/medida-anillo-diametro.png"
              alt="Ilustración Guía de Anillos Minerva Alcaraz"
              fill
              className="object-contain p-6 brightness-110"
              priority
            />
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 py-16 sm:py-24 space-y-20">

        {/* SECTION 1: Método de Medición en 3 Pasos con Diagramas */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Técnica Artesanal</span>
            <h2 className="text-3xl sm:text-4xl font-display text-verde-ebano">Método de Medición</h2>
            <p className="text-sm text-verde-ebano/70 font-light">
              Sigue estos 3 sencillos pasos en casa con una regla milimétrica estándar para medir un anillo actual o el contorno de tu dedo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/60 border border-verde-ebano/15 p-6 sm:p-8 flex flex-col items-center text-center space-y-4 hover:border-oro-antiguo transition-colors group">
              <span className="w-10 h-10 rounded-full bg-verde-ebano text-oro-antiguo font-display font-bold text-lg flex items-center justify-center border border-oro-antiguo">
                1
              </span>
              <h3 className="text-lg font-display text-verde-ebano">Consigue una Regla</h3>
              <p className="text-xs text-verde-ebano/80 leading-relaxed font-light">
                De preferencia debe contener graduación limpia en milímetros (mm) o centímetros (cm).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/60 border border-verde-ebano/15 p-6 sm:p-8 flex flex-col items-center text-center space-y-4 hover:border-oro-antiguo transition-colors group">
              <span className="w-10 h-10 rounded-full bg-verde-ebano text-oro-antiguo font-display font-bold text-lg flex items-center justify-center border border-oro-antiguo">
                2
              </span>
              <h3 className="text-lg font-display text-verde-ebano">Mide el Interior del Anillo</h3>
              <p className="text-xs text-verde-ebano/80 leading-relaxed font-light">
                Colócalo sobre una superficie plana y mide el diámetro interno del anillo con la regla (de borde interno a borde interno).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/60 border border-verde-ebano/15 p-6 sm:p-8 flex flex-col items-center text-center space-y-4 hover:border-oro-antiguo transition-colors group">
              <span className="w-10 h-10 rounded-full bg-verde-ebano text-oro-antiguo font-display font-bold text-lg flex items-center justify-center border border-oro-antiguo">
                3
              </span>
              <h3 className="text-lg font-display text-verde-ebano">Busca tu Talla</h3>
              <p className="text-xs text-verde-ebano/80 leading-relaxed font-light">
                En la tabla interactiva a continuación encontrarás tu equivalencia exacta en milímetros para México.
              </p>
            </div>
          </div>

          {/* High Resolution Line-Art Diagram Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="border border-verde-ebano/15 bg-white/40 p-8 flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 bg-hueso-seda border border-oro-antiguo/30 rounded-full flex items-center justify-center p-6 shadow-inner">
                <Image
                  src="/assets/guia-tallas/medida-anillo-diametro.png"
                  alt="Medida Diámetro Anillo"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo font-semibold">Diagrama 01</span>
                <h4 className="text-xl font-display text-verde-ebano">Medida de Diámetro Interior</h4>
                <p className="text-xs text-verde-ebano/75 mt-2 leading-relaxed max-w-sm">
                  Distancia exacta a través del centro interior del anillo en milímetros.
                </p>
              </div>
            </div>

            <div className="border border-verde-ebano/15 bg-white/40 p-8 flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 bg-hueso-seda border border-oro-antiguo/30 rounded-full flex items-center justify-center p-6 shadow-inner">
                <Image
                  src="/assets/guia-tallas/medida-anillo-circunferencia.png"
                  alt="Medida Circunferencia Anillo"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo font-semibold">Diagrama 02</span>
                <h4 className="text-xl font-display text-verde-ebano">Medida de Circunferencia del Dedo</h4>
                <p className="text-xs text-verde-ebano/75 mt-2 leading-relaxed max-w-sm">
                  Perímetro completo alrededor del nudillo o base del dedo en milímetros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Calculadora & Tabla de Tallas México (3 a 13) */}
        <section className="space-y-8 border-t border-verde-ebano/15 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Equivalencias Oficiales</span>
              <h2 className="text-3xl sm:text-4xl font-display text-verde-ebano">Tabla de Tallas de Anillos (México)</h2>
            </div>
            <p className="text-xs text-verde-ebano/70 max-w-md font-light">
              Nuestros tamaños corresponden al estándar oficial para México (tallas 3 a 13 con incrementos de media talla).
            </p>
          </div>

          {/* Interactive Calculator Banner */}
          <div className="bg-verde-ebano text-hueso-seda p-6 sm:p-8 border-2 border-oro-antiguo/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-oro-antiguo" />
                <div>
                  <h3 className="text-lg font-display">Calculadora Interactiva de Talla</h3>
                  <p className="text-xs text-hueso-seda/70">Ingresa tus milímetros medidos con la regla</p>
                </div>
              </div>
              <div className="flex bg-hueso-seda/10 p-1 rounded text-xs uppercase tracking-wider">
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
                className="w-full sm:w-64 bg-hueso-seda text-verde-ebano px-4 py-3 text-sm font-medium outline-none border border-oro-antiguo focus:ring-2 focus:ring-oro-antiguo"
              />
              <div className="flex-1 text-sm text-hueso-seda/80">
                {highlightedSize ? (
                  <div className="flex items-center gap-3 bg-hueso-seda/10 border border-oro-antiguo/50 px-4 py-2 rounded">
                    <Check className="text-oro-antiguo" size={20} />
                    <span>
                      Tu talla sugerida en México es: <strong className="text-oro-antiguo text-xl font-display underline">{highlightedSize}</strong>
                    </span>
                  </div>
                ) : (
                  <span className="italic text-xs text-hueso-seda/60">
                    Ingresa tus mm para resaltar automáticamente tu talla en la tabla de abajo.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full Size Table */}
          <div className="border border-verde-ebano/20 overflow-hidden bg-white/80 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-verde-ebano text-hueso-seda text-xs uppercase tracking-widest border-b border-verde-ebano">
                  <th className="p-4 text-center font-display">Tamaño México</th>
                  <th className="p-4 text-center font-display">Diámetro Interior (mm)</th>
                  <th className="p-4 text-center font-display">Circunferencia Interior (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-verde-ebano/10 text-sm">
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
        </section>

        {/* SECTION 3: Infografía Completa descargable */}
        <section className="space-y-8 border-t border-verde-ebano/15 pt-16 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Documento Oficial</span>
            <h2 className="text-3xl sm:text-4xl font-display text-verde-ebano">Infografía de Guía de Tallas</h2>
            <p className="text-sm text-verde-ebano/70 font-light">
              Puedes ver la infografía oficial completa creada para Minerva Alcaraz Joyería o descargar una copia digital.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl bg-white border border-verde-ebano/20 shadow-2xl p-4 my-4">
              <Image
                src="/assets/guia-tallas/guia-tallas-completa.png"
                alt="Infografía Completa Guía para el Tamaño de Anillos Minerva Alcaraz"
                width={900}
                height={1600}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="pt-4">
              <a
                href="/assets/guia-tallas/guia-tallas-completa.png"
                download="Guia_Tallas_Anillos_Minerva_Alcaraz.png"
                className="inline-flex items-center gap-2 px-8 py-4 bg-verde-ebano text-hueso-seda text-xs uppercase tracking-[0.25em] hover:bg-oro-antiguo hover:text-verde-ebano transition-all shadow-xl"
              >
                <Download size={16} /> Descargar Infografía Completa
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* Interactive Modal */}
      <RingSizeGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <FAQSection />
      <Footer />
    </main>
  );
}
