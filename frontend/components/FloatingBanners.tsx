"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Mail, ArrowRight, Star, ShieldCheck, Gem, Sparkles, Crown } from "lucide-react";

/* ─────────────────────────────────────────
   NEWSLETTER BANNER — appears on first visit
───────────────────────────────────────── */
export const NewsletterBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ma_newsletter_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("ma_newsletter_dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    localStorage.setItem("ma_newsletter_dismissed", "true");
    setTimeout(() => setIsVisible(false), 2800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-verde-ebano/40 backdrop-blur-sm z-[200]"
            onClick={handleDismiss}
          />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-4xl mx-auto"
          >
            <div className="relative flex flex-col md:flex-row overflow-hidden shadow-2xl border border-verde-ebano/20">

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-30 text-hueso-seda/60 hover:text-hueso-seda transition-colors bg-verde-ebano/30 p-1.5"
              >
                <X size={14} strokeWidth={1.5} />
              </button>

              {/* LEFT — Jewelry Image */}
              <div className="relative w-full md:w-[45%] h-[220px] md:h-auto min-h-[280px] bg-plata-niebla/20 flex-shrink-0 overflow-hidden group">
                <Image
                  src="https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg"
                  alt="Joyería Minerva Alcaraz"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-verde-ebano/30 hidden md:block" />

                {/* Floating label */}
                <div className="absolute bottom-4 left-4 bg-hueso-seda/10 backdrop-blur-md border border-hueso-seda/20 px-3 py-1.5">
                  <span className="text-[8px] uppercase tracking-[0.5em] text-hueso-seda font-light">Colección Escencia</span>
                </div>
              </div>

              {/* RIGHT — Verde Ébano with form */}
              <div className="flex-1 bg-verde-ebano px-8 py-10 md:px-10 md:py-12 flex flex-col justify-between relative overflow-hidden">

                {/* Decorative geometric lines */}
                <div className="absolute top-0 right-0 w-32 h-32 border-l border-b border-oro-antiguo/10" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-r border-t border-oro-antiguo/10" />

                {!submitted ? (
                  <>
                    <div className="flex flex-col gap-6 relative z-10">
                      {/* Header label */}
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-[1px] bg-oro-antiguo" />
                        <span className="text-[9px] uppercase tracking-[0.6em] text-oro-antiguo font-medium">La Herencia</span>
                      </div>

                      {/* Title */}
                      <div className="flex flex-col gap-2">
                        <h2 className="font-display text-hueso-seda text-3xl md:text-4xl leading-tight uppercase">
                          Únase al<br />Legado
                        </h2>
                        <p className="text-hueso-seda/60 text-[11px] md:text-xs font-light leading-relaxed max-w-xs italic">
                          "Las piezas más extraordinarias nunca llegan al catálogo público. Son reservadas para quienes custodian la herencia."
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-col gap-3">
                        {[
                          { icon: Star, text: "Acceso prioritario a lanzamientos exclusivos" },
                          { icon: Gem, text: "Piezas únicas antes que el mundo las vea" },
                          { icon: ShieldCheck, text: "Atención personalizada de nuestros artesanos" },
                          { icon: Sparkles, text: "Invitaciones a rituales y eventos privados" },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-start gap-3">
                            <Icon size={12} className="text-oro-antiguo flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-[0.15em] text-hueso-seda/70 leading-relaxed">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10 mt-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">
                          Su Correo Electrónico
                        </label>
                        <div className="flex border-b border-hueso-seda/20 focus-within:border-oro-antiguo transition-colors pb-2 gap-3 items-center">
                          <Mail size={12} className="text-hueso-seda/30" strokeWidth={1} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@correo.com"
                            required
                            className="flex-1 bg-transparent text-hueso-seda text-[11px] outline-none placeholder:text-hueso-seda/20 placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-3 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.4em] py-3 px-6 hover:bg-hueso-seda transition-colors duration-500 font-medium group"
                      >
                        Unirse a la Herencia
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <p className="text-[8px] uppercase tracking-[0.2em] text-hueso-seda/30 text-center">
                        Sin spam. Solo lo que merece su atención.
                      </p>
                    </form>
                  </>
                ) : (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center gap-6 h-full text-center py-8 relative z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: "backOut" }}
                    >
                      <Gem size={32} className="text-oro-antiguo mx-auto" strokeWidth={1} />
                    </motion.div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-hueso-seda text-2xl uppercase">Bienvenida al Legado</h3>
                      <p className="text-hueso-seda/60 text-xs italic font-light">
                        "Será la primera en conocer cada historia antes que el mundo."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


/* ─────────────────────────────────────────
   THE CIRCLE BANNER — appears after 45 sec
   or on 3rd page visit (intelligent timing)
───────────────────────────────────────── */
export const TheCircleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ma_circle_dismissed");
    const visits = parseInt(localStorage.getItem("ma_visit_count") || "0") + 1;
    localStorage.setItem("ma_visit_count", String(visits));

    if (dismissed) return;

    // Show on 3rd+ visit after 30s, or on any visit after 60s
    const delay = visits >= 3 ? 30000 : 60000;

    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("ma_circle_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-4 md:right-8 z-[150] w-[calc(100vw-2rem)] max-w-sm"
        >
          <div className="relative bg-verde-ebano border border-oro-antiguo/20 shadow-2xl overflow-hidden">

            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oro-antiguo to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-oro-antiguo/10" />

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 z-20 text-hueso-seda/30 hover:text-hueso-seda/80 transition-colors"
            >
              <X size={13} strokeWidth={1.5} />
            </button>

            <div className="p-6 md:p-8 flex flex-col gap-5">
              {/* Crown + Label */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-oro-antiguo/30 flex items-center justify-center flex-shrink-0">
                  <Crown size={14} className="text-oro-antiguo" strokeWidth={1} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-[0.6em] text-oro-antiguo">Membresía de Élite</span>
                  <span className="font-display text-hueso-seda text-lg uppercase leading-none">The Circle</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-oro-antiguo/15" />

              {/* Copy */}
              <div className="flex flex-col gap-3">
                <p className="text-hueso-seda/80 text-[11px] md:text-xs font-light leading-relaxed italic">
                  "Eleve su experiencia a un nivel reservado para pocos. Acceso a piezas irrepetibles, concierge dedicado y rituales de selección privados."
                </p>

                <div className="flex flex-col gap-2 mt-1">
                  {[
                    { icon: Crown, text: "Servicio Concierge Dedicado" },
                    { icon: Gem, text: "Acceso a Colecciones Reservadas" },
                    { icon: ShieldCheck, text: "Garantía de Autenticidad Vitalicia" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon size={10} className="text-oro-antiguo flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-hueso-seda/60">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/the-circle"
                  onClick={handleDismiss}
                  className="flex items-center justify-center gap-2 bg-oro-antiguo text-verde-ebano text-[9px] uppercase tracking-[0.4em] py-3 px-5 hover:bg-hueso-seda transition-colors duration-500 font-medium group"
                >
                  Elevar Mi Experiencia
                  <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={handleDismiss}
                  className="text-[8px] uppercase tracking-[0.3em] text-hueso-seda/30 hover:text-hueso-seda/60 transition-colors py-1"
                >
                  Quizás más tarde
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
