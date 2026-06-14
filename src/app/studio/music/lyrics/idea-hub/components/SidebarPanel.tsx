"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Flame, Compass, Star, Sparkles } from "lucide-react";
import type { LyricsHubTemplate } from "@/lib/music-lyrics-planner/types";
import { buildPlanningHref } from "@/lib/music-lyrics-planner/utils";

interface SidebarPanelProps {
  templates: LyricsHubTemplate[];
}

export default function SidebarPanel({ templates }: SidebarPanelProps) {
  // Memoize recommended and popular templates
  const recommended = useMemo(() => {
    // Return 3 featured templates, or first 3
    const featured = templates.filter((t) => t.featured);
    return featured.length > 0 ? featured.slice(0, 3) : templates.slice(0, 3);
  }, [templates]);

  const popular = useMemo(() => {
    // Return a sliced set of templates representing popular themes
    return templates.slice(5, 9);
  }, [templates]);

  return (
    <aside className="space-y-6">
      {/* Recommended Section */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/10 p-6 backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-sm font-black text-white mb-4">
          <Compass size={16} className="text-rose-400" />
          오늘의 추천 테마
        </h3>
        
        <div className="space-y-4">
          {recommended.map((item) => {
            const href = buildPlanningHref(item);
            return (
              <Link
                key={item.id}
                href={href}
                className="block p-3.5 rounded-2xl border border-zinc-800/40 bg-zinc-950/20 hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all duration-150 group"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-black text-rose-300 group-hover:text-rose-400 transition-colors">
                    {item.mood}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold">{item.tempo}</span>
                </div>
                <h4 className="text-xs font-black text-zinc-200 mt-1 truncate group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="mt-1 text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular Themes Section */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/10 p-6 backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-sm font-black text-white mb-4">
          <Flame size={16} className="text-rose-400 animate-pulse" />
          인기 급상승 소재
        </h3>
        
        <div className="space-y-3">
          {popular.map((item, index) => {
            const href = buildPlanningHref(item);
            return (
              <Link
                key={item.id}
                href={href}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/40 transition duration-150 group"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-500/10 text-[10px] font-black text-rose-300">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-zinc-300 truncate group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 truncate">{item.placeSetting}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats / Quick Info Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-rose-900/10 to-transparent p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <h3 className="flex items-center gap-2 text-xs font-black text-rose-300 uppercase tracking-widest mb-2">
          <Star size={12} />
          크리에이터 가이드
        </h3>
        <p className="text-[11px] font-bold text-zinc-400 leading- relaxed">
          가사 소재 아이디어는 Suno AI 작곡 시 음악 스타일 프롬프트 및 가사 생성 옵션에 맞추어 제작되었습니다. 원하는 템플릿의 <span className="text-rose-300">‘가사 바로 생성’</span>을 누르면 1곡 분량의 가사와 보컬 가이드가 즉시 연계 생산됩니다.
        </p>
      </div>
    </aside>
  );
}
