# Video Studio Design Spec

## 1. Architecture Decisions

Video Studio is currently a client-side editor. The browser owns local media files, preview playback, timeline state, and export execution. This keeps source media private and avoids server storage costs.

The export architecture must evolve incrementally. Existing MediaRecorder and FFmpeg WASM export paths remain the compatibility baseline while faster engines are added behind capability checks.

Project event media thumbnails and Media Library cards share the same timeline drag payload (`media-id`). Dropping a media item onto a timeline row calls `addClipFromMedia()` with the target track id and drop time. If the target track type is compatible, the clip is placed on that track and shifted only as needed to avoid overlap. If the user drops onto an incompatible track, the editor falls back to the normal available-track selection for that media type.

Preview playback uses `VideoEditorPlaybackController` as the authoritative high-resolution clock during playback. React state `currentTime` is throttled for UI updates and must not feed small rounded values back into the playback clock while playing. Manual seeks still resynchronize media elements. When playback transitions from playing to paused, the controller publishes the exact internal paused time and dispatches a final playback-frame sync event so video/audio elements freeze on the current frame instead of snapping backward to the last rounded UI timestamp.

## 2. Export Engine Strategy

Current engines:

- `fast-webcodecs`: uses WebCodecs VP8 video-only encoding and a minimal WebM container writer. It does not include audio yet.
- `quick-webm`: renders frames into a hidden canvas, captures the canvas stream with `MediaRecorder`, and downloads a WebM file.
- `compatible-mp4`: runs the same WebM render first, then converts to MP4 with FFmpeg WASM.
- `direct-mp4`: registered as the future direct MP4 engine. It is visible in the Export UI and queue. The current capability step checks H.264, AAC, and Mediabunny availability, but export execution still falls back to the Compatible MP4 pipeline until the direct mux path is connected.

Step 1 added an explicit export engine type, progress reporting, cancellation, and page unload warning. It did not add WebCodecs or Worker rendering yet.

Step 2 improves output consistency by making the current Canvas export respect more of the existing editor state: motion, effects, blend mode, crop, flip, text opacity, audio fade/gain/pan, and basic visualizer rendering.

Step 3 adds the first WebCodecs path. `Fast WebCodecs` checks runtime browser support and uses `VideoEncoder` with VP8 plus a lightweight WebM muxer to create video-only WebM files. It is intentionally limited to 720p/1080p and 30fps. When unsupported or failed, export falls back to the existing Quick WebM path.

Step 4 separates safe default export settings from high-load settings. 720p/1080p and 24/30fps remain visible as the default path. 2K/4K and 60fps live under Advanced options. Resolution, FPS, and quality determine a recommended bitrate preset that is displayed in the UI and passed to MediaRecorder/WebCodecs. The UI also shows estimated frame count and high-load warnings.

Step 5 introduces the Worker/export job foundation. Export status is moved into a singleton job store so the modal can be closed and reopened without losing progress state. A Worker preflight checks whether Worker creation, messaging, and OffscreenCanvas are available. If Worker support is missing or incomplete, export falls back to the existing main-thread renderer.

Step 6 hardens audio export. Audio source collection and WebAudio scheduling now live in `export/audioMixdown.ts`. The mixdown path applies volume, mute, fade in/out, gain, pan, trim start, and trim end for audio clips and video source audio. If a source cannot be decoded by the browser, that source is skipped and export continues.

Step 7 adds an isolated WebGL effects renderer for export. `render/webglEffectsRenderer.ts` owns WebGL support detection, shader setup, crop/contain precomposition, and shader-based brightness, contrast, saturation, blur, grayscale, and sepia. `VideoEditorRenderCanvas` tries this path for image/video clips only. If WebGL is unavailable or any render step fails, the existing Canvas `filter` path remains the compatibility fallback.

Step 8 expands the transition engine without replacing the existing transition model. The persisted clip fields remain `transitionIn` and `transitionOut`, but `VideoTransitionType` now includes `wipe`, `push`, `spin`, `glitch`, `flash`, `dip-to-black`, and `cross-zoom`. Shared transition math returns opacity, scale, blur, translate, rotate, brightness, and clip inset values. Preview media layers and export rendering both consume this shared output.

Step 9 adds keyframe motion while preserving the existing static motion model. `VideoEditorClip.keyframes` is optional. When empty, export and preview use the static `motionX`, `motionY`, `motionWidth`, `motionHeight`, `scale`, `rotation`, and `opacity` fields. When keyframes exist, `render/videoRenderMath.ts` linearly interpolates those properties at the current clip-local time. The Motion panel can add or update a keyframe at the current playhead time, delete the active keyframe, clear all keyframes, or apply a two-point Ken Burns preset.

