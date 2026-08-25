"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2, LogOut } from "lucide-react";

type ErpProfile = {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
};

export default function SelectProfilePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ErpProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        router.push("/admin/login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error: profilesError } = await supabase
        .from("erp_profiles")
        .select("*")
        .eq("account_id", userId)
        .order("created_at", { ascending: true });

      if (profilesError) throw new Error(profilesError.message);
      
      if (data && data.length > 0) {
        setProfiles(data);
      } else {
        // No profiles found for this account
        setError("No se encontraron perfiles para esta cuenta.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfile = (profileId: string) => {
    // Set cookie for 7 days
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `erp_profile_id=${profileId}; expires=${expires.toUTCString অ্যাকশন()}; path=/`;

    // Trigger router navigation to dashboard
    router.push("/admin");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // clear cookie
    document.cookie = "erp_profile_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2C3729] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#CBB67B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C3729] flex flex-col items-center justify-center p-6 text-[#E5DBD6] select-none font-sans relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] bg-[#CBB67B] rounded-full blur-[150px]" />
      </div>

      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B] text-[10px] uppercase tracking-widest transition-colors"
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl z-10 flex flex-col items-center"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display-erp font-bold text-[#E5DBD6] mb-4 tracking-wider">
            ¿Quién está operando?
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#CBB67B]">
            Selecciona tu perfil para acceder al Atelier Interno
          </p>
        </div>

        {error ? (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 text-sm rounded-none text-center">
            {error}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full">
            {profiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col items-center"
                onClick={() => handleSelectProfile(profile.id)}
              >
                <div className="w-32 h-32 md:w-40 md:w-40 rounded-none border border-[#CBB67B]/20 overflow-hidden mb-4 relative transition-all duration-300 group-hover:border-[#CBB67B] group-hover:scale-105 shadow-xl group-hover:shadow-[#CBB67B]/20">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-[#1F271D] flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#8E9A8B] group-hover:text-[#CBB67B] transition-colors">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-xl font-display-erp text-[#E5DBD6] group-hover:text-white transition-colors">{profile.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#8E9A8B] group-hover:text-[#CBB67B] mt-1">{profile.role}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
