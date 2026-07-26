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
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { KeywordToolResult } from "@/lib/server/keyword-tool-engine";

export default function LowordKeywordToolPage() {
  const searchParams = useSearchParams();
  const paramKw = searchParams.get("keyword");
  const paramProv = searchParams.get("provider") as "naver" | "google" | null;

  const [provider, setProvider] = useState<"naver" | "google">("naver");
  const [inputKw, setInputKw] = useState("나이키");
  const [searchKw, setSearchKw] = useState("나이키");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<KeywordToolResult | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 📜 영구 보관 아카이빙 리포트 목록 상태
  const [reports, setReports] = useState<any[]>([]);
  const [reportPage, setReportPage] = useState(1);
  const [reportTotalPages, setReportTotalPages] = useState(1);
  const [reportTotalCount, setReportTotalCount] = useState(0);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [loadingReports, setLoadingReports] = useState(false);

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

  const fetchKeywordAnalysis = async (kw: string, prov: "naver" | "google") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/keyword/tool?keyword=${encodeURIComponent(kw)}&provider=${prov}`);
      const json = await res.json();
      setData(json);
      // 분석 완료 후 아카이빙 리포트 목록 즉시 갱신
      fetchReportsList(1, reportSearchQuery);
    } catch (err) {
      console.error("Keyword tool fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywordAnalysis(searchKw, provider);
  }, [searchKw, provider]);

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
              CreAibox Keyword Intelligence
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
              placeholder="분석할 메인 키워드를 입력하세요... (예: 나이키, 김부장, 삼성전자)"
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

      {loading && !data && (
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
              <div className="text-2xl font-black text-white font-mono">{data.dailySearchVolume.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                <TrendingUp size={12} /> 12.4% 전주 대비
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">월간 PC 검색량</span>
              <div className="text-2xl font-black text-white font-mono">{data.monthlyPcVolume.toLocaleString()}</div>
              <div className="text-[11px] text-zinc-500">전체 검색의 22%</div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">월간 모바일 검색량</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">{data.monthlyMobileVolume.toLocaleString()}</div>
              <div className="text-[11px] text-cyan-400/80 font-bold">모바일 점유율 78%</div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-zinc-400">CreAibox 평가 등급</span>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
                {data.ratingGrade}
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  {data.ratingStatus}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">블로그 상위 노출 난이도 보통</div>
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
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-white">1개월</span>
                  <span className="px-2 py-0.5 rounded hover:text-white cursor-pointer">3개월</span>
                  <span className="px-2 py-0.5 rounded hover:text-white cursor-pointer">6개월</span>
                  <span className="px-2 py-0.5 rounded hover:text-white cursor-pointer">1년</span>
                </div>
              </div>

              <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-zinc-800">
                {data.trendPoints.map((tp, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-cyan-600/80 group-hover:bg-cyan-400 rounded-t-md transition-all relative"
                      style={{ height: `${Math.min(100, Math.max(15, (tp.volume / (data.dailySearchVolume * 1.5)) * 100))}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-cyan-500/40 text-cyan-300 font-mono text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                        {tp.volume.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{tp.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Newspaper size={20} className="text-blue-400" />
                이 검색어는 왜? (관련 뉴스)
              </h3>
              <div className="space-y-3">
                {data.newsList.map((news, idx) => (
                  <a
                    key={idx}
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="font-bold text-xs text-zinc-200 group-hover:text-cyan-400 line-clamp-1 transition-colors">
                      {news.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{news.source}</span>
                      <span>{news.pubDate}</span>
                    </div>
                  </a>
                ))}
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

      {/* 📜 최근 분석된 키워드 정밀 리포트 목록 (유튜브 리포트 스타일 테이블) */}
      <div className="bg-zinc-900/40 border border-purple-500/20 p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <FileText size={22} className="text-purple-400" />
              최근 분석된 키워드 정밀 분석 리포트 (CreAibox DB 보관함)
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

        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>
            검색 결과: 총 <strong className="text-purple-400 font-bold">{reportTotalCount}개</strong> 중 (페이지 {reportPage} / {reportTotalPages})
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setReportPage((prev) => Math.max(1, prev - 1))}
              disabled={reportPage <= 1 || loadingReports}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-bold text-white">{reportPage} / {reportTotalPages}</span>
            <button
              onClick={() => setReportPage((prev) => Math.min(reportTotalPages, prev + 1))}
              disabled={reportPage >= reportTotalPages || loadingReports}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
            >
              <ChevronRight size={14} />
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">번호</th>
                  <th className="py-3 px-4">포털</th>
                  <th className="py-3 px-4">분석 키워드</th>
                  <th className="py-3 px-4">월간 총 검색량</th>
                  <th className="py-3 px-4">CreAibox 등급</th>
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
                        {isNaver ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                            🟢 네이버
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px]">
                            🔵 구글
                          </span>
                        )}
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
        )}
      </div>
    </div>
  );
}
