"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Camera, CheckCircle } from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();
  
  // Account State
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<"San Miguel" | "ONLINE">("San Miguel");
  
  // Profiles State
  const [profiles, setProfiles] = useState([{ name: "", role: "", avatarFile: null as File | null }]);
  
  // Validation State
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addProfile = () => {
    setProfiles([...profiles, { name: "", role: "", avatarFile: null }]);
  };

  const removeProfile = (index: number) => {
    if (profiles.length > 1) {
      setProfiles(profiles.filter((_, i) => i !== index));
    }
  };

  const updateProfile = (index: number, field: string, value: any) => {
    const newProfiles = [...profiles];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    setProfiles(newProfiles);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!termsAccepted) throw new Error("Debes aceptar los términos y condiciones.");
      if (profiles.some(p => !p.name || !p.role)) throw new Error("Todos los perfiles deben tener nombre y rol.");

      // Enviar datos al endpoint de invitación
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, location, profiles }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al enviar la invitación.");
      }

      setSuccess(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C3729] flex flex-col items-center py-12 px-6 text-[#E5DBD6] select-none font-sans relative">
      {/* Decorative Blur */}
      <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none opacity-10 pt-20">
        <div className="w-[600px] h-[600px] bg-[#CBB67B] rounded-full blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display-erp font-bold text-[#CBB67B] mb-2 tracking-widest">
            NUEVA CUENTA
          </h1>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8E9A8B]">
            Configuración de Empresa y Equipo
          </h2>
        </div>

        <form onSubmit={handleRegister} className="bg-[#1F271D]/80 backdrop-blur-md border border-[#CBB67B]/20 p-8 shadow-2xl space-y-8">
          {success ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <CheckCircle size={48} className="text-[#CBB67B]" />
              <h2 className="text-xl text-[#CBB67B] font-display-erp tracking-widest text-center">¡CORREO ENVIADO!</h2>
              <p className="text-sm text-[#8E9A8B] text-center max-w-md">
                Hemos enviado un enlace de activación a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para establecer tu contraseña y completar el registro.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#CBB67B] border border-[#CBB67B]/30 px-6 py-3 hover:bg-[#CBB67B]/10 transition-colors"
              >
                Volver
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 text-sm text-center">
                  {error}
                </div>
              )}

          {/* Seccion 1: Cuenta Maestra */}
          <div>
            <h3 className="text-[#CBB67B] text-xs uppercase tracking-widest font-semibold mb-4 border-b border-[#CBB67B]/20 pb-2">
              1. Credenciales de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[9px] uppercase tracking-wider text-[#8E9A8B] mb-1">Correo Corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-2 text-sm text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B]"
                  placeholder="admin@minervaalcaraz.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[9px] uppercase tracking-wider text-[#8E9A8B] mb-2">Ubicación Operativa</label>
              <div className="flex bg-[#2C3729] border border-[#CBB67B]/30 p-1">
                {["San Miguel", "ONLINE"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc as any)}
                    className={`flex-1 py-2 text-[10px] uppercase tracking-widest transition-colors ${
                      location === loc ? "bg-[#CBB67B] text-[#2C3729] font-bold" : "text-[#8E9A8B] hover:text-[#E5DBD6]"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seccion 2: Perfiles del Equipo */}
          <div>
            <div className="flex justify-between items-end mb-4 border-b border-[#CBB67B]/20 pb-2">
              <h3 className="text-[#CBB67B] text-xs uppercase tracking-widest font-semibold">
                2. Perfiles de Usuario
              </h3>
              <button
                type="button"
                onClick={addProfile}
                className="text-[9px] uppercase tracking-widest text-[#CBB67B] hover:text-[#E5DBD6] flex items-center gap-1"
              >
                <Plus size={12} /> Añadir Perfil
              </button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {profiles.map((profile, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-[#CBB67B]/10 bg-[#2C3729]/50"
                  >
                    {/* Avatar Upload */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 rounded-none border border-[#CBB67B]/30 bg-[#1F271D] flex items-center justify-center overflow-hidden relative group">
                        <UserPlaceholder />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Camera size={14} className="text-[#CBB67B]" />
                        </div>
                      </div>
                      <span className="text-[8px] uppercase text-[#8E9A8B] text-center">La foto se agrega<br/>más tarde</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#8E9A8B] mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => updateProfile(idx, "name", e.target.value)}
                          className="w-full bg-[#1F271D] border border-[#CBB67B]/20 px-3 py-2 text-sm text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B]"
                          placeholder="Ej. María López"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-[#8E9A8B] mb-1">Rol / Puesto (Libre)</label>
                        <input
                          type="text"
                          required
                          value={profile.role}
                          onChange={(e) => updateProfile(idx, "role", e.target.value)}
                          className="w-full bg-[#1F271D] border border-[#CBB67B]/20 px-3 py-2 text-sm text-[#E5DBD6] focus:outline-none focus:border-[#CBB67B]"
                          placeholder="Ej. Gerente de Ventas"
                        />
                      </div>
                    </div>

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProfile(idx)}
                        className="text-red-400 hover:text-red-300 self-start md:self-center p-2"
                        title="Eliminar Perfil"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Seccion 3: Verificacion */}
          <div className="bg-[#2C3729] p-5 border border-[#CBB67B]/20 space-y-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-[#CBB67B] bg-[#1F271D] border-[#CBB67B]/30"
              />
              <label htmlFor="terms" className="text-xs text-[#8E9A8B]">
                Acepto los <a href="#" className="text-[#CBB67B] underline underline-offset-2">Términos y Condiciones</a> y confirmo que estos datos son de uso exclusivo interno.
              </label>
            </div>

            <div className="flex justify-center pt-2 border-t border-[#CBB67B]/10">
              {/* reCAPTCHA fue eliminado en favor de la validación por correo electrónico */}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#CBB67B] text-[#2C3729] py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#E4D5A4] transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Enviar Invitación"}
          </button>
          </>
        )}
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/admin/login"
            className="text-[#8E9A8B] text-[10px] uppercase tracking-widest hover:text-[#CBB67B] transition-colors"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function UserPlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#8E9A8B]">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
