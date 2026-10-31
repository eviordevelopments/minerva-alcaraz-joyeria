"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { 
  AlertCircle, 
  Mail, 
  Sparkles, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Compass
} from "lucide-react";

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
        setErrorMessage("Hubo un detalle al enviar el mensaje. También puedes escribirnos a concierge@minervaalcarazjoyeria.mx");
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
            Atelier Minerva Alcaraz · Canales Oficiales
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display leading-tight uppercase tracking-tight">
            Atención al Cliente
          </h1>
          <p className="mt-6 text-sm sm:text-base font-light text-hueso-seda/80 leading-relaxed max-w-2xl italic">
            &ldquo;Tu esencia, hecha joya. Cada consulta merece la misma dedicación y detalle con la que forjamos cada una de nuestras piezas.&rdquo;
          </p>
        </div>
      </section>

      {/* Main Notice Box */}
      <section className="relative -mt-8 sm:-mt-12 z-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-[#1C251A] border-2 border-oro-antiguo/40 text-hueso-seda p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(ellipse_at_top_right,rgba(203,182,123,0.18),transparent_70%)] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 border-b border-hueso-seda/10">
            <div className="w-12 h-12 rounded-full border border-oro-antiguo/50 bg-oro-antiguo/10 flex items-center justify-center text-oro-antiguo flex-shrink-0">
              <AlertCircle size={24} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                Aviso Importante sobre Nuestro Servicio
              </span>
              <h2 className="text-xl sm:text-2xl font-display text-white">
                Línea de Atención Telefónica
              </h2>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 flex flex-col gap-5 text-hueso-seda/90 leading-relaxed text-sm sm:text-base font-light">
            <p className="text-base sm:text-lg font-normal text-white">
              Por el momento nuestra línea de atención telefónica no está activa. Agradecemos profundamente tu paciencia y comprensión; nos encontramos trabajando para brindarte una mejor experiencia.
            </p>
            <p className="text-xs sm:text-sm text-hueso-seda/70">
              Nuestro compromiso con la excelencia y la cercanía artesanal sigue intacto. Mientras completamos esta optimización en nuestros canales de voz, puedes comunicarte con nuestro Concierge de manera directa a través de nuestro correo electrónico o mediante el formulario que ponemos a tu disposición a continuación.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: Email Concierge */}
            <div className="bg-white border border-verde-ebano/15 p-8 sm:p-10 flex flex-col justify-between gap-6 shadow-sm hover:border-oro-antiguo/60 transition-colors">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-verde-ebano/5 border border-verde-ebano/15 flex items-center justify-center text-verde-ebano">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Canal Institucional
                  </span>
                  <h4 className="text-2xl font-display text-verde-ebano">
                    Correo Directo Concierge
                  </h4>
                  <p className="text-xs sm:text-sm text-verde-ebano/70 font-light leading-relaxed">
                    Escribe directamente a nuestro equipo del Atelier para asesoría en adquisiciones, estado de órdenes, personalizaciones o visitas privadas.
                  </p>
                </div>

                <div className="bg-hueso-seda/40 border border-verde-ebano/10 p-4">
                  <p className="text-[11px] uppercase tracking-widest text-verde-ebano/60 mb-1 font-mono">Dirección Oficial</p>
                  <p className="text-sm sm:text-base font-mono text-verde-ebano font-semibold break-all select-all">
                    concierge@minervaalcarazjoyeria.mx
                  </p>
                </div>
              </div>

              <a
                href="mailto:concierge@minervaalcarazjoyeria.mx"
                className="w-full bg-verde-ebano text-hueso-seda hover:bg-oro-antiguo hover:text-verde-ebano py-4 px-6 text-xs uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-3 transition-all duration-300 text-center shadow-md group"
              >
                <span>Enviar Correo</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Card 2: Boutiques & Presential */}
            <div className="bg-white border border-verde-ebano/15 p-8 sm:p-10 flex flex-col justify-between gap-6 shadow-sm hover:border-oro-antiguo/60 transition-colors">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-verde-ebano/5 border border-verde-ebano/15 flex items-center justify-center text-verde-ebano">
                  <MapPin size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Atención Presencial
                  </span>
                  <h4 className="text-2xl font-display text-verde-ebano">
                    Santuarios &amp; Boutiques
                  </h4>
                  <p className="text-xs sm:text-sm text-verde-ebano/70 font-light leading-relaxed">
                    Visita nuestros espacios exclusivos para descubrir colecciones, probarte piezas o recibir asesoría personalizada.
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-xs text-verde-ebano/80 font-light border-t border-verde-ebano/10 pt-4">
                  <div>
                    <strong className="font-semibold text-verde-ebano block">Floroteca · Irapuato, Gto.</strong>
                    <span>Av. Mariano J. García 1568, San Miguelito</span>
                  </div>
                  <div>
                    <strong className="font-semibold text-verde-ebano block">Atelier Insignia · San Miguel de Allende, Gto.</strong>
                    <span>Calle Real de Correo #18, Zona Centro</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#boutiques"
                  className="flex-1 bg-oro-antiguo text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda py-4 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                >
                  <Compass size={14} />
                  <span>Ver Puntos de Venta</span>
                </Link>
                <Link
                  href="/atelier"
                  className="border border-verde-ebano/30 text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda py-4 px-4 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                >
                  <span>Agendar Cita</span>
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
                  Déjanos tus datos e inquietud; un asesor de nuestro Atelier te responderá a la brevedad por correo electrónico.
                </p>
              </div>

              {isSuccess ? (
                <div className="bg-verde-ebano/60 border border-oro-antiguo/40 p-8 text-center flex flex-col items-center gap-4">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                  <h4 className="text-xl font-display text-white">Mensaje Recibido</h4>
                  <p className="text-xs sm:text-sm text-hueso-seda/80 max-w-md leading-relaxed">
                    Agradecemos tu comunicación. Hemos registrado tu consulta y te responderemos a la brevedad posible en tu correo electrónico.
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
                        <span>Enviar Mensaje al Atelier</span>
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
