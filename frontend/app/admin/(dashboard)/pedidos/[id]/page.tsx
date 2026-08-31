"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Package, MapPin, CreditCard, Truck, User, CheckCircle, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/supabase";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "text-yellow-500 bg-yellow-900/30 border-yellow-500/30";
    case "paid": return "text-green-500 bg-green-900/30 border-green-500/30";
    case "processing": return "text-blue-400 bg-blue-900/30 border-blue-500/30";
    case "shipped": return "text-[#CBB67B] bg-[#CBB67B]/20 border-[#CBB67B]/40";
    case "delivered": return "text-emerald-400 bg-emerald-900/30 border-emerald-500/30";
    case "cancelled": return "text-red-500 bg-red-900/30 border-red-500/30";
    default: return "text-gray-400 bg-gray-800 border-gray-600";
  }
}

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newTracking, setNewTracking] = useState("");

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error de carga");
      setOrder(json.order);
      setItems(json.items);
      setNewStatus(json.order.status);
      setNewTracking(json.order.tracking_number || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, tracking_number: newTracking }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al actualizar");
      setOrder(json.order);
      alert("Pedido actualizado exitosamente.");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#CBB67B] border-t-transparent rounded-full animate-spin"></div>
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

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <Link href="/admin/pedidos" className="inline-flex items-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B] text-[10px] uppercase tracking-widest transition-colors mb-4">
            <ChevronLeft size={14} /> Volver a Pedidos
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display-erp text-3xl text-[#E5DBD6] font-bold">
              Pedido {order.order_number}
            </h1>
            <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-[#8E9A8B] text-xs font-mono mt-2">
            Realizado el {formatDate(order.placed_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PRODUCTOS */}
          <section className="bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/10 pb-4 mb-6">
              <Package size={16} />
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Desglose de Pedido</h2>
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
                    <p className="text-[10px] text-[#CBB67B] font-mono tracking-widest mb-2">SKU: {item.product_sku}</p>
                    <p className="text-xs text-[#8E9A8B]">Cant: {item.quantity} x {formatPrice(item.unit_price_cents)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#CBB67B] font-bold">{formatPrice(item.subtotal_cents)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#CBB67B]/10 flex flex-col items-end gap-2 text-sm">
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Subtotal:</span> <span className="font-mono">{formatPrice(order.subtotal_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Envío:</span> <span className="font-mono">{formatPrice(order.shipping_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#8E9A8B]"><span>Descuentos:</span> <span className="font-mono text-green-400">-{formatPrice(order.discount_cents)}</span></div>
              <div className="flex justify-between w-64 text-[#E5DBD6] font-bold text-lg mt-2 pt-2 border-t border-[#CBB67B]/20">
                <span>TOTAL:</span> <span className="font-mono text-[#CBB67B]">{formatPrice(order.total_cents)}</span>
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
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold">Cliente en CRM</h2>
            </div>
            <div className="text-sm space-y-1 mb-8">
              <p className="text-[#E5DBD6] font-bold">{order.profiles?.full_name}</p>
              <p className="text-[#8E9A8B] font-mono text-xs">{order.profiles?.email}</p>
              <p className="text-[#8E9A8B] font-mono text-xs">{order.profiles?.phone || "Sin teléfono"}</p>
            </div>

            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/10 pb-4 mb-4">
              <MapPin size={16} />
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold">Datos de Envío</h2>
            </div>
            <div className="text-sm space-y-1 text-[#8E9A8B]">
              <p className="text-[#E5DBD6]">{order.shipping_name}</p>
              <p>{order.shipping_street} {order.shipping_exterior_num} {order.shipping_interior_num}</p>
              <p>Col. {order.shipping_colonia}</p>
              <p>{order.shipping_city}, {order.shipping_state}</p>
              <p>CP {order.shipping_postal_code} - {order.shipping_country}</p>
              {order.shipping_phone && <p className="mt-2 font-mono text-xs">Tel: {order.shipping_phone}</p>}
            </div>
          </section>

          {/* GESTIÓN DE STATUS Y GUÍA */}
          <section className="bg-[#2C3729] border border-[#CBB67B]/40 p-6 shadow-xl">
            <div className="flex items-center gap-2 text-[#CBB67B] border-b border-[#CBB67B]/20 pb-4 mb-6">
              <Truck size={16} />
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold">Gestión y Tracking</h2>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-[#8E9A8B] mb-2">
                  Actualizar Status
                </label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1F271D] border border-[#CBB67B]/30 text-[#E5DBD6] p-2.5 text-xs focus:border-[#CBB67B] outline-none rounded-none"
                >
                  <option value="pending">Pending (Pendiente de pago)</option>
                  <option value="paid">Paid (Pagado)</option>
                  <option value="processing">Processing (En producción/preparación)</option>
                  <option value="shipped">Shipped (Enviado)</option>
                  <option value="delivered">Delivered (Entregado)</option>
                  <option value="cancelled">Cancelled (Cancelado)</option>
                  <option value="refunded">Refunded (Reembolsado)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-[#8E9A8B] mb-2">
                  Número de Guía (Tracking)
                </label>
                <input 
                  type="text"
                  placeholder="Ej. 1Z999999999"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  className="w-full bg-[#1F271D] border border-[#CBB67B]/30 text-[#E5DBD6] p-2.5 text-xs font-mono placeholder-[#8E9A8B]/50 focus:border-[#CBB67B] outline-none rounded-none"
                />
                <p className="text-[8px] text-[#8E9A8B] mt-1.5 leading-relaxed">
                  Al actualizar la guía y el status a "Shipped", el usuario podrá rastrear el pedido desde su cuenta, y el inventario del SKU se descontará automáticamente (marcando "Agotado" si llega a 0).
                </p>
              </div>

              <button 
                type="submit"
                disabled={isUpdating}
                className="w-full mt-2 py-3 bg-[#CBB67B] text-[#1F271D] hover:bg-[#E4D5A4] transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
                {!isUpdating && <CheckCircle size={14} />}
              </button>
            </form>
          </section>
        </div>

      </div>
    </div>
  );
}
