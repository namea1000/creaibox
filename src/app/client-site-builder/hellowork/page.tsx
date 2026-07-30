import React from "react";
import { Metadata } from "next";
import HelloWorkClientPage from "./client";

export const metadata: Metadata = {
  title: "헬로우워크 천안불당점 - 100% 성인 전용 공유오피스 & 비상주오피스",
  description: "충남 천안시 서북구 불당동 100% 성인 전용 프리미엄 공유오피스, 스터디카페, 소호사무실 및 비상주 사업자등록 주소지 제공. 데스커 책상, 시디즈 의자, 24시간 보안 출입, 커피 무료.",
  keywords: [
    "헬로우워크",
    "헬로우워크 천안불당점",
    "천안 공유오피스",
    "불당동 공유오피스",
    "천안 비상주오피스",
    "불당동 비상주오피스",
    "천안 성인 스터디카페",
    "천안 소호사무실"
  ],
  openGraph: {
    title: "헬로우워크 천안불당점 - 100% 성인 전용 공유오피스 & 비상주오피스",
    description: "천안 불당동 최고급 성인 전용 오피스 & 스터디 스페이스. 24시간 연중무휴, 비상주 주소지 제공, 최고급 데스커 책상 & 시디즈 의자.",
    url: "https://creaibox.com/client-site-builder/hellowork",
    siteName: "헬로우워크 천안불당점",
    images: [
      {
        url: "/images/clients/hellowork_hero.png",
        width: 1200,
        height: 630,
        alt: "헬로우워크 천안불당점",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "헬로우워크 천안불당점 - 100% 성인 전용 공유오피스 & 비상주오피스",
    description: "천안 불당동 최고급 성인 전용 오피스 & 스터디 스페이스.",
    images: ["/images/clients/hellowork_hero.png"],
  },
};

export default function HelloWorkPage() {
  return <HelloWorkClientPage />;
}
