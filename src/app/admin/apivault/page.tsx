"use client";

import React, { useState } from 'react';
import APIVaultContent from "../../../components/apivault/APIVaultContent"; // 경로 확인!
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function APIVaultPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'}`}>
      {/* 🌟 수정 포인트: Header가 이제 페이지 전환 함수를 안 쓰므로 다 지워줍니다. */}
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <main className="flex-1 pt-24">
        <div className="max-w-7xl mx-auto px-6 mb-12">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">My API Vault</h1>
            <p className="text-zinc-500 text-sm font-medium">안전하게 보호되는 당신만의 AI 엔진 금고.</p>
        </div>
        <APIVaultContent />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}