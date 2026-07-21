"use client";

import React, { useState, useEffect } from "react";
import { useSiteBuilder } from "../context";
import { createClient } from "@/utils/supabase/client";
import { FileText, Newspaper, Calendar, User, Eye, ArrowRight, Plus, Trash2, Pin, CheckCircle, Loader2, Link as LinkIcon, X, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  post_type: "notice" | "board";
  author_name: string;
  is_pinned: boolean;
  views: number;
  created_at: string;
}

export default function PagesAndPostsPage() {
  const { sites, selectedSite } = useSiteBuilder();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"pages" | "posts">("pages");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  // Write/Edit Post Modal State
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postType, setPostType] = useState<"notice" | "board">("board");
  const [postContent, setPostContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch blog posts and notices
  const fetchPosts = async () => {
    if (!selectedSite) return;
    setLoading(true);
    try {
      const [sitePostsRes, creaiboxPostsRes] = await Promise.all([
        supabase
          .from("site_posts")
          .select("*")
          .eq("site_id", selectedSite.id)
          .in("post_type", ["notice", "board"])
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase
          .from("writing_creaibox_posts")
          .select("id, title, content, created_at, canonical_url, published_snapshot")
          .eq("status", "published")
          .order("created_at", { ascending: false })
      ]);

      const sitePosts = sitePostsRes.data || [];
      const creaiboxPostsRaw = creaiboxPostsRes.data || [];

      // Filter CreAibox AI posts matching this brand_id
      const bId = selectedSite.brand_id.toLowerCase();
      const creaiboxPosts = creaiboxPostsRaw
        .filter((p: any) => {
          if (!p.canonical_url) return false;
          const u = p.canonical_url.toLowerCase();
          return u.includes(`://${bId}.`) || u.includes(`://${bId}:`);
        })
        .map((p: any) => {
          const snap = p.published_snapshot || {};
          return {
            id: p.id,
            title: snap.title || p.title || "제목 없음",
            content: snap.content || p.content || "",
            post_type: "board" as const,
            author_name: selectedSite.company_name + " (CreAibox AI)",
            is_pinned: false,
            views: 0,
            created_at: p.created_at
          };
        });

      setPosts([...sitePosts, ...creaiboxPosts]);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSite && activeTab === "posts") {
      fetchPosts();
    }
  }, [selectedSite, activeTab]);

  // Sync default author name with company name
  useEffect(() => {
    if (selectedSite) {
      setAuthorName(selectedSite.company_name);
    }
  }, [selectedSite]);

  // If no sites exist
  if (sites.length === 0 || !selectedSite) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
          <FileText size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">운영 중인 홈페이지가 없습니다</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            홈페이지를 개설하면 독립 서브 페이지 구조를 한눈에 모니터링하고, 공지사항 및 홍보용 마케팅 블로그 글을 자유롭게 발행할 수 있습니다.
          </p>
        </div>
        <Link
          href="/studio/client-site-builder/builder"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-955 rounded-xl transition-all"
        >
          <span>첫 홈페이지 제작하러 가기</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Create Post Action
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("제목과 본문을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("site_posts").insert({
        site_id: selectedSite.id,
        post_type: postType,
        title: postTitle.trim(),
        content: postContent.trim(),
        author_name: authorName.trim() || selectedSite.company_name,
        is_pinned: postType === "notice" ? isPinned : false,
        views: 0,
        extra_data: {},
      });

      if (error) throw error;
      alert("글이 홈페이지에 정상적으로 성공 발행되었습니다.");
      
      // Reset form
      setPostTitle("");
      setPostContent("");
      setIsPinned(false);
      setShowWriteModal(false);
      
      // Refresh list
      fetchPosts();
    } catch (err) {
      console.error("Publish post error:", err);
      alert("글 발행에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Post Action
  const handleDeletePost = async (postId: string) => {
    if (!confirm("정말로 이 포스트를 영구 삭제하시겠습니까? 삭제 즉시 홈페이지 노출에서 제외됩니다.")) return;
    try {
      const { error } = await supabase.from("site_posts").delete().eq("id", postId);
      if (error) throw error;
      alert("성공적으로 삭제되었습니다.");
      fetchPosts();
    } catch (err) {
      console.error("Delete post error:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // Toggle Pinned Status
  const handleTogglePin = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("site_posts")
        .update({ is_pinned: !post.is_pinned })
        .eq("id", post.id);

      if (error) throw error;
      fetchPosts();
    } catch (err) {
      console.error("Toggle pin error:", err);
    }
  };

  // Static site pages info
  const sitePages = [
    { name: "메인 홈페이지", slug: "/", desc: "방문자가 진입하는 대표 랜딩 화면입니다. 동적 섹션들이 연동됩니다.", status: "발행됨" },
    { name: "회사/기관 소개", slug: "/about", desc: "대표자 인사말, 조직 목표 및 주요 성과 지표(Stats)를 노출합니다.", status: "발행됨" },
    { name: "서비스 안내", slug: "/services", desc: "제공하는 비즈니스 핵심 강점 및 대표 품목 카드 리스트를 소개합니다.", status: "발행됨" },
    { name: "무료 상담/예약", slug: "/contact", desc: "방문자들의 상담 예약 및 성함, 연락처 등의 DB 접수 신청을 받습니다.", status: "발행됨" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "pages"
              ? "bg-slate-900 dark:bg-emerald-500/10 text-white dark:text-emerald-400 border-transparent dark:border-emerald-500/20"
              : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <FileText size={14} />
          <span>페이지 관리</span>
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "posts"
              ? "bg-slate-900 dark:bg-emerald-500/10 text-white dark:text-emerald-400 border-transparent dark:border-emerald-500/20"
              : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <Newspaper size={14} />
          <span>게시판 및 블로그 포스트 관리</span>
        </button>
      </div>

      {/* 1. Pages Management Tab */}
      {activeTab === "pages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sitePages.map((page) => {
            const livePageUrl = `http://${selectedSite.brand_id}.localhost:3000${page.slug === "/" ? "" : page.slug}`;
            return (
              <div
                key={page.slug}
                className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText size={16} className="text-emerald-500" />
                        <span>{page.name}</span>
                      </h3>
                      <code className="text-[10px] bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {page.slug}
                      </code>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {page.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {page.desc}
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-850">
                  <Link
                    href="/studio/client-site-builder/builder"
                    className="flex-1 py-2 text-center text-[11px] font-extrabold text-slate-600 bg-slate-50 dark:text-slate-300 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                  >
                    레이아웃 편집하기
                  </Link>
                  <a
                    href={livePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-center text-[11px] font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-450 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <span>바로가기</span>
                    <LinkIcon size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Blog Posts Management Tab */}
      {activeTab === "posts" && (
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="text-emerald-500" size={20} />
                <span>공지사항 및 블로그 관리</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                작성한 글은 내 브랜드 사이트의 하위 게시판 페이지 및 슬라이드 뉴스 섹션에 자동 적재 유동 노출됩니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Link
                href={`/studio/writing/creaibox/new-post?domain=${selectedSite.brand_id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:brightness-110 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>✍️ AI 블로그 글 작성 (크리에이박스 에디터)</span>
              </Link>

              <button
                onClick={() => setShowWriteModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-955 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={14} />
                <span>공지글 직접 작성</span>
              </button>
            </div>
          </div>

          {/* Posts Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin text-emerald-500 mb-3" size={32} />
              <span className="text-xs font-bold">포스트를 불러오는 중입니다...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-850 rounded-2xl">
              <Newspaper className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-300">발행된 포스트 없음</h3>
              <p className="text-xs text-slate-400 mt-1">첫 공지사항 또는 마케팅 홍보 블로그 글을 작성해 보세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold">
                    <th className="py-3 px-4">구분</th>
                    <th className="py-3 px-4">제목</th>
                    <th className="py-3 px-4">작성자</th>
                    <th className="py-3 px-4">작성일</th>
                    <th className="py-3 px-4">조회수</th>
                    <th className="py-3 px-4 text-center">고정</th>
                    <th className="py-3 px-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850/30 text-slate-700 dark:text-slate-300 font-bold">
                  {posts.map((post) => {
                    const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-3.5 px-4 border-0">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              post.post_type === "notice"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}
                          >
                            {post.post_type === "notice" ? "공지사항" : "블로그"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 dark:text-white border-0 font-extrabold max-w-xs truncate">
                          {post.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-550 border-0 flex items-center gap-1 mt-1">
                          <User size={10} className="text-slate-400" />
                          <span>{post.author_name}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 border-0">{date}</td>
                        <td className="py-3.5 px-4 text-slate-400 border-0 flex items-center gap-1 mt-1">
                          <Eye size={10} className="text-slate-400" />
                          <span>{post.views || 0}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center border-0">
                          {post.post_type === "notice" ? (
                            <button
                              onClick={() => handleTogglePin(post)}
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                post.is_pinned
                                  ? "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10"
                                  : "text-slate-300 hover:text-slate-555 hover:bg-slate-50 dark:text-slate-700"
                              }`}
                              title={post.is_pinned ? "고정 해제" : "상단 고정"}
                            >
                              <Pin size={12} strokeWidth={post.is_pinned ? 3 : 2} />
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-800 text-[10px]">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right border-0">
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 rounded-md text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ➕ Write Post Modal Dialog */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/85 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 flex justify-between items-center">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="text-emerald-500" size={18} />
                <span>새로운 홍보 및 공지글 발행</span>
              </h2>
              <button
                onClick={() => setShowWriteModal(false)}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePublishPost} className="p-6 space-y-4 flex-grow overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Post type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">게시판 구분</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as "notice" | "board")}
                    className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3.5 py-3 focus:outline-none"
                  >
                    <option value="board">일반 홍보/마케팅 블로그 글</option>
                    <option value="notice">공식 공지사항 (Notice)</option>
                  </select>
                </div>

                {/* Author */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">작성자 명칭</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="작성자 닉네임 또는 회사명"
                    className="text-xs text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3.5 py-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">글 제목</label>
                <input
                  type="text"
                  required
                  placeholder="방문자의 시선을 사로잡는 제목을 작성해 보세요."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="text-xs text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3.5 py-3 focus:outline-none"
                />
              </div>

              {/* Content body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">상세 본문 내용</label>
                <textarea
                  required
                  rows={8}
                  placeholder="비즈니스 홍보 카피, 신학기 교육 개강 안내, 신메뉴 출시 소식 등 구체적인 상세 본문 내용을 정성껏 채워보세요."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="text-xs text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3.5 py-3 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Notice pin checkbox (only visible for notices) */}
              {postType === "notice" && (
                <div className="flex items-center gap-2 pt-2 animate-fade-in">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400"
                  />
                  <label htmlFor="isPinned" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1 select-none">
                    <Pin size={12} className="text-emerald-500" />
                    <span>이 공지사항을 최상단에 고정합니다.</span>
                  </label>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="flex-1 py-3.5 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3.5 text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-955 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>발행 중...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      <span>새 글 최종 발행하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
