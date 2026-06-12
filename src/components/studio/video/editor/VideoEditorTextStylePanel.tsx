"use client";

import {
  Type,
  Palette,
  Sparkles,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eye,
  Move,
  Wand2,
  RotateCcw,
  Zap,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

const fontPresets = [
  { label: "Sans", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Pretendard", value: "Pretendard, sans-serif" },
];

const animationPresets = [
  { label: "없음", value: "none" },
  { label: "Fade In", value: "fade-in" },
  { label: "Pop", value: "pop" },
  { label: "Slide Up", value: "slide-up" },
  { label: "Glow", value: "glow" },
  { label: "Bounce", value: "bounce" },
];

export default function VideoEditorTextStylePanel() {
  const { clips, selectedClipId, updateClipTextStyle, updateClip, addTextClip, addSubtitleClip } =
    useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip || (selectedClip.type !== "text" && selectedClip.type !== "subtitle")) {
    return (
      <div>
        <PanelHeader
          icon={Type}
          title="텍스트 스타일"
          desc="텍스트 또는 자막 클립을 선택하면 폰트, 색상, 그림자, 애니메이션을 설정할 수 있습니다."
        />

        <div className="rounded-none border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500 space-y-4">
          <div>선택된 텍스트/자막 클립이 없습니다. 아래 버튼을 눌러 추가하세요.</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={addTextClip}
              className="rounded-none border border-fuchsia-400 bg-fuchsia-400/10 px-3 py-2 text-xs font-black text-fuchsia-200 hover:bg-fuchsia-400/20"
            >
              텍스트 추가
            </button>
            <button
              onClick={addSubtitleClip}
              className="rounded-none border border-amber-400 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-200 hover:bg-amber-400/20"
            >
              자막 추가
            </button>
          </div>
        </div>
      </div>
    );
  }

  const style = selectedClip.textStyle ?? {
    fontSize: selectedClip.type === "subtitle" ? 30 : 42,
    color: "#ffffff",
    backgroundColor:
      selectedClip.type === "subtitle"
        ? "rgba(0,0,0,0.72)"
        : "rgba(0,0,0,0.45)",
    x: 50,
    y: selectedClip.type === "subtitle" ? 82 : 50,
    bold: true,
    shadow: true,
  };

  return (
    <div>
      <PanelHeader
        icon={Type}
        title="텍스트 스타일"
        desc="폰트, 크기, 색상, 그림자, 위치, 애니메이션을 설정합니다."
      />

      <div className="mb-4 rounded-none border border-fuchsia-400/20 bg-fuchsia-400/10 p-3">
        <div className="truncate text-sm font-black text-fuchsia-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-fuchsia-200/70">
          {selectedClip.type.toUpperCase()} · {style.fontSize}px · X {style.x}% / Y {style.y}%
        </div>
      </div>

      <div className="space-y-4">
        <TextSection title="폰트">
          <SelectField
            label="Font Family"
            value={selectedClip.fontFamily ?? "sans-serif"}
            options={fontPresets}
            onChange={(value) => updateClip(selectedClip.id, { fontFamily: value })}
          />

          <RangeField
            icon={Type}
            label="글자 크기"
            value={style.fontSize}
            min={12}
            max={120}
            step={1}
            display={`${style.fontSize}px`}
            onChange={(value) =>
              updateClipTextStyle(selectedClip.id, { fontSize: value })
            }
          />

          <div className="grid grid-cols-3 gap-2">
            <ToggleButton
              icon={AlignLeft}
              label="Left"
              active={selectedClip.textAlign === "left"}
              onClick={() => updateClip(selectedClip.id, { textAlign: "left" })}
            />
            <ToggleButton
              icon={AlignCenter}
              label="Center"
              active={!selectedClip.textAlign || selectedClip.textAlign === "center"}
              onClick={() => updateClip(selectedClip.id, { textAlign: "center" })}
            />
            <ToggleButton
              icon={AlignRight}
              label="Right"
              active={selectedClip.textAlign === "right"}
              onClick={() => updateClip(selectedClip.id, { textAlign: "right" })}
            />
          </div>

          <ToggleButton
            icon={Bold}
            label="Bold"
            active={style.bold}
            onClick={() =>
              updateClipTextStyle(selectedClip.id, { bold: !style.bold })
            }
          />
        </TextSection>

        <TextSection title="색상">
          <div className="grid grid-cols-2 gap-3">
            <ColorField
              label="글자색"
              value={toColorInputValue(style.color)}
              onChange={(value) =>
                updateClipTextStyle(selectedClip.id, { color: value })
              }
            />

            <ColorField
              label="배경색"
              value={toColorInputValue(style.backgroundColor)}
              onChange={(value) =>
                updateClipTextStyle(selectedClip.id, { backgroundColor: value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Palette}
              label="화이트"
              desc="기본 흰색"
              onClick={() =>
                updateClipTextStyle(selectedClip.id, {
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.45)",
                })
              }
            />

            <PresetButton
              icon={Sparkles}
              label="네온"
              desc="핑크/시안"
              onClick={() => {
                updateClipTextStyle(selectedClip.id, {
                  color: "#67e8f9",
                  backgroundColor: "rgba(236,72,153,0.22)",
                  shadow: true,
                });
                updateClip(selectedClip.id, {
                  textGlow: true,
                  textAnimation: "glow",
                });
              }}
            />

            <PresetButton
              icon={Eye}
              label="자막형"
              desc="검은 배경"
              onClick={() =>
                updateClipTextStyle(selectedClip.id, {
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.72)",
                  shadow: true,
                  bold: true,
                })
              }
            />

            <PresetButton
              icon={Zap}
              label="강조형"
              desc="노랑 강조"
              onClick={() =>
                updateClipTextStyle(selectedClip.id, {
                  color: "#fde047",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  shadow: true,
                  bold: true,
                })
              }
            />
          </div>
        </TextSection>

        <TextSection title="위치 / 배치">
          <div className="grid grid-cols-2 gap-3">
            <RangeField
              icon={Move}
              label="X 위치"
              value={style.x}
              min={0}
              max={100}
              step={1}
              display={`${style.x}%`}
              onChange={(value) =>
                updateClipTextStyle(selectedClip.id, { x: value })
              }
            />

            <RangeField
              icon={Move}
              label="Y 위치"
              value={style.y}
              min={0}
              max={100}
              step={1}
              display={`${style.y}%`}
              onChange={(value) =>
                updateClipTextStyle(selectedClip.id, { y: value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={Move}
              label="상단"
              desc="Top"
              onClick={() => updateClipTextStyle(selectedClip.id, { x: 50, y: 18 })}
            />
            <PresetButton
              icon={Move}
              label="중앙"
              desc="Center"
              onClick={() => updateClipTextStyle(selectedClip.id, { x: 50, y: 50 })}
            />
            <PresetButton
              icon={Move}
              label="하단"
              desc="Bottom"
              onClick={() => updateClipTextStyle(selectedClip.id, { x: 50, y: 82 })}
            />
          </div>
        </TextSection>

        <TextSection title="그림자 / 효과">
          <ToggleButton
            icon={Sparkles}
            label="Shadow"
            active={style.shadow}
            onClick={() =>
              updateClipTextStyle(selectedClip.id, { shadow: !style.shadow })
            }
          />

          <ToggleButton
            icon={Sparkles}
            label="Glow"
            active={Boolean(selectedClip.textGlow)}
            onClick={() =>
              updateClip(selectedClip.id, { textGlow: !selectedClip.textGlow })
            }
          />

          <RangeField
            icon={Eye}
            label="텍스트 투명도"
            value={selectedClip.textOpacity ?? 1}
            min={0}
            max={1}
            step={0.05}
            display={`${Math.round((selectedClip.textOpacity ?? 1) * 100)}%`}
            onChange={(value) =>
              updateClip(selectedClip.id, { textOpacity: value })
            }
          />
        </TextSection>

        <TextSection title="애니메이션">
          <SelectField
            label="Text Animation"
            value={selectedClip.textAnimation ?? "none"}
            options={animationPresets}
            onChange={(value) =>
              updateClip(selectedClip.id, { textAnimation: value })
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Wand2}
              label="유튜브 자막"
              desc="Pop + Bold"
              onClick={() => {
                updateClipTextStyle(selectedClip.id, {
                  fontSize: selectedClip.type === "subtitle" ? 34 : 48,
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  bold: true,
                  shadow: true,
                });
                updateClip(selectedClip.id, { textAnimation: "pop" });
              }}
            />

            <PresetButton
              icon={Sparkles}
              label="감성 타이틀"
              desc="Fade + Glow"
              onClick={() => {
                updateClipTextStyle(selectedClip.id, {
                  fontSize: 52,
                  color: "#ffffff",
                  backgroundColor: "rgba(0,0,0,0.25)",
                  bold: true,
                  shadow: true,
                });
                updateClip(selectedClip.id, {
                  textAnimation: "fade-in",
                  textGlow: true,
                });
              }}
            />

            <PresetButton
              icon={Zap}
              label="쇼츠 강조"
              desc="Bounce"
              onClick={() => {
                updateClipTextStyle(selectedClip.id, {
                  fontSize: 58,
                  color: "#fde047",
                  backgroundColor: "rgba(0,0,0,0.65)",
                  bold: true,
                  shadow: true,
                });
                updateClip(selectedClip.id, {
                  textAnimation: "bounce",
                  textGlow: true,
                });
              }}
            />

            <PresetButton
              icon={RotateCcw}
              label="초기화"
              desc="Default"
              onClick={() => {
                updateClipTextStyle(selectedClip.id, {
                  fontSize: selectedClip.type === "subtitle" ? 30 : 42,
                  color: "#ffffff",
                  backgroundColor:
                    selectedClip.type === "subtitle"
                      ? "rgba(0,0,0,0.72)"
                      : "rgba(0,0,0,0.45)",
                  x: 50,
                  y: selectedClip.type === "subtitle" ? 82 : 50,
                  bold: true,
                  shadow: true,
                });
                updateClip(selectedClip.id, {
                  fontFamily: "sans-serif",
                  textAlign: "center",
                  textGlow: false,
                  textOpacity: 1,
                  textAnimation: "none",
                });
              }}
            />
          </div>
        </TextSection>

        <div className="rounded-none border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          설정된 스타일은 타임라인 렌더러와 인스펙터 상세 텍스트에 연동됩니다.
        </div>
      </div>
    </div>
  );
}

function TextSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-none border border-white/10 bg-black/20 p-3">
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
    <label className="block rounded-none border border-white/10 bg-black/30 p-3">
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
    <label className="flex h-11 items-center justify-between rounded-none border border-white/10 bg-black/30 px-3">
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
        className="h-11 w-full rounded-none border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-fuchsia-400"
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
      className={`flex h-10 items-center justify-center gap-2 rounded-none border text-xs font-black ${active
          ? "border-fuchsia-400 bg-fuchsia-400/20 text-fuchsia-200"
          : "border-white/10 bg-black/30 text-zinc-400 hover:border-fuchsia-400/40"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
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
      className="rounded-none border border-white/10 bg-black/30 p-3 text-left hover:border-fuchsia-400/50"
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
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-fuchsia-400/10 text-fuchsia-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function toColorInputValue(value: string) {
  if (value.startsWith("#")) return value;
  return "#000000";
}
