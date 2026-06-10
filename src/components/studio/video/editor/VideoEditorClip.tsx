"use client";

import {
  Film,
  Image as ImageIcon,
  Music,
  Type,
  Captions,
  Sparkles,
  Trash2,
  Copy,
  Split,
  Volume2,
  VolumeX,
  GripVertical,
} from "lucide-react";

import type { VideoEditorClip as VideoEditorClipType } from "./VideoEditorContext";
import { useVideoEditor } from "./VideoEditorContext";

type VideoEditorClipProps = {
  clip: VideoEditorClipType;
  active: boolean;
  visible: boolean;
  currentTime: number;
  timelineZoom: number;
  isOffline?: boolean;
  onSelect: (clipId: string) => void;
  onRemove: (clipId: string) => void;
  onDuplicate: (clipId: string) => void;
  onSplit: (clipId: string, splitTime?: number) => void;
  onUpdatePosition: (clipId: string, left: number) => void;
  onUpdateDuration: (clipId: string, duration: number) => void;
  onUpdateTime: (clipId: string, startTime: number, duration: number) => void;
};

export default function VideoEditorClip({
  clip,
  active,
  visible,
  currentTime,
  timelineZoom,
  isOffline = false,
  onSelect,
  onRemove,
  onDuplicate,
  onSplit,
  onUpdateDuration,
  onUpdateTime,
}: VideoEditorClipProps) {
  const clipEnd = clip.startTime + clip.duration;
  const progress =
    currentTime >= clip.startTime && currentTime <= clipEnd
      ? ((currentTime - clip.startTime) / clip.duration) * 100
      : 0;

  const pxPerSecond = (timelineZoom / 100) * 16;

  const pixelsToSeconds = (deltaX: number) => {
    return deltaX / pxPerSecond;
  };

  const handleTrimStart = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const originalStartTime = clip.startTime;
    const originalDuration = clip.duration;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaSeconds = pixelsToSeconds(moveEvent.clientX - startX);
      const nextStart = Math.max(
        0,
        Number((originalStartTime + deltaSeconds).toFixed(2))
      );
      const nextDuration = Math.max(
        0.5,
        Number((originalDuration - deltaSeconds).toFixed(2))
      );

      onUpdateTime(clip.id, nextStart, nextDuration);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleTrimEnd = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startDuration = clip.duration;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaSeconds = pixelsToSeconds(moveEvent.clientX - startX);
      const nextDuration = Math.max(
        0.5,
        Number((startDuration + deltaSeconds).toFixed(2))
      );

      onUpdateDuration(clip.id, nextDuration);
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const { mediaItems } = useVideoEditor();
  const media = clip.mediaId ? mediaItems.find((m) => m.id === clip.mediaId) : null;
  const thumbnailUrl = media?.thumbnailUrl || (media?.type === "image" ? media?.url : "");

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("clip-id", clip.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(clip.id);
      }}
      className={`group absolute top-2 flex flex-col h-14 cursor-grab overflow-hidden rounded-none border transition active:cursor-grabbing ${active
          ? "border-cyan-300 bg-cyan-400/30"
          : isOffline
            ? "border-red-500/50 bg-red-950/30 text-red-300"
            : `border-white/10 ${clip.color}`
        } ${visible ? "" : "opacity-40"}`}
      style={{
        left: `${clip.startTime * pxPerSecond}px`,
        width: `${clip.duration * pxPerSecond}px`,
      }}
      title={`${clip.name} · ${clip.startTime.toFixed(1)}s ~ ${clipEnd.toFixed(
        1
      )}s`}
    >
      {/* Top Bar: Name & Duration Info */}
      <div className="h-5 shrink-0 w-full flex items-center justify-between px-1.5 bg-black/60 text-[9px] font-black text-white/90 border-b border-white/5 select-none pointer-events-none z-20">
        <div className="flex items-center gap-1 min-w-0 max-w-[70%]">
          {isOffline ? (
            <VolumeX size={10} className="shrink-0 text-red-400 animate-pulse" />
          ) : (
            <ClipTypeIcon type={clip.type} muted={clip.muted} />
          )}
          <span className="truncate">{clip.name}</span>
        </div>
        <span className="shrink-0 text-white/50">{clip.duration.toFixed(1)}s</span>
      </div>

      {/* Bottom Area: Image Filmstrip or Audio Waveform */}
      <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-black/10 z-10 pointer-events-none">
        {/* Filmstrip Background for Video/Image */}
        {thumbnailUrl && (clip.type === "video" || clip.type === "image") && (
          <div
            className="absolute inset-0 z-0 bg-repeat bg-cover pointer-events-none opacity-85"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          />
        )}

        {/* Waveform for Audio */}
        {clip.type === "audio" && (
          <div className="pointer-events-none absolute inset-x-1 bottom-1.5 z-0 flex h-[28px] items-end gap-[1.5px] opacity-80">
            {(clip.waveform?.length
              ? clip.waveform
              : Array.from({ length: 48 })
            ).map((value, index) => {
              const height =
                typeof value === "number"
                  ? Math.max(10, value * 100)
                  : 20 + Math.abs(Math.sin(index)) * 70;

              return (
                <span
                  key={`${clip.id}-wave-${index}`}
                  className="w-[1.5px] rounded-none bg-emerald-300"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Playback Progress Indicator overlay */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-white/10 z-10"
        style={{
          width: `${Math.max(0, Math.min(100, progress))}%`,
        }}
      />

      {clip.transitionIn && clip.transitionIn !== "none" && (
        <div className="absolute left-0 top-0 z-10 h-full w-4 bg-white/20" />
      )}

      {clip.transitionOut && clip.transitionOut !== "none" && (
        <div className="absolute right-0 top-0 z-10 h-full w-4 bg-white/20" />
      )}

      {/* Trim Start handle */}
      <div
        role="button"
        tabIndex={0}
        title="시작점 Trim"
        onPointerDown={handleTrimStart}
        className="absolute left-0 top-0 z-30 h-full w-1.5 cursor-ew-resize bg-cyan-400 opacity-0 transition group-hover:opacity-100"
      />

      {/* Trim End handle */}
      <div
        role="button"
        tabIndex={0}
        title="끝점 Trim / 길이 조절"
        onPointerDown={handleTrimEnd}
        className="absolute right-0 top-0 z-30 h-full w-1.5 cursor-ew-resize bg-cyan-400 opacity-0 transition group-hover:opacity-100"
      />
    </div>
  );
}

function ClipTypeIcon({
  type,
  muted,
}: {
  type: string;
  muted?: boolean;
}) {
  if (muted) return <VolumeX size={13} className="shrink-0 text-red-200" />;
  if (type === "video") return <Film size={13} className="shrink-0 text-cyan-200" />;
  if (type === "image") return <ImageIcon size={13} className="shrink-0 text-violet-200" />;
  if (type === "audio") return <Volume2 size={13} className="shrink-0 text-emerald-200" />;
  if (type === "text") return <Type size={13} className="shrink-0 text-fuchsia-200" />;
  if (type === "subtitle") return <Captions size={13} className="shrink-0 text-amber-200" />;
  return <Sparkles size={13} className="shrink-0 text-pink-200" />;
}

function MiniIconButton({
  icon: Icon,
  title,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  danger?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-none p-1 opacity-0 transition group-hover:opacity-100 ${danger
          ? "text-white/40 hover:bg-red-500/20 hover:text-red-200"
          : "text-white/40 hover:bg-cyan-500/20 hover:text-cyan-100"
        }`}
    >
      <Icon size={12} />
    </button>
  );
}