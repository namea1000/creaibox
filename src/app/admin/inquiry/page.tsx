"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Search, Clock, CheckCircle, 
  HelpCircle, AlertCircle, Send, MessageSquare 
} from "lucide-react";
import Header from "@/components/layout/Header";

interface InquiryItem {
  id: string;
  user_email: string;
  phone?: string;
  category: string;
  title: string;
  content: string;
  status: "pending" | "replied";
  admin_reply?: string;
  created_at: string;
  replied_at?: string;
}

export default function AdminInquiryPage() {
  const router = useRouter();
  
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // 선택된 상세 문의 및 답변 임시 상태
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  // 1. 전체 문의 데이터 로드
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/inquiry");
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data || []);
      } else {
        console.error("Fetch admin inquiries error:", result.error);
      }
    } catch (err) {
      console.error(err);
      alert("문의 데이터를 불러오는 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // 2. 답변 등록/수정 전송
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    if (!replyText.trim()) {
      alert("답변 내용을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          adminReply: replyText
        })
      });
      const result = await response.json();
      if (result.success) {
        alert("답변이 정상적으로 등록되었습니다.");
        
        // 목록 로컬 갱신 및 선택한 상세 상태 갱신
        const updatedList = inquiries.map(item => {
          if (item.id === selectedInquiry.id) {
            const updated = {
              ...item,
              admin_reply: replyText,
              status: "replied" as const,
              replied_at: new Date().toISOString()
            };
            setSelectedInquiry(updated);
            return updated;
          }
          return item;
        });
        setInquiries(updatedList);
      } else {
        alert(`답변 등록 실패: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("답변 등록 중 네트워크 연결 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 필터 및 검색 적용
  const filteredList = inquiries.filter(item => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "pending" && item.status === "pending") ||
      (filter === "replied" && item.status === "replied");
    
    const matchesSearch = 
      item.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10 space-y-6">
        
        {/* 헤더 & 뒤로가기 */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> 관리자 대시보드로 돌아가기
          </button>
          
          <div className="border-b border-slate-200 dark:border-slate-850 pb-6">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              고객지원 1:1 문의 관리
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-450 font-bold leading-relaxed mt-1">
              접수된 사용자 1:1 상담 내역 및 개선 제안 대장을 실시간 확인하고 답변을 발송합니다.
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 영역: 2단 분할 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 좌측: 목록 패널 (7열) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 필터 및 검색창 */}
            <div className="bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-1">
                {(["all", "pending", "replied"] as const).map((tab) => {
                  const labels = { all: "전체", pending: "대기", replied: "완료" };
                  const active = filter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                        active
                          ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white"
                          : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl flex-1 max-w-xs">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="이메일, 제목, 카테고리 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-850 dark:text-white outline-none w-full placeholder-slate-450"
                />
              </div>
            </div>

            {/* 목록 바디 */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-20 bg-white dark:bg-[#0b0f19]/40 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs font-bold text-slate-500">
                  문의 내역을 불러오는 중입니다...
                </div>
              ) : filteredList.length > 0 ? (
                filteredList.map((item) => {
                  const isSelected = selectedInquiry?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedInquiry(item);
                        setReplyText(item.admin_reply || "");
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm text-left ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20 dark:bg-blue-500/5"
                          : "border-slate-200 dark:border-slate-850 bg-white dark:bg-[#0b0f19]/80 hover:border-slate-350 dark:hover:border-slate-750"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-black tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md uppercase">
                          {item.category || "미분류"}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {item.status === "replied" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle size={10} /> 답변완료
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                              <Clock size={10} /> 답변대기
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xs md:text-sm font-black text-slate-900 dark:text-white mt-3 truncate">
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 dark:text-slate-455 font-bold mt-1 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
                        <span>{item.user_email}</span>
                        <span>{new Date(item.created_at).toLocaleString("ko-KR")}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-white dark:bg-[#0b0f19]/40 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs font-bold text-slate-500">
                  접수된 문의 내역이 없습니다.
                </div>
              )}
            </div>

          </div>

          {/* 우측: 상세 내용 및 답변 편집 콘솔 (5열) */}
          <div className="lg:col-span-5">
            {selectedInquiry ? (
              <div className="bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                
                {/* 문의 상세 정보 */}
                <div className="space-y-4 pb-5 border-b border-slate-200 dark:border-slate-850">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">문의 상세 내용</h3>
                    <span className="text-[10px] font-bold text-slate-400">
                      ID: {selectedInquiry.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-semibold">
                    <div className="flex justify-between text-slate-500">
                      <span>작성자:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedInquiry.user_email}</span>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex justify-between text-slate-500">
                        <span>연락처:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedInquiry.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>분류 카테고리:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedInquiry.category}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>접수 시각:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {new Date(selectedInquiry.created_at).toLocaleString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 질문 제목 및 본문 */}
                <div className="space-y-2">
                  <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white">
                    Q. {selectedInquiry.title}
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-850 text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-semibold max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {selectedInquiry.content}
                  </div>
                </div>

                {/* 답변 편집 양식 */}
                <form onSubmit={handleReplySubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <label className="text-xs md:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-blue-500" />
                    관리자 답변 작성
                  </label>
                  
                  <textarea
                    rows={6}
                    required
                    placeholder="사용자 이메일 알림 및 내 Q&A 확인 메뉴에 등록될 공식 회신 내용을 작성해 주세요."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition shadow-inner resize-none leading-relaxed"
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 rounded-xl bg-[#fee500] hover:bg-[#ebd300] disabled:bg-slate-250 text-[#191919] font-black text-xs md:text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send size={12} />
                    <span>{selectedInquiry.admin_reply ? "답변 수정 완료" : "답변 등록 완료"}</span>
                  </button>
                </form>

              </div>
            ) : (
              <div className="bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 rounded-3xl p-16 text-center text-slate-455 font-bold text-xs md:text-sm flex flex-col items-center justify-center gap-3 shadow-sm">
                <AlertCircle size={24} className="text-slate-350" />
                <span>왼쪽 목록에서 세부 확인 및 답변할 문의 사항을 선택해 주세요.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
