"use client";

import Link from "next/link";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";

interface StudioComingSoonPageProps {
  studioName: string;
  sectionName: string;
  homeHref: string;
}

export default function StudioComingSoonPage({
  studioName,
  sectionName,
  homeHref,
}: StudioComingSoonPageProps) {
  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center justify-center">
        <section className="w-full rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#07111f] p-8 shadow-2xl md:p-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-300">
            <Construction size={15} />
            Coming Soon
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {sectionName}
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
            현재 개발중입니다. {studioName}의 이 메뉴는 곧 사용할 수 있도록 준비하고 있습니다.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                <Sparkles size={20} />
              </div>
              <h2 className="text-base font-black text-white">준비중인 기능</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                메뉴 구조와 이동 경로는 먼저 연결해 두었고, 세부 기능 화면은 순차적으로 추가됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h2 className="text-base font-black text-white">이동 안내</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                지금은 스튜디오 홈에서 사용 가능한 다른 도구를 먼저 이용해 주세요.
              </p>

              <Link
                href={homeHref}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-500"
              >
                <ArrowLeft size={17} />
                스튜디오 홈으로
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
