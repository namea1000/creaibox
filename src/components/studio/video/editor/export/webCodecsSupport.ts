export type WebCodecsSupport = {
  supported: boolean;
  codec?: string;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: number;
  bitrateMode?: "constant" | "variable";
  experimental?: boolean;
  reason?: string;
};

export type WebCodecsAudioSupport = {
  supported: boolean;
  codec?: "opus" | "aac";
  sampleRate?: number;
  numberOfChannels?: number;
  bitrate?: number;
  reason?: string;
};

type VideoEncoderConfigWithSupport = VideoEncoderConfig & {
  bitrateMode?: "constant" | "variable";
};

type AudioEncoderLike = {
  isConfigSupported?: (config: {
    codec: string;
    sampleRate: number;
    numberOfChannels: number;
    bitrate?: number;
  }) => Promise<{ supported?: boolean }>;
};

export type WebCodecsTargetConfigInput = {
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  codec?: string;
  bitrateMode?: "constant" | "variable";
};

export async function detectWebCodecsSupport(): Promise<WebCodecsSupport> {
  const baseline = await isWebCodecsConfigSupported({
    codec: "vp8",
    width: 1280,
    height: 720,
    bitrate: 4_000_000,
    fps: 30,
    bitrateMode: "variable",
  });

  if (!baseline.supported) {
    return {
      supported: false,
      reason: baseline.reason,
    };
  }

  return {
    supported: true,
    codec: baseline.codec,
    width: baseline.width,
    height: baseline.height,
    fps: baseline.fps,
    bitrate: baseline.bitrate,
    bitrateMode: baseline.bitrateMode,
  };
}

export async function isWebCodecsConfigSupported({
  width,
  height,
  fps,
  bitrate,
  codec = "vp8",
  bitrateMode = "variable",
}: WebCodecsTargetConfigInput): Promise<WebCodecsSupport> {
  if (typeof window === "undefined") {
    return { supported: false, reason: "브라우저 환경이 아닙니다." };
  }

  if (!("VideoEncoder" in window)) {
    return { supported: false, reason: "이 브라우저는 VideoEncoder를 지원하지 않습니다." };
  }

  if (!("VideoFrame" in window)) {
    return { supported: false, reason: "이 브라우저는 VideoFrame을 지원하지 않습니다." };
  }

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { supported: false, reason: "WebCodecs target 해상도가 올바르지 않습니다." };
  }

  if (!Number.isFinite(fps) || fps <= 0) {
    return { supported: false, reason: "WebCodecs target FPS가 올바르지 않습니다." };
  }

  const config: VideoEncoderConfigWithSupport = {
    codec,
    width: Math.floor(width),
    height: Math.floor(height),
    bitrate: Math.max(1, Math.floor(bitrate)),
    framerate: fps,
    bitrateMode,
  };

  try {
    const support = await VideoEncoder.isConfigSupported(config);
    if (!support.supported) {
      return {
        supported: false,
        codec,
        width: config.width,
        height: config.height,
        fps,
        bitrate: config.bitrate,
        bitrateMode,
        reason: `${codec.toUpperCase()} ${config.width}x${config.height} ${fps}fps WebCodecs 구성을 지원하지 않습니다.`,
      };
    }
  } catch {
    return {
      supported: false,
      codec,
      width: config.width,
      height: config.height,
      fps,
      bitrate: config.bitrate,
      bitrateMode,
      reason: "WebCodecs target config 지원 여부 확인에 실패했습니다.",
    };
  }

  return {
    supported: true,
    codec,
    width: config.width,
    height: config.height,
    fps,
    bitrate: config.bitrate,
    bitrateMode,
    experimental: width > 1920 || height > 1920 || fps > 30,
  };
}

export async function detectWebCodecsAudioSupport(): Promise<WebCodecsAudioSupport> {
  if (typeof window === "undefined") {
    return { supported: false, reason: "브라우저 환경이 아닙니다." };
  }

  const audioEncoder = (window as Window & { AudioEncoder?: AudioEncoderLike }).AudioEncoder;
  if (!audioEncoder?.isConfigSupported) {
    return { supported: false, reason: "이 브라우저는 AudioEncoder를 지원하지 않습니다." };
  }

  const candidates: Array<Required<Pick<WebCodecsAudioSupport, "codec" | "sampleRate" | "numberOfChannels" | "bitrate">>> = [
    { codec: "opus", sampleRate: 48_000, numberOfChannels: 2, bitrate: 128_000 },
    { codec: "aac", sampleRate: 48_000, numberOfChannels: 2, bitrate: 160_000 },
  ];

  for (const candidate of candidates) {
    try {
      const support = await audioEncoder.isConfigSupported({
        codec: candidate.codec,
        sampleRate: candidate.sampleRate,
        numberOfChannels: candidate.numberOfChannels,
        bitrate: candidate.bitrate,
      });

      if (support.supported) {
        return {
          supported: true,
          ...candidate,
        };
      }
    } catch {
      // 다음 codec 후보를 계속 검사합니다.
    }
  }

  return {
    supported: false,
    reason: "Opus/AAC AudioEncoder 구성을 지원하지 않습니다.",
  };
}
