"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { HeadphonesIcon, MessageCircle, Mail, Phone, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function SoportePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject || !message) return;
    setIsSubmitting(true);
    await supabase.from("contact_messages").insert({
      user_id: user.id,
      name: user.fullName,
      email: user.email,
      subject,
      message,
      source: "soporte",
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  if (!user) return null;

  const channels = [
    { icon: MessageCircle, label: "WhatsApp Concierge", value: "+52 462 621 7960", href: "https://wa.me/524626217960?text=Hola%20Minerva%20Alcaraz,%20deseo%20asesor%C3%ADa%20personalizada%20sobre%20las%20piezas%20de%20alta%20joyer%C3%ADa.", color: "text-green-500" },
    { icon: Mail, label: "Correo Directo", value: "concierge@minervaalcarazjoyeria.mx", href: "mailto:concierge@minervaalcarazjoyeria.mx", color: "text-oro-antiguo" },
    { icon: Phone, label: "Teléfono", value: "+52 462 621 7960", href: "tel:+524626217960", color: "text-verde-ebano/60" },
  ];

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">Asistencia</p>
              <h1 className="text-3xl font-display text-verde-ebano">Soporte</h1>
            </div>

            {/* Contact channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {channels.map(({ icon: Icon, label, value, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="bg-[#1E261C] border border-[#CBB67B]/25 p-5 flex flex-col gap-3 hover:border-[#CBB67B] transition-colors group shadow-md"
                >
                  <Icon size={18} strokeWidth={1.5} className={color === "text-green-500" ? "text-emerald-400" : color === "text-oro-antiguo" ? "text-[#CBB67B]" : "text-white"} />
                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#CBB67B] font-semibold">{label}</p>
                    <p className="text-xs sm:text-sm text-white font-medium tracking-wide group-hover:text-[#CBB67B] transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Guarantee badge */}
            <div className="bg-[#1E261C] border border-white/15 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white font-semibold">
                Respuesta garantizada en menos de 4 horas en días hábiles
              </p>
            </div>

            {/* Form */}
            <div className="bg-[#1E261C] border border-[#CBB67B]/20 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <HeadphonesIcon size={16} strokeWidth={1.5} className="text-[#CBB67B]" />
                <h2 className="text-xs uppercase tracking-[0.4em] text-[#CBB67B] font-bold">Enviar Mensaje</h2>
              </div>

              {success ? (
                <div className="flex flex-col items-center gap-5 py-10 text-center">
                  <CheckCircle2 size={32} strokeWidth={1} className="text-emerald-400" />
                  <div className="flex flex-col gap-2">
                    <p className="text-base font-display text-white">Mensaje Enviado</p>
                    <p className="text-xs text-white/80 leading-relaxed max-w-xs">
                      Te responderemos en tu correo en un plazo de 24 horas hábiles.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.4em] text-[#CBB67B] font-semibold">Asunto *</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} required
                      className="bg-transparent border-b border-[#CBB67B]/30 py-2.5 text-base text-white outline-none focus:border-[#CBB67B] transition-colors placeholder:text-white/60"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.4em] text-[#CBB67B] font-semibold">Mensaje *</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                      className="bg-transparent border-b border-[#CBB67B]/30 py-2.5 text-base text-white outline-none focus:border-[#CBB67B] transition-colors resize-none placeholder:text-white/60"
                      placeholder="Cuéntanos con detalle tu consulta..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center justify-center gap-3 bg-[#CBB67B] text-[#1F271D] text-xs uppercase tracking-[0.5em] py-4 hover:bg-[#E5DBD6] transition-all duration-500 font-bold disabled:opacity-60 group shadow-md"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><span>Enviar</span><ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
