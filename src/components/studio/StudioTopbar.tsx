"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import {
  Menu,
  Plus,
  Search,
  SlidersHorizontal,
  Folder,
  Bell,
  Send,
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
  const [planName] = useState("Plus");
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

  const fetchNickname = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", userId)
          .maybeSingle();

        return data?.nickname ?? "";
      } catch {
        return "";
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
        const nextNickname = await fetchNickname(nextUser.id);
        if (!cancelled) setNickname(nextNickname);
      } else {
        setNickname("");
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
  }, [fetchNickname, supabase]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      router.push("/studio/writing/creaibox/create");
      return;
    }

    router.push(
      `/studio/writing/creaibox/create?prompt=${encodeURIComponent(prompt)}`
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

  const displayName = getDisplayName();
  const initials = getInitials();

  return (
    <div className="sticky top-0 z-40 h-20 border-b border-zinc-200 dark:border-zinc-800/70 bg-white/95 dark:bg-[#06080d]/95 px-5 backdrop-blur-xl transition-colors duration-300 lg:px-8">
      <div className="flex h-full items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden min-w-[260px] items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 py-2 pl-2 pr-3 text-sm font-bold text-zinc-650 dark:text-zinc-300 xl:flex">
          <Link
            href="/"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white transition-colors duration-300"
          >
            <Home size={16} />
          </Link>

          <ChevronRight size={14} className="text-zinc-400 dark:text-zinc-600" />

          <Link href="/studio" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-500 transition-colors">
            Studio
          </Link>

          {pathname !== "/studio" && (
            <>
              <ChevronRight size={14} className="text-zinc-400 dark:text-zinc-600" />
              <span className="capitalize text-blue-500 dark:text-blue-400">
                {pathname.replace("/studio/", "").split("/")[0]}
              </span>
            </>
          )}
        </div>

        <form onSubmit={handlePromptSubmit} className="relative min-w-0 flex-1">
          <div className="flex h-12 items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 shadow-2xl shadow-black/5 dark:shadow-black/20 transition focus-within:border-blue-500/50">
            <button
              type="button"
              onClick={() => router.push("/studio/writing/creaibox/create")}
              className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white"
            >
              <Plus size={19} />
            </button>

            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="무엇을 만들어 볼까요? 예: 삼성전자 주가 전망 블로그 글 작성해줘"
              className="h-full flex-1 bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />

            <button
              type="button"
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white"
            >
              <SlidersHorizontal size={18} />
            </button>

            <button
              type="submit"
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500"
            >
              <Send size={17} />
            </button>
          </div>
        </form>

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white md:flex">
          <Folder size={20} />
        </button>

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white md:flex">
          <Search size={20} />
        </button>

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white md:flex">
          <Bell size={20} />
        </button>

        {/* 🌓 Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white md:flex"
          aria-label="Toggle theme"
          title={theme === "dark" ? "밝은 테마로 변경" : "어두운 테마로 변경"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
          className="hidden h-12 items-center gap-2 rounded-xl border border-cyan-200 dark:border-cyan-400/20 bg-cyan-50 dark:bg-cyan-500/10 px-4 text-cyan-600 dark:text-cyan-300 transition hover:bg-cyan-100 dark:hover:bg-cyan-500/15 hover:text-cyan-700 dark:hover:text-cyan-200 md:flex"
        >
          <Bot size={20} />
          <span className="text-sm font-black text-cyan-700 dark:text-zinc-100">
            AI Assistant
          </span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("open-cre-note"))}
          className="hidden h-12 items-center gap-2 rounded-xl border border-purple-200 dark:border-white/10 bg-purple-600 dark:bg-purple-700 px-4 text-white dark:text-zinc-300 transition hover:bg-purple-700 dark:hover:bg-purple-600 md:flex"
        >
          <StickyNote size={20} />
          <span className="text-sm font-black text-white dark:text-zinc-100">Cre Note</span>
        </button>

        <div className="flex shrink-0 justify-end md:min-w-[190px]">
          {!isAuthReady ? (
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-1.5 py-1.5">
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800" />
              <div className="mr-1 hidden h-4 w-4 animate-pulse rounded bg-zinc-800 md:block" />
            </div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 md:w-auto md:min-w-[190px] md:justify-start md:gap-3 md:px-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-xs font-black text-white md:h-10 md:w-10">
                  {initials}
                </div>

                <div className="hidden min-w-0 flex-1 text-left md:block">
                  <p className="truncate text-sm font-black leading-tight text-zinc-800 dark:text-zinc-100">
                    {displayName}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold leading-tight text-zinc-500 dark:text-zinc-500">
                    {planName}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`hidden shrink-0 text-zinc-400 dark:text-zinc-400 transition md:block ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-[22px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] shadow-2xl z-50">
                  <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-sm font-black text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-zinc-900 dark:text-zinc-100">
                          {displayName}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-zinc-500 dark:text-zinc-400">
                          {planName}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 truncate border-t border-zinc-200 dark:border-zinc-800 pt-4 text-xs font-bold text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-2.5 text-base font-black text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Sparkles size={20} />
                    요금제 업그레이드
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-2.5 text-base font-black text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <CreditCard size={20} />
                    요금제 관리
                  </Link>

                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-2.5 text-base font-black text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <UserIcon size={20} />
                    프로필
                  </Link>

                  <Link
                    href="/apivault"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-2.5 text-base font-black text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Settings size={20} />
                    설정 / API 키 관리
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 border-t border-zinc-200 dark:border-zinc-800 px-5 py-4 text-base font-black text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <HelpCircle size={20} />
                    도움말
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-4 border-t border-zinc-200 dark:border-zinc-800 px-5 py-4 text-left text-base font-black text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut size={20} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-black text-zinc-300 transition hover:border-blue-500/40 hover:text-white"
              >
                <LogIn size={17} />
                로그인
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 text-sm font-black text-white transition hover:scale-[1.02]"
              >
                <UserPlus size={17} />
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}