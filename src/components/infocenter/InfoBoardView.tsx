"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  ThumbsUp,
  MessageSquare,
  Edit3,
  Trash2,
  Loader2,
  Smile,
  X,
  Paperclip,
  Download,
  FileText,
  ChevronLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InfoBoardViewProps {
  postId: string;
  initialPostData?: any;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

export default function InfoBoardView({
  postId,
  initialPostData,
  onBack,
  onEdit,
  onDeleted,
}: InfoBoardViewProps) {
  const supabase = useMemo(() => createClient(), []);

  // Set postData from initial cache instantly to eliminate detail view "Loading..." overlay
  const [postData, setPostData] = useState<any>(initialPostData || null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(initialPostData?.like_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userNickname, setUserNickname] = useState("");
  
  // Set loading to false instantly if we already have initial data
  const [loading, setLoading] = useState(!initialPostData);
  const [commentsLoading, setCommentsLoading] = useState(true);
  
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentValue, setEditCommentValue] = useState("");

  const emojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰",
    "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣",
    "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴"
  ];

  const fetchComments = async () => {
    setCommentsLoading(true);
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data);
    setCommentsLoading(false);
  };

  useEffect(() => {
    const initData = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        setUser(sessionUser);
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", sessionUser.id)
          .single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }

      if (postId) {
        // Increment view count silently in background
        void supabase.rpc("increment_community_post_view", { post_id: postId });

        // If no initialPostData, or to fetch fresh likes count, query the post
        if (!initialPostData) {
          setLoading(true);
        }

        const { data: post } = await supabase
          .from("community_posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (post) {
          setPostData(post);
          setLikes(post.like_count || 0);
          if (sessionUser) {
            const { data: like } = await supabase
              .from("community_likes")
              .select("*")
              .eq("post_id", postId)
              .eq("user_email", sessionUser.email)
              .maybeSingle();
            if (like) setHasLiked(true);
          }
        }
        setLoading(false);
        // Load comments asynchronously
        void fetchComments();
      }
    };
    
    initData();
  }, [postId, initialPostData, supabase]);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const fileName = decodeURIComponent(
        url.split("/").pop()?.split("_").slice(1).join("_") || "downloaded_file"
      );

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    const currentStatus = hasLiked;
    if (currentStatus) {
      setHasLiked(false);
      setLikes(Math.max(0, likes - 1));
      await supabase
        .from("community_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_email", user.email);
      await supabase
        .from("community_posts")
        .update({ like_count: Math.max(0, likes - 1) })
        .eq("id", postId);
    } else {
      setHasLiked(true);
      setLikes(likes + 1);
      await supabase
        .from("community_likes")
        .insert([{ post_id: postId, user_email: user.email }]);
      await supabase
        .from("community_posts")
        .update({ like_count: likes + 1 })
        .eq("id", postId);
    }
  };

  const handleCommentSave = async () => {
    if (!newComment.trim() || !user) return;
    const { error } = await supabase.from("community_comments").insert([
      {
        post_id: postId,
        user_email: user.email,
        user_nickname: userNickname || user.email?.split("@")[0],
        content: newComment,
      },
    ]);
    if (!error) {
      setNewComment("");
      fetchComments();
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("community_comments").delete().eq("id", commentId);
    if (!error) fetchComments();
  };

  const handleDeletePost = async () => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("community_posts").delete().eq("id", postId);
    if (!error) {
      alert("삭제되었습니다.");
      onDeleted();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-zinc-800 bg-zinc-900/10 rounded-2xl opacity-40 font-black tracking-widest uppercase text-xs text-zinc-400">
        <Loader2 className="animate-spin mb-4 text-xl" />
        Loading Post Details...
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="p-20 text-center text-red-500 font-black italic uppercase border border-zinc-800 bg-zinc-900/10 rounded-2xl">
        Post not found.
      </div>
    );
  }

  const isAuthor = user?.email === postData.user_email;

  return (
    <div className="max-w-4xl mx-auto rounded-2xl border p-6 md:p-8 shadow-2xl bg-[#090d16]/30 border-zinc-800/80 text-left space-y-6">
      {/* Header Info */}
      <div className="flex flex-col border-b border-zinc-800/40 pb-5">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.8 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-lg border border-blue-500/20 italic tracking-wider font-sans">
            {postData.post_type}
          </span>
          <span className="text-[11px] font-bold text-zinc-500 italic font-sans">
            By {postData.user_nickname || postData.user_email?.split("@")[0]}
          </span>
          <span className="text-[11px] font-medium text-zinc-600 font-sans ml-auto">
            {new Date(postData.created_at).toLocaleString("ko-KR")}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black mt-3.5 text-white leading-tight tracking-tight uppercase">
          {postData.title}
        </h2>
      </div>

      {/* Attachments Section */}
      {postData.image_urls && postData.image_urls.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800 space-y-2.5">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-wider flex items-center gap-1.5 italic">
            <Paperclip size={12} /> Attached Files ({postData.image_urls.length})
          </div>
          <div className="flex flex-wrap gap-2.5">
            {postData.image_urls.map((url: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleDownload(url)}
                className="flex items-center gap-2.5 px-3 py-1.8 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group shadow-sm text-left max-w-full"
              >
                <FileText size={13} className="text-zinc-500 group-hover:text-blue-400 shrink-0" />
                <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 truncate max-w-[200px] font-sans">
                  {decodeURIComponent(
                    url.split("/").pop()?.split("_").slice(1).join("_") || `file_${idx + 1}`
                  )}
                </span>
                <Download size={12} className="text-zinc-600 group-hover:text-white transition-colors shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="min-h-[180px] leading-relaxed pb-8 border-b border-zinc-800/40 prose prose-invert max-w-none text-left text-zinc-300 font-sans break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ ...props }) => (
              <img
                {...props}
                className="rounded-xl border border-zinc-800 my-4 max-w-full h-auto shadow-2xl"
                alt="Content"
              />
            ),
          }}
        >
          {postData.content}
        </ReactMarkdown>
      </article>

      {/* Action and Recommend Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-2 border-b border-zinc-800/40 pb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-zinc-400 transition"
          >
            <ChevronLeft size={14} />
            목록으로
          </button>
          {isAuthor && (
            <>
              <button
                onClick={onEdit}
                className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-zinc-300 transition"
              >
                <Edit3 size={13} />
                수정
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-xl border border-red-900/30 bg-red-950/10 hover:bg-red-900/20 text-xs font-bold text-red-400 transition"
              >
                <Trash2 size={13} />
                삭제
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleLikeToggle}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-2.5 font-black text-xs uppercase italic rounded-xl transition-all border font-sans shadow-lg active:scale-95 ${
            hasLiked
              ? "bg-blue-600 border-blue-500 text-white shadow-blue-900/20"
              : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-blue-500 hover:border-blue-500/50"
          }`}
        >
          <ThumbsUp size={15} className={hasLiked ? "fill-white" : ""} />
          {hasLiked ? "RECOMMENDED" : `Recommend ${likes}`}
        </button>
      </div>

      {/* Discussion Thread */}
      <div className="space-y-5 pt-2 text-left relative">
        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.25em] flex items-center gap-1.5 italic font-sans">
          <MessageSquare size={13} /> Discussions ({comments.length})
        </h4>

        {/* Comment List */}
        <div className="space-y-3">
          {commentsLoading ? (
            <div className="flex items-center justify-center py-6 text-zinc-600 gap-2 text-xs font-semibold">
              <Loader2 className="animate-spin" size={13} />
              댓글 로딩 중...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-xl border border-zinc-800/40 bg-zinc-950/10 hover:border-zinc-800 transition"
              >
                <div className="flex justify-between items-center mb-2 font-sans">
                  <span className="text-[10px] font-black text-blue-500 uppercase italic">
                    {comment.user_nickname || comment.user_email?.split("@")[0]}
                  </span>
                  <div className="flex items-center gap-3">
                    {user?.email === comment.user_email && (
                      <div className="flex items-center gap-2 bg-zinc-900 px-2.5 py-0.8 rounded-lg border border-zinc-800">
                        {editingCommentId !== comment.id ? (
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditCommentValue(comment.content);
                            }}
                            className="text-[9px] font-bold text-zinc-500 hover:text-blue-400 uppercase italic"
                          >
                            EDIT
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-[9px] font-bold text-zinc-500 hover:text-zinc-300 uppercase italic"
                          >
                            Cancel
                          </button>
                        )}
                        <span className="w-[1px] h-2 bg-zinc-800" />
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="text-[9px] font-bold text-zinc-500 hover:text-red-500 uppercase italic"
                        >
                          DEL
                        </button>
                      </div>
                    )}
                    <span className="text-[9px] text-zinc-600 font-bold">
                      {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2.5 mt-2">
                    <textarea
                      value={editCommentValue}
                      onChange={(e) => setEditCommentValue(e.target.value)}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          await supabase
                            .from("community_comments")
                            .update({ content: editCommentValue })
                            .eq("id", comment.id);
                          setEditingCommentId(null);
                          fetchComments();
                        }}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        Save Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-zinc-400 font-medium font-sans">
                    {comment.content}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-zinc-650 text-xs py-4 px-2 italic font-semibold">
              첫 댓글을 작성해 보세요.
            </div>
          )}
        </div>

        {/* Comment input area */}
        {user ? (
          <div className="pt-4 border-t border-zinc-800/40 relative space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                New Discussion
              </span>
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="text-[10px] text-zinc-500 flex items-center gap-1 font-black uppercase italic hover:text-blue-500 transition-colors"
              >
                <Smile size={13} /> Emoji
              </button>
            </div>
            {showEmoji && (
              <div className="absolute bottom-[100%] right-0 mb-4.5 z-50 bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl shadow-2xl grid grid-cols-6 gap-1.5 w-64 animate-in zoom-in-95 duration-150">
                {emojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setNewComment((prev) => prev + e);
                      setShowEmoji(false);
                    }}
                    className="text-lg hover:bg-zinc-800 p-1 rounded transition-all"
                  >
                    {e}
                  </button>
                ))}
                <button
                  onClick={() => setShowEmoji(false)}
                  className="col-span-6 mt-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-wider border-t border-zinc-800/60 pt-2 flex items-center justify-center gap-1"
                >
                  <X size={10} /> Close Picker
                </button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력해 토론에 참여하세요..."
              className="w-full p-4 rounded-xl text-xs border border-zinc-800 bg-zinc-950/20 text-white resize-none focus:outline-none focus:border-blue-500 transition-all font-sans placeholder:text-zinc-700"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                onClick={handleCommentSave}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg uppercase italic tracking-widest transition-all shadow-md font-sans disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/20 text-center text-xs text-zinc-500 italic">
            댓글 작성을 위해 로그인이 필요합니다.
          </div>
        )}
      </div>
    </div>
  );
}
