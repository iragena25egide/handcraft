"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { initSocketClient, disconnectSocket } from "@/lib/socket";
import toast from "react-hot-toast";

export default function GlobalSocketProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAppSelector(state => state.user);

  useEffect(() => {
    if (isLoggedIn && (user?.role === "SUPER_ADMIN" || user?.role === "SELLER")) {
      const socket = initSocketClient();

      if (socket) {
        socket.on("new_order", (data: any) => {
          toast.success(`🎉 ${data.message} (Order #${data.orderId})`, {
            duration: 6000,
            icon: "🔔"
          });
        });
      }
    } else {
      disconnectSocket();
    }

    return () => {
      // Clean up listeners on unmount
      const socket = initSocketClient();
      if (socket) {
        socket.off("new_order");
      }
    };
  }, [isLoggedIn, user]);

  return <>{children}</>;
}
