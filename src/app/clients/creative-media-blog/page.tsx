"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Eye,
  Clock,
  User,
  Tag,
  Share2,
  Bookmark,
  Heart,
  MessageSquare,
  ArrowRight,
  Flame,
  Search,
  Filter,
  Check,
  Zap,
  Mail,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  ShieldCheck,
  Award,
} from "lucide-react";

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  image: string;
  featured?: boolean;
  editorsPick?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: "ai-agent-2026-trend",
    category: "AI & 테크",
    title: "2026년 자율 AI 에이전트와 웹 서비스의 대격변: 자동화 시대를 이끄는 기술 핵심 분석",
    excerpt: "단순 대화형 AI를 넘어 스스로 판단하고 실행하는 자율 에이전트(Autonomous AI Agents)가 차세대 웹 비즈니스의 판도를 바꾸고 있습니다. 핵심 기술 동향과 실무 적용 사례를 살펴봅니다.",
    content: "2026년 현재 자율 AI 에이전트 기술은 기존의 단발성 텍스트 응답 수준을 넘어, 복잡한 업무 프로세스를 자동화하는 멀티 에이전트 오케스트레이션 단계로 진입했습니다. 구글 및 글로벌 테크 기업들은 에이전틱 워크플로우를 주도하며 웹 인터페이스와 실시간 결합하는 파이프라인을 구축하고 있습니다...",
    author: "김태현 대표 에디터",
    authorRole: "Tech Lead Journalist",
    date: "2026.07.24",
    readTime: "5분 읽기",
    views: 14250,
    likes: 890,
    comments: 124,
    image: "/images/creative-media-blog/tech_ai_hero.png",
    featured: true,
  },
  {
    id: "chromatic-ui-design",
    category: "디자인 & UI/UX",
    title: "크로매틱 글래스모피즘과 다크 모드: 2026년 프리미엄 웹 인터페이스 디자인 가이드라인",
    excerpt: "빛을 다루는 입체감 있는 chromatic glass 조형미와 다크 모드 중심의 현대적 UX 설계법. 사용자의 visual wow factor를 극대화하는 디테일을 정리했습니다.",
    content: "모던 웹 디자인의 최전선에서는 단순 플랫 디자인을 벗어나 빛의 굴절과 깊이감을 직관적으로 표현하는 glassmorphism과 극대화된 다크 모드가 주요 기조로 자리잡았습니다. 색상의 대비와 미세 인터랙션 micro-animation이 가미되어 사용자가 웹사이트에 들어서는 순간 압도적인 세련미를 전달합니다...",
    author: "이소연 수석 디자이너",
    authorRole: "Principal UI/UX Specialist",
    date: "2026.07.23",
    readTime: "4분 읽기",
    views: 9820,
    likes: 640,
    comments: 58,
    image: "/images/creative-media-blog/design_trend.png",
    featured: true,
    editorsPick: true,
  },
  {
    id: "dofollow-seo-backlink-strategy",
    category: "마케팅 & 인사이트",
    title: "구글 SEO 메커니즘을 꿰뚫는 DoFollow 백링크 가산점 구조와 자동화 엔지니어링",
    excerpt: "검색 엔진 노출 정상을 탈환하기 위한 최신 DoFollow 백링크 구조 설계와 검색 인덱싱 속도를 3배 이상 끌어올리는 기술적 SEO 전략 전략서.",
    content: "검색엔진의 알고리즘은 지속적으로 고도화되고 있지만, 여전히 권위 있는 사이트 간의 DoFollow 연관 링크 구조는 최고 수준의 SEO 가산점 인자입니다. 고품질 원본 콘텐츠와 구조화된 메타 데이터가 결합될 때 검색 결과 최상위에 신속히 안착할 수 있습니다...",
    author: "박민준 마케팅 이사",
    authorRole: "SEO & Growth Director",
    date: "2026.07.22",
    readTime: "6분 읽기",
    views: 11400,
    likes: 720,
    comments: 92,
    image: "/images/creative-media-blog/tech_ai_hero.png",
    editorsPick: true,
  },
  {
    id: "creator-automation-pipeline",
    category: "크리에이터 & 이슈",
    title: "1인 미디어 지식 창업가를 위한 월 1억 자동화 콘텐츠 시스템 구축 가이드",
    excerpt: "AI 기사 작성부터 이미지 생성, 커스텀 도메인 배포까지 1인 창업가가 24시간 자율 구동되는 미디어 포털을 운영하는 파이프라인 전격 공개.",
    content: "1인 미디어와 지식 창업의 시대에서 경쟁력은 콘텐츠 생산 속도와 브랜드 독립성에 있습니다. 커스텀 블로그 인프라와 AI 생산 도구를 결합하여 최소 비용으로 최대 효과를 도출하는 가이드를 소개합니다...",
    author: "최성민 파트너 에디터",
    authorRole: "Creator Economy Analyst",
    date: "2026.07.21",
    readTime: "5분 읽기",
    views: 8900,
    likes: 540,
    comments: 47,
    image: "/images/creative-media-blog/design_trend.png",
    editorsPick: true,
  },
  {
    id: "nextjs-server-actions-perf",
    category: "AI & 테크",
    title: "Next.js App Router와 Server Actions를 활용한 0.1초 렌더링 성능 최적화",
    excerpt: "풀스택 웹 프레임워크 최신 버전을 기반으로 대규모 라이브 트래픽을 지연 없이 처리하는 프론트엔드 아키텍처 정밀 분석.",
    content: "클라이언트 사이드 번들 사이즈를 최소화하고, 서버 컴포넌트 스트리밍을 결합하여 LCP와 INP 지표를 극적으로 개선하는 실무 노하우...",
    author: "김태현 대표 에디터",
    authorRole: "Tech Lead Journalist",
    date: "2026.07.20",
    readTime: "4분 읽기",
    views: 8300,
    likes: 510,
    comments: 41,
    image: "/images/creative-media-blog/tech_ai_hero.png",
  },
  {
    id: "brand-storytelling-2026",
    category: "마케팅 & 인사이트",
    title: "고객의 마음을 사로잡는 100% 독창적인 브랜드 스토리텔링과 아티클 구성 법",
    excerpt: "단순 광고성 글을 넘어 고객이 자발적으로 체류하고 공유하게 만드는 감성 스토리텔링의 핵심 법칙 5가지를 공개합니다.",
    content: "소비자는 이제 단순 상품의 기능보다 브랜드가 품고 있는 진정성 있는 철학과 스토리에 열광합니다...",
    author: "정유진 에디터",
    authorRole: "Content Strategist",
    date: "2026.07.18",
    readTime: "3분 읽기",
    views: 6700,
    likes: 430,
    comments: 32,
    image: "/images/creative-media-blog/design_trend.png",
  },
];

