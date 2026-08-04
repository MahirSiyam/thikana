"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage as sendMessageApi,
  startConversation,
  type ChatMessageDto,
  type ConversationSummary,
} from "@/lib/api/messages";
import { getMessagesSocket } from "@/lib/socket/messages-socket";
import { useAuth } from "@/lib/auth/AuthProvider";

export function useMessaging() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const peerParam = searchParams.get("peer");

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messagesById, setMessagesById] = useState<
    Record<string, ChatMessageDto[]>
  >({});
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [typingPeer, setTypingPeer] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [connected, setConnected] = useState(false);

  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshConversations = useCallback(async () => {
    const items = await listConversations();
    setConversations(items);
    return items;
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const result = await listMessages(conversationId, { limit: 80 });
      setMessagesById((current) => ({
        ...current,
        [conversationId]: result.items,
      }));
      await markConversationRead(conversationId);
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId
            ? { ...item, unread: false, unreadCount: 0 }
            : item
        )
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      setError(null);
      try {
        let items = await refreshConversations();
        if (peerParam) {
          const existing = items.find((item) => item.peer?.id === peerParam);
          if (existing) {
            if (!cancelled) setSelectedId(existing.id);
          } else {
            const created = await startConversation(peerParam);
            items = await refreshConversations();
            if (!cancelled) setSelectedId(created.id);
          }
        } else if (items[0] && !cancelled) {
          setSelectedId((current) => current || items[0].id);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not load conversations"
          );
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [peerParam, refreshConversations]);

  useEffect(() => {
    if (!selectedId) return;
    void loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (!profile?.id) return;
    let active = true;
    let socketCleanup: (() => void) | undefined;

    (async () => {
      try {
        const socket = await getMessagesSocket();
        if (!active) return;

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);
        const onMessage = (message: ChatMessageDto) => {
          setMessagesById((current) => {
            const existing = current[message.conversationId] || [];
            if (existing.some((item) => item.id === message.id)) return current;
            return {
              ...current,
              [message.conversationId]: [...existing, message],
            };
          });

          setConversations((current) => {
            const next = current.map((item) => {
              if (item.id !== message.conversationId) return item;
              const isSelected = selectedIdRef.current === item.id;
              return {
                ...item,
                preview: message.body,
                timeLabel: "Just now",
                lastMessageAt: message.createdAt,
                unread: isSelected ? false : !message.mine,
                unreadCount: isSelected
                  ? 0
                  : message.mine
                    ? item.unreadCount
                    : item.unreadCount + 1,
              };
            });
            return [...next].sort((a, b) => {
              const aTime = a.lastMessageAt || "";
              const bTime = b.lastMessageAt || "";
              return bTime.localeCompare(aTime);
            });
          });

          if (
            selectedIdRef.current === message.conversationId &&
            !message.mine
          ) {
            void markConversationRead(message.conversationId);
          }
        };

        const onConversationUpdated = () => {
          void refreshConversations();
        };

        const onTyping = (payload: {
          conversationId: string;
          typing: boolean;
        }) => {
          if (payload.conversationId === selectedIdRef.current) {
            setTypingPeer(Boolean(payload.typing));
          }
        };

        const onPresence = (payload: { userId: string; online: boolean }) => {
          setConversations((current) =>
            current.map((item) =>
              item.peer?.id === payload.userId
                ? {
                    ...item,
                    peer: item.peer
                      ? { ...item.peer, online: payload.online }
                      : item.peer,
                  }
                : item
            )
          );
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("message:new", onMessage);
        socket.on("conversation:updated", onConversationUpdated);
        socket.on("typing:update", onTyping);
        socket.on("presence:update", onPresence);
        setConnected(socket.connected);

        socketCleanup = () => {
          socket.off("connect", onConnect);
          socket.off("disconnect", onDisconnect);
          socket.off("message:new", onMessage);
          socket.off("conversation:updated", onConversationUpdated);
          socket.off("typing:update", onTyping);
          socket.off("presence:update", onPresence);
        };
      } catch {
        if (active) setConnected(false);
      }
    })();

    return () => {
      active = false;
      socketCleanup?.();
    };
  }, [profile?.id, refreshConversations]);

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (item) =>
        item.peer?.name.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const selectedConversation =
    filteredConversations.find((item) => item.id === selectedId) ||
    conversations.find((item) => item.id === selectedId) ||
    filteredConversations[0] ||
    null;

  const messages = selectedConversation
    ? messagesById[selectedConversation.id] || []
    : [];

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setMobileShowChat(true);
    setTypingPeer(false);
  };

  const emitTyping = useCallback(async (typing: boolean) => {
    if (!selectedIdRef.current) return;
    try {
      const socket = await getMessagesSocket();
      socket.emit("typing:update", {
        conversationId: selectedIdRef.current,
        typing,
      });
    } catch {
      // ignore
    }
  }, []);

  const onDraftChange = (value: string) => {
    setDraft(value);
    void emitTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      void emitTyping(false);
    }, 1200);
  };

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || !selectedConversation || sending) return;
    setSending(true);
    setDraft("");
    void emitTyping(false);
      try {
        const socket = await getMessagesSocket();
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error("Send timed out"));
          }, 8000);
          socket.emit(
            "message:send",
            { conversationId: selectedConversation.id, body },
            (response: {
              ok?: boolean;
              message?: string;
              data?: ChatMessageDto;
            }) => {
              clearTimeout(timer);
              if (response?.ok) resolve();
              else reject(new Error(response?.message || "Send failed"));
            }
          );
        });
      } catch {
      try {
        await sendMessageApi(selectedConversation.id, body);
      } catch (caught) {
        setDraft(body);
        setError(
          caught instanceof Error ? caught.message : "Could not send message"
        );
      }
    } finally {
      setSending(false);
    }
  };

  return {
    conversations: filteredConversations,
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
  };
}
