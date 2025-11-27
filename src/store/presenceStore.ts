import { create } from "zustand";

type PresenceInfo = {
  isOnline: boolean;
  lastSeen?: string | null;
};

type PresenceMap = Record<string, PresenceInfo>;

type State = {
  presence: PresenceMap;
  setPresence: (userId: string, data: PresenceInfo) => void;
  setInitialPresence: (
    list: { userId: string; isOnline: boolean; lastSeen?: string | null }[]
  ) => void;
};

export const usePresenceStore = create<State>((set) => ({
  presence: {},

  setPresence: (userId, data) =>
    set((state) => ({
      presence: {
        ...state.presence,
        [userId]: data,
      },
    })),

  setInitialPresence: (list) =>
    set((state) => {
      const next = { ...state.presence };
      list.forEach((u) => {
        next[String(u.userId)] = {
          isOnline: u.isOnline,
          lastSeen: u.lastSeen ?? null,
        };
      });
      return { presence: next };
    }),
}));
