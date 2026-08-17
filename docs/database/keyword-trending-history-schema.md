# [Database Schema] Keyword Trending History (키워드 트렌드 아카이빙 스키마)

> **문서 분류**: 데이터베이스 스키마 명세서 (Database Schema Spec)
> **연관 아키텍처 명세서**: `docs/arch/06_trend-and-marketing/keyword-trend-studio.md`
> **연관 실무 매뉴얼**: `docs/project/manual/06_trend-and-marketing/keyword-trending-archiving-guide.md`
> **연관 실행 SQL**: `docs/database/sql/keyword_trending_history.sql`

---

## 1. 개요
네이버 데이터랩 및 구글 트렌드의 실시간 급상승 키워드를 1시간 단위로 무인 수집하여 날짜(`target_date`)별 1줄(Row)의 JSONB 구조로 압축 저장하는 일자별 트렌드 아카이빙 테이블 명세서입니다.

## 2. 테이블 명세: `public.keyword_trending_history`

| 컬럼명 | 데이터 타입 | Nullable | 기본값 | 설명 |
|---|---|:---:|---|---|
| `target_date` | `date` | NO | (PK) | 수집 기준 날짜 (예: 2026-08-17) |
| `hourly_data` | `jsonb` | NO | `'{}'::jsonb` | 0시~23시까지의 네이버/구글 시간대별 키워드 배열 데이터 |
| `updated_at` | `timestamptz` | NO | `now()` | 최종 업데이트 일시 |

## 3. JSONB 구조 예시 (`hourly_data`)
```json
{
  "0": {
    "naver": [{"rank": 1, "keyword": "키워드A", "ratio": 95}],
    "google": [{"rank": 1, "keyword": "키워드B", "traffic": "100K+"}]
  },
  "1": { ... },
  "23": { ... }
}
```

## 4. RLS 보안 정책
- `SELECT`: 모든 사용자 및 익명 사용자 공개 읽기 허용 (`USING (true)`)
- `ALL (INSERT/UPDATE)`: 백그라운드 크론/배치 작업을 위해 `service_role` 전용 허용
