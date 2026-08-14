import { Metadata } from "next";

export const metadata: Metadata = {
  title: "실시간 급상승 키워드 & 트렌드 분석 도구 | CreaiBox",
  description:
    "네이버 20개, 구글 20개 실시간 급상승 검색어 1:1 비교 분석, 키워드 검색량 추이, 네이버 블로그 지수 진단 및 아이템스카우트 쇼핑 키워드 무료 조회 서비스",
  keywords: [
    "실시간 급상승 키워드",
    "네이버 실시간 검색어",
    "구글 트렌드",
    "키워드 분석 도구",
    "네이버 블로그 지수 진단",
    "쇼핑 키워드 분석",
    "아이템스카우트",
    "CreaiBox",
  ],
  openGraph: {
    title: "실시간 급상승 키워드 & 트렌드 분석 도구 | CreaiBox",
    description:
      "네이버 20개 vs 구글 20개 실시간 급상승 검색어 비교, 키워드 검색량 추이 차트, 블로그 지수 무료 진단",
    url: "https://creaibox.com/studio/keyword/realtime",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function StudioKeywordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
