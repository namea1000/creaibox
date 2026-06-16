"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Film,
  Music,
  VolumeX,
  Sparkles,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorTextLayer from "./VideoEditorTextLayer";
import VideoEditorSubtitleLayer from "./VideoEditorSubtitleLayer";
import {
  buildRenderFramePlan,
  type RenderFrameLayer,
} from "./render/renderFramePlan";
import {
  getRenderMotionAtTime,
  getRenderTransition,
} from "./render/videoRenderMath";
import type { VideoEditorClip, VideoEditorMediaItem } from "./VideoEditorContext";

type MediaElementAudioGraph = {
  audioContext: AudioContext;
  source: MediaElementAudioSourceNode;
  analyserNode: AnalyserNode;
  frequencyData: Uint8Array<ArrayBuffer>;
  gainNode: GainNode;
  panNode: StereoPannerNode;
  connected: boolean;
};

const GLOBAL_AUDIO_GRAPHS_KEY = "__creaibox_media_element_audio_graphs__";

const getMediaElementAudioGraphs = (): WeakMap<HTMLMediaElement, MediaElementAudioGraph> => {
  if (typeof window === "undefined") {
    return new WeakMap();
  }
  const win = window as any;
  if (!win[GLOBAL_AUDIO_GRAPHS_KEY]) {
    win[GLOBAL_AUDIO_GRAPHS_KEY] = new WeakMap();
  }
  return win[GLOBAL_AUDIO_GRAPHS_KEY];
};

const GLOBAL_AUDIO_CONTEXT_KEY = "__creaibox_global_audio_context__";

const getGlobalAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const win = window as any;
  if (!win[GLOBAL_AUDIO_CONTEXT_KEY]) {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    win[GLOBAL_AUDIO_CONTEXT_KEY] = new AudioContextClass();
  }
  return win[GLOBAL_AUDIO_CONTEXT_KEY];
};

export default function VideoEditorPreviewPlayer() {
  const {
    mediaItems,
    tracks,
    clips,
    selectedClipId,
    selectClip,
    currentTime,
    isPlaying,
    previewMediaItem,
    previewMediaTime,
    canvasRatio,
  } = useVideoEditor();

  const renderPlan = useMemo(
    () =>
      buildRenderFramePlan({
        clips,
        mediaItems,
        tracks,
        currentTime,
        canvasRatio,
      }),
    [canvasRatio, clips, currentTime, mediaItems, tracks]
  );

  if (previewMediaItem) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        {previewMediaItem.type === "video" ? (
          <video
            src={previewMediaItem.url}
            className="h-full w-full object-contain"
            ref={(el) => {
              if (el) el.currentTime = previewMediaTime;
            }}
          />
        ) : previewMediaItem.type === "image" ? (
          <img
            src={previewMediaItem.url}
            alt={previewMediaItem.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="text-center">
            <Music size={80} className="mx-auto mb-4 text-emerald-400" />
            <div className="text-sm font-bold text-white truncate max-w-[240px] px-4">
              {previewMediaItem.name}
            </div>
            <div className="text-[10px] text-zinc-500 mt-2">
              Audio Preview ({previewMediaTime.toFixed(1)}s)
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%)] bg-[length:32px_32px] bg-[position:0_0,16px_16px]" />

      {renderPlan.mediaLayers.length === 0 ? (
        <EmptyPreview />
      ) : (
        renderPlan.mediaLayers.map((layer) => {
          return (
            <PreviewMediaLayer
              key={layer.id}
              layer={layer}
              clip={layer.clip}
              media={layer.media}
              currentTime={currentTime}
              isPlaying={isPlaying}
              active={selectedClipId === layer.clip.id}
              zIndex={layer.zIndex}
              showAudioPlaceholder={!renderPlan.hasPictureLayer}
              onSelect={() => selectClip(layer.clip.id)}
            />
          );
        })
      )}

      <VideoEditorTextLayer />
      <VideoEditorSubtitleLayer />
    </>
  );
}

function EmptyPreview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <Film size={80} className="mx-auto mb-4 text-zinc-700" />
        <div className="text-xl font-bold text-zinc-400">Video Preview</div>
        <p className="mt-2 text-sm text-zinc-600">
          미디어를 업로드하고 타임라인에 추가하면 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}

