import type {
  VideoEditorClip,
  VideoEditorMediaItem,
} from "../VideoEditorContext";

export type AudioMixSource = {
  clipId: string;
  mediaId: string;
  url: string;
  name: string;
  startTime: number;
  duration: number;
  type: "audio" | "video";
  trimStart: number;
  trimEnd: number;
  volume: number;
  muted: boolean;
  fadeIn: number;
  fadeOut: number;
  audioGain: number;
  audioPan: number;
};

export type ScheduledAudioMix = {
  scheduledNodes: AudioBufferSourceNode[];
  skippedSources: Array<{
    source: AudioMixSource;
    reason: string;
  }>;
};

export type OfflineAudioMixdownResult = {
  audioBuffer: AudioBuffer;
  sources: AudioMixSource[];
  skippedSources: ScheduledAudioMix["skippedSources"];
};

export function detectOfflineAudioMixdownSupport() {
  if (typeof OfflineAudioContext === "undefined") {
    return {
      supported: false,
      reason: "OfflineAudioContext를 지원하지 않는 브라우저입니다.",
    };
  }

  return { supported: true };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 오류";
}

export function collectAudioMixSources({
  clips,
  mediaItems,
}: {
  clips: VideoEditorClip[];
  mediaItems: VideoEditorMediaItem[];
}) {
  return clips
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
        name: media.name,
        startTime: clip.startTime,
        duration: clip.duration,
        trimStart: clip.trimStart ?? 0,
        trimEnd: clip.trimEnd ?? 0,
        volume: clip.volume ?? 1,
        muted: clip.muted ?? false,
        fadeIn: clip.fadeIn ?? 0,
        fadeOut: clip.fadeOut ?? 0,
        audioGain: clip.audioGain ?? 1,
        audioPan: clip.audioPan ?? 0,
        type: media.type,
      } as AudioMixSource;
    })
    .filter(Boolean) as AudioMixSource[];
}

async function decodeAudioBuffer(audioContext: AudioContext, url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

async function decodeOfflineAudioBuffer(audioContext: OfflineAudioContext, url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

export async function scheduleAudioMixdown({
  audioContext,
  destination,
  sources,
  bufferCache,
  signal,
}: {
  audioContext: AudioContext;
  destination: MediaStreamAudioDestinationNode;
  sources: AudioMixSource[];
  bufferCache: Map<string, AudioBuffer>;
  signal?: AbortSignal;
}): Promise<ScheduledAudioMix> {
  const scheduledNodes: AudioBufferSourceNode[] = [];
  const skippedSources: ScheduledAudioMix["skippedSources"] = [];

  await audioContext.resume();

  for (const source of sources) {
    if (signal?.aborted) {
      throw new DOMException("Export cancelled", "AbortError");
    }

    try {
      let buffer = bufferCache.get(source.mediaId);

      if (!buffer) {
        buffer = await decodeAudioBuffer(audioContext, source.url);
        bufferCache.set(source.mediaId, buffer);
      }

      const bufferSource = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();
      const offset = Math.max(0, source.trimStart);
      const safeDuration = Math.min(
        source.duration,
        Math.max(0.1, buffer.duration - offset - source.trimEnd)
      );
      const startAt = audioContext.currentTime + source.startTime;
      const endAt = startAt + safeDuration;
      const baseVolume = clamp(source.volume * source.audioGain, 0, 3);
      const fadeInDuration = Math.min(Math.max(0, source.fadeIn), safeDuration);
      const fadeOutDuration = Math.min(Math.max(0, source.fadeOut), safeDuration);

      bufferSource.buffer = buffer;
      bufferSource.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(destination);

      gainNode.gain.setValueAtTime(fadeInDuration > 0 ? 0 : baseVolume, startAt);
      if (fadeInDuration > 0) {
        gainNode.gain.linearRampToValueAtTime(baseVolume, startAt + fadeInDuration);
      }
      if (fadeOutDuration > 0) {
        gainNode.gain.setValueAtTime(baseVolume, Math.max(startAt, endAt - fadeOutDuration));
        gainNode.gain.linearRampToValueAtTime(0, endAt);
      }
      panNode.pan.value = clamp(source.audioPan, -1, 1);

      bufferSource.start(startAt, offset, safeDuration);
      scheduledNodes.push(bufferSource);
    } catch (error) {
      skippedSources.push({
        source,
        reason: getErrorMessage(error),
      });
    }
  }

  return {
    scheduledNodes,
    skippedSources,
  };
}

export async function renderOfflineAudioMixdown({
  sources,
  duration,
  sampleRate = 48_000,
  numberOfChannels = 2,
  signal,
}: {
  sources: AudioMixSource[];
  duration: number;
  sampleRate?: number;
  numberOfChannels?: number;
  signal?: AbortSignal;
}): Promise<OfflineAudioMixdownResult> {
  if (typeof OfflineAudioContext === "undefined") {
    throw new Error("OfflineAudioContext를 지원하지 않는 브라우저입니다.");
  }

  const safeDuration = Math.max(0.1, duration);
  const frameCount = Math.ceil(safeDuration * sampleRate);
  const audioContext = new OfflineAudioContext(numberOfChannels, frameCount, sampleRate);
  const bufferCache = new Map<string, AudioBuffer>();
  const skippedSources: ScheduledAudioMix["skippedSources"] = [];

  for (const source of sources) {
    if (signal?.aborted) {
      throw new DOMException("Export cancelled", "AbortError");
    }

    try {
      let buffer = bufferCache.get(source.mediaId);
      if (!buffer) {
        buffer = await decodeOfflineAudioBuffer(audioContext, source.url);
        bufferCache.set(source.mediaId, buffer);
      }

      const bufferSource = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();
      const offset = Math.max(0, source.trimStart);
      const sourceDuration = Math.min(
        source.duration,
        Math.max(0.1, buffer.duration - offset - source.trimEnd)
      );
      const startAt = Math.max(0, source.startTime);
      const endAt = startAt + sourceDuration;
      const baseVolume = clamp(source.volume * source.audioGain, 0, 3);
      const fadeInDuration = Math.min(Math.max(0, source.fadeIn), sourceDuration);
      const fadeOutDuration = Math.min(Math.max(0, source.fadeOut), sourceDuration);

      bufferSource.buffer = buffer;
      bufferSource.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(fadeInDuration > 0 ? 0 : baseVolume, startAt);
      if (fadeInDuration > 0) {
        gainNode.gain.linearRampToValueAtTime(baseVolume, startAt + fadeInDuration);
      }
      if (fadeOutDuration > 0) {
        gainNode.gain.setValueAtTime(baseVolume, Math.max(startAt, endAt - fadeOutDuration));
        gainNode.gain.linearRampToValueAtTime(0, endAt);
      }
      panNode.pan.value = clamp(source.audioPan, -1, 1);

      bufferSource.start(startAt, offset, sourceDuration);
    } catch (error) {
      skippedSources.push({
        source,
        reason: getErrorMessage(error),
      });
    }
  }

  return {
    audioBuffer: await audioContext.startRendering(),
    sources,
    skippedSources,
  };
}
