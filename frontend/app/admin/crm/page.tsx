"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Sparkles, 
  Mail, 
  ShieldCheck, 
  Coins, 
  Search,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminCrm() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    {
      id: "1",
      name: "Carlos Slim Jr.",
      email: "c.slim@vip.mx",
      membership: "The Circle",
      purchasesCount: 3,
      totalSpent: "$180,000 MXN",
      joinDate: "10 Ene 2026",
      lastInteraction: "Adquirió Anillo de Piedras Amatista Natural"
    },
    {
      id: "2",
      name: "Adriana Garza",
      email: "adriana.garza@outlook.com",
      membership: "The Circle",
      purchasesCount: 2,
      totalSpent: "$145,000 MXN",
      joinDate: "14 Feb 2026",
      lastInteraction: "Modificó especificaciones de co-creación"
    },
    {
      id: "3",
      name: "Suscriptor Alejandra G.",
      email: "alejandra.g@outlook.com",
      membership: "Standard",
      purchasesCount: 0,
      totalSpent: "$0 MXN",
      joinDate: "18 May 2026",
      lastInteraction: "Suscripción a Newsletter oficial"
    },
    {
      id: "4",
      name: "María Inés L.",
      email: "maria.ines@gmail.com",
      membership: "The Circle",
      purchasesCount: 1,
      totalSpent: "$64,000 MXN",
      joinDate: "05 Mar 2026",
      lastInteraction: "Agendó cita en Showroom Privado"
    },
    {
      id: "5",
      name: "Suscriptor Roberto M.",
      email: "roberto.martinez@live.com.mx",
      membership: "Standard",
      purchasesCount: 0,
      totalSpent: "$0 MXN",
      joinDate: "12 May 2026",
      lastInteraction: "Suscripción a Newsletter oficial"
    }
  ];

  const filteredCustomers = customers.filter((cust) => {
    // Search match
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab match
    if (activeTab === "circle") {
      return matchesSearch && cust.membership === "The Circle";
    }
    if (activeTab === "standard") {
      return matchesSearch && cust.membership === "Standard";
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Segmentación y Marketing de Ultra-Lujo
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            CRM The Circle &amp; CRM General
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar por cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1F271D] border border-[#CBB67B]/30 pl-10 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-64 rounded-none"
          />
          <Search size={14} className="absolute left-3.5 text-[#8E9A8B]" />
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-[#CBB67B]/10 pb-[1px] text-left">
        {[
          { id: "all", label: "Todos los Contactos" },
          { id: "circle", label: "Miembros The Circle" },
          { id: "standard", label: "Suscriptores Boletín" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[10px] uppercase tracking-widest px-6 py-4 border-b-2 transition-all font-semibold ${
              activeTab === tab.id
                ? "border-[#CBB67B] text-[#CBB67B]"
                : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DIRECTORY LISTING */}
      <div className="bg-[#1F271D] border border-[#CBB67B]/20 overflow-x-auto text-left">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/30 text-[#8E9A8B] text-[9px] uppercase tracking-widest">
              <th className="py-4 px-6 text-left font-bold">Cliente</th>
              <th className="py-4 px-6 text-left font-bold">Email</th>
              <th className="py-4 px-6 text-center font-bold">Membresía</th>
              <th className="py-4 px-6 text-center font-bold">Compras Realizadas</th>
              <th className="py-4 px-6 text-right font-bold">Inversión Total</th>
              <th className="py-4 px-6 text-right font-bold">Última Interacción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBB67B]/10 text-xs">
            <AnimatePresence mode="popLayout">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const isCircle = cust.membership === "The Circle";
                  return (
                    <motion.tr
                      key={cust.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-[#2C3729]/30 transition-colors"
                    >
                      {/* Name / Avatar */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-none border flex items-center justify-center ${
                          isCircle ? "bg-[#CBB67B]/10 border-[#CBB67B]/50" : "bg-[#2C3729]/40 border-[#CBB67B]/10"
                        }`}>
                          {isCircle ? (
                            <ShieldCheck size={14} className="text-[#CBB67B]" />
                          ) : (
                            <Mail size={14} className="text-[#8E9A8B]" />
                          )}
                        </div>
                        <span className="font-semibold text-[#E5DBD6] tracking-wide">
                          {cust.name}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-[#8E9A8B] font-mono">
                        {cust.email}
                      </td>

                      {/* Membership tag */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block text-[8px] uppercase tracking-widest px-3 py-1 font-bold border ${
                          isCircle 
                            ? "bg-[#CBB67B]/15 border-[#CBB67B] text-[#CBB67B]" 
                            : "bg-[#2C3729]/50 border-[#CBB67B]/10 text-[#8E9A8B]"
                        }`}>
                          {cust.membership}
                        </span>
                      </td>

                      {/* Purchases count */}
                      <td className="py-4 px-6 text-center font-mono font-semibold text-[#E5DBD6]">
                        {cust.purchasesCount}
                      </td>

                      {/* Total spent */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-[#CBB67B]">
                        {cust.totalSpent}
                      </td>

                      {/* Last interaction */}
                      <td className="py-4 px-6 text-right text-[10px] text-[#8E9A8B] truncate max-w-[200px]" title={cust.lastInteraction}>
                        {cust.lastInteraction}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8E9A8B] italic uppercase tracking-wider">
                    Ningún contacto coincide con los criterios de búsqueda
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

    </div>
  );
}
