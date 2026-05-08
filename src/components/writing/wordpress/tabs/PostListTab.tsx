"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  Share2, Mail, Download, ChevronRight, 
  Filter, Calendar, MoreVertical, LayoutGrid, List,
  Type, AlignLeft, MessageSquare, Copy, Send, ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PostListTab({ user: propUser, isDarkMode }: any) { 
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🎨 테마별 스타일 정의
  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-[#0a0c10]/50" : "bg-zinc-50/80";
  const cardBg = isDarkMode ? "bg-zinc-900/20 border-zinc-800/50 hover:bg-zinc-800/40" : "bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";
  const borderColor = isDarkMode ? "border-zinc-800/50" : "border-zinc-200";

  const fetchPosts = async () => {
    try {
      let currentUser = propUser;
      if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
      }
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_email', currentUser.email)
        .order('created_at', { ascending: false });

      if (data) setPosts(data);
      else if (error) throw error;
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [propUser]);
  
  const handleDelete = async (id: number) => {
    if(confirm("정말 이 포스팅을 삭제하시겠습니까?")) {
      await supabase.from('posts').delete().eq('id', id);
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  // 검색 필터링 로직
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.post_type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-full transition-colors duration-500 font-sans ${themeBg} ${textColor}`}>
      
      {/* --- [왼쪽] 게시판 리스트 영역 --- */}
      <div className={`flex-1 flex flex-col border-r ${borderColor} ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
        {/* 헤더 섹션 */}
        <div className={`p-8 border-b backdrop-blur-xl shrink-0 transition-all ${headerBg} ${borderColor}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl font-black italic tracking-tighter uppercase mb-1 ${textColor}`}>Post Management</h2>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${subTextColor}`}>생성된 콘텐츠의 모든 설정값을 한눈에 관리하세요.</p>
            </div>
            <div className="flex gap-2">
               <button className={`p-2.5 border rounded-xl transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}><LayoutGrid size={18}/></button>
               <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20"><List size={18}/></button>
            </div>
          </div>

          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="제목, 말투, 유형 검색..."
              className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all ${
                isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 메인 테이블 */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>
                <th className="px-6 py-2 text-left w-12">No</th>
                <th className="px-6 py-2 text-left">Title</th>
                <th className="px-6 py-2 text-left w-32">Type</th>
                <th className="px-6 py-2 text-left w-48 text-blue-500">Tone (말투)</th>
                <th className="px-6 py-2 text-left w-40 text-emerald-500">Size (길이)</th>
                <th className="px-6 py-2 text-left w-32">Date</th>
                <th className="px-6 py-2 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, idx) => (
                <tr 
                  key={post.id} 
                  className={`group border transition-all cursor-pointer ${cardBg}`}
                  onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                >
                  <td className={`px-6 py-5 rounded-l-2xl border-y border-l text-[11px] font-bold ${subTextColor} ${borderColor}`}>{idx + 1}</td>
                  <td className={`px-6 py-5 border-y ${borderColor}`}>
                    <span className={`text-[14px] font-black group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{post.title}</span>
                  </td>
                  <td className={`px-6 py-5 border-y ${borderColor}`}>
                    <span className={`px-3 py-1 border rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>{post.type || post.post_type}</span>
                  </td>
                  <td className={`px-6 py-5 border-y ${borderColor}`}>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500/80">
                      <MessageSquare size={12} />
                      {(post.tone || "").split(' (')[0]}
                    </div>
                  </td>
                  <td className={`px-6 py-5 border-y ${borderColor}`}>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500/80">
                      <AlignLeft size={12} />
                      {(post.size || post.length || "").split(' (')[0]}
                    </div>
                  </td>
                  <td className={`px-6 py-5 border-y text-[11px] font-bold ${subTextColor} ${borderColor}`}>{post.date || new Date(post.created_at).toLocaleDateString()}</td>
                  <td className={`px-6 py-5 rounded-r-2xl border-y border-r ${borderColor}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-blue-500/10 rounded-lg text-zinc-500 hover:text-blue-500 transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
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
        <div className={`w-full lg:w-[45%] h-full flex flex-col border-l animate-in slide-in-from-right duration-500 transition-all ${
          isDarkMode ? 'bg-[#0d1117] border-zinc-800' : 'bg-white border-zinc-200 shadow-2xl'
        }`}>
          {/* 패널 헤더 */}
          <div className={`p-6 border-b flex justify-between items-center transition-all ${
            isDarkMode ? 'bg-[#0a0c10] border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <button onClick={() => setSelectedPost(null)} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${subTextColor} hover:text-blue-500`}>
              <ChevronRight className="rotate-180" size={16}/> Back to List
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  isEditing 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                  : (isDarkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm')
                }`}
              >
                {isEditing ? 'Save' : 'Edit Post'}
              </button>
              <button className={`p-2.5 border rounded-xl transition-all ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-white border-zinc-200 text-blue-600 shadow-sm'
              }`}><Download size={18}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {/* 설정 요약 정보 */}
            <div className={`flex gap-4 mb-10 pb-10 border-b ${borderColor}`}>
               <div className={`flex-1 p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Selected Tone</p>
                  <p className="text-[12px] font-bold text-blue-500">{selectedPost.tone}</p>
               </div>
               <div className={`flex-1 p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Target Size</p>
                  <p className="text-[12px] font-bold text-emerald-500">{selectedPost.size || selectedPost.length}</p>
               </div>
            </div>

            <div className="max-w-3xl">
               <h1 className={`text-4xl font-black italic tracking-tighter leading-tight mb-8 ${textColor}`}>{selectedPost.title}</h1>
               
               {isEditing ? (
                 <textarea
                   value={selectedPost.content}
                   onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})}
                   className={`w-full min-h-[50vh] bg-transparent border-none font-mono text-[14px] leading-[2.2] focus:outline-none resize-none ${
                     isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                   }`}
                 />
               ) : (
                 <pre className={`whitespace-pre-wrap font-mono text-[14px] leading-[2.2] ${
                   isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                 }`}>
                   {selectedPost.content}
                 </pre>
               )}
            </div>
          </div>

          {/* 패널 푸터 */}
          <div className={`p-8 border-t flex gap-4 transition-all ${isDarkMode ? 'bg-[#0a0c10] border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
             <button className={`flex-1 flex items-center justify-center gap-3 py-4 border rounded-2xl text-[11px] font-black transition-all uppercase tracking-widest ${
               isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'
             }`}>
               <Share2 size={18} /> SNS Share
             </button>
             <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-2xl text-[11px] font-black text-white hover:bg-blue-500 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20">
               <Eye size={18} /> Preview Mode
             </button>
          </div>
        </div>
      )}
    </div>
  );
}