import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FontProfileState = {
  font: string;
  setFont: (font: string) => void;
};

export const fontProfile = create<FontProfileState>()(
  persist(
    (set) => ({
      font: "Inter",
      setFont: (font: string) => set({ font }),
    }),
    {
      name: "ada-font",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ font: state.font }),
    }
  )
);