Step 10 hardens audio waveform handling. Uploaded audio/video files are decoded locally with `AudioContext.decodeAudioData`, reduced to a normalized peak array, and cached in IndexedDB under `media-waveforms`. The cache key uses file name, size, and last modified time so re-importing the same file can reuse the light waveform data. The editor does not upload original files for waveform analysis. When decoding fails, the UI shows a flat baseline rather than inventing a random waveform.

Step 11 adds local subtitle import and safer subtitle rendering. The import path reads SRT/VTT files in the browser, parses timestamp cues, cleans HTML/ASS formatting tags, preserves meaningful line breaks, and creates one subtitle clip per cue. The stored model still uses regular `VideoEditorClip` subtitle clips, so timeline editing and export reuse existing clip behavior. Preview and export both clamp subtitle positioning to a safe area. Export additionally wraps multiline subtitle text before drawing.

Step 12 adds an in-browser Render Queue. `export/exportJobStore.ts` stores both the current active export job and a queue of render jobs with metadata such as engine, resolution, FPS, quality, duration, timestamps, status, progress, and error message. `VideoEditorExportPanel` enqueues the current export settings and processes pending jobs sequentially. Cancel/retry are queue-level actions. Output binaries still download directly to the user's PC; queue state is metadata only.

Step 13 closes the first export-engine integration cycle. The queue item now passes its resolution, FPS, and quality snapshot into `VideoEditorRenderCanvas`, so a queued job renders with the settings it displayed when it was added. The Export UI also surfaces engine capability in one place: Fast WebCodecs is video-only and falls back to Quick WebM when unsupported or misconfigured; Quick WebM and Compatible MP4 are the audio-inclusive browser export paths.

The Direct MP4 registration phase adds the fourth engine without changing the behavior of the existing three engines. `VideoExportEngine` now includes `direct-mp4`, `VIDEO_EXPORT_ENGINES` renders a Direct MP4 card at the bottom of the engine list, and queue/snapshot/export metadata paths accept the new engine. The renderer exposes `exportDirectMp4()` through `VideoEditorRenderCanvasRef`; this method currently emits Direct MP4 status messages and then uses the existing Compatible MP4 WebM-to-FFmpeg fallback path. This keeps the UI and queue contracts stable before the direct H.264/AAC implementation is introduced.

The Direct MP4 capability phase adds `export/directMp4Support.ts`. This file checks the exact browser pieces required by the final direct MP4 path:

- H.264 `VideoEncoder.isConfigSupported()` against `avc1.42001f`, `avc1.4d002a`, and `avc1.64002a` for the selected width, height, FPS, and bitrate.
- AAC `AudioEncoder.isConfigSupported()` against `mp4a.40.2` at 48kHz stereo by default.
- Mediabunny MP4 muxer availability by verifying the installed package exports `Output`, `Mp4OutputFormat`, `BufferTarget`, `CanvasSource`, and `AudioBufferSource`.

`renderPreflight.ts` now includes the Direct MP4 capability result in `capabilities.directMp4`. The Export UI displays H.264, AAC, selected codec string, bitrate, and Mediabunny readiness when Direct MP4 is selected. A failed Direct MP4 capability check is not yet a hard blocker because `exportDirectMp4()` can still route to Compatible MP4. Instead, preflight records warnings and recommends the existing Compatible MP4 fallback so users still get an audio-inclusive `.mp4` output.

The Direct MP4 audio phase extends `export/directMp4Exporter.ts`. This exporter uses Mediabunny `Output`, `Mp4OutputFormat`, `BufferTarget`, and `CanvasSource` to encode the current render canvas as an H.264/AVC MP4 video track. When audio exists, it also uses Mediabunny `AudioBufferSource` to encode AAC audio from the existing OfflineAudioContext mixdown.

1. Build the same render context used by Quick WebM and Compatible MP4, including snapshot clips, media, tracks, canvas ratio, render size, FPS, duration, and bitrate.
2. Collect audio sources from the snapshot/live project.
3. Verify Direct MP4 H.264, AAC when audio is present, and Mediabunny muxer capability.
4. If audio exists, render an OfflineAudioContext mixdown through `audioMixdown.ts`, preserving volume, muted, fadeIn, fadeOut, audioGain, audioPan, trim, and source timing.
5. Add the mixed AudioBuffer to Mediabunny `AudioBufferSource` as an AAC track.
6. Render frames into Mediabunny `CanvasSource.add(timestamp, duration)`.
7. Download the generated `*-direct-mp4.mp4` blob when successful.
8. If direct MP4 encoding, audio mixdown, AAC encoding, or muxing fails, fall back to the existing WebM render plus FFmpeg WASM MP4 conversion.

