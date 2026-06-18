# CreAIbox 개발일지 (Development Log)

이 문서는 CreAIbox 프로젝트의 일자별 개발 내역, 핵심 아키텍처 결정 사항을 기록합니다.

### 🗓️ 2026-06-18 (목) - 오늘
#### 1. 브랜드 서브도메인 블로그 접속 불능 및 JWT 예외 처리 트러블슈팅
* **구현 요약**: 브랜드 ID 승인 후 실서버(`blog.creaibox.com`, `golfgosu.creaibox.com` 등)에서 발생하는 "Blog Under Construction" 에러 및 RLS 우회용 Supabase Client 초기화 오류를 완벽히 해결했습니다.
* **작업 상세**:
  * **원인 규명**: 데이터베이스에는 브랜드 승인이 정상 저장되었으나, Vercel 환경 변수 `SUPABASE_SERVICE_ROLE_KEY` 등록 시 개행 문자(`\n`)와 함께 다른 환경 변수(`API_VAULT_ENCRYPTION_KEY`)가 합쳐져 오염 등록되어 있던 것을 추적하여 밝혀냈습니다.
  * **방어 코드 적용**: `src/utils/supabase/server.ts`의 `createAdminClient` 함수에 복사-붙여넣기 실수로 인한 줄바꿈 및 환경 변수 유입을 정제해주는 방어 로직(`split("\n")[0].trim()`)을 적용하여, 대시보드 수정 없이도 `git push`만으로 즉시 오류를 복구하도록 조치했습니다.
  * **문서화 완료**: [blog-subdomains-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/blog-subdomains-design-spec.md)에 트러블슈팅 세부 이력 및 Vercel 환경 변수 주의점을 정식으로 문서화해 두었습니다.

#### 2. 로컬 개발 환경에서의 미들웨어 경로 조정 및 리라이트 루프 해결
* **구현 요약**: 로컬 개발 시 `golfgosu.localhost:3000` 접속 시 메인 랜딩 페이지로 이동하거나 무한 루프가 돌던 문제를 `middleware.ts` 위치 재배치 및 무한 리라이트 예외 방지 필터링으로 완벽히 해결했습니다.
* **작업 상세**:
  * **미들웨어 파일 경로 교정**: 프로젝트에 `src` 디렉토리가 있을 때 Next.js 로컬 개발 서버가 루트의 `middleware.ts`를 무시하는 동작 사양을 고려하여, 파일 위치를 `src/middleware.ts`로 정식 이동시켰습니다.
  * **무한 리라이트 예외 처리**: 이미 내부 리라이팅이 이루어진 주소(`/brand/[brand_id]`)가 미들웨어를 타서 중복으로 또 리라이트되는 루프를 방지하기 위해, `isStaticOrApi` 필터링에 `path.startsWith("/brand")` 예외 구문을 추가하였습니다.

#### 3. 프리미엄 테마 스위처(라이트/다크) 및 실시간 검색 기능 탑재
* **구현 요약**: 블로그 방문자용 헤더에 `downhubs.com` 스타일의 라이트/다크 모드 토글과 실시간 포스팅 검색 기능을 추가하였으며, 다크 모드의 배경 컬러를 부드러운 그레이 톤으로 교정했습니다.
* **작업 상세**:
  * **클라이언트 컴포넌트 이관**: 서버 사이드 렌더링(SEO) 성능을 보존하면서 테마 전환 및 라이브 검색과 같은 동적 인터랙션을 구현하기 위해, 브라우저 마운트 이벤트를 처리하는 `BlogClientWrapper.tsx` 클라이언트 컴포넌트를 분리 개발해 매핑했습니다.
  * **다운허브스 스타일 다크 톤 및 스위치**: 기존의 완전한 올 블랙(`bg-zinc-950`)에서 눈이 피로하지 않은 부드러운 다크 그레이(`bg-[#181a20]` 배경, `bg-[#1e222b]` 카드/헤더)로 다크 테마 컬러를 리뉴얼하고, 헤더 우측에 세련된 캡슐형 테마 슬라이드 토글을 배치했습니다.
  * **통합 실시간 검색바**: 돋보기 아이콘 클릭 시 노출되는 애니메이션 인풋 필드를 신설하고, 카테고리/제목/요약문을 기준으로 포스팅을 즉시 필터링해주는 검색 엔진을 구축했습니다.
  * **헤더 제어 도구 레이아웃 조정**: 사용자의 시각적 피드백을 반영하여 테마 스위처와 돋보기 검색 버튼의 좌우 배치를 스왑([토글스위치] [돋보기] 순)하고, 배경 대비를 높이기 위해 테마 토글 캡슐에 굵은 점선 테두리(`border-2 border-dashed`) 스타일을 적용해 가시성을 대폭 개선했습니다.
  * **히어로 배너 영역 높이 최적화**: 블로그 상단 타이틀과 설명글이 있는 히어로 영역의 세로 패딩 크기를 대폭 축소(기존 `py-24` ➡️ `py-8`, 총 약 66% 이상 축소)하여, 방문 시 첫 화면에서 포스팅 글 목록이 훨씬 컴팩트하고 넓게 보이도록 레이아웃 비율을 완성했습니다.

