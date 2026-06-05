"use client";

import Link from "next/link";
import {
  FileText,
  PenSquare,
  Trash2,
  Calendar,
  Search,
  TrendingUp,
  Users,
  ImageIcon,
  BarChart3,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Eye,
  CheckCircle2,
} from "lucide-react";

const contentStats = [
  {
    label: "Published",
    value: "-",
    icon: FileText,
    color: "text-emerald-400",
  },
  {
    label: "Draft",
    value: "-",
    icon: PenSquare,
    color: "text-yellow-400",
  },
  {
    label: "Trash",
    value: "-",
    icon: Trash2,
    color: "text-red-400",
  },
  {
    label: "SEO Ready",
    value: "-",
    icon: Search,
    color: "text-blue-400",
  },
];

const modules = [
  {
    title: "블로그 발행 관리",
    icon: FileText,
  },
  {
    title: "SEO 품질 점검",
    icon: Search,
  },
  {
    title: "썸네일 상태 점검",
    icon: ImageIcon,
  },
  {
    title: "조회수 상위 글",
    icon: TrendingUp,
  },
  {
    title: "수정 필요 글",
    icon: AlertTriangle,
  },
  {
    title: "휴지통 관리",
    icon: Trash2,
  },
  {
    title: "AI 생성 통계",
    icon: Sparkles,
  },
  {
    title: "발행 캘린더",
    icon: Calendar,
  },
  {
    title: "작성자 통계",
    icon: Users,
  },
];

export default function AdminContentPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <FileText className="h-10 w-10 text-emerald-400" />
            Content <span className="text-emerald-400">Center</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            콘텐츠 생산 · 발행 · SEO · 썸네일 · 성과 분석 통합 관리
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Blog
            <ExternalLink size={14} />
          </Link>

          <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white">
            <RefreshCw size={14} />
            새로고침
          </button>
        </div>
      </header>

      {/* KPI */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {contentStats.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800/80 ${card.color}`}
              >
                <Icon size={20} />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {card.label}
              </p>

              <p className={`mt-2 text-3xl font-black italic ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Content Status */}
      <section className="mb-10 grid gap-6 xl:grid-cols-2">
        {/* Production */}
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            콘텐츠 생산 현황
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "오늘 생성 원고",
              "이번주 생성 원고",
              "이번달 생성 원고",
              "발행된 글",
              "임시저장 글",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <span className="text-sm font-bold text-zinc-400">
                  {item}
                </span>

                <span className="text-lg font-black italic text-white">
                  -
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            SEO 상태
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "SEO 완료",
              "메타 설명 누락",
              "Slug 누락",
              "Canonical 누락",
              "수정 필요 글",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
              >
                <span className="text-sm font-bold text-zinc-400">
                  {item}
                </span>

                <span className="text-lg font-black italic text-white">
                  -
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
        <h2 className="text-xl font-black italic text-white">
          콘텐츠 운영 모듈
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.title}
                className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-emerald-400">
                  <Icon size={18} />
                </div>

                <h3 className="text-sm font-black text-white">
                  {module.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-600">
                  추후 실데이터 및 관리 기능 연결 예정
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Performance */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "Top Posts",
            icon: TrendingUp,
          },
          {
            title: "Most Viewed",
            icon: Eye,
          },
          {
            title: "Fastest Growing",
            icon: BarChart3,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-emerald-400">
                <Icon size={18} />
              </div>

              <h3 className="text-lg font-black italic text-white">
                {item.title}
              </h3>

              <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
                데이터 연결 예정
              </div>
            </div>
          );
        })}
      </section>

      {/* AI Insight */}
      <section className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />

          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              AI 콘텐츠 인사이트
            </h2>

            <div className="mt-4 space-y-3">
              {[
                "조회수 상위 콘텐츠 유형 분석",
                "SEO 성과 우수 키워드 분석",
                "발행 빈도 추천",
                "콘텐츠 공백 키워드 추천",
                "AI 기반 주제 추천",
                "GPT 기반 콘텐츠 개선 제안",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-yellow-100/70"
                >
                  <CheckCircle2
                    size={16}
                    className="text-yellow-400"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}