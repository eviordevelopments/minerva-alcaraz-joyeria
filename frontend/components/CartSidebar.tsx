"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";
import Link from "next/link";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  // Mock cart items
  const cartItems = [
    { id: 1, name: "Anillo Luna de Plata", price: 1200, category: "Plata .925", quantity: 1 }
  ];

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
            <div className="p-8 border-b border-plata-niebla/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1} />
                <span className="text-sm uppercase tracking-[0.2em] font-display">Mi Bolsa</span>
              </div>
              <button onClick={onClose} className="hover:text-oro-antiguo transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 items-start border-b border-plata-niebla/5 pb-8">
                  <div className="w-20 aspect-[3/4] bg-plata-niebla/10" />
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-plata-niebla">{item.category}</span>
                    <h4 className="text-sm font-display text-verde-ebano">{item.name}</h4>
                    <span className="text-xs text-verde-ebano mt-2">${item.price.toLocaleString()} USD</span>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-plata-niebla/20">
                        <button className="p-2 hover:bg-plata-niebla/5"><Minus size={12} /></button>
                        <span className="px-2 text-xs">{item.quantity}</span>
                        <button className="p-2 hover:bg-plata-niebla/5"><Plus size={12} /></button>
                      </div>
                      <button className="text-plata-niebla hover:text-red-800 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-authority flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-hueso-seda/50">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-oro-antiguo">
                  <span>Envío de Cortesía</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between text-sm uppercase tracking-widest text-hueso-seda mt-2">
                  <span>Total estimado</span>
                  <span>${total.toLocaleString()} USD</span>
                </div>
              </div>

              <Link href="/checkout" onClick={onClose}>
                <LuxuryButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                  Proceder al Pago <ArrowRight size={14} />
                </LuxuryButton>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
