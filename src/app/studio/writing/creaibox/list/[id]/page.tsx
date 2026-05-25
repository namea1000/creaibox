"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import BlogEditorCanvas from "@/components/writing/naver/BlogEditorCanvas";
import CreaiboxAnalysisTower from "@/components/writing/creaibox/tabs/CreaiboxAnalysisTower";
import { useCreaiboxManuscriptsQuery, useCreaiboxManuscriptDetailQuery, creaiboxManuscriptKeys, type StudioManuscriptRecord } from '@/lib/queries/manuscripts';

function buildPublicBlogSlug(title: string, focusKeyword: string, targetKeyword: string) {
  const base = (focusKeyword || targetKeyword || title || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '');

  return base || `creaibox-post-${Date.now()}`;
}

function buildCanonicalUrl(slug: string) {
  return `https://creaibox.com/blog/${slug}`;
}

function toTagList(value?: string[] | null) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export default function CreaiboxManuscriptDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();
  const manuscriptId = Number(params?.id || 0);

  const { data: list = [] } = useCreaiboxManuscriptsQuery();
  const selectedFromList = useMemo(() => list.find((item) => Number(item.displayId) === manuscriptId) ?? null, [list, manuscriptId]);
  const { data: detail, isLoading: isDetailLoading } = useCreaiboxManuscriptDetailQuery(manuscriptId, selectedFromList ?? undefined);

  const [searchTerm, setSearchTerm] = useState('');
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveFeedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<StudioManuscriptRecord | null>(selectedFromList);

  useEffect(() => {
    if (!detail) return;
    if (!hasLocalEdits || detail.id !== data?.id) {
      setData(detail);
      setHasLocalEdits(false);
    }
  }, [detail, hasLocalEdits, data?.id]);

  useEffect(() => () => {
    if (saveFeedbackTimeoutRef.current) clearTimeout(saveFeedbackTimeoutRef.current);
  }, []);

  const filteredManuscripts = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(lower) || item.targetKeyword.toLowerCase().includes(lower)
    );
  }, [list, searchTerm]);

  const updateLocalData = useCallback((patch: Partial<StudioManuscriptRecord>) => {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
    setHasLocalEdits(true);
  }, []);

  const handleOpenManuscript = useCallback((manuscript: StudioManuscriptRecord) => {
    setData(manuscript);
    setHasLocalEdits(false);
    router.push(`/studio/writing/creaibox/list/${manuscript.displayId}`);
  }, [router]);

  const persistCaches = useCallback((nextRecord: StudioManuscriptRecord) => {
    queryClient.setQueryData<StudioManuscriptRecord | null>(creaiboxManuscriptKeys.detail(Number(nextRecord.displayId)), nextRecord);
    queryClient.setQueryData<StudioManuscriptRecord[]>(creaiboxManuscriptKeys.list, (prev = []) =>
      prev.map((item) => item.id === nextRecord.id ? nextRecord : item)
    );
  }, [queryClient]);

  const handleSave = useCallback(async () => {
    if (!data) return false;
    setIsSaving(true);

    const slug = buildPublicBlogSlug(data.title, data.focusKeyword, data.targetKeyword);
    const canonicalUrl = buildCanonicalUrl(slug);
    const now = new Date().toISOString();

    const updatePayload = {
      title: data.title,
      content: data.content,
      target_keyword: data.targetKeyword,
      selected_tone: data.selectedTone,
      status: data.status,
      slug,
      meta_description: data.metaDescription,
      focus_keyword: data.focusKeyword,
      canonical_url: canonicalUrl,
      seo_tags: toTagList(data.seoTags),
      word_count_goal: data.wordCountGoal,
      use_search: data.useSearch,
    };

    const { error } = await supabase.from('writing_creaibox_posts').update(updatePayload).eq('id', data.id);
    setIsSaving(false);

    if (error) {
      window.alert(`저장 실패: ${error.message}`);
      return false;
    }

    const nextRecord: StudioManuscriptRecord = {
      ...data,
      slug,
      canonicalUrl,
      updatedAt: now,
      displayId: data.displayId,
      wordCount: data.content.replace(/\s+/g, '').length,
    };

    setData(nextRecord);
    setHasLocalEdits(false);
    persistCaches(nextRecord);
    return true;
  }, [data, persistCaches, supabase]);

  const seoStatus = useMemo(() => {
    if (!data) return '대기 중';
    const ok = Boolean(data.slug && data.metaDescription && data.focusKeyword && (data.seoTags?.length ?? 0) > 0);
    return ok ? '준비 완료' : '보완 필요';
  }, [data]);

  if (!data && isDetailLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d12] text-white">
        <div className="mx-auto grid max-w-[1880px] grid-cols-[360px_minmax(0,1.2fr)_420px] gap-0 px-0">
          <aside className="min-h-screen border-r border-white/10 bg-[#0b0f15] p-4" />
          <div className="relative min-h-screen bg-white">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">Supabase 원고 복원 데이터 바인딩 중...</div>
          </div>
          <aside className="min-h-screen border-l border-white/10 bg-[#0b0f15] p-6" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white">
      <div className="mx-auto grid max-w-[1880px] grid-cols-[390px_minmax(0,1fr)_470px] gap-0">
        <aside className="min-h-screen border-r border-white/10 bg-[#0b0f15] p-4">
          <button onClick={() => router.push('/studio/writing/creaibox/list')} className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 text-left text-lg font-semibold text-white/85 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" /> 목록으로 돌아가기
          </button>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="원고 검색..." className="w-full rounded-2xl border border-white/10 bg-[#0f141b] py-4 pl-12 pr-4 text-white outline-none placeholder:text-white/30" />
          </div>
          <div className="space-y-4">
            {filteredManuscripts.map((manuscript) => {
              const active = manuscript.id === data.id;
              return (
                <button key={manuscript.id} onClick={() => handleOpenManuscript(manuscript)} className={`w-full rounded-3xl border p-4 text-left transition ${active ? 'border-emerald-400 bg-[#24272d]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'}`}>
                  <div className="mb-3 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">
                    {manuscript.postType === 'recreate' ? 'RECREATE' : 'CREATE'}
                  </div>
                  <div className="line-clamp-2 text-[1.15rem] font-bold leading-snug text-white">{manuscript.title}</div>
                  <div className="mt-2 line-clamp-1 text-sm text-white/35">#{manuscript.targetKeyword || '키워드 없음'}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-h-screen bg-[#ffffff]">
          <BlogEditorCanvas
            title={data.title}
            content={data.content}
            onTitleChange={(value) => updateLocalData({ title: value })}
            onContentChange={(value) => updateLocalData({ content: value, wordCount: value.replace(/\s+/g, '').length })}
            handleSavePostToSupabase={handleSave}
            isSaving={isSaving}
            saveButtonLabel="원고 저장"
            modeLabel="CREAIBOX BLOG EDIT MODE"
          />
        </main>

        <aside className="min-h-screen border-l border-white/10 bg-[#0b0f15] p-6">
          <div className="mb-4 flex min-h-[74px] items-center justify-end border-b border-white/10 pb-4">
            <button className="rounded-2xl bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)]">블로그 발행</button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#111317] p-6 text-white">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">SEO & Publishing</p>
                <h2 className="mt-2 text-[2rem] font-black leading-tight">생성과 함께 채워지는 발행 정보</h2>
              </div>
              <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${seoStatus === '준비 완료' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>{seoStatus}</span>
            </div>

            <button onClick={() => void handleSave()} className="mb-6 w-full rounded-2xl bg-white/10 px-5 py-4 text-lg font-bold text-white hover:bg-white/15">저장하기</button>

            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-3xl border border-white/10 bg-[#0f1217] px-4 py-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/38">Meta Length</div>
                <div className="mt-4 text-[3.25rem] font-black leading-none text-emerald-400">{(data.metaDescription || '').length}</div>
                <div className="mt-3 text-sm text-white/38 whitespace-nowrap">권장 90-155자</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0f1217] px-4 py-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/38">Slug Size</div>
                <div className="mt-4 text-[3.25rem] font-black leading-none text-sky-400">{(data.slug || '').length}</div>
                <div className="mt-3 text-sm text-white/38 whitespace-nowrap">권장 80자 이하</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0f1217] px-4 py-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/38">Tag Count</div>
                <div className="mt-4 text-[3.25rem] font-black leading-none text-fuchsia-400">{toTagList(data.seoTags).length}</div>
                <div className="mt-3 text-sm text-white/38 whitespace-nowrap">SEO 태그 개수</div>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <div className="mb-2 text-lg font-semibold text-white/75">슬러그 (Slug)</div>
                <input value={data.slug || ''} onChange={(event) => updateLocalData({ slug: event.target.value })} className="w-full rounded-3xl border border-transparent bg-white px-6 py-4 text-xl font-semibold text-[#111111] outline-none" />
              </label>
              <label className="block">
                <div className="mb-2 flex items-center justify-between text-lg font-semibold text-white/75"><span>Meta Description</span><span className="text-base font-medium text-white/45">{(data.metaDescription || '').length}/155</span></div>
                <textarea value={data.metaDescription || ''} onChange={(event) => updateLocalData({ metaDescription: event.target.value })} className="min-h-[140px] w-full resize-none rounded-3xl border border-transparent bg-white px-6 py-5 text-lg leading-relaxed text-[#111111] outline-none" />
              </label>
              <label className="block">
                <div className="mb-2 text-lg font-semibold text-white/75">Focus Keyword</div>
                <input value={data.focusKeyword || ''} onChange={(event) => updateLocalData({ focusKeyword: event.target.value })} className="w-full rounded-3xl border border-transparent bg-white px-6 py-4 text-xl font-semibold text-[#111111] outline-none" />
              </label>
              <label className="block">
                <div className="mb-2 text-lg font-semibold text-white/75">Canonical URL</div>
                <input value={data.canonicalUrl || ''} onChange={(event) => updateLocalData({ canonicalUrl: event.target.value })} className="w-full rounded-3xl border border-transparent bg-white px-6 py-4 text-lg text-[#111111] outline-none" />
              </label>
              <label className="block">
                <div className="mb-2 text-lg font-semibold text-white/75">SEO Tags</div>
                <textarea value={toTagList(data.seoTags).join(', ')} onChange={(event) => updateLocalData({ seoTags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="min-h-[110px] w-full resize-none rounded-3xl border border-transparent bg-white px-6 py-5 text-lg leading-relaxed text-[#111111] outline-none" />
              </label>
              <div className="flex flex-wrap gap-3">
                {toTagList(data.seoTags).map((tag) => (
                  <span key={tag} className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CreaiboxAnalysisTower
              seoScore={0}
              antiAbuseScore={0}
              contentIntegrityScore={0}
              readabilityScore={0}
              naturalnessScore={0}
              keywordDensityScore={0}
              uniquenessScore={0}
              crawlabilityScore={0}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
