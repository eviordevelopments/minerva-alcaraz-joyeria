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
    { icon: MessageCircle, label: "WhatsApp", value: "+52 55 1234 5678", href: "https://wa.me/5215512345678", color: "text-green-500" },
    { icon: Mail, label: "Correo Directo", value: "hola@minervaalcaraz.com", href: "mailto:hola@minervaalcaraz.com", color: "text-oro-antiguo" },
    { icon: Phone, label: "Teléfono", value: "+52 55 1234 5678", href: "tel:+5215512345678", color: "text-verde-ebano/60" },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">Asistencia</p>
              <h1 className="text-3xl font-display text-verde-ebano">Soporte</h1>
            </div>

            {/* Contact channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {channels.map(({ icon: Icon, label, value, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-verde-ebano/8 p-5 flex flex-col gap-3 hover:border-verde-ebano/25 transition-colors group"
                >
                  <Icon size={16} strokeWidth={1.2} className={color} />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">{label}</p>
                    <p className="text-[10px] text-verde-ebano/70 group-hover:text-verde-ebano transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white border border-verde-ebano/8 p-8">
              <div className="flex items-center gap-3 mb-6">
                <HeadphonesIcon size={14} strokeWidth={1.2} className="text-oro-antiguo" />
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-verde-ebano/60">Enviar Mensaje</h2>
              </div>

              {success ? (
                <div className="flex flex-col items-center gap-5 py-10 text-center">
                  <CheckCircle2 size={28} strokeWidth={1} className="text-green-500" />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-display text-verde-ebano">Mensaje Enviado</p>
                    <p className="text-[10px] text-verde-ebano/40 leading-relaxed max-w-xs">
                      Te responderemos en tu correo en un plazo de 24 horas hábiles.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Asunto *</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)} required
                      className="bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Mensaje *</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                      className="bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors resize-none placeholder:text-verde-ebano/20"
                      placeholder="Cuéntanos con detalle tu consulta..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-[10px] uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 disabled:opacity-60 group"
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