This phase makes Direct MP4 capable of producing audio-inclusive MP4 files without a WebM intermediate on browsers that support H.264/AAC WebCodecs and Mediabunny MP4 muxing. Compatible MP4 remains the fallback for unsupported browsers, audio decode failures that should not be skipped, mux failures, or memory pressure.

The Direct MP4 finalization phase tunes the surrounding product behavior:

- `exportBenchmark.ts` estimates Direct MP4 as a direct encode/mux path rather than a WebM realtime render plus FFmpeg conversion. Audio-inclusive Direct MP4 adds a small mixdown/mux multiplier.
- `export4kPolicy.ts` treats Direct MP4 separately from Quick WebM and Compatible MP4. Direct MP4 is gated by H.264/AAC/Mediabunny capability first; MediaRecorder is only required when the direct path must fall back to Compatible MP4.
- 4K Direct MP4 adds memory-pressure warnings for the combined render, encode, audio, and MP4 mux buffers.
- Failure guidance now distinguishes Direct MP4 mux failures, AAC/OfflineAudioContext failures, MediaRecorder MIME failures, WebCodecs encoder failures, Worker failures, and memory pressure.
- The Export UI includes a Direct status field and shows the expected route: H.264 direct, H.264+AAC direct, or Compatible MP4 fallback.
- Queue/history metadata continues to store local MP4 filename metadata only. The actual binary is still saved to the user's PC through browser download, not uploaded to Supabase.

Quick WebM remains a MediaRecorder-based realtime path. Its render loop must use elapsed wall-clock time as the timeline position, not a requirement to render every theoretical frame. If rendering is slower than the target FPS, the loop drops visual frames so the exported file duration stays aligned with the project duration. Export rendering also treats audio clips as audio-only sources; filename/spectrum placeholders are editor affordances and must not be drawn into final video. Visualizer clips draw their opaque background only when no image/video layer exists beneath them, so visualizer overlays do not cover the main picture during export.

Export frame composition now uses an explicit draw order: image/video/audio media resolution first, visualizer overlays second, and text/subtitle overlays last. This avoids text tracks being hidden by later image/video drawing. Visualizer export also derives its bar/wave values from the active audio source's decoded AudioBuffer around the current timeline time. The export visualizer is still an offline approximation of the live analyser used in Preview, but it is audio-driven, template-aware, temporally smoothed, spatially smoothed, interpolated, and mapped through the same log-frequency bar strategy used by canvas playback rather than a fixed sine placeholder.

The first export performance package keeps the existing render architecture but reduces repeated work:

- Stable image-only media layers can be cached as a full-frame canvas during non-transition segments. This is aimed at slideshow/music visualizer projects where the same image remains visible for many seconds.
- The static cache is bypassed for video layers, keyframed clips, active transition frames, and unstable transform states so behavior remains conservative.
- Visualizer audio analysis is cached per audio source as smoothed analysis frames. Export frames interpolate those values instead of scanning the decoded AudioBuffer for every rendered frame, then apply preview-like per-bar smoothing so the bars react strongly without aggressive flicker.
- Audio-only layers are ignored when deciding whether static image media can be cached, because audio is mixed separately and does not affect pixel output. Stable text/subtitle overlays are cached in a transparent overlay canvas and composited after visualizers, preserving draw order while avoiding repeated text measurement and rasterization.
- Direct MP4 progress events are throttled to changed integer progress values, and the encode loop yields less often, reducing UI/store update overhead.
- WebGPU/WebGL/Canvas fallback remains intact. Static cache acts above those backends by avoiding repeated backend invocation when the visual result is stable.
- Worker/OffscreenCanvas is still the target architecture for a later full Direct MP4 render worker; the current optimization package avoids moving DOM-dependent media decode into Worker prematurely.
- Visualizer project fast-path optimization is implemented in the export benchmark. Since static image backgrounds and visualizers are highly cacheable (except the moving spectrum bars), projects without video tracks but having visualizers apply a 0.45x rendering time multiplier and trigger a lightweight mock visualizer simulation in the dry-run canvas loop.
- Single frame export preview renders a single frame at the active playhead using the selected export options and canvas size. It uses the imperative `renderSampleFrame` method on the render canvas to extract a base64 JPEG URL.
- Interactive playback preview ("움직이는 미니 재생기"): Renders sequential frames dynamically at 12 FPS using a self-regulating asynchronous loop. It pre-mixes timeline audio via OfflineAudioContext on load, plays the mix via AudioContext during preview, uses elapsed wall-clock time for AV sync, loops sound cleanly, and falls back to editor playhead sync on pause.

Direct MP4 registration policies:

- It should generate `.mp4` metadata and local filenames.
- Benchmark estimates treat it like Compatible MP4 until direct mux timing is measured.
- Preflight shows H.264/AAC/Mediabunny capability details and explains that Direct MP4 attempts AAC audio muxing when audio exists, with Compatible MP4 fallback if the direct path fails.
- 4K policy treats it like MP4-compatible export for now.
- Existing Fast WebCodecs, Quick WebM, and Compatible MP4 behavior must remain unchanged.

