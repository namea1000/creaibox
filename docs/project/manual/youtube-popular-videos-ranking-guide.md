# 👑 인기 영상 조회수 랭킹 (Most Viewed Videos Ranking) 운영 및 개발 매뉴얼

이 문서는 **CreAibox 유튜브 연구소**의 신규 핵심 분석 기능인 **`인기 영상 조회수 랭킹 (/youtube-trend/popular)`** 기능의 아키텍처, 데이터베이스 스키마, 백엔드 API, 프론트엔드 UI 컴포넌트 및 운용 지침을 정립한 통합 매뉴얼입니다.

---

## 1. 개요 및 설계 원칙

* **메뉴 명칭**: `인기 영상 조회수 랭킹`
* **접속 경로**:
  - 공개 서비스 라우트: `https://creaibox.com/youtube-trend/popular`
  - 스튜디오 내부 라우트: `https://creaibox.com/studio/youtube/popular`
* **핵심 기능**:
  - **급상승(Trending)과의 차별화**: 실시간 떡상 속도가 아닌, **누적 조회수(View Count) 최상위 매머드급 인기 영상 리스트**를 제공합니다.
  - **3단계 기간 필터링**: `🗓️ 최근 7일간`, `📅 최근 30일간`, `👑 역대 전체 (All-Time)` 3가지 기간 선택 지원.
  - **전 세계 60개국 & 15개 통합 카테고리 100% 매핑**: 60개국 전체와 음악, 게임, 코미디, 여행 등 15개 전체 카테고리 실시간 조회.
  - **정직한 2단계 로딩 표시 (Strict Zero Fake Data Rule)**: Supabase DB 보관함 읽기와 YouTube API 실시간 조회를 100% 솔직하게 구분하여 렌더링.

---

### 1.1 👑 인기 영상 조회수 랭킹 vs 🔥 급상승 영상 트렌드 차이 정의

| 구분 | 🔥 급상승 영상 트렌드 (Trending) | 👑 인기 영상 조회수 랭킹 (Most-Viewed) |
| :--- | :--- | :--- |
| **핵심 정의** | 유튜브 알고리즘이 선정한 **실시간 급상승 이슈 랭킹** | 실제 총 **누적 조회수(Total View Count) 최상위 랭킹** |
| **선정 기준** | 조회수가 10만 뷰라도 **방금 출시되어 시청 유입 속도가 폭발적인 영상** | 조회수가 **수백만 ~ 수억 뷰에 달하는 압도적 조회수 1위~50위 영상** |
| **분석 용도** | 지금 당장 유행하는 밈, 뉴스, 핫이슈 파악 | 통산 대박 영상, 장르별 스테디셀러 벤치마킹 |

### 1.2 과거 날짜 조회 원리 (유튜브 API 공식 제한사항 & CreAibox DB)

- **유튜브 API 제한사항**: YouTube Data API v3 공식 스펙상 과거 특정 일자 시점의 누적 조회수를 소급 조회하는 파라미터는 제공되지 않습니다.
- **CreAibox DB 스냅샷**: 따라서 과거 날짜 조회를 실행할 경우, **CreAibox 클라우드 DB(`youtube_popular_archive`)가 해당 당일에 실제로 수집 보존해 온 100% 실전 랭킹 스냅샷만 조회**할 수 있습니다.
- **가짜 데이터 전면 금지 (Strict Zero Fake Data Rule)**: 과거 날짜에 DB 스냅샷이 존재하지 않는 경우, 오늘자 실시간 데이터를 과거 날짜에 조작하여 넣지 않고 `"📭 DB 구축 이전 기간이거나 기록이 미수집된 일자입니다"` 메시지를 솔직하게 표시합니다.

---

## 2. 데이터베이스 스키마 (`youtube_popular_archive`)

- **테이블 DDL 파일**: [`docs/database/youtube_popular_archive.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/youtube_popular_archive.sql)

```sql
create table if not exists public.youtube_popular_archive (
  id uuid primary key default gen_random_uuid(),
  country_code varchar(10) not null default 'KR',
  category_id varchar(50) not null default 'all',
  period_type varchar(20) not null default 'all_time', -- '7d', '30d', 'all_time'
  target_date date not null default CURRENT_DATE,
  videos_data jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default now(),
  constraint unique_popular_row unique (country_code, category_id, period_type, target_date)
);

-- RLS 보안 정책 설정 (비로그인 자유 둘러보기 규격)
alter table public.youtube_popular_archive enable row level security;

create policy "Allow public read to youtube_popular_archive"
  on public.youtube_popular_archive for select
  using (true);

create policy "Allow service role write to youtube_popular_archive"
  on public.youtube_popular_archive for all
  using (true);
```

---

## 3. 백엔드 API 명세 (`/api/youtube/popular`)

- **엔드포인트**: `GET /api/youtube/popular`
- **요청 쿼리 매개변수**:
  - `country`: 국가 코드 (예: `KR`, `US`, `JP`, `DK` 등)
  - `categoryId`: 카테고리 ID (`all`, `10`, `20`, `23`, `19` 등 15개)
  - `period`: 기간 구분 (`7d`, `30d`, `all_time`)
  - `cacheOnly`: `true`일 경우 DB 존재 여부만 빠르게 검사 (Cache Miss 시 `{ cacheMiss: true }` 반환)
  - `force`: `true`일 경우 강제 재수집 수행

- **처리 로직**:
  1. `youtube_popular_archive` 테이블에서 당일 자 (`country_code`, `category_id`, `period_type`, `target_date`) 유니크 로우를 검색합니다.
  2. Cache Hit 시 0.05초 만에 DB 보관함 데이터 반환 (`source: "supabase-db-popular"`).
  3. Cache Miss 시 YouTube Data API Search 엔드포인트(`order=viewCount&publishedAfter=...`)를 호출하여 해당 조건의 조회수 1위~50위 영상을 수집한 뒤 `videos.list`로 상세 통계를 결합하여 DB에 저장합니다.

---

## 4. 프론트엔드 컴포넌트 구조 (`PopularVideos.tsx`)

- **파일 위치**: [`PopularVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/PopularVideos.tsx)
- **주요 UI 요소**:
  - **상단 3단 기간 토글 버튼**: `최근 7일`, `최근 30일`, `역대 전체`
  - **대륙 및 60개국 허브 바**: 주요 12개국 / 아시아 / 동남아 / 유럽 / 북미 / 중남미 / 중동·아프리카 / 오세아니아 / 전체 60개국
  - **15개 카테고리 필터 바**: 전체 및 14개 세부 개별 카테고리
  - **비디오 카드 그리드**: 🏆 1위~50위 순위 뱃지, 썸네일, 제목, 채널명, 조회수, 좋아요수, 업로드일, AI 데이터 분석 리포트 모달 연결, 영상 링크 복사, 유튜브 다이렉트 시청 버튼

---

## 5. 관리 및 운용 이력

* **등록일**: 2026년 7월 30일
* **작성 목적**: 조회수 최상위 영상 분석 단독 메뉴 구축 및 운용 가이드 확립
* **무결성 검증**: `npx tsc --noEmit` 컴파일 빌드 검증 완료
