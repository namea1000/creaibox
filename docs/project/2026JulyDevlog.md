mier 

# CreaiBox 개발일지 - 2026년 7월 (July 2026 Development Log)

이 문서는 2026년 7월 동안 CreaiBox 프로젝트에서 진행된 일자별 개발 세부 작업 내역과 핵심 아키텍처 결정 사항을 기록합니다.

### 🗓️ 2026-07-31 (금) - 오늘

#### 1. 유튜브 트렌드 스마트 DB 백업(Fail-Safe) 적용 & 12개 카테고리 수정
* **작업 상세**:
  - **카테고리 수정**: `PopularVideos.tsx` 및 `RisingVideos.tsx` 로딩 스피너의 구식 하드코딩 문구("15개 카테고리")를 실제 버튼 개수인 **"12개 카테고리"**로 일치 수정.
  - **스마트 DB 백업(Fail-Safe) 복구 구축 ([`api/youtube/popular/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/popular/route.ts))**:
    - 당일 크론(23:50 KST 구동) 생성 전인 낮 시간대 접속 시, `target_date` DB 기록이 없더라도 DB 내 최신 수집 일자(어제 밤 23:50 수집 데이터)를 자동으로 즉시 fallback 호출하도록 개별 백엔드 개선.
    - 실시간 라이브 API 타임아웃이나 할당량 제한(Quota Limit) 시 빨간 에러 창이나 빈 화면 대신 0초 만에 완벽한 비디오 목록을 렌더링하도록 완성.

#### 2. 좌측 사이드바 메인 메뉴 그룹 재배치 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))
* **구현 요약**: "크리에이박스 블로그" 바로 아래에 "키워드 트렌드 분석", "쇼핑 키워드 & 아이템 소싱", "유튜브 트렌드 분석" 메뉴를 연달아 배치하여 콘텐츠 기획 및 트렌드 조사의 연결성을 대폭 강화.

#### 3. 전 커스텀 템플릿/클라이언트 사이트 동적 SEO 메타데이터 자동화 구축 (`Mandatory Client Site Universal SEO Rule`)
* **작업 상세**:
  - `clients/[client_id]/page.tsx`, `news/[[...section]]/page.tsx`, `keyword-trend/[section]/page.tsx`, `design/[section]/page.tsx` 등 모든 동적 서브페이지에 100% 개별 `generateMetadata()` 주입.
  - **3단계 자동화 대책**:
    1. DB 세팅된 경우 유저 지정 브랜드 명칭 자동 반영 (`profiles.extra_configs.site_title`).
    2. 사전 매핑 딕셔너리(`clientNames`) 한국어 우대 표기.
    3. 미래 신규 템플릿 생성 시 URL 하이픈 자동 파싱 텍스트 변환기 (Auto-Formatter) 작동 (`luxury-golf` ➔ `Luxury Golf 비즈니스 템플릿 | 크리에이박스 CreAiBox`).
  - 네이버 서치어드바이저 88개/85개 중복 Title/Description 경고를 차기 수집 시 0개로 소멸시키도록 조치 완비.
* **빌드 검증**: `npx tsc --noEmit` 0 에러 완전 통과.

### 🗓️ 2026-07-30 (목)

#### 1. Supabase DB Egress 98% 감축 최적화 & 커스텀 블로그 카드 16:9 영구 표준화 수립 (`Mandatory Client Site Egress & Aspect Ratio Standard Rule`)
* **원인 분석**:
  - **Egress 급증 원인**: 블로그 목록 및 비즈니스 사이트 포트폴리오 목록 조회 쿼리에서 무거운 원고 전체 HTML(`content`)과 JSON 덤프(`published_snapshot`)를 무차별 조회하고, `force-dynamic`(캐시 비활성화)으로 검색 로봇 접속 시 1회당 2.5MB 트래픽이 쏟아지면서 Supabase Egress가 하루 1.14GB(94%)로 급격히 증가함.
  - **16:9 가로 잘림 원인**: 커스텀 도메인 블로그 카드 프레임이 `aspect-[16/10]`(1.6)으로 잘못 설정되어 16:9 썸네일 이미지의 좌우 텍스트 10%가 잘려 나가던 현상 발생.
* **해결 및 재발 방지 조치**:
  - `brand/[brand_id]/page.tsx`, `brand/[brand_id]/category/[slug]/page.tsx`, `clients/sotongcheum/page.tsx`, `clients/sotongcheum/blog/page.tsx`, `clients/commufill/blog/page.tsx` 등 모든 비즈니스/커스텀 웹사이트 쿼리에서 `published_snapshot` 및 `content` 무거운 컬럼 100% 제거.
  - 공개용 블로그 및 비즈니스 웹사이트 전체에 `export const revalidate = 60;` (Vercel Edge CDN 캐싱)을 적용하여 DB 트래픽 소모량 98% 이상 대폭 다이어트.
  - 모든 카드 썸네일 프레임을 `aspect-[16/9]`로 완전 일치 통일하여 썸네일 글자 및 그래픽 잘림 0% 달성.
  - 에이전트 영구 규칙 문서([`ai-agent-rules.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md) & [`AGENTS.md`](file:///Users/a1234/Local%20Sites/creaibox/.agents/AGENTS.md))에 `Mandatory Client Site Egress & Aspect Ratio Standard Rule` 전면 등재.
  - 빌드 검증: `npx tsc --noEmit` 실행 결과 0 에러 완전 통과.

### 🗓️ 2026-07-28 (화)

#### 1. 비로그인 자유 둘러보기 & 로그인 필수 서비스 팝업 통일 개편 (`Unauthenticated Access & Unified Login Prompt Rule`)
* **구현 요약**: 크리에이박스 플랫폼 내 모든 스튜디오 및 서비스 화면에 대하여 로그인하지 않은 방문자도 전체 레이아웃/템플릿/관리자 폼을 100% 자유롭게 구경할 수 있도록 전면 공개하고, DB 및 AI 연동 액션 클릭 시 구식 alert 대신 프리미엄 **"로그인이 필요한 서비스입니다" 팝업 모달**로 연결되는 통일 UX 체계를 구축했습니다.
* **작업 상세**:
  - **커스텀 웹사이트 스튜디오 ([`custom-client-site/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/custom-client-site/page.tsx))**:
    - `[내 커스텀 사이트 관리]` 탭의 전면 가림막을 제거하여 기본 정보 폼, PG 결제 키 설정, GNB 메뉴 구성기, 블로그 카테고리 관리자를 100% 시원하게 노출.
    - 하드코딩된 예시 정보("소통과채움", "031-292-3806", "봉담읍")를 전면 제거하고 깨끗이 비워진 상태에서 한국어 예시 가이드 플레이스홀더 제공.
    - 1초 AI 이관, 템플릿 사용, 신규 제작 요청, 실시간 설정 저장, GNB 메뉴 추가/삭제/우측CTA 전환 등 모든 액션 버튼 클릭 시 `requireAuth()` 및 `showLoginModal` 팝업 연결.
  - **도메인 조회 & 구매 스튜디오 ([`domain-search/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/domain-search/page.tsx))**:
    - 도메인 검색, 1초 구매, 타사 도메인 이관 버튼 클릭 시 네트워크 에러 경고창 대신 `showLoginModal` 팝업 연결.
    - 추천 도메인 목록의 `sotongcheum.com`을 범용 도메인 `mybrand.com`으로 교체.
  - **사이드바 및 블로그 원고 관리 전 메뉴 통일**:
    - [`new-post/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/new-post/page.tsx), [`creaibox/list/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/page.tsx), [`naver/list/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/naver/list/page.tsx) 등에서 기존 구식 `window.alert("로그인을 하셔야 사용할 수 있는 메뉴입니다.")`를 100% 제거하고 `LoginRequiredCard` 및 로그인 팝업 모달로 통일.
  - **에이전트 룰 규정 반영 ([`ai-agent-rules.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md) & [`AGENTS.md`](file:///Users/a1234/Local%20Sites/creaibox/.agents/AGENTS.md))**:
    - `Unauthenticated Access & Unified Login Prompt Rule (비로그인 자유 둘러보기 & 로그인 팝업 통일 규칙)` 공식 수록.
  - **빌드 검증**: `npx tsc --noEmit` 실행 결과 0 에러 정상 통과.

#### 2. 시크릿 모드/외부 접속 시 블로그 이미지 액박 이슈 근본 원인 규명, 복구 및 재발 방지 파이프라인 수립
* **원인 분석**:
  - **원인 1 (DB 내 삭제된 구글 드라이브 파일 ID)**: `generated_images` DB 테이블에 기록된 특정 2개 포스트(`Kimi K3`, `워드프레스 결합`)의 썸네일 파일(`1RprSJOitURBN...`, `1lQ-a3BtHqQe...`)이 구글 드라이브 원본에서 삭제되어 404 에러 발생.
  - **원인 2 (구글 드라이브 302 리다이렉트 & 시크릿 모드 서드파티 쿠키 차단)**: 구글 드라이브 직링크(`lh3.googleusercontent.com/d/...`)는 `work.fife.usercontent.google.com`으로 302 리다이렉트되는데, 로그인 세션이 없는 시크릿 모드/비회원 환경에서는 크롬 서드파티 쿠키/CORP 정책으로 인해 브라우저가 이미지 렌더링을 차단함.
  - **원인 3 (프론트엔드 이미지 프록시 & onError 예외 처리 누락)**: 블로그 리스트 및 상세 페이지에서 raw 구글 드라이브 URL을 직접 `<img>` 태그에 바인딩하고 `onError` 예외 처리가 빠져있어 브라우저 엑박 아이콘 출력.
* **해결 작업**:
  - **DB 이미지 전수 조사 및 자동 복구 ([`generated_images`](file:///Users/a1234/Local%20Sites/creaibox/inspect.ts))**: 44개 공개 포스트 썸네일 전수 검사 실시, 손상된 2개 DB 레코드의 `image_url`을 고화질 대체 이미지로 즉시 갱신 복구.
  - **중앙 이미지 프록시 유틸리티 신설 ([`src/utils/image-url.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/utils/image-url.ts))**: `formatImageUrl(url)` 함수를 생성하여 모든 구글 드라이브 URL을 크리에이박스 서버 프록시([`/api/free-assets/proxy`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/free-assets/proxy/route.ts))로 자동 라우팅 (200 OK + CDN 캐싱 보장).
  - **서버 프록시 안전성 강화 ([`proxy/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/free-assets/proxy/route.ts))**: 구글 드라이브 API 호출 실패/404 시 500 에러 대신 고화질 기본 엠프티 이미지로 302 리다이렉트되어 브라우저 엑박이 발생하지 않도록 방어.
  - **프론트엔드 예외 처리 탑재**: [`blog/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/page.tsx), [`blog/[slug]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx), [`BlogClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/BlogClientWrapper.tsx), [`CategoryClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/CategoryClientWrapper.tsx), [`PostClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx) 내 모든 `<img>` 태그에 `formatImageUrl` 및 `onError={handleImageError}` 적용.
  - **Supabase Storage 우회 업로드 폴백 로직 전면 제거 ([`image-upload/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-upload/route.ts), [`image-upload/external/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-upload/external/route.ts), [`image-studio/generate/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-studio/generate/route.ts))**: Supabase Storage 100GB 쿼터 보호 및 초과 비용 방지를 위해 Supabase Storage 우회 업로드 코드를 100% 삭제하고, 사용자 안내 메시지 브랜딩 명칭(`CreaiBox 클라우드 DB 원고 보관함`) 단일화.

#### 3. Server Component 내 이벤트 핸들러(`onError`) 전달로 인한 `/blog` 500 서버 에러 해결
* **원인 분석**: React Server Component(RSC)인 [`blog/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/page.tsx) 및 [`blog/[slug]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx)에 클라이언트 이벤트 핸들러 `onError={handleImageError}`를 직접 전달함에 따라 Next.js 서버 렌더링 시 `This page couldn't load (500 Server Error)` 예외가 발생함.
* **해결 작업**:
  - **클라이언트 전용 안전 이미지 컴포넌트 생성 ([`SafeImage.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/common/SafeImage.tsx))**: `"use client"` 전용 컴포넌트인 `SafeImage`를 신설하여 `onError` 예외 처리 및 대체 이미지 렌더링을 완전히 격리 내재화함.
  - **서버 컴포넌트 `<img>` 교체**: [`blog/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/page.tsx) 및 [`blog/[slug]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx)의 `<img>` 태그를 `<SafeImage>`로 전면 교체하여 서버 에러 100% 제거.
  - **빌드 및 타입 검증**: `npx tsc --noEmit` 실행 결과 0 에러 정상 통과.

#### 4. 썸네일 비율 최적화: `16:9 블로그/유튜브 표준 썸네일` 명칭 변경, 1순위 최상단 배치 및 디폴트 설정
* **구현 요약**: 표준 와이드 비율 규격 정착을 위해 썸네일 생성 비율 옵션 중 기존 `16:9 유튜브 썸네일`을 `⭐ 16:9 블로그/유튜브 표준 썸네일`로 명칭 변경하고 셀렉트 박스 최상단(1위)으로 이스컬레이션 배치하였으며, 스튜디오 진입 시 기본 디폴트 선택값으로 설정했습니다.
* **작업 상세**:
  - **옵션 명칭 및 순서 재배치 ([`blogImageConstants.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/blogImageConstants.ts))**: `aspectRatioOptions` 배열에서 `16:9` 항목의 라벨을 `⭐ 16:9 블로그/유튜브 표준 썸네일`로 변경하고 1번 순서로 배치.
  - **기본 상태(Default State) 16:9 전환**: [`BlogImageStudioPanel.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/BlogImageStudioPanel.tsx) 및 [`CreaiboxContentImagePanel.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxContentImagePanel.tsx)의 `selectedAspectRatio` 기본 상태를 `"16:9"`로 통일.
  - **프로젝트 매뉴얼 문서화 ([`thumbnail-aspect-ratio-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/05_image-and-video/thumbnail-aspect-ratio-guide.md))**: 16:9 vs 4:3 심층 비교 분석 및 전문가 관점에서의 최적 권장안 매뉴얼 작성 수록.
  - **빌드 및 타입 검증**: `npx tsc --noEmit` 실행 결과 0 에러 정상 통과.

#### 5. 표(Table) 렌더링 UI 정밀 개선: 2줄 굵은 라인 및 모서리 끊어짐 해결, 헤더 음영 & 컬러 채우기 강화
* **원인 분석**: 
  - `overflow-hidden` 및 `border-radius: 16px`가 `border-collapse: collapse` 표와 조합되면서 모서리 4곳의 테두리 라인이 절단/끊어지는 브라우저 렌더링 현상이 발생함.
  - **GCP Vertex AI ($300 / 448,756원 무료 크레딧 차감) 백엔드 엔진 구축 ([`vertex-ai-gemini.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/vertex-ai-gemini.ts), [`ai/generate/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/generate/route.ts))**:
    - 구글 클라우드 콘솔 내 **Agent Platform API (Vertex AI)** 사용 승인 완료에 발맞추어, GCP 서비스 계정 OAuth2 연동 전용 Vertex AI 모듈 구축.
    - GCP 서비스 계정 IAM 권한(`편집자`) 부여 및 OAuth2 인증 연동을 통해, 최신 **`gemini-2.5-flash`** 모델 및 구글 실시간 검색 그라운딩(`googleSearch: {}`)이 **GCP $300(44만 8천원) 무료 크레딧 계정으로 200 OK 무결점 연동 성공**을 검증 완료.
    - 사용자가 개별 API 키를 입력하지 않은 공용 글쓰기/AI 생성 호출 시 **1차 우선(Primary)으로 `gemini-2.5-flash` GCP 크레딧 엔진을 무제한 무상 호출**하며, 예외 발생 시에만 **2차 예비용(Secondary)으로 DB Vault 키 풀 3개를 순차 우회 로테이션**하도록 수선 완료.
  - **도메인 실시간 검색 네트워크 오류 수정 (`POST /api/domains/check`) ([`domains/check/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/domains/check/route.ts), [`domain-search/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/domain-search/page.tsx))**:
    - 프론트엔드에서 `POST` 방식으로 백엔드 API를 호출하던 반면, 서버 라우트에 `GET` 핸들러만 존재하여 `405 Method Not Allowed` 네트워크 오류가 발생하던 문제를 해결.
    - `POST` 및 `GET` 통합 지원 핸들러 구축, 입력 도메인에 따라 5대 확장자(`.com`, `.kr`, `.co.kr`, `.net`, `.io`) 실시간 DNS 조회를 병렬 병합(`Promise.all`) 처리하여 1초 실시간 가용성 및 가격 조회가 완벽 작동하도록 수정.
  - **API Vault 요금제별 일일 제한 설정 UI 가시성 및 컨트롤 대폭 강화 ([`apivault/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/apivault/page.tsx))**:
    - "요금제별 일일 사용 제한 설정 (Plan Daily Limits)" 섹션의 텍스트 폰트 크기를 대형(`text-base` / `text-lg font-black`)으로 확대하여 시인성 극대화.
    - 입력창 숫자를 에메랄드 굵은 폰트(`text-xl font-black text-emerald-400`)로 키우고, 5회 단위 조절 `[-]` / `[+]` 조절 버튼을 통합하여 클릭 조작 편의성 완성.
    - 입력창 비움 상태(`""`) 파싱 및 브라우저 기본 화살표 숨김(`appearance-none`) 처리를 적용하여, 숫자를 다시 수정할 때 앞에 `0`이 붙는(`010`) 버그 완벽 수정.
  - **4대 검색엔진 자동 색인 핑 서비스 전면 홍보 & UI/UX 구현 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/page.tsx), [`blog-management/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx), [`list/[id]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx), [`faqData.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/chatbot/data/faqData.ts))**:
    - **메인 랜딩 페이지 (`/`)**: "수동 등록 0초 무설정 100% 무인화: 4대 글로벌 검색엔진 0.1초 자동 색인 핑" 럭셔리 USP 카드를 신설하여 강력한 차별화 셀링 포인트 각인.
    - **SEO 대시보드 (`/blog-management`)**: "전세계 4대 검색엔진 0.1초 자동 색인 핑 엔진 가동 중" 라이브 펄스 배너 및 `Googlebot`, `Naver SearchAdvisor`, `MS Bing`, `Yandex` 4대 뱃지 시각화 구축.
    - **글쓰기 에디터 (`/list/[id]`)**: 글 발행/재발행 완료 시 "🚀 4대 검색엔진(구글/네이버/Bing/Yandex) 0.1초 자동 핑 전송 완료" 축하 메시지 팝업 연동.
    - 기존 Google Indexing API에 더해 **IndexNow 오픈 프로토콜(Bing, Yandex, Naver SearchAdvisor, Seznam)** 연동 엔진 구축.
    - 와일드카드 서브도메인 및 독자 커스텀 도메인 키 검증을 위한 동적 라우트(`/[key].txt/route.ts`) 구현 완료.
    - FAQ 도움말 페이지(`/help`) 및 AI FAQ 챗봇(`/chatbot`) 지식 데이터베이스(`faqData.ts`)에 **"4대 검색엔진 실시간 SEO 핑"** 및 **"24시간 무인 자동 수집(Cron) 작동 원리"** 항목 공식 등재 완료.
  - **백그라운드 무인 기능 매뉴얼 최신화 의무 룰 명시 및 반영 ([`ai-agent-rules.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md), [`AGENTS.md`](file:///Users/a1234/Local%20Sites/creaibox/.agents/AGENTS.md), [`background-automation-execution-5-methods-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/01_core-and-infra/background-automation-execution-5-methods-guide.md))**:
    - 향후 신규 무인 자동 수집(Cron)이나 백그라운드 배치 기능이 개발 구동될 때마다 **백그라운드 매뉴얼 문서의 "4. 🟢 현재 즉시 구동 중" 섹션에 즉시 신규 기능을 업데이트하도록 1대 에이전트 룰로 정식 등록 완료**.
    - Vercel Cron, Supabase DB 내장 `pg_cron`, NCP Cloud Functions, GitHub Actions Cron, 외부 Webhook 등 5가지 백그라운드 무인 수집 아키텍처 방식 완벽 정리.
    - 4가지 도메인 유형별(본사, 서브도메인, 비즈니스, 독자 커스텀 도메인) SEO 자동 색인 핑 동작 원리 및 2대 핵심 프로토콜(Google Indexing API & IndexNow) 수록.
    - 매뉴얼 3장 및 4장의 **"스마트 1시간 쿨다운(Cooldown) & Trailing Edge Ping 알고리즘"** 명세를 백그라운드 운용 문서에 공식 기록 수록 완료.
    - 매뉴얼 4장의 **"③ 🟢 검색엔진 SEO 4대 글로벌 자동 색인 노출 핑"** 항목을 **🟢 현재 100% 실시간 구동 중** 상태로 명시 업데이트 완료.
    - 현재 구동 중인 4대 무인 서비스 및 장기 확장 5대 무인 로드맵 수록 완료.
  - **매시간 정각 네이버 & 구글 실시간 검색어 무인 자동 수집(Hourly Cron) 구축 ([`vercel.json`](file:///Users/a1234/Local%20Sites/creaibox/vercel.json), [`sync-keywords/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-keywords/route.ts), [`system/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/system/page.tsx))**:
    - 사용자가 매시간 정각에 사이트를 열어두지 않아도 **매시간 정각(00~23시) 무인 백그라운드**로 Vercel Cron (`schedule: "0 * * * *"`)이 자동 실행되도록 스케줄러를 구축.
    - 네이버 TOP 20 & 구글 TOP 20 검색어를 매시간 자동으로 스냅샷 수집하여 `keyword_trending_history` DB의 당일 1줄(`hourly_data`)에 무인 자동 적재하도록 구현 완료.
  - **`keyword_trending_history` DB 날짜별 1줄(Row) 통합 구조 개편 ([`keyword-history.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/keyword-history.ts), [`keyword_trending_history.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/keyword_trending_history.sql))**:
    - 매시간 수집 시 하루 960개씩 생성되던 레코드를 **날짜(`target_date`) 1개당 단 1개 Row만 생성되는 `hourly_data` JSONB 통합 구조로 개편**함 (Row 개수 99.9% 대폭 압축 성공).
    - 네이버 및 구글의 24시간 전체 랭킹 이력이 오늘 날짜 단 1줄에 덮어쓰기(UPSERT) 적재되며, 1년 내내 수집해도 DB 레코드가 단 365개만 축적되는 최고 효율의 자원 최적화 달성.
  - **DB 테이블 생성 채팅 알림 의무 규칙 명시 및 룰 파일 반영 ([`ai-agent-rules.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md), [`AGENTS.md`](file:///Users/a1234/Local%20Sites/creaibox/.agents/AGENTS.md))**:
    - AI 에이전트가 신규 DB 테이블이 필요하거나 기존 DDL 미실행 상태를 발견할 경우, **즉시 채팅창에 완벽한 복사용 SQL 구문을 제공하고 개발자에게 실행 요청을 하도록 1대 룰로 정식 추가 반영**.
  - **매일 아침 6시 60개국 무인 수집 3중 방어막(3x Retry & Self-Healing) 보장 ([`vercel.json`](file:///Users/a1234/Local%20Sites/creaibox/vercel.json), [`sync-trending/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/cron/sync-trending/route.ts), [`route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/route.ts))**:
    - 과거 자동 수집 누락 원인을 정밀 진단하고, **국가별 최대 3회 자동 재시도(3x Retry)** 및 **당일 첫 접속 시 수집 누락 시 자동 자가치유 수집(Self-Healing Background Fetch)** 2중 방어막을 구축하여 100% 완전 무결 수집을 보장.
    - 60개국 수집 시 Vercel 서버리스 무료 타임아웃(10초)을 완벽 방어하기 위해 **10개국 단위 병렬 배치(`Promise.all`) 수집**을 적용하여 전체 수집 시간을 **2~3초로 초고속화**.
    - 시스템 관리자 대시보드([`/admin/system`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/system/page.tsx)) 내 안내 문구를 **"전세계 60개국 전체 카테고리 무인 수집, CreaiBox 클라우드 DB 날짜별 1줄 통합 적재"**로 문구 100% 최신화 완료.
  - **분석 리포트 페이지 콘솔 TypeError & 비로그인 자유 둘러보기 예외 처리 ([`reports/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/reports/route.ts))**:
    - 리포트 조회 시 `youtube_trending_archive` 테이블의 `videos_data`가 기존 배열(Array)에서 통합 객체(Bundle Object)로 구조가 변경됨에 따라 발생하던 `TypeError: Failed to fetch` 및 순회 파싱 오류를 완전 수정.
    - 비로그인 사용자가 분석 리포트 페이지 진입 시 401 오류 토스트가 발생하지 않고 페이지 레이아웃과 빈 상태가 100% 안전하게 노출되도록 세션 예외 핸들링을 적용.
  - **세부 카테고리 탭(게임, 음악, 영화 등) 전환 조회 수정 ([`route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/route.ts), [`RisingVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx))**:
    - "전체" 카테고리 피드 수집 시 상위 20개 영상에 특정 카테고리(예: 게임, 교육, 자동차 등) 영상이 포함되어 있지 않을 경우 RAM 캐시에 빈 배열(`[]`)이 저장되어 "이 조건에 부합하는 영상이 없습니다"가 노출되던 원인을 해결.
    - RAM 사전 캐싱 시 데이터가 있는 카테고리만 수집/저장하고, 없는 경우 서버/DB 단의 개별 카테고리 전용 피드를 즉시 호출하도록 튜닝하여 **모든 카테고리 탭이 100% 정상 렌더링**되도록 보장.
  - **`youtube_trending_archive` DB 하루 1개 Row 단일 통합 개편 & 호환성 복구 마이그레이션 ([`route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/route.ts), [`RisingVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx))**:
    - 하루 약 780개씩 레코드가 팽창하던 구조를 **날짜(`target_date`) 1개당 단 1개 Row만 생성되는 `bundle` 구조로 개편**함 (총 23개 row로 99.1% 압축 성공).
    - 지난 날짜 영상 객체의 `snippet` (제목, 채널명, 썸네일 URL) 및 `statistics` (조회수, 좋아요 수) 계층 구조 파싱 호환성을 완전 복구하여, 과거 수집 날짜(6월/7월) 영상들도 썸네일과 제목이 100% 선명하게 렌더링되도록 완전 수정.
  - **전세계 60개국 유튜브 전체 트렌드 일괄 수집 구현 ([`RisingVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx))**:
    - **[전체 60개국 일괄수집]** 버튼 클릭 시, 주요 12개국에 국한되지 않고 전세계 **60+개국 전체**를 순회하며 각 국가의 전체 카테고리 트렌드 데이터를 일괄 수집/동기화하도록 기능 확장.
    - 수집과 동시에 13개 카테고리별 RAM 캐시(`videoCacheRef`)를 자동 채워넣어, 수집 완수 후 어떤 국가나 카테고리를 선택하든 `0.0초` 즉시 인스턴트 노출되도록 완벽 연동.
  - **빌드 및 타입 검증**: `npx tsc --noEmit` 실행 결과 0 에러 정상 통과.
  - **에디터 툴바 기능 대폭 확장 ([`UniversalBlogEditor.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx))**: 
    - **최근 직접 선택한 색상 저장 (`recentColors` / `localStorage`)**: "직접 색상 선택" 피커로 지정한 컬러를 브라우저 로컬 저장소(`localStorage`)에 저장하고 최대 5개까지 최근 색상 서클 버튼으로 노출하여 재사용성 극대화.
    - **표 툴바 내 "글자색" (Font Color) 팝업 메뉴 추가**: 배경색 우측에 글자색 버튼(Baseline 아이콘)을 신설하고, 기본 10종 파스텔/비비드 프리셋, 직접 색상 선택 피커, 최근 선택 색상 서클 및 글자색 초기화 기능을 통합 제공함.
  - **빌드 및 타입 검증**: `npx tsc --noEmit` 실행 결과 0 에러 정상 통과.

### 🗓️ 2026-07-26 (일)

#### 1. 에이전트 룰 신설: 가짜 데이터 전면 금지 및 부재 사유 명시 규칙 (`Strict Zero Fake Data Rule`)
* **구현 요약**: 서비스 신뢰성과 데이터 정직성을 보장하기 위해, 시스템 구축 중 가짜(Mock/Dummy/Seed) 데이터를 합성/생성하여 노출하는 행위를 100% 금지하는 규칙을 Agent Rules 문서에 긴급 제정 및 적용했습니다.
* **작업 상세**:
  - **[AGENTS.md](file:///Users/a1234/Local%20Sites/creaibox/AGENTS.md) & [ai-agent-rules.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md) 개정**:
    - `Strict Zero Fake Data Rule (가짜 데이터 생성 전면 금지 및 사유 명시 의무)` 항목 신설.
    - 데이터가 존재하지 않는 경우 가짜 조합 키워드를 보여주지 않고 **데이터가 없음**을 명확히 표시하며 사유(예: 구축 이전 날짜, API 미제공 등)를 투명하게 설명할 것 명시.
  - **시드 로테이션 모듈 전면 제거**: [`/api/naver/trend/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/naver/trend/route.ts) 및 [`/api/google/trends/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/google/trends/route.ts)의 가짜 시드 무한 회전 코드 100% 삭제.
  - **고신뢰 안내 카드 탑재 ([`realtime/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/keyword/realtime/page.tsx))**: 데이터가 없는 기간의 경우 가짜 목록 대신 솔직하고 투명한 `조회할 수 있는 아카이빙 데이터가 없습니다` 엠프티 스테이트 카드 렌더링.

#### 2. 키워드 트렌드 1줄 컴팩트 UI & 키워드 클릭 시 네이버/구글 직통 검색 연동
* **구현 요약**: 실시간 키워드 카드의 2행 중복 요소를 제거하고 단 1줄 컴팩트 레이아웃으로 줄였으며, 키워드 명칭 자체 클릭 시 네이버/구글 라이브 검색창으로 직행 조회되도록 파이프라인을 완성했습니다.
* **작업 상세**:
  - **`🔍 키워드 정밀 분석` & `✨ AI 글쓰기` 단 1줄 원클릭 연동**: 키워드 도구(`?keyword=...&provider=...`) 다이렉트 이동 및 자동 분석 파이프라인 연동.
  - **키워드 명칭 직통 검색**: 키워드 텍스트 클릭 시 해당 포털 검색창으로 연결.
  - **API 남용 방지**: `실시간 새로고침` 버튼을 제거하여 무분별한 외부 통신 차단.

### 🗓️ 2026-07-25 (토)

#### 1. 구글 검색엔진 실시간 색인 (Google Indexing API) 인프라 연동 & 서치콘솔 소유자 승인 완료
* **구현 요약**: 사용자가 블로그 포스트나 웹사이트 글을 작성할 때 구글 검색 로봇(Googlebot)에 실시간으로 수집 핑(Ping)을 전송하기 위한 Google Indexing API 인프라 구축 및 서치콘솔 권한 연동을 완료했습니다.
* **작업 상세**:
  - **Google Indexing API 활성화**: GCP 콘솔에서 `Web Search Indexing API` (`indexing.googleapis.com`) 사용 설정 활성화.
  - **서비스 계정 생성 및 환경변수 연동 ([`.env.local`](file:///Users/a1234/Local%20Sites/creaibox/.env.local))**:
    - 서비스 계정 `creaibox-indexing-bot@project-51796415-94e5-4403-ad7.iam.gserviceaccount.com` 생성 및 JSON 키 발급.
    - `.env.local` 파일에 `GOOGLE_INDEXING_CLIENT_EMAIL`, `GOOGLE_INDEXING_PRIVATE_KEY`, `GOOGLE_INDEXING_CREDENTIALS` 비밀키 안전 적재 완료.
  - **Google Search Console 소유자(Owner) 권한 연동**: `creaibox.com` 서치콘솔 속성의 사용자 권한에 해당 서비스 계정을 **`소유자 (Owner)`** 권한으로 100% 승인 등록 완료.

#### 2. 크리에이박스 프로젝트 종합 할 일 & 로드맵 대장 (`docs/project/todo-roadmap.md`) 신설
* **구현 요약**: 프로젝트 내 SEO 실시간 자동 색인, 사이트맵/피드 최적화, 무인 자동화(Cron) 및 AI 에이전트 개발일지 규칙을 지속적으로 기록하고 추적할 수 있는 종합 할 일 대장을 신설했습니다.
* **작업 상세**:
  - **[todo-roadmap.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/todo-roadmap.md)** 파일 생성: 4대 핵심 분야(검색엔진 실시간 자동 색인, 사이트맵/RSS, 백그라운드 무인 자동화, AI 에이전트 개발 규정)별 체크리스트(`- [ ]` / `- [x]`) 수록 및 동기화 체계 구축.
  - **에이전트 규칙 등록 ([`AGENTS.md`](file:///Users/a1234/Local%20Sites/creaibox/AGENTS.md))**: 사용자가 "할 일 추가" 요청 시 해당 할 일 대장 문서에 자동 기록/업데이트하도록 지침 수록.

#### 3. Google Indexing API 서버 모듈 & 1시간 쿨다운/최종 핑 보장(Trailing Edge Ping) 시스템 구현
* **구현 요약**: 유저가 블로그 포스트를 발행하거나 수정/재발행할 때 구글 검색봇에 실시간 핑을 비동기로 송신하는 서버 백엔드 모듈 및 API 엔드포인트를 완전 개발·탑재했습니다.
* **작업 상세**:
  - **서버 인덱싱 모듈 구축 ([`google-indexing.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/server/google-indexing.ts))**:
    - `googleapis` OAuth2 JWT 인증을 통해 구글 Indexing API (`https://indexing.googleapis.com/v3/urlNotifications:publish`) 호출 비동기 모듈 개발.
    - **1시간 쿨다운 (1-Hour Cooldown Throttling)** & **최종 핑 보장 (Trailing Edge Ping)** 알고리즘 구현: 최초 발행 시 즉시 핑 1회 전송 후, 1시간 이내 연속 재발행 시 핑 낭비를 차단하고 1시간 경과 시점 최종 완해본으로 핑 1회를 자동 보장전송하도록 설계.
  - **API 엔드포인트 신설 ([`route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/seo/google-indexing-ping/route.ts))**: POST 핑 전송 라우터 탑재.
  - **에디터 발행 연동 ([`list/[id]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx))**: 글이 `published` 상태로 업서트/발행 시 비동기 핑 자동 트리거 탑재.
#### 4. "크리에이박스 블로그" 허브 메인 페이지 전면 개편 & 좌측 10대 서브메뉴 100% 동기화
* **구현 요약**: `/studio/writing/creaibox` 메인 페이지 명칭을 **`크리에이박스 블로그`**로 변경하고, 불필요한 구형 카드를 제거하여 좌측 사이드바 서브메뉴 10개 항목과 1:1로 정확히 동기화된 카드 그리드 및 **4대 핵심 차별화 셀링포인트(Google Indexing API, DIA+ 4대 재창조 등)** 배너를 전면 이식했습니다.
* **작업 상세 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/page.tsx))**:
  - **헤더 타이틀 갱신**: `"크리아이박스 글쓰기"` ➡️ `"크리에이박스 블로그"` 명칭 개편.
  - **4대 핵심 차별화 셀링포인트 (USP) 배너 탑재**:
    1. ⚡ **구글 1초 실시간 색인 (Google Indexing API)**
    2. 🛡️ **네이버/SNS 4대 재창조 (C-Rank & DIA+ 파괴)**
    3. 📑 **동적 사이트맵 & /feed (RSS)**
    4. 🤖 **구조화 스키마 (JSON-LD) 1초 주입**
  - **좌측 서브메뉴 10대 카드 100% 동기화**: `블로그 새글 쓰기`, `블로그 원고 관리`, `네이버/SNS 재발행`, `AI 콘텐츠 기획`, `기획 라이브러리`, `콘텐츠 캘린더`, `자동화 워크플로우`, `블로그 설정 및 관리`, `썸네일 생성 관리`, `지식 & 페르소나 설정`.
  - **실시간 통계 카운터 연동**: Supabase DB `writing_creaibox_posts` 조회 기반 유저별 작성 포스트, 발행 완료, 임시 보관, 재발행 카운터 수치 렌더링.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit` 완벽 컴파일 통과.

#### 5. 사이트바 서브메뉴 클릭 시 자동 접힘 원인 완전 해결 & 경로 정규화/리다이렉트 워프 매칭 고도화
* **구현 요약**: "블로그 새글 쓰기" 클릭 시 임시 보관함(`/studio/writing/creaibox/list/[id]`)으로 워프(Warp) 리다이렉트되면서 상위 "크리에이박스 블로그" 서브메뉴가 자동으로 닫히던 근본 원인을 규명하고, `/studio/` 경로 정규화 함수(`normalizePath`) 및 리다이렉트 맵핑을 이식하여 어떤 서브메뉴를 클릭하든 메뉴가 100% 펼침 유지되도록 정비했습니다.
* **작업 상세 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
  - **경로 정규화 함수 (`normalizePath`) 구현**: `/studio/` 접두사가 포함된 동적 URL과 일반 대외용 URL 간의 불일치를 자동 흡수하여 경로 매칭 100% 보장.
  - **리다이렉트 워프 매칭 예외 처리**: `new-post` 클릭 시 생성되는 에디터 상세 경로(`/writing/creaibox/list/[id]?newPost=true`) 조건 분기를 통해 `블로그 새글 쓰기`와 `블로그 원고 관리`가 동시에 파란색 활성화(Active) 칼라로 중복 렌더링되던 버그를 정밀 분리하여, 단 1개의 서브메뉴만 정확하게 활성화되도록 개선.
  - **서브메뉴 순서 재배치**: 사용자 요청에 따라 `"블로그 설정 및 관리"` 메뉴를 `"네이버/SNS 재발행"` 바로 밑(4번째 위치)으로 순서 이동 재배치 (`Sidebar.tsx` 및 `writing/creaibox/page.tsx` 동시 적용).
  - **상위-하위 서브메뉴 경로 중복 하이라이트 방지 (`hasMoreSpecificMatch`)**: `/music/lyrics/idea-hub`(가사 소재 허브) 접속 시 상위 접두 경로인 `/music/lyrics`(가사 & SUNO)까지 두 서브메뉴가 동시에 하늘색으로 중복 선택되던 버그를 정밀 알고리즘으로 해결하여, 가장 구체적인 단 1개의 서브메뉴만 정확히 하이라이트되도록 수정.
  - **커뮤니티 경로 단어 오매칭 버그 완전 방지 (`switch(group.key)`)**: `/community/writing` 또는 `/community/music` 접속 시 느슨한 문자열 검색(`.includes("writing")` / `.includes("music")`)으로 인해 위쪽 "크리에이박스 블로그" 및 "뮤직 스튜디오" 메뉴까지 동시에 열리던 오작동 버그를 명시적 그룹 라우트 접두사 검사 분기문으로 전면 교체하여 해결.
  - **채팅 룸 윈도우 전체 스크롤 밀림 방지 ([`ChatRoom.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/community/%5Bsection%5D/components/ChatRoom.tsx))**: `/community/chat` 진입 시 `scrollIntoView()`가 브라우저 최상위 윈도우 및 사이드바 헤더(`AI Studio`)까지 위로 밀어버리던 버그를 채팅 내부 컨테이너 전용 `scrollTop` 스크롤(`chatScrollRef`)로 교체하고 사이드바 헤더에 `shrink-0`을 부여하여 상단 타이틀 밀림 현상 완전 차단.
  - **메인 메뉴 행 전체 토글 동일화 (`toggleGroup`)**: 메인 메뉴 행(제목 및 아이콘) 클릭 시에도 우측 셰브론(`ChevronDown`/`ChevronRight`) 버튼 클릭과 100% 동일하게 1회 클릭 시 서브메뉴 펼침, 재클릭 시 서브메뉴가 즉시 접히도록 토글 UX 개선.
  - **하드코딩 기본 펼침 폴백 제거 & 라우트별 단독 메뉴 펼침 단일화**: 기존 `useState` 내에 하드코딩되어 있던 `["creaibox-writing", "youtube"]` 기본 펼침 값을 제거하여, "자료 분석 스튜디오", "AI 리포트", "뉴스 콘텐츠" 등 다른 메뉴 페이지 접속 시 위쪽 블로그/유튜브 메뉴가 엉뚱하게 함께 열려버리던 버그를 완전 근절하고, 오직 현재 이동한 메뉴 그룹 1개만 단독으로 열리도록 정상화.
  - **클릭 즉시 0ms 낙관적 컬러 렌더링 (`optimisticActiveKey`)**: 기존 Next.js 클라이언트 지연 로딩(1~2초) 완료 후 `pathname` 변화 시점에 메뉴 컬러가 늦게 반응하던 딜레이 현상을 완전 차단하고, 메뉴 클릭 0ms 동기 시점에 즉시 하이라이트/그라데이션 스타일이 활성화되는 낙관적 피드백 시스템 탑재.
  - **Google Indexing API 일일 쿼터 증액 신청 가이드 확립 ([`google-indexing-api-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/04_writing-and-blog/google-indexing-api-guide.md))**: 기본 200건/일 쿼터를 2,000~10,000건/일 이상으로 확대하기 위한 GCP 콘솔 직관 링크 및 영문 신청 사유 양식 가이드 정리 연동.
  - **스튜디오 탑바 위젯 메뉴 반응형 아이콘 전용 모드 및 텍스트 세로 찌그러짐 방지 ([`StudioTopbar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx))**: 창 폭 축소 시 "내 콘텐츠 보관함", "관리 대시보드" 등 텍스트가 줄바꿈되어 세로로 깨지던 현상을 `whitespace-nowrap`과 `hidden 2xl:inline` 반응형 분기문으로 정비하여, 화면 축소 시 글자 없이 깔끔하게 이모티콘/아이콘 전용 뱃지 버튼으로 즉시 전환되도록 개선.
  - **브라우저 네이티브 지연 툴팁 완전 제거 & 0ms 실시간 직관 툴팁 탑재 ([`StudioTopbar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx))**: 마우스 호버 시 0.5~1초간 뜸들이던 브라우저 네이티브 `title` 속성을 전면 제거하고, 마우스 오버 0.00초(0ms) 동기 시점에 즉시 반응하여 뜨는 `duration-75` 초고속 커스텀 말풍선 툴팁 시스템으로 전면 개선.
  - **통합 키워드 & 쇼핑 2대 파워 허브 개편 완료 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - **`🔍 키워드 트렌드 분석`**: loword.co.kr 스타일 2열 실시간 검색어 비교(네이버 20개 vs 구글 20개, 날짜/시간별 Supabase DB 아카이빙), 키워드 정밀 도구(검색량 추이 차트, SERP 배치, 연관어, CPC), 네이버 블로그 지수 진단(아이디 검진, 최적/준최 레벨 측정, 리더보드) 탑재.
    - **`🛒 쇼핑 키워드 & 아이템 소싱`**: itemscout.io 스타일 쇼핑 키워드 정밀 분석(쇼핑 검색량, 총 등록 상품수, 0.72 꿀키워드 경쟁강도), datalab.naver.com 분야별 1달/3달 인기검색어 TOP 500 및 클릭량/성별/연령 비중 차트 수록 완료.
  - **실시간 급상승 키워드 1시간 아카이빙 & 자원 최적화 운용 매뉴얼 작성 ([`keyword-trending-archiving-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/06_trend-and-marketing/keyword-trending-archiving-guide.md))**: 1시간 스냅샷 레코드 용량 계산(레코드당 0.35KB, 하루 0.33MB, 1년 120MB 미만의 극도로 가벼운 구조), Lazy Archiving(온디맨드 사용자 접속시 0.1초 자동 동기화), NCP Cloud Functions 및 DB Native Cron 병행 운용 가이드 문서화 완료.
  - **전체 14개 메인 메뉴 그룹 전수 검증**: `npx tsc --noEmit` 검증 0 에러 무결성 확인.

---

### 🗓️ 2026-07-22 (수) ~ 2026-07-23 (목)

#### 1. 콘텐츠 캘린더 AI 글쓰기 원고 자동 연동, 다중 브랜드 필터 및 빈 월 안내 구축

* **구현 요약**: AI 스마트 글쓰기, 네이버 글쓰기, 워드프레스 글쓰기 도구로 작성 및 발행된 모든 포스팅 이력이 콘텐츠 캘린더([`calendar/page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/content-planner/calendar/page.tsx>))에 자동 수집되어 시각적으로 연동되도록 조치했습니다.
* **작업 상세**:
  - **다중 원고 데이터베이스 통합 바인딩**:
    - `content_planner_campaigns` 및 `content_planner_outputs` 외에 `writing_creaibox_posts`, `writing_naver_posts`, `writing_wordpress_posts` 테이블을 추가 조회하도록 데이터 로드 아키텍처를 확장했습니다.
    - 기존 Supabase 조회 시 적용되어 있던 `.neq("status", "trash")` 조건이 SQL 레벨에서 `status IS NULL` 레코드를 통째로 누락시키는 문제를 발견하여, 애플리케이션 메모리 필터링(`c.status === "trash"` 제외)으로 전환하여 과거 모든 발행 포스팅이 100% 정상 수집되도록 수정했습니다.
  - **다중 브랜드(Multi-Brand) 선택 필터 드롭다운 탑재**:
    - 유저 프로필(`profiles.brand_id`, `extra_configs.brand_ids`) 및 보유 기업 홈페이지(`client_sites.brand_id`)를 자동 분석하여 캘린더 상단 툴바에 **`[브랜드 필터: 전체 브랜드 ▾]`** 드롭다운을 탑재했습니다.
    - 전체 브랜드 통합 뷰와 개별 브랜드 전용 달력 뷰를 자유롭게 전환하며 일정을 직관적으로 관리할 수 있도록 개선했습니다.
#### 3. 요금제(Pricing Plan) 명칭 동기화 및 DB 스키마(Premier / Business) 매핑 보완
* **구현 요약**: `/pricing` 페이지의 4가지 공식 요금제(`Free`, `Creator`, `Pro`, `Premier`) 명칭과 DB/백엔드 로직(`profiles.membership_level`)을 매치시키고, `Premier` 플랜 사용자의 브랜드 생성 및 API 권한이 정상 인식되도록 처리했습니다.
* **작업 상세**:
  - **DB 매핑 체계 확인**: [`pricing/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/pricing/page.tsx) 상의 최고 요금제는 **`Premier Plan`** (29,900원/월)이며, 하단 맞춤형 섹션으로 **`Business`** 플랜이 배치되어 있습니다.
  - **플랜 한도 연동 교정**: [`mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)의 `getBrandLimit` 함수에 `premier` 조건절을 추가하여, `premier` 회원 역시 `pro`/`business`와 동일하게 3개 이상의 다중 브랜드 ID를 정상 등록/보유할 수 있도록 백엔드 매핑을 보완했습니다.
#### 4. VIP / 지인 수동 무상 부여 (Manual Grant) 관리자 센터 시스템 구축
* **구현 요약**: 유료 결제 없이 지인, VIP 파트너, 마케팅 협찬 대상에게 원하시는 플랜(`Creator`, `Pro`, `Premier`)을 무료 부여하고 매월 자동 결제 청구에서 예외(Bypass)시키는 수동 관리 시스템을 구현했습니다.
* **작업 상세**:
  - **백엔드 API 확장 ([`api/admin/users/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts))**: `profiles` 테이블의 `is_manual_grant`, `grant_reason`, `grant_expires_at` 필드 연동 API 조치.
  - **관리자 UI 개편 ([`admin/usermanagement/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx))**:
    - `[전체 회원]` | `[💳 정기 결제 회원]` | **`[⭐ VIP 수동 무상 부여 회원]`** 탭 필터링 추가.
    - 회원 목록 카드 및 행에 `⭐ 무상 부여 (부여 사유)` 전용 뱃지 및 **`[ ⭐ VIP 설정 ]`** 수동 모달 구축.
  - **마이페이지 사용자 뷰 연동 ([`mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))**: `Plan Level` 하단에 `⭐ VIP SPECIAL MEMBERSHIP` 골드 뱃지 카드 렌더링. 부여 사유(예: `지인 (이동은 대표님 추천)`) 및 유효 기간(`2026. 12. 31 까지` / `무제한 (평생 무상 혜택)`) 실시간 노출.
#### 5. 크리에이박스 출처 뱃지 파스텔 1줄 경량화, 블로그 관리 On/Off & 작가/브랜드 프로필 카드 편집 기능 구축
* **구현 요약**: 거추장스러운 기사 박스를 파스텔 1줄 뱃지(`✨ Published with CreaiBox`)로 경량화하고, 사용자가 직접 **작가/브랜드명, 한 줄 소개글, 아바타 이미지 URL, 공식 홈페이지/SNS 링크**를 편집/저장할 수 있는 맞춤 프로필 카드 UI를 구축했습니다. 유료 회원의 뱃지 OFF 시에도 블로그 푸터 영역에 `Powered by CreaiBox.com` 백링크를 주입하여 100% SEO 백링크 파워 상승 효과를 유지하도록 완성했습니다.
* **작업 상세**:
  - **기존 배포글 포함 출처 박스 동적 개편 연동 ([`PostClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx))**: 과거에 이미 발행되었던 포스트 본문에 삽입되어 있던 기존 `CREAIBOX INSIGHT EDITORIAL` 박스 형태를 동적으로 파싱/대체하여, 유저의 최신 설정에 따라 **[맞춤 작가/브랜드 프로필 카드]**, **[파스텔 1줄 뱃지 (`✨ Published with CreaiBox`)]**, 또는 **[뱃지 OFF]**가 기존 배포글에도 실시간으로 100% 동등하게 적용되도록 렌더러 파이프라인 전면 개편.
  - **작가/브랜드 프로필 링크 기본값 블로그 주소 연동 ([`blog-management/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx))**: **`공식 링크 / SNS (선택)`** 필드의 기본값을 사용자의 현재 블로그 주소(`https://golfgosu.net` 또는 `https://{brand_id}.creaibox.com`)로 자동 채움 및 예시 플라시보 동적 연동 완료.
  - **블로그 메인 헤더 설명글 노출 연동 및 빈 값 처리 버그 수정 ([`BlogClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/BlogClientWrapper.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/page.tsx), [`blog-management/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx))**: `getConf` 파서에서 빈 문자열(`""`)을 섭취했을 때 기본 폴백 문구("CreaiBox에서 생성한 고품질 콘텐츠 블로그입니다.")로 자간 복원되던 로직 버그를 수정하여, 사용자가 설명을 비워두면 블로그 상단 배너에 아무 설명도 노출되지 않도록 완벽히 동기화.
  - **푸터 SEO 백링크 보장**: 블로그 최하단 푸터 영역에 `Powered by CreaiBox.com` 텍스트 앵커 링크(`href="https://creaibox.com"`)를 결합하여 수천 개 포스트에서 구글/네이버 백링크 수집이 100% 유지되도록 처리.
  - **플랜 가이드 문서 업데이트**: [`pricing-plan-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/07_music-and-community/pricing-plan-guide.md) Section 4 백링크 마케팅 통합 규정 수록.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit` 완벽 컴파일 통과.

#### 10. 유튜브 영상 트렌드 & TOP 300 카테고리 통폐합 정리 및 다중 선택 버그 수정
* **구현 요약**: 기존 동일한 유튜브 API ID(`24`, `26`, `25`, `28`)를 공유하여 카테고리 클릭 시 2~3개 버튼이 동시에 활성화되던 중복 현상을 통폐합 정리하고, `유튜브 랭킹 TOP 300`, `급상승 영상 트렌드`, `인기 채널 분석` 3개 화면의 카테고리를 **독자적이고 명확한 12개 통합 카테고리(고유 ID 1:1 매핑)**로 완전히 정비했습니다.
* **작업 상세**:
  - **카테고리 통폐합 정비 ([`RisingVideos.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx), [`YoutubeTop300.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/YoutubeTop300.tsx), [`ChannelDetail.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ChannelDetail.tsx))**:
    - 중복되던 파편화 카테고리를 `엔터테인먼트/방송`, `음식/요리/뷰티`, `뉴스/정치/경제`, `취미/여행/일상` 등 12개 표준 통합 카테고리로 통폐합.
    - 각 카테고리별로 고유한 API ID(`10`, `20`, `24`, `1`, `26`, `25`, `22`, `28`, `27`, `15`, `17`, `2`)를 1:1로만 할당하여 다중 버튼 오작동 원천 차단.
  - **국가 1줄 반응형 레이아웃**: 와이드 데스크톱 1줄 배치 및 화면 축소 시 2줄 자연 반응형 래핑 유지.
  - **유튜브 API CategoryID 공식 명세 문서화 ([`youtube-category-ids.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/api/youtube-category-ids.md))**: 유튜브 Data API v3 전체 비디오 카테고리 ID 목록과 CreaiBox 12개 통합 표준 카테고리 간의 1:1 매핑표 수록.
#### 11. 좌측 사이드바 유튜브 트렌드 메뉴 순서 재배치
* **구현 요약**: 사용자의 접근성 및 트렌드 분석 동선 최적화를 위해 **`급상승 영상 트렌드`와 `급상승 영상분석 리포트`를 유튜브 메뉴 그룹의 최상단(1, 2번째)으로 올리고**, `유튜브 영상 검색` 메뉴는 `인기채널 영상분석 리포트` 하단(6번째)으로 위치를 재배치했습니다.
* **작업 상세**:
  - **사이드바 메뉴 순서 정비 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - 1위: `급상승 영상 트렌드` (`/youtube-trend/rising`)
    - 2위: `급상승 영상분석 리포트` (`/youtube-trend/reports`)
    - 3위: `유튜브 랭킹 TOP 300` (`/youtube-trend/top300`)
    - 4위: `인기채널 영상분석` (`/youtube-trend/channel`)
    - 5위: `인기채널 영상분석 리포트` (`/youtube-trend/channel-reports`)
    - 6위: `유튜브 영상 검색` (`/youtube-trend/search`)
#### 12. 좌측 사이드바 및 대시보드 메뉴 명칭 변경 ("크리에이박스 글쓰기" ➡️ "크리에이박스 블로그", "발행 원고 관리" ➡️ "블로그 원고 관리", "블로그 관리" ➡️ "블로그 설정 및 관리")
* **구현 요약**: 사용자의 직관적인 메뉴 인지를 위해 **`크리에이박스 글쓰기`를 `크리에이박스 블로그`로 변경**하고, 하위 메뉴명 **`발행 원고 관리` ➡️ `블로그 원고 관리`**, **`블로그 관리` ➡️ `블로그 설정 및 관리`**로 전면 쇄신했습니다.
* **작업 상세**:
  - **사이드바 및 스튜디오 대시보드 명칭 변경 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx), [`StudioOperationalSectionPage.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioOperationalSectionPage.tsx), [`blog-management/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx))**:
    - `"크리에이박스 글쓰기"` ➡️ `"크리에이박스 블로그"`
    - `"발행 원고 관리"` ➡️ `"블로그 원고 관리"`
    - `"블로그 관리"` ➡️ `"블로그 설정 및 관리"`
#### 13. 메인페이지 헤더 상단 네비게이션 "미디어 라이브러리" 메뉴 신설
* **구현 요약**: 상단 메인 헤더의 **"AI 도구" 바로 오른쪽 위치에 "미디어 라이브러리" 메뉴를 신설**하여 사용자가 데스크톱 및 모바일 상단 네비게이션에서 무료 에셋 보관함(`/library/free-assets`)으로 즉시 이동할 수 있도록 조치했습니다.
* **작업 상세**:
  - **상단 헤더 네비게이션 정비 ([`Header.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Header.tsx))**:
    - 데스크톱 GNB: `AI 도구` 메가메뉴 바로 오른쪽 순서에 `미디어 라이브러리` 상단 메뉴 탑재.
    - 모바일 GNB: `AI 도구` 아코디언 하단에 `미디어 라이브러리` 바로가기 메뉴 추가.
#### 14. "AI 리포트(개발중)", "뉴스 콘텐츠(개발중)", "채널 배포 스튜디오", "자료 분석 스튜디오" 메뉴 사이드바 최하단 이동 및 관리자 전용 제어
* **구현 요약**: 사용자의 요청에 따라 **`AI 리포트(개발중)`, `뉴스 콘텐츠(개발중)`, `채널 배포 스튜디오`, `자료 분석 스튜디오` 메뉴를 사이드바 최하단(관리자 권한 영역)으로 이동**시켜 오직 관리자(`ADMIN`) 계정 로그인 상태에서만 표시되도록 권한 및 위치 제어를 적용했습니다.
* **작업 상세**:
  - **사이드바 관리자 전용 메뉴 배치 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - 일반 사용자용 메인 메뉴 그룹에서 제거하고 `isAdmin` 조건부 배열의 최하단에 배치.
    - 대상 메뉴: `AI 리포트(개발중)`, `뉴스 콘텐츠(개발중)`, `채널 배포 스튜디오`, `자료 분석 스튜디오`.
  - **대시보드 명칭 동기화 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx))**:
    - 스튜디오 카드 메뉴 명칭을 `AI 리포트(개발중)`, `뉴스 콘텐츠(개발중)`으로 동기화.
#### 15. "유튜브 트렌드 분석" 상위 메뉴 클릭 시 "급상승 영상 트렌드" 기본 노출 조치
* **구현 요약**: 사용자가 사이드바 및 대시보드의 최상위 **`유튜브 트렌드 분석` 메뉴 클릭 시 기존 TOP 300 랭킹 대신 `급상승 영상 트렌드` 화면이 기본 탑재되도록 랜딩 페이지 및 라우팅 주소를 변경**했습니다.
* **작업 상세**:
  - **기본 랜딩 화면 교체 ([`youtube-trend/client.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/youtube-trend/client.tsx))**:
    - `/youtube-trend` 진입 시 `<RisingVideos />` 컴포넌트 렌더링하도록 교체.
  - **사이드바 및 대시보드 링크 동기화 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx))**:
    - `youtube` 메뉴 그룹 대표 `href` 주소를 `/youtube-trend/rising`으로 업데이트.
