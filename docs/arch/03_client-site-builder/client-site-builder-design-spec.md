# AI 홈페이지 제작 스튜디오 기술 디자인 명세서 (Design Specification)

본 문서는 CreAibox **"AI 홈페이지 제작 스튜디오"** 모듈의 설계 의도, 기술적 의사결정 내역, 비즈니스 규칙 및 보안 정책을 기록하는 상세 기술 명세서입니다.

---

## 1. 아키텍처 결정 사항 (Architecture Decisions)

- **Dynamic Database-Driven Headless CMS**: 개별 클라이언트용 정적 React/Next.js 페이지 코드를 하드코딩 배포하는 전통적인 방식 대신, 데이터베이스 테마 설정값과 섹션 데이터만을 동적으로 참조하여 렌더링하는 Headless 아키텍처를 도입했습니다. 이를 통해 새 테마나 섹션 형식이 추가되더라도 빌드/배포 주기 없이 즉각적인 스토어 확장이 가능합니다.
- **Middleware-Based Subdomain Routing**: 플랫폼 미들웨어를 통해 일반 방문자가 `brand_id.creaibox.com` 또는 개별 독립 커스텀 도메인으로 인입될 때, 내부적으로 DB 매핑 정보를 캐싱 확인하여 `/clients/dynamic-renderer/[brand_id]`로 리라이팅(Rewriting)함으로써 투명하고 쾌적한 멀티테넌시 웹 서비스를 공급합니다.
- **Shared State Routing Context**: Next.js App Router의 중첩 라우팅 구조 하에서 발생할 수 있는 데이터 불일치 및 깜빡임 현상을 해소하기 위해, 전역 레이아웃 단에서 `SiteBuilderProvider` 컨텍스트를 도입하고 하위의 모든 페이지가 단일 소스 오브 트루스(Single Source of Truth)로 상태를 동기화하도록 유도했습니다.

---

## 2. 데이터베이스 디자인 합리화 (Database Design Rationale)

- **비정형 데이터의 유연한 활용 (JSONB)**:
  - `client_sites.extra_configs`: 공식 SNS 프로필 링크, 사업자등록번호, 대표자 성명 및 구글 애널리틱스 ID 등 유연한 B2B 마스터 설정 정보를 추가적인 스키마 마이그레이션 없이 수용하기 위해 PostgreSQL `jsonb` 타입을 활용합니다.
  - `site_sections.content_data`: 각 섹션 타입(`hero`, `services`, `rental` 등)이 요구하는 세부 콘텐츠 규격(카드 어레이, 불릿 텍스트, 이미지 경로 등)의 이질적인 특징을 포용하고 검증하기 위해 JSONB 타입을 사용합니다.
- **인덱스 전략**:
  - 미들웨어 리라이팅 및 서브도메인 라우팅의 성능 병목을 제거하기 위해 `client_sites(brand_id)` 및 `client_sites(custom_domain)`에 고유 인덱스(Unique Index)를 가동하여 O(1) 수준의 고속 탐색을 확보합니다.
- **RLS(Row Level Security) 정책**:
  - 회원 데이터 보호를 위해 `client_sites`, `site_sections`, `site_posts` 전체 테이블에 RLS를 활성화합니다.
  - 오직 활성 세션의 사용자(`auth.uid() = profile_id`)만이 생성(Insert), 수정(Update), 삭제(Delete)를 단행할 수 있으며, 일반 방문자(익명 세션)는 조회(Select) 권한만 허용하여 보안을 보장합니다.

---

## 3. API 디자인 합리화 (API Design Rationale)

