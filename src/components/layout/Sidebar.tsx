"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  HelpCircle,
  MessageCircle,
  FileText,
  Newspaper,
  Share2,
  Sparkles,
  Type,
  UserCircle,
  Search,
  Image as ImageIcon,
  Video,
  Music,
  Wand2,
  Mic2,
  BarChart3,
  Repeat,
  Key,
  User as UserIcon,
  PenTool,
  Info,
  Layers,
  Library,
  Store,
  Users,
} from "lucide-react";

interface SidebarProps {
  activeMenu?: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeMenu = "Studio",
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const menuIcons: Record<string, any> = {
    "스튜디오 홈": LayoutDashboard,
    "콘텐츠 라이브러리": Library,
    "CreAIbox 블로그 글쓰기": FileText,
    "워드프레스 글쓰기": FileText,
    "네이버 글쓰기": Newspaper,
    "뉴스 글쓰기": Newspaper,
    "SNS 글쓰기": Share2,
    "광고 카피라이팅": Sparkles,
    "텍스트 변형/확장": Type,
    "AI 캐릭터 페르소나 설정기": UserCircle,
    "SEO 최적화 메타 데이터": Search,
    "이미지 생성기": ImageIcon,
    "비디오 생성기": Video,
    "썸네일 생성기": Wand2,
    "Suno 스타일 라이브러리": Music,
    "Suno 작곡": Music,
    "가사 생성기": Mic2,
    "대본 생성기": FileText,
    "AI 트렌드 대시보드": BarChart3,
    "다채널 리포퍼징": Repeat,
    "키워드 분석": Search,
    "관리 대시보드": LayoutDashboard,
    "마켓플레이스": Store,
    "인포센터": Info,
    "커뮤니티": Users,
    "API 키 관리": Key,
    "내 프로필": UserIcon,
    "FAQ / Q&A": HelpCircle,
    "AI 챗봇": MessageCircle,
  };

  const iconColors: Record<string, string> = {
    "스튜디오 홈": "text-blue-400",
    "콘텐츠 라이브러리": "text-sky-400",
    "CreAIbox 블로그 글쓰기": "text-blue-400",
    "워드프레스 글쓰기": "text-indigo-400",
    "네이버 글쓰기": "text-emerald-400",
    "뉴스 글쓰기": "text-orange-400",
    "SNS 글쓰기": "text-pink-400",
    "광고 카피라이팅": "text-violet-400",
    "텍스트 변형/확장": "text-cyan-400",
    "AI 캐릭터 페르소나 설정기": "text-rose-400",
    "SEO 최적화 메타 데이터": "text-lime-400",
    "이미지 생성기": "text-purple-400",
    "비디오 생성기": "text-teal-400",
    "썸네일 생성기": "text-amber-400",
    "Suno 스타일 라이브러리": "text-fuchsia-400",
    "Suno 작곡": "text-rose-400",
    "가사 생성기": "text-yellow-400",
    "대본 생성기": "text-slate-300",
    "AI 트렌드 대시보드": "text-blue-400",
    "다채널 리포퍼징": "text-emerald-400",
    "키워드 분석": "text-cyan-400",
    "관리 대시보드": "text-blue-400",
    "마켓플레이스": "text-emerald-400",
    "인포센터": "text-amber-400",
    "커뮤니티": "text-pink-400",
    "API 키 관리": "text-violet-400",
    "내 프로필": "text-sky-400",
    "FAQ / Q&A": "text-yellow-400",
    "AI 챗봇": "text-emerald-400",
  };

  const mainMenus = [
    { name: "스튜디오 홈", href: "/studio" },
    { name: "콘텐츠 라이브러리", href: "/studio/library" },
    { name: "크리아이박스 블로그", href: "/studio/blog" },
    { name: "콘텐츠 기획", href: "/studio/planning" },
    { name: "크리아이박스 글쓰기", href: "/studio/writing/creaibox" },
    { name: "네이버 글쓰기", href: "/studio/writing/naver" },
    { name: "뮤직 스튜디오", href: "/studio/music" },
    { name: "이미지 스튜디오", href: "/studio/image" },
    { name: "비디오 스튜디오", href: "/studio/video" },
    { name: "키워드 트랜드 분석", href: "/studio/keyword" },
    { name: "유튜브 트랜드 분석", href: "/studio/youtube" },
    { name: "AI 리포트", href: "/studio/report" },
    { name: "뉴스 콘텐츠", href: "/news" },
    { name: "스튜디오 Tools", href: "/studio/tools" },
  ];

