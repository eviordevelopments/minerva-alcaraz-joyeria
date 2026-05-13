"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, User, Heart, ShoppingBag, ShieldCheck, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartSidebar } from "./CartSidebar";
import { useAuthStore } from "../lib/store/useAuthStore";
import Link from "next/link";
import { SearchOverlay } from "./SearchOverlay";
import { useDesignSystem } from "./DesignSystemProvider";

interface HeaderProps {
  theme?: "light" | "dark";
}

import { PRODUCTS } from "../constants/products";

export const Header = ({ theme = "light" }: HeaderProps) => {
  const { isCartOpen, setIsCartOpen, mentalState } = useDesignSystem();
  const isHighArousal = mentalState === "HIGH_AROUSAL";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const categories = ["Anillos", "Collares", "Pulseras", "Pendientes", "Sets", "Broches"];
  const collections = ["Amatista", "Chai", "Serpientes", "Escencia", "Etérea", "Floral", "Ecos de la Tierra"];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let textColor = "text-verde-ebano";
  let hoverColor = "hover:text-oro-profundo";
  let logoFilter = "";

  if (!isScrolled) {
    if (theme === "dark") {
      textColor = "text-oro-antiguo";
      hoverColor = "hover:text-hueso-seda";
      logoFilter = "brightness-0 invert sepia hue-rotate-[10deg] saturate-[2]";
    } else {
      textColor = "text-hueso-seda";
      hoverColor = "hover:text-oro-antiguo";
      logoFilter = "brightness-0 invert opacity-90";
    }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'header-glass py-0' : 'py-0 bg-transparent'}`}>
        {/* THE CIRCLE Announcement Bar */}
        <div className="w-full bg-verde-ebano py-2 border-b border-oro-antiguo/10 text-center relative z-10 px-4">
          <Link href="/the-circle" className="group inline-flex items-center gap-2 md:gap-4">
            <span className="text-oro-antiguo text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.6em] font-medium whitespace-nowrap">The Circle</span>
            <p className="hidden sm:block text-hueso-seda text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
              &ldquo;Únase a la cofradía del lujo eterno. Privilegios exclusivos y acceso prioritario.&rdquo;
            </p>
            <p className="sm:hidden text-hueso-seda text-[8px] uppercase tracking-[0.1em] font-light italic opacity-80">
              &ldquo;Privilegios exclusivos&rdquo;
            </p>
          </Link>
        </div>
        
        <div className={`luxury-container flex justify-between items-center relative transition-all duration-700 ${isScrolled ? 'h-16 md:h-20' : 'h-24 md:h-36'}`}>
          
          {/* Mobile Menu Button - Left */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`${textColor} p-2 -ml-2`}
            >
              <Menu size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Main Navigation - Left (Desktop) */}
          <nav className={`hidden lg:flex gap-10 items-center ${textColor} transition-all duration-700 ${isHighArousal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative group">
              <Link href="/shop" className="nav-link flex items-center gap-2">
                Joyas <ChevronDown size={10} className="group-hover:rotate-180 transition-transform" />
              </Link>
              
              {/* Megamenu Dropdown */}
              <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                <div className="bg-hueso-seda border border-verde-ebano/10 shadow-2xl p-10 w-[750px] grid grid-cols-3 gap-12">
                  <div className="flex flex-col gap-6">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo border-b border-oro-antiguo/20 pb-2">Categorías</span>
                    <div className="flex flex-col gap-4">
                      {categories.map(cat => (
                        <Link key={cat} href={`/shop?category=${cat}`} className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano hover:text-oro-antiguo transition-colors font-light">
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo border-b border-oro-antiguo/20 pb-2">Colecciones</span>
                    <div className="flex flex-col gap-4">
                      {collections.map(item => (
                        <Link key={item} href={`/shop?collection=${encodeURIComponent(item)}`} className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano hover:text-oro-antiguo transition-colors font-light">
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo border-b border-oro-antiguo/20 pb-2">Especiales</span>
                    <div className="flex flex-col gap-4">
                      <Link href="/shop?collection=Diseños de Autor" className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano hover:text-oro-antiguo transition-colors font-light">Diseños de Autor</Link>
                      <Link href="/shop?collection=Piezas Únicas" className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano hover:text-oro-antiguo transition-colors font-light">Piezas Únicas</Link>
                      <Link href="/shop?category=Edición Limitada" className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano hover:text-oro-antiguo transition-colors font-light">Edición Limitada</Link>
                    </div>
                    <div className="mt-4 p-6 bg-verde-ebano/5 border border-verde-ebano/10">
                       <p className="text-[9px] text-verde-ebano/60 italic leading-relaxed">
                         "La joya no es un adorno, es un amuleto de identidad."
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/collections" className="nav-link">Colecciones</Link>
            <Link href="/atelier" className="nav-link">Atelier</Link>
            <Link href="/personalized" className="nav-link">Concierge</Link>
          </nav>

          {/* Symmetrical Logo - Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <div className={`relative transition-all duration-700 ease-in-out ${
                isScrolled
                  ? 'h-[24px] w-[80px] sm:h-[28px] sm:w-[90px] md:h-[50px] md:w-[155px]'
                  : 'h-[32px] w-[95px] sm:h-[38px] sm:w-[110px] md:h-[64px] md:w-[180px]'
              }`}>
                <Image 
                  src="/logo.png" 
                  alt="Minerva Alcaraz" 
                  fill
                  className={`object-contain transition-all duration-700`}
                  style={{ 
                    filter: isScrolled 
                      ? 'var(--logo-filter-override)' 
                      : (logoFilter === "brightness-0 invert opacity-90" ? "brightness(0) invert(0.9)" : "none") 
                  }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Utility Icons - Right */}
          <div className={`flex gap-4 md:gap-10 items-center ${textColor}`}>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`${hoverColor} transition-colors hidden sm:block relative group`}
            >
              <Search 
                size={22} 
                strokeWidth={isHighArousal ? 1.5 : 1} 
                className={isHighArousal ? "icon-tangible" : ""}
              />
            </button>
            {isAuthenticated ? (
              <Link href="/perfil" className={`${hoverColor} transition-colors flex items-center gap-2 relative`}>
                <div className="relative">
                  {user?.isCircleMember && (
                    <div className="absolute -inset-1 border border-oro-antiguo/50 pointer-events-none z-10" />
                  )}
                  <div className={`w-8 h-8 flex items-center justify-center text-[11px] font-medium uppercase ${
                    isScrolled || theme === 'dark' ? 'bg-oro-antiguo/15 text-oro-antiguo' : 'bg-white/15 text-current'
                  }`}>
                    {user?.fullName?.charAt(0) || <User size={14} strokeWidth={1.5} />}
                  </div>
                  {user?.isCircleMember && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-oro-antiguo flex items-center justify-center z-20">
                      <ShieldCheck size={7} strokeWidth={2} className="text-verde-ebano" />
                    </div>
                  )}
                </div>
                <span className="hidden xl:inline text-[9px] uppercase tracking-widest font-light">
                  {user?.displayName || user?.fullName?.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link href="/auth" className={`${hoverColor} transition-colors hidden sm:block`}>
                <User 
                  size={22} 
                  strokeWidth={isHighArousal ? 1.5 : 1} 
                  className={isHighArousal ? "icon-tangible" : ""}
                />
              </Link>
            )}
            <Link href="/favorites" className={`${hoverColor} transition-colors relative hidden sm:block`}>
              <Heart 
                size={22} 
                strokeWidth={isHighArousal ? 1.5 : 1} 
                className={isHighArousal ? "icon-tangible" : ""}
              />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`${hoverColor} transition-colors relative`}
            >
              <ShoppingBag 
                size={22} 
                strokeWidth={isHighArousal ? 1.5 : 1} 
                className={isHighArousal ? "icon-tangible" : ""}
              />
              <span className={`absolute -top-1 -right-2 bg-oro-antiguo text-verde-ebano text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${isHighArousal ? 'scale-110' : 'scale-100'}`}>
                1
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="fixed inset-0 z-[100] bg-hueso-seda flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="relative w-[100px] h-[30px]">
                  <Image src="/logo.png" alt="Minerva Alcaraz" fill className="object-contain" />
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-verde-ebano">
                 <X size={24} strokeWidth={1} />
               </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo">Menú Principal</span>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/shop" className="text-2xl font-display text-verde-ebano italic">Explorar Joyas</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/collections" className="text-2xl font-display text-verde-ebano italic">Colecciones</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/atelier" className="text-2xl font-display text-verde-ebano italic">El Atelier</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/personalized" className="text-2xl font-display text-verde-ebano italic">Concierge</Link>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo">Colecciones Destacadas</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {collections.map(col => (
                    <Link key={col} onClick={() => setIsMobileMenuOpen(false)} href={`/shop?collection=${encodeURIComponent(col)}`} className="text-[10px] uppercase tracking-widest text-verde-ebano/70">
                      {col}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-verde-ebano/10">
              {isAuthenticated ? (
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/perfil" className="flex items-center gap-4 text-xs uppercase tracking-widest text-verde-ebano">
                  <div className="relative w-5 h-5 flex items-center justify-center border border-verde-ebano/20">
                    {user?.isCircleMember && <div className="absolute -inset-0.5 border border-oro-antiguo/40" />}
                    <span className="text-[10px] font-medium">{user?.fullName?.charAt(0)}</span>
                  </div>
                  {user?.displayName || user?.fullName?.split(' ')[0] || 'Mi Perfil'}
                  {user?.isCircleMember && <span className="text-[7px] text-oro-antiguo border border-oro-antiguo/30 px-1 py-0.5 uppercase tracking-widest">Circle</span>}
                </Link>
              ) : (
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/auth" className="flex items-center gap-4 text-xs uppercase tracking-widest text-verde-ebano">
                  <User size={16} strokeWidth={1} /> Mi Cuenta
                </Link>
              )}
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/favorites" className="flex items-center gap-4 text-xs uppercase tracking-widest text-verde-ebano">
                  <Heart size={16} strokeWidth={1} /> Mis Favoritos
                </Link>
                <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="flex items-center gap-4 text-xs uppercase tracking-widest text-verde-ebano">
                  <Search size={16} strokeWidth={1} /> Buscar
                </button>
              </div>
            </div>

            <div className="mt-auto pt-12 pb-4">
               <p className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano/40 text-center">Minerva Alcaraz © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
