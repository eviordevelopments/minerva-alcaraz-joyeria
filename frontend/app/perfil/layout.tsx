"use client";

import React from "react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { CircleThemeContext } from "../../lib/context/CircleThemeContext";

// ── Layout ───────────────────────────────────────────────────────────────────
export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  // THE CIRCLE design activates ONLY when member AND ≥1 000 points
  const isCircleActive = !!(
    user?.isCircleMember && (user?.circlePoints ?? 0) >= 1000
  );

  return (
    <CircleThemeContext.Provider value={{ isCircleActive }}>
      {/*
        This outer div owns the page background so every sub-page
        inside /perfil inherits the same theme without each page
        needing to manage its own background colour.
      */}
      <div
        className={`min-h-screen transition-colors duration-1000 ${
          isCircleActive
            ? "bg-[#2C3729] text-[#E5DBD6] circle-theme-active"
            : "bg-[#F8F5F2] text-[#2C3729]"
        }`}
      >
        {children}
      </div>
    </CircleThemeContext.Provider>
  );
}

