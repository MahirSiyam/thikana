import { publicFetch, type ApiResponse } from "./client";

export type ContactMessagePayload = {
  fullName: string;
  email: string;
  role?: string;
  subject: string;
  message: string;
  fileName?: string | null;
  attachmentUrl?: string | null;
};

export type SupportMessageItem = {
  id?: string;
  sender: "user" | "admin";
  body: string;
  time: string;
  initials: string;
};

export type SupportTicketDto = {
  _id?: string;
  id: string;
  ticketNumber: string;
  fullName: string;
  email: string;
  userRole: string;
  subject: string;
  message: string;
  fileName?: string | null;
  attachmentUrl?: string | null;
  status: "open" | "in_progress" | "resolved";
  priority: "Low" | "Medium" | "High";
  messages: SupportMessageItem[];
  createdAt: string;
  updatedAt: string;
};

export async function sendContactMessage(
  payload: ContactMessagePayload
): Promise<ApiResponse<SupportTicketDto>> {
  return publicFetch<SupportTicketDto>("/api/support/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchSupportTickets(
  status?: string
): Promise<ApiResponse<SupportTicketDto[]>> {
  const query = status ? `?status=${status}` : "";
  return publicFetch<SupportTicketDto[]>(`/api/support/tickets${query}`);
}

export async function updateSupportTicketApi(
  ticketId: string,
  payload: {
    status?: "open" | "in_progress" | "resolved";
    priority?: "Low" | "Medium" | "High";
    replyBody?: string;
  }
): Promise<ApiResponse<SupportTicketDto>> {
  return publicFetch<SupportTicketDto>(`/api/support/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
