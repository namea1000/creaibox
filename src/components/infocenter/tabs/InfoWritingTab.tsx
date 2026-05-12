"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Send, X, CheckCircle2, Loader2, ChevronLeft, ThumbsUp, 
  MessageSquare, Image as ImageIcon, Paperclip, Smile, Eye, Trash2, Edit3 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

// 🌟 [배포 에러 방지] Props 의존성을 최소화하고 주소 이동(router) 방식을 도입했습니다.
export default function PostWriteTab({ isDarkMode, editingPostId }: { isDarkMode: boolean, editingPostId?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("free");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false); 
  const [user, setUser] = useState<any>(null);
  const [postData, setPostData] = useState<any>(null);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showEmoji, setShowEmoji] = useState<{target: string | null}>({target: null});
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"];

  // 🌟 [독립 로직] 페이지 접속 시 데이터 로딩
  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      setUser(sessionUser);

      if (editingPostId) {
        setLoading(true);
        const { data: post } = await supabase.from('community_posts').select('*').eq('id', editingPostId).single();
        if (post) {
          setPostData(post);
          setTitle(post.title);
          setContent(post.content);
          setPostType(post.post_type);
          setLikes(post.like_count || 0);
          
          // 조회수 증가 (작성자 본인 제외)
          if (sessionUser?.email !== post.user_email) {
            await supabase.rpc('increment_view_count', { row_id: editingPostId });
          }
          fetchComments();
          checkLikeStatus(sessionUser?.email || '');
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

  const checkLikeStatus = async (email: string) => {
    if (!editingPostId || !email) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', editingPostId).eq('user_email', email).maybeSingle();
    if (data) setHasLiked(true);
  };

  const addEmoji = (emoji: string) => {
    if (showEmoji.target === 'title') setTitle(title + emoji);
    if (showEmoji.target === 'content') setContent(content + emoji);
    if (showEmoji.target === 'comment') setNewComment(newComment + emoji);
    setShowEmoji({target: null});
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요!");
    if (!user) return alert("로그인이 필요합니다.");

    setLoading(true);
    try {
      if (editingPostId && postData?.user_email === user.email) {
        // 수정 모드
        await supabase.from('community_posts').update({ title, content, post_type: postType }).eq('id', editingPostId);
      } else {
        // 새 글 등록
        await supabase.from('community_posts').insert([{ title, content, post_type: postType, user_email: user.email, status: 'published' }]);
      }
      setSaveStatus(true);
      setTimeout(() => router.push('/infocenter/list'), 1500);
    } catch (err) { alert("저장 실패"); }
    setLoading(false);
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !user) return;
    const { error } = await supabase.from('community_comments').insert([{ post_id: editingPostId, user_email: user.email, content: newComment }]);
    if (!error) { setNewComment(""); fetchComments(); }
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

  const isAuthor = user?.email === postData?.user_email;
  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-xl";
  const inputBg = isDarkMode ? "bg-zinc-800/50 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900";

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl border p-8 relative ${cardBg}`}>
      
      {/* 미리보기 모달 (원본 보전) */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 ${cardBg}`}>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                <Eye size={16} className="text-blue-500" /> Preview
              </h4>
              <button onClick={() => setShowPreview(false)} className="text-white"><X size={20} /></button>
            </div>
            <div className={`prose prose-invert max-w-none ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 섹션 (디자인 보전) */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <button onClick={() => router.push('/infocenter/list')} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors">
          <ChevronLeft size={20} />
          <span className="text-xs font-black uppercase tracking-tighter italic">Back to List</span>
        </button>
        {saveStatus && <span className="text-blue-500 text-[10px] font-black animate-pulse uppercase">Saved Successfully!</span>}
      </div>

      {/* 상세보기 모드 */}
      {editingPostId && postData && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">{postType}</span>
              <h2 className="text-3xl font-black mt-4 text-white">{title}</h2>
            </div>
            <div className="flex gap-4 text-zinc-500 font-bold text-xs">
              <span className="flex items-center gap-1"><ThumbsUp size={14}/> {likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={14}/> {comments.length}</span>
            </div>
          </div>

          <article className={`min-h-[200px] leading-relaxed pb-12 border-b border-zinc-800/50 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>

          {/* 추천 버튼 (원본 디자인 보전) */}
          <div className="flex justify-center py-6">
            <button onClick={handleLike} disabled={hasLiked} className={`flex items-center gap-2 px-10 py-4 font-black text-sm rounded-full transition-all border ${hasLiked ? 'bg-zinc-800/20 text-zinc-600' : 'bg-zinc-800/50 text-zinc-400 hover:text-pink-500'}`}>
              <ThumbsUp size={20} /> {hasLiked ? "추천 완료" : `추천하기 ${likes}`}
            </button>
          </div>

          {/* 댓글 섹션 (원본 로직 보전) */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Comments ({comments.length})
            </h4>
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase">{comment.user_email?.split('@')[0]}</span>
                  {user?.email === comment.user_email && (
                    <button onClick={async () => {
                      if(confirm("삭제하시겠습니까?")) {
                        await supabase.from('community_comments').delete().eq('id', comment.id);
                        fetchComments();
                      }
                    }} className="text-red-500 opacity-50 hover:opacity-100"><Trash2 size={14}/></button>
                  )}
                </div>
                <p className="text-sm text-zinc-300">{comment.content}</p>
              </div>
            ))}
            <div className="pt-4">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 남겨보세요..." className={`w-full p-4 rounded-2xl text-sm border-none focus:ring-0 ${inputBg} resize-none`} rows={3} />
              <div className="flex justify-end mt-2">
                <button onClick={handleCommentSave} className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl uppercase">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기/수정 폼 (사장님이 직접 작성할 때만 노출) */}
      {(!editingPostId || isAuthor) && (
        <div className={`space-y-6 ${editingPostId ? 'mt-20 pt-20 border-t-4 border-dashed border-zinc-800' : ''}`}>
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black italic text-white uppercase">{editingPostId ? "Edit Post" : "New Post"}</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['free', 'qna', 'tips', 'showcase', 'notice'].map((id) => (
                <button key={id} onClick={() => setPostType(id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${postType === id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{id}</button>
              ))}
            </div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-blue-500 ${inputBg}`} />
            <textarea ref={textAreaRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="마크다운 형식을 지원합니다..." rows={12} className={`w-full px-5 py-5 rounded-2xl border text-sm font-medium outline-none focus:border-blue-500 leading-relaxed resize-none custom-scrollbar ${inputBg}`} />
            <div className="flex gap-3">
               <button onClick={() => setShowPreview(true)} className="flex-1 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2"><Eye size={16}/> Preview</button>
               <button onClick={handleSave} disabled={loading} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2">
                 {loading ? <Loader2 className="animate-spin" /> : "Publish Post"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}