"use client";

import React, { useState, useEffect, useRef } from 'react';
import StudioLayout from '@/components/layout/StudioLayout'; // 👈 독립시킨 스튜디오 레이아웃
import { ChevronDown, User as UserIcon, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function MainLandingPage() {
  // ✅ 스튜디오 활성화 여부 상태 (초기값은 false로 설정하여 아무것도 안 나오게 함)
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Writing');
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* 🚀 전역 헤더: 언제나 최상단에 위치 */}
      <header className="h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-8 z-[100]">
        <div className="flex items-center gap-12">
          {/* 로고 클릭 시 초기 상태(빈 화면)로 복귀 */}
          <div 
            className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase cursor-pointer"
            onClick={() => setIsStudioActive(false)}
          >
            CREBOX.AI
          </div>
          
          {/* 상단 메뉴 버튼들 */}
          <div className="hidden md:flex space-x-8">
            {['Writing', 'Visuals', 'Music', 'Script', 'Tools'].map((m) => (
              <button 
                key={m} 
                onClick={() => {
                  setActiveMenu(m);
                  setIsStudioActive(true); // ✅ 버튼 클릭 시 사이드바와 스튜디오 등장
                }} 
                className={`text-sm font-black transition-all ${isStudioActive && activeMenu === m ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            /* 로그인 상태 드롭다운 (사장님 기존 로직 유지) */
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-all group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-bold text-zinc-200 group-hover:text-white">{user.email?.split('@')[0]}</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* ... 드롭다운 내부 메뉴 로직 동일 ... */}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-all">로그인</Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-[#F6962F] hover:bg-[#E0851F] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-orange-500/20">회원가입</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 🖼️ 메인 콘텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {isStudioActive ? (
          /* ✅ Writing 등 메뉴 클릭 시 나타나는 사이드바 포함 레이아웃 */
          <StudioLayout activeMenu={activeMenu} />
        ) : (
          /* ✅ 초기 로딩 시 혹은 로고 클릭 시 나오는 빈 화면 */
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950">
            <h2 className="text-4xl font-black text-zinc-800 italic uppercase tracking-widest opacity-20 select-none">
              Select Your Creative Engine
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}