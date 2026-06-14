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

### 2-5. AI 콘텐츠 플래너 (`/studio/content-planner`)
* **아이디어 허브 (`idea-hub/page.tsx`)**: 콘텐츠 기획을 위한 대분류(10개), 상세분야(50개), 추천 시리즈 목록을 제공하고, 한글/영문 병기 명칭 및 다국어 키워드 검색 매칭, 4자리수 연도(Evergreen) 제거 필터를 거쳐 기획용 메인 키워드 주제를 선별하는 탐색기 화면.
* **콘텐츠 기획실행 (`planning/page.tsx`)**: 기획할 주제와 목표(조회수, 수익화 등), 발행 플랫폼, 상세 조건(어조, 대상 독자 등)을 조합하여 AI 콘텐츠 기획서(캠페인 및 세부 아웃라인)를 실행 및 작성하는 메인 빌더.
* **기획 보관함 (`library/page.tsx`)**: 생성된 기획서(캠페인 및 개별 아이템) 목록을 조회, 통계 카드 확인 및 플랫폼별 스튜디오로 전달하는 아카이브 보관함.

### 2-6. 키워드 트렌드 분석 스튜디오 (`/studio/keyword`)
* **메인 제어 센터 (`page.tsx`)**: 키워드 연구소 홈. 누적 통계 지수 및 10개 핵심 분석 도구 네비게이션 그리드 제공.
* **상세 분석 도구 (`[section]/page.tsx`)**: dynamic routing을 통해 대량 조회(`bulk`), 연관어(`related`), 형태소(`morphology`), 순위추적(`rank`), 급상승(`rising`), 유튜브(`youtube`), SEO경쟁(`seo`), AI전략(`strategy`), 연결워크플로우(`workflow`), 트렌드대시보드(`dashboard`) 마운트.

### 2-7. 유튜브 트렌드 분석 스튜디오 (`/studio/youtube`)
* **메인 제어 센터 (`page.tsx`)**: 유튜브 연구소 홈. 누적 채널/영상 통계 카드 및 10개 세부 연동 도구 네비게이션 그리드 제공.
* **상세 분석 도구 (`[section]/page.tsx`)**: dynamic routing을 통해 채널분석(`channel`), 인기급상승(`rising`), 경쟁채널비교(`compare`), 광고계산기(`cpm`), SEO진단(`seo`), 쇼츠바이럴(`shorts`), 썸네일CTR(`thumbnail`), AI제목추천(`title`), 전략리포트(`report`), 일괄워크플로우(`workflow`) 마운트.



