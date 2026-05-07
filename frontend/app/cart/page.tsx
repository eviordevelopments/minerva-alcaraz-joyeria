"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "../../components/Header";
import { FAQSection } from "../../components/FAQSection";
import { LuxuryButton } from "../../components/DesignSystem";
import { Trash2, ShoppingBag, ShieldCheck, CreditCard, Lock, ArrowRight } from "lucide-react";

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Anillo Luna de Plata",
      price: 1200,
      sku: "MA-AN-001-LUNA",
      category: "Plata .925"
    }
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      <div className="pt-32 px-8 md:px-16 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-display text-verde-ebano">Mi Bolsa</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Artículos Seleccionados para su Legado</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-8 border-b border-plata-niebla/10 pb-8 items-center">
                  <div className="w-32 aspect-[3/4] bg-plata-niebla/10" />
                  <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
                    <span className="text-[9px] uppercase tracking-widest text-plata-niebla">{item.category}</span>
                    <h3 className="text-lg font-display text-verde-ebano">{item.name}</h3>
                    <span className="text-[8px] tracking-widest text-plata-niebla uppercase">SKU: {item.sku}</span>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-4">
                    <span className="text-lg text-verde-ebano">${item.price.toLocaleString()} USD</span>
                    <button className="text-plata-niebla hover:text-red-800 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="py-32 text-center flex flex-col items-center gap-6">
                  <ShoppingBag size={48} strokeWidth={0.5} className="opacity-20" />
                  <p className="text-xs uppercase tracking-widest text-plata-niebla">Su bolsa está vacía</p>
                  <LuxuryButton>Explorar Colecciones</LuxuryButton>
                </div>
              )}
            </div>

            {/* Order Summary / Checkout Section */}
            <div className="lg:col-span-4">
              <div className="bg-authority p-12 flex flex-col gap-8 shadow-2xl">
                <h2 className="text-2xl font-display text-oro-antiguo">Resumen</h2>
                
                <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-hueso-seda/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío Premium</span>
                    <span className="text-oro-antiguo">Gratis</span>
                  </div>
                  <div className="h-[1px] bg-hueso-seda/10 my-4" />
                  <div className="flex justify-between text-hueso-seda text-sm">
                    <span>Total</span>
                    <span className="text-oro-antiguo">${total.toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                   <LuxuryButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                     Pagar Ahora <ArrowRight size={14} />
                   </LuxuryButton>
                   <p className="text-[8px] uppercase tracking-[0.2em] text-hueso-seda/40 text-center">
                     Membresía THE CIRCLE disponible en el siguiente paso
                   </p>
                </div>

                <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-hueso-seda/10">
                   <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-hueso-seda/60">
                     <Lock size={12} /> Pago Encriptado SSL
                   </div>
                   <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-hueso-seda/60">
                     <ShieldCheck size={12} /> Garantía de Autenticidad
                   </div>
                   <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-hueso-seda/60">
                     <CreditCard size={12} /> Visa, Mastercard, AMEX
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection />
    </main>
  );
}
