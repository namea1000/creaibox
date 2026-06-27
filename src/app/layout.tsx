import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://creaibox.com"),
  title: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
  description:
    "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
    description:
      "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
    url: "https://creaibox.com",
    siteName: "CreAibox",
    images: [
      {
        url: "/logothumbnail.webp",
        width: 1200,
        height: 630,
        alt: "CreAibox Logo",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
    description:
      "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
    images: ["/logothumbnail.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-slate-900 selection:bg-violet-200/70">
        <QueryProvider>{children}</QueryProvider>
        
        {/* 공식 사이트 정보 구조화 데이터 (SEO 최적화) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "크리에이박스",
              "alternateName": "CreAibox",
              "url": "https://creaibox.com",
              "description": "올인원 AI 콘텐츠 스튜디오 및 프리미엄 홈페이지 빌더",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://creaibox.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        <GoogleAnalytics gaId="G-SRBFXMN9XQ" />
      </body>
    </html>
  );
}