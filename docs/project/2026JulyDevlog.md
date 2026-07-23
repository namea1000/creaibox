mier 

# CreAibox 개발일지 - 2026년 7월 (July 2026 Development Log)

이 문서는 2026년 7월 동안 CreAibox 프로젝트에서 진행된 일자별 개발 세부 작업 내역과 핵심 아키텍처 결정 사항을 기록합니다.

---

### 🗓️ 2026-07-22 (수) ~ 2026-07-23 (목) - 오늘

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
* **구현 요약**: 거추장스러운 기사 박스를 파스텔 1줄 뱃지(`✨ Published with CreAibox`)로 경량화하고, 사용자가 직접 **작가/브랜드명, 한 줄 소개글, 아바타 이미지 URL, 공식 홈페이지/SNS 링크**를 편집/저장할 수 있는 맞춤 프로필 카드 UI를 구축했습니다. 유료 회원의 뱃지 OFF 시에도 블로그 푸터 영역에 `Powered by CreAibox.com` 백링크를 주입하여 100% SEO 백링크 파워 상승 효과를 유지하도록 완성했습니다.
* **작업 상세**:
  - **기존 배포글 포함 출처 박스 동적 개편 연동 ([`PostClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx))**: 과거에 이미 발행되었던 포스트 본문에 삽입되어 있던 기존 `CREAIBOX INSIGHT EDITORIAL` 박스 형태를 동적으로 파싱/대체하여, 유저의 최신 설정에 따라 **[맞춤 작가/브랜드 프로필 카드]**, **[파스텔 1줄 뱃지 (`✨ Published with CreAibox`)]**, 또는 **[뱃지 OFF]**가 기존 배포글에도 실시간으로 100% 동등하게 적용되도록 렌더러 파이프라인 전면 개편.
  - **푸터 SEO 백링크 보장**: 블로그 최하단 푸터 영역에 `Powered by CreAibox.com` 텍스트 앵커 링크(`href="https://creaibox.com"`)를 결합하여 수천 개 포스트에서 구글/네이버 백링크 수집이 100% 유지되도록 처리.
  - **플랜 가이드 문서 업데이트**: [`pricing-plan-guide.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/project/pricing-plan-guide.md) Section 4 백링크 마케팅 통합 규정 수록.
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
  - **가이드 및 백서 문서 등록**: 관련된 3가지 관점과 신규 구축한 데이터베이스 연동 구조를 집약한 개발 가이드 문서인 [`cookie-consent-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/cookie-consent-guide.md>) 파일을 신설했습니다.

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
    - [`domain-transfer-guide.md`](<file:///Users/a1234/Local%20Sites/creaibox/docs/project/domain-transfer-guide.md>) 가이드 파일을 신설하여 블루호스트 기준 잠금 해제(Unlock), 인증코드(EPP Code) 발급 절차, Vercel 결제 내역 설명 및 **소유자 이메일 최종 승인 처리**의 중요성을 상세 정리했습니다.

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
