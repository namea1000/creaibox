# CreaiBox Vercel Global Edge CDN 캐시 (ISR 60s) 아키텍처 기술 명세서

> **최종 수정일**: 2026-08-16
> **문서 버전**: v1.0
> **표준 규격**: Vercel Global Edge CDN, Next.js App Router ISR (Incremental Static Regeneration), Stale-While-Revalidate (SWR), React `cache()` Data Layer Optimization

---

## 1. 아키텍처 개요 (Overview)

CreaiBox의 모든 대중 공개 페이지(공식 블로그, 사용자 서브도메인 블로그, AI 웹사이트 빌더로 제작된 고객사 홈페이지 및 서브페이지, 템플릿 마켓)는 **0.01초 광속 서빙(Instant Navigation)** 및 **Vercel/Supabase 비용 0원 방어**를 위해 **Vercel Global Edge CDN 캐시 (ISR 60s)** 아키텍처를 100% 표준으로 채택한다.

```mermaid
graph TD
    User[전 세계 방문자 브라우저] -->|0.01초 즉시 서빙| Edge[Vercel Global Edge CDN]
  
    subgraph "Global Edge Serving Zone (0.01s)"
        Edge --> B1[공식 본사 블로그 /blog/*]
        Edge --> B2[사용자 서브도메인 *.creaibox.com/*]
        Edge --> B3[AI 웹사이트 빌더 dynamic-renderer/*]
        Edge --> B4[공개 서브페이지 /client-site-builder, /infocenter 등]
    end

    subgraph "Background Revalidation Zone (Stale-While-Revalidate)"
        Edge -.->|60초 만료 후 새 방문자 트리거| SWR[Next.js Serverless Worker]
        SWR -->|백그라운드 1회 비동기 조회| DB[(Supabase DB - Seoul)]
        SWR -->|새로운 완성형 HTML 저장| Edge
    end
```

---

## 2. 핵심 동작 알고리즘: Stale-While-Revalidate (SWR)

ISR(Incremental Static Regeneration)은 시계처럼 주기적으로 DB를 찌르는 Cron 스케줄러가 아니며, **철저한 On-Demand(요청 기반)** 방식으로 작동한다.

```mermaid
sequenceDiagram
    autonumber
    actor U1 as 첫 번째 방문자
    actor U2 as 3시간 뒤 방문자
    participant CDN as Vercel Edge CDN
    participant Server as Next.js ISR Worker
    participant DB as Supabase DB

    Note over CDN,DB: [상황 1] 첫 번째 방문자 접속
    U1->>CDN: 1. 페이지 접속
    CDN->>Server: 2. 캐시 미스 (최초 1회)
    Server->>DB: 3. DB 데이터 쿼리
    DB-->>Server: 4. 데이터 반환
    Server-->>CDN: 5. 완성된 HTML 캐시 저장 (TTL: 60s)
    CDN-->>U1: 6. 화면 서빙

    Note over CDN,DB: [상황 2] 3시간 동안 아무도 방문하지 않음 (DB 조회 0회, 서버 100% Sleep)
  
    Note over CDN,DB: [상황 3] 3시간 뒤 두 번째 방문자 접속
    U2->>CDN: 7. 페이지 접속
    CDN-->>U2: 8. 기존 캐시로 0.01초 즉시 오픈! (Zero-Latency)
    CDN-)Server: 9. [백그라운드] 캐시 만료 감지 -> 비동기 최신화 트리거
    Server->>DB: 10. Supabase DB 1회 확인
    DB-->>Server: 11. 최신 데이터 반환
    Server-->>CDN: 12. 새로운 캐시로 조용히 판올림 (Regenerated)
```

### 핵심 수치 및 스펙

1. **서빙 지연 시간(TTFB)**: `< 20ms` (전 세계 Edge 로케이션에서 0.01초 즉시 응답)
2. **DB 조회 빈도**: 방문자가 몰려도 URL당 60초에 최대 1회만 DB 조회.
3. **무부하 상태(Idle)**: 방문자가 없는 글/페이지는 1주일, 1년 동안 **DB 조회 0회(Complete Zero-Load)**.

