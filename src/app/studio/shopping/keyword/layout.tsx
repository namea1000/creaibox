import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🛍️ 쇼핑 키워드 정밀 분석 & 아이템 소싱 | CreAibox",
  description:
    "쇼핑 검색량 대비 총 등록 상품수 경쟁강도 블루오션 꿀키워드 발굴, 일간/주간 쇼핑 트렌드 키워드 및 소싱 아이템 분석",
  keywords: ["쇼핑 키워드 분석", "경쟁강도 꿀키워드", "스마트스토어 소싱", "CreAibox"],
  openGraph: {
    title: "🛍️ 쇼핑 키워드 정밀 분석 & 아이템 소싱 | CreAibox",
    description: "쇼핑 검색량 대비 상품수 경쟁강도 블루오션 꿀키워드 및 쇼핑 트렌드 정밀 분석",
    url: "https://creaibox.com/studio/shopping/keyword",
    siteName: "CreAibox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function ShoppingKeywordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
