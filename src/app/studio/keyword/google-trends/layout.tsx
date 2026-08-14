import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🌐 구글 트렌드 (Google Trends) 실시간 급상승 분석 | CreaiBox",
  description:
    "대한민국, 미국, 일본, 영국 구글 실시간 급상승 검색어 TOP 20, 100K+ 트래픽 지수 및 연관 뉴스 이슈 분석",
  keywords: ["구글 트렌드", "Google Trends", "구글 실시간 검색어", "글로벌 트렌드 분석", "CreaiBox"],
  openGraph: {
    title: "🌐 구글 트렌드 (Google Trends) 실시간 급상승 분석 | CreaiBox",
    description: "국가별 구글 실시간 급상승 검색어 TOP 20 및 트래픽 지수 실시간 분석",
    url: "https://creaibox.com/studio/keyword/google-trends",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function GoogleTrendsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
