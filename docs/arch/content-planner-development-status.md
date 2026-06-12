# AI 콘텐츠 플래너(Content Planner) 개발 현황 및 아키텍처

## 개요

AI 콘텐츠 플래너(Content Planner)는 CreAIbox의 콘텐츠 생산 허브 역할을 담당한다.

기존에는 글쓰기 스튜디오, 네이버 글쓰기, 유튜브 콘텐츠 기획 등이 각각 분리된 형태였으나, 앞으로는 모든 콘텐츠 제작이 콘텐츠 플래너에서 시작되는 구조를 목표로 한다.

즉,

콘텐츠 플래너 → 콘텐츠 기획 → 플랫폼별 제작

이라는 흐름을 중심으로 CreAIbox 전체 콘텐츠 생산 체계를 구성한다.

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
├─ mock-data.ts
├─ supabase.ts
└─ scoring.ts (예정)
```

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

Content Planner는 CreAIbox 전체의 콘텐츠 전략 허브 역할을 담당한다.

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
