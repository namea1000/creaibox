"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useVideoEditor, getFileFromCache } from "./VideoEditorContext";
import { convertWebmBlobToMp4, terminateFFmpeg, runWithFFmpegLock, convertMp4BlobToMov } from "./ffmpeg/convertWebmToMp4";
import {
  collectAudioMixSources,
  detectOfflineAudioMixdownSupport,
  renderOfflineAudioMixdown,
  scheduleAudioMixdown,
  extractAudioWithFFmpeg,
} from "./export/audioMixdown";
import { getRecommendedVideoBitrate } from "./export/exportBitratePresets";
import { isWebCodecsConfigSupported } from "./export/webCodecsSupport";
import { detectDirectMp4Support } from "./export/directMp4Support";
import { exportDirectMp4VideoOnly } from "./export/directMp4Exporter";
import { exportWebCodecsVideoOnly } from "./export/webCodecsVideoExporter";
import { runWebCodecsWorkerClient } from "./export/webCodecsWorkerClient";
import { buildRenderFramePlan } from "./render/renderFramePlan";
import type { RenderFrameLayer } from "./render/renderFramePlan";
import { RenderFallbackRenderer } from "./render/renderFallbackRenderer";
import {
  applyClipCanvasState,
  colorWithOpacity,
  getCanvasFilter,
  getRenderTransition,
  mapBlendModeToCanvas,
} from "./render/videoRenderMath";
import type { VideoExportOptions } from "./export/exportTypes";
import type { VideoEditorClip, VideoTextStyle } from "./VideoEditorContext";
import type { TimelineTrack } from "./types";

export type VideoEditorRenderCanvasRef = {
  exportWebCodecs: (options?: VideoExportOptions) => Promise<void>;
  exportWebm: (options?: VideoExportOptions) => Promise<void>;
  exportMp4: (options?: VideoExportOptions) => Promise<void>;
  exportDirectMp4: (options?: VideoExportOptions) => Promise<void>;
  exportAudioOnly: (options?: VideoExportOptions) => Promise<void>;
  renderSampleFrame: (time: number, options?: VideoExportOptions) => Promise<string>;
};

function safeFileName(value: string) {
  return (value || "creaibox-video")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

async function saveBlob(blob: Blob, fileName: string, directoryHandle?: any) {
  if (directoryHandle) {
    try {
      console.log(`[saveBlob] Saving to directory handle: ${directoryHandle.name}`);
      const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      console.log(`[saveBlob] Successfully saved ${fileName} to directory`);
      return;
    } catch (err) {
      console.warn("[saveBlob] Directory write failed, falling back to download:", err);
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArr = new ArrayBuffer(length);
  const view = new DataView(bufferArr);
  const channels: Float32Array[] = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  const setUint16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };

  const setUint32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt "
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * numOfChan * 2);
  setUint16(numOfChan * 2);
  setUint16(16);

  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset] ?? 0));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return bufferArr;
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw new DOMException("Export cancelled", "AbortError");
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function getExportSize(resolution: string, ratio: string) {
  const longEdge =
    resolution === "4k"
      ? 3840
      : resolution === "2k"
        ? 2560
        : resolution === "1080p"
          ? 1920
          : 1280;

  const makeEven = (n: number) => Math.round(n / 2) * 2;

  if (ratio === "9:16") {
    if (resolution === "4k") return { width: 2160, height: 3840 };
    if (resolution === "2k") return { width: 1440, height: 2560 };
    if (resolution === "1080p") return { width: 1080, height: 1920 };
    return { width: 720, height: 1280 };
  }

  if (ratio === "1:1") {
    if (resolution === "4k") return { width: 2160, height: 2160 };
    if (resolution === "2k") return { width: 1440, height: 1440 };
    if (resolution === "1080p") return { width: 1080, height: 1080 };
    return { width: 720, height: 720 };
  }

  if (ratio === "4:5") return { width: makeEven(longEdge * 0.8), height: makeEven(longEdge) };
  if (ratio === "5:4") return { width: makeEven(longEdge), height: makeEven(longEdge * 0.8) };
  if (ratio === "21:9") return { width: makeEven(longEdge), height: makeEven((longEdge * 9) / 21) };
  if (ratio === "4:3") return { width: makeEven(longEdge), height: makeEven((longEdge * 3) / 4) };

  if (resolution === "4k") return { width: 3840, height: 2160 };
  if (resolution === "2k") return { width: 2560, height: 1440 };
  if (resolution === "1080p") return { width: 1920, height: 1080 };
  return { width: 1280, height: 720 };
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function loadMediaElement(
  url: string,
  type: "audio" | "video"
): Promise<HTMLAudioElement | HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const element =
      type === "audio"
        ? document.createElement("audio")
        : document.createElement("video");

    element.crossOrigin = "anonymous";
    element.src = url;
    element.preload = "auto";

    if (type === "video") {
      const video = element as HTMLVideoElement;
      video.muted = true;
      video.playsInline = true;
    }

    const cleanup = () => {
      element.removeEventListener("canplaythrough", handleReady);
      element.removeEventListener("loadeddata", handleReady);
      element.removeEventListener("error", handleError);
    };

    const handleReady = () => {
      cleanup();
      resolve(element);
    };

    const handleError = () => {
      cleanup();
      reject(new Error("미디어 파일을 불러오지 못했습니다."));
    };

    element.addEventListener("canplaythrough", handleReady, { once: true });
    element.addEventListener("loadeddata", handleReady, { once: true });
    element.addEventListener("error", handleError, { once: true });
    element.load();
  });
}

async function decodeAudioBufferForRender(
  mediaId: string,
  url: string,
  type: "video" | "audio",
  fileName: string,
  file?: File
) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Browser does not support AudioContext");
  }
  const tempCtx = new AudioContextClass();
  const safeFileName = fileName || "temp_video_audio";

  try {
    if (type === "video") {
      console.log("[decodeAudioBufferForRender] Skipping native decodeAudioData for video file, extracting directly via FFmpeg:", url, safeFileName);
      
      const getFileBytes = async () => {
        try {
          if (file) {
            console.log("[decodeAudioBufferForRender] Reading from in-memory File object:", file.name, file.size);
            return new Uint8Array(await file.arrayBuffer());
          }
          const cachedFile = await getFileFromCache(mediaId);
          if (cachedFile) {
            console.log("[decodeAudioBufferForRender] Reading from IndexedDB cache:", mediaId);
            return new Uint8Array(await cachedFile.arrayBuffer());
          }
        } catch (err) {
          console.warn("[decodeAudioBufferForRender] Failed to read cached file:", err);
        }
        console.log("[decodeAudioBufferForRender] Fetching video URL fallback:", url);
        const response = await fetch(url);
        return new Uint8Array(await response.arrayBuffer());
      };

      const wavBuffer = await extractAudioWithFFmpeg(getFileBytes, safeFileName);
      const decoded = await tempCtx.decodeAudioData(wavBuffer);
      return decoded;
    } else {
      let arrayBuffer: ArrayBuffer | null = null;
      try {
        if (file) {
          console.log("[decodeAudioBufferForRender] Reading from in-memory File object:", file.name, file.size);
          arrayBuffer = await file.arrayBuffer();
        } else {
          const cachedFile = await getFileFromCache(mediaId);
          if (cachedFile) {
            console.log("[decodeAudioBufferForRender] Reading from IndexedDB cache:", mediaId);
            arrayBuffer = await cachedFile.arrayBuffer();
          }
        }
      } catch (err) {
        console.warn("[decodeAudioBufferForRender] Failed to read cached/in-memory file:", err);
      }

      if (!arrayBuffer) {
        console.log("[decodeAudioBufferForRender] Fetching audio URL:", url);
        const response = await fetch(url);
        arrayBuffer = await response.arrayBuffer();
      }

      try {
        const decoded = await tempCtx.decodeAudioData(arrayBuffer);
        arrayBuffer = null;
        return decoded;
      } catch (decodeError) {
        console.warn("[decodeAudioBufferForRender] Browser decodeAudioData failed, trying FFmpeg fallback:", decodeError);
        arrayBuffer = null;

        const getFileBytesFallback = async () => {
          try {
            if (file) {
              return new Uint8Array(await file.arrayBuffer());
            }
            const cachedFile = await getFileFromCache(mediaId);
            if (cachedFile) {
              return new Uint8Array(await cachedFile.arrayBuffer());
            }
          } catch (err) {}
          const fallbackResponse = await fetch(url);
          return new Uint8Array(await fallbackResponse.arrayBuffer());
        };

        const wavBuffer = await extractAudioWithFFmpeg(getFileBytesFallback, safeFileName);
        const decoded = await tempCtx.decodeAudioData(wavBuffer);
        return decoded;
      }
    }
  } finally {
    await tempCtx.close().catch(() => undefined);
  }
}

