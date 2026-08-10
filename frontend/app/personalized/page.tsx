"use client";

import React, { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { LuxuryButton } from "../../components/DesignSystem";
import { MessageCircle, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "../../lib/store/useAuthStore";

export default function PersonalizedPage() {
  const { user } = useAuthStore();
  const [contactName, setContactName] = useState(user?.fullName || "");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ requestNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !description.trim()) {
      setErrorMsg("Por favor completa todos los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/concierge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: contactName,
          contact_email: contactEmail,
          description,
          user_id: user?.id || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Error al enviar la solicitud.");
      }

      setSubmittedData({ requestNumber: json.requestNumber });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error al procesar el envío.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 md:pt-48 pb-32 luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Vision */}
          <div className="flex flex-col gap-10">
            <span className="text-xs md:text-sm uppercase tracking-[0.8em] text-oro-antiguo">Co-Creación</span>
            <h1 className="hero-title-no-hyphens text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-verde-ebano leading-tight">
              Tu Historia en Metales Preciosos
            </h1>
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
                  <p className="text-xs md:text-sm opacity-60 leading-relaxed uppercase tracking-wider">Sesiones personalizadas con maestros joyeros.</p>
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
          <div className="bg-authority p-12 sm:p-16 md:p-24 flex flex-col gap-12 shadow-2xl">
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl md:text-4xl font-display text-oro-antiguo">Solicitud Concierge</h3>
              <p className="text-xs md:text-sm uppercase tracking-widest opacity-60 text-hueso-seda">Inicia tu ritual de personalización</p>
            </div>

            {submittedData ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <CheckCircle2 size={48} className="text-oro-antiguo" strokeWidth={1} />
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo font-mono">
                    {submittedData.requestNumber}
                  </span>
                  <h4 className="text-2xl font-display text-hueso-seda">Solicitud Recibida</h4>
                </div>
                <p className="text-xs sm:text-sm text-hueso-seda/80 font-light leading-relaxed max-w-sm italic">
                  Hemos enviado una copia a tu correo electrónico. Nuestro equipo del Atelier revisará tu proyecto y se pondrá en contacto en un máximo de 24 horas hábiles.
                </p>
                <button
                  onClick={() => {
                    setSubmittedData(null);
                    setDescription("");
                  }}
                  className="px-6 py-3 border border-oro-antiguo text-oro-antiguo text-xs uppercase tracking-widest hover:bg-oro-antiguo hover:text-verde-ebano transition-all mt-4"
                >
                  Enviar Otra Solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {errorMsg && (
                  <div className="p-4 bg-red-950/60 border border-red-500/30 text-red-300 text-xs tracking-wide">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors w-full"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs md:text-sm uppercase tracking-widest opacity-70 text-hueso-seda">
                    Descripción de la Joya
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-transparent border-b border-hueso-seda/40 py-3 text-base md:text-lg text-hueso-seda focus:outline-none focus:ring-0 focus:border-oro-antiguo transition-colors resize-none w-full"
                    placeholder="Cuéntanos sobre la pieza que deseas crear..."
                  />
                </div>
                
                <LuxuryButton
                  variant="gold"
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Procesando...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={20} /> Enviar Solicitud
                    </>
                  )}
                </LuxuryButton>
                
                <p className="text-[10px] md:text-xs text-center opacity-40 uppercase tracking-[0.2em] mt-6 text-hueso-seda">
                  Nuestro equipo te contactará en un máximo de 24 horas hábiles.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
