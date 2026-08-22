import React from "react";
import type { Metadata } from "next";
import FuturemindCyanHeader from "../futuremind-2z3u/components/FuturemindCyanHeader";
import FuturemindCyanFooter from "../futuremind-2z3u/components/FuturemindCyanFooter";

export const metadata: Metadata = {
  title: "퓨처마인드 | AI로 세상과 연결합니다",
  description: "AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다. 미래교육문화협회(퓨처마인드)",
};

export const revalidate = 60;

export default function FuturemindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans selection:bg-cyan-500 selection:text-neutral-950">
      <FuturemindCyanHeader />
      <main className="min-h-[calc(100vh-160px)]">
        {children}
      </main>
      <FuturemindCyanFooter />
    </div>
  );
}
