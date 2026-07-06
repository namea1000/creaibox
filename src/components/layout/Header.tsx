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
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
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
    { label: "가격", href: "/pricing" },
    { label: "블로그", href: "/blog" },
    { label: "가이드", href: "/about" },
    { label: "고객지원", href: "/help" },
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
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-slate-200/70 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex w-[240px] shrink-0 items-center">
          <Link href="/" className="flex h-12 items-center overflow-hidden">
            <Image
              src="/logobg.webp"
              alt="CreAibox"
              width={198}
              height={32}
              className="object-contain dark:invert"
              priority
            />
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-9 lg:flex">
          {/* AI 도구 Hover Dropdown Megamenu */}
          <div
            className="relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-extrabold text-slate-600 dark:text-zinc-300 transition-all hover:text-violet-600 dark:hover:text-violet-400 py-3">
              AI 도구
              <ChevronDown size={14} className={`transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isMegaMenuOpen && (
              <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 mt-1 w-[920px] rounded-[28px] border border-slate-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 transition-all duration-300">
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
                      <Link href="/design" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-violet-500/10 rounded-xl text-violet-500 border border-violet-500/10 shrink-0">
                          <ImageIcon size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">디자인 (이미지 스튜디오)</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">썸네일 및 카드뉴스 제작</p>
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

                  {/* Column 4: Sound & Analytics */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-3 pl-1">분석 & 사운드</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/youtube-trend" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10 shrink-0">
                          <TrendingUp size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">유튜브 트렌드 분석</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">인기 급상승 키워드 트렌드</p>
                        </div>
                      </Link>
                      <Link href="/lyric-generator" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/10 shrink-0">
                          <Music size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">가사 소재 허브</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">AI 사운드 및 가사 창작</p>
                        </div>
                      </Link>
                      <Link href="/utility-tools" className="flex items-start gap-3 rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 group">
                        <div className="p-2 bg-slate-500/10 rounded-xl text-slate-500 border border-slate-500/10 shrink-0">
                          <Settings size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">스튜디오 Tools</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-0.5">텍스트 변환 및 글자 수 세기</p>
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
              className="text-sm font-extrabold text-slate-600 dark:text-zinc-300 transition-all hover:text-violet-600 dark:hover:text-violet-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-3 lg:flex">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 shrink-0"
            title={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/studio"
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02] whitespace-nowrap"
          >
            <Sparkles size={16} />
            AI 스튜디오 시작하기
          </Link>

          {!isAuthReady ? (
            // Placeholder skeleton with exact matching size (180px) to prevent layout shift
            <div className="h-14 w-[180px] rounded-2xl border border-slate-200/50 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 animate-pulse shrink-0" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-14 w-[180px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 shrink-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-xs font-black text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-black leading-tight text-slate-800">
                    {displayName}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold leading-tight text-slate-400">
                    {planName}
                  </p>
                </div>

                <ChevronDown
                  size={15}
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
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-600 dark:text-zinc-400 transition hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-600 dark:text-zinc-400 transition hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100"
              >
                로그인
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-5 shadow-2xl lg:hidden">
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm font-black text-slate-700 dark:text-zinc-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
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
                  AI 스튜디오 시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
