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
  status: UserStatus;
  todayUsage: number;
  totalUsage: number;
  joinedAt: string;
  lastLogin: string | null;
  adminMemo?: string;
  isWhitelisted?: boolean;
}

export default function UserManagementPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // 어드민 개별 메모를 위한 상태 관리
  const [selectedUserForMemo, setSelectedUserForMemo] = useState<UserProfile | null>(null);
  const [memoText, setMemoText] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);

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
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword)
    );
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "ADMIN").length,
      manager: users.filter((u) => u.role === "MANAGER").length,
      premium: users.filter((u) => u.role === "PAID").length,
      banned: users.filter((u) => u.status === "BANNED").length,
    };
  }, [users]);

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
    patch: Partial<Pick<UserProfile, "role" | "status">>
  ) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const nextRole = patch.role || target.role;
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
          role: nextRole,
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
            ? { ...user, role: nextRole, status: nextStatus }
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
    <div className="flex h-screen w-full overflow-hidden bg-[#05070a] font-sans text-slate-100">
      <div className="flex flex-1 overflow-hidden pt-20">

        <main className="custom-scrollbar flex-1 overflow-y-auto transition-all duration-300">
          <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
            <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
                  <ShieldCheck className="h-10 w-10 text-blue-500" />
                  Command <span className="text-blue-500">Center</span>
                </h1>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  사용자 권한 · 무료 체험 사용량 · 계정 상태 통합 관리
                </p>
              </div>

              <div className="flex w-full gap-3 lg:w-auto">
                <div className="relative w-full lg:w-auto">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="사용자 검색..."
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-6 text-sm font-bold text-white placeholder:text-zinc-700 focus:border-blue-500 focus:outline-none lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fetchUsers()}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-zinc-400 hover:text-white"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </header>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {[
                {
                  label: "Total Users",
                  value: stats.total,
                  icon: Users,
                  color: "text-blue-500",
                },
                {
                  label: "Admin",
                  value: stats.admin,
                  icon: ShieldAlert,
                  color: "text-red-500",
                },
                {
                  label: "Manager",
                  value: stats.manager,
                  icon: Briefcase,
                  color: "text-purple-500",
                },
                {
                  label: "Premium",
                  value: stats.premium,
                  icon: Crown,
                  color: "text-yellow-500",
                },
                {
                  label: "Banned",
                  value: stats.banned,
                  icon: Ban,
                  color: "text-zinc-600",
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
                                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black ${user.role === "ADMIN"
                                    ? "bg-red-500/20 text-red-500"
                                    : user.role === "MANAGER"
                                      ? "bg-purple-500/20 text-purple-500"
                                      : user.role === "PAID"
                                        ? "bg-yellow-500/20 text-yellow-500"
                                        : "bg-zinc-800 text-zinc-500"
                                    }`}
                                >
                                  {user.name[0]?.toUpperCase() || "U"}
                                </div>
                                <div>
                                  <p className="flex items-center gap-2 text-sm font-black italic text-zinc-200">
                                    {user.name}
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
                                  value={user.role}
                                  disabled={savingId === user.id}
                                  onChange={(e) =>
                                    updateUser(user.id, {
                                      role: e.target.value as UserRole,
                                    })
                                  }
                                  className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none ${user.role === "ADMIN"
                                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                                    : user.role === "MANAGER"
                                      ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                                      : user.role === "PAID"
                                        ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                        : "border-zinc-700 bg-zinc-800/50 text-zinc-400"
                                    }`}
                                >
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="MANAGER">MANAGER</option>
                                  <option value="PAID">PAID</option>
                                  <option value="FREE">FREE</option>
                                </select>
                                
                                {user.role === "ADMIN" && (
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
                                  <span>{user.role === "FREE" ? "Max 3" : "∞"}</span>
                                </div>
                                <div className="h-1 w-32 overflow-hidden rounded-full bg-zinc-800">
                                  <div
                                    className={`h-full ${user.todayUsage >= 3 && user.role === "FREE"
                                      ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                      : "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                                      }`}
                                    style={{
                                      width: `${user.role === "FREE"
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
                              <select
                                value={user.status}
                                disabled={savingId === user.id}
                                onChange={(e) =>
                                  updateUser(user.id, {
                                    status: e.target.value as UserStatus,
                                  })
                                }
                                className={`rounded-lg border px-3 py-2 text-[10px] font-black uppercase outline-none ${user.status === "ACTIVE"
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                  : "border-red-500/20 bg-red-500/10 text-red-400"
                                  }`}
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="BANNED">BANNED</option>
                              </select>
                            </td>

                            <td className="px-8 py-6 text-[11px] font-bold italic text-zinc-500">
                              {formatDate(user.joinedAt)}
                            </td>

                            <td className="px-8 py-6 text-[11px] font-bold italic text-zinc-500">
                              {formatDate(user.lastLogin)}
                            </td>

                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
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
                                <button
                                  type="button"
                                  disabled={savingId === user.id}
                                  className="rounded-xl bg-zinc-800/50 p-2.5 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-blue-500 active:scale-90 disabled:opacity-50"
                                >
                                  {savingId === user.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Settings size={16} />
                                  )}
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
          </div>

        </main>
      </div>

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