"use client";

import React, { useState } from "react";
import { 
  Search, Mail, FileText, ChevronDown, 
  HelpCircle, ArrowRight, ClipboardList, ExternalLink
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { faqData, FAQItem, FAQCategory } from "@/app/chatbot/data/faqData";

// 🌟 FAQ 카테고리 정의 (통합 faqData 기반)
const CATEGORIES = [
  { id: "all", label: "전체 FAQ" },
  ...faqData.map((cat) => ({ id: cat.id, label: cat.title }))
];

// 🌟 바둑판식 "카테고리별로 찾아보세요" 데이터 정의 (플랫 그리드)
const QUICK_CATEGORIES = [
  { label: "시작/회원 관리", targetId: "general", keyword: "가입" },
  { label: "요금/플랜 구독", targetId: "general", keyword: "결제" },
  { label: "AI 홈페이지 제작", targetId: "site-builder", keyword: "홈페이지" },
  { label: "도메인 신청/연결", targetId: "site-builder", keyword: "도메인" },
  { label: "AI 블로그 원고 작성", targetId: "ai-writer", keyword: "원고" },
  { label: "네이버 API 연동", targetId: "ai-writer", keyword: "네이버" },
  { label: "SEO 스키마 / 서치콘솔", targetId: "ai-writer", keyword: "서치콘솔" },
  { label: "비디오 스튜디오 편집", targetId: "media-studio", keyword: "비디오" },
  { label: "이미지 누끼(배경)제거", targetId: "media-studio", keyword: "누끼" },
  { label: "Suno AI 노래/가사", targetId: "media-studio", keyword: "음악" },
  { label: "키워드 & 유튜브 분석", targetId: "analytics", keyword: "키워드" },
  { label: "클라우드 저장소 & 캐시", targetId: "storage", keyword: "캐시" },
  { label: "시스템 및 오류 해결", targetId: "troubleshoot", keyword: "오류" }
] as const;

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 🌟 통합 FAQ 데이터 리스트 추출
  const allFaqs: FAQItem[] = faqData.flatMap((cat) => cat.items);

  // 🌟 FAQ 필터링 로직
  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    return faq.category === selectedCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🏢 SECTION 1: HERO HEADER */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 mb-16 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <HelpCircle size={12} className="text-blue-600" /> CreAibox Support Center
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-tight">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-3xl leading-relaxed">
            자주 접수되는 사용 관련 핵심 질문과 해결책을 검색하고, 답변에 포함된 바로가기 버튼으로 해당 스튜디오 메뉴로 즉시 이동해 보세요. <br className="hidden md:inline" />
            도움말로 문제가 해결되지 않는 경우 1:1 접수를 진행하실 수 있습니다.
          </p>
        </div>

        {/* 🔍 SECTION 2: SEARCH CONSOLE */}
        <div className="mb-16">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="max-w-2xl mx-auto flex items-center gap-2.5 bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm transition-all focus-within:border-blue-500"
          >
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="궁금한 기능이나 키워드를 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 dark:text-white text-xs md:text-sm font-semibold outline-none placeholder-slate-400"
            />
          </form>
        </div>

        {/* 📂 SECTION 3: 카테고리별로 찾아보세요 (바둑판식 플랫 그리드) */}
        <div className="mb-16 space-y-6">
          <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            카테고리별로 찾아보세요
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {QUICK_CATEGORIES.map((qCat) => (
              <button
                key={qCat.label}
                onClick={() => {
                  setSelectedCategory(qCat.targetId);
                  setSearchQuery(qCat.keyword);
                  document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/40 text-center hover:bg-slate-100/50 dark:hover:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-sm text-xs md:text-sm font-black text-slate-800 dark:text-slate-300"
              >
                {qCat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🏷️ SECTION 4: CATEGORY TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 shrink-0">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-black border transition-all duration-200 outline-none select-none cursor-pointer ${
                  active
                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ❓ SECTION 5: FAQ ACCORDION */}
        <div id="faq-section" className="space-y-6 scroll-mt-24">
          <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            {CATEGORIES.find(c => c.id === selectedCategory)?.label || "자주 묻는 질문"} 목록
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <details 
                  key={faq.id || faq.question} 
                  className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 open:bg-slate-50/50 dark:open:bg-slate-950/20 open:border-slate-300/80 dark:open:border-slate-750 transition-all shadow-sm"
                >
                  <summary className="list-none flex justify-between items-center font-bold text-xs md:text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none group-open:text-slate-950 dark:group-open:text-white group-hover:text-slate-900 dark:group-hover:text-white">
                    <span className="flex items-center gap-2">
                      <span className="text-blue-500 font-black">Q.</span> {faq.question}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold pl-5 relative space-y-3">
                    <span className="absolute left-0 top-4 text-emerald-500 font-black">A.</span>
                    {faq.answer.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                        {line}
                      </p>
                    ))}

                    {/* 🚀 바로가기 버튼 제공 */}
                    {faq.link && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                        <Link
                          href={faq.link}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-extrabold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-xs group/btn"
                        >
                          <span>{faq.linkLabel || "관련 메뉴 바로가기"}</span>
                          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </details>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/10 text-sm font-medium">
                일치하는 자주 묻는 질문이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 📬 SECTION 5: 카카오스타일 문의/내역 퀵 배너 */}
        <div className="mt-20 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 text-center space-y-4 shadow-sm relative overflow-hidden">
          <h3 className="text-base md:text-lg font-black text-slate-950 dark:text-white">
            도움말을 통해 문제를 해결하지 못하셨나요?
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold max-w-2xl mx-auto">
            1:1 문의 접수 또는 크리에이박스를 위한 기능 개선 및 개발 제안 사항을 등록해 주시면 <br className="hidden md:inline" />
            담당 AI 지원팀이 신속히 확인하여 자세한 답변 및 업데이트 일정을 피드백해 드립니다.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link 
              href="/help/inquiry" 
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs md:text-sm transition-all cursor-pointer shadow-sm flex items-center"
            >
              문의 접수하기 ➔
            </Link>
            <Link 
              href="/help/my-qna" 
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs md:text-sm transition-all cursor-pointer shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center"
            >
              내 문의/답변 확인 ➔
            </Link>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}