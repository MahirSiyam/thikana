"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  messageConversations as initialConversations,
  messagesDateRangeLabel,
} from "@/features/service-provider-messages/data/service-provider-messages.mock";
import type {
  ChatMessage,
  MessageConversation,
} from "@/features/service-provider-messages/types/service-provider-messages.types";

function MoreVerticalIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="size-5"
    >
      <circle cx="10" cy="4" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ConversationRow({
  conversation,
  selected,
  onSelect,
}: {
  conversation: MessageConversation;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-[76px] w-full items-center gap-3 border-b border-[#f0f0ee] px-4 text-left transition-colors ${
        selected ? "bg-[rgba(10,10,10,0.1)]" : "bg-white hover:bg-[#fafaf9]"
      }`}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-[3px] bg-brand-dark"
        />
      ) : null}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
        <Image
          src={conversation.avatarSrc}
          alt=""
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate font-inter text-sm font-bold text-brand-dark">
            {conversation.name}
          </p>
          <span className="shrink-0 rounded bg-[#f5f5f3] px-1.5 py-0.5 font-inter text-[10px] font-semibold text-[#6b7280]">
            {conversation.role}
          </span>
          <span className="ml-auto shrink-0 font-inter text-[11px] text-[#6b7280]">
            {conversation.timeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={`min-w-0 flex-1 truncate font-inter text-xs ${
              selected ? "text-brand-dark" : "text-[#6b7280]"
            }`}
          >
            {conversation.preview}
          </p>
          {conversation.unread ? (
            <span
              aria-label="Unread"
              className="size-2 shrink-0 rounded-full bg-brand-dark"
            />
          ) : null}
        </div>
      </div>
    </button>
  );
}

function ChatPanel({
  conversation,
  draft,
  onDraftChange,
  onSend,
}: {
  conversation: MessageConversation;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden bg-white lg:min-h-[896px]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#e5e5e2] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={conversation.avatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-inter text-[15px] font-bold text-brand-dark">
                {conversation.name}
              </h2>
              <span className="rounded bg-[#f5f5f3] px-1.5 py-0.5 font-inter text-[10px] font-semibold text-[#6b7280]">
                {conversation.role}
              </span>
            </div>
            {conversation.online ? (
              <p className="font-inter text-[11px] text-[#16a34a]">● Online</p>
            ) : (
              <p className="font-inter text-[11px] text-[#6b7280]">Offline</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {conversation.subject ? (
            <span className="hidden shrink-0 items-center rounded-lg bg-[#fef3c7] px-2.5 py-1.5 font-inter text-[11px] font-semibold text-[#f59e0b] sm:inline-flex">
              {conversation.subject}
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Conversation options"
            className="inline-flex size-9 items-center justify-center rounded-lg text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            <MoreVerticalIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-[#fafaf9] p-4 sm:p-6">
        <p className="text-center font-inter text-[11px] uppercase text-[#6b7280]">
          {conversation.dateLabel}
        </p>

        {conversation.messages.map((message) => {
          const isMine = message.sender === "me";
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1.5 ${isMine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[400px] p-3 font-inter text-[13px] leading-normal ${
                  isMine
                    ? "rounded-bl-xl rounded-br rounded-tl-xl rounded-tr-xl bg-brand-dark text-white"
                    : "rounded-bl rounded-br-xl rounded-tl-xl rounded-tr-xl bg-[#f5f5f3] text-brand-dark"
                }`}
              >
                {message.body}
              </div>
              <span className="font-inter text-[11px] text-[#6b7280]">
                {message.time}
              </span>
            </div>
          );
        })}
      </div>

      <form
        className="flex shrink-0 items-center gap-4 border-t border-[#e5e5e2] bg-white p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <button
          type="button"
          aria-label="Attach file"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/tenant/icon-paperclip.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5"
          />
        </button>
        <label className="sr-only" htmlFor="service-provider-message-input">
          Write a message
        </label>
        <input
          id="service-provider-message-input"
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Write a message..."
          className="h-11 min-w-0 flex-1 rounded-[22px] bg-[#f5f5f3] px-4 font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280] focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-md bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/tenant/icon-send.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
            className="size-[18px]"
          />
        </button>
      </form>
    </section>
  );
}