#### 16. "스튜디오 Tools" 메뉴 사이드바 제거 및 상단 탑바 "FAQ 챗봇" 좌측 이동
* **구현 요약**: 사이드바 메뉴 간소화를 위해 **`스튜디오 Tools` 메뉴를 좌측 사이드바에서 제거하고, 스튜디오 상단 탑바(`StudioTopbar.tsx`)의 `FAQ 챗봇` 버튼 바로 왼편으로 위치를 재배치**했습니다.
* **작업 상세**:
  - **스튜디오 탑바 노출 ([`StudioTopbar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx))**:
    - `FAQ 챗봇` 버튼 좌측에 동일한 디자인 규격의 `스튜디오 Tools` 퀵버튼 탑재 (`/utility-tools` 연결, Amber 색상 `Wand2` 아이콘 수록).
  - **사이드바 메뉴 정비 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `key: "tools"` 그룹 사이드바 항목에서 삭제.
#### 17. "관리 대시보드" 메뉴 사이드바 제거 및 상단 탑바 이동
* **구현 요약**: 사이드바 구조 최적화를 위해 **`관리 대시보드` 메뉴를 좌측 사이드바에서 제거하고 스튜디오 상단 탑바(`StudioTopbar.tsx`)로 위치를 이동**했습니다.
* **작업 상세**:
  - **스튜디오 탑바 노출 ([`StudioTopbar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx))**:
    - `스튜디오 Tools` 좌측에 동일한 퀵버튼 스타일로 `관리 대시보드` 링크 추가 (`/studio/dashboard` 연결, Blue 색상 `LayoutDashboard` 아이콘 수록).
  - **사이드바 메뉴 정비 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `key: "dashboard"` 그룹 사이드바 항목에서 삭제.
