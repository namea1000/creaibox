"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Search, Clock, ClipboardList, 
  ChevronDown, Phone, MessageSquare, AlertCircle, HelpCircle,
  CheckCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

interface InquiryItem {
  id: string;
  user_email: string;
  phone?: string;
  category: string;
  title: string;
  content: string;
  status: string;
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
}

export default function MyQnaPage() {
  const router = useRouter();

  const [searchEmail, setSearchEmail] = useState("");
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Supabase 세션 불러와 자동 검색 기입
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setSearchEmail(user.email);
          fetchInquiries(user.email);
        }
      } catch (e) {
        console.error("Auth fetch error inside my-qna:", e);
      }
    };
    fetchUser();
  }, []);

  // 특정 이메일 주소로 접수된 문의목록 조회
  const fetchInquiries = async (email: string) => {
    if (!email.trim()) {
      alert("조회할 이메일 주소를 기입해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/customer/inquiry?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      if (result.success) {
        setInquiries(result.data || []);
      } else {
        console.error("Fetch inquiries error:", result.error);
        setInquiries([]);
      }
    } catch (err) {
      console.error(err);
      alert("데이터를 가져오는 중 네트워크 연결 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(searchEmail);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-6">
        
        {/* 뒤로가기 & 헤더 */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/help")}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> 도움말 센터로 돌아가기
          </button>
          
          <div className="border-b border-slate-200 dark:border-slate-850 pb-6 space-y-2">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              내 문의/제안 내역
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-450 font-bold leading-relaxed">
              접수하신 이메일을 기반으로 현재 상담 상태 및 관리자의 답변 내용을 실시간으로 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* 이메일 검색 대화 상자 */}
        <div className="bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                placeholder="조회할 이메일 주소를 입력해 주세요..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-xs md:text-sm font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs md:text-sm rounded-xl transition cursor-pointer shadow-md shadow-blue-500/10 shrink-0"
            >
              내역 조회하기
            </button>
          </form>
        </div>

        {/* 내역 리스트 (게시판 구조) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-3">
            <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
              <ClipboardList size={16} className="text-blue-500" /> 접수 대장 목록 ({inquiries.length})
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">최근 1년 이내의 내역이 보존됩니다.</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-16 bg-white dark:bg-[#0b0f19]/30 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-500">
                문의 내역을 신속하게 가져오고 있습니다...
              </div>
            ) : inquiries.length > 0 ? (
              inquiries.map((inq) => {
                const isOpen = expandedId === inq.id;
                const dateStr = new Date(inq.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div 
                    key={inq.id}
                    className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
                  >
                    {/* 카드 헤더 버튼 */}
                    <button
                      onClick={() => setExpandedId(isOpen ? null : inq.id)}
                      className="w-full text-left p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition cursor-pointer"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                            inq.category === "inquiry"
                              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20"
                              : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20"
                          }`}>
                            {inq.category === "inquiry" ? "🙋 1:1 문의" : "🛠️ 개선/개발요청"}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                            inq.status === "replied"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                              : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                          }`}>
                            {inq.status === "replied" ? "답변 완료" : "답변 대기"}
                          </span>
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white leading-snug">
                          {inq.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                        <span className="text-[10px] text-slate-400 dark:text-slate-555 font-semibold flex items-center gap-1">
                          <Clock size={11} /> {dateStr}
                        </span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* 아코디언 Q&A 본문 전개 영역 */}
                    {isOpen && (
                      <div className="p-6 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 text-xs md:text-sm space-y-5">
                        
                        {/* 질문 영역 */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-[11px]">
                            <HelpCircle size={12} />
                            <span>Q. 문의 상세 내용</span>
                          </div>
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-350 font-semibold leading-relaxed whitespace-pre-wrap">
                            {inq.content}
                          </div>
                          {inq.phone && (
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 flex items-center gap-1 pl-1">
                              📞 연락처: {inq.phone}
                            </p>
                          )}
                        </div>

                        {/* 답변 영역 */}
                        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[11px]">
                            <CheckCircle size={12} />
                            <span>A. 관리자 회신 답변</span>
                            {inq.replied_at && (
                              <span className="text-[9px] text-slate-450 font-medium ml-1">
                                ({new Date(inq.replied_at).toLocaleDateString("ko-KR")} 답변 완료)
                              </span>
                            )}
                          </div>
                          
                          {inq.admin_reply ? (
                            <div className="p-4 rounded-xl bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300 font-semibold leading-relaxed whitespace-pre-wrap">
                              {inq.admin_reply}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-amber-50/25 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/20 text-slate-450 dark:text-slate-500 font-semibold leading-relaxed italic">
                              ⏳ 문의 및 제안 사항이 담당자에게 전달되었습니다. 신속하게 내용을 분석 및 조율하여 명쾌한 답변을 회신해 드릴 수 있도록 처리 중에 있습니다.
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/10 text-xs font-semibold">
                <AlertCircle className="mx-auto mb-2 text-slate-400" size={28} />
                조회된 1:1 문의 및 건의사항 내역이 존재하지 않습니다. <br />
                접수 완료한 이메일 주소로 검색을 다시 실행해 주세요.
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
