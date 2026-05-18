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
  ExternalLink
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      description: "Gráficas y conversiones"
    },
    {
      name: "Inventario",
      path: "/admin/inventario",
      icon: Gem,
      description: "Gestión y previsualización PDP"
    },
    {
      name: "Concierge",
      path: "/admin/concierge",
      icon: Sparkles,
      description: "Pedidos personalizados de lujo"
    },
    {
      name: "Showroom",
      path: "/admin/showroom",
      icon: CalendarRange,
      description: "Agenda y prevención de cruces"
    },
    {
      name: "CRM Members",
      path: "/admin/crm",
      icon: Users,
      description: "Gestión de The Circle"
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
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#8E9A8B] hidden sm:block">
              Atelier Interno &amp; ERP
            </span>
          </div>
        </div>

        {/* User Info / Right Actions */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#CBB67B] hover:text-[#E4D5A4] transition-colors border border-[#CBB67B]/20 px-3 py-1.5"
          >
            <span>Ver Tienda</span>
            <ExternalLink size={12} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729]">
              <User size={16} className="text-[#CBB67B]" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold tracking-wider">Asesor Principal</span>
              <span className="text-[9px] uppercase tracking-widest text-[#CBB67B]">Taller CDMX</span>
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
                          <span className="text-xs uppercase tracking-wider font-medium">{item.name}</span>
                          <span className="text-[8px] text-[#8E9A8B] lowercase italic truncate max-w-[150px]">
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

            {/* Toggle Switch */}
            <div className="px-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[#CBB67B]/20 text-[#8E9A8B] hover:text-[#CBB67B] hover:border-[#CBB67B]/50 transition-colors focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                {isSidebarOpen && <span className="text-[10px] uppercase tracking-wider">Contraer</span>}
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
                            <span className="text-xs uppercase tracking-wider">{item.name}</span>
                            <span className="text-[8px] text-[#8E9A8B]">{item.description}</span>
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
                    <span className="text-[10px] uppercase tracking-widest font-semibold">Cerrar Sesión</span>
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT WINDOW */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-w-full">
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
    </div>
  );
}
