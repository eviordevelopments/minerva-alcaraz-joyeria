"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { supabase } from "../../lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Crown, Loader2, Mail, Lock, User, ShieldCheck, Sparkles, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

type AuthMode = "login" | "register";

function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(true);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const { refreshProfile, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/perfil";
  const isForCheckout = nextUrl.includes("checkout") || searchParams.get("reason") === "checkout";

  useEffect(() => {
    // Show pop up upon entering auth page
    setShowSecurityModal(true);
  }, []);

  useEffect(() => {
    const requestedMode = searchParams.get("mode") || searchParams.get("tab");
    if (requestedMode === "register") {
      setMode("register");
      setShowSecurityModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) router.push(nextUrl);
  }, [isAuthenticated, router, nextUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "register") {
        if (!captchaToken) throw new Error("Por favor completa el reCAPTCHA de seguridad.");
        
        const captchaRes = await fetch("/api/verify-captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: captchaToken }),
        });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) throw new Error("Validación de reCAPTCHA fallida. Intenta nuevamente.");

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`
          },
        });
        if (signUpError) throw signUpError;
        setSuccessMsg("Revisa tu correo para confirmar tu cuenta. Una vez confirmada podrás continuar con tu compra.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await refreshProfile();
        router.push(nextUrl);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado";
      if (msg.includes("Invalid login")) setError("Correo o contraseña incorrectos.");
      else if (msg.includes("already registered")) setError("Este correo ya tiene una cuenta registrada. Inicia sesión.");
      else if (msg.includes("Password should be")) setError("La contraseña debe tener al menos 6 caracteres.");
      else setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mt-8">
      {/* Brand mark */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 border border-verde-ebano/20 flex items-center justify-center">
          <Crown size={18} strokeWidth={1} className="text-oro-antiguo" />
        </div>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.8em] text-oro-antiguo">Minerva Alcaraz</p>
          <h1 className="text-2xl font-display text-verde-ebano uppercase tracking-widest mt-1">
            {mode === "login" ? "Bienvenido" : "Crear Cuenta"}
          </h1>
        </div>
      </motion.div>

      {/* Mode tabs */}
      <div className="flex border-b border-verde-ebano/10 mb-8">
        {(["login", "register"] as AuthMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setSuccessMsg(null);
              if (m === "register") {
                setShowSecurityModal(true);
              }
            }}
            className={`flex-1 py-3 text-[11px] uppercase tracking-[0.5em] transition-all duration-300 ${
              mode === m
                ? "text-verde-ebano border-b-2 border-oro-antiguo -mb-px font-medium"
                : "text-verde-ebano/30 hover:text-verde-ebano/60"
            }`}
          >
            {m === "login" ? "Iniciar Sesión" : "Registrarse"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {successMsg ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 py-10 text-center"
          >
            <div className="w-14 h-14 bg-verde-ebano/5 border border-verde-ebano/20 flex items-center justify-center rounded-full">
              <Mail size={22} strokeWidth={1} className="text-oro-antiguo" />
            </div>
            <p className="text-sm text-verde-ebano/70 leading-loose max-w-xs">{successMsg}</p>
            <button
              onClick={() => { setMode("login"); setSuccessMsg(null); }}
              className="text-[11px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors"
            >
              Ir a Iniciar Sesión
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 15 : -15 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-7"
          >
            {mode === "register" && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
                  <User size={10} strokeWidth={1.5} /> Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Tu nombre y apellido"
                  className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-base text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
                <Mail size={10} strokeWidth={1.5} /> Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-base text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
                <Lock size={10} strokeWidth={1.5} /> Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-verde-ebano/15 py-2.5 text-base text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2.5 text-verde-ebano/30 hover:text-verde-ebano/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-600/70 tracking-wide bg-red-50 px-4 py-3 border border-red-100"
              >
                {error}
              </motion.p>
            )}

            {mode === "register" && (
              <div className="flex justify-center mt-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                  onChange={(token) => setCaptchaToken(token)}
                  theme="light"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-xs uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 mt-2 group disabled:opacity-60 font-medium"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" 
                    ? (isForCheckout ? "Ingresar y Continuar Compra" : "Ingresar") 
                    : (isForCheckout ? "Crear Cuenta y Comprar" : "Crear mi Cuenta")}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {mode === "login" && (
              <div className="flex flex-col items-center gap-2.5">
                <p className="text-center text-[11px] text-verde-ebano/40 uppercase tracking-widest">
                  ¿Olvidaste tu contraseña?{" "}
                  <Link href="/auth/reset" className="text-oro-antiguo hover:underline">
                    Recuperar
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setSuccessMsg(null);
                    setShowSecurityModal(true);
                  }}
                  className="text-[11px] uppercase tracking-widest text-verde-ebano/60 hover:text-verde-ebano transition-colors"
                >
                  ¿No tienes cuenta? <span className="text-oro-antiguo font-semibold underline decoration-oro-antiguo/50 hover:decoration-oro-antiguo">Crear Cuenta</span>
                </button>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* THE CIRCLE promo */}
      <div className="mt-12 pt-8 border-t border-verde-ebano/8 flex flex-col items-center gap-3 text-center">
        <div className="w-6 h-6 border border-oro-antiguo/30 flex items-center justify-center">
          <Crown size={10} className="text-oro-antiguo" strokeWidth={1.5} />
        </div>
        <p className="text-[11px] uppercase tracking-[0.4em] text-verde-ebano/40">
          ¿Miembro de The Circle?
        </p>
        <Link
          href="/the-circle"
          className="text-[11px] uppercase tracking-[0.5em] text-oro-antiguo hover:underline"
        >
          Descubrir beneficios exclusivos →
        </Link>
      </div>

      {/* Pop-up: Compras Aseguradas & Atención Personalizada al Entrar / Registrarse */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[100030] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundColor: "#2C3729", color: "#E5DBD6" }}
              className="relative w-full max-w-lg bg-[#2C3729] text-[#E5DBD6] border-2 border-[#CBB67B]/50 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden max-h-[92dvh] overflow-y-auto"
            >
              {/* Luxury gold top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CBB67B] to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="absolute top-4 right-4 w-9 h-9 border border-[#CBB67B]/40 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] hover:text-[#E5DBD6] transition-colors bg-black/20"
                aria-label="Cerrar ventana informativa"
              >
                <X size={16} />
              </button>

              {/* Header Badge */}
              <div className="flex items-center gap-3 mb-4 pr-10">
                <div className="w-10 h-10 border border-[#CBB67B]/50 flex items-center justify-center bg-black/40 flex-shrink-0">
                  <ShieldCheck size={20} className="text-[#CBB67B]" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-[#CBB67B] font-bold block">
                    Seguridad &amp; Exclusividad de Autor
                  </span>
                  <h3 className="text-base sm:text-lg font-display uppercase tracking-wider text-white mt-0.5">
                    Compras Aseguradas &amp; Atención Personalizada
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#E5DBD6]/90 font-light leading-relaxed mb-5">
                Para mantener tus compras debidamente aseguradas con custodia legal, trazabilidad de autor y poder ofrecerte atención personalizada durante todo tu proceso de compra, es necesario crear tu cuenta o iniciar sesión antes de proceder al pago.
              </p>

              {/* Pillars / Checklist */}
              <div className="flex flex-col gap-3.5 py-4 border-y border-[#CBB67B]/20 text-xs text-[#E5DBD6]/85 font-light">
                <div className="flex items-start gap-3">
                  <span className="text-[#CBB67B] font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
                  <span className="leading-relaxed">
                    <strong className="text-white font-medium">Compras Aseguradas:</strong> Cada pieza de autor se vincula formalmente a tu nombre con certificado de autenticidad, garantía vitalicia de manufactura y póliza de envío seguro con custodia completa.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#CBB67B] font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
                  <span className="leading-relaxed">
                    <strong className="text-white font-medium">Atención Personalizada:</strong> Nuestro Concierge y maestros artesanos te asisten directamente con tus medidas, detalles especiales y seguimiento prioritario.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#CBB67B] font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
                  <span className="leading-relaxed">
                    <strong className="text-white font-medium">Trazabilidad &amp; The Circle:</strong> Historial permanente de tus joyas, rastreo de guías en tiempo real y acceso preferencial a colecciones privadas.
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setShowSecurityModal(false);
                  }}
                  className="w-full sm:w-auto text-[11px] uppercase tracking-[0.25em] text-[#E5DBD6]/70 hover:text-white transition-colors py-2 text-center"
                >
                  Ya tengo cuenta · Iniciar Sesión
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setShowSecurityModal(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#CBB67B] hover:bg-[#E5DBD6] text-[#2C3729] text-xs uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Crear Mi Cuenta</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-hueso-seda flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-start pt-48 md:pt-56 pb-20 px-4">
        <Suspense fallback={<div className="py-20 text-xs uppercase tracking-widest text-verde-ebano/40">Cargando...</div>}>
          <AuthForm />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
