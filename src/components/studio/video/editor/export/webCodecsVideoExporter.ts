import type { WebCodecsVideoExportInput } from "./webCodecsExportTypes";

type EncodedFrame = {
  data: Uint8Array;
  timestampMs: number;
  keyFrame: boolean;
};

function safeFileName(value: string) {
  return (value || "creaibox-video")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw new DOMException("Export cancelled", "AbortError");
}

function concatBytes(parts: Uint8Array[]) {
  const total = parts.reduce((sum, item) => sum + item.length, 0);
  const bytes = new Uint8Array(total);
  let offset = 0;

  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }

  return bytes;
}

function idBytes(hex: string) {
  const clean = hex.replace(/\s+/g, "");
  const bytes = new Uint8Array(clean.length / 2);

  for (let index = 0; index < clean.length; index += 2) {
    bytes[index / 2] = parseInt(clean.slice(index, index + 2), 16);
  }

  return bytes;
}

function encodeSize(size: number) {
  for (let length = 1; length <= 8; length += 1) {
    const max = 2 ** (7 * length) - 2;
    if (size <= max) {
      const bytes = new Uint8Array(length);
      let value = size;

      for (let index = length - 1; index >= 0; index -= 1) {
        bytes[index] = value & 0xff;
        value = Math.floor(value / 256);
      }

      bytes[0] |= 1 << (8 - length);
      return bytes;
    }
  }

  throw new Error("WebM element is too large.");
}

function unsignedInt(value: number) {
  if (value === 0) return new Uint8Array([0]);

  const bytes: number[] = [];
  let next = value;

  while (next > 0) {
    bytes.unshift(next & 0xff);
    next = Math.floor(next / 256);
  }

  return new Uint8Array(bytes);
}

function float64(value: number) {
  const buffer = new ArrayBuffer(8);
  new DataView(buffer).setFloat64(0, value, false);
  return new Uint8Array(buffer);
}

function textBytes(value: string) {
  return new TextEncoder().encode(value);
}

function element(id: string, data: Uint8Array) {
  return concatBytes([idBytes(id), encodeSize(data.length), data]);
}

function uintElement(id: string, value: number) {
  return element(id, unsignedInt(value));
}

function stringElement(id: string, value: string) {
  return element(id, textBytes(value));
}

function floatElement(id: string, value: number) {
  return element(id, float64(value));
}

function simpleBlock(frame: EncodedFrame) {
  const relativeTime = Math.max(-32768, Math.min(32767, frame.timestampMs));
  const blockHeader = new Uint8Array(4);
  blockHeader[0] = 0x81;
  blockHeader[1] = (relativeTime >> 8) & 0xff;
  blockHeader[2] = relativeTime & 0xff;
  blockHeader[3] = frame.keyFrame ? 0x80 : 0x00;

  return element("A3", concatBytes([blockHeader, frame.data]));
}

function createCluster(timecode: number, frames: EncodedFrame[]) {
  const blocks = frames.map((frame) =>
    simpleBlock({
      ...frame,
      timestampMs: frame.timestampMs - timecode,
    })
  );

  return element("1F43B675", concatBytes([uintElement("E7", timecode), ...blocks]));
}

