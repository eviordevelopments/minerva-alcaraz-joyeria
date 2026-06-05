"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  AlertTriangle,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";

interface Recurso {
  id: string;
  nombre_recurso: string;
}

interface Cita {
  id: string;
  recursoId: string;
  recursoNombre: string;
  horaInicio: string;
  horaFin: string;
  rawStart: string | null;
  rawEnd: string | null;
  motivo: string;
  status: string;
}

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];

export default function AdminShowroom() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedRecurso, setSelectedRecurso] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formCliente, setFormCliente] = useState("");
  const [formRecursoId, setFormRecursoId] = useState("");
  const [formInicio, setFormInicio] = useState("10:00");
  const [formFin, setFormFin] = useState("12:00");
  const [formMotivo, setFormMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlapError, setOverlapError] = useState("");

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/showroom");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setRecursos(json.recursos ?? []);
      setCitas(json.citas ?? []);
      if (json.recursos?.length > 0 && !formRecursoId) {
        setFormRecursoId(json.recursos[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    setOverlapError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/showroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recursoId: formRecursoId,
          cliente: formCliente,
          horaInicio: formInicio,
          horaFin: formFin,
          motivo: formMotivo,
        }),
      });
      const json = await res.json();

      if (json.isOverlap) {
        setOverlapError(json.error);
        return;
      }
      if (!res.ok || json.error) throw new Error(json.error);

      setShowModal(false);
      setFormCliente("");
      setFormMotivo("");
      setOverlapError("");
      await loadData(); // Reload from DB
    } catch (err: unknown) {
      setOverlapError(
        err instanceof Error ? err.message : "Error al crear cita"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelCita(id: string) {
    try {
      await fetch("/api/admin/showroom", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadData();
    } catch {
      // silent
    }
  }

  const filteredCitas = citas.filter(
    (c) => selectedRecurso === "all" || c.recursoId === selectedRecurso
  );

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Planificación Real · Supabase Live
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Showroom &amp; Atelier Calendar
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="w-9 h-9 border border-[#CBB67B]/30 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] transition-all"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              setOverlapError("");
            }}
            className="flex items-center gap-2 border border-[#CBB67B] px-5 py-2.5 bg-[#CBB67B]/10 hover:bg-[#CBB67B] hover:text-[#1F271D] text-xs uppercase tracking-widest text-[#CBB67B] transition-all font-semibold"
          >
            <Plus size={14} />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Error al cargar el showroom</p>
            <p className="text-[9px] opacity-80">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left: Recursos */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9A8B] font-bold">
            Espacios del Showroom
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-[#1F271D] border border-[#CBB67B]/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recursos.map((rec) => {
                const citasRec = citas.filter((c) => c.recursoId === rec.id);
                return (
                  <div key={rec.id} className="bg-[#1F271D] border border-[#CBB67B]/15 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#CBB67B]">
                      <MapPin size={14} />
                      <h4 className="text-sm font-semibold tracking-wider font-display-erp">
                        {rec.nombre_recurso}
                      </h4>
                    </div>
                    <p className="text-[10px] text-[#8E9A8B]">
                      {citasRec.length === 0
                        ? "Sin citas activas"
                        : `${citasRec.length} cita${citasRec.length > 1 ? "s" : ""} activa${citasRec.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-[#2C3729]/50 border border-[#CBB67B]/15 p-5 space-y-2.5">
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
              Garantía de Privacidad Absoluta
            </span>
            <p className="text-[10px] text-[#8E9A8B] leading-relaxed font-light">
              Las citas se validan contra una restricción de exclusión TSTZRANGE en la base de datos (PostgreSQL GiST). Dos citas no pueden solaparse en el mismo espacio.
            </p>
          </div>
        </div>

        {/* Right: Calendar view */}
        <div className="lg:col-span-8 bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#CBB67B]/10 pb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#E5DBD6]">
              Agenda del Día
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Filtro:</span>
              <select
                value={selectedRecurso}
                onChange={(e) => setSelectedRecurso(e.target.value)}
                className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#E5DBD6] outline-none"
              >
                <option value="all">Ver Todos</option>
                {recursos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre_recurso}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-[#2C3729]/30 border border-[#CBB67B]/10 animate-pulse" />
              ))
            ) : (
              TIME_SLOTS.map((time) => {
                // Find citas that overlap this hour
                const hour = parseInt(time.split(":")[0]);
                const activeCita = filteredCitas.find((c) => {
                  const start = parseInt(c.horaInicio.split(":")[0]);
                  const end = parseInt(c.horaFin.split(":")[0]);
                  return hour >= start && hour < end;
                });

                return (
                  <div
                    key={time}
                    className={`grid grid-cols-12 border items-center p-3 sm:p-4 gap-3 transition-all ${
                      activeCita
                        ? "bg-[#CBB67B]/5 border-[#CBB67B]"
                        : "bg-[#2C3729]/10 border-[#CBB67B]/10 hover:border-[#CBB67B]/30"
                    }`}
                  >
                    <div className="col-span-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#CBB67B]">
                      <Clock size={12} />
                      <span>{time}</span>
                    </div>

                    <div className="col-span-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                      {activeCita ? (
                        <>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase tracking-wider text-[#CBB67B] font-semibold">
                              {activeCita.motivo}
                            </span>
                            <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">
                              {activeCita.recursoNombre} ·{" "}
                              {activeCita.horaInicio}–{activeCita.horaFin}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] uppercase tracking-widest border border-[#CBB67B]/30 px-2 py-0.5 bg-[#1F271D] text-[#CBB67B]">
                              {activeCita.status}
                            </span>
                            <button
                              onClick={() => handleCancelCita(activeCita.id)}
                              title="Cancelar cita"
                              className="text-red-400/60 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] uppercase tracking-widest italic text-[#8E9A8B]/50">
                            Disponible para exhibiciones
                          </span>
                          <button
                            onClick={() => {
                              const nextHour =
                                String(
                                  Math.min(parseInt(time.split(":")[0]) + 2, 18)
                                ).padStart(2, "0") + ":00";
                              setFormInicio(time);
                              setFormFin(nextHour);
                              setShowModal(true);
                              setOverlapError("");
                            }}
                            className="text-[8px] uppercase tracking-widest font-semibold hover:text-[#CBB67B] border border-[#CBB67B]/10 hover:border-[#CBB67B]/40 px-3 py-1.5 transition-all text-[#8E9A8B] w-fit"
                          >
                            Reservar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!isLoading && filteredCitas.length === 0 && (
            <div className="mt-8 text-center text-[#8E9A8B] flex flex-col items-center gap-3">
              <Calendar size={20} className="text-[#CBB67B]/30" />
              <span className="text-[9px] uppercase tracking-widest">
                Sin citas agendadas hoy
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowModal(false);
                setOverlapError("");
              }}
              className="fixed inset-0 bg-black z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#1F271D] border border-[#CBB67B] p-6 sm:p-8 z-50 text-left shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-[#CBB67B]/10 pb-4">
                <div className="flex items-center gap-2 text-[#CBB67B]">
                  <Calendar size={16} />
                  <h3 className="font-display-erp text-lg font-bold tracking-wider">
                    Nueva Cita Showroom
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setOverlapError("");
                  }}
                  className="text-[#8E9A8B] hover:text-[#CBB67B] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Overlap error */}
              <AnimatePresence>
                {overlapError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-950/80 border border-red-500/40 p-4 text-red-300 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                      <span className="text-[9px] uppercase tracking-wider font-bold">
                        Violación de Exclusión Temporal
                      </span>
                    </div>
                    <p className="text-[9px] leading-relaxed">{overlapError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">
                    Nombre del Cliente VIP *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María Inés"
                    value={formCliente}
                    onChange={(e) => setFormCliente(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">
                    Espacio Físico *
                  </label>
                  <select
                    value={formRecursoId}
                    onChange={(e) => setFormRecursoId(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full"
                    required
                  >
                    {recursos.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre_recurso}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Hora Entrada</label>
                    <select
                      value={formInicio}
                      onChange={(e) => setFormInicio(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Hora Salida</label>
                    <select
                      value={formFin}
                      onChange={(e) => setFormFin(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono"
                    >
                      {TIME_SLOTS.filter(
                        (t) => parseInt(t) > parseInt(formInicio)
                      ).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Motivo de la Visita *</label>
                  <input
                    type="text"
                    placeholder="Ej: Co-creación de anillo de compromiso"
                    value={formMotivo}
                    onChange={(e) => setFormMotivo(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#CBB67B] hover:bg-[#E4D5A4] disabled:opacity-50 text-[#1F271D] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>Agendar y Validar en DB</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
