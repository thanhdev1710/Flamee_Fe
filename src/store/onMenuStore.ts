import { create } from "zustand";

interface MenuType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: () => void;
}

export const useMenuStore = create<MenuType>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
