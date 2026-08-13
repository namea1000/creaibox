# Video Studio Export/Render Handoff

## Purpose

This is the fast handoff document for agents continuing CreAibox Video Studio export/render work. Read this after `docs/rules/ai-agent-rules.md` and before editing Video Studio export code.

The detailed source documents remain:

- `docs/arch/video-studio.md`
- `docs/arch/video-studio-design-spec.md`
- `docs/database/video-studio.md`

## Current Product State

Video Studio is a browser-side editor. Source media stays local in the browser. Exported binaries are downloaded to the user's PC. Supabase stores project/export metadata only, not original media files and not exported videos.

The editor currently supports:

- Multi-track image, video, audio, text, subtitle, and visualizer clips.
- Shared render plan for preview/export layer ordering.
- Browser-side export engines.
- Render Queue with optional DB metadata records.
- Preflight, benchmark, snapshot, 4K policy, and fallback messaging.
- Direct MP4 via WebCodecs H.264/AAC plus Mediabunny when supported.
- WebGPU/WebGL/Canvas fallback media rendering.

## Export Engines

### Fast WebCodecs

- Engine id: `fast-webcodecs`.
- Main files:
  - `src/components/studio/video/editor/export/webCodecsSupport.ts`
  - `src/components/studio/video/editor/export/webCodecsVideoExporter.ts`
  - `src/components/studio/video/editor/export/webCodecsExportWorker.ts`
  - `src/components/studio/video/editor/export/webCodecsWorkerClient.ts`
  - `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`
- Current role:
  - Fast video-focused WebM path.
  - Checks target WebCodecs config for selected width, height, FPS, and bitrate.
  - Worker path exists for limited cases.
- Important limitation:
  - The WebCodecs WebM path is still effectively video-only. Audio projects should fallback to Quick WebM so audio is preserved.

### Quick WebM

- Engine id: `quick-webm`.
- Main file:
  - `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`
- Current role:
  - Canvas render plus `MediaRecorder` WebM.
  - Audio-inclusive path via WebAudio mixdown stream.
  - Uses elapsed wall-clock time for render progress so slow rendering does not extend output duration.
- Important limitation:
  - Because it is MediaRecorder-based, quality and timing depend on browser encoder behavior.

### Compatible MP4

- Engine id: `compatible-mp4`.
- Main files:
  - `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`
  - `src/components/studio/video/editor/ffmpeg/convertWebmToMp4.ts`
- Current role:
  - Renders WebM first, then converts to MP4 with FFmpeg WASM.
  - Audio-inclusive compatibility fallback.
- Important limitation:
  - It runs two expensive phases: WebM render, then MP4 conversion.

### Direct MP4

- Engine id: `direct-mp4`.
- Main files:
  - `src/components/studio/video/editor/export/directMp4Support.ts`
  - `src/components/studio/video/editor/export/directMp4Exporter.ts`
  - `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`
- Current role:
  - Uses WebCodecs H.264 video, AAC audio, and Mediabunny MP4 muxing.
  - Audio-inclusive when H.264, AAC, OfflineAudioContext, and Mediabunny are available.
  - Falls back to Compatible MP4 on direct mux/encoder/audio failure.
- Important limitation:
  - Browser support and memory pressure still matter, especially for 4K or long duration.

## Core Render Flow

The export renderer is still centered in:

- `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`

The shared layer model is:

- `src/components/studio/video/editor/render/renderFramePlan.ts`

The media backend fallback chain is:

1. WebGPU media/effects backend when supported.
2. WebGL effects backend.
3. Canvas2D fallback.

Important files:

- `src/components/studio/video/editor/render/webgpuRenderer.ts`
- `src/components/studio/video/editor/render/webglEffectsRenderer.ts`
- `src/components/studio/video/editor/render/renderFallbackRenderer.ts`
- `src/components/studio/video/editor/render/videoRenderMath.ts`

Current export composition order:

1. Image/video media layers.
2. Visualizer overlay layers.
3. Text/subtitle overlay layers.

Do not change this order casually. It was set to keep visualizers over pictures and text/subtitles above both.

