export type ExportWorkerSupport = {
  supported: boolean;
  offscreenCanvas: boolean;
  reason?: string;
};

type WorkerResponse = {
  type: "ready";
  offscreenCanvas: boolean;
};

function createPreflightWorker() {
  const source = `
    self.onmessage = function(event) {
      if (!event.data || event.data.type !== "preflight") return;
      self.postMessage({
        type: "ready",
        offscreenCanvas: typeof OffscreenCanvas !== "undefined"
      });
    };
  `;
  const blob = new Blob([source], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  try {
    return {
      worker: new Worker(url),
      url,
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export function detectStaticWorkerSupport(): ExportWorkerSupport {
  if (typeof window === "undefined") {
    return {
      supported: false,
      offscreenCanvas: false,
      reason: "브라우저 환경이 아닙니다.",
    };
  }

  if (typeof Worker === "undefined") {
    return {
      supported: false,
      offscreenCanvas: false,
      reason: "Worker를 지원하지 않는 브라우저입니다.",
    };
  }

  return {
    supported: true,
    offscreenCanvas: typeof OffscreenCanvas !== "undefined",
  };
}

export function runExportWorkerPreflight(timeoutMs = 1200): Promise<ExportWorkerSupport> {
  const staticSupport = detectStaticWorkerSupport();
  if (!staticSupport.supported) return Promise.resolve(staticSupport);

  return new Promise((resolve) => {
    let settled = false;
    let workerRef: Worker | null = null;
    let urlRef: string | null = null;

    const cleanup = () => {
      if (workerRef) workerRef.terminate();
      if (urlRef) URL.revokeObjectURL(urlRef);
      workerRef = null;
      urlRef = null;
    };

    const settle = (support: ExportWorkerSupport) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(support);
    };

    try {
      const { worker, url } = createPreflightWorker();
      workerRef = worker;
      urlRef = url;

      const timeoutId = window.setTimeout(() => {
        settle({
          supported: false,
          offscreenCanvas: false,
          reason: "Worker 응답 시간이 초과되었습니다.",
        });
      }, timeoutMs);

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        window.clearTimeout(timeoutId);
        if (event.data?.type === "ready") {
          settle({
            supported: true,
            offscreenCanvas: event.data.offscreenCanvas,
          });
          return;
        }

        settle({
          supported: false,
          offscreenCanvas: false,
          reason: "Worker preflight 응답이 올바르지 않습니다.",
        });
      };

      worker.onerror = () => {
        window.clearTimeout(timeoutId);
        settle({
          supported: false,
          offscreenCanvas: false,
          reason: "Worker 실행 중 오류가 발생했습니다.",
        });
      };

      worker.postMessage({ type: "preflight" });
    } catch {
      settle({
        supported: false,
        offscreenCanvas: false,
        reason: "Worker를 생성하지 못했습니다.",
      });
    }
  });
}
