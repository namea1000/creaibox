"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  HelpCircle, 
  RefreshCw, 
  Search, 
  ChevronRight, 
  CheckCircle,
  Database,
  ArrowLeft,
  X,
  FileText
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface ChatLog {
  id: string;
  user_email: string;
  user_question: string;
  bot_response: string;
  matched: boolean;
  feedback_status: "none" | "requested" | "completed";
  created_at: string;
}

interface AnalyticsSummary {
  totalCount: number;
  uniqueUsers: number;
  matchRate: number;
  unansweredCount: number;
}

export default function ChatbotAdminConsole() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalCount: 0,
    uniqueUsers: 0,
    matchRate: 100,
    unansweredCount: 0
  });
  const [userConversations, setUserConversations] = useState<Record<string, ChatLog[]>>({});
  const [unansweredRequests, setUnansweredRequests] = useState<ChatLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chatbot/log");
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setUserConversations(data.userConversations || {});
        setUnansweredRequests(data.unansweredRequests || []);
        
        // Auto select first user if none selected yet
        const emails = Object.keys(data.userConversations || {});
        if (emails.length > 0 && !selectedUser) {
          setSelectedUser(emails[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load chatbot analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleResolveRequest = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/chatbot/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, feedbackStatus: "completed" })
      });

      if (res.ok) {
        // Update local state to remove from requested list
        setUnansweredRequests((prev) => prev.filter((item) => item.id !== id));
        setSummary((prev) => ({
          ...prev,
          unansweredCount: Math.max(0, prev.unansweredCount - 1)
        }));
        alert("건의 사항이 해결 완료 상태로 성공적으로 처리되었습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const emails = Object.keys(userConversations);
    if (!searchQuery.trim()) return emails;
    return emails.filter((email) => 
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userConversations, searchQuery]);

  const activeChatList = selectedUser ? userConversations[selectedUser] || [] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
            
            {/* 🏢 HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    마스터 관리자
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    PLATFORM ANALYTICS CENTER
                  </span>
                </div>
                <h1 className="text-xl md:text-3xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
                  <MessageSquare size={28} className="text-blue-500" />
                  AI 챗봇 이용 분석 관제 센터
                </h1>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  플랫폼 사용자들이 챗봇을 통해 조회한 이력, FAQ 매칭 성과 및 미해결 가이드 건의를 제어합니다.
                </p>
              </div>

              <button
                onClick={fetchAnalytics}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-[#0b0f19]/80 border border-slate-800 rounded-xl transition shadow-sm cursor-pointer"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                새로고침
              </button>
            </div>

            {/* 📊 STATS PANEL */}
            <div className="grid gap-4 sm:grid-cols-4">
              
              <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500">총 챗봇 이용 횟수</span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                    {loading ? "-" : summary.totalCount} <span className="text-xs text-slate-500 font-normal">건</span>
                  </h2>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  <MessageSquare size={16} />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500">고유 이용 사용자</span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                    {loading ? "-" : summary.uniqueUsers} <span className="text-xs text-slate-500 font-normal">명</span>
                  </h2>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <Users size={16} />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500">답변 매칭 성공률</span>
                  <h2 className="text-xl md:text-2xl font-black text-emerald-500 mt-1">
                    {loading ? "-" : `${summary.matchRate}%`}
                  </h2>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25">
                  <TrendingUp size={16} />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500">대기 중인 가이드 건의</span>
                  <h2 className="text-xl md:text-2xl font-black text-amber-500 mt-1">
                    {loading ? "-" : summary.unansweredCount} <span className="text-xs text-slate-500 font-normal">건</span>
                  </h2>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  <HelpCircle size={16} />
                </div>
              </div>

            </div>

            {/* 💬 MAIN VIEW: USER LIST & RESTORED CHAT DIALOG */}
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Left Column: User Sessions list */}
              <div className="lg:col-span-1 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 p-4 space-y-4 flex flex-col h-[520px] overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    이용 사용자 목록 ({filteredUsers.length})
                  </h3>
                </div>

                {/* Search query input */}
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="이메일 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-800 bg-slate-950/50 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-slate-950 transition-all text-white placeholder-slate-600"
                  />
                </div>

                {/* Users list box */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {loading ? (
                    <div className="text-center py-12 text-slate-500 font-bold text-xs">
                      데이터를 불러오는 중...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 font-bold text-xs">
                      매칭되는 사용자가 없습니다.
                    </div>
                  ) : (
                    filteredUsers.map((email) => {
                      const userLogs = userConversations[email] || [];
                      const lastLog = userLogs[userLogs.length - 1];
                      const active = selectedUser === email;

                      return (
                        <button
                          key={email}
                          onClick={() => setSelectedUser(email)}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            active
                              ? "bg-blue-500/10 border-blue-500/40 text-white shadow-inner"
                              : "bg-slate-950/20 border-slate-850/50 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-xs font-black truncate ${active ? "text-blue-400" : "text-slate-300"}`}>
                              {email}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                              최근 질문: {lastLog?.user_question || "-"}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-slate-600 shrink-0" />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Restored Timeline Viewer */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 p-5 flex flex-col h-[520px] overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      대화 타임라인 복원 뷰어
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold">
                      선택된 사용자: <span className="text-blue-400">{selectedUser || "없음"}</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">
                    총 대화 수: {activeChatList.length}건
                  </span>
                </div>

                {/* Message logs container */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-2">
                  {!selectedUser ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <MessageSquare size={36} className="text-slate-700" />
                      <p className="text-xs font-bold">왼쪽 목록에서 대화 이력을 확인할 사용자를 선택하세요.</p>
                    </div>
                  ) : activeChatList.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                      해당 사용자의 대화 기록이 존재하지 않습니다.
                    </div>
                  ) : (
                    activeChatList.map((log) => (
                      <div key={log.id} className="space-y-2.5">
                        
                        {/* User bubble */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%] bg-blue-600/10 border border-blue-500/20 text-blue-200 p-3 rounded-2xl rounded-tr-none text-xs font-semibold">
                            <span className="block text-[9px] text-blue-400 font-bold mb-1">👤 USER QUESTION</span>
                            {log.user_question}
                            <span className="block text-[8px] text-slate-600 text-right mt-1 font-medium">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {/* Bot bubble */}
                        <div className="flex justify-start">
                          <div className="max-w-[85%] bg-slate-950/40 border border-slate-800 text-slate-300 p-3 rounded-2xl rounded-tl-none text-xs font-semibold relative">
                            <div className="flex items-center justify-between gap-4 mb-1">
                              <span className="text-[9px] text-slate-500 font-bold">🤖 CREAIBOX BOT</span>
                              {log.matched ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  FAQ 매칭성공
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  미해결 가이드
                                </span>
                              )}
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {log.bot_response}
                            </div>
                            <span className="block text-[8px] text-slate-600 mt-1.5 font-medium">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* 💡 FAQ FEEDBACK: UNANSWERED SUGGESTION LOGS */}
            <div className="rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <HelpCircle size={16} className="text-amber-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  대기 중인 가이드 추가 건의 목록 (FAQ 보강용)
                </h3>
              </div>

              {unansweredRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-bold">
                  현재 접수된 미해결 가이드 건의 건이 없습니다. 챗봇 가이드 품질이 매우 우수합니다!
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {unansweredRequests.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[9px] text-slate-500 font-bold block truncate">
                            신청자: {item.user_email} | {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <h4 className="text-xs font-black text-slate-200 mt-1 leading-relaxed">
                            "{item.user_question}"
                          </h4>
                        </div>

                        <button
                          onClick={() => handleResolveRequest(item.id)}
                          disabled={updatingId === item.id}
                          className="shrink-0 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] transition cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          {updatingId === item.id ? (
                            <span className="animate-spin text-xs">🌀</span>
                          ) : (
                            <CheckCircle size={10} />
                          )}
                          해결 완료
                        </button>
                      </div>

                      <div className="p-2 rounded bg-slate-900/40 text-[10px] text-slate-400 leading-relaxed font-medium">
                        💡 챗봇의 마지막 대답이 미매칭 처리되었으며, 사용자가 대시보드 검토를 명시적으로 건의했습니다. 해결 시 목록에서 제거됩니다.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
    </div>
  );
}
