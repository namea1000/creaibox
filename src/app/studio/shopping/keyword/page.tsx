"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Flame,
  Award,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ItemScoutShoppingKeyword } from "@/lib/server/shopping-keyword-engine";

export default function ShoppingKeywordPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyTrends, setDailyTrends] = useState<ItemScoutShoppingKeyword[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<ItemScoutShoppingKeyword[]>([]);
  const [copiedKw, setCopiedKw] = useState<string | null>(null);

  const fetchShoppingKeywords = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shopping/keyword?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.dailyTrends) setDailyTrends(data.dailyTrends);
      if (data.weeklyTrends) setWeeklyTrends(data.weeklyTrends);
    } catch (err) {
      console.error("Shopping keyword fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingKeywords(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal.trim());
  };

  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKw(kw);
    setTimeout(() => setCopiedKw(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 & 검색바 */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-indigo-950/40 border border-blue-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-widest uppercase">
              CreaiBox E-Commerce Intelligence
            </span>
            <span className="text-xs text-zinc-400 font-mono">creaibox.com/shopping/keyword</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-blue-400" size={32} />
            쇼핑 키워드 정밀 분석
          </h1>

          <p className="text-zinc-400 text-sm max-w-2xl font-medium">
            이커머스 쇼핑 검색량, 총 등록 상품수, 그리고 경쟁강도(상품수 / 검색량)를 분석하여 노출하기 쉬운 블루오션 꿀키워드를 발굴합니다.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="max-w-xl flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="쇼핑 키워드를 입력하세요... (예: 자라, 에어컨, 닌텐도)"
              className="w-full bg-black/80 border border-zinc-700/80 focus:border-blue-500 text-white font-bold text-sm px-5 py-3.5 rounded-2xl outline-none transition-all pr-24"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
              검색하기
            </button>
          </div>
        </form>
      </div>

      {/* 📊 2열 트렌드 키워드 리스트 (일간 트렌드 vs 주간 트렌드) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일간 트렌드 키워드 */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              일간 쇼핑 트렌드 키워드
            </h3>
            <span className="text-xs text-blue-400 font-mono font-bold">실시간 수집</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-400" size={18} />
              쇼핑 키워드를 분석하는 중입니다...
            </div>
          ) : (
            <div className="space-y-2.5">
              {dailyTrends.map((item) => (
                <div
                  key={item.rank}
                  className="p-3.5 rounded-2xl bg-black/50 border border-zinc-800 hover:border-blue-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 font-black text-xs flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                          {item.keyword}
                        </span>
                        {item.isHoneyKeyword && (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            🍯 꿀키워드
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px]">검색량</span>
                      <span className="text-blue-400 font-bold">{item.searchVolume.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px]">등록 상품수</span>
                      <span className="text-zinc-300 font-bold">{item.productCount.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px]">경쟁강도</span>
                      <span className="font-bold text-amber-400">{item.competitionRatio}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(item.keyword)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all ml-1"
                      title="키워드 복사"
                    >
                      {copiedKw === item.keyword ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주간 트렌드 키워드 */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              주간 쇼핑 트렌드 키워드
            </h3>
            <span className="text-xs text-amber-400 font-mono font-bold">7일 누적</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-amber-400" size={18} />
              쇼핑 키워드를 분석하는 중입니다...
            </div>
          ) : (
            <div className="space-y-2.5">
              {weeklyTrends.map((item) => (
                <div
                  key={item.rank}
                  className="p-3.5 rounded-2xl bg-black/50 border border-zinc-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 font-black text-xs flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      {item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                          {item.keyword}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px]">주간 검색량</span>
                      <span className="text-amber-400 font-bold">{item.searchVolume.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px]">경쟁강도</span>
                      <span className="font-bold text-emerald-400">{item.competitionRatio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
