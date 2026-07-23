"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  Ban,
  Settings,
  Crown,
  Briefcase,
  Loader2,
  RefreshCw,
  MessageSquare,
  Star,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type UserRole = "ADMIN" | "MANAGER" | "PAID" | "FREE";
type UserStatus = "ACTIVE" | "BANNED";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  membershipLevel: string;
  status: UserStatus;
  todayUsage: number;
  totalUsage: number;
  joinedAt: string;
  lastLogin: string | null;
  adminMemo?: string;
  isWhitelisted?: boolean;
  isManualGrant?: boolean;
  grantReason?: string;
  grantExpiresAt?: string | null;
}

export default function UserManagementPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "PAID" | "VIP">("ALL");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // 어드민 개별 메모를 위한 상태 관리
  const [selectedUserForMemo, setSelectedUserForMemo] = useState<UserProfile | null>(null);
  const [memoText, setMemoText] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);

  // VIP 수동 무상 부여 모달 상태 관리
  const [selectedUserForVip, setSelectedUserForVip] = useState<UserProfile | null>(null);
  const [vipForm, setVipForm] = useState({
    isManualGrant: false,
    membershipLevel: "pro",
    grantReason: "",
  });
  const [savingVip, setSavingVip] = useState(false);

  const fetchUsers = useCallback(
    async (email?: string) => {
      try {
        setLoading(true);

        const targetEmail = email || adminEmail;
        if (!targetEmail) throw new Error("관리자 이메일 확인 실패");

        const res = await fetch("/api/admin/users", {
          headers: {
            "x-admin-email": targetEmail,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "사용자 목록 로드 실패");
        }

        setUsers(data || []);
      } catch (err: any) {
        alert(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [adminEmail]
  );

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        alert("⚠️ 로그인이 필요합니다.");
        router.replace("/");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (error || !profile || profile.role !== "ADMIN") {
        alert("⚠️ 슈퍼 어드민 전용 구역입니다.");
        router.replace("/");
        return;
      }

      const email = user.email || "";
      setAdminEmail(email);
      await fetchUsers(email);
    };

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [supabase, router, fetchUsers]);

  const filteredUsers = useMemo(() => {
    let result = users;

    if (filterTab === "VIP") {
      result = result.filter((u) => u.isManualGrant);
    } else if (filterTab === "PAID") {
      result = result.filter(
        (u) =>
          !u.isManualGrant &&
          (u.membershipLevel || "").toLowerCase() !== "free" &&
          (u.membershipLevel || "").toLowerCase() !== "admin"
      );
    }

    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return result;

    return result.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword) ||
        (user.grantReason || "").toLowerCase().includes(keyword)
    );
  }, [users, searchTerm, filterTab]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => (u.membershipLevel || "").toLowerCase() === "admin").length,
      pro: users.filter((u) =>
        ["pro", "premier", "business"].includes((u.membershipLevel || "").toLowerCase())
      ).length,
      creator: users.filter((u) => (u.membershipLevel || "").toLowerCase() === "creator").length,
      free: users.filter((u) => (u.membershipLevel || "").toLowerCase() === "free").length,
      vip: users.filter((u) => u.isManualGrant).length,
      banned: users.filter((u) => u.status === "BANNED").length,
    };
  }, [users]);

  // VIP 수동 무상 부여 모달 열기
  const openVipModal = (user: UserProfile) => {
    setSelectedUserForVip(user);
    setVipForm({
      isManualGrant: user.isManualGrant || false,
      membershipLevel: user.membershipLevel || "pro",
      grantReason: user.grantReason || "",
    });
  };

  // VIP 수동 무상 부여 저장 핸들러
  const handleSaveVipGrant = async () => {
    if (!selectedUserForVip) return;
    setSavingVip(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: selectedUserForVip.id,
          isManualGrant: vipForm.isManualGrant,
          membershipLevel: vipForm.membershipLevel,
          grantReason: vipForm.grantReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "VIP 수동 부여 저장 실패");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForVip.id
            ? {
                ...u,
                isManualGrant: vipForm.isManualGrant,
                membershipLevel: vipForm.membershipLevel,
                grantReason: vipForm.grantReason,
                role:
                  vipForm.membershipLevel === "admin"
                    ? "ADMIN"
                    : vipForm.membershipLevel === "free"
                    ? "FREE"
                    : "PAID",
              }
            : u
        )
      );

      alert("⭐ VIP 수동 무상 부여 설정이 성공적으로 저장되었습니다!");
      setSelectedUserForVip(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingVip(false);
    }
  };

  const toggleWhitelist = async (user: UserProfile) => {
    const isAdding = !user.isWhitelisted;
    setSavingId(user.id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          addToWhitelist: isAdding ? true : undefined,
          removeFromWhitelist: !isAdding ? true : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "화이트리스트 처리 실패");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isWhitelisted: isAdding } : u
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const updateUser = async (
    userId: string,
    patch: Partial<Pick<UserProfile, "membershipLevel" | "status">>
  ) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const nextMembershipLevel = patch.membershipLevel || target.membershipLevel || "free";
    const nextStatus = patch.status || target.status;

    setSavingId(userId);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: userId,
          membershipLevel: nextMembershipLevel,
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "사용자 정보 수정 실패");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                membershipLevel: nextMembershipLevel,
                status: nextStatus,
                role:
                  nextMembershipLevel === "admin"
                    ? "ADMIN"
                    : nextMembershipLevel === "free"
                    ? "FREE"
                    : "PAID",
              }
            : user
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  };

  // 메모 모달 열기
  const openMemoModal = (user: UserProfile) => {
    setSelectedUserForMemo(user);
    setMemoText(user.adminMemo || "");
  };

  // 메모 저장 핸들러
  const handleSaveMemo = async () => {
    if (!selectedUserForMemo) return;
    setSavingMemo(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: selectedUserForMemo.id,
          adminMemo: memoText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "메모 저장 실패");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForMemo.id ? { ...u, adminMemo: memoText } : u
        )
      );
      setSelectedUserForMemo(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingMemo(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("ko-KR");
  };

  return (
    <div className="mx-auto max-w-[1600px] p-6 pb-24 text-left font-sans text-slate-100">
      <header className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black uppercase italic tracking-tighter text-white">
            <ShieldCheck className="h-7 w-7 text-blue-500" />
            Command <span className="text-blue-500">Center</span>
          </h1>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            사용자 권한 · 무료 체험 사용량 · 계정 상태 통합 관리
          </p>
        </div>

              <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                {/* 탭 구분 필터 */}
                <div className="flex rounded-2xl border border-zinc-800 bg-zinc-900/80 p-1.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setFilterTab("ALL")}
                    className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                      filterTab === "ALL"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    👥 전체 ({stats.total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("PAID")}
                    className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                      filterTab === "PAID"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    💳 정기 결제 ({users.length - stats.vip - stats.admin})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTab("VIP")}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all ${
                      filterTab === "VIP"
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                        : "text-amber-500/80 hover:text-amber-400"
                    }`}
                  >
                    <Star size={13} className="fill-amber-500" /> ⭐ VIP 수동 무상 ({stats.vip})
                  </button>
                </div>

                <div className="relative w-full lg:w-auto">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="사용자 검색 (이름, 이메일, 사유)..."
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-6 text-sm font-bold text-white placeholder:text-zinc-700 focus:border-blue-500 focus:outline-none lg:w-[260px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fetchUsers()}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-400 hover:text-white"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </header>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  label: "Total Users",
                  value: stats.total,
                  icon: Users,
                  color: "text-blue-500",
                },
                {
                  label: "VIP Manual Grant",
                  value: stats.vip,
                  icon: Star,
                  color: "text-amber-400",
                },
                {
                  label: "Admin",
                  value: stats.admin,
                  icon: ShieldAlert,
                  color: "text-red-500",
                },
                {
                  label: "Pro / Business",
                  value: stats.pro,
                  icon: Crown,
                  color: "text-yellow-500",
                },
                {
                  label: "Creator",
                  value: stats.creator,
                  icon: Briefcase,
                  color: "text-purple-500",
                },
                {
                  label: "Free Trial",
                  value: stats.free,
                  icon: Users,
                  color: "text-zinc-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-4 rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 ${stat.color}`}
                  >
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-black italic tracking-tighter text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex min-h-[360px] items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={42} />
                  </div>
                ) : (
                  <table className="w-full min-w-[1200px] text-left">
                    <thead>
                      <tr className="border-b border-zinc-800/50 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <th className="px-8 py-5">Identity</th>
                        <th className="px-8 py-5">Access Level</th>
                        <th className="px-8 py-5">Trial Usage</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Joined</th>
                        <th className="px-8 py-5">Last Login</th>
                        <th className="px-8 py-5 text-right">Settings</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/30">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-8 py-20 text-center text-xs font-black uppercase tracking-widest text-zinc-600"
                          >
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="group transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black ${
                                    user.isManualGrant
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      : (user.membershipLevel || "").toLowerCase() === "admin"
                                      ? "bg-red-500/20 text-red-500"
                                      : (user.membershipLevel || "").toLowerCase() === "creator"
                                      ? "bg-purple-500/20 text-purple-500"
                                      : ((user.membershipLevel || "").toLowerCase() === "pro" || (user.membershipLevel || "").toLowerCase() === "business" || (user.membershipLevel || "").toLowerCase() === "premier")
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "bg-zinc-800 text-zinc-500"
                                  }`}
                                >
                                  {user.isManualGrant ? "⭐" : user.name[0]?.toUpperCase() || "U"}
                                </div>
                                <div>
                                  <p className="flex items-center gap-2 text-sm font-black italic text-zinc-200">
                                    {user.name}
                                    {user.isManualGrant && (
                                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold not-italic text-amber-400">
                                        ⭐ 무상 부여 ({user.grantReason || "VIP"})
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] font-medium tracking-tight text-zinc-600">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-2">
                                <select
                                  value={user.membershipLevel || "free"}
                                  disabled={savingId === user.id}
                                  onChange={(e) =>
                                    updateUser(user.id, {
                                      membershipLevel: e.target.value,
                                    })
                                  }
                                  className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none ${
                                    (user.membershipLevel || "").toLowerCase() === "admin"
                                      ? "border-red-500/20 bg-red-500/10 text-red-400"
                                      : (user.membershipLevel || "").toLowerCase() === "premier"
                                      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                      : (user.membershipLevel || "").toLowerCase() === "pro"
                                      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                      : (user.membershipLevel || "").toLowerCase() === "business"
                                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                      : (user.membershipLevel || "").toLowerCase() === "creator"
                                      ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400"
                                  }`}
                                >
                                  <option value="free">FREE TRIAL</option>
                                  <option value="creator">CREATOR</option>
                                  <option value="pro">PRO</option>
                                  <option value="premier">PREMIER</option>
                                  <option value="business">BUSINESS</option>
                                  <option value="admin">ADMIN</option>
                                </select>

                                {(user.membershipLevel || "").toLowerCase() === "admin" && (
                                  <button
                                    type="button"
                                    disabled={savingId === user.id}
                                    onClick={() => toggleWhitelist(user)}
                                    className={`w-fit rounded-md px-2 py-1 text-[8px] font-black uppercase tracking-wider transition-all border active:scale-95 ${
                                      user.isWhitelisted
                                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                        : "border-rose-500/25 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 animate-pulse"
                                    }`}
                                  >
                                    {user.isWhitelisted ? "● 승인 완료" : "⚠️ 승인 대기"}
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <div className="flex flex-col gap-1.5">
                                <div className="flex w-32 justify-between text-[9px] font-black uppercase italic text-zinc-600">
                                  <span>{user.todayUsage} Units</span>
                                  <span>{(user.membershipLevel || "").toLowerCase() === "free" ? "Max 3" : "∞"}</span>
                                </div>
                                <div className="h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
                                  <div
                                    className={`h-full ${
                                      user.todayUsage >= 3 && (user.membershipLevel || "").toLowerCase() === "free"
                                        ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                        : "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                                    }`}
                                    style={{
                                      width: `${
                                        (user.membershipLevel || "").toLowerCase() === "free"
                                          ? Math.min((user.todayUsage / 3) * 100, 100)
                                          : Math.min((user.todayUsage / 100) * 100, 100)
                                      }%`,
                                    }}
                                  />
                                </div>
                                <p className="text-[9px] font-bold text-zinc-700">
                                  Total {user.totalUsage}
                                </p>
                              </div>
                            </td>

                            <td className="px-8 py-6">
                              <span
                                className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                  user.status === "ACTIVE"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>

                            <td className="px-8 py-6 text-[11px] font-bold text-zinc-500">
                              {formatDate(user.joinedAt)}
                            </td>

                            <td className="px-8 py-6 text-[11px] font-bold text-zinc-500">
                              {formatDate(user.lastLogin)}
                            </td>

                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openVipModal(user)}
                                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all active:scale-95 border ${
                                    user.isManualGrant
                                      ? "border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                                      : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:bg-zinc-700 hover:text-amber-400"
                                  }`}
                                  title="VIP/지인 수동 무상 부여 설정"
                                >
                                  <Star size={14} className={user.isManualGrant ? "fill-amber-400 text-amber-400" : ""} />
                                  <span>{user.isManualGrant ? "VIP 전용" : "VIP 설정"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openMemoModal(user)}
                                  className={`rounded-xl p-2.5 transition-all active:scale-90 border ${
                                    user.adminMemo
                                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                                      : "bg-zinc-800/50 text-zinc-500 border-transparent hover:bg-zinc-700 hover:text-zinc-300"
                                  }`}
                                  title={user.adminMemo ? "메모 내용: " + user.adminMemo : "메모 작성"}
                                >
                                  <MessageSquare size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <footer className="mt-16 pb-10 text-center text-[10px] font-black uppercase italic tracking-[0.4em] text-zinc-800">
              Strategic Hierarchy Management — Core System Admin
            </footer>

      {/* ⭐ VIP 수동 무상 부여 모달 */}
      {selectedUserForVip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-amber-500/30 bg-[#0d111a] shadow-2xl">
            <header className="border-b border-zinc-800/60 bg-amber-500/10 px-6 py-5">
              <h3 className="flex items-center gap-2.5 text-base font-black text-amber-400">
                <Star className="fill-amber-400" size={20} />
                ⭐ VIP / 지인 수동 무상 부여 설정
              </h3>
              <p className="mt-1 text-[10px] font-bold text-zinc-400">
                {selectedUserForVip.name} ({selectedUserForVip.email}) 님의 플랜을 유료 결제 없이 수동 부여합니다.
              </p>
            </header>

            <div className="p-6 space-y-6">
              {/* 스위치: 수동 부여 활성화 여부 */}
              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div>
                  <p className="text-xs font-black text-white">무상 부여 (자동 결제 제외)</p>
                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    체크 시 정기 결제 크론에서 자동 제외되어 매월 결제 청구되지 않습니다.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={vipForm.isManualGrant}
                  onChange={(e) => setVipForm({ ...vipForm, isManualGrant: e.target.checked })}
                  className="h-5 w-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* 요금제 선택 */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  부여할 요금제 선택 (Membership Level)
                </label>
                <select
                  value={vipForm.membershipLevel}
                  onChange={(e) => setVipForm({ ...vipForm, membershipLevel: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-white outline-none focus:border-amber-500"
                >
                  <option value="creator">CREATOR PLAN (9,900원 상당 무상)</option>
                  <option value="pro">PRO PLAN (19,900원 상당 무상)</option>
                  <option value="premier">PREMIER PLAN (29,900원 상당 무상 - 추천)</option>
                  <option value="business">BUSINESS PLAN (기업형 무상)</option>
                  <option value="free">FREE PLAN (기본 무료로 복원)</option>
                </select>
              </div>

              {/* 부여 사유 입력 */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  부여 사유 / 대리인 메모 (관리자 전용)
                </label>
                <input
                  type="text"
                  value={vipForm.grantReason}
                  onChange={(e) => setVipForm({ ...vipForm, grantReason: e.target.value })}
                  placeholder="예: 지인 (이동은 대표님 추천), VIP 파트너, 마케팅 협찬, 임직원"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-white placeholder:text-zinc-700 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <footer className="border-t border-zinc-800/60 bg-zinc-900/20 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedUserForVip(null)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-black text-zinc-400 hover:text-white transition"
              >
                취소
              </button>
              <button
                type="button"
                disabled={savingVip}
                onClick={handleSaveVipGrant}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-xs font-black text-black hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {savingVip ? (
                  <Loader2 size={14} className="animate-spin text-black" />
                ) : (
                  "⭐ VIP 무상 부여 저장"
                )}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Admin Memo Modal */}
      {selectedUserForMemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-zinc-800 bg-[#0d111a] shadow-2xl">
            <header className="border-b border-zinc-800/60 bg-zinc-900/30 px-6 py-5">
              <h3 className="flex items-center gap-2.5 text-sm font-black text-white">
                <MessageSquare className="text-blue-500" size={18} />
                어드민 개별 메모
              </h3>
              <p className="mt-1 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                {selectedUserForMemo.name} ({selectedUserForMemo.email}) 님을 위한 비공개 기록
              </p>
            </header>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                  메모 내용 (나만 볼 수 있음)
                </label>
                <textarea
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="지인에 대한 특이사항, 등급 조정 이유, 관리 정보 등을 기록하세요..."
                  className="w-full h-40 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs font-bold text-white placeholder:text-zinc-700 focus:border-blue-500 focus:outline-none resize-none transition duration-150 custom-scrollbar"
                />
              </div>
            </div>

            <footer className="border-t border-zinc-800/60 bg-zinc-900/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedUserForMemo(null)}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-black text-zinc-400 hover:text-white transition"
              >
                취소
              </button>
              <button
                type="button"
                disabled={savingMemo}
                onClick={handleSaveMemo}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-black text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/15 disabled:opacity-50"
              >
                {savingMemo ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "저장하기"
                )}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}