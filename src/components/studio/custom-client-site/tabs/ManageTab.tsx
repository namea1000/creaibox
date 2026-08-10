import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, ExternalLink, FileText, TrendingUp, ArrowRight, CreditCard, ShieldCheck, Mail, Phone, MapPin, Building2, Pencil, Trash2, Plus, ListPlus, Flame, Tag, Save, CheckCircle2, RefreshCw, HelpCircle, Sparkles, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomMenuItem } from "@/constants/custom-client-site";
import { createClient } from "@/utils/supabase/client";

interface ManageTabProps {
  currentUser: any;
  requireAuth: (action?: () => void) => boolean;
}

export default function ManageTab({ currentUser, requireAuth }: ManageTabProps) {
  const supabase = createClient();
  const [companyName, setCompanyName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [brandVibe, setBrandVibe] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainKeyword, setMainKeyword] = useState<string>("");

          const [bizNumber, setBizNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [kakaoLink, setKakaoLink] = useState<string>("");
  
  const [headerBlogTitle, setHeaderBlogTitle] = useState<string>("");
  const [headerContactTitle, setHeaderContactTitle] = useState<string>("");
  const [heroSlogan, setHeroSlogan] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Dynamic Custom GNB Menus State (Sample structure for visual preview)
  const [customMenus, setCustomMenus] = useState<CustomMenuItem[]>([
    { id: "1", label: "홈 (Home)", url: "/" },
    { id: "2", label: "회사소개", url: "/about" },
    { id: "3", label: "주요 서비스", url: "/#services" },
    { id: "4", label: "실적/포트폴리오", url: "/#portfolio" },
    { id: "5", label: "공지/블로그", url: "/blog" },
    { id: "6", label: "온라인 견적 신청", url: "/contact", isRightAligned: true },
  ]);

  // PG Payment Gateway State
  const [pgProvider, setPgProvider] = useState<string>("portone");
  const [pgMid, setPgMid] = useState<string>("");
  const [pgApiKey, setPgApiKey] = useState<string>("");
  const [enableBankTransfer, setEnableBankTransfer] = useState<boolean>(true);
  const [bankAccountInfo, setBankAccountInfo] = useState<string>("");
  const [enableInquiryPayment, setEnableInquiryPayment] = useState<boolean>(true);

  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  const handleAddMenu = () => {
    if (!requireAuth()) return;
    const newId = String(Date.now());
    setCustomMenus((prev) => [
      ...prev,
      { id: newId, label: `새 메뉴 ${prev.length + 1}`, url: "#custom", isRightAligned: false },
    ]);
  };

  const handleUpdateMenu = (index: number, key: keyof CustomMenuItem, value: any) => {
    if (!requireAuth()) return;
    setCustomMenus((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDeleteMenu = (index: number) => {
    if (!requireAuth()) return;
    setCustomMenus((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Blog Category Customization State
  const [blogCategories, setBlogCategories] = useState<string[]>([
    "전체",
    "행사대행",
    "교육서비스",
    "가족캠프",
    "소통소식",
  ]);
  const [newBlogCategory, setNewBlogCategory] = useState<string>("");

  const handleAddBlogCategory = () => {
    if (!requireAuth()) return;
    if (!newBlogCategory.trim()) return;
    if (blogCategories.includes(newBlogCategory.trim())) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    setBlogCategories((prev) => [...prev, newBlogCategory.trim()]);
    setNewBlogCategory("");
  };

  const handleDeleteBlogCategory = (catToDelete: string) => {
    if (!requireAuth()) return;
    if (catToDelete === "전체") {
      alert("'전체' 카테고리는 기본 선택값이므로 삭제할 수 없습니다.");
      return;
    }
    setBlogCategories((prev) => prev.filter((c) => c !== catToDelete));
  };

  const handleMoveBlogCategory = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index <= 1) return;
    if (direction === "right" && index >= blogCategories.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex <= 0) return;

    setBlogCategories((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  // Blog Category Edit State & Handlers
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryText, setEditingCategoryText] = useState<string>("");

  const handleStartEditCategory = (index: number, currentName: string) => {
    setEditingCategoryIndex(index);
    setEditingCategoryText(currentName);
  };

  const handleSaveEditCategory = (index: number) => {
    if (!editingCategoryText.trim()) {
      alert("카테고리 이름을 입력해 주세요.");
      return;
    }
    const trimmed = editingCategoryText.trim();
    if (blogCategories.some((c, i) => i !== index && c === trimmed)) {
      alert("이미 존재하는 카테고리 이름입니다.");
      return;
    }

    setBlogCategories((prev) => {
      const next = [...prev];
      next[index] = trimmed;
      return next;
    });
    setEditingCategoryIndex(null);
    setEditingCategoryText("");
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryIndex(null);
    setEditingCategoryText("");
  };

  // Request Form State
    const [reqConcept, setReqConcept] = useState<string>("딥 블루 & 세련되고 신뢰감 있는 브랜드 다크 톤");
  const [reqHeaderMenus, setReqHeaderMenus] = useState<string[]>([
    "홈 (Home)",
    "회사소개 / 브랜드 스토리",
    "주요 서비스 / 포트폴리오",
    "실적 갤러리 & 성공 사례",
    "온라인 견적 / 예약 신청",
    "Blog (공식 블로그)",
    "Contact & 1:1 상담",
  ]);
  const [reqFeatures, setReqFeatures] = useState<string[]>([
    "실적/포트폴리오 갤러리 탭",
    "실시간 온라인 견적신청 폼",
    "전용 블로그 & 조회수 카운터",
    "DoFollow SEO 백링크 가산점 엔진",
  ]);

  // Auth & DB Extra Option State
  const [enableAuthDb, setEnableAuthDb] = useState<boolean>(false);
  const [reqAuthMethods, setReqAuthMethods] = useState<string[]>([
    "카카오 1초 소셜 로그인 (Kakao OAuth)",
    "일반 이메일 & 비밀번호 회원가입",
  ]);
  const [reqAuthFeatures, setReqAuthFeatures] = useState<string[]>([
    "회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)",
  ]);
  const [reqRefUrl, setReqRefUrl] = useState<string>("");
    const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);
  

  // Load Config on Mount
  useEffect(() => {
    async function loadConfig() {
      const { data: { user } } = await supabase.auth.getUser();
      // setCurrentUser(user);
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs, brand_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.extra_configs) {
        const cfg = profile.extra_configs as Record<string, any>;
        if (cfg.companyName) setCompanyName(cfg.companyName);
        if (cfg.phone) setPhone(cfg.phone);
        if (cfg.address) setAddress(cfg.address);
        if (cfg.email) setEmail(cfg.email);
        if (cfg.bizNumber) setBizNumber(cfg.bizNumber);
        if (cfg.description) setDescription(cfg.description);
        if (cfg.kakaoLink) setKakaoLink(cfg.kakaoLink);
        if (cfg.themeColor) setThemeColor(cfg.themeColor);
        if (cfg.headerBlogTitle) setHeaderBlogTitle(cfg.headerBlogTitle);
        if (cfg.headerContactTitle) setHeaderContactTitle(cfg.headerContactTitle);
        if (cfg.heroSlogan) setHeroSlogan(cfg.heroSlogan);
        if (cfg.logoUrl) setLogoUrl(cfg.logoUrl);
        if (cfg.customMenus && Array.isArray(cfg.customMenus)) setCustomMenus(cfg.customMenus);
        if (cfg.blog_categories && Array.isArray(cfg.blog_categories)) setBlogCategories(cfg.blog_categories);
        if (cfg.pgProvider) setPgProvider(cfg.pgProvider);
        if (cfg.pgMid) setPgMid(cfg.pgMid);
        if (cfg.pgApiKey) setPgApiKey(cfg.pgApiKey);
        if (typeof cfg.enableBankTransfer === "boolean") setEnableBankTransfer(cfg.enableBankTransfer);
        if (cfg.bankAccountInfo) setBankAccountInfo(cfg.bankAccountInfo);
        if (typeof cfg.enableInquiryPayment === "boolean") setEnableInquiryPayment(cfg.enableInquiryPayment);
      }
    }
    void loadConfig();
  }, [supabase]);

  // Handle Save Client Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setSaveSuccessMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSaveSuccessMsg("로그인이 필요한 서비스입니다.");
        setIsSavingConfig(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const existingCfg = (profile?.extra_configs as Record<string, unknown>) || {};
      const newCfg = {
        ...existingCfg,
        companyName,
        phone,
        address,
        email,
        bizNumber,
        description,
        kakaoLink,
        themeColor,
        headerBlogTitle,
        headerContactTitle,
        heroSlogan,
        logoUrl,
        customMenus,
        blog_categories: blogCategories,
        pgProvider,
        pgMid,
        pgApiKey,
        enableBankTransfer,
        bankAccountInfo,
        enableInquiryPayment,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update({ extra_configs: newCfg })
        .eq("id", user.id);

      if (error) throw error;

      // Broadcast update to shared server cache
      try {
        await fetch("/api/clients/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId: "sotongcheum", config: newCfg }),
        });
      } catch (e) {}

      setSaveSuccessMsg("✅ 커스텀 사이트 설정이 성공적으로 저장되었습니다! 홈페이지에 실시간 반영됩니다.");
    } catch (err: unknown) {
      console.error(err);
      setSaveSuccessMsg("⚠️ 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Column: Active Site Status & Quick Action */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Globe size={24} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> {currentUser ? "100% 정상 작동 중" : "CMS 스튜디오 실시간 편집기"}
                  </span>
                  <h3 className="text-lg font-black text-white">{companyName ? `${companyName} 공식 홈페이지` : "내 커스텀 홈페이지"}</h3>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">브랜드 ID</span>
                  <span className="font-mono text-cyan-300 font-bold">{companyName ? "sotongcheum" : "mybrand"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">연결 서브도메인</span>
                  <a
                    href="http://sotongcheum.localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {companyName ? "sotongcheum.creaibox.com" : "mybrand.creaibox.com"} <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SEO 백링크 엔진</span>
                  <span className="text-emerald-400 font-bold">DoFollow Active (Link Equity)</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                <a
                  href="http://sotongcheum.localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={14} className="text-cyan-400" /> 커스텀 홈페이지 접속하기
                  </span>
                  <ExternalLink size={14} />
                </a>

                <Link
                  href="/studio/writing/creaibox/new-post"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-blue-500 hover:text-blue-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-blue-400" /> 블로그 새 포스팅 작성
                  </span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/studio/writing/creaibox/blog-management"
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs font-bold text-slate-200 hover:border-purple-500 hover:text-purple-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-purple-400" /> 누적 조회수 & 통계 대시보드
                  </span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: 💳 PG 결제 게이트웨이 & 결제 수단 세팅 (Left Column Standalone Box) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
              <div className="space-y-1 border-b border-slate-800/80 pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <CreditCard size={12} />
                  <span>결제 수금 직접 입금 지원</span>
                </div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>💳 PG 결제 게이트웨이 & 결제 세팅</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  자사몰/커스텀 사이트에서 소비자의 결제금액을 직접 수금할 PG 상점 키 및 결제 수단을 설정하세요.
                </p>
              </div>

              {/* PG Provider Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300">주요 PG 결제 게이트웨이 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "portone", name: "포트원 (PortOne)" },
                    { id: "toss", name: "토스페이먼츠 (Toss)" },
                    { id: "kakaopay", name: "카카오페이 전용" },
                    { id: "none", name: "PG 결제 미사용" },
                  ].map((pg) => (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => setPgProvider(pg.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        pgProvider === pg.id
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-md"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {pg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* PG MID & API Key Inputs */}
              {pgProvider !== "none" && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">PG 상점 ID (MID)</label>
                    <input
                      type="text"
                      value={pgMid}
                      onChange={(e) => setPgMid(e.target.value)}
                      placeholder="예: imp_884920412491 또는 toss_mid_xxxx"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">API Client Key (공개키)</label>
                    <input
                      type="text"
                      value={pgApiKey}
                      onChange={(e) => setPgApiKey(e.target.value)}
                      placeholder="예: pk_live_creaibox_sample_key"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer & Online Quote Switches */}
              <div className="space-y-3">
                {/* Bank Transfer Info */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-200">🏦 무통장 입금 활성화</label>
                    <input
                      type="checkbox"
                      checked={enableBankTransfer}
                      onChange={(e) => setEnableBankTransfer(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  {enableBankTransfer && (
                    <input
                      type="text"
                      value={bankAccountInfo}
                      onChange={(e) => setBankAccountInfo(e.target.value)}
                      placeholder="예: 국민은행 123456-04-123456 (예금주: 홍길동)"
                      className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-amber-300 focus:border-emerald-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Online Quote Payment Switch */}
                <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-200">📄 실시간 견적서 결제 폼 활성화</label>
                    <input
                      type="checkbox"
                      checked={enableInquiryPayment}
                      onChange={(e) => setEnableInquiryPayment(e.target.checked)}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                    소비자가 온라인 견적서(PDF) 발행 후 바로 견적 금액 결제 및 예약을 진행할 수 있도록 견적 결제 폼을 활성화합니다.
                  </p>
                </div>
              </div>

              {/* PG Save Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingConfig ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>💳 PG 결제 설정 저장하기</span>
                </button>
              </div>

              {/* PG Merchant Signup Guide Links & Notice */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                  <HelpCircle size={13} className="text-cyan-400" />
                  <span>PG 가맹점 미신청 상태이신가요? (1초 가입 센터)</span>
                </p>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                  아래 공식 PG사 포털에서 가맹 신청 후 발급된 상점 MID 및 API Key를 입력하시면 결제가 자동 가동됩니다.
                </p>

                <div className="flex flex-col gap-1.5 pt-1">
                  <a
                    href="https://portone.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-emerald-400" />
                      <span>포트원 (PortOne) 무료 가맹 신청 포털</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">portone.io ↗</span>
                  </a>

                  <a
                    href="https://www.tosspayments.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-blue-500 hover:text-blue-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-blue-400" />
                      <span>토스페이먼츠 (Toss) 전자결제 가맹 센터</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">tosspayments.com ↗</span>
                  </a>

                  <a
                    href="https://with.kakaopay.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:border-amber-500 hover:text-amber-300 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink size={12} className="text-amber-400" />
                      <span>카카오페이 (Kakao Pay) 가맹점 직접 신청</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">with.kakaopay.com ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (2 Spans): Real-time Config Inputs */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Building2 className="text-cyan-400" /> 고객 사이트 기본 정보 실시간 편집
              </h2>
              <p className="text-xs font-medium text-slate-400">
                여기서 수정하신 전화번호, 주소, 이메일, 사업자 정보는 에이전트(저)에게 요청할 필요 없이 홈페이지에 **1초 만에 즉시 반영**됩니다!
              </p>
            </div>

            {saveSuccessMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold ${saveSuccessMsg.includes("✅") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border border-rose-500/30 text-rose-300"}`}>
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Building2 size={13} className="text-cyan-400" /> 상호명 / 브랜드명
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="예: (주)크리에이박스 또는 내 상호명"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Phone size={13} className="text-cyan-400" /> 대표 전화번호
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 02-1234-5678"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-cyan-400" /> 대표 이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="예: contact@domain.com"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <FileText size={13} className="text-cyan-400" /> 사업자 등록번호
                  </label>
                  <input
                    type="text"
                    value={bizNumber}
                    onChange={(e) => setBizNumber(e.target.value)}
                    placeholder="예: 123-45-67890"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-cyan-400" /> 사업장 주소
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">
                  한 줄 회사 소개문구 (홈페이지 메인 및 푸터 노출)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="예: 고객 만족을 최우선으로 선도하는 비즈니스 공식 브랜드 웹사이트입니다."
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* SECTION 2: 테마 포인트 컬러 지정 (Theme Color Accent Picker) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" /> 브랜드 테마 포인트 컬러 선택 (Color Customization)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: "cyan", name: "Cyan", bg: "bg-cyan-500", border: "border-cyan-400" },
                    { id: "blue", name: "Blue", bg: "bg-blue-600", border: "border-blue-400" },
                    { id: "emerald", name: "Emerald", bg: "bg-emerald-500", border: "border-emerald-400" },
                    { id: "purple", name: "Purple", bg: "bg-purple-600", border: "border-purple-400" },
                    { id: "amber", name: "Amber", bg: "bg-amber-500", border: "border-amber-400" },
                    { id: "rose", name: "Rose", bg: "bg-rose-500", border: "border-rose-400" },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setThemeColor(color.id)}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                        themeColor === color.id
                          ? `${color.border} bg-slate-950 text-white shadow-md shadow-cyan-500/10`
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: GNB 메뉴명 & CTA 라벨 커스텀 */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Tag size={14} className="text-amber-400" /> GNB 헤더 우측 메뉴명 커스텀 (Menu & Label Customization)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">GNB 우측 블로그 메뉴 라벨</label>
                    <input
                      type="text"
                      value={headerBlogTitle}
                      onChange={(e) => setHeaderBlogTitle(e.target.value)}
                      placeholder="예: Blog (블로그), IT 기술 칼럼"
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400">GNB 우측 Contact 버튼 라벨</label>
                    <input
                      type="text"
                      value={headerContactTitle}
                      onChange={(e) => setHeaderContactTitle(e.target.value)}
                      placeholder="예: Contact & 구독하기, 1:1 상담신청"
                      className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: 메인 히어로 슬로건 문구 */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Flame size={14} className="text-rose-400" /> 메인 히어로 헤드라인 슬로건
                </label>
                <input
                  type="text"
                  value={heroSlogan}
                  onChange={(e) => setHeroSlogan(e.target.value)}
                  placeholder="예: 2026년 자율 AI 에이전트와 웹 서비스의 대격변"
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* SECTION 5: 동적 GNB 메뉴 관리자 (Dynamic Navigation Menu Builder) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <ListPlus size={14} className="text-cyan-400" /> 동적 GNB 헤더 메뉴 자유 추가/편집/삭제 (Dynamic Menu Builder)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMenu}
                    className="inline-flex items-center gap-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all"
                  >
                    <Plus size={13} />
                    <span>신규 메뉴 추가하기</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {customMenus.map((menu, idx) => (
                    <div key={menu.id || idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-black text-cyan-400 w-6 shrink-0 text-center">#{idx + 1}</span>

                      {/* Menu Label Input */}
                      <input
                        type="text"
                        value={menu.label}
                        onChange={(e) => handleUpdateMenu(idx, "label", e.target.value)}
                        placeholder="메뉴 이름 (예: 교육소개)"
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                      />

                      {/* Menu URL Input */}
                      <input
                        type="text"
                        value={menu.url}
                        onChange={(e) => handleUpdateMenu(idx, "url", e.target.value)}
                        placeholder="이동 링크 (예: #about)"
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-300 focus:border-cyan-500 focus:outline-none"
                      />

                      {/* Alignment Selector */}
                      <button
                        type="button"
                        onClick={() => handleUpdateMenu(idx, "isRightAligned", !menu.isRightAligned)}
                        className={`px-3 py-2 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all border ${
                          menu.isRightAligned
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {menu.isRightAligned ? "✨ 우측 CTA 영역" : "📌 일반 메뉴"}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(idx)}
                        className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                        title="메뉴 삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: 커스텀 블로그 카테고리 관리 (Blog Category Builder) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-400" /> 커스텀 블로그 카테고리 설정 & 관리 (Blog Category Builder)
                  </label>
                  <span className="text-[11px] text-slate-400 font-bold">
                    총 {blogCategories.length}개 카테고리
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  카테고리를 자유롭게 생성/삭제할 수 있으며, 생성된 카테고리는 블로그 상단 필터 탭과 게시글 태그로 **실시간 연동**됩니다.
                </p>

                {/* Category Addition Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newBlogCategory}
                    onChange={(e) => setNewBlogCategory(e.target.value)}
                    placeholder="신규 카테고리명 입력 (예: 현장스케치, 힐링교육)"
                    className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBlogCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddBlogCategory}
                    className="inline-flex items-center gap-1 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>카테고리 추가</span>
                  </button>
                </div>

                {/* Current Category Badges with Edit & Reorder Controls */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {blogCategories.map((cat, idx) => {
                    const isEditing = editingCategoryIndex === idx;

                    if (isEditing) {
                      return (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 bg-slate-950 border border-emerald-500 px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-md shadow-emerald-500/20"
                        >
                          <span className="text-emerald-400">#</span>
                          <input
                            type="text"
                            value={editingCategoryText}
                            onChange={(e) => setEditingCategoryText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEditCategory(idx);
                              } else if (e.key === "Escape") {
                                handleCancelEditCategory();
                              }
                            }}
                            className="bg-transparent border-b border-emerald-400 text-xs font-black text-white px-1 py-0.5 focus:outline-none w-24 sm:w-28"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditCategory(idx)}
                            className="text-emerald-400 hover:text-emerald-300 transition-colors p-0.5 cursor-pointer ml-1"
                            title="수정 저장"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditCategory}
                            className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                            title="취소"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={cat}
                        className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-black text-slate-200 group"
                      >
                        <span className="text-emerald-400">#</span>
                        <span>{cat}</span>

                        {cat !== "전체" && (
                          <div className="flex items-center gap-0.5 ml-1 pl-1.5 border-l border-slate-800">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(idx, cat)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5 cursor-pointer"
                              title="카테고리 이름 편집(수정)"
                            >
                              <Pencil size={12} />
                            </button>

                            {/* Left Arrow Button */}
                            <button
                              type="button"
                              disabled={idx <= 1}
                              onClick={() => handleMoveBlogCategory(idx, "left")}
                              className="text-slate-400 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                              title="왼쪽(앞)으로 이동"
                            >
                              <ChevronLeft size={13} />
                            </button>

                            {/* Right Arrow Button */}
                            <button
                              type="button"
                              disabled={idx >= blogCategories.length - 1}
                              onClick={() => handleMoveBlogCategory(idx, "right")}
                              className="text-slate-400 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors p-0.5 cursor-pointer"
                              title="오른쪽(뒤)으로 이동"
                            >
                              <ChevronRight size={13} />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteBlogCategory(cat)}
                              className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 ml-0.5 cursor-pointer"
                              title="카테고리 삭제"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSavingConfig ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>실시간 설정 저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
