"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Clock, 
  Hammer, 
  Truck, 
  CheckCircle, 
  CornerDownRight, 
  Search, 
  User,
  MessageSquare
} from "lucide-react";

export default function AdminConcierge() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(1);
  const [newLog, setNewLog] = useState("");

  const orders = [
    {
      id: 1,
      orderNumber: "1024",
      clientName: "Adriana Garza",
      specifications: "Anillo de Oro Blanco 14k, Talla 6.5, Engaste de Rubí natural central de 2ct. Grabado interior: 'Eterno 2026'.",
      status: "Elaboración",
      value: "$145,000 MXN",
      deliveryDate: "12 Jun 2026",
      artisanNotes: "Molde de cera perdida completado satisfactoriamente. Iniciando fundición de oro blanco 14k el día de hoy.",
      artisanName: "Maestro Orfebre Hector M.",
      history: [
        { status: "Recibido", time: "18 May 2026", note: "Diseño aprobado por la Directora Creativa Minerva Alcaraz." },
        { status: "En preparación", time: "19 May 2026", note: "Selección gemológica aprobada en el Atelier Principal." },
        { status: "Elaboración", time: "20 May 2026", note: "Moldeado a cera perdida e inicio de esculpido de engastes." }
      ]
    },
    {
      id: 2,
      orderNumber: "1025",
      clientName: "Carlos Slim Jr.",
      specifications: "Collar Chai en Plata Ley .950, diseño extra grueso con baño de Oro Amarillo 24k e incrustación de Zafiros Blancos.",
      status: "En preparación",
      value: "$180,000 MXN",
      deliveryDate: "20 Jun 2026",
      artisanNotes: "En espera de aprobación final de los zafiros seleccionados en valija internacional.",
      artisanName: "Maestra Orfebre Laura G.",
      history: [
        { status: "Recibido", time: "18 May 2026", note: "Orden especial registrada por el concierge ejecutivo VIP." }
      ]
    },
    {
      id: 3,
      orderNumber: "1026",
      clientName: "Mariana Rodríguez",
      specifications: "Sets de Pendientes y Pulsera Floral de Oro 14k con Perlas Negras de Tahití coleccionadas de forma simétrica.",
      status: "Recibido",
      value: "$210,000 MXN",
      deliveryDate: "05 Jul 2026",
      artisanNotes: "Búsqueda activa de perlas negras simétricas con el brillo y matiz exacto solicitado.",
      artisanName: "Maestro Orfebre Hector M.",
      history: [
        { status: "Recibido", time: "19 May 2026", note: "Pedido de Concierge iniciado tras depósito del 50% de anticipo." }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Recibido": return <Clock size={16} className="text-[#8E9A8B]" />;
      case "En preparación": return <Sparkles size={16} className="text-[#CBB67B]" />;
      case "Elaboración": return <Hammer size={16} className="text-[#CBB67B] animate-spin-slow" />;
      case "Enviando": return <Truck size={16} className="text-[#CBB67B]" />;
      case "Entregado": return <CheckCircle size={16} className="text-emerald-400" />;
      default: return <Clock size={16} />;
    }
  };

  const currentOrder = orders.find(o => o.id === selectedOrder);

  const filteredOrders = orders.filter(o => 
    o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.orderNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Orfebrería de Lujo y Seguimiento VIP
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Concierge &amp; Co-Creación
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar por cliente u orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1F271D] border border-[#CBB67B]/30 pl-10 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-64 rounded-none"
          />
          <Search size={14} className="absolute left-3.5 text-[#8E9A8B]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left column: Orders list */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-[10px] uppercase tracking-widest text-[#8E9A8B] font-bold">
            Órdenes Activas
          </h3>

          <div className="space-y-3">
            {filteredOrders.map((ord) => {
              const isSelected = ord.id === selectedOrder;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord.id)}
                  className={`border p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                    isSelected 
                      ? "bg-[#1F271D] border-[#CBB67B]" 
                      : "bg-[#1F271D]/40 border-[#CBB67B]/15 hover:border-[#CBB67B]/40"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-[#CBB67B] font-mono">
                        Orden #{ord.orderNumber}
                      </span>
                      <h4 className="text-sm font-semibold tracking-wide text-[#E5DBD6] mt-1">
                        {ord.clientName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 border border-[#CBB67B]/20 px-2.5 py-1 bg-[#2C3729]/50">
                      {getStatusIcon(ord.status)}
                      <span className="text-[8px] uppercase tracking-wider text-[#CBB67B]">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#8E9A8B] leading-relaxed line-clamp-2 italic">
                    "{ord.specifications}"
                  </p>

                  <div className="border-t border-[#CBB67B]/10 pt-3 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#8E9A8B]">
                    <span>Entrega: {ord.deliveryDate}</span>
                    <span className="font-bold text-[#E5DBD6] font-mono">{ord.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Order detail */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentOrder ? (
              <motion.div
                key={currentOrder.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-[#1F271D] border border-[#CBB67B]/20 p-6 sm:p-8 space-y-6"
              >
                {/* Header detail */}
                <div className="border-b border-[#CBB67B]/10 pb-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-[#CBB67B] font-mono">
                      Seguimiento de Co-Creación #{currentOrder.orderNumber}
                    </span>
                    <h2 className="text-xl font-bold tracking-wide mt-1 text-[#E5DBD6]">
                      {currentOrder.clientName}
                    </h2>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#CBB67B]">
                    {currentOrder.value}
                  </span>
                </div>

                {/* Specifics */}
                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold">
                    Especificaciones Exclusivas
                  </span>
                  <p className="text-[11px] text-[#E5DBD6]/80 leading-relaxed font-light">
                    {currentOrder.specifications}
                  </p>
                </div>

                {/* Artisan comments */}
                <div className="bg-[#2C3729]/50 border border-[#CBB67B]/15 p-5 space-y-2 relative">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
                    Bitácora del Taller &amp; Avance Artesanal
                  </span>
                  <p className="text-[11px] text-[#8E9A8B] leading-relaxed italic">
                    "{currentOrder.artisanNotes}"
                  </p>
                  <div className="flex justify-between items-center border-t border-[#CBB67B]/10 pt-3 mt-3 text-[9px] uppercase tracking-widest text-[#CBB67B]/80 font-mono">
                    <span>Orfebre: {currentOrder.artisanName}</span>
                    <span>Actualizado hace 2 horas</span>
                  </div>
                </div>

                {/* Tracking Line */}
                <div className="space-y-4">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
                    Línea de Custodia Relacional
                  </span>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#CBB67B]/20">
                    {currentOrder.history.map((hist, idx) => (
                      <div key={idx} className="relative text-left">
                        <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-none bg-[#1F271D] border-2 border-[#CBB67B] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-[#CBB67B] rounded-none"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5DBD6]">
                            {hist.status}
                          </span>
                          <span className="text-[8px] text-[#8E9A8B] font-mono">{hist.time}</span>
                        </div>
                        <p className="text-[10px] text-[#8E9A8B] mt-1 leading-relaxed">
                          {hist.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to submit a new status or note to the VIP client portal */}
                <div className="border-t border-[#CBB67B]/10 pt-6 space-y-4">
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold block">
                    Actualizar Estado en el Portal de Cliente
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Registrar nueva nota de avance..."
                      value={newLog}
                      onChange={(e) => setNewLog(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/30 px-3 py-2 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none flex-1 rounded-none"
                    />
                    <button
                      onClick={() => setNewLog("")}
                      className="bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] font-bold text-[10px] uppercase tracking-widest px-5 transition-all rounded-none"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="bg-[#1F271D] border border-[#CBB67B]/10 p-12 text-center text-[#8E9A8B] flex flex-col items-center justify-center gap-3 h-full">
                <Sparkles size={24} className="text-[#CBB67B]/40" />
                <span className="text-xs uppercase tracking-widest">
                  Selecciona una orden de concierge para ver su seguimiento
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
