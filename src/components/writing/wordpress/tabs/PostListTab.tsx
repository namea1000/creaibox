"use client";

import React, { useState, useEffect } from 'react'; // 🌟 useEffect 추가됨
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  Share2, Mail, Download, ChevronRight, 
  Filter, Calendar, MoreVertical, LayoutGrid, List,
  Type, AlignLeft, MessageSquare, Copy, Send
} from 'lucide-react';
// 🌟 supabase 열쇠 가져오기
import { supabase } from '@/lib/supabase';

// 🌟 [복원] 사장님의 소중한 예시 데이터 100% 그대로 유지
const initialPosts = [
  { 
    id: 1, 
    title: "아이폰 17 프로 vs 갤럭시 S25 울트라 카메라 성능 비교", 
    type: "IT/리뷰", 
    tone: "전문적이고 분석적인 말투", 
    size: "보통 (약 1,500자)", 
    date: "2026-05-07", 
    status: "완료",
    content: "## 카메라 성능 비교\n두 기기의 센서 크기 차이는..." 
  },
  { 
    id: 2, 
    title: "2026년 청년 전세자금대출 조건 및 정부 지원금 신청 가이드", 
    type: "수익형 핵심", 
    tone: "자신감 있고 설득력 있는 말투", 
    size: "길게 (약 3,000자)", 
    date: "2026-05-06", 
    status: "초안",
    content: "## 2026 청년 대출 가이드\n청년들의 주거 안정을 위해..." 
  },
  { 
    id: 3, 
    title: "비타민 D 부족 증상과 올바른 영양제 선택법: 성분별 함량 비교", 
    type: "건강 정보", 
    tone: "친근하고 부드러운 말투", 
    size: "짧게 (약 800자)", 
    date: "2026-05-05", 
    status: "완료",
    content: "## 비타민 D의 중요성\n현대인들에게 비타민 D는 필수입니다..." 
  }
];

