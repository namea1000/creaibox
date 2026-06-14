"use client";

import React, { useState } from "react";
import { TrendingUp, Search, Loader2, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

interface TrendItem {
  rank: number;
  keyword: string;
  growth: number;
  volume: number;
  category: string;
  sparkline: number[];
}

export default function RisingTrends() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendItem[]>([
    { rank: 1, keyword: "Suno AI v4 업데이트", growth: 1250, volume: 45000, category: "tech", sparkline: [10, 20, 15, 30, 45, 60, 90] },
    { rank: 2, keyword: "유튜브 알고리즘 쇼츠 노출", growth: 840, volume: 32000, category: "tech", sparkline: [5, 12, 18, 15, 25, 48, 80] },
    { rank: 3, keyword: "생성형 AI 음악 저작권", growth: 560, volume: 18000, category: "biz", sparkline: [8, 15, 12, 22, 35, 42, 65] },
    { rank: 4, keyword: "부동산 소액 투자 2026", growth: 420, volume: 24000, category: "biz", sparkline: [20, 22, 25, 30, 38, 40, 50] },
    { rank: 5, keyword: "홈오피스 데스크테리어 꿀템", growth: 380, volume: 15000, category: "life", sparkline: [12, 10, 18, 22, 28, 30, 40] },
    { rank: 6, keyword: "ChatGPT 비디오 생성 활용법", growth: 350, volume: 12500, category: "tech", sparkline: [15, 20, 22, 25, 28, 32, 38] },
    { rank: 7, keyword: "1인 지식창업 AI 툴", growth: 310, volume: 9800, category: "biz", sparkline: [5, 10, 12, 18, 22, 28, 35] },
    { rank: 8, keyword: "도파민 디톡스 챌린지", growth: 290, volume: 14000, category: "life", sparkline: [20, 18, 15, 22, 25, 28, 30] },
  ]);

  const categories = [
    { id: "all", label: "전체 트렌드" },
    { id: "tech", label: "IT / 테크" },
    { id: "biz", label: "비즈니스 / 창업" },
    { id: "life", label: "라이프스타일" },
  ];

  const handleRefresh = (cat: string) => {
    setActiveCategory(cat);
    setLoading(true);
    setTimeout(() => {
      // Shuffled and slightly mutated data
      const shuffled = [...trends].map(item => {
        const delta = Math.floor(Math.random() * 40) - 20; // mutate growth slightly
        const newGrowth = Math.max(100, item.growth + delta * 5);
        // randomize sparkline values
        const randomSpark = Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 10).sort((a, b) => a - b);
        return {
          ...item,
          growth: newGrowth,
          sparkline: randomSpark,
        };
      }).sort((a, b) => b.growth - a.growth)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));

      setTrends(shuffled);
      setLoading(false);
    }, 700);
  };

  const filteredTrends = activeCategory === "all"
    ? trends
    : trends.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="flex items-center gap-2 text-lg font-black text-white">
            <TrendingUp className="text-emerald-400" size={20} />
            트렌드 급상승 분석
          </h2>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleRefresh(cat.id)}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold transition ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          지난 24시간 동안 실시간 검색량 및 소셜 언급 횟수가 빠르게 누적되고 있는 관심 상승 키워드 목록입니다. 신속하게 콘텐츠 기획에 접목할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend List Table */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-emerald-400" size={30} />
              <p className="text-xs font-bold text-zinc-500">실시간 트렌드 피드 수집 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-bold">
                    <th className="py-3 px-4 w-12 text-center">순위</th>
                    <th className="py-3 px-4">급상승 키워드</th>
                    <th className="py-3 px-4 text-center">상승 속도</th>
                    <th className="py-3 px-4">주간 누적 검색</th>
                    <th className="py-3 px-4 text-center">트렌드 추이</th>
                    <th className="py-3 px-4 text-right">전략</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {filteredTrends.map((item) => (
                    <tr key={item.keyword} className="hover:bg-zinc-900/30 transition text-zinc-300 font-semibold">
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black ${
                          item.rank === 1
                            ? "bg-emerald-500 text-black"
                            : item.rank === 2
                            ? "bg-emerald-600/50 text-white"
                            : item.rank === 3
                            ? "bg-emerald-800/30 text-white"
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {item.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-extrabold">{item.keyword}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-1 text-[10px] font-black">
                          +{item.growth}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">{(item.volume).toLocaleString()}회</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center h-6">
                          <svg className="w-16 h-5 text-emerald-500" viewBox="0 0 100 30">
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={`M 0,${30 - (item.sparkline[0] / 100) * 25} 
                                 L 16,${30 - (item.sparkline[1] / 100) * 25} 
                                 L 32,${30 - (item.sparkline[2] / 100) * 25} 
                                 L 48,${30 - (item.sparkline[3] / 100) * 25} 
                                 L 64,${30 - (item.sparkline[4] / 100) * 25} 
                                 L 80,${30 - (item.sparkline[5] / 100) * 25} 
                                 L 100,${30 - (item.sparkline[6] / 100) * 25}`}
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={`/studio/keyword/strategy?keyword=${encodeURIComponent(item.keyword)}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                          title="AI 콘텐츠 전략 생성"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel: Analysis Report */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <Sparkles size={16} className="text-emerald-400" />
              트렌드 인사이트 브리핑
            </h3>
            <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">
              오늘 테크 카테고리에서는 <span className="text-emerald-400 font-bold">생성형 음악 및 비디오 AI의 활용 노하우</span>에 대한 검색 유입량이 폭발적으로 늘고 있습니다. 관련 노하우, 프롬프트 가이드를 주제로 글을 작성하면 단기간 대량 유입을 기대해볼 만합니다.
            </p>
            <div className="rounded-xl bg-zinc-950/60 p-3.5 border border-zinc-850 flex items-start gap-2">
              <AlertCircle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-normal">
                급상승 키워드로 글을 발행할 때는 경쟁도가 빠르게 올라갈 수 있으므로 타겟 롱테일 키워드 2-3개를 제목에 섞어 발행하는 것을 권장합니다.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md">
            <h3 className="text-sm font-black text-white mb-3">연계 스튜디오 바로가기</h3>
            <div className="space-y-2">
              <a
                href="/studio/content-planner/idea-hub"
                className="flex justify-between items-center rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5 text-xs font-bold text-zinc-300 hover:border-emerald-500/30 hover:bg-zinc-900 transition"
              >
                <span>콘텐츠 아이디어 허브</span>
                <span className="text-[10px] text-emerald-400 font-extrabold">이동 →</span>
              </a>
              <a
                href="/studio/music/planning"
                className="flex justify-between items-center rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5 text-xs font-bold text-zinc-300 hover:border-emerald-500/30 hover:bg-zinc-900 transition"
              >
                <span>AI 앨범 기획 (뮤직스튜디오)</span>
                <span className="text-[10px] text-emerald-400 font-extrabold">이동 →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
