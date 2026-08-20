import React from "react";
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { getCustomClientAssetUrl } from "@/lib/r2-client-assets";

import { createAdminClient } from "@/utils/supabase/server";
import { cache } from "react";

function cleanVerificationKey(rawKey: string): string {
  if (!rawKey) return "";
  const clean = rawKey.trim();
  const metaMatch = /content=["']([^"']+)["']/i.exec(clean);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }
  if (clean.startsWith("naver-site-verification=")) {
    return clean.replace("naver-site-verification=", "").replace(/["']/g, "").trim();
  }
  if (clean.startsWith("google-site-verification=")) {
    return clean.replace("google-site-verification=", "").replace(/["']/g, "").trim();
  }
  return clean;
}

const getSotongcheumVerificationKeys = cache(async () => {
  try {
    const supabase = await createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("extra_configs")
      .eq("brand_id", "sotongcheum")
      .maybeSingle();

    const configs = profile?.extra_configs || {};
    const naverKey = configs.naver_advisor_key_sotongcheum || configs.naver_advisor_key || "";
    const googleKey = configs.google_search_console_key_sotongcheum || configs.google_search_console_key || "";

    return {
      naverKey: cleanVerificationKey(naverKey),
      googleKey: cleanVerificationKey(googleKey),
    };
  } catch (err) {
    console.error("Error fetching sotongcheum verification keys:", err);
    return { naverKey: "", googleKey: "" };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { naverKey, googleKey } = await getSotongcheumVerificationKeys();

  const meta: Metadata = {
    title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
    description:
      "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과채움 협동조합은 힐링, 소통, 공감을 가치로 한 감성 교육 프로그램 및 행사기획, 전문 장비 렌탈 서비스를 제공합니다.",
    openGraph: {
      title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
      description:
        "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과채움 협동조합은 힐링, 소통, 공감을 가치로 한 감성 교육 프로그램 및 행사기획, 전문 장비 렌탈 서비스를 제공합니다.",
      url: "https://sotongcheum.com",
      siteName: "소통과채움",
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
      title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
      description:
        "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과채움 협동조합",
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