// 🌟 props로 user를 직접 받도록 수정합니다.
export default function PostListTab({ user: propUser }: any) { 
  const [posts, setPosts] = useState<any[]>([]); // 🌟 초기값을 빈 배열로 시작 (혼동 방지)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const fetchPosts = async () => {
    try {
      // 🌟 부모가 준 유저 정보가 있으면 그것을 쓰고, 없으면 직접 가져옵니다.
      let currentUser = propUser;
      if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
      }
      
      if (!currentUser) {
        console.log("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_email', currentUser.email) // 🌟 확실하게 currentUser.email 사용
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      } else if (error) {
        throw error;
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [propUser]); // 🌟 propUser가 바뀔 때마다 다시 가져오기
  
  // 삭제 기능 (기본 유지)
  const handleDelete = async (id: number) => {
    if(confirm("정말 이 포스팅을 삭제하시겠습니까?")) {
      // DB에서도 삭제 시도
      await supabase.from('posts').delete().eq('id', id);
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  return (
    <div className="flex h-full bg-[#05070a] text-zinc-300 font-sans">
      
      {/* --- [왼쪽] 게시판 리스트 영역 --- */}
      <div className={`flex-1 flex flex-col ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
        {/* 헤더 섹션 */}
        <div className="p-8 border-b border-zinc-800/50 bg-[#05070a]/50 backdrop-blur-xl shrink-0">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">Post Management</h2>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-sans">생성된 콘텐츠의 모든 설정값을 한눈에 관리하세요.</p>
            </div>
            <div className="flex gap-2">
               <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white transition-all"><LayoutGrid size={18}/></button>
               <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20"><List size={18}/></button>
            </div>
          </div>

          {/* 검색 바 */}
          <div className="relative font-sans">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-sans" size={18} />
            <input 
              type="text" 
              placeholder="제목, 말투, 유형 검색..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all font-sans"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🌟 메인 테이블 (말투, 길이 유지) */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3 font-sans">
            <thead>
              <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-sans">
                <th className="px-6 py-2 text-left w-12 font-sans font-sans">No</th>
                <th className="px-6 py-2 text-left font-sans font-sans">Title</th>
                <th className="px-6 py-2 text-left w-32 font-sans font-sans">Type</th>
                <th className="px-6 py-2 text-left w-48 font-sans font-sans text-blue-500/80">Tone (말투)</th>
                <th className="px-6 py-2 text-left w-40 font-sans font-sans text-emerald-500/80">Size (길이)</th>
                <th className="px-6 py-2 text-left w-32 font-sans font-sans">Date</th>
                <th className="px-6 py-2 text-left w-24 font-sans font-sans">Status</th>
                <th className="px-6 py-2 text-center w-28 font-sans font-sans">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr 
                  key={post.id} 
                  className="group bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-800/40 transition-all cursor-pointer font-sans"
                  onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                >
                  <td className="px-6 py-5 rounded-l-2xl border-y border-l border-zinc-800/50 text-[11px] font-bold text-zinc-600 font-sans font-sans">{idx + 1}</td>
                  <td className="px-6 py-5 border-y border-zinc-800/50 font-sans">
                    <span className="text-[14px] font-black text-zinc-300 group-hover:text-blue-400 transition-colors font-sans">{post.title}</span>
                  </td>
                  <td className="px-6 py-5 border-y border-zinc-800/50 font-sans">
                    <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 font-sans">{post.type || post.post_type}</span>
                  </td>
                  {/* 🌟 말투 컬럼 보존 */}
                  <td className="px-6 py-5 border-y border-zinc-800/50 font-sans">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 font-sans font-sans">
                      <MessageSquare size={12} className="text-blue-500 font-sans" />
                      {(post.tone || "").split(' (')[0]}
                    </div>
                  </td>
                  {/* 🌟 길이 컬럼 보존 */}
                  <td className="px-6 py-5 border-y border-zinc-800/50 font-sans">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 font-sans font-sans">
                      <AlignLeft size={12} className="text-emerald-500 font-sans" />
                      {(post.size || post.length || "").split(' (')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-5 border-y border-zinc-800/50 text-[11px] font-bold text-zinc-600 font-sans font-sans">{post.date || new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-5 border-y border-zinc-800/50 font-sans">
                    <div className="flex items-center gap-1.5 font-sans font-sans font-sans">
                      <div className={`w-1.5 h-1.5 rounded-full ${post.status === '완료' ? 'bg-emerald-500 font-sans' : 'bg-amber-500 font-sans'}`} />
                      <span className="text-[10px] font-black uppercase tracking-tighter font-sans">{post.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 rounded-r-2xl border-y border-r border-zinc-800/50 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2 font-sans">
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all font-sans"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-zinc-500 hover:text-red-500 transition-all font-sans"><Trash2 size={16}/></button>
                      <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all font-sans"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- [오른쪽] 상세 보기 슬라이드 패널 --- */}
      {selectedPost && (
        <div className="w-full lg:w-[45%] h-full flex flex-col bg-[#080a0f] border-l border-zinc-800 animate-in slide-in-from-right duration-500 font-sans">
          {/* 패널 헤더 */}
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center bg-[#05070a] font-sans">
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[11px] font-black uppercase tracking-widest font-sans font-sans">
              <ChevronRight className="rotate-180 font-sans" size={16}/> Back to List
            </button>
            <div className="flex gap-2 font-sans">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all font-sans font-sans ${isEditing ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-sans' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white font-sans'}`}
              >
                {isEditing ? 'Save' : 'Edit Post'}
              </button>
              <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-blue-500 hover:text-blue-400 transition-all font-sans font-sans"><Download size={18}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-sans font-sans">
            {/* 설정 요약 정보 (말투, 길이 강조) */}
            <div className="flex gap-4 mb-10 pb-10 border-b border-zinc-800/50 font-sans font-sans">
               <div className="flex-1 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 font-sans font-sans">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1 font-sans">Selected Tone</p>
                  <p className="text-[12px] font-bold text-blue-400 font-sans">{selectedPost.tone}</p>
               </div>
               <div className="flex-1 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 font-sans font-sans">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1 font-sans font-sans">Target Size</p>
                  <p className="text-[12px] font-bold text-emerald-400 font-sans font-sans">{selectedPost.size || selectedPost.length}</p>
               </div>
            </div>

            <div className="max-w-3xl font-sans">
               <h1 className="text-4xl font-black text-white italic tracking-tighter leading-tight mb-8 font-sans font-sans">{selectedPost.title}</h1>
               
               {isEditing ? (
                 <textarea
                   value={selectedPost.content}
                   onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                   className="w-full min-h-[50vh] bg-transparent border-none text-zinc-400 font-mono text-[14px] leading-[2.2] focus:outline-none resize-none font-sans font-sans"
                 />
               ) : (
                 <pre className="whitespace-pre-wrap text-zinc-400 font-mono text-[14px] leading-[2.2] font-sans font-sans">
                   {selectedPost.content}
                 </pre>
               )}
            </div>
          </div>

          {/* 패널 푸터 (공유 및 프리뷰) */}
          <div className="p-8 border-t border-zinc-800/50 flex gap-4 bg-[#05070a] font-sans font-sans">
             <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] font-black text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-widest font-sans font-sans">
               <Share2 size={18} className="font-sans" /> SNS Share
             </button>
             <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-2xl text-[11px] font-black text-white hover:bg-blue-500 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20 font-sans font-sans">
               <Eye size={18} className="font-sans" /> Preview Mode
             </button>
          </div>
        </div>
      )}
    </div>
  );
}