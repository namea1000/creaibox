"use client";

import React from "react";
import Link from "next/link";
import {
  Wand2,
  FileText,
  Eye,
  Sparkles,
  Languages,
  Tags,
  PlayCircle,
  Palette,
  QrCode,
  RefreshCw,
  Database,
  Code2,
  ArrowRight,
  Upload,
  Zap,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function StudioToolsHomePage() {
  const stats = [
    { label: "사용 가능한 도구", value: "12", icon: Wand2 },
    { label: "AI 도구", value: "5", icon: Sparkles },
    { label: "파일 도구", value: "4", icon: FileText },
    { label: "개발 도구", value: "3", icon: Code2 },
  ];

  const tools = [
    {
      title: "AI 누끼 제거",
      desc: "이미지 배경을 제거하고 투명 PNG로 저장",
      href: "/studio/tools/bg-remover",
      icon: Wand2,
      color: "from-violet-600 to-blue-600",
    },
    {
      title: "PDF 문서 분석",
      desc: "PDF 요약, 핵심 키워드, 질의응답 분석",
      href: "/studio/tools/pdf-analyzer",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "AI OCR 문자 추출",
      desc: "이미지와 스캔 문서에서 텍스트 추출",
      href: "/studio/tools/ocr",
      icon: Eye,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "AI 프롬프트 개선기",
      desc: "짧은 입력을 고급 AI 프롬프트로 확장",
      href: "/studio/tools/prompt-enhancer",
      icon: Sparkles,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "AI 프롬프트 번역기",
      desc: "Midjourney, Suno, 영상용 프롬프트 번역",
      href: "/studio/tools/prompt-translator",
      icon: Languages,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "해시태그 생성기",
      desc: "블로그, 유튜브, SNS용 해시태그 생성",
      href: "/studio/tools/hashtag",
      icon: Tags,
      color: "from-purple-600 to-fuchsia-600",
    },
    {
      title: "유튜브 썸네일 다운로더",
      desc: "유튜브 URL에서 썸네일 이미지 추출",
      href: "/studio/tools/youtube-thumbnail",
      icon: PlayCircle,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "색상 추출기",
      desc: "이미지에서 HEX, RGB, 팔레트 색상 추출",
      href: "/studio/tools/color-picker",
      icon: Palette,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "QR 생성기",
      desc: "URL, 텍스트, 연락처용 QR 코드 생성",
      href: "/studio/tools/qr",
      icon: QrCode,
      color: "from-zinc-600 to-slate-600",
    },
    {
      title: "포맷 변환기",
      desc: "이미지, 문서, 텍스트 포맷 변환",
      href: "/studio/tools/converter",
      icon: RefreshCw,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: "메타데이터 추출기",
      desc: "이미지, 영상, 문서의 메타정보 확인",
      href: "/studio/tools/metadata",
      icon: Database,
      color: "from-indigo-600 to-violet-600",
    },
    {
      title: "코드 뷰티파이어",
      desc: "HTML, CSS, JS, JSON 코드를 보기 좋게 정리",
      href: "/studio/tools/code-beautifier",
      icon: Code2,
      color: "from-sky-600 to-blue-600",
    },
  ];

  return (
    <div className="min-h-full w-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#15110a] p-7 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-400">
                <Wand2 size={15} />
                Studio Tools
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                스튜디오 Tools
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                이미지, 문서, 프롬프트, 코드, 메타데이터까지. 콘텐츠 제작 과정에서 반복적으로 필요한 작은 도구들을 한 곳에서 빠르게 사용할 수 있습니다.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/studio/tools/converter"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-black text-zinc-200 transition hover:border-amber-500/50 hover:text-white"
              >
                <Upload size={17} />
                파일 변환
              </Link>

              <Link
                href="/studio/tools/prompt-enhancer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-black text-white transition hover:bg-amber-500"
              >
                <Sparkles size={17} />
                프롬프트 개선
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">도구 모음</h2>
              <p className="mt-1 text-sm font-medium text-zinc-500">
                자주 쓰는 제작 보조 도구를 선택하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Zap className="text-amber-400" size={20} />
              <h2 className="text-lg font-black text-white">빠른 실행</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              반복 작업은 Tools에서 바로 처리하고, 결과물은 콘텐츠 라이브러리에 저장하는 흐름으로 확장할 수 있습니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={20} />
              <h2 className="text-lg font-black text-white">로컬 처리 확장</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              이미지 압축, 포맷 변환, 색상 추출 등은 브라우저 기반 처리로 서버 부담을 줄일 수 있습니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-lg font-black text-white">최근 사용 도구</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              아직 사용 기록이 없습니다. 도구 사용 이력이 쌓이면 이곳에 표시됩니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}