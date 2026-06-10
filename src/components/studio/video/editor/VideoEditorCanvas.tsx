"use client";

import {
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  Smartphone,
  Square,
  Monitor,
  Layers,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorPreviewPlayer from "./VideoEditorPreviewPlayer";

export default function VideoEditorCanvas() {
  const {
    clips,
    currentTime,
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
            <VideoEditorPreviewPlayer />

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