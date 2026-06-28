"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles, AlertCircle, Eye, ThumbsUp, MessageSquare, Tag, ChevronLeft, ChevronRight } from "lucide-react";

interface VideoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: any;
  videos?: any[];
  onVideoSelect?: (video: any) => void;
}

/**
 * Custom light markdown parser to format Gemini text output into HTML.
 */
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    // Header 3 e.g., ### Title
    if (trimmed.startsWith("###")) {
      return (
        <h4 key={idx} className="text-sm font-black text-orange-400 mt-5 mb-2 flex items-center gap-1.5">
          <Sparkles size={13} className="text-orange-500" />
          {trimmed.replace(/^###\s*/, "")}
        </h4>
      );
    }
    
    // Header 2 e.g., ## Title or 1. **Title**
    if (trimmed.startsWith("##") || /^\d+\.\s+\*\*/.test(trimmed)) {
      const cleanTitle = trimmed
        .replace(/^##\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\*\*/g, "");
      return (
        <h3 key={idx} className="text-base font-black text-white mt-6 mb-3 pb-1.5 border-b border-zinc-800/80 flex items-center gap-2">
          <div className="h-4 w-1 bg-orange-600 rounded-full" />
          {cleanTitle}
        </h3>
      );
    }
    
    // List item e.g., - Item or * Item
    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      const formattedLine = formatBoldText(trimmed.replace(/^[-*]\s*/, ""));
      return (
        <li key={idx} className="text-xs text-zinc-350 leading-relaxed ml-4 list-disc mb-1.5">
          {formattedLine}
        </li>
      );
    }
    
    if (trimmed === "") {
      return <div key={idx} className="h-2" />;
    }
    
    return (
      <p key={idx} className="text-xs text-zinc-350 leading-relaxed mb-2.5">
        {formatBoldText(trimmed)}
      </p>
    );
  });
}

/**
 * Formats bold text brackets **text** into JSX elements.
 */
function formatBoldText(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-extrabold text-orange-400/90">{part}</strong>;
    }
    return part;
  });
}

