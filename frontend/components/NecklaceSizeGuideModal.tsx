"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Ruler, Maximize2 } from "lucide-react";

export interface NecklaceSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NecklaceSizeGuideModal: React.FC<NecklaceSizeGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#2C3729]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-[95vw] max-w-7xl max-h-[90vh] bg-[#E5DBD6] border-2 border-[#CBB67B] shadow-2xl text-[#2C3729] rounded-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="z-20 bg-[#E5DBD6] border-b border-[#2C3729]/15 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2C3729]/5 flex items-center justify-center text-[#CBB67B] border border-[#CBB67B]/30">
                <Ruler size={16} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-[#2C3729]">Guía para Medida de Collares</h2>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#2C3729]/60">Minerva Alcaraz · Medidas Oficiales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#2C3729]/5 hover:bg-[#2C3729] hover:text-[#E5DBD6] transition-colors flex items-center justify-center text-[#2C3729]"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#2C3729]/10 bg-[#2C3729]/5 px-6 pt-2 overflow-x-auto shrink-0">
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-display text-[#2C3729]">La Caída Perfecta</h3>
              <p className="text-sm font-light text-[#2C3729]/80 leading-relaxed">
                Descubre cómo lucirá tu collar. Nuestras guías de referencia muestran las diferentes longitudes y caídas en silueta para que elijas la proporción ideal que realce tu escote y atuendo.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Image 1 */}
              <div className="relative w-full bg-white border border-[#2C3729]/20 shadow-lg p-2 group">
                <Image
                  src="/assets/guia-tallas/medida-collares.png"
                  alt="Guía de Medida Collares"
                  width={900}
                  height={1200}
                  className="w-full h-auto object-contain"
                />
                <button
                  onClick={() => setPreviewImage("/assets/guia-tallas/medida-collares.png")}
                  className="absolute top-4 right-4 bg-[#2C3729]/80 text-[#E5DBD6] p-2.5 rounded-full backdrop-blur-md opacity-90 hover:opacity-100 transition-opacity"
                  title="Ampliar pantalla completa"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#2C3729]/15 bg-[#2C3729]/5 px-6 py-3 flex items-center justify-between text-xs text-[#2C3729]/70">
            <span>Si tienes dudas con tu medida, nuestro Atelier te asesora personalmente.</span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#2C3729] text-[#E5DBD6] uppercase text-[10px] tracking-widest hover:bg-[#CBB67B] hover:text-[#2C3729] transition-colors"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal for HD image preview */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors"
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
