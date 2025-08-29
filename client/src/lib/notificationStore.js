import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set, get) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      set({ number: res.data });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  },
  decrease: () => {
    set((prev) => ({ number: Math.max(0, prev.number - 1) }));
  },
  decreaseBy: (count) => {
    set((prev) => ({ number: Math.max(0, prev.number - count) }));
  },
  reset: () => {
    set({ number: 0 });
  },
  sync: async () => {
    // Force sync with server to ensure accuracy
    try {
      const res = await apiRequest("/users/notification");
      set({ number: res.data });
    } catch (err) {
      console.error("Failed to sync notifications:", err);
    }
  },
}));
