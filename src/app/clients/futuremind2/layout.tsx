import React from "react";
import type { Metadata } from "next";
import Futuremind2Header from "./components/Futuremind2Header";
import Futuremind2Footer from "./components/Futuremind2Footer";

export const metadata: Metadata = {
  title: "미래교육문화협회 (퓨처마인드) | Enterprise AI Transformation",
  description: "AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다. 미래교육문화협회(퓨처마인드)",
};

export const revalidate = 60;

export default function Futuremind2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans selection:bg-[#f95700] selection:text-white">
      <Futuremind2Header />
      <main className="min-h-[calc(100vh-160px)]">
        {children}
      </main>
      <Futuremind2Footer />
    </div>
  );
}