The render preflight foundation adds `export/renderPreflight.ts` as an isolated utility layer. It does not change the current export execution path yet. The utility accepts a render job's engine, resolution, FPS, quality, duration, canvas ratio, target dimensions, bitrate, audio/video presence, and WebGL effects usage, then returns a typed report with `canRender`, risk level, blocking reasons, warnings, recommendations, capabilities, and estimates.

Current preflight checks include:

- Worker and OffscreenCanvas support through the existing Worker support detector.
- WebCodecs support through the existing WebCodecs detector, while preserving the current Fast WebCodecs policy of 720p/1080p, 30fps, video-only export.
- WebGL context support plus `MAX_TEXTURE_SIZE`, `MAX_RENDERBUFFER_SIZE`, and `MAX_VIEWPORT_DIMS` comparisons against the selected render size.
- Render canvas allocation with a temporary 2D canvas.
- Estimated render buffer memory based on RGBA pixels and multiple internal buffers.
- `navigator.deviceMemory` and `navigator.hardwareConcurrency` when the browser exposes them.
- MediaRecorder support across the WebM MIME candidates used by the export plan.
- Advisory risk warnings for 2K/4K, 60fps, 4K 60fps, missing video sources, Fast WebCodecs audio mismatch, and long-duration projects including 12-hour extreme cases.

The Export UI now consumes this preflight result before queueing a render job and again before processing a queued job. If `canRender` is false, export is blocked and the blocking reasons are shown to the user. Non-blocking warnings and recommendations are displayed as cards in the Export panel, along with the selected MediaRecorder MIME type. Fast WebCodecs continues to show fallback guidance when the selected settings exceed the current 720p/1080p, 30fps, video-only policy.

The preflight layer remains deliberately shallow: it does not rewrite the current renderer, does not alter the MediaRecorder/WebCodecs implementation, and does not force new engine behavior. Existing Quick WebM, Compatible MP4, and Fast WebCodecs export behavior remains the compatibility baseline.

The export benchmark foundation adds `export/exportBenchmark.ts` as an advisory timing layer. It accepts the selected export engine, resolution, FPS, quality, duration, canvas ratio, render dimensions, audio/video presence, and WebGL effects usage. The default benchmark samples 8-15 frames. When running in a browser, it performs a temporary canvas dry-run that scales very large outputs down to a safe benchmark canvas and normalizes the measured frame time. When canvas access is unavailable, it returns a heuristic estimate from pixel count, FPS, quality, effects, audio, and engine type.

Benchmark results include:

- `averageFrameMs`
- `sampledFrames`
- `estimatedRenderSeconds`
- `riskLevel`
- `totalFrames`
- raw frame samples
- benchmark mode: `canvas-dry-run`, `custom-dry-run`, or `heuristic`

The Export panel displays the estimated render time, average frame time, sampled frame count, benchmark mode, and a warning card when benchmark risk is above low. This estimate is intentionally not a hard blocker. It does not yet call `VideoEditorRenderCanvas`'s internal frame renderer because that renderer is still scoped inside the component. A future step can pass a real `renderSample` callback into `runExportBenchmark()` once the render frame path is safely exposed.

The render job snapshot layer adds `export/renderJobSnapshot.ts`. When the user queues an export, `buildRenderJobSnapshot()` copies the current project state into a fixed `RenderJobSnapshot`. The snapshot includes the project title, engine, resolution, FPS, quality, duration, canvas ratio, target width and height, bitrate, total frames, audio/video/subtitle/text/visualizer/effects feature flags, selected MediaRecorder MIME type, preflight report, benchmark result, estimated render seconds, clip snapshot, media item snapshot, track snapshot, and creation time.

Render Queue items store this snapshot optionally, preserving backward compatibility with older queue metadata. The queue UI surfaces snapshot-derived render size, frame count, estimated time, selected MIME type, and risk level. During queue processing, export options pass the snapshot into `VideoEditorRenderCanvas`.

`VideoEditorRenderCanvas` now treats `options.snapshot` as the source of truth when present. It uses snapshot resolution, FPS, quality, canvas ratio, duration, title, render dimensions, clips, and media items. If no snapshot is provided, it falls back to the live editor context exactly as before. This keeps the current export APIs compatible while preventing timeline, text, effect, motion, subtitle, and audio edits made after queueing from changing that queued job's render content.

Snapshot limitations:

