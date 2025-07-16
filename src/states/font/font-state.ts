import { create } from "zustand";

type FontProfileState = {
  font: string;
  setFont: (font: string) => void;
};

export const fontProfile = create<FontProfileState>((set) => ({
  font: "Inter",
  setFont: (font: string) => set({ font }),
}));
