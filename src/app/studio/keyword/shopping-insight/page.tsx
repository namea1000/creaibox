"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle2,
  PieChart,
  Calendar,
  Layers,
  Search,
} from "lucide-react";

export default function NaverShoppingInsightPage() {
  const [selectedCategory, setSelectedCategory] = useState("스포츠/레저");
  const [selectedPeriod, setSelectedPeriod] = useState("1개월");
  const [loading, setLoading] = useState(true);
  const [insightData, setInsightData] = useState<any>(null);
  const [copiedKw, setCopiedKw] = useState<string | null>(null);

  const fetchShoppingInsight = async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/naver/shopping-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: category }),
      });
      const data = await res.json();
      setInsightData(data);
    } catch (err) {
      console.error("Shopping insight fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingInsight(selectedCategory);
  }, [selectedCategory]);

  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKw(kw);
    setTimeout(() => setCopiedKw(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 헤더 & 분야 선택기 */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-teal-950/40 border border-emerald-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase">
              NAVER DataLab Official Engine
            </span>
            <span className="text-xs text-zinc-400 font-mono">datalab.naver.com/shoppingInsight</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-emerald-400" size={32} />
            네이버 쇼핑 인사이트 (분야별 통계 & TOP 500 인기검색어)
          </h1>

          <p className="text-zinc-400 text-sm max-w-2xl font-medium">
            다양한 쇼핑 분야에서 클릭이 발생한 검색어의 클릭량 추이 및 인기 검색어 순위, 성별/연령별 정보를 수집 분석합니다.
          </p>
        </div>

        {/* 1차 카테고리 필터 & 기간 선택바 */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-black/60 p-4 rounded-2xl border border-zinc-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {["스포츠/레저", "디지털/가전", "패션의류", "식품"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-bold">기간 선택:</span>
            {["일간", "1개월", "3개월", "1년"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  selectedPeriod === period ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30" : "text-zinc-400"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {insightData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 📊 클릭량 추이 차트 & 비중 (좌측 2열) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-400" />
                  {selectedCategory} 클릭량 추이 ({selectedPeriod})
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">DataLab Shopping Index</span>
              </div>

              <div className="h-44 flex items-end gap-2 pt-6 border-b border-zinc-800">
                {insightData.trendData.map((td: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: `${td.ratio}%` }}
                      className="w-full bg-emerald-600/70 group-hover:bg-emerald-400 rounded-t-md transition-all"
                    />
                    <span className="text-[9px] text-zinc-500 font-mono">{td.period.replace("2026-", "")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 기기별 / 성별 / 연령별 비중 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs text-zinc-400 font-bold block">기기별 비중</span>
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-cyan-400">PC {insightData.deviceRatio.pc}%</span>
                  <span className="text-emerald-400">모바일 {insightData.deviceRatio.mobile}%</span>
                </div>
                <div className="w-full bg-black h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: `${insightData.deviceRatio.pc}%` }} className="bg-cyan-500" />
                  <div style={{ width: `${insightData.deviceRatio.mobile}%` }} className="bg-emerald-500" />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs text-zinc-400 font-bold block">성별 비중</span>
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-pink-400">여성 {insightData.genderRatio.female}%</span>
                  <span className="text-blue-400">남성 {insightData.genderRatio.male}%</span>
                </div>
                <div className="w-full bg-black h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: `${insightData.genderRatio.female}%` }} className="bg-pink-500" />
                  <div style={{ width: `${insightData.genderRatio.male}%` }} className="bg-blue-500" />
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl space-y-2">
                <span className="text-xs text-zinc-400 font-bold block">주요 구매 연령대</span>
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-purple-400">30대 (41%)</span>
                  <span className="text-zinc-400">40대 (24%)</span>
                </div>
                <div className="w-full bg-black h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: "41%" }} className="bg-purple-500" />
                  <div style={{ width: "59%" }} className="bg-zinc-700" />
                </div>
              </div>
            </div>
          </div>

          {/* 🏆 분야별 TOP 500 인기검색어 리스트 (우측 1열) */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-black text-white">{selectedCategory} 인기검색어 TOP 500</h3>
              <span className="text-xs text-zinc-400 font-mono">1개월 누적 데이터</span>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {insightData.topKeywords.map((tk: any) => (
                <div
                  key={tk.rank}
                  className="flex items-center justify-between p-3 bg-black/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-black text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {tk.rank}
                    </span>
                    <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {tk.keyword}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(tk.keyword)} className="p-1 text-zinc-500 hover:text-white">
                      {copiedKw === tk.keyword ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <Link
                      href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(tk.keyword)}`}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      작성
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