- Media item `File` and object URL references are preserved by reference; the original local browser resources must still be available while the job renders.
- Fast WebCodecs remains limited to the existing 720p/1080p, 30fps, video-only path.
- The snapshot does not add WebCodecs audio muxing, Worker rendering, or 4K WebCodecs support.
- Existing main-thread rendering still executes in the browser and can still be interrupted by page navigation, refresh, tab close, or browser resource pressure.

The Shared Render Plan phase starts the final renderer architecture by introducing `render/renderFramePlan.ts`. It converts the live editor state or a queued snapshot state into a typed per-frame scene description before a renderer draws anything. The current plan input is:

- clips
- media items
- timeline tracks
- current time
- canvas ratio

The output includes ordered render layers with resolved media references, local clip time, track index, z-index, picture-layer classification, motion, transition, effect, and audio mix values. Preview and export both use this same layer selection and ordering path. Preview consumes the plan for media layers and visual stacking. `VideoEditorRenderCanvas` consumes the plan for frame export in Quick WebM, Compatible MP4, and Fast WebCodecs fallback rendering.

Render job snapshots now include `tracksSnapshot` in addition to clip and media snapshots. This closes a queue stability gap: a queued job no longer depends on the live timeline track order when deciding export layer order.

Current Shared Render Plan boundaries:

- It does not replace Canvas2D drawing yet.
- It does not introduce WebGPU, WebGL fallback routing, Worker rendering, or OffscreenCanvas rendering yet.
- Existing text and subtitle preview components still own their interactive DOM rendering, but text and subtitle clips are included in the plan so the export renderer and future unified preview renderer can consume the same scene data.
- Media object URLs and browser-local resources must still be available at render time.

The Canvas2D/WebGL fallback renderer phase adds `render/renderFallbackRenderer.ts` as the first explicit renderer backend boundary. The class is intentionally small: it draws a single media layer from a Render Plan layer source into the active Canvas2D frame context.

Current fallback backend policy:

- Canvas2D is the guaranteed baseline renderer.
- WebGL is used only as an effects accelerator through the existing `WebGLEffectsRenderer`.
- If WebGL context creation fails, shader setup fails, an effect render throws, or the effect renderer returns no canvas, the same media layer is drawn through Canvas2D.
- Canvas2D still applies crop, contain scaling, clip transform, opacity, blend mode, CSS-equivalent canvas filters, transition clipping, and flip state through shared render math.
- WebGL output is composited back through the same Canvas2D transform path, keeping layer order and transition behavior identical between the accelerated and fallback branches.

`VideoEditorRenderCanvas` no longer owns the media-layer WebGL/Canvas branch directly. It creates one `RenderFallbackRenderer` per frame-renderer instance and calls `drawMediaLayer()` for image and video sources. Text, subtitle, audio placeholder, and visualizer drawing remain in `VideoEditorRenderCanvas` for now because their current rendering is Canvas2D-specific and does not yet need WebGL acceleration.

This phase does not add WebGPU and does not move rendering into a Worker. It defines the backend boundary needed by the next phases: WebGPU can become a new backend while Canvas2D and WebGL remain reliable fallbacks.

The WebGPU renderer phase adds `render/webgpuRenderer.ts` and promotes the fallback order to:

1. WebGPU media/effects backend
2. WebGL effects backend
3. Canvas2D baseline backend

`WebGPURenderer` is browser-only and guarded by `navigator.gpu` plus a `webgpu` canvas context check. It uses a precomposed scratch canvas for crop/contain media preparation, uploads that media layer into a GPU texture, applies a WGSL shader, and returns a canvas that is composited by the existing Canvas2D frame path. The current shader handles:

- brightness
- contrast
- saturation
- grayscale
- sepia
- blur

The renderer deliberately does not take over the whole frame yet. The full frame is still assembled by `VideoEditorRenderCanvas` so existing text, subtitle, audio placeholder, visualizer, transition clipping, blend mode, opacity, and fallback behavior remain compatible. Text and subtitle remain Canvas2D-composited in this phase, but they are still part of the Shared Render Plan and therefore remain ready for a future full WebGPU scene renderer.

Render preflight now reports WebGPU renderer support as an advisory capability. WebGPU failure is never a blocker: media layers fall back to WebGL effects and then Canvas2D in the same draw call. The Export panel shows WebGPU readiness so users can tell whether their browser is taking the high-performance path.

The WebCodecs phase 3 hardening keeps the existing Fast WebCodecs VP8 video-only WebM exporter but expands the support model around it. `detectWebCodecsSupport()` remains the baseline check for VP8 1280x720 30fps. A new `isWebCodecsConfigSupported()` helper accepts target width, height, FPS, bitrate, codec, and bitrate mode so preflight and render execution can validate the exact queued export configuration.

Current WebCodecs policy:

