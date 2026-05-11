"use client";

import React, { useState } from 'react';
import { 
  Megaphone, MessageSquare, HelpCircle, Lightbulb, 
  Users, Search, PlusCircle, TrendingUp, Hash, ArrowLeft // 🌟 ArrowLeft 추가
} from 'lucide-react';
import { useRouter } from 'next/navigation'; // 🌟 뒤로가기 기능을 위한 Router 추가

// 🌟 하위 탭 컴포넌트 임포트 (경로 확인 완료)
import BoardListTab from '@/components/community/tabs/BoardListTab';
import PostWriteTab from '@/components/community/tabs/PostWriteTab';

export default function CommunityCenter(props: any) {
  const { isDarkMode, user } = props;
  const router = useRouter(); // 🌟 Router 초기화
  const [activeTab, setActiveTab] = useState('all');
  const [isWriting, setIsWriting] = useState(false); // 🌟 글쓰기 모드 상태 추가
  const [editingPost, setEditingPost] = useState<any>(null); // 🌟 수정할 글 상태 추가

  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-zinc-50 border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const tabInactiveColor = isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-zinc-900";

  // 🌟 [추가] 모든 쓰기/수정 모드를 초기화하는 함수
  const handleCloseWrite = () => {
    setIsWriting(false);
    setEditingPost(null);
  };

  const handleBackToList = () => {
  setIsWriting(false);
  setEditingPost(null);
  // 🌟 여기서 데이터를 다시 불러오는 fetchPosts 같은 함수가 실행되도록 연결되어 있어야 합니다.
  };

  // 카테고리 구성
  const tabs = [
    { id: 'all', label: '전체글', icon: Hash },
    { id: 'notice', label: '공지사항', icon: Megaphone },
    { id: 'free', label: '자유게시판', icon: MessageSquare },
    { id: 'qna', label: 'Q&A 질문', icon: HelpCircle },
    { id: 'tips', label: '꿀팁/노하우', icon: Lightbulb },
    { id: 'showcase', label: '작품공유', icon: Users },
  ];

  return (
    <div className={`flex h-full transition-colors duration-500 overflow-hidden font-sans ${themeBg} ${textColor}`}>
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 상단 탭 네비게이션 */}
        <div className={`flex items-center px-6 border-b shrink-0 transition-all ${headerBg}`}>
          
          {/* 🌟 [수정] 맥 패드 제스처 방지용 뒤로가기 버튼 추가 */}
          <div className="pr-4 mr-2 border-r border-zinc-800/50 py-4">
            <button 
              onClick={() => router.push('/')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 group
                ${isDarkMode 
                  ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white' 
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                }
              `}
            >
              <ArrowLeft size={16} className="text-blue-500 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-widest italic">커뮤니티홈</span>
            </button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  handleCloseWrite(); // 🌟 탭 누를 때 모든 창 닫기 (수정됨)
                }}
                className={`flex items-center gap-2 px-6 py-5 text-[13px] font-black uppercase tracking-tighter transition-all relative shrink-0 ${
                  activeTab === tab.id && !isWriting && !editingPost ? 'text-blue-500' : tabInactiveColor
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {activeTab === tab.id && !isWriting && !editingPost && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-2px_10px_rgba(59,130,246,0.6)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 게시판 메인 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* 🌟 조건부 렌더링 시작 */}
            {isWriting || editingPost ? (
              <PostWriteTab 
                isDarkMode={isDarkMode} 
                user={user} 
                editingPost={editingPost} // 🌟 수정할 데이터 전달
                onCancel={handleCloseWrite} // 🌟 초기화 함수 연결
                onSuccess={handleCloseWrite} // 🌟 초기화 함수 연결
              />
            ) : (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      크리에이터들과 다양한 정보를 공유하고 소통하세요.
                    </p>
                  </div>
                  
                  {/* 🌟 드디어 추가된 진짜 onClick 로직! */}
                  <button 
                    onClick={() => setIsWriting(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                  >
                    <PlusCircle size={18} /> 글쓰기
                  </button>
                </div>

                {/* 🌟 [수정] 리스트에서 글을 클릭했을 때 수정 모드로 전환하는 함수 연결 */}
                <BoardListTab 
                  isDarkMode={isDarkMode} 
                  activeTab={activeTab} 
                  onEdit={(post: any) => setEditingPost(post)} 
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽 사이드바 (동일) */}
      <div className={`w-80 border-l flex flex-col shrink-0 transition-all ${isDarkMode ? 'bg-zinc-900/10 border-zinc-800/50' : 'bg-zinc-100/50 border-zinc-200'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input type="text" placeholder="커뮤니티 검색" className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs font-bold focus:outline-none transition-all ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}`} />
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-8">
          <div>
            <h3 className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> Hot Topics
            </h3>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <p className="text-xs font-bold leading-relaxed line-clamp-2">AI로 유튜브 숏츠 수익화하는 방법 공유합니다.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}