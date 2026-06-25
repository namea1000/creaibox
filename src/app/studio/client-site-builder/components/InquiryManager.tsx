"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageSquare, Calendar, Phone, CheckCircle, RefreshCw, ChevronRight, FileText, Loader2 } from "lucide-react";

interface InquiryManagerProps {
  siteId: string;
}

interface InquiryPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  extra_data: any;
}

export default function InquiryManager({ siteId }: InquiryManagerProps) {
  const [inquiries, setInquiries] = useState<InquiryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryPost | null>(null);
  
  // Edit State
  const [status, setStatus] = useState("접수");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_posts")
        .select("*")
        .eq("site_id", siteId)
        .eq("post_type", "inquiry")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [siteId]);

  useEffect(() => {
    if (selectedInquiry) {
      setStatus(selectedInquiry.extra_data?.status || "접수");
      setMemo(selectedInquiry.extra_data?.manager_memo || "");
    }
  }, [selectedInquiry]);

  const handleSaveStatus = async () => {
    if (!selectedInquiry) return;
    setSaving(true);

    const updatedExtraData = {
      ...(selectedInquiry.extra_data || {}),
      status,
      manager_memo: memo
    };

    try {
      const { error } = await supabase
        .from("site_posts")
        .update({
          extra_data: updatedExtraData
        })
        .eq("id", selectedInquiry.id);

      if (error) throw error;

      // Update local state
      setInquiries(inquiries.map(inq => inq.id === selectedInquiry.id ? { ...inq, extra_data: updatedExtraData } : inq));
      setSelectedInquiry({ ...selectedInquiry, extra_data: updatedExtraData });
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
      alert("상태 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (statusStr: string) => {
    const s = statusStr || "접수";
    if (s === "완료") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (s === "상담중") return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Inquiry List Table */}
      <div className="lg:col-span-8 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-emerald-500" size={20} />
            <span>고객 문의 및 상담 관리</span>
          </h2>
          <button
            onClick={fetchInquiries}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="새로고침"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
            <span className="text-xs font-bold">상담 문의를 불러오는 중입니다...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300">신규 문의 없음</h3>
            <p className="text-xs text-slate-400 mt-1">아직 접수된 상담 예약 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">작성일</th>
                  <th className="py-3 px-4">신청자</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">상태</th>
                  <th className="py-3 px-4 text-right">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
                {inquiries.map((inq) => {
                  const itemStatus = inq.extra_data?.status || "접수";
                  const dateStr = new Date(inq.created_at).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors ${
                        selectedInquiry?.id === inq.id ? "bg-slate-50 dark:bg-slate-800/50" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-1 border-0">
                        <Calendar size={12} />
                        <span>{dateStr}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 dark:text-white border-0">{inq.author_name}</td>
                      <td className="py-3.5 px-4 text-slate-500 border-0">{inq.extra_data?.phone || "연락처 없음"}</td>
                      <td className="py-3.5 px-4 border-0">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(itemStatus)}`}>
                          {itemStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right border-0">
                        <ChevronRight className="inline-block text-slate-300 dark:text-slate-700" size={16} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Panel */}
      <div className="lg:col-span-4 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col">
        {selectedInquiry ? (
          <div className="flex-grow flex flex-col justify-between animate-fade-in">
            <div>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block">상담 문의 상세</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedInquiry.author_name} 님
                </h3>
              </div>

              {/* Lead details list */}
              <div className="space-y-4 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6">
                {Object.entries(selectedInquiry.extra_data || {}).map(([key, val]) => {
                  if (["status", "manager_memo"].includes(key)) return null;

                  const labels: Record<string, string> = {
                    name: "성함",
                    phone: "연락처",
                    email: "이메일",
                    grade: "학년/대상",
                    subject: "희망 과목",
                    guests: "인원",
                    date: "예약일시",
                    message: "문의사항"
                  };

                  return (
                    <div key={key} className="border-b border-slate-50 dark:border-slate-800/40 pb-2">
                      <span className="block text-[10px] text-slate-400 font-semibold mb-0.5">{labels[key] || key}</span>
                      <span className="text-slate-900 dark:text-white whitespace-pre-wrap">{String(val)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Status Update */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <label className="block text-xs font-bold text-slate-400 mb-2">처리 상태 변경</label>
                <div className="flex gap-2 mb-4">
                  {["접수", "상담중", "완료"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        status === s
                          ? "bg-[var(--primary)] text-white border-transparent"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Manager Comments */}
                <label className="block text-xs font-bold text-slate-400 mb-2">상담 관리자 메모</label>
                <textarea
                  rows={4}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="예: 2시 유선상담 완료. 내일 학부모 동반 방문 예약 진행 예정."
                  className="w-full text-xs text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={handleSaveStatus}
              disabled={saving}
              className="w-full mt-6 flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  <span>메모 및 처리상태 저장</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-center py-20">
            <FileText size={40} className="text-slate-200 dark:text-slate-800 mb-4" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-400">선택된 문의가 없습니다</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              좌측 리스트에서 상세 조회할 문의글을 선택해 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
