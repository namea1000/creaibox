"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Send,
  X,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Eye,
  ChevronLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface InfoBoardWriteProps {
  postId: string | null;
  initialPostData?: any;
  initialCategory?: string;
  onBack: () => void;
  onSaveSuccess: () => void;
}

export default function InfoBoardWrite({
  postId,
  initialPostData,
  initialCategory = "free",
  onBack,
  onSaveSuccess,
}: InfoBoardWriteProps) {
  const supabase = useMemo(() => createClient(), []);

  // Pre-initialize editor states with preloaded cache data for instant loading
  const [title, setTitle] = useState(initialPostData?.title || "");
  const [content, setContent] = useState(initialPostData?.content || "");
  const [postType, setPostType] = useState(
    initialPostData?.post_type || (initialCategory === "all" ? "free" : initialCategory)
  );

  const [loading, setLoading] = useState(!initialPostData && !!postId);
  const [saveStatus, setSaveStatus] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [originalPost, setOriginalPost] = useState<any>(initialPostData || null);
  const [userNickname, setUserNickname] = useState("");
  const [showEmoji, setShowEmoji] = useState<{ target: string | null }>({ target: null });

  const emojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰",
    "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣",
    "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"
  ];

  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", sessionUser.id)
          .single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }

      // If we don't have preloaded post data but have postId, fetch it
      if (postId && !initialPostData) {
        setLoading(true);
        const { data: post } = await supabase
          .from("community_posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (post) {
          setOriginalPost(post);
          setTitle(post.title);
          setContent(post.content);
          setPostType(post.post_type);
        }
        setLoading(false);
      }
    };
    initData();
  }, [postId, initialPostData, supabase]);

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return alert("이미지만 가능합니다.");
    setLoading(true);
    try {
      const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
      const { data, error: uploadError } = await supabase.storage
        .from("community")
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from("community").getPublicUrl(fileName);
        setContent((prev: string) => prev + `\n![image](${publicUrl})\n`);
      }
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요!");

    setLoading(true);
    try {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) {
        alert("로그인이 만료되었습니다.");
        setLoading(false);
        return;
      }

      let uploadedUrls: string[] = [];
      for (const file of files) {
        const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
        const { data, error: uploadError } = await supabase.storage
          .from("community")
          .upload(fileName, file);
        if (!uploadError && data) {
          const { data: { publicUrl } } = supabase.storage.from("community").getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
      }

      const finalImageUrls = [
        ...(originalPost?.image_urls || []),
        ...uploadedUrls,
      ];

      const postPayload: any = {
        title,
        content,
        post_type: postType,
        user_email: sessionUser.email,
        user_nickname: userNickname || sessionUser.email?.split("@")[0],
        status: "published",
        image_urls: finalImageUrls,
      };

      let resultError;
      if (postId) {
        const { error } = await supabase
          .from("community_posts")
          .update(postPayload)
          .eq("id", postId);
        resultError = error;
      } else {
        const { error } = await supabase.from("community_posts").insert([postPayload]);
        resultError = error;
      }

      if (resultError) throw resultError;

      setSaveStatus(true);
      setTimeout(() => {
        onSaveSuccess();
      }, 800);
    } catch (err: any) {
      console.error("저장 에러:", err);
      alert(`저장 실패: ${err.message || "알 수 없는 오류"}`);
    }
    setLoading(false);
  };

  const addEmoji = (emoji: string) => {
    if (showEmoji.target === "title") setTitle((prev: string) => prev + emoji);
    if (showEmoji.target === "content") setContent((prev: string) => prev + emoji);
    setShowEmoji({ target: null });
  };

  return (
    <div className="max-w-4xl mx-auto rounded-2xl border p-6 md:p-8 relative bg-[#090d16]/30 border-zinc-800/80 text-left space-y-6">
      {/* Success Banner */}
      {saveStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in duration-300 z-50">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully!</span>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm text-left">
          <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border p-6 bg-zinc-900 border-zinc-800 custom-scrollbar">
            <div className="flex justify-between items-center mb-5 border-b border-zinc-800 pb-3 text-white">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Eye size={15} className="text-blue-500" /> Preview Content
              </h4>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 hover:bg-zinc-800 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="text-sm leading-relaxed text-zinc-300 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  img: ({ ...props }) => (
                    <img
                      {...props}
                      className="rounded-xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl"
                      alt="Preview"
                    />
                  ),
                }}
              >
                {content || "작성된 내용이 없습니다."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji.target && (
        <div className="absolute z-50 bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-2xl grid grid-cols-6 gap-1.5 w-64 animate-in zoom-in-95 duration-150 top-[150px] right-[40px]">
          {emojis.map((e) => (
            <button
              key={e}
              onClick={() => addEmoji(e)}
              className="text-lg hover:bg-zinc-800 p-1 rounded transition-all"
            >
              {e}
            </button>
          ))}
          <button
            onClick={() => setShowEmoji({ target: null })}
            className="col-span-6 mt-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-800/60 pt-2 flex items-center justify-center gap-1"
          >
            <X size={10} /> Close
          </button>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex justify-between items-center border-b border-zinc-800/40 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition group text-xs font-bold"
        >
          <ChevronLeft size={16} />
          나가기
        </button>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-wider italic font-sans">
          {postId ? "Edit Mode" : "New Post Draft"}
        </span>
      </div>

      {/* Editor Inputs */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 bg-zinc-900/10 rounded-2xl opacity-40 font-black tracking-widest uppercase text-xs text-zinc-400">
            <Loader2 className="animate-spin mb-4 text-xl" />
            Loading Post for Editor...
          </div>
        ) : (
          <>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2.5 block">
                Category
              </label>
              <div className="flex gap-2 flex-wrap">
                {["notice", "free", "qna", "faq", "tips", "showcase"].map((id) => (
                  <button
                    key={id}
                    onClick={() => setPostType(id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      postType === id
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Title
                </label>
                <button
                  onClick={() => setShowEmoji({ target: "title" })}
                  className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold hover:text-blue-500 transition"
                >
                  <Smile size={13} /> Emoji
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border text-sm font-bold bg-zinc-950/40 border-zinc-800 text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Content
                </label>
                <button
                  onClick={() => setShowEmoji({ target: "content" })}
                  className="text-[10px] text-zinc-500 flex items-center gap-1 font-bold hover:text-blue-500 transition"
                >
                  <Smile size={13} /> Emoji
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onDrop={(e) => {
                  e.preventDefault();
                  uploadAndInsertImage(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
                placeholder="내용을 마크다운 형식으로 작성하세요... 이미지를 드래그 앤 드롭하여 추가할 수 있습니다."
                rows={10}
                className="w-full px-4 py-4 rounded-xl border text-sm font-medium bg-zinc-950/40 border-zinc-800 text-white focus:outline-none focus:border-blue-500 leading-relaxed resize-none custom-scrollbar transition"
              />

              {/* Files Zone */}
              <div className="mt-4 p-4 rounded-xl border bg-zinc-900/30 border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition">
                      <ImageIcon size={13} /> 이미지 추가
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => e.target.files && uploadAndInsertImage(e.target.files[0])}
                      />
                    </label>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black rounded-lg cursor-pointer transition">
                      <Paperclip size={13} /> 파일 첨부
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) =>
                          e.target.files && setFiles([...files, ...Array.from(e.target.files)])
                        }
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-lg border border-blue-500/20"
                  >
                    <Eye size={13} /> 미리보기
                  </button>
                </div>

                {/* Show file list queue */}
                {(files.length > 0 || (originalPost?.image_urls && originalPost.image_urls.length > 0)) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {originalPost?.image_urls?.map((url: string, i: number) => (
                      <div
                        key={`orig-${i}`}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-[9px] font-bold text-zinc-400"
                      >
                        <Paperclip size={10} />
                        <span className="truncate max-w-[120px]">
                          {decodeURIComponent(url.split("/").pop()?.split("_").slice(1).join("_") || "attached")}
                        </span>
                        <button
                          onClick={() => {
                            const updatedUrls = originalPost.image_urls.filter((_: any, idx: number) => idx !== i);
                            setOriginalPost({ ...originalPost, image_urls: updatedUrls });
                          }}
                          className="text-zinc-600 hover:text-red-400 transition"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    {files.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[9px] font-bold text-blue-400"
                      >
                        <Paperclip size={10} />
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button
                          onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                          className="text-blue-300 hover:text-white transition ml-0.5"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={onBack}
                className="flex-1 py-3.5 rounded-xl font-black text-xs border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-xl shadow-blue-900/10 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                {postId ? "변동사항 저장" : "게시글 등록"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
