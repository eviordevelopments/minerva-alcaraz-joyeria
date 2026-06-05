"use client";

import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProfileSidebar } from "../../components/ProfileSidebar";
import { EmpaqueCarousel } from "../../components/EmpaqueCarousel";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { supabase, formatPrice } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package, Settings,
  Crown, Images, Gem, ArrowRight, Sparkles, MapPin,
  ShoppingBag, Star, ChevronRight
} from "lucide-react";

// ─── Tier metadata ──────────────────────────────────────────────────────────
const TIER_DETAILS = {
  Observer: {
    label: "Love",
    nextTier: "Nivel THE CIRCLE",
    pointsNeeded: 1000,
    desc: "Inicia tu camino adquiriendo tu primera pieza artesanal.",
  },
  Initiate: {
    label: "Nivel THE CIRCLE",
    nextTier: "Devota",
    pointsNeeded: 3000,
    desc: "Has ingresado a THE CIRCLE. Disfruta de envíos prioritarios y acceso inicial.",
  },
  Devotee: {
    label: "Devota",
    nextTier: "Guardiana",
    pointsNeeded: 10000,
    desc: "Tu devoción por el diseño eterno te otorga acceso al concierge digital.",
  },
  Keeper: {
    label: "Guardiana",
    nextTier: "Eterna",
    pointsNeeded: 20000,
    desc: "Custodia de las piezas más exclusivas. Invitaciones a eventos de Atelier.",
  },
  Eternal: {
    label: "Eterna",
    nextTier: "Máximo Legado",
    pointsNeeded: 20000,
    desc: "Vínculo sagrado con la marca. Acceso ilimitado a piezas únicas del Atelier.",
  },
};

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface OrderItem {
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price_cents: number;
}

interface Order {
  order_id: string;
  order_number: string;
  status: string;
  total_cents: number;
  placed_at: string;
  items: OrderItem[];
}

