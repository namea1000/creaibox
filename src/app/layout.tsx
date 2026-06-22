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
    "글쓰기, 블로그, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에. CreAibox는 크리에이터를 위한 올인원 AI 콘텐츠 제작 플랫폼입니다.",
  openGraph: {
    title: "크리에이박스(CreAibox) | 올인원 AI 콘텐츠 스튜디오",
    description:
      "글쓰기, 블로그, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에. CreAibox는 크리에이터를 위한 올인원 AI 콘텐츠 제작 플랫폼입니다.",
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
      "글쓰기, 블로그, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에. CreAibox는 크리에이터를 위한 올인원 AI 콘텐츠 제작 플랫폼입니다.",
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
        <GoogleAnalytics gaId="G-SRBFXMN9XQ" />
      </body>
    </html>
  );
}