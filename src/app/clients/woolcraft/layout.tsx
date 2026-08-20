import React from "react";
import Footer from "./components/Footer";

export const metadata = {
  title: "WoolCraft (울크래프트) - 프리미엄 양모 핸드메이드 라이프스타일",
  description:
    "호주산 프리미엄 천연 양모로 빚어낸 핸드메이드 라이프스타일 브랜드 울크래프트. 따뜻함과 편안함을 선사하는 감성 인테리어 & 패션 아이템을 만나보세요.",
  openGraph: {
    title: "WoolCraft (울크래프트) - 프리미엄 양모 핸드메이드 라이프스타일",
    description:
      "호주산 프리미엄 천연 양모로 빚어낸 핸드메이드 라이프스타일 브랜드 울크래프트. 따뜻함과 편안함을 선사하는 감성 인테리어 & 패션 아이템을 만나보세요.",
    url: "https://woolcraft.creaibox.com",
    siteName: "WoolCraft",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "WoolCraft 핸드메이드 양모 컬렉션",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WoolCraft (울크래프트) - 프리미엄 양모 핸드메이드 라이프스타일",
    description: "호주산 프리미엄 천연 양모로 빚어낸 핸드메이드 라이프스타일 브랜드 울크래프트.",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=80"],
  },
};

export default function WoolCraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FEFCF8] text-[#2C2C2C] font-sans selection:bg-[#A8B5A0]/30 selection:text-[#2C2C2C] antialiased">
      <main className="relative flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
