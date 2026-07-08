"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Send, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  ThumbsUp, 
  AlertTriangle,
  ArrowUpRight,
  Database,
  Building
} from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { faqData, FAQItem, FAQCategory } from "./data/faqData";
import { createClient } from "@/utils/supabase/client";

interface Message {
  id: string;
  dbId?: string;
  role: "user" | "assistant";
  content: string;
  link?: string;
  linkLabel?: string;
  unresolvedQuery?: string;
  isUnresolvedAction?: boolean;
  isSuccessAction?: boolean;
}

export default function ChatbotHelperPage() {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! 크리에이박스(CreAibox) 사용자를 위한 공식 도우미 챗봇입니다. \n\n왼쪽 가이드 맵에서 질문을 고르시거나, 궁금한 메뉴의 이름이나 기능(예: '네이버 블로그 API', '도메인 신청', '누끼 배경 제거' 등)을 직접 아래에 입력해 주시면 공식 가이드를 친절히 안내해 드릴게요!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("anonymous");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setUserEmail(user.email);
        }
      } catch (e) {
        console.error("Auth mapping error inside chatbot:", e);
      }
    };
    fetchUser();
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const currentCategory = faqData.find((cat) => cat.id === activeCategory) || faqData[0];

  // Markdown parsing helper function for safe formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bold syntax translation: **text**
      let renderedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-950 dark:text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : renderedLine;

      // Unordered list items: * item
      if (line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-1">
            {line.trim().substring(2)}
          </li>
        );
      }

      // Ordered list items: 1. item
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-1">
            {numMatch[2]}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[1em] mb-1.5">
          {content}
        </p>
      );
    });
  };

  // Keyword Matching Logic
  const findMatchingFAQ = (query: string): FAQItem | null => {
    const cleanedQuery = query.toLowerCase().replace(/\s+/g, "");
    
    // We scan all categories and match based on keywords
    let bestMatch: FAQItem | null = null;
    let maxScore = 0;

    faqData.forEach((category) => {
      category.items.forEach((item) => {
        const qText = item.question.toLowerCase().replace(/\s+/g, "");
        const aText = item.answer.toLowerCase().replace(/\s+/g, "");

        let score = 0;

        // Keywords detection
        const keywords = [
          { words: ["도메인", "서브도메인", "인증", "승인"], weight: 5 },
          { words: ["네이버", "naver", "api", "블로그"], weight: 5 },
          { words: ["누끼", "배경", "제거", "remover"], weight: 5 },
          { words: ["비디오", "유튜브", "자막", "쇼츠"], weight: 5 },
          { words: ["음악", "노래", "가사", "suno"], weight: 5 },
          { words: ["요금", "플랜", "구독", "결제", "환불", "stripe"], weight: 5 },
          { words: ["키워드", "분석", "조회수", "트렌드"], weight: 4 },
          { words: ["홈페이지", "제작", "빌더", "개설", "섹션", "그리드"], weight: 4 },
          { words: ["마케팅", "홍보", "seo", "검색"], weight: 3 },
        ];

        keywords.forEach((kw) => {
          const matchCount = kw.words.filter((w) => cleanedQuery.includes(w)).length;
          if (matchCount > 0) {
            // If the query contains keyword, check if the question or answer has it too
            const questionHasKeyword = kw.words.some((w) => qText.includes(w));
            if (questionHasKeyword) {
              score += kw.weight * matchCount;
            }
          }
        });

        // Simple string containment check
        if (qText.includes(cleanedQuery) || cleanedQuery.includes(qText)) {
          score += 10;
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = item;
        }
      });
    });

    // We only return a match if it exceeds a threshold
    return maxScore >= 4 ? bestMatch : null;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // 2. Simulate Bot Thinking & Match Response
    setTimeout(() => {
      const match = findMatchingFAQ(text);
      const botMsgId = `bot-${Date.now()}`;
      const matched = !!match;

      const botResponseContent = match
        ? `💡 **질문하신 내용과 관련된 공식 답변입니다:**\n\n**Q: ${match.question}**\n\n${match.answer}`
        : `🔍 **죄송합니다. 현재 데이터베이스에 해당 주제와 완벽히 매칭되는 설명서가 구비되어 있지 않습니다.**\n\n요청하신 질문에 대해 유관 부서 및 크리에이박스 담당팀이 빠르게 매뉴얼을 수립하여 지식을 보강할 수 있도록 가이드 제작 건의를 넣으실 수 있습니다.\n\n* **문의 내용:** "${text}"`;

      // Add to local state immediately
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "assistant",
          content: botResponseContent,
          link: match?.link,
          linkLabel: match?.linkLabel,
          unresolvedQuery: match ? undefined : text,
          isUnresolvedAction: !match
        }
      ]);

      // Post to DB logger
      fetch("/api/chatbot/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userQuestion: text,
          botResponse: botResponseContent,
          matched
        })
      })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data && result.data[0]) {
            const liveDbId = result.data[0].id;
            setMessages((prev) => 
              prev.map((msg) => msg.id === botMsgId ? { ...msg, dbId: liveDbId } : msg)
            );
          }
        }
      })
      .catch((err) => console.error("Logger error:", err));

      setIsTyping(false);
    }, 800);
  };

  // Submit Unknown question feedback status to requested
  const handleRequestGuide = async (queryText: string, messageId: string, dbId?: string) => {
    if (!dbId) {
      alert("대화 이력 식별 고유키가 아직 생성되지 않았습니다. 잠시 후 다시 건의해 주세요.");
      return;
    }
    setSendingRequest(messageId);
    try {
      const response = await fetch("/api/chatbot/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dbId,
          feedbackStatus: "requested"
        })
      });

      if (response.ok) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  isUnresolvedAction: false, 
                  isSuccessAction: true,
                  content: `${msg.content}\n\n✅ **건의 사항이 정상적으로 관리자 대시보드에 접수되었습니다!** 크리에이박스 기술 파트에서 검토 후 최대한 빠르게 공식 설명서 데이터를 확장 탑재하겠습니다.`
                } 
              : msg
          )
        );
      } else {
        alert("데이터베이스 상태 변경 처리에 실패했습니다. (DB 연결 오류)");
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setSendingRequest(null);
    }
  };

  const handleQuestionClick = (item: FAQItem) => {
    setIsTyping(true);
    const userMsgId = `click-user-${Date.now()}`;
    const queryText = `[가이드조회] ${item.question}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: queryText
      }
    ]);

    setTimeout(() => {
      const botMsgId = `click-bot-${Date.now()}`;
      const botResponseContent = `💡 **선택하신 공식 설명서 가이드 정보입니다:**\n\n**Q: ${item.question}**\n\n${item.answer}`;

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "assistant",
          content: botResponseContent,
          link: item.link,
          linkLabel: item.linkLabel
        }
      ]);

      // Post to DB logger
      fetch("/api/chatbot/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userQuestion: queryText,
          botResponse: botResponseContent,
          matched: true
        })
      }).catch((err) => console.error("Logger error:", err));

      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 flex overflow-hidden transition-colors duration-300">
      {/* 🚀 SIDEBAR NAVIGATION */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-100/50 dark:bg-slate-950/60 relative transition-colors duration-300">
        <Header />

        <div className="flex-1 flex flex-col lg:flex-row pt-16 overflow-hidden">
          
          {/* 📂 LEFT PANEL: FAQ CATEGORY MAP & TOPICS */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-950/40 shrink-0">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  가이드 지식 맵
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">FAQ Categories</span>
            </div>

            {/* Category tabs */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {faqData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-white dark:bg-slate-900/90 border-blue-500/50 dark:border-blue-500/50 shadow-md ring-1 ring-blue-500/20"
                      : "bg-slate-50/40 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0">{cat.icon}</span>
                    <div className="min-w-0">
                      <h3 className={`text-xs font-black ${activeCategory === cat.id ? "text-blue-600 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {cat.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-semibold mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Platform Help Note */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-450 dark:text-slate-500 font-bold space-y-1.5">
              <p>💡 챗봇은 일반적인 기술 기밀 사양이나 구현 구조를 답변하지 않으며 오직 사용 가이드만 다룹니다.</p>
            </div>
          </div>

          {/* 💬 RIGHT PANEL: LIVELY CHAT STAGE */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40 dark:bg-slate-900/10 overflow-hidden">
            
            {/* Chat stage header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <h2 className="text-xs font-black text-slate-850 dark:text-slate-200">
                  {currentCategory.title} ➔ 공식 AI 도우미
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">CreAibox Helper v1.0</span>
            </div>

            {/* Chat message flow container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              
              {/* FAQ items recommendations on top */}
              <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 mb-6 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-400 font-black tracking-wider uppercase mb-1">
                  <HelpCircle size={12} className="text-blue-500" />
                  추천 검색 가이드 토픽
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {currentCategory.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleQuestionClick(item)}
                      className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/50 text-[11px] font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-350 dark:hover:border-slate-700 transition cursor-pointer flex items-start gap-1.5 group shadow-sm"
                    >
                      <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0">➔</span>
                      <span className="truncate">{item.question}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat bubbles list */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm">
                        🤖
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div
                        className={`p-3.5 rounded-2xl text-xs md:text-sm font-semibold border ${
                          msg.role === "user"
                            ? "bg-blue-600 border-blue-500 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-tl-none shadow-md"
                        }`}
                      >
                        <div className="space-y-1">
                          {parseMarkdown(msg.content)}
                        </div>

                        {/* Unresolved Telemetry Option */}
                        {msg.isUnresolvedAction && msg.unresolvedQuery && (
                          <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                            <button
                               onClick={() => handleRequestGuide(msg.unresolvedQuery!, msg.id, msg.dbId)}
                              disabled={sendingRequest !== null}
                              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] md:text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              {sendingRequest === msg.id ? (
                                <span className="animate-spin text-xs">🌀</span>
                              ) : (
                                <Database size={11} />
                              )}
                              가이드 제작 요청 접수하기
                            </button>
                            <p className="text-[9px] text-slate-450 dark:text-slate-500 leading-relaxed font-medium">
                              * 가이드 제작 요청을 하시면 해당 건의 사항이 관리자 분석 관제 센터로 자동 연계 전송됩니다.
                            </p>
                          </div>
                        )}

                        {/* Direct action link if faq data has a route shortcut */}
                        {msg.link && msg.linkLabel && (
                          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                            <Link
                              href={msg.link}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 group"
                            >
                              {msg.linkLabel}
                              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator placeholder */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      🤖
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 rounded-tl-none flex items-center gap-1 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-slate-650 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-slate-650 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-slate-650 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat live input console */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="예: '도메인 어떻게 신청하나요?', '네이버 연동은 어떻게 해요?'..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500/60 focus:bg-white dark:focus:bg-slate-900/90 transition shadow-inner placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-bold transition shrink-0 cursor-pointer shadow-md disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