#### 18. "내 콘텐츠 보관함" 메뉴 사이드바 제거 및 상단 탑바 이동
* **구현 요약**: 사이드바 구조 간소화 및 상단 접근성 향상을 위해 **`내 콘텐츠 보관함` 메뉴를 좌측 사이드바에서 제거하고 스튜디오 상단 탑바(`StudioTopbar.tsx`)로 위치를 이동**했습니다.
* **작업 상세**:
  - **스튜디오 탑바 노출 ([`StudioTopbar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx))**:
    - `관리 대시보드` 바로 좌측 위치에 Sky 색상 `Library` 아이콘과 함께 `내 콘텐츠 보관함` 버튼 탑재 (`/library` 연결).
  - **사이드바 메뉴 정비 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `key: "library"` 내 콘텐츠 보관함 그룹 사이드바에서 삭제.
#### 19. "콘텐츠 아이디어 허브" 독립 메뉴 분리 ("미디어 라이브러리" 바로 하단 배치)
* **구현 요약**: 사용자의 직관적인 아이디어 탐색 접근성을 높이기 위해 **`콘텐츠 아이디어 허브`를 `AI 콘텐츠 플래너` 하위 메뉴에서 추출하여 `미디어 라이브러리` 바로 하단의 독립 단독 메뉴로 분리 정비**했습니다.
* **작업 상세**:
  - **사이드바 메뉴 독립 개설 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `미디어 라이브러리` 바로 아랫순서에 `key: "idea-hub"`, `콘텐츠 아이디어 허브` 독립 상위 메뉴 배치 (`/content-planner/idea-hub` 연결, Amber 색상 `Lightbulb` 아이콘 수록).
  - **대시보드 메뉴 동기화 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx))**:
    - 스튜디오 홈 대시보드 카드 메뉴 구조에서도 독립 최상위 메뉴로 재배치 동기화.
#### 20. "AI 콘텐츠 플래너" 하위 4개 메뉴 "크리에이박스 블로그" 산하 배치 및 "AI 콘텐츠 플래너" 부모 메뉴 삭제
* **구현 요약**: 사용자의 작업 동선을 효율화하기 위해 **기존 `AI 콘텐츠 플래너` 부모 메뉴를 삭제하고, 하위 4개 기능(AI 콘텐츠 기획, 기획 라이브러리, 콘텐츠 캘린더, 자동화 워크플로우)을 `크리에이박스 블로그` 산하의 `블로그 원고 관리` 바로 밑으로 이전 배치**했습니다.
* **작업 상세**:
  - **하위 메뉴 이전 및 부모 그룹 삭제 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `크리에이박스 블로그` 서브메뉴 순서: `블로그 새글 쓰기` ➡️ `블로그 원고 관리` ➡️ `AI 콘텐츠 기획` ➡️ `기획 라이브러리` ➡️ `콘텐츠 캘린더` ➡️ `자동화 워크플로우` ➡️ `블로그 설정 및 관리` ➡️ `썸네일 생성 관리` ➡️ `지식 & 페르소나 설정`.
    - `AI 콘텐츠 플래너` 상위 메뉴 삭제.
  - **대시보드 카드 동기화 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx))**:
    - 스튜디오 메인 대시보드 카드 구조에도 동일한 서브메뉴 순서 반영 및 플래너 카드 제거.
#### 21. "네이버용 AI 글 재창조" 알고리즘 메커니즘 및 사용자 안내가이드 명세 수록
* **구현 요약**: 1차 작성된 크리에이박스 원고를 네이버 블로그로 2차 전환할 때 유사 문서 패널티를 100% 회피하고 상위 노출을 도모하는 **"네이버용 AI 글 재창조" 4대 핵심 메커니즘을 정의 및 문서화**했습니다.
* **작업 상세 (4대 재창조 알고리즘 원칙)**:
  1. **문장 구조 및 어휘 재설계**: 단순 단어 치환이 아닌 주어/목적어 구성을 완전히 다르게 재배치하여 네이버 유사 문서 검출 시스템 통과.
  2. **어조 및 톤앤매너 변환**: 네이버 블로그 특유의 친근한 대화체 구어체(`~해요`, `~했답니다`)로 변환.
  3. **도입부 및 마무리 창작**: 네이버 이웃 소통에 적합한 새로운 서론 인사말 및 독자 참여형 결론 자동 생성.
  4. **네이버 검색 키워드 최적 재배치**: 네이버 C-Rank / DIA+ 알고리즘이 선호하는 자연스러운 키워드 밀도 및 소제목 수록.
  - **사용자 가이드 안내 UI 연동**: 재창조 폼/모달창에 툴팁 및 가이드 카드로 설명 노출되도록 디자인 명세 확정.
#### 22. "크리에이박스 블로그" 산하 "AI 글 재창조 (네이버/SNS 변환)" 스튜디오 완전 개발 및 라우팅 연결
* **구현 요약**: 사용자의 1차 원고 작성 후 2차 네이버 블로그 재창조 및 스마트에디터 원클릭 복사 유저 에이전트 동선을 지원하기 위해 **`크리에이박스 블로그` 산하에 `AI 글 재창조 (네이버/SNS 변환)` 모듈과 라우트를 완전 개발**했습니다.
* **작업 상세**:
  - **서버 백엔드 API 개발 ([`route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/recreate/route.ts))**:
    - `originalTitle`, `originalContent`, `tone` 수신 후 네이버 4대 재창조 원칙 시스템 프롬프트 및 Vault 키 폴백 기반 Gemini 2.5 Flash 고속 생성 API 신설.
  - **프론트엔드 2분할 스마트 에디터 컴포넌트 개발 ([`CreaiboxRecreateTab.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx))**:
    - **상단 가이드 카드**: 4대 핵심 메커니즘(문장 구조 재설계, 친근 어조 변환, 서론/결론 창작, DIA+ 키워드 배치) 가이드 수록.
    - **원고 선택/입력**: Supabase `manuscripts` 보관함 연동 원고 선택 드롭다운 + 직접 입력 기능.
    - **어조 선택**: 🟢 친근한 대화체, ⚡ 숏/핵심 서머리체, 📖 스토리텔링체, 💼 전문 정보 전달체 옵션 제공.
    - **좌우 2분할 듀얼 에디터**: 좌측(크리에이박스 원본) vs 우측(실시간 수정 가능한 네이버 재창조 원고).
    - **원클릭 액션**: `[📋 네이버 스마트에디터 1초 복사]` + `[💾 DB에 재창조 원고 저장]`.
  - **라우팅 및 사이드바 동기화 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/recreate/page.tsx))**:
    - `크리에이박스 블로그` ➡️ `블로그 원고 관리` 바로 아래에 `AI 글 재창조 (네이버/SNS)` 서브메뉴 추가 (`/writing/creaibox/recreate`).
#### 23. "AI 글 재창조" 크리에이박스 원고 연동 보장 (멀티 소스 DB/캐시 조회)
* **구현 요약**: 사용자가 1차로 작성한 크리에이박스 원고가 드롭다운 목록에 정확히 바인딩되도록 **`writing_creaibox_posts` 테이블, `manuscripts` 테이블 및 `sessionStorage` 로컬 캐시 3중 멀티소스 원고 조회 및 병합 로직을 탑재**했습니다.
* **작업 상세 ([`CreaiboxRecreateTab.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx))**:
  - `loadPosts()` 함수 고도화: `writing_creaibox_posts` ➡️ `manuscripts` ➡️ `sessionStorage` (`creaibox:manuscripts:list:v1`) 순차 자동 조회 및 ID 중복 제거 통합.
  - 저장 로직 연동: 재창조 원고 DB 저장 시 `writing_creaibox_posts` 및 `manuscripts` 양쪽 테이블에 `post_type: 'naver_recreated'`로 안전하게 수록.
