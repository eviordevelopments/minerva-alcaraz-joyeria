"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../lib/store/useCartStore";

export const CartSidebar: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-verde-ebano/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-hueso-seda z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-plata-niebla/10 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1} />
                <span className="text-sm uppercase tracking-[0.2em] font-display">
                  Mi Bolsa
                </span>
                {items.length > 0 && (
                  <span className="w-5 h-5 bg-verde-ebano text-hueso-seda text-[9px] flex items-center justify-center font-mono">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="hover:text-oro-antiguo transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 py-24 text-center">
                  <Package
                    size={40}
                    strokeWidth={0.8}
                    className="text-verde-ebano/20"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-display text-verde-ebano/50">
                      Tu bolsa está vacía
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-plata-niebla">
                      Descubre nuestras piezas eternas
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="text-[10px] uppercase tracking-widest border-b border-oro-antiguo/40 text-oro-antiguo pb-0.5 hover:border-oro-antiguo transition-colors"
                  >
                    Explorar el Atelier
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-5 items-start border-b border-plata-niebla/10 pb-6"
                  >
                    {/* Product image */}
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 aspect-[3/4] relative overflow-hidden bg-plata-niebla/10 border border-verde-ebano/5">
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
                            <Package size={16} className="text-verde-ebano/20" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-widest text-plata-niebla truncate">
                        {item.collection}
                      </span>
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={closeCart}
                      >
                        <h4 className="text-xs font-display text-verde-ebano leading-snug hover:text-oro-antiguo transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      {item.size && (
                        <span className="text-[9px] text-plata-niebla uppercase tracking-widest">
                          Talla {item.size}
                        </span>
                      )}
                      <span className="text-xs text-verde-ebano mt-1 font-mono">
                        ${item.price.toLocaleString("es-MX")} {item.currency}
                      </span>

                      {/* Qty controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-plata-niebla/20">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-plata-niebla/10 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-3 text-xs font-mono min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-plata-niebla/10 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-plata-niebla hover:text-red-700 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <span className="text-xs font-mono text-verde-ebano flex-shrink-0 mt-1">
                      ${(item.price * item.quantity).toLocaleString("es-MX")}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footer — only show when cart has items */}
            {items.length > 0 && (
              <div className="p-8 bg-verde-ebano flex flex-col gap-5 flex-shrink-0">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/50">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString("es-MX")} MXN</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-oro-antiguo">
                    <span>Envío</span>
                    <span>Cortesía</span>
                  </div>
                  <div className="h-px bg-hueso-seda/10 my-1" />
                  <div className="flex justify-between text-sm uppercase tracking-widest text-hueso-seda font-medium">
                    <span>Total</span>
                    <span>${total.toLocaleString("es-MX")} MXN</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-hueso-seda text-verde-ebano py-4 px-8 flex items-center justify-between hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500">
                    <span className="text-[11px] uppercase tracking-[0.4em] font-medium">
                      Proceder al Pago
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-px bg-current" />
                      <ArrowRight size={15} strokeWidth={1.5} />
                    </div>
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
