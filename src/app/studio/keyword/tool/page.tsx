"use client";

import { useState, useEffect, Suspense } from "react";
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
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { KeywordToolResult } from "@/lib/server/keyword-tool-engine";

function LowordKeywordToolContent() {
  const searchParams = useSearchParams();
  const paramKw = searchParams.get("keyword");
  const paramProv = searchParams.get("provider") as "naver" | "google" | null;

  const [provider, setProvider] = useState<"naver" | "google">("naver");
  const [inputKw, setInputKw] = useState("");
  const [searchKw, setSearchKw] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<KeywordToolResult | null>(null);
  const [dualData, setDualData] = useState<{ naver?: KeywordToolResult; google?: KeywordToolResult } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [quickKeywords, setQuickKeywords] = useState<Array<{ keyword: string; provider: "naver" | "google" }>>([]);

  // 📜 영구 보관 아카이빙 리포트 목록 상태
  const [reports, setReports] = useState<any[]>([]);
  const [reportPage, setReportPage] = useState(1);
  const [reportTotalPages, setReportTotalPages] = useState(1);
  const [reportTotalCount, setReportTotalCount] = useState(0);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    async function loadQuickKeywords() {
      try {
        const res = await fetch("/api/keywords/latest-quick");
        const json = await res.json();
        if (json.items && Array.isArray(json.items) && json.items.length > 0) {
          setQuickKeywords(json.items);
        }
      } catch (e) {
        console.error("loadQuickKeywords error:", e);
      }
    }
    loadQuickKeywords();
  }, []);

  useEffect(() => {
    if (paramKw) {
      const decodedKw = decodeURIComponent(paramKw);
      const targetProv = paramProv || "naver";
      setInputKw(decodedKw);
      setSearchKw(decodedKw);
      if (paramProv) setProvider(targetProv);
    }
  }, [paramKw, paramProv]);

  const fetchReportsList = async (page: number = 1, query: string = "") => {
    setLoadingReports(true);
    try {
      const res = await fetch(`/api/keyword/tool/reports?page=${page}&limit=10&search=${encodeURIComponent(query)}`);
      const json = await res.json();
      setReports(json.items || []);
      setReportPage(json.page || 1);
      setReportTotalPages(json.totalPages || 1);
      setReportTotalCount(json.total || 0);
    } catch (err) {
      console.error("fetchReportsList error:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchKeywordAnalysis = async (kw: string) => {
    setLoading(true);
    try {
      // ⚡ 네이버와 구글을 동시 병열 분석하여 즉시 수집
      const res = await fetch(`/api/keyword/tool?keyword=${encodeURIComponent(kw)}&provider=${provider}`);
      const json = await res.json();
      if (json.naver && json.google) {
        setDualData({ naver: json.naver, google: json.google });
        setData(provider === "google" ? json.google : json.naver);
      } else {
        setData(json);
      }
      // 분석 완료 후 아카이빙 리포트 목록 즉시 갱신
      fetchReportsList(1, reportSearchQuery);
    } catch (err) {
      console.error("Keyword tool fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchKw.trim()) {
      fetchKeywordAnalysis(searchKw.trim());
    }
  }, [searchKw]);

  const handleProviderToggle = (targetProv: "naver" | "google") => {
    setProvider(targetProv);
    if (dualData && dualData[targetProv]) {
      setData(dualData[targetProv]!);
    }
  };

  useEffect(() => {
    fetchReportsList(reportPage, reportSearchQuery);
  }, [reportPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKw.trim()) {
      setSearchKw(inputKw.trim());
    }
  };

  const handleReportSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportPage(1);
    fetchReportsList(1, reportSearchQuery);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleLoadReport = (item: any) => {
    if (item.resultJson) {
      setData(item.resultJson);
      setInputKw(item.keyword);
      setSearchKw(item.keyword);
      setProvider(item.provider || "naver");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setInputKw(item.keyword);
      setSearchKw(item.keyword);
      setProvider(item.provider || "naver");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      {/* 🚀 검색 조율 상단 바 */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-purple-950/40 border border-cyan-500/20 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase">
              CreaiBox Keyword Intelligence
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Search className="text-cyan-400" size={32} />
              키워드 정밀 도구 (검색량 & SERP 배치)
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              포털별 검색량 추이, 상위 노출 블로그 지수, 연관 키워드, CPC 및 종합 경쟁 등급을 한눈에 분석하고 영구 보관합니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => handleProviderToggle("naver")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                provider === "naver" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-400 hover:text-white"
              }`}
            >
              🟢 네이버
            </button>
            <button
              type="button"
              onClick={() => handleProviderToggle("google")}
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
              placeholder="분석할 메인 키워드를 입력하세요... (예: 크리에이박스, creaibox, 홈페이지 제작, 비디오 편집기)"
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

        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="font-bold shrink-0 text-amber-400 flex items-center gap-1">
            🔥 현재 실시간 급상승 키워드:
          </span>
          {quickKeywords.length > 0 ? (
            quickKeywords.map((item, idx) => (
              <button
                key={`${item.keyword}-${idx}`}
                type="button"
                onClick={() => {
                  setInputKw(item.keyword);
                  setProvider(item.provider);
                  setSearchKw(item.keyword);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-cyan-950/60 text-zinc-300 hover:text-cyan-300 border border-zinc-700/60 hover:border-cyan-500/50 transition-all flex items-center gap-1 font-bold text-xs cursor-pointer shadow-sm"
                title={`클릭 시 ${item.provider === "naver" ? "네이버" : "구글"} 실시간 키워드 정밀 분석`}
              >
                <span className="text-[10px]">{item.provider === "naver" ? "🟢" : "🔵"}</span>
                <span>#{item.keyword}</span>
              </button>
            ))
          ) : (
            ["크리에이박스", "creaibox", "홈페이지 제작", "비디오 편집기", "AI 글쓰기", "도메인 구매"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setInputKw(k);
                  setSearchKw(k);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-cyan-900/40 text-zinc-300 hover:text-cyan-300 border border-zinc-700/50 hover:border-cyan-500/40 transition-colors"
              >
                #{k}
              </button>
            ))
          )}
        </div>
      </div>

      {!loading && !data && !searchKw && (
        <div className="p-16 text-center bg-zinc-950/80 border border-zinc-800/80 rounded-3xl space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Search size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">키워드 정밀 분석을 시작해보세요</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              분석하고 싶은 메인 키워드를 상단 입력창에 입력하시거나, 추천 키워드 태그를 클릭하시면
              네이버 및 구글의 실시간 검색량, 월간 추이, SERP 상위노출 지수를 정밀하게 비교·분석해 드립니다.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="p-16 text-center text-zinc-400 space-y-3">
          <RefreshCw className="animate-spin text-cyan-400 mx-auto" size={32} />
          <p className="text-sm font-bold text-zinc-300">포털 키워드를 정밀 분석 중입니다...</p>
        </div>
      )}

      {data && (
        <>
          {/* 📊 주요 4대 지표 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">일간 검색량</span>
              <div className="text-2xl font-black text-white font-mono">
                {data.dailySearchVolume > 0 ? data.dailySearchVolume.toLocaleString() : "DataLab 수집중"}
              </div>
              <div className="text-[11px] text-amber-400/90 font-bold">
                네이버 SearchAd API 등록 시 실측 수치 표시
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">월간 PC 검색량</span>
              <div className="text-2xl font-black text-white font-mono">
                {data.monthlyPcVolume > 0 ? data.monthlyPcVolume.toLocaleString() : "실측 트렌드 지수"}
              </div>
              <div className="text-[11px] text-zinc-400 font-bold">포털 실측 DataLab 지수 수집</div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">월간 모바일 검색량</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {data.monthlyMobileVolume > 0 ? data.monthlyMobileVolume.toLocaleString() : "문서 지수 수집중"}
              </div>
              <div className="text-[11px] text-cyan-400/80 font-bold">가짜 데이터 0% 룰 준수</div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">CreaiBox 평가 등급</span>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
                {data.ratingGrade}
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  {data.ratingStatus}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">포털 상위 노출 실측 난이도</div>
            </div>
          </div>

          {/* 📈 차트 & 뉴스 리스트 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp size={20} className="text-cyan-400" />
                  검색량 추이 차트 ({data.keyword})
                </h3>
                <div className="flex gap-1 text-[11px] font-bold text-zinc-400 bg-black/40 p-1 rounded-lg">
                  <span className="px-2 py-0.5 rounded bg-cyan-600 text-white">최신 실측</span>
                </div>
              </div>

              {/* 📊 바 그래프 차트 바운딩 렌더링 */}
              {(() => {
                const maxVol = Math.max(...data.trendPoints.map((p) => p.volume), 1);
                return (
                  <div className="h-48 flex items-end justify-between gap-2 pt-8 pb-2 px-3 border-b border-zinc-800 bg-black/20 rounded-2xl">
                    {data.trendPoints.map((tp, idx) => {
                      const barPct = Math.min(100, Math.max(18, Math.round((tp.volume / maxVol) * 100)));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div
                            className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-emerald-400 rounded-t-md transition-all relative shadow-lg shadow-cyan-500/10"
                            style={{ height: `${barPct}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded-lg whitespace-nowrap z-10 transition-all shadow-xl font-bold">
                              {tp.volume}pt
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono font-medium">{tp.date}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Newspaper size={20} className="text-blue-400" />
                이 검색어는 왜? (관련 뉴스)
              </h3>
              <div className="space-y-2">
                {data.newsList.length > 0 ? (
                  data.newsList.slice(0, 7).map((news, idx) => (
                    <a
                      key={idx}
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition-all group"
                      title={news.title}
                    >
                      <div className="font-bold text-xs text-zinc-200 group-hover:text-cyan-400 truncate flex-1 transition-colors">
                        {news.title}
                      </div>
                      <span className="text-[10px] text-cyan-400/80 font-bold shrink-0">
                        {news.source}
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-zinc-400 bg-black/30 rounded-2xl border border-zinc-800/60 leading-relaxed">
                    실시간 포털 뉴스 수집중입니다. 상단 [🔵 구글] 탭을 누르시면 실시간 구글 뉴스가 자동 연동됩니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🔗 연관 키워드 & CPC / 광고 경쟁도 분석 */}
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
                      <td className="py-3 px-4 text-cyan-400 font-mono font-bold">
                        {rk.searchVolume > 0 ? rk.searchVolume.toLocaleString() : "미연동"}
                      </td>
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

      {/* 📜 최근 분석된 키워드 정밀 리포트 목록 (유튜브 리포트 스타일 테이블) */}
      <div className="bg-zinc-900/40 border border-purple-500/20 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileText size={22} className="text-purple-400" />
              최근 분석된 키워드 정밀 분석 리포트 (CreaiBox DB 보관함)
            </h3>
            <p className="text-xs text-zinc-400">
              분석하기 버튼을 눌러 분석된 모든 키워드 리포트가 영구 보관되어 모든 사용자가 함께 조회할 수 있습니다.
            </p>
          </div>

          <form onSubmit={handleReportSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              value={reportSearchQuery}
              onChange={(e) => setReportSearchQuery(e.target.value)}
              placeholder="보관된 키워드 검색..."
              className="w-full bg-black/80 border border-zinc-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-purple-500 transition-all pr-8"
            />
            <button type="submit" className="absolute right-2 top-2.5 text-zinc-400 hover:text-white">
              <Search size={14} />
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-zinc-400 gap-2">
          <span>
            DB 보관 목록: 총 <strong className="text-purple-400 font-bold">{reportTotalCount}개</strong> (한 페이지 당 10개씩 표시)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReportPage((prev) => Math.max(1, prev - 1))}
              disabled={reportPage <= 1 || loadingReports}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-purple-900/40 hover:text-purple-300 disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 text-zinc-300 border border-zinc-700/60 transition-all flex items-center gap-1 font-bold text-xs cursor-pointer"
            >
              <ChevronLeft size={14} /> 이전
            </button>
            <span className="px-3 py-1 rounded-xl bg-black/60 border border-zinc-800 font-bold text-white font-mono text-xs">
              {reportPage} / {reportTotalPages} 페이지
            </span>
            <button
              onClick={() => setReportPage((prev) => Math.min(reportTotalPages, prev + 1))}
              disabled={reportPage >= reportTotalPages || loadingReports}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-purple-900/40 hover:text-purple-300 disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400 text-zinc-300 border border-zinc-700/60 transition-all flex items-center gap-1 font-bold text-xs cursor-pointer"
            >
              다음 <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {loadingReports ? (
          <div className="p-12 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-purple-400" size={18} />
            보관된 키워드 리포트 목록을 불러오는 중입니다...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs bg-black/40 rounded-2xl border border-zinc-800">
            아직 보관된 키워드 분석 리포트가 없습니다. 상단에서 키워드를 분석해 보세요!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">번호</th>
                    <th className="py-3 px-4">포털</th>
                    <th className="py-3 px-4">분석 키워드</th>
                    <th className="py-3 px-4">월간 총 검색량</th>
                    <th className="py-3 px-4">CreaiBox 등급</th>
                    <th className="py-3 px-4">상태</th>
                    <th className="py-3 px-4">분석일시</th>
                    <th className="py-3 px-4 text-right">리포트 보기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {reports.map((item, idx) => {
                    const itemIndex = reportTotalCount - ((reportPage - 1) * 10 + idx);
                    const isNaver = item.provider === "naver";
                    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "실시간";

                    return (
                      <tr
                        key={item.id || idx}
                        onClick={() => handleLoadReport(item)}
                        className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 text-zinc-500 font-mono">{itemIndex}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            {item.providers?.includes("naver") && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                                🟢 네이버
                              </span>
                            )}
                            {item.providers?.includes("google") && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px]">
                                🔵 구글
                              </span>
                            )}
                            {(!item.providers || item.providers.length === 0) && (
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isNaver ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                              }`}>
                                {isNaver ? "🟢 네이버" : "🔵 구글"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white group-hover:text-purple-300 transition-colors">
                          {item.keyword}
                        </td>
                        <td className="py-3.5 px-4 text-cyan-400 font-mono font-bold">
                          {(item.totalMonthlyVolume || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-black text-amber-400">
                          {item.ratingGrade || "A"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                            {item.ratingStatus || "분석완료"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          {dateStr}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadReport(item);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-[11px] transition-all shadow-sm"
                          >
                            리포트 보기
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 📜 하단 페이징 넘김 네비게이션 */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
              <span className="text-zinc-500 text-[11px]">
                페이지 {reportPage} / {reportTotalPages} (총 {reportTotalCount}개 리포트)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setReportPage((prev) => Math.max(1, prev - 1))}
                  disabled={reportPage <= 1 || loadingReports}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-purple-900/40 text-zinc-300 disabled:opacity-30 border border-zinc-700/50 transition-all font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> 이전 페이지
                </button>
                <button
                  onClick={() => setReportPage((prev) => Math.min(reportTotalPages, prev + 1))}
                  disabled={reportPage >= reportTotalPages || loadingReports}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-purple-900/40 text-zinc-300 disabled:opacity-30 border border-zinc-700/50 transition-all font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  다음 페이지 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LowordKeywordToolPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-zinc-400 font-semibold flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <RefreshCw className="animate-spin text-purple-400" size={24} />
            <span>키워드 탐색 도구를 로딩하고 있습니다...</span>
          </div>
        </div>
      }
    >
      <LowordKeywordToolContent />
    </Suspense>
  );
}
