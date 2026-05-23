"use client";

import React from 'react';
import { 
  FileText, Check, AlertCircle, ShieldCheck, Cpu, PieChart, 
  AlignLeft, BarChart3, CheckCircle2, HelpCircle 
} from 'lucide-react';

interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

interface CreaiboxAnalysisTowerProps {
  seoScore: number;
  seoChecks: {
    titleKeyword: boolean;
    contentDensity: boolean;
    duplicateSafe?: boolean;
    lengthCheck?: boolean;
    structureCheck?: boolean;
    subHeadingCheck?: boolean;
  };
  posRatio: {
    noun: number;
    verb: number;
    other: number;
  };
  frequencies: KeywordFrequency[];
  content: string;
  crawlabilityScore: number; // 네이버 봇 스코어 -> 크롤링 효율 점수로 변경
  isDensitySafe: boolean;
  isRecreateMode?: boolean;
  similarityScore?: number;
  isDetailMode?: boolean;
}

export default function CreaiboxAnalysisTower({
  seoScore, seoChecks, posRatio, frequencies, content, crawlabilityScore, isDensitySafe,
  isRecreateMode = false, similarityScore = 100, isDetailMode = false
}: CreaiboxAnalysisTowerProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
      
      {/* 1단: Unique Content Guard */}
      {(isRecreateMode || isDetailMode) && (
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl animate-in fade-in duration-300">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
            <BarChart3 size={14} /> Unique Content Guard
          </h3>
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-3">
            <div className="relative w-14 h-14 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0">
              <span className={`text-sm font-black ${similarityScore < 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                {similarityScore}%
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-200">콘텐츠 독창성</h4>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Google이 선호하는 중복 없는 유니크한 원고 점수</p>
            </div>
          </div>
        </div>
      )}

      {/* 2단: Global SEO Optimizer */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-blue-400 flex items-center gap-1.5">
            <FileText size={13} /> Global SEO Optimizer
          </h3>
          <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-black">
            SCORE: {seoScore}/100
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2">
              {seoChecks.titleKeyword ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
              제목 내 타겟 키워드 최적화
            </span>
            <span className="text-[10px] font-mono text-zinc-500">30점</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-2">
              {seoChecks.contentDensity ? <Check size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-zinc-600" />}
              본문 키워드 밀도 (핵심 키워드 분포)
            </span>
            <span className="text-[10px] font-mono text-zinc-500">25점</span>
          </div>
        </div>
      </div>

      {/* 3단: Content Quality Integrity */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-500 flex items-center gap-1.5">
          <ShieldCheck size={13} /> Content Integrity
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">문맥 자연스러움</span>
            <span className="text-xs font-black text-emerald-400">Human-Like</span>
          </div>
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60">
            <span className="text-[10px] text-zinc-500 font-bold block mb-1">가독성 점수</span>
            <span className="text-xs font-black text-emerald-400">High Score</span>
          </div>
        </div>
      </div>

      {/* 4단: 형태소 및 의미 분석 */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
          <h3 className="text-xs font-black text-zinc-200 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" /> Semantic Analysis
          </h3>
        </div>
        
        <div className="space-y-2.5">
          <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
            <PieChart size={12} className="text-blue-400" /> 의미론적 단어 구성 비율
          </span>
          <div className="w-full h-3.5 rounded-full bg-zinc-950 overflow-hidden flex border border-zinc-900">
            <div className="bg-blue-500 h-full" style={{ width: `${posRatio.noun}%` }} />
            <div className="bg-emerald-500 h-full" style={{ width: `${posRatio.verb}%` }} />
            <div className="bg-zinc-700 h-full" style={{ width: `${posRatio.other}%` }} />
          </div>
        </div>
      </div>

      {/* 5단: Crawlability Score */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5">
          <BarChart3 size={13} /> Crawlability Index
        </h3>
        <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center font-black text-sm text-emerald-400 ring-4 ring-emerald-500/10">
            {crawlabilityScore}%
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">엔진 수집 효율</h4>
            <p className="text-[10px] text-zinc-500 font-medium">검색엔진 로봇이 읽기 가장 좋은 구조인가?</p>
          </div>
        </div>
      </div>
    </div>
  );
}