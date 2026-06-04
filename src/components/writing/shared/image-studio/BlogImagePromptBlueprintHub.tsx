"use client";

import React from "react";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import { promptTemplates } from "./blogImageConstants";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeCategory: string | null;
  setActiveCategory: React.Dispatch<React.SetStateAction<string | null>>;
  setImagePrompt: React.Dispatch<React.SetStateAction<string>>;
}

export default function BlogImagePromptBlueprintHub({
  isOpen,
  setIsOpen,
  activeCategory,
  setActiveCategory,
  setImagePrompt,
}: Props) {
  return (
    <div className="flex flex-col border-t border-zinc-800/60">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/60 bg-slate-950/40 px-4 text-left transition-all hover:bg-amber-500/5"
      >
        <span className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.15em] text-amber-400">
          <Tag size={13} /> Prompt Blueprint Hub
        </span>
        {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      </button>

      {isOpen && (
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {Object.entries(promptTemplates).map(([key, value]) => {
            const active = activeCategory === key;

            return (
              <div key={key} className="border-b border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setActiveCategory((current) => (current === key ? null : key))}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-black transition-all ${
                    active
                      ? "bg-amber-500/10 text-amber-300"
                      : "text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-100"
                  }`}
                >
                  <span>{value.categoryLabel}</span>
                  <span className="text-amber-400/80">{active ? "접기" : "펼치기"}</span>
                </button>

                {active && (
                  <div className="border-t border-zinc-800/60">
                    {value.items.map((template, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImagePrompt(template)}
                        className="grid w-full grid-cols-[42px_minmax(0,1fr)] items-center border-b border-zinc-900/80 px-4 py-3 text-left text-[13px] font-medium leading-relaxed text-zinc-400 transition-all last:border-b-0 hover:bg-amber-500/5 hover:text-zinc-100"
                      >
                        <span className="font-mono font-bold text-amber-500/70">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <span>{template}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}