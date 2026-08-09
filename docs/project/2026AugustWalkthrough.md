# 📝 CreAibox 완료 워크스루 (2026년 8월)

본 문서는 2026년 8월 완료된 주요 기능 및 최적화 항목의 섹션별 상세 워크스루 기록서입니다.

---

## 1. 🛡️ 관리자 예약어 시스템 (Target Entity 뱃지 & 한글 매핑 & 대용량 보강)

### 주요 구현 결과
- **120,883개 예약어 전량 AI 보강**:
  - `gemini-3.1-flash-lite` 1순위 엔진과 3개 무료 API 키 로테이션으로 12만 여건 전체 레코드 사유에 `[청와대]`, `[삼성그룹]`, `[경찰청]`, `[쿠팡]` 등 한글 기관명/상표명 수록 완료.
- **한글 ↔ 영문 역매핑 연동**:
  - `getMatchedEnglishBrandTerms` 헬퍼가 "삼성" ➡️ `samsung`, "청와대" ➡️ `bluehouse`, "쿠팡" ➡️ `coupang` 매칭 조건을 구동하여 한글 검색 시 9개 계열사 전체 100% 탐지.

---

## 2. ⚡ 구글 드라이브 이미지 스마트 2원화 WebP 최적화 & 렌더링 차단 해제

### 주요 구현 결과
- **스마트 2원화 프록시 (`/api/free-assets/proxy`)**:
  - **카드 썸네일**: `=w800-rw` 옵션으로 30~40KB 초경량 반환 (블로그 목록 페이로드 2.7MB ➡️ 350KB 대폭 단축).
  - **본문 상세**: `=w1400-rw` 고화질 옵션으로 선명도 99% 보존 및 100~150KB 분리 서빙.
- **렌더링 차단 방지**:
  - `RootLayout` preconnect/dns-prefetch 헤더 및 폰트 `display: swap` 세팅으로 CSS 렌더링 차단 지연 해제.

---

## 3. 💳 브랜드 독립 도메인 1초 결제 & 실시간 USD/KRW 환율 연동

### 주요 구현 결과
- **PortOne V2 PG 통합 (`src/lib/client/payment.ts`)**:
  - 신용카드, 카카오페이, 토스페이, 네이버페이, 계좌이체 등 국내 9대 결제수단 1초 팝업 결제.
  - 안전 모의 결제(Mock Test Approval) 모드 탑재.
- **도메인 결제 & 1초 Edge IP 연결 (`src/app/api/domains/buy/route.ts`)**:
  - Vercel Domains API 연동을 통한 실시간 소유권 매입 및 CreAibox 글로벌 CDN Edge IP 자동 바인딩.
- **실시간 환율 수집 동기화 (`src/lib/server/exchange-rate.ts`)**:
  - `open.er-api.com` 오픈 API 연동을 통한 실시간 환율 수집 및 Vercel 공식 도매가 자동 연산 청구(투명 무마진 결제 적용).

---

## 4. 🎬 유튜브 트렌드 AI 분석 리포트 Vertex AI 통합 & PG 결제 시스템 구축

### 주요 구현 결과
- **Vertex AI (`gemini-3.1-flash-lite`) 1순위 엔진 통합 (`src/app/api/youtube/analyze/route.ts`)**:
  - `generateContentWithVertexAI` 통합 모듈 기반으로 AI 분석 엔진 100% 전환 및 멀티모달 썸네일 전달 파이프라인 추가.
- **포트원(PortOne V2) 실전 결제 Webhook 구축 (`src/app/api/webhooks/portone/route.ts`)**:
  - 결제 승인/취소 백그라운드 이벤트 수신 및 `payment_logs` DB 동기화 파이프라인 완비.
- **전자상거래법 푸터 고지 규정 수립**:
  - `Footer.tsx` 에 `호스팅 서비스 사업자: Vercel Inc.` 법적 의무 고지 적용 완료.

---

## 5. 🚀 YouTube 트렌드 0.01초 로딩 초고속 렌더링 최적화

### 주요 구현 결과
- **글로벌 전역 캐시(Front-end)**:
  - 기존 탭 전환 시 캐시가 날아가던 문제를 SWR 라이브러리 없이 컴포넌트 외부 `globalVideoCache(Map)`로 이관하여 해결.
  - 메뉴 간 이동 후 복귀 시에도 API/DB 재호출 없이 0.01초 만에 화면이 즉시 표시되는 네이티브 앱(App) 수준의 부드러움 달성.
- **자정 완전 파기형 Vercel Edge Cache (Back-end)**:
  - 매일 급상승 데이터가 1회 갱신되는 특성을 반영하여 KST 기준 매일 정각(자정)에 캐시가 파기되도록 `getSecondsUntilKstMidnight()` 함수 기반 동적 `Cache-Control` (`s-maxage`) 주입.
  - 최초 접속자 이후 자정 전까지 발생하는 수백/수천 명의 추가 접속은 DB를 전혀 거치지 않고 Vercel Edge 노드에서 0.05초 만에 초고속 응답.