---

## 3. 4대 레이어별 최적화 명세

### 3.1. Edge Middleware 라우팅 인메모리 가속 (`src/proxy.ts`)

* **문제점**: 서브도메인(`*.creaibox.com`) 접속 시 Edge 미들웨어가 매번 Supabase DB를 찔러 300~500ms의 네트워크 라운드트립이 발생함.
* **해결책**: 5분 TTL의 인메모리 맵(`dynamicClientCache`)을 탑재하여 미들웨어 단계의 DB 조회를 0ms로 단축.

```ts
// src/proxy.ts
const dynamicClientCache = new Map<string, { isDynamic: boolean; expiry: number }>();
```

### 3.2. Server Component 정적 렌더링 방해 요소 원천 제거

* **원칙**: Server Component 내부에서 `cookies()`, `headers()` 등 동적 요청 객체를 직접 호출하면 Next.js가 ISR을 강제로 해제(Bail-out)하고 매번 SSR로 전락함.
* **해결책**: 테마(`blog_theme`)나 인증 상태는 Client Component Wrapper(`BlogClientWrapper.tsx`, `PostClientWrapper.tsx`)의 `localStorage` / `useEffect`로 분리하여 페이지의 **100% 순수 정적 HTML 캐싱**을 보장.

### 3.3. React `cache()`를 통한 중복 DB 쿼리 제거

* `generateMetadata()`와 `Page()` 본문 컴포넌트가 동일한 `slug`나 `brand_id`를 조회할 때 단일 렌더 사이클 내에서 DB 조회가 1회만 일어나도록 React `cache()`로 래핑.

```ts
import { cache } from "react";

const fetchPublishedPost = cache(async (slug: string) => {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("writing_creaibox_posts")
    .select(...)
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);
  return data?.[0] || null;
});
```

### 3.5. 비-ASCII(한글) URL Canonical 메타데이터 `encodeURI()` 인코딩 가드

* **문제점**: Next.js 15 App Router는 `generateMetadata()`의 `alternates.canonical` 및 `openGraph.url` 필드에 영문(ASCII)이 아닌 비-ASCII(한글) URL이 전달되면, 메타데이터 직렬화 과정에서 **`Invalid canonical URL` 500 서버 크래시**를 발생시킴.
* **해결책**: 모든 메타데이터 URL에 `encodeURI(canonical)` 가드를 의무 적용하여, 한글/특수문자 슬러그도 RFC 규격에 맞는 안전한 URL로 변환하여 0.01초 만에 즉시 서빙.

```ts
const rawCanonical = post.canonical_url || `https://creaibox.com/blog/${post.slug || slug}`;
const canonical = encodeURI(rawCanonical);

