import { Metadata } from "next";

export const metadata: Metadata = {
  title: "📊 네이버 쇼핑 인사이트 (DataLab 인기검색어 TOP 500) | CreAibox",
  description:
    "네이버 쇼핑 카테고리별 1달/3달 인기검색어 TOP 500, 클릭량 추이 그래프 및 성별/연령대 타겟 쇼핑 트렌드 분석",
  keywords: ["네이버 쇼핑 인사이트", "쇼핑 인기검색어 TOP 500", "DataLab 쇼핑", "카테고리 트렌드", "CreAibox"],
  openGraph: {
    title: "📊 네이버 쇼핑 인사이트 (DataLab 인기검색어 TOP 500) | CreAibox",
    description: "네이버 쇼핑 카테고리 분야별 1달/3달 인기검색어 TOP 500 및 클릭량/성별/연령 분석",
    url: "https://creaibox.com/studio/keyword/shopping-insight",
    siteName: "CreAibox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function ShoppingInsightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
