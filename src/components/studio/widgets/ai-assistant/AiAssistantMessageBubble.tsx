"use client";

import React, { useState } from "react";
import {
  Bot,
  Check,
  Clipboard,
  Copy,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

import type { AiAssistantMessage } from "./AiAssistantPanel";

type Props = {
  message: AiAssistantMessage;
};

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getAgentLabel(agent: string) {
  const map: Record<string, string> = {
    router: "Router",
    writing: "Writing",
    seo: "SEO",
    music: "Music",
    research: "Research",
    thumbnail: "Thumbnail",
  };

  return map[agent] ?? agent;
}

export default function AiAssistantMessageBubble({ message }: Props) {
  const [copied, setCopied] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, string>>({});

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      setCopied(false);
    }
  };

  if (isSystem) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-3 text-center text-xs font-semibold leading-5 text-cyan-100/80">
        {message.content}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`min-w-0 max-w-[82%] rounded-3xl border px-4 py-3 shadow-lg ${isUser
            ? "border-blue-400/20 bg-blue-600/20 text-blue-50"
            : "border-white/10 bg-white/[0.04] text-zinc-100"
          }`}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {isUser ? (
              <User size={14} className="text-blue-200" />
            ) : (
              <Sparkles size={14} className="text-cyan-300" />
            )}

            <span className="text-xs font-black text-zinc-300">
              {isUser ? "You" : "AI Assistant"}
            </span>

            <span className="text-[11px] font-semibold text-zinc-500">
              {formatTime(message.created_at)}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
            title="복사"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {message.agents && message.agents.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {message.agents.map((agent) => (
              <span
                key={agent}
                className="rounded-full border border-cyan-400/15 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black text-cyan-200"
              >
                {getAgentLabel(agent)}
              </span>
            ))}
          </div>
        )}

        <div className="whitespace-pre-wrap break-words text-sm font-medium leading-7">
          {message.content}
        </div>

        {isAssistant && message.actions && message.actions.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2 text-xs font-black text-zinc-400">
              <Wrench size={14} />
              추천 액션
            </div>

            <div className="grid gap-2">
              {message.actions.map((action) => {
                const status = completedActions[action.id] || action.status || "pending";
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (action.actionType === "copy_result") {
                        void handleCopy();
                        setCompletedActions((prev) => ({
                          ...prev,
                          [action.id]: "copied",
                        }));
                      }
                    }}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-bold text-zinc-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-100"
                  >
                    <span className="flex items-center gap-2">
                      <Clipboard size={14} />
                      {action.label}
                    </span>

                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      status === "copied" || status === "applied"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/5 text-zinc-500"
                    }`}>
                      {status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <User size={17} />
        </div>
      )}
    </div>
  );
}