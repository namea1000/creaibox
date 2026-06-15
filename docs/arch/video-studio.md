# Video Studio Architecture

## 1. Purpose

Video Studio is the browser-based video editing module for CreAibox. It lets users arrange local video, image, audio, text, subtitle, and visualizer clips on a multi-track timeline and export the result to local files.

## 2. Main Features

- Unified project/media library panel.
- Multi-track timeline with video, audio, text, subtitle, and visualizer tracks.
- Project event media thumbnails and Media Library items can be dragged directly onto compatible timeline tracks.
- Preview player with motion, effects, transition, audio mixer, and visualizer rendering.
- Preview playback keeps an internal high-resolution playback clock and only publishes throttled UI time, so pausing freezes the current media frame instead of snapping back to the last rounded UI timestamp.
- Local media cache using IndexedDB for uploaded files.
- Project autosave using browser local storage.
- Export panel with a clean CapCut-style single-screen layout, customizable file name input, local folder selection (File System Access API), and audio-only output formats (MP3, WAV, AAC).
- Engine simplification: Direct MP4 (`direct-mp4`) is the default and only visible video rendering engine in the UI, hiding other legacy engines (`fast-webcodecs`, `quick-webm`, `compatible-mp4`). The direct exporter automatically falls back to Compatible MP4 if H.264/AAC capability checks fail.
- Audio-only export: Decodes the offline mixed audio buffer, saves directly to the chosen folder as a WAV file, or transcodes it to MP3/AAC via FFmpeg WASM.
- Step 2 export consistency:
  - Motion, effects, blend mode, crop, flip, text opacity, audio fade/gain/pan, and basic visualizer rendering are reflected in browser-side export.
- Step 3 fast export:
  - Fast WebCodecs detects browser support and creates VP8 video-only WebM files for 720p/1080p 30fps.
  - Unsupported browsers, unsupported settings, and encoder failures fallback to Quick WebM.
- Step 4 advanced export options:
  - Resolution/FPS/quality-specific bitrate presets are shown in the UI and passed to the active renderer.
  - High-load settings show warnings and estimated frame counts.
- Step 5 worker/export job foundation:
  - Export job state moved into a singleton store outside the modal component.
  - Worker preflight checks Worker and OffscreenCanvas support.
  - Worker failure or missing OffscreenCanvas falls back to the existing main-thread export path.
- Step 6 audio export hardening:
  - Audio mixdown logic moved into `export/audioMixdown.ts`.
  - Export audio now schedules audio/video source audio with volume, mute, fade, gain, pan, and trim values.
  - Individual audio decode failures skip only the failed source and keep export running.
  - Fast WebCodecs remains video-only and the UI warns users to use Quick WebM/MP4 for audio.
- Step 7 WebGL effects renderer:
  - Image/video clip export now attempts WebGL shader rendering for brightness, contrast, saturation, blur, grayscale, and sepia.
  - Preview keeps the existing CSS/filter behavior.
  - WebGL unsupported or failed renders fallback to the existing Canvas filter path.
  - Export UI shows WebGL FX readiness.
- Step 8 transition engine expansion:
  - Transition types now include wipe, push, spin, glitch, flash, dip-to-black, and cross-zoom in addition to none/fade/zoom/slide/blur.
  - `render/videoRenderMath.ts` owns the shared transition math for preview media layers and export rendering.
  - Export uses transform/filter/opacity plus local canvas clipping for wipe-style reveal.
- Step 9 keyframe motion engine:
  - Clips can store `keyframes` for motionX, motionY, motionWidth, motionHeight, scale, rotation, and opacity.
  - Existing static motion fields remain the fallback when no keyframes exist.
  - Preview media layers and export rendering interpolate keyframes through shared render math.
  - Motion panel can add/update/delete keyframes at the current playhead time and apply a Ken Burns preset.
- Step 10 audio waveform engine:
  - Uploaded audio/video files are decoded in the browser with AudioBuffer analysis.
  - Waveform arrays are cached in IndexedDB `media-waveforms` by file signature.
  - Timeline clips, library cards, and Audio Mixer use real waveform arrays when available.
  - Random placeholder waveform generation was removed; missing waveform data shows a flat baseline.
