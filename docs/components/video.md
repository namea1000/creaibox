# 비디오 스튜디오 컴포넌트 (Video Studio Components)

`CreAibox` 비디오 에디터 모듈은 브라우저 내에서 복수의 비디오 클립, 텍스트 효과, 음향 트랙을 시간축 기반으로 배치 및 조작할 수 있는 **SPA(Single Page Application) 비디오 편집 모듈**입니다.

---

## 1. 비디오 에디터 구조 모듈 (Editor Shell & Sidebar)

### 1-1. `VideoEditorShell` (`src/components/studio/video/editor/VideoEditorShell.tsx`)
* **역할**: 전체 편집기 레이아웃을 통제하는 중추 컴포넌트.
* **배치**: 좌측 도구 사이드바, 중앙 프리뷰 캔버스, 하단 타임라인, 우측 속성 인스펙터 패널의 그리드 영역을 조율하고 Context Provider를 바인딩합니다.

### 1-2. `VideoEditorUnifiedLibrary` (`src/components/studio/video/editor/VideoEditorUnifiedLibrary.tsx`)
* **역할**: 프로젝트 보관함, 이벤트, 프로젝트 목록, 미디어/비주얼라이저/텍스트 패널을 하나의 통합 라이브러리 영역으로 제공한다.
* **저장 방식**: 현재는 보관함/이벤트/프로젝트 목록과 클립/트랙 일부 상태를 브라우저 `localStorage`에 저장한다.
* **연동 서브 패널**:
  - `VideoEditorMediaLibrary`: 사용자 업로드 동영상/이미지/오디오 에셋 목록.
  - `VideoEditorStockPanel`: 무료 스톡 영상 라이브러리 연동.
  - `VideoEditorStoragePanel`: 저장소 연결 영역.
  - `VideoEditorVisualizerPanel`: 오디오 비주얼라이저 템플릿 추가 및 수정.
  - `VideoEditorAddTextPanel`: 텍스트/자막 클립 추가.

### 1-3. `VideoEditorSidebar` / `VideoEditorProjectPanel`
* **상태**: 과거 분리형 패널 구조의 컴포넌트가 남아 있으나, 현재 Shell에서는 통합 라이브러리 패널을 우선 사용한다.
* **주의**: 새 기능은 `VideoEditorUnifiedLibrary` 중심으로 연결하고, 기존 분리형 패널을 중복 확장하지 않는다.

---

## 2. 타임라인 및 플레이어 (Timeline & Playback)

### 2-1. `VideoEditorTimeline` (`src/components/studio/video/editor/VideoEditorTimeline.tsx`)
* **역할**: 멀티 트랙 시간 분할 시각화 보드.
* **주요 기능**:
  - 자막 트랙, 텍스트 레이어 트랙, 오디오 트랙, 메인 비디오 트랙 분리 렌더링.
  - 클립 드래그 앤 드롭 이동, 클립 길이 확대/축소 슬라이더 핸들바.
  - 재생 헤드(Playhead) 위치 실시간 인덱싱 (밀리초 단위 싱크 계산).
  - 클립 분할(Split) 및 삭제(Delete) 단축키 연결.

### 2-2. `VideoEditorCanvas` (`src/components/studio/video/editor/VideoEditorCanvas.tsx`)
* **역할**: 현재 재생 재생 헤드 시점의 미디어 프레임 및 자막 텍스트 오버레이 실시간 드로잉 캔버스.

### 2-3. `VideoEditorPreviewPlayer` & `PlaybackController`
* **역할**: 재생 루프 가동. `requestAnimationFrame` 루프를 돌아 현재 재생 시점(ms)을 동기화하고 HTML5 비디오 엘리먼트와 오디오 믹서를 병렬 제어.

---

## 3. 오디오 및 렌더링 유틸리티 (Audio & Rendering)

### 3-1. `VideoEditorAudioMixer` (`src/components/studio/video/editor/VideoEditorAudioMixer.tsx`)
* **역할**: 메인 비디오 오디오, 나레이션 음성 트랙, 배경 음악(BGM)의 볼륨 가중치를 각각 독립 제어할 수 있는 오디오 볼륨 페이더 세트.

### 3-2. `VideoEditorRenderCanvas` (`src/components/studio/video/editor/VideoEditorRenderCanvas.tsx`)
* **역할**: 보이지 않는 캔버스에서 현재 프로젝트를 프레임 단위로 렌더링하고 `MediaRecorder`를 통해 WebM 파일을 생성한다.
* **현재 엔진**:
  - `Fast WebCodecs`: 지원 브라우저에서 VP8 WebCodecs video-only WebM 파일을 생성한다.
  - `Quick WebM`: Canvas/WebM 렌더 결과를 바로 다운로드한다.
  - `Compatible MP4`: Canvas/WebM 렌더 후 FFmpeg WASM으로 MP4 변환을 수행한다.
