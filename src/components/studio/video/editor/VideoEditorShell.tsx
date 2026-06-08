"use client";

import { useRef, useState } from "react";

import { VideoEditorProvider } from "./VideoEditorContext";

import VideoEditorHeader from "./VideoEditorHeader";
import VideoEditorSidebar from "./VideoEditorSidebar";
import VideoEditorCanvas from "./VideoEditorCanvas";
import VideoEditorTimeline from "./VideoEditorTimeline";
import VideoEditorInspector from "./VideoEditorInspector";
import VideoEditorToolbar from "./VideoEditorToolbar";
import VideoEditorPlaybackController from "./VideoEditorPlaybackController";
import VideoEditorExportPanel from "./VideoEditorExportPanel";
import VideoEditorRenderCanvas, {
  type VideoEditorRenderCanvasRef,
} from "./VideoEditorRenderCanvas";

export default function VideoEditorShell() {
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

      <div className="h-[calc(100vh-64px)] bg-[#050507] text-white">
        <div className="flex h-full flex-col">
          <VideoEditorHeader onOpenExport={() => setIsExportOpen(true)} />

          <div className="flex min-h-0 flex-1">
            <VideoEditorSidebar />

            <main className="flex min-w-0 flex-1 flex-col">
              <VideoEditorToolbar />
              <VideoEditorCanvas />
              <VideoEditorTimeline />
            </main>

            <VideoEditorInspector onOpenExport={() => setIsExportOpen(true)} />
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