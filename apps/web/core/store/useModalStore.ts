// src/core/store/useModalStore.ts
import { create } from 'zustand';

// Add all future modal types here
export type ActiveModalType = "TASK" | "GOAL" | "HABIT" | "REFLECTION" | "NOTIFICATION" | null;

interface ModalStore {
  activeModal: ActiveModalType;
  openModal: (modal: ActiveModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  
  openModal: (modal) => set({ activeModal: modal }),
  
  closeModal: () => set({ activeModal: null }),
}));