* **진행 상태**: WebM 렌더링 진행률, MP4 변환 진행률, 완료/실패/취소 상태를 Export UI로 전달한다.
* **취소 처리**: WebM 렌더 루프는 `AbortSignal`로 중단할 수 있다. MP4 변환 중 취소 시 FFmpeg 인스턴스를 terminate하고 다음 변환 시 새로 로드한다.
* **Preview/Export 일치성**:
  - 이미지/비디오 클립의 위치, 크기, 스케일, 회전, 투명도, 플립, 크롭을 export에 반영한다.
  - brightness, contrast, saturation, blur, grayscale, sepia, blend mode를 Canvas export에 반영한다.
  - 텍스트/자막의 글자 투명도와 배경 투명도를 export에 반영한다.
  - 오디오 export는 volume, mute, fade in/out, gain, pan 값을 WebAudio 스케줄에 반영한다.
  - 오디오/비디오 원본 오디오 디코딩 실패 시 해당 소스만 건너뛰고 export를 계속한다.
  - 비주얼라이저 클립은 export에서 사라지지 않도록 절차형 기본 렌더를 수행한다.
* **Keyframe Motion**:
  - clip별 `keyframes` 배열에 위치, 크기, scale, rotation, opacity 값을 저장할 수 있다.
  - keyframe이 없으면 기존 `motionX/motionY/motionWidth/motionHeight/scale/rotation/opacity` 고정값을 그대로 사용한다.
  - Preview 이미지/비디오 레이어와 Export Canvas는 현재 시간 기준 선형 보간 값을 공유한다.
* **Audio Waveform**:
  - 업로드한 오디오/비디오 파일은 브라우저 `AudioContext.decodeAudioData`로 분석해 peak 기반 waveform을 생성한다.
  - waveform은 IndexedDB의 별도 `media-waveforms` store에 파일명/크기/수정시각 키로 캐시한다.
  - 원본 파일은 서버에 업로드하지 않고, 미디어 아이템과 클립에는 가벼운 number array만 저장한다.
  - 분석 실패 시 랜덤 파형을 만들지 않고 빈 파형 상태로 fallback한다.
* **Subtitle Engine**:
  - `.srt`, `.vtt` 파일을 브라우저에서 읽어 subtitle cue로 파싱한다.
  - cue별 start/end time을 subtitle clip으로 자동 생성한다.
  - import 시 HTML/ASS 태그를 제거하고 줄바꿈을 정리한다.
  - Preview와 Export는 subtitle safe area를 적용해 화면 가장자리로 너무 붙지 않게 표시한다.
  - Export는 여러 줄 자막을 자동 wrap해 렌더링한다.
* **Render Queue**:
  - Export UI에서 현재 export 설정을 render job으로 큐에 추가한다.
  - pending/running/completed/cancelled/failed 상태와 진행률을 표시한다.
  - pending job 취소와 failed/cancelled job 재시도를 지원한다.
  - 큐에 들어간 job의 해상도/FPS/화질 snapshot을 실제 렌더 옵션으로 전달한다.
  - 출력 파일은 사용자 PC 다운로드로 유지하고 큐에는 메타데이터와 상태만 저장한다.
* **Transition Engine**:
  - 기존 `fade`, `zoom`, `slide`, `blur`에 더해 `wipe`, `push`, `spin`, `glitch`, `flash`, `dip-to-black`, `cross-zoom` 전환 타입을 선택할 수 있다.
  - Preview의 이미지/비디오 레이어와 Export Canvas는 `render/videoRenderMath.ts`의 동일한 transition 계산을 사용한다.
  - `wipe`는 clip/inset 기반 reveal로 처리하고, 나머지 신규 전환은 transform/filter/opacity 조합으로 처리한다.
* **WebGL Effects Renderer**:
  - 이미지/비디오 클립 export에서 WebGL shader 기반 brightness, contrast, saturation, blur, grayscale, sepia 처리를 우선 시도한다.
  - WebGL 미지원 또는 렌더 실패 시 기존 Canvas `filter` 기반 렌더링으로 즉시 fallback한다.
  - Preview의 CSS/filter 기반 상호작용은 유지하며, export 쪽에만 독립 유틸리티를 연결했다.
* **WebCodecs 제한**:
  - 현재는 video-only export이다. 오디오는 포함하지 않는다.
  - 720p/1080p, 30fps를 우선 지원한다.
  - 브라우저 미지원, 해상도/FPS 미지원, 인코딩 실패 시 `Quick WebM`으로 fallback한다.
  - Worker 기반 고속 렌더는 아직 연결되지 않았다.
