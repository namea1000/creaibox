"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Share2, Eye } from 'lucide-react';

export default function PostDetail() {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('creaibox_posts')
        .select('*')
        .eq('slug', params.slug)
        .single();
      
      if (data) {
        setPost(data);
        // 동적 메타데이터 업데이트 (Head 태그 대체)
        document.title = `${data.title} | Creaibox Blog`;
        updateMetaTags(data);
      }
      setLoading(false);
    };
    fetchPost();
  }, [params.slug]);

  const updateMetaTags = (data: any) => {
    const head = document.head;
    
    // 메타 설명 업데이트
    let desc = head.querySelector('meta[name="description"]');
    if (!desc) { desc = document.createElement('meta'); desc.setAttribute('name', 'description'); head.appendChild(desc); }
    desc.setAttribute('content', data.meta_description || "");

    // OG 이미지 업데이트
    let ogImg = head.querySelector('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property', 'og:image'); head.appendChild(ogImg); }
    ogImg.setAttribute('content', data.og_image || "");
  };

  if (loading) return <div className="text-center p-20 text-zinc-500 font-black">AI가 문맥을 분석 중입니다...</div>;
  if (!post) return <div className="text-center p-20 text-red-500 font-black">존재하지 않는 페이지입니다.</div>;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 bg-[#050505] min-h-screen text-zinc-100">
      {/* 뒤로가기 및 헤더 */}
      <nav className="mb-12">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-zinc-500 hover:text-blue-400 transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> 목록으로 돌아가기
        </button>
      </nav>

      {/* 포스트 제목 */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-6 text-zinc-500 text-sm font-bold">
          <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-2"><Eye size={14} /> 1.2k views</span>
        </div>
      </header>

      {/* 본문 영역 */}
      <div className="prose prose-invert prose-lg prose-blue max-w-none leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 공유하기 및 하단 고정 */}
      <footer className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
        <button className="flex items-center gap-2 text-zinc-400 font-bold hover:text-white">
          <Share2 size={18} /> 공유하기
        </button>
        <span className="text-xs text-zinc-600 font-mono">ID: {post.slug}</span>
      </footer>
    </article>
  );
}