- **SNS/블로그 딥 스크래핑 및 Zero-to-One AI 합성 (ai-magic-builder)**:
  - 클라이언트 사이드 렌더링(CSR) 방어가 적용된 인스타그램, 틱톡 등의 SNS 플랫폼 주소가 입력될 경우, 서버사이드 크롤링의 한계를 보완하기 위해 메타 데이터(OG Tag)와 일부 추출 가능한 텍스트만 획득합니다.
  - 획득한 빈약한 데이터를 `gemini-3.5-flash-lite`에 전달하여, 단순 복제(Clone)가 아닌 지정된 테마(Vibe)에 맞춰 비즈니스 스토리를 새롭게 작성(Zero-to-One)하고 홈페이지 구조(Hero, About, Gallery 등)를 동적으로 합성(Synthesis)하는 고도화된 프롬프트 엔진을 가동합니다.
  - 기존 `migration`과 명확한 분리를 위해 DB에 `creation_source: "sns_builder"` 상태 값을 주입합니다.
- **1단계 기획 ➡️ 2단계 생성의 분할 트랜잭션**:
  - LLM을 활용한 기획서 수립은 높은 토큰 비용과 대기 시간(Latency)을 동반하므로, 최종 홈페이지 생성 트랜잭션과 기획 분석 단계를 `/plan`과 `/build` API로 엄격히 분리했습니다.
  - 이를 통해 사용자는 1단계 결과로 도출된 JSON 기획안(카피 타이틀, 섹션 갯수, 추천 테마)을 화면 상에서 시각적으로 검토 및 직접 수정한 후 최종 승인 배포함으로써 제어권과 서비스 신뢰성을 함께 확보합니다.
- **커스텀 웹사이트 🌟 AI 이관 엔진 전용 Vertex AI 정력**:
  - `site-migration/route.ts`는 대표님/일반 회원 여부와 개인 Gemini API Key 등록 여부에 관계없이, 모든 요청을 미들웨어 `generateContentWithVertexAI` 함수(→ GCP $300 크레딧 기반의 `Vertex AI`)로만 철통 라우팅합니다.
  - 이를 통해 무료티어 키의 Rate Limit 초과로 인한 JSON 반환 잘림 현상을 원천 차단합니다.
  - 로그인한 회원만 API 세션(쿠키) 유효성 검증을 통해 접근 가능하며, 비로그인 사용자는 401로 원천 차단됩니다. GCP 크레딧 시스템이 차중 방화벽 역할을 함니다.

---

## 4. UI/UX 의사결정 사항 (UI/UX Decisions)

- **Loading-Free & Instant Rendering UX**:
  - 페이지 진입 시 전체 화면을 불투명하게 가리는 로딩 스피너의 사용을 일체 금지하고, 탑바/사이드바 등 글로벌 레이아웃 셸은 100% 즉시 노출되어 상호작용하도록 구현했습니다.
  - 데이터 지연이 발생하더라도 레이아웃의 고유 구조는 즉시 노출되며, 오직 상세 테이블이나 메인 콘텐츠 데이터 프레임 영역에만 국한된 스켈레톤(Skeleton UI)과 인라인 로더를 적용하여 끊김 없는 시각적 연속성을 보장합니다.
- **워드프레스식 카테고리 스토어 필터링**:
  - 템플릿 테마 스토어의 접근성을 높이기 위해 카테고리별(Business, Education, Food, Portfolio) 필터 탭을 연동하고, 각 테마의 상세 스타일(글꼴 패밀리 명칭, 6개 핵심 테마 컬러 서클 배포)을 구체화하여 사용자가 최종 디자인 결과물을 직관적으로 유추할 수 있도록 배려했습니다.

---

## 5. 비즈니스 규칙 (Business Rules)

- **비즈니스 플랜(Business Plan) 등급 제한**:
  - AI 홈페이지 빌더 모듈 전체 경로는 `membership_level`이 `business`, `enterprise`, 혹은 관리자 등급(`admin` / `ADMIN`)인 회원에게만 전적으로 가동됩니다.
  - 권한이 없는 Pro 등급 이하 사용자의 경우, 전역 레이아웃 단에서 진입을 우회 제어하여 플랫폼 전환 업그레이드 모달(`<UpgradeModal />`)을 출력하고 상담 신청 폼 제출을 안내하여 자연스러운 결제 전환을 유도합니다.
