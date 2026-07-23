"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Wand2,
  Palette,
  MessageSquare,
  FileText,
  Settings,
  Library,
  PenTool,
  Music,
  Video,
  Archive,
  Brain,
  Lightbulb,
  Sparkles,
  CalendarDays,
  Bot,
  PenLine,
  Edit3,
  RefreshCw,
  Eye,
  CircleHelp,
  Waves,
  Languages,
  Tags,
  PlayCircle,
  Folder,
  Save,
  Database,
  MessageCircle,
  Search,
  Layers,
  PieChart,
  LineChart,
  Award,
  Share2,
  Send,
  Building2,
  Newspaper,
  Gauge,
  Rss,
  Radio,
  Megaphone,
  Users,
  Bell,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Server,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Disc,
  Play,
  Mic2,
  Disc3,
  BadgeDollarSign,
  Eraser,
  Maximize,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import { SiYoutube, SiNaver } from "react-icons/si";

export default function StudioPage() {
  const statusCards = [
    {
      label: "생성 가능 도구",
      value: "20+",
      icon: Zap,
    },
    {
      label: "최근 작업",
      value: "3",
      icon: Clock,
    },
    {
      label: "저장된 콘텐츠",
      value: "Library",
      icon: Library,
    },
    {
      label: "스튜디오 상태",
      value: "Beta",
      icon: CheckCircle2,
    },
    {
      label: "대시보드",
      value: "바로가기",
      icon: LayoutDashboard,
      href: "/studio/dashboard",
    },
  ];

  const menuGroups = [
    {
      key: "client-site-builder",
      name: "비즈니스 웹사이트",
      href: "/studio/client-site-builder",
      icon: Globe,
      color: "from-emerald-600 to-teal-500 text-emerald-400 bg-emerald-500/10",
      children: [
        { name: "대시보드", href: "/studio/client-site-builder", icon: LayoutDashboard },
        { name: "섹션 레이아웃 변경", href: "/studio/client-site-builder/builder", icon: Wand2 },
        { name: "디자인 테마", href: "/studio/client-site-builder/themes", icon: Palette },
        { name: "고객 문의", href: "/studio/client-site-builder/inquiries", icon: MessageSquare },
        { name: "페이지 & 글", href: "/studio/client-site-builder/posts", icon: FileText },
        { name: "홈 설정", href: "/studio/client-site-builder/settings", icon: Settings },
      ],
    },
    {
      key: "library",
      name: "내 콘텐츠 보관함",
      href: "/library",
      icon: Library,
      color: "from-sky-600 to-blue-500 text-sky-400 bg-sky-500/10",
      children: [
        { name: "크리에이박스", href: "/library/creaibox", icon: PenTool },
        { name: "네이버 글", href: "/library/naver", icon: SiNaver },
        { name: "뉴스 자료", href: "/library/news", icon: Rss },
        { name: "음악 / 가사", href: "/library/music", icon: Music },
        { name: "이미지 에셋", href: "/library/image", icon: ImageIcon },
        { name: "비디오 에셋", href: "/library/video", icon: Video },
      ],
    },
    {
      key: "creassetbox",
      name: "미디어 라이브러리",
      href: "/library/free-assets",
      icon: Archive,
      color: "from-amber-600 to-yellow-500 text-amber-400 bg-amber-500/10",
    },
    {
      key: "idea-hub",
      name: "콘텐츠 아이디어 허브",
      href: "/content-planner/idea-hub",
      icon: Lightbulb,
      color: "from-amber-600 to-yellow-500 text-amber-400 bg-amber-500/10",
    },
    {
      key: "creaibox-writing",
      name: "크리에이박스 블로그",
      href: "/writing/creaibox",
      icon: PenTool,
      color: "from-violet-600 to-fuchsia-500 text-violet-400 bg-violet-500/10",
      children: [
        { name: "블로그 새글 쓰기", href: "/writing/creaibox/new-post", icon: PenLine },
        { name: "블로그 원고 관리", href: "/writing/creaibox/list", icon: Archive },
        { name: "네이버/SNS 재발행", href: "/writing/creaibox/recreate", icon: RefreshCw },
        { name: "AI 콘텐츠 기획", href: "/content-planner/planning", icon: Sparkles },
        { name: "기획 보관함", href: "/content-planner/library", icon: Library },
        { name: "콘텐츠 캘린더", href: "/content-planner/calendar", icon: CalendarDays },
        { name: "워크플로우", href: "/content-planner/workflow", icon: Bot },
        { name: "블로그 설정 및 관리", href: "/writing/creaibox/blog-management", icon: Settings },
        { name: "썸네일 메이커", href: "/writing/creaibox/thumbnail", icon: ImageIcon },
        { name: "지식 & 페르소나", href: "/writing/creaibox/knowledge", icon: Database },
      ],
    },
    {
      key: "music",
      name: "뮤직 스튜디오",
      href: "/music",
      icon: Music,
      color: "from-rose-600 to-orange-500 text-rose-400 bg-rose-500/10",
      children: [
        { name: "가사 소재 허브", href: "/music/lyrics/idea-hub", icon: Lightbulb },
        { name: "AI 앨범 기획", href: "/music/planning", icon: Sparkles },
        { name: "가사 & SUNO", href: "/music/lyrics", icon: Mic2 },
        { name: "Suno 곡 생성", href: "/music/suno-generator", icon: Wand2 },
        { name: "생성곡 라이센스", href: "/music/library", icon: Mic2 },
        { name: "앨범 관리", href: "/music/albums", icon: Disc },
        { name: "스타일 포맷", href: "/music/style-format", icon: Palette },
        { name: "오디오 비주얼", href: "/music/visualizer", icon: Waves },
        { name: "커버 이미지", href: "/music/cover-image", icon: ImageIcon },
        { name: "영상 프롬프트", href: "/music/video-prompt", icon: Video },
        { name: "다국어 번역", href: "/music/translate", icon: Languages },
        { name: "유튜브 최적화", href: "/music/youtube-seo", icon: SiYoutube },
        { name: "태그 관리", href: "/music/tags", icon: Tags },
      ],
    },
    {
      key: "design",
      name: "디자인 스튜디오",
      href: "/design",
      icon: ImageIcon,
      color: "from-purple-600 to-pink-500 text-purple-400 bg-purple-500/10",
      children: [
        { name: "디자인 편집기", href: "/design/workspace", icon: Wand2 },
        { name: "템플릿 목록", href: "/design/templates", icon: Library },
        { name: "AI 매직 디자인", href: "/design/magic-design", icon: Sparkles },
        { name: "브랜드 키트", href: "/design/brand-kit", icon: Palette },
        { name: "프롬프트", href: "/design/prompts", icon: Library },
        { name: "썸네일 메이커", href: "/design/thumbnail", icon: ImageIcon },
        { name: "포스터 & 전단", href: "/design/poster", icon: FileText },
        { name: "디지털 명함", href: "/design/business-card", icon: BadgeDollarSign },
        { name: "현수막 & 배너", href: "/design/banner", icon: Megaphone },
        { name: "AI 업스케일러", href: "/design/upscaler", icon: Sparkles },
        { name: "확장자 변환기", href: "/design/converter", icon: RefreshCw },
        { name: "배경 제거기", href: "/design/bg-remover", icon: Eraser },
        { name: "크기 조절기", href: "/design/resizer", icon: Maximize },
        { name: "WEBP 압축기", href: "/design/webp-compressor", icon: Gauge },
      ],
    },
    {
      key: "video",
      name: "비디오 스튜디오",
      href: "/video",
      icon: Video,
      color: "from-teal-600 to-emerald-500 text-teal-400 bg-teal-500/10",
      children: [
        { name: "영상 편집기", href: "/video/editor", icon: Video },
        { name: "쇼츠 & 릴스", href: "/video/shorts", icon: PlayCircle },
        { name: "영상 프롬프트", href: "/video/prompts", icon: Sparkles },
        { name: "자막 & 음성", href: "/video/subtitle", icon: Mic2 },
        { name: "영상 템플릿", href: "/video/templates", icon: LayoutDashboard },
        { name: "썸네일 연동", href: "/video/thumbnail", icon: ImageIcon },
        { name: "프로젝트 관리", href: "/video/projects", icon: Folder },
        { name: "렌더링 관리", href: "/video/render", icon: Save },
        { name: "영상 설정", href: "/video/settings", icon: Settings },
      ],
    },
    {
      key: "research",
      name: "자료 분석 스튜디오",
      href: "/research",
      icon: Database,
      color: "from-indigo-600 to-blue-500 text-indigo-400 bg-indigo-500/10",
      children: [
        { name: "새 자료 분석", href: "/research/create", icon: FileText },
        { name: "자료 보관함", href: "/research/library", icon: Archive },
        { name: "AI 채팅", href: "/research/chat", icon: MessageCircle },
        { name: "콘텐츠 생성", href: "/research/content", icon: Sparkles },
        { name: "프로젝트 관리", href: "/research/projects", icon: Folder },
        { name: "설정", href: "/research/settings", icon: Settings },
      ],
    },
    {
      key: "keyword",
      name: "키워드 트렌드",
      href: "/keyword-trend",
      icon: Search,
      color: "from-cyan-600 to-teal-500 text-cyan-400 bg-cyan-500/10",
      children: [
        { name: "키워드 대량 조회", href: "/keyword-trend/bulk", icon: Database },
        { name: "연관 키워드 발굴", href: "/keyword-trend/related", icon: Layers },
        { name: "형태소 분석", href: "/keyword-trend/morphology", icon: PieChart },
        { name: "실시간 순위 추적", href: "/keyword-trend/rank", icon: LineChart },
        { name: "급상승 분석", href: "/keyword-trend/rising", icon: TrendingUp },
        { name: "유튜브 키워드", href: "/keyword-trend/youtube", icon: SiYoutube },
        { name: "SEO 경쟁 분석", href: "/keyword-trend/seo", icon: Search },
        { name: "AI 키워드 전략", href: "/keyword-trend/strategy", icon: Bot },
        { name: "자동 콘텐츠 연결", href: "/keyword-trend/workflow", icon: Sparkles },
        { name: "트렌드 대시보드", href: "/keyword-trend/dashboard", icon: BarChart3 },
      ],
    },
    {
      key: "youtube",
      name: "유튜브 트렌드",
      href: "/youtube-trend/rising",
      icon: SiYoutube,
      color: "from-red-600 to-orange-500 text-red-400 bg-red-500/10",
      children: [
        { name: "유튜브 랭킹 TOP 300", href: "/youtube-trend/top300", icon: Award },
        { name: "유튜브 영상 검색", href: "/youtube-trend/search", icon: Search },
        { name: "급상승 영상", href: "/youtube-trend/rising", icon: TrendingUp },
        { name: "영상분석 리포트", href: "/youtube-trend/reports", icon: FileText },
        { name: "인기채널 분석", href: "/youtube-trend/channel", icon: Users },
        { name: "경쟁 채널 비교", href: "/youtube-trend/compare", icon: BarChart3 },
        { name: "광고 단가 계산", href: "/youtube-trend/cpm", icon: Database },
        { name: "유튜브 SEO 분석", href: "/youtube-trend/seo", icon: Search },
        { name: "쇼츠 바이럴", href: "/youtube-trend/shorts", icon: Video },
        { name: "썸네일 CTR", href: "/youtube-trend/thumbnail", icon: ImageIcon },
      ],
    },
    {
      key: "publish",
      name: "채널 배포 스튜디오",
      href: "/publish",
      icon: Share2,
      color: "from-rose-600 to-pink-500 text-rose-400 bg-rose-500/10",
      children: [
        { name: "AI 쇼츠 생성", href: "/publish", icon: Sparkles },
        { name: "SNS 통합 발행", href: "/publish/posts", icon: Send },
        { name: "채널 연동 관리", href: "/publish/channels", icon: Settings },
        { name: "발행 이력 및 통계", href: "/publish/history", icon: BarChart3 },
      ],
    },
    {
      key: "report",
      name: "AI 리포트(개발중)",
      href: "/aireport",
      icon: FileText,
      color: "from-indigo-600 to-violet-500 text-indigo-400 bg-indigo-500/10",
      children: [
        { name: "AI 시장 리포트", href: "/report/market", icon: BarChart3 },
        { name: "산업별 AI 분석", href: "/report/industry", icon: Building2 },
        { name: "AI 뉴스 브리핑", href: "/report/news", icon: Newspaper },
        { name: "AI 툴 비교 분석", href: "/report/tools", icon: Layers },
        { name: "AI 생산성 리포트", href: "/report/productivity", icon: Gauge },
        { name: "AI 투자 분석", href: "/report/investment", icon: LineChart },
        { name: "AI 트렌드 예측", href: "/report/forecast", icon: TrendingUp },
        { name: "AI 리서치 센터", href: "/report/research", icon: Database },
      ],
    },
    {
      key: "news",
      name: "뉴스 콘텐츠(개발중)",
      href: "/news",
      icon: Newspaper,
      color: "from-orange-600 to-amber-500 text-orange-400 bg-orange-500/10",
      children: [
        { name: "실시간 뉴스 수집", href: "/news/collect", icon: Rss },
        { name: "AI 뉴스 요약", href: "/news/summary", icon: Sparkles },
        { name: "뉴스 블로그 생성", href: "/news/blog", icon: FileText },
        { name: "실시간 이슈 탐지", href: "/news/issue", icon: Radio },
        { name: "뉴스 트렌드 분석", href: "/news/trend", icon: BarChart3 },
        { name: "뉴스 자동 발행", href: "/news/publish", icon: Megaphone },
      ],
    },
    {
      key: "tools",
      name: "스튜디오 Tools",
      href: "/utility-tools",
      icon: Wand2,
      color: "from-amber-600 to-yellow-500 text-amber-400 bg-amber-500/10",
      children: [
        { name: "AI 누끼 제거", href: "/utility-tools/bg-remover", icon: Wand2 },
        { name: "PDF 문서 분석", href: "/utility-tools/pdf-analyzer", icon: FileText },
        { name: "AI OCR 문자 추출", href: "/utility-tools/ocr", icon: Eye },
        { name: "AI 프롬프트", href: "/utility-tools/prompt-studio", icon: Sparkles },
        { name: "해시태그 생성", href: "/utility-tools/hashtag", icon: Tags },
        { name: "색상 추출기", href: "/utility-tools/color-picker", icon: Palette },
      ],
    },
    {
      key: "community",
      name: "커뮤니티",
      href: "/community",
      icon: Users,
      color: "from-pink-650 to-rose-500 text-pink-400 bg-pink-500/10",
      children: [
        { name: "실시간 채팅", href: "/community/chat", icon: MessageCircle },
        { name: "글쓰기 게시판", href: "/community/writing", icon: PenTool },
        { name: "네이버 블로그", href: "/community/naver", icon: SiNaver },
        { name: "뮤직 스튜디오", href: "/community/music", icon: Music },
      ],
    },
    {
      key: "infocenter",
      name: "인포센터",
      href: "/infocenter",
      icon: CircleHelp,
      color: "from-amber-600 to-orange-500 text-amber-400 bg-amber-500/10",
      children: [
        { name: "공지사항", href: "/infocenter/list/notices", icon: Bell },
        { name: "자유게시판", href: "/infocenter/list/freeboard", icon: MessageSquare },
        { name: "꿀팁 / 노하우", href: "/infocenter/list/tips", icon: Lightbulb },
        { name: "FAQ", href: "/infocenter/list/faq", icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 text-zinc-800 dark:text-zinc-100 min-h-screen transition-colors duration-300">
      
      {/* 1. STATUS CARDS (최상단 1줄 가로 배치) */}
      <section className="grid grid-cols-5 gap-2 lg:gap-4">
        {statusCards.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm lg:text-base font-black text-zinc-900 dark:text-white leading-tight truncate">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[9px] md:text-[10px] lg:text-xs font-bold text-slate-550 dark:text-zinc-500 leading-tight truncate">
                  {item.label}
                </p>
              </div>
            </>
          );

          const cardClass = "rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0c0d12]/45 p-3 lg:p-4 shadow-sm backdrop-blur transition-all flex items-center gap-2 lg:gap-3 hover:border-violet-500/30 hover:scale-[1.02]";

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={cardClass}>
                {content}
              </Link>
            );
          }

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0c0d12]/45 p-3 lg:p-4 shadow-sm backdrop-blur flex items-center gap-2 lg:gap-3"
            >
              {content}
            </div>
          );
        })}
      </section>

      {/* 2. MAP TITLE SECTION */}
      <section className="border-t border-slate-200 dark:border-zinc-800/80 pt-6">
        <div className="flex items-center gap-2">
          <Sparkles className="text-violet-500 animate-pulse" size={20} />
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            스튜디오 종합 바로가기 허브 Map
          </h2>
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 mt-1">
          사이드바의 모든 카테고리와 서브 도구들을 한눈에 지도 형태로 파악하고 손쉽게 진입하세요.
        </p>
      </section>

      {/* 3. ALL MENUS NAVIGATION HUB MAP */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menuGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.key}
              className="rounded-[24px] border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0d12]/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header: Title + Icon */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${group.color} text-white shadow-sm shrink-0`}>
                      <GroupIcon size={18} />
                    </div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white tracking-tight">
                      {group.name}
                    </h3>
                  </div>

                  {!group.children && (
                    <Link
                      href={group.href}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 transition hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Sub Menu Links (Children) */}
                {group.children ? (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {group.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2 rounded-xl border border-slate-200/50 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-[#08090d]/60 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white hover:border-violet-600 dark:hover:border-violet-600"
                        >
                          <ChildIcon size={12} className="shrink-0 text-slate-400 dark:text-zinc-500 group-hover:text-white" />
                          <span className="truncate">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 flex-1 flex items-center justify-center min-h-[80px]">
                    <Link
                      href={group.href}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800/80 px-4 py-6 text-xs font-bold text-slate-400 dark:text-zinc-500 hover:border-violet-600 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                    >
                      <Sparkles size={12} />
                      단독 메뉴 바로가기
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom Quick Jump Action */}
              {group.children && (
                <div className="mt-5 border-t border-slate-100 dark:border-zinc-800/40 pt-3 text-right">
                  <Link
                    href={group.href}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    전체 도구 보기
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}