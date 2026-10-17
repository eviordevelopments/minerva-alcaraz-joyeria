"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Package,
  MapPin,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { formatPrice } from "@/lib/supabase";

interface OrderItem {
  id: string;
  product_name: string;
  product_sku: string;
  product_image?: string | null;
  quantity: number;
  unit_price_cents: number;
  subtotal_cents: number;
  size_requested?: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total_cents: number;
  subtotal_cents?: number;
  shipping_cents?: number;
  discount_cents?: number;
  placed_at: string;
  created_at?: string;
  shipping_name?: string | null;
  shipping_email?: string | null;
  shipping_phone?: string | null;
  shipping_street?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  customer_notes?: string | null;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  order_items?: OrderItem[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanPhoneForWhatsApp(phone?: string | null): string {
  if (!phone) return "";
  let digits = phone.replace(/[^0-9]/g, "");
  // If 10 digits Mexican number, add 52 prefix
  if (digits.length === 10) {
    digits = "52" + digits;
  }
  return digits;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return { label: "✓ Liquidado", color: "bg-emerald-900/30 border-emerald-500/40 text-emerald-400" };
    case "processing":
      return { label: "🔨 En Taller", color: "bg-blue-900/30 border-blue-500/40 text-blue-400" };
    case "shipped":
      return { label: "📦 En Camino", color: "bg-[#CBB67B]/20 border-[#CBB67B]/40 text-[#CBB67B]" };
    case "delivered":
      return { label: "💎 Entregado", color: "bg-emerald-900/50 border-emerald-400 text-emerald-300 font-bold" };
    case "pending":
      return { label: "⏳ Carrito Dejado", color: "bg-amber-900/40 border-amber-500/40 text-amber-300" };
    case "cancelled":
      return { label: "✖ Cancelado", color: "bg-red-900/30 border-red-500/40 text-red-400" };
    default:
      return { label: status, color: "bg-gray-800 border-gray-600 text-gray-400" };
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"liquidadas" | "carritos_dejados">("liquidadas");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadOrders() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setOrders(json.orders ?? []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "carritos" || p === "carritos_dejados") {
        setActiveTab("carritos_dejados");
      }
    }
    loadOrders();
  }, []);

  // Split into real liquidated transactions vs abandoned/pending carts
  const LIQUIDATED_STATUSES = ["paid", "processing", "shipped", "delivered"];
  const liquidatedOrders = orders.filter((o) => LIQUIDATED_STATUSES.includes(o.status));
  const abandonedOrders = orders.filter((o) => !LIQUIDATED_STATUSES.includes(o.status));

  // Compute stats
  const totalLiquidatedCents = liquidatedOrders.reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const totalAbandonedCents = abandonedOrders.reduce((sum, o) => sum + (o.total_cents || 0), 0);

  // Active list based on tab
  const currentList = activeTab === "liquidadas" ? liquidatedOrders : abandonedOrders;

  const filteredOrders = currentList.filter((o) => {
    const s = searchTerm.toLowerCase();
    const customerName = (o.shipping_name || o.profiles?.full_name || "").toLowerCase();
    const customerEmail = (o.shipping_email || o.profiles?.email || "").toLowerCase();
    const customerPhone = (o.shipping_phone || o.profiles?.phone || "").toLowerCase();
    const orderNum = (o.order_number || "").toLowerCase();
    const itemsMatch = (o.order_items || []).some((it) => it.product_name.toLowerCase().includes(s));

    return (
      orderNum.includes(s) ||
      customerName.includes(s) ||
      customerEmail.includes(s) ||
      customerPhone.includes(s) ||
      itemsMatch
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-[#CBB67B]">
            ERP Minerva Alcaraz · Caja y Despacho
          </span>
          <h1 className="font-display-erp text-2xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Transacciones &amp; Carritos
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex items-center flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar cliente, orden, pieza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1F271D] border border-[#CBB67B]/30 pl-9 pr-3 py-2 text-xs sm:text-sm text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none rounded-none"
            />
            <Search size={14} className="absolute left-3 text-[#8E9A8B]" />
          </div>
          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="w-9 h-9 border border-[#CBB67B]/30 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] transition-all flex-shrink-0"
            title="Recargar registros"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Ventas Liquidadas */}
        <div 
          onClick={() => setActiveTab("liquidadas")}
          className={`p-4 border transition-all cursor-pointer ${
            activeTab === "liquidadas"
              ? "bg-[#1F271D] border-[#CBB67B] shadow-[0_0_15px_rgba(203,182,123,0.15)]"
              : "bg-[#1F271D]/60 border-[#CBB67B]/20 hover:border-[#CBB67B]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8E9A8B]">
              Transacciones Liquidadas
            </span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-mono font-bold text-[#CBB67B]">
            {formatPrice(totalLiquidatedCents)}
          </div>
          <p className="text-[10px] sm:text-xs text-[#8E9A8B] mt-1">
            {liquidatedOrders.length} {liquidatedOrders.length === 1 ? "orden cobrada" : "órdenes cobradas"}
          </p>
        </div>

        {/* Card 2: Carritos Dejados */}
        <div 
          onClick={() => setActiveTab("carritos_dejados")}
          className={`p-4 border transition-all cursor-pointer ${
            activeTab === "carritos_dejados"
              ? "bg-[#1F271D] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              : "bg-[#1F271D]/60 border-[#CBB67B]/20 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300">
              Carritos Dejados
            </span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-mono font-bold text-amber-400">
            {formatPrice(totalAbandonedCents)}
          </div>
          <p className="text-[10px] sm:text-xs text-[#8E9A8B] mt-1">
            {abandonedOrders.length} {abandonedOrders.length === 1 ? "bolsa por recuperar" : "bolsas por recuperar"}
          </p>
        </div>

        {/* Card 3: Tasa de Conversión */}
        <div className="hidden lg:block p-4 bg-[#1F271D]/60 border border-[#CBB67B]/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8E9A8B]">
              Tasa de Cierre / Conversión
            </span>
            <TrendingUp size={16} className="text-[#CBB67B]" />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-mono font-bold text-[#E5DBD6]">
            {orders.length > 0
              ? `${Math.round((liquidatedOrders.length / orders.length) * 100)}%`
              : "0%"}
          </div>
          <p className="text-[10px] sm:text-xs text-[#8E9A8B] mt-1">
            {liquidatedOrders.length} de {orders.length} pedidos iniciados
          </p>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex border-b border-[#CBB67B]/20">
        <button
          onClick={() => setActiveTab("liquidadas")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === "liquidadas"
              ? "border-[#CBB67B] text-[#CBB67B] bg-[#1F271D]"
              : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
          }`}
        >
          <CheckCircle2 size={15} />
          <span>Transacciones Liquidadas</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            {liquidatedOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("carritos_dejados")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === "carritos_dejados"
              ? "border-amber-400 text-amber-300 bg-[#1F271D]"
              : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
          }`}
        >
          <Clock size={15} />
          <span>Carritos Dejados</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
            {abandonedOrders.length}
          </span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Error al cargar registros</p>
            <p className="text-[11px] opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* CONTENT LIST */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#1F271D] border border-[#CBB67B]/10 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-12 text-center text-[#8E9A8B]">
          <ShoppingBag size={28} className="mx-auto text-[#CBB67B]/30 mb-3" />
          <p className="text-sm uppercase tracking-widest text-[#E5DBD6] font-medium">
            {activeTab === "liquidadas"
              ? "No hay transacciones liquidadas registradas"
              : "No hay carritos dejados en este momento"}
          </p>
          <p className="text-xs text-[#8E9A8B] mt-1">
            {searchTerm ? "Prueba cambiando el término de búsqueda." : "Los registros aparecerán automáticamente en tiempo real."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* MOBILE CARDS (Visible on phones < md) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((o) => {
              const customerName = o.shipping_name || o.profiles?.full_name || "Cliente Invitado";
              const customerEmail = o.shipping_email || o.profiles?.email || "";
              const customerPhone = o.shipping_phone || o.profiles?.phone || "";
              const badge = getStatusBadge(o.status);
              const items = o.order_items || [];
              const rawPhone = cleanPhoneForWhatsApp(customerPhone);
              const itemsText = items.map((it) => `${it.product_name} (x${it.quantity})`).join(", ");
              const waMessage = encodeURIComponent(
                activeTab === "carritos_dejados"
                  ? `Hola ${customerName}, te saludamos desde Minerva Alcaraz Joyería. Notamos que seleccionaste piezas en tu bolsa (${itemsText || "Joyería Fina"}). ¿Deseas asistencia personalizada de nuestra orfebre para resolver dudas o completar tu orden?`
                  : `Hola ${customerName}, te contactamos de Minerva Alcaraz Joyería respecto a tu pedido ${o.order_number}. ¡Muchas gracias por tu compra!`
              );

              return (
                <div
                  key={o.id}
                  className="bg-[#1F271D] border border-[#CBB67B]/25 p-4 flex flex-col gap-3 text-left"
                >
                  {/* Top: Folio, Date & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#CBB67B]/15 pb-2.5">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#E5DBD6]">
                        {o.order_number}
                      </span>
                      <p className="text-[10px] text-[#8E9A8B] mt-0.5">
                        {formatDate(o.placed_at || o.created_at || "")}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-[#E5DBD6] block">
                      {customerName}
                    </span>
                    {customerPhone && (
                      <div className="flex items-center gap-1.5 text-xs text-[#CBB67B] font-mono">
                        <Phone size={12} />
                        <a href={`tel:${customerPhone}`} className="hover:underline">{customerPhone}</a>
                      </div>
                    )}
                    {customerEmail && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8E9A8B] font-mono truncate">
                        <Mail size={12} />
                        <a href={`mailto:${customerEmail}`} className="hover:underline truncate">{customerEmail}</a>
                      </div>
                    )}
                    {(o.shipping_city || o.shipping_state) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8E9A8B]/80 uppercase tracking-wider">
                        <MapPin size={11} />
                        <span>{[o.shipping_city, o.shipping_state, o.shipping_country].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Items snapshot */}
                  {items.length > 0 && (
                    <div className="bg-[#2C3729]/40 border border-[#CBB67B]/10 p-2.5 space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#CBB67B] block font-medium">
                        Piezas en bolsa ({items.length}):
                      </span>
                      <div className="space-y-1.5">
                        {items.map((it) => (
                          <div key={it.id || it.product_sku} className="flex items-center gap-2.5 text-xs">
                            <div className="w-8 h-8 relative bg-black/40 border border-[#CBB67B]/20 flex-shrink-0 overflow-hidden">
                              {it.product_image ? (
                                <Image
                                  src={it.product_image}
                                  alt={it.product_name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package size={14} className="text-[#8E9A8B] m-auto" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[#E5DBD6] truncate font-medium">{it.product_name}</p>
                              <p className="text-[10px] text-[#8E9A8B] font-mono">
                                Cant: {it.quantity} · {formatPrice(it.unit_price_cents)}
                                {it.size_requested && ` (Talla: ${it.size_requested})`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total & Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#CBB67B]/15">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B] block">Total</span>
                      <span className="text-base font-mono font-bold text-[#CBB67B]">
                        {formatPrice(o.total_cents)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rawPhone && (
                        <a
                          href={`https://wa.me/${rawPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs uppercase tracking-wider font-bold transition-colors"
                          title="Contactar vía WhatsApp"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <Link
                        href={`/admin/pedidos/${o.id}`}
                        className="flex items-center gap-1 px-3 py-2 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] text-xs uppercase tracking-wider font-bold transition-colors"
                      >
                        <span>Detalle</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE (Visible on >= md) */}
          <div className="hidden md:block bg-[#1F271D] border border-[#CBB67B]/20 overflow-x-auto text-left">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/30 text-[#8E9A8B] text-[11px] uppercase tracking-widest">
                  <th className="py-4 px-6 text-left font-bold">Orden / Folio</th>
                  <th className="py-4 px-6 text-left font-bold">Cliente y Contacto</th>
                  <th className="py-4 px-6 text-left font-bold">Piezas en Carrito</th>
                  <th className="py-4 px-6 text-right font-bold">Total</th>
                  <th className="py-4 px-6 text-center font-bold">Estado</th>
                  <th className="py-4 px-6 text-center font-bold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBB67B]/10 text-sm">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((o) => {
                    const customerName = o.shipping_name || o.profiles?.full_name || "Cliente Invitado";
                    const customerEmail = o.shipping_email || o.profiles?.email || "Sin correo";
                    const customerPhone = o.shipping_phone || o.profiles?.phone || "";
                    const badge = getStatusBadge(o.status);
                    const items = o.order_items || [];
                    const rawPhone = cleanPhoneForWhatsApp(customerPhone);
                    const itemsText = items.map((it) => `${it.product_name} (x${it.quantity})`).join(", ");
                    const waMessage = encodeURIComponent(
                      activeTab === "carritos_dejados"
                        ? `Hola ${customerName}, te saludamos desde Minerva Alcaraz Joyería. Notamos que dejaste piezas en tu bolsa (${itemsText || "Joyería Fina"}). ¿Deseas asistencia personalizada de nuestra orfebre para resolver dudas o completar tu orden?`
                        : `Hola ${customerName}, te contactamos de Minerva Alcaraz Joyería sobre tu orden ${o.order_number}. ¡Gracias por tu compra!`
                    );

                    return (
                      <motion.tr
                        key={o.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-[#2C3729]/30 transition-colors"
                      >
                        {/* Orden */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-[#E5DBD6] tracking-wider">
                              {o.order_number}
                            </span>
                            <span className="text-[11px] text-[#8E9A8B]">
                              {formatDate(o.placed_at || o.created_at || "")}
                            </span>
                          </div>
                        </td>

                        {/* Cliente */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#E5DBD6] tracking-wide">
                              {customerName}
                            </span>
                            {customerPhone && (
                              <span className="text-xs text-[#CBB67B] font-mono flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {customerPhone}
                              </span>
                            )}
                            <span className="text-xs text-[#8E9A8B] font-mono flex items-center gap-1">
                              <Mail size={10} /> {customerEmail}
                            </span>
                          </div>
                        </td>

                        {/* Piezas */}
                        <td className="py-4 px-6">
                          {items.length > 0 ? (
                            <div className="flex flex-col gap-1 max-w-xs">
                              {items.slice(0, 2).map((it) => (
                                <span key={it.id || it.product_sku} className="text-xs text-[#E5DBD6] truncate">
                                  • {it.product_name} <span className="font-mono text-[#8E9A8B]">(x{it.quantity})</span>
                                </span>
                              ))}
                              {items.length > 2 && (
                                <span className="text-[10px] text-[#CBB67B] font-semibold">
                                  +{items.length - 2} pieza(s) más
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8E9A8B] italic">Sin detalle registrado</span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-mono font-bold text-[#CBB67B]">
                              {formatPrice(o.total_cents)}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">
                              {o.payment_method || "Tarjeta"}
                            </span>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block text-[10px] uppercase tracking-widest px-3 py-1 font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {rawPhone && (
                              <a
                                href={`https://wa.me/${rawPhone}?text=${waMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors"
                                title="Contactar por WhatsApp"
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}
                            <Link
                              href={`/admin/pedidos/${o.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] transition-colors text-[11px] uppercase tracking-widest font-bold"
                            >
                              <span>Ver</span>
                              <ArrowRight size={11} />
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