type VisualizerAnalysisFrame = {
  frequencyData: number[];
  timeDomainData: number[];
  average: number;
};

type VisualizerAnalysis = {
  fps: number;
  frames: VisualizerAnalysisFrame[];
};

type VisualizerDisplayState = {
  count: number;
  values: number[];
};

function analyzeAudioBufferForVisualizer(buffer: AudioBuffer, fps = 24): VisualizerAnalysis {
  const channel = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const frameCount = Math.max(1, Math.ceil(buffer.duration * fps));
  const binCount = 512;
  const frames: VisualizerAnalysisFrame[] = [];

  let previousFrequencyData = Array(binCount).fill(0) as number[];
  let previousTimeDomainData = Array(binCount).fill(128) as number[];

  for (let frame = 0; frame < frameCount; frame += 1) {
    const centerSample = Math.max(
      0,
      Math.min(channel.length - 1, Math.floor((frame / fps) * sampleRate))
    );
    const windowSize = Math.min(channel.length, 4096);
    const startSample = Math.max(0, centerSample - Math.floor(windowSize / 2));
    const endSample = Math.min(channel.length, startSample + windowSize);
    const sampleCount = Math.max(1, endSample - startSample);
    const frequencyData: number[] = [];
    const timeDomainData: number[] = [];
    let totalEnergy = 0;

    for (let index = 0; index < binCount; index += 1) {
      const binStart = startSample + Math.floor((index / binCount) * sampleCount);
      const binEnd = startSample + Math.floor(((index + 1) / binCount) * sampleCount);
      let peak = 0;
      let sumSquares = 0;
      let values = 0;

      for (let sampleIndex = binStart; sampleIndex < Math.max(binEnd, binStart + 1); sampleIndex += 1) {
        const value = channel[Math.min(channel.length - 1, sampleIndex)] || 0;
        peak = Math.max(peak, Math.abs(value));
        sumSquares += value * value;
        values += 1;
      }

      const rms = Math.sqrt(sumSquares / Math.max(values, 1));
      const shaped = Math.pow(rms * 0.84 + peak * 0.16, 0.82);
      const waveSample = channel[Math.min(channel.length - 1, binStart)] || 0;
      const rawFreqValue = Math.min(255, shaped * 360);
      const rawWaveValue = 128 + Math.max(-1, Math.min(1, waveSample)) * 66;
      const previousFreqValue = previousFrequencyData[index] ?? rawFreqValue;
      const previousWaveValue = previousTimeDomainData[index] ?? rawWaveValue;
      const freqSmoothing = rawFreqValue > previousFreqValue ? 0.14 : 0.06;
      const waveSmoothing = 0.12;
      const freqValue = previousFreqValue + (rawFreqValue - previousFreqValue) * freqSmoothing;
      const waveValue = previousWaveValue + (rawWaveValue - previousWaveValue) * waveSmoothing;
      frequencyData.push(freqValue);
      timeDomainData.push(waveValue);
      totalEnergy += freqValue;
    }

    const spatialFrequencyData = smoothVisualizerBins(frequencyData);
    const spatialTimeDomainData = smoothVisualizerBins(timeDomainData);
    previousFrequencyData = spatialFrequencyData;
    previousTimeDomainData = spatialTimeDomainData;

    frames.push({
      frequencyData: spatialFrequencyData,
      timeDomainData: spatialTimeDomainData,
      average: totalEnergy / Math.max(binCount, 1),
    });
  }

  return { fps, frames };
}

function smoothVisualizerBins(values: number[]) {
  return values.map((value, index) => {
    const previous2 = values[Math.max(0, index - 2)] ?? value;
    const previous = values[Math.max(0, index - 1)] ?? value;
    const next = values[Math.min(values.length - 1, index + 1)] ?? value;
    const next2 = values[Math.min(values.length - 1, index + 2)] ?? value;
    return previous2 * 0.08 + previous * 0.18 + value * 0.48 + next * 0.18 + next2 * 0.08;
  });
}

function getVisualizerAnalysisFrame(
  analysis: VisualizerAnalysis,
  offsetSeconds: number
): VisualizerAnalysisFrame {
  const rawIndex = Math.max(
    0,
    Math.min(analysis.frames.length - 1, offsetSeconds * analysis.fps)
  );
  const index = Math.floor(rawIndex);
  const nextIndex = Math.min(analysis.frames.length - 1, index + 1);
  const ratio = rawIndex - index;
  const current = analysis.frames[index];
  const next = analysis.frames[nextIndex];

  if (!next || ratio <= 0) return current;

  return {
    frequencyData: interpolateVisualizerBins(current.frequencyData, next.frequencyData, ratio),
    timeDomainData: interpolateVisualizerBins(current.timeDomainData, next.timeDomainData, ratio),
    average: current.average + (next.average - current.average) * ratio,
  };
}

function interpolateVisualizerBins(current: number[], next: number[], ratio: number) {
  return current.map((value, index) => value + ((next[index] ?? value) - value) * ratio);
}

function isStaticRenderLayer(layer: RenderFrameLayer) {
  const clip = layer.clip;
  if (clip.keyframes?.length) return false;
  if (clip.transitionIn && clip.transitionIn !== "none") return false;
  if (clip.transitionOut && clip.transitionOut !== "none") return false;
  return true;
}

function isStaticTextLayer(layer: RenderFrameLayer) {
  if (layer.kind !== "text" && layer.kind !== "subtitle") return false;
  return isStaticRenderLayer(layer);
}

function applyTextCanvasState(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  time: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const transition = getRenderTransition(clip, time);
  ctx.globalAlpha = (clip.opacity ?? 1) * transition.opacity;
  ctx.filter = getCanvasFilter(clip, time);
  ctx.globalCompositeOperation = mapBlendModeToCanvas(clip.blendMode ?? "normal");
  ctx.translate(
    canvasWidth / 2 + canvasWidth * (transition.translateX / 100),
    canvasHeight / 2 + canvasHeight * (transition.translateY / 100)
  );
  ctx.rotate((transition.rotate * Math.PI) / 180);
  ctx.scale(transition.scale, transition.scale);
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

  if (
    transition.clipInsetLeft > 0 ||
    transition.clipInsetRight > 0 ||
    transition.clipInsetTop > 0 ||
    transition.clipInsetBottom > 0
  ) {
    ctx.beginPath();
    ctx.rect(
      canvasWidth * transition.clipInsetLeft,
      canvasHeight * transition.clipInsetTop,
      canvasWidth * (1 - transition.clipInsetLeft - transition.clipInsetRight),
      canvasHeight * (1 - transition.clipInsetTop - transition.clipInsetBottom)
    );
    ctx.clip();
  }
}

