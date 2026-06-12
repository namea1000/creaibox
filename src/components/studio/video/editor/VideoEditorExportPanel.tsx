"use client";

import { X, Download, Film, Monitor, Clock, Gauge, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  EXPORT_FPS_OPTIONS,
  EXPORT_QUALITY_OPTIONS,
  EXPORT_RESOLUTION_OPTIONS,
} from "./constants";
import { useVideoEditor } from "./VideoEditorContext";
import type { ExportFps, ExportQuality, ExportResolution } from "./types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 오류";
}

export default function VideoEditorExportPanel({
  open,
  onClose,
  onExportWebm,
  onExportMp4,
}: {
  open: boolean;
  onClose: () => void;
  onExportWebm: () => Promise<void>;
  onExportMp4: (onProgress?: (progress: number) => void) => Promise<void>;
}) {
  const {
    projectTitle,
    clips,
    totalDuration,
    exportResolution,
    exportFps,
    exportQuality,
    setExportResolution,
    setExportFps,
    setExportQuality,
  } = useVideoEditor();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<"webm" | "mp4" | null>(null);
  const [mp4Progress, setMp4Progress] = useState(0);
  if (!open) return null;

  const selectedQualityLabel =
    EXPORT_QUALITY_OPTIONS.find((item) => item.value === exportQuality)?.label || "표준";

  const selectedResolutionDesc =
    EXPORT_RESOLUTION_OPTIONS.find((item) => item.value === exportResolution)?.desc || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black">내보내기</h2>
            <p className="mt-1 text-sm text-zinc-500">
              현재 편집 프로젝트를 영상 파일로 저장합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <ExportSection title="해상도" icon={Monitor}>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_RESOLUTION_OPTIONS.map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    desc={item.desc}
                    active={exportResolution === item.value}
                    onClick={() => setExportResolution(item.value as ExportResolution)}
                  />
                ))}
              </div>
            </ExportSection>

            <ExportSection title="프레임" icon={Clock}>
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
            </ExportSection>

            <ExportSection title="화질" icon={Gauge}>
              <div className="grid grid-cols-1 gap-2">
                {EXPORT_QUALITY_OPTIONS.map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    desc={item.desc}
                    active={exportQuality === item.value}
                    onClick={() => setExportQuality(item.value as ExportQuality)}
                  />
                ))}
              </div>
            </ExportSection>
          </div>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Film size={28} />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Project
              </div>
              <div className="mt-1 truncate text-lg font-black">{projectTitle}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <InfoBox label="클립" value={`${clips.length}개`} />
              <InfoBox label="길이" value={`${totalDuration}s`} />
              <InfoBox label="해상도" value={exportResolution} />
              <InfoBox label="크기" value={selectedResolutionDesc} />
              <InfoBox label="프레임" value={`${exportFps}fps`} />
              <InfoBox label="화질" value={selectedQualityLabel} />
            </div>

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
              <div className="mb-1 flex items-center gap-2 font-black">
                <AlertCircle size={14} />
                현재 단계
              </div>
              지금은 내보내기 설정 UI 단계입니다. 다음 단계에서 Canvas/WebM 렌더링과 MP4 변환을 연결합니다.
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={async () => {
                  try {
                    setIsExporting(true);
                    setExportMode("webm");
                    await onExportWebm();
                  } catch (error: unknown) {
                    window.alert(`WebM 내보내기 실패: ${getErrorMessage(error)}`);
                  } finally {
                    setIsExporting(false);
                    setExportMode(null);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 py-3 font-black text-white hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={17} />
                {isExporting && exportMode === "webm" ? "WebM 생성 중..." : "WebM 저장"}
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={async () => {
                  try {
                    setIsExporting(true);
                    setExportMode("mp4");
                    setMp4Progress(0);

                    await onExportMp4((progress) => {
                      setMp4Progress(progress);
                    });
                  } catch (error: unknown) {
                    window.alert(`MP4 내보내기 실패: ${getErrorMessage(error)}`);
                  } finally {
                    setIsExporting(false);
                    setExportMode(null);
                    setMp4Progress(0);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-black text-black hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={17} />
                {isExporting && exportMode === "mp4"
                  ? `MP4 변환 ${mp4Progress}%`
                  : "MP4 저장"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ExportSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-zinc-400">
        <Icon size={16} />
        {title}
      </div>
      {children}
    </section>
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
      className={`rounded-xl border px-3 py-3 text-left text-sm transition ${active
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
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </div>
      <div className="mt-1 truncate font-black text-zinc-200">{value}</div>
    </div>
  );
}
