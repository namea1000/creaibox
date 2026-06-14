import type { CanvasRatio } from "../VideoEditorContext";
import type { ExportFps, ExportQuality, ExportResolution } from "../types";
import { getEstimatedFrameCount, getExportLoadLevel } from "./exportBitratePresets";
import { detectDirectMp4Support, type DirectMp4Support } from "./directMp4Support";
import type { VideoExportEngine } from "./exportTypes";
import { detectStaticWorkerSupport, type ExportWorkerSupport } from "./exportWorkerSupport";
import {
  detectWebCodecsAudioSupport,
  isWebCodecsConfigSupported,
  type WebCodecsAudioSupport,
  type WebCodecsSupport,
} from "./webCodecsSupport";
import {
  detectWebGPURendererSupport,
  type WebGPURendererSupport,
} from "../render/webgpuRenderer";

export type RenderPreflightRiskLevel = "low" | "medium" | "high" | "extreme";

export type RenderPreflightInput = {
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  duration: number;
  canvasRatio: CanvasRatio;
  width: number;
  height: number;
  bitrate: number;
  hasAudio: boolean;
  hasVideo: boolean;
  usesWebGLEffects: boolean;
  isVisualizerFastPath?: boolean;
};

export type RenderPreflightMediaRecorderSupport = {
  supported: boolean;
  selectedMimeType?: string;
  supportedMimeTypes: string[];
  unsupportedMimeTypes: string[];
  reason?: string;
};

export type RenderPreflightWebGLSupport = {
  supported: boolean;
  maxTextureSize?: number;
  maxRenderbufferSize?: number;
  maxViewportDims?: [number, number];
  targetFitsTextureLimit?: boolean;
  targetFitsRenderbufferLimit?: boolean;
  targetFitsViewportLimit?: boolean;
  reason?: string;
};

export type RenderPreflightCanvasSupport = {
  supported: boolean;
  width: number;
  height: number;
  pixels: number;
  reason?: string;
};

export type RenderPreflightMemoryEstimate = {
  estimatedBytes: number;
  estimatedMegabytes: number;
  deviceMemoryGb?: number;
  hardwareConcurrency?: number;
};

export type RenderPreflightCapabilities = {
  worker: ExportWorkerSupport;
  webCodecs: WebCodecsSupport;
  webGPU: WebGPURendererSupport;
  webGL: RenderPreflightWebGLSupport;
  canvas: RenderPreflightCanvasSupport;
  mediaRecorder: RenderPreflightMediaRecorderSupport;
  memory: RenderPreflightMemoryEstimate;
  audioEncoder: WebCodecsAudioSupport;
  directMp4: DirectMp4Support;
};

export type RenderPreflightEstimates = {
  totalFrames: number;
  durationSeconds: number;
  bitrate: number;
  estimatedMemoryBytes: number;
  estimatedMemoryMegabytes: number;
};

export type RenderPreflightResult = {
  canRender: boolean;
  riskLevel: RenderPreflightRiskLevel;
  blockingReasons: string[];
  warnings: string[];
  recommendations: string[];
  capabilities: RenderPreflightCapabilities;
  estimates: RenderPreflightEstimates;
};

export const MEDIA_RECORDER_MIME_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

const RISK_ORDER: Record<RenderPreflightRiskLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  extreme: 3,
};

const MEMORY_BUFFER_MULTIPLIER = 6;
const LONG_DURATION_WARNING_SECONDS = 60 * 60;
const EXTREME_DURATION_WARNING_SECONDS = 12 * 60 * 60;

