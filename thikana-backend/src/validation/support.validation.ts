import { z } from "zod";

export const contactSupportSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().trim().optional().default("Just browsing"),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(4000),
  fileName: z.string().trim().optional().nullable(),
  attachmentUrl: z.string().trim().optional().nullable(),
});

export const updateSupportTicketSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  replyBody: z.string().trim().max(2000).optional(),
});

export type ContactSupportInput = z.infer<typeof contactSupportSchema>;
export type UpdateSupportTicketInput = z.infer<typeof updateSupportTicketSchema>;
