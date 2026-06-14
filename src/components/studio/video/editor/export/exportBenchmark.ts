import type { CanvasRatio } from "../VideoEditorContext";
import type { ExportFps, ExportQuality, ExportResolution } from "../types";
import { getEstimatedFrameCount } from "./exportBitratePresets";
import type { VideoExportEngine } from "./exportTypes";
import type { RenderPreflightRiskLevel } from "./renderPreflight";

export type ExportBenchmarkInput = {
  engine: VideoExportEngine;
  resolution: ExportResolution;
  fps: ExportFps;
  quality: ExportQuality;
  duration: number;
  canvasRatio: CanvasRatio;
  width: number;
  height: number;
  hasAudio: boolean;
  hasVideo: boolean;
  usesWebGLEffects: boolean;
  isVisualizerFastPath?: boolean;
};

export type ExportBenchmarkSample = {
  frameIndex: number;
  frameMs: number;
};

export type ExportBenchmarkResult = {
  averageFrameMs: number;
  sampledFrames: number;
  estimatedRenderSeconds: number;
  riskLevel: RenderPreflightRiskLevel;
  totalFrames: number;
  samples: ExportBenchmarkSample[];
  mode: "canvas-dry-run" | "custom-dry-run" | "heuristic";
};

export type ExportBenchmarkOptions = {
  sampleFrames?: number;
  renderSample?: (frameIndex: number, input: ExportBenchmarkInput) => void | Promise<void>;
};

const MIN_SAMPLE_FRAMES = 8;
const MAX_SAMPLE_FRAMES = 15;
const CANVAS_DRY_RUN_MAX_SIDE = 1920;

export async function runExportBenchmark(
  input: ExportBenchmarkInput,
  options: ExportBenchmarkOptions = {},
): Promise<ExportBenchmarkResult> {
  const sampledFrames = clampSampleFrames(options.sampleFrames);

  if (options.renderSample) {
    const samples = await measureSamples(input, sampledFrames, options.renderSample);
    return buildBenchmarkResult(input, samples, "custom-dry-run");
  }

  if (typeof document !== "undefined" && typeof performance !== "undefined") {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, CANVAS_DRY_RUN_MAX_SIDE / Math.max(input.width, input.height));
    canvas.width = Math.max(1, Math.round(input.width * scale));
    canvas.height = Math.max(1, Math.round(input.height * scale));
    const context = canvas.getContext("2d");

    if (context) {
      const samples = await measureSamples(input, sampledFrames, (frameIndex) => {
        drawCanvasDryRunFrame(context, canvas.width, canvas.height, frameIndex, input);
      });
      const normalizedSamples = samples.map((sample) => ({
        ...sample,
        frameMs: sample.frameMs / Math.max(0.2, scale),
      }));

      return buildBenchmarkResult(input, normalizedSamples, "canvas-dry-run");
    }
  }

  return createHeuristicBenchmark(input, sampledFrames);
}

export function createHeuristicBenchmark(
  input: ExportBenchmarkInput,
  sampleFrames = MIN_SAMPLE_FRAMES,
): ExportBenchmarkResult {
  const pixels = input.width * input.height;
  const megapixels = pixels / 1_000_000;
  const fpsMultiplier = input.fps / 30;
  const qualityMultiplier = input.quality === "high" ? 1.2 : input.quality === "low" ? 0.82 : 1;
  const effectsMultiplier = input.usesWebGLEffects ? 1.35 : 1;
  const audioMultiplier = input.hasAudio ? 1.08 : 1;
  const fourKMultiplier = input.resolution === "4k" ? (input.fps === 60 ? 1.75 : 1.45) : 1;
  const longDurationMultiplier =
    input.duration >= 12 * 60 * 60 ? 1.6 : input.duration >= 60 * 60 ? 1.25 : 1;
  const engineMultiplier =
    input.engine === "fast-webcodecs"
      ? 0.7
      : input.engine === "direct-mp4"
        ? input.hasAudio
          ? 0.98
          : 0.86
      : input.engine === "compatible-mp4"
        ? 1.25
        : 1;
  const fastPathMultiplier = input.isVisualizerFastPath ? 0.45 : 1;
  const averageFrameMs = Math.max(
    2,
    megapixels *
      2.8 *
      fpsMultiplier *
      qualityMultiplier *
      effectsMultiplier *
      audioMultiplier *
      fourKMultiplier *
      longDurationMultiplier *
      engineMultiplier *
      fastPathMultiplier,
  );
  const samples = Array.from({ length: clampSampleFrames(sampleFrames) }, (_, frameIndex) => ({
    frameIndex,
    frameMs: averageFrameMs,
  }));

  return buildBenchmarkResult(input, samples, "heuristic");
}

