"use client";
import React, { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Sparkles, Crown, MessageCircle, ArrowRight } from "lucide-react";

export default function ConciergePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-verde-ebano">Concierge Privado</h1>
            </div>
            <div className="bg-verde-ebano p-10 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute right-6 top-6 opacity-5"><Crown size={120} strokeWidth={0.3} className="text-oro-antiguo" /></div>
              <Sparkles size={20} className="text-oro-antiguo" strokeWidth={1} />
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-display text-hueso-seda">Minerva te atiende personalmente</h2>
                <p className="text-hueso-seda/60 text-sm font-light leading-loose max-w-lg">
                  Tu concierge dedicada está disponible para consultas de estilo, visitas al atelier, co-creación de piezas personalizadas y cualquier detalle de tu experiencia como miembro de The Circle.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://wa.me/5215512345678?text=Hola%20Minerva%2C%20soy%20miembro%20de%20The%20Circle..."
                  className="flex items-center gap-3 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.5em] px-8 py-4 hover:bg-hueso-seda transition-colors group"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  Abrir WhatsApp
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a href="mailto:concierge@minervaalcaraz.com"
                  className="flex items-center gap-3 border border-hueso-seda/20 text-hueso-seda text-[10px] uppercase tracking-[0.4em] px-8 py-4 hover:border-oro-antiguo hover:text-oro-antiguo transition-colors"
                >
                  Enviar Correo
                </a>
              </div>
              <p className="text-[8px] uppercase tracking-[0.4em] text-hueso-seda/20">Respuesta garantizada en menos de 4 horas en días hábiles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Consulta de Estilo", desc: "Selección personalizada de piezas según tu gusto y ocasión" },
                { title: "Visita al Atelier", desc: "Agenda una visita privada para conocer el proceso artesanal" },
                { title: "Co-Creación", desc: "Diseña con Minerva tu pieza completamente única" },
              ].map(s => (
                <div key={s.title} className="bg-white border border-verde-ebano/8 p-6 flex flex-col gap-2">
                  <h3 className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano font-medium">{s.title}</h3>
                  <p className="text-[9px] text-verde-ebano/35 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
