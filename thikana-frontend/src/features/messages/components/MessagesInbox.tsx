"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useMessaging } from "@/features/messages/hooks/useMessaging";
import type { ChatMessageDto, ConversationSummary } from "@/lib/api/messages";

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
  conversation: ConversationSummary;
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
      <ProfileAvatar
        src={conversation.peer?.avatarUrl}
        alt=""
        size="md"
        className="rounded-full"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate font-inter text-sm font-bold text-brand-dark">
            {conversation.peer?.name || "User"}
          </p>
          <span className="shrink-0 rounded bg-[#f5f5f3] px-1.5 py-0.5 font-inter text-[10px] font-semibold text-[#6b7280]">
            {conversation.peer?.roleLabel || "User"}
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
            {conversation.preview || "No messages yet"}
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
  messages,
  draft,
  onDraftChange,
  onSend,
  sending,
  typingPeer,
  loadingMessages,
}: {
  conversation: ConversationSummary;
  messages: ChatMessageDto[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  typingPeer: boolean;
  loadingMessages: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages.length, typingPeer, conversation.id]);

  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 flex-col overflow-hidden bg-white lg:min-h-[896px]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#e5e5e2] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <ProfileAvatar
            src={conversation.peer?.avatarUrl}
            alt=""
            size="sm"
            className="rounded-full"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-inter text-[15px] font-bold text-brand-dark">
                {conversation.peer?.name || "User"}
              </h2>
              <span className="rounded bg-[#f5f5f3] px-1.5 py-0.5 font-inter text-[10px] font-semibold text-[#6b7280]">
                {conversation.peer?.roleLabel || "User"}
              </span>
            </div>
            {typingPeer ? (
              <p className="font-inter text-[11px] text-brand-dark/60">
                Typing…
              </p>
            ) : conversation.peer?.online ? (
              <p className="font-inter text-[11px] text-[#16a34a]">● Online</p>
            ) : (
              <p className="font-inter text-[11px] text-[#6b7280]">Offline</p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Conversation options"
          className="inline-flex size-9 items-center justify-center rounded-lg text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <MoreVerticalIcon />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex flex-1 flex-col gap-6 overflow-y-auto bg-[#fafaf9] p-4 sm:p-6"
      >
        {loadingMessages && messages.length === 0 ? (
          <p className="text-center font-inter text-sm text-[#6b7280]">
            Loading messages…
          </p>
        ) : null}
        {!loadingMessages && messages.length === 0 ? (
          <p className="text-center font-inter text-sm text-[#6b7280]">
            Say hello to start the conversation.
          </p>
        ) : null}

        {messages.map((message) => {
          const isMine = message.mine;
          const time = new Date(message.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
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
                {time}
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
        <label className="sr-only" htmlFor="shared-message-draft">
          Write a message
        </label>
        <input
          id="shared-message-draft"
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Type a message..."
          className="min-w-0 flex-1 rounded-full bg-[#f5f5f3] px-4 py-2.5 font-inter text-sm text-brand-dark outline-none placeholder:text-[#6b7280] focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          aria-label="Send message"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
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

function MessagesInboxInner({ searchId }: { searchId: string }) {
  const {
    conversations,
    selectedConversation,
    messages,
    query,
    setQuery,
    draft,
    onDraftChange,
    handleSend,
    selectConversation,
    loadingList,
    loadingMessages,
    sending,
    error,
    connected,
    typingPeer,
    mobileShowChat,
    setMobileShowChat,
  } = useMessaging();

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">
            Messages
          </h1>
          <p className="font-inter text-xs text-[#6b7280]">
            {connected ? "Live" : "Connecting…"}
          </p>
        </header>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-inter text-sm text-red-700">
            {error}
          </p>
        ) : null}

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
                <label className="sr-only" htmlFor={searchId}>
                  Search conversations
                </label>
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search conversations..."
                  className="min-w-0 flex-1 bg-transparent font-inter text-xs text-brand-dark outline-none placeholder:text-[#6b7280]"
                />
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto lg:max-h-none lg:flex-1">
              {loadingList ? (
                <p className="px-4 py-8 text-center font-inter text-sm text-[#6b7280]">
                  Loading conversations…
                </p>
              ) : null}
              {!loadingList && conversations.length === 0 ? (
                <p className="px-4 py-8 text-center font-inter text-sm text-[#6b7280]">
                  No conversations yet. Open a chat from a booking or service
                  request, or use a message link with a peer id.
                </p>
              ) : null}
              {conversations.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  selected={conversation.id === selectedConversation?.id}
                  onSelect={() => selectConversation(conversation.id)}
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
                  messages={messages}
                  draft={draft}
                  onDraftChange={onDraftChange}
                  onSend={() => void handleSend()}
                  sending={sending}
                  typingPeer={typingPeer}
                  loadingMessages={loadingMessages}
                />
              </>
            ) : (
              <div className="flex min-h-[320px] flex-1 items-center justify-center p-8">
                <p className="font-inter text-sm text-[#6b7280]">
                  Select a conversation to start messaging.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessagesInbox({ searchId }: { searchId: string }) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
          <p className="font-inter text-sm text-[#6b7280]">Loading messages…</p>
        </div>
      }
    >
      <MessagesInboxInner searchId={searchId} />
    </Suspense>
  );
}
