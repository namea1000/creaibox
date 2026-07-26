"use client";

import { useState } from "react";
import { Layers, ShoppingBag, Search, Sparkles, RefreshCw, Award, TrendingUp } from "lucide-react";

export default function ShoppingSourcingPage() {
  const [searchVal, setSearchVal] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-teal-950/40 border border-emerald-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase">
            CreAibox Sourcing Intelligence
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="text-emerald-400" size={32} />
            쇼핑 랭킹 추적 &amp; 소싱 HUB
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl font-medium">
            이커머스 브랜드 및 스마트스토어 상품 랭킹 순위 변동을 실시간으로 추적하고 블루오션 소싱 키워드를 발굴합니다.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="max-w-xl flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="소싱 상품명 또는 스토어명을 입력하세요..."
              className="w-full bg-black/80 border border-zinc-700/80 focus:border-emerald-500 text-white font-bold text-sm px-5 py-3.5 rounded-2xl outline-none transition-all pr-24"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Search size={14} />
              소싱 분석
            </button>
          </div>
        </form>
      </div>

      {/* Sourcing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-3">
          <TrendingUp className="text-emerald-400" size={24} />
          <h3 className="text-base font-bold text-white">블루오션 카테고리 발굴</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            상품 수 대비 검색량이 적어 경쟁 강도가 높지 않은 대유망 이커머스 카테고리 분석 리포트입니다.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-3">
          <Award className="text-amber-400" size={24} />
          <h3 className="text-base font-bold text-white">상품 랭킹 자동 추적</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            네이버 쇼핑 상위 노출 랭킹 변동 추이를 일간/주간 단위로 자동 추적하고 알림을 제공합니다.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-3">
          <Sparkles className="text-purple-400" size={24} />
          <h3 className="text-base font-bold text-white">AI 상품명 최적화</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            네이버 쇼핑 SEO 알고리즘 기준 클릭률을 최대화하는 AI 상품명 조합 및 키워드 태그 추천을 받습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
