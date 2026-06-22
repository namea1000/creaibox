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
  Archive,
  Lightbulb,
  Database,
  Settings,
  Wand2,
  RefreshCw,
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
        key: "dashboard",
        name: "관리 대시보드",
        href: "/studio/dashboard",
        icon: LayoutDashboard,
        color: "text-blue-400",
      },
      {
        key: "shortcuts",
        name: "바로가기",
        href: "/studio/content-planner/idea-hub",
        icon: Star,
        color: "text-amber-400",
        children: [
          { name: "가사 소재 허브", href: "/studio/music/lyrics/idea-hub", icon: Lightbulb },
          { name: "콘텐츠 아이디어 허브", href: "/studio/content-planner/idea-hub", icon: Lightbulb },
          { name: "AI 콘텐츠 기획", href: "/studio/content-planner/planning", icon: Sparkles },
          { name: "AI 앨범 기획", href: "/studio/music/planning", icon: Sparkles },
          { name: "가사 & SUNO", href: "/studio/music/lyrics", icon: Mic2 },
        ],
      },
      {
        key: "library",
        name: "콘텐츠 라이브러리",
        href: "/studio/library",
        icon: Library,
        color: "text-sky-400",
        children: [
          { name: "무료 공유 에셋", href: "/studio/library/free-assets", icon: Globe },
          { name: "전체 콘텐츠", href: "/studio/library/all", icon: Library },

          { name: "크리아이박스 콘텐츠", href: "/studio/library/creaibox", icon: PenTool },
          { name: "네이버 콘텐츠", href: "/studio/library/naver", icon: SiNaver },
          { name: "뉴스 콘텐츠", href: "/studio/library/news", icon: Rss },

          { name: "음악 / 가사 콘텐츠", href: "/studio/library/music", icon: Music },
          { name: "이미지 콘텐츠", href: "/studio/library/image", icon: ImageIcon },
          { name: "비디오 콘텐츠", href: "/studio/library/video", icon: Video },

          { name: "프롬프트 보관함", href: "/studio/library/prompts", icon: Sparkles },
          { name: "템플릿 라이브러리", href: "/studio/library/templates", icon: Layers },

          { name: "즐겨찾기", href: "/studio/library/favorites", icon: BadgeDollarSign },
          { name: "최근 작업물", href: "/studio/library/recent", icon: Clock },
          { name: "임시저장", href: "/studio/library/drafts", icon: Save },
          { name: "발행 완료", href: "/studio/library/published", icon: Archive },

          { name: "AI 생성 이력", href: "/studio/library/history", icon: Bot },
          { name: "사용량 통계", href: "/studio/library/analytics", icon: BarChart3 },

          { name: "휴지통", href: "/studio/library/trash", icon: FileArchive },
        ],
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
          { name: "트렌드 키워드", href: "/studio/content-planner/trends", icon: TrendingUp },
          { name: "전략 및 타겟 분석", href: "/studio/content-planner/strategy", icon: Target },
          { name: "자동화 워크플로우", href: "/studio/content-planner/workflow", icon: Bot },
          { name: "플래너 설정", href: "/studio/content-planner/settings", icon: Settings },
        ],
      },
      {
        key: "creaibox-writing",
        name: "크리아이박스 글쓰기",
        href: "/studio/writing/creaibox",
        icon: PenTool,
        color: "text-violet-400",
        children: [
          { name: "AI 포스팅 기획", href: "/studio/writing/creaibox/plan", icon: Sparkles },
          { name: "AI 포스팅 글쓰기", href: "/studio/writing/creaibox/create", icon: Edit3 },
          { name: "AI 포스팅 에디터", href: "/studio/writing/creaibox/editor", icon: FileText },
          { name: "발행 원고 관리", href: "/studio/writing/creaibox/list", icon: Archive },
          { name: "블로그 관리", href: "/studio/writing/creaibox/blog-management", icon: Settings },
          { name: "크리아이박스 썸네일", href: "/studio/writing/creaibox/thumbnail", icon: ImageIcon },
          { name: "아이디어 제너레이터", href: "/studio/writing/creaibox/ideagenerator", icon: Lightbulb },
          { name: "트렌드 대시보드", href: "/studio/writing/creaibox/analytics", icon: BarChart3 },
          { name: "AI 이미지 워크샵", href: "/studio/writing/creaibox/image", icon: ImageIcon },
          { name: "지식 베이스", href: "/studio/writing/creaibox/knowledge", icon: Database },
          { name: "엔진 커스텀 세팅", href: "/studio/writing/creaibox/settings", icon: Settings },
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

  const renderSimpleMenu = (item: MenuItem, color = "text-blue-400") => {
    const Icon = item.icon || PenTool;
    const isActive = isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? item.name : undefined}
        className={`
          group relative flex items-center rounded-lg border px-2.5 py-2 text-[13px] font-bold transition-all
          ${isActive
            ? "border-blue-400/25 bg-blue-500/15 text-blue-600 dark:text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.10),0_10px_24px_rgba(37,99,235,0.10)]"
            : "border-transparent text-zinc-650 dark:text-zinc-100 hover:border-blue-400/15 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-white"
          }
          ${isCollapsed ? "lg:justify-center lg:px-0" : "gap-2.5"}
        `}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-blue-300" />
        )}
        <Icon size={16} className={`shrink-0 ${isActive ? "text-blue-300" : color}`} />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  const renderGroup = (group: MenuGroup) => {
    const Icon = group.icon;
    const hasChildren = !!group.children?.length;
    const isExpanded = expandedGroups.includes(group.key);
    const isActive = isPathActive(group.href);

    if (isCollapsed || !hasChildren) {
      return renderSimpleMenu(
        { name: group.name, href: group.href, icon: group.icon },
        group.color
      );
    }

    return (
      <div key={group.key} className="space-y-1">
        <Link
          href={group.href}
          onClick={() => {
            setIsMobileOpen(false);
          }}
          className={`
            relative flex items-center rounded-lg border px-2.5 py-2 text-[13px] font-bold transition-all
            ${isActive
              ? "border-blue-400/25 bg-blue-500/15 text-blue-600 dark:text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.10),0_10px_24px_rgba(37,99,235,0.10)]"
              : "border-transparent text-zinc-650 dark:text-zinc-100 hover:border-blue-400/15 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-white"
            }
          `}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-blue-300" />
          )}
          <Icon size={16} className={`shrink-0 ${isActive ? "text-blue-300" : group.color}`} />
          <span className="ml-2.5 min-w-0 flex-1 truncate">{group.name}</span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleGroup(group.key);
            }}
            className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-white transition-colors duration-300"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </Link>

        {isExpanded && (
          <div className="ml-4 space-y-1 border-l border-zinc-800/80 pl-2">
            {group.children?.map((child) => {
              const ChildIcon = child.icon || FileText;
              const childActive = isPathActive(child.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    relative flex items-center gap-2 rounded-md border px-2.5 py-2 text-[13px] font-bold transition
                    ${childActive
                      ? "border-blue-400/20 bg-blue-500/15 text-blue-600 dark:text-white shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]"
                      : "border-transparent text-zinc-500 dark:text-zinc-300 hover:border-blue-400/15 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-white"
                    }
                  `}
                >
                  {childActive && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-blue-300" />
                  )}
                  <ChildIcon
                    size={14}
                    className={`shrink-0 ${childActive ? "text-blue-300" : group.color}`}
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
      <p className="mb-2 ml-1.5 text-[11px] font-black tracking-[0.16em] text-blue-400/90">
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
      <div className="flex h-20 items-center border-b border-zinc-200 dark:border-zinc-800/80 px-3 dark:bg-[#02030a]">
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
        <div className="mb-3 flex items-center justify-between">
          {sectionTitle("AI Creator Workspace")}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white lg:flex"
            title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        <nav className="space-y-1">{menuGroups.map(renderGroup)}</nav>
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
