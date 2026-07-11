import { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객 지원 및 도움말 | 크리에이박스 CreAibox",
  description: "크리에이박스 CreAibox 고객 지원 센터입니다. 자주 묻는 질문(FAQ) 해결 가이드 및 1:1 고객 문의, 건의사항 접수를 통해 신속한 테크니컬 지원을 받아보세요.",
  keywords: ["크리에이박스", "creaibox", "고객센터", "자주 묻는 질문", "1:1 문의", "FAQ"],
  openGraph: {
    title: "고객 지원 및 도움말 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox 고객 지원 센터입니다. 자주 묻는 질문(FAQ) 해결 가이드 및 1:1 고객 문의, 건의사항 접수를 통해 신속한 테크니컬 지원을 받아보세요.",
    url: "https://creaibox.com/help",
    images: [
      {
        url: "/images/seo/help.webp",
        width: 1200,
        height: 630,
        alt: "고객 지원 및 도움말",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "고객 지원 및 도움말 | 크리에이박스 CreAibox",
    description: "크리에이박스 CreAibox 고객 지원 센터입니다. 자주 묻는 질문(FAQ) 해결 가이드 및 1:1 고객 문의, 건의사항 접수를 통해 신속한 테크니컬 지원을 받아보세요.",
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
