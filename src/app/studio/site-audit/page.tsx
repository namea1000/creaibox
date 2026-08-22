"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Search,
  RefreshCw,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  FileCode2,
  Lock,
  Unlock,
  Trash2,
  History,
  X,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "@/components/common/SmartIntentLink";

interface ComparisonItem {
  feature: string;
  targetStatus: string;
  targetBadge: "bad" | "warning" | "good";
  creaiboxStatus: string;
  benefit: string;
}

interface IssueItem {
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  solution: string;
}

interface EssentialSettingItem {
  key: string;
  name: string;
  passed: boolean;
  severity: "critical" | "warning" | "info";
  currentValue: string;
  recommendation: string;
}

interface AuditReport {
  id?: string;
  targetUrl: string;
  normalizedDomain: string;
  title: string;
  description: string;
  detectedEngine: string;
  isCreaiBoxSite?: boolean;
  isFrameset: boolean;
  frameSrc?: string;
  hasSsl: boolean;
  hasFavicon?: boolean;
  isUtf8?: boolean;
  essentialSettings?: EssentialSettingItem[];
  seoScore: number;
  performanceScore: number;
  securityScore: number;
  overallGrade: string;
  avgScore: number;
  issues: IssueItem[];
  improvements: string[];
  comparisonTable: ComparisonItem[];
  scanReportSnapshot?: any;
  created_at?: string;
}

