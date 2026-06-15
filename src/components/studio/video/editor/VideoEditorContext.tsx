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
import type { SubtitleImportCue } from "./subtitle/subtitleImport";
import { getFFmpeg, runWithFFmpegLock } from "./ffmpeg/convertWebmToMp4";
import { fetchFile } from "@ffmpeg/util";

const DB_NAME = "creaibox-video-editor-db";
const DB_VERSION = 2;
const STORE_NAME = "media-files";
const WAVEFORM_STORE_NAME = "media-waveforms";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(WAVEFORM_STORE_NAME)) {
        db.createObjectStore(WAVEFORM_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getWaveformCacheKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

async function saveWaveformToCache(key: string, waveform: number[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(WAVEFORM_STORE_NAME, "readwrite");
      const store = transaction.objectStore(WAVEFORM_STORE_NAME);
      const request = store.put(waveform, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB waveform save failed:", e);
  }
}

async function getWaveformFromCache(key: string): Promise<number[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(WAVEFORM_STORE_NAME, "readonly");
      const store = transaction.objectStore(WAVEFORM_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        const value = request.result;
        resolve(Array.isArray(value) ? value : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB waveform load failed:", e);
    return null;
  }
}

export async function saveFileToCache(id: string, file: File): Promise<void> {
  try {
    const db = await openDB();
    // Convert File to a pure Blob to force IndexedDB to copy the raw bytes,
    // which prevents the browser's temporary local file permission from expiring on page reload.
    const blob = new Blob([file], { type: file.type });
    const dataToSave = {
      blob,
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
    };
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(dataToSave, id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB save failed:", e);
  }
}

export async function getFileFromCache(id: string): Promise<File | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Reconstruct File from stored object or support legacy formats
        if (result instanceof File) {
          resolve(result);
        } else if (result instanceof Blob) {
          resolve(new File([result], "restored-file", { type: result.type }));
        } else if (result && typeof result === "object" && result.blob) {
          resolve(
            new File([result.blob], result.name || "restored-file", {
              type: result.type || result.blob.type,
              lastModified: result.lastModified,
            })
          );
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB load failed:", e);
    return null;
  }
}

export async function deleteFileFromCache(id: string): Promise<void> {
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

export type VideoMotionKeyframe = {
  id: string;
  time: number;
  motionX?: number;
  motionY?: number;
  motionWidth?: number;
  motionHeight?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
};

export type VideoTransitionType =
  | "none"
  | "fade"
  | "zoom"
  | "slide"
  | "blur"
  | "wipe"
  | "push"
  | "spin"
  | "glitch"
  | "flash"
  | "dip-to-black"
  | "cross-zoom";

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
  textBgOpacity?: number;
  textAnimation?: string;

  // Transition
  transitionIn?: VideoTransitionType;
  transitionOut?: VideoTransitionType;

  keyframes?: VideoMotionKeyframe[];
  waveform?: number[];
  blendMode?: VideoBlendMode;
};

type VideoEditorVisualizerClip = VideoEditorClip & {
  visualizerTemplate?: string;
  visualizerAccentColor?: string;
  visualizerBackgroundColor?: string;
  visualizerY?: number;
  visualizerHeight?: number;
  visualizerWidth?: number;
  visualizerVideoName?: string;
  visualizerVideoUrl?: string;
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

  clickedPreviewMediaItem: VideoEditorMediaItem | null;
  clickedPreviewMediaTime: number;
  previewMediaItem: VideoEditorMediaItem | null;
  previewMediaTime: number;
};

type VideoEditorActions = {
  setProjectTitle: (value: string) => void;
  setActiveTab: (value: VideoEditorTab) => void;

  addMediaFiles: (files: FileList | File[]) => Promise<VideoEditorMediaItem[]>;
  removeMediaItem: (id: string) => void;
  selectMedia: (id: string | null) => void;

  addClipFromMedia: (
    media: VideoEditorMediaItem,
    options?: { trackId?: string; startTime?: number }
  ) => void;
  addTextClip: () => void;
  addSubtitleClip: () => void;
  addSubtitleCues: (cues: SubtitleImportCue[]) => void;
  addVisualizerClip: (options?: {
    template?: string;
    accentColor?: string;
    backgroundColor?: string;
    y?: number;
    height?: number;
    width?: number;
  }) => void;

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
  setTracks: (tracks: TimelineTrack[]) => void;
  setClips: (clips: VideoEditorClip[]) => void;
  setClickedPreviewMedia: (item: VideoEditorMediaItem | null, time?: number) => void;
  setPreviewMedia: (item: VideoEditorMediaItem | null, time?: number) => void;
  detachAudio: (clipId: string) => Promise<void>;
  extractAndDownloadAudio: (clipId: string) => Promise<void>;
};

type VideoEditorContextValue = VideoEditorState & VideoEditorActions;

const VideoEditorContext = createContext<VideoEditorContextValue | null>(null);

const TIMELINE_BASE_DURATION = 3600;
const MIN_TIMELINE_DURATION = 5;
const MAX_HISTORY = 50;
const DEFAULT_CANVAS_ZOOM = 100;
const LEGACY_DEFAULT_CANVAS_ZOOM = 75;

const DEFAULT_TEXT_STYLE: VideoTextStyle = {
  fontSize: 42,
  color: "#000000",
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

  return Math.max(MIN_TIMELINE_DURATION, Number(maxEnd.toFixed(1)));
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

function findAvailableTrack(
  tracks: TimelineTrack[],
  clips: VideoEditorClip[],
  trackType: TimelineTrackType,
  startTime: number,
  duration: number
) {
  const sameTypeTracks = tracks.filter((track) => track.type === trackType);
  const availableTrack = sameTypeTracks.find((track) =>
    clips.every(
      (clip) =>
        clip.trackId !== track.id ||
        !intervalsOverlap(startTime, duration, clip.startTime, clip.duration)
    )
  );

  return {
    sameTypeTracks,
    targetTrack:
      availableTrack ?? createTrack(trackType, sameTypeTracks.length + 1),
    shouldCreateTrack: !availableTrack,
  };
}

function insertTrackAfterSameType(
  tracks: TimelineTrack[],
  track: TimelineTrack,
  trackType: TimelineTrackType
) {
  if (tracks.some((item) => item.id === track.id)) return tracks;

  const insertAfterIndex = tracks.reduce(
    (lastIndex, item, index) => (item.type === trackType ? index : lastIndex),
    -1
  );

  if (insertAfterIndex < 0) return [...tracks, track];

  return [
    ...tracks.slice(0, insertAfterIndex + 1),
    track,
    ...tracks.slice(insertAfterIndex + 1),
  ];
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

    keyframes: Array.isArray(rawClip.keyframes)
      ? rawClip.keyframes
          .filter((keyframe) => Number.isFinite(keyframe.time))
          .sort((a, b) => a.time - b.time)
      : [],

    textStyle:
      rawClip.textStyle ??
      (rawClip.type === "subtitle"
        ? { ...DEFAULT_SUBTITLE_STYLE }
        : rawClip.type === "text"
          ? { ...DEFAULT_TEXT_STYLE }
          : undefined),

    textBgOpacity: rawClip.textBgOpacity ?? (rawClip.type === "text" ? 0 : 1),

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

  const [clickedPreviewMediaItem, setClickedPreviewMediaItem] = useState<VideoEditorMediaItem | null>(null);
  const [clickedPreviewMediaTime, setClickedPreviewMediaTime] = useState<number>(0);
  const [previewMediaItem, setPreviewMediaItem] = useState<VideoEditorMediaItem | null>(null);
  const [previewMediaTime, setPreviewMediaTime] = useState<number>(0);

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

  const setClickedPreviewMedia = useCallback((item: VideoEditorMediaItem | null, time = 0) => {
    setClickedPreviewMediaItem(item);
    setClickedPreviewMediaTime(time);
    setPreviewMediaItem(item);
    setPreviewMediaTime(time);
  }, []);

  const setPreviewMedia = useCallback((item: VideoEditorMediaItem | null, time = 0) => {
    setPreviewMediaItem(item);
    setPreviewMediaTime(time);
  }, []);

  const selectClip = useCallback((id: string | null) => {
    setSelectedClipId(id);
    setClickedPreviewMediaItem(null);
    setPreviewMediaItem(null);
  }, []);

  const setCurrentTime = (value: number) => {
    setCurrentTimeState(clamp(value, 0, totalDuration));
    setClickedPreviewMediaItem(null);
    setPreviewMediaItem(null);
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
    setClickedPreviewMediaItem(null);
    setPreviewMediaItem(null);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTimeState(0);
    setClickedPreviewMediaItem(null);
    setPreviewMediaItem(null);
  };

async function extractAudioWithFFmpeg(getFileBytes: () => Promise<Uint8Array>, fileName: string): Promise<ArrayBuffer> {
  return runWithFFmpegLock(async (ffmpeg) => {
    const safeName = (fileName || "temp_video_audio")
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    const inputName = `input_${Date.now()}_${safeName}`;
    const outputName = `output_${Date.now()}_${safeName}.wav`;

    let u8Array: Uint8Array | null = await getFileBytes();
    await ffmpeg.writeFile(inputName, u8Array);
    u8Array = null; // Free the JS memory reference IMMEDIATELY before running exec!
    
    // Extract audio to standard 16-bit PCM WAV at 48000Hz (highly compatible with decodeAudioData)
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "48000",
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    const u8 = data as Uint8Array;
    const audioBuffer = new ArrayBuffer(u8.byteLength);
    new Uint8Array(audioBuffer).set(u8);
    return audioBuffer;
  });
}

async function extractAudioWaveform(file: File, points = 96): Promise<number[]> {
  try {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) {
      throw new Error("AudioContext not supported");
    }

    const audioCtx = new AudioContextConstructor();
    
    let audioBuffer: AudioBuffer;
    if (file.type.startsWith("video/")) {
      // Direct FFmpeg extraction for video file waveforms to avoid native decode failures and double memory allocation.
      console.log("[VideoEditorContext] Waveform: skipping native decodeAudioData for video file, extracting directly via FFmpeg:", file.name);
      const getFileBytes = async () => {
        return new Uint8Array(await file.arrayBuffer());
      };
      const wavBuffer = await extractAudioWithFFmpeg(getFileBytes, file.name);
      
      audioBuffer = await Promise.race([
        audioCtx.decodeAudioData(wavBuffer),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Waveform fallback decoding timeout (15s)")), 15000)
        ),
      ]);
    } else {
      let arrayBuffer: ArrayBuffer | null = await file.arrayBuffer();
      try {
        audioBuffer = await Promise.race([
          audioCtx.decodeAudioData(arrayBuffer),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Audio decoding timeout (15s)")), 15000)
          ),
        ]);
        arrayBuffer = null;
      } catch (decodeError) {
        console.warn("[VideoEditorContext] Browser decodeAudioData failed for waveform, trying FFmpeg fallback:", decodeError);
        arrayBuffer = null;
        try {
          const getFileBytesFallback = async () => {
            return new Uint8Array(await file.arrayBuffer());
          };
          const wavBuffer = await extractAudioWithFFmpeg(getFileBytesFallback, file.name);
          audioBuffer = await Promise.race([
            audioCtx.decodeAudioData(wavBuffer),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Waveform fallback decoding timeout (15s)")), 15000)
            ),
          ]);
        } catch (ffmpegError) {
          console.error("[VideoEditorContext] FFmpeg waveform fallback extraction failed:", ffmpegError);
          throw decodeError; // rethrow original error if fallback also fails
        }
      }
    }

    const step = Math.max(1, Math.floor(audioBuffer.length / points));
    const waveform: number[] = [];

    for (let i = 0; i < points; i++) {
      let max = 0;
      const start = i * step;
      const end = Math.min(audioBuffer.length, start + step);

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let j = start; j < end; j++) {
          const val = Math.abs(channelData[j] ?? 0);
          if (val > max) max = val;
        }
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
    return [];
  }
}

async function getOrCreateAudioWaveform(file: File) {
  const cacheKey = getWaveformCacheKey(file);
  const cachedWaveform = await getWaveformFromCache(cacheKey);
  if (cachedWaveform?.length) return cachedWaveform;

  const waveform = await extractAudioWaveform(file);
  if (waveform.length) {
    await saveWaveformToCache(cacheKey, waveform);
  }
  return waveform;
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

  const addMediaFiles = async (files: FileList | File[]): Promise<VideoEditorMediaItem[]> => {
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
        }

        if (type === "audio" || type === "video") {
          waveform = await getOrCreateAudioWaveform(file);
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
    return nextItems;
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
            const restoredClips = await Promise.all(
              parsed.clips.map(async (clip: VideoEditorClip) => {
                const visualizerClip = clip as VideoEditorVisualizerClip;
                if (clip.type === "visualizer" && visualizerClip.visualizerVideoName) {
                  const cachedFile = await getFileFromCache("overlay-" + clip.id);
                  if (cachedFile) {
                    return {
                      ...clip,
                      visualizerVideoUrl: URL.createObjectURL(cachedFile),
                    };
                  }
                }
                return clip;
              })
            );
            setClipsState(restoredClips.map(normalizeClip));
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
        clips: clips.map((clip) => {
          if (clip.type === "visualizer") {
            const { visualizerVideoUrl: _visualizerVideoUrl, ...rest } =
              clip as VideoEditorVisualizerClip;
            return {
              ...rest,
              visualizerVideoUrl: "",
            };
          }
          return clip;
        }),
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

  const addClipFromMedia = (
    media: VideoEditorMediaItem,
    options?: { trackId?: string; startTime?: number }
  ) => {
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
    const requestedStartTime = Number((options?.startTime ?? currentTime).toFixed(2));
    const trackType = getTrackTypeByClipType(media.type);
    const requestedTrack = options?.trackId
      ? tracks.find((track) => track.id === options.trackId)
      : null;
    const canUseRequestedTrack = requestedTrack?.type === trackType;
    const availableTrack = canUseRequestedTrack
      ? {
          targetTrack: requestedTrack,
          shouldCreateTrack: false,
        }
      : findAvailableTrack(
          tracks,
          clips,
          trackType,
          requestedStartTime,
          duration
        );
    const targetTrack = availableTrack.targetTrack;
    const shouldCreateTrack = availableTrack.shouldCreateTrack;
    const startTime = canUseRequestedTrack
      ? resolveNonOverlappingStart(
          clips,
          "",
          targetTrack.id,
          requestedStartTime,
          duration
        )
      : requestedStartTime;

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const clip: VideoEditorClip = normalizeClip({
      id: createId("clip"),
      trackId: targetTrack.id,
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
    const trackType = "text";
    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      startTime,
      duration
    );

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const clip: VideoEditorClip = normalizeClip({
      id: createId("text"),
      trackId: targetTrack.id,
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
    const trackType = "subtitle";
    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      startTime,
      duration
    );

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const clip: VideoEditorClip = normalizeClip({
      id: createId("subtitle"),
      trackId: targetTrack.id,
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

  const addSubtitleCues = (cues: SubtitleImportCue[]) => {
    const validCues = cues.filter((cue) => cue.endTime > cue.startTime && cue.text.trim());
    if (validCues.length === 0) return;

    const trackType = "subtitle";
    const firstStartTime = Number(validCues[0].startTime.toFixed(2));
    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      firstStartTime,
      Math.max(0.5, validCues[0].endTime - validCues[0].startTime)
    );

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const importedClips = validCues.map((cue, index) =>
      normalizeClip({
        id: createId("subtitle"),
        trackId: targetTrack.id,
        type: "subtitle",
        name: cue.text,
        startTime: Number(cue.startTime.toFixed(2)),
        duration: Number(Math.max(0.5, cue.endTime - cue.startTime).toFixed(2)),
        left: 0,
        width: 0,
        color: getDefaultClipColor("subtitle"),
        textStyle: {
          ...DEFAULT_SUBTITLE_STYLE,
          y: 84,
        },
        textAlign: "center",
        textOpacity: 1,
        textBgOpacity: 0.92,
        transitionIn: index === 0 ? "fade" : "none",
        transitionOut: "none",
      })
    );

    setClipsWithHistory((prev) => [...prev, ...importedClips]);
    setSelectedClipId(importedClips[0]?.id ?? null);
  };

  const addVisualizerClip = (options?: {
    template?: string;
    accentColor?: string;
    backgroundColor?: string;
    y?: number;
    height?: number;
    width?: number;
  }) => {
    const duration = 10;
    const startTime = Number(currentTime.toFixed(2));
    const trackType = "visualizer";

    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      startTime,
      duration
    );

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const clip: VideoEditorClip = normalizeClip({
      id: createId("visualizer"),
      trackId: targetTrack.id,
      type: "visualizer",
      name: "오디오 비주얼라이저",
      startTime,
      duration,
      left: 0,
      width: 0,
      color: getDefaultClipColor("visualizer"),
      transitionIn: "fade",
      transitionOut: "fade",
      // Visualizer options
      visualizerTemplate: options?.template || "circle",
      visualizerAccentColor: options?.accentColor || "#ff4fd8",
      visualizerBackgroundColor: options?.backgroundColor || "#050507",
      visualizerY: options?.y ?? 50,
      visualizerHeight: options?.height ?? 58,
      visualizerWidth: options?.width ?? 92,
    } as VideoEditorVisualizerClip);

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

    const maxStartTime = Math.max(0, TIMELINE_BASE_DURATION - target.duration);
    const desiredStartTime = clamp(
      target.startTime + target.duration,
      0,
      maxStartTime
    );
    const trackType = getTrackTypeByClipType(target.type);
    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      desiredStartTime,
      target.duration
    );
    const left = timeToLeft(desiredStartTime);
    const width = clamp(durationToWidth(target.duration), 4, 100 - left);

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
    }

    const duplicated: VideoEditorClip = normalizeClip({
      ...target,
      id: createId("clip-copy"),
      trackId: targetTrack.id,
      name: `${target.name} 복사본`,
      startTime: Number(desiredStartTime.toFixed(2)),
      left,
      width,
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
    const { targetTrack, shouldCreateTrack } = findAvailableTrack(
      tracks,
      clips,
      trackType,
      safeStartTime,
      copiedClip.duration
    );

    if (shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, targetTrack, trackType));
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

  const detachAudio = useCallback(async (clipId: string): Promise<void> => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || clip.type !== "video" || !clip.mediaId) {
      throw new Error("올바르지 않은 클립이거나 비디오 클립이 아닙니다.");
    }

    const media = mediaItems.find((m) => m.id === clip.mediaId);
    if (!media) {
      throw new Error("미디어 아이템을 찾을 수 없습니다.");
    }

    // 1. Mute the original video clip
    updateClip(clip.id, { muted: true });

    // 2. Find or create an audio track
    const trackType = "audio";
    const availableTrack = findAvailableTrack(
      tracks,
      clips,
      trackType,
      clip.startTime,
      clip.duration
    );
    if (availableTrack.shouldCreateTrack) {
      setTracks((prev) => insertTrackAfterSameType(prev, availableTrack.targetTrack, trackType));
    }

    // 3. Create the audio clip referencing the same video media ID
    const newAudioClip: VideoEditorClip = normalizeClip({
      id: createId("clip"),
      trackId: availableTrack.targetTrack.id,
      mediaId: media.id,
      type: "audio",
      name: `${media.name} (Audio)`,
      startTime: clip.startTime,
      duration: clip.duration,
      trimStart: clip.trimStart || 0,
      trimEnd: clip.trimEnd || 0,
      left: 0,
      width: 0,
      color: getDefaultClipColor("audio"),
      waveform: media.waveform,
    });

    setClipsWithHistory((prev) => [...prev, newAudioClip]);
    setSelectedClipId(newAudioClip.id);
  }, [clips, mediaItems, tracks, updateClip, setTracks, setClipsWithHistory, setSelectedClipId]);

  const extractAndDownloadAudio = useCallback(async (clipId: string): Promise<void> => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || (clip.type !== "video" && clip.type !== "audio") || !clip.mediaId) {
      throw new Error("올바르지 않은 클립이거나 오디오/비디오 클립이 아닙니다.");
    }

    const media = mediaItems.find((m) => m.id === clip.mediaId);
    if (!media) {
      throw new Error("미디어 아이템을 찾을 수 없습니다.");
    }

    let file: File | null = media.file || null;
    if (!file) {
      file = await getFileFromCache(media.id);
    }
    if (!file) {
      throw new Error(
        "비디오 파일의 데이터를 읽을 수 없습니다. 브라우저 보안 정책으로 인해 로컬 파일 연결이 만료되었습니다. 미디어 라이브러리에서 해당 비디오의 '미디어 파일 재연결' 버튼을 눌러 파일을 다시 선택해 주세요."
      );
    }

    const baseName = media.name.replace(/\.[^/.]+$/, "");
    let arrayBuffer: ArrayBuffer | null = null;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (err) {
      console.error("Failed to read file bytes:", err);
      throw new Error(
        "비디오 파일의 데이터를 읽을 수 없습니다. 브라우저 보안 정책으로 인해 로컬 파일 연결이 만료되었습니다. 미디어 라이브러리에서 해당 비디오의 '미디어 파일 재연결' 버튼을 눌러 파일을 다시 선택해 주세요."
      );
    }

    const audioData = await runWithFFmpegLock(async (ffmpeg) => {
      const inputName = `input_${Date.now()}`;
      const outputName = `output_${Date.now()}.mp3`;

      let u8Array: Uint8Array | null = new Uint8Array(arrayBuffer!);
      arrayBuffer = null; // Free JS heap buffer reference immediately
      await ffmpeg.writeFile(inputName, u8Array);
      u8Array = null; // Free local reference immediately before transcode

      try {
        await ffmpeg.exec([
          "-i",
          inputName,
          "-vn",
          "-acodec",
          "libmp3lame",
          "-ab",
          "192k",
          outputName,
        ]);
        const data = await ffmpeg.readFile(outputName);
        await ffmpeg.deleteFile(inputName).catch(() => {});
        await ffmpeg.deleteFile(outputName).catch(() => {});
        return { data, extension: "mp3", mimeType: "audio/mp3" };
      } catch (err) {
        console.warn("FFmpeg MP3 extraction failed, falling back to WAV:", err);
        const wavOutputName = `output_${Date.now()}.wav`;
        await ffmpeg.exec([
          "-i",
          inputName,
          "-vn",
          "-acodec",
          "pcm_s16le",
          "-ar",
          "48000",
          wavOutputName,
        ]);
        const data = await ffmpeg.readFile(wavOutputName);
        await ffmpeg.deleteFile(inputName).catch(() => {});
        await ffmpeg.deleteFile(wavOutputName).catch(() => {});
        return { data, extension: "wav", mimeType: "audio/wav" };
      }
    });

    const uint8 = audioData.data as Uint8Array;
    const blob = new Blob([uint8.buffer as ArrayBuffer], { type: audioData.mimeType });
    const finalFileName = `${baseName}_audio.${audioData.extension}`;
    const extractedFile = new File([blob], finalFileName, { type: audioData.mimeType });

    // 1. Download to user's PC
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    // 2. Automatically register it as a new audio entry in the Media Library
    await addMediaFiles([extractedFile]);
  }, [clips, mediaItems, addMediaFiles]);

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

  const setClips = useCallback((newClips: VideoEditorClip[]) => {
    setClipsState(newClips.map(normalizeClip));
  }, []);

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

      clickedPreviewMediaItem,
      clickedPreviewMediaTime,
      previewMediaItem,
      previewMediaTime,

      setProjectTitle,
      setActiveTab,

      addMediaFiles,
      removeMediaItem,
      selectMedia: setSelectedMediaId,

      addClipFromMedia,
      addTextClip,
      addSubtitleClip,
      addSubtitleCues,
      addVisualizerClip,

      removeClip,
      duplicateClip,
      copyClip,
      pasteClip,
      splitClip,
      selectClip,

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
      setTracks,
      setClips,
      setClickedPreviewMedia,
      setPreviewMedia,
      detachAudio,
      extractAndDownloadAudio,
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
      setTracks,
      setClips,
      clickedPreviewMediaItem,
      clickedPreviewMediaTime,
      previewMediaItem,
      previewMediaTime,
      selectClip,
      setClickedPreviewMedia,
      setPreviewMedia,
      detachAudio,
      extractAndDownloadAudio,
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
