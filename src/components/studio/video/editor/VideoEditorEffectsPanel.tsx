"use client";

import {
  Sparkles,
  SlidersHorizontal,
  Eye,
  Contrast,
  Sun,
  Droplets,
  Palette,
  CircleDot,
  Wand2,
  RotateCcw,
  Zap,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import type { VideoBlendMode } from "./VideoEditorContext";

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

export default function VideoEditorEffectsPanel() {
  const { clips, selectedClipId, updateClip } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip) {
    return (
      <div>
        <PanelHeader
          icon={Sparkles}
          title="효과"
          desc="타임라인에서 클립을 선택하면 필터와 스타일 효과를 적용할 수 있습니다."
        />

        <div className="rounded-2xl border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
          선택된 클립이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PanelHeader
        icon={Sparkles}
        title="효과"
        desc="블러, 흑백, 세피아, 네온, 글로우 효과를 적용합니다."
      />

      <div className="mb-4 rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-3">
        <div className="truncate text-sm font-black text-fuchsia-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-fuchsia-200/70">
          Blur {selectedClip.blur ?? 0}px · Saturation{" "}
          {Math.round((selectedClip.saturation ?? 1) * 100)}%
        </div>
      </div>

      <div className="space-y-4">
        <EffectSection title="기본 보정">
          <RangeField
            icon={Sun}
            label="Brightness"
            value={selectedClip.brightness ?? 1}
            min={0}
            max={3}
            step={0.05}
            display={`${Math.round((selectedClip.brightness ?? 1) * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { brightness: value })}
          />

          <RangeField
            icon={Contrast}
            label="Contrast"
            value={selectedClip.contrast ?? 1}
            min={0}
            max={3}
            step={0.05}
            display={`${Math.round((selectedClip.contrast ?? 1) * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { contrast: value })}
          />

          <RangeField
            icon={Palette}
            label="Saturation"
            value={selectedClip.saturation ?? 1}
            min={0}
            max={3}
            step={0.05}
            display={`${Math.round((selectedClip.saturation ?? 1) * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { saturation: value })}
          />
        </EffectSection>

        <EffectSection title="스타일 필터">
          <RangeField
            icon={Droplets}
            label="Blur"
            value={selectedClip.blur ?? 0}
            min={0}
            max={30}
            step={0.5}
            display={`${selectedClip.blur ?? 0}px`}
            onChange={(value) => updateClip(selectedClip.id, { blur: value })}
          />

          <RangeField
            icon={Eye}
            label="Grayscale"
            value={selectedClip.grayscale ?? 0}
            min={0}
            max={1}
            step={0.05}
            display={`${Math.round((selectedClip.grayscale ?? 0) * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { grayscale: value })}
          />

          <RangeField
            icon={CircleDot}
            label="Sepia"
            value={selectedClip.sepia ?? 0}
            min={0}
            max={1}
            step={0.05}
            display={`${Math.round((selectedClip.sepia ?? 0) * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { sepia: value })}
          />

          <SelectField
            label="Blend Mode"
            value={selectedClip.blendMode ?? "normal"}
            options={blendModeOptions}
            onChange={(value) =>
              updateClip(selectedClip.id, {
                blendMode: value as VideoBlendMode,
              })
            }
          />
        </EffectSection>

        <EffectSection title="프리셋">
          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Eye}
              label="흑백"
              desc="Grayscale 100%"
              onClick={() =>
                updateClip(selectedClip.id, {
                  grayscale: 1,
                  sepia: 0,
                  saturation: 0,
                  contrast: 1.15,
                })
              }
            />

            <PresetButton
              icon={CircleDot}
              label="세피아"
              desc="따뜻한 필름톤"
              onClick={() =>
                updateClip(selectedClip.id, {
                  sepia: 1,
                  grayscale: 0,
                  saturation: 0.85,
                  contrast: 1.05,
                  brightness: 1.05,
                })
              }
            />

            <PresetButton
              icon={Zap}
              label="네온"
              desc="강한 색감"
              onClick={() =>
                updateClip(selectedClip.id, {
                  brightness: 1.15,
                  contrast: 1.35,
                  saturation: 1.8,
                  blur: 0,
                  blendMode: "screen",
                })
              }
            />

            <PresetButton
              icon={Sparkles}
              label="글로우"
              desc="밝고 부드럽게"
              onClick={() =>
                updateClip(selectedClip.id, {
                  brightness: 1.25,
                  contrast: 0.95,
                  saturation: 1.25,
                  blur: 1.5,
                  blendMode: "soft-light",
                })
              }
            />

            <PresetButton
              icon={Wand2}
              label="시네마틱"
              desc="대비 + 색감"
              onClick={() =>
                updateClip(selectedClip.id, {
                  brightness: 0.95,
                  contrast: 1.35,
                  saturation: 1.2,
                  sepia: 0.12,
                  grayscale: 0,
                })
              }
            />

            <PresetButton
              icon={RotateCcw}
              label="초기화"
              desc="모든 효과 원복"
              onClick={() =>
                updateClip(selectedClip.id, {
                  brightness: 1,
                  contrast: 1,
                  saturation: 1,
                  blur: 0,
                  grayscale: 0,
                  sepia: 0,
                  blendMode: "normal",
                })
              }
            />
          </div>
        </EffectSection>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          현재 효과는 PreviewPlayer에 연결되어 있어서 선택 즉시 프리뷰에 반영됩니다.
          렌더 출력에도 반영하려면 다음 단계에서 RenderCanvas에도 같은 필터 로직을 붙이면 됩니다.
        </div>
      </div>
    </div>
  );
}

function EffectSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RangeField({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
        <span className="flex items-center gap-2">
          <Icon size={13} />
          {label}
        </span>
        <span className="text-fuchsia-200">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-fuchsia-300"
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
        className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-fuchsia-400"
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

function PresetButton({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-black/30 p-3 text-left hover:border-fuchsia-400/50"
    >
      <div className="flex items-center gap-2 text-xs font-black text-white">
        <Icon size={13} />
        {label}
      </div>
      <div className="mt-1 text-[10px] leading-4 text-zinc-500">{desc}</div>
    </button>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}