export default function SiteAuditPage() {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [historyList, setHistoryList] = useState<AuditReport[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        void fetchHistory();
      }
    }
    void loadUser();
  }, [supabase]);

  // Fetch History from DB
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/studio/site-audit/history");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const formatted = json.data.map((row: any) => ({
          id: row.id,
          targetUrl: row.target_url,
          normalizedDomain: row.normalized_domain,
          title: row.title,
          description: row.description,
          detectedEngine: row.detected_engine,
          isFrameset: row.is_frameset,
          frameSrc: row.frame_src,
          hasSsl: row.has_ssl,
          seoScore: row.seo_score,
          performanceScore: row.performance_score,
          securityScore: row.security_score,
          overallGrade: row.overall_grade,
          avgScore: Math.round(((row.seo_score || 50) + (row.performance_score || 50) + (row.security_score || 50)) / 3),
          issues: row.issues || [],
          improvements: row.improvements || [],
          comparisonTable: row.comparison_table || [],
          created_at: row.created_at,
        }));
        setHistoryList(formatted);
      }
    } catch (e) {
      console.warn("fetchHistory error:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Run Site Audit Scan
  const handleScan = async (e?: React.FormEvent, overrideUrl?: string) => {
    if (e) e.preventDefault();
    const target = (overrideUrl || urlInput).trim();
    if (!target) {
      setErrorMsg("진단할 사이트 URL을 입력해주세요.");
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/studio/site-audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "사이트 진단에 실패했습니다.");
      }

      if (json.success && json.data) {
        setCurrentReport(json.data);
        if (overrideUrl) setUrlInput(overrideUrl);
        if (currentUser) {
          void fetchHistory();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "스캔 도중 오류가 발생했습니다.");
    } finally {
      setIsScanning(false);
    }
  };

  // Delete History Record
  const handleDeleteHistory = async (id: string, domain: string) => {
    if (!confirm(`[${domain}] 진단 기록을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/studio/site-audit/history?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
        if (currentReport?.id === id) {
          setCurrentReport(null);
        }
      }
    } catch (e) {
      alert("삭제 실패");
    }
  };

  // Helper badge color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "bg-emerald-500 text-white border-emerald-400";
      case "A":
        return "bg-cyan-500 text-white border-cyan-400";
      case "B":
        return "bg-blue-500 text-white border-blue-400";
      case "C":
        return "bg-amber-500 text-white border-amber-400";
      case "D":
        return "bg-orange-500 text-white border-orange-400";
      default:
        return "bg-rose-500 text-white border-rose-400";
    }
  };

  return (
    <div className="w-full min-h-full bg-zinc-50 dark:bg-[#06080d] text-slate-900 dark:text-zinc-100 transition-colors duration-300 font-sans pb-16">
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 py-7 space-y-8">
        
        {/* --- 1. HERO & SEARCH SECTION --- */}
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <Sparkles size={13} />
              <span>AI 기반 웹사이트 아키텍처 & SEO 정밀 분석기</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              내 사이트 기술 스택 & 취약점 1초 정밀 진단
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              사이트의 <strong>개발 프로그램(피그마, 아임웹, 워드프레스 등)</strong>, <strong>구식 프레임셋 포워딩</strong>, <strong>SEO 검색 수집 취약점</strong>을 AI가 실시간으로 스캔하고 CreaiBox와의 1:1 비교 분석표를 도출합니다.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={(e) => void handleScan(e)} className="flex flex-col sm:flex-row gap-3 max-w-4xl">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="진단할 웹사이트 주소 입력 (예: http://futuremind.kr 또는 https://mybrand.com)"
                className="w-full rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-xs font-mono transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-7 py-3.5 text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-md shrink-0"
            >
              {isScanning ? <RefreshCw size={16} className="animate-spin" /> : <Activity size={16} />}
              <span>{isScanning ? "정밀 분석 중..." : "1초 AI 정밀 진단 시작"}</span>
            </button>
          </form>
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-medium">
              <span className="flex items-center gap-2">
                <ShieldAlert size={16} />
                {errorMsg}
              </span>
              <button onClick={() => setErrorMsg(null)} className="cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* --- 2. AUDIT REPORT VIEW (WHEN SCANNED) --- */}
        {currentReport && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Overall Grade Card */}
              <div className="md:col-span-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">종합 건강 등급</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {currentReport.normalizedDomain}
                  </span>
                </div>

                <div className="flex items-center gap-5 my-2">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg border-2 ${getGradeColor(currentReport.overallGrade)}`}>
                    {currentReport.overallGrade}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      종합 {currentReport.avgScore}점 / 100점
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      {currentReport.overallGrade === "S" || currentReport.overallGrade === "A"
                        ? "매우 우수한 모던 웹사이트입니다."
                        : currentReport.overallGrade === "B"
                        ? "표준 수준이나 개선할 점이 존재합니다."
                        : "구식 아키텍처 및 SEO 개선이 시급합니다."}
                    </p>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-zinc-400 font-medium">검색엔진 SEO 점수</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentReport.seoScore}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentReport.seoScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-zinc-400 font-medium">보안 & 도메인 신뢰도</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentReport.securityScore}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${currentReport.securityScore}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-zinc-400 font-medium">성능 & 모바일 반응형</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{currentReport.performanceScore}점</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${currentReport.performanceScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack & Architecture Card */}
              <div className="md:col-span-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCode2 size={16} className="text-cyan-500" />
                    <span>개발 프로그램 & 인프라 아키텍처 진단 결과</span>
                  </h3>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                    {currentReport.detectedEngine}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">도메인 포워딩 방식</span>
                    <div className="flex items-center gap-2">
                      {currentReport.isFrameset ? (
                        <>
                          <ShieldAlert className="text-rose-500" size={16} />
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            고정 프레임셋 (아이프레임 껍데기)
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="text-emerald-500" size={16} />
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            정상 도메인 라우팅
                          </span>
                        </>
                      )}
                    </div>
                    {currentReport.isFrameset && currentReport.frameSrc && (
                      <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                        실제 내부 주소: {currentReport.frameSrc}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 block">SSL 보안 인증서 (HTTPS)</span>
                    <div className="flex items-center gap-2">
                      {currentReport.hasSsl ? (
                        <>
                          <Lock className="text-emerald-500" size={15} />
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            HTTPS 보안 프로토콜 적용됨
                          </span>
                        </>
                      ) : (
                        <>
                          <Unlock className="text-rose-500" size={15} />
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            HTTP 미보안 (주의 요함)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                      {currentReport.title || "타이틀 정보 없음"}
                    </p>
                  </div>
                </div>

                {/* Issues Highlights */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    발견된 취약점 ({currentReport.issues.length}건):
                  </span>
                  <div className="space-y-1.5">
                    {currentReport.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          issue.type === "critical"
                            ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300"
                            : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {issue.type === "critical" ? (
                          <ShieldAlert size={15} className="text-rose-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5">
                          <strong className="font-bold">{issue.title}</strong>
                          <p className="text-[11px] opacity-90 leading-relaxed">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- 2.5. ESSENTIAL SETTINGS CHECKLIST SECTION --- */}
            {currentReport.essentialSettings && currentReport.essentialSettings.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers size={18} className="text-cyan-500" />
                      <span>웹사이트 기본 필수 세팅 점검 (8대 체크리스트)</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      파비콘, 모바일 뷰포트, UTF-8 인코딩, 카카오톡 썸네일 등 사이트 런칭 시 반드시 갖춰야 할 기본기입니다.
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 shrink-0 self-start sm:self-auto">
                    통과율: {currentReport.essentialSettings.filter((s) => s.passed).length} / {currentReport.essentialSettings.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {currentReport.essentialSettings.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                        item.passed
                          ? "bg-slate-50/60 dark:bg-zinc-950/40 border-slate-200/80 dark:border-zinc-800"
                          : item.severity === "critical"
                          ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                          : "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </span>
                        {item.passed ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">
                            <CheckCircle2 size={11} /> 통과
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                              item.severity === "critical"
                                ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                                : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                            }`}
                          >
                            <AlertTriangle size={11} /> 미흡
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="text-[11px] font-mono text-slate-600 dark:text-zinc-300 font-semibold truncate">
                          {item.currentValue}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight">
                          💡 {item.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- 3. 1:1 COMPARISON TABLE (TARGET VS CREAIBOX) --- */}
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden shadow-xs space-y-0">
              <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-900/70">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-cyan-500" />
                    <span>현재 사이트 vs CreaiBox 초격차 1:1 비교 분석표</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    CreaiBox로 현대화 이관 시 해결되는 아키텍처 및 마케팅 효과를 비교해 드립니다.
                  </p>
                </div>

                {currentReport.isCreaiBoxSite ? (
                  <Link
                    href="/studio/client-site-builder/settings"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-md shrink-0"
                  >
                    <CheckCircle2 size={14} />
                    <span>CreaiBox 정식 라이브 사이트 관리하기</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href={`/studio/custom-client-site/migration?url=${encodeURIComponent(currentReport.targetUrl)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all shadow-md shrink-0"
                  >
                    <Sparkles size={14} />
                    <span>이 사이트 0.01초 CreaiBox로 이관하기</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/60 dark:bg-zinc-900/90 text-slate-600 dark:text-zinc-300 font-bold">
                      <th className="p-4 sm:px-6 w-[180px]">진단 비교 항목</th>
                      <th className="p-4 sm:px-6 w-[300px]">현재 대상 사이트 상태</th>
                      <th className="p-4 sm:px-6 w-[340px] text-cyan-600 dark:text-cyan-400">CreaiBox 현대화 전환 후</th>
                      <th className="p-4 sm:px-6">기대 효과 & 비즈니스 혜택</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {currentReport.comparisonTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                          {row.feature}
                        </td>
                        <td className="p-4 sm:px-6 font-medium">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              row.targetBadge === "bad"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                                : row.targetBadge === "warning"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {row.targetStatus}
                          </span>
                        </td>
                        <td className="p-4 sm:px-6 font-bold text-cyan-700 dark:text-cyan-300">
                          {row.creaiboxStatus}
                        </td>
                        <td className="p-4 sm:px-6 text-slate-600 dark:text-zinc-300">
                          {row.benefit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- 4. AUDIT HISTORY LIST (FROM DB) --- */}
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-xs space-y-0">
          <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <History size={16} className="text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                나의 AI 사이트 정밀 진단 히스토리 아카이브 ({historyList.length}건)
              </h3>
            </div>
            {currentUser && (
              <button
                onClick={() => void fetchHistory()}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={historyLoading ? "animate-spin" : ""} />
                <span>새로고침</span>
              </button>
            )}
          </div>

          {!currentUser ? (
            <div className="p-10 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-3">
              <Activity className="mx-auto text-slate-300 dark:text-zinc-700" size={32} />
              <p className="font-semibold text-slate-700 dark:text-zinc-300">
                로그인하시면 모든 진단 보고서가 DB에 영구 보관되어 언제든 다시 열람하실 수 있습니다.
              </p>
              <Link
                href="/login?redirect=/studio/site-audit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity"
              >
                로그인 하러 가기
              </Link>
            </div>
          ) : historyList.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
              <Activity className="mx-auto text-slate-300 dark:text-zinc-700" size={28} />
              <p>아직 저장된 진단 이력이 없습니다.</p>
              <p className="text-[11px]">상단 검색창에 URL을 입력하여 1초 정밀 스캔을 실행해보세요.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentReport(item);
                    setUrlInput(item.targetUrl);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black border ${getGradeColor(item.overallGrade)} shrink-0 group-hover:scale-105 transition-transform`}>
                      {item.overallGrade}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                          {item.normalizedDomain}
                        </strong>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                          {item.detectedEngine}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-md">
                        {item.title || item.targetUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-xs font-bold text-slate-700 dark:text-zinc-200 transition-all"
                    >
                      보고서 보기
                    </button>
                    {item.id && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHistory(item.id!, item.normalizedDomain);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="기록 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
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
