"use client";

import { Type } from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorTextLayer() {
  const { clips, selectedClipId, selectClip, currentTime } = useVideoEditor();

  const textClips = clips.filter(
    (clip) =>
      clip.type === "text" &&
      currentTime >= clip.startTime &&
      currentTime <= clip.startTime + clip.duration
  );

  if (textClips.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {textClips.map((clip, index) => {
        const active = selectedClipId === clip.id;
        const style = clip.textStyle ?? {
          fontSize: 42,
          color: "#ffffff",
          backgroundColor: "rgba(0,0,0,0.45)",
          x: 50,
          y: 50,
          bold: true,
          shadow: true,
        };

        return (
          <button
            key={clip.id}
            type="button"
            onClick={() => selectClip(clip.id)}
            className={`pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl border px-5 py-3 transition ${active
                ? "border-cyan-300 ring-4 ring-cyan-400/40"
                : "border-white/20 hover:border-cyan-300"
              }`}
            style={{
              left: `${style.x}%`,
              top: `${style.y + index * 4}%`,
              color: style.color,
              backgroundColor: style.backgroundColor,
              fontSize: `${style.fontSize}px`,
              fontWeight: style.bold ? 900 : 500,
              textShadow: style.shadow ? "0 8px 24px rgba(0,0,0,0.85)" : "none",
              boxShadow: active ? "0 0 30px rgba(34,211,238,0.35)" : "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <Type size={Math.max(18, style.fontSize * 0.55)} />
            {clip.name}
          </button>
        );
      })}
    </div>
  );
}