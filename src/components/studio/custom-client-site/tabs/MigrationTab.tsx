import React, { useState } from "react";
import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp, Video, ShieldCheck, Award, HelpCircle, Trash2 } from "lucide-react";

interface MigrationTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function MigrationTab({ requireAuth }: MigrationTabProps) {
  const [migrationUrl, setMigrationUrl] = useState("");
  const [migrationDepth, setMigrationDepth] = useState<"main" | "main_submenu" | "full" | "massive">("main");
  const [migrationMode, setMigrationMode] = useState<"clone" | "recreate">("clone");
  const [isAiAutoMode, setIsAiAutoMode] = useState(true);
  const [newBrandName, setNewBrandName] = useState("");
  const [businessTone, setBusinessTone] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [massiveProgress, setMassiveProgress] = useState<{ total: number; current: number } | null>(null);
  const [progressText, setProgressText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanReport, setScanReport] = useState<any | null>(null);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [migratedHistory, setMigratedHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [expandedMigrationFaq, setExpandedMigrationFaq] = useState<number | null>(0);
  
  // 🌟 Promote Domain & 2-Step Deployment States
  const [promoteModalSite, setPromoteModalSite] = useState<any | null>(null);
  const [promoteInputSlug, setPromoteInputSlug] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState("");
  const [promoteConflictData, setPromoteConflictData] = useState<any | null>(null);
  const [promoteSuccessMsg, setPromoteSuccessMsg] = useState("");

  const openPromoteModal = (site: any) => {
    setPromoteModalSite(site);
    const initialSlug = site.extra_configs?.target_slug || site.brand_id.split("-")[0] || site.brand_id;
    setPromoteInputSlug(initialSlug);
    setPromoteError("");
    setPromoteConflictData(null);
    setPromoteSuccessMsg("");
  };

  const handlePromoteDomain = async (action: "check" | "promote" | "swap" = "promote") => {
    if (!promoteModalSite || !promoteInputSlug.trim()) return;
    setIsPromoting(true);
    setPromoteError("");
    setPromoteSuccessMsg("");

    try {
      const res = await fetch("/api/studio/custom-client-site/promote-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: promoteModalSite.id,
          newSlug: promoteInputSlug,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "OWNED_BY_ME_CONFLICT") {
          setPromoteConflictData(data);
        } else {
          setPromoteError(data.error || "도메인 변경 중 오류가 발생했습니다.");
        }
        return;
      }

      // Success
      setPromoteSuccessMsg(data.message || "정식 라이브 배포가 완료되었습니다!");
      setPromoteConflictData(null);
      fetchHistory();
      setTimeout(() => {
        setPromoteModalSite(null);
      }, 1500);
    } catch (err: any) {
      setPromoteError(err.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setIsPromoting(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch("/api/studio/site-migration/history?source=migration");
      const data = await res.json();
      if (data.success) {
        setMigratedHistory(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    const isAnyMigrating = migratedHistory.some((site: any) => site.extra_configs?.migration_status === "migrating");
    
    if (isAnyMigrating) {
      interval = setInterval(() => {
        fetchHistory();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [migratedHistory]);

  const deleteHistory = async (siteId: string) => {
    if (!confirm("정말로 이 이관된 사이트를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) return;
    try {
      const res = await fetch("/api/studio/site-migration/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      if (res.ok) {
        fetchHistory();
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    } catch (e) {
      alert("삭제 중 서버 오류가 발생했습니다.");
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMigrating) {
      const messages = [
        "대상 웹사이트 DOM 분석 중...",
        "텍스트 및 핵심 이미지 에셋 추출 중...",
        "Gemini 3.7 Flash: 시맨틱 레이아웃 분리 중...",
        "CreaiBox Dynamic Component 매핑 중...",
        "DB 적재 및 최종 최적화 중..."
      ];
      let i = 0;
      setProgressText(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setProgressText(messages[i]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isMigrating]);

  const handleSiteScan = async () => {
    if (!requireAuth()) return;
    if (!migrationUrl.trim()) return;

    setIsScanning(true);
    setScanReport(null);
    try {
      const res = await fetch("/api/studio/site-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: migrationUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScanReport(data.data);
      } else {
        alert(data.error || "스캔에 실패했습니다.");
      }
    } catch (e) {
      alert("스캔 중 서버 오류가 발생했습니다.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSiteMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!migrationUrl.trim()) return;

    setIsMigrating(true);
    setMassiveProgress(null);
    try {
      const res = await fetch("/api/studio/site-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetUrl: migrationUrl, 
          depth: migrationDepth, 
          scanReport: scanReport,
          mode: migrationMode,
          isAiAutoMode: migrationMode === "recreate" ? isAiAutoMode : undefined,
          newBrandName: migrationMode === "recreate" && !isAiAutoMode ? newBrandName : undefined,
          businessTone: migrationMode === "recreate" && !isAiAutoMode ? businessTone : undefined
        }),
      });
      const data = await res.json().catch(() => ({ error: `서버 응답 오류 (HTTP ${res.status})` }));

      if (res.ok && data?.success) {
        if (data.data?.pendingSubpages && data.data.pendingSubpages.length > 0) {
           const subpages = data.data.pendingSubpages as string[];
           const siteId = data.data.siteId;
           const targetOrigin = data.data.targetOrigin;
           
           setMassiveProgress({ total: subpages.length, current: 0 });
           
           // Process in chunks of 5
           const CHUNK_SIZE = 5;
           for (let i = 0; i < subpages.length; i += CHUNK_SIZE) {
              const chunk = subpages.slice(i, i + CHUNK_SIZE);
              
              try {
                await fetch("/api/studio/site-migration/crawl-subpages", {
                   method: "POST",
                   headers: { "Content-Type": "application/json" },
                   body: JSON.stringify({ siteId, targetOrigin, links: chunk })
                });
              } catch(e) {
                 console.error("Chunk failed", e);
              }
              
              setMassiveProgress(prev => prev ? { ...prev, current: Math.min(prev.total, prev.current + chunk.length) } : null);
           }
        }
        setMigrationResult(data.data);
        fetchHistory(); // Refresh history list
      } else {
        alert(data?.error || `홈페이지 이관에 실패했습니다. (코드: ${res.status})`);
      }
    } catch (err: any) {
      alert(`홈페이지 AI 이관 중 오류가 발생했습니다: ${err?.message || "네트워크 상태 확인"}`);
    } finally {
      setIsMigrating(false);
      setMassiveProgress(null);
    }
  };

  const getSubdomainUrl = (subdomain: string) => {
    if (typeof window === "undefined") return `http://${subdomain}.localhost:3000`;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol || "http:";
    
    if (hostname.includes("localhost") || hostname === "127.0.0.1") {
      return `${protocol}//${subdomain}.localhost${port}`;
    }
    return `https://${subdomain}.creaibox.com`;
  };

  return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                AI Full-Automated Site Migration & Recreation Engine
              </span>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Globe className="text-indigo-400" /> 타겟 홈페이지 URL 기반 AI 정밀 이관 및 벤치마킹 창조
              </h2>
              <p className="text-xs font-medium text-slate-300 max-w-3xl leading-relaxed">
                URL을 입력하면 Gemini 3.7 Flash 엔진이 사이트 구조를 심층 분석하여 원본 그대로 자동 이관하거나(마이그레이션), 텍스트/이미지를 새로 창작하여 저작권 걱정 없는 새로운 웹사이트를 창조(벤치마킹 창조)합니다.
              </p>
            </div>

            <form onSubmit={handleSiteMigration} className="space-y-4">
              {/* Mode Selection */}
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMigrationMode("clone")}
                  className={`flex-1 py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${migrationMode === "clone" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >
                  🔄 원본 그대로 이관 (마이그레이션)
                </button>
                <button
                  type="button"
                  onClick={() => setMigrationMode("recreate")}
                  className={`flex-1 py-3 text-sm font-black rounded-xl transition-all cursor-pointer ${migrationMode === "recreate" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >
                  ✨ AI 벤치마킹 창조 (저작권 프리)
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={migrationUrl}
                    onChange={(e) => setMigrationUrl(e.target.value)}
                    placeholder="이관할 기존 홈페이지 주소 입력 (예: my-hospital.co.kr)"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none shadow-inner"
                  />
                </div>
                
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-2xl px-2 h-[54px]">
                  <select
                    value={migrationDepth}
                    onChange={(e) => setMigrationDepth(e.target.value as "main" | "main_submenu" | "full" | "massive")}
                    className="bg-transparent text-sm font-bold text-white pl-2 pr-8 py-2 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="main">0. 메인 페이지 이관 (원페이지(1-Page) 스크롤링 웹사이트)</option>
                    <option value="main_submenu">1. 메인 페이지 스크롤링 웹사이트 (헤더메뉴 + 서브 2차 메뉴 복제)</option>
                    <option value="full">2. 전체 페이지 이관 (메인+서브페이지 총 15페이지 미만)</option>
                    <option value="massive">3. 전체 페이지 이관 (메인+서브페이지 총 100개 미만)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSiteScan}
                    disabled={isScanning || isMigrating}
                    className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-sm font-black text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap min-w-[160px]"
                  >
                    {isScanning ? <RefreshCw size={18} className="animate-spin text-slate-400" /> : <Layers size={18} className="text-slate-400" />}
                    <span>{isScanning ? "스캔 중..." : "🔍 정밀 스캔"}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isMigrating}
                    className={`rounded-2xl px-6 py-4 text-sm font-black text-white hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap min-w-[200px] ${migrationMode === "recreate" ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-600/30" : "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-600/30"}`}
                  >
                    {isMigrating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                    <span>{massiveProgress ? `서브페이지 이관 중... ${massiveProgress.current} / ${massiveProgress.total}` : (isMigrating ? progressText : (migrationMode === "recreate" ? "✨ AI 벤치마킹 창조 시작" : "AI 에이전트 정밀 이관 시작"))}</span>
                  </button>
                </div>
              </div>

              {/* Recreate Mode Inputs */}
              {migrationMode === "recreate" && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4 animate-fade-in-up mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/10 pb-3">
                    <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
                      <Sparkles size={16} /> 벤치마킹 기반 새 웹사이트 창조
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAiAutoMode} 
                        onChange={(e) => setIsAiAutoMode(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-300">AI 알아서 자동 창조 (Auto)</span>
                    </label>
                  </div>
                  
                  {!isAiAutoMode && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        placeholder="새로 런칭할 브랜드/회사명"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={businessTone}
                        onChange={(e) => setBusinessTone(e.target.value)}
                        placeholder="업종 및 원하는 톤앤매너 (예: 모던한 치과)"
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                  <p className="text-xs text-slate-400 font-medium">
                    타겟 사이트의 레이아웃 구조와 Vibe만 추출하며, 원본 텍스트 및 이미지는 전혀 복사되지 않고 AI가 100% 새롭게 창작합니다. 저작권 면책 동의가 필요 없는 완전한 신규 창조 모드입니다.
                  </p>
                </div>
              )}

              {/* Scan Report Dashboard */}
              {scanReport && (
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md shadow-xl mt-4 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-black text-indigo-400 flex items-center gap-2">
                      <Sparkles size={16} /> 타겟 사이트 정밀 스캔 결과
                    </h3>
                    <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-full font-bold">{new Date(scanReport.scanned_at).toLocaleTimeString()} 스캔됨</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">총 페이지 수</span>
                      <span className="text-lg font-black text-white">{scanReport.total_pages}장</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">총 텍스트 볼륨</span>
                      <span className="text-lg font-black text-white">{scanReport.char_count.toLocaleString()}자</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">미디어 에셋</span>
                      <span className="text-lg font-black text-white">{scanReport.image_count + scanReport.video_count}개</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">사용 언어</span>
                      <span className="text-sm font-black text-emerald-400 mt-1">{scanReport.language}</span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-xl border border-slate-800/50 col-span-2 md:col-span-1 lg:col-span-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">웹사이트 톤앤매너</span>
                      <span className="text-sm font-black text-amber-400 mt-1 truncate">{scanReport.tone_and_manner}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-indigo-400" /> 
                      <span>이 사이트를 지금 이관할 경우 예상되는 AI 렌더링 소요 시간은 <strong>{scanReport.estimated_time_string}</strong> 입니다.</span>
                    </div>
                    <ArrowRight size={14} className="text-indigo-400 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Copyright & Safe Draft Info */}
              {migrationMode === "clone" && (
                <div className="space-y-2 pt-2 border-t border-slate-800/60 mt-4 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    id="site-terms-check"
                    defaultChecked
                    required
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="site-terms-check" className="cursor-pointer">
                    본인 소유 또는 정당한 권한을 위임받은 웹사이트 콘텐츠임을 확인하며, 타인 저작권 도용 시 모든 법적 책임은 신청자 본인에게 있음을 동의합니다. (필수)
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium leading-relaxed space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={16} className="text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">🔒 100% 비공개 초안(Draft) & 검색엔진 노출 완전 차단</span>:<br />
                      이관 직후 생성되는 모든 웹사이트는 <span className="font-bold text-amber-300">비공개 초안(Draft) 모드</span>로 안전하게 보관되며, 구글·네이버 등 <span className="font-bold text-amber-300">검색엔진 로봇 수집(noindex)이 100% 원천 차단</span>됩니다. 오직 고유 미리보기 주소(링크)를 직접 클릭해야만 접속할 수 있어 기존 운영 중인 원본 사이트에 아무런 영향을 주지 않습니다.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-indigo-500/15">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">🚀 정식 라이브 배포 및 도메인 연결</span>:<br />
                      미리보기로 디자인과 구조를 충분히 검토하신 후, 언제든 <span className="font-bold text-emerald-400">'정식 배포 / 도메인 지정'</span> 버튼을 통해 내 소유의 커스텀 도메인(예: mysite.com)을 연결하고 정식 라이브(검색 노출)로 전환하실 수 있습니다.
                    </div>
                  </div>
                  </div>
                </div>
              )}
            </form>

            {/* Migration History List Display */}
            {(migratedHistory.length > 0 || isLoadingHistory) && (
              <div className="rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4 text-xs font-medium animate-fade-in-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                    <CheckCircle2 size={16} /> 나의 홈페이지 AI 이관 히스토리
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    {isLoadingHistory && <RefreshCw size={12} className="animate-spin text-indigo-400" />}
                    총 {migratedHistory.length}개 사이트 보관 중
                  </span>
                </div>

                <div className="space-y-3">
                  {migratedHistory.map((site: any) => {
                    const isSiteMigrating = site.extra_configs?.migration_status === "migrating";
                    const isPublished = site.status === "PUBLISHED";
                    const isDraft = !isPublished;
                    const queueLength = site.extra_configs?.migration_queue?.length || 0;
                    const totalCount = site.extra_configs?.migration_total_count || (queueLength > 0 ? queueLength : 1);
                    const completedCount = totalCount - queueLength;
                    const percentage = Math.round((completedCount / totalCount) * 100);
                    const estimatedSeconds = queueLength * 35; // 35 sec per subpage avg
                    const estimatedTime = estimatedSeconds > 60 ? `${Math.floor(estimatedSeconds/60)}분 ${estimatedSeconds%60}초` : `${estimatedSeconds}초`;
                    
                    return (
                    <div key={site.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row justify-between gap-4 hover:border-indigo-500/30 transition-colors relative overflow-hidden">
                      {isSiteMigrating && (
                        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-in-out" style={{ width: `${percentage}%` }} />
                      )}
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                            isSiteMigrating 
                              ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
                              : isPublished 
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                              : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          }`}>
                            {isSiteMigrating ? "무인 이관 중 ⏳" : (isPublished ? "라이브 🟢" : "초안 / 미리보기(비공개) 🟡")}
                          </span>
                          <h4 className="text-sm font-black text-white">{site.company_name}</h4>
                        </div>
                        <a
                          href={getSubdomainUrl(site.brand_id)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 font-bold text-sm underline flex items-center gap-1 hover:text-indigo-300 w-fit"
                        >
                          https://{site.brand_id}.creaibox.com <ExternalLink size={12} />
                        </a>
                        
                        {isSiteMigrating && (
                          <div className="mt-3 pt-3 border-t border-slate-800/60">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-indigo-300 font-bold">서브페이지 정밀 병합 중... ({completedCount}/{totalCount})</span>
                              <span className="text-indigo-400 font-black">{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="text-[10px] text-slate-500">예상 남은 시간: {estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right space-y-1 hidden sm:block">
                          <span className="text-[10px] text-slate-500 block">이관 생성 일시</span>
                          <span className="text-xs text-slate-300 font-mono block">
                            {new Date(site.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                          </span>
                        </div>

                        {/* Promote / Change Domain Button */}
                        <button
                          onClick={() => openPromoteModal(site)}
                          className={`h-9 px-3.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-md ${
                            isPublished
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white shadow-indigo-500/20'
                          }`}
                        >
                          {isPublished ? "🏷️ 도메인 변경" : "🚀 정식 배포 / 도메인 지정"}
                        </button>

                        <button
                          onClick={() => deleteHistory(site.id)}
                          className="h-9 px-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1 font-bold text-xs shrink-0 cursor-pointer"
                        >
                          <Trash2 size={14} /> 삭제
                        </button>
                      </div>
                    </div>
                  )})}
                  
                  {migratedHistory.length === 0 && !isLoadingHistory && (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      아직 이관된 홈페이지 히스토리가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 🌟 2-Step Domain Promotion & Production Deployment Modal */}
          {promoteModalSite && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div 
                className="w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Title */}
                <div className="space-y-1.5">
                  <span className="text-xs font-black text-indigo-400 tracking-wider uppercase block">
                    {promoteModalSite.status === "PUBLISHED" ? "DOMAIN MANAGEMENT" : "2-STEP PRODUCTION DEPLOYMENT"}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    🚀 {promoteModalSite.status === "PUBLISHED" ? "도메인 슬러그 변경" : "정식 라이브 배포 & 도메인 지정"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    임시 프리뷰 주소를 원하는 정식 브랜드 서브도메인(예: <code className="text-indigo-300 font-mono">burgerking.creaibox.com</code>)으로 승격하고 전 세계에 정식 라이브 배포합니다.
                  </p>
                </div>

                {/* Current vs Target Domain Box */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="text-slate-500 font-bold">현재 임시 주소</span>
                    <span className="font-mono text-slate-300 font-bold">{promoteModalSite.brand_id}.creaibox.com</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-black text-slate-200 block">원하는 정식 도메인 주소</label>
                    <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 focus-within:border-indigo-500 px-3 py-2.5 transition-all">
                      <span className="text-xs font-mono text-slate-500 shrink-0">https://</span>
                      <input
                        type="text"
                        value={promoteInputSlug}
                        onChange={(e) => {
                          setPromoteInputSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                          setPromoteError("");
                          setPromoteConflictData(null);
                        }}
                        placeholder="burgerking"
                        className="bg-transparent text-sm font-mono font-black text-indigo-300 focus:outline-hidden px-1 flex-1 min-w-0"
                      />
                      <span className="text-xs font-mono text-indigo-400 font-bold shrink-0">.creaibox.com</span>
                    </div>
                  </div>
                </div>

                {/* Conflict Resolution Banner (My own previous site) */}
                {promoteConflictData && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3 animate-fade-in">
                    <div className="flex items-start gap-2 text-amber-300 font-bold">
                      <Sparkles size={16} className="shrink-0 mt-0.5" />
                      <div>
                        이전에 만드신 내 테스트 사이트(<strong>{promoteConflictData.conflictSiteName || promoteInputSlug}</strong>)가 이미 이 도메인을 쓰고 있습니다.
                      </div>
                    </div>
                    <p className="text-slate-300">
                      기존 사이트를 임시 주소로 자동 교체(스왑)하고, <strong>현재 사이트를 {promoteInputSlug}.creaibox.com의 정식 라이브 사이트로 승격</strong>하시겠습니까?
                    </p>
                    <button
                      type="button"
                      disabled={isPromoting}
                      onClick={() => handlePromoteDomain("swap")}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isPromoting ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      🔄 기존 사이트 주소 스왑 & 이 사이트로 최종 승격
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {promoteError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{promoteError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {promoteSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{promoteSuccessMsg}</span>
                  </div>
                )}

                {/* Security & SEO Protection Notice */}
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-300">🛡️ CreaiBox 안심 배포 시스템</div>
                  <div>• 시스템 예약어(<code className="text-slate-400">admin, api, login 등</code>) 및 타인 점유 도메인은 등록이 원천 차단됩니다.</div>
                  <div>• 정식 배포 승격 시에만 구글/네이버 검색엔진 색인(Ping)이 발송됩니다.</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isPromoting}
                    onClick={() => setPromoteModalSite(null)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    disabled={isPromoting || !promoteInputSlug.trim()}
                    onClick={() => handlePromoteDomain("promote")}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPromoting ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
                    <span>{promoteModalSite.status === "PUBLISHED" ? "도메인 변경 적용" : "정식 라이브 배포하기"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. AI Migration Live Stats Telemetry Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">누적 홈페이지 이관 성공</span>
              <div className="text-2xl font-black text-indigo-400 flex items-center gap-1.5">
                <span>1,280+</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">건</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">전국 식당, 병원, 법률사무소 AI 통째 전환 완료</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">평균 AI 이관 소요 시간</span>
              <div className="text-2xl font-black text-cyan-400 flex items-center gap-1.5">
                <span>0.78</span>
                <span className="text-xs text-cyan-300 font-bold">초</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">초고속 백엔드 무인 스크레이퍼 처리</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SEO 검색 지수 보존율</span>
              <div className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                <span>100.0%</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Title, Description, OG 태그 동기화</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">원고 관리함 동기화 건수</span>
              <div className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
                <span>45,200+</span>
                <span className="text-xs text-purple-300 font-bold">개</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">블로그 원고 관리함 자동 동기화</p>
            </div>
          </div>

          {/* 2. Dual Storage Architecture & Engine Features Grid */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="text-cyan-400" size={18} /> CreaiBox AI 이중 저장소 & 이관 엔진 핵심 특장점
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 홈페이지를 이관할 때 속도와 자산화를 완벽히 분리 처리합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Zap size={20} />
                </div>
                <h4 className="text-sm font-black text-white">⚡ 초고속 CDN 자산 보관</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  메인 비주얼, 로고, 헤더 페이지 고화질 이미지들을 Supabase CDN으로 0.00초급 전진 배치합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <FileText size={20} />
                </div>
                <h4 className="text-sm font-black text-white">✍️ 블로그 원고 자동 자산화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  기존 사이트의 블로그/소식 포스팅을 '블로그 원고 관리'함 & CreaiBox 클라우드 DB로 동기화합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Video size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🎬 비디오 플레이어 제자리 재생</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드가 100% 추출되어 본문에서 바로 재생됩니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🔍 SEO 메타 태그 100% 동기화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Title, Meta Description, OG 카톡 공유 카드 썸네일까지 구글/네이버 검색 지수를 보존합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Successful Migration Showcase Cards */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={18} /> 대표 홈페이지 AI 정밀 이관 완료 성공 사례
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  기존 타사 구형 웹사이트에서 CreaiBox 최신 모던 자사몰로 전환된 대표적인 실제 사례입니다.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                100% 라이브 가동 중 ⭕
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  company: "소통층의원",
                  oldDomain: "sotongcheum.co.kr",
                  newSubdomain: "sotongcheum.creaibox.com",
                  category: "병원 / 의원",
                  parsedPages: 6,
                  speed: "0.74초",
                  images: 14,
                },
                {
                  company: "아우라 메리노",
                  oldDomain: "auramerino.com",
                  newSubdomain: "auramerino.creaibox.com",
                  category: "의류 / 쇼핑몰",
                  parsedPages: 8,
                  speed: "35.8초",
                  images: 22,
                },
                {
                  company: "바로 법률사무소",
                  oldDomain: "baro-law.com",
                  newSubdomain: "baro-law.creaibox.com",
                  category: "법무 / 전문직",
                  parsedPages: 5,
                  speed: "0.69초",
                  images: 9,
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Zap size={12} /> {item.speed} 이관 완료
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{item.company}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">기존: {item.oldDomain}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>파싱된 메인/헤더 페이지</span>
                      <span className="font-bold text-white">{item.parsedPages}개 완료</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>이관된 이미지 자산</span>
                      <span className="font-bold text-white">{item.images}개 (CDN 저장)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                      <span>CreaiBox 라이브 주소</span>
                      <a
                        href={`http://${item.newSubdomain.split(".")[0]}.localhost:3000`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 font-bold underline flex items-center gap-0.5 hover:text-indigo-300"
                      >
                        {item.newSubdomain.split(".")[0]}.creaibox.com <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Migration Frequently Asked Questions FAQ Accordion */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="text-rose-400" size={18} /> 기존 홈페이지 AI 자동 이관 자주 묻는 질문 (FAQ)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 웹사이트 이관 시 자주 문의하시는 질문과 답변입니다.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  q: "이관 후 내 홈페이지 주소는 어떻게 생성되나요?",
                  a: "이관이 완료되면 즉시 https://000.creaibox.com 형태의 무상 서브도메인이 자동 생성됩니다. 또한 [도메인 조회 & 구매] 메뉴에서 사장님의 독자 도메인(mybrand.com / mybrand.kr)을 연결하실 수 있습니다.",
                },
                {
                  q: "기존 사이트의 블로그 포스팅이나 이미지는 어디로 저장되나요?",
                  a: "메인 페이지의 비주얼 자산은 초고속 CDN으로, 기존 블로그 글과 본문 이미지들은 [크리에이박스 블로그] -> [블로그 원고 관리]함과 CreaiBox 클라우드 DB로 자동 동기화 보관됩니다.",
                },
                {
                  q: "기존 구형 사이트의 네이버/구글 검색 순위가 영향받지 않나요?",
                  a: "기존 사이트를 닫고 완전히 옮겨오실 경우 Title Tag, Description 메타 태그가 100% 동일하게 이관되므로 검색 지수가 그대로 보존됩니다. 병행 유지 시에는 [커스텀 사이트 관리] -> [AI 모던 재구성] 버튼을 눌러 문장을 원클릭으로 재구성하시면 패널티 없이 완벽 노출됩니다.",
                },
                {
                  q: "유튜브 동영상이나 카카오TV 비디오도 같이 넘어오나요?",
                  a: "네! 기존 홈페이지 본문에 삽입되어 있던 유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드 코드(iframe)가 100% 파싱되어 CreaiBox 자사몰 본문에서 그대로 제자리 재생(In-place Playback)됩니다.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setExpandedMigrationFaq(expandedMigrationFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-200">Q. {faq.q}</span>
                    {expandedMigrationFaq === idx ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  {expandedMigrationFaq === idx && (
                    <div className="p-4 pt-0 text-xs font-medium text-slate-400 border-t border-slate-900 bg-slate-900/30 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}
