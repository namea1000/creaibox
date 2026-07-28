# CreAibox 100% 맞춤형 커스텀 기업 홈페이지 개발 및 운영 지침서 (Custom Client Site Development Guide)

## 1. 개요 (Overview & Architecture Philosophy)
CreAibox는 브랜드의 특성 및 고객 요구사항에 따라 2가지 아키텍처 방식의 웹사이트 제작 서비스를 제공합니다:

1. **DB 기반 동적 웹사이트 빌더 (Dynamic Site Builder)**:
   - 라우트: `/clients/dynamic-renderer/[brand_id]`
   - 스튜디오 내 UI 빌더(`client-site-builder`)에서 사용자가 마우스 클릭만으로 세팅하여 즉시 개설하는 범용 템플릿 방식 (`golfgosu`, `guidenara`, `downhubs` 등).
2. **100% 맞춤형 프리미엄 커스텀 기업 홈페이지 (Custom Enterprise Client Site)** 🌟:
   - 라우트: `/clients/[client_id]`
   - 표준 템플릿의 범주를 넘어서는 독창적인 기업 랜딩페이지, 전용 사업영역, 행사 렌탈, 실적 갤러리 탭, 견적문의 등 **AI 에이전트(Antigravity)가 100% 풀코드(Full-Code)로 정밀 개발**하는 프리미엄 방식 (`sotongcheum`, `commufill` 등).

---

## 2. 디렉토리 구조 및 파일 시스템 규약 (Directory Conventions)

커스텀 사이트는 `src/app/clients/[client_id]/` 하위에 완전히 독립된 풀코드 구조로 배치됩니다.

```
src/app/clients/[client_id]/
├── layout.tsx                # 글로벌 폰트, 헤더, 푸터를 감싸는 단일 레이아웃 (중복 헤더 방지)
├── page.tsx                  # 메인 랜딩페이지
├── lib/
│   └── constants.ts          # 기업 정보, 메뉴 구조, 대표 서비스, 실적 데이터
├── components/
│   ├── Header.tsx            # 브랜드 네비게이션 헤더
│   ├── Footer.tsx            # 브랜드 푸터 (Powered by CreAibox DoFollow 백링크 포함)
│   ├── HeroSection.tsx       # 히어로 메인 비주얼
│   ├── BusinessSection.tsx   # 사업영역 소개
│   ├── PortfolioSection.tsx  # 실적 갤러리 탭 및 onError 폴백 이미지 처리
│   └── ContactSection.tsx    # 견적문의 폼
└── blog/
    ├── page.tsx              # 전용 블로그 포스트 목록
    └── [slug]/
        └── page.tsx          # 전용 블로그 포스트 상세 & DB 조회수(+1) 카운팅
```

---

## 3. 미들웨어 서브도메인 & 커스텀 도메인 라우팅 엔진 (`src/middleware.ts`)

### 3.1 `CUSTOM_CLIENT_SITES` 상수 등록
새로운 커스텀 사이트를 추가할 때 `src/lib/constants/clientSites.ts` (또는 미들웨어)의 `CUSTOM_CLIENT_SITES` 배열에 브랜드 ID를 등록합니다.

```typescript
export const CUSTOM_CLIENT_SITES = ["sotongcheum", "commufill"];
```

### 3.2 미들웨어 라우팅 동작 원리
방문자가 접속하는 도메인 유형에 따라 미들웨어가 자동으로 라우팅을 리라이트(Rewrite)합니다:
- **로컬 서브도메인**: `sotongcheum.localhost:3000` ➡️ `/clients/sotongcheum`
- **상용 서브도메인**: `sotongcheum.creaibox.com` ➡️ `/clients/sotongcheum`
- **독립 커스텀 도메인**: `sotongcheum.com` ➡️ `/clients/sotongcheum`

### 3.3 중복 헤더/푸터 방지 규칙 (CRITICAL)
- `src/app/clients/[client_id]/layout.tsx`에서 `<Header />`와 `<Footer />`를 하위 모든 페이지에 기본 래핑합니다.
- 따라서 `blog/page.tsx`나 `blog/[slug]/page.tsx` 등 하위 라우트 파일 내부에는 **`<Header />`와 `<Footer />`를 중복하여 포함하지 않아야** 상단 헤더가 수직으로 겹치는 현상을 방지할 수 있습니다.

---

## 4. Vercel 자원 효율성 & 퍼포먼스 최적화 기법 (Performance & Cost)

### 4.1 찰나의 서버리스 실행 시간 (Sub-millisecond Server Time)
- 커스텀 홈페이지는 100% 코드 기반 정적 UI 구조로 설계되어 요청당 서버리스 연산 시간이 **0.01초(수십 ms) 이내로 찰나에 종료**되므로 Vercel CPU 자원 소모가 제로(0)에 가깝습니다.

### 4.2 Vercel Edge CDN 캐싱
- 글로벌 Edge CDN 엣지 서버가 렌더링 응답을 캐싱하여, 접속자가 대량으로 몰려도 Vercel 서버리스 함수를 가동하지 않고 엣지에서 즉시 반응합니다.

### 4.3 이미지 자원 분산 및 예외 처리 (onError Fallback)
- **AI 생성 이미지**: `이미지 스튜디오` 및 에디터에서 생성된 썸네일/포스팅 이미지는 Supabase Storage(`generated-images` 버킷) 및 DB(`generated_images`)에 영구 보관.
- **초기 샘플/실적 포토**: 고속 글로벌 CDN(Unsplash 등)을 활용하여 Vercel 대역폭 소모 방지.
- **안전 예외 핸들러**: 갤러리 이미지에 `onError` 핸들러를 필수 적용하여 엑박(Broken Image) 방지:
  ```tsx
  <img
    src={item.imageUrl}
    alt={item.title}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80";
    }}
  />
  ```

