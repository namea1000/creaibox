import React from "react";
import { Metadata } from "next";
import PublicDesignClient from "./client";

// 🌟 네이버/구글 검색 노출 최적화용 "크리에이박스 CreaiBox" 브랜드 키워드 메타데이터 주입!
export const metadata: Metadata = {
  title: "이미지 스튜디오 - 차세대 디자인 에디터",
  description: "크리에이박스 CreaiBox의 이미지 스튜디오입니다. 브라우저에서 포스터, 웹 배너, 카드뉴스 및 유튜브 썸네일을 캔버스에서 무료로 디자인하세요.",
  keywords: ["크리에이박스", "creaibox", "이미지 스튜디오", "무료 디자인 캔버스", "썸네일 만들기", "카드뉴스 디자인"],
  openGraph: {
    title: "이미지 스튜디오 - 차세대 디자인 에디터 | 크리에이박스 CreaiBox",
    description: "크리에이박스 CreaiBox의 이미지 스튜디오입니다. 브라우저에서 포스터, 웹 배너, 카드뉴스 및 유튜브 썸네일을 캔버스에서 무료로 디자인하세요.",
    url: "https://creaibox.com/design",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/themes.webp",
        width: 1200,
        height: 630,
        alt: "이미지 스튜디오",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 스튜디오 - 차세대 디자인 에디터 | 크리에이박스 CreaiBox",
    description: "브라우저에서 포스터, 웹 배너, 카드뉴스 및 유튜브 썸네일을 캔버스에서 무료로 디자인하세요.",
    images: ["/images/seo/themes.webp"],
  },
};

export default function Page() {
  return <PublicDesignClient />;
}
