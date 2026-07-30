import React from "react";
import { Metadata } from "next";
import HelloWorkBlogClient from "./client";

export const metadata: Metadata = {
  title: "공식 블로그 - 헬로우워크 천안불당점",
  description: "헬로우워크 천안불당점의 공식 블로그입니다. 공유오피스 입주 안내, 비상주 오피스 사업자등록 절차, 성인 전용 스터디카페 이용 팁 및 천안 불당동 상권 소식을 확인하세요.",
  keywords: ["헬로우워크 블로그", "천안 공유오피스 블로그", "불당동 비상주 오피스 정보", "성인 스터디카페 후기"],
  openGraph: {
    title: "공식 블로그 - 헬로우워크 천안불당점",
    description: "공유오피스 입주 안내, 비상주 사업자등록 팁 및 최신 소식을 전해드립니다.",
    url: "https://creaibox.com/client-site-builder/hellowork/blog",
    siteName: "헬로우워크 천안불당점",
    images: [
      {
        url: "/images/clients/hellowork_hero.png",
        width: 1200,
        height: 630,
        alt: "헬로우워크 천안불당점 블로그",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function Page() {
  return <HelloWorkBlogClient />;
}
