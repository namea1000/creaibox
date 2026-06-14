"use client";

import { useSyncExternalStore } from "react";
import type {
  VideoExportEngine,
  VideoExportProgress,
  VideoExportStage,
} from "./exportTypes";
import type { ExportFps, ExportQuality, ExportResolution } from "../types";
import type { ExportBenchmarkResult } from "./exportBenchmark";
import type { RenderJobSnapshot } from "./renderJobSnapshot";
import type { RenderPreflightResult } from "./renderPreflight";

export type VideoExportJobStatus =
  | "idle"
  | "running"
  | "completed"
  | "cancelled"
  | "failed";

export type VideoExportJob = {
  id: string | null;
  engine: VideoExportEngine | null;
  status: VideoExportJobStatus;
  progress: VideoExportProgress;
  startedAt: number | null;
  completedAt: number | null;
  errorMessage?: string;
};

export type VideoRenderQueueItem = {
  id: string;
  projectTitle: string;
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  duration: number;
  snapshot?: RenderJobSnapshot;
  preflight?: RenderPreflightResult;
  benchmark?: ExportBenchmarkResult;
  estimatedSeconds?: number;
  exportRecordId?: string;
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
  status: Exclude<VideoExportJobStatus, "idle"> | "pending";
  progress: VideoExportProgress;
  errorMessage?: string;
};

const idleProgress: VideoExportProgress = {
  stage: "idle",
  progress: 0,
  message: "내보내기 대기 중입니다.",
};

let currentJob: VideoExportJob = {
  id: null,
  engine: null,
  status: "idle",
  progress: idleProgress,
  startedAt: null,
  completedAt: null,
};

let renderQueue: VideoRenderQueueItem[] = [];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function createId() {
  return `export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function subscribeExportJob(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getExportJobSnapshot() {
  return currentJob;
}

export function getRenderQueueSnapshot() {
  return renderQueue;
}

export function useExportJob() {
  return useSyncExternalStore(
    subscribeExportJob,
    getExportJobSnapshot,
    getExportJobSnapshot
  );
}

export function useRenderQueue() {
  return useSyncExternalStore(
    subscribeExportJob,
    getRenderQueueSnapshot,
    getRenderQueueSnapshot
  );
}

export function enqueueRenderJob(
  item: Omit<
    VideoRenderQueueItem,
    "id" | "createdAt" | "startedAt" | "completedAt" | "status" | "progress"
  >
) {
  const queuedItem: VideoRenderQueueItem = {
    ...item,
    id: createId(),
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    status: "pending",
    progress: {
      stage: "idle",
      progress: 0,
      message: "대기열에서 순서를 기다립니다.",
    },
  };

  renderQueue = [queuedItem, ...renderQueue];
  emitChange();
  return queuedItem;
}

export function startExportJob(engine: VideoExportEngine, jobId = createId()) {
  const controller = new AbortController();

  currentJob = {
    id: jobId,
    engine,
    status: "running",
    progress: {
      stage: "worker-preflight",
      progress: 0,
      message: "Worker 환경을 확인합니다.",
    },
    startedAt: Date.now(),
    completedAt: null,
  };
  renderQueue = renderQueue.map((item) =>
    item.id === jobId
      ? {
          ...item,
          status: "running",
          startedAt: currentJob.startedAt,
          progress: currentJob.progress,
          errorMessage: undefined,
        }
      : item
  );
  emitChange();

  return {
    jobId: currentJob.id,
    controller,
  };
}

export function attachExportRecordToRenderJob(jobId: string, exportRecordId: string) {
  renderQueue = renderQueue.map((item) =>
    item.id === jobId ? { ...item, exportRecordId } : item
  );
  emitChange();
}

export function updateExportJobProgress(progress: VideoExportProgress) {
  currentJob = {
    ...currentJob,
    progress,
  };
  renderQueue = renderQueue.map((item) =>
    item.id === currentJob.id ? { ...item, progress } : item
  );
  emitChange();
}

export function updateExportJobMessage({
  stage,
  progress,
  message,
}: {
  stage?: VideoExportStage;
  progress?: number;
  message: string;
}) {
  currentJob = {
    ...currentJob,
    progress: {
      ...currentJob.progress,
      stage: stage ?? currentJob.progress.stage,
      progress: progress ?? currentJob.progress.progress,
      message,
    },
  };
  renderQueue = renderQueue.map((item) =>
    item.id === currentJob.id ? { ...item, progress: currentJob.progress } : item
  );
  emitChange();
}

export function completeExportJob(progress: VideoExportProgress) {
  currentJob = {
    ...currentJob,
    status: "completed",
    progress,
    completedAt: Date.now(),
  };
  renderQueue = renderQueue.map((item) =>
    item.id === currentJob.id
      ? {
          ...item,
          status: "completed",
          progress,
          completedAt: currentJob.completedAt,
        }
      : item
  );
  emitChange();
}

export function cancelExportJob(message = "내보내기가 취소되었습니다.") {
  currentJob = {
    ...currentJob,
    status: "cancelled",
    progress: {
      stage: "cancelled",
      progress: 0,
      message,
    },
    completedAt: Date.now(),
  };
  renderQueue = renderQueue.map((item) =>
    item.id === currentJob.id
      ? {
          ...item,
          status: "cancelled",
          progress: currentJob.progress,
          completedAt: currentJob.completedAt,
        }
      : item
  );
  emitChange();
}

export function failExportJob(message: string) {
  currentJob = {
    ...currentJob,
    status: "failed",
    progress: {
      stage: "failed",
      progress: 0,
      message,
    },
    completedAt: Date.now(),
    errorMessage: message,
  };
  renderQueue = renderQueue.map((item) =>
    item.id === currentJob.id
      ? {
          ...item,
          status: "failed",
          progress: currentJob.progress,
          completedAt: currentJob.completedAt,
          errorMessage: message,
        }
      : item
  );
  emitChange();
}

export function cancelQueuedRenderJob(id: string) {
  renderQueue = renderQueue.map((item) =>
    item.id === id && item.status === "pending"
      ? {
          ...item,
          status: "cancelled",
          completedAt: Date.now(),
          progress: {
            stage: "cancelled",
            progress: 0,
            message: "대기 중인 내보내기가 취소되었습니다.",
          },
        }
      : item
  );
  emitChange();
}

export function retryRenderQueueJob(id: string) {
  renderQueue = renderQueue.map((item) =>
    item.id === id && (item.status === "failed" || item.status === "cancelled")
      ? {
          ...item,
          status: "pending",
          startedAt: null,
          completedAt: null,
          errorMessage: undefined,
          progress: {
            stage: "idle",
            progress: 0,
            message: "재시도 대기 중입니다.",
          },
        }
      : item
  );
  emitChange();
}
