"use client";

import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LuxuryButton } from "../../components/DesignSystem";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";

export default function PersonalizedPage() {
  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 md:pt-48 pb-32 luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Vision */}
          <div className="flex flex-col gap-10">
            <span className="text-xs md:text-sm uppercase tracking-[0.8em] text-oro-antiguo">Co-Creación</span>
            <h1 className="text-4xl md:text-8xl font-display text-verde-ebano leading-tight">Tu Historia en Metales Preciosos</h1>
            <p className="text-lg md:text-xl leading-relaxed text-verde-ebano/80 font-light">
              El servicio Concierge de Minerva Alcaraz permite a nuestros clientes participar en el ritual de diseño. Desde la selección de gemas únicas hasta la conceptualización de formas que capturen momentos irrepetibles.
            </p>
            
            <div className="flex flex-col gap-10 mt-10 border-l-2 border-oro-antiguo pl-10">
              <div className="flex items-start gap-8">
                <div className="p-4 bg-plata-niebla/10 text-oro-antiguo">
                  <Clock size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-sm md:text-base uppercase tracking-widest text-verde-ebano mb-3">Cita de Diseño</h4>
                  <p className="text-xs md:text-sm opacity-60 leading-relaxed uppercase tracking-wider">Sesiones de 45 minutos con maestros joyeros.</p>
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div className="p-4 bg-plata-niebla/10 text-oro-antiguo">
                  <MapPin size={28} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-sm md:text-base uppercase tracking-widest text-verde-ebano mb-3">Presencial o Digital</h4>
                  <p className="text-xs md:text-sm opacity-60 leading-relaxed uppercase tracking-wider">Disponible en nuestro atelier o vía Zoom.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-authority p-16 md:p-24 flex flex-col gap-12 shadow-2xl">
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl md:text-4xl font-display text-oro-antiguo">Solicitud Concierge</h3>
              <p className="text-xs md:text-sm uppercase tracking-widest opacity-60 text-hueso-seda">Inicia tu ritual de personalización</p>
            </div>

            <form className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">Nombre Completo</label>
                <input type="text" className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors w-full" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">Email de Contacto</label>
                <input type="email" className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors w-full" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">Descripción del Proyecto</label>
                <textarea rows={5} className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors resize-none w-full" placeholder="Cuéntanos sobre la pieza que deseas crear..." />
              </div>
              
              <LuxuryButton variant="gold" className="mt-8 py-4 text-base flex items-center justify-center gap-3">
                <MessageCircle size={20} /> Enviar Solicitud
              </LuxuryButton>
              
              <p className="text-[10px] md:text-xs text-center opacity-40 uppercase tracking-[0.2em] mt-6 text-hueso-seda">
                Nuestro equipo te contactará en un máximo de 24 horas hábiles.
              </p>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
