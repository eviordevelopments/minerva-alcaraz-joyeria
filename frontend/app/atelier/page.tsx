"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProductCard } from "../../components/DesignSystem";
import { useAuthStore } from "../../lib/store/useAuthStore";

import Link from "next/link";
import { 
  Crown, Lock, Calendar, MapPin, Clock, Sparkles, 
  Check, ArrowRight, Compass, ShieldCheck 
} from "lucide-react";

// Mock pending special deliveries for the Circle member
const MOCK_DELIVERIES = [
  {
    id: "del-01",
    productName: "Anillo Perla de Roca",
    sku: "MA-IND-002",
    status: "Listo para entrega",
    description: "Montura en Plata Ley .950, Perla Negra de Tahití. Talla 7.",
    image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_300/v1778295601/minerva_joyeria/products/individuales/MINE-52.jpg",
  },
  {
    id: "del-02",
    productName: "Set Vuelo Etéreo",
    sku: "MA-ETE-001",
    status: "En preparación",
    description: "Oro Blanco 14k, Zafiros Blancos. Grabado personalizado: 'Para siempre'.",
    image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_300/v1778294826/minerva_joyeria/products/eterea/Minerva2-2.jpg",
  }
];

export default function AtelierPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // Booking states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedRecursoId, setSelectedRecursoId] = useState("");
  const [recursos, setRecursos] = useState<{ id: string; nombre_recurso: string }[]>([]);
  const [motivoVisita, setMotivoVisita] = useState("Exhibición Privada y Recolección de Piezas");
  const [selectedTable, setSelectedTable] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Load resources from DB
  useEffect(() => {
    if (isAuthenticated && user?.isCircleMember) {
      fetch("/api/admin/showroom")
        .then((res) => res.json())
        .then((data) => {
          if (data.recursos && data.recursos.length > 0) {
            setRecursos(data.recursos);
            setSelectedRecursoId(data.recursos[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  const [atelierProducts, setAtelierProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => {
        const prods = d.products || [];
        setAtelierProducts(prods.filter((p: any) => p.tags?.includes("Atelier")));
      })
      .catch(console.error);
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    if (!selectedDate || !selectedTime || !selectedRecursoId) return;

    const slotMap: Record<string, { start: string; end: string }> = {
      "10:00 AM": { start: "10:00", end: "11:30" },
      "11:30 AM": { start: "11:30", end: "13:00" },
      "01:00 PM": { start: "13:00", end: "14:30" },
      "04:00 PM": { start: "16:00", end: "17:30" },
      "05:30 PM": { start: "17:30", end: "19:00" },
    };

    const slot = slotMap[selectedTime];
    if (!slot) {
      setBookingError("Rango horario inválido");
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch("/api/admin/showroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recursoId: selectedRecursoId,
          cliente: user?.fullName || user?.email || "Miembro de The Circle",
          horaInicio: slot.start,
          horaFin: slot.end,
          motivo: motivoVisita,
          fecha: selectedDate,
        }),
      });

      const json = await res.json();
      if (json.isOverlap) {
        setBookingError("El espacio seleccionado ya está ocupado en ese horario. Por favor elija otra hora o mesa.");
        return;
      }
      if (!res.ok || json.error) throw new Error(json.error ?? "Error al reservar");

      // Save resource name for success display
      const selectedRecurso = recursos.find((r) => r.id === selectedRecursoId);
      setSelectedTable(selectedRecurso ? selectedRecurso.nombre_recurso : "Mesa de Atención");
      setIsBooked(true);
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Error al procesar la cita");
    } finally {
      setBookingLoading(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-hueso-seda flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-12 h-12 border-t-2 border-oro-antiguo rounded-full"
          />
          <span className="text-[10px] uppercase tracking-[0.6em] text-verde-ebano/60">Verificando acceso...</span>
        </div>
      </main>
    );
  }

  // 2. Locked Screen State (Non-members or Unauthenticated)
  if (!isAuthenticated || (user && !user.isCircleMember)) {
    return (
      <main className="min-h-screen bg-verde-ebano text-hueso-seda flex flex-col justify-between relative overflow-hidden">
        <Header />
        
        {/* Background Decorative Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-oro-antiguo/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-oro-antiguo/10 rounded-full pointer-events-none" />

        <div className="flex-1 flex items-start md:items-center justify-center z-10 px-4 sm:px-6 pt-44 md:pt-56 pb-24 md:pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-xl md:max-w-2xl text-center flex flex-col items-center gap-6 md:gap-8 bg-[#1B2319]/80 backdrop-blur-md border border-oro-antiguo/10 p-6 sm:p-12 md:p-16"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 border border-oro-antiguo/30 flex items-center justify-center relative">
              <Lock size={18} strokeWidth={1} className="text-oro-antiguo" />
              <div className="absolute -inset-0.5 border border-oro-antiguo/10 animate-pulse" />
            </div>
            
            <div className="flex flex-col gap-2 md:gap-3">
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.8em] text-oro-antiguo">El Santuario Privado</span>
              <h1 className="text-xl sm:text-3xl md:text-5xl font-display text-hueso-seda leading-tight hero-title-no-hyphens">Atelier Minerva Alcaraz</h1>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-hueso-seda/70 font-light">
              El Atelier es un espacio dedicado a la entrega de piezas especiales, la muestra de colecciones exclusivas y la co-creación personalizada con Minerva Alcaraz.
            </p>
            
            <p className="text-[10px] sm:text-xs text-oro-antiguo/90 font-light max-w-md">
              El acceso físico y digital está estrictamente limitado a los miembros registrados en <strong className="font-semibold text-oro-antiguo">THE CIRCLE</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
              <Link 
                href="/auth"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-oro-antiguo text-verde-ebano text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-hueso-seda transition-all duration-500 font-medium text-center"
              >
                Acceder a su Cuenta
              </Link>
              <Link 
                href="/the-circle"
                className="px-6 py-3.5 sm:px-8 sm:py-4 border border-hueso-seda/25 text-hueso-seda text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-hueso-seda hover:text-verde-ebano transition-all duration-500 text-center"
              >
                Conocer The Circle
              </Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    );
  }

  // 3. Authorized View (THE CIRCLE Members)
  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative pt-44 pb-32 overflow-hidden border-b border-verde-ebano/10">
        <div className="absolute inset-0 bg-[#F4EDE9]/40 z-0" />
        <div className="luxury-container relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Crown size={12} className="text-oro-antiguo animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">Espacio Exclusivo The Circle</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display text-verde-ebano leading-none">
            El Atelier
          </h1>
          <p className="text-sm md:text-base text-verde-ebano/70 max-w-2xl leading-relaxed font-light mt-2">
            Bienvenido al espacio exclusivo de entrega y muestra del Atelier. Aquí encontrarás tus piezas en custodia, colecciones especiales y la posibilidad de agendar tu próxima visita.
          </p>
        </div>
      </section>

      {/* Special Deliveries & Scheduling Section */}
      <section className="py-24 border-b border-verde-ebano/5">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side: Pending Deliveries */}
            <div className="lg:col-span-6 flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-oro-antiguo">Adquisiciones de Autor</span>
                <h2 className="text-3xl font-display text-verde-ebano">Piezas Especiales en Custodia</h2>
                <p className="text-xs text-verde-ebano/60 font-light mt-1">
                  A continuación se enlistan las piezas que actualmente están en nuestro Atelier, listas para ser recolectadas bajo cita presencial.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {MOCK_DELIVERIES.map((item) => (
                  <div key={item.id} className="bg-white border border-verde-ebano/15 p-6 flex flex-col sm:flex-row gap-6 hover:border-oro-antiguo transition-colors duration-500">
                    <div className="w-24 h-32 relative bg-plata-niebla/15 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.productName} className="object-cover w-full h-full" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-xs uppercase tracking-widest font-semibold text-verde-ebano">{item.productName}</h3>
                          <span className={`text-[8px] uppercase tracking-wider px-2 py-1 ${
                            item.status.includes("Listo") 
                              ? "bg-verde-ebano text-hueso-seda" 
                              : "border border-oro-antiguo text-oro-antiguo"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <span className="text-[9px] text-verde-ebano/40 font-mono">{item.sku}</span>
                        <p className="text-[10px] text-verde-ebano/70 leading-relaxed mt-2">{item.description}</p>
                      </div>
                      
                      {item.status.includes("Listo") && (
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-oro-profundo font-semibold">
                          <ShieldCheck size={12} /> Custodiado en Bóveda Principal
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Appointment Scheduler */}
            <div className="lg:col-span-6 bg-white border border-verde-ebano/15 p-8 md:p-12 flex flex-col gap-8 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-oro-antiguo">El Ritual de Recolección</span>
                <h2 className="text-2xl font-display text-verde-ebano">Agendar Cita en Atelier</h2>
                <p className="text-[10px] text-verde-ebano/50 leading-relaxed">
                  Evite superposiciones en nuestras mesas de exhibición. Cada cita cuenta con la atención exclusiva de un maestro joyero. Ubicación: San Miguel de Allende, Gto.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!isBooked ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleBookAppointment}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-verde-ebano/60">Recurso/Mesa de Atención</label>
                      <select 
                        value={selectedRecursoId} 
                        onChange={(e) => setSelectedRecursoId(e.target.value)}
                        className="bg-transparent border-b border-verde-ebano/15 py-3 text-xs text-verde-ebano outline-none focus:border-oro-antiguo transition-colors cursor-pointer w-full"
                      >
                        {recursos.length > 0 ? (
                          recursos.map((rec) => (
                            <option key={rec.id} value={rec.id}>
                              {rec.nombre_recurso}
                            </option>
                          ))
                        ) : (
                          <option value="">Cargando espacios...</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-verde-ebano/60">Motivo de la Visita</label>
                      <input 
                        type="text"
                        required
                        value={motivoVisita}
                        onChange={(e) => setMotivoVisita(e.target.value)}
                        placeholder="Ej: Recolección de pieza de autor"
                        className="bg-transparent border-b border-verde-ebano/15 py-3 text-xs text-verde-ebano outline-none focus:border-oro-antiguo transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-verde-ebano/60">Seleccionar Fecha</label>
                        <input 
                          type="date" 
                          required
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="bg-transparent border-b border-verde-ebano/15 py-3 text-xs text-verde-ebano outline-none focus:border-oro-antiguo transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-verde-ebano/60">Hora de Cita</label>
                        <select 
                          required
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="bg-transparent border-b border-verde-ebano/15 py-3 text-xs text-verde-ebano outline-none focus:border-oro-antiguo transition-colors cursor-pointer"
                        >
                          <option value="">Seleccione hora...</option>
                          <option>10:00 AM</option>
                          <option>11:30 AM</option>
                          <option>01:00 PM</option>
                          <option>04:00 PM</option>
                          <option>05:30 PM</option>
                        </select>
                      </div>
                    </div>

                    {bookingError && (
                      <div className="text-[10px] text-red-600 bg-red-50 border border-red-200/50 p-4 leading-relaxed uppercase tracking-wide">
                        {bookingError}
                      </div>
                    )}

                    <div className="flex items-start gap-3 bg-hueso-seda/30 p-4 border border-verde-ebano/5 mt-2">
                      <MapPin size={14} className="text-oro-antiguo flex-shrink-0 mt-0.5" />
                      <p className="text-[9px] text-verde-ebano/60 leading-relaxed uppercase tracking-tighter">
                        Flagship Atelier Boutique: Calle Real de Correo #18, Zona Centro, San Miguel de Allende, México.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-verde-ebano text-hueso-seda hover:bg-oro-antiguo hover:text-verde-ebano font-medium text-[10px] uppercase tracking-widest py-4 transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      {bookingLoading ? (
                        <div className="w-4 h-4 border-2 border-hueso-seda border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Confirmar Cita & Bloquear Mesa</>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center gap-6 py-8 border border-oro-antiguo/30 bg-[#FAF7F5] p-8"
                  >
                    <div className="w-12 h-12 rounded-full border border-oro-antiguo flex items-center justify-center text-oro-antiguo">
                      <Check size={18} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm uppercase tracking-widest font-semibold text-verde-ebano">Cita Registrada con Éxito</h3>
                      <p className="text-[10px] text-verde-ebano/70 leading-relaxed max-w-sm">
                        Su mesa en <strong className="font-semibold">{selectedTable}</strong> ha sido reservada para el <strong className="font-semibold">{selectedDate}</strong> a las <strong className="font-semibold">{selectedTime}</strong>. Un asesor gemólogo le asistirá personalmente.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsBooked(false)}
                      className="text-[9px] uppercase tracking-widest text-oro-antiguo hover:underline"
                    >
                      Agendar otra Cita
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* Atelier Products Curated List */}
      <section className="py-24 bg-white">
        <div className="luxury-container flex flex-col gap-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-verde-ebano/10 pb-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[9px] uppercase tracking-widest text-oro-antiguo">Curaduría Especial</span>
              <h2 className="text-3xl md:text-4xl font-display text-verde-ebano">Muestra de Atelier</h2>
              <p className="text-xs text-verde-ebano/60 leading-relaxed font-light mt-1">
                Catálogo exclusivo de piezas de autor y colecciones limitadas disponibles en exhibición privada dentro de nuestro Atelier.
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-medium border border-oro-antiguo/30 px-3 py-1.5 text-oro-antiguo">
              {atelierProducts.length} Piezas en Atelier
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {atelierProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Narrative Segment */}
      <section className="py-32 bg-[#1B2319] text-hueso-seda relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(203,182,123,0.05),transparent_70%)]" />
        
        <div className="luxury-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <span className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo">Santuario Físico</span>
            <h2 className="text-3xl md:text-5xl font-display text-hueso-seda leading-tight">San Miguel de Allende</h2>
            <p className="text-xs leading-relaxed text-hueso-seda/70 font-light">
              Nuestra sede se aloja en una casona colonial del siglo XVIII, donde el diseño digital interactivo se funde con los muros de cantera y los árboles de olivo. Un espacio de silencio acústico y visual diseñado para que su atención repose únicamente en la armonía geométrica del metal y las gemas preciosas.
            </p>
            <div className="flex flex-col gap-4 text-[9px] uppercase tracking-widest text-oro-antiguo/90 font-light">
              <div className="flex items-center gap-3">
                <MapPin size={12} /> San Miguel de Allende, Centro Histórico
              </div>
              <div className="flex items-center gap-3">
                <Clock size={12} /> Lunes a Sábado: 11:00 AM — 07:00 PM
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 aspect-video relative bg-[#121811] border border-oro-antiguo/10 flex items-center justify-center overflow-hidden">
            <div className="text-center flex flex-col items-center gap-3 p-8">
              <Compass size={32} strokeWidth={0.8} className="text-oro-antiguo/40 animate-pulse" />
              <span className="text-[8px] uppercase tracking-[0.4em] text-hueso-seda/50">Cinemática del Atelier en Vivo</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
