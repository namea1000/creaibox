"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";
import CreNoteWidget from "@/components/studio/widgets/CreNoteWidget";
import FaqChatbotWidget from "@/components/studio/widgets/FaqChatbotWidget";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#06080d] text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar (좌측 퀵메뉴 5종 + 우측 다크모드/프로필 드롭다운 - 오른쪽 끝까지 100% 가로 확장) */}
        <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

        {/* Content Area (Main + Aside) */}
        <div className="flex flex-1 min-h-0 min-w-0">
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-auto custom-scrollbar bg-zinc-100 dark:bg-[#06080d] transition-colors duration-300">
            {children}
            <CreNoteWidget />
            <FaqChatbotWidget />
          </main>

          {/* Aside: StudioTopbar 아래에서 오른쪽 패널로 위치 */}
          <Aside />
        </div>
      </div>
    </div>
  );
}