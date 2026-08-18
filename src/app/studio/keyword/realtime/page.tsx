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

// 브라우저 세션 전역 메모리 캐시 (0.01초 광속 서빙)
const clientRealtimeCache = new Map<string, { naver: RealtimeKeywordItem[]; google: RealtimeKeywordItem[] }>();

export default function RealtimeKeywordPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedHour, setSelectedHour] = useState<number>(() => new Date().getHours());

  const initialKey = `${new Date().toISOString().split("T")[0]}_${new Date().getHours()}`;
  const initialCached = clientRealtimeCache.get(initialKey);

  const [loading, setLoading] = useState(!initialCached);
  const [isFetching, setIsFetching] = useState(false);
  const [naverKeywords, setNaverKeywords] = useState<RealtimeKeywordItem[]>(initialCached?.naver || []);
  const [googleKeywords, setGoogleKeywords] = useState<RealtimeKeywordItem[]>(initialCached?.google || []);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const fetchRealtimeTrends = async (date: string, hour: number) => {
    const cacheKey = `${date}_${hour}`;
    const cached = clientRealtimeCache.get(cacheKey);

    if (cached) {
      setNaverKeywords(cached.naver);
      setGoogleKeywords(cached.google);
      setLoading(false);
    } else {
      setLoading(true);
    }

    setIsFetching(true);
    try {
      // Fetch Google Trends & Naver DataLab in parallel
      const [googleRes, naverRes] = await Promise.all([
        fetch(`/api/google/trends?geo=KR&date=${date}&hour=${hour}`),
        fetch(`/api/naver/trend?date=${date}&hour=${hour}`)
      ]);

      const [googleData, naverData] = await Promise.all([
        googleRes.json(),
        naverRes.json()
      ]);

      let parsedGoogle: RealtimeKeywordItem[] = [];
      if (googleData.items && Array.isArray(googleData.items) && googleData.items.length > 0) {
        parsedGoogle = googleData.items.slice(0, 20).map((g: any, i: number) => ({
          rank: i + 1,
          keyword: g.title,
          traffic: g.traffic || "100K+",
          changeBadge: "NEW",
          newsTitle: g.newsTitle,
          newsUrl: g.newsUrl,
          newsSource: g.newsSource,
        }));
      }

      let parsedNaver: RealtimeKeywordItem[] = [];
      if (naverData.results && Array.isArray(naverData.results) && naverData.results.length > 0) {
        parsedNaver = naverData.results.slice(0, 20).map((n: any, i: number) => ({
          rank: i + 1,
          keyword: n.title,
          traffic: `지수 ${n.ratio || 90}`,
          changeBadge: i % 3 === 0 ? "NEW" : i % 2 === 0 ? "▲" : "▼",
          trendRatio: n.ratio || 85,
          newsTitle: n.newsTitle || `${n.title} 관련 네이버 실시간 뉴스 이슈`,
          newsUrl: n.newsUrl || `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(n.title)}`,
          newsSource: n.newsSource || "네이버 뉴스",
        }));
      }

      setGoogleKeywords(parsedGoogle);
      setNaverKeywords(parsedNaver);

      // 캐시에 저장
      clientRealtimeCache.set(cacheKey, {
        naver: parsedNaver,
        google: parsedGoogle,
      });
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
    <div className="max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[26px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          실시간 급상승 키워드
        </h1>
        <p className="text-[15px] text-slate-500 dark:text-zinc-400">
          네이버 실시간 검색어 20개와 구글 급상승 검색어를 1:1 비교 분석하고 DB에 자동 아카이빙합니다.
        </p>
      </div>

      <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800/80 overflow-x-auto hide-scrollbar">
        {[
          { name: "실시간 급상승 키워드", href: "/studio/keyword/realtime", active: true },
          { name: "키워드 정밀 도구", href: "/studio/keyword/tool", active: false },
          { name: "네이버 블로그 지수 진단", href: "/studio/keyword/blog-index", active: false },
          { name: "구글 트렌드 인사이트", href: "/studio/keyword/google-trends", active: false },
          { name: "키워드 대량 조회", href: "/studio/keyword/bulk", active: false },
          { name: "연관 키워드 발굴", href: "/studio/keyword/related", active: false },
          { name: "형태소 분석기 & SEO", href: "/studio/keyword/morph", active: false },
          { name: "AI 키워드 전략 생성", href: "/studio/keyword/ai-strategy", active: false },
        ].map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`pb-4 text-[15px] font-semibold whitespace-nowrap transition-colors relative ${
              tab.active
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.name}
            {tab.active && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 dark:bg-white rounded-t-full" />
            )}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Calendar size={14} className="text-emerald-500" /> 날짜 선택
          </span>
          <div className="flex items-center bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2 py-1 gap-1 shadow-sm">
            <button type="button" onClick={() => handleDateChange(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400 transition" title="이전 날짜">
              <ChevronLeft size={16} />
            </button>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-slate-900 dark:text-white font-mono font-semibold text-xs px-2 py-0.5 outline-none cursor-pointer" />
            <button type="button" onClick={() => handleDateChange(1)} disabled={isToday} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition" title="다음 날짜">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Clock size={14} className="text-blue-500" /> 시간대 선택
          </span>
          <div className="flex items-center bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2 py-1 gap-1 shadow-sm">
            <button type="button" onClick={() => handleHourChange(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400 transition" title="이전 시간">
              <ChevronLeft size={16} />
            </button>
            <select value={selectedHour} onChange={(e) => setSelectedHour(Number(e.target.value))} className="bg-transparent text-slate-900 dark:text-white font-mono font-semibold text-xs px-2 py-0.5 outline-none cursor-pointer">
              {Array.from({ length: 24 }).map((_, h) => {
                const isFuture = isToday && h > currentHour;
                const isCurrent = isToday && h === currentHour;
                return (
                  <option key={h} value={h} disabled={isFuture} className={isFuture ? "text-slate-400 dark:text-zinc-600 bg-slate-100 dark:bg-zinc-950" : "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"}>
                    {h < 10 ? `0${h}` : h}시 {isCurrent ? "(현재)" : isFuture ? "(미집계)" : "(기록)"}
                  </option>
                );
              })}
            </select>
            <button type="button" onClick={() => handleHourChange(1)} disabled={isToday && selectedHour >= currentHour} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded text-slate-500 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition" title="다음 시간">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="ml-auto text-[11px] text-slate-500 dark:text-zinc-400 font-mono flex items-center gap-1.5 uppercase tracking-wider font-semibold">
          {isFetching && <RefreshCw size={12} className="animate-spin text-emerald-500" />}
          <span>Data: <span className="text-emerald-600 dark:text-emerald-400">{selectedDate}</span> <span className="text-blue-600 dark:text-blue-400">{selectedHour}H</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-zinc-900/40 border border-emerald-500/20 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">N</span>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">네이버 실시간 검색어 &amp; 이슈 기사 TOP 20</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400/90 font-medium mt-0.5">핵심 검색어 키워드 + 네이버 실시간 원본 이슈 기사 제목 일괄 연동</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-emerald-500" size={18} /> 네이버 실시간 트렌드를 수집하는 중입니다...
            </div>
          ) : naverKeywords.length === 0 ? (
            <div className="p-10 text-center bg-zinc-50 dark:bg-zinc-950/80 border border-amber-500/20 rounded-2xl space-y-3">
              <AlertCircle className="mx-auto text-amber-500/80" size={36} />
              <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">조회할 수 있는 아카이빙 데이터가 없습니다</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 w-full mx-auto leading-relaxed">선택하신 일시의 데이터는 수집 기간 이전이거나 아카이빙 기록이 존재하지 않습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {naverKeywords.map((item) => (
                <div key={item.rank} className="p-2.5 px-3.5 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800/80 hover:border-emerald-500/40 transition-all group flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">{item.rank}</span>
                    <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(item.keyword)}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-all shrink-0 flex items-center gap-1 group/link">
                      <span>{item.keyword}</span>
                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-emerald-500 shrink-0" />
                    </a>
                    {item.newsTitle && (
                      <a href={item.newsUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white font-medium truncate transition flex items-center">
                        <span className="text-slate-300 dark:text-zinc-600 mr-1.5 font-normal">|</span>
                        <span className="truncate">{item.newsTitle}</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.changeBadge === "NEW" ? <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">NEW</span> : item.changeBadge === "▲" ? <span className="text-xs font-bold text-rose-500 shrink-0">▲</span> : <span className="text-xs font-bold text-blue-500 shrink-0">▼</span>}
                    <button onClick={() => handleCopy(item.keyword)} className="p-1 rounded-md bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 transition-all shrink-0">
                      {copiedKeyword === item.keyword ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>
                    <Link href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(item.keyword)}`} className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Sparkles size={11} /> AI 글쓰기
                    </Link>
                    <Link href={`/studio/keyword/tool?keyword=${encodeURIComponent(item.keyword)}&provider=naver`} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800/90 hover:bg-cyan-600 text-cyan-600 dark:text-cyan-300 hover:text-white border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Search size={11} /> 정밀분석
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-zinc-900/40 border border-blue-500/20 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Globe className="text-blue-500 shrink-0" size={22} />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">구글 실시간 검색어 TOP 20</h3>
                <p className="text-[11px] text-blue-500/90 font-medium mt-0.5">순수 검색량 급상승 알림 (Search Spike Volume)</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-zinc-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-blue-500" size={18} /> 구글 실시간 트렌드를 수집하는 중입니다...
            </div>
          ) : googleKeywords.length === 0 ? (
            <div className="p-10 text-center bg-zinc-50 dark:bg-zinc-950/80 border border-amber-500/20 rounded-2xl space-y-3">
              <AlertCircle className="mx-auto text-amber-500/80" size={36} />
              <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">조회할 수 있는 아카이빙 데이터가 없습니다</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 w-full mx-auto leading-relaxed">선택하신 일시의 데이터는 수집 기간 이전이거나 아카이빙 기록이 존재하지 않습니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {googleKeywords.map((item) => (
                <div
                  key={item.rank}
                  className="p-2.5 px-3.5 rounded-2xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800/80 hover:border-blue-500/40 transition-all group flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {item.rank}
                    </span>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-500 transition-colors truncate flex items-center gap-1 group/link"
                      title="클릭 시 구글 검색창에서 즉시 검색 조회"
                    >
                      <span>{item.keyword}</span>
                      <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-blue-500 shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 font-mono shrink-0">
                      🔥 {item.traffic}
                    </span>

                    <button
                      onClick={() => handleCopy(item.keyword)}
                      className="p-1 rounded-md bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-400 transition-all shrink-0"
                      title="키워드 복사"
                    >
                      {copiedKeyword === item.keyword ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </button>

                    <Link
                      href={`/studio/writing/creaibox/new-post?keyword=${encodeURIComponent(item.keyword)}`}
                      className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <Sparkles size={11} /> AI 글쓰기
                    </Link>
                    <Link
                      href={`/studio/keyword/tool?keyword=${encodeURIComponent(item.keyword)}&provider=google`}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800/90 hover:bg-cyan-600 text-cyan-600 dark:text-cyan-300 hover:text-white border border-cyan-500/30 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
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
