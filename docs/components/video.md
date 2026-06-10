# 비디오 스튜디오 컴포넌트 (Video Studio Components)

`CreAibox` 비디오 에디터 모듈은 브라우저 내에서 복수의 비디오 클립, 텍스트 효과, 음향 트랙을 시간축 기반으로 배치 및 조작할 수 있는 **SPA(Single Page Application) 비디오 편집 모듈**입니다.

---

## 1. 비디오 에디터 구조 모듈 (Editor Shell & Sidebar)

### 1-1. `VideoEditorShell` (`src/components/studio/video/editor/VideoEditorShell.tsx`)
* **역할**: 전체 편집기 레이아웃을 통제하는 중추 컴포넌트.
* **배치**: 좌측 도구 사이드바, 중앙 프리뷰 캔버스, 하단 타임라인, 우측 속성 인스펙터 패널의 그리드 영역을 조율하고 Context Provider를 바인딩합니다.

### 1-2. `VideoEditorSidebar` (`src/components/studio/video/editor/VideoEditorSidebar.tsx`)
* **역할**: 작업 영역에 삽입할 리소스와 기능을 선택하는 탭 탐색기.
* **연동 서브 패널**:
  - `VideoEditorMediaLibrary`: 사용자 업로드 동영상/음악 에셋 목록.
  - `VideoEditorStockPanel`: 무료 스톡 영상 라이브러리 연동.
  - `VideoEditorTextLayer`: 스타일 텍스트 및 효과 문자 삽입기.
  - `VideoEditorSubtitleLayer`: 시간 프레임별 자막 트랙 관리.
  - `VideoEditorTransitionPanel`: 화면 전환 트랜지션 리스트.
  - `VideoEditorAiAssetsPanel`: AI 썸네일 및 이미지 제너레이터 연동 패널.

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

### 3-2. `convertWebmToMp4` (`src/components/studio/video/editor/ffmpeg/convertWebmToMp4.ts`)
* **역할**: 브라우저 레코더 스트림(WebM)을 다운로드 가능한 H.264 MP4로 무손실 트랜스코딩 수행.
* **로드 최적화**: 로컬 서버의 공유 어레이 헤더 차단 우회를 위해 `https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd` 경로를 통해 동적 UMD core/wasm 바이너리를 런타임에 직접 Fetch 해옵니다.
