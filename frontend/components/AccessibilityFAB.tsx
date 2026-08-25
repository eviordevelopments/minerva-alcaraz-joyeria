"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAccessibilityStore } from "../lib/store/useAccessibilityStore";
import { Accessibility } from "lucide-react";
import { motion } from "framer-motion";

export function AccessibilityFAB() {
  const pathname = usePathname();
  const { setPanelOpen } = useAccessibilityStore();

  // Hide FAB if on the admin dashboard, since it will be in the sidebar
  if (pathname.startsWith("/admin") && !pathname.includes("/login") && !pathname.includes("/register") && !pathname.includes("/select-profile")) {
    return null;
  }

  return (
    <motion.button
      id="a11y-fab"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setPanelOpen(true)}
      className="fixed bottom-6 left-6 z-[90] w-12 h-12 rounded-full bg-[#2C3729] border border-[#CBB67B]/30 flex items-center justify-center text-[#CBB67B] shadow-xl hover:shadow-[#CBB67B]/20 transition-all"
      aria-label="Abrir panel de accesibilidad"
    >
      <Accessibility size={20} />
    </motion.button>
  );
}
