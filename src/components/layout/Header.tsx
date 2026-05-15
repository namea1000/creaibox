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
  const [isLoading, setIsLoading] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

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
    } finally {
      // 닉네임까지 다 가져오면 로딩 끝!
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const initHeader = async () => {
      // 🌟 [핵심] 세션 체크 속도를 위해 getSession 사용
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && mounted) {
        setUser(session.user);
        await fetchNickname(session.user.id);
      } else if (mounted) {
        setIsLoading(false);
      }
    };

    initHeader();

    // 🌟 [강력 보강] 브라우저 탭을 이동하거나 다시 돌아올 때도 세션 유지 확인
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchNickname(session.user.id);
      } else {
        setUser(null);
        setNickname("");
        setIsLoading(false);
      }
      
      // 상태 변화가 확실할 때만 리프레시
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
      mounted = false;
      document.removeEventListener("mousedown", handleClickOutside);
      subscription.unsubscribe();
    };
  }, [fetchNickname, supabase.auth, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
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

  return (
    <header className="h-20 border-b flex items-center px-6 lg:px-12 z-[100] fixed top-0 left-0 right-0 transition-all bg-[#0a0c10]/80 backdrop-blur-md border-zinc-800/50">
      
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group transition-all duration-500 z-[110]">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image 
              src="/logobg.webp" 
              alt="Logo" 
              width={40}
              height={40}
              className="relative z-10 object-contain" 
              priority 
            />
          </div>
          <span className="text-xl font-black italic tracking-tighter transition-all text-white">
            AI Contents <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Studio</span>
          </span>
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

      <div className="flex items-center gap-3 ml-auto">
        {/* 🌟 로딩 중일 때는 아무것도 안 보여주다가, 체크 끝나면 바로 등장 */}
        {!isLoading && (
          user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all group border border-transparent hover:bg-zinc-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                  {nickname ? nickname[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "U")}
                </div>
                <div className="flex items-center gap-2 leading-tight">
                  <span className="text-[14px] font-bold text-zinc-200 group-hover:text-white">
                    {nickname || user.email?.split('@')[0] || "User"}
                  </span>
                </div>
                <ChevronDown size={14} className={`transition-transform text-zinc-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110] border bg-zinc-900 border-zinc-800 animate-in fade-in zoom-in duration-200">
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
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-base font-black rounded-lg shadow-lg active:scale-95 transition-all">회원가입</button>
              </Link>
            </div>
          )
        )}

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-all">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-[120] p-6 lg:hidden bg-[#0a0c10] animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-black text-left border-b border-zinc-800/30 py-4 uppercase italic text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}