import { create } from "zustand";

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  team_id?: string;
};

type SessionState = {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
};

export const useSession = create<SessionState>((set) => ({
  user: null,
  signIn: (user) => set({ user }),
  signOut: () => set({ user: null }),
}));
