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
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

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
    setIsMounted(true);

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

      await supabase.auth.signOut({
        scope: "global",
      });

      setUser(null);
      setNickname("");
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

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
    { label: "기능", href: "#features" },
    { label: "사용방법", href: "#how-it-works" },
    { label: "가격", href: "/pricing" },
    { label: "블로그", href: "/studio/blog" },
    { label: "가이드", href: "/about" },
    { label: "고객지원", href: "/help" },
  ];

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex w-[220px] shrink-0 items-center">
          <Link href="/" className="block">
            <Image
              src="/logobg.webp"
              alt="CreAIbox"
              width={190}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-9 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-extrabold text-slate-600 transition-all hover:text-violet-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden w-[300px] shrink-0 items-center justify-end gap-3 lg:flex">
          {!isMounted || !isAuthReady ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-100" />
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-4 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ) : user ? (
            <>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
              >
                <Sparkles size={16} />
                스튜디오 시작하기
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-sm font-black text-white">
                    {userInitial}
                  </div>

                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        Logged in as
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-slate-700">
                        {nickname || user.email}
                      </p>
                    </div>

                    <Link
                      href="/studio"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50"
                    >
                      <LayoutDashboard size={16} />
                      스튜디오로 이동
                    </Link>

                    <Link
                      href="/mypage"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50"
                    >
                      <UserIcon size={16} />
                      내 프로필
                    </Link>

                    <Link
                      href="/apivault"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50"
                    >
                      <Settings size={16} />
                      API 키 관리
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                로그인
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
              >
                <Sparkles size={16} />
                무료로 시작하기
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-2xl lg:hidden">
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {!isAuthReady ? (
              <div className="col-span-2 h-12 animate-pulse rounded-2xl bg-slate-100" />
            ) : user ? (
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
                  className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-slate-700"
                >
                  로그인
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3 text-center text-sm font-black text-white"
                >
                  무료 시작
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}