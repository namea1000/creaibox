import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
} from "mediabunny";

import type { VideoExportOptions } from "./exportTypes";

type DirectMp4VideoExportInput = {
  canvas: HTMLCanvasElement;
  fps: number;
  totalDuration: number;
  totalFrames?: number;
  bitrate: number;
  audioBuffer?: AudioBuffer;
  audioBitrate?: number;
  renderFrame: (time: number) => Promise<void>;
  options?: VideoExportOptions;
};

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw new DOMException("Export cancelled", "AbortError");
}

export async function exportDirectMp4VideoOnly({
  canvas,
  fps,
  totalDuration,
  totalFrames: snapshotTotalFrames,
  bitrate,
  audioBuffer,
  audioBitrate = 160_000,
  renderFrame,
  options,
}: DirectMp4VideoExportInput) {
  const signal = options?.signal;
  throwIfAborted(signal);

  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target,
  });
  const videoSource = new CanvasSource(canvas, {
    codec: "avc",
    bitrate,
    keyFrameInterval: 2,
    sizeChangeBehavior: "deny",
  });
  const audioSource = audioBuffer
    ? new AudioBufferSource({
        codec: "aac",
        bitrate: audioBitrate,
        fullCodecString: "mp4a.40.2",
      })
    : null;

  output.addVideoTrack(videoSource);
  if (audioSource) {
    output.addAudioTrack(audioSource);
  }

  const totalFrames = Math.max(1, snapshotTotalFrames ?? Math.ceil(totalDuration * fps));
  const frameDuration = 1 / fps;
  let lastProgress = -1;

  try {
    options?.onProgress?.({
      stage: "encoding-webcodecs",
      progress: 0,
      message: "Direct MP4 H.264 인코딩을 시작합니다.",
    });

    await output.start();
    if (audioBuffer && audioSource) {
      options?.onProgress?.({
        stage: "encoding-webcodecs",
        progress: 2,
        message: "Direct MP4 AAC 오디오 트랙을 mux합니다.",
      });
      await audioSource.add(audioBuffer);
    }

    for (let frame = 0; frame < totalFrames; frame += 1) {
      throwIfAborted(signal);
      const time = frame * frameDuration;
      await renderFrame(time);
      await videoSource.add(time, frameDuration, {
        keyFrame: frame % Math.max(1, fps * 2) === 0,
      });

      const progress = Math.min(
        95,
        Math.round(((frame + 1) / Math.max(totalFrames, 1)) * 95),
      );
      if (progress !== lastProgress) {
        options?.onProgress?.({
          stage: "encoding-webcodecs",
          progress,
          message: `Direct MP4 H.264 인코딩 중 ${progress}%`,
        });
        lastProgress = progress;
      }

      if (frame % 5 === 0) {
        if (typeof document !== "undefined" && document.hidden) {
          await new Promise((resolve) => setTimeout(resolve, 4));
        } else {
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      }
    }

    await output.finalize();
    throwIfAborted(signal);

    if (!target.buffer) {
      throw new Error("Direct MP4 출력 버퍼가 생성되지 않았습니다.");
    }

    return new Blob([target.buffer], { type: "video/mp4" });
  } catch (error) {
    if (output.state !== "canceled" && output.state !== "finalized") {
      await output.cancel().catch(() => undefined);
    }
    throw error;
  }
}