- Step 11 subtitle engine:
  - SRT/VTT files can be imported locally from the text/subtitle panel.
  - Imported cues become subtitle clips with start time, duration, cleaned text, and default safe-area style.
  - Preview subtitle layer clamps subtitle placement to the safe area.
  - Export canvas wraps multiline subtitle text and applies the same safe-area constraints.
- Step 12 render queue:
  - Export jobs can be queued from the export panel.
  - Queue entries track engine, resolution, FPS, quality, duration, status, progress, and timestamps.
  - Pending jobs can be cancelled, and failed/cancelled jobs can be retried.
  - Output files still download to the user's PC; queue entries store metadata only.
- Step 13 export engine integration:
  - Fast WebCodecs, Quick WebM, Compatible MP4, browser support detection, bitrate presets, fallback messaging, and Render Queue are presented as one integrated export flow.
  - Queued jobs pass their resolution/FPS/quality snapshot into the renderer, so metadata and output settings stay aligned.
  - Fast WebCodecs remains video-only; Quick WebM or Compatible MP4 remains the audio-inclusive path.
- Direct MP4 engine registration:
  - `direct-mp4` is registered as the fourth export engine below Fast WebCodecs, Quick WebM, and Compatible MP4.
  - The engine appears in the Export UI, Render Queue, snapshots, export metadata filenames, benchmark estimates, preflight warnings, and queue processing.
  - In the current capability step, Direct MP4 checks H.264 `VideoEncoder`, AAC `AudioEncoder`, and Mediabunny MP4 muxer availability through `export/directMp4Support.ts`.
  - `export/directMp4Exporter.ts` uses Mediabunny `CanvasSource` for H.264 video and `AudioBufferSource` for AAC audio.
  - Audio-inclusive Direct MP4 uses the existing `audioMixdown.ts` OfflineAudioContext path to mix audio/video source audio with volume, mute, fade, gain, and pan values before muxing.
  - If Direct MP4 H.264/AAC muxing fails, export falls back to the existing Compatible MP4 pipeline so exported `.mp4` files do not lose audio.
  - Direct MP4 benchmark estimates no longer include the WebM realtime floor or FFmpeg conversion multiplier; audio projects add a small mux/mixdown multiplier.
  - 4K policy treats Direct MP4 as its own H.264/AAC/Mediabunny path and only depends on MediaRecorder when Direct MP4 must fall back to Compatible MP4.
  - The Export UI shows whether Direct MP4 is expected to run as H.264/H.264+AAC direct mux or as fallback.
- Render preflight foundation:
  - `export/renderPreflight.ts` defines a reusable browser-side preflight report for future Export UI and Render Queue integration.
  - The preflight checks Worker, WebCodecs, WebGPU renderer support, WebGL limits, canvas allocation, MediaRecorder MIME support, estimated render memory, device memory, CPU core count, high-load settings, and long-duration risk.
  - When Direct MP4 is selected, preflight also reports H.264/AAC/Mediabunny readiness and recommends Compatible MP4 fallback when the direct path is incomplete.
  - WebGPU renderer support is advisory; lack of WebGPU does not block export because WebGL and Canvas2D fallbacks remain available.
  - The Export panel now runs preflight before queueing and before processing a queued job. Blocking failures prevent export, while warnings, recommendations, selected MediaRecorder MIME type, Fast WebCodecs fallback guidance, and high-load risk are shown in the panel.
  - Existing Quick WebM, Compatible MP4, and Fast WebCodecs render paths remain unchanged.
- Export benchmark foundation:
  - `export/exportBenchmark.ts` measures 8-15 dry-run frames using a temporary canvas when possible, or falls back to a heuristic estimate outside browser canvas contexts. It integrates visualizer fast-path heuristics for image/audio/visualizer timelines, using a 0.45x multiplier and dry-run simulation rendering.
  - The Export panel shows estimated render time, average frame time, sampled frame count, benchmark mode, and benchmark risk.
  - Interactive playback and frame preview: Single frame export preview renders a base64 JPEG Data URL at the current playhead. Sequential interactive playback preview ("움직이는 미니 재생기") executes a 12 FPS loop rendering frames sequentially in an asynchronous, self-regulating manner synced with real-time audio playback mixed via `OfflineAudioContext`. It loops cleanly at the end of the timeline and falls back to editor playhead sync on pause.