* **1차 통합 상태**: Export UI는 Fast WebCodecs, Quick WebM, Compatible MP4, 브라우저 지원 감지, bitrate preset, fallback 안내, Render Queue를 하나의 export flow로 묶는다.

### 3-2-1. Render Math (`src/components/studio/video/editor/render/videoRenderMath.ts`)
* **역할**: Preview와 Export가 공유해야 하는 motion, effects, transition, audio mix 계산을 분리한 유틸리티.
* **현재 사용처**: `VideoEditorRenderCanvas`가 motion/effects/transition/audio 계산을 사용한다. `VideoEditorPreviewPlayer`도 이미지/비디오 레이어 motion keyframe과 transition 계산을 이 유틸리티에서 가져온다.

### 3-2-2. WebGL Effects Renderer (`src/components/studio/video/editor/render/webglEffectsRenderer.ts`)
* **역할**: export 프레임 생성 중 이미지/비디오 클립의 색상/블러 효과를 WebGL shader로 처리한다.
* **지원 효과**:
  - `brightness`
  - `contrast`
  - `saturation`
  - `blur`
  - `grayscale`
  - `sepia`
* **Fallback**: WebGL context 생성, shader compile/link, texture upload, draw 중 실패하면 `null`을 반환하고 `VideoEditorRenderCanvas`가 기존 Canvas filter 렌더로 대체한다.

### 3-2-3. Audio Mixdown (`src/components/studio/video/editor/export/audioMixdown.ts`)
* **역할**: export 시 오디오 클립과 비디오 원본 오디오 소스를 수집하고 WebAudio에 스케줄링한다.
* **반영 설정**:
  - `volume`
  - `muted`
  - `fadeIn`
  - `fadeOut`
  - `audioGain`
  - `audioPan`
  - `trimStart`
  - `trimEnd`
* **Fallback**: 브라우저가 특정 오디오/비디오 소스의 오디오 트랙을 디코딩하지 못하면 해당 소스를 건너뛰고 나머지 export를 계속한다.

### 3-2-4. Audio Waveform Cache (`VideoEditorContext.tsx`)
* **역할**: 업로드 파일의 실제 오디오 샘플을 분석해 timeline/library/mixer에서 사용할 waveform을 생성하고 캐시한다.
* **저장 위치**: IndexedDB `media-waveforms` object store.
* **캐시 키**: `file.name:file.size:file.lastModified`.
* **보안/프라이버시**: 원본 미디어 파일은 브라우저 로컬 IndexedDB와 Object URL에만 남고 서버로 전송하지 않는다.

### 3-3. `convertWebmToMp4` (`src/components/studio/video/editor/ffmpeg/convertWebmToMp4.ts`)
* **역할**: 브라우저 레코더 스트림(WebM)을 다운로드 가능한 H.264 MP4로 트랜스코딩한다.
* **로드 최적화**: 로컬 서버의 공유 어레이 헤더 차단 우회를 위해 `https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd` 경로를 통해 동적 UMD core/wasm 바이너리를 런타임에 직접 Fetch 해옵니다.
* **취소 처리**: 변환 취소 시 FFmpeg WASM 작업을 terminate하고 singleton 인스턴스를 초기화한다.

### 3-4. `VideoEditorExportPanel` (`src/components/studio/video/editor/VideoEditorExportPanel.tsx`)
* **역할**: 해상도, FPS, 화질, export engine 선택과 내보내기 진행 상태를 표시한다.
* **현재 UI 상태**:
  - 기본 해상도: 720p, 1080p.
  - Advanced 해상도: 2K, 4K.
  - 기본 FPS: 24fps, 30fps.
  - Advanced FPS: 60fps.
  - 고화질/표준/저용량 품질 프리셋 선택.
  - 해상도/FPS/화질별 권장 bitrate 표시 및 렌더러 전달.
  - 예상 프레임 수와 고부하 export 경고 표시.
  - `Fast WebCodecs` / `Quick WebM` / `Compatible MP4` 엔진 선택.
  - WebCodecs 지원 여부 감지 결과 표시.
  - WebGL FX 지원 여부 표시. 미지원 시 Canvas filter fallback 상태를 안내한다.
  - Fast WebCodecs의 video-only 제한과 Quick WebM fallback 경로 표시.
  - Worker preflight 결과 표시. Worker/OffscreenCanvas 사용 가능 여부를 확인하고, 실패 시 메인 스레드 export fallback을 안내한다.
  - 렌더링/변환 진행률, 취소 버튼, 완료/실패/취소 상태 표시.
  - Render Queue 목록, pending 취소, failed/cancelled 재시도 표시.
