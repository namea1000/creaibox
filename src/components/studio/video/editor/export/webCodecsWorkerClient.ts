import type { RenderJobSnapshot } from "./renderJobSnapshot";
import type {
  WebCodecsWorkerRequest,
  WebCodecsWorkerResponse,
} from "./webCodecsExportTypes";
import { createWebCodecsExportWorker } from "./webCodecsExportWorker";

export type WebCodecsWorkerClientResult = {
  usedWorker: boolean;
  fallbackToMainThread: boolean;
  workerRenderLoop: boolean;
  renderedFrames?: number;
  totalFrames?: number;
  outputBlob?: Blob;
  outputFileName?: string;
  reason?: string;
};

export type WebCodecsWorkerClientOptions = {
  jobId: string;
  snapshot: RenderJobSnapshot;
  renderMode?: "probe" | "full";
  signal?: AbortSignal;
  onProgress?: (progress: { progress: number; message: string }) => void;
};

export function runWebCodecsWorkerClient({
  jobId,
  snapshot,
  renderMode = "probe",
  signal,
  onProgress,
}: WebCodecsWorkerClientOptions): Promise<WebCodecsWorkerClientResult> {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return Promise.resolve({
      usedWorker: false,
      fallbackToMainThread: true,
      workerRenderLoop: false,
      reason: "Worker를 사용할 수 없는 환경입니다.",
    });
  }

  if (signal?.aborted) {
    return Promise.reject(new DOMException("Export cancelled", "AbortError"));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let workerRef: Worker | null = null;
    let urlRef: string | null = null;

    const cleanup = () => {
      signal?.removeEventListener("abort", handleAbort);
      if (workerRef) workerRef.terminate();
      if (urlRef) URL.revokeObjectURL(urlRef);
      workerRef = null;
      urlRef = null;
    };

    const settleResolve = (result: WebCodecsWorkerClientResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const settleReject = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    function postMessage(message: WebCodecsWorkerRequest) {
      workerRef?.postMessage(message);
    }

    function handleAbort() {
      postMessage({ type: "cancel", jobId });
      settleReject(new DOMException("Export cancelled", "AbortError"));
    }

    try {
      const { worker, url } = createWebCodecsExportWorker();
      workerRef = worker;
      urlRef = url;

      worker.onmessage = (event: MessageEvent<WebCodecsWorkerResponse>) => {
        const message = event.data;
        if (!message || message.jobId !== jobId) return;

        if (message.type === "progress") {
          onProgress?.({
            progress: message.progress,
            message: message.message,
          });
          return;
        }

        if (message.type === "complete") {
          settleResolve({
            usedWorker: true,
            fallbackToMainThread: message.fallbackToMainThread,
            workerRenderLoop: message.workerRenderLoop,
            renderedFrames: message.renderedFrames,
            totalFrames: message.totalFrames,
            outputBlob: message.outputBlob,
            outputFileName: message.outputFileName,
            reason: message.reason,
          });
          return;
        }

        if (message.type === "cancel") {
          settleReject(new DOMException(message.message || "Export cancelled", "AbortError"));
          return;
        }

        settleResolve({
          usedWorker: true,
          fallbackToMainThread: true,
          workerRenderLoop: false,
          reason: message.message,
        });
      };

      worker.onerror = () => {
        settleResolve({
          usedWorker: true,
          fallbackToMainThread: true,
          workerRenderLoop: false,
          reason: "WebCodecs Worker 실행 중 오류가 발생해 main-thread로 fallback합니다.",
        });
      };

      signal?.addEventListener("abort", handleAbort, { once: true });
      postMessage({ type: "start", jobId, snapshot, renderMode });
    } catch {
      settleResolve({
        usedWorker: false,
        fallbackToMainThread: true,
        workerRenderLoop: false,
        reason: "WebCodecs Worker를 생성하지 못해 main-thread로 fallback합니다.",
      });
    }
  });
}
