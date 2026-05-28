"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

interface StudioTopbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function StudioTopbar({ setIsMobileOpen }: StudioTopbarProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (nextUser?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", nextUser.id)
          .maybeSingle();

        if (!cancelled) setNickname(data?.nickname ?? "");
      }

      setIsAuthReady(true);
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;

      setUser(nextUser);
      setIsAuthReady(true);

      if (nextUser?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", nextUser.id)
          .maybeSingle();

        setNickname(data?.nickname ?? "");
      } else {
        setNickname("");
        setIsProfileOpen(false);
      }
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
  }, [supabase]);

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

      await supabase.auth.signOut({ scope: "global" });

      setUser(null);
      setNickname("");

      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="sticky top-0 z-40 h-20 border-b border-zinc-800/70 bg-[#06080d]/95 px-5 backdrop-blur-xl lg:px-8">
      <div className="flex h-full items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={handlePromptSubmit} className="relative flex-1">
          <div className="flex h-14 items-center rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/20 transition focus-within:border-blue-500/50">
            <button
              type="button"
              onClick={() => router.push("/studio/writing/creaibox/create")}
              className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              <Plus size={19} />
            </button>

            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="무엇을 만들어 볼까요? 예: 삼성전자 주가 전망 블로그 글 작성해줘"
              className="h-full flex-1 bg-transparent px-3 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-600"
            />

            <button
              type="button"
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
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

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:text-white md:flex">
          <Folder size={20} />
        </button>

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:text-white md:flex">
          <Search size={20} />
        </button>

        <button className="hidden h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:text-white md:flex">
          <Bell size={20} />
        </button>

        {isAuthReady && (
          user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-1.5 py-1.5 transition hover:border-blue-500/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-sm font-black text-white">
                  {userInitial}
                </div>
                <ChevronDown
                  size={15}
                  className={`mr-1 text-zinc-400 transition ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-[22px] border border-zinc-800 bg-[#18181b] shadow-2xl">
                  <div className="border-b border-zinc-800 px-5 py-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">
                      Logged in as
                    </p>
                    <p className="mt-2 truncate text-base font-bold text-zinc-100">
                      {user.email}
                    </p>

                    {nickname && (
                      <div className="mt-4 flex items-center gap-3 border-t border-zinc-800 pt-4">
                        <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-400">
                          NICK
                        </span>
                        <span className="truncate text-base font-black text-emerald-400">
                          {nickname}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 text-base font-black text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <UserIcon size={20} />
                    내 프로필
                  </Link>

                  <Link
                    href="/apivault"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 text-base font-black text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <Settings size={20} />
                    API 키 관리
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-4 border-t border-zinc-800 px-5 py-4 text-left text-base font-black text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <LogOut size={20} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
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
          )
        )}
      </div>
    </div>
  );
}