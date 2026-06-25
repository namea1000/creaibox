"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSiteBuilder } from "../context";
import { createClient } from "@/utils/supabase/client";
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from "@/lib/templates/registry";
import { Palette, Layers, Check, ArrowRight, Sparkles, AlertCircle, Loader2, Maximize2, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ThemeLibraryPage() {
  const router = useRouter();
  const { sites, selectedSite, setIsCreatingNewSite, refreshData } = useSiteBuilder();
  const supabase = createClient();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [updatingTheme, setUpdatingTheme] = useState(false);

  // Filter templates based on selected category
  const templates = Object.values(TEMPLATE_REGISTRY).filter((temp) => {
    if (activeCategory === "All") return true;
    return temp.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const activePreviewTheme = selectedThemeId ? TEMPLATE_REGISTRY[selectedThemeId] : null;

  const currentIdx = templates.findIndex((t) => t.templateId === selectedThemeId);

  const handlePrevTheme = () => {
    if (templates.length === 0) return;
    const prevIdx = (currentIdx - 1 + templates.length) % templates.length;
    setSelectedThemeId(templates[prevIdx].templateId);
  };

  const handleNextTheme = () => {
    if (templates.length === 0) return;
    const nextIdx = (currentIdx + 1) % templates.length;
    setSelectedThemeId(templates[nextIdx].templateId);
  };

  // Keyboard Navigation (Left/Right) & Escape to Close
  useEffect(() => {
    if (!selectedThemeId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevTheme();
      } else if (e.key === "ArrowRight") {
        handleNextTheme();
      } else if (e.key === "Escape") {
        setSelectedThemeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedThemeId, currentIdx, templates]);

  // Change Theme Action for existing site
  const handleChangeTheme = async (themeId: string) => {
    if (!selectedSite) return;
    setUpdatingTheme(true);
    try {
      const { error } = await supabase
        .from("client_sites")
        .update({ template_id: themeId })
        .eq("id", selectedSite.id);

      if (error) throw error;
      alert(`디자인 테마가 '${TEMPLATE_REGISTRY[themeId]?.name}'(으)로 성공적으로 변경 및 배포되었습니다.`);
      await refreshData();
      setSelectedThemeId(null);
    } catch (err) {
      console.error("Theme change failed:", err);
      alert("테마 변경에 실패했습니다.");
    } finally {
      setUpdatingTheme(false);
    }
  };

  // Create Site with Theme Trigger
  const handleCreateWithTheme = (themeId: string) => {
    setIsCreatingNewSite(true);
    router.push(`/studio/client-site-builder/builder?theme=${themeId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Description */}
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="text-emerald-500" size={20} />
          <span>디자인 테마 라이브러리</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          워드프레스 테마 스토어처럼 전문가가 정교하게 코딩한 고품격 카테고리별 디자인 템플릿을 구경할 수 있습니다. 
          원하는 테마를 선택하면 폰트, 레이아웃, 컬러 에셋이 실시간 홈페이지에 즉시 반영됩니다.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-nowrap gap-2.5 overflow-x-auto pb-3 pt-1 border-b border-slate-100 dark:border-slate-800/80 scrollbar-thin select-none">
        {TEMPLATE_CATEGORIES.map((cat) => {
          // Color mapping for premium look
          const colors = ({
            All: {
              bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
              text: "text-emerald-600 dark:text-emerald-400",
              border: "border-emerald-500/20",
              hover: "hover:bg-emerald-500/15 hover:border-emerald-500/40",
              activeBg: "bg-emerald-500",
              activeText: "text-slate-950"
            },
            Blog: {
              bg: "bg-blue-500/5 dark:bg-blue-500/10",
              text: "text-blue-600 dark:text-blue-400",
              border: "border-blue-500/20",
              hover: "hover:bg-blue-500/15 hover:border-blue-500/40",
              activeBg: "bg-blue-500",
              activeText: "text-white"
            },
            Portfolio: {
              bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
              text: "text-indigo-600 dark:text-indigo-400",
              border: "border-indigo-500/20",
              hover: "hover:bg-indigo-500/15 hover:border-indigo-500/40",
              activeBg: "bg-indigo-500",
              activeText: "text-white"
            },
            Business: {
              bg: "bg-slate-500/5 dark:bg-slate-500/10",
              text: "text-slate-600 dark:text-slate-400",
              border: "border-slate-500/20",
              hover: "hover:bg-slate-500/15 hover:border-slate-500/40",
              activeBg: "bg-slate-600 dark:bg-slate-500",
              activeText: "text-white"
            },
            Store: {
              bg: "bg-amber-500/5 dark:bg-amber-500/10",
              text: "text-amber-600 dark:text-amber-400",
              border: "border-amber-500/20",
              hover: "hover:bg-amber-500/15 hover:border-amber-500/40",
              activeBg: "bg-amber-500",
              activeText: "text-slate-950"
            },
            "Art & Design": {
              bg: "bg-rose-500/5 dark:bg-rose-500/10",
              text: "text-rose-600 dark:text-rose-400",
              border: "border-rose-500/20",
              hover: "hover:bg-rose-500/15 hover:border-rose-500/40",
              activeBg: "bg-rose-500",
              activeText: "text-white"
            },
            "Real Estate": {
              bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
              text: "text-cyan-600 dark:text-cyan-400",
              border: "border-cyan-500/20",
              hover: "hover:bg-cyan-500/15 hover:border-cyan-500/40",
              activeBg: "bg-cyan-500",
              activeText: "text-slate-950"
            },
            "Health & Wellness": {
              bg: "bg-teal-500/5 dark:bg-teal-500/10",
              text: "text-teal-600 dark:text-teal-400",
              border: "border-teal-500/20",
              hover: "hover:bg-teal-500/15 hover:border-teal-500/40",
              activeBg: "bg-teal-500",
              activeText: "text-slate-950"
            },
            Education: {
              bg: "bg-sky-500/5 dark:bg-sky-500/10",
              text: "text-sky-600 dark:text-sky-400",
              border: "border-sky-500/20",
              hover: "hover:bg-sky-500/15 hover:border-sky-500/40",
              activeBg: "bg-sky-500",
              activeText: "text-slate-950"
            },
            Magazine: {
              bg: "bg-violet-500/5 dark:bg-violet-500/10",
              text: "text-violet-600 dark:text-violet-400",
              border: "border-violet-500/20",
              hover: "hover:bg-violet-500/15 hover:border-violet-500/40",
              activeBg: "bg-violet-500",
              activeText: "text-white"
            },
            Music: {
              bg: "bg-fuchsia-500/5 dark:bg-fuchsia-500/10",
              text: "text-fuchsia-600 dark:text-fuchsia-400",
              border: "border-fuchsia-500/20",
              hover: "hover:bg-fuchsia-500/15 hover:border-fuchsia-500/40",
              activeBg: "bg-fuchsia-500",
              activeText: "text-white"
            },
            Restaurant: {
              bg: "bg-orange-500/5 dark:bg-orange-500/10",
              text: "text-orange-600 dark:text-orange-400",
              border: "border-orange-500/20",
              hover: "hover:bg-orange-500/15 hover:border-orange-500/40",
              activeBg: "bg-orange-500",
              activeText: "text-white"
            },
            "Travel & Lifestyle": {
              bg: "bg-green-500/5 dark:bg-green-500/10",
              text: "text-green-600 dark:text-green-400",
              border: "border-green-500/20",
              hover: "hover:bg-green-500/15 hover:border-green-500/40",
              activeBg: "bg-green-500",
              activeText: "text-white"
            },
            "Fashion & Beauty": {
              bg: "bg-pink-500/5 dark:bg-pink-500/10",
              text: "text-pink-600 dark:text-pink-400",
              border: "border-pink-500/20",
              hover: "hover:bg-pink-500/15 hover:border-pink-500/40",
              activeBg: "bg-pink-500",
              activeText: "text-white"
            },
            "Community & Non-Profit": {
              bg: "bg-red-500/5 dark:bg-red-500/10",
              text: "text-red-600 dark:text-red-400",
              border: "border-red-500/25",
              hover: "hover:bg-red-500/15 hover:border-red-500/40",
              activeBg: "bg-red-500",
              activeText: "text-white"
            },
            Entertainment: {
              bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
              text: "text-yellow-600 dark:text-yellow-400",
              border: "border-yellow-500/25",
              hover: "hover:bg-yellow-500/15 hover:border-yellow-500/40",
              activeBg: "bg-yellow-500",
              activeText: "text-slate-950"
            }
          } as Record<string, { bg: string, text: string, border: string, hover: string, activeBg: string, activeText: string }>)[cat] || {
            bg: "bg-slate-50 dark:bg-slate-900/60",
            text: "text-slate-600 dark:text-slate-400",
            border: "border-slate-200 dark:border-slate-800",
            hover: "hover:bg-slate-100 dark:hover:bg-slate-850",
            activeBg: "bg-slate-900",
            activeText: "text-white"
          };

          const isActive = (cat === "All" && activeCategory === "All") || activeCategory.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap select-none ${
                isActive
                  ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-sm font-black scale-102`
                  : `${colors.bg} ${colors.text} ${colors.border} ${colors.hover}`
              }`}
            >
              {cat === "All" ? "전체 테마" : cat}
            </button>
          );
        })}
      </div>

      {/* WordPress-style Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((temp) => {
          const isCurrentlyActive = selectedSite?.template_id === temp.templateId;
          return (
            <div
              key={temp.templateId}
              onClick={() => setSelectedThemeId(temp.templateId)}
              className={`group bg-white dark:bg-[#0b0f19] border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
                isCurrentlyActive
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-750"
              }`}
            >
              {/* Theme Mockup Preview */}
              <div className="h-44 bg-slate-100 dark:bg-slate-900/50 relative overflow-hidden flex items-center justify-center">
                {temp.image ? (
                  <>
                    <img
                      src={temp.image}
                      alt={temp.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Watermark to prevent theft & show branding */}
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[8px] font-black tracking-widest rounded bg-slate-950/60 text-white/55 border border-white/5 select-none pointer-events-none backdrop-blur-[1px] uppercase z-10">
                      creaibox.com
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-300 dark:text-slate-700">
                    <Layers size={32} />
                    <span className="text-[10px] font-bold mt-2">미리보기 이미지 준비 중</span>
                  </div>
                )}
                
                {/* Active check overlay badge */}
                {isCurrentlyActive && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-black tracking-wider rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md animate-fade-in">
                    <Check size={10} strokeWidth={3} />
                    <span>사용 중</span>
                  </span>
                )}

                {/* Category tag */}
                <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-bold rounded-md bg-slate-900/80 text-white backdrop-blur-sm">
                  {temp.category}
                </span>

                {/* Quick preview hover trigger */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 text-xs font-bold text-slate-900 bg-white rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 size={12} />
                    <span>테마 상세 보기</span>
                  </span>
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 flex-grow flex flex-col justify-between bg-white dark:bg-[#0b0f19]">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {temp.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {temp.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Theme Detailed Preview Drawer / Modal */}
      {selectedThemeId && activePreviewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-6 animate-fade-in">
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/90 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 rounded-md uppercase">
                  {activePreviewTheme.category}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{activePreviewTheme.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Previous / Next Template Navigation Buttons */}
                <div className="flex items-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden mr-1 shadow-sm">
                  <button
                    onClick={handlePrevTheme}
                    title="이전 테마 (←)"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95 transition-all border-r border-slate-250 dark:border-slate-800/80"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextTheme}
                    title="다음 테마 (→)"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedThemeId(null)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Content Split Grid */}
            <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Mockup Image */}
              <div className="md:col-span-7 bg-slate-100 dark:bg-slate-950 p-6 flex items-center justify-center border-r border-slate-100 dark:border-slate-800/80 min-h-[320px]">
                {activePreviewTheme.image ? (
                  <div className="relative max-w-full max-h-[60vh] rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img
                      src={activePreviewTheme.image}
                      alt={activePreviewTheme.name}
                      className="object-contain w-full h-full"
                    />
                    {/* Watermark to prevent theft & show branding */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[9px] font-extrabold tracking-widest rounded bg-slate-950/70 text-white/60 border border-white/10 select-none pointer-events-none backdrop-blur-[2px] uppercase">
                      creaibox.com
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Layers size={48} className="mb-2" />
                    <span className="text-xs font-bold">미리보기 이미지 준비 중</span>
                  </div>
                )}
              </div>

              {/* Right Side: Theme Details */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-[#0b0f19] space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">테마 설명</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {activePreviewTheme.description}
                    </p>
                  </div>

                  {/* Style Specs */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">디자인 명세 (Design Specifications)</span>
                    
                    {/* Color swatches */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block">컬러 스키마</span>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(activePreviewTheme.theme.colors).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1.5 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/60 rounded-full px-2 py-1">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-200 dark:border-slate-750 shadow-sm block" style={{ backgroundColor: val }} />
                            <span className="text-[9px] font-bold text-slate-500 capitalize">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fonts & other attributes */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-semibold block">기본 폰트</span>
                        <span className="text-slate-800 dark:text-slate-250 truncate block">
                          {activePreviewTheme.theme.fontFamily.split(",")[0]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-semibold block">모서리 곡률</span>
                        <span className="text-slate-800 dark:text-slate-250 block">
                          {activePreviewTheme.theme.borderRadius.replace("rounded-", "") || "None"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-semibold block">반투명 효과(Glass)</span>
                        <span className="text-slate-800 dark:text-slate-250 block">
                          {activePreviewTheme.theme.glassmorphism ? "활성화" : "비활성화"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action buttons */}
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/85">
                  {/* Option 1: Apply to active site (if site exists and is not currently active) */}
                  {selectedSite && selectedSite.template_id !== activePreviewTheme.templateId && (
                    <button
                      onClick={() => handleChangeTheme(activePreviewTheme.templateId)}
                      disabled={updatingTheme}
                      className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {updatingTheme ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          <span>테마 적용 중...</span>
                        </>
                      ) : (
                        <>
                          <span>이 테마를 현재 내 홈페이지에 적용하기</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  )}

                  {/* Indicator if this is the active theme */}
                  {selectedSite && selectedSite.template_id === activePreviewTheme.templateId && (
                    <div className="flex items-center gap-2 justify-center py-3 text-xs font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                      <Check size={14} strokeWidth={3} />
                      <span>현재 홈페이지에 적용되어 운영 중인 테마입니다.</span>
                    </div>
                  )}

                  {/* Option 2: Create a new website with this theme */}
                  <button
                    onClick={() => handleCreateWithTheme(activePreviewTheme.templateId)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="text-emerald-500" size={14} />
                    <span>이 테마로 새 홈페이지 개설하기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
