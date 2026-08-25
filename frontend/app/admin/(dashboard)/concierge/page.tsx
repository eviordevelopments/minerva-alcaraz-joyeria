"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  X,
  SendHorizonal,
} from "lucide-react";

interface ConciergeOrder {
  id: string;
  request_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: string;
  request_type: string | null;
  description: string;
  desired_material: string | null;
  desired_stone: string | null;
  desired_size: string | null;
  engraving_text: string | null;
  occasion: string | null;
  budget_cents: number | null;
  timeline_weeks: number | null;
  minerva_notes: string | null;
  quoted_price_cents: number | null;
  estimated_ready_at: string | null;
  communication_log: { role: string; message: string; timestamp: string }[];
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = [
  "pending_review",
  "in_design",
  "quoted",
  "approved",
  "in_production",
  "ready",
  "delivered",
  "cancelled",
];

const STATUS_LABELS: Record<string, string> = {
  pending_review: "Recibido",
  in_design: "En Diseño",
  quoted: "Cotizado",
  approved: "Aprobado",
  in_production: "En Producción",
  ready: "Listo para Entrega",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function getStatusIcon(status: string) {
  switch (status) {
    case "pending_review": return <Clock size={14} className="text-[#8E9A8B]" />;
    case "in_design": return <Sparkles size={14} className="text-[#CBB67B]" />;
    case "in_production": return <Hammer size={14} className="text-[#CBB67B]" />;
    case "ready": return <Truck size={14} className="text-[#CBB67B]" />;
    case "delivered": return <CheckCircle size={14} className="text-emerald-400" />;
    default: return <Clock size={14} className="text-[#8E9A8B]" />;
  }
}

function formatCurrency(cents: number | null): string {
  if (!cents) return "N/A";
  return `$${(cents / 100).toLocaleString("es-MX")} MXN`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminConcierge() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<ConciergeOrder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLog, setNewLog] = useState("");
  const [isSendingLog, setIsSendingLog] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function loadOrders() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/concierge");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setOrders(json.orders ?? []);
      if (json.orders?.length > 0 && !selectedId) {
        setSelectedId(json.orders[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/concierge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleSendLog() {
    if (!newLog.trim() || !selectedId) return;
    setIsSendingLog(true);
    try {
      const res = await fetch("/api/admin/concierge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, newLogEntry: newLog.trim() }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error);
      // Update local state with new log
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedId
            ? {
                ...o,
                communication_log: [
                  ...o.communication_log,
                  {
                    role: "admin",
                    message: newLog.trim(),
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : o
        )
      );
      setNewLog("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error al enviar nota");
    } finally {
      setIsSendingLog(false);
    }
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.request_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentOrder = orders.find((o) => o.id === selectedId);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Orfebrería de Lujo · Supabase Live
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Concierge &amp; Co-Creación
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar por cliente u orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1F271D] border border-[#CBB67B]/30 pl-10 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-60 rounded-none"
            />
            <Search size={14} className="absolute left-3.5 text-[#8E9A8B]" />
          </div>
          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="w-9 h-9 border border-[#CBB67B]/30 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] transition-all"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Error al cargar órdenes</p>
            <p className="text-[9px] opacity-80">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left: Orders list */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9A8B] font-bold">
            Órdenes Activas ({filteredOrders.length})
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-[#1F271D] border border-[#CBB67B]/10 animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#1F271D] border border-[#CBB67B]/10 p-12 text-center flex flex-col items-center gap-3">
              <Sparkles size={20} className="text-[#CBB67B]/30" />
              <span className="text-[9px] uppercase tracking-widest text-[#8E9A8B]">
                {orders.length === 0
                  ? "Sin órdenes de concierge activas"
                  : "Sin resultados para la búsqueda"}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
                const isSelected = ord.id === selectedId;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedId(ord.id)}
                    className={`border p-5 cursor-pointer transition-all flex flex-col gap-3 ${
                      isSelected
                        ? "bg-[#1F271D] border-[#CBB67B]"
                        : "bg-[#1F271D]/40 border-[#CBB67B]/15 hover:border-[#CBB67B]/40"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-[#CBB67B] font-mono">
                          {ord.request_number}
                        </span>
                        <h4 className="text-sm font-semibold tracking-wide text-[#E5DBD6] mt-0.5">
                          {ord.contact_name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 border border-[#CBB67B]/20 px-2 py-1 bg-[#2C3729]/50">
                        {getStatusIcon(ord.status)}
                        <span className="text-[8px] uppercase tracking-wider text-[#CBB67B]">
                          {STATUS_LABELS[ord.status] ?? ord.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#8E9A8B] leading-relaxed line-clamp-2 italic">
                      "{ord.description}"
                    </p>

                    <div className="border-t border-[#CBB67B]/10 pt-2 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#8E9A8B]">
                      <span>
                        {ord.estimated_ready_at
                          ? `Entrega: ${formatDate(ord.estimated_ready_at)}`
                          : "Sin fecha estimada"}
                      </span>
                      <span className="font-bold text-[#E5DBD6] font-mono">
                        {formatCurrency(ord.quoted_price_cents)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detail panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentOrder ? (
              <motion.div
                key={currentOrder.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8 space-y-6"
              >
                {/* Header */}
                <div className="border-b border-[#CBB67B]/10 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#CBB67B] font-mono">
                      {currentOrder.request_number}
                    </span>
                    <h2 className="text-xl font-bold tracking-wide mt-0.5 text-[#E5DBD6]">
                      {currentOrder.contact_name}
                    </h2>
                    <p className="text-[9px] text-[#8E9A8B] font-mono mt-1">
                      {currentOrder.contact_email}
                      {currentOrder.contact_phone && ` · ${currentOrder.contact_phone}`}
                    </p>
                  </div>

                  {/* Status changer */}
                  <div className="flex items-center gap-2">
                    {isUpdatingStatus && <Loader2 size={12} className="animate-spin text-[#CBB67B]" />}
                    <select
                      value={currentOrder.status}
                      onChange={(e) => handleStatusChange(currentOrder.id, e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-2 text-[9px] uppercase tracking-wider text-[#CBB67B] outline-none focus:border-[#CBB67B]"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold">
                    Descripción del Pedido
                  </span>
                  <p className="text-[11px] text-[#E5DBD6]/80 leading-relaxed font-light">
                    {currentOrder.description}
                  </p>
                </div>

                {/* Specs grid */}
                {(currentOrder.desired_material || currentOrder.desired_stone || currentOrder.desired_size || currentOrder.engraving_text) && (
                  <div className="grid grid-cols-2 gap-3 bg-[#2C3729]/30 border border-[#CBB67B]/10 p-4">
                    {currentOrder.desired_material && (
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Material</span>
                        <p className="text-[10px] text-[#E5DBD6] mt-0.5">{currentOrder.desired_material}</p>
                      </div>
                    )}
                    {currentOrder.desired_stone && (
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Piedra</span>
                        <p className="text-[10px] text-[#E5DBD6] mt-0.5">{currentOrder.desired_stone}</p>
                      </div>
                    )}
                    {currentOrder.desired_size && (
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Talla</span>
                        <p className="text-[10px] text-[#E5DBD6] mt-0.5">{currentOrder.desired_size}</p>
                      </div>
                    )}
                    {currentOrder.engraving_text && (
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Grabado</span>
                        <p className="text-[10px] text-[#E5DBD6] mt-0.5 italic">"{currentOrder.engraving_text}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Communication log */}
                <div className="space-y-3">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
                    Bitácora de Comunicación ({currentOrder.communication_log.length})
                  </span>

                  {currentOrder.communication_log.length === 0 ? (
                    <div className="bg-[#2C3729]/30 border border-[#CBB67B]/10 p-4 text-center text-[#8E9A8B] text-[9px] uppercase tracking-widest">
                      Sin notas registradas aún
                    </div>
                  ) : (
                    <div className="relative pl-5 space-y-4 max-h-48 overflow-y-auto pr-1 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#CBB67B]/20">
                      {currentOrder.communication_log.map((entry, idx) => (
                        <div key={idx} className="relative text-left">
                          <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-[#1F271D] border-2 border-[#CBB67B]" />
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#E5DBD6]">
                              {entry.role === "admin" ? "Atelier" : "Cliente"}
                            </span>
                            <span className="text-[8px] text-[#8E9A8B] font-mono">
                              {new Date(entry.timestamp).toLocaleString("es-MX")}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#8E9A8B] mt-1 leading-relaxed">
                            {entry.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New log entry */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Registrar nueva nota de avance..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendLog()}
                      className="bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-2 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none flex-1 rounded-none"
                    />
                    <button
                      onClick={handleSendLog}
                      disabled={isSendingLog || !newLog.trim()}
                      className="bg-[#CBB67B] hover:bg-[#E4D5A4] disabled:opacity-50 text-[#1F271D] font-bold text-[10px] uppercase tracking-widest px-4 transition-all flex items-center gap-1.5"
                    >
                      {isSendingLog ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <SendHorizonal size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#1F271D] border border-[#CBB67B]/10 p-12 text-center text-[#8E9A8B] flex flex-col items-center justify-center gap-3 h-full min-h-[300px]">
                <Sparkles size={24} className="text-[#CBB67B]/40" />
                <span className="text-xs uppercase tracking-widest">
                  Selecciona una orden para ver el seguimiento
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
