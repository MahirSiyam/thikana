export type MessageParticipantRole = "Customer";

export type MessageSender = "them" | "me";

export type ChatMessage = {
  id: string;
  sender: MessageSender;
  body: string;
  time: string;
};

export type MessageConversation = {
  id: string;
  name: string;
  role: MessageParticipantRole;
  avatarSrc: string;
  timeLabel: string;
  preview: string;
  unread?: boolean;
  online?: boolean;
  subject?: string;
  dateLabel: string;
  messages: ChatMessage[];
};
