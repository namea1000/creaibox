"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import NaverEditorCanvas from "@/components/writing/naver/BlogEditorCanvas";
import NaverAnalysisTower from "@/components/writing/naver/NaverAnalysisTower";

interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

interface Manuscript {
  id: string;
  title: string;
  content: string;
  keyword: string;
  type: 'create' | 'recreate';
  status: 'draft' | 'saved' | 'published';
  images: ImageBlock[];
}

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  status?: string | null;
  updated_at?: string | null;
  target_keyword?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

interface CachedManuscriptListItem {
  id: string;
  title?: string;
  keyword?: string;
  type?: 'create' | 'recreate';
  status?: 'draft' | 'saved' | 'published';
}

const SESSION_TIMEOUT_MS = 4000;
const MANUSCRIPT_CACHE_KEY = 'naver-manuscript-list-cache-v2';
const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
}

function normalizePostType(postType?: string | null): 'create' | 'recreate' {
  return postType === 'recreate' ? 'recreate' : 'create';
}

function normalizePostStatus(status?: string | null): 'draft' | 'saved' | 'published' {
  if (status === 'published') return 'published';
  if (status === 'saved' || status === 'completed') return 'saved';
  return 'draft';
}

function mapPostToManuscript(post: WritingNaverPostRecord): Manuscript {
  const fallbackKeyword = (post.categories && post.categories[0]) || (post.tags && post.tags[0]) || '일반 원고';

  return {
    id: String(post.id),
    title: post.title || '제목 없음',
    content: post.content || '',
    keyword: post.target_keyword || fallbackKeyword,
    type: normalizePostType(post.post_type),
    status: normalizePostStatus(post.status),
    images: []
  };
}

function mapCachedItemToSideManuscript(item: CachedManuscriptListItem): Manuscript {
  return {
    id: String(item.id),
    title: item.title || '제목 없음',
    content: '',
    keyword: item.keyword || '일반 원고',
    type: item.type === 'recreate' ? 'recreate' : 'create',
    status: item.status === 'published' ? 'published' : item.status === 'saved' ? 'saved' : 'draft',
    images: []
  };
}

