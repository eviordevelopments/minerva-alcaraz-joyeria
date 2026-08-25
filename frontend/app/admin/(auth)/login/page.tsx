"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        // Redirect to profile selection
        router.push("/admin/select-profile");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C3729] flex flex-col items-center justify-center p-6 text-[#E5DBD6] select-none font-sans relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] bg-[#CBB67B] rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display-erp font-bold text-[#CBB67B] mb-2 tracking-widest">
            MA
          </h1>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#8E9A8B]">
            Atelier Interno & ERP
          </h2>
        </div>

        <div className="bg-[#1F271D]/80 backdrop-blur-md border border-[#CBB67B]/20 p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 text-sm rounded-none text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8E9A8B] mb-2">
                Correo Institucional
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2C3729] border border-[#CBB67B]/30 px-4 py-3 text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B] transition-colors"
                placeholder="cuenta@minervaalcaraz.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8E9A8B] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2C3729] border border-[#CBB67B]/30 px-4 py-3 text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CBB67B] text-[#2C3729] py-3.5 uppercase tracking-widest text-[11px] font-bold hover:bg-[#E4D5A4] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Acceder al Sistema"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#CBB67B]/10 text-center space-y-4">
            <p className="text-[#8E9A8B] text-xs">
              ¿No tienes una cuenta de equipo?
            </p>
            <Link
              href="/admin/register"
              className="inline-block border border-[#CBB67B]/30 text-[#CBB67B] px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-[#CBB67B]/10 transition-colors"
            >
              Registrar Nueva Cuenta
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
