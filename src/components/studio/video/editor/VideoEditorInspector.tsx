"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Film,
  Image as ImageIcon,
  Music,
  Trash2,
  Type,
  Captions,
  Sparkles,
  Copy,
  Split,
  Volume2,
  VolumeX,
  Wand2,
  Move,
  Palette,
  SlidersHorizontal,
  RotateCw,
  Maximize2,
  Eye,
  Gauge,
  RotateCcw,
} from "lucide-react";

import {
  EXPORT_FPS_OPTIONS,
  EXPORT_QUALITY_OPTIONS,
  EXPORT_RESOLUTION_OPTIONS,
} from "./constants";
import { useVideoEditor } from "./VideoEditorContext";
import type { ExportFps, ExportQuality, ExportResolution } from "./types";
import type {
  VideoBlendMode,
  VideoTransitionType,
} from "./VideoEditorContext";
import VideoEditorAudioMixer from "./VideoEditorAudioMixer";
import VideoEditorEffectsPanel from "./VideoEditorEffectsPanel";
import VideoEditorMotionPanel from "./VideoEditorMotionPanel";
import VideoEditorTransitionPanel from "./VideoEditorTransitionPanel";
import VideoEditorTextStylePanel from "./VideoEditorTextStylePanel";
import VideoEditorVisualizerInspector from "./VideoEditorVisualizerInspector";

const transitionOptions: { label: string; value: VideoTransitionType }[] = [
  { label: "없음", value: "none" },
  { label: "Fade", value: "fade" },
  { label: "Zoom", value: "zoom" },
  { label: "Slide", value: "slide" },
  { label: "Blur", value: "blur" },
  { label: "Wipe", value: "wipe" },
  { label: "Push", value: "push" },
  { label: "Spin", value: "spin" },
  { label: "Glitch", value: "glitch" },
  { label: "Flash", value: "flash" },
  { label: "Dip Black", value: "dip-to-black" },
  { label: "Cross Zoom", value: "cross-zoom" },
];

const blendModeOptions: { label: string; value: VideoBlendMode }[] = [
  { label: "Normal", value: "normal" },
  { label: "Screen", value: "screen" },
  { label: "Overlay", value: "overlay" },
  { label: "Multiply", value: "multiply" },
  { label: "Lighten", value: "lighten" },
  { label: "Darken", value: "darken" },
  { label: "Soft Light", value: "soft-light" },
  { label: "Hard Light", value: "hard-light" },
  { label: "Difference", value: "difference" },
];

type InspectorTab =
  | "clip"
  | "video"
  | "audio"
  | "text"
  | "visualizer"
  | "effects"
  | "transition"
  | "export";

