"use client";

import React, { createContext, useContext, useEffect, useCallback, useMemo, useState } from "react";

import type {
  ExportFps,
  ExportQuality,
  ExportResolution,
  TimelineTrack,
  TimelineTrackType,
  VideoEditorTab,
} from "./types";

import { DEFAULT_TIMELINE_TRACKS } from "./constants";

const DB_NAME = "creaibox-video-editor-db";
const STORE_NAME = "media-files";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveFileToCache(id: string, file: File): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB save failed:", e);
  }
}

async function getFileFromCache(id: string): Promise<File | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB load failed:", e);
    return null;
  }
}

async function deleteFileFromCache(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB delete failed:", e);
  }
}

export type VideoEditorMediaType = "video" | "image" | "audio";
export type CanvasRatio = "16:9" | "9:16" | "1:1" | "4:5" | "5:4" | "21:9" | "4:3";

export type VideoEditorMediaItem = {
  id: string;
  type: VideoEditorMediaType;
  name: string;
  url: string;
  file?: File;
  duration?: number;
  size?: number;
  createdAt: string;
  thumbnailUrl?: string;
  waveform?: number[];
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

export type VideoBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

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

  // Audio Mixer
  fadeIn?: number;
  fadeOut?: number;
  audioGain?: number;
  audioPan?: number;

  // Motion
  motionX?: number;
  motionY?: number;
  motionWidth?: number;
  motionHeight?: number;
  flipX?: boolean;
  flipY?: boolean;
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  cropLeft?: number;
  anchorX?: number;
  anchorY?: number;

  scale?: number;
  rotation?: number;
  opacity?: number;

  // Effects
  brightness?: number;
  contrast?: number;
  saturation?: number;

  blur?: number;
  grayscale?: number;
  sepia?: number;

  glow?: boolean;
  neon?: boolean;

  // Text
  textStyle?: VideoTextStyle;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  textGlow?: boolean;
  textOpacity?: number;
  textAnimation?: string;

  // Transition
  transitionIn?: VideoTransitionType;
  transitionOut?: VideoTransitionType;

  waveform?: number[];
  blendMode?: VideoBlendMode;
};

type Snapshot = {
  tracks: TimelineTrack[];
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

  canvasRatio: CanvasRatio;
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
  addVisualizerClip: () => void;

  removeClip: (id: string) => void;
  duplicateClip: (id: string) => void;
  copyClip: (id: string) => void;
  pasteClip: (startTime?: number) => void;
  splitClip: (id: string, splitTime?: number) => void;
  selectClip: (id: string | null) => void;

  updateClip: (id: string, patch: Partial<VideoEditorClip>) => void;
  updateClipName: (id: string, name: string) => void;
  updateClipPosition: (id: string, left: number) => void;
  updateClipDuration: (id: string, duration: number) => void;
  updateClipTime: (id: string, startTime: number, duration: number) => void;
  updateClipPlacement: (
    id: string,
    trackId: string,
    startTime: number,
    duration: number
  ) => void;
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

  setCanvasRatio: (value: CanvasRatio) => void;
  setCanvasZoom: (value: number) => void;

  setExportResolution: (value: ExportResolution) => void;
  setExportFps: (value: ExportFps) => void;
  setExportQuality: (value: ExportQuality) => void;

  undo: () => void;
  redo: () => void;

  exportProjectJson: () => string;
  importProjectJson: (jsonText: string) => void;
  relinkMediaFile: (id: string, file: File) => void;
};

type VideoEditorContextValue = VideoEditorState & VideoEditorActions;

const VideoEditorContext = createContext<VideoEditorContextValue | null>(null);

const TIMELINE_BASE_DURATION = 3600;
const MIN_TIMELINE_DURATION = 30;
const MAX_HISTORY = 50;
const DEFAULT_CANVAS_ZOOM = 100;
const LEGACY_DEFAULT_CANVAS_ZOOM = 75;

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

function getTrackTypeByClipType(type: VideoEditorClip["type"]): TimelineTrackType {
  if (type === "audio") return "audio";
  if (type === "text") return "text";
  if (type === "subtitle") return "subtitle";
  if (type === "visualizer") return "visualizer";
  return "video";
}

