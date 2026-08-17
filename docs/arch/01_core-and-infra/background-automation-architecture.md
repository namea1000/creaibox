# [Architecture Specification] Background Automation & Scheduler Pipeline

> **문서 분류**: 아키텍처 기술 명세서 (Architecture Spec)
> **연관 실무 매뉴얼**: `docs/project/manual/01_core-and-infra/background-automation-execution-5-methods-guide.md`

---

> **문서 분류**: 아키텍처 기술 명세서 (Architecture Spec)  
> **관련 모듈**: `vercel.json`, `.github/workflows/sync-trending.yml`, `src/app/api/cron/sync-keywords/route.ts`, `src/lib/server/google-indexing.ts`  
> **시스템 레이어**: GitHub Actions / Vercel Edge / Supabase pg_cron ↔ Background API Routes ↔ Search Engine Indexing Endpoints

---

## 1. 무인 백그라운드 자동화 아키텍처 (System Topology)

```mermaid
flowchart TD
    subgraph Schedulers [무인 스케줄러 계층]
        VercelCron[Vercel Cron vercel.json]
        GHActions[GitHub Actions Workflows]
        PGCron[Supabase pg_cron + pg_net]
    end

    subgraph CoreAPIs [백엔드 자동 수집 & 핑 라우트]
        KeywordRoute[/api/cron/sync-keywords]
        TrendingRoute[/api/cron/sync-trending]
        IndexingPing[Google Indexing / IndexNow Engine]
    end

    subgraph StorageEngine [데이터베이스 및 검색엔진]
        SupabaseDB[(Supabase PostgreSQL)]
        SearchEngines[Google / Naver / Bing Bots]
    end

    VercelCron -->|매시간 정각| KeywordRoute
    GHActions -->|매일 KST 06:00| TrendingRoute
    PGCron -->|상태 체크 SQL| SupabaseDB

    KeywordRoute -->|20개 실시간 검색어| SupabaseDB
    TrendingRoute -->|64개 카테고리 급상승| SupabaseDB
    IndexingPing -->|0.1초 Instant Ping| SearchEngines
```

---

## 2. 모듈별 기술 규격 및 통신 프로토콜 (Technical Specifications)

### 2.1 Vercel Cron Configuration (`vercel.json`)
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-keywords",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/sync-trending",
      "schedule": "0 21 * * *"
    }
  ]
}
```

### 2.2 GitHub Actions Runner Workflow (`.github/workflows/sync-trending.yml`)
- **실행 환경**: `ubuntu-latest`
- **시크릿 인증**: `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **타임아웃 핸들링**: 15분 타임아웃 오버라이드 지원 (Vercel 10초 제한 회피).

### 2.3 SEO 자동 색인 핑 프로토콜 (Indexing Protocol Specs)
- **Google Indexing API**: `https://indexing.googleapis.com/v3/urlNotifications:publish`
  - JWT OAuth2 Service Account 토큰 인증 (`https://www.googleapis.com/auth/indexing`)
- **IndexNow Standard Protocol**: `https://api.indexnow.org/indexnow`
  - Body Specification: `{ "host": "domain", "key": "hex_key", "urlList": ["full_url"] }`
  - Cooldown Window: 1시간 (`3600s`) 스마트 디바운싱 적용.

---

## 3. 리소스 및 자원 소모 매트릭스 (Resource Matrix)

| 스케줄러 엔진 | 1회 실행 타임아웃 | 월간 자원 소모 비용 | 주 사용 목적 |
| --- | --- | --- | --- |
| **Vercel Cron** | 10초~15초 | 무료 요금제 포함 (0원) | 경량 키워드 수집 및 핑 |
| **GitHub Actions** | 최대 6시간 | 월 2,000분 무료 (0원) | 대용량 유튜브/트렌드 수집 |
| **Supabase pg_cron** | DB 쿼리 스펙 | DB 내장 지원 (0원) | DB 내부 주기적 cleanup |