#### 4. 대표 이미지 지정 오류(신규 삽입 실패) 디버깅 및 Supabase 브라우저 클라이언트 싱글톤 리팩토링
* **구현 요약**: 블로그 에디터 본문 이미지의 "대표 이미지 지정" 기능 수행 시 RLS(Row Level Security) 정책 위반으로 인해 신규 레코드 삽입에 실패하던 버그를 해결했습니다.
* **작업 상세**:
  * **원인 분석**: `createBrowserClient` 호출 시마다 새로운 Supabase Client 인스턴스를 무상태로 반환함으로써 브라우저 세션(JWT) 쿠키 동기화 및 갱신이 누락되어, DB 쿼리 전송 시 인증 헤더가 비어 있어 비인증(Anonymous)으로 인식되어 RLS 정책(`auth.uid() = user_id`) 위반이 발생하는 간헐적 이슈를 추적했습니다.
  * **싱글톤 아키텍처 도입**: [client.ts](file:///Users/a1234/Local%20Sites/creaibox/src/utils/supabase/client.ts)를 리팩토링하여 전역에 단일한 클라이언트 인스턴스(`client`)를 유지 및 반환하도록 설계해 컴포넌트 간 세션 동기화 무결성을 지켰습니다.
  * **상세 오류 로깅 보완**: [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx), [ImageNodeView.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/extensions/ImageNodeView.tsx), [BlogImageStudioPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/BlogImageStudioPanel.tsx) 및 [MediaLibrarySelectModal.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/MediaLibrarySelectModal.tsx)의 `try-catch` 구문 내 단순 객체 로깅(`console.error(err)`)을 개선하여 `message`, `code`, `details`, `hint` 등의 구조화된 에러 속성을 콘솔에 명확하게 보존하도록 수정했습니다.


#### 5. 미디어 라이브러리 더 불러오기 페이징 크기 및 초기 크기 조정
* **구현 요약**: 대표 이미지 설정 모달에서 초기 렌더링 시 노출되는 이미지 및 "미디어 더 불러오기" 클릭 시 추가되는 단위를 3줄(24개)에서 7줄(56개)로 늘려 큰 모달창 내 빈 공간을 가득 채우고 사용자의 조작 피로도를 줄였습니다.
* **작업 상세**:
  * [MediaLibrarySelectModal.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/MediaLibrarySelectModal.tsx)의 초기 `pageSize` 상태 기본값 및 더 불러오기 클릭 핸들러의 `setPageSize` 증분 크기를 모두 기존 `24`에서 `56`으로 상향 수정했습니다.

#### 6. 미디어 라이브러리 및 썸네일 설정 패널 스타일 정비
* **구현 요약**: 우측 이미지 스튜디오 패널의 녹색 "파일 첨부" 버튼의 컬러를 제거하여 심플한 텍스트 단추 스타일로 교정하고, 그 왼쪽에 미디어 라이브러리 모달을 여는 "교체" 버튼을 신설하여 조작 동선을 최적화했습니다. 또한, "대표 이미지(썸네일) 설정" 버튼을 화려한 보라-핑크 그라데이션 박스로 커스텀하여 주목도를 보강했습니다.
* **작업 상세**:
  * **텍스트형 파일 첨부 및 교체 버튼 배치**: [BlogImageMediaLibrarySection.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/BlogImageMediaLibrarySection.tsx)의 헤더 우측에 심플한 텍스트 스타일의 "파일 첨부" 버튼을 복원하고, 그 왼쪽에 미디어 라이브러리 모달을 열 수 있는 "교체" 버튼을 나란히 배치했습니다.
  * **상위 모달 트리 연계**: [BlogImageStudioPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/shared/image-studio/BlogImageStudioPanel.tsx)에서 `BlogImageMediaLibrarySection`으로 모달을 여는 콜백(`onOpenMediaModal={() => setIsMediaModalOpen(true)}`)을 주입하여 "교체" 버튼 클릭 시 썸네일 설정 모달이 바로 팝업되도록 구조화했습니다.
  * **대표 이미지 설정 버튼 컬러화**: "대표 이미지(썸네일) 설정" 버튼 스타일을 기존 `bg-zinc-800 border-zinc-700` 무채색에서 파란색 생성 버튼("AI 이미지 생성 시작")과 시각적으로 명확히 대비되는 보라-분홍 그라데이션(`bg-gradient-to-tr from-purple-600 to-pink-600` 및 `text-pink-100` 아이콘)으로 스타일을 고도화했습니다.

#### 7. 대표 이미지 지정 시 데이터 구조 불일치 디버깅 및 camelCase/snake_case 속성 지원
* **구현 요약**: 대표 이미지(썸네일) 설정 시, 프론트엔드 상태(GeneratedImage: `url`)와 데이터베이스 로우(GeneratedImageRow: `image_url`)의 데이터 포맷 혼용으로 인해 Not Null(`image_url`) 제약조건 위반 에러(`Failed to set featured image: {}`)가 발생하던 버그를 해결했습니다.
* **작업 상세**:
  * **원인 규명**: 썸네일 설정 패널(`BlogImageStudioPanel.tsx`)의 `handleSetFeaturedImage` 내부에서 `selectedImage.image_url`을 바로 Supabase에 insert하도록 구현되어 있었으나, 갤러리 카드에서 넘어올 때는 속성명이 `url`이었기 때문에 `image_url` 값이 `undefined`로 지정되어 DB Not Null 제약조건 위반 오류를 유발했습니다.
  * **방어 및 매핑 코드 적용**: `handleSetFeaturedImage` 내부에 안전한 속성값 추출 로직(`selectedImage.image_url || selectedImage.url`)을 도입하고, `aspect_ratio`/`alt_text` 등 camelCase(`aspectRatio`, `altText`)와 snake_case(`aspect_ratio`, `alt_text`)가 혼용될 수 있는 모든 필드에 대해 폴백(Fallback) 구조를 수립했습니다.
  * **컴파일 안전성 검증**: 수정한 후 `npx tsc --noEmit`을 수행하여 이미지 스튜디오 내의 타입 세이프티가 안정적으로 유지됨을 검증했습니다.

#### 8. 구글 드라이브 연동 Pixabay 스타일 무료 공유 에셋 라이브러리 탑재
* **구현 요약**: 사용자들이 이미지, 비디오, 사운드 등 무료 미디어 에셋을 자유롭게 업로드하고 다운로드받아 프로젝트에 활용할 수 있도록 픽사베이(Pixabay) 스타일의 무료 에셋 공유 라이브러리(`/studio/library/free-assets`)와 전용 API를 신설했습니다.
* **작업 상세**:
  * **구글 드라이브 공유 저장 아키텍처**: 별도 데이터베이스 테이블 없이 구글 드라이브 지정 폴더를 단일 진실 공급원으로 설정했습니다. 파일 업로드 시 JSON 메타데이터(제목, 태그, 기여자, 다운로드 수, 조회수)를 파일 설명(`description`) 컬럼에 주입하고, `lh3.googleusercontent.com` direct link와 전체 공개 권한을 할당하는 아키텍처를 구현했습니다.
  * **전용 백엔드 API 라우트 신설**:
    * `GET /api/free-assets/list`: 구글 드라이브 폴더를 스캔하여 파일 리스트를 로드하고 description 필드의 JSON 메타데이터를 파싱하여 리턴.
    * `POST /api/free-assets/upload`: 사용자 로컬 파일과 태그/미디어 타입을 받아 구글 드라이브에 직접 업로드하고 권한 설정 및 description 부여.
    * `POST /api/free-assets/action`: 다운로드나 조회수가 발생했을 때 구글 드라이브 파일의 description 속성을 업데이트하여 카운트를 실시간 누적.
  * **Pixabay 스타일 프리미엄 UI (/studio/library/free-assets)**:
    * **배너 및 필터**: 다크 그레이 그라데이션 바탕의 히어로 배너, 검색창, 미디어 타입 선택 탭(전체, 사진, 일러스트, 비디오, 음악/사운드, GIF) 및 인기 해시태그 배치.
    * **에셋 그리드 & 인터랙션**: 이미지/비디오/음악을 격자형 그리드로 렌더링하고, 호버 시 상세 정보(태그, 다운로드 버튼) 오버레이 적용. 비디오는 호버 시 자동 재생(Muted autoplay)을, 음악은 카드 내 즉시 미리듣기 재생/정지(HTML5 Audio 동적 바인딩)를 탑재했습니다.
    * **상세보기 및 업로드 모달**: 고해상도 크게보기, 다운로드/조회 통계, CCL0 라이선스 명세, 드래그앤드롭 업로드 구역 및 메타 지정 폼 구현.
  * **대시보드 카드 및 사이드바 메뉴 연동**: 라이브러리 메인 대시보드(`/studio/library/page.tsx`) 내에 "무료 공유 에셋" 메뉴 카드를 신설하고, 사이드바 컴포넌트([Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx))의 "콘텐츠 라이브러리" 그룹 자식 목록 내에서 가장 첫 번째(최상단)에 "무료 공유 에셋" 서브메뉴를 추가하여 진입 동선 및 접근성을 극대화했습니다.

#### 9. Canva 스타일 디자인 편집기(캔버스) 고도화 및 보관함(이미지 라이브러리) 저장 연동
* **구현 요약**: 무료 에셋 상세 보기 모달에서 즉각 이미지 편집 캔버스로 진입하여 실시간 보정, 누끼 제거, 해상도 스케일 보정을 마치고 최종 편집본을 로컬 다운로드 및 사용자의 이미지 보관함에 영구 저장하는 연계 흐름을 구축했습니다. 또한 편집기 내부 왼쪽 사이드바에 "보관함" 탭을 추가하여 자신이 저장한 이미지를 캔버스에 즉각 재삽입할 수 있는 Canva와 완전 동일한 자산 관리 흐름을 구성했습니다.
* **작업 상세**:
  * **아코디언 기반 5개 편집 모드 연동**: 상세 뷰 내에 "이미지 편집" 아코디언 메뉴를 배치하고 배경 제거, 보정, 자르기, 색상 조정, 소셜용 크기 변환에 해당하는 개별 쿼리 파라미터를 탑재하여 디자인 편집기(`/studio/image/workspace`)로의 다이렉트 라우팅 연동을 완료했습니다.
  - **CORS 우회 및 이미지 드로잉 복사 구현**: 외부 Unsplash/Pixabay 이미지 연동 시 발생하는 Tainted Canvas 에러를 방지하고자 프록시 API를 통과해 `crossOrigin="anonymous"`로 캔버스 데이터를 로드하도록 처리했습니다.
  - **Canva 6대 색조 필터 및 프리셋 고도화**: 실시간 CSS 필터가 적용된 레이어 배치를 넘어서, HTML5 2D Canvas 그래픽 연산 기반의 컴파일 드로잉을 구현했습니다. 이를 통해 화면 캔버스의 비율(scale) 보정 및 텍스트 줄바꿈 처리가 실제 다운로드 파일과 동일하게 적용되도록 마쳤습니다.
  - **이미지 라이브러리 저장 (`saveToLibrary`) 연동**: 캔버스에서 가공된 이미지를 WebP blob으로 동적 추출하고 `FormData`에 결합해 `/api/image-upload` API를 통해 Supabase `generated_images` DB 테이블과 구글 드라이브 및 Storage에 성공적으로 보관 및 적재하는 기능을 완비했습니다.
  - **내 이미지 보관함(라이브러리) 사이드바 탭 구현**: 왼쪽 메인 메뉴바에 "보관함" 탭을 신설(아이콘: `FolderOpen`)하고, Supabase Browser Client를 통해 사용자가 그동안 저장해온 디자인 목록을 자동 로드하여 클릭 시 캔버스에 즉각 새 레이어로 삽입되도록 하였습니다. 또한 이미지 저장 성공 시 목록이 실시간으로 새로고침되도록 바인딩을 추가해 사용성을 고도화했습니다.
  - **보관함 이미지 찌그러짐 디버깅 및 정렬 픽스**: 브라우저 기본 CSS 상속으로 인해 그리드 속 `button` 내부 이미지의 세로 높이가 극도로 찌그러져 얇은 실선처럼 렌더링되던 레이아웃 에러를 해결하기 위해, 갤러리 `button` 컴포넌트에 `flex flex-col w-full` 속성을 부여하고 내부 `img` 태그에 `min-h-[80px]` 최소 높이를 강제 기입하여 썸네일과 텍스트 타이틀이 깨끗한 종횡비로 정상 출력되도록 조치했습니다.

#### 10. 이미지 스튜디오 사이드바-홈 메뉴 동기화 및 미구현 페이지 개발
* **구현 요약**: 이미지 스튜디오 홈과 사이드바 하위 메뉴의 구조/링크를 정합성 있게 일치시키고, 미구현 상태였던 세부 메뉴 페이지들을 신규 탭 컴포넌트로 완벽히 개발 및 연동했습니다.
* **작업 상세**:
  - **디자인 편집기 상단 노출 및 메뉴 단일화**: 사이드바 이미지 스튜디오 첫 번째 메뉴로 "디자인 편집기 (Workspace)"를 올리고, 사이드바에서 누락되었던 템플릿 라이브러리, AI 매직 디자인, 브랜드 키트를 추가 탑재했습니다. WEBP 압축기 주소를 `/studio/image/webp-compressor`로 홈과 정합시켰습니다.
  - **프롬프트 라이브러리 (`prompts`) 페이지 신규 구현**: 영화 같은 시사 샷, SF 사이버펑크, 에픽 판타지, 귀여운 3D 등 추천 프롬프트 카드를 노출하고 원클릭 영어 프롬프트 복사 클립보드 및 편집기(`Workspace?mode=ai&prompt=...`)로의 다이렉트 바인딩을 완비했습니다.
  - **포스터/명함/현수막 (`CategoryTemplatesTab`) 통합 구현**: `poster`, `business-card`, `banner` 섹션 접속 시 각각 A4(2480x3508), 명함(900x500), 배너(1200x400) 규격의 예시 템플릿과 디자인 목적에 맞는 캔버스 사이즈 정보가 바인딩된 워크스페이스 생성 라우팅 연동을 완료했습니다.
  - **동적 라우터 탭 결합**: `[section]/page.tsx` 내에 `PromptsTab` 및 `CategoryTemplatesTab`을 동적 결합하여 사이드바 혹은 홈에서 링크 클릭 시 알맞은 세부 페이지가 즉각 렌더링되도록 구현했습니다.

#### 11. Google Drive 미디어 라이브러리 격리 보관 및 이미지 콘텐츠 라이브러리 탭 구현
* **구현 요약**: 구글 드라이브 무한 적재 시 발생하는 성능 한계 극복을 위해 사용자 ID별 및 스튜디오 용도별 분기 폴더 자동 생성 격리 기능을 탑재하고, 사이드바의 "이미지 콘텐츠" 라이브러리 관리 탭 페이지를 전면 활성화했습니다.
* **작업 상세**:
  - **동적 계층화 폴더 자동 생성**: `src/lib/google-drive.ts` 내에 `getOrCreateFolder` 재귀/순차 폴더 획득 헬퍼를 추가하여 파일 업로드 시 `[Root] ➡️ [User ID] ➡️ [Studio/Source Type]` 계층의 폴더를 실시간 자동 생성하여 격리 보관하도록 설계했습니다.
  - **이미지 업로드 API 매개변수 바인딩**: `src/app/api/image-upload/route.ts`에 사용자 고유 ID 및 소스 타입(`sourceType`)을 인수로 전달하게 연계하였습니다.
  - **이미지 콘텐츠 라이브러리 탭 라우팅 해제**: `/studio/library/[section]/page.tsx`에서 `section === "image"`일 때 "준비중" 화면 대신 실제 데이터 그리드 매니저인 `<CreaiboxLibraryManager />`가 마운트되도록 차단을 해제했습니다.
  - **다중 소스 타입 라이브러리 렌더러 구현**: `CreaiboxLibraryManager.tsx` 내부에서 `useParams`를 통해 동적으로 섹션(`image` vs `creaibox`)을 읽고, 이에 따라 DB 쿼리 필터 및 업로드 sourceType을 `"image-studio"`와 `"writing_creaibox_posts"`로 나누어 격리 동작하도록 수정했습니다. 또한, 각 탭 종류에 부합하는 아이콘 배지와 헤더 제목/설명 문구를 렌더링하게 적용했습니다.

#### 12. 이미지 확장자 변환기 (Image Format Converter) 신규 개발 및 연동
* **구현 요약**: 사용자가 이미지를 직접 드래그앤드롭하여 원하는 이미지 확장자(WebP, PNG, JPG) 및 가로 해상도 크기(원본, 1920px, 1280px, 640px, 직접 지정)를 선택해 자유롭게 리사이징 변환 및 다운로드할 수 있는 전용 도구를 탑재했습니다.
* **작업 상세**:
  - **오프라인 캔버스 변환기 개발**: `src/app/studio/image/[section]/components/ImageConverterTab.tsx` 컴포넌트를 설계하여 HTML5 Canvas를 이용해 브라우저 단에서 100% 로컬 변환 및 압축 다운로드되도록 구현하여 불필요한 네트워크 대역폭 소모를 방지했습니다.
  - **다중 파일 큐 및 일괄 다운로드**: 여러 이미지 파일을 드래그앤드롭하여 한꺼번에 적재하고, 전체 혹은 개별적으로 원클릭 변환 및 일괄 다운로드할 수 있는 UX 큐를 설계했습니다.
  - **동적 라우터 바인딩**: `[section]/page.tsx`에 `converter` 섹션을 등록하고 해당 탭 진입 시 신규 컴포넌트가 마운트되도록 리다이렉트 분기를 보강했습니다.

#### 13. 무료 공유 에셋 구글 드라이브 파일 중복 및 이름 중복 방지 고도화
* **구현 요약**: 무료 공유 에셋 업로드 시, 동일 파일명의 파일 유입으로 인한 구글 드라이브 내부 관리의 혼란 및 다운로드 시 파일 충돌을 막기 위해 파일명에 유니크한 타임스탬프를 덧붙이도록 고도화했습니다.
* **작업 상세**:
  - **고유 파일명 인코딩**: [route.ts (api/free-assets/upload)](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/free-assets/upload/route.ts)를 수정하여 파일 저장 시 원본 파일명 뒤에 타임스탬프 접미사(`_1718721321000`)를 강제 결합해 구글 드라이브에 안전하게 업로드하도록 수정했습니다.
  - **메타데이터 정보 보존**: 에셋 명세 및 화면상 출력되는 제목(Title) 메타데이터 속성값은 한글 원본 파일명 그대로 JSON 설명(`description`) 필드에 유지시켜, 사용자 인터페이스에서의 가시성은 훼손하지 않으면서도 물리 드라이브 파일만 고유해지도록 처리했습니다.

#### 14. 무료 공유 에셋(free-assets) 구글 드라이브 미디어/연월 격리 및 DB 캐시 연동
* **구현 요약**: 구글 드라이브 무료 공유 에셋 관리의 확장 한계를 해결하기 위해 미디어 타입(image/music/video) 및 업로드 연월(YYYYMM) 단위로 폴더 격리 저장을 처리하고, 백엔드 탐색 속도 극대화를 위해 Supabase DB 테이블 기반 캐시 아키텍처를 적용했습니다.
* **작업 상세**:
  * **2차 격리 폴더 업로드**: `google-drive.ts` 내 `uploadFreeAsset` 함수를 변경하여 업로드되는 파일의 MIME type/메타데이터를 판별해 `image/`, `music/`, `video/` 하위의 연월 폴더(`202606/` 등)를 자동 생성해 격리 저장되도록 적용했습니다.
  * **DB 캐싱 및 초고속 API 개편**: Supabase `free_assets` 테이블을 생성하여 업로드 메타데이터(File ID, URL, 해상도, 카메라, 태그 등)를 보관하고, 목록 조회(`list`) 시 매번 실시간 구글 드라이브 스캔 대신 DB 인덱스를 활용해 0.01초 내로 조회/필터링을 하도록 API 라우트를 전면 개편했습니다. 수정(`update`), 삭제(`delete`) API도 DB와 구글 드라이브를 상시 동기화하도록 연동했습니다.
  * **마이그레이션 도구 수립**: 기존 구글 드라이브 루트 폴더의 에셋들을 자동으로 새 하위 폴더로 이동시키고, 메타데이터 정보를 DB 레코드로 자동 삽입/변환해주는 CommonJS 배치 스크립트(`scratch/migrate_free_assets.js`)를 신규 개발했습니다.

#### 15. 블로그 이미지 저장소 (blog-images) 3차 격리 폴더 구조 개편 및 재배치 마이그레이션
* **구현 요약**: 사용자의 대량 콘텐츠 발행(10만 장 이상) 시 구글 드라이브 내 단일 폴더 파일 초과에 따른 API 병목을 선제 예방하기 위해, 블로그 이미지 저장 계층을 `[User ID]/[Source Type]/[YYYYMM]/` 구조로 3차 확장하고 마이그레이션했습니다.
* **작업 상세**:
  * **3차 연월 폴더 격리**: `google-drive.ts` 내 `uploadToGoogleDrive` 함수를 고도화하여, 사용자 고유 폴더 및 스튜디오 소스 폴더 하위에 현재 업로드 연월(`YYYYMM`, 예: `202606`) 3차 격리 폴더를 확인하고 없으면 자동 생성하여 적재하도록 수정했습니다.
  * **마이그레이션 스크립트 실행**: 기존 스튜디오 폴더(`image-studio`, `writing_creaibox_posts` 등) 바로 하위에 평면적으로 흩어져 존재하던 수백 개의 기존 블로그 이미지 파일들을 생성일 기준의 `YYYYMM` 서브폴더로 일괄 재배치하는 CommonJS 배치 스크립트(`scratch/migrate_blog_images_to_ym.js`)를 구현하고 가동했습니다.
  * **정합성 유지**: 구글 드라이브 API 고유의 파일 ID(File ID) 상속 특성을 활용하여 폴더 이동 후에도 기존 CDN 이미지 링크 주소가 100% 무손실 보존되도록 안정성을 확보했습니다.

### 🗓️ 2026-06-17 (수)
#### 1. Cre Music (스포티파이 스타일 뮤직 플레이어) 및 구글 드라이브 음원 스트리밍 연동
* **구현 요약**: 구글 드라이브 20TB 공간의 지정 폴더(`vocal_trance` 앨범)에 올려둔 음원을 실시간으로 감상하고 제어할 수 있는 스포티파이 스타일의 고속 오디오 스트리밍 플레이어 페이지 및 API를 개발했습니다.
* **작업 상세**:
  * **백엔드 음원 목록 API (`/api/music-studio/list`)**: Supabase 로그인 세션 검증 및 `ALLOWED_TESTER_EMAILS` 화이트리스트 테스터 권한 검사를 적용했습니다. 구글 API v3를 호출하여 지정된 폴더 ID(`1p68BWWuQVIdJF9pT9XSBS2kQOhnjOwGP`) 내의 오디오 파일(.mp3, .wav 등) 메타데이터를 로드하고, 내부 스트리밍 API 주소(`/api/music-studio/stream?id=[FILE_ID]`)를 매핑하여 반환하는 엔드포인트를 구축했습니다.
  * **보안 스트리밍 프록시 API (`/api/music-studio/stream`)**: `lh3.googleusercontent.com/d/[FILE_ID]` 다이렉트 CDN 링크 사용 시 대용량 비-이미지(오디오) 파일 재생 시 브라우저 쿠키 체크, CORP/CORS 차단 및 구글의 HTML 응답 반환으로 인해 `NotSupportedError (no supported sources)` 오디오 엑박 에러가 발생하던 현상을 해결했습니다. 백엔드에서 `alt=media` 구글 드라이브 API를 직접 프록시하여 음원 바이너리를 스트리밍하고, 브라우저가 부분 전송을 요청할 수 있도록 `Range` 헤더 위임 및 `206 Partial Content`를 완전 지원하게 함으로써 지연 없는 오디오 탐색(Seeking)과 재생 오류를 완벽하게 수정했습니다.
  * **스포티파이 스타일 뮤직 플레이어 UI (`/studio/music/cre-music`)**: 다크 프리미엄 비주얼 테마(블루-퍼플 그라데이션)로 사이드바, 앨범 히어로 배너, 곡 목록 테이블, 하단 글로벌 재생 컨트롤 바를 반응형으로 개발했습니다. HTML5 `<audio>` 태그와 양방향 동기화하여 셔플, 루프, 이전/다음 곡 이동, Seek 진행도 바, 볼륨 슬라이더 및 음소거 제어를 실시간으로 구현했습니다.
  * **데모 폴백 및 동기화**: 연동된 드라이브에 곡이 없거나 연동 장애 시 정상적인 탐색을 위해 3개의 고화질 데모 트랙(`SoundHelix` 소스)으로 대체 렌더링되도록 Fallback을 설계했습니다. 또한 최신 드라이브 업로드 상태를 반영할 수 있는 실시간 "동기화(Refresh)" 및 "드라이브 열기" 단축 버튼을 탑재했습니다.
  * **홈 스튜디오 연동 및 빌드 최적화**: 뮤직 스튜디오 메인 화면(`/studio/music/page.tsx`)에 "Cre Music 플레이어" 카드 및 퀵 메뉴 링크를 탑재했습니다. `lucide-react` 라이브러리의 버전 차이로 인한 `FolderMusic` 아이콘 미탑재 에러를 `Music` 아이콘으로 대체하여 TypeScript 컴파일 검증을 성공적으로 마쳤습니다.
* **관련 문서**:
  * [cre-music.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music.md) (Cre Music 플레이어 - 운영 가이드)
  * [cre-music-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music-design-spec.md) (Cre Music 플레이어 - 설계 사양서)
  * [cre-music.md (페이지 명세)](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/studio/cre-music.md) (Cre Music 플레이어 - 페이지 명세서)
  * [endpoints.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/endpoints.md) (API 엔드포인트 세부 명세)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)되도록 Fallback을 설계했습니다. 또한 최신 드라이브 업로드 상태를 반영할 수 있는 실시간 "동기화(Refresh)" 및 "드라이브 열기" 단축 버튼을 탑재했습니다.
  * **홈 스튜디오 연동 및 빌드 최적화**: 뮤직 스튜디오 메인 화면(`/studio/music/page.tsx`)에 "Cre Music 플레이어" 카드 및 퀵 메뉴 링크를 탑재했습니다. `lucide-react` 라이브러리의 버전 차이로 인한 `FolderMusic` 아이콘 미탑재 에러를 `Music` 아이콘으로 대체하여 TypeScript 컴파일 검증을 성공적으로 마쳤습니다.
