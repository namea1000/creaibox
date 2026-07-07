"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  PenLine,
  ImageIcon,
  Video,
  TrendingUp,
  Wand2,
  Rocket,
  ShieldCheck,
  LayoutDashboard,
  Globe,
  Folder,
  Search,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

export default function MainLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const placeholders = [
    "예) 인공지능이 바꾸는 미래 일자리 전망에 대해 작성해줘",
    "예) 초보자를 위한 다이어트 운동 식단 가이드를 알려줘",
    "예) 여름철 동남아 가족 여행지 추천 BEST 5 알려줘",
    "예) 부동산 취득세 계산 방법과 절세 꿀팁 정리해줘",
    "예) 서울 근교 감성 캠핑장 추천 및 예약 팁 가르쳐줘",
    "예) 직장인을 위한 스트레스 해소법 및 명상 가이드 써줘",
    "예) 소자본 창업을 위한 1인 지식 기업 아이디어 추천해줘",
    "예) 유튜브 쇼츠 채널 빠르게 키우는 3가지 비법 알려줘",
    "예) 퍼스널 브랜딩을 위한 블로그 글쓰기 전략 정리해줘",
    "예) 메타버스 및 웹3.0 시대의 비즈니스 트렌드 분석해줘",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const subCategories = [
    { name: "AI & 기술", sub: "AI & Tech", count: "535개 아이디어", emoji: "🤖" },
    { name: "IT & 디지털", sub: "IT & Digital", count: "400개 아이디어", emoji: "💻" },
    { name: "가상자산 & 블록체인", sub: "Crypto & Blockchain", count: "350개 아이디어", emoji: "🪙" },
    { name: "사이버보안", sub: "Cyber Security", count: "60개 아이디어", emoji: "🛡️" },
    { name: "데이터 & 분석", sub: "Data & Analytics", count: "65개 아이디어", emoji: "📊" },
    { name: "경제 & 금융", sub: "Economy & Finance", count: "830개 아이디어", emoji: "💰" },
    { name: "비즈니스 & 창업", sub: "Business & Startup", count: "772개 아이디어", emoji: "🚀" },
    { name: "취업 & 커리어", sub: "Career", count: "400개 아이디어", emoji: "💼" },
    { name: "기업 & 브랜드", sub: "Company & Brand", count: "120개 아이디어", emoji: "🏢" },
    { name: "제품 & 쇼핑", sub: "Shopping", count: "120개 아이디어", emoji: "🛒" },
    { name: "부동산", sub: "Real Estate", count: "240개 아이디어", emoji: "🏠" },
    { name: "스타트업 & 벤처", sub: "Startup & Venture", count: "210개 아이디어", emoji: "📈" },
    { name: "자동차", sub: "Car", count: "300개 아이디어", emoji: "🚗" },
    { name: "여행", sub: "Travel", count: "420개 아이디어", emoji: "✈️" },
    { name: "스포츠", sub: "Sports", count: "699개 아이디어", emoji: "⚽" },
    { name: "음식", sub: "Food", count: "420개 아이디어", emoji: "🍲" },
    { name: "라이프스타일", sub: "Lifestyle", count: "1,250개 아이디어", emoji: "☕" },
    { name: "사주 & 운세", sub: "Saju & Fortune", count: "200개 아이디어", emoji: "🔮" },
    { name: "취미 & 레저", sub: "Hobbies & Leisure", count: "202개 아이디어", emoji: "🏕️" },
    { name: "건강", sub: "Health", count: "420개 아이디어", emoji: "🏥" },
    { name: "반려동물", sub: "Pets", count: "240개 아이디어", emoji: "🐶" },
    { name: "웰니스 & 마음챙김", sub: "Wellness & Mindfulness", count: "215개 아이디어", emoji: "🧘" },
    { name: "인테리어 & 홈데코", sub: "Interior & Home Deco", count: "210개 아이디어", emoji: "🛋️" },
    { name: "실버 라이프", sub: "Silver Life", count: "190개 아이디어", emoji: "👴" },
    { name: "패션 & 뷰티", sub: "Fashion & Beauty", count: "210개 아이디어", emoji: "💄" },
    { name: "임신 & 육아", sub: "Parenting & Childcare", count: "203개 아이디어", emoji: "👶" },
    { name: "교육", sub: "Education", count: "680개 아이디어", emoji: "🎓" },
    { name: "인물", sub: "People", count: "320개 아이디어", emoji: "👤" },
    { name: "역사", sub: "History", count: "66개 아이디어", emoji: "🏛️" },
    { name: "철학 & 인문학", sub: "Philosophy", count: "220개 아이디어", emoji: "📚" },
    { name: "종교 & 영성", sub: "Religion", count: "280개 아이디어", emoji: "🙏" },
    { name: "한자", sub: "Chinese Characters", count: "2개 아이디어", emoji: "✍️" },
    { name: "정치 & 사회", sub: "Politics & Society", count: "480개 아이디어", emoji: "⚖️" },
    { name: "국가 & 지역", sub: "Countries & Regions", count: "520개 아이디어", emoji: "🌎" },
    { name: "군사 & 국제안보", sub: "Military & Security", count: "80개 아이디어", emoji: "🪖" },
    { name: "법률", sub: "Law", count: "480개 아이디어", emoji: "⚖️" },
    { name: "정부지원금 & 복지", sub: "Welfare", count: "66개 아이디어", emoji: "💵" },
    { name: "세금 & 세무 전략", sub: "Tax Strategy", count: "210개 아이디어", emoji: "📊" },
    { name: "권리 구제", sub: "Rights Remedy", count: "210개 아이디어", emoji: "🛡️" },
    { name: "과학", sub: "Science", count: "460개 아이디어", emoji: "🧪" },
    { name: "자연 & 우주", sub: "Nature & Space", count: "280개 아이디어", emoji: "🌌" },
    { name: "환경 & ESG", sub: "Environment & ESG", count: "240개 아이디어", emoji: "🌱" },
    { name: "기후 & 친환경 기술", sub: "Climate & Energy", count: "250개 아이디어", emoji: "⚡" },
    { name: "우주 산업 & 탐사", sub: "Space Industry", count: "210개 아이디어", emoji: "🚀" },
    { name: "예술 & 디자인", sub: "Art & Design", count: "220개 아이디어", emoji: "🎨" },
    { name: "연예 & 문화", sub: "Entertainment", count: "20개 아이디어", emoji: "🎬" },
    { name: "게임", sub: "Gaming", count: "220개 아이디어", emoji: "🎮" },
    { name: "영상 제작", sub: "Video Production", count: "210개 아이디어", emoji: "📹" },
    { name: "콘텐츠 기획", sub: "Content Planning", count: "210개 아이디어", emoji: "📝" },
    { name: "음악 & 오디오", sub: "Music & Audio", count: "210개 아이디어", emoji: "🎵" },
    { name: "창작 플랫폼", sub: "Creator Platform", count: "210개 아이디어", emoji: "📢" },
    { name: "유튜브 영상제작", sub: "YouTube Production", count: "3개 아이디어", emoji: "📹" },
    { name: "제조업 & 산업", sub: "Manufacturing", count: "200개 아이디어", emoji: "🏭" },
    { name: "미래 모빌리티", sub: "Future Mobility", count: "210개 아이디어", emoji: "🛸" },
    { name: "바이오 & 헬스케어", sub: "Bio & Healthcare", count: "210개 아이디어", emoji: "🧬" },
  ];

  React.useEffect(() => {
    // 테마 캐시가 없으면 메인 페이지는 디폴트로 다크모드 주입
    const savedTheme = localStorage.getItem("studio_theme");
    if (!savedTheme) {
      localStorage.setItem("studio_theme", "dark");
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }

    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getSmartRoute = (query: string): string => {
    const q = query.toLowerCase().trim();
    if (q.includes("홈페이지") || q.includes("웹사이트") || q.includes("빌더") || q.includes("비즈니스")) {
      return `/client-site-builder`;
    }
    if (q.includes("테크") || q.includes("리포트") || q.includes("시장") || q.includes("뉴스") || q.includes("트렌드")) {
      return `/keyword-trend?q=${encodeURIComponent(query)}`;
    }
    if (q.includes("유튜브") || q.includes("영상") || q.includes("쇼츠") || q.includes("골프") || q.includes("여행") || q.includes("레슨")) {
      return `/youtube-trend?q=${encodeURIComponent(query)}`;
    }
    return `/studio/writing/creaibox/new-post?prompt=${encodeURIComponent(query)}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(getSmartRoute(searchQuery));
  };


  const portalTools = [
    {
      title: "AI 글쓰기",
      desc: "블로그, 네이버, 워드프레스 포스팅 초안과 목차를 AI로 즉시 생성합니다.",
      badge: "FREE GENERATION",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: <PenLine size={20} className="text-blue-500" />,
      href: "/ai-writer",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600">ai-editor.txt</span>
          </div>
          <div className="space-y-2 mt-1">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-slate-100 dark:bg-zinc-900 rounded w-5/6" />
            <div className="h-3 bg-slate-100 dark:bg-zinc-900 rounded w-2/3" />
            <div className="h-3 bg-slate-100 dark:bg-zinc-900 rounded w-4/5" />
          </div>
        </div>
      ),
    },
    {
      title: "영상 편집기",
      desc: "별도의 설치 없이 웹 브라우저에서 직접 멀티트랙 타임라인 영상 편집과 고품질 쇼츠를 무료로 제작합니다.",
      badge: "BROWSER ONLY",
      badgeColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      icon: <Video size={20} className="text-pink-500" />,
      href: "/video-editor",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full justify-between">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-zinc-500">
            <span>비디오 멀티레이어 타임라인</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">Web WASM</span>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="h-4 bg-slate-200 dark:bg-zinc-850 rounded flex items-center justify-between px-2 text-[8px] font-black text-slate-500">
              <span>Clip 1.mp4</span>
              <span>12.5s</span>
            </div>
            <div className="h-4 bg-violet-500/20 rounded flex items-center justify-between px-2 text-[8px] font-black text-violet-500">
              <span>BGM_Audio.mp3</span>
              <span>30.0s</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "유튜브 트렌드 분석",
      desc: "실시간 인기 동영상 급상승 트렌드 키워드와 연간 검색 추이를 분석합니다.",
      badge: "UNLIMITED SEARCH",
      badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: <TrendingUp size={20} className="text-red-500" />,
      href: "/youtube-trend",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-zinc-500">
            <span>실시간 인기 키워드</span>
            <span className="text-red-500">LIVE</span>
          </div>
          <div className="flex items-end gap-1.5 h-20 pt-4">
            <div className="bg-slate-200 dark:bg-zinc-800 w-full h-8 rounded-md" />
            <div className="bg-slate-200 dark:bg-zinc-800 w-full h-12 rounded-md" />
            <div className="bg-slate-300 dark:bg-zinc-700 w-full h-14 rounded-md" />
            <div className="bg-gradient-to-t from-violet-500 to-blue-500 w-full h-[76px] rounded-md animate-pulse" />
          </div>
        </div>
      ),
    },
    {
      title: "디자인 (이미지 스튜디오)",
      desc: "블로그 대표 썸네일과 SNS 카드뉴스를 Canva 스타일로 손쉽게 제작합니다.",
      badge: "TEMPLATE FREE",
      badgeColor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      icon: <ImageIcon size={20} className="text-violet-500" />,
      href: "/design",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full justify-between">
          <div className="relative aspect-video rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-black/10" />
            <span className="relative text-xs font-black tracking-tight drop-shadow-sm">골프 비거리 300m 늘리기 🏌️</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-zinc-600">
            <span>가로형 썸네일 템플릿</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">Canva</span>
          </div>
        </div>
      ),
    },
    {
      title: "미디어 라이브러리",
      desc: "에디터나 영상 기획에 필요한 AI 생성 고화질 이미지와 에셋을 검색합니다.",
      badge: "DOWNLOAD FREE",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: <Folder size={20} className="text-emerald-500" />,
      href: "/media-library",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full">
          <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 px-2 py-1">
            <Search size={10} className="text-slate-400" />
            <div className="text-[10px] text-slate-400">에셋 검색...</div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-1">
            <div className="aspect-square bg-slate-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
            </div>
            <div className="aspect-square bg-slate-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
            </div>
            <div className="aspect-square bg-slate-200 dark:bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "AI 홈페이지 제작",
      desc: "비즈니스에 최적화된 고품질 랜딩페이지 레이아웃을 30초 만에 시안 생성합니다.",
      badge: "PREVIEW FREE",
      badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      icon: <Globe size={20} className="text-indigo-500" />,
      href: "/website-builder",
      preview: (
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-4 border border-slate-100 dark:border-zinc-800 text-left h-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-1.5">
            <span className="text-[8px] font-bold text-slate-400 dark:text-zinc-600">Header</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-4 bg-slate-200 dark:bg-zinc-800 rounded" />
              <span className="h-1.5 w-4 bg-slate-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-1.5 py-1">
            <div className="h-2 w-3/4 bg-violet-500/20 dark:bg-violet-500/10 rounded" />
            <div className="h-1.5 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-12 bg-violet-600 rounded-md mt-1 animate-pulse" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      <Header />
      <main className="pt-16">
        
        {/* 가로 퀵 메뉴 바 */}
        <div className="border-b border-slate-100 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-16 z-40 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto py-3 scrollbar-none flex-nowrap">
              {[
                { icon: <Sparkles size={16} />, label: "스튜디오 홈", href: "/studio", color: "text-violet-600 dark:text-violet-400 hover:bg-violet-500/5 hover:border-violet-500/30 dark:hover:bg-violet-500/10 font-black border-violet-500/20" },
                { icon: <Video size={16} />, label: "영상 편집기", href: "/video-editor", color: "text-pink-500 hover:bg-pink-500/5 hover:border-pink-500/30 dark:hover:bg-pink-500/10" },
                { icon: <PenLine size={16} />, label: "AI 글쓰기", href: "/ai-writer", color: "text-blue-500 hover:bg-blue-500/5 hover:border-blue-500/30 dark:hover:bg-blue-500/10" },
                { icon: <TrendingUp size={16} />, label: "유튜브 트렌드", href: "/youtube-trend", color: "text-red-500 hover:bg-red-500/5 hover:border-red-500/30 dark:hover:bg-red-500/10" },
                { icon: <ImageIcon size={16} />, label: "이미지 스튜디오", href: "/design", color: "text-violet-500 hover:bg-violet-500/5 hover:border-violet-500/30 dark:hover:bg-violet-50/10" },
                { icon: <Folder size={16} />, label: "미디어 라이브러리", href: "/media-library", color: "text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/30 dark:hover:bg-emerald-500/10" },
                { icon: <Globe size={16} />, label: "홈페이지 빌더", href: "/website-builder", color: "text-indigo-500 hover:bg-indigo-500/5 hover:border-indigo-500/30 dark:hover:bg-indigo-500/10" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full border border-slate-200/60 dark:border-zinc-800/80 px-4 py-2 text-xs font-black transition shrink-0 ${item.color}`}
                >
                  {item.icon}
                  <span className="text-slate-700 dark:text-zinc-300 font-bold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 dark:from-zinc-900/40 via-white dark:via-zinc-950 to-white dark:to-zinc-950">
          <div className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-300/20 dark:bg-violet-900/5 blur-3xl" />
          <div className="absolute right-0 top-32 h-[420px] w-[420px] rounded-full bg-blue-300/15 dark:bg-blue-900/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16 text-center flex flex-col items-center">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-sm font-black text-violet-700 dark:text-violet-400 shadow-sm">
              <Sparkles size={16} />
              Open Portal · 로그인 없이 무료 체험
            </div>

            <h1 className="break-keep text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-6xl max-w-4xl">
              AI 콘텐츠 제작을
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-blue-400">
                하나의 포털 스튜디오에서
              </span>
            </h1>

            <p className="mt-6 max-w-2xl break-keep text-lg font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
              글쓰기, 이미지 제작, 무료 미디어 에셋 라이브러리, 유튜브 트렌드 분석, AI 홈페이지 제작까지 
              크리에이터에게 꼭 필요한 도구들을 로그인 장벽 없이 즉시 만나보세요.
            </p>

            {/* Smart Search / Prompt Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-10 w-full max-w-2xl">
              <div className="relative flex items-center rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-xl focus-within:border-violet-500 dark:focus-within:border-violet-400 transition">
                <Search className="ml-4 text-slate-400 dark:text-zinc-500 shrink-0" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full bg-transparent px-4 py-3 text-sm font-bold outline-none placeholder-slate-400 dark:placeholder-zinc-500 text-slate-800 dark:text-zinc-100"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  AI 자동 글쓰기
                </button>
              </div>
            </form>


            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/studio")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-7 py-4 text-base font-black shadow-sm transition hover:scale-[1.02] hover:bg-violet-600 dark:hover:bg-violet-50 cursor-pointer"
              >
                <LayoutDashboard size={18} />
                스튜디오 둘러보기
              </button>

              <button
                onClick={() => router.push("/content-planner/idea-hub")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-7 py-4 text-base font-black shadow-lg transition hover:scale-[1.02] hover:from-violet-550 hover:to-indigo-500 cursor-pointer"
              >
                <Lightbulb size={18} />
                콘텐츠 아이디어 허브
              </button>
            </div>

            {/* 대분류 탐색 (10개) */}
            <div className="mt-12 w-full border-t border-slate-200/50 dark:border-zinc-800/80 pt-8 text-left">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-violet-500 animate-pulse" size={16} />
                  <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    콘텐츠 아이디어 허브 대분류 탐색
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  10개 대분류 및 상세분야 55개 제공! 클릭만 하면 바로 글쓰기가 가능한 메인 키워드 주제 11,148개 이상, 추천 시리즈 2,189개 이상 수록되어 있습니다.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
                {[
                  { id: "tech", name: "기술 & 디지털", sub: "Tech & Digital", emoji: "💻" },
                  { id: "business", name: "경제 & 비즈니스", sub: "Economy & Business", emoji: "💼" },
                  { id: "life", name: "생활 & 문화", sub: "Life & Culture", emoji: "☕" },
                  { id: "health", name: "건강 & 라이프", sub: "Health & Life", emoji: "🧘" },
                  { id: "education", name: "교육 & 지식", sub: "Education", emoji: "🎓" },
                  { id: "global", name: "사회 & 국제", sub: "Society & Global", emoji: "🌎" },
                  { id: "law", name: "법률 & 정책", sub: "Law & Policy", emoji: "⚖️" },
                  { id: "environment", name: "환경 & 과학", sub: "Environment", emoji: "🌱" },
                  { id: "creative", name: "예술 & 창작", sub: "Creative & Art", emoji: "🎨" },
                  { id: "industry", name: "산업 & 미래", sub: "Industry & Future", emoji: "🏭" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => router.push(`/content-planner/idea-hub?category=${cat.id}`)}
                    className="group rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-[#0c0d12]/45 p-3 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.03] hover:border-violet-500 dark:hover:bg-violet-600/10 cursor-pointer"
                  >
                    <span className="text-2xl mb-2">{cat.emoji}</span>
                    <span className="text-xs font-black text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 truncate w-full">
                      {cat.name}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 dark:text-zinc-400 truncate w-full mt-1">
                      {cat.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 상세 분야 탐색 (55개) */}
            <div className="mt-8 w-full pt-2 text-left">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-violet-500 animate-pulse" size={16} />
                  <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    상세 분야 탐색 (55개)
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  원하시는 상세 분야를 선택하시면, 해당 분야에 맞춰 자동 정렬된 기획 시리즈와 실시간 메인 키워드 주제를 만나보실 수 있습니다.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {subCategories.map((subItem) => (
                  <button
                    key={subItem.name}
                    onClick={() => router.push(`/content-planner/idea-hub?q=${encodeURIComponent(subItem.name)}`)}
                    className="group rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-[#0c0d12]/45 p-3.5 flex items-center justify-between text-left transition-all hover:scale-[1.02] hover:border-violet-500 dark:hover:bg-violet-600/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{subItem.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 truncate">
                          {subItem.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-zinc-500 mt-0.5 truncate">
                          {subItem.sub}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-400 dark:text-zinc-600 group-hover:text-violet-500 transition-colors shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portal Tools Grid */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 border-t border-slate-100 dark:border-zinc-900">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-sm font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
              OPEN WORKSPACE
            </p>
            <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              바로 체험 가능한 스튜디오 도구
            </h2>
            <p className="mt-5 break-keep text-lg font-medium text-slate-600 dark:text-zinc-400">
              카드 내에서 직접 기능을 사용해 보거나 클릭 시 즉시 독립 도구 페이지로 연결됩니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portalTools.map((tool) => (
              <div
                key={tool.title}
                onClick={() => router.push(tool.href)}
                className="group flex flex-col justify-between rounded-[28px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 dark:hover:border-violet-900 hover:shadow-xl cursor-pointer h-full"
              >
                <div className="text-left">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 shadow-inner">
                      {tool.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-zinc-400 break-keep">
                    {tool.desc}
                  </p>
                </div>

                {/* Preview Frame */}
                <div className="flex-1 mt-4 mb-2 overflow-hidden h-full">
                  {tool.preview}
                </div>

                {/* Action button inside card */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-zinc-800/80">
                  <span className="text-xs font-black text-slate-400 dark:text-zinc-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                    바로가기
                  </span>
                  <ArrowRight size={14} className="text-slate-400 dark:text-zinc-500 group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Value Statement */}
        <section className="bg-slate-50 dark:bg-zinc-900/30 py-24 border-t border-b border-slate-100 dark:border-zinc-900">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  CREATOR FLOW
                </p>
                <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                  단절 없는 콘텐츠 제작,
                  <br />
                  3분 안에 발행 완료
                </h2>
                <p className="mt-5 break-keep text-lg font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                  인기 키워드를 분석하고, AI 글쓰기 에디터로 작성한 뒤, 미디어 라이브러리에서 추천 이미지를 찾고, 
                  디자인 에디터로 썸네일을 꾸며 내 블로그로 전송하기까지 단 하나의 스페이스 안에서 종결됩니다.
                </p>

                <button
                  onClick={() => router.push("/studio")}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-7 py-4 text-sm font-black transition hover:bg-violet-600 dark:hover:bg-violet-50 shadow-sm"
                >
                  스튜디오로 진입
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  "키워드 & 유튜브 실시간 트렌드 분석",
                  "AI 에디터를 통한 원고 초안 고도화",
                  "미디어 라이브러리 이미지 검색 및 디자인 편집",
                  "워드프레스, 네이버 블로그 등 원클릭 배포",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-5 rounded-[26px] border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-lg font-black text-white">
                      {index + 1}
                    </div>
                    <p className="text-base font-black text-slate-800 dark:text-zinc-200 leading-tight">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API Vault & Security */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[34px] border border-violet-200 dark:border-violet-950 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-zinc-900/30 dark:to-zinc-900/10 p-9">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="break-keep text-3xl font-black text-slate-950 dark:text-white">
                개인 API 키 연동
              </h3>
              <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                사용 중인 OpenAI, Gemini 등의 개인 API 키를 연결해 비용 부담 없이 무료 생성 속도를 극대화할 수 있습니다. 
                모든 키는 브라우저 내부 및 안전 보안 구역에 암호화 보관됩니다.
              </p>
              <button
                onClick={() => router.push("/apivault")}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-zinc-800 text-violet-700 dark:text-zinc-200 border border-slate-100 dark:border-zinc-800 px-6 py-3 text-sm font-black shadow-sm transition hover:bg-violet-600 hover:text-white dark:hover:bg-zinc-700"
              >
                API 키 연동관리
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="rounded-[34px] border border-slate-200 dark:border-zinc-800 bg-slate-950 dark:bg-zinc-900 p-9 text-white shadow-2xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white">
                <Rocket size={24} />
              </div>
              <h3 className="break-keep text-3xl font-black">
                올인원 스튜디오 시작
              </h3>
              <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-300 dark:text-zinc-400">
                복잡한 설치 과정 없이 인터넷 주소창만으로 즉시 작동하는 최첨단 대시보드. 
                스튜디오에 로그인하여 기획부터 결과물까지 손쉽게 관리해 보세요.
              </p>
              <button
                onClick={() => router.push("/studio")}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
              >
                스튜디오로 이동
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 우측 퀵 사이드바 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 rounded-[28px] border border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 p-3 shadow-2xl backdrop-blur-md hidden xl:flex transition-all duration-300">
        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 text-center mb-1 border-b border-slate-100 dark:border-zinc-800/80 pb-2">
          Quick
        </div>
        {[
          { icon: <Video size={18} />, label: "영상 편집기", href: "/video-editor", color: "text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/20" },
          { icon: <PenLine size={18} />, label: "AI 글쓰기", href: "/ai-writer", color: "text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/20" },
          { icon: <TrendingUp size={18} />, label: "유튜브 트렌드", href: "/youtube-trend", color: "text-red-500 hover:bg-red-500/10 hover:border-red-500/20" },
          { icon: <ImageIcon size={18} />, label: "이미지 스튜디오", href: "/design", color: "text-violet-500 hover:bg-violet-500/10 hover:border-violet-500/20" },
          { icon: <Folder size={18} />, label: "미디어 라이브러리", href: "/media-library", color: "text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20" },
          { icon: <Globe size={18} />, label: "홈페이지 빌더", href: "/website-builder", color: "text-indigo-500 hover:bg-indigo-500/10 hover:border-indigo-500/20" },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition border border-transparent hover:border-slate-200 dark:hover:border-zinc-800/80 ${item.color}`}
            title={item.label}
          >
            {item.icon}
            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 scale-95 opacity-0 pointer-events-none transition duration-200 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-black px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-800 dark:border-zinc-200">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}