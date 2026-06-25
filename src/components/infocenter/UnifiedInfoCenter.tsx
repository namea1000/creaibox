"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Bell,
  MessageSquare,
  HelpCircle,
  BookOpenCheck,
  Lightbulb,
  Users,
  Grid3X3,
  Sparkles,
} from "lucide-react";
import InfoBoardList from "./InfoBoardList";
import InfoBoardView from "./InfoBoardView";
import InfoBoardWrite from "./InfoBoardWrite";

const tabs = [
  { id: "all", label: "전체 피드", icon: Grid3X3, color: "text-zinc-400" },
  { id: "notice", label: "공지사항", icon: Bell, color: "text-red-400" },
  { id: "free", label: "자유게시판", icon: MessageSquare, color: "text-blue-400" },
  { id: "qna", label: "질문 & 답변", icon: HelpCircle, color: "text-violet-400" },
  { id: "tips", label: "전문가 팁", icon: Lightbulb, color: "text-rose-400" },
  { id: "showcase", label: "쇼케이스", icon: Users, color: "text-emerald-400" },
  { id: "faq", label: "자주 묻는 질문", icon: BookOpenCheck, color: "text-indigo-400" },
];

interface UnifiedInfoCenterProps {
  initialView: "list" | "view" | "write";
  initialCategory?: string;
  initialPostId?: string;
}

export default function UnifiedInfoCenter({
  initialView = "list",
  initialCategory = "all",
  initialPostId = "",
}: UnifiedInfoCenterProps) {
  const supabase = useMemo(() => createClient(), []);

  // Central views and routing state
  const [view, setView] = useState<"list" | "view" | "write">(initialView);
  const [category, setCategory] = useState(initialCategory);
  const [postId, setPostId] = useState<string | null>(initialPostId || null);

  // Global Posts database cache
  const [posts, setPosts] = useState<any[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  // Fetch all posts once
  const fetchAllPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          community_comments(count)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formattedData = data.map((post: any) => ({
          ...post,
          comment_count: post.community_comments?.[0]?.count || 0,
        }));
        setPosts(formattedData);
      }
    } catch (err) {
      console.error("전체 데이터 로딩 실패:", err);
    } finally {
      setGlobalLoading(false);
    }
  }, [supabase]);

  // Load posts and bind real-time subscription on mount
  useEffect(() => {
    fetchAllPosts();

    const channel = supabase
      .channel("global-infocenter-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts" },
        () => fetchAllPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllPosts, supabase]);

  // Synchronize state with history pops and initial mounts
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;

      if (path.includes("/studio/infocenter/view/")) {
        const id = path.split("/").pop() || "";
        setView("view");
        setPostId(id);
      } else if (path.includes("/studio/infocenter/list/")) {
        const cat = path.split("/").pop() || "all";
        setView("list");
        setCategory(cat);
        setPostId(null);
      } else if (path.includes("/studio/infocenter/writing")) {
        const params = new URLSearchParams(search);
        const editId = params.get("id");
        const catParam = params.get("category") || "free";
        setView("write");
        setPostId(editId);
        setCategory(catParam);
      } else {
        setView("list");
        setCategory("all");
        setPostId(null);
      }
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  const navigateToCategory = (catId: string) => {
    setCategory(catId);
    setView("list");
    setPostId(null);
    const targetUrl = catId === "all" ? "/studio/infocenter" : `/studio/infocenter/list/${catId}`;
    window.history.pushState(null, "", targetUrl);
  };

  const navigateToView = (id: string) => {
    setPostId(id);
    setView("view");
    window.history.pushState(null, "", `/studio/infocenter/view/${id}`);
  };

  const navigateToWriting = (id: string | null = null) => {
    setPostId(id);
    setView("write");
    const targetUrl = id
      ? `/studio/infocenter/writing?id=${id}`
      : `/studio/infocenter/writing?category=${category === "all" ? "free" : category}`;
    window.history.pushState(null, "", targetUrl);
  };

  const handleBack = () => {
    setView("list");
    setPostId(null);
    const targetUrl = category === "all" ? "/studio/infocenter" : `/studio/infocenter/list/${category}`;
    window.history.pushState(null, "", targetUrl);
  };

  // Find the selected post data from in-memory cache to load details instantly
  const selectedPostData = useMemo(() => {
    if (!postId) return null;
    return posts.find((p) => p.id === postId) || null;
  }, [posts, postId]);

  return (
    <div className="mx-auto max-w-7xl pb-20 text-zinc-100">
      {/* 1. Header Hero section */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#111827] p-7 shadow-2xl mb-8 text-left">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-400">
              <Sparkles size={15} />
              CreAibox Strategic Hub
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              정보센터 (Info Center)
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
              최신 AI 소식, 크리에이터들의 생생한 노하우 및 자유로운 토론을 한 눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Top Tab Menu Bar */}
      <div className="border-b border-zinc-800/80 mb-8 pb-0.5">
        <div className="flex overflow-x-auto space-x-1.5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateToCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl border-t border-x border-transparent transition-all shrink-0 cursor-pointer -mb-[1.5px] ${
                  isActive
                    ? "bg-[#090d16]/30 border-zinc-800 text-blue-400 font-black shadow-inner"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10"
                }`}
              >
                <TabIcon size={14} className={isActive ? "text-blue-400" : tab.color} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. View Switcher Board */}
      <div className="min-h-[450px]">
        {view === "list" && (
          <InfoBoardList
            activeCategory={category}
            posts={posts}
            loading={globalLoading}
            onSelectPost={navigateToView}
            onWritePost={() => navigateToWriting(null)}
            onSelectCategory={navigateToCategory}
          />
        )}

        {view === "view" && (
          <InfoBoardView
            postId={postId!}
            initialPostData={selectedPostData}
            onBack={handleBack}
            onEdit={() => navigateToWriting(postId)}
            onDeleted={handleBack}
          />
        )}

        {view === "write" && (
          <InfoBoardWrite
            postId={postId}
            initialPostData={selectedPostData}
            initialCategory={category}
            onBack={handleBack}
            onSaveSuccess={handleBack}
          />
        )}
      </div>
    </div>
  );
}
