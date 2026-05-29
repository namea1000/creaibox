"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  ChevronLeft, ThumbsUp, MessageSquare, Edit3, Trash2, Loader2, 
  Smile, X, Image as ImageIcon, Paperclip, Eye, Download, FileText 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [userNickname, setUserNickname] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editType, setEditType] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  
  const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"];

  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        setUser(sessionUser);
        const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', sessionUser.id).single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }

      if (postId) {
        setLoading(true);
        const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
        if (post) {
          setPostData(post);
          setLikes(post.like_count || 0);
          setEditTitle(post.title);
          setEditContent(post.content);
          setEditType(post.post_type);
          if (sessionUser) checkLikeStatus(sessionUser.email);
          fetchComments();
        }
        setLoading(false);
      }
    };
    initData();
  }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase.from('community_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const checkLikeStatus = async (email: string | undefined) => {
    if (!postId || !email) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', postId).eq('user_email', email).maybeSingle();
    if (data) setHasLiked(true);
  };

  // 🌟 [강력 수정] 실제 파일 다운로드 로직 (Blob 방식 - 자동 다운로드 보장)
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // 파일 이름에서 난수 제거 (0.12345_파일명 -> 파일명)
      const fileName = decodeURIComponent(url.split('/').pop()?.split('_').slice(1).join('_') || 'downloaded_file');
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // 실패 시 차선책으로 새 창 열기
      window.open(url, '_blank');
    }
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert("이미지만 가능합니다.");
    try {
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { data } = await supabase.storage.from('community').upload(fileName, file);
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
        setEditContent(prev => prev + `\n![image](${publicUrl})\n`);
      }
    } catch (err) { alert("이미지 업로드 실패"); }
  };

  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) return alert("내용을 입력해주세요.");
    setIsSaving(true);
    let uploadedUrls: string[] = [];
    for (const file of files) {
      const fileName = `${Math.random()}_${file.name}`;
      const { data } = await supabase.storage.from('community').upload(fileName, file);
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
    }
    const finalUrls = [...(postData?.image_urls || []), ...uploadedUrls];
    const { error } = await supabase.from('community_posts').update({ 
      title: editTitle, content: editContent, post_type: editType, image_urls: finalUrls 
    }).eq('id', postId);
    if (!error) { alert("수정 완료!"); router.refresh(); }
    setIsSaving(false);
  };

  const handleLikeToggle = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    const currentStatus = hasLiked;
    if (currentStatus) {
      setHasLiked(false); setLikes(Math.max(0, likes - 1));
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_email', user.email);
      await supabase.from('community_posts').update({ like_count: Math.max(0, likes - 1) }).eq('id', postId);
    } else {
      setHasLiked(true); setLikes(likes + 1);
      await supabase.from('community_likes').insert([{ post_id: postId, user_email: user.email }]);
      await supabase.from('community_posts').update({ like_count: likes + 1 }).eq('id', postId);
    }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !user) return;
    const { error } = await supabase.from('community_comments').insert([{ 
      post_id: postId, user_email: user.email, user_nickname: userNickname || user.email?.split('@')[0], content: newComment 
    }]);
    if (!error) { setNewComment(""); fetchComments(); }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
    if (!error) fetchComments();
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black italic uppercase">Loading...</div>;
  if (!postData) return <div className="p-20 text-center text-red-500 font-black italic uppercase">Post not found.</div>;

  const isAuthor = user?.email === postData.user_email;
  const inputBg = "bg-zinc-800/50 border-zinc-700 text-white";

  return (
    <div className={`max-w-4xl mx-auto rounded-[32px] border p-8 relative shadow-2xl bg-zinc-900/40 border-zinc-800 text-left`}>
      {/* 미리보기 모달 */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border p-8 bg-zinc-900 border-zinc-800 custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4 text-white">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Eye size={16} className="text-blue-500" /> Preview</h4>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="text-base leading-relaxed text-zinc-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ img: ({...props}) => (<img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Preview" />) }}>
                {editContent || "작성된 내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <button onClick={() => router.push('/infocenter/list/all')} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors group">
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase italic">Back to List</span>
        </button>
        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic font-sans">
            INFOCENTER <span className="text-zinc-800">/</span> {isAuthor ? "Edit Mode" : "View Post"}
        </div>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {isAuthor ? (
          /* 🌟 [에디터 모드] */
          <div className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block font-sans">Category</label>
              <div className="flex gap-2">
                {['notice', 'free', 'qna', 'faq', 'tips', 'showcase'].map((id) => (
                  <button key={id} onClick={() => setEditType(id)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${editType === id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>{id.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block font-sans">Title</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 ${inputBg}`} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block font-sans">Content</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} onDrop={(e) => { e.preventDefault(); uploadAndInsertImage(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()} rows={12} className={`w-full px-5 py-5 rounded-2xl border text-sm font-medium focus:outline-none leading-relaxed resize-none custom-scrollbar ${inputBg}`} />
              
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

                {/* 🌟 [수정 포인트] 파일 목록 UI */}
                {(files.length > 0 || (postData.image_urls && postData.image_urls.length > 0)) && (
                    <div className="pt-4 border-t border-zinc-800/50 space-y-3">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">첨부된 파일 (클릭 시 자동 다운로드)</p>
                        <div className="flex flex-wrap gap-2">
                            {postData.image_urls?.map((url: string, i: number) => (
                                <button key={`old-${i}`} onClick={() => handleDownload(url)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-all group">
                                    <FileText size={12} className="group-hover:text-blue-400" />
                                    {decodeURIComponent(url.split('/').pop()?.split('_').slice(1).join('_') || 'file')}
                                    <Download size={10} className="opacity-50 group-hover:opacity-100" />
                                </button>
                            ))}
                            {files.map((file, idx) => (
                                <div key={`new-${idx}`} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg text-[10px] font-bold text-blue-400">
                                    <Paperclip size={12} /> {file.name} (대기중)
                                    <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-blue-300 hover:text-white ml-1 transition-colors"><X size={12}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
                <button onClick={() => router.push('/infocenter/list/all')} className="flex-1 py-4 rounded-2xl font-black text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-800 uppercase italic">나가기</button>
                <button onClick={handleUpdatePost} disabled={isSaving} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase italic tracking-tighter">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Edit3 size={18} />}
                    UPDATE POST
                </button>
            </div>
          </div>
        ) : (
          /* 🌟 [뷰어 모드] */
          <>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20 italic tracking-widest font-sans">{postData.post_type}</span>
                <span className="text-[11px] font-bold text-zinc-500 italic font-sans">By {postData.user_nickname || postData.user_email?.split('@')[0]}</span>
              </div>
              <h2 className="text-4xl font-black mt-4 text-white leading-tight tracking-tighter italic font-sans uppercase">{postData.title}</h2>
            </div>

            {/* 🌟 [뷰어 모드 파일 목록] */}
            {postData.image_urls && postData.image_urls.length > 0 && (
              <div className="p-5 rounded-2xl bg-zinc-800/30 border border-zinc-800 space-y-3">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 italic">
                  <Paperclip size={12} /> Attached Files ({postData.image_urls.length})
                </div>
                <div className="flex flex-wrap gap-3">
                  {postData.image_urls.map((url: string, idx: number) => (
                    <button key={idx} onClick={() => handleDownload(url)} className="flex items-center gap-3 px-4 py-2 bg-black/20 hover:bg-zinc-800 border border-zinc-800/50 rounded-xl transition-all group shadow-sm">
                      <FileText size={14} className="text-zinc-500 group-hover:text-blue-400" />
                      <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 truncate max-w-[200px] font-sans">
                        {decodeURIComponent(url.split('/').pop()?.split('_').slice(1).join('_') || `file_${idx + 1}`)}
                      </span>
                      <Download size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <article className={`min-h-[200px] leading-[1.8] pb-12 border-b border-zinc-800/50 prose prose-invert max-w-none text-left text-zinc-300 font-sans`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ img: ({...props}) => (<img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Content" />) }}>
                {postData.content}
              </ReactMarkdown>
            </article>

            {/* 하단 추천 버튼 섹션 */}
            <div className="flex justify-center py-6">
              <button onClick={handleLikeToggle} className={`flex items-center gap-2 px-12 py-4 font-black text-xs uppercase italic rounded-full transition-all border font-sans shadow-xl active:scale-95 ${hasLiked ? 'bg-blue-600 border-blue-500 text-white shadow-blue-900/40' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-blue-500 hover:border-blue-500/50'}`}>
                <ThumbsUp size={18} className={hasLiked ? "fill-white" : ""} /> 
                {hasLiked ? "COMPLETED" : `Recommend ${likes}`}
              </button>
            </div>
          </>
        )}

        {/* 댓글 섹션 (기존 코드 유지) */}
        <div className="space-y-6 pt-6 text-left border-t border-zinc-800/50 relative">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-2 italic font-sans"><MessageSquare size={14} /> Discussions ({comments.length})</h4>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 rounded-2xl border border-zinc-800/50 bg-black/20 hover:border-zinc-700 transition-all">
                <div className="flex justify-between mb-3 items-center font-sans">
                  <span className="text-[11px] font-black text-blue-500 uppercase italic tracking-tighter">{comment.user_nickname || comment.user_email?.split('@')[0]}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
                      {user?.email === comment.user_email && (
                        <>
                          <button onClick={() => { setEditingCommentId(comment.id); setEditCommentValue(comment.content); }} className="text-[9px] font-black text-zinc-400 hover:text-blue-400 uppercase italic transition-colors">EDIT</button>
                          <div className="w-[1px] h-2 bg-zinc-700" />
                        </>
                      )}
                      {(user?.email === comment.user_email || isAuthor) && (
                        <button onClick={() => deleteComment(comment.id)} className="text-[9px] font-black text-zinc-400 hover:text-red-500 uppercase italic transition-colors">DELETE</button>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {editingCommentId === comment.id ? (
                  <div className="space-y-3">
                    <textarea value={editCommentValue} onChange={(e) => setEditCommentValue(e.target.value)} className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white outline-none" rows={3} />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cancel</button>
                      <button onClick={async () => { await supabase.from('community_comments').update({ content: editCommentValue }).eq('id', comment.id); setEditingCommentId(null); fetchComments(); }} className="px-5 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium font-sans text-left">{comment.content}</p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-800/30 relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">New Discussion</span>
                <button onClick={() => setShowEmoji(!showEmoji)} className="text-[10px] text-zinc-500 flex items-center gap-1 font-black uppercase italic hover:text-blue-500 transition-colors">
                  <Smile size={14} /> Emoji
                </button>
            </div>
            {showEmoji && (
              <div className="absolute bottom-[100%] right-0 mb-4 z-[100] bg-zinc-900 border border-zinc-700 p-4 rounded-2xl shadow-2xl grid grid-cols-6 gap-2 w-64 animate-in zoom-in-95 duration-200">
                {emojis.map(e => (<button key={e} onClick={() => { setNewComment(prev => prev + e); setShowEmoji(false); }} className="text-xl hover:bg-zinc-800 p-1 rounded transition-all">{e}</button>))}
                <button onClick={() => setShowEmoji(false)} className="col-span-6 mt-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-800 pt-2 flex items-center justify-center gap-1"><X size={10}/> Close</button>
              </div>
            )}
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." className="w-full p-6 rounded-[24px] text-sm border border-zinc-800 bg-black/40 text-white resize-none focus:outline-none focus:border-blue-500 transition-all font-sans placeholder:text-zinc-700" rows={4} />
            <div className="flex justify-end mt-4">
              <button onClick={handleCommentSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl uppercase italic tracking-widest transition-all shadow-lg font-sans">Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}