"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";
import CreNoteWidget from "@/components/studio/widgets/CreNoteWidget";
import AiAssistantWidget from "@/components/studio/widgets/AiAssistantWidget";
import Header from "@/components/layout/Header";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#06080d] text-zinc-100">
      <Header />
      <div className="flex flex-1 min-h-0 pt-16">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

        {/* Content + Aside */}
        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#06080d]">
            {children}
            <CreNoteWidget />
            <AiAssistantWidget />
          </main>

          <Aside />
        </div>
      </div>
    </div>
    </div>
  );
}