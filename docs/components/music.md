# 음악 스튜디오 컴포넌트 (Music Studio Components)

뮤직 스튜디오의 핵심 시각적 인터페이스 및 연산 도구 모듈 구성입니다.

---

## 1. 가사 & SUNO 생성 컴포넌트

### 1-1. `LyricsInputPanel` (`src/components/music/lyrics/LyricsInputPanel.tsx`)
* **역할**: 장르, 세부 기분, 키워드, 그리고 SUNO 특화 프롬프트(악기 구성, 템포 등)를 입력하기 위한 폼 패널.
* **주요 기능**:
  - 장르 선택기 (Lo-Fi, Synthwave, City Pop, K-Pop, Ballad 등).
  - 주제 및 가사 톤앤매너 지정 슬라이더/드롭다운.
  - 가사 생성 API 요청 바인딩.

### 1-2. `LyricsResultPanel` (`src/components/music/lyrics/LyricsResultPanel.tsx`)
* **역할**: 생성된 AI 가사 결과물을 구절 단위(Verse, Chorus, Outro)로 시각화하고 복사/수정할 수 있도록 지원하는 패널.
* **주요 기능**:
  - 생성된 텍스트 본문 원클릭 클립보드 복사.
  - SUNO 프롬프트 템플릿(장르 태그, 곡 구조 설명) 별도 추출 기능.

### 1-3. `LyricsControlPanel` (`src/components/music/lyrics/LyricsControlPanel.tsx`)
* **역할**: 생성 작업 상태 제어, 이전 생성 기록 조회 및 로컬 영속화 관리 헬퍼.

---

## 2. 오디오 비주얼라이저 (`src/app/studio/music/visualizer`)

* **기능 개요**: 사용자가 음악 파일(mp3, wav 등)을 오디오 트랙으로 등록하면, 브라우저의 Web Audio API를 활용하여 오디오 주파수 스펙트럼 데이터를 실시간 분석하고, HTML5 Canvas에 기하학적인 그래픽(서클, 바, 스펙트럼 웨이브)을 프레임 단위로 드로잉합니다.
* **FFmpeg 비디오 인코더 연동 (`ffmpeg/exportMp4.ts`)**:
  - Canvas 렌더링 화면을 `MediaRecorder` API를 이용해 WebM 비디오 스트림으로 기록합니다.
  - 레코딩 완료 시 생성된 WebM 바이너리 블록을 브라우저 가상 머신에 할당된 FFmpeg.wasm 인스턴스에 입력합니다.
  - 아래의 CLI 옵션을 통해 H.264/AAC 코덱 기반의 고화질 MP4 파일로 변환하여 로컬 디스크에 다이렉트 다운로드시킵니다.
    ```bash
    ffmpeg -i input.webm -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart output.mp4
    ```
