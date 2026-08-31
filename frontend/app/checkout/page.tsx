"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../../components/Header";
import { LuxuryButton } from "../../components/DesignSystem";
import {
  ShieldCheck, Lock, Globe, ArrowRight, CheckCircle,
  Package, ExternalLink, ShoppingBag, CreditCard, ChevronLeft
} from "lucide-react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useCartStore } from "../../lib/store/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isFinished, setIsFinished] = useState(false);
  const { user } = useAuthStore();
  const { items, subtotal, clearCart } = useCartStore();
  
  // Totals calculations
  const rawSubtotal = subtotal();
  const isCircleMember = user?.isCircleMember || false;
  const shippingCost = isCircleMember ? 0 : 500; // 500 MXN if not Circle
  const taxableAmount = rawSubtotal + shippingCost;
  const iva = Math.round(taxableAmount * 0.16);
  const total = taxableAmount + iva;

  // Pre-fill form with user data
  const [shippingEmail, setShippingEmail] = useState(user?.email ?? "");
  const [shippingName, setShippingName] = useState(user?.fullName ?? user?.displayName ?? "");
  const [shippingPhone, setShippingPhone] = useState(user?.phone ?? "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostal, setShippingPostal] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // When there's a single item with a payment_link — use it directly
  const singlePaymentLink =
    items.length === 1 && items[0].paymentLink ? items[0].paymentLink : null;

  useEffect(() => {
    // If the user's details load late
    if (user?.email && !shippingEmail) setShippingEmail(user.email);
    if (user?.fullName && !shippingName) setShippingName(user.fullName);
    if (user?.phone && !shippingPhone) setShippingPhone(user.phone);
  }, [user, shippingEmail, shippingName, shippingPhone]);

  const handleGoToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (singlePaymentLink) {
      window.open(singlePaymentLink, "_blank", "noopener,noreferrer");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          userId: user?.id,
          isTheCircleMember: isCircleMember,
          customerNotes,
          shippingDetails: {
            name: shippingName,
            email: shippingEmail,
            phone: shippingPhone,
            address: shippingAddress,
            city: shippingCity,
            postal: shippingPostal
          },
        }),
      });

      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep(2); // Move to payment step
      } else {
        console.error("No client secret returned:", data);
        alert(data.error || "Error al inicializar el pago.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
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
            Gracias por tu Adquisición, {shippingName.split(" ")[0] || "Miembro"}
          </h1>
          <p className="text-sm text-hueso-seda/60 tracking-widest leading-loose uppercase max-w-md">
            El pago ha sido procesado exitosamente y pronto recibirás un correo de confirmación. Tu legado está siendo preparado en nuestro Atelier.
          </p>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 border border-oro-antiguo text-oro-antiguo px-8 py-4 text-[10px] uppercase tracking-widest hover:bg-oro-antiguo hover:text-verde-ebano transition-all"
          >
            Soporte por WhatsApp
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* ── Left: Wizard Form ────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-14">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl md:text-6xl font-display text-verde-ebano leading-none">
                Finalizar Adquisición
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors ${step === 1 ? 'text-oro-antiguo' : 'text-plata-niebla'}`}>
                  01. Envío
                </span>
                <div className="w-8 h-px bg-verde-ebano/20" />
                <span className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors ${step === 2 ? 'text-oro-antiguo' : 'text-plata-niebla'}`}>
                  02. Pago Seguro
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleGoToPayment} 
                  className="flex flex-col gap-12"
                >
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
                          Teléfono de Contacto *
                        </label>
                        <input
                          type="tel"
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="+52 55 0000 0000"
                          required
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
                          Ciudad / Estado *
                        </label>
                        <input
                          type="text"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          placeholder="Ciudad de México"
                          required
                          className="checkout-input w-full"
                        />
                      </div>
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          value={shippingPostal}
                          onChange={(e) => setShippingPostal(e.target.value)}
                          placeholder="00000"
                          required
                          className="checkout-input w-full"
                        />
                      </div>
                      <div className="col-span-full group">
                        <label className="text-[10px] uppercase tracking-widest text-plata-niebla mb-2 block group-focus-within:text-oro-antiguo transition-colors">
                          Nota Personalizada / Instrucciones
                        </label>
                        <textarea
                          rows={2}
                          value={customerNotes}
                          onChange={(e) => setCustomerNotes(e.target.value)}
                          placeholder="Si es un regalo, escribe una dedicatoria aquí. O añade instrucciones de entrega."
                          className="checkout-input w-full resize-none"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-col gap-6 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-verde-ebano text-hueso-seda py-7 px-12 flex items-center justify-between border border-verde-ebano hover:bg-hueso-seda hover:text-verde-ebano transition-all duration-700 group overflow-hidden relative"
                    >
                      <span className="text-sm uppercase tracking-[0.5em] font-medium z-10">
                        {isLoading ? "Procesando..." : "Continuar a Pago Seguro"}
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
                </motion.form>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-10"
                >
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[10px] uppercase tracking-widest text-plata-niebla hover:text-verde-ebano flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft size={14} /> Volver a envío
                    </button>
                    <div className="flex items-center gap-4">
                      <span className="text-xs uppercase tracking-[0.3em] text-oro-antiguo font-medium">
                        02. Pago Seguro
                      </span>
                    </div>
                  </div>
                  
                  {clientSecret && (
                    <div className="p-8 border border-verde-ebano/15 bg-white/50">
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "stripe",
                            variables: {
                              colorPrimary: "#2C3729", // verde-ebano
                              colorBackground: "transparent",
                              colorText: "#2C3729",
                              borderRadius: "0px",
                              fontFamily: "Inter, sans-serif"
                            },
                          },
                        }}
                      >
                        <StripeCheckoutForm
                          amount={total}
                          onSuccess={() => setIsFinished(true)}
                        />
                      </Elements>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Order summary ───────────────────────────────────────── */}
          <div className="lg:col-span-5 relative">
            <div className="bg-verde-ebano p-8 md:p-12 lg:sticky lg:top-32 flex flex-col gap-10 shadow-[-20px_20px_60px_rgba(0,0,0,0.15)]">
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-display text-oro-antiguo italic">
                  Detalle de la Adquisición
                </h2>
                <div className="h-px w-16 bg-oro-antiguo/30" />
              </div>

              {/* Cart items */}
              <div className="flex flex-col gap-6 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-start border-b border-hueso-seda/10 pb-4 last:border-0 last:pb-0">
                    {/* Image */}
                    <div className="w-16 aspect-[3/4] relative overflow-hidden bg-hueso-seda/5 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package size={14} className="text-hueso-seda/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-[8px] uppercase tracking-[0.3em] text-oro-antiguo truncate">
                        {item.collection}
                      </span>
                      <h4 className="text-xs font-display text-hueso-seda leading-snug">
                        {item.name}
                      </h4>
                      {item.size && (
                        <span className="text-[8px] text-hueso-seda/50 uppercase tracking-widest mt-1">
                          Talla: {item.size}
                        </span>
                      )}
                      <span className="text-[8px] text-hueso-seda/50 uppercase tracking-widest mt-0.5">
                        Cantidad: {String(item.quantity).padStart(2, "0")}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-hueso-seda flex-shrink-0 mt-1">
                      ${(item.price * item.quantity).toLocaleString("es-MX")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-3 pt-6 border-t border-hueso-seda/20">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/60">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} piezas)</span>
                  <span>${rawSubtotal.toLocaleString("es-MX")}</span>
                </div>
                
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/60">
                  <span>Envío Asegurado {isCircleMember ? '(THE CIRCLE)' : ''}</span>
                  <span className={isCircleMember ? "text-oro-antiguo" : ""}>
                    {isCircleMember ? "Cortesía" : `$${shippingCost.toLocaleString("es-MX")}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/60">
                  <span>IVA (16%)</span>
                  <span>${iva.toLocaleString("es-MX")}</span>
                </div>

                <div className="h-px bg-hueso-seda/10 my-3" />
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-oro-antiguo">
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
              <div className="p-5 border border-oro-antiguo/20 bg-hueso-seda/[0.03] text-center mt-2">
                <ShieldCheck size={16} className="text-oro-antiguo mx-auto mb-2" />
                <span className="text-[8px] uppercase tracking-[0.4em] text-oro-antiguo block mb-1.5">
                  Certificación Minerva Alcaraz
                </span>
                <p className="text-[9px] text-hueso-seda/40 font-light italic leading-relaxed">
                  "Cada pieza es un testimonio de devoción y maestría, forjada para habitar en la eternidad."
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
