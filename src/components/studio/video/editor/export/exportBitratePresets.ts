import type { ExportFps, ExportQuality, ExportResolution } from "../types";

type BitratePreset = Record<ExportQuality, number>;

const RESOLUTION_BITRATE_PRESETS: Record<ExportResolution, BitratePreset> = {
  "720p": {
    low: 3_000_000,
    standard: 5_000_000,
    high: 8_000_000,
  },
  "1080p": {
    low: 5_000_000,
    standard: 8_000_000,
    high: 14_000_000,
  },
  "2k": {
    low: 10_000_000,
    standard: 16_000_000,
    high: 24_000_000,
  },
  "4k": {
    low: 22_000_000,
    standard: 35_000_000,
    high: 55_000_000,
  },
};

export function getRecommendedVideoBitrate({
  resolution,
  fps,
  quality,
}: {
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
}) {
  const base = RESOLUTION_BITRATE_PRESETS[resolution][quality];

  if (fps === 60) return Math.round(base * 1.45);
  if (fps === 24) return Math.round(base * 0.88);
  return base;
}

export function formatBitrate(value: number) {
  return `${Math.round(value / 1_000_000)}Mbps`;
}

export function getEstimatedFrameCount(duration: number, fps: ExportFps) {
  return Math.ceil(Math.max(0, duration) * fps);
}

export function getExportLoadLevel({
  resolution,
  fps,
  duration,
}: {
  resolution: ExportResolution;
  fps: ExportFps;
  duration: number;
}) {
  const resolutionWeight: Record<ExportResolution, number> = {
    "720p": 1,
    "1080p": 2.25,
    "2k": 4,
    "4k": 9,
  };
  const fpsWeight = fps / 30;
  const durationWeight = Math.max(1, duration / 60);
  const score = resolutionWeight[resolution] * fpsWeight * durationWeight;

  if (score >= 18 || (resolution === "4k" && fps === 60)) return "extreme";
  if (score >= 8 || resolution === "4k" || (resolution === "2k" && fps === 60)) {
    return "high";
  }
  if (score >= 4 || fps === 60) return "medium";
  return "low";
}

export function getDeviceCapabilityHint() {
  if (typeof navigator === "undefined") return "unknown";

  const logicalCores = navigator.hardwareConcurrency || 0;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0;

  if ((logicalCores > 0 && logicalCores <= 4) || (memory > 0 && memory <= 4)) {
    return "low";
  }

  if ((logicalCores >= 8 || logicalCores === 0) && (memory >= 8 || memory === 0)) {
    return "high";
  }

  return "medium";
}
