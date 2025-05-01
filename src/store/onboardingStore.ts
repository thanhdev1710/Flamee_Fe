import { CreateUserStateType, CreateUserType } from "@/types/user.type";
import { create } from "zustand";

export const useOnboardingStore = create<CreateUserStateType>((set) => ({
  step: 0,
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  dob: new Date(),
  gender: "Khác",
  favorites: [],
  avatar: "",
  bio: "",
  username: "",

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setPhone: (phone) => set({ phone }),
  setAddress: (address) => set({ address }),
  setDob: (dob) => set({ dob }),
  setGender: (gender) => set({ gender }),
  setFavorites: (favorites) => set({ favorites }),
  setAvatar: (avatar) => set({ avatar }),
  setBio: (bio) => set({ bio }),
  setUsername: (username) => set({ username }),
}));

export const getOnboardingData = (): CreateUserType => {
  const {
    firstName,
    lastName,
    phone,
    address,
    dob,
    gender,
    favorites,
    avatar,
    bio,
    username,
  } = useOnboardingStore.getState();

  return {
    firstName,
    lastName,
    phone,
    address,
    dob,
    gender,
    favorites,
    avatar,
    bio,
    username,
  };
};
