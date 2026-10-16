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
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-white">Cuidado y Ritual</h1>
            </div>
            <p className="text-base text-[#E5DBD6]/70 font-light leading-loose max-w-xl">
              Guías exclusivas para preservar la belleza de tus piezas Minerva Alcaraz. El cuidado de una joya es un acto de amor hacia el tiempo que dura.
            </p>
            <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-10 flex flex-col items-center justify-center text-center gap-4 shadow-xl">
              <div className="w-12 h-12 border border-[#CBB67B]/30 flex items-center justify-center bg-black/20 text-[#CBB67B]">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-sm font-display text-white uppercase tracking-wider">Rituales en Preparación</h3>
                <p className="text-xs text-[#E5DBD6]/70 font-light leading-relaxed">
                  Las guías magistrales de preservación y conservación de gemas y metales nobles están siendo curadas por nuestros orfebres para miembros de The Circle. Estarán disponibles próximamente en este espacio exclusivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