- Recommended stable path: 720p/1080p, 30fps, VP8, video-only.
- 720p/1080p 24fps or 60fps: experimental target config path. 60fps can proceed with a high warning when config support exists.
- 2K/4K: experimental target config path. The queued snapshot must have WebCodecs config support and preflight risk must be low or medium.
- Audio: still excluded from Fast WebCodecs output. If audio is present, the UI continues to recommend Quick WebM or Compatible MP4 because the current WebCodecs exporter writes a video-only WebM track.

`VideoEditorRenderCanvas` now passes snapshot width, height, FPS, bitrate, duration, total frame count, canvas ratio, clips, and media items into the WebCodecs export path when a snapshot exists. It also performs a final target config check immediately before configuring `VideoEncoder`. If the experimental policy or encoder support check fails, the existing `exportWebCodecs` wrapper falls back to Quick WebM, preserving the compatibility path.

`export/webCodecsExportTypes.ts` introduces small audio and worker plan types. These are intentionally declarative only in this phase:

- `WebCodecsExportAudioPlan` records that the current path is video-only or should use audio fallback.
- `WebCodecsExportWorkerPlan` records that Worker export is not enabled yet and why.

This prepares a later split where the frame renderer and encoder orchestration can move behind a Worker-compatible boundary. It does not add OffscreenCanvas rendering, WebCodecs audio encoding, or WebM audio muxing yet.

The WebCodecs Worker phase adds the first Worker orchestration boundary without moving DOM-dependent rendering into the Worker. `export/webCodecsExportWorker.ts` is an inline Worker factory. The Worker message protocol supports:

- `start`: receives a RenderJobSnapshot with width, height, FPS, bitrate, total frames, duration, canvas ratio, clip snapshot, and media item snapshot.
- `progress`: reports setup/config progress.
- `complete`: reports whether main-thread fallback is required.
- `error`: reports Worker-side failure.
- `cancel`: accepts cancel requests and reports cancellation.

`export/webCodecsWorkerClient.ts` owns Worker creation, URL cleanup, progress forwarding, AbortSignal integration, `cancel` message dispatch, Worker termination, and fallback result handling. `VideoEditorRenderCanvas` invokes this client before the main-thread WebCodecs encoder when a snapshot is available. If Worker or OffscreenCanvas is unavailable, Worker creation fails, target config validation fails, or the Worker reports that DOM rendering cannot be moved yet, export continues through the existing main-thread WebCodecs path. If that path fails, the existing Quick WebM fallback still applies.

Current Worker responsibility now includes:

- verify Worker startup
- verify OffscreenCanvas availability
- verify Worker-side WebCodecs target config support
- run an OffscreenCanvas frame loop from `RenderJobSnapshot`
- render image, text, subtitle, visualizer, and placeholder media frames without DOM access
- receive cancel messages
- report rendered frame counts and why main-thread fallback is still needed

The Worker frame loop uses the snapshot as the scene source and draws into an `OffscreenCanvas` 2D context. It mirrors the Shared Render Plan ordering rules inside the Worker because inline Workers cannot import the app module graph. The loop can run in two modes:

- `probe`: renders up to 12 frames to verify OffscreenCanvas rendering without doubling the full export cost.
- `full`: renders all frames and is reserved for the final worker-side WebCodecs integration.

Current Worker render limits:

- Image clips can be fetched and decoded through `createImageBitmap` when the local URL is accessible to the Worker.
- Video clips are represented by placeholder frames until a Worker-safe video decode strategy is connected.
- Text/subtitle drawing is simplified compared with the interactive DOM preview, but it uses the snapshot text fields and frame timing.
- Audio is not rendered into frames and remains handled by the existing audio/fallback export paths.

`VideoEditorRenderCanvas` now chooses between Worker `full` mode and Worker `probe` mode:

- `full`: used for video-only jobs that do not contain source video clips. The Worker renders the snapshot to OffscreenCanvas, creates `VideoFrame` objects from that canvas, encodes them with Worker `VideoEncoder`, muxes a VP8 video-only WebM Blob, and returns the Blob to the main thread for local download.
- `probe`: used when audio is present or when source video clips are present. Audio still requires the Quick WebM/MP4 mixdown path, and source video clips still need the main-thread DOM video seeking path until a Worker-safe demux/decode path is added.

Final fallback policy:

1. Fast WebCodecs first attempts Worker WebCodecs full encode when the snapshot is video-only and Worker-safe.
2. If Worker is unavailable, OffscreenCanvas fails, Worker WebCodecs config is unsupported, Worker encode fails, audio exists, or source video clips exist, the export falls back to main-thread WebCodecs when policy allows it.
3. If main-thread WebCodecs fails, the existing wrapper falls back to Quick WebM.
4. Compatible MP4 remains WebM render plus FFmpeg WASM conversion when the user explicitly selects MP4.

