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
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorClip from "./VideoEditorClip";

const TIMELINE_LABEL_INTERVALS = [
  0.5, 1, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600,
];
const MIN_TIMELINE_LABEL_SPACING_PX = 72;
const MIN_TIMELINE_ZOOM = 2;
const MAX_TIMELINE_ZOOM = 1600;

function getTimelineLabelInterval(pxPerSecond: number) {
  return (
    TIMELINE_LABEL_INTERVALS.find(
      (interval) => interval * pxPerSecond >= MIN_TIMELINE_LABEL_SPACING_PX
    ) ?? TIMELINE_LABEL_INTERVALS[TIMELINE_LABEL_INTERVALS.length - 1]
  );
}

function formatTimelineMark(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  
  // Clean up floating point inaccuracies
  const roundedTime = Math.round(totalSeconds * 10) / 10;
  const secs = roundedTime % 60;
  
  const hasFraction = Math.abs(roundedTime - Math.round(roundedTime)) > 0.01;
  const secsStr = hasFraction
    ? secs.toFixed(1).padStart(4, "0")
    : Math.round(secs).toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secsStr}`;
  }

  return `${mins.toString().padStart(2, "0")}:${secsStr}`;
}

function clampTimelineZoom(value: number) {
  return Math.min(MAX_TIMELINE_ZOOM, Math.max(MIN_TIMELINE_ZOOM, Math.round(value)));
}

function getTimelineZoomStep(value: number) {
  if (value < 10) return 1;
  if (value < 25) return 2;
  if (value < 100) return 5;
  if (value < 400) return 25;
  return 100;
}

export default function VideoEditorTimeline() {
  const [timelineZoom, setTimelineZoom] = useState(100);
  const [showAddTrackMenu, setShowAddTrackMenu] = useState(false);
  const [showLeftAddTrackMenu, setShowLeftAddTrackMenu] = useState(false);
  const timelineRootRef = useRef<HTMLDivElement | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);
  const headersTracksContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineZoomRef = useRef(timelineZoom);
  const [draggingOverTrackId, setDraggingOverTrackId] = useState<string | null>(null);
  const [isDraggingOverGrid, setIsDraggingOverGrid] = useState(false);

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (headersTracksContainerRef.current) {
      headersTracksContainerRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleHeadersWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollTop += e.deltaY;
    }
  };

  useEffect(() => {
    timelineZoomRef.current = timelineZoom;
  }, [timelineZoom]);

  useEffect(() => {
    const root = timelineRootRef.current;
    const container = timelineScrollRef.current;
    if (!root || !container) return;

    const handleWheel = (event: WheelEvent) => {
      const isTrackpadZoom =
        event.ctrlKey || event.metaKey || Math.abs(event.deltaZ) > 0;

      if (!isTrackpadZoom) return;

      event.preventDefault();

      const rect = container.getBoundingClientRect();
      const pointerX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const currentPxPerSecond = (timelineZoomRef.current / 100) * 16;
      const anchoredTime = (container.scrollLeft + pointerX) / currentPxPerSecond;
      const zoomDelta = -event.deltaY * 0.45;
      const nextZoom = clampTimelineZoom(timelineZoomRef.current + zoomDelta);
      const nextPxPerSecond = (nextZoom / 100) * 16;

      timelineZoomRef.current = nextZoom;
      setTimelineZoom(nextZoom);

      window.requestAnimationFrame(() => {
        container.scrollLeft = Math.max(0, anchoredTime * nextPxPerSecond - pointerX);
      });
    };

    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", handleWheel);
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
    updateClipPlacement,
    currentTime,
    totalDuration,
    setCurrentTime,
    undo,
    redo,
    canUndo,
    canRedo,
    setTracks,
    setClips,
    addClipFromMedia,
    addMediaFiles,
  } = useVideoEditor();

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm("트랙을 정말로 삭제하시겠습니까?")) {
      const updatedTracks = tracks.filter((t) => t.id !== trackId);
      setTracks(updatedTracks);

      const updatedClips = clips.filter((c) => c.trackId !== trackId);
      setClips(updatedClips);
    }
  };

  const handleMoveTrack = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= tracks.length) return;

    const newTracks = [...tracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[nextIndex];
    newTracks[nextIndex] = temp;

    setTracks(newTracks);
  };

  const handleDragTrackStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("track-index", String(index));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragTrackOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropTrack = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    const sourceIndexStr = event.dataTransfer.getData("track-index");
    if (!sourceIndexStr) return;

    const sourceIndex = Number(sourceIndexStr);
    if (sourceIndex === targetIndex) return;

    const newTracks = [...tracks];
    const [draggedTrack] = newTracks.splice(sourceIndex, 1);
    newTracks.splice(targetIndex, 0, draggedTrack);

    setTracks(newTracks);
  };

  const handleAddTrack = (type: "video" | "audio" | "text" | "subtitle" | "visualizer") => {
    const sameTypeTracks = tracks.filter((t) => t.type === type);
    const timestamp = Date.now();
    const trackId = `${type}-${timestamp}`;

    const getTrackName = (t: string, idx: number) => {
      const displayIdx = idx + 1;
      if (t === "video") return `Video Track ${displayIdx}`;
      if (t === "audio") return `Audio Track ${displayIdx}`;
      if (t === "text") return `Text Track ${displayIdx}`;
      if (t === "subtitle") return `Subtitle Track ${displayIdx}`;
      if (t === "visualizer") return `Visualizer Track ${displayIdx}`;
      return `Track ${displayIdx}`;
    };

    const getTrackColor = (t: string) => {
      if (t === "video") return "bg-cyan-400/25";
      if (t === "audio") return "bg-emerald-400/25";
      if (t === "text") return "bg-violet-400/25";
      if (t === "subtitle") return "bg-amber-400/25";
      if (t === "visualizer") return "bg-pink-400/25";
      return "bg-zinc-400/25";
    };

    const newTrack = {
      id: trackId,
      name: getTrackName(type, sameTypeTracks.length),
      type,
      color: getTrackColor(type),
    };

    const lastSameTypeIndex = tracks.reduce(
      (lastIndex, item, index) => (item.type === type ? index : lastIndex),
      -1
    );

    let updatedTracks;
    if (lastSameTypeIndex < 0) {
      updatedTracks = [...tracks, newTrack];
    } else {
      updatedTracks = [
        ...tracks.slice(0, lastSameTypeIndex + 1),
        newTrack,
        ...tracks.slice(lastSameTypeIndex + 1),
      ];
    }

    setTracks(updatedTracks);
  };

  // 100% 줌일 때 1초당 16픽셀 (줌 상태에 따라 비례)
  const pxPerSecond = (timelineZoom / 100) * 16;
  const totalWidth = Math.max(1200, totalDuration * pxPerSecond);
  const playheadLeft = currentTime * pxPerSecond;
  const timelineEnd = Math.max(5, totalDuration);
  const labelInterval = getTimelineLabelInterval(pxPerSecond);
  const majorGridInterval = labelInterval;
  const minorGridInterval = pxPerSecond >= 80 ? 0.1 : Math.max(1, labelInterval / 5);
  const timelineGridStyle = {
    backgroundImage:
      "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: `${pxPerSecond * majorGridInterval}px 100%, ${pxPerSecond * minorGridInterval}px 100%`,
  };

  const timeMarks = useMemo(() => {
    const marks: number[] = [];
    for (let t = 0; t <= timelineEnd; t += labelInterval) {
      marks.push(t);
    }
    return marks;
  }, [labelInterval, timelineEnd]);

  const getClipTrackType = (clipType: string) => {
    if (clipType === "audio") return "audio";
    if (clipType === "text") return "text";
    if (clipType === "subtitle") return "subtitle";
    if (clipType === "visualizer") return "visualizer";
    return "video";
  };

  const resolveNonOverlappingStart = ({
    clipId,
    trackId,
    rawStartTime,
    duration,
  }: {
    clipId: string;
    trackId: string;
    rawStartTime: number;
    duration: number;
  }) => {
    const maxStartTime = Math.max(0, 3600 - duration);
    const clampStart = (value: number) =>
      Number(Math.max(0, Math.min(maxStartTime, value)).toFixed(2));
    const safeRawStart = clampStart(rawStartTime);
    const trackClips = clips
      .filter((clip) => clip.id !== clipId && clip.trackId === trackId)
      .sort((a, b) => a.startTime - b.startTime);

    const snapThresholdSec = 12 / pxPerSecond;
    const snapPoints = [0, currentTime];
    trackClips.forEach((clip) => {
      snapPoints.push(clip.startTime);
      snapPoints.push(clip.startTime + clip.duration);
    });

    let snappedStart = safeRawStart;
    let minDiff = snapThresholdSec;

    snapPoints.forEach((point) => {
      const startAligned = clampStart(point);
      const endAligned = clampStart(point - duration);
      const startDiff = Math.abs(safeRawStart - startAligned);
      const endDiff = Math.abs(safeRawStart - endAligned);

      if (startDiff < minDiff) {
        minDiff = startDiff;
        snappedStart = startAligned;
      }

      if (endDiff < minDiff) {
        minDiff = endDiff;
        snappedStart = endAligned;
      }
    });

    const candidates = [
      safeRawStart,
      snappedStart,
      0,
      currentTime,
      ...trackClips.flatMap((clip) => [
        clip.startTime - duration,
        clip.startTime + clip.duration,
      ]),
    ]
      .map(clampStart)
      .filter(
        (candidate, index, list) =>
          list.indexOf(candidate) === index &&
          trackClips.every(
            (clip) =>
              candidate + duration <= clip.startTime ||
              candidate >= clip.startTime + clip.duration
          )
      );

    if (candidates.length === 0) return snappedStart;

    return candidates.sort(
      (a, b) =>
        Math.abs(a - snappedStart) - Math.abs(b - snappedStart) ||
        Math.abs(a - safeRawStart) - Math.abs(b - safeRawStart)
    )[0];
  };

  const handleDropClip = (
    event: React.DragEvent<HTMLDivElement>,
    targetTrackId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const grabOffsetX = Number(
      event.dataTransfer.getData("clip-grab-offset-x") || "0"
    );
    const dropX = event.clientX - rect.left - grabOffsetX;
    const rawStartTime = Math.max(0, dropX / pxPerSecond);

    const externalFiles = event.dataTransfer.files;
    if (externalFiles && externalFiles.length > 0) {
      addMediaFiles(externalFiles).then((newItems) => {
        if (!newItems || newItems.length === 0) return;
        let currentStart = rawStartTime;
        newItems.forEach((media) => {
          const duration = media.type === "image" ? 5 : media.duration || 10;
          addClipFromMedia(media, {
            trackId: targetTrackId,
            startTime: currentStart,
          });
          currentStart += duration;
        });
      });
      return;
    }

    const clipId = event.dataTransfer.getData("clip-id");
    const mediaId = event.dataTransfer.getData("media-id");

    if (!clipId && mediaId) {
      const media = mediaItems.find((item) => item.id === mediaId);
      if (!media) return;

      addClipFromMedia(media, {
        trackId: targetTrackId,
        startTime: rawStartTime,
      });
      return;
    }

    if (!clipId) return;

    const targetClip = clips.find((clip) => clip.id === clipId);
    if (!targetClip) return;

    const targetTrack = tracks.find((track) => track.id === targetTrackId);
    const expectedTrackType = getClipTrackType(targetClip.type);
    const safeTrackId =
      targetTrack?.type === expectedTrackType ? targetTrackId : targetClip.trackId;

    const nextStartTime = resolveNonOverlappingStart({
      clipId,
      trackId: safeTrackId,
      rawStartTime,
      duration: targetClip.duration,
    });

    updateClipPlacement(clipId, safeTrackId, nextStartTime, targetClip.duration);
    selectClip(clipId);
  };

  const handleDragOverTimelineGrid = (event: React.DragEvent<HTMLDivElement>) => {
    const isFile = event.dataTransfer.types.includes("Files");
    if (isFile) {
      event.preventDefault();
      setIsDraggingOverGrid(true);
    }
  };

  const handleDragLeaveTimelineGrid = () => {
    setIsDraggingOverGrid(false);
  };

  const handleDropTimelineGrid = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    const externalFiles = event.dataTransfer.files;
    if (!externalFiles || externalFiles.length === 0) return;

    event.preventDefault();
    setIsDraggingOverGrid(false);

    const rect = timelineScrollRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scrollLeft = timelineScrollRef.current?.scrollLeft || 0;
    const dropX = event.clientX - rect.left + scrollLeft;
    const rawStartTime = Math.max(0, dropX / pxPerSecond);

    addMediaFiles(externalFiles).then((newItems) => {
      if (!newItems || newItems.length === 0) return;
      let currentStart = rawStartTime;
      newItems.forEach((media) => {
        const duration = media.type === "image" ? 5 : media.duration || 10;
        addClipFromMedia(media, {
          startTime: currentStart,
        });
        currentStart += duration;
      });
    });
  };

  const handleTimelineSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const calculateTime = (clientX: number) => {
      const clickX = clientX - rect.left;
      const rawTime = Math.max(0, Math.min(totalDuration, clickX / pxPerSecond));
      
      const snapThresholdSec = 12 / pxPerSecond;
      const snapPoints = [0, totalDuration];
      clips.forEach((clip) => {
        snapPoints.push(clip.startTime);
        snapPoints.push(clip.startTime + clip.duration);
      });

      let snappedTime = rawTime;
      let minDiff = snapThresholdSec;

      snapPoints.forEach((point) => {
        const diff = Math.abs(rawTime - point);
        if (diff < minDiff) {
          minDiff = diff;
          snappedTime = point;
        }
      });

      if (snappedTime !== rawTime) {
        return Number(snappedTime.toFixed(2));
      }
      return Number((Math.round(rawTime * 10) / 10).toFixed(2));
    };

    const nextTime = calculateTime(event.clientX);
    setCurrentTime(nextTime);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextDragTime = calculateTime(moveEvent.clientX);
      setCurrentTime(nextDragTime);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
  };

  return (
    <div ref={timelineRootRef} className="h-full w-full flex flex-col bg-transparent">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/5 bg-[#202026] px-4">
        <div className="flex items-center gap-2">
          <div className="font-black text-xs text-zinc-300">Timeline</div>
        </div>

        <div className="flex items-center gap-2">
          <TimelineTool icon={Undo2} label="Undo" disabled={!canUndo} onClick={undo} />
          <TimelineTool icon={Redo2} label="Redo" disabled={!canRedo} onClick={redo} />

          <div className="mx-1 h-4 w-px bg-white/10" />

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

          <div 
            className="relative"
            onMouseLeave={() => setShowAddTrackMenu(false)}
          >
            <TimelineTool 
              icon={Plus} 
              label="트랙 추가" 
              onClick={() => setShowAddTrackMenu(!showAddTrackMenu)} 
            />
            {showAddTrackMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded border border-white/10 bg-[#1e1e24] p-1 shadow-lg z-50 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("video");
                    setShowAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  비디오 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("audio");
                    setShowAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  오디오 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("text");
                    setShowAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  텍스트 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("subtitle");
                    setShowAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  자막 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("visualizer");
                    setShowAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  비주얼라이저 트랙 추가
                </button>
              </div>
            )}
          </div>

          <div className="mx-2 h-4 w-px bg-white/10" />

          <button
            type="button"
            onClick={() =>
              setTimelineZoom((value) =>
                clampTimelineZoom(value - getTimelineZoomStep(value))
              )
            }
            className="rounded-md border border-white/10 p-1 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomOut size={13} />
          </button>

          <div className="w-16 text-center text-xs font-bold text-zinc-400">
            {timelineZoom}%
          </div>

          <button
            type="button"
            onClick={() =>
              setTimelineZoom((value) =>
                clampTimelineZoom(value + getTimelineZoomStep(value))
              )
            }
            className="rounded-md border border-white/10 p-1 text-zinc-400 hover:border-cyan-400"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-32px)] min-h-0 bg-[#141418]">
        {/* Left Column: Track Headers */}
        <div
          onWheel={handleHeadersWheel}
          className="w-[190px] shrink-0 border-r border-white/5 bg-[#141418] overflow-hidden flex flex-col h-full select-none"
        >
          {/* Tracks Title Header */}
          <div 
            className="relative h-8 border-b border-white/5 px-3 text-xs font-bold text-zinc-500 shrink-0 bg-[#141418] flex items-center justify-between"
            onMouseLeave={() => setShowLeftAddTrackMenu(false)}
          >
            <span>Tracks</span>
            <button
              type="button"
              onClick={() => setShowLeftAddTrackMenu(!showLeftAddTrackMenu)}
              className="flex items-center gap-0.5 text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition"
            >
              <Plus size={10} />
              <span>Track 추가</span>
            </button>
            
            {showLeftAddTrackMenu && (
              <div className="absolute left-2 top-full mt-1.5 w-36 rounded border border-white/10 bg-[#1e1e24] p-1 shadow-lg z-50 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("video");
                    setShowLeftAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  비디오 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("audio");
                    setShowLeftAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  오디오 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("text");
                    setShowLeftAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  텍스트 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("subtitle");
                    setShowLeftAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  자막 트랙 추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrack("visualizer");
                    setShowLeftAddTrackMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-zinc-300 hover:bg-white/5 hover:text-white font-medium"
                >
                  비주얼라이저 트랙 추가
                </button>
              </div>
            )}
          </div>

          {/* Track Headers Container */}
          <div 
            ref={headersTracksContainerRef}
            className="flex-1 overflow-hidden"
          >
            {tracks.map((track, index) => (
              <div
                key={track.id}
                draggable
                onDragStart={(event) => handleDragTrackStart(event, index)}
                onDragOver={handleDragTrackOver}
                onDrop={(event) => handleDropTrack(event, index)}
                className="group/track flex h-[72px] items-center justify-between border-b border-white/5 px-3 bg-[#141418] cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-2">
                  <div className="text-zinc-600 hover:text-zinc-400 cursor-grab">
                    <GripVertical size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-300 truncate max-w-[90px]" title={track.name}>
                      {track.name}
                    </div>
                    <div className="text-[10px] uppercase text-zinc-600">{track.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-zinc-600">
                  {/* Move Up/Down buttons (visible on hover) */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveTrack(index, "up")}
                    className="hidden group-hover/track:flex p-0.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition disabled:opacity-20 disabled:hover:bg-transparent"
                    title="위로 이동"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={index === tracks.length - 1}
                    onClick={() => handleMoveTrack(index, "down")}
                    className="hidden group-hover/track:flex p-0.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition disabled:opacity-20 disabled:hover:bg-transparent"
                    title="아래로 이동"
                  >
                    <ChevronDown size={13} />
                  </button>

                  {/* Delete track button (visible on hover) */}
                  <button
                    type="button"
                    onClick={() => handleDeleteTrack(track.id)}
                    className="hidden group-hover/track:flex p-1 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded transition animate-pulse"
                    title="트랙 삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                  
                  <button className="p-0.5 hover:text-zinc-400 transition">
                    <Eye size={13} />
                  </button>
                  <button className="p-0.5 hover:text-zinc-400 transition">
                    <Lock size={13} />
                  </button>
                  {track.type === "audio" && (
                    <button className="p-0.5 hover:text-zinc-400 transition">
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline Grid & Clips */}
        <div
          ref={timelineScrollRef}
          onScroll={handleTimelineScroll}
          onDragOver={handleDragOverTimelineGrid}
          onDragLeave={handleDragLeaveTimelineGrid}
          onDrop={handleDropTimelineGrid}
          className={`min-w-0 flex-1 overflow-auto h-full scrollbar-thin scrollbar-thumb-zinc-800 transition-colors duration-200 ${
            isDraggingOverGrid ? "bg-cyan-500/5 ring-1 ring-inset ring-cyan-500/30" : ""
          }`}
        >
          <div
            className="relative min-w-full"
            style={{
              width: `${totalWidth}px`,
            }}
            onPointerDown={handleTimelineSeek}
          >
            {/* 눈금자 헤더 영역 (sticky top) */}
            <div
              className="relative h-8 border-b border-white/5 bg-[#18181c] sticky top-0 z-20 cursor-pointer select-none"
              style={timelineGridStyle}
            >
              <div className="absolute inset-0 text-[10px] text-zinc-500">
                {timeMarks.map((time) => {
                  return (
                    <div
                      key={time}
                      className="absolute h-full border-l border-white/15 px-1.5 leading-8"
                      style={{ left: `${time * pxPerSecond}px` }}
                    >
                      {formatTimelineMark(time)}
                    </div>
                  );
                })}
              </div>

              {/* 플레이헤드 핀 */}
              <div
                className="pointer-events-none absolute top-0 z-30 h-full w-px bg-red-400"
                style={{ left: `${playheadLeft}px` }}
              >
                <div className="-ml-2 h-4 w-4 rounded-md bg-red-400" />
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
                const isDraggingOverTrack = draggingOverTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDraggingOverTrackId(track.id);
                    }}
                    onDragLeave={() => {
                      setDraggingOverTrackId(null);
                    }}
                    onDrop={(event) => {
                      setDraggingOverTrackId(null);
                      handleDropClip(event, track.id);
                    }}
                    className={`relative h-[72px] border-b border-white/5 transition-colors duration-150 ${
                      isDraggingOverTrack
                        ? "bg-cyan-500/15 border-b-cyan-400"
                        : "bg-[#17171d]/10"
                    }`}
                  >
                    {trackClips.length === 0 ? (
                      <div className="flex h-full items-center px-4 text-xs text-zinc-700/70 select-none">
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
      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold transition outline-none disabled:cursor-not-allowed disabled:opacity-30 ${
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
