# CreaiBox Agent Rules

Before writing code, modifying code, or creating new files,
always review:

@docs/rules/ai-agent-rules.md

Additional references:

@docs/rules/*
@docs/rules/studio-ui-design-standard-rules.md
@docs/arch/*
@docs/api/*
@docs/pages/*
@docs/database/*

### Mandatory Official Brand Name Rule (공식 브랜드 명칭 표기 의무)
- **공식 브랜드 명칭은 반드시 `CreaiBox` (대문자 C, 소문자 r, e, a, i, 대문자 B, 소문자 o, x)로 통일하여 표기한다.** (구형 `CreAibox` 표기 전면 금지)
- 도메인 표기 시에는 `creaibox.com` 소문자를 사용한다.

### Strict Zero Fake Data Rule (가짜 데이터 생성 전면 금지 및 사유 명시 의무)
- **진짜 데이터가 아니면서 진짜인 척 사용자에게 조작/표현하는 행위를 100% 절대 금지한다.** (CreaiBox 신뢰성 최우선 1대 규칙)
- 모든 개발, API 구축, 대시보드 및 서비스 기능 개발 시 **가짜(Mock/Dummy/Fake/Seed) 데이터를 임의로 합성하거나 진짜 데이터처럼 꾸며 사용자에게 노출하지 않는다.**
- 데이터가 존재하지 않거나 외부 API/DB 수집 가능 범위를 벗어난 경우:
  1. 가짜 데이터를 임의로 생성하거나 진짜처럼 포장하지 말고, **데이터가 없음**을 명확하고 솔직하게 UI에 표시한다.
  2. 왜 데이터가 없는지 **명확한 사유(예: "CreaiBox DB 구축 이전 기간이거나 포털 API 제공 범위 외 데이터입니다")**를 사용자에게 투명하게 설명한다.

### Mandatory Git Push Rule (개발자 직접 명령 전 깃 푸시 절대 금지)
- **개발자(사용자)가 명시적으로 "깃 푸시해", "git push 수행해"라고 직접 명령하기 전에는 AI 에이전트가 자율적으로 `git push`를 절대 수행하지 않는다.**
- 에이전트는 코드 수정, 로컬 테스트 및 빌드 검증(`npx tsc --noEmit`)까지만 진행하고, `git push` 단계는 개발자의 명시적 지시가 있을 때만 실행한다.

### TODO Roadmap Rule
When the user asks to record or manage future tasks (e.g., "앞으로 할 일에 추가해놔", "할 일 추가"):
- Always update `@docs/project/todo-roadmap.md` with the requested checklist items.
- Maintain checklist status (`- [ ]` / `- [x]`) and keep it synchronized with completed work.

### Project Manual Rule
When creating how-to guides or operation manuals (e.g., "~ 하는 방법", "매뉴얼 작성"):
- Store manual files in `@docs/project/manual/<manual-name>.md`.


### Mandatory SmartIntentLink 0.01s Instant Navigation Rule (스마트 링커 0.01초 가속 개발 의무 규칙)
- 향후 신규로 제작되는 모든 사용자 블로그, 비즈니스 홈페이지, 커스텀 웹사이트 템플릿, 카드 목록 및 아티클 링커에는 맹목적 `Link` 또는 `<a href>` 대신 무조건 `SmartIntentLink` (`@/components/common/SmartIntentLink`) 컴포넌트를 사용해야 한다.
- 0.15초 체류 의도 감지를 통해 Vercel 비용 0원을 철통 방어함과 동시에 클릭 즉시 0.01초 만에 본문이 열리는 네이버 뉴스급 수소폭탄 가속 서빙을 표준으로 100% 영구 적용한다.

### Mandatory Document Role Separation Rule (아키텍처 문서 및 실무 매뉴얼 역할 엄격 분리 규칙)
- 아키텍처 기술 명세서 (`docs/arch/`)와 서비스 실무 매뉴얼 (`docs/project/manual/`)을 절대 동일한 내용으로 중복 작성하지 않고 역할과 목적을 100% 명확히 분리하여 작성한다.
- 아키텍처 문서 (`docs/arch/`)는 시스템 설계자/개발자 관점의 Mermaid 다이어그램, 시퀀스/데이터 파이프라인, 내부 알고리즘, 응답 헤더 스펙 등 **심도 깊은 기술 명세서**로 작성한다.
- 실무 매뉴얼 (`docs/project/manual/`)은 기획자/실무 개발자 관점의 HOW-TO 실전 가이드, 바로 복사 가능한 추천 코드 예시, 금지 패턴(Anti-Patterns), FAQ 등 **실전 운용 가이드**로 차별화 작성한다.
- **매뉴얼 작성 디테일 룰**: 매뉴얼 작성 시 내용을 단순히 요약하거나 생략하지 말고, 사용자 인터페이스, **표(Table)** 등 필요한 서식을 적극적으로 활용하여 **최대한 디테일하고 자세하게** 기록해야 한다.

### Mandatory Secret Key Masking Rule in Documentation (문서 내 실제 보안키 및 시크릿 노출 100% 절대 금지 규칙)
- 공용 문서(`.md`), 아키텍처 명세서, 가이드 및 매뉴얼 파일 작성 시 실제 운영/테스트용 보안키(API Secret, Service Account Private Key, OAuth Secret 등)를 절대로 원문 그대로 노출해 작성하지 않는다.
- 모든 문서 내 환경변수 예시 코드에는 반드시 마스킹 문자열(예: `your_api_secret_here`, `sec_xxxx`, `your_private_key_here`)만 사용해야 한다.
- 실제 시크릿 키는 Git에 포함되지 않는 `.env.local` 파일 및 Vercel/서버 환경변수 설정(Environment Variables)에서만 관리한다.

### Mandatory Global Edge CDN ISR 60s Rule (전 대중 공개 페이지 및 블로그 글로벌 엣지 캐시 60초 의무 규칙)
- 향후 신규로 제작되는 모든 대중 공개 페이지(메인 랜딩, 소개, 요금제, 인포센터, 고객지원, AI 웹사이트 빌더 홍보 페이지), 사용자 블로그(`brand/[brand_id]/*`), 및 AI 웹사이트 빌더로 제작되는 모든 고객사 홈페이지/서브페이지/내장 블로그에는 반드시 `export const revalidate = false;` (무한 캐시 + Webhook) 또는 `export const revalidate = 60;`을 선언하여 Vercel Global Edge CDN에서 0.01초 만에 즉시 서빙되도록 구축해야 한다.
- Server Component 내부에서 `cookies()`나 `headers()`를 직접 호출하여 정적 캐시가 해제되는 안티 패턴을 100% 금지하며, 테마/인증 상태는 Client Component Wrapper로 분리한다.
- 블로그 상세 페이지 및 공개 데이터 쿼리 작성 시 React `cache()`를 사용하여 메타데이터와 본문 간의 중복 DB 조회를 방지하고, 조회수 증가는 비차단 `<PostViewTracker />`로 분리한다.

### Mandatory 4-Pillar / 2-Pillar Feature Documentation & Maintenance Rule (신규 개발 및 기존 메뉴 수정보완 시 4대/2대 마스터 문서 동시 최신화 의무 규칙)
- **신규 메뉴/기능 개발뿐만 아니라 기존 메뉴의 코드 수정, 기능 보완, 리팩토링 및 업데이트를 진행할 때도**, AI 에이전트는 무조건 `docs/rules/document-role-separation-diataxis-rules.md` 문서를 최우선 참조하여 해당 기능의 연관 4대/2대 마스터 문서를 찾아내어 **코드 변경 사항에 맞게 100% 동시 업데이트(최신화)**해야 한다.
- **문서 패키지 관리 공식**:
  1. **DB를 사용하는 기능 (4대 마스터 문서 1세트 동시 최신화)**:
     - 🔴 `docs/arch/<feature>-architecture.md` (아키텍처 기술 명세서: 설계 변경점, 파이프라인 최신화)
     - 🔵 `docs/project/manual/<feature>-manual.md` (서비스 실무 매뉴얼: 변경된 조작법, 신규 FAQ/금지패턴 반영)
     - 🟡 `docs/database/<feature>-schema.md` (DB 스키마 명세서: 추가/변경된 컬럼, RLS 최신화)
     - 🟢 `docs/database/sql/<feature>.sql` (순수 실행 SQL DDL: 변경/추가된 ALTER TABLE / CREATE DDL 반영)
  2. **DB를 사용하지 않는 순수 프론트엔드/외부 API 기능 (2대 문서 1세트 동시 최신화)**:
     - 🔴 `docs/arch/<feature>-architecture.md` (아키텍처 기술 명세서)
     - 🔵 `docs/project/manual/<feature>-manual.md` (서비스 실무 매뉴얼)
- **상호 교차 참조(Cross-Linking) 유지**: 기존 문서 수정 또는 신규 문서 생성 시 각 문서 최상단에 연관 문서 링크가 누락되지 않도록 유지한다.
- **마스터 문서 색인 최신화**: 신규 메뉴/문서 세트가 추가되면 반드시 중앙 사이트맵인 [`docs/README.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/README.md)의 마스터 테이블에도 새 항목을 등록하여 100% 동기화한다.

### Mandatory Mobile Full-Width Blog Layout Rule (모바일 풀-와이드 블로그 레이아웃 영구 표준 규칙)
- 공식 블로그(`creaibox.com/blog/*`), 서브도메인 블로그(`*.creaibox.com/*`), 커스텀 도메인(`golfgosu.net` 등), AI 웹사이트 빌더(`clients/dynamic-renderer/*`), 및 커스텀 클라이언트 사이트(`clients/*`)의 모든 게시글 상세 뷰는 **모바일(`<sm`) 환경에서 외곽 카드 테두리 및 그림자를 제거(`border-0 rounded-none shadow-none`)하고 패딩을 `px-3.5` ~ `px-4`로 최적화**하여 스마트폰 액정 가로 폭을 100% 시원하게 활용하도록 영구 통일한다. (PC 데스크톱은 품격 있는 카드 박스 `border rounded-xl shadow-sm` 유지)