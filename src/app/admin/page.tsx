"use client";

import Link from "next/link";
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
  Settings,
  ShieldCheck,
  ShieldAlert,
  Globe,
  type LucideIcon,
} from "lucide-react";

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
    description: "사용자 블로그 서브도메인(Brand ID) 및 독립 도메인 신청 승인, 실시간 진단 모니터링",
    href: "/admin/brands",
    icon: Globe,
    iconColor: "text-emerald-400",
  },
  {
    title: "API Gateway Vault",
    description:
      "AI · Image · Video · Voice · Search Provider Pool 통합 관리",
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
    description: "브랜드 ID 예약어, 금지어 조회 및 사용자별 도메인 배포 관리",
    href: "/admin/reserved-words",
    icon: ShieldAlert,
    iconColor: "text-red-400",
  },
];

const statCards = [
  { label: "Total Users", value: "-", tone: "text-blue-400" },
  { label: "Paid Users", value: "-", tone: "text-yellow-400" },
  { label: "Today Usage", value: "-", tone: "text-purple-400" },
  { label: "System Status", value: "NORMAL", tone: "text-emerald-400" },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <ShieldCheck className="h-10 w-10 text-blue-500" />
            Admin <span className="text-blue-500">Command</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            CreAIbox 통합 관리자 센터 · 전체 서비스 운영 현황 관리
          </p>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
              {item.label}
            </p>
            <p className={`mt-3 text-3xl font-black italic ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {adminMenus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="group rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-7 shadow-xl transition hover:border-blue-500/40 hover:bg-zinc-900"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 transition group-hover:bg-blue-500/10 ${menu.iconColor}`}
              >
                <Icon size={24} />
              </div>

              <h2 className="text-lg font-black italic text-white">
                {menu.title}
              </h2>

              <p className="mt-2 text-sm font-medium leading-6 text-zinc-500">
                {menu.description}
              </p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}