import type {
  CanvasRatio,
  VideoEditorClip,
  VideoEditorMediaItem,
} from "../VideoEditorContext";
import type {
  ExportFps,
  ExportQuality,
  ExportResolution,
  TimelineTrack,
} from "../types";
import { getEstimatedFrameCount, getRecommendedVideoBitrate } from "./exportBitratePresets";
import type { ExportBenchmarkResult } from "./exportBenchmark";
import type { VideoExportEngine } from "./exportTypes";
import type { RenderPreflightResult } from "./renderPreflight";

export type RenderJobSnapshot = {
  projectTitle: string;
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  duration: number;
  canvasRatio: CanvasRatio;
  width: number;
  height: number;
  bitrate: number;
  totalFrames: number;
  hasAudio: boolean;
  hasVideo: boolean;
  hasSubtitle: boolean;
  hasText: boolean;
  hasVisualizer: boolean;
  usesWebGLEffects: boolean;
  selectedMimeType?: string;
  preflight?: RenderPreflightResult;
  benchmark?: ExportBenchmarkResult;
  estimatedRenderSeconds?: number;
  clipsSnapshot: VideoEditorClip[];
  mediaItemsSnapshot: VideoEditorMediaItem[];
  tracksSnapshot: TimelineTrack[];
  createdAt: number;
};

export type RenderJobSnapshotContext = {
  projectTitle: string;
  clips: VideoEditorClip[];
  mediaItems: VideoEditorMediaItem[];
  tracks: TimelineTrack[];
  totalDuration: number;
  canvasRatio: CanvasRatio;
};

export type RenderJobSnapshotOptions = {
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  width: number;
  height: number;
};

export function buildRenderJobSnapshot({
  context,
  options,
  preflight,
  benchmark,
}: {
  context: RenderJobSnapshotContext;
  options: RenderJobSnapshotOptions;
  preflight?: RenderPreflightResult;
  benchmark?: ExportBenchmarkResult;
}): RenderJobSnapshot {
  const clipsSnapshot = cloneClips(context.clips);
  const mediaItemsSnapshot = cloneMediaItems(context.mediaItems);
  const tracksSnapshot = cloneTracks(context.tracks);
  const bitrate = getRecommendedVideoBitrate({
    resolution: options.resolution,
    fps: options.fps,
    quality: options.quality,
  });

  return {
    projectTitle: context.projectTitle,
    engine: options.engine,
    resolution: options.resolution,
    fps: options.fps,
    quality: options.quality,
    duration: context.totalDuration,
    canvasRatio: context.canvasRatio,
    width: options.width,
    height: options.height,
    bitrate,
    totalFrames: getEstimatedFrameCount(context.totalDuration, options.fps),
    hasAudio: clipsSnapshot.some((clip) => clip.type === "audio" || clip.type === "video"),
    hasVideo: clipsSnapshot.some((clip) => clip.type === "video" || clip.type === "image"),
    hasSubtitle: clipsSnapshot.some((clip) => clip.type === "subtitle"),
    hasText: clipsSnapshot.some((clip) => clip.type === "text"),
    hasVisualizer: clipsSnapshot.some((clip) => clip.type === "visualizer"),
    usesWebGLEffects: clipsSnapshot.some(hasExportWebGLEffect),
    selectedMimeType: preflight?.capabilities.mediaRecorder.selectedMimeType,
    preflight,
    benchmark,
    estimatedRenderSeconds: benchmark?.estimatedRenderSeconds,
    clipsSnapshot,
    mediaItemsSnapshot,
    tracksSnapshot,
    createdAt: Date.now(),
  };
}

function cloneClips(clips: VideoEditorClip[]) {
  return clips.map((clip) => ({
    ...clip,
    textStyle: clip.textStyle ? { ...clip.textStyle } : undefined,
    keyframes: clip.keyframes?.map((keyframe) => ({ ...keyframe })),
    waveform: clip.waveform ? [...clip.waveform] : undefined,
  }));
}

function cloneMediaItems(mediaItems: VideoEditorMediaItem[]) {
  return mediaItems.map((item) => ({
    ...item,
    waveform: item.waveform ? [...item.waveform] : undefined,
  }));
}

function cloneTracks(tracks: TimelineTrack[]) {
  return tracks.map((track) => ({ ...track }));
}

function hasExportWebGLEffect(clip: VideoEditorClip) {
  if (clip.type !== "image" && clip.type !== "video") return false;

  return (
    (clip.brightness ?? 1) !== 1 ||
    (clip.contrast ?? 1) !== 1 ||
    (clip.saturation ?? 1) !== 1 ||
    (clip.blur ?? 0) > 0 ||
    (clip.grayscale ?? 0) > 0 ||
    (clip.sepia ?? 0) > 0
  );
}
