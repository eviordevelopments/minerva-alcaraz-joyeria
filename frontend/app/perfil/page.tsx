"use client";

import React, { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProfileSidebar } from "../../components/ProfileSidebar";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package, RotateCcw, HeadphonesIcon, Settings,
  Crown, Images, Gem, ArrowRight, Sparkles
} from "lucide-react";

export default function PerfilPage() {
  const { user, isAuthenticated, refreshProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    refreshProfile();
  }, [isAuthenticated, router, refreshProfile]);

  if (!user) return null;

  const isCircle = user.isCircleMember;

  const quickLinks = isCircle
    ? [
        { href: "/perfil/pedidos", label: "Mis Pedidos", icon: Package, desc: "Historial completo de compras" },
        { href: "/perfil/albumes", label: "Mis Álbumes", icon: Images, desc: "Colecciones personales curadas", circle: true },
        { href: "/perfil/colecciones-privadas", label: "Colecciones Privadas", icon: Gem, desc: "Acceso exclusivo The Circle", circle: true },
        { href: "/perfil/cuenta", label: "Mi Cuenta", icon: Settings, desc: "Preferencias y perfil" },
        { href: "/perfil/concierge", label: "Concierge Privado", icon: Sparkles, desc: "Tu artesana asignada", circle: true },
        { href: "/perfil/soporte", label: "Soporte", icon: HeadphonesIcon, desc: "Asistencia personalizada" },
      ]
    : [
        { href: "/perfil/pedidos", label: "Mis Pedidos", icon: Package, desc: "Historial completo de compras" },
        { href: "/perfil/devoluciones", label: "Devoluciones", icon: RotateCcw, desc: "Gestionar cambios y devoluciones" },
        { href: "/perfil/soporte", label: "Soporte", icon: HeadphonesIcon, desc: "Contactar al equipo" },
        { href: "/perfil/cuenta", label: "Mi Cuenta", icon: Settings, desc: "Preferencias y perfil" },
      ];

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />

      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Welcome header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">
                {isCircle ? "The Circle — Panel Privado" : "Mi Espacio"}
              </p>
              <h1 className="text-3xl md:text-4xl font-display text-verde-ebano">
                Bienvenido, {user.displayName || user.fullName.split(" ")[0]}
              </h1>
              {isCircle && (
                <p className="text-xs text-verde-ebano/40 uppercase tracking-[0.3em] font-light italic">
                  Miembro {user.circleTier} · {user.circlePoints?.toLocaleString("es-MX")} puntos de legado
                </p>
              )}
            </motion.div>

            {/* Circle invitation banner (for non-members) */}
            {!isCircle && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-verde-ebano p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 bottom-0 w-40 opacity-5">
                  <Crown size={160} strokeWidth={0.3} className="text-oro-antiguo absolute -right-8 -top-8" />
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <Crown size={12} className="text-oro-antiguo" strokeWidth={1.5} />
                    <span className="text-[9px] uppercase tracking-[0.6em] text-oro-antiguo">Invitación</span>
                  </div>
                  <p className="text-hueso-seda font-light text-sm leading-relaxed max-w-md">
                    Únete a <strong className="font-medium">The Circle</strong> y desbloquea álbumes personales, colecciones privadas, concierge dedicada y envíos sin costo.
                  </p>
                </div>
                <Link
                  href="/the-circle"
                  className="flex items-center gap-2 bg-oro-antiguo text-verde-ebano text-[9px] uppercase tracking-[0.5em] px-6 py-3 hover:bg-hueso-seda transition-colors flex-shrink-0 group"
                >
                  Descubrir <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            )}

            {/* Quick links grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map(({ href, label, icon: Icon, desc, circle }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.15 }}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-5 p-6 border transition-all duration-300 group ${
                      circle
                        ? "bg-white border-oro-antiguo/15 hover:border-oro-antiguo/40"
                        : "bg-white border-verde-ebano/8 hover:border-verde-ebano/25"
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center border flex-shrink-0 ${
                      circle ? "border-oro-antiguo/20 group-hover:border-oro-antiguo/50" : "border-verde-ebano/10 group-hover:border-verde-ebano/30"
                    }`}>
                      <Icon size={15} strokeWidth={1.2} className={circle ? "text-oro-antiguo" : "text-verde-ebano/50 group-hover:text-verde-ebano"} />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-verde-ebano font-medium">{label}</span>
                        {circle && (
                          <span className="text-[7px] uppercase tracking-[0.3em] border border-oro-antiguo/30 text-oro-antiguo px-1.5 py-0.5">
                            Circle
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-verde-ebano/35 font-light">{desc}</p>
                    </div>
                    <ArrowRight size={12} strokeWidth={1} className="text-verde-ebano/20 group-hover:text-verde-ebano/50 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