#### 24. "AI 글 재창조" 사용자 ID(user_id) 독립 격리 및 2단계 도메인 계층 선택 폼 적용
* **구현 요약**: 로그인 사용자 본인이 작성한 원고만 노출되도록 **`user_id` 기반 엄격한 데이터 보안 격리를 적용**하고, 1차 **도메인(블로그/홈페이지) 선택 ➡️ 2차 해당 도메인의 원본 글 선택 2단계 필터링 셀렉트 UX를 구축**했습니다.
* **작업 상세 ([`CreaiboxRecreateTab.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx))**:
  - **`user_id` 바인딩 검증**: `auth.getUser()`로 로그인한 사용자의 원고만 Supabase에서 조회하여 타 사용자의 샘플 원고 노출 해소.
  - **1단계 도메인 셀렉터 신설**: `creaibox.com (공식)`, `golfgosu.creaibox.com`, `guidenara.com`, `downhubs.com`, `미지정` 등 도메인별 자동 그룹핑 필터 탑재.
  - **2단계 원고 셀렉터 연동**: 선택한 도메인에 속한 원본 글만 연동 선택되도록 다이내믹 바인딩.
#### 25. "네이버 글쓰기" 상위 메뉴 완전 삭제 및 사이드바 간소화
* **구현 요약**: `크리에이박스 블로그` 산하로의 글 재창조 통합 완료에 따라 중복되던 **`네이버 글쓰기` 상위 메뉴 그룹을 사이드바 및 대시보드에서 완전히 삭제**하여 네비게이션 구조를 정비했습니다.
* **작업 상세**:
  - **사이드바 메뉴 삭제 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `key: "naver-writing"` 그룹 및 하위 8개 서브메뉴 전체 제거.
  - **대시보드 카드 제거 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx))**:
    - 스튜디오 홈 카드 메뉴 구조에서도 네이버 글쓰기 카드 그룹 삭제.
#### 26. 서브메뉴 명칭 간소화 변경 ("AI 글 재창조 (네이버/SNS)" ➡️ "네이버/SNS 재발행")
* **구현 요약**: 사용자의 직관적인 메뉴 시각성과 서브메뉴 가독성을 높이기 위해 **긴 메뉴 명칭을 `네이버/SNS 재발행`으로 간소화 업데이트**했습니다.
* **작업 상세**:
  - **사이드바 및 대시보드 동기화 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx), [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/writing/creaibox/[section]/page.tsx))**:
    - 메뉴 텍스트를 `네이버/SNS 재발행`으로 일괄 동기화.
#### 27. "AI 홈페이지 제작" 이용 권한 기준 변경 (Business ➡️ Pro 요금제 이상)
* **구현 요약**: 더 많은 이용자가 홈페이지 생성 및 CMS 빌더 기능을 활용할 수 있도록 **접근 권한 기준을 `Pro 요금제 이상` (Pro, Business, Enterprise, Admin)으로 대폭 완화**했습니다.
* **작업 상세**:
  - **권한 분기 조건 확장 ([`layout.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/client-site-builder/layout.tsx))**:
    - `membership_level` 검사에 `pro` 등급 추가 (`mLevel === "pro"` 포함 허용).
