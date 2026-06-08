"use client";

import { Captions } from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorSubtitleLayer() {
  const { clips, selectedClipId, selectClip, currentTime } = useVideoEditor();

  const subtitleClips = clips.filter(
    (clip) =>
      clip.type === "subtitle" &&
      currentTime >= clip.startTime &&
      currentTime <= clip.startTime + clip.duration
  );

  if (subtitleClips.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {subtitleClips.map((clip, index) => {
        const active = selectedClipId === clip.id;
        const style = clip.textStyle ?? {
          fontSize: 30,
          color: "#ffffff",
          backgroundColor: "rgba(0,0,0,0.72)",
          x: 50,
          y: 82,
          bold: true,
          shadow: true,
        };

        return (
          <button
            key={clip.id}
            type="button"
            onClick={() => selectClip(clip.id)}
            className={`pointer-events-auto absolute flex max-w-[80%] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border px-5 py-3 text-center transition ${active
                ? "border-amber-300 ring-4 ring-amber-400/40"
                : "border-white/20 hover:border-amber-300"
              }`}
            style={{
              left: `${style.x}%`,
              top: `${style.y + index * 4}%`,
              color: style.color,
              backgroundColor: style.backgroundColor,
              fontSize: `${style.fontSize}px`,
              fontWeight: style.bold ? 900 : 500,
              textShadow: style.shadow ? "0 6px 20px rgba(0,0,0,0.9)" : "none",
              boxShadow: active ? "0 0 30px rgba(251,191,36,0.35)" : "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <Captions size={Math.max(18, style.fontSize * 0.6)} />
            {clip.name}
          </button>
        );
      })}
    </div>
  );
}