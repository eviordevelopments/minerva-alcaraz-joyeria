"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Crown, Loader2, Mail, Lock, User } from "lucide-react";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { refreshProfile, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/perfil");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        setSuccessMsg("Revisa tu correo para confirmar tu cuenta. Luego podrás ingresar.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await refreshProfile();
        router.push("/perfil");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocurrió un error inesperado";
      if (msg.includes("Invalid login")) setError("Correo o contraseña incorrectos.");
      else if (msg.includes("already registered")) setError("Este correo ya tiene una cuenta. Inicia sesión.");
      else if (msg.includes("Password should be")) setError("La contraseña debe tener al menos 6 caracteres.");
      else setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-hueso-seda flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-start pt-48 md:pt-56 pb-20 px-4">
        <div className="w-full max-w-md mt-8">

          {/* Brand mark */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 border border-verde-ebano/20 flex items-center justify-center">
              <Crown size={18} strokeWidth={1} className="text-oro-antiguo" />
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo">Minerva Alcaraz</p>
              <h1 className="text-2xl font-display text-verde-ebano uppercase tracking-widest mt-1">
                {mode === "login" ? "Bienvenido" : "Crear Cuenta"}
              </h1>
            </div>
          </motion.div>

          {/* Mode tabs */}
          <div className="flex border-b border-verde-ebano/10 mb-10">
            {(["login", "register"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-3 text-[9px] uppercase tracking-[0.5em] transition-all duration-300 ${
                  mode === m
                    ? "text-verde-ebano border-b-2 border-oro-antiguo -mb-px"
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
                <p className="text-xs text-verde-ebano/70 leading-loose max-w-xs">{successMsg}</p>
                <button
                  onClick={() => { setMode("login"); setSuccessMsg(null); }}
                  className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors"
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
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
                      <User size={10} strokeWidth={1.5} /> Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Tu nombre"
                      className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
                    <Mail size={10} strokeWidth={1.5} /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@correo.com"
                    className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/50 flex items-center gap-2">
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
                      className="w-full bg-transparent border-b border-verde-ebano/15 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20 pr-10"
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
                    className="text-[10px] text-red-600/70 tracking-wide bg-red-50 px-4 py-3 border border-red-100"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-[10px] uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 mt-2 group disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Ingresar" : "Crear mi Cuenta"}
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {mode === "login" && (
                  <p className="text-center text-[9px] text-verde-ebano/30 uppercase tracking-widest">
                    ¿Olvidaste tu contraseña?{" "}
                    <Link href="/auth/reset" className="text-oro-antiguo hover:underline">
                      Recuperar
                    </Link>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* THE CIRCLE promo */}
          <div className="mt-12 pt-8 border-t border-verde-ebano/8 flex flex-col items-center gap-3 text-center">
            <div className="w-6 h-6 border border-oro-antiguo/30 flex items-center justify-center">
              <Crown size={10} className="text-oro-antiguo" strokeWidth={1.5} />
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/30">
              ¿Miembro de The Circle?
            </p>
            <Link
              href="/the-circle"
              className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo hover:underline"
            >
              Descubrir beneficios exclusivos →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
