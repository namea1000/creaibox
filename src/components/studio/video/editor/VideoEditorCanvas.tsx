"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Smartphone,
  Square,
  Monitor,
  Download,
} from "lucide-react";

import { useVideoEditor, type CanvasRatio } from "./VideoEditorContext";
import VideoEditorPreviewPlayer from "./VideoEditorPreviewPlayer";

const ASPECT_RATIO_OPTIONS: Array<{
  label: CanvasRatio;
  name: string;
  value: CanvasRatio;
}> = [
  { label: "16:9", name: "Widescreen", value: "16:9" },
  { label: "9:16", name: "Vertical", value: "9:16" },
  { label: "1:1", name: "Square", value: "1:1" },
  { label: "4:5", name: "Social Portrait", value: "4:5" },
  { label: "5:4", name: "Social Landscape", value: "5:4" },
  { label: "21:9", name: "Cinema", value: "21:9" },
  { label: "4:3", name: "Classic", value: "4:3" },
];

export default function VideoEditorCanvas({
  onOpenExport,
}: {
  onOpenExport?: () => void;
} = {}) {
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const ratioMenuRef = useRef<HTMLDivElement | null>(null);
  const [isRatioMenuOpen, setIsRatioMenuOpen] = useState(false);
  const [audioMeter, setAudioMeter] = useState({ low: 0, mid: 0, high: 0 });
  const {
    currentTime,
    totalDuration,
    isPlaying,
    canvasRatio,
    canvasZoom,
    setCanvasRatio,
    setCanvasZoom,
    togglePlayback,
    projectTitle,
    setProjectTitle,
  } = useVideoEditor();

  const canvasClass =
    canvasRatio === "16:9"
      ? "aspect-video w-full max-w-[1100px]"
      : canvasRatio === "9:16"
        ? "aspect-[9/16] h-full max-h-[620px]"
        : canvasRatio === "4:5"
          ? "aspect-[4/5] h-full max-h-[620px]"
          : canvasRatio === "5:4"
            ? "aspect-[5/4] w-full max-w-[900px]"
            : canvasRatio === "21:9"
              ? "aspect-[21/9] w-full max-w-[1180px]"
              : canvasRatio === "4:3"
                ? "aspect-[4/3] w-full max-w-[920px]"
                : "aspect-square h-full max-h-[620px]";

  const handleToggleFullscreen = () => {
    const target = previewFrameRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void target.requestFullscreen?.();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const handleAudioMeter = (event: Event) => {
      const customEvent = event as CustomEvent<{
        low: number;
        mid: number;
        high: number;
      }>;
      setAudioMeter({
        low: customEvent.detail.low,
        mid: customEvent.detail.mid,
        high: customEvent.detail.high,
      });
    };

    window.addEventListener("creaibox-video-editor-audio-meter", handleAudioMeter);
    return () => {
      window.removeEventListener("creaibox-video-editor-audio-meter", handleAudioMeter);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isRatioMenuOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (ratioMenuRef.current && !ratioMenuRef.current.contains(event.target as Node)) {
        setIsRatioMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRatioMenuOpen]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-transparent">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#202026] px-4 select-none">
        <div className="flex items-center gap-3">
          <input
            value={projectTitle}
            onChange={(event) => setProjectTitle(event.target.value)}
            className="h-8 w-[140px] rounded-md border border-transparent bg-transparent py-1 px-1.5 text-xs font-bold text-white outline-none focus:bg-white/5 focus:border-white/10"
            placeholder="프로젝트 이름"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={ratioMenuRef}>
            <button
              type="button"
              onClick={() => setIsRatioMenuOpen((value) => !value)}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/20 px-2.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-cyan-400 hover:text-cyan-100"
            >
              가로세로 비율
              <ChevronDown size={13} />
            </button>

            {isRatioMenuOpen && (
              <div className="absolute right-0 top-9 z-50 w-44 border border-white/10 bg-[#17171b] py-1 shadow-2xl">
                {ASPECT_RATIO_OPTIONS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCanvasRatio(item.value);
                      setIsRatioMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-white/5 ${
                      canvasRatio === item.value ? "text-cyan-200" : "text-zinc-400"
                    }`}
                  >
                    <span className="font-black">{item.label}</span>
                    <span className="text-[10px] text-zinc-600">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 rounded-md bg-cyan-400 hover:bg-cyan-300 px-3 py-1.5 text-xs font-black text-black ml-2 shadow-[0_0_10px_rgba(34,211,238,0.25)] transition outline-none"
            >
              <Download size={13} className="shrink-0" />
              내보내기
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className={canvasClass}
          style={{
            transform: `scale(${canvasZoom / 100})`,
          }}
        >
          <div
            ref={previewFrameRef}
            className="relative h-full w-full overflow-hidden rounded-none border border-white/10 bg-black shadow-2xl"
          >
            <VideoEditorPreviewPlayer />

            <div className="pointer-events-none absolute inset-8 rounded-none border border-dashed border-white/10" />
          </div>
        </div>
      </div>

      <div className="relative h-9 shrink-0 border-t border-white/5 bg-[#151519] px-3 text-[10px] text-zinc-500">
        <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 font-mono text-cyan-300">
          <span>{formatTimecode(currentTime)}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">{formatTimecode(totalDuration)}</span>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md text-zinc-200 hover:bg-white/10 hover:text-cyan-200"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="pointer-events-none absolute left-[calc(50%+34px)] top-1/2 flex -translate-y-1/2 items-center justify-center">
          <AudioLevelMeter
            low={isPlaying ? audioMeter.low : 0}
            mid={isPlaying ? audioMeter.mid : 0}
            high={isPlaying ? audioMeter.high : 0}
          />
        </div>

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom - 10)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Minus size={13} />
          </button>
          <span className="w-10 text-center text-xs font-bold text-zinc-300">{canvasZoom}%</span>
          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom + 10)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            onClick={() => setCanvasZoom(100)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AudioLevelMeter({
  low,
  mid,
  high,
}: {
  low: number;
  mid: number;
  high: number;
}) {
  return (
    <div className="flex h-7 items-end gap-1.5 rounded-md px-2">
      <MeterBar value={low} className="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" />
      <MeterBar value={mid} className="bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.85)]" />
      <MeterBar value={high} className="bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.85)]" />
    </div>
  );
}

function MeterBar({ value, className }: { value: number; className: string }) {
  const height = Math.max(1, Math.min(26, 1 + value * 27));

  return (
    <span
      className={`w-1 rounded-full transition-[height] duration-75 ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}

function formatTimecode(value: number) {
  const fps = 30;
  const safeValue = Math.max(0, value);
  const hours = Math.floor(safeValue / 3600);
  const minutes = Math.floor((safeValue % 3600) / 60);
  const seconds = Math.floor(safeValue % 60);
  const frames = Math.floor((safeValue % 1) * fps);

  return [hours, minutes, seconds, frames]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
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
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition outline-none ${active
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-300"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}