- Render job snapshot:
  - `export/renderJobSnapshot.ts` freezes the project title, export engine, resolution, FPS, quality, duration, canvas ratio, render size, bitrate, frame count, feature flags, selected MIME type, preflight report, benchmark result, estimated render seconds, clips, media items, and creation timestamp when a job is queued.
  - Render Queue entries keep the snapshot as optional metadata and show snapshot render size, total frames, estimated time, selected MIME type, and risk.
  - `VideoEditorRenderCanvas` accepts the snapshot through export options and uses snapshot clips, media items, duration, canvas ratio, and render size when present. Existing non-snapshot export calls still use live editor context.
- WebCodecs export engine hardening:
  - `export/webCodecsSupport.ts` keeps the baseline VP8 720p/30fps check and adds target config support checks for the selected width, height, FPS, and bitrate.
  - Fast WebCodecs still recommends 720p/1080p 30fps video-only export, but experimental target configs can now be checked for 2K/4K and 60fps.
  - 2K/4K WebCodecs export is only attempted when the queued snapshot preflight reports target WebCodecs config support and low/medium risk. 720p/1080p 60fps may run as experimental with a high warning.
  - `VideoEditorRenderCanvas` passes snapshot width, height, FPS, bitrate, duration, total frame count, clips, and media items to the WebCodecs exporter when available.
  - `export/webCodecsExportTypes.ts` defines worker/audio plan types for a later Worker export and audio mux phase. Audio mux is not implemented yet.
- WebCodecs worker orchestration:
  - `export/webCodecsExportWorker.ts` creates an inline Worker that accepts RenderJobSnapshot-based `start` and `cancel` messages and returns `progress`, `complete`, `error`, or `cancel` messages.
  - `export/webCodecsWorkerClient.ts` manages Worker lifecycle, cancellation, progress forwarding, and fallback result handling.
  - The Worker validates OffscreenCanvas and WebCodecs target config, then runs an OffscreenCanvas frame loop from the queued RenderJobSnapshot.
  - For video-only jobs without source video clips, the Worker now renders frames into OffscreenCanvas, encodes them with Worker `VideoEncoder`, muxes a video-only WebM Blob, and returns it to the main thread for local download.
  - Jobs with audio or source video clips run a Worker frame-loop probe, then use the existing main-thread WebCodecs or Quick WebM fallback path so audio and DOM video seeking remain preserved.
  - Final fallback order is Worker WebCodecs, main-thread WebCodecs, Quick WebM, then Compatible MP4 when the user selected MP4.
  - Fast WebCodecs UI shows whether Worker orchestration is available or whether main-thread fallback will be used.
- WebCodecs audio beta foundation:
  - `export/audioMixdown.ts` already powers Quick WebM/MP4 audio scheduling and now also exposes OfflineAudioContext support detection plus an offline mixdown utility for a later WebCodecs audio pipeline.
  - `export/webCodecsSupport.ts` detects AudioEncoder support for Opus/AAC target configs.
  - Fast WebCodecs UI shows AudioEncoder readiness and clearly marks audio as beta/fallback.
  - The current WebCodecs muxer remains video-only. When a queued Fast WebCodecs snapshot contains audio sources, the export path verifies audio beta readiness and falls back to Quick WebM so audio is preserved.
- 4K export safety policy:
  - `export/export4kPolicy.ts` evaluates 4K landscape, vertical 4K, 4K60, long-duration, device memory, CPU core count, WebGL limits, canvas allocation, MediaRecorder MIME, WebCodecs config support, benchmark risk, and estimated file size.
  - The Export UI shows a dedicated 4K safety card with reasons, estimated file size, and fallback buttons such as 1080p, 1440p, 30fps, and Quick WebM.
  - 12-hour-or-longer 4K export is blocked by preflight. 1-hour-or-longer 4K export shows strong warnings and recommends 1440p/1080p fallback.
  - Export failures now include more specific guidance for canvas allocation, MIME support, encoder/WebCodecs, memory pressure, and Worker errors.