export default function VideoAnalysisModal({ isOpen, onClose, video, videos, onVideoSelect }: VideoAnalysisModalProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = videos ? videos.findIndex((v) => v.id === video?.id) : -1;
  const prevDisabled = currentIndex <= 0;
  const nextDisabled = videos ? currentIndex === -1 || currentIndex >= videos.length - 1 : true;

  const handlePrevVideo = () => {
    if (videos && currentIndex > 0 && onVideoSelect) {
      onVideoSelect(videos[currentIndex - 1]);
    }
  };

  const handleNextVideo = () => {
    if (videos && currentIndex !== -1 && currentIndex < videos.length - 1 && onVideoSelect) {
      onVideoSelect(videos[currentIndex + 1]);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (!prevDisabled) {
          handlePrevVideo();
        }
      } else if (e.key === "ArrowRight") {
        if (!nextDisabled) {
          handleNextVideo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, prevDisabled, nextDisabled, videos]);

  useEffect(() => {
    if (isOpen && video) {
      fetchAnalysis();
    } else {
      setAnalysis(null);
      setError(null);
    }
    
    // Scroll Lock when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, video]);

  const fetchAnalysis = async () => {
    if (video.analysis_content) {
      setAnalysis(video.analysis_content);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch(`/api/youtube/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video.id,
          title: video.snippet?.title,
          channelTitle: video.snippet?.channelTitle,
          description: video.snippet?.description,
          tags: video.snippet?.tags,
          statistics: video.statistics
        }),
      });
      if (!res.ok) throw new Error("분석 리포트를 불러오는데 실패했습니다.");
      const result = await res.json();
      setAnalysis(result.content || "분석 리포트를 불러올 수 없습니다.");
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !video) return null;

  // View, Like, Comment stats calculations
  const viewCount = Number(video.statistics?.viewCount || 0);
  const likeCount = Number(video.statistics?.likeCount || 0);
  const commentCount = Number(video.statistics?.commentCount || 0);

  const likeRatio = viewCount > 0 ? (likeCount / viewCount) * 100 : 0;
  const commentRatio = viewCount > 0 ? (commentCount / viewCount) * 100 : 0;

  const getLikeGrade = (ratio: number) => {
    if (ratio >= 6.0) return { label: "매우 우수 (초바이럴)", color: "text-orange-400 bg-orange-950/20 border-orange-500/20" };
    if (ratio >= 3.5) return { label: "우수 지표", color: "text-emerald-400 bg-emerald-950/20 border-emerald-500/20" };
    if (ratio >= 1.5) return { label: "보통 수준", color: "text-cyan-400 bg-cyan-950/20 border-cyan-500/20" };
    return { label: "보통 이하", color: "text-zinc-500 bg-zinc-950/20 border-zinc-800/30" };
  };

  const getCommentGrade = (ratio: number) => {
    if (ratio >= 0.5) return { label: "극도로 활발", color: "text-emerald-400" };
    if (ratio >= 0.2) return { label: "활발한 소통", color: "text-cyan-400" };
    return { label: "일반 소통", color: "text-zinc-400" };
  };

  const likeGrade = getLikeGrade(likeRatio);
  const commentGrade = getCommentGrade(commentRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[85vh] rounded-3xl border border-zinc-800 bg-zinc-900/90 text-white shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-950/20">
          <h2 className="text-sm font-black flex items-center gap-2 text-zinc-100">
            <Sparkles size={16} className="text-orange-500 animate-pulse" />
            트렌드 영상 AI 상세 데이터 분석
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Shift Previous Video */}
            <button
              onClick={handlePrevVideo}
              disabled={prevDisabled}
              className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition"
              title="이전 영상 분석 (ArrowLeft)"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Shift Next Video */}
            <button
              onClick={handleNextVideo}
              disabled={nextDisabled}
              className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 transition"
              title="다음 영상 분석 (ArrowRight)"
            >
              <ChevronRight size={16} />
            </button>

            <div className="w-px h-4 bg-zinc-800 mx-1" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-850 bg-zinc-950/40 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="닫기 (ESC)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Section 1: Video Title Header */}
          <div className="flex gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/25">
            <img
              src={video.snippet?.thumbnails?.medium?.url || "/placeholder.jpg"}
              alt="thumbnail"
              className="h-20 aspect-video rounded-xl object-cover border border-zinc-800"
            />
            <div className="flex flex-col justify-center">
              <h3 className="text-xs font-black text-zinc-100 line-clamp-2 leading-snug">
                {video.snippet?.title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold mt-1.5">{video.snippet?.channelTitle}</p>
            </div>
          </div>

          {/* Section 2: Engagement Indicators */}
          <div>
            <h3 className="text-xs font-black text-zinc-300 mb-3 flex items-center gap-1.5">
              📈 시청자 참여도 및 반응률 분석
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Like Rate Meter */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/15 p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-bold flex items-center gap-1">
                    <ThumbsUp size={11} />
                    조회수 대비 좋아요 비율
                  </span>
                  <span className="text-orange-400 font-black">{likeRatio.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                    style={{ width: `${Math.min(likeRatio * 10, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] pt-1">
                  <span className="text-zinc-500">기준값: 보통 2~5%</span>
                  <span className={`px-2 py-0.5 rounded border text-[8px] font-black ${likeGrade.color}`}>
                    {likeGrade.label}
                  </span>
                </div>
              </div>

              {/* Comment Rate Meter */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/15 p-4 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500 font-bold flex items-center gap-1">
                    <MessageSquare size={11} />
                    조회수 대비 댓글 비율
                  </span>
                  <span className="text-cyan-400 font-black">{commentRatio.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                    style={{ width: `${Math.min(commentRatio * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] pt-1">
                  <span className="text-zinc-555">기준값: 보통 0.1~0.2%</span>
                  <span className={`font-black ${commentGrade.color}`}>
                    {commentGrade.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tag Cloud */}
          {video.snippet?.tags && video.snippet.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-zinc-300 mb-2 flex items-center gap-1.5">
                <Tag size={11} />
                주요 비디오 키워드
              </h3>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 scrollbar-hide">
                {video.snippet.tags.map((tag: string, tid: number) => (
                  <span
                    key={tid}
                    className="inline-flex items-center rounded-lg bg-zinc-950 px-2.5 py-1 text-[9px] font-black text-zinc-400 border border-zinc-850 hover:text-white transition cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: AI Analysis Output Report */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/15 p-5 space-y-4">
            <h3 className="text-xs font-black text-zinc-300 flex items-center gap-2">
              <Sparkles size={13} className="text-orange-500 animate-pulse" />
              Gemini Pro 데이터 정밀 기획 분석 리포트
            </h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="animate-spin text-orange-500" size={24} />
                <p className="text-[10px] font-bold text-zinc-555">Gemini AI가 알고리즘 바이럴 지표를 작성하는 중...</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 py-6 justify-center">
                <AlertCircle size={14} />
                <span>리포트 연동 실패: {error}</span>
              </div>
            ) : analysis ? (
              <div className="prose prose-invert prose-xs leading-relaxed max-w-none text-zinc-300">
                {renderMarkdown(analysis)}
              </div>
            ) : (
              <div className="text-center py-10 text-xs font-bold text-zinc-500">
                작성된 리포트 내용이 비어있습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
