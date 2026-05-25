"use client";

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

const AUTH_RETRY_ATTEMPTS = 4;
const AUTH_RETRY_DELAY_MS = 350;

export type ManuscriptStatus = 'draft' | 'saved' | 'published';
export type ManuscriptType = 'create' | 'recreate';

export interface StudioImageBlock {
  id: string;
  url: string;
  caption: string;
}

export interface StudioManuscriptRecord {
  id: string;
  displayId?: number;
  title: string;
  content: string;
  keyword: string;
  targetKeyword: string;
  type: ManuscriptType;
  postType?: ManuscriptType;
  detailLabel: string;
  selectedTone: string;
  status: ManuscriptStatus;
  wordCount: number;
  wordCountGoal?: string | number;
  updatedAt: string;
  createdAt?: string;
  slug?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  seoTags?: string[];
  sourceMode?: string;
  sourceUrl?: string;
  sourceText?: string;
  rewriteStrategy?: string;
  images: StudioImageBlock[];
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
  selected_tone?: string | null;
  slug?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  seo_tags?: string[] | null;
  word_count_goal?: string | number | null;
}

interface WritingNaverPostRecord {
  id: string | number;
  title?: string | null;
  content?: string | null;
  post_type?: string | null;
  source_mode?: string | null;
  source_url?: string | null;
  source_text?: string | null;
  rewrite_strategy?: string | null;
  word_count_goal?: string | number | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  target_keyword?: string | null;
  selected_tone?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
}

export const creaiboxManuscriptKeys = {
  all: ['creaibox-manuscripts'] as const,
  list: ['creaibox-manuscripts', 'list'] as const,
  detail: (displayId: string | number) => ['creaibox-manuscripts', 'detail', String(displayId)] as const,
};

export const naverManuscriptKeys = {
  all: ['naver-manuscripts'] as const,
  list: ['naver-manuscripts', 'list'] as const,
  detail: (id: string | number) => ['naver-manuscripts', 'detail', String(id)] as const,
};

export function normalizePostStatus(status?: string | null): ManuscriptStatus {
  if (status === 'published') return 'published';
  if (status === 'saved' || status === 'completed') return 'saved';
  return 'draft';
}

export function normalizePostType(postType?: string | null): ManuscriptType {
  return postType === 'recreate' ? 'recreate' : 'create';
}

async function waitForAuthenticatedClient() {
  const supabase = createClient();

  for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return supabase;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return supabase;
    }

    if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
    }
  }

  return supabase;
}

async function waitForAuthenticatedUser() {
  const supabase = createClient();

  for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return { supabase, userId: session.user.id };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return { supabase, userId: user.id };
    }

    if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, AUTH_RETRY_DELAY_MS));
    }
  }

  return { supabase, userId: null as string | null };
}

