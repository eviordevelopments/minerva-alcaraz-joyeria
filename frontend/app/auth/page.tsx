"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { LuxuryButton } from "../components/DesignSystem";
import { User, Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen bg-hueso-seda flex flex-col md:flex-row overflow-hidden">
      <Header />
      
      {/* Left Side: Brand Narrative / Visual */}
      <div className="hidden md:flex md:w-1/2 bg-authority relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/hero-section_image.JPG" 
            alt="Minerva Alcaraz Heritage" 
            fill 
            className="object-cover grayscale"
          />
        </div>
        
        <div className="relative z-10 flex flex-col gap-8 max-w-lg">
          <Star className="text-oro-antiguo" size={32} strokeWidth={1} />
          <h2 className="text-5xl font-display text-hueso-seda leading-tight">
            Únase a la Herencia de THE CIRCLE
          </h2>
          <p className="text-sm text-hueso-seda/60 tracking-widest leading-loose uppercase">
            Más que una membresía, es un acceso privilegiado al alma de la artesanía. Descubra piezas únicas antes que nadie y disfrute del ritual de mantenimiento Atelier de por vida.
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-oro-antiguo">
              <Sparkles size={14} /> Acceso Anticipado a Lanzamientos
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-oro-antiguo">
              <Sparkles size={14} /> Servicios de Mantenimiento Atelier
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-oro-antiguo">
              <Sparkles size={14} /> Concierge Directo vía WhatsApp
            </div>
          </div>
        </div>

        {/* Floating Brand Mark */}
        <div className="absolute bottom-12 left-12 text-[80px] font-display text-hueso-seda/5 select-none">
          MA
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 pt-32 md:pt-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md flex flex-col gap-12"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-display text-verde-ebano">
              {isLogin ? "Bienvenido" : "Registro de Miembro"}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">
              {isLogin ? "Identidad Minerva Alcaraz" : "Comience su legado hoy"}
            </p>
          </div>

          <form className="flex flex-col gap-8">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-verde-ebano/50 flex items-center gap-2">
                  <User size={12} /> Nombre Completo
                </label>
                <input 
                  type="text" 
                  className="bg-transparent border-b border-plata-niebla/30 py-2 text-sm focus:border-oro-antiguo outline-none transition-colors"
                  placeholder="Su Nombre"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-verde-ebano/50 flex items-center gap-2">
                <Mail size={12} /> Correo Electrónico
              </label>
              <input 
                type="email" 
                className="bg-transparent border-b border-plata-niebla/30 py-2 text-sm focus:border-oro-antiguo outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-verde-ebano/50 flex items-center gap-2">
                <Lock size={12} /> Contraseña
              </label>
              <input 
                type="password" 
                className="bg-transparent border-b border-plata-niebla/30 py-2 text-sm focus:border-oro-antiguo outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <LuxuryButton variant="primary" className="mt-4 w-full flex items-center justify-center gap-2">
              {isLogin ? "Acceder" : "Crear Membresía"} <ArrowRight size={14} />
            </LuxuryButton>
          </form>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-widest text-oro-antiguo hover:text-verde-ebano transition-colors"
            >
              {isLogin ? "¿No tiene cuenta? Regístrese aquí" : "¿Ya es miembro? Inicie sesión"}
            </button>

            <div className="flex items-center gap-4 text-plata-niebla/30">
              <div className="h-[1px] w-12 bg-plata-niebla/10" />
              <ShieldCheck size={20} strokeWidth={1} />
              <div className="h-[1px] w-12 bg-plata-niebla/10" />
            </div>
            
            <p className="text-[8px] uppercase tracking-[0.3em] text-plata-niebla text-center max-w-xs">
              Su información está protegida bajo los más altos estándares de cifrado de THE CIRCLE.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
