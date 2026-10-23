"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { FAQSection } from "../../components/FAQSection";
import { Footer } from "../../components/Footer";
import { LuxuryButton } from "../../components/DesignSystem";
import { 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  ArrowRight,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, isTestOrInvalidProduct } from "../../lib/store/useCartStore";
import { useAuthStore } from "../../lib/store/useAuthStore";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const sanitized = items.filter((it) => !isTestOrInvalidProduct(it));
    if (sanitized.length !== items.length) {
      useCartStore.setState({ items: sanitized });
    }
  }, [items]);

  const rawSubtotal = mounted ? subtotal() : 0;
  const isCircleMember = user?.isCircleMember || false;

  // Auto-sync shipping requirements
  const allShippingDisabled =
    mounted && items.length > 0 && items.every((i) => i.requires_shipping === false);

  let shippingCost = 200;
  if (!mounted || items.length === 0 || allShippingDisabled) {
    shippingCost = 0;
  } else if (isCircleMember && rawSubtotal >= 2000) {
    shippingCost = 0;
  } else if (!isCircleMember && rawSubtotal >= 5000) {
    shippingCost = 0;
  }

  const finalTotal = rawSubtotal + shippingCost;

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      <div className="pt-32 px-6 sm:px-8 md:px-16 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-verde-ebano/10 pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-verde-ebano">Mi Bolsa</h1>
              <p className="text-xs uppercase tracking-[0.35em] text-verde-ebano/60">
                Piezas Seleccionadas para tu Legado
              </p>
            </div>
            {mounted && items.length > 0 && (
              <button
                onClick={() => clearCart()}
                className="text-xs uppercase tracking-widest text-verde-ebano/50 hover:text-red-700 transition-colors underline"
              >
                Vaciar Bolsa
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {!mounted ? (
                <div className="py-24 text-center text-sm uppercase tracking-widest text-verde-ebano/40">
                  Cargando bolsa...
                </div>
              ) : items.length === 0 ? (
                <div className="py-24 sm:py-32 text-center flex flex-col items-center gap-6 border border-dashed border-verde-ebano/20 p-8 sm:p-12">
                  <div className="w-16 h-16 rounded-full border border-verde-ebano/20 flex items-center justify-center text-verde-ebano/40">
                    <ShoppingBag size={32} strokeWidth={1} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-display text-verde-ebano">Tu bolsa está vacía</h2>
                    <p className="text-sm font-light text-verde-ebano/70 max-w-sm">
                      Aún no has agregado ninguna pieza a tu bolsa. Descubre nuestras colecciones y diseños de autor.
                    </p>
                  </div>
                  <Link href="/shop" className="mt-4">
                    <LuxuryButton variant="primary">
                      Explorar Colecciones
                    </LuxuryButton>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-verde-ebano/10">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="py-6 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center justify-between"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.productId}`}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-verde-ebano/5 border border-verde-ebano/10 overflow-hidden block group"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-verde-ebano/40">
                            Sin imagen
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-oro-antiguo font-medium">
                          {item.collection || item.category || "Joyería Fina"}
                        </span>
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="text-lg font-display text-verde-ebano hover:text-oro-antiguo transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-verde-ebano/60">
                          {item.sku && <span>SKU: {item.sku}</span>}
                          {item.size && (
                            <>
                              <span>•</span>
                              <span>Talla: {item.size}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-verde-ebano/20 bg-hueso-seda">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 text-verde-ebano/70 hover:text-verde-ebano hover:bg-verde-ebano/5 transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 text-xs font-mono text-verde-ebano font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 text-verde-ebano/70 hover:text-verde-ebano hover:bg-verde-ebano/5 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-base font-semibold text-verde-ebano">
                            ${(item.price * item.quantity).toLocaleString("es-MX")}
                          </span>
                          <span className="text-[10px] text-verde-ebano/50 block font-mono">
                            MXN
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-verde-ebano/40 hover:text-red-700 p-2 transition-colors"
                          title="Eliminar de la bolsa"
                          aria-label={`Eliminar ${item.name} de la bolsa`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary / Checkout Section */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-authority p-8 sm:p-10 flex flex-col gap-6 shadow-2xl border border-oro-antiguo/30">
                <h2 className="text-xl sm:text-2xl font-display text-oro-antiguo">
                  Resumen de Compra
                </h2>

                <div className="flex flex-col gap-4 text-xs uppercase tracking-widest text-hueso-seda/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-sm text-hueso-seda">
                      ${rawSubtotal.toLocaleString("es-MX")} MXN
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Envío Asegurado</span>
                    <span className="font-mono text-sm">
                      {shippingCost === 0 ? (
                        <span className="text-oro-antiguo font-semibold">Gratis</span>
                      ) : (
                        `$${shippingCost.toLocaleString("es-MX")} MXN`
                      )}
                    </span>
                  </div>

                  {shippingCost > 0 && !isCircleMember && (
                    <p className="text-[10px] text-hueso-seda/60 normal-case italic">
                      Envío gratis en compras mayores a $5,000 MXN o con membresía The Circle.
                    </p>
                  )}

                  <div className="h-[1px] bg-hueso-seda/10 my-2" />

                  <div className="flex justify-between text-hueso-seda text-sm sm:text-base font-medium">
                    <span>Total Estimado</span>
                    <span className="text-oro-antiguo font-mono text-lg font-bold">
                      ${finalTotal.toLocaleString("es-MX")} MXN
                    </span>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="bg-verde-ebano/90 text-hueso-seda p-4 border border-oro-antiguo/30 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-oro-antiguo text-xs uppercase tracking-widest font-medium">
                      <ShieldCheck size={14} className="flex-shrink-0" />
                      <span>Compras 100% Aseguradas</span>
                    </div>
                    <p className="text-[11px] text-hueso-seda/75 font-light leading-relaxed">
                      Para garantizar la custodia de valores y trazabilidad de tu pieza, podrás acceder o registrarte en el siguiente paso.
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  {mounted && items.length > 0 ? (
                    <Link href={isAuthenticated ? "/checkout" : "/auth?next=/checkout"}>
                      <LuxuryButton
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 py-4 !text-xs !tracking-[0.25em]"
                      >
                        {isAuthenticated ? "Proceder al Pago" : "Iniciar Sesión para Comprar"}{" "}
                        <ArrowRight size={14} />
                      </LuxuryButton>
                    </Link>
                  ) : (
                    <Link href="/shop">
                      <LuxuryButton
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 py-4 !text-xs !tracking-[0.25em]"
                      >
                        Descubrir Piezas <ArrowRight size={14} />
                      </LuxuryButton>
                    </Link>
                  )}

                  <p className="text-[10px] uppercase tracking-[0.2em] text-hueso-seda/40 text-center">
                    Membresía THE CIRCLE disponible en checkout
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-hueso-seda/10">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-hueso-seda/60">
                    <Lock size={12} className="text-oro-antiguo" /> Pago Encriptado 256-bit SSL
                  </div>
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-hueso-seda/60">
                    <ShieldCheck size={12} className="text-oro-antiguo" /> Certificado de Autenticidad
                  </div>
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-hueso-seda/60">
                    <CreditCard size={12} className="text-oro-antiguo" /> Tarjetas de Débito, Crédito &amp; AMEX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection />
      <Footer />
    </main>
  );
}
