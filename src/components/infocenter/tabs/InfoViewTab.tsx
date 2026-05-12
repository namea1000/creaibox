"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  ChevronLeft, ThumbsUp, MessageSquare, Trash2, Edit3 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

export default function InfoViewTab({ isDarkMode, editingPostId }: { isDarkMode: boolean, editingPostId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [postData, setPostData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      setUser(sessionUser);

      if (editingPostId) {
        setLoading(true);
        const { data: post } = await supabase.from('community_posts').select('*').eq('id', editingPostId).single();
        if (post) {
          setPostData(post);
          setLikes(post.like_count || 0);
          
          // 조회수 증가 (RPC 호출)
          if (sessionUser?.email !== post.user_email) {
            await supabase.rpc('increment_view_count', { row_id: editingPostId });
          }
          fetchComments();
          checkLikeStatus(sessionUser?.email);
        }
        setLoading(false);
      }
    };
    initData();
  }, [editingPostId]);

  const fetchComments = async () => {
    const { data } = await supabase.from('community_comments').select('*').eq('post_id', editingPostId).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const checkLikeStatus = async (email: string | undefined) => {
    if (!editingPostId || !email) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', editingPostId).eq('user_email', email).maybeSingle();
    if (data) setHasLiked(true);
  };

  const handleLike = async () => {
    if (!user || hasLiked) return;
    const { error } = await supabase.from('community_likes').insert([{ post_id: editingPostId, user_email: user.email }]);
    if (!error) {
      await supabase.from('community_posts').update({ like_count: likes + 1 }).eq('id', editingPostId);
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !user) return;
    const { error } = await supabase.from('community_comments').insert([{ post_id: editingPostId, user_email: user.email, content: newComment }]);
    if (!error) { setNewComment(""); fetchComments(); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black italic">LOADING POST...</div>;
  if (!postData) return <div className="p-20 text-center text-red-500 font-bold">POST NOT FOUND.</div>;

  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-xl";

  return (
    <div className={`max - w - 4xl mx - auto rounded - 3xl border p - 8 relative ${ cardBg } `}>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <button onClick={() => router.push('/infocenter/list/all')} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors">
          <ChevronLeft size={20} />
          <span className="text-xs font-black uppercase tracking-tighter italic">목록으로 돌아가기</span>
        </button>
        {user?.email === postData.user_email && (
          <button onClick={() => router.push(`/ infocenter / write ? id = ${ editingPostId } `)} className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-xs uppercase">
            <Edit3 size={14} /> 수정하기
          </button>
        )}
      </div>

      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">{postData.post_type}</span>
          <h2 className="text-3xl font-black mt-4 text-white leading-tight">{postData.title}</h2>
        </div>

        <article className={`min - h - [200px] leading - [1.8] pb - 12 border - b border - zinc - 800 / 50 ${ isDarkMode ? 'text-zinc-300' : 'text-zinc-700' } `}>
          <ReactMarkdown>{postData.content}</ReactMarkdown>
        </article>

        {/* 추천/공감 */}
        <div className="flex justify-center py-6">
          <button onClick={handleLike} disabled={hasLiked} className={`flex items - center gap - 2 px - 10 py - 4 font - black text - sm rounded - full transition - all border ${ hasLiked ? 'bg-zinc-800/20 text-zinc-600' : 'bg-zinc-800/50 text-zinc-400 hover:text-pink-500' } `}>
            <ThumbsUp size={20} /> {hasLiked ? "추천 완료" : `공감하기 ${ likes } `}
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
            <MessageSquare size={14} /> 댓글 ({comments.length})
          </h4>
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-blue-500 uppercase">{comment.user_email?.split('@')[0]}</span>
                <span className="text-[10px] text-zinc-600">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-zinc-300">{comment.content}</p>
            </div>
          ))}
          <div className="pt-4">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." className="w-full p-4 rounded-2xl text-sm border-none bg-zinc-800/50 text-white resize-none" rows={3} />
            <div className="flex justify-end mt-2">
              <button onClick={handleCommentSave} className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl uppercase">댓글 등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}