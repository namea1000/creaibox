"use client";

import { Compass } from "lucide-react";

import type { ContentPlatform } from "@/lib/content-planner/types";

type PlatformOption = {
  label: ContentPlatform;
  icon: React.ElementType;
};

type ContentPlatformPanelProps = {
  platforms: PlatformOption[];
  selectedPlatforms: ContentPlatform[];
  onTogglePlatform: (platform: ContentPlatform) => void;
};

export default function ContentPlatformPanel({
  platforms,
  selectedPlatforms,
  onTogglePlatform,
}: ContentPlatformPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-300">
          <Compass size={18} />
        </div>
        <h2 className="text-sm font-black text-white">콘텐츠 배포 채널</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const active = selectedPlatforms.includes(platform.label);

          return (
            <button
              key={platform.label}
              type="button"
              onClick={() => onTogglePlatform(platform.label)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${active
                  ? "border-cyan-300 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-black/20 text-slate-400 hover:border-white/30"
                }`}
            >
              <Icon size={14} className="shrink-0" />
              <span className="text-[11px] font-bold leading-none truncate">
                {platform.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}