"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  Film,
  Image as ImageIcon,
  Music,
  VolumeX,
  Sparkles,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorTextLayer from "./VideoEditorTextLayer";
import VideoEditorSubtitleLayer from "./VideoEditorSubtitleLayer";
import type { VideoEditorClip, VideoEditorMediaItem } from "./VideoEditorContext";

export default function VideoEditorPreviewPlayer() {
  const {
    mediaItems,
    tracks,
    clips,
    selectedClipId,
    selectClip,
    currentTime,
    isPlaying,
  } = useVideoEditor();

  const visibleClips = useMemo(
    () =>
      clips.filter(
        (clip) =>
          currentTime >= clip.startTime &&
          currentTime <= clip.startTime + clip.duration
      ),
    [clips, currentTime]
  );

  const mediaClips = useMemo(() => {
    const trackOrder = new Map(tracks.map((track, index) => [track.id, index]));

    return visibleClips
      .filter(
        (clip) =>
          clip.type === "video" ||
          clip.type === "image" ||
          clip.type === "audio" ||
          clip.type === "visualizer"
      )
      .sort((a, b) => {
        const aTrackIndex = trackOrder.get(a.trackId) ?? Number.MAX_SAFE_INTEGER;
        const bTrackIndex = trackOrder.get(b.trackId) ?? Number.MAX_SAFE_INTEGER;

        if (aTrackIndex !== bTrackIndex) return bTrackIndex - aTrackIndex;
        return a.startTime - b.startTime;
      });
  }, [tracks, visibleClips]);

  const hasVisiblePictureLayer = mediaClips.some(
    (clip) =>
      clip.type === "video" ||
      clip.type === "image" ||
      clip.type === "visualizer"
  );

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%)] bg-[length:32px_32px] bg-[position:0_0,16px_16px]" />

      {mediaClips.length === 0 ? (
        <EmptyPreview />
      ) : (
        mediaClips.map((clip, index) => {
          const media = clip.mediaId
            ? mediaItems.find((item) => item.id === clip.mediaId)
            : null;

          return (
            <PreviewMediaLayer
              key={clip.id}
              clip={clip}
              media={media}
              currentTime={currentTime}
              isPlaying={isPlaying}
              active={selectedClipId === clip.id}
              zIndex={10 + index}
              showAudioPlaceholder={!hasVisiblePictureLayer}
              onSelect={() => selectClip(clip.id)}
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
  clip,
  media,
  currentTime,
  isPlaying,
  active,
  zIndex,
  showAudioPlaceholder,
  onSelect,
}: {
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
  const gainNodeRef = useRef<GainNode | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const connectedMediaRef = useRef<HTMLMediaElement | null>(null);

  const trimStart = clip.trimStart ?? 0;
  const trimEnd = clip.trimEnd ?? 0;
  const localTime = Math.max(0, currentTime - clip.startTime + trimStart);
  const liveTimeRef = useRef(localTime);

  const previewStyle = buildPreviewStyle(clip, currentTime, zIndex);
  const mix = getAudioMixValue(clip, currentTime);

  useEffect(() => {
    liveTimeRef.current = localTime;
  }, [localTime]);

  useEffect(() => {
    return () => {
      try {
        audioSourceRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        panNodeRef.current?.disconnect();
      } catch {
        // 이미 해제된 노드는 무시
      }

      void audioContextRef.current?.close().catch(() => undefined);

      audioContextRef.current = null;
      audioSourceRef.current = null;
      gainNodeRef.current = null;
      panNodeRef.current = null;
      connectedMediaRef.current = null;
    };
  }, []);

  const ensureAudioGraph = async (element: HTMLMediaElement) => {
    const needsWebAudio = Math.abs(mix.pan) > 0.001 || mix.gain !== 1;

    if (!needsWebAudio) {
      element.volume = mix.volume;
      return;
    }

    if (connectedMediaRef.current && connectedMediaRef.current !== element) {
      try {
        audioSourceRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        panNodeRef.current?.disconnect();
      } catch {
        // 이미 해제된 노드는 무시
      }

      audioSourceRef.current = null;
      gainNodeRef.current = null;
      panNodeRef.current = null;
      connectedMediaRef.current = null;
    }

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        element.volume = mix.volume;
        return;
      }

      audioContextRef.current = new AudioContextClass();
    }

    const audioContext = audioContextRef.current;

    if (!audioSourceRef.current) {
      const source = audioContext.createMediaElementSource(element);
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();

      source.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(audioContext.destination);

      audioSourceRef.current = source;
      gainNodeRef.current = gainNode;
      panNodeRef.current = panNode;
      connectedMediaRef.current = element;
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume().catch(() => undefined);
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = mix.volume;
    }

    if (panNodeRef.current) {
      panNodeRef.current.pan.value = mix.pan;
    }

    element.volume = 1;
  };

  useEffect(() => {
    const handlePlaybackFrame = (event: Event) => {
      const customEvent = event as CustomEvent<{
        currentTime: number;
        totalDuration: number;
        isSeek?: boolean;
      }>;

      const nextGlobalTime = customEvent.detail.currentTime;
      const nextLocalTime = Math.max(
        0,
        nextGlobalTime - clip.startTime + trimStart
      );

      liveTimeRef.current = nextLocalTime;

      const video = videoRef.current;
      const audio = audioRef.current;
      const isSeek = Boolean(customEvent.detail.isSeek);

      // 재생 중일 때는 1.0초 이상의 누적 편차 개입을 완전히 차단(0.1ms의 오디오 간섭도 차단)하여 4~5초 주기 더듬음/반복 버그를 근절합니다.
      // 오직 타임라인을 클릭하는 수동 점프(isSeek === true)나 일시정지 상태(!isPlaying)일 때만 미디어 시간을 덮어씁니다.
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
  }, [clip.startTime, trimStart, media?.type, isPlaying]);

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

    video.muted = clip.muted ?? false;

    void ensureAudioGraph(video);

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => undefined);
    } else {
      video.pause();
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
    } else {
      audio.pause();
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

  const sharedClass = `absolute flex items-center justify-center overflow-hidden bg-black ${active ? "ring-4 ring-cyan-400/70" : ""
    }`;

  if (media?.type === "audio" && !showAudioPlaceholder) {
    return media.url ? <audio ref={audioRef} src={media.url} /> : null;
  }

  if (clip.type === "visualizer" || !media) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${sharedClass} bg-gradient-to-br from-fuchsia-950 via-black to-cyan-950`}
        style={previewStyle}
      >
        <VisualizerPlaceholder clip={clip} currentTime={currentTime} />
      </button>
    );
  }

  if (!media.url) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${sharedClass} bg-red-950/80 border-2 border-red-500/50 flex items-center justify-center`}
        style={previewStyle}
      >
        <div className="text-center p-4">
          <VolumeX size={48} className="mx-auto mb-3 text-red-400 animate-pulse" />
          <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 mb-2 inline-block rounded-none">
            MEDIA OFFLINE
          </span>
          <div className="text-xs font-bold text-red-200 truncate max-w-[240px] mx-auto">
            {media.name}
          </div>
          <div className="text-[9px] text-red-400 mt-1 leading-normal">
            새로고침으로 연결이 끊어졌습니다.<br />미디어를 재연결하세요.
          </div>
        </div>

        <LayerBadge
          icon={VolumeX}
          label="OFFLINE"
          tone="red"
          name={media.name}
          muted={true}
        />
      </button>
    );
  }

  if (media.type === "image") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={sharedClass}
        style={previewStyle}
      >
        <img
          src={media.url}
          alt={media.name}
          className="h-full w-full object-contain"
        />

        <LayerBadge
          icon={ImageIcon}
          label="IMAGE"
          tone="violet"
          name={media.name}
          muted={clip.muted}
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
        style={previewStyle}
      >
        <video
          ref={videoRef}
          src={media.url}
          playsInline
          className="h-full w-full object-contain"
        />

        <LayerBadge
          icon={Film}
          label="VIDEO"
          tone="cyan"
          name={media.name}
          muted={clip.muted}
          volume={mix.volume}
          pan={mix.pan}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${sharedClass} bg-gradient-to-br from-emerald-950 via-black to-cyan-950`}
      style={previewStyle}
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

      <audio ref={audioRef} src={media.url} />

      <LayerBadge
        icon={Music}
        label="AUDIO"
        tone="emerald"
        name={media.name}
        muted={clip.muted}
        volume={mix.volume}
        pan={mix.pan}
      />
    </button>
  );
}

function buildPreviewStyle(
  clip: VideoEditorClip,
  currentTime: number,
  zIndex: number
): React.CSSProperties {
  const motion = getMotionStyle(clip);
  const transition = getTransitionStyle(clip, currentTime);
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
      `rotate(${motion.rotation}deg)`,
    ].join(" "),
    filter: [
      `brightness(${effects.brightness})`,
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

function getMotionStyle(clip: VideoEditorClip) {
  return {
    x: clamp(clip.motionX ?? 50, 0, 100),
    y: clamp(clip.motionY ?? 50, 0, 100),
    width: clamp(clip.motionWidth ?? 100, 5, 200),
    height: clamp(clip.motionHeight ?? 100, 5, 200),
    scale: clamp(clip.scale ?? 1, 0.1, 5),
    rotation: clip.rotation ?? 0,
    opacity: clamp(clip.opacity ?? 1, 0, 1),
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

function getTransitionStyle(clip: VideoEditorClip, currentTime: number) {
  const { inProgress, outProgress, isIn, isOut } = getTransitionProgress(
    clip,
    currentTime
  );

  let opacity = 1;
  let scale = 1;
  let blur = 0;
  let translateX = 0;
  const translateY = 0;

  if (isIn) {
    if (clip.transitionIn === "fade") opacity = inProgress;
    if (clip.transitionIn === "zoom") scale = 0.92 + inProgress * 0.08;
    if (clip.transitionIn === "slide") translateX = (1 - inProgress) * 8;
    if (clip.transitionIn === "blur") blur = (1 - inProgress) * 8;
  }

  if (isOut) {
    if (clip.transitionOut === "fade") opacity = Math.min(opacity, outProgress);
    if (clip.transitionOut === "zoom") scale = 0.92 + outProgress * 0.08;
    if (clip.transitionOut === "slide") translateX = (1 - outProgress) * -8;
    if (clip.transitionOut === "blur") blur = Math.max(blur, (1 - outProgress) * 8);
  }

  return {
    opacity,
    scale,
    blur,
    translateX,
    translateY,
  };
}

function getTransitionProgress(clip: VideoEditorClip, currentTime: number) {
  const transitionDuration = Math.min(0.6, clip.duration / 3);
  const startElapsed = currentTime - clip.startTime;
  const endRemaining = clip.startTime + clip.duration - currentTime;

  const inProgress = Math.max(
    0,
    Math.min(1, startElapsed / transitionDuration)
  );

  const outProgress = Math.max(
    0,
    Math.min(1, endRemaining / transitionDuration)
  );

  return {
    inProgress,
    outProgress,
    isIn:
      Boolean(clip.transitionIn && clip.transitionIn !== "none") &&
      startElapsed < transitionDuration,
    isOut:
      Boolean(clip.transitionOut && clip.transitionOut !== "none") &&
      endRemaining < transitionDuration,
  };
}

function VisualizerPlaceholder({
  clip,
  currentTime,
}: {
  clip: VideoEditorClip;
  currentTime: number;
}) {
  const bars = Array.from({ length: 36 });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Sparkles size={54} className="mb-5 text-pink-300" />

      <div className="mb-8 text-lg font-black text-white">
        {clip.name || "Audio Visualizer"}
      </div>

      <div className="flex h-32 w-[72%] items-center justify-center gap-2">
        {bars.map((_, index) => {
          const height =
            20 + Math.abs(Math.sin(currentTime * 4 + index * 0.45)) * 80;

          return (
            <div
              key={index}
              className="w-2 rounded-none bg-gradient-to-t from-cyan-300 to-pink-400 shadow-[0_0_18px_rgba(34,211,238,0.65)]"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function LayerBadge({
  icon: Icon,
  label,
  tone,
  name,
  muted,
  volume,
  pan,
}: {
  icon: React.ElementType;
  label: string;
  tone: "cyan" | "violet" | "emerald" | "red";
  name: string;
  muted?: boolean;
  volume?: number;
  pan?: number;
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-200"
      : tone === "violet"
        ? "text-violet-200"
        : tone === "emerald"
          ? "text-emerald-200"
          : "text-red-200";

  return (
    <div
      className={`absolute left-4 bottom-4 flex max-w-[78%] items-center gap-2 rounded-none bg-black/70 px-3 py-2 text-xs font-bold ${toneClass}`}
    >
      <Icon size={14} />
      <span>{label}</span>
      {muted && <VolumeX size={13} className="text-red-300" />}
      <span className="truncate text-white/60">{name}</span>
      {typeof volume === "number" && (
        <span className="shrink-0 text-white/40">
          {Math.round(volume * 100)}%
        </span>
      )}
      {typeof pan === "number" && Math.abs(pan) > 0.01 && (
        <span className="shrink-0 text-white/40">
          {pan < 0 ? "L" : "R"} {Math.round(Math.abs(pan) * 100)}
        </span>
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
