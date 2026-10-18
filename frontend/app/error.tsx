"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Crown, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-hueso-seda flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 border border-oro-antiguo/40 flex items-center justify-center mb-6 bg-verde-ebano/5">
        <Crown size={22} className="text-oro-antiguo" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl sm:text-2xl font-display text-verde-ebano uppercase tracking-widest mb-3">
        Minerva Alcaraz Joyería
      </h2>
      <p className="text-xs sm:text-sm text-verde-ebano/70 max-w-md font-light leading-relaxed mb-8">
        La elegancia y exclusividad están siendo preparadas. Por favor recarga para continuar explorando nuestras colecciones.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 bg-verde-ebano text-hueso-seda text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-oro-antiguo hover:text-verde-ebano transition-colors shadow-md"
        >
          <RefreshCw size={13} />
          <span>Reintentar</span>
        </button>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-oro-antiguo hover:underline"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