function createWebmBlob({
  frames,
  width,
  height,
  duration,
}: {
  frames: EncodedFrame[];
  width: number;
  height: number;
  duration: number;
}) {
  const ebmlHeader = element(
    "1A45DFA3",
    concatBytes([
      uintElement("4286", 1),
      uintElement("42F7", 1),
      uintElement("42F2", 4),
      uintElement("42F3", 8),
      stringElement("4282", "webm"),
      uintElement("4287", 4),
      uintElement("4285", 2),
    ])
  );
  const info = element(
    "1549A966",
    concatBytes([
      uintElement("2AD7B1", 1_000_000),
      stringElement("4D80", "CreAibox Video Studio"),
      stringElement("5741", "CreAibox WebCodecs Exporter"),
      floatElement("4489", duration),
    ])
  );
  const video = element(
    "E0",
    concatBytes([uintElement("B0", width), uintElement("BA", height)])
  );
  const trackEntry = element(
    "AE",
    concatBytes([
      uintElement("D7", 1),
      uintElement("73C5", 1),
      uintElement("83", 1),
      stringElement("86", "V_VP8"),
      stringElement("536E", "Fast WebCodecs Video"),
      video,
    ])
  );
  const tracks = element("1654AE6B", trackEntry);
  const groupedFrames = new Map<number, EncodedFrame[]>();

  for (const frame of frames) {
    const clusterTimecode = Math.floor(frame.timestampMs / 30_000) * 30_000;
    const group = groupedFrames.get(clusterTimecode) ?? [];
    group.push(frame);
    groupedFrames.set(clusterTimecode, group);
  }

  const clusters = Array.from(groupedFrames.entries()).map(([timecode, group]) =>
    createCluster(timecode, group)
  );
  const segment = element("18538067", concatBytes([info, tracks, ...clusters]));

  return new Blob([concatBytes([ebmlHeader, segment])], {
    type: "video/webm",
  });
}

export async function exportWebCodecsVideoOnly({
  canvas,
  width,
  height,
  fps,
  totalDuration,
  totalFrames: snapshotTotalFrames,
  title,
  bitrate,
  codec = "vp8",
  renderFrame,
  options,
}: WebCodecsVideoExportInput) {
  const signal = options?.signal;
  throwIfAborted(signal);

  const frames: EncodedFrame[] = [];
  const encoder = new VideoEncoder({
    output: (chunk) => {
      const data = new Uint8Array(chunk.byteLength);
      chunk.copyTo(data);
      frames.push({
        data,
        timestampMs: Math.round(chunk.timestamp / 1000),
        keyFrame: chunk.type === "key",
      });
    },
    error: (error) => {
      throw error;
    },
  });

  encoder.configure({
    codec,
    width,
    height,
    bitrate,
    framerate: fps,
  });

  const totalFrames = snapshotTotalFrames ?? Math.ceil(totalDuration * fps);
  const frameDurationUs = Math.round(1_000_000 / fps);

  try {
    options?.onProgress?.({
      stage: "encoding-webcodecs",
      progress: 0,
      message: "WebCodecs video-only 인코딩을 시작합니다.",
    });

    for (let frame = 0; frame <= totalFrames; frame += 1) {
      throwIfAborted(signal);
      const time = frame / fps;
      await renderFrame(time);

      const videoFrame = new VideoFrame(canvas, {
        timestamp: Math.round(time * 1_000_000),
        duration: frameDurationUs,
      });

      encoder.encode(videoFrame, {
        keyFrame: frame % Math.max(1, fps * 2) === 0,
      });
      videoFrame.close();

      const progress = Math.min(
        95,
        Math.round((frame / Math.max(totalFrames, 1)) * 95)
      );
      options?.onProgress?.({
        stage: "encoding-webcodecs",
        progress,
        message: `WebCodecs 인코딩 중 ${progress}%`,
      });

      if (frame % 30 === 0) {
        if (typeof document !== "undefined" && document.hidden) {
          await new Promise<void>((resolve) => {
            const channel = new MessageChannel();
            channel.port1.onmessage = () => resolve();
            channel.port2.postMessage(null);
          });
        } else {
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      }
    }

    await encoder.flush();
    throwIfAborted(signal);

    const blob = createWebmBlob({
      frames,
      width,
      height,
      duration: totalDuration,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(title)}-fast-webcodecs.webm`;
    a.click();
    URL.revokeObjectURL(url);

    options?.onProgress?.({
      stage: "completed",
      progress: 100,
      message: "WebCodecs WebM 파일 저장을 시작했습니다.",
    });
  } finally {
    if (encoder.state !== "closed") {
      encoder.close();
    }
  }
}
