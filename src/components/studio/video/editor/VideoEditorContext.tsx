"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

import type {
  ExportFps,
  ExportQuality,
  ExportResolution,
  TimelineTrack,
  VideoEditorTab,
} from "./types";

import { DEFAULT_TIMELINE_TRACKS } from "./constants";

export type VideoEditorMediaType = "video" | "image" | "audio";

export type VideoEditorMediaItem = {
  id: string;
  type: VideoEditorMediaType;
  name: string;
  url: string;
  file?: File;
  duration?: number;
  size?: number;
  createdAt: string;
};

export type VideoTextStyle = {
  fontSize: number;
  color: string;
  backgroundColor: string;
  x: number;
  y: number;
  bold: boolean;
  shadow: boolean;
};

export type VideoTransitionType = "none" | "fade" | "zoom" | "slide" | "blur";

export type VideoEditorClip = {
  id: string;
  trackId: string;
  mediaId?: string;
  type: "video" | "image" | "audio" | "text" | "subtitle" | "visualizer";
  name: string;
  startTime: number;
  duration: number;
  left: number;
  width: number;
  color: string;

  trimStart?: number;
  trimEnd?: number;
  volume?: number;
  muted?: boolean;
  textStyle?: VideoTextStyle;
  transitionIn?: VideoTransitionType;
  transitionOut?: VideoTransitionType;
  waveform?: number[];
};

type Snapshot = {
  clips: VideoEditorClip[];
  selectedClipId: string | null;
  currentTime: number;
};

type VideoEditorState = {
  projectTitle: string;
  activeTab: VideoEditorTab;
  mediaItems: VideoEditorMediaItem[];
  tracks: TimelineTrack[];
  clips: VideoEditorClip[];
  selectedMediaId: string | null;
  selectedClipId: string | null;

  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;

  canvasRatio: "16:9" | "9:16" | "1:1";
  canvasZoom: number;

  exportResolution: ExportResolution;
  exportFps: ExportFps;
  exportQuality: ExportQuality;

  canUndo: boolean;
  canRedo: boolean;
};

type VideoEditorActions = {
  setProjectTitle: (value: string) => void;
  setActiveTab: (value: VideoEditorTab) => void;

  addMediaFiles: (files: FileList | File[]) => void;
  removeMediaItem: (id: string) => void;
  selectMedia: (id: string | null) => void;

  addClipFromMedia: (media: VideoEditorMediaItem) => void;
  addTextClip: () => void;
  addSubtitleClip: () => void;

  removeClip: (id: string) => void;
  duplicateClip: (id: string) => void;
  splitClip: (id: string, splitTime?: number) => void;
  selectClip: (id: string | null) => void;

  updateClipName: (id: string, name: string) => void;
  updateClipPosition: (id: string, left: number) => void;
  updateClipDuration: (id: string, duration: number) => void;
  updateClipTime: (id: string, startTime: number, duration: number) => void;
  updateClipTrimStart: (id: string, nextTrimStart: number) => void;
  updateClipTrimEnd: (id: string, nextTrimEnd: number) => void;
  updateClipVolume: (id: string, volume: number) => void;
  toggleClipMute: (id: string) => void;
  updateClipTextStyle: (id: string, patch: Partial<VideoTextStyle>) => void;
  updateClipTransition: (
    id: string,
    target: "in" | "out",
    transition: VideoTransitionType
  ) => void;
  updateClipWaveform: (id: string, waveform: number[]) => void;

  setCurrentTime: (value: number) => void;
  setIsPlaying: (value: boolean) => void;
  togglePlayback: () => void;
  stopPlayback: () => void;

  setCanvasRatio: (value: "16:9" | "9:16" | "1:1") => void;
  setCanvasZoom: (value: number) => void;

  setExportResolution: (value: ExportResolution) => void;
  setExportFps: (value: ExportFps) => void;
  setExportQuality: (value: ExportQuality) => void;

  undo: () => void;
  redo: () => void;

  exportProjectJson: () => string;
  importProjectJson: (jsonText: string) => void;
};

type VideoEditorContextValue = VideoEditorState & VideoEditorActions;

