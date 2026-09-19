import { create } from 'zustand';

interface EditModeState {
  isEditing: boolean;
  isAdmin: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  toggleEditing: () => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditing: false,
  isAdmin: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
}));
