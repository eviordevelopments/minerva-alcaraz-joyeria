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
  const [circleProducts, setCircleProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const { products } = await res.json();
          // Strictly only products where admin explicitly activated is_circle_exclusive
          const items = (products || []).filter((p: any) => p.is_circle_exclusive === true);
          setCircleProducts(items);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-48 sm:pt-52 md:pt-56 lg:pt-64 pb-24 max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <ProfileSidebar />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2"><Crown size={10} className="text-oro-antiguo" /><p className="text-[11px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p></div>
              <h1 className="text-3xl font-display text-white">Colecciones Privadas</h1>
            </div>
            <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-5 flex items-start gap-3 shadow-md">
              <Gem size={16} strokeWidth={1.5} className="text-[#CBB67B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#E5DBD6]/80 leading-loose">
                Piezas únicas e irrepetibles disponibles exclusivamente para miembros de The Circle. Estas joyas se muestran únicamente cuando la dirección artística del Atelier activa su acceso exclusivo en inventario.
              </p>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs uppercase tracking-widest text-[#8E9A8B]">
                Cargando piezas exclusivas...
              </div>
            ) : circleProducts.length === 0 ? (
              <div className="bg-[#1E261C] border border-[#CBB67B]/25 p-12 flex flex-col items-center justify-center text-center gap-4 shadow-xl">
                <div className="w-12 h-12 border border-[#CBB67B]/30 flex items-center justify-center bg-black/25 text-[#CBB67B]">
                  <Gem size={20} strokeWidth={1.5} />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-sm font-display text-white uppercase tracking-wider font-bold">
                    Sin Piezas Privadas Activas
                  </h3>
                  <p className="text-xs text-[#E5DBD6]/70 leading-relaxed font-light">
                    En este momento no hay piezas exclusivas activadas por el administrador para The Circle. Las nuevas creaciones reservadas aparecerán aquí tan pronto como sean liberadas por el Atelier.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {circleProducts.map(p => (
                  <Link key={p.id} href={`/product/${p.id}`} className="bg-[#1E261C] border border-[#CBB67B]/25 hover:border-[#CBB67B] transition-all duration-300 overflow-hidden group flex flex-col shadow-lg">
                    <div className="relative h-60 bg-black/30 overflow-hidden">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                      <div className="absolute top-2 left-2 bg-[#CBB67B] text-[#1F271D] text-[8px] font-bold uppercase tracking-[0.3em] px-2.5 py-1 flex items-center gap-1 shadow-md">
                        <Sparkles size={9} /> Exclusiva The Circle
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-[0.25em] text-white font-bold">{p.name}</p>
                      <p className="text-[11px] text-[#8E9A8B]">{p.collection || "Edición Privada"}</p>
                      <p className="text-base text-[#CBB67B] font-mono font-bold">${p.price?.toLocaleString("es-MX") || (p.price_cents ? (p.price_cents / 100).toLocaleString("es-MX") : "0")} MXN</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
