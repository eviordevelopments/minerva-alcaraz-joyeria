"use client";

import React, { useState } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/perfil/cuenta`,
    });

    if (error) {
      setError("No pudimos encontrar esa dirección. Verifica e intenta de nuevo.");
    } else {
      setSent(true);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-hueso-seda flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-3">
              <Link href="/auth" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-verde-ebano/35 hover:text-verde-ebano transition-colors w-fit">
                <ArrowLeft size={11} strokeWidth={1.5} /> Volver
              </Link>
              <h1 className="text-2xl font-display text-verde-ebano uppercase tracking-widest">
                Recuperar Contraseña
              </h1>
              <p className="text-[10px] text-verde-ebano/40 leading-relaxed">
                Te enviaremos un enlace seguro para restablecer tu contraseña.
              </p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 py-10 text-center border border-verde-ebano/8 bg-white p-8"
              >
                <CheckCircle2 size={32} strokeWidth={1} className="text-green-500" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-display text-verde-ebano">Correo Enviado</p>
                  <p className="text-[10px] text-verde-ebano/40 leading-loose max-w-xs">
                    Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue el enlace para restablecer tu contraseña.
                  </p>
                </div>
                <Link href="/auth" className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors">
                  Volver al Inicio de Sesión
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-6 bg-white border border-verde-ebano/8 p-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40 flex items-center gap-2">
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

                {error && (
                  <p className="text-[10px] text-red-500/70 bg-red-50 px-4 py-3 border border-red-100">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-[10px] uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 disabled:opacity-60"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Enviar Enlace de Recuperación"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
