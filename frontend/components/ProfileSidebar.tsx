"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Package, RotateCcw, HeadphonesIcon, Settings, Crown, Images,
  Gem, CalendarDays, Sparkles, BookOpen, Truck, LogOut, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../lib/store/useAuthStore";
import { useCircleTheme } from "../lib/context/CircleThemeContext";

// ─── Tier labels ─────────────────────────────────────────────────────────────
const TIER_LABELS: Record<string, string> = {
  Observer: "Love",
  Initiate: "Nivel THE CIRCLE",
  Devotee: "Devota",
  Keeper: "Guardiana",
  Eternal: "Eterna",
};

// ─── Nav definitions ─────────────────────────────────────────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  circleOnly?: boolean;
}

const STANDARD_NAV: NavItem[] = [
  { href: "/perfil/pedidos",    label: "Mis Pedidos",   icon: Package },
  { href: "/perfil/devoluciones", label: "Devoluciones", icon: RotateCcw },
  { href: "/perfil/soporte",    label: "Soporte",       icon: HeadphonesIcon },
  { href: "/perfil/cuenta",     label: "Mi Cuenta",     icon: Settings },
];

const CIRCLE_NAV: NavItem[] = [
  { href: "/perfil/albumes",              label: "Mis Álbumes",         icon: Images },
  { href: "/perfil/colecciones-privadas", label: "Colecciones Privadas", icon: Gem },
  { href: "/perfil/eventos",              label: "Eventos Atelier",     icon: CalendarDays },
  { href: "/perfil/concierge",            label: "Concierge Privado",   icon: Sparkles },
  { href: "/perfil/cuidado-ritual",       label: "Cuidado y Ritual",    icon: BookOpen },
  { href: "/perfil/envios",               label: "Envíos Prioritarios", icon: Truck },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface ProfileSidebarProps {
  /** Pass true when THE CIRCLE design mode is active (member + ≥1000 pts) */
  circleActive?: boolean;
}

export function ProfileSidebar({ circleActive: propCircleActive }: ProfileSidebarProps) {
  const { user, logout } = useAuthStore();
  const { isCircleActive: contextCircleActive } = useCircleTheme();
  const pathname = usePathname();
  const router   = useRouter();

  const circleActive = propCircleActive !== undefined ? propCircleActive : contextCircleActive;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const tier      = user.circleTier || "Observer";
  const isCircle  = user.isCircleMember;
  const pts       = user.circlePoints || 0;

  // ── colour tokens (switched by circleActive) ──────────────────────────────
  const bg        = circleActive ? "bg-[#1E261C]"        : "bg-white";
  const border    = circleActive ? "border-[#CBB67B]/18" : "border-[#2C3729]/8";
  const textPrimary   = circleActive ? "text-[#E5DBD6]"      : "text-[#2C3729]";
  const textMuted     = circleActive ? "text-[#E5DBD6]/40"   : "text-[#2C3729]/40";
  const textEmail     = circleActive ? "text-[#E5DBD6]/30"   : "text-[#2C3729]/35";
  const divider   = circleActive ? "bg-[#CBB67B]/12"     : "bg-[#2C3729]/6";
  const gold      = "text-[#CBB67B]";

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-5">

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className={`${bg} border ${border} p-6 flex flex-col gap-5`}>

        {/* Avatar + info */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {/* Gold frame for circle members */}
            {isCircle && (
              <div className="absolute -inset-1.5 border border-[#CBB67B]/50 pointer-events-none z-10" />
            )}
            <div className={`w-14 h-14 overflow-hidden flex items-center justify-center ${
              circleActive ? "bg-[#2C3729]" : "bg-[#2C3729]/5"
            }`}>
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className={`text-xl font-display uppercase ${
                  circleActive ? "text-[#CBB67B]/60" : "text-[#2C3729]/40"
                }`}>
                  {user.fullName.charAt(0)}
                </span>
              )}
            </div>
            {isCircle && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#CBB67B] flex items-center justify-center z-20">
                <Crown size={9} strokeWidth={2} className="text-[#2C3729]" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className={`text-sm font-medium truncate leading-tight ${textPrimary}`}>
              {user.displayName || user.fullName}
            </p>
            <p className={`text-[9px] uppercase tracking-widest truncate ${textEmail}`}>
              {user.email}
            </p>
            {/* Tier badge */}
            <span className={`mt-1 self-start text-[7px] uppercase tracking-[0.4em] border px-2 py-0.5 ${
              circleActive
                ? "border-[#CBB67B]/40 text-[#CBB67B]"
                : `border-[#2C3729]/15 ${textMuted}`
            }`}>
              {circleActive ? `The Circle · ${TIER_LABELS[tier]}` : `Cuenta Estándar · ${TIER_LABELS[tier] || "Love"}`}
            </span>
          </div>
        </div>

        {/* Points bar — only for circle members */}
        {isCircle && (
          <div className={`flex flex-col gap-2 pt-3 border-t ${border}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[8px] uppercase tracking-[0.4em] ${textMuted}`}>
                Puntos de Legado
              </span>
              <span className={`text-[10px] font-medium ${gold}`}>
                {pts.toLocaleString("es-MX")}
              </span>
            </div>
            <div className={`h-[1px] ${divider} overflow-hidden relative`}>
              <motion.div
                className="h-full bg-[#CBB67B]/70"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((pts / 5000) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-1">
        <p className={`text-[8px] uppercase tracking-[0.5em] px-1 mb-2 ${textMuted}`}>
          Mi Espacio
        </p>

        {STANDARD_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            circleActive={circleActive}
          />
        ))}

        {isCircle && (
          <>
            <div className="my-3 flex items-center gap-3">
              <div className={`flex-1 h-px ${divider}`} />
              <div className="flex items-center gap-1.5">
                <Crown size={8} className={gold} strokeWidth={1.5} />
                <span className={`text-[7px] uppercase tracking-[0.5em] ${gold} opacity-50`}>
                  The Circle
                </span>
              </div>
              <div className={`flex-1 h-px ${divider}`} />
            </div>

            {CIRCLE_NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={pathname === item.href}
                circleActive={circleActive}
                isCircleSection
              />
            ))}
          </>
        )}
      </nav>

      {/* ── Logout ───────────────────────────────────────────────────────── */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-3 py-2.5 text-[9px] uppercase tracking-[0.4em] transition-colors group ${
          circleActive
            ? "text-[#E5DBD6]/25 hover:text-red-400"
            : "text-[#2C3729]/30 hover:text-red-400"
        }`}
      >
        <LogOut
          size={12}
          strokeWidth={1.5}
          className="group-hover:translate-x-0.5 transition-transform"
        />
        Cerrar Sesión
      </button>
    </aside>
  );
}

