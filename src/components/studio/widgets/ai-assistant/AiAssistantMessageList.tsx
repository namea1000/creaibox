"use client";

import React, { useEffect, useRef } from "react";
import { Bot } from "lucide-react";

import type { AiAssistantMessage } from "./AiAssistantPanel";
import AiAssistantMessageBubble from "./AiAssistantMessageBubble";

type Props = {
  messages: AiAssistantMessage[];
};

export default function AiAssistantMessageList({
  messages,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
            <Bot size={28} />
          </div>

          <h3 className="mt-5 text-lg font-black text-white">
            AI Assistant 시작하기
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            글쓰기, SEO, 음악, 리서치, 썸네일 작업을 요청할 수 있습니다.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Example Prompts
            </p>

            <div className="space-y-2 text-sm text-zinc-300">
              <p>• 이 글 SEO 점검해줘</p>
              <p>• 블로그 제목 20개 추천해줘</p>
              <p>• Suno 프롬프트 개선해줘</p>
              <p>• 자료 요약해서 글 초안 만들어줘</p>
              <p>• 썸네일 문구 추천해줘</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-5 py-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <AiAssistantMessageBubble
              key={message.id}
              message={message}
            />
          ))}
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}