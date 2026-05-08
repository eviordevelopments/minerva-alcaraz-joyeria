"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";
import { Newsletter } from "./Newsletter";

export const Footer = () => {
  return (
    <footer className="border-t border-hueso-seda/5">
      <Newsletter />
      
      <div className="bg-authority py-16 md:py-24">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16 md:mb-20">
            <div className="lg:col-span-5 flex flex-col gap-10">
              <Link href="/">
                <Image 
                  src="/logo.png" 
                  alt="Minerva Alcaraz" 
                  width={160} 
                  height={50} 
                  className="brightness-0 invert opacity-90"
                />
              </Link>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <p className="text-sm opacity-60 font-light leading-loose max-w-sm italic">
                    &quot;Donde el tiempo se detiene para forjar la belleza eterna. Nuestra cofradía custodia el secreto del metal y la piedra.&quot;
                  </p>
                </div>
                
                {/* Legacy Inline Newsletter */}
                <div className="flex flex-col gap-5 mt-4">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo">Únete a la Herencia</h4>
                  <p className="text-[11px] opacity-50 font-light leading-relaxed max-w-xs">
                    Reciba invitaciones exclusivas a lanzamientos y rituales privados.
                  </p>
                  <div className="flex border-b border-hueso-seda/20 pb-3 group max-w-xs transition-colors focus-within:border-oro-antiguo">
                    <input 
                      type="email" 
                      placeholder="SU CORREO ELECTRÓNICO" 
                      className="bg-transparent flex-1 text-[10px] uppercase tracking-widest outline-none placeholder:opacity-20"
                    />
                    <button className="text-oro-antiguo hover:translate-x-2 transition-transform">
                      <ArrowRight size={16} strokeWidth={1} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="flex flex-col gap-8">
                <h4 className="text-[11px] uppercase tracking-[0.4em] text-oro-antiguo font-medium">Joyas</h4>
                <ul className="flex flex-col gap-5 text-xs opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/shop" className="hover:text-oro-antiguo animated-underline transition-colors">Todas las Joyas</Link></li>
                  <li><Link href="/shop/anillos" className="hover:text-oro-antiguo animated-underline transition-colors">Anillos</Link></li>
                  <li><Link href="/shop/collares" className="hover:text-oro-antiguo animated-underline transition-colors">Collares</Link></li>
                  <li><Link href="/shop/pulseras" className="hover:text-oro-antiguo animated-underline transition-colors">Pulseras</Link></li>
                  <li><Link href="/shop/sets" className="hover:text-oro-antiguo animated-underline transition-colors">Sets de Legado</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-[11px] uppercase tracking-[0.4em] text-oro-antiguo font-medium">Servicios</h4>
                <ul className="flex flex-col gap-5 text-xs opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/personalized" className="hover:text-oro-antiguo animated-underline transition-colors">Concierge Digital</Link></li>
                  <li><Link href="/atelier" className="hover:text-oro-antiguo animated-underline transition-colors">El Atelier</Link></li>
                  <li><Link href="/care-ritual" className="hover:text-oro-antiguo animated-underline transition-colors">Cuidado Eterno</Link></li>
                  <li><Link href="/size-guide" className="hover:text-oro-antiguo animated-underline transition-colors">Guía de Tallas</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-[11px] uppercase tracking-[0.4em] text-oro-antiguo font-medium">Su Cuenta</h4>
                <ul className="flex flex-col gap-5 text-xs opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/the-circle/dashboard" className="hover:text-oro-antiguo animated-underline transition-colors">Mi Perfil</Link></li>
                  <li><Link href="/favorites" className="hover:text-oro-antiguo animated-underline transition-colors">Favoritos</Link></li>
                  <li><Link href="/shop" className="hover:text-oro-antiguo animated-underline transition-colors">Mi Bolsa</Link></li>
                  <li><Link href="/the-circle" className="hover:text-oro-antiguo animated-underline transition-colors">The Circle</Link></li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <h4 className="text-[11px] uppercase tracking-[0.4em] text-oro-antiguo font-medium">Legado</h4>
                <ul className="flex flex-col gap-5 text-xs opacity-60 tracking-[0.15em] font-light uppercase">
                  <li><Link href="/shop?collection=herencia" className="hover:text-oro-antiguo animated-underline transition-colors">Colecciones</Link></li>
                  <li><Link href="/privacy" className="hover:text-oro-antiguo animated-underline transition-colors">Privacidad</Link></li>
                  <li><Link href="/terms" className="hover:text-oro-antiguo animated-underline transition-colors">Términos</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-hueso-seda/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs uppercase tracking-[0.3em] opacity-40 font-light text-center md:text-left">
              Minerva Alcaraz Joyería © 2026 | El Arte de Habitar en la Eternidad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
