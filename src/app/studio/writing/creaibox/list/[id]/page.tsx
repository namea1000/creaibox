"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import NaverEditorCanvas from "@/components/writing/naver/BlogEditorCanvas";
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";

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
  displayId: number;
  title: string;
  content: string;
  keyword: string;
  type: 'create' | 'recreate';
  status: 'draft' | 'saved' | 'published';
  slug: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  seoTags: string[];
  images: ImageBlock[];
}

interface WritingCreaiboxPostRecord {
  id: string | number;
  display_id?: number | null;
  created_at?: string | null;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  status?: string | null;
  target_keyword?: string | null;
  slug?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  seo_tags?: string[] | null;
}

interface CachedManuscriptListItem {
  id: string;
  displayId?: number;
  title?: string;
  keyword?: string;
  type?: 'create' | 'recreate';
  status?: 'draft' | 'saved' | 'published';
}

const MANUSCRIPT_CACHE_KEY = 'creaibox-manuscript-list-cache-v1';

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

function mapPostToManuscript(post: WritingCreaiboxPostRecord): Manuscript {
  return {
    id: String(post.id),
    displayId: post.display_id || 0,
    title: post.title || '제목 없음',
    content: post.content || '',
    keyword: post.target_keyword || '일반 원고',
    type: normalizePostType(post.post_type),
    status: normalizePostStatus(post.status),
    slug: post.slug || '',
    metaDescription: post.meta_description || '',
    focusKeyword: post.focus_keyword || '',
    canonicalUrl: post.canonical_url || '',
    seoTags: post.seo_tags || [],
    images: []
  };
}

function mapCachedItemToSideManuscript(item: CachedManuscriptListItem): Manuscript {
  return {
    id: String(item.id),
    displayId: item.displayId || 0,
    title: item.title || '제목 없음',
    content: '',
    keyword: item.keyword || '일반 원고',
    type: item.type === 'recreate' ? 'recreate' : 'create',
    status: item.status === 'published' ? 'published' : item.status === 'saved' ? 'saved' : 'draft',
    slug: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    seoTags: [],
    images: []
  };
}

