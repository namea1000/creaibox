import {
  getFileFromCache,
  type VideoEditorClip,
  type VideoEditorMediaItem,
} from "../VideoEditorContext";
import { getFFmpeg, runWithFFmpegLock } from "../ffmpeg/convertWebmToMp4";
import { extractAudioWithMediabunny } from "./audioExtractor";

export type AudioMixSource = {
  clipId: string;
  mediaId: string;
  url: string;
  file?: File;
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
        file: media.file,
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

const globalAudioBufferCache = new Map<string, AudioBuffer>();

export async function extractAudioWithFFmpeg(getFileBytes: () => Promise<Uint8Array>, fileName: string): Promise<ArrayBuffer> {
  return runWithFFmpegLock(async (ffmpeg) => {
    const safeName = (fileName || "temp_video_audio")
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    const inputName = `input_${Date.now()}_${safeName}`;
    const outputName = `output_${Date.now()}_${safeName}.wav`;

    let u8Array: Uint8Array | null = await getFileBytes();
    await ffmpeg.writeFile(inputName, u8Array);
    u8Array = null; // Free the JS memory reference IMMEDIATELY before running exec!
    
    // Extract audio to standard 16-bit PCM WAV at 48000Hz (highly compatible with decodeAudioData)
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vn",
      "-acodec",
      "pcm_s16le",
      "-ar",
      "48000",
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    const u8 = data as Uint8Array;
    const audioBuffer = new ArrayBuffer(u8.byteLength);
    new Uint8Array(audioBuffer).set(u8);
    return audioBuffer;
  });
}

function ensureExtension(fileName: string, type: "video" | "audio"): string {
  const lower = fileName.toLowerCase();
  if (type === "video") {
    const videoExtensions = [".mp4", ".mov", ".webm", ".avi", ".mkv", ".flv", ".3gp", ".ts"];
    if (videoExtensions.some(ext => lower.endsWith(ext))) {
      return fileName;
    }
    return fileName + ".mp4";
  } else {
    const audioExtensions = [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac", ".wma"];
    if (audioExtensions.some(ext => lower.endsWith(ext))) {
      return fileName;
    }
    return fileName + ".mp3";
  }
}

async function decodeAudioBufferWithTimeout(
  mediaId: string,
  url: string,
  type: "video" | "audio",
  fileName: string,
  signal?: AbortSignal,
  file?: File
) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Browser does not support AudioContext");
  }
  const tempCtx = new AudioContextClass();
  const safeFileName = ensureExtension(fileName, type);

  try {
    if (type === "video") {
      // 1. Try to load the pre-extracted audio-only WAV file from IndexedDB cache to save memory
      try {
        const cachedAudioFile = await getFileFromCache("audio-extract-" + mediaId);
        if (cachedAudioFile) {
          console.log("[AudioMixdown] Found pre-extracted video audio in IndexedDB:", cachedAudioFile.name, cachedAudioFile.size);
          const arrayBuffer = await cachedAudioFile.arrayBuffer();
          const decoded = await tempCtx.decodeAudioData(arrayBuffer);
          return decoded;
        }
      } catch (err) {
        console.warn("[AudioMixdown] Failed to read cached pre-extracted audio file:", err);
      }

      // 2. Try extractAudioWithMediabunny first to avoid memory/RangeError issues
      console.log("[AudioMixdown] Trying Mediabunny streaming audio extraction for video file:", safeFileName);
      try {
        let fileOrBlob: File | Blob | null = file || null;
        if (!fileOrBlob) {
          const cachedFile = await getFileFromCache(mediaId);
          if (cachedFile) {
            fileOrBlob = cachedFile;
          }
        }
        if (!fileOrBlob && url) {
          console.log("[AudioMixdown] Fetching video URL as Blob reference:", url);
          const response = await fetch(url, { signal });
          fileOrBlob = await response.blob();
        }
        if (fileOrBlob) {
          const wavBlob = await extractAudioWithMediabunny(fileOrBlob);
          if (wavBlob === null) {
            console.log("[AudioMixdown] Video file is silent (no audio track). Returning silent AudioBuffer:", safeFileName);
            return tempCtx.createBuffer(2, 48000, 48000);
          }
          const wavBuffer = await wavBlob.arrayBuffer();
          const decoded = await tempCtx.decodeAudioData(wavBuffer);
          console.log("[AudioMixdown] Mediabunny extraction and native decode succeeded for video file:", safeFileName);
          return decoded;
        }
      } catch (mediabunnyError) {
        console.warn("[AudioMixdown] Mediabunny extraction failed, falling back to full-file native decode:", mediabunnyError);
      }

      // 3. Try native decodeAudioData as fallback for video file
      console.log("[AudioMixdown] Trying native decodeAudioData first for video file:", url, safeFileName);
      
      let arrayBuffer: ArrayBuffer | null = null;
      try {
        if (file) {
          console.log("[AudioMixdown] Reading from in-memory File object:", file.name, file.size);
          arrayBuffer = await file.arrayBuffer();
        } else {
          const cachedFile = await getFileFromCache(mediaId);
          if (cachedFile) {
            console.log("[AudioMixdown] Reading from IndexedDB cache:", mediaId);
            arrayBuffer = await cachedFile.arrayBuffer();
          }
        }
        if (!arrayBuffer) {
          if (!url || (!url.startsWith("blob:") && !url.startsWith("http:") && !url.startsWith("https:"))) {
            throw new Error("미디어 파일의 URL 또는 파일 데이터가 존재하지 않습니다. 미디어 파일을 재연결해 주세요.");
          }
          console.log("[AudioMixdown] Fetching video URL:", url);
          const response = await fetch(url, { signal });
          arrayBuffer = await response.arrayBuffer();
        }
        const decoded = await tempCtx.decodeAudioData(arrayBuffer);
        console.log("[AudioMixdown] Native decodeAudioData succeeded for video file:", safeFileName);
        return decoded;
      } catch (nativeError) {
        console.warn("[AudioMixdown] Native decodeAudioData failed for video file, trying FFmpeg fallback:", nativeError);
        
        // Free ArrayBuffer reference to minimize memory before launching FFmpeg
        arrayBuffer = null;

        const getFileBytes = async () => {
          try {
            if (file) {
              console.log("[AudioMixdown] Fallback: Found video File object in-memory:", file.name, file.size);
              return new Uint8Array(await file.arrayBuffer());
            }
            const cachedFile = await getFileFromCache(mediaId);
            if (cachedFile) {
              console.log("[AudioMixdown] Fallback: Found video file in IndexedDB cache:", mediaId);
              return new Uint8Array(await cachedFile.arrayBuffer());
            }
          } catch (err) {
            console.warn("[AudioMixdown] Fallback: Failed to read cached file:", err);
          }
          if (!url || (!url.startsWith("blob:") && !url.startsWith("http:") && !url.startsWith("https:"))) {
            throw new Error("미디어 파일의 URL 또는 파일 데이터가 존재하지 않습니다. 미디어 파일을 재연결해 주세요.");
          }
          console.log("[AudioMixdown] Fallback: Fetching video URL fallback:", url);
          const response = await fetch(url, { signal });
          return new Uint8Array(await response.arrayBuffer());
        };

        try {
          const wavBuffer = await extractAudioWithFFmpeg(getFileBytes, safeFileName);
          if (!wavBuffer || wavBuffer.byteLength === 0) {
            throw new Error("FFmpeg extracted an empty audio buffer");
          }
          const decoded = await tempCtx.decodeAudioData(wavBuffer);
          return decoded;
        } catch (ffmpegError) {
          console.error("[AudioMixdown] Fallback FFmpeg extraction failed for video file:", ffmpegError);
          throw nativeError; // throw original native decode error if both fail
        }
      }
    } else {
      let arrayBuffer: ArrayBuffer | null = null;
      try {
        if (file) {
          console.log("[AudioMixdown] Found audio File object in-memory:", file.name, file.size);
          arrayBuffer = await file.arrayBuffer();
        } else {
          const cachedFile = await getFileFromCache(mediaId);
          if (cachedFile) {
            console.log("[AudioMixdown] Found audio file in IndexedDB cache:", mediaId);
            arrayBuffer = await cachedFile.arrayBuffer();
          }
        }
      } catch (err) {
        console.warn("[AudioMixdown] Failed to read cached audio file:", err);
      }

      if (!arrayBuffer) {
        console.log("[AudioMixdown] Fetching audio URL:", url);
        const response = await fetch(url, { signal });
        arrayBuffer = await response.arrayBuffer();
      }

      try {
        const decoded = await tempCtx.decodeAudioData(arrayBuffer);
        arrayBuffer = null;
        return decoded;
      } catch (decodeError) {
        console.warn("[AudioMixdown] Browser decodeAudioData failed for audio file, trying FFmpeg fallback:", decodeError);
        arrayBuffer = null; // release reference

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
          const fallbackResponse = await fetch(url, { signal });
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

async function predecodeSources(sources: AudioMixSource[], signal?: AbortSignal) {
  const uniqueSources = Array.from(
    new Map(sources.map((s) => [s.mediaId, s])).values()
  );

  for (const source of uniqueSources) {
    if (globalAudioBufferCache.has(source.mediaId)) {
      continue;
    }
    if (signal?.aborted) return;

    try {
      // Decode sequentially to avoid memory spikes and Chrome "Aw, Snap!" (Error Code 5) OOM crashes.
      const buffer = await Promise.race([
        decodeAudioBufferWithTimeout(source.mediaId, source.url, source.type, source.name, signal, source.file),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Audio decoding timeout (15s)")), 15000)
        ),
      ]);
      globalAudioBufferCache.set(source.mediaId, buffer);
      // Yield to allow Chrome to run GC on the large ArrayBuffers
      await new Promise<void>((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      console.warn(
        `[AudioMixdown] Failed to decode audio for ${source.name} (${source.mediaId}):`,
        err
      );
    }
  }
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

  // Pre-decode all sources in parallel
  await predecodeSources(sources, signal);

  for (const source of sources) {
    if (signal?.aborted) {
      throw new DOMException("Export cancelled", "AbortError");
    }

    try {
      let buffer =
        bufferCache.get(source.mediaId) || globalAudioBufferCache.get(source.mediaId);

      if (!buffer) {
        // Fallback decode just in case predecode was skipped or failed
        buffer = await decodeAudioBufferWithTimeout(source.mediaId, source.url, source.type, source.name, signal, source.file);
        bufferCache.set(source.mediaId, buffer);
        globalAudioBufferCache.set(source.mediaId, buffer);
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

  // Pre-decode all sources in parallel
  await predecodeSources(sources, signal);

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
      let buffer =
        bufferCache.get(source.mediaId) || globalAudioBufferCache.get(source.mediaId);
      if (!buffer) {
        // Fallback decode just in case
        buffer = await decodeAudioBufferWithTimeout(source.mediaId, source.url, source.type, source.name, signal, source.file);
        bufferCache.set(source.mediaId, buffer);
        globalAudioBufferCache.set(source.mediaId, buffer);
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
