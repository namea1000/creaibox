"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Send, X, CheckCircle2, Loader2, ChevronLeft, ThumbsUp,
  MessageSquare, Image as ImageIcon, Paperclip, Smile, Eye, Trash2, Edit3
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PostWriteTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get('id');
  // 🌟 [추가] 주소창의 ?category= 값을 가져옵니다.
  const categoryParam = searchParams.get('category');

  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 🌟 [수정] 초기값을 categoryParam이 있으면 그것으로, 없으면 "free"로 설정합니다.
  const [postType, setPostType] = useState(categoryParam || "free");
  
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]); 
  const [showEmoji, setShowEmoji] = useState<{ target: string | null }>({ target: null });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const [activeUser, setActiveUser] = useState<any>(null);

  const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"];

  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        setActiveUser(sessionUser);
        const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', sessionUser.id).single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }

      // 🌟 [수정 로직]
      if (editingId) {
        setLoading(true);
        const { data: post } = await supabase.from('community_posts').select('*').eq('id', editingId).single();
        if (post) {
          setEditingPost(post);
          setTitle(post.title);
          setContent(post.content);
          setPostType(post.post_type); // 수정 시엔 기존 데이터의 카테고리 유지
          setLikes(post.like_count || 0);
          fetchComments(post.id);
          if (sessionUser) checkLikeStatus(post.id, sessionUser.email);
        }
        setLoading(false);
      } else if (categoryParam) {
        // 🌟 수정 모드가 아닐 때, 주소창에 카테고리가 넘어왔다면 즉시 반영
        setPostType(categoryParam);
      }
    };
    initData();
  }, [editingId, categoryParam, supabase]); // 🌟 categoryParam을 감시 대상에 추가

  const checkLikeStatus = async (postId: string, email?: string) => {
    if (!postId || !email) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', postId).eq('user_email', email).maybeSingle();
    if (data) setHasLiked(true);
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from('community_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm("정말 삭제할까요?")) return;
    const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
    if (!error) fetchComments(editingPost.id);
  };

  const handleCommentUpdate = async (commentId: string) => {
    if (!editCommentValue.trim()) return;
    const { error } = await supabase.from('community_comments').update({ content: editCommentValue }).eq('id', commentId);
    if (!error) {
      setEditingCommentId(null);
      fetchComments(editingPost.id);
    }
  };

  const addEmoji = (emoji: string) => {
    if (showEmoji.target === 'title') setTitle(title + emoji);
    if (showEmoji.target === 'content') setContent(content + emoji);
    if (showEmoji.target === 'comment') setNewComment(newComment + emoji);
    setShowEmoji({ target: null });
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert("이미지만 가능합니다.");
    setLoading(true);
    try {
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { data, error: uploadError } = await supabase.storage.from('community').upload(fileName, file);
      if (uploadError) throw uploadError;
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
        const newMarkdown = `\n![image](${publicUrl})\n`;
        setContent(prev => prev + newMarkdown);
      }
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (!activeUser) return alert("로그인이 필요합니다.");
    if (hasLiked) return alert("이미 추천하셨습니다.");
    const { error } = await supabase.from('community_likes').insert([{ post_id: editingPost.id, user_email: activeUser.email }]);
    if (!error) {
      await supabase.from('community_posts').update({ like_count: likes + 1 }).eq('id', editingPost.id);
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !activeUser) return;
    const { error } = await supabase.from('community_comments').insert([{ 
      post_id: editingPost.id, 
      user_email: activeUser.email, 
      user_nickname: userNickname, 
      content: newComment 
    }]);
    if (!error) { setNewComment(""); fetchComments(editingPost.id); }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요!");
    
    setLoading(true);
    try {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        setLoading(false);
        return;
      }

      // 🌟 파일 첨부 업로드 로직 복구 및 에러 핸들링
      let uploadedUrls: string[] = [];
      for (const file of files) {
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        const { data, error: uploadError } = await supabase.storage.from('community').upload(fileName, file);
        if (!uploadError && data) {
          const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
      }

      const postData: any = {
        title,
        content,
        post_type: postType,
        user_email: sessionUser.email,
        user_nickname: userNickname || sessionUser.email?.split('@')[0],
        status: 'published',
      };

      // 이미지 URL이 있을 때만 추가
      const finalImageUrls = uploadedUrls.length > 0 ? uploadedUrls : (editingPost?.image_urls || []);
      if (finalImageUrls.length > 0) postData.image_urls = finalImageUrls;

      let resultError;
      if (editingId) {
        const { error: updateError } = await supabase.from('community_posts').update(postData).eq('id', editingId);
        resultError = updateError;
      } else {
        const { error: insertError } = await supabase.from('community_posts').insert([postData]);
        resultError = insertError;
      }

      if (resultError) throw resultError;
      
      setSaveStatus(true);
      // 🌟 404 방지: replace를 사용하여 히스토리를 깔끔하게 정리하고 이동
      setTimeout(() => {
        router.replace('/infocenter/list/all');
      }, 1000);
      
    } catch (err: any) {
      console.error("저장 에러 상세:", err);
      alert(`저장 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
    setLoading(false);
  };

  const cardBg = "bg-zinc-900/40 border-zinc-800";
  const inputBg = "bg-zinc-800/50 border-zinc-700 text-white";

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl border p-8 relative ${cardBg}`}>
      {/* 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border p-8 custom-scrollbar ${cardBg}`}>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4 text-white">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Eye size={16} className="text-blue-500" /> Preview Content
              </h4>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="text-base leading-relaxed text-zinc-300">
              <ReactMarkdown components={{ img: ({...props}) => (<img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Preview" />) }}>
                {content || "작성된 내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* 이모티콘 선택기 */}
      {showEmoji.target && (
        <div className="absolute z-[100] bg-zinc-900 border border-zinc-700 p-4 rounded-2xl shadow-2xl grid grid-cols-6 gap-2 w-64 animate-in zoom-in-95 duration-200" style={{ top: '150px', right: '40px' }}>
          {emojis.map(e => (<button key={e} onClick={() => addEmoji(e)} className="text-xl hover:bg-zinc-800 p-1 rounded transition-all">{e}</button>))}
          <button onClick={() => setShowEmoji({ target: null })} className="col-span-6 mt-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-800 pt-2">Close</button>
        </div>
      )}

      {saveStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully!</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <Link href="/infocenter/list/all" className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-tighter italic">Back to Post List</span>
        </Link>
        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          {editingPost && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><ThumbsUp size={12} /> {likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={12} /> {comments.length}</span>
            </div>
          )}
          Status: <span className={editingPost ? "text-orange-500" : "text-green-500"}>{editingPost ? "Viewing/Editing" : "Drafting"}</span>
        </div>
      </div>

      {editingPost && (
        <div className="mb-12 border-b border-zinc-800/50 pb-12 text-left">
            <div className="mb-4 flex justify-between items-center">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">{postType}</span>
                <span className="text-xs font-bold text-zinc-500 italic">By {editingPost.user_nickname || editingPost.user_email?.split('@')[0]}</span>
            </div>
            <h2 className="text-3xl font-black mb-6 tracking-tight text-white">{title}</h2>
            <div className="min-h-[150px] text-base leading-relaxed text-zinc-300">
                <ReactMarkdown components={{ img: ({...props}) => (<img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Content" />) }}>
                    {content}
                </ReactMarkdown>
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-500"><MessageSquare size={14}/> Comments ({comments.length})</div>
                {comments.map(c => (
                    <div key={c.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-800/20 flex justify-between items-center">
                        <p className="text-sm text-zinc-300">{c.content}</p>
                        {activeUser?.email === c.user_email && <button onClick={() => handleCommentDelete(c.id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={14}/></button>}
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="space-y-6 text-left">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Category</label>
          <div className="flex gap-2 flex-wrap">
            {['notice', 'free', 'qna', 'faq', 'tips', 'showcase'].map((id) => (
              <button key={id} onClick={() => setPostType(id)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${postType === id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}>{id.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Title</label>
            <button onClick={() => setShowEmoji({ target: 'title' })} className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold"><Smile size={14} /> Emoji</button>
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 ${inputBg}`} />
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Content</label>
            <button onClick={() => setShowEmoji({ target: 'content' })} className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold"><Smile size={14} /> Emoji</button>
          </div>
          <textarea ref={textAreaRef} value={content} onChange={(e) => setContent(e.target.value)} onDrop={(e) => { e.preventDefault(); uploadAndInsertImage(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()} placeholder="내용을 입력하세요... 이미지를 드래그해서 넣을 수 있습니다." rows={12} className={`w-full px-5 py-5 rounded-2xl border text-sm font-medium focus:outline-none leading-relaxed resize-none custom-scrollbar ${inputBg}`} />
          
          <div className="mt-4 p-4 rounded-2xl border bg-zinc-800/30 border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black rounded-lg cursor-pointer transition-all">
                    <ImageIcon size={14} /> 이미지 추가
                    <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && uploadAndInsertImage(e.target.files[0])} />
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black rounded-lg cursor-pointer transition-all">
                    <Paperclip size={14} /> 파일 첨부
                    <input type="file" hidden multiple onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                  </label>
                </div>
                <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 text-[11px] font-black rounded-lg border border-blue-500/20">
                  <Eye size={14} /> 미리보기
                </button>
            </div>
            
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400">
                            <span className="truncate max-w-[100px]">{file.name}</span>
                            <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500"><X size={12}/></button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => router.back()} className="flex-1 py-4 rounded-2xl font-black text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-800">나가기</button>
          <button onClick={handleSave} disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-sm text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? "변동사항 저장" : "게시글 등록")}
          </button>
        </div>
      </div>
    </div>
  );
}