- **백엔드 API 보안 강제**:
  - 프론트엔드 UI 통제와 별개로, 모든 홈페이지 기획`/plan`, 생성`/build`, 이미지 업로드`/upload` API 라우트 내부에서 Supabase 서버 클라이언트를 통한 유저 등급 검증을 병행 수행하여 해킹 및 부정한 우회 호출을 403 Forbidden 에러로 사전 원천 봉쇄합니다.

---

## 6. 스토리지 격리 정책 (Storage Isolation Strategy)

- **구글 드라이브 클라이언트 격리형 폴더 트리**:
  - 기업 고객의 미디어 에셋이 교차 오염되거나 유출되는 것을 차단하기 위해, 구글 드라이브 루트 폴더 하위에 클라이언트 고유 식별자(`userId` -> `client-site-builder` -> `YYYYMM` 형식)로 명명된 독립 폴더 구조를 이미지 업로드와 동시에 동적으로 자동 생성합니다.
  - 업로드되는 이미지는 nodejs sharp 모듈을 사용해 WebP 포맷(압축률 92%)으로 자동 리사이징 변환되어 전송 속도 및 서버 스토리지 공간을 보존합니다.
  - 업로드 성공 후 드라이브 파일 읽기 권한을 전체 공개로 세팅하여 구글 CDN 주소(`https://lh3.googleusercontent.com/d/{fileId}`)를 다이렉트로 획득하고 DB에 최종 결합합니다.

---

## 7. 기술적 고려 사항 (Technical Considerations)

- **Next.js Suspense Boundary**:
  - `useSearchParams` 훅은 빌드 타임에 정적 분석 단계에서 서버 렌더링 에러나 경고를 유발할 수 있으므로, 해당 훅을 사용하는 하위 컴포넌트는 반드시 `<Suspense>` 바운더리로 래핑하여 클라이언트 단에서 안전하게 하이드레이션(Hydration)되도록 조치했습니다.
- **React State Reset Pattern**:
  - 사용자가 멀티 사이트 스위처 드롭다운을 조작하여 활성 홈페이지를 변경할 때, 복잡한 useEffect 동기화 코드 작성 대신 중첩 컴포넌트에 `key={selectedSite.id}`를 주입하는 선언적 패턴을 채택함으로써, 사이트 변경 시 React가 기존 상태 정보를 깨끗이 unmount 시키고 새 데이터로 컴포넌트를 즉시 완전 초기 재마운트하도록 설계했습니다.
- **Component Modularization (컴포넌트 모듈화)**:
  - 거대한 단일 파일로 존재하던 `page.tsx`를 탭별(`AdminDashboardTab`, `RequestTab`, `ManageTab` 등) 및 모달별(`PreviewModal`, `DeployModal`) 파일로 완전히 분리하여 코드 가독성과 유지보수성을 극대화했습니다.
  - 이를 통해 각 컴포넌트 내에서의 상태 관리(State Management) 충돌 및 전역 Scope 오염(TS2451 등)을 원천 차단하고 타입 안정성을 확보했습니다.
- **Admin Request Database Integration**:
  - 관리자 대시보드의 커스텀 사이트 신청 현황을 Mock 데이터에서 분리하여 `client_site_requests` DB 테이블로 연동했습니다.
  - 사용자가 1:1 제작 신청을 하면 해당 테이블에 접수되며, 관리자는 Supabase 실시간 조회를 통해 신청 내역을 파악하고 즉각적인 AI 생성을 트리거할 수 있습니다.

---

## 8. 대규모 트래픽 및 비용 스케일링 전략 (High-Scale Traffic & Cost Scaling Strategy)

플랫폼이 활성화되어 1만 건, 10만 건 이상의 기업 홈페이지가 개설되고 전 세계 트래픽이 인입될 때를 대비해 설계된 아키텍처 확장 및 비용 통제 전략입니다.

