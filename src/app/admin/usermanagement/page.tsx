'use client';

import React, { useState } from 'react';
import Header from "@/components/layout/Header"; 
import Footer from "@/components/layout/Footer";
import AdminUserManagement from "@/components/admin/UserManagement"; // 🌟 위에서 만든 알맹이 호출

export default function AdminUsersPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#05070a]' : 'bg-white'}`}>
      {/* 지붕 */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* 몸통 */}
      <main className="flex-1 pt-32 pb-20 px-8">
        <AdminUserManagement isDarkMode={isDarkMode} />
      </main>

      {/* 바닥 */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}