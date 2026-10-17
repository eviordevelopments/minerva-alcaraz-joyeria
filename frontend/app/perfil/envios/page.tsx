"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Truck, Crown, Clock, Shield, MapPin, Package, ArrowRight, Loader2, ExternalLink } from "lucide-react";

export default function EnviosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function loadActiveShipments() {
      if (!user) return;
      try {
        let query = supabase
          .from("orders")
          .select(`
            id,
            order_number,
            status,
            tracking_number,
            carrier,
            placed_at,
            order_items (
              id,
              product_name,
              quantity,
              product_image
            )
          `)
          .in("status", ["paid", "processing", "shipped", "delivered"])
          .order("placed_at", { ascending: false });

        if (user.id && user.email) {
          query = query.or(`user_id.eq.${user.id},shipping_email.ilike.${user.email}`);
        } else if (user.id) {
          query = query.eq("user_id", user.id);
        } else if (user.email) {
          query = query.ilike("shipping_email", user.email);
        }

        const { data, error } = await query;

        if (!error && data) {
          setActiveOrders(data);
        }
      } catch (err) {
        console.error("Error loading active shipments:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    if (user) loadActiveShipments();
  }, [user]);

  if (!user) return null;

  const perks = [
    { icon: Clock, title: "Entrega 24–48h", desc: "CDMX en 24 horas. Resto del país en 48–72 horas." },
    { icon: Shield, title: "Envío Asegurado", desc: "Cada pieza viaja con seguro completo. En caso de extravío, reponemos la pieza sin costo." },
    { icon: MapPin, title: "Rastreo en Tiempo Real", desc: "Recibes actualizaciones por tu perfil en cada etapa del envío." },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return { text: "1. Pago Liquidado & Recibido", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" };
      case "processing":
        return { text: "2. En Preparación en el Atelier", color: "text-[#CBB67B] border-[#CBB67B]/40 bg-[#CBB67B]/10" };
      case "shipped":
        return { text: "3. En Camino / Custodia de Valores", color: "text-blue-300 border-blue-400/40 bg-blue-950/40" };
      default:
        return { text: "En Proceso", color: "text-white border-white/20" };
    }
  };

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-white">Envíos Prioritarios</h1>
            </div>

            <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-5 flex items-start gap-3 shadow-md">
              <Truck size={16} strokeWidth={1.5} className="text-[#CBB67B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#E5DBD6]/80 leading-loose">
                Como miembro de The Circle, todos tus envíos son <strong className="text-white font-semibold">completamente gratuitos</strong> y tienen prioridad de despacho. Tu joya llega con custodia de alta seguridad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#1E261C] border border-[#CBB67B]/20 p-6 flex flex-col gap-3 shadow-md">
                  <div className="w-9 h-9 border border-[#CBB67B]/30 flex items-center justify-center bg-black/25">
                    <Icon size={15} strokeWidth={1.5} className="text-[#CBB67B]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xs uppercase tracking-[0.25em] text-[#CBB67B] font-bold">{title}</h3>
                    <p className="text-xs text-white leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-8 flex flex-col gap-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#CBB67B]/15 pb-4">
                <h2 className="text-xs uppercase tracking-[0.4em] text-[#CBB67B] font-bold">Mis Envíos Activos</h2>
                <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">
                  {activeOrders.length} {activeOrders.length === 1 ? "envío en curso" : "envíos en curso"}
                </span>
              </div>

              {isLoadingOrders ? (
                <div className="py-8 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-[#8E9A8B]">
                  <Loader2 size={16} className="animate-spin text-[#CBB67B]" />
                  Sincronizando envíos...
                </div>
              ) : activeOrders.length === 0 ? (
                <p className="text-xs text-[#E5DBD6]/60 italic py-2">No tienes envíos activos en este momento.</p>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map((order) => {
                    const badge = getStatusLabel(order.status);
                    return (
                      <div
                        key={order.id}
                        className="bg-black/30 border border-[#CBB67B]/25 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-white tracking-wider">
                              Orden: {order.order_number}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 border font-semibold ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                          {order.order_items?.[0] && (
                            <p className="text-xs text-[#E5DBD6]/80 flex items-center gap-2">
                              <Package size={13} className="text-[#CBB67B]" />
                              {order.order_items[0].product_name}{" "}
                              {order.order_items.length > 1 && `(+${order.order_items.length - 1} pieza${order.order_items.length > 2 ? "s" : ""})`}
                            </p>
                          )}
                          {order.tracking_number && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
                              <p className="text-xs font-mono text-[#CBB67B]">
                                Guía: <strong>{order.tracking_number}</strong> ({order.carrier || "DHL Express"})
                              </p>
                              <a
                                href={
                                  (order.carrier || "").toLowerCase().includes("dhl")
                                    ? `https://www.dhl.com/mx-es/home/tracking/tracking-express.html?submit=1&tracking-id=${encodeURIComponent(order.tracking_number)}`
                                    : (order.carrier || "").toLowerCase().includes("fedex")
                                    ? `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(order.tracking_number)}`
                                    : (order.carrier || "").toLowerCase().includes("estafeta")
                                    ? `https://www.estafeta.com/Rastreo?waybill=${encodeURIComponent(order.tracking_number)}`
                                    : (order.carrier || "").toLowerCase().includes("paquetexpress")
                                    ? `https://www.paquetexpress.com.mx/rastreo-de-guias?tracking_number=${encodeURIComponent(order.tracking_number)}`
                                    : "/perfil/pedidos"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] uppercase tracking-wider text-[#CBB67B] underline hover:text-white inline-flex items-center gap-1 font-semibold"
                              >
                                <span>Rastrear en {order.carrier || "Paquetería"}</span>
                                <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                        </div>

                        <Link
                          href="/perfil/pedidos"
                          className="flex items-center gap-2 self-start md:self-auto text-xs uppercase tracking-widest font-bold px-4 py-2.5 bg-[#CBB67B] text-[#1F271D] hover:bg-[#E5DBD6] transition-all shadow-sm"
                        >
                          Rastrear Joya <ArrowRight size={13} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
