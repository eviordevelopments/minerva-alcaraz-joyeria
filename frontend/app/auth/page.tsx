"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LuxuryButton } from "../../components/DesignSystem";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleDemoLogin = (type: 'standard' | 'circle') => {
    const mockUser = {
      id: "u-123",
      email: email || "invitado@ejemplo.com",
      fullName: "Emiliano Castillo",
      isCircleMember: type === 'circle',
      points: type === 'circle' ? 1250 : 0
    };
    
    setUser(mockUser);
    if (type === 'circle') {
      router.push("/the-circle/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 md:pt-48 pb-32 luxury-container flex flex-col items-center">
        <div className="max-w-md w-full bg-authority p-12 md:p-16 shadow-2xl flex flex-col gap-10">
          <div className="text-center flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">El Acceso</span>
            <h1 className="text-3xl font-display text-hueso-seda uppercase tracking-widest">Identificación</h1>
            <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-light">Acceda a su herencia y curaduría personal</p>
          </div>

          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-3">
              <label className="text-[9px] uppercase tracking-[0.4em] text-hueso-seda/40">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-hueso-seda/20 py-2 text-hueso-seda outline-none focus:border-oro-antiguo transition-colors"
                placeholder="usuario@minervaalcaraz.com"
              />
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
              <LuxuryButton 
                onClick={() => handleDemoLogin('circle')}
                variant="secondary" 
                className="!bg-oro-antiguo !text-verde-ebano !border-none py-4 text-[10px]"
              >
                Acceder como Miembro THE CIRCLE
              </LuxuryButton>
              <button 
                onClick={() => handleDemoLogin('standard')}
                className="text-[9px] uppercase tracking-[0.3em] text-hueso-seda/50 hover:text-oro-antiguo transition-colors py-2"
              >
                Entrar como Invitado
              </button>
            </div>
          </form>

          <div className="pt-10 border-t border-hueso-seda/5 text-center flex flex-col gap-4">
            <p className="text-[9px] opacity-30 uppercase tracking-widest leading-relaxed">
              Al acceder, usted acepta que el tiempo es un material noble y que su privacidad es nuestro tesoro más custodiado.
            </p>
            <Link href="/privacy" className="text-[9px] text-oro-antiguo uppercase tracking-widest hover:underline">
              Aviso de Privacidad
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

import Link from "next/link";
