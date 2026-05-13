"use client";

import React, { useState } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RotateCcw, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function DevolucionesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orderNum, setOrderNum] = useState("");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orderNum || !reason) return;
    setIsSubmitting(true);
    await supabase.from("contact_messages").insert({
      user_id: user.id,
      name: user.fullName,
      email: user.email,
      subject: `Devolución — Pedido ${orderNum}`,
      message: `Razón: ${reason}\n\nDetalles: ${details}`,
      source: "devoluciones",
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">Gestión</p>
              <h1 className="text-3xl font-display text-verde-ebano">Devoluciones</h1>
            </div>

            {/* Policy card */}
            <div className="bg-verde-ebano/4 border border-verde-ebano/8 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <RotateCcw size={13} strokeWidth={1.2} className="text-oro-antiguo" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/60">Política de Devoluciones</span>
              </div>
              <p className="text-xs text-verde-ebano/50 leading-loose">
                Tienes <strong className="text-verde-ebano/70">30 días naturales</strong> desde la recepción de tu pedido para solicitar una devolución. Los miembros de <strong className="text-oro-antiguo">THE CIRCLE</strong> tienen 90 días. Las piezas únicas y personalizadas no son reembolsables, pero ofrecemos cambio de talla sin costo.
              </p>
            </div>

            {success ? (
              <div className="bg-white border border-verde-ebano/8 p-12 flex flex-col items-center gap-5 text-center">
                <CheckCircle2 size={32} strokeWidth={1} className="text-green-500" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-display text-verde-ebano">Solicitud Enviada</p>
                  <p className="text-[10px] text-verde-ebano/40 leading-relaxed max-w-xs">
                    Nuestro equipo revisará tu solicitud y se pondrá en contacto en un plazo de 24–48 horas hábiles.
                  </p>
                </div>
                <button onClick={() => router.push("/perfil/pedidos")} className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors">
                  Ver Mis Pedidos →
                </button>
              </div>
            ) : (
              <div className="bg-white border border-verde-ebano/8 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Número de Pedido *</label>
                    <input
                      value={orderNum} onChange={e => setOrderNum(e.target.value)} required
                      className="bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
                      placeholder="MA-2025-0001"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Motivo de Devolución *</label>
                    <select value={reason} onChange={e => setReason(e.target.value)} required
                      className="bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors cursor-pointer"
                    >
                      <option value="">Seleccionar motivo</option>
                      <option>Cambio de talla</option>
                      <option>Pieza dañada al recibir</option>
                      <option>No es lo que esperaba</option>
                      <option>Pedido incorrecto</option>
                      <option>Regalo no aceptado</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Detalles adicionales</label>
                    <textarea
                      value={details} onChange={e => setDetails(e.target.value)} rows={3}
                      className="bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors resize-none placeholder:text-verde-ebano/20"
                      placeholder="Cuéntanos más sobre tu situación..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-[10px] uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 disabled:opacity-60 group"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><span>Enviar Solicitud</span><ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
