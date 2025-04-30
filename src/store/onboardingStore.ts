import { create } from "zustand";

interface OnboardingState {
  step: number;
  name: string;
  dob: number;
  gender: string;
  favorites: string[];
  avatar: string;
  bio: string;
  nextStep: () => void;
  prevStep: () => void;
  setName: (name: string) => void;
  setDob: (dob: number) => void;
  setGender: (gender: string) => void;
  setFavorites: (favorites: string[]) => void;
  setAvatar: (avatar: string) => void;
  setBio: (bio: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 0,
  name: "",
  dob: 0,
  gender: "",
  favorites: [],
  avatar: "",
  bio: "",
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setName: (name) => set({ name }),
  setDob: (dob) => set({ dob }),
  setGender: (gender) => set({ gender }),
  setFavorites: (favorites) => set({ favorites }),
  setAvatar: (avatar) => set({ avatar }),
  setBio: (bio) => set({ bio }),
}));
