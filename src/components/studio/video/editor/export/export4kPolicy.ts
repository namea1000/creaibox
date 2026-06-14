import type { ExportBenchmarkResult } from "./exportBenchmark";
import type { VideoExportEngine } from "./exportTypes";
import type { RenderPreflightResult, RenderPreflightRiskLevel } from "./renderPreflight";
import type { ExportFps, ExportQuality, ExportResolution } from "../types";

export type Export4kFallbackAction =
  | "set-1080p"
  | "set-1440p"
  | "set-30fps"
  | "set-quick-webm"
  | "set-compatible-mp4";

export type Export4kFallbackRecommendation = {
  action: Export4kFallbackAction;
  label: string;
  reason: string;
};

export type Export4kPolicyInput = {
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  preflight?: RenderPreflightResult | null;
  benchmark?: ExportBenchmarkResult | null;
};

export type Export4kPolicyResult = {
  applies: boolean;
  status: "allowed" | "warning" | "blocked";
  riskLevel: RenderPreflightRiskLevel;
  title: string;
  reasons: string[];
  fallbackRecommendations: Export4kFallbackRecommendation[];
  estimatedFileSizeBytes: number;
  estimatedFileSizeLabel: string;
};

const ONE_HOUR_SECONDS = 60 * 60;
const TWELVE_HOURS_SECONDS = 12 * ONE_HOUR_SECONDS;

