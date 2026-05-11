"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, User as UserIcon, Settings, LogOut, 
  Sun, Moon, Menu, X 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onMenuClick?: (menuValue: string) => void;
}

export default function Header({ isDarkMode, toggleTheme, onMenuClick }: HeaderProps) {
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

  // 🚀 로고 클릭 시 확실하게 메인으로 보내는 함수
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/"; // 강제 새로고침 이동 (상태 꼬임 방지)
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
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
      
      {/* 로고 영역 (수정완료) */}
      <div className="flex items-center">
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group transition-all duration-500"
        >
          <div className="relative w-40 h-40 overflow-visible">
            <Image 
              src="/logobg.webp" 
              alt="Logo" 
              fill 
              className="object-contain relative z-10" 
              priority 
            />
          </div>
          <span className={`text-xl font-black italic tracking-tighter transition-all ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
      AI Contents <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Studio</span>
    </span>
        </a>
      </div>
      
      {/* 중앙 메뉴 (데스크톱) */}
      <div className="hidden lg:flex flex-1 justify-center items-center">
        <nav className="flex space-x-8">
          {menuItems.map((item) => (
            <button 
              key={item.value} 
              onClick={() => onMenuClick?.(item.value)} 
              className={`text-[15px] font-black uppercase tracking-tight transition-all duration-300 relative py-1 ${
                isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
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
                <Link href="/mypage" className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}>
                  <UserIcon size={14} />내 프로필
                </Link>
                <Link href="/adm/apivault" className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all ${isDarkMode ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-zinc-100'}`}>
                  <Settings size={14} />API 키 관리
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all border-t mt-1">
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