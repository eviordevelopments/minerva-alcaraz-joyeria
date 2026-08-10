"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useMentalState, MentalState } from "../lib/hooks/useMentalState";
import { useCartStore } from "../lib/store/useCartStore";

interface DesignSystemContextType {
  mentalState: MentalState;
  setMentalState: (state: MentalState) => void;
  handleInteraction: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const DesignSystemProvider = ({ children }: { children: ReactNode }) => {
  const { mentalState, setMentalState, handleInteraction } = useMentalState();
  const { isOpen, openCart, closeCart } = useCartStore();

  const setIsCartOpen = (open: boolean) => open ? openCart() : closeCart();

  return (
    <DesignSystemContext.Provider value={{
      mentalState,
      setMentalState,
      handleInteraction,
      isCartOpen: isOpen,
      setIsCartOpen,
    }}>
      <div className="min-h-screen bg-hueso-seda">
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error("useDesignSystem must be used within a DesignSystemProvider");
  }
  return context;
};
