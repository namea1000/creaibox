"use client";

import React from "react";
import {
  Plus,
  Search,
  FolderOpen,
  Pin,
  Archive,
  MessageSquare,
  Bot,
} from "lucide-react";

import type {
  AiAssistantConversation,
  AiAssistantFolder,
} from "./AiAssistantPanel";

type Props = {
  folders: AiAssistantFolder[];
  conversations: AiAssistantConversation[];

  activeFolderId: string;
  activeConversationId: string;

  searchQuery: string;

  onSearchQueryChange: (value: string) => void;
  onSelectFolder: (folderId: string) => void;
  onSelectConversation: (conversationId: string) => void;

  onCreateFolder: () => void;
  onCreateConversation: () => void;
};

function formatChars(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

const studioLabels: Record<string, string> = {
  general: "General",
  writing: "Writing",
  seo: "SEO",
  music: "Music",
  research: "Research",
  thumbnail: "Thumbnail",
};

export default function AiAssistantSidebar({
  folders,
  conversations,

  activeFolderId,
  activeConversationId,

  searchQuery,

  onSearchQueryChange,
  onSelectFolder,
  onSelectConversation,

  onCreateFolder,
  onCreateConversation,
}: Props) {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-white/10 bg-[#071018]">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateConversation}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3 py-2.5 text-sm font-black text-white transition hover:bg-cyan-500"
          >
            <Plus size={16} />
            새 채팅
          </button>

          <button
            onClick={onCreateFolder}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            title="새 폴더"
          >
            <FolderOpen size={18} />
          </button>
        </div>

        <div className="relative mt-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="채팅 검색..."
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-500/40"
          />
        </div>
      </div>

      {/* Special Sections */}
      <div className="border-b border-white/10 px-3 py-3">
        <button
          onClick={() => onSelectFolder("all")}
          className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${activeFolderId === "all"
              ? "bg-cyan-500/15 text-cyan-300"
              : "text-zinc-300 hover:bg-white/5"
            }`}
        >
          <Bot size={16} />
          전체 채팅
        </button>

        <button
          onClick={() => onSelectFolder("pinned")}
          className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${activeFolderId === "pinned"
              ? "bg-cyan-500/15 text-cyan-300"
              : "text-zinc-300 hover:bg-white/5"
            }`}
        >
          <Pin size={15} />
          고정됨
        </button>

        <button
          onClick={() => onSelectFolder("archived")}
          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${activeFolderId === "archived"
              ? "bg-cyan-500/15 text-cyan-300"
              : "text-zinc-300 hover:bg-white/5"
            }`}
        >
          <Archive size={15} />
          보관함
        </button>
      </div>

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pt-3">
          <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
            Folders
          </p>

          <div className="space-y-1">
            {folders.map((folder) => {
              const count = conversations.filter(
                (item) => item.folder_id === folder.id
              ).length;

              const active = activeFolderId === folder.id;

              return (
                <button
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${active
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "hover:bg-white/5"
                    }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: folder.color,
                      }}
                    />

                    <span className="truncate text-sm font-bold">
                      {folder.name}
                    </span>
                  </div>

                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-bold text-zinc-500">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversations */}
        <div className="mt-5 px-3 pb-4">
          <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
            Conversations
          </p>

          <div className="space-y-2">
            {conversations.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-zinc-500">
                채팅이 없습니다.
              </div>
            )}

            {conversations.map((conversation) => {
              const active =
                activeConversationId === conversation.id;

              const usagePercent =
                conversation.max_chars_limit > 0
                  ? Math.round(
                    (conversation.total_chars /
                      conversation.max_chars_limit) *
                    100
                  )
                  : 0;

              return (
                <button
                  key={conversation.id}
                  onClick={() =>
                    onSelectConversation(conversation.id)
                  }
                  className={`w-full rounded-2xl border p-3 text-left transition ${active
                      ? "border-cyan-500/30 bg-cyan-500/10"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare
                      size={16}
                      className="mt-0.5 shrink-0 text-cyan-300"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {conversation.title}
                      </p>

                      {conversation.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                          {conversation.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                      <span>
                        {formatChars(conversation.total_chars)}자
                      </span>

                      <span>
                        {usagePercent}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${usagePercent >= 90
                            ? "bg-red-500"
                            : usagePercent >= 70
                              ? "bg-amber-500"
                              : "bg-cyan-500"
                          }`}
                        style={{
                          width: `${Math.min(
                            usagePercent,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-zinc-500">
                    <span>
                      {studioLabels[conversation.studio_type] || conversation.studio_type}
                    </span>

                    <span>
                      {conversation.message_count} msg
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}