export function assess4kExportPolicy(input: Export4kPolicyInput): Export4kPolicyResult {
  const applies = input.resolution === "4k" || input.width >= 3840 || input.height >= 3840;
  const reasons: string[] = [];
  const fallbackRecommendations: Export4kFallbackRecommendation[] = [];
  let status: Export4kPolicyResult["status"] = "allowed";
  let riskLevel: RenderPreflightRiskLevel = input.preflight?.riskLevel ?? input.benchmark?.riskLevel ?? "low";

  if (!applies) {
    return {
      applies: false,
      status,
      riskLevel,
      title: "4K 정책 비활성",
      reasons,
      fallbackRecommendations,
      estimatedFileSizeBytes: estimateFileSizeBytes(input.bitrate, input.duration),
      estimatedFileSizeLabel: formatFileSize(estimateFileSizeBytes(input.bitrate, input.duration)),
    };
  }

  if (input.width === 3840 && input.height === 2160) {
    reasons.push("3840x2160 landscape 4K export입니다.");
  } else if (input.width === 2160 && input.height === 3840) {
    reasons.push("2160x3840 vertical 4K export입니다.");
  } else {
    reasons.push(`${input.width}x${input.height} 4K급 export입니다.`);
  }

  if (input.fps === 60) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("4K 60fps는 브라우저 메모리와 encoder 부하가 매우 큽니다.");
    fallbackRecommendations.push({
      action: "set-30fps",
      label: "30fps로 낮추기",
      reason: "4K60 실패 가능성이 높으므로 4K30을 먼저 권장합니다.",
    });
  }

  if (input.duration >= TWELVE_HOURS_SECONDS) {
    status = "blocked";
    riskLevel = "extreme";
    reasons.push("12시간 이상 4K export는 브라우저 탭 유지, 메모리, 저장 실패 위험이 너무 큽니다.");
    fallbackRecommendations.push({
      action: "set-1080p",
      label: "1080p로 낮추기",
      reason: "초장시간 영상은 1080p export가 가장 안전합니다.",
    });
  } else if (input.duration >= ONE_HOUR_SECONDS) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("1시간 이상 4K export는 실시간 길이 이상으로 걸릴 수 있습니다.");
    fallbackRecommendations.push({
      action: "set-1440p",
      label: "1440p로 낮추기",
      reason: "4K 장시간 export가 불안정하면 1440p30을 권장합니다.",
    });
  }

  const memory = input.preflight?.capabilities.memory;
  if (memory?.deviceMemoryGb && memory.deviceMemoryGb <= 4) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("deviceMemory가 4GB 이하로 감지되어 4K export 안정성이 낮습니다.");
    fallbackRecommendations.push({
      action: "set-1080p",
      label: "1080p로 낮추기",
      reason: "저메모리 환경에서는 1080p가 안전합니다.",
    });
  }

  if (memory?.hardwareConcurrency && memory.hardwareConcurrency <= 4) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("CPU 논리 코어 수가 낮아 4K 렌더 시간이 길어질 수 있습니다.");
  }

  const webGL = input.preflight?.capabilities.webGL;
  if (
    webGL?.targetFitsTextureLimit === false ||
    webGL?.targetFitsRenderbufferLimit === false ||
    webGL?.targetFitsViewportLimit === false
  ) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("WebGL texture/renderbuffer/viewport limit이 4K target을 안전하게 감당하지 못할 수 있습니다.");
    fallbackRecommendations.push({
      action: "set-1440p",
      label: "1440p로 낮추기",
      reason: "WebGL limit 위험이 있으면 1440p가 안전합니다.",
    });
  }

  if (input.preflight?.capabilities.canvas.supported === false) {
    status = "blocked";
    riskLevel = "extreme";
    reasons.push("4K canvas allocation 검사에 실패했습니다.");
    fallbackRecommendations.push({
      action: "set-1080p",
      label: "1080p로 낮추기",
      reason: "canvas allocation 실패 시 1080p로 낮춰야 합니다.",
    });
  }

  if (input.engine === "fast-webcodecs" && input.preflight?.capabilities.webCodecs.supported === false) {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "high");
    reasons.push("WebCodecs 4K target config를 지원하지 않습니다.");
    fallbackRecommendations.push({
      action: "set-quick-webm",
      label: "Quick WebM 사용",
      reason: "WebCodecs 4K가 불가하면 Quick WebM 4K를 먼저 시도합니다.",
    });
  }

  if (input.engine === "direct-mp4") {
    const directMp4 = input.preflight?.capabilities.directMp4;

    if (directMp4?.supported === false) {
      status = maxStatus(status, "warning");
      riskLevel = maxRisk(riskLevel, "high");
      reasons.push(directMp4.reason || "Direct MP4 H.264/AAC/Mediabunny capability가 4K 설정을 완전히 지원하지 않습니다.");

      if (input.preflight?.capabilities.mediaRecorder.supported === false) {
        status = "blocked";
        riskLevel = "extreme";
        reasons.push("Direct MP4와 Compatible MP4 fallback이 모두 준비되지 않아 4K MP4 export를 시작할 수 없습니다.");
        fallbackRecommendations.push({
          action: "set-1080p",
          label: "1080p로 낮추기",
          reason: "직접 MP4와 fallback이 모두 불안정하면 1080p에서 다시 확인하세요.",
        });
      } else {
        fallbackRecommendations.push({
          action: "set-compatible-mp4",
          label: "Compatible MP4 사용",
          reason: "Direct MP4 capability가 부족하면 기존 MP4 fallback 경로가 더 안전합니다.",
        });
      }
    }

    if (directMp4?.video.supported === false) {
      reasons.push(directMp4.video.reason || "H.264 4K target config를 지원하지 않습니다.");
    }

    if (input.preflight?.capabilities.memory.estimatedMegabytes && input.preflight.capabilities.memory.estimatedMegabytes >= 768) {
      status = maxStatus(status, "warning");
      riskLevel = maxRisk(riskLevel, "high");
      reasons.push("Direct MP4 4K는 video/audio encode buffer와 MP4 mux buffer가 함께 필요해 메모리 압박이 커질 수 있습니다.");
    }
  }

  if (
    (input.engine === "quick-webm" || input.engine === "compatible-mp4") &&
    input.preflight?.capabilities.mediaRecorder.supported === false
  ) {
    status = "blocked";
    riskLevel = "extreme";
    reasons.push("MediaRecorder WebM MIME 지원이 없어 Quick WebM/MP4 4K export를 시작할 수 없습니다.");
    fallbackRecommendations.push({
      action: "set-1080p",
      label: "1080p로 낮추기",
      reason: "MediaRecorder 지원이 불안정하면 낮은 해상도에서 다시 확인하세요.",
    });
  }

  if (input.benchmark?.riskLevel === "extreme") {
    status = maxStatus(status, "warning");
    riskLevel = maxRisk(riskLevel, "extreme");
    reasons.push("benchmark 기준 예상 렌더 부하가 extreme입니다.");
  }

  if (status !== "blocked" && input.fps === 30 && riskLevel === "high") {
    fallbackRecommendations.push({
      action: "set-1440p",
      label: "1440p로 낮추기",
      reason: "4K30도 high risk면 1440p30을 권장합니다.",
    });
  }

  if (fallbackRecommendations.length === 0) {
    fallbackRecommendations.push({
      action: "set-1080p",
      label: "1080p로 낮추기",
      reason: "문제가 생기면 1080p가 가장 안전한 fallback입니다.",
    });
  }

  const estimatedFileSizeBytes = estimateFileSizeBytes(input.bitrate, input.duration);

  return {
    applies,
    status,
    riskLevel,
    title: status === "blocked" ? "4K export 차단" : "4K export 안전 점검",
    reasons: dedupe(reasons),
    fallbackRecommendations: dedupeRecommendations(fallbackRecommendations),
    estimatedFileSizeBytes,
    estimatedFileSizeLabel: formatFileSize(estimatedFileSizeBytes),
  };
}

