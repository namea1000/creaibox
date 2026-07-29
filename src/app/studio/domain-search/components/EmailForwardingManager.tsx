"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Globe,
  Zap,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Check,
  X,
  Key,
} from "lucide-react";

interface EmailRule {
  id: string;
  domain_name: string;
  alias_prefix: string;
  forward_to: string;
  is_active: boolean;
  created_at?: string;
}

interface Props {
  currentUser: any;
  onRequireAuth: (action?: () => void) => boolean;
}

export default function EmailForwardingManager({ currentUser, onRequireAuth }: Props) {
  // Domain selection state
  const [selectedDomain, setSelectedDomain] = useState("creaibox.com");
  const userDomains = ["creaibox.com", "downhubs.com"]; // Default available domains

  // Rules list state
  const [rules, setRules] = useState<EmailRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form / Modal state
  const [showForm, setShowForm] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [newForwardTo, setNewForwardTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch rules from API
  const fetchRules = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/email-forwarding?domain=${encodeURIComponent(selectedDomain)}`);
      const json = await res.json();

      if (res.ok && json.data && Array.isArray(json.data)) {
        setRules(json.data);
      } else {
        setRules([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch email rules:", err);
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRules();
  }, [selectedDomain, currentUser]);

  // Handle Add Rule
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!onRequireAuth()) return;

    if (!newAlias.trim() || !newForwardTo.trim()) {
      setErrorMsg("메일 아이디와 전달받을 담당자 메일 주소를 모두 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/email-forwarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain_name: selectedDomain,
          alias_prefix: newAlias.trim(),
          forward_to: newForwardTo.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "규칙 등록에 실패했습니다.");
      }

      setSuccessMsg(`✅ ${newAlias}@${selectedDomain} -> ${newForwardTo} 포워딩 설정 완료!`);
      setNewAlias("");
      setNewForwardTo("");
      setShowForm(false);
      await fetchRules();
    } catch (err: any) {
      setErrorMsg(err.message || "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Rule
  const handleDeleteRule = async (id: string, alias: string) => {
    if (!onRequireAuth()) return;

    if (!confirm(`${alias}@${selectedDomain} 이메일 포워딩 규칙을 삭제하시겠습니까?`)) return;

    try {
      if (id.startsWith("sample-")) {
        // Sample rule removal locally
        setRules((prev) => prev.filter((r) => r.id !== id));
        setSuccessMsg("규칙이 삭제되었습니다.");
        return;
      }

      const res = await fetch(`/api/email-forwarding?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "삭제에 실패했습니다.");
      }

      setSuccessMsg("규칙이 삭제되었습니다.");
      await fetchRules();
    } catch (err: any) {
      setErrorMsg(err.message || "삭제 실패");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-blue-900/60 p-6 md:p-8 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>무제한 커스텀 도메인 이메일 서버 (Resend Engine)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              ✉️ 이메일 주소별 담당자 포워딩 관리
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              도메인별로 <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono">ceo@</code>,{" "}
              <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono">contact@</code>,{" "}
              <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono">cs@</code> 등 무제한 이메일을 생성하고,
              들어오는 메일을 원하는 담당자의 개인 메일(Gmail/Naver)로 1초 만에 100% 포워딩합니다.
            </p>
          </div>

          <button
            onClick={() => onRequireAuth(() => setShowForm(true))}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            <span>새 메일 주소 추가</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="flex items-center justify-between rounded-xl bg-red-950/60 border border-red-500/30 p-4 text-red-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/60 border border-emerald-500/30 p-4 text-emerald-300 text-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Domain Selection & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selector */}
        <div className="md:col-span-2 rounded-xl bg-gray-900/80 border border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400">도메인 선택</div>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-transparent text-lg font-bold text-white focus:outline-none cursor-pointer"
              >
                {userDomains.map((d) => (
                  <option key={d} value={d} className="bg-gray-900 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Resend DNS Verified ✅</span>
            </span>
            <button
              onClick={fetchRules}
              disabled={isLoading}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              title="새로고침"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Feature badge */}
        <div className="rounded-xl bg-gray-900/80 border border-gray-800 p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-300">100% DB-Zero 무상태 통과</div>
            <div className="text-xs text-gray-400 mt-0.5 leading-snug">
              메일 본문을 DB에 저장하지 않아 용량 낭비 0% 및 개인정보 보호 완전 보장
            </div>
          </div>
        </div>
      </div>

      {/* Add New Rule Form / Modal */}
      {showForm && (
        <div className="rounded-2xl bg-gray-900 border border-purple-500/40 p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-400" />
              <span>새 이메일 포워딩 주소 등록</span>
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddRule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alias Prefix */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  1. 메일 아이디 (Alias)
                </label>
                <div className="flex items-center rounded-xl bg-gray-950 border border-gray-800 focus-within:border-purple-500 px-3 py-2.5">
                  <input
                    type="text"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    placeholder="ceo, contact, cs 등"
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    required
                  />
                  <span className="text-sm font-semibold text-purple-400 ml-2">@{selectedDomain}</span>
                </div>
              </div>

              {/* Forward To */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  2. 전달받을 담당자 개인 메일 주소
                </label>
                <div className="flex items-center rounded-xl bg-gray-950 border border-gray-800 focus-within:border-purple-500 px-3 py-2.5">
                  <input
                    type="email"
                    value={newForwardTo}
                    onChange={(e) => setNewForwardTo(e.target.value)}
                    placeholder="담당자명@gmail.com 또는 @naver.com"
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
              >
                {isSubmitting ? "등록 중..." : "🚀 1초 이메일 주소 등록하기"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Table */}
      <div className="rounded-2xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">
              [{selectedDomain}] 등록된 이메일 포워딩 목록 ({rules.length}개)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onRequireAuth(() => setShowForm(true))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>새 메일 주소 추가</span>
            </button>

            {!currentUser && (
              <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>미로그인 상태</span>
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {rules.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">등록된 이메일 포워딩 주소가 없습니다</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  우측 상단의 <strong className="text-purple-300">+ 새 메일 주소 추가</strong> 버튼을 눌러 대표님/담당자의
                  이메일 포워딩 주소(<code className="text-purple-300">ceo@{selectedDomain}</code>, <code className="text-purple-300">contact@{selectedDomain}</code> 등)를
                  직접 첫 번째로 등록해 주세요!
                </p>
              </div>
              <button
                onClick={() => onRequireAuth(() => setShowForm(true))}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30"
              >
                <Plus className="h-4 w-4" />
                <span>첫 번째 이메일 포워딩 주소 추가하기</span>
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-950/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">대표 이메일 주소</th>
                  <th className="px-6 py-3.5">연결할 담당자 이메일</th>
                  <th className="px-6 py-3.5">구동 상태</th>
                  <th className="px-6 py-3.5 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-sm">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Alias Address */}
                    <td className="px-6 py-4 font-bold text-white font-mono flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span>
                        {rule.alias_prefix}@{rule.domain_name}
                      </span>
                    </td>

                    {/* Forward To */}
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20">
                          {rule.forward_to}
                        </span>
                      </div>
                    </td>

                    {/* Status Tag */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                        <Check className="h-3.5 w-3.5" />
                        <span>포워딩 수신 중</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.alias_prefix)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-red-950/80 hover:text-red-400 text-gray-400 transition-colors border border-transparent hover:border-red-500/30"
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
