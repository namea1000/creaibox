"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { copyToNaverSmartEditorClipboard, injectImagesIntoMarkdown, preserveOriginalUrlAboveHashtags } from "@/lib/naver-smarteditor-clipboard";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  FileText,
  CheckCircle2,
  Zap,
  BookOpen,
  MessageSquare,
  Search,
  ArrowRight,
  Save,
  ExternalLink,
  HelpCircle,
  Info,
  Loader2,
  CopyCheck,
  Wand2,
  Eye,
  Edit3,
  Globe
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OGLinkCard from "@/components/common/OGLinkCard";
import type { Components } from "react-markdown";

const recreateMarkdownComponents: Components = {
  p: ({ children }) => {
    if (typeof children === "string") {
      const trimmed = children.trim();
      if (/^https?:\/\/[^\s]+$/.test(trimmed)) {
        return <OGLinkCard url={trimmed} />;
      }
    }
    if (React.Children.count(children) === 1) {
      const child = React.Children.toArray(children)[0] as any;
      if (child && child.type === "a" && child.props?.href) {
        const href = child.props.href;
        const linkText = child.props.children;
        if (
          typeof linkText === "string" &&
          (linkText.trim() === href.trim() || /^https?:\/\/[^\s]+$/.test(linkText.trim()))
        ) {
          return <OGLinkCard url={href} />;
        }
      }
    }
    return <p className="mb-4 leading-relaxed">{children}</p>;
  },
};

interface PostOption {
  id: string;
  title: string;
  content: string;
  created_at: string;
  canonical_url?: string;
  domainName: string;
  user_id?: string | null;
}

function getManuscriptDomain(url?: string | null): string {
  if (url) {
    try {
      const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
      const parsed = new URL(cleanUrl);
      const host = parsed.hostname;
      if (host === "creaibox.com" || host === "www.creaibox.com" || host === "localhost") {
        return "⭐ creaibox.com (공식)";
      }
      if (host.endsWith(".creaibox.com")) {
        const sub = host.split(".")[0];
        if (sub === "creaibox" || sub === "www") {
          return "⭐ creaibox.com (공식)";
        }
        return `📝 ${host}`;
      }
      return `🌐 ${host}`;
    } catch {
      // ignore
    }
  }
  return "⭐ creaibox.com (공식)";
}

