"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  circleMembers: number;
  newsletterSubs: number;
  openRequests: number;
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

export default function AdminDashboard() {
  const [period, setPeriod] = useState("Mensual");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setStats(json.stats);
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

  const metricCards = stats
    ? [
        {
          title: "Productos en Catálogo",
          value: stats.totalProducts.toLocaleString("es-MX"),
          icon: Package,
          description: "Piezas activas en tienda",
          highlight: "#CBB67B",
        },
        {
          title: "Usuarios Registrados",
          value: stats.totalUsers.toLocaleString("es-MX"),
          icon: Users,
          description: `${stats.circleMembers} miembros The Circle`,
          highlight: "#CBB67B",
        },
        {
          title: "Suscriptores Newsletter",
          value: stats.newsletterSubs.toLocaleString("es-MX"),
          icon: Mail,
          description: "Confirmados y activos",
          highlight: "#8E9A8B",
        },
        {
          title: "Concierge Activos",
          value: stats.openRequests.toLocaleString("es-MX"),
          icon: Sparkles,
          description: "Pedidos en proceso",
          highlight: "#CBB67B",
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Métricas Reales · Supabase Live
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Dashboard Global
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#1F271D] border border-[#CBB67B]/30 p-1">
            {["Diario", "Semanal", "Mensual", "Anual"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[9px] uppercase tracking-widest px-4 py-2 transition-all ${
                  period === p
                    ? "bg-[#CBB67B] text-[#1F271D] font-bold"
                    : "text-[#8E9A8B] hover:text-[#E5DBD6]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Refresh */}
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

      {/* Error banner */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Error al cargar datos</p>
            <p className="text-[9px] opacity-80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* METRIC CARDS */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1F271D] border border-[#CBB67B]/10 p-6 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 hover:border-[#CBB67B]/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">
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
                <div className="border-t border-[#CBB67B]/10 mt-4 pt-4 text-[9px] uppercase tracking-widest text-[#8E9A8B]">
                  {card.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Circle vs Standard visual */}
        <div className="lg:col-span-8 bg-[#1F271D] border border-[#CBB67B]/15 p-6 sm:p-8">
          <div className="flex flex-col gap-1 border-b border-[#CBB67B]/10 pb-4 mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[#CBB67B]">
              Composición del Directorio
            </span>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#E5DBD6]">
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
                  count: stats.totalUsers - stats.circleMembers,
                  total: stats.totalUsers,
                  color: "bg-[#8E9A8B]/40",
                },
                {
                  label: "Suscriptores Newsletter",
                  count: stats.newsletterSubs,
                  total: Math.max(stats.newsletterSubs, stats.totalUsers),
                  color: "bg-[#4E6B4A]/60",
                },
              ].map((item) => {
                const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#8E9A8B]">
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
                <p className="text-[10px] text-[#8E9A8B] leading-relaxed text-left">
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
            <span className="text-[10px] uppercase tracking-wider text-[#CBB67B]">
              Canal de Interacciones
            </span>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mt-1 text-[#E5DBD6]">
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
                <span className="text-[9px] uppercase tracking-widest">
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
                    <span className="text-[10px] font-semibold text-[#E5DBD6] tracking-wide flex items-center gap-1.5">
                      {act.isCircle && <ShieldCheck size={10} className="text-[#CBB67B]" />}
                      {act.user}
                    </span>
                    <span className="text-[8px] text-[#8E9A8B] font-mono">
                      {formatRelativeTime(act.joinedAt)}
                    </span>
                  </div>
                  <p className="text-[9px] text-[#8E9A8B] tracking-wider">
                    {act.action}
                  </p>
                  <p className="text-[8px] text-[#CBB67B]/60 font-mono truncate">
                    {act.email}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={loadData}
            className="mt-4 w-full py-3.5 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[9px] uppercase tracking-widest font-semibold transition-colors bg-[#2C3729] flex items-center justify-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B]"
          >
            <span>Actualizar Actividad</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
