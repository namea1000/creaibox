import { useState } from "react";
import { Type } from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let cleanHex = hex.replace("#", "");
  
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseColorWithOpacity(colorStr: string, alpha: number): string {
  if (!colorStr) return `rgba(0, 0, 0, ${alpha})`;
  
  if (colorStr.startsWith("rgba")) {
    const parts = colorStr.replace(/rgba\(|\)/g, "").split(",");
    if (parts.length >= 3) {
      const r = parts[0].trim();
      const g = parts[1].trim();
      const b = parts[2].trim();
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  
  if (colorStr.startsWith("rgb")) {
    const parts = colorStr.replace(/rgb\(|\)/g, "").split(",");
    if (parts.length >= 3) {
      const r = parts[0].trim();
      const g = parts[1].trim();
      const b = parts[2].trim();
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  
  return hexToRgba(colorStr, alpha);
}

export default function VideoEditorTextLayer() {
  const {
    clips,
    selectedClipId,
    selectClip,
    currentTime,
    updateClipTextStyle,
    updateClipName,
  } = useVideoEditor();

  const [editingClipId, setEditingClipId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const textClips = clips.filter(
    (clip) =>
      clip.type === "text" &&
      currentTime >= clip.startTime &&
      currentTime <= clip.startTime + clip.duration
  );

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    clip: any,
    style: any
  ) => {
    if (editingClipId === clip.id) return;

    e.stopPropagation();
    e.preventDefault();

    selectClip(clip.id);

    const target = e.currentTarget;
    const parent = target.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startXPct = style.x;
    const startYPct = style.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const deltaXPct = (deltaX / rect.width) * 100;
      const deltaYPct = (deltaY / rect.height) * 100;

      const newX = Math.max(0, Math.min(100, Math.round(startXPct + deltaXPct)));
      const newY = Math.max(0, Math.min(100, Math.round(startYPct + deltaYPct)));

      updateClipTextStyle(clip.id, { x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleDoubleClick = (clip: any) => {
    setEditingClipId(clip.id);
    setEditValue(clip.name);
  };

  const handleEditComplete = (clipId: string) => {
    if (editValue.trim() !== "") {
      updateClipName(clipId, editValue);
    }
    setEditingClipId(null);
  };

  const handleResizePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    clip: any,
    style: any,
    direction: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startFontSize = style.fontSize;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;

      if (direction.includes("l")) deltaX = -deltaX;
      if (direction.includes("t")) deltaY = -deltaY;

      const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      const newFontSize = Math.max(
        12,
        Math.min(400, Math.round(startFontSize + delta * 0.45))
      );

      updateClipTextStyle(clip.id, { fontSize: newFontSize });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

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

        const isEditing = editingClipId === clip.id;
        const textAlign = clip.textAlign ?? "center";
        const transformX = textAlign === "left" ? "0%" : textAlign === "right" ? "-100%" : "-50%";
        const transform = `translate(${transformX}, -50%)`;

        return (
          <div
            key={clip.id}
            onPointerDown={(e) => handlePointerDown(e, clip, style)}
            onDoubleClick={() => handleDoubleClick(clip)}
            className={`pointer-events-auto absolute flex items-center rounded-none border px-5 py-3 transition select-none cursor-move overflow-visible ${active
                ? "border-cyan-300 ring-4 ring-cyan-400/40"
                : "border-transparent hover:border-cyan-300/40"
              }`}
            style={{
              left: `${style.x}%`,
              top: `${style.y + index * 4}%`,
              transform,
              textAlign,
              fontFamily: clip.fontFamily ?? "sans-serif",
              color: parseColorWithOpacity(style.color, clip.textOpacity ?? 1),
              backgroundColor: parseColorWithOpacity(style.backgroundColor, clip.textBgOpacity ?? 1),
              fontSize: `${style.fontSize}px`,
              fontWeight: style.bold ? 900 : 500,
              textShadow: style.shadow ? "0 2px 8px rgba(0,0,0,0.8)" : "none",
              boxShadow: active ? "0 0 30px rgba(34,211,238,0.35)" : "none",
            }}
          >
            {isEditing ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleEditComplete(clip.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEditComplete(clip.id);
                  } else if (e.key === "Escape") {
                    setEditingClipId(null);
                  }
                }}
                className="bg-transparent border-none outline-none font-inherit text-inherit min-w-[120px] max-w-full text-white"
                style={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                }}
                size={Math.max(10, editValue.length)}
                onPointerDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="whitespace-nowrap">{clip.name}</span>
            )}

            {/* Resize Handles */}
            {active && !isEditing && (
              <>
                {/* Top Edge */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ns-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "t")}
                />
                {/* Bottom Edge */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ns-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "b")}
                />
                {/* Left Edge */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ew-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "l")}
                />
                {/* Right Edge */}
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ew-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "r")}
                />
                {/* Top-Left */}
                <div
                  className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "tl")}
                />
                {/* Top-Right */}
                <div
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "tr")}
                />
                {/* Bottom-Left */}
                <div
                  className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "bl")}
                />
                {/* Bottom-Right */}
                <div
                  className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize z-40 hover:scale-125 transition-transform"
                  onPointerDown={(e) => handleResizePointerDown(e, clip, style, "br")}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}