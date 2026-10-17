"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase, formatPrice } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, 
  ExternalLink, MessageCircle, Sparkles, Star, ShieldCheck, Check, Send, X, Copy
} from "lucide-react";

interface OrderItem {
  id: string;
  product_id?: string;
  product_name: string;
  product_sku: string;
  product_image: string | null;
  quantity: number;
  unit_price_cents: number;
  collection_name?: string | null;
  subtotal_cents?: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  currency: string;
  placed_at: string;
  payment_confirmed_at?: string | null;
  payment_reference?: string | null;
  tracking_number: string | null;
  carrier: string | null;
  delivered_at?: string | null;
  order_items: OrderItem[];
}

const STEP_DEFINITIONS = [
  {
    key: "paid",
    title: "1. Pago Liquidado & Recibido",
    subtitle: "Transacción confirmada por pasarela bancaria. El encargo ha sido formalizado en nuestro registro.",
  },
  {
    key: "processing",
    title: "2. En Preparación en el Atelier",
    subtitle: "Nuestros maestros orfebres preparan tu joya, certifican gemas e insumos y colocan sellos de seguridad.",
  },
  {
    key: "shipped",
    title: "3. En Camino / Custodia de Valores",
    subtitle: "Tu paquete viaja con póliza de seguro y custodia especializada hacia tu domicilio.",
  },
  {
    key: "delivered",
    title: "4. Entregado",
    subtitle: "La joya ha llegado a su destino y se encuentra en tus manos para perpetuar su legado.",
  },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "paid": return 0;
    case "processing": return 1;
    case "shipped": return 2;
    case "delivered": return 3;
    default: return 0;
  }
}

