"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useMentalState, MentalState } from "../lib/hooks/useMentalState";

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
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <DesignSystemContext.Provider value={{ 
      mentalState, 
      setMentalState, 
      handleInteraction,
      isCartOpen, 
      setIsCartOpen 
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
