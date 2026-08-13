import React, { useState, useEffect } from "react";
import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp, Video, ShieldCheck, Award, HelpCircle, Trash2, LayoutTemplate, Coffee, Briefcase, ShoppingBag, PartyPopper, Clock } from "lucide-react";
import { SiNaver, SiTiktok, SiInstagram, SiFacebook } from "react-icons/si";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";

interface AiMagicBuilderTabProps {
  requireAuth: (action?: () => void) => boolean;
}



const VIBES = [
  { id: "auto", label: "🎯 AI 자동 분석 및 추천 (기본값)" },
  { id: "commerce", label: "🛍️ 깔끔한 쇼핑몰/커머스 (갤러리 및 상품 나열)" },
  { id: "dynamic", label: "🚀 트렌디한 스타트업 (벤토 그리드, 다이나믹 레이아웃)" },
  { id: "portfolio", label: "✨ 개인 브랜딩/포트폴리오 (모자이크 갤러리)" },
  { id: "professional", label: "👔 전문적인 기업/비즈니스 (신뢰감, 2단 분할)" },
  { id: "warm", label: "☕ 감성적이고 따뜻한 (카페/공방, 웜톤 베이지)" },
  { id: "modern", label: "🏢 모던하고 세련된 (무채색, 미니멀리즘)" },
];

