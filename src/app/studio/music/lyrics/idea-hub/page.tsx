"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";

import { topicCategories, topicSubTopics } from "@/lib/music-lyrics-planner/topic-categories";
import { musicLyricsHubSeries } from "@/lib/music-lyrics-planner/topic-series";

import IdeaHubHero from "./components/IdeaHubHero";
import CategoryNav from "./components/CategoryNav";
import TemplateGrid from "./components/TemplateGrid";
import SidebarPanel from "./components/SidebarPanel";

function MusicLyricsIdeaHubContent() {
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<"장르별 대분류" | "테마별 대분류">("장르별 대분류");
  const [selectedCategoryId, setSelectedCategoryId] = useState("citypop");
  const [selectedSubTopicId, setSelectedSubTopicId] = useState("midnight-drive");

  // Read initial search query from URL if present
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setKeyword(q);
    }
  }, [searchParams]);

  // Synchronize category selection when keyword search finds a matching subtopic
  useEffect(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return;

    let matchedSub = topicSubTopics.find(
      (sub) => sub.name.toLowerCase() === query
    );

    if (!matchedSub) {
      matchedSub = topicSubTopics.find(
        (sub) =>
          sub.name.toLowerCase().includes(query) ||
          query.includes(sub.name.toLowerCase()) ||
          sub.keywords.some((kw) => {
            const kwLow = kw.toLowerCase();
            return kwLow === query || kwLow.includes(query) || query.includes(kwLow);
          })
      );
    }

    if (matchedSub) {
      setSelectedSubTopicId(matchedSub.id);
      setSelectedCategoryId(matchedSub.categoryId);
      const cat = topicCategories.find((c) => c.id === matchedSub.categoryId);
      if (cat) {
        setSelectedGroup(cat.group);
      }
    }
  }, [keyword]);

  const handleSelectCategory = (catId: string, group: "장르별 대분류" | "테마별 대분류") => {
    setSelectedCategoryId(catId);
    setSelectedGroup(group);
    const firstSub = topicSubTopics.find((s) => s.categoryId === catId);
    setSelectedSubTopicId(firstSub ? firstSub.id : "");
    setKeyword("");
  };

  const getCategoryCount = (catId: string) => {
    return musicLyricsHubSeries.filter((item) => item.categoryId === catId).length;
  };

  const getSubTopicCount = (subId: string) => {
    return musicLyricsHubSeries.filter((item) => item.subTopicId === subId).length;
  };

  const subTopics = useMemo(() => {
    return topicSubTopics.filter((sub) => sub.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const selectedSubTopicName = useMemo(() => {
    const sub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
    return sub ? sub.name : "전체 템플릿";
  }, [selectedSubTopicId]);

  const filteredTemplates = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (normalized) {
      const selectedSub = topicSubTopics.find((s) => s.id === selectedSubTopicId);
      if (
        selectedSub &&
        (normalized === selectedSub.name.trim().toLowerCase() ||
          selectedSub.name.trim().toLowerCase().includes(normalized) ||
          normalized.includes(selectedSub.name.trim().toLowerCase()) ||
          selectedSub.keywords.some((kw) => {
            const kwLow = kw.toLowerCase();
            return kwLow === normalized || kwLow.includes(normalized) || normalized.includes(kwLow);
          }))
      ) {
        return musicLyricsHubSeries.filter((item) => item.subTopicId === selectedSubTopicId);
      }

      return musicLyricsHubSeries.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.lyricsBackground.toLowerCase().includes(normalized) ||
          item.placeSetting.toLowerCase().includes(normalized) ||
          item.vocal.toLowerCase().includes(normalized) ||
          item.instrument.toLowerCase().includes(normalized) ||
          item.tempo.toLowerCase().includes(normalized) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(normalized)) ||
          item.description.toLowerCase().includes(normalized)
        );
      });
    }

    if (selectedSubTopicId) {
      return musicLyricsHubSeries.filter((item) => item.subTopicId === selectedSubTopicId);
    }

    return musicLyricsHubSeries.filter((item) => item.categoryId === selectedCategoryId);
  }, [keyword, selectedCategoryId, selectedSubTopicId]);

  return (
    <div className="min-h-full bg-[#06080d] px-4 py-6 text-zinc-100 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <IdeaHubHero
          keyword={keyword}
          setKeyword={setKeyword}
          categories={topicCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          totalTemplates={musicLyricsHubSeries.length}
        />

        <CategoryNav
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          categories={topicCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          subTopics={subTopics}
          selectedSubTopicId={selectedSubTopicId}
          onSelectSubTopic={setSelectedSubTopicId}
          getCategoryCount={getCategoryCount}
          getSubTopicCount={getSubTopicCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4 border-t border-zinc-900">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 px-1">
              <h3 className="text-xs font-black text-zinc-400 uppercase flex items-center gap-1.5">
                <Flame size={14} className="text-rose-500 animate-pulse" />
                가사 테마 템플릿
              </h3>
              <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full">
                {keyword ? "검색 결과" : selectedSubTopicName} · {filteredTemplates.length}개
              </span>
            </div>
            <TemplateGrid templates={filteredTemplates} />
          </div>
          <div>
            <SidebarPanel templates={musicLyricsHubSeries} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MusicLyricsIdeaHubPage() {
  return (
    <Suspense fallback={null}>
      <MusicLyricsIdeaHubContent />
    </Suspense>
  );
}
