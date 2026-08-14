import type { Request, Response } from "express";
import { ZodError } from "zod";
import { SupportTicketModel } from "../models/support-message.model";
import {
  safeSendEmail,
  sendSupportTicketStatusEmail,
} from "../services/email.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  contactSupportSchema,
  updateSupportTicketSchema,
} from "../validation/support.validation";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const createContactTicket = async (req: Request, res: Response) => {
  try {
    const payload = parseOrThrow(contactSupportSchema, req.body);
    const emailNormalized = payload.email.toLowerCase().trim();
    const initials = getInitials(payload.fullName);

    // Check if a support ticket thread already exists for this email
    let ticket = await SupportTicketModel.findOne({ email: emailNormalized }).sort({ createdAt: -1 });

    if (ticket) {
      // Append message to existing thread for this email
      ticket.messages.push({
        sender: "user",
        body: payload.message,
        time: "Just now",
        initials,
      });
      ticket.fullName = payload.fullName;
      ticket.subject = payload.subject;
      ticket.message = payload.message;
      if (payload.role) ticket.userRole = payload.role;
      if (payload.fileName) ticket.fileName = payload.fileName;
      if (payload.attachmentUrl) ticket.attachmentUrl = payload.attachmentUrl;
      ticket.status = "open"; // Move back to Open tab so admin sees the new message

      await ticket.save();
    } else {
      // Create new ticket if this is the first submission from this email
      const count = await SupportTicketModel.countDocuments();
      const ticketNumber = `TK-${9021 + count}`;

      ticket = await SupportTicketModel.create({
        ticketNumber,
        fullName: payload.fullName,
        email: emailNormalized,
        userRole: payload.role || "User",
        subject: payload.subject,
        message: payload.message,
        fileName: payload.fileName || null,
        attachmentUrl: payload.attachmentUrl || null,
        status: "open",
        priority: "Medium",
        messages: [
          {
            sender: "user",
            body: payload.message,
            time: "Just now",
            initials,
          },
        ],
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully! Our support team will get back to you soon.",
      data: ticket,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("createContactTicket error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send message. Please try again later.",
    });
  }
};

export const listSupportTickets = async (req: Request, res: Response) => {
  try {
    const statusParam = req.query.status as string | undefined;
    const validStatuses = ["open", "in_progress", "resolved"] as const;
    const status = validStatuses.includes(statusParam as "open" | "in_progress" | "resolved")
      ? (statusParam as "open" | "in_progress" | "resolved")
      : undefined;

    // Consolidate duplicate tickets for the same email into a single thread
    const allTickets = await SupportTicketModel.find({}).sort({ createdAt: 1 });
    const emailGroupMap = new Map<string, typeof allTickets[0]>();
    const duplicateIdsToDelete: string[] = [];

    for (const item of allTickets) {
      const emailKey = item.email.toLowerCase().trim();
      if (!emailGroupMap.has(emailKey)) {
        emailGroupMap.set(emailKey, item);
      } else {
        const primary = emailGroupMap.get(emailKey)!;
        primary.messages.push(...item.messages);
        primary.subject = item.subject;
        primary.message = item.message;
        if (item.fileName) primary.fileName = item.fileName;
        if (item.attachmentUrl) primary.attachmentUrl = item.attachmentUrl;
        if (item.status === "open" || item.status === "in_progress") {
          primary.status = item.status;
        }
        await primary.save();
        duplicateIdsToDelete.push(item._id.toString());
      }
    }

    if (duplicateIdsToDelete.length > 0) {
      await SupportTicketModel.deleteMany({ _id: { $in: duplicateIdsToDelete } });
    }

    const filter = status ? { status } : {};
    const tickets = await SupportTicketModel.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("listSupportTickets error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load support tickets",
    });
  }
};

export const updateSupportTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;
    const payload = parseOrThrow(updateSupportTicketSchema, req.body);

    const ticket = await SupportTicketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    let statusChanged = false;
    if (payload.status && payload.status !== ticket.status) {
      ticket.status = payload.status;
      statusChanged = true;
    }
    if (payload.priority) ticket.priority = payload.priority;
    if (payload.replyBody) {
      ticket.messages.push({
        sender: "admin",
        body: payload.replyBody,
        time: "Just now",
        initials: "AD",
      });
    }

    await ticket.save();

    // Notify user by email when ticket status changes (In Progress / Resolved) or Admin replies
    if (statusChanged || payload.replyBody) {
      void safeSendEmail(`support ticket status email (${ticket.ticketNumber})`, () =>
        sendSupportTicketStatusEmail({
          email: ticket.email,
          name: ticket.fullName,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          status: ticket.status as "open" | "in_progress" | "resolved",
          adminReply: payload.replyBody,
        })
      );
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket updated",
      data: ticket,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("updateSupportTicket error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update support ticket",
    });
  }
};
