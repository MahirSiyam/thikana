import { authorizedFetch } from "@/lib/api/client";

export type MessagePeer = {
  id: string;
  name: string;
  role: string | null;
  roleLabel: string;
  avatarUrl: string | null;
  online: boolean;
};

export type ConversationSummary = {
  id: string;
  peer: MessagePeer | null;
  preview: string;
  timeLabel: string;
  lastMessageAt: string | null;
  unread: boolean;
  unreadCount: number;
};

export type ChatMessageDto = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

export const listConversations = async () => {
  const response = await authorizedFetch<ConversationSummary[]>(
    "/api/messages/conversations"
  );
  return (response.data as ConversationSummary[]) || [];
};

export const startConversation = async (peerId: string, body?: string) => {
  const response = await authorizedFetch<ConversationSummary>(
    "/api/messages/conversations",
    {
      method: "POST",
      body: JSON.stringify({ peerId, body }),
    }
  );
  return response.data as ConversationSummary;
};

export const listMessages = async (
  conversationId: string,
  params?: { limit?: number; before?: string }
) => {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.before) search.set("before", params.before);
  const suffix = search.toString() ? `?${search}` : "";
  const response = await authorizedFetch<{
    items: ChatMessageDto[];
    hasMore: boolean;
  }>(`/api/messages/conversations/${conversationId}/messages${suffix}`);
  return (
    (response.data as { items: ChatMessageDto[]; hasMore: boolean }) || {
      items: [],
      hasMore: false,
    }
  );
};

export const sendMessage = async (conversationId: string, body: string) => {
  const response = await authorizedFetch<ChatMessageDto>(
    `/api/messages/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    }
  );
  return response.data as ChatMessageDto;
};

export const markConversationRead = async (conversationId: string) => {
  await authorizedFetch(`/api/messages/conversations/${conversationId}/read`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};
