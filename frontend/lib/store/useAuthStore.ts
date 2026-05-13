import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase';
import type { CircleTier } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
  avatarUrl?: string;
  phone?: string;
  isCircleMember: boolean;
  circleTier: CircleTier;
  circlePoints: number;
  circleCode?: string;
  ringSize?: string;
  braceletSize?: string;
  necklaceLength?: string;
  preferredCollections?: string[];
  preferredMaterials?: string[];
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      refreshProfile: async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          set({
            user: {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name || profile.email.split('@')[0],
              displayName: profile.display_name,
              avatarUrl: profile.avatar_url,
              phone: profile.phone,
              isCircleMember: profile.is_circle_member,
              circleTier: profile.circle_tier as CircleTier,
              circlePoints: profile.circle_points,
              circleCode: profile.circle_code,
              ringSize: profile.ring_size,
              braceletSize: profile.bracelet_size,
              necklaceLength: profile.necklace_length,
              preferredCollections: profile.preferred_collections,
              preferredMaterials: profile.preferred_materials,
            },
            isAuthenticated: true,
          });
        }
      },
    }),
    { name: 'minerva-auth-storage' }
  )
);
