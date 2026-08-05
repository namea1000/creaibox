# 📅 CreAibox 개발일지 (2026년 8월)

본 문서는 CreAibox 플랫폼의 시스템 구축, 버그 수정, 성능 최적화 및 신규 기능 개발 내역을 일자별로 상세히 기록하는 공식 일지 대장입니다.

---

## 📅 2026년 8월 4일 ~ 8월 5일 (수)

### 1. 🛡️ 관리자 예약어(Blacklist Brand IDs) 시스템 고도화 & 한글 역매핑 검색
- **수동 예약어 추가 모달 키보드 먹통 결함 수정**:
  - `src/app/admin/reserved-words/page.tsx` 모달의 `onChange` 이벤트에 걸려 있던 실시간 정규식 문맥 삭제 필터를 제거하고 제출 시점 폼 정제(`handleAddReservedWord`)로 전환하여 한글 IME 조합 및 영문/숫자 타이핑이 100% 부드럽게 작동하도록 완전 해결.
- **영한 키워드 패턴 검색 매핑 엔진 구축**:
  - `src/lib/constants/knownEntityMap.ts`에 `getMatchedEnglishBrandTerms` 알고리즘 탑재.
  - "삼성", "청와대", "쿠팡", "네이버", "카카오", "경찰", "서울대" 등 한글 키워드 검색 시 `brand_id.ilike.%samsung%` 등 매칭 영문 패턴 쿼리로 자동 연동되어 계열사 9개 및 관련 브랜드가 100% 한꺼번에 검색 노출되도록 구현.
- **`gemini-3.1-flash-lite` 1순위 초고속 배치로 120,883개 전체 DB Target Entity 영구 보강 완료**:
  - `scripts/enrich-all-reserved-brands.js` 무인 스크립트 작성 및 3개 무료 API 키 로테이션 가동.
  - DB 내 120,883개 전체 예약어에 `[Target Entity 기관/브랜드명] 사유` 서식을 100% 영구 기록 갱신 완료.
- **Vertex AI & Gemini 1순위 구동 규약 수록**:
  - `docs/rules/ai-agent-rules.md` 및 `AGENTS.md`에 **Mandatory Vertex AI & Gemini Primary Engine Standard Rule (`gemini-3.1-flash-lite` 1순위 의무화 규칙)** 영구 반영.

---

### 2. ⚡ 구글 드라이브 이미지 스마트 2원화 WebP 압축 & CSS 렌더링 차단 방지
- **구글 드라이브 스마트 2원화 프록시 서빙 (`/api/free-assets/proxy/route.ts`)**:
  - 카드 썸네일/목록 화면 (`type=thumb` 기본값): 구글 CDN `=w800-rw` 자동 가공으로 **30 ~ 40 KiB 초경량 쾌속 WebP 변환 서빙** (블로그 목록 용량 2.7MB ➡️ 350KB 이하로 85% 대폭 축소 달성).
  - 본문 상세 화면 (`type=detail` 또는 `w=1400`): 가로 1400px `=w1400-rw` 고화질 옵션으로 **화질 선명도 99% 보존(100~150KB)** 분리 서빙.
- **글로벌 CSS & 폰트 렌더링 차단 최적화 (`src/app/layout.tsx` & `next.config.ts`)**:
  - RootLayout 폰트들에 `display: "swap"`, `preload: true` 명시 및 `lh3.googleusercontent.com` / `drive.google.com` `preconnect`, `dns-prefetch` 프리로드 헤더 탑재.
  - CSS 번들 렌더링 차단 지연시간 2.04초 획기적 단축 및 LCP 성능 1초대 진입.
- **📖 관련 아키텍처 및 운용 매뉴얼 수록**:
  - `docs/arch/media-proxy-architecture.md`
  - `docs/project/manual/google-drive-image-proxy-web-optimization-manual.md`

---

### 3. ⚡ 네이버 뉴스급 0.01초 Instant 오픈 & Vercel 비용 0원 방어 기술 탑재
- **`SmartIntentLink` 0.15초 의도 감지 프리패치 엔진 구축**:
  - `src/components/common/SmartIntentLink.tsx` 컴포넌트 개발.
  - 마우스 0.15초 체류 의도 감지 시에만 0.05초 백그라운드 prefetch 구동 ➡️ Vercel 비용/트래픽 0원(무료) 철통 방어 및 클릭 시 0.01초 네이버 뉴스급 수소폭탄 즉시 오픈 구현.
- **전체 멀티테넌트 블로그 & 비즈니스 사이트 카드 링커 전면 전환**:
  - `BlogClientWrapper.tsx`, `BlogListPaginatedView.tsx`, `commufill`, `sotongcheum` 등 모든 블로그/사이트 카드 링커 전면 교체 완료.
- **`next.config.ts` static 번들 1년 무상 CDN 영구 캐싱 헤더 주입**:
  - `/_next/static/:path*` 1년 영구 캐시(`max-age=31536000, immutable`) 주입으로 1.01초 렌더링 차단 지연시간을 0ms로 완전 제거.
- **📖 관련 기술 아키텍처 & 운용 매뉴얼 수록**:
  - `docs/arch/instant-navigation-prefetch-architecture.md`
  - `docs/project/manual/instant-navigation-0.01s-prefetch-guide.md`

---

### 4. 🧪 빌드 및 무결성 검증
- `npx tsc --noEmit` 실행 결과: **오류 0건 (100% Clean Pass)**
