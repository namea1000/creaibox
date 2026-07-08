"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Database,
  Phone,
  Mail,
  Loader2,
  X,
  Plus,
  HelpCircle,
  FileText,
  Send,
  Sparkles,
  ClipboardList
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface B2BInquiry {
  id: string;
  inquiry_type?: "enterprise" | "collaboration";
  company_name: string;
  manager_name: string;
  manager_position?: string;
  phone: string;
  email: string;
  solutions: string[];
  details?: string;
  status: "pending" | "processing" | "completed";
  admin_notes?: string;
  created_at: string;
}

interface SupportInquiry {
  id: string;
  user_email: string;
  phone?: string;
  category: "inquiry" | "suggestion";
  title: string;
  content: string;
  status: "pending" | "replied";
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
}

export default function BusinessAdminDashboard() {
  const currentYear = new Date().getFullYear();
  
  // 탭 제어: "b2b" (상담 접수) vs "support" (1:1 문의 및 사이트 건의)
  const [activeTab, setActiveTab] = useState<"b2b" | "support">("b2b");

  // B2B 리드 상태
  const [inquiries, setInquiries] = useState<B2BInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<B2BInquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingNotes, setEditingNotes] = useState("");

  // Support 1:1 Q&A / 건의 상태
  const [supportInquiries, setSupportInquiries] = useState<SupportInquiry[]>([]);
  const [selectedSupport, setSelectedSupport] = useState<SupportInquiry | null>(null);
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  const [supportCategoryFilter, setSupportCategoryFilter] = useState<string>("all");
  const [supportStatusFilter, setSupportStatusFilter] = useState<string>("all");
  const [editingReply, setEditingReply] = useState("");

  // 글로벌 로딩 및 동작 상태
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 🌟 B2B 데이터 가져오기
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/business/inquiry");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data || []);
      } else {
        setInquiries([]);
      }
    } catch (err) {
      console.error(err);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Support 데이터 가져오기
  const fetchSupportInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiry");
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setSupportInquiries(result.data || []);
        } else {
          setSupportInquiries([]);
        }
      } else {
        setSupportInquiries([]);
      }
    } catch (err) {
      console.error(err);
      setSupportInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "b2b") {
      fetchInquiries();
      setSelectedInquiry(null);
    } else {
      fetchSupportInquiries();
      setSelectedSupport(null);
    }
  }, [activeTab]);

  // 🌟 B2B 상태 제어
  const handleUpdateStatus = async (id: string, newStatus: "pending" | "processing" | "completed") => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/business/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    const id = selectedInquiry.id;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/business/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNotes: editingNotes }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, admin_notes: editingNotes } : item))
        );
        setSelectedInquiry((prev) => prev ? { ...prev, admin_notes: editingNotes } : null);
        alert("관리자 메모가 정상 등록되었습니다.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🌟 Support 답변 처리
  const handleSaveSupportReply = async () => {
    if (!selectedSupport) return;
    const id = selectedSupport.id;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminReply: editingReply }),
      });
      const result = await res.json();
      if (result.success && result.data && result.data[0]) {
        const updated = result.data[0];
        setSupportInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, admin_reply: updated.admin_reply, status: updated.status, replied_at: updated.replied_at } : item))
        );
        setSelectedSupport(updated);
        alert("고객에게 답변 및 이메일 회신 상태가 동기화되었습니다.");
      } else {
        alert("답변 등록 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 필터링 계산들
  const filteredB2B = inquiries.filter((item) => {
    const matchesSearch =
      item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const isChatbotUnanswered = item.solutions?.includes("AI 챗봇 미해결 질문") || false;
    const matchesType =
      typeFilter === "all"
        ? true
        : typeFilter === "unanswered"
          ? isChatbotUnanswered
          : item.inquiry_type === typeFilter && !isChatbotUnanswered;

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredSupport = supportInquiries.filter((item) => {
    const matchesSearch =
      item.user_email.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(supportSearchQuery.toLowerCase());
    const matchesCategory = supportCategoryFilter === "all" || item.category === supportCategoryFilter;
    const matchesStatus = supportStatusFilter === "all" || item.status === supportStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getB2BTypeBadge = (type?: string, solutions: string[] = []) => {
    if (solutions.includes("AI 챗봇 미해결 질문")) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">💡 챗봇 가이드 건의</span>;
    }
    if (type === "collaboration") {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🤝 협업/광고 제안</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">🏢 기업 맞춤 제작</span>;
  };

  const getB2BStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"><CheckCircle size={12} /> 답변완료</span>;
      case "processing":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25"><Clock size={12} /> 진행중</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25"><AlertCircle size={12} /> 접수대기</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 min-h-screen bg-[#06080d] text-slate-100 transition-colors duration-300">
      
      {/* 🏢 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              어드민 관제실
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Control & Help Dashboard
            </span>
          </div>
          <h1 className="text-xl md:text-3xl font-black text-white mt-1.5 tracking-tight">
            마스터 비즈니스 & 고객 케어 제어반
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            B2B 리드 상담 신청 건과 1:1 고객 문의, 사이트 건의사항을 한눈에 조회하고 답변을 관리합니다.
          </p>
        </div>

        <button
          onClick={() => activeTab === "b2b" ? fetchInquiries() : fetchSupportInquiries()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-[#0b0f19]/80 border border-slate-800 rounded-xl transition shadow-sm cursor-pointer"
        >
          <span>🔄 새로고침</span>
        </button>
      </div>

      {/* 🚀 TAB NAVIGATION */}
      <div className="flex gap-2 border-b border-slate-850 pb-2">
        <button
          onClick={() => setActiveTab("b2b")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer ${
            activeTab === "b2b"
              ? "bg-blue-650 text-white shadow-md shadow-blue-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          💼 B2B 리드 상담 관리 ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition cursor-pointer ${
            activeTab === "support"
              ? "bg-blue-650 text-white shadow-md shadow-blue-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          🙋 고객 1:1 문의 & 사이트 건의 ({supportInquiries.length})
        </button>
      </div>

      {activeTab === "b2b" ? (
        <>
          {/* 🖥️ STATS FOR B2B */}
          <div className="grid gap-4 grid-cols-3">
            <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">접수대기</span>
                <h2 className="text-xl md:text-2xl font-black text-rose-400 mt-1">
                  {inquiries.filter((i) => i.status === "pending").length} <span className="text-xs text-slate-650 font-normal">건</span>
                </h2>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 hidden md:block">
                <AlertCircle size={16} />
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">진행중</span>
                <h2 className="text-xl md:text-2xl font-black text-amber-400 mt-1">
                  {inquiries.filter((i) => i.status === "processing").length} <span className="text-xs text-slate-650 font-normal">건</span>
                </h2>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 hidden md:block">
                <Clock size={16} />
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">답변완료</span>
                <h2 className="text-xl md:text-2xl font-black text-emerald-400 mt-1">
                  {inquiries.filter((i) => i.status === "completed").length} <span className="text-xs text-slate-650 font-normal">건</span>
                </h2>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hidden md:block">
                <CheckCircle size={16} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* 📋 B2B LIST */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 flex flex-col md:flex-row md:items-center gap-4 justify-between shadow-sm">
                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="회사명, 담당자, 이메일 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-slate-950/50 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-slate-950 transition-all text-white placeholder-slate-650"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <div className="flex gap-1 border-slate-850 md:border-r md:pr-3 md:mr-1">
                    {["all", "enterprise", "collaboration", "unanswered"].map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setTypeFilter(tp)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-extrabold border transition cursor-pointer ${
                          typeFilter === tp
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {tp === "all" ? "전체유형" : tp === "enterprise" ? "기업맞춤" : tp === "collaboration" ? "협업/광고" : "챗봇건의"}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1">
                    {["all", "pending", "processing", "completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-extrabold border transition cursor-pointer ${
                          statusFilter === st
                            ? "bg-slate-100 border-slate-100 text-slate-900"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {st === "all" ? "전체보기" : st === "pending" ? "대기" : st === "processing" ? "진행" : "완료"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredB2B.length === 0 ? (
                  <div className="text-center py-16 bg-[#0b0f19]/80 border border-slate-800/60 rounded-3xl">
                    <MessageSquare className="mx-auto text-slate-700 mb-2" size={32} />
                    <p className="text-xs text-slate-500 font-bold">등록된 상담 제안 건이 없습니다.</p>
                  </div>
                ) : (
                  filteredB2B.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedInquiry(item);
                        setEditingNotes(item.admin_notes || "");
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20 hover:bg-slate-900/40 hover:shadow-md ${
                        selectedInquiry?.id === item.id
                          ? "border-blue-500/60 ring-2 ring-blue-500/10 shadow-sm"
                          : "border-slate-800/80"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm md:text-base font-black text-white truncate">
                            {item.company_name}
                          </h3>
                          {getB2BTypeBadge(item.inquiry_type, item.solutions)}
                          {getB2BStatusBadge(item.status)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-450 font-semibold">
                          <span className="flex items-center gap-1 font-black text-slate-200">
                            👤 {item.manager_name} {item.manager_position && `(${item.manager_position})`}
                          </span>
                          <span className="flex items-center gap-1">📞 {item.phone}</span>
                          <span className="flex items-center gap-1 truncate">✉️ {item.email}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {item.solutions.map((sol) => (
                            <span key={sol} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                              {sol}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 justify-end">
                        <span className="text-[10px] font-bold text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <ChevronRight size={16} className="text-slate-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 📋 B2B DETAILED PANEL */}
            <div className="lg:col-span-1">
              {selectedInquiry ? (
                <div className="p-6 rounded-3xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm space-y-6 sticky top-24">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-white">상담 접수 상세 정보</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">상태 업데이트 및 메모를 기록합니다.</p>
                    </div>
                    <button onClick={() => setSelectedInquiry(null)} className="p-1 rounded hover:bg-slate-900 text-slate-500">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-350">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase">회사/기관</span>
                      <p className="text-xs font-black text-white">🏢 {selectedInquiry.company_name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase">담당자</span>
                      <p className="text-xs font-black text-white">👤 {selectedInquiry.manager_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase">연락처</span>
                        <a href={`tel:${selectedInquiry.phone}`} className="text-blue-400 block font-bold mt-0.5">📞 {selectedInquiry.phone}</a>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase">이메일</span>
                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 block font-bold truncate mt-0.5">✉️ {selectedInquiry.email}</a>
                      </div>
                    </div>
                    {selectedInquiry.details && (
                      <div className="space-y-1 pt-2 border-t border-slate-850">
                        <span className="text-[9px] text-slate-500 uppercase">세부 요청사항</span>
                        <p className="p-3.5 rounded-xl bg-slate-950/40 text-[11px] leading-relaxed border border-slate-850/60 max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                          {selectedInquiry.details}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-805">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase block">상태 업데이트</label>
                      <div className="flex gap-1">
                        {["pending", "processing", "completed"].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(selectedInquiry.id, st as any)}
                            disabled={updatingId === selectedInquiry.id}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition cursor-pointer ${
                              selectedInquiry.status === st
                                ? "bg-blue-600/10 border-blue-500/40 text-blue-400"
                                : "bg-slate-950/40 border-slate-850 text-slate-500"
                            }`}
                          >
                            {st === "pending" ? "대기" : st === "processing" ? "진행" : "완료"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase block">상담 조율 메모</label>
                      <textarea
                        rows={4}
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="특이사항 등의 일지를 적어주세요..."
                        className="w-full p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-xs font-semibold outline-none focus:border-blue-500 text-white placeholder-slate-650 resize-none"
                      />
                      <button
                        onClick={handleSaveNotes}
                        disabled={updatingId !== null}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-extrabold text-xs transition cursor-pointer"
                      >
                        메모 저장하기
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl border border-slate-800 border-dashed text-center bg-slate-950/20 py-24 sticky top-24">
                  <Database className="mx-auto text-slate-700" size={32} />
                  <p className="text-xs text-slate-400 font-black mt-2">B2B 리드를 선택해 주세요</p>
                </div>
              )}
            </div>

          </div>
        </>
      ) : (
        <>
          {/* 🖥️ STATS FOR SUPPORT */}
          <div className="grid gap-4 grid-cols-2">
            <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">미답변 (대기)</span>
                <h2 className="text-xl md:text-2xl font-black text-rose-450 mt-1">
                  {supportInquiries.filter((i) => i.status === "pending").length} <span className="text-xs text-slate-650 font-normal">건</span>
                </h2>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 hidden md:block">
                <AlertCircle size={16} />
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">답변 완료</span>
                <h2 className="text-xl md:text-2xl font-black text-emerald-450 mt-1">
                  {supportInquiries.filter((i) => i.status === "replied").length} <span className="text-xs text-slate-650 font-normal">건</span>
                </h2>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hidden md:block">
                <CheckCircle size={16} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* 📋 SUPPORT LIST */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-2xl border border-slate-800/60 bg-[#0b0f19]/80 flex flex-col md:flex-row md:items-center gap-4 justify-between shadow-sm">
                <div className="relative w-full md:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="이메일, 제목, 내용 검색..."
                    value={supportSearchQuery}
                    onChange={(e) => setSupportSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-800 bg-slate-950/50 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:bg-slate-950 transition-all text-white placeholder-slate-650"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <div className="flex gap-1 border-slate-850 md:border-r md:pr-3 md:mr-1">
                    {["all", "inquiry", "suggestion"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSupportCategoryFilter(cat)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-extrabold border transition cursor-pointer ${
                          supportCategoryFilter === cat
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {cat === "all" ? "전체유형" : cat === "inquiry" ? "🙋 1:1 문의" : "🛠️ 개선/개발요청"}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1">
                    {["all", "pending", "replied"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSupportStatusFilter(st)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-extrabold border transition cursor-pointer ${
                          supportStatusFilter === st
                            ? "bg-slate-100 border-slate-100 text-slate-900"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {st === "all" ? "전체보기" : st === "pending" ? "대기" : "답변완료"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredSupport.length === 0 ? (
                  <div className="text-center py-16 bg-[#0b0f19]/80 border border-slate-800/60 rounded-3xl">
                    <ClipboardList className="mx-auto text-slate-700 mb-2" size={32} />
                    <p className="text-xs text-slate-500 font-bold">등록된 고객 문의 및 건의 건이 없습니다.</p>
                  </div>
                ) : (
                  filteredSupport.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedSupport(item);
                        setEditingReply(item.admin_reply || "");
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20 hover:bg-slate-900/40 hover:shadow-md ${
                        selectedSupport?.id === item.id
                          ? "border-blue-500/60 ring-2 ring-blue-500/10 shadow-sm"
                          : "border-slate-800/80"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                            item.category === "inquiry"
                              ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
                              : "bg-purple-500/10 border-purple-500/25 text-purple-400"
                          }`}>
                            {item.category === "inquiry" ? "🙋 1:1 문의" : "🛠️ 개선/개발요청"}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                            item.status === "replied"
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                          }`}>
                            {item.status === "replied" ? "답변완료" : "접수대기"}
                          </span>
                          <h3 className="text-xs md:text-sm font-black text-white truncate">
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-450 font-semibold">
                          <span className="flex items-center gap-1 font-black text-slate-200">
                            ✉️ {item.user_email}
                          </span>
                          {item.phone && (
                            <span className="flex items-center gap-1">📞 {item.phone}</span>
                          )}
                          <p className="text-[11px] text-slate-400 truncate max-w-lg mt-1 font-medium italic">
                            내용: "{item.content}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 justify-end">
                        <span className="text-[10px] font-bold text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <ChevronRight size={16} className="text-slate-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 📋 SUPPORT DETAILED PANEL */}
            <div className="lg:col-span-1">
              {selectedSupport ? (
                <div className="p-6 rounded-3xl border border-slate-800/60 bg-[#0b0f19]/80 shadow-sm space-y-6 sticky top-24">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-white">1:1 문의/제안 상세</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">상담 내용 및 피드백 회신창</p>
                    </div>
                    <button onClick={() => setSelectedSupport(null)} className="p-1 rounded hover:bg-slate-900 text-slate-500">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-350">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase">등록 이메일</span>
                      <a href={`mailto:${selectedSupport.user_email}`} className="text-blue-400 block font-bold truncate">
                        ✉️ {selectedSupport.user_email}
                      </a>
                    </div>
                    {selectedSupport.phone && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase">연락처</span>
                        <p className="text-xs font-black text-white">📞 {selectedSupport.phone}</p>
                      </div>
                    )}
                    <div className="space-y-1 pt-2 border-t border-slate-850">
                      <span className="text-[9px] text-slate-500 uppercase">상세 문의 제목 및 사유</span>
                      <p className="text-white font-black text-xs">
                        {selectedSupport.title}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase">문의 본문 내용</span>
                      <p className="p-3.5 rounded-xl bg-slate-950/40 text-[11px] leading-relaxed border border-slate-850/60 max-h-[160px] overflow-y-auto whitespace-pre-wrap text-slate-200">
                        {selectedSupport.content}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-805">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase block">관리자 공식 답변 작성</label>
                      <textarea
                        rows={6}
                        value={editingReply}
                        onChange={(e) => setEditingReply(e.target.value)}
                        placeholder="이곳에 기재한 답변 내용이 고객의 [내 문의 확인] 메뉴에 즉각 노출됩니다..."
                        className="w-full p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-xs font-semibold outline-none focus:border-blue-500 text-white placeholder-slate-650 resize-none"
                      />
                      <button
                        onClick={handleSaveSupportReply}
                        disabled={updatingId !== null}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {updatingId === selectedSupport.id ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : null}
                        답변 기입 및 회신 완료
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl border border-slate-800 border-dashed text-center bg-slate-950/20 py-24 sticky top-24">
                  <ClipboardList className="mx-auto text-slate-700" size={32} />
                  <p className="text-xs text-slate-400 font-black mt-2">1:1 문의를 선택해 주세요</p>
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* 🏁 SECTION 4: FOOTER COPYRIGHT */}
      <div className="mt-20 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-semibold">
        © {currentYear} 크리에이박스(CreAibox). All rights reserved. 본 맞춤 제작 제안서의 판권은 크리에이박스에 소속되어 있습니다.
      </div>

    </div>
  );
}