function PreviewMediaLayer({
  layer,
  clip,
  media,
  currentTime,
  isPlaying,
  active,
  zIndex,
  showAudioPlaceholder,
  onSelect,
}: {
  layer?: RenderFrameLayer;
  clip: VideoEditorClip;
  media: VideoEditorMediaItem | null | undefined;
  currentTime: number;
  isPlaying: boolean;
  active: boolean;
  zIndex: number;
  showAudioPlaceholder: boolean;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const meterFrameRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const connectedMediaRef = useRef<HTMLMediaElement | null>(null);
  const audioGraphRef = useRef<MediaElementAudioGraph | null>(null);

  const trimStart = clip.trimStart ?? 0;
  const trimEnd = clip.trimEnd ?? 0;
  const localTime = Math.max(0, currentTime - clip.startTime + trimStart);
  const liveTimeRef = useRef(localTime);

  const previewStyle = buildPreviewStyle(clip, currentTime, zIndex);
  const previewLayerStyle: React.CSSProperties = active
    ? {
        ...previewStyle,
        outline: "1px solid rgba(255,255,255,0.9)",
        outlineOffset: "-1px",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.45), 0 0 10px rgba(255,255,255,0.22)",
      }
    : previewStyle;
  const mix = layer
    ? {
        volume: Math.min(layer.audioMix.volume, 1),
        gain: Math.min(clip.audioGain ?? 1, 3),
        pan: layer.audioMix.pan,
      }
    : getAudioMixValue(clip, currentTime);

  useEffect(() => {
    liveTimeRef.current = localTime;
  }, [localTime]);

  useEffect(() => {
    return () => {
      try {
        audioSourceRef.current?.disconnect();
        analyserNodeRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        panNodeRef.current?.disconnect();
      } catch {
        // 이미 해제된 노드는 무시
      }

      if (audioGraphRef.current) {
        audioGraphRef.current.connected = false;
      }

      if (meterFrameRef.current !== null) {
        cancelAnimationFrame(meterFrameRef.current);
      }

      audioContextRef.current = null;
      audioSourceRef.current = null;
      analyserNodeRef.current = null;
      frequencyDataRef.current = null;
      meterFrameRef.current = null;
      gainNodeRef.current = null;
      panNodeRef.current = null;
      connectedMediaRef.current = null;
      audioGraphRef.current = null;
    };
  }, []);

  const ensureAudioGraph = async (element: HTMLMediaElement) => {
    if (connectedMediaRef.current && connectedMediaRef.current !== element) {
      try {
        audioSourceRef.current?.disconnect();
        analyserNodeRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        panNodeRef.current?.disconnect();
      } catch {
        // 이미 해제된 노드는 무시
      }

      audioSourceRef.current = null;
      analyserNodeRef.current = null;
      frequencyDataRef.current = null;
      gainNodeRef.current = null;
      panNodeRef.current = null;
      connectedMediaRef.current = null;
      if (audioGraphRef.current) {
        audioGraphRef.current.connected = false;
        audioGraphRef.current = null;
      }
    }

    const graphs = getMediaElementAudioGraphs();
    let graph = graphs.get(element);

    if (!graph) {
      const audioContext = getGlobalAudioContext();

      if (!audioContext) {
        element.volume = mix.volume;
        return;
      }

      let source;
      try {
        source = audioContext.createMediaElementSource(element);
      } catch (err) {
        console.warn("createMediaElementSource failed (already connected):", err);
        element.volume = mix.volume;
        return;
      }
      const analyserNode = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();

      analyserNode.fftSize = 1024;
      analyserNode.smoothingTimeConstant = 0.78;

      graph = {
        audioContext,
        source,
        analyserNode,
        frequencyData: new Uint8Array(
          new ArrayBuffer(analyserNode.frequencyBinCount)
        ),
        gainNode,
        panNode,
        connected: false,
      };

      graphs.set(element, graph);
    }

    if (!graph.connected) {
      const { source, analyserNode, gainNode, panNode, audioContext } = graph;
      try {
        source.connect(analyserNode);
        analyserNode.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(audioContext.destination);
        graph.connected = true;
      } catch (err) {
        console.error("Failed to connect audio nodes:", err);
      }
    }

    audioContextRef.current = graph.audioContext;
    audioSourceRef.current = graph.source;
    analyserNodeRef.current = graph.analyserNode;
    frequencyDataRef.current = graph.frequencyData;
    gainNodeRef.current = graph.gainNode;
    panNodeRef.current = graph.panNode;
    connectedMediaRef.current = element;
    audioGraphRef.current = graph;

    if (graph.audioContext.state === "suspended") {
      await graph.audioContext.resume().catch(() => undefined);
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = mix.volume;
    }

    if (panNodeRef.current) {
      panNodeRef.current.pan.value = mix.pan;
    }

    element.volume = 1;
  };

  const stopAudioMeter = () => {
    if (meterFrameRef.current !== null) {
      cancelAnimationFrame(meterFrameRef.current);
      meterFrameRef.current = null;
    }

    window.dispatchEvent(
      new CustomEvent("creaibox-video-editor-audio-meter", {
        detail: { low: 0, mid: 0, high: 0 },
      })
    );
  };

  const startAudioMeter = () => {
    if (meterFrameRef.current !== null) return;

    const publishMeter = () => {
      const analyserNode = analyserNodeRef.current;
      const frequencyData = frequencyDataRef.current;

      if (!analyserNode || !frequencyData || !isPlaying || clip.muted) {
        stopAudioMeter();
        return;
      }

      analyserNode.getByteFrequencyData(frequencyData);

      const timeDomainData = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteTimeDomainData(timeDomainData);

      const lowLevel = calculateBandLevel(frequencyData, 0, 0.18, 1.18);
      const midLevel = calculateBandLevel(frequencyData, 0.18, 0.58, 1.48);
      const highLevel = calculateBandLevel(frequencyData, 0.58, 1, 1.85);

      window.dispatchEvent(
        new CustomEvent("creaibox-video-editor-audio-meter", {
          detail: {
            low: lowLevel,
            mid: midLevel,
            high: highLevel,
            frequencyData: new Uint8Array(frequencyData),
            timeDomainData: timeDomainData,
          },
        })
      );

      meterFrameRef.current = requestAnimationFrame(publishMeter);
    };

    meterFrameRef.current = requestAnimationFrame(publishMeter);
  };

  useEffect(() => {
    const handlePlaybackFrame = (event: Event) => {
      const customEvent = event as CustomEvent<{
        currentTime: number;
        totalDuration: number;
        isSeek?: boolean;
      }>;

      const nextGlobalTime = customEvent.detail.currentTime;
      const trimEnd = clip.trimEnd ?? 0;
      const effectiveDuration = Math.max(0, clip.duration - trimEnd);
      const nextLocalTime = Math.max(
        0,
        Math.min(
          nextGlobalTime - clip.startTime + trimStart,
          trimStart + effectiveDuration
        )
      );

      liveTimeRef.current = nextLocalTime;

      const video = videoRef.current;
      const audio = audioRef.current;
      const isSeek = Boolean(customEvent.detail.isSeek);

      if (isSeek || !isPlaying) {
        const syncThreshold = 0.05;

        if (media?.type === "video" && video) {
          if (isSeek || Math.abs(video.currentTime - nextLocalTime) > syncThreshold) {
            video.currentTime = nextLocalTime;
          }
        }

        if (media?.type === "audio" && audio) {
          if (isSeek || Math.abs(audio.currentTime - nextLocalTime) > syncThreshold) {
            audio.currentTime = nextLocalTime;
          }
        }
      }
    };

    window.addEventListener(
      "creaibox-video-editor-playback-frame",
      handlePlaybackFrame
    );

    return () => {
      window.removeEventListener(
        "creaibox-video-editor-playback-frame",
        handlePlaybackFrame
      );
    };
  }, [clip.startTime, clip.duration, trimStart, clip.trimEnd, media?.type, isPlaying]);

  useEffect(() => {
    if (media?.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const effectiveDuration = Math.max(0, clip.duration - trimEnd);
    const safeTime =
      effectiveDuration > 0
        ? Math.min(liveTimeRef.current, trimStart + effectiveDuration)
        : liveTimeRef.current;

    // 재생이 멈춰있거나 오차가 클 때만 싱크 맞추기
    if (!isPlaying || Math.abs(video.currentTime - safeTime) > 0.45) {
      video.currentTime = safeTime;
    }

    const hasAudio = media?.hasAudio !== false && (!media?.waveform || media.waveform.length > 0);
    video.muted = (clip.muted ?? false) || !hasAudio;

    if (hasAudio) {
      void ensureAudioGraph(video);
    }

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => undefined);
      if (hasAudio) {
        startAudioMeter();
      }
    } else {
      video.pause();
      stopAudioMeter();
    }
  }, [
    media?.type,
    media?.hasAudio,
    media?.waveform,
    isPlaying,
    clip.muted,
    clip.volume,
    clip.duration,
    trimStart,
    trimEnd,
    clip.fadeIn,
    clip.fadeOut,
    clip.audioGain,
    clip.audioPan,
  ]);

  useEffect(() => {
    if (media?.type !== "audio") return;

    const audio = audioRef.current;
    if (!audio) return;

    const effectiveDuration = Math.max(0, clip.duration - trimEnd);
    const safeTime =
      effectiveDuration > 0
        ? Math.min(liveTimeRef.current, trimStart + effectiveDuration)
        : liveTimeRef.current;

    // 재생이 멈춰있거나 오차가 클 때만 싱크 맞추기
    if (!isPlaying || Math.abs(audio.currentTime - safeTime) > 0.45) {
      audio.currentTime = safeTime;
    }

    audio.muted = clip.muted ?? false;

    void ensureAudioGraph(audio);

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => undefined);
      startAudioMeter();
    } else {
      audio.pause();
      stopAudioMeter();
    }
  }, [
    media?.type,
    isPlaying,
    clip.muted,
    clip.volume,
    clip.duration,
    trimStart,
    trimEnd,
    clip.fadeIn,
    clip.fadeOut,
    clip.audioGain,
    clip.audioPan,
  ]);

  const sharedClass = "absolute flex items-center justify-center overflow-hidden bg-black";

  if (media?.type === "audio") {
    return (
      <>
        {showAudioPlaceholder && (
          <button
            type="button"
            onClick={onSelect}
            className={`${sharedClass} bg-gradient-to-br from-emerald-950 via-black to-cyan-950`}
            style={previewLayerStyle}
          >
            <div className="text-center">
              {clip.muted ? (
                <VolumeX size={84} className="mx-auto mb-5 text-red-300" />
              ) : (
                <Music size={84} className="mx-auto mb-5 text-emerald-300" />
              )}

              <div className="text-xl font-black text-white">{media.name}</div>
              <p className="mt-2 text-sm text-emerald-200/70">
                오디오 클립 재생 중 · 볼륨 {Math.round(mix.volume * 100)}%
                {Math.abs(mix.pan) > 0.01
                  ? ` · ${mix.pan < 0 ? "L" : "R"} ${Math.round(Math.abs(mix.pan) * 100)}%`
                  : ""}
              </p>
            </div>
          </button>
        )}
        {media.url ? <audio ref={audioRef} src={media.url} /> : null}
      </>
    );
  }

  if (clip.type === "visualizer") {
    return (
      <div
        onClick={onSelect}
        className="absolute inset-0 flex items-center justify-center overflow-hidden bg-transparent border-0 z-20 outline-none"
        style={previewLayerStyle}
      >
        <VisualizerPlaceholder clip={clip} currentTime={currentTime} isPlaying={isPlaying} />
      </div>
    );
  }

  if (!media) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${sharedClass} bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center`}
        style={previewLayerStyle}
      >
        <div className="text-center p-4">
          <VolumeX size={48} className="mx-auto mb-3 text-red-400 animate-pulse" />
          <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 mb-2 inline-block rounded-md">
            MEDIA OFFLINE
          </span>
          <div className="text-xs font-bold text-red-200 truncate max-w-[240px] mx-auto">
            {clip.name}
          </div>
          <div className="text-[9px] text-red-400 mt-1 leading-normal">
            새로고침으로 연결이 끊어졌습니다.<br />미디어를 재연결하세요.
          </div>
        </div>
      </button>
    );
  }

  if (!media.url) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${sharedClass} bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center`}
        style={previewLayerStyle}
      >
        <div className="text-center p-4">
          <VolumeX size={48} className="mx-auto mb-3 text-red-400 animate-pulse" />
          <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 mb-2 inline-block rounded-md">
            MEDIA OFFLINE
          </span>
          <div className="text-xs font-bold text-red-200 truncate max-w-[240px] mx-auto">
            {media.name}
          </div>
          <div className="text-[9px] text-red-400 mt-1 leading-normal">
            새로고침으로 연결이 끊어졌습니다.<br />미디어를 재연결하세요.
          </div>
        </div>

      </button>
    );
  }

  if (media.type === "image") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={sharedClass}
        style={previewLayerStyle}
      >
        <img
          src={media.url}
          alt={media.name}
          className="h-full w-full object-cover"
        />

      </button>
    );
  }

  if (media.type === "video") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={sharedClass}
        style={previewLayerStyle}
      >
        <video
          ref={videoRef}
          src={media.url}
          playsInline
          className="h-full w-full object-cover"
        />

      </button>
    );
  }

  return null;
}