export async function runRenderPreflight(
  input: RenderPreflightInput,
): Promise<RenderPreflightResult> {
  const worker = detectStaticWorkerSupport();
  const webCodecs = await isWebCodecsConfigSupported({
    codec: "vp8",
    width: input.width,
    height: input.height,
    fps: input.fps,
    bitrate: input.bitrate,
    bitrateMode: "variable",
  });
  const webGPU = detectWebGPURendererSupport();
  const webGL = detectRenderWebGLSupport(input.width, input.height);
  const canvas = detectCanvasAllocationSupport(input.width, input.height);
  const mediaRecorder = detectMediaRecorderSupport();
  const audioEncoder = await detectWebCodecsAudioSupport();
  const directMp4 = await detectDirectMp4Support({
    width: input.width,
    height: input.height,
    fps: input.fps,
    bitrate: input.bitrate,
    hasAudio: input.hasAudio,
  });
  const memory = estimateRenderMemory(input.width, input.height);
  const totalFrames = getEstimatedFrameCount(input.duration, input.fps);
  const blockingReasons: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (!canvas.supported) {
    blockingReasons.push(canvas.reason || "선택한 해상도의 render canvas를 생성할 수 없습니다.");
  }

  const needsMediaRecorder =
    input.engine === "quick-webm" ||
    input.engine === "compatible-mp4" ||
    input.engine === "direct-mp4" ||
    !isFastWebCodecsPolicyCompatible(input, webCodecs);

  if (needsMediaRecorder && !mediaRecorder.supported) {
    blockingReasons.push(
      mediaRecorder.reason || "MediaRecorder WebM 인코딩을 지원하지 않는 브라우저입니다.",
    );
  }

  if (input.engine === "fast-webcodecs") {
    const fastPolicyReason = getFastWebCodecsPolicyWarning(input);

    if (fastPolicyReason) {
      warnings.push(fastPolicyReason);
      recommendations.push("Quick WebM 또는 Compatible MP4 엔진을 사용하면 현재 설정을 유지할 수 있습니다.");
    }

    if (!webCodecs.supported) {
      warnings.push(webCodecs.reason || "Fast WebCodecs를 사용할 수 없습니다.");
      recommendations.push("Fast WebCodecs 실패 시 Quick WebM fallback을 사용하세요.");
    }

    if (webCodecs.supported && isFastWebCodecsExperimental(input)) {
      warnings.push("현재 WebCodecs 설정은 experimental 경로입니다. 실패 시 Quick WebM fallback을 사용하세요.");
    }
  }

  if (input.engine === "direct-mp4") {
    if (directMp4.supported) {
      warnings.push("Direct MP4 H.264/AAC capability가 감지되었습니다. 현재 설정은 WebM 중간 파일 없이 MP4 직접 mux를 시도할 수 있습니다.");
      recommendations.push("Direct MP4 mux 또는 오디오 mixdown이 실패하면 기존 Compatible MP4 fallback으로 완성 파일을 생성합니다.");
    } else {
      warnings.push(directMp4.reason || "현재 설정에서 Direct MP4 H.264/AAC capability가 완전하지 않습니다.");
      recommendations.push("Direct MP4 직접 mux가 실패하거나 미지원이면 Compatible MP4 fallback으로 오디오 포함 MP4를 생성합니다.");
    }

    if (!directMp4.video.supported) {
      warnings.push(directMp4.video.reason || "H.264 VideoEncoder target config를 지원하지 않습니다.");
    }

    if (input.hasAudio && !directMp4.audio.supported) {
      warnings.push(directMp4.audio.reason || "AAC AudioEncoder target config를 지원하지 않습니다.");
    }

    if (!directMp4.muxer.supported) {
      warnings.push(directMp4.muxer.reason || "Mediabunny MP4 muxer를 사용할 수 없습니다.");
    }
  }

  if (!worker.supported) {
    warnings.push(worker.reason || "Worker preflight를 통과하지 못했습니다.");
    recommendations.push("Worker가 불안정하면 기존 main-thread export 경로를 사용하세요.");
  } else if (!worker.offscreenCanvas) {
    warnings.push("Worker는 지원하지만 OffscreenCanvas는 지원하지 않습니다.");
  }

  if (input.usesWebGLEffects) {
    if (!webGPU.supported) {
      warnings.push(webGPU.reason || "WebGPU renderer를 사용할 수 없습니다.");
      recommendations.push("WebGPU가 없어도 WebGL effects 또는 Canvas2D fallback으로 export를 계속 시도합니다.");
    }

    if (!webGL.supported) {
      warnings.push(webGL.reason || "WebGL effects renderer를 사용할 수 없습니다.");
      recommendations.push("Export는 Canvas filter fallback으로 계속 시도할 수 있습니다.");
    } else {
      if (webGL.targetFitsTextureLimit === false) {
        warnings.push("선택한 render 크기가 WebGL MAX_TEXTURE_SIZE를 초과합니다.");
      }
      if (webGL.targetFitsRenderbufferLimit === false) {
        warnings.push("선택한 render 크기가 WebGL MAX_RENDERBUFFER_SIZE를 초과합니다.");
      }
      if (webGL.targetFitsViewportLimit === false) {
        warnings.push("선택한 render 크기가 WebGL MAX_VIEWPORT_DIMS를 초과합니다.");
      }
    }
  }

  if (input.resolution === "4k" || (input.resolution === "2k" && input.fps === 60)) {
    warnings.push("2K/4K 또는 60fps export는 브라우저와 GPU 부하가 큽니다.");
  }

  if (input.resolution === "4k" && input.fps === 60) {
    warnings.push("4K 60fps export는 저사양 PC에서 실패하거나 매우 오래 걸릴 수 있습니다.");
    recommendations.push("먼저 4K 30fps 또는 1080p 30fps로 낮춰 export하는 것을 권장합니다.");
  }

  if (input.resolution === "4k" && input.duration >= EXTREME_DURATION_WARNING_SECONDS) {
    blockingReasons.push("12시간 이상 4K export는 브라우저 export 안정성상 차단되었습니다.");
    recommendations.push("초장시간 영상은 1080p 30fps로 낮춰 export하세요.");
  } else if (input.resolution === "4k" && input.duration >= LONG_DURATION_WARNING_SECONDS) {
    warnings.push("1시간 이상 4K export는 파일 크기, 탭 유지, 메모리 압박 위험이 큽니다.");
    recommendations.push("장시간 4K는 1440p 30fps 또는 1080p 30fps fallback을 권장합니다.");
  }

  if (input.duration >= EXTREME_DURATION_WARNING_SECONDS) {
    warnings.push("12시간 이상 장시간 영상은 브라우저 export 중단, 탭 절전, 메모리 부족 위험이 큽니다.");
  } else if (input.duration >= LONG_DURATION_WARNING_SECONDS) {
    warnings.push("1시간 이상 장시간 영상은 실시간 길이 이상으로 렌더링될 수 있습니다.");
  }

  const memoryWarning = getMemoryWarning(memory);
  if (memoryWarning) warnings.push(memoryWarning);

  if (input.resolution === "4k" && memory.deviceMemoryGb && memory.deviceMemoryGb <= 4) {
    warnings.push("deviceMemory가 4GB 이하로 감지되어 4K export 실패 가능성이 높습니다.");
    recommendations.push("저메모리 환경에서는 1080p export를 권장합니다.");
  }

  if (input.resolution === "4k" && memory.hardwareConcurrency && memory.hardwareConcurrency <= 4) {
    warnings.push("CPU 논리 코어 수가 낮아 4K export 시간이 크게 늘어날 수 있습니다.");
  }

  if (!input.hasVideo) {
    warnings.push("비디오/이미지 소스가 없는 프로젝트입니다. 오디오 또는 텍스트 중심 출력인지 확인하세요.");
  }

  if (input.hasAudio && input.engine === "fast-webcodecs") {
    warnings.push(
      audioEncoder.supported
        ? "AudioEncoder는 지원되지만 WebM audio mux가 아직 없어 Quick WebM/MP4 fallback을 사용합니다."
        : "현재 브라우저에서 WebCodecs AudioEncoder가 준비되지 않아 Quick WebM/MP4 fallback을 사용합니다."
    );
    recommendations.push("오디오 포함 파일은 현재 Quick WebM 또는 Compatible MP4 경로를 사용하세요.");
  }

  const loadRisk = getExportLoadLevel({
    resolution: input.resolution,
    fps: input.fps,
    duration: input.duration,
  }) as RenderPreflightRiskLevel;
  const capabilityRisk = getCapabilityRisk(input, webGL, memory, mediaRecorder, webCodecs);
  const riskLevel = maxRisk(loadRisk, capabilityRisk, blockingReasons.length > 0 ? "extreme" : "low");

  if (riskLevel === "high" || riskLevel === "extreme") {
    recommendations.push("문제가 생기면 1080p 30fps 또는 표준 품질로 낮춰 다시 시도하세요.");
  }

  return {
    canRender: blockingReasons.length === 0,
    riskLevel,
    blockingReasons,
    warnings: dedupe(warnings),
    recommendations: dedupe(recommendations),
    capabilities: {
      worker,
      webCodecs,
      webGPU,
      webGL,
      canvas,
      mediaRecorder,
      memory,
      audioEncoder,
      directMp4,
    },
    estimates: {
      totalFrames,
      durationSeconds: input.duration,
      bitrate: input.bitrate,
      estimatedMemoryBytes: memory.estimatedBytes,
      estimatedMemoryMegabytes: memory.estimatedMegabytes,
    },
  };
}

