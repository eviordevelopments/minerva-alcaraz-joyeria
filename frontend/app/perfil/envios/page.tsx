"use client";
import React, { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Truck, Crown, Package, Clock, Shield, MapPin } from "lucide-react";

export default function EnviosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);
  if (!user) return null;

  const perks = [
    { icon: Package, title: "Packaging de Cedro", desc: "Caja artesanal de cedro, papel tisú satinado y sello de lacre con el escudo de Minerva Alcaraz." },
    { icon: Clock, title: "Entrega 24–48h", desc: "CDMX en 24 horas. Resto del país en 48–72 horas. Internacional bajo consulta." },
    { icon: Shield, title: "Envío Asegurado", desc: "Cada pieza viaja con seguro completo. En caso de extravío, reponemos la pieza sin costo." },
    { icon: MapPin, title: "Rastreo en Tiempo Real", desc: "Recibes actualizaciones por WhatsApp en cada etapa del envío." },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-verde-ebano">Envíos Prioritarios</h1>
            </div>

            <div className="bg-verde-ebano/4 border border-oro-antiguo/10 p-5 flex items-start gap-3">
              <Truck size={14} strokeWidth={1} className="text-oro-antiguo flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-verde-ebano/50 leading-loose">
                Como miembro de The Circle, todos tus envíos son <strong className="text-verde-ebano/70">completamente gratuitos</strong> y tienen prioridad de despacho. Tu joya llega envuelta como merece.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-verde-ebano/8 p-6 flex flex-col gap-3">
                  <div className="w-9 h-9 border border-oro-antiguo/15 flex items-center justify-center">
                    <Icon size={14} strokeWidth={1.2} className="text-oro-antiguo" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano font-medium">{title}</h3>
                    <p className="text-[9px] text-verde-ebano/40 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-verde-ebano/8 p-8 flex flex-col gap-4">
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-verde-ebano/40 border-b border-verde-ebano/6 pb-4">Mis Envíos Activos</h2>
              <p className="text-[10px] text-verde-ebano/25 italic">No tienes envíos activos en este momento.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