### 8.1. 싱글 코드베이스 멀티테넌트 아키텍처 (Single Codebase Multi-tenant)

- **자원 격리 및 보존**: 개별 클라이언트용 서버 인스턴스나 소스코드를 물리적으로 복사 배포하는 독립형 방식(예: 전통적인 워드프레스 호스팅)을 탈피했습니다.
- **데이터 중심 경량 설계**: 모든 홈페이지는 하나의 Next.js 애플리케이션 프레임워크와 테마 렌더러를 통해 동적 서빙되며, 각 웹사이트의 실체는 데이터베이스 테이블 내의 경량 레코드(JSON)로만 존재합니다. 이로 인해 10만 개 사이트가 개설되어도 물리적인 스토리지 공간 및 유휴 서버 리소스 비용이 거의 증가하지 않습니다.

### 8.2. 에지 캐싱 및 서버리스 비용 절감 (Edge Caching & Serverless Costs)

- **증분 정적 재생성 (ISR)**: 개별 클라이언트 홈페이지의 페이지들은 접속할 때마다 데이터베이스를 실시간 쿼리하는 대신, **Next.js ISR 및 에지 캐싱(Edge Caching)** 기술을 통해 정적 HTML 파일로 전역 CDN(Vercel, Cloudflare 등) 에지 서버에 분산 저장됩니다.
- **속도 및 안정성 보장**: 대규모 트래픽 폭증(동시 접속자 수만 명) 발생 시에도 데이터베이스 및 오리진 서버 부하는 0에 가깝게 유지되며, 방문자는 가장 가까운 에지 서버로부터 정적 문서를 다운로드하므로 **sub-second(0.1초 내외) 초고속 렌더링 속도**를 보장합니다.

### 8.3. AI 생성 비용의 경제적 통제 (AI Generation Cost Control)

- **일회성 생성 비용 구조**: 인공지능(LLM, 이미지 생성 등) 호출 요금은 홈페이지 최초 구축(Build) 및 대규모 섹션 개편 시점에만 단발성으로 발생합니다.
- **비용 회수 비즈니스 모델**: 플랫폼 월 구독료(SaaS Subscription) 구조 또는 건당 제작 수수료 모델을 결합함으로써 AI 생성에 수반되는 원천 요금을 100% 이상 완벽하게 회수하고 비즈니스 수익성을 확보합니다.

### 8.4. 데이터베이스 아웃바운드 및 확장성 최적화 (Database Scalability)

- **커넥션 풀링 관리**: 수많은 클라이언트 사이트 관리자들의 동시 편집 요청으로 발생할 수 있는 커넥션 병목을 차단하기 위해, Supabase 내부의 **PgBouncer / Supavisor** 풀링 시스템을 상시 결합합니다.
- **인덱스 및 읽기 복제본 분산**: `client_sites(profile_id)`, `site_sections(site_id)` 등의 외래 키 관계망에 정교한 고성능 인덱스를 부여하고, 트래픽 폭증 시 데이터베이스 **읽기 전용 복제본(Read Replicas)**을 분산 구축하여 마스터 쓰기 DB의 부하를 원천 차단합니다.
- **이미지 업로드 및 스토리지 최적화 (WebP + Resizing)**: 외부 원본(Unsplash 등)이 4K 이상의 초고해상도일 경우 압축만으로는 용량 절감에 한계가 있으므로, 미디어 에셋 수집/업로드 시 백엔드(`sharp` 모듈)에서 **최대 가로 1920px 리사이징(`withoutEnlargement: true`)을 선행한 뒤 WebP(품질 80%) 포맷으로 변환**합니다. 이를 통해 수 MB의 원본을 100~300KB 수준으로 경량화하여 Cloudflare R2 스토리지 공간 및 Egress 비용을 획기적으로 방어합니다.

### 8.5. 도메인 및 SSL 인증 자동화 (Domain & SSL Automation)