// ─── NavLink helper ──────────────────────────────────────────────────────────
function NavLink({
  item,
  active,
  circleActive = false,
  isCircleSection = false,
}: {
  item: NavItem;
  active: boolean;
  circleActive?: boolean;
  isCircleSection?: boolean;
}) {
  const Icon = item.icon;

  // Active state: always green bg + cream text (regardless of page mode)
  const activeClass = "bg-[#2C3729] text-[#E5DBD6]";

  // Inactive states depend on page mode
  const inactiveClass = circleActive
    ? isCircleSection
      ? "text-[#E5DBD6]/40 hover:text-[#CBB67B] hover:bg-[#CBB67B]/5"
      : "text-[#E5DBD6]/40 hover:text-[#E5DBD6] hover:bg-[#E5DBD6]/5"
    : isCircleSection
    ? "text-[#2C3729]/50 hover:text-[#CBB67B] hover:bg-[#CBB67B]/5"
    : "text-[#2C3729]/50 hover:text-[#2C3729] hover:bg-[#2C3729]/4";

  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group ${
        active ? activeClass : inactiveClass
      }`}
    >
      <Icon
        size={13}
        strokeWidth={active ? 1.8 : 1.2}
        className={
          active
            ? "text-[#CBB67B]"
            : isCircleSection
            ? "text-[#CBB67B]/50 group-hover:text-[#CBB67B]"
            : ""
        }
      />
      <span className={`text-[9px] uppercase tracking-[0.3em] flex-1 ${active ? "font-medium" : ""}`}>
        {item.label}
      </span>
      <ChevronRight
        size={10}
        strokeWidth={1}
        className={`transition-opacity ${active ? "opacity-30" : "opacity-0 group-hover:opacity-25"}`}
      />
      {active && (
        <motion.div
          layoutId="profile-nav-indicator"
          className="absolute left-0 inset-y-0 w-[2px] bg-[#CBB67B]"
        />
      )}
    </Link>
  );
}
