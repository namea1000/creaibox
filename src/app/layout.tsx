import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "크리에이박스(CreAIbox) | 올인원 AI 콘텐츠 스튜디오",
  description:
    "글쓰기, 블로그, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지 한 번에. CreAIbox는 크리에이터를 위한 올인원 AI 콘텐츠 제작 플랫폼입니다.",
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
      </body>
    </html>
  );
}