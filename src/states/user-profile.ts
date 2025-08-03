import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserProfileState = {
  isOpen: boolean;
  openUserProfile: () => void;
  closeUserProfile: () => void;
  toggleUserProfile: () => void;
};

export const userProfileViewStore = create<UserProfileState>()(
  persist(
    (set) => ({
      isOpen: false,
      openUserProfile: () => set({ isOpen: true }),
      closeUserProfile: () => set({ isOpen: false }),
      toggleUserProfile: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "user-profile-view",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isOpen: state.isOpen }),
    }
  )
);
