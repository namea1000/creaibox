# AI 콘텐츠 플래너(Content Planner) 개발 현황 및 아키텍처

## 개요

AI 콘텐츠 플래너(Content Planner)는 CreAibox의 콘텐츠 생산 허브 역할을 담당한다.

기존에는 글쓰기 스튜디오, 네이버 글쓰기, 유튜브 콘텐츠 기획 등이 각각 분리된 형태였으나, 앞으로는 모든 콘텐츠 제작이 콘텐츠 플래너에서 시작되는 구조를 목표로 한다.

즉,

콘텐츠 플래너 → 콘텐츠 기획 → 플랫폼별 제작

이라는 흐름을 중심으로 CreAibox 전체 콘텐츠 생산 체계를 구성한다.

---

# 핵심 목표

하나의 아이디어 또는 키워드로부터 다양한 플랫폼용 콘텐츠를 동시에 기획하고 제작할 수 있도록 한다.

지원 플랫폼

* Creaibox 블로그
* 네이버 블로그
* YouTube Shorts
* YouTube 롱폼
* TikTok
* 네이버 클립
* Instagram Reels
* SNS 카드뉴스
* 뉴스레터
* 멀티 플랫폼 캠페인

---

# 콘텐츠 생산 구조

```text
Content Planner
    │
    ├─ Creaibox 블로그
    ├─ 네이버 블로그
    ├─ YouTube Shorts
    ├─ YouTube Longform
    ├─ TikTok
    ├─ 네이버 클립
    ├─ Instagram Reels
    ├─ SNS 카드뉴스
    └─ 뉴스레터
```

하나의 콘텐츠 기획은 여러 플랫폼으로 확장 가능하도록 설계한다.

---

# 현재 구현 완료 범위

## 프론트엔드

완료

* 콘텐츠 플래너 메인 페이지
* 콘텐츠 아이디어 허브 (Idea Hub) 페이지 (`idea-hub/page.tsx`)
  - 대분류 및 상세분야 탐색 인터페이스
  - 추천 시리즈 사이드바 필터 및 상세 요약 패널
  - 메인 키워드 주제 그리드 리스트
* Hero 영역
* 기회 키워드 카드
* 콘텐츠 목표 선택
* 플랫폼 선택
* 콘텐츠 조건 입력
* 트렌드 허브
* 전략 분석 패널
* AI 기획 실행 패널
* 생성 결과 패널
* 추천 시리즈 패널
* 기획 요약 패널
* 액션 패널

---

## 라이브러리

완료

* 콘텐츠 기획 라이브러리
* 캠페인 목록 조회
* 캠페인 상세 조회
* 아이템 목록 조회
* 검색 기능
* 삭제 기능
* 통계 카드
* 토픽 카테고리 정의 (`src/lib/content-planner/topic-categories.ts`)
* 토픽 시리즈 데이터 정의 (`src/lib/content-planner/topic-series.ts` 및 하위 개별 시리즈 데이터)

---

## 컴포넌트 구조

```text
src/components/studio/content-planner
│
├─ ContentPlannerHero.tsx
├─ ContentOpportunityCards.tsx
├─ ContentGoalPanel.tsx
├─ ContentPlatformPanel.tsx
├─ ContentConditionPanel.tsx
├─ TrendHubPanel.tsx
├─ StrategyAnalysisPanel.tsx
├─ PlannerExecutionPanel.tsx
├─ CampaignResultPanel.tsx
├─ AiRecommendationPanel.tsx
├─ PlannerSummaryPanel.tsx
├─ PlannerActionPanel.tsx
└─ index.ts
```

---

## 라이브러리 구조

```text
src/lib/content-planner
│
├─ types.ts
├─ options.ts
├─ supabase.ts
├─ topic-categories.ts   # 대분류(10개), 상세분야(50개), 추천 시리즈 데이터 정의 (한/영 병기 및 키워드 매핑)
├─ topic-series.ts       # 기획용 메인 키워드 주제 로드 및 한/영 번역 핵심 키워드 매칭, Evergreen 연도 제거
├─ idea-series/          # 50개 상세분야별 콘텐츠 아이디어 데이터 셋 (스포츠 20개 종목 확장 등)
└─ scoring.ts (예정)
```

---

# 아이디어 허브 (Idea Hub) 검색 및 다국어 아키텍처

글로벌 SEO 가치 증대 및 직관적인 사용자 탐색을 위해 아래와 같은 다국어 및 Evergreen 구조를 내장하고 있습니다.