  const sidebarData: Record<string, { name: string; href: string }[]> = {
    Writing: [
      { name: "CreAIbox 블로그 글쓰기", href: "/studio/writing/creaibox/create" },
      { name: "워드프레스 글쓰기", href: "/studio/writing/wp/create" },
      { name: "네이버 글쓰기", href: "/studio/writing/naver/create" },
      { name: "뉴스 글쓰기", href: "/studio/writing/news" },
      { name: "SNS 글쓰기", href: "/studio/writing/sns" },
      { name: "광고 카피라이팅", href: "/studio/writing/copy" },
      { name: "텍스트 변형/확장", href: "/studio/writing/transform" },
      { name: "AI 캐릭터 페르소나 설정기", href: "/studio/writing/persona" },
      { name: "SEO 최적화 메타 데이터", href: "/studio/writing/seo" },
    ],
    Visuals: [
      { name: "이미지 생성기", href: "/studio/visuals/image" },
      { name: "비디오 생성기", href: "/studio/visuals/video" },
      { name: "썸네일 생성기", href: "/studio/visuals/thumb" },
    ],
    Music: [
      { name: "Suno 스타일 라이브러리", href: "/studio/music/library" },
      { name: "Suno 작곡", href: "/studio/music/compose" },
      { name: "가사 생성기", href: "/studio/music/lyrics" },
    ],
    Script: [{ name: "대본 생성기", href: "/studio/script/gen" }],
    Tools: [
      { name: "AI 트렌드 대시보드", href: "/studio/tools/trend" },
      { name: "다채널 리포퍼징", href: "/studio/tools/repurposing" },
      { name: "키워드 분석", href: "/studio/tools/keyword" },
    ],
    Studio: [],
  };

  const manageMenus = [
    { name: "관리 대시보드", href: "/dashboard" },
    { name: "마켓플레이스", href: "/marketplace" },
    { name: "인포센터", href: "/infocenter" },
    { name: "커뮤니티", href: "/community" },
  ];

  const accountMenus = [
    { name: "API 키 관리", href: "/apivault" },
    { name: "내 프로필", href: "/mypage" },
    { name: "FAQ / Q&A", href: "/faq" },
    { name: "AI 챗봇", href: "/chatbot" },
  ];

  const renderMenuItem = (item: { name: string; href: string }) => {
    const Icon = menuIcons[item.name] || PenTool;
    const isActive =
      item.href === "/studio" ? pathname === "/studio" : pathname.startsWith(item.href);

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? item.name : undefined}
        className={`
          group flex items-center rounded-lg px-2.5 py-2 text-[12.5px] font-bold transition-all
          ${isActive
            ? "border border-blue-500/40 bg-blue-600/20 text-white shadow-lg shadow-blue-950/20"
            : "text-zinc-100 hover:bg-zinc-800/80 hover:text-white"
          }
          ${isCollapsed ? "lg:justify-center lg:px-0" : "gap-2.5"}
        `}
      >
        <Icon
          size={16}
          className={`shrink-0 ${isActive ? "text-blue-300" : iconColors[item.name] || "text-zinc-300"}`}
        />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  const sectionTitle = (label: string) =>
    !isCollapsed && (
      <p className="mb-2 ml-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-blue-400/90">
        {label}
      </p>
    );

  return (
    <aside
      className={`
        fixed left-0 top-0 z-[70] flex h-screen flex-col border-r border-zinc-800/80
        bg-[#090e15] transition-all duration-300 ease-in-out lg:sticky
        ${isCollapsed ? "lg:w-14" : "lg:w-56"}
        ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* 로고 */}
      <div className="flex h-20 items-center border-b border-zinc-800/80 px-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-950/30">
            <Layers size={18} />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">CreAIbox</p>
              <p className="truncate text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                Studio Workspace
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* 메인 메뉴 */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4">
        <div className="mb-3 flex items-center justify-between">
          {sectionTitle("Workspace")}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition hover:border-blue-500/50 hover:bg-zinc-800 hover:text-white lg:flex"
            title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        <nav className="mb-5 space-y-1">
          {mainMenus.map(renderMenuItem)}
        </nav>

        {sidebarData[activeMenu]?.length > 0 && (
          <nav className="mb-5 space-y-1">
            {sectionTitle(`${activeMenu} Tools`)}
            {sidebarData[activeMenu].map(renderMenuItem)}
          </nav>
        )}
      </div>

      {/* 하단 고정 메뉴 */}
      <div className="shrink-0 border-t border-zinc-800/80 px-2.5 py-3">
        <nav className="mb-4 space-y-1">
          {sectionTitle("Manage")}
          {manageMenus.map(renderMenuItem)}
        </nav>

        <nav className="space-y-1">
          {sectionTitle("Account")}
          {accountMenus.map(renderMenuItem)}
        </nav>
      </div>

      {!isCollapsed && (
        <div className="shrink-0 border-t border-zinc-800/80 px-3 py-2.5">
          <p className="text-center text-[8px] font-bold leading-relaxed text-zinc-500">
            © CreAIbox Studio
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