export function formatEstimatedRenderTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0초";

  const rounded = Math.round(seconds);
  if (rounded < 60) return `약 ${rounded}초`;

  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `약 ${minutes}분 ${remainingSeconds}초` : `약 ${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `약 ${hours}시간 ${remainingMinutes}분` : `약 ${hours}시간`;
}

async function measureSamples(
  input: ExportBenchmarkInput,
  sampledFrames: number,
  renderSample: (frameIndex: number, input: ExportBenchmarkInput) => void | Promise<void>,
) {
  const samples: ExportBenchmarkSample[] = [];

  for (let frameIndex = 0; frameIndex < sampledFrames; frameIndex += 1) {
    await waitForFrame();
    const startedAt = performance.now();
    await renderSample(frameIndex, input);
    samples.push({
      frameIndex,
      frameMs: Math.max(0, performance.now() - startedAt),
    });
  }

  return samples;
}

function buildBenchmarkResult(
  input: ExportBenchmarkInput,
  samples: ExportBenchmarkSample[],
  mode: ExportBenchmarkResult["mode"],
): ExportBenchmarkResult {
  const sampledFrames = samples.length;
  const totalFrameMs = samples.reduce((sum, sample) => sum + sample.frameMs, 0);
  const averageFrameMs = sampledFrames > 0 ? totalFrameMs / sampledFrames : 0;
  const totalFrames = getEstimatedFrameCount(input.duration, input.fps);
  const computeSeconds = (totalFrames * averageFrameMs) / 1000;
  const mediaRecorderRealtimeFloor =
    input.engine === "quick-webm" ||
    input.engine === "compatible-mp4"
      ? input.duration
      : 0;
  const mp4ConversionMultiplier =
    input.engine === "compatible-mp4" ? 1.28 : 1;
  const directMp4AudioMuxMultiplier =
    input.engine === "direct-mp4" && input.hasAudio ? 1.12 : 1;
  const estimatedRenderSeconds = Math.max(computeSeconds, mediaRecorderRealtimeFloor) * mp4ConversionMultiplier;
  const adjustedEstimatedRenderSeconds = estimatedRenderSeconds * directMp4AudioMuxMultiplier;

  return {
    averageFrameMs,
    sampledFrames,
    estimatedRenderSeconds: adjustedEstimatedRenderSeconds,
    riskLevel: getBenchmarkRiskLevel(input, averageFrameMs, adjustedEstimatedRenderSeconds),
    totalFrames,
    samples,
    mode,
  };
}

function drawCanvasDryRunFrame(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameIndex: number,
  input: ExportBenchmarkInput,
) {
  context.save();
  context.clearRect(0, 0, width, height);

  if (input.isVisualizerFastPath) {
    context.fillStyle = "#07070a";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "#ff4fd8";
    context.lineWidth = Math.max(2, width * 0.0022);
    context.beginPath();
    const count = 48;
    const radius = Math.min(width, height) * 0.22;
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const val = 10 + Math.sin(frameIndex * 0.22 + index * 0.15) * 25;
      const inner = radius;
      const outer = radius + val;
      context.moveTo(width / 2 + Math.cos(angle) * inner, height / 2 + Math.sin(angle) * inner);
      context.lineTo(width / 2 + Math.cos(angle) * outer, height / 2 + Math.sin(angle) * outer);
    }
    context.stroke();
    context.restore();
    return;
  }

  context.fillStyle = "#07070a";
  context.fillRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, input.usesWebGLEffects ? "#22d3ee" : "#334155");
  gradient.addColorStop(1, input.hasVideo ? "#a855f7" : "#0f172a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalAlpha = 0.45;
  context.fillStyle = "#ffffff";
  const tileSize = Math.max(24, Math.round(width / 24));
  for (let x = -tileSize; x < width + tileSize; x += tileSize) {
    const y = (frameIndex * 11 + x * 0.35) % height;
    context.fillRect(x, y, tileSize * 0.5, tileSize * 0.5);
  }

  if (input.usesWebGLEffects) {
    context.filter = "blur(2px) saturate(1.2) contrast(1.08)";
    context.drawImage(context.canvas, 0, 0);
    context.filter = "none";
  }

  context.restore();
}

function getBenchmarkRiskLevel(
  input: ExportBenchmarkInput,
  averageFrameMs: number,
  estimatedRenderSeconds: number,
): RenderPreflightRiskLevel {
  const frameBudgetMs = 1000 / input.fps;
  const realtimeRatio = input.duration > 0 ? estimatedRenderSeconds / input.duration : 0;

  if (
    averageFrameMs > frameBudgetMs * 2.5 ||
    realtimeRatio >= 3 ||
    (input.resolution === "4k" && input.duration >= 12 * 60 * 60) ||
    (input.resolution === "4k" && input.fps === 60)
  ) {
    return "extreme";
  }

  if (
    averageFrameMs > frameBudgetMs * 1.5 ||
    realtimeRatio >= 2 ||
    (input.resolution === "4k" && input.duration >= 60 * 60) ||
    input.resolution === "4k"
  ) {
    return "high";
  }

  if (averageFrameMs > frameBudgetMs || input.resolution === "2k" || input.fps === 60) {
    return "medium";
  }

  return "low";
}

function clampSampleFrames(value = 10) {
  return Math.max(MIN_SAMPLE_FRAMES, Math.min(MAX_SAMPLE_FRAMES, Math.round(value)));
}

function waitForFrame() {
  if (typeof requestAnimationFrame === "undefined") return Promise.resolve();

  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}
