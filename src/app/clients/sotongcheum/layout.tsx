import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
  description:
    "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과채움 협동조합은 힐링, 소통, 공감을 가치로 한 감성 교육 프로그램 및 행사기획, 전문 장비 렌탈 서비스를 제공합니다.",
};

export default function SotongcheumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-500/10 selection:text-blue-600 antialiased">
      {/* Custom Header */}
      <Header />

      {/* Main Page Area */}
      <main className="relative flex-grow">{children}</main>

      {/* Custom Footer */}
      <Footer />
    </div>
  );
}
