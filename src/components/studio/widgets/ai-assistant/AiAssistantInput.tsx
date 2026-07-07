"use client";

import React, { useState } from "react";
import {
  ArrowUp,
  Bot,
  FileText,
  Image as ImageIcon,
  Loader2,
  Mic,
  Paperclip,
  Sparkles,
} from "lucide-react";

type Props = {
  disabled?: boolean;
  placeholder?: string;
  onSubmit: (message: string) => void;
};

const quickPrompts = [
  "이 글 SEO 점검해줘",
  "제목을 더 클릭률 높게 바꿔줘",
  "본문 구조를 개선해줘",
  "썸네일 문구 추천해줘",
];

export default function AiAssistantInput({
  disabled = false,
  placeholder = "AI Assistant에게 요청하기...",
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSubmit = value.trim().length > 0 && !disabled && !isSending;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const message = value.trim();

    setIsSending(true);
    setValue("");

    try {
      onSubmit(message);
    } finally {
      window.setTimeout(() => {
        setIsSending(false);
      }, 350);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (disabled) return;
    setValue(prompt);
  };

  return (
    <div className="shrink-0 border-t border-white/10 bg-[#071018]/95 px-5 py-4">
      {!disabled && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-100"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-[#05080c] p-3 shadow-2xl shadow-black/30 focus-within:border-cyan-500/40">
        <textarea
          value={value}
          disabled={disabled || isSending}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.nativeEvent.isComposing) return;
              e.preventDefault();
              void handleSubmit();
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="max-h-40 min-h-[36px] w-full resize-none bg-transparent px-2 py-1 text-sm font-medium leading-6 text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-600"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="파일 첨부"
            >
              <Paperclip size={17} />
            </button>

            <button
              type="button"
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="문서 컨텍스트"
            >
              <FileText size={17} />
            </button>

            <button
              type="button"
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="이미지 컨텍스트"
            >
              <ImageIcon size={17} />
            </button>

            <button
              type="button"
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              title="음성 입력"
            >
              <Mic size={17} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-black text-cyan-200 md:flex">
              <Bot size={13} />
              Multi Agent
            </div>

            <div className="hidden items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-500/10 px-3 py-1.5 text-[11px] font-black text-violet-200 md:flex">
              <Sparkles size={13} />
              Context Aware
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => void handleSubmit()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
              title="전송"
            >
              {isSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] font-semibold text-zinc-600">
        Enter 전송 · Shift + Enter 줄바꿈 · AI 응답은 적용 전 반드시 확인하세요.
      </p>
    </div>
  );
}