export function detectMediaRecorderSupport(): RenderPreflightMediaRecorderSupport {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return {
      supported: false,
      supportedMimeTypes: [],
      unsupportedMimeTypes: [...MEDIA_RECORDER_MIME_CANDIDATES],
      reason: "MediaRecorder를 사용할 수 없는 환경입니다.",
    };
  }

  const supportedMimeTypes = MEDIA_RECORDER_MIME_CANDIDATES.filter((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
  const unsupportedMimeTypes = MEDIA_RECORDER_MIME_CANDIDATES.filter(
    (mimeType) => !supportedMimeTypes.includes(mimeType),
  );

  return {
    supported: supportedMimeTypes.length > 0,
    selectedMimeType: supportedMimeTypes[0],
    supportedMimeTypes,
    unsupportedMimeTypes,
    reason:
      supportedMimeTypes.length > 0
        ? undefined
        : "지원되는 WebM MediaRecorder MIME type을 찾지 못했습니다.",
  };
}

export function detectRenderWebGLSupport(
  width: number,
  height: number,
): RenderPreflightWebGLSupport {
  if (typeof document === "undefined") {
    return { supported: false, reason: "브라우저 환경이 아닙니다." };
  }

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

  if (!gl) {
    return { supported: false, reason: "WebGL context를 생성할 수 없습니다." };
  }

  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number;
  const viewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array | number[];
  const maxViewportDims: [number, number] = [Number(viewportDims[0] || 0), Number(viewportDims[1] || 0)];
  const maxTargetSide = Math.max(width, height);

  return {
    supported: true,
    maxTextureSize,
    maxRenderbufferSize,
    maxViewportDims,
    targetFitsTextureLimit: maxTargetSide <= maxTextureSize,
    targetFitsRenderbufferLimit: maxTargetSide <= maxRenderbufferSize,
    targetFitsViewportLimit: width <= maxViewportDims[0] && height <= maxViewportDims[1],
  };
}

export function detectCanvasAllocationSupport(
  width: number,
  height: number,
): RenderPreflightCanvasSupport {
  const pixels = Math.max(0, width) * Math.max(0, height);

  if (typeof document === "undefined") {
    return {
      supported: false,
      width,
      height,
      pixels,
      reason: "브라우저 환경이 아닙니다.",
    };
  }

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return {
      supported: false,
      width,
      height,
      pixels,
      reason: "Render canvas 크기가 올바르지 않습니다.",
    };
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    const context = canvas.getContext("2d");
    if (!context || canvas.width !== Math.floor(width) || canvas.height !== Math.floor(height)) {
      return {
        supported: false,
        width,
        height,
        pixels,
        reason: "2D render canvas context를 생성하지 못했습니다.",
      };
    }

    context.fillRect(0, 0, 1, 1);

    return {
      supported: true,
      width: canvas.width,
      height: canvas.height,
      pixels,
    };
  } catch {
    return {
      supported: false,
      width,
      height,
      pixels,
      reason: "Render canvas allocation 검사 중 오류가 발생했습니다.",
    };
  }
}

