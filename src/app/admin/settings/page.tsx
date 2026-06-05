"use client";

import {
  Settings,
  ShieldCheck,
  Users,
  Cpu,
  CreditCard,
  Search,
  Bell,
  Wrench,
  Globe,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Server,
} from "lucide-react";

const settingGroups = [
  {
    title: "사이트 설정",
    icon: Globe,
    items: [
      "사이트 이름",
      "도메인",
      "브랜드 설정",
      "공지사항",
      "푸터 정보",
    ],
  },
  {
    title: "회원 정책",
    icon: Users,
    items: [
      "회원가입 정책",
      "무료 체험 횟수",
      "차단 정책",
      "등급 정책",
      "이메일 인증",
    ],
  },
  {
    title: "AI 설정",
    icon: Cpu,
    items: [
      "기본 AI 모델",
      "Gemini 설정",
      "OpenAI 설정",
      "Claude 설정",
      "기본 Provider",
    ],
  },
  {
    title: "결제 설정",
    icon: CreditCard,
    items: [
      "요금제",
      "Stripe",
      "환불 정책",
      "구독 정책",
      "프로모션",
    ],
  },
  {
    title: "SEO 설정",
    icon: Search,
    items: [
      "Meta Default",
      "OpenGraph",
      "Schema",
      "Robots",
      "Sitemap",
    ],
  },
  {
    title: "보안 설정",
    icon: ShieldCheck,
    items: [
      "관리자 권한",
      "OAuth",
      "API Key",
      "Rate Limit",
      "접근 제한",
    ],
  },
];

const systemFlags = [
  {
    title: "Beta Mode",
    value: "ON",
    color: "text-blue-400",
  },
  {
    title: "Maintenance",
    value: "OFF",
    color: "text-yellow-400",
  },
  {
    title: "Registration",
    value: "OPEN",
    color: "text-emerald-400",
  },
  {
    title: "Payments",
    value: "OFF",
    color: "text-red-400",
  },
];

export default function SettingsAdminPage() {
  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-black uppercase italic tracking-tighter text-white">
            <Settings className="h-10 w-10 text-cyan-400" />
            Control <span className="text-cyan-400">Panel</span>
          </h1>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Platform Settings · Policy · Security · AI · Billing
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-xs font-black text-zinc-300 hover:text-white">
          <RefreshCw size={14} />
          새로고침
        </button>
      </header>

      {/* Flags */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {systemFlags.map((item) => (
          <div
            key={item.title}
            className="rounded-[24px] border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
              {item.title}
            </p>

            <p
              className={`mt-3 text-3xl font-black italic ${item.color}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Settings Groups */}
      <section className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {settingGroups.map((group) => {
          const Icon = group.icon;

          return (
            <div
              key={group.title}
              className="rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-cyan-400">
                <Icon size={22} />
              </div>

              <h2 className="text-lg font-black italic text-white">
                {group.title}
              </h2>

              <div className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-zinc-400"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-cyan-400"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Admin Controls */}
      <section className="mb-10 grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "API Vault",
            icon: KeyRound,
            description:
              "Gemini, OpenAI, Claude, Google API 설정",
          },
          {
            title: "Admin Roles",
            icon: Lock,
            description:
              "관리자 권한 및 접근 정책",
          },
          {
            title: "Infrastructure",
            icon: Server,
            description:
              "시스템 환경 및 서버 설정",
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

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {item.description}
              </p>

              <div className="mt-6 flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-sm font-bold text-zinc-600">
                설정 연결 예정
              </div>
            </div>
          );
        })}
      </section>

      {/* Notifications */}
      <section className="mb-10 rounded-[30px] border border-zinc-800 bg-zinc-900/40 p-7">
        <div className="mb-6 flex items-center gap-3">
          <Bell className="text-cyan-400" size={20} />
          <h2 className="text-xl font-black italic text-white">
            운영 알림 설정
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "신규 회원 가입",
            "결제 발생",
            "오류 발생",
            "API 한도 초과",
            "스토리지 경고",
            "보안 이벤트",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-800 bg-[#080b11] p-5"
            >
              <p className="font-bold text-zinc-300">
                {item}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                이메일 / 관리자 알림 예정
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Insight */}
      <section className="rounded-[30px] border border-yellow-500/20 bg-yellow-500/5 p-7">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-yellow-400" size={22} />

          <div>
            <h2 className="text-lg font-black italic text-yellow-300">
              Admin AI Insight
            </h2>

            <div className="mt-4 space-y-3">
              {[
                "사용량 기반 요금제 추천",
                "무료 사용자 전환 예측",
                "보안 위험 감지",
                "API 비용 최적화 추천",
                "AI 모델 추천",
                "운영 정책 자동 제안",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-bold text-yellow-100/70"
                >
                  <Sparkles
                    size={14}
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