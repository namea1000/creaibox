"use client";

import React, { useMemo, useState } from "react";
import AiAssistantSidebar from "./AiAssistantSidebar";
import AiAssistantChatPanel from "./AiAssistantChatPanel";

export type AiAssistantFolder = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  is_pinned?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AiAssistantMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  agents?: string[];
  actions?: AiAssistantAction[];
};

export type AiAssistantAction = {
  id: string;
  label: string;
  actionType: string;
  payload?: Record<string, unknown>;
  status?: "pending" | "applied" | "failed" | "cancelled";
};

export type AiAssistantConversation = {
  id: string;
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
  is_closed: boolean;
  closed_reason?: string | null;
  closed_at?: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

const nowIso = () => new Date().toISOString();

const mockFolders: AiAssistantFolder[] = [
  {
    id: "folder-general",
    name: "기본",
    color: "#06b6d4",
    icon: "bot",
    is_pinned: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "folder-writing",
    name: "글쓰기",
    color: "#3b82f6",
    icon: "writing",
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "folder-seo",
    name: "SEO / 발행",
    color: "#22c55e",
    icon: "seo",
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "folder-music",
    name: "음악 / Suno",
    color: "#ec4899",
    icon: "music",
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: "folder-research",
    name: "리서치",
    color: "#a855f7",
    icon: "research",
    created_at: nowIso(),
    updated_at: nowIso(),
  },
];

const mockConversations: AiAssistantConversation[] = [
  {
    id: "conv-welcome",
    folder_id: "folder-general",
    title: "AI Assistant 시작하기",
    description: "CreAIbox 멀티 에이전트 허브 기본 채팅",
    studio_type: "general",
    page_path: "/studio",
    plan_key: "free",
    max_chars_limit: 300000,
    total_chars: 1340,
    conversation_count: 2,
    message_count: 4,
    agents_used: ["router", "writing", "seo"],
    context_summary: "사용자가 CreAIbox AI Assistant 초기 설계를 진행 중입니다.",
    is_closed: false,
    is_pinned: true,
    is_archived: false,
    is_deleted: false,
    created_at: nowIso(),
    updated_at: nowIso(),
    messages: [
      {
        id: "msg-1",
        role: "system",
        content:
          "AI Assistant는 CreAIbox 전체 스튜디오에서 사용하는 멀티 에이전트 작업 허브입니다.",
        created_at: nowIso(),
      },
      {
        id: "msg-2",
        role: "user",
        content: "글쓰기 채팅을 만들고 SEO까지 같이 점검하고 싶어.",
        created_at: nowIso(),
      },
      {
        id: "msg-3",
        role: "assistant",
        content:
          "좋습니다. 이 채팅창에서는 Writing Agent와 SEO Agent를 함께 사용해 글 구조, 제목, 메타설명, 키워드, FAQ, 발행 전 점검까지 도와줄 수 있습니다.",
        created_at: nowIso(),
        agents: ["writing", "seo"],
        actions: [
          {
            id: "action-1",
            label: "SEO 점검 시작",
            actionType: "run_seo_audit",
            status: "pending",
          },
          {
            id: "action-2",
            label: "제목 개선",
            actionType: "improve_title",
            status: "pending",
          },
        ],
      },
    ],
  },
  {
    id: "conv-writing",
    folder_id: "folder-writing",
    title: "글쓰기 채팅",
    description: "블로그 원고 구조와 문장 개선",
    studio_type: "writing",
    page_path: "/studio/writing/creaibox/create",
    plan_key: "free",
    max_chars_limit: 300000,
    total_chars: 108420,
    conversation_count: 36,
    message_count: 72,
    agents_used: ["writing", "seo", "thumbnail"],
    context_summary: "블로그 글쓰기와 SEO 발행 준비 중심의 대화입니다.",
    is_closed: false,
    is_pinned: true,
    is_archived: false,
    is_deleted: false,
    created_at: nowIso(),
    updated_at: nowIso(),
    messages: [
      {
        id: "msg-w-1",
        role: "assistant",
        content:
          "글쓰기 채팅입니다. 현재 채팅창은 30만자 한도 중 약 10.8만자를 사용했습니다.",
        created_at: nowIso(),
        agents: ["writing"],
      },
    ],
  },
  {
    id: "conv-suno",
    folder_id: "folder-music",
    title: "Suno 가사 채팅",
    description: "Suno 프롬프트와 유튜브 제목 생성",
    studio_type: "music",
    page_path: "/studio/music/lyrics",
    plan_key: "free",
    max_chars_limit: 300000,
    total_chars: 48200,
    conversation_count: 18,
    message_count: 36,
    agents_used: ["music"],
    is_closed: false,
    is_pinned: false,
    is_archived: false,
    is_deleted: false,
    created_at: nowIso(),
    updated_at: nowIso(),
    messages: [
      {
        id: "msg-m-1",
        role: "assistant",
        content:
          "Suno 가사 채팅입니다. 장르, 분위기, 보컬 스타일을 기반으로 가사와 프롬프트를 개선할 수 있습니다.",
        created_at: nowIso(),
        agents: ["music"],
      },
    ],
  },
];

export default function AiAssistantPanel() {
  const [folders, setFolders] = useState<AiAssistantFolder[]>(mockFolders);
  const [conversations, setConversations] =
    useState<AiAssistantConversation[]>(mockConversations);
  const [activeFolderId, setActiveFolderId] = useState<string>("folder-general");
  const [activeConversationId, setActiveConversationId] =
    useState<string>("conv-welcome");
  const [searchQuery, setSearchQuery] = useState("");

  const activeConversation = useMemo(() => {
    return (
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversations[0] ??
      null
    );
  }, [activeConversationId, conversations]);

  const filteredConversations = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return conversations
      .filter((conversation) => !conversation.is_deleted)
      .filter((conversation) => {
        if (activeFolderId === "all") return true;
        if (activeFolderId === "pinned") return conversation.is_pinned;
        if (activeFolderId === "archived") return conversation.is_archived;
        return conversation.folder_id === activeFolderId;
      })
      .filter((conversation) => {
        if (!keyword) return true;

        const messageText = conversation.messages
          .map((message) => message.content)
          .join(" ")
          .toLowerCase();

        return (
          conversation.title.toLowerCase().includes(keyword) ||
          (conversation.description ?? "").toLowerCase().includes(keyword) ||
          messageText.includes(keyword)
        );
      })
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [activeFolderId, conversations, searchQuery]);

  const createFolder = () => {
    const folderName = `새 폴더 ${folders.length + 1}`;

    const nextFolder: AiAssistantFolder = {
      id: `folder-${crypto.randomUUID()}`,
      name: folderName,
      color: "#06b6d4",
      icon: "folder",
      is_pinned: false,
      is_deleted: false,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    setFolders((prev) => [...prev, nextFolder]);
    setActiveFolderId(nextFolder.id);
  };

  const createConversation = () => {
    const targetFolderId =
      activeFolderId === "all" || activeFolderId === "pinned" || activeFolderId === "archived"
        ? "folder-general"
        : activeFolderId;

    const nextConversation: AiAssistantConversation = {
      id: `conv-${crypto.randomUUID()}`,
      folder_id: targetFolderId,
      title: "새 AI 채팅",
      description: "새로 생성한 AI Assistant 채팅창",
      studio_type: "general",
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      plan_key: "free",
      max_chars_limit: 300000,
      total_chars: 0,
      conversation_count: 0,
      message_count: 0,
      messages: [
        {
          id: `msg-${crypto.randomUUID()}`,
          role: "assistant",
          content:
            "새 채팅창입니다. 글쓰기, SEO, 음악, 리서치, 썸네일 작업을 요청할 수 있습니다.",
          created_at: nowIso(),
          agents: ["router"],
        },
      ],
      agents_used: ["router"],
      context_summary: null,
      is_closed: false,
      is_pinned: false,
      is_archived: false,
      is_deleted: false,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    setConversations((prev) => [nextConversation, ...prev]);
    setActiveConversationId(nextConversation.id);
    setActiveFolderId(targetFolderId);
  };

  const updateConversation = (
    conversationId: string,
    patch: Partial<AiAssistantConversation>
  ) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
            ...conversation,
            ...patch,
            updated_at: nowIso(),
          }
          : conversation
      )
    );
  };

  const appendMessages = (
    conversationId: string,
    userContent: string,
    assistantContent: string
  ) => {
    const userMessage: AiAssistantMessage = {
      id: `msg-${crypto.randomUUID()}`,
      role: "user",
      content: userContent,
      created_at: nowIso(),
    };

    const assistantMessage: AiAssistantMessage = {
      id: `msg-${crypto.randomUUID()}`,
      role: "assistant",
      content: assistantContent,
      created_at: nowIso(),
      agents: ["router", "writing", "seo"],
      actions: [
        {
          id: `action-${crypto.randomUUID()}`,
          label: "결과 복사",
          actionType: "copy_result",
          status: "pending",
        },
      ],
    };

    const addedChars = userContent.length + assistantContent.length;

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        const nextTotalChars = conversation.total_chars + addedChars;
        const isLimitReached = nextTotalChars >= conversation.max_chars_limit;

        return {
          ...conversation,
          total_chars: nextTotalChars,
          conversation_count: conversation.conversation_count + 1,
          message_count: conversation.message_count + 2,
          messages: [...conversation.messages, userMessage, assistantMessage],
          agents_used: Array.from(
            new Set([...(conversation.agents_used ?? []), "router", "writing", "seo"])
          ),
          is_closed: isLimitReached,
          closed_reason: isLimitReached ? "max_chars_limit_reached" : conversation.closed_reason,
          closed_at: isLimitReached ? nowIso() : conversation.closed_at,
          updated_at: nowIso(),
        };
      })
    );
  };

  return (
    <div className="flex min-h-0 flex-1 bg-[#05080c]">
      <AiAssistantSidebar
        folders={folders}
        conversations={filteredConversations}
        activeFolderId={activeFolderId}
        activeConversationId={activeConversationId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectFolder={setActiveFolderId}
        onSelectConversation={setActiveConversationId}
        onCreateFolder={createFolder}
        onCreateConversation={createConversation}
      />

      <AiAssistantChatPanel
        conversation={activeConversation}
        folders={folders}
        onUpdateConversation={updateConversation}
        onAppendMessages={appendMessages}
      />
    </div>
  );
}