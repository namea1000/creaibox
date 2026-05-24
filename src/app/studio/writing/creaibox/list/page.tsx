"use client";

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Search, AlertCircle, RefreshCw, 
  Trash2, Globe, Edit3, Hash 
} from 'lucide-react';
// 📡 Supabase 통신 커넥터 연결
import { createClient } from '@/utils/supabase/client';
import { creaiboxManuscriptStore } from '@/lib/stores/manuscripts';

interface ManuscriptListType {
  id: string;
  displayId: number;
  title: string;
  content: string;
  keyword: string;
  type: 'create' | 'recreate';
  detailLabel: string;
  selectedTone: string; // 🌟 말투 (Tone) 명칭 저장소
  status: 'draft' | 'saved' | 'published';
  wordCount: number;
  updatedAt: string;
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
  word_count_goal?: string | null;
}

const STATUS_TABS: Array<{ key: 'all' | 'draft' | 'saved' | 'published'; label: string }> = [
  { key: 'all', label: '전체 원고' },
  { key: 'draft', label: '임시 저장' },
  { key: 'saved', label: '저장 완료' },
  { key: 'published', label: '발행 완료' }
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
}

export default function CreaiboxManuscriptListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const manuscriptStoreState = useSyncExternalStore(
    creaiboxManuscriptStore.subscribe,
    creaiboxManuscriptStore.getSnapshot,
    creaiboxManuscriptStore.getSnapshot
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'draft' | 'saved' | 'published'>('all');
  
  // 🌟 [오더 반영] 페이지네이션 상태 (한 페이지에 15개 표시로 증가)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // 🌟 [규격 준수] iframe 내부 경고 크래시 예방을 위한 프리미엄 커스텀 알림/컨펌 상태 기어
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
  } | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const manuscripts = manuscriptStoreState.list as ManuscriptListType[];
  const isLoading = manuscriptStoreState.listLoading;
  const isRefreshing = manuscriptStoreState.listRefreshing;

  const loadManuscripts = useCallback(async (options?: { background?: boolean; preserveOnAuthMiss?: boolean }) => {
    try {
      await creaiboxManuscriptStore.ensureList(options);
    } catch (error: unknown) {
      console.error("Supabase 원고 리스트 로드 오류:", getErrorMessage(error));
      showToast("원고 목록을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.", 'error');
    }
  }, []);

  useEffect(() => {
    creaiboxManuscriptStore.hydrate();
    if (pathname === '/studio/writing/creaibox/list') {
      void loadManuscripts({ background: true, preserveOnAuthMiss: true });
    }
  }, [loadManuscripts, pathname]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (pathname === '/studio/writing/creaibox/list') {
        void loadManuscripts({ background: true, preserveOnAuthMiss: true });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pathname === '/studio/writing/creaibox/list') {
        void loadManuscripts({ background: true, preserveOnAuthMiss: true });
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadManuscripts, pathname]);

  // 🗑️ Supabase 데이터베이스 행 영구 제거 엔진 (커스텀 컨펌 모달 연동)
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 상세페이지 라우팅 버블링 차단
    
    setModalConfig({
      title: "원고 영구 삭제",
      message: "정말로 이 원고를 데이터베이스 장부에서 영구히 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.",
      confirmText: "삭제하기",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('writing_creaibox_posts')
            .delete()
            .eq('id', id);
          if (error) throw error;
          
          creaiboxManuscriptStore.removeByIdentity(id);
          showToast("🗑️ 선택하신 원고가 Supabase DB에서 삭제되었습니다.");
        } catch (error: unknown) {
          const message = getErrorMessage(error);
          console.error("삭제 실패:", message);
          showToast(`삭제 처리에 실패했습니다: ${message}`, 'error');
        } finally {
          setModalConfig(null);
        }
      }
    });
  };

  // 🚀 발행 상태 플래그 Supabase 리얼 업데이트 엔진 (커스텀 컨펌 모달 연동)
  const handlePublish = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 행 클릭 이벤트 방어
    
    setModalConfig({
      title: "발행 완료 처리",
      message: "해당 원고를 '발행 완료' 상태로 등록하시겠습니까?",
      confirmText: "등록하기",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('writing_creaibox_posts')
            .update({ status: 'published' })
            .eq('id', id);
          
          if (error) throw error;
          
          showToast("🚀 원고의 발행 상태 업데이트가 완료되었습니다!");
          const target = manuscripts.find((m) => m.id === id);
          if (target) {
            creaiboxManuscriptStore.upsert({ ...target, status: 'published' } as any);
          }
        } catch (error: unknown) {
          const message = getErrorMessage(error);
          console.error("발행 업데이트 실패:", message);
          showToast(`상태 업데이트 실패: ${message}`, 'error');
        } finally {
          setModalConfig(null);
        }
      }
    });
  };

  // 📊 필터링 조합 처리 (검색어 + 탭 상태 매칭)
  const filteredList = manuscripts.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatusTab === 'all') return matchesSearch;
    return matchesSearch && m.status === selectedStatusTab;
  });

  // 🌟 페이지네이션 슬라이스 연산 (한 페이지당 15개로 촘촘하게 배열)
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const fillerRowCount = Math.max(0, itemsPerPage - paginatedList.length);

  return (
    <div className="p-3 px-6 max-w-[1700px] mx-auto h-[calc(100vh-80px)] flex flex-col gap-2 text-zinc-100 animate-in fade-in duration-300 bg-[#0a0c10] text-left relative">
      
      {/* 🌟 실시간 커스텀 푸시 토스트 알림창 */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] p-4.5 rounded-2xl border flex items-center gap-3 shadow-2xl animate-bounce ${
          toast.type === 'success' 
            ? 'bg-zinc-950 border-[#00c73c] text-white' 
            : 'bg-zinc-950 border-red-500 text-white'
        }`}>
          <span className="text-lg">{toast.type === 'success' ? '✅' : '❌'}</span>
          <span className="text-[15px] font-bold">{toast.message}</span>
        </div>
      )}

      {/* 🌟 [규격] 다크니스 커스텀 확인/취소 모달 (iframe 상의 alert/confirm 원천 대체) */}
      {modalConfig && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
              ⚠️ {modalConfig.title}
            </h3>
            <p className="text-[15px] text-zinc-400 font-bold mb-6 whitespace-pre-line leading-relaxed">
              {modalConfig.message}
            </p>
            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setModalConfig(null)}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-black text-zinc-300 transition-all cursor-pointer"
              >
                {modalConfig.cancelText}
              </button>
              <button 
                onClick={modalConfig.onConfirm}
                className="px-4.5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-black text-white transition-all cursor-pointer shadow-lg shadow-red-900/30"
              >
                {modalConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. 상단 타이틀 구역 (더욱 컴팩트하게 패딩 다듬기 완료) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shrink-0 border-b border-zinc-800/60 pb-1.5">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c73c] inline-block animate-pulse" />
            Creaibox 발행 원고 관리
          </h1>
          <p className="text-[13px] text-zinc-500 font-bold mt-0.5 leading-relaxed">
            AI로 제작된 원고의 장부를 관리합니다. 각 원고 행을 클릭하시면 실시간 수정/발행이 가능한 전용 스튜디오로 이동합니다.
          </p>
        </div>
        
        {/* 우측 검색 컨트롤바 (글씨체 크기 16px 세팅) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="원고 제목 또는 검색 키워드 입력..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-1.5 text-[16px] rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 focus:outline-none focus:border-[#00c73c] transition-all placeholder-zinc-600 font-black tracking-wide"
            />
          </div>
        </div>
      </div>

      {/* 새로고침 액션 제어반 (글씨체 14px급으로 최적화) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-1.5 px-4 bg-zinc-900/20 border border-zinc-800/80 rounded-xl gap-2 shrink-0">
        <div className="flex items-center gap-2 text-[13px] font-bold text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>원고 장부가 실시간으로 동기화됩니다. 다른 탭 복귀 시 자동으로 갱신을 시작합니다.</span>
        </div>
        <button
          onClick={() => loadManuscripts({ background: manuscripts.length > 0 })}
          disabled={isLoading || isRefreshing}
          className="px-4 py-1 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-[#00c73c]/50 rounded-lg text-[13px] font-black text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={13} className={isLoading || isRefreshing ? "animate-spin text-[#00c73c]" : "text-[#00c73c]"} />
          <span>{isRefreshing ? '최신 목록 동기화 중...' : '글 목록 가져오기 (수동 새로고침)'}</span>
        </button>
      </div>

      {/* 2. 분류 필터 스마트 탭 세션 (글씨체 14px 세팅) */}
      <div className="flex gap-2 border-b border-zinc-900 pb-1 shrink-0">
        {STATUS_TABS.map((tab) => {
          const count = tab.key === 'all'
            ? manuscripts.length
            : manuscripts.filter((m) => m.status === tab.key).length;

          return (
          <button
            key={tab.key}
            onClick={() => {
              setSelectedStatusTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 text-[14px] font-black rounded-lg transition-all flex items-center gap-2 ${
              selectedStatusTab === tab.key 
                ? 'bg-zinc-100 text-zinc-950 font-black shadow-md' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-black ${
              selectedStatusTab === tab.key ? 'bg-zinc-950 text-white' : 'bg-zinc-800/80 text-zinc-400'
            }`}>
              {count}
            </span>
          </button>
          );
        })}
      </div>

      {/* 3. 테이블형 목록 보드 (15개 완벽 꽉 채우기 격실 시스템) */}
      <div className="flex-1 bg-[#0c0e14] border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col min-h-0">
        
        {/* 스크롤 가능한 테이블 컨테이너 영역 (flex flex-col 및 h-full 세팅 주입) */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            
            {/* 고정식 헤더 완성 */}
            <thead className="sticky top-0 z-20 shadow-[0_2px_8px_rgba(0,0,0,0.8)] shrink-0">
              <tr className="bg-[#0f111a] border-b border-zinc-800 text-zinc-500 text-[13px] font-black uppercase tracking-wider select-none">
                <th className="py-3 px-4 bg-[#0f111a] text-center w-[5%]">번호</th>
                <th className="py-3 px-4 bg-[#0f111a] w-[38%]">포스팅 제목</th>
                <th className="py-3 px-4 bg-[#0f111a] w-[22%]">작성 방식</th>
                <th className="py-3 px-4 bg-[#0f111a] w-[12%]">말투(Tone)</th>
                <th className="py-3 px-4 text-center bg-[#0f111a] w-[7%]">글자 수</th>
                <th className="py-3 px-4 text-center bg-[#0f111a] w-[10%]">업데이트 일시</th>
                <th className="py-3 px-4 text-right pr-6 bg-[#0f111a] w-[10%]">관리 제어</th>
              </tr>
            </thead>
            
            {/* 🌟 [정밀 피드백 튜닝] h-full 설정으로 15개 원고가 카드 하단부까지 100% 꽉 채우도록 지시 */}
            <tbody className="divide-y divide-zinc-900/60 text-zinc-300 text-[15px] font-bold">
              {/* 로딩 중 15단 초슬림 스켈레톤 프리뷰 */}
              {isLoading ? (
                Array.from({ length: 15 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse border-b border-zinc-900/30 h-[68px]">
                    <td className="py-2.5 px-4 text-center">
                      <div className="h-3 w-6 bg-zinc-800/60 rounded mx-auto"></div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="h-3.5 w-80 bg-zinc-800/60 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="h-3.5 w-28 bg-zinc-800/60 rounded mb-0.5"></div>
                      <div className="h-2.5 w-20 bg-zinc-800/30 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="h-3.5 w-24 bg-zinc-800/50 rounded"></div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="h-3.5 w-12 bg-zinc-800/40 rounded mx-auto"></div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="h-3.5 w-28 bg-zinc-800/30 rounded mx-auto"></div>
                    </td>
                    <td className="py-2.5 px-4 text-right pr-6">
                      <div className="h-7 w-20 bg-zinc-800/40 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredList.length === 0 ? (
                /* 로딩이 끝났는데 데이터가 없을 때의 피팅 행 */
                <tr className="h-[420px]">
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500 gap-3">
                      <AlertCircle size={24} className="text-zinc-700" />
                      <span className="font-bold text-[15px]">보관 중인 Creaibox 포스팅 원고가 존재하지 않습니다.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                /* 🌟 [수술 부위 완료] 15단 높이 균등 배분(h-[calc(100%/15)]) 공식을 주입하여 여백 배제 */
                paginatedList.map((item, idx) => {
                  const displayIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const safeWordCount = Number(item.wordCount ?? item.content?.length ?? 0) || 0;
                  const safeUpdatedAt = item.updatedAt || '-';
                  const safeDisplayId = item.displayId || 0;
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => router.push(`/studio/writing/creaibox/list/${safeDisplayId}`)}
                      className="hover:bg-zinc-900/30 transition-all duration-150 cursor-pointer group h-[68px]"
                    >
                      {/* 1. 번호 (No.) */}
                      <td className="py-2 px-4 text-center text-zinc-400 font-black text-[14px] w-[5%] select-none align-middle">
                        {displayIndex}
                      </td>

                      {/* 2. 포스팅 제목 (순수 텍스트만 노출) */}
                      <td className="py-2 px-4 w-[38%] align-middle">
                        <div className="flex min-h-[52px] items-center">
                          <div className="font-extrabold text-zinc-100 group-hover:text-[#00c73c] text-[15px] tracking-tight transition-colors truncate max-w-xl">
                            {item.title}
                          </div>
                        </div>
                      </td>

                      {/* 3. 글 유형 (Type) 배지 및 키워드 */}
                      <td className="py-2 px-4 w-[22%] align-middle">
                        <div className="flex min-h-[52px] flex-col justify-center gap-0.5 items-start">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black tracking-wide inline-flex items-center gap-1 ${
                            item.type === 'recreate' 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            <Hash size={9} />
                            {item.type === 'recreate' ? '글 재창조' : '스마트 글쓰기'}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-bold">
                            {item.detailLabel}
                          </span>
                        </div>
                      </td>

                      {/* 4. 말투 (Tone) */}
                      <td className="py-2 px-4 text-zinc-400 text-[13px] font-bold truncate max-w-[150px] w-[12%] align-middle" title={item.selectedTone}>
                        {item.selectedTone}
                      </td>

                      {/* 5. 글자 수 */}
                      <td className="py-2 px-4 text-center text-zinc-400 font-black text-[14px] w-[7%] align-middle">
                        {safeWordCount.toLocaleString()} 자
                      </td>

                      {/* 6. 업데이트 일시 */}
                      <td className="py-2 px-4 text-center text-zinc-500 font-black font-mono text-[13px] w-[10%] align-middle">
                        {safeUpdatedAt}
                      </td>

                      {/* 7. 관리 제어 */}
                      <td className="py-2 px-4 text-right pr-6 w-[10%] align-middle">
                        <div className="flex min-h-[52px] items-center justify-end gap-1.5">
                          {/* 상세 수정 이동 */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/studio/writing/creaibox/list/${safeDisplayId}`);
                            }}
                            className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all shadow"
                            title="상세 수정하기"
                          >
                            <Edit3 size={13} />
                          </button>

                          {/* 발행 상태 업데이트 */}
                          <button 
                            onClick={(e) => handlePublish(e, item.id)}
                            disabled={item.status === 'published'}
                            className={`p-1.5 rounded-lg transition-all shadow ${
                              item.status === 'published' 
                                ? 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed'
                                : 'bg-emerald-600/10 text-emerald-400 border border-[#00c73c]/20 hover:bg-[#00c73c] hover:text-[#0a0c10]'
                            }`}
                            title={item.status === 'published' ? '이미 발행됨' : '발행완료 상태로 등록'}
                          >
                            <Globe size={13} />
                          </button>

                          {/* 삭제 */}
                          <button 
                            onClick={(e) => handleDelete(e, item.id)}
                            className="p-1.5 bg-red-950/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow"
                            title="영구 삭제"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!isLoading && filteredList.length > 0 && Array.from({ length: fillerRowCount }).map((_, idx) => (
                <tr key={`filler-${idx}`} className="h-[68px]">
                  <td className="py-2 px-4 text-center text-zinc-700/40 font-black text-[14px]"> </td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                  <td className="py-2 px-4"><div className="h-4 w-full rounded bg-transparent" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🌟 [오더 반영] 웅장한 크기로 시원하게 개편된 하단 페이지네이션 바 */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-3 border-t border-zinc-900 bg-[#07090e] gap-4 shrink-0 relative select-none">
          
          {/* 좌측: 결과 수 집계 */}
          <div className="text-[13px] text-zinc-500 font-black md:absolute md:left-6">
            검색 결과: 총 <span className="text-[#00c73c]">{totalItems}</span>개 중 <span className="text-zinc-300">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}</span> 표시
          </div>
          
          {/* 🌟 [완벽 정밀 세공] 정중앙: 가로 폭이 비약적으로 넓어진 메가 규격 페이지네이션 버튼 셋 */}
          <div className="flex items-center gap-3 mx-auto">
            {/* 처음으로 */}
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1 || isLoading}
              className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 hover:border-[#00c73c]/30 rounded-xl text-[14px] font-black text-zinc-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              처음으로
            </button>
            
            {/* 이전 페이지 (좌우 폭 추가 확장) */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1 || isLoading}
              className="px-8 py-2.5 bg-zinc-900/80 border border-zinc-800 hover:border-[#00c73c]/40 rounded-xl text-[14px] font-black text-zinc-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              이전 페이지
            </button>

            {/* 페이지 번호 (최소 너비 min-w-[115px]로 단추 폭을 극적으로 넓혀 clickable 최적화) */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              if (pageNum < currentPage - 2 || pageNum > currentPage + 2) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-6 py-2.5 h-10 min-w-[115px] rounded-xl text-[14px] font-black tracking-tight transition-all text-center ${
                    currentPage === pageNum 
                      ? 'bg-[#00c73c] text-zinc-950 shadow-lg shadow-[#00c73c]/20 font-black' 
                      : 'border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {pageNum} 페이지
                </button>
              );
            })}

            {/* 다음 페이지 (좌우 폭 추가 확장) */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || isLoading}
              className="px-8 py-2.5 bg-zinc-900/80 border border-zinc-800 hover:border-[#00c73c]/40 rounded-xl text-[14px] font-black text-zinc-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              다음 페이지
            </button>
            
            {/* 끝으로 */}
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || isLoading}
              className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 hover:border-[#00c73c]/30 rounded-xl text-[14px] font-black text-zinc-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              끝으로
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
