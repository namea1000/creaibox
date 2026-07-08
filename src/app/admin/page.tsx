"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiGoogle,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiYoutube,
} from "react-icons/si";
import {
  Users,
  CreditCard,
  FileText,
  Server,
  Building2,
  MessageSquare,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Globe,
  ArrowRight,
  ChevronRight,
  Database,
  Activity,
  Zap,
  DollarSign,
  BarChart3,
  PieChart,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type AdminMenu = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon | IconType;
  iconColor: string;
};

const adminMenus: AdminMenu[] = [
  {
    title: "사용자 관리",
    description: "회원 권한, 무료 체험 사용량, 계정 상태 관리",
    href: "/admin/usermanagement",
    icon: Users,
    iconColor: "text-blue-400",
  },
  {
    title: "브랜드 ID 및 도메인 관리",
    description: "블로그 도메인 신청 승인, 서브도메인 관리 및 모니터링",
    href: "/admin/brands",
    icon: Globe,
    iconColor: "text-emerald-400",
  },
  {
    title: "API Gateway Vault",
    description: "AI · Image · Video · Voice · Search API Key 통합 관리",
    href: "/admin/apivault",
    icon: Server,
    iconColor: "text-cyan-400",
  },
  {
    title: "Google 연동 관리",
    description: "OAuth, Google API, YouTube API Key 관리",
    href: "/admin/google",
    icon: SiGoogle,
    iconColor: "text-blue-400",
  },
  {
    title: "SEO 관리",
    description: "Search Console, sitemap, 색인 상태 관리",
    href: "/admin/seo",
    icon: SiGooglesearchconsole,
    iconColor: "text-emerald-400",
  },
  {
    title: "Analytics",
    description: "방문자, 유입 경로, 페이지 성과 분석",
    href: "/admin/analytics",
    icon: SiGoogleanalytics,
    iconColor: "text-orange-400",
  },
  {
    title: "YouTube 관리",
    description: "YouTube Data API, 채널/영상 분석 관리",
    href: "/admin/youtube",
    icon: SiYoutube,
    iconColor: "text-red-500",
  },
  {
    title: "결제 관리",
    description: "Stripe, 구독, 결제 상태 관리",
    href: "/admin/billing",
    icon: CreditCard,
    iconColor: "text-yellow-400",
  },
  {
    title: "콘텐츠 관리",
    description: "블로그, 발행글, 썸네일, SEO 콘텐츠 관리",
    href: "/admin/content",
    icon: FileText,
    iconColor: "text-purple-400",
  },
  {
    title: "시스템 관리",
    description: "Supabase, API, 서버 상태 모니터링",
    href: "/admin/system",
    icon: Server,
    iconColor: "text-cyan-400",
  },
  {
    title: "관리자 설정",
    description: "권한, 정책, 환경 설정 관리",
    href: "/admin/settings",
    icon: Settings,
    iconColor: "text-zinc-400",
  },
  {
    title: "예약어 및 블랙리스트 관리",
    description: "브랜드 ID 예약어, 금지어 조회 및 도메인 배포 관리",
    href: "/admin/reserved-words",
    icon: ShieldAlert,
    iconColor: "text-red-400",
  },
  {
    title: "B2B 맞춤/제휴 관리",
    description: "기업형 맞춤 제작 신청 및 광고/협업 제안 내역 상세 제어",
    href: "/admin/business",
    icon: Building2,
    iconColor: "text-amber-400",
  },
  {
    title: "AI 챗봇 이용 분석",
    description: "사용자별 챗봇 상담 히스토리 복원 및 가이드 제작 건의 제어",
    href: "/admin/chatbot",
    icon: MessageSquare,
    iconColor: "text-cyan-400",
  },
  {
    title: "고객지원 1:1 문의 관리",
    description: "플랫폼 1:1 문의 및 사이트 개선 건의 내역 확인 및 답변 관리",
    href: "/admin/inquiry",
    icon: HelpCircle,
    iconColor: "text-indigo-400",
  },
];