* **관련 문서**:
  * [cre-music.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music.md) (Cre Music 플레이어 - 운영 가이드)
  * [cre-music-design-spec.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/cre-music-design-spec.md) (Cre Music 플레이어 - 설계 사양서)
  * [cre-music.md (페이지 명세)](file:///Users/a1234/Local%20Sites/creaibox/docs/pages/studio/cre-music.md) (Cre Music 플레이어 - 페이지 명세서)
  * [endpoints.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/endpoints.md) (API 엔드포인트 세부 명세)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)

  
### 🗓️ 2026-06-16 (화)
#### 1. Supabase Storage ➡️ Google Drive (20TB) 이미지 스토리지 전환 및 마이그레이션
* **구현 요약**: Supabase 무료 티어 스토리지의 한계(용량 및 요금)를 극복하기 위해, 본인의 20TB 개인 구글 드라이브 공간을 백엔드에서 위임 권한(OAuth 2.0 Refresh Token)으로 다이렉트 연동하는 아키텍처를 도입했습니다.
* **작업 상세**:
  * **API 라우트 구축**: WebP 압축 최적화(Sharp) 후 구글 드라이브 API로 업로드하고, 오류 시 Supabase Storage로 자동 백업(Fallback)되는 수동 이미지 업로드 API(`/api/image-upload`) 및 AI 생성 이미지 저장 API(`/api/image-studio/generate`)를 신설 및 통합하였습니다.
  * **전체 마이그레이션**: Supabase Storage 버킷 내에 업로드되어 있던 기존 블로그 이미지/썸네일 24개를 구글 드라이브 폴더(`creaibox-blog-images`)로 모두 무손실 이전하였습니다.
  * **DB URL 패치**: 데이터베이스 내 `generated_images.image_url` 필드 및 블로그 포스트 본문 내 Supabase 이미지 주소를 구글 Fife 고속 CDN 주소 체계(`https://lh3.googleusercontent.com/d/[FILE_ID]`)로 일괄 치환했습니다.
  * **GCP 권한 상시 유지 설정**: 구글 클라우드 콘솔의 OAuth 앱 게시 단계를 `프로덕션 단계`로 전환하여 7일 후 리프레시 토큰이 자동 만료되는 이슈를 완벽하게 방지했습니다. (안심하고 상시 무인 업로드가 가능합니다.)
  * **Supabase RLS 조회 권한 수정**: 비로그인 외부 방문자가 블로그 글에 접속했을 때도 썸네일 이미지를 정상적으로 불러올 수 있도록 `generated_images` 테이블 및 `generated-images` 스토리지 객체에 대해 비로그인 및 외부 사용자 공개 조회(SELECT) RLS 정책을 수립했습니다.
