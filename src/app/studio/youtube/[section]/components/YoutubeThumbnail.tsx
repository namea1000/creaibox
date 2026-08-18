"use client";

import React, { useState } from "react";
import { PlayCircle, Search, Download, ExternalLink, AlertCircle } from "lucide-react";

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>("W4LhfsQTi5E");

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // YouTube URL ID parser RegExp
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    } else {
      // Assume user entered video ID directly
      if (url.trim().length === 11) {
        setVideoId(url.trim());
      } else {
        setVideoId(null);
        alert("올바른 유튜브 링크 또는 비디오 ID를 입력하세요.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 상단 헤더 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              유튜브 썸네일 다운로더
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-500 dark:text-zinc-400 mt-1">
              유튜브 동영상 링크 주소를 입력하면, 해당 영상의 오리지널 썸네일 커버 이미지를 해상도별로 추출하여 보여주고 즉시 저장합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-200 dark:border-zinc-800/80/80 bg-white dark:bg-zinc-900/40 p-5 shadow-xs">

        <form onSubmit={handleExtract} className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="유튜브 영상 주소 입력... (예: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="flex-1 h-11 rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/50 px-4 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-650 px-6 text-xs font-black text-slate-900 dark:text-zinc-100 hover:bg-red-600 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            <Search size={14} />
            썸네일 추출
          </button>
        </form>
      </div>

      {videoId && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Max Resolution (1080p) */}
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs p-5 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-red-400 uppercase">HIGH QUALITY</p>
                <h3 className="text-xs font-black text-slate-900 dark:text-zinc-100 mt-0.5">최대 해상도 (HD 1080p)</h3>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  download={`thumbnail_${videoId}_max.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-3 text-[10px] font-bold text-slate-600 dark:text-zinc-300 transition"
                >
                  이미지 저장 <Download size={10} />
                </a>
                <a
                  href={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 text-[10px] font-bold text-slate-600 dark:text-zinc-300 transition"
                >
                  열기 <ExternalLink size={10} />
                </a>
              </div>
            </div>
            
            <div className="aspect-video w-full overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-zinc-950/50">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Max Resolution Thumbnail"
                onError={(e) => {
                  // Fallback if maxresdefault doesn't exist for low-res uploads
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Standard Resolution (720p) */}
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs p-5 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-500 dark:text-zinc-400 uppercase">STANDARD QUALITY</p>
                <h3 className="text-xs font-black text-slate-900 dark:text-zinc-100 mt-0.5">표준 해상도 (SD 720p)</h3>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                  download={`thumbnail_${videoId}_sd.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50 px-3 text-[10px] font-bold text-slate-600 dark:text-zinc-300 transition"
                >
                  이미지 저장 <Download size={10} />
                </a>
                <a
                  href={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 text-[10px] font-bold text-slate-600 dark:text-zinc-300 transition"
                >
                  열기 <ExternalLink size={10} />
                </a>
              </div>
            </div>
            
            <div className="aspect-video w-full overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800/60 bg-slate-50 dark:bg-zinc-950/50">
              <img
                src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                alt="Standard Resolution Thumbnail"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
