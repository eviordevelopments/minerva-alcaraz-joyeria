"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Ruler, CheckCircle2, Download, Maximize2, RefreshCw } from "lucide-react";

export interface RingSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
  currentSelectedSize?: string;
}

export const RING_SIZE_DATA = [
  { size: "3", diameter: 14.1, circumference: 44.2 },
  { size: "3.5", diameter: 14.5, circumference: 45.5 },
  { size: "4", diameter: 14.9, circumference: 46.8 },
  { size: "4.5", diameter: 15.3, circumference: 48.0 },
  { size: "5", diameter: 15.7, circumference: 49.3 },
  { size: "5.5", diameter: 16.1, circumference: 50.6 },
  { size: "6", diameter: 16.5, circumference: 51.9 },
  { size: "6.5", diameter: 16.9, circumference: 53.1 },
  { size: "7", diameter: 17.3, circumference: 54.4 },
  { size: "7.5", diameter: 17.7, circumference: 55.7 },
  { size: "8", diameter: 18.1, circumference: 57.0 },
  { size: "8.5", diameter: 18.5, circumference: 58.3 },
  { size: "9", diameter: 18.9, circumference: 59.5 },
  { size: "9.5", diameter: 19.4, circumference: 60.8 },
  { size: "10", diameter: 19.8, circumference: 62.1 },
  { size: "10.5", diameter: 20.2, circumference: 63.4 },
  { size: "11", diameter: 20.6, circumference: 64.6 },
  { size: "11.5", diameter: 21.0, circumference: 65.9 },
  { size: "12", diameter: 21.4, circumference: 67.2 },
  { size: "12.5", diameter: 21.8, circumference: 68.5 },
  { size: "13", diameter: 22.2, circumference: 69.7 },
];

