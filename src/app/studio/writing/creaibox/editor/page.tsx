"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Globe, Share2 } from 'lucide-react';

export default function AdvancedBlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImage, setOgImage] = useState('');
  const supabase = createClient();

  // 본문이 바뀔 때마다 자동으로 메타 설명 생성
  useEffect(() => {
    if (content) {
      const summary = content.replace(/[#*`]/g, '').substring(0, 80);
      setMetaDesc(summary);
    }
  }, [content]);

  const createSlug = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handlePublish = async () => {
    if (!title || !content) return alert("제목과 내용을 입력하세요.");
    
    const slug = createSlug(title);
    
    const { error } = await supabase.from('creaibox_posts').insert([{
      title,
      content,
      slug,
      meta_description: metaDesc,
      og_image: ogImage,
      created_at: new Date().toISOString()
    }]);

    if (error) alert("발행 실패!");
    else { alert("SEO 최적화가 완료된 블로그 글이 발행되었습니다!"); }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#050505] min-h-screen text-zinc-100">
      <h1 className="text-2xl font-black mb-8 text-blue-500">SEO 최적화 에디터</h1>
      
      <div className="space-y-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <input 
            className="w-full bg-transparent text-2xl font-bold mb-4 outline-none placeholder-zinc-600"
            placeholder="글 제목을 입력하세요 (H1)"
            value={title} onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            className="w-full h-80 bg-transparent outline-none resize-none leading-relaxed"
            placeholder="본문 내용을 입력하세요 (마크다운 사용 가능)"
            value={content} onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 flex items-center gap-2">
              <Globe size={14} /> 자동 생성된 메타 설명 (80자)
            </label>
            <textarea 
              className="w-full bg-zinc-950 p-3 rounded-xl text-sm h-20 border border-zinc-700"
              value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 flex items-center gap-2">
              <Share2 size={14} /> 오픈 그래프 이미지 (OG Image)
            </label>
            <input 
              className="w-full bg-zinc-950 p-3 rounded-xl text-sm border border-zinc-700"
              placeholder="https://이미지주소.jpg"
              value={ogImage} onChange={(e) => setOgImage(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handlePublish} 
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all"
        >
          <Send size={18} /> 블로그에 발행하기
        </button>
      </div>
    </div>
  );
}