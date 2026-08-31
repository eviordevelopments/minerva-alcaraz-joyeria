"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/supabase";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total_cents: number;
  placed_at: string;
  shipping_state: string;
  shipping_country: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "bg-yellow-900/30 border-yellow-500/30 text-yellow-500";
    case "paid": return "bg-green-900/30 border-green-500/30 text-green-500";
    case "processing": return "bg-blue-900/30 border-blue-500/30 text-blue-400";
    case "shipped": return "bg-[#CBB67B]/20 border-[#CBB67B]/40 text-[#CBB67B]";
    case "delivered": return "bg-emerald-900/30 border-emerald-500/30 text-emerald-400";
    case "cancelled": return "bg-red-900/30 border-red-500/30 text-red-500";
    case "refunded": return "bg-gray-800 border-gray-600 text-gray-400";
    default: return "bg-gray-800 border-gray-600 text-gray-400";
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
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
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const s = searchTerm.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(s) ||
      o.profiles?.full_name?.toLowerCase().includes(s) ||
      o.profiles?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Logística y Envíos
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Gestión de Pedidos
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar por orden, nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1F271D] border border-[#CBB67B]/30 pl-10 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-56 rounded-none"
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
            <p className="text-[10px] font-bold uppercase tracking-wider">Error al cargar pedidos</p>
            <p className="text-[9px] opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#1F271D] border border-[#CBB67B]/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-[#1F271D] border border-[#CBB67B]/20 overflow-x-auto text-left">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/30 text-[#8E9A8B] text-[9px] uppercase tracking-widest">
                <th className="py-4 px-6 text-left font-bold">Orden</th>
                <th className="py-4 px-6 text-left font-bold">Cliente CRM</th>
                <th className="py-4 px-6 text-left font-bold">Ubicación</th>
                <th className="py-4 px-6 text-right font-bold">Total</th>
                <th className="py-4 px-6 text-center font-bold">Status</th>
                <th className="py-4 px-6 text-center font-bold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBB67B]/10 text-xs">
              <AnimatePresence mode="popLayout">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="hover:bg-[#2C3729]/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-[#E5DBD6] tracking-wider">
                            {o.order_number}
                          </span>
                          <span className="text-[9px] text-[#8E9A8B]">
                            {formatDate(o.placed_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#E5DBD6] tracking-wide">
                            {o.profiles?.full_name || "Sin Nombre"}
                          </span>
                          <span className="text-[10px] text-[#CBB67B] font-mono">
                            {o.profiles?.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[10px] text-[#8E9A8B] uppercase tracking-wider">
                        {o.shipping_state || "No def."} {o.shipping_country ? `(${o.shipping_country})` : ""}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-bold text-[#CBB67B]">
                            {formatPrice(o.total_cents)}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">
                            {o.payment_method || "No def."}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block text-[8px] uppercase tracking-widest px-3 py-1 font-bold border ${getStatusColor(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/admin/pedidos/${o.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D] transition-colors text-[9px] uppercase tracking-widest font-bold"
                        >
                          Ver Pedido <ArrowRight size={12} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#8E9A8B]">
                      <div className="flex flex-col items-center gap-3">
                        <ShoppingBag size={20} className="text-[#CBB67B]/30" />
                        <span className="text-[9px] uppercase tracking-widest italic">
                          {orders.length === 0
                            ? "Aún no hay pedidos registrados"
                            : "Ningún pedido coincide con la búsqueda"}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
