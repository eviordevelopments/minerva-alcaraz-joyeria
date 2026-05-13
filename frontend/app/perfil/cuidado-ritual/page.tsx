"use client";
import React, { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { BookOpen, Crown, Droplets, Wind, Sun } from "lucide-react";

const GUIDES = [
  { icon: Droplets, title: "Ritual de Limpieza", desc: "Cómo limpiar y conservar tus piezas de plata y oro con ingredientes naturales.", material: "Plata · Oro", time: "10 min" },
  { icon: Wind, title: "Almacenamiento Correcto", desc: "Protege tus joyas de la oxidación, humedad y arañazos con este ritual de guarda.", material: "Todas las piezas", time: "5 min" },
  { icon: Sun, title: "Cuidado de Piedras Naturales", desc: "Guía específica para amatistas, cuarzos, rubíes y esmeraldas.", material: "Piedras naturales", time: "15 min" },
  { icon: Droplets, title: "Baño de Pulido Artesanal", desc: "Técnica tradicional para recuperar el brillo original de piezas envejecidas.", material: "Plata oxidada", time: "20 min" },
];

export default function CuidadoRitualPage() {
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
              <h1 className="text-3xl font-display text-verde-ebano">Cuidado y Ritual</h1>
            </div>
            <p className="text-sm text-verde-ebano/40 font-light leading-loose max-w-xl">
              Guías exclusivas para preservar la belleza de tus piezas Minerva Alcaraz. El cuidado de una joya es un acto de amor hacia el tiempo que dura.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDES.map(({ icon: Icon, title, desc, material, time }) => (
                <div key={title} className="bg-white border border-verde-ebano/8 hover:border-oro-antiguo/20 transition-all p-6 flex flex-col gap-4 group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 border border-verde-ebano/10 flex items-center justify-center group-hover:border-oro-antiguo/30 transition-colors">
                      <Icon size={14} strokeWidth={1.2} className="text-oro-antiguo" />
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-verde-ebano/25">{time}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-verde-ebano font-medium">{title}</h3>
                    <p className="text-[9px] text-verde-ebano/40 leading-relaxed">{desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-[0.3em] border border-verde-ebano/10 text-verde-ebano/30 px-2 py-1">{material}</span>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-oro-antiguo group-hover:underline transition-all">Leer →</span>
                  </div>
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
