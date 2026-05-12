"use client";

import React, { useState } from 'react';
import MyPageContent from "../../../components/mypage/MyPageContent";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

export default function MyPage() {
  // 🌟 [추가] 헤더와 푸터의 빨간 줄을 없애기 위한 테마 상태
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'}`}>
      
      {/* 🌟 1. 공통 헤더: 이제 다크모드 리모컨을 넘겨주어 빨간 줄이 사라집니다. */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      {/* 🌟 2. 메인 영역: pt-32를 주어 헤더 밑으로 콘텐츠가 숨지 않게 합니다. */}
      <main className="flex-1 pt-32 pb-20">
        <MyPageContent isDarkMode={isDarkMode} />
      </main>

      {/* 🌟 3. 공통 푸터 */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}