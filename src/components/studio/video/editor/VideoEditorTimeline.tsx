"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  Volume2,
  Plus,
  ZoomIn,
  ZoomOut,
  Split,
  MousePointer2,
  Copy,
  Undo2,
  Redo2,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorClip from "./VideoEditorClip";

const timeMarks = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25", "00:30"];

export default function VideoEditorTimeline() {
  const [timelineZoom, setTimelineZoom] = useState(100);

  const {
    tracks,
    clips,
    selectedClipId,
    selectClip,
    removeClip,
    duplicateClip,
    splitClip,
    updateClipPosition,
    updateClipDuration,
    updateClipTime,
    currentTime,
    totalDuration,
    setCurrentTime,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;
  const playheadPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handleDropClip = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const clipId = event.dataTransfer.getData("clip-id");
    if (!clipId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;

    const targetClip = clips.find((clip) => clip.id === clipId);
    const safeWidth = targetClip?.width ?? 20;
    const nextLeft = Math.max(0, Math.min(100 - safeWidth, Math.round(percent)));

    updateClipPosition(clipId, nextLeft);
    selectClip(clipId);
  };

  const handleTimelineSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const nextTime = Math.max(0, Math.min(totalDuration, percent * totalDuration));

    setCurrentTime(Number(nextTime.toFixed(1)));
  };

  return (
    <div className="h-[300px] shrink-0 border-t border-white/10 bg-[#0b0b10]">
      <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2">
          <div className="font-black text-zinc-300">Timeline</div>

          <div className="ml-3 rounded-lg border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-500">
            {currentTime.toFixed(1)}s / {totalDuration}s
          </div>

          {selectedClip && (
            <div className="max-w-[320px] truncate rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
              선택: {selectedClip.name} · {selectedClip.startTime.toFixed(1)}s ~{" "}
              {(selectedClip.startTime + selectedClip.duration).toFixed(1)}s
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TimelineTool icon={Undo2} label="Undo" disabled={!canUndo} onClick={undo} />
          <TimelineTool icon={Redo2} label="Redo" disabled={!canRedo} onClick={redo} />

          <div className="mx-1 h-5 w-px bg-white/10" />

          <TimelineTool icon={MousePointer2} label="선택" active />

          <TimelineTool
            icon={Split}
            label="분할"
            disabled={!selectedClipId}
            onClick={() => {
              if (selectedClipId) splitClip(selectedClipId, currentTime);
            }}
          />

          <TimelineTool
            icon={Copy}
            label="복제"
            disabled={!selectedClipId}
            onClick={() => {
              if (selectedClipId) duplicateClip(selectedClipId);
            }}
          />

          <TimelineTool icon={Plus} label="트랙 추가" disabled />

          <div className="mx-2 h-5 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => setTimelineZoom((value) => Math.max(50, value - 25))}
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomOut size={15} />
          </button>

          <div className="w-16 text-center text-xs font-bold text-zinc-400">
            {timelineZoom}%
          </div>

          <button
            type="button"
            onClick={() => setTimelineZoom((value) => Math.min(300, value + 25))}
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-48px)]">
        <div className="w-[190px] shrink-0 border-r border-white/10 bg-[#0d0d12]">
          <div className="h-8 border-b border-white/10 px-4 text-xs font-bold leading-8 text-zinc-500">
            Tracks
          </div>

          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex h-12 items-center justify-between border-b border-white/5 px-3"
            >
              <div>
                <div className="text-xs font-bold text-zinc-300">{track.name}</div>
                <div className="text-[10px] uppercase text-zinc-600">{track.type}</div>
              </div>

              <div className="flex items-center gap-1 text-zinc-600">
                <Eye size={13} />
                <Lock size={13} />
                {track.type === "audio" && <Volume2 size={13} />}
              </div>
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
          <div
            className="min-w-full"
            style={{
              width: `${timelineZoom}%`,
            }}
          >
            <div onPointerDown={handleTimelineSeek} className="relative cursor-pointer">
              <div className="grid h-8 grid-cols-7 border-b border-white/10 text-[10px] text-zinc-500">
                {timeMarks.map((mark) => (
                  <div key={mark} className="border-r border-white/5 px-2 leading-8">
                    {mark}
                  </div>
                ))}
              </div>

              <div
                className="pointer-events-none absolute top-0 z-30 h-full w-px bg-red-400"
                style={{ left: `${playheadPercent}%` }}
              >
                <div className="-ml-2 h-4 w-4 rounded-full bg-red-400" />
              </div>
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute top-0 z-30 h-full w-px bg-red-400"
                style={{ left: `${playheadPercent}%` }}
              />

              {tracks.map((track) => {
                const trackClips = clips.filter((clip) => clip.trackId === track.id);

                return (
                  <div
                    key={track.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDropClip}
                    className="relative h-12 border-b border-white/5 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:80px_100%]"
                  >
                    {trackClips.length === 0 ? (
                      <div className="flex h-full items-center px-4 text-xs text-zinc-700">
                        Drop media here
                      </div>
                    ) : (
                      trackClips.map((clip) => {
                        const clipStart = clip.startTime;
                        const clipEnd = clip.startTime + clip.duration;
                        const visible = currentTime >= clipStart && currentTime <= clipEnd;

                        return (
                          <VideoEditorClip
                            key={clip.id}
                            clip={clip}
                            active={selectedClipId === clip.id}
                            visible={visible}
                            currentTime={currentTime}
                            timelineZoom={timelineZoom}
                            onSelect={selectClip}
                            onRemove={removeClip}
                            onDuplicate={duplicateClip}
                            onSplit={splitClip}
                            onUpdatePosition={updateClipPosition}
                            onUpdateDuration={updateClipDuration}
                            onUpdateTime={updateClipTime}
                          />
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineTool({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30 ${active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 text-zinc-400 hover:border-cyan-400/50"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}