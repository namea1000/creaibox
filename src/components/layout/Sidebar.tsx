"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "@/components/common/SmartIntentLink";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  HelpCircle,
  MessageCircle,
  Globe,
  Flame,
  FileText,
  Newspaper,
  Sparkles,
  Mail,
  Search,
  ShieldCheck,
  ShieldAlert,
  Zap,
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
  PenLine,
  Archive,
  Lightbulb,
  Database,
  Settings,
  Wand2,
  RefreshCw,
  Eraser,
  Gauge,
  DownloadCloud,
  BadgeDollarSign,
  Trophy,
  LineChart,
  TrendingUp,
  ShoppingBag,
  Radio,
  Bot,
  Rss,
  Megaphone,
  Building2,
  Bell,
  MessageSquare,
  Share2,
  Send,
  Disc3,
  Waves,
  CalendarDays,
  Maximize,
  Plus,
  Award,
  Clock,
  Palette,
  Languages,
  PlayCircle,
  Tags,
  Save,
  Store,
  MonitorSmartphone,
  Crown,
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

// Helper to normalize path by stripping /studio prefix for unified matching
function normalizePath(p: string): string {
  if (!p) return "";
  let clean = p.trim();
  if (clean.startsWith("/studio/")) {
    clean = clean.substring(7); // Remove "/studio"
  } else if (clean === "/studio") {
    clean = "/studio";
  }
  return clean;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(sessionStorage.getItem("sidebar_is_admin") === "true");
    }
  }, []);
  
  const [isMounted, setIsMounted] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkUser = async (user: any) => {
      if (!mounted) return;
      if (!user) {
        setIsAdmin(false);
        if (typeof window !== "undefined") sessionStorage.setItem("sidebar_is_admin", "false");
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
            if (typeof window !== "undefined") sessionStorage.setItem("sidebar_is_admin", "true");
          } else {
            setIsAdmin(false);
            if (typeof window !== "undefined") sessionStorage.setItem("sidebar_is_admin", "false");
          }
        }
      } catch (err) {
        if (mounted) {
          setIsAdmin(false);
          if (typeof window !== "undefined") sessionStorage.setItem("sidebar_is_admin", "false");
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
        key: "custom-client-site",
        name: "AI 웹사이트 빌더",
        href: "/studio/custom-client-site",
        icon: Sparkles,
        color: "text-cyan-400",
        children: [
          { name: "템플릿 쇼핑 & 1초 구축", href: "/studio/custom-client-site/marketplace", icon: Store },
          { name: "기존 홈페이지 이관", href: "/studio/custom-client-site/migration", icon: Globe },
          { name: "AI 홈페이지 매직 빌더 🪄", href: "/studio/custom-client-site/ai-magic-builder", icon: MonitorSmartphone },
          { name: "서브 페이지 AI 추가 제작", href: "/studio/custom-client-site/subpage-builder", icon: Layers },
          { name: "내 웹사이트 관리", href: "/studio/client-site-builder", icon: Settings },
          { name: "AI 웹사이트 신규 제작 신청", href: "/studio/custom-client-site/request", icon: Plus },
          { name: "관리자: 제작 신청 현황", href: "/studio/custom-client-site/admin-dashboard", icon: ShieldCheck },
        ]
      },
      {
        key: "domain-search",
        name: "도메인 조회 & 구매",
        href: "/studio/domain-search",
        icon: Globe,
        color: "text-emerald-400",
        children: [
          { name: "도메인 검색 & 구매", href: "/studio/domain-search", icon: Search },
          { name: "타사 도메인 이관", href: "/studio/domain-search/transfer", icon: RefreshCw },
          { name: "커스텀 이메일 연동", href: "/studio/domain-search/email", icon: Mail },
          { name: "도메인 가격 비교표", href: "/studio/domain-search/comparison", icon: Award },
          { name: "도메인 정책 & 혜택", href: "/studio/domain-search/perks", icon: Crown },
          { name: "자주 묻는 질문 (FAQ)", href: "/studio/domain-search/faq", icon: HelpCircle },
        ],
      },
      {
        key: "idea-hub",
        name: "콘텐츠 아이디어 허브",
        href: "/content-planner/idea-hub",
        icon: Lightbulb,
        color: "text-amber-400",
      },
      {
        key: "creaibox-writing",
        name: "크리에이박스 블로그",
        href: "/writing/creaibox",
        icon: PenTool,
        color: "text-violet-400",
        children: [
          { name: "블로그 새글 쓰기", href: "/writing/creaibox/new-post", icon: PenLine },
          { name: "블로그 원고 관리", href: "/writing/creaibox/list", icon: Archive },
          { name: "네이버/SNS 재발행", href: "/writing/creaibox/recreate", icon: RefreshCw },
          { name: "블로그 설정 및 관리", href: "/writing/creaibox/blog-management", icon: Settings },
          { name: "기존 블로그 통째 이관 📦", href: "/studio/blog-migration", icon: DownloadCloud },
          { name: "AI 콘텐츠 기획", href: "/content-planner/planning", icon: Sparkles },
          { name: "기획 라이브러리", href: "/content-planner/library", icon: Library },
          { name: "콘텐츠 캘린더", href: "/content-planner/calendar", icon: CalendarDays },
          { name: "자동화 워크플로우", href: "/content-planner/workflow", icon: Bot },
          { name: "썸네일 생성 관리", href: "/writing/creaibox/thumbnail", icon: ImageIcon },
          { name: "지식 & 페르소나 설정", href: "/writing/creaibox/knowledge", icon: Database },
        ],
      },
      {
        key: "keyword",
        name: "키워드 트렌드 분석",
        href: "/studio/keyword/realtime",
        icon: Search,
        color: "text-cyan-400",
        children: [
          { name: "🔥 실시간 급상승 키워드", href: "/studio/keyword/realtime", icon: Flame },
          { name: "🔍 키워드 정밀 도구", href: "/studio/keyword/tool", icon: Search },
          { name: "📈 네이버 블로그 지수 진단", href: "/studio/keyword/blog-index", icon: BarChart3 },
          { name: "🌐 구글 트렌드 인사이트", href: "/studio/keyword/google-trends", icon: Globe },
          { name: "🔍 키워드 대량 조회", href: "/studio/keyword/bulk", icon: Database },
          { name: "⚡ 연관 키워드 발굴", href: "/studio/keyword/related", icon: Layers },
          { name: "📊 형태소 분석기 & SEO", href: "/studio/keyword/morphology", icon: PieIcon },
          { name: "🤖 AI 키워드 전략 생성", href: "/studio/keyword/strategy", icon: Bot },
        ],
      },
      {
        key: "youtube",
        name: "유튜브 트렌드 분석",
        href: "/youtube-trend/rising",
        icon: SiYoutube,
        color: "text-red-400",
        children: [
          { name: "급상승 영상 트렌드", href: "/youtube-trend/rising", icon: TrendingUp },
          { name: "인기 영상 조회수 랭킹", href: "/youtube-trend/popular", icon: Trophy },
          { name: "영상분석 리포트", href: "/youtube-trend/reports", icon: FileText },
          { name: "유튜브 랭킹 TOP 300", href: "/youtube-trend/top300", icon: Award },
          { name: "인기채널 영상분석", href: "/youtube-trend/channel", icon: Users },
          { name: "인기채널 영상분석 리포트", href: "/youtube-trend/channel-reports", icon: FileText },
          { name: "유튜브 썸네일 다운로더", href: "/youtube-trend/youtube-thumbnail", icon: SiYoutube },
          { name: "유튜브 영상 검색", href: "/youtube-trend/search", icon: Search },
          { name: "경쟁 채널 비교", href: "/youtube-trend/compare", icon: BarChart3 },
          { name: "광고 단가 계산기", href: "/youtube-trend/cpm", icon: Database },
          { name: "유튜브 SEO 분석", href: "/youtube-trend/seo", icon: Search },
          { name: "쇼츠 바이럴 분석", href: "/youtube-trend/shorts", icon: Video },
          { name: "썸네일 CTR 연구소", href: "/youtube-trend/thumbnail", icon: ImageIcon },
          { name: "AI 제목 생성기", href: "/youtube-trend/title", icon: Sparkles },
          { name: "콘텐츠 전략 리포트", href: "/youtube-trend/report", icon: FileText },
          { name: "유튜브 자동 제작 연결", href: "/youtube-trend/workflow", icon: Bot },

        ],
      },
      {
        key: "creassetbox",
        name: "미디어 라이브러리",
        href: "/library/free-assets",
        icon: Archive,
        color: "text-amber-400",
      },
      {
        key: "music",
        name: "뮤직 스튜디오",
        href: "/music",
        icon: Music,
        color: "text-rose-400",
        children: [
          { name: "가사 소재 허브", href: "/music/lyrics/idea-hub", icon: Lightbulb },
          { name: "AI 앨범 기획", href: "/music/planning", icon: Sparkles },
          { name: "가사 & SUNO", href: "/music/lyrics", icon: Mic2 },
          { name: "Suno 곡 생성", href: "/music/suno-generator", icon: Wand2 },
          { name: "생성곡 라이브러리", href: "/music/library", icon: Mic2 },
          { name: "Cre Music 플레이어", href: "/music/cre-music", icon: PlayCircle },
          { name: "앨범 관리", href: "/music/albums", icon: Disc3 },
          { name: "스타일 포맷", href: "/music/style-format", icon: Palette },
          { name: "오디오 스펙트럼", href: "/music/visualizer", icon: Waves },
          { name: "커버 이미지", href: "/music/cover-image", icon: ImageIcon },
          { name: "영상 프롬프트", href: "/music/video-prompt", icon: Video },
          { name: "번역", href: "/music/translate", icon: Languages },
          { name: "유튜브 최적화", href: "/music/youtube-seo", icon: SiYoutube },
          { name: "태그 관리", href: "/music/tags", icon: Tags },
          { name: "플레이리스트", href: "/music/playlist", icon: Library },
          { name: "프로젝트", href: "/music/projects", icon: Folder },
          { name: "작업 내역", href: "/music/history", icon: Clock },
          { name: "설정", href: "/music/settings", icon: Settings },
        ],
      },
      {
        key: "image",
        name: "디자인 스튜디오",
        href: "/design",
        icon: ImageIcon,
        color: "text-purple-400",
        children: [
          { name: "디자인 편집기", href: "/design/workspace", icon: Wand2 },
          { name: "템플릿 라이브러리", href: "/design/templates", icon: Library },
          { name: "AI 매직 디자인", href: "/design/magic-design", icon: Sparkles },
          { name: "브랜드 키트", href: "/design/brand-kit", icon: Palette },
          { name: "프롬프트 라이브러리", href: "/design/prompts", icon: Library },
          { name: "썸네일 메이커", href: "/design/thumbnail", icon: ImageIcon },
          { name: "포스터 & 전단지", href: "/design/poster", icon: FileText },
          { name: "디지털 명함", href: "/design/business-card", icon: BadgeDollarSign },
          { name: "현수막 & 배너", href: "/design/banner", icon: Megaphone },
          { name: "이미지 AI 업스케일러", href: "/design/upscaler", icon: Sparkles },
          { name: "이미지 확장자 변환기", href: "/design/converter", icon: RefreshCw },
          { name: "이미지 배경 제거기", href: "/design/bg-remover", icon: Eraser },
          { name: "이미지 크기 조절기", href: "/design/resizer", icon: Maximize },
          { name: "WEBP 일괄 압축기", href: "/design/webp-compressor", icon: Gauge },
          { name: "간편 이미지 편집기", href: "/design/editor", icon: Wand2 },
        ],
      },
      {
        key: "video",
        name: "비디오 스튜디오",
        href: "/video",
        icon: Video,
        color: "text-teal-400",
        children: [
          { name: "영상 편집기", href: "/video/editor", icon: Video },
          { name: "쇼츠 & 릴스 제작", href: "/video/shorts", icon: PlayCircle },
          { name: "영상 프롬프트", href: "/video/prompts", icon: Sparkles },
          { name: "자막 & 음성", href: "/video/subtitle", icon: Mic2 },
          { name: "영상 템플릿", href: "/video/templates", icon: LayoutDashboard },
          { name: "썸네일 연동", href: "/video/thumbnail", icon: ImageIcon },
          { name: "프로젝트 관리", href: "/video/projects", icon: Folder },
          { name: "렌더 / 저장 관리", href: "/video/render", icon: Save },
          { name: "영상 설정", href: "/video/settings", icon: Settings },
        ],
      },
      {
        key: "community",
        name: "커뮤니티",
        href: "/community",
        icon: Users,
        color: "text-pink-400",
        children: [
          { name: "실시간 채팅", href: "/community/chat", icon: MessageCircle },
          { name: "크리아이박스 글쓰기", href: "/community/writing", icon: PenTool },
          { name: "네이버 블로그", href: "/community/naver", icon: SiNaver },
          { name: "뮤직 스튜디오", href: "/community/music", icon: Music },
          { name: "디자인 스튜디오", href: "/community/image", icon: ImageIcon },
          { name: "비디오 스튜디오", href: "/community/video", icon: Video },
          { name: "유튜브 연구소", href: "/community/youtube", icon: SiYoutube },
          { name: "AI 트렌드 토론방", href: "/community/ai-trend", icon: Bot },
          { name: "협업 프로젝트", href: "/community/collab", icon: Share2 },
          { name: "수익화 연구소", href: "/community/money", icon: BadgeDollarSign },
        ],
      },
      {
        key: "infocenter",
        name: "인포센터",
        href: "/infocenter",
        icon: Info,
        color: "text-amber-400",
        children: [
          { name: "공지사항", href: "/infocenter/list/notices", icon: Bell },
          { name: "자유게시판", href: "/infocenter/list/freeboard", icon: MessageSquare },
          { name: "꿀팁 / 노하우", href: "/infocenter/list/tips", icon: Lightbulb },
          { name: "작품공유", href: "/infocenter/list/showcase", icon: Share2 },
          { name: "FAQ", href: "/infocenter/list/faq", icon: HelpCircle },
          { name: "Q&A", href: "/infocenter/list/qna", icon: MessageCircle },
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
              { name: "Resend 이메일 관리", href: "/admin/resend", icon: Mail },
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
          {
            key: "admin-special",
            name: "관리자 특별메뉴",
            href: "/studio/article-scrap",
            icon: Sparkles,
            color: "text-amber-400",
            children: [
              { name: "아티클 스크랩 & 재발행 🔄", href: "/studio/article-scrap", icon: Layers },
            ],
          },
          {
            key: "report",
            name: "AI 리포트(개발중)",
            href: "/aireport",
            icon: FileText,
            color: "text-indigo-400",
            children: [
              { name: "AI 시장 리포트", href: "/report/market", icon: BarChart3 },
              { name: "산업별 AI 분석", href: "/report/industry", icon: Building2 },
              { name: "AI 뉴스 브리핑", href: "/report/news", icon: Newspaper },
              { name: "AI 툴 비교 분석", href: "/report/tools", icon: Layers },
              { name: "AI 생산성 리포트", href: "/report/productivity", icon: Gauge },
              { name: "AI 투자 분석", href: "/report/investment", icon: LineChart },
              { name: "AI 트렌드 예측", href: "/report/forecast", icon: TrendingUp },
              { name: "AI 리서치 센터", href: "/report/research", icon: Database },
              { name: "AI 콘텐츠 자동 생성", href: "/report/generator", icon: Sparkles },
              { name: "AI 인사이트 대시보드", href: "/report/dashboard", icon: LayoutDashboard },
            ],
          },
          {
            key: "news",
            name: "뉴스 콘텐츠(개발중)",
            href: "/news",
            icon: Newspaper,
            color: "text-orange-400",
            children: [
              { name: "실시간 뉴스 수집", href: "/news/collect", icon: Rss },
              { name: "AI 뉴스 요약", href: "/news/summary", icon: Sparkles },
              { name: "뉴스 기반 블로그 생성", href: "/news/blog", icon: FileText },
              { name: "실시간 이슈 탐지", href: "/news/issue", icon: Radio },
              { name: "뉴스 트렌드 분석", href: "/news/trend", icon: BarChart3 },
              { name: "뉴스 콘텐츠 자동 발행", href: "/news/publish", icon: Megaphone },
              { name: "뉴스 카드 제작", href: "/news/card", icon: ImageIcon },
              { name: "AI 뉴스 앵커", href: "/news/anchor", icon: Video },
              { name: "뉴스 아카이브", href: "/news/archive", icon: Archive },
              { name: "뉴스 대시보드", href: "/news/dashboard", icon: LayoutDashboard },
            ],
          },
          {
            key: "publish",
            name: "채널 배포 스튜디오",
            href: "/publish",
            icon: Share2,
            color: "text-rose-400",
            children: [
              { name: "AI 쇼츠 자동 생성기", href: "/publish", icon: Sparkles },
              { name: "SNS 통합 발행", href: "/publish/posts", icon: Send },
              { name: "채널 연동 관리", href: "/publish/channels", icon: Settings },
              { name: "발행 이력 및 통계", href: "/publish/history", icon: BarChart3 },
            ],
          },
          {
            key: "research",
            name: "자료 분석 스튜디오",
            href: "/research",
            icon: Database,
            color: "text-indigo-400",
            children: [
              { name: "새 자료 분석", href: "/research/create", icon: FileText },
              { name: "자료 보관함", href: "/research/library", icon: Archive },
              { name: "AI 채팅", href: "/research/chat", icon: MessageCircle },
              { name: "콘텐츠 생성", href: "/research/content", icon: Sparkles },
              { name: "추출 이미지", href: "/research/images", icon: ImageIcon },
              { name: "프로젝트 관리", href: "/research/projects", icon: Folder },
              { name: "설정", href: "/research/settings", icon: Settings },
            ],
          },
          {
            key: "shopping",
            name: "쇼핑 키워드 분석",
            href: "/studio/shopping/keyword",
            icon: ShoppingBag,
            color: "text-emerald-400",
            children: [
              { name: "🛍️ 쇼핑 키워드 정밀 분석", href: "/studio/shopping/keyword", icon: ShoppingBag },
              { name: "📊 네이버 쇼핑 인사이트", href: "/studio/keyword/shopping-insight", icon: BarChart3 },
              { name: "📦 쇼핑 랭킹 추적 & 소싱 HUB", href: "/studio/shopping/sourcing", icon: Layers },
            ],
          },
        ]
        : []),
    ],
    [isAdmin]
  );

  const isPathActive = useCallback(
    (href: string, groupChildren?: MenuItem[]) => {
      const normPath = normalizePath(pathname);
      const normHref = normalizePath(href);

      if (normHref === "/studio") return normPath === "/studio" || normPath === "";
      if (normHref === "/client-site-builder") return normPath === "/client-site-builder";
      
      // Special case: /writing/creaibox/list/[id] post detail page
      if (normPath.startsWith("/writing/creaibox/list/")) {
        const isNewPostWarp =
          isMounted &&
          typeof window !== "undefined" &&
          (window.location.search.includes("newPost=true") || window.location.search.includes("newPost"));

        if (isNewPostWarp) {
          if (normHref.includes("/writing/creaibox/new-post")) return true;
          if (normHref.includes("/writing/creaibox/list")) return false;
        } else {
          if (normHref.includes("/writing/creaibox/list")) return true;
          if (normHref.includes("/writing/creaibox/new-post")) return false;
        }
      }

      if (!normHref) return false;

      // Exact match
      if (normPath === normHref) return true;

      // Prefix match check
      if (normPath.startsWith(`${normHref}/`)) {
        // If other children in the same group also match normPath with a longer (more specific) href,
        // then this shorter href should NOT be marked active!
        if (groupChildren) {
          const hasMoreSpecificMatch = groupChildren.some((otherChild) => {
            const otherNormHref = normalizePath(otherChild.href);
            if (otherNormHref === normHref) return false;
            if (otherNormHref.length > normHref.length) {
              return normPath === otherNormHref || normPath.startsWith(`${otherNormHref}/`);
            }
            return false;
          });

          if (hasMoreSpecificMatch) return false;
        }
        return true;
      }

      return false;
    },
    [pathname]
  );

  const isGroupActive = useCallback(
    (group: MenuGroup) => {
      const normPath = normalizePath(pathname);
      const normGroupHref = normalizePath(group.href);

      // 1. Check if group.href matches
      if (isPathActive(group.href, group.children)) return true;

      // 2. Check if any child's href matches current pathname
      if (group.children && group.children.some((child) => isPathActive(child.href, group.children))) {
        return true;
      }

      // 3. Explicit prefix checks based on group.key (prevents /community/writing from opening /writing/creaibox)
      switch (group.key) {
        case "community":
          return normPath.startsWith("/community");
        case "infocenter":
          return normPath.startsWith("/infocenter");
        case "creaibox-writing":
          if (normPath === "/content-planner/idea-hub" || normPath.startsWith("/content-planner/idea-hub/")) {
            return false;
          }
          return normPath.startsWith("/writing/creaibox") || normPath.startsWith("/content-planner");
        case "music":
          return normPath.startsWith("/music");
        case "image":
          return normPath.startsWith("/design");
        case "video":
          return normPath.startsWith("/video");
        case "keyword":
          return normPath.startsWith("/keyword-trend");
        case "youtube":
          return normPath.startsWith("/youtube-trend") || normPath.startsWith("/utility-tools/youtube");
        case "client-site-builder":
          return normPath.startsWith("/client-site-builder");
        case "custom-client-site":
          return normPath.startsWith("/custom-client-site");
        case "domain-search":
          return normPath.startsWith("/domain-search");
        case "admin":
          return normPath.startsWith("/admin");
        case "report":
          return normPath.startsWith("/report") || normPath.startsWith("/aireport");
        case "news":
          return normPath.startsWith("/news");
        case "publish":
          return normPath.startsWith("/publish");
        case "research":
          return normPath.startsWith("/research");
        default:
          return false;
      }
    },
    [isPathActive, pathname]
  );

  const getMatchedGroup = useCallback(() => {
    for (const group of menuGroups) {
      if (isGroupActive(group)) {
        return group;
      }
    }
    return undefined;
  }, [menuGroups, isGroupActive]);

  const [optimisticActiveKey, setOptimisticActiveKey] = useState<string | null>(null);

  // 🌟 Lazy Initializer로 세션스토리지에 저장된 사용자의 펼침 상태만 동기화 (기본은 접힘 유지)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("sidebar_expanded");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setExpandedGroups(parsed);
        }
      } catch (e) {}
    }
  }, []);

  // 🌟 펼침 상태 변경 시 세션스토리지에 안전하게 보존
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("sidebar_expanded", JSON.stringify(expandedGroups));
      } catch (e) {}
    }
  }, [expandedGroups]);

  // Automatically clear optimistic active key when pathname changes
  useEffect(() => {
    setOptimisticActiveKey(null);
  }, [pathname]);

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
      case "creaibox-writing":
        return "border-violet-500/20 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20";
      case "music":
        return "border-pink-500/20 bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/20";
      case "image":
        return "border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-lg shadow-fuchsia-500/20";
      case "video":
        return "border-cyan-500/20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20";
      case "keyword":
        return "border-teal-500/20 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/20";
      case "youtube":
        return "border-red-500/20 bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/20";
      case "report":
        return "border-blue-500/20 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20";
      case "news":
        return "border-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20";
      case "community":
        return "border-pink-500/20 bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/20";
      case "infocenter":
        return "border-sky-500/20 bg-gradient-to-r from-sky-500 to-blue-400 text-white shadow-lg shadow-sky-500/20";
      case "admin":
        return "border-red-700/20 bg-gradient-to-r from-red-700 to-rose-600 text-white shadow-lg shadow-red-700/20";
      default:
        return "border-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20";
    }
  };

  const renderSimpleMenu = (item: MenuItem & { key?: string }, color = "text-blue-400") => {
    const Icon = item.icon || PenTool;
    const itemKey = item.key || item.name;
    const isActive = optimisticActiveKey
      ? optimisticActiveKey === itemKey
      : isPathActive(item.href);
    const activeStyles = getActiveStyles(item.key);
    const isWorkspace = item.key === "workspace";

    const baseClass = isCollapsed
      ? "h-9 w-9 justify-center items-center px-0 py-0 mx-auto"
      : "w-full px-3 py-2 gap-2.5 justify-start";

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => {
          if (item.key) setOptimisticActiveKey(item.key);
          setIsMobileOpen(false);
        }}
        className={`
          group relative flex items-center rounded-md border text-[13px] font-bold transition-all duration-300
          ${isActive
            ? activeStyles
            : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
          }
          ${baseClass}
        `}
      >
        <div className={`flex items-center gap-2.5 min-w-0 ${!isCollapsed ? "flex-1" : ""}`}>
          <Icon size={15} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : color}`} />
          {!isCollapsed && <span className="truncate">{item.name}</span>}
        </div>

        {/* 🌟 스튜디오 홈 버튼 안쪽 오른쪽에 접기 버튼 (어사이드 버튼과 100% 동일한 다크/라이트 컬러) */}
        {!isCollapsed && isWorkspace && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCollapsed(true);
            }}
            className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition hover:border-blue-500/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-500 dark:hover:text-white shadow-xs ml-auto shrink-0 cursor-pointer"
            title="사이드바 접기"
            aria-label="사이드바 접기"
          >
            <PanelLeftClose size={14} />
          </button>
        )}

        {/* 0ms 실시간 직관 툴팁 (접힘 모드용) */}
        {isCollapsed && (
          <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2.5 -translate-y-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
            {item.name}
            <span className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-zinc-900/95 dark:border-r-zinc-800/95" />
          </span>
        )}
      </Link>
    );
  };

  const renderGroup = (group: MenuGroup) => {
    const Icon = group.icon;
    const hasChildren = !!group.children?.length;
    const isExpanded = expandedGroups.includes(group.key);
    const isGroupActiveState = optimisticActiveKey
      ? optimisticActiveKey === group.key
      : isGroupActive(group);
    const activeStyles = getActiveStyles(group.key);

    if (isCollapsed || !hasChildren) {
      return renderSimpleMenu(
        { name: group.name, href: group.href, icon: group.icon, key: group.key },
        group.color
      );
    }

    return (
      <div key={group.key} className="space-y-1.5">
        <div
          className={`
            group relative flex items-center rounded-md border px-3 py-2 text-[13px] font-bold transition-all duration-300
            ${isGroupActiveState
              ? activeStyles
              : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
            }
          `}
        >
          {/* Main Parent Menu Link: 
              1) 첫 번째 클릭 (다른 페이지나 서브메뉴에서 클릭): 홈으로 '이동만' 수행 (서브메뉴 안 펼쳐짐)
              2) 두 번째 클릭 (이미 홈에 머무를 때 클릭): 서브메뉴 펼쳐짐
              3) 세 번째 클릭 (서브메뉴 펼쳐진 상태에서 다시 클릭): 서브메뉴 접힘
          */}
          <Link
            href={group.href}
            onClick={(e) => {
              const isExactHome = normalizePath(pathname) === normalizePath(group.href);
              if (isExactHome) {
                // 이미 정확히 해당 홈 페이지에 있을 때만 토글 (2번째 클릭 펼침 -> 3번째 클릭 접힘)
                e.preventDefault();
                toggleGroup(group.key);
              } else {
                // 첫 번째 클릭: 홈으로 이동만 진행 (서브메뉴 자동 펼침 절대 안 함)
                setOptimisticActiveKey(group.key);
                setIsMobileOpen(false);
                // 서브메뉴에서 대메뉴 홈으로 빠져나올 때는 펼쳐져 있던 서브메뉴를 닫아줌
                if (isExpanded) {
                  toggleGroup(group.key);
                }
              }
            }}
            className="flex flex-1 items-center gap-2.5 min-w-0 cursor-pointer select-none"
          >
            <Icon size={15} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isGroupActiveState ? "text-white" : group.color}`} />
            <span className="truncate">{group.name}</span>
          </Link>

          {/* 서브메뉴 순수 토글 버튼: 활성화 상태일 때 또렷한 화이트 컬러 표시 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleGroup(group.key);
            }}
            className={`flex h-5.5 w-5.5 items-center justify-center rounded transition-colors ml-auto shrink-0 cursor-pointer ${
              isGroupActiveState
                ? "text-white/90 hover:text-white hover:bg-white/20"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            }`}
            aria-label={isExpanded ? "하위 메뉴 접기" : "하위 메뉴 펼치기"}
          >
            {isExpanded ? <ChevronDown size={14} className="stroke-[2.5]" /> : <ChevronRight size={14} className="stroke-[2.5]" />}
          </button>
        </div>

        {isExpanded && group.children && (
          <div className="space-y-1 py-0.5">
            {group.children.map((child) => {
              const ChildIcon = child.icon || FileText;
              const isChildActive = isPathActive(child.href);
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  onClick={() => {
                    setOptimisticActiveKey(group.key);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[12px] font-bold transition-all duration-200
                    ${isChildActive
                      ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 font-extrabold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-white"
                    }
                  `}
                >
                  <ChildIcon size={14} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isChildActive ? "text-blue-500 dark:text-blue-400" : "text-zinc-400"}`} />
                  <span className="truncate">{child.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      id="global-studio-sidebar"
      className={`
        fixed left-0 top-0 z-[110] flex h-screen min-h-screen rounded-none flex-col border-r border-zinc-200 dark:border-slate-800/80
        bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:h-full lg:z-30
        ${isCollapsed ? "lg:w-14" : "lg:w-[220px]"}
        ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* 🌟 사이드바 상단 헤더: 메인페이지와 100% 동일한 로고 크기(h-8) 및 사이드바 배경 일체화 */}
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-zinc-200 dark:border-slate-800/80 px-4 bg-white dark:bg-slate-900 transition-colors duration-300">
        {isCollapsed ? (
          <div className="flex w-full items-center justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-white cursor-pointer"
              title="사이드바 펼치기"
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <Link
              href="/"
              className="flex h-10 items-center justify-center transition hover:opacity-85"
            >
              <img
                src="/logo.png"
                alt="CreaiBox"
                className="h-5 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo_dark.png"
                alt="CreaiBox"
                className="h-5 w-auto object-contain hidden dark:block"
              />
            </Link>
          </div>
        )}
      </div>

      <div className={`flex-1 px-2.5 py-4 ${isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"}`}>
        <nav className="space-y-2">{menuGroups.map(renderGroup)}</nav>
      </div>

      {!isCollapsed && (
        <div className="shrink-0 border-t border-zinc-200 dark:border-slate-800/80 px-3 py-3.5 bg-white dark:bg-slate-900 rounded-none">
          <p className="text-center text-[13px] font-bold tracking-tight text-zinc-500 dark:text-zinc-400 select-none">
            © CreaiBox AI Studio
          </p>
        </div>
      )}
    </aside>
  );
}
