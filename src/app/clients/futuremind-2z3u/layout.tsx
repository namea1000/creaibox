import React from "react";
import type { Metadata } from "next";
import FuturemindCyanHeader from "./components/FuturemindCyanHeader";
import FuturemindCyanFooter from "./components/FuturemindCyanFooter";

export const metadata: Metadata = {
  title: "퓨처마인드 | 미래교육문화협회 - AI로 세상과 연결합니다",
  description: "AI라는 경계 없는 마음 하나로, 시간과 공간을 넘어 모든 것을 연결시킵니다. 4차 산업 체험 교육 및 기업 맞춤형 AI 솔루션 전문 미래교육문화협회 (퓨처마인드)",
  openGraph: {
    title: "퓨처마인드 | 미래교육문화협회 - AI로 세상과 연결합니다",
    description: "4차 산업 체험 교육 및 기업 맞춤형 AI 솔루션 전문 미래교육문화협회 (퓨처마인드)",
    url: "https://futuremind.creaibox.com",
    siteName: "퓨처마인드 (미래교육문화협회)",
    images: [
      {
        url: "https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/og-futuremind.jpg",
        width: 1200,
        height: 630,
        alt: "퓨처마인드 미래교육문화협회",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "퓨처마인드 | 미래교육문화협회 - AI로 세상과 연결합니다",
    description: "4차 산업 체험 교육 및 기업 맞춤형 AI 솔루션 전문 미래교육문화협회 (퓨처마인드)",
    images: ["https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/og-futuremind.jpg"],
  },
};

export const revalidate = 60;

export default function FuturemindCyanLayout({
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
