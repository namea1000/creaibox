"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Sun } from 'lucide-react';

// Supabase 설정 (환경 변수 사용 권장)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Post {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // writing_creaibox_posts 테이블에서 데이터 가져오기
        const { data, error } = await supabase
          .from('writing_creaibox_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 font-sans">
      <header className="border-b border-zinc-800 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black text-white">CREAIBOX</h1>
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            {['AI 사이트', '다운로드센터', 'MacOS', '윈도우', '블로그 포스팅'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <Sun size={20} className="text-zinc-500" />
              <Search size={20} className="text-zinc-500" />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-zinc-500">데이터를 불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-600 transition-all shadow-lg">
                <div className="flex gap-4">
                  <div className="w-32 h-24 bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center text-[10px] text-zinc-500">
                    
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[17px] font-bold leading-tight line-clamp-2">{post.title}</h2>
                    <p className="text-[13px] text-zinc-400 line-clamp-2 flex-1">{post.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-800 text-[12px] text-zinc-500">
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{post.category}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}