This completes the browser-side WebGPU/WebGL/Canvas fallback renderer plus Worker/OffscreenCanvas/WebCodecs integration path while preserving existing compatibility exports.

The WebCodecs audio beta phase does not add audio to the Fast WebCodecs output yet. The current WebCodecs WebM writer in `webCodecsVideoExporter.ts` creates a single VP8 video track, so adding audio safely requires an audio encoder plus a WebM muxer capable of writing audio tracks, timestamps, and interleaved clusters.

Current audio behavior:

- Quick WebM and Compatible MP4 continue to use the existing `scheduleAudioMixdown()` path.
- `collectAudioMixSources()` collects audio clips and video clips with source audio from clips/media items.
- The mixdown model reflects `volume`, `muted`, `fadeIn`, `fadeOut`, `audioGain`, and `audioPan`.
- `detectWebCodecsAudioSupport()` checks browser AudioEncoder support for Opus first, then AAC.
- `detectOfflineAudioMixdownSupport()` checks whether OfflineAudioContext is available for future snapshot-based offline mixdown.
- `renderOfflineAudioMixdown()` is available as a future utility but is not run automatically before every export because full-duration offline rendering could be expensive for long projects.

When Fast WebCodecs is selected and the RenderJobSnapshot contains audio, `VideoEditorRenderCanvas` currently performs a lightweight audio beta readiness check and then throws a controlled fallback error. The existing `exportWebCodecs` wrapper catches that error and falls back to Quick WebM, preserving audio through the existing MediaRecorder/WebAudio path. This avoids creating misleading video-only files when the user expects audio.

Remaining work for true WebCodecs audio:

- encode the offline mixdown buffer with AudioEncoder
- extend or replace the current video-only WebM muxer to write an Opus/AAC audio track
- interleave audio/video timestamps correctly
- define mux failure fallback to Quick WebM/Compatible MP4
- add targeted tests for fade, pan, gain, muted, trim, and long-duration projects

The 4K export safety phase adds `export/export4kPolicy.ts` as a product-level policy layer above the existing preflight and benchmark checks. The policy is active for 3840x2160, 2160x3840, and other 4K-class targets. It consumes the selected engine, resolution, FPS, quality, duration, target dimensions, bitrate, preflight report, and benchmark report.

4K policy checks include:

- landscape 3840x2160 and vertical 2160x3840 target detection
- 4K60 high-risk detection
- 1-hour long-duration warning
- 12-hour long-duration block
- `navigator.deviceMemory` low-memory warning
- `navigator.hardwareConcurrency` low-core warning
- WebGL `MAX_TEXTURE_SIZE`, `MAX_RENDERBUFFER_SIZE`, and `MAX_VIEWPORT_DIMS`
- canvas allocation result
- MediaRecorder MIME availability
- WebCodecs target config support
- benchmark risk and estimated render time
- estimated output file size from bitrate and duration

Fallback policy:

- 4K60 recommends 4K30 first.
- 4K30 with high risk recommends 1440p30.
- WebCodecs 4K unsupported recommends Quick WebM 4K.
- Quick WebM/MP4 MediaRecorder failure recommends lowering to 1080p.
- 12-hour 4K export is blocked and recommends 1080p30.

The Export UI surfaces the policy as a dedicated 4K safety card. It shows reasons, risk level, estimated file size, and action buttons for `1080p`, `1440p`, `30fps`, and `Quick WebM`. These buttons only adjust settings; the user still explicitly queues the export after reviewing the new settings.

The benchmark remains advisory, but 4K estimates now apply more conservative multipliers for 4K, 4K60, and long-duration projects. This intentionally overestimates risk rather than promising a fragile render will succeed. Actual long 4K renders are not forced during validation.

Export failure messages now add guidance based on common failure categories:

- canvas allocation failure
- MediaRecorder MIME unsupported
- encoder/WebCodecs target config failure
- memory pressure
- Worker failure

These messages do not replace the underlying error; they add a practical fallback recommendation.

Future engines should be added as isolated files under `src/components/studio/video/editor/export/` and should not replace the compatibility path.

## 3. Render Consistency

Preview and export must converge on shared math for:

- Motion: position, size, scale, rotation, opacity, crop, flip, and linear keyframes.
- Effects: brightness, contrast, saturation, blur, grayscale, sepia, blend mode.
- Transitions: fade, zoom, slide, blur, wipe, push, spin, glitch, flash, dip-to-black, and cross-zoom.
- Audio: volume, mute, fade in/out, gain, pan.
- Waveform: local AudioBuffer analysis with IndexedDB cache.
- Subtitle: local SRT/VTT import, cue-to-clip conversion, safe-area rendering, and multiline wrapping.

