"use client";

import {
  Move,
  Maximize2,
  RotateCw,
  Eye,
  FlipHorizontal2,
  FlipVertical2,
  Crop,
  LocateFixed,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorMotionPanel() {
  const { clips, selectedClipId, updateClip } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip) {
    return (
      <div>
        <PanelHeader
          icon={Move}
          title="Motion"
          desc="클립을 선택하면 위치, 크기, 회전, 투명도, 플립, 크롭을 조절할 수 있습니다."
        />

        <div className="rounded-none border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
          선택된 클립이 없습니다.
        </div>
      </div>
    );
  }

  const anyClip = selectedClip as any;

  const motionX = selectedClip.motionX ?? 50;
  const motionY = selectedClip.motionY ?? 50;
  const motionWidth = selectedClip.motionWidth ?? 100;
  const motionHeight = selectedClip.motionHeight ?? 100;
  const scale = selectedClip.scale ?? 1;
  const rotation = selectedClip.rotation ?? 0;
  const opacity = selectedClip.opacity ?? 1;

  const flipX = Boolean(anyClip.flipX);
  const flipY = Boolean(anyClip.flipY);

  const cropTop = anyClip.cropTop ?? 0;
  const cropRight = anyClip.cropRight ?? 0;
  const cropBottom = anyClip.cropBottom ?? 0;
  const cropLeft = anyClip.cropLeft ?? 0;

  const anchorX = anyClip.anchorX ?? 50;
  const anchorY = anyClip.anchorY ?? 50;

  return (
    <div>
      <PanelHeader
        icon={Move}
        title="Motion"
        desc="위치, 크기, 회전, 투명도, 플립, 크롭을 조절합니다."
      />

      <div className="mb-4 rounded-none border border-cyan-400/20 bg-cyan-400/10 p-3">
        <div className="truncate text-sm font-black text-cyan-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-cyan-200/70">
          X {motionX}% · Y {motionY}% · Scale {Math.round(scale * 100)}% · Rotate {rotation}°
        </div>
      </div>

      <div className="space-y-4">
        <MotionSection title="Position">
          <div className="grid grid-cols-2 gap-3">
            <RangeField
              icon={ArrowLeft}
              label="X 위치"
              value={motionX}
              min={0}
              max={100}
              step={1}
              display={`${motionX}%`}
              onChange={(value) => updateClip(selectedClip.id, { motionX: value })}
            />

            <RangeField
              icon={ArrowUp}
              label="Y 위치"
              value={motionY}
              min={0}
              max={100}
              step={1}
              display={`${motionY}%`}
              onChange={(value) => updateClip(selectedClip.id, { motionY: value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={ArrowUp}
              label="상단"
              desc="Top"
              onClick={() => updateClip(selectedClip.id, { motionX: 50, motionY: 20 })}
            />
            <PresetButton
              icon={LocateFixed}
              label="중앙"
              desc="Center"
              onClick={() => updateClip(selectedClip.id, { motionX: 50, motionY: 50 })}
            />
            <PresetButton
              icon={ArrowDown}
              label="하단"
              desc="Bottom"
              onClick={() => updateClip(selectedClip.id, { motionX: 50, motionY: 80 })}
            />
            <PresetButton
              icon={ArrowLeft}
              label="왼쪽"
              desc="Left"
              onClick={() => updateClip(selectedClip.id, { motionX: 25, motionY })}
            />
            <PresetButton
              icon={ArrowRight}
              label="오른쪽"
              desc="Right"
              onClick={() => updateClip(selectedClip.id, { motionX: 75, motionY })}
            />
            <PresetButton
              icon={RotateCcw}
              label="위치 초기화"
              desc="50 / 50"
              onClick={() => updateClip(selectedClip.id, { motionX: 50, motionY: 50 })}
            />
          </div>
        </MotionSection>

        <MotionSection title="Size / Scale">
          <div className="grid grid-cols-2 gap-3">
            <RangeField
              icon={Maximize2}
              label="가로 크기"
              value={motionWidth}
              min={5}
              max={200}
              step={1}
              display={`${motionWidth}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { motionWidth: value })
              }
            />

            <RangeField
              icon={Maximize2}
              label="세로 크기"
              value={motionHeight}
              min={5}
              max={200}
              step={1}
              display={`${motionHeight}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { motionHeight: value })
              }
            />
          </div>

          <RangeField
            icon={ZoomIn}
            label="Scale"
            value={scale}
            min={0.1}
            max={5}
            step={0.05}
            display={`${Math.round(scale * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { scale: value })}
          />

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={Maximize2}
              label="Fit"
              desc="100%"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionWidth: 100,
                  motionHeight: 100,
                  scale: 1,
                })
              }
            />
            <PresetButton
              icon={ZoomIn}
              label="Zoom"
              desc="125%"
              onClick={() => updateClip(selectedClip.id, { scale: 1.25 })}
            />
            <PresetButton
              icon={RotateCcw}
              label="초기화"
              desc="Default"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionWidth: 100,
                  motionHeight: 100,
                  scale: 1,
                })
              }
            />
          </div>
        </MotionSection>

        <MotionSection title="Rotation / Flip">
          <RangeField
            icon={RotateCw}
            label="Rotation"
            value={rotation}
            min={-360}
            max={360}
            step={1}
            display={`${rotation}°`}
            onChange={(value) => updateClip(selectedClip.id, { rotation: value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              icon={FlipHorizontal2}
              label="Flip X"
              active={flipX}
              onClick={() =>
                updateClip(selectedClip.id, { flipX: !flipX } as any)
              }
            />

            <ToggleButton
              icon={FlipVertical2}
              label="Flip Y"
              active={flipY}
              onClick={() =>
                updateClip(selectedClip.id, { flipY: !flipY } as any)
              }
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <PresetButton
              icon={RotateCw}
              label="0°"
              desc="Reset"
              onClick={() => updateClip(selectedClip.id, { rotation: 0 })}
            />
            <PresetButton
              icon={RotateCw}
              label="90°"
              desc="Right"
              onClick={() => updateClip(selectedClip.id, { rotation: 90 })}
            />
            <PresetButton
              icon={RotateCw}
              label="180°"
              desc="Flip"
              onClick={() => updateClip(selectedClip.id, { rotation: 180 })}
            />
            <PresetButton
              icon={RotateCw}
              label="-90°"
              desc="Left"
              onClick={() => updateClip(selectedClip.id, { rotation: -90 })}
            />
          </div>
        </MotionSection>

        <MotionSection title="Opacity">
          <RangeField
            icon={Eye}
            label="Opacity"
            value={opacity}
            min={0}
            max={1}
            step={0.05}
            display={`${Math.round(opacity * 100)}%`}
            onChange={(value) => updateClip(selectedClip.id, { opacity: value })}
          />

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={Eye}
              label="100%"
              desc="Opaque"
              onClick={() => updateClip(selectedClip.id, { opacity: 1 })}
            />
            <PresetButton
              icon={Eye}
              label="70%"
              desc="Soft"
              onClick={() => updateClip(selectedClip.id, { opacity: 0.7 })}
            />
            <PresetButton
              icon={Eye}
              label="40%"
              desc="Overlay"
              onClick={() => updateClip(selectedClip.id, { opacity: 0.4 })}
            />
          </div>
        </MotionSection>

        <MotionSection title="Crop">
          <div className="grid grid-cols-2 gap-3">
            <RangeField
              icon={Crop}
              label="Crop Top"
              value={cropTop}
              min={0}
              max={45}
              step={1}
              display={`${cropTop}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { cropTop: value } as any)
              }
            />

            <RangeField
              icon={Crop}
              label="Crop Bottom"
              value={cropBottom}
              min={0}
              max={45}
              step={1}
              display={`${cropBottom}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { cropBottom: value } as any)
              }
            />

            <RangeField
              icon={Crop}
              label="Crop Left"
              value={cropLeft}
              min={0}
              max={45}
              step={1}
              display={`${cropLeft}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { cropLeft: value } as any)
              }
            />

            <RangeField
              icon={Crop}
              label="Crop Right"
              value={cropRight}
              min={0}
              max={45}
              step={1}
              display={`${cropRight}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { cropRight: value } as any)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Crop}
              label="시네마 crop"
              desc="상하 10%"
              onClick={() =>
                updateClip(selectedClip.id, {
                  cropTop: 10,
                  cropBottom: 10,
                  cropLeft: 0,
                  cropRight: 0,
                } as any)
              }
            />

            <PresetButton
              icon={RotateCcw}
              label="Crop 초기화"
              desc="0%"
              onClick={() =>
                updateClip(selectedClip.id, {
                  cropTop: 0,
                  cropBottom: 0,
                  cropLeft: 0,
                  cropRight: 0,
                } as any)
              }
            />
          </div>
        </MotionSection>

        <MotionSection title="Anchor Point">
          <div className="grid grid-cols-2 gap-3">
            <RangeField
              icon={LocateFixed}
              label="Anchor X"
              value={anchorX}
              min={0}
              max={100}
              step={1}
              display={`${anchorX}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { anchorX: value } as any)
              }
            />

            <RangeField
              icon={LocateFixed}
              label="Anchor Y"
              value={anchorY}
              min={0}
              max={100}
              step={1}
              display={`${anchorY}%`}
              onChange={(value) =>
                updateClip(selectedClip.id, { anchorY: value } as any)
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={LocateFixed}
              label="좌상"
              desc="0/0"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 0, anchorY: 0 } as any)
              }
            />
            <PresetButton
              icon={LocateFixed}
              label="중앙"
              desc="50/50"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 50, anchorY: 50 } as any)
              }
            />
            <PresetButton
              icon={LocateFixed}
              label="우하"
              desc="100/100"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 100, anchorY: 100 } as any)
              }
            />
          </div>
        </MotionSection>

        <MotionSection title="Motion Presets">
          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Sparkles}
              label="PIP 좌상단"
              desc="작은 화면"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionX: 22,
                  motionY: 22,
                  motionWidth: 36,
                  motionHeight: 36,
                  scale: 1,
                  opacity: 1,
                })
              }
            />

            <PresetButton
              icon={Sparkles}
              label="PIP 우하단"
              desc="작은 화면"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionX: 78,
                  motionY: 78,
                  motionWidth: 36,
                  motionHeight: 36,
                  scale: 1,
                  opacity: 1,
                })
              }
            />

            <PresetButton
              icon={ZoomIn}
              label="Zoom Focus"
              desc="확대 연출"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionX: 50,
                  motionY: 50,
                  motionWidth: 100,
                  motionHeight: 100,
                  scale: 1.35,
                })
              }
            />

            <PresetButton
              icon={RotateCcw}
              label="전체 초기화"
              desc="Motion reset"
              onClick={() =>
                updateClip(selectedClip.id, {
                  motionX: 50,
                  motionY: 50,
                  motionWidth: 100,
                  motionHeight: 100,
                  scale: 1,
                  rotation: 0,
                  opacity: 1,
                  flipX: false,
                  flipY: false,
                  cropTop: 0,
                  cropRight: 0,
                  cropBottom: 0,
                  cropLeft: 0,
                  anchorX: 50,
                  anchorY: 50,
                } as any)
              }
            />
          </div>
        </MotionSection>

        <div className="rounded-none border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          위치, 크기, 회전, 투명도는 PreviewPlayer에 바로 반영됩니다.
          Flip/Crop/Anchor는 다음 단계에서 PreviewPlayer 스타일 계산에 연결하면 실제 화면에 반영됩니다.
        </div>
      </div>
    </div>
  );
}

function MotionSection({
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
          ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
          : "border-white/10 bg-black/30 text-zinc-400 hover:border-cyan-400/40"
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
      className="rounded-none border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50"
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
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}