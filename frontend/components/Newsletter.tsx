"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-verde-ebano py-32 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 border border-hueso-seda rounded-full -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] border border-hueso-seda rounded-full -mr-250 -mb-250" />
      </div>

      <div className="luxury-container relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <Mail className="text-oro-antiguo" size={28} md-size={32} strokeWidth={1} />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.8em] text-oro-antiguo">La Cofradía</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display text-hueso-seda italic px-4">Únase a Nuestra Herencia</h2>
            <p className="text-xs sm:text-sm md:text-base text-hueso-seda/60 font-light leading-relaxed max-w-2xl uppercase tracking-[0.1em] sm:tracking-[0.2em] px-4">
              Reciba invitaciones exclusivas a rituales de diseño privado y sea el primero en descubrir nuestras piezas únicas de edición limitada.
            </p>
          </motion.div>

          {!isSubscribed ? (
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-lg mt-8 group"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end border-b border-hueso-seda/20 pb-4 group-focus-within:border-oro-antiguo transition-colors px-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="SU CORREO ELECTRÓNICO" 
                  className="bg-transparent w-full sm:flex-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-hueso-seda outline-none placeholder:opacity-20 py-2 text-center sm:text-left"
                  required
                />
                <button 
                  type="submit"
                  className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-oro-antiguo hover:text-hueso-seda transition-colors pb-2 whitespace-nowrap"
                >
                  Suscribirse <ArrowRight size={16} strokeWidth={1} />
                </button>
              </div>
              <p className="text-[9px] text-hueso-seda/30 uppercase tracking-widest mt-6 text-left">
                Al suscribirse, acepta nuestra política de privacidad y el tratamiento de sus datos para fines exclusivos de la marca.
              </p>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-hueso-seda/5 border border-oro-antiguo/30 p-12 mt-8 text-center"
            >
              <h3 className="text-xl font-display text-oro-antiguo mb-4 italic">Bienvenido a la Herencia</h3>
              <p className="text-xs text-hueso-seda/70 uppercase tracking-[0.2em]">
                Un correo de confirmación ha sido enviado a su estancia digital.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
