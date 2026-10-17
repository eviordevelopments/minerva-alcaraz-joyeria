"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Crown,
  MessageCircle,
  ArrowRight,
  Clock,
  Hammer,
  Truck,
  CheckCircle,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface CustomizationRequest {
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
  budget_cents: number | null;
  minerva_notes: string | null;
  quoted_price_cents: number | null;
  estimated_ready_at: string | null;
  communication_log: { role: string; message: string; timestamp: string }[];
  created_at: string;
  updated_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending_review: {
    label: "Recibido · En Evaluación",
    color: "bg-amber-950/70 border-amber-500/40 text-amber-300",
    icon: Clock,
  },
  in_design: {
    label: "En Diseño & Modelado",
    color: "bg-[#CBB67B]/20 border-[#CBB67B]/50 text-[#CBB67B]",
    icon: Sparkles,
  },
  quoted: {
    label: "Cotizado · Esperando Aprobación",
    color: "bg-blue-950/70 border-blue-500/40 text-blue-300",
    icon: FileText,
  },
  approved: {
    label: "Aprobado por el Cliente",
    color: "bg-emerald-950/70 border-emerald-500/40 text-emerald-300",
    icon: CheckCircle,
  },
  in_production: {
    label: "En Taller Orfebre",
    color: "bg-amber-900/60 border-amber-400 text-amber-200",
    icon: Hammer,
  },
  ready: {
    label: "Listo para Envío o Entrega",
    color: "bg-[#CBB67B]/30 border-[#CBB67B] text-[#CBB67B] font-bold",
    icon: Truck,
  },
  delivered: {
    label: "Entregado",
    color: "bg-emerald-900/70 border-emerald-400 text-emerald-200 font-bold",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-950/70 border-red-500/40 text-red-400",
    icon: AlertCircle,
  },
};

