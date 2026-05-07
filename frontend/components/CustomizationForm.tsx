"use client";

import React from "react";
import { motion } from "framer-motion";
import { LuxuryButton } from "./DesignSystem";
import { MessageCircle, PenTool, Sparkles, User, Info } from "lucide-react";

export const CustomizationForm = () => {
  return (
    <section className="bg-authority p-12 md:p-20 shadow-2xl relative overflow-hidden">
      {/* Subtle background icon */}
      <div className="absolute -bottom-20 -left-20 text-[200px] text-hueso-seda/5 pointer-events-none">
        <PenTool size={200} strokeWidth={0.5} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-4xl font-display text-oro-antiguo">Diseño Personalizado</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-hueso-seda/60">
            Cree una pieza que trascienda generaciones
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* User Info */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-oro-antiguo/50 flex items-center gap-2">
              <User size={12} /> Nombre
            </label>
            <input 
              type="text" 
              className="bg-transparent border-b border-hueso-seda/10 py-2 text-sm text-hueso-seda focus:border-oro-antiguo outline-none transition-colors"
              placeholder="Su Nombre"
            />
          </div>

          {/* WhatsApp Field (Required by Prompt) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-oro-antiguo/50 flex items-center gap-2">
              <MessageCircle size={12} /> WhatsApp de Contacto
            </label>
            <input 
              type="tel" 
              className="bg-transparent border-b border-hueso-seda/10 py-2 text-sm text-hueso-seda focus:border-oro-antiguo outline-none transition-colors"
              placeholder="+52 ... (Para asesoría inmediata)"
            />
          </div>

          {/* Design Idea */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-oro-antiguo/50 flex items-center gap-2">
              <Sparkles size={12} /> Describa su Visión
            </label>
            <textarea 
              rows={4}
              className="bg-hueso-seda/5 border border-hueso-seda/10 p-4 text-sm text-hueso-seda focus:border-oro-antiguo outline-none transition-colors"
              placeholder="Comparta la historia, los materiales o la inspiración para su pieza única..."
            />
          </div>

          {/* Ocassion */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-oro-antiguo/50 flex items-center gap-2">
              <Info size={12} /> Ocasión
            </label>
            <select className="bg-transparent border-b border-hueso-seda/10 py-2 text-sm text-hueso-seda focus:border-oro-antiguo outline-none transition-colors appearance-none">
              <option className="bg-verde-ebano">Compromiso</option>
              <option className="bg-verde-ebano">Aniversario</option>
              <option className="bg-verde-ebano">Legado Personal</option>
              <option className="bg-verde-ebano">Otro</option>
            </select>
          </div>

          <div className="flex items-center justify-end md:pt-4">
            <LuxuryButton variant="secondary" className="w-full md:w-fit">
              Enviar Propuesta de Diseño
            </LuxuryButton>
          </div>
        </form>

        <p className="text-[8px] uppercase tracking-[0.3em] text-hueso-seda/30 text-center">
          Al enviar este formulario, un maestro joyero se pondrá en contacto con usted vía WhatsApp para iniciar el proceso creativo.
        </p>
      </div>
    </section>
  );
};
