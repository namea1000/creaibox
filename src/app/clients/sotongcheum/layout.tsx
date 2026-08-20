import React from "react";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getCustomClientAssetUrl } from "@/lib/r2-client-assets";
import { getClientSiteVerificationKeys } from "@/lib/server/client-site-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { naverKey, googleKey } = await getClientSiteVerificationKeys("sotongcheum");

  const meta: Metadata = {
    title: {
      absolute: "소통과 채움 | 교육, 행사기획 & 렌탈 전문",
    },
    description:
      "공공행사부터 마을축제까지 깔끔하게! 소통과채움 협동조합의 감성 교육 프로그램 및 전문 장비 렌탈 서비스를 만나보세요.",
    openGraph: {
      title: "소통과 채움 | 교육, 행사기획 & 렌탈 전문",
      description:
        "공공행사부터 마을축제까지 깔끔하게! 소통과채움 협동조합의 감성 교육 프로그램 및 전문 장비 렌탈 서비스를 만나보세요.",
      url: "https://sotongcheum.com",
      siteName: "소통과 채움",
      images: [
        {
          url: getCustomClientAssetUrl("sotongcheum", "hero-bg.webp"),
          width: 1200,
          height: 630,
          alt: "소통과채움 대표 축제 행사 비주얼",
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "소통과 채움 | 교육, 행사기획 & 렌탈 전문",
      description:
        "공공행사부터 마을축제까지 깔끔하게! 소통과채움 협동조합",
      images: [getCustomClientAssetUrl("sotongcheum", "hero-bg.webp")],
    },
  };

  if (naverKey || googleKey) {
    meta.other = {
      ...(naverKey ? { "naver-site-verification": naverKey } : {}),
      ...(googleKey ? { "google-site-verification": googleKey } : {}),
    };
  }

  return meta;
}

export default function SotongcheumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-500/10 selection:text-blue-600 antialiased">
      {/* Custom Header */}
      <Header />

      {/* Main Page Area */}
      <main className="relative flex-grow">{children}</main>

      {/* Custom Footer */}
      <Footer />
    </div>
  );
}
