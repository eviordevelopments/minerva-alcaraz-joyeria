"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { LuxuryButton } from "../../components/DesignSystem";
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
      
      <div className="pt-40 px-6 md:px-12 lg:px-20 pb-32 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 xl:gap-40">
          
          {/* Checkout Form (Minimalist) */}
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-6xl font-display text-verde-ebano leading-none">Finalizar Adquisición</h1>
              <p className="text-xs uppercase tracking-[0.5em] text-oro-antiguo mt-4">Protocolo de Alta Seguridad & Herencia</p>
            </div>

            <div className="flex flex-col gap-20">
              {/* Shipping Information */}
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-medium">01. Destino del Legado</span>
                  <div className="h-[1px] flex-1 bg-verde-ebano/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="col-span-full group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Estancia Digital (Email)</label>
                    <input type="text" placeholder="correo@ejemplo.com" className="checkout-input w-full" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Nombre del Custodio</label>
                    <input type="text" placeholder="Como aparece en su identificación" className="checkout-input w-full" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Contacto Directo</label>
                    <input type="text" placeholder="+52 ..." className="checkout-input w-full" />
                  </div>
                  <div className="col-span-full group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Dirección de Entrega</label>
                    <input type="text" placeholder="Calle, Número, Colonia..." className="checkout-input w-full" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Ciudad / Estado</label>
                    <input type="text" placeholder="Ciudad de México" className="checkout-input w-full" />
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">Código Postal</label>
                    <input type="text" placeholder="00000" className="checkout-input w-full" />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="flex flex-col gap-10">
                <div className="flex items-center gap-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-medium">02. Transferencia de Valor</span>
                  <div className="h-[1px] flex-1 bg-verde-ebano/10" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="p-8 border border-verde-ebano flex justify-between items-center cursor-pointer bg-verde-ebano text-hueso-seda">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-widest font-medium">Tarjeta de Crédito / Débito</span>
                      <span className="text-[9px] opacity-60 uppercase tracking-widest">Encriptación de Grado Militar</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-6 bg-hueso-seda/20 rounded-sm" />
                      <div className="w-10 h-6 bg-hueso-seda/20 rounded-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 p-10 border border-verde-ebano/10 bg-plata-niebla/5">
                    <div className="col-span-full group">
                      <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block">Número de Tarjeta</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="checkout-input w-full" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block">Vencimiento</label>
                      <input type="text" placeholder="MM / YY" className="checkout-input w-full" />
                    </div>
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block">CVV</label>
                      <input type="text" placeholder="000" className="checkout-input w-full" />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-8">
                <button 
                  onClick={handleComplete}
                  className="w-full bg-verde-ebano text-hueso-seda py-8 px-12 flex items-center justify-between border border-verde-ebano hover:bg-hueso-seda hover:text-verde-ebano transition-all duration-700 group overflow-hidden relative"
                >
                  <span className="text-sm uppercase tracking-[0.6em] font-medium z-10">Confirmar Adquisición</span>
                  <div className="flex items-center gap-6 z-10">
                    <div className="w-12 h-[1px] bg-current transition-all duration-700 group-hover:w-20" />
                    <ArrowRight size={20} strokeWidth={1} />
                  </div>
                  {/* Hover Background Accent */}
                  <div className="absolute inset-0 bg-oro-antiguo/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                </button>
                
                <div className="flex justify-center items-center gap-10 opacity-30 mt-4">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck size={24} strokeWidth={1} />
                    <span className="text-[8px] uppercase tracking-widest">Protección GIA</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Lock size={24} strokeWidth={1} />
                    <span className="text-[8px] uppercase tracking-widest">SSL 256-bit</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Globe size={24} strokeWidth={1} />
                    <span className="text-[8px] uppercase tracking-widest">Envío Global</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary (Persistent) */}
          <div className="relative">
            <div className="bg-authority p-16 md:p-24 sticky top-32 flex flex-col gap-16 shadow-[-40px_40px_80px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl font-display text-oro-antiguo italic">Detalle de la Obra</h2>
                <div className="h-[1px] w-20 bg-oro-antiguo/30" />
              </div>
              
              <div className="flex flex-col gap-12">
                <div className="flex gap-10">
                  <div className="w-32 aspect-[3/4] bg-hueso-seda/5 relative overflow-hidden group">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-verde-ebano/20 to-transparent" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo">Categoría: Herencia</span>
                    <h4 className="text-2xl font-display text-hueso-seda leading-tight">Anillo Luna de Plata</h4>
                    <span className="text-[10px] uppercase tracking-widest text-hueso-seda/40">Cantidad: 01 Unidad</span>
                    <div className="text-xl text-hueso-seda mt-4">$1,200.00 USD</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-12 border-t border-hueso-seda/10">
                <div className="flex justify-between text-xs uppercase tracking-widest text-hueso-seda/40">
                  <span>Valor de la Obra</span>
                  <span>$1,034.48</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest text-hueso-seda/40">
                  <span>Impuestos Legales (16%)</span>
                  <span>$165.52</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest text-oro-antiguo font-medium">
                  <span>Gestión de Envío Asegurado</span>
                  <span>Cortesia</span>
                </div>
                <div className="h-[1px] bg-hueso-seda/10 my-6" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-hueso-seda/30">Total Final</span>
                    <span className="text-4xl text-hueso-seda tracking-tighter">$1,200.00</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-oro-antiguo pb-2">USD</span>
                </div>
              </div>

              <div className="flex flex-col gap-6 p-10 border border-oro-antiguo/10 bg-hueso-seda/[0.02] text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-[1px] bg-oro-antiguo/40" />
                </div>
                <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">Certificación de Autenticidad Minerva Alcaraz</span>
                <p className="text-xs text-hueso-seda/40 font-light italic leading-loose">
                  &quot;Cada pieza es un testimonio de devoción y maestría, forjada para habitar en la eternidad bajo la custodia de su nuevo dueño.&quot;
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
