"use client";

import React from "react";
import { Header } from "../components/Header";
import { FAQSection } from "../components/FAQSection";
import { ProductCard } from "../components/DesignSystem";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const favorites = [
    {
      id: 1,
      name: "Anillo Luna de Plata",
      price: "$1,200 USD",
      category: "Plata .925",
      slug: "anillo-luna-plata"
    }
  ];

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 px-8 md:px-16 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2 items-center text-center">
            <Heart size={32} strokeWidth={0.5} className="text-oro-antiguo mb-4" />
            <h1 className="text-4xl font-display text-verde-ebano">Mis Favoritos</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Selección Curada de Deseos</p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {favorites.map((item) => (
                <ProductCard 
                  key={item.id}
                  title={item.name}
                  price={item.price}
                  category={item.category}
                  imageFront=""
                  imageBack=""
                />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center gap-6">
              <p className="text-xs uppercase tracking-widest text-plata-niebla">No tiene piezas en su lista de favoritos</p>
            </div>
          )}
        </div>
      </div>

      <FAQSection />
    </main>
  );
}
