import React, { useState } from "react";
import Image from "next/image";
import { Search, CheckCircle2, ShieldCheck, Eye, Zap, Lock, ExternalLink, Maximize2, Camera } from "lucide-react";
import { CustomTemplate, CUSTOM_TEMPLATES } from "@/constants/custom-client-site";

interface MarketplaceTabProps {
  setPreviewModalTemplate: (tpl: CustomTemplate) => void;
  setDeployModalTemplate: (tpl: CustomTemplate) => void;
  setDeploySiteName: (name: string) => void;
  setDeploySubdomain: (subdomain: string) => void;
  setDeploySuccess: (success: boolean) => void;
  requireAuth: (action: () => void) => void;
}

export default function MarketplaceTab({
  setPreviewModalTemplate,
  setDeployModalTemplate,
  setDeploySiteName,
  setDeploySubdomain,
  setDeploySuccess,
  requireAuth,
}: MarketplaceTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 테마");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "전체 테마",
    ...Array.from(new Set(CUSTOM_TEMPLATES.map((t: any) => t.category))),
  ];

  const filteredTemplates = CUSTOM_TEMPLATES.filter((tpl: any) => {
    const matchCat = selectedCategory === "전체 테마" || tpl.category === selectedCategory;
    const matchSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.features.some((f: any) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
        <div className="space-y-8">
          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="템플릿 이름, 기능, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-11 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            {/* Categories Capsule Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                      : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Grid (Compact 3-Column Grid: Flexible Left Info / Fixed Right Live Web Preview Window) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 overflow-hidden hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex flex-row gap-4 items-stretch h-[290px]">
                  {/* Left Side (Flexible Width): Info, Features, Metrics, & Stacked Buttons */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                    <div className="space-y-2">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded-full bg-cyan-500/20 border border-cyan-400/30 px-2 py-0.5 text-[9px] font-black text-cyan-300 truncate max-w-[100px]">
                          {tpl.category}
                        </span>
                        <span className="rounded-full bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-[9px] font-black text-amber-300 truncate">
                          {tpl.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                          {tpl.name}
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-slate-300 leading-snug line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Key Features */}
                      <div className="space-y-1 pt-0.5">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          주요 내장 기능
                        </p>
                        <div className="space-y-0.5">
                          {tpl.features.slice(0, 3).map((ft: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-200">
                              <CheckCircle2 size={11} className="text-cyan-400 shrink-0" />
                              <span className="truncate">{ft}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar: Metrics & Vertically Stacked Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span>구축: <strong className="text-cyan-400 font-black">{tpl.deployCount}회</strong></span>
                        <span className="flex items-center gap-0.5 text-emerald-400 text-[9px]">
                          <ShieldCheck size={11} /> DoFollow
                        </span>
                      </div>

                      {/* Vertically Stacked Action Buttons (1초 구축 UNDER 미리보기) */}
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setPreviewModalTemplate(tpl)}
                          className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-950 py-1.5 text-[10px] sm:text-[11px] font-extrabold text-slate-300 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye size={11} /> 미리보기
                        </button>

                        <button
                          onClick={() => {
                            requireAuth(() => {
                              setDeployModalTemplate(tpl);
                              setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);
                              setDeploySubdomain(`${tpl.id}-mybrand`);
                              setDeploySuccess(false);
                            });
                          }}
                          className={`w-full flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r ${tpl.accentColor} py-1.5 text-[10px] sm:text-[11px] font-black text-white hover:brightness-110 transition-all shadow-md cursor-pointer`}
                        >
                          <Zap size={11} /> 1초 구축하기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Fixed Width (w-[210px] shrink-0) - Keeps proportions perfect without horizontal gaps! */}
                  <div className="w-[210px] shrink-0 flex flex-col rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-lg group/preview h-full">
                    {/* Mac Browser Top Bar */}
                    <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 bg-slate-900 border-b border-slate-800 shrink-0">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>

                      <div className="flex-1 flex items-center gap-1 rounded bg-slate-950 border border-slate-800 px-1 py-0.5 text-[8px] font-bold text-slate-400 truncate">
                        <Lock size={8} className="text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-300">
                          {tpl.id}.creaibox.com
                        </span>
                      </div>

                      <a
                        href={`/clients/${tpl.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="새 탭에서 사이트 직접 열기"
                        className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800 transition-all"
                      >
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* 9:16 Thumbnail — WebP from R2 CDN (zero iframe cost) */}
                    <div
                      className="relative flex-1 w-full overflow-hidden cursor-pointer bg-slate-950"
                      onClick={() => setPreviewModalTemplate(tpl)}
                    >
                      {tpl.thumbnailUrl ? (
                        /* R2 CDN 썸네일 이미지 (9:16 WebP) */
                        <Image
                          src={tpl.thumbnailUrl}
                          alt={`${tpl.name} 썸네일`}
                          fill
                          sizes="210px"
                          className="object-cover object-top"
                          priority={false}
                          unoptimized={true}
                        />
                      ) : (
                        /* Fallback: CDN 미설정 or 캡처 전 */
                        <div className={`absolute inset-0 bg-gradient-to-b ${tpl.bgGradient} flex flex-col items-center justify-center gap-2 p-3`}>
                          <Camera size={20} className="text-slate-500" />
                          <span className="text-[9px] font-bold text-slate-500 text-center leading-tight">썸네일 캡처 준비 중</span>
                          <span className="text-[8px] text-slate-600 text-center leading-tight">{tpl.id}</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/preview:opacity-100 transition-all duration-200 flex items-center justify-center p-1 backdrop-blur-[1px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(tpl);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-2.5 py-1.5 text-[10px] font-black text-slate-950 shadow-md hover:bg-cyan-400 transition-all cursor-pointer"
                        >
                          <Maximize2 size={11} /> 실시간 뷰
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}
