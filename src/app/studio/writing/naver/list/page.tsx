"use client";

import React, { useMemo, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, AlertCircle, RefreshCw, Trash2, Globe, Edit3 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useNaverManuscriptsQuery, naverManuscriptKeys, type StudioManuscriptRecord } from '@/lib/queries/manuscripts';
import { useManuscriptUiStore } from '@/lib/stores/manuscript-ui';

const PAGE_SIZE = 15;

function formatDisplayDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getWordCount(value?: number | null, content?: string | null) {
  const safeValue = Number(value ?? 0);
  if (safeValue > 0) return safeValue;
  return (content ?? '').replace(/\s+/g, '').length;
}

export default function NaverManuscriptListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  const currentPage = useManuscriptUiStore((state) => state.naverCurrentPage);
  const setCurrentPage = useManuscriptUiStore((state) => state.setNaverCurrentPage);
  const statusTab = useManuscriptUiStore((state) => state.naverStatusTab);
  const setStatusTab = useManuscriptUiStore((state) => state.setNaverStatusTab);
  const searchTerm = useManuscriptUiStore((state) => state.naverSearchTerm);
  const setSearchTerm = useManuscriptUiStore((state) => state.setNaverSearchTerm);

  const { data: manuscripts = [], isLoading, isFetching, refetch } = useNaverManuscriptsQuery();
  const isInitialLoading = isLoading && manuscripts.length === 0;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refetch();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, refetch]);

  const filteredManuscripts = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    return manuscripts.filter((manuscript) => {
      const matchesStatus = statusTab === 'all' || manuscript.status === statusTab;
      const matchesSearch =
        !lowerSearch ||
        manuscript.title.toLowerCase().includes(lowerSearch) ||
        manuscript.targetKeyword.toLowerCase().includes(lowerSearch) ||
        manuscript.selectedTone.toLowerCase().includes(lowerSearch);
      return matchesStatus && matchesSearch;
    });
  }, [manuscripts, searchTerm, statusTab]);

  const totalPages = Math.max(1, Math.ceil(filteredManuscripts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedManuscripts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredManuscripts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredManuscripts, safeCurrentPage]);

  const paddedRows = useMemo(() => {
    const rows = [...paginatedManuscripts];
    while (rows.length < PAGE_SIZE) rows.push(null as unknown as StudioManuscriptRecord);
    return rows;
  }, [paginatedManuscripts]);

  const tabCounts = useMemo(() => ({
    all: manuscripts.length,
    draft: manuscripts.filter((item) => item.status === 'draft').length,
    saved: manuscripts.filter((item) => item.status === 'saved').length,
    published: manuscripts.filter((item) => item.status === 'published').length,
  }), [manuscripts]);

  const handleOpenManuscript = useCallback((manuscript: StudioManuscriptRecord) => {
    router.push(`/studio/writing/naver/list/${manuscript.id}`);
  }, [router]);

  const handleDelete = useCallback(async (manuscript: StudioManuscriptRecord) => {
    if (!window.confirm('이 원고를 삭제할까요?')) return;

    const { error } = await supabase.from('writing_naver_posts').delete().eq('id', manuscript.id);
    if (error) {
      window.alert(`삭제 실패: ${error.message}`);
      return;
    }

    queryClient.setQueryData<StudioManuscriptRecord[]>(naverManuscriptKeys.list, (prev = []) =>
      prev.filter((item) => item.id !== manuscript.id)
    );
  }, [queryClient, supabase]);

  const handlePublish = useCallback(async (manuscript: StudioManuscriptRecord) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('writing_naver_posts')
      .update({ status: 'published' })
      .eq('id', manuscript.id);

    if (error) {
      window.alert(`발행 실패: ${error.message}`);
      return;
    }

    queryClient.setQueryData<StudioManuscriptRecord[]>(naverManuscriptKeys.list, (prev = []) =>
      prev.map((item) => item.id === manuscript.id ? { ...item, status: 'published', updatedAt: now } : item)
    );
  }, [queryClient, supabase]);

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white px-6 py-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">네이버 발행 원고 관리</h1>
          <p className="text-white/55 mt-2">AI로 제작된 원고를 관리합니다. 각 원고를 클릭하면 실시간 수정/발행이 가능한 전용 스튜디오로 이동합니다.</p>
        </div>
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="원고 제목 또는 검색 키워드 입력..."
              className="w-full rounded-2xl border border-white/10 bg-[#10141c] py-4 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/28"
            />
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-[#10141c] px-5 py-4 text-white/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span>원고 장부가 실시간으로 동기화됩니다. 다른 탭 복귀 시 자동으로 갱신을 시작합니다.</span>
        </div>
        <button
          onClick={() => void refetch()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? '글 목록 가져오는 중...' : '글 목록 가져오기 (수동 새로고침)'}
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 text-sm font-semibold">
        {[
          ['all', '전체 원고', tabCounts.all],
          ['draft', '임시 저장', tabCounts.draft],
          ['saved', '저장 완료', tabCounts.saved],
          ['published', '발행 완료', tabCounts.published],
        ].map(([key, label, count]) => {
          const active = statusTab === key;
          return (
            <button
              key={key}
              onClick={() => {
                setStatusTab(key as 'all' | 'draft' | 'saved' | 'published');
                setCurrentPage(1);
              }}
              className={`rounded-xl px-4 py-2 transition ${active ? 'bg-white text-[#0a0d12]' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
            >
              {label} <span className="ml-2 rounded-md bg-black/20 px-2 py-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1118]">
        <div className="grid grid-cols-[92px_minmax(0,1.9fr)_1.1fr_1.05fr_0.6fr_0.9fr_0.75fr] gap-4 border-b border-white/8 bg-[#121722] px-8 py-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
          <div>번호</div>
          <div>포스팅 제목</div>
          <div>작성 방식</div>
          <div>말투(Tone)</div>
          <div>글자 수</div>
          <div>업데이트 일시</div>
          <div className="text-right">관리 제어</div>
        </div>

        <div>
          {(isInitialLoading
            ? Array.from({ length: PAGE_SIZE }, () => null as unknown as StudioManuscriptRecord)
            : paddedRows
          ).map((manuscript, index) => {
            if (!manuscript) {
              return (
                <div key={`empty-${index}`} className="grid min-h-[112px] grid-cols-[92px_minmax(0,1.9fr)_1.1fr_1.05fr_0.6fr_0.9fr_0.75fr] gap-4 border-b border-white/5 px-8">
                  <div className="flex items-center"><div className="h-4 w-6 rounded bg-white/5" /></div>
                  <div className="flex items-center"><div className="h-5 w-5/6 rounded bg-white/5" /></div>
                  <div className="flex items-center"><div className="h-5 w-24 rounded bg-white/5" /></div>
                  <div className="flex items-center"><div className="h-5 w-24 rounded bg-white/5" /></div>
                  <div className="flex items-center"><div className="h-5 w-12 rounded bg-white/5" /></div>
                  <div className="flex items-center"><div className="h-5 w-20 rounded bg-white/5" /></div>
                  <div className="flex items-center justify-end"><div className="h-8 w-20 rounded bg-white/5" /></div>
                </div>
              );
            }

            const rowNumber = (safeCurrentPage - 1) * PAGE_SIZE + index + 1;
            const wordCount = getWordCount(manuscript.wordCount, manuscript.content);
            const updatedText = formatDisplayDate(manuscript.updatedAt || manuscript.createdAt);
            const typeLabel = manuscript.postType === 'recreate' ? '글 재창조' : '스마트 글쓰기';
            const modeLabel = manuscript.sourceMode === 'url' ? 'URL 재창조' : manuscript.sourceMode === 'text' ? '텍스트 재창조' : manuscript.postType === 'recreate' ? 'AI 재창조' : 'AI 스마트 글쓰기';
            const isSelected = pathname === `/studio/writing/naver/list/${manuscript.id}`;

            return (
              <div
                key={manuscript.id}
                className={`grid min-h-[112px] cursor-pointer grid-cols-[92px_minmax(0,1.9fr)_1.1fr_1.05fr_0.6fr_0.9fr_0.75fr] gap-4 border-b border-white/5 px-8 transition ${isSelected ? 'bg-[#111827]' : 'hover:bg-white/[0.02]'}`}
                onClick={() => handleOpenManuscript(manuscript)}
              >
                <div className="flex items-center text-2xl font-bold text-white/65">{rowNumber}</div>
                <div className="flex min-w-0 items-center text-[1.25rem] font-bold leading-snug tracking-[-0.02em] text-white">{manuscript.title}</div>
                <div className="flex flex-col justify-center gap-2">
                  <span className="inline-flex w-fit items-center rounded-lg border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-sm font-semibold text-indigo-200">{typeLabel}</span>
                  <span className="text-sm text-white/45">{modeLabel}</span>
                </div>
                <div className="flex items-center text-sm text-white/70 truncate">{manuscript.selectedTone || '말투 설정 없음'}</div>
                <div className="flex items-center text-xl font-semibold text-white/80">{Number(wordCount).toLocaleString()} 자</div>
                <div className="flex items-center text-sm text-white/55">{updatedText}</div>
                <div className="flex items-center justify-end gap-2" onClick={(event) => event.stopPropagation()}>
                  <button onClick={() => handleOpenManuscript(manuscript)} className="rounded-full border border-white/10 bg-white/5 p-3 text-white/80 hover:bg-white/10"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => void handlePublish(manuscript)} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 hover:bg-emerald-500/15"><Globe className="h-4 w-4" /></button>
                  <button onClick={() => void handleDelete(manuscript)} className="rounded-full border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 hover:bg-rose-500/15"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-white/45">
        <div>검색 결과: 총 <span className="font-semibold text-emerald-300">{filteredManuscripts.length}개</span> 중 {(safeCurrentPage - 1) * PAGE_SIZE + 1} - {Math.min(safeCurrentPage * PAGE_SIZE, filteredManuscripts.length || PAGE_SIZE)} 표시</div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage(1)} disabled={safeCurrentPage === 1} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40">처음으로</button>
          <button onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))} disabled={safeCurrentPage === 1} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40">이전 페이지</button>
          <span className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-[#06120c]">{safeCurrentPage} 페이지</span>
          <button onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))} disabled={safeCurrentPage === totalPages} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40">다음 페이지</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={safeCurrentPage === totalPages} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-40">끝으로</button>
        </div>
      </div>

      {isInitialLoading && (
        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-amber-200/80 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          원고 목록을 불러오는 중입니다.
        </div>
      )}

      {!isInitialLoading && manuscripts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#10141c] px-5 py-6 text-white/60">
          현재 계정에 저장된 네이버 원고가 없습니다.
        </div>
      )}
    </div>
  );
}
