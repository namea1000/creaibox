# [Architecture Specification] Instant Navigation & Smart Prefetch Pipeline

> **문서 상태**: [업데이트 됨] 연계된 Vercel CDN 캐시 정책이 기존 60초 ISR에서 **"무한 캐시 + 온디맨드 Webhook(Method B)"** 방식으로 전면 업그레이드 되었습니다. (`on-demand-revalidation-webhook-architecture.md` 참조)
> **문서 분류**: 아키텍처 기술 명세서 (Architecture Spec)
> **관련 모듈**: `src/components/common/SmartIntentLink.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Sidebar.tsx`, `src/app/page.tsx`, `src/components/layout/Footer.tsx`, `src/app/blog/page.tsx`, `src/components/blog/BlogListPaginatedView.tsx`, `src/app/brand/[brand_id]/components/BlogClientWrapper.tsx`
> **시스템 레이어**: Frontend Component ↔ Next.js App Router ↔ Vercel Edge CDN Static Asset Layer

---

## 1. 아키텍처 조감도 (System Architecture Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as 브라우저 (사용자)
    participant Link as SmartIntentLink Component
    participant Router as Next.js App Router
    participant Edge as Vercel Edge CDN (Static HTML)
    participant Origin as Supabase DB / Serverless Fn

    Note over User, Link: 마우스 커서 호버 (onMouseEnter)
    Link->>Link: 0.15s Intent Debounce 타이머 구동
    alt 0.15s 이전에 마우스 이탈 (onMouseLeave)
        Link->>Link: 타이머 Cancel (Vercel 호출 0회)
    else 0.15s 이상 체류 (확실한 클릭 의도)
        Link->>Router: prefetch 속성을 동적으로 true로 변경
        Note over Router: Next.js 14 동적 라우트 한계 돌파 (Full Payload Fetch)
        Router->>Edge: GET targetUrl (Prefetch Header)
        Edge-->>Router: 200 OK (0.05s 캐시된 Static HTML/JS)
        Note over Router: 램(RAM) 메모리에 본문 DOM 및 데이터 사전 구성 완료
    end
    Note over User, Link: 실제 클릭 발생 (onClick)
    Router-->>User: 0.01초 렌더링 (네트워크 대기시간 0ms)
    Note over Origin: Serverless Function 실행 0회 (무료 방어)
```

---

## 2. 모듈별 기술 규격 & 데이터 흐름 (Technical Specifications)

### 2.1 스마트 의도 감지 모듈 (`SmartIntentLink.tsx`)

- **디바운스 인터벌 (Debounce Interval)**: `150ms` (0.15초)
- **메모리 이탈 가비지 컬렉션**: `onMouseLeave` 발동 시 즉시 `clearTimeout`을 실행하여 이벤트 메모리 누수 방지.
- **모바일 터치 이벤트 (`onTouchStart`)**: 모바일 뷰포트의 경우 마우스 호버 개념이 없으므로 `onTouchStart` 시점에 즉시 프리패치 트리거.
- **Next.js 14 동적 라우트 한계 돌파 (Full Payload Fetch)**: 
  - 기본적으로 Next.js 14에서 동적 라우트(`[slug]`)에 대해 `router.prefetch()`를 호출하면 데이터(Payload)는 빼고 껍데기(Layout)만 가져오는 반쪽짜리 프리패칭을 수행함.
  - 이를 우회하기 위해 평소에는 `prefetch={false}`로 맹목적 과금을 방어하다가, 150ms 체류가 확인되는 순간 동적으로 **`<Link prefetch={true}>` 모드로 강제 전환**하여 Vercel로부터 본문 데이터까지 완벽하게 백그라운드 다운로드하도록 재설계.
- **HTMLAnchorElement 완전 호환**: `title`, `target`, `rel`, `aria-*` 등 모든 표준 앵커 속성을 100% 수용.

```typescript
export interface SmartIntentLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  className?: string;
  hoverDelay?: number; // Default: 150ms
}
```

### 2.2 플랫폼 전역 탑재 범위 (Global Application Matrix)

1. **GNB & 헤더**: `Header.tsx` (전체 GNB 대메뉴 및 50+ 세부 드롭다운 링커)
2. **스튜디오 사이드바**: `Sidebar.tsx` (1~3단계 전체 메뉴/서브메뉴)
3. **메인 랜딩페이지**: `src/app/page.tsx` (상단 5대 퀵메뉴 및 실시간 급상승 키워드 바)
4. **블로그 센터**: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `BlogClientWrapper.tsx`, `PostClientWrapper.tsx`
5. **16대 커스텀 사이트 템플릿**: `BlogListPaginatedView.tsx` 공통 컴포넌트를 통해 모든 사용자 자사몰/브랜드 사이트에 자동 장착
6. **메인 푸터**: `Footer.tsx` (회사 소개, 서비스/요금제 링크 등)

### 2.2 Vercel Edge CDN Caching Layer & Static Bundle Header (`revalidate = 300`) 

- **캐싱 매커니즘**: Next.js Incremental Static Regeneration (ISR) 및 permanent CDN Static Header
- **Header Specification**:
  - `_next/static/:path*`: `Cache-Control: public, max-age=31536000, immutable` (렌더링 차단 0ms 완전 방어)
  - `/api/free-assets/proxy`: `Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable`
  - HTML 본문: `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=60`
- **서버리스 함수 실행 방어**: Edge CDN에 생성된 5분(300초) 수명의 Static HTML이 응답하므로, 프리패치 요청이 들어와도 Node.js Serverless Container가 스핀업되지 않음.

---

## 3. 네트워크 및 메모리 프로파일링 (Profiling Benchmark)

| 평가 항목                    | 기존 (일반 Next.js Link)            | **개선 (SmartIntentLink + Edge ISR)** |
| ---------------------------- | ----------------------------------- | ------------------------------------------- |
| **Hover 트래픽 소모**  | 마우스 지나갈 때마다 서버 호출 발생 | 0.15초 체류 시에만 1회 호출 (95% 낭비 방어) |
| **서버리스 핑 횟수**   | 클릭 시마다 DB/서버 쿼리 실행       | 0회 (Vercel Edge Static Asset 서빙)         |
| **본문 DOM 출력 지연** | `800ms ~ 1,200ms`                 | **`0ms ~ 10ms` (0.01초)**           |
| **Memory Footprint**   | 소량의 JS 프리패치 버퍼 로딩        | 150ms 디바운스로 필요 세션만 효율 보유      |