export default function VideoEditorInspector({
  onOpenExport,
}: {
  onOpenExport: () => void;
}) {
  const {
    mediaItems,
    clips,
    selectedClipId,
    removeClip,
    duplicateClip,
    splitClip,
    updateClip,
    updateClipName,
    updateClipTime,
    updateClipTrimStart,
    updateClipTrimEnd,
    updateClipVolume,
    toggleClipMute,
    updateClipTextStyle,
    updateClipTransition,
    exportResolution,
    exportFps,
    exportQuality,
    setExportResolution,
    setExportFps,
    setExportQuality,
    currentTime,
    totalDuration,
    reverseVideoClip,
    detectScenesAndSplitClip,
  } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  const handleRotate = () => {
    if (!selectedClipId) return;
    const nextRotation = ((selectedClip?.rotation || 0) + 90) % 360;
    updateClip(selectedClipId, { rotation: nextRotation });
  };

  const handleSpeedChange = () => {
    if (!selectedClipId) return;
    const nextDuration = Math.max(0.5, (selectedClip?.duration || 5) / 2);
    updateClip(selectedClipId, {
      duration: nextDuration,
      name: `${(selectedClip?.name || "").replace(" (2.0x)", "")} (2.0x)`,
    });
  };
  const selectedMedia = selectedClip?.mediaId
    ? mediaItems.find((item) => item.id === selectedClip.mediaId) || null
    : null;

  const textStyle = selectedClip?.textStyle;

  const [activeTab, setActiveTab] = useState<InspectorTab>("clip");

  useEffect(() => {
    if (selectedClip) {
      if (selectedClip.type === "text" || selectedClip.type === "subtitle") {
        setActiveTab("text");
      } else if (selectedClip.type === "video" || selectedClip.type === "image") {
        setActiveTab("video");
      } else if (selectedClip.type === "audio") {
        setActiveTab("audio");
      } else if (selectedClip.type === "visualizer") {
        setActiveTab("visualizer");
      }
    }
  }, [selectedClipId, selectedClip?.type]);

  const visibleActiveTab: InspectorTab = activeTab;

  return (
    <aside className="flex h-full w-full flex-col bg-transparent">
      {/* Tab Selector Header */}
      <div className="flex h-12 shrink-0 border-b border-white/5 bg-[#202026] overflow-x-auto scrollbar-none items-center px-1">
        <TabButton
          label="클립"
          active={visibleActiveTab === "clip"}
          onClick={() => setActiveTab("clip")}
        />
        <TabButton
          label="비디오"
          active={visibleActiveTab === "video"}
          onClick={() => setActiveTab("video")}
        />
        <TabButton
          label="오디오"
          active={visibleActiveTab === "audio"}
          onClick={() => setActiveTab("audio")}
        />
        <TabButton
          label="비주얼라이저"
          active={visibleActiveTab === "visualizer"}
          onClick={() => setActiveTab("visualizer")}
        />
        <TabButton
          label="텍스트"
          active={visibleActiveTab === "text"}
          onClick={() => setActiveTab("text")}
        />
        <TabButton
          label="효과"
          active={visibleActiveTab === "effects"}
          onClick={() => setActiveTab("effects")}
        />
        <TabButton
          label="전환"
          active={visibleActiveTab === "transition"}
          onClick={() => setActiveTab("transition")}
        />
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {visibleActiveTab === "clip" && (
          <>
            <InspectorCard title="선택된 클립">
              {selectedClip ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ClipIcon type={selectedClip.type} />

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-black text-white">
                        {selectedClip.name}
                      </div>
                      <div className="mt-1 text-xs uppercase text-zinc-500">
                        {selectedClip.type} · {selectedMedia?.name || "Custom Layer"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeClip(selectedClip.id)}
                      className="rounded-md border border-white/10 p-2 text-zinc-500 hover:border-red-400 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <label className="block">
                    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                      클립 이름 / 표시 문구
                    </div>
                    <input
                      value={selectedClip.name}
                      onChange={(event) =>
                        updateClipName(selectedClip.id, event.target.value)
                      }
                      className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      label="시작 시간"
                      value={selectedClip.startTime}
                      suffix="s"
                      min={0}
                      step={0.1}
                      onChange={(value) =>
                        updateClipTime(selectedClip.id, value, selectedClip.duration)
                      }
                    />

                    <NumberField
                      label="길이"
                      value={selectedClip.duration}
                      suffix="s"
                      min={0.5}
                      step={0.1}
                      onChange={(value) =>
                        updateClipTime(selectedClip.id, selectedClip.startTime, value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <InfoBox label="Left" value={`${selectedClip.left.toFixed(1)}%`} />
                    <InfoBox label="Width" value={`${selectedClip.width.toFixed(1)}%`} />
                    <InfoBox
                      label="끝 시간"
                      value={`${(selectedClip.startTime + selectedClip.duration).toFixed(1)}s`}
                    />
                    <InfoBox label="Track" value={selectedClip.trackId} />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <ActionButton
                      icon={Copy}
                      label="복제"
                      onClick={() => duplicateClip(selectedClip.id)}
                    />
                    <ActionButton
                      icon={Split}
                      label="분할"
                      onClick={() => splitClip(selectedClip.id)}
                    />
                    <ActionButton
                      icon={Trash2}
                      label="삭제"
                      danger
                      onClick={() => removeClip(selectedClip.id)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <ActionButton
                      icon={RotateCcw}
                      label="역재생"
                      disabled={!(selectedClip.type === "video" || selectedClip.type === "audio")}
                      onClick={() => void reverseVideoClip(selectedClip.id)}
                    />
                    <ActionButton
                      icon={Wand2}
                      label="장면 분할"
                      disabled={selectedClip.type !== "video"}
                      onClick={() => void detectScenesAndSplitClip(selectedClip.id)}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
                  타임라인에서 클립을 선택하면 상세 정보가 표시됩니다.
                </div>
              )}
            </InspectorCard>

            {selectedClip && (
              <InspectorCard title="Trim / Timing">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      label="앞 Trim"
                      value={selectedClip.trimStart ?? 0}
                      suffix="s"
                      min={0}
                      step={0.1}
                      onChange={(value) => updateClipTrimStart(selectedClip.id, value)}
                    />
                    <NumberField
                      label="뒤 Trim"
                      value={selectedClip.trimEnd ?? 0}
                      suffix="s"
                      min={0}
                      step={0.1}
                      onChange={(value) => updateClipTrimEnd(selectedClip.id, value)}
                    />
                  </div>

                  <p className="text-xs leading-5 text-zinc-500">
                    Trim 값은 렌더링 시 원본 미디어의 앞/뒤를 잘라 쓰기 위한 준비값입니다.
                  </p>
                </div>
              </InspectorCard>
            )}
          </>
        )}

        {visibleActiveTab === "video" && (
          selectedClip && (selectedClip.type === "video" || selectedClip.type === "image") ? (
            <VideoEditorMotionPanel />
          ) : (
            <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
              비디오 또는 이미지 클립을 선택하면 상세 비디오 조절기가 표시됩니다.
            </div>
          )
        )}

        {visibleActiveTab === "audio" && (
          <VideoEditorAudioMixer />
        )}

        {visibleActiveTab === "text" && (
          <VideoEditorTextStylePanel />
        )}

        {visibleActiveTab === "visualizer" && (
          <VideoEditorVisualizerInspector />
        )}

        {visibleActiveTab === "effects" && (
          <VideoEditorEffectsPanel />
        )}

        {visibleActiveTab === "transition" && (
          <VideoEditorTransitionPanel />
        )}


      </div>

      <div className="flex h-8 shrink-0 items-center justify-between border-t border-white/5 bg-[#151519] px-3 text-[10px] font-bold text-zinc-500">
        <span>{visibleActiveTab.toUpperCase()}</span>
        <span>{selectedClip ? selectedClip.type : "NO CLIP"}</span>
        <span>
          {currentTime.toFixed(1)}s / {totalDuration}s
        </span>
      </div>
    </aside>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 shrink-0 text-xs font-black transition border-b-2 h-full flex items-center justify-center outline-none ${
        active
          ? "border-cyan-400 text-white bg-transparent"
          : "border-transparent text-zinc-500 hover:text-zinc-300 bg-transparent"
      }`}
    >
      {label}
    </button>
  );
}

function InspectorCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <div className="mb-3 text-sm font-black uppercase tracking-wider text-zinc-400">
        {title}
      </div>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  suffix,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </div>

      <div className="flex h-11 items-center rounded-md border border-white/10 bg-black/40 px-3 focus-within:border-cyan-400">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            if (Number.isNaN(nextValue)) return;
            onChange(nextValue);
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none"
        />

        {suffix && (
          <span className="ml-2 text-xs font-bold text-zinc-500">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-md border border-white/10 bg-black/30 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
        <span>{label}</span>
        <span className="text-cyan-200">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-11 items-center justify-between rounded-md border border-white/10 bg-black/30 px-3">
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 w-10 cursor-pointer rounded border-none bg-transparent"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResetButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-10 items-center justify-center gap-1 rounded-md border border-white/10 bg-black/30 px-2 py-2 text-[10px] font-black text-zinc-400 hover:border-cyan-400/50 hover:text-cyan-200"
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function ToggleButton({
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
      className={`flex h-10 items-center justify-center gap-2 rounded-md border text-xs font-black ${active
          ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
          : "border-white/10 bg-black/30 text-zinc-400 hover:border-cyan-400/40"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function ActionButton({
  icon: Icon,
  label,
  danger,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 items-center justify-center gap-2 rounded-md border text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-30 ${danger
          ? "border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          : "border-white/10 bg-black/30 text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function MiniFeature({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-black/30 text-xs font-bold text-zinc-500">
      <Icon size={14} />
      {label}
    </div>
  );
}

function OptionButton({
  label,
  desc,
  active,
  onClick,
}: {
  label: string;
  desc?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-3 text-left text-sm transition ${active
          ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
          : "border-white/10 bg-black/20 text-zinc-400 hover:border-cyan-400/50"
        }`}
    >
      <div className="font-black">{label}</div>
      {desc && <div className="mt-1 text-xs opacity-70">{desc}</div>}
    </button>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div className="mt-1 truncate font-black text-zinc-200">{value}</div>
    </div>
  );
}

function ClipIcon({ type }: { type: string }) {
  const className = "mt-1 shrink-0";

  if (type === "video") return <Film className={className} size={20} />;
  if (type === "image") return <ImageIcon className={className} size={20} />;
  if (type === "audio") return <Music className={className} size={20} />;
  if (type === "text") return <Type className={className} size={20} />;
  if (type === "subtitle") return <Captions className={className} size={20} />;
  return <Sparkles className={className} size={20} />;
}

function toColorInputValue(value: string) {
  if (value.startsWith("#")) return value;
  return "#000000";
}
