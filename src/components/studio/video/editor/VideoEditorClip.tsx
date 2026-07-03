"use client";

import { useRef, useState, useEffect } from "react";
import {
  Film,
  Image as ImageIcon,
  Type,
  Captions,
  Sparkles,
  Volume2,
  VolumeX,
  Upload,
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
  onSelect: (clipId: string, event?: React.MouseEvent | React.PointerEvent) => void;
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

  const { mediaItems, clips, detachAudio, extractAndDownloadAudio, relinkMediaFile } = useVideoEditor();
  const activeTrimPointerRef = useRef<number | null>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (!contextMenu) return;
    const handleClose = () => setContextMenu(null);
    window.addEventListener("click", handleClose);
    window.addEventListener("contextmenu", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
      window.removeEventListener("contextmenu", handleClose);
    };
  }, [contextMenu]);

  const handleContextMenu = (event: React.MouseEvent) => {
    if ((clip.type !== "video" && clip.type !== "audio") || isOffline || isExtracting) return;
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleTrimStart = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(clip.id, event);

    const handleElement = event.currentTarget;
    activeTrimPointerRef.current = event.pointerId;

    try {
      handleElement.setPointerCapture(event.pointerId);
    } catch {
      // 포인터가 이미 해제된 경우는 무시합니다.
    }

    const startX = event.clientX;
    const originalStartTime = clip.startTime;
    const originalDuration = clip.duration;
    let pendingClientX = startX;
    let frameId: number | null = null;
    let isCleaningUp = false;

    const updateTrim = (clientX: number) => {
      const deltaSeconds = pixelsToSeconds(clientX - startX);
      const nextStart = Math.max(
        0,
        Number((originalStartTime + deltaSeconds).toFixed(2))
      );

      // Snapping logic during start trim
      let snappedStart = nextStart;
      const SNAP_THRESHOLD_PX = 12;
      const snapThresholdSec = SNAP_THRESHOLD_PX / pxPerSecond;
      let minDiff = snapThresholdSec;

      const snapPoints = [0, currentTime];
      clips.forEach((c) => {
        if (c.id !== clip.id) {
          snapPoints.push(c.startTime);
          snapPoints.push(c.startTime + c.duration);
        }
      });

      snapPoints.forEach((pt) => {
        const diff = Math.abs(nextStart - pt);
        if (diff < minDiff) {
          minDiff = diff;
          snappedStart = pt;
        }
      });

      const finalStart = Math.max(0, snappedStart);
      const finalDuration = Math.max(
        0.5,
        Number((originalDuration - (finalStart - originalStartTime)).toFixed(2))
      );

      onUpdateTime(clip.id, finalStart, finalDuration);
    };

    const handleMove = (moveEvent: PointerEvent) => {
      if (activeTrimPointerRef.current !== moveEvent.pointerId) return;
      moveEvent.preventDefault();
      pendingClientX = moveEvent.clientX;

      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateTrim(pendingClientX);
      });
    };

    const cleanupTrim = () => {
      if (isCleaningUp) return;
      isCleaningUp = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      updateTrim(pendingClientX);
      activeTrimPointerRef.current = null;

      try {
        if (handleElement.hasPointerCapture(event.pointerId)) {
          handleElement.releasePointerCapture(event.pointerId);
        }
      } catch {
        // 포인터 캡처가 이미 해제된 경우는 무시합니다.
      }

      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("blur", handleUp);
      handleElement.removeEventListener("lostpointercapture", handleUp);
    };

    const handleUp = (upEvent?: PointerEvent | Event) => {
      if (
        upEvent instanceof PointerEvent &&
        activeTrimPointerRef.current !== upEvent.pointerId
      ) {
        return;
      }

      cleanupTrim();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    window.addEventListener("blur", handleUp);
    handleElement.addEventListener("lostpointercapture", handleUp);
  };

  const handleTrimEnd = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(clip.id, event);

    const handleElement = event.currentTarget;
    activeTrimPointerRef.current = event.pointerId;

    try {
      handleElement.setPointerCapture(event.pointerId);
    } catch {
      // 포인터가 이미 해제된 경우는 무시합니다.
    }

    const startX = event.clientX;
    const startDuration = clip.duration;
    let pendingClientX = startX;
    let frameId: number | null = null;
    let isCleaningUp = false;

    const updateTrim = (clientX: number) => {
      const deltaSeconds = pixelsToSeconds(clientX - startX);
      const nextDuration = Math.max(
        0.5,
        Number((startDuration + deltaSeconds).toFixed(2))
      );

      const nextEnd = clip.startTime + nextDuration;

      // Snapping logic during end trim
      let snappedEnd = nextEnd;
      const SNAP_THRESHOLD_PX = 12;
      const snapThresholdSec = SNAP_THRESHOLD_PX / pxPerSecond;
      let minDiff = snapThresholdSec;

      const snapPoints = [currentTime];
      clips.forEach((c) => {
        if (c.id !== clip.id) {
          snapPoints.push(c.startTime);
          snapPoints.push(c.startTime + c.duration);
        }
      });

      snapPoints.forEach((pt) => {
        const diff = Math.abs(nextEnd - pt);
        if (diff < minDiff) {
          minDiff = diff;
          snappedEnd = pt;
        }
      });

      const finalDuration = Math.max(
        0.5,
        Number((snappedEnd - clip.startTime).toFixed(2))
      );

      onUpdateDuration(clip.id, finalDuration);
    };

    const handleMove = (moveEvent: PointerEvent) => {
      if (activeTrimPointerRef.current !== moveEvent.pointerId) return;
      moveEvent.preventDefault();
      pendingClientX = moveEvent.clientX;

      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateTrim(pendingClientX);
      });
    };

    const cleanupTrim = () => {
      if (isCleaningUp) return;
      isCleaningUp = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }

      updateTrim(pendingClientX);
      activeTrimPointerRef.current = null;

      try {
        if (handleElement.hasPointerCapture(event.pointerId)) {
          handleElement.releasePointerCapture(event.pointerId);
        }
      } catch {
        // 포인터 캡처가 이미 해제된 경우는 무시합니다.
      }

      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("blur", handleUp);
      handleElement.removeEventListener("lostpointercapture", handleUp);
    };

    const handleUp = (upEvent?: PointerEvent | Event) => {
      if (
        upEvent instanceof PointerEvent &&
        activeTrimPointerRef.current !== upEvent.pointerId
      ) {
        return;
      }

      cleanupTrim();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    window.addEventListener("blur", handleUp);
    handleElement.addEventListener("lostpointercapture", handleUp);
  };
  const media = clip.mediaId ? mediaItems.find((m) => m.id === clip.mediaId) : null;
  const thumbnailUrl = media?.thumbnailUrl || (media?.type === "image" ? media?.url : "");

  return (
    <div
      draggable={!isExtracting}
      onDragStart={(event) => {
        if (isExtracting || activeTrimPointerRef.current !== null) {
          event.preventDefault();
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const grabOffsetX = Math.max(0, event.clientX - rect.left);

        event.dataTransfer.setData("clip-id", clip.id);
        event.dataTransfer.setData("clip-grab-offset-x", String(grabOffsetX));
        event.dataTransfer.effectAllowed = "move";
      }}
      onPointerDown={(event) => {
        if (isExtracting) {
          event.preventDefault();
          return;
        }
        event.stopPropagation();
      }}
      onClick={(event) => {
        if (isExtracting) return;
        event.stopPropagation();
        onSelect(clip.id, event);
      }}
      onContextMenu={handleContextMenu}
      className={`group absolute top-2 flex flex-col h-14 cursor-grab overflow-hidden rounded-[5px] border transition active:cursor-grabbing ${active
          ? "border-cyan-300 bg-cyan-400/30"
          : isOffline
            ? "border-red-500/50 bg-red-950/30 text-red-300"
            : `border-white/10 ${clip.color}`
        } ${visible ? "" : "opacity-40"} ${isExtracting ? "pointer-events-none opacity-80" : ""}`}
      style={{
        left: `${clip.startTime * pxPerSecond}px`,
        width: `${clip.duration * pxPerSecond}px`,
      }}
      title={`${clip.name} · ${clip.startTime.toFixed(1)}s ~ ${clipEnd.toFixed(
        1
      )}s`}
    >
      {/* Audio extraction loading overlay */}
      {isExtracting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 text-[10px] font-black text-cyan-300 select-none pointer-events-auto">
          <span className="animate-pulse">오디오 처리 중...</span>
        </div>
      )}

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
        {thumbnailUrl ? (
          <div
            className="absolute inset-0 z-0 bg-repeat bg-cover pointer-events-none opacity-85"
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          />
        ) : clip.type === "video" && media?.url ? (
          <video
            src={media.url}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85 z-0"
            muted
            playsInline
            preload="metadata"
          />
        ) : null}

        {/* Waveform for Video containing audio */}
        {clip.type === "video" && clip.waveform && clip.waveform.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[16px] items-end gap-[1px] opacity-85 bg-black/40 px-1 pb-[1px]">
            {clip.waveform.map((value, index) => {
              const height = Math.max(10, value * 100);

              return (
                <span
                  key={`${clip.id}-video-wave-${index}`}
                  className="w-[1px] rounded-full bg-cyan-300"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        )}

        {/* Waveform for Audio */}
        {clip.type === "audio" && (
          <div className="pointer-events-none absolute inset-x-1 bottom-1.5 z-0 flex h-[28px] items-end gap-[1.5px] opacity-80">
            {(clip.waveform?.length
              ? clip.waveform
              : Array.from({ length: 48 }, () => 0.08)
            ).map((value, index) => {
              const height = Math.max(10, value * 100);

              return (
                <span
                  key={`${clip.id}-wave-${index}`}
                  className="w-[1.5px] rounded-full bg-emerald-300"
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
        onPointerDown={isExtracting ? undefined : handleTrimStart}
        onDragStart={(event) => event.preventDefault()}
        className="absolute left-0 top-0 z-30 h-full w-1.5 cursor-ew-resize rounded-l-[5px] bg-cyan-400 opacity-0 transition group-hover:opacity-100"
      />

      {/* Trim End handle */}
      <div
        role="button"
        tabIndex={0}
        title="끝점 Trim / 길이 조절"
        onPointerDown={isExtracting ? undefined : handleTrimEnd}
        onDragStart={(event) => event.preventDefault()}
        className="absolute right-0 top-0 z-30 h-full w-1.5 cursor-ew-resize rounded-r-[5px] bg-cyan-400 opacity-0 transition group-hover:opacity-100"
      />

      {/* Fixed Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
          }}
          className="w-48 rounded border border-white/10 bg-[#1e1e24] p-1 shadow-lg text-[10.5px] font-bold text-zinc-300 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {clip.type === "video" && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                setContextMenu(null);
                setIsExtracting(true);
                try {
                  await detachAudio(clip.id);
                } catch (err: any) {
                  console.error(err);
                  alert(err.message || "오디오 분리 중 오류가 발생했습니다.");
                } finally {
                  setIsExtracting(false);
                }
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left hover:bg-white/5 hover:text-white transition"
            >
              오디오 분리
            </button>
          )}
          {clip.type === "audio" && (
            <button
              type="button"
              onClick={async (e) => {
                e.stopPropagation();
                setContextMenu(null);
                setIsExtracting(true);
                try {
                  await extractAndDownloadAudio(clip.id);
                } catch (err: any) {
                  console.error(err);
                  alert(err.message || "오디오 파일 추출 중 오류가 발생했습니다.");
                } finally {
                  setIsExtracting(false);
                }
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left hover:bg-white/5 hover:text-white transition"
            >
              오디오 파일 추출 (PC 다운로드)
            </button>
          )}
          {(clip.type === "video" || clip.type === "audio") && clip.mediaId && (
            <label className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left hover:bg-white/5 hover:text-white border-t border-white/5 cursor-pointer transition">
              <Upload size={13} className="shrink-0 text-zinc-400" />
              미디어 파일 재연결
              <input
                type="file"
                accept={clip.type === "audio" ? "audio/*" : "video/*"}
                className="hidden"
                onChange={async (event) => {
                  setContextMenu(null);
                  const file = event.target.files?.[0];
                  if (file) {
                    try {
                      await relinkMediaFile(clip.mediaId!, file);
                    } catch (err: any) {
                      console.error(err);
                      alert(err.message || "파일 재연결 중 오류가 발생했습니다.");
                    }
                  }
                }}
              />
            </label>
          )}
        </div>
      )}
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
