import { Metadata } from "next";

export const metadata: Metadata = {
  title: "가격 및 멤버십 요금제 안내",
  description: "크리에이박스 CreaiBox의 가격 및 요금 정책 안내입니다. 베이직 무료 체험부터 크리에이터 및 기업 전용 플랜 혜택을 한눈에 확인하세요.",
  keywords: ["크리에이박스", "creaibox", "요금제", "가격 정책", "가격 비교"],
  openGraph: {
    title: "가격 및 멤버십 요금제 안내 | 크리에이박스 CreaiBox",
    description: "크리에이박스 CreaiBox의 가격 및 요금 정책 안내입니다. 베이직 무료 체험부터 크리에이터 및 기업 전용 플랜 혜택을 한눈에 확인하세요.",
    url: "https://creaibox.com/pricing",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/pricing.webp",
        width: 1200,
        height: 630,
        alt: "요금제 가격",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "가격 및 멤버십 요금제 안내 | 크리에이박스 CreaiBox",
    description: "베이직 무료 체험부터 크리에이터 및 기업 전용 플랜 혜택을 한눈에 확인하세요.",
    images: ["/images/seo/pricing.webp"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
