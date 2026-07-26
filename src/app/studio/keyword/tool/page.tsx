"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  BarChart3,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle2,
  Newspaper,
  ExternalLink,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { KeywordToolResult } from "@/lib/server/keyword-tool-engine";

export default function LowordKeywordToolPage() {
  const [provider, setProvider] = useState<"naver" | "google">("naver");
  const [inputKw, setInputKw] = useState("나이키");
  const [searchKw, setSearchKw] = useState("나이키");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<KeywordToolResult | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchKeywordAnalysis = async (kw: string, prov: "naver" | "google") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/keyword/tool?keyword=${encodeURIComponent(kw)}&provider=${prov}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Keyword tool fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywordAnalysis(searchKw, provider);
  }, [searchKw, provider]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKw.trim()) {
      setSearchKw(inputKw.trim());
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 검색 조율 상단 바 */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-purple-950/40 border border-cyan-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase">
              Loword Keyword Intelligence
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Search className="text-cyan-400" size={32} />
              키워드 정밀 도구 (검색량 & SERP 배치)
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              포털별 검색량 추이, 상위 노출 블로그 지수, 연관 키워드, CPC 및 종합 경쟁 등급을 한눈에 분석합니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => setProvider("naver")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                provider === "naver" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-400 hover:text-white"
              }`}
            >
              🟢 네이버
            </button>
            <button
              type="button"
              onClick={() => setProvider("google")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                provider === "google" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-zinc-400 hover:text-white"
              }`}
            >
              🔵 구글
            </button>
          </div>

          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={inputKw}
              onChange={(e) => setInputKw(e.target.value)}
              placeholder="분석할 메인 키워드를 입력하세요... (예: 나이키, 아이폰16)"
              className="w-full bg-black/80 border border-zinc-700/80 focus:border-cyan-500 text-white font-bold text-sm px-5 py-3.5 rounded-2xl outline-none transition-all pr-24"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
              분석하기
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-bold">추천 빠른 키워드:</span>
          {["나이키", "에어컨", "제습기", "전기자전거", "주식전망"].map((k) => (
            <button
              key={k}
              onClick={() => {
                setInputKw(k);
                setSearchKw(k);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              #{k}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <>
          {/* 📊 4대 상단 메트릭스 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs text-zinc-400 font-bold">일간 검색량</span>
              <p className="text-2xl font-black text-cyan-400 font-mono">{data.dailySearchVolume.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400 font-bold">▲ 12.4% 전주 대비</span>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs text-zinc-400 font-bold">월간 PC 검색량</span>
              <p className="text-2xl font-black text-white font-mono">{data.monthlyPcVolume.toLocaleString()}</p>
              <span className="text-[10px] text-zinc-500 font-mono">전체 검색의 22%</span>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs text-zinc-400 font-bold">월간 모바일 검색량</span>
              <p className="text-2xl font-black text-blue-400 font-mono">{data.monthlyMobileVolume.toLocaleString()}</p>
              <span className="text-[10px] text-blue-400 font-bold">모바일 압도적 78%</span>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <span className="text-xs text-zinc-400 font-bold">CreAibox 평가 등급</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-orange-400 font-mono">{data.ratingGrade}</span>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {data.ratingStatus}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 line-clamp-1">블로그 상위 노출 난이도 보통</span>
            </div>
          </div>

          {/* 📈 차트 & 실시간 이슈 뉴스 2열 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-cyan-400" />
                    검색량 추이 차트 ({data.keyword})
                  </h3>
                  <p className="text-xs text-zinc-400">최근 일주일 및 월별 통합 검색 반응 추이 그래프</p>
                </div>
                <div className="flex gap-1 text-xs">
                  {["1개월", "3개월", "6개월", "1년"].map((period) => (
                    <button key={period} className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold">
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* 간단 바 차트 시각화 */}
              <div className="h-48 flex items-end gap-3 pt-6 px-2 border-b border-zinc-800">
                {data.trendPoints.map((pt, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: `${Math.min(100, Math.max(20, pt.volume / 350))}px` }}
                      className="w-full bg-cyan-600/60 group-hover:bg-cyan-400 rounded-t-lg transition-all"
                    />
                    <span className="text-[10px] text-zinc-500 font-mono">{pt.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 이 검색어는 왜? (관련 뉴스) */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Newspaper size={20} className="text-blue-400" />
                이 검색어는 왜? (관련 뉴스)
              </h3>

              <div className="space-y-3">
                {data.newsList.map((n, idx) => (
                  <a
                    key={idx}
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/50 border border-zinc-800 hover:border-cyan-500/40 p-3 rounded-2xl space-y-1.5 transition-all group"
                  >
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-cyan-400 line-clamp-2">{n.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{n.source}</span>
                      <span>{n.pubDate}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* 🔍 연관 키워드 & CPC 분석 테이블 */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers size={20} className="text-emerald-400" />
                연관 키워드 및 CPC / 광고 경쟁도 분석
              </h3>

              <Link
                href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(data.keyword)}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Sparkles size={14} /> AI 원고 생성
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-bold">
                    <th className="py-3 px-4">키워드</th>
                    <th className="py-3 px-4">월간 검색량</th>
                    <th className="py-3 px-4">CPC (PC)</th>
                    <th className="py-3 px-4">CPC (MO)</th>
                    <th className="py-3 px-4">광고 경쟁도</th>
                    <th className="py-3 px-4">작성 Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {data.relatedKeywords.map((rk, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                        {rk.keyword}
                        <button onClick={() => handleCopy(rk.keyword)} className="text-zinc-500 hover:text-white">
                          <Copy size={12} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-mono font-bold">{rk.searchVolume.toLocaleString()}</td>
                      <td className="py-3 px-4 text-zinc-300 font-mono">{rk.cpcPc}</td>
                      <td className="py-3 px-4 text-zinc-300 font-mono">{rk.cpcMobile}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-amber-500/20 font-bold">
                          {rk.competition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(rk.keyword)}`}
                          className="text-cyan-400 hover:underline font-bold"
                        >
                          원고 작성 →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
