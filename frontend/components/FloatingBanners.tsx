"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, ShieldCheck, Gem, Sparkles, Crown } from "lucide-react";
import { useAuthStore } from "../lib/store/useAuthStore";

const THREE_MINUTES_MS = 3 * 60 * 1000; // 180,000 ms (3 minutos exactos)

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
   Sale exactamente 3 minutos después del pop-up de 10%
   y adaptado para cerrar con facilidad en móvil y desktop.
───────────────────────────────────────── */
export const TheCircleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Si ya es miembro de The Circle o está logueado como miembro, no mostrar
    if (isAuthenticated && user?.isCircleMember) return;

    // Si el usuario ya descartó o ya se suscribió previamente, respetar su decisión
    const dismissed = localStorage.getItem("ma_circle_dismissed");
    const subscribed = localStorage.getItem("ma_circle_subscribed");
    if (dismissed === "true" || subscribed === "true") return;

    // Obtener marcas de tiempo de visita y del pop-up de 10%
    let visitStart = Number(localStorage.getItem("ma_first_visit_time"));
    if (!visitStart) {
      visitStart = Date.now();
      localStorage.setItem("ma_first_visit_time", visitStart.toString());
    }

    const hasSeenWelcome = localStorage.getItem("minerva-has-seen-welcome");
    const welcomeShownAt = Number(localStorage.getItem("ma_welcome_shown_at") || 0);
    const welcomeClosedAt = Number(localStorage.getItem("ma_welcome_closed_at") || 0);

    let targetDelay: number;

    if (!hasSeenWelcome && welcomeShownAt === 0) {
      // Primera visita: el pop up de 10% sale a los 2.5s; The Circle sale 3 minutos después
      const elapsed = Date.now() - visitStart;
      targetDelay = Math.max(0, (THREE_MINUTES_MS + 2500) - elapsed);
    } else if (welcomeShownAt > 0 && (!hasSeenWelcome || Date.now() - welcomeShownAt < THREE_MINUTES_MS * 2)) {
      // Se mostró el pop-up de 10% en esta sesión o recientemente: programar exactamente a los 3 minutos
      const baseTime = welcomeClosedAt > welcomeShownAt ? welcomeClosedAt : welcomeShownAt;
      const elapsed = Date.now() - baseTime;
      targetDelay = Math.max(0, THREE_MINUTES_MS - elapsed);
    } else {
      // Visita recurrente que ya había visto el 10% antes: esperar 3 minutos de navegación en esta sesión
      let sessionStart = Number(sessionStorage.getItem("ma_session_start"));
      if (!sessionStart) {
        sessionStart = Date.now();
        sessionStorage.setItem("ma_session_start", sessionStart.toString());
      }
      const elapsed = Date.now() - sessionStart;
      targetDelay = Math.max(0, THREE_MINUTES_MS - elapsed);
    }

    let retryTimeout: NodeJS.Timeout | null = null;

    const checkAndShow = () => {
      // Si el pop-up de 10% sigue abierto en pantalla, esperar 5 segundos y reintentar
      const isWelcomeOpen = sessionStorage.getItem("ma_welcome_is_open") === "true";
      if (isWelcomeOpen) {
        retryTimeout = setTimeout(checkAndShow, 5000);
        return;
      }

      // Comprobar nuevamente si fue descartado durante la espera
      if (localStorage.getItem("ma_circle_dismissed") === "true" || localStorage.getItem("ma_circle_subscribed") === "true") {
        return;
      }

      setIsVisible(true);
      localStorage.setItem("ma_last_popup_time", Date.now().toString());
      localStorage.setItem("ma_circle_shown_at", Date.now().toString());
    };

    const timer = setTimeout(checkAndShow, targetDelay);
    return () => {
      clearTimeout(timer);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [isAuthenticated, user?.isCircleMember]);

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
      localStorage.setItem("ma_circle_subscribed", "true");
      localStorage.setItem("ma_last_popup_time", Date.now().toString());
      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } catch {
      setSubmitted(true);
      localStorage.setItem("ma_circle_dismissed", "true");
      localStorage.setItem("ma_circle_subscribed", "true");
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // En móvil, tocar fuera de la tarjeta cierra el modal
            if (e.target === e.currentTarget) {
              handleDismiss();
            }
          }}
          className="fixed inset-0 z-[100020] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs md:bg-transparent md:backdrop-blur-none md:inset-auto md:bottom-8 md:right-8 md:p-0 md:block pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm max-h-[88dvh] overflow-y-auto shadow-2xl relative bg-verde-ebano border border-oro-antiguo/30 overflow-hidden"
          >
            {/* Acentos decorativos de lujo */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oro-antiguo to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-oro-antiguo/15" />
            <div className="absolute top-0 right-0 w-24 h-24 border-l border-b border-oro-antiguo/10 pointer-events-none" />

            {/* Botón de Cierre Optimizado para Móvil y Desktop */}
            <button
              onClick={handleDismiss}
              type="button"
              aria-label="Cerrar ventana de The Circle"
              className="absolute top-3 right-3 z-30 w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-verde-ebano/90 border border-oro-antiguo/40 text-hueso-seda hover:text-oro-antiguo hover:border-oro-antiguo transition-all active:scale-95 touch-manipulation cursor-pointer shadow-lg"
            >
              <X size={18} strokeWidth={2} />
            </button>

            <div className="p-6 sm:p-7 md:p-8 flex flex-col gap-4 sm:gap-5">
              {/* Encabezado con Corona */}
              <div className="flex items-center gap-3 pr-10">
                <div className="w-9 h-9 border border-oro-antiguo/30 bg-verde-ebano/80 flex items-center justify-center flex-shrink-0">
                  <Crown size={15} className="text-oro-antiguo" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo font-medium">
                    The Circle
                  </span>
                  <h3 className="font-display text-hueso-seda text-lg sm:text-xl uppercase leading-none tracking-wide">
                    MEMBRESÍA THE CIRCLE
                  </h3>
                </div>
              </div>

              {/* Separador */}
              <div className="w-full h-[1px] bg-oro-antiguo/15" />

              {!submitted ? (
                <>
                  {/* Beneficios */}
                  <div className="flex flex-col gap-3">
                    <p className="text-hueso-seda/80 text-xs sm:text-sm font-light leading-relaxed italic">
                      Lleva tu experiencia a un nivel especial para ti.
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      {[
                        {
                          icon: Gem,
                          text: "Acceso exclusivo a nuestras nuevas colecciones antes de su lanzamiento oficial.",
                        },
                        {
                          icon: ShieldCheck,
                          text: "Envíos prioritarios.",
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

                  {/* Formulario */}
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
                        className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-oro-antiguo text-verde-ebano text-[11px] uppercase tracking-[0.35em] py-3 px-5 hover:bg-hueso-seda transition-colors duration-500 font-medium group shadow-lg disabled:opacity-60 touch-manipulation cursor-pointer"
                      >
                        {isSubmitting ? "Elevando..." : "ELEVAR MI EXPERIENCIA"}
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="w-full min-h-[44px] flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-hueso-seda/60 hover:text-hueso-seda transition-colors py-2 text-center font-light touch-manipulation cursor-pointer"
                      >
                        Quizás más tarde
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* Estado de Éxito */
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

