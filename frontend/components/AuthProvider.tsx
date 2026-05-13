"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../lib/store/useAuthStore";

/**
 * AuthProvider — Listens to Supabase auth state changes globally.
 * Hydrates the Zustand store on page load and on sign-in/sign-out events.
 * Must be rendered once inside the root layout.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshProfile, logout, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    // Hydrate on mount (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        refreshProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await refreshProfile();
        } else if (event === "SIGNED_OUT") {
          logout();
        } else if (event === "TOKEN_REFRESHED" && session) {
          await refreshProfile();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