function buildPreviewStyle(
  clip: VideoEditorClip,
  currentTime: number,
  zIndex: number
): React.CSSProperties {
  const motion = getRenderMotionAtTime(clip, currentTime);
  const transition = getRenderTransition(clip, currentTime);
  const effects = getEffectsStyle(clip);

  return {
    zIndex,
    left: `${motion.x}%`,
    top: `${motion.y}%`,
    width: `${motion.width}%`,
    height: `${motion.height}%`,
    opacity: motion.opacity * transition.opacity,
    transform: [
      "translate(-50%, -50%)",
      `translateX(${transition.translateX}%)`,
      `translateY(${transition.translateY}%)`,
      `scale(${motion.scale * transition.scale})`,
      `rotate(${motion.rotation + transition.rotate}deg)`,
    ].join(" "),
    clipPath:
      transition.clipInsetLeft > 0 ||
        transition.clipInsetRight > 0 ||
        transition.clipInsetTop > 0 ||
        transition.clipInsetBottom > 0
        ? `inset(${transition.clipInsetTop * 100}% ${transition.clipInsetRight * 100}% ${transition.clipInsetBottom * 100}% ${transition.clipInsetLeft * 100}%)`
        : undefined,
    filter: [
      `brightness(${effects.brightness * transition.brightness})`,
      `contrast(${effects.contrast})`,
      `saturate(${effects.saturation})`,
      `blur(${effects.blur + transition.blur}px)`,
      effects.grayscale > 0 ? `grayscale(${effects.grayscale})` : "",
      effects.sepia > 0 ? `sepia(${effects.sepia})` : "",
    ]
      .filter(Boolean)
      .join(" "),
    mixBlendMode: effects.blendMode,
  };
}

