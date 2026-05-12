"use client";

import React, { useState } from 'react';
// 🌟 상대 경로로 직접 지정하여 Vercel 빌드 에러를 방지합니다.
import MyPageContent from "../../../components/mypage/MyPageContent";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

export default function MyPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'}`}>
      {/* 헤더: 여기서 닉네임 유무에 따라 표시 로직이 들어갑니다 */}
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        onMenuClick={() => {}} 
        setViewMode={() => {}} 
      />
      
      <main className="flex-1 pt-24 pb-20">
        {/* 마이페이지 타이틀 섹션 */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="border-l-4 border-blue-600 pl-6">
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              User <span className="text-blue-600">Profile</span>
            </h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
              커뮤니티 활동을 위한 프로필 및 닉네임 설정
            </p>
          </div>
        </div>

        {/* 실제 마이페이지 컨텐츠 컴포넌트 */}
        <div className="max-w-7xl mx-auto px-6">
          <MyPageContent />
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}