const FAQ_ITEMS = [
  {
    q: "크리에이티브 미디어 블로그의 아티클은 어떻게 발행되나요?",
    a: "매일 전문 에디터진의 검수를 거친 최신 IT 테크, UI/UX 디자인, 그로스 마케팅 전문 정보가 실시간 발행되며, CreAibox AI 엔진과 연동되어 100% 독창적인 고품질 아티클이 신속히 공급됩니다.",
  },
  {
    q: "개인 브랜드나 기업도 커스텀 블로그 템플릿으로 1초 구축할 수 있나요?",
    a: "네! CreAibox 커스텀 웹사이트 마켓에서 본 '크리에이티브 미디어 블로그 V1'을 선택하시면 단 1초 만에 희망하시는 서브도메인(.creaibox.com)으로 나만의 독립 포털 블로그가 자동 배포됩니다.",
  },
  {
    q: "DoFollow SEO 백링크 가산점 구조란 무엇인가요?",
    a: "검색 엔진(구글, 네이버)이 높은 신뢰도를 부여하는 DoFollow 사이트 간 링크 인덱싱 메커니즘을 지원하여, 검색 결과 상단에 내 브랜드와 글이 빠르게 노출되도록 돕는 프리미엄 SEO 가산점 인프라입니다.",
  },
];

