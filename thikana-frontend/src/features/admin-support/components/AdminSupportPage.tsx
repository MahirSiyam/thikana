"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  supportInboxTabs,
  supportTickets,
} from "@/features/admin-support/data/admin-support.mock";
import type {
  SupportInboxTabId,
  SupportTicket,
  SupportTicketPriority,
} from "@/features/admin-support/types/admin-support.types";

const priorityStyles: Record<SupportTicketPriority, string> = {
  High: "bg-[#fef2f2] text-[#ef4444]",
  Medium: "bg-[#fffbeb] text-[#f59e0b]",
  Low: "bg-[#f8fafc] text-brand-dark/50",
};

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
      <span
        className={`inline-flex w-fit rounded px-2 py-1 font-inter text-[10px] font-semibold uppercase ${priorityStyles[ticket.priority]}`}
      >
        {ticket.priority}
      </span>
    </button>
  );
}

function ConversationPanel({ ticket }: { ticket: SupportTicket }) {
  const [reply, setReply] = useState("");

  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white lg:min-h-[896px]">
      <div className="flex flex-col gap-3 border-b border-[#e2e8f0] p-4 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="font-inter text-base font-bold text-black">{ticket.subject}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-[#ef4444] px-3 py-2 font-inter text-[13px] text-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444] focus-visible:ring-offset-2"
          >
            Priority: {ticket.priority} ▼
          </button>
          <button
            type="button"
            className="rounded-md border border-[#e2e8f0] px-3 py-2 font-inter text-[13px] text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Assign To ▼
          </button>
          <button
            type="button"
            className="rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Mark Resolved
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6">
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
              <div className={`flex max-w-[320px] flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 font-inter text-sm leading-normal ${
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

      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] p-4 sm:flex-row sm:items-start">
        <button
          type="button"
          aria-label="Attach file"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/admin/icon-paperclip.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5"
          />
        </button>
        <label className="sr-only" htmlFor="support-reply">
          Reply message
        </label>
        <input
          id="support-reply"
          type="text"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Type your reply here..."
          className="min-w-0 flex-1 rounded-lg bg-[#f1f5f9] p-3 font-inter text-sm text-black outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
        <button
          type="button"
          className="shrink-0 rounded-md bg-black px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Send Reply
        </button>
      </div>
    </section>
  );
}

function SupportContextPanel({ ticket }: { ticket: SupportTicket }) {
  return (
    <aside className="flex w-full flex-col gap-5 rounded-xl border border-[#e2e8f0] bg-white p-4 lg:w-[200px] lg:shrink-0 lg:self-stretch">
      <h2 className="font-inter text-[13px] font-bold uppercase text-brand-dark/50">
        Support Context
      </h2>
      <div className="flex flex-col gap-3">
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
        <div className="flex flex-col gap-1">
          <p className="font-inter text-[11px] text-brand-dark/50">Linked Listings</p>
          <button
            type="button"
            className="w-fit font-inter text-[13px] font-semibold text-black underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            {ticket.context.linkedListings}
          </button>
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
  const [selectedTicketId, setSelectedTicketId] = useState(supportTickets[0]?.id ?? "");

  const visibleTickets = useMemo(
    () => supportTickets.filter((ticket) => ticket.tab === activeTab),
    [activeTab],
  );

  const selectedTicket =
    visibleTickets.find((ticket) => ticket.id === selectedTicketId) ?? visibleTickets[0];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 pt-0 lg:pt-6">
        <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
          Support Inbox
        </h1>

        <div
          role="tablist"
          aria-label="Support inbox filters"
          className="flex gap-8 overflow-x-auto border-b border-[#e2e8f0] pt-4"
        >
          {supportInboxTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id);
                  const first = supportTickets.find((ticket) => ticket.tab === tab.id);
                  if (first) setSelectedTicketId(first.id);
                }}
                className={`shrink-0 pb-3 font-inter text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-b-2 border-black font-bold text-black"
                    : "font-normal text-brand-dark/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {selectedTicket ? (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white xl:w-[200px] xl:shrink-0 xl:self-stretch">
              <div className="flex max-h-[420px] flex-1 flex-col overflow-y-auto xl:max-h-none">
                {visibleTickets.map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    selected={ticket.id === selectedTicket.id}
                    onSelect={() => setSelectedTicketId(ticket.id)}
                  />
                ))}
              </div>
              <div className="border-b border-[#e2e8f0] p-4">
                <p className="font-inter text-base font-bold text-black">Support Tickets</p>
              </div>
            </div>

            <ConversationPanel key={selectedTicket.id} ticket={selectedTicket} />
            <SupportContextPanel ticket={selectedTicket} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
