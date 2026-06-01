"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { StudioManuscriptRecord } from "@/lib/queries/manuscripts";

interface CreaiboxSeoOptimizationPanelProps {
  data: StudioManuscriptRecord;
  updateLocalData: (patch: Partial<StudioManuscriptRecord>) => void;
}

function toTagList(value?: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export default function CreaiboxSeoOptimizationPanel({
  data,
  updateLocalData,
}: CreaiboxSeoOptimizationPanelProps) {
  const [isSnippetOpen, setIsSnippetOpen] = useState(true);

  return (
    <div className="pb-6">
      <button
        type="button"
        onClick={() => setIsSnippetOpen((open) => !open)}
        className="flex h-12 w-full items-center justify-between border-b border-zinc-800 px-5 text-left transition hover:bg-white/[0.03]"
      >
        <span className="text-sm font-black text-white">
          스니펫 편집
        </span>
        {isSnippetOpen ? (
          <ChevronUp className="h-4 w-4 text-white/70" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/70" />
        )}
      </button>

      {isSnippetOpen && (
        <div className="space-y-4 px-5 pt-4">
      <label className="block">
        <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
          <span>슬러그 (Slug)</span>
          <span className="text-xs font-medium text-white/45">
            {(data.slug || "").length}
          </span>
        </div>
        <input
          value={data.slug || ""}
          onChange={(event) => updateLocalData({ slug: event.target.value })}
          className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
          <span>Meta Description</span>
          <span className="text-xs font-medium text-white/45">
            {(data.metaDescription || "").length}/155
          </span>
        </div>
        <textarea
          value={data.metaDescription || ""}
          onChange={(event) => updateLocalData({ metaDescription: event.target.value })}
          className="min-h-[110px] w-full resize-none rounded-xl border border-transparent bg-white px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
          <span>Focus Keyword</span>
          <span className="text-xs font-medium text-white/45">
            {(data.focusKeyword || "").length}
          </span>
        </div>
        <input
          value={data.focusKeyword || ""}
          onChange={(event) => updateLocalData({ focusKeyword: event.target.value })}
          className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[#111111] outline-none"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
          <span>Canonical URL</span>
          <span className="text-xs font-medium text-white/45">
            {(data.canonicalUrl || "").length}
          </span>
        </div>
        <input
          value={data.canonicalUrl || ""}
          onChange={(event) => updateLocalData({ canonicalUrl: event.target.value })}
          className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-[#111111] outline-none"
        />
      </label>

      <label className="block">
        <div className="mb-1.5 flex items-center justify-between text-sm font-semibold text-white/75">
          <span>SEO Tags</span>
          <span className="text-xs font-medium text-white/45">
            {toTagList(data.seoTags).length}
          </span>
        </div>
        <textarea
          value={toTagList(data.seoTags).join(", ")}
          onChange={(event) =>
            updateLocalData({
              seoTags: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          className="min-h-[90px] w-full resize-none rounded-xl border border-transparent bg-white px-4 py-3 text-sm leading-relaxed text-[#111111] outline-none"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {toTagList(data.seoTags).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200"
          >
            #{tag}
          </span>
        ))}
      </div>
        </div>
      )}
    </div>
  );
}
