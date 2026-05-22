"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronDown, User as UserIcon, Settings, LogOut, 
  Menu, X 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string>(""); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🌟 하이드레이션 미스매치 방지용 플래그
  const [isMounted, setIsMounted] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // 🌟 프로필 테이블에서 닉네임 가져오는 최적화 함수
  const fetchNickname = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .single();
      
      if (profile?.nickname) {
        setNickname(profile.nickname);
      }
    } catch (err) {
      console.error("닉네임 로드 실패:", err);
    }
  }, [supabase]);

  useEffect(() => {
    setIsMounted(true);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchNickname(session.user.id); // 🌟 로그인 유저 확인 즉시 닉네임 비동기 로드
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchNickname(session.user.id);
      } else {
        setUser(null);
        setNickname("");
      }
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      subscription.unsubscribe();
    };
  }, [supabase.auth, router, fetchNickname]);

  useEffect(() => {
    if (!isMounted) return;

    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMounted]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setUser(null);
    setNickname("");
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    { label: '콘텐츠 기획', href: '/studio/planning' },
    { label: '글쓰기', href: '/studio/writing' },
    { label: '블로그', href: '/studio/blog' },
    { label: '이미지', href: '/studio/image' },
    { label: '비디오', href: '/studio/video' },
    { label: '뮤직', href: '/studio/music' },
    { label: '키워드 트랜드', href: '/studio/keyword' },
    { label: '유튜브 트랜드', href: '/studio/youtube' },
    { label: '리포트', href: '/studio/report' },
    { label: 'Tools', href: '/studio/tools' }
  ];

  // 🌟 이메일 기반 이니셜 생성 (닉네임 데이터가 오기 전 백업용으로 상주)
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="h-20 border-b flex items-center px-6 lg:px-12 z-[100] fixed top-0 left-0 right-0 transition-all bg-[#0a0c10]/80 backdrop-blur-md border-zinc-800/50">     

      {/* 좌측 로고 영역: 이미지 하나로 통째로 처리할 때 */}
<div className="flex items-center w-[240px] shrink-0">
  <Link href="/" className="cursor-pointer z-[110] block">
    {/* 🌟 메인 로고 파일의 가로세로 비율(예: 가로 150px, 세로 36px)을 그대로 헤더에 안착 */}
    <Image 
      src="/logobg.webp"  // 메인화면에서 쓰시는 그 이미지 경로 그대로 사용
      alt="CreAIbox Logo" 
      width={200}        // 헤더 높이에 맞게 가로폭 확보
      height={36}        // h-20(80px) 헤더 안에서 가장 예쁘게 배치되는 높이
      className="object-contain object-left" 
      priority 
    />
  </Link>
</div>


      {/* 중앙 메뉴 영역 */}
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

      {/* 우측 유저 컨트롤 영역 */}
      <div className="flex items-center justify-end gap-2 ml-auto w-[160px] lg:w-[180px] shrink-0">
        {isMounted && user && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1.5 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black tracking-wider">
              {userInitial}
            </div>
            <div className="max-w-[72px]">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Account</p>
              <p className="truncate text-[11px] font-bold text-zinc-200">{nickname || user.email}</p>
            </div>
          </button>
        )}
        
        {isMounted && (
          user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-1.5 p-1 rounded-full transition-all border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black tracking-wider">
                  {userInitial}
                </div>
                <ChevronDown size={14} className={`mr-1 transition-transform text-zinc-400 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110] border bg-zinc-900 border-zinc-800 animate-in fade-in zoom-in duration-200">
                  
                  {/* 🌟 [수정 포인트] 이메일 밑에 닉네임 레이아웃 추가 */}
                  <div className="px-4 py-2.5 border-b border-zinc-800/60 mb-1 bg-zinc-950/40">
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Logged in as</p>
                    <p className="text-xs font-bold text-zinc-200 truncate mt-0.5">{user.email}</p>
                    {/* 닉네임이 존재할 때만 하단에 엣지있게 노출 */}
                    {nickname && (
                      <div className="mt-1.5 pt-1.5 border-t border-zinc-850 flex items-center gap-1.5">
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-bold">NICK</span>
                        <span className="text-xs font-black text-emerald-400 truncate">{nickname}</span>
                      </div>
                    )}
                  </div>

                  <Link href="/mypage" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left text-zinc-300 hover:bg-zinc-800">
                    <UserIcon size={14} />내 프로필
                  </Link>
                  <Link href="/apivault" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left text-zinc-300 hover:bg-zinc-800">
                    <Settings size={14} />API 키 관리
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all border-t border-zinc-800 mt-1 text-left">
                    <LogOut size={14} />로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login" className="text-base font-bold text-zinc-200 hover:text-white transition-colors">로그인</Link>
              <Link href="/signup">
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-base font-black rounded-lg shadow-lg active:scale-95 transition-all whitespace-nowrap">회원가입</button>
              </Link>
            </div>
          )
        )}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 transition-all hover:border-blue-500/40 hover:text-blue-400"
          aria-label="모바일 메뉴 열기"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-[120] lg:hidden">
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="모바일 메뉴 닫기"
          />

          <div className="absolute inset-x-0 bottom-0 top-0 overflow-y-auto border-t border-zinc-800 bg-[#0a0c10] px-4 pb-8 pt-5 animate-in slide-in-from-right duration-300">
            <div className="mx-auto max-w-md space-y-4">
              <div className="flex items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-950/80 px-4 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Mobile Navigation</p>
                  <p className="mt-1 text-lg font-black text-white">메뉴를 선택해 바로 이동</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300"
                  aria-label="모바일 메뉴 닫기"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 p-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black tracking-wider">
                        {userInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Logged In</p>
                        <p className="truncate text-sm font-bold text-zinc-100">{user.email}</p>
                        {nickname && (
                          <p className="truncate text-xs font-black text-emerald-400">{nickname}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/mypage"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-black text-zinc-200"
                      >
                        내 프로필
                      </Link>
                      <Link
                        href="/apivault"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-black text-zinc-200"
                      >
                        API 키 관리
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-400"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Welcome</p>
                      <p className="mt-2 text-base font-black text-white">모바일에서도 로그인과 회원가입이 바로 보여야 합니다.</p>
                      <p className="mt-2 text-[13px] leading-6 text-zinc-400">먼저 계정을 만들거나 로그인한 뒤, 원하는 스튜디오로 바로 이동하세요.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Studio Menu</p>
                    <p className="mt-1 text-sm font-black text-zinc-100">한 번에 보기 쉽게 정리된 메뉴</p>
                  </div>
                  <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-black text-zinc-500">
                    {menuItems.length} ITEMS
                  </span>
                </div>

                <nav className="grid grid-cols-2 gap-3">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 text-sm font-black text-zinc-100 transition-all hover:border-blue-500/30 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