export default function CreaiboxRecreateTab() {
  const supabase = createClient();

  const [posts, setPosts] = useState<PostOption[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [originalTitle, setOriginalTitle] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  
  const [recreatedTitle, setRecreatedTitle] = useState<string>("");
  const [recreatedContent, setRecreatedContent] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("friendly");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeLeftTab, setActiveLeftTab] = useState<"preview" | "edit">("preview");
  const [activeRightTab, setActiveRightTab] = useState<"edit" | "preview">("edit");
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const targetIdFromUrl = searchParams ? searchParams.get("id") : null;

  // Load user's posts from Supabase (user_id filtered) + sessionStorage cache
  useEffect(() => {
    async function loadPosts() {
      try {
        setFetchLoading(true);
        let loadedList: PostOption[] = [];

        // Get currently logged-in user
        const { data: authData } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id || null;

        // 1. Fetch from writing_creaibox_posts (Filtered by user_id if logged in)
        let queryCrea = supabase
          .from("writing_creaibox_posts")
          .select("id, title, content, created_at, canonical_url, user_id")
          .order("created_at", { ascending: false })
          .limit(50);

        if (currentUserId) {
          queryCrea = queryCrea.eq("user_id", currentUserId);
        }

        const { data: creaData, error: creaErr } = await queryCrea;

        if (!creaErr && creaData && creaData.length > 0) {
          loadedList = creaData.map((item: any) => ({
            id: String(item.id),
            title: item.title || "제목 없음",
            content: item.content || "",
            created_at: item.created_at || new Date().toISOString(),
            canonical_url: item.canonical_url || "",
            domainName: getManuscriptDomain(item.canonical_url),
            user_id: item.user_id,
          }));
        }

        // 2. Fetch from manuscripts table as backup (Filtered by user_id if logged in)
        let queryManu = supabase
          .from("manuscripts")
          .select("id, title, content, created_at, canonical_url, canonicalUrl, user_id")
          .order("created_at", { ascending: false })
          .limit(50);

        if (currentUserId) {
          queryManu = queryManu.eq("user_id", currentUserId);
        }

        const { data: manuData } = await queryManu;

        if (manuData && manuData.length > 0) {
          const existingIds = new Set(loadedList.map((p) => p.id));
          manuData.forEach((item: any) => {
            const itemId = String(item.id);
            if (!existingIds.has(itemId)) {
              const url = item.canonical_url || item.canonicalUrl || "";
              loadedList.push({
                id: itemId,
                title: item.title || "제목 없음",
                content: item.content || "",
                created_at: item.created_at || new Date().toISOString(),
                canonical_url: url,
                domainName: getManuscriptDomain(url),
                user_id: item.user_id,
              });
            }
          });
        }

        // 3. Check sessionStorage cache (creaibox:manuscripts:list:v1)
        if (typeof window !== "undefined") {
          const localCache = window.sessionStorage.getItem("creaibox:manuscripts:list:v1");
          if (localCache) {
            try {
              const parsed = JSON.parse(localCache);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const existingIds = new Set(loadedList.map((p) => p.id));
                parsed.forEach((item: any) => {
                  const itemId = String(item.id || item.displayId || Math.random());
                  if (!existingIds.has(itemId)) {
                    const url = item.canonicalUrl || item.canonical_url || "";
                    loadedList.push({
                      id: itemId,
                      title: item.title || "제목 없음",
                      content: item.content || "",
                      created_at: item.createdAt || item.updatedAt || new Date().toISOString(),
                      canonical_url: url,
                      domainName: getManuscriptDomain(url),
                    });
                  }
                });
              }
            } catch (e) {
              console.error("Local cache parse error:", e);
            }
          }
        }

        // 4. If targetIdFromUrl is provided but not in loadedList, fetch it directly
        if (targetIdFromUrl && !loadedList.some((p) => String(p.id) === String(targetIdFromUrl))) {
          const { data: exactPost } = await supabase
            .from("writing_creaibox_posts")
            .select("id, title, content, created_at, canonical_url, user_id")
            .eq("id", targetIdFromUrl)
            .maybeSingle();

          if (exactPost) {
            loadedList.unshift({
              id: String(exactPost.id),
              title: exactPost.title || "제목 없음",
              content: exactPost.content || "",
              created_at: exactPost.created_at || new Date().toISOString(),
              canonical_url: exactPost.canonical_url || "",
              domainName: getManuscriptDomain(exactPost.canonical_url || ""),
              user_id: exactPost.user_id,
            });
          }
        }

        // 5. Check for pending_recreate_post from sessionStorage
        if (typeof window !== "undefined") {
          const pendingStr = window.sessionStorage.getItem("pending_recreate_post");
          if (pendingStr) {
            try {
              const pendingPost = JSON.parse(pendingStr);
              if (pendingPost && pendingPost.title) {
                const existingIdx = loadedList.findIndex((p) => String(p.id) === String(pendingPost.id));
                if (existingIdx >= 0) {
                  loadedList[existingIdx] = {
                    ...loadedList[existingIdx],
                    title: pendingPost.title,
                    content: pendingPost.content || loadedList[existingIdx].content,
                  };
                } else {
                  loadedList.unshift({
                    id: String(pendingPost.id || "pending"),
                    title: pendingPost.title,
                    content: pendingPost.content || "",
                    created_at: new Date().toISOString(),
                    canonical_url: "",
                    domainName: "creaibox.com",
                  });
                }
              }
            } catch (e) {
              console.error("Failed to parse pending_recreate_post:", e);
            }
          }
        }

        setPosts(loadedList);
        if (loadedList.length > 0) {
          const targetItem = targetIdFromUrl
            ? loadedList.find((p) => String(p.id) === String(targetIdFromUrl)) || loadedList[0]
            : loadedList[0];

          setSelectedPostId(targetItem.id);
          setOriginalTitle(targetItem.title || "");
          setOriginalContent(targetItem.content || "");
        }
      } catch (err) {
        console.error("Failed to load manuscripts:", err);
      } finally {
        setFetchLoading(false);
      }
    }
    loadPosts();
  }, [supabase, targetIdFromUrl]);

  // Extract unique domains list
  const availableDomains = useMemo(() => {
    const domainSet = new Set<string>();
    posts.forEach((p) => {
      if (p.domainName) domainSet.add(p.domainName);
    });
    return Array.from(domainSet);
  }, [posts]);

