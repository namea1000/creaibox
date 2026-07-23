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

  const displayName = getDisplayName();
  const initials = getInitials();

  return (
    <div className="sticky top-0 lg:top-16 z-40 h-16 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#06080d]/95 pl-4 pr-5 backdrop-blur-xl transition-colors duration-300 lg:pl-5 lg:pr-8">
      <div className="flex h-full items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-1.5 py-1 pl-0 pr-2 text-sm font-bold text-zinc-650 dark:text-zinc-300 xl:flex">
          <Link
            href="/"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-white transition-colors duration-300"
          >
            <Home size={15} />
          </Link>

          <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />

          <Link href="/studio" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-500 transition-colors">
            Studio
          </Link>

          {pathname !== "/studio" && (
            <>
              <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
              <span className="capitalize text-blue-500 dark:text-blue-400">
                {pathname.replace("/studio/", "").split("/")[0]}
              </span>
            </>
          )}
        </div>

        <form onSubmit={handlePromptSubmit} className="relative w-full max-w-[420px]">
          <div className="flex h-10 items-center rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 transition focus-within:border-blue-500/50">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예) 삼성전자 주가 전망 블로그 글 작성해줘"
              className="h-full flex-1 bg-transparent pl-4 pr-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50 outline-none placeholder:text-zinc-700 dark:placeholder:text-white"
            />

            <button
              type="submit"
              className="mr-1 flex h-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-3.5 text-[11px] font-black text-white transition hover:bg-blue-500 whitespace-nowrap shadow-md shadow-blue-500/20"
            >
              AI 자동 글쓰기
            </button>
          </div>
        </form>

        {/* 스튜디오 탑바 퀵 도크(Dock) 툴바 */}
        <div className="hidden items-center justify-center px-4 xl:flex">
          <div className="flex h-10 items-center gap-1 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-1.5">
            {[
              { icon: <PenLine size={14} />, label: "크리에이박스 글쓰기", href: "/studio/writing/creaibox/new-post", color: "text-blue-500 hover:bg-blue-500/10 hover:text-blue-300" },
              { icon: <Edit3 size={14} />, label: "네이버 글쓰기", href: "/studio/writing/naver/create", color: "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300" },
              { icon: <TrendingUp size={14} />, label: "유튜브 트렌드", href: "/youtube-trend", color: "text-red-500 hover:bg-red-500/10 hover:text-red-300" },
              { icon: <LineChart size={14} />, label: "키워드 트렌드", href: "/keyword-trend", color: "text-amber-500 hover:bg-amber-500/10 hover:text-amber-300" },
              { icon: <ImageIcon size={14} />, label: "디자인 스튜디오", href: "/design", color: "text-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-fuchsia-300" },
              { icon: <Music size={14} />, label: "뮤직 스튜디오", href: "/studio/music", color: "text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-300" },
              { icon: <Video size={14} />, label: "비디오 스튜디오", href: "/video-editor", color: "text-pink-500 hover:bg-pink-500/10 hover:text-pink-300" },
              { icon: <Folder size={14} />, label: "미디어 라이브러리", href: "/media-library", color: "text-teal-500 hover:bg-teal-500/10 hover:text-teal-300" },
              { icon: <Globe size={14} />, label: "홈페이지 빌더", href: "/website-builder", color: "text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`group relative flex h-7.5 w-7.5 items-center justify-center rounded-lg transition-all duration-300 ${item.color}`}
              >
                {item.icon}
                {/* 인터랙티브 한글 툴팁 */}
                <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 scale-90 rounded-md bg-zinc-900/95 dark:bg-zinc-800/95 px-2 py-1.5 text-[10.5px] font-black text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap border border-zinc-700/30">
                  {item.label}
                  {/* 말풍선 꼬리 */}
                  <span className="absolute left-1/2 bottom-full -translate-x-1/2 -mb-1 border-4 border-transparent border-b-zinc-900/95 dark:border-b-zinc-800/95" />
                </span>
              </Link>
            ))}
          </div>
        </div>







        <Link
          href="/library"
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-3.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 md:flex"
        >
          <Library size={15} className="text-sky-400 shrink-0" />
          <span className="text-[13px] font-bold">내 콘텐츠 보관함</span>
        </Link>

        <Link
          href="/studio/dashboard"
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-3.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 md:flex"
        >
          <LayoutDashboard size={15} className="text-blue-400 shrink-0" />
          <span className="text-[13px] font-bold">관리 대시보드</span>
        </Link>

        <Link
          href="/utility-tools"
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-3.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 md:flex"
        >
          <Wand2 size={15} className="text-amber-400 shrink-0" />
          <span className="text-[13px] font-bold">스튜디오 Tools</span>
        </Link>

        <button
          onClick={() => window.dispatchEvent(new Event("open-faq-chatbot"))}
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-3.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 md:flex"
        >
          <HelpCircle size={15} className="text-emerald-400 shrink-0" />
          <span className="text-[13px] font-bold">FAQ 챗봇</span>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("open-cre-note"))}
          className="hidden h-10 items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12]/45 px-3.5 text-zinc-600 dark:text-zinc-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-zinc-100/50 dark:hover:bg-[#141622]/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 md:flex"
        >
          <StickyNote size={15} className="text-purple-400 shrink-0" />
          <span className="text-[13px] font-bold">Cre Note</span>
        </button>

        <div className="flex shrink-0 justify-end md:min-w-[190px]">
          {/* 로그인 세션은 메인 헤더에 있으므로 탑바에서는 제거함 */}
        </div>
      </div>
    </div>
  );
}