- Render Queue export metadata:
  - `export/exportMetadataStore.ts` connects Render Queue jobs to `video_project_exports` metadata records.
  - Queue creation inserts a `created` row when a Supabase user is available.
  - Export start/progress/completion/failure/cancel update the DB row with `rendering`, `completed`, `failed`, or `canceled`.
  - The Export panel displays recent export history records from Supabase.
  - Output video files remain local downloads on the user's PC; Supabase stores filename, local key, status, progress, and export settings only.
- Shared render plan foundation:
  - `render/renderFramePlan.ts` builds a typed per-frame scene description from clips, media items, tracks, current time, and canvas ratio.
  - The plan centralizes visible clip filtering, track-order layer sorting, media resolution, local clip time, motion, transition, effect, and audio mix values.
  - `VideoEditorPreviewPlayer` now uses this plan for preview media layers and z-index ordering.
  - `VideoEditorRenderCanvas` now uses the same plan to choose export frame layers for Quick WebM, Compatible MP4, and Fast WebCodecs fallback rendering.
  - Render job snapshots now include `tracksSnapshot`, so queued export layer ordering stays fixed even if the timeline track structure changes later.
- Canvas2D/WebGL fallback renderer:
  - `render/renderFallbackRenderer.ts` owns media-layer drawing for the current fallback render path.
  - Canvas2D is the guaranteed baseline backend for media layer drawing.
  - WebGL effects are attempted through `render/webglEffectsRenderer.ts` when possible, then fall back to Canvas2D in the same draw call if WebGL is unavailable or returns no effect canvas.
  - `VideoEditorRenderCanvas` now calls the fallback renderer instead of owning the WebGL/Canvas media drawing branch directly.
  - Quick WebM uses a realtime MediaRecorder loop. When rendering falls behind, it drops visual frames instead of extending the exported duration beyond the project timeline.
  - Audio clips are mixed into export audio only and are not drawn as visual filename/spectrum placeholder layers.
  - Visualizer export draws as an overlay when an image/video layer exists, avoiding an opaque visualizer background covering the main picture.
  - Export frame rendering now draws media first, visualizer overlays second, and text/subtitle overlays last so timeline text remains visible over image/video layers.
  - Visualizer export samples the active audio source buffer for time-based frequency/wave values instead of using a purely synthetic sine placeholder.
  - Visualizer export pre-analyzes audio into smoothed reusable analysis frames, interpolates between frames, and uses the same log-frequency bar mapping style as preview so exported bars move closer to canvas playback.
  - Export rendering caches stable image-only media frames during non-transition segments, so long static image sections do not re-run the full media/effects draw path every frame.
  - Audio-only layers no longer block static image caching, and stable text/subtitle overlays are cached separately for image/audio/visualizer projects.
  - Visualizer export pre-analyzes decoded audio into reusable analysis frames per source, then performs cheap interpolated frame lookups during render.
  - Direct MP4 throttles progress updates and yields less frequently during H.264 encoding, reducing React/UI overhead while keeping cancellation responsive.
- WebGPU renderer foundation:
  - `render/webgpuRenderer.ts` adds browser WebGPU support detection and a WebGPU media/effects backend.
  - Media layers now try WebGPU first, then WebGL effects, then Canvas2D.
  - The WebGPU shader handles brightness, contrast, saturation, grayscale, sepia, and blur on precomposed cropped/contained media layers.
  - Text, subtitle, audio placeholder, and visualizer layers remain Canvas2D-composited in the same frame render path.
  - Render preflight and the Export panel expose WebGPU readiness while keeping existing fallback export behavior.

## 3. UI Structure

