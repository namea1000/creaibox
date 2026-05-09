"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  MessageSquare, Eye, ThumbsUp, Clock, User as UserIcon, 
  ChevronRight, ChevronLeft, Search, AlertCircle 
} from 'lucide-react';

// 🌟 props에 onEdit를 추가로 받아야 CommunityCenter와 연결됩니다.
export default function BoardListTab({ isDarkMode, activeTab, onEdit }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // 🌟 게시글 데이터 가져오기 (커뮤니티 포스트 테이블로 변경 확인)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('post_type', activeTab);
      }

      const { data, error } = await query;

      if (error) {
        console.error("데이터 로딩 에러:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [activeTab]);

  // 🎨 테마별 스타일
  const listBg = isDarkMode ? "bg-zinc-900/20 border-zinc-800/50" : "bg-white border-zinc-200 shadow-sm";
  const itemHover = isDarkMode ? "hover:bg-zinc-800/30" : "hover:bg-zinc-50";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 opacity-30 italic font-black uppercase tracking-widest">
        <div className="animate-spin mb-4">⌛</div>
        Loading Feed...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.length > 0 ? (
        <div className={`rounded-2xl border overflow-hidden ${listBg}`}>
          <table className="w-full text-left border-collapse">
            <thead className={`text-[11px] font-black uppercase tracking-widest border-b ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
              <tr>
                <th className="px-6 py-4 font-black">분류</th>
                <th className="px-6 py-4 font-black">제목</th>
                <th className="px-6 py-4 font-black text-center">조회</th>
                <th className="px-6 py-4 font-black text-center">추천</th>
                <th className="px-6 py-4 font-black text-right">날짜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {posts.map((post) => (
                <tr 
                  key={post.id} 
                  // ❌ 기존 오류: className={`... onClick={() => ...}`} (텍스트로 들어감)
                  // ✅ 수정: onClick을 독립된 이벤트로 분리
                  className={`group cursor-pointer transition-all ${itemHover}`}
                  onClick={() => onEdit && onEdit(post)} 
                >
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                      post.post_type === 'notice' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {post.post_type || '자유'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className={`text-[14px] font-bold mb-1 group-hover:text-blue-500 transition-colors ${textColor}`}>
                        {post.title}
                      </span>
                      <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                        <span className="flex items-center gap-1"><UserIcon size={12} /> {post.user_email?.split('@')[0]}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={12} /> 12</span>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-5 text-center text-xs font-bold ${subTextColor}`}> {post.view_count || 0} </td>
                  <td className={`px-6 py-5 text-center text-xs font-bold ${subTextColor}`}> {post.like_count || 0} </td>
                  <td className={`px-6 py-5 text-right text-xs font-bold ${subTextColor}`}>
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`rounded-3xl border-2 border-dashed flex flex-col items-center justify-center py-20 ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
          <AlertCircle className="text-zinc-700 mb-4" size={40} />
          <p className="text-zinc-500 font-black italic uppercase tracking-tighter">No posts found in this category.</p>
        </div>
      )}

      {/* 페이지네이션 생략 (기존 것 유지) */}
    </div>
  );
}