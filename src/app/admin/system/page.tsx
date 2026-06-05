"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  ShieldCheck,
  Server,
  RefreshCw,
  ExternalLink,
  Cpu,
  Users,
  Clock3,
  BarChart3,
  KeyRound,
  Bug,
  Wallet,
  Cloud,
} from "lucide-react";

import {
  SiGoogle,
  SiYoutube,
  SiOpenai,
} from "react-icons/si";

const systemCards = [
  {
    label: "System Status",
    value: "NORMAL",
    icon: Activity,
    color: "text-emerald-400",
  },
  {
    label: "Database",
    value: "ONLINE",
    icon: Database,
    color: "text-blue-400",
  },
  {
    label: "Storage",
    value: "READY",
    icon: HardDrive,
    color: "text-purple-400",
  },
  {
    label: "Security",
    value: "SAFE",
    icon: ShieldCheck,
    color: "text-yellow-400",
  },
];

const services = [
  {
    name: "Supabase",
    status: "ONLINE",
    icon: Database,
    color: "text-emerald-400",
  },
  {
    name: "Gemini API",
    status: "READY",
    icon: Cpu,
    color: "text-blue-400",
  },
  {
    name: "OpenAI API",
    status: "READY",
    icon: SiOpenai,
    color: "text-green-400",
  },
  {
    name: "Google OAuth",
    status: "READY",
    icon: SiGoogle,
    color: "text-red-400",
  },
  {
    name: "YouTube API",
    status: "READY",
    icon: SiYoutube,
    color: "text-red-500",
  },
  {
    name: "Storage",
    status: "ONLINE",
    icon: HardDrive,
    color: "text-cyan-400",
  },
];

const monitoringModules = [
  "DB 상태 모니터링",
  "Storage 사용량",
  "API Vault 상태",
  "OAuth 상태",
  "Google API 상태",
  "AI 모델 상태",
  "사용량 추적",
  "비용 추적",
  "Cron 작업 상태",
  "로그 수집",
  "에러 추적",
  "보안 상태",
];

export default function SystemAdminPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <Server className="h-10 w-10 text-cyan-400" />
            System <span className="text-cyan-400">Center</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Infrastructure · API · Database · Security · Monitoring
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="https://vercel.com/dashboard"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            Vercel
            <ExternalLink size={14} />
          </Link>

          <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white">
            <RefreshCw size={14} />
            새로고침
          </button>
        </div>
      </header>

      {/* KPI */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {systemCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-800/80 ${card.color}`}
              >
                <Icon size={20} />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {card.label}
              </p>

              <p className={`mt-2 text-3xl font-black italic ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Service Status */}
      <section className="mb-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            서비스 상태
          </h2>

          <div className="mt-6 space-y-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#080b11] px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={service.color}
                    />
                    <span className="text-sm font-bold text-zinc-300">
                      {service.name}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-black uppercase ${service.color}`}
                  >
                    {service.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <h2 className="text-xl font-black italic text-white">
            핵심 시스템
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "Supabase Database",
              "Supabase Storage",
              "Supabase Auth",
              "Google OAuth",
              "YouTube API",
              "AI Providers",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm font-bold text-zinc-400"
              >
                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring */}
      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
        <h2 className="text-xl font-black italic text-white">
          운영 모니터링
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {monitoringModules.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
                <Activity size={18} />
              </div>

              <h3 className="text-sm font-black text-white">
                {item}
              </h3>

              <p className="mt-2 text-xs text-zinc-600">
                실데이터 연결 예정
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "API Usage",
            icon: KeyRound,
          },
          {
            title: "Infrastructure",
            icon: Cloud,
          },
          {
            title: "Cost Monitoring",
            icon: Wallet,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
                <Icon size={18} />
              </div>

              <h3 className="text-lg font-black italic text-white">
                {item.title}
              </h3>

              <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
                데이터 연결 예정
              </div>
            </div>
          );
        })}
      </section>

      {/* System Logs */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "User Activity",
            icon: Users,
          },
          {
            title: "Error Logs",
            icon: Bug,
          },
          {
            title: "Cron Jobs",
            icon: Clock3,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
                <Icon size={18} />
              </div>

              <h3 className="text-lg font-black italic text-white">
                {item.title}
              </h3>

              <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
                로그 연결 예정
              </div>
            </div>
          );
        })}
      </section>

      {/* AI Insight */}
      <section className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />

          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              System AI Insight
            </h2>

            <div className="mt-4 space-y-3">
              {[
                "비정상 API 사용 감지",
                "DB 부하 예측",
                "Storage 사용량 예측",
                "비용 증가 예측",
                "오류 패턴 분석",
                "자동 복구 추천",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-yellow-100/70"
                >
                  <CheckCircle2
                    size={16}
                    className="text-yellow-400"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}