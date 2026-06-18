"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Globe, CheckCircle2, XCircle, Trash2, Plus, 
  Search, RefreshCw, AlertCircle, Ban, CalendarDays, AlertTriangle 
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const ADMIN_EMAILS = [
  "creaiboxofficial@gmail.com",
  "jenam7720@gmail.com",
  "namjjang7720@gmail.com",
  "admin@creaibox.com",
];

interface PendingRequest {
  id: string;
  nickname: string;
  email?: string;
  brand_id?: string;
  requested_brand_id: string;
  brand_id_status: string;
  brand_id_rejection_reason?: string;
  extra_configs?: any;
  updated_at: string;
}

interface ExpandedRequestRow {
  id: string;
  nickname: string;
  brandId: string;
  brandStatus: string;
  brandRejectionReason?: string;
  customDomain: string;
  requestedCustomDomain: string;
  customStatus: string;
  customRejectionReason?: string;
  updated_at: string;
  isPrimary: boolean;
  isAdditional: boolean;
  isRequested: boolean;
}

interface ReservedBrand {
  id: string;
  brand_id: string;
  reason: string;
  created_at: string;
}

export default function AdminBrandsPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"requests" | "blacklist">("requests");

  // Requests states
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<any>({});
  const [isDiagnosing, setIsDiagnosing] = useState<string | null>(null);
  const [approvingBrandId, setApprovingBrandId] = useState<string | null>(null);

  // Blacklist states
  const [blacklist, setBlacklist] = useState<ReservedBrand[]>([]);
  const [newReservedId, setNewReservedId] = useState("");
  const [newReservedReason, setNewReservedReason] = useState("");
  const [isAddingBlacklist, setIsAddingBlacklist] = useState(false);
  
  // Rejection modal states
  const [rejectingItem, setRejectingItem] = useState<{
    userId: string;
    brandId: string;
    type: "subdomain" | "customDomain";
    value: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // 1. Authenticate user
  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!user) {
          router.replace("/login");
          return;
        }

        if (ADMIN_EMAILS.includes(user.email || "")) {
          setIsAdmin(true);
          await Promise.all([fetchRequests(), fetchBlacklist()]);
        } else {
          setIsAdmin(false);
          alert("❌ 관리자 권한이 없습니다.");
          router.replace("/studio");
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    void checkUser();
    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  // 2. Fetch subdomain and custom domain requests
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nickname, brand_id, requested_brand_id, brand_id_status, extra_configs, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const filtered = (data || []).filter((r: any) => {
        const hasBrandId = !!r.brand_id;
        const hasRequestedBrand = !!r.requested_brand_id;
        const hasAdditionalBrands = Array.isArray(r.extra_configs?.brand_ids) && r.extra_configs.brand_ids.length > 0;
        const hasCustomDomain = !!r.extra_configs?.custom_domain || !!r.extra_configs?.requested_custom_domain;
        
        let hasFlatCustomDomain = false;
        if (r.extra_configs) {
          for (const key of Object.keys(r.extra_configs)) {
            if (key.startsWith("custom_domain_") || key.startsWith("requested_custom_domain_")) {
              if (r.extra_configs[key]) {
                hasFlatCustomDomain = true;
                break;
              }
            }
          }
        }

        return hasBrandId || hasRequestedBrand || hasAdditionalBrands || hasCustomDomain || hasFlatCustomDomain;
      });

      setRequests(filtered as PendingRequest[]);
    } catch (e) {
      console.error("Fetch requests failed:", e);
    }
  };

  // 3. Fetch blacklist (reserved IDs)
  const fetchBlacklist = async () => {
    try {
      const { data, error } = await supabase
        .from("reserved_brand_ids")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlacklist((data as ReservedBrand[]) || []);
    } catch (e) {
      console.error("Fetch blacklist failed:", e);
    }
  };

  // 4. Action: Approve Request (GA4 Web Data Stream Auto Creation via Backend API)
  const handleApprove = async (e: React.MouseEvent, userId: string, requestedId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (approvingBrandId) return; // Prevent concurrent approvals

    setApprovingBrandId(requestedId);

    try {
      const response = await fetch("/api/admin/brands/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, requestedId }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMsg = result.error || "브랜드 승인 요청에 실패했습니다.";
        if (result.details && typeof result.details === "object") {
          errorMsg += `\n상세 정보: ${JSON.stringify(result.details)}`;
        } else if (result.details) {
          errorMsg += `\n상세 정보: ${result.details}`;
        }
        throw new Error(errorMsg);
      }

      alert(`✅ '${requestedId}' 브랜드 ID 승인 및 GA4 데이터 스트림 자동 연동이 완료되었습니다.\n측정 ID: ${result.measurementId}`);
      await fetchRequests();
    } catch (e: any) {
      console.error("Approval error:", e);
      alert(`❌ 승인 실패: ${e.message}`);
    } finally {
      setApprovingBrandId(null);
    }
  };

  // 5. Action: Reject Request (Trigger Rejection Modal)
  const handleReject = (e: React.MouseEvent, userId: string, requestedId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setRejectionReason("");
    setRejectingItem({
      userId,
      brandId: requestedId,
      type: "subdomain",
      value: `${requestedId}.creaibox.com`,
    });
  };

  // 5.1 Action: Cancel Approval (승인/반려 취소하고 대기 상태로 변경)
  const handleCancelApprove = async (e: React.MouseEvent, userId: string, requestedId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: profile, error: fetchErr } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", userId)
        .single();
      
      if (fetchErr) throw fetchErr;

      let primary_brand_id = profile.brand_id || "";
      let brand_ids = profile.extra_configs?.brand_ids || [];

      if (primary_brand_id === requestedId) {
        if (brand_ids.length > 0) {
          primary_brand_id = brand_ids[0];
          brand_ids = brand_ids.slice(1);
        } else {
          primary_brand_id = "";
        }
      } else {
        brand_ids = brand_ids.filter((bid: string) => bid !== requestedId);
      }

      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        brand_ids: brand_ids
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          brand_id: primary_brand_id || null,
          brand_id_status: "PENDING",
          requested_brand_id: requestedId,
          brand_id_rejection_reason: null,
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      alert(`✅ '${requestedId}' 브랜드 ID 승인이 취소되어 대기 상태로 변경되었습니다.`);
      await fetchRequests();
    } catch (e: any) {
      alert(`승인 취소 실패: ${e.message}`);
    }
  };

  // 4-2. Action: Approve Custom Domain
  const handleApproveCustomDomain = async (e: React.MouseEvent, userId: string, brandId: string, requestedDomain: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: profile, error: fetchErr } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", userId)
        .single();
      
      if (fetchErr) throw fetchErr;

      const isPrimary = profile.brand_id === brandId;

      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_${brandId}`]: requestedDomain,
        [`requested_custom_domain_${brandId}`]: null,
        [`custom_domain_status_${brandId}`]: "APPROVED",
        [`custom_domain_rejection_reason_${brandId}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain = requestedDomain;
        nextExtraConfigs.requested_custom_domain = null;
        nextExtraConfigs.custom_domain_status = "APPROVED";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      alert(`✅ '${requestedDomain}' 독립 도메인 연결 승인이 완료되었습니다.`);
      await fetchRequests();
    } catch (e: any) {
      alert(`승인 실패: ${e.message}`);
    }
  };

  // 5-2. Action: Reject Custom Domain (Trigger Rejection Modal)
  const handleRejectCustomDomain = (e: React.MouseEvent, userId: string, brandId: string, requestedDomain: string) => {
    e.preventDefault();
    e.stopPropagation();
    setRejectionReason("");
    setRejectingItem({
      userId,
      brandId,
      type: "customDomain",
      value: requestedDomain,
    });
  };

  // Submit Rejection from Modal
  const submitRejection = async () => {
    if (!rejectingItem) return;
    const { userId, brandId, type, value } = rejectingItem;
    const reason = rejectionReason.trim();
    if (!reason) {
      alert("반려 사유는 필수 입력 사항입니다.");
      return;
    }

    try {
      if (type === "subdomain") {
        const { error } = await supabase
          .from("profiles")
          .update({
            brand_id_status: "REJECTED",
            brand_id_rejection_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) throw error;
        alert(`❌ '${brandId}' 브랜드 ID 신청이 반려 처리되었습니다.`);
      } else {
        const { data: profile, error: fetchErr } = await supabase
          .from("profiles")
          .select("brand_id, extra_configs")
          .eq("id", userId)
          .single();
        
        if (fetchErr) throw fetchErr;

        const isPrimary = profile.brand_id === brandId;
        const nextExtraConfigs = {
          ...(profile.extra_configs || {}),
          [`custom_domain_status_${brandId}`]: "REJECTED",
          [`custom_domain_rejection_reason_${brandId}`]: reason,
        };

        if (isPrimary) {
          nextExtraConfigs.custom_domain_status = "REJECTED";
          nextExtraConfigs.custom_domain_rejection_reason = reason;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            extra_configs: nextExtraConfigs,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) throw error;
        alert(`❌ '${value}' 독립 도메인 신청이 반려 처리되었습니다.`);
      }

      setRejectingItem(null);
      setRejectionReason("");
      await fetchRequests();
    } catch (e: any) {
      alert(`반려 처리 실패: ${e.message}`);
    }
  };

  // 5.2-2 Action: Cancel Custom Domain Approval
  const handleCancelCustomDomain = async (e: React.MouseEvent, userId: string, brandId: string, domain: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: profile, error: fetchErr } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", userId)
        .single();
      
      if (fetchErr) throw fetchErr;

      const isPrimary = profile.brand_id === brandId;

      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_${brandId}`]: null,
        [`requested_custom_domain_${brandId}`]: domain,
        [`custom_domain_status_${brandId}`]: "PENDING",
        [`custom_domain_rejection_reason_${brandId}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain = null;
        nextExtraConfigs.requested_custom_domain = domain;
        nextExtraConfigs.custom_domain_status = "PENDING";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      alert(`✅ '${domain}' 독립 도메인 승인이 취소되어 대기 상태로 변경되었습니다.`);
      await fetchRequests();
    } catch (e: any) {
      alert(`승인 취소 실패: ${e.message}`);
    }
  };

  // Real-time DNS, SSL, and routing validation diagnostics
  const runDiagnostics = async (domain: string, targetBrand: string) => {
    setIsDiagnosing(domain);
    const result = {
      dns: "checking",
      ssl: "checking",
      routing: "checking",
      cnameTarget: "",
      error: "",
    };

    try {
      // 1. Check CNAME via Cloudflare DoH API
      const dnsRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=CNAME`, {
        headers: { accept: "application/dns-json" },
      });
      const dnsJson = await dnsRes.json();
      
      const cnameAnswer = dnsJson.Answer?.find((a: any) => a.type === 5);
      if (cnameAnswer) {
        result.cnameTarget = cnameAnswer.data.replace(/\.$/, "");
        if (result.cnameTarget.toLowerCase().includes("creaibox.com") || result.cnameTarget.toLowerCase().includes(targetBrand.toLowerCase())) {
          result.dns = "success";
        } else {
          result.dns = "mismatch";
        }
      } else {
        result.dns = "missing";
      }

      // 2. Test SSL & Routing via our custom diagnostics endpoint
      try {
        const diagRes = await fetch(`https://${domain}/.well-known/creaibox-diagnostics`);
        if (diagRes.ok) {
          const diagJson = await diagRes.json();
          result.ssl = "success";
          if (diagJson.brandId === targetBrand) {
            result.routing = "success";
          } else {
            result.routing = "mismatch";
          }
        } else {
          result.ssl = "failed";
          result.routing = "failed";
        }
      } catch (err) {
        // Fallback check in case CORS is still blocked or certificate is not fully trusted
        try {
          await fetch(`https://${domain}`, { mode: "no-cors" });
          result.ssl = "success";
          result.routing = "success";
        } catch (e) {
          result.ssl = "failed";
          result.routing = "failed";
        }
      }
    } catch (e: any) {
      result.error = e.message;
    } finally {
      setDiagnosticResult((prev: any) => ({
        ...prev,
        [domain]: result,
      }));
      setIsDiagnosing(null);
    }
  };

  // 6. Action: Add Blacklist Item
  const handleAddReserved = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newReservedId.trim().toLowerCase();
    if (!cleanId) return;

    if (!/^[a-z0-9]{2,15}$/.test(cleanId)) {
      alert("브랜드 ID는 영문 소문자와 숫자 조합 2~15자만 가능합니다.");
      return;
    }

    setIsAddingBlacklist(true);
    try {
      const { error } = await supabase
        .from("reserved_brand_ids")
        .insert({
          brand_id: cleanId,
          reason: newReservedReason.trim() || "관리자 예약어",
        });

      if (error) throw error;

      alert(`✅ '${cleanId}' 예약어가 등록되었습니다.`);
      setNewReservedId("");
      setNewReservedReason("");
      await fetchBlacklist();
    } catch (e: any) {
      alert(`등록 실패: ${e.message}`);
    } finally {
      setIsAddingBlacklist(false);
    }
  };

  // 7. Action: Delete Blacklist Item
  const handleDeleteReserved = async (id: string, brandId: string) => {
    if (!confirm(`예약어 '${brandId}'을(를) 삭제하시겠습니까?`)) return;

    try {
      const { error } = await supabase
        .from("reserved_brand_ids")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      await fetchBlacklist();
    } catch (e: any) {
      alert(`삭제 실패: ${e.message}`);
    }
  };

  const expandedRequests = useMemo(() => {
    const rows: ExpandedRequestRow[] = [];

    requests.forEach((req) => {
      // 1. Primary brand
      if (req.brand_id) {
        const bid = req.brand_id;
        const customDomain = req.extra_configs?.["custom_domain_" + bid] || req.extra_configs?.custom_domain || "";
        const reqCustomDomain = req.extra_configs?.["requested_custom_domain_" + bid] || req.extra_configs?.requested_custom_domain || "";
        const customStatus = req.extra_configs?.["custom_domain_status_" + bid] || req.extra_configs?.custom_domain_status || "NONE";
        const customRejectionReason = req.extra_configs?.["custom_domain_rejection_reason_" + bid] || req.extra_configs?.custom_domain_rejection_reason || "";

        rows.push({
          id: req.id,
          nickname: req.nickname,
          brandId: bid,
          brandStatus: "APPROVED",
          customDomain,
          requestedCustomDomain: reqCustomDomain,
          customStatus,
          customRejectionReason,
          updated_at: req.updated_at,
          isPrimary: true,
          isAdditional: false,
          isRequested: false,
        });
      }

      // 2. Additional approved brands
      const additionalBrands = req.extra_configs?.brand_ids || [];
      additionalBrands.forEach((bid: string) => {
        const customDomain = req.extra_configs?.["custom_domain_" + bid] || "";
        const reqCustomDomain = req.extra_configs?.["requested_custom_domain_" + bid] || "";
        const customStatus = req.extra_configs?.["custom_domain_status_" + bid] || "NONE";
        const customRejectionReason = req.extra_configs?.["custom_domain_rejection_reason_" + bid] || "";

        rows.push({
          id: req.id,
          nickname: req.nickname,
          brandId: bid,
          brandStatus: "APPROVED",
          customDomain,
          requestedCustomDomain: reqCustomDomain,
          customStatus,
          customRejectionReason,
          updated_at: req.updated_at,
          isPrimary: false,
          isAdditional: true,
          isRequested: false,
        });
      });

      // 3. Pending or Rejected brand request
      if (req.requested_brand_id && (req.brand_id_status === "PENDING" || req.brand_id_status === "REJECTED")) {
        const bid = req.requested_brand_id;
        const customDomain = req.extra_configs?.["custom_domain_" + bid] || "";
        const reqCustomDomain = req.extra_configs?.["requested_custom_domain_" + bid] || "";
        const customStatus = req.extra_configs?.["custom_domain_status_" + bid] || "NONE";
        const customRejectionReason = req.extra_configs?.["custom_domain_rejection_reason_" + bid] || "";

        rows.push({
          id: req.id,
          nickname: req.nickname,
          brandId: bid,
          brandStatus: req.brand_id_status,
          brandRejectionReason: req.brand_id_rejection_reason,
          customDomain,
          requestedCustomDomain: reqCustomDomain,
          customStatus,
          customRejectionReason,
          updated_at: req.updated_at,
          isPrimary: false,
          isAdditional: false,
          isRequested: true,
        });
      }
    });

    return rows;
  }, [requests]);

  const searchedRows = useMemo(() => {
    if (!searchQuery.trim()) return expandedRequests;
    const q = searchQuery.toLowerCase();
    return expandedRequests.filter(row => {
      const nick = (row.nickname || "").toLowerCase();
      const bid = (row.brandId || "").toLowerCase();
      const customDom = (row.customDomain || "").toLowerCase();
      const reqCustomDom = (row.requestedCustomDomain || "").toLowerCase();
      return nick.includes(q) || bid.includes(q) || customDom.includes(q) || reqCustomDom.includes(q);
    });
  }, [expandedRequests, searchQuery]);

  const filteredRequests = searchedRows;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
          <span className="text-sm font-black uppercase tracking-widest italic">LOADING DATA...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12 font-sans text-white">
      <div className="space-y-8">
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 flex items-center gap-1.5">
              <ShieldCheck size={12} /> Admin Operations
            </p>
            <h1 className="text-3xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
              브랜드 ID 및 도메인 관리
            </h1>
            <p className="text-xs font-bold text-zinc-550">
              사용자의 블로그 서브도메인(Brand ID) 신청을 검토하고 예약어 블랙리스트를 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsLoading(true);
                await Promise.all([fetchRequests(), fetchBlacklist()]);
                setIsLoading(false);
              }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-900">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "requests"
                ? "border-blue-500 text-blue-400 bg-blue-500/5 font-black"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            신청 내역 검토 ({expandedRequests.filter(row => row.brandStatus === "PENDING" || row.customStatus === "PENDING").length})
          </button>
          <button
            onClick={() => setActiveTab("blacklist")}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "blacklist"
                ? "border-blue-500 text-blue-400 bg-blue-500/5 font-black"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            시스템 예약어 관리 ({blacklist.length})
          </button>
        </div>

        {/* Content Panel: Requests */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="사용자 닉네임 또는 신청 도메인 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 pl-11 pr-6 py-3.5 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-700"
              />
            </div>

            {(() => {
              if (filteredRequests.length === 0) {
                return (
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 px-8 py-20 text-center space-y-3">
                    <p className="text-sm font-black text-zinc-400">등록된 신청 내역이 없습니다.</p>
                    <p className="text-[11px] font-bold text-zinc-600">
                      사용자가 마이페이지 또는 스튜디오 블로그 설정에서 브랜드 ID 또는 독립 도메인 매핑을 신청하면 여기에 표시됩니다.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h2 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                      <Globe size={16} className="text-blue-400" /> 브랜드 ID 서브도메인 및 독립 도메인 (Custom Domain) 연결 심사 및 진단 모니터링 ({filteredRequests.length})
                    </h2>
                    <div className="overflow-hidden rounded-[24px] border border-zinc-900 bg-zinc-900/10">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                            <th className="px-6 py-4">신청 사용자</th>
                            <th className="px-6 py-4">브랜드 ID 서브도메인</th>
                            <th className="px-6 py-4">독립 도메인 (Custom Domain)</th>
                            <th className="px-6 py-4">실시간 진단 상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRequests.map((req) => {
                            const brandId = req.brandId;
                            const brandStatus = req.brandStatus;
                            const customStatus = req.customStatus;
                            const customDomain = req.requestedCustomDomain || req.customDomain;
                            const diag = diagnosticResult[customDomain];
                            const isChecking = isDiagnosing === customDomain;

                            return (
                              <tr 
                                key={`${req.id}-${brandId}`} 
                                className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all text-xs font-bold text-zinc-300"
                              >
                                {/* 신청 사용자 */}
                                <td className="px-6 py-5">
                                  <div className="flex flex-col">
                                    <span className="text-white font-black">{req.nickname}</span>
                                    <span className="text-[10px] text-zinc-500">{req.id}</span>
                                  </div>
                                </td>

                                {/* 브랜드 ID 서브도메인 */}
                                <td className="px-6 py-5">
                                  {brandStatus === "NONE" ? (
                                    <span className="text-zinc-600 italic">미신청</span>
                                  ) : (
                                    <div className="space-y-2 text-left">
                                      <div className="flex items-center gap-1.5 font-mono text-white font-black italic">
                                        <Globe size={13} className="text-blue-400" />
                                        {brandId}.creaibox.com
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        {brandStatus === "PENDING" && (
                                          <>
                                            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-black text-amber-400">
                                              PENDING
                                            </span>
                                            <button
                                              type="button"
                                              disabled={approvingBrandId !== null}
                                              onClick={(e) => handleApprove(e, req.id, brandId)}
                                              className={`inline-flex items-center gap-0.5 rounded-lg border px-2 py-1 text-[9px] font-black transition-colors ${
                                                approvingBrandId === brandId
                                                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse"
                                                  : "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 disabled:opacity-40"
                                              }`}
                                            >
                                              {approvingBrandId === brandId ? "승인 중..." : "승인"}
                                            </button>
                                            <button
                                              type="button"
                                              disabled={approvingBrandId !== null}
                                              onClick={(e) => handleReject(e, req.id, brandId)}
                                              className="inline-flex items-center gap-0.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2 py-1 text-[9px] font-black text-red-400 transition-colors disabled:opacity-40"
                                            >
                                              반려
                                            </button>
                                          </>
                                        )}
                                        {brandStatus === "APPROVED" && (
                                          <>
                                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                                              승인됨
                                            </span>
                                            <button
                                              type="button"
                                              onClick={(e) => handleCancelApprove(e, req.id, brandId)}
                                              className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[9px] font-black text-zinc-350 transition-colors hover:text-white"
                                            >
                                              승인 취소
                                            </button>
                                          </>
                                        )}
                                        {brandStatus === "REJECTED" && (
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-md">
                                                반려됨
                                              </span>
                                              <button
                                                type="button"
                                                onClick={(e) => handleCancelApprove(e, req.id, brandId)}
                                                className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[9px] font-black text-zinc-350 transition-colors hover:text-white"
                                              >
                                                대기로 변경
                                              </button>
                                            </div>
                                            {req.brandRejectionReason && (
                                              <p className="text-[9px] text-red-400 max-w-[180px] leading-tight">
                                                반려 사유: {req.brandRejectionReason}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* 독립 도메인 (Custom Domain) */}
                                <td className="px-6 py-5">
                                  {customStatus === "NONE" || !customDomain ? (
                                    <span className="text-zinc-600 italic">미신청</span>
                                  ) : (
                                    <div className="space-y-2 text-left">
                                      <div className="flex items-center gap-1.5 font-mono text-white font-black italic">
                                        <Globe size={13} className="text-emerald-400" />
                                        {customDomain}
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        {customStatus === "PENDING" && (
                                          <>
                                            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-black text-amber-400">
                                              PENDING
                                            </span>
                                            <button
                                              type="button"
                                              onClick={(e) => handleApproveCustomDomain(e, req.id, brandId, customDomain)}
                                              className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2 py-1 text-[9px] font-black text-emerald-400 transition-colors"
                                            >
                                              승인
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => handleRejectCustomDomain(e, req.id, brandId, customDomain)}
                                              className="inline-flex items-center gap-0.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2 py-1 text-[9px] font-black text-red-400 transition-colors"
                                            >
                                              반려
                                            </button>
                                          </>
                                        )}
                                        {customStatus === "APPROVED" && (
                                          <>
                                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                                              승인됨
                                            </span>
                                            <button
                                              type="button"
                                              onClick={(e) => handleCancelCustomDomain(e, req.id, brandId, customDomain)}
                                              className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[9px] font-black text-zinc-355 transition-colors hover:text-white"
                                            >
                                              승인 취소
                                            </button>
                                          </>
                                        )}
                                        {customStatus === "REJECTED" && (
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-md">
                                                반려됨
                                              </span>
                                              <button
                                                type="button"
                                                onClick={(e) => handleCancelCustomDomain(e, req.id, brandId, customDomain)}
                                                className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[9px] font-black text-zinc-355 transition-colors hover:text-white"
                                              >
                                                대기로 변경
                                              </button>
                                            </div>
                                            {req.customRejectionReason && (
                                              <p className="text-[9px] text-red-400 max-w-[180px] leading-tight">
                                                반려 사유: {req.customRejectionReason}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* 실시간 진단 상태 */}
                                <td className="px-6 py-5">
                                  {customDomain ? (
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => runDiagnostics(customDomain, brandId)}
                                          disabled={isChecking || !customDomain}
                                          className="inline-flex items-center gap-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-[10px] font-black text-zinc-300 transition-colors disabled:opacity-50"
                                        >
                                          {isChecking ? (
                                            <>
                                              <RefreshCw size={10} className="animate-spin" /> 진단 중...
                                            </>
                                          ) : (
                                            <>
                                              <RefreshCw size={10} /> 진단 실행
                                            </>
                                          )}
                                        </button>
                                      </div>
                                      
                                      {diag && (
                                        <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-900 max-w-xs font-mono text-[10px] leading-relaxed text-left">
                                          <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-1">
                                            <span className="text-zinc-500 text-[9px]">CNAME 대상:</span>
                                            <span className="text-zinc-300 truncate max-w-[150px]" title={diag.cnameTarget || "없음"}>
                                              {diag.cnameTarget || "없음"}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-zinc-500 text-[9px]">DNS 레코드:</span>
                                            {diag.dns === "success" && (
                                              <span className="text-emerald-400 font-bold">정상 연결됨</span>
                                            )}
                                            {diag.dns === "mismatch" && (
                                              <span className="text-amber-400 font-bold">대상 불일치</span>
                                            )}
                                            {diag.dns === "missing" && (
                                              <span className="text-red-400 font-bold">레코드 미발견</span>
                                            )}
                                            {diag.dns === "checking" && (
                                              <span className="text-zinc-500 animate-pulse">조회 중...</span>
                                            )}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-zinc-500 text-[9px]">보안 SSL:</span>
                                            {diag.ssl === "success" && (
                                              <span className="text-emerald-400 font-bold">HTTPS 정상</span>
                                            )}
                                            {diag.ssl === "failed" && (
                                              <span className="text-red-400 font-bold">연결 실패/미인증</span>
                                            )}
                                            {diag.ssl === "checking" && (
                                              <span className="text-zinc-500 animate-pulse">테스트 중...</span>
                                            )}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-zinc-500 text-[9px]">미들웨어 라우팅:</span>
                                            {diag.routing === "success" && (
                                              <span className="text-emerald-400 font-bold">정상 작동</span>
                                            )}
                                            {diag.routing === "mismatch" && (
                                              <span className="text-amber-400 font-bold">대상 불일치</span>
                                            )}
                                            {diag.routing === "failed" && (
                                              <span className="text-red-400 font-bold">접속 대기</span>
                                            )}
                                            {diag.routing === "checking" && (
                                              <span className="text-zinc-500 animate-pulse">테스트 중...</span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-zinc-655">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Content Panel: Blacklist */}
        {activeTab === "blacklist" && (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
            {/* Left Side: Add Reservation Form */}
            <form 
              onSubmit={handleAddReserved}
              className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-6"
            >
              <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                <Ban size={18} className="text-red-400" /> 새 예약어 등록
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Brand ID (서브도메인)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newReservedId}
                      onChange={(e) => setNewReservedId(e.target.value)}
                      placeholder="예: apple, admin, support"
                      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 pl-5 pr-28 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700">
                      .creaibox.com
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    지정 사유
                  </label>
                  <input
                    type="text"
                    value={newReservedReason}
                    onChange={(e) => setNewReservedReason(e.target.value)}
                    placeholder="예: 서비스 공식 도메인 보호"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingBlacklist}
                className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.15)] flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> 예약 도메인 추가
              </button>

              <div className="rounded-2xl border border-blue-500/10 bg-blue-600/5 p-4 text-[10px] font-bold text-zinc-500 leading-relaxed space-y-1">
                <p className="text-blue-400 flex items-center gap-1 font-black">
                  <AlertCircle size={12} /> 예약어가 작동하는 원리
                </p>
                <p>
                  등록된 예약어는 일반 사용자가 마이페이지에서 브랜드 ID로 조회하거나 신청하려고 할 때 검사되어 사용이 즉시 제한됩니다.
                </p>
              </div>
            </form>

            {/* Right Side: Blacklist View Table */}
            <div className="space-y-4">
              {blacklist.length === 0 ? (
                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 px-8 py-20 text-center space-y-3">
                  <p className="text-sm font-black text-zinc-400">등록된 예약어가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[32px] border border-zinc-900 bg-zinc-900/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        <th className="px-6 py-4">제한 서브도메인</th>
                        <th className="px-6 py-4">사유 및 설명</th>
                        <th className="px-6 py-4">등록일</th>
                        <th className="px-6 py-4 text-right">삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blacklist.map((item) => (
                        <tr 
                          key={item.id} 
                          className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all text-xs font-bold text-zinc-300"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-red-400 font-black">{item.brand_id}.creaibox.com</span>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {item.reason}
                          </td>
                          <td className="px-6 py-4 text-zinc-500 text-[11px]">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteReserved(item.id, item.brand_id)}
                              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* 🌟 Custom Rejection Reason Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[32px] border border-zinc-800 bg-[#0b0e14] p-8 shadow-2xl text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-1.5">
                <AlertTriangle size={12} /> 신청 반려 심사
              </span>
              <h3 className="text-xl font-black text-white italic uppercase">
                반려 사유 입력
              </h3>
              <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                대상: <span className="font-mono text-zinc-300 font-black italic">{rejectingItem.value}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                반려 사유 (사용자에게 노출됩니다)
              </label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="예: 이미 등록된 도메인이거나, DNS 설정이 정상적으로 이루어지지 않았습니다. 설정을 확인해 주시기 바랍니다."
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold text-white outline-none focus:border-red-500 transition-colors resize-none placeholder:text-zinc-700 leading-relaxed"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingItem(null);
                  setRejectionReason("");
                }}
                className="flex-1 rounded-2xl border border-zinc-850 bg-zinc-900 hover:bg-zinc-800 py-4 text-xs font-black text-zinc-400 hover:text-white transition-all font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitRejection}
                className="flex-1 rounded-2xl bg-red-600 hover:bg-red-500 py-4 text-xs font-black text-white transition-all shadow-[0_4px_12px_rgba(220,38,38,0.2)] font-bold"
              >
                반려 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
