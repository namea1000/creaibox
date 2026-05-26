"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const fetchNickname = useCallback(
    async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.warn("닉네임 로드 실패:", error.message);
          return;
        }

        setNickname(profile?.nickname ?? "");
      } catch (err) {
        console.error("닉네임 로드 실패:", err);
      }
    },
    [supabase]
  );

  const applySessionUser = useCallback(
    async (nextUser: User | null) => {
      setUser(nextUser);

      if (nextUser?.id) {
        await fetchNickname(nextUser.id);
      } else {
        setNickname("");
      }
    },
    [fetchNickname]
  );

  useEffect(() => {
    let cancelled = false;

    setIsMounted(true);

    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        await applySessionUser(session?.user ?? null);
      } catch (error) {
        console.error("세션 확인 실패:", error);
        if (!cancelled) {
          setUser(null);
          setNickname("");
        }
      } finally {
        if (!cancelled) {
          setIsAuthReady(true);
        }
      }
    };

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;

      setIsAuthReady(true);

      if (event === "SIGNED_OUT") {
        setUser(null);
        setNickname("");
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        void fetchNickname(session.user.id);
      } else {
        setUser(null);
        setNickname("");
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      cancelled = true;
      document.removeEventListener("mousedown", handleClickOutside);
      subscription.unsubscribe();
    };
  }, [applySessionUser, fetchNickname, supabase]);

  useEffect(() => {
    if (!isMounted) return;

    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isMounted]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      const { error } = await supabase.auth.signOut({
        scope: "global",
      });

      if (error) throw error;

      setUser(null);
      setNickname("");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      window.alert("로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { label: "콘텐츠 기획", href: "/studio/planning" },
    { label: "글쓰기", href: "/studio/writing" },
    { label: "블로그", href: "/studio/blog" },
    { label: "이미지", href: "/studio/image" },
    { label: "비디오", href: "/studio/video" },
    { label: "뮤직", href: "/studio/music" },
    { label: "키워드 트랜드", href: "/studio/keyword" },
    { label: "유튜브 트랜드", href: "/studio/youtube" },
    { label: "리포트", href: "/studio/report" },
    { label: "Tools", href: "/studio/tools" },
  ];

  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="h-20 border-b flex items-center px-6 lg:px-12 z-[100] fixed top-0 left-0 right-0 transition-all bg-[#0a0c10]/80 backdrop-blur-md border-zinc-800/50">
      <div className="flex items-center w-[240px] shrink-0">
        <Link href="/" className="cursor-pointer z-[110] block">
          <Image
            src="/logobg.webp"
            alt="CreAIbox Logo"
            width={200}
            height={36}
            className="object-contain object-left"
            priority
          />
        </Link>
      </div>

      <div className="hidden lg:flex flex-1 justify-center items-center">
        <nav className="flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[18px] font-black uppercase tracking-tight transition-all duration-300 relative py-1 text-zinc-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center justify-end gap-2 ml-auto w-[160px] lg:w-[180px] shrink-0">
        {isMounted && isAuthReady && (
          user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-1 rounded-full transition-all border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black tracking-wider">
                  {userInitial}
                </div>
                <ChevronDown
                  size={14}
                  className={`mr-1 transition-transform text-zinc-400 ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110] border bg-zinc-900 border-zinc-800 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2.5 border-b border-zinc-800/60 mb-1 bg-zinc-950/40">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      Logged in as
                    </p>
                    <p className="text-xs font-bold text-zinc-200 truncate mt-0.5">
                      {user.email}
                    </p>

                    {nickname && (
                      <div className="mt-1.5 pt-1.5 border-t border-zinc-800 flex items-center gap-1.5">
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-bold">
                          NICK
                        </span>
                        <span className="text-xs font-black text-emerald-400 truncate">
                          {nickname}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left text-zinc-300 hover:bg-zinc-800"
                  >
                    <UserIcon size={14} />
                    내 프로필
                  </Link>

                  <Link
                    href="/apivault"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left text-zinc-300 hover:bg-zinc-800"
                  >
                    <Settings size={14} />
                    API 키 관리
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all border-t border-zinc-800 mt-1 text-left disabled:opacity-50"
                  >
                    <LogOut size={14} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                className="text-base font-bold text-zinc-200 hover:text-white transition-colors"
              >
                로그인
              </Link>
              <Link href="/signup">
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-base font-black rounded-lg shadow-lg active:scale-95 transition-all whitespace-nowrap">
                  회원가입
                </button>
              </Link>
            </div>
          )
        )}

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 transition-all hover:border-blue-500/40 hover:text-blue-400"
          aria-label="모바일 메뉴 열기"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed left-0 right-0 top-20 z-[120] border-b border-zinc-800 bg-[#0a0c10]/98 shadow-2xl lg:hidden animate-in fade-in slide-in-from-top duration-200">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-black text-zinc-100 transition-all hover:border-blue-500/30 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-zinc-800 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base font-black tracking-wider">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-zinc-100">
                        {nickname || user.email}
                      </p>
                      {nickname && (
                        <p className="truncate text-xs font-bold text-zinc-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href="/mypage"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-3 text-center text-sm font-black text-zinc-200"
                    >
                      내 프로필
                    </Link>
                    <Link
                      href="/apivault"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-3 text-center text-sm font-black text-zinc-200"
                    >
                      API 키
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-center text-sm font-black text-red-400 disabled:opacity-50"
                    >
                      {isLoggingOut ? "처리 중" : "로그아웃"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-center text-sm font-black text-zinc-100"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-black text-white"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}