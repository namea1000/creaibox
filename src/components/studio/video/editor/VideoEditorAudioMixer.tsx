"use client";

import { useRef } from "react";
import {
  Music,
  Volume2,
  VolumeX,
  Waves,
  Mic2,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Upload,
  Plus,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorAudioMixer() {
  const {
    clips,
    selectedClipId,
    updateClip,
    updateClipVolume,
    toggleClipMute,
    addMediaFiles,
    addClipFromMedia,
  } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  const audioClips = clips.filter(
    (clip) => clip.type === "audio" || clip.type === "video"
  );

  const handleLoadSampleBgm = () => {
    addClipFromMedia({
      id: `media-bgm-${Date.now()}`,
      type: "audio",
      name: "Ambient Background Music.mp3",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      createdAt: new Date().toISOString(),
    });
  };

  if (!selectedClip || (selectedClip.type !== "audio" && selectedClip.type !== "video")) {
    return (
      <div>
        <PanelHeader
          icon={SlidersHorizontal}
          title="오디오 믹서"
          desc="오디오 또는 비디오 클립을 선택하면 볼륨, 페이드, 뮤트, 파형을 조절할 수 있습니다."
        />

        <div className="space-y-3">
          {audioClips.length === 0 ? (
            <div className="rounded-none border border-dashed border-white/10 bg-black/30 p-5 text-center text-sm text-zinc-500 space-y-4">
              <div>타임라인에 등록된 오디오 클립이 없습니다. 아래 버튼으로 추가해 보세요.</div>
              <div className="flex gap-2 justify-center">
                <PanelUploadButton
                  label="음악 업로드"
                  accept="audio/*"
                  onUpload={(files) => addMediaFiles(files)}
                />
                <button
                  onClick={handleLoadSampleBgm}
                  className="flex items-center gap-1 rounded-none border border-emerald-400 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-200 hover:bg-emerald-400/20"
                >
                  <Plus size={12} />
                  기본 BGM 추가
                </button>
              </div>
            </div>
          ) : (
            audioClips.map((clip) => (
              <AudioClipMiniCard key={clip.id} clipName={clip.name} muted={clip.muted} volume={clip.volume ?? 1} />
            ))
          )}
        </div>
      </div>
    );
  }

  const fadeIn = selectedClip.fadeIn ?? 0;
  const fadeOut = selectedClip.fadeOut ?? 0;
  const audioPan = selectedClip.audioPan ?? 0;
  const audioGain = selectedClip.audioGain ?? 1;

  return (
    <div>
      <PanelHeader
        icon={SlidersHorizontal}
        title="오디오 믹서"
        desc="볼륨, 페이드 인/아웃, 뮤트, 좌우 밸런스, 파형을 조절합니다."
      />

      <div className="mb-4 rounded-none border border-emerald-400/20 bg-emerald-400/10 p-3">
        <div className="truncate text-sm font-black text-emerald-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-emerald-200/70">
          {selectedClip.type.toUpperCase()} · 볼륨{" "}
          {Math.round((selectedClip.volume ?? 1) * 100)}% ·{" "}
          {selectedClip.muted ? "Muted" : "On"}
        </div>
      </div>

      <div className="space-y-4">
        <AudioSection title="기본 볼륨">
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
            icon={Volume2}
            label="Volume"
            value={selectedClip.volume ?? 1}
            min={0}
            max={2}
            step={0.05}
            display={`${Math.round((selectedClip.volume ?? 1) * 100)}%`}
            onChange={(value) => updateClipVolume(selectedClip.id, value)}
          />

          <RangeField
            icon={Sparkles}
            label="Gain"
            value={audioGain}
            min={0}
            max={3}
            step={0.05}
            display={`${Math.round(audioGain * 100)}%`}
            onChange={(value) =>
              updateClip(selectedClip.id, { audioGain: value })
            }
          />

          <RangeField
            icon={Mic2}
            label="Pan"
            value={audioPan}
            min={-1}
            max={1}
            step={0.05}
            display={
              audioPan === 0
                ? "Center"
                : audioPan < 0
                  ? `L ${Math.round(Math.abs(audioPan) * 100)}%`
                  : `R ${Math.round(audioPan * 100)}%`
            }
            onChange={(value) =>
              updateClip(selectedClip.id, { audioPan: value })
            }
          />
        </AudioSection>

        <AudioSection title="Fade">
          <RangeField
            icon={Waves}
            label="Fade In"
            value={fadeIn}
            min={0}
            max={Math.max(0.5, selectedClip.duration)}
            step={0.1}
            display={`${fadeIn.toFixed(1)}s`}
            onChange={(value) =>
              updateClip(selectedClip.id, { fadeIn: value })
            }
          />

          <RangeField
            icon={Waves}
            label="Fade Out"
            value={fadeOut}
            min={0}
            max={Math.max(0.5, selectedClip.duration)}
            step={0.1}
            display={`${fadeOut.toFixed(1)}s`}
            onChange={(value) =>
              updateClip(selectedClip.id, { fadeOut: value })
            }
          />

          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Waves}
              label="부드러운 시작"
              desc="Fade In 1s"
              onClick={() =>
                updateClip(selectedClip.id, { fadeIn: 1 })
              }
            />

            <PresetButton
              icon={Waves}
              label="부드러운 종료"
              desc="Fade Out 1s"
              onClick={() =>
                updateClip(selectedClip.id, { fadeOut: 1 })
              }
            />

            <PresetButton
              icon={Sparkles}
              label="BGM 기본"
              desc="Vol 70% + Fade"
              onClick={() =>
                updateClip(selectedClip.id, {
                  volume: 0.7,
                  fadeIn: 1,
                  fadeOut: 1.5,
                  muted: false,
                })
              }
            />

            <PresetButton
              icon={RotateCcw}
              label="초기화"
              desc="원래대로"
              onClick={() =>
                updateClip(selectedClip.id, {
                  volume: 1,
                  muted: false,
                  fadeIn: 0,
                  fadeOut: 0,
                  audioPan: 0,
                  audioGain: 1,
                })
              }
            />
          </div>
        </AudioSection>

        <AudioSection title="Waveform">
          <WaveformPreview
            waveform={
              selectedClip.waveform?.length
                ? selectedClip.waveform
                : buildFakeWaveform(selectedClip.id)
            }
            muted={selectedClip.muted}
          />

          <div className="grid grid-cols-2 gap-2">
            <PresetButton
              icon={Waves}
              label="파형 생성"
              desc="임시 파형 저장"
              onClick={() =>
                updateClip(selectedClip.id, {
                  waveform: buildFakeWaveform(`${selectedClip.id}-${Date.now()}`),
                })
              }
            />

            <PresetButton
              icon={RotateCcw}
              label="파형 초기화"
              desc="비우기"
              onClick={() =>
                updateClip(selectedClip.id, {
                  waveform: [],
                })
              }
            />
          </div>

          <p className="text-xs leading-5 text-zinc-500">
            현재는 브라우저 실시간 분석 전 단계의 임시 파형입니다. 다음 단계에서 실제 AudioBuffer 분석을 붙이면 업로드한 음원의 실제 파형으로 표시됩니다.
          </p>
        </AudioSection>

        <div className="rounded-none border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          볼륨/뮤트는 PreviewPlayer에 즉시 반영됩니다. Fade, Pan, Gain 설정값은 타임라인 믹서에 연동되어 관리됩니다.
        </div>
      </div>
    </div>
  );
}

