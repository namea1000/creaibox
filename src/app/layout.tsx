import { Geist, Geist_Mono, Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL("https://creaibox.com"),
  title: {
    default: "크리에이박스(CreaiBox) | 올인원 AI 콘텐츠 스튜디오 & AI 웹사이트 빌더",
    template: "%s | 크리에이박스 CreaiBox",
  },
  description:
    "AI 웹사이트 빌더, AI 홈페이지 제작, AI 글쓰기부터 이미지 생성, 비디오, 음악 제작까지. 크리에이박스는 크리에이터와 비즈니스를 위한 올인원 AI 스튜디오입니다. 홈페이지 무료제작 및 웹사이트 무료제작을 시작해 보세요.",
  keywords: [
    "AI 웹사이트 빌더",
    "AI 홈페이지 제작",
    "AI 웹사이트 제작",
    "홈페이지 무료제작",
    "웹사이트 무료제작",
    "크리에이박스",
    "creaibox",
    "AI 글쓰기",
    "AI 블로그",
    "AI 이미지 생성",
    "AI 비디오 에디터",
    "반응형 웹사이트 제작"
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.webp?v=2",
    shortcut: "/icon.webp?v=2",
    apple: "/icon.webp?v=2",
  },

  openGraph: {
    title: "크리에이박스(CreaiBox) | 올인원 AI 콘텐츠 스튜디오 & AI 웹사이트 빌더",
    description:
      "AI 웹사이트 빌더, AI 홈페이지 제작, AI 글쓰기부터 이미지 생성, 비디오, 음악 제작까지. 크리에이박스는 크리에이터와 비즈니스를 위한 올인원 AI 스튜디오입니다. 홈페이지 무료제작 및 웹사이트 무료제작을 시작해 보세요.",
    url: "https://creaibox.com",
    siteName: "CreaiBox",
    images: [
      {
        url: "/images/seo/main.webp",
        width: 1200,
        height: 630,
        alt: "CreaiBox Logo (Landscape)",
      },
      {
        url: "/images/seo/main-sq.webp",
        width: 1200,
        height: 1200,
        alt: "CreaiBox Logo (Square)",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "크리에이박스(CreaiBox) | 올인원 AI 콘텐츠 스튜디오",
    description:
      "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
    images: ["/images/seo/main.webp", "/images/seo/main-sq.webp"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${notoSansKR.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://drive.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
      </head>
      <body className="min-h-full bg-white text-slate-900 selection:bg-violet-200/70">
        <QueryProvider>
          {children}
          <CookieConsentBanner />
        </QueryProvider>
        
        {/* 공식 사이트 정보 구조화 데이터 (SEO 최적화) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CreaiBox",
              url: "https://creaibox.com",
              description:
                "올인원 AI 콘텐츠 스튜디오 - 원고 작성, 비주얼 에셋, 브랜드 홈페이지 통합 솔루션",
              publisher: {
                "@type": "Organization",
                name: "크리에이박스 (CreaiBox)",
                url: "https://creaibox.com",
                logo: "https://creaibox.com/icon.webp",
              },
            }),
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}