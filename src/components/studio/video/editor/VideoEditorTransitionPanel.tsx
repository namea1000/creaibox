"use client";

import {
  Sparkles,
  Wand2,
  Eye,
  ZoomIn,
  MoveRight,
  Scan,
  Plus,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import type { VideoTransitionType } from "./VideoEditorContext";

const transitionPresets: {
  value: VideoTransitionType;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
    {
      value: "none",
      label: "없음",
      desc: "전환 효과 없음",
      icon: Eye,
    },
    {
      value: "fade",
      label: "Fade",
      desc: "부드럽게 나타나고 사라짐",
      icon: Sparkles,
    },
    {
      value: "zoom",
      label: "Zoom",
      desc: "확대/축소 전환",
      icon: ZoomIn,
    },
    {
      value: "slide",
      label: "Slide",
      desc: "좌우 이동 전환",
      icon: MoveRight,
    },
    {
      value: "blur",
      label: "Blur",
      desc: "블러 전환",
      icon: Scan,
    },
  ];

export default function VideoEditorTransitionPanel() {
  const {
    clips,
    selectedClipId,
    updateClipTransition,
    updateClip,
  } = useVideoEditor();

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || null;

  if (!selectedClip) {
    return (
      <div>
        <PanelHeader
          icon={Wand2}
          title="전환 효과"
          desc="타임라인에서 클립을 선택하면 전환 효과를 적용할 수 있습니다."
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
        icon={Wand2}
        title="전환 효과"
        desc="선택한 클립의 시작/끝 전환 효과를 설정합니다."
      />

      <div className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3">
        <div className="truncate text-sm font-black text-cyan-100">
          {selectedClip.name}
        </div>
        <div className="mt-1 text-xs text-cyan-200/70">
          In: {selectedClip.transitionIn ?? "none"} · Out:{" "}
          {selectedClip.transitionOut ?? "none"}
        </div>
      </div>

      <div className="space-y-4">
        <TransitionGroup
          title="시작 전환"
          value={selectedClip.transitionIn ?? "none"}
          onChange={(value) =>
            updateClipTransition(selectedClip.id, "in", value)
          }
        />

        <TransitionGroup
          title="끝 전환"
          value={selectedClip.transitionOut ?? "none"}
          onChange={(value) =>
            updateClipTransition(selectedClip.id, "out", value)
          }
        />

        <div className="grid grid-cols-2 gap-2">
          <PresetButton
            label="부드러운 영상"
            desc="Fade In / Fade Out"
            onClick={() =>
              updateClip(selectedClip.id, {
                transitionIn: "fade",
                transitionOut: "fade",
              })
            }
          />

          <PresetButton
            label="쇼츠 스타일"
            desc="Zoom In / Slide Out"
            onClick={() =>
              updateClip(selectedClip.id, {
                transitionIn: "zoom",
                transitionOut: "slide",
              })
            }
          />

          <PresetButton
            label="몽환적 전환"
            desc="Blur In / Fade Out"
            onClick={() =>
              updateClip(selectedClip.id, {
                transitionIn: "blur",
                transitionOut: "fade",
              })
            }
          />

          <PresetButton
            label="초기화"
            desc="None / None"
            onClick={() =>
              updateClip(selectedClip.id, {
                transitionIn: "none",
                transitionOut: "none",
              })
            }
          />
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
          현재 전환 효과는 PreviewPlayer에 이미 연결되어 있어서 선택 즉시
          프리뷰에 반영됩니다.
        </div>
      </div>
    </div>
  );
}

function TransitionGroup({
  title,
  value,
  onChange,
}: {
  title: string;
  value: VideoTransitionType;
  onChange: (value: VideoTransitionType) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">
        {title}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {transitionPresets.map((preset) => {
          const Icon = preset.icon;
          const active = value === preset.value;

          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${active
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-black/30 text-zinc-400 hover:border-cyan-400/50"
                }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-cyan-400/20" : "bg-white/5"
                  }`}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-black">{preset.label}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  {preset.desc}
                </div>
              </div>

              {active && (
                <div className="rounded-full bg-cyan-400 px-2 py-1 text-[10px] font-black text-black">
                  ON
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PresetButton({
  label,
  desc,
  onClick,
}: {
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-black/30 p-3 text-left hover:border-cyan-400/50"
    >
      <div className="flex items-center gap-2 text-xs font-black text-white">
        <Plus size={13} />
        {label}
      </div>
      <div className="mt-1 text-[10px] text-zinc-500">{desc}</div>
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-black text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}