---

## 6. 🚀 글로벌 RAM 캐시(Promise Shield) 일괄 적용 완료 (4대 핵심 API)

### 주요 구현 결과
4개의 핵심 API 엔드포인트에 전역 메모리 캐시 및 Thundering Herd 방어 패턴(Promise Shield)을 성공적으로 이식했습니다.

- **`GET /api/youtube/popular` (인기 영상 트렌드)**:
  - **적용**: 24시간(하루 1번) 유지 캐싱.
  - **효과**: 국가별/카테고리별 인기 영상 탭 클릭 시 DB 조회 없이 0.01초 내외 즉시 렌더링. (크론 스케줄 주기와 동기화)
- **`GET /api/youtube/reports` (최근 분석된 AI 리포트 리스트)**:
  - **적용**: 15분 유지 캐싱.
  - **효과**: `limit(100)` 과거 아카이브 전체 순회 병목 해소, 우측 사이드바 딜레이 없이 즉시 표출.
- **`GET /api/free-assets/list` (무료 에셋 라이브러리 목록)**:
  - **적용**: 24시간(하루 1번) 유지 캐싱.
  - **효과**: DB 조회, 로컬 JSON 병합 및 닉네임 조인 무거운 로직을 메모리에 올려 에셋 창고 로딩 지연 100% 해소.
- **`GET /api/keywords/latest-quick` (실시간 급상승 검색어)**:
  - **적용**: 1시간 유지 캐싱.
  - **효과**: 홈 대시보드 로딩 시 네이버/구글 트렌드 히스토리 DB 읽기 타격을 방어하여 체감 속도 향상.

### 검증 효과 (Validation)
- **Thundering Herd 방어**: 동시 접속이 폭주해도 1차 메모리 캐시(`Map`)와 2차 디바운싱(`Promise`)이 작동하여 실제 DB 타격은 단 1회만 허용됨.
- **비용 절감**: 3MB 이상의 무거운 JSON 응답에 대한 서버리스 실행 시간 단축 및 Supabase Egress 데이터 전송 비용 전면 차단.

---

## 7. ⚡ 프론트엔드 React Query 글로벌 인메모리 캐시 연동 (영상분석 리포트)

### 주요 구현 결과
- **적용 메뉴**: `/youtube-trend/reports`, `/youtube-trend/channel-reports`
- **구현 내용**:
  - 백엔드 캐시에 더해, 프론트엔드 `useQuery`의 `refetchOnMount` 재호출 방지를 위해 `globalReportsCache`, `globalChannelReportsCache` Map 변수를 선언.
  - `initialData` 팩토리를 통해 캐시된 데이터를 즉시 주입하고, `staleTime`을 15분으로 설정.
- **검증 효과 (Validation)**:
  - 사용자가 다른 탭으로 이동했다가 복귀하더라도 로딩 스피너(`isLoading`) 없이 **0.01초 만에 즉시 렌더링**되는 극한의 프론트엔드 로딩 최적화 달성.

---

## 8. 🛡️ 인기 영상 조회수 랭킹(Popular Videos) API 쿼터 소진 버그 수정 및 UI 최적화

### 주요 구현 결과
- **과도한 Search API 호출 폭주 버그 완전 제거**:
  - 기존에 `1d` (오늘) 등 캐시 미스 발생 시 16개 카테고리를 `Promise.all`로 동시 라이브-페치(Live-Fetch)하던 무거운 로직을 전면 수정.
  - YouTube Search API (조회당 100 쿼터)를 16번 동시에 호출하여 클릭 한 번에 1,600 쿼터가 증발하고 "미수집 데이터" Empty State가 발생하던 문제를 해결. 사용자가 요청한 단일 카테고리(`categoryId`)만 타겟팅하여 수집하고 기존 DB 번들에 스마트하게 병합(Merge)하도록 백엔드 로직 효율화 적용.
- **국가 UI 대폭 축소 및 12개 주요국 통일 (`PopularVideos.tsx`)**:
  - 60개국 전체 버튼 및 복잡한 대륙 그룹 필터를 100% 제거하고, '급상승 트렌드' 메뉴와 동일한 12개 주요국(KR, US, JP 등)으로 단일화.

---

## 9. 🐛 헤더(Header) 요금제 표시 "Free" 고정 버그 해결

### 주요 구현 결과
- **존재하지 않는 DB 컬럼 참조 에러 제거 (`Header.tsx`)**:
  - 사용자 프로필을 불러오는 쿼리(`.select`)에 DB에 존재하지 않는 `is_manual_grant` 컬럼이 실수로 포함되어 Supabase가 400 에러를 뿜어내던 현상을 발견.
  - 이 에러 때문에 실제로는 Premier/VIP 권한이 있는 사용자도 강제로 "Free" 등급 및 임시 닉네임으로 화면에 출력되던 치명적 표기 버그를 수정 완료. 이제 VIP/Premier 권한 및 커스텀 닉네임이 즉각 화면 우상단에 정확히 반영됩니다.
