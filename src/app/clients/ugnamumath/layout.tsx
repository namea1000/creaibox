import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "어그나무학원 | 천안 불당 수학·과학 전문 학원",
  description:
    "생각의 뿌리를 깊게, 수학·과학의 나무를 곧게! 어그나무학원(일반 초중등부), 어그나무영재학원(입시 영재관), 어그나무고등학원(수능/내신 고등관)의 밀착 학습 솔루션을 제공합니다.",
};

export default function UgnamumathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-500/10 selection:text-indigo-600 antialiased">
      {/* Custom Navigation */}
      <Header />

      {/* Main Page Area */}
      <main className="relative flex-grow">{children}</main>

      {/* Custom Footer */}
      <Footer />
    </div>
  );
}
