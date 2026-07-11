import { Metadata } from "next";

export const metadata: Metadata = {
  title: "가격 요금제 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox의 요금 정책 안내입니다. 무료 체험 플랜부터 인플루언서 및 기업을 위한 프리미엄 혜택까지 한눈에 비교해 보세요.",
  keywords: ["크리에이박스", "creaibox", "요금제", "가격 정책", "가격 비교"],
  openGraph: {
    title: "가격 요금제 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox의 요금 정책 안내입니다. 무료 체험 플랜부터 인플루언서 및 기업을 위한 프리미엄 혜택까지 한눈에 비교해 보세요.",
    url: "https://creaibox.com/pricing",
    images: [
      {
        url: "/images/seo/pricing.webp",
        width: 1200,
        height: 630,
        alt: "요금제 가격",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "가격 요금제 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox의 요금 정책 안내입니다. 무료 체험 플랜부터 인플루언서 및 기업을 위한 프리미엄 혜택까지 한눈에 비교해 보세요.",
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
