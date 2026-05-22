import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "크리에이아이박스(CreAIbox) 올인원 AI 콘텐츠 스튜디오",
  description: "글쓰기, 이미지, 비디오, 뮤직 생성부터 트렌드 분석까지. 상상력을 현실로 만드는 가장 똑똑한 AI 상자, CreAIbox를 경험해 보세요.",
  openGraph: {
    title: "크리에이아이박스 (CreAIbox)",
    description: "상상력을 현실로 만드는 가장 똑똑한 올인원 AI 콘텐츠 플랫폼 | 올인원 AI 콘텐츠 스튜디오 ",
    url: "https://creaibox.com",
    siteName: "CreAIbox",
    images: [
      {
        url: "https://creaibox.com/logothumbnail.webp", // 🌟 카톡창에 보여줄 로고 이미지 경로!
        width: 1200,
        height: 630,
        alt: "CreAIbox 메인 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-[#0a0c10] text-zinc-100 selection:bg-blue-500/30">
        <Header /> 
        
        {/* 🌟 수정 포인트: flex-col을 삭제하고 block 속성으로 바꿉니다. 
            flex-col이 있으면 자식의 마진(margin)을 가끔 무시해버립니다. */}
        <main className="flex-1 w-full overflow-x-hidden block">
          {children}
        </main>
      </body>
    </html>
  );
}