return {
  title: `${post.title} | CreaiBox Blog`,
  alternates: { canonical },
  openGraph: { url: canonical, ... }
};
```

### 3.6. 헤더 우측 인증 슬롯 고정 너비(`w-[180px] shrink-0`) 제로 레이아웃 시프트(Zero Layout Shift)

* **문제점**: 페이지 이동 시 초기 로딩 스켈레톤(150px)과 로그아웃 상태 버튼(180px) 간의 30px 너비 차이로 인해 중앙 네비게이션 메뉴 전체가 좌우로 덜컹거리며 깜빡이는 CLS(Cumulative Layout Shift) 발생.
* **해결책**: 우측 인증 영역을 `w-[180px] shrink-0` 고정 컨테이너로 감싸, 초기 스켈레톤·로그인 상태·로그아웃 상태 간 전환 시 0픽셀의 위치 변동도 없도록 완벽 고정.

### 3.7. 테넌트 블로그/독립도메인/AI 빌더 0.01초 광속 서빙을 위한 미들웨어 Zero Set-Cookie & 24h 인메모리 캐시 표준

* **문제점 (Vercel CDN 캐시 무력화 원인)**:
  1. Vercel Global Edge CDN은 응답 헤더에 `Set-Cookie`가 포함되어 있으면, 이를 개인 세션 데이터로 간주하여 **글로벌 엣지 캐시(ISR 60s) 저장을 강제로 무효화(Bypass)하고 매번 1초짜리 서버리스 SSR을 실행**함.
  2. 서브도메인(`*.creaibox.com`) 및 독립 도메인(`downhubs.com`, `golfgosu.net`) 접속 시 미들웨어(`src/proxy.ts`)에서 매 요청마다 Supabase DB 조회를 실시간으로 수행(300~500ms 지연)하고 응답에 불필요한 `Set-Cookie`를 주입했음.
* **해결책**:
  1. **Zero Set-Cookie 표준**: 공개 테넌트 블로그, AI 웹사이트 빌더, 독립 도메인 리라이트 시 미들웨어의 쿠키 주입(`rewriteResponse.cookies.set`)을 완전히 차단하여 Vercel Global Edge CDN 캐시가 100% 활성화되도록 보장.
  2. **24시간 인메모리 캐시**: `customDomainCache`, `subdomainRedirectCache`, `dynamicClientCache`, `staticClientApprovedCache`를 24시간 TTL로 인메모리에 보관하여 미들웨어의 DB 라운드트립 지연을 **0ms**로 압축.
  3. **React `cache()` 병렬 쿼리 통합**: 테넌트 블로그 및 동적 렌더러의 프로필, 카테고리, 메타데이터 조회를 `cache()`로 감싸 동일 요청 내 중복 DB 쿼리 제거.

---

## 4. 적용 대상 및 시스템 라우팅 맵

| 라우트 경로                                    | 대상 서비스                           | ISR 설정값          | 최적화 기법                                                               |
| :--------------------------------------------- | :------------------------------------ | :------------------ | :------------------------------------------------------------------------ |
| `src/app/blog/page.tsx`                      | 본사 공식 블로그 메인                 | `revalidate = 60` | Edge CDN 캐시,`Promise.all` 병렬 쿼리                                   |
| `src/app/blog/[slug]/page.tsx`               | 본사 블로그 상세 포스트               | `revalidate = 60` | `generateStaticParams`, `cache()`, `PostViewTracker`, `encodeURI` |
| `src/app/brand/[brand_id]/*`                 | 유저 서브도메인 및 독립 도메인 블로그 | `revalidate = 60` | 미들웨어 Zero Set-Cookie, 24h 캐시, React`cache()`, `encodeURI`       |
| `src/app/clients/dynamic-renderer/*`         | AI 웹사이트 빌더 (홈/서브/블로그)     | `revalidate = 60` | 24h 빌더 캐시, Zero Set-Cookie, React`cache()`                          |
| `src/app/client-site-builder/page.tsx`       | AI 웹사이트 빌더 홍보 랜딩            | `revalidate = 60` | SEO 메타데이터 + 엣지 캐시                                                |
| `src/app/infocenter/[[...section]]/page.tsx` | 고객지원 인포센터                     | `revalidate = 60` | FAQ/공지 엣지 캐시                                                        |
| `src/app/clients/[client_id]/page.tsx`       | 마켓 템플릿 쇼핑 사이트               | `revalidate = 60` | 템플릿 프리뷰 엣지 캐시                                                   |

---

## 5. 관리 및 캐시 무효화 (On-Demand Revalidation)

* 새 글이 발행되거나 기존 글이 수정될 때, 주기적 60초 자동 갱신 외에도 Next.js `revalidatePath('/blog/[slug]')` 또는 `revalidatePath('/blog')`를 호출하여 실시간 즉시 갱신이 가능하다.
* 도메인 승인/신규 등록 시 즉시 온디맨드 갱신을 지원한다.
