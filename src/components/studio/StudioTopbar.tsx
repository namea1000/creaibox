"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import {
  Menu,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  CreditCard,
  HelpCircle,
  Home,
  ChevronRight,
  StickyNote,
  Bot,
  Sun,
  Moon,
  Video,
  PenLine,
  TrendingUp,
  ImageIcon,
  Folder,
  Globe,
  Edit3,
  Music,
  LineChart,
  Wand2,
  LayoutDashboard,
  Library,
} from "lucide-react";

interface StudioTopbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function StudioTopbar({ setIsMobileOpen }: StudioTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [planName, setPlanName] = useState("Free");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Theme management state
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  const getDisplayName = useCallback(() => {
    if (nickname.trim()) return nickname.trim();
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }, [nickname, user]);

  const getInitials = useCallback(() => {
    const name = getDisplayName().trim();

    if (/[가-힣]/.test(name)) {
      return name.replace(/\s/g, "").slice(0, 2);
    }

    const parts = name.split(/[\s._-]+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }, [getDisplayName]);

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
    let cancelled = false;

    const applyUser = async (nextUser: User | null) => {
      if (cancelled) return;

      setUser(nextUser);

      if (nextUser?.id) {
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
        }
      } else {
        setNickname("");
        setPlanName("Free");
        setIsProfileOpen(false);
      }

      if (!cancelled) setIsAuthReady(true);
    };

    const loadUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        await applyUser(session?.user ?? null);
      } catch {
        await applyUser(null);
      }
    };

    void loadUser();

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

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      router.push("/studio/writing/creaibox/new-post");
      return;
    }

    router.push(
      `/studio/writing/creaibox/new-post?prompt=${encodeURIComponent(prompt.trim())}`
    );
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      setIsProfileOpen(false);

      // 3초 타임아웃 세이프티 가드: Supabase API 로그아웃 통신이 펜딩되더라도 로컬 세션을 강제 파괴하고 로그아웃 완료
      await Promise.race([
        supabase.auth.signOut({ scope: "global" }),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);

      setUser(null);
      setNickname("");

      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <div className="shrink-0 h-16 w-full z-40 border-b border-zinc-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 sm:px-6 backdrop-blur-xl transition-colors duration-300 select-none flex items-center">
      <div className="flex h-full w-full items-center justify-start gap-3">
        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-zinc-700 dark:text-slate-200 transition-colors duration-200 lg:hidden shrink-0 hover:bg-zinc-100 dark:hover:bg-slate-700 cursor-pointer"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>

        {/* 상단 헤드탑 바로가기 핵심 메뉴 5종 (사이드바와 100% 동일한 폰트 text-[13px] font-bold 및 각진 사각 rounded-md) */}
        <div className="flex items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
          <Link
            href="/studio/dashboard"
            className={`group relative inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold transition-all duration-300 shrink-0 ${
              pathname?.startsWith("/studio/dashboard")
                ? "border-blue-500/30 bg-blue-500/15 text-blue-500 dark:text-blue-400 shadow-sm"
                : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard size={15} className="shrink-0 text-blue-500 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="whitespace-nowrap leading-none">관리 대시보드</span>
          </Link>

          <Link
            href="/library"
            className={`group relative inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold transition-all duration-300 shrink-0 ${
              pathname?.startsWith("/library")
                ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 shadow-sm"
                : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
            }`}
          >
            <Library size={15} className="shrink-0 text-cyan-500 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="whitespace-nowrap leading-none">내 콘텐츠 보관함</span>
          </Link>

          <Link
            href="/utility-tools"
            className={`group relative inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold transition-all duration-300 shrink-0 ${
              pathname?.startsWith("/utility-tools")
                ? "border-amber-500/30 bg-amber-500/15 text-amber-500 dark:text-amber-400 shadow-sm"
                : "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white"
            }`}
          >
            <Wand2 size={15} className="shrink-0 text-amber-500 dark:text-amber-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="whitespace-nowrap leading-none">스튜디오 Tools</span>
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-faq-chatbot"))}
            className="group relative inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white transition-all duration-300 shrink-0 cursor-pointer"
          >
            <HelpCircle size={15} className="shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="whitespace-nowrap leading-none">FAQ 챗봇</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-cre-note"))}
            className="group relative inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2.5 text-[13px] font-bold border-slate-300 bg-slate-50 text-slate-900 dark:border-white/15 dark:bg-[#0c0d12]/45 dark:text-zinc-100 hover:border-slate-400 hover:bg-zinc-100/50 dark:hover:border-white/30 dark:hover:bg-[#141622]/80 dark:hover:text-white transition-all duration-300 shrink-0 cursor-pointer"
          >
            <StickyNote size={15} className="shrink-0 text-purple-500 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="whitespace-nowrap leading-none">Cre Note</span>
          </button>
        </div>

        {/* 🌟 우측: 다크/화이트 모드 토글 + 로그인 세션 프로필 (사이드바와 100% 동일한 각진 rounded-md 사양) */}
        <div className="ml-auto flex items-center gap-2.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 dark:border-zinc-700/80 bg-slate-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 shadow-xs transition hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
            title={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Session Profile & Dropdown */}
          <div className="flex items-center shrink-0">
            {!isAuthReady ? (
              <div className="h-9 w-36 rounded-md border border-slate-200/50 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex h-9 items-center gap-2.5 rounded-md border border-slate-300 dark:border-zinc-700/80 bg-slate-50 dark:bg-zinc-900 px-3 shadow-xs transition hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-[10px] font-black text-white">
                    {getInitials()}
                  </div>

                  <div className="min-w-0 text-left">
                    <p className="truncate text-xs font-black leading-tight text-slate-800 dark:text-zinc-200 max-w-[100px]">
                      {getDisplayName()}
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded bg-blue-500/10 dark:bg-blue-500/20 px-1.5 py-0.5 text-[9.5px] font-black text-blue-600 dark:text-blue-400 border border-blue-500/20 leading-none">
                    {planName}
                  </span>

                  <ChevronDown
                    size={13}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5 dark:border-zinc-800/80 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-xs font-black text-white">
                          {getInitials()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-800 dark:text-zinc-200">
                            {getDisplayName()}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-zinc-400">
                            {planName} 플랜
                          </p>
                        </div>
                      </div>

                      <p className="mt-2.5 truncate border-t border-slate-200 dark:border-zinc-800 pt-2 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/mypage"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                    >
                      <UserIcon size={15} />
                      마이페이지 / 계정
                    </Link>

                    <Link
                      href="/pricing"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                    >
                      <Sparkles size={15} />
                      요금제 관리
                    </Link>

                    <Link
                      href="/apivault"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                    >
                      <Settings size={15} />
                      설정 / API 키 관리
                    </Link>

                    <Link
                      href="/help"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 dark:border-zinc-800 transition hover:bg-violet-50 dark:hover:bg-zinc-800/80"
                    >
                      <HelpCircle size={15} />
                      고객지원 / 도움말
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 border-t border-slate-100 dark:border-zinc-800 px-4 py-2.5 text-left text-xs font-bold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50 cursor-pointer"
                    >
                      <LogOut size={15} />
                      {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-1 text-xs font-extrabold text-slate-700 dark:text-zinc-200 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-xs font-extrabold text-white transition shadow-xs"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}