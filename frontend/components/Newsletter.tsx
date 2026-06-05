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
    <section className="bg-hueso-seda py-32 relative overflow-hidden border-t border-verde-ebano/10">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 border border-verde-ebano rounded-full -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] border border-verde-ebano rounded-full -mr-250 -mb-250" />
      </div>

      <div className="luxury-container relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <Mail className="text-oro-profundo" size={28} strokeWidth={1} />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.8em] text-oro-profundo font-semibold">La Cofradía</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display italic px-4 !text-verde-ebano">Únete a Nuestra Herencia</h2>
            <p className="text-xs sm:text-sm md:text-base text-verde-ebano/70 font-light leading-relaxed max-w-2xl uppercase tracking-[0.1em] sm:tracking-[0.2em] px-4">
              Recibe invitaciones exclusivas a rituales de diseño privado y sé el primero en descubrir nuestras piezas únicas de edición limitada.
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
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end border-b border-verde-ebano/20 pb-4 group-focus-within:border-oro-profundo transition-colors px-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="TU CORREO ELECTRÓNICO" 
                  className="bg-transparent w-full sm:flex-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-verde-ebano outline-none placeholder:text-verde-ebano/35 py-2 text-center sm:text-left font-medium"
                  required
                />
                <button 
                  type="submit"
                  className="flex items-center gap-4 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-oro-profundo hover:text-verde-ebano transition-colors pb-2 whitespace-nowrap font-bold"
                >
                  Suscribirse <ArrowRight size={16} strokeWidth={1} />
                </button>
              </div>
              <p className="text-[9px] text-verde-ebano/40 uppercase tracking-widest mt-6 text-left leading-relaxed">
                Al suscribirte, aceptas nuestra política de privacidad y el tratamiento de tus datos para fines exclusivos de la marca.
              </p>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-verde-ebano/5 border border-oro-profundo/30 p-12 mt-8 text-center"
            >
              <h3 className="text-xl font-display text-oro-profundo mb-4 italic">Bienvenido a la Herencia</h3>
              <p className="text-xs text-verde-ebano/85 uppercase tracking-[0.2em]">
                Un correo de confirmación ha sido enviado a tu estancia digital.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