function formatTimeAgo(dateString?: string | null) {
  if (!dateString) return "-";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: "-",
    paidUsers: "-",
    todayUsage: "-",
    systemStatus: "NORMAL",
    paidBreakdown: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  const [vaultKeys, setVaultKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Users Data
        const usersRes = await fetch("/api/admin/users", {
          headers: {
            "x-admin-email": user.email || "",
          },
        });
        let fetchedUsers: any[] = [];
        if (usersRes.ok) {
          fetchedUsers = await usersRes.json();
          setUsers(fetchedUsers);
        }

        // 2. Fetch Vault Keys Data
        const vaultRes = await fetch("/api/admin/vault", {
          headers: {
            "x-admin-email": user.email || "",
          },
        });
        if (vaultRes.ok) {
          const keys = await vaultRes.json();
          setVaultKeys(keys);
        }

        // Calculate Stats
        const total = fetchedUsers.length;
        
        const creatorCount = fetchedUsers.filter(
          (u: any) => u.membershipLevel?.toLowerCase() === "creator"
        ).length;
        const proCount = fetchedUsers.filter(
          (u: any) => u.membershipLevel?.toLowerCase() === "pro"
        ).length;
        const businessCount = fetchedUsers.filter(
          (u: any) => u.membershipLevel?.toLowerCase() === "business"
        ).length;

        const paid = creatorCount + proCount + businessCount;
        const breakdownStr = paid > 0 
          ? `Creator ${creatorCount} · Pro ${proCount} · Biz ${businessCount}`
          : "No paid users";

        const today = fetchedUsers.reduce(
          (sum: number, u: any) => sum + Number(u.todayUsage || 0),
          0
        );

        setStats({
          totalUsers: String(total),
          paidUsers: String(paid),
          todayUsage: String(today),
          systemStatus: "NORMAL",
          paidBreakdown: breakdownStr,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, tone: "text-blue-400" },
    { 
      label: "Paid Users", 
      value: stats.paidUsers, 
      tone: "text-yellow-400",
      extra: stats.paidBreakdown 
    },
    { label: "Today Usage", value: stats.todayUsage, tone: "text-purple-400" },
    { label: "System Status", value: stats.systemStatus, tone: "text-emerald-400" },
  ];

  // Derive mini-dashboard items
  const recentActiveUsers = [...users]
    .filter((u) => u.lastLogin)
    .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
    .slice(0, 5);

  const activeVaultKeys = vaultKeys
    .filter((k) => k.provider_type !== "system")
    .slice(0, 5);

  const recentBrandIds = [...users]
    .filter((u) => u.brandId)
    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[1600px] p-6 pb-24 text-left font-sans text-slate-100">
      <header className="mb-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-black uppercase italic tracking-tighter text-white">
          <ShieldCheck className="h-7 w-7 text-blue-500" />
          Admin <span className="text-blue-500">Command</span>
        </h1>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
          CreAibox 통합 관리자 센터 · 전체 서비스 운영 현황 관리
        </p>
      </header>

      {/* Stats Cards */}
      <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-xl flex flex-col justify-between min-h-[82px]"
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {item.label}
              </p>
              <p className={`mt-1.5 text-xl font-black italic ${item.tone}`}>
                {item.value}
              </p>
            </div>
            {item.extra && (
              <p className="mt-1.5 text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                {item.extra}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Admin Menu Grid */}
      <section className="grid gap-2.5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {adminMenus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 shadow-md transition hover:border-blue-500/40 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/80 transition group-hover:bg-blue-500/10 ${menu.iconColor}`}
                >
                  <Icon size={16} />
                </div>

                <h2 className="text-xs font-black italic text-white transition group-hover:text-blue-400">
                  {menu.title}
                </h2>
              </div>

              <p className="text-[11px] font-medium leading-normal text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {menu.description}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Dynamic Mini-Dashboard Section */}
      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        
        {/* Box 1: Recent Users */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/25 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-blue-400">
              <Users size={14} />
              최근 활성 사용자
            </h3>
            <Link
              href="/admin/usermanagement"
              className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              Manage <ChevronRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/40">
            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">Loading users...</div>
            ) : recentActiveUsers.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">No active users today</div>
            ) : (
              recentActiveUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-zinc-200">{user.name}</p>
                    <p className="truncate text-[10px] text-zinc-600">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        user.membershipLevel?.toLowerCase() === "creator"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : user.membershipLevel?.toLowerCase() === "pro"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : user.membershipLevel?.toLowerCase() === "business"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : user.membershipLevel?.toLowerCase() === "admin"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {user.membershipLevel || "FREE"}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500">
                      {formatTimeAgo(user.lastLogin)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 2: API Vault Status */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/25 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-cyan-400">
              <Server size={14} />
              API Gateway Vault 상태
            </h3>
            <Link
              href="/admin/apivault"
              className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              Vault <ChevronRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/40">
            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">Loading keys...</div>
            ) : activeVaultKeys.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">No active vault keys</div>
            ) : (
              activeVaultKeys.map((key) => {
                const ratio = Math.min(100, Math.floor(((key.today_count || 0) / (key.daily_limit || 1000)) * 100));
                return (
                  <div key={key.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-zinc-200">{key.display_name}</p>
                        <p className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider">
                          {key.provider} · {key.model}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-black text-emerald-500">{key.today_count || 0}</span>
                        <span className="text-[9px] text-zinc-700 mx-0.5">/</span>
                        <span className="text-[9px] font-mono text-zinc-500">{key.daily_limit || 1000}</span>
                      </div>
                    </div>
                    {/* Compact custom progress bar */}
                    <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Box 3: Recent Subdomain Signups */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/25 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400">
              <Globe size={14} />
              최근 등록 브랜드 ID (서브도메인)
            </h3>
            <Link
              href="/admin/brands"
              className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              Brands <ChevronRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-zinc-800/40">
            {loading ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">Loading domains...</div>
            ) : recentBrandIds.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-zinc-700">No brand IDs registered yet</div>
            ) : (
              recentBrandIds.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-zinc-200">{user.name}</p>
                    <a
                      href={`https://${user.brandId}.creaibox.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[10px] text-emerald-500 font-bold hover:underline block"
                    >
                      {user.brandId}.creaibox.com
                    </a>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 shrink-0">
                    {formatDate(user.joinedAt)} 등록
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
    </div>
  );
}