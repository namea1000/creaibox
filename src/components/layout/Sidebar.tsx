"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Star,
  HelpCircle,
  MessageCircle,
  Globe,
  FileText,
  Newspaper,
  Sparkles,
  Search,
  ShieldCheck,
  ShieldAlert,
  Server,
  Image as ImageIcon,
  Video,
  Music,
  Mic2,
  BarChart3,
  PenTool,
  Info,
  Layers,
  Library,
  Users,
  Folder,
  Edit3,
  PenLine,
  Archive,
  Lightbulb,
  Database,
  Settings,
  Wand2,
  RefreshCw,
  Eraser,
  FileArchive,
  Eye,
  CircleHelp,
  Tags,
  Save,
  Clock,
  Palette,
  Languages,
  PlayCircle,
  Gauge,
  BadgeDollarSign,
  LineChart,
  TrendingUp,
  Radio,
  Bot,
  Brain,
  Rss,
  Megaphone,
  Building2,
  Bell,
  MessageSquare,
  Share2,
  Disc3,
  Waves,
  CalendarDays,
  Target,
  Maximize,
  type LucideIcon,
} from "lucide-react";

import { SiNaver, SiYoutube } from "react-icons/si";
import { createClient } from "@/utils/supabase/client";



interface SidebarProps {
  activeMenu?: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

type MenuItem = {
  name: string;
  href: string;
  icon?: SidebarIcon;
};

type MenuGroup = {
  key: string;
  name: string;
  href: string;
  icon: SidebarIcon;
  color: string;
  children?: MenuItem[];
};

type SidebarIcon = React.ComponentType<any>;

function PieIcon(props: React.ComponentProps<LucideIcon>) {
  return <BarChart3 {...props} />;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    const checkUser = async (user: any) => {
      if (!mounted) return;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (mounted) {
          if (!error && data && data.role === "ADMIN") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    supabase.auth.getUser().then(({ data: { user } }: any) => {
      void checkUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      void checkUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const menuGroups: MenuGroup[] = useMemo(
    () => [
      {
        key: "workspace",
        name: "스튜디오 홈",
        href: "/studio",
        icon: LayoutDashboard,
        color: "text-blue-400",
      },

      {
        key: "client-site-builder",
        name: "AI 홈페이지 제작",
        href: "/studio/client-site-builder",
        icon: Globe,
        color: "text-emerald-400",
        children: [
          { name: "스튜디오 홈", href: "/studio/client-site-builder", icon: LayoutDashboard },
          { name: "AI 홈페이지 빌더", href: "/studio/client-site-builder/builder", icon: Wand2 },
          { name: "디자인 테마 라이브러리", href: "/studio/client-site-builder/themes", icon: Palette },
          { name: "고객 문의 관리", href: "/studio/client-site-builder/inquiries", icon: MessageSquare },
          { name: "페이지 & 글 관리", href: "/studio/client-site-builder/posts", icon: FileText },
          { name: "홈페이지 설정", href: "/studio/client-site-builder/settings", icon: Settings },
        ],
      },

      {
        key: "library",
        name: "콘텐츠 라이브러리",
        href: "/studio/library",
        icon: Library,
        color: "text-sky-400",
        children: [
          { name: "크리에이박스 콘텐츠", href: "/studio/library/creaibox", icon: PenTool },
          { name: "네이버 콘텐츠", href: "/studio/library/naver", icon: SiNaver },
          { name: "뉴스 콘텐츠", href: "/studio/library/news", icon: Rss },
          { name: "음악 / 가사 콘텐츠", href: "/studio/library/music", icon: Music },
          { name: "이미지 콘텐츠", href: "/studio/library/image", icon: ImageIcon },
          { name: "비디오 콘텐츠", href: "/studio/library/video", icon: Video },
        ],
      },
      {
        key: "creassetbox",
        name: "크리에셋박스",
        href: "/studio/library/free-assets",
        icon: Archive,
        color: "text-amber-400",
      },
      {
        key: "content-planner",
        name: "AI 콘텐츠 플래너",
        href: "/studio/content-planner",
        icon: Brain,
        color: "text-cyan-400",
        children: [
          { name: "콘텐츠 아이디어 허브", href: "/studio/content-planner/idea-hub", icon: Lightbulb },
          { name: "AI 콘텐츠 기획", href: "/studio/content-planner/planning", icon: Sparkles },
          { name: "기획 라이브러리", href: "/studio/content-planner/library", icon: Library },
          { name: "콘텐츠 캘린더", href: "/studio/content-planner/calendar", icon: CalendarDays },
          { name: "자동화 워크플로우", href: "/studio/content-planner/workflow", icon: Bot },
        ],
      },
      {
        key: "creaibox-writing",
        name: "크리에이박스 글쓰기",
        href: "/studio/writing/creaibox",
        icon: PenTool,
        color: "text-violet-400",
        children: [
          { name: "AI 포스팅 글쓰기", href: "/studio/writing/creaibox/create", icon: Edit3 },
          { name: "블로그 새글 쓰기", href: "/studio/writing/creaibox/new-post", icon: PenLine },
          { name: "발행 원고 관리", href: "/studio/writing/creaibox/list", icon: Archive },
          { name: "블로그 관리", href: "/studio/writing/creaibox/blog-management", icon: Settings },
          { name: "크리아이박스 썸네일", href: "/studio/writing/creaibox/thumbnail", icon: ImageIcon },
          { name: "지식 & 페르소나", href: "/studio/writing/creaibox/knowledge", icon: Database },
        ],
      },
      {
        key: "naver-writing",
        name: "네이버 글쓰기",
        href: "/studio/writing/naver",
        icon: SiNaver,
        color: "text-emerald-400",
        children: [
          { name: "AI 스마트 글쓰기", href: "/studio/writing/naver/create", icon: Edit3 },
          { name: "AI 글 재창조", href: "/studio/writing/naver/recreate", icon: RefreshCw },
          { name: "발행 원고 관리", href: "/studio/writing/naver/list", icon: Archive },
          { name: "네이버용 썸네일", href: "/studio/writing/naver/thumbnail", icon: ImageIcon },
          { name: "네이버 키워드 분석", href: "/studio/writing/naver/keyword", icon: Search },
          { name: "실시간 노출 진단", href: "/studio/writing/naver/diagnosis", icon: Eye },
          { name: "C-Rank 가이드", href: "/studio/writing/naver/guide", icon: CircleHelp },
          { name: "엔진 최적화 세팅", href: "/studio/writing/naver/api", icon: Settings },
        ],
      },
      {
        key: "music",
        name: "뮤직 스튜디오",
        href: "/studio/music",
        icon: Music,
        color: "text-rose-400",
        children: [
          { name: "가사 소재 허브", href: "/studio/music/lyrics/idea-hub", icon: Lightbulb },
          { name: "AI 앨범 기획", href: "/studio/music/planning", icon: Sparkles },
          { name: "가사 & SUNO", href: "/studio/music/lyrics", icon: Mic2 },
          { name: "생성곡 라이브러리", href: "/studio/music/library", icon: Mic2 },
          { name: "앨범 관리", href: "/studio/music/albums", icon: Disc3 },
          { name: "스타일 포맷", href: "/studio/music/style-format", icon: Palette },
          { name: "오디오 스펙트럼", href: "/studio/music/visualizer", icon: Waves, },
          { name: "커버 이미지", href: "/studio/music/cover-image", icon: ImageIcon },
          { name: "영상 프롬프트", href: "/studio/music/video-prompt", icon: Video },
          { name: "번역", href: "/studio/music/translate", icon: Languages },
          { name: "유튜브 최적화", href: "/studio/music/youtube-seo", icon: SiYoutube },
          { name: "태그 관리", href: "/studio/music/tags", icon: Tags },
          { name: "플레이리스트", href: "/studio/music/playlist", icon: Library },
          { name: "프로젝트", href: "/studio/music/projects", icon: Folder },
          { name: "작업 내역", href: "/studio/music/history", icon: Clock },
          { name: "설정", href: "/studio/music/settings", icon: Settings },
        ],
      },

      {
        key: "image",
        name: "이미지 스튜디오",
        href: "/studio/image",
        icon: ImageIcon,
        color: "text-purple-400",
        children: [
          { name: "디자인 편집기", href: "/studio/image/workspace", icon: Wand2 },
          { name: "템플릿 라이브러리", href: "/studio/image/templates", icon: Library },
          { name: "AI 매직 디자인", href: "/studio/image/magic-design", icon: Sparkles },
          { name: "브랜드 키트", href: "/studio/image/brand-kit", icon: Palette },
          { name: "프롬프트 라이브러리", href: "/studio/image/prompts", icon: Library },
          { name: "썸네일 메이커", href: "/studio/image/thumbnail", icon: ImageIcon },
          { name: "포스터 & 전단지", href: "/studio/image/poster", icon: FileText },
          { name: "디지털 명함", href: "/studio/image/business-card", icon: BadgeDollarSign },
          { name: "현수막 & 배너", href: "/studio/image/banner", icon: Megaphone },
          { name: "이미지 AI 업스케일러", href: "/studio/image/upscaler", icon: Sparkles },
          { name: "이미지 확장자 변환기", href: "/studio/image/converter", icon: RefreshCw },
          { name: "이미지 배경 제거기", href: "/studio/image/bg-remover", icon: Eraser },
          { name: "이미지 크기 조절기", href: "/studio/image/resizer", icon: Maximize },
          { name: "WEBP 일괄 압축기", href: "/studio/image/webp-compressor", icon: Gauge },
          { name: "간편 이미지 편집기", href: "/studio/image/editor", icon: Wand2 },
        ],
      },

      {
        key: "video",
        name: "비디오 스튜디오",
        href: "/studio/video",
        icon: Video,
        color: "text-teal-400",
        children: [
          { name: "영상 편집기", href: "/studio/video/editor", icon: Video },
          { name: "쇼츠 & 릴스 제작", href: "/studio/video/shorts", icon: PlayCircle },
          { name: "영상 프롬프트", href: "/studio/video/prompts", icon: Sparkles },
          { name: "자막 & 음성", href: "/studio/video/subtitle", icon: Mic2 },
          { name: "영상 템플릿", href: "/studio/video/templates", icon: LayoutDashboard },
          { name: "썸네일 연동", href: "/studio/video/thumbnail", icon: ImageIcon },
          { name: "프로젝트 관리", href: "/studio/video/projects", icon: Folder },
          { name: "렌더 / 저장 관리", href: "/studio/video/render", icon: Save },
          { name: "영상 설정", href: "/studio/video/settings", icon: Settings },
        ],
      },
      {
        key: "research",
        name: "자료 분석 스튜디오",
        href: "/studio/research",
        icon: Database,
        color: "text-indigo-400",
        children: [
          { name: "새 자료 분석", href: "/studio/research/create", icon: FileText },
          { name: "자료 보관함", href: "/studio/research/library", icon: Archive },
          { name: "AI 채팅", href: "/studio/research/chat", icon: MessageCircle },
          { name: "콘텐츠 생성", href: "/studio/research/content", icon: Sparkles },
          { name: "추출 이미지", href: "/studio/research/images", icon: ImageIcon },
          { name: "프로젝트 관리", href: "/studio/research/projects", icon: Folder },
          { name: "설정", href: "/studio/research/settings", icon: Settings },
        ],
      },
      {
        key: "keyword",
        name: "키워드 트렌드 분석",
        href: "/studio/keyword",
        icon: Search,
        color: "text-cyan-400",
        children: [
          { name: "키워드 대량 조회", href: "/studio/keyword/bulk", icon: Database },
          { name: "연관 키워드 발굴", href: "/studio/keyword/related", icon: Layers },
          { name: "형태소 분석기", href: "/studio/keyword/morphology", icon: PieIcon },
          { name: "실시간 순위 추적", href: "/studio/keyword/rank", icon: LineChart },
          { name: "트렌드 급상승 분석", href: "/studio/keyword/rising", icon: TrendingUp },
          { name: "유튜브 키워드 분석", href: "/studio/keyword/youtube", icon: SiYoutube },
          { name: "SEO 경쟁 분석", href: "/studio/keyword/seo", icon: Search },
          { name: "AI 키워드 전략 생성", href: "/studio/keyword/strategy", icon: Bot },
          { name: "자동 콘텐츠 연결", href: "/studio/keyword/workflow", icon: Sparkles },
          { name: "트렌드 대시보드", href: "/studio/keyword/dashboard", icon: BarChart3 },
          { name: "트렌드 키워드", href: "/studio/content-planner/trends", icon: TrendingUp },
        ],
      },
      {
        key: "youtube",
        name: "유튜브 트렌드 분석",
        href: "/studio/youtube",
        icon: SiYoutube,
        color: "text-red-400",
        children: [
          { name: "채널 상세 분석", href: "/studio/youtube/channel", icon: Users },
          { name: "급상승 영상 트렌드", href: "/studio/youtube/rising", icon: TrendingUp },
          { name: "경쟁 채널 비교", href: "/studio/youtube/compare", icon: BarChart3 },
          { name: "광고 단가 계산기", href: "/studio/youtube/cpm", icon: Database },
          { name: "유튜브 SEO 분석", href: "/studio/youtube/seo", icon: Search },
          { name: "쇼츠 바이럴 분석", href: "/studio/youtube/shorts", icon: Video },
          { name: "썸네일 CTR 연구소", href: "/studio/youtube/thumbnail", icon: ImageIcon },
          { name: "AI 제목 생성기", href: "/studio/youtube/title", icon: Sparkles },
          { name: "콘텐츠 전략 리포트", href: "/studio/youtube/report", icon: FileText },
          { name: "유튜브 자동 제작 연결", href: "/studio/youtube/workflow", icon: Bot },
        ],
      },
      {
        key: "report",
        name: "AI 리포트",
        href: "/studio/aireport",
        icon: FileText,
        color: "text-indigo-400",
        children: [
          { name: "AI 시장 리포트", href: "/studio/report/market", icon: BarChart3 },
          { name: "산업별 AI 분석", href: "/studio/report/industry", icon: Building2 },
          { name: "AI 뉴스 브리핑", href: "/studio/report/news", icon: Newspaper },
          { name: "AI 툴 비교 분석", href: "/studio/report/tools", icon: Layers },
          { name: "AI 생산성 리포트", href: "/studio/report/productivity", icon: Gauge },
          { name: "AI 투자 분석", href: "/studio/report/investment", icon: LineChart },
          { name: "AI 트렌드 예측", href: "/studio/report/forecast", icon: TrendingUp },
          { name: "AI 리서치 센터", href: "/studio/report/research", icon: Database },
          { name: "AI 콘텐츠 자동 생성", href: "/studio/report/generator", icon: Sparkles },
          { name: "AI 인사이트 대시보드", href: "/studio/report/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        key: "news",
        name: "뉴스 콘텐츠",
        href: "/studio/news",
        icon: Newspaper,
        color: "text-orange-400",
        children: [
          { name: "실시간 뉴스 수집", href: "/studio/news/collect", icon: Rss },
          { name: "AI 뉴스 요약", href: "/studio/news/summary", icon: Sparkles },
          { name: "뉴스 기반 블로그 생성", href: "/studio/news/blog", icon: FileText },
          { name: "실시간 이슈 탐지", href: "/studio/news/issue", icon: Radio },
          { name: "뉴스 트렌드 분석", href: "/studio/news/trend", icon: BarChart3 },
          { name: "뉴스 콘텐츠 자동 발행", href: "/studio/news/publish", icon: Megaphone },
          { name: "뉴스 카드 제작", href: "/studio/news/card", icon: ImageIcon },
          { name: "AI 뉴스 앵커", href: "/studio/news/anchor", icon: Video },
          { name: "뉴스 아카이브", href: "/studio/news/archive", icon: Archive },
          { name: "뉴스 대시보드", href: "/studio/news/dashboard", icon: LayoutDashboard },
        ],
      },
      {
        key: "tools",
        name: "스튜디오 Tools",
        href: "/studio/tools",
        icon: Wand2,
        color: "text-amber-400",
        children: [
          { name: "AI 누끼 제거", href: "/studio/tools/bg-remover", icon: Wand2 },
          { name: "PDF 문서 분석", href: "/studio/tools/pdf-analyzer", icon: FileText },
          { name: "AI OCR 문자 추출", href: "/studio/tools/ocr", icon: Eye },
          { name: "AI 프롬프트 개선기", href: "/studio/tools/prompt-enhancer", icon: Sparkles },
          { name: "AI 프롬프트 번역기", href: "/studio/tools/prompt-translator", icon: Languages },
          { name: "해시태그 생성기", href: "/studio/tools/hashtag", icon: Tags },
          { name: "유튜브 썸네일 다운로더", href: "/studio/tools/youtube-thumbnail", icon: SiYoutube },
          { name: "색상 추출기", href: "/studio/tools/color-picker", icon: Palette },
          { name: "QR 생성기", href: "/studio/tools/qr", icon: CircleHelp },
          { name: "포맷 변환기", href: "/studio/tools/converter", icon: RefreshCw },
          { name: "메타데이터 추출기", href: "/studio/tools/metadata", icon: Database },
          { name: "코드 뷰티파이어", href: "/studio/tools/code-beautifier", icon: FileText },
        ],
      },
      {
        key: "community",
        name: "커뮤니티",
        href: "/studio/community",
        icon: Users,
        color: "text-pink-400",
        children: [
          { name: "실시간 채팅", href: "/studio/community/chat", icon: MessageCircle },
          { name: "크리아이박스 글쓰기", href: "/studio/community/writing", icon: PenTool },
          { name: "네이버 블로그", href: "/studio/community/naver", icon: SiNaver },
          { name: "뮤직 스튜디오", href: "/studio/community/music", icon: Music },
          { name: "이미지 스튜디오", href: "/studio/community/image", icon: ImageIcon },
          { name: "비디오 스튜디오", href: "/studio/community/video", icon: Video },
          { name: "유튜브 연구소", href: "/studio/community/youtube", icon: SiYoutube },
          { name: "AI 트렌드 토론방", href: "/studio/community/ai-trend", icon: Bot },
          { name: "협업 프로젝트", href: "/studio/community/collab", icon: Share2 },
          { name: "수익화 연구소", href: "/studio/community/money", icon: BadgeDollarSign },
        ],
      },
      {
        key: "infocenter",
        name: "인포센터",
        href: "/studio/infocenter",
        icon: Info,
        color: "text-amber-400",
        children: [
          { name: "공지사항", href: "/studio/infocenter/list/notices", icon: Bell },
          { name: "자유게시판", href: "/studio/infocenter/list/freeboard", icon: MessageSquare },
          { name: "꿀팁 / 노하우", href: "/studio/infocenter/list/tips", icon: Lightbulb },
          { name: "작품공유", href: "/studio/infocenter/list/showcase", icon: Share2 },
          { name: "FAQ", href: "/studio/infocenter/list/faq", icon: HelpCircle },
          { name: "Q&A", href: "/studio/infocenter/list/qna", icon: MessageCircle },
        ],
      },
      {
        key: "dashboard",
        name: "관리 대시보드",
        href: "/studio/dashboard",
        icon: LayoutDashboard,
        color: "text-blue-400",
      },
      ...(isAdmin
        ? [
          {
            key: "admin",
            name: "관리자 센터",
            href: "/admin",
            icon: ShieldCheck,
            color: "text-red-500",
            children: [
              { name: "사용자 관리", href: "/admin/usermanagement", icon: Users },
              { name: "브랜드 ID 및 도메인 관리", href: "/admin/brands", icon: Globe },
              { name: "예약어 관리", href: "/admin/reserved-words", icon: ShieldAlert },
              { name: "API Vault", href: "/admin/apivault", icon: Database },
              { name: "Google 연동", href: "/admin/google", icon: Settings },
              { name: "SEO 관리", href: "/admin/seo", icon: Search },
              { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
              { name: "결제 관리", href: "/admin/billing", icon: Settings },
              { name: "콘텐츠 관리", href: "/admin/content", icon: FileText },
              { name: "시스템 관리", href: "/admin/system", icon: Server },
            ],
          },
        ]
        : []),
    ],
    [isAdmin]
  );

  const isPathActive = (href: string) => {
    if (href === "/studio") return pathname === "/studio";
    if (href === "/studio/library" && pathname.startsWith("/studio/library/free-assets")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const allGroups = useMemo(() => menuGroups, [menuGroups]);

  const getMatchedGroup = () =>
    [...allGroups]
      .filter((group) => isPathActive(group.href))
      .sort((a, b) => b.href.length - a.href.length)[0];

  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    const matched = getMatchedGroup();
    return matched?.key ? [matched.key] : [];
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const getActiveStyles = (key?: string) => {
    switch (key) {
      case "client-site-builder":
        return "border-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20";
      case "planner":
        return "border-purple-500/20 bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20";
      case "writing":
        return "border-violet-500/20 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20";
      case "naver":
        return "border-green-500/20 bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20";
      case "music":
        return "border-pink-500/20 bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/20";
      case "image":
        return "border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-lg shadow-fuchsia-500/20";
      case "video":
        return "border-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20";
      case "data":
        return "border-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20";
      case "keyword":
        return "border-teal-500/20 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/20";
      case "youtube":
        return "border-red-500/20 bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20";
      case "report":
        return "border-blue-500/20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20";
      case "news":
        return "border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20";
      case "tools":
        return "border-amber-500/20 bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/20";
      case "community":
        return "border-pink-500/20 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/20";
      case "infocenter":
        return "border-sky-500/20 bg-gradient-to-r from-sky-500 to-blue-400 text-white shadow-lg shadow-sky-500/20";
      case "dashboard":
        return "border-blue-500/20 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20";
      case "admin":
        return "border-red-700/20 bg-gradient-to-r from-red-700 to-rose-600 text-white shadow-lg shadow-red-700/20";
      case "studio-home":
      default:
        return "border-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20";
    }
  };

  const renderSimpleMenu = (item: MenuItem & { key?: string }, color = "text-blue-400") => {
    const Icon = item.icon || PenTool;
    const isActive = isPathActive(item.href);
    const activeStyles = getActiveStyles(item.key);

    const baseClass = isCollapsed
      ? "h-9 w-9 justify-center items-center px-0 py-0 mx-auto"
      : "w-full px-3 py-2 gap-2.5 justify-start";

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? item.name : undefined}
        className={`
          group relative flex items-center rounded-xl border text-[13px] font-bold transition-all duration-300
          ${isActive
            ? activeStyles
            : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
          }
          ${baseClass}
        `}
      >
        <Icon size={15} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : color}`} />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  const renderGroup = (group: MenuGroup) => {
    const Icon = group.icon;
    const hasChildren = !!group.children?.length;
    const isExpanded = expandedGroups.includes(group.key);
    const isActive = isPathActive(group.href);
    const activeStyles = getActiveStyles(group.key);

    if (isCollapsed || !hasChildren) {
      return renderSimpleMenu(
        { name: group.name, href: group.href, icon: group.icon, key: group.key },
        group.color
      );
    }

    return (
      <div key={group.key} className="space-y-1.5">
        <Link
          href={group.href}
          onClick={() => {
            setIsMobileOpen(false);
          }}
          className={`
            group relative flex items-center rounded-xl border px-3 py-2 text-[13px] font-bold transition-all duration-300
            ${isActive
              ? activeStyles
              : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
            }
          `}
        >
          <Icon size={15} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : group.color}`} />
          <span className="ml-2.5 min-w-0 flex-1 truncate">{group.name}</span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleGroup(group.key);
            }}
            className={`
              ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all duration-300
              ${isActive
                ? "text-white/80 hover:bg-white/15 hover:text-white"
                : "text-zinc-400 hover:bg-zinc-150 dark:hover:bg-zinc-800 hover:text-zinc-750 dark:hover:text-zinc-300"
              }
            `}
          >
            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </Link>

        {isExpanded && (
          <div className="ml-2.5 mt-1.5 p-1.5 space-y-1 rounded-xl bg-zinc-50/40 dark:bg-zinc-950/30 border border-zinc-200/40 dark:border-zinc-900/30">
            {group.children?.map((child) => {
              const ChildIcon = child.icon || FileText;
              const childActive = isPathActive(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    relative flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] font-bold transition duration-250
                    ${childActive
                      ? "border-blue-400/20 bg-blue-500/10 text-blue-600 dark:text-cyan-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.05)]"
                      : "border-transparent text-slate-700 dark:text-zinc-200 hover:border-zinc-300/40 dark:hover:border-zinc-800/40 hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                >
                  <ChildIcon
                    size={13}
                    className={`shrink-0 ${childActive ? "text-blue-500 dark:text-cyan-400" : "text-slate-400 dark:text-zinc-300"}`}
                  />
                  <span className="truncate">{child.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sectionTitle = (label: string) =>
    !isCollapsed && (
      <p className="text-[16px] font-black tracking-wider text-center w-full text-blue-600 dark:text-cyan-400 uppercase">
        {label}
      </p>
    );

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[70] flex h-screen flex-col border-r border-zinc-200 dark:border-zinc-800/80
        bg-white dark:bg-[#090e15] transition-all duration-300 ease-in-out lg:sticky
        ${isCollapsed ? "lg:w-14" : "lg:w-[220px]"}
        ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex h-20 items-center border-b border-zinc-200 dark:border-zinc-800/80 px-3 bg-[#02030a]">
        <Link href="/" className="flex min-w-0 items-center justify-center w-full">
          {isCollapsed ? (
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-blue-950/5 dark:shadow-blue-950/30">
              <Image
                src="/icon.png"
                alt="CreAibox"
                width={70}
                height={70}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative h-[40px] w-[190px] shrink-0 flex items-center justify-center">
              <Image
                src="/creaibox_studio_logo.webp"
                alt="CreAibox Studio"
                fill
                className="object-contain scale-[1.9]"
                priority
              />
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <div className="relative mb-4 flex items-center justify-center min-h-[28px]">
          {sectionTitle("AI Studio")}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-0.5 top-1/2 -translate-y-1/2 hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-white lg:flex"
            title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        <nav className="space-y-2">{menuGroups.map(renderGroup)}</nav>
      </div>

      {!isCollapsed && (
        <div className="shrink-0 border-t border-zinc-800/80 px-3 py-2.5">
          <p className="text-center text-[12px] font-bold leading-relaxed text-zinc-500">
            © Creaibox AI Studio
            <br />
            <span className="uppercase tracking-widest text-zinc-600">
              Strategic Systems
            </span>
          </p>
        </div>
      )}
    </aside>
  );
}
