"use client";

import {
  Download,
  Undo2,
  Redo2,
  Cloud,
  MoreHorizontal,
} from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";
import VideoEditorProjectIO from "./VideoEditorProjectIO";

export default function VideoEditorHeader({
  onOpenExport,
}: {
  onOpenExport: () => void;
}) {
  const { projectTitle, setProjectTitle } = useVideoEditor();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0b10] px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-black">🎬 CreAibox Video Studio</h1>

        <input
          value={projectTitle}
          onChange={(event) => setProjectTitle(event.target.value)}
          className="h-9 w-[260px] rounded-md border border-white/10 bg-black/30 px-3 text-sm font-bold text-zinc-200 outline-none focus:border-cyan-400"
        />

        <div className="flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
          <Cloud size={14} />
          로컬 저장 가능
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-md border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200">
          <Undo2 size={17} />
        </button>

        <button className="rounded-md border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200">
          <Redo2 size={17} />
        </button>

        <div className="mx-2 h-6 w-px bg-white/10" />

        <VideoEditorProjectIO />

        <button
          type="button"
          onClick={onOpenExport}
          className="flex items-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300"
        >
          <Download size={16} />
          내보내기
        </button>

        <button className="rounded-md border border-white/10 p-2 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200">
          <MoreHorizontal size={17} />
        </button>
      </div>
    </header>
  );
}