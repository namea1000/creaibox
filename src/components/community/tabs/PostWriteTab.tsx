"use client";

import React, { useState, useEffect } from 'react'; // 🌟 useEffect 추가
import { createClient } from '@/utils/supabase/client';
import { Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PostWriteTab({ isDarkMode, user, onCancel, onSuccess }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("free");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // 🌟 [추가] 현재 로그인된 유저를 한 번 더 확인하는 로직
  // props로 받은 user가 없더라도, Supabase에서 직접 세션을 가져옵니다.
  const [activeUser, setActiveUser] = useState(user);

  useEffect(() => {
    const checkSession = async () => {
      if (!user) {
        const { data: { user: sessionUser } } = await supabase.auth.getUser();
        if (sessionUser) setActiveUser(sessionUser);
      } else {
        setActiveUser(user);
      }
    };
    checkSession();
  }, [user]);

  // 🌟 게시글 저장 로직 (사장님 원본 로직 유지 + 유저 체크 보강)
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요!");
    
    // 🌟 props의 user 대신, 2중 체크된 activeUser를 사용합니다.
    if (!activeUser) {
      console.log("로그인 정보 없음");
      return alert("로그인이 필요한 서비스입니다.");
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            title: title,
            content: content,
            post_type: postType,
            user_email: activeUser.email, // 🌟 activeUser에서 이메일 추출
            status: 'published'
          }
        ]);

      if (error) throw error;

      alert("글이 성공적으로 등록되었습니다!");
      onSuccess(); // 저장 성공 시 리스트로 돌아가기
    } catch (error: any) {
      console.error("저장 에러:", error);
      alert(`저장 실패: ${error.message}`);
    }
    setLoading(false);
  };

  // 🎨 테마 스타일 정의 (사장님 원본 스타일 유지)
  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-xl";
  const inputBg = isDarkMode ? "bg-zinc-800/50 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900";

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl border p-8 ${cardBg}`}>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2">
          <Send size={20} className="text-blue-500" /> New Post
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* 카테고리 선택 */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Category</label>
          <div className="flex gap-2">
            {[
              { id: 'free', label: '자유게시판' },
              { id: 'qna', label: 'Q&A 질문' },
              { id: 'tips', label: '꿀팁/노하우' },
              { id: 'showcase', label: '작품공유' },
              { id: 'notice', label: '공지사항' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPostType(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  postType === cat.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                  : `${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Title</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="게시글 제목을 입력하세요"
            className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 transition-all ${inputBg}`}
          />
        </div>

        {/* 본문 입력 */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="당신의 창의적인 생각을 공유해주세요..."
            rows={12}
            className={`w-full px-5 py-5 rounded-2xl border text-sm font-medium focus:outline-none focus:border-blue-500 transition-all leading-relaxed resize-none custom-scrollbar ${inputBg}`}
          />
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 pt-4">
          <button 
            onClick={onCancel}
            className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border ${
              isDarkMode ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            취소하기
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className={`flex-[2] py-4 rounded-2xl font-black text-sm text-white transition-all shadow-xl flex items-center justify-center gap-2 ${
              loading ? 'bg-zinc-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 active:scale-[0.98]'
            }`}
          >
            {loading ? "등록 중..." : <><CheckCircle2 size={18} /> 게시글 등록하기</>}
          </button>
        </div>
      </div>
    </div>
  );
}