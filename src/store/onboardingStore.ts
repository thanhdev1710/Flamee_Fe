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
  avatar_url: "",
  bio: "",
  username: "",
  course: "",
  major: "",
  mssv: "",

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setPhone: (phone) => set({ phone }),
  setAddress: (address) => set({ address }),
  setDob: (dob) => set({ dob }),
  setGender: (gender) => set({ gender }),
  setFavorites: (favorites) => set({ favorites }),
  setAvatarUrl: (avatar_url) => set({ avatar_url }),
  setBio: (bio) => set({ bio }),
  setUsername: (username) => set({ username }),
  setCourse: (course) => set({ course }),
  setMajor: (major) => set({ major }),
  setMSSV: (mssv) => set({ mssv }),
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
    avatar_url,
    bio,
    username,
    course,
    major,
    mssv,
  } = useOnboardingStore.getState();

  return {
    firstName,
    lastName,
    phone,
    address,
    dob,
    gender,
    favorites,
    avatar_url,
    bio,
    username,
    course,
    major,
    mssv,
  };
};
