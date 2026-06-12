"use client";

import React, { useMemo } from "react";
import {
  Archive,
  Bot,
  Edit3,
  Lock,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";

import type {
  AiAssistantConversation,
  AiAssistantFolder,
} from "./AiAssistantPanel";
import AiAssistantMessageList from "./AiAssistantMessageList";
import AiAssistantInput from "./AiAssistantInput";
import AiAssistantUsageMeter from "./AiAssistantUsageMeter";

type Props = {
  conversation: AiAssistantConversation | null;
  folders: AiAssistantFolder[];

  onUpdateConversation: (
    conversationId: string,
    patch: Partial<AiAssistantConversation>
  ) => void;

  isSending?: boolean;

  onAppendMessages: (
    conversationId: string,
    userContent: string
  ) => void;
};

function getStudioLabel(studioType: string) {
  const map: Record<string, string> = {
    general: "General",
    writing: "Writing Agent",
    seo: "SEO Agent",
    music: "Music Agent",
    research: "Research Agent",
    thumbnail: "Thumbnail Agent",
  };

  return map[studioType] ?? studioType;
}

function buildDemoAssistantResponse(message: string, studioType: string) {
  const base = message.trim();

  if (studioType === "music" || /가사|suno|노래|음악/i.test(base)) {
    return [
      "Music Agent가 요청을 확인했습니다.",
      "",
      "현재 요청 기준으로 가사 구조, Suno 프롬프트, 유튜브 제목까지 함께 개선할 수 있습니다.",
      "",
      "추천 작업:",
      "1. 후렴구 반복성과 중독성 강화",
      "2. Verse / Pre-Chorus / Chorus 길이 균형 조정",
      "3. Suno 프롬프트에 장르, 보컬, 무드, 믹싱 질감 추가",
      "4. 유튜브 제목과 설명문 생성",
    ].join("\n");
  }

  if (studioType === "research" || /자료|리서치|요약|pdf|분석/i.test(base)) {
    return [
      "Research Agent가 요청을 확인했습니다.",
      "",
      "업로드 자료나 입력된 텍스트를 기준으로 핵심 주장, 근거, 요약, 블로그 초안까지 연결할 수 있습니다.",
      "",
      "추천 작업:",
      "1. 핵심 내용 요약",
      "2. 중요한 문장 추출",
      "3. 블로그 글 구조 생성",
      "4. SEO 키워드와 제목 제안",
    ].join("\n");
  }

  if (/썸네일|이미지|프롬프트|thumbnail/i.test(base)) {
    return [
      "Thumbnail Agent가 요청을 확인했습니다.",
      "",
      "현재 콘텐츠 주제에 맞춰 썸네일 문구, 이미지 콘셉트, 생성 프롬프트를 만들 수 있습니다.",
      "",
      "추천 작업:",
      "1. 클릭률 높은 썸네일 문구 생성",
      "2. 3:2 비율 이미지 프롬프트 작성",
      "3. 배경/인물/오브젝트 구성 제안",
      "4. 네이버 블로그용 텍스트 여백 고려",
    ].join("\n");
  }

  if (studioType === "writing" || /글|블로그|원고|문장|제목/i.test(base)) {
    return [
      "Writing Agent와 SEO Agent가 요청을 확인했습니다.",
      "",
      "현재 채팅에서는 글 구조, 제목, 메타설명, 키워드, FAQ, 발행 전 점검까지 함께 도와줄 수 있습니다.",
      "",
      "추천 작업:",
      "1. 제목 클릭률 개선",
      "2. 본문 구조 점검",
      "3. SEO 메타설명 생성",
      "4. FAQ 섹션 추가",
      "5. 썸네일 문구 생성",
    ].join("\n");
  }

  return [
    "Router Agent가 요청을 확인했습니다.",
    "",
    "요청 내용에 따라 Writing, SEO, Music, Research, Thumbnail Agent 중 적절한 에이전트를 선택해 작업할 수 있습니다.",
    "",
    `입력한 요청: ${base}`,
  ].join("\n");
}

export default function AiAssistantChatPanel({
  conversation,
  folders,
  isSending = false,
  onUpdateConversation,
  onAppendMessages,
}: Props) {
  const folderName = useMemo(() => {
    if (!conversation?.folder_id) return "폴더 없음";
    return folders.find((folder) => folder.id === conversation.folder_id)?.name ?? "폴더 없음";
  }, [conversation?.folder_id, folders]);

  if (!conversation) {
    return (
      <section className="flex min-w-0 flex-1 flex-col items-center justify-center bg-[#05080c] p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <Bot size={30} />
        </div>

        <h3 className="mt-5 text-lg font-black text-white">
          채팅창을 선택해 주세요
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          왼쪽에서 기존 채팅창을 선택하거나 새 채팅을 만들어 AI Assistant를 시작할 수 있습니다.
        </p>
      </section>
    );
  }

  const usagePercent =
    conversation.max_chars_limit > 0
      ? Math.round((conversation.total_chars / conversation.max_chars_limit) * 100)
      : 0;

  const isLimitReached =
    conversation.is_closed || conversation.total_chars >= conversation.max_chars_limit;

  const handleSubmit = (message: string) => {
    if (isLimitReached) return;

    onAppendMessages(conversation.id, message);
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-[#05080c]">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 bg-[#071018]/90 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-black text-cyan-300">
                {getStudioLabel(conversation.studio_type)}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-zinc-400">
                {folderName}
              </span>

              {conversation.is_pinned && (
                <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                  고정됨
                </span>
              )}

              {conversation.is_closed && (
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-300">
                  종료됨
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-black text-white">
                {conversation.title}
              </h2>

              <button
                onClick={() => {
                  const nextTitle = window.prompt(
                    "채팅창 이름을 입력하세요.",
                    conversation.title
                  );

                  if (!nextTitle?.trim()) return;

                  onUpdateConversation(conversation.id, {
                    title: nextTitle.trim(),
                  });
                }}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                title="이름 변경"
              >
                <Edit3 size={15} />
              </button>
            </div>

            {conversation.description && (
              <p className="mt-1 truncate text-xs text-zinc-500">
                {conversation.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() =>
                onUpdateConversation(conversation.id, {
                  is_pinned: !conversation.is_pinned,
                })
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              title={conversation.is_pinned ? "고정 해제" : "고정"}
            >
              {conversation.is_pinned ? <PinOff size={16} /> : <Pin size={16} />}
            </button>

            <button
              onClick={() =>
                onUpdateConversation(conversation.id, {
                  is_archived: !conversation.is_archived,
                })
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              title="보관"
            >
              <Archive size={16} />
            </button>

            <button
              onClick={() => {
                const ok = window.confirm("이 채팅창을 삭제할까요?");
                if (!ok) return;

                onUpdateConversation(conversation.id, {
                  is_deleted: true,
                });
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300"
              title="삭제"
            >
              <Trash2 size={16} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <AiAssistantUsageMeter
            totalChars={conversation.total_chars}
            maxCharsLimit={conversation.max_chars_limit}
          />
        </div>
      </div>

      {/* Messages */}
      <AiAssistantMessageList
        messages={conversation.messages}
        isSending={isSending}
      />

      {/* Limit Notice */}
      {usagePercent >= 80 && !isLimitReached && (
        <div className="mx-5 mb-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-xs leading-5 text-amber-100">
          이 채팅창의 사용량이 {usagePercent}%에 도달했습니다. 중요한 주제라면 새 채팅창을 만들어 이어가는 것을 권장합니다.
        </div>
      )}

      {isLimitReached && (
        <div className="mx-5 mb-3 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-100">
          <Lock size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-black">이 채팅창은 최대 저장 글자수에 도달했습니다.</p>
            <p className="mt-1 text-red-100/75">
              기존 대화는 계속 열람할 수 있지만 새 메시지는 입력할 수 없습니다. 새 채팅창을 생성해 계속 작업하세요.
            </p>
          </div>
        </div>
      )}

      {/* Input */}
      <AiAssistantInput
        disabled={isLimitReached || isSending}
        onSubmit={handleSubmit}
        placeholder={
          isSending
            ? "AI Assistant가 응답을 생성하는 중입니다..."
            : isLimitReached
              ? "한도에 도달한 채팅창입니다."
              : "AI Assistant에게 요청하기..."
        }
      />
    </section>
  );
}