"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
  ShieldCheck,
  Mail,
  Zap,
  HelpCircle,
  ExternalLink,
  Globe,
  Check,
} from "lucide-react";

interface EmailRule {
  id: string;
  domain_name: string;
  alias_prefix: string;
  forward_to: string;
  is_active: boolean;
  created_at: string;
}

interface UserDomainOption {
  domain: string;
  type: "custom" | "subdomain";
  source: "purchased" | "connected" | "subdomain";
  isPrimary?: boolean;
}

interface EmailForwardingManagerProps {
  currentUser?: any;
  onRequireAuth?: (action?: () => void) => boolean;
}

const ALIAS_PRESETS = ["ceo", "contact", "cs", "support", "admin", "billing"];

export default function EmailForwardingManager({
  currentUser,
  onRequireAuth,
}: EmailForwardingManagerProps) {
  const [userDomains, setUserDomains] = useState<UserDomainOption[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("sotongchaeum.com");
  const [rules, setRules] = useState<EmailRule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [domainsLoading, setDomainsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newAlias, setNewAlias] = useState("");
  const [newForwardTo, setNewForwardTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDnsModal, setShowDnsModal] = useState(false);

  // 1. Fetch user's connected and purchased domains
  useEffect(() => {
    async function loadUserDomains() {
      setDomainsLoading(true);
      try {
        const res = await fetch("/api/domains/my-domains");
        const json = await res.json();
        if (json.success && Array.isArray(json.domains) && json.domains.length > 0) {
          setUserDomains(json.domains);
          // Set primary custom domain as initial selected domain if available
          const primaryCustom = json.domains.find((d: UserDomainOption) => d.type === "custom");
          if (primaryCustom) {
            setSelectedDomain(primaryCustom.domain);
          } else {
            setSelectedDomain(json.domains[0].domain);
          }
        } else {
          // Fallback preset list
          const defaults: UserDomainOption[] = [
            { domain: "sotongchaeum.com", type: "custom", source: "connected", isPrimary: true },
            { domain: "sotongchaeum.creaibox.com", type: "subdomain", source: "subdomain" },
            { domain: "creaibox.com", type: "custom", source: "connected" },
          ];
          setUserDomains(defaults);
          setSelectedDomain("sotongchaeum.com");
        }
      } catch (e) {
        setUserDomains([
          { domain: "sotongchaeum.com", type: "custom", source: "connected" },
          { domain: "creaibox.com", type: "custom", source: "connected" },
        ]);
        setSelectedDomain("sotongchaeum.com");
      } finally {
        setDomainsLoading(false);
      }
    }

    void loadUserDomains();
  }, [currentUser]);

  // 2. Fetch rules from API for selected domain
  const fetchRules = async () => {
    if (!selectedDomain) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/email-forwarding?domain=${encodeURIComponent(selectedDomain)}`);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          // 비로그인 상태는 빈 목록으로 정상 처리
          setRules([]);
          return;
        }
        throw new Error(data.error || "규칙 목록 조회 실패");
      }
      setRules(data.data || data.rules || []);
    } catch (err: any) {
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRules();
  }, [selectedDomain]);

  // 🌟 사용자가 회원가입/등록한 실제 로그인 이메일로 자동 기본값 세팅
  useEffect(() => {
    if (currentUser?.email && !newForwardTo) {
      setNewForwardTo(currentUser.email);
    }
  }, [currentUser]);

  // Create new forwarding rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onRequireAuth && !onRequireAuth()) return;

    if (!newAlias.trim() || !newForwardTo.trim()) {
      setErrorMsg("수신 주소와 전달받을 이메일을 모두 입력해주세요.");
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
          alias_prefix: newAlias.trim().toLowerCase(),
          forward_to: newForwardTo.trim().toLowerCase(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "규칙 추가 실패");
      }

      setSuccessMsg(`✅ ${newAlias.trim().toLowerCase()}@${selectedDomain} 포워딩 주소가 성공적으로 연동되었습니다.`);
      setNewAlias("");
      setShowForm(false);
      await fetchRules();
    } catch (err: any) {
      setErrorMsg(err.message || "규칙 추가 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete forwarding rule
  const handleDeleteRule = async (ruleId: string, alias: string) => {
    if (onRequireAuth && !onRequireAuth()) return;
    if (!confirm(`정말로 ${alias}@${selectedDomain} 포워딩 규칙을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await fetch("/api/email-forwarding", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ruleId,
          domain_name: selectedDomain,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "규칙 삭제 실패");
      }

      setSuccessMsg("규칙이 삭제되었습니다.");
      await fetchRules();
    } catch (err: any) {
      setErrorMsg(err.message || "삭제 실패");
    }
  };

  return (
    <div className="space-y-6">
      {/* 🌟 1. Domain Selector & Info Card */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="text-cyan-500" size={16} />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              연동 대상 내 보유 도메인 선택
            </span>
            <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {userDomains.length}개 보유 중
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            선택한 도메인으로 수신되는 모든 비즈니스 메일을 대표님 개인 메일함으로 0.01초 만에 자동 전달합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-xs cursor-pointer min-w-[220px]"
          >
            {userDomains.map((item) => (
              <option key={item.domain} value={item.domain}>
                {item.domain} {item.type === "custom" ? "👑 (독립 도메인)" : "⚡ (서브도메인)"}
              </option>
            ))}
          </select>

          <button
            onClick={() => void fetchRules()}
            className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            title="도메인 상태 새로고침"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 🌟 2. Main Forwarding Manager Card */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-2xs">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="text-cyan-500" size={18} />
                <span>[{selectedDomain}] 비즈니스 이메일 무제한 포워딩</span>
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                0원 무료
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
              <code className="text-slate-900 dark:text-white font-mono font-semibold">contact@{selectedDomain}</code>, <code className="text-slate-900 dark:text-white font-mono font-semibold">ceo@{selectedDomain}</code> 등으로 수신되는 메일을 개인 이메일(Gmail, Naver 등)로 즉시 전달합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDnsModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>SPF·DKIM 레코드</span>
            </button>

            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs shrink-0"
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              <span>{showForm ? "닫기" : "새 메일 주소 추가"}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border-b border-rose-200 dark:border-rose-900/30 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertCircle size={14} />
              {errorMsg}
            </span>
            <button onClick={() => setErrorMsg(null)} className="cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900/30 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg(null)} className="cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Create Rule Form */}
        {showForm && (
          <form onSubmit={handleCreateRule} className="p-5 sm:p-6 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                추천 빠른 별칭 선택:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALIAS_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewAlias(preset)}
                    className="px-2.5 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-700 dark:text-zinc-300 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {preset}@{selectedDomain}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                  수신 이메일 별칭 아이디
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    placeholder="ceo 또는 contact"
                    className="w-full rounded-l-md border border-r-0 border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
                  />
                  <span className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-xs text-slate-500 dark:text-zinc-400 rounded-r-md font-mono shrink-0">
                    @{selectedDomain}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                  전달받을 실제 개인 이메일 (Gmail / Naver 등)
                </label>
                <input
                  type="email"
                  value={newForwardTo}
                  onChange={(e) => setNewForwardTo(e.target.value)}
                  placeholder={currentUser?.email || "전달받을 대표님 등록 이메일"}
                  className="w-full rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black py-2 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={13} />}
                  <span>등록</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Rules Table */}
        <div className="p-0">
          <div className="px-5 py-3 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
            <span>[{selectedDomain}] 활성 포워딩 규칙 ({rules.length}개)</span>
            <button
              onClick={fetchRules}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              <span>새로고침</span>
            </button>
          </div>

          {rules.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 dark:text-zinc-500 space-y-2">
              <Mail className="mx-auto text-slate-300 dark:text-zinc-700" size={28} />
              <p><strong>{selectedDomain}</strong>에 등록된 이메일 포워딩 주소가 아직 없습니다.</p>
              <p className="text-[11px]">우측 상단 <strong>[새 메일 주소 추가]</strong> 버튼을 눌러 대표님만의 비즈니스 이메일을 만들어보세요.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-normal border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/30 text-slate-500 dark:text-zinc-400 font-semibold">
                  <th className="p-4 sm:px-6">수신 브랜드 이메일</th>
                  <th className="p-4 sm:px-6">실시간 전달 대상 (포워딩)</th>
                  <th className="p-4 sm:px-6">상태</th>
                  <th className="p-4 sm:px-6 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {rule.alias_prefix}@{rule.domain_name}
                    </td>
                    <td className="p-4 sm:px-6 font-mono text-slate-600 dark:text-zinc-300">
                      ➔ {rule.forward_to}
                    </td>
                    <td className="p-4 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        수신 대기 중 (Active)
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.alias_prefix)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer p-1"
                        title="규칙 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SPF/DKIM DNS Modal */}
      {showDnsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-zinc-800 rounded-lg p-6 max-w-lg w-full text-left space-y-4 shadow-xl relative">
            <button
              onClick={() => setShowDnsModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                이메일 보안 레코드 (SPF / DKIM / MX)
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                CreaiBox 도메인은 이메일 스팸 방지 및 안전한 수신을 위해 아래 레코드가 자동 구성됩니다.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-500 font-sans font-bold block text-[11px]">1. MX Record (수신 라우팅)</span>
                <p className="text-slate-900 dark:text-white">Priority 10: inbound-smtp.creaibox.com</p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-500 font-sans font-bold block text-[11px]">2. TXT SPF Record (스팸 차단)</span>
                <p className="text-slate-900 dark:text-white">v=spf1 include:_spf.creaibox.com ~all</p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1">
                <span className="text-slate-500 font-sans font-bold block text-[11px]">3. DMARC Policy (도용 방지)</span>
                <p className="text-slate-900 dark:text-white">v=DMARC1; p=none; sp=none</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDnsModal(false)}
                className="w-full inline-flex items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