function getEffectsStyle(clip: VideoEditorClip) {
  return {
    brightness: clip.brightness ?? 1,
    contrast: clip.contrast ?? 1,
    saturation: clip.saturation ?? 1,
    blur: clip.blur ?? 0,
    grayscale: clip.grayscale ?? 0,
    sepia: clip.sepia ?? 0,
    blendMode: clip.blendMode ?? "normal",
  } as {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: number;
    sepia: number;
    blendMode: React.CSSProperties["mixBlendMode"];
  };
}

function mapBlendMode(mode: string): GlobalCompositeOperation {
  if (mode === "normal") return "source-over";
  if (mode === "soft-light") return "soft-light";
  if (mode === "hard-light") return "hard-light";
  return (mode || "source-over") as GlobalCompositeOperation;
}

function VisualizerPlaceholder({
  clip,
  currentTime,
  isPlaying,
}: {
  clip: VideoEditorClip;
  currentTime: number;
  isPlaying: boolean;
}) {
  const { tracks, clips: allClips, mediaItems, updateClip, selectedClipId } = useVideoEditor();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, actionType: string) => {
    e.stopPropagation();
    e.preventDefault();

    const container = containerRef.current?.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const startYPct = (clip as any).visualizerY ?? 50;
    const startHeight = (clip as any).visualizerHeight ?? 58;
    const startWidth = (clip as any).visualizerWidth ?? 92;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const deltaXPct = (deltaX / rect.width) * 100;
      const deltaYPct = (deltaY / rect.height) * 100;

      const currentXPct = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const currentYPct = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      let nextY = startYPct;
      let nextWidth = startWidth;
      let nextHeight = startHeight;

      if (actionType === "move") {
        nextY = Math.max(0, Math.min(100, startYPct + deltaYPct));
        updateClip(clip.id, { visualizerY: nextY } as any);
      } else {
        // Resize logic
        // 1. Width adjustment (symmetric relative to 50% center)
        if (actionType.includes("l") || actionType.includes("r")) {
          nextWidth = Math.max(20, Math.min(100, Math.abs(currentXPct - 50) * 2));
        }

        // 2. Height adjustment (top t or bottom b)
        if (actionType.includes("t")) {
          if (startYPct > 0) {
            nextHeight = Math.max(5, Math.min(100, ((startYPct - currentYPct) * 100) / startYPct));
          }
        } else if (actionType.includes("b")) {
          if (startYPct < 100) {
            nextHeight = Math.max(5, Math.min(100, ((currentYPct - startYPct) * 100) / (100 - startYPct)));
          }
        }

        updateClip(clip.id, {
          visualizerWidth: nextWidth,
          visualizerHeight: nextHeight,
        } as any);
      }
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const latestDataRef = useRef<{
    frequencyData: Uint8Array | null;
    timeDomainData: Uint8Array | null;
  }>({
    frequencyData: null,
    timeDomainData: null,
  });

  const localFreqRef = useRef<Float32Array>(new Float32Array(512));
  const localWaveRef = useRef<Float32Array>(new Float32Array(512).fill(128));
  const smoothedFreqRef = useRef<{ count: number; values: number[] }>({
    count: 0,
    values: [],
  });

  const template = (clip as any).visualizerTemplate || "circle";
  const accentColor = (clip as any).visualizerAccentColor || "#ff4fd8";
  const backgroundColor = (clip as any).visualizerBackgroundColor || "#050507";
  const visualizerY = (clip as any).visualizerY ?? 50;
  const visualizerHeight = (clip as any).visualizerHeight ?? 58;
  const visualizerWidth = (clip as any).visualizerWidth ?? 92;

  // Video overlay settings from the visualizer clip
  const videoOpacity = (clip as any).visualizerVideoOpacity ?? 65;
  const videoBlendMode = (clip as any).visualizerVideoBlendMode || "screen";

  // Automatic overlay sourcing from the topmost active Video Track clip
  const videoTracks = tracks.filter((t) => t.type === "video");

  const activeOverlayClip = videoTracks
    .map((track) =>
      allClips.find(
        (c) =>
          c.trackId === track.id &&
          currentTime >= c.startTime &&
          currentTime <= c.startTime + c.duration
      )
    )
    .find((clip) => clip !== undefined) || null;

  const overlayMedia = activeOverlayClip?.mediaId
    ? mediaItems.find((item) => item.id === activeOverlayClip.mediaId)
    : null;
  const overlayUrl = overlayMedia?.url || "";
  const overlayType = overlayMedia?.type || "";

  useEffect(() => {
    const handleMeter = (event: Event) => {
      const customEvent = event as CustomEvent<{
        low: number;
        mid: number;
        high: number;
        frequencyData?: Uint8Array;
        timeDomainData?: Uint8Array;
      }>;
      latestDataRef.current.frequencyData = customEvent.detail.frequencyData || null;
      latestDataRef.current.timeDomainData = customEvent.detail.timeDomainData || null;
    };
    window.addEventListener("creaibox-video-editor-audio-meter", handleMeter);
    return () => {
      window.removeEventListener("creaibox-video-editor-audio-meter", handleMeter);
    };
  }, []);

  // Load event effect for resetting and updating video elements immediately when overlay source changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !overlayUrl || overlayType !== "video") return;
    video.load();
  }, [overlayUrl, overlayType]);

  // Sync video overlay playback progress when manual seek or state transitions occur
  useEffect(() => {
    const handlePlaybackFrame = (event: Event) => {
      const customEvent = event as CustomEvent<{
        currentTime: number;
        totalDuration: number;
        isSeek?: boolean;
      }>;
      const video = videoRef.current;
      if (!video || !overlayUrl || overlayType !== "video" || !activeOverlayClip) return;

      const isSeek = Boolean(customEvent.detail.isSeek);
      const nextTime = customEvent.detail.currentTime;

      if (isSeek || !isPlaying) {
        const trimStart = activeOverlayClip.trimStart ?? 0;
        const trimEnd = activeOverlayClip.trimEnd ?? 0;
        const effectiveDuration = Math.max(0, activeOverlayClip.duration - trimEnd);
        const clipTime = Math.max(0, nextTime - activeOverlayClip.startTime + trimStart);
        const safeTime = effectiveDuration > 0 ? Math.min(clipTime, trimStart + effectiveDuration) : clipTime;

        video.currentTime = safeTime;
      }
    };

    window.addEventListener("creaibox-video-editor-playback-frame", handlePlaybackFrame);
    return () => {
      window.removeEventListener("creaibox-video-editor-playback-frame", handlePlaybackFrame);
    };
  }, [overlayUrl, overlayType, activeOverlayClip, isPlaying]);

  // Video overlay element standard state effects with active playhead synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !overlayUrl || overlayType !== "video" || !activeOverlayClip) return;

    const trimStart = activeOverlayClip.trimStart ?? 0;
    const trimEnd = activeOverlayClip.trimEnd ?? 0;
    const effectiveDuration = Math.max(0, activeOverlayClip.duration - trimEnd);
    const clipTime = Math.max(0, currentTime - activeOverlayClip.startTime + trimStart);
    const safeTime = effectiveDuration > 0 ? Math.min(clipTime, trimStart + effectiveDuration) : clipTime;

    if (Math.abs(video.currentTime - safeTime) > 0.15) {
      video.currentTime = safeTime;
    }

    video.muted = true;
    video.playsInline = true;

    if (isPlaying) {
      if (video.paused) {
        void video.play().catch(() => undefined);
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isPlaying, currentTime, overlayUrl, overlayType, activeOverlayClip]);

  // Canvas visualizer rendering loop with smooth decay and correct blend & background opacity composite operations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const localFreq = localFreqRef.current;
    const localWave = localWaveRef.current;

    const frame = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(frame);
        return;
      }

      // 1. Fetch data from event listener or smoothly decay values
      const hasNewEvent = latestDataRef.current.frequencyData !== null;
      if (hasNewEvent && isPlaying) {
        const evFreq = latestDataRef.current.frequencyData!;
        const evWave = latestDataRef.current.timeDomainData!;

        for (let i = 0; i < 512; i++) {
          const targetF = evFreq[i] ?? 0;
          const targetW = evWave[i] ?? 128;
          localFreq[i] += (targetF - localFreq[i]) * 0.45;
          localWave[i] += (targetW - localWave[i]) * 0.45;
        }
      } else if (!isPlaying) {
        for (let i = 0; i < 512; i++) {
          localFreq[i] += (0 - localFreq[i]) * 0.15;
          localWave[i] += (128 - localWave[i]) * 0.15;
        }
      }

      latestDataRef.current.frequencyData = null;
      latestDataRef.current.timeDomainData = null;

      // 2. Clear and draw base background color (using videoOpacity to apply background transparency)
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.save();
        ctx.globalAlpha = videoOpacity / 100;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 3. Draw connected video/image overlay on canvas using globalAlpha & globalCompositeOperation
      if (overlayUrl) {
        if (overlayType === "video" && videoRef.current) {
          const video = videoRef.current;
          if (video.readyState >= 1) {
            ctx.save();
            ctx.globalAlpha = videoOpacity / 100;
            ctx.globalCompositeOperation = mapBlendMode(videoBlendMode);
            const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
            const videoW = video.videoWidth * scale;
            const videoH = video.videoHeight * scale;
            const videoX = (width - videoW) / 2;
            const videoY = (height - videoH) / 2;
            ctx.drawImage(video, videoX, videoY, videoW, videoH);
            ctx.restore();
          }
        } else if (overlayType === "image" && imageRef.current) {
          const img = imageRef.current;
          if (img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = videoOpacity / 100;
            ctx.globalCompositeOperation = mapBlendMode(videoBlendMode);
            const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
            const imgW = img.naturalWidth * scale;
            const imgH = img.naturalHeight * scale;
            const imgX = (width - imgW) / 2;
            const imgY = (height - imgH) / 2;
            ctx.drawImage(img, imgX, imgY, imgW, imgH);
            ctx.restore();
          }
        }
      }

      // 4. Setup visualizer styles
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(0.5, "#d946ef");
      gradient.addColorStop(1, "#22d3ee");

      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.shadowBlur = 18;
      ctx.shadowColor = accentColor;

      const avg = Array.from(localFreq).reduce((a, b) => a + b, 0) / 512;
      const bufferLength = 512;

      const spectrumCenterY = height / 2;
      const spectrumMaxHeight = height * 0.8;
      const spectrumDrawWidth = width;
      const spectrumStartX = 0;

      const getFreq = (i: number, count: number) => {
        const safeCount = Math.max(count, 1);
        const position = i / Math.max(safeCount - 1, 1);

        // Define frequency search range
        const minBin = 2; // Capture deeper bass frequencies
        const maxBin = Math.max(Math.floor(bufferLength * 0.65), minBin + 2); // Exclude dead high-frequency ranges to concentrate response

        const toLogBin = (ratio: number) => {
          const safeRatio = Math.min(Math.max(ratio, 0), 1);
          return Math.floor(minBin * Math.pow(maxBin / minBin, safeRatio));
        };

        // Mix linear index progression to guarantee unique, independent bin mappings per bar (no groupings)
        const linearOffset = Math.floor(position * (bufferLength * 0.18));
        const start = Math.max(toLogBin(i / safeCount), minBin + linearOffset);
        const end = Math.max(toLogBin((i + 1) / safeCount), start + 1);

        let total = 0;
        for (let index = start; index < end; index += 1) {
          total += localFreq[index] || 0;
        }

        const average = total / Math.max(end - start, 1);

        // Enhance treble lift and bass dynamically
        const highFrequencyLift = 1 + position * 0.65;
        const lowFrequencyTame = 0.88 + position * 0.12;

        // Increase sensitivity on lower frequency levels
        const targetValue = Math.min(
          255,
          Math.pow(average / 255, 0.78) * 235 * highFrequencyLift * lowFrequencyTame
        );

        if (smoothedFreqRef.current.count !== safeCount) {
          smoothedFreqRef.current = { count: safeCount, values: Array(safeCount).fill(targetValue) };
        }

        const previousValue = smoothedFreqRef.current.values[i] ?? targetValue;

        // Boost reaction velocity (ascent 0.48, decay 0.28) for a punchier, bouncy animation
        const smoothing = targetValue > previousValue ? 0.48 : 0.28;
        const visibleValue = previousValue + (targetValue - previousValue) * smoothing;
        smoothedFreqRef.current.values[i] = visibleValue;

        return visibleValue;
      };

      // Render templates
      if (template === "bars" || template === "skyline") {
        const count = template === "skyline" ? 72 : 96;
        const barWidth = spectrumDrawWidth / count;
        // Align skyline baseline flush with the canvas bottom and scale height to 100%
        const skylineBaseY = height;
        const maxH = template === "skyline" ? height : spectrumMaxHeight;

        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const barHeight = (value / 255) * maxH;
          const x = spectrumStartX + i * barWidth;
          const y =
            template === "skyline"
              ? skylineBaseY - barHeight
              : spectrumCenterY - barHeight / 2;
          ctx.fillRect(x + 3, y, Math.max(barWidth - 6, 2), barHeight);
        }
      }

      else if (template === "mirror-bars") {
        const count = 88;
        const barWidth = spectrumDrawWidth / count;
        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const barHeight = (value / 255) * (spectrumMaxHeight * 0.5);
          const x = spectrumStartX + i * barWidth;
          ctx.fillRect(x + 3, spectrumCenterY - barHeight, Math.max(barWidth - 6, 2), barHeight);
          ctx.fillRect(x + 3, spectrumCenterY, Math.max(barWidth - 6, 2), barHeight);
        }
      }

      else if (template === "circle" || template === "ring" || template === "orbit" || template === "radial-dots") {
        const cx = width / 2;
        const cy = height / 2;
        const baseRadius = Math.min(width, height) * 0.25 + avg * 0.12;
        const count = template === "radial-dots" ? 90 : 140;

        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(10, baseRadius - 22), 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const angle = (i / count) * Math.PI * 2;
          const amp = (value / 255) * (Math.min(width, height) * 0.22);

          if (template === "radial-dots") {
            const r = baseRadius + amp;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 2 + value / 45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const x1 = cx + Math.cos(angle) * baseRadius;
            const y1 = cy + Math.sin(angle) * baseRadius;
            const x2 = cx + Math.cos(angle) * (baseRadius + amp);
            const y2 = cy + Math.sin(angle) * (baseRadius + amp);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        if (template === "orbit") {
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, baseRadius + 40 + i * 24 + Math.sin(Date.now() / 500 + i) * 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      else if (template === "wave" || template === "twin-wave" || template === "line" || template === "mountain" || template === "heartbeat" || template === "minimal") {
        const count = template === "minimal" ? 80 : bufferLength;
        ctx.beginPath();

        for (let i = 0; i < count; i++) {
          const value = template === "minimal" ? getFreq(i, count) : localWave[i] || 128;
          const x = spectrumStartX + (i / Math.max(count - 1, 1)) * spectrumDrawWidth;
          let y = spectrumCenterY;

          if (template === "wave") y = spectrumCenterY + ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
          if (template === "twin-wave") y = spectrumCenterY + ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
          if (template === "line") y = spectrumCenterY - (getFreq(i, count) / 255) * (spectrumMaxHeight * 0.5) + Math.sin(i * 0.22) * (spectrumMaxHeight * 0.12);
          if (template === "mountain") y = height - (getFreq(i, count) / 255) * height; // Align baseline with canvas bottom and scale to full height
          if (template === "heartbeat") y = spectrumCenterY + Math.sin(i * 0.12) * (spectrumMaxHeight * 0.08) - (getFreq(i, count) / 255) * (spectrumMaxHeight * 0.35);
          if (template === "minimal") y = spectrumCenterY - (value / 255) * (spectrumMaxHeight * 0.24);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (template === "mountain") {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.globalAlpha = 0.5;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          ctx.stroke();
        }

        if (template === "twin-wave") {
          ctx.beginPath();
          for (let i = 0; i < count; i++) {
            const value = localWave[i] || 128;
            const x = spectrumStartX + (i / Math.max(count - 1, 1)) * spectrumDrawWidth;
            const y = spectrumCenterY - ((value - 128) / 128) * (spectrumMaxHeight * 0.5);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      else if (template === "dots" || template === "particles") {
        const count = template === "particles" ? 120 : 64;
        for (let i = 0; i < count; i++) {
          const value = getFreq(i, count);
          const x = template === "particles" ? (Math.sin(i * 12.989 + Date.now() / 900) * 0.5 + 0.5) * width : (i / count) * width;
          const y = template === "particles" ? (Math.cos(i * 7.12 + Date.now() / 1200) * 0.5 + 0.5) * height : height / 2 + Math.sin(i * 0.4) * 60;
          const size = 3 + (value / 255) * 16;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(1, size / 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      else if (template === "progress") {
        const progressWidth = width * 0.68;
        const progressHeight = 20;
        const x = (width - progressWidth) / 2;
        const y = height / 2 - progressHeight / 2;
        const value = Math.min(1, 0.18 + avg / 220);

        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.roundRect(x, y, progressWidth, progressHeight, 999);
        ctx.fill();

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, progressWidth * value, progressHeight, 999);
        ctx.fill();
      }

      else if (template === "equalizer") {
        const cols = 28;
        const rows = 12;
        const gap = 4;
        const blockW = (width * 0.72) / cols - gap;
        const blockH = Math.max(2, (height * 0.5) / rows - gap);
        const startX = width * 0.14;
        const baseY = height / 2 + rows * (blockH + gap) * 0.5;

        for (let i = 0; i < cols; i++) {
          const value = getFreq(i, cols);
          const activeRows = Math.ceil((value / 255) * rows);
          for (let j = 0; j < activeRows; j++) {
            ctx.fillRect(startX + i * (blockW + gap), baseY - j * (blockH + gap), blockW, blockH);
          }
        }
      }

      else if (template === "tunnel") {
        const cx = width / 2;
        const cy = height / 2;
        for (let i = 0; i < 12; i++) {
          const value = getFreq(i * 4, 48);
          const radius = 20 + i * 20 + value * 0.25;
          ctx.globalAlpha = Math.max(0.05, 1 - i * 0.08);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      else if (template === "pulse-square") {
        const size = Math.min(width, height) * 0.35 + avg * 0.8;
        ctx.beginPath();
        ctx.roundRect(width / 2 - size / 2, height / 2 - size / 2, size, size, 20);
        ctx.stroke();
      }

      else if (template === "vinyl") {
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.3 + avg * 0.2;

        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = gradient;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(5, radius - i * 16), 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(4, 20 + avg * 0.05), 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, template, accentColor, backgroundColor, overlayUrl, overlayType, videoOpacity, videoBlendMode]);

  const isSelected = selectedClipId === clip.id;

  return (
    <div
      ref={containerRef}
      className={`absolute flex flex-col items-center justify-center overflow-visible ${
        isSelected
          ? "border border-dashed border-cyan-400 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          : ""
      }`}
      style={{
        left: `${(100 - visualizerWidth) / 2}%`,
        top: `${visualizerY}%`,
        width: `${visualizerWidth}%`,
        height: `${visualizerHeight}%`,
        transform: `translateY(-${visualizerY}%)`,
        cursor: isSelected ? "move" : "pointer",
      }}
      onPointerDown={isSelected ? (e) => handlePointerDown(e, "move") : undefined}
    >
      {/* Hidden Media Sourcing Elements (purely for canvas context drawing) */}
      <div className="absolute pointer-events-none opacity-0 w-1 h-1 left-[-9999px] top-[-9999px] overflow-hidden">
        {overlayUrl && (
          overlayType === "video" ? (
            <video
              ref={videoRef}
              src={overlayUrl}
              muted
              playsInline
              autoPlay
              loop
            />
          ) : (
            <img
              ref={imageRef}
              src={overlayUrl}
              alt="Visualizer image source"
            />
          )
        )}
      </div>

      <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />

      <div
        className="absolute bottom-[-28px] text-[10px] font-black select-none px-2 py-0.5 rounded bg-black/30 border border-white/5 animate-pulse whitespace-nowrap z-30 pointer-events-none"
        style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}` }}
      >
        {clip.name || "Audio Visualizer"}
      </div>

      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Top Edge */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ns-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "t")}
          />
          {/* Bottom Edge */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ns-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "b")}
          />
          {/* Left Edge */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ew-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "l")}
          />
          {/* Right Edge */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-ew-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "r")}
          />
          {/* Top-Left */}
          <div
            className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "tl")}
          />
          {/* Top-Right */}
          <div
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "tr")}
          />
          {/* Bottom-Left */}
          <div
            className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "bl")}
          />
          {/* Bottom-Right */}
          <div
            className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize z-40 hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(e, "br")}
          />
        </>
      )}
    </div>
  );
}

function getAudioMixValue(clip: VideoEditorClip, currentTime: number) {
  const anyClip = clip as VideoEditorClip & {
    fadeIn?: number;
    fadeOut?: number;
    audioGain?: number;
    audioPan?: number;
  };

  const baseVolume = clamp((clip.volume ?? 1) * (anyClip.audioGain ?? 1), 0, 2);
  const fadeIn = anyClip.fadeIn ?? 0;
  const fadeOut = anyClip.fadeOut ?? 0;

  const clipElapsed = currentTime - clip.startTime;
  const clipRemaining = clip.startTime + clip.duration - currentTime;

  let fadeMultiplier = 1;

  if (fadeIn > 0 && clipElapsed < fadeIn) {
    fadeMultiplier = Math.min(fadeMultiplier, clamp(clipElapsed / fadeIn, 0, 1));
  }

  if (fadeOut > 0 && clipRemaining < fadeOut) {
    fadeMultiplier = Math.min(
      fadeMultiplier,
      clamp(clipRemaining / fadeOut, 0, 1)
    );
  }

  return {
    volume: clamp(baseVolume * fadeMultiplier, 0, 1),
    gain: clamp(anyClip.audioGain ?? 1, 0, 3),
    pan: clamp(anyClip.audioPan ?? 0, -1, 1),
  };
}

function calculateBandLevel(
  frequencyData: Uint8Array,
  startRatio: number,
  endRatio: number,
  boost: number
) {
  const startIndex = Math.max(0, Math.floor(frequencyData.length * startRatio));
  const endIndex = Math.max(
    startIndex + 1,
    Math.ceil(frequencyData.length * endRatio)
  );

  let sum = 0;
  let squareSum = 0;
  let peak = 0;

  for (let index = startIndex; index < endIndex; index += 1) {
    const value = frequencyData[index] ?? 0;
    sum += value;
    squareSum += value * value;
    peak = Math.max(peak, value);
  }

  const count = endIndex - startIndex;
  const averageLevel = sum / count / 255;
  const rmsLevel = Math.sqrt(squareSum / count) / 255;
  const peakLevel = peak / 255;
  const livelyLevel = averageLevel * 0.38 + rmsLevel * 0.36 + peakLevel * 0.26;
  const gatedLevel = Math.max(0, livelyLevel - 0.035) / 0.965;
  const compressedLevel = Math.pow(gatedLevel, 0.52) * boost;

  return clamp(compressedLevel, 0, 0.92);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
