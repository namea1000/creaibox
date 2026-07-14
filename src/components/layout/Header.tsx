"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  HelpCircle,
  Video,
  Music,
  TrendingUp,
  Newspaper,
  Lightbulb,
  Image as ImageIcon,
  Globe,
  Folder,
  PenTool,
  Sun,
  Moon,
  FileText,
  Users,
  BarChart3,
  Database,
  Search,
  Bot,
  Wand2,
  Eye,
  Palette,
  Tags,
  CircleHelp,
  RefreshCw,
  Eraser,
  Maximize,
  BadgeDollarSign,
  Library,
  Megaphone,
  Gauge,
  Layers,
  PieChart,
  LineChart,
  Award,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { SiYoutube } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [planName, setPlanName] = useState("Free");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isYoutubeMenuOpen, setIsYoutubeMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
  const [isKeywordMenuOpen, setIsKeywordMenuOpen] = useState(false);

  // 모바일 아코디언 상태
  const [isMobMegaOpen, setIsMobMegaOpen] = useState(false);
  const [isMobYoutubeOpen, setIsMobYoutubeOpen] = useState(false);
  const [isMobToolsOpen, setIsMobToolsOpen] = useState(false);
  const [isMobDesignOpen, setIsMobDesignOpen] = useState(false);
  const [isMobKeywordOpen, setIsMobKeywordOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("studio_theme") as "light" | "dark" | null;
    const currentTheme = savedTheme || "dark";
    setTheme(currentTheme);
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("studio_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("nickname, membership_level")
          .eq("id", userId)
          .maybeSingle();

        return {
          nickname: data?.nickname ?? "",
          membershipLevel: data?.membership_level ?? "free",
        };
      } catch {
        return { nickname: "", membershipLevel: "free" };
      }
    },
    [supabase]
  );

  useEffect(() => {
    // Restore cache safely on mount to prevent SSR Hydration Mismatch
    if (typeof window !== "undefined") {
      try {
        const cachedUser = localStorage.getItem("creaibox_cached_user");
        const cachedNickname = localStorage.getItem("creaibox_cached_nickname");
        const cachedPlanName = localStorage.getItem("creaibox_cached_planname");
        
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          if (cachedNickname) {
            setNickname(cachedNickname);
          }
          if (cachedPlanName) {
            setPlanName(cachedPlanName);
          }
          setIsAuthReady(true);
        }
      } catch (e) {
        console.warn("Failed to restore cached auth session:", e);
      }
    }

    let cancelled = false;

    const applyUser = async (nextUser: User | null) => {
      if (cancelled) return;

      if (nextUser?.id) {
        // Apply cached profile first to avoid flickering
        let cachedNickname = "";
        let cachedPlanName = "Free";
        if (typeof window !== "undefined") {
          cachedNickname = localStorage.getItem("creaibox_cached_nickname") || "";
          cachedPlanName = localStorage.getItem("creaibox_cached_planname") || "Free";
        }
        
        setUser(nextUser);
        if (cachedNickname) {
          setNickname(cachedNickname);
        }
        if (cachedPlanName) {
          setPlanName(cachedPlanName);
        }

        // Fetch the fresh profile in the background
        const profileData = await fetchProfile(nextUser.id);
        if (!cancelled) {
          setNickname(profileData.nickname);
          
          const rawLevel = String(profileData.membershipLevel || "free").toLowerCase();
          const mappedLevel = rawLevel === "admin"
            ? "Admin"
            : rawLevel === "creator"
            ? "Creator"
            : rawLevel === "pro"
            ? "Pro"
            : rawLevel === "business"
            ? "Business"
            : "Free";
            
          setPlanName(mappedLevel);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("creaibox_cached_user", JSON.stringify(nextUser));
              localStorage.setItem("creaibox_cached_nickname", profileData.nickname);
              localStorage.setItem("creaibox_cached_planname", mappedLevel);
            } catch (e) {
              console.warn("Failed to cache user session:", e);
            }
          }
        }
      } else {
        setUser(null);
        setNickname("");
        setPlanName("Free");
        setIsProfileOpen(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("creaibox_cached_user");
          localStorage.removeItem("creaibox_cached_nickname");
          localStorage.removeItem("creaibox_cached_planname");
        }
      }

      if (!cancelled) setIsAuthReady(true);
    };

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        await applyUser(session?.user ?? null);
      } catch {
        await applyUser(null);
      }
    };

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      void applyUser(session?.user ?? null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchProfile, supabase]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // 3초 타임아웃 세이프티 가드: Supabase API 로그아웃 통신이 펜딩되더라도 로컬 세션을 강제 파괴하고 로그아웃 완료
      await Promise.race([
        supabase.auth.signOut({ scope: "global" }),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      setUser(null);
      setNickname("");
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      if (typeof window !== "undefined") {
        localStorage.removeItem("creaibox_cached_user");
        localStorage.removeItem("creaibox_cached_nickname");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      window.alert("로그아웃 중 문제가 발생했습니다.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { label: "가격", href: "/pricing", icon: CreditCard },
    { label: "블로그", href: "/blog", icon: FileText },
    { label: "가이드", href: "/about", icon: HelpCircle },
    { label: "고객지원", href: "/help", icon: MessageSquare },
  ];

  const getDisplayName = () => {
    if (nickname.trim()) return nickname.trim();
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName().trim();

    if (/[가-힣]/.test(name)) {
      return name.replace(/\s/g, "").slice(0, 2);
    }

    const parts = name.split(/[\s._-]+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const displayName = getDisplayName();
  const initials = getInitials();

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b-2 border-slate-300/85 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300">
      <div className="w-full flex h-16 items-center justify-between px-5 lg:px-10">
        <div className="flex w-[160px] shrink-0 items-center">
          <Link href="/" className="flex h-10 items-center overflow-hidden transition hover:scale-[1.02] active:scale-[0.98]">
            <Image
              src="/logobg.webp"
              alt="CreAibox"
              width={140}
              height={24}
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logobg_dark.webp"
              alt="CreAibox"
              width={140}
              height={24}
              className="object-contain hidden dark:block"
              priority
            />
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {/* AI 도구 Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3 whitespace-nowrap">
              AI 도구
            </button>

            {isMegaMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 -mt-1.5 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1: Video & Image */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">영상 & 이미지</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/studio/video" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/10 shrink-0">
                          <Video size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">비디오 스튜디오</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">쇼츠 및 영상 숏폼 기획</p>
                        </div>
                      </Link>
                      <Link href="/video-editor" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/10 shrink-0">
                          <Video size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">영상 편집기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">설치 없는 브라우저 영상 작업</p>
                        </div>
                      </Link>

                      <Link href="/media-library" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/10 shrink-0">
                          <Folder size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">미디어 라이브러리</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">무료 이미지 및 영상 소스</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: Writing & News */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">글쓰기 & 뉴스</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/ai-writer" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <PenTool size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 글쓰기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">블로그, 네이버 자동 글 생성</p>
                        </div>
                      </Link>
                      <Link href="/news-content" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-500 border border-cyan-500/10 shrink-0">
                          <Newspaper size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">뉴스 콘텐츠</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">뉴스 아티클 및 소식 작성</p>
                        </div>
                      </Link>
                      <Link href="/idea-hub" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Lightbulb size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">콘텐츠 아이디어 허브</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">급상승 글감 기획 및 제안</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Site Builder */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">홈페이지 제작</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/website-builder" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500 border border-indigo-500/10 shrink-0">
                          <Globe size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 홈페이지 제작</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">랜딩페이지 원클릭 자동 배포</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: Sound & Utility */}
                  {/* Column 4: Sound Hub */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">사운드 허브</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/lyric-generator" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/10 shrink-0">
                          <Music size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">가사 소재 허브</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 사운드 및 가사 창작</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 키워드 트렌드 Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsKeywordMenuOpen(true)}
            onMouseLeave={() => setIsKeywordMenuOpen(false)}
          >
            <Link href="/keyword-trend" className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3 whitespace-nowrap">
              키워드 트렌드
            </Link>

            {isKeywordMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/4 -mt-1.5 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1: 키워드 발굴 & 대량 조회 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">키워드 발굴 & 대량 조회</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/keyword-trend/bulk" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <Database size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">키워드 대량 조회</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">수천 개의 키워드 실시간 일괄 지표 분석</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/related" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <Layers size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">연관 키워드 발굴</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">연관성 높은 최적의 서브 키워드 추출</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/morphology" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <PieChart size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">형태소 분석기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">한국어 형태소 형태 분석 및 분석 요약</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: 키워드 추적 & 경쟁 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">키워드 추적 & 경쟁</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/keyword-trend/rank" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <LineChart size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">실시간 순위 추적</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">특정 키워드 기반 순위 흐름 실시간 모니터링</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/seo" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <Search size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">SEO 경쟁 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">상위 노출을 위한 최적의 SEO 지표 매칭</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: 트렌드 & 분석 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">트렌드 & 분석</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/keyword-trend/rising" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <TrendingUp size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">트렌드 급상승 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">실시간 급상승 키워드 세부 정보 추적</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/youtube" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <SiYoutube size={14} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 키워드 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">유튜브 내 검색 유도 키워드 정합성 대조</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/dashboard" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <BarChart3 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">트렌드 대시보드</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">전체 핵심 트렌드 현황 종합 지표 뷰어</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/trends" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <TrendingUp size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">트렌드 키워드</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">플래너 맞춤형 추천 트렌드 키워드 연계</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: AI 전략 & 연결 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">AI 전략 & 연결</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/keyword-trend/strategy" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <Bot size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 키워드 전략 생성</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI가 제안하는 키워드 연계 포지셔닝 플랜</p>
                        </div>
                      </Link>
                      <Link href="/keyword-trend/workflow" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">자동 콘텐츠 연결</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">키워드 발굴 후 콘텐츠 제작 파이프라인 매핑</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 유튜브 트렌드 Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsYoutubeMenuOpen(true)}
            onMouseLeave={() => setIsYoutubeMenuOpen(false)}
          >
            <Link href="/youtube-trend" className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3 whitespace-nowrap">
              유튜브 트렌드
            </Link>

            {isYoutubeMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/3 -mt-1.5 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1: 트렌드 & 리포트 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">트렌드 & 리포트</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/youtube-trend/top300" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Award size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 랭킹 TOP 300</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5 font-bold">인기 채널 랭킹 및 필터링</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/search" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Search size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 영상 검색</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5 font-bold">키워드 기반 입체 영상 검색</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/rising" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <TrendingUp size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">급상승 영상 트렌드</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">인기 급상승 키워드 트렌드</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/reports" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">급상승 영상분석 리포트</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">급상승 영상 AI 리포트</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/channel" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Users size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">인기채널 영상분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">급상승 채널 동향 분석</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/channel-reports" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">인기채널 영상분석 리포트</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">인기 채널 AI 분석 보고서</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: 채널 비교 & 수익 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">채널 비교 & 수익</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/youtube-trend/compare" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <BarChart3 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">경쟁 채널 비교</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">채널 경쟁력 스코어 비교</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/cpm" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Database size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">광고 단가 계산기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">유튜브 예상 CPM 및 단가 산출</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: 분석 & 연구소 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">분석 & 연구소</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/youtube-trend/seo" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Search size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 SEO 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">태그 및 디스크립션 최적화</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/shorts" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Video size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">쇼츠 바이럴 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">쇼츠 알고리즘 도달 최적화</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/thumbnail" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <ImageIcon size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">썸네일 CTR 연구소</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">썸네일 클릭률 및 디자인 분석</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/youtube-thumbnail" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <SiYoutube size={14} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 썸네일 다운로더</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">고화질 썸네일 이미지 추출</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: 제작 & 자동화 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">제작 & 자동화</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/youtube-trend/title" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 제목 생성기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 추천 클릭유도 제목</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/report" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">콘텐츠 전략 리포트</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">시청자 반응 및 제작 전략 리포트</p>
                        </div>
                      </Link>
                      <Link href="/youtube-trend/workflow" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <Bot size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 자동 제작 연결</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 비디오 자동 제작 매핑</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tools Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsMenuOpen(true)}
            onMouseLeave={() => setIsToolsMenuOpen(false)}
          >
            <Link href="/utility-tools" className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3 whitespace-nowrap">
              Tools
            </Link>

            {isToolsMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 -mt-1.5 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1: AI 분석 & 이미지 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">AI 분석 & 이미지</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/utility-tools/bg-remover" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Wand2 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 누끼 제거</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">이미지 배경 자동 제거 및 누끼 추출</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/ocr" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Eye size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI OCR 문자 추출</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">이미지에서 텍스트 감지 및 추출</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/color-picker" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Palette size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">색상 추출기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">이미지 내 정확한 컬러 코드 검출</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: 문서 & 리포트 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">문서 & 리포트</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/utility-tools/pdf-analyzer" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">PDF 문서 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">PDF 문서 업로드 및 AI 분석 요약</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/metadata" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Database size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">메타데이터 추출기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">다양한 파일의 숨은 속성 데이터 분석</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: 프롬프트 & 유틸리티 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">프롬프트 & 유틸리티</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/utility-tools/prompt-studio" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 프롬프트 스튜디오</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">고급 AI 지시문 템플릿 제작</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/hashtag" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <Tags size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">해시태그 생성기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">블로그 및 SNS 해시태그 자동 추출</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/qr" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <CircleHelp size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">QR 생성기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">웹사이트/텍스트용 QR 코드 생성</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: 포맷 & 개발 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">포맷 & 개발</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/utility-tools/converter" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <RefreshCw size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">포맷 변환기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">이미지, 문서 등의 확장자 일괄 변환</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools/code-beautifier" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">코드 뷰티파이어</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">소스코드 정렬 및 난독화 해제</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 디자인 Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsDesignMenuOpen(true)}
            onMouseLeave={() => setIsDesignMenuOpen(false)}
          >
            <Link href="/design" className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3 whitespace-nowrap">
              디자인
            </Link>

            {isDesignMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 -mt-1.5 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1: 디자인 & 기획 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">디자인 & 기획</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/design/workspace" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Wand2 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">디자인 편집기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">디자인 편집 및 레이아웃 워크스페이스</p>
                        </div>
                      </Link>
                      <Link href="/design/magic-design" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">AI 매직 디자인</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 자동 이미지 스타일 및 시안 디자인</p>
                        </div>
                      </Link>
                      <Link href="/design/brand-kit" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Palette size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">브랜드 키트</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">로고, 색상 등 브랜드 자산 사전 설정</p>
                        </div>
                      </Link>
                      <Link href="/design/editor" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Wand2 size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">간편 이미지 편집기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">빠르고 직관적인 필터 및 자르기 도구</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 2: 콘텐츠 & 배너 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">콘텐츠 & 배너</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/design/thumbnail" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <ImageIcon size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">썸네일 메이커</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">유튜브 및 포털 고성능 썸네일 기획</p>
                        </div>
                      </Link>
                      <Link href="/design/poster" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">포스터 & 전단지</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">오프라인 및 온라인 포스터 템플릿</p>
                        </div>
                      </Link>
                      <Link href="/design/business-card" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <BadgeDollarSign size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">디지털 명함</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">세련된 모바일 명함 신속 제작</p>
                        </div>
                      </Link>
                      <Link href="/design/banner" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Megaphone size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">현수막 & 배너</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">대형 출력물 및 광고 배너 그리드</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: 이미지 변환 & 처리 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">이미지 변환 & 처리</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/design/upscaler" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">이미지 AI 업스케일러</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">저화질 이미지 고대비 해상도 변환</p>
                        </div>
                      </Link>
                      <Link href="/design/converter" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <RefreshCw size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">이미지 확장자 변환기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">PNG, JPG, WEBP 일괄 포맷 교체</p>
                        </div>
                      </Link>
                      <Link href="/design/bg-remover" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Eraser size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">이미지 배경 제거기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 자동 누끼 제거 및 투명화</p>
                        </div>
                      </Link>
                      <Link href="/design/resizer" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Maximize size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">이미지 크기 조절기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">정밀 해상도 및 픽셀 규격 재조정</p>
                        </div>
                      </Link>
                      <Link href="/design/webp-compressor" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Gauge size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">WEBP 일괄 압축기</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">용량 절감을 위한 대량 초압축 프로세스</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 4: 템플릿 & 프롬프트 */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">템플릿 & 프롬프트</h3>
                    <div className="flex flex-col gap-1 text-left">
                      <Link href="/design/templates" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Library size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">템플릿 라이브러리</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">완성형 추천 디자인 샘플 보관소</p>
                        </div>
                      </Link>
                      <Link href="/design/prompts" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10 shrink-0">
                          <Library size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">프롬프트 라이브러리</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">미드저니 및 스테이블디퓨전 명령어 가이드</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-extrabold text-slate-700 dark:text-white transition-all hover:text-violet-600 dark:hover:text-violet-400 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-3 lg:flex">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 shrink-0"
            title={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {!isAuthReady ? (
            // Placeholder skeleton with exact matching size (150px) to prevent layout shift
            <div className="h-10 w-[150px] rounded-xl border border-slate-200/50 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 animate-pulse shrink-0" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-10 w-[150px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 shrink-0"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-[10px] font-black text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-black leading-tight text-slate-800 dark:text-zinc-200">
                    {displayName}
                  </p>
                  <p className="mt-0.5 truncate text-[9px] font-bold leading-tight text-slate-450 dark:text-zinc-400">
                    {planName}
                  </p>
                </div>

                <ChevronDown
                  size={13}
                  className={`shrink-0 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-sm font-black text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-slate-800 dark:text-zinc-200">
                          {displayName}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-500 dark:text-zinc-400">
                          {planName}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 truncate border-t border-slate-200 pt-4 text-xs font-bold text-slate-400 dark:border-zinc-800 dark:text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/studio"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <LayoutDashboard size={18} />
                    스튜디오로 이동
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <Sparkles size={18} />
                    요금제 업그레이드
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <CreditCard size={18} />
                    요금제 관리
                  </Link>

                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <UserIcon size={18} />
                    프로필
                  </Link>

                  <Link
                    href="/apivault"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <Settings size={18} />
                    설정 / API 키 관리
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 border-t border-slate-100 px-5 py-3 text-sm font-black text-slate-700 dark:text-zinc-300 dark:border-zinc-800 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                  >
                    <HelpCircle size={18} />
                    도움말
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-4 border-t border-slate-100 dark:border-zinc-800 px-5 py-3 text-left text-sm font-black text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-[180px] items-center justify-end gap-1 pl-2 shrink-0">
              <Link
                href="/signup"
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
              >
                로그인
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-5 shadow-2xl lg:hidden max-h-[80vh] overflow-y-auto">
          {/* 🌟 모바일 전용 현재 로그인 정보 카드 (로그인되어 있을 때만 출력) */}
          {user && (
            <div className="mb-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 p-3.5 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center font-black text-sm">
                {getInitials()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-black text-slate-800 dark:text-zinc-100 truncate block">
                    {getDisplayName()}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-violet-500/10 dark:bg-violet-400/10 px-1.5 py-0.5 text-[10px] font-black text-violet-600 dark:text-violet-400 border border-violet-500/10">
                    {planName === "free" || planName === "Free" ? "Free 요금제" : planName}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block mt-0.5 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            {/* 1. AI 도구 아코디언 */}
            <div>
              <button
                onClick={() => setIsMobMegaOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" />
                  <span>AI 도구</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 dark:text-zinc-350 transition-transform duration-200 ${isMobMegaOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobMegaOpen && (
                <div className="mt-1.5 ml-2 pl-3 border-l-2 border-violet-500/30 grid gap-1.5 py-1">
                  <Link href="/studio/writing/creaibox/new-post" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 새글쓰기</Link>
                  <Link href="/studio/writing/naver/blog-automation" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">1인 블로그 자동화</Link>
                  <Link href="/studio/design/creative-studio" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 이미지 스튜디오</Link>
                  <Link href="/studio/music/lyric-generator" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 작사/작곡</Link>
                  <Link href="/studio/video/video-generator" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 비디오 스튜디오</Link>
                  <Link href="/studio/music/sound-hub" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">사운드 허브</Link>
                  <Link href="/studio/utility-tools" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">유틸리티 도구</Link>
                </div>
              )}
            </div>

            {/* 2. 키워드 트렌드 아코디언 */}
            <div>
              <button
                onClick={() => setIsMobKeywordOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-violet-500" />
                  <span>키워드 트렌드</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 dark:text-zinc-350 transition-transform duration-200 ${isMobKeywordOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobKeywordOpen && (
                <div className="mt-1.5 ml-2 pl-3 border-l-2 border-violet-500/30 grid gap-1.5 py-1">
                  <Link href="/keyword-trend" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">키워드 분석 홈</Link>
                  <Link href="/keyword-trend/realtime" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">실시간 검색 트렌드</Link>
                  <Link href="/keyword-trend/explorer" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">키워드 탐색기</Link>
                  <Link href="/keyword-trend/rank-tracker" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">블로그 순위 추적</Link>
                  <Link href="/keyword-trend/site-audit" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">사이트 검색 진단</Link>
                </div>
              )}
            </div>

            {/* 3. 유튜브 트렌드 아코디언 */}
            <div>
              <button
                onClick={() => setIsMobYoutubeOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-violet-500" />
                  <span>유튜브 트렌드</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 dark:text-zinc-350 transition-transform duration-200 ${isMobYoutubeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobYoutubeOpen && (
                <div className="mt-1.5 ml-2 pl-3 border-l-2 border-violet-500/30 grid gap-1.5 py-1">
                  <Link href="/youtube-trend" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">유튜브 트렌드 홈</Link>
                  <Link href="/youtube-trend/ranking" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">유튜브 랭킹 TOP 300</Link>
                  <Link href="/youtube-trend/thumbnail-downloader" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">유튜브 썸네일 추출</Link>
                  <Link href="/youtube-trend/shorts-script" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 쇼츠 대본 제너레이터</Link>
                  <Link href="/youtube-trend/translator" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">다국어 번역 및 AI 더빙</Link>
                </div>
              )}
            </div>

            {/* 4. Tools 아코디언 */}
            <div>
              <button
                onClick={() => setIsMobToolsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Folder size={16} className="text-violet-500" />
                  <span>Tools</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 dark:text-zinc-350 transition-transform duration-200 ${isMobToolsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobToolsOpen && (
                <div className="mt-1.5 ml-2 pl-3 border-l-2 border-violet-500/30 grid gap-1.5 py-1">
                  <Link href="/studio/client-site-builder" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 홈페이지 제작</Link>
                  <Link href="/media-library" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">에셋 라이브러리</Link>
                  <Link href="/content-planner/idea-hub" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">콘텐츠 아이디어 허브</Link>
                  <Link href="/content-planner/ai-planner" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 콘텐츠 기획기</Link>
                  <Link href="/content-planner/calendar" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">콘텐츠 캘린더</Link>
                  <Link href="/help/creator-wiki" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">크리에이터 백과</Link>
                </div>
              )}
            </div>

            {/* 5. 디자인 아코디언 */}
            <div>
              <button
                onClick={() => setIsMobDesignOpen((prev) => !prev)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-violet-500" />
                  <span>디자인</span>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 dark:text-zinc-350 transition-transform duration-200 ${isMobDesignOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobDesignOpen && (
                <div className="mt-1.5 ml-2 pl-3 border-l-2 border-violet-500/30 grid gap-1.5 py-1">
                  <Link href="/design" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">디자인 스튜디오 홈</Link>
                  <Link href="/design/bg-remover" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 누끼 제거</Link>
                  <Link href="/design/upscaler" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">AI 업스케일러</Link>
                  <Link href="/design/mockup" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">목업 제너레이터</Link>
                  <Link href="/design/templates" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-bold text-slate-600 dark:text-zinc-400 py-1 hover:text-violet-500">템플릿 라이브러리</Link>
                </div>
              )}
            </div>

            {/* 고정 메뉴 루프 (가격, 블로그, 가이드, 고객지원) */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-700 dark:text-white flex items-center gap-2"
                >
                  <Icon size={16} className="text-violet-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-zinc-850 pt-4">
            <span className="text-xs font-black text-slate-500 dark:text-zinc-400">테마 설정</span>
            <button
              onClick={toggleTheme}
              className="flex h-10 px-4 items-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-750 shadow-sm transition active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={14} className="text-amber-500" />
                  <span>라이트 모드로 전환</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-violet-500" />
                  <span>다크 모드로 전환</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {user ? (
              <>
                <Link
                  href="/studio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3 text-center text-sm font-black text-white"
                >
                  스튜디오
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-red-100 dark:border-zinc-800 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm font-black text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-center text-sm font-black text-slate-700 dark:text-zinc-300"
                >
                  로그인
                </Link>

                <Link
                  href="/studio"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3 text-center text-sm font-black text-white"
                >
                  스튜디오 시작
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