export default function AiMagicBuilderTab({ requireAuth }: AiMagicBuilderTabProps) {
  const [refType, setRefType] = useState<"none" | "text" | "pdf">("none");
  const [refText, setRefText] = useState("");
  const [refFile, setRefFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<string[]>(["", "", ""]); // 멀티 URL 입력 지원
  const [vibe, setVibe] = useState("auto");
  const [themeId, setThemeId] = useState("ai-auto");

  // Legal Modal
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [isBuilding, setIsBuilding] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [migratedHistory, setMigratedHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const activePlaceholder = "예) https://blog.naver.com/my_id";
  const templates = Object.values(TEMPLATE_REGISTRY);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setRefFile(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
        e.target.value = "";
      }
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch("/api/studio/site-migration/history?source=sns_builder");
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

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteHistory = async (siteId: string) => {
    if (!confirm("정말로 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) return;
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBuilding) {
      const messages = [
        "입력하신 SNS 채널 딥-스크래핑 중...",
        "텍스트 문맥 분석 및 핵심 이미지 에셋 추출 중...",
        "Gemini 3.6 Flash: 브랜드 톤앤매너 및 비즈니스 카테고리 판별 중...",
        "AI 카피라이터가 웹사이트 구조화 및 스토리텔링 작성 중...",
        "최적의 CreAibox Dynamic Component 레이아웃 조립 중...",
        "DB 적재 및 최종 에셋 최적화 중..."
      ];
      let i = 0;
      setProgressText(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setProgressText(messages[i]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBuilding]);

  const handleStartClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    const validUrls = urls.filter(u => u.trim() !== "");
    const hasRefText = refType === "text" && refText.trim() !== "";
    const hasRefPdf = refType === "pdf" && refFile !== null;

    if (validUrls.length === 0 && !hasRefText && !hasRefPdf) {
      alert("최소 1개 이상의 사이트 주소를 입력하거나, 참조 자료(텍스트/PDF)를 첨부해주세요.");
      return;
    }
    // Open consent modal instead of submitting directly
    setAgreed(false);
    setShowLegalModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!agreed) return;
    setShowLegalModal(false);
    setIsBuilding(true);

    try {
      const validUrls = urls.filter(u => u.trim() !== "");
      const formData = new FormData();
      validUrls.forEach(url => formData.append("urls", url));
      formData.append("vibe", vibe);
      formData.append("themeId", themeId);
      formData.append("refType", refType);
      if (refType === "text") formData.append("refText", refText);
      if (refType === "pdf" && refFile) formData.append("refPdf", refFile);

      const res = await fetch("/api/studio/ai-magic-builder", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("✨ AI 홈페이지 매직 빌더 창작이 성공적으로 완료되었습니다!");
        fetchHistory();
        setUrls(["", "", ""]); setRefText(""); setRefFile(null); // Reset form
      } else {
        alert(data.error || "창작 중 오류가 발생했습니다.");
      }
    } catch (e) {
      alert("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsBuilding(false);
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
      {/* Main Builder Box */}
      <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            AI Magic Website Builder
          </span>
          <h2 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <Globe className="text-indigo-400" size={24} />
            다중 URL 및 참조 자료 기반 AI 홈페이지 자동 창작
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
            가장 퀄리티가 좋은 비즈니스 SNS(인스타그램, 블로그 등) 계정 주소를 하나만 입력하세요. 
            Gemini 3.6 Flash 엔진이 포스팅 내용과 사진을 심층 분석하여 완벽한 구조의 홈페이지로 재탄생시킵니다.
          </p>
        </div>

        <form onSubmit={handleStartClick} className="space-y-5">
          {/* URL Input (Multi) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1. 다중 참조 주소 입력 (고정 3개)</label>
            </div>
            
            <div className="space-y-3">
              {urls.map((u, index) => (
                <div key={index} className="relative group flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Globe size={18} />
                    </div>
                    <input
                      type="url"
                      value={u}
                      onChange={(e) => {
                        const newUrls = [...urls];
                        newUrls[index] = e.target.value;
                        setUrls(newUrls);
                      }}
                      placeholder={index === 0 ? activePlaceholder : index === 1 ? "예) https://map.naver.com/..." : "예) https://instagram.com/..."}
                      className="block w-full rounded-2xl border border-slate-700 bg-slate-800/50 py-4 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      required={index === 0 && refType === "none"}
                    />
                  </div>
                  
                </div>
              ))}
            </div>
          </div>

          
          {/* Reference Input */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2. 참조 자료 첨부 (선택 사항)</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRefType(refType === "text" ? "none" : "text")}
                className={`p-4 rounded-2xl border text-left transition-all ${refType === "text" ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}
              >
                <FileText className={`w-5 h-5 mb-2 ${refType === "text" ? "text-blue-400" : "text-slate-500"}`} />
                <div className="text-sm font-bold text-white mb-1">텍스트 입력</div>
                <div className="text-xs text-slate-400 leading-relaxed">핵심 키워드나 원하는 내용을 직접 타이핑</div>
              </button>

              <button
                type="button"
                onClick={() => setRefType(refType === "pdf" ? "none" : "pdf")}
                className={`p-4 rounded-2xl border text-left transition-all ${refType === "pdf" ? "border-rose-500 bg-rose-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}
              >
                <Layers className={`w-5 h-5 mb-2 ${refType === "pdf" ? "text-rose-400" : "text-slate-500"}`} />
                <div className="text-sm font-bold text-white mb-1">PDF 파일</div>
                <div className="text-xs text-slate-400 leading-relaxed">보유 중인 소개서나 문서 업로드</div>
              </button>
            </div>

            {/* Dynamic Input Area */}
            <div className="mt-4">
              {refType === "text" && (
                <textarea
                  value={refText}
                  onChange={(e) => setRefText(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-4 text-white text-sm transition-colors outline-none resize-none"
                  placeholder="새 홈페이지에 들어가야 할 내용, 키워드, 인사말 등을 자유롭게 적어주세요."
                />
              )}

              {refType === "pdf" && (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Layers className="w-8 h-8 mb-3 text-slate-500" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-white">클릭하여 업로드</span> 하거나 파일을 끌어다 놓으세요.
                      </p>
                      <p className="text-xs text-slate-500">PDF 파일만 지원됩니다. {refFile && <span className="text-rose-400 block mt-1">선택된 파일: {refFile.name}</span>}</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Vibe and Theme Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 3. 브랜드 분위기 선택</label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {VIBES.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 4. 웹사이트 레이아웃 테마</label>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3.5 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="ai-auto">🤖 AI가 업종 분석 후 자동 매핑 (권장)</option>
                {templates.map((t) => (
                  <option key={t.templateId} value={t.templateId}>
                    [{t.category}] {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isBuilding}
              className={`flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-black shadow-lg transition-all ${
                isBuilding
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 active:scale-[0.98]"
              }`}
            >
              {isBuilding ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  AI 창작 엔진 가동 중...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  AI 에이전트 창작 시작
                </>
              )}
            </button>
          </div>
        </form>

        {isBuilding && (
          <div className="mt-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm font-medium text-indigo-300 animate-pulse text-center">
              {progressText}
            </p>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 px-2">
          <Clock size={16} />
          나의 창작 히스토리
        </h3>
        
        {isLoadingHistory ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="animate-spin text-slate-600" size={24} />
          </div>
        ) : migratedHistory.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center flex flex-col items-center justify-center gap-3">
            <Layers className="text-slate-700" size={32} />
            <p className="text-sm text-slate-500">아직 창작된 사이트가 없습니다. 첫 SNS 창작을 시작해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {migratedHistory.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 hover:bg-slate-800/80 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{item.title}</h4>
                  </div>
                  <a href={getSubdomainUrl(item.brand_id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 w-fit">
                    {getSubdomainUrl(item.brand_id)}
                    <ExternalLink size={12} />
                  </a>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 border-t border-slate-700/50 sm:border-0 pt-3 sm:pt-0">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteHistory(item.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legal Consent Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-slate-900 shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <ShieldCheck size={28} />
              <h3 className="text-xl font-black text-white">저작권 및 이용 동의</h3>
            </div>
            
            <div className="rounded-xl bg-slate-800 p-4 space-y-3 text-sm text-slate-300 leading-relaxed border border-slate-700">
              <p>본 서비스는 입력하신 URL의 공개된 데이터를 기반으로 웹사이트 구조를 AI가 재창작합니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>입력하신 URL은 **본인 소유이거나 합법적인 권한을 위임받은 계정**이어야 합니다.</li>
                <li>타인의 저작물(사진, 글 등)을 무단으로 크롤링하여 상업적으로 이용할 경우, 모든 법적 책임은 신청자 본인에게 있습니다.</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group pt-2">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${agreed ? "border-indigo-500 bg-indigo-500" : "border-slate-500"}`}>
                  <Check size={14} className={`text-white transition-all ${agreed ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
                </div>
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                [필수] 본인은 위 내용을 확인하였으며, 소유권 및 저작권에 문제가 없음에 동의합니다.
              </span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowLegalModal(false)}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-3.5 text-sm font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={!agreed}
                className={`flex-1 rounded-xl px-4 py-3.5 text-sm font-black text-white transition-all ${
                  agreed
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:brightness-110 active:scale-95"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                동의 및 창작 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
