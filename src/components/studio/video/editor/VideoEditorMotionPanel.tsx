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
  Gauge,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorMotionPanel() {
  const { clips, currentTime, selectedClipId, updateClip } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip) {
    return (
      <div>
        <PanelHeader
          icon={Move}
          title="비디오 / 모션"
          desc="클립을 선택하면 위치, 크기, 회전, 투명도, 플립, 크롭을 조절할 수 있습니다."
        />

        <div className="rounded-md border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
          선택된 클립이 없습니다.
        </div>
      </div>
    );
  }

  const motionX = selectedClip.motionX ?? 50;
  const motionY = selectedClip.motionY ?? 50;
  const motionWidth = selectedClip.motionWidth ?? 100;
  const motionHeight = selectedClip.motionHeight ?? 100;
  const scale = selectedClip.scale ?? 1;
  const rotation = selectedClip.rotation ?? 0;
  const opacity = selectedClip.opacity ?? 1;
  const keyframes = [...(selectedClip.keyframes ?? [])].sort((a, b) => a.time - b.time);
  const localKeyframeTime = Math.max(
    0,
    Math.min(selectedClip.duration, currentTime - selectedClip.startTime)
  );
  const activeKeyframe = keyframes.find(
    (keyframe) => Math.abs(keyframe.time - localKeyframeTime) < 0.05
  );

  const handleSpeedChange = () => {
    if (!selectedClip) return;
    const nextDuration = Math.max(0.5, selectedClip.duration / 2);
    updateClip(selectedClip.id, {
      duration: nextDuration,
      name: `${selectedClip.name.replace(" (2.0x)", "")} (2.0x)`,
    });
  };

  const flipX = Boolean(selectedClip.flipX);
  const flipY = Boolean(selectedClip.flipY);

  const cropTop = selectedClip.cropTop ?? 0;
  const cropRight = selectedClip.cropRight ?? 0;
  const cropBottom = selectedClip.cropBottom ?? 0;
  const cropLeft = selectedClip.cropLeft ?? 0;

  const anchorX = selectedClip.anchorX ?? 50;
  const anchorY = selectedClip.anchorY ?? 50;

  const addOrUpdateKeyframe = () => {
    const nextKeyframe = {
      id: activeKeyframe?.id ?? `kf-${Date.now()}`,
      time: Number(localKeyframeTime.toFixed(3)),
      motionX,
      motionY,
      motionWidth,
      motionHeight,
      scale,
      rotation,
      opacity,
    };
    const nextKeyframes = [
      ...keyframes.filter((keyframe) => keyframe.id !== activeKeyframe?.id),
      nextKeyframe,
    ].sort((a, b) => a.time - b.time);

    updateClip(selectedClip.id, { keyframes: nextKeyframes });
  };

  const removeActiveKeyframe = () => {
    if (!activeKeyframe) return;
    updateClip(selectedClip.id, {
      keyframes: keyframes.filter((keyframe) => keyframe.id !== activeKeyframe.id),
    });
  };

  return (
    <div>
      <PanelHeader
        icon={Move}
        title="비디오 / 모션"
        desc="위치, 크기, 회전, 투명도, 플립, 크롭을 조절합니다."
      />

      <div className="mb-4 rounded-md border border-cyan-400/20 bg-cyan-400/10 p-3">
        <div className="truncate text-sm font-black text-cyan-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-cyan-200/70">
          X {motionX}% · Y {motionY}% · Scale {Math.round(scale * 100)}% · Rotate {rotation}°
        </div>
      </div>

      <div className="space-y-4">
        <MotionSection title="Keyframes">
          <div className="rounded-md border border-cyan-400/15 bg-cyan-400/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-cyan-100">
                  현재 위치 {localKeyframeTime.toFixed(2)}s
                </div>
                <div className="mt-1 text-[11px] text-cyan-200/70">
                  {keyframes.length}개 keyframe · {activeKeyframe ? "현재 위치에 keyframe 있음" : "현재 모션 값을 저장 가능"}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={addOrUpdateKeyframe}
                  className="rounded-md bg-cyan-400 px-3 py-2 text-xs font-black text-black hover:bg-cyan-300"
                >
                  {activeKeyframe ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  disabled={!activeKeyframe}
                  onClick={removeActiveKeyframe}
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-white hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </div>

            {keyframes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {keyframes.map((keyframe) => (
                  <span
                    key={keyframe.id}
                    className={`rounded-md border px-2 py-1 text-[10px] font-black ${
                      activeKeyframe?.id === keyframe.id
                        ? "border-cyan-400 bg-cyan-400/20 text-cyan-100"
                        : "border-white/10 bg-black/30 text-zinc-400"
                    }`}
                  >
                    {keyframe.time.toFixed(2)}s
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <PresetButton
                icon={Sparkles}
                label="Ken Burns"
                desc="느린 확대"
                onClick={() =>
                  updateClip(selectedClip.id, {
                    keyframes: [
                      {
                        id: `kf-${Date.now()}-a`,
                        time: 0,
                        motionX: 50,
                        motionY: 50,
                        motionWidth: 100,
                        motionHeight: 100,
                        scale: 1,
                        rotation: 0,
                        opacity: 1,
                      },
                      {
                        id: `kf-${Date.now()}-b`,
                        time: selectedClip.duration,
                        motionX: 50,
                        motionY: 50,
                        motionWidth: 100,
                        motionHeight: 100,
                        scale: 1.22,
                        rotation: 0,
                        opacity: 1,
                      },
                    ],
                  })
                }
              />
              <PresetButton
                icon={RotateCcw}
                label="Keyframes 초기화"
                desc="모션 고정값 사용"
                onClick={() => updateClip(selectedClip.id, { keyframes: [] })}
              />
            </div>
          </div>
        </MotionSection>

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
                updateClip(selectedClip.id, { flipX: !flipX })
              }
            />

            <ToggleButton
              icon={FlipVertical2}
              label="Flip Y"
              active={flipY}
              onClick={() =>
                updateClip(selectedClip.id, { flipY: !flipY })
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

          {selectedClip.type === "video" && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
              <PresetButton
                icon={RotateCw}
                label="회전 (90°)"
                desc="시계방향 90도 회전"
                onClick={() => {
                  const nextRotation = ((selectedClip.rotation || 0) + 90) % 360;
                  updateClip(selectedClip.id, { rotation: nextRotation });
                }}
              />
              <PresetButton
                icon={Gauge}
                label="배속 (2.0x)"
                desc="재생 속도 2배속"
                onClick={handleSpeedChange}
              />
            </div>
          )}
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
                updateClip(selectedClip.id, { cropTop: value })
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
                updateClip(selectedClip.id, { cropBottom: value })
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
                updateClip(selectedClip.id, { cropLeft: value })
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
                updateClip(selectedClip.id, { cropRight: value })
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
                })
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
                })
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
                updateClip(selectedClip.id, { anchorX: value })
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
                updateClip(selectedClip.id, { anchorY: value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <PresetButton
              icon={LocateFixed}
              label="좌상"
              desc="0/0"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 0, anchorY: 0 })
              }
            />
            <PresetButton
              icon={LocateFixed}
              label="중앙"
              desc="50/50"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 50, anchorY: 50 })
              }
            />
            <PresetButton
              icon={LocateFixed}
              label="우하"
              desc="100/100"
              onClick={() =>
                updateClip(selectedClip.id, { anchorX: 100, anchorY: 100 })
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
                })
              }
            />
          </div>
        </MotionSection>

        <div className="rounded-md border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
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
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
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
    <label className="block rounded-md border border-white/10 bg-black/30 p-3">
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
      className="rounded-md border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50"
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
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}