- **라우팅 자동화**: 와일드카드 서브도메인(`*.creaibox.com`) 라우팅 설계를 통해 신규 개설 시 DNS 레코드 추가 작업 없이 실시간 서브도메인 매핑이 이루어집니다.
- **커스텀 도메인 매핑**: Vercel Platforms API를 활용해 고객 소유의 독자 도메인(`mycompany.com`) 인입 시 보안 SSL 인증서 발급 및 Edge Routing 처리를 완전 자동화하여 무중단 무인 운영을 실현합니다.

## 4.5 Advanced Media Carousel (Premium Hero Section)

AI 이관(Migration) 엔진이 다중 미디어(비디오, 이미지)를 포함하는 히어로 섹션을 발견할 시, 불안정한 인라인 자바스크립트를 삽입하는 대신 을 반환하도록 설계되었습니다.

- **DynamicSection 분기 처리**: 일 경우,  컴포넌트를 마운트.
- **비디오 진행률 동기화**: 를 이용해 비디오 엘리먼트에 직접 접근하고,  이벤트를 통해 각 슬라이드별 하단 Progress 바 길이를 동기화합니다.
- **이벤트 델리게이션**: 비디오  이벤트 발생 시 자동으로 를 업데이트하여 자연스러운 다음 슬라이드로의 페이드(Fade) 전환을 구현합니다.

## 4.5 Advanced Media Carousel (Premium Hero Section)

AI 이관(Migration) 엔진이 다중 미디어(비디오, 이미지)를 포함하는 히어로 섹션을 발견할 시, 불안정한 인라인 자바스크립트를 삽입하는 대신 `section_type: advanced_media_carousel`을 반환하도록 설계되었습니다.

- **DynamicSection 분기 처리**: `actualSectionType === "advanced_media_carousel"`일 경우, `AdvancedMediaCarousel.tsx` 컴포넌트를 마운트.
- **비디오 진행률 동기화**: `useRef`를 이용해 비디오 엘리먼트에 직접 접근하고, `onTimeUpdate` 이벤트를 통해 각 슬라이드별 하단 Progress 바 길이를 동기화합니다.
- **이벤트 델리게이션**: 비디오 `onEnded` 이벤트 발생 시 자동으로 `setCurrentIndex`를 업데이트하여 자연스러운 다음 슬라이드로의 페이드(Fade) 전환을 구현합니다.

### 4.5.1 Advanced Media Carousel 핫픽스 및 매핑 안정화

- **DB 매핑 아키텍처 개선**: 기존 하드코딩되던 `custom_html` 타입을 폐기하고, AI가 응답한 `section_type`과 `media_urls`를 온전히 보존하여 `content_data` JSONB 객체에 삽입하도록 데이터 흐름을 정상화했습니다.
- **Image-Fallback 타이머 아키텍처**: 비디오의 `onTimeUpdate` 이벤트가 없는 순수  태그 슬라이더를 지원하기 위해, `requestAnimationFrame` 내부에서 `performance.now()`를 활용한 5초 기준 가상 프로그레스(Virtual Progress) 동기화 알고리즘을 도입했습니다.

### 4.5.2 Advanced Content Carousel (복합 콘텐츠 슬라이더)

- **동적 배열 렌더링 아키텍처**: 원본 사이트 본문에 위치한 복합 형태(이미지+텍스트+버튼)의 롤링 캐러셀 영역을 추출하기 위해, `content_data.slides` JSON 배열 형태로 HTML을 쪼개어 전달받습니다.
- **프론트엔드 연동**: 전달받은 `slides` 배열은 `<AdvancedContentCarousel>` 컴포넌트에서 CSS `transform: translateX()` 기반 슬라이더로 래핑(Wrapping)되어 렌더링되며, 5초 자동 재생 타이머와 호버 멈춤 로직이 탑재됩니다.

### 4.5.3 AI Migration Engine 퀄리티 최적화 (Limits & Layout Rules)

