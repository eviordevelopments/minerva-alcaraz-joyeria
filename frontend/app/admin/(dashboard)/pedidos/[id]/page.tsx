"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, Package, MapPin, CreditCard, Truck, User, 
  CheckCircle, AlertCircle, ExternalLink, ShieldCheck, RefreshCw, Copy, Check
} from "lucide-react";
import { formatPrice } from "@/lib/supabase";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid": 
      return { label: "Pago Liquidado", color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40" };
    case "processing": 
      return { label: "En Preparación en Atelier", color: "text-blue-400 bg-blue-950/40 border-blue-500/40" };
    case "shipped": 
      return { label: "En Camino / Enviado", color: "text-[#CBB67B] bg-[#CBB67B]/20 border-[#CBB67B]/40" };
    case "delivered": 
      return { label: "Entregado a Cliente", color: "text-emerald-300 bg-emerald-900/50 border-emerald-400" };
    case "pending": 
      return { label: "Pendiente en Pasarela", color: "text-amber-400 bg-amber-950/40 border-amber-500/40" };
    case "cancelled": 
      return { label: "Cancelado", color: "text-red-400 bg-red-950/40 border-red-500/40" };
    default: 
      return { label: status, color: "text-gray-400 bg-gray-800 border-gray-600" };
  }
}

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [stripeTelemetry, setStripeTelemetry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newTracking, setNewTracking] = useState("");
  const [newCarrier, setNewCarrier] = useState("DHL Express");
  const [sendNotification, setSendNotification] = useState(true);
  const [updateFeedback, setUpdateFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error de carga");
      setOrder(json.order);
      setItems(json.items || []);
      setStripeTelemetry(json.stripeTelemetry || null);
      setNewStatus(json.order.status);
      setNewTracking(json.order.tracking_number || "");
      setNewCarrier(json.order.carrier || "DHL Express");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateFeedback(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          tracking_number: newTracking,
          carrier: newCarrier,
          send_notification: sendNotification,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al actualizar");
      setOrder(json.order);
      
      let msg = "Pedido actualizado exitosamente.";
      if (json.trackingEmailSent) {
        msg = `✓ Pedido actualizado y correo de rastreo enviado exitosamente a ${json.customerEmail || "cliente"} vía Resend.`;
      } else if (json.deliveredEmailSent) {
        msg = `✓ Pedido marcado como entregado y correo de entrega enviado a ${json.customerEmail || "cliente"} vía Resend.`;
      }
      setUpdateFeedback({ type: "success", message: msg });
    } catch (err: any) {
      setUpdateFeedback({ type: "error", message: err.message || "Error al actualizar" });
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-[#CBB67B] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#CBB67B]">Consultando orden y Stripe...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-red-400 p-6 bg-red-900/30 border border-red-500/30 flex items-center gap-3">
        <AlertCircle size={20} />
        <p>{error || "Pedido no encontrado"}</p>
      </div>
    );
  }

  const badge = getStatusBadge(order.status);

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <Link href="/admin/pedidos" className="inline-flex items-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B] text-xs uppercase tracking-widest transition-colors mb-4">
            <ChevronLeft size={14} /> Volver a Pedidos
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display-erp text-3xl text-[#E5DBD6] font-bold">
              Pedido {order.order_number}
            </h1>
            <span className={`px-3 py-1 text-[11px] uppercase tracking-widest font-bold border ${badge.color}`}>
              {badge.label}
            </span>
            {stripeTelemetry?.is_settled && (
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Liquidado en Stripe
              </span>
            )}
          </div>
          <p className="text-[#8E9A8B] text-sm font-mono mt-2">
            Registrado el {formatDate(order.placed_at || order.created_at)}
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start sm:self-auto border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
        >
          <RefreshCw size={12} /> Sincronizar Pasarela
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* TARJETA DE AUDITORÍA Y TELEMETRÍA DE STRIPE */}
          <section className="bg-[#1A2218] border-2 border-[#CBB67B]/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB67B]/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#CBB67B]/20 pb-4 mb-6">
              <div className="flex items-center gap-2.5 text-[#CBB67B]">
                <CreditCard size={18} />
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold">Auditoría y Telemetría de Pago (Stripe)</h2>
              </div>
              {stripeTelemetry?.is_settled ? (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle size={12} /> Transacción Liquidada
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                  Pendiente
                </span>
              )}
            </div>

            {stripeTelemetry ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  
                  {/* ID de Cargo */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">ID del Cargo en Stripe</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#E5DBD6] font-bold select-all truncate">{stripeTelemetry.charge_id}</span>
                      <button 
                        onClick={() => copyToClipboard(stripeTelemetry.charge_id, "charge")}
                        className="text-[#CBB67B] hover:text-white transition-colors"
                        title="Copiar ID de Cargo"
                      >
                        {copiedKey === "charge" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* PaymentIntent ID */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">PaymentIntent ID</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#E5DBD6] font-bold select-all truncate">{stripeTelemetry.payment_intent_id}</span>
                      <button 
                        onClick={() => copyToClipboard(stripeTelemetry.payment_intent_id, "pi")}
                        className="text-[#CBB67B] hover:text-white transition-colors"
                        title="Copiar PaymentIntent"
                      >
                        {copiedKey === "pi" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Monto Cobrado y Capturado */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">Monto Cobrado y Capturado</span>
                    <span className="text-emerald-400 text-base font-bold">
                      ${Number(stripeTelemetry.amount_mxn).toLocaleString("es-MX", { minimumFractionDigits: 2 })} {stripeTelemetry.currency}
                    </span>
                  </div>

                  {/* Método de Pago */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">Método de Pago</span>
                    <span className="text-[#E5DBD6]">
                      Tarjeta {stripeTelemetry.card_brand} terminación <strong className="text-[#CBB67B]">{stripeTelemetry.card_last4}</strong>
                    </span>
                  </div>

                  {/* Estatus en Stripe */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">Estatus de Pasarela</span>
                    <span className="text-[#E5DBD6]">
                      Paid: <strong className="text-emerald-400">{String(stripeTelemetry.paid)}</strong> | Captured: <strong className="text-emerald-400">{String(stripeTelemetry.captured)}</strong> ({stripeTelemetry.stripe_status})
                    </span>
                  </div>

                  {/* Respuesta del Banco Emisor */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">Respuesta del Banco Emisor</span>
                    <span className="text-[#E5DBD6]">
                      {stripeTelemetry.seller_message} <span className="text-[#8E9A8B]">(Riesgo: {stripeTelemetry.risk_level})</span>
                    </span>
                  </div>

                  {/* Fecha y Hora del Cobro */}
                  <div className="bg-[#242D21] border border-[#CBB67B]/15 p-3.5 space-y-1 md:col-span-2">
                    <span className="text-[10px] uppercase text-[#8E9A8B] tracking-widest block font-sans">Fecha y Hora del Cobro en Pasarela</span>
                    <span className="text-[#E5DBD6]">
                      {stripeTelemetry.charge_created || "Registrado al momento de pago"}
                    </span>
                  </div>
                </div>

                {/* Comprobante Oficial de Stripe */}
                {stripeTelemetry.receipt_url && (
                  <div className="pt-2">
                    <a
                      href={stripeTelemetry.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] text-xs uppercase tracking-widest font-bold transition-all shadow-md"
                    >
                      <ExternalLink size={14} />
                      Ver y Descargar Recibo Oficial de Stripe
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[#242D21] border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
                <AlertCircle size={16} />
                <span>Esta orden no cuenta con referencia directa de Stripe o el pago no fue iniciado con tarjeta.</span>
              </div>
            )}
          </section>

          {/* PRODUCTOS */}
          <section className="bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/10 pb-4 mb-6">
              <Package size={16} />
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Desglose de Joyas Adquiridas</h2>
            </div>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-[#2C3729] border border-[#CBB67B]/20 flex-shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover grayscale opacity-80" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8E9A8B]">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[#E5DBD6] font-bold">{item.product_name}</h3>
                    <p className="text-xs text-[#CBB67B] font-mono tracking-widest mb-2">SKU: {item.product_sku}</p>
                    <p className="text-sm text-[#8E9A8B]">Cant: {item.quantity} x {formatPrice(item.unit_price_cents)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#CBB67B] font-bold">{formatPrice(item.subtotal_cents)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#CBB67B]/10 flex flex-col items-end gap-2 text-base">
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Subtotal:</span> <span className="font-mono">{formatPrice(order.subtotal_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Envío Asegurado:</span> <span className="font-mono">{formatPrice(order.shipping_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>IVA (16% Incluido):</span> <span className="font-mono">{formatPrice(order.tax_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Cortesías / Desc.:</span> <span className="font-mono text-green-400">-{formatPrice(order.discount_cents || 0)}</span></div>
              <div className="flex justify-between w-64 text-[#E5DBD6] font-bold text-lg mt-2 pt-2 border-t border-[#CBB67B]/20">
                <span>TOTAL LIQUIDADO:</span> <span className="font-mono text-[#CBB67B]">{formatPrice(order.total_cents)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* COLUMNA LATERAL */}
        <div className="space-y-8">
          
          {/* CLIENTE Y ENVÍO */}
          <section className="bg-[#1F271D] border border-[#CBB67B]/20 p-6">
            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/10 pb-4 mb-4">
              <User size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Cliente en CRM</h2>
            </div>
            <div className="text-base space-y-1 mb-8">
              <p className="text-[#E5DBD6] font-bold">{order.profiles?.full_name || order.shipping_name}</p>
              <p className="text-[#8E9A8B] font-mono text-sm">{order.profiles?.email || order.shipping_email || "Sin correo"}</p>
              <p className="text-[#8E9A8B] font-mono text-sm">{order.shipping_phone || order.profiles?.phone || "Sin teléfono"}</p>
            </div>

            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/10 pb-4 mb-4">
              <MapPin size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Destino de Entrega</h2>
            </div>
            <div className="text-base space-y-1 text-[#8E9A8B]">
              <p className="text-[#E5DBD6] font-semibold">{order.shipping_name}</p>
              <p>{order.shipping_street} {order.shipping_exterior_num || ""} {order.shipping_interior_num || ""}</p>
              {order.shipping_colonia && <p>Col. {order.shipping_colonia}</p>}
              <p>{order.shipping_city}, {order.shipping_state || ""}</p>
              <p>CP {order.shipping_postal_code} - {order.shipping_country || "México"}</p>
              {order.shipping_phone && <p className="mt-2 font-mono text-sm">Tel: {order.shipping_phone}</p>}
            </div>
          </section>

          {/* GESTIÓN DE STATUS Y GUÍA (SOLO LOGÍSTICA) */}
          <section className="bg-[#2C3729] border border-[#CBB67B]/40 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/20 pb-4 mb-2">
              <Truck size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Gestión Logística y Guía</h2>
            </div>

            {updateFeedback && (
              <div
                className={`p-4 border text-xs leading-relaxed flex items-start gap-2.5 ${
                  updateFeedback.type === "success"
                    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                    : "bg-red-950/80 border-red-500/50 text-red-300"
                }`}
              >
                {updateFeedback.type === "success" ? (
                  <CheckCircle size={15} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-400" />
                )}
                <span>{updateFeedback.message}</span>
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#8E9A8B] mb-2 font-bold">
                  Estado de Envío (Taller / Logística)
                </label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1F271D] border border-[#CBB67B]/30 text-[#E5DBD6] p-2.5 text-sm focus:border-[#CBB67B] outline-none rounded-none"
                >
                  <option value="paid">✓ Pago Confirmado (En espera de preparación)</option>
                  <option value="processing">🔨 En Preparación en el Atelier</option>
                  <option value="shipped">📦 En Camino / Enviado (Guía Asignada)</option>
                  <option value="delivered">💎 Entregado a Cliente</option>
                  <option value="cancelled">✖ Cancelado</option>
                </select>
                <p className="text-[10px] text-[#8E9A8B] mt-1.5">
                  El pago financiero ya está liquidado por Stripe. Esta barra controla el avance físico de la joya.
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#8E9A8B] mb-2 font-bold">
                  Empresa de Paquetería / Custodia
                </label>
                <select
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                  className="w-full bg-[#1F271D] border border-[#CBB67B]/30 text-[#E5DBD6] p-2.5 text-sm focus:border-[#CBB67B] outline-none rounded-none"
                >
                  <option value="DHL Express">DHL Express (Nacional e Internacional)</option>
                  <option value="FedEx Express">FedEx Express</option>
                  <option value="Estafeta Mexicana">Estafeta Mexicana</option>
                  <option value="Paquetexpress">Paquetexpress</option>
                  <option value="Custodia Especial / Mensajería Privada">Custodia Especial / Mensajería Privada</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#8E9A8B] mb-2 font-bold">
                  Número de Guía (Tracking de Seguridad)
                </label>
                <input 
                  type="text"
                  placeholder="Ej. DHL / FedEx: 1Z999999999"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  className="w-full bg-[#1F271D] border border-[#CBB67B]/30 text-[#E5DBD6] p-2.5 text-sm font-mono placeholder-[#8E9A8B]/50 focus:border-[#CBB67B] outline-none rounded-none"
                />
                <p className="text-[10px] text-[#8E9A8B] mt-1.5 leading-relaxed">
                  Al ingresar o modificar la guía, el sistema actualizará el pedido en el perfil del cliente y enviará un correo corporativo de notificación vía Resend.
                </p>
              </div>

              {/* Direct Carrier Link Preview */}
              {newTracking.trim() && (
                <div className="bg-[#1F271D] border border-[#CBB67B]/20 p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#CBB67B] font-mono truncate">
                    <span>Guía:</span>
                    <strong>{newTracking.trim()}</strong>
                  </div>
                  <a
                    href={
                      newCarrier.toLowerCase().includes("dhl")
                        ? `https://www.dhl.com/mx-es/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(newTracking.trim())}`
                        : newCarrier.toLowerCase().includes("fedex")
                        ? `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(newTracking.trim())}`
                        : newCarrier.toLowerCase().includes("estafeta")
                        ? `https://www.estafeta.com/Rastreo?waybill=${encodeURIComponent(newTracking.trim())}`
                        : newCarrier.toLowerCase().includes("paquetexpress")
                        ? `https://www.paquetexpress.com.mx/rastreo-de-guias?tracking_number=${encodeURIComponent(newTracking.trim())}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#CBB67B] hover:text-white underline inline-flex items-center gap-1 font-semibold flex-shrink-0"
                  >
                    <span>Probar Enlace de Rastreo</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}

              {/* Notification toggle */}
              <div className="pt-2 border-t border-[#CBB67B]/15">
                <label className="flex items-center gap-2.5 text-xs text-[#E5DBD6] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="accent-[#CBB67B] w-4 h-4 cursor-pointer"
                  />
                  <span>Enviar correo corporativo elegante de notificación al cliente vía Resend</span>
                </label>
                <p className="text-[10px] text-[#8E9A8B] ml-6 mt-0.5">
                  Destinatario: <span className="font-mono text-[#CBB67B]">{order.shipping_email || order.profiles?.email || "Sin correo"}</span>
                </p>
              </div>

              <button 
                type="submit"
                disabled={isUpdating}
                className="w-full mt-3 py-3.5 bg-[#CBB67B] text-[#1F271D] hover:bg-[#E4D5A4] transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isUpdating ? "Guardando y Notificando..." : "Guardar Guía & Notificar Cliente"}
                {!isUpdating && <CheckCircle size={14} />}
              </button>
            </form>
          </section>
        </div>

      </div>
    </div>
  );
}
