"use client";

import React, { useState, useEffect } from 'react';
import APIVaultAdmin from "@/components/apivault/APIVaultAdmin";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function APIVaultAdminPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // ⚠️ 사장님 이메일로 여기에 접근 권한을 락(Lock) 거세요!
      if (user && user.email === 'jenam7720@email.com','namjjang7720@gmail.com') { 
        setIsAdmin(true);
      } else {
        alert("관리자만 접근 가능합니다.");
        router.push('/');
      }
    };
    checkAdmin();
  }, [router, supabase.auth]);

  if (!isAdmin) return <div className="bg-[#05070a] min-h-screen flex items-center justify-center text-zinc-500 font-black italic uppercase animate-pulse">Checking Authority...</div>;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'}`}>
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        onMenuClick={() => {}} 
        setViewMode={() => {}} 
      />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-10 border-l-4 border-blue-600 pl-6">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">System API Admin</h1>
            <p className="text-blue-500 text-sm font-black uppercase tracking-widest mt-1">무료 체험용 글로벌 API 셋팅 제어판</p>
          </div>
          
          <APIVaultAdmin />
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}