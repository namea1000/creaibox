import { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객지원 센터 & 가이드 도움말",
  description: "크리에이박스 CreaiBox 고객지원 센터입니다. 자주 묻는 질문(FAQ), 서비스 매뉴얼 가이드 및 1:1 고객 지원 접수를 도와드립니다.",
  keywords: ["크리에이박스", "creaibox", "고객센터", "자주 묻는 질문", "1:1 문의", "FAQ"],
  openGraph: {
    title: "고객지원 센터 & 가이드 도움말 | 크리에이박스 CreaiBox",
    description: "크리에이박스 CreaiBox 고객지원 센터입니다. 자주 묻는 질문(FAQ), 서비스 매뉴얼 가이드 및 1:1 고객 지원 접수를 도와드립니다.",
    url: "https://creaibox.com/help",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/help.webp",
        width: 1200,
        height: 630,
        alt: "고객 지원 센터",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "고객지원 센터 & 가이드 도움말 | 크리에이박스 CreaiBox",
    description: "자주 묻는 질문(FAQ), 서비스 매뉴얼 가이드 및 1:1 고객 지원 접수를 도와드립니다.",
    images: ["/images/seo/help.webp"],
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
