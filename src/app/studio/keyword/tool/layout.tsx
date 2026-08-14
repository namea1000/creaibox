import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🔍 키워드 정밀 분석 도구 (검색량 차트 & SERP 분석) | CreaiBox",
  description:
    "네이버/구글 키워드 검색량 추이 꺾은선 차트, SERP 노출 배치 순서, 상위 10개 블로그 지수 진단 및 연관 키워드 CPC 경쟁도 무료 분석",
  keywords: ["키워드 분석 도구", "검색량 추이 차트", "SERP 분석", "연관 키워드 CPC", "CreaiBox"],
  openGraph: {
    title: "🔍 키워드 정밀 분석 도구 (검색량 차트 & SERP 분석) | CreaiBox",
    description: "네이버/구글 키워드 검색량 추이 차트 및 SERP 상위 블로그 지수 무료 분석",
    url: "https://creaibox.com/studio/keyword/tool",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function KeywordToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
