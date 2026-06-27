# 구글 및 네이버 검색 노출 최적화 가이드

본 문서는 구글(Google)과 네이버(Naver) 검색창에 **"크리에이박스"**, **"creaibox"** 검색 시 공식 도메인(`creaibox.com`)이 최상단 웹사이트 영역 및 공식 업체로 연동되어 노출되도록 조치하는 상세 로드맵입니다.

---

## 1. 네이버 서치어드바이저 사이트 연동 및 인증

네이버 검색 로봇이 `creaibox.com`을 공식 인정하고 크롤링하도록 등록하는 핵심 절차입니다.

### 1.1 사이트 등록
1. [네이버 서치어드바이저 웹마스터 도구](https://searchadvisor.naver.com/)에 로그인합니다.
2. 사이트 등록 창에 `https://creaibox.com` 주소를 입력하고 추가 버튼을 누릅니다.

### 1.2 HTML 파일을 이용한 소유권 인증
1. 사이트 등록 과정 중 소유권 확인 화면에서 **[HTML 확인 파일]** 방식을 선택하고 제공되는 파일(파일명 형식: `naverxxxxxxxxxxxxxxxx.html`)을 다운로드합니다.
2. 다운로드받은 물리 파일을 프로젝트 루트 하위의 [public/](file:///Users/a1234/Local%20Sites/creaibox/public) 폴더 바로 밑에 복사하여 배포합니다.
3. 배포 완료 후 서치어드바이저 웹마스터 도구 페이지로 돌아와 `[소유권 확인]` 단추를 클릭합니다.

> [!IMPORTANT]
> Next.js의 `public/` 폴더에 위치한 정적 파일은 빌드 후 루트 도메인(`https://creaibox.com/naverxxxxxxxx.html`)으로 즉시 접근이 가능하여 네이버 로봇이 확인 파일을 정상적으로 읽어갈 수 있습니다.

---

## 2. 구글 서치 콘솔 사이트 연동 및 인증

구글 검색 로봇(Googlebot)에게 웹사이트의 전체 인덱싱을 강제하고 크롤링 상태를 모니터링하기 위한 필수 수단입니다.

### 2.1 속성 등록
1. [구글 서치 콘솔](https://search.google.com/search-console)에 로그인합니다.
2. 좌측 상단 속성 추가창에서 **[URL 접두사]** 유형을 선택한 뒤, `https://creaibox.com` 주소를 입력하고 계속을 클릭합니다.

### 2.2 HTML 파일을 이용한 소유권 인증
1. 소유권 확인 방법 목록에서 **[HTML 파일 업로드]** 옵션을 선택하고 제공되는 인증용 HTML 파일(파일명 형식: `google-site-verification.html` 또는 `googlexxxxxxxxxxx.html`)을 다운로드합니다.
2. 다운로드받은 파일을 프로젝트 내 [public/](file:///Users/a1234/Local%20Sites/creaibox/public) 폴더 바로 아래에 저장하고 배포합니다.
3. 배포 성공 확인 후 서치 콘솔 페이지의 `[확인]` 단추를 누르면 즉시 연동 완료됩니다.

---

## 3. 수집 엔진 최적화 (Sitemap & Robots)

네이버와 구글 웹마스터 도구에 사이트맵과 로봇 통제 규칙을 전달하여 수집 효율을 극대화합니다.

### 3.1 사이트맵 제출
1. **네이버**: 서치어드바이저 관리 화면 -> **[요청] -> [사이트맵 제출]**에 접속하여 `sitemap.xml`을 제출합니다.
2. **구글**: 서치 콘솔 관리 화면 -> 좌측 메뉴 **[Sitemaps]**에 접속하여 **[새 사이트맵 추가]** 입력창에 `sitemap.xml`을 입력하고 제출을 클릭합니다.
   * 현재 [sitemap.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/sitemap.ts) 동적 생성 모듈이 구축되어 있어 즉시 연동 가능합니다.

### 3.2 Robots.txt 수집 허용 확인
1. 프로젝트 루트의 [robots.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/robots.ts) 설정을 통해 검색 로봇(`User-Agent: *`)의 전체 탐색 및 수집이 활성화되어 있는지 주기적으로 검증합니다.

---

## 4. 구조화 데이터 (JSON-LD) 이식 가이드

네이버와 구글 검색 엔진이 이 사이트의 성격과 공식 명칭을 완벽히 매핑할 수 있도록 Next.js 메인 레이아웃에 메타 데이터를 심는 방법입니다.

### 4.1 적용 방법
프로젝트 메인 레이아웃 파일 [layout.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/layout.tsx)의 `<body>` 태그 최하단이나 헤더 부분에 아래의 구조화 데이터 스크립트를 삽입합니다.

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
        
        {/* 공식 사이트 정보 구조화 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "크리에이박스",
              "alternateName": "CreAibox",
              "url": "https://creaibox.com",
              "description": "올인원 AI 콘텐츠 스튜디오 및 프리미엄 홈페이지 빌더",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://creaibox.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        <GoogleAnalytics gaId="G-SRBFXMN9XQ" />
      </body>
    </html>
  );
}
```

---

## 5. 포털별 로컬 검색 및 공식 업체 연동

검색 결과 화면 상단에 로컬 지도 카드 형태로 공식 홈페이지를 대문짝만하게 띄우는 실전 홍보 팁입니다.

### 5.1 네이버 스마트플레이스 등록
1. **[네이버 스마트플레이스](https://smartplace.naver.com/)**에 로그인 후 **[신규 업체 등록]**을 수행합니다.
2. 업체명을 `크리에이박스(CreAibox)`로, 웹사이트 URL을 `https://creaibox.com`으로 지정하여 승인을 획득합니다.

### 5.2 구글 비즈니스 프로필 등록
1. **[구글 비즈니스 프로필](https://www.google.com/business/)**에 로그인하여 크리에이박스 상호로 신규 비즈니스를 등록합니다.
2. 주소 정보 및 공식 홈페이지(`https://creaibox.com`) 링크를 기재하고 전화 또는 우편 인증 단계를 거칩니다.
3. 승인 즉시 구글 맵 및 구글 검색 화면 우측 지식 패널(Knowledge Panel) 영역에 크리에이박스 공식 정보가 노출됩니다.