function formatCurrency(cents: number | null): string {
  if (!cents) return "Por cotizar";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function ConciergePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [requests, setRequests] = useState<CustomizationRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  const loadRequests = async () => {
    if (!user) return;
    setIsLoadingRequests(true);
    try {
      const res = await fetch("/api/concierge/my-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Error loading concierge requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Crown size={10} className="text-oro-antiguo" />
                <p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p>
              </div>
              <h1 className="text-3xl font-display text-white">Concierge Privado</h1>
            </div>

            {/* Concierge Intro Hero */}
            <div className="bg-[#1E261C] border border-[#CBB67B]/30 p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute right-6 top-6 opacity-5">
                <Crown size={120} strokeWidth={0.3} className="text-oro-antiguo" />
              </div>
              <Sparkles size={20} className="text-oro-antiguo" strokeWidth={1} />
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-display text-white font-bold">Minerva te atiende personalmente</h2>
                <p className="text-[#E5DBD6]/80 text-base font-light leading-loose max-w-lg">
                  Tu concierge dedicada está disponible para consultas de estilo, visitas al atelier, co-creación de piezas personalizadas y cualquier detalle de tu experiencia como miembro de The Circle.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/524626217960?text=Hola%20Minerva,%20soy%20miembro%20de%20The%20Circle..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-oro-antiguo text-verde-ebano text-xs uppercase tracking-[0.5em] px-8 py-4 hover:bg-hueso-seda font-bold transition-colors group shadow-md"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                  Abrir WhatsApp (+52 462 621 7960)
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:concierge@minervaalcarazjoyeria.mx"
                  className="flex items-center justify-center gap-3 border border-white/20 text-white text-xs uppercase tracking-[0.4em] px-8 py-4 hover:border-oro-antiguo hover:text-oro-antiguo transition-colors"
                >
                  Enviar Correo
                </a>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-white font-semibold">
                Respuesta garantizada en menos de 4 horas en días hábiles
              </p>
            </div>

            {/* ── CLIENT BESPOKE REQUESTS TRACKER ───────────────────────── */}
            <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBB67B]/15 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-semibold">
                    Seguimiento en Vivo
                  </span>
                  <h3 className="text-xl font-display text-white font-bold mt-1">
                    Mis Solicitudes de Co-Creación &amp; Joyas Personalizadas
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={loadRequests}
                    disabled={isLoadingRequests}
                    className="p-2 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[#CBB67B] transition-all"
                    title="Actualizar estado"
                  >
                    <RefreshCw size={14} className={isLoadingRequests ? "animate-spin" : ""} />
                  </button>

                  <Link
                    href="/personalized"
                    className="px-4 py-2 bg-oro-antiguo text-verde-ebano text-xs uppercase tracking-widest font-bold hover:bg-hueso-seda transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Nueva Solicitud</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {isLoadingRequests ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-32 bg-[#2C3729]/50 border border-[#CBB67B]/10" />
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 px-4 border border-[#CBB67B]/15 bg-[#2C3729]/20 space-y-4">
                  <Sparkles size={28} className="text-oro-antiguo/50 mx-auto" strokeWidth={1} />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-white">
                      No tienes solicitudes de co-creación activas
                    </p>
                    <p className="text-xs text-[#E5DBD6]/70 max-w-md mx-auto">
                      Diseña junto a Minerva Alcaraz una pieza a la medida para inmortalizar tus momentos más preciados.
                    </p>
                  </div>
                  <Link
                    href="/personalized"
                    className="inline-block mt-2 px-6 py-3 border border-oro-antiguo text-oro-antiguo text-xs uppercase tracking-widest font-bold hover:bg-oro-antiguo hover:text-verde-ebano transition-all"
                  >
                    Iniciar Ritual de Co-Creación
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {requests.map((req) => {
                    const statusConfig = STATUS_LABELS[req.status] || {
                      label: req.status,
                      color: "bg-gray-800 border-gray-600 text-gray-300",
                      icon: Clock,
                    };
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={req.id}
                        className="bg-[#2C3729]/40 border border-[#CBB67B]/25 p-6 space-y-5 text-left transition-all hover:border-[#CBB67B]/50"
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBB67B]/15 pb-4">
                          <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-oro-antiguo font-bold">
                              {req.request_number}
                            </span>
                            <p className="text-xs text-[#8E9A8B] mt-0.5">
                              Registrada el {new Date(req.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
                            </p>
                          </div>

                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs uppercase tracking-wider font-semibold self-start sm:self-auto ${statusConfig.color}`}>
                            <StatusIcon size={14} />
                            <span>{statusConfig.label}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-oro-antiguo font-bold">
                            Concepto de la Joya
                          </span>
                          <p className="text-sm text-[#E5DBD6] leading-relaxed italic">
                            "{req.description}"
                          </p>
                        </div>

                        {/* Specs grid */}
                        {(req.desired_material || req.desired_stone || req.desired_size || req.engraving_text || req.quoted_price_cents) && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#1F271D]/60 border border-[#CBB67B]/15 p-4 text-xs">
                            {req.desired_material && (
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">Material</span>
                                <p className="text-white font-medium mt-0.5">{req.desired_material}</p>
                              </div>
                            )}
                            {req.desired_stone && (
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">Gema</span>
                                <p className="text-white font-medium mt-0.5">{req.desired_stone}</p>
                              </div>
                            )}
                            {req.desired_size && (
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">Medida / Talla</span>
                                <p className="text-white font-medium mt-0.5">{req.desired_size}</p>
                              </div>
                            )}
                            {req.quoted_price_cents && (
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">Cotización</span>
                                <p className="text-oro-antiguo font-bold font-mono mt-0.5">
                                  {formatCurrency(req.quoted_price_cents)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Communication Log / Notes from Atelier */}
                        {req.communication_log && req.communication_log.length > 0 && (
                          <div className="space-y-2 border-t border-[#CBB67B]/15 pt-4">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8E9A8B] font-bold block">
                              Bitácora de Avance del Atelier
                            </span>
                            <div className="space-y-2 pl-3 border-l-2 border-[#CBB67B]/40">
                              {req.communication_log.map((log, idx) => (
                                <div key={idx} className="text-xs space-y-0.5">
                                  <div className="flex items-center gap-2 text-[10px] text-[#8E9A8B]">
                                    <span className="text-oro-antiguo font-bold uppercase tracking-wider">
                                      {log.role === "admin" ? "Atelier Minerva" : "Sistema"}
                                    </span>
                                    <span>·</span>
                                    <span>{new Date(log.timestamp).toLocaleDateString("es-MX")}</span>
                                  </div>
                                  <p className="text-[#E5DBD6]">{log.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action WhatsApp */}
                        <div className="flex justify-end pt-2">
                          <a
                            href={`https://wa.me/524626217960?text=${encodeURIComponent(`Hola Minerva, deseo consultar el estado de mi solicitud de co-creación ${req.request_number}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C3729] hover:bg-oro-antiguo hover:text-verde-ebano text-oro-antiguo border border-[#CBB67B]/40 text-[11px] uppercase tracking-widest font-bold transition-all"
                          >
                            <MessageCircle size={13} />
                            <span>Consultar con Minerva por WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Consulta de Estilo", desc: "Selección personalizada de piezas según tu gusto y ocasión" },
                { title: "Visita al Atelier", desc: "Agenda una visita privada para conocer el proceso artesanal" },
                { title: "Co-Creación", desc: "Diseña con Minerva tu pieza completamente única" },
              ].map((s) => (
                <div key={s.title} className="bg-[#1E261C] border border-[#CBB67B]/25 p-6 flex flex-col gap-2 shadow-md text-left">
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[#CBB67B] font-bold">{s.title}</h3>
                  <p className="text-xs text-white leading-relaxed font-light">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