export default function CreaiboxManuscriptDetailPage() {
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
    displayId: 0,
    title: '',
    content: '',
    keyword: 'AI 글쓰기',
    type: 'create',
    status: 'draft',
    slug: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    seoTags: [],
    images: []
  });
  const [sideList, setSideList] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeoSaving, setIsSeoSaving] = useState(false);
  const [seoSaveFeedback, setSeoSaveFeedback] = useState<'idle' | 'saved'>('idle');
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

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!manuscriptId) {
        if (isMounted) setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const displayId = Number(manuscriptId);
        const { data: post, error: postError } = await supabase
          .from('writing_creaibox_posts')
          .select('*')
          .eq('display_id', displayId)
          .single();

        if (postError) throw postError;

        if (!isMounted) return;

        if (post) {
          const normalizedPost = mapPostToManuscript(post as WritingCreaiboxPostRecord);
          setData(normalizedPost);
          setSideList((prev) => {
            if (prev.some((item) => item.id === normalizedPost.id)) {
              return prev.map((item) => item.id === normalizedPost.id ? normalizedPost : item);
            }
            return [normalizedPost, ...prev];
          });
        }

        setIsLoading(false);

        const { data: list, error: listError } = await supabase
          .from('writing_creaibox_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (listError) throw listError;

        if (!isMounted) return;

        if (Array.isArray(list)) {
          setSideList((list as WritingCreaiboxPostRecord[]).map(mapPostToManuscript));
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
  }, [loadCachedSideList, manuscriptId, supabase]);

  const handleSavePostToSupabase = useCallback(async (nextStatus?: 'completed' | 'published') => {
    if (!data.id) return false;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('writing_creaibox_posts')
        .update({
          title: data.title,
          content: data.content,
          status: nextStatus === 'published' ? 'published' : 'saved',
          target_keyword: data.keyword,
          slug: data.slug,
          meta_description: data.metaDescription,
          focus_keyword: data.focusKeyword,
          canonical_url: data.canonicalUrl,
          seo_tags: data.seoTags
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

  useEffect(() => {
    if (seoSaveFeedback !== 'saved') return;
    const timer = setTimeout(() => setSeoSaveFeedback('idle'), 3000);
    return () => clearTimeout(timer);
  }, [seoSaveFeedback]);

  const handleSeoSave = useCallback(async () => {
    if (!data.id) return;
    setIsSeoSaving(true);
    try {
      const result = await handleSavePostToSupabase();
      if (result !== false) {
        setSeoSaveFeedback('saved');
      }
    } finally {
      setIsSeoSaving(false);
    }
  }, [data.id, handleSavePostToSupabase]);

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
  const metaDescriptionLength = data.metaDescription.trim().length;
  const slugLength = data.slug.trim().length;
  const shouldShowEditorLoading = isLoading && !data.title && !data.content;
  const seoHealthLabel = !data.title || !data.content
    ? '대기 중'
    : metaDescriptionLength >= 90 && metaDescriptionLength <= 155 && data.focusKeyword
      ? '준비 완료'
      : '보완 필요';

  const handleSideManuscriptClick = useCallback((manuscript: Manuscript) => {
    if (manuscript.content || manuscript.title) {
      setData((prev) => ({
        ...prev,
        ...manuscript,
        content: manuscript.content || prev.content,
        slug: manuscript.slug || prev.slug,
        metaDescription: manuscript.metaDescription || prev.metaDescription,
        focusKeyword: manuscript.focusKeyword || prev.focusKeyword,
        canonicalUrl: manuscript.canonicalUrl || prev.canonicalUrl,
        seoTags: manuscript.seoTags.length > 0 ? manuscript.seoTags : prev.seoTags
      }));
      setIsLoading(false);
    }

    router.push(`/studio/writing/creaibox/list/${manuscript.displayId}`);
  }, [router]);

  return (
    <div className="w-full h-screen bg-[#0a0c10] text-zinc-100 flex flex-col overflow-hidden">
      <main className="flex-1 flex w-full overflow-hidden">
        <aside className="w-[330px] flex-shrink-0 border-r border-zinc-800 bg-[#0d0f14] flex flex-col px-4 pb-4 pt-2 gap-4">
          <button onClick={() => router.push('/studio/writing/creaibox/list')} className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 flex items-center gap-2">
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
                onClick={() => handleSideManuscriptClick(manuscript)}
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

        <section className="flex-[0_0_56%] h-full overflow-hidden px-3 pb-3 pt-2 bg-[#0a0c10]">
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
            isLoading={shouldShowEditorLoading}
          />
        </section>

        <aside className="w-[420px] flex-shrink-0 border-l border-zinc-800 bg-[#0d0f14] overflow-y-auto px-4 pb-4 pt-2">
          <div className="flex flex-col gap-4 h-full overflow-y-auto pl-0.5 custom-scrollbar">
            <div className="h-14 border-b border-zinc-800 bg-[#0b0d12] px-4 flex items-center justify-end rounded-t-2xl">
              <button
                type="button"
                className="inline-flex items-center rounded-xl bg-[linear-gradient(135deg,#2563eb_0%,#7c3aed_55%,#ec4899_100%)] px-4 py-2 text-sm font-black text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)] transition-all hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(124,58,237,0.34)] active:scale-[0.99]"
              >
                블로그 발행
              </button>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d0e12]/80 backdrop-blur-md space-y-4 shadow-2xl">
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">SEO & Publishing</p>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">생성과 함께 채워지는 발행 정보</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-black ${
                  seoHealthLabel === '준비 완료'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : seoHealthLabel === '보완 필요'
                      ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                      : 'border border-zinc-700 bg-zinc-900 text-zinc-400'
                }`}>
                  {seoHealthLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSeoSave}
                disabled={isSeoSaving || isSaving}
                className="w-full rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 px-4 py-2.5 text-sm font-black transition-all disabled:opacity-40"
              >
                {isSeoSaving || isSaving ? '저장중...' : seoSaveFeedback === 'saved' ? '저장완료' : '저장하기'}
              </button>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 whitespace-nowrap">Meta Length</div>
                  <div className={`mt-3 text-4xl font-black ${
                    metaDescriptionLength >= 90 && metaDescriptionLength <= 155 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {metaDescriptionLength}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-zinc-500 whitespace-nowrap">권장 90-155자</div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 whitespace-nowrap">Slug Size</div>
                  <div className={`mt-3 text-4xl font-black ${
                    slugLength > 0 && slugLength <= 80 ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                    {slugLength}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-zinc-500 whitespace-nowrap">권장 80자 이하</div>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 whitespace-nowrap">Tag Count</div>
                  <div className="mt-3 text-4xl font-black text-fuchsia-400">
                    {data.seoTags.length}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-zinc-500 whitespace-nowrap">SEO 태그 개수</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">슬러그 (Slug)</label>
                  <input
                    value={data.slug}
                    onChange={(e) => setData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 focus:outline-none"
                    placeholder="아직 생성되지 않았습니다"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold text-zinc-400">Meta Description</label>
                    <span className={`text-xs font-black ${
                      metaDescriptionLength >= 90 && metaDescriptionLength <= 155 ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {metaDescriptionLength}/155
                    </span>
                  </div>
                  <textarea
                    value={data.metaDescription}
                    onChange={(e) => setData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    className="min-h-[96px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold leading-relaxed text-zinc-700 focus:outline-none resize-none"
                    placeholder="아직 생성되지 않았습니다"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">Focus Keyword</label>
                  <input
                    value={data.focusKeyword}
                    onChange={(e) => setData((prev) => ({ ...prev, focusKeyword: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 focus:outline-none"
                    placeholder="아직 생성되지 않았습니다"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">Canonical URL</label>
                  <input
                    value={data.canonicalUrl}
                    onChange={(e) => setData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold break-all text-zinc-700 focus:outline-none"
                    placeholder="아직 생성되지 않았습니다"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-zinc-400">SEO Tags</label>
                  <textarea
                    value={data.seoTags.join(', ')}
                    onChange={(e) => setData((prev) => ({
                      ...prev,
                      seoTags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 10)
                    }))}
                    className="min-h-[72px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 focus:outline-none resize-none"
                    placeholder="아직 생성되지 않았습니다"
                  />
                  {data.seoTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.seoTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-black text-blue-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CreaiboxAnalysisTower
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
              crawlabilityScore={keywordCount >= 3 && keywordCount <= 5 ? 60 : 25}
              isDensitySafe={keywordCount <= 5}
              isDetailMode={true}
              similarityScore={similarityScore}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
