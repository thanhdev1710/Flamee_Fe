import { create } from "zustand";

interface OnboardingState {
  step: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: number;
  gender: string;
  favorites: string[];
  avatar: string;
  bio: string;

  nextStep: () => void;
  prevStep: () => void;
  setUsername: (username: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setAddress: (address: string) => void;
  setDob: (dob: number) => void;
  setGender: (gender: string) => void;
  setFavorites: (favorites: string[]) => void;
  setAvatar: (avatar: string) => void;
  setBio: (bio: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 0,
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  dob: 0,
  gender: "",
  favorites: [],
  avatar: "",
  bio: "",

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setUsername: (username) => set({ username }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  setAddress: (address) => set({ address }),
  setDob: (dob) => set({ dob }),
  setGender: (gender) => set({ gender }),
  setFavorites: (favorites) => set({ favorites }),
  setAvatar: (avatar) => set({ avatar }),
  setBio: (bio) => set({ bio }),
}));

export const getOnboardingData = () => {
  const {
    username,
    firstName,
    lastName,
    email,
    phone,
    address,
    dob,
    gender,
    favorites,
    avatar,
    bio,
  } = useOnboardingStore.getState();

  return {
    username,
    firstName,
    lastName,
    email,
    phone,
    address,
    dob,
    gender,
    favorites,
    avatar,
    bio,
  };
};
