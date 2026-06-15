"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  Library,
  Wand2,
  Palette,
  Sparkles,
  Gauge,
  Crop,
  ArrowRight,
  Plus,
  Clock,
  Search,
  Copy,
  Check,
} from "lucide-react";

export default function ImageStudioHomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const presets = [
    { label: "유튜브 썸네일", width: 1280, height: 720, icon: "📺", type: "thumbnail" },
    { label: "카드뉴스 (정각)", width: 1080, height: 1080, icon: "🗂️", type: "card" },
    { label: "인스타 피드 (세로)", width: 1080, height: 1350, icon: "📸", type: "instagram" },
    { label: "홍보 포스터 (A4)", width: 2480, height: 3508, icon: "📄", type: "poster" },
    { label: "블로그 대표 이미지", width: 960, height: 540, icon: "📝", type: "blog" },
    { label: "웹 광고 배너", width: 1200, height: 400, icon: "📢", type: "banner" },
    { label: "디지털 명함", width: 900, height: 500, icon: "💳", type: "business-card" },
  ];

  const canvasMenus = [
    {
      title: "디자인 편집기 (Workspace)",
      desc: "빈 캔버스에서 시작하여 드래그 앤 드롭 편집기로 나만의 디자인을 완성합니다.",
      href: "/studio/image/workspace",
      icon: Wand2,
      color: "from-violet-600 to-indigo-600",
    },
    {
      title: "템플릿 라이브러리",
      desc: "유튜브, 블로그, 포스터 등 다양한 카테고리의 디자인 템플릿을 선택하여 바로 시작합니다.",
      href: "/studio/image/templates",
      icon: Library,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "브랜드 키트",
      desc: "브랜드 색상 팔레트, 로고, 전용 서체를 관리하여 일관성 있는 비주얼을 유지합니다.",
      href: "/studio/image/brand-kit",
      icon: Palette,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "AI 매직 디자인",
      desc: "텍스트 설명만으로 레이아웃과 이미지를 결합한 매직 디자인을 자동 생성합니다.",
      href: "/studio/image/magic-design",
      icon: Sparkles,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "WEBP 일괄 압축기",
      desc: "여러 이미지를 일괄 업로드하여 WebP 파일로 압축 변환 및 리사이즈합니다.",
      href: "/studio/image/webp-compressor",
      icon: Gauge,
      color: "from-cyan-600 to-blue-600",
    },
    {
      title: "간편 이미지 편집기",
      desc: "자르기, 필터, 리사이즈, 워터마크 등을 빠르게 처리할 수 있는 간편 편집 도구입니다.",
      href: "/studio/image/editor",
      icon: Crop,
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const mockProjects = [
    { id: "proj-1", title: "신제품 론칭 카드뉴스 세트", updated: "2시간 전", type: "카드뉴스", bg: "bg-gradient-to-tr from-violet-950/30 to-zinc-900 border-violet-900/30" },
    { id: "proj-2", title: "테크 리뷰 유튜브 썸네일", updated: "어제", type: "썸네일", bg: "bg-gradient-to-tr from-indigo-950/30 to-zinc-900 border-indigo-900/30" },
    { id: "proj-3", title: "2026 크리에이터 세미나 포스터", updated: "3일 전", type: "포스터", bg: "bg-gradient-to-tr from-rose-950/30 to-zinc-900 border-rose-900/30" },
  ];

  const brandColors = ["#8B5CF6", "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#1F2937"];

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1200);
  };

  const handleCreatePreset = (preset: typeof presets[0]) => {
    router.push(`/studio/image/workspace?width=${preset.width}&height=${preset.height}&type=${preset.type}`);
  };

  return (
    <div className="min-h-full bg-[#06080d] px-5 py-8 text-zinc-100 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* 1. Canva-themed Top Header Hero Banner */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-[#180f2d] to-[#12091f] p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-purple-600/5 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-purple-400">
                <ImageIcon size={15} />
                MiriCanvas & Canva Upgraded Studio
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                오늘 어떤 디자인을 만들고 싶으신가요?
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
                MiriCanvas, Canva 스타일의 드래그 앤 드롭 편집기로 썸네일, 카드뉴스, 포스터를 순식간에 제작하세요. 브랜드 자산 관리부터 AI 이미지 자동 생성까지 통합 지원합니다.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input
                  type="text"
                  placeholder="디자인 템플릿 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchQuery.trim() && router.push(`/studio/image/templates?query=${searchQuery}`)}
                  className="w-full rounded-2xl border border-zinc-850 bg-zinc-950/80 py-3.5 pl-11 pr-5 text-sm text-zinc-200 placeholder-zinc-650 outline-none transition focus:border-purple-500/50 focus:bg-zinc-950"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Fast Dimension Preset Action Bar */}
        <section className="space-y-3">
          <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">새 디자인 규격으로 시작</h2>
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar scroll-smooth">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleCreatePreset(preset)}
                className="flex items-center gap-3 px-5 py-4 rounded-xl border border-zinc-850 bg-[#090d16]/30 hover:bg-[#090d16]/60 hover:border-purple-500/30 transition shadow-md shrink-0 cursor-pointer text-left"
              >
                <span className="text-xl">{preset.icon}</span>
                <div>
                  <p className="text-xs font-black text-white">{preset.label}</p>
                  <p className="text-[10px] font-bold text-zinc-500 font-mono mt-0.5">{preset.width} x {preset.height} px</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. MiriCanvas/Canva Grid Menu Tools */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black text-white">디자인 솔루션 메뉴</h2>
            <p className="mt-1 text-sm text-zinc-500">
              콘텐츠에 맞는 제작 도구를 선택하여 드래그 앤 드롭으로 캔버스를 꾸며보세요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {canvasMenus.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-5 transition hover:-translate-y-0.5 hover:border-purple-500/40 hover:bg-[#090d16]/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <h3 className="truncate text-base font-black text-white group-hover:text-purple-400 transition">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-zinc-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-purple-400"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Recent Designs & Brand Kit Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          
          {/* Recent Designs Grid */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-400" size={20} />
                <h2 className="text-lg font-black text-white">최근 디자인 프로젝트</h2>
              </div>
              <Link href="/studio/image/workspace" className="text-xs font-bold text-zinc-500 hover:text-purple-400 flex items-center gap-1">
                전체보기 <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className={`group rounded-xl border p-4 flex flex-col justify-between h-40 transition hover:border-purple-500/30 ${project.bg}`}
                >
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-[9px] font-black text-purple-400 uppercase font-sans">
                      {project.type}
                    </span>
                    <h3 className="text-xs font-black text-zinc-200 mt-2.5 line-clamp-2 group-hover:text-white transition">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-800/40">
                    <span className="text-[10px] font-bold text-zinc-500">{project.updated} 수정</span>
                    <Link
                      href={`/studio/image/workspace?projectId=${project.id}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-purple-400 hover:border-purple-500/20 transition-all shadow-sm"
                    >
                      <Wand2 size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Kit Quick Color Palette */}
          <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/20 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Palette className="text-amber-400" size={20} />
              <h2 className="text-lg font-black text-white">브랜드 키트 빠른 색상</h2>
            </div>
            <p className="text-xs font-medium text-zinc-500 leading-relaxed">
              자주 사용하는 브랜드 컬러 팔레트입니다. 클릭하면 헥사코드가 즉시 클립보드에 복사됩니다.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {brandColors.map((color) => {
                const isCopied = copiedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => handleCopyColor(color)}
                    className="h-14 rounded-xl relative border border-zinc-850 group cursor-pointer transition overflow-hidden shadow-inner active:scale-95 text-left"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isCopied ? (
                        <Check size={14} className="text-white animate-in zoom-in-50" />
                      ) : (
                        <Copy size={13} className="text-white" />
                      )}
                    </div>
                    <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-white px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm font-mono uppercase tracking-tighter">
                      {color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}