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
    default: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
    template: "%s | 크리에이박스 CreAibox",
  },
  description:
    "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },

  openGraph: {
    title: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
    description:
      "AI 글쓰기부터 이미지 생성, 음악, 홈페이지 제작까지. 크리에이박스는 크리에이터를 위한 올인원 AI 콘텐츠 스튜디오입니다.",
    url: "https://creaibox.com",
    siteName: "CreAibox",
    images: [
      {
        url: "/images/seo/main.webp",
        width: 1200,
        height: 630,
        alt: "CreAibox Logo (Landscape)",
      },
      {
        url: "/images/seo/main-sq.webp",
        width: 1200,
        height: 1200,
        alt: "CreAibox Logo (Square)",
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
              name: "CreAibox",
              url: "https://creaibox.com",
              description:
                "올인원 AI 콘텐츠 스튜디오 - 원고 작성, 비주얼 에셋, 브랜드 홈페이지 통합 솔루션",
              publisher: {
                "@type": "Organization",
                name: "크리에이박스 (CreAibox)",
                url: "https://creaibox.com",
                logo: "https://creaibox.com/icon.png",
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