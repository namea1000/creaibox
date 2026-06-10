import Link from "next/link";
import {
  Sparkles,
  Users,
  Rocket,
  CheckCircle2,
  PenLine,
  ImageIcon,
  Music,
  Search,
  KeyRound,
  NotebookPen,
  ArrowRight,
} from "lucide-react";

export default function BetaPage() {
  const studios = [
    {
      icon: PenLine,
      title: "Writing Studio",
      desc: "SEO 기반 블로그 글쓰기, 원고 생성, 발행 준비까지 한 번에 처리합니다.",
    },
    {
      icon: Search,
      title: "Research Studio",
      desc: "자료 수집, 분석, 요약, 지식 정리를 위한 AI 리서치 공간입니다.",
    },
    {
      icon: ImageIcon,
      title: "Image Studio",
      desc: "블로그 썸네일, 콘텐츠 이미지, 홍보 이미지를 빠르게 제작합니다.",
    },
    {
      icon: Music,
      title: "Music Studio",
      desc: "가사 생성, Suno 프롬프트, 음악 콘텐츠 기획을 지원합니다.",
    },
    {
      icon: KeyRound,
      title: "API Vault",
      desc: "OpenAI, Gemini, Claude 등 사용자의 API Key를 직접 연결할 수 있습니다.",
    },
    {
      icon: NotebookPen,
      title: "Cre Note",
      desc: "아이디어, 프로젝트, 콘텐츠 기획을 한 곳에서 관리합니다.",
    },
  ];

  const benefits = [
    "베타 기간 주요 기능 무료 사용",
    "신규 기능 우선 체험",
    "피드백 우선 반영",
    "정식 출시 후 초기 사용자 혜택 제공 예정",
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" />
            2026년 7월 베타 오픈 예정
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            AI 콘텐츠 제작의 모든 것을
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              CreAIbox 하나로
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            글쓰기, 리서치, 이미지, 음악, API 연결, 프로젝트 관리를 하나의 워크스페이스에서 제공합니다.
            CreAIbox는 7월 베타 오픈을 앞두고 초기 사용자 1,000명을 모집합니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-blue-100"
            >
              베타 무료로 시작하기
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10"
            >
              CreAIbox 더 알아보기
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Users className="mx-auto mb-3 h-7 w-7 text-cyan-300" />
              <p className="text-3xl font-black">1,000명</p>
              <p className="mt-1 text-sm text-slate-400">베타 사용자 모집</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Rocket className="mx-auto mb-3 h-7 w-7 text-purple-300" />
              <p className="text-3xl font-black">7월</p>
              <p className="mt-1 text-sm text-slate-400">베타 오픈 예정</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Sparkles className="mx-auto mb-3 h-7 w-7 text-blue-300" />
              <p className="text-3xl font-black">All-in-One</p>
              <p className="mt-1 text-sm text-slate-400">AI Creator Workspace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Why CreAIbox
          </p>

          <h2 className="text-3xl font-black md:text-5xl">
            AI 도구는 많지만, 작업 흐름은 아직 흩어져 있습니다.
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            글은 ChatGPT에서 만들고, 이미지는 다른 서비스에서 만들고, 음악은 또 다른 플랫폼에서 만들고,
            자료 정리는 별도 노트에 저장하는 방식은 콘텐츠 생산 속도를 떨어뜨립니다.
            CreAIbox는 이 과정을 하나의 제작 흐름으로 연결합니다.
          </p>
        </div>
      </section>

      {/* Studios */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              Core Studios
            </p>
            <h2 className="text-3xl font-black md:text-5xl">
              베타에서 경험할 핵심 기능
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-purple-300">
              Beta Benefits
            </p>
            <h2 className="text-3xl font-black md:text-5xl">
              초기 사용자에게 먼저 열립니다.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              CreAIbox 베타는 단순 체험판이 아니라 실제 콘텐츠 제작자와 함께 제품을 완성해가는 단계입니다.
              초기 사용자 피드백은 정식 서비스 기능 개선에 우선 반영됩니다.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-4 border-b border-white/10 py-5 last:border-b-0">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                <p className="text-lg font-semibold text-slate-200">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/25 via-purple-600/20 to-cyan-500/20 p-10 text-center md:p-16">
          <h2 className="text-4xl font-black md:text-6xl">
            CreAIbox Beta 1000
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-200">
            AI 콘텐츠 제작을 더 빠르고, 더 체계적으로, 더 강력하게.
            7월 베타 오픈과 함께 CreAIbox의 첫 번째 사용자 그룹에 참여하세요.
          </p>

          <div className="mt-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-100"
            >
              베타 사용자로 참여하기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            베타 모집 인원은 1,000명으로 제한될 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}