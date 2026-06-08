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

type VideoEditorClipProps = {
  clip: VideoEditorClipType;
  active: boolean;
  visible: boolean;
  currentTime: number;
  timelineZoom: number;
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

  const pixelsToSeconds = (deltaX: number) => {
    return (deltaX / 100) * (100 / timelineZoom) * 3;
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

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("clip-id", clip.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onSelect(clip.id)}
      className={`group absolute top-2 flex h-8 cursor-grab items-center justify-between overflow-hidden rounded-lg border px-3 transition active:cursor-grabbing ${active
          ? "border-cyan-300 bg-cyan-400/30"
          : `border-white/10 ${clip.color}`
        } ${visible ? "" : "opacity-40"}`}
      style={{
        left: `${clip.left}%`,
        width: `${clip.width}%`,
      }}
      title={`${clip.name} · ${clip.startTime.toFixed(1)}s ~ ${clipEnd.toFixed(
        1
      )}s`}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-white/10"
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

      <div
        role="button"
        tabIndex={0}
        title="시작점 Trim"
        onPointerDown={handleTrimStart}
        className="absolute left-0 top-0 z-30 h-full w-2 cursor-ew-resize bg-cyan-200/60 opacity-0 transition group-hover:opacity-100"
      />

      <div className="relative z-20 flex min-w-0 flex-1 items-center gap-2">
        <ClipTypeIcon type={clip.type} muted={clip.muted} />

        <GripVertical
          size={12}
          className="hidden shrink-0 text-white/30 group-hover:block"
        />

        <div className="truncate text-xs font-bold text-white/90">
          {clip.name}
        </div>
      </div>

      {clip.type === "audio" && (
        <div className="pointer-events-none absolute inset-x-2 bottom-1 z-0 flex h-3 items-end gap-[2px] opacity-60">
          {(clip.waveform?.length
            ? clip.waveform
            : Array.from({ length: 28 })
          ).map((value, index) => {
            const height =
              typeof value === "number"
                ? Math.max(10, value * 100)
                : 20 + Math.abs(Math.sin(index)) * 70;

            return (
              <span
                key={`${clip.id}-wave-${index}`}
                className="w-[2px] rounded bg-emerald-200"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}

      <div className="relative z-30 flex items-center gap-1">
        <MiniIconButton
          title="복제"
          icon={Copy}
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate(clip.id);
          }}
        />

        <MiniIconButton
          title="현재 위치 분할"
          icon={Split}
          onClick={(event) => {
            event.stopPropagation();
            onSplit(clip.id, currentTime);
          }}
        />

        <MiniIconButton
          title="삭제"
          icon={Trash2}
          danger
          onClick={(event) => {
            event.stopPropagation();
            onRemove(clip.id);
          }}
        />

        <div
          role="button"
          tabIndex={0}
          title="끝점 Trim / 길이 조절"
          onPointerDown={handleTrimEnd}
          className="h-6 w-2 cursor-ew-resize rounded bg-white/40 opacity-0 transition hover:bg-cyan-200 group-hover:opacity-100"
        />
      </div>
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
      className={`rounded p-1 opacity-0 transition group-hover:opacity-100 ${danger
          ? "text-white/40 hover:bg-red-500/20 hover:text-red-200"
          : "text-white/40 hover:bg-cyan-500/20 hover:text-cyan-100"
        }`}
    >
      <Icon size={12} />
    </button>
  );
}