const VideoEditorContext = createContext<VideoEditorContextValue | null>(null);

const TIMELINE_BASE_DURATION = 30;
const MAX_HISTORY = 50;

const DEFAULT_TEXT_STYLE: VideoTextStyle = {
  fontSize: 42,
  color: "#ffffff",
  backgroundColor: "rgba(0,0,0,0.45)",
  x: 50,
  y: 50,
  bold: true,
  shadow: true,
};

const DEFAULT_SUBTITLE_STYLE: VideoTextStyle = {
  fontSize: 30,
  color: "#ffffff",
  backgroundColor: "rgba(0,0,0,0.72)",
  x: 50,
  y: 82,
  bold: true,
  shadow: true,
};

function getMediaType(file: File): VideoEditorMediaType {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

function getDefaultClipColor(type: VideoEditorMediaType | VideoEditorClip["type"]) {
  if (type === "video") return "bg-cyan-400/25";
  if (type === "audio") return "bg-emerald-400/25";
  if (type === "image") return "bg-violet-400/25";
  if (type === "text") return "bg-fuchsia-400/25";
  if (type === "subtitle") return "bg-amber-400/25";
  return "bg-pink-400/25";
}

function getTrackIdByMediaType(type: VideoEditorMediaType) {
  if (type === "audio") return "audio-1";
  return "video-1";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calculateTotalDuration(clips: VideoEditorClip[]) {
  const maxEnd = clips.reduce(
    (max, clip) => Math.max(max, clip.startTime + clip.duration),
    TIMELINE_BASE_DURATION
  );

  return Math.max(TIMELINE_BASE_DURATION, Math.ceil(maxEnd));
}

function leftToTime(left: number) {
  return Number(((left / 100) * TIMELINE_BASE_DURATION).toFixed(2));
}

function durationToWidth(duration: number) {
  return clamp((duration / TIMELINE_BASE_DURATION) * 100, 4, 100);
}

function timeToLeft(startTime: number) {
  return clamp((startTime / TIMELINE_BASE_DURATION) * 100, 0, 100);
}

function normalizeClip(rawClip: VideoEditorClip): VideoEditorClip {
  return {
    ...rawClip,
    trimStart: rawClip.trimStart ?? 0,
    trimEnd: rawClip.trimEnd ?? 0,
    volume: rawClip.volume ?? 1,
    muted: rawClip.muted ?? false,
    transitionIn: rawClip.transitionIn ?? "none",
    transitionOut: rawClip.transitionOut ?? "none",
    textStyle:
      rawClip.textStyle ??
      (rawClip.type === "subtitle"
        ? { ...DEFAULT_SUBTITLE_STYLE }
        : rawClip.type === "text"
          ? { ...DEFAULT_TEXT_STYLE }
          : undefined),
    waveform: rawClip.waveform ?? [],
  };
}

export function VideoEditorProvider({ children }: { children: React.ReactNode }) {
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [activeTab, setActiveTab] = useState<VideoEditorTab>("media");

  const [mediaItems, setMediaItems] = useState<VideoEditorMediaItem[]>([]);
  const [tracks] = useState<TimelineTrack[]>(DEFAULT_TIMELINE_TRACKS);
  const [clips, setClipsState] = useState<VideoEditorClip[]>([]);

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const [currentTime, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [canvasRatio, setCanvasRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [canvasZoom, setCanvasZoomState] = useState(75);

  const [exportResolution, setExportResolution] = useState<ExportResolution>("1080p");
  const [exportFps, setExportFps] = useState<ExportFps>(30);
  const [exportQuality, setExportQuality] = useState<ExportQuality>("standard");

  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);

  const totalDuration = calculateTotalDuration(clips);

  const makeSnapshot = (): Snapshot => ({
    clips,
    selectedClipId,
    currentTime,
  });

  const pushHistory = () => {
    const snapshot = makeSnapshot();
    setUndoStack((prev) => [...prev.slice(-MAX_HISTORY + 1), snapshot]);
    setRedoStack([]);
  };

  const setClipsWithHistory = (
    updater: VideoEditorClip[] | ((prev: VideoEditorClip[]) => VideoEditorClip[])
  ) => {
    pushHistory();

    setClipsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return next.map(normalizeClip);
    });
  };

  const setCurrentTime = (value: number) => {
    setCurrentTimeState(clamp(value, 0, totalDuration));
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTimeState(0);
  };

  const addMediaFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const nextItems: VideoEditorMediaItem[] = fileArray.map((file) => {
      const type = getMediaType(file);

      return {
        id: createId("media"),
        type,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
        size: file.size,
        createdAt: new Date().toISOString(),
      };
    });

    setMediaItems((prev) => [...nextItems, ...prev]);
    if (nextItems[0]) setSelectedMediaId(nextItems[0].id);
  };

  const removeMediaItem = (id: string) => {
    const hasClip = clips.some((clip) => clip.mediaId === id);
    if (hasClip) pushHistory();

    setMediaItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });

    setClipsState((prev) => prev.filter((clip) => clip.mediaId !== id));
    setSelectedMediaId((current) => (current === id ? null : current));
  };

  const addClipFromMedia = (media: VideoEditorMediaItem) => {
    const left = clamp(8 + clips.length * 4, 0, 72);
    const duration = media.type === "image" ? 5 : media.duration || 10;

    const clip: VideoEditorClip = normalizeClip({
      id: createId("clip"),
      trackId: getTrackIdByMediaType(media.type),
      mediaId: media.id,
      type: media.type,
      name: media.name,
      startTime: leftToTime(left),
      duration,
      left,
      width: durationToWidth(duration),
      color: getDefaultClipColor(media.type),
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const addTextClip = () => {
    const left = clamp(12 + clips.length * 3, 0, 80);
    const duration = 5;

    const clip: VideoEditorClip = normalizeClip({
      id: createId("text"),
      trackId: "text-1",
      type: "text",
      name: "새 텍스트",
      startTime: leftToTime(left),
      duration,
      left,
      width: durationToWidth(duration),
      color: getDefaultClipColor("text"),
      textStyle: { ...DEFAULT_TEXT_STYLE },
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const addSubtitleClip = () => {
    const left = clamp(16 + clips.length * 3, 0, 76);
    const duration = 5;

    const clip: VideoEditorClip = normalizeClip({
      id: createId("subtitle"),
      trackId: "subtitle-1",
      type: "subtitle",
      name: "새 자막입니다",
      startTime: leftToTime(left),
      duration,
      left,
      width: durationToWidth(duration),
      color: getDefaultClipColor("subtitle"),
      textStyle: { ...DEFAULT_SUBTITLE_STYLE },
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const removeClip = (id: string) => {
    setClipsWithHistory((prev) => prev.filter((clip) => clip.id !== id));
    setSelectedClipId((current) => (current === id ? null : current));
  };

  const duplicateClip = (id: string) => {
    const target = clips.find((clip) => clip.id === id);
    if (!target) return;

    const nextLeft = clamp(target.left + target.width + 2, 0, 100 - target.width);

    const duplicated: VideoEditorClip = normalizeClip({
      ...target,
      id: createId("clip-copy"),
      name: `${target.name} 복사본`,
      left: nextLeft,
      startTime: leftToTime(nextLeft),
    });

    setClipsWithHistory((prev) => [...prev, duplicated]);
    setSelectedClipId(duplicated.id);
  };

  const splitClip = (id: string, splitTime?: number) => {
    const target = clips.find((clip) => clip.id === id);
    if (!target || target.duration <= 1) return;

    const splitOffset =
      typeof splitTime === "number"
        ? clamp(splitTime - target.startTime, 0.5, target.duration - 0.5)
        : target.duration / 2;

    const firstDuration = Number(splitOffset.toFixed(2));
    const secondDuration = Number((target.duration - firstDuration).toFixed(2));

    if (firstDuration < 0.5 || secondDuration < 0.5) return;

    const firstWidth = durationToWidth(firstDuration);
    const secondWidth = durationToWidth(secondDuration);
    const secondStartTime = Number((target.startTime + firstDuration).toFixed(2));
    const secondLeft = timeToLeft(secondStartTime);

    const firstClip: VideoEditorClip = normalizeClip({
      ...target,
      duration: firstDuration,
      width: firstWidth,
      trimEnd: target.trimEnd,
      name: `${target.name} A`,
    });

    const secondClip: VideoEditorClip = normalizeClip({
      ...target,
      id: createId("clip-split"),
      name: `${target.name} B`,
      startTime: secondStartTime,
      duration: secondDuration,
      left: secondLeft,
      width: clamp(secondWidth, 4, 100 - secondLeft),
    });

    setClipsWithHistory((prev) =>
      prev.map((clip) => (clip.id === id ? firstClip : clip)).concat(secondClip)
    );

    setSelectedClipId(secondClip.id);
  };

  const updateClipName = (id: string, name: string) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => (clip.id === id ? normalizeClip({ ...clip, name }) : clip))
    );
  };

  const updateClipPosition = (id: string, left: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeLeft = clamp(left, 0, 100 - clip.width);

        return normalizeClip({
          ...clip,
          left: safeLeft,
          startTime: leftToTime(safeLeft),
        });
      })
    );
  };

  const updateClipDuration = (id: string, duration: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeDuration = clamp(duration, 0.5, TIMELINE_BASE_DURATION);
        const nextWidth = durationToWidth(safeDuration);

        return normalizeClip({
          ...clip,
          duration: safeDuration,
          width: clamp(nextWidth, 4, 100 - clip.left),
        });
      })
    );
  };

  const updateClipTime = (id: string, startTime: number, duration: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeStart = clamp(startTime, 0, TIMELINE_BASE_DURATION);
        const safeDuration = clamp(duration, 0.5, TIMELINE_BASE_DURATION);
        const left = timeToLeft(safeStart);
        const width = clamp(durationToWidth(safeDuration), 4, 100 - left);

        return normalizeClip({
          ...clip,
          startTime: Number(safeStart.toFixed(2)),
          duration: Number(safeDuration.toFixed(2)),
          left,
          width,
        });
      })
    );
  };

  const updateClipTrimStart = (id: string, nextTrimStart: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const trimStart = clamp(nextTrimStart, 0, Math.max(0, clip.duration - 0.5));

        return normalizeClip({
          ...clip,
          trimStart,
        });
      })
    );
  };

  const updateClipTrimEnd = (id: string, nextTrimEnd: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const trimEnd = clamp(nextTrimEnd, 0, Math.max(0, clip.duration - 0.5));

        return normalizeClip({
          ...clip,
          trimEnd,
        });
      })
    );
  };

  const updateClipVolume = (id: string, volume: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) =>
        clip.id === id ? normalizeClip({ ...clip, volume: clamp(volume, 0, 2) }) : clip
      )
    );
  };

  const toggleClipMute = (id: string) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) =>
        clip.id === id ? normalizeClip({ ...clip, muted: !clip.muted }) : clip
      )
    );
  };

  const updateClipTextStyle = (id: string, patch: Partial<VideoTextStyle>) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const fallback =
          clip.type === "subtitle" ? DEFAULT_SUBTITLE_STYLE : DEFAULT_TEXT_STYLE;

        return normalizeClip({
          ...clip,
          textStyle: {
            ...fallback,
            ...(clip.textStyle ?? {}),
            ...patch,
          },
        });
      })
    );
  };

  const updateClipTransition = (
    id: string,
    target: "in" | "out",
    transition: VideoTransitionType
  ) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) =>
        clip.id === id
          ? normalizeClip({
            ...clip,
            ...(target === "in"
              ? { transitionIn: transition }
              : { transitionOut: transition }),
          })
          : clip
      )
    );
  };

  const updateClipWaveform = (id: string, waveform: number[]) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) =>
        clip.id === id ? normalizeClip({ ...clip, waveform }) : clip
      )
    );
  };

  const setCanvasZoom = (value: number) => {
    setCanvasZoomState(clamp(value, 25, 150));
  };

  const undo = () => {
    const previous = undoStack[undoStack.length - 1];
    if (!previous) return;

    const current = makeSnapshot();

    setRedoStack((prev) => [...prev.slice(-MAX_HISTORY + 1), current]);
    setUndoStack((prev) => prev.slice(0, -1));

    setClipsState(previous.clips.map(normalizeClip));
    setSelectedClipId(previous.selectedClipId);
    setCurrentTimeState(previous.currentTime);
  };

  const redo = () => {
    const next = redoStack[redoStack.length - 1];
    if (!next) return;

    const current = makeSnapshot();

    setUndoStack((prev) => [...prev.slice(-MAX_HISTORY + 1), current]);
    setRedoStack((prev) => prev.slice(0, -1));

    setClipsState(next.clips.map(normalizeClip));
    setSelectedClipId(next.selectedClipId);
    setCurrentTimeState(next.currentTime);
  };

  const exportProjectJson = () => {
    return JSON.stringify(
      {
        version: "creaibox-video-editor-v2",
        projectTitle,
        activeTab,
        mediaItems: mediaItems.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          duration: item.duration,
          size: item.size,
          createdAt: item.createdAt,
        })),
        clips,
        canvasRatio,
        canvasZoom,
        exportResolution,
        exportFps,
        exportQuality,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const importProjectJson = (jsonText: string) => {
    const parsed = JSON.parse(jsonText);

    if (
      parsed.version !== "creaibox-video-editor-v1" &&
      parsed.version !== "creaibox-video-editor-v2"
    ) {
      throw new Error("지원하지 않는 프로젝트 파일입니다.");
    }

    pushHistory();

    setProjectTitle(parsed.projectTitle || "Untitled Project");
    setActiveTab(parsed.activeTab || "media");
    setClipsState(Array.isArray(parsed.clips) ? parsed.clips.map(normalizeClip) : []);
    setCanvasRatio(parsed.canvasRatio || "16:9");
    setCanvasZoomState(parsed.canvasZoom || 75);
    setExportResolution(parsed.exportResolution || "1080p");
    setExportFps(parsed.exportFps || 30);
    setExportQuality(parsed.exportQuality || "standard");
    setSelectedClipId(null);
    setSelectedMediaId(null);

    window.alert(
      "프로젝트 구조를 불러왔습니다. 단, 브라우저 보안상 기존 미디어 파일은 다시 업로드해야 합니다."
    );
  };

  const value = useMemo<VideoEditorContextValue>(
    () => ({
      projectTitle,
      activeTab,
      mediaItems,
      tracks,
      clips,
      selectedMediaId,
      selectedClipId,
      currentTime,
      totalDuration,
      isPlaying,
      canvasRatio,
      canvasZoom,
      exportResolution,
      exportFps,
      exportQuality,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,

      setProjectTitle,
      setActiveTab,

      addMediaFiles,
      removeMediaItem,
      selectMedia: setSelectedMediaId,

      addClipFromMedia,
      addTextClip,
      addSubtitleClip,

      removeClip,
      duplicateClip,
      splitClip,
      selectClip: setSelectedClipId,

      updateClipName,
      updateClipPosition,
      updateClipDuration,
      updateClipTime,
      updateClipTrimStart,
      updateClipTrimEnd,
      updateClipVolume,
      toggleClipMute,
      updateClipTextStyle,
      updateClipTransition,
      updateClipWaveform,

      setCurrentTime,
      setIsPlaying,
      togglePlayback,
      stopPlayback,

      setCanvasRatio,
      setCanvasZoom,

      setExportResolution,
      setExportFps,
      setExportQuality,

      undo,
      redo,

      exportProjectJson,
      importProjectJson,
    }),
    [
      projectTitle,
      activeTab,
      mediaItems,
      tracks,
      clips,
      selectedMediaId,
      selectedClipId,
      currentTime,
      totalDuration,
      isPlaying,
      canvasRatio,
      canvasZoom,
      exportResolution,
      exportFps,
      exportQuality,
      undoStack,
      redoStack,
    ]
  );

  return (
    <VideoEditorContext.Provider value={value}>
      {children}
    </VideoEditorContext.Provider>
  );
}

export function useVideoEditor() {
  const context = useContext(VideoEditorContext);

  if (!context) {
    throw new Error("useVideoEditor must be used inside VideoEditorProvider");
  }

  return context;
}