"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Check, 
  AlertTriangle,
  X,
  Plus
} from "lucide-react";

interface Cita {
  id: string;
  cliente: string;
  recursoId: string; // 'diamantes' o 'cubiculo1'
  horaInicio: string; // "10:00"
  horaFin: string; // "12:00"
  motivo: string;
  status: string;
}

export default function AdminShowroom() {
  const [selectedRecurso, setSelectedRecurso] = useState("all");
  
  // Available resources
  const recursos = [
    { id: "diamantes", nombre: "Mesa Principal de Diamantes", descripcion: "Exhibidor central con iluminación gemológica" },
    { id: "cubiculo1", nombre: "Cubículo Privado de Atención", descripcion: "Área de privacidad blindada con atención personalizada" }
  ];

  // Active bookings list
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: "1",
      cliente: "Adriana Garza",
      recursoId: "cubiculo1",
      horaInicio: "11:00",
      horaFin: "13:00",
      motivo: "Visualización de Colección Etérea",
      status: "Confirmada"
    },
    {
      id: "2",
      cliente: "Carlos Slim Jr.",
      recursoId: "diamantes",
      horaInicio: "12:00",
      horaFin: "14:00",
      motivo: "Diseño de Autor a medida",
      status: "Confirmada"
    }
  ]);

  // Form states
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formCliente, setFormCliente] = useState("");
  const [formRecurso, setFormRecurso] = useState("diamantes");
  const [formInicio, setFormInicio] = useState("10:00");
  const [formFin, setFormFin] = useState("12:00");
  const [formMotivo, setFormMotivo] = useState("Visualización de catálogo");
  
  // Error state for simulated PostgreSQL Exclusion Violation (Error 23P01)
  const [overlapError, setOverlapError] = useState("");

  const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  // Check if a time range overlaps with another for a resource
  const checkOverlap = (recursoId: string, inicio: string, fin: string) => {
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(inicio);
    const newEnd = toMinutes(fin);

    return citas.some(cita => {
      if (cita.recursoId !== recursoId) return false;
      const citaStart = toMinutes(cita.horaInicio);
      const citaEnd = toMinutes(cita.horaFin);

      // Overlap logic: newStart < citaEnd && newEnd > citaStart
      return newStart < citaEnd && newEnd > citaStart;
    });
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setOverlapError("");

    // Verify overlap to simulate database tstzrange prevent_showroom_overlap GiST constraint
    const hasOverlap = checkOverlap(formRecurso, formInicio, formFin);

    if (hasOverlap) {
      // Throw simulated exclusion violation error
      setOverlapError(
        "ExclusionViolation [PostgreSQL Error 23P01]: La restricción 'prevent_showroom_overlap' bloqueó la transacción de forma atómica. Ya existe una cita agendada en ese espacio físico y rango temporal."
      );
      return;
    }

    // No overlap: add booking
    const newBooking: Cita = {
      id: Date.now().toString(),
      cliente: formCliente,
      recursoId: formRecurso,
      horaInicio: formInicio,
      horaFin: formFin,
      motivo: formMotivo,
      status: "Pendiente de confirmación"
    };

    setCitas([...citas, newBooking]);
    setShowBookingModal(false);
    // Reset form
    setFormCliente("");
  };

  return (
    <div className="space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Planificación y Prevención de Superposiciones
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Showroom &amp; Atelier Calendar
          </h1>
        </div>

        {/* Quick booking trigger */}
        <button
          onClick={() => setShowBookingModal(true)}
          className="flex items-center gap-2 border border-[#CBB67B] px-5 py-2.5 bg-[#CBB67B]/10 hover:bg-[#CBB67B] hover:text-[#1F271D] text-xs uppercase tracking-widest text-[#CBB67B] transition-all font-semibold"
        >
          <Plus size={14} />
          <span>Agendar Cita Showroom</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Side: Resources lists */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9A8B] font-bold">
            Espacios del Showroom
          </h3>

          <div className="space-y-3">
            {recursos.map((rec) => (
              <div key={rec.id} className="bg-[#1F271D] border border-[#CBB67B]/15 p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#CBB67B]">
                  <MapPin size={14} />
                  <h4 className="text-sm font-semibold tracking-wider font-display-erp">
                    {rec.nombre}
                  </h4>
                </div>
                <p className="text-[10px] text-[#8E9A8B] leading-relaxed font-light">
                  {rec.descripcion}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#2C3729]/50 border border-[#CBB67B]/15 p-5 space-y-2.5">
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
              Garantía de Privacidad Absoluta
            </span>
            <p className="text-[10px] text-[#8E9A8B] leading-relaxed font-light">
              El Atelier emplea una restricción temporal transaccional en la base de datos para impedir que dos asesores crucen citas. La mesa y cubículo privado se bloquean automáticamente durante toda la duración reservada.
            </p>
          </div>
        </div>

        {/* Right Side: Timeline Agenda */}
        <div className="lg:col-span-8 bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8">
          <div className="flex justify-between items-center border-b border-[#CBB67B]/10 pb-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#E5DBD6]">
              Agenda Diaria del Atelier
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">Filtro:</span>
              <select
                value={selectedRecurso}
                onChange={(e) => setSelectedRecurso(e.target.value)}
                className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#E5DBD6] outline-none"
              >
                <option value="all">Ver Todos</option>
                <option value="diamantes">Mesa de Diamantes</option>
                <option value="cubiculo1">Cubículo Privado</option>
              </select>
            </div>
          </div>

          {/* Time slot grid */}
          <div className="mt-8 space-y-4">
            {timeSlots.map((time) => {
              // Find if any booking starts at or includes this hour
              const activeCita = citas.find(c => {
                if (selectedRecurso !== "all" && c.recursoId !== selectedRecurso) return false;
                const parseHour = (t: string) => parseInt(t.split(":")[0]);
                const hour = parseHour(time);
                const start = parseHour(c.horaInicio);
                const end = parseHour(c.horaFin);
                return hour >= start && hour < end;
              });

              return (
                <div 
                  key={time} 
                  className={`grid grid-cols-12 border items-center p-3 sm:p-4 gap-4 transition-all ${
                    activeCita 
                      ? "bg-[#CBB67B]/5 border-[#CBB67B] text-[#CBB67B]" 
                      : "bg-[#2C3729]/10 border-[#CBB67B]/10 text-[#8E9A8B] hover:border-[#CBB67B]/30"
                  }`}
                >
                  {/* Time label */}
                  <div className="col-span-2 flex items-center gap-1.5 text-xs font-mono font-bold">
                    <Clock size={12} className="text-[#CBB67B]" />
                    <span>{time}</span>
                  </div>

                  {/* Booking content */}
                  <div className="col-span-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left">
                    {activeCita ? (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-[#CBB67B] font-semibold">
                            {activeCita.cliente} — {activeCita.motivo}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">
                            {activeCita.recursoId === "diamantes" ? "Mesa de Diamantes" : "Cubículo Privado"} | {activeCita.horaInicio} - {activeCita.horaFin}
                          </span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest border border-[#CBB67B]/30 px-2 py-0.5 bg-[#1F271D]">
                          {activeCita.status}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[9px] uppercase tracking-widest italic text-[#8E9A8B]/60">
                          Disponible para exhibiciones
                        </span>
                        <button
                          onClick={() => {
                            setFormInicio(time);
                            const nextHour = (parseInt(time.split(":")[0]) + 2).toString() + ":00";
                            setFormFin(nextHour);
                            setShowBookingModal(true);
                          }}
                          className="text-[8px] uppercase tracking-widest font-semibold hover:text-[#CBB67B] border border-[#CBB67B]/10 hover:border-[#CBB67B]/40 px-3 py-1.5 transition-all text-left w-fit"
                        >
                          Reservar Espacio
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RESERVATION MODAL WITH EXCLUSION SIMULATION */}
      <AnimatePresence>
        {showBookingModal && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowBookingModal(false);
                setOverlapError("");
              }}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Modal Box */}
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
                    setShowBookingModal(false);
                    setOverlapError("");
                  }}
                  className="text-[#8E9A8B] hover:text-[#CBB67B] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Exclusion Overlap Error representation */}
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
                      <span className="text-[9px] uppercase tracking-wider font-bold">Violación de Exclusión Temporal</span>
                    </div>
                    <p className="text-[9px] leading-relaxed text-left">
                      {overlapError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Nombre del Cliente VIP</label>
                  <input 
                    type="text" 
                    placeholder="Ej: María Inés"
                    value={formCliente}
                    onChange={(e) => setFormCliente(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full rounded-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Espacio Físico</label>
                  <select 
                    value={formRecurso}
                    onChange={(e) => setFormRecurso(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full"
                  >
                    {recursos.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Hora de Entrada</label>
                    <select
                      value={formInicio}
                      onChange={(e) => setFormInicio(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono"
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Hora de Salida</label>
                    <select
                      value={formFin}
                      onChange={(e) => setFormFin(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono"
                    >
                      {timeSlots.map(t => {
                        const isAfter = parseInt(t.split(":")[0]) > parseInt(formInicio.split(":")[0]);
                        return isAfter ? <option key={t} value={t}>{t}</option> : null;
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Motivo de la Visita</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Co-creación de anillo"
                    value={formMotivo}
                    onChange={(e) => setFormMotivo(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] w-full rounded-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  <span>Agendar y Validar Transacción</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
