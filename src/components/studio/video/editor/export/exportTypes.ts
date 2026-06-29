import type { ExportFps, ExportQuality, ExportResolution } from "../types";
import type { RenderJobSnapshot } from "./renderJobSnapshot";

export type VideoExportEngine =
  | "fast-webcodecs"
  | "quick-webm"
  | "compatible-mp4"
  | "direct-mp4"
  | "audio-only";

export type VideoExportStage =
  | "idle"
  | "worker-preflight"
  | "encoding-webcodecs"
  | "rendering-webm"
  | "converting-mp4"
  | "completed"
  | "cancelled"
  | "failed";

export type VideoExportProgress = {
  stage: VideoExportStage;
  progress: number;
  message?: string;
};

export type VideoExportOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: VideoExportProgress) => void;
  resolution?: ExportResolution;
  fps?: ExportFps;
  quality?: ExportQuality;
  snapshot?: RenderJobSnapshot;
  fileName?: string;
  directoryHandle?: any;
  fileHandle?: any;
  audioFormat?: "mp3" | "wav" | "aac";
  videoFormat?: "mp4" | "mov";
};