export function estimateRenderMemory(width: number, height: number): RenderPreflightMemoryEstimate {
  const pixels = Math.max(0, width) * Math.max(0, height);
  const estimatedBytes = pixels * 4 * MEMORY_BUFFER_MULTIPLIER;
  const navigatorMemory = getNavigatorDeviceMemory();

  return {
    estimatedBytes,
    estimatedMegabytes: Math.round(estimatedBytes / 1024 / 1024),
    deviceMemoryGb: navigatorMemory.deviceMemoryGb,
    hardwareConcurrency: navigatorMemory.hardwareConcurrency,
  };
}

export function isFastWebCodecsPolicyCompatible(
  input: RenderPreflightInput,
  webCodecs?: WebCodecsSupport,
) {
  if (input.engine !== "fast-webcodecs" || input.hasAudio || webCodecs?.supported === false) {
    return false;
  }

  if (input.resolution === "720p" || input.resolution === "1080p") {
    return input.fps === 30 || input.fps === 24 || input.fps === 60;
  }

  if (input.resolution === "2k" || input.resolution === "4k") {
    return webCodecs?.supported === true && input.fps !== 60;
  }

  return false;
}

export function isFastWebCodecsExperimental(input: RenderPreflightInput) {
  return (
    input.engine === "fast-webcodecs" &&
    (input.fps !== 30 || input.resolution === "2k" || input.resolution === "4k")
  );
}

