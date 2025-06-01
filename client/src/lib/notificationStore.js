import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      console.log("[NotificationStore] Received response:", res);
      console.log("[NotificationStore] Contents of res.data:", res.data); 
      if (res.data && typeof res.data.number === "number") {
        set({ number: res.data.number });
      } else {
        console.warn(
          "[NotificationStore] Notification APIから予期した{number:X}の形式でデータが得られませんでした:",
          res.data
        );
      }
    } catch (error) {
      console.error("通知の取得に失敗しました(in notificationStore):", error);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
