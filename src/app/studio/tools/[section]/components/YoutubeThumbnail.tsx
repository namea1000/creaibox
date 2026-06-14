"use client";

import React, { useState } from "react";
import { PlayCircle, Search, Download, ExternalLink, AlertCircle } from "lucide-react";

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

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
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <PlayCircle className="text-red-500 animate-pulse" size={20} />
          유튜브 썸네일 다운로더
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          유튜브 동영상 링크 주소를 입력하면, 해당 영상의 오리지널 썸네일 커버 이미지를 해상도별(최대 1080p Full HD)로 추출하여 보여주고 즉시 저장합니다.
        </p>

        <form onSubmit={handleExtract} className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="유튜브 영상 주소 입력... (예: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-red-500/50 transition"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-650 px-6 text-xs font-black text-white hover:bg-red-600 transition shadow-lg shadow-red-650/10 shrink-0"
          >
            <Search size={14} />
            썸네일 추출
          </button>
        </form>
      </div>

      {videoId && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Max Resolution (1080p) */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-red-400 uppercase">HIGH QUALITY</p>
                <h3 className="text-xs font-black text-white mt-0.5">최대 해상도 (HD 1080p)</h3>
              </div>
              <a
                href={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded bg-zinc-850 hover:bg-zinc-800 px-3 text-[10px] font-bold text-zinc-350 transition"
              >
                열기 <ExternalLink size={10} />
              </a>
            </div>
            
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-850 bg-zinc-950">
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
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase">STANDARD QUALITY</p>
                <h3 className="text-xs font-black text-white mt-0.5">표준 해상도 (SD 720p)</h3>
              </div>
              <a
                href={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded bg-zinc-850 hover:bg-zinc-800 px-3 text-[10px] font-bold text-zinc-355 transition"
              >
                열기 <ExternalLink size={10} />
              </a>
            </div>
            
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-850 bg-zinc-950">
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
