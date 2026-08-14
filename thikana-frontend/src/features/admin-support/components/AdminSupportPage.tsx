"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  SupportInboxTabId,
  SupportTicket,
  SupportTicketPriority,
} from "@/features/admin-support/types/admin-support.types";
import {
  fetchSupportTickets,
  updateSupportTicketApi,
  type SupportTicketDto,
} from "@/lib/api/support";

const supportInboxTabs: { id: SupportInboxTabId; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

const priorityStyles: Record<SupportTicketPriority, string> = {
  High: "bg-[#fef2f2] text-[#ef4444]",
  Medium: "bg-[#fffbeb] text-[#f59e0b]",
  Low: "bg-[#f8fafc] text-brand-dark/50",
};

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function dtoToSupportTicket(dto: SupportTicketDto): SupportTicket {
  const tab: SupportInboxTabId =
    dto.status === "in_progress"
      ? "in-progress"
      : dto.status === "resolved"
      ? "resolved"
      : "open";

  const mappedMessages = (dto.messages || []).map((msg, index) => ({
    id: msg.id || String(index + 1),
    sender: msg.sender,
    initials: msg.initials || getInitials(dto.fullName),
    body: msg.body,
    time: msg.time || "Just now",
  }));

  if (mappedMessages.length === 0) {
    mappedMessages.push({
      id: "1",
      sender: "user",
      initials: getInitials(dto.fullName),
      body: dto.message,
      time: formatTimeAgo(dto.createdAt),
    });
  }

  return {
    id: dto._id || dto.id,
    ticketNumber: dto.ticketNumber,
    timeAgo: formatTimeAgo(dto.createdAt),
    userName: dto.fullName,
    userRole: dto.userRole || "User",
    preview: dto.message,
    priority: dto.priority || "Medium",
    subject: dto.subject,
    tab,
    fileName: dto.fileName || null,
    attachmentUrl: dto.attachmentUrl || null,
    messages: mappedMessages,
    context: {
      userPlan: "Standard User",
      accountStatus: "Active",
      memberSince: new Date(dto.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      linkedListings: "1 Contact Submission",
    },
    recentActivity: [
      {
        id: "1",
        label: "Contact Form Submitted",
        date: new Date(dto.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ],
  };
}

function TicketListItem({
  ticket,
  selected,
  onSelect,
}: {
  ticket: SupportTicket;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-2 border-b p-4 text-left transition-colors ${
        selected
          ? "border-b-black border-l-4 border-l-black bg-[#fafafa]"
          : "border-[#e2e8f0] border-l-4 border-l-transparent bg-white hover:bg-[#fafafa]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 font-inter text-brand-dark/50">
        <span className="text-xs">{ticket.ticketNumber}</span>
        <span className="text-[11px]">{ticket.timeAgo}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-inter text-sm font-semibold text-black">{ticket.userName}</span>
        <span className="rounded bg-[#f1f5f9] px-2 py-1 font-inter text-[10px] font-semibold uppercase text-[#475569]">
          {ticket.userRole}
        </span>
      </div>
      <p className="truncate font-inter text-[13px] text-[#475569]">{ticket.preview}</p>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex w-fit rounded px-2 py-1 font-inter text-[10px] font-semibold uppercase ${priorityStyles[ticket.priority]}`}
        >
          {ticket.priority}
        </span>
        {ticket.attachmentUrl ? (
          <span className="font-inter text-[10px] text-[#2563eb] font-semibold flex items-center gap-1">
            📎 Attachment
          </span>
        ) : null}
      </div>
    </button>
  );
}

function ConversationPanel({
  ticket,
  onUpdateTicket,
}: {
  ticket: SupportTicket;
  onUpdateTicket: (updated: SupportTicket) => void;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const response = await updateSupportTicketApi(ticket.id, {
        replyBody: reply.trim(),
      });
      if (response.data) {
        onUpdateTicket(dtoToSupportTicket(response.data));
      } else {
        const newMsg = {
          id: String(Date.now()),
          sender: "admin" as const,
          initials: "AD",
          body: reply.trim(),
          time: "Just now",
        };
        onUpdateTicket({
          ...ticket,
          messages: [...ticket.messages, newMsg],
        });
      }
      setReply("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const handleTogglePriority = async () => {
    const nextPriority: SupportTicketPriority =
      ticket.priority === "Low"
        ? "Medium"
        : ticket.priority === "Medium"
        ? "High"
        : "Low";
    try {
      const response = await updateSupportTicketApi(ticket.id, {
        priority: nextPriority,
      });
      if (response.data) {
        onUpdateTicket(dtoToSupportTicket(response.data));
      } else {
        onUpdateTicket({ ...ticket, priority: nextPriority });
      }
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  const handleSetStatus = async (status: "open" | "in_progress" | "resolved") => {
    try {
      const response = await updateSupportTicketApi(ticket.id, { status });
      if (response.data) {
        onUpdateTicket(dtoToSupportTicket(response.data));
      } else {
        const tab: SupportInboxTabId =
          status === "in_progress"
            ? "in-progress"
            : status === "resolved"
            ? "resolved"
            : "open";
        onUpdateTicket({ ...ticket, tab });
      }
    } catch (err) {
      console.error("Failed to set status:", err);
    }
  };

  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white lg:min-h-[896px]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#e2e8f0] p-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <span className="font-inter text-xs text-brand-dark/50">{ticket.ticketNumber}</span>
          <h2 className="font-inter text-base font-bold text-black">{ticket.subject}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Toggle */}
          <button
            type="button"
            onClick={handleTogglePriority}
            className="rounded-md border border-[#ef4444] px-3 py-2 font-inter text-[13px] font-medium text-[#ef4444] transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
          >
            Priority: {ticket.priority} ⚡
          </button>

          {/* Status Buttons */}
          {ticket.tab !== "in-progress" && (
            <button
              type="button"
              onClick={() => handleSetStatus("in_progress")}
              className="rounded-md border border-[#3b82f6] bg-[#eff6ff] px-3 py-2 font-inter text-[13px] font-medium text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
            >
              In Progress ⏳
            </button>
          )}

          {ticket.tab !== "resolved" ? (
            <button
              type="button"
              onClick={() => handleSetStatus("resolved")}
              className="rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Mark Resolved ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSetStatus("open")}
              className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-inter text-[13px] font-medium text-black transition-colors hover:bg-[#f1f5f9]"
            >
              Reopen Ticket ↻
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6">
        {/* Render Attached Image if exists */}
        {ticket.attachmentUrl ? (
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 flex flex-col gap-2">
            <span className="font-inter text-xs font-semibold text-brand-dark/70">
              Attached Image ({ticket.fileName || "screenshot.png"}):
            </span>
            <a
              href={ticket.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-block overflow-hidden rounded-lg border border-[#cbd5e1] max-w-sm hover:opacity-95"
            >
              <img
                src={ticket.attachmentUrl}
                alt={ticket.fileName || "Uploaded Screenshot"}
                className="max-h-64 w-full object-contain bg-white"
              />
              <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 font-inter text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                View Full Size ↗
              </span>
            </a>
          </div>
        ) : null}

        {ticket.messages.map((message) => {
          const isAdmin = message.sender === "admin";
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              {!isAdmin ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-brand-dark/50">
                  <span className="font-inter text-xs font-semibold text-white">
                    {message.initials}
                  </span>
                </div>
              ) : null}
              <div className={`flex max-w-[340px] flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 font-inter text-sm leading-normal whitespace-pre-wrap ${
                    isAdmin
                      ? "rounded-tl-xl rounded-tr-xl rounded-br rounded-bl-xl bg-black text-white"
                      : "rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl bg-[#f1f5f9] text-black"
                  }`}
                >
                  {message.body}
                </div>
                <span className="font-inter text-[11px] text-brand-dark/50">{message.time}</span>
              </div>
              {isAdmin ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#ef4444]">
                  <span className="font-inter text-xs font-semibold text-white">
                    {message.initials}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Reply Input */}
      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] p-4 sm:flex-row sm:items-start">
        <label className="sr-only" htmlFor="support-reply">
          Reply message
        </label>
        <input
          id="support-reply"
          type="text"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendReply();
          }}
          placeholder="Type your admin reply here..."
          className="min-w-0 flex-1 rounded-lg bg-[#f1f5f9] p-3 font-inter text-sm text-black outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
        <button
          type="button"
          onClick={handleSendReply}
          disabled={sending || !reply.trim()}
          className="shrink-0 rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </section>
  );
}

function SupportContextPanel({ ticket }: { ticket: SupportTicket }) {
  return (
    <aside className="flex w-full flex-col gap-5 rounded-xl border border-[#e2e8f0] bg-white p-4 lg:w-[220px] lg:shrink-0 lg:self-stretch">
      <h2 className="font-inter text-[13px] font-bold uppercase text-brand-dark/50">
        Support Context
      </h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">User Name</p>
          <p className="font-inter text-[13px] font-semibold text-black truncate">
            {ticket.userName}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">User Role</p>
          <p className="font-inter text-[13px] font-semibold text-black uppercase">
            {ticket.userRole}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">User Plan</p>
          <p className="font-inter text-[13px] font-semibold text-black">
            {ticket.context.userPlan}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">Account Status</p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#10b981]" aria-hidden="true" />
            <p className="font-inter text-[13px] font-semibold text-black">
              {ticket.context.accountStatus}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">Member Since</p>
          <p className="font-inter text-[13px] font-semibold text-black">
            {ticket.context.memberSince}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-[#e2e8f0]" />

      <div className="flex flex-col gap-3">
        <h3 className="font-inter text-[11px] font-bold uppercase text-brand-dark/50">
          Recent Activity
        </h3>
        <ul className="flex flex-col gap-2">
          {ticket.recentActivity.map((activity) => (
            <li key={activity.id} className="flex flex-col">
              <p className="font-inter text-xs text-black">{activity.label}</p>
              <p className="font-inter text-[10px] text-brand-dark/50">{activity.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<SupportInboxTabId>("open");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchSupportTickets();
      if (response.data) {
        const apiTickets = response.data.map(dtoToSupportTicket);
        setTickets(apiTickets);
      }
    } catch (err) {
      console.error("Could not load support tickets from DB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const visibleTickets = useMemo(
    () => tickets.filter((ticket) => ticket.tab === activeTab),
    [tickets, activeTab]
  );

  const selectedTicket =
    visibleTickets.find((ticket) => ticket.id === selectedTicketId) ??
    visibleTickets[0];

  const handleUpdateTicket = (updated: SupportTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 pt-0 lg:pt-6">
        <div className="flex items-center justify-between">
          <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            Support Inbox
          </h1>
          <button
            type="button"
            onClick={() => void loadTickets()}
            className="font-inter text-xs font-semibold text-brand-dark/70 underline hover:text-black"
          >
            {loading ? "Refreshing..." : "Refresh Inbox ↻"}
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Support inbox filters"
          className="flex gap-8 overflow-x-auto border-b border-[#e2e8f0] pt-4"
        >
          {supportInboxTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const tabCount = tickets.filter((t) => t.tab === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id);
                  const first = tickets.find((ticket) => ticket.tab === tab.id);
                  if (first) setSelectedTicketId(first.id);
                }}
                className={`shrink-0 pb-3 font-inter text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-b-2 border-black font-bold text-black"
                    : "font-normal text-brand-dark/50"
                }`}
              >
                {tab.label} ({tabCount})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[#e2e8f0] bg-white p-8">
            <p className="font-inter text-sm text-brand-dark/60">Loading support tickets...</p>
          </div>
        ) : selectedTicket ? (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white xl:w-[260px] xl:shrink-0 xl:self-stretch">
              <div className="border-b border-[#e2e8f0] p-4 bg-[#f8fafc]">
                <p className="font-inter text-sm font-bold text-black">Support Tickets ({visibleTickets.length})</p>
              </div>
              <div className="flex max-h-[420px] flex-1 flex-col overflow-y-auto xl:max-h-none">
                {visibleTickets.length === 0 ? (
                  <p className="p-4 text-center font-inter text-xs text-brand-dark/50">
                    No tickets in this section.
                  </p>
                ) : (
                  visibleTickets.map((ticket) => (
                    <TicketListItem
                      key={ticket.id}
                      ticket={ticket}
                      selected={ticket.id === selectedTicket.id}
                      onSelect={() => setSelectedTicketId(ticket.id)}
                    />
                  ))
                )}
              </div>
            </div>

            <ConversationPanel
              key={selectedTicket.id}
              ticket={selectedTicket}
              onUpdateTicket={handleUpdateTicket}
            />
            <SupportContextPanel ticket={selectedTicket} />
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white p-8">
            <p className="font-inter text-base font-bold text-black">No tickets in {supportInboxTabs.find(t => t.id === activeTab)?.label}</p>
            <p className="font-inter text-xs text-brand-dark/50">
              When users submit contact messages, they will appear here dynamically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