* **페이지 이탈 주의**: 내보내기 중 브라우저 새로고침/탭 닫기에는 경고를 표시한다. 현재 Render Queue는 브라우저 메모리 singleton 상태이며 새로고침을 견디는 영구 큐는 아니다.

### 3-5. Export Job Store (`src/components/studio/video/editor/export/exportJobStore.ts`)
* **역할**: 내보내기 작업의 현재 엔진, 단계, 진행률, 완료/실패/취소 상태를 컴포넌트 외부 singleton store로 관리한다.
* **효과**: Export 모달을 닫았다가 다시 열어도 현재 job 상태와 render queue 상태를 유지할 수 있다.
* **Render Queue 상태**: `pending`, `running`, `completed`, `cancelled`, `failed`.
* **저장 정책**: 큐에는 엔진, 해상도, FPS, 화질, 길이, 진행률, timestamp 등 메타데이터만 저장한다. 출력 파일은 사용자 PC로 다운로드된다.
* **제한**: 아직 새로고침/탭 닫기 이후 복구되는 영구 큐는 아니다. `video_project_exports` DB 연결은 이후 메타데이터 persistence 단계에서 확장한다.

### 3-6. Export Worker Support (`src/components/studio/video/editor/export/exportWorkerSupport.ts`)
* **역할**: 브라우저 Worker 생성, Worker 통신, OffscreenCanvas 지원 여부를 preflight로 확인한다.
* **현재 정책**: Worker preflight가 실패하거나 OffscreenCanvas가 없으면 기존 main-thread export로 fallback한다.
* **제한**: 현재 실제 Canvas/Video 렌더는 DOM 의존성이 있으므로 Worker로 완전히 이동하지 않았다.

### 3-7. `VideoEditorTransitionPanel` (`src/components/studio/video/editor/VideoEditorTransitionPanel.tsx`)
* **역할**: 선택한 클립의 시작/끝 전환 타입을 설정한다.
* **지원 타입**: `none`, `fade`, `zoom`, `slide`, `blur`, `wipe`, `push`, `spin`, `glitch`, `flash`, `dip-to-black`, `cross-zoom`.
* **프리셋**: 부드러운 영상, 쇼츠 스타일, 몽환적 전환, 다이내믹 전환, 임팩트 전환, 초기화 프리셋을 제공한다.

### 3-8. `VideoEditorMotionPanel` (`src/components/studio/video/editor/VideoEditorMotionPanel.tsx`)
* **역할**: 선택한 클립의 위치, 크기, 회전, 투명도, 플립, 크롭, anchor, motion preset을 설정한다.
* **Keyframe 기능**:
  - 현재 재생 위치를 클립 내부 시간으로 환산해 motion keyframe을 추가/업데이트한다.
  - 현재 위치에 가까운 keyframe을 삭제할 수 있다.
  - Ken Burns 프리셋과 전체 keyframe 초기화를 제공한다.
* **제한**: 현재는 선형 보간만 지원하며 easing curve 편집은 아직 없다.

### 3-9. `VideoEditorAudioMixer` / `VideoEditorClip` / `VideoEditorUnifiedLibrary`
* **역할**: 실제 waveform array를 오디오 믹서, 타임라인 클립, 미디어 라이브러리 카드에 표시한다.
* **Fallback 표시**: waveform이 없으면 낮은 baseline bar만 표시해 실제 분석값과 장식 파형을 구분한다.

### 3-10. Subtitle Import (`src/components/studio/video/editor/subtitle/subtitleImport.ts`)
* **역할**: SRT/VTT 텍스트를 `startTime`, `endTime`, `text` cue 배열로 변환한다.
* **지원 포맷**:
  - SRT timestamp: `00:00:01,000 --> 00:00:03,000`
  - VTT timestamp: `00:00:01.000 --> 00:00:03.000`
  - `WEBVTT` header는 자동 제거한다.
* **정리 규칙**: HTML 태그, ASS 스타일 태그, 불필요한 공백을 제거하고 실제 줄바꿈은 보존한다.

### 3-11. `VideoEditorAddTextPanel` / `VideoEditorSubtitleLayer`
* **역할**: 텍스트/자막 추가와 SRT/VTT import, subtitle preview 편집을 담당한다.
* **Import UI**: `SRT/VTT 자막 가져오기` 버튼으로 로컬 파일을 읽고 subtitle clip들을 생성한다.
* **Safe Area**: Preview subtitle layer는 x 10~90%, y 12~88% 범위 안에 표시한다.
* **Style Preset**: `VideoEditorTextStylePanel`에서 `안전 자막`, `클린 자막` 프리셋을 제공한다.