function getTrackColor(type: TimelineTrackType) {
  if (type === "video") return "bg-cyan-400/25";
  if (type === "audio") return "bg-emerald-400/25";
  if (type === "text") return "bg-violet-400/25";
  if (type === "subtitle") return "bg-amber-400/25";
  if (type === "visualizer") return "bg-pink-400/25";
  return "bg-white/10";
}

function getTrackName(type: TimelineTrackType, index: number) {
  if (type === "video") return `Video Track ${index}`;
  if (type === "audio") return `Audio Track ${index}`;
  if (type === "text") return `Text Track ${index}`;
  if (type === "subtitle") return `Subtitle Track ${index}`;
  if (type === "visualizer") return `Visualizer Track ${index}`;
  return `Track ${index}`;
}

function createTrack(type: TimelineTrackType, index: number): TimelineTrack {
  return {
    id: `${type}-${index}`,
    name: getTrackName(type, index),
    type,
    color: getTrackColor(type),
  };
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

function getInitialCanvasZoom(value: unknown) {
  if (typeof value !== "number") return DEFAULT_CANVAS_ZOOM;
  if (value === LEGACY_DEFAULT_CANVAS_ZOOM) return DEFAULT_CANVAS_ZOOM;
  return value;
}

function calculateTotalDuration(clips: VideoEditorClip[]) {
  const maxEnd = clips.reduce(
    (max, clip) => Math.max(max, clip.startTime + clip.duration),
    MIN_TIMELINE_DURATION
  );

  return Math.max(MIN_TIMELINE_DURATION, Math.ceil(maxEnd));
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

function intervalsOverlap(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
) {
  const endA = startA + durationA;
  const endB = startB + durationB;
  return startA < endB && endA > startB;
}

function hasTrackOverlap(
  clips: VideoEditorClip[],
  clipId: string,
  trackId: string,
  startTime: number,
  duration: number
) {
  return clips.some(
    (clip) =>
      clip.id !== clipId &&
      clip.trackId === trackId &&
      intervalsOverlap(startTime, duration, clip.startTime, clip.duration)
  );
}

function resolveNonOverlappingStart(
  clips: VideoEditorClip[],
  clipId: string,
  trackId: string,
  startTime: number,
  duration: number
) {
  const maxStart = Math.max(0, TIMELINE_BASE_DURATION - duration);
  const clampStart = (value: number) =>
    Number(clamp(value, 0, maxStart).toFixed(2));
  const safeStart = clampStart(startTime);

  if (!hasTrackOverlap(clips, clipId, trackId, safeStart, duration)) {
    return safeStart;
  }

  const trackClips = clips
    .filter((clip) => clip.id !== clipId && clip.trackId === trackId)
    .sort((a, b) => a.startTime - b.startTime);
  const candidates = [
    0,
    safeStart,
    ...trackClips.flatMap((clip) => [
      clip.startTime - duration,
      clip.startTime + clip.duration,
    ]),
  ]
    .map(clampStart)
    .filter(
      (candidate, index, list) =>
        list.indexOf(candidate) === index &&
        !hasTrackOverlap(clips, clipId, trackId, candidate, duration)
    );

  if (candidates.length === 0) return safeStart;

  return candidates.sort((a, b) => Math.abs(a - safeStart) - Math.abs(b - safeStart))[0];
}

function clampDurationToTrackGap(
  clips: VideoEditorClip[],
  clipId: string,
  trackId: string,
  startTime: number,
  duration: number
) {
  const nextClip = clips
    .filter((clip) => clip.id !== clipId && clip.trackId === trackId)
    .sort((a, b) => a.startTime - b.startTime)
    .find((clip) => clip.startTime >= startTime);
  const maxDuration = nextClip
    ? Math.max(0.5, nextClip.startTime - startTime)
    : TIMELINE_BASE_DURATION - startTime;

  return clamp(duration, 0.5, maxDuration);
}

function clampStartToPreviousTrackGap(
  clips: VideoEditorClip[],
  clipId: string,
  trackId: string,
  startTime: number
) {
  const previousClip = clips
    .filter((clip) => clip.id !== clipId && clip.trackId === trackId)
    .sort((a, b) => b.startTime - a.startTime)
    .find((clip) => clip.startTime + clip.duration <= startTime);

  if (!previousClip) return clamp(startTime, 0, TIMELINE_BASE_DURATION);

  return clamp(startTime, previousClip.startTime + previousClip.duration, TIMELINE_BASE_DURATION);
}

function normalizeClip(rawClip: VideoEditorClip): VideoEditorClip {
  return {
    ...rawClip,

    trimStart: rawClip.trimStart ?? 0,
    trimEnd: rawClip.trimEnd ?? 0,

    volume: rawClip.volume ?? 1,
    muted: rawClip.muted ?? false,

    fadeIn: rawClip.fadeIn ?? 0,
    fadeOut: rawClip.fadeOut ?? 0,

    audioGain: rawClip.audioGain ?? 1,
    audioPan: rawClip.audioPan ?? 0,

    motionX: rawClip.motionX ?? 50,
    motionY: rawClip.motionY ?? 50,

    motionWidth: rawClip.motionWidth ?? 100,
    motionHeight: rawClip.motionHeight ?? 100,
    flipX: rawClip.flipX ?? false,
    flipY: rawClip.flipY ?? false,
    cropTop: rawClip.cropTop ?? 0,
    cropRight: rawClip.cropRight ?? 0,
    cropBottom: rawClip.cropBottom ?? 0,
    cropLeft: rawClip.cropLeft ?? 0,
    anchorX: rawClip.anchorX ?? 50,
    anchorY: rawClip.anchorY ?? 50,

    scale: rawClip.scale ?? 1,
    rotation: rawClip.rotation ?? 0,
    opacity: rawClip.opacity ?? 1,

    brightness: rawClip.brightness ?? 1,
    contrast: rawClip.contrast ?? 1,
    saturation: rawClip.saturation ?? 1,

    blur: rawClip.blur ?? 0,
    grayscale: rawClip.grayscale ?? 0,
    sepia: rawClip.sepia ?? 0,

    glow: rawClip.glow ?? false,
    neon: rawClip.neon ?? false,

    blendMode: rawClip.blendMode ?? "normal",

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
  const [tracks, setTracks] = useState<TimelineTrack[]>(DEFAULT_TIMELINE_TRACKS);
  const [clips, setClipsState] = useState<VideoEditorClip[]>([]);

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const [currentTime, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [canvasRatio, setCanvasRatio] = useState<CanvasRatio>("16:9");
  const [canvasZoom, setCanvasZoomState] = useState(DEFAULT_CANVAS_ZOOM);

  const [exportResolution, setExportResolution] = useState<ExportResolution>("1080p");
  const [exportFps, setExportFps] = useState<ExportFps>(30);
  const [exportQuality, setExportQuality] = useState<ExportQuality>("standard");

  const [undoStack, setUndoStack] = useState<Snapshot[]>([]);
  const [redoStack, setRedoStack] = useState<Snapshot[]>([]);
  const [copiedClip, setCopiedClip] = useState<VideoEditorClip | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalDuration = calculateTotalDuration(clips);

  const makeSnapshot = (): Snapshot => ({
    tracks,
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

async function extractAudioWaveform(file: File, points = 60): Promise<number[]> {
  try {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      throw new Error("AudioContext not supported");
    }

    const audioCtx = new AudioContextConstructor();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);

    const step = Math.floor(channelData.length / points);
    const waveform: number[] = [];

    for (let i = 0; i < points; i++) {
      let max = 0;
      const start = i * step;
      const end = start + step;
      for (let j = start; j < end; j++) {
        const val = Math.abs(channelData[j]);
        if (val > max) max = val;
      }
      waveform.push(Number(max.toFixed(3)));
    }

    const peak = Math.max(...waveform) || 1.0;
    const normalized = waveform.map((v) =>
      Number(Math.max(0.1, v / peak).toFixed(3))
    );

    await audioCtx.close();
    return normalized;
  } catch (e) {
    console.error("Audio waveform analysis failed:", e);
    return Array.from({ length: points }, () =>
      Number((0.15 + Math.random() * 0.85).toFixed(3))
    );
  }
}

function getVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, video.duration / 2 || 0.5);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 120;
        canvas.height = 68;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
          resolve(dataUrl);
        } else {
          resolve("");
        }
      } catch (e) {
        console.error("Thumbnail extraction failed:", e);
        resolve("");
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };

    video.src = url;
  });
}

