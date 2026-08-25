"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibilityStore } from "../lib/store/useAccessibilityStore";
import { X, Moon, Sun, Type, Contrast, Volume2, VolumeX } from "lucide-react";

export function AccessibilityPanel() {
  const { 
    isPanelOpen, setPanelOpen, 
    theme, setTheme, 
    fontSize, setFontSize, 
    highContrast, setHighContrast, 
    voiceReader, setVoiceReader 
  } = useAccessibilityStore();

  if (!isPanelOpen) return null;

  return (
    <AnimatePresence>
      <div id="a11y-panel" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPanelOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#E5DBD6] border border-[#2C3729]/20 shadow-2xl p-8"
        >
          <button 
            onClick={() => setPanelOpen(false)}
            className="absolute top-4 right-4 text-[#2C3729]/50 hover:text-[#2C3729] transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display text-[#2C3729] uppercase tracking-widest mb-1">
              Accesibilidad
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#2C3729]/60">
              Personaliza tu experiencia
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between border-b border-[#2C3729]/10 pb-4">
              <div className="flex items-center gap-3 text-[#2C3729]">
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <span className="text-xs uppercase tracking-widest">Modo Oscuro</span>
              </div>
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${theme === 'dark' ? 'bg-[#CBB67B]' : 'bg-[#2C3729]/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className="flex items-center justify-between border-b border-[#2C3729]/10 pb-4">
              <div className="flex items-center gap-3 text-[#2C3729]">
                <Type size={18} />
                <span className="text-xs uppercase tracking-widest">Texto Grande</span>
              </div>
              <button 
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${fontSize === 'large' ? 'bg-[#CBB67B]' : 'bg-[#2C3729]/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fontSize === 'large' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between border-b border-[#2C3729]/10 pb-4">
              <div className="flex items-center gap-3 text-[#2C3729]">
                <Contrast size={18} />
                <span className="text-xs uppercase tracking-widest">Alto Contraste</span>
              </div>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${highContrast ? 'bg-[#CBB67B]' : 'bg-[#2C3729]/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Voice Reader Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-[#2C3729]">
                {voiceReader ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest">Lectura por Voz</span>
                  <span className="text-[9px] text-[#2C3729]/50 tracking-wider">Haz clic en textos para leer</span>
                </div>
              </div>
              <button 
                onClick={() => setVoiceReader(!voiceReader)}
                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${voiceReader ? 'bg-[#CBB67B]' : 'bg-[#2C3729]/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${voiceReader ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