- `VideoEditorShell`: editor workspace layout and export modal orchestration.
- `VideoEditorUnifiedLibrary`: project/event/library browser and resource panels.
- `VideoEditorCanvas`: preview stage, aspect ratio controls, audio meter, export shortcut.
- `VideoEditorTimeline`: track headers, clip layout, trimming, moving, zooming, and playhead seek.
- `VideoEditorInspector`: clip-specific inspector tabs.
- `VideoEditorExportPanel`: export options, engine selection, progress, cancel, and status display.

## 4. Database Structure

Video Studio stores metadata only. Original media files and exported video files are not stored in Supabase.

Main tables:

- `video_projects`
- `video_project_assets`
- `video_project_clips`
- `video_project_versions`
- `video_project_events`
- `video_project_exports`

The current editor still relies mainly on browser-local project state. `video_project_exports` is now used for export history metadata only. Exported binaries are not uploaded to Supabase.

## 5. API Structure

There is no dedicated Video Studio server render API in the current implementation. Export is browser-side.

## 6. Component Structure

- Editor context: `src/components/studio/video/editor/VideoEditorContext.tsx`
- Export UI: `src/components/studio/video/editor/VideoEditorExportPanel.tsx`
- Render canvas: `src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`
- Render math utilities: `src/components/studio/video/editor/render/videoRenderMath.ts`
- Shared render plan: `src/components/studio/video/editor/render/renderFramePlan.ts`
- Canvas2D/WebGL fallback renderer: `src/components/studio/video/editor/render/renderFallbackRenderer.ts`
- WebGPU renderer: `src/components/studio/video/editor/render/webgpuRenderer.ts`
- WebGL effects renderer: `src/components/studio/video/editor/render/webglEffectsRenderer.ts`
- Motion panel: `src/components/studio/video/editor/VideoEditorMotionPanel.tsx`
- Transition panel: `src/components/studio/video/editor/VideoEditorTransitionPanel.tsx`
- Subtitle import parser: `src/components/studio/video/editor/subtitle/subtitleImport.ts`
- Subtitle preview layer: `src/components/studio/video/editor/VideoEditorSubtitleLayer.tsx`
- Export support files: `src/components/studio/video/editor/export/*`
- Direct MP4 capability support: `src/components/studio/video/editor/export/directMp4Support.ts`
- Direct MP4 video exporter: `src/components/studio/video/editor/export/directMp4Exporter.ts`
- Export bitrate presets: `src/components/studio/video/editor/export/exportBitratePresets.ts`
- Render preflight utility: `src/components/studio/video/editor/export/renderPreflight.ts`
- Export benchmark utility: `src/components/studio/video/editor/export/exportBenchmark.ts`
- Render job snapshot utility: `src/components/studio/video/editor/export/renderJobSnapshot.ts`
- WebCodecs support detection: `src/components/studio/video/editor/export/webCodecsSupport.ts`
- WebCodecs video exporter: `src/components/studio/video/editor/export/webCodecsVideoExporter.ts`
- WebCodecs export types: `src/components/studio/video/editor/export/webCodecsExportTypes.ts`
- WebCodecs Worker script: `src/components/studio/video/editor/export/webCodecsExportWorker.ts`
- WebCodecs Worker client: `src/components/studio/video/editor/export/webCodecsWorkerClient.ts`
- 4K export policy: `src/components/studio/video/editor/export/export4kPolicy.ts`
- Export metadata store: `src/components/studio/video/editor/export/exportMetadataStore.ts`
- Export job store: `src/components/studio/video/editor/export/exportJobStore.ts`
- Worker preflight: `src/components/studio/video/editor/export/exportWorkerSupport.ts`
- Audio mixdown: `src/components/studio/video/editor/export/audioMixdown.ts`
- Waveform analysis/cache: `src/components/studio/video/editor/VideoEditorContext.tsx`
- FFmpeg converter: `src/components/studio/video/editor/ffmpeg/convertWebmToMp4.ts`

## 7. Future Expansion

- WebCodecs fast video-only export.
- Worker-based export orchestration.
- Audio mux and fallback strategy.
- Richer Render Queue metadata connected to persisted `video_project_exports` records.
- WebCodecs audio muxing after a dedicated mux/fallback design.
