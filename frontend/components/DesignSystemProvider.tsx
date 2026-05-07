"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useMentalState, MentalState } from "../lib/hooks/useMentalState";

interface DesignSystemContextType {
  mentalState: MentalState;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const DesignSystemProvider = ({ children }: { children: ReactNode }) => {
  const { mentalState } = useMentalState();

  return (
    <DesignSystemContext.Provider value={{ mentalState }}>
      <div className={mentalState === "LOW_AROUSAL" ? "arousal-low" : "arousal-high"}>
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
