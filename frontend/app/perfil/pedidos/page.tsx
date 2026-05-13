"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase, formatPrice } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending:    { label: "Pendiente",    icon: Clock,         color: "text-amber-500 bg-amber-50 border-amber-100" },
  paid:       { label: "Confirmada",   icon: CheckCircle2,  color: "text-green-600 bg-green-50 border-green-100" },
  processing: { label: "En Proceso",   icon: Package,       color: "text-blue-500 bg-blue-50 border-blue-100" },
  shipped:    { label: "Enviado",      icon: Truck,         color: "text-purple-500 bg-purple-50 border-purple-100" },
  delivered:  { label: "Entregado",    icon: CheckCircle2,  color: "text-verde-ebano bg-verde-ebano/5 border-verde-ebano/10" },
  cancelled:  { label: "Cancelado",    icon: XCircle,       color: "text-red-400 bg-red-50 border-red-100" },
};

interface OrderItem {
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price_cents: number;
  collection_name: string | null;
}

interface Order {
  order_id: string;
  order_number: string;
  status: string;
  total_cents: number;
  currency: string;
  placed_at: string;
  tracking_number: string | null;
  carrier: string | null;
  item_count: number;
  items: OrderItem[];
}

export default function PedidosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("v_order_history")
      .select("*")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false });
    setOrders(data || []);
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">Historial</p>
              <h1 className="text-3xl font-display text-verde-ebano">Mis Pedidos</h1>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-oro-antiguo/20 border-t-oro-antiguo rounded-full animate-spin" />
                  <p className="text-[9px] uppercase tracking-[0.5em] text-verde-ebano/30">Cargando pedidos...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-verde-ebano/8 p-16 flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 border border-verde-ebano/10 flex items-center justify-center">
                  <Package size={24} strokeWidth={0.8} className="text-verde-ebano/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-verde-ebano/40 uppercase tracking-[0.3em]">Sin pedidos aún</p>
                  <p className="text-[10px] text-verde-ebano/25 font-light">Tu primer joya te está esperando</p>
                </div>
                <a href="/shop" className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors">
                  Explorar Catálogo →
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedId === order.order_id;

                  return (
                    <motion.div
                      key={order.order_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-verde-ebano/8 overflow-hidden"
                    >
                      {/* Order header */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order.order_id)}
                        className="w-full flex items-center gap-4 p-6 text-left hover:bg-verde-ebano/1 transition-colors"
                      >
                        <div className={`flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] border px-2.5 py-1.5 ${statusInfo.color}`}>
                          <StatusIcon size={10} strokeWidth={2} />
                          {statusInfo.label}
                        </div>
                        <div className="flex-1 flex flex-col gap-0.5">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-verde-ebano font-medium">
                            Pedido {order.order_number}
                          </p>
                          <p className="text-[9px] text-verde-ebano/30">
                            {new Date(order.placed_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                            {" · "}{order.item_count} {order.item_count === 1 ? "pieza" : "piezas"}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-verde-ebano">{formatPrice(order.total_cents)}</p>
                        {isExpanded ? <ChevronUp size={14} strokeWidth={1} className="text-verde-ebano/30 flex-shrink-0" /> : <ChevronDown size={14} strokeWidth={1} className="text-verde-ebano/30 flex-shrink-0" />}
                      </button>

                      {/* Expanded items */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-verde-ebano/6"
                        >
                          <div className="p-6 flex flex-col gap-4">
                            {Array.isArray(order.items) && order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-verde-ebano/4 overflow-hidden flex-shrink-0">
                                  {item.product_image && (
                                    <Image src={item.product_image} alt={item.product_name} width={56} height={56} className="object-cover w-full h-full" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-verde-ebano">{item.product_name}</p>
                                  <p className="text-[9px] text-verde-ebano/40">{item.collection_name} · ×{item.quantity}</p>
                                </div>
                                <p className="text-[10px] text-verde-ebano/60">{formatPrice(item.unit_price_cents * item.quantity)}</p>
                              </div>
                            ))}

                            {order.tracking_number && (
                              <div className="flex items-center gap-3 pt-3 border-t border-verde-ebano/6">
                                <Truck size={12} strokeWidth={1.2} className="text-oro-antiguo" />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano/50">
                                  Rastreo: {order.carrier} — {order.tracking_number}
                                </span>
                                <ExternalLink size={10} strokeWidth={1} className="text-verde-ebano/20" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