function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const type = file.type;
    const url = URL.createObjectURL(file);
    if (type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(10); // 기본값 fallback
      };
      video.src = url;
    } else if (type.startsWith("audio/")) {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(10); // 기본값 fallback
      };
      audio.src = url;
    } else {
      resolve(5); // 이미지 등은 기본 5초
    }
  });
}

  const addMediaFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const nextItems: VideoEditorMediaItem[] = await Promise.all(
      fileArray.map(async (file) => {
        const type = getMediaType(file);
        const duration = await getMediaDuration(file);
        const mediaId = createId("media");

        // Save to IndexedDB
        await saveFileToCache(mediaId, file);

        let thumbnailUrl = "";
        let waveform: number[] = [];

        if (type === "image") {
          thumbnailUrl = URL.createObjectURL(file);
        } else if (type === "video") {
          thumbnailUrl = await getVideoThumbnail(file);
        } else if (type === "audio") {
          waveform = await extractAudioWaveform(file);
        }

        return {
          id: mediaId,
          type,
          name: file.name,
          url: URL.createObjectURL(file),
          file,
          duration,
          size: file.size,
          createdAt: new Date().toISOString(),
          thumbnailUrl,
          waveform,
        };
      })
    );

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

    // Delete from IndexedDB
    void deleteFileFromCache(id);

    setClipsState((prev) => prev.filter((clip) => clip.mediaId !== id));
    setSelectedMediaId((current) => (current === id ? null : current));
  };

  const relinkMediaFile = useCallback(async (id: string, file: File) => {
    const type = getMediaType(file);
    const newUrl = URL.createObjectURL(file);

    // Save to IndexedDB
    await saveFileToCache(id, file);

    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              type,
              name: file.name,
              url: newUrl,
              file,
              size: file.size,
            }
          : item
      )
    );
  }, []);

  // 1. Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreProject = async () => {
      try {
        const saved = localStorage.getItem("creaibox-video-editor-autosave");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.projectTitle) setProjectTitle(parsed.projectTitle);
          if (parsed.activeTab) setActiveTab(parsed.activeTab);
          if (parsed.canvasRatio) setCanvasRatio(parsed.canvasRatio);
          setCanvasZoomState(getInitialCanvasZoom(parsed.canvasZoom));
          if (parsed.exportResolution) setExportResolution(parsed.exportResolution);
          if (parsed.exportFps) setExportFps(parsed.exportFps);
          if (parsed.exportQuality) setExportQuality(parsed.exportQuality);

          if (Array.isArray(parsed.mediaItems)) {
            const restoredMedia = await Promise.all(
              parsed.mediaItems.map(async (item: VideoEditorMediaItem) => {
                const isLocal = !item.url || item.url.startsWith("blob:");
                if (isLocal) {
                  const cachedFile = await getFileFromCache(item.id);
                  if (cachedFile) {
                    return {
                      ...item,
                      url: URL.createObjectURL(cachedFile),
                      file: cachedFile,
                    };
                  }
                }
                return {
                  ...item,
                  url: item.url && !item.url.startsWith("blob:") ? item.url : "",
                };
              })
            );
            setMediaItems(restoredMedia);
          }

          if (Array.isArray(parsed.clips)) {
            setClipsState(parsed.clips.map(normalizeClip));
          }

          if (Array.isArray(parsed.tracks) && parsed.tracks.length > 0) {
            setTracks(parsed.tracks);
          }
        }
      } catch (e) {
        console.error("Failed to load autosave:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    void restoreProject();
  }, []);

  // 2. Save to localStorage when state changes (only after isLoaded is true)
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === "undefined") return;

    try {
      const stateToSave = {
        projectTitle,
        activeTab,
        canvasRatio,
        canvasZoom,
        exportResolution,
        exportFps,
        exportQuality,
        tracks,
        mediaItems: mediaItems.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          url: item.url.startsWith("blob:") ? "" : item.url,
          duration: item.duration,
          size: item.size,
          createdAt: item.createdAt,
          thumbnailUrl: item.thumbnailUrl,
        })),
        clips,
      };
      localStorage.setItem("creaibox-video-editor-autosave", JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [
    isLoaded,
    projectTitle,
    activeTab,
    canvasRatio,
    canvasZoom,
    exportResolution,
    exportFps,
    exportQuality,
    mediaItems,
    clips,
    tracks,
  ]);

  const addClipFromMedia = (media: VideoEditorMediaItem) => {
    // Automatically register media to mediaItems if not already registered (e.g., from Stock Panel)
    setMediaItems((prev) => {
      if (!prev.some((item) => item.id === media.id)) {
        const itemWithThumbnail = {
          ...media,
          thumbnailUrl: media.thumbnailUrl || (media.type === "image" ? media.url : ""),
        };
        return [itemWithThumbnail, ...prev];
      }
      return prev;
    });

    const duration = media.type === "image" ? 5 : media.duration || 10;
    const startTime = Number(currentTime.toFixed(2));

    const clip: VideoEditorClip = normalizeClip({
      id: createId("clip"),
      trackId: getTrackIdByMediaType(media.type),
      mediaId: media.id,
      type: media.type,
      name: media.name,
      startTime,
      duration,
      left: 0,
      width: 0,
      color: getDefaultClipColor(media.type),
      waveform: media.waveform,
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const addTextClip = () => {
    const duration = 5;
    const startTime = Number(currentTime.toFixed(2));

    const clip: VideoEditorClip = normalizeClip({
      id: createId("text"),
      trackId: "text-1",
      type: "text",
      name: "새 텍스트",
      startTime,
      duration,
      left: 0,
      width: 0,
      color: getDefaultClipColor("text"),
      textStyle: { ...DEFAULT_TEXT_STYLE },
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const addSubtitleClip = () => {
    const duration = 5;
    const startTime = Number(currentTime.toFixed(2));

    const clip: VideoEditorClip = normalizeClip({
      id: createId("subtitle"),
      trackId: "subtitle-1",
      type: "subtitle",
      name: "새 자막입니다",
      startTime,
      duration,
      left: 0,
      width: 0,
      color: getDefaultClipColor("subtitle"),
      textStyle: { ...DEFAULT_SUBTITLE_STYLE },
    });

    setClipsWithHistory((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const addVisualizerClip = () => {
    const duration = 10;
    const startTime = Number(currentTime.toFixed(2));

    const clip: VideoEditorClip = normalizeClip({
      id: createId("visualizer"),
      trackId: "video-1",
      type: "visualizer",
      name: "오디오 비주얼라이저",
      startTime,
      duration,
      left: 0,
      width: 0,
      color: getDefaultClipColor("visualizer"),
      transitionIn: "fade",
      transitionOut: "fade",
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

  const copyClip = (id: string) => {
    const target = clips.find((clip) => clip.id === id);
    if (!target) return;

    setCopiedClip(normalizeClip({ ...target }));
  };

  const pasteClip = (startTime?: number) => {
    if (!copiedClip) return;

    const maxStartTime = Math.max(0, TIMELINE_BASE_DURATION - copiedClip.duration);
    const safeStartTime =
      typeof startTime === "number"
        ? clamp(startTime, 0, maxStartTime)
        : clamp(currentTime, 0, maxStartTime);
    const left = timeToLeft(safeStartTime);
    const trackType = getTrackTypeByClipType(copiedClip.type);
    const sameTypeTracks = tracks.filter((track) => track.type === trackType);
    const availableTrack = sameTypeTracks.find((track) =>
      clips.every(
        (clip) =>
          clip.trackId !== track.id ||
          !intervalsOverlap(
            safeStartTime,
            copiedClip.duration,
            clip.startTime,
            clip.duration
          )
      )
    );
    const targetTrack =
      availableTrack ?? createTrack(trackType, sameTypeTracks.length + 1);

    if (!availableTrack) {
      setTracks((prev) => {
        const insertAfterIndex = prev.reduce(
          (lastIndex, track, index) =>
            track.type === trackType ? index : lastIndex,
          -1
        );

        if (insertAfterIndex < 0) return [...prev, targetTrack];

        return [
          ...prev.slice(0, insertAfterIndex + 1),
          targetTrack,
          ...prev.slice(insertAfterIndex + 1),
        ];
      });
    }

    const width = clamp(
      copiedClip.width || durationToWidth(copiedClip.duration),
      4,
      100 - left
    );

    const pasted: VideoEditorClip = normalizeClip({
      ...copiedClip,
      id: createId("clip-paste"),
      trackId: targetTrack.id,
      name: `${copiedClip.name} 복사본`,
      startTime: Number(safeStartTime.toFixed(2)),
      left,
      width,
    });

    setClipsWithHistory((prev) => [...prev, pasted]);
    setSelectedClipId(pasted.id);
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

  const updateClip = (id: string, patch: Partial<VideoEditorClip>) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) =>
        clip.id === id ? normalizeClip({ ...clip, ...patch }) : clip
      )
    );
  };

  const updateClipName = (id: string, name: string) => {
    updateClip(id, { name });
  };

  const updateClipPosition = (id: string, left: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeLeft = clamp(left, 0, 100 - clip.width);
        const safeStart = resolveNonOverlappingStart(
          prev,
          clip.id,
          clip.trackId,
          leftToTime(safeLeft),
          clip.duration
        );

        return normalizeClip({
          ...clip,
          left: timeToLeft(safeStart),
          startTime: safeStart,
        });
      })
    );
  };

  const updateClipDuration = (id: string, duration: number) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          clip.trackId,
          clip.startTime,
          duration
        );
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

        const requestedStart = clamp(startTime, 0, TIMELINE_BASE_DURATION);
        const safeStart = clampStartToPreviousTrackGap(
          prev,
          clip.id,
          clip.trackId,
          requestedStart
        );
        const requestedEnd = requestedStart + duration;
        const requestedDuration = Math.max(0.5, requestedEnd - safeStart);
        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          clip.trackId,
          safeStart,
          requestedDuration
        );
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

  const updateClipPlacement = (
    id: string,
    trackId: string,
    startTime: number,
    duration: number
  ) => {
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          trackId,
          startTime,
          duration
        );
        const safeStart = resolveNonOverlappingStart(
          prev,
          clip.id,
          trackId,
          startTime,
          safeDuration
        );
        const left = timeToLeft(safeStart);
        const width = clamp(durationToWidth(safeDuration), 4, 100 - left);

        return normalizeClip({
          ...clip,
          trackId,
          startTime: Number(safeStart.toFixed(2)),
          duration: Number(safeDuration.toFixed(2)),
          left,
          width,
        });
      })
    );
  };

  const updateClipTrimStart = (id: string, nextTrimStart: number) => {
    updateClip(id, {
      trimStart: clamp(nextTrimStart, 0, TIMELINE_BASE_DURATION),
    });
  };

  const updateClipTrimEnd = (id: string, nextTrimEnd: number) => {
    updateClip(id, {
      trimEnd: clamp(nextTrimEnd, 0, TIMELINE_BASE_DURATION),
    });
  };

  const updateClipVolume = (id: string, volume: number) => {
    updateClip(id, { volume: clamp(volume, 0, 2) });
  };

  const toggleClipMute = (id: string) => {
    const target = clips.find((clip) => clip.id === id);
    updateClip(id, { muted: !(target?.muted ?? false) });
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
    updateClip(
      id,
      target === "in"
        ? { transitionIn: transition }
        : { transitionOut: transition }
    );
  };

  const updateClipWaveform = (id: string, waveform: number[]) => {
    updateClip(id, { waveform });
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

    setTracks(previous.tracks);
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

    setTracks(next.tracks);
    setClipsState(next.clips.map(normalizeClip));
    setSelectedClipId(next.selectedClipId);
    setCurrentTimeState(next.currentTime);
  };

  const exportProjectJson = () => {
    return JSON.stringify(
      {
        version: "creaibox-video-editor-v3",
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
        tracks,
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
      parsed.version !== "creaibox-video-editor-v2" &&
      parsed.version !== "creaibox-video-editor-v3"
    ) {
      throw new Error("지원하지 않는 프로젝트 파일입니다.");
    }

    pushHistory();

    setProjectTitle(parsed.projectTitle || "Untitled Project");
    setActiveTab(parsed.activeTab || "media");
    setTracks(
      Array.isArray(parsed.tracks) && parsed.tracks.length > 0
        ? parsed.tracks
        : DEFAULT_TIMELINE_TRACKS
    );
    setClipsState(Array.isArray(parsed.clips) ? parsed.clips.map(normalizeClip) : []);
    setCanvasRatio(parsed.canvasRatio || "16:9");
    setCanvasZoomState(getInitialCanvasZoom(parsed.canvasZoom));
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
      addVisualizerClip,

      removeClip,
      duplicateClip,
      copyClip,
      pasteClip,
      splitClip,
      selectClip: setSelectedClipId,

      updateClip,
      updateClipName,
      updateClipPosition,
      updateClipDuration,
      updateClipTime,
      updateClipPlacement,
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
      relinkMediaFile,
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
      copiedClip,
      relinkMediaFile,
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
