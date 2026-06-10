"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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

export default function VideoEditorTimeline() {
  const [timelineZoom, setTimelineZoom] = useState(100);
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = timelineScrollRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        // zoomDelta: negative deltaY means pinching out (zooming in), positive means pinching in (zooming out)
        const zoomDelta = -event.deltaY * 0.45;
        setTimelineZoom((prev) => {
          const next = prev + zoomDelta;
          return Math.min(400, Math.max(25, Math.round(next)));
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const {
    tracks,
    clips,
    mediaItems,
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

  // 100% 줌일 때 1초당 16픽셀 (줌 상태에 따라 비례)
  const pxPerSecond = (timelineZoom / 100) * 16;
  const totalWidth = Math.max(1200, totalDuration * pxPerSecond);
  const playheadLeft = currentTime * pxPerSecond;

  const timeMarks = useMemo(() => {
    const marks = [];
    // 전체 길이에 따라 간격을 유동적으로 (30초 미만은 5초 간격, 길어지면 10초 또는 30초 간격)
    let step = 5;
    if (totalDuration > 300) step = 30; // 5분 이상 시 30초 단위
    else if (totalDuration > 120) step = 15; // 2분 이상 시 15초 단위
    else if (totalDuration > 60) step = 10; // 1분 이상 시 10초 단위

    const end = Math.max(30, totalDuration);
    for (let t = 0; t <= end; t += step) {
      marks.push(t);
    }
    return marks;
  }, [totalDuration]);

  const handleDropClip = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const clipId = event.dataTransfer.getData("clip-id");
    if (!clipId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const dropX = event.clientX - rect.left; // 드롭된 곳의 픽셀 좌표
    
    const targetClip = clips.find((clip) => clip.id === clipId);
    if (!targetClip) return;

    const nextStartTime = Math.max(0, dropX / pxPerSecond);

    // 퍼센트 대신 startTime과 duration을 직접 초 단위로 전달하여 업데이트
    updateClipTime(clipId, nextStartTime, targetClip.duration);
    selectClip(clipId);
  };

  const handleTimelineSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left; // 클릭한 곳의 픽셀 좌표
    const nextTime = Math.max(0, Math.min(totalDuration, clickX / pxPerSecond));

    setCurrentTime(Number(nextTime.toFixed(1)));
  };

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#202026] px-4">
        <div className="flex items-center gap-2">
          <div className="font-black text-zinc-300">Timeline</div>

          <div className="ml-3 rounded-none border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-500">
            {currentTime.toFixed(1)}s / {totalDuration}s
          </div>

          {selectedClip && (
            <div className="max-w-[320px] truncate rounded-none border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
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
            onClick={() => setTimelineZoom((value) => Math.max(25, value - 25))}
            className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomOut size={15} />
          </button>

          <div className="w-16 text-center text-xs font-bold text-zinc-400">
            {timelineZoom}%
          </div>

          <button
            type="button"
            onClick={() => setTimelineZoom((value) => Math.min(400, value + 25))}
            className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-48px)]">
        <div className="w-[190px] shrink-0 border-r border-white/5 bg-[#141418]">
          <div className="h-8 border-b border-white/5 px-4 text-xs font-bold leading-8 text-zinc-500">
            Tracks
          </div>

          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex h-[72px] items-center justify-between border-b border-white/5 px-3"
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

        <div
          ref={timelineScrollRef}
          className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
        >
          <div
            onPointerDown={handleTimelineSeek}
            className="min-w-full relative cursor-pointer"
            style={{
              width: `${totalWidth}px`,
            }}
          >
            {/* 눈금자 헤더 영역 */}
            <div className="relative h-8 border-b border-white/5 bg-[#18181c]">
              <div className="absolute inset-0 text-[10px] text-zinc-500">
                {timeMarks.map((time) => {
                  const mins = Math.floor(time / 60).toString().padStart(2, "0");
                  const secs = Math.floor(time % 60).toString().padStart(2, "0");
                  return (
                    <div
                      key={time}
                      className="absolute border-r border-white/5 px-2 leading-8 h-full"
                      style={{ left: `${time * pxPerSecond}px` }}
                    >
                      {`${mins}:${secs}`}
                    </div>
                  );
                })}
              </div>

              {/* 플레이헤드 핀 */}
              <div
                className="pointer-events-none absolute top-0 z-30 h-full w-px bg-red-400"
                style={{ left: `${playheadLeft}px` }}
              >
                <div className="-ml-2 h-4 w-4 rounded-none bg-red-400" />
              </div>
            </div>

            {/* 클립 트랙 영역 */}
            <div className="relative">
              {/* 플레이헤드 세로선 */}
              <div
                className="pointer-events-none absolute top-0 z-30 h-full w-px bg-red-400"
                style={{ left: `${playheadLeft}px` }}
              />

              {tracks.map((track) => {
                const trackClips = clips.filter((clip) => clip.trackId === track.id);

                return (
                  <div
                    key={track.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDropClip}
                    className="relative h-[72px] border-b border-white/5 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:80px_100%]"
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
                        const isOffline = clip.mediaId
                          ? !mediaItems.find((m) => m.id === clip.mediaId)?.url
                          : false;

                        return (
                          <VideoEditorClip
                            key={clip.id}
                            clip={clip}
                            active={selectedClipId === clip.id}
                            visible={visible}
                            currentTime={currentTime}
                            timelineZoom={timelineZoom}
                            isOffline={isOffline}
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
      className={`flex items-center gap-1 rounded-none px-2.5 py-1.5 text-xs font-bold transition outline-none disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}