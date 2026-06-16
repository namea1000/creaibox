"use client";

import { useRef, useState } from "react";

import { VideoEditorProvider, useVideoEditor } from "./VideoEditorContext";

import VideoEditorCanvas from "./VideoEditorCanvas";
import VideoEditorTimeline from "./VideoEditorTimeline";
import VideoEditorInspector from "./VideoEditorInspector";
import VideoEditorUnifiedLibrary from "./VideoEditorUnifiedLibrary";
import VideoEditorPlaybackController from "./VideoEditorPlaybackController";
import VideoEditorExportPanel from "./VideoEditorExportPanel";
import VideoEditorRenderCanvas, {
  type VideoEditorRenderCanvasRef,
} from "./VideoEditorRenderCanvas";
import type { VideoExportOptions } from "./export/exportTypes";

const DEFAULT_PROJECT_PANEL_WIDTH = 240;
const DEFAULT_MEDIA_PANEL_WIDTH = 330;
const DEFAULT_INSPECTOR_PANEL_WIDTH = 360;
const DEFAULT_TIMELINE_HEIGHT = 320;

const MAX_MEDIA_PANEL_WIDTH = 560;
const MAX_INSPECTOR_PANEL_WIDTH = 560;
const MAX_TIMELINE_HEIGHT = 560;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function VideoEditorShell() {
  return (
    <VideoEditorProvider>
      <VideoEditorWorkspace />
    </VideoEditorProvider>
  );
}

