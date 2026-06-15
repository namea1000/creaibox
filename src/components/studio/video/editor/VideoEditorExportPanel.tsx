"use client";

import {
  X,
  Download,
  Film,
  Monitor,
  Clock,
  Gauge,
  AlertCircle,
  ChevronDown,
  Database,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  Folder,
  Check,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EXPORT_FPS_OPTIONS,
  EXPORT_QUALITY_OPTIONS,
  EXPORT_RESOLUTION_OPTIONS,
} from "./constants";
import { useVideoEditor, type CanvasRatio, type VideoEditorClip } from "./VideoEditorContext";
import {
  formatBitrate,
  getDeviceCapabilityHint,
  getEstimatedFrameCount,
  getExportLoadLevel,
  getRecommendedVideoBitrate,
} from "./export/exportBitratePresets";
import { VIDEO_EXPORT_ENGINES } from "./export/exportPresets";
import {
  cancelExportJob,
  cancelQueuedRenderJob,
  completeExportJob,
  enqueueRenderJob,
  failExportJob,
  attachExportRecordToRenderJob,
  retryRenderQueueJob,
  startExportJob,
  updateExportJobMessage,
  updateExportJobProgress,
  useExportJob,
  useRenderQueue,
  type VideoRenderQueueItem,
} from "./export/exportJobStore";
import {
  buildOutputFileName,
  createVideoProjectExportRecord,
  fetchRecentVideoProjectExportRecords,
  updateVideoProjectExportRecord,
  type VideoProjectExportRecord,
} from "./export/exportMetadataStore";
import {
  detectStaticWorkerSupport,
  runExportWorkerPreflight,
  type ExportWorkerSupport,
} from "./export/exportWorkerSupport";
import {
  detectWebCodecsSupport,
  type WebCodecsSupport,
} from "./export/webCodecsSupport";
import {
  detectWebGLEffectsSupport,
  type WebGLEffectsSupport,
} from "./render/webglEffectsRenderer";
import {
  detectWebGPURendererSupport,
  type WebGPURendererSupport,
} from "./render/webgpuRenderer";
import {
  runRenderPreflight,
  type RenderPreflightInput,
  type RenderPreflightResult,
} from "./export/renderPreflight";
import {
  formatEstimatedRenderTime,
  runExportBenchmark,
  type ExportBenchmarkInput,
  type ExportBenchmarkResult,
} from "./export/exportBenchmark";
import {
  assess4kExportPolicy,
  formatFileSize,
  getExportFailureGuidance,
  type Export4kFallbackAction,
  type Export4kPolicyResult,
} from "./export/export4kPolicy";
import { buildRenderJobSnapshot } from "./export/renderJobSnapshot";
import {
  collectAudioMixSources,
  renderOfflineAudioMixdown,
} from "./export/audioMixdown";
import type {
  VideoExportEngine,
  VideoExportOptions,
} from "./export/exportTypes";
import type { ExportFps, ExportQuality, ExportResolution } from "./types";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "알 수 없는 오류";
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function VideoEditorExportPanel({
  open,
  onClose,
  onExportWebCodecs,
  onExportWebm,
  onExportMp4,
  onExportDirectMp4,
  onExportAudioOnly,
  onRenderSampleFrame,
}: {
  open: boolean;
  onClose: () => void;
  onExportWebCodecs: (options?: VideoExportOptions) => Promise<void>;
  onExportWebm: (options?: VideoExportOptions) => Promise<void>;
  onExportMp4: (options?: VideoExportOptions) => Promise<void>;
  onExportDirectMp4: (options?: VideoExportOptions) => Promise<void>;
  onExportAudioOnly: (options?: VideoExportOptions) => Promise<void>;
  onRenderSampleFrame: (time: number, options?: VideoExportOptions) => Promise<string>;
}) {
  const {
    projectTitle,
    mediaItems,
    tracks,
    clips,
    totalDuration,
    exportResolution,
    exportFps,
    exportQuality,
    canvasRatio,
    setExportResolution,
    setExportFps,
    setExportQuality,
    currentTime,
  } = useVideoEditor();
  const [selectedEngine, setSelectedEngine] = useState<VideoExportEngine>("direct-mp4");
  const exportJob = useExportJob();
  const renderQueue = useRenderQueue();
  const isExporting = exportJob.status === "running";
  const exportProgress = exportJob.progress;
  const [webCodecsSupport, setWebCodecsSupport] =
    useState<WebCodecsSupport | null>(null);
  const [workerSupport, setWorkerSupport] = useState<ExportWorkerSupport | null>(() =>
    detectStaticWorkerSupport()
  );
  const [webglEffectsSupport, setWebglEffectsSupport] =
    useState<WebGLEffectsSupport | null>(null);
  const [webgpuRendererSupport, setWebgpuRendererSupport] =
    useState<WebGPURendererSupport | null>(null);
  const [preflightResult, setPreflightResult] =
    useState<RenderPreflightResult | null>(null);
  const [isPreflighting, setIsPreflighting] = useState(false);
  const [benchmarkResult, setBenchmarkResult] =
    useState<ExportBenchmarkResult | null>(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [recentExportRecords, setRecentExportRecords] = useState<VideoProjectExportRecord[]>([]);
  const [exportHistoryStatus, setExportHistoryStatus] = useState("DB 기록 확인 전");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewTime, setPreviewTime] = useState(0);
  const [mixedAudioBuffer, setMixedAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // New CapCut export options states
  const [exportFileName, setExportFileName] = useState<string>(() => projectTitle);
  const [exportFolderPath, setExportFolderPath] = useState<string>("기본 다운로드 폴더");
  const [exportDirectoryHandle, setExportDirectoryHandle] = useState<any | null>(null);
  const [exportVideoEnabled, setExportVideoEnabled] = useState<boolean>(true);
  const [exportAudioEnabled, setExportAudioEnabled] = useState<boolean>(false);
  const [audioExportFormat, setAudioExportFormat] = useState<"mp3" | "wav" | "aac">("mp3");
  const [exportVideoFormat, setExportVideoFormat] = useState<"mp4" | "mov">("mp4");
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState<boolean>(false);

  // Sync exportFileName with projectTitle
  useEffect(() => {
    setExportFileName(projectTitle);
  }, [projectTitle]);

  const handleSelectFolder = async () => {
    try {
      if ("showDirectoryPicker" in window) {
        const handle = await (window as any).showDirectoryPicker({ startIn: "downloads" });
        setExportDirectoryHandle(handle);
        setExportFolderPath(handle.name);
      } else {
        alert("이 브라우저는 폴더 지정을 지원하지 않습니다. 파일은 브라우저 기본 다운로드 폴더에 저장됩니다.");
      }
    } catch (err) {
      console.warn("Folder picker error or cancelled:", err);
    }
  };
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isProcessingQueueRef = useRef(false);
  const lastDbProgressRef = useRef<Map<string, number>>(new Map());

  const usesWebGLEffects = clips.some(hasExportWebGLEffect);

  const isVisualizerFastPath =
    clips.some((c) => c.type === "visualizer") &&
    !clips.some((c) => c.type === "video");

  const createPreflightInput = useCallback((overrides?: {
    engine?: VideoExportEngine;
    resolution?: ExportResolution;
    fps?: ExportFps;
    quality?: ExportQuality;
    duration?: number;
  }): RenderPreflightInput => {
    const resolution = overrides?.resolution ?? exportResolution;
    const fps = overrides?.fps ?? exportFps;
    const quality = overrides?.quality ?? exportQuality;
    const size = getExportSize(resolution, canvasRatio);

    return {
      engine: overrides?.engine ?? selectedEngine,
      resolution,
      fps,
      quality,
      duration: overrides?.duration ?? totalDuration,
      canvasRatio,
      width: size.width,
      height: size.height,
      bitrate: getRecommendedVideoBitrate({ resolution, fps, quality }),
      hasAudio: clips.some((clip) => clip.type === "audio" || clip.type === "video"),
      hasVideo: clips.some((clip) => clip.type !== "audio"),
      usesWebGLEffects,
      isVisualizerFastPath,
    };
  }, [
    canvasRatio,
    clips,
    exportFps,
    exportQuality,
    exportResolution,
    selectedEngine,
    totalDuration,
    usesWebGLEffects,
    isVisualizerFastPath,
  ]);

  const createBenchmarkInput = useCallback((overrides?: {
    engine?: VideoExportEngine;
    resolution?: ExportResolution;
    fps?: ExportFps;
    quality?: ExportQuality;
    duration?: number;
  }): ExportBenchmarkInput => {
    const preflightInput = createPreflightInput(overrides);

    return {
      engine: preflightInput.engine,
      resolution: preflightInput.resolution,
      fps: preflightInput.fps,
      quality: preflightInput.quality,
      duration: preflightInput.duration,
      canvasRatio: preflightInput.canvasRatio,
      width: preflightInput.width,
      height: preflightInput.height,
      hasAudio: preflightInput.hasAudio,
      hasVideo: preflightInput.hasVideo,
      usesWebGLEffects: preflightInput.usesWebGLEffects,
    };
  }, [createPreflightInput]);

  const executePreflight = useCallback(async (input: RenderPreflightInput) => {
    setIsPreflighting(true);
    try {
      const result = await runRenderPreflight(input);
      setPreflightResult(result);
      setWorkerSupport(result.capabilities.worker);
      return result;
    } finally {
      setIsPreflighting(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setMixedAudioBuffer(null);
      stopAudio();
      return;
    }

    const audioClips = clips.filter((c) => c.type === "audio" || c.type === "video");
    if (audioClips.length === 0) {
      setMixedAudioBuffer(null);
      return;
    }

    let active = true;
    setIsAudioLoading(true);

    const loadAudio = async () => {
      try {
        const sources = collectAudioMixSources({ clips, mediaItems });
        if (sources.length === 0) {
          if (active) {
            setMixedAudioBuffer(null);
            setIsAudioLoading(false);
          }
          return;
        }
        const mixdownResult = await renderOfflineAudioMixdown({
          sources,
          duration: totalDuration,
        });
        if (active) {
          setMixedAudioBuffer(mixdownResult.audioBuffer);
        }
      } catch (err) {
        console.error("[VideoExport] Preview audio mixdown failed:", err);
      } finally {
        if (active) {
          setIsAudioLoading(false);
        }
      }
    };

    void loadAudio();

    return () => {
      active = false;
    };
  }, [open, clips, mediaItems, totalDuration, stopAudio]);

  useEffect(() => {
    if (!isPlayingPreview) {
      setPreviewTime(currentTime ?? 0);
    }
  }, [currentTime, isPlayingPreview]);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    void detectWebCodecsSupport().then((support) => {
      if (isMounted) setWebCodecsSupport(support);
    });
    void Promise.resolve().then(() => {
      if (!isMounted) return;
      setWebglEffectsSupport(detectWebGLEffectsSupport());
      setWebgpuRendererSupport(detectWebGPURendererSupport());
    });

    return () => {
      isMounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!isExporting) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isExporting]);

  const refreshExportHistory = useCallback(async () => {
    const result = await fetchRecentVideoProjectExportRecords();
    setRecentExportRecords(result.records);
    setExportHistoryStatus(
      result.skippedReason
        ? `DB 기록: ${result.skippedReason}`
        : `DB 기록 ${result.records.length}개`
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeoutId = window.setTimeout(() => {
      void refreshExportHistory();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [open, refreshExportHistory]);

  useEffect(() => {
    setPreviewImageUrl(null);
  }, [selectedEngine, exportResolution, exportFps, exportQuality, canvasRatio, currentTime]);

  useEffect(() => {
    if (!isPlayingPreview) return;

    let active = true;
    let playStartedAt = performance.now();
    let initialOffset = previewTime;
    const targetFps = 12; // 12fps
    const frameTime = 1000 / targetFps;

    const playAudio = (startTimeOffset: number) => {
      if (!mixedAudioBuffer) return;
      
      stopAudio();

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createBufferSource();
      source.buffer = mixedAudioBuffer;
      source.connect(ctx.destination);
      
      source.start(0, Math.max(0, startTimeOffset));
      audioSourceRef.current = source;
    };

    if (mixedAudioBuffer) {
      playAudio(initialOffset);
    }

    const runLoop = async () => {
      while (active) {
        const started = performance.now();
        
        // Calculate dynamic current playback time based on elapsed wall-clock time
        const now = performance.now();
        const elapsed = (now - playStartedAt) / 1000;
        let localTime = initialOffset + elapsed;
        
        if (localTime >= totalDuration) {
          // Loop playback
          localTime = 0;
          playStartedAt = now;
          initialOffset = 0;
          if (mixedAudioBuffer) {
            playAudio(0);
          }
        }
        
        try {
          const size = getExportSize(exportResolution, canvasRatio);
          const preflight = preflightResult || await executePreflight(createPreflightInput());
          const benchmark = benchmarkResult || await runExportBenchmark(createBenchmarkInput(), { sampleFrames: 10 });
          
          const snapshot = buildRenderJobSnapshot({
            context: {
              projectTitle,
              clips,
              mediaItems,
              tracks,
              totalDuration,
              canvasRatio,
            },
            options: {
              engine: selectedEngine,
              resolution: exportResolution,
              fps: exportFps,
              quality: exportQuality,
              width: size.width,
              height: size.height,
            },
            preflight,
            benchmark,
          });

          const url = await onRenderSampleFrame(localTime, {
            resolution: exportResolution,
            fps: exportFps,
            quality: exportQuality,
            snapshot,
          });

          if (active) {
            setPreviewImageUrl(url);
            setPreviewTime(localTime);
          }
        } catch (err) {
          console.error("[VideoExport] preview playback frame failed:", err);
        }

        const duration = performance.now() - started;
        const delay = Math.max(0, frameTime - duration);
        if (active) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    void runLoop();

    return () => {
      active = false;
      stopAudio();
    };
  }, [
    isPlayingPreview,
    totalDuration,
    exportResolution,
    exportFps,
    exportQuality,
    canvasRatio,
    selectedEngine,
    clips,
    mediaItems,
    tracks,
    projectTitle,
    onRenderSampleFrame,
    preflightResult,
    benchmarkResult,
    createPreflightInput,
    createBenchmarkInput,
    mixedAudioBuffer,
    stopAudio,
  ]);

  const handleGeneratePreviewFrame = async () => {
    setIsPreviewLoading(true);
    try {
      const size = getExportSize(exportResolution, canvasRatio);
      const preflight = preflightResult || await executePreflight(createPreflightInput());
      const benchmark = benchmarkResult || await runExportBenchmark(createBenchmarkInput(), { sampleFrames: 10 });

      const snapshot = buildRenderJobSnapshot({
        context: {
          projectTitle,
          clips,
          mediaItems,
          tracks,
          totalDuration,
          canvasRatio,
        },
        options: {
          engine: selectedEngine,
          resolution: exportResolution,
          fps: exportFps,
          quality: exportQuality,
          width: size.width,
          height: size.height,
        },
        preflight,
        benchmark,
      });

      const url = await onRenderSampleFrame(currentTime, {
        resolution: exportResolution,
        fps: exportFps,
        quality: exportQuality,
        snapshot,
      });
      setPreviewImageUrl(url);
    } catch (error) {
      console.error("[VideoExport] failed to render preview frame:", error);
      window.alert(`프레임 프리뷰 생성 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const selectedQualityLabel =
    EXPORT_QUALITY_OPTIONS.find((item) => item.value === exportQuality)?.label || "표준";

  const selectedResolutionDesc =
    EXPORT_RESOLUTION_OPTIONS.find((item) => item.value === exportResolution)?.desc || "";
  const recommendedBitrate = getRecommendedVideoBitrate({
    resolution: exportResolution,
    fps: exportFps,
    quality: exportQuality,
  });
  const estimatedFrameCount = getEstimatedFrameCount(totalDuration, exportFps);
  const exportLoadLevel = getExportLoadLevel({
    resolution: exportResolution,
    fps: exportFps,
    duration: totalDuration,
  });
  const deviceCapability = getDeviceCapabilityHint();
  const showPerformanceWarning =
    exportLoadLevel === "high" ||
    exportLoadLevel === "extreme" ||
    (deviceCapability === "low" && (exportResolution === "2k" || exportResolution === "4k" || exportFps === 60));
  const basicResolutionOptions = EXPORT_RESOLUTION_OPTIONS.filter(
    (item) => item.value === "720p" || item.value === "1080p"
  );
  const advancedResolutionOptions = EXPORT_RESOLUTION_OPTIONS.filter(
    (item) => item.value === "2k" || item.value === "4k"
  );
  const basicFpsOptions = EXPORT_FPS_OPTIONS.filter((item) => item.value !== 60);
  const advancedFpsOptions = EXPORT_FPS_OPTIONS.filter((item) => item.value === 60);
  const hasAudioSource = clips.some(
    (clip) => clip.type === "audio" || clip.type === "video"
  );
  const fastWebCodecsReady =
    preflightResult?.capabilities.webCodecs.supported === true &&
    selectedEngine === "fast-webcodecs";
  const webCodecsConfig = preflightResult?.capabilities.webCodecs;
  const audioEncoderConfig = preflightResult?.capabilities.audioEncoder;
  const directMp4Config = preflightResult?.capabilities.directMp4;
  const isExperimentalWebCodecs =
    selectedEngine === "fast-webcodecs" &&
    (exportResolution === "2k" || exportResolution === "4k" || exportFps !== 30);
  const canUseWebCodecsWorker =
    selectedEngine === "fast-webcodecs" &&
    workerSupport?.supported === true &&
    workerSupport.offscreenCanvas;
  const selectedEngineAudioMode =
    selectedEngine === "fast-webcodecs" ? "Video only" : "Audio mix";
  const selectedMimeType =
    preflightResult?.capabilities.mediaRecorder.selectedMimeType || "확인 전";
  const estimatedRenderTimeLabel = benchmarkResult
    ? formatEstimatedRenderTime(benchmarkResult.estimatedRenderSeconds)
    : "계산 중";
  const exportSize = getExportSize(exportResolution, canvasRatio);
  const estimatedFileSizeLabel = formatFileSize(
    Math.round((recommendedBitrate * Math.max(0, totalDuration)) / 8)
  );
  const fourKPolicy = assess4kExportPolicy({
    engine: selectedEngine,
    resolution: exportResolution,
    fps: exportFps,
    quality: exportQuality,
    duration: totalDuration,
    width: exportSize.width,
    height: exportSize.height,
    bitrate: recommendedBitrate,
    preflight: preflightResult,
    benchmark: benchmarkResult,
  });

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      void runRenderPreflight(createPreflightInput()).then((result) => {
        if (!isMounted) return;
        setPreflightResult(result);
        setWorkerSupport(result.capabilities.worker);
      });
    }, 120);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [createPreflightInput, open]);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      setIsBenchmarking(true);
      void runExportBenchmark(createBenchmarkInput(), { sampleFrames: 10 })
        .then((result) => {
          if (isMounted) setBenchmarkResult(result);
        })
        .finally(() => {
          if (isMounted) setIsBenchmarking(false);
        });
    }, 220);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [createBenchmarkInput, open]);

  const processQueueItem = useCallback(async (job: VideoRenderQueueItem) => {
    const { controller } = startExportJob(job.engine, job.id);
    abortControllerRef.current = controller;
    setSelectedEngine(job.engine);
    const exportRecordId = job.exportRecordId;
    const outputFileName = buildOutputFileName(job);

    try {
      const renderingUpdate = await updateVideoProjectExportRecord(exportRecordId, {
        status: "rendering",
        progress: 1,
        outputFileName,
      });
      if (!renderingUpdate.saved && exportRecordId) {
        console.warn("[VideoExport] export record rendering update skipped:", renderingUpdate.reason);
      }

      const renderPreflight = job.snapshot?.preflight ?? await executePreflight(
        createPreflightInput({
          engine: job.engine,
          resolution: job.resolution,
          fps: job.fps,
          quality: job.quality,
          duration: job.duration,
        })
      );

      if (!renderPreflight.canRender) {
        throw new Error(`Preflight 차단: ${renderPreflight.blockingReasons.join(" ")}`);
      }

      const preflight = await runExportWorkerPreflight();
      setWorkerSupport(preflight);
      if (controller.signal.aborted) {
        throw new DOMException("Export cancelled", "AbortError");
      }

      updateExportJobMessage({
        stage: "worker-preflight",
        progress: 2,
        message: preflight.supported
          ? preflight.offscreenCanvas
            ? "Worker와 OffscreenCanvas를 사용할 수 있습니다. 현재 렌더는 안전한 메인 스레드 경로로 실행합니다."
            : "Worker는 사용할 수 있지만 OffscreenCanvas가 없어 메인 스레드 렌더로 fallback합니다."
          : `Worker preflight 실패: ${preflight.reason} 메인 스레드 렌더로 fallback합니다.`,
      });

      if (job.engine === "fast-webcodecs" && clips.some((clip) => clip.type === "audio" || clip.type === "video")) {
        updateExportJobMessage({
          stage: "encoding-webcodecs",
          progress: 3,
          message: "Fast WebCodecs는 현재 video-only입니다. 오디오 포함 파일이 필요하면 Quick WebM 또는 MP4를 사용하세요.",
        });
      }

      const options: VideoExportOptions = {
        signal: controller.signal,
        onProgress: (progress) => {
          updateExportJobProgress(progress);
          const roundedProgress = Math.round(progress.progress);
          const lastSyncedProgress = lastDbProgressRef.current.get(job.id);
          if (
            exportRecordId &&
            shouldSyncExportProgress(roundedProgress) &&
            lastSyncedProgress !== roundedProgress
          ) {
            lastDbProgressRef.current.set(job.id, roundedProgress);
            void updateVideoProjectExportRecord(exportRecordId, {
              status: "rendering",
              progress: roundedProgress,
              outputFileName,
            });
          }
        },
        resolution: job.resolution,
        fps: job.fps,
        quality: job.quality,
        snapshot: job.snapshot,
        fileName: (job as any).fileName,
        directoryHandle: (job as any).directoryHandle,
        audioFormat: (job as any).audioFormat,
        videoFormat: (job as any).videoFormat,
      };

      if (job.engine === "audio-only") {
        await onExportAudioOnly(options);
      } else if (job.engine === "fast-webcodecs") {
        await onExportWebCodecs(options);
      } else if (job.engine === "quick-webm") {
        await onExportWebm(options);
      } else if (job.engine === "direct-mp4") {
        await onExportDirectMp4(options);
      } else {
        await onExportMp4(options);
      }
      completeExportJob({
        stage: "completed",
        progress: 100,
        message: "내보내기가 완료되었습니다.",
      });
      if (exportRecordId) {
        void updateVideoProjectExportRecord(exportRecordId, {
          status: "completed",
          progress: 100,
          outputFileName,
        }).then(() => refreshExportHistory());
      }
    } catch (error: unknown) {
      if (isAbortError(error)) {
        cancelExportJob("내보내기가 취소되었습니다.");
        if (exportRecordId) {
          void updateVideoProjectExportRecord(exportRecordId, {
            status: "canceled",
            progress: 0,
            outputFileName,
          }).then(() => refreshExportHistory());
        }
        return;
      }

      failExportJob(getErrorMessage(error));
      if (exportRecordId) {
        void updateVideoProjectExportRecord(exportRecordId, {
          status: "failed",
          progress: 0,
          outputFileName,
        }).then(() => refreshExportHistory());
      }
      window.alert(
        `${job.engine === "compatible-mp4" || job.engine === "direct-mp4" ? "MP4" : "WebM"} 내보내기 실패: ${getErrorMessage(error)}\n\n${getExportFailureGuidance(error)}`
      );
    } finally {
      abortControllerRef.current = null;
    }
  }, [clips, createPreflightInput, executePreflight, onExportDirectMp4, onExportMp4, onExportWebCodecs, onExportWebm, refreshExportHistory]);

  useEffect(() => {
    if (isProcessingQueueRef.current || isExporting) return;
    const nextJob = [...renderQueue].reverse().find((item) => item.status === "pending");
    if (!nextJob) return;

    isProcessingQueueRef.current = true;
    const timeoutId = window.setTimeout(() => {
      void processQueueItem(nextJob).finally(() => {
        isProcessingQueueRef.current = false;
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      isProcessingQueueRef.current = false;
    };
  }, [isExporting, processQueueItem, renderQueue]);

  const handleEnqueueExport = async () => {
    if (!exportVideoEnabled && !exportAudioEnabled) {
      window.alert("내보낼 대상을 선택해 주세요 (동영상 또는 오디오).");
      return;
    }

    const preflight = await executePreflight(createPreflightInput());

    if (exportVideoEnabled && !preflight.canRender) {
      window.alert(`내보내기를 시작할 수 없습니다.\n\n${preflight.blockingReasons.join("\n")}`);
      return;
    }

    const benchmark = await runExportBenchmark(createBenchmarkInput(), { sampleFrames: 10 });
    setBenchmarkResult(benchmark);
    const size = getExportSize(exportResolution, canvasRatio);

    if (exportVideoEnabled) {
      const snapshot = buildRenderJobSnapshot({
        context: {
          projectTitle,
          clips,
          mediaItems,
          tracks,
          totalDuration,
          canvasRatio,
        },
        options: {
          engine: "direct-mp4",
          resolution: exportResolution,
          fps: exportFps,
          quality: exportQuality,
          width: size.width,
          height: size.height,
        },
        preflight,
        benchmark,
      });

      const queuedJob = enqueueRenderJob({
        projectTitle: exportFileName || projectTitle,
        engine: "direct-mp4",
        resolution: exportResolution,
        fps: exportFps,
        quality: exportQuality,
        duration: totalDuration,
        snapshot,
        preflight,
        benchmark,
        estimatedSeconds: benchmark.estimatedRenderSeconds,
        fileName: exportFileName,
        directoryHandle: exportDirectoryHandle,
        videoFormat: exportVideoFormat,
      } as any);

      const createdRecord = await createVideoProjectExportRecord(queuedJob);
      if (createdRecord.saved) {
        attachExportRecordToRenderJob(queuedJob.id, createdRecord.record.id);
        void refreshExportHistory();
      }
    }

    if (exportAudioEnabled) {
      const queuedJob = enqueueRenderJob({
        projectTitle: exportFileName ? `${exportFileName}_audio` : `${projectTitle}_audio`,
        engine: "audio-only",
        resolution: exportResolution,
        fps: exportFps,
        quality: exportQuality,
        duration: totalDuration,
        estimatedSeconds: 2,
        fileName: exportFileName ? `${exportFileName}_audio` : undefined,
        directoryHandle: exportDirectoryHandle,
        audioFormat: audioExportFormat,
      } as any);

      const createdRecord = await createVideoProjectExportRecord(queuedJob);
      if (createdRecord.saved) {
        attachExportRecordToRenderJob(queuedJob.id, createdRecord.record.id);
        void refreshExportHistory();
      }
    }
  };

  const handleCancelExport = () => {
    abortControllerRef.current?.abort();
    cancelExportJob("내보내기 취소를 요청했습니다.");
  };

  const handleCancelQueuedExport = (item: VideoRenderQueueItem) => {
    cancelQueuedRenderJob(item.id);
    if (item.exportRecordId) {
      void updateVideoProjectExportRecord(item.exportRecordId, {
        status: "canceled",
        progress: 0,
        outputFileName: buildOutputFileName(item),
      }).then(() => refreshExportHistory());
    }
  };

  const activeQueueItems = renderQueue.slice(0, 5);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#101014] text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-black">내보내기</h2>
            <p className="text-xs text-zinc-500">
              현재 편집 프로젝트를 영상 또는 오디오 파일로 저장합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[400px_1fr] overflow-y-auto flex-1 min-h-0">
          {/* Left Column: Preview */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-white/5 bg-zinc-950/20 p-3">
              <div className="mb-2 flex items-center justify-between font-black text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Monitor size={13} className="text-cyan-400" />
                  프레임 프리뷰
                  {isAudioLoading && (
                    <span className="ml-1 flex items-center gap-1 text-[9px] text-zinc-500 font-normal">
                      <Volume2 size={10} className="animate-pulse text-cyan-400" />
                      믹싱...
                    </span>
                  )}
                  {!isAudioLoading && mixedAudioBuffer && (
                    <span title="오디오 프리뷰 재생 가능">
                      <Volume2 size={10} className="ml-1 text-cyan-400" />
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {isPlayingPreview ? previewTime.toFixed(2) : (currentTime ?? 0).toFixed(2)}s
                </span>
              </div>

              <div className="relative group overflow-hidden rounded-lg border border-white/10 bg-zinc-950 aspect-video flex items-center justify-center">
                {previewImageUrl ? (
                  <>
                    <img
                      src={previewImageUrl}
                      alt="Export Frame Preview"
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlayingPreview((prev) => !prev)}
                        className="rounded-full bg-cyan-500 hover:bg-cyan-400 p-2.5 text-slate-900 transition active:scale-95 flex items-center justify-center shadow-lg"
                      >
                        {isPlayingPreview ? (
                          <Pause size={16} fill="currentColor" />
                        ) : (
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleGeneratePreviewFrame}
                        disabled={isPreviewLoading}
                        className="rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-2.5 text-zinc-300 transition active:scale-95 flex items-center justify-center shadow-lg"
                      >
                        <RefreshCw size={16} className={isPreviewLoading ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-zinc-500 text-[10px] text-center p-3">
                    <span>미리보기 프레임이 생성되지 않았습니다.</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setIsPlayingPreview(true)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1 font-black text-slate-900 text-[10px] transition active:scale-95"
                      >
                        <Play size={10} fill="currentColor" />
                        재생
                      </button>
                      <button
                        type="button"
                        onClick={handleGeneratePreviewFrame}
                        disabled={isPreviewLoading}
                        className="inline-flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-3 py-1 font-black text-zinc-300 text-[10px] transition active:scale-95"
                      >
                        {isPreviewLoading ? "렌더링..." : "프레임 로드"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] rounded-xl border border-white/5 bg-black/10 p-3">
              <InfoBox label="클립" value={`${clips.length}개`} />
              <InfoBox label="길이" value={`${totalDuration.toFixed(1)}초`} />
              <InfoBox label="예상 파일 크기" value={estimatedFileSizeLabel} />
              <InfoBox label="예상 소요 시간" value={isBenchmarking ? "측정 중" : estimatedRenderTimeLabel} />
            </div>

            {benchmarkResult && benchmarkResult.riskLevel !== "low" && (
              <PreflightCard
                tone={benchmarkResult.riskLevel === "extreme" ? "danger" : "warning"}
                title={`Export Benchmark · ${benchmarkResult.riskLevel.toUpperCase()}`}
                items={[
                  `예상 렌더 시간: ${formatEstimatedRenderTime(benchmarkResult.estimatedRenderSeconds)}`,
                  `평균 프레임 처리: ${benchmarkResult.averageFrameMs.toFixed(1)}ms`,
                  `샘플: ${benchmarkResult.sampledFrames}프레임`,
                ]}
              />
            )}

            {fourKPolicy.applies && (
              <FourKPolicyCard
                policy={fourKPolicy}
                onAction={(action) => {
                  if (action === "set-1080p") {
                    setExportResolution("1080p");
                    setExportFps(30);
                  }
                  if (action === "set-1440p") {
                    setExportResolution("2k");
                    setExportFps(30);
                  }
                  if (action === "set-30fps") {
                    setExportFps(30);
                  }
                }}
              />
            )}
          </div>

          {/* Right Column: Settings & Actions */}
          <div className="flex flex-col justify-between gap-4 h-full min-h-[400px]">
            <div className="space-y-4">
              {/* File Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-400">이름</label>
                <input
                  type="text"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white outline-none focus:border-cyan-400 transition"
                  placeholder="프로젝트 이름 입력"
                />
              </div>

              {/* Export Folder Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-black text-zinc-400">내보내기 위치</label>
                <div
                  onClick={handleSelectFolder}
                  className="flex gap-2 cursor-pointer group"
                >
                  <input
                    type="text"
                    readOnly
                    value={exportFolderPath}
                    className="flex-1 truncate rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-zinc-400 group-hover:border-zinc-500 outline-none cursor-pointer transition"
                  />
                  <button
                    type="button"
                    className="flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 p-2 text-zinc-300 transition active:scale-95 cursor-pointer"
                    title="폴더 지정"
                  >
                    <Folder size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal mt-1">
                  ※ 브라우저 보안 정책상 '다운로드'나 '데스크톱' 상위 폴더 자체는 직접 선택이 불가능하므로, 해당 폴더 안에 **새 폴더**를 만들어 선택해 주세요.
                </p>
              </div>

              {/* Video Option */}
              <div className="rounded-xl border border-white/5 bg-black/20 p-3.5 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exportVideoEnabled}
                    onChange={(e) => setExportVideoEnabled(e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-cyan-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>동영상 내보내기</span>
                </label>

                {exportVideoEnabled && (
                  <div className="grid grid-cols-2 gap-3 pl-6 border-l border-white/5">
                    {/* Resolution */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500">해상도</label>
                      <select
                        value={exportResolution}
                        onChange={(e) => setExportResolution(e.target.value as ExportResolution)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
                      >
                        {EXPORT_RESOLUTION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#101014]">
                            {opt.label} ({opt.desc})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Framerate */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500">프레임 속도</label>
                      <select
                        value={exportFps}
                        onChange={(e) => setExportFps(Number(e.target.value) as ExportFps)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
                      >
                        {EXPORT_FPS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#101014]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quality */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500">화질 (비트레이트)</label>
                      <select
                        value={exportQuality}
                        onChange={(e) => setExportQuality(e.target.value as ExportQuality)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
                      >
                        {EXPORT_QUALITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#101014]">
                            {opt.label} ({opt.desc})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Video Format */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500">포맷</label>
                      <select
                        value={exportVideoFormat}
                        onChange={(e) => setExportVideoFormat(e.target.value as "mp4" | "mov")}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
                      >
                        <option value="mp4" className="bg-[#101014]">MP4</option>
                        <option value="mov" className="bg-[#101014]">MOV</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Audio Option */}
              <div className="rounded-xl border border-white/5 bg-black/20 p-3.5 space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exportAudioEnabled}
                    onChange={(e) => setExportAudioEnabled(e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-cyan-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>오디오만 내보내기</span>
                </label>

                {exportAudioEnabled && (
                  <div className="pl-6 border-l border-white/5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-500">오디오 포맷</label>
                      <select
                        value={audioExportFormat}
                        onChange={(e) => setAudioExportFormat(e.target.value as "mp3" | "wav" | "aac")}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 transition"
                      >
                        <option value="mp3" className="bg-[#101014]">MP3</option>
                        <option value="wav" className="bg-[#101014]">WAV (무손실)</option>
                        <option value="aac" className="bg-[#101014]">AAC</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Drawer for Queue and History */}
              <div className="border-t border-white/5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQueueDrawerOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between text-[11px] font-black text-zinc-400 hover:text-zinc-200 transition"
                >
                  <span className="flex items-center gap-2">
                    <Database size={13} />
                    대기열 및 내보내기 히스토리 ({renderQueue.length})
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transform transition-transform duration-200 ${
                      isQueueDrawerOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isQueueDrawerOpen && (
                  <div className="mt-3 max-h-40 overflow-y-auto space-y-3 pr-1 text-xs">
                    {/* Render Queue Section */}
                    <div className="rounded-lg border border-white/5 bg-black/40 p-2.5 space-y-2">
                      <div className="text-[10px] font-black text-zinc-500">
                        진행 중인 대기열
                      </div>
                      {activeQueueItems.length === 0 ? (
                        <div className="text-[10px] text-zinc-600 text-center py-1">
                          대기 중인 작업이 없습니다.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeQueueItems.map((item) => (
                            <div key={item.id} className="rounded border border-white/5 bg-zinc-950/40 p-2 text-[10px] space-y-1">
                              <div className="flex justify-between font-black text-zinc-300">
                                <span className="truncate max-w-[150px]">{item.projectTitle}</span>
                                <span className="text-cyan-400">{Math.round(item.progress.progress)}%</span>
                              </div>
                              <div className="text-zinc-500 flex justify-between">
                                <span>{getEngineLabel(item.engine)} · {item.resolution} · {item.fps}fps</span>
                                <span>{getQueueStatusLabel(item.status)}</span>
                              </div>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    item.status === "failed"
                                      ? "bg-red-400"
                                      : item.status === "cancelled"
                                        ? "bg-amber-400"
                                        : item.status === "completed"
                                          ? "bg-emerald-400"
                                          : "bg-cyan-400"
                                  }`}
                                  style={{ width: `${item.progress.progress}%` }}
                                />
                              </div>
                              {item.progress.message && (
                                <div className="text-[9px] text-zinc-600 truncate">{item.progress.message}</div>
                              )}
                              <div className="flex gap-1.5 mt-1">
                                {item.status === "pending" && (
                                  <button
                                    type="button"
                                    onClick={() => handleCancelQueuedExport(item)}
                                    className="rounded px-1.5 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white"
                                  >
                                    취소
                                  </button>
                                )}
                                {(item.status === "failed" || item.status === "cancelled") && (
                                  <button
                                    type="button"
                                    onClick={() => retryRenderQueueJob(item.id)}
                                    className="rounded px-1.5 py-0.5 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-300 hover:text-cyan-200"
                                  >
                                    재시도
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Export History Section */}
                    <div className="rounded-lg border border-white/5 bg-black/40 p-2.5 space-y-2">
                      <div className="text-[10px] font-black text-zinc-500">
                        최근 완료된 내보내기
                      </div>
                      {recentExportRecords.length === 0 ? (
                        <div className="text-[10px] text-zinc-600 text-center py-1">
                          완료 기록이 없습니다.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {recentExportRecords.slice(0, 5).map((record) => (
                            <div key={record.id} className="rounded border border-white/5 bg-zinc-950/40 p-2 text-[10px] flex justify-between items-center">
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="truncate font-black text-zinc-300">{record.title}</div>
                                <div className="text-[9px] text-zinc-500">
                                  {record.export_resolution} · {record.export_fps}fps · {record.export_quality}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`font-black ${getExportRecordStatusClass(record.status)}`}>
                                  {getExportRecordStatusLabel(record.status)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress / Actions Footer */}
            <div className="border-t border-white/5 pt-4 shrink-0">
              {/* If exporting, show status progress */}
              {isExporting ? (
                <div className="rounded-xl border border-white/5 bg-cyan-950/10 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-black text-zinc-300">
                      {exportProgress.stage === "idle"
                        ? "대기 중"
                        : exportProgress.stage === "worker-preflight"
                          ? "Worker 확인"
                        : exportProgress.stage === "encoding-webcodecs"
                          ? "오디오/비디오 인코딩"
                        : exportProgress.stage === "rendering-webm"
                          ? "WebM 렌더링"
                        : exportProgress.stage === "converting-mp4"
                          ? "MP4 변환"
                        : exportProgress.stage === "completed"
                          ? "완료"
                          : exportProgress.stage === "cancelled"
                            ? "취소됨"
                            : "실패"}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {Math.round(exportProgress.progress)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        exportProgress.stage === "failed"
                          ? "bg-red-400"
                          : exportProgress.stage === "cancelled"
                            ? "bg-amber-400"
                            : "bg-cyan-400"
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, exportProgress.progress))}%` }}
                    />
                  </div>
                  {exportProgress.message && (
                    <div className="mt-1.5 text-[10px] leading-relaxed text-zinc-500">
                      {exportProgress.message}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleCancelExport}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-xs font-black text-red-400 hover:bg-red-500/20 active:scale-95 transition hover:text-red-300"
                  >
                    내보내기 중단
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/20 py-2.5 text-xs font-black text-zinc-300 hover:text-white transition active:scale-95"
                  >
                    닫기
                  </button>
                  <button
                    type="button"
                    onClick={handleEnqueueExport}
                    disabled={isPreflighting || preflightResult?.canRender === false}
                    className="flex-[2] flex items-center justify-center gap-1.5 rounded-xl bg-cyan-400 py-2.5 text-xs font-black text-black hover:bg-cyan-300 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={14} />
                    {isPreflighting ? "Preflight 확인 중..." : "내보내기"}
                  </button>
                </div>
              )}
            </div>
          </div>
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

function PreflightCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "danger" | "warning" | "info";
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-400/25 bg-red-400/10 text-red-100"
      : tone === "warning"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";

  return (
    <div className={`rounded-xl border p-3 text-xs leading-5 ${toneClass}`}>
      <div className="mb-1 flex items-center gap-2 font-black">
        <AlertCircle size={14} />
        {title}
      </div>
      <ul className="space-y-1">
        {items.slice(0, 5).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function FourKPolicyCard({
  policy,
  onAction,
}: {
  policy: Export4kPolicyResult;
  onAction: (action: Export4kFallbackAction) => void;
}) {
  const toneClass =
    policy.status === "blocked"
      ? "border-red-400/25 bg-red-400/10 text-red-100"
      : policy.riskLevel === "extreme" || policy.riskLevel === "high"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";

  return (
    <div className={`rounded-xl border p-3 text-xs leading-5 ${toneClass}`}>
      <div className="mb-1 flex items-center gap-2 font-black">
        <AlertCircle size={14} />
        {policy.title} · {policy.riskLevel.toUpperCase()}
      </div>
      <div className="mb-2 text-[11px] opacity-80">
        예상 파일 크기 {policy.estimatedFileSizeLabel}
      </div>
      <ul className="space-y-1">
        {policy.reasons.slice(0, 4).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {policy.fallbackRecommendations.slice(0, 3).map((recommendation) => (
          <button
            key={recommendation.action}
            type="button"
            onClick={() => onAction(recommendation.action)}
            className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-left font-black text-white/90 hover:border-cyan-300"
            title={recommendation.reason}
          >
            {recommendation.label}
            <div className="mt-0.5 text-[10px] font-normal text-white/55">
              {recommendation.reason}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getEngineLabel(engine: VideoExportEngine) {
  if (engine === "fast-webcodecs") return "Fast";
  if (engine === "compatible-mp4") return "MP4";
  if (engine === "direct-mp4") return "Direct";
  return "WebM";
}

function getQueueStatusLabel(status: VideoRenderQueueItem["status"]) {
  if (status === "pending") return "대기 중";
  if (status === "running") return "렌더링 중";
  if (status === "completed") return "완료";
  if (status === "cancelled") return "취소됨";
  return "실패";
}

function shouldSyncExportProgress(progress: number) {
  const rounded = Math.round(progress);
  return rounded === 0 || rounded === 100 || rounded % 10 === 0;
}

function getExportRecordStatusLabel(status: string) {
  if (status === "created") return "생성";
  if (status === "rendering") return "렌더링";
  if (status === "completed") return "완료";
  if (status === "failed") return "실패";
  if (status === "canceled") return "취소";
  return status;
}

function getExportRecordStatusClass(status: string) {
  if (status === "completed") return "text-emerald-300";
  if (status === "failed") return "text-red-300";
  if (status === "canceled") return "text-amber-300";
  if (status === "rendering") return "text-cyan-300";
  return "text-zinc-400";
}

function formatExportRecordTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBenchmarkModeLabel(mode: ExportBenchmarkResult["mode"]) {
  if (mode === "custom-dry-run") return "custom";
  if (mode === "canvas-dry-run") return "canvas";
  return "estimate";
}

function getExportSize(resolution: ExportResolution, ratio: CanvasRatio) {
  const longEdge =
    resolution === "4k"
      ? 3840
      : resolution === "2k"
        ? 2560
        : resolution === "1080p"
          ? 1920
          : 1280;

  const makeEven = (n: number) => Math.round(n / 2) * 2;

  if (ratio === "9:16") {
    if (resolution === "4k") return { width: 2160, height: 3840 };
    if (resolution === "2k") return { width: 1440, height: 2560 };
    if (resolution === "1080p") return { width: 1080, height: 1920 };
    return { width: 720, height: 1280 };
  }

  if (ratio === "1:1") {
    if (resolution === "4k") return { width: 2160, height: 2160 };
    if (resolution === "2k") return { width: 1440, height: 1440 };
    if (resolution === "1080p") return { width: 1080, height: 1080 };
    return { width: 720, height: 720 };
  }

  if (ratio === "4:5") return { width: makeEven(longEdge * 0.8), height: makeEven(longEdge) };
  if (ratio === "5:4") return { width: makeEven(longEdge), height: makeEven(longEdge * 0.8) };
  if (ratio === "21:9") return { width: makeEven(longEdge), height: makeEven((longEdge * 9) / 21) };
  if (ratio === "4:3") return { width: makeEven(longEdge), height: makeEven((longEdge * 3) / 4) };

  if (resolution === "4k") return { width: 3840, height: 2160 };
  if (resolution === "2k") return { width: 2560, height: 1440 };
  if (resolution === "1080p") return { width: 1920, height: 1080 };
  return { width: 1280, height: 720 };
}

function hasExportWebGLEffect(clip: VideoEditorClip) {
  if (clip.type !== "image" && clip.type !== "video") return false;

  return (
    (clip.brightness ?? 1) !== 1 ||
    (clip.contrast ?? 1) !== 1 ||
    (clip.saturation ?? 1) !== 1 ||
    (clip.blur ?? 0) > 0 ||
    (clip.grayscale ?? 0) > 0 ||
    (clip.sepia ?? 0) > 0
  );
}
