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
    <div className="shrink-0 h-12 w-full z-40 border-b border-zinc-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 backdrop-blur-xl transition-colors duration-300 select-none">
      <div className="flex h-full items-center justify-start gap-2.5">
        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 lg:hidden shrink-0"
        >
          <Menu size={18} />
        </button>

        {/* 좌측 정렬 바로가기 핵심 메뉴 5종 */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
          <Link
            href="/library"
            className="group relative flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-2.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 shrink-0"
          >
            <Library size={14} className="text-sky-400 shrink-0" />
            <span className="text-[12px] font-bold whitespace-nowrap">내 콘텐츠 보관함</span>
            
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              내 콘텐츠 보관함
              <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
            </span>
          </Link>

          <Link
            href="/studio/dashboard"
            className="group relative flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-2.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 shrink-0"
          >
            <LayoutDashboard size={14} className="text-blue-400 shrink-0" />
            <span className="text-[12px] font-bold whitespace-nowrap">관리 대시보드</span>
            
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              관리 대시보드
              <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
            </span>
          </Link>

          <Link
            href="/utility-tools"
            className="group relative flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-2.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 shrink-0"
          >
            <Wand2 size={14} className="text-amber-400 shrink-0" />
            <span className="text-[12px] font-bold whitespace-nowrap">스튜디오 Tools</span>
            
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              스튜디오 Tools
              <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-faq-chatbot"))}
            className="group relative flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-2.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 shrink-0 cursor-pointer"
          >
            <HelpCircle size={14} className="text-emerald-400 shrink-0" />
            <span className="text-[12px] font-bold whitespace-nowrap">FAQ 챗봇</span>
            
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              FAQ 챗봇
              <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-cre-note"))}
            className="group relative flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-2.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 shrink-0 cursor-pointer"
          >
            <StickyNote size={14} className="text-purple-400 shrink-0" />
            <span className="text-[12px] font-bold whitespace-nowrap">Cre Note</span>
            
            {/* 0ms 실시간 직관 툴팁 */}
            <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2.5 py-1.5 text-[11px] font-black text-white opacity-0 shadow-xl transition-all duration-75 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/40">
              Cre Note
              <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}