function VideoEditorWorkspace() {
  const { processingClipId, processingMessage } = useVideoEditor();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [projectPanelWidth, setProjectPanelWidth] = useState(DEFAULT_PROJECT_PANEL_WIDTH);
  const [mediaPanelWidth, setMediaPanelWidth] = useState(DEFAULT_MEDIA_PANEL_WIDTH);
  const [inspectorPanelWidth, setInspectorPanelWidth] = useState(DEFAULT_INSPECTOR_PANEL_WIDTH);
  const [timelineHeight, setTimelineHeight] = useState(DEFAULT_TIMELINE_HEIGHT);
  const renderCanvasRef = useRef<VideoEditorRenderCanvasRef | null>(null);

  const handleExportWebCodecs = async (options?: VideoExportOptions) => {
    await renderCanvasRef.current?.exportWebCodecs(options);
  };

  const handleExportWebm = async (options?: VideoExportOptions) => {
    await renderCanvasRef.current?.exportWebm(options);
  };

  const handleExportMp4 = async (options?: VideoExportOptions) => {
    await renderCanvasRef.current?.exportMp4(options);
  };

  const handleExportDirectMp4 = async (options?: VideoExportOptions) => {
    await renderCanvasRef.current?.exportDirectMp4(options);
  };

  const handleExportAudioOnly = async (options?: VideoExportOptions) => {
    await renderCanvasRef.current?.exportAudioOnly(options);
  };

  const handleRenderSampleFrame = async (time: number, options?: VideoExportOptions) => {
    return (await renderCanvasRef.current?.renderSampleFrame(time, options)) ?? "";
  };

  const startHorizontalResize = (
    event: React.PointerEvent<HTMLDivElement>,
    options: {
      currentSize: number;
      minSize: number;
      maxSize: number;
      onResize: (size: number) => void;
      direction?: "normal" | "reverse";
    }
  ) => {
    event.preventDefault();
    const startX = event.clientX;
    const startSize = options.currentSize;
    const direction = options.direction === "reverse" ? -1 : 1;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: PointerEvent) => {
      const nextSize = startSize + (moveEvent.clientX - startX) * direction;
      options.onResize(clamp(nextSize, options.minSize, options.maxSize));
    };

    const handleUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const startTimelineResize = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = timelineHeight;

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: PointerEvent) => {
      const nextHeight = startHeight + (startY - moveEvent.clientY);
      setTimelineHeight(
        clamp(nextHeight, DEFAULT_TIMELINE_HEIGHT, MAX_TIMELINE_HEIGHT)
      );
    };

    const handleUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <>
      <VideoEditorPlaybackController />

      <div className="h-[calc(100vh-64px)] bg-[#000000] text-white p-1 flex flex-col gap-1 overflow-hidden select-none">
        <div className="flex h-full flex-col">
          {/* Top Panel: 4-Split Grid */}
          <div className="flex min-h-0 flex-1">
            {/* Combined Event & Resource Library (CapCut Style Unified Panel) */}
            <div
              className="shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl rounded-[6px] overflow-hidden"
              style={{ width: projectPanelWidth + mediaPanelWidth + 4 }}
            >
              <VideoEditorUnifiedLibrary
                projectPanelWidth={projectPanelWidth}
                mediaPanelWidth={mediaPanelWidth}
                onProjectPanelResize={setProjectPanelWidth}
              />
            </div>

            <ResizeDivider
              label="미디어 영역 너비 조절"
              onPointerDown={(event) =>
                startHorizontalResize(event, {
                  currentSize: mediaPanelWidth,
                  minSize: DEFAULT_MEDIA_PANEL_WIDTH,
                  maxSize: MAX_MEDIA_PANEL_WIDTH,
                  onResize: setMediaPanelWidth,
                })
              }
            />

            {/* Column 3: Canvas / Player */}
            <div className="min-w-0 flex-1 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl rounded-[6px] overflow-hidden">
              <VideoEditorCanvas onOpenExport={() => setIsExportOpen(true)} />
            </div>

            <ResizeDivider
              label="속성 영역 너비 조절"
              onPointerDown={(event) =>
                startHorizontalResize(event, {
                  currentSize: inspectorPanelWidth,
                  minSize: DEFAULT_INSPECTOR_PANEL_WIDTH,
                  maxSize: MAX_INSPECTOR_PANEL_WIDTH,
                  onResize: setInspectorPanelWidth,
                  direction: "reverse",
                })
              }
            />

            {/* Column 4: Right Inspector */}
            <div
              className="shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl rounded-[6px] overflow-hidden"
              style={{ width: inspectorPanelWidth }}
            >
              <VideoEditorInspector onOpenExport={() => setIsExportOpen(true)} />
            </div>
          </div>

          <div
            role="separator"
            aria-label="타임라인 영역 높이 조절"
            aria-orientation="horizontal"
            onPointerDown={startTimelineResize}
            className="group relative h-1 shrink-0 cursor-row-resize bg-black"
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/0 transition group-hover:bg-cyan-300/70" />
          </div>

          {/* Bottom Panel: Timeline */}
          <div
            className="shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col shadow-2xl rounded-[6px] overflow-hidden"
            style={{ height: timelineHeight }}
          >
            <VideoEditorTimeline />
          </div>
        </div>
      </div>

      <VideoEditorRenderCanvas ref={renderCanvasRef} />

      <VideoEditorExportPanel
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportWebCodecs={handleExportWebCodecs}
        onExportWebm={handleExportWebm}
        onExportMp4={handleExportMp4}
        onExportDirectMp4={handleExportDirectMp4}
        onExportAudioOnly={handleExportAudioOnly}
        onRenderSampleFrame={handleRenderSampleFrame}
      />

      {processingClipId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex flex-col items-center justify-center">
          <div className="bg-[#1e1e24]/90 border border-white/10 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-white/5" />
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">FFmpeg 작업 중</h3>
            <p className="text-sm text-zinc-400 font-bold">{processingMessage || "비디오를 처리하고 있습니다. 잠시만 기다려 주세요..."}</p>
          </div>
        </div>
      )}
    </>
  );
}

function ResizeDivider({
  label,
  onPointerDown,
}: {
  label: string;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      onPointerDown={onPointerDown}
      className="group relative w-1 shrink-0 cursor-col-resize bg-black"
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/0 transition group-hover:bg-cyan-300/70" />
    </div>
  );
}
