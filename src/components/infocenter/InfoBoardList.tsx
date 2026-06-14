"use client";

import React, { useMemo } from "react";
import {
  MessageSquare,
  User as UserIcon,
  AlertCircle,
  PenTool,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  Lightbulb,
  Users,
  BookOpenCheck,
  ArrowRight,
} from "lucide-react";

interface InfoBoardListProps {
  activeCategory: string;
  posts: any[];
  loading: boolean;
  onSelectPost: (id: string) => void;
  onWritePost: () => void;
  onSelectCategory: (category: string) => void;
}

const boardConfigs = [
  { id: "notice", title: "NOTICE", icon: Bell, color: "from-amber-500 to-yellow-500", labelColor: "text-amber-400" },
  { id: "free", title: "FREE LOUNGE", icon: MessageSquare, color: "from-blue-600 to-cyan-500", labelColor: "text-blue-400" },
  { id: "qna", title: "Q&A STATION", icon: HelpCircle, color: "from-violet-600 to-fuchsia-500", labelColor: "text-violet-400" },
  { id: "tips", title: "MASTER TIPS", icon: Lightbulb, color: "from-rose-600 to-orange-500", labelColor: "text-rose-400" },
  { id: "showcase", title: "SHOWCASE", icon: Users, color: "from-emerald-600 to-teal-500", labelColor: "text-emerald-400" },
  { id: "faq", title: "FAQ STATION", icon: BookOpenCheck, color: "from-indigo-600 to-blue-500", labelColor: "text-indigo-400" },
];

