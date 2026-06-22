"use client";

import React, { useState } from "react";
import { ImageIcon, Sparkles, Layout, Palette, ArrowLeft, ArrowRight, Download } from "lucide-react";

export default function CardSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [theme, setTheme] = useState("dark"); // dark, light, green

  const slides = [
    { title: "AI 에이전트 자율 혁명", body: "구글 딥마인드 자가 학습 AI 발표" },
    { title: "핵심 요약 1", body: "인간 피드백 없이도 시뮬레이션 진화 수립 완료" },
    { title: "핵심 요약 2", body: "서브태스크 자동 분해 및 자율 에러 디버깅 탑재" },
    { title: "결론 및 가치", body: "로보틱스 및 자율 사무 비서 킬러 앱 등극" },
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getThemeClass = () => {
    if (theme === "light") return "bg-white text-zinc-950 border border-zinc-200";
    if (theme === "green") return "bg-emerald-950 text-emerald-100";
    return "bg-gradient-to-br from-zinc-900 to-[#100b08] text-white";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
            <ImageIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">뉴스 카드 제작 (Card)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              기사 분석 내용을 토대로 모바일 가독성에 최적화된 소셜 네트워크용 카드뉴스를 즉시 렌더링하고 다운로드합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 카드뉴스 옵션 제어 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Palette size={14} className="text-pink-400" />
            카드 비주얼 스타일
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500">배경 테마 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "dark", label: "다크" },
                { id: "light", label: "라이트" },
                { id: "green", label: "에메랄드" },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`rounded-lg border py-2 text-xs font-bold text-center transition ${
                    theme === th.id
                      ? "border-pink-500/60 bg-pink-500/10 text-pink-400"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-500/40"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-650 py-2.5 text-xs font-black text-white hover:bg-pink-600 transition">
              <Download size={14} />
              전체 슬라이드 PNG 일괄 저장
            </button>
          </div>
        </div>

        {/* 카드 실시간 시각적 프리뷰 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Layout size={16} className="text-pink-400" />
            실시간 카드뉴스 슬라이드 캔버스 프리뷰
          </h3>

          {/* 슬라이드 캔버스 */}
          <div className="flex justify-center">
            <div
              className={`h-80 w-80 rounded-2xl flex flex-col justify-between p-6 shadow-2xl transition-all duration-300 ${getThemeClass()}`}
            >
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                  CREAIBOX NEWS
                </span>
                <p className="text-lg font-black mt-4 leading-snug">{slides[activeSlide].title}</p>
              </div>

              <div>
                <p className="text-xs font-bold leading-relaxed text-zinc-400 dark:text-zinc-300">
                  {slides[activeSlide].body}
                </p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                  <span>Slide {activeSlide + 1} / {slides.length}</span>
                  <span>creaibox.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* 페이지네이션 조작 */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-500 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-500 transition"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
