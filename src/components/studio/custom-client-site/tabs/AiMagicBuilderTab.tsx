import React, { useState, useEffect } from "react";
import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp, Video, ShieldCheck, Award, HelpCircle, Trash2, LayoutTemplate, Coffee, Briefcase, ShoppingBag, PartyPopper, Clock } from "lucide-react";
import { SiNaver, SiTiktok, SiInstagram, SiFacebook } from "react-icons/si";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";

interface AiMagicBuilderTabProps {
  requireAuth: (action?: () => void) => boolean;
}



const VIBES_GROUPED = [
  {
    group: "추천",
    items: [{ id: "auto", label: "🎯 전체 AI 자동 분석 및 추천 (기본값)" }]
  },
  {
    group: "1. 🏢 미니멀 & 모던 계열 (디자인/건축/라이프스타일)",
    items: [
      { id: "modern_auto", label: "🎯 1. 미니멀 & 모던 계열 - AI 자동 분석 및 추천" },
      { id: "modern_clean", label: "🏢 모던하고 세련된 (무채색, 미니멀리즘, 여백의 미)" },
      { id: "modern_white", label: "🤍 클린 & 화이트 (완전한 화이트톤, 선과 폰트 위주 심플함)" },
      { id: "modern_grid", label: "📐 구조적 & 아키텍처 (격자형 꽉 찬 그리드, 스위스 디자인)" },
    ]
  },
  {
    group: "2. 👔 기업 & 전문성 계열 (B2B/금융/로펌/컨설팅)",
    items: [
      { id: "corp_auto", label: "🎯 2. 기업 & 전문성 계열 - AI 자동 분석 및 추천" },
      { id: "corp_trust", label: "👔 전문적인 기업/비즈니스 (신뢰감, 2단 분할, 네이비/블루)" },
      { id: "corp_heavy", label: "⚖️ 권위적이고 무게감 있는 (세리프(명조) 폰트, 진중한 컬러)" },
      { id: "corp_global", label: "🌐 글로벌 엔터프라이즈 (삼성/애플 스타일 대기업 룩)" },
    ]
  },
  {
    group: "3. 🚀 IT & 스타트업 계열 (SaaS/플랫폼/테크)",
    items: [
      { id: "tech_auto", label: "🎯 3. IT & 스타트업 계열 - AI 자동 분석 및 추천" },
      { id: "tech_startup", label: "🚀 트렌디한 스타트업 (벤토 그리드, 다이나믹 레이아웃)" },
      { id: "tech_future", label: "💻 테크 & 퓨처리스틱 (어두운 배경, 네온 포인트, 대시보드)" },
      { id: "tech_web3", label: "⚡ 빠르고 경쾌한 웹 3.0 (글래스모피즘, 반투명 효과, 역동적 애니메이션)" },
    ]
  },
  {
    group: "4. ☕ 감성 & 내추럴 계열 (카페/공방/병원/뷰티)",
    items: [
      { id: "warm_auto", label: "🎯 4. 감성 & 내추럴 계열 - AI 자동 분석 및 추천" },
      { id: "warm_cafe", label: "☕ 감성적이고 따뜻한 (웜톤 베이지, 둥글둥글한 폰트)" },
      { id: "warm_nature", label: "🌿 친환경 & 오가닉 (채도 낮은 어스톤, 인물/자연 사진 중심)" },
      { id: "warm_magazine", label: "📖 매거진 & 에세이 스타일 (텍스트 중심, 감성적인 넓은 여백)" },
    ]
  },
  {
    group: "5. ✨ 크리에이티브 & 개인 브랜딩 (에이전시/프리랜서)",
    items: [
      { id: "creative_auto", label: "🎯 5. 크리에이티브 & 개인 브랜딩 - AI 자동 분석 및 추천" },
      { id: "creative_portfolio", label: "✨ 개인 브랜딩/포트폴리오 (모자이크 갤러리, 얼굴/작업물 중심)" },
      { id: "creative_luxury", label: "🖤 다크 & 럭셔리 (블랙 배경, 골드/실버 포인트, 명품 쇼룸)" },
      { id: "creative_studio", label: "🎨 아트 스튜디오 (비대칭 레이아웃, 강렬한 색상 대비)" },
      { id: "creative_bold", label: "💥 볼드 & 브루탈리즘 (거대한 타이포, 원색, 파괴적 디자인)" },
    ]
  },
  {
    group: "6. 🛍️ 커머스 & 세일즈 계열 (쇼핑몰/랜딩페이지)",
    items: [
      { id: "commerce_auto", label: "🎯 6. 커머스 & 세일즈 계열 - AI 자동 분석 및 추천" },
      { id: "commerce_clean", label: "🛍️ 깔끔한 커머스 (갤러리/상품 나열, 전환율 최적화)" },
      { id: "commerce_high_end", label: "💎 하이엔드 쇼룸 (풀스크린 비주얼, 극단적 미니멀 UI)" },
      { id: "commerce_landing", label: "🎯 퍼포먼스 세일즈 (큰 행동유도 버튼, 가독성 극강 랜딩)" },
    ]
  }
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
        "Gemini 3.7 Flash: 브랜드 톤앤매너 및 비즈니스 카테고리 판별 중...",
        "AI 카피라이터가 웹사이트 구조화 및 스토리텔링 작성 중...",
        "최적의 CreaiBox Dynamic Component 레이아웃 조립 중...",
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
            Gemini 3.7 Flash 엔진이 포스팅 내용과 사진을 심층 분석하여 완벽한 구조의 홈페이지로 재탄생시킵니다.
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
                {VIBES_GROUPED.map((group, groupIdx) => (
                  group.group === "추천" ? (
                    group.items.map((v) => (
                      <option key={v.id} value={v.id} className="text-slate-200 bg-slate-800 font-medium">{v.label}</option>
                    ))
                  ) : (
                    <React.Fragment key={group.group}>
                      <option disabled className="font-bold text-slate-400 bg-slate-900 opacity-100">
                        {`[ ${group.group} ]`}
                      </option>
                      {group.items.map((v) => (
                        <option key={v.id} value={v.id} className="text-slate-300 bg-slate-800 font-normal">
                          &nbsp;&nbsp;{v.label}
                        </option>
                      ))}
                    </React.Fragment>
                  )
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
            {migratedHistory.map((item) => {
              const isPublished = item.status === "PUBLISHED";
              const isDraft = !isPublished;

              return (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 hover:bg-slate-800/80 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      isPublished 
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      {isPublished ? "라이브 🟢" : "초안 / 미리보기(비공개) 🟡"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{item.title || item.company_name}</h4>
                  </div>
                  <a href={getSubdomainUrl(item.brand_id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 w-fit">
                    {getSubdomainUrl(item.brand_id)}
                    <ExternalLink size={12} />
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:block">
                    {new Date(item.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                  </span>

                  {/* Promote Domain Button */}
                  <button
                    onClick={() => openPromoteModal(item)}
                    className={`h-8 px-3 rounded-lg text-xs font-black transition-all flex items-center gap-1 shrink-0 shadow-md ${
                      isPublished
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white shadow-indigo-500/20'
                    }`}
                  >
                    {isPublished ? "🏷️ 도메인 변경" : "🚀 정식 배포 / 도메인 지정"}
                  </button>

                  <button
                    onClick={() => deleteHistory(item.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* 🌟 2-Step Domain Promotion & Production Deployment Modal */}
      {promoteModalSite && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
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
                임시 프리뷰 주소를 원하는 정식 브랜드 서브도메인(예: <code className="text-indigo-300 font-mono">mybrand.creaibox.com</code>)으로 승격하고 전 세계에 정식 라이브 배포합니다.
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
                    placeholder="mybrand"
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
