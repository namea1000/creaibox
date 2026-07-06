"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import Header from "@/components/layout/Header";

export default function PublicStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Left Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <Header />

        {/* Content Body + Right Aside */}
        <div className="flex min-h-0 min-w-0 flex-1 pt-20">
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-zinc-900/10 p-6 lg:p-8 transition-colors duration-300">
            {children}
          </main>

          <Aside />
        </div>
      </div>
    </div>
  );
}