function PanelUploadButton({
  label,
  accept,
  onUpload,
}: {
  label: string;
  accept: string;
  onUpload: (files: FileList) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 rounded-none border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
      >
        <Upload size={12} />
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.value && e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

function AudioClipMiniCard({
  clipName,
  volume,
  muted,
}: {
  clipName: string;
  volume: number;
  muted?: boolean;
}) {
  return (
    <div className="rounded-none border border-white/10 bg-black/30 p-3">
      <div className="flex items-center gap-2 text-sm font-black text-white">
        {muted ? (
          <VolumeX size={15} className="text-red-300" />
        ) : (
          <Music size={15} className="text-emerald-300" />
        )}
        <span className="truncate">{clipName}</span>
      </div>
      <div className="mt-1 text-xs text-zinc-500">
        Volume {Math.round(volume * 100)}%
      </div>
    </div>
  );
}

function WaveformPreview({
  waveform,
  muted,
}: {
  waveform: number[];
  muted?: boolean;
}) {
  return (
    <div className="flex h-24 items-center gap-[3px] rounded-none border border-white/10 bg-black/40 px-3">
      {waveform.map((value, index) => (
        <div
          key={index}
          className={`flex-1 rounded-full ${muted ? "bg-red-300/70" : "bg-emerald-300/80"
            }`}
          style={{
            height: `${Math.max(8, value * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}

// Sub components
function AudioSection({
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
        <span className="text-emerald-200">{display}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-300"
      />
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
      className="rounded-none border border-white/10 bg-black/30 p-3 text-left hover:border-emerald-400/50"
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
      <div className="flex h-10 w-10 items-center justify-center rounded-none bg-emerald-400/10 text-emerald-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function buildFakeWaveform(seed: string) {
  const base = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return Array.from({ length: 52 }).map((_, index) => {
    const value =
      Math.abs(Math.sin(index * 0.42 + base * 0.01)) * 0.75 +
      Math.abs(Math.cos(index * 0.19 + base * 0.02)) * 0.25;

    return Math.min(1, Math.max(0.08, value));
  });
}