* **관련 문서**:
  * [google-drive-integration.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/google-drive-integration.md) (구글 드라이브 연동 아키텍처 및 설정 가이드)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 및 소스 변경점 상세)

#### 2. Google Imagen 3 및 Veo 비디오 생성 API 연동
* **구현 요약**: 이미지 스튜디오에 구글의 최신 이미지 모델 Imagen 3 API를, 비디오 스튜디오에 동영상 생성 모델 Veo API를 연동하여 백엔드 및 UI 연동을 완벽히 마쳤습니다.
* **작업 상세**:
  * **Imagen 3 연동**: `/api/image-studio/generate` 라우트에서 `imagen-3.0-generate-002` 모델 감지 시 구글 AI Studio의 `:predict` REST 엔드포인트를 직접 호출하는 구조를 개발했습니다. 에셋 비율 매퍼(`getImagenAspectRatio`)를 적용하고, 생성된 바이너리를 Sharp로 압축하여 Supabase Storage에 저장하도록 맞췄습니다. 이미지 스튜디오 상수(`blogImageConstants.ts`)에 Google Imagen 3를 정식 옵션으로 등록했습니다.
  * **Veo 비디오 연동**: 비디오 에디터용 비동기 동영상 생성 라우트(`/api/video-studio/generate`) 및 폴링 작업 조회 라우트(`/api/video-studio/operations/[operationId]`)를 새로 개설했습니다. 생성 작업이 완료(`done: true`)되면 비디오 임시 파일 메타데이터에서 `downloadUri`를 획득해 버퍼를 받고, 이를 Supabase Storage `community` 버킷에 MP4 비디오 형식으로 업로드하여 public 주소를 반환합니다.
  * **비디오 에디터 AI Assets UI 갱신**: `VideoEditorAiAssetsPanel.tsx` 상단에 "Google Veo AI 비디오 메이커" 입력 양식 및 화면 비율 선택 필드를 추가했습니다. 생성 시작 시 상태 바 노출과 5초 주기의 비동기 폴링을 연계하고, 완료 시 생성된 AI 비디오 클립을 타임라인 및 에셋 라이브러리에 자동으로 밀어 넣는 통합 흐름을 구현했습니다.
  * **화이트리스트 보안 결합**: `/api/video-studio/*` 하위의 모든 생성 및 조회 진입점에 화이트리스트 이메일(`ALLOWED_TESTER_EMAILS`) 검증 필터를 적용하여 클로즈 테스팅 기간 중의 오남용을 원천 차단했습니다.
