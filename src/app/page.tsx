"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  PenLine,
  ImageIcon,
  Music,
  Video,
  Newspaper,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Layers,
  Wand2,
  Rocket,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

export default function MainLandingPage() {
  const router = useRouter();

  const features = [
    {
      title: "AI 글쓰기",
      desc: "블로그, 네이버 글쓰기, 워드프레스 글 발행까지 한 번에 준비하세요.",
      icon: <PenLine size={24} />,
    },
    {
      title: "이미지 & 썸네일",
      desc: "콘텐츠에 어울리는 이미지 아이디어와 썸네일 제작 흐름을 지원합니다.",
      icon: <ImageIcon size={24} />,
    },
    {
      title: "음악 / 가사 생성",
      desc: "Suno 스타일의 음악 기획, 제목, 가사, 프롬프트를 빠르게 만듭니다.",
      icon: <Music size={24} />,
    },
    {
      title: "영상 제작 도구",
      desc: "쇼츠, 영상 기획, 프롬프트, 장면 구성까지 크리에이터 작업을 돕습니다.",
      icon: <Video size={24} />,
    },
    {
      title: "뉴스 & 리포터",
      desc: "뉴스형 콘텐츠와 이슈 정리를 빠르게 콘텐츠화할 수 있습니다.",
      icon: <Newspaper size={24} />,
    },
    {
      title: "트렌드 분석",
      desc: "키워드, 유튜브, 블로그 주제를 분석해 콘텐츠 방향을 잡아줍니다.",
      icon: <TrendingUp size={24} />,
    },
  ];

  const steps = [
    "주제 또는 키워드 입력",
    "AI가 콘텐츠 구조 생성",
    "글 / 이미지 / 음악 / 영상으로 확장",
    "라이브러리 저장 및 발행 준비",
  ];

  const studioCards = [
    "블로그 글쓰기",
    "네이버 글쓰기",
    "워드프레스 글쓰기",
    "음악 / 가사",
    "이미지 제작",
    "뉴스 콘텐츠",
    "키워드 분석",
    "유튜브 트렌드",
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white">
          <div className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="absolute right-0 top-32 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-black text-violet-700 shadow-sm">
                <Sparkles size={16} />
                Beta Version · 무료 체험 가능
              </div>

              <h1 className="break-keep text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                AI 콘텐츠 제작을
                <br />
                하나의 스튜디오에서
                <span className="block bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                  빠르게 완성하세요
                </span>
              </h1>

              <p className="mt-6 max-w-xl break-keep text-lg font-medium leading-relaxed text-slate-600">
                CreAibox는 글쓰기, 이미지, 음악, 영상, 뉴스, 트렌드 분석까지
                크리에이터에게 필요한 AI 제작 도구를 한 곳에 모은 올인원 콘텐츠
                스튜디오입니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => router.push("/signup")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-4 text-base font-black text-white shadow-xl shadow-violet-500/20 transition hover:scale-[1.02]"
                >
                  무료로 시작하기
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => router.push("/studio")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-black text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
                >
                  <LayoutDashboard size={18} />
                  스튜디오 둘러보기
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-violet-500" />
                  설치 없이 웹에서 사용
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-violet-500" />
                  콘텐츠 제작 통합 관리
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-violet-500" />
                  크리에이터 맞춤형
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[36px] border border-slate-200 bg-white/80 p-4 shadow-2xl shadow-violet-200/60 backdrop-blur-xl">
                <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-violet-300">
                        CreAibox Studio
                      </p>
                      <h3 className="mt-1 text-xl font-black">
                        콘텐츠 작업실
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-violet-500 px-3 py-2 text-xs font-black">
                      LIVE
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {studioCards.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="mb-3 h-8 w-8 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500" />
                        <p className="text-sm font-black">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-6 hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Rocket size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      빠른 콘텐츠 제작
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      기획부터 결과물까지 한 번에
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-widest text-violet-600">
              Features
            </p>
            <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              콘텐츠 제작에 필요한 기능을 한 곳에
            </h2>
            <p className="mt-5 break-keep text-lg font-medium text-slate-600">
              여러 AI 서비스와 작업 도구를 오가며 낭비하던 시간을 줄이고,
              CreAibox 안에서 기획, 생성, 저장, 발행 준비까지 이어갈 수 있습니다.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 break-keep text-sm font-medium leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-gradient-to-b from-slate-50 to-white py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-blue-600">
                  How it works
                </p>
                <h2 className="mt-3 break-keep text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                  복잡한 제작 과정을
                  <br />
                  4단계로 단순하게
                </h2>
                <p className="mt-5 break-keep text-lg font-medium leading-relaxed text-slate-600">
                  아이디어가 떠오르면 바로 입력하고, AI가 콘텐츠 구조를 잡고,
                  필요한 형식으로 확장한 뒤 라이브러리에 저장할 수 있습니다.
                </p>

                <button
                  onClick={() => router.push("/studio")}
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-violet-600"
                >
                  스튜디오 시작하기
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-5 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-lg font-black text-white">
                      {index + 1}
                    </div>
                    <p className="text-lg font-black text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API / Studio */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[34px] border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-9">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <ShieldCheck size={24} />
              </div>
              <h3 className="break-keep text-3xl font-black text-slate-950">
                나의 API 연결하기
              </h3>
              <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-600">
                개인 API 키를 연결해 더 자유로운 제작 환경을 구성할 수 있습니다.
                API 키는 별도 관리 페이지에서 등록하고 관리합니다.
              </p>
              <button
                onClick={() => router.push("/apivault")}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-violet-700 shadow-sm transition hover:bg-violet-600 hover:text-white"
              >
                API 키 관리하기
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="rounded-[34px] border border-slate-200 bg-slate-950 p-9 text-white">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white">
                <PlayCircle size={24} />
              </div>
              <h3 className="break-keep text-3xl font-black">
                바로 스튜디오 시작
              </h3>
              <p className="mt-4 break-keep text-base font-medium leading-relaxed text-slate-300">
                설정이 끝나지 않아도 먼저 콘텐츠 작업실을 둘러보고,
                CreAibox의 제작 흐름을 확인할 수 있습니다.
              </p>
              <button
                onClick={() => router.push("/studio")}
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
              >
                스튜디오로 이동
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-gradient-to-r from-violet-600 to-blue-500 p-10 text-center text-white shadow-2xl shadow-violet-300/40 md:p-16">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20">
              <Wand2 size={30} />
            </div>
            <h2 className="break-keep text-3xl font-black tracking-tight md:text-5xl">
              아이디어를 콘텐츠로 바꾸는 가장 빠른 방법
            </h2>
            <p className="mx-auto mt-5 max-w-2xl break-keep text-lg font-medium text-white/80">
              CreAibox에서 글쓰기, 이미지, 음악, 영상, 트렌드 분석을 하나의
              작업 흐름으로 연결해보세요.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-violet-700 transition hover:scale-[1.02]"
            >
              무료로 시작하기
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}