interface Address {
  recipient_name: string;
  street: string;
  exterior_num: string;
  interior_num: string | null;
  colonia: string;
  city: string;
  state: string;
  postal_code: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const { user, isAuthenticated, refreshProfile } = useAuthStore();
  const router = useRouter();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    refreshProfile();
    fetchDashboardSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchDashboardSummary = async () => {
    if (!user) return;
    try {
      const { data: ordersData } = await supabase
        .from("v_order_history")
        .select("*")
        .eq("user_id", user.id)
        .order("placed_at", { ascending: false })
        .limit(2);

      setRecentOrders(ordersData || []);

      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .eq("address_type", "shipping")
        .maybeSingle();

      if (addressData) {
        setAddress({
          recipient_name: addressData.recipient_name,
          street: addressData.street,
          exterior_num: addressData.exterior_num,
          interior_num: addressData.interior_num,
          colonia: addressData.colonia,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
        });
      }
    } catch (err) {
      console.error("Error fetching summary data:", err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleSimulatePurchase = async () => {
    if (!user || isSimulating) return;
    setIsSimulating(true);

    try {
      const currentPoints = user.circlePoints || 0;
      const newPoints = currentPoints + 1000;

      let newTier: "Observer" | "Initiate" | "Devotee" | "Keeper" | "Eternal" = "Observer";
      if (newPoints >= 20000) newTier = "Eternal";
      else if (newPoints >= 10000) newTier = "Keeper";
      else if (newPoints >= 3000) newTier = "Devotee";
      else if (newPoints >= 1000) newTier = "Initiate";

      setToastMessage("Procesando adquisición en el atelier...");

      const { error } = await supabase
        .from("profiles")
        .update({
          circle_points: newPoints,
          is_circle_member: newPoints >= 1000,
          circle_tier: newTier,
        })
        .eq("id", user.id);

      if (error) throw error;

      const mockOrderNumber = `MA-SIM-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: insertedOrder } = await supabase
        .from("orders")
        .insert({
          order_number: mockOrderNumber,
          user_id: user.id,
          status: "paid",
          payment_method: "card",
          subtotal_cents: 950000,
          tax_cents: 152000,
          total_cents: 1102000,
          currency: "MXN",
          points_earned: 1000,
          shipping_name: user.fullName,
          shipping_street: "Bulevar de las Lomas",
          shipping_exterior_num: "450",
          shipping_colonia: "Lomas de Chapultepec",
          shipping_city: "Ciudad de México",
          shipping_state: "Ciudad de México",
          shipping_postal_code: "11000",
        })
        .select()
        .single();

      if (insertedOrder) {
        await supabase.from("order_items").insert({
          order_id: insertedOrder.id,
          product_sku: "MA-SIM-JEWEL",
          product_name: "Gema del Destino (Simulada)",
          unit_price_cents: 950000,
          quantity: 1,
          subtotal_cents: 950000,
        });
      }

      await refreshProfile();
      await fetchDashboardSummary();

      const wasObserver = currentPoints < 1000;
      if (wasObserver && newPoints >= 1000) {
        setToastMessage("¡Bienvenida a THE CIRCLE! Tu legado comienza aquí. (+1,000 pts)");
      } else {
        setToastMessage(`Adquisición exitosa (+1,000 pts) · Saldo: ${newPoints.toLocaleString("es-MX")} pts`);
      }
    } catch (err) {
      console.error("Simulation failed:", err);
      setToastMessage("No se pudo simular la compra. Inténtalo de nuevo.");
    } finally {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 5500);
    }
  };

  if (!user) return null;

  // THE CIRCLE design activates ONLY when member AND points >= 1000
  const isCircleActive = user.isCircleMember && (user.circlePoints || 0) >= 1000;
  const currentTier = (user.circleTier || "Observer") as keyof typeof TIER_DETAILS;
  const tierMeta = TIER_DETAILS[currentTier];

  const points = user.circlePoints || 0;
  const targetPoints = tierMeta.pointsNeeded;
  const progressPercent = isCircleActive ? Math.min((points / targetPoints) * 100, 100) : 0;

  const dashboardLinks = [
    { href: "/perfil/pedidos", label: "Mis Pedidos", icon: Package, desc: "Historial completo de adquisiciones" },
    { href: "/perfil/albumes", label: "Mis Álbumes", icon: Images, desc: "Álbumes curados e inspiraciones", circle: true },
    { href: "/perfil/colecciones-privadas", label: "Colecciones Privadas", icon: Gem, desc: "Joyas exclusivas The Circle", circle: true },
    { href: "/perfil/concierge", label: "Concierge Digital", icon: Sparkles, desc: "Asistente personal en tiempo real", circle: true },
    { href: "/perfil/cuidado-ritual", label: "Cuidado & Ritual", icon: Star, desc: "Preservación del legado de tus joyas" },
    { href: "/perfil/cuenta", label: "Mi Cuenta", icon: Settings, desc: "Preferencias, tallas y dirección de envío" },
  ];

  return (
    <main
      className={`min-h-screen font-sans antialiased transition-colors duration-1000 ${
        isCircleActive
          ? "bg-[#2C3729] text-[#E5DBD6]"
          : "bg-[#F8F5F2] text-[#2C3729]"
      }`}
    >
      <Header theme={isCircleActive ? "dark" : "light"} />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-50 bg-[#2C3729] text-[#E5DBD6] border border-[#CBB67B]/40 px-5 py-4 flex items-center gap-3 shadow-2xl"
          >
            <Sparkles size={14} className="text-[#CBB67B] shrink-0 animate-spin" />
            <p className="text-[10px] uppercase tracking-widest leading-relaxed">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ──────────────────────────────────────────────────── */}
      {/*
        Header = announcement bar (~32px) + nav bar (h-24 default, h-16 scrolled on mobile)
        Safe top padding: pt-[calc(32px+96px)] = pt-32 on mobile, increases on md
      */}
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <ProfileSidebar circleActive={isCircleActive} />

          {/* ── Main Content ────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-7 min-w-0">

            {/* Greeting -------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col gap-2 border-b pb-6 ${
                isCircleActive ? "border-[#CBB67B]/15" : "border-[#2C3729]/8"
              }`}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-[9px] uppercase tracking-[0.7em] ${
                    isCircleActive ? "text-[#CBB67B]" : "text-[#CBB67B]"
                  }`}
                >
                  Espacio Personal
                </span>
                {isCircleActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[7px] uppercase tracking-[0.4em] border border-[#CBB67B]/50 text-[#CBB67B] px-2 py-0.5"
                  >
                    Membresía Activa · {tierMeta.label}
                  </motion.span>
                )}
              </div>
              <h1
                className={`text-3xl md:text-4xl font-display tracking-[0.05em] leading-tight ${
                  isCircleActive ? "text-[#E5DBD6]" : "text-[#2C3729]"
                }`}
              >
                Bienvenid@, {user.displayName || user.fullName.split(" ")[0]}
              </h1>
              <p
                className={`text-xs font-light italic ${
                  isCircleActive ? "text-[#E5DBD6]/50" : "text-[#2C3729]/50"
                }`}
              >
                {isCircleActive
                  ? "Custodio de piezas exclusivas y herencia artesanal."
                  : "Descubre el lujo eterno de Minerva Alcaraz."}
              </p>
            </motion.div>

            {/* THE CIRCLE Card -------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`relative p-6 sm:p-8 flex flex-col gap-6 overflow-hidden shadow-xl transition-all duration-1000 ${
                isCircleActive
                  ? "bg-gradient-to-br from-[#1E261C] via-[#2C3729] to-[#1A2218] border border-[#CBB67B]/25"
                  : "bg-white border border-[#2C3729]/8"
              }`}
            >
              {/* Decorative crown watermark */}
              <div className="absolute right-0 top-0 bottom-0 w-48 opacity-[0.04] pointer-events-none select-none">
                <Crown size={200} strokeWidth={0.3} className="text-[#CBB67B] absolute -right-8 -top-8" />
              </div>

              {/* Card header row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 z-10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Crown
                      size={11}
                      strokeWidth={1.5}
                      className={`${isCircleActive ? "text-[#CBB67B] animate-pulse" : "text-[#2C3729]/30"}`}
                    />
                    <span
                      className={`text-[9px] uppercase tracking-[0.6em] font-medium ${
                        isCircleActive ? "text-[#CBB67B]" : "text-[#2C3729]/40"
                      }`}
                    >
                      THE CIRCLE MEMBERSHIP
                    </span>
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-display tracking-wide uppercase ${
                      isCircleActive ? "text-[#E5DBD6]" : "text-[#2C3729]"
                    }`}
                  >
                    {isCircleActive ? tierMeta.label : "Love"}
                  </h3>
                </div>

                {/* Points badge */}
                <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1">
                  <span
                    className={`text-[8px] uppercase tracking-widest ${
                      isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                    }`}
                  >
                    Puntos de Legado
                  </span>
                  <span
                    className={`text-2xl sm:text-3xl font-display tracking-tighter ${
                      isCircleActive ? "text-[#CBB67B]" : "text-[#2C3729]/40"
                    }`}
                  >
                    {points.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-3 z-10">
                <div
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-[9px] uppercase tracking-widest ${
                    isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                  }`}
                >
                  <span>Progreso de Nivel</span>
                  <span className="text-[8px]">
                    Siguiente: {tierMeta.nextTier} ({points}/{targetPoints} pts)
                  </span>
                </div>

                <div
                  className={`h-[2px] overflow-hidden relative ${
                    isCircleActive ? "bg-[#E5DBD6]/10" : "bg-[#2C3729]/8"
                  }`}
                >
                  <motion.div
                    className={`h-full ${isCircleActive ? "bg-[#CBB67B]" : "bg-[#2C3729]/20"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                <p
                  className={`text-[10px] font-light italic leading-relaxed ${
                    isCircleActive ? "text-[#E5DBD6]/55" : "text-[#2C3729]/45"
                  }`}
                >
                  {tierMeta.desc}
                </p>
              </div>

              {/* Simulator block */}
              <div
                className={`pt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 z-10 ${
                  isCircleActive ? "border-[#E5DBD6]/10" : "border-[#2C3729]/8"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-[8px] uppercase tracking-widest ${
                      isCircleActive ? "text-[#CBB67B]" : "text-[#2C3729]/40"
                    }`}
                  >
                    Sandbox de Simulación
                  </span>
                  <p
                    className={`text-[10px] font-light ${
                      isCircleActive ? "text-[#E5DBD6]/35" : "text-[#2C3729]/35"
                    }`}
                  >
                    Cada compra otorga 1,000 puntos y te promueve en el Círculo.
                  </p>
                </div>

                <button
                  onClick={handleSimulatePurchase}
                  disabled={isSimulating}
                  className={`flex-shrink-0 text-[9px] uppercase tracking-[0.4em] px-7 py-3.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group ${
                    isCircleActive
                      ? "bg-[#CBB67B] text-[#2C3729] hover:bg-[#E5DBD6] hover:text-[#2C3729]"
                      : "bg-[#2C3729] text-[#E5DBD6] hover:bg-[#CBB67B] hover:text-[#2C3729]"
                  }`}
                >
                  {isSimulating ? (
                    "Procesando..."
                  ) : (
                    <>
                      Simular Adquisición{" "}
                      <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Quick links grid ------------------------------------------ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {dashboardLinks.map(({ href, label, icon: Icon, desc, circle }, idx) => {
                const isLocked = circle && !isCircleActive;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <Link
                      href={isLocked ? "/the-circle" : href}
                      className={`flex flex-col justify-between h-36 sm:h-44 p-4 sm:p-6 border transition-all duration-500 group relative ${
                        isCircleActive
                          ? isLocked
                            ? "bg-[#2C3729]/40 border-[#CBB67B]/8 opacity-50 cursor-not-allowed"
                            : circle
                            ? "bg-[#2C3729] border-[#CBB67B]/20 hover:border-[#CBB67B]/50"
                            : "bg-[#2C3729] border-[#E5DBD6]/10 hover:border-[#E5DBD6]/25"
                          : isLocked
                          ? "bg-white/40 border-[#2C3729]/5 opacity-50 cursor-not-allowed"
                          : circle
                          ? "bg-white border-[#CBB67B]/15 hover:border-[#CBB67B]/40"
                          : "bg-white border-[#2C3729]/8 hover:border-[#2C3729]/25"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border ${
                            isCircleActive
                              ? circle
                                ? "border-[#CBB67B]/30 text-[#CBB67B]"
                                : "border-[#E5DBD6]/15 text-[#E5DBD6]/60"
                              : circle
                              ? "border-[#CBB67B]/25 text-[#CBB67B]"
                              : "border-[#2C3729]/10 text-[#2C3729]/60"
                          }`}
                        >
                          <Icon size={13} strokeWidth={1.2} />
                        </div>
                        {circle && (
                          <span
                            className={`text-[6px] uppercase tracking-[0.3em] border px-1.5 py-0.5 hidden sm:inline ${
                              isCircleActive
                                ? "border-[#CBB67B]/40 text-[#CBB67B]"
                                : "border-[#CBB67B]/30 text-[#CBB67B]"
                            }`}
                          >
                            Círculo
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[9px] uppercase tracking-[0.25em] font-medium transition-colors ${
                              isCircleActive
                                ? "text-[#E5DBD6] group-hover:text-[#CBB67B]"
                                : "text-[#2C3729] group-hover:text-[#CBB67B]"
                            }`}
                          >
                            {label}
                          </span>
                          {isLocked && <Crown size={7} className="text-[#CBB67B]" />}
                        </div>
                        <p
                          className={`text-[8px] sm:text-[9px] font-light leading-snug ${
                            isCircleActive ? "text-[#E5DBD6]/35" : "text-[#2C3729]/40"
                          }`}
                        >
                          {isLocked ? "Desbloquea adquiriendo tu primer pieza." : desc}
                        </p>
                      </div>

                      <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight size={11} className="text-[#CBB67B]" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Orders + Sizes -------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className={`border p-6 sm:p-8 flex flex-col gap-6 ${
                  isCircleActive
                    ? "bg-[#1E261C] border-[#CBB67B]/15"
                    : "bg-white border-[#2C3729]/8"
                }`}
              >
                <div
                  className={`flex justify-between items-center border-b pb-4 ${
                    isCircleActive ? "border-[#CBB67B]/10" : "border-[#2C3729]/6"
                  }`}
                >
                  <h3
                    className={`text-[10px] uppercase tracking-[0.5em] ${
                      isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                    }`}
                  >
                    Adquisiciones Recientes
                  </h3>
                  <Link
                    href="/perfil/pedidos"
                    className={`text-[8px] uppercase tracking-widest transition-colors ${
                      isCircleActive
                        ? "text-[#CBB67B] hover:text-[#E5DBD6]"
                        : "text-[#CBB67B] hover:text-[#2C3729]"
                    }`}
                  >
                    Ver todos
                  </Link>
                </div>

                {isLoadingSummary ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="w-4 h-4 border border-t-[#CBB67B] border-[#CBB67B]/20 animate-spin rounded-full" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <ShoppingBag
                      size={20}
                      strokeWidth={1}
                      className={isCircleActive ? "text-[#E5DBD6]/20" : "text-[#2C3729]/20"}
                    />
                    <p
                      className={`text-[10px] uppercase tracking-widest ${
                        isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                      }`}
                    >
                      Sin adquisiciones registradas
                    </p>
                    <Link
                      href="/shop"
                      className="text-[9px] uppercase tracking-[0.4em] text-[#CBB67B] border-b border-[#CBB67B]/30 pb-0.5 hover:border-[#CBB67B] transition-colors"
                    >
                      Explorar el Atelier
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className={`flex justify-between items-center p-4 border transition-all ${
                          isCircleActive
                            ? "border-[#CBB67B]/10 hover:border-[#CBB67B]/30"
                            : "border-[#2C3729]/5 hover:border-[#CBB67B]/25"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-[9px] uppercase tracking-widest font-medium ${
                              isCircleActive ? "text-[#E5DBD6]" : "text-[#2C3729]"
                            }`}
                          >
                            {order.order_number}
                          </span>
                          <span
                            className={`text-[8px] ${
                              isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                            }`}
                          >
                            {new Date(order.placed_at).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-display ${
                            isCircleActive ? "text-[#CBB67B]" : "text-[#2C3729]"
                          }`}
                        >
                          {formatPrice(order.total_cents)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Sizes & Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`border p-6 sm:p-8 flex flex-col gap-6 ${
                  isCircleActive
                    ? "bg-[#1E261C] border-[#CBB67B]/15"
                    : "bg-white border-[#2C3729]/8"
                }`}
              >
                <div
                  className={`flex justify-between items-center border-b pb-4 ${
                    isCircleActive ? "border-[#CBB67B]/10" : "border-[#2C3729]/6"
                  }`}
                >
                  <h3
                    className={`text-[10px] uppercase tracking-[0.5em] ${
                      isCircleActive ? "text-[#E5DBD6]/40" : "text-[#2C3729]/40"
                    }`}
                  >
                    Preferencias de Medidas
                  </h3>
                  <Link
                    href="/perfil/cuenta"
                    className={`text-[8px] uppercase tracking-widest transition-colors ${
                      isCircleActive
                        ? "text-[#CBB67B] hover:text-[#E5DBD6]"
                        : "text-[#CBB67B] hover:text-[#2C3729]"
                    }`}
                  >
                    Editar
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center py-1">
                  {[
                    { label: "Anillo", value: user.ringSize },
                    { label: "Pulsera", value: user.braceletSize?.split(" ")[0] },
                    { label: "Collar", value: user.necklaceLength },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className={`p-3 border flex flex-col gap-1 ${
                        isCircleActive
                          ? "border-[#CBB67B]/12"
                          : "border-[#2C3729]/6"
                      }`}
                    >
                      <span
                        className={`text-[8px] uppercase tracking-widest ${
                          isCircleActive ? "text-[#E5DBD6]/35" : "text-[#2C3729]/40"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-base font-display text-[#CBB67B]">
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={`flex flex-col gap-2 pt-2 border-t ${
                    isCircleActive ? "border-[#CBB67B]/10" : "border-[#2C3729]/6"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#CBB67B]">
                    <MapPin size={10} strokeWidth={1.5} />
                    <span className="text-[8px] uppercase tracking-widest font-medium">
                      Destino de Envío Principal
                    </span>
                  </div>
                  {address ? (
                    <p
                      className={`text-[10px] leading-relaxed font-light ${
                        isCircleActive ? "text-[#E5DBD6]/50" : "text-[#2C3729]/50"
                      }`}
                    >
                      {address.recipient_name}
                      <br />
                      {address.street} {address.exterior_num}
                      {address.interior_num ? `, Int ${address.interior_num}` : ""}
                      <br />
                      Col. {address.colonia}, {address.city}, CP {address.postal_code}
                    </p>
                  ) : (
                    <p
                      className={`text-[9px] italic ${
                        isCircleActive ? "text-[#E5DBD6]/30" : "text-[#2C3729]/30"
                      }`}
                    >
                      No se ha registrado una dirección de envío.{" "}
                      <Link
                        href="/perfil/cuenta"
                        className="text-[#CBB67B] hover:underline not-italic ml-1"
                      >
                        Configurar
                      </Link>
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* ── Empaque Carousel ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`border p-6 sm:p-8 flex flex-col gap-6 ${
                isCircleActive
                  ? "bg-[#1E261C] border-[#CBB67B]/15"
                  : "bg-white border-[#2C3729]/8"
              }`}
            >
              {/* Section header */}
              <div
                className={`flex flex-col gap-1 border-b pb-4 ${
                  isCircleActive ? "border-[#CBB67B]/10" : "border-[#2C3729]/6"
                }`}
              >
                <span
                  className={`text-[9px] uppercase tracking-[0.6em] ${
                    isCircleActive ? "text-[#CBB67B]" : "text-[#CBB67B]"
                  }`}
                >
                  El Rito del Desempaque
                </span>
                <h3
                  className={`text-lg font-display tracking-wide italic ${
                    isCircleActive ? "text-[#E5DBD6]" : "text-[#2C3729]"
                  }`}
                >
                  Dentro de la Caja
                </h3>
                <p
                  className={`text-[10px] font-light italic leading-relaxed mt-1 ${
                    isCircleActive ? "text-[#E5DBD6]/45" : "text-[#2C3729]/45"
                  }`}
                >
                  Cada pieza llega en un ecosistema diseñado para proteger su alma.
                </p>
              </div>

              {/* Two-column layout: carousel + features list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <EmpaqueCarousel
                  aspectClass="aspect-[3/4]"
                  className={`border ${
                    isCircleActive ? "border-[#CBB67B]/15" : "border-[#2C3729]/8"
                  }`}
                />
                <ul className="flex flex-col gap-3 pt-1">
                  {[
                    "Estuche rígido forrado en seda hueso",
                    "Interiores de terciopelo verde ébano",
                    "Certificado de autenticidad seriado",
                    "Cinta de cierre con sello lacrado",
                    "Garantía vitalicia para miembros del Círculo",
                  ].map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] ${
                        isCircleActive ? "text-[#E5DBD6]/55" : "text-[#2C3729]/55"
                      }`}
                    >
                      <span
                        className={`w-4 h-[1px] flex-shrink-0 ${
                          isCircleActive ? "bg-[#CBB67B]" : "bg-[#CBB67B]"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
