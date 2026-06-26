"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Smartphone,
  Square,
  Monitor,
  Download,
  Database,
  AlertTriangle,
} from "lucide-react";

import { useVideoEditor, type CanvasRatio } from "./VideoEditorContext";
import VideoEditorPreviewPlayer from "./VideoEditorPreviewPlayer";

const ASPECT_RATIO_OPTIONS: Array<{
  label: CanvasRatio;
  name: string;
  value: CanvasRatio;
}> = [
  { label: "16:9", name: "Widescreen", value: "16:9" },
  { label: "9:16", name: "Vertical", value: "9:16" },
  { label: "1:1", name: "Square", value: "1:1" },
  { label: "4:5", name: "Social Portrait", value: "4:5" },
  { label: "5:4", name: "Social Landscape", value: "5:4" },
  { label: "21:9", name: "Cinema", value: "21:9" },
  { label: "4:3", name: "Classic", value: "4:3" },
];

export default function VideoEditorCanvas({
  onOpenExport,
}: {
  onOpenExport?: () => void;
} = {}) {
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const ratioMenuRef = useRef<HTMLDivElement | null>(null);
  const [isRatioMenuOpen, setIsRatioMenuOpen] = useState(false);
  const [audioMeter, setAudioMeter] = useState({ low: 0, mid: 0, high: 0 });
  const [isClearing, setIsClearing] = useState(false);
  const {
    currentTime,
    totalDuration,
    isPlaying,
    canvasRatio,
    canvasZoom,
    setCanvasRatio,
    setCanvasZoom,
    togglePlayback,
    projectTitle,
    setProjectTitle,
    clearIndexedDBCache,
    isClearCacheOpen,
    setIsClearCacheOpen,
  } = useVideoEditor();

  const handleClearCache = async (mode: "smart" | "all") => {
    setIsClearing(true);
    try {
      await clearIndexedDBCache(mode);
      setIsClearCacheOpen(false);
      if (mode === "smart") {
        alert("현재 사용 중인 파일을 제외한 나머지 미사용 임시 캐시 용량이 성공적으로 정리되었습니다.");
      } else {
        alert("모든 브라우저 캐시 용량이 성공적으로 정리되었습니다. 타임라인 편집 구조와 자산 목록은 그대로 유지되며, 미디어 파일들은 '재연결'을 클릭해 언제든지 복원할 수 있습니다.");
      }
    } catch (err) {
      alert("용량 정리 중 오류가 발생했습니다: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsClearing(false);
    }
  };

  // Close IndexedDB cache cleaner panel on Escape key press
  useEffect(() => {
    if (!isClearCacheOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsClearCacheOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClearCacheOpen, setIsClearCacheOpen]);

  const canvasClass =
    canvasRatio === "16:9"
      ? "aspect-video w-full max-w-[1100px]"
      : canvasRatio === "9:16"
        ? "aspect-[9/16] h-full max-h-[620px]"
        : canvasRatio === "4:5"
          ? "aspect-[4/5] h-full max-h-[620px]"
          : canvasRatio === "5:4"
            ? "aspect-[5/4] w-full max-w-[900px]"
            : canvasRatio === "21:9"
              ? "aspect-[21/9] w-full max-w-[1180px]"
              : canvasRatio === "4:3"
                ? "aspect-[4/3] w-full max-w-[920px]"
                : "aspect-square h-full max-h-[620px]";

  const handleToggleFullscreen = () => {
    const target = previewFrameRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void target.requestFullscreen?.();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const handleAudioMeter = (event: Event) => {
      const customEvent = event as CustomEvent<{
        low: number;
        mid: number;
        high: number;
      }>;
      setAudioMeter({
        low: customEvent.detail.low,
        mid: customEvent.detail.mid,
        high: customEvent.detail.high,
      });
    };

    window.addEventListener("creaibox-video-editor-audio-meter", handleAudioMeter);
    return () => {
      window.removeEventListener("creaibox-video-editor-audio-meter", handleAudioMeter);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isRatioMenuOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (ratioMenuRef.current && !ratioMenuRef.current.contains(event.target as Node)) {
        setIsRatioMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isRatioMenuOpen]);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-transparent">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-[#202026] px-4 select-none">
        <div className="flex items-center gap-3">
          <input
            value={projectTitle}
            onChange={(event) => setProjectTitle(event.target.value)}
            className="h-8 w-[140px] rounded-md border border-transparent bg-transparent py-1 px-1.5 text-xs font-bold text-white outline-none focus:bg-white/5 focus:border-white/10"
            placeholder="프로젝트 이름"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={ratioMenuRef}>
            <button
              type="button"
              onClick={() => setIsRatioMenuOpen((value) => !value)}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/20 px-2.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-cyan-400 hover:text-cyan-100"
            >
              가로세로 비율
              <ChevronDown size={13} />
            </button>

            {isRatioMenuOpen && (
              <div className="absolute right-0 top-9 z-50 w-44 border border-white/10 bg-[#17171b] py-1 shadow-2xl">
                {ASPECT_RATIO_OPTIONS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCanvasRatio(item.value);
                      setIsRatioMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-white/5 ${
                      canvasRatio === item.value ? "text-cyan-200" : "text-zinc-400"
                    }`}
                  >
                    <span className="font-black">{item.label}</span>
                    <span className="text-[10px] text-zinc-600">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <RatioButton
            icon={Monitor}
            label="16:9"
            active={canvasRatio === "16:9"}
            onClick={() => setCanvasRatio("16:9")}
          />
          <RatioButton
            icon={Smartphone}
            label="9:16"
            active={canvasRatio === "9:16"}
            onClick={() => setCanvasRatio("9:16")}
          />
          <RatioButton
            icon={Square}
            label="1:1"
            active={canvasRatio === "1:1"}
            onClick={() => setCanvasRatio("1:1")}
          />
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 rounded-md bg-cyan-400 hover:bg-cyan-300 px-3 py-1.5 text-xs font-black text-black ml-2 shadow-[0_0_10px_rgba(34,211,238,0.25)] transition outline-none"
            >
              <Download size={13} className="shrink-0" />
              내보내기
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className={canvasClass}
          style={{
            transform: `scale(${canvasZoom / 100})`,
          }}
        >
          <div
            ref={previewFrameRef}
            className="relative h-full w-full overflow-hidden rounded-none border border-white/10 bg-black shadow-2xl"
          >
            <VideoEditorPreviewPlayer />

            <div className="pointer-events-none absolute inset-8 rounded-none border border-dashed border-white/10" />
          </div>
        </div>
      </div>

      <div className="relative h-9 shrink-0 border-t border-white/5 bg-[#151519] px-3 text-[10px] text-zinc-500">
        <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 font-mono text-cyan-300">
          <span>{formatTimecode(currentTime)}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-500">{formatTimecode(totalDuration)}</span>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md text-zinc-200 hover:bg-white/10 hover:text-cyan-200"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="pointer-events-none absolute left-[calc(50%+34px)] top-1/2 flex -translate-y-1/2 items-center justify-center">
          <AudioLevelMeter
            low={isPlaying ? audioMeter.low : 0}
            mid={isPlaying ? audioMeter.mid : 0}
            high={isPlaying ? audioMeter.high : 0}
          />
        </div>

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom - 10)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Minus size={13} />
          </button>
          <span className="w-10 text-center text-xs font-bold text-zinc-300">{canvasZoom}%</span>
          <button
            type="button"
            onClick={() => setCanvasZoom(canvasZoom + 10)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            onClick={() => setCanvasZoom(100)}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <RotateCcw size={13} />
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:border-cyan-400 hover:text-cyan-200"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {isClearCacheOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#121214] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                <Database size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black text-white">IndexedDB 브라우저 캐시 용량 정리</h3>
                
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  비디오 편집 중 브라우저 로컬 저장소에 쌓인 대용량 파일 데이터(IndexedDB 캐시)를 안전하게 정돈하여 
                  <strong>컴퓨터 하드디스크의 보이지 않는 용량을 즉각 확보</strong>합니다. 원하시는 정리 수준을 선택해 주세요.
                </p>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Smart Clean */}
                  <div className="flex flex-col rounded-lg border border-cyan-500/30 bg-cyan-950/10 p-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 rounded bg-cyan-400/20 border border-cyan-400/30 px-1 py-0.5 text-[8px] font-black text-cyan-300">
                      추천 (안전)
                    </div>
                    <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1">
                      ✨ 스마트 정리
                    </h4>
                    <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 flex-1">
                      현재 타임라인에 올려서 편집 중인 동영상/오디오 파일은 <strong>그대로 안전하게 보존</strong>하고, 이전에 삭제했던 미사용 파일이나 옛날 프로젝트의 찌꺼기 파일들만 선별하여 깨끗이 지웁니다.
                    </p>
                    <div className="mt-3 text-[9px] text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-500/20 whitespace-nowrap text-center">
                      ✅ 현재 작업 중인 영상에 영향 없음 (재연결 필요 없음)
                    </div>
                    <button
                      type="button"
                      disabled={isClearing}
                      onClick={() => handleClearCache("smart")}
                      className="mt-4 w-full rounded-md bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-800 text-black px-3 py-2 text-xs font-black transition outline-none"
                    >
                      {isClearing ? "정리 중..." : "스마트 정리 시작"}
                    </button>
                  </div>

                  {/* Option B: Deep Clean */}
                  <div className="flex flex-col rounded-lg border border-red-500/20 bg-red-950/5 p-4 relative">
                    <h4 className="text-xs font-black text-red-400 flex items-center gap-1">
                      🔥 전체 비우기
                    </h4>
                    <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 flex-1">
                      <strong>타임라인 편집선(자르고 붙인 위치, 효과, 텍스트)은 100% 완벽 보존</strong>하되, 로컬에 임시 복사된 모든 미디어 데이터 파일들만 완전 삭제하여 하드 용량을 최대로 확보합니다.
                    </p>
                    <div className="mt-3 text-[9px] text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20 whitespace-nowrap text-center">
                      ⚠️ 다음 편집 시 파일 <strong>'재연결'</strong>을 클릭해 원본을 올려주면 즉시 복원
                    </div>
                    <button
                      type="button"
                      disabled={isClearing}
                      onClick={() => handleClearCache("all")}
                      className="mt-4 w-full rounded-md border border-red-500/30 hover:border-red-500/50 hover:bg-red-950/20 text-red-400 px-3 py-2 text-xs font-bold transition outline-none"
                    >
                      {isClearing ? "비우는 중..." : "전체 비우기 시작"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsClearCacheOpen(false)}
                    className="rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-400 transition outline-none"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AudioLevelMeter({
  low,
  mid,
  high,
}: {
  low: number;
  mid: number;
  high: number;
}) {
  return (
    <div className="flex h-7 items-end gap-1.5 rounded-md px-2">
      <MeterBar value={low} className="bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" />
      <MeterBar value={mid} className="bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.85)]" />
      <MeterBar value={high} className="bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.85)]" />
    </div>
  );
}

function MeterBar({ value, className }: { value: number; className: string }) {
  const height = Math.max(1, Math.min(26, 1 + value * 27));

  return (
    <span
      className={`w-1 rounded-full transition-[height] duration-75 ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}

function formatTimecode(value: number) {
  const fps = 30;
  const safeValue = Math.max(0, value);
  const hours = Math.floor(safeValue / 3600);
  const minutes = Math.floor((safeValue % 3600) / 60);
  const seconds = Math.floor(safeValue % 60);
  const frames = Math.floor((safeValue % 1) * fps);

  return [hours, minutes, seconds, frames]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

function RatioButton({
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
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition outline-none ${active
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-300"
        }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}