function formatTimestamp(input?: string | null) {
  if (!input) return '-';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function mapCreaiboxRecord(record: WritingCreaiboxPostRecord): StudioManuscriptRecord {
  const postType = normalizePostType(record.post_type);
  const targetKeyword = record.target_keyword || '일반 원고';
  return {
    id: String(record.id),
    displayId: record.display_id || 0,
    title: record.title || '제목 없음',
    content: record.content || '',
    keyword: targetKeyword,
    targetKeyword,
    type: postType,
    postType,
    detailLabel: record.post_type || 'AI 인사이트 포스팅',
    selectedTone: record.selected_tone || '전문적이고 통찰력 있는 분석',
    status: normalizePostStatus(record.status),
    wordCount: (record.content || '').length,
    wordCountGoal: record.word_count_goal ?? undefined,
    updatedAt: formatTimestamp(record.created_at),
    createdAt: record.created_at || undefined,
    slug: record.slug || '',
    metaDescription: record.meta_description || '',
    focusKeyword: record.focus_keyword || '',
    canonicalUrl: record.canonical_url || '',
    seoTags: record.seo_tags || [],
    images: [],
  };
}

function mapNaverRecord(record: WritingNaverPostRecord): StudioManuscriptRecord {
  const fallbackKeyword =
    (record.categories && record.categories[0]) ||
    (record.tags && record.tags[0]) ||
    '일반 원고';
  const targetKeyword = record.target_keyword || fallbackKeyword;
  const postType = normalizePostType(record.post_type);

  return {
    id: String(record.id),
    title: record.title || '제목 없음',
    content: record.content || '',
    keyword: targetKeyword,
    targetKeyword,
    type: postType,
    postType,
    detailLabel:
      record.post_type === 'recreate'
        ? record.source_mode === 'url'
          ? 'URL 재창조'
          : record.source_mode === 'text'
          ? '텍스트 재창조'
          : '글 재창조'
        : 'AI 스마트 글쓰기',
    selectedTone:
      record.selected_tone ||
      (record.tags && record.tags[0]) ||
      '친근하고 부드러운 말투',
    status: normalizePostStatus(record.status),
    wordCount: (record.content || '').length,
    wordCountGoal: record.word_count_goal ?? undefined,
    updatedAt: formatTimestamp(record.updated_at || record.created_at),
    createdAt: record.created_at || undefined,
    sourceMode: record.source_mode || undefined,
    sourceUrl: record.source_url || undefined,
    sourceText: record.source_text || undefined,
    rewriteStrategy: record.rewrite_strategy || undefined,
    images: [],
  };
}

async function fetchCreaiboxManuscripts() {
  const { supabase, userId } = await waitForAuthenticatedUser();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('writing_creaibox_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as WritingCreaiboxPostRecord[]).map(mapCreaiboxRecord);
}

async function fetchCreaiboxManuscriptDetail(displayId: string | number) {
  const { supabase, userId } = await waitForAuthenticatedUser();
  if (!userId) return null;
  const { data, error } = await supabase
    .from('writing_creaibox_posts')
    .select('*')
    .eq('display_id', Number(displayId))
    .limit(1);

  if (error) throw error;
  const row = (data || [])[0] as WritingCreaiboxPostRecord | undefined;
  return row ? mapCreaiboxRecord(row) : null;
}

async function fetchNaverManuscripts() {
  const { supabase, userId } = await waitForAuthenticatedUser();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('writing_naver_posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as WritingNaverPostRecord[]).map(mapNaverRecord);
}

async function fetchNaverManuscriptDetail(id: string | number) {
  const { supabase, userId } = await waitForAuthenticatedUser();
  if (!userId) return null;
  const { data, error } = await supabase
    .from('writing_naver_posts')
    .select('*')
    .eq('id', Number(id))
    .limit(1);

  if (error) throw error;
  const row = (data || [])[0] as WritingNaverPostRecord | undefined;
  return row ? mapNaverRecord(row) : null;
}

export function useCreaiboxManuscriptsQuery() {
  return useQuery({
    queryKey: creaiboxManuscriptKeys.list,
    queryFn: fetchCreaiboxManuscripts,
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
  });
}

export function useCreaiboxManuscriptDetailQuery(displayId: string | number, placeholder?: StudioManuscriptRecord) {
  return useQuery({
    queryKey: creaiboxManuscriptKeys.detail(displayId),
    queryFn: () => fetchCreaiboxManuscriptDetail(displayId),
    enabled: Boolean(displayId),
    placeholderData: placeholder,
    refetchOnMount: "always",
  });
}

export function useNaverManuscriptsQuery() {
  return useQuery({
    queryKey: naverManuscriptKeys.list,
    queryFn: fetchNaverManuscripts,
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
  });
}

export function useNaverManuscriptDetailQuery(id: string | number, placeholder?: StudioManuscriptRecord) {
  return useQuery({
    queryKey: naverManuscriptKeys.detail(id),
    queryFn: () => fetchNaverManuscriptDetail(id),
    enabled: Boolean(id),
    placeholderData: placeholder,
    refetchOnMount: "always",
  });
}
