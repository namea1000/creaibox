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

const transitionOptions: { label: string; value: VideoTransitionType }[] = [
  { label: "없음", value: "none" },
  { label: "Fade", value: "fade" },
  { label: "Zoom", value: "zoom" },
  { label: "Slide", value: "slide" },
  { label: "Blur", value: "blur" },
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

type InspectorTab = "video" | "audio" | "text" | "effects" | "export";

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
  } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;
  const selectedMedia = selectedClip?.mediaId
    ? mediaItems.find((item) => item.id === selectedClip.mediaId) || null
    : null;

  const textStyle = selectedClip?.textStyle;

  const [activeTab, setActiveTab] = useState<InspectorTab>("video");

  // Keep active tab relevant to the selection
  useEffect(() => {
    if (!selectedClip) {
      if (activeTab !== "export" && activeTab !== "video") {
        setActiveTab("video");
      }
      return;
    }
    const isAudioVisible = selectedClip.type === "video" || selectedClip.type === "audio";
    const isTextVisible = selectedClip.type === "text" || selectedClip.type === "subtitle";

    if (activeTab === "audio" && !isAudioVisible) {
      setActiveTab("video");
    } else if (activeTab === "text" && !isTextVisible) {
      setActiveTab("video");
    }
  }, [selectedClipId, selectedClip?.type, activeTab]);

  return (
    <aside className="flex h-full w-full flex-col bg-transparent">
      {/* Tab Selector Header */}
      <div className="flex h-12 shrink-0 border-b border-white/5 bg-[#202026]">
        <TabButton
          label="비디오"
          active={activeTab === "video"}
          onClick={() => setActiveTab("video")}
        />
        {selectedClip && (selectedClip.type === "video" || selectedClip.type === "audio") && (
          <TabButton
            label="오디오"
            active={activeTab === "audio"}
            onClick={() => setActiveTab("audio")}
          />
        )}
        {selectedClip && (selectedClip.type === "text" || selectedClip.type === "subtitle") && (
          <TabButton
            label="텍스트"
            active={activeTab === "text"}
            onClick={() => setActiveTab("text")}
          />
        )}
        {selectedClip && (
          <TabButton
            label="효과/전환"
            active={activeTab === "effects"}
            onClick={() => setActiveTab("effects")}
          />
        )}
        <TabButton
          label="내보내기"
          active={activeTab === "export"}
          onClick={() => setActiveTab("export")}
        />
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "video" && (
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
                      className="rounded-none border border-white/10 p-2 text-zinc-500 hover:border-red-400 hover:text-red-300"
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
                      className="h-11 w-full rounded-none border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
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
                </div>
              ) : (
                <div className="rounded-none border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500">
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

            {selectedClip && (
              <InspectorCard title="Motion / Transform">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <RangeField
                      label="X 위치"
                      value={selectedClip.motionX ?? 50}
                      min={0}
                      max={100}
                      step={1}
                      display={`${selectedClip.motionX ?? 50}%`}
                      onChange={(value) => updateClip(selectedClip.id, { motionX: value })}
                    />

                    <RangeField
                      label="Y 위치"
                      value={selectedClip.motionY ?? 50}
                      min={0}
                      max={100}
                      step={1}
                      display={`${selectedClip.motionY ?? 50}%`}
                      onChange={(value) => updateClip(selectedClip.id, { motionY: value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <RangeField
                      label="가로 크기"
                      value={selectedClip.motionWidth ?? 100}
                      min={10}
                      max={200}
                      step={1}
                      display={`${selectedClip.motionWidth ?? 100}%`}
                      onChange={(value) =>
                        updateClip(selectedClip.id, { motionWidth: value })
                      }
                    />

                    <RangeField
                      label="세로 크기"
                      value={selectedClip.motionHeight ?? 100}
                      min={10}
                      max={200}
                      step={1}
                      display={`${selectedClip.motionHeight ?? 100}%`}
                      onChange={(value) =>
                        updateClip(selectedClip.id, { motionHeight: value })
                      }
                    />
                  </div>

                  <RangeField
                    label="Scale"
                    value={selectedClip.scale ?? 1}
                    min={0.1}
                    max={3}
                    step={0.05}
                    display={`${Math.round((selectedClip.scale ?? 1) * 100)}%`}
                    onChange={(value) => updateClip(selectedClip.id, { scale: value })}
                  />

                  <RangeField
                    label="Rotation"
                    value={selectedClip.rotation ?? 0}
                    min={-360}
                    max={360}
                    step={1}
                    display={`${selectedClip.rotation ?? 0}°`}
                    onChange={(value) => updateClip(selectedClip.id, { rotation: value })}
                  />

                  <RangeField
                    label="Opacity"
                    value={selectedClip.opacity ?? 1}
                    min={0}
                    max={1}
                    step={0.05}
                    display={`${Math.round((selectedClip.opacity ?? 1) * 100)}%`}
                    onChange={(value) => updateClip(selectedClip.id, { opacity: value })}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <ResetButton
                      icon={Move}
                      label="위치 초기화"
                      onClick={() =>
                        updateClip(selectedClip.id, {
                          motionX: 50,
                          motionY: 50,
                        })
                      }
                    />
                    <ResetButton
                      icon={Maximize2}
                      label="크기 초기화"
                      onClick={() =>
                        updateClip(selectedClip.id, {
                          motionWidth: 100,
                          motionHeight: 100,
                          scale: 1,
                        })
                      }
                    />
                    <ResetButton
                      icon={RotateCw}
                      label="회전 초기화"
                      onClick={() =>
                        updateClip(selectedClip.id, {
                          rotation: 0,
                        })
                      }
                    />
                  </div>
                </div>
              </InspectorCard>
            )}
          </>
        )}

        {activeTab === "audio" && selectedClip && (selectedClip.type === "audio" || selectedClip.type === "video") && (
          <InspectorCard title="Audio">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-none border border-white/10 bg-black/30 p-3">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                  {selectedClip.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  음소거
                </div>

                <button
                  type="button"
                  onClick={() => toggleClipMute(selectedClip.id)}
                  className={`rounded-none px-3 py-1 text-xs font-black ${selectedClip.muted
                      ? "bg-red-500/20 text-red-200"
                      : "bg-emerald-400/20 text-emerald-200"
                    }`}
                >
                  {selectedClip.muted ? "Muted" : "On"}
                </button>
              </div>

              <RangeField
                label="볼륨"
                value={selectedClip.volume ?? 1}
                min={0}
                max={2}
                step={0.05}
                display={`${Math.round((selectedClip.volume ?? 1) * 100)}%`}
                onChange={(value) => updateClipVolume(selectedClip.id, value)}
              />
            </div>
          </InspectorCard>
        )}

        {activeTab === "text" && selectedClip && (selectedClip.type === "text" || selectedClip.type === "subtitle") && textStyle && (
          <InspectorCard title="Text Style">
            <div className="space-y-4">
              <RangeField
                label="글자 크기"
                value={textStyle.fontSize}
                min={14}
                max={96}
                step={1}
                display={`${textStyle.fontSize}px`}
                onChange={(value) =>
                  updateClipTextStyle(selectedClip.id, { fontSize: value })
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <ColorField
                  label="글자색"
                  value={textStyle.color}
                  onChange={(value) =>
                    updateClipTextStyle(selectedClip.id, { color: value })
                  }
                />
                <ColorField
                  label="배경색"
                  value={toColorInputValue(textStyle.backgroundColor)}
                  onChange={(value) =>
                    updateClipTextStyle(selectedClip.id, { backgroundColor: value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <RangeField
                  label="X 위치"
                  value={textStyle.x}
                  min={0}
                  max={100}
                  step={1}
                  display={`${textStyle.x}%`}
                  onChange={(value) =>
                    updateClipTextStyle(selectedClip.id, { x: value })
                  }
                />
                <RangeField
                  label="Y 위치"
                  value={textStyle.y}
                  min={0}
                  max={100}
                  step={1}
                  display={`${textStyle.y}%`}
                  onChange={(value) =>
                    updateClipTextStyle(selectedClip.id, { y: value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ToggleButton
                  icon={Type}
                  label="Bold"
                  active={textStyle.bold}
                  onClick={() =>
                    updateClipTextStyle(selectedClip.id, {
                      bold: !textStyle.bold,
                    })
                  }
                />
                <ToggleButton
                  icon={Sparkles}
                  label="Shadow"
                  active={textStyle.shadow}
                  onClick={() =>
                    updateClipTextStyle(selectedClip.id, {
                      shadow: !textStyle.shadow,
                    })
                  }
                />
              </div>
            </div>
          </InspectorCard>
        )}

        {activeTab === "effects" && selectedClip && (
          <>
            <InspectorCard title="Effects / Filter">
              <div className="space-y-4">
                <RangeField
                  label="Brightness"
                  value={selectedClip.brightness ?? 1}
                  min={0}
                  max={3}
                  step={0.05}
                  display={`${Math.round((selectedClip.brightness ?? 1) * 100)}%`}
                  onChange={(value) => updateClip(selectedClip.id, { brightness: value })}
                />

                <RangeField
                  label="Contrast"
                  value={selectedClip.contrast ?? 1}
                  min={0}
                  max={3}
                  step={0.05}
                  display={`${Math.round((selectedClip.contrast ?? 1) * 100)}%`}
                  onChange={(value) => updateClip(selectedClip.id, { contrast: value })}
                />

                <RangeField
                  label="Saturation"
                  value={selectedClip.saturation ?? 1}
                  min={0}
                  max={3}
                  step={0.05}
                  display={`${Math.round((selectedClip.saturation ?? 1) * 100)}%`}
                  onChange={(value) => updateClip(selectedClip.id, { saturation: value })}
                />

                <RangeField
                  label="Blur"
                  value={selectedClip.blur ?? 0}
                  min={0}
                  max={20}
                  step={0.5}
                  display={`${selectedClip.blur ?? 0}px`}
                  onChange={(value) => updateClip(selectedClip.id, { blur: value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <RangeField
                    label="Grayscale"
                    value={selectedClip.grayscale ?? 0}
                    min={0}
                    max={1}
                    step={0.05}
                    display={`${Math.round((selectedClip.grayscale ?? 0) * 100)}%`}
                    onChange={(value) =>
                      updateClip(selectedClip.id, { grayscale: value })
                    }
                  />

                  <RangeField
                    label="Sepia"
                    value={selectedClip.sepia ?? 0}
                    min={0}
                    max={1}
                    step={0.05}
                    display={`${Math.round((selectedClip.sepia ?? 0) * 100)}%`}
                    onChange={(value) => updateClip(selectedClip.id, { sepia: value })}
                  />
                </div>

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

                <div className="grid grid-cols-2 gap-2">
                  <ResetButton
                    icon={SlidersHorizontal}
                    label="필터 초기화"
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
                  <ResetButton
                    icon={Eye}
                    label="투명도 초기화"
                    onClick={() =>
                      updateClip(selectedClip.id, {
                        opacity: 1,
                      })
                    }
                  />
                </div>
              </div>
            </InspectorCard>

            <InspectorCard title="Transition">
              <div className="space-y-3">
                <SelectField
                  label="시작 효과"
                  value={selectedClip.transitionIn ?? "none"}
                  options={transitionOptions}
                  onChange={(value) =>
                    updateClipTransition(selectedClip.id, "in", value as VideoTransitionType)
                  }
                />

                <SelectField
                  label="끝 효과"
                  value={selectedClip.transitionOut ?? "none"}
                  options={transitionOptions}
                  onChange={(value) =>
                    updateClipTransition(selectedClip.id, "out", value as VideoTransitionType)
                  }
                />

                <p className="text-xs leading-5 text-zinc-500">
                  Fade, Zoom, Slide, Blur 전환 효과가 프리뷰에 즉시 반영됩니다.
                </p>
              </div>
            </InspectorCard>

            <InspectorCard title="Advanced">
              <div className="grid grid-cols-2 gap-2">
                <MiniFeature icon={Move} label="Motion Ready" />
                <MiniFeature icon={Palette} label="Color Ready" />
                <MiniFeature icon={SlidersHorizontal} label="Filter Ready" />
                <MiniFeature icon={Wand2} label="Keyframe Next" />
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-500">
                다음 단계에서 Keyframe 배열을 붙이면 시간에 따라 위치/크기/효과가 자동 변화합니다.
              </p>
            </InspectorCard>
          </>
        )}

        {activeTab === "export" && (
          <InspectorCard title="Export Settings">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  해상도
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {EXPORT_RESOLUTION_OPTIONS.map((item) => (
                    <OptionButton
                      key={item.value}
                      label={item.label}
                      desc={item.desc}
                      active={exportResolution === item.value}
                      onClick={() =>
                        setExportResolution(item.value as ExportResolution)
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  프레임
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {EXPORT_FPS_OPTIONS.map((item) => (
                    <OptionButton
                      key={item.value}
                      label={item.label}
                      active={exportFps === item.value}
                      onClick={() => setExportFps(item.value as ExportFps)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  화질
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {EXPORT_QUALITY_OPTIONS.map((item) => (
                    <OptionButton
                      key={item.value}
                      label={item.label}
                      desc={item.desc}
                      active={exportQuality === item.value}
                      onClick={() =>
                        setExportQuality(item.value as ExportQuality)
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-none border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-200">
                현재 설정: {exportResolution} · {exportFps}fps ·{" "}
                {
                  EXPORT_QUALITY_OPTIONS.find(
                    (item) => item.value === exportQuality
                  )?.label
                }
              </div>

              <button
                type="button"
                onClick={onOpenExport}
                className="flex w-full items-center justify-center gap-2 rounded-none bg-cyan-400 py-3 font-black text-black hover:bg-cyan-300"
              >
                <Download size={17} />
                MP4 내보내기
              </button>
            </div>
          </InspectorCard>
        )}
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
      className={`flex-1 text-xs font-black transition border-b-2 h-full flex items-center justify-center outline-none ${
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
    <div className="rounded-none border border-white/10 bg-black/20 p-4">
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

      <div className="flex h-11 items-center rounded-none border border-white/10 bg-black/40 px-3 focus-within:border-cyan-400">
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
    <label className="block rounded-none border border-white/10 bg-black/30 p-3">
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
        className="h-11 w-full rounded-none border border-white/10 bg-black/40 px-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
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
      className="flex min-h-10 items-center justify-center gap-1 rounded-none border border-white/10 bg-black/30 px-2 py-2 text-[10px] font-black text-zinc-400 hover:border-cyan-400/50 hover:text-cyan-200"
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

function ActionButton({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center justify-center gap-2 rounded-none border text-xs font-black ${danger
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
    <div className="flex h-10 items-center justify-center gap-2 rounded-none border border-white/10 bg-black/30 text-xs font-bold text-zinc-500">
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
      className={`rounded-none border px-3 py-3 text-left text-sm transition ${active
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
    <div className="rounded-none border border-white/10 bg-black/30 p-3">
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