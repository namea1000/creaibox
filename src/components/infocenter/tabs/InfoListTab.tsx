"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  MessageSquare, User as UserIcon, 
  AlertCircle, PenTool, ChevronRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BoardListTab({ activeTab = 'all' }: { activeTab?: string }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // 🌟 [DB 통신 수정] 닉네임 필드까지 고려하여 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('community_posts')
          .select('*') // 🌟 user_nickname 필드가 포함된 전체 데이터를 가져옵니다.
          .order('created_at', { ascending: false });

        if (activeTab !== 'all') {
          query = query.eq('post_type', activeTab);
        }

        const { data, error } = await query;
        if (!error) {
          setPosts(data || []);
        } else {
          console.error("DB 쿼리 에러:", error.message);
        }
      } catch (err) {
        console.error("로딩 에러:", err);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [activeTab, supabase]);

  // 스타일 고정 (원본 보전)
  const listBg = "bg-zinc-900/20 border-zinc-800/50";
  const itemHover = "hover:bg-zinc-800/30";
  const textColor = "text-zinc-100";
  const subTextColor = "text-zinc-500";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 opacity-30 italic font-black uppercase tracking-widest text-white">
        <div className="animate-spin mb-4 text-2xl">⌛</div>
        Loading Feed...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      
      {/* 상단 헤더 & 글쓰기 버튼 섹션 (원본 보전) */}
      <div className="flex justify-between items-end mb-4 px-2">
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
            {activeTab === 'all' ? 'Overall Feed' : 
             activeTab === 'notice' ? 'Official Notice' : 
             activeTab === 'free' ? 'Free Lounge' : 
             activeTab === 'qna' ? 'Q&A Station' : 
             activeTab === 'tips' ? 'Master Tips' : 'Showcase'}
            <ChevronRight className="text-blue-500" size={20} />
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
            Crebox Community Strategic Knowledge Base
          </p>
        </div>

        <Link 
          href="/infocenter/write" 
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <PenTool size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest italic">Write Post</span>
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className={`rounded-2xl border overflow-hidden ${listBg}`}>
          <table className="w-full text-left border-collapse">
            <thead className="text-[11px] font-black uppercase tracking-widest border-b bg-zinc-900/50 border-zinc-800/50 text-zinc-500">
              <tr>
                <th className="px-6 py-4">분류</th>
                <th className="px-6 py-4">제목</th>
                <th className="px-6 py-4 text-center">조회</th>
                <th className="px-6 py-4 text-center">추천</th>
                <th className="px-6 py-4 text-right">날짜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {posts.map((post) => (
                <tr 
                  key={post.id} 
                  /* 🌟 상세 보기 페이지로 이동할 때 ID를 넘겨줍니다. */
                  onClick={() => router.push(`/infocenter/view?id=${post.id}`)} 
                  className={`group cursor-pointer transition-all ${itemHover}`}
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
                        {/* 🌟 [핵심 수정] 닉네임이 있으면 닉네임을, 없으면 이메일 앞자리를 보여줍니다. */}
                        <span className="flex items-center gap-1">
                          <UserIcon size={12} /> 
                          {post.user_nickname || post.user_email?.split('@')[0] || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} /> {post.comment_count || 0}
                        </span>
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
        <div className="rounded-3xl border-2 border-dashed flex flex-col items-center justify-center py-20 border-zinc-800/50">
          <AlertCircle className="text-zinc-700 mb-4" size={40} />
          <p className="text-zinc-500 font-black italic uppercase tracking-tighter">No posts found in this category.</p>
        </div>
      )}
    </div>
  );
}