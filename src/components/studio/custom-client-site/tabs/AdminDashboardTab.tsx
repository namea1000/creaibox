import React, { useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop, Clock, CheckCircle2, ExternalLink, Copy, X } from "lucide-react";
import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function AdminDashboardTab({ requireAuth, setActiveTab }: { requireAuth: (cb?: () => void) => boolean | void, setActiveTab: (tab: any) => void }) {
  const [adminRequests, setAdminRequests] = useState<any[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<any | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_site_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        setAdminRequests(data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          userNickname: d.user_nickname,
          companyName: d.company_name,
          category: d.category,
          themeColor: d.theme_color,
          features: d.features || [],
          refUrl: d.ref_url || "",
          detail: d.detail || "",
          status: d.status,
          createdAt: new Date(d.created_at).toLocaleDateString()
        })));
      }
      setIsLoading(false);
    };
    fetchRequests();
  }, [supabase]);

  return (
    <>
      <div className="space-y-8 animate-fade-in-up">
          {/* Header Summary Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-slate-900 border border-rose-500/30 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-black text-rose-300">
                  <Bot size={14} className="animate-pulse text-rose-400" />
                  <span>관리자 전용 AI 에이전트 커스텀 관제탑</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  👑 회원 커스텀 웹사이트 신청 현황 ({adminRequests.length}건)
                </h2>
                <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                  회원분들이 신청한 커스텀 제작 명세서를 한눈에 파악하세요. 각 신청 카드의{" "}
                  <strong className="text-rose-400 font-bold">[🤖 AI 에이전트 자동 제작 진행하기]</strong> 버튼을 누르면 안티그래비티 1:1 풀코드 생성 프로세스가 실행됩니다.
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-slate-400">총 신청 건수</p>
                  <p className="text-2xl font-black text-white">{adminRequests.length}건</p>
                </div>
                <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-amber-400">AI 제작 대기</p>
                  <p className="text-2xl font-black text-amber-300">
                    {adminRequests.filter((r) => r.status === "pending").length}건
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-emerald-400">구축 완료</p>
                  <p className="text-2xl font-black text-emerald-300">
                    {adminRequests.filter((r) => r.status === "completed").length}건
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setAdminFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "all"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                전체 보기 ({adminRequests.length})
              </button>
              <button
                onClick={() => setAdminFilter("pending")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "pending"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🟡 AI 제작 대기 ({adminRequests.filter((r) => r.status === "pending").length})
              </button>
              <button
                onClick={() => setAdminFilter("completed")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  adminFilter === "completed"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🟢 구축 완료 ({adminRequests.filter((r) => r.status === "completed").length})
              </button>
            </div>
          </div>

          {/* 10 Request Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminRequests
              .filter((req) => (adminFilter === "all" ? true : req.status === adminFilter))
              .map((req) => (
                <div
                  key={req.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 hover:border-slate-700 transition-all shadow-xl relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {req.category}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">{req.createdAt}</span>
                      </div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <span>{req.companyName}</span>
                        <span className="text-xs text-slate-400 font-normal">({req.userNickname})</span>
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
                          <Clock size={12} />
                          🟡 AI 제작 대기
                        </span>
                      )}
                      {req.status === "building" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          <RefreshCw size={12} className="animate-spin" />
                          ⚡ AI 에이전트 코딩중
                        </span>
                      )}
                      {req.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 size={12} />
                          🟢 구축 완료 (라이브)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Request Specs */}
                  <div className="space-y-3">
                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">🎨 희망 테마 & 컨셉:</p>
                      <p className="text-cyan-300 font-medium bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        {req.themeColor}
                      </p>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">⚙️ 선택 특수기능:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {req.features.map((f: any, i: any) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950 text-slate-300 border border-slate-800"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-bold text-slate-400">📝 상세 요구사항 (프롬프트 명세):</p>
                      <p className="text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {req.detail}
                      </p>
                    </div>

                    {req.refUrl && (
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>🔗 레퍼런스:</span>
                        <a
                          href={req.refUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {req.refUrl} <ExternalLink size={11} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Button: Trigger AI Build Command */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        requireAuth(() => {
                          setAdminRequests((prev) =>
                            prev.map((item) => (item.id === req.id ? { ...item, status: "completed" } : item))
                          );
                          setSelectedPromptModal(req);
                        });
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all cursor-pointer ${
                        req.status === "completed"
                          ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                          : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-600/20"
                      }`}
                    >
                      <Bot size={15} className="text-rose-300" />
                      <span>
                        {req.status === "completed"
                          ? "🤖 AI 에이전트 풀코드 생성 완료 (재실행)"
                          : "🤖 AI 에이전트 자동 제작 진행하기"}
                      </span>
                    </button>

                    {req.status === "completed" && (
                      <a
                        href={req.refUrl || "https://sotongchaeum.creaibox.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 px-4 py-3 text-xs font-black text-cyan-300 hover:bg-cyan-500/20 transition-all shrink-0"
                      >
                        <Eye size={13} />
                        <span>시안 미리보기</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      {selectedPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-slate-900 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-rose-400">
                <Bot size={22} className="animate-bounce" />
                <h3 className="text-lg font-black text-white">
                  안티그래비티 AI 에이전트 자동 제작 수행 완료
                </h3>
              </div>
              <button
                onClick={() => setSelectedPromptModal(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                <CheckCircle2 size={16} />
                <span>
                  신청 건 [{selectedPromptModal.companyName}]의 안티그래비티 1:1 풀코드 생성 명령이 성공적으로 인식되었습니다!
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 flex items-center justify-between">
                  <span>💻 안티그래비티 AI 에이전트 실행 명령 프롬프트 (자동 생성됨)</span>
                  <button
                    onClick={() => {
                      const text = `안티그래비티 AI 파트너 생성 명령:\n유저 [${selectedPromptModal.companyName}]의 커스텀 웹사이트 100% 풀코드를 생성하라.\n- 업종: ${selectedPromptModal.category}\n- 테마: ${selectedPromptModal.themeColor}\n- 필수 기능: ${selectedPromptModal.features.join(", ")}\n- 상세: ${selectedPromptModal.detail}`;
                      navigator.clipboard.writeText(text);
                      setCopiedPrompt(true);
                      setTimeout(() => setCopiedPrompt(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-cyan-400 hover:underline cursor-pointer"
                  >
                    {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedPrompt ? "복사 완료!" : "명령어 복사하기"}</span>
                  </button>
                </label>

                <textarea
                  readOnly
                  rows={6}
                  value={`안티그래비티 AI 파트너 생성 명령:\n유저 [${selectedPromptModal.companyName}]의 커스텀 웹사이트 100% 풀코드를 생성하라.\n- 업종: ${selectedPromptModal.category}\n- 테마: ${selectedPromptModal.themeColor}\n- 필수 기능: ${selectedPromptModal.features.join(", ")}\n- 상세: ${selectedPromptModal.detail}`}
                  className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono font-bold text-cyan-300 leading-relaxed outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <a
                href={selectedPromptModal.refUrl || "https://sotongchaeum.creaibox.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3.5 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
              >
                <Eye size={15} /> <span>생성된 라이브 사이트 확인하기</span>
              </a>
              <button
                onClick={() => {
                  setSelectedPromptModal(null);
                  setActiveTab("manage");
                }}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-xs font-black text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                완료 & 내 커스텀 관리로 이동
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