function drawTextClip(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  canvasWidth: number,
  canvasHeight: number,
  fallback: VideoTextStyle
) {
  const style = clip.textStyle ?? fallback;
  const safeX = clip.type === "subtitle" ? Math.min(90, Math.max(10, style.x)) : style.x;
  const safeY = clip.type === "subtitle" ? Math.min(88, Math.max(12, style.y)) : style.y;
  const x = canvasWidth * (safeX / 100);
  const y = canvasHeight * (safeY / 100);
  const fontSize = Math.round((style.fontSize / 1280) * canvasWidth * 1.05);

  ctx.save();
  const textAlign = clip.textAlign ?? "center";
  ctx.textAlign = textAlign;
  ctx.textBaseline = "middle";
  const fontFamily = clip.fontFamily ?? "sans-serif";
  ctx.font = `${style.bold ? 900 : 500} ${fontSize}px ${fontFamily}`;

  const maxTextWidth = canvasWidth * (clip.type === "subtitle" ? 0.78 : 0.86);
  const lines = getWrappedTextLines(ctx, clip.name, maxTextWidth);
  const lineHeight = fontSize * 1.22;
  const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const paddingX = fontSize * 0.65;
  const paddingY = fontSize * 0.42;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = lineHeight * lines.length + paddingY * 2;

  let boxX = x - boxWidth / 2;
  if (textAlign === "left") {
    boxX = x - paddingX;
  } else if (textAlign === "right") {
    boxX = x - boxWidth + paddingX;
  }

  if (style.backgroundColor !== "transparent") {
    ctx.fillStyle = colorWithOpacity(style.backgroundColor, clip.textBgOpacity ?? 1);
    roundRect(ctx, boxX, y - boxHeight / 2, boxWidth, boxHeight, 0);
    ctx.fill();
  }

  if (style.shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
  }

  ctx.fillStyle = colorWithOpacity(style.color, clip.textOpacity ?? 1);
  const firstLineY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, firstLineY + index * lineHeight);
  });
  ctx.restore();
}

function getWrappedTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const normalizedLines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lines: string[] = [];

  for (const sourceLine of normalizedLines.length ? normalizedLines : [text]) {
    const words = sourceLine.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !currentLine) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
  }

  return lines.length ? lines : [text];
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawVisualizerClip(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  time: number,
  width: number,
  height: number,
  paintBackground: boolean,
  audioData?: { frequencyData: number[]; timeDomainData: number[]; average: number },
  displayState?: VisualizerDisplayState
) {
  const visualizerClip = clip as VideoEditorClip & {
    visualizerTemplate?: string;
    visualizerAccentColor?: string;
    visualizerBackgroundColor?: string;
    visualizerY?: number;
    visualizerHeight?: number;
    visualizerWidth?: number;
  };
  const template = visualizerClip.visualizerTemplate || "circle";
  const accentColor = visualizerClip.visualizerAccentColor || "#ff4fd8";
  const backgroundColor = visualizerClip.visualizerBackgroundColor || "#050507";
  const spectrumY = height * ((visualizerClip.visualizerY ?? 50) / 100);
  const spectrumHeight = height * ((visualizerClip.visualizerHeight ?? 58) / 100);
  const spectrumWidth = width * ((visualizerClip.visualizerWidth ?? 92) / 100);
  const elapsed = Math.max(0, time - clip.startTime);
  const frequencyData = audioData?.frequencyData ?? [];
  const timeDomainData = audioData?.timeDomainData ?? [];
  const average = audioData?.average ?? 0;

  const getFrequencyValue = (index: number, count: number) => {
    const safeCount = Math.max(count, 1);
    if (frequencyData.length === 0) {
      return Math.abs(Math.sin(elapsed * 2.2 + index * 0.22)) * 120 + 18;
    }

    const position = index / Math.max(safeCount - 1, 1);
    const minBin = 2;
    const maxBin = Math.max(Math.floor(frequencyData.length * 0.65), minBin + 2);
    const toLogBin = (ratio: number) => {
      const safeRatio = Math.min(Math.max(ratio, 0), 1);
      return Math.floor(minBin * Math.pow(maxBin / minBin, safeRatio));
    };
    const linearOffset = Math.floor(position * (frequencyData.length * 0.18));
    const start = Math.max(toLogBin(index / safeCount), minBin + linearOffset);
    const end = Math.max(toLogBin((index + 1) / safeCount), start + 1);
    let total = 0;

    for (let sourceIndex = start; sourceIndex < end; sourceIndex += 1) {
      total += frequencyData[Math.min(frequencyData.length - 1, sourceIndex)] ?? 0;
    }

    const averageValue = total / Math.max(end - start, 1);
    const highFrequencyLift = 1 + position * 0.65;
    const lowFrequencyTame = 0.88 + position * 0.12;
    const targetValue = Math.min(
      255,
      Math.pow(Math.max(0, averageValue) / 255, 0.78) * 245 * highFrequencyLift * lowFrequencyTame
    );

    if (!displayState) return targetValue;

    if (displayState.count !== safeCount) {
      displayState.count = safeCount;
      displayState.values = Array(safeCount).fill(targetValue);
    }

    const previousValue = displayState.values[index] ?? targetValue;
    const smoothing = targetValue > previousValue ? 0.48 : 0.28;
    const visibleValue = previousValue + (targetValue - previousValue) * smoothing;
    displayState.values[index] = visibleValue;

    return visibleValue;
  };

  const getWaveValue = (index: number, count: number) => {
    if (timeDomainData.length === 0) {
      return 128 + Math.sin(elapsed * 2.5 + index * 0.18) * 54;
    }

    const sourceIndex = Math.min(
      timeDomainData.length - 1,
      Math.max(0, Math.floor((index / Math.max(count - 1, 1)) * timeDomainData.length))
    );
    return timeDomainData[sourceIndex] ?? 128;
  };

  if (paintBackground) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(-width / 2, -height / 2, width, height);
  }
  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = Math.max(10, width * 0.014);

  if (template === "progress") {
    const barWidth = spectrumWidth * 0.78;
    const barHeight = Math.max(10, spectrumHeight * 0.12);
    const x = -barWidth / 2;
    const y = spectrumY - height / 2 - barHeight / 2;
    const progress = Math.min(1, elapsed / Math.max(clip.duration, 0.1));

    ctx.globalAlpha *= 0.25;
    roundRect(ctx, x, y, barWidth, barHeight, barHeight / 2);
    ctx.fill();
    ctx.globalAlpha /= 0.25;
    roundRect(ctx, x, y, barWidth * progress, barHeight, barHeight / 2);
    ctx.fill();
    return;
  }

  if (template === "bars" || template === "skyline") {
    const count = template === "skyline" ? 72 : 96;
    const startX = -spectrumWidth / 2;
    const gap = spectrumWidth / count;
    const baselineY = template === "skyline"
      ? height / 2
      : spectrumY - height / 2;
    const maxHeight = template === "skyline" ? spectrumHeight : spectrumHeight * 0.9;

    for (let index = 0; index < count; index += 1) {
      const value = getFrequencyValue(index, count);
      const barHeight = Math.max(3, (value / 255) * maxHeight);
      const x = startX + index * gap;
      const y = template === "skyline"
        ? baselineY - barHeight
        : baselineY - barHeight / 2;

      ctx.fillRect(x + gap * 0.18, y, Math.max(2, gap * 0.64), barHeight);
    }
    return;
  }

  if (template === "mirror-bars") {
    const count = 88;
    const startX = -spectrumWidth / 2;
    const gap = spectrumWidth / count;
    const centerY = spectrumY - height / 2;

    for (let index = 0; index < count; index += 1) {
      const value = getFrequencyValue(index, count);
      const barHeight = Math.max(3, (value / 255) * spectrumHeight * 0.5);
      const x = startX + index * gap;
      const barWidth = Math.max(2, gap * 0.64);
      ctx.fillRect(x + gap * 0.18, centerY - barHeight, barWidth, barHeight);
      ctx.fillRect(x + gap * 0.18, centerY, barWidth, barHeight);
    }
    return;
  }

  if (template === "circle" || template === "ring" || template === "orbit" || template === "orbital" || template === "radial-dots") {
    const radius = Math.min(spectrumWidth, spectrumHeight) * (0.25 + average * 0.00025);
    const count = template === "radial-dots" ? 90 : template === "orbital" ? 72 : 140;

    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const pulse = getFrequencyValue(index, count) / 255;
      const inner = radius;
      const outer = radius + pulse * Math.min(width, height) * 0.045;
      const cx = Math.cos(angle);
      const cy = Math.sin(angle);

      ctx.beginPath();
      ctx.lineWidth = Math.max(2, width * 0.0022);
      if (template === "radial-dots") {
        ctx.arc(cx * outer, spectrumY - height / 2 + cy * outer, Math.max(2, 2 + pulse * 8), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.moveTo(cx * inner, spectrumY - height / 2 + cy * inner);
        ctx.lineTo(cx * outer, spectrumY - height / 2 + cy * outer);
        ctx.stroke();
      }
    }
    return;
  }

  if (template === "wave" || template === "twin-wave" || template === "line" || template === "mountain" || template === "heartbeat" || template === "minimal") {
    const count = template === "minimal" ? 80 : 256;
    const startX = -spectrumWidth / 2;
    const centerY = spectrumY - height / 2;
    ctx.beginPath();

    for (let index = 0; index < count; index += 1) {
      const waveValue = getWaveValue(index, count);
      const freqValue = getFrequencyValue(index, count);
      const x = startX + (index / Math.max(count - 1, 1)) * spectrumWidth;
      let y = centerY + ((waveValue - 128) / 128) * (spectrumHeight * 0.45);

      if (template === "line") y = centerY - (freqValue / 255) * (spectrumHeight * 0.45) + Math.sin(index * 0.22) * (spectrumHeight * 0.12);
      if (template === "mountain") y = height / 2 - (freqValue / 255) * spectrumHeight;
      if (template === "heartbeat") y = centerY + Math.sin(index * 0.12) * (spectrumHeight * 0.08) - (freqValue / 255) * (spectrumHeight * 0.35);
      if (template === "minimal") y = centerY - (freqValue / 255) * (spectrumHeight * 0.24);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    if (template === "mountain") {
      ctx.lineTo(spectrumWidth / 2, height / 2);
      ctx.lineTo(-spectrumWidth / 2, height / 2);
      ctx.closePath();
      ctx.globalAlpha *= 0.5;
      ctx.fill();
    } else {
      ctx.stroke();
    }

    if (template === "twin-wave") {
      ctx.beginPath();
      for (let index = 0; index < count; index += 1) {
        const waveValue = getWaveValue(index, count);
        const x = startX + (index / Math.max(count - 1, 1)) * spectrumWidth;
        const y = centerY - ((waveValue - 128) / 128) * (spectrumHeight * 0.45);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return;
  }

  if (template === "dots" || template === "particles" || template === "beat-dots") {
    const count = template === "particles" ? 120 : 64;
    for (let index = 0; index < count; index += 1) {
      const value = getFrequencyValue(index, count);
      const x = -spectrumWidth / 2 + (index / Math.max(count - 1, 1)) * spectrumWidth;
      const y = spectrumY - height / 2 + Math.sin(index * 0.4 + elapsed) * spectrumHeight * 0.18;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(2, 2 + (value / 255) * 10), 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  const count = 56;
  const startX = -spectrumWidth / 2;
  const gap = spectrumWidth / count;
  const centerY = spectrumY - height / 2;

  for (let index = 0; index < count; index += 1) {
    const pulse = getFrequencyValue(index, count) / 255;
    const barHeight = Math.max(3, spectrumHeight * (0.12 + pulse * 0.72));
    const x = startX + index * gap;

    ctx.beginPath();
    ctx.lineWidth = Math.max(2, gap * 0.48);
    ctx.moveTo(x, centerY - barHeight / 2);
    ctx.lineTo(x, centerY + barHeight / 2);
    ctx.stroke();
  }
}

export default forwardRef<VideoEditorRenderCanvasRef>(function VideoEditorRenderCanvas(
  _props,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    projectTitle,
    mediaItems,
    tracks,
    clips,
    totalDuration,
    canvasRatio,
    exportResolution,
    exportFps,
    exportQuality,
  } = useVideoEditor();

  useImperativeHandle(ref, () => {
    const createFrameRenderer = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      renderClips = clips,
      renderMediaItems = mediaItems,
      renderTracks: TimelineTrack[] = tracks,
      renderCanvasRatio = canvasRatio,
      isExport = false
    ) => {
      const imageCache = new Map<string, HTMLImageElement>();
      const videoCache = new Map<string, HTMLVideoElement>();
      const visualizerAudioSources = collectAudioMixSources({
        clips: renderClips,
        mediaItems: renderMediaItems,
      });
      const visualizerAudioCache = new Map<string, Promise<VisualizerAnalysis>>();
      const visualizerDisplayStates = new Map<string, VisualizerDisplayState>();
      const staticMediaFrameCache = new Map<string, HTMLCanvasElement>();
      const staticOverlayFrameCache = new Map<string, HTMLCanvasElement>();
      const fallbackRenderer = RenderFallbackRenderer.create();

      const getVisualizerAudioData = async (time: number) => {
        const activeSource = visualizerAudioSources.find(
          (source) =>
            !source.muted &&
            time >= source.startTime &&
            time <= source.startTime + source.duration
        );

        if (!activeSource) return undefined;

        let analysisPromise = visualizerAudioCache.get(activeSource.mediaId);
        if (!analysisPromise) {
          analysisPromise = decodeAudioBufferForRender(
            activeSource.mediaId,
            activeSource.url,
            activeSource.type,
            activeSource.name,
            activeSource.file
          ).then((buffer) =>
            analyzeAudioBufferForVisualizer(buffer)
          );
          visualizerAudioCache.set(activeSource.mediaId, analysisPromise);
        }

        const analysis = await analysisPromise;
        const offsetSeconds = Math.max(0, time - activeSource.startTime + activeSource.trimStart);
        return getVisualizerAnalysisFrame(analysis, offsetSeconds);
      };

      const drawMediaClip = async (
        targetCtx: CanvasRenderingContext2D,
        targetCanvas: HTMLCanvasElement,
        source: CanvasImageSource,
        sourceWidth: number,
        sourceHeight: number,
        clip: VideoEditorClip,
        time: number
      ) => {
        await fallbackRenderer.drawMediaLayer({
          ctx: targetCtx,
          canvasWidth: targetCanvas.width,
          canvasHeight: targetCanvas.height,
          source,
          sourceWidth,
          sourceHeight,
          clip,
          currentTime: time,
        });
      };

      const getImageForLayer = async (layer: RenderFrameLayer) => {
        if (!layer.media || layer.media.type !== "image") return null;

        let image = imageCache.get(layer.media.id);
        if (!image) {
          image = await loadImage(layer.media.url);
          imageCache.set(layer.media.id, image);
        }

        return image;
      };

      const isStableImageLayer = (layer: RenderFrameLayer) => {
        if (layer.kind !== "image" || !layer.media || layer.media.type !== "image") return false;
        if (layer.clip.keyframes?.length) return false;
        if (layer.transition.opacity !== 1) return false;
        if (layer.transition.scale !== 1) return false;
        if (layer.transition.translateX !== 0 || layer.transition.translateY !== 0) return false;
        if (layer.transition.rotate !== 0 || layer.transition.blur !== 0) return false;
        if (
          layer.transition.clipInsetLeft !== 0 ||
          layer.transition.clipInsetRight !== 0 ||
          layer.transition.clipInsetTop !== 0 ||
          layer.transition.clipInsetBottom !== 0
        ) {
          return false;
        }
        return true;
      };

      const getStaticMediaCacheKey = (layers: RenderFrameLayer[]) => {
        if (layers.length === 0 || !layers.every(isStableImageLayer)) return null;

        return layers
          .map((layer) =>
            [
              layer.clip.id,
              layer.media?.id,
              layer.clip.startTime,
              layer.clip.duration,
              layer.clip.motionX,
              layer.clip.motionY,
              layer.clip.motionWidth,
              layer.clip.motionHeight,
              layer.clip.scale,
              layer.clip.rotation,
              layer.clip.opacity,
              layer.clip.blendMode,
              layer.clip.brightness,
              layer.clip.contrast,
              layer.clip.saturation,
              layer.clip.blur,
              layer.clip.grayscale,
              layer.clip.sepia,
              layer.clip.cropLeft,
              layer.clip.cropRight,
              layer.clip.cropTop,
              layer.clip.cropBottom,
            ].join(":")
          )
          .join("|");
      };

      const drawStaticMediaLayers = async (
        layers: RenderFrameLayer[],
        cacheKey: string,
        time: number
      ) => {
        const cachedCanvas = staticMediaFrameCache.get(cacheKey);
        if (cachedCanvas) {
          ctx.drawImage(cachedCanvas, 0, 0);
          return true;
        }

        const cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = canvas.width;
        cacheCanvas.height = canvas.height;
        const cacheCtx = cacheCanvas.getContext("2d");
        if (!cacheCtx) return false;

        cacheCtx.fillStyle = "#000000";
        cacheCtx.fillRect(0, 0, cacheCanvas.width, cacheCanvas.height);

        for (const layer of layers) {
          const image = await getImageForLayer(layer);
          if (!image) return false;

          await drawMediaClip(
            cacheCtx,
            cacheCanvas,
            image,
            image.width,
            image.height,
            layer.clip,
            time
          );
        }

        staticMediaFrameCache.set(cacheKey, cacheCanvas);
        ctx.drawImage(cacheCanvas, 0, 0);
        return true;
      };

      const getStaticOverlayCacheKey = (layers: RenderFrameLayer[]) => {
        if (layers.length === 0 || !layers.every(isStaticTextLayer)) return null;

        return layers
          .map((layer) =>
            [
              layer.kind,
              layer.clip.id,
              layer.clip.name,
              layer.clip.startTime,
              layer.clip.duration,
              layer.clip.opacity,
              layer.clip.textOpacity,
              layer.clip.textBgOpacity,
              layer.clip.fontFamily,
              layer.clip.textAlign,
              JSON.stringify(layer.clip.textStyle ?? {}),
            ].join(":")
          )
          .join("|");
      };

      const drawTextLayerToContext = (
        targetCtx: CanvasRenderingContext2D,
        layer: RenderFrameLayer,
        time: number
      ) => {
        const clip = layer.clip;
        targetCtx.save();
        applyTextCanvasState(targetCtx, clip, time, canvas.width, canvas.height);
        drawTextClip(
          targetCtx,
          clip,
          canvas.width,
          canvas.height,
          clip.type === "subtitle"
            ? {
                fontSize: 30,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.72)",
                x: 50,
                y: 82,
                bold: true,
                shadow: true,
              }
            : {
                fontSize: 42,
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.45)",
                x: 50,
                y: 50,
                bold: true,
                shadow: true,
              }
        );
        targetCtx.restore();
      };

      const drawStaticOverlayLayers = (
        layers: RenderFrameLayer[],
        cacheKey: string,
        time: number
      ) => {
        const cachedCanvas = staticOverlayFrameCache.get(cacheKey);
        if (cachedCanvas) {
          ctx.drawImage(cachedCanvas, 0, 0);
          return true;
        }

        const cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = canvas.width;
        cacheCanvas.height = canvas.height;
        const cacheCtx = cacheCanvas.getContext("2d");
        if (!cacheCtx) return false;

        for (const layer of layers) {
          drawTextLayerToContext(cacheCtx, layer, time);
        }

        staticOverlayFrameCache.set(cacheKey, cacheCanvas);
        ctx.drawImage(cacheCanvas, 0, 0);
        return true;
      };

      return async (time: number) => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.filter = "none";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const framePlan = buildRenderFramePlan({
          clips: renderClips,
          mediaItems: renderMediaItems,
          tracks: renderTracks,
          currentTime: time,
          canvasRatio: renderCanvasRatio,
        });
        const hasImageOrVideoLayer = framePlan.layers.some(
          (layer) => layer.kind === "image" || layer.kind === "video"
        );

        const mediaLayers = framePlan.layers.filter(
          (layer) => layer.kind === "image" || layer.kind === "video" || layer.kind === "audio"
        );
        const cacheableMediaLayers = mediaLayers.filter(
          (layer) => layer.kind === "image" || layer.kind === "video"
        );
        const visualizerLayers = framePlan.layers.filter((layer) => layer.kind === "visualizer");
        const overlayTextLayers = framePlan.layers.filter(
          (layer) => layer.kind === "text" || layer.kind === "subtitle"
        );
        const staticMediaCacheKey = getStaticMediaCacheKey(cacheableMediaLayers);
        const didDrawStaticMediaCache = staticMediaCacheKey
          ? await drawStaticMediaLayers(cacheableMediaLayers, staticMediaCacheKey, time)
          : false;
        const staticOverlayCacheKey = getStaticOverlayCacheKey(overlayTextLayers);

        for (const layer of [...mediaLayers, ...visualizerLayers, ...overlayTextLayers]) {
          const clip = layer.clip;
          if (clip.type === "text") {
            if (!staticOverlayCacheKey) {
              drawTextLayerToContext(ctx, layer, time);
            }
            continue;
          }

          if (clip.type === "subtitle") {
            if (!staticOverlayCacheKey) {
              drawTextLayerToContext(ctx, layer, time);
            }
            continue;
          }

          if (clip.type === "visualizer") {
            ctx.save();
            const { boxWidth, boxHeight } = applyClipCanvasState(
              ctx,
              clip,
              time,
              canvas.width,
              canvas.height
            );
            const audioData = await getVisualizerAudioData(time);
            let displayState = visualizerDisplayStates.get(clip.id);
            if (!displayState) {
              displayState = { count: 0, values: [] };
              visualizerDisplayStates.set(clip.id, displayState);
            }
            drawVisualizerClip(
              ctx,
              clip,
              time,
              boxWidth,
              boxHeight,
              !hasImageOrVideoLayer,
              audioData,
              displayState
            );
            ctx.restore();
            continue;
          }

          const media = layer.media;

          if (didDrawStaticMediaCache && layer.kind === "image") continue;
          if (!media) continue;

          if (media.type === "image") {
            let image = imageCache.get(media.id);

            if (!image) {
              image = await loadImage(media.url);
              imageCache.set(media.id, image);
            }

            await drawMediaClip(
              ctx,
              canvas,
              image,
              image.width,
              image.height,
              clip,
              time
            );
          }

          if (media.type === "video") {
            let video = videoCache.get(media.id);

            const seekCountKey = `seek_count_${media.id}`;
            let seekCount = (videoCache as any).get(seekCountKey) || 0;
            const maxSeekCount = isExport ? 150 : 20;
            if (video && seekCount >= maxSeekCount) {
              video.src = "";
              video.load();
              video = null as any;
              videoCache.delete(media.id);
              seekCount = 0;
              if (isExport) {
                await new Promise<void>((resolve) => setTimeout(resolve, 100));
              }
            }

            if (!video) {
              video = (await loadMediaElement(media.url, "video")) as HTMLVideoElement;
              videoCache.set(media.id, video);
            }
            (videoCache as any).set(seekCountKey, seekCount + 1);

            const localTime = Math.max(
              0,
              time - clip.startTime + (clip.trimStart ?? 0)
            );

            video.currentTime = Number.isFinite(video.duration)
              ? Math.min(localTime, Math.max(video.duration - 0.05 - (clip.trimEnd ?? 0), 0))
              : localTime;

            await new Promise<void>((resolve) => {
              video!.onseeked = () => resolve();
              window.setTimeout(resolve, 80);
            });

            await drawMediaClip(
              ctx,
              canvas,
              video,
              video.videoWidth || canvas.width,
              video.videoHeight || canvas.height,
              clip,
              time
            );
          }

          if (media.type === "audio") continue;
        }

        if (staticOverlayCacheKey) {
          drawStaticOverlayLayers(overlayTextLayers, staticOverlayCacheKey, time);
        }
      };
    };

    const renderToWebmBlob = async (options?: VideoExportOptions) => {
      const signal = options?.signal;
      const snapshot = options?.snapshot;
      const targetResolution = snapshot?.resolution ?? options?.resolution ?? exportResolution;
      const targetFps = snapshot?.fps ?? options?.fps ?? exportFps;
      const targetQuality = snapshot?.quality ?? options?.quality ?? exportQuality;
      const targetCanvasRatio = snapshot?.canvasRatio ?? canvasRatio;
      const renderClips = snapshot?.clipsSnapshot ?? clips;
      const renderMediaItems = snapshot?.mediaItemsSnapshot ?? mediaItems;
      const renderTracks = snapshot?.tracksSnapshot ?? tracks;
      const renderDuration = snapshot?.duration ?? totalDuration;
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("렌더 캔버스를 찾지 못했습니다.");
      throwIfAborted(signal);

      const size = snapshot
        ? { width: snapshot.width, height: snapshot.height }
        : getExportSize(targetResolution, targetCanvasRatio);
      canvas.width = size.width;
      canvas.height = size.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context를 생성하지 못했습니다.");
      const renderFrame = createFrameRenderer(
        canvas,
        ctx,
        renderClips,
        renderMediaItems,
        renderTracks,
        targetCanvasRatio,
        true // isExport
      );

      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();
      const audioBufferCache = new Map<string, AudioBuffer>();
      const scheduledAudioNodes: AudioBufferSourceNode[] = [];
      let recorder: MediaRecorder | null = null;
      const audioSources = collectAudioMixSources({ clips: renderClips, mediaItems: renderMediaItems });

      const canvasStream = canvas.captureStream(targetFps);

      throwIfAborted(signal);
      const audioMix = await scheduleAudioMixdown({
        audioContext,
        destination: audioDestination,
        sources: audioSources,
        bufferCache: audioBufferCache,
        signal,
      });
      scheduledAudioNodes.push(...audioMix.scheduledNodes);
      if (audioMix.skippedSources.length > 0) {
        options?.onProgress?.({
          stage: "rendering-webm",
          progress: 0,
          message: `${audioMix.skippedSources.length}개 오디오 소스를 건너뛰고 export를 계속합니다.`,
        });
      }
      throwIfAborted(signal);

      const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks(),
      ]);

      const chunks: BlobPart[] = [];

      recorder = new MediaRecorder(mixedStream, {
        mimeType: "video/webm;codecs=vp9,opus",
        videoBitsPerSecond: getRecommendedVideoBitrate({
          resolution: targetResolution,
          fps: targetFps,
          quality: targetQuality,
        }),
        audioBitsPerSecond: 192_000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const stopPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: "video/webm" }));
        };
      });

      recorder.start();

      const frameDurationMs = 1000 / targetFps;
      const renderStartTime = performance.now();
      options?.onProgress?.({
        stage: "rendering-webm",
        progress: 0,
        message: "WebM 실시간 렌더링을 시작합니다.",
      });

      try {
        let lastProgress = -1;

        while (true) {
          throwIfAborted(signal);
          const elapsedSeconds = Math.min(
            renderDuration,
            (performance.now() - renderStartTime) / 1000
          );
          const time = elapsedSeconds;
          await renderFrame(time);

          const progress = Math.min(
            100,
            Math.round((elapsedSeconds / Math.max(renderDuration, 0.1)) * 100)
          );
          if (progress !== lastProgress) {
            options?.onProgress?.({
              stage: "rendering-webm",
              progress,
              message: `WebM 실시간 렌더링 중 ${progress}%`,
            });
            lastProgress = progress;
          }

          if (elapsedSeconds >= renderDuration) break;

          const actualElapsedMs = performance.now() - renderStartTime;
          const nextFrameElapsedMs =
            (Math.floor(actualElapsedMs / frameDurationMs) + 1) * frameDurationMs;
          const waitMs = Math.max(0, nextFrameElapsedMs - actualElapsedMs);

          if (waitMs > 0) {
            await new Promise((resolve) => window.setTimeout(resolve, waitMs));
          } else {
            if (typeof document !== "undefined" && document.hidden) {
              await new Promise((resolve) => setTimeout(resolve, 4));
            } else {
              await new Promise((resolve) => requestAnimationFrame(resolve));
            }
          }
        }

        recorder.stop();
        const blob = await stopPromise;
        options?.onProgress?.({
          stage: "rendering-webm",
          progress: 100,
          message: "WebM 렌더링이 완료되었습니다.",
        });

        return blob;
      } catch (error) {
        if (recorder && recorder.state !== "inactive") {
          recorder.stop();
          await stopPromise.catch(() => undefined);
        }

        if (isAbortError(error)) {
          options?.onProgress?.({
            stage: "cancelled",
            progress: 0,
            message: "내보내기가 취소되었습니다.",
          });
        }

        throw error;
      } finally {
        scheduledAudioNodes.forEach((node) => {
          try {
            node.stop();
          } catch {
            // 이미 종료된 노드는 무시
          }
        });

        mixedStream.getTracks().forEach((track) => track.stop());
        await audioContext.close().catch(() => undefined);
      }
    };

    const renderToWebCodecsVideoOnly = async (options?: VideoExportOptions) => {
      const signal = options?.signal;
      const snapshot = options?.snapshot;
      const targetResolution = snapshot?.resolution ?? options?.resolution ?? exportResolution;
      const targetFps = snapshot?.fps ?? options?.fps ?? exportFps;
      const targetQuality = snapshot?.quality ?? options?.quality ?? exportQuality;
      const targetCanvasRatio = snapshot?.canvasRatio ?? canvasRatio;
      const renderClips = snapshot?.clipsSnapshot ?? clips;
      const renderMediaItems = snapshot?.mediaItemsSnapshot ?? mediaItems;
      const renderTracks = snapshot?.tracksSnapshot ?? tracks;
      const renderDuration = snapshot?.duration ?? totalDuration;
      const renderTitle = snapshot?.projectTitle ?? projectTitle;
      const hasWorkerUnsupportedVideoSource = snapshot
        ? snapshot.clipsSnapshot.some((clip) => {
            if (clip.type !== "video" || !clip.mediaId) return false;
            return snapshot.mediaItemsSnapshot.some(
              (item) => item.id === clip.mediaId && item.type === "video"
            );
          })
        : false;
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("렌더 캔버스를 찾지 못했습니다.");
      throwIfAborted(signal);

      if (snapshot) {
        const canUseWorkerEncoder = !snapshot.hasAudio && !hasWorkerUnsupportedVideoSource;
        const workerResult = await runWebCodecsWorkerClient({
          jobId: `webcodecs-${snapshot.createdAt}`,
          snapshot,
          renderMode: canUseWorkerEncoder ? "full" : "probe",
          signal,
          onProgress: (progress) => {
            options?.onProgress?.({
              stage: "worker-preflight",
              progress: progress.progress,
              message: progress.message,
            });
          },
        });

        if (workerResult.outputBlob) {
          throwIfAborted(signal);
          downloadBlob(
            workerResult.outputBlob,
            workerResult.outputFileName || `${safeFileName(renderTitle)}-worker-webcodecs.webm`
          );
          options?.onProgress?.({
            stage: "completed",
            progress: 100,
            message: "Worker WebCodecs WebM 파일 저장을 시작했습니다.",
          });
          return;
        }

        if (workerResult.usedWorker) {
          options?.onProgress?.({
            stage: "worker-preflight",
            progress: workerResult.workerRenderLoop ? 20 : 6,
            message: workerResult.workerRenderLoop
              ? `WebCodecs Worker frame loop 완료 (${workerResult.renderedFrames ?? 0}/${workerResult.totalFrames ?? 0} frames). ${workerResult.reason || "main-thread encoder로 이어갑니다."}`
              : workerResult.reason
                ? `WebCodecs Worker: ${workerResult.reason}`
                : "WebCodecs Worker 확인 후 main-thread export로 이어갑니다.",
          });
        }
      }

      if (snapshot?.hasAudio) {
        const audioSources = collectAudioMixSources({
          clips: snapshot.clipsSnapshot,
          mediaItems: snapshot.mediaItemsSnapshot,
        });

        if (audioSources.length > 0) {
          options?.onProgress?.({
            stage: "encoding-webcodecs",
            progress: 7,
            message: "Audio WebCodecs Beta: snapshot 오디오 mixdown 가능 여부를 확인합니다.",
          });

          const offlineMixdown = detectOfflineAudioMixdownSupport();
          if (!offlineMixdown.supported) {
            throw new Error(
              `Audio WebCodecs Beta mixdown 준비 실패: ${offlineMixdown.reason}`
            );
          }

          if (snapshot.preflight?.capabilities.audioEncoder.supported) {
            options?.onProgress?.({
              stage: "encoding-webcodecs",
              progress: 8,
              message: `Audio WebCodecs Beta: ${audioSources.length}개 오디오 소스를 fallback mux 대상으로 확인했습니다.`,
            });
          }

          throw new Error("Audio WebCodecs Beta는 mixdown 준비 단계이며 WebM audio mux가 없어 Quick WebM으로 fallback합니다.");
        }
      }

      const targetBitrate = snapshot?.bitrate ?? getRecommendedVideoBitrate({
        resolution: targetResolution,
        fps: targetFps,
        quality: targetQuality,
      });
      const isStableWebCodecsPath =
        targetFps === 30 && (targetResolution === "720p" || targetResolution === "1080p");
      const isExperimentalWebCodecsPath =
        targetResolution === "2k" ||
        targetResolution === "4k" ||
        targetFps === 60 ||
        targetFps === 24;
      const preflightRisk = snapshot?.preflight?.riskLevel;

      if (!isStableWebCodecsPath && isExperimentalWebCodecsPath) {
        const isFpsOnlyExperimental =
          targetFps === 60 && (targetResolution === "720p" || targetResolution === "1080p");
        const canTryExperimental =
          snapshot?.preflight?.capabilities.webCodecs.supported === true &&
          (preflightRisk === "low" ||
            preflightRisk === "medium" ||
            (isFpsOnlyExperimental && preflightRisk === "high"));

        if (!canTryExperimental) {
          throw new Error("Fast WebCodecs experimental 설정은 target config 지원과 안전한 preflight 결과가 필요합니다.");
        }
      }

      const support = await isWebCodecsConfigSupported({
        codec: "vp8",
        width: snapshot?.width ?? getExportSize(targetResolution, targetCanvasRatio).width,
        height: snapshot?.height ?? getExportSize(targetResolution, targetCanvasRatio).height,
        fps: targetFps,
        bitrate: targetBitrate,
        bitrateMode: "variable",
      });
      if (!support.supported) {
        throw new Error(support.reason || "WebCodecs target config를 지원하지 않습니다.");
      }

      const size = snapshot
        ? { width: snapshot.width, height: snapshot.height }
        : getExportSize(targetResolution, targetCanvasRatio);
      canvas.width = size.width;
      canvas.height = size.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context를 생성하지 못했습니다.");

      await exportWebCodecsVideoOnly({
        canvas,
        width: size.width,
        height: size.height,
        fps: targetFps,
        totalDuration: renderDuration,
        totalFrames: snapshot?.totalFrames,
        title: renderTitle,
        bitrate: targetBitrate,
        codec: support.codec ?? "vp8",
        renderFrame: createFrameRenderer(
          canvas,
          ctx,
          renderClips,
          renderMediaItems,
          renderTracks,
          targetCanvasRatio,
          true // isExport
        ),
        options,
        audioPlan: snapshot?.hasAudio
          ? {
              mode: "audio-beta-fallback",
              reason: "Audio mixdown/AudioEncoder 준비는 가능하지만 WebM audio mux가 없어 Quick WebM/MP4 경로를 사용합니다.",
            }
          : { mode: "video-only" },
        workerPlan: {
          enabled: Boolean(snapshot),
          renderLoop: snapshot?.hasAudio || !snapshot || hasWorkerUnsupportedVideoSource
            ? "worker-probe"
            : "worker-full",
          reason: snapshot?.hasAudio
            ? "오디오 포함 export는 Worker video-only 인코딩 대신 Quick WebM fallback을 사용합니다."
            : hasWorkerUnsupportedVideoSource
              ? "비디오 원본 디코딩은 main-thread 렌더러가 담당하고 Worker는 probe만 실행합니다."
            : "Worker OffscreenCanvas frame output을 WebCodecs encoder에 직접 연결합니다.",
        },
      });
    };

    return {
      exportWebCodecs: async (options?: VideoExportOptions) => {
        try {
          await renderToWebCodecsVideoOnly(options);
        } catch (error) {
          if (isAbortError(error)) throw error;

          options?.onProgress?.({
            stage: "rendering-webm",
            progress: 0,
            message: `WebCodecs 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"} Quick WebM으로 전환합니다.`,
          });

          const blob = await renderToWebmBlob(options);
          throwIfAborted(options?.signal);
          const finalFileName = options?.fileName
            ? (options.fileName.endsWith(".webm") ? options.fileName : `${options.fileName}.webm`)
            : `${safeFileName(options?.snapshot?.projectTitle ?? projectTitle)}.webm`;
          await saveBlob(blob, finalFileName, options?.directoryHandle);
          options?.onProgress?.({
            stage: "completed",
            progress: 100,
            message: "Fallback WebM 파일 저장을 시작했습니다.",
          });
        }
      },

      exportWebm: async (options?: VideoExportOptions) => {
        try {
          const blob = await renderToWebmBlob(options);
          throwIfAborted(options?.signal);
          const finalFileName = options?.fileName
            ? (options.fileName.endsWith(".webm") ? options.fileName : `${options.fileName}.webm`)
            : `${safeFileName(options?.snapshot?.projectTitle ?? projectTitle)}.webm`;
          await saveBlob(blob, finalFileName, options?.directoryHandle);
          options?.onProgress?.({
            stage: "completed",
            progress: 100,
            message: "WebM 파일 저장을 시작했습니다.",
          });
        } finally {
          terminateFFmpeg();
        }
      },

      exportMp4: async (options?: VideoExportOptions) => {
        try {
          const webmBlob = await renderToWebmBlob(options);
          throwIfAborted(options?.signal);
          const format = options?.videoFormat || "mp4";
          options?.onProgress?.({
            stage: "converting-mp4",
            progress: 0,
            message: `${format.toUpperCase()} 변환을 시작합니다.`,
          });

          await convertWebmBlobToMp4({
            webmBlob,
            title: options?.snapshot?.projectTitle ?? projectTitle,
            signal: options?.signal,
            fileName: options?.fileName,
            directoryHandle: options?.directoryHandle,
            videoFormat: format,
            onProgress: (progress) =>
              options?.onProgress?.({
                stage: "converting-mp4",
                progress,
                message: `${format.toUpperCase()} 변환 중 ${progress}%`,
              }),
          });
          throwIfAborted(options?.signal);
          options?.onProgress?.({
            stage: "completed",
            progress: 100,
            message: `${format.toUpperCase()} 파일 저장을 시작했습니다.`,
          });
        } finally {
          terminateFFmpeg();
        }
      },

      exportDirectMp4: async (options?: VideoExportOptions) => {
        try {
          const snapshot = options?.snapshot;
          const targetResolution = snapshot?.resolution ?? options?.resolution ?? exportResolution;
          const targetFps = snapshot?.fps ?? options?.fps ?? exportFps;
          const targetQuality = snapshot?.quality ?? options?.quality ?? exportQuality;
          const targetCanvasRatio = snapshot?.canvasRatio ?? canvasRatio;
          const renderClips = snapshot?.clipsSnapshot ?? clips;
          const renderMediaItems = snapshot?.mediaItemsSnapshot ?? mediaItems;
          const renderTracks = snapshot?.tracksSnapshot ?? tracks;
          const renderDuration = snapshot?.duration ?? totalDuration;
          const renderTitle = snapshot?.projectTitle ?? projectTitle;
          const targetBitrate = snapshot?.bitrate ?? getRecommendedVideoBitrate({
            resolution: targetResolution,
            fps: targetFps,
            quality: targetQuality,
          });
          const size = snapshot
            ? { width: snapshot.width, height: snapshot.height }
            : getExportSize(targetResolution, targetCanvasRatio);
          const audioSources = collectAudioMixSources({
            clips: renderClips,
            mediaItems: renderMediaItems,
          });
          const canvas = canvasRef.current;
          if (!canvas) throw new Error("렌더 캔버스를 찾지 못했습니다.");

          const runCompatibleMp4Fallback = async (reason: string) => {
            const format = options?.videoFormat || "mp4";
            options?.onProgress?.({
              stage: "converting-mp4",
              progress: 0,
              message: `Direct ${format.toUpperCase()} fallback: ${reason} 기존 호환 렌더 경로로 처리합니다.`,
            });

            const webmBlob = await renderToWebmBlob(options);
            throwIfAborted(options?.signal);
            options?.onProgress?.({
              stage: "converting-mp4",
              progress: 0,
              message: `Direct ${format.toUpperCase()} fallback: FFmpeg WASM ${format.toUpperCase()} 변환을 시작합니다.`,
            });

            await convertWebmBlobToMp4({
              webmBlob,
              title: `${renderTitle}-direct-${format}`,
              signal: options?.signal,
              fileName: options?.fileName,
              directoryHandle: options?.directoryHandle,
              videoFormat: format,
              onProgress: (progress) =>
                options?.onProgress?.({
                  stage: "converting-mp4",
                  progress,
                  message: `Direct ${format.toUpperCase()} fallback 변환 중 ${progress}%`,
                }),
            });
            throwIfAborted(options?.signal);
            options?.onProgress?.({
              stage: "completed",
              progress: 100,
              message: `Direct ${format.toUpperCase()} fallback 파일 저장을 시작했습니다.`,
            });
          };

          const support = snapshot?.preflight?.capabilities.directMp4 ?? await detectDirectMp4Support({
            width: size.width,
            height: size.height,
            fps: targetFps,
            bitrate: targetBitrate,
            hasAudio: audioSources.length > 0,
          });

          if (!support.video.supported || !support.muxer.supported) {
            await runCompatibleMp4Fallback(
              support.reason || support.video.reason || support.muxer.reason || "H.264/Mediabunny 직접 MP4 capability가 부족합니다.",
            );
            return;
          }

          if (audioSources.length > 0 && !support.audio.supported) {
            await runCompatibleMp4Fallback(
              support.audio.reason || "AAC AudioEncoder direct MP4 capability가 부족합니다.",
            );
            return;
          }

          try {
            throwIfAborted(options?.signal);
            let audioBuffer: AudioBuffer | undefined;

            if (audioSources.length > 0) {
              const offlineMixdown = detectOfflineAudioMixdownSupport();
              if (!offlineMixdown.supported) {
                await runCompatibleMp4Fallback(
                  offlineMixdown.reason || "OfflineAudioContext mixdown을 사용할 수 없습니다.",
                );
                return;
              }

              options?.onProgress?.({
                stage: "encoding-webcodecs",
                progress: 0,
                message: `Direct MP4 오디오 mixdown을 시작합니다. (${audioSources.length}개 소스)`,
              });

              const mixdown = await renderOfflineAudioMixdown({
                sources: audioSources,
                duration: renderDuration,
                sampleRate: support.audio.sampleRate ?? 48_000,
                numberOfChannels: support.audio.numberOfChannels ?? 2,
                signal: options?.signal,
              });
              audioBuffer = mixdown.audioBuffer;

              if (mixdown.skippedSources.length > 0) {
                options?.onProgress?.({
                  stage: "encoding-webcodecs",
                  progress: 1,
                  message: `${mixdown.skippedSources.length}개 오디오 소스를 건너뛰고 Direct MP4 mux를 계속합니다.`,
                });
              }
            }

            canvas.width = size.width;
            canvas.height = size.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context를 생성하지 못했습니다.");

            const blob = await exportDirectMp4VideoOnly({
              canvas,
              fps: targetFps,
              totalDuration: renderDuration,
              totalFrames: snapshot?.totalFrames,
              bitrate: targetBitrate,
              audioBuffer,
              audioBitrate: support.audio.bitrate ?? 160_000,
              renderFrame: createFrameRenderer(
                canvas,
                ctx,
                renderClips,
                renderMediaItems,
                renderTracks,
                targetCanvasRatio,
                true // isExport
              ),
              options,
            });

            throwIfAborted(options?.signal);
            const format = options?.videoFormat || "mp4";
            if (format === "mov") {
              options?.onProgress?.({
                stage: "converting-mp4",
                progress: 0,
                message: "MOV 형식 변환 중...",
              });
              await convertMp4BlobToMov({
                mp4Blob: blob,
                title: renderTitle,
                signal: options?.signal,
                fileName: options?.fileName,
                directoryHandle: options?.directoryHandle,
                onProgress: (progress) =>
                  options?.onProgress?.({
                    stage: "converting-mp4",
                    progress,
                    message: `MOV 변환 중 ${progress}%`,
                  }),
              });
              options?.onProgress?.({
                stage: "completed",
                progress: 100,
                message: "MOV 파일 저장을 시작했습니다.",
              });
            } else {
              const finalFileName = options?.fileName
                ? (options.fileName.endsWith(".mp4") ? options.fileName : `${options.fileName}.mp4`)
                : `${safeFileName(renderTitle)}-direct-mp4.mp4`;
              await saveBlob(blob, finalFileName, options?.directoryHandle);
              options?.onProgress?.({
                stage: "completed",
                progress: 100,
                message: "Direct MP4 파일 저장을 시작했습니다.",
              });
            }
            return;
          } catch (error) {
            if (isAbortError(error)) throw error;

            await runCompatibleMp4Fallback(
              `직접 MP4 생성 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}.`,
            );
            return;
          }
        } finally {
          terminateFFmpeg();
        }
      },

      exportAudioOnly: async (options?: VideoExportOptions) => {
        try {
          const snapshot = options?.snapshot;
          const renderClips = snapshot?.clipsSnapshot ?? clips;
          const renderMediaItems = snapshot?.mediaItemsSnapshot ?? mediaItems;
          const renderDuration = snapshot?.duration ?? totalDuration;
          const renderTitle = snapshot?.projectTitle ?? projectTitle;

          options?.onProgress?.({
            stage: "rendering-webm",
            progress: 10,
            message: "오디오 소스를 수집 중입니다...",
          });

          const audioSources = collectAudioMixSources({
            clips: renderClips,
            mediaItems: renderMediaItems,
          });

          options?.onProgress?.({
            stage: "rendering-webm",
            progress: 30,
            message: "오디오 믹스다운을 시작합니다...",
          });

          const mixdown = await renderOfflineAudioMixdown({
            sources: audioSources,
            duration: renderDuration,
            sampleRate: 48_000,
            numberOfChannels: 2,
            signal: options?.signal,
          });

          throwIfAborted(options?.signal);

          options?.onProgress?.({
            stage: "converting-mp4",
            progress: 70,
            message: "오디오 파일 변환 중...",
          });

          const wavBuffer = audioBufferToWav(mixdown.audioBuffer);
          const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
          const format = options?.audioFormat || "mp3";
          const finalFileName = options?.fileName
            ? (options.fileName.endsWith(`.${format}`) ? options.fileName : `${options.fileName}.${format}`)
            : `${safeFileName(renderTitle)}.${format}`;

          if (format === "wav") {
            await saveBlob(wavBlob, finalFileName, options?.directoryHandle);
          } else {
            await runWithFFmpegLock(async (ffmpeg: any) => {
              const inputName = `input_${Date.now()}.wav`;
              const outputName = `output_${Date.now()}.${format}`;

              await ffmpeg.writeFile(inputName, new Uint8Array(wavBuffer));
              
              const codec = format === "mp3" ? "libmp3lame" : "aac";
              await ffmpeg.exec([
                "-i",
                inputName,
                "-acodec",
                codec,
                "-ab",
                "192k",
                outputName,
              ]);

              throwIfAborted(options?.signal);
              const data = await ffmpeg.readFile(outputName);
              const audioBlob = new Blob([data as any], { type: `audio/${format}` });

              await saveBlob(audioBlob, finalFileName, options?.directoryHandle);

              await ffmpeg.deleteFile(inputName).catch(() => {});
              await ffmpeg.deleteFile(outputName).catch(() => {});
            });
          }

          options?.onProgress?.({
            stage: "completed",
            progress: 100,
            message: "오디오 파일 저장이 완료되었습니다.",
          });
        } finally {
          terminateFFmpeg();
        }
      },

      renderSampleFrame: async (time: number, options?: VideoExportOptions) => {
        const snapshot = options?.snapshot;
        const targetResolution = snapshot?.resolution ?? options?.resolution ?? exportResolution;
        const targetCanvasRatio = snapshot?.canvasRatio ?? canvasRatio;
        const renderClips = snapshot?.clipsSnapshot ?? clips;
        const renderMediaItems = snapshot?.mediaItemsSnapshot ?? mediaItems;
        const renderTracks = snapshot?.tracksSnapshot ?? tracks;
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("렌더 캔버스를 찾지 못했습니다.");

        const size = snapshot
          ? { width: snapshot.width, height: snapshot.height }
          : getExportSize(targetResolution, targetCanvasRatio);
        canvas.width = size.width;
        canvas.height = size.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context를 생성하지 못했습니다.");

        const renderFrame = createFrameRenderer(
          canvas,
          ctx,
          renderClips,
          renderMediaItems,
          renderTracks,
          targetCanvasRatio
        );

        await renderFrame(time);
        return canvas.toDataURL("image/jpeg", 0.9);
      },
    };
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed -left-[99999px] -top-[99999px] opacity-0"
      width={1280}
      height={720}
    />
  );
});