- **텍스트 한계 돌파 (200k Limits)**: 대규모 기업 사이트의 하단 섹션(파트너 로고, 풋터 직전 폼 등)이 잘리는 현상을 방지하기 위해, HTML 추출 텍스트 한도를 40,000자에서 200,000자로 5배 상향하고 섹션 분할 최대치를 없앴습니다. 이를 통해 누락 없는 100% 심층 스크랩을 보장합니다.
- **구조적 레이아웃 강제 (Prompt Engineering)**: 
  - **헤더 3단 정렬**: 헤더 영역 생성 시 `flex-1`, `flex-none`, `flex-1` 패턴을 통한 3단 정렬(로고 좌측, 메뉴 중앙, 기능키 우측)을 명시적으로 강제하여 레이아웃 무너짐을 방지합니다.
  - **슬라이더 데이터 보존**: 복합 슬라이더 분석 시 여러 슬라이드를 하나로 압축하는 할루시네이션(환각)을 막기 위해 1:1 분할 및 모든 텍스트/이미지 누락 금지 규칙을 주입했습니다.
  - **비대칭 갤러리(Bento Box) 보존 강제**: 규칙적인 그리드 외에 비대칭 크기를 가진 갤러리를 강제로 획일화하지 못하게 막고, Tailwind의 `col-span`, `row-span` 유틸리티를 활용하여 원본 레이아웃의 비대칭 비율을 100% 복제하도록 프롬프트에 `RULE 7`을 명시했습니다.

### 4.5.4 캐러셀 판별 규칙 최종 확정 (RULE 3.5 — HTML 실측 기반)

`asia.creative.com` 원본 HTML을 직접 스크래핑하여 클래스명을 실측한 결과를 기반으로 RULE 3.5를 최종 확정했습니다.

| 섹션 유형 | 원본 HTML 클래스 | 판정 | section_type |
|---|---|---|---|
| FEATURED PRODUCTS (3열 동시 표시) | `product_row1 slick-slider` | ❌ NOT carousel — 데스크톱에서 3열 그리드 | `custom_html` |
| Sound Blaster 쇼케이스 (전폭 2열, 1개씩 교체) | `section_highlight1` (별도 CSS 슬라이더) | ✅ IS carousel | `advanced_content_carousel` |

- **RULE A (grid 고정)**: `slick-slider` 클래스가 있어도 여러 제품이 동시에 보이는 나열형 → `custom_html`
- **RULE B (carousel 고정)**: 전폭 2열 레이아웃(좌: 씬이미지, 우: 텍스트+제품이미지), 하단 dot 3개, 한 번에 1개씩 교체 → `advanced_content_carousel`, slides 배열로 저장

### 4.5.5 동적 히어로 섹션 높이/비율 AI 추출 (RULE 8)

- **문제**: 기존에 `h-[85vh]` 같은 고정값이나 정해진 비율을 일괄 적용할 경우, 사이트마다 다른 히어로 영상/이미지의 원본 느낌(예: 초와이드 21:9, 표준 16:9, 전체화면 100vh)을 살리지 못하는 문제 발생.
- **해결 (AI 프롬프트 - RULE 8)**: 이관 엔진이 원본 사이트의 `width`, `height` 속성 또는 인라인 CSS를 분석하여 원본 데스크톱 히어로 섹션의 화면 비율을 실시간으로 추정/추출합니다.
- **데이터 흐름**: 추출된 비율은 DB의 `content_data.desktop_aspect_ratio` (예: `"21/9"`)로 저장됩니다.
  - 하이브리드 반응형 렌더링 (AdvancedMediaCarousel): 
    - 데스크톱 (lg: 이상): DB에서 전달받은 `desktop_aspect_ratio`를 CSS 변수(`--desktop-aspect`)로 주입하여 원본 비율을 100% 완벽하게 복제 렌더링.
    - 모바일/태블릿: 데스크톱 비율을 그대로 쓰면 세로가 너무 얇아져 텍스트가 잘 안보이는 문제를 방지하기 위해 가독성에 최적화된 고정 비율(`aspect-[4/3]`, `md:aspect-[16/9]`)로 자동 보정.

