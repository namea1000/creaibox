"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";
import type { LyricsHubCategory } from "@/lib/music-lyrics-planner/types";

interface IdeaHubHeroProps {
  keyword: string;
  setKeyword: (val: string) => void;
  categories: LyricsHubCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string, group: "장르별 대분류" | "테마별 대분류") => void;
  totalTemplates: number;
}

export default function IdeaHubHero({
  keyword,
  setKeyword,
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalTemplates,
}: IdeaHubHeroProps) {
  const featuredCats = categories.filter((c) => c.featured);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-[#0f0b19] via-[#111827] to-[#0c050f] p-6 shadow-2xl md:p-10">
      {/* Floating neon glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative mx-auto max-w-4xl text-center z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1.5 text-xs font-black text-rose-200">
          <Sparkles size={14} />
          영감을 가사로, 기획을 음악으로
        </div>

        <h1 className="text-3xl font-black tracking-tight md:text-5xl text-white">
          뮤직 가사 소재 <span className="text-rose-400">아이디어 허브</span>
        </h1>

        <p className="mt-3.5 text-xs sm:text-sm font-bold text-zinc-400">
          8개 장르 · 6개 테마 · {totalTemplates}개+ 정교한 가사 템플릿 프리셋 · 마음에 드는 스토리라인을 찾고 앨범을 기획해보세요.
        </p>

        <div className="mx-auto mt-6 flex max-w-2xl gap-2">
          <div className="relative flex-1">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="관심있는 장르, 감성, 장소, 키워드를 검색하세요..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/70 pl-4 pr-10 text-xs font-bold text-white outline-none placeholder:text-zinc-600 focus:border-rose-400 focus:bg-zinc-950 transition duration-150"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>
          <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-rose-600 px-6 text-xs font-black text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/15">
            <Search size={15} />
            검색
          </button>
        </div>

        {/* Quick Categories Navigation */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {featuredCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id, cat.group)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition duration-200 border ${
                selectedCategoryId === cat.id
                  ? "border-rose-400 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
