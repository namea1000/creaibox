import React from "react";
import { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/server";
import CreativeMediaBlogPage from "../creative-media-blog/page";
import SotongchaeumPage from "../sotongchaeum/page";
import FuturemindHomePage from "../futuremind/page";
import DynamicRendererPage from "../dynamic-renderer/[brand_id]/[[...slug]]/page";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;
export const dynamicParams = true;

const clientNames: Record<string, string> = {
  "futuremind": "미래교육문화협회 (퓨처마인드)",
  "prime-realestate": "프라임 부동산 빌더 템플릿",
  "fashion-beauty-lookbook": "패션 & 뷰티 룩북 시그니처 템플릿",
  "travel-stay": "트래블 & 감성 스테이 템플릿",
  "art-gallery": "아티스트 & 아키텍처 갤러리 템플릿",
  "trend-magazine": "트렌드 & 비즈니스 매거진 템플릿",
  "aura-portfolio": "아우라 포트폴리오 스튜디오 템플릿",
  "chaeum-wellness": "채움 웰니스 & 에스테틱 센터 템플릿",
  "aura-finedining": "파인다이닝 & 오마카세 템플릿",
  "eduplus-academy": "에듀플러스 프리미엄 학원 템플릿",
  "soundwave-music": "사운드웨이브 오디오 스튜디오 템플릿",
  "starlight-ent": "스타라이트 엔터테인먼트 템플릿",
  "next-commerce": "넥스트 커머스 브랜드 템플릿",
};

interface ClientPageProps {
  params: Promise<{
    client_id: string;
  }>;
  searchParams?: Promise<{ page?: string }> | { page?: string };
}

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const clientId = resolvedParams.client_id?.toLowerCase() || "";
  
  // 1. Check predefined dictionary
  let clientName = clientNames[clientId];

  // 2. If not in dictionary, try fetching profile from Supabase DB
  if (!clientName) {
    try {
      const supabase = await createAdminClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("extra_configs")
        .eq("brand_id", clientId)
        .maybeSingle();

      if (profile?.extra_configs?.site_title) {
        clientName = profile.extra_configs.site_title;
      }
    } catch (e) {}
  }

  // 3. Fallback: Automatically format hyphenated client_id
  if (!clientName) {
    const formattedWords = clientId
      .split(/[-_]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    clientName = formattedWords ? `${formattedWords} 비즈니스 템플릿` : "맞춤 브랜드 비즈니스 웹사이트";
  }

  const title = `${clientName} | CreaiBox`;
  const description = `CreaiBox에서 제공하는 ${clientName} 라이브 시연 페이지입니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://creaibox.com/clients/${clientId}`,
      siteName: "CreaiBox",
      locale: "ko_KR",
      type: "website",
    },
  };
}

export default async function GenericClientSiteFallbackPage({
  params,
  searchParams,
}: ClientPageProps) {
  const resolvedParams = await params;
  const clientId = resolvedParams.client_id?.toLowerCase() || "";

  if (clientId === "futuremind") {
    return <FuturemindHomePage />;
  }

  if (clientId === "creative-media-blog") {
    return <CreativeMediaBlogPage />;
  }

  if (clientId === "sotongchaeum" || clientId === "sotongcheum" || clientId === "commufill") {
    return <SotongchaeumPage />;
  }

  // Delegate all other templates & migrated client sites to DynamicRendererPage
  return <DynamicRendererPage params={Promise.resolve({ brand_id: clientId })} searchParams={searchParams} />;
}

