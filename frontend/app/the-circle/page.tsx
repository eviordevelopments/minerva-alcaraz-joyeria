"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { LuxuryButton } from "../components/DesignSystem";
import { Award, Package, Heart, Settings, MessageCircle, Star, PenTool } from "lucide-react";

export default function CircleDashboard() {
  const acquiredJewels = [
    { id: 1, name: "Anillo Luna de Plata", date: "12 May 2025", status: "Custodiado" }
  ];

  const customOrders = [
    { id: 101, name: "Brazalete Raíz Personalizado", status: "En Taller - Fase de Engaste" }
  ];

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 px-8 md:px-16 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col gap-16">
          
          {/* Header Profile Section */}
          <section className="flex flex-col md:flex-row justify-between items-center gap-8 bg-authority p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award size={120} strokeWidth={0.5} className="text-hueso-seda" />
            </div>
            
            <div className="flex items-center gap-8 z-10">
              <div className="w-24 h-24 bg-oro-antiguo flex items-center justify-center text-3xl font-display text-verde-ebano">
                MA
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display text-hueso-seda">Minerva Alcaraz</h1>
                  <span className="px-3 py-1 bg-oro-antiguo/20 border border-oro-antiguo text-[8px] uppercase tracking-widest text-oro-antiguo">
                    Miembro Legacy
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-hueso-seda/40">Desde 2024 • Custodio de Herencia</p>
              </div>
            </div>

            <div className="flex gap-4 z-10">
               <LuxuryButton variant="secondary" className="flex items-center gap-2">
                 <MessageCircle size={14} /> Concierge
               </LuxuryButton>
               <button className="p-3 border border-hueso-seda/10 text-hueso-seda hover:bg-hueso-seda/5 transition-all">
                 <Settings size={18} strokeWidth={1} />
               </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Orders & Collection */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Acquired Jewels Section */}
              <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Star className="text-oro-antiguo" size={20} />
                    <h2 className="text-2xl font-display text-verde-ebano">Joyas Adquiridas</h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-plata-niebla">{acquiredJewels.length} Piezas</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acquiredJewels.map((item) => (
                    <div key={item.id} className="flex gap-6 p-6 bg-white border border-plata-niebla/10 group hover:border-oro-antiguo transition-all cursor-pointer">
                      <div className="w-20 aspect-[3/4] bg-plata-niebla/5" />
                      <div className="flex flex-col justify-center gap-1">
                        <h4 className="text-sm font-display text-verde-ebano">{item.name}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-plata-niebla">Adquirido: {item.date}</span>
                        <div className="mt-2 flex items-center gap-2 text-[8px] uppercase tracking-widest text-oro-antiguo">
                          <Package size={10} /> {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Custom Orders Section */}
              <section className="flex flex-col gap-8 pt-12 border-t border-plata-niebla/10">
                <div className="flex items-center gap-4">
                  <PenTool className="text-oro-antiguo" size={20} />
                  <h2 className="text-2xl font-display text-verde-ebano">Pedidos Personalizados</h2>
                </div>
                
                <div className="flex flex-col gap-4">
                  {customOrders.map((order) => (
                    <div key={order.id} className="p-8 border border-dashed border-plata-niebla/30 flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] uppercase tracking-widest text-plata-niebla">ID: #{order.id}</span>
                        <h4 className="text-sm font-display text-verde-ebano">{order.name}</h4>
                        <p className="text-[10px] text-oro-antiguo mt-2 uppercase tracking-widest">{order.status}</p>
                      </div>
                      <LuxuryButton variant="primary" className="text-[10px] py-2">Ver Detalles</LuxuryButton>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Exclusive Perks & Stats */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-plata-niebla/5 p-12 flex flex-col gap-8">
                <h3 className="text-xl font-display text-verde-ebano">Privilegios Activos</h3>
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="p-2 bg-oro-antiguo/10 text-oro-antiguo h-fit">
                      <Star size={16} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-widest font-medium">Lanzamientos Anticipados</span>
                      <p className="text-[10px] text-plata-niebla leading-loose">Acceso 48h antes a la colección "Etérea".</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-2 bg-oro-antiguo/10 text-oro-antiguo h-fit">
                      <Package size={16} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-widest font-medium">Mantenimiento Atelier</span>
                      <p className="text-[10px] text-plata-niebla leading-loose">Servicio de limpieza y pulido anual disponible.</p>
                    </div>
                  </div>
                </div>
                <LuxuryButton className="w-full mt-4">Ver Todos los Beneficios</LuxuryButton>
              </div>

              <div className="p-12 border border-oro-antiguo/20 flex flex-col gap-4 text-center">
                <Heart size={24} strokeWidth={1} className="mx-auto text-oro-antiguo" />
                <h4 className="text-sm uppercase tracking-widest text-verde-ebano">Lista de Deseos</h4>
                <p className="text-[10px] text-plata-niebla">12 piezas guardadas para el futuro.</p>
                <a href="/favorites" className="text-[10px] uppercase tracking-widest text-oro-antiguo border-b border-oro-antiguo w-fit mx-auto mt-2">Explorar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
