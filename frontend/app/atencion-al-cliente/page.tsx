"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Compass,
  MessageCircle,
  Phone,
  Clock
} from "lucide-react";
import { 
  CONTACT_PHONE_DISPLAY, 
  CONTACT_PHONE_TEL, 
  WHATSAPP_LINK,
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  SAN_MIGUEL_WHATSAPP_LINK
} from "../../lib/contact";

export default function AtencionClientePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMessage("Por favor completa los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        subject: subject || "Consulta de Atención al Cliente",
        message,
        source: "atencion_cliente",
      });

      if (error) {
        console.error("Error al enviar mensaje:", error);
        setErrorMessage(`Hubo un detalle al enviar el mensaje. También puedes escribirnos a ${CONTACT_EMAIL}`);
      } else {
        setIsSuccess(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-hueso-seda text-verde-ebano selection:bg-oro-antiguo/30">
      <Header />

      {/* Hero Section */}
      <section className="pt-36 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-verde-ebano/10 relative overflow-hidden bg-verde-ebano text-hueso-seda">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-oro-antiguo/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hueso-seda/5 rounded-full blur-[90px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-12 h-[1px] bg-oro-antiguo mb-6" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.45em] text-oro-antiguo font-medium mb-3">
            Minerva Alcaraz Joyería · Canales Oficiales
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display leading-tight uppercase tracking-tight">
            Atención al Cliente
          </h1>
          <p className="mt-6 text-sm sm:text-base font-light text-hueso-seda/80 leading-relaxed max-w-2xl italic">
            &ldquo;Tu esencia, hecha joya. Cada consulta merece la misma dedicación y detalle con la que forjamos cada una de nuestras piezas.&rdquo;
          </p>
        </div>
      </section>

      {/* Main Official Line Box */}
      <section className="relative -mt-8 sm:-mt-12 z-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-[#1C251A] border-2 border-oro-antiguo/50 text-hueso-seda p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(203,182,123,0.22),transparent_70%)] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-hueso-seda/10 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 rounded-full border border-oro-antiguo/60 bg-oro-antiguo/15 flex items-center justify-center text-oro-antiguo flex-shrink-0 shadow-inner">
                <MessageCircle size={26} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                  Canal Oficial de Atención Directa
                </span>
                <h2 className="text-xl sm:text-2xl font-display text-white">
                  Línea Telefónica &amp; WhatsApp Concierge
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-widest uppercase rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Línea Activa
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col gap-6 text-hueso-seda/90 leading-relaxed text-sm sm:text-base font-light relative z-10">
            <p className="text-base sm:text-lg font-normal text-white">
              Nuestra línea directa y canal de WhatsApp se encuentran completamente activos para brindarte la atención cálida y personalizada que distingue a nuestra joyería de autor.
            </p>
            
            <div className="bg-black/30 border border-oro-antiguo/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-oro-antiguo font-mono block mb-1">
                  Número Telefónico &amp; WhatsApp
                </span>
                <span className="text-2xl sm:text-3xl font-mono text-white font-bold tracking-wider select-all">
                  {CONTACT_PHONE_DISPLAY}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial bg-oro-antiguo text-verde-ebano hover:bg-hueso-seda font-bold px-6 py-3.5 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Directo</span>
                </a>
                <a
                  href={CONTACT_PHONE_TEL}
                  className="flex-1 sm:flex-initial border border-oro-antiguo/50 text-oro-antiguo hover:bg-oro-antiguo/10 px-5 py-3.5 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={14} />
                  <span>Llamar</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-hueso-seda/70">
              Horario de atención personalizada: Lunes a Sábado de 10:00 AM a 08:00 PM. Responderemos tus dudas sobre pedidos, disponibilidad de piezas exclusivas, citas privadas y co-creación artesanal.
            </p>
          </div>
        </div>
      </section>

      {/* Alternative Channels Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Header Channels */}
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-[0.35em] text-oro-antiguo font-semibold">
              Vías de Contacto Directas
            </span>
            <h3 className="text-2xl sm:text-3xl font-display text-verde-ebano uppercase">
              ¿Cómo podemos ayudarte hoy?
            </h3>
            <div className="w-8 h-[1px] bg-oro-antiguo mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: WhatsApp y Teléfono */}
            <div className="bg-white border border-verde-ebano/15 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-oro-antiguo/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-950/10 border border-emerald-600/20 flex items-center justify-center text-emerald-800">
                  <MessageCircle size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Atención Inmediata
                  </span>
                  <h4 className="text-xl font-display text-verde-ebano">
                    WhatsApp &amp; Teléfono
                  </h4>
                  <p className="text-xs text-verde-ebano/70 font-light leading-relaxed">
                    Comunícate directamente con nuestro Concierge para resolver inquietudes al instante.
                  </p>
                </div>

                <div className="bg-hueso-seda/40 border border-verde-ebano/10 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-verde-ebano/60 mb-0.5 font-mono">Línea Oficial</p>
                  <p className="text-sm font-mono text-verde-ebano font-bold select-all">
                    {CONTACT_PHONE_DISPLAY}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-verde-ebano text-hueso-seda hover:bg-oro-antiguo hover:text-verde-ebano py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center shadow-sm"
                >
                  <MessageCircle size={14} />
                  <span>Abrir WhatsApp</span>
                </a>
                <a
                  href={CONTACT_PHONE_TEL}
                  className="w-full border border-verde-ebano/20 text-verde-ebano hover:bg-verde-ebano/5 py-2.5 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                >
                  <Phone size={13} />
                  <span>Llamar por Teléfono</span>
                </a>
              </div>
            </div>

            {/* Card 2: Email Concierge */}
            <div className="bg-white border border-verde-ebano/15 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-oro-antiguo/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-verde-ebano/5 border border-verde-ebano/15 flex items-center justify-center text-verde-ebano">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Canal Institucional
                  </span>
                  <h4 className="text-xl font-display text-verde-ebano">
                    Correo Directo
                  </h4>
                  <p className="text-xs text-verde-ebano/70 font-light leading-relaxed">
                    Escribe a nuestro equipo para adquisiciones corporativas, cotizaciones y seguimiento formal.
                  </p>
                </div>

                <div className="bg-hueso-seda/40 border border-verde-ebano/10 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-verde-ebano/60 mb-0.5 font-mono">Dirección Oficial</p>
                  <p className="text-xs font-mono text-verde-ebano font-semibold break-all select-all">
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </div>

              <a
                href={CONTACT_EMAIL_MAILTO}
                className="w-full bg-verde-ebano text-hueso-seda hover:bg-oro-antiguo hover:text-verde-ebano py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center shadow-sm group"
              >
                <span>Enviar Correo</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Card 3: Puntos de Venta */}
            <div className="bg-white border border-verde-ebano/15 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm hover:border-oro-antiguo/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-verde-ebano/5 border border-verde-ebano/15 flex items-center justify-center text-verde-ebano">
                  <MapPin size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Atención Presencial
                  </span>
                  <h4 className="text-xl font-display text-verde-ebano">
                    Puntos de Venta
                  </h4>
                  <p className="text-xs text-verde-ebano/70 font-light leading-relaxed">
                    Espacios exclusivos autorizados para descubrir colecciones y adquirir piezas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-[11px] text-verde-ebano/80 font-light border-t border-verde-ebano/10 pt-3">
                  <div>
                    <strong className="font-semibold text-verde-ebano block">Floroteca · Irapuato, Gto.</strong>
                    <span>Av. Mariano J. García 1568, San Miguelito</span>
                  </div>
                  <div>
                    <strong className="font-semibold text-verde-ebano block">San Miguel de Allende · Cita Previa</strong>
                    <span>Mesones Número 74 Colonia Centro dentro de Fina Catrina</span>
                    <p className="text-[10px] text-oro-antiguo/90 font-medium mt-1 leading-snug">
                      Para ir ahí será a través de citas por mensaje según disponibilidad; favor de contactar a tu concierge por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={SAN_MIGUEL_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-oro-antiguo text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center shadow-sm"
                >
                  <MessageCircle size={13} />
                  <span>Agendar Cita en Agenda</span>
                </a>
                <Link
                  href="/#boutiques"
                  className="w-full border border-verde-ebano/20 text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda py-2.5 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                >
                  <Compass size={13} />
                  <span>Ver Puntos de Venta</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Formulario Integrado de Contacto */}
          <div className="bg-[#1C251A] border border-oro-antiguo/30 p-8 sm:p-12 text-hueso-seda shadow-xl">
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
              <div className="text-center flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.35em] text-oro-antiguo font-mono">
                  Mensaje Directo
                </span>
                <h3 className="text-2xl sm:text-3xl font-display text-white">
                  Escríbenos un Mensaje
                </h3>
                <p className="text-xs sm:text-sm text-hueso-seda/70 font-light">
                  Déjanos tus datos e inquietud; un asesor de nuestro equipo te responderá a la brevedad por correo electrónico o WhatsApp.
                </p>
              </div>

              {isSuccess ? (
                <div className="bg-verde-ebano/60 border border-oro-antiguo/40 p-8 text-center flex flex-col items-center gap-4">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                  <h4 className="text-xl font-display text-white">Mensaje Recibido</h4>
                  <p className="text-xs sm:text-sm text-hueso-seda/80 max-w-md leading-relaxed">
                    Agradecemos tu comunicación. Hemos registrado tu consulta y te responderemos a la brevedad posible en tu correo electrónico o vía WhatsApp.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 text-xs uppercase tracking-[0.2em] text-oro-antiguo hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {errorMessage && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] uppercase tracking-[0.25em] text-oro-antiguo font-medium">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Sofia Villarreal"
                        className="bg-transparent border-b border-hueso-seda/20 py-2.5 text-sm text-white outline-none focus:border-oro-antiguo transition-colors placeholder:text-hueso-seda/30"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] uppercase tracking-[0.25em] text-oro-antiguo font-medium">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="bg-transparent border-b border-hueso-seda/20 py-2.5 text-sm text-white outline-none focus:border-oro-antiguo transition-colors placeholder:text-hueso-seda/30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.25em] text-oro-antiguo font-medium">
                      Asunto de Consulta
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ej. Consulta sobre pieza Latidos o tiempos de entrega"
                      className="bg-transparent border-b border-hueso-seda/20 py-2.5 text-sm text-white outline-none focus:border-oro-antiguo transition-colors placeholder:text-hueso-seda/30"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] uppercase tracking-[0.25em] text-oro-antiguo font-medium">
                      Mensaje *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe aquí los detalles de tu consulta..."
                      className="bg-transparent border-b border-hueso-seda/20 py-2.5 text-sm text-white outline-none focus:border-oro-antiguo transition-colors resize-none placeholder:text-hueso-seda/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-oro-antiguo text-verde-ebano hover:bg-hueso-seda py-4 px-8 text-xs uppercase tracking-[0.3em] font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Enviando mensaje...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Mensaje</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="border-t border-verde-ebano/10 pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs uppercase tracking-widest text-verde-ebano/70">
            <span>Guías y Enlaces Útiles:</span>
            <div className="flex flex-wrap items-center gap-6">
              <Link href="/shop" className="hover:text-oro-antiguo transition-colors underline-offset-4 hover:underline">
                Catálogo de Joyería
              </Link>
              <span className="text-verde-ebano/20">•</span>
              <Link href="/guia-de-tallas" className="hover:text-oro-antiguo transition-colors underline-offset-4 hover:underline">
                Guía de Tallas
              </Link>
              <span className="text-verde-ebano/20">•</span>
              <Link href="/care-ritual" className="hover:text-oro-antiguo transition-colors underline-offset-4 hover:underline">
                Cuidado de Joyas
              </Link>
              <span className="text-verde-ebano/20">•</span>
              <Link href="/the-circle" className="hover:text-oro-antiguo transition-colors underline-offset-4 hover:underline">
                The Circle
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
