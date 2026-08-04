import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  getConversationForUser,
  listConversations,
  listMessages,
  markConversationRead,
  MessageError,
  sendMessage,
  startConversation,
} from "../services/message.service";
import { getOnlineUserIds, getSocketServer } from "../socket";
import { sendZodError } from "../utils/http";
import {
  listMessagesQuerySchema,
  sendMessageSchema,
  startConversationSchema,
} from "../validation/message.validation";

const userIdOf = (req: Request) => String(req.user!._id);

const handleError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) return sendZodError(res, error);
  if (error instanceof MessageError) {
    return res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
  console.error("message controller error:", error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

const emitMessageEvents = (payload: {
  peerId: string;
  senderId: string;
  conversationId: string;
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    createdAt: string;
    mine?: boolean;
  };
}) => {
  const io = getSocketServer();
  if (!io) return;

  io.to(`user:${payload.peerId}`).emit("message:new", {
    ...payload.message,
    mine: false,
  });
  io.to(`user:${payload.senderId}`).emit("message:new", {
    ...payload.message,
    mine: true,
  });
  io.to(`user:${payload.peerId}`).emit("conversation:updated", {
    conversationId: payload.conversationId,
  });
  io.to(`user:${payload.senderId}`).emit("conversation:updated", {
    conversationId: payload.conversationId,
  });
};

export const listMyConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const items = await listConversations(userIdOf(req), getOnlineUserIds());
    return res.status(200).json({ success: true, message: "OK", data: items });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMyConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const conversation = await getConversationForUser(
      String(req.params.conversationId),
      userIdOf(req),
      getOnlineUserIds()
    );
    return res.status(200).json({ success: true, message: "OK", data: conversation });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listMyMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const query = listMessagesQuerySchema.parse(req.query);
    const data = await listMessages({
      conversationId: String(req.params.conversationId),
      userId: userIdOf(req),
      limit: query.limit,
      before: query.before,
    });
    return res.status(200).json({ success: true, message: "OK", data });
  } catch (error) {
    return handleError(res, error);
  }
};

export const startMyConversation = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const body = startConversationSchema.parse(req.body);
    const result = await startConversation({
      userId: userIdOf(req),
      peerId: body.peerId,
      body: body.body,
      onlineUserIds: getOnlineUserIds(),
    });

    if (result.message) {
      emitMessageEvents({
        peerId: result.peerId!,
        senderId: userIdOf(req),
        conversationId: result.conversation.id,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.conversation,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const sendMyMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const body = sendMessageSchema.parse(req.body);
    const result = await sendMessage({
      conversationId: String(req.params.conversationId),
      senderId: userIdOf(req),
      body: body.body,
    });

    emitMessageEvents({
      peerId: result.peerId,
      senderId: userIdOf(req),
      conversationId: result.conversationId,
      message: result.message,
    });

    return res.status(201).json({
      success: true,
      message: "Sent",
      data: result.message,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const markMyConversationRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    await markConversationRead(String(req.params.conversationId), userIdOf(req));
    return res.status(200).json({ success: true, message: "OK", data: { ok: true } });
  } catch (error) {
    return handleError(res, error);
  }
};
