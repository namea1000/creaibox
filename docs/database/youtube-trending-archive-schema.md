# YouTube Trending Archive Schema

유튜브 대한민국 실시간 인기 차트(categoryId별)의 데이터를 날짜별로 수집하여 영구 아카이빙하고 캐싱하는 용도의 테이블 정의서입니다.

## 테이블 사양

### `youtube_trending_archive`

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | `PRIMARY KEY`, `IDENTITY` | 고유 일련번호 |
| `category_id` | `varchar(10)` | `NOT NULL` | 유튜브 카테고리 ID (예: `all`, `10`, `20`, `24`, `1`, `28`, `17`, `25`) |
| `target_date` | `date` | `NOT NULL` | 데이터가 수집 및 저장된 기준 날짜 (KST 기준 `YYYY-MM-DD`) |
| `videos_data` | `jsonb` | `NOT NULL` | 유튜브 API 응답 및 Shorts 2차 감지를 완수한 enriched 비디오 JSON 배열 데이터 |
| `created_at` | `timestamptz` | `DEFAULT now()`, `NOT NULL` | 최초 생성 시각 |
| `updated_at` | `timestamptz` | `DEFAULT now()`, `NOT NULL` | 최종 갱신 시각 |

* **복합 UNIQUE 제약 조건**:
  * 명칭: `unique_date_category`
  * 대상 컬럼: `(target_date, category_id)`
  * 목적: 특정 날짜에 동일한 카테고리의 트렌드 데이터가 중복하여 아카이빙되는 일을 원천 방지하고 1일 1회 UPSERT 캐싱을 타겟팅하기 위함입니다.

## 보안 및 행 수준 보안 (RLS)

* **Row Level Security (RLS)**: 활성화 (`ENABLE ROW LEVEL SECURITY`)
* **SELECT Policy**: 모든 로그인 회원(`authenticated`)에게 읽기 권한을 부여합니다.
* **INSERT/UPDATE**: 사용자는 수집 데이터를 임의 변조할 수 없으므로, API 라우터가 RLS 우회 권한인 `supabaseAdmin` 서비스 클라이언트를 사용해 내부적으로만 갱신(Upsert)하도록 설계합니다.
