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

export const metadata: Metadata = {
  title: "Creaibox | AI Contents Studio",
  description: "가장 스마트한 AI 콘텐츠 제작 스튜디오, Creaibox",
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