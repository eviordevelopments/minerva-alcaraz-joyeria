"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, ShieldCheck, Gem, Sparkles, Crown } from "lucide-react";
import { useAuthStore } from "../lib/store/useAuthStore";

const THREE_MINUTES_MS = 3 * 60 * 1000; // 180,000 ms (3 minutos)

/* ─────────────────────────────────────────
   NEWSLETTER BANNER — Deprecado / Quitado
   "Únete al Legado" eliminado según requerimiento
   para evitar saturación y duplicidad.
───────────────────────────────────────── */
export const NewsletterBanner = () => {
  return null;
};

/* ─────────────────────────────────────────
   THE CIRCLE BANNER — MEMBRESÍA THE CIRCLE
   Margen de tiempo de 3 minutos para no saturar al usuario
───────────────────────────────────────── */
export const TheCircleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) return;

    const dismissed = localStorage.getItem("ma_circle_dismissed");
    const triggered = localStorage.getItem("ma_circle_triggered");
    if (dismissed || triggered) return;

    // Track first site visit timestamp
    let visitStart = Number(localStorage.getItem("ma_first_visit_time"));
    if (!visitStart) {
      visitStart = Date.now();
      localStorage.setItem("ma_first_visit_time", visitStart.toString());
    }

    // Check if welcome popup was already seen or purchased
    const hasSeenWelcome = localStorage.getItem("minerva-has-seen-welcome");
    const hasPurchased = localStorage.getItem("minerva-has-purchased");

    // If WelcomePopup is yet to be shown, TheCircleBanner waits for WelcomePopup + 3 min margin (6 min total)
    // If WelcomePopup is already handled/dismissed, wait 3 minutes from visit or last popup
    const targetDelay = (!hasSeenWelcome && !hasPurchased)
      ? THREE_MINUTES_MS * 2
      : THREE_MINUTES_MS;

    const elapsed = Date.now() - visitStart;
    const initialDelay = Math.max(0, targetDelay - elapsed);

    const checkAndShow = () => {
      const lastPopup = Number(localStorage.getItem("ma_last_popup_time") || 0);
      const timeSinceLastPopup = Date.now() - lastPopup;

      if (lastPopup > 0 && timeSinceLastPopup < THREE_MINUTES_MS) {
        // Enforce full 3 minutes margin after the previous popup
        const remainingCooldown = THREE_MINUTES_MS - timeSinceLastPopup;
        const rescheduleTimer = setTimeout(() => {
          setIsVisible(true);
          localStorage.setItem("ma_last_popup_time", Date.now().toString());
          localStorage.setItem("ma_circle_triggered", "true");
        }, remainingCooldown);
        return () => clearTimeout(rescheduleTimer);
      }

      setIsVisible(true);
      localStorage.setItem("ma_last_popup_time", Date.now().toString());
      localStorage.setItem("ma_circle_triggered", "true");
    };

    const timer = setTimeout(checkAndShow, initialDelay);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("ma_circle_dismissed", "true");
    localStorage.setItem("ma_last_popup_time", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
      localStorage.setItem("ma_circle_dismissed", "true");
      localStorage.setItem("ma_last_popup_time", Date.now().toString());
      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } catch {
      setSubmitted(true);
      localStorage.setItem("ma_circle_dismissed", "true");
      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-4 md:right-8 z-[150] w-[calc(100vw-2rem)] max-w-sm max-h-[88vh] overflow-y-auto shadow-2xl"
        >
          <div className="relative bg-verde-ebano border border-oro-antiguo/30 overflow-hidden shadow-2xl">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oro-antiguo to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-oro-antiguo/15" />
            <div className="absolute top-0 right-0 w-24 h-24 border-l border-b border-oro-antiguo/10 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              aria-label="Cerrar ventana"
              className="absolute top-3.5 right-3.5 z-20 text-hueso-seda/40 hover:text-hueso-seda transition-colors p-1"
            >
              <X size={14} strokeWidth={1.5} />
            </button>

            <div className="p-6 md:p-8 flex flex-col gap-5">
              {/* Crown + Label Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-oro-antiguo/30 bg-verde-ebano/80 flex items-center justify-center flex-shrink-0">
                  <Crown size={15} className="text-oro-antiguo" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo font-medium">
                    The Circle
                  </span>
                  <h3 className="font-display text-hueso-seda text-lg md:text-xl uppercase leading-none tracking-wide">
                    MEMBRESÍA THE CIRCLE
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-oro-antiguo/15" />

              {!submitted ? (
                <>
                  {/* Copy & Benefits */}
                  <div className="flex flex-col gap-3.5">
                    <p className="text-hueso-seda/80 text-xs md:text-sm font-light leading-relaxed italic">
                      Lleva tu experiencia a un nivel especial para ti.
                    </p>

                    <div className="flex flex-col gap-2.5 mt-1">
                      {[
                        {
                          icon: Gem,
                          text: "Acceso exclusivo a nuestras nuevas colecciones antes de su lanzamiento oficial.",
                        },
                        {
                          icon: ShieldCheck,
                          text: "Envíos prioritarios",
                        },
                        {
                          icon: Sparkles,
                          text: "Colecciones privadas para ti.",
                        },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-start gap-2.5">
                          <Icon size={12} className="text-oro-antiguo flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <span className="text-[11px] uppercase tracking-[0.12em] text-hueso-seda/70 leading-relaxed font-light">
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo/90 font-medium">
                        Correo Electrónico
                      </label>
                      <div className="flex border-b border-hueso-seda/25 focus-within:border-oro-antiguo transition-colors pb-1.5 gap-2.5 items-center">
                        <Mail size={13} className="text-hueso-seda/40 flex-shrink-0" strokeWidth={1.5} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          required
                          className="flex-1 bg-transparent text-hueso-seda text-xs outline-none placeholder:text-hueso-seda/30 placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-[10px] text-red-300 tracking-wider mt-1">{errorMessage}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-oro-antiguo text-verde-ebano text-[11px] uppercase tracking-[0.35em] py-3 px-5 hover:bg-hueso-seda transition-colors duration-500 font-medium group shadow-lg disabled:opacity-60"
                      >
                        {isSubmitting ? "Elevando..." : "ELEVAR MI EXPERIENCIA"}
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="text-[10px] uppercase tracking-[0.25em] text-hueso-seda/40 hover:text-hueso-seda/80 transition-colors py-1.5 text-center font-light"
                      >
                        QUIZÁS MÁS TARDE
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="flex flex-col items-center justify-center gap-4 text-center py-5">
                  <div className="w-10 h-10 border border-oro-antiguo/40 flex items-center justify-center">
                    <Crown size={18} className="text-oro-antiguo" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">
                      Membresía Activada
                    </span>
                    <h4 className="font-display text-hueso-seda text-xl uppercase">
                      Bienvenido a The Circle
                    </h4>
                    <p className="text-xs text-hueso-seda/70 font-light italic mt-1 leading-relaxed">
                      "Tu experiencia ha sido elevada. Revisa tu bandeja de entrada para disfrutar de tus privilegios exclusivos."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
