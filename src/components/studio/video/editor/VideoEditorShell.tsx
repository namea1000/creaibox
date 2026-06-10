"use client";

import { useRef, useState, useEffect } from "react";

import { VideoEditorProvider } from "./VideoEditorContext";

import VideoEditorSidebar from "./VideoEditorSidebar";
import VideoEditorCanvas from "./VideoEditorCanvas";
import VideoEditorTimeline from "./VideoEditorTimeline";
import VideoEditorInspector from "./VideoEditorInspector";
import VideoEditorProjectPanel from "./VideoEditorProjectPanel";
import VideoEditorPlaybackController from "./VideoEditorPlaybackController";
import VideoEditorExportPanel from "./VideoEditorExportPanel";
import VideoEditorRenderCanvas, {
  type VideoEditorRenderCanvasRef,
} from "./VideoEditorRenderCanvas";

export default function VideoEditorShell() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#050507] flex items-center justify-center text-zinc-500 font-black">
        Loading CreAibox Video Studio...
      </div>
    );
  }

  return (
    <VideoEditorProvider>
      <VideoEditorWorkspace />
    </VideoEditorProvider>
  );
}

function VideoEditorWorkspace() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const renderCanvasRef = useRef<VideoEditorRenderCanvasRef | null>(null);

  const handleExportWebm = async () => {
    await renderCanvasRef.current?.exportWebm();
  };

  const handleExportMp4 = async (onProgress?: (progress: number) => void) => {
    await renderCanvasRef.current?.exportMp4(onProgress);
  };

  return (
    <>
      <VideoEditorPlaybackController />

      <div className="h-[calc(100vh-64px)] bg-[#000000] text-white p-1 flex flex-col gap-1 overflow-hidden select-none">
        <div className="flex h-full flex-col gap-1">
          {/* Top Panel: 4-Split Grid */}
          <div className="flex min-h-0 flex-[3] gap-1">
            {/* Column 1: Project Tree (FCP Event/Project Browser) */}
            <div className="w-[240px] shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl">
              <VideoEditorProjectPanel />
            </div>

            {/* Column 2: Resources & Media Library (CapCut Tabs Style) */}
            <div className="w-[330px] shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl">
              <VideoEditorSidebar />
            </div>

            {/* Column 3: Canvas / Player */}
            <div className="flex-1 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl">
              <VideoEditorCanvas onOpenExport={() => setIsExportOpen(true)} />
            </div>

            {/* Column 4: Right Inspector */}
            <div className="w-[360px] shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col min-h-0 shadow-2xl">
              <VideoEditorInspector onOpenExport={() => setIsExportOpen(true)} />
            </div>
          </div>

          {/* Bottom Panel: Timeline */}
          <div className="h-[320px] shrink-0 bg-[#1b1b1f] border border-white/5 flex flex-col shadow-2xl">
            <VideoEditorTimeline />
          </div>
        </div>
      </div>

      <VideoEditorRenderCanvas ref={renderCanvasRef} />

      <VideoEditorExportPanel
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportWebm={handleExportWebm}
        onExportMp4={handleExportMp4}
      />
    </>
  );
}