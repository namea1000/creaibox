import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "크리에이티브 미디어 블로그 V1 | IT, 테크, 마케팅 전문 트렌드 포털",
  description:
    "AI, 테크, 디지털 디자인 및 마케팅 인사이트를 전하는 1등 트렌드 미디어 블로그입니다. 매일 업데이트되는 신규 뉴스레터와 독창적인 지식 콘텐츠를 만나보세요.",
};

export default function CreativeMediaBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-400 antialiased">
      <Header />
      <main className="relative flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
