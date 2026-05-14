"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  ChevronLeft, ThumbsUp, MessageSquare, Edit3 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

interface InfoViewTabProps {
  postId: string;
}

export default function InfoViewTab({ postId }: InfoViewTabProps) {
  const router = useRouter();
  const supabase = createClient();

  const [postData, setPostData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userNickname, setUserNickname] = useState(""); // 🌟 내 닉네임 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      // 1. 세션 유저 및 내 닉네임 정보 가져오기
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        setUser(sessionUser);
        const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', sessionUser.id).single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }

      // 2. 게시글 데이터 불러오기
      if (postId) {
        setLoading(true);
        // 🌟 작성자 닉네임(user_nickname)까지 한 번에 긁어옵니다.
        const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
        if (post) {
          setPostData(post);
          setLikes(post.like_count || 0);
          
          // 조회수 증가 (작성자가 아닐 때만)
          if (sessionUser?.email !== post.user_email) {
            await supabase.rpc('increment_view_count', { row_id: postId });
          }
          fetchComments();
          if (sessionUser) checkLikeStatus(sessionUser.email);
        }
        setLoading(false);
      }
    };
    initData();
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const checkLikeStatus = async (email: string | undefined) => {
    if (!postId || !email) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', postId).eq('user_email', email).maybeSingle();
    if (data) setHasLiked(true);
  };

  const handleLike = async () => {
    if (!user || hasLiked) return;
    const { error } = await supabase.from('community_likes').insert([{ post_id: postId, user_email: user.email }]);
    if (!error) {
      await supabase.from('community_posts').update({ like_count: likes + 1 }).eq('id', postId);
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !user) return;
    // 🌟 댓글 저장 시 내 닉네임(user_nickname)을 함께 저장합니다.
    const { error } = await supabase.from('community_comments').insert([{ 
      post_id: postId, 
      user_email: user.email, 
      user_nickname: userNickname, 
      content: newComment 
    }]);
    if (!error) { setNewComment(""); fetchComments(); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black italic uppercase tracking-widest">Loading Post Content...</div>;
  if (!postData) return <div className="p-20 text-center text-red-500 font-black uppercase italic">Post not found.</div>;

  const cardBg = "bg-zinc-900/40 border-zinc-800";
  const contentTextColor = "text-zinc-300";

  return (
    <div className={`max-w-4xl mx-auto rounded-[32px] border p-8 relative shadow-2xl transition-all ${cardBg}`}>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <button onClick={() => router.push('/infocenter/list/all')} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">목록으로 돌아가기</span>
        </button>
        {/* 🌟 내 글인지 확인할 때는 보안을 위해 이메일로 체크 */}
        {user?.email === postData.user_email && (
          <button onClick={() => router.push(`/infocenter/write?id=${postId}`)} className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-black text-[10px] uppercase italic">
            <Edit3 size={14} /> 게시글 수정
          </button>
        )}
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20 italic tracking-widest">
              {postData.post_type}
            </span>
            {/* 🌟 게시글 작성자 닉네임 표시 */}
            <span className="text-[11px] font-bold text-zinc-500 italic">
              By {postData.user_nickname || postData.user_email?.split('@')[0]}
            </span>
          </div>
          <h2 className="text-4xl font-black mt-4 text-white leading-tight tracking-tighter italic">
            {postData.title}
          </h2>
        </div>

        <article className={`min-h-[200px] leading-[1.8] pb-12 border-b border-zinc-800/50 prose prose-invert max-w-none text-left ${contentTextColor}`}>
          {/* 🌟 마크다운 내부 이미지 디자인 보전 */}
          <ReactMarkdown components={{ img: ({...props}) => (<img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Content" />) }}>
            {postData.content}
          </ReactMarkdown>
        </article>

        <div className="flex justify-center py-6">
          <button 
            onClick={handleLike} 
            disabled={hasLiked} 
            className={`flex items-center gap-2 px-12 py-4 font-black text-xs uppercase italic rounded-full transition-all border ${
              hasLiked ? 'bg-zinc-800/20 border-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-blue-500 hover:border-blue-500/50 active:scale-95 shadow-xl'
            }`}
          >
            <ThumbsUp size={18} /> {hasLiked ? "Completed" : `Recommend ${likes}`}
          </button>
        </div>

        <div className="space-y-6 pt-6 text-left">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-2 italic">
            <MessageSquare size={14} /> Discussions ({comments.length})
          </h4>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 rounded-2xl border border-zinc-800/50 bg-black/20 hover:border-zinc-700 transition-all">
                <div className="flex justify-between mb-3 items-center">
                  {/* 🌟 댓글 작성자 닉네임 표시 */}
                  <span className="text-[11px] font-black text-blue-500 uppercase italic tracking-tighter">
                    {comment.user_nickname || comment.user_email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-bold">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium text-left">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-800/30">
            <textarea 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="댓글을 입력하세요..." 
              className="w-full p-6 rounded-[24px] text-sm border border-zinc-800 bg-black/40 text-white resize-none focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-zinc-700" 
              rows={4} 
            />
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleCommentSave} 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl uppercase italic tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}