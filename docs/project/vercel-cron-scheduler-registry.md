# Vercel Cron 스케줄러 관리 대장

본 문서는 크리에이박스(CreAibox) 플랫폼에 구축 및 활성화되어 있는 모든 **Vercel Cron 스케줄러(무인 자동화 배치 작업)**의 등록 현황과 스펙을 추적 관리하는 공식 대장입니다. 향후 새로운 크론 작업을 추가할 때 본 문서 하단에 양식에 맞춰 추가 기록해 주시기 바랍니다.

---

## 1. Vercel Cron 스케줄러 목록

| 순번 | 작업 명칭 | 실행 주기 (Cron) | 실행 시각 (KST 기준) | 대상 API 엔드포인트 | 보안 토큰 필요 여부 | 최초 등록일 | 현재 상태 |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| 1 | 유튜브 급상승 랭킹 자동 수집기 | `0 20 * * *` | 매일 05:00 (새벽) | `/api/cron/sync-trending` | **Y** (`CRON_SECRET`) | 2026-06-28 | **활성화** |

---

## 2. 세부 스케줄러 명세

### 2.1 유튜브 급상승 랭킹 자동 수집기
* **용도**: 8대 카테고리의 일일 유튜브 인기 동영상 12개 정보를 크립하여 Supabase 캐시 적재 및 구글 스프레드 시트 아카이빙을 새벽 무인 시간대에 선제 완료합니다.
* **경로**: `/api/cron/sync-trending`
* **크론 포맷 (UTC)**: `0 20 * * *` (UTC 오후 8시 = 한국 시각 KST 오전 5시)
* **주요 기능**:
  * 유튜브 Live Data API 호출 및 대기.
  * 1분 미만 비디오에 대한 Shorts 여부 리다이렉트 HEAD 교차 검증.
  * Supabase 캐시 테이블 `youtube_trending_archive` 에 업서트(Upsert).
  * 지정된 구글 시트(`GCP_TRENDING_SHEET_ID`) 하단으로 비디오 12개의 상세 메타데이터 행 누적 추가(Append).
* **보안 사양**: HTTP 헤더 `Authorization: Bearer ${process.env.CRON_SECRET}` 대조 검증을 통한 비인가 접근 차단 (로컬 개발 환경 제외).

---

## 3. 크론 신설 및 환경 설정 가이드

향후 플랫폼 내에 무인 포스팅 배포, 메일링 발송 등의 배치 스케줄러를 증설할 때는 아래 단계를 순차 이행합니다.

### 3.1 vercel.json에 크론 스케줄 선언
프로젝트 루트의 `vercel.json` 파일 내 `crons` 배열 하단에 신규 스펙을 추가 선언합니다:
```json
{
  "crons": [
    {
      "path": "/api/cron/your-new-task",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 3.2 크론 전용 API 라우터 구축
`src/app/api/cron/your-new-task/route.ts`에 비즈니스 로직을 빌드합니다. 보안을 위해 상단에 **`CRON_SECRET` 보안 가드**를 반드시 적용해야 합니다:
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // 비즈니스 로직 구현...
  return NextResponse.json({ success: true });
}
```

### 3.3 대장 문서 갱신
배포 후 본 문서(vercel-cron-scheduler-registry.md)의 **1. Vercel Cron 스케줄러 목록** 테이블 및 **2. 세부 스케줄러 명세**에 신규 스크립트를 누적 기입하여 문서의 무결성을 유지합니다.
