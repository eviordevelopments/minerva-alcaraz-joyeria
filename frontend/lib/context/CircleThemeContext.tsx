"use client";

/**
 * CircleThemeContext
 * Provided by /app/perfil/layout.tsx for all /perfil sub-routes.
 * Consumed by Header, ProfileSidebar, and any sub-page that needs
 * to know whether THE CIRCLE green/gold design is active.
 */

import { createContext, useContext } from "react";

interface CircleThemeCtx {
  /** true when user is a Circle member AND has ≥1 000 points */
  isCircleActive: boolean;
}

export const CircleThemeContext = createContext<CircleThemeCtx>({
  isCircleActive: false,
});

export const useCircleTheme = () => useContext(CircleThemeContext);
