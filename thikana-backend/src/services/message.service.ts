import { Types } from "mongoose";
import { ConversationModel } from "../models/conversation.model";
import { MessageModel } from "../models/message.model";
import { User } from "../models/user.model";
import { resolveAvatarUrl } from "./user.service";

export class MessageError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "MessageError";
    this.code = code;
    this.status = status;
  }
}

const toObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new MessageError("Invalid id", "INVALID_ID", 400);
  }
  return new Types.ObjectId(id);
};

export const participantKeyFor = (a: string, b: string) =>
  [a, b].sort().join(":");

const roleLabel = (role?: string | null) => {
  switch (role) {
    case "tenant":
      return "Tenant";
    case "owner":
      return "Owner";
    case "service_provider":
      return "Service Provider";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};

const formatTimeLabel = (date?: Date | null) => {
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

type LeanUser = {
  _id: unknown;
  fullName?: string | null;
  email?: string | null;
  role?: string | null;
  profileImage?: {
    publicId?: string;
    resourceType?: "image" | "raw";
    secureUrl?: string | null;
  } | null;
  identityDocuments?: {
    selfie?: {
      publicId?: string;
      resourceType?: "image" | "raw";
      secureUrl?: string | null;
    } | null;
  } | null;
};

const peerDto = (user: LeanUser) => ({
  id: String(user._id),
  name: user.fullName || user.email || "User",
  role: user.role || null,
  roleLabel: roleLabel(user.role),
  avatarUrl: resolveAvatarUrl(user),
});

const unreadFor = (
  unreadBy: Map<string, number> | Record<string, number> | undefined,
  userId: string
) => {
  if (!unreadBy) return 0;
  if (unreadBy instanceof Map) return Number(unreadBy.get(userId) || 0);
  return Number(unreadBy[userId] || 0);
};

const toConversationDto = (
  conversation: {
    _id: unknown;
    participants: unknown[];
    lastMessageText?: string | null;
    lastMessageAt?: Date | null;
    lastSenderId?: unknown;
    unreadBy?: Map<string, number> | Record<string, number>;
    updatedAt?: Date;
  },
  viewerId: string,
  peer: LeanUser | undefined,
  onlineUserIds?: Set<string>
) => {
  const peerId = peer ? String(peer._id) : "";
  return {
    id: String(conversation._id),
    peer: peer
      ? {
          ...peerDto(peer),
          online: onlineUserIds?.has(peerId) ?? false,
        }
      : null,
    preview: conversation.lastMessageText || "",
    timeLabel: formatTimeLabel(conversation.lastMessageAt),
    lastMessageAt: conversation.lastMessageAt?.toISOString() || null,
    unread: unreadFor(conversation.unreadBy, viewerId) > 0,
    unreadCount: unreadFor(conversation.unreadBy, viewerId),
  };
};

const loadPeers = async (userIds: string[]) => {
  if (!userIds.length) return new Map<string, LeanUser>();
  const users = await User.find({ _id: { $in: userIds.map(toObjectId) } })
    .select("fullName email role profileImage identityDocuments.selfie")
    .lean<LeanUser[]>();
  return new Map(users.map((user) => [String(user._id), user]));
};

export const listConversations = async (
  userId: string,
  onlineUserIds?: Set<string>
) => {
  const viewerObjectId = toObjectId(userId);
  const conversations = await ConversationModel.find({
    participants: viewerObjectId,
  })
    .sort({ lastMessageAt: -1 })
    .limit(100)
    .lean();

  const peerIds = conversations.map((conversation) => {
    const ids = conversation.participants.map(String);
    return ids.find((id) => id !== userId) || ids[0];
  });
  const peers = await loadPeers(peerIds.filter(Boolean));

  return conversations.map((conversation) => {
    const ids = conversation.participants.map(String);
    const peerId = ids.find((id) => id !== userId) || ids[0];
    return toConversationDto(
      conversation,
      userId,
      peers.get(peerId),
      onlineUserIds
    );
  });
};

export const getConversationForUser = async (
  conversationId: string,
  userId: string,
  onlineUserIds?: Set<string>
) => {
  const conversation = await ConversationModel.findById(conversationId).lean();
  if (!conversation) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }
  const participantIds = conversation.participants.map(String);
  if (!participantIds.includes(userId)) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }

  const peerId = participantIds.find((id) => id !== userId) || participantIds[0];
  const peers = await loadPeers([peerId]);
  return toConversationDto(
    conversation,
    userId,
    peers.get(peerId),
    onlineUserIds
  );
};

