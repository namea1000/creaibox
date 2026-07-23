"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
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
    return `/studio/writing/creaibox/new-post?prompt=${encodeURIComponent(query)}&autoGenerate=true`;
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="text-[10px] font-bold text-zinc-600">ai-editor.txt</span>
          </div>
          <div className="space-y-2 mt-1">
            <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-zinc-900 rounded w-5/6" />
            <div className="h-3 bg-zinc-900 rounded w-2/3" />
            <div className="h-3 bg-zinc-900 rounded w-4/5" />
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full justify-between">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-550">
            <span>비디오 멀티레이어 타임라인</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400">Web WASM</span>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="h-4 bg-zinc-850 rounded flex items-center justify-between px-2 text-[8px] font-black text-zinc-500">
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-550">
            <span>실시간 인기 키워드</span>
            <span className="text-red-500">LIVE</span>
          </div>
          <div className="flex items-end gap-1.5 h-20 pt-4">
            <div className="bg-zinc-800 w-full h-8 rounded-md" />
            <div className="bg-zinc-800 w-full h-12 rounded-md" />
            <div className="bg-zinc-700 w-full h-14 rounded-md" />
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full justify-between">
          <div className="relative aspect-video rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-black/10" />
            <span className="relative text-xs font-black tracking-tight drop-shadow-sm">골프 비거리 300m 늘리기 🏌️</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-600">
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-850 px-2 py-1">
            <Search size={10} className="text-zinc-500" />
            <div className="text-[10px] text-zinc-500">에셋 검색...</div>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-1">
            <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
            </div>
            <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent" />
            </div>
            <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden relative">
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
        <div className="flex flex-col gap-2 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/80 text-left h-full">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
            <span className="text-[8px] font-bold text-zinc-600">Header</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-4 bg-zinc-800 rounded" />
              <span className="h-1.5 w-4 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-1.5 py-1">
            <div className="h-2 w-3/4 bg-violet-500/20 dark:bg-violet-500/10 rounded" />
            <div className="h-1.5 w-1/2 bg-zinc-850 rounded" />
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

        {/* Hero Section - Dark Block */}
        <section className="relative overflow-hidden bg-[#06080d] py-20 text-white border-b border-zinc-900/60">
          {/* 1. Perspective 3D Grid Floor & Grid overlay (원근 3D 격자 바닥) */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
          <div 
            className="absolute inset-x-0 -bottom-40 h-[400px] z-0 opacity-20 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{
              transform: "perspective(500px) rotateX(70deg) translateZ(0)",
              transformOrigin: "center top",
            }}
          />

          {/* 2. Concentric Tech Circles (테크 동심원 그래픽) */}
          <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.22]">
            <div className="h-[300px] w-[300px] animate-[spin_80s_linear_infinite] rounded-full border border-dashed border-violet-500/30" />
            <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite_reverse] rounded-full border border-dashed border-blue-500/20" />
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-[spin_180s_linear_infinite] rounded-full border border-zinc-700/10" />
          </div>

          {/* 3. Dynamic Moving Aurora Orbs (동적 오로라 오알브) */}
          <div className="absolute left-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-violet-600/12 blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[120px] animate-[pulse_12s_ease-in-out_infinite_1s]" />
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px] animate-[pulse_15s_ease-in-out_infinite_2s]" />

          {/* 4. AI Studio Concept Blueprint Backdrop Image (은은한 백그라운드 디자인 패턴) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] mix-blend-screen select-none [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]">
            <Image
              src="/images/hero_tech_bg_v2.png"
              alt="AI Studio Concept Blueprint"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center flex flex-col items-center">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-550/30 dark:border-zinc-800 bg-white/5 dark:bg-zinc-900/80 px-4 py-2 text-sm font-black text-violet-400 shadow-sm">
              <Sparkles size={16} />
              Open Beta(Ver3.0) · 현재 베타 버전으로 무료 체험 가능
            </div>

            <h1 className="break-keep text-4xl font-black leading-tight tracking-tight text-white md:text-6xl max-w-4xl">
              AI 콘텐츠 제작을
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                하나의 포털 스튜디오에서
              </span>
            </h1>

            <p className="mt-6 max-w-2xl break-keep text-lg font-medium leading-relaxed text-zinc-400">
              글쓰기, 이미지 제작, 무료 미디어 에셋 라이브러리, 유튜브 트렌드 분석, AI 홈페이지 제작까지 
              크리에이터에게 꼭 필요한 도구들을 로그인 장벽 없이 즉시 만나보세요.
            </p>

            {/* Smart Search / Prompt Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-10 w-full max-w-2xl">
              <div className="relative flex items-center rounded-3xl border border-slate-800 dark:border-zinc-800 bg-slate-900 dark:bg-zinc-900 p-2 shadow-xl focus-within:border-violet-400 transition">
                <Search className="ml-4 text-zinc-500 shrink-0" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full bg-transparent px-4 py-3 text-sm font-bold outline-none placeholder-zinc-650 text-zinc-100"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-950 px-7 py-4 text-base font-black shadow-sm transition hover:scale-[1.02] hover:bg-violet-100 cursor-pointer"
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
          </div>
        </section>

        {/* Categories Section - Light Block */}
        <section className="w-full bg-white dark:bg-zinc-950 py-24 border-b border-slate-200/50 dark:border-zinc-900/80">
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
            
            {/* 콘텐츠 아이디어 허브 메인 헤더 */}
            <div className="mx-auto max-w-3xl text-center mb-16">
              <p className="text-sm font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                CREAIBOX CONTENT IDEA HUB
              </p>
              <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                콘텐츠 아이디어 허브
              </h2>
              <p className="mt-5 break-keep text-lg font-medium leading-relaxed text-slate-650 dark:text-zinc-400">
                어떤 글을 써야 할지 고민되시나요? 10대 대분류와 55개 상세 분야에서 제공하는 
                수만 가지 핵심 키워드 아이디어와 기획 시리즈 추천을 통해 창작의 영감을 즉시 얻어가세요.
              </p>
            </div>
            {/* 대분류 탐색 (10개) */}
            <div className="mt-12 w-full text-left">
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
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
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

        {/* Portal Tools Grid - Dark Block */}
        <section id="features" className="w-full bg-slate-950 dark:bg-black py-24 text-white border-b border-slate-900 dark:border-zinc-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-sm font-black uppercase tracking-widest text-violet-400">
              OPEN WORKSPACE
            </p>
            <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-white md:text-5xl">
              바로 체험 가능한 스튜디오 도구
            </h2>
            <p className="mt-5 break-keep text-lg font-medium text-zinc-400">
              카드 내에서 직접 기능을 사용해 보거나 클릭 시 즉시 독립 도구 페이지로 연결됩니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portalTools.map((tool) => (
              <div
                key={tool.title}
                onClick={() => router.push(tool.href)}
                className="group flex flex-col justify-between rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-900/40 hover:shadow-xl cursor-pointer h-full"
              >
                <div className="text-left">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner">
                      {tool.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-violet-400 transition">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-zinc-400 break-keep">
                    {tool.desc}
                  </p>
                </div>

                {/* Preview Frame */}
                <div className="flex-1 mt-4 mb-2 overflow-hidden h-full">
                  {tool.preview}
                </div>

                {/* Action button inside card */}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800/65">
                  <span className="text-xs font-black text-zinc-500 group-hover:text-violet-400 transition">
                    바로가기
                  </span>
                  <ArrowRight size={14} className="text-zinc-500 group-hover:translate-x-1 group-hover:text-violet-400 transition" />
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Core Value Statement - Light Block */}
        <section className="w-full bg-slate-50/70 dark:bg-[#0c0d12]/40 py-24 border-b border-slate-200/50 dark:border-zinc-900/80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-650 dark:text-blue-400">
                  CREATOR FLOW
                </p>
                <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                  단절 없는 콘텐츠 제작,
                  <br />
                  3분 안에 발행 완료
                </h2>
                <p className="mt-5 break-keep text-lg font-medium leading-relaxed text-slate-650 dark:text-zinc-400">
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

        {/* Blog Editor Preview Section - Dark Block */}
        <section className="w-full bg-slate-950 dark:bg-black py-24 border-b border-slate-900 dark:border-zinc-950 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest text-violet-400">
                CREAIBOX TIPTAP BLOG EDITOR
              </p>
              <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-white md:text-5xl leading-tight">
                크리에이박스 블로그 글쓰기 에디터
              </h2>
              <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-relaxed text-zinc-400">
                AI 자동 글쓰기부터 풍부한 미디어 라이브러리 연동, 그리고 검색 노출을 위한 SEO 최적화 세팅까지 
                불필요한 화면 전환 없이 하나의 작업 공간에서 매끄럽고 완벽하게 수행합니다.
              </p>
            </div>

            <div className="mt-12 relative mx-auto max-w-6xl">
              {/* 배경 네온 발광 효과 */}
              <div className="absolute -inset-1.5 rounded-[26px] bg-gradient-to-r from-violet-600 to-blue-600 opacity-25 blur-xl dark:opacity-40" />
              
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 dark:border-white/10 shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/landingpage/blog_editor.webp"
                  alt="크리에이박스 블로그 글쓰기 에디터 화면"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  unoptimized={true}
                  priority
                />
                {/* 우측 상단 플로팅 바로가기 버튼 */}
                <button
                  onClick={() => router.push("/studio/writing/creaibox/new-post")}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 dark:bg-white/85 text-white dark:text-slate-950 px-4.5 py-3 text-xs font-black backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white shadow-lg cursor-pointer"
                >
                  블로그 에디터 실행하기
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* 에디터 기능 설명 3열 카드 */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-violet-400">
                  01. AI 자동 글쓰기 & 보정
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  목표 글자수 및 정밀 조율
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  콘텐츠 유형, 글자수, 참조 URL 및 PDF 첨부 등 디테일한 지시 사항을 토대로 완벽한 완성도의 초안 원고를 자동으로 빌드해냅니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                  02. 실시간 미디어 바인딩
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  에셋 서치 및 즉시 삽입
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  글을 쓰는 도중 다른 탭으로 이동할 필요 없이, 왼편 에셋 라이브러리에서 추천 이미지를 검색해 마우스 드래그로 즉각 본문에 매핑합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  03. 스니펫 SEO 최적화 세팅
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  포털 검색 노출 극대화
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  우측 사이드바의 실시간 SEO 스니펫 편집기를 통해 Title, Slug, Meta Description의 최적 길이를 직관적인 프로그레스 바와 검색 결과 모의 뷰로 검증하며 완성합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Editor Preview Section - Light Block */}
        <section className="w-full bg-white dark:bg-zinc-950 py-24 border-b border-slate-100 dark:border-zinc-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest text-rose-500">
                CREAIBOX WEB VIDEO EDITOR
              </p>
              <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl leading-tight">
                크리에이박스 비디오 에디터
              </h2>
              <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                PC에 별도로 무거운 편집 프로그램을 다운로드하거나 설치할 필요가 없습니다. 
                웹 브라우저 상에서 직접 멀티트랙 동영상 편집과 트랜지션, 텍스트 삽입 및 고화질 MP4 내보내기까지 전 과정을 무료로 수행합니다.
              </p>
            </div>

            <div className="mt-12 relative mx-auto max-w-6xl">
              {/* 배경 네온 발광 효과 */}
              <div className="absolute -inset-1.5 rounded-[26px] bg-gradient-to-r from-rose-600 to-amber-500 opacity-20 blur-xl dark:opacity-35" />
              
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/landingpage/video_editor.webp"
                  alt="크리에이박스 비디오 에디터 화면"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  unoptimized={true}
                  priority
                />
                {/* 우측 상단 플로팅 바로가기 버튼 */}
                <button
                  onClick={() => router.push("/video-editor")}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 dark:bg-white/85 text-white dark:text-slate-950 px-4.5 py-3 text-xs font-black backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white shadow-lg cursor-pointer"
                >
                  비디오 에디터 실행하기
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* 에디터 기능 설명 3열 카드 */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-[28px] border border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0c0d12]/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                  01. 100% 무설치 웹 기반
                </span>
                <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                  언제 어디서나 즉시 편집
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                  인터넷 주소창만 있으면 기기 사양에 구애받지 않고 브라우저에서 즉시 작동합니다. 클라우드 기반으로 가볍고 빠른 무설치 작업 환경을 보장합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0c0d12]/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500">
                  02. 멀티트랙 타임라인
                </span>
                <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                  정밀한 레이어 편집 제어
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                  비디오, 오디오, 텍스트, 자막 레이어를 개별 트랙으로 정교하게 결합하고 조율할 수 있습니다. 컷 편집과 재생 속도 조절, 페이드 인/아웃을 간편하게 조작합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200/60 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0c0d12]/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                  03. 고품질 MP4 인코딩
                </span>
                <h4 className="mt-2 text-lg font-black text-slate-950 dark:text-white">
                  원클릭 파일 렌더링 & 저장
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
                  편집이 끝난 결과물은 단 한 번의 클릭으로 로컬 드라이브에 고품질 MP4 동영상 파일로 실시간 렌더링하여 안전하게 소장 및 공유할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Media Library Preview Section - Dark Block */}
        <section className="w-full bg-slate-950 dark:bg-black py-24 border-b border-slate-900 dark:border-zinc-950 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
                CREAIBOX MEDIA LIBRARY
              </p>
              <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-white md:text-5xl leading-tight">
                크리에이박스 미디어 라이브러리
              </h2>
              <p className="mx-auto mt-5 max-w-3xl break-keep text-base font-medium leading-relaxed text-zinc-400">
                웹 이미지 검색, 업로드 에셋 보관, 그리고 자유롭게 소싱할 수 있는 무료 그래픽 리소스까지. 
                크리에이터를 위해 특별하게 엄선된 수만 종류의 고품질 자산 데이터셋을 한눈에 관리하고 편집기에 즉시 결합합니다.
              </p>
            </div>

            <div className="mt-12 relative mx-auto max-w-6xl">
              {/* 배경 네온 발광 효과 */}
              <div className="absolute -inset-1.5 rounded-[26px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-25 blur-xl dark:opacity-40" />
              
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 dark:border-white/10 shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/landingpage/medio_library.webp"
                  alt="크리에이박스 미디어 라이브러리 화면"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  unoptimized={true}
                  priority
                />
                {/* 우측 상단 플로팅 바로가기 버튼 */}
                <button
                  onClick={() => router.push("/library/free-assets")}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 dark:bg-white/85 text-white dark:text-slate-950 px-4.5 py-3 text-xs font-black backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white shadow-lg cursor-pointer"
                >
                  미디어 라이브러리 실행하기
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* 에디터 기능 설명 3열 카드 */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  01. 클라우드 개인 보관소
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  업로드 이미지 원스톱 보관
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  포스트 제작 시 사용하거나 개별 업로드한 미디어 에셋들을 안전하게 클라우드에 영구 소관하여, 언제든 다른 글이나 편집기에서 즉시 호출해 재사용합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-teal-400">
                  02. 풍부한 고품질 공유 에셋
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  풍부한 무료 저작권 리소스
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  저작권 걱정 없이 상업적으로 안전하게 활용할 수 있는 수만 가지의 고화질 이미지와 동영상 에셋 뱅크가 기본 연결되어 풍성한 창작을 돕습니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  03. 스마트 검색 & 필터
                </span>
                <h4 className="mt-2 text-lg font-black text-white">
                  필터링과 초고속 썸네일 매핑
                </h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">
                  키워드 검색, 태그별 분류, 그리고 비디오 호버 스크러빙 동작까지 지원해 방대한 자산 중에서 필요한 에셋을 1초 만에 색출하여 매핑합니다.
                </p>
              </div>
            </div>

            {/* Shutterstock style Categories Exploration */}
            <div className="mt-24 border-t border-zinc-800/60 pt-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left">
                <div>
                  <h3 className="break-keep text-2xl font-black tracking-tight text-white md:text-3xl">
                    카테고리 탐색하기
                  </h3>
                  <p className="mt-2 text-sm font-medium text-zinc-400">
                    전 세계 크리에이터들이 올리는 고화질 이미지와 에셋을 테마별로 만나보세요.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/library/free-assets")}
                  className="mt-4 md:mt-0 text-xs font-black text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  전체 라이브러리 보기 <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "추상 & 그래픽", slug: "art", img: "/images/categories/art.webp" },
                  { name: "기술 & 디지털", slug: "tech", img: "/images/categories/tech.webp" },
                  { name: "미식 & 푸드", slug: "food", img: "/images/categories/food.webp" },
                  { name: "자연 & 풍경", slug: "nature", img: "/images/categories/nature.webp" },
                  { name: "동물 & 야생", slug: "animal", img: "/images/categories/animal.webp" },
                  { name: "배경 & 텍스처", slug: "texture", img: "/images/categories/texture.webp" },
                  { name: "인물 & 라이프", slug: "people", img: "/images/categories/people.webp" },
                  { name: "건축 & 랜드마크", slug: "architecture", img: "/images/categories/architecture.webp" },
                  { name: "패션 & 뷰티", slug: "fashion", img: "/images/categories/fashion.webp" },
                  { name: "비즈니스 & 금융", slug: "business", img: "/images/categories/business.webp" },
                  { name: "교육 & 지식", slug: "education", img: "/images/categories/education.webp" },
                  { name: "의료 & 헬스케어", slug: "health", img: "/images/categories/health.webp" },
                ].map((item) => (
                  <div
                    key={item.slug}
                    onClick={() => router.push(`/library/free-assets?category=${item.slug}`)}
                    className="group flex flex-col text-left cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-sm">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          item.slug === "people" ? "object-top" : ""
                        }`}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized={item.img.startsWith("http")}
                      />
                    </div>
                    <span className="mt-3 text-sm font-black text-zinc-200 group-hover:text-emerald-400 transition leading-tight">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={() => router.push("/library/free-assets")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-850 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 px-8 py-3 text-sm font-black text-zinc-200 transition shadow-md cursor-pointer"
                >
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* API Vault & Security - Light Block */}
        <section className="w-full bg-white dark:bg-zinc-950 py-24 border-t border-slate-100 dark:border-zinc-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[34px] border border-violet-200 dark:border-violet-950 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-zinc-900/30 dark:to-zinc-900/10 p-9">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="break-keep text-3xl font-black text-slate-950 dark:text-white">
                  개인 API 키 연동
                </h3>
                <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-650 dark:text-zinc-400">
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

              <div className="rounded-[34px] border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 p-9 text-slate-950 dark:text-white shadow-sm">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white">
                  <Rocket size={24} />
                </div>
                <h3 className="break-keep text-3xl font-black text-slate-950 dark:text-white">
                  올인원 스튜디오 시작
                </h3>
                <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-600 dark:text-zinc-400">
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
          </div>
        </section>

      </main>



      <Footer />
    </div>
  );
}