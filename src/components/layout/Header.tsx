"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, User as UserIcon, Settings, LogOut, 
  Sun, Moon, Menu, X, Key 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onMenuClick?: (menuValue: string) => void;
  setViewMode?: (mode: string) => void; 
}

export default function Header({ isDarkMode, toggleTheme, onMenuClick, setViewMode }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚀 [수정] 로고 클릭 시 새로고침 없이 메인(Landing)으로 전환
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 새로고침 대신 상태를 관리하는 부모의 로직을 타게 하거나, 
    // 단순히 메인 페이지 주소로 부드럽게 이동하게 합니다.
    // 현재 구조에서는 Link처럼 작동하게 "/"로 보내주면 Next.js가 알아서 처리합니다.
    window.history.pushState({}, '', '/'); 
    window.dispatchEvent(new PopStateEvent('popstate')); // 뒤로가기 효과를 주어 메인 렌더링 유도
    
    // 만약 스튜디오 모드를 끄는 로직이 page.tsx에 있다면 
    // window.location.reload() 대신 아래처럼 직접 이동하는 것이 좋습니다.
    if (typeof window !== 'undefined') {
      // 가장 깔끔한 방법은 <a> 태그 기능을 살리되 SPA 라우팅을 유지하는 것입니다.
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleViewChange = (mode: string) => {
    if (setViewMode) {
      setViewMode(mode);
      setIsProfileOpen(false); 
      setIsMobileMenuOpen(false); 
    }
  };

  const menuItems = [
    { label: 'Writing Studio', value: 'Writing' },
    { label: 'Visuals Studio', value: 'Visuals' },
    { label: 'Music Studio', value: 'Music' },
    { label: 'Script Studio', value: 'Script' },
    { label: 'Tools', value: 'Tools' }
  ];

  return (
    <header className={`h-20 border-b flex items-center px-6 lg:px-12 z-[100] relative shrink-0 transition-all ${
      isDarkMode ? 'bg-[#0a0c10]/80 backdrop-blur-md border-zinc-800/50' : 'bg-white/80 backdrop-blur-md border-zinc-200'
    }`}>
      
      {/* 로고 영역 - Link 컴포넌트로 교체하여 새로고침 방지 */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer group transition-all duration-500"
        >
          <div className="relative w-40 h-40 overflow-visible">
            <Image 
              src="/logobg.webp" 
              alt="Logo" 
              fill 
              sizes="160px"
              style={{ objectFit: 'contain' }}
              className="relative z-10" 
              priority 
            />
          </div>
          <span className={`text-xl font-black italic tracking-tighter transition-all ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            AI Contents <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Studio</span>
          </span>
        </Link>
      </div>
      
      {/* 중앙 메뉴 (데스크톱) */}
      <div className="hidden lg:flex flex-1 justify-center items-center">
        <nav className="flex space-x-8">
          {menuItems.map((item) => (
            <button 
              key={item.value} 
              onClick={() => onMenuClick?.(item.value)} 
              className={`text-[15px] font-black uppercase tracking-tight transition-all duration-300 relative py-1 ${
                isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-50 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 우측 컨트롤 영역 */}
      <div className="flex items-center gap-3 ml-auto">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all active:scale-90 ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-yellow-400 hover:bg-zinc-800' : 'bg-white border-zinc-200 text-blue-600 hover:bg-zinc-100 shadow-sm'
          }`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all group border border-transparent ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className={`text-xs font-bold truncate max-w-[120px] ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>
                {user.email}
              </span>
              <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden z-[110] border ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
              }`}>
                <button 
                  onClick={() => handleViewChange('MyPage')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
                >
                  <UserIcon size={14} />내 프로필
                </button>

                <button 
                  onClick={() => handleViewChange('Vault')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}
                >
                  <Settings size={14} />API 키 관리
                </button>

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all border-t mt-1 text-left">
                  <LogOut size={14} />로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className={`text-xs font-bold opacity-70 hover:opacity-100 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>로그인</Link>
            <Link href="/signup">
              <button className="px-5 py-2 bg-[#F6962F] text-white text-xs font-black rounded-lg shadow-md active:scale-95">회원가입</button>
            </Link>
          </div>
        )}

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-zinc-500 hover:text-blue-500 transition-all">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 top-20 z-[120] p-6 lg:hidden ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'}`}>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button 
                key={item.value} 
                onClick={() => { onMenuClick?.(item.value); setIsMobileMenuOpen(false); }} 
                className={`text-2xl font-black text-left border-b border-zinc-800/30 py-4 uppercase italic ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}