"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Package, Heart, Star, Calendar, MessageCircle, ArrowRight } from "lucide-react";

const DashboardCard = ({ icon: Icon, title, description, href }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-authority p-10 border border-hueso-seda/5 flex flex-col gap-6 group cursor-pointer"
  >
    <div className="text-oro-antiguo group-hover:scale-110 transition-transform">
      <Icon size={28} strokeWidth={1} />
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-display text-hueso-seda uppercase tracking-widest">{title}</h3>
      <p className="text-[10px] text-hueso-seda/50 leading-relaxed uppercase tracking-widest">{description}</p>
    </div>
    <div className="mt-4 flex items-center gap-2 text-[9px] text-oro-antiguo uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
      Gestionar <ArrowRight size={12} />
    </div>
  </motion.div>
);

export default function CircleDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-verde-ebano text-hueso-seda">
      <Header theme="dark" />
      
      <div className="pt-32 md:pt-48 pb-32 luxury-container">
        {/* Member Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24 pb-12 border-b border-hueso-seda/10">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">Bienvenido, Miembro</span>
            <h1 className="text-5xl md:text-7xl font-display uppercase tracking-widest">{user.fullName}</h1>
            <p className="text-sm italic opacity-60 font-light">"Su presencia en The Circle es el alma de nuestra herencia."</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] uppercase tracking-widest opacity-40">Nivel de Lealtad</span>
            <div className="text-2xl font-display text-oro-antiguo">ORO ANTIGUO</div>
            <div className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo/50">{user.points} Puntos de Alma</div>
          </div>
        </div>

        {/* Exclusive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard 
            icon={Package} 
            title="Mis Pedidos" 
            description="Seguimiento de sus tesoros en camino y archivos de piezas adquiridas."
          />
          <DashboardCard 
            icon={Heart} 
            title="Mi Curaduría" 
            description="Su selección personal de piezas que esperan ser parte de su historia."
          />
          <DashboardCard 
            icon={Star} 
            title="Colecciones Privadas" 
            description="Acceso exclusivo a piezas de edición limitada antes del lanzamiento público."
          />
          <DashboardCard 
            icon={MessageCircle} 
            title="Concierge Privado" 
            description="Canal directo de asesoría experta y personalización prioritaria."
          />
          <DashboardCard 
            icon={Calendar} 
            title="Eventos Atelier" 
            description="Invitaciones a experiencias presenciales y digitales exclusivas."
          />
          <DashboardCard 
            icon={Package} 
            title="Cuidado & Ritual" 
            description="Historial de mantenimiento y guías personalizadas para sus joyas."
          />
        </div>

        {/* Featured Private Piece */}
        <div className="mt-32 p-16 border border-oro-antiguo/20 bg-hueso-seda/5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
             {/* Product Image could go here */}
          </div>
          <div className="relative z-10 flex flex-col gap-6 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">Pieza Exclusiva del Mes</span>
            <h2 className="text-3xl md:text-5xl font-display uppercase">El Anillo de Minerva (Ed. Oro Blanco)</h2>
            <p className="text-sm leading-loose opacity-60 font-light">
              Disponible únicamente para miembros nivel Oro Antiguo. Solo tres piezas han sido forjadas en nuestro atelier de Taxco este ciclo.
            </p>
            <button className="w-fit mt-4 text-[10px] uppercase tracking-[0.4em] py-4 px-10 border border-oro-antiguo text-oro-antiguo hover:bg-oro-antiguo hover:text-verde-ebano transition-all">
              Ver Detalles Privados
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
