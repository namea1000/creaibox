"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Mic2, MapPin, Music, Tag } from "lucide-react";
import type { LyricsHubTemplate } from "@/lib/music-lyrics-planner/types";
import { buildPlanningHref, buildLyricsHref } from "@/lib/music-lyrics-planner/utils";

interface TemplateGridProps {
  templates: LyricsHubTemplate[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-zinc-800 bg-zinc-950/20">
        <Music size={40} className="text-zinc-600 mb-3" />
        <h3 className="font-black text-zinc-300">검색 결과가 없습니다</h3>
        <p className="text-xs text-zinc-500 mt-1">다른 검색어를 입력하거나 카테고리를 변경해보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((item) => {
        const planningHref = buildPlanningHref(item);
        const lyricsHref = buildLyricsHref(item);

        return (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all duration-200 p-6 shadow-xl backdrop-blur-sm group"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black text-rose-300 bg-rose-500/10 uppercase tracking-widest">
                    {item.mood}
                  </div>
                  <h3 className="text-base font-black text-white mt-1.5 group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-rose-400 group-hover:bg-rose-950/20 transition-all">
                  <Music size={14} />
                </div>
              </div>

              {/* Setting / Synopsis */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2.5 text-xs text-zinc-400 leading-5">
                  <span className="font-extrabold text-zinc-300 whitespace-nowrap">시놉시스:</span>
                  <p className="line-clamp-3">{item.lyricsBackground}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <MapPin size={12} className="text-rose-400/80 shrink-0" />
                  <span className="font-extrabold text-zinc-300">공간 배경:</span>
                  <span className="truncate">{item.placeSetting}</span>
                </div>
              </div>

              {/* Badges section */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <span className="rounded-lg bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 text-[10px] font-bold text-zinc-300">
                  보컬: {item.vocal}
                </span>
                <span className="rounded-lg bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 text-[10px] font-bold text-zinc-300">
                  악기: {item.instrument}
                </span>
                <span className="rounded-lg bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 text-[10px] font-bold text-zinc-300">
                  속도: {item.tempo}
                </span>
              </div>

              {/* Tags */}
              {item.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center mb-6 pt-3 border-t border-zinc-900">
                  <Tag size={10} className="text-zinc-600 shrink-0" />
                  {item.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-900/80">
              <Link
                href={planningHref}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition duration-150"
              >
                <Sparkles size={12} className="text-rose-400" />
                앨범 기획하기
              </Link>
              <Link
                href={lyricsHref}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white transition duration-150 shadow-lg shadow-rose-600/10"
              >
                <Mic2 size={12} />
                가사 바로 생성
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
