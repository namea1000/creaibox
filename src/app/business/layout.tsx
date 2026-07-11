import { Metadata } from "next";

export const metadata: Metadata = {
  title: "비즈니스 및 제휴 문의 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox 비즈니스 센터입니다. 엔터프라이즈 맞춤 요금제 상담 및 크리에이터 마케팅 광고 제휴 파트너십 제안을 접수해 보세요.",
  keywords: ["크리에이박스", "creaibox", "비즈니스 제휴", "광고 문의", "기업용 솔루션"],
  openGraph: {
    title: "비즈니스 및 제휴 문의 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox 비즈니스 센터입니다. 엔터프라이즈 맞춤 요금제 상담 및 크리에이터 마케팅 광고 제휴 파트너십 제안을 접수해 보세요.",
    url: "https://creaibox.com/business",
    images: [
      {
        url: "/images/seo/business.webp",
        width: 1200,
        height: 630,
        alt: "비즈니스 및 제휴",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "비즈니스 및 제휴 문의 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox 비즈니스 센터입니다. 엔터프라이즈 맞춤 요금제 상담 및 크리에이터 마케팅 광고 제휴 파트너십 제안을 접수해 보세요.",
    images: ["/images/seo/business.webp"],
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