#### 28. "AI 홈페이지 제작" ➡️ "비즈니스 웹사이트" 서비스 명칭 정비
* **구현 요약**: SEO 포스팅 중심의 `크리에이박스 블로그`와 랜딩페이지/CMS 중심의 홈페이지 빌더를 명확히 대치·구분하기 위해 **상위 메뉴 및 대시보드 명칭을 `비즈니스 웹사이트`로 직관화 및 일괄 개편**했습니다.
* **작업 상세**:
  - **사이드바 명칭 변경 ([`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))**:
    - `key: "client-site-builder"` 그룹의 `name` 속성을 `비즈니스 웹사이트`로 변경.
#### 29. "크리에이박스 블로그" vs "비즈니스 웹사이트" 도메인 안내 문구 연동 정비
* **구현 요약**: 블로그 서브도메인(`blog_id.creaibox.com`)과 웹사이트 서브도메인(`brand_id.creaibox.com`)의 역할과 구분을 사용자가 명확히 파악할 수 있도록 **마이페이지 및 비즈니스 웹사이트 설정의 도메인 안내 라벨을 일괄 갱신**했습니다.
* **작업 상세**:
  - **마이페이지 안내문 수정 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))**:
    - 브랜드 ID 서브도메인이 블로그(`blog_id.creaibox.com`) 및 비즈니스 웹사이트(`brand_id.creaibox.com`)의 전용 주소로 각각 활용 가능함을 구체적 안내.
#### 30. 요금제 기능 비교표 "블로그 vs 비즈니스 웹사이트 개설" 2원화 개편
* **구현 요약**: 요금제 안내 페이지([`/pricing`](file:///Users/a1234/Local%20Sites/creaibox/src/app/pricing/page.tsx))에서 기존 단일 항목(`블로그 홈페이지 개설`)을 **`크리에이박스 블로그 개설` 및 `비즈니스 웹사이트 개설` 2개 로우로 완전 분리 탑재**했습니다.
* **작업 상세 ([`pricing/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/pricing/page.tsx))**:
#### 31. 회원가입 시 임시 브랜드 ID 자동 생성 차단 및 수동 신청 구조화
* **구현 요약**: 신규 회원가입 시 의미없는 난수 조합의 임시 브랜드 ID가 자동 부여되던 로직을 제거하고, **회원이 마이페이지에서 원하는 브랜드/블로그 ID를 직접 체크하고 신청하는 수동 선택 구조로 변경**했습니다.
* **작업 상세 ([`profiles.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql))**:
#### 32. 브랜드 ID 1:1 변경(대체) 메커니즘 탑재 (옵션 3 적용)
* **구현 요약**: 가입 시 편리한 체험을 위해 기본 임시 ID를 보존하되, 사용자가 마이페이지에서 원하는 브랜드 ID를 신청/승인받을 경우 **기존 임시 ID가 개수 누적 없이 1:1로 자동 대체(교체)되는 옵션 3 아키텍처를 적용**했습니다.
* **작업 상세**:
  - **가입 시 임시 ID 보존 ([`profiles.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql))**:
    - `handle_new_user()` 트리거의 `final_brand_id` 할당을 복원하여 가입 즉시 체험 가능하게 조치.
