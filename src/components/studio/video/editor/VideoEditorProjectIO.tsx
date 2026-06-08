"use client";

import { useRef } from "react";
import { FolderOpen, Save } from "lucide-react";

import { useVideoEditor } from "./VideoEditorContext";

function safeFileName(value: string) {
  return (value || "creaibox-video-project")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function VideoEditorProjectIO() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { projectTitle, exportProjectJson, importProjectJson } = useVideoEditor();

  const handleSaveProject = () => {
    const json = exportProjectJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeFileName(projectTitle)}.creaibox-video.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleOpenProject = () => {
    inputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importProjectJson(text);
    } catch (error: any) {
      window.alert(`프로젝트 불러오기 실패: ${error.message || "알 수 없는 오류"}`);
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportFile}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleOpenProject}
        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-cyan-400"
      >
        <FolderOpen size={16} />
        열기
      </button>

      <button
        type="button"
        onClick={handleSaveProject}
        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-cyan-400"
      >
        <Save size={16} />
        저장
      </button>
    </>
  );
}