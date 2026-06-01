"use client";

import React from "react";
import Link from "next/link";
import {
  Wand2,
  Database,
  FileText,
  Newspaper,
  PlayCircle,
  Mail,
  Music,
  Sparkles,
  Search,
  PenLine,
  FolderOpen,
  Plus,
  ArrowRight,
} from "lucide-react";

export default function ResearchContentPage() {
  const contentTypes = [
    {
      title: "블로그 글 생성",
      desc: "분석 자료를 바탕으로 블로그 초안을 생성합니다.",
      icon: PenLine,
      color: "from-violet-600 to-blue-600",
    },
    {
      title: "SEO 글 생성",
      desc: "키워드, 제목, 메타 설명까지 포함한 SEO 글을 만듭니다.",
      icon: Search,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "뉴스 정리",
      desc: "뉴스 자료를 핵심 이슈, 요약, 관점별로 정리합니다.",
      icon: Newspaper,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "유튜브 대본",
      desc: "자료를 기반으로 영상 대본과 설명문을 생성합니다.",
      icon: PlayCircle,
      color: "from-red-600 to-rose-600",
    },
    {
      title: "쇼츠 대본",
      desc: "짧은 영상용 후킹 문장과 대본을 생성합니다.",
      icon: Sparkles,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "뉴스레터",
      desc: "자료를 이메일 뉴스레터 형식으로 재구성합니다.",
      icon: Mail,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "가사 / 음원 아이디어",
      desc: "자료 내용을 음악 콘셉트, 가사, Suno 프롬프트로 변환합니다.",
      icon: Music,
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "프롬프트 생성",
      desc: "자료 기반 이미지, 영상, 글쓰기 프롬프트를 생성합니다.",
      icon: Wand2,
      color: "from-cyan-600 to-blue-600",
    },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <Wand2 size={15} />
                Content Generator
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                콘텐츠 생성
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                업로드한 자료와 추출 텍스트를 기반으로 블로그 글, SEO 글,
                뉴스 정리, 유튜브 대본, 쇼츠 대본, 프롬프트를 생성합니다.
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
                생성할 자료 선택
                <ArrowRight size={16} className="text-zinc-500" />
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center gap-3">
                <Database className="text-blue-400" size={20} />
                <h2 className="text-lg font-black">자료 상태</h2>
              </div>

              <div className="mt-4 space-y-3 text-xs text-zinc-500">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  프로젝트를 선택하면 추출 텍스트와 이미지 상태가 표시됩니다.
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  생성 결과는 research_generated_contents 테이블에 저장 예정입니다.
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-black">생성 유형 선택</h2>
              <p className="mt-1 text-sm text-zinc-500">
                자료 분석 결과를 원하는 콘텐츠 형식으로 변환합니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {contentTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-left transition hover:-translate-y-1 hover:border-violet-500/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                        >
                          <Icon size={22} />
                        </div>

                        <div>
                          <h3 className="font-black">{item.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex items-center gap-3">
            <FileText className="text-violet-400" size={20} />
            <h2 className="text-lg font-black">생성 결과 미리보기</h2>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm text-zinc-500">
              프로젝트와 생성 유형을 선택하면 AI가 생성한 콘텐츠 결과가 여기에 표시됩니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">개발 예정</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            이후 AI 채팅 답변 결과를 이 페이지로 보내서 블로그 글, SEO 글,
            유튜브 대본, 쇼츠 대본으로 바로 변환하는 흐름을 연결하면 됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}