## Snapshot / Queue / Metadata

Render jobs should use a fixed snapshot so later timeline edits do not affect an already queued export.

Main files:

- `src/components/studio/video/editor/export/renderJobSnapshot.ts`
- `src/components/studio/video/editor/export/exportJobStore.ts`
- `src/components/studio/video/editor/export/exportMetadataStore.ts`
- `src/components/studio/video/editor/VideoEditorExportPanel.tsx`

Snapshot includes project/export options, clips, media items, tracks, preflight result, benchmark result, selected MIME, and estimated render seconds.

Queue/DB policy:

- Queue state is local browser state first.
- `video_project_exports` stores metadata only.
- Exported video binaries are local downloads only.
- Logged-out users can export; DB metadata is skipped.

## Preflight / Benchmark / 4K Policy

Main files:

- `src/components/studio/video/editor/export/renderPreflight.ts`
- `src/components/studio/video/editor/export/exportBenchmark.ts`
- `src/components/studio/video/editor/export/export4kPolicy.ts`

Current checks include:

- Worker and OffscreenCanvas support.
- WebCodecs and Direct MP4 support.
- WebGPU/WebGL support.
- WebGL texture/renderbuffer/viewport limits.
- Canvas allocation.
- Estimated memory.
- `navigator.deviceMemory` and `navigator.hardwareConcurrency` when available.
- MediaRecorder MIME candidates.
- 2K/4K/60fps/long-duration warnings.

Do not treat preflight as a perfect guarantee. It is advisory plus blockers for known unsafe combinations.

## Audio Export

Main file:

- `src/components/studio/video/editor/export/audioMixdown.ts`

Current audio behavior:

- Quick WebM and Compatible MP4 include audio through WebAudio scheduling/mixdown.
- Direct MP4 uses OfflineAudioContext mixdown and AAC encoding through Mediabunny when supported.
- Audio mixer values include volume, muted, fadeIn, fadeOut, audioGain, audioPan, trim start, and trim end.
- Failed source decode should skip only that source when possible, not kill the whole export.
- Silent video files (no audio track) are handled gracefully: `extractAudioWithMediabunny` returns `null` instead of throwing, and mixdown/canvas decoding falls back to a 1-second silent `AudioBuffer` to prevent Web Audio API pipeline stalls.
- Large video files cache only their pre-extracted audio WAV track in IndexedDB, saving up to 98% memory during playback/export.

Important limitation:

- Fast WebCodecs WebM audio muxing is not complete; preserve audio by falling back to Quick WebM.

## Visualizer Export

Main preview file:

- `src/components/studio/video/editor/VideoEditorPreviewPlayer.tsx`

Main export file:

- `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`

Current behavior:

- Visualizer clips use stored clip fields:
  - `visualizerTemplate`
  - `visualizerAccentColor`
  - `visualizerBackgroundColor`
  - `visualizerY`
  - `visualizerHeight`
  - `visualizerWidth`
- Export no longer draws audio clip filename/spectrum placeholders as visual layers.
- Export visualizer samples active audio source buffers instead of using only fake sine waves.
- Export uses reusable smoothed analysis frames and interpolated frame lookup.
- Export now uses preview-like log-frequency bar mapping and per-bar smoothing.
- Visualizer backgrounds are drawn only when no image/video layer exists underneath.

Known limitation:

- Preview uses live `AnalyserNode` values during realtime playback. Export uses offline AudioBuffer analysis. They can be close, but they are not mathematically identical.

Performance notes:

- Audio-only layers are ignored when deciding whether static image media can be cached.
- Stable text/subtitle overlays are cached in a transparent overlay canvas.
- This helps image + audio + visualizer projects, but H.264 encode and per-frame visualizer drawing still cost time.

## Current Performance Strategy

Implemented low-risk optimizations:

- Stable image-only media frame cache for non-transition/non-keyframed segments.
- Stable text/subtitle overlay cache.
- Visualizer analysis cache per audio source.
- Direct MP4 progress update throttling.
- Direct MP4 render loop yields less frequently while keeping cancellation responsive.

