"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy route — The Circle dashboard has been unified into /perfil
 * Redirect permanently to the new profile system
 */
export default function CircleDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/perfil");
  }, [router]);
  return (
    <div className="min-h-screen bg-verde-ebano flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-oro-antiguo/20 border-t-oro-antiguo rounded-full animate-spin" />
        <p className="text-[9px] uppercase tracking-[0.5em] text-oro-antiguo/40">Redirigiendo...</p>
      </div>
    </div>
  );
}
