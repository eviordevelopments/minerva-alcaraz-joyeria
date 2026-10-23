"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Instagram, 
  Facebook, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Clock 
} from "lucide-react";
import { Newsletter } from "./Newsletter";
import { isRestrictedMobileWebView } from "../lib/deviceDetect";

interface LocationData {
  id: "floroteca" | "san-miguel";
  name: string;
  city: string;
  tag: string;
  address: string;
  reference: string;
  mapsUrl: string;
  embedQuery: string;
  actionLabel: string;
  schedule: string;
  atelierLink?: string;
}

const LOCATIONS: Record<"floroteca" | "san-miguel", LocationData> = {
  floroteca: {
    id: "floroteca",
    name: "Floroteca",
    city: "Irapuato, Gto.",
    tag: "Punto de Venta Autorizado",
    address: "Av. Mariano J. García 1568, San Miguelito, 36643 Irapuato, Gto.",
    reference: "Encuentra colecciones selectas de Minerva Alcaraz en el exclusivo espacio boutique de Floroteca.",
    mapsUrl: "https://maps.app.goo.gl/7GkvJAh7hBJSp3ez5?g_st=aw",
    embedQuery: "FLOROTECA, Av. Mariano J. García 1568, San Miguelito, 36643 Irapuato, Gto.",
    actionLabel: "Abrir en Google Maps",
    schedule: "Lunes a Sábado: 10:00 AM — 08:00 PM",
  },
  "san-miguel": {
    id: "san-miguel",
    name: "San Miguel de Allende",
    city: "San Miguel de Allende, Gto.",
    tag: "Atelier Insignia · Citas Privadas",
    address: "Calle Real de Correo #18, Zona Centro, 37700 San Miguel de Allende, Gto.",
    reference: "Santuario colonial del siglo XVIII para diseño personalizado de alta joyería y entregas privadas.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Real+de+Correo+18,+Zona+Centro,+San+Miguel+de+Allende,+Gto.",
    embedQuery: "Calle Real de Correo 18, Zona Centro, San Miguel de Allende, Gto.",
    actionLabel: "Ver en Google Maps",
    schedule: "Lunes a Sábado: 11:00 AM — 07:00 PM",
    atelierLink: "/atelier",
  },
};

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activeLocation, setActiveLocation] = useState<"floroteca" | "san-miguel">("floroteca");
  const [isMapActive, setIsMapActive] = useState(false);

  useEffect(() => {
    // Desktop and standard mobile browsers load automatically
    if (!isRestrictedMobileWebView()) {
      setIsMapActive(true);
    }
  }, []);

  const currentLoc = LOCATIONS[activeLocation];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("¡Suscripción exitosa!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Error al suscribirse.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión.");
    }
  };

  return (
    <footer className="border-t border-hueso-seda/5">
      <Newsletter />
      
      <div className="bg-authority py-16 md:py-24">
        <div className="luxury-container">
          {/* ─── Puntos de Venta & Mapa Interactivo (Arriba del Footer) ─── */}
          <div className="pb-16 md:pb-20 border-b border-hueso-seda/10 mb-16 md:mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div className="flex flex-col gap-2 max-w-xl">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-oro-antiguo font-mono">
                  Santuarios Físicos &amp; Boutiques
                </span>
                <h3 className="text-2xl sm:text-3xl font-display text-hueso-seda italic">
                  Puntos de Venta
                </h3>
                <p className="text-xs sm:text-sm text-hueso-seda/60 font-light leading-relaxed">
                  Visita nuestros espacios presenciales para descubrir y adquirir cada pieza forjada en metal y gemas preciosas.
                </p>
              </div>

              {/* Selector de Ubicación */}
              <div className="flex items-center gap-1.5 border border-oro-antiguo/30 p-1 bg-verde-ebano/40">
                <button
                  type="button"
                  onClick={() => setActiveLocation("floroteca")}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-medium ${
                    activeLocation === "floroteca"
                      ? "bg-oro-antiguo text-verde-ebano shadow-md"
                      : "text-hueso-seda/70 hover:text-hueso-seda hover:bg-oro-antiguo/10"
                  }`}
                >
                  Floroteca · Irapuato
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLocation("san-miguel")}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 font-medium ${
                    activeLocation === "san-miguel"
                      ? "bg-oro-antiguo text-verde-ebano shadow-md"
                      : "text-hueso-seda/70 hover:text-hueso-seda hover:bg-oro-antiguo/10"
                  }`}
                >
                  San Miguel de Allende
                </button>
              </div>
            </div>

            {/* Layout de Tarjeta de Detalles + Mapa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Tarjeta Informativa de la Sede */}
              <div className="lg:col-span-5 bg-verde-ebano/50 border border-oro-antiguo/25 p-7 sm:p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(ellipse_at_top_right,rgba(203,182,123,0.12),transparent_70%)] pointer-events-none" />

                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-oro-antiguo/40 text-oro-antiguo font-mono">
                      {currentLoc.tag}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-hueso-seda/50 font-light">
                      {currentLoc.city}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="text-2xl font-display text-hueso-seda">
                      {currentLoc.name}
                    </h4>
                    <p className="text-xs text-hueso-seda/70 font-light leading-relaxed">
                      {currentLoc.reference}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3.5 border-t border-hueso-seda/10 pt-4 text-xs font-light">
                    <div className="flex items-start gap-3 text-hueso-seda/85">
                      <MapPin size={16} className="text-oro-antiguo flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {currentLoc.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-hueso-seda/70">
                      <Clock size={15} className="text-oro-antiguo flex-shrink-0" />
                      <span>{currentLoc.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                  <a
                    href={currentLoc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-oro-antiguo text-verde-ebano hover:bg-hueso-seda hover:text-verde-ebano py-3.5 px-5 text-[11px] uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                  >
                    <Navigation size={13} strokeWidth={1.8} />
                    <span>{currentLoc.actionLabel}</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </a>

                  {currentLoc.atelierLink && (
                    <Link
                      href={currentLoc.atelierLink}
                      className="border border-oro-antiguo/40 text-oro-antiguo hover:bg-oro-antiguo/10 py-3.5 px-5 text-[11px] uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-2 transition-all duration-300 text-center"
                    >
                      <span>Agendar Cita</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Marco del Mapa Interactivo */}
              <div className="lg:col-span-7 border border-oro-antiguo/25 bg-[#121811] relative overflow-hidden min-h-[320px] lg:min-h-[350px] flex flex-col">
                <div className="absolute top-3 left-3 z-10 bg-authority/90 backdrop-blur-sm border border-oro-antiguo/30 px-3 py-1.5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-oro-antiguo font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-oro-antiguo animate-ping" />
                  <span>Mapa Interactivo · {currentLoc.name}</span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <a
                    href={currentLoc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ampliar en Google Maps"
                    className="bg-authority/90 hover:bg-oro-antiguo hover:text-verde-ebano text-hueso-seda border border-oro-antiguo/30 p-2 flex items-center justify-center transition-all duration-300"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {isMapActive ? (
                  <iframe
                    key={currentLoc.id}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(currentLoc.embedQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "320px", flex: 1 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Ubicación de ${currentLoc.name}`}
                    className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-verde-ebano/80 gap-4 min-h-[320px]">
                    <div className="w-12 h-12 rounded-full border border-oro-antiguo/40 flex items-center justify-center text-oro-antiguo">
                      <MapPin size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1 max-w-xs">
                      <span className="text-xs font-display text-hueso-seda uppercase tracking-widest">
                        {currentLoc.name}
                      </span>
                      <span className="text-[11px] text-hueso-seda/60 font-light">
                        {currentLoc.address}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMapActive(true)}
                      className="px-6 py-2.5 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.25em] font-semibold hover:bg-hueso-seda transition-all shadow-md"
                    >
                      Activar Mapa Interactivo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16 md:mb-20">
            <div className="lg:col-span-5 flex flex-col gap-8">
              <Link href="/">
                <img 
                  src="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/logo.png" 
                  alt="Minerva Alcaraz Joyería | Tu Esencia, Hecha Joya" 
                  className="w-[160px] h-auto brightness-0 invert opacity-90"
                />
              </Link>

              <div className="flex flex-col gap-6">
                <p className="text-base opacity-60 font-light leading-loose max-w-sm italic">
                  &quot;Tu esencia, hecha joya. Minerva Alcaraz forja piezas de orfebrería artesanal diseñadas para conectar y trascender con tu historia.&quot;
                </p>

                {/* Social media presence */}
                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-mono">
                    Redes Sociales Oficiales
                  </span>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.instagram.com/minerva.alcaraz.joyeria?obrf=bHA3ejZkN29tYTYw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Instagram de Minerva Alcaraz Joyería"
                      className="flex items-center gap-2.5 px-4 py-2 border border-oro-antiguo/30 bg-verde-ebano/30 text-hueso-seda/80 hover:text-oro-antiguo hover:border-oro-antiguo hover:bg-oro-antiguo/10 transition-all duration-300 group"
                    >
                      <Instagram size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Instagram</span>
                    </a>
                    <a 
                      href="https://www.facebook.com/minerva.alcaraz.joyeria" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Facebook de Minerva Alcaraz Joyería"
                      className="flex items-center gap-2.5 px-4 py-2 border border-oro-antiguo/30 bg-verde-ebano/30 text-hueso-seda/80 hover:text-oro-antiguo hover:border-oro-antiguo hover:bg-oro-antiguo/10 transition-all duration-300 group"
                    >
                      <Facebook size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Facebook</span>
                    </a>
                  </div>
                </div>
                
                {/* Legacy Inline Newsletter */}
                <div className="flex flex-col gap-4 mt-2">
                  <h4 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-oro-antiguo">FORMA PARTE DE NUESTRO UNIVERSO</h4>
                  <p className="text-xs sm:text-sm opacity-50 font-light leading-relaxed max-w-xs">
                    Recibe invitaciones exclusivas a lanzamientos y rituales privados.
                  </p>
                  
                  {status === "success" ? (
                    <div className="text-oro-antiguo text-xs uppercase tracking-widest border border-oro-antiguo/30 p-3 text-center max-w-xs">
                      ¡Gracias por unirte!
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-xs">
                      <div className="flex border-b border-hueso-seda/20 pb-3 group transition-colors focus-within:border-oro-antiguo">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={status === "loading"}
                          required
                          placeholder="TU CORREO ELECTRÓNICO" 
                          className="bg-transparent flex-1 text-[11px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-widest outline-none placeholder:opacity-20"
                        />
                        <button 
                          type="submit" 
                          disabled={status === "loading"}
                          className="text-oro-antiguo hover:translate-x-2 transition-transform disabled:opacity-50 disabled:hover:translate-x-0"
                          aria-label="Suscribirse al newsletter"
                        >
                          <ArrowRight size={14} strokeWidth={1} />
                        </button>
                      </div>
                      {message && status === "error" && (
                        <p className="text-[10px] text-red-400 opacity-80 mt-1">{message}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col gap-8">
                <h4 className="text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">Joyas</h4>
                <ul className="flex flex-col gap-5 text-sm opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/shop" className="hover:text-oro-antiguo animated-underline transition-colors">Todas las Joyas</Link></li>
                  <li><Link href="/shop/anillos" className="hover:text-oro-antiguo animated-underline transition-colors">Anillos</Link></li>
                  <li><Link href="/shop/collares" className="hover:text-oro-antiguo animated-underline transition-colors">Collares</Link></li>
                  <li><Link href="/shop/pulseras" className="hover:text-oro-antiguo animated-underline transition-colors">Pulseras</Link></li>
                  <li><Link href="/shop/sets" className="hover:text-oro-antiguo animated-underline transition-colors">Sets de Legado</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">Servicio</h4>
                <ul className="flex flex-col gap-5 text-sm opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/personalized" className="hover:text-oro-antiguo animated-underline transition-colors">Concierge Digital</Link></li>
                  <li><Link href="/care-ritual" className="hover:text-oro-antiguo animated-underline transition-colors">Cuidado Eterno</Link></li>
                  <li><Link href="/size-guide" className="hover:text-oro-antiguo animated-underline transition-colors">Guía de Tallas</Link></li>
                  <li><Link href="/atelier" className="hover:text-oro-antiguo animated-underline transition-colors">Citas de Atelier</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">Tu Cuenta</h4>
                <ul className="flex flex-col gap-5 text-sm opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/the-circle/dashboard" className="hover:text-oro-antiguo animated-underline transition-colors">Mi Perfil</Link></li>
                  <li><Link href="/favorites" className="hover:text-oro-antiguo animated-underline transition-colors">Favoritos</Link></li>
                  <li><Link href="/shop" className="hover:text-oro-antiguo animated-underline transition-colors">Mi Bolsa</Link></li>
                  <li><Link href="/the-circle" className="hover:text-oro-antiguo animated-underline transition-colors">The Circle</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">Legado</h4>
                <ul className="flex flex-col gap-5 text-sm opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/shop?collection=herencia" className="hover:text-oro-antiguo animated-underline transition-colors">Colecciones</Link></li>
                  <li><Link href="/nuestra-historia" className="hover:text-oro-antiguo animated-underline transition-colors">Nuestra Historia</Link></li>
                  <li><Link href="/terminos-y-privacidad" className="hover:text-oro-antiguo animated-underline transition-colors">Términos y Privacidad</Link></li>
                  <li><a href="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/politica-de-devoluciones.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-oro-antiguo animated-underline transition-colors">Devoluciones</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Social Row */}
          <div className="pt-8 border-t border-hueso-seda/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] opacity-40 font-light text-center md:text-left">
              MINERVA ALCARAZ JOYERÍA © 2026 | TU ESENCIA HECHA JOYA
            </p>
            <div className="flex items-center gap-6 text-hueso-seda/60">
              <a 
                href="https://www.instagram.com/minerva.alcaraz.joyeria?obrf=bHA3ejZkN29tYTYw" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram Oficial"
                className="hover:text-oro-antiguo transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Instagram size={15} strokeWidth={1.5} />
                <span>Instagram</span>
              </a>
              <span className="opacity-20">•</span>
              <a 
                href="https://www.facebook.com/minerva.alcaraz.joyeria" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook Oficial"
                className="hover:text-oro-antiguo transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Facebook size={15} strokeWidth={1.5} />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
