"use client";

import { useRef, useState } from "react";
import { Type, Plus, Upload } from "lucide-react";
import { useVideoEditor } from "./VideoEditorContext";
import { parseSubtitleText } from "./subtitle/subtitleImport";

export default function VideoEditorAddTextPanel() {
  const { addTextClip, addSubtitleClip, addSubtitleCues } = useVideoEditor();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState("");

  const handleSubtitleImport = async (file: File) => {
    const text = await file.text();
    const cues = parseSubtitleText(text);

    if (cues.length === 0) {
      setImportStatus("가져올 수 있는 자막 cue가 없습니다.");
      return;
    }

    addSubtitleCues(cues);
    setImportStatus(`${cues.length}개 자막 클립을 추가했습니다.`);
  };

  return (
    <div>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300">
          <Type size={20} />
        </div>

        <div>
          <h3 className="font-black text-white">텍스트 / 자막 추가</h3>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            타임라인에 새로운 텍스트나 자막 클립을 추가합니다.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={addTextClip}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          <span>새 텍스트 추가 (화면 중앙)</span>
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={addSubtitleClip}
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200"
        >
          <span>새 자막 추가 (화면 하단)</span>
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-between rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-left text-sm font-bold text-amber-100 hover:border-amber-300/50"
        >
          <span>SRT/VTT 자막 가져오기</span>
          <Upload size={15} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".srt,.vtt,text/vtt"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            void handleSubtitleImport(file);
          }}
        />
        {importStatus && (
          <div className="rounded-md border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
}
