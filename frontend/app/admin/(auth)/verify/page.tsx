"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Falta el token de verificación en el enlace.");
    }
  }, [token]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al verificar la cuenta.");
      }

      setEmail(data.email);
      
      // Auto login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: password,
      });

      if (signInError) {
        console.warn("Auto-login failed:", signInError);
      }

      setSuccess(true);
      
      // Redirect after a brief moment
      setTimeout(() => {
        router.push("/admin/select-profile");
      }, 2500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#2C3729] flex flex-col items-center justify-center p-6 text-[#E5DBD6]">
        <AlertTriangle size={48} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-display-erp text-[#CBB67B] mb-2">Enlace Inválido</h1>
        <p className="text-sm text-[#8E9A8B] mb-8">No se encontró un token válido en la URL.</p>
        <Link href="/admin/register" className="text-[10px] uppercase tracking-[0.2em] text-[#CBB67B] border border-[#CBB67B]/30 px-6 py-3 hover:bg-[#CBB67B]/10 transition-colors">
          Volver a Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C3729] flex flex-col items-center py-20 px-6 text-[#E5DBD6] select-none font-sans relative">
      {/* Decorative Blur */}
      <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none opacity-10 pt-20">
        <div className="w-[600px] h-[600px] bg-[#CBB67B] rounded-full blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display-erp font-bold text-[#CBB67B] mb-2 tracking-widest">
            ACTIVACIÓN DE CUENTA
          </h1>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8E9A8B]">
            Paso final: Establecer contraseña
          </h2>
        </div>

        <div className="bg-[#1F271D]/80 backdrop-blur-md border border-[#CBB67B]/20 p-8 shadow-2xl">
          {success ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle size={48} className="text-[#CBB67B]" />
              <h2 className="text-xl text-[#CBB67B] font-display-erp tracking-widest text-center">¡CUENTA ACTIVADA!</h2>
              <p className="text-sm text-[#8E9A8B] text-center max-w-md">
                Bienvenido al sistema ERP, <strong>{email}</strong>.<br/>
                Redirigiendo a tu entorno de trabajo...
              </p>
              <Loader2 size={24} className="animate-spin text-[#CBB67B] mt-4" />
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 text-sm text-center">
                  {error}
                </div>
              )}

              <p className="text-sm text-[#E5DBD6]/80 text-center font-light leading-relaxed">
                Tu identidad ha sido verificada. Para proteger el acceso de tu equipo, crea una contraseña segura.
              </p>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-[#8E9A8B] mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-3 text-sm text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-[#8E9A8B] mb-1">Confirmar Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-3 text-sm text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#CBB67B] text-[#2C3729] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#E4D5A4] transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Activar y Entrar"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#2C3729] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#CBB67B]" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