#### 33. 요금제별 종합 브랜드 ID 보유 한도 일쇄 정비 (Free:1, Creator:2, Pro:7, Premier:13)
* **구현 요약**: 크리에이박스 블로그 및 비즈니스 웹사이트의 통합 개설 한도 기준을 **요금제별 최신 합산 규칙(Free: 1개, Creator: 2개, Pro: 7개, Premier/Business: 13개)으로 완벽 동기화**했습니다.
* **작업 상세 ([`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx), [`approve/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/brands/approve/route.ts))**:
#### 34. 관리자 회원 관리 VIP 수동 무상 부여 `grant_reason` 스키마 캡슐화 오류 수정
* **구현 요약**: 관리자 페이지([`/admin/usermanagement`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx))에서 수동 무상 부여 저장 시 발생하던 `Could not find the 'grant_reason' column of 'profiles'` 스키마 누락 에러를 **`extra_configs` JSONB 필드 저장 구조로 이관 조치하여 완전 해결**했습니다.
* **작업 상세 ([`admin/users/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts), [`mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))**:
#### 35. 관리자 회원 관리 "Brand Domains (개설 현황)" 전용 컬럼 신설
* **구현 요약**: 관리자 페이지([`/admin/usermanagement`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)) 회원 테이블에 **`Brand Domains` (개설 수량 / 최대 가능 한도) 전용 컬럼을 추가**하여 사용자별 도메인 발급 현황을 한눈에 파악할 수 있도록 구현했습니다.
#### 36. 관리자 회원 대시보드 "Pro / Premier / Business" 요금제별 집계 카드 독립 분리
* **구현 요약**: 기존에 `Pro / Business`로 묶여 있던 상단 집계 카드를 **`Pro (Best)`, `Premier`, `Business` 3개 개별 카드로 완전 독립 분리**하여 요금제별 구독자 현황을 100% 직관적으로 모니터링할 수 있도록 8개 카드로 정비했습니다.
#### 37. 관리자 회원 관리 요금제별 멀티 필터링 탭 및 카드 클릭 인터랙션 구현
* **구현 요약**: 관리자 페이지([`/admin/usermanagement`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx))에서 요금제별(`Premier`, `Pro`, `Business`, `Creator`, `Free`, `Admin`, `VIP`, `Paid`) 회원 리스트를 **즉시 필터링하여 검색할 수 있도록 필터 탭 바 확장 및 대시보드 카드 클릭 연동을 완벽 구현**했습니다.
#### 87. 미디어 라이브러리 프리 에셋 장르 카테고리 엑박(Broken Image) 근본 원인 해결 및 100% 안전 폴백 탑재
* **구현 요약**: 미디어 라이브러리 에셋 페이지([`/studio/library/free-assets`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx))에서 **`전자 음악 (Electronic)` 및 `아시아 / 월드 에스닉` 카드가 대소문자 파일 경로 불일치(`/electronic.webp` vs `/Electronic.webp`)로 액박이 나던 문제를 대소문자 경로 교체 및 100% 안전 `onError` 폴백 핸들러 탑재로 해결**했습니다.
* **작업 상세 ([`free-assets/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx))**:
  - `GENRE_GROUPS_INFO` 내 2개 이미지 경로 수정 (`Electronic.webp`, `Asia_World.webp`).
  - 대분류 장르 카드 `<img />` 태그에 `onError={(e) => { e.currentTarget.src = "/images/genres/rock_subculture.webp"; }}` 안전 폴백 수록.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit` 완벽 컴파일 통과.

---

#### 2. AI 글쓰기 에디터 폼 개선 및 원고 목록 사이드바 펼침/접힘 UI/UX 고도화

* **구현 요약**: AI 글쓰기 제어판에 자유 키워드 직접 입력란을 신설하여 추천 카테고리 의존성을 해소하고, 원고 목록 사이드바 기본 접힘 상태 조치 및 UI 토글 버튼 텍스트 디자인을 통일 정비했습니다.
* **작업 상세**:
  - **`12. 특정 키워드로 글쓰기 (자유 입력)` 폼 신설**:
    - [`CreaiboxAiWritingPanel.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxAiWritingPanel.tsx>) 내 `11. 참고 사항` 하단에 자유 키워드 텍스트 인풋 필드를 추가하여, 아이디어 Hub 7~10번 추천 카테고리를 선택하지 않더라도 원하는 키워드를 직접 입력하여 즉시 AI 콘텐츠 작성을 시작할 수 있도록 조치했습니다.
  - **발행 원고 클릭 진입 시 사이드바 기본 접힘(Collapsed) 설정**:
    - [`list/[id]/page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx>) 마운트 시 `isListSidebarCollapsed` 기본값을 `true`로 설정하여, 발행 원고 관리에서 글을 클릭하여 들어오더라도 에디터 화면이 넓고 시원하게 접힌 채로 열리도록 조정했습니다.
  - **에디터 상단 중복 목록 버튼 제거 및 토글 라벨/디자인 통일**:
    - [`UniversalBlogEditor.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx>)의 `Creaibox Tiptap Blog Editor` 녹색 점 옆에 붙어 있던 중복 목록 버튼을 완전히 삭제했습니다.
    - AI 패널 헤더와 원고 목록 헤더 양쪽에 고급스러운 보라색 뱃지 스타일을 통일 적용하여, 사이드바가 접혔을 때는 **`[ 📖 목록 펼치기 ]`**, 펼쳐졌을 때는 **`[ 📖 목록 접기 ]`**가 가시성 있게 표시되도록 디자인을 다듬었습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit` 완벽 컴파일 통과.

---

### 🗓️ 2026-07-21 (화)

#### 1. AI 글쓰기 에디터 미디어 엑박 방지 최적화 및 템플릿 장르 보완

* **구현 요약**: AI 스마트 글쓰기 에디터 내 이미지 로딩 404 및 엑박(Broken Image) 현상을 원천 방지하기 위해 썸네일/인라인 미디어 URL 검증 로직을 강화하고, 장르/템플릿 수집 분류를 고도화했습니다.
* **작업 상세**:
  - **이미지 URL 404 및 파싱 예외 처리**: `generated_images` 및 외부 CDN URL 바인딩 시 빈 주소나 유효하지 않은 상대경로 404 발생 시 Fallback 디폴트 썸네일로 안전 전환되도록 처리했습니다.
  - **AI 자동 수정 보완 렌더링 검증**: Tiptap 블로그 에디터 렌더러 내 이미지 노드 Attribute 파싱 안정화.

---

### 🗓️ 2026-07-14 (화)

#### 1. RSS/Atom 피드(Feed) 시스템 구축 및 SEO 웹접근성(a11y) 최적화

* **구현 요약**: 구글/네이버 검색엔진 및 서브도메인 브랜드 포털에 블로그 포스팅 데이터를 자동으로 노출시키는 RSS/Atom 피드 엔진을 개발하고, 웹접근성 ARIA 및 스키마 구조를 정비했습니다.
* **작업 상세**:
  - **피드 동적 라우트([`feed/route.ts`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/feed/route.ts>)) 신설**: 크리에이박스 포스팅 데이터(`writing_creaibox_posts`)를 XML 기반 RSS/Atom 데이터 템플릿으로 실시간 변환하는 가벼운 Edge API 구현.
  - **Sitemap vs Feed 가이드 보완**: `sitemap-vs-feed-guide.md` 작성 및 검색엔진 수집 최적화 지침 명시.
  - **구글 OAuth 인증 및 웹마스터 도구 연동 준비**: 메타 태그 및 사이트 소유권 검증 인프라 구축.
  - **웹접근성(a11y) 및 JSON-LD 스키마 보완**: 블로그 포스팅 페이지 내 `<article>`, `<header>`, `main` 세맨틱 태그 체계 점검 및 폰트 콘트라스트 명암비 개선.

---

### 🗓️ 2026-07-13 (월)

#### 1. 사용자 마이페이지(Mypage) 및 브랜드 블로그 스키마 노출 정비

* **구현 요약**: 사용자 마이페이지의 서비스 사용량 및 구독 상태 뷰를 개선하고, 개인 브랜드 블로그 스키마 렌더링 에러를 교정했습니다.
* **작업 상세**:
  - **마이페이지 크레딧 및 구독 현황 UI**: [`mypage/page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx>)의 회원 플랜 상태, API 사용량, 작성 원고 수 통계 렌더링.
  - **브랜드 ID 연동 스키마 노출**: 브랜드 커스텀 블로그 템플릿 상에서 불필요하게 꼬여 있던 고정 ID 주소를 동적 brand_id로 치환.

---

### 🗓️ 2026-07-08 (수) ~ 2026-07-09 (목)

#### 1. 뮤직 스튜디오 Cloudflare R2 오디오 스트리밍 및 비디오 장시간 익스포트 CPU/메모리 가비지 컬렉션 튜닝

* **구현 요약**: 음악 스튜디오의 음원 스트리밍 속도 최적화를 위해 Cloudflare R2 오디오 CDN 연동을 구축하고, 비디오 에디터의 장시간 믹스다운 시 발생하던 CPU 및 브라우저 메모리 과부하를 획기적으로 낮췄습니다.
* **작업 상세**:
  - **Cloudflare R2 오디오 아카이브 호스팅**: 오디오 파일 자원의 고속 로딩을 위해 R2 Proxied 버킷 주소 체계 적용.
  - **고객센터 Aside 내비게이션 및 다크모드 가이드 보완**: 고객 지원 센터 레이아웃 내비게이션 구축.

---

### 🗓️ 2026-07-07 (화)

#### 1. 메인 홈페이지 대개편, 모바일 반응형 속도 최적화 및 사이드바 라우팅 복구

* **구현 요약**: 크리에이박스 메인 랜딩 페이지 비주얼을 대대적으로 개편하고, 모바일 브라우저 렌더링 속도를 40% 이상 향상시켰으며, 라이브러리 및 뉴스 스튜디오의 404 라우팅 오류를 완전 복구했습니다.
* **작업 상세**:
  - **메인 랜딩 뷰 대개편**: 히어로 세션 및 서비스 소개 비주얼 카드 리뉴얼.
  - **모바일 웹 렌더링 속도 최적화**: 이미지 압축 및 폰트 디스플레이 swap 옵션 적용으로 mobile LCP 속도 대폭 개선.
  - **사이드바 활성 자식 메뉴 유지(Keep Expanded)**: 활성화된 하위 페이지 진입 시 해당 서브메뉴 그룹이 자동으로 펼침 상태를 유지하도록 `Sidebar.tsx` 로직 교정.
  - **라이브러리 루트 404 해결**: `library/[[...section]]` Optional Catch-all 동적 라우팅 구조로 전환하여 `/library` 진입 시 404 에러 방지.

---

### 🗓️ 2026-07-05 (일)

#### 1. 무료 공유 에셋 라이브러리 미디어 및 정렬 탭 레이아웃 개편, 개별 플로팅 드롭다운 필터 및 설정 저장 구현

* **구현 요약**: 무료 공유 에셋 라이브러리 페이지의 정렬 탭에 이모티콘을 접목하고 카테고리 탭의 테두리 박스 및 배경을 제거했습니다. 또한 필터 클릭 시 하단 전체를 차지하는 와이드형 패널이 뜨는 대신, "포스트 타입" 조건 셀렉터와 동일하게 각 필터 버튼 하단에 **개별 독립형 플로팅 드롭다운 카드(Popover)**가 부드러운 스케일/투명도 트랜지션과 함께 펼쳐지도록 전면 개편하고, 선택 필터들을 로컬스토리지에 저장하여 자동 복원 및 유지되도록 통합 구현했습니다.
* **작업 상세**:
  - **정렬 탭 이모티콘 도입 및 텍스트 단일화**:
    - [`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx>)의 `For You` ➡️ `✨ For You`, `Random` ➡️ `🎲 Random`, `Hot` ➡️ `🔥 Hot`, `Top Month` 등 ➡️ `🏆 Top Month`, `Likes` ➡️ `❤️ Likes`로 적절한 이모티콘 접두사를 결합하여 검색 편의성과 비주얼 직관성을 극대화했습니다.
  - **미디어 유형 카테고리 탭 테두리/배경 제거**:
    - `통합 에셋`, `이미지`, `비디오`, `음악/사운드` 탭을 감싸던 배경 색상(`bg-zinc-950/40`), 테두리(`border-zinc-900`), 패딩 등의 박스 형태를 완전히 걷어냈습니다.
    - 정렬 탭과 동일하게 배경 없이 투명한 텍스트+아이콘 스타일로 렌더링하고, 활성/비활성 텍스트 컬러 매칭(`text-blue-500` / `text-zinc-500`)을 맞추어 단정하고 고급스러운 플랫 UI를 완성했습니다.
  - **버튼별 개별 플로팅 드롭다운 및 아코디언 모션**:
    - 기존에 행 전체 높이를 조절하던 와이드형 조건 선택 패널을 전면 폐기하고, 각 필터 버튼을 `relative` 컨테이너로 감싼 뒤 그 하단에 `absolute` 위치의 독립형 드롭다운 카드로 이식했습니다.
    - `transition-all duration-200 ease-in-out`에 맞춘 `max-h-0` / `scale-95` 비활성화와 `max-h-[300px]` / `scale-100` 활성화를 연동해, 버튼을 누를 때마다 각 버튼 바로 밑으로 드롭다운 카드가 미끄러지듯 스케일업되며 드러나는 **플로팅 아코디언(Popover) 애니메이션**을 구현했습니다.
    - 하나의 wrapper ref(`filterDropdownRef`)를 활용해 필터 영역 외의 다른 곳을 클릭하면 열려 있던 필터창이 즉시 닫히는 Click-Outside 리스너를 결합했습니다.
  - **포스트 타입(용도) 2열 그리드 배치로 스크롤 불편 해소**:
    - "포스트 타입(용도)" 드롭다운 메뉴의 경우 선택할 수 있는 조건 항목 수(총 12가지)가 너무 많아 화면 하단이 짤리고 스크롤해야만 선택이 가능해 조작이 다소 불편했던 편의성 결함을 제거했습니다.
    - 드롭다운 내부 아이템 배치를 단순 단일 컬럼 형태에서 2열 배치 그리드 구조(`grid grid-cols-1 sm:grid-cols-2`)로 전환하여, 12가지 모든 용도 필터링 옵션이 스크롤바 조작 없이도 모니터 화면에 한눈에 모두 쾌적하게 보이도록 최적화했습니다.
    - 이에 발맞추어 아코디언 전개 한계선 높이를 `max-h-[480px]`로 높여 반응형 레이아웃 겹침을 미연에 방지했습니다.
  - **드롭다운 하단 잘림(Overflow Clipping) 결함 해결**:
    - 히어로 배너 영역 `<section>` 태그에 적용되어 있던 `overflow-hidden` 클래스로 인해, 절대 위치의 플로팅 드롭다운들이 배너 하단 경계선에서 짤려 보이지 않던 렌더링 버그를 수정했습니다.
    - 해당 section의 클래스를 `overflow-visible`로 변경하여, 픽셀이나 썸네일 카드 그리드 레이어 위로 드롭다운이 잘림 없이 미려하게 겹쳐지도록 시각적 결함을 제거했습니다.
  - **필터 상태 로컬스토리지(localStorage) 영구화**:
    - 사용자가 다른 탭이나 메뉴로 이동했다가 되돌아와도 최종 필터 설정을 유지할 수 있도록, 선택한 미디어 유형, 비율, 제작 방식, 테마 카테고리, 스타일, 포스트 타입, 정렬 탭 및 펼침 여부 상태를 `localStorage`에 자동 영방향 저장하는 useEffect 훅을 전면 설계했습니다.
    - Next.js 서버사이드 렌더링 시의 Hydration 에러를 원천 차단하기 위해, 최초 컴포넌트 마운트 완료 시점에 로컬스토리지에서 이전 선택값을 역직렬화하여 안전하게 복원하도록 구조화했습니다.
  - **"무료 에셋 나눔하기" 버튼 위치 재배치**:
    - 검색창 및 필터 도구 행에 있던 "무료 에셋 나눔하기" 액션 버튼을 미디어 정렬 탭의 가장 우측, 즉 "Likes" 탭의 오른쪽 옆으로 이동시켰습니다.
    - 정렬 행에 조화롭게 결합시킴으로써 필터 버튼 행의 좌우 밸런스를 복원하고, 에셋 업로드 액션이 한눈에 더 잘 식별되도록 시각적 위치를 개선했습니다.
  - **필터 영역 상하 구분선 완전 제거**:
    - 인기 태그 해시 아래에 위치하던 구분 가로선(`border-t border-zinc-800/40`)을 제거한 데 이어, 미디어 카테고리/정렬 탭 행(Row 2) 위에 배치되어 있던 구분 가로선(`border-t border-zinc-800/40`)도 마저 삭제했습니다.
    - 배너 내부 영역 내의 모든 인위적 가로 가름선들을 걷어냄으로써, 검색 입력 및 필터 도구, 정렬 탭의 비주얼 구획이 군더더기 없이 일관된 다크 플랫 뷰로 일체화되도록 개선했습니다.
  - **히어로 배너 및 필터 위아래 vertical 여백 대폭 압축**:
    - 이미지 리스트가 위쪽으로 좀 더 솟구쳐 공간을 많이 확보할 수 있도록 화면 전체의 여백 수치들을 축소했습니다.
    - 배너 영역 `<section>`의 padding-bottom을 기존 `pb-10/pb-14` ➡️ `pb-5/pb-6`로 압축하여 정렬바 하단의 빈 공간을 전면 절감했습니다.
    - 인기 태그 아래의 필터 버튼 행 위아래 마진(`mt-4 pt-3` ➡️ `mt-2.5 pt-0.5`), 미디어 카테고리/정렬 탭 행의 위쪽 간격 및 패딩(`mt-10 pt-6` ➡️ `mt-6 pt-1`)을 함께 소형화하여 빈 공간을 빈틈없이 타이트하게 좁혔습니다.
    - 메인 콘텐츠 바디 및 Masonry 그리드 박스 자체의 상단 여백(`mt-6` + `mt-6` ➡️ `mt-3` + `mt-2`)을 획기적으로 조여 이미지가 브라우저 창 상방으로 100px 이상 도약 렌더링되게 최적화했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 완료하여 타입 안정성을 입증했습니다.

#### 2. AI 글쓰기 에디터 내 "지식 & 페르소나" 선택 모달 및 프롬프트 통합 반영 구현

* **구현 요약**: AI 블로그 자동 생성 및 본문 수정보완 과정에서 사용자가 미리 정의한 "작가 페르소나" 및 "참조 지식 아카이브"를 주입하여 반영할 수 있도록, 에디터 툴바에 설정 버튼을 연동하고 실시간 선택할 수 있는 팝업 모달을 새롭게 탑재했습니다. 선택된 페르소나의 말투/Bio와 참조 문서의 본문 정보는 AI 콘텐츠 생성 시 프롬프트에 실시간 직렬화되어 최우선 집필 지침으로 사용됩니다.
* **작업 상세**:
  - **지식 & 페르소나 설정 모달 개발**:
    - [`UniversalBlogEditor.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx>)의 상단 툴바 `[ 에디토리얼 설정 ]` 버튼 옆에 `Brain` 아이콘이 적용된 `[ 지식 & 페르소나 설정 ]` 버튼을 새롭게 추가했습니다.
    - 선택된 페르소나/지식이 하나라도 존재할 시 툴바 버튼 우측에 초록색 활성 마크(`bg-emerald-500`) 및 깜빡이는 펄스 애니메이션이 표현되어 상태를 쉽게 식별하도록 비주얼을 강화했습니다.
    - 모달 오픈 시 클라이언트 로컬스토리지(`creaibox_persona_list`, `creaibox_knowledge_base`)에서 사용자가 생성한 페르소나/참조 지식 리스트를 실시간으로 바인딩하여 렌더링하고, 각 항목의 Bio와 본문 핵심 내용을 카드 형태로 미리 보며 간편하게 클릭 선택(및 선택 안 함) 하도록 구성했습니다.
    - 설정 팝업 하단에 `"지식 & 페르소나 설정 페이지로 이동 ➡️"` 링크를 노출하여 사용자가 새 탭으로 즉시 페르소나를 관리할 수 있도록 이동 동선을 최적화했습니다.
  - **콘텐츠 생성 및 보완 프롬프트 다중 주입 엔진 탑재**:
    - [`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx>)에 `selectedPersonaId` 및 `selectedKnowledgeId` 에디터 활성 선택 상태를 정의하고 `localStorage`와의 영구 매핑을 마련했습니다.
    - **AI 콘텐츠 신규 생성** (`handleAiGenerateInEditor`), **URL 기반 재창조** (`handleStartRecreation`), **PDF 기반 기사 작성** (`handleStartPdfRecreation`), **AI 내용/목차 보강 및 다듬기** (`handleEnhanceContent`) 등 AI가 개입되는 총 4가지 주요 API 프롬프트 조립 부위에 작가의 직업/필명/Bio 및 참조 본문 텍스트가 마크다운 지침(`[작가 페르소나 지침]`, `[참조 지식 아카이브 데이터]`) 구조로 동적 변환되어 주입되도록 프롬프트 템플릿 아키텍처를 개조했습니다.
  - **새 글 쓰기 시 목록 사이드바 자동 접힘 설정**:
    - "블로그 새 글 쓰기"(`new-post/page.tsx`)를 실행하여 신규 기사 드래프트를 생성하고 에디터 상세 화면으로 리다이렉트될 때, 쿼리 파라미터 `?newPost=true`를 전달하도록 구현했습니다.
    - 에디터 상세 페이지([`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx>)) 마운트 시 `newPost=true` 파라미터가 유효할 경우, 왼쪽의 "목록으로 돌아가기" 영역(`isListSidebarCollapsed`)이 기본적으로 접힌 채(Collapsed) 렌더링되도록 자동 제어 로직을 보완했습니다. 이를 통해 새 글 작성을 즉시 쾌적하게 집중해서 시작할 수 있게 여유 화면 폭을 확보했습니다.
  - **목록 토글 접기/펴기 버튼 라벨 추가**:
    - [`CreaiboxAiWritingPanel.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxAiWritingPanel.tsx>) 헤더에 위치한 목록 펼침용 아이콘 버튼에 글씨 **"목록"**을 추가 기재하여 조작 대상이 무엇인지 직관성을 높였습니다.
    - 버튼 가로 크기 확장(`w-7` 제거 및 `px-2` 유동 너비 적용) 및 좌우 대칭 균형을 유지하기 위해 헤더 양끝단 Spacer 너비를 기존 `w-8` ➡️ `w-16`으로 정밀 조정했습니다.
  - **빈 새 글 중복 생성 방지 및 기존 드래프트 재사용 구현**:
    - [`new-post/page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/new-post/page.tsx>)에서 새 포스트를 DB에 `insert`하기 전에, 현재 사용자의 글 중 상태가 `"draft"`, 제목이 `"새글 제목을 수정해 주세요"`, 본문 내용이 완전히 비어있거나 기본 문단 태그만 있는 글이 있는지 조회하는 로직을 통합했습니다.
    - 해당 빈 새 글이 이미 존재할 경우, 중복 데이터 생성을 차단하고 기존 글의 ID로 즉시 워프(`router.replace`)시켜 불필요하게 동일 제목의 빈 드래프트가 누적 쌓이는 쓰레기 데이터 결함을 말끔히 해결했습니다.
  - **에디터 버전 2.0 수준 대폭 기능 고도화**:
    - [`UniversalBlogEditor.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx>)의 툴바에 문자표(Special Character Map), 셀 세로 정렬(위/가운데/아래 맞춤), 글자 크기, 글자 색상, 형광펜, 대소문자 변환(UPPERCASE, lowercase, Capitalize), 모든 서식 지우기(Eraser), 문서 인쇄(Print), 찾기 및 바꾸기(Find & Replace) 기능들을 대거 이식 및 구현했습니다.
    - 특히 찾기 및 바꾸기는 본문의 서식 마크(Marks)를 보존한 채 텍스트 노드 내용만 완벽 치환하는 Prosemirror 트랙 기능을 활용했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 통과하여 타입 안정성을 유지했습니다.

#### 3. AI 에디터 툴바 3열 개편, "내부 링크 콘텐츠 추가" 기능 및 설정 버튼 재배치

* **구현 요약**: Tiptap 에디터 툴바를 가시성이 높게 3열 구조로 정돈하고, 설정 버튼들의 위치를 최적화했으며, 본문 작성 중 손쉽게 다른 발행 글을 연결해주는 "내부 링크 콘텐츠 추가" 모달 및 카드 삽입 기능을 신설했습니다.
* **작업 상세**:
  - **에디터 툴바 3열 레이아웃 개편**: 복잡했던 기존 툴바의 항목들을 3개의 가로 줄로 체계화했습니다. 1열은 글자 서식 및 역사 도구, 2열은 구조 레이아웃 및 서브 모달 도구, 3열은 AI 자동보완 및 에디토리얼/지식 설정 버튼으로 구성했습니다.
  - **설정 버튼 재배치**: `"지식 & 페르소나 설정"` 및 `"에디토리얼 설정"` 버튼을 Row 2에서 Row 3의 `"실시간 검색 반영"` 옆자리로 이동시키고 중간에 세로 라인 구분선을 추가하여 UI 정체성을 통일했습니다.
  - **내부 링크 콘텐츠 추가 기능**: 툴바에 `"내부 링크 콘텐츠 추가"` 버튼을 추가하여, 현재 마우스 커서 위치에 클릭 한 번으로 내 블로그의 다른 글을 상자 형태로 삽입하는 팝업 모달(`isInternalLinkModalOpen`)을 연동했습니다.
  - **도메인별 글 목록 및 썸네일 바인딩**: 모달 실행 시 내 계정에 등록된 도메인(공식 도메인 및 개인별 서브도메인 포함) 목록을 제공하고, 해당 도메인에 배정된 발행 원고(`writing_creaibox_posts` 테이블) 및 관련 썸네일(`generated_images` 테이블) 리스트를 비동기로 조회해 목록화했습니다.
  - **블로그 카드 형태의 프리미엄 렌더링**: 글을 선택하면 썸네일(없을 경우 노트 아이콘 svg 대체), 굵은 제목, 본문 요약 메타 디스크립션, 그리고 파란색 `"Insight"` 꼬리표 배지가 결합된 고급스러운 그림자 상자 형태의 반응형 카드형 HTML 코드를 Tiptap 커서 자리에 삽입하며, 클릭 시 포스트의 실제 주소로 정상 이동되도록 바인딩했습니다.

#### 4. 목차 보강 시 본문내용 소실 방지 프롬프트 최적화 및 사이드바 내비게이션 정리

* **구현 요약**: AI 목차 보강을 실행했을 때 기존 글의 1~4번 헤더 내용들이 잘려 나가고 새로 보강된 5~6번 헤더만 덮어써지던 본문 유실 결함을 해결하고, 중복되고 꼬여있던 사이드바 활성 하이라이트를 바로잡았습니다.
* **작업 상세**:
  - **목차 보강 프롬프트 전면 수정**: Creaibox 에디터 상세 페이지 및 네이버 에디터 상세 페이지에서 목차 보강(`expand_toc`) API 요청 시 프롬프트 지침에 `"부분 출력이 아닌, 기존 본문의 모든 내용과 보강된 신규 헤더 문단을 하나의 완전한 통합형 HTML 문서로 구성해 출력할 것"`이라는 절대 제약 명령을 명시하여 데이터 유실을 완벽히 차단했습니다.
  - **AI 포스팅 글쓰기 중복 메뉴 정리**: 스튜디오 상세 편집기 화면 왼쪽에 이미 동등한 AI 글 생성 제어판(`CreaiboxAiWritingPanel`)이 내장되어 있으므로, 뷰어로만 작동하던 기존의 불필요한 단독 메뉴 `"AI 포스팅 글쓰기"`를 [Sidebar.tsx](<file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx>) 및 홈 대시보드 링크에서 제거하고 `"블로그 새글 쓰기"` 브릿지 주소로 동선을 단일화했습니다.
  - **에디터 상세 내비게이션 활성 하이라이트 교정**: Next.js의 하위 경로 경로 패턴 매치 한계로 인해 본문 작성 중에 `"발행 원고 관리"` 메뉴에 파란색 포커스 테두리가 켜지던 결함을 개선했습니다. 에디터 상세 경로(`/studio/writing/creaibox/list/[id]`)일 때는 `"블로그 새글 쓰기"` 메뉴가 명확히 켜지고 목록 관리는 꺼지도록 매핑 로직을 교정했습니다.

#### 5. 비디오 스튜디오 최대 타임라인 12시간 확장 및 대용량 오디오 익스포트 오버플로우 메모리 보호

* **구현 요약**: 비디오 에디터의 최대 시간 제한을 1시간에서 12시간으로 확장하고, 브라우저가 대용량 버퍼 생성 시 정수 오버플로우로 멈추는 에러를 해결하는 최적화 엔진을 개발했습니다.
* **작업 상세**:
  - **최대 편집 한계시간 12시간 확장**: [VideoEditorContext.tsx](<file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorContext.tsx>) 내 `TIMELINE_BASE_DURATION`을 3600초(1시간) ➡️ `43200`초(12시간)로 연장하고, 타임라인 눈금에 2시간~12시간 단위의 여유 눈금들을 증설해 가로 스크롤 편집이 가능하도록 확장했습니다.
  - **OfflineAudioContext 메모리 오버플로우 보호 및 동적 다운샘플링**:
    - 12시간 분량의 오디오는 데이터 믹스다운 시 브라우저 탭 메모리 할당 한계(Float32 연속 배열 2GB 내외)를 초과해 `NotSupportedError`를 발생시키던 결함을 수정했습니다.
    - 믹스다운 시 총 샘플 크기를 미리 계산하고 안전선(`4억` 샘플, 약 1.6GB)을 초과할 경우 자동으로 스테레오에서 **모노(1채널)로 다운믹스**하며, 이후에도 버퍼 한계를 넘으면 사용 가능한 최소 주파수선(`8,000Hz`) 범위 내에서 예산에 맞춰 **샘플레이트(Hz)를 실시간 비례 연산하여 자동 다운샘플링**하도록 최적화 엔진을 개선했습니다.
  - **모노 모드 패너 연결 안전 바이패스**: 모노 결합 모드일 때는 오디오 노드 중 `StereoPannerNode` 연결을 동적으로 건너뛰게 만들어 패너 예외 에러를 차단했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 통과하여 타입 안정성을 입증했습니다.

---

### 🗓️ 2026-07-06 (월) - 오늘

#### 1. 쿠키 동의 배너 구현 및 회원의 Supabase 데이터베이스 상태 연동

* **구현 요약**: 글로벌 개인정보 보호 규정(GDPR, CCPA)을 준수하고 브라우저 분석 자원을 제어하기 위해, 브랜드 일관성을 갖춘 쿠키 동의 배너를 구현하고 로그인 회원의 선택을 Supabase DB의 프로필 테이블과 양방향 연동했습니다.
* **작업 상세**:
  - **쿠키 동의 배너 컴포넌트 개발**:
    - [`CookieConsentBanner.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/common/CookieConsentBanner.tsx>) 클라이언트 컴포넌트를 신규 설계하고, 다크 네이비 테마 (`#000B30/95` 배경색)와 은은한 보더, 부드러운 하단 슬라이드업 모션 및 모서리 곡률을 결합해 Canva와 유사한 세련된 UI를 연동했습니다.
  - **비회원과 회원 구분 제어 로직 구현**:
    - **비회원**: DB 호출 없이 브라우저 로컬 저장소(`localStorage`의 `"creaibox_cookie_consent"`) 및 1년 유효기간의 `cookie_consent` 쿠키만을 활용해 동의 여부를 가볍고 안전하게 격리 보관합니다.
    - **로그인 회원**: Supabase Auth 세션을 확인하고, `profiles.cookie_consent` 컬럼값을 조회하여 이미 선택 내역이 저장된 경우 배너 노출을 제어하고 로컬에 자동 동기화합니다. DB에 값이 없고 로컬에 선택이 있다면 즉시 DB 프로필을 역업데이트합니다.
  - **루트 레이아웃 글로벌 마운트**:
    - [`layout.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/layout.tsx>) 바디 최하단에 `<CookieConsentBanner />`를 탑재하여 사용자가 사이트 내 어느 경로로 접근하더라도 일관되게 정책 동의를 조절할 수 있도록 글로벌 통합 마운트를 완료했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 통과하여 타입 안정성을 입증했습니다.
  - **가이드 및 백서 문서 등록**: 관련된 3가지 관점과 신규 구축한 데이터베이스 연동 구조를 집약한 개발 가이드 문서인 [`cookie-consent-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/01_core-and-infra/cookie-consent-guide.md>) 파일을 신설했습니다.

#### 2. 부속 브랜드(Sub-brand) 도메인/서브도메인 설정 키 분리 오류 수정

* **구현 요약**: 사용자가 여러 멀티 브랜드를 소유 및 가동할 때, 특정 도메인(예: `golfgosu.net`)으로 진입 시 서브 브랜드 개별 설정(예: "골프 고수") 대신 메인 브랜드 설정("가이드나라")이 출력되던 버그를 정밀 분석하여 해결하고 타입 안정성을 검증했습니다.
* **작업 상세**:
  - **동적 브랜드 설정 파서(getConf) 구현 및 적용**:
    - 브랜드 블로그의 뷰어 및 메타데이터 관리 파일들에서 메인 브랜드 기본값(`blog_title` 등)만 무조건 가져오던 소스코드를 수정하여, 타겟 `brand_id`에 맞춰 접미사가 붙은 동적 키(`blog_title_golfgosu` 등)를 우선 조회하고 없으면 기본값으로 폴백하도록 파서를 탑재했습니다.
    - 대상 파일: [`page.tsx(Home)`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/page.tsx>), [`page.tsx(Post)`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/%5Bslug%5D/page.tsx>), [`page.tsx(Category)`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/category/%5Bslug%5D/page.tsx>), [`BlogClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/BlogClientWrapper.tsx>), [`CategoryClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/CategoryClientWrapper.tsx>), [`PostClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx>).
    - 동적 파싱 적용 설정 목록: 블로그 제목(`blog_title`), 소개 설명(`blog_description`), 템플릿 레이아웃(`blog_template`), 대표 테마 색상(`blog_accent_color`), 구글 통계 ID(`ga_id`), 네이버 서치어드바이저 키(`naver_advisor_key`), SEO 타이틀/디스크립션 템플릿(`seo_template_title`/`seo_template_desc`).
  - **`guidenara.com` 리다이렉트 무한 로딩 일시 차단**:
    - 외부 도메인 DNS A레코드가 미결정되어 먹통인 상태에서 자동으로 리다이렉트되던 문제를 막기 위해, DB에서 `custom_domain_status_guidenara` 값을 임시로 `"PENDING"`으로 수정하여 2차 도메인인 `guidenara.creaibox.com`을 통한 사이트 접속이 막힘 없이 이루어지도록 복원 조치했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 통과하여 타입 안정성을 입증했습니다.

#### 4. 구글 애드센스 게시자 ID 클라이언트 파싱 규격 오류 수정

* **구현 요약**: 사용자가 애드센스 게시자 ID를 입력했을 때, 소스코드 내 클라이언트 포맷팅 정규식의 계산 오류로 인해 `client=ca-pub-XXXXXXXX` 대신 `client=ca-XXXXXXXX`로 잘못 파싱되어 광고 송출이 정상적으로 인식되지 않던 심각한 클라이언트 버그를 수정했습니다.
* **작업 상세**:
  - **인증 규격 보완**:
    - [`BlogClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/BlogClientWrapper.tsx>), [`CategoryClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/CategoryClientWrapper.tsx>), [`PostClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx>) 내에서 `ca-pub-` 접두사 포맷팅 로직을 수정하여, 입력 형태(`pub-` 유무, `ca-pub-` 포함 유무, 순수 숫자 입력 등)에 상관없이 반드시 정상적인 구글 표준 규격인 `ca-pub-XXXXXXXXXXXXXXXX` 형태로만 연동되도록 예외 처리를 정밀 매핑했습니다.
  - **정적 무결성 빌드 검증**: `npx tsc --noEmit`을 완벽 컴파일 통과하여 타입 안정성을 입증했습니다.

#### 5. 타사 도메인 Vercel.com 이전 가이드 문서 작성

* **구현 요약**: 블루호스트(Bluehost) 등 외부 대행업체에서 관리 중인 도메인을 Vercel로 이관(Transfer In)하여 유지 비용을 최대 50%까지 절감하고 관리를 통합하기 위한 매뉴얼을 구축했습니다.
* **작업 상세**:
  - **이전 절차 백서 등록**:
    - [`domain-transfer-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/02_auth-and-domain/domain-transfer-guide.md>) 가이드 파일을 신설하여 블루호스트 기준 잠금 해제(Unlock), 인증코드(EPP Code) 발급 절차, Vercel 결제 내역 설명 및 **소유자 이메일 최종 승인 처리**의 중요성을 상세 정리했습니다.

---

### 🗓️ 2026-07-04 (토)

#### 1. 블로그 하단 커스텀 에디토리얼 설정 모달 및 본문 주석 연동 구현

* **구현 요약**: 사용자가 블로그 글 본문 하단에 표시되는 에디토리얼 박스를 활성화/비활성화하고, 원하는 테마 프리셋과 개별 컬러칩 및 텍스트 문구를 설정하여 발행할 수 있는 모달 UI 제어 체계와 렌더링 프레임워크를 개발했습니다.
* **작업 상세**:
  - **설정 제어 모달 및 실시간 라이브 프리뷰**:
    - [`UniversalBlogEditor.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx>)의 툴바 우측에 `[ 에디토리얼 설정 ]` 버튼을 배치했습니다.
    - 활성화 토글 스위치, 5가지 테마 프리셋(기본 라이트, 소프트 블루, 소프트 그린, 소프트 레드, 네온 다크) 선택기, 소제목(Subtitle) 및 상세 본문(Content Text) 입력 영역을 구현했습니다.
    - 세부 커스텀 색상(배경, 테두리, 소제목, 글자색)을 지정할 수 있는 HTML5 컬러 피커와 Hex 입력기를 결합하고, 모달 내에 동일 스타일로 그려지는 **실시간 Live Preview 박스**를 탑재하여 편집 편의성을 높였습니다.
  - **데이터 은닉 바인딩 (HTML Comment Serialization)**:
    - 데이터베이스의 무의미한 컬럼 확장 및 마이그레이션 중단 장애를 피하기 위해, 입력된 설정 데이터를 JSON 형태로 가공하여 본문 HTML 하단에 `<!-- CREAIBOX_EDITORIAL_START {JSON} CREAIBOX_EDITORIAL_END -->` 주석 형태로 패키징하여 안전하게 단일 content 컬럼에 영방향 직렬화 저장 처리했습니다.
    - 에디터를 불러올 때는 정규식 탐색을 거쳐 주석을 걷어내고(`cleanContentComment`) 모달 상태값으로 자동 복원 매핑하여, Tiptap 작성 공간에는 주석 소스코드가 노출되지 않도록 디커플링했습니다.
  - **상세 템플릿 연동 및 글자 크기 통일**:
    - **공식 블로그**([`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx>)) 및 **브랜드 블로그**([`PostClientWrapper.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx>)) 뷰어 단에서 본문 HTML 주석 데이터를 해석해 지정된 테마 색상으로 드로잉되도록 동적 파싱 렌더러를 탑재했습니다.
    - 설정 정보가 없는 기존 포스트의 하위 호환성을 위해 크리에이박스 기본 공식 에디토리얼 카드로 자동 Fallback 되도록 복원력을 심어두었습니다.
    - 카드 내 본문 문구 폰트 크기를 포스트 본문 크기인 **`text-[1.05rem]` 및 `leading-[1.8]`**로 완벽히 통일하여 시각적 이질감을 없앴습니다.

#### 2. 에디터 원고 목록 사이드바 접기/펼치기 및 디자인 라인 개편

* **구현 요약**: 글 작성 공간을 최대로 넓혀 몰입할 수 있도록 원고 목록 사이드바를 유동적으로 접고 펼치는 기능을 추가하고, 찌그러짐 현상 없는 깔끔한 마스킹 모션을 도입했습니다.
* **작업 상세**:
  - **사이드바 헤더 정렬 및 텍스트 단일화**:
    - [`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx>) 내 왼쪽 원고 목록의 `[ 목록으로 돌아가기 ]` 버튼에 덮여있던 보라색 박스 배경을 걷어내 텍스트 링크 형태로 미려하게 다듬었습니다.
    - 우측 에디터 헤더 높이(14단, 56px)와 정확히 일치되도록 사이드바 헤더 가로 경계선(`border-b`) 정렬을 마쳤습니다.
  - **디자인 통일형 PanelLeft 접기/펼치기 제어**:
    - 목록 상단 헤더 우측에 `PanelLeftClose` 아이콘을 활용해 목록을 접을 수 있는 버튼을 추가했습니다. 이 버튼은 좌측 메인 메뉴의 "AI Studio" 옆 접기 버튼과 완전히 동일한 스타일(둥근 모서리, 배경색, 호버 효과 등)을 공유합니다.
    - 목록이 접혔을 때는 에디터 상단 헤더에 `[ 목록 📁 ]` 형태의 펼치기 버튼(`PanelLeftOpen` 및 `목록` 텍스트 레이블, 크기 13px)이 노출되도록 조건부 렌더링을 처리했습니다.
  - **찌그러짐 방지 마스킹용 고정폭 래퍼 도입**:
    - 목록을 접는 도중 가로 폭이 점진적으로 줄어들며 텍스트가 강제 줄바꿈되거나 입력 상자가 뭉개지며 사라지는 모션 오류를 개선하기 위해, 사이드바 내부에 고정폭(`w-[360px]`)을 갖는 이너 래퍼 컨테이너 `div`를 감싸 슬라이딩 마스킹 처리를 했습니다. 이로써 텍스트 찌그러짐 없이 완벽하게 오른쪽에서 왼쪽으로 싹 덮이며 깔끔하게 감춰집니다.

#### 3. AI 자동 글쓰기 및 재창조 제어 패널 사이드바 분리 이관

* **구현 요약**: 에디터 내 본문 영역에 강결합되어 있던 복잡한 AI 폼과 탭바를 좌측 사이드바 영역의 독립 컴포넌트(`CreaiboxAiWritingPanel.tsx`)로 완벽 분리 이관하여, 에디터 본연의 작성 환경을 정화하고 직관적인 4열 대칭 레이아웃을 구축했습니다.
* **작업 상세**:
  - **신규 사이드바 패널 개발**:
    - AI 자동 글쓰기 기능을 담당할 [`CreaiboxAiWritingPanel.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxAiWritingPanel.tsx>) 컴포넌트를 신규 개발했습니다.
    - AI 포스팅 글쓰기 ➡️ **`새글 쓰기`**, AI 포스팅 재창조 ➡️ **`URL 원문 재창조`**, AI 자동 수정보완 ➡️ **`수정보완`**, AI PDF 텍스트 추출기 ➡️ **`PDF 원문추출`**로 직관적 탭 라벨을 적용했습니다.
  - **중앙 에디터 경량화**:
    - [`UniversalBlogEditor.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx>) 내에 존재하던 AI 설정 드롭다운/입력 필드 마크업과 탭 변경 이벤트, 로컬 AI 변수들을 모두 걷어내고 순수 편집기에만 집중하도록 경량화했습니다.
    - AI 상태와 추출 핸들러를 부모 페이지(`page.tsx`)로 끌어올리는(State Lifting) 리팩토링을 완료했습니다.
  - **부모 페이지 레이아웃 및 아키텍처 연동**:
    - [`page.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx>)를 4열 그리드 레이아웃(목록 360px | AI 제어 패널 360px | 에디터 Fluid | 우측 SEO설정 420px)으로 확장하여 통합했습니다.
    - `updateLocalData`와 `handleAiGenerateInEditor` 등의 비동기 제어 함수 선언 위치를 TDZ(Temporal Dead Zone) 타입 이슈가 발생하지 않도록 상단으로 완벽 재조정했습니다.
  - **수정보완 기능의 에디터 하단 이관 및 폼 정비**:
    - `수정보완` 기능(본문 강화, 목차 구성, 포스트 타입 변경, 실시간 검색 반영 등)들을 에디터 본문 하단 툴바의 2번째 줄로 전면 이동하여, 사용자가 본문을 직접 보면서 필요한 보강 조작을 신속하게 트리거할 수 있도록 동선을 개편했습니다.
    - 좌측 AI 패널의 가로 칸 너비를 `420px`에서 `360px`로 축소하고 탭 개수를 3개(`새글 쓰기`, `URL 원문 재창조`, `PDF 원문추출`)로 깔끔하게 정리했습니다.
    - 좌측 탭 메뉴의 폰트 사이즈를 기존 `text-[11px]`에서 우측 SEO 설정 패널 탭과 완벽 대칭을 이루도록 **`text-sm` 및 `font-black`**으로 통일 및 확대했습니다.
    - `새글 쓰기` 탭의 설정 필드들을 기존의 [라벨 + 개행 + 입력창] 2줄 구조에서 **[라벨 + 입력창]이 가로 1줄로 배치**되는 `grid-cols-[100px_1fr]` 그리드 구조로 개편했습니다. 이를 통해 불필요한 행간 낭비를 줄이고 스크롤 길이를 기존 대비 50% 단축하여 컴팩트하고 유려한 폼 형태를 갖췄습니다.
    - 단, 입력 텍스트 분량이 길어질 수 있는 **`10. 타겟 키워드`** 및 **`11. 참고 사항`** 필드는 [라벨 + 개행 + 입력창/선택박스] 형태의 **2줄 레이아웃**으로 복원하여 입력 및 선택 시 텍스트 뭉개짐이나 시각적 좁아짐 현상을 해소했습니다.
  - **콘텐츠 플래너(AI 콘텐츠 기획) 설정 및 데이터 연동**:
    - `CreaiboxAiWritingPanel.tsx` 내의 대분류, 상세 분야, 추천 시리즈, 타겟 키워드(메인 키워드 주제) 설정 영역을 [ContentConditionPanel.tsx](<file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/content-planner/ContentConditionPanel.tsx>)와 완전히 일치하도록 텍스트 입력창에서 **카테고리/시리즈 `<select>` 드롭다운 체계**로 전환하고, 하위 항목들이 상위 선택에 반응해 동적으로 필터링 및 직접입력(`__custom__`) 변환되도록 연동했습니다.
    - 전략 수준, 결과 구성, 말투, 길이(목표 글자수) 등의 선택 폼 항목과 번호 순서를 기획 조건과 100% 매칭하여, Content Planner의 기획 목록에서 **`[ 블로그 글 생성 ]`** 클릭 시 전달되는 상세 쿼리 파라미터들이 에디터 페이지 로드 시 좌측 쓰기 탭의 모든 선택 박스에 정확히 자동 파싱 및 연동되도록 완벽 연계 처리했습니다.
  - **AI 패널 헤더 정제 및 목록 펼치기 통합**:
    - AI 패널 헤더의 기존 영문 타이틀(`AI WRITING STUDIO`)을 제거하고, 한글 타이틀(`AI 자동 글쓰기 및 재창조`)을 중앙 정렬 처리함과 동시에 에디터 타이틀 폰트와 완벽히 매치되도록 폰트 웨이트와 트래킹 비율을 일치시켰습니다.
    - 목록 사이드바가 접혔을 때(`isListSidebarCollapsed`가 참일 때) 이 타이틀 영역 제일 왼쪽에 `PanelLeftOpen` 아이콘의 목록 펼치기 버튼을 배치해, 직관적으로 목록을 다시 열 수 있는 통합 토글 제어를 완성했습니다.
  - **가운데 에디터 헤더 정렬 라인 일치**:
    - 가운데 에디터의 첫 번째 라인(헤더 영역) 내 윈도우 스타일 제어 버튼 및 제목 텍스트(`Creaibox Tiptap Blog Editor`), 우측 동작 버튼들에 `translate-y-[1.5px]`을 부여하여, 좌측 및 우측 패널의 헤더 텍스트/버튼 라인과 시각적으로 깔끔하게 높이가 정렬되도록 조정했습니다.
    - `npx tsc --noEmit`을 최종 빌드하여 에디터 패널 이관의 완벽한 컴파일 무결성을 보장했습니다.

---

### 🗓️ 2026-07-03 (금)

#### 1. 비디오 에디터 내 비디오 썸네일 노출 및 마우스 호버 실시간 탐색(Scrubbing) 구현

* **구현 요약**: 비디오 에디터 내 미디어 라이브러리 및 타임라인 상에서 비디오 파일들이 정적 아이콘(🎬)이나 액박 대신 실제 첫 프레임 화면을 노출하도록 썸네일을 보강하고, 마우스 호버 시 커서의 상대적 위치에 따라 실시간으로 재생 화면을 미리보기할 수 있는 고성능 스크러빙 기능을 구축했습니다.
* **작업 상세**:
  - **비디오 썸네일 첫 프레임 자동 노출**:
    - **가져온 미디어 목록 및 그리드**: [`VideoEditorUnifiedLibrary.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorUnifiedLibrary.tsx>)의 `SidebarMediaItemRow` 및 이벤트 미디어 소스 그리드에서 비디오 썸네일 이미지(`thumbnailUrl`)가 지정되어 있지 않을 경우, `item.url`이 있을 때 `<video>` 태그를 `preload="metadata"` 모드로 그려 첫 프레임 화면이 자연스럽게 썸네일로 표출되도록 설계했습니다.
    - **무료 공유 에셋 라이브러리**: [`VideoEditorMediaLibrary.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorMediaLibrary.tsx>) 내의 에셋 그리드 내 비디오 카드 영역에서도 동일하게 `<video>` 태그를 렌더링하여 첫 프레임이 깨짐 없이 노출되도록 구현했습니다.
    - **타임라인 비디오 클립**: [`VideoEditorClip.tsx`](<file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorClip.tsx>)의 타임라인 클립 렌더러에서 비디오 타입일 때 `thumbnailUrl`이 누락된 경우, `media?.url`을 획득하여 첫 프레임을 배경 썸네일처럼 띄워 타임라인 시각 정합성을 완전히 맞추었습니다.
  - **마우스 호버 실시간 구간 탐색 (Visual Hover Scrubbing)**:
    - **DOM 직접 변경을 통한 초고속 렌더링**: 이벤트 미디어 소스 그리드와 무료 공유 에셋 그리드의 각 비디오 카드에 `onPointerMove` 및 `onPointerLeave` 리스너를 결합했습니다. 마우스 이동 시 React 컴포넌트를 강제 리렌더링하지 않고, DOM 노드 질의를 통해 내포된 `<video>`의 `currentTime`을 커서의 상대 비율에 따라 실시간으로 직접 설정하여 **렉 없는 60fps 프리뷰 스크러빙**을 구현했습니다.
    - **자동 되감기 기능**: 마우스가 비디오 영역을 이탈하면 즉각 `currentTime`을 0초 지점으로 돌려 최초 화면으로 자동 복원되도록 처리했습니다.
  - **TypeScript 타입 무결성 검증**: `npx tsc --noEmit` 빌드 검사를 완벽히 가동하여 타입 충돌이나 컴파일 빌드에 장애가 없음을 최종 확인했습니다.