export function estimateFileSizeBytes(bitrate: number, duration: number) {
  return Math.max(0, Math.round((bitrate * Math.max(0, duration)) / 8));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(0, Math.round(bytes / 1024))}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)}MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
}

export function getExportFailureGuidance(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "알 수 없는 오류");
  const normalized = message.toLowerCase();

  if (normalized.includes("canvas") || normalized.includes("allocation")) {
    return "Canvas allocation 실패 가능성이 있습니다. 1080p 또는 1440p로 낮춰 다시 시도하세요.";
  }
  if (normalized.includes("mime") || normalized.includes("mediarecorder")) {
    return "MediaRecorder MIME 지원 문제일 수 있습니다. Quick WebM MIME 지원을 확인하거나 MP4 대신 WebM으로 시도하세요.";
  }
  if (normalized.includes("mediabunny") || normalized.includes("direct mp4") || normalized.includes("mux")) {
    return "Direct MP4 mux 경로 문제일 수 있습니다. Compatible MP4 fallback을 사용하거나 1080p30으로 낮춰 다시 시도하세요.";
  }
  if (normalized.includes("aac") || normalized.includes("audioencoder") || normalized.includes("offlineaudiocontext") || normalized.includes("audio mixdown")) {
    return "AAC 오디오 인코딩 또는 OfflineAudioContext mixdown 문제일 수 있습니다. Compatible MP4 fallback으로 오디오를 보존하거나 오디오 소스를 줄여 다시 시도하세요.";
  }
  if (normalized.includes("encoder") || normalized.includes("webcodecs") || normalized.includes("videoencoder")) {
    return "Encoder target config 문제일 수 있습니다. Quick WebM으로 전환하거나 4K30/1080p30으로 낮춰 보세요.";
  }
  if (normalized.includes("memory") || normalized.includes("out of") || normalized.includes("quota")) {
    return "메모리 압박 가능성이 있습니다. 해상도/FPS를 낮추고 다른 탭을 닫은 뒤 다시 시도하세요.";
  }
  if (normalized.includes("worker")) {
    if (normalized.includes("encode") || normalized.includes("webcodecs")) {
      return "Worker WebCodecs 인코딩 경로 문제가 감지됐습니다. main-thread WebCodecs 또는 Quick WebM fallback으로 다시 시도하세요.";
    }
    return "Worker 경로 문제가 감지됐습니다. main-thread fallback 또는 Quick WebM으로 다시 시도하세요.";
  }

  return "원인을 특정하기 어렵습니다. 1080p30 또는 Quick WebM으로 낮춰 다시 시도하세요.";
}

function maxStatus(
  current: Export4kPolicyResult["status"],
  next: Export4kPolicyResult["status"],
) {
  const order: Record<Export4kPolicyResult["status"], number> = {
    allowed: 0,
    warning: 1,
    blocked: 2,
  };
  return order[next] > order[current] ? next : current;
}

function maxRisk(current: RenderPreflightRiskLevel, next: RenderPreflightRiskLevel) {
  const order: Record<RenderPreflightRiskLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
    extreme: 3,
  };
  return order[next] > order[current] ? next : current;
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function dedupeRecommendations(values: Export4kFallbackRecommendation[]) {
  const seen = new Set<Export4kFallbackAction>();
  return values.filter((value) => {
    if (seen.has(value.action)) return false;
    seen.add(value.action);
    return true;
  });
}
