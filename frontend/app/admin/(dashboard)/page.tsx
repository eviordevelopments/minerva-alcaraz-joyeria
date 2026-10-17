"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Sparkles,
  Package,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Mail,
  AlertCircle,
  TrendingUp,
  Clock,
  Search,
  ArrowRight,
  DollarSign,
  Calendar,
  CreditCard,
  BarChart3,
  Eye,
  Globe,
  Smartphone,
  Laptop,
  FileText,
  Download,
  Percent,
  Truck,
  CheckCircle2,
  PieChart
} from "lucide-react";

type PeriodType = "Hoy" | "Ayer" | "Semanal" | "Mensual" | "Trimestral" | "Anual" | "Total";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  circleMembers: number;
  newsletterSubs: number;
  openRequests: number;
  allTimeRevenueCents?: number;
  allTimeOrdersCount?: number;
}

interface ActivityEntry {
  id: string;
  user: string;
  email: string;
  isCircle: boolean;
  tier: string | null;
  joinedAt: string;
  action: string;
}

interface OrderEntry {
  id: string;
  orderNumber: string;
  placedAt: string;
  timeFormatted: string;
  customerName: string;
  customerEmail: string;
  isCircle: boolean;
  circleTier: string | null;
  itemsCount: number;
  itemsSummary: string;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  status: string;
  paymentMethod: string;
}

interface ChartPoint {
  label: string;
  hour?: number;
  dateStr?: string;
  totalCents: number;
  orderCount: number;
}

interface SalesPeriodData {
  label: string;
  subLabel: string;
  totalCents: number;
  orderCount: number;
  paidCount: number;
  averageTicketCents: number;
  orders: OrderEntry[];
  chartData: ChartPoint[];
}

interface PeriodPayload {
  sales: SalesPeriodData;
  usersCount: number;
  newsletterCount: number;
  conciergeCount: number;
  activeDescription: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return { label: "✓ Liquidado", color: "bg-emerald-950/70 border-emerald-500/40 text-emerald-300" };
    case "processing":
      return { label: "🔨 En Taller", color: "bg-blue-950/70 border-blue-500/40 text-blue-300" };
    case "shipped":
      return { label: "📦 En Camino", color: "bg-[#CBB67B]/20 border-[#CBB67B]/50 text-[#CBB67B]" };
    case "delivered":
      return { label: "💎 Entregado", color: "bg-emerald-900/70 border-emerald-400 text-emerald-200 font-bold" };
    case "pending":
      return { label: "⏳ Pendiente", color: "bg-amber-950/70 border-amber-500/40 text-amber-300" };
    case "cancelled":
      return { label: "✖ Cancelado", color: "bg-red-950/70 border-red-500/40 text-red-400" };
    default:
      return { label: status, color: "bg-gray-800 border-gray-600 text-gray-300" };
  }
}