### 4.5.6 헤더 반응형 레이아웃 원본화 (Edge-to-Edge)
- **문제점**: AI가 자동 추출한 헤더 HTML 내부에 `max-w-7xl` 컨테이너 클래스가 삽입되어, 와이드 모니터에서 로고와 검색창이 양 끝으로 밀착되지 않고 가운데 정렬(가두리)되는 현상 발생.
- **아키텍처 적용**:
  - `src/utils/htmlInjector.ts`: 기존에 이관된 사이트에 즉각 적용하기 위해 런타임에 동적으로 헤더의 컨테이너를 탐색하여 너비 제한(`max-w-*`)을 제거(Strip)하고, 풀 와이드 속성(`w-full px-6 2xl:px-12`)으로 강제 치환하는 패치 적용.
  - `route.ts (PRO-CLONING RULE 5.5)`: 향후 사이트 생성 시 처음부터 풀 와이드(Edge-to-Edge) 레이아웃으로 디자인되도록 명시적 프롬프트 규정 추가.

### 4.5.7 모바일 헤더 드로어 네비게이션 보존 (Drop-down 방식)
- **문제점**: 기존 모바일 햄버거 메뉴는 빈 흰색 창으로 전체 화면을 덮어 원본 헤더 영역(로고 및 컬러)이 훼손되며, 단일 랜딩페이지 이관 시 메뉴 링크가 추출되지 않아 텅 빈 화면이 렌더링됨.
- **아키텍처 적용 (CustomHeaderWrapper.tsx)**:
  - **Drop-down 위치 보정**: 전체 화면 덮기를 금지하고, 런타임에 `getBoundingClientRect()`로 원본 헤더의 높이를 실시간으로 측정한 뒤 원본 헤더 바로 아래(Below)로 모바일 드로어가 부드럽게 떨어지도록 CSS(`top: headerHeight`)와 `z-index`를 조정. 이를 통해 원본 로고와 디자인 컬러가 모바일에서도 100% 보존됨.
  - **DOM 탐색 기반 링크 자동 추출**: 모바일 드로어 안에 표시할 메뉴 리스트를 서버 응답(서브페이지)에만 의존하지 않고, 클라이언트 단에서 `DOMParser`를 활용해 데스크톱용 AI 헤더 HTML 속에 존재하는 `<a>` 태그("Products", "Support" 등)들을 싹 긁어 모아(Extract) 드로어에 자동 주입하도록 구현.

### 4.5.8 2차 메가 메뉴(Mega Menu) 무손실 자동 이관 (RULE 5.6)
- **문제점**: 과거 이관 엔진은 1차 텍스트 메뉴만 복제하거나, 2차 메뉴(드랍다운)가 복제되더라도 `htmlInjector.ts`가 기존 `<a>` 태그를 덮어쓰기(Remove) 때문에 복잡한 구조의 원본 메가 메뉴가 유실됨.
- **아키텍처 적용**:
  - `route.ts (PRO-CLONING RULE 5.6)`: 이관 프롬프트에 2차 메뉴, 드랍다운, 메가 메뉴 구조를 Tailwind(`group`, `group-hover:block`, `absolute`)를 활용하여 원본 디자인과 호버 상호작용 그대로 무손실 복제하라는 강제 규정 추가.
  - `src/utils/htmlInjector.ts`: 서브페이지 신규 생성 시 메뉴 렌더링 로직을 파괴적(Destructive) 덮어쓰기에서 무손실(Lossless) 병합으로 변경. AI가 추출한 기존 메뉴 구조는 100% 보존하며, 추가된 서브페이지 링크만 중복을 회피하여 네비게이션 뒤쪽에 덧붙임(Append).
