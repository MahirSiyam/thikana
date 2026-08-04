"use client";

import { io, type Socket } from "socket.io-client";
import { auth } from "@/lib/firebase/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;
let connecting: Promise<Socket> | null = null;

export const getMessagesSocket = async () => {
  if (socket?.connected) return socket;
  if (connecting) return connecting;

  connecting = (async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Not signed in");
    }
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const token = await user.getIdToken();

    if (socket) {
      socket.auth = { token };
      if (!socket.connected) socket.connect();
      return socket;
    }

    socket = io(API_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: { token },
    });

    socket.on("connect_error", async () => {
      try {
        const fresh = await auth.currentUser?.getIdToken(true);
        if (fresh && socket) {
          socket.auth = { token: fresh };
        }
      } catch {
        // ignore
      }
    });

    return socket;
  })();

  try {
    return await connecting;
  } finally {
    connecting = null;
  }
};

export const disconnectMessagesSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
