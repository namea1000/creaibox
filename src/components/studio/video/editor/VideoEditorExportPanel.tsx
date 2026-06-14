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
  onRenderSampleFrame,
}: {
  open: boolean;
  onClose: () => void;
  onExportWebCodecs: (options?: VideoExportOptions) => Promise<void>;
  onExportWebm: (options?: VideoExportOptions) => Promise<void>;
  onExportMp4: (options?: VideoExportOptions) => Promise<void>;
  onExportDirectMp4: (options?: VideoExportOptions) => Promise<void>;
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
  const [selectedEngine, setSelectedEngine] = useState<VideoExportEngine>("quick-webm");
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
      };

      if (job.engine === "fast-webcodecs") {
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
    const preflight = await executePreflight(createPreflightInput());

    if (!preflight.canRender) {
      window.alert(`내보내기를 시작할 수 없습니다.\n\n${preflight.blockingReasons.join("\n")}`);
      return;
    }

    const benchmark = await runExportBenchmark(createBenchmarkInput(), { sampleFrames: 10 });
    setBenchmarkResult(benchmark);
    const size = getExportSize(exportResolution, canvasRatio);
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

    const queuedJob = enqueueRenderJob({
      projectTitle,
      engine: selectedEngine,
      resolution: exportResolution,
      fps: exportFps,
      quality: exportQuality,
      duration: totalDuration,
      snapshot,
      preflight,
      benchmark,
      estimatedSeconds: benchmark.estimatedRenderSeconds,
    });

    const createdRecord = await createVideoProjectExportRecord(queuedJob);
    if (createdRecord.saved) {
      attachExportRecordToRenderJob(queuedJob.id, createdRecord.record.id);
      void refreshExportHistory();
    } else {
      setExportHistoryStatus(`DB 기록 skipped: ${createdRecord.reason}`);
      console.warn("[VideoExport] export record create skipped:", createdRecord.reason);
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
      <div className="max-h-[calc(100vh-4rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101014] text-white shadow-2xl">
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
                {basicResolutionOptions.map((item) => (
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
              <div className="grid grid-cols-2 gap-2">
                {basicFpsOptions.map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    active={exportFps === item.value}
                    onClick={() => setExportFps(item.value as ExportFps)}
                  />
                ))}
              </div>
            </ExportSection>

            <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen((value) => !value)}
                className="flex w-full items-center justify-between text-sm font-black uppercase tracking-wider text-zinc-400"
              >
                <span className="flex items-center gap-2">
                  <Gauge size={16} />
                  Advanced
                </span>
                <ChevronDown
                  size={16}
                  className={`transition ${isAdvancedOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAdvancedOpen && (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      고급 해상도
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {advancedResolutionOptions.map((item) => (
                        <OptionButton
                          key={item.value}
                          label={item.label}
                          desc={item.desc}
                          active={exportResolution === item.value}
                          onClick={() => setExportResolution(item.value as ExportResolution)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      고급 프레임
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {advancedFpsOptions.map((item) => (
                        <OptionButton
                          key={item.value}
                          label={item.label}
                          desc="부하가 크며 긴 영상에서는 시간이 오래 걸릴 수 있습니다."
                          active={exportFps === item.value}
                          onClick={() => setExportFps(item.value as ExportFps)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <ExportSection title="화질" icon={Gauge}>
              <div className="grid grid-cols-1 gap-2">
                {EXPORT_QUALITY_OPTIONS.map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    desc={`${item.desc} · 현재 권장 ${formatBitrate(
                      getRecommendedVideoBitrate({
                        resolution: exportResolution,
                        fps: exportFps,
                        quality: item.value as ExportQuality,
                      })
                    )}`}
                    active={exportQuality === item.value}
                    onClick={() => setExportQuality(item.value as ExportQuality)}
                  />
                ))}
              </div>
            </ExportSection>

            <ExportSection title="엔진" icon={Film}>
              <div className="grid grid-cols-1 gap-2">
                {VIDEO_EXPORT_ENGINES.map((item) => (
                  <OptionButton
                    key={item.value}
                    label={item.label}
                    desc={
                      item.value === "fast-webcodecs"
                        ? `${item.desc} ${
                            webCodecsSupport === null
                              ? "지원 확인 중..."
                              : webCodecsSupport.supported
                                ? "현재 브라우저 지원됨."
                                : `현재 브라우저 미지원: ${webCodecsSupport.reason}`
                          }`
                        : item.value === "direct-mp4"
                          ? `${item.desc} Mediabunny 설치됨 · H.264/AAC 지원은 Preflight에서 확인합니다.`
                        : item.desc
                    }
                    active={selectedEngine === item.value}
                    onClick={() => setSelectedEngine(item.value)}
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

            {/* Export Frame Preview Card */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
              <div className="mb-2 flex items-center justify-between font-black">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Monitor size={14} className="text-cyan-400" />
                  내보내기 프레임 프리뷰
                  {isAudioLoading && (
                    <span className="ml-1 flex items-center gap-1 text-[10px] text-zinc-500 font-normal">
                      <Volume2 size={12} className="animate-pulse text-cyan-400" />
                      믹싱 중...
                    </span>
                  )}
                  {!isAudioLoading && mixedAudioBuffer && (
                    <span title="오디오 프리뷰 재생 가능 (볼륨이 켜져 있습니다)">
                      <Volume2
                        size={12}
                        className="ml-1 text-cyan-400 cursor-help"
                      />
                    </span>
                  )}
                  {!isAudioLoading && !mixedAudioBuffer && clips.some((c) => c.type === "audio" || c.type === "video") && (
                    <span title="오디오 데시벨 분석 또는 로드 실패">
                      <VolumeX
                        size={12}
                        className="ml-1 text-zinc-600 cursor-help"
                      />
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {isPlayingPreview ? previewTime.toFixed(2) : (currentTime ?? 0).toFixed(2)}s
                </span>
              </div>

              {previewImageUrl ? (
                <div className="relative group overflow-hidden rounded-lg border border-white/5 bg-zinc-950 aspect-video flex items-center justify-center">
                  <img
                    src={previewImageUrl}
                    alt="Export Frame Preview"
                    className="h-full w-full object-contain"
                  />
                  {/* Playback controls overlay on hover */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview((prev) => !prev)}
                      className="rounded-full bg-cyan-500 hover:bg-cyan-400 p-2.5 text-slate-900 transition active:scale-95 flex items-center justify-center shadow-lg hover:scale-105"
                      title={isPlayingPreview ? "일시정지" : "재생"}
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
                      className="rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 p-2.5 text-zinc-300 transition active:scale-95 flex items-center justify-center shadow-lg hover:scale-105"
                      title="새로고침"
                    >
                      <RefreshCw size={16} className={isPreviewLoading ? "animate-spin" : ""} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/10 bg-zinc-950/20 aspect-video flex flex-col items-center justify-center gap-2 text-zinc-500 text-[10px] text-center p-3">
                  <span>현재 재생헤드 시점의 내보내기 결과물 프레임을 미리 확인하거나 애니메이션으로 재생해 보세요.</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 font-black text-slate-900 transition duration-150 active:scale-95 shadow-md"
                    >
                      <Play size={12} fill="currentColor" />
                      프리뷰 재생
                    </button>
                    <button
                      type="button"
                      onClick={handleGeneratePreviewFrame}
                      disabled={isPreviewLoading}
                      className="inline-flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 px-3 py-1.5 font-black text-zinc-300 transition duration-150 active:scale-95 disabled:opacity-50"
                    >
                      {isPreviewLoading ? "렌더링 중..." : "단일 프레임 생성"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <InfoBox label="클립" value={`${clips.length}개`} />
              <InfoBox label="길이" value={`${totalDuration}s`} />
              <InfoBox label="해상도" value={exportResolution} />
              <InfoBox label="크기" value={selectedResolutionDesc} />
              <InfoBox label="프레임" value={`${exportFps}fps`} />
              <InfoBox label="화질" value={selectedQualityLabel} />
              <InfoBox label="권장 비트레이트" value={formatBitrate(recommendedBitrate)} />
              <InfoBox label="예상 파일" value={estimatedFileSizeLabel} />
              <InfoBox label="예상 프레임" value={`${estimatedFrameCount.toLocaleString()}장`} />
              <InfoBox label="예상 시간" value={isBenchmarking ? "측정 중" : estimatedRenderTimeLabel} />
              <InfoBox
                label="평균 프레임"
                value={
                  benchmarkResult
                    ? `${benchmarkResult.averageFrameMs.toFixed(1)}ms`
                    : "계산 중"
                }
              />
              <InfoBox
                label="Worker"
                value={
                  workerSupport === null
                    ? "확인 전"
                    : workerSupport.supported
                      ? workerSupport.offscreenCanvas
                        ? "Ready"
                        : "Main fallback"
                      : "Unavailable"
                }
              />
              <InfoBox
                label="WebGPU"
                value={
                  webgpuRendererSupport === null
                    ? "확인 전"
                    : webgpuRendererSupport.supported
                      ? "Ready"
                      : "Fallback"
                }
              />
              <InfoBox
                label="WebGL FX"
                value={
                  webglEffectsSupport === null
                    ? "확인 전"
                    : webglEffectsSupport.supported
                      ? "Ready"
                      : "Canvas fallback"
                }
              />
              <InfoBox label="오디오" value={selectedEngineAudioMode} />
              <InfoBox
                label="AudioEnc"
                value={
                  selectedEngine === "direct-mp4"
                    ? directMp4Config?.audio.supported
                      ? "AAC"
                      : "Fallback"
                    : selectedEngine === "fast-webcodecs"
                    ? audioEncoderConfig?.supported
                      ? audioEncoderConfig.codec?.toUpperCase() || "Ready"
                      : "Fallback"
                    : "대기"
                }
              />
              <InfoBox label="MIME" value={selectedMimeType} />
              <InfoBox
                label="WebCodecs"
                value={
                  selectedEngine === "direct-mp4"
                    ? directMp4Config?.video.supported
                      ? "H.264 OK"
                      : "Fallback"
                    : selectedEngine !== "fast-webcodecs"
                    ? "대기"
                    : webCodecsConfig?.supported
                      ? "Config OK"
                      : "Fallback"
                }
              />
              <InfoBox
                label="WC Worker"
                value={
                  selectedEngine !== "fast-webcodecs"
                    ? "대기"
                    : canUseWebCodecsWorker
                      ? "Orchestrate"
                      : "Main fallback"
                }
              />
              <InfoBox
                label="Codec"
                value={
                  selectedEngine === "fast-webcodecs"
                    ? `${webCodecsConfig?.codec || "vp8"} · ${formatBitrate(recommendedBitrate)}`
                    : selectedEngine === "direct-mp4"
                      ? `${directMp4Config?.video.codec || "H.264"}/${directMp4Config?.audio.codecString || "AAC"} · ${formatBitrate(recommendedBitrate)}`
                    : "-"
                }
              />
              <InfoBox
                label="Direct"
                value={
                  selectedEngine !== "direct-mp4"
                    ? "대기"
                    : directMp4Config?.supported
                      ? hasAudioSource
                        ? "H.264+AAC"
                        : "H.264"
                      : "Fallback"
                }
              />
              <InfoBox
                label="Benchmark"
                value={
                  benchmarkResult
                    ? `${benchmarkResult.sampledFrames}f · ${getBenchmarkModeLabel(benchmarkResult.mode)}`
                    : "대기"
                }
              />
              <InfoBox
                label="Fallback"
                value={
                  selectedEngine === "fast-webcodecs"
                    ? "Quick WebM"
                    : selectedEngine === "direct-mp4"
                      ? "Compatible MP4"
                      : "None"
                }
              />
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
                  if (action === "set-quick-webm") {
                    setSelectedEngine("quick-webm");
                  }
                  if (action === "set-compatible-mp4") {
                    setSelectedEngine("compatible-mp4");
                  }
                }}
              />
            )}

            {selectedEngine === "fast-webcodecs" && (
              <PreflightCard
                tone={isExperimentalWebCodecs ? "warning" : "info"}
                title={isExperimentalWebCodecs ? "WebCodecs Experimental" : "WebCodecs Config"}
                items={[
                  webCodecsConfig?.supported
                    ? `지원 config: ${webCodecsConfig.width ?? "-"}x${webCodecsConfig.height ?? "-"} · ${webCodecsConfig.fps ?? exportFps}fps`
                    : `미지원 config: ${webCodecsConfig?.reason || "지원 확인 중"}`,
                  `Codec ${webCodecsConfig?.codec || "vp8"} · bitrate ${formatBitrate(recommendedBitrate)}`,
                  isExperimentalWebCodecs
                    ? "2K/4K 또는 60fps는 preflight low/medium일 때만 experimental로 시도합니다."
                    : "권장 Fast WebCodecs 경로는 720p/1080p 30fps video-only입니다.",
                  hasAudioSource
                    ? "오디오는 아직 WebCodecs mux 대상이 아니며 Quick WebM/MP4 fallback 안내를 유지합니다."
                    : "현재 설정은 video-only WebCodecs export 대상입니다.",
                ]}
              />
            )}

            {selectedEngine === "direct-mp4" && (
              <PreflightCard
                tone={directMp4Config?.supported ? "info" : "warning"}
                title="Direct MP4 Capability"
                items={[
                  directMp4Config?.video.supported
                    ? `H.264 ${directMp4Config.video.codec || "지원"} ${directMp4Config.video.width ?? exportSize.width}x${directMp4Config.video.height ?? exportSize.height} · ${directMp4Config.video.fps ?? exportFps}fps`
                    : directMp4Config?.video.reason || "H.264 VideoEncoder 지원 확인 중",
                  hasAudioSource
                    ? directMp4Config?.audio.supported
                      ? `AAC ${directMp4Config.audio.codecString || "mp4a.40.2"} ${directMp4Config.audio.sampleRate ?? 48000}Hz 지원`
                      : directMp4Config?.audio.reason || "AAC AudioEncoder 지원 확인 중"
                    : "오디오 소스가 없어 AAC encode는 선택 사항입니다.",
                  directMp4Config?.muxer.supported
                    ? "Mediabunny MP4 muxer 구성 요소가 감지되었습니다."
                    : directMp4Config?.muxer.reason || "Mediabunny MP4 muxer 확인 중",
                  directMp4Config?.supported
                    ? "예상 경로: WebM 중간 파일 없이 Direct MP4 mux"
                    : "예상 경로: Compatible MP4 fallback",
                  hasAudioSource
                    ? "오디오 포함 프로젝트는 OfflineAudioContext mixdown 후 AAC 트랙으로 직접 MP4 mux를 시도합니다. 실패 시 Compatible MP4 fallback을 사용합니다."
                    : "오디오가 없는 프로젝트는 H.264 Direct MP4를 직접 생성하고, 실패 시 Compatible MP4 fallback을 사용합니다.",
                ]}
              />
            )}

            {selectedEngine === "fast-webcodecs" && hasAudioSource && (
              <PreflightCard
                tone="warning"
                title="Audio WebCodecs Beta"
                items={[
                  audioEncoderConfig?.supported
                    ? `AudioEncoder ${audioEncoderConfig.codec?.toUpperCase()} ${audioEncoderConfig.sampleRate ?? 48000}Hz 지원 감지`
                    : audioEncoderConfig?.reason || "AudioEncoder 지원 확인 중",
                  "volume, muted, fadeIn, fadeOut, audioGain, audioPan 값은 기존 Quick WebM/MP4 mixdown 경로에서 반영됩니다.",
                  "현재 WebCodecs muxer는 video-only라 오디오 포함 Fast WebCodecs는 Quick WebM fallback으로 처리됩니다.",
                ]}
              />
            )}

            {selectedEngine === "fast-webcodecs" && (
              <PreflightCard
                tone={canUseWebCodecsWorker ? "info" : "warning"}
                title="WebCodecs Worker"
                items={[
                  canUseWebCodecsWorker
                    ? "Worker와 OffscreenCanvas가 감지되어 WebCodecs worker orchestration을 먼저 실행합니다."
                    : workerSupport?.reason || "Worker 또는 OffscreenCanvas가 부족해 main-thread WebCodecs로 fallback합니다.",
                  "현재 Worker는 snapshot/config 검사와 cancel 메시지 수신을 담당합니다.",
                  "DOM media element 기반 frame rendering은 아직 main-thread에 남아 있습니다.",
                ]}
              />
            )}

            {preflightResult && !preflightResult.canRender && (
              <PreflightCard
                tone="danger"
                title="Preflight 차단"
                items={preflightResult.blockingReasons}
              />
            )}

            {preflightResult?.warnings.length ? (
              <PreflightCard
                tone={preflightResult.riskLevel === "extreme" ? "danger" : "warning"}
                title={`Render Preflight · ${preflightResult.riskLevel.toUpperCase()}`}
                items={preflightResult.warnings}
              />
            ) : null}

            {preflightResult?.recommendations.length ? (
              <PreflightCard
                tone="info"
                title="권장 사항"
                items={preflightResult.recommendations}
              />
            ) : null}

            {showPerformanceWarning && (
              <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-xs leading-5 text-red-100">
                <div className="mb-1 flex items-center gap-2 font-black">
                  <AlertCircle size={14} />
                  고부하 내보내기
                </div>
                {exportResolution === "4k" && exportFps === 60
                  ? "4K/60fps는 브라우저 메모리와 CPU 사용량이 매우 큽니다. 긴 영상은 Quick WebM 또는 1080p/30fps를 권장합니다."
                  : "현재 설정은 렌더링 시간이 오래 걸릴 수 있습니다. 브라우저가 느려지면 해상도나 FPS를 낮춰 주세요."}
              </div>
            )}

            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
              <div className="mb-1 flex items-center gap-2 font-black">
                <AlertCircle size={14} />
                현재 단계
              </div>
              모달을 닫아도 현재 내보내기는 계속됩니다. 페이지 이동, 새로고침, 탭 닫기 시에는 작업이 중단될 수 있습니다. 부하 수준: {exportLoadLevel.toUpperCase()}.
              {webglEffectsSupport?.supported === false
                ? ` WebGL 효과 렌더러는 미지원 상태라 기존 Canvas filter로 fallback합니다.`
                : ""}
              {selectedEngine === "fast-webcodecs" && hasAudioSource
                ? " Fast WebCodecs는 video-only라 오디오가 필요하면 Quick WebM 또는 MP4를 선택하세요."
                : ""}
              {selectedEngine === "fast-webcodecs" && !fastWebCodecsReady
                ? " 현재 설정에서 Fast WebCodecs가 실패하면 Quick WebM으로 자동 fallback합니다."
                : ""}
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-black text-zinc-300">
                  {exportProgress.stage === "idle"
                    ? "대기 중"
                    : exportProgress.stage === "worker-preflight"
                      ? "Worker 확인"
                    : exportProgress.stage === "encoding-webcodecs"
                      ? "WebCodecs 인코딩"
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
                <span className="font-mono text-cyan-300">
                  {Math.round(exportProgress.progress)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${
                    exportProgress.stage === "failed"
                      ? "bg-red-400"
                      : exportProgress.stage === "cancelled"
                        ? "bg-amber-400"
                        : "bg-cyan-400"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, exportProgress.progress))}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] leading-5 text-zinc-500">
                {exportProgress.message}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleEnqueueExport}
                disabled={isPreflighting || preflightResult?.canRender === false}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-black text-black hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={17} />
                {isPreflighting
                  ? "Preflight 확인 중..."
                  : isExporting
                  ? "대기열에 추가"
                  : selectedEngine === "fast-webcodecs"
                    ? "Fast WebM 큐 추가"
                    : selectedEngine === "quick-webm"
                      ? "WebM 큐 추가"
                      : selectedEngine === "direct-mp4"
                        ? "Direct MP4 큐 추가"
                      : "MP4 큐 추가"}
              </button>

              <button
                type="button"
                disabled={!isExporting}
                onClick={handleCancelExport}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 py-3 font-black text-white hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                취소
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-black text-zinc-300">Render Queue</span>
                <span className="font-mono text-zinc-500">{renderQueue.length} jobs</span>
              </div>

              {activeQueueItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-[11px] text-zinc-500">
                  대기 중인 render job이 없습니다.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeQueueItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-black/30 p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-black text-zinc-200">
                            {getEngineLabel(item.engine)} · {item.resolution} · {item.fps}fps
                          </div>
                          <div className="mt-0.5 text-[10px] text-zinc-600">
                            {getQueueStatusLabel(item.status)}
                          </div>
                          {item.snapshot && (
                            <div className="mt-1 text-[10px] leading-4 text-zinc-500">
                              {item.snapshot.width}×{item.snapshot.height} ·{" "}
                              {item.snapshot.totalFrames.toLocaleString()}f ·{" "}
                              {formatEstimatedRenderTime(item.snapshot.estimatedRenderSeconds ?? 0)}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 font-mono text-[10px] text-cyan-300">
                          {Math.round(item.progress.progress)}%
                        </div>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
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
                          style={{
                            width: `${Math.max(0, Math.min(100, item.progress.progress))}%`,
                          }}
                        />
                      </div>

                      {item.progress.message && (
                        <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-zinc-500">
                          {item.progress.message}
                        </div>
                      )}

                      {item.snapshot && (
                        <div className="mt-1 text-[10px] leading-4 text-zinc-600">
                          MIME {item.snapshot.selectedMimeType || "unknown"} · Risk{" "}
                          {item.snapshot.preflight?.riskLevel || item.snapshot.benchmark?.riskLevel || "low"}
                        </div>
                      )}

                      <div className="mt-2 flex gap-2">
                        {item.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleCancelQueuedExport(item)}
                            className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-black text-zinc-300 hover:border-amber-400 hover:text-amber-200"
                          >
                            취소
                          </button>
                        )}
                        {(item.status === "failed" || item.status === "cancelled") && (
                          <button
                            type="button"
                            onClick={() => retryRenderQueueJob(item.id)}
                            className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-black text-zinc-300 hover:border-cyan-400 hover:text-cyan-200"
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

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="mb-3 flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 font-black text-zinc-300">
                  <Database size={13} />
                  Export History
                </span>
                <span className="truncate font-mono text-[10px] text-zinc-500">
                  {exportHistoryStatus}
                </span>
              </div>

              {recentExportRecords.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-[11px] text-zinc-500">
                  로그인 전이거나 저장된 export 기록이 없습니다.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentExportRecords.slice(0, 5).map((record) => (
                    <div
                      key={record.id}
                      className="rounded-lg border border-white/10 bg-black/30 p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-black text-zinc-200">
                            {record.title}
                          </div>
                          <div className="mt-0.5 text-[10px] text-zinc-600">
                            {record.export_resolution} · {record.export_fps}fps ·{" "}
                            {record.export_quality}
                          </div>
                          <div className="mt-0.5 truncate text-[10px] text-zinc-600">
                            {record.output_file_name || "local file"} ·{" "}
                            {formatExportRecordTime(record.created_at)}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`font-black text-[10px] ${getExportRecordStatusClass(record.status)}`}>
                            {getExportRecordStatusLabel(record.status)}
                          </div>
                          <div className="font-mono text-[10px] text-cyan-300">
                            {record.progress}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

  if (ratio === "4:5") return { width: Math.round(longEdge * 0.8), height: longEdge };
  if (ratio === "5:4") return { width: longEdge, height: Math.round(longEdge * 0.8) };
  if (ratio === "21:9") return { width: longEdge, height: Math.round((longEdge * 9) / 21) };
  if (ratio === "4:3") return { width: longEdge, height: Math.round((longEdge * 3) / 4) };

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
