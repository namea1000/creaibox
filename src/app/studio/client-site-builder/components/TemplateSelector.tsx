"use client";

import React, { useState } from "react";
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from "@/lib/templates/registry";
import { Check, Eye, Palette } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
  selectedTemplateId,
  onSelect
}: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const templates = Object.values(TEMPLATE_REGISTRY);

  const filteredTemplates = templates.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Palette className="text-emerald-500" size={20} />
          <span>디자인 템플릿 테마 변경</span>
        </h2>
        
        {/* WordPress-like Category Tabs */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-thin select-none">
          {TEMPLATE_CATEGORIES.map((cat) => {
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
                border: "border-red-500/20",
                hover: "hover:bg-red-500/15 hover:border-red-500/40",
                activeBg: "bg-red-500",
                activeText: "text-white"
              },
              Entertainment: {
                bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
                text: "text-yellow-600 dark:text-yellow-400",
                border: "border-yellow-500/20",
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

            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold transition-all rounded-xl border whitespace-nowrap select-none cursor-pointer ${
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
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isSelected = template.templateId === selectedTemplateId;
          const colors = template.theme.colors;

          return (
            <div
              key={template.templateId}
              onClick={() => onSelect(template.templateId)}
              className={`group relative overflow-hidden bg-white dark:bg-[#0b0f19] border rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-[var(--primary)] dark:border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700"
              }`}
              style={{ "--primary": colors.primary } as React.CSSProperties}
            >
              {/* Category Badge */}
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 rounded-full mb-3">
                {template.category}
              </span>

              {/* Template Title */}
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-[var(--primary)] transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Theme Palette Bar */}
              <div className="flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">팔레트</span>
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: colors.primary }} title="Primary" />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: colors.secondary }} title="Secondary" />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: colors.accent }} title="Accent" />
                <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: colors.surface }} title="Surface" />
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm animate-scale-in">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
