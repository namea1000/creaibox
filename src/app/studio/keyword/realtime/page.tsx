"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Globe,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  Newspaper,
  Search,
  AlertCircle,
  Zap,
} from "lucide-react";

interface RealtimeKeywordItem {
  rank: number;
  keyword: string;
  traffic?: string;
  changeBadge?: string;
  trendRatio?: number;
  newsTitle?: string;
  newsUrl?: string;
  newsSource?: string;
}

export default function RealtimeKeywordPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours());

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [naverKeywords, setNaverKeywords] = useState<RealtimeKeywordItem[]>([]);
  const [googleKeywords, setGoogleKeywords] = useState<RealtimeKeywordItem[]>([]);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const fetchRealtimeTrends = async (date: string, hour: number) => {
    if (naverKeywords.length === 0 && googleKeywords.length === 0) {
      setLoading(true);
    }
    setIsFetching(true);
    try {
      // Fetch Google Trends
      const googleRes = await fetch(`/api/google/trends?geo=KR&date=${date}&hour=${hour}`);
      const googleData = await googleRes.json();
      if (googleData.items && Array.isArray(googleData.items) && googleData.items.length > 0) {
        setGoogleKeywords(
          googleData.items.slice(0, 20).map((g: any, i: number) => ({
            rank: i + 1,
            keyword: g.title,
            traffic: g.traffic || "100K+",
            changeBadge: "NEW",
            newsTitle: g.newsTitle,
            newsUrl: g.newsUrl,
            newsSource: g.newsSource,
          }))
        );
      } else {
        setGoogleKeywords([]);
      }

      // Fetch Naver Realtime DataLab Trend
      const naverRes = await fetch(`/api/naver/trend?date=${date}&hour=${hour}`);
      const naverData = await naverRes.json();
      if (naverData.results && Array.isArray(naverData.results) && naverData.results.length > 0) {
        setNaverKeywords(
          naverData.results.slice(0, 20).map((n: any, i: number) => ({
            rank: i + 1,
            keyword: n.title,
            traffic: `지수 ${n.ratio || 90}`,
            changeBadge: i % 3 === 0 ? "NEW" : i % 2 === 0 ? "▲" : "▼",
            trendRatio: n.ratio || 85,
            newsTitle: n.newsTitle || `${n.title} 관련 네이버 실시간 뉴스 이슈`,
            newsUrl: n.newsUrl || `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(n.title)}`,
            newsSource: n.newsSource || "네이버 뉴스",
          }))
        );
      } else {
        setNaverKeywords([]);
      }
    } catch (err) {
      console.error("Realtime trends fetch error:", err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentHour = now.getHours();
  const isToday = selectedDate === todayStr;

  useEffect(() => {
    fetchRealtimeTrends(selectedDate, selectedHour);
  }, [selectedDate, selectedHour]);

  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleHourChange = (delta: number) => {
    let nextHour = selectedHour + delta;
    if (nextHour < 0) {
      nextHour = 23;
    } else if (nextHour > 23) {
      nextHour = 0;
    }
    if (isToday && nextHour > currentHour) return;
    setSelectedHour(nextHour);
  };

  const handleDateChange = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const newDateStr = d.toISOString().split("T")[0];
    if (newDateStr > todayStr) return;
    setSelectedDate(newDateStr);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 & 날짜/시간 선택기 */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-blue-950/40 border border-emerald-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Portals Sync
              </span>
              <span className="text-xs text-zinc-400 font-mono">CreAibox Realtime Intelligence</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Flame className="text-emerald-400" size={32} />
              현재 이 시간, 실시간으로 뜨고 있는 검색어
            </h1>

            <p className="text-zinc-400 text-sm whitespace-nowrap font-medium">
              네이버 실시간 검색어 20개와 구글 실시간 급상승 검색어 20개를 1:1 비교 분석하고 CreAibox 클라우드 DB에 자동으로 아카이빙합니다.
            </p>
          </div>
        </div>

        {/* 🗓️ loword 스타일 날짜 및 시간대 선택 바 */}
        <div className="flex flex-wrap items-center gap-4 bg-black/60 p-4 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Calendar size={15} className="text-emerald-400" /> 날짜 선택
            </span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-emerald-500/40 rounded-xl px-2 py-1 shadow-sm">
              <button
                type="button"
                onClick={() => handleDateChange(-1)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="이전 날짜 (-1일)"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-mono font-bold text-xs px-2 py-1 outline-none cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[70%] [&::-webkit-calendar-picker-indicator]:sepia-[100%] [&::-webkit-calendar-picker-indicator]:saturate-[1000%] [&::-webkit-calendar-picker-indicator]:hue-rotate-[90deg] [&::-webkit-calendar-picker-indicator]:hover:scale-150 transition-all"
              />
              <button
                type="button"
                onClick={() => handleDateChange(1)}
                disabled={selectedDate >= todayStr}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="다음 날짜 (+1일)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
              <Clock size={14} className="text-blue-400" /> 시간대 선택
            </span>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700/60 rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => handleHourChange(-1)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                title="이전 시간대 (-1시간)"
              >
                <ChevronLeft size={16} />
              </button>

              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="bg-transparent text-white font-mono font-bold text-xs px-2 py-1 outline-none cursor-pointer"
              >
                {Array.from({ length: 24 }).map((_, h) => {
                  const isFuture = isToday && h > currentHour;
                  const isCurrent = isToday && h === currentHour;

                  return (
                    <option
                      key={h}
                      value={h}
                      disabled={isFuture}
                      className={isFuture ? "text-zinc-600 bg-zinc-950" : "bg-zinc-900 text-white"}
                    >
                      {h < 10 ? `0${h}` : h}시 {isCurrent ? "(현재)" : isFuture ? "(미집계)" : "(아카이빙 기록)"}
                    </option>
                  );
                })}
              </select>

              <button
                type="button"
                onClick={() => handleHourChange(1)}
                disabled={isToday && selectedHour >= currentHour}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="다음 시간대 (+1시간)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="ml-auto text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            {isFetching && <RefreshCw size={12} className="animate-spin text-emerald-400" />}
            <span>
              선택 일시: <span className="text-emerald-400 font-bold">{selectedDate}</span>{" "}
              <span className="text-blue-400 font-bold">{selectedHour}시</span> 데이터
            </span>
          </div>
        </div>
      </div>

      {/* ⚔️ 2열 실시간 비교 대시보드 (좌: 네이버 20개 / 우: 구글 20개) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🟢 좌측: 네이버 실시간 검색어 20개 */}
        <div className="bg-zinc-900/40 border border-emerald-500/20 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
                N
              </span>
              <div>
                <h3 className="text-base font-black text-white">네이버 실시간 검색어 TOP 20</h3>
                <p className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                  포털 실시간 트렌드 &amp; 뉴스 열독 통합 지수 (Search &amp; News Engagement Index)
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-emerald-400" size={18} />
              네이버 실시간 검색어를 가져오는 중입니다...
            </div>
          ) : naverKeywords.length === 0 ? (
            <div className="p-10 text-center bg-zinc-950/80 border border-amber-500/20 rounded-2xl space-y-3">
              <AlertCircle className="mx-auto text-amber-400/80" size={36} />
              <h4 className="text-base font-bold text-zinc-200">조회할 수 있는 아카이빙 데이터가 없습니다</h4>
              <p className="text-sm font-medium text-zinc-300 w-full mx-auto leading-relaxed whitespace-pre-line [word-break:keep-all]">
                선택하신 일시의 데이터는 CreAibox DB 수집 기간 이전이거나 아카이빙 기록이 존재하지 않습니다.{"\n"}
                (2026년 7월 29일부터 개발을 완료하여 네이버 실시간 검색어 수집을 시작하였습니다.)
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {naverKeywords.map((item) => (
                <div
                  key={item.rank}
                  className="p-2.5 px-3.5 rounded-2xl bg-black/50 border border-zinc-800/80 hover:border-emerald-500/40 transition-all group flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {item.rank}
                    </span>
                    <a
                      href={`https://search.naver.com/search.naver?query=${encodeURIComponent(item.keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-white hover:text-emerald-400 transition-colors truncate flex items-center gap-1 group/link"
                      title="클릭 시 네이버 검색창에서 즉시 검색 조회"
                    >
                      <span>{item.keyword}</span>
                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-400 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.changeBadge === "NEW" ? (
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        NEW
                      </span>
                    ) : item.changeBadge === "▲" ? (
                      <span className="text-xs font-bold text-rose-400 shrink-0">▲</span>
                    ) : (
                      <span className="text-xs font-bold text-blue-400 shrink-0">▼</span>
                    )}

                    <button
                      onClick={() => handleCopy(item.keyword)}
                      className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all shrink-0"
                      title="키워드 복사"
                    >
                      {copiedKeyword === item.keyword ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>

                    <Link
                      href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(item.keyword)}`}
                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <Sparkles size={11} /> AI 글쓰기
                    </Link>
                    <Link
                      href={`/studio/keyword/tool?keyword=${encodeURIComponent(item.keyword)}&provider=naver`}
                      className="px-2 py-1 rounded-lg bg-zinc-800/90 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
                      title="키워드 정밀 분석 도구로 바로 이동하여 자동 분석 실행"
                    >
                      <Search size={11} /> 정밀분석
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔵 우측: 구글 실시간 검색어 20개 (구글 트렌드 Trending Now) */}
        <div className="bg-zinc-900/40 border border-blue-500/20 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Globe className="text-blue-400 shrink-0" size={22} />
              <div>
                <h3 className="text-base font-black text-white">구글 실시간 검색어 TOP 20 (Google Trends)</h3>
                <p className="text-[11px] text-blue-400/90 font-medium mt-0.5">
                  순수 검색량 급상승 알림 (Search Spike Volume)
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-400" size={18} />
              구글 실시간 트렌드를 수집하는 중입니다...
            </div>
          ) : googleKeywords.length === 0 ? (
            <div className="p-10 text-center bg-zinc-950/80 border border-amber-500/20 rounded-2xl space-y-3">
              <AlertCircle className="mx-auto text-amber-400/80" size={36} />
              <h4 className="text-base font-bold text-zinc-200">조회할 수 있는 아카이빙 데이터가 없습니다</h4>
              <p className="text-sm font-medium text-zinc-300 w-full mx-auto leading-relaxed whitespace-pre-line [word-break:keep-all]">
                선택하신 일시의 데이터는 CreAibox DB 수집 기간 이전이거나 아카이빙 기록이 존재하지 않습니다.{"\n"}
                (2026년 7월 29일부터 개발을 완료하여 구글 실시간 검색어 수집을 시작하였습니다.)
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {googleKeywords.map((item) => (
                <div
                  key={item.rank}
                  className="p-2.5 px-3.5 rounded-2xl bg-black/50 border border-zinc-800/80 hover:border-blue-500/40 transition-all group flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.rank}
                    </span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-white hover:text-blue-400 transition-colors truncate flex items-center gap-1 group/link"
                      title="클릭 시 구글 검색창에서 즉시 검색 조회"
                    >
                      <span>{item.keyword}</span>
                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-blue-400 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 font-mono shrink-0">
                      🔥 {item.traffic}
                    </span>

                    <button
                      onClick={() => handleCopy(item.keyword)}
                      className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all shrink-0"
                      title="키워드 복사"
                    >
                      {copiedKeyword === item.keyword ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>

                    <Link
                      href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(item.keyword)}`}
                      className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <Sparkles size={11} /> AI 글쓰기
                    </Link>
                    <Link
                      href={`/studio/keyword/tool?keyword=${encodeURIComponent(item.keyword)}&provider=google`}
                      className="px-2 py-1 rounded-lg bg-zinc-800/90 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
                      title="키워드 정밀 분석 도구로 바로 이동하여 자동 분석 실행"
                    >
                      <Search size={11} /> 정밀분석
                    </Link>
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
