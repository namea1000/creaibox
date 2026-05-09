"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Send, X, CheckCircle2, Loader2, ChevronLeft, ThumbsUp, 
  MessageSquare, Image as ImageIcon, Paperclip, Smile, Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PostWriteTab({ isDarkMode, user, editingPost, onCancel, onSuccess }: any) {
  const [title, setTitle] = useState(editingPost?.title || "");
  const [content, setContent] = useState(editingPost?.content || "");
  const [postType, setPostType] = useState(editingPost?.post_type || "free");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false); 
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(editingPost?.like_count || 0);
  const [hasLiked, setHasLiked] = useState(false);

  // 🌟 [상태 추가] 미리보기 모달 제어
  const [showPreview, setShowPreview] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [showEmoji, setShowEmoji] = useState<{target: string | null}>({target: null});
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const supabase = createClient();
  const [activeUser, setActiveUser] = useState(user);
  const isAuthor = !editingPost || activeUser?.email === editingPost?.user_email;

  const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"];

  useEffect(() => {
    const initPostData = async () => {
      if (!user) {
        const { data: { user: sessionUser } } = await supabase.auth.getUser();
        if (sessionUser) setActiveUser(sessionUser);
      } else {
        setActiveUser(user);
      }

      if (editingPost) {
        if (activeUser?.email !== editingPost.user_email) {
          await supabase.rpc('increment_view_count', { row_id: editingPost.id });
        }
        fetchComments();
        checkLikeStatus();
      }
    };
    initPostData();
  }, [editingPost, user, activeUser]);

  const checkLikeStatus = async () => {
    if (!editingPost || !activeUser) return;
    const { data } = await supabase.from('community_likes').select('*').eq('post_id', editingPost.id).eq('user_email', activeUser.email).maybeSingle();
    if (data) setHasLiked(true);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase.from('community_comments').select('*').eq('post_id', editingPost.id).order('created_at', { ascending: true });
    if (!error && data) setComments(data);
  };

  const addEmoji = (emoji: string) => {
    if (showEmoji.target === 'title') setTitle(title + emoji);
    if (showEmoji.target === 'content') setContent(content + emoji);
    if (showEmoji.target === 'comment') setNewComment(newComment + emoji);
    setShowEmoji({target: null});
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert("이미지 파일만 본문 삽입이 가능합니다.");
    
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('community').upload(fileName, file);

      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
        
        const textArea = textAreaRef.current;
        if (textArea) {
          const start = textArea.selectionStart;
          const end = textArea.selectionEnd;
          const newContent = content.substring(0, start) + `\n![image](${publicUrl})\n` + content.substring(end);
          setContent(newContent);
        } else {
          setContent((prev: string) => prev + `\n![image](${publicUrl})\n`);
        }
      }
    } catch (err) {
      alert("이미지 업로드에 실패했습니다.");
    }
    setLoading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      await uploadAndInsertImage(droppedFiles[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (files.length + selectedFiles.length > 3) return alert("최대 3개까지만 가능합니다.");
      setFiles([...files, ...selectedFiles]);
    }
  };

  const handleLike = async () => {
    if (!activeUser) return alert("로그인이 필요한 서비스입니다.");
    if (hasLiked) return alert("이미 추천하신 게시물입니다.");
    try {
      const { error: likeError } = await supabase.from('community_likes').insert([{ post_id: editingPost.id, user_email: activeUser.email }]);
      if (likeError) throw likeError;
      const { error: postError } = await supabase.from('community_posts').update({ like_count: likes + 1 }).eq('id', editingPost.id);
      if (!postError) { setLikes((prev: number) => prev + 1); setHasLiked(true); }
    } catch (error: any) { console.error("추천 처리 오류:", error); }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim()) return;
    if (!activeUser) return alert("로그인이 필요한 서비스입니다.");
    const { error } = await supabase.from('community_comments').insert([{ post_id: editingPost.id, user_email: activeUser.email, content: newComment }]);
    if (!error) { setNewComment(""); fetchComments(); } else { alert("댓글 등록에 실패했습니다."); }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요!");
    if (!activeUser) return alert("로그인이 필요한 서비스입니다.");

    setLoading(true);
    try {
      let uploadedUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data } = await supabase.storage.from('community').upload(fileName, file);
        if (data) {
          const { data: { publicUrl } } = supabase.storage.from('community').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
      }

      if (editingPost) {
        const { error } = await supabase.from('community_posts').update({ 
          title, content, post_type: postType,
          image_urls: uploadedUrls.length > 0 ? uploadedUrls : editingPost.image_urls 
        }).eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('community_posts').insert([{ 
          title, content, post_type: postType, user_email: activeUser.email, status: 'published',
          image_urls: uploadedUrls
        }]);
        if (error) throw error;
      }
      
      setSaveStatus(true); 
      setTimeout(() => { setSaveStatus(false); if (onSuccess) onSuccess(); }, 2000); 
    } catch (error: any) { alert(`처리 실패: ${error.message}`); }
    setLoading(false);
  };

  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-xl";
  const inputBg = isDarkMode ? "bg-zinc-800/50 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900";

  return (
    <div className={`max-w-4xl mx-auto rounded-3xl border p-8 relative ${cardBg}`}>
      
      {/* 🌟 [미리보기 모달 추가] */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border p-8 custom-scrollbar ${cardBg}`}>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800/50 pb-4">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Eye size={16} className="text-blue-500" /> Preview Content
              </h4>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className={`text-base leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <ReactMarkdown 
                components={{
                  img: ({...props}) => (
                    <img {...props} className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" alt="Preview" />
                  )
                }}
              >
                {content || "작성된 내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {showEmoji.target && (
        <div className="absolute z-[100] bg-zinc-900 border border-zinc-700 p-4 rounded-2xl shadow-2xl grid grid-cols-6 gap-2 w-64 animate-in zoom-in-95 duration-200" style={{ top: '150px', right: '40px' }}>
           {emojis.map(e => (
             <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:bg-zinc-800 p-1 rounded transition-all">{e}</button>
           ))}
           <button onClick={() => setShowEmoji({target: null})} className="col-span-6 mt-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-800 pt-2">Close</button>
        </div>
      )}

      {saveStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully!</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800/30">
        <button onClick={onCancel} className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-tighter italic">Back to Post List</span>
        </button>
        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          {editingPost && (
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-1"><ThumbsUp size={12}/> {likes}</span>
               <span className="flex items-center gap-1"><MessageSquare size={12}/> {comments.length}</span>
            </div>
          )}
          Status: <span className={editingPost ? "text-orange-500" : "text-green-500"}>{editingPost ? "Editing" : "Drafting"}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2">
          <Send size={20} className="text-blue-500" /> 
          {editingPost ? (isAuthor ? "Edit Post" : "View Post") : "New Post"}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {!isAuthor && editingPost ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-4"><span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20">{postType}</span></div>
            <h2 className="text-3xl font-black mb-6 tracking-tight">{title}</h2>
            
            <div className={`min-h-[300px] text-base leading-relaxed pb-12 border-b border-zinc-800/50 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <ReactMarkdown 
                components={{
                  img: ({...props}) => (
                    <img 
                      {...props} 
                      className="rounded-2xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl" 
                      alt="본문 이미지" 
                    />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
            
            {editingPost.image_urls && editingPost.image_urls.length > 0 && (
              <div className="grid grid-cols-1 gap-4 my-8">
                {editingPost.image_urls.map((url: string, idx: number) => (
                  <img key={idx} src={url} alt="attachment" className="rounded-2xl w-full border border-zinc-800" />
                ))}
              </div>
            )}

            <div className="pt-10 space-y-10">
              <div className="flex justify-center">
                <button onClick={handleLike} disabled={hasLiked} className={`flex items-center gap-2 px-10 py-4 font-black text-sm rounded-full transition-all border ${hasLiked ? 'bg-zinc-800/20 text-zinc-600' : 'bg-zinc-800/50 text-zinc-400 hover:text-pink-500'}`}>
                  <ThumbsUp size={20} className={!hasLiked ? "group-hover:animate-bounce" : ""} /> {hasLiked ? "추천 완료" : `추천하기 ${likes}`}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-500 tracking-widest"><MessageSquare size={14} /> Comments ({comments.length})</div>
                {comments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-800/20 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-blue-500 uppercase">{comment.user_email?.split('@')[0]}</span>
                      <span className="text-[10px] text-zinc-600 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-zinc-800/20 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-end mb-2">
                  <button onClick={() => setShowEmoji({target: 'comment'})} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-white"><Smile size={14} /> 이모티콘</button>
                </div>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="따뜻한 댓글을 남겨주세요..." rows={3} className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium resize-none placeholder:text-zinc-600" />
                <div className="flex justify-end mt-2"><button onClick={handleCommentSave} className="px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black rounded-xl uppercase">Post Comment</button></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 mb-2 block">Category</label>
              <div className="flex gap-2">
                {['free', 'qna', 'tips', 'showcase', 'notice'].map((id) => (
                  <button key={id} onClick={() => setPostType(id)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${postType === id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : `${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}`}>{id.toUpperCase()}</button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Title</label>
                <button onClick={() => setShowEmoji({target: 'title'})} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-white"><Smile size={14} /> 이모티콘</button>
              </div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:outline-none focus:border-blue-500 ${inputBg}`} />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Content</label>
                <button onClick={() => setShowEmoji({target: 'content'})} className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-white"><Smile size={14} /> 이모티콘</button>
              </div>
              
              <textarea 
                ref={textAreaRef}
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                placeholder="내용을 입력하세요... (이미지를 이 상자로 드래그하면 글 사이에 삽입됩니다)" 
                rows={12} 
                className={`w-full px-5 py-5 rounded-2xl border text-sm font-medium focus:outline-none leading-relaxed resize-none custom-scrollbar ${inputBg}`} 
              />
              
              <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDarkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black rounded-lg cursor-pointer transition-all">
                    <ImageIcon size={14} /> 이미지 추가 (인라인 삽입)
                    <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && uploadAndInsertImage(e.target.files[0])} />
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black rounded-lg cursor-pointer transition-all">
                    <Paperclip size={14} /> 파일 첨부 (PDF/TXT)
                    <input type="file" hidden accept=".pdf, .txt" multiple onChange={handleFileChange} />
                  </label>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">{files.length > 0 ? `${files.length}개 선택됨` : "최대 3개"}</span>
                </div>

                {/* 🌟 [수정 부분] 우측 끝에 미리보기 버튼 추가 */}
                <button 
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[11px] font-black rounded-lg transition-all border border-blue-500/20"
                >
                  <Eye size={14} /> 삽입 이미지 미리보기
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={onCancel} className={`flex-1 py-4 rounded-2xl font-black text-sm border ${isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>글 목록으로 나가기</button>
              <button onClick={handleSave} disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-sm text-white bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20">
                {loading ? <Loader2 className="animate-spin" size={18} /> : (editingPost ? "변동사항 저장" : "게시글 등록")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}