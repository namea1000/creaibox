"use client";

import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  Database,
  Send,
  FileText,
  FolderOpen,
  Sparkles,
  Search,
  BookOpen,
  Wand2,
  Plus,
} from "lucide-react";

export default function ResearchChatPage() {
  const sampleQuestions = [
    "이 자료 핵심만 요약해줘",
    "중요한 키워드 10개 뽑아줘",
    "블로그 글 목차로 정리해줘",
    "A 자료와 B 자료를 비교해줘",
    "유튜브 대본으로 바꿔줘",
    "SEO 글쓰기용으로 재구성해줘",
  ];

  const sources = [
    "분석 프로젝트를 선택하면 자료 목록이 표시됩니다.",
    "PDF, URL, YouTube, 문서 자료를 기반으로 답변합니다.",
    "답변에는 참고 자료 출처를 함께 표시할 예정입니다.",
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <MessageCircle size={15} />
                Research Chat
              </div>

              <h1 className="text-3xl font-black md:text-5xl">AI 채팅</h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                업로드한 자료를 기반으로 NotebookLM처럼 질문하고 답변을 받을 수 있는
                자료 기반 AI 대화 공간입니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              자료 추가
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <FolderOpen className="text-violet-400" size={20} />
                <h2 className="text-lg font-black">프로젝트 선택</h2>
              </div>

              <button className="mt-4 flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-violet-500/40">
                프로젝트 선택하기
                <Search size={16} className="text-zinc-500" />
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <Database className="text-blue-400" size={20} />
                <h2 className="text-lg font-black">참고 자료</h2>
              </div>

              <div className="mt-4 space-y-3">
                {sources.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-500"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
            <div className="flex min-h-[560px] flex-col">
              <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <MessageCircle size={28} />
                  </div>

                  <h2 className="text-xl font-black">자료 기반으로 질문하세요</h2>

                  <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                    프로젝트를 선택하면 업로드된 자료를 기반으로 요약, 비교,
                    블로그 변환, 대본 생성 질문을 할 수 있습니다.
                  </p>

                  <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
                    {sampleQuestions.map((item) => (
                      <button
                        key={item}
                        className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-violet-500/40 hover:text-violet-400"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="자료에 대해 질문해보세요..."
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                />

                <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-black text-white hover:bg-violet-500">
                  <Send size={17} />
                  전송
                </button>
              </div>
            </div>
          </section>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "요약 질문",
              desc: "긴 자료를 핵심 요약, 상세 요약, 목차 요약으로 정리합니다.",
              icon: Sparkles,
            },
            {
              title: "자료 검색",
              desc: "업로드한 자료 안에서 특정 문장, 키워드, 근거를 찾습니다.",
              icon: BookOpen,
            },
            {
              title: "콘텐츠 변환",
              desc: "답변 결과를 블로그, 대본, SEO 글로 바로 확장합니다.",
              icon: Wand2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-violet-400" size={20} />
                  <h2 className="text-lg font-black">{item.title}</h2>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">개발 예정</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            이후 research_chunks 테이블과 AI API를 연결하면 자료 기반 RAG 채팅,
            출처 표시, 답변 저장, 콘텐츠 생성 페이지로 보내기 기능을 붙일 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}