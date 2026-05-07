"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { LuxuryButton } from "../components/DesignSystem";
import { ShieldCheck, Lock, Globe, ArrowRight, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const handleComplete = () => {
    setIsFinished(true);
  };

  if (isFinished) {
    return (
      <main className="min-h-screen bg-authority flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center flex flex-col items-center gap-8 max-w-2xl"
        >
          <CheckCircle size={64} className="text-oro-antiguo" strokeWidth={0.5} />
          <h1 className="text-5xl font-display text-hueso-seda leading-tight">
            Bienvenido a la Herencia de Minerva Alcaraz
          </h1>
          <p className="text-sm text-hueso-seda/60 tracking-widest leading-loose uppercase">
            Su adquisición ha sido registrada. Ahora usted es custodio de una pieza de diseño eterno. Recibirá los detalles del ritual de envío en su correo.
          </p>
          <div className="h-[1px] w-24 bg-oro-antiguo/30" />
          <LuxuryButton variant="secondary" onClick={() => window.location.href = "/"}>
            Regresar al Atelier
          </LuxuryButton>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 px-8 md:px-16 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Checkout Form (Minimalist) */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-display text-verde-ebano">Finalizar Adquisición</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Flujo de Prestancia y Seguridad</p>
            </div>

            <div className="flex flex-col gap-16">
              {/* Shipping Information */}
              <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-oro-antiguo">01. Envío Premium</span>
                  <div className="h-[1px] flex-1 bg-plata-niebla/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Correo Electrónico" className="checkout-input col-span-full" />
                  <input type="text" placeholder="Nombre Completo" className="checkout-input" />
                  <input type="text" placeholder="Teléfono / WhatsApp" className="checkout-input" />
                  <input type="text" placeholder="Dirección (Auto-completado)" className="checkout-input col-span-full" />
                  <input type="text" placeholder="Ciudad" className="checkout-input" />
                  <input type="text" placeholder="Código Postal" className="checkout-input" />
                </div>
              </section>

              {/* Payment Method */}
              <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-oro-antiguo">02. Método de Pago</span>
                  <div className="h-[1px] flex-1 bg-plata-niebla/10" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="p-6 border border-verde-ebano flex justify-between items-center cursor-pointer bg-plata-niebla/5">
                    <span className="text-xs uppercase tracking-widest">Tarjeta de Crédito / Débito</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-5 bg-plata-niebla/20 rounded-sm" />
                      <div className="w-8 h-5 bg-plata-niebla/20 rounded-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-x border-b border-verde-ebano/10">
                    <input type="text" placeholder="Número de Tarjeta" className="checkout-input col-span-full" />
                    <input type="text" placeholder="MM / YY" className="checkout-input" />
                    <input type="text" placeholder="CVV" className="checkout-input" />
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-6 items-center">
                <LuxuryButton className="w-full py-6" onClick={handleComplete}>
                  Confirmar Adquisición <ArrowRight size={16} />
                </LuxuryButton>
                <div className="flex items-center gap-6 opacity-40">
                  <ShieldCheck size={20} strokeWidth={1} />
                  <Lock size={20} strokeWidth={1} />
                  <Globe size={20} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary (Persistent) */}
          <div className="lg:col-span-5">
            <div className="bg-authority p-12 sticky top-32 flex flex-col gap-12 shadow-2xl">
              <h2 className="text-2xl font-display text-oro-antiguo">Resumen de Piezas</h2>
              
              <div className="flex flex-col gap-8">
                <div className="flex gap-6">
                  <div className="w-16 aspect-[3/4] bg-hueso-seda/5" />
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-display text-hueso-seda">Anillo Luna de Plata</h4>
                    <span className="text-[10px] uppercase tracking-widest text-hueso-seda/40">1 unidad</span>
                  </div>
                  <span className="text-sm text-oro-antiguo">$1,200 USD</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-8 border-t border-hueso-seda/10">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/60">
                  <span>Subtotal</span>
                  <span>$1,034 USD</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/60">
                  <span>IVA (16%)</span>
                  <span>$166 USD</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-oro-antiguo">
                  <span>Envío de Cortesía</span>
                  <span>Gratis</span>
                </div>
                <div className="h-[1px] bg-hueso-seda/10 my-4" />
                <div className="flex justify-between text-lg uppercase tracking-widest text-hueso-seda">
                  <span>Total</span>
                  <span className="text-oro-antiguo">$1,200 USD</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 border border-oro-antiguo/20 text-center">
                <span className="text-[8px] uppercase tracking-[0.3em] text-oro-antiguo">Certificación GIA Incluida</span>
                <p className="text-[10px] text-hueso-seda/40 font-light italic leading-loose">
                  "Su pieza ha sido verificada bajo los estándares más estrictos de gemología y artesanía."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-input {
          background: transparent;
          border-bottom: 1px solid rgba(44, 55, 41, 0.1);
          padding: 12px 0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s;
        }
        .checkout-input:focus {
          border-color: var(--color-oro-antiguo);
        }
      `}</style>
    </main>
  );
}
