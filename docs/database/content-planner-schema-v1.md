# Content Planner Database Schema v1

## 개요

Content Planner는 CreAIbox 전체 콘텐츠 생산 시스템의 출발점 역할을 담당한다.

사용자는 하나의 키워드 또는 주제를 기반으로 블로그, 네이버, 유튜브 쇼츠, 유튜브 롱폼, 틱톡, 인스타그램 릴스, SNS 카드뉴스, 뉴스레터 등 다양한 콘텐츠를 동시에 기획할 수 있다.

본 스키마는 콘텐츠 기획, 기획 아이템, 제작 결과물, 키워드 분석 데이터를 저장하기 위해 설계되었다.

---

# 테이블 구성

## 1. content_planner_campaigns

콘텐츠 기획 캠페인

상위 프로젝트 역할을 수행한다.

예시

* AI 콘텐츠 자동화 시리즈
* 네이버 블로그 SEO 시리즈
* 쇼츠 성장 전략 시리즈

### 주요 컬럼

| 컬럼               | 설명        |
| ---------------- | --------- |
| title            | 캠페인 제목    |
| description      | 캠페인 설명    |
| strategy_summary | 전략 요약     |
| content_type     | 콘텐츠 유형    |
| goals            | 콘텐츠 목표    |
| primary_platform | 대표 플랫폼    |
| target_platforms | 대상 플랫폼    |
| main_keyword     | 대표 키워드    |
| generated_count  | 생성된 콘텐츠 수 |
| status           | 상태        |

---

## 2. content_planner_items

개별 콘텐츠 아이템

하나의 캠페인 안에 여러 개의 콘텐츠 아이템이 포함된다.

예시

* AI 콘텐츠 자동화로 블로그 운영하기
* 쇼츠 후킹 공식
* 네이버 검색 노출 체크리스트

### 주요 컬럼

| 컬럼                | 설명        |
| ----------------- | --------- |
| campaign_id       | 상위 캠페인    |
| title             | 콘텐츠 제목    |
| content_type      | 콘텐츠 유형    |
| primary_platform  | 대표 플랫폼    |
| target_platforms  | 확장 플랫폼    |
| main_keyword      | 대표 키워드    |
| search_intent     | 검색 의도     |
| content_angle     | 콘텐츠 접근 방향 |
| hook              | 후킹 문구     |
| outline           | 아웃라인      |
| cta               | 행동 유도 문구  |
| opportunity_score | 기회 점수     |

---

## 3. content_planner_outputs

콘텐츠 제작 결과 추적

콘텐츠 플래너에서 생성된 아이템이 실제 제작으로 연결될 때 기록된다.

예시

* 블로그 생성
* 네이버 글 생성
* 쇼츠 생성
* SNS 카드뉴스 생성

### 주요 컬럼

| 컬럼                   | 설명         |
| -------------------- | ---------- |
| campaign_id          | 캠페인 ID     |
| item_id              | 콘텐츠 아이템 ID |
| output_type          | 결과물 유형     |
| platform             | 제작 플랫폼     |
| target_route         | 이동 경로      |
| generated_post_id    | 생성된 게시물 ID |
| generated_project_id | 연결 프로젝트 ID |
| external_url         | 외부 URL     |

---

## 4. content_planner_keyword_snapshots

키워드 분석 데이터

콘텐츠 생성 시점의 키워드 상태를 저장한다.

### 저장 정보

* 검색량
* 경쟁도
* CPC
* 트렌드 점수
* 수익화 점수
* 기회 점수
* 관련 키워드
* 급상승 키워드

---

# 데이터 흐름

```text
Content Planner
        ↓
Campaign 생성
        ↓
Items 생성
        ↓
Keyword Snapshot 저장
        ↓
Library 저장
        ↓
블로그 제작
네이버 제작
쇼츠 제작
SNS 제작
        ↓
Outputs 저장
```

---

# 상태(Status) 정의

## content_planner_campaigns

| 상태        | 설명       |
| --------- | -------- |
| draft     | 임시 저장    |
| generated | AI 생성 완료 |
| archived  | 보관       |
| trash     | 삭제       |

---

## content_planner_items

| 상태         | 설명    |
| ---------- | ----- |
| planned    | 기획 완료 |
| generating | 제작 중  |
| generated  | 제작 완료 |
| failed     | 실패    |
| skipped    | 제외    |
| trash      | 삭제    |

---

## content_planner_outputs

| 상태        | 설명    |
| --------- | ----- |
| pending   | 생성 대기 |
| generated | 생성 완료 |
| published | 발행 완료 |
| failed    | 실패    |
| trash     | 삭제    |

---

# RLS 정책

모든 테이블은 사용자별 데이터 분리를 적용한다.

기본 정책

* SELECT : 본인 데이터만 조회
* INSERT : 본인 데이터만 생성
* UPDATE : 본인 데이터만 수정
* DELETE : 논리 삭제 방식 사용

---

# 향후 확장 계획

v2 예정

* 콘텐츠 캘린더 연동
* 예약 발행 기능
* Google Trends 저장
* YouTube Trends 저장
* Naver DataLab 저장
* AI 모델별 생성 이력
* 콘텐츠 성과 분석 데이터

---

# 최종 목표

Content Planner는 CreAIbox 전체 콘텐츠 생산 허브 역할을 수행한다.

하나의 키워드만 입력하면,

* 블로그
* 네이버
* 쇼츠
* 롱폼
* 릴스
* 틱톡
* 카드뉴스
* 뉴스레터

콘텐츠를 동시에 기획하고 제작할 수 있는 구조를 목표로 한다.