export function ServiceProviderMessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? "");
  const [chatQuery, setChatQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const filteredConversations = useMemo(() => {
    const query = chatQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.preview.toLowerCase().includes(query),
    );
  }, [chatQuery, conversations]);

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedId) ??
    filteredConversations[0] ??
    conversations[0];

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileShowChat(true);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: false } : conversation,
      ),
    );
  }

  function handleSend() {
    const body = draft.trim();
    if (!body || !selectedConversation) return;

    const nextMessage: ChatMessage = {
      id: `${selectedConversation.id}-${Date.now()}`,
      sender: "me",
      body,
      time: "Just now",
    };

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== selectedConversation.id) return conversation;
        return {
          ...conversation,
          preview: body,
          timeLabel: "Just now",
          messages: [...conversation.messages, nextMessage],
        };
      }),
    );
    setDraft("");
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Messages</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
              <Image
                src="/images/service-provider/icon-search.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
                className="size-3.5 shrink-0"
              />
              <label className="sr-only" htmlFor="service-provider-messages-search">
                Search messages
              </label>
              <input
                id="service-provider-messages-search"
                type="search"
                placeholder="Search messages..."
                className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e5e5e2] bg-white px-4 font-inter text-[13px] font-medium text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Image
                  src="/images/service-provider/icon-calendar.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                  className="size-3.5"
                />
                {messagesDateRangeLabel}
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Image
                  src="/images/service-provider/icon-bell.svg"
                  alt=""
                  width={24}
                  height={20}
                  aria-hidden="true"
                  className="h-5 w-6"
                />
              </button>
              <button
                type="button"
                aria-label="Settings"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Image
                  src="/images/service-provider/icon-settings.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="size-5"
                />
              </button>
              <div className="relative size-9 overflow-hidden rounded-full">
                <Image
                  src={serviceProviderUser.topbarAvatarSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#e5e5e2] bg-white lg:flex-row">
          <aside
            className={`w-full shrink-0 border-[#e5e5e2] lg:w-[320px] lg:border-r ${
              mobileShowChat ? "hidden lg:flex lg:flex-col" : "flex flex-col"
            }`}
          >
            <div className="flex flex-col gap-3 p-4">
              <p className="font-inter text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                Messages
              </p>
              <div className="flex h-9 items-center gap-2 rounded-lg border border-[#e5e5e2] px-3">
                <Image
                  src="/images/service-provider/icon-search.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                  className="size-3.5 shrink-0"
                />
                <label className="sr-only" htmlFor="service-provider-chats-search">
                  Search conversations
                </label>
                <input
                  id="service-provider-chats-search"
                  type="search"
                  value={chatQuery}
                  onChange={(event) => setChatQuery(event.target.value)}
                  placeholder="Search conversations..."
                  className="min-w-0 flex-1 bg-transparent font-inter text-xs text-brand-dark outline-none placeholder:text-[#6b7280]"
                />
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto lg:max-h-none lg:flex-1">
              {filteredConversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  selected={conversation.id === selectedConversation?.id}
                  onSelect={() => handleSelect(conversation.id)}
                />
              ))}
            </div>
          </aside>

          <div
            className={`min-w-0 flex-1 ${
              mobileShowChat ? "flex flex-col" : "hidden lg:flex lg:flex-col"
            }`}
          >
            {selectedConversation ? (
              <>
                <div className="border-b border-[#e5e5e2] px-4 py-3 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    ← Back to chats
                  </button>
                </div>
                <ChatPanel
                  conversation={selectedConversation}
                  draft={draft}
                  onDraftChange={setDraft}
                  onSend={handleSend}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
