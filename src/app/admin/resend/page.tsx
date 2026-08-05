"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Globe,
  Send,
  Inbox,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

interface ResendSummary {
  totalDomains: number;
  totalEmailRules: number;
  totalReceived: number;
  totalSent: number;
}

interface DomainGroup {
  domainName: string;
  rulesCount: number;
  status?: string;
  rules: {
    id: string;
    emailAddress: string;
    aliasPrefix: string;
    forwardTo: string;
    isActive: boolean;
    createdAt: string;
    ownerEmail: string | null;
    ownerNickname: string | null;
  }[];
}

export default function ResendAdminMonitoringPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ResendSummary>({
    totalDomains: 0,
    totalEmailRules: 0,
    totalReceived: 0,
    totalSent: 0,
  });
  const [domains, setDomains] = useState<DomainGroup[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<any[]>([]);
  const [sentEmails, setSentEmails] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"domains" | "received" | "sent">("domains");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch("/api/admin/resend");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Resend 모니터링 수집 실패");
      }

      setSummary(json.summary || { totalDomains: 0, totalEmailRules: 0, totalReceived: 0, totalSent: 0 });
      setDomains(json.domains || []);
      setReceivedEmails(json.receivedEmails || []);
      setSentEmails(json.sentEmails || []);
    } catch (err: any) {
      console.error("Resend admin data fetch error:", err);
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // 필터링
  const filteredDomains = domains.filter(
    (d) =>
      d.domainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.rules.some(
        (r) =>
          r.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.forwardTo.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredReceived = receivedEmails.filter(
    (e) =>
      (e.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.from || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(e.to) ? e.to.join(" ") : e.to || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSent = sentEmails.filter(
    (e) =>
      (e.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.from || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(e.to) ? e.to.join(" ") : e.to || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 min-h-screen text-zinc-100">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest">
            <ShieldCheck size={14} /> ADMIN COMMAND CENTER
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Mail className="text-blue-500" /> Resend 이메일 & 도메인 모니터링
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            CreAibox 커스텀 도메인별 이메일 계정 생성 현황 및 실시간 메일 발/수신 통계를 통합 관리합니다.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-700/80 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:border-zinc-500 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-400" : ""} />
          {refreshing ? "새로고침 중..." : "실시간 동기화"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-300 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Top KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Domains */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0f1219]/80 p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">등록 커스텀 도메인</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{loading ? "..." : summary.totalDomains}</span>
            <span className="text-xs text-zinc-500 font-medium">개 도메인 연동</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" /> Resend DNS 검증 완료
          </div>
        </div>

        {/* Card 2: Total Email Accounts (Rules) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0f1219]/80 p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">이메일 별칭 계정</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{loading ? "..." : summary.totalEmailRules}</span>
            <span className="text-xs text-zinc-500 font-medium">개 생성/포워딩 중</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
            <User size={12} className="text-purple-400" /> 유저별 별칭 계정 포함
          </div>
        </div>

        {/* Card 3: Total Received (Inbound) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0f1219]/80 p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">총 수신 메일 (Inbound)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Inbox size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{loading ? "..." : summary.totalReceived}</span>
            <span className="text-xs text-zinc-500 font-medium">건 통지 수신</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
            <ArrowDownLeft size={12} className="text-emerald-400" /> 무상태 실시간 포워딩
          </div>
        </div>

        {/* Card 4: Total Sent (Outbound) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#0f1219]/80 p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">총 발송 메일 (Outbound)</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Send size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{loading ? "..." : summary.totalSent}</span>
            <span className="text-xs text-zinc-500 font-medium">건 발송 완료</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
            <ArrowUpRight size={12} className="text-cyan-400" /> Resend API 발송
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Section with Tabs & Search */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0c0e14] overflow-hidden shadow-xl">
        {/* Navigation Tabs & Search Toolbar */}
        <div className="border-b border-zinc-800 p-4 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0f1219]">
          <div className="flex items-center gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab("domains")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "domains"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Globe size={14} /> 도메인 & 이메일 계정 ({domains.length})
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "received"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Inbox size={14} /> 수신 메일 이력 ({receivedEmails.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "sent"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Send size={14} /> 발송 메일 이력 ({sentEmails.length})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="도메인, 이메일, 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tab 1: Domains & Email Rules */}
        {activeTab === "domains" && (
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="py-12 text-center text-sm font-bold text-zinc-500">
                Resend 도메인 및 이메일 계정 목록 로딩 중...
              </div>
            ) : filteredDomains.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                조회된 도메인 및 이메일 계정이 없습니다.
              </div>
            ) : (
              filteredDomains.map((dom) => (
                <div
                  key={dom.domainName}
                  className="rounded-xl border border-zinc-800/80 bg-[#12151f]/60 p-5 space-y-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/60 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <Globe size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          {dom.domainName}
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 uppercase">
                            <CheckCircle2 size={10} /> Active & Verified
                          </span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                          생성된 이메일 별칭 계정: <strong className="text-blue-400">{dom.rulesCount}개</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rules Subtable */}
                  {dom.rules.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-2">
                      이 도메인에 등록된 이메일 별칭 계정이 아직 없습니다. (기본 fallback으로 전송됨)
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-zinc-950/60">
                            <th className="py-2.5 px-3">생성된 이메일 계정</th>
                            <th className="py-2.5 px-3">전달 목적지 (Forward To)</th>
                            <th className="py-2.5 px-3">소유 유저</th>
                            <th className="py-2.5 px-3">생성 일시</th>
                            <th className="py-2.5 px-3">상태</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40">
                          {dom.rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-zinc-900/40 transition-colors">
                              <td className="py-3 px-3 font-black text-white flex items-center gap-2">
                                <Mail size={13} className="text-purple-400 shrink-0" />
                                {rule.emailAddress}
                              </td>
                              <td className="py-3 px-3 font-semibold text-zinc-300">
                                {rule.forwardTo}
                              </td>
                              <td className="py-3 px-3 text-zinc-400">
                                {rule.ownerEmail ? (
                                  <span>
                                    {rule.ownerNickname || "유저"} ({rule.ownerEmail})
                                  </span>
                                ) : (
                                  <span className="text-zinc-500">시스템 기본</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-zinc-500">{formatDate(rule.createdAt)}</td>
                              <td className="py-3 px-3">
                                {rule.isActive ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                    ● 포워딩 활성
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                                    ○ 비활성
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Received Inbound Emails */}
        {activeTab === "received" && (
          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-sm font-bold text-zinc-500">
                수신 이메일 이력 로딩 중...
              </div>
            ) : filteredReceived.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                수신된 이메일 이력이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-zinc-950">
                      <th className="py-3 px-4">원발신자 (From)</th>
                      <th className="py-3 px-4">수신주소 (To)</th>
                      <th className="py-3 px-4">이메일 제목 (Subject)</th>
                      <th className="py-3 px-4">수신 시각</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredReceived.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white max-w-[220px] truncate">
                          {item.from}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-blue-400 max-w-[200px] truncate">
                          {Array.isArray(item.to) ? item.to.join(", ") : item.to}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-zinc-200">
                          {item.subject || "(제목 없음)"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500">{formatDate(item.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Sent Outbound Emails */}
        {activeTab === "sent" && (
          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center text-sm font-bold text-zinc-500">
                발송 이메일 이력 로딩 중...
              </div>
            ) : filteredSent.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                발송된 이메일 이력이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-zinc-950">
                      <th className="py-3 px-4">발신주소 (From)</th>
                      <th className="py-3 px-4">수신자 (To)</th>
                      <th className="py-3 px-4">이메일 제목 (Subject)</th>
                      <th className="py-3 px-4">발송 시각</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredSent.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white max-w-[220px] truncate">
                          {item.from}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-cyan-400 max-w-[200px] truncate">
                          {Array.isArray(item.to) ? item.to.join(", ") : item.to}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-zinc-200">
                          {item.subject || "(제목 없음)"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500">{formatDate(item.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
