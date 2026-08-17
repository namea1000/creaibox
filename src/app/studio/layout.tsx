"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";
import CreNoteWidget from "@/components/studio/widgets/CreNoteWidget";
import FaqChatbotWidget from "@/components/studio/widgets/FaqChatbotWidget";
import Header from "@/components/layout/Header";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-[#06080d] text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      {/* 최상단 메인 헤더 */}
      <Header />

      {/* 메인 헤더 아래 스튜디오 작업 영역 */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar (심플화된 우측 핵심 메뉴 5종 탑바) */}
          <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

          {/* Content */}
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-auto custom-scrollbar bg-zinc-100 dark:bg-[#06080d] transition-colors duration-300">
            {children}
            <CreNoteWidget />
            <FaqChatbotWidget />
          </main>
        </div>

        {/* Aside - 오른쪽 상단 헤드탑 위까지 수직선이 100% 관통 */}
        <Aside />
      </div>
    </div>
  );
}