export const RingSizeGuideModal: React.FC<RingSizeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
  currentSelectedSize,
}) => {
  const [activeTab, setActiveTab] = useState<"tabla" | "metodo" | "infografia">("tabla");
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcType, setCalcType] = useState<"diameter" | "circumference">("diameter");
  const [highlightedSize, setHighlightedSize] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find recommended size based on mm input
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
    <AnimatePresence>
    <div className="fixed inset-0 z-50 overflow-y-auto bg-verde-ebano/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-[95vw] max-w-7xl max-h-[90vh] bg-hueso-seda border-2 border-oro-antiguo shadow-2xl text-verde-ebano rounded-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="z-20 bg-hueso-seda border-b border-verde-ebano/15 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-verde-ebano/5 flex items-center justify-center text-oro-antiguo border border-oro-antiguo/30">
                <Ruler size={16} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-verde-ebano">Guía para el Tamaño de Anillos</h2>
                <p className="text-[10px] uppercase tracking-[0.25em] text-verde-ebano/60">Minerva Alcaraz · Medidas México</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-verde-ebano/5 hover:bg-verde-ebano hover:text-hueso-seda transition-colors flex items-center justify-center text-verde-ebano"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-verde-ebano/10 bg-verde-ebano/5 px-6 pt-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("tabla")}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "tabla"
                  ? "border-oro-antiguo text-verde-ebano bg-hueso-seda"
                  : "border-transparent text-verde-ebano/60 hover:text-verde-ebano"
              }`}
            >
              Tabla de Tallas
            </button>
            <button
              onClick={() => setActiveTab("metodo")}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "metodo"
                  ? "border-oro-antiguo text-verde-ebano bg-hueso-seda"
                  : "border-transparent text-verde-ebano/60 hover:text-verde-ebano"
              }`}
            >
              Método de Medición
            </button>
            <button
              onClick={() => setActiveTab("infografia")}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "infografia"
                  ? "border-oro-antiguo text-verde-ebano bg-hueso-seda"
                  : "border-transparent text-verde-ebano/60 hover:text-verde-ebano"
              }`}
            >
              Guía de Tallas
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* TAB 1: TABLA Y CALCULADORA */}
            {activeTab === "tabla" && (
              <div className="space-y-6">

                {/* Calculador de talla rápido */}
                <div className="bg-verde-ebano text-hueso-seda p-5 border border-oro-antiguo/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo">Calculadora Instantánea</span>
                      <h3 className="text-base font-display">Encuentra tu Talla de Anillo</h3>
                    </div>
                    <div className="flex bg-hueso-seda/10 p-0.5 rounded text-[10px] uppercase tracking-wider">
                      <button
                        onClick={() => { setCalcType("diameter"); handleCalculate(calcInput); }}
                        className={`px-3 py-1 rounded ${calcType === "diameter" ? "bg-oro-antiguo text-verde-ebano font-bold" : "text-hueso-seda/70"}`}
                      >
                        Diámetro (mm)
                      </button>
                      <button
                        onClick={() => { setCalcType("circumference"); handleCalculate(calcInput); }}
                        className={`px-3 py-1 rounded ${calcType === "circumference" ? "bg-oro-antiguo text-verde-ebano font-bold" : "text-hueso-seda/70"}`}
                      >
                        Circunferencia (mm)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder={calcType === "diameter" ? "Ej: 16.5" : "Ej: 51.9"}
                      value={calcInput}
                      onChange={(e) => handleCalculate(e.target.value)}
                      className="w-full sm:w-48 bg-hueso-seda text-verde-ebano px-4 py-2.5 text-sm outline-none border border-oro-antiguo focus:ring-1 focus:ring-oro-antiguo"
                    />
                    <div className="flex-1 text-xs text-hueso-seda/80 italic">
                      {highlightedSize ? (
                        <span className="text-oro-antiguo font-semibold not-italic">
                          ✨ Talla recomendada México: <span className="text-lg underline underline-offset-4">{highlightedSize}</span>
                        </span>
                      ) : (
                        "Ingresa los milímetros medidos con tu regla para resaltar tu talla recomendada."
                      )}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-verde-ebano/15 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-verde-ebano/5 text-verde-ebano text-[11px] uppercase tracking-wider border-b border-verde-ebano/15">
                        <th className="p-3 font-semibold text-center">Tamaño México</th>
                        <th className="p-3 font-semibold text-center">Diámetro (mm)</th>
                        <th className="p-3 font-semibold text-center">Circunferencia interior (mm)</th>
                        {onSelectSize && <th className="p-3 font-semibold text-center">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-verde-ebano/10 text-xs">
                      {RING_SIZE_DATA.map((item) => {
                        const isSelected = currentSelectedSize === item.size;
                        const isHighlighted = highlightedSize === item.size;
                        return (
                          <tr
                            key={item.size}
                            className={`transition-colors ${
                              isHighlighted
                                ? "bg-oro-antiguo/20 font-semibold text-verde-ebano"
                                : isSelected
                                ? "bg-verde-ebano/10 font-medium"
                                : "hover:bg-verde-ebano/5"
                            }`}
                          >
                            <td className="p-3 text-center font-display text-sm text-verde-ebano">
                              Talla {item.size}
                            </td>
                            <td className="p-3 text-center text-verde-ebano/80">{item.diameter} mm</td>
                            <td className="p-3 text-center text-verde-ebano/80">{item.circumference} mm</td>
                            {onSelectSize && (
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => {
                                    onSelectSize(item.size);
                                    onClose();
                                  }}
                                  className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-all ${
                                    isSelected
                                      ? "bg-verde-ebano text-hueso-seda border-verde-ebano"
                                      : "border-verde-ebano/30 hover:border-oro-antiguo hover:bg-oro-antiguo/10 text-verde-ebano"
                                  }`}
                                >
                                  {isSelected ? "Seleccionada" : "Elegir"}
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: MÉTODOS DE MEDICIÓN E ILUSTRACIONES */}
            {activeTab === "metodo" && (
              <div className="space-y-8">
                {/* Visual Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Diámetro */}
                  <div className="border border-verde-ebano/15 p-5 bg-white/40 flex flex-col items-center text-center space-y-4">
                    <div className="relative w-48 h-48 bg-hueso-seda border border-oro-antiguo/20 rounded-full flex items-center justify-center p-4">
                      <Image
                        src="/assets/guia-tallas/medida-anillo-diametro.png"
                        alt="Medida de Diámetro Interior de Anillo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo font-semibold">Diagrama 01</span>
                      <h4 className="text-lg font-display text-verde-ebano">Diámetro Interior (mm)</h4>
                      <p className="text-xs text-verde-ebano/70 mt-1 leading-relaxed">
                        Mide la distancia recta pasando por el centro exacto entre los bordes internos del anillo.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Circunferencia */}
                  <div className="border border-verde-ebano/15 p-5 bg-white/40 flex flex-col items-center text-center space-y-4">
                    <div className="relative w-48 h-48 bg-hueso-seda border border-oro-antiguo/20 rounded-full flex items-center justify-center p-4">
                      <Image
                        src="/assets/guia-tallas/medida-anillo-circunferencia.png"
                        alt="Medida de Circunferencia de Dedo"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo font-semibold">Diagrama 02</span>
                      <h4 className="text-lg font-display text-verde-ebano">Circunferencia del Dedo (mm)</h4>
                      <p className="text-xs text-verde-ebano/70 mt-1 leading-relaxed">
                        Mide el perímetro o contorno completo del dedo rodeándolo con una tira de papel o cinta.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 PASOS EXPLICATIVOS */}
                <div className="border-t border-verde-ebano/15 pt-6 space-y-6">
                  <h3 className="text-xl font-display text-verde-ebano text-center">Pasos para Medir tu Anillo</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border border-verde-ebano/10 bg-verde-ebano/5 flex flex-col space-y-3">
                      <span className="w-8 h-8 bg-oro-antiguo text-verde-ebano font-bold text-sm flex items-center justify-center rounded-full">1</span>
                      <h4 className="text-sm font-semibold text-verde-ebano">Consigue una regla</h4>
                      <p className="text-xs text-verde-ebano/80 leading-relaxed">
                        De preferencia debe contener milímetros (mm) o centímetros (cm) bien graduados.
                      </p>
                    </div>

                    <div className="p-4 border border-verde-ebano/10 bg-verde-ebano/5 flex flex-col space-y-3">
                      <span className="w-8 h-8 bg-oro-antiguo text-verde-ebano font-bold text-sm flex items-center justify-center rounded-full">2</span>
                      <h4 className="text-sm font-semibold text-verde-ebano">Mide el interior del anillo</h4>
                      <p className="text-xs text-verde-ebano/80 leading-relaxed">
                        Colócalo sobre una superficie plana y mide el diámetro interno del anillo con la regla (de borde interno a borde interno).
                      </p>
                    </div>

                    <div className="p-4 border border-verde-ebano/10 bg-verde-ebano/5 flex flex-col space-y-3">
                      <span className="w-8 h-8 bg-oro-antiguo text-verde-ebano font-bold text-sm flex items-center justify-center rounded-full">3</span>
                      <h4 className="text-sm font-semibold text-verde-ebano">Busca tu talla</h4>
                      <p className="text-xs text-verde-ebano/80 leading-relaxed">
                        En la tabla de arriba encontrarás tu talla recomendada según tu medida obtenida en milímetros.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GUÍA DE TALLAS */}
            {activeTab === "infografia" && (
              <div className="space-y-10 flex flex-col items-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-verde-ebano/50 self-start">
                  Minerva Alcaraz Joyería · Guías de Medición Oficiales para Anillos
                </p>

                {/* Infografías principales: ancho completo, apiladas */}
                {[
                  { src: "/assets/guia-tallas/guia-anillos-1.png", label: "Infografía 01" },
                  { src: "/assets/guia-tallas/guia-anillos-3.png", label: "Infografía 02" },
                ].map((item, idx) => (
                  <div key={idx} className="w-full relative bg-white border border-verde-ebano/20 shadow-md group">
                    <div className="absolute top-3 left-3 z-10 bg-verde-ebano/70 backdrop-blur-sm px-3 py-1">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo">{item.label}</span>
                    </div>
                    <Image
                      src={item.src}
                      alt={item.label}
                      width={1200}
                      height={900}
                      className="w-full h-auto object-contain"
                    />
                    <button
                      onClick={() => setPreviewImage(item.src)}
                      className="absolute top-3 right-3 z-10 bg-verde-ebano/80 text-hueso-seda p-2.5 rounded-full backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Ampliar en pantalla completa"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Ilustraciones icónicas: grandes y centradas con fondo oscuro destacado */}
                <div className="w-full border-t border-verde-ebano/15 pt-8 space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">Ilustraciones Artesanales</span>
                    <h4 className="text-lg font-display text-verde-ebano">Método Visual de Medición</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { src: "/assets/guia-tallas/medida-anillo-01.png", label: "Método 01 — Diámetro" },
                      { src: "/assets/guia-tallas/medida-anillo-02.png", label: "Método 02 — Circunferencia" },
                    ].map((item, idx) => (
                      <div key={idx} className="relative bg-verde-ebano border border-oro-antiguo/30 p-8 flex flex-col items-center gap-6 group">
                        <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">{item.label}</span>
                        <div className="relative w-full flex justify-center">
                          <Image
                            src={item.src}
                            alt={item.label}
                            width={500}
                            height={500}
                            className="w-full max-w-xs h-auto object-contain drop-shadow-xl"
                          />
                        </div>
                        <button
                          onClick={() => setPreviewImage(item.src)}
                          className="absolute top-4 right-4 bg-hueso-seda/20 text-hueso-seda p-2 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                          title="Ampliar en pantalla completa"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="border-t border-verde-ebano/15 bg-verde-ebano/5 px-6 py-3 flex items-center justify-between text-xs text-verde-ebano/70">
            <span>Si tienes dudas con tu medida, nuestro Atelier te asesora personalmente.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-verde-ebano text-hueso-seda uppercase text-[10px] tracking-widest hover:bg-oro-antiguo hover:text-verde-ebano transition-colors"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </div>

      {/* Lightbox Modal for HD image preview */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/40"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={previewImage}
              alt="Vista previa ampliada"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
