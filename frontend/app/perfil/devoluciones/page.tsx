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
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">Gestión</p>
              <h1 className={`text-3xl font-display ${user?.isCircleMember ? "text-white" : "text-verde-ebano"}`}>
                Devoluciones
              </h1>
            </div>

            {/* Policy card */}
            <div className={`border p-6 flex flex-col gap-3 ${
              user?.isCircleMember
                ? "bg-[#1E261C] border-[#CBB67B]/25 text-white"
                : "bg-verde-ebano/4 border-verde-ebano/8"
            }`}>
              <div className="flex items-center gap-2">
                <RotateCcw size={13} strokeWidth={1.2} className="text-oro-antiguo" />
                <span className={`text-[11px] uppercase tracking-[0.4em] ${
                  user?.isCircleMember ? "text-[#CBB67B] font-semibold" : "text-verde-ebano/60"
                }`}>
                  Política de Devoluciones
                </span>
              </div>
              <p className={`text-sm leading-loose ${
                user?.isCircleMember ? "text-white/90" : "text-verde-ebano/70"
              }`}>
                {user?.isCircleMember ? (
                  <>
                    Como miembro de <strong className="text-oro-antiguo font-bold">THE CIRCLE</strong>, cuentas con un periodo extendido exclusivo de <strong className="text-white font-bold bg-black/20 px-1.5 py-0.5 border border-[#CBB67B]/40">30 días naturales</strong> desde la recepción de tu pedido para solicitar una devolución o cambio (frente a los 10 días para clientes generales). Las piezas únicas y personalizadas en co-creación no son reembolsables.
                  </>
                ) : (
                  <>
                    Tienes <strong className="text-verde-ebano font-bold bg-verde-ebano/5 px-1.5 py-0.5 border border-verde-ebano/20">10 días naturales</strong> desde la recepción de tu pedido para solicitar una devolución o cambio. Como beneficio exclusivo, los miembros de <strong className="text-oro-antiguo font-bold">THE CIRCLE</strong> disponen de un plazo extendido de <strong className="text-oro-antiguo font-bold">30 días naturales</strong>. Las piezas únicas y personalizadas en co-creación no son reembolsables.
                  </>
                )}
              </p>
            </div>

            {success ? (
              <div className={`border p-12 flex flex-col items-center gap-5 text-center ${
                user?.isCircleMember ? "bg-[#1E261C] border-[#CBB67B]/20 text-white" : "bg-white border-verde-ebano/8"
              }`}>
                <CheckCircle2 size={32} strokeWidth={1} className="text-emerald-400" />
                <div className="flex flex-col gap-2">
                  <p className="text-base font-display text-white">Solicitud Enviada</p>
                  <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                    Nuestro equipo revisará tu solicitud y se pondrá en contacto en un plazo de 24–48 horas hábiles.
                  </p>
                </div>
                <button onClick={() => router.push("/perfil/pedidos")} className="text-[11px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors">
                  Ver Mis Pedidos →
                </button>
              </div>
            ) : (
              <div className={`border p-8 ${
                user?.isCircleMember ? "bg-[#1E261C] border-[#CBB67B]/20 text-white" : "bg-white border-verde-ebano/8"
              }`}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className={`text-[11px] uppercase tracking-[0.4em] ${
                      user?.isCircleMember ? "text-[#CBB67B] font-semibold" : "text-verde-ebano/60"
                    }`}>
                      Número de Pedido *
                    </label>
                    <input
                      value={orderNum} onChange={e => setOrderNum(e.target.value)} required
                      className={`bg-transparent border-b py-2.5 text-base outline-none transition-colors ${
                        user?.isCircleMember
                          ? "text-white border-[#CBB67B]/30 focus:border-[#CBB67B] placeholder:text-white/60"
                          : "text-verde-ebano border-verde-ebano/20 focus:border-oro-antiguo placeholder:text-verde-ebano/40"
                      }`}
                      placeholder="MA-2025-0001"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={`text-[11px] uppercase tracking-[0.4em] ${
                      user?.isCircleMember ? "text-[#CBB67B] font-semibold" : "text-verde-ebano/60"
                    }`}>
                      Motivo de Devolución *
                    </label>
                    <select value={reason} onChange={e => setReason(e.target.value)} required
                      className={`bg-transparent border-b py-2.5 text-base outline-none transition-colors cursor-pointer ${
                        user?.isCircleMember
                          ? "text-white border-[#CBB67B]/30 focus:border-[#CBB67B]"
                          : "text-verde-ebano border-verde-ebano/20 focus:border-oro-antiguo"
                      }`}
                    >
                      <option value="" className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Seleccionar motivo</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Cambio de talla</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Pieza dañada al recibir</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>No es lo que esperaba</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Pedido incorrecto</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Regalo no aceptado</option>
                      <option className={user?.isCircleMember ? "bg-[#1E261C] text-white" : "bg-white text-verde-ebano"}>Otro</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={`text-[11px] uppercase tracking-[0.4em] ${
                      user?.isCircleMember ? "text-[#CBB67B] font-semibold" : "text-verde-ebano/60"
                    }`}>
                      Detalles adicionales
                    </label>
                    <textarea
                      value={details} onChange={e => setDetails(e.target.value)} rows={3}
                      className={`bg-transparent border-b py-2.5 text-base outline-none transition-colors resize-none ${
                        user?.isCircleMember
                          ? "text-white border-[#CBB67B]/30 focus:border-[#CBB67B] placeholder:text-white/60"
                          : "text-verde-ebano border-verde-ebano/20 focus:border-oro-antiguo placeholder:text-verde-ebano/40"
                      }`}
                      placeholder="Cuéntanos más sobre tu situación..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center justify-center gap-3 bg-oro-antiguo text-verde-ebano text-xs uppercase tracking-[0.5em] py-4 hover:bg-hueso-seda transition-all duration-500 font-bold disabled:opacity-60 group shadow-md"
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
