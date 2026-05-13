"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Package, RotateCcw, HeadphonesIcon, Settings, Crown, Images,
  Gem, CalendarDays, Sparkles, BookOpen, Truck, LogOut, ChevronRight
} from "lucide-react";
import { useAuthStore } from "../lib/store/useAuthStore";

const TIER_LABELS: Record<string, string> = {
  Observer: "Visitante",
  Initiate: "Iniciada",
  Devotee: "Devota",
  Keeper: "Guardiana",
  Eternal: "Eterna",
};

const TIER_COLORS: Record<string, string> = {
  Observer: "border-plata-niebla/40 text-plata-niebla/60",
  Initiate: "border-oro-antiguo/30 text-oro-antiguo/70",
  Devotee: "border-oro-antiguo/60 text-oro-antiguo",
  Keeper: "border-oro-antiguo text-oro-antiguo",
  Eternal: "border-oro-antiguo text-oro-antiguo bg-oro-antiguo/5",
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  circleOnly?: boolean;
  badge?: string;
}

const STANDARD_NAV: NavItem[] = [
  { href: "/perfil/pedidos", label: "Mis Pedidos", icon: Package },
  { href: "/perfil/devoluciones", label: "Devoluciones", icon: RotateCcw },
  { href: "/perfil/soporte", label: "Soporte", icon: HeadphonesIcon },
  { href: "/perfil/cuenta", label: "Mi Cuenta", icon: Settings },
];

const CIRCLE_NAV: NavItem[] = [
  { href: "/perfil/albumes", label: "Mis Álbumes", icon: Images, badge: "THE CIRCLE" },
  { href: "/perfil/colecciones-privadas", label: "Colecciones Privadas", icon: Gem, badge: "THE CIRCLE" },
  { href: "/perfil/eventos", label: "Eventos Atelier", icon: CalendarDays, badge: "THE CIRCLE" },
  { href: "/perfil/concierge", label: "Concierge Privado", icon: Sparkles, badge: "THE CIRCLE" },
  { href: "/perfil/cuidado-ritual", label: "Cuidado y Ritual", icon: BookOpen, badge: "THE CIRCLE" },
  { href: "/perfil/envios", label: "Envíos Prioritarios", icon: Truck, badge: "THE CIRCLE" },
];

export function ProfileSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const tier = user.circleTier || "Observer";
  const isCircle = user.isCircleMember;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
      {/* Profile card */}
      <div className="bg-white border border-verde-ebano/8 p-6 flex flex-col gap-5">
        {/* Avatar + Circle badge */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {/* Circle member square frame */}
            {isCircle && (
              <div className="absolute -inset-1.5 border border-oro-antiguo/50 pointer-events-none z-10" />
            )}
            <div className="w-14 h-14 bg-verde-ebano/5 overflow-hidden flex items-center justify-center">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xl font-display text-verde-ebano/40 uppercase">
                  {user.fullName.charAt(0)}
                </span>
              )}
            </div>
            {isCircle && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-oro-antiguo flex items-center justify-center z-20">
                <Crown size={9} strokeWidth={2} className="text-verde-ebano" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-medium text-verde-ebano truncate leading-tight">
              {user.displayName || user.fullName}
            </p>
            <p className="text-[9px] uppercase tracking-widest text-verde-ebano/40 truncate">
              {user.email}
            </p>
            {/* Tier badge */}
            <span className={`mt-1 self-start text-[8px] uppercase tracking-[0.4em] border px-2 py-0.5 ${TIER_COLORS[tier]}`}>
              {isCircle ? `The Circle · ${TIER_LABELS[tier]}` : "Cuenta Estándar"}
            </span>
          </div>
        </div>

        {/* Points bar (Circle only) */}
        {isCircle && (
          <div className="flex flex-col gap-2 pt-2 border-t border-verde-ebano/6">
            <div className="flex justify-between items-center">
              <span className="text-[8px] uppercase tracking-[0.4em] text-verde-ebano/40">Puntos de Legado</span>
              <span className="text-[10px] font-medium text-oro-antiguo">{user.circlePoints?.toLocaleString("es-MX")}</span>
            </div>
            <div className="h-0.5 bg-verde-ebano/6 rounded-full overflow-hidden">
              <div
                className="h-full bg-oro-antiguo/60 transition-all duration-1000"
                style={{ width: `${Math.min((user.circlePoints || 0) / 5000 * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <p className="text-[8px] uppercase tracking-[0.5em] text-verde-ebano/30 px-1 mb-2">Mi Espacio</p>

        {STANDARD_NAV.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}

        {isCircle && (
          <>
            <div className="my-3 flex items-center gap-3">
              <div className="flex-1 h-px bg-oro-antiguo/10" />
              <div className="flex items-center gap-1.5">
                <Crown size={8} className="text-oro-antiguo" strokeWidth={1.5} />
                <span className="text-[8px] uppercase tracking-[0.5em] text-oro-antiguo/50">The Circle</span>
              </div>
              <div className="flex-1 h-px bg-oro-antiguo/10" />
            </div>

            {CIRCLE_NAV.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} isCircle />
            ))}
          </>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-[9px] uppercase tracking-[0.4em] text-verde-ebano/30 hover:text-red-400 transition-colors group"
      >
        <LogOut size={12} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
        Cerrar Sesión
      </button>
    </aside>
  );
}

function NavLink({ item, active, isCircle = false }: { item: NavItem; active: boolean; isCircle?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group rounded-none ${
        active
          ? "bg-verde-ebano text-hueso-seda"
          : isCircle
          ? "text-verde-ebano/50 hover:text-oro-antiguo hover:bg-oro-antiguo/4"
          : "text-verde-ebano/50 hover:text-verde-ebano hover:bg-verde-ebano/4"
      }`}
    >
      <Icon
        size={13}
        strokeWidth={active ? 1.8 : 1.2}
        className={active ? "text-oro-antiguo" : isCircle ? "text-oro-antiguo/50 group-hover:text-oro-antiguo" : ""}
      />
      <span className={`text-[9px] uppercase tracking-[0.3em] flex-1 ${active ? "font-medium" : ""}`}>
        {item.label}
      </span>
      <ChevronRight size={10} strokeWidth={1} className={`transition-opacity ${active ? "opacity-40" : "opacity-0 group-hover:opacity-30"}`} />
      {active && (
        <motion.div
          layoutId="profile-nav-indicator"
          className="absolute left-0 inset-y-0 w-0.5 bg-oro-antiguo"
        />
      )}
    </Link>
  );
}