Still not completed:

- Full Worker/OffscreenCanvas render for DOM-dependent video/image/font paths.
- Full WebGPU scene renderer.
- GPU visualizer primitives.
- True server-side or native encoder acceleration.

## Important User-Facing Behavior

- Closing the export modal does not necessarily stop an export because queue state lives outside the modal.
- Navigating away, refreshing, closing the tab, or browser resource pressure can still interrupt browser-side export.
- Output files are saved by browser download to the user's PC.
- Supabase does not receive exported video binaries.
- Compatible MP4 intentionally does WebM render first, then FFmpeg WASM conversion.
- Direct MP4 is the intended no-WebM-intermediate MP4 path when capabilities pass.

## High-Risk Areas

Be careful when editing:

- `VideoEditorRenderCanvas.tsx`
  - It is the central export path for Quick WebM, Compatible MP4, Direct MP4, and fallback WebCodecs rendering.
  - **중요 고차(Gotcha)**: 내보내기 진행 중 3초 부근 프레임이 멈추는 프리징 현상을 막기 위해, 내보내기 도중에는 비디오 엘리먼트를 절대 강제 파괴/재생성하지 마십시오 (`maxSeekCount`는 `999999`로 해제됨). 또한, 프레임 디코딩 대기시간(`onseeked`) 타임아웃은 내보내기 시 최대 `5000ms`로 설정하여 100% 프레임 정확도를 확보하고, 프리뷰 시에는 UI 반응성을 위해 `80ms`로 별도 처리해야 합니다.
- `VideoEditorPreviewPlayer.tsx`
  - Manages real-time DOM layers and playback sync. Completely disables active sync (seeking) during playback for both video and audio to ensure native smooth rendering, bypassing AudioContext routing for silent videos. Do not apply active sync to playing elements to prevent stutters.
  - **중요 고차(Gotcha)**: 스페이스바 등으로 비디오를 일시정지할 때 화면이 미세하게 튀거나 뒤흔들리는 현상을 막기 위해, 정지 상태(`!isPlaying`) 조건으로 강제 seek를 유도하지 마십시오. 대신 플레이헤드와 비디오의 절대 시간 오차가 `0.03초`(1프레임 규격) 이상 벌어졌을 때만 seek를 유도하여 이중 탐색 플리커링을 예방하십시오.
- `render/renderFramePlan.ts`
  - Preview/export ordering depends on it.
- `export/audioMixdown.ts`
  - Audio preservation depends on source collection, trim, fade, gain, and pan.
- `export/directMp4Exporter.ts`
  - Timestamp, duration, and mux sequencing matter.
- `export/exportJobStore.ts`
  - Queue status must not regress when the modal closes.

## Recommended Next Work

For immediate user-visible improvements:

1. Add an explicit "visualizer project fast path" benchmark mode for image/audio/visualizer timelines.
2. Add an export preview sample frame button for the selected engine/settings.
3. Improve visualizer offline analysis calibration against preview for each template.
4. Measure Direct MP4 frame render time versus encode time separately in the UI.
5. Move image-only + text + visualizer render loops into a dedicated Worker path before attempting the full WebGPU renderer.

For long-term renderer goals:

1. Finish full shared scene data for preview/export.
2. Move non-DOM render paths into Worker + OffscreenCanvas.
3. Expand WebGPU from media/effects backend to full frame composition.
4. Connect Worker-rendered frames directly to WebCodecs encoder.
5. Keep Canvas2D and WebGL fallbacks intact.

## Verification Checklist

Before reporting completion for export/render changes:

- Run `./node_modules/.bin/tsc --noEmit --pretty false`.
- Run ESLint on touched TypeScript/TSX files.
- Run `npm run build` for substantial render/export changes.
- Test or reason through at least:
  - Quick WebM with audio.
  - Direct MP4 with audio.
  - Text over image.
  - Visualizer over image.
  - Queue cancel/failure fallback if touched.
- Update `docs/arch/video-studio.md` and `docs/arch/video-studio-design-spec.md` when behavior changes.
