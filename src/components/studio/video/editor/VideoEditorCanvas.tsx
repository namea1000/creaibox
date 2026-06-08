"use client";

import { useEffect, useRef } from "react";
import {
  Film,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Smartphone,
  Square,
  Monitor,
  Image as ImageIcon,
  Music,
  Layers,
  VolumeX,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorTextLayer from "./VideoEditorTextLayer";
import VideoEditorSubtitleLayer from "./VideoEditorSubtitleLayer";
import type { VideoEditorClip, VideoEditorMediaItem } from "./VideoEditorContext";

export default function VideoEditorCanvas() {
  const {
    mediaItems,
    clips,
    selectedClipId,
    selectClip,
    currentTime,
    isPlaying,
    canvasRatio,
    canvasZoom,
    setCanvasRatio,
    setCanvasZoom,
  } = useVideoEditor();

  const visibleClips = clips.filter(
    (clip) =>
      currentTime >= clip.startTime &&
      currentTime <= clip.startTime + clip.duration
  );

  const mediaClips = visibleClips.filter(
    (clip) =>
      clip.type === "video" ||
      clip.type === "image" ||
      clip.type === "audio"
  );

  const canvasClass =
    canvasRatio === "16:9"
      ? "aspect-video w-full max-w-[1100px]"
      : canvasRatio === "9:16"
        ? "aspect-[9/16] h-full max-h-[620px]"
        : "aspect-square h-full max-h-[620px]";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#09090d]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#08080c] px-4">
        <div>
          <div className="text-sm font-black text-white">Preview Canvas</div>
          <div className="text-xs text-zinc-500">
            현재 비율: {canvasRatio} · 확대 {canvasZoom}% · 현재 시간{" "}
            {currentTime.toFixed(1)}s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RatioButton
            icon={Monitor}
            label="16:9"
            active={canvasRatio === "16:9"}
            onClick={() => setCanvasRatio("16:9")}
          />
          <RatioButton
            icon={Smartphone}
            label="9:16"
            active={canvasRatio === "9:16"}
            onClick={() => setCanvasRatio("9:16")}
          />
          <RatioButton
            icon={Square}
            label="1:1"
            active={canvasRatio === "1:1"}
            onClick={() => setCanvasRatio("1:1")}
          />

          <div className="mx-2 h-6 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom - 10)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:border-cyan-400"
          >
            <Minus size={15} />
          </button>

          <div className="w-14 text-center text-xs font-bold text-zinc-300">
            {canvasZoom}%
          </div>

          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom + 10)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:border-cyan-400"
          >
            <Plus size={15} />
          </button>

          <button
            type="button"
            onClick={() => setCanvasZoom(75)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:border-cyan-400"
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 text-zinc-300 hover:border-cyan-400"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className={canvasClass}
          style={{
            transform: `scale(${canvasZoom / 100})`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%)] bg-[length:32px_32px] bg-[position:0_0,16px_16px]" />

            {mediaClips.length === 0 ? (
              <EmptyPreview />
            ) : (
              mediaClips.map((clip, index) => {
                const media = clip.mediaId
                  ? mediaItems.find((item) => item.id === clip.mediaId)
                  : null;

                if (!media) return null;

                return (
                  <PreviewMediaLayer
                    key={clip.id}
                    clip={clip}
                    media={media}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    active={selectedClipId === clip.id}
                    zIndex={10 + index}
                    onSelect={() => selectClip(clip.id)}
                  />
                );
              })
            )}

            <VideoEditorTextLayer />
            <VideoEditorSubtitleLayer />

            <div className="pointer-events-none absolute inset-8 rounded-xl border border-dashed border-white/10" />

            <div className="absolute left-4 top-4 z-40 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
              {canvasRatio}
            </div>

            <div className="absolute right-4 top-4 z-40 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1 text-xs text-zinc-400">
              <Layers size={13} />
              활성 레이어 {visibleClips.length}개
            </div>

            <div className="absolute bottom-4 right-4 z-40 max-w-[60%] truncate rounded-lg border border-white/10 bg-black/60 px-3 py-1 text-xs text-zinc-400">
              {visibleClips.length > 0
                ? visibleClips.map((clip) => clip.name).join(" · ")
                : "Stage Area"}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  onSelect,
}: {
  clip: VideoEditorClip;
  media: VideoEditorMediaItem;
  currentTime: number;
  isPlaying: boolean;
  active: boolean;
  zIndex: number;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const trimStart = clip.trimStart ?? 0;
  const localTime = Math.max(0, currentTime - clip.startTime + trimStart);
  const liveTimeRef = useRef(localTime);

  const opacity = getTransitionOpacity(clip, currentTime);

  useEffect(() => {
    liveTimeRef.current = localTime;
  }, [localTime]);

  useEffect(() => {
    const handlePlaybackFrame = (event: Event) => {
      const customEvent = event as CustomEvent<{
        currentTime: number;
        totalDuration: number;
      }>;

      const nextGlobalTime = customEvent.detail.currentTime;
      const nextLocalTime = Math.max(
        0,
        nextGlobalTime - clip.startTime + trimStart
      );

      liveTimeRef.current = nextLocalTime;

      if (media.type === "video") {
        const video = videoRef.current;
        if (!video) return;

        if (Math.abs(video.currentTime - nextLocalTime) > 0.18) {
          video.currentTime = nextLocalTime;
        }
      }

      if (media.type === "audio") {
        const audio = audioRef.current;
        if (!audio) return;

        if (Math.abs(audio.currentTime - nextLocalTime) > 0.18) {
          audio.currentTime = nextLocalTime;
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
  }, [clip.startTime, trimStart, media.type]);

  useEffect(() => {
    if (media.type !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - liveTimeRef.current) > 0.25) {
      video.currentTime = liveTimeRef.current;
    }

    video.muted = clip.muted ?? false;
    video.volume = Math.max(0, Math.min(1, clip.volume ?? 1));

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => { });
    } else {
      video.pause();
    }
  }, [media.type, localTime, isPlaying, clip.muted, clip.volume]);

  useEffect(() => {
    if (media.type !== "audio") return;

    const audio = audioRef.current;
    if (!audio) return;

    if (Math.abs(audio.currentTime - liveTimeRef.current) > 0.25) {
      audio.currentTime = liveTimeRef.current;
    }

    audio.muted = clip.muted ?? false;
    audio.volume = Math.max(0, Math.min(1, clip.volume ?? 1));

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => { });
    } else {
      audio.pause();
    }
  }, [media.type, localTime, isPlaying, clip.muted, clip.volume]);

  const sharedClass = `absolute inset-0 flex items-center justify-center bg-black ${active ? "ring-4 ring-cyan-400/70" : ""
    }`;

  const sharedStyle = {
    zIndex,
    opacity,
    transform: getTransitionTransform(clip, currentTime),
    filter: getTransitionFilter(clip, currentTime),
  };

  if (media.type === "image") {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={sharedClass}
        style={sharedStyle}
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
        style={sharedStyle}
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
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-cyan-950 ${active ? "ring-4 ring-cyan-400/70" : ""
        }`}
      style={sharedStyle}
    >
      <div className="text-center">
        {clip.muted ? (
          <VolumeX size={84} className="mx-auto mb-5 text-red-300" />
        ) : (
          <Music size={84} className="mx-auto mb-5 text-emerald-300" />
        )}

        <div className="text-xl font-black text-white">{media.name}</div>
        <p className="mt-2 text-sm text-emerald-200/70">
          오디오 클립 재생 중 · 볼륨 {Math.round((clip.volume ?? 1) * 100)}%
        </p>
      </div>

      <audio ref={audioRef} src={media.url} />

      <LayerBadge
        icon={Music}
        label="AUDIO"
        tone="emerald"
        name={media.name}
        muted={clip.muted}
      />
    </button>
  );
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
    isIn: Boolean(clip.transitionIn && clip.transitionIn !== "none" && startElapsed < transitionDuration),
    isOut: Boolean(clip.transitionOut && clip.transitionOut !== "none" && endRemaining < transitionDuration),
  };
}

function getTransitionOpacity(clip: VideoEditorClip, currentTime: number) {
  const { inProgress, outProgress, isIn, isOut } = getTransitionProgress(
    clip,
    currentTime
  );

  if (isIn && clip.transitionIn === "fade") return inProgress;
  if (isOut && clip.transitionOut === "fade") return outProgress;

  return 1;
}

function getTransitionTransform(clip: VideoEditorClip, currentTime: number) {
  const { inProgress, outProgress, isIn, isOut } = getTransitionProgress(
    clip,
    currentTime
  );

  if (isIn && clip.transitionIn === "zoom") {
    return `scale(${0.92 + inProgress * 0.08})`;
  }

  if (isOut && clip.transitionOut === "zoom") {
    return `scale(${0.92 + outProgress * 0.08})`;
  }

  if (isIn && clip.transitionIn === "slide") {
    return `translateX(${(1 - inProgress) * 8}%)`;
  }

  if (isOut && clip.transitionOut === "slide") {
    return `translateX(${(1 - outProgress) * -8}%)`;
  }

  return "none";
}

function getTransitionFilter(clip: VideoEditorClip, currentTime: number) {
  const { inProgress, outProgress, isIn, isOut } = getTransitionProgress(
    clip,
    currentTime
  );

  if (isIn && clip.transitionIn === "blur") {
    return `blur(${(1 - inProgress) * 8}px)`;
  }

  if (isOut && clip.transitionOut === "blur") {
    return `blur(${(1 - outProgress) * 8}px)`;
  }

  return "none";
}

function LayerBadge({
  icon: Icon,
  label,
  tone,
  name,
  muted,
}: {
  icon: React.ElementType;
  label: string;
  tone: "cyan" | "violet" | "emerald";
  name: string;
  muted?: boolean;
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan-200"
      : tone === "violet"
        ? "text-violet-200"
        : "text-emerald-200";

  return (
    <div
      className={`absolute left-4 bottom-4 flex max-w-[70%] items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-xs font-bold ${toneClass}`}
    >
      <Icon size={14} />
      <span>{label}</span>
      {muted && <VolumeX size={13} className="text-red-300" />}
      <span className="truncate text-white/60">{name}</span>
    </div>
  );
}

function RatioButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 text-zinc-400 hover:border-cyan-400/50"
        }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}