* **관련 문서**:
  * [devlog.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/devlog.md) (본 개발일지)
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 및 소스 변경점 상세)

---

### 🗓️ 2026-06-15 (월) - 어제
#### 1. 다중 서브도메인 브랜드 ID 및 커스텀 도메인 관리 기능 고도화
* **구현 요약**: 다중 브랜드 운영 및 개별 커스텀 도메인 관리를 지원하기 위해 데이터베이스, 백엔드 및 프론트엔드 기능을 대대적으로 확장 및 리팩토링했습니다.
* **작업 상세**:
  * **어드민 브랜드 콘솔 리팩토링**: 어드민 테이블을 기존 사용자 기준에서 **서브도메인(Brand ID) 기준으로 확장(1행 1서브도메인)**하여 출력하도록 재구축했습니다. 승인, 반려, 도메인 관리 핸들러가 특정 `brandId` 및 접미사 flat key를 타겟하도록 세분화했습니다.
  * **블로그 대시보드 다중 브랜드 선택기**: 상단에 **"관리할 블로그 선택"** 드롭다운을 탑재하여 사용자가 여러 블로그 설정을 간편하게 스위칭하며 관리할 수 있게 하였습니다. (블로그 타이틀, 테마 컬러 등이 선택된 브랜드 ID별 접미사 키로 `extra_configs`에 격리 저장됨)
  * **마이페이지 브랜드 신청 취소 및 타겟팅**: 승인 완료 대기 중인 서브도메인 목록에 **"신청 취소"** 버튼을 추가하고, 커스텀 도메인 연결 시 어떤 서브도메인 브랜드에 매핑할지 직접 선택할 수 있도록 드롭다운을 지원했습니다. 가비아, Vercel 등 외부 도메인 등록처 퀵 링크 가이드도 탑재했습니다.
  * **공개 블로그 라우팅 및 Canonical URL 동기화**: `brand/[brand_id]` 등에서 subdomains 배열과 profiles의 메인 `brand_id`를 모두 탐색하여 유연하게 호스트를 연계하도록 수정했으며, Tiptap 에디터의 Canonical URL 지정 패널 및 미리보기 버튼에서 커스텀 도메인이 적용된 실주소를 바로 canonical 대상으로 잡도록 동기화했습니다.
* **관련 문서**:
  * [walkthrough.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/walkthrough.md) (작업 히스토리 상세)
  * [blog-subdomains-schema.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/blog-subdomains-schema.md) 및 [blog-subdomains.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/blog-subdomains.sql) (서브도메인 스키마 및 마이그레이션 SQL)

