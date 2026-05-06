import { create } from "zustand";

export const useStore = create((set) => ({
  status: "idle",
  transcript: [],

  addMessage: (msg) =>
    set((state) => ({
      transcript: [...state.transcript, msg],
    })),

  setStatus: (status) => set({ status }),
}));