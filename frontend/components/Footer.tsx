"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";
import { Newsletter } from "./Newsletter";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
    } catch (err) {
      setStatus("error");
      setMessage("Error de conexión.");
    }
  };

  return (
    <footer className="border-t border-hueso-seda/5">
      <Newsletter />
      
      <div className="bg-authority py-16 md:py-24">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16 md:mb-20">
            <div className="lg:col-span-5 flex flex-col gap-10">
              <Link href="/">
                <img 
                  src="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/logo.png" 
                  alt="Minerva Alcaraz" 
                  className="w-[160px] h-auto brightness-0 invert opacity-90"
                />
              </Link>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <p className="text-base opacity-60 font-light leading-loose max-w-sm italic">
                    &quot;Donde el tiempo se detiene para forjar la belleza eterna. THE CIRCLE lleva conexión en cada pieza.&quot;
                  </p>
                </div>
                
                {/* Legacy Inline Newsletter */}
                <div className="flex flex-col gap-5 mt-4">
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
                        >
                          <ArrowRight size={14} sm-size={16} strokeWidth={1} />
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
                <h4 className="text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">Servicios</h4>
                <ul className="flex flex-col gap-5 text-sm opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/personalized" className="hover:text-oro-antiguo animated-underline transition-colors">Concierge Digital</Link></li>
                  <li><Link href="/atelier" className="hover:text-oro-antiguo animated-underline transition-colors">Atelier</Link></li>
                  <li><Link href="/care-ritual" className="hover:text-oro-antiguo animated-underline transition-colors">Cuidado Eterno</Link></li>
                  <li><Link href="/size-guide" className="hover:text-oro-antiguo animated-underline transition-colors">Guía de Tallas</Link></li>
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
                  <li><Link href="/privacy" className="hover:text-oro-antiguo animated-underline transition-colors">Privacidad</Link></li>
                  <li><Link href="/terms" className="hover:text-oro-antiguo animated-underline transition-colors">Términos</Link></li>
                  <li><a href="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/politica-de-devoluciones.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-oro-antiguo animated-underline transition-colors">Devoluciones</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-hueso-seda/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm uppercase tracking-[0.3em] opacity-40 font-light text-center md:text-left">
              MINERVA ALCARAZ JOYERÍA © 2026 | TU ESENCIA HECHA JOYA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
