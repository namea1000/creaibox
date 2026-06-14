"use client";

import React from "react";
import type { LyricsHubCategory, LyricsHubSubTopic } from "@/lib/music-lyrics-planner/types";

interface CategoryNavProps {
  selectedGroup: "장르별 대분류" | "테마별 대분류";
  setSelectedGroup: (group: "장르별 대분류" | "테마별 대분류") => void;
  categories: LyricsHubCategory[];
  selectedCategoryId: string;
  onSelectCategory: (id: string, group: "장르별 대분류" | "테마별 대분류") => void;
  subTopics: LyricsHubSubTopic[];
  selectedSubTopicId: string;
  onSelectSubTopic: (id: string) => void;
  getCategoryCount: (catId: string) => number;
  getSubTopicCount: (subId: string) => number;
}

export default function CategoryNav({
  selectedGroup,
  setSelectedGroup,
  categories,
  selectedCategoryId,
  onSelectCategory,
  subTopics,
  selectedSubTopicId,
  onSelectSubTopic,
  getCategoryCount,
  getSubTopicCount,
}: CategoryNavProps) {
  const groups: ("장르별 대분류" | "테마별 대분류")[] = ["장르별 대분류", "테마별 대분류"];

  // Filter categories by the active group
  const filteredCategories = categories.filter((c) => c.group === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Group Switcher Tabs */}
      <div className="flex border-b border-zinc-800">
        {groups.map((group) => {
          const isActive = selectedGroup === group;
          return (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`relative pb-3.5 px-6 text-sm font-black transition duration-150 ${
                isActive ? "text-rose-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {group}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Categories Grid with visual light-up feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id, cat.group)}
              className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 backdrop-blur-sm ${
                isSelected
                  ? "border-rose-500/80 bg-gradient-to-br from-rose-500/10 to-transparent shadow-[0_0_25px_rgba(244,63,94,0.12)]"
                  : "border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
              }`}
            >
              {/* Category Count Badge */}
              <span className="absolute top-4 right-4 text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                {count}개
              </span>

              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition duration-150">{cat.emoji}</span>
                <div>
                  <h3 className={`font-black text-sm transition-colors ${isSelected ? "text-rose-300" : "text-white group-hover:text-rose-300"}`}>
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400 transition-colors">
                    {cat.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtopics row chips */}
      {subTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
          {subTopics.map((sub) => {
            const isSelected = selectedSubTopicId === sub.id;
            const count = getSubTopicCount(sub.id);

            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubTopic(sub.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "border-rose-500 bg-rose-500/10 text-rose-300"
                    : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <span>{sub.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded bg-zinc-800/60 ${isSelected ? "text-rose-300 bg-rose-950/20" : "text-zinc-500"}`}>
                  {count}개
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