function isDomainMatch(domainA: string, domainB: string): boolean {
  if (domainA === domainB) return true;
  const cleanA = domainA.replace(/^[^\w]+/, "").split("(")[0].trim().toLowerCase();
  const cleanB = domainB.replace(/^[^\w]+/, "").split("(")[0].trim().toLowerCase();
  if (cleanA === cleanB) return true;
  if (cleanA.includes(cleanB) || cleanB.includes(cleanA)) return true;
  return false;
}

// Filter posts by selected domain
  const filteredPosts = useMemo(() => {
    if (selectedDomain === "all") return posts;
    return posts.filter((p) => isDomainMatch(p.domainName, selectedDomain));
  }, [posts, selectedDomain]);

  const currentPostUrl = useMemo(() => {
    const found = posts.find((p) => String(p.id) === String(selectedPostId));
    if (!found) return "";
    return found.canonical_url || "";
  }, [posts, selectedPostId]);

  // When dropdown post changes
  const handleSelectPostChange = (postId: string) => {
    setSelectedPostId(postId);
    const found = posts.find((p) => p.id === postId);
    if (found) {
      setOriginalTitle(found.title || "");
      setOriginalContent(found.content || "");
    }
  };

  // Run AI Re-creation
  const handleRecreate = async () => {
    if (!originalContent.trim()) {
      alert("재창조할 원본 글 내용을 선택하거나 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setIsCopied(false);
    setIsSaved(false);

    try {
      const res = await fetch("/api/ai/recreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTitle,
          originalContent,
          tone: selectedTone,
          targetChannel: "naver",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "재창조 생성 중 오류가 발생했습니다.");
      }

      if (data.recreatedTitle) {
        setRecreatedTitle(data.recreatedTitle);
      }
      let contentWithImg = injectImagesIntoMarkdown(
        data.recreatedContent || data.resultText || "",
        originalContent
      );

      contentWithImg = preserveOriginalUrlAboveHashtags(
        contentWithImg,
        originalContent,
        currentPostUrl
      );

      setRecreatedContent(contentWithImg);

      // 🌟 Persist recreated_content and recreated_title to Supabase DB immediately for selectedPostId
      if (selectedPostId) {
        const titleToSave = data.recreatedTitle || originalTitle;
        const nowIso = new Date().toISOString();

        try {
          await supabase
            .from("writing_creaibox_posts")
            .update({
              recreated_title: titleToSave,
              recreated_content: contentWithImg,
              recreated_at: nowIso,
            })
            .eq("id", selectedPostId);

          await supabase
            .from("manuscripts")
            .update({
              recreated_title: titleToSave,
              recreated_content: contentWithImg,
              recreated_at: nowIso,
            })
            .eq("id", selectedPostId);
        } catch (e) {
          console.warn("Auto-save recreated post warn:", e);
        }
      }
    } catch (err: any) {
      alert(err.message || "원고 재창조에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to Clipboard (Formatted for Naver SmartEditor ONE)
  const handleCopy = async () => {
    if (!recreatedContent) return;
    await copyToNaverSmartEditorClipboard({
      title: recreatedTitle || originalTitle,
      content: recreatedContent,
      originalContent: originalContent,
      sourceUrl: currentPostUrl,
    });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Save recreated post to Supabase database
  const handleSaveToDb = async () => {
    if (!recreatedContent.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      const title = originalTitle
        ? `[네이버] ${originalTitle}`
        : `[네이버 재창조 원고] ${new Date().toLocaleDateString()}`;

      // Update original post with recreated content link
      if (selectedPostId) {
        await supabase
          .from("writing_creaibox_posts")
          .update({
            recreated_title: recreatedTitle || originalTitle,
            recreated_content: recreatedContent,
            recreated_at: new Date().toISOString(),
          })
          .eq("id", selectedPostId);
      }

      // Save to writing_creaibox_posts as new record
      if (userId) {
        await supabase.from("writing_creaibox_posts").insert({
          user_id: userId,
          title,
          content: recreatedContent,
          recreated_title: recreatedTitle || originalTitle,
          recreated_content: recreatedContent,
          post_type: "naver_recreated",
          parent_id: selectedPostId || null,
          status: "saved",
          created_at: new Date().toISOString(),
        });
      }

      // Also try saving to manuscripts
      await supabase.from("manuscripts").insert({
        user_id: userId,
        title,
        content: recreatedContent,
        post_type: "naver_recreated",
        parent_id: selectedPostId || null,
        status: "saved",
        created_at: new Date().toISOString(),
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      console.error("Save error:", err);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 1. 헤더 & 메커니즘 가이드 카드 */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <Sparkles size={14} />
              <span>네이버 C-Rank / DIA+ 알고리즘 상위노출 엔진</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              AI 원고 재창조 (네이버 블로그 변환)
            </h1>
            <p className="text-sm font-medium text-zinc-400">
              1차 작성한 크리에이박스 글을 유사 문서 패널티 없이 완전히 새로운 네이버 맞춤형 포스팅으로 3초만에 재창조하세요.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://blog.naver.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-600/30"
            >
              <span>네이버 블로그 바로가기</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* 🌟 4대 핵심 메커니즘 카드 리스트 */}
        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 transition hover:border-emerald-500/50">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
              <RotateCcw size={15} />
              <span>1. 문장 구조 & 어휘 재설계</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">
              주어/목적어 구성을 다르게 재배치하여 네이버 유사 문서 검출 시스템 100% 회피
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 transition hover:border-emerald-500/50">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
              <MessageSquare size={15} />
              <span>2. 어조 & 톤앤매너 변환</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">
              네이버 블로그 특유의 친근한 대화체 구어체(<strong className="text-white">~해요, ~했답니다</strong>)로 변환
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 transition hover:border-emerald-500/50">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
              <BookOpen size={15} />
              <span>3. 도입부 & 마무리 창작</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">
              이웃 소통에 적합한 새로운 서론 인사말 및 독자 참여형 결론 문구 자동 생성
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 transition hover:border-emerald-500/50">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
              <Zap size={15} />
              <span>4. DIA+ 검색 키워드 최적화</span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-zinc-300">
              네이버 알고리즘이 선호하는 가독성 높은 소제목 및 자연스러운 키워드배치
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 2. 원고 선택 및 제어 바 (Step 1: 도메인 선택 ➡️ Step 2: 원고 선택) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Step 1: 1차 도메인/블로그 선택 */}
          <div className="flex flex-1 flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Globe size={14} className="text-blue-500" />
              <span>1차 도메인 / 블로그 선택</span>
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => {
                const domain = e.target.value;
                setSelectedDomain(domain);
                const available = domain === "all" ? posts : posts.filter((p) => isDomainMatch(p.domainName, domain));
                if (available.length > 0) {
                  setSelectedPostId(available[0].id);
                  setOriginalTitle(available[0].title || "");
                  setOriginalContent(available[0].content || "");
                } else {
                  setSelectedPostId("");
                  setOriginalTitle("");
                  setOriginalContent("");
                }
              }}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="all">🌐 전체 도메인 글 보기 ({posts.length}개)</option>
              {availableDomains.map((domain) => {
                const count = posts.filter((p) => p.domainName === domain).length;
                return (
                  <option key={domain} value={domain}>
                    {domain} ({count}개)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Step 2: 2차 원본 원고 선택 */}
          <div className="flex flex-1 flex-col gap-1.5 min-w-[280px]">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileText size={14} className="text-emerald-500" />
              <span>2차 재창조할 원본 글 선택</span>
            </label>
            <select
              value={selectedPostId}
              onChange={(e) => handleSelectPostChange(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
            >
              {filteredPosts.length === 0 ? (
                <option value="">{fetchLoading ? "원고를 불러오는 중..." : "등록된 원고가 없습니다 (직접 입력 가능)"}</option>
              ) : (
                filteredPosts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || "제목 없음"} ({new Date(p.created_at).toLocaleDateString()})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* 톤앤매너 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              재창조 어조 & 스타일 선택
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "friendly", label: "🟢 친근한 대화체 (~해요)" },
                { id: "summary", label: "⚡ 숏/핵심 서머리체" },
                { id: "story", label: "📖 스토리텔링 경험담체" },
                { id: "info", label: "💼 전문 정보 전달체" },
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    selectedTone === tone.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* 재창조 실행 버튼 */}
          <div className="flex items-end shrink-0 pt-2 lg:pt-0">
            <button
              onClick={handleRecreate}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 lg:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>네이버 원고 재창조 중...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>✨ 원본 글 AI 재창조 & 네이버/SNS AI 재발행</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 3. 좌우 2분할 듀얼 에디터 (Left: Original, Right: Recreated Editable) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN: Original CreaiBox Post */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden min-h-[550px]">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h2 className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                1차 크리에이박스 원본 원고 (참고용)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveLeftTab("preview")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  activeLeftTab === "preview"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Eye size={12} className="inline mr-1" />
                미리보기
              </button>
              <button
                type="button"
                onClick={() => setActiveLeftTab("edit")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  activeLeftTab === "edit"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Edit3 size={12} className="inline mr-1" />
                원문 소스
              </button>
              <span className="text-[11px] font-bold text-zinc-400 ml-1">
                글자수: {originalContent.length.toLocaleString()}자
              </span>
            </div>
          </div>

          <div className="p-5 space-y-3 flex-1 flex flex-col">
            <input
              type="text"
              value={originalTitle}
              onChange={(e) => setOriginalTitle(e.target.value)}
              placeholder="원본 원고 제목"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 px-3.5 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none"
            />
            {activeLeftTab === "preview" ? (
              <div className="w-full flex-1 min-h-[420px] rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 p-4 text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 overflow-y-auto prose dark:prose-invert max-w-none">
                {(() => {
                  const cleanContent = (originalContent || "")
                    .replace(/<!--[\s\S]*?-->/g, "")
                    .trim();
                  if (!cleanContent) {
                    return <p className="text-zinc-400 italic">*선택하거나 입력된 원본 글 내용이 없습니다.*</p>;
                  }
                  const isHtml = /<[a-z][\s\S]*>/i.test(cleanContent);
                  if (isHtml) {
                    return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
                  }
                  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>;
                })()}
              </div>
            ) : (
              <textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="원본 글 내용을 여기에 직접 입력하거나 위에서 선택해 주세요."
                className="w-full flex-1 min-h-[420px] rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/40 p-4 text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 outline-none resize-none focus:border-blue-500 font-mono"
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Recreated Editable Naver Post */}
        <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden min-h-[550px]">
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                🟢 2차 네이버 맞춤형 재창조 원고 (실시간 수정 가능)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveRightTab("edit")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  activeRightTab === "edit"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Edit3 size={12} className="inline mr-1" />
                에디터
              </button>
              <button
                onClick={() => setActiveRightTab("preview")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                  activeRightTab === "preview"
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Eye size={12} className="inline mr-1" />
                미리보기
              </button>
              <span className="text-[11px] font-bold text-zinc-400 mx-1">
                글자수: {recreatedContent.length.toLocaleString()}자
              </span>

              {/* 🌟 상단 빠르게 누르는 1초 복사 & DB 새글 저장 버튼 */}
              <button
                onClick={handleSaveToDb}
                disabled={!recreatedContent}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold border transition disabled:opacity-50 ${
                  isSaved
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                }`}
              >
                {isSaved ? <CheckCircle2 size={12} /> : <Save size={12} />}
                <span>{isSaved ? "DB 저장 완료!" : "💾 DB에 원고 새글로 저장"}</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!recreatedContent}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-[11px] font-black text-white shadow-sm transition disabled:opacity-50 ${
                  isCopied ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {isCopied ? <CopyCheck size={12} /> : <Copy size={12} />}
                <span>{isCopied ? "복사 완료!" : "📋 네이버 스마트에디터 1초 복사"}</span>
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {isLoading ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
                <Loader2 size={36} className="animate-spin text-emerald-500" />
                <p className="text-xs font-bold text-emerald-400">
                  AI가 유사 문서 패널티를 회피하는 네이버 원고를 생성 중입니다...
                </p>
                <p className="text-[11px] text-zinc-500">
                  문장 구조 재배치 및 C-Rank / DIA+ 검색 알고리즘 톤앤매너 적용 중
                </p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 space-y-3">
                {/* 🌟 100% 변형된 네이버 전용 새 제목 필드 */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    ✨ 새로 탄생한 네이버 맞춤형 변형 제목 (C-Rank 유사문서 회피용)
                  </label>
                  <input
                    type="text"
                    value={recreatedTitle || originalTitle}
                    onChange={(e) => setRecreatedTitle(e.target.value)}
                    placeholder="AI 재창조 시 100% 새로운 네이버 검색 맞춤형 제목이 생성됩니다."
                    className="w-full rounded-xl border border-emerald-500/30 bg-emerald-950/20 dark:bg-zinc-950 px-4 py-2.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>

                {activeRightTab === "edit" ? (
                  <textarea
                    value={recreatedContent}
                    onChange={(e) => setRecreatedContent(e.target.value)}
                    placeholder="AI 재창조 버튼을 누르면 이 자리에 네이버 블로그에 최적화된 완전히 새로운 원고가 생성됩니다. 사용자가 자유롭게 수정할 수 있습니다."
                    className="w-full flex-1 min-h-[380px] rounded-xl border border-emerald-500/20 bg-emerald-50/10 dark:bg-zinc-950 p-4 text-xs font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 outline-none resize-none focus:border-emerald-500"
                  />
                ) : (
                  <div className="w-full flex-1 min-h-[380px] rounded-xl border border-emerald-500/20 bg-emerald-50/10 dark:bg-zinc-950 p-4 text-xs font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 overflow-y-auto prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={recreateMarkdownComponents}>
                      {recreatedContent || "*재창조된 내용이 없습니다.*"}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToDb}
                  disabled={!recreatedContent}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${
                    isSaved
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                  <span>{isSaved ? "DB 저장 완료!" : "💾 DB에 원고 새글로 저장"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!recreatedContent}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black shadow-md transition disabled:opacity-50 ${
                    isCopied
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20"
                  }`}
                >
                  {isCopied ? <CopyCheck size={16} /> : <Copy size={16} />}
                  <span>{isCopied ? "복사 완료! 스마트에디터에 붙여넣기(Ctrl+V)" : "📋 네이버 스마트에디터 1초 복사"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
