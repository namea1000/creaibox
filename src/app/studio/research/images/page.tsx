"use client";

import React from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Database,
  Search,
  Download,
  Copy,
  FolderOpen,
  Globe,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";

export default function ResearchImagesPage() {
  const images = [
    {
      title: "대표 이미지",
      source: "웹페이지 URL",
      type: "og-image",
      size: "320KB",
    },
    {
      title: "본문 이미지",
      source: "뉴스 기사",
      type: "content-image",
      size: "480KB",
    },
    {
      title: "OCR 원본 이미지",
      source: "이미지 OCR",
      type: "ocr-image",
      size: "620KB",
    },
  ];

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#12091f] p-7 shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-violet-400">
                <ImageIcon size={15} />
                Extracted Images
              </div>

              <h1 className="text-3xl font-black md:text-5xl">
                추출 이미지
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                웹페이지, 뉴스, 블로그, OCR 자료에서 추출한 이미지를 WebP 형식으로
                저장하고 관리합니다.
              </p>
            </div>

            <Link
              href="/studio/research/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-500"
            >
              <Plus size={17} />
              새 이미지 추출
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "전체 이미지", value: "0", icon: ImageIcon },
            { label: "대표 이미지", value: "0", icon: Globe },
            { label: "본문 이미지", value: "0", icon: FileText },
            { label: "저장 용량", value: "0MB", icon: Database },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={20} />
                </div>

                <p className="text-2xl font-black">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="이미지명, 프로젝트, 출처 검색..."
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black">이미지 목록</h2>
            <p className="mt-1 text-sm text-zinc-500">
              저장 경로: research-assets / user_id / project_id / source_id / images
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {images.map((item, index) => (
              <div
                key={item.title + index}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="flex h-44 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
                  <ImageIcon size={42} className="text-zinc-700" />
                </div>

                <div className="mt-4">
                  <h3 className="font-black">{item.title}</h3>

                  <div className="mt-2 space-y-1 text-xs text-zinc-500">
                    <p>출처: {item.source}</p>
                    <p>유형: {item.type}</p>
                    <p>용량: {item.size}</p>
                    <p>형식: WebP</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-bold text-zinc-300 hover:border-violet-500/40">
                      <Copy size={14} />
                      경로 복사
                    </button>

                    <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-500">
                      <Download size={14} />
                      다운로드
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <ImageIcon className="mb-3 text-violet-400" size={20} />
            <h3 className="font-black">저장 형식</h3>
            <p className="mt-2 text-sm text-zinc-500">
              모든 이미지는 WebP로 변환 후 저장합니다.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <Database className="mb-3 text-blue-400" size={20} />
            <h3 className="font-black">최적화 기준</h3>
            <p className="mt-2 text-sm text-zinc-500">
              최대 1600px, 품질 80, 목표 용량 1MB 이하.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <FolderOpen className="mb-3 text-emerald-400" size={20} />
            <h3 className="font-black">프로젝트 연결</h3>
            <p className="mt-2 text-sm text-zinc-500">
              이미지는 프로젝트와 원본 자료 단위로 묶어 관리합니다.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-violet-400" size={20} />
            <h2 className="text-lg font-black text-white">개발 예정</h2>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Supabase Storage의 research-assets 버킷과 연결해 이미지 미리보기,
            원본 URL 확인, WebP 변환 이력, 이미지 재분석 기능을 추가하면 됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}