"use client";

import React, { useRef } from "react";
import {
  Waves,
  Palette,
  Move,
  Film,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { useVideoEditor, saveFileToCache, deleteFileFromCache } from "./VideoEditorContext";

const blendModeOptions = [
  { label: "Screen (스크린)", value: "screen" },
  { label: "Overlay (오버레이)", value: "overlay" },
  { label: "Soft Light (소프트 라이트)", value: "soft-light" },
  { label: "Lighten (밝게)", value: "lighten" },
  { label: "Normal (보통)", value: "normal" },
  { label: "Multiply (곱하기)", value: "multiply" },
  { label: "Darken (어둡게)", value: "darken" },
];

export default function VideoEditorVisualizerInspector() {
  const { clips, selectedClipId, updateClip, tracks, currentTime } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip || selectedClip.type !== "visualizer") {
    return (
      <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
        선택된 비주얼라이저 클립이 없습니다.
      </div>
    );
  }

  const anyClip = selectedClip as any;

  // Visualizer settings
  const template = anyClip.visualizerTemplate || "circle";
  const accentColor = anyClip.visualizerAccentColor || "#ff4fd8";
  const backgroundColor = anyClip.visualizerBackgroundColor || "#050507";
  const spectrumY = anyClip.visualizerY ?? 50;
  const spectrumHeight = anyClip.visualizerHeight ?? 58;
  const spectrumWidth = anyClip.visualizerWidth ?? 92;

  // Video overlay settings
  const videoOpacity = anyClip.visualizerVideoOpacity ?? 65;
  const videoBlendMode = anyClip.visualizerVideoBlendMode || "screen";

  // Sourcing automatically from the topmost active Video Track clip
  const videoTracks = tracks.filter((t) => t.type === "video");

  const activeOverlayClip = videoTracks
    .map((track) =>
      clips.find(
        (c) =>
          c.trackId === track.id &&
          currentTime >= c.startTime &&
          currentTime <= c.startTime + c.duration
      )
    )
    .find((clip) => clip !== undefined) || null;

  const overlayClipName = activeOverlayClip?.name || "";

  const handleResetStyle = () => {
    updateClip(selectedClip.id, {
      visualizerAccentColor: "#ff4fd8",
      visualizerBackgroundColor: "#050507",
      visualizerY: 50,
      visualizerHeight: 58,
      visualizerWidth: 92,
    } as any);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="mb-4 rounded-md border border-pink-400/20 bg-pink-400/10 p-3">
        <div className="truncate text-sm font-black text-pink-100 flex items-center gap-1.5">
          <Waves size={16} className="text-pink-300 animate-pulse" />
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-pink-200/70">
          템플릿: {template.toUpperCase()} · Y {spectrumY}% · 크기 {spectrumHeight}%
        </div>
      </div>

      {/* 1. Style Adjustments */}
      <div className="rounded-md border border-white/10 bg-black/20 p-3 space-y-3">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between items-center">
          <span>스펙트럼 스타일 설정</span>
          <button
            type="button"
            onClick={handleResetStyle}
            className="flex items-center gap-0.5 text-zinc-400 hover:text-pink-300 transition"
            title="기본값 초기화"
          >
            <RotateCcw size={11} />
            초기화
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Accent 색상"
            value={accentColor}
            onChange={(val) => updateClip(selectedClip.id, { visualizerAccentColor: val } as any)}
          />
          <ColorField
            label="배경 색상"
            value={backgroundColor}
            onChange={(val) => updateClip(selectedClip.id, { visualizerBackgroundColor: val } as any)}
          />
        </div>

        <RangeField
          label="세로 위치"
          value={spectrumY}
          min={0}
          max={100}
          step={1}
          display={`${spectrumY}%`}
          onChange={(val) => updateClip(selectedClip.id, { visualizerY: val } as any)}
        />
        <RangeField
          label="세로 크기"
          value={spectrumHeight}
          min={5}
          max={100}
          step={1}
          display={`${spectrumHeight}%`}
          onChange={(val) => updateClip(selectedClip.id, { visualizerHeight: val } as any)}
        />
        <RangeField
          label="가로 폭"
          value={spectrumWidth}
          min={20}
          max={100}
          step={1}
          display={`${spectrumWidth}%`}
          onChange={(val) => updateClip(selectedClip.id, { visualizerWidth: val } as any)}
        />
      </div>

      {/* 2. Video Overlay Section (Automatic Track Linking) */}
      <div className="rounded-md border border-white/10 bg-black/20 p-3 space-y-3">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          영상 오버레이 (Timeline Track Overlay)
        </div>

        <div className="rounded-md border border-white/5 bg-black/30 p-2.5 text-xs">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
            자동 연결된 트랙 비디오
          </div>
          {overlayClipName ? (
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold min-w-0">
              <Film size={13} className="shrink-0 animate-pulse" />
              <span className="truncate text-zinc-200">{overlayClipName}</span>
            </div>
          ) : (
            <div className="text-zinc-500 italic">상위 비디오 트랙에 현재 재생할 비디오/이미지가 없습니다.</div>
          )}
        </div>

        <RangeField
          label="투명도"
          value={videoOpacity}
          min={0}
          max={100}
          step={1}
          display={`${videoOpacity}%`}
          onChange={(val) => updateClip(selectedClip.id, { visualizerVideoOpacity: val } as any)}
        />

        <SelectField
          label="합성 모드 (Blend Mode)"
          value={videoBlendMode}
          options={blendModeOptions}
          onChange={(val) => updateClip(selectedClip.id, { visualizerVideoBlendMode: val } as any)}
        />
      </div>

      <div className="rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] leading-5 text-amber-100">
        설정한 오디오 비주얼라이저의 스타일(색상, 위치, 크기)과 영상 백그라운드 오버레이 효과는 타임라인 미리보기 재생기 화면에 실시간으로 합성되어 렌더링됩니다.
      </div>
    </div>
  );
}

// Local helper UI fields matching FCP theme
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <label className="flex h-11 items-center justify-between rounded-md border border-white/10 bg-black/30 px-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 cursor-pointer rounded border-none bg-transparent"
      />
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
  onChange: (val: number) => void;
}) {
  return (
    <label className="block rounded-md border border-white/10 bg-black/30 p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
        <span>{label}</span>
        <span className="text-pink-300 font-bold">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-pink-400"
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
  onChange: (val: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-pink-400"
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
      className={`flex h-10 items-center justify-center gap-2 rounded-md border text-xs font-black ${
        active
          ? "border-pink-400 bg-pink-400/20 text-pink-200"
          : "border-white/10 bg-black/30 text-zinc-400 hover:border-pink-400/40"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
