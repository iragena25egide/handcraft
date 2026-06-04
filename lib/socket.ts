import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const initSocketClient = (): Socket | null => {
  if (typeof window === "undefined") return null;

  const token = Cookies.get("token");
  if (!token) return null;

  if (!socket) {
    socket = io("http://localhost:5000"); // update with dynamic API URL if needed

    socket.on("connect", () => {
      socket?.emit("authenticate", token);
    });

    socket.on("authenticated", (res) => {
      if (!res.success) {
        console.warn("Socket auth failed");
      }
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
