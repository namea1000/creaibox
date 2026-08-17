"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  LayoutTemplate,
  PenTool,
  Video,
  BarChart3,
  HardDrive,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmartIntentLink from "@/components/common/SmartIntentLink";
import { faqData, FAQItem, FAQCategory } from "@/app/chatbot/data/faqData";

// Icon mapping per category ID
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  general: CreditCard,
  "site-builder": LayoutTemplate,
  "ai-writer": PenTool,
  "media-studio": Video,
  analytics: BarChart3,
  storage: HardDrive,
  troubleshoot: AlertTriangle,
};

export default function HelpCenterPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    "gen-1": true, // First item open by default
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  // Active Category Object
  const activeCategory = useMemo(() => {
    return faqData.find((cat) => cat.id === selectedCategoryId) || faqData[0];
  }, [selectedCategoryId]);

  // Current category index for prev/next
  const currentCategoryIdx = useMemo(() => {
    return faqData.findIndex((cat) => cat.id === selectedCategoryId);
  }, [selectedCategoryId]);

  const prevCategory = currentCategoryIdx > 0 ? faqData[currentCategoryIdx - 1] : null;
  const nextCategory =
    currentCategoryIdx < faqData.length - 1 ? faqData[currentCategoryIdx + 1] : null;

  // Filter items in current category (or across all if searching)
  const displayedItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeCategory.items;
    }
    const q = searchQuery.toLowerCase().trim();
    // When searching, find matching items from all categories
    return faqData
      .flatMap((c) => c.items)
      .filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
  }, [activeCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyPage = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type: "yes" | "no") => {
    setFeedbackGiven(type);
    setTimeout(() => {
      // Keep feedback recorded
    }, 100);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ─────────────────────────────────────────────────────────────
            TOP SEARCH BAR & TITLE HEADER (Kimi Style)
        ───────────────────────────────────────────────────────────── */}
        <div className="mb-8 pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
              <HelpCircle size={13} />
              <span>CreaiBox Help Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              도움말 &amp; 고객지원 센터
            </h1>
          </div>

          {/* Search Bar with ⌘K Look */}
          <div className="w-full md:w-80 lg:w-96 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금한 질문 검색... (예: 결제, 도메인, 오류)"
              className="w-full bg-zinc-900/90 border border-zinc-800 focus:border-blue-500/80 rounded-xl pl-10 pr-12 py-2.5 text-xs sm:text-sm font-semibold text-zinc-100 placeholder:text-zinc-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 hover:text-zinc-300"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2-LAYER (2-COLUMN) LAYOUT
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* 📁 LEFT SIDEBAR (Category Navigation - 3 cols) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-24">
            
            {/* Mobile Category Dropdown Selector */}
            <div className="lg:hidden w-full space-y-1.5 mb-4">
              <label className="text-xs font-bold text-zinc-400">카테고리 선택</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSearchQuery("");
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm font-bold text-white outline-none focus:border-blue-500"
              >
                {faqData.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title} ({cat.items.length})
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Navigation List */}
            <div className="hidden lg:block space-y-1">
              <div className="px-3 pb-2 text-[11px] font-black uppercase tracking-wider text-zinc-500">
                도움말 카테고리
              </div>

              {faqData.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id] || FolderOpen;
                const isActive = selectedCategoryId === cat.id && !searchQuery;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? "bg-zinc-800 text-white shadow-md border border-zinc-700/60"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors ${
                          isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      />
                      <span className="truncate">{cat.title}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-zinc-700 text-cyan-300"
                          : "text-zinc-500 group-hover:text-zinc-400"
                      }`}
                    >
                      {cat.items.length}
                    </span>
                  </button>
                );
              })}

              {/* 1:1 Contact Hub link */}
              <div className="pt-4 mt-4 border-t border-zinc-800/80 space-y-1">
                <div className="px-3 pb-1 text-[11px] font-black uppercase tracking-wider text-zinc-500">
                  고객 지원 바로가기
                </div>

                <SmartIntentLink
                  href="/help/inquiry"
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900/60 transition-all flex items-center gap-2"
                >
                  <MessageSquare size={14} className="text-blue-400" />
                  <span>1:1 맞춤 문의 접수</span>
                </SmartIntentLink>

                <SmartIntentLink
                  href="/help/my-qna"
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900/60 transition-all flex items-center gap-2"
                >
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>내 문의 내역 및 답변 확인</span>
                </SmartIntentLink>
              </div>
            </div>
          </aside>

          {/* 📄 RIGHT CONTENT (Accordion Q&A List - 9 cols) */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Category Title & Copy Page Header (Kimi 1:1 Style) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {searchQuery ? `"${searchQuery}" 검색 결과` : activeCategory.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  {searchQuery
                    ? `총 ${displayedItems.length}개의 관련 도움말 항목이 발견되었습니다.`
                    : activeCategory.description}
                </p>
              </div>

              {/* Copy Page URL Button */}
              <button
                onClick={handleCopyPage}
                className="self-start inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">링크 복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-zinc-400" />
                    <span>Copy page</span>
                  </>
                )}
              </button>
            </div>

            {/* 📋 Accordion List Box (Kimi Platform Unified Box Style) */}
            {displayedItems.length > 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden shadow-2xl backdrop-blur-sm">
                {displayedItems.map((item) => {
                  const isOpen = !!openItemIds[item.id];

                  return (
                    <div key={item.id} className="transition-colors">
                      {/* Accordion Header Button */}
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full text-left px-5 sm:px-6 py-4.5 flex items-start gap-3.5 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <ChevronRight
                          size={16}
                          className={`mt-0.5 shrink-0 transition-transform duration-200 ${
                            isOpen
                              ? "rotate-90 text-cyan-400"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        />
                        <span className="text-sm sm:text-[15px] font-bold text-zinc-200 group-hover:text-white transition-colors leading-snug flex-1">
                          {item.question}
                        </span>
                      </button>

                      {/* Collapsible Answer Body */}
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-zinc-300 leading-relaxed bg-zinc-900/30 border-t border-zinc-800/40 space-y-4">
                          <div className="pl-7 space-y-2 whitespace-pre-line leading-relaxed text-zinc-300">
                            {item.answer}
                          </div>

                          {/* Quick Studio Link Button if present */}
                          {item.link && (
                            <div className="pl-7 pt-2">
                              <SmartIntentLink
                                href={item.link}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-black transition-all shadow-sm"
                              >
                                <span>{item.linkLabel || "해당 메뉴로 바로가기"}</span>
                                <ArrowRight size={13} />
                              </SmartIntentLink>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3">
                <HelpCircle size={32} className="mx-auto text-zinc-600" />
                <p className="text-sm font-bold text-zinc-300">
                  검색어와 일치하는 도움말 항목이 없습니다.
                </p>
                <p className="text-xs text-zinc-500">
                  다른 키워드로 검색하시거나 1:1 문의 접수를 통해 실시간 지원을 받아보세요.
                </p>
                <div className="pt-2">
                  <SmartIntentLink
                    href="/help/inquiry"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                  >
                    <span>1:1 고객센터 문의하기</span>
                    <ArrowRight size={14} />
                  </SmartIntentLink>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                WAS THIS PAGE HELPFUL? (Kimi Feedback Widget)
            ───────────────────────────────────────────────────────────── */}
            <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/80">
              <span className="text-xs sm:text-sm font-semibold text-zinc-400">
                이 도움말 페이지가 유용하셨나요?
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeedback("yes")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    feedbackGiven === "yes"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <ThumbsUp size={13} />
                  <span>네, 도움되었어요</span>
                </button>

                <button
                  onClick={() => handleFeedback("no")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    feedbackGiven === "no"
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                  }`}
                >
                  <ThumbsDown size={13} />
                  <span>아쉬워요</span>
                </button>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                PREV / NEXT CATEGORY NAVIGATION
            ───────────────────────────────────────────────────────────── */}
            {!searchQuery && (
              <div className="pt-4 flex items-center justify-between gap-4">
                {prevCategory ? (
                  <button
                    onClick={() => {
                      setSelectedCategoryId(prevCategory.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={15} />
                    <span>{prevCategory.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategoryId(nextCategory.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{nextCategory.title}</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                1:1 INQUIRY BANNER
            ───────────────────────────────────────────────────────────── */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-zinc-900 to-indigo-950/30 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles size={15} className="text-cyan-400" />
                  원하시는 답변을 찾지 못하셨나요?
                </h3>
                <p className="text-xs text-zinc-400">
                  전담 고객지원팀에 1:1 맞춤 문의를 남겨주시면 신속하게 답변해 드립니다.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <SmartIntentLink
                  href="/help/inquiry"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md"
                >
                  1:1 문의 접수
                </SmartIntentLink>
                <SmartIntentLink
                  href="/help/my-qna"
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all"
                >
                  답변 확인
                </SmartIntentLink>
              </div>
            </div>

          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}