export default function PedidosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Delivery confirmation & Survey state
  const [showSurvey, setShowSurvey] = useState(false);
  const [rating, setRating] = useState(5);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([
    "Joya impecable",
    "Empaque de alta seguridad",
  ]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  function getTrackingUrl(trackingNumber: string, carrier?: string | null) {
    const c = (carrier || "DHL Express").toLowerCase();
    if (c.includes("fedex")) {
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`;
    }
    if (c.includes("estafeta")) {
      return `https://www.estafeta.com/Rastreo?waybill=${encodeURIComponent(trackingNumber)}`;
    }
    if (c.includes("paquetexpress")) {
      return `https://www.paquetexpress.com.mx/rastreo-de-guias?tracking_number=${encodeURIComponent(trackingNumber)}`;
    }
    return `https://www.dhl.com/mx-es/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(trackingNumber)}`;
  }

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("placed_at", { ascending: false });

      if (!error && data) {
        setOrders(data);

        // Auto-expand and open tracking if deep-linked via email or external link
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const target = params.get("orderId") || params.get("id") || params.get("order");
          if (target) {
            const matched = data.find(
              (o) =>
                o.id === target ||
                o.order_number?.toLowerCase() === target.toLowerCase() ||
                o.tracking_number?.toLowerCase() === target.toLowerCase()
            );
            if (matched) {
              setExpandedId(matched.id);
              setTrackingOrder(matched);
              setShowSurvey(false);
              setSurveySubmitted(!!matched.delivered_at);

              setTimeout(() => {
                const el = document.getElementById(`order-${matched.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 400);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openTracking = (order: Order) => {
    setTrackingOrder(order);
    setShowSurvey(false);
    setSurveySubmitted(!!order.delivered_at);
  };

  const handleToggleAspect = (aspect: string) => {
    if (selectedAspects.includes(aspect)) {
      setSelectedAspects(selectedAspects.filter((a) => a !== aspect));
    } else {
      setSelectedAspects([...selectedAspects, aspect]);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!trackingOrder) return;
    setIsSubmittingSurvey(true);
    try {
      const res = await fetch(`/api/perfil/orders/${trackingOrder.id}/confirm-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          feedback: feedbackText,
          aspects: selectedAspects,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al registrar confirmación");

      setSurveySubmitted(true);
      setShowSurvey(false);
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === trackingOrder.id ? { ...o, status: "delivered", delivered_at: new Date().toISOString() } : o))
      );
      setTrackingOrder((prev) => (prev ? { ...prev, status: "delivered", delivered_at: new Date().toISOString() } : null));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmittingSurvey(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">Suite del Cliente</p>
              <h1 className="text-3xl font-display text-verde-ebano">Mis Adquisiciones & Pedidos</h1>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-oro-antiguo/20 border-t-oro-antiguo rounded-full animate-spin" />
                  <p className="text-[11px] uppercase tracking-[0.5em] text-verde-ebano/30">Consultando Atelier...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-verde-ebano/8 p-16 flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 border border-verde-ebano/10 flex items-center justify-center">
                  <Package size={24} strokeWidth={0.8} className="text-verde-ebano/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-base text-verde-ebano/40 uppercase tracking-[0.3em]">Sin compras registradas</p>
                  <p className="text-xs text-verde-ebano/25 font-light">Tu primera joya de autor te está esperando</p>
                </div>
                <a href="/shop" className="text-[11px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors">
                  Explorar Catálogo →
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {orders.map((order) => {
                  const isPaid = order.status !== "pending" && order.status !== "cancelled";
                  const isExpanded = expandedId === order.id;

                  // Pre-filled WhatsApp message for transaction questions
                  const waMessage = [
                    "Hola Minerva Alcaraz Joyería, tengo una consulta sobre mi adquisición:",
                    `• Pedido: ${order.order_number}`,
                    `• Total: $${(order.total_cents / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`,
                    order.payment_reference ? `• Ref. de Pago: ${order.payment_reference}` : "",
                    "¿Me podrían brindar asesoría personalizada por favor?",
                  ].filter(Boolean).join("\n");

                  const waUrl = `https://wa.me/524623071972?text=${encodeURIComponent(waMessage)}`;

                  return (
                    <motion.div
                      key={order.id}
                      id={`order-${order.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-verde-ebano/10 overflow-hidden shadow-sm"
                    >
                      {/* Top Header Card */}
                      <div className="p-6 border-b border-verde-ebano/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs uppercase tracking-widest text-verde-ebano font-bold">
                            Orden {order.order_number}
                          </span>

                          {/* Transaction status badge */}
                          {isPaid ? (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 font-bold">
                              <ShieldCheck size={12} className="text-emerald-600" /> Transacción Liquidada
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono text-amber-700 bg-amber-50 border border-amber-200">
                              Pendiente de Pago
                            </span>
                          )}

                          <span className="text-[11px] text-verde-ebano/40">
                            {new Date(order.placed_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-lg font-display text-verde-ebano font-bold">
                            {formatPrice(order.total_cents)}
                          </span>

                          <button
                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                            className="text-verde-ebano/40 hover:text-verde-ebano transition-colors p-1"
                            title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Action Bar (WhatsApp & Live Tracking) */}
                      <div className="bg-[#FAF7F5] px-6 py-3.5 border-b border-verde-ebano/8 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-verde-ebano/70">
                          <Truck size={14} className="text-oro-antiguo" />
                          <span>
                            Estado actual: <strong className="text-verde-ebano capitalize">{order.status === "paid" ? "En preparación" : order.status}</strong>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {/* Botón exclusivo WhatsApp */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-600/30 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all text-[11px] uppercase tracking-wider font-medium"
                          >
                            <MessageCircle size={13} />
                            Dudas sobre mi Transacción
                          </a>

                          {/* Botón de Rastreo Elegante */}
                          <button
                            onClick={() => openTracking(order)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#2C3729] hover:bg-[#3D4C3A] text-[#E5DBD6] transition-all text-[11px] uppercase tracking-widest font-bold shadow-sm"
                          >
                            <Sparkles size={12} className="text-oro-antiguo" />
                            Rastrear Joya & Estado
                          </button>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="p-6 space-y-4">
                        {(order.order_items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-verde-ebano/5 border border-verde-ebano/10 overflow-hidden flex-shrink-0 relative">
                              {item.product_image ? (
                                <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-verde-ebano/20">
                                  <Package size={18} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-display text-verde-ebano truncate font-bold">{item.product_name}</h4>
                              <p className="text-[11px] font-mono text-oro-antiguo tracking-widest mt-0.5">SKU: {item.product_sku}</p>
                              <p className="text-[11px] text-verde-ebano/50 mt-1">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-sm text-verde-ebano font-bold">
                                {formatPrice((item.unit_price_cents || 0) * (item.quantity || 1))}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <div className="border-t border-verde-ebano/8 p-6 bg-verde-ebano/[0.02] text-xs space-y-2 font-mono text-verde-ebano/60">
                          {order.payment_reference && (
                            <p>Referencia de Pasarela: <strong className="text-verde-ebano">{order.payment_reference}</strong></p>
                          )}
                          {order.tracking_number && (
                            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#1F271D] border border-oro-antiguo/30 text-white shadow-sm">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-oro-antiguo font-semibold block">
                                  Guía de Rastreo Asignada ({order.carrier || "DHL Express"})
                                </span>
                                <span className="text-sm font-mono font-bold text-[#E5DBD6] tracking-wider">
                                  {order.tracking_number}
                                </span>
                              </div>
                              <a
                                href={getTrackingUrl(order.tracking_number, order.carrier)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 bg-oro-antiguo hover:bg-[#E4D5A4] text-verde-ebano text-[11px] uppercase font-bold tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <span>Rastrear en {order.carrier || "DHL Express"}</span>
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          )}
                          {order.delivered_at && (
                            <p className="text-emerald-700 font-bold">✓ Entrega confirmada el: {new Date(order.delivered_at).toLocaleString("es-MX")}</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL ELEGANTE DE RASTREO Y ENCUESTA EN LA SUITE ───────────────────────── */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-verde-ebano/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF7F5] border-2 border-oro-antiguo/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="bg-[#2C3729] text-[#E5DBD6] p-6 sm:p-8 flex items-start justify-between border-b border-oro-antiguo/30">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo block font-bold mb-1">
                    Atelier Minerva Alcaraz
                  </span>
                  <h2 className="text-2xl font-display font-bold">
                    Rastreo de Joya de Autor
                  </h2>
                  <p className="text-xs font-mono text-[#8E9A8B] mt-1">
                    Orden: {trackingOrder.order_number} · Ref: {trackingOrder.payment_reference || "Liquidada"}
                  </p>
                </div>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="text-[#E5DBD6]/60 hover:text-white p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Desglose del Producto Principal */}
                {trackingOrder.order_items?.[0] && (
                  <div className="bg-[#242D22] border border-oro-antiguo/30 p-4 flex items-center gap-4 shadow-sm text-white">
                    <div className="w-20 h-20 bg-black/30 border border-oro-antiguo/40 relative flex-shrink-0 overflow-hidden">
                      {trackingOrder.order_items[0].product_image ? (
                        <Image src={trackingOrder.order_items[0].product_image} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8E9A8B]">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo font-bold block">
                        Pieza en Custodia
                      </span>
                      <h3 className="text-base font-display text-white font-bold truncate">
                        {trackingOrder.order_items[0].product_name}
                      </h3>
                      <p className="text-xs font-mono text-white/90 mt-1">
                        SKU Serializado: <strong className="text-white font-mono font-bold">{trackingOrder.order_items[0].product_sku}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* PROMINENT TRACKING NUMBER CARD IN MODAL */}
                {trackingOrder.tracking_number && (
                  <div className="bg-[#1F271D] border-2 border-oro-antiguo p-5 text-white shadow-md space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-oro-antiguo/30 pb-2">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-bold flex items-center gap-1.5">
                        <Truck size={14} /> Guía de Rastreo Asignada
                      </span>
                      <span className="text-[10px] uppercase font-mono text-[#E5DBD6]/90 font-bold px-2 py-0.5 bg-black/40 border border-oro-antiguo/40">
                        {trackingOrder.carrier || "DHL Express"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-[#8E9A8B] block uppercase tracking-wider">Número de Guía</span>
                        <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#E5DBD6]">
                          {trackingOrder.tracking_number}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (trackingOrder.tracking_number) {
                              navigator.clipboard.writeText(trackingOrder.tracking_number);
                              setCopiedTracking(true);
                              setTimeout(() => setCopiedTracking(false), 2000);
                            }
                          }}
                          className="px-3 py-2 bg-black/40 hover:bg-black/60 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                          title="Copiar guía"
                        >
                          {copiedTracking ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copiedTracking ? "Copiado" : "Copiar"}</span>
                        </button>

                        <a
                          href={getTrackingUrl(trackingOrder.tracking_number, trackingOrder.carrier)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-oro-antiguo hover:bg-[#E4D5A4] text-verde-ebano text-xs uppercase tracking-widest font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                        >
                          <span>Rastrear en {trackingOrder.carrier || "DHL Express"}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* ANIMACIÓN Y STEPPER DEL ESTADO DE ENVÍO */}
                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-[#2C3729] font-bold border-b border-[#2C3729]/15 pb-2">
                    Progreso de Creación y Entrega
                  </h3>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C3729]/20">
                    {STEP_DEFINITIONS.map((step, idx) => {
                      const currentIdx = getStepIndex(trackingOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="relative flex items-start gap-4">
                          <motion.div
                            initial={false}
                            animate={{
                              scale: isCurrent ? [1, 1.15, 1] : 1,
                              backgroundColor: isCompleted ? "#2C3729" : "#E5DBD6",
                              borderColor: isCompleted ? "#CBB67B" : "#B0A59F",
                            }}
                            transition={{ repeat: isCurrent ? Infinity : 0, duration: 2.5 }}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] -ml-[31px] z-10 flex-shrink-0 ${
                              isCompleted ? "text-oro-antiguo shadow-md" : "text-[#2C3729]/50"
                            }`}
                          >
                            {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
                          </motion.div>

                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#2C3729]">
                              {step.title}
                            </h4>
                            <p className="text-xs text-[#2C3729]/80 mt-0.5 leading-relaxed font-light">
                              {step.subtitle}
                            </p>
                            {step.key === "shipped" && trackingOrder.tracking_number && (
                              <div className="mt-2.5 p-3 bg-oro-antiguo/15 border border-oro-antiguo/40 text-xs font-mono text-[#2C3729] flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  Guía de Custodia: <strong>{trackingOrder.tracking_number}</strong> ({trackingOrder.carrier || "DHL Express"})
                                </div>
                                <a
                                  href={getTrackingUrl(trackingOrder.tracking_number, trackingOrder.carrier)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] uppercase font-bold text-verde-ebano underline inline-flex items-center gap-1"
                                >
                                  <span>Rastrear en Portal de {trackingOrder.carrier || "DHL Express"}</span>
                                  <ExternalLink size={10} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONFIRMACIÓN DE ENTREGA Y ENCUESTA */}
                <div className="pt-6 border-t border-verde-ebano/15 space-y-4">
                  {surveySubmitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-center space-y-1">
                      <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Entrega Confirmada & Calificada
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Agradecemos tu retroalimentación. Tu evaluación ha sido registrada en el Atelier.
                      </p>
                    </div>
                  ) : !showSurvey ? (
                    <div className="bg-[#2C3729] text-[#E5DBD6] p-6 text-center space-y-3 shadow-md">
                      <Sparkles size={20} className="text-oro-antiguo mx-auto" />
                      <h4 className="text-base font-display font-bold">¿Ya recibiste tu pieza?</h4>
                      <p className="text-xs text-[#E5DBD6]/70 max-w-md mx-auto leading-relaxed">
                        Confirma que tu paquete ha llegado a tus manos de forma íntegra para certificar el cierre de custodia y calificar tu experiencia.
                      </p>
                      <button
                        onClick={() => setShowSurvey(true)}
                        className="px-6 py-2.5 bg-oro-antiguo hover:bg-[#E4D5A4] text-verde-ebano text-xs uppercase tracking-widest font-bold transition-all shadow-md inline-flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} />
                        Confirmar Entrega y Calificar
                      </button>
                    </div>
                  ) : (
                    /* FORMULARIO DE LA ENCUESTA POST-ENTREGA */
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-oro-antiguo/40 p-6 space-y-5 shadow-lg"
                    >
                      <div className="text-center space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-oro-antiguo font-bold">
                          Encuesta de Excelencia Minerva Alcaraz
                        </span>
                        <h4 className="text-lg font-display text-verde-ebano font-bold">
                          Califica tu Experiencia
                        </h4>
                      </div>

                      {/* Selección de Estrellas */}
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              size={28}
                              className={star <= rating ? "text-oro-antiguo fill-oro-antiguo" : "text-verde-ebano/20"}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Aspectos destacados */}
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-wider text-verde-ebano/60 font-bold block text-center">
                          ¿Qué aspectos destacarías de tu entrega?
                        </label>
                        <div className="flex flex-wrap justify-center gap-2">
                          {[
                            "Joya impecable",
                            "Empaque de alta seguridad",
                            "Atención del Concierge",
                            "Entrega puntual",
                            "Certificado de autenticidad",
                          ].map((aspect) => {
                            const isSelected = selectedAspects.includes(aspect);
                            return (
                              <button
                                key={aspect}
                                type="button"
                                onClick={() => handleToggleAspect(aspect)}
                                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
                                  isSelected
                                    ? "bg-verde-ebano text-oro-antiguo border-verde-ebano"
                                    : "bg-transparent text-verde-ebano/70 border-verde-ebano/20 hover:border-verde-ebano"
                                }`}
                              >
                                {isSelected ? "✓ " : ""}{aspect}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comentario */}
                      <div>
                        <textarea
                          placeholder="Mensaje opcional para Minerva Alcaraz y su equipo de orfebres..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={3}
                          className="w-full bg-[#FAF7F5] border border-verde-ebano/20 p-3 text-xs text-verde-ebano placeholder-verde-ebano/40 focus:border-oro-antiguo outline-none resize-none"
                        />
                      </div>

                      {/* Botones de Envío */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowSurvey(false)}
                          className="flex-1 py-2.5 border border-verde-ebano/20 text-verde-ebano text-xs uppercase tracking-wider hover:bg-verde-ebano/5 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingSurvey}
                          onClick={handleConfirmDelivery}
                          className="flex-1 py-2.5 bg-verde-ebano text-oro-antiguo hover:bg-[#3D4C3A] text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmittingSurvey ? "Guardando..." : "Enviar y Confirmar Entrega"}
                          <Send size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
