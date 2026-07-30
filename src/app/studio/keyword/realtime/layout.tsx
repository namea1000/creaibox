import { Metadata } from "next";

export const metadata: Metadata = {
  title: "실시간 급상승 키워드 & 뉴스 TOP 20 (네이버 vs 구글)",
  description:
    "네이버 실시간 검색어 20개와 구글 실시간 급상승 검색어 20개를 1:1 비교 분석하고 시간별/날짜별 CreAibox 클라우드 DB에 자동 아카이빙합니다.",
  keywords: ["실시간 급상승 키워드", "네이버 실시간 검색어", "구글 트렌드", "실시간 랭킹", "CreAibox"],
  openGraph: {
    title: "실시간 급상승 키워드 & 뉴스 TOP 20 (네이버 vs 구글) | CreAibox",
    description: "네이버 실시간 20개 vs 구글 실시간 20개 1:1 실시간 비교 및 시간별 아카이빙",
    url: "https://creaibox.com/studio/keyword/realtime",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/keyword-trend.webp",
        width: 1200,
        height: 630,
        alt: "실시간 급상승 키워드 분석",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "실시간 급상승 키워드 & 뉴스 TOP 20 (네이버 vs 구글) | CreAibox",
    description: "네이버 실시간 20개 vs 구글 실시간 20개 1:1 실시간 비교 및 시간별 아카이빙",
    images: ["/images/seo/keyword-trend.webp"],
  },
};

export default function RealtimeKeywordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
