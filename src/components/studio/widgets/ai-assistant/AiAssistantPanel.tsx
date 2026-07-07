"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import AiAssistantSidebar from "./AiAssistantSidebar";
import AiAssistantChatPanel from "./AiAssistantChatPanel";

export type AiAssistantFolder = {
  id: string;
  user_id?: string;
  name: string;
  description?: string | null;
  color: string;
  icon?: string;
  sort_order?: number;
  is_pinned?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AiAssistantAction = {
  id: string;
  label: string;
  actionType: string;
  payload?: Record<string, unknown>;
  status?: "pending" | "applied" | "failed" | "cancelled";
};

export type AiAssistantMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  agents?: string[];
  actions?: AiAssistantAction[];
};

export type AiAssistantConversation = {
  id: string;
  user_id?: string;
  folder_id: string | null;
  title: string;
  description?: string | null;
  studio_type: string;
  page_path?: string | null;
  plan_key: string;
  max_chars_limit: number;
  total_chars: number;
  conversation_count: number;
  message_count: number;
  messages: AiAssistantMessage[];
  agents_used?: string[];
  context_summary?: string | null;
  search_text?: string | null;
  is_closed: boolean;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

function normalizeMessages(value: unknown): AiAssistantMessage[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is AiAssistantMessage => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "role" in item &&
      "content" in item
    );
  });
}

function normalizeConversation(item: any): AiAssistantConversation {
  return {
    ...item,
    folder_id: item.folder_id ?? null,
    description: item.description ?? null,
    page_path: item.page_path ?? null,
    plan_key: item.plan_key ?? "free",
    max_chars_limit: item.max_chars_limit ?? 300000,
    total_chars: item.total_chars ?? 0,
    conversation_count: item.conversation_count ?? 0,
    message_count: item.message_count ?? 0,
    messages: normalizeMessages(item.messages),
    agents_used: Array.isArray(item.agents_used) ? item.agents_used : [],
    is_closed: Boolean(item.is_closed),
    is_pinned: Boolean(item.is_pinned),
    is_archived: Boolean(item.is_archived),
    is_deleted: Boolean(item.is_deleted),
  };
}