const categoryLabelMap: Record<string, { label: string; color: string }> = {
  notice: { label: "NOTICE", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  free: { label: "FREE LOUNGE", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  qna: { label: "Q&A STATION", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  tips: { label: "MASTER TIPS", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  showcase: { label: "SHOWCASE", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  faq: { label: "FAQ STATION", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
};

export default function InfoBoardList({
  activeCategory = "all",
  posts,
  loading,
  onSelectPost,
  onWritePost,
  onSelectCategory,
}: InfoBoardListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPosts = useMemo(() => {
    const basePosts =
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.post_type === activeCategory);

    if (!searchQuery.trim()) return basePosts;
    const q = searchQuery.toLowerCase();
    return basePosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.user_nickname || "").toLowerCase().includes(q)
    );
  }, [posts, activeCategory, searchQuery]);

  // Group posts by category for the "전체 피드" grid view
  const groupedPosts = useMemo(() => {
    const groups: Record<string, any[]> = {
      notice: [],
      free: [],
      qna: [],
      tips: [],
      showcase: [],
      faq: [],
    };

    filteredPosts.forEach((post) => {
      if (groups[post.post_type]) {
        groups[post.post_type].push(post);
      }
    });

    // Keep only top 5 posts per category
    Object.keys(groups).forEach((key) => {
      groups[key] = groups[key].slice(0, 5);
    });

    return groups;
  }, [filteredPosts]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 bg-zinc-900/10 rounded-2xl opacity-40 font-black tracking-widest uppercase text-xs text-zinc-400">
        <div className="animate-spin mb-4 text-xl">⌛</div>
        Loading Feed...
      </div>
    );
  }

  // 🌟 Render 3 rows x 2 columns grid when category is "all"
  if (activeCategory === "all") {
    return (
      <div className="space-y-6 text-left">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800/60 backdrop-blur-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="전체 피드 내 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-blue-500/50"
            />
          </div>

          <button
            onClick={onWritePost}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-lg active:scale-95 overflow-hidden font-sans"
          >
            <PenTool size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest italic">Write Post</span>
          </button>
        </div>

        {/* 3x2 Grid for 6 boards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {boardConfigs.map((board) => {
            const Icon = board.icon;
            const categoryPosts = groupedPosts[board.id] || [];

            // Pad array to exactly 5 elements with null values to maintain aligned board height
            const paddedRows = [...categoryPosts];
            while (paddedRows.length < 5) {
              paddedRows.push(null);
            }

            return (
              <section
                key={board.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-850 bg-[#090d16]/20 p-4 hover:border-zinc-800 transition shadow-lg h-[268px]"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900/40 pb-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${board.color} text-white shadow-md`}>
                        <Icon size={18} />
                      </div>
                      <button
                        onClick={() => onSelectCategory(board.id)}
                        className={`text-xs font-black tracking-wider transition-colors hover:text-blue-400 ${board.labelColor}`}
                      >
                        {board.title}
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onSelectCategory(board.id)}
                        className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5"
                      >
                        더보기
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Top 5 list with divider lines */}
                  <div className="divide-y divide-zinc-800/30 font-sans">
                    {paddedRows.map((post, idx) => {
                      if (post) {
                        return (
                          <div
                            key={post.id}
                            onClick={() => onSelectPost(post.id)}
                            className="flex items-center justify-between text-xs h-[38px] px-2.5 hover:bg-zinc-900/40 cursor-pointer group/item transition-all"
                          >
                            <span className="text-zinc-300 group-hover/item:text-blue-400 transition truncate max-w-[80%] font-bold">
                              {post.title}
                              {post.comment_count > 0 && (
                                <span className="text-[9px] text-blue-400 font-bold ml-1.5 bg-blue-500/10 px-1 py-0.2 rounded">
                                  {post.comment_count}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-zinc-650 font-semibold shrink-0">
                              {new Date(post.created_at).toLocaleDateString("ko-KR", {
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </span>
                          </div>
                        );
                      } else {
                        // Empty spacer row with divider preservation
                        return (
                          <div
                            key={`empty-${idx}`}
                            className="h-[38px]"
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  // 🌟 Render standard table when category is not "all"
  return (
    <div className="space-y-4 text-left">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800/60 backdrop-blur-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="카테고리 내 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-blue-500/50"
          />
        </div>

        <button
          onClick={onWritePost}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-lg active:scale-95 overflow-hidden font-sans"
        >
          <PenTool size={14} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest italic">Write Post</span>
        </button>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/30 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="text-[10px] font-black uppercase tracking-widest border-b bg-zinc-900/40 border-zinc-800/50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4 w-32">분류</th>
                  <th className="px-6 py-4">제목</th>
                  <th className="px-6 py-4 text-center w-20">조회</th>
                  <th className="px-6 py-4 text-center w-20">추천</th>
                  <th className="px-6 py-4 text-right w-28">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {filteredPosts.map((post) => {
                  const catInfo = categoryLabelMap[post.post_type] || {
                    label: post.post_type?.toUpperCase() || "FREE",
                    color: "bg-zinc-800/20 text-zinc-400 border-zinc-800",
                  };
                  return (
                    <tr
                      key={post.id}
                      onClick={() => onSelectPost(post.id)}
                      className="group cursor-pointer transition hover:bg-zinc-900/30"
                    >
                      <td className="px-6 py-4.5 align-middle">
                        <span
                          className={`text-[9px] font-black px-2 py-0.8 rounded-md border tracking-wider ${catInfo.color}`}
                        >
                          {catInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 align-middle">
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition flex items-center gap-2">
                            {post.title}
                            {post.comment_count > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                                <MessageSquare size={9} />
                                {post.comment_count}
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 mt-1">
                            <UserIcon size={10} />
                            {post.user_nickname || post.user_email?.split("@")[0] || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-center text-xs font-bold text-zinc-500 align-middle">
                        {post.view_count || 0}
                      </td>
                      <td className="px-6 py-4.5 text-center text-xs font-bold text-zinc-500 align-middle">
                        {post.like_count || 0}
                      </td>
                      <td className="px-6 py-4.5 text-right text-xs font-bold text-zinc-500 align-middle">
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed flex flex-col items-center justify-center py-20 border-zinc-800/80 bg-zinc-950/20">
          <AlertCircle className="text-zinc-700 mb-3" size={36} />
          <p className="text-zinc-500 text-xs font-black italic uppercase tracking-wider">
            No posts found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
