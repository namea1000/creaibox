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
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["jenam7720@gmail.com", "namjjang7720@gmail.com"];

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

      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
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
    </div>
  );
}