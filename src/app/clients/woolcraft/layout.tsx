import React from "react";
import Footer from "./components/Footer";

export const metadata = {
  title: "Aura Merino (아우라 메리노) - Natural Wool Sneakers | Eco Luxury",
  description:
    "100% 천연 메리노 울과 캐시미어를 담은 아우라 메리노 스니커즈. 타협 없는 편안함과 모던한 이커머스 스토어를 만나보세요.",
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
