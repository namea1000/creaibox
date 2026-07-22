"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  HelpCircle, X, Search, Send, ArrowRight, ExternalLink, 
  Sparkles, MessageSquare, ThumbsUp, AlertCircle, Maximize2, Minimize2
} from "lucide-react";
import { faqData, FAQItem } from "@/app/chatbot/data/faqData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  link?: string;
  linkLabel?: string;
  matched?: boolean;
}

export default function FaqChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! 크리에이박스 공식 **FAQ 챗봇**입니다. 궁금하신 기능이나 에러 해결책을 물어보시면 관련 공식 가이드와 스튜디오 바로가기 버튼을 즉시 안내해 드립니다.",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Window Event & ESC Key Handler
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-faq-chatbot", handleOpenEvent);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        e.preventDefault();
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-faq-chatbot", handleOpenEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isFullScreen]);

  // Keyword Matching Logic based on unified faqData
  const findMatchingFAQ = (query: string): FAQItem | null => {
    const cleanedQuery = query.toLowerCase().replace(/\s+/g, "");
    let bestMatch: FAQItem | null = null;
    let maxScore = 0;

    faqData.forEach((category) => {
      category.items.forEach((item) => {
        const qText = item.question.toLowerCase().replace(/\s+/g, "");
        const aText = item.answer.toLowerCase().replace(/\s+/g, "");

        let score = 0;
        const keywords = [
          { words: ["도메인", "서브도메인", "인증", "승인"], weight: 5 },
          { words: ["네이버", "naver", "api", "블로그"], weight: 5 },
          { words: ["누끼", "배경", "제거", "remover"], weight: 5 },
          { words: ["비디오", "유튜브", "자막", "쇼츠"], weight: 5 },
          { words: ["음악", "노래", "가사", "suno"], weight: 5 },
          { words: ["요금", "플랜", "구독", "결제", "환불", "stripe"], weight: 5 },
          { words: ["키워드", "분석", "조회수", "트렌드"], weight: 4 },
          { words: ["홈페이지", "제작", "빌더", "개설", "섹션", "그리드"], weight: 4 },
          { words: ["마케팅", "홍보", "seo", "검색", "서치콘솔"], weight: 4 },
          { words: ["캐시", "용량", "indexeddb", "저장소"], weight: 4 },
        ];

        keywords.forEach((kw) => {
          const matchCount = kw.words.filter((w) => cleanedQuery.includes(w)).length;
          if (matchCount > 0) {
            const questionHasKeyword = kw.words.some((w) => qText.includes(w));
            if (questionHasKeyword) {
              score += kw.weight * matchCount;
            }
          }
        });

        if (qText.includes(cleanedQuery) || cleanedQuery.includes(qText)) {
          score += 10;
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });
    });

    return maxScore >= 4 ? bestMatch : null;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setSearchQuery("");
    setIsTyping(true);

    // 2. Simulate Matching Process
    setTimeout(() => {
      const match = findMatchingFAQ(text);
      const matched = !!match;

      const botContent = match
        ? `💡 **질문과 관련된 공식 FAQ 가이드입니다:**\n\n**Q. ${match.question}**\n\n${match.answer}`
        : `🔍 **죄송합니다. 현재 등록된 가이드 중 완벽히 일치하는 설명을 찾지 못했습니다.**\n\n1:1 문의 접수 또는 크리에이박스 담당팀에 가이드 수립을 건의하실 수 있습니다.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: botContent,
          link: match?.link,
          linkLabel: match?.linkLabel,
          matched,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  // Extract all FAQ items for quick pill suggestions
  const allFaqs = faqData.flatMap((cat) => cat.items);
  const suggestedFaqs = selectedCategory === "all"
    ? allFaqs.slice(0, 4)
    : allFaqs.filter((f) => f.category === selectedCategory).slice(0, 4);

  if (!isOpen) return null;

  return (
    <div className={`fixed right-0 top-16 z-[85] flex flex-col h-[calc(100vh-64px)] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-100 shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right-5 ${
      isFullScreen ? "left-0 lg:left-[220px] w-auto" : "w-[92vw] sm:w-[480px]"
    }`}>
      
      {/* 🔝 HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/80 dark:bg-[#0b0f19] backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <HelpCircle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-950 dark:text-white">FAQ 챗봇</h3>
              {isFullScreen ? (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                  FULL SCREEN
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-black text-emerald-500 border border-emerald-500/20">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-400">서비스 가이드 및 바로가기 도우미</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 전체 화면 / 복원 토글 버튼 */}
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 text-xs font-extrabold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"
            title={isFullScreen ? "이전 크기로 복원" : "전체 화면으로 열기"}
          >
            {isFullScreen ? (
              <>
                <Minimize2 size={13} className="text-emerald-400" />
                <span>복원</span>
              </>
            ) : (
              <>
                <Maximize2 size={13} className="text-emerald-400" />
                <span>전체 화면</span>
              </>
            )}
          </button>

          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 🏷️ CATEGORY PILLS BAR */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-[#070a11] no-scrollbar shrink-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-full text-[11px] font-black transition whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          전체
        </button>
        {faqData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* 💬 CHAT MESSAGES AREA */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30 dark:bg-[#06080e] custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed font-semibold shadow-xs ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-xs"
                  : "bg-white dark:bg-[#0e1320] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-xs"
              }`}
            >
              {msg.content.split("\n").map((line, idx) => (
                <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                  {line}
                </p>
              ))}

              {/* 바로가기 버튼 레일 */}
              {msg.link && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <Link
                    href={msg.link}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-900/60 transition group/btn"
                  >
                    <span>{msg.linkLabel || "해당 메뉴 바로가기"}</span>
                    <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              )}

              {/* 매칭 실패 시 문의 접수 링크 */}
              {msg.matched === false && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <Link
                    href="/help/inquiry"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <AlertCircle size={12} className="text-amber-500" />
                    <span>1:1 문의 접수하기</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#0e1320] border border-slate-200 dark:border-slate-800 text-xs text-slate-400 font-bold flex items-center gap-1.5">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce [animation-delay:0.2s]">●</span>
              <span className="animate-bounce [animation-delay:0.4s]">●</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 💡 SUGGESTED QUESTIONS CHIPS */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/60 dark:bg-[#090d16] space-y-1.5 shrink-0">
        <p className="text-[10px] font-black text-slate-400 tracking-tight">자주 묻는 핵심 가이드</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedFaqs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => handleSendMessage(faq.question)}
              className="text-left px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 transition truncate max-w-full"
            >
              Q. {faq.question}
            </button>
          ))}
        </div>
      </div>

      {/* 📥 INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(searchQuery);
        }}
        className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="궁금한 단어나 질문을 입력하세요... (예: 네이버 API, 도메인)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold outline-none text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 transition"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