function getFastWebCodecsPolicyWarning(input: RenderPreflightInput) {
  if (input.engine !== "fast-webcodecs") return null;
  if (input.hasAudio) return "현재 Fast WebCodecs는 video-only 정책이라 오디오 포함 export에 적합하지 않습니다.";
  if (input.fps === 60) return "Fast WebCodecs 60fps는 experimental이며 실패 시 Quick WebM으로 fallback합니다.";
  if (input.resolution === "2k" || input.resolution === "4k") {
    return "Fast WebCodecs 2K/4K는 target config와 preflight가 통과할 때만 experimental로 시도합니다.";
  }
  if (input.fps !== 30) {
    return "Fast WebCodecs 기본 권장 설정은 720p/1080p 30fps입니다.";
  }
  return null;
}

function getNavigatorDeviceMemory() {
  if (typeof navigator === "undefined") return {};

  return {
    deviceMemoryGb: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
}

function getMemoryWarning(memory: RenderPreflightMemoryEstimate) {
  if (!memory.deviceMemoryGb) {
    return memory.estimatedMegabytes >= 512
      ? "브라우저가 deviceMemory를 제공하지 않습니다. 고해상도 export 메모리 여유를 확인하세요."
      : null;
  }

  const deviceBytes = memory.deviceMemoryGb * 1024 * 1024 * 1024;
  if (memory.estimatedBytes >= deviceBytes * 0.35) {
    return "예상 render buffer 메모리가 기기 메모리 대비 높습니다.";
  }

  if (memory.deviceMemoryGb <= 4 && memory.estimatedMegabytes >= 256) {
    return "4GB 이하 메모리 기기에서 고해상도 export가 불안정할 수 있습니다.";
  }

  return null;
}

function getCapabilityRisk(
  input: RenderPreflightInput,
  webGL: RenderPreflightWebGLSupport,
  memory: RenderPreflightMemoryEstimate,
  mediaRecorder: RenderPreflightMediaRecorderSupport,
  webCodecs: WebCodecsSupport,
): RenderPreflightRiskLevel {
  if (!mediaRecorder.supported && !isFastWebCodecsPolicyCompatible(input, webCodecs)) return "extreme";
  if (input.engine === "fast-webcodecs" && !webCodecs.supported && !mediaRecorder.supported) return "extreme";
  if (input.usesWebGLEffects && webGL.supported) {
    if (
      webGL.targetFitsTextureLimit === false ||
      webGL.targetFitsRenderbufferLimit === false ||
      webGL.targetFitsViewportLimit === false
    ) {
      return "high";
    }
  }
  if (input.resolution === "4k" && input.fps === 60) return input.engine === "fast-webcodecs" ? "high" : "extreme";
  if (input.duration >= EXTREME_DURATION_WARNING_SECONDS) return "extreme";
  if (input.engine === "fast-webcodecs" && webCodecs.supported && !input.hasAudio) {
    if (input.fps === 60) return "high";
    if (input.resolution === "4k") {
      if (memory.deviceMemoryGb && memory.deviceMemoryGb <= 4) return "high";
      if (input.duration >= LONG_DURATION_WARNING_SECONDS) return "high";
      return "medium";
    }
    if (input.resolution === "2k") return "medium";
  }
  if (memory.deviceMemoryGb && memory.deviceMemoryGb <= 4 && input.resolution === "4k") return "high";
  if (input.resolution === "4k" || input.fps === 60) return "high";
  if (input.resolution === "2k") return "medium";
  return "low";
}

function maxRisk(...levels: RenderPreflightRiskLevel[]) {
  return levels.reduce<RenderPreflightRiskLevel>((max, level) => {
    return RISK_ORDER[level] > RISK_ORDER[max] ? level : max;
  }, "low");
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}
