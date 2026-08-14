import { Metadata } from "next";

export const metadata: Metadata = {
  title: "📈 네이버 블로그 지수 진단 & 전체 블로거 랭킹 | CreaiBox",
  description:
    "네이버 블로그 아이디 지수 진단 (최적 3+, 준최 레벨 측정), 발행글 누락 검수 및 카테고리별 전체 네이버 블로거 순위 리더보드",
  keywords: ["네이버 블로그 지수 진단", "블로그 지수 확인", "블로그 아이디 검진", "네이버 블로거 순위", "CreaiBox"],
  openGraph: {
    title: "📈 네이버 블로그 지수 진단 & 전체 블로거 랭킹 | CreaiBox",
    description: "네이버 블로그 아이디 최적 3+/준최 레벨 실시간 진단 및 전체 블로거 리더보드 랭킹",
    url: "https://creaibox.com/studio/keyword/blog-index",
    siteName: "CreaiBox",
    locale: "ko_KR",
    type: "website",
  },
};

export default function BlogIndexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