The preview path still owns the richest interactive behavior, but export now uses `render/videoRenderMath.ts` for shared motion, effects, transition, blend, and audio mix calculations. PreviewPlayer has not yet been fully migrated to that utility to avoid a large risky refactor.

Remaining consistency gaps:

- Fast WebCodecs is video-only and does not yet mux audio.
- Fast WebCodecs keeps encoded frames in memory until the WebM blob is written.
- WebGL effects currently cover image/video export only; text, subtitle, audio placeholder, and visualizer clips continue to use Canvas filter behavior.
- Text/subtitle preview layers have not yet been fully migrated to shared transition math; export applies transition math to text/subtitle drawing.
- Keyframe easing curves are not implemented yet; interpolation is linear.
- Waveform analysis depends on browser codec support for `decodeAudioData`; unsupported media keeps an empty waveform.
- Subtitle import currently supports SRT/VTT cue timing and plain text cleanup; advanced karaoke timing, speaker metadata, and style tags are intentionally stripped.
- Full audio-reactive visualizer export is not implemented.
- Future transition types must be added to Preview and Export together.

## 4. Audio Design Rationale

Audio is mixed in-browser. Source files remain local, and exported files are downloaded to the user's PC. Supabase stores metadata only.

Current compatible export audio path:

- Collect audio clips and video clips that have local media.
- Decode each source through `AudioContext.decodeAudioData`.
- Schedule each source through `AudioBufferSourceNode`.
- Apply `GainNode` automation for volume, gain, fade in, and fade out.
- Apply `StereoPannerNode` for pan.
- Connect the mixed stream to the MediaRecorder output.

MP4 audio muxing is expected to be fragile across browsers and should always have an FFmpeg WASM fallback. If WebCodecs is used for video-only fast export, audio support should be introduced later as a separate step.

Fast WebCodecs remains video-only. The UI must continue to tell users that Quick WebM or Compatible MP4 is required when audio must be included.

## 5. Worker Strategy

Worker export should be introduced after the main-thread export flow has stable progress and cancellation semantics. Offscreen rendering should be optional because browser support varies.

The current implementation performs Worker preflight only. Full rendering still runs on the main thread because the renderer depends on DOM canvas, HTML image/video elements, and current project-local media URLs. Moving rendering into Worker requires a later OffscreenCanvas-compatible render path.

The preferred fallback order is:

1. WebCodecs/Worker when supported.
2. Main-thread WebCodecs or Canvas renderer when possible.
3. MediaRecorder WebM.
4. FFmpeg WASM conversion for MP4 compatibility.

## 6. Render Queue Strategy

Render Queue stores queue state in the browser singleton store first and now mirrors export metadata to `video_project_exports` when the user is logged in.

Exported video binaries must stay on the user's PC unless a future upload feature is explicitly designed.

Current queue behavior:

- New jobs are appended as `pending`.
- New jobs create a `video_project_exports` row with `created` status when Supabase auth is available.
- The panel processes one pending job at a time.
- Each job renders with its queued resolution/FPS/quality snapshot.
- Running job cancellation uses the active `AbortController`.
- Pending jobs can be cancelled without starting a renderer.
- Failed or cancelled jobs can be retried by moving them back to `pending`.
- DB progress is updated coarsely at 10% intervals to avoid excessive writes.
- Completed, failed, and canceled jobs update the DB record status.

`video_project_exports` stores only metadata: title, resolution, FPS, quality, output filename, local output key, status, progress, and creation time. It does not store the WebM/MP4 binary, source files, source media URLs, or thumbnails. `output_local_key` is a local reference in the form `local-export://<queue-id>/<file-name>`, not a Supabase Storage path.

`project_id` remains nullable because the current editor panel does not yet maintain a reliable persisted `video_projects.id` in context. When project persistence is fully connected, Render Queue can pass that id into the export metadata insert without changing the local-file policy.

Recent export records are displayed in the Export panel. The current DB schema does not include `error_message` or `completed_at`, so full failure text and completion timestamps remain local queue state until the schema is expanded.

## 7. UI/UX Decisions

Export UI must always show:

- Selected engine.
- Current stage.
- Progress percent.
- Cancel action.
- Clear note that modal close does not stop export, but page navigation or refresh can stop it.

Advanced 4K/60fps options should be separated from basic 720p/1080p/30fps options to protect lower-spec devices.

The export panel should surface technical cost without blocking the user. High-load warnings are advisory; fallback and cancel remain available.

## 8. Technical Considerations

- WebCodecs support must be detected at runtime.
- FFmpeg WASM may require network access to load core assets.
- Long exports can take real-time duration or longer with MediaRecorder.
- Browser tab suspension can interrupt client-side export.
- React route changes can unmount editor components unless export state is moved above the editor route.
- WebGL context creation and shader execution are runtime browser capabilities. The renderer must always keep Canvas filter fallback available.