type DashboardView = "resumen" | "visitas" | "finanzas";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("resumen");
  const [period, setPeriod] = useState<PeriodType>("Hoy");
  const [salesMetric, setSalesMetric] = useState<"revenue" | "count">("revenue");
  const [salesSearch, setSalesSearch] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [periodsData, setPeriodsData] = useState<Record<PeriodType, PeriodPayload> | null>(null);
  const [visitorAnalytics, setVisitorAnalytics] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [currentDateMexico, setCurrentDateMexico] = useState("");
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    async function loadProfileName() {
      const match = document.cookie.match(/(^| )erp_profile_id=([^;]+)/);
      if (match) {
        const profileId = match[2];
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.from("erp_profiles").select("name").eq("id", profileId).single();
        if (data) setProfileName(data.name.split(" ")[0]);
      }
    }
    loadProfileName();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setStats(json.stats);
      setPeriodsData(json.periods ?? null);
      setVisitorAnalytics(json.visitorAnalytics ?? null);
      setFinancials(json.financials ?? null);
      setCurrentDateMexico(json.currentDateMexico ?? "");
      setActivity(json.recentActivity ?? []);
      setLastRefresh(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Currently active period data payload
  const currentPeriodPayload: PeriodPayload | null = useMemo(() => {
    if (!periodsData) return null;
    return periodsData[period] ?? periodsData["Hoy"] ?? null;
  }, [periodsData, period]);

  // Active sales data for the selected period
  const activeSales: SalesPeriodData | null = useMemo(() => {
    if (!currentPeriodPayload) return null;
    return currentPeriodPayload.sales;
  }, [currentPeriodPayload]);

  // Filtered orders in the active period
  const filteredSalesOrders = useMemo(() => {
    if (!activeSales) return [];
    const term = salesSearch.toLowerCase().trim();
    if (!term) return activeSales.orders;
    return activeSales.orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerEmail.toLowerCase().includes(term) ||
        o.itemsSummary.toLowerCase().includes(term)
    );
  }, [activeSales, salesSearch]);

  // Dynamic Chart max value
  const chartMax = useMemo(() => {
    if (!activeSales || !activeSales.chartData.length) return 1;
    const values = activeSales.chartData.map((d) =>
      salesMetric === "revenue" ? d.totalCents / 100 : d.orderCount
    );
    const max = Math.max(...values, 0);
    return max > 0 ? max : salesMetric === "revenue" ? 1000 : 5;
  }, [activeSales, salesMetric]);

  // Period-aware KPI Metric Cards
  const metricCards = useMemo(() => {
    if (!currentPeriodPayload || !activeSales || !stats) return [];

    return [
      {
        title: `Ventas (${period})`,
        value: formatCurrency(activeSales.totalCents),
        icon: DollarSign,
        description: `${activeSales.orderCount} orden${activeSales.orderCount === 1 ? "" : "es"} · ${currentPeriodPayload.activeDescription}`,
        highlight: "#CBB67B",
      },
      {
        title: `Nuevos Usuarios (${period})`,
        value: currentPeriodPayload.usersCount.toLocaleString("es-MX"),
        icon: Users,
        description: `${currentPeriodPayload.activeDescription} (${stats.totalUsers} en total)`,
        highlight: "#CBB67B",
      },
      {
        title: `Suscripciones (${period})`,
        value: currentPeriodPayload.newsletterCount.toLocaleString("es-MX"),
        icon: Mail,
        description: `${currentPeriodPayload.activeDescription} (${stats.newsletterSubs} activas)`,
        highlight: "#8E9A8B",
      },
      {
        title: `Concierge (${period})`,
        value: currentPeriodPayload.conciergeCount.toLocaleString("es-MX"),
        icon: Sparkles,
        description: `${currentPeriodPayload.activeDescription} (${stats.openRequests} abiertos)`,
        highlight: "#CBB67B",
      },
    ];
  }, [currentPeriodPayload, activeSales, stats, period]);

  const handleExportFinancialsCSV = () => {
    if (!financials) return;
    const gross = (financials.grossRevenueCents / 100).toFixed(2);
    const net = (financials.netMerchandiseCents / 100).toFixed(2);
    const iva = (financials.ivaTaxCents / 100).toFixed(2);
    const shipping = (financials.shippingCollectedCents / 100).toFixed(2);
    const discount = (financials.discountTotalCents / 100).toFixed(2);
    const aov = (financials.averageOrderValueCents / 100).toFixed(2);

    const rows = [
      ["CONCEPTO CONTABLE", "MONTO MXN", "NOTAS FISCALES"],
      ["Ingresos Brutos Liquidados", `$${gross}`, "Total procesado con éxito"],
      ["Ingreso Neto Mercancía (Base Gravable)", `$${net}`, "Importe sin impuestos"],
      ["IVA Retenido (16%)", `$${iva}`, "Tasa general SAT México (incluida en PVP)"],
      ["Ingresos por Envíos Asegurados", `$${shipping}`, "Cargos de paquetería"],
      ["Descuentos Otorgados (The Circle)", `-$${discount}`, "Bonificaciones y cortesías"],
      ["Ticket Promedio (AOV)", `$${aov}`, "Por orden liquidada"],
      ["Órdenes Liquidadas", `${financials.liquidatedCount}`, "Transacciones exitosas"],
      ["Carritos Dejados / Pendientes", `${financials.abandonedCartCount}`, `$${(financials.abandonedCartTotalCents / 100).toFixed(2)} MXN en riesgo`],
    ];

    const csvContent = "\uFEFF" + rows.map((e) => e.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Minerva_Alcaraz_Estados_Financieros_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-12">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-[#CBB67B]">
            Métricas Reales · Supabase Live
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Dashboard
          </h1>
          {profileName && (
            <p className="text-base mt-1 text-[#8E9A8B]">Hola, {profileName}</p>
          )}
        </div>

        {/* Global Period Selector: Hoy, Ayer, Semanal, Mensual, Trimestral, Anual, Total */}
        <div className="flex flex-wrap items-center gap-3">
          {currentView === "resumen" && (
            <div className="flex flex-wrap items-center gap-1 bg-[#1F271D] border border-[#CBB67B]/30 p-1">
              {(["Hoy", "Ayer", "Semanal", "Mensual", "Trimestral", "Anual", "Total"] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-[11px] uppercase tracking-widest px-3 sm:px-4 py-2 transition-all font-semibold ${
                    period === p
                      ? "bg-[#CBB67B] text-[#1F271D] font-bold shadow-md"
                      : "text-[#8E9A8B] hover:text-[#E5DBD6]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={loadData}
            disabled={isLoading}
            title="Actualizar datos"
            className="w-9 h-9 border border-[#CBB67B]/30 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] transition-all"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── TOP VIEW TABS: RESUMEN, VISITAS EN VIVO, ESTADOS FINANCIEROS ──── */}
      <div className="flex border-b border-[#CBB67B]/20 overflow-x-auto gap-2">
        <button
          onClick={() => setCurrentView("resumen")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold border-b-2 transition-all flex-shrink-0 ${
            currentView === "resumen"
              ? "border-[#CBB67B] text-[#CBB67B] bg-[#1F271D]"
              : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
          }`}
        >
          <BarChart3 size={16} />
          <span>Resumen &amp; Ventas</span>
        </button>

        <button
          onClick={() => setCurrentView("visitas")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold border-b-2 transition-all flex-shrink-0 ${
            currentView === "visitas"
              ? "border-[#CBB67B] text-[#CBB67B] bg-[#1F271D]"
              : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
          }`}
        >
          <Eye size={16} />
          <span>Tráfico y Visitas en Vivo</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#CBB67B]/20 text-[#CBB67B] border border-[#CBB67B]/40">
            {visitorAnalytics?.totalVisitors ?? 0}
          </span>
        </button>

        <button
          onClick={() => setCurrentView("finanzas")}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-semibold border-b-2 transition-all flex-shrink-0 ${
            currentView === "finanzas"
              ? "border-[#CBB67B] text-[#CBB67B] bg-[#1F271D]"
              : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
          }`}
        >
          <FileText size={16} />
          <span>Estados Financieros (P&amp;L)</span>
        </button>
      </div>

      {/* ── ERROR BANNER ────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Error al cargar datos</p>
            <p className="text-[11px] opacity-80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── VIEW: RESUMEN & VENTAS ───────────────────────────────────────── */}
      {currentView === "resumen" && (
        <>
          {/* ── DYNAMIC PERIOD METRIC CARDS ─────────────────────────────────── */}
          {isLoading || !currentPeriodPayload ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1F271D] border border-[#CBB67B]/10 p-6 h-32"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title + period}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 hover:border-[#CBB67B]/40 transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs uppercase tracking-wider text-[#8E9A8B]">
                      {card.title}
                    </span>
                    <span className="text-2xl font-medium tracking-wider mt-2 font-mono text-[#E5DBD6]">
                      {card.value}
                    </span>
                  </div>
                  <div className="w-10 h-10 border border-[#CBB67B]/20 flex items-center justify-center bg-[#2C3729]/50">
                    <Icon size={16} className="text-[#CBB67B]" />
                  </div>
                </div>
                <div className="border-t border-[#CBB67B]/10 mt-4 pt-4 text-[11px] uppercase tracking-widest text-[#8E9A8B]">
                  {card.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── VENTAS DEL PERIODO (TABLA & GRÁFICA) ─────────────────────────── */}
      <section className="bg-[#1F271D] border border-[#CBB67B]/25 p-6 sm:p-8 space-y-8 shadow-2xl relative">
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#CBB67B]/15 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
                Métricas Comerciales · {period}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display-erp text-[#E5DBD6] font-bold mt-1">
              {period === "Hoy"
                ? "Ventas del Día (Hoy · En Directo)"
                : period === "Ayer"
                ? "Ventas de Ayer (Jornada Anterior)"
                : period === "Semanal"
                ? "Ventas de la Semana (Últimos 7 Días)"
                : period === "Mensual"
                ? "Ventas del Mes (Últimos 30 Días)"
                : period === "Trimestral"
                ? "Ventas del Trimestre (Últimos 90 Días)"
                : period === "Anual"
                ? "Ventas del Año (Últimos 12 Meses)"
                : "Ventas Totales (Histórico Completo)"}
            </h2>
            <p className="text-xs text-[#8E9A8B] mt-1 flex items-center gap-2">
              <Clock size={12} className="text-[#CBB67B]" />
              Zona Horaria México Centro (CDMX) ·{" "}
              <span className="text-[#E5DBD6] font-mono">
                {currentDateMexico || "Hoy"}
              </span>
              {activeSales?.subLabel && (
                <span className="text-[#CBB67B] ml-2 font-mono">
                  · {activeSales.subLabel}
                </span>
              )}
            </p>
          </div>

          {/* Unified active period indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#8E9A8B]">
              Periodo Seleccionado:
            </span>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-[#2C3729] border border-[#CBB67B]/40 text-[#CBB67B] font-bold">
              {period}
            </span>
          </div>
        </div>

        {/* ── KEY PERFORMANCE METRIC CARDS ──────────────────────────────── */}
        {isLoading || !activeSales ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#2C3729]/40 border border-[#CBB67B]/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Vendido */}
            <motion.div
              key={"total-" + period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2C3729]/50 border border-[#CBB67B]/20 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
                  Ventas ({activeSales.label})
                </span>
                <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#1F271D] text-[#CBB67B]">
                  <DollarSign size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-[#CBB67B] tracking-tight">
                  {formatCurrency(activeSales.totalCents)}
                </p>
                <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
                  Recaudación procesada
                </p>
              </div>
            </motion.div>

            {/* Órdenes */}
            <motion.div
              key={"orders-" + period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[#2C3729]/50 border border-[#CBB67B]/20 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
                  Órdenes Registradas
                </span>
                <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#1F271D] text-[#CBB67B]">
                  <ShoppingBag size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-[#E5DBD6] tracking-tight">
                  {activeSales.orderCount}{" "}
                  <span className="text-sm font-normal text-[#8E9A8B]">pedidos</span>
                </p>
                <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
                  {activeSales.paidCount} liquidados exitosamente
                </p>
              </div>
            </motion.div>

            {/* Ticket Promedio */}
            <motion.div
              key={"ticket-" + period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2C3729]/50 border border-[#CBB67B]/20 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
                  Ticket Promedio
                </span>
                <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#1F271D] text-[#CBB67B]">
                  <TrendingUp size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-[#E5DBD6] tracking-tight">
                  {formatCurrency(activeSales.averageTicketCents)}
                </p>
                <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
                  Valor medio por transacción
                </p>
              </div>
            </motion.div>

            {/* Eficiencia de Cobro */}
            <motion.div
              key={"efficiency-" + period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#2C3729]/50 border border-[#CBB67B]/20 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
                  Estado de Cobros
                </span>
                <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#1F271D] text-[#CBB67B]">
                  <CreditCard size={14} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight">
                  {activeSales.orderCount > 0
                    ? `${Math.round((activeSales.paidCount / activeSales.orderCount) * 100)}%`
                    : "100%"}
                </p>
                <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
                  Tasa de liquidación Stripe
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── GRAFICA INTERACTIVA DE VENTAS ──────────────────────────────── */}
        <div className="bg-[#181F16] border border-[#CBB67B]/20 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBB67B]/10 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#CBB67B]">
                Comportamiento Temporal
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E5DBD6] mt-0.5 flex items-center gap-2">
                <BarChart3 size={14} className="text-[#CBB67B]" />
                {period === "Hoy"
                  ? "Curva Horaria · Hoy en Directo (00:00 - 23:00 hrs)"
                  : period === "Ayer"
                  ? "Curva Horaria · Ayer Jornada Completa (00:00 - 23:00 hrs)"
                  : period === "Semanal"
                  ? "Evolución Diaria (Últimos 7 Días)"
                  : period === "Mensual"
                  ? "Evolución Diaria (Últimos 30 Días)"
                  : period === "Trimestral"
                  ? "Evolución Semanal (Últimos 90 Días)"
                  : period === "Anual"
                  ? "Evolución Mensual (Últimos 12 Meses)"
                  : "Evolución Histórica Total"}
              </h3>
            </div>

            {/* Metric Switcher: Revenue vs Count */}
            <div className="flex items-center gap-1 bg-[#1F271D] border border-[#CBB67B]/20 p-1">
              <button
                type="button"
                onClick={() => setSalesMetric("revenue")}
                className={`text-[10px] uppercase tracking-widest px-3 py-1 font-semibold transition-all ${
                  salesMetric === "revenue"
                    ? "bg-[#CBB67B] text-[#1F271D] font-bold"
                    : "text-[#8E9A8B] hover:text-[#E5DBD6]"
                }`}
              >
                Monto ($ MXN)
              </button>
              <button
                type="button"
                onClick={() => setSalesMetric("count")}
                className={`text-[10px] uppercase tracking-widest px-3 py-1 font-semibold transition-all ${
                  salesMetric === "count"
                    ? "bg-[#CBB67B] text-[#1F271D] font-bold"
                    : "text-[#8E9A8B] hover:text-[#E5DBD6]"
                }`}
              >
                Pedidos (#)
              </button>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip Float */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-0 right-4 bg-[#2C3729] border border-[#CBB67B] p-2.5 shadow-2xl z-20 text-left pointer-events-none"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#CBB67B] font-bold">
                    {hoveredPoint.label}
                  </p>
                  <p className="text-sm font-mono font-bold text-[#E5DBD6] mt-0.5">
                    {formatCurrency(hoveredPoint.totalCents)}
                  </p>
                  <p className="text-[10px] text-[#8E9A8B]">
                    {hoveredPoint.orderCount} pedido{hoveredPoint.orderCount === 1 ? "" : "s"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bars */}
            {isLoading || !activeSales ? (
              <div className="h-44 flex items-end justify-between gap-1 animate-pulse">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 bg-[#2C3729]/30 h-12" />
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 pt-6">
                {activeSales.chartData.map((pt, idx) => {
                  const val = salesMetric === "revenue" ? pt.totalCents / 100 : pt.orderCount;
                  const heightPct = chartMax > 0 ? Math.min(100, Math.max(4, Math.round((val / chartMax) * 100))) : 4;
                  const hasSales = val > 0;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                    >
                      {/* Bar Fill */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.45, delay: idx * 0.015 }}
                        className={`w-full transition-all rounded-none ${
                          hasSales
                            ? "bg-gradient-to-t from-[#CBB67B] via-[#E5DBD6] to-[#CBB67B] group-hover:brightness-125 shadow-[0_0_12px_rgba(203,182,123,0.35)]"
                            : "bg-[#2C3729]/40 group-hover:bg-[#CBB67B]/25"
                        }`}
                      />

                      {/* X Label */}
                      <span className="text-[9px] font-mono text-[#8E9A8B] mt-2 block truncate">
                        {["Hoy", "Ayer"].includes(period)
                          ? idx % 3 === 0
                            ? pt.label.slice(0, 2)
                            : ""
                          : period === "Semanal"
                          ? pt.label
                          : ["Mensual", "Trimestral"].includes(period)
                          ? idx % 4 === 0
                            ? pt.label
                            : ""
                          : pt.label.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-[#8E9A8B] uppercase tracking-widest border-t border-[#CBB67B]/10 pt-3 mt-1">
              <span>
                {["Hoy", "Ayer"].includes(period)
                  ? "00:00 hrs"
                  : period === "Semanal"
                  ? "Hace 7 días"
                  : period === "Mensual"
                  ? "Hace 30 días"
                  : period === "Trimestral"
                  ? "Hace 90 días"
                  : period === "Anual"
                  ? "Hace 12 meses"
                  : "Histórico"}
              </span>
              <span className="text-[#CBB67B]">
                {salesMetric === "revenue" ? "Escala: Monto Recaudado ($ MXN)" : "Escala: Volumen de Órdenes"}
              </span>
              <span>
                {["Hoy", "Ayer"].includes(period)
                  ? "23:59 hrs"
                  : "Hoy / Periodo Actual"}
              </span>
            </div>
          </div>
        </div>

        {/* ── TABLA DE VENTAS DEL PERIODO ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
                Detalle Transaccional
              </span>
              <h3 className="text-base font-semibold text-[#E5DBD6] tracking-wide mt-0.5">
                Registro de Órdenes · {activeSales?.label || period} ({filteredSalesOrders.length} transacciones)
              </h3>
            </div>

            {/* Filter Search */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar orden, cliente, pieza..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                className="bg-[#2C3729] border border-[#CBB67B]/30 pl-9 pr-3 py-2 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-64"
              />
              <Search size={13} className="absolute left-3 text-[#8E9A8B]" />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#181F16] border border-[#CBB67B]/20 overflow-x-auto text-left">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/50 text-[#8E9A8B] text-[11px] uppercase tracking-widest font-bold">
                  <th className="py-3.5 px-5 text-left">Orden</th>
                  <th className="py-3.5 px-5 text-left">Hora / Fecha</th>
                  <th className="py-3.5 px-5 text-left">Cliente</th>
                  <th className="py-3.5 px-5 text-left">Piezas Adquiridas</th>
                  <th className="py-3.5 px-5 text-right">Total</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBB67B]/10 text-sm">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="py-6 px-5">
                          <div className="h-6 bg-[#2C3729]/30 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : filteredSalesOrders.length > 0 ? (
                    filteredSalesOrders.map((ord) => {
                      const badge = getOrderStatusBadge(ord.status);
                      return (
                        <motion.tr
                          key={ord.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-[#2C3729]/40 transition-colors"
                        >
                          {/* Order Number */}
                          <td className="py-3.5 px-5 font-mono font-bold text-[#E5DBD6]">
                            <Link
                              href={`/admin/pedidos/${ord.id}`}
                              className="hover:text-[#CBB67B] transition-colors"
                            >
                              {ord.orderNumber}
                            </Link>
                          </td>

                          {/* Time */}
                          <td className="py-3.5 px-5">
                            <div className="flex flex-col text-left">
                              <span className="font-mono text-xs text-[#E5DBD6]">
                                {ord.timeFormatted} hrs
                              </span>
                              <span className="text-[10px] text-[#8E9A8B]">
                                {formatRelativeTime(ord.placedAt)}
                              </span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-5">
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-xs text-[#E5DBD6] flex items-center gap-1.5">
                                {ord.isCircle && (
                                  <span title="The Circle">
                                    <ShieldCheck size={11} className="text-[#CBB67B]" />
                                  </span>
                                )}
                                {ord.customerName}
                              </span>
                              <span className="text-[10px] font-mono text-[#CBB67B]/70 truncate max-w-[200px]">
                                {ord.customerEmail}
                              </span>
                            </div>
                          </td>

                          {/* Pieces */}
                          <td className="py-3.5 px-5 text-xs text-[#8E9A8B]">
                            <div className="flex flex-col text-left max-w-[220px]">
                              <span className="text-[#E5DBD6] font-medium truncate">
                                {ord.itemsSummary}
                              </span>
                              <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">
                                {ord.itemsCount} pieza{ord.itemsCount === 1 ? "" : "s"}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-5 text-right font-mono font-bold text-[#CBB67B]">
                            {formatCurrency(ord.totalCents)}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-5 text-center">
                            <span
                              className={`inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold border ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-5 text-center">
                            <Link
                              href={`/admin/pedidos/${ord.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] transition-all text-[10px] uppercase tracking-widest font-bold"
                            >
                              <span>Ver</span>
                              <ArrowRight size={10} />
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8E9A8B]">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <ShoppingBag size={24} className="text-[#CBB67B]/40" />
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest font-bold text-[#E5DBD6]">
                              {salesSearch
                                ? "Ningún pedido coincide con la búsqueda"
                                : `Sin ventas registradas en el periodo (${activeSales?.label || period})`}
                            </p>
                            <p className="text-[11px] text-[#8E9A8B] max-w-md mx-auto">
                              {salesSearch
                                ? "Verifica el número de orden o correo del cliente."
                                : "Las compras procesadas por Stripe en la boutique aparecerán aquí inmediatamente con su flujo temporal."}
                            </p>
                          </div>
                          {period === "Hoy" && (
                            <div className="flex gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setPeriod("Ayer")}
                                className="px-3 py-1.5 border border-[#CBB67B]/40 text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] text-[10px] uppercase tracking-widest font-bold transition-all"
                              >
                                Ver Ventas de Ayer
                              </button>
                              <button
                                type="button"
                                onClick={() => setPeriod("Semanal")}
                                className="px-3 py-1.5 border border-[#CBB67B]/20 text-[#8E9A8B] hover:text-[#E5DBD6] text-[10px] uppercase tracking-widest font-semibold transition-all"
                              >
                                Ver Vista Semanal
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DIRECTORY COMPOSITION & RECENT ACTIVITY ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Circle vs Standard visual */}
        <div className="lg:col-span-8 bg-[#1F271D] border border-[#CBB67B]/15 p-6 sm:p-8">
          <div className="flex flex-col gap-1 border-b border-[#CBB67B]/10 pb-4 mb-6">
            <span className="text-xs uppercase tracking-wider text-[#CBB67B]">
              Composición del Directorio
            </span>
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-[#E5DBD6]">
              Usuarios · The Circle vs Registrados
            </h3>
          </div>

          {stats && (
            <div className="space-y-6">
              {[
                {
                  label: "Miembros The Circle",
                  count: stats.circleMembers,
                  total: stats.totalUsers,
                  color: "bg-[#CBB67B]",
                },
                {
                  label: "Usuarios Estándar",
                  count: Math.max(0, stats.totalUsers - stats.circleMembers),
                  total: stats.totalUsers,
                  color: "bg-[#8E9A8B]/40",
                },
                {
                  label: "Suscriptores Newsletter",
                  count: stats.newsletterSubs,
                  total: Math.max(stats.newsletterSubs, stats.totalUsers, 1),
                  color: "bg-[#4E6B4A]/60",
                },
              ].map((item) => {
                const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-[#8E9A8B]">
                      <span>{item.label}</span>
                      <span className="font-mono text-[#E5DBD6] font-bold">
                        {item.count.toLocaleString("es-MX")} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[#2C3729] w-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 bg-[#2C3729]/55 border border-[#CBB67B]/10 p-3 flex items-start gap-2">
                <AlertCircle size={14} className="text-[#CBB67B] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#8E9A8B] leading-relaxed text-left">
                  Datos en tiempo real desde Supabase. Actualizado:{" "}
                  <span className="text-[#E5DBD6]">
                    {lastRefresh.toLocaleTimeString("es-MX")}
                  </span>
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-[#2C3729]/50 rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-[#1F271D] border border-[#CBB67B]/15 p-6 flex flex-col">
          <div className="border-b border-[#CBB67B]/10 pb-4 mb-4">
            <span className="text-xs uppercase tracking-wider text-[#CBB67B]">
              Canal de Interacciones
            </span>
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium mt-1 text-[#E5DBD6]">
              Actividad Reciente · Live
            </h3>
          </div>

          <div className="flex-1 space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[#2C3729]/40 animate-pulse" />
              ))
            ) : activity.length === 0 ? (
              <div className="text-center text-[#8E9A8B] py-8 flex flex-col items-center gap-3">
                <Sparkles size={20} className="text-[#CBB67B]/30" />
                <span className="text-[11px] uppercase tracking-widest">
                  Sin actividad reciente
                </span>
              </div>
            ) : (
              activity.map((act) => (
                <div
                  key={act.id}
                  className="text-left border-l-2 border-[#CBB67B] pl-3 py-1 space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#E5DBD6] tracking-wide flex items-center gap-1.5">
                      {act.isCircle && (
                        <span title="The Circle">
                          <ShieldCheck size={10} className="text-[#CBB67B]" />
                        </span>
                      )}
                      {act.user}
                    </span>
                    <span className="text-[10px] text-[#8E9A8B] font-mono">
                      {formatRelativeTime(act.joinedAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E9A8B] tracking-wider">
                    {act.action}
                  </p>
                  <p className="text-[10px] text-[#CBB67B]/60 font-mono truncate">
                    {act.email}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={loadData}
            className="mt-4 w-full py-3.5 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[11px] uppercase tracking-widest font-semibold transition-colors bg-[#2C3729] flex items-center justify-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B]"
          >
            <span>Actualizar Actividad</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </>
  )}

  {/* ── VIEW: TRÁFICO Y VISITAS EN VIVO ─────────────────────────────── */}
  {currentView === "visitas" && (
    <section className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
              Telemetría de Tráfico · Live
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display-erp text-[#E5DBD6] font-bold mt-1">
            Visitas &amp; Audiencia en Directo
          </h2>
          <p className="text-xs text-[#8E9A8B] mt-1">
            Monitoreo en tiempo real de visitantes en la boutique web Minerva Alcaraz Joyería.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#CBB67B]/40 text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] text-xs uppercase tracking-widest font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          <span>Refrescar Telemetría</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Visitantes Únicos Totales
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <Users size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-mono font-bold text-[#CBB67B]">
              {visitorAnalytics?.totalVisitors?.toLocaleString("es-MX") ?? 0}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Dispositivos únicos detectados
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Impresiones de Página (Pageviews)
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <Eye size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-mono font-bold text-[#E5DBD6]">
              {visitorAnalytics?.totalPageviews?.toLocaleString("es-MX") ?? 0}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Páginas visualizadas
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Dispositivos Móviles
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <Smartphone size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-mono font-bold text-emerald-400">
              {visitorAnalytics?.devices?.mobile ?? 0}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              iPhone &amp; Android
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Dispositivos Desktop
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <Laptop size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-mono font-bold text-[#E5DBD6]">
              {visitorAnalytics?.devices?.desktop ?? 0}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Mac &amp; Windows PCs
            </p>
          </div>
        </div>
      </div>

      {/* Visitor Log Table & Mobile Cards */}
      <div className="bg-[#1F271D] border border-[#CBB67B]/25 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBB67B]/15 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
              Bitácora de Navegación
            </span>
            <h3 className="text-base font-semibold text-[#E5DBD6] tracking-wide mt-0.5">
              Últimas Sesiones y Páginas Consultadas
            </h3>
          </div>
          <span className="text-[11px] text-[#8E9A8B] uppercase tracking-widest">
            Registros recientes: {visitorAnalytics?.recentVisits?.length ?? 0}
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/50 text-[#8E9A8B] text-[11px] uppercase tracking-widest font-bold">
                <th className="py-3 px-4 text-left">Hora / Fecha</th>
                <th className="py-3 px-4 text-left">Página Consultada</th>
                <th className="py-3 px-4 text-left">Dispositivo / Entorno</th>
                <th className="py-3 px-4 text-left">Sesión ID</th>
                <th className="py-3 px-4 text-center">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBB67B]/10 text-xs">
              {visitorAnalytics?.recentVisits?.length > 0 ? (
                visitorAnalytics.recentVisits.map((v: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#2C3729]/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#E5DBD6]">
                      {v.timestamp ? new Date(v.timestamp).toLocaleString("es-MX") : "En vivo"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[#CBB67B] bg-[#2C3729] px-2 py-0.5 border border-[#CBB67B]/30">
                        {v.page || "/"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8E9A8B] flex items-center gap-2">
                      {v.device?.toLowerCase().includes("mobile") || v.device?.toLowerCase().includes("ios") || v.device?.toLowerCase().includes("android") ? (
                        <Smartphone size={13} className="text-emerald-400" />
                      ) : (
                        <Laptop size={13} className="text-[#CBB67B]" />
                      )}
                      <span>{v.device || "Navegador Web"}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#8E9A8B] text-[11px]">
                      {v.sessionId || `session_${idx + 1}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold border ${
                        v.isNew !== false
                          ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                          : "bg-blue-950/70 border-blue-500/40 text-blue-300"
                      }`}>
                        {v.isNew !== false ? "Nuevo" : "Recurrente"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#8E9A8B]">
                    <p className="text-xs uppercase tracking-widest font-bold text-[#E5DBD6]">
                      Registrando visitas en directo...
                    </p>
                    <p className="text-[11px] text-[#8E9A8B] mt-1">
                      Cada cliente que navega en la boutique queda reflejado en esta telemetría.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {visitorAnalytics?.recentVisits?.length > 0 ? (
            visitorAnalytics.recentVisits.map((v: any, idx: number) => (
              <div key={idx} className="bg-[#2C3729]/50 border border-[#CBB67B]/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#CBB67B] bg-[#1F271D] px-2 py-0.5 border border-[#CBB67B]/30">
                    {v.page || "/"}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold border ${
                    v.isNew !== false
                      ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                      : "bg-blue-950/70 border-blue-500/40 text-blue-300"
                  }`}>
                    {v.isNew !== false ? "Nuevo" : "Recurrente"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8E9A8B]">
                  <span className="flex items-center gap-1.5">
                    {v.device?.toLowerCase().includes("mobile") || v.device?.toLowerCase().includes("ios") || v.device?.toLowerCase().includes("android") ? (
                      <Smartphone size={12} className="text-emerald-400" />
                    ) : (
                      <Laptop size={12} className="text-[#CBB67B]" />
                    )}
                    {v.device || "Navegador Web"}
                  </span>
                  <span className="font-mono">
                    {v.timestamp ? new Date(v.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "En vivo"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#2C3729]/40 border border-[#CBB67B]/15 p-6 text-center text-xs text-[#8E9A8B]">
              Sin registros recientes de visitas
            </div>
          )}
        </div>
      </div>
    </section>
  )}

  {/* ── VIEW: ESTADOS FINANCIEROS (P&L) ─────────────────────────────── */}
  {currentView === "finanzas" && (
    <section className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
            Contabilidad &amp; Cumplimiento SAT México
          </span>
          <h2 className="text-2xl sm:text-3xl font-display-erp text-[#E5DBD6] font-bold mt-1">
            Estados Financieros &amp; P&amp;L
          </h2>
          <p className="text-xs text-[#8E9A8B] mt-1">
            Desglose contable de ventas reales liquidadas, base gravable e IVA 16% trasladado.
          </p>
        </div>

        <button
          onClick={handleExportFinancialsCSV}
          disabled={!financials}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] text-xs uppercase tracking-widest font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Descargar Reporte CSV</span>
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1F271D] border border-[#CBB67B]/25 p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Ingresos Brutos Liquidados
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#CBB67B]">
              {formatCurrency(financials?.grossRevenueCents ?? 0)}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              {financials?.liquidatedCount ?? 0} transacciones pagadas
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Base Gravable (Sin IVA)
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <PieChart size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#E5DBD6]">
              {formatCurrency(financials?.netMerchandiseCents ?? 0)}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Ingreso neto mercancía
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              IVA 16% Trasladado (SAT)
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <Percent size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
              {formatCurrency(financials?.ivaTaxCents ?? 0)}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Impuesto incluido en PVP
            </p>
          </div>
        </div>

        <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8E9A8B]">
              Ticket Promedio (AOV)
            </span>
            <div className="w-8 h-8 border border-[#CBB67B]/30 flex items-center justify-center bg-[#2C3729] text-[#CBB67B]">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
              {formatCurrency(financials?.averageOrderValueCents ?? 0)}
            </p>
            <p className="text-[10px] text-[#8E9A8B] mt-1 uppercase tracking-widest">
              Por transacción liquidada
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Accounting Statement Table */}
      <div className="bg-[#1F271D] border border-[#CBB67B]/25 p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#CBB67B]/15 pb-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-semibold">
            Estado de Resultados Integral (P&amp;L)
          </span>
          <h3 className="text-base font-semibold text-[#E5DBD6] tracking-wide mt-0.5">
            Desglose Analítico de Ingresos y Cargas Impositivas
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/50 text-[#8E9A8B] text-[11px] uppercase tracking-widest font-bold">
                <th className="py-3.5 px-5 text-left">Rubro Contable</th>
                <th className="py-3.5 px-5 text-left">Fundamento / Tratamiento</th>
                <th className="py-3.5 px-5 text-right">Porcentaje</th>
                <th className="py-3.5 px-5 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBB67B]/10 text-sm">
              <tr className="hover:bg-[#2C3729]/30 transition-colors">
                <td className="py-4 px-5 font-bold text-[#E5DBD6] flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Ingresos Brutos Liquidados
                </td>
                <td className="py-4 px-5 text-xs text-[#8E9A8B]">
                  Total facturable efectivamente cobrado mediante pasarela Stripe
                </td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">100.0%</td>
                <td className="py-4 px-5 text-right font-mono font-bold text-[#CBB67B] text-base">
                  {formatCurrency(financials?.grossRevenueCents ?? 0)}
                </td>
              </tr>

              <tr className="hover:bg-[#2C3729]/30 transition-colors">
                <td className="py-4 px-5 font-medium text-[#E5DBD6]">
                  ↳ Base Gravable (Mercancía Neta)
                </td>
                <td className="py-4 px-5 text-xs text-[#8E9A8B]">
                  Subtotal sin impuesto trasladado (PVP / 1.16 según Art. 1 LIVA)
                </td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">86.21%</td>
                <td className="py-4 px-5 text-right font-mono text-[#E5DBD6]">
                  {formatCurrency(financials?.netMerchandiseCents ?? 0)}
                </td>
              </tr>

              <tr className="hover:bg-[#2C3729]/30 transition-colors">
                <td className="py-4 px-5 font-medium text-amber-300">
                  ↳ IVA 16% Retenido para SAT
                </td>
                <td className="py-4 px-5 text-xs text-[#8E9A8B]">
                  Impuesto al Valor Agregado trasladado y reportable a la Secretaría de Hacienda
                </td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">13.79%</td>
                <td className="py-4 px-5 text-right font-mono text-amber-300">
                  {formatCurrency(financials?.ivaTaxCents ?? 0)}
                </td>
              </tr>

              <tr className="hover:bg-[#2C3729]/30 transition-colors">
                <td className="py-4 px-5 font-medium text-[#8E9A8B]">
                  ↳ Fletes y Envíos Asegurados Cobrados
                </td>
                <td className="py-4 px-5 text-xs text-[#8E9A8B]">
                  Cargos de paquetería de alta seguridad en órdenes menores a $3,500 MXN
                </td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">Tarifa Plana</td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">
                  {formatCurrency(financials?.shippingCollectedCents ?? 0)}
                </td>
              </tr>

              <tr className="hover:bg-[#2C3729]/30 transition-colors">
                <td className="py-4 px-5 font-medium text-blue-300">
                  ↳ Descuentos &amp; Beneficios The Circle
                </td>
                <td className="py-4 px-5 text-xs text-[#8E9A8B]">
                  Deducciones y cortesías de membresía aplicadas en checkout
                </td>
                <td className="py-4 px-5 text-right font-mono text-[#8E9A8B]">Bonificación</td>
                <td className="py-4 px-5 text-right font-mono text-blue-300">
                  -{formatCurrency(financials?.discountTotalCents ?? 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Abandoned Cart Exposure Callout */}
        <div className="bg-[#2C3729]/50 border border-amber-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <AlertCircle size={12} />
              Oportunidad de Recuperación de Carritos Dejados
            </span>
            <p className="text-xs text-[#E5DBD6]">
              Existen <strong className="font-mono text-amber-300">{financials?.abandonedCartCount ?? 0} carritos no liquidados</strong> que suman{" "}
              <strong className="font-mono text-[#CBB67B]">{formatCurrency(financials?.abandonedCartTotalCents ?? 0)}</strong> en ventas potenciales.
            </p>
          </div>

          <Link
            href="/admin/pedidos?tab=carritos"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#CBB67B] text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] text-[11px] uppercase tracking-widest font-bold transition-all whitespace-nowrap self-start sm:self-auto"
          >
            <span>Ver Carritos Dejados</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )}
    </div>
  );
}