---

## 5. SEO 백링크 가산점 아키텍처 (Powered by CreAibox DoFollow Link)

독립 클라이언트 웹사이트의 푸터 하단 문구를 단순 텍스트가 아닌 **`creaibox.com` 공식 사이트로 직접 연결되는 클릭 가능한 DoFollow 앵커 태그**로 구현합니다.

```html
<p>
  Powered by{" "}
  <a
    href="https://creaibox.com"
    target="_blank"
    rel="noopener"
    className="text-slate-500 hover:text-blue-600 underline transition-colors"
    title="CreAibox - AI 블로그 포스팅 및 웹사이트 자동화 플랫폼"
  >
    CreAibox Custom Site
  </a>
</p>
```

### SEO 가산점 효과:
1. **외부 다수 독립 도메인으로부터의 고품질 백링크(PageRank Link Equity) 형성**.
2. **`creaibox.com` 메인 사이트의 도메인 신뢰도(Domain Authority, DA) 및 검색 노출 순위 대폭 상승**.
3. **추천 유입 트래픽(Referral Traffic) 증대**.

---

## 6. 블로그 카테고리 관리 & 메인 실적 갤러리 연동 아키텍처

### 6.1 Studio 인라인 카테고리 편집/수정 & 순서 조정
- **위치**: `스튜디오 > 커스텀 웹사이트 > 내 커스텀 사이트 관리 > SECTION 6`
- **기능**:
  - 카테고리 신규 추가, 삭제 및 좌우 이동(`◀`, `▶`).
  - **인라인 편집(`✏️` 연필 버튼)**: 클릭 시 인라인 태그 폼으로 전환되며, 카테고리명을 직접 수정 후 `Enter` 또는 `✓` 버튼으로 즉시 저장.

### 6.2 메인 랜딩페이지 PORTFOLIO - 블로그 최신글 6개 실시간 연동
- 메인 랜딩페이지 `PortfolioSection`은 DB(`writing_creaibox_posts` + `generated_images`)의 발행글 중 **최신 포스팅 6개**를 실시간으로 가져와 상단 1번 위치(Top-Left)에 자동 배치합니다.
- 신규 글이 발행되면 기존 글들은 오른쪽/하단으로 자동 이동하며, 6번째 카드는 자동으로 밀려나 목록에서 제거되어 **항상 최신 6개 포스팅만 유지**됩니다.
- 이미지 썸네일 좌측 상단 카테고리 오버레이를 제거하여 시원하고 깔끔한 실사 이미지를 보장합니다.

---

## 7. SNS 카카오톡 링크 공유 메타데이터 (Open Graph) 규약

### 7.1 `layout.tsx` 전용 OG 메타데이터 필수 정의
서브도메인(`*.creaibox.com`) 및 커스텀 도메인(`brand.com`) 공유 시 CreAibox 본사 썸네일이 아닌 커스텀 브랜드 전용 카드 이미지가 노출되도록 `openGraph` / `twitter` 객체를 `layout.tsx`에 반드시 작성합니다.

```typescript
export const metadata: Metadata = {
  title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
  description: "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게! 소통과채움 협동조합",
  openGraph: {
    title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
    description: "공공행사부터 마을축제까지, 처음부터 끝까지 깔끔하게!",
    url: "https://sotongcheum.creaibox.com",
    siteName: "소통과채움",
    images: [
      {
        url: "https://sotongcheum.creaibox.com/images/clients/sotongcheum/sotongcheum_hero_bg.png",
        width: 1200,
        height: 630,
        alt: "소통과채움 메인 비주얼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "소통과채움 | 교육, 행사기획 & 렌탈 전문 기업",
    images: ["https://sotongcheum.creaibox.com/images/clients/sotongcheum/sotongcheum_hero_bg.png"],
  },
};
```

### 7.2 카카오톡 미리보기 캐시 즉시 갱신
카카오톡에 이전 썸네일 카드가 저장되어 있을 경우 [카카오 디벨로퍼스 OG 캐시 초기화 도구](https://developers.kakao.com/tool/debugger/sharing)에서 URL 제출 후 [초기화]를 실행하면 0초 만에 갱신됩니다.

---

## 8. 새로운 커스텀 홈페이지 개발 단계별 워크플로우 (Step-by-Step Guide)

1. **요구사항 분석 및 브랜드 ID 확정**:
   - 예: 브랜드 ID `newbrand`, 서비스 카테고리, 회사 정보, 테마 컬러 결정.
2. **`CUSTOM_CLIENT_SITES` 상수 등록**:
   - `clientSites.ts`에 `newbrand` 추가.
3. **디렉토리 및 기본 파일 생성**:
   - `src/app/clients/newbrand/` 생성.
   - `layout.tsx`, `page.tsx`, `lib/constants.ts`, `components/` 구축.
4. **Open Graph 공유 메타데이터 세팅**:
   - `layout.tsx`에 `openGraph` / `twitter` 카드 메타데이터 반영.
5. **전용 블로그 라우트 생성**:
   - `src/app/clients/newbrand/blog/page.tsx` 및 `blog/[slug]/page.tsx` 생성. (중복 헤더/푸터 없이 내부 컨텐츠만 렌더링)
6. **푸터 DoFollow 백링크 적용**:
   - `Footer.tsx`에 `https://creaibox.com` 링크 반영.
7. **정적 무결성 검증**:
   - 터미널에서 `npx tsc --noEmit` 실행하여 에러 0건 검증 완료 후 배포.