## 1. 다국어(한/영) 병기 및 매칭 레이어
* **대분류 / 상세분야 / 추천 시리즈**:
  - 대분류 카드 하단에 영문 병기 (`Tech & Digital` 등)를 적용하고 텍스트 크기를 대칭시킴.
  - 상세분야 및 추천 시리즈 명칭을 `한글(English)` 형식으로 일괄 치환 (`자동차(Car)`, `골프(Golf)` 등).
  - 원래 한글 명칭과 영어 설명을 `keywords` 목록에 매칭시켜, 사용자가 한글(`"제미나이"`) 또는 영문(`"Gemini"`) 어떤 언어로 검색하더라도 자동으로 대상을 찾아 매칭 및 활성화하는 다국어 검색 치환 레이어 작동.

## 2. 메인 키워드 주제 영어 핵심 키워드 동적 병기
* **복합 명사 우선순위 치환**:
  - `topic-series.ts`에서 데이터를 내보낼 때 `getBilingualTitle` 유틸을 이용해 실시간으로 치환.
  - 글자 수가 긴 복합 명사(예: `"골프 클럽"` ➔ `"Golf Club"`)를 먼저 찾아 병기하고, 매칭되는 복합 명사가 없을 시 기본 단일 토픽어(예: `"골프"` ➔ `"Golf"`)를 치환하는 내림차순 NLP 방식 채택.
  * 예: `"골프 클럽 종류 정리"` ➔ `"골프 클럽(Golf Club) 종류 정리"`
  * 예: `"골프 입문 가이드"` ➔ `"골프(Golf) 입문 가이드"`
  * 예: `"Claude AI란 무엇인가?"` ➔ `"Claude(클로드) AI란 무엇인가?"` (영문/한글 양방향 치환 모두 지원)

## 3. Evergreen 동적 연도 필터
* 기획 데이터의 해마다 발생하는 연도 업데이트 리소스를 생략하기 위해, 타이틀 파싱 과정에서 모든 4자리수 연도(예: `2026`, `2025` 등)를 정규식 경계 매칭(`/\b20\d{2}\b\s?/g`)으로 자동 감지하여 공백과 함께 깨끗하게 제거.

---

# 데이터베이스 구조

## content_planner_campaigns

콘텐츠 캠페인(상위 기획)

예시

* AI 콘텐츠 자동화 시리즈
* 네이버 블로그 SEO 시리즈
* 쇼츠 성장 전략 시리즈

저장 정보

* 제목
* 설명
* 전략 요약
* 콘텐츠 유형
* 플랫폼
* 목표
* 메인 키워드
* 상태

---

## content_planner_items

캠페인 내부의 개별 콘텐츠

예시

* AI 콘텐츠 자동화로 블로그 운영하기
* 쇼츠 후킹 공식
* 네이버 검색 노출 체크리스트

저장 정보

* 제목
* 키워드
* 플랫폼
* 검색 의도
* 아웃라인
* CTA
* 점수

---

## content_planner_outputs

실제 제작 연결 기록

예시

* 블로그 생성
* 네이버 글 생성
* 쇼츠 생성
* SNS 카드뉴스 생성

---

## content_planner_keyword_snapshots

키워드 분석 결과 저장

예시

* 검색량
* 경쟁도
* CPC
* 트렌드 점수
* 수익화 점수

---

# 현재 개발 단계

완료

```text
기획 생성
↓
DB 저장
↓
라이브러리 조회
```

---

# 다음 개발 단계

## 1단계

콘텐츠 제작 연결

```text
블로그 제작
→ Writing Studio

네이버 제작
→ Naver Writing

쇼츠 제작
→ Shorts Studio

롱폼 제작
→ Video Studio

SNS 제작
→ Social Studio
```

---

## 2단계

실제 AI 엔진 연결

현재

```text
Mock Data
```

향후

```text
Gemini
OpenAI
Claude
Groq
```

지원

---

## 3단계

실시간 데이터 연결

예정

* Google Search
* Google Trends
* YouTube Trends
* Naver Search
* Naver DataLab
* Google News
* RSS

---

## 4단계

콘텐츠 캘린더

예정

```text
기획
↓
캘린더 등록
↓
예약 제작
↓
발행
```

---

# 최종 비전

Content Planner는 CreAibox 전체의 콘텐츠 전략 허브 역할을 담당한다.

사용자는 하나의 키워드 또는 주제만 입력하면,

* 블로그
* 네이버
* 쇼츠
* 롱폼
* 릴스
* 틱톡
* SNS

콘텐츠를 동시에 기획하고 생산할 수 있게 된다.

즉,

"모든 콘텐츠 생산의 출발점"

이라는 역할을 수행하는 것이 Content Planner의 최종 목표이다.