export default function AiAssistantPanel({
  initialPrompt,
  clearInitialPrompt,
}: {
  initialPrompt?: string | null;
  clearInitialPrompt?: () => void;
}) {
  const [folders, setFolders] = useState<AiAssistantFolder[]>([]);
  const [conversations, setConversations] = useState<AiAssistantConversation[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/ai-assistant/folders", {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error ?? "폴더를 불러오지 못했습니다.");
    }

    setFolders(json.folders ?? []);
  }, []);

  const fetchConversations = useCallback(async () => {
    const params = new URLSearchParams();

    if (activeFolderId) params.set("folder_id", activeFolderId);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());

    const res = await fetch(`/api/ai-assistant/conversations?${params.toString()}`, {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error ?? "채팅창을 불러오지 못했습니다.");
    }

    const nextConversations: AiAssistantConversation[] =
      (json.conversations ?? []).map(normalizeConversation);

    setConversations(nextConversations);

    setActiveConversationId((prev) => {
      if (prev && nextConversations.some((item) => item.id === prev)) {
        return prev;
      }

      return nextConversations[0]?.id ?? "";
    });
  }, [activeFolderId, searchQuery]);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      await fetchFolders();
      await fetchConversations();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "AI Assistant 데이터를 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchFolders, fetchConversations]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversations[0] ??
      null
    );
  }, [activeConversationId, conversations]);

  const createFolder = async () => {
    const name = window.prompt("새 폴더 이름을 입력하세요.", "새 폴더");
    if (!name?.trim()) return;

    try {
      setErrorMessage("");

      const res = await fetch("/api/ai-assistant/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          color: "#06b6d4",
          icon: "folder",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "폴더 생성에 실패했습니다.");
      }

      setFolders((prev) => [...prev, json.folder]);
      setActiveFolderId(json.folder.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "폴더 생성에 실패했습니다.");
    }
  };

  const createConversation = async (forcedTitle?: string) => {
    let title = forcedTitle;
    if (!title) {
      title = window.prompt("새 채팅창 이름을 입력하세요.", "새 AI 채팅") || undefined;
    }
    if (!title?.trim()) return null;

    const targetFolderId =
      activeFolderId === "all" || activeFolderId === "pinned" || activeFolderId === "archived"
        ? null
        : activeFolderId;

    try {
      setErrorMessage("");

      const res = await fetch("/api/ai-assistant/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          folder_id: targetFolderId,
          studio_type: "general",
          page_path: typeof window !== "undefined" ? window.location.pathname : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "채팅창 생성에 실패했습니다.");
      }

      const nextConversation = normalizeConversation(json.conversation);

      setConversations((prev) => [nextConversation, ...prev]);
      setActiveConversationId(nextConversation.id);

      if (nextConversation.folder_id) {
        setActiveFolderId(nextConversation.folder_id);
      }
      return nextConversation;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "채팅창 생성에 실패했습니다.");
      return null;
    }
  };

  useEffect(() => {
    if (!initialPrompt || isLoading) return;

    const runInitialPrompt = async () => {
      const promptText = initialPrompt;
      if (clearInitialPrompt) clearInitialPrompt();

      let targetConversationId = activeConversationId;

      if (!targetConversationId) {
        try {
          const nextConv = await createConversation("새 AI 채팅");
          if (nextConv) {
            targetConversationId = nextConv.id;
          }
        } catch (err) {
          console.error("Failed to create conversation for initial prompt:", err);
          return;
        }
      }

      if (targetConversationId) {
        appendMessages(targetConversationId, promptText);
      }
    };

    runInitialPrompt();
  }, [initialPrompt, isLoading, activeConversationId]);

  const updateConversation = async (
    conversationId: string,
    patch: Partial<AiAssistantConversation>
  ) => {
    try {
      setErrorMessage("");

      const res = await fetch(`/api/ai-assistant/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error ?? "채팅창 수정에 실패했습니다.");
      }

      const nextConversation = normalizeConversation(json.conversation);

      setConversations((prev) =>
        patch.is_deleted
          ? prev.filter((item) => item.id !== conversationId)
          : prev.map((item) => (item.id === conversationId ? nextConversation : item))
      );

      if (patch.is_deleted && activeConversationId === conversationId) {
        setActiveConversationId("");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "채팅창 수정에 실패했습니다.");
    }
  };

  const appendMessages = async (conversationId: string, userContent: string) => {
    if (isSending) return;

    const originalConversations = conversations;

    // Create optimistic user message
    const tempUserMessage: AiAssistantMessage = {
      id: `temp-${crypto.randomUUID()}`,
      role: "user",
      content: userContent,
      created_at: new Date().toISOString(),
    };

    // Optimistically update conversations list in UI
    setConversations((prev) =>
      prev.map((item) => {
        if (item.id === conversationId) {
          return {
            ...item,
            messages: [...item.messages, tempUserMessage],
            total_chars: item.total_chars + userContent.length,
            message_count: item.message_count + 1,
          };
        }
        return item;
      })
    );

    try {
      setIsSending(true);
      setErrorMessage("");

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: userContent,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json?.conversation) {
          const closedConversation = normalizeConversation(json.conversation);
          setConversations((prev) =>
            prev.map((item) => (item.id === conversationId ? closedConversation : item))
          );
        } else {
          // Revert optimistic update on error
          setConversations(originalConversations);
        }

        throw new Error(json?.error ?? "AI 응답 생성에 실패했습니다.");
      }

      const nextConversation = normalizeConversation(json.conversation);

      setConversations((prev) =>
        prev.map((item) => (item.id === conversationId ? nextConversation : item))
      );

      setActiveConversationId(nextConversation.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "AI 응답 생성에 실패했습니다.");
      // Revert if error occurred and state wasn't updated by a closed conversation
      setConversations((prev) => {
        const hasResponse = prev.some(
          (c) => c.id === conversationId && c.messages.some((m) => m.role === "assistant")
        );
        return hasResponse ? prev : originalConversations;
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#05080c] text-sm font-bold text-zinc-500">
        AI Assistant 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 bg-[#05080c]">
      <AiAssistantSidebar
        folders={folders}
        conversations={conversations}
        activeFolderId={activeFolderId}
        activeConversationId={activeConversationId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectFolder={setActiveFolderId}
        onSelectConversation={setActiveConversationId}
        onCreateFolder={createFolder}
        onCreateConversation={createConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {errorMessage && (
          <div className="border-b border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-200">
            {errorMessage}
          </div>
        )}

        <AiAssistantChatPanel
          conversation={activeConversation}
          folders={folders}
          isSending={isSending}
          onUpdateConversation={updateConversation}
          onAppendMessages={appendMessages}
        />
      </div>
    </div>
  );
}