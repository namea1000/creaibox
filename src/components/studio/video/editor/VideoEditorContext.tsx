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
import { extractAudioWithMediabunny } from "./export/audioExtractor";
import { reverseVideo, detectSceneChanges } from "./ffmpeg/videoOperations";

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
  // If the file is larger than 500MB, skip saving it to IndexedDB to prevent browser storage quota crashes (SIGABRT)
  const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB
  if (file.size > MAX_CACHE_SIZE) {
    console.log(`[saveFileToCache] Skipping IndexedDB cache for large file: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
    return;
  }

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
  hasAudio?: boolean;
  width?: number;
  height?: number;
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
  selectedClipIds: string[];

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

  processingClipId: string | null;
  processingMessage: string;
  isClearCacheOpen: boolean;
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
  ) => Promise<void> | void;
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
  reverseVideoClip: (clipId: string) => Promise<void>;
  detectScenesAndSplitClip: (clipId: string) => Promise<void>;
  splitClipAtTimes: (id: string, splitTimes: number[]) => void;
  selectClipIds: (ids: string[]) => void;
  clearIndexedDBCache: (mode?: "smart" | "all") => Promise<void>;
  setIsClearCacheOpen: (value: boolean) => void;
};

type VideoEditorContextValue = VideoEditorState & VideoEditorActions;

const VideoEditorContext = createContext<VideoEditorContextValue | null>(null);

export const TIMELINE_BASE_DURATION = 43200; // 12 hours (12 * 3600)
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
  const mimeType = file.type || "";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";

  const lowerName = file.name.toLowerCase();
  const videoExtensions = [".mp4", ".mov", ".webm", ".avi", ".mkv", ".flv", ".3gp", ".ts", ".m4v"];
  if (videoExtensions.some((ext) => lowerName.endsWith(ext))) return "video";

  const audioExtensions = [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac", ".wma", ".caf"];
  if (audioExtensions.some((ext) => lowerName.endsWith(ext))) return "audio";

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

  // 30fps(1프레임당 약 0.033초)의 미세한 프레임 경계를 완벽히 반영하기 위해 소수점 둘째짜리(toFixed(2))로 정밀도 상향 조정
  return Math.max(MIN_TIMELINE_DURATION, Number(maxEnd.toFixed(2)));
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
  // Use a tiny epsilon/tolerance (0.01 seconds) to prevent floating-point precision issues from causing false overlaps
  const epsilon = 0.01;
  return startA < (endB - epsilon) && (endA - epsilon) > startB;
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
  let trimEnd = rawClip.trimEnd ?? 0;
  // 역재생 버그 자가치유 (Self-Healing): trimStart가 0이고 trimEnd가 duration과 거의 일치하여 전체를 잘라내는 버그성 상태인 경우 trimEnd를 0으로 복구
  if (
    (rawClip.type === "video" || rawClip.type === "audio") &&
    (rawClip.trimStart ?? 0) === 0 &&
    trimEnd > 0 &&
    Math.abs(trimEnd - rawClip.duration) < 0.05
  ) {
    trimEnd = 0;
  }

  return {
    ...rawClip,

    trimStart: rawClip.trimStart ?? 0,
    trimEnd,

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
  const [selectedClipIds, setSelectedClipIds] = useState<string[]>([]);
  const [copiedClips, setCopiedClips] = useState<VideoEditorClip[]>([]);

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

  const [processingClipId, setProcessingClipId] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState("");
  const [isClearCacheOpen, setIsClearCacheOpen] = useState(false);

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
    setSelectedClipIds(id ? [id] : []);
    setClickedPreviewMediaItem(null);
    setPreviewMediaItem(null);
  }, []);

  const selectClipIds = useCallback((ids: string[]) => {
    setSelectedClipIds(ids);
    setSelectedClipId(ids.length > 0 ? ids[ids.length - 1] : null);
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
    if (getMediaType(file) === "video") {
      console.log("[VideoEditorContext] Waveform: Extracting audio track using Mediabunny:", file.name);
      try {
        const wavBlob = await extractAudioWithMediabunny(file);
        if (!wavBlob) {
          console.log("[VideoEditorContext] Waveform: Video is silent, returning empty waveform");
          return [];
        }
        const wavBuffer = await wavBlob.arrayBuffer();
        audioBuffer = await Promise.race([
          audioCtx.decodeAudioData(wavBuffer),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Waveform decoding timeout (15s)")), 15000)
          ),
        ]);
      } catch (err) {
        console.warn("[VideoEditorContext] Waveform: Mediabunny extraction failed for video:", err);
        throw err;
      }
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

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function getVideoThumbnail(file: File): Promise<{ url: string; width: number; height: number }> {
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
        const videoWidth = video.videoWidth || 120;
        const videoHeight = video.videoHeight || 68;

        if (videoHeight > videoWidth) {
          canvas.height = 120;
          canvas.width = Math.round(120 * (videoWidth / videoHeight));
        } else {
          canvas.width = 120;
          canvas.height = Math.round(120 * (videoHeight / videoWidth));
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
          resolve({ url: dataUrl, width: videoWidth, height: videoHeight });
        } else {
          resolve({ url: "", width: videoWidth, height: videoHeight });
        }
      } catch (e) {
        console.error("Thumbnail extraction failed:", e);
        resolve({ url: "", width: 0, height: 0 });
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ url: "", width: 0, height: 0 });
    };

    video.src = url;
  });
}

function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const type = getMediaType(file);
    const url = URL.createObjectURL(file);
    if (type === "video") {
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
    } else if (type === "audio") {
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

        let hasAudio = false;

        // Pre-extract audio track for video to bypass loading giant video array buffers later
        if (type === "video") {
          try {
            console.log("[VideoEditorContext] Pre-extracting audio track using Mediabunny:", file.name);
            const wavBlob = await extractAudioWithMediabunny(file);
            if (wavBlob) {
              await saveFileToCache("audio-extract-" + mediaId, new File([wavBlob], file.name + ".wav", { type: "audio/wav" }));
              console.log("[VideoEditorContext] Pre-extract: Successfully cached audio-only WAV track for:", file.name);
              hasAudio = true;
            } else {
              console.log("[VideoEditorContext] Pre-extract: Video file is silent, skipping audio cache:", file.name);
              hasAudio = false;
            }
          } catch (e) {
            console.warn("[VideoEditorContext] Pre-extract: Failed to cache audio track for video:", e);
            hasAudio = true;
          }
        } else if (type === "audio") {
          hasAudio = true;
        }

        let thumbnailUrl = "";
        let width = 0;
        let height = 0;
        let waveform: number[] = [];

        if (type === "image") {
          thumbnailUrl = URL.createObjectURL(file);
          const dims = await getImageDimensions(file);
          width = dims.width;
          height = dims.height;
        } else if (type === "video") {
          const thumbResult = await getVideoThumbnail(file);
          thumbnailUrl = thumbResult.url;
          width = thumbResult.width;
          height = thumbResult.height;
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
          hasAudio,
          width,
          height,
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
    void deleteFileFromCache("audio-extract-" + id);

    setClipsState((prev) => prev.filter((clip) => clip.mediaId !== id));
    setSelectedMediaId((current) => (current === id ? null : current));
  };

  const relinkMediaFile = useCallback(async (id: string, file: File) => {
    const type = getMediaType(file);
    const newUrl = URL.createObjectURL(file);

    // Save to IndexedDB
    await saveFileToCache(id, file);

    let hasAudio = false;

    // Pre-extract audio track for video to bypass loading giant video array buffers later
    if (type === "video") {
      try {
        console.log("[VideoEditorContext] Relink: Extracting audio track using Mediabunny:", file.name);
        const wavBlob = await extractAudioWithMediabunny(file);
        if (wavBlob) {
          await saveFileToCache("audio-extract-" + id, new File([wavBlob], file.name + ".wav", { type: "audio/wav" }));
          console.log("[VideoEditorContext] Relink: Successfully cached audio-only WAV track for:", file.name);
          hasAudio = true;
        } else {
          console.log("[VideoEditorContext] Relink: Video file is silent, skipping audio cache:", file.name);
          hasAudio = false;
        }
      } catch (e) {
        console.warn("[VideoEditorContext] Relink: Failed to pre-extract audio track for video cache:", e);
        hasAudio = true;
      }
    } else if (type === "audio") {
      hasAudio = true;
    }

    let newThumbnailUrl = "";
    let width = 0;
    let height = 0;
    if (type === "image") {
      newThumbnailUrl = newUrl;
      const dims = await getImageDimensions(file);
      width = dims.width;
      height = dims.height;
    } else if (type === "video") {
      const thumbResult = await getVideoThumbnail(file);
      newThumbnailUrl = thumbResult.url;
      width = thumbResult.width;
      height = thumbResult.height;
    }

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
              thumbnailUrl: newThumbnailUrl || item.thumbnailUrl,
              width: width || item.width,
              height: height || item.height,
              hasAudio,
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
                    const newUrl = URL.createObjectURL(cachedFile);
                    
                    // Background healing: If the item was uploaded before the ratio patch
                    // and is missing its dimensions or has a horizontal thumbnail for a vertical media,
                    // we dynamically detect dimensions and update its thumbnail.
                    let width = item.width;
                    let height = item.height;
                    let thumbUrl = item.thumbnailUrl;

                    if (!width || !height) {
                      try {
                        if (item.type === "image") {
                          const dims = await getImageDimensions(cachedFile);
                          width = dims.width;
                          height = dims.height;
                          thumbUrl = newUrl;
                        } else if (item.type === "video") {
                          const thumbResult = await getVideoThumbnail(cachedFile);
                          width = thumbResult.width;
                          height = thumbResult.height;
                          thumbUrl = thumbResult.url;
                        }
                      } catch (e) {
                        console.warn("[VideoEditorContext] Restored item healing failed:", item.name, e);
                      }
                    }

                    return {
                      ...item,
                      url: newUrl,
                      file: cachedFile,
                      thumbnailUrl: thumbUrl || item.thumbnailUrl,
                      width,
                      height,
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
          hasAudio: item.hasAudio,
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

  const addClipFromMedia = async (
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

    let resolvedDuration = media.duration;

    // Dynamically resolve media duration if it's missing for video or audio
    if ((media.type === "video" || media.type === "audio") && !resolvedDuration) {
      console.log(`[VideoEditorContext] Resolving remote media duration for: ${media.name}`);
      resolvedDuration = await new Promise<number>((resolve) => {
        const tempEl = document.createElement(media.type) as HTMLMediaElement;
        tempEl.src = media.url;
        tempEl.preload = "metadata";
        tempEl.onloadedmetadata = () => {
          console.log(`[VideoEditorContext] Resolved duration: ${tempEl.duration}s for ${media.name}`);
          resolve(tempEl.duration);
        };
        tempEl.onerror = () => {
          console.warn(`[VideoEditorContext] Failed to resolve metadata for ${media.name}`);
          resolve(media.type === "video" ? 10 : 30);
        };
        setTimeout(() => {
          resolve(media.type === "video" ? 10 : 30);
        }, 3000);
      });
      media.duration = resolvedDuration;
    }

    const duration = media.type === "image" ? 5 : resolvedDuration || 10;
    const requestedStartTime = Number((options?.startTime ?? currentTime).toFixed(2));
    const trackType = getTrackTypeByClipType(media.type);

    // Magnetic Timeline Snapping:
    // If the playhead is very close (within 0.15s) to the end of an existing clip of the same track type,
    // automatically snap the new clip to start exactly at the end of that clip and use its track.
    const snapThreshold = 0.15;
    let finalStartTime = requestedStartTime;
    let finalTrackId = options?.trackId || null;

    if (!options?.startTime && !options?.trackId) {
      const sameTypeClips = clips.filter((c) => getTrackTypeByClipType(c.type) === trackType);
      const closeClip = sameTypeClips.find((c) => {
        const clipEnd = c.startTime + c.duration;
        return Math.abs(requestedStartTime - clipEnd) <= snapThreshold;
      });

      if (closeClip) {
        finalStartTime = Number((closeClip.startTime + closeClip.duration).toFixed(2));
        finalTrackId = closeClip.trackId;
        console.log(`[VideoEditorContext] Magnetic Snap: Snapped new clip to end of ${closeClip.name} at ${finalStartTime}s on track ${finalTrackId}`);
      }
    }

    const requestedTrack = finalTrackId
      ? tracks.find((track) => track.id === finalTrackId)
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
          finalStartTime,
          duration
        );
    const targetTrack = availableTrack.targetTrack;
    const shouldCreateTrack = availableTrack.shouldCreateTrack;
    const startTime = canUseRequestedTrack
      ? resolveNonOverlappingStart(
          clips,
          "",
          targetTrack.id,
          finalStartTime,
          duration
        )
      : finalStartTime;

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

  const removeClip = useCallback((id: string) => {
    const idsToRemove = selectedClipIds.includes(id) ? selectedClipIds : [id];
    setClipsWithHistory((prev) => prev.filter((clip) => !idsToRemove.includes(clip.id)));
    setSelectedClipId((current) => (current && idsToRemove.includes(current) ? null : current));
    setSelectedClipIds((prev) => prev.filter((cid) => !idsToRemove.includes(cid)));
  }, [selectedClipIds, setClipsWithHistory]);

  const duplicateClip = useCallback((id: string) => {
    const idsToDuplicate = selectedClipIds.includes(id) ? selectedClipIds : [id];
    const targets = clips.filter((c) => idsToDuplicate.includes(c.id));
    if (targets.length === 0) return;

    const minStart = Math.min(...targets.map((c) => c.startTime));
    const maxEnd = Math.max(...targets.map((c) => c.startTime + c.duration));
    const duplicateOffset = maxEnd - minStart;

    const newClips = targets.map((target) => {
      const newStart = clamp(target.startTime + duplicateOffset, 0, TIMELINE_BASE_DURATION - target.duration);
      const trackType = getTrackTypeByClipType(target.type);
      const { targetTrack } = findAvailableTrack(
        tracks,
        clips,
        trackType,
        newStart,
        target.duration
      );
      const left = timeToLeft(newStart);
      const width = clamp(durationToWidth(target.duration), 4, 100 - left);
      return normalizeClip({
        ...target,
        id: createId("clip-copy"),
        trackId: targetTrack.id,
        name: `${target.name} 복사본`,
        startTime: Number(newStart.toFixed(2)),
        left,
        width,
      });
    });

    setClipsWithHistory((prev) => [...prev, ...newClips]);
    setSelectedClipIds(newClips.map((c) => c.id));
    setSelectedClipId(newClips[newClips.length - 1].id);
  }, [clips, selectedClipIds, tracks, setClipsWithHistory, setSelectedClipId]);

  const copyClip = useCallback((id: string) => {
    const idsToCopy = selectedClipIds.includes(id) ? selectedClipIds : [id];
    const targets = clips.filter((c) => idsToCopy.includes(c.id));
    if (targets.length === 0) return;

    setCopiedClips(targets.map((c) => normalizeClip({ ...c })));
    setCopiedClip(normalizeClip({ ...targets[0] }));
  }, [clips, selectedClipIds]);

  const pasteClip = useCallback((startTime?: number) => {
    const activeCopiedClips = copiedClips.length > 0 ? copiedClips : (copiedClip ? [copiedClip] : []);
    if (activeCopiedClips.length === 0) return;

    const minCopiedStartTime = Math.min(...activeCopiedClips.map((c) => c.startTime));
    let baseStartTime = typeof startTime === "number" ? startTime : currentTime;

    // 마그네틱 스냅핑 (Magnetic Snapping for Paste):
    // 붙여넣기 기준 위치가 기존 클립의 끝자락(0.15초 이내)에 있으면 해당 클립 끝으로 정확하게 정렬하여 중복 오차 방지
    const snapThreshold = 0.15;
    const closeClip = clips.find((c) => {
      const clipEnd = c.startTime + c.duration;
      return Math.abs(baseStartTime - clipEnd) <= snapThreshold;
    });
    if (closeClip) {
      baseStartTime = Number((closeClip.startTime + closeClip.duration).toFixed(2));
      console.log(`[VideoEditorContext] Paste Magnetic Snap: Snapped paste start time to end of ${closeClip.name} at ${baseStartTime}s`);
    }

    const pastedClips: VideoEditorClip[] = [];

    for (const copied of activeCopiedClips) {
      const offset = copied.startTime - minCopiedStartTime;
      const maxStartTime = Math.max(0, TIMELINE_BASE_DURATION - copied.duration);
      const safeStartTime = clamp(baseStartTime + offset, 0, maxStartTime);
      const left = timeToLeft(safeStartTime);
      const trackType = getTrackTypeByClipType(copied.type);

      // 중요: 같은 배치로 붙여넣기 되는 클립들끼리의 충돌을 방지하기 위해 [...clips, ...pastedClips]를 전달
      const { targetTrack } = findAvailableTrack(
        tracks,
        [...clips, ...pastedClips],
        trackType,
        safeStartTime,
        copied.duration
      );

      const width = clamp(
        copied.width || durationToWidth(copied.duration),
        4,
        100 - left
      );

      pastedClips.push(
        normalizeClip({
          ...copied,
          id: createId("clip-paste"),
          trackId: targetTrack.id,
          name: `${copied.name} 복사본`,
          startTime: Number(safeStartTime.toFixed(2)),
          left,
          width,
        })
      );
    }

    setClipsWithHistory((prev) => [...prev, ...pastedClips]);
    setSelectedClipIds(pastedClips.map((c) => c.id));
    setSelectedClipId(pastedClips[pastedClips.length - 1].id);

    const maxEndTime = Math.max(...pastedClips.map((c) => c.startTime + c.duration));
    setCurrentTime(Number(maxEndTime.toFixed(2)));
  }, [copiedClips, copiedClip, currentTime, tracks, clips, setSelectedClipId, setCurrentTime]);

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
      trimEnd: (target.trimStart ?? 0) + firstDuration,
    });

    const secondClip: VideoEditorClip = normalizeClip({
      ...target,
      id: createId("clip-split"),
      name: `${target.name} B`,
      startTime: secondStartTime,
      duration: secondDuration,
      left: secondLeft,
      width: clamp(secondWidth, 4, 100 - secondLeft),
      trimStart: (target.trimStart ?? 0) + firstDuration,
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

  const splitClipAtTimes = useCallback((id: string, splitTimes: number[]) => {
    const target = clips.find((clip) => clip.id === id);
    if (!target || target.duration <= 1) return;

    // Filter and sort split times that fall within the clip
    const relativeSplits = splitTimes
      .map((time) => time - target.startTime)
      .filter((offset) => offset >= 0.5 && offset <= target.duration - 0.5)
      .sort((a, b) => a - b);

    if (relativeSplits.length === 0) return;

    // Filter out splits that are too close to each other (less than 0.5 seconds)
    const cleanRelativeSplits: number[] = [];
    let lastOffset = 0;
    for (const offset of relativeSplits) {
      if (offset - lastOffset >= 0.5 && target.duration - offset >= 0.5) {
        cleanRelativeSplits.push(offset);
        lastOffset = offset;
      }
    }

    if (cleanRelativeSplits.length === 0) return;

    const boundaries = [0, ...cleanRelativeSplits, target.duration];
    const newClips: VideoEditorClip[] = [];

    for (let i = 0; i < boundaries.length - 1; i++) {
      const bStart = boundaries[i];
      const bEnd = boundaries[i + 1];
      const segmentDuration = Number((bEnd - bStart).toFixed(2));
      const segmentStartTime = Number((target.startTime + bStart).toFixed(2));
      const segmentLeft = timeToLeft(segmentStartTime);
      const segmentWidth = durationToWidth(segmentDuration);

      const suffix = String.fromCharCode(65 + i); // A, B, C, ...

      newClips.push(
        normalizeClip({
          ...target,
          id: i === 0 ? target.id : createId("clip-split"),
          name: `${target.name} ${suffix}`,
          startTime: segmentStartTime,
          duration: segmentDuration,
          left: segmentLeft,
          width: segmentWidth,
          trimStart: (target.trimStart ?? 0) + bStart,
          trimEnd: (target.trimStart ?? 0) + bEnd,
        })
      );
    }

    setClipsWithHistory((prev) => {
      const idx = prev.findIndex((clip) => clip.id === id);
      if (idx === -1) return prev;
      const result = [...prev];
      result.splice(idx, 1, ...newClips);
      return result;
    });

    setSelectedClipId(newClips[0].id);
  }, [clips, setClipsWithHistory, setSelectedClipId]);

  const reverseVideoClip = useCallback(async (clipId: string): Promise<void> => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || !clip.mediaId) return;

    const media = mediaItems.find((m) => m.id === clip.mediaId);
    if (!media) return;

    setProcessingClipId(clipId);
    setProcessingMessage("영상을 역재생 변환하는 중입니다...");

    try {
      let file: File | null = media.file || null;
      if (!file) {
        file = await getFileFromCache(media.id);
      }
      if (!file && media.url) {
        try {
          setProcessingMessage("미디어 원본 파일을 다운로드하는 중입니다...");
          const response = await fetch(media.url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          file = new File([blob], media.name || "temp_video.mp4", { type: blob.type || "video/mp4" });
          await saveFileToCache(media.id, file);
        } catch (fetchErr) {
          console.error("[reverseVideoClip] Failed to download media from URL:", fetchErr);
        }
      }
      if (!file) {
        throw new Error("미디어 원본 파일을 찾을 수 없습니다.");
      }

      const trimStart = clip.trimStart ?? 0;
      const trimEnd = clip.trimEnd ?? media.duration ?? 0;

      const reversedBlob = await reverseVideo({
        file,
        hasAudio: media.hasAudio ?? false,
        trimStart,
        trimEnd,
        onProgress: (p) => {
          setProcessingMessage(`영상을 역재생 변환하는 중입니다... (${p}%)`);
        },
      });

      const nameWithoutExt = media.name.replace(/\.[^/.]+$/, "");
      const reversedFile = new File(
        [reversedBlob],
        `reversed_${nameWithoutExt}_${Date.now()}.mp4`,
        { type: "video/mp4" }
      );

      setProcessingMessage("변환된 미디어 정보를 등록하는 중입니다...");
      
      const [newMediaItem] = await addMediaFiles([reversedFile]);
      if (!newMediaItem) {
        throw new Error("역재생 미디어 등록에 실패했습니다.");
      }

      setClipsWithHistory((prev) =>
        prev.map((c) =>
          c.id === clipId
            ? normalizeClip({
                ...c,
                mediaId: newMediaItem.id,
                name: `역재생_${c.name}`,
                trimStart: 0,
                trimEnd: 0,
              })
            : c
        )
      );

      console.log("[reverseVideoClip] Reverse complete for clip:", clipId);
    } catch (err) {
      console.error("[reverseVideoClip] Failed to reverse video:", err);
      alert(err instanceof Error ? err.message : "역재생 변환에 실패했습니다.");
    } finally {
      setProcessingClipId(null);
      setProcessingMessage("");
    }
  }, [clips, mediaItems, addMediaFiles, setClipsWithHistory]);

  const detectScenesAndSplitClip = useCallback(async (clipId: string): Promise<void> => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || !clip.mediaId || clip.type !== "video") return;

    const media = mediaItems.find((m) => m.id === clip.mediaId);
    if (!media) return;

    setProcessingClipId(clipId);
    setProcessingMessage("장면 분할을 위해 영상을 분석하는 중입니다...");

    try {
      let file: File | null = media.file || null;
      if (!file) {
        file = await getFileFromCache(media.id);
      }
      if (!file && media.url) {
        try {
          setProcessingMessage("미디어 원본 파일을 분석하기 위해 다운로드하는 중입니다...");
          const response = await fetch(media.url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          file = new File([blob], media.name || "temp_video.mp4", { type: blob.type || "video/mp4" });
          await saveFileToCache(media.id, file);
        } catch (fetchErr) {
          console.error("[detectScenesAndSplitClip] Failed to download media from URL:", fetchErr);
        }
      }
      if (!file) {
        throw new Error("미디어 원본 파일을 찾을 수 없습니다.");
      }

      const trimStart = clip.trimStart ?? 0;
      const trimEnd = clip.trimEnd ?? media.duration ?? 0;

      const cutPoints = await detectSceneChanges({
        file,
        trimStart,
        trimEnd,
        onProgress: (p) => {
          setProcessingMessage(`영상을 분석하는 중입니다... (${p}%)`);
        },
      });

      console.log("[detectScenesAndSplitClip] Detected scene cuts relative to trim:", cutPoints);

      if (cutPoints.length === 0) {
        alert("장면 전환점이 감지되지 않았습니다.");
        return;
      }

      const timelineSplitTimes = cutPoints.map((pt) => clip.startTime + pt);

      splitClipAtTimes(clipId, timelineSplitTimes);
    } catch (err) {
      console.error("[detectScenesAndSplitClip] Failed to detect scenes:", err);
      alert(err instanceof Error ? err.message : "장면 분할 분석에 실패했습니다.");
    } finally {
      setProcessingClipId(null);
      setProcessingMessage("");
    }
  }, [clips, mediaItems, splitClipAtTimes]);

  const clearIndexedDBCache = useCallback(async (mode: "smart" | "all" = "smart"): Promise<void> => {
    try {
      const db = await openDB();

      if (mode === "smart") {
        // Collect all active media IDs in the current project
        const activeMediaIds = new Set<string>();
        mediaItems.forEach((item) => {
          activeMediaIds.add(item.id);
          activeMediaIds.add("audio-extract-" + item.id);
        });

        // Open a transaction to scan and delete unused keys
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.openKeyCursor();
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursor | null>).result;
            if (cursor) {
              const key = cursor.key as string;
              if (!activeMediaIds.has(key)) {
                store.delete(key);
                console.log(`[clearIndexedDBCache] Deleted unused cache key: ${key}`);
              }
              cursor.continue();
            } else {
              resolve();
            }
          };
          request.onerror = () => reject(request.error);
        });
        
        console.log("[VideoEditorContext] Smart IndexedDB cleanup complete.");
      } else {
        // Mode "all" - Clear all files, but KEEP timeline metadata (clips and mediaItems)!
        const transaction = db.transaction([STORE_NAME, WAVEFORM_STORE_NAME], "readwrite");
        const filesStore = transaction.objectStore(STORE_NAME);
        const waveformsStore = transaction.objectStore(WAVEFORM_STORE_NAME);

        filesStore.clear();
        waveformsStore.clear();

        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });

        // Revoke Object URLs to free memory
        mediaItems.forEach((item) => {
          if (item.url && item.url.startsWith("blob:")) {
            try { URL.revokeObjectURL(item.url); } catch {}
          }
          if (item.thumbnailUrl && item.thumbnailUrl.startsWith("blob:")) {
            try { URL.revokeObjectURL(item.thumbnailUrl); } catch {}
          }
        });

        // Keep timeline clips and media items metadata, but clear the cached File/blob references.
        // The clips will enter an offline/missing state with a "Relink" button.
        setMediaItems((prev) =>
          prev.map((item) => ({
            ...item,
            file: undefined,
            url: "", // Force to reload/relink
          }))
        );
        
        console.log("[VideoEditorContext] Deep IndexedDB clean complete. Metadata preserved.");
      }
    } catch (e) {
      console.error("[VideoEditorContext] Failed to clear IndexedDB cache:", e);
      throw e;
    }
  }, [mediaItems]);

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

        const media = mediaItems.find((m) => m.id === clip.mediaId);
        const maxDuration = (clip.type === "video" || clip.type === "audio") && media && typeof media.duration === "number" && media.duration > 0
          ? media.duration - (clip.trimStart ?? 0)
          : Infinity;

        const clampedDuration = Math.min(duration, maxDuration);

        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          clip.trackId,
          clip.startTime,
          clampedDuration
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

        const media = mediaItems.find((m) => m.id === clip.mediaId);
        const hasMediaLimit = (clip.type === "video" || clip.type === "audio") && media && typeof media.duration === "number" && media.duration > 0;

        let minStart = 0;
        if (hasMediaLimit && media?.duration) {
          minStart = Math.max(0, clip.startTime - (clip.trimStart ?? 0));
        }

        const requestedStart = clamp(startTime, minStart, TIMELINE_BASE_DURATION);
        const safeStart = clampStartToPreviousTrackGap(
          prev,
          clip.id,
          clip.trackId,
          requestedStart
        );

        const isTrimLeft = Math.abs((startTime + duration) - (clip.startTime + clip.duration)) < 0.05;
        const startDiff = safeStart - clip.startTime;
        const newTrimStart = isTrimLeft
          ? Math.max(0, (clip.trimStart ?? 0) + startDiff)
          : (clip.trimStart ?? 0);

        const requestedDuration = Math.max(0.5, duration);
        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          clip.trackId,
          safeStart,
          requestedDuration
        );

        // Enforce max duration based on the new trimStart
        const maxDuration = hasMediaLimit && media?.duration
          ? media.duration - newTrimStart
          : Infinity;
        const finalDuration = Math.min(safeDuration, maxDuration);

        const left = timeToLeft(safeStart);
        const width = clamp(durationToWidth(finalDuration), 4, 100 - left);

        return normalizeClip({
          ...clip,
          startTime: Number(safeStart.toFixed(2)),
          duration: Number(finalDuration.toFixed(2)),
          trimStart: Number(newTrimStart.toFixed(2)),
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

        const media = mediaItems.find((m) => m.id === clip.mediaId);
        const maxDuration = (clip.type === "video" || clip.type === "audio") && media && typeof media.duration === "number" && media.duration > 0
          ? media.duration - (clip.trimStart ?? 0)
          : Infinity;

        const clampedDuration = Math.min(duration, maxDuration);

        const safeDuration = clampDurationToTrackGap(
          prev,
          clip.id,
          trackId,
          startTime,
          clampedDuration
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
    setClipsWithHistory((prev) =>
      prev.map((clip) => {
        if (clip.id !== id) return clip;

        const media = mediaItems.find((m) => m.id === clip.mediaId);
        const hasMediaLimit = (clip.type === "video" || clip.type === "audio") && media && typeof media.duration === "number" && media.duration > 0;
        const maxTrimStart = hasMediaLimit && media?.duration ? media.duration - 0.5 : TIMELINE_BASE_DURATION;
        const clampedTrimStart = clamp(nextTrimStart, 0, maxTrimStart);

        let safeDuration = clip.duration;
        if (hasMediaLimit && media?.duration) {
          safeDuration = Math.min(clip.duration, media.duration - clampedTrimStart);
        }

        const nextWidth = durationToWidth(safeDuration);

        return normalizeClip({
          ...clip,
          trimStart: Number(clampedTrimStart.toFixed(2)),
          duration: Number(safeDuration.toFixed(2)),
          width: clamp(nextWidth, 4, 100 - clip.left),
        });
      })
    );
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
      selectedClipIds,
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

      processingClipId,
      processingMessage,

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

      isClearCacheOpen,
      setIsClearCacheOpen,

      exportProjectJson,
      importProjectJson,
      relinkMediaFile,
      setTracks,
      setClips,
      setClickedPreviewMedia,
      setPreviewMedia,
      detachAudio,
      extractAndDownloadAudio,
      reverseVideoClip,
      detectScenesAndSplitClip,
      splitClipAtTimes,
      selectClipIds,
      clearIndexedDBCache,
    }),
    [
      projectTitle,
      activeTab,
      mediaItems,
      tracks,
      clips,
      selectedMediaId,
      selectedClipId,
      selectedClipIds,
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
      processingClipId,
      processingMessage,
      reverseVideoClip,
      detectScenesAndSplitClip,
      splitClipAtTimes,
      selectClipIds,
      clearIndexedDBCache,
      isClearCacheOpen,
      setIsClearCacheOpen,
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
