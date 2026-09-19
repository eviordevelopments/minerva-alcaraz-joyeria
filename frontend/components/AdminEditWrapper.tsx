"use client";

import React, { useEffect } from "react";
import { useEditModeStore } from "../lib/store/useEditModeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check } from "lucide-react";

export const AdminEditWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isEditing, setIsAdmin, toggleEditing } = useEditModeStore();

  useEffect(() => {
    // Check if the user has the erp_profile_id cookie
    const hasAdminCookie = document.cookie.includes("erp_profile_id=");
    setIsAdmin(hasAdminCookie);
  }, [setIsAdmin]);

  return (
    <>
      {children}
      
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <button
              onClick={toggleEditing}
              className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
                isEditing 
                  ? "bg-oro-antiguo text-verde-ebano hover:bg-oro-antiguo/90" 
                  : "bg-verde-ebano text-hueso-seda hover:bg-verde-ebano/90"
              }`}
              title={isEditing ? "Guardar y salir" : "Activar modo edición"}
            >
              {isEditing ? <Check className="w-6 h-6" /> : <Pencil className="w-6 h-6" />}
            </button>
            {isEditing && (
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-verde-ebano text-hueso-seda text-xs px-3 py-2 rounded whitespace-nowrap"
              >
                Modo Edición Activo. Haz clic en el texto.
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
