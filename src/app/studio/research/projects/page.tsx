"use client";

import React from "react";
import Link from "next/link";
import {
  FolderOpen,
  Database,
  Plus,
  Search,
  Clock,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Wand2,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

export default function ResearchProjectsPage() {
  const projects = [
    {
      title: "삼성전자 주가 분석",
      sources: 12,
      chats: 18,
      contents: 7,
      updated: "방금 전",
    },
    {
      title: "부동산 시장 조사",
      sources: 8,
      chats: 6,
      contents: 2,
      updated: "1시간 전",
    },
    {
      title: "AI 논문 연구",
      sources: 23,
      chats: 41,
      contents: 12,
      updated: "어제",
    },
    {
      title: "유튜브 콘텐츠 리서치",
      sources: 15,
      chats: 21,
      contents: 9,
      updated: "2일 전",
    },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 헤더 */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <FolderOpen size={15} />
                Research Projects
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                프로젝트 관리
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                자료, AI 채팅, 생성 콘텐츠를 프로젝트 단위로 관리합니다.
                NotebookLM의 Notebook 개념과 동일한 구조입니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              새 프로젝트
            </Link>
          </div>
        </section>

        {/* 검색 */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="프로젝트 검색..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            />
          </div>
        </section>

        {/* 프로젝트 카드 */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">내 프로젝트</h2>

            <p className="mt-1 text-sm text-zinc-500">
              자료 분석, AI 채팅, 콘텐츠 생성 결과를 프로젝트별로 관리합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-1 hover:border-violet-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FolderOpen size={22} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                  />
                </div>

                <h3 className="mt-4 font-black">
                  {project.title}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Database size={14} />
                    자료 {project.sources}개
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} />
                    AI 채팅 {project.chats}개
                  </div>

                  <div className="flex items-center gap-2">
                    <Wand2 size={14} />
                    생성 콘텐츠 {project.contents}개
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {project.updated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 프로젝트 구성 */}
        <section className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <Database className="mb-3 text-violet-400" size={20} />
            <h3 className="font-black">자료</h3>
            <p className="mt-2 text-sm text-zinc-500">
              PDF, URL, YouTube, OCR 자료
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <MessageCircle className="mb-3 text-blue-400" size={20} />
            <h3 className="font-black">AI 채팅</h3>
            <p className="mt-2 text-sm text-zinc-500">
              프로젝트별 대화 기록
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <FileText className="mb-3 text-emerald-400" size={20} />
            <h3 className="font-black">생성 글</h3>
            <p className="mt-2 text-sm text-zinc-500">
              블로그 · SEO · 대본
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <ImageIcon className="mb-3 text-pink-400" size={20} />
            <h3 className="font-black">추출 이미지</h3>
            <p className="mt-2 text-sm text-zinc-500">
              저장된 WebP 이미지
            </p>
          </div>
        </section>

        {/* 안내 */}
        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">
              향후 확장
            </h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            프로젝트 공유, 팀 협업, 프로젝트 템플릿, 프로젝트 복제,
            AI 자동 분류 기능을 추가할 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}