export default function NaverManuscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manuscriptId = useMemo(() => {
    const rawId = params?.id;
    return Array.isArray(rawId) ? rawId[0] : rawId || '';
  }, [params]);

  const [data, setData] = useState<Manuscript>({
    id: '',
    title: '',
    content: '',
    keyword: 'AI 글쓰기',
    type: 'create',
    status: 'draft',
    images: []
  });
  const [sideList, setSideList] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCachedSideList = useCallback(() => {
    if (typeof window === 'undefined') return;

    const rawCache = window.sessionStorage.getItem(MANUSCRIPT_CACHE_KEY);
    if (!rawCache) return;

    try {
      const parsed = JSON.parse(rawCache) as CachedManuscriptListItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalizedCachedList = parsed.map(mapCachedItemToSideManuscript);
        setSideList(normalizedCachedList);
      }
    } catch (error) {
      console.error("상세 좌측 목록 캐시 복원 실패:", error);
    }
  }, []);

  const resolveUserId = useCallback(async () => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), SESSION_TIMEOUT_MS);
      });

      const sessionUserIdPromise = supabase.auth.getSession()
        .then(({ data: { session } }) => session?.user?.id || null)
        .catch(() => null);

      const sessionUserId = await Promise.race([sessionUserIdPromise, timeout]);
      if (sessionUserId) return sessionUserId;

      const userPromise = supabase.auth.getUser()
        .then(({ data: { user } }) => user?.id || null)
        .catch(() => null);

      const userId = await Promise.race([userPromise, timeout]);
      if (userId) return userId;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
      }
    }

    return null;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!manuscriptId) {
        if (isMounted) setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const userIdPromise = resolveUserId();
        const postPromise = supabase.from('writing_naver_posts').select('*').eq('id', manuscriptId).single();

        const [{ data: post, error: postError }, userId] = await Promise.all([postPromise, userIdPromise]);

        if (postError) throw postError;

        if (!isMounted) return;

        if (post) {
          const normalizedPost = mapPostToManuscript(post as WritingNaverPostRecord);
          setData(normalizedPost);
          setSideList((prev) => {
            if (prev.some((item) => item.id === normalizedPost.id)) {
              return prev.map((item) => item.id === normalizedPost.id ? normalizedPost : item);
            }
            return [normalizedPost, ...prev];
          });
        }

        if (userId) {
          const { data: list, error: listError } = await supabase
            .from('writing_naver_posts')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

          if (listError) throw listError;

          if (!isMounted) return;

          if (Array.isArray(list)) {
            setSideList((list as WritingNaverPostRecord[]).map(mapPostToManuscript));
          }
        }
      } catch (error: unknown) {
        console.error("상세 원고 로딩 실패:", getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    const cacheTimer = setTimeout(() => {
      loadCachedSideList();
    }, 0);
    const loadTimer = setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(cacheTimer);
      clearTimeout(loadTimer);
    };
  }, [loadCachedSideList, manuscriptId, resolveUserId, supabase]);

  const handleSavePostToSupabase = useCallback(async (nextStatus?: 'completed' | 'published') => {
    if (!data.id) return false;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('writing_naver_posts')
        .update({
          title: data.title,
          content: data.content,
          status: nextStatus === 'published' ? 'published' : 'saved',
          updated_at: new Date().toISOString(),
          target_keyword: data.keyword
        })
        .eq('id', data.id);

      if (error) throw error;

      const normalizedStatus = nextStatus === 'published' ? 'published' : 'saved';
      setData((prev) => ({ ...prev, status: normalizedStatus }));
      setSideList((prev) => prev.map((item) => item.id === data.id ? { ...item, title: data.title, content: data.content, keyword: data.keyword, status: normalizedStatus } : item));
      return true;
    } catch (error: unknown) {
      console.error("상세 원고 저장 실패:", getErrorMessage(error));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [data, supabase]);

  const filteredSideList = sideList.filter((manuscript) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return true;

    return (
      manuscript.title.toLowerCase().includes(normalizedSearch) ||
      manuscript.keyword.toLowerCase().includes(normalizedSearch)
    );
  });

  const safeContent = data.content || '';
  const safeKeyword = data.keyword || '';
  const keywordCount = safeKeyword
    ? (safeContent.match(new RegExp(safeKeyword, 'gi')) || []).length
    : 0;
  const hasTitleKeyword = safeKeyword ? (data.title || '').toLowerCase().includes(safeKeyword.toLowerCase()) : false;
  const hasSubHeadings = safeContent.includes('##') || safeContent.includes('###');
  const similarityScore = data.type === 'recreate' ? Math.max(12, 95 - Math.floor(safeContent.length / 25)) : 0;
  const duplicateSafe = similarityScore > 0 ? similarityScore < 45 : false;
  const seoScore = data.title || safeContent
    ? (hasTitleKeyword ? 30 : 0) + (keywordCount >= 3 && keywordCount <= 8 ? 25 : 0) + (safeContent.length >= 1000 ? 20 : 0) + (hasSubHeadings ? 15 : 0) + 10
    : 0;

  const frequencies: KeywordFrequency[] = safeKeyword ? [
    { word: safeKeyword, count: keywordCount, density: Math.min(100, keywordCount * 6.2), status: keywordCount >= 3 && keywordCount <= 5 ? 'good' : keywordCount > 5 ? 'danger' : 'warning' }
  ] : [];

  return (
    <div className="w-full h-screen bg-[#0a0c10] text-zinc-100 flex flex-col overflow-hidden">
      <main className="flex-1 flex w-full overflow-hidden">
        <aside className="w-[340px] flex-shrink-0 border-r border-zinc-800 bg-[#0d0f14] flex flex-col p-4 gap-4">
          <button onClick={() => router.push('/studio/writing/naver/list')} className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 flex items-center gap-2">
            <ArrowLeft size={14} /> 목록으로 돌아가기
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-600" size={14} />
            <input placeholder="원고 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200" />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {filteredSideList.map((manuscript) => (
              <div
                key={manuscript.id}
                onClick={() => router.push(`/studio/writing/naver/list/${manuscript.id}`)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${data.id === manuscript.id ? 'bg-zinc-800 border-emerald-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    manuscript.type === 'recreate'
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  }`}>
                    {manuscript.type === 'recreate' ? 'Recreate' : 'Create'}
                  </span>
                </div>
                <div className="text-xs font-bold truncate">{manuscript.title}</div>
                <div className="text-[10px] text-zinc-500">#{manuscript.keyword}</div>
              </div>
            ))}
            {!isLoading && filteredSideList.length === 0 && (
              <div className="text-[11px] text-zinc-500 text-center py-6">표시할 원고가 없습니다.</div>
            )}
          </div>
        </aside>

        <section className="flex-1 h-full overflow-hidden p-4 bg-[#0a0c10]">
          <NaverEditorCanvas
            title={data.title}
            setTitle={(title) => setData((prev) => ({ ...prev, title }))}
            content={data.content}
            setContent={(content) => setData((prev) => ({ ...prev, content }))}
            charCount={data.content.length}
            images={data.images}
            fileInputRef={fileInputRef}
            isSaving={isSaving}
            isEnhancing={false}
            handleImageUploadClick={() => fileInputRef.current?.click()}
            handleImageChange={() => {}}
            handleUpdateCaption={() => {}}
            handleDeleteImage={() => {}}
            handleEnhanceContent={() => {}}
            handleSavePostToSupabase={handleSavePostToSupabase}
            handleFormDelete={() => {}}
            isDetailMode={true}
            targetKeyword={data.keyword}
            isLoading={isLoading}
          />
        </section>

        <aside className="w-[320px] flex-shrink-0 border-l border-zinc-800 bg-[#0d0f14] overflow-y-auto">
          <NaverAnalysisTower
            seoScore={seoScore}
            seoChecks={{
              titleKeyword: hasTitleKeyword,
              contentDensity: keywordCount >= 3 && keywordCount <= 8,
              duplicateSafe,
              structureCheck: hasSubHeadings
            }}
            posRatio={{ noun: 50, verb: 30, other: 20 }}
            frequencies={frequencies}
            content={data.content}
            naverBotScore={keywordCount >= 3 && keywordCount <= 5 ? 60 : 25}
            isDensitySafe={keywordCount <= 5}
            isDetailMode={true}
            similarityScore={similarityScore}
          />
        </aside>
      </main>
    </div>
  );
}
