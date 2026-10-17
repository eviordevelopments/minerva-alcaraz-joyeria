"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Sparkles, 
  Gem, 
  CalendarRange, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  ExternalLink,
  Accessibility,
  ShoppingBag,
  Smartphone,
  Share2
} from "lucide-react";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setPanelOpen } = useAccessibilityStore();
  
  const [profileName, setProfileName] = useState("Cargando...");
  const [profileLocation, setProfileLocation] = useState("...");
  const [profileRole, setProfileRole] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  React.useEffect(() => {
    // PWA beforeinstallprompt handler
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Detect standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setCanInstall(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      // Check if iOS Safari
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setShowIosPrompt(true);
      } else {
        alert("Para agregar a la pantalla de inicio: abre el menú de tu navegador y pulsa 'Agregar a la pantalla principal' o 'Instalar aplicación'.");
      }
    }
  };

  React.useEffect(() => {
    async function loadProfile() {
      const match = document.cookie.match(/(^| )erp_profile_id=([^;]+)/);
      if (match) {
        const profileId = match[2];
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase
          .from("erp_profiles")
          .select("name, role, erp_accounts(location)")
          .eq("id", profileId)
          .single();
        if (data) {
          setProfileName(data.name);
          setProfileRole(data.role);
          const accounts: any = data.erp_accounts;
          const location = Array.isArray(accounts) 
            ? accounts[0]?.location 
            : accounts?.location;
          setProfileLocation(location || "ONLINE");
        }
      }
    }
    loadProfile();
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      description: "Gráficas, visitas y finanzas"
    },
    {
      name: "Inventario",
      path: "/admin/inventario",
      icon: Gem,
      description: "Catálogo y previsualización PDP"
    },
    {
      name: "Pedidos",
      path: "/admin/pedidos",
      icon: ShoppingBag,
      description: "Transacciones y carritos"
    },
    {
      name: "Concierge",
      path: "/admin/concierge",
      icon: Sparkles,
      description: "Co-creación y pedidos personalizados"
    },
    {
      name: "CRM Members",
      path: "/admin/crm",
      icon: Users,
      description: "Gestión de The Circle"
    },
    {
      name: "Contenidos",
      path: "/admin/content",
      icon: Sparkles,
      description: "Textos y Narrativas"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#2C3729] text-[#E5DBD6] flex flex-col font-sans select-none overflow-x-hidden">

      {/* TOP HEADER */}
      <header className="h-20 bg-[#1F271D] border-b border-[#CBB67B]/25 flex items-center justify-between px-6 z-40 sticky top-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#CBB67B] hover:text-[#E4D5A4] transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-display-erp text-2xl text-[#CBB67B] font-bold">MA</span>
            <div className="w-[1px] h-6 bg-[#CBB67B]/30 hidden sm:block"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-[#8E9A8B] hidden sm:block">
              Atelier Interno &amp; ERP
            </span>
          </div>
        </div>

        {/* User Info / Right Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-[#CBB67B]/10 hover:bg-[#CBB67B]/20 text-[#CBB67B] border border-[#CBB67B]/40 px-2.5 sm:px-3 py-1.5 transition-colors font-medium"
            title="Instalar App en tu teléfono o computadora"
          >
            <Smartphone size={13} className="text-[#CBB67B]" />
            <span className="hidden xs:inline sm:inline">Instalar App</span>
            <span className="xs:hidden sm:hidden">PWA</span>
          </button>

          <Link 
            href="/" 
            target="_blank"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#CBB67B] hover:text-[#E4D5A4] transition-colors border border-[#CBB67B]/20 px-3 py-1.5"
          >
            <span>Ver Tienda</span>
            <ExternalLink size={12} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-none border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729]">
              <User size={15} className="text-[#CBB67B]" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold tracking-wider">{profileName}</span>
              <span className="text-[11px] uppercase tracking-widest text-[#CBB67B]">
                {profileRole ? `${profileRole} · ` : ""}{profileLocation}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* SIDEBAR - DESKTOP */}
        <aside 
          className={`hidden md:flex flex-col bg-[#1F271D] border-r border-[#CBB67B]/25 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="flex-1 py-8 flex flex-col justify-between">
            <nav className="space-y-2 px-3">
              {menuItems.map((item) => {
                const Active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.path} className="block group">
                    <div 
                      className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-300 relative border ${
                        Active 
                          ? "bg-[#2C3729] border-[#CBB67B] text-[#CBB67B]" 
                          : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6] hover:bg-[#2C3729]/40"
                      }`}
                    >
                      <Icon size={18} className={Active ? "text-[#CBB67B]" : "text-[#8E9A8B] group-hover:text-[#E5DBD6]"} />
                      
                      {isSidebarOpen && (
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-sm uppercase tracking-wider font-medium">{item.name}</span>
                          <span className="text-[10px] text-[#8E9A8B] lowercase italic truncate max-w-[150px]">
                            {item.description}
                          </span>
                        </div>
                      )}

                      {/* Active Indicator bar */}
                      {Active && (
                        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#CBB67B]"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-6 space-y-3">
              <button 
                onClick={() => setPanelOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[#CBB67B]/20 text-[#8E9A8B] hover:text-[#CBB67B] hover:border-[#CBB67B]/50 transition-colors focus:outline-none"
              >
                <Accessibility size={16} />
                {isSidebarOpen && <span className="text-xs uppercase tracking-wider">Accesibilidad</span>}
              </button>

              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[#CBB67B]/20 text-[#8E9A8B] hover:text-[#CBB67B] hover:border-[#CBB67B]/50 transition-colors focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                {isSidebarOpen && <span className="text-xs uppercase tracking-wider">Contraer</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER SIDEBAR */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-30 md:hidden"
              />
              
              {/* Drawer */}
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-20 bottom-0 left-0 w-64 bg-[#1F271D] border-r border-[#CBB67B]/30 z-40 p-6 flex flex-col justify-between md:hidden"
              >
                <nav className="space-y-4">
                  {menuItems.map((item) => {
                    const Active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <div 
                          className={`flex items-center gap-4 px-4 py-3 border ${
                            Active 
                              ? "bg-[#2C3729] border-[#CBB67B] text-[#CBB67B]" 
                              : "border-transparent text-[#8E9A8B]"
                          }`}
                        >
                          <Icon size={18} />
                          <div className="flex flex-col items-start text-left">
                            <span className="text-sm uppercase tracking-wider">{item.name}</span>
                            <span className="text-[10px] text-[#8E9A8B]">{item.description}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-[#CBB67B]/20 pt-6">
                  <Link 
                    href="/auth" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#2C3729] border border-[#CBB67B]/30 text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#2C3729] transition-all"
                  >
                    <LogOut size={14} />
                    <span className="text-xs uppercase tracking-widest font-semibold">Cerrar Sesión</span>
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT WINDOW */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-10 lg:p-12 overflow-y-auto max-w-full pb-28 md:pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (PWA) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1F271D]/98 backdrop-blur-md border-t border-[#CBB67B]/25 z-40 flex items-center justify-around px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {[
          { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
          { name: "Inventario", path: "/admin/inventario", icon: Gem },
          { name: "Pedidos", path: "/admin/pedidos", icon: ShoppingBag },
          { name: "Concierge", path: "/admin/concierge", icon: Sparkles },
          { name: "CRM", path: "/admin/crm", icon: Users },
        ].map((tab) => {
          const Active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
                Active ? "text-[#CBB67B]" : "text-[#8E9A8B] hover:text-[#E5DBD6]"
              }`}
            >
              {Active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#CBB67B]" />
              )}
              <Icon size={18} strokeWidth={Active ? 2.2 : 1.5} />
              <span className={`text-[10px] uppercase tracking-wider mt-1 truncate max-w-[64px] ${Active ? "font-bold text-[#CBB67B]" : "font-normal"}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* iOS PWA INSTALLATION HELPER MODAL */}
      <AnimatePresence>
        {showIosPrompt && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-[#1F271D] border border-[#CBB67B]/40 p-6 max-w-sm w-full shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowIosPrompt(false)}
                className="absolute top-4 right-4 text-[#8E9A8B] hover:text-[#E5DBD6]"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#CBB67B]/10 border border-[#CBB67B]/30 flex items-center justify-center text-[#CBB67B]">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-base font-display-erp text-[#E5DBD6] font-bold">Agregar a Inicio en iPhone</h3>
                  <p className="text-[10px] text-[#CBB67B] uppercase tracking-widest">Minerva Alcaraz ERP PWA</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#E5DBD6]/90 leading-relaxed border-t border-[#CBB67B]/20 pt-4">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#CBB67B]/20 text-[#CBB67B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>En Safari, pulsa el botón <strong>Compartir</strong> <Share2 size={12} className="inline text-[#CBB67B]" /> en la barra inferior.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#CBB67B]/20 text-[#CBB67B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Desliza hacia abajo y selecciona <strong>&quot;Agregar a la pantalla de inicio&quot;</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#CBB67B]/20 text-[#CBB67B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Toca <strong>&quot;Agregar&quot;</strong> en la esquina superior derecha.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIosPrompt(false)}
                className="w-full mt-6 py-2.5 bg-[#CBB67B] text-[#1F271D] text-xs uppercase tracking-widest font-bold hover:bg-[#E4D5A4] transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
