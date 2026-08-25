import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilityState {
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large';
  highContrast: boolean;
  voiceReader: boolean;
  isPanelOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: 'normal' | 'large') => void;
  setHighContrast: (contrast: boolean) => void;
  setVoiceReader: (voice: boolean) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      theme: 'light', // 'light' is default (Hueso Seda)
      fontSize: 'normal',
      highContrast: false,
      voiceReader: false,
      isPanelOpen: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      setHighContrast: (contrast) => set({ highContrast: contrast }),
      setVoiceReader: (voice) => set({ voiceReader: voice }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelOpen: (open) => set({ isPanelOpen: open }),
    }),
    {
      name: 'accessibility-storage',
      // No we do not persist `isPanelOpen` so it doesn't open randomly on reload
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        voiceReader: state.voiceReader,
      }),
    }
  )
);
