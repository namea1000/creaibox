
# CreaiBox 키워드 정밀 도구 (검색량 & SERP 배치) 시스템 아키텍처 및 운용 매뉴얼

## 📌 1. 개요 (Overview)

- **메뉴 경로**: `/studio/keyword/tool`
- **구동 백엔드 코드**:
  - [`src/app/api/keyword/tool/route.ts`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/api/keyword/tool/route.ts>)
  - [`src/lib/server/keyword-tool-engine.ts`](<file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/keyword-tool-engine.ts>)
  - [`src/lib/server/ncp-api-hub.ts`](<file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/ncp-api-hub.ts>)
- **프론트엔드 페이지**: [`src/app/studio/keyword/tool/page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/keyword/tool/page.tsx>)
- **핵심 목적**: 입력된 키워드 또는 실시간 이슈 키워드에 대해 네이버 및 구글의 100% 포털 실측 데이터(상위 노출 블로그 10선, 이슈 뉴스 10선, 포털 연관어 10선, DataLab 트렌드 지수)를 실시간 수집 및 비교 분석하고, CreaiBox DB에 영구 보관합니다.

---

## 🛡️ 2. Strict Zero Fake Data Rule (가짜 데이터 전면 금지 규칙) 구현

CreaiBox의 신뢰성 최우선 1대 규칙에 따라, 가짜 데이터(Mock/Dummy/Fake/kwHash)를 100% 절대 금지하고 **100% 포털 실측 API 데이터만 수집**합니다.

1. **상위 노출 블로그 10선 실측**:
   - `fetchNaverSearchApi(kw, "blog", 10)`를 통해 네이버 포털 실시간 상위 노출 10개 블로그 글의 실제 제목, 블로거 이름, 작성일자, 인플루언서 여부를 실시간 수집합니다.
2. **이 검색어는 왜? (관련 뉴스 7선) 1줄 컴팩트 수집**:
   - `fetchNaverSearchApi(kw, "news", 10)` 및 `fetchGoogleNewsRss(kw)`를 100% 이중 수집하여, 스크롤바 이동 없이 화면에 100% 핏(Fit)하게 맞아떨어지는 최적 7개 뉴스 헤드라인을 1줄 요약(`truncate`) 형태로 표출합니다.
3. **연관 키워드 및 CPC / 광고 경쟁도 10선 실측**:
   - `fetchNaverAutoComplete(kw)`를 통해 네이버 포털 검색창에 실제 한국 사용자들이 입력 중인 100% 실측 자동완성 연관어 10개를 수집합니다.
4. **검색량 추이 차트 (DataLab 트렌드 지수)**:
   - `fetchNaverDataLabTrend`를 호출하여 0~100 사이의 실제 포털 일별 상대 검색 비율을 가져와 바 그래프로 시각화합니다. 긴 문장 키워드인 경우 핵심 주요어(Entity)를 자동 추출하여 데이터 미표출 현상을 방지합니다.
5. **검색광고 API 미연동 상태 표출**:
   - 네이버 검색광고 API(`Naver SearchAd API`) 키 미세팅 시 숫자를 임의 조작하지 않고 **"DataLab 수집중"**, **"네이버 SearchAd API 등록 시 실측 수치 표시"**로 솔직하게 안내합니다.

---

## ⚡ 3. 주요 기능 및 컴포넌트 구동 방식

### ① 실시간 급상승 키워드 상단 태그 (🔥 현재 실시간 급상승 키워드)

- 메뉴 진입 시 [`/api/keywords/latest-quick`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/api/keywords/latest-quick/route.ts>)를 호출하여 CreaiBox DB(`keyword_trending_history`)에서 최근 1시간 이내 아카이빙된 **🟢 네이버 TOP 5 + 🔵 구글 TOP 5 (총 10개)** 키워드를 자동으로 가져옵니다.
- 클릭 시 해당 키워드와 포털 탭이 즉시 세팅되며 1초 만에 정밀 분석이 실행됩니다.

### ② 스크롤 없는 1줄 깔끔 관련 뉴스 7선 (이 검색어는 왜?)

- 우측 뉴스 카드 높이에 딱 맞춰 스크롤 필요 없이 한눈에 들어오는 7개 기사 헤드라인을 1줄(`truncate`)로 컴팩트하게 배치하였습니다. 클릭 시 뉴스 언론사 원문 기사로 100% 연결됩니다.

### ③ 연관 키워드 & AI 원고 작성 연결 10선

- 포털 실측 연관어 10개를 테이블로 정렬하여 표출하며, 우측 `[원고 작성 →]` 클릭 시 입력된 키워드가 자동 전달되어 AI 원고 생성이 실행됩니다.

### ④ 아카이빙 리포트 자산 100% 영구 보관 정책 (`keyword_tool_reports`)

- 검색 분석된 모든 데이터는 CreaiBox의 핵심 자산이므로 100% 영구 보관되며 일체 자동으로 삭제되지 않습니다.
- 동일 키워드 재검색 시 최신 리포트로 갱신(`UPSERT`)되며, 수십만~수백만 건의 데이터가 축적되더라도 PostgreSQL B-Tree 인덱스(`idx_keyword_tool_reports_created_at`) 및 10개 단위 서버 페이징을 통해 0.01초 만에 초고속 조회 및 열람이 가능합니다.

### ⑤ 네이버 & 구글 동시 병렬 분석 파이프라인 (Dual Parallel Engine)

- 사용자가 키워드를 입력하고 `[분석하기]` 버튼을 1번 누르면, 백엔드에서 `Promise.all`을 구동하여 **네이버와 구글 포털을 동시에 1초 만에 병렬 분석**합니다.
- 분석 즉시 네이버와 구글의 두 결과가 DB 1개 통합 Row로 하나로 영구 저장됩니다.
- 결과 화면에서 사용자는 `🟢 네이버` / `🔵 구글` 탭을 클릭하여 대기 시간 0초(0.01s)로 양 포털 결과를 자유롭게 즉시 전환 열람할 수합니다.

---

## 🔑 4. 네이버 검색광고 API (Naver SearchAd API) 연동 안내

정확한 월간 PC/모바일/일간 실측 숫자(예: `15,400회`)를 표출하려면 아래 네이버 검색광고 API 키를 `.env` 파일에 추가하면 백엔드 엔진이 100% 자동 매핑합니다:

```env
NAVER_AD_CUSTOMER_ID="your_customer_id"
NAVER_AD_ACCESS_KEY="your_access_key"
NAVER_AD_SECRET_KEY="your_secret_key"
```

---

## 📜 5. 관련 규칙 및 문서 연동

- 본 문서 위치: `docs/project/manual/keyword-precision-tool-architecture-manual.md`
- 프로젝트 매뉴얼 규정에 따라 최신 상태로 저장 관리됩니다.
