import { create } from "zustand";

type UserProfileState = {
  isOpen: boolean;
  openUserProfile: () => void;
  closeUserProfile: () => void;
  toggleUserProfile: () => void;
};

export const userProfileViewStore = create<UserProfileState>((set) => ({
  isOpen: false,
  openUserProfile: () => set({ isOpen: true }),
  closeUserProfile: () => set({ isOpen: false }),
  toggleUserProfile: () => set((state) => ({ isOpen: !state.isOpen })),
}));
