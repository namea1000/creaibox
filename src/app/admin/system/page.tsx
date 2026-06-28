"use client";

import React, { useState } from "react";
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
  const [cronSyncing, setCronSyncing] = useState(false);
  const [cronResult, setCronResult] = useState<any>(null);
  const [cronError, setCronError] = useState<string | null>(null);
  const [cronActive, setCronActive] = useState<boolean>(true);

  React.useEffect(() => {
    fetchCronStatus();
  }, []);

  const fetchCronStatus = async () => {
    try {
      const res = await fetch("/api/admin/system/settings?key=cron_trending_status");
      if (res.ok) {
        const data = await res.json();
        if (data && data.value) {
          setCronActive(data.value.active !== false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cron status settings:", err);
    }
  };

  const handleToggleCronActive = async (targetState: boolean) => {
    try {
      const res = await fetch("/api/admin/system/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "cron_trending_status",
          value: { active: targetState }
        })
      });
      if (res.ok) {
        setCronActive(targetState);
        // Reset execution feedback on toggles
        setCronResult(null);
        setCronError(null);
      }
    } catch (err) {
      console.error("Failed to toggle cron active state:", err);
    }
  };

  const handleTriggerCron = async () => {
    setCronSyncing(true);
    setCronResult(null);
    setCronError(null);
    try {
      const res = await fetch("/api/cron/sync-trending");
      if (!res.ok) {
        throw new Error("스케줄러 강제 구동 요청이 실패했습니다.");
      }
      const data = await res.json();
      setCronResult(data);
    } catch (err: any) {
      setCronError(err.message || "에러가 발생했습니다.");
    } finally {
      setCronSyncing(false);
    }
  };

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
        {/* User Activity */}
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
            <Users size={18} />
          </div>

          <h3 className="text-lg font-black italic text-white">
            User Activity
          </h3>

          <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
            로그 연결 예정
          </div>
        </div>

        {/* Error Logs */}
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
            <Bug size={18} />
          </div>

          <h3 className="text-lg font-black italic text-white">
            Error Logs
          </h3>

          <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
            로그 연결 예정
          </div>
        </div>

        {/* Cron Jobs - Real-time Trigger Control Panel */}
        <div className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7 flex flex-col justify-between min-h-[285px]">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-cyan-400">
              <Clock3 size={18} />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black italic text-white">
                Cron Jobs
              </h3>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${cronActive ? "text-emerald-400 bg-emerald-950/20 border-emerald-900/40" : "text-amber-500 bg-amber-950/20 border-amber-900/40"}`}>
                ● {cronActive ? "활성" : "중지됨"}
              </span>
            </div>

            {/* Active Cron list from registry guide */}
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-zinc-850 bg-zinc-950/30 p-4 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-300 font-extrabold">유튜브 급상승 자동 수집</span>
                  <span className="text-cyan-400 font-black">매일 KST 05:00</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold leading-normal">
                  8개 카테고리 스크래핑, 숏폼 자동 판별, Supabase DB 및 구글 스프레드 시트 누적 적재.
                </p>
                <div className="text-[9px] text-zinc-500 font-mono">
                  Path: /api/cron/sync-trending
                </div>
              </div>
            </div>

            {/* Results display panel */}
            {(cronResult || cronError) && (
              <div className="mt-3 p-3 rounded-xl border border-zinc-850 bg-zinc-950/20 text-[10px] font-bold">
                {cronResult && (
                  <div className="text-emerald-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>동기화 트리거 {cronResult.skipped ? "우회 완료" : "성공"}</span>
                    </div>
                    {cronResult.skipped ? (
                      <p className="text-[9px] text-zinc-400 font-bold leading-relaxed mt-1">
                        관리자 설정이 중지 상태이므로 수집을 건너뛰었습니다.
                      </p>
                    ) : (
                      <div className="text-[9px] text-zinc-400 font-mono mt-1 leading-relaxed">
                        적재날짜: {cronResult.date} <br/>
                        결과요약: {cronResult.summary?.success}/{cronResult.summary?.total} 개 카테고리 완료
                      </div>
                    )}
                  </div>
                )}
                {cronError && (
                  <div className="text-red-400 flex items-center gap-1.5 leading-relaxed">
                    <AlertTriangle size={12} className="flex-shrink-0" />
                    <span>실행 실패: {cronError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-2">
            {cronActive ? (
              <button
                onClick={() => handleToggleCronActive(false)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-800/40 bg-red-950/25 px-4 py-2.5 text-xs font-black text-red-400 hover:bg-red-900/30 transition"
              >
                <span>스케줄 실행 중지 (Pause)</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggleCronActive(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-800/40 bg-emerald-950/25 px-4 py-2.5 text-xs font-black text-emerald-400 hover:bg-emerald-900/30 transition"
              >
                <span>스케줄 실행 활성화 (Resume)</span>
              </button>
            )}

            <button
              onClick={handleTriggerCron}
              disabled={cronSyncing}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-800/40 bg-cyan-950/25 px-4 py-2.5 text-xs font-black text-cyan-400 hover:bg-cyan-900/30 transition disabled:opacity-50"
            >
              {cronSyncing ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  <span>동기화 수집 진행 중...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={12} />
                  <span>스케줄러 강제 즉시 실행</span>
                </>
              )}
            </button>
          </div>
        </div>
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