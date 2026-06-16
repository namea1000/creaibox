import * as Mediabunny from "mediabunny";

import { isWebCodecsConfigSupported, type WebCodecsSupport } from "./webCodecsSupport";

export const DIRECT_MP4_H264_CODEC_CANDIDATES = [
  "avc1.42001f",
  "avc1.4d002a",
  "avc1.64002a",
  "avc1.4d0033",
  "avc1.640033",
  "avc1.4d0034",
  "avc1.640034",
] as const;

export const DIRECT_MP4_AAC_CODEC_CANDIDATES = ["mp4a.40.2"] as const;

export type DirectMp4VideoSupport = WebCodecsSupport & {
  codecCandidates: string[];
};

export type DirectMp4AudioSupport = {
  supported: boolean;
  codec?: "aac";
  codecString?: string;
  sampleRate?: number;
  numberOfChannels?: number;
  bitrate?: number;
  codecCandidates: string[];
  reason?: string;
};

export type DirectMp4MuxerSupport = {
  supported: boolean;
  packageName: "mediabunny";
  reason?: string;
};

export type DirectMp4Support = {
  supported: boolean;
  video: DirectMp4VideoSupport;
  audio: DirectMp4AudioSupport;
  muxer: DirectMp4MuxerSupport;
  reason?: string;
};

type DirectMp4SupportInput = {
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  hasAudio: boolean;
  audioSampleRate?: number;
  audioChannels?: number;
  audioBitrate?: number;
};

type AudioEncoderLike = {
  isConfigSupported?: (config: {
    codec: string;
    sampleRate: number;
    numberOfChannels: number;
    bitrate?: number;
  }) => Promise<{ supported?: boolean }>;
};

export async function detectDirectMp4Support({
  width,
  height,
  fps,
  bitrate,
  hasAudio,
  audioSampleRate = 48_000,
  audioChannels = 2,
  audioBitrate = 160_000,
}: DirectMp4SupportInput): Promise<DirectMp4Support> {
  const [video, audio] = await Promise.all([
    detectDirectMp4VideoSupport({ width, height, fps, bitrate }),
    detectDirectMp4AudioSupport({
      sampleRate: audioSampleRate,
      numberOfChannels: audioChannels,
      bitrate: audioBitrate,
    }),
  ]);
  const muxer = detectDirectMp4MuxerSupport();
  const supported = video.supported && muxer.supported && (!hasAudio || audio.supported);
  const reason = supported
    ? undefined
    : [
        video.supported ? null : video.reason,
        hasAudio && !audio.supported ? audio.reason : null,
        muxer.supported ? null : muxer.reason,
      ]
        .filter(Boolean)
        .join(" ");

  return {
    supported,
    video,
    audio,
    muxer,
    reason: reason || undefined,
  };
}

export async function detectDirectMp4VideoSupport({
  width,
  height,
  fps,
  bitrate,
}: Pick<DirectMp4SupportInput, "width" | "height" | "fps" | "bitrate">): Promise<DirectMp4VideoSupport> {
  let lastFailure: WebCodecsSupport | null = null;

  for (const codec of DIRECT_MP4_H264_CODEC_CANDIDATES) {
    const support = await isWebCodecsConfigSupported({
      codec,
      width,
      height,
      fps,
      bitrate,
      bitrateMode: "variable",
    });

    if (support.supported) {
      return {
        ...support,
        codecCandidates: [...DIRECT_MP4_H264_CODEC_CANDIDATES],
      };
    }

    lastFailure = support;
  }

  return {
    supported: false,
    codec: DIRECT_MP4_H264_CODEC_CANDIDATES[0],
    width,
    height,
    fps,
    bitrate,
    bitrateMode: "variable",
    codecCandidates: [...DIRECT_MP4_H264_CODEC_CANDIDATES],
    reason:
      lastFailure?.reason ||
      `H.264 WebCodecs 구성을 지원하지 않습니다. (${width}x${height} ${fps}fps)`,
  };
}

export async function detectDirectMp4AudioSupport({
  sampleRate = 48_000,
  numberOfChannels = 2,
  bitrate = 160_000,
}: {
  sampleRate?: number;
  numberOfChannels?: number;
  bitrate?: number;
} = {}): Promise<DirectMp4AudioSupport> {
  if (typeof window === "undefined") {
    return {
      supported: false,
      codecCandidates: [...DIRECT_MP4_AAC_CODEC_CANDIDATES],
      reason: "브라우저 환경이 아닙니다.",
    };
  }

  const audioEncoder = (window as Window & { AudioEncoder?: AudioEncoderLike }).AudioEncoder;
  if (!audioEncoder?.isConfigSupported) {
    return {
      supported: false,
      codecCandidates: [...DIRECT_MP4_AAC_CODEC_CANDIDATES],
      reason: "이 브라우저는 AudioEncoder를 지원하지 않습니다.",
    };
  }

  for (const codecString of DIRECT_MP4_AAC_CODEC_CANDIDATES) {
    try {
      const support = await audioEncoder.isConfigSupported({
        codec: codecString,
        sampleRate,
        numberOfChannels,
        bitrate,
      });

      if (support.supported) {
        return {
          supported: true,
          codec: "aac",
          codecString,
          sampleRate,
          numberOfChannels,
          bitrate,
          codecCandidates: [...DIRECT_MP4_AAC_CODEC_CANDIDATES],
        };
      }
    } catch {
      // 다음 AAC codec string 후보를 검사합니다.
    }
  }

  return {
    supported: false,
    codec: "aac",
    codecString: DIRECT_MP4_AAC_CODEC_CANDIDATES[0],
    sampleRate,
    numberOfChannels,
    bitrate,
    codecCandidates: [...DIRECT_MP4_AAC_CODEC_CANDIDATES],
    reason: "AAC AudioEncoder 구성을 지원하지 않습니다.",
  };
}

export function detectDirectMp4MuxerSupport(): DirectMp4MuxerSupport {
  const hasMuxer =
    Boolean(Mediabunny.Output) &&
    Boolean(Mediabunny.Mp4OutputFormat) &&
    Boolean(Mediabunny.BufferTarget) &&
    Boolean(Mediabunny.CanvasSource) &&
    Boolean(Mediabunny.AudioBufferSource);

  return {
    supported: hasMuxer,
    packageName: "mediabunny",
    reason: hasMuxer ? undefined : "Mediabunny MP4 muxer 구성 요소를 찾지 못했습니다.",
  };
}
