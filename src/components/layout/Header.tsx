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
  const [planName] = useState("Plus");

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
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex w-[220px] shrink-0 items-center">
          <Link href="/" className="block">
            <Image
              src="/logobg.webp"
              alt="CreAibox"
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

        <div className="hidden w-[390px] shrink-0 items-center justify-end gap-3 lg:flex">
          <Link
            href="/studio"
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
          >
            <Sparkles size={16} />
            AI 스튜디오 시작하기
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-14 min-w-[172px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
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
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 text-sm font-black text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-black text-slate-800">
                          {displayName}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-500">
                          {planName}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 truncate border-t border-slate-200 pt-4 text-xs font-bold text-slate-400">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/studio"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <LayoutDashboard size={18} />
                    스튜디오로 이동
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <Sparkles size={18} />
                    요금제 업그레이드
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <CreditCard size={18} />
                    요금제 관리
                  </Link>

                  <Link
                    href="/mypage"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <UserIcon size={18} />
                    프로필
                  </Link>

                  <Link
                    href="/apivault"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <Settings size={18} />
                    설정 / API 키 관리
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 border-t border-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-violet-50"
                  >
                    <HelpCircle size={18} />
                    도움말
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-4 border-t border-slate-100 px-5 py-3 text-left text-sm font-black text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 pl-2">
              <Link
                href="/signup"
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                회원가입
              </Link>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                로그인
              </Link>
            </div>
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
