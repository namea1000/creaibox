"use client";

import Link from "next/link";
import {
  Brain,
  CalendarDays,
  Compass,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";

type ContentPlannerHeroProps = {
  selectedGoalCount: number;
  selectedPlatformCount: number;
  itemCount: number;
};

export default function ContentPlannerHero({
  selectedGoalCount,
  selectedPlatformCount,
  itemCount,
}: ContentPlannerHeroProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#071126] to-black p-7 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-400">
            <Brain size={15} />
            AI Content Planner
          </div>

          <h1 className="text-3xl font-black md:text-5xl leading-tight">
            모든 콘텐츠 제작의 출발점,{" "}
            <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent lg:inline">
              AI 콘텐츠 플래너
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
            트렌드, 검색 데이터, 키워드 분석을 기반으로 블로그, 쇼츠, 롱폼, SNS 콘텐츠를 한 번에 기획합니다.
            기획은 하나로 만들고 제작은 플랫폼별로 확장합니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end shrink-0">
          {/* Stats Row */}
          <div className="flex gap-2">
            <HeroStat
              icon={Target}
              label="선택 목표"
              value={`${selectedGoalCount}개`}
            />
            <HeroStat
              icon={Compass}
              label="선택 플랫폼"
              value={`${selectedPlatformCount}개`}
            />
            <HeroStat
              icon={FileText}
              label="기획 콘텐츠"
              value={`${itemCount}개`}
            />
          </div>

          {/* Buttons Row */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-black text-slate-950 hover:bg-cyan-300 transition-colors">
              <Sparkles size={17} />
              AI 콘텐츠 기획
            </button>

            <Link
              href="/studio/content-planner/library"
              className="flex-1 sm:flex-initial inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-200 hover:border-cyan-300/50 transition-colors"
            >
              <CalendarDays size={17} />
              기획 라이브러리
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroStatProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function HeroStat({
  icon: Icon,
  label,
  value,
}: HeroStatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
      <Icon className="text-cyan-300 shrink-0" size={16} />
      <div className="text-left">
        <div className="text-[10px] font-bold text-slate-500 leading-none">{label}</div>
        <div className="mt-1 text-sm font-black text-white leading-none">{value}</div>
      </div>
    </div>
  );
}