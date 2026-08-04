import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { firebaseAdminAuth } from "../config/firebase-admin";
import {
  findUserByFirebaseUid,
  syncEmailVerified,
} from "../services/user.service";
import {
  getConversationForUser,
  MessageError,
  sendMessage,
} from "../services/message.service";

type AuthedSocket = Socket & {
  data: {
    userId: string;
    role: string;
  };
};

let io: Server | null = null;
const onlineCounts = new Map<string, number>();

export const getSocketServer = () => io;

export const getOnlineUserIds = () => new Set(onlineCounts.keys());

const markOnline = (userId: string) => {
  onlineCounts.set(userId, (onlineCounts.get(userId) || 0) + 1);
};

const markOffline = (userId: string) => {
  const next = (onlineCounts.get(userId) || 0) - 1;
  if (next <= 0) onlineCounts.delete(userId);
  else onlineCounts.set(userId, next);
};

export const initSocketServer = (httpServer: HttpServer, allowedOrigins: string[]) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    path: "/socket.io",
  });

  io.use(async (socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (typeof socket.handshake.headers.authorization === "string" &&
        socket.handshake.headers.authorization.startsWith("Bearer ")
          ? socket.handshake.headers.authorization.slice(7)
          : undefined);

      if (!token) {
        next(new Error("Authentication required"));
        return;
      }

      const decoded = await firebaseAdminAuth.verifyIdToken(token);
      const user = await findUserByFirebaseUid(decoded.uid);
      if (!user) {
        next(new Error("Profile not found"));
        return;
      }

      if (
        user.approvalStatus !== "approved" ||
        user.accountStatus !== "active"
      ) {
        next(new Error("Account not allowed"));
        return;
      }

      try {
        const firebaseRecord = await firebaseAdminAuth.getUser(decoded.uid);
        await syncEmailVerified(user, Boolean(firebaseRecord.emailVerified));
      } catch {
        // ignore transient sync failures
      }

      socket.data.userId = String(user._id);
      socket.data.role = user.role;
      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (rawSocket) => {
    const socket = rawSocket as AuthedSocket;
    const userId = socket.data.userId;
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${userId}`);
    const wasOffline = !onlineCounts.has(userId);
    markOnline(userId);
    if (wasOffline) {
      socket.broadcast.emit("presence:update", { userId, online: true });
    }

    socket.on(
      "message:send",
      async (
        payload: { conversationId?: string; body?: string },
        ack?: (response: unknown) => void
      ) => {
        try {
          if (!payload?.conversationId || !payload?.body?.trim()) {
            ack?.({ ok: false, message: "Invalid payload" });
            return;
          }

          const result = await sendMessage({
            conversationId: payload.conversationId,
            senderId: userId,
            body: payload.body,
          });

          io?.to(`user:${result.peerId}`).emit("message:new", {
            ...result.message,
            mine: false,
          });
          socket.emit("message:new", {
            ...result.message,
            mine: true,
          });
          io?.to(`user:${result.peerId}`).emit("conversation:updated", {
            conversationId: result.conversationId,
          });
          socket.emit("conversation:updated", {
            conversationId: result.conversationId,
          });

          ack?.({ ok: true, data: result.message });
        } catch (error) {
          const message =
            error instanceof MessageError
              ? error.message
              : "Could not send message";
          ack?.({ ok: false, message });
        }
      }
    );

    socket.on(
      "typing:update",
      async (payload: { conversationId?: string; typing?: boolean }) => {
        try {
          if (!payload?.conversationId) return;
          const conversation = await getConversationForUser(
            payload.conversationId,
            userId
          );
          const peerId = conversation.peer?.id;
          if (!peerId) return;
          io?.to(`user:${peerId}`).emit("typing:update", {
            conversationId: payload.conversationId,
            userId,
            typing: Boolean(payload.typing),
          });
        } catch {
          // ignore typing errors
        }
      }
    );

    socket.on("disconnect", () => {
      markOffline(userId);
      if (!onlineCounts.has(userId)) {
        socket.broadcast.emit("presence:update", { userId, online: false });
      }
    });
  });

  return io;
};