export default function CreativeMediaBlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const categories = ["전체", "AI & 테크", "디자인 & UI/UX", "마케팅 & 인사이트", "크리에이터 & 이슈"];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === "전체" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const editorsPickArticles = ARTICLES.filter((a) => a.editorsPick);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 space-y-16">
      {/* SECTION 1: HERO FEATURED BANNER */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Main Featured Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3.5 py-1 text-xs font-black text-cyan-300">
                  <Sparkles size={13} className="text-cyan-400" />
                  HOT FEATURED ARTICLE
                </span>
                <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-black text-amber-300 flex items-center gap-1">
                  <Flame size={13} /> 실시간 트렌드 1위
                </span>
              </div>

              <h1
                onClick={() => setActiveArticle(ARTICLES[0])}
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {ARTICLES[0].title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed line-clamp-3">
                {ARTICLES[0].excerpt}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black text-xs">
                    김
                  </div>
                  <span className="text-slate-200">{ARTICLES[0].author}</span>
                </div>
                <span className="flex items-center gap-1"><Clock size={13} /> {ARTICLES[0].date} ({ARTICLES[0].readTime})</span>
                <span className="flex items-center gap-1 text-cyan-400"><Eye size={13} /> {ARTICLES[0].views.toLocaleString()}회 읽음</span>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setActiveArticle(ARTICLES[0])}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20"
                >
                  아티클 전문 읽기 <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => toggleLike(ARTICLES[0].id)}
                  className={`flex items-center gap-1.5 rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
                    likedMap[ARTICLES[0].id]
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <Heart size={14} className={likedMap[ARTICLES[0].id] ? "fill-rose-400 text-rose-400" : ""} />
                  <span>{ARTICLES[0].likes + (likedMap[ARTICLES[0].id] ? 1 : 0)}</span>
                </button>
              </div>
            </div>

            {/* Right: Featured Hero Image */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setActiveArticle(ARTICLES[0])}
                className="relative rounded-3xl border border-slate-800 overflow-hidden shadow-2xl group cursor-pointer aspect-video sm:aspect-[4/3]"
              >
                <Image
                  src={ARTICLES[0].image}
                  alt={ARTICLES[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-black backdrop-blur-md bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <span className="truncate">IT · Tech Trend Portal Special</span>
                  <span className="text-cyan-400 flex items-center gap-1"><Zap size={13} /> DoFollow Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: EDITOR'S CHOICE 3-CARD SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={20} />
            <h2 className="text-xl font-black text-white">에디터스 픽 (Editor's Choice)</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">엄선된 전문 인사이트</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorsPickArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <Image src={art.image} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2 left-2 rounded-full bg-slate-950/80 border border-slate-700 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 backdrop-blur-md">
                    {art.category}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="text-slate-300">{art.author}</span>
                <span className="text-cyan-400 flex items-center gap-1"><Eye size={12} /> {art.views.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: LIVE MEDIA STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">180,000+</p>
              <p className="text-xs font-bold text-slate-400">월간 누적 독자 수</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">1,240건</p>
              <p className="text-xs font-bold text-slate-400">발행 아티클 수</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">99점</p>
              <p className="text-xs font-bold text-slate-400">DoFollow SEO 지표</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-indigo-400">단 1초</p>
              <p className="text-xs font-bold text-slate-400">자동 사이트 구축 시간</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CATEGORY FILTER & MAIN ARTICLE FEED WITH SIDEBAR */}
      <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="아티클 검색 (제목, 키워드)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 text-xs font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Main Articles Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                최신 아티클 피드 <span className="text-cyan-400 font-bold text-sm">({filteredArticles.length}개)</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">최신순 정렬</span>
            </div>

            <div className="space-y-6">
              {filteredArticles.map((art) => (
                <article
                  key={art.id}
                  className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col sm:flex-row gap-5 items-stretch"
                >
                  <div
                    onClick={() => setActiveArticle(art)}
                    className="relative w-full sm:w-[220px] h-[160px] shrink-0 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group/img cursor-pointer"
                  >
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-full bg-slate-950/80 border border-slate-700 px-2.5 py-0.5 text-[10px] font-black text-cyan-300 backdrop-blur-md">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>{art.author}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{art.readTime}</span>
                      </div>

                      <h3
                        onClick={() => setActiveArticle(art)}
                        className="text-base font-black text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {art.title}
                      </h3>

                      <p className="text-xs font-medium text-slate-300 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-slate-300"><Eye size={13} /> {art.views.toLocaleString()}</span>
                        <button
                          onClick={() => toggleLike(art.id)}
                          className={`flex items-center gap-1 transition-colors ${likedMap[art.id] ? "text-rose-400" : "hover:text-rose-400"}`}
                        >
                          <Heart size={13} className={likedMap[art.id] ? "fill-rose-400" : ""} /> {art.likes + (likedMap[art.id] ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1"><MessageSquare size={13} /> {art.comments}</span>
                      </div>

                      <button
                        onClick={() => setActiveArticle(art)}
                        className="text-xs font-black text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        전문 읽기 <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Ranking & Newsletter Sidebar (4 Cols) */}
          <div id="ranking" className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="text-amber-400" size={18} />
                  <h3 className="text-sm font-black text-white">실시간 인기 랭킹 Top 5</h3>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>

              <div className="space-y-3.5">
                {ARTICLES.slice(0, 5).map((art, idx) => (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className="group flex items-start gap-3 p-2 rounded-2xl hover:bg-slate-950/60 transition-all cursor-pointer"
                  >
                    <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      idx === 0 ? "bg-amber-500 text-slate-950" : idx === 1 ? "bg-slate-300 text-slate-950" : idx === 2 ? "bg-amber-800 text-amber-200" : "bg-slate-800 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                        <span>{art.author}</span>
                        <span>•</span>
                        <span className="text-cyan-400">{art.views.toLocaleString()}회 읽음</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-xl" />
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <h3 className="text-base font-black text-white">매주 월요일 트렌드 뉴스레터 구독</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  AI 에이전트, 개발 트렌드, UI/UX 디자인 인사이트를 메일함으로 받아보세요.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); alert("구독 신청이 완료되었습니다!"); }} className="space-y-2.5 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="내 이메일 주소 입력..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md"
                  >
                    무료 뉴스레터 신청
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 text-xs font-black text-cyan-300">
            <HelpCircle size={13} /> 자주 묻는 질문 (FAQ)
          </div>
          <h2 className="text-xl font-black text-white">크리에이티브 미디어 블로그 가이드</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-extrabold text-white hover:text-cyan-300 transition-colors"
              >
                <span>{item.q}</span>
                {expandedFaqIndex === idx ? <ChevronUp size={16} className="text-cyan-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              {expandedFaqIndex === idx && (
                <div className="p-4 pt-0 border-t border-slate-800/80 text-xs font-medium text-slate-300 leading-relaxed bg-slate-950/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
              <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-0.5 text-xs font-black text-cyan-300">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 border-b border-slate-800 pb-4">
                  <span>작성자: {activeArticle.author} ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span className="text-cyan-400">{activeArticle.views.toLocaleString()}회 읽음</span>
                </div>
              </div>

              <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border border-slate-800">
                <Image src={activeArticle.image} alt={activeArticle.title} fill className="object-cover" />
              </div>

              <div className="space-y-4 text-sm font-medium text-slate-300 leading-relaxed">
                <p className="text-base font-bold text-white leading-relaxed p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  {activeArticle.excerpt}
                </p>
                <p>{activeArticle.content}</p>
                <p>
                  2026년 하반기 검색 엔진과 소셜 미디어 플랫폼은 자율 AI 에이전트의 구동에 최적화된 도메인 구조와 100% 독창적인 지식 콘텐츠에 더 높은 권위 점수를 부여하고 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950 shrink-0">
              <button
                onClick={() => toggleLike(activeArticle.id)}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                  likedMap[activeArticle.id]
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
                }`}
              >
                <Heart size={14} className={likedMap[activeArticle.id] ? "fill-rose-400" : ""} />
                <span>좋아요 {activeArticle.likes + (likedMap[activeArticle.id] ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
