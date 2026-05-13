"use client";
import React, { useEffect } from "react";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "../../../constants/products";
import { Gem, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ColeccionesPrivadasPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push("/auth"); }, [isAuthenticated]);
  if (!user) return null;
  const circleProducts = PRODUCTS.filter(p => p.stock === 1 || p.category === "Piezas Únicas");

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-verde-ebano">Colecciones Privadas</h1>
            </div>
            <div className="bg-verde-ebano/4 border border-oro-antiguo/10 p-5 flex items-start gap-3">
              <Gem size={14} strokeWidth={1} className="text-oro-antiguo flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-verde-ebano/50 leading-loose">Piezas únicas e irrepetibles disponibles exclusivamente para miembros de The Circle. Estas joyas no aparecen en el catálogo general.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {circleProducts.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="bg-white border border-oro-antiguo/10 hover:border-oro-antiguo/30 transition-all duration-300 overflow-hidden group flex flex-col">
                  <div className="relative h-56 bg-verde-ebano/4 overflow-hidden">
                    {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                    <div className="absolute top-2 left-2 bg-oro-antiguo/90 text-verde-ebano text-[7px] uppercase tracking-[0.4em] px-2 py-1 flex items-center gap-1"><Sparkles size={8} /> Exclusiva</div>
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano font-medium">{p.name}</p>
                    <p className="text-[8px] text-verde-ebano/40">{p.collection}</p>
                    <p className="text-sm text-verde-ebano/70">${p.price.toLocaleString("es-MX")} MXN</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
