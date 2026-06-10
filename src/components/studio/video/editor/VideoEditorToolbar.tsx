"use client";

import {
  Play,
  Pause,
  Scissors,
  Type,
  Captions,
  Sparkles,
  MousePointer2,
  Split,
  Trash2,
  Copy,
  Crop,
  RotateCcw,
  Undo2,
  Redo2,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

export default function VideoEditorToolbar() {
  const {
    selectedClipId,
    removeClip,
    duplicateClip,
    splitClip,
    addTextClip,
    addSubtitleClip,
    isPlaying,
    currentTime,
    togglePlayback,
    stopPlayback,
    setCurrentTime,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useVideoEditor();

  const hasSelectedClip = Boolean(selectedClipId);

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0b10] px-4">
      <div className="flex items-center gap-2">
        <ToolIcon icon={Undo2} disabled={!canUndo} onClick={undo} />
        <ToolIcon icon={Redo2} disabled={!canRedo} onClick={redo} />

        <div className="mx-1 h-6 w-px bg-white/10" />

        <ToolButton icon={MousePointer2} label="선택" active />

        <ToolButton
          icon={Scissors}
          label="자르기"
          disabled={!hasSelectedClip}
          onClick={() => {
            if (!selectedClipId) return;
            splitClip(selectedClipId, currentTime);
          }}
        />

        <ToolButton
          icon={Split}
          label="분할"
          disabled={!hasSelectedClip}
          onClick={() => {
            if (!selectedClipId) return;
            splitClip(selectedClipId, currentTime);
          }}
        />

        <ToolButton icon={Crop} label="크롭" disabled />

        <ToolButton icon={Type} label="텍스트" onClick={addTextClip} />

        <ToolButton icon={Captions} label="자막" onClick={addSubtitleClip} />

        <ToolButton icon={Sparkles} label="효과" disabled />
      </div>

      <div className="flex items-center gap-2">
        <ToolIcon
          icon={Copy}
          disabled={!hasSelectedClip}
          onClick={() => {
            if (!selectedClipId) return;
            duplicateClip(selectedClipId);
          }}
        />

        <ToolIcon
          icon={Trash2}
          disabled={!hasSelectedClip}
          onClick={() => {
            if (!selectedClipId) return;
            removeClip(selectedClipId);
          }}
        />

        <ToolIcon
          icon={RotateCcw}
          onClick={() => {
            setCurrentTime(0);
          }}
        />

        <div className="mx-2 h-6 w-px bg-white/10" />

        <button
          type="button"
          onClick={togglePlayback}
          className="flex items-center gap-2 rounded-none bg-cyan-400 px-4 py-2 text-sm font-black text-black hover:bg-cyan-300"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "재생 중" : "재생"}
        </button>

        <button
          type="button"
          onClick={stopPlayback}
          className="flex items-center gap-2 rounded-none border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-cyan-400"
        >
          <Pause size={16} />
          정지
        </button>
      </div>
    </div>
  );
}

function ToolButton({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-none border px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${active
          ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 text-zinc-400 hover:border-cyan-400/50 hover:text-cyan-200"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function ToolIcon({
  icon: Icon,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-none border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Icon size={16} />
    </button>
  );
}