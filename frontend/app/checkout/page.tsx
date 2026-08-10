"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../../components/Header";
import { LuxuryButton } from "../../components/DesignSystem";
import {
  ShieldCheck, Lock, Globe, ArrowRight, CheckCircle,
  Package, ExternalLink, ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useCartStore } from "../../lib/store/useCartStore";

export default function CheckoutPage() {
  const [isFinished, setIsFinished] = useState(false);
  const { user } = useAuthStore();
  const { items, subtotal, clearCart } = useCartStore();
  const total = subtotal();

  // Pre-fill form with user data
  const [shippingEmail, setShippingEmail] = useState(user?.email ?? "");
  const [shippingName, setShippingName] = useState(user?.fullName ?? "");
  const [shippingPhone, setShippingPhone] = useState(user?.phone ?? "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostal, setShippingPostal] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // When there's a single item with a payment_link — use it directly
  const singlePaymentLink =
    items.length === 1 && items[0].paymentLink ? items[0].paymentLink : null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    // If there's a direct payment link, redirect there
    if (singlePaymentLink) {
      window.open(singlePaymentLink, "_blank", "noopener,noreferrer");
      return;
    }

    // Otherwise show the success state (WhatsApp / concierge flow)
    setIsFinished(true);
  };

  const handleWhatsApp = () => {
    const lines = [
      "Hola Minerva, me gustaría confirmar mi pedido:",
      "",
      ...items.map(
        (i) =>
          `• ${i.name} (x${i.quantity}) — $${(i.price * i.quantity).toLocaleString("es-MX")} MXN${i.size ? ` | Talla: ${i.size}` : ""}`
      ),
      "",
      `Total: $${total.toLocaleString("es-MX")} MXN`,
      "",
      shippingName ? `Nombre: ${shippingName}` : "",
      shippingAddress ? `Dirección: ${shippingAddress}, ${shippingCity} ${shippingPostal}` : "",
      shippingPhone ? `Teléfono: ${shippingPhone}` : "",
      customerNotes ? `Notas: ${customerNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const encoded = encodeURIComponent(lines);
    window.open(`https://wa.me/525555555555?text=${encoded}`, "_blank");
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <main className="min-h-screen bg-verde-ebano flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center flex flex-col items-center gap-8 max-w-2xl"
        >
          <CheckCircle size={64} className="text-oro-antiguo" strokeWidth={0.5} />
          <h1 className="text-5xl font-display text-hueso-seda leading-tight">
            Tu pedido fue recibido
          </h1>
          <p className="text-sm text-hueso-seda/60 tracking-widest leading-loose uppercase max-w-md">
            Minerva Alcaraz confirmará tu adquisición vía WhatsApp o correo en menos de 24 horas. Recibirás los detalles del ritual de envío.
          </p>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 border border-oro-antiguo text-oro-antiguo px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-oro-antiguo hover:text-verde-ebano transition-all"
          >
            Confirmar por WhatsApp
            <ExternalLink size={14} />
          </button>

          <div className="h-px w-16 bg-oro-antiguo/30" />
          <LuxuryButton
            variant="secondary"
            onClick={() => {
              clearCart();
              window.location.href = "/";
            }}
          >
            Regresar al Atelier
          </LuxuryButton>
        </motion.div>
      </main>
    );
  }

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-hueso-seda">
        <Header />
        <div className="pt-56 pb-32 flex flex-col items-center gap-8 text-center px-8">
          <ShoppingBag size={40} strokeWidth={0.8} className="text-verde-ebano/20" />
          <h1 className="text-4xl font-display text-verde-ebano">Tu bolsa está vacía</h1>
          <p className="text-sm text-plata-niebla uppercase tracking-widest">
            Añade piezas a tu bolsa antes de proceder al pago.
          </p>
          <Link href="/shop">
            <LuxuryButton>Explorar el Atelier</LuxuryButton>
          </Link>
        </div>
      </main>
    );
  }

  // ── Main checkout ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      <div className="pt-40 px-6 md:px-12 lg:px-20 pb-32 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-32">

          {/* ── Left: Shipping form ────────────────────────────────────────── */}
          <form onSubmit={handleConfirm} className="flex flex-col gap-14">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl md:text-6xl font-display text-verde-ebano leading-none">
                Finalizar Adquisición
              </h1>
              <p className="text-[10px] uppercase tracking-[0.5em] text-oro-antiguo mt-2">
                Protocolo de Envío Seguro · Minerva Alcaraz
              </p>
            </div>

            {/* Shipping */}
            <section className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-medium">
                  01. Destino del Legado
                </span>
                <div className="h-px flex-1 bg-verde-ebano/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                <div className="col-span-full group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                    className="checkout-input w-full"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Como aparece en su identificación"
                    required
                    className="checkout-input w-full"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+52 55 0000 0000"
                    className="checkout-input w-full"
                  />
                </div>
                <div className="col-span-full group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, Número, Colonia..."
                    required
                    className="checkout-input w-full"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Ciudad / Estado
                  </label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="Ciudad de México"
                    className="checkout-input w-full"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={shippingPostal}
                    onChange={(e) => setShippingPostal(e.target.value)}
                    placeholder="00000"
                    className="checkout-input w-full"
                  />
                </div>
                <div className="col-span-full group">
                  <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                    Notas del Pedido
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Instrucciones especiales de entrega, tallas, grabados..."
                    className="checkout-input w-full resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment method — NO card fields */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-medium">
                  02. Método de Pago
                </span>
                <div className="h-px flex-1 bg-verde-ebano/10" />
              </div>

              <div className="flex flex-col gap-3">
                {singlePaymentLink ? (
                  <div className="p-6 border border-verde-ebano/20 bg-verde-ebano/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-verde-ebano/10 border border-verde-ebano/20 flex items-center justify-center flex-shrink-0">
                      <ExternalLink size={16} className="text-oro-antiguo" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-verde-ebano uppercase tracking-wider">
                        Plataforma de Pago Segura
                      </p>
                      <p className="text-[9px] text-plata-niebla uppercase tracking-widest mt-0.5">
                        Serás redirigido al portal de pago al confirmar
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-verde-ebano/20 bg-verde-ebano/5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-verde-ebano/10 border border-verde-ebano/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck size={16} className="text-oro-antiguo" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-verde-ebano uppercase tracking-wider">
                        Pago Seguro por Concierge
                      </p>
                      <p className="text-[9px] text-plata-niebla leading-relaxed uppercase tracking-widest">
                        Minerva Alcaraz te enviará las instrucciones de pago por WhatsApp o correo tras confirmar tu pedido. Sin datos bancarios expuestos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Confirm button */}
            <div className="flex flex-col gap-6">
              <button
                type="submit"
                className="w-full bg-verde-ebano text-hueso-seda py-7 px-12 flex items-center justify-between border border-verde-ebano hover:bg-hueso-seda hover:text-verde-ebano transition-all duration-700 group overflow-hidden relative"
              >
                <span className="text-sm uppercase tracking-[0.5em] font-medium z-10">
                  {singlePaymentLink ? "Ir al Portal de Pago" : "Confirmar Pedido"}
                </span>
                <div className="flex items-center gap-5 z-10">
                  <div className="w-10 h-px bg-current transition-all duration-700 group-hover:w-16" />
                  <ArrowRight size={18} strokeWidth={1} />
                </div>
                <div className="absolute inset-0 bg-oro-antiguo/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>

              <div className="flex justify-center items-center gap-8 opacity-30 mt-2">
                {[
                  { icon: ShieldCheck, label: "Protección GIA" },
                  { icon: Lock, label: "SSL 256-bit" },
                  { icon: Globe, label: "Envío Global" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <Icon size={20} strokeWidth={1} />
                    <span className="text-[8px] uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* ── Right: Order summary ───────────────────────────────────────── */}
          <div className="relative">
            <div className="bg-verde-ebano p-10 md:p-16 sticky top-32 flex flex-col gap-10 shadow-[-40px_40px_80px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-display text-oro-antiguo italic">
                  Detalle de la Obra
                </h2>
                <div className="h-px w-16 bg-oro-antiguo/30" />
              </div>

              {/* Cart items */}
              <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-5 items-start">
                    {/* Image */}
                    <div className="w-20 aspect-[3/4] relative overflow-hidden bg-hueso-seda/5 border border-hueso-seda/10 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package size={16} className="text-hueso-seda/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-oro-antiguo truncate">
                        {item.collection}
                      </span>
                      <h4 className="text-sm font-display text-hueso-seda leading-snug">
                        {item.name}
                      </h4>
                      {item.size && (
                        <span className="text-[9px] text-hueso-seda/50 uppercase tracking-widest">
                          Talla: {item.size}
                        </span>
                      )}
                      <span className="text-[10px] text-hueso-seda/50 uppercase tracking-widest mt-1">
                        Cantidad: {String(item.quantity).padStart(2, "0")}
                      </span>
                    </div>

                    <span className="text-sm font-mono text-hueso-seda flex-shrink-0 mt-1">
                      ${(item.price * item.quantity).toLocaleString("es-MX")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-4 pt-6 border-t border-hueso-seda/10">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/40">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} piezas)</span>
                  <span>${total.toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-oro-antiguo">
                  <span>Envío Asegurado</span>
                  <span>Cortesía</span>
                </div>
                <div className="h-px bg-hueso-seda/10 my-2" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-hueso-seda/30">
                      Total Final
                    </span>
                    <span className="text-3xl text-hueso-seda tracking-tighter font-display">
                      ${total.toLocaleString("es-MX")}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-oro-antiguo pb-1">
                    MXN
                  </span>
                </div>
              </div>

              {/* Authenticity note */}
              <div className="p-6 border border-oro-antiguo/15 bg-hueso-seda/[0.02] text-center">
                <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">
                  Certificación de Autenticidad Minerva Alcaraz
                </span>
                <p className="text-[10px] text-hueso-seda/35 font-light italic leading-loose mt-3">
                  &quot;Cada pieza es un testimonio de devoción y maestría, forjada para habitar en la eternidad.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-input {
          background: transparent;
          border-bottom: 1px solid rgba(44, 55, 41, 0.12);
          padding: 12px 0;
          font-size: 13px;
          outline: none;
          transition: border-color 0.3s;
          color: #2C3729;
        }
        .checkout-input:focus {
          border-color: #CBB67B;
        }
        .checkout-input::placeholder {
          color: rgba(195, 201, 192, 0.7);
          font-size: 11px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
