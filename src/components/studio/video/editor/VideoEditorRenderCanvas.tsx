"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useVideoEditor } from "./VideoEditorContext";
import { convertWebmBlobToMp4 } from "./ffmpeg/convertWebmToMp4";
import type { VideoEditorClip, VideoTextStyle } from "./VideoEditorContext";

export type VideoEditorRenderCanvasRef = {
  exportWebm: () => Promise<void>;
  exportMp4: (onProgress?: (progress: number) => void) => Promise<void>;
};

type AudioRenderSource = {
  clipId: string;
  mediaId: string;
  url: string;
  startTime: number;
  duration: number;
  type: "audio" | "video";
  trimStart: number;
  trimEnd: number;
  volume: number;
  muted: boolean;
};

function safeFileName(value: string) {
  return (value || "creaibox-video")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
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

  if (ratio === "4:5") return { width: Math.round(longEdge * 0.8), height: longEdge };
  if (ratio === "5:4") return { width: longEdge, height: Math.round(longEdge * 0.8) };
  if (ratio === "21:9") return { width: longEdge, height: Math.round((longEdge * 9) / 21) };
  if (ratio === "4:3") return { width: longEdge, height: Math.round((longEdge * 3) / 4) };

  if (resolution === "4k") return { width: 3840, height: 2160 };
  if (resolution === "2k") return { width: 2560, height: 1440 };
  if (resolution === "1080p") return { width: 1920, height: 1080 };
  return { width: 1280, height: 720 };
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = (targetWidth - width) / 2;
  const y = (targetHeight - height) / 2;

  ctx.drawImage(image, x, y, width, height);
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

async function decodeAudioBuffer(audioContext: AudioContext, url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

function getTransitionProgress(clip: VideoEditorClip, time: number) {
  const transitionDuration = Math.min(0.6, clip.duration / 3);
  const startElapsed = time - clip.startTime;
  const endRemaining = clip.startTime + clip.duration - time;

  return {
    transitionDuration,
    startElapsed,
    endRemaining,
    inProgress: Math.max(0, Math.min(1, startElapsed / transitionDuration)),
    outProgress: Math.max(0, Math.min(1, endRemaining / transitionDuration)),
    isIn:
      Boolean(clip.transitionIn && clip.transitionIn !== "none") &&
      startElapsed < transitionDuration,
    isOut:
      Boolean(clip.transitionOut && clip.transitionOut !== "none") &&
      endRemaining < transitionDuration,
  };
}

function applyTransition(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  time: number,
  canvasWidth: number,
  canvasHeight: number
) {
  const { inProgress, outProgress, isIn, isOut } = getTransitionProgress(clip, time);

  let alpha = 1;
  let scale = 1;
  let translateX = 0;
  let blur = 0;

  if (isIn) {
    if (clip.transitionIn === "fade") alpha = inProgress;
    if (clip.transitionIn === "zoom") scale = 0.92 + inProgress * 0.08;
    if (clip.transitionIn === "slide") translateX = (1 - inProgress) * canvasWidth * 0.08;
    if (clip.transitionIn === "blur") blur = (1 - inProgress) * 8;
  }

  if (isOut) {
    if (clip.transitionOut === "fade") alpha = Math.min(alpha, outProgress);
    if (clip.transitionOut === "zoom") scale = 0.92 + outProgress * 0.08;
    if (clip.transitionOut === "slide") translateX = (1 - outProgress) * -canvasWidth * 0.08;
    if (clip.transitionOut === "blur") blur = Math.max(blur, (1 - outProgress) * 8);
  }

  ctx.globalAlpha = alpha;
  ctx.translate(canvasWidth / 2 + translateX, canvasHeight / 2);
  ctx.scale(scale, scale);
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
  ctx.filter = blur > 0 ? `blur(${blur}px)` : "none";
}

function drawTextClip(
  ctx: CanvasRenderingContext2D,
  clip: VideoEditorClip,
  canvasWidth: number,
  canvasHeight: number,
  fallback: VideoTextStyle
) {
  const style = clip.textStyle ?? fallback;
  const x = canvasWidth * (style.x / 100);
  const y = canvasHeight * (style.y / 100);
  const fontSize = Math.round((style.fontSize / 1280) * canvasWidth * 1.05);

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${style.bold ? 900 : 500} ${fontSize}px sans-serif`;

  const metrics = ctx.measureText(clip.name);
  const paddingX = fontSize * 0.65;
  const paddingY = fontSize * 0.42;
  const boxWidth = metrics.width + paddingX * 2;
  const boxHeight = fontSize + paddingY * 2;

  if (style.backgroundColor !== "transparent") {
    ctx.fillStyle = style.backgroundColor;
    roundRect(ctx, x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 0);
    ctx.fill();
  }

  if (style.shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.85)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 8;
  }

  ctx.fillStyle = style.color;
  ctx.fillText(clip.name, x, y);
  ctx.restore();
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

export default forwardRef<VideoEditorRenderCanvasRef>(function VideoEditorRenderCanvas(
  _props,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    projectTitle,
    mediaItems,
    clips,
    totalDuration,
    canvasRatio,
    exportResolution,
    exportFps,
  } = useVideoEditor();

  useImperativeHandle(ref, () => {
    const renderToWebmBlob = async () => {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("렌더 캔버스를 찾지 못했습니다.");

      const size = getExportSize(exportResolution, canvasRatio);
      canvas.width = size.width;
      canvas.height = size.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context를 생성하지 못했습니다.");

      const imageCache = new Map<string, HTMLImageElement>();
      const videoCache = new Map<string, HTMLVideoElement>();

      const audioContext = new AudioContext();
      const audioDestination = audioContext.createMediaStreamDestination();
      const audioBufferCache = new Map<string, AudioBuffer>();
      const scheduledAudioNodes: AudioBufferSourceNode[] = [];

      const audioSources: AudioRenderSource[] = clips
        .map((clip) => {
          if (clip.type !== "audio" && clip.type !== "video") return null;
          if (clip.muted) return null;

          const media = clip.mediaId
            ? mediaItems.find((item) => item.id === clip.mediaId)
            : null;

          if (!media) return null;
          if (media.type !== "audio" && media.type !== "video") return null;

          return {
            clipId: clip.id,
            mediaId: media.id,
            url: media.url,
            startTime: clip.startTime,
            duration: clip.duration,
            trimStart: clip.trimStart ?? 0,
            trimEnd: clip.trimEnd ?? 0,
            volume: clip.volume ?? 1,
            muted: clip.muted ?? false,
            type: media.type,
          } as AudioRenderSource;
        })
        .filter(Boolean) as AudioRenderSource[];

      const scheduleAudio = async () => {
        await audioContext.resume();

        for (const source of audioSources) {
          let buffer = audioBufferCache.get(source.mediaId);

          if (!buffer) {
            buffer = await decodeAudioBuffer(audioContext, source.url);
            audioBufferCache.set(source.mediaId, buffer);
          }

          const bufferSource = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();

          bufferSource.buffer = buffer;
          gainNode.gain.value = Math.max(0, Math.min(2, source.volume));

          bufferSource.connect(gainNode);
          gainNode.connect(audioDestination);

          const offset = Math.max(0, source.trimStart);
          const safeDuration = Math.min(
            source.duration,
            Math.max(0.1, buffer.duration - offset - source.trimEnd)
          );

          bufferSource.start(
            audioContext.currentTime + source.startTime,
            offset,
            safeDuration
          );

          scheduledAudioNodes.push(bufferSource);
        }
      };

      const canvasStream = canvas.captureStream(exportFps);

      await scheduleAudio();

      const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks(),
      ]);

      const chunks: BlobPart[] = [];

      const recorder = new MediaRecorder(mixedStream, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const stopPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: "video/webm" }));
        };
      });

      const renderFrame = async (time: number) => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.filter = "none";
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const visibleClips = clips.filter(
          (clip) => time >= clip.startTime && time <= clip.startTime + clip.duration
        );

        for (const clip of visibleClips) {
          if (clip.type === "text") {
            ctx.save();
            applyTransition(ctx, clip, time, canvas.width, canvas.height);
            drawTextClip(ctx, clip, canvas.width, canvas.height, {
              fontSize: 42,
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.45)",
              x: 50,
              y: 50,
              bold: true,
              shadow: true,
            });
            ctx.restore();
            continue;
          }

          if (clip.type === "subtitle") {
            ctx.save();
            applyTransition(ctx, clip, time, canvas.width, canvas.height);
            drawTextClip(ctx, clip, canvas.width, canvas.height, {
              fontSize: 30,
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.72)",
              x: 50,
              y: 82,
              bold: true,
              shadow: true,
            });
            ctx.restore();
            continue;
          }

          const media = clip.mediaId
            ? mediaItems.find((item) => item.id === clip.mediaId)
            : null;

          if (!media) continue;

          if (media.type === "image") {
            let image = imageCache.get(media.id);

            if (!image) {
              image = await loadImage(media.url);
              imageCache.set(media.id, image);
            }

            ctx.save();
            applyTransition(ctx, clip, time, canvas.width, canvas.height);
            drawContainImage(ctx, image, image.width, image.height, canvas.width, canvas.height);
            ctx.restore();
          }

          if (media.type === "video") {
            let video = videoCache.get(media.id);

            if (!video) {
              video = (await loadMediaElement(media.url, "video")) as HTMLVideoElement;
              videoCache.set(media.id, video);
            }

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

            ctx.save();
            applyTransition(ctx, clip, time, canvas.width, canvas.height);
            drawContainImage(
              ctx,
              video,
              video.videoWidth || canvas.width,
              video.videoHeight || canvas.height,
              canvas.width,
              canvas.height
            );
            ctx.restore();
          }

          if (media.type === "audio") {
            ctx.save();
            applyTransition(ctx, clip, time, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#064e3b");
            gradient.addColorStop(0.5, "#000000");
            gradient.addColorStop(1, "#164e63");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = clip.muted ? "#fca5a5" : "#6ee7b7";
            ctx.font = `900 ${Math.round(canvas.width * 0.035)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(
              clip.muted ? `${media.name} (Muted)` : media.name,
              canvas.width / 2,
              canvas.height / 2
            );

            ctx.strokeStyle = clip.muted ? "rgba(248,113,113,0.65)" : "rgba(34,211,238,0.9)";
            ctx.lineWidth = Math.max(3, canvas.width * 0.003);

            const barCount = 64;
            const centerY = canvas.height * 0.62;
            const barWidth = canvas.width / barCount;

            for (let i = 0; i < barCount; i += 1) {
              const h =
                Math.abs(Math.sin(time * 4 + i * 0.35)) * canvas.height * 0.18 +
                canvas.height * 0.02;

              ctx.beginPath();
              ctx.moveTo(i * barWidth + barWidth / 2, centerY - h / 2);
              ctx.lineTo(i * barWidth + barWidth / 2, centerY + h / 2);
              ctx.stroke();
            }

            ctx.restore();
          }
        }
      };

      recorder.start();

      const frameDuration = 1 / exportFps;
      const totalFrames = Math.ceil(totalDuration * exportFps);
      const renderStartTime = performance.now();

      for (let frame = 0; frame <= totalFrames; frame += 1) {
        const time = frame * frameDuration;
        await renderFrame(time);

        const targetElapsedMs = time * 1000;
        const actualElapsedMs = performance.now() - renderStartTime;
        const waitMs = Math.max(0, targetElapsedMs - actualElapsedMs);

        if (waitMs > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, waitMs));
        } else {
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      }

      recorder.stop();

      scheduledAudioNodes.forEach((node) => {
        try {
          node.stop();
        } catch {
          // 이미 종료된 노드는 무시
        }
      });

      await audioContext.close();

      return stopPromise;
    };

    return {
      exportWebm: async () => {
        const blob = await renderToWebmBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeFileName(projectTitle)}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      },

      exportMp4: async (onProgress?: (progress: number) => void) => {
        const webmBlob = await renderToWebmBlob();

        await convertWebmBlobToMp4({
          webmBlob,
          title: projectTitle,
          onProgress,
        });
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
