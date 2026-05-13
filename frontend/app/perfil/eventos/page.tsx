"use client";
import React, { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { CalendarDays, Crown, MapPin, Clock } from "lucide-react";

const MOCK_EVENTS = [
  { id: "1", title: "Vista Privada — Colección Etérea", type: "Vista Privada", date: "2025-06-15", time: "6:00 PM", location: "Atelier Minerva Alcaraz, Polanco CDMX", spots: 8, available: 3 },
  { id: "2", title: "Trunk Show — Ecos de la Tierra", type: "Trunk Show", date: "2025-07-02", time: "4:00 PM", location: "Casa Lamm, Colonia Roma Norte", spots: 12, available: 7 },
  { id: "3", title: "Taller de Co-Creación", type: "Taller Exclusivo", date: "2025-07-18", time: "10:00 AM", location: "Atelier Minerva Alcaraz, Polanco CDMX", spots: 4, available: 2 },
];

export default function EventosPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-verde-ebano">Eventos Atelier</h1>
            </div>
            <div className="flex flex-col gap-4">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="bg-white border border-verde-ebano/8 hover:border-oro-antiguo/20 transition-all p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center text-center w-16 flex-shrink-0">
                    <span className="text-2xl font-display text-verde-ebano">{new Date(event.date).getDate()}</span>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-oro-antiguo">{new Date(event.date).toLocaleDateString("es-MX", { month: "short" })}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] uppercase tracking-[0.4em] text-oro-antiguo/60 border border-oro-antiguo/20 px-2 py-1 self-start">{event.type}</span>
                      <h3 className="text-[11px] uppercase tracking-[0.2em] text-verde-ebano font-medium mt-2">{event.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-[9px] text-verde-ebano/40"><Clock size={10} strokeWidth={1.2} /> {event.time}</span>
                      <span className="flex items-center gap-1.5 text-[9px] text-verde-ebano/40"><MapPin size={10} strokeWidth={1.2} /> {event.location}</span>
                      <span className="text-[9px] text-verde-ebano/40">{event.available} de {event.spots} lugares disponibles</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-verde-ebano text-hueso-seda text-[9px] uppercase tracking-[0.4em] px-5 py-3 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-300 self-start md:self-center flex-shrink-0">
                    Reservar Lugar
                  </button>
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
