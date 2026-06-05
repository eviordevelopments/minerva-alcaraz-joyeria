"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Sparkles,
  Mail,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  membership: string; // "The Circle" | "Registrado" | "Newsletter"
  tier: string | null;
  purchasesCount: number;
  totalSpentCents: number;
  joinDate: string;
  isCircle: boolean;
  source: "profile" | "newsletter";
}

function formatCurrency(cents: number): string {
  if (cents === 0) return "$0 MXN";
  return `$${(cents / 100).toLocaleString("es-MX", { minimumFractionDigits: 0 })} MXN`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminCrm() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadContacts() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error de carga");
      setContacts(json.contacts ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "circle") return matchesSearch && c.isCircle;
    if (activeTab === "standard") return matchesSearch && !c.isCircle && c.source === "profile";
    if (activeTab === "newsletter") return matchesSearch && c.source === "newsletter";
    return matchesSearch;
  });

  const circleCount = contacts.filter((c) => c.isCircle).length;
  const newsletterCount = contacts.filter((c) => c.source === "newsletter").length;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Directorio Real · Supabase Live
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            CRM The Circle &amp; General
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1F271D] border border-[#CBB67B]/30 pl-10 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/60 focus:border-[#CBB67B] outline-none w-56 rounded-none"
            />
            <Search size={14} className="absolute left-3.5 text-[#8E9A8B]" />
          </div>
          <button
            onClick={loadContacts}
            disabled={isLoading}
            className="w-9 h-9 border border-[#CBB67B]/30 hover:border-[#CBB67B] flex items-center justify-center text-[#CBB67B] transition-all"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={16} className="flex-shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider">Error al cargar contactos</p>
            <p className="text-[9px] opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-[#CBB67B]/10 pb-[1px] text-left overflow-x-auto">
        {[
          { id: "all", label: `Todos (${contacts.length})` },
          { id: "circle", label: `The Circle (${circleCount})` },
          { id: "standard", label: "Registrados" },
          { id: "newsletter", label: `Newsletter (${newsletterCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-[10px] uppercase tracking-widest px-6 py-4 border-b-2 transition-all font-semibold whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#CBB67B] text-[#CBB67B]"
                : "border-transparent text-[#8E9A8B] hover:text-[#E5DBD6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-[#1F271D] border border-[#CBB67B]/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-[#1F271D] border border-[#CBB67B]/20 overflow-x-auto text-left">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#CBB67B]/20 bg-[#2C3729]/30 text-[#8E9A8B] text-[9px] uppercase tracking-widest">
                <th className="py-4 px-6 text-left font-bold">Cliente</th>
                <th className="py-4 px-6 text-left font-bold">Email</th>
                <th className="py-4 px-6 text-center font-bold">Membresía</th>
                <th className="py-4 px-6 text-center font-bold">Compras</th>
                <th className="py-4 px-6 text-right font-bold">Inversión Total</th>
                <th className="py-4 px-6 text-right font-bold">Miembro desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBB67B]/10 text-xs">
              <AnimatePresence mode="popLayout">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((c) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="hover:bg-[#2C3729]/30 transition-colors"
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
                            c.isCircle
                              ? "bg-[#CBB67B]/10 border-[#CBB67B]/50"
                              : c.source === "newsletter"
                              ? "bg-[#2C3729]/40 border-[#CBB67B]/10"
                              : "bg-[#2C3729]/60 border-[#CBB67B]/20"
                          }`}
                        >
                          {c.isCircle ? (
                            <ShieldCheck size={14} className="text-[#CBB67B]" />
                          ) : c.source === "newsletter" ? (
                            <Mail size={14} className="text-[#8E9A8B]" />
                          ) : (
                            <Users size={14} className="text-[#8E9A8B]" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#E5DBD6] tracking-wide">
                            {c.name}
                          </span>
                          {c.tier && (
                            <span className="text-[8px] text-[#CBB67B]/70 uppercase tracking-widest">
                              {c.tier}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[#8E9A8B] font-mono text-[10px]">
                        {c.email}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block text-[8px] uppercase tracking-widest px-3 py-1 font-bold border ${
                            c.isCircle
                              ? "bg-[#CBB67B]/15 border-[#CBB67B] text-[#CBB67B]"
                              : c.source === "newsletter"
                              ? "bg-[#2C3729]/50 border-[#CBB67B]/10 text-[#8E9A8B]"
                              : "bg-[#2C3729]/30 border-[#CBB67B]/15 text-[#8E9A8B]"
                          }`}
                        >
                          {c.membership}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center font-mono font-semibold text-[#E5DBD6]">
                        {c.purchasesCount}
                      </td>

                      <td className="py-4 px-6 text-right font-mono font-bold text-[#CBB67B]">
                        {formatCurrency(c.totalSpentCents)}
                      </td>

                      <td className="py-4 px-6 text-right text-[10px] text-[#8E9A8B] whitespace-nowrap">
                        {formatDate(c.joinDate)}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-[#8E9A8B]"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Sparkles size={20} className="text-[#CBB67B]/30" />
                        <span className="text-[9px] uppercase tracking-widest italic">
                          {contacts.length === 0
                            ? "Sin contactos registrados aún"
                            : "Ningún contacto coincide con la búsqueda"}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Summary footer */}
      {!isLoading && contacts.length > 0 && (
        <div className="flex justify-end">
          <span className="text-[9px] uppercase tracking-widest text-[#8E9A8B]">
            Mostrando {filteredContacts.length} de {contacts.length} contactos
          </span>
        </div>
      )}
    </div>
  );
}
