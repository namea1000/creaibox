import type { VideoExportOptions } from "./exportTypes";
import type { RenderJobSnapshot } from "./renderJobSnapshot";

export type WebCodecsWorkerStartMessage = {
  type: "start";
  jobId: string;
  snapshot: RenderJobSnapshot;
  renderMode?: "probe" | "full";
};

export type WebCodecsWorkerCancelMessage = {
  type: "cancel";
  jobId: string;
};

export type WebCodecsWorkerRequest =
  | WebCodecsWorkerStartMessage
  | WebCodecsWorkerCancelMessage;

export type WebCodecsWorkerProgressMessage = {
  type: "progress";
  jobId: string;
  progress: number;
  message: string;
};

export type WebCodecsWorkerCompleteMessage = {
  type: "complete";
  jobId: string;
  fallbackToMainThread: boolean;
  workerRenderLoop: boolean;
  renderedFrames?: number;
  totalFrames?: number;
  outputBlob?: Blob;
  outputFileName?: string;
  reason?: string;
};

export type WebCodecsWorkerErrorMessage = {
  type: "error";
  jobId: string;
  message: string;
};

export type WebCodecsWorkerCancelledMessage = {
  type: "cancel";
  jobId: string;
  message?: string;
};

export type WebCodecsWorkerResponse =
  | WebCodecsWorkerProgressMessage
  | WebCodecsWorkerCompleteMessage
  | WebCodecsWorkerErrorMessage
  | WebCodecsWorkerCancelledMessage;

export type WebCodecsExportAudioPlan = {
  mode: "video-only" | "audio-beta-fallback" | "audio-fallback";
  reason?: string;
};

export type WebCodecsExportWorkerPlan = {
  enabled: boolean;
  reason: string;
  renderLoop?: "main-thread" | "worker-probe" | "worker-full";
};

export type WebCodecsVideoExportInput = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  fps: number;
  totalDuration: number;
  totalFrames?: number;
  title: string;
  bitrate: number;
  codec?: string;
  renderFrame: (time: number) => Promise<void>;
  options?: VideoExportOptions;
  audioPlan?: WebCodecsExportAudioPlan;
  workerPlan?: WebCodecsExportWorkerPlan;
};