export const listMessages = async (input: {
  conversationId: string;
  userId: string;
  limit: number;
  before?: string;
}) => {
  await getConversationForUser(input.conversationId, input.userId);

  const filter: Record<string, unknown> = {
    conversationId: toObjectId(input.conversationId),
  };
  if (input.before) {
    filter.createdAt = { $lt: new Date(input.before) };
  }

  const rows = await MessageModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(input.limit)
    .lean();

  const messages = rows.reverse().map((row) => ({
    id: String(row._id),
    conversationId: String(row.conversationId),
    senderId: String(row.senderId),
    body: row.body,
    createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
    mine: String(row.senderId) === input.userId,
  }));

  return {
    items: messages,
    hasMore: rows.length === input.limit,
  };
};

export const ensureConversation = async (userId: string, peerId: string) => {
  if (userId === peerId) {
    throw new MessageError(
      "You cannot message yourself",
      "INVALID_PEER",
      400
    );
  }

  const peer = await User.findById(peerId)
    .select("fullName email role accountStatus approvalStatus")
    .lean();
  if (!peer || peer.accountStatus !== "active") {
    throw new MessageError("User not found", "PEER_NOT_FOUND", 404);
  }

  const key = participantKeyFor(userId, peerId);
  let conversation = await ConversationModel.findOne({ participantKey: key });
  if (!conversation) {
    conversation = await ConversationModel.create({
      participantKey: key,
      participants: [toObjectId(userId), toObjectId(peerId)],
      lastMessageText: "",
      lastMessageAt: new Date(),
      unreadBy: {},
    });
  }

  return conversation;
};

export const sendMessage = async (input: {
  conversationId: string;
  senderId: string;
  body: string;
}) => {
  const conversation = await ConversationModel.findById(input.conversationId);
  if (!conversation) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }

  const participantIds = conversation.participants.map(String);
  if (!participantIds.includes(input.senderId)) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }

  const body = input.body.trim();
  if (!body) {
    throw new MessageError("Message cannot be empty", "EMPTY_BODY", 400);
  }

  const message = await MessageModel.create({
    conversationId: conversation._id,
    senderId: toObjectId(input.senderId),
    body,
  });

  const peerId = participantIds.find((id) => id !== input.senderId)!;
  const unreadBy = conversation.unreadBy || new Map();
  const currentUnread =
    unreadBy instanceof Map
      ? Number(unreadBy.get(peerId) || 0)
      : Number((unreadBy as Record<string, number>)[peerId] || 0);

  conversation.lastMessageText = body.slice(0, 2000);
  conversation.lastMessageAt = message.createdAt || new Date();
  conversation.lastSenderId = toObjectId(input.senderId);
  if (conversation.unreadBy instanceof Map) {
    conversation.unreadBy.set(peerId, currentUnread + 1);
    conversation.unreadBy.set(input.senderId, 0);
  } else {
    conversation.set(`unreadBy.${peerId}`, currentUnread + 1);
    conversation.set(`unreadBy.${input.senderId}`, 0);
  }
  await conversation.save();

  return {
    message: {
      id: String(message._id),
      conversationId: String(message.conversationId),
      senderId: String(message.senderId),
      body: message.body,
      createdAt: message.createdAt?.toISOString() || new Date().toISOString(),
      mine: true,
    },
    peerId,
    conversationId: String(conversation._id),
  };
};

export const markConversationRead = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }
  if (!conversation.participants.map(String).includes(userId)) {
    throw new MessageError("Conversation not found", "NOT_FOUND", 404);
  }

  if (conversation.unreadBy instanceof Map) {
    conversation.unreadBy.set(userId, 0);
  } else {
    conversation.set(`unreadBy.${userId}`, 0);
  }
  await conversation.save();
  return { ok: true };
};

export const startConversation = async (input: {
  userId: string;
  peerId: string;
  body?: string;
  onlineUserIds?: Set<string>;
}) => {
  const conversation = await ensureConversation(input.userId, input.peerId);
  let sent: Awaited<ReturnType<typeof sendMessage>> | null = null;
  if (input.body?.trim()) {
    sent = await sendMessage({
      conversationId: String(conversation._id),
      senderId: input.userId,
      body: input.body,
    });
  }

  const dto = await getConversationForUser(
    String(conversation._id),
    input.userId,
    input.onlineUserIds
  );

  return { conversation: dto, message: sent?.message ?? null, peerId: sent?.peerId };
};
