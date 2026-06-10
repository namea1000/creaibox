# 제작자 스튜디오 페이지 명세 (Studio Pages)

`CreAibox` 콘텐츠 제작자용 작업 공간 대시보드 화면(라우팅 및 구성 컴포넌트) 정의서입니다.

---

## 1. 전역 레이아웃 및 대시보드

### 1-1. 스튜디오 기본 레이아웃 (`/studio` -> `app/studio/layout.tsx`)
* **설명**: CreAibox의 공통 제작자용 좌측 메뉴 사이드바(Aside), 탑 네비게이션바(Topbar) 및 다이내믹 메인 콘텐트 보드가 결합하는 구조.

### 1-2. 위젯 대시보드 (`/studio/dashboard` -> `app/studio/dashboard/page.tsx`)
* **설명**: 사용자가 필요한 위젯(메모장, 단어 수 계산, 투두리스트 등)을 원하는 위치와 크기로 자유롭게 배치할 수 있는 대시보드.
* **DB 연동**: `studio_widgets` 및 `cre_notes`, `cre_note_folders`를 불러와 드래그앤드롭 격자 그리드 배치.

---

## 2. 제작 도구 패키지

### 2-1. 자료 조사 연구소 (`/studio/research`)
* **프로젝트 생성 (`create/page.tsx`)**: 리서치 분석 범위 및 타겟 설정.
* **리서치 채팅 (`chat/page.tsx`)**: 수집된 자료 기반 AI 질문 답변.
* **자료 보관함 (`library/page.tsx`)**: PDF, 웹 아카이빙 등 외부 레퍼런스 데이터 축적.
* **콘텐츠 생성 (`content/page.tsx`)**: 연구 결과를 문장으로 추출.

### 2-2. 뮤직 스튜디오 (`/studio/music`)
* **곡 기획 (`planning/page.tsx`)**: 장르, 템포, 앨범 기획안 작성.
* **가사 & SUNO (`lyrics/page.tsx`)**: 가사 텍스트 라이팅 및 프롬프트 생성.
* **앨범 관리 (`albums/page.tsx`)**: 개별 음악을 앨범 앨범아트로 합산.
* **비주얼라이저 (`visualizer/page.tsx`)**: 재생 주파수에 매칭되는 반응형 영상 제작.

### 2-3. 비디오 스튜디오 (`/studio/video/editor`)
* **영상 편집기 (`editor/page.tsx`)**: 비주얼 타임라인 프레임에 맞춰 미디어 자르고 자막 넣고 사운드를 조율해 클라이언트 사이드 비디오 인코딩.

### 2-4. 블로그 포스팅 스튜디오 (`/studio/writing`)
* **네이버 블로그 (`naver/page.tsx`)**: 키워드 상위 매트릭스 도출 및 복제 글 생성.
* **워드프레스 (`wp/page.tsx`)**: 계정 API 기반 퍼블리싱 및 리치 에디터 작성.
* **CreAibox 포스트 (`creaibox/page.tsx`)**: 포스트 슬러그 제어, 태그 및 구글 SEO 최적화 인덱싱.
