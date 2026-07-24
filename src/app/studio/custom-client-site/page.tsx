"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Sparkles,
  Globe,
  LayoutGrid,
  Settings2,
  Cpu,
  Store,
  Check,
  ExternalLink,
  Eye,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Send,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle2,
  HelpCircle,
  Lock,
  Maximize2,
  Tag,
  Flame,
  Plus,
  Trash2,
  ListPlus,
  X,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

export interface CustomMenuItem {
  id: string;
  label: string;
  url: string;
  isRightAligned?: boolean;
}

// --- Template Items Definition ---
interface CustomTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  previewUrl: string;
  badge: string;
  accentColor: string;
  bgGradient: string;
  deployCount: number;
}

const CUSTOM_TEMPLATES: CustomTemplate[] = [
  {
    id: "sotongcheum",
    name: "소통과 채움 (Sotongcheum) V1",
    category: "Business",
    description: "공공기관 및 기업 행사 대행, 조직 교육, 소통/힐링 프로그램 및 렌탈 운영 전문 프리미엄 커스텀 홈페이지",
    features: ["실적 갤러리 탭", "온라인 견적신청 폼", "전용 블로그 엔진", "DoFollow SEO 백링크", "3종 디바이스 뷰포트", "1초 자동 구축 지원"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "BEST 템플릿",
    accentColor: "from-blue-600 to-indigo-600",
    bgGradient: "from-blue-950/40 via-slate-900 to-indigo-950/40",
    deployCount: 142,
  },
  {
    id: "commufill",
    name: "커뮤필 (Commufill) V1",
    category: "Community & Non-Profit",
    description: "지역 모임, 비영리 단체, 동호회 및 협동조합 소통 활성화를 위한 맞춤 커스텀 홈페이지",
    features: ["모임 라이브러리", "멤버십 안내", "실시간 소통 폼", "전용 블로그 탭", "DoFollow SEO 엔진", "반응형 멀티 디바이스"],
    previewUrl: "http://commufill.localhost:3000",
    badge: "인기 템플릿",
    accentColor: "from-indigo-600 to-purple-600",
    bgGradient: "from-indigo-950/40 via-slate-900 to-purple-950/40",
    deployCount: 98,
  },
  {
    id: "creative-media-blog",
    name: "크리에이티브 미디어 블로그 V1",
    category: "Blog",
    description: "IT, 테크, 마케팅 전문 미디어 브랜드 및 트렌드 뉴스레터 중심의 포털 커스텀 블로그",
    features: ["카테고리 아카이브", "뉴스레터 구독 폼", "인기글 랭킹", "전용 블로그 엔진", "DoFollow SEO 백링크", "실시간 읽기 모달 팝업"],
    previewUrl: "http://creative-media-blog.localhost:3000",
    badge: "추천 템플릿",
    accentColor: "from-cyan-600 to-blue-600",
    bgGradient: "from-cyan-950/40 via-slate-900 to-blue-950/40",
    deployCount: 88,
  },
  {
    id: "aura-portfolio",
    name: "스튜디오 아우라 포트폴리오 V1",
    category: "Portfolio",
    description: "디자이너, 포토그래퍼, 크리에이터 전용 풀스크린 포트폴리오 및 프로젝트 쇼케이스",
    features: ["작품 풀스크린 갤러리", "프로젝트 모달", "외주 문의 폼", "전용 블로그 탭", "DoFollow SEO 백링크", "3종 디바이스 지원"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "크리에이티브",
    accentColor: "from-violet-600 to-purple-600",
    bgGradient: "from-violet-950/40 via-slate-900 to-purple-950/40",
    deployCount: 75,
  },
  {
    id: "next-commerce",
    name: "넥스트 럭셔리 스토어 V1",
    category: "Store",
    description: "프리미엄 굿즈, 브랜드 셀렉트숍 및 라이프스타일 브랜드 전용 커스텀 쇼룸",
    features: ["상품 쇼케이스", "카테고리 필터", "구매 문의 폼", "브랜드 스토리", "전용 블로그 엔진", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "프리미엄",
    accentColor: "from-amber-600 to-yellow-600",
    bgGradient: "from-amber-950/40 via-slate-900 to-yellow-950/40",
    deployCount: 110,
  },
  {
    id: "art-gallery",
    name: "갤러리 아트앤디자인 V1",
    category: "Art & Design",
    description: "전시회, 미술관, 갤러리 및 디자인 에이전시 전용 전시 가이드 & 비주얼 포털",
    features: ["전시 일정 캘린더", "작가 프로필", "작품 도록", "티켓 예약 폼", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "감성 아트",
    accentColor: "from-rose-600 to-pink-600",
    bgGradient: "from-rose-950/40 via-slate-900 to-pink-950/40",
    deployCount: 62,
  },
  {
    id: "prime-realestate",
    name: "스마트 프라임 부동산 V1",
    category: "Real Estate",
    description: "상가, 분양, 신축 빌라 및 프라이빗 매물 정보 전용 커스텀 부동산 사이트",
    features: ["매물 검색 필터", "상세 지도 매핑", "매물 상담 폼", "시세 인사이트", "전용 블로그 탭", "DoFollow SEO 백링크"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "신뢰 100%",
    accentColor: "from-slate-600 to-zinc-700",
    bgGradient: "from-slate-900 via-zinc-900 to-stone-900",
    deployCount: 54,
  },
  {
    id: "chaeum-wellness",
    name: "더채움 웰니스 메디컬 V1",
    category: "Health & Wellness",
    description: "피부과, 한의원, 피트니스 및 힐링 센터 전용 맞춤 커스텀 케어 사이트",
    features: ["의료진/강사 프로필", "진료/운동 카테고리", "1:1 상담 예약", "전용 블로그 엔진", "DoFollow SEO", "반응형 뷰포트"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "웰니스 추천",
    accentColor: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
    deployCount: 92,
  },
  {
    id: "eduplus-academy",
    name: "에듀플러스 아카데미 V1",
    category: "Education",
    description: "입시 학원, 어학원, AI/SW 코딩 아카데미 및 수강생 관리 커스텀 교육 사이트",
    features: ["커리큘럼 안내", "강사진 프로필", "입학 상담 신청", "수강 후기", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "교육 전문",
    accentColor: "from-blue-600 to-cyan-600",
    bgGradient: "from-blue-950/40 via-slate-900 to-cyan-950/40",
    deployCount: 81,
  },
  {
    id: "trend-magazine",
    name: "더 트렌드 매거진 V1",
    category: "Magazine",
    description: "패션, 라이프스타일, 컬처 종합 매거진 및 웹진 형태의 고품격 미디어 사이트",
    features: ["헤드라인 그리드", "트렌드 이슈", "동영상 커버", "전용 매거진 블로그", "DoFollow SEO 백링크", "3종 디바이스 스위처"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "트렌디",
    accentColor: "from-purple-600 to-pink-600",
    bgGradient: "from-purple-950/40 via-slate-900 to-pink-950/40",
    deployCount: 68,
  },
  {
    id: "soundwave-music",
    name: "사운드웨이브 뮤직 V1",
    category: "Music",
    description: "음반 기획사, 아티스트, SUNO/AI 뮤직 플레이어 연동 음악 전용 커스텀 포털",
    features: ["음원 스트리밍 플레이어", "앨범 디스코그래피", "공연 일정", "팬 방명록", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "AI 뮤직",
    accentColor: "from-rose-600 to-orange-600",
    bgGradient: "from-rose-950/40 via-slate-900 to-orange-950/40",
    deployCount: 71,
  },
  {
    id: "aura-finedining",
    name: "아우라 파인다이닝 V1",
    category: "Restaurant",
    description: "파인다이닝, 프라이빗 레스토랑, 베이커리 카페 전용 시그니처 커스텀 웹사이트",
    features: ["시그니처 코스 메뉴판", "테이블 예약 폼", "매장 오시는길", "인스타그램 피드", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "핫플레이스",
    accentColor: "from-yellow-600 to-amber-600",
    bgGradient: "from-yellow-950/40 via-slate-900 to-amber-950/40",
    deployCount: 59,
  },
  {
    id: "travel-stay",
    name: "트래블 힐링 스테이 V1",
    category: "Travel & Lifestyle",
    description: "감성 펜션, 리조트, 공간 대여 및 해외 투어 전문 여행 라이프스타일 사이트",
    features: ["객실/투어 상품", "실시간 예약 문의", "주변 관광 가이드", "방문 후기", "전용 블로그 탭", "DoFollow SEO"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "힐링 여행",
    accentColor: "from-teal-600 to-emerald-600",
    bgGradient: "from-teal-950/40 via-slate-900 to-emerald-950/40",
    deployCount: 84,
  },
  {
    id: "fashion-beauty-lookbook",
    name: "더채움 뷰티 & 룩북 V1",
    category: "Fashion & Beauty",
    description: "패션 브랜드 룩북, 뷰티 에스테틱 및 헤어샵 전용 감성 뷰티 포털",
    features: ["시술/스타일 룩북", "1:1 예약 상담", "리뷰 카러셀", "전용 블로그 탭", "DoFollow SEO 엔진", "3종 디바이스 최적화"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "스타일리시",
    accentColor: "from-fuchsia-600 to-pink-600",
    bgGradient: "from-fuchsia-950/40 via-slate-900 to-pink-950/40",
    deployCount: 79,
  },
  {
    id: "starlight-ent",
    name: "스타라이트 엔터테인먼트 V1",
    category: "Entertainment",
    description: "연예 기획사, 캐스팅 에이전시, 버스킹 및 공연 대행 전문 엔터테인먼트 포털",
    features: ["아티스트 라인업", "오디션/캐스팅 신청", "공연 영상 갤러리", "언론 보도", "전용 블로그 탭", "DoFollow SEO 백링크"],
    previewUrl: "http://sotongcheum.localhost:3000",
    badge: "엔터 전문",
    accentColor: "from-indigo-600 to-blue-600",
    bgGradient: "from-indigo-950/40 via-slate-900 to-blue-950/40",
    deployCount: 66,
  },
  {
    id: "aura-merino",
    name: "아우라 메리노 (Aura Merino) 스니커즈 쇼핑몰 V1",
    category: "Shopping",
    description: "100% 천연 메리노 울 & 캐시미어 수제 스니커즈 전문 이커머스 스토어 (Aura Merino 시그니처 템플릿)",
    features: ["메리노 울 상품 6종 그리드", "Quick View 팝업 모달", "신발 사이즈 선택기", "장바구니 드로어 & 결제", "DoFollow SEO 전용 블로그", "1초 원클릭 마이크로 배포"],
    previewUrl: "http://aura-merino.localhost:3000",
    badge: "🔥 1위 쇼핑몰",
    accentColor: "from-emerald-600 to-teal-600",
    bgGradient: "from-emerald-950/40 via-slate-900 to-teal-950/40",
    deployCount: 189,
  },
];

export default function CustomClientSiteStudioPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "manage" | "request" | "assetization">("marketplace");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 테마");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Preview Modal State (KIMI Style with 3-Device Viewport Mode)
  const [previewModalTemplate, setPreviewModalTemplate] = useState<CustomTemplate | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Deploy Modal State
  const [deployModalTemplate, setDeployModalTemplate] = useState<CustomTemplate | null>(null);
  const [deploySiteName, setDeploySiteName] = useState<string>("");
  const [deploySubdomain, setDeploySubdomain] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);

  // Management State
  const [companyName, setCompanyName] = useState<string>("소통과 채움");
  const [phone, setPhone] = useState<string>("031-292-3806");
  const [address, setAddress] = useState<string>("경기도 화성시 봉담읍 삼천병마로 1234");
  const [email, setEmail] = useState<string>("jenam7720@gmail.com");
  const [bizNumber, setBizNumber] = useState<string>("123-45-67890");
  const [description, setDescription] = useState<string>("공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과 채움 협동조합입니다.");
  const [kakaoLink, setKakaoLink] = useState<string>("https://pf.kakao.com/_example");
  const [themeColor, setThemeColor] = useState<string>("cyan");
  const [headerBlogTitle, setHeaderBlogTitle] = useState<string>("Blog (블로그)");
  const [headerContactTitle, setHeaderContactTitle] = useState<string>("Contact & 구독하기");
  const [heroSlogan, setHeroSlogan] = useState<string>("2026년 자율 AI 에이전트와 웹 서비스의 대격변");
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Dynamic Custom GNB Menus State
  const [customMenus, setCustomMenus] = useState<CustomMenuItem[]>([
    { id: "1", label: "홈", url: "/" },
    { id: "2", label: "AI & 테크", url: "#articles" },
    { id: "3", label: "디자인 & UI/UX", url: "#articles" },
    { id: "4", label: "마케팅 & 인사이트", url: "#articles" },
    { id: "5", label: "인기 랭킹", url: "#ranking" },
    { id: "6", label: "Blog (블로그)", url: "#articles", isRightAligned: true },
    { id: "7", label: "Contact & 구독하기", url: "#contact", isRightAligned: true },
  ]);

  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");

  const handleAddMenu = () => {
    const newId = String(Date.now());
    setCustomMenus((prev) => [
      ...prev,
      { id: newId, label: `새 메뉴 ${prev.length + 1}`, url: "#custom", isRightAligned: false },
    ]);
  };

  const handleUpdateMenu = (index: number, key: keyof CustomMenuItem, value: any) => {
    setCustomMenus((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDeleteMenu = (index: number) => {
    setCustomMenus((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Request Form State
  const [reqCategory, setReqCategory] = useState<string>("행사/기획/렌탈");
  const [reqConcept, setReqConcept] = useState<string>("딥 블루 & 세련되고 신뢰감 있는 브랜드 다크 톤");
  const [reqFeatures, setReqFeatures] = useState<string[]>([
    "실적/포트폴리오 갤러리 탭",
    "실시간 온라인 견적신청 폼",
    "전용 블로그 & 조회수 카운터",
    "DoFollow SEO 백링크 가산점 엔진",
  ]);
  const [reqRefUrl, setReqRefUrl] = useState<string>("");
  const [reqDetail, setReqDetail] = useState<string>("");
  const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);
  const [reqSuccess, setReqSuccess] = useState<boolean>(false);

  const supabase = createClient();

  // Load Config on Mount
  useEffect(() => {
    async function loadConfig() {
      const { data: { user } } = await supabase.auth.getUser();
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
        updatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update({ extra_configs: newCfg })
        .eq("id", user.id);

      if (error) throw error;
      setSaveSuccessMsg("✅ 커스텀 사이트 설정이 성공적으로 저장되었습니다! 홈페이지에 실시간 반영됩니다.");
    } catch (err: unknown) {
      console.error(err);
      setSaveSuccessMsg("⚠️ 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Handle Deploy Modal Submit
  const handleConfirmDeploy = async () => {
    if (!deploySiteName || !deploySubdomain) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
    }, 1500);
  };

  // Handle Request Submit
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReq(true);

    setTimeout(() => {
      setIsSubmittingReq(false);
      setReqSuccess(true);
    }, 1200);
  };

  const categories = [
    "전체 테마",
    "Shopping",
    "Blog",
    "Portfolio",
    "Business",
    "Store",
    "Art & Design",
    "Real Estate",
    "Health & Wellness",
    "Education",
    "Magazine",
    "Music",
    "Restaurant",
    "Travel & Lifestyle",
    "Fashion & Beauty",
    "Community & Non-Profit",
    "Entertainment",
  ];

  const filteredTemplates = CUSTOM_TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "전체 테마" ||
      tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans p-6 lg:p-10 space-y-8">
      {/* Header Banner (Compact Slim Layout) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-5 sm:p-6 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 text-[11px] font-black text-cyan-300 backdrop-blur-md">
              <Sparkles size={13} className="animate-pulse text-cyan-400" />
              <span>CreAibox 커스텀 홈페이지 허브</span>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight text-white whitespace-nowrap">
              100% 독창적인 프리미엄 커스텀 홈페이지{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                템플릿 쇼핑 & 1초 자동 구축 센터
              </span>
            </h1>

            <p className="text-xs text-slate-300 font-medium leading-normal">
              템플릿 쇼핑, 고객 사이트 실시간 기본정보 편집, AI 신규 제작 신청까지 한눈에 관리하세요.
            </p>
          </div>

          {/* Quick Metrics Bar (Slim Chips) */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">템플릿</p>
              <p className="text-sm font-black text-cyan-400">100+ 종</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">구축 시간</p>
              <p className="text-sm font-black text-emerald-400">단 1초</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">SEO 엔진</p>
              <p className="text-sm font-black text-amber-400">DoFollow</p>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">AI 전담케어</p>
              <p className="text-sm font-black text-purple-400">24시간</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 ${
            activeTab === "marketplace"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <LayoutGrid size={16} />
          <span>1️⃣ 템플릿 쇼핑 & 1초 구축</span>
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 ${
            activeTab === "manage"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Settings2 size={16} />
          <span>2️⃣ 내 커스텀 사이트 관리</span>
        </button>

        <button
          onClick={() => setActiveTab("request")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 ${
            activeTab === "request"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Cpu size={16} />
          <span>3️⃣ AI 커스텀 신규 제작 신청</span>
        </button>

        <button
          onClick={() => setActiveTab("assetization")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-300 ${
            activeTab === "assetization"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20 scale-102"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <Store size={16} />
          <span>4️⃣ 템플릿 자산화 & 리셀링</span>
        </button>
      </div>

      {/* --- TAB 1: 템플릿 쇼핑 & 1초 구축 (Custom Template Marketplace) --- */}
      {activeTab === "marketplace" && (
        <div className="space-y-8">
          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="템플릿 이름, 기능, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-11 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Categories Capsule Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Grid (Compact 3-Column Grid: Flexible Left Info / Fixed Right Live Web Preview Window) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 overflow-hidden hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex flex-row gap-4 items-stretch h-[290px]">
                  {/* Left Side (Flexible Width): Info, Features, Metrics, & Stacked Buttons */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div className="space-y-2">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 text-[9px] font-black text-cyan-300 truncate max-w-[100px]">
                          {tpl.category}
                        </span>
                        <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[9px] font-black text-amber-300 truncate">
                          {tpl.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                          {tpl.name}
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-slate-300 leading-snug line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Key Features */}
                      <div className="space-y-1 pt-0.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          주요 내장 기능
                        </p>
                        <div className="space-y-0.5">
                          {tpl.features.slice(0, 3).map((ft, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-200">
                              <CheckCircle2 size={11} className="text-cyan-400 shrink-0" />
                              <span className="truncate">{ft}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar: Metrics & Vertically Stacked Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>구축: <strong className="text-cyan-400 font-black">{tpl.deployCount}회</strong></span>
                        <span className="flex items-center gap-0.5 text-emerald-400 text-[9px]">
                          <ShieldCheck size={11} /> DoFollow
                        </span>
                      </div>

                      {/* Vertically Stacked Action Buttons (1초 구축 UNDER 미리보기) */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setPreviewModalTemplate(tpl)}
                          className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950 py-1.5 text-[10px] sm:text-[11px] font-extrabold text-slate-300 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye size={11} /> 미리보기
                        </button>

                        <button
                          onClick={() => {
                            setDeployModalTemplate(tpl);
                            setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
                            setDeploySubdomain(`${tpl.id}-mybrand`);
                            setDeploySuccess(false);
                          }}
                          className={`w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r ${tpl.accentColor} py-1.5 text-[10px] sm:text-[11px] font-black text-white hover:brightness-110 transition-all shadow-md`}
                        >
                          <Zap size={11} /> 1초 구축하기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Fixed Width (w-[210px] shrink-0) - Keeps proportions perfect without horizontal gaps! */}
                  <div className="w-[210px] shrink-0 flex flex-col rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-lg group/preview h-full">
                    {/* Mac Browser Top Bar */}
                    <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 bg-slate-900 border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>

                      <div className="flex-1 flex items-center gap-1 rounded bg-slate-950 border border-slate-800 px-1 py-0.5 text-[8px] font-bold text-slate-400 truncate">
                        <Lock size={8} className="text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-300">
                          {tpl.id}.creaibox.com
                        </span>
                      </div>

                      <button
                        onClick={() => setPreviewModalTemplate(tpl)}
                        title="팝업 미리보기"
                        className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 transition-all"
                      >
                        <ExternalLink size={10} />
                      </button>
                    </div>

                    {/* Scaled Live Web Page Frame */}
                    <div className="relative flex-1 w-full bg-white overflow-hidden cursor-pointer" onClick={() => setPreviewModalTemplate(tpl)}>
                      <iframe
                        src={`/clients/${tpl.id}`}
                        title={`${tpl.name} Live Preview`}
                        className="w-[600px] h-[800px] origin-top-left scale-[0.35] border-0 pointer-events-none"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 flex items-center justify-center p-1 backdrop-blur-[1px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(tpl);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-2 py-1 text-[10px] font-black text-slate-950 shadow-md hover:bg-cyan-400 transition-all cursor-pointer"
                        >
                          <Maximize2 size={11} /> 실시간 뷰
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: 내 커스텀 사이트 관리 (Active Custom Site Manager) --- */}
      {activeTab === "manage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active Site Status & Quick Action */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Globe size={24} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> 100% 정상 작동 중
                  </span>
                  <h3 className="text-lg font-black text-white">{companyName} 공식 홈페이지</h3>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">브랜드 ID</span>
                  <span className="font-mono text-cyan-300 font-bold">sotongcheum</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">연결 서브도메인</span>
                  <a
                    href="http://sotongcheum.localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                  >
                    sotongcheum.localhost:3000 <ExternalLink size={11} />
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
      )}

      {/* --- TAB 3: AI 커스텀 사이트 신규 제작 신청 (AI Custom Site Concierge) --- */}
      {activeTab === "request" && (
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 px-4 py-1 text-xs font-black text-purple-300">
              <Cpu size={14} /> AI 에이전트 1:1 전담 신규 제작 서비스
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              100% 독창적인 풀코드 커스텀 홈페이지 제작 요청
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed">
              표준 템플릿으로 담아내기 어려운 전용 사업 영역, 특수 렌탈 폼, 갤러리 레이아웃이 필요하시다면 AI 에이전트에게 신청해 주세요! 단 몇 분 만에 풀코드로 제작하여 탑재해 드립니다.
            </p>
          </div>

          {reqSuccess && (
            <div className="rounded-3xl bg-purple-500/10 border border-purple-500/30 p-6 text-center space-y-3">
              <CheckCircle2 size={32} className="mx-auto text-purple-400" />
              <h3 className="text-lg font-black text-white">AI 에이전트에 커스텀 제작 요청이 접수되었습니다!</h3>
              <p className="text-xs font-medium text-purple-200">
                AI 에이전트(Antigravity)가 요청하신 업종 및 명세서를 분석하여 100% 맞춤 풀코드 구축을 시작합니다.
              </p>
            </div>
          )}

          <form onSubmit={handleSendRequest} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">업종 / 산업 분야</label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                >
                  {categories.filter((c) => c !== "전체 테마").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300">희망 디자인 컨셉 & 메인 컬러</label>
                <input
                  type="text"
                  value={reqConcept}
                  onChange={(e) => setReqConcept(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                  placeholder="예: 딥 블루 & 고급스러운 감성 다크 톤"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-300">필요한 특수 기능 선택 (복수 선택 가능)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "실적/포트폴리오 갤러리 탭",
                  "실시간 온라인 견적신청 폼",
                  "전용 블로그 & 조회수 카운터",
                  "DoFollow SEO 백링크 가산점 엔진",
                  "카카오톡 / 전화 상담 고정 다이얼",
                  "엑박 방지 안전 예외 폴백 핸들러",
                ].map((ft) => {
                  const isChecked = reqFeatures.includes(ft);
                  return (
                    <button
                      type="button"
                      key={ft}
                      onClick={() => {
                        if (isChecked) {
                          setReqFeatures(reqFeatures.filter((f) => f !== ft));
                        } else {
                          setReqFeatures([...reqFeatures, ft]);
                        }
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-purple-500/20 border-purple-500 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{ft}</span>
                      {isChecked && <Check size={14} className="text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">참고하고 싶은 레퍼런스 웹사이트 URL</label>
              <input
                type="url"
                value={reqRefUrl}
                onChange={(e) => setReqRefUrl(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">요청 상세 내용 (자유 작성)</label>
              <textarea
                rows={4}
                value={reqDetail}
                onChange={(e) => setReqDetail(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:border-purple-500 focus:outline-none leading-relaxed"
                placeholder="원하시는 메인 메뉴 구성, 특별히 강조하고 싶은 서비스 내용 등을 자유롭게 작성해 주세요."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmittingReq}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isSubmittingReq ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>🤖 AI 에이전트에 커스텀 제작 요청하기</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 4: 템플릿 자산화 & 리셀링 파트너십 (Template Assetization) --- */}
      {activeTab === "assetization" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Store size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">보유 커스텀 템플릿 자산</p>
              <p className="text-3xl font-black text-white">8개 브랜드 보유</p>
              <p className="text-xs font-medium text-amber-400">100% 템플릿화 모듈 등록 완료</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">템플릿 기반 원클릭 구축 수</p>
              <p className="text-3xl font-black text-white">총 1,240 회 개설</p>
              <p className="text-xs font-medium text-emerald-400">평균 구축 소요시간 1초</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <TrendingUp size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">월 정기 유지보수 구독 수입</p>
              <p className="text-3xl font-black text-white">월 1,500 만원+</p>
              <p className="text-xs font-medium text-cyan-400">AI 전담 케어 구독 연동</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" /> 에이전시 파트너를 위한 커스텀 템플릿 리셀링 가이드
              </h2>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                제작된 커스텀 사이트를 나만의 템플릿 자산으로 등록하여, 클라이언트에게 1초 만에 복제·배포하고 월 30~50만 원의 유지보수 플랜을 판매하는 고수익 모델입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 1</span>
                <h4 className="text-sm font-bold text-white">1:1 커스텀 사이트 제작</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI 에이전트를 통해 완성도 높은 풀코드 커스텀 홈페이지를 1:1로 신속 제작합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 2</span>
                <h4 className="text-sm font-bold text-white">마켓플레이스 템플릿화</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  템플릿 레지스트리에 등록하여 신규 고객이 선택 시 1초 만에 자동 복제되도록 설정합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 3</span>
                <h4 className="text-sm font-bold text-white">월 유지보수 정기 구독</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  블로그 포스팅과 기본 정보는 고객이 직접 수정하고, 디자인 개편은 AI가 전담 케어합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DEPLOY MODAL WIZARD --- */}
      {deployModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="text-cyan-400" size={20} />
                <h3 className="text-lg font-black text-white">1초 템플릿 즉시 구축</h3>
              </div>
              <button
                onClick={() => setDeployModalTemplate(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                닫기
              </button>
            </div>

            {deploySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-black text-white">
                  축하합니다! 홈페이지 구축이 완료되었습니다! 🎉
                </h4>
                <p className="text-xs font-medium text-slate-300">
                  선택하신 <strong className="text-cyan-400">{deployModalTemplate.name}</strong> 기반으로 내 신규 사이트가 정상 개설되었습니다.
                </p>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <a
                    href="http://sotongcheum.localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-2xl bg-cyan-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
                  >
                    <Globe size={14} /> 신규 사이트 열기
                  </a>
                  <button
                    onClick={() => {
                      setDeployModalTemplate(null);
                      setActiveTab("manage");
                    }}
                    className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-extrabold text-white hover:bg-slate-700 transition-all"
                  >
                    사이트 관리로 이동
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-slate-400">선택 템플릿</p>
                  <p className="text-sm font-black text-cyan-300">{deployModalTemplate.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">내 사이트 이름</label>
                  <input
                    type="text"
                    value={deploySiteName}
                    onChange={(e) => setDeploySiteName(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">희망 서브도메인 (영문)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={deploySubdomain}
                      onChange={(e) => setDeploySubdomain(e.target.value)}
                      className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none font-mono"
                    />
                    <span className="text-xs font-mono text-slate-400">.creaibox.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeployModalTemplate(null)}
                    className="rounded-2xl border border-slate-800 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmDeploy}
                    disabled={isDeploying}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                  >
                    {isDeploying ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{isDeploying ? "구축 중..." : "즉시 구축 완료"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- KIMI-STYLE INTERACTIVE FULL-SCROLL PREVIEW MODAL (3-DEVICE VIEWPORT SWITCHER) --- */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className={`w-full flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300 max-h-[92vh] ${
              previewDeviceMode === "desktop"
                ? "max-w-6xl"
                : previewDeviceMode === "tablet"
                ? "max-w-4xl"
                : "max-w-xl"
            }`}
          >
            {/* Modal Header: Title + 3-Device Viewport Mode Switcher + Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-800 bg-slate-950 shrink-0">
              {/* Left: Window Dots & Template Name */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  미리 보기 <span className="text-cyan-400 font-bold">• {previewModalTemplate.name}</span>
                </h3>
              </div>

              {/* Center: 3-Device Viewport Mode Switcher (PC 웹, 태블릿, 모바일) */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => setPreviewDeviceMode("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "desktop"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Monitor size={13} />
                  <span>PC 웹</span>
                </button>

                <button
                  onClick={() => setPreviewDeviceMode("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "tablet"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Tablet size={13} />
                  <span>태블릿</span>
                </button>

                <button
                  onClick={() => setPreviewDeviceMode("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDeviceMode === "mobile"
                      ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Smartphone size={13} />
                  <span>모바일</span>
                </button>
              </div>

              {/* Right: New Tab & Close Button */}
              <div className="flex items-center gap-2">
                <a
                  href={previewModalTemplate.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1 text-xs font-extrabold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all"
                >
                  <ExternalLink size={14} /> 새 탭에서 열기
                </a>
                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: Responsive Viewport Display (PC/Tablet/Mobile) */}
            <div className="relative flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex justify-center items-start">
              <div
                className={`transition-all duration-300 rounded-2xl border border-slate-800 bg-white overflow-hidden shadow-2xl ${
                  previewDeviceMode === "desktop"
                    ? "w-full max-w-[1100px]"
                    : previewDeviceMode === "tablet"
                    ? "w-[768px] max-w-full"
                    : "w-[375px] max-w-full rounded-3xl border-4 border-slate-800 shadow-cyan-500/5"
                }`}
              >
                <iframe
                  src={`/clients/${previewModalTemplate.id}`}
                  title={`${previewModalTemplate.name} ${previewDeviceMode} Preview`}
                  className={`w-full border-0 ${
                    previewDeviceMode === "mobile" ? "h-[620px]" : "h-[660px]"
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950 shrink-0">
              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                계속 찾기
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 hidden lg:inline">
                  {previewDeviceMode === "desktop" && "💻 PC 웹 와이드 모드"}
                  {previewDeviceMode === "tablet" && "📱 태블릿 768px 해상도 모드"}
                  {previewDeviceMode === "mobile" && "📱 스마트폰 모바일 375px 해상도 모드"}
                </span>

                <button
                  onClick={() => {
                    const tpl = previewModalTemplate;
                    setPreviewModalTemplate(null);
                    setDeployModalTemplate(tpl);
                    setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
                    setDeploySubdomain(`${tpl.id}-mybrand`);
                    setDeploySuccess(false);
                  }}
                  className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r ${previewModalTemplate.accentColor} px-6 py-2.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg`}
                >
                  <Zap size={14} /> 템플릿 사용 (1초 구축)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
