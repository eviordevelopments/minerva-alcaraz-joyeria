"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Eye, 
  UserCheck, 
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [period, setPeriod] = useState("Mensual");

  // Mocked highly curated luxury metrics
  const stats = [
    {
      title: "Visitas Totales",
      value: "24,500",
      change: "+12.4%",
      isPositive: true,
      icon: Eye,
      description: "Visualizaciones únicas de PDP"
    },
    {
      title: "Carritos Abandonados",
      value: "142",
      change: "-5.8%",
      isPositive: true,
      icon: ShoppingBag,
      description: "Tasa de recuperación: 22%"
    },
    {
      title: "Ventas Concierge",
      value: "$450,000 MXN",
      change: "+18.2%",
      isPositive: true,
      icon: Sparkles,
      description: "Pedidos personalizados y co-creaciones"
    },
    {
      title: "Tasa de Conversión",
      value: "2.4%",
      change: "+0.3%",
      isPositive: true,
      icon: TrendingUp,
      description: "Promedio global del Atelier"
    }
  ];

  // Activities logs representing real-time system interactions
  const recentActivities = [
    {
      id: 1,
      user: "Carlos Slim Jr.",
      action: "Adquirió Anillo de Piedras Amatista Natural",
      details: "Transacción VIP y Custodia Prosegur activada",
      amount: "$85,000 MXN",
      time: "Hace 14 min",
      type: "circle"
    },
    {
      id: 2,
      user: "Adriana Garza",
      action: "Modificó especificaciones de co-creación",
      details: "Talla solicitada: 6.5, Detalles en Oro 14k",
      amount: "N/A",
      time: "Hace 1 hora",
      type: "concierge"
    },
    {
      id: 3,
      user: "Standard Suscriptor #182",
      action: "Se unió a la Newsletter oficial",
      details: "Email: alejandra.g@outlook.com",
      amount: "N/A",
      time: "Hace 3 horas",
      type: "newsletter"
    },
    {
      id: 4,
      user: "María Inés L.",
      action: "Agendó cita en Showroom Privado",
      details: "Mesa Principal de Diamantes - 24 May 11:00 AM",
      amount: "N/A",
      time: "Hace 5 horas",
      type: "showroom"
    }
  ];

  // Render a mocked vector SVG line graph that represents luxury vs standard sales trends
  const renderTrendsChart = () => {
    return (
      <div className="h-64 w-full relative flex items-end justify-between mt-8 border-b border-[#CBB67B]/20 pb-4">
        {/* Horizontal Guidelines */}
        <div className="absolute inset-x-0 top-0 border-t border-[#CBB67B]/5"></div>
        <div className="absolute inset-x-0 top-1/4 border-t border-[#CBB67B]/5"></div>
        <div className="absolute inset-x-0 top-2/4 border-t border-[#CBB67B]/5"></div>
        <div className="absolute inset-x-0 top-3/4 border-t border-[#CBB67B]/5"></div>

        {/* Mocked Graph Columns representing high-arousal and low-arousal buyer metrics */}
        <div className="flex-1 h-full flex items-end justify-around px-2 relative z-10">
          {[
            { month: "Ene", standard: 45, circle: 75 },
            { month: "Feb", standard: 50, circle: 80 },
            { month: "Mar", standard: 65, circle: 95 },
            { month: "Abr", standard: 55, circle: 120 },
            { month: "May", standard: 70, circle: 145 },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-12 group">
              <div className="w-full flex items-end gap-1.5 h-44 justify-center">
                {/* Standard segment */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.standard}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="w-3 bg-[#8E9A8B]/40 hover:bg-[#8E9A8B] transition-colors"
                  title={`Ventas Estándar: ${bar.standard}%`}
                />
                {/* Circle segment */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.circle}%` }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                  className="w-3 bg-[#CBB67B] hover:bg-[#E4D5A4] transition-colors"
                  title={`Ventas The Circle: ${bar.circle}%`}
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#8E9A8B]">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Métricas de Conversión y Desempeño
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Dashboard Global
          </h1>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-[#1F271D] border border-[#CBB67B]/30 p-1">
          {["Diario", "Semanal", "Mensual", "Anual"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[9px] uppercase tracking-widest px-4 py-2 transition-all ${
                period === p 
                  ? "bg-[#CBB67B] text-[#1F271D] font-bold" 
                  : "text-[#8E9A8B] hover:text-[#E5DBD6]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 hover:border-[#CBB67B]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">
                    {stat.title}
                  </span>
                  <span className="text-xl font-medium tracking-wider mt-2 font-mono">
                    {stat.value}
                  </span>
                </div>
                <div className="w-10 h-10 border border-[#CBB67B]/20 flex items-center justify-center bg-[#2C3729]/50">
                  <Icon size={16} className="text-[#CBB67B]" />
                </div>
              </div>
              <div className="border-t border-[#CBB67B]/10 mt-4 pt-4 flex items-center justify-between text-[9px] uppercase tracking-widest text-[#8E9A8B]">
                <span className="truncate max-w-[150px]">{stat.description}</span>
                <span className="text-[#CBB67B] font-bold font-mono">{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* GRAPH AND ACTIVITY LOGGER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trends Chart Widget */}
        <div className="lg:col-span-8 bg-[#1F271D] border border-[#CBB67B]/15 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#CBB67B]">
                Análisis de Demanda
              </span>
              <h3 className="text-xs uppercase tracking-[0.2em] font-medium mt-1">
                Comportamiento de Ventas de Ultra-Lujo vs Estándar
              </h3>
            </div>
            
            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#CBB67B]"></div>
                <span className="text-[#E5DBD6]">The Circle</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#8E9A8B]/40"></div>
                <span className="text-[#8E9A8B]">Estándar</span>
              </div>
            </div>
          </div>

          {renderTrendsChart()}

          <div className="mt-4 flex items-start gap-2 bg-[#2C3729]/55 border border-[#CBB67B]/10 p-3">
            <AlertCircle size={14} className="text-[#CBB67B] flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#8E9A8B] leading-relaxed text-left">
              * Nota: Las ventas provenientes de miembros de <strong className="text-[#E5DBD6]">The Circle</strong> representan el 74% de la facturación neta mensual a pesar de constituir solo el 15% del volumen total de pedidos, reafirmando el éxito del enfoque de ultra-lujo.
            </p>
          </div>
        </div>

        {/* Recent Activity Logger */}
        <div className="lg:col-span-4 bg-[#1F271D] border border-[#CBB67B]/15 p-6 flex flex-col justify-between">
          <div className="border-b border-[#CBB67B]/10 pb-4">
            <span className="text-[10px] uppercase tracking-wider text-[#CBB67B]">
              Canal de Interacciones
            </span>
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium mt-1">
              Registro del Atelier en Vivo
            </h3>
          </div>

          <div className="flex-1 my-6 space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className="text-left border-l-2 border-[#CBB67B] pl-3 py-1 space-y-1 hover:bg-[#2C3729]/40 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-[#E5DBD6] tracking-wide">
                    {act.user}
                  </span>
                  <span className="text-[8px] text-[#8E9A8B] font-mono">{act.time}</span>
                </div>
                <p className="text-[9px] text-[#8E9A8B] tracking-wider leading-relaxed">
                  {act.action}
                </p>
                <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-[#CBB67B]/80 font-mono">
                  <span>{act.details}</span>
                  {act.amount !== "N/A" && <span className="font-bold">{act.amount}</span>}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="w-full py-3.5 border border-[#CBB67B]/30 hover:border-[#CBB67B] text-[9px] uppercase tracking-widest font-semibold transition-colors bg-[#2C3729] flex items-center justify-center gap-2"
          >
            <span>Ver Log de Auditoría Completo</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

      </div>

    </div>
  );
}
