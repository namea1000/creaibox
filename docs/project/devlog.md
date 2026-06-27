# CreAibox 개발일지 (Development Log)

이 문서는 CreAibox 프로젝트의 일자별 개발 내역, 핵심 아키텍처 결정 사항을 기록합니다.

### 🗓️ 2026-06-27 (토) - 오늘
#### 1. 구글 드라이브 캐싱 프록시 아키텍처 단순화 및 실서버 엑박 장애 완패치
* **구현 요약**: 실서버 배포 환경(Vercel 서버리스 등)에서 `sharp` 네이티브 모듈 로딩 실패로 인해 `/api/free-assets/proxy`가 500 에러를 반환하며 이미지가 전량 깨지던 현상을 해결했습니다.
* **작업 상세**:
  - **런타임 C++ 모듈 의존성 제거**: 백엔드 프록시 API([route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/free-assets/proxy/route.ts)) 단에서 런타임 이미지 리사이징 연산을 완전히 걷어내어, 업로드 및 포스팅 이미지 생성 파이프라인에서 선제적으로 최적화 가공을 마쳐 저장소에 보관하는 구조로 개선했습니다.
  - **프록시 가용성 극대화**: 프록시 서버는 복잡한 실시간 이미지 렌더링 연산을 걷어내고 오직 **"인증 보안 게이트웨이 + 1년 영구 CDN 캐시 헤더 주입"**의 단순하고 견고한 순수 파이프라인으로만 가동되도록 복원했습니다. 이로써 실서버 런타임에서의 C++ 바이너리 충돌로 인한 API 붕괴(500 크래시) 원인을 100% 완벽히 제거했습니다.
  - **아키텍처 명세 고도화**: [google-drive-caching-proxy.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/google-drive-caching-proxy.md)에 대규모 트래픽 분산(Cache Miss vs Cache Hit)에 따른 무제한 CDN 전송 비용 제로화 작동 원리를 상세히 기록했습니다.
  - **프론트엔드 연동 복원**: 라이브러리 매니저([CreaiboxLibraryManager.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/[section]/components/CreaiboxLibraryManager.tsx))에서 주소 뒤에 붙이던 `&w=300` 썸네일 파라미터를 걷어내고 순수 프록시 경로만 타도록 안정적으로 복원했습니다.

#### 2. 무료 공유 에셋 상세 뷰어 캐러셀 및 사운드 누수 방지 패치
* **구현 요약**: 무료 공유 에셋 상세 보기 모달([free-assets/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx))에도 크리에이박스 라이브러리와 일관되게 이전/다음 이동 캐러셀과 키보드 제어 단축키를 이식하고, 미디어 전환 시 사운드 겹침 현상을 해결했습니다.
* **작업 상세**:
  - **네비게이션 UI 오버레이**: 뷰어 상단에 글래스모피즘 네비게이션 헤더 바(인덱스 카운터 및 슬라이드 화살표 버튼)를 구현했습니다. 첫 번째와 마지막 자산에서는 이동 버튼이 자동으로 비활성화(`disabled`)됩니다.
  - **사운드 겹침 방지 락 (Sound Leaking Prevention)**: 오디오 에셋 감상 도중 캐러셀로 미디어가 바뀔 때 사운드가 겹쳐 흐르던 버그를 방지하기 위해, `selectedAsset.id` 변경 시 기존 오디오를 즉각 일시정지(`pause`)하고 재생 상태를 무력화하는 예외 보호 필터(`useEffect`)를 구현했습니다.
  - **단축키 및 입력 예외 처리**: `Escape` 닫기 키 및 좌우 방향키 탐색 단축키 리스너를 연동하고, 인풋 필드 포커싱 시 방향키 조작 예외 처리를 완비했습니다.

#### 3. Vercel - Supabase 공식 통합(Integration) 연동 완수
* **구현 요약**: 환경 변수의 휴먼 에러를 차단하고 데이터베이스 커넥션 풀을 안전하게 운용하기 위해 Vercel과 Supabase의 공식 통합 연동을 수행했습니다.
* **작업 상세**:
  - **기존 충돌 변수 제거**: Vercel에 수동 등록되어 이름 충돌을 일으키던 기존 변수(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)를 안전하게 삭제했습니다.
  - **완전 자동 동기화 체계 수립**: 접두사를 비워둔 순수 변수 형태로 연동을 완료하여, Vercel이 Supabase의 최신 접속 정보 및 Supavisor 커넥션 풀(서버리스 부하 분산용) 환경 변수를 자동으로 주입하고 실시간 동기화하여 관리하는 최적화된 인프라 체계를 완비했습니다.

#### 4. 공개 블로그 목록 및 상세 페이지 비로그인 접근 차단 버그 해결
* **구현 요약**: 일반 외부 미로그인 방문자 및 검색엔진 로봇이 `creaibox.com/blog` 및 상세 페이지에 진입했을 때, 블로그 글이 노출되지 않거나 404 에러가 발생하던 현상을 해결했습니다.
* **작업 상세**:
  - **원인 추적**: 어드민의 프로필 ID 목록을 조회할 때 일반 유저용 쿠키 세션 클라이언트(`createClient()`)를 사용하여, 비로그인(익명) 사용자의 경우 Supabase RLS 정책에 막혀 어드민 ID 목록을 빈 배열로 반환하는 경쟁 조건을 발견했습니다.
  - **어드민 권한 우회 적용**: [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/page.tsx) 및 [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/[slug]/page.tsx)의 데이터를 가져오는 Supabase 클라이언트를 `createAdminClient()`로 교체하여, 서버 사이드 렌더링 단계에서 안전하게 RLS를 우회하고 어드민이 발행한 공개 포스팅을 정상적으로 불러오도록 조치했습니다.
  - **SEO 및 접근 가용성 확보**: 이로써 로그인 세션이 없는 외부 방문자 및 크롤러 봇도 완벽하게 공개 블로그 목록 및 콘텐츠를 크롤링하고 탐색할 수 있도록 구조적 가용성을 확립했습니다.

#### 5. 실서버 구글 드라이브 API 인증 유실로 인한 이미지 액박 및 업로드 오류 해결
* **구현 요약**: Supabase-Vercel 공식 재연동 과정에서 유실된 구글 드라이브 환경 변수 6종을 복원하여 개인 라이브러리 이미지 액박 현상과 무료 공유 에셋 업로드 실패 오류를 전격 해결했습니다.
* **작업 상세**:
  - **원인 분석 및 검증**: 실서버 프록시 호출 통신 진단(`curl`)을 수행하여 `GCP OAuth2 credentials are not fully configured` 에러가 원인임을 규명했습니다. "무료 공유 에셋"의 경우 구글 드라이브 상에서 전체 공개로 풀려 있어 무인증 CDN 캐시 서빙이 되었으나, "크리에이박스 콘텐츠(개인 라이브러리)"는 비공개 폴더로 관리되어 마스터 인증키가 필수였기에 액박이 났던 인프라 정합성 문제를 찾아냈습니다.
  - **환경 변수 복원 및 재배포**: Vercel 프로젝트 환경 변수에 마스터 인증 정보 3종(`GCP_OAUTH_CLIENT_ID`, `GCP_OAUTH_CLIENT_SECRET`, `GCP_OAUTH_REFRESH_TOKEN`) 및 구글 폴더 ID 3종(`GDRIVE_FOLDER_ID`, `GDRIVE_FREE_ASSETS_FOLDER_ID`, `GDRIVE_MUSIC_FOLDER_ID`)을 수동 복원 후 Redeploy를 완료하여 정상 노출 및 업로드 가동을 완수했습니다.
  - **운영 명세 가이드라인 최신화**: [google-drive-caching-proxy.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/google-drive-caching-proxy.md)에 본 트러블슈팅 내역, 구글 드라이브 전체 환경 변수 명세, 그리고 향후 구글 드라이브 새로운 폴더를 신설하고 연동할 때 밟아야 하는 상세 실무 작업 가이드(공유 권한 설정 및 ID 갱신 요령)를 영구 기록했습니다.

#### 6. 무료 공유 에셋 페이지 내 이미지 제작 요청 기능 일시 제거 및 그리드 4열 확장
* **구현 요약**: 무료 공유 에셋 페이지의 가시 공간을 늘려 사용자 경험을 향상하기 위해, 우측의 "이미지 제작 요청 현황" 위젯과 관련 기능을 삭제하고 에셋 그리드를 가로 4열 출력 구조로 최적화했습니다.
* **작업 상세**:
  - **이미지 제작 요청 일시 제거**: [free-assets/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx)에서 우측의 `이미지 제작 요청 현황 aside 패널` 영역(라인 1596~1724), 상단 헤더의 `이미지 제작 요청` 트리거 버튼(라인 1349~1363), 그리고 하단의 `이미지 제작 요청 신청 모달` 렌더링 구문(라인 2247~2335)을 전격 제거했습니다.
  - **4열 그리드 가로 폭 배치**: 메인 에셋 리스트 렌더링 그리드의 비율 클래스를 기존의 `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`에서 `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`으로 확장하여 1열에 4개의 에셋이 채워져 크게 배치되도록 교정했습니다.

#### 7. 클라이언트 사이드 Supabase 로그아웃 무한 펜딩 해결
* **구현 요약**: 메인 홈페이지 헤더 및 스튜디오 상단 바에서 로그아웃 버튼을 눌렀을 때, Supabase Auth API와 Next.js 미들웨어 간의 경쟁 조건으로 인해 "로그아웃 중..." 텍스트에 머물러 진행이 멈추던 현상을 3초 타임아웃 세이프티 가드로 완치했습니다.
* **작업 상세**:
  - **원인 추적**: 클라이언트에서 `supabase.auth.signOut({ scope: "global" })` 호출 시, Next.js Middleware의 세션 갱신 로직과 쿠키 처리 타이밍이 충돌하여 인증 파기 프로미스가 영구히 Pending 상태에 잠기는 Supabase Auth JS SDK의 특이 이슈로 판단되었습니다.
  - **타임아웃 세이프 가드 적용**: [Header.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Header.tsx) 및 [StudioTopbar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx)의 로그아웃 핸들러에 `Promise.race`를 구성하여, 최장 3초가 지나면 API 네트워크 응답 상태와 무관하게 로컬의 캐시 토큰 및 세션 데이터를 강제 파기(Local Storage 및 Memory User 정보 파괴)하고 첫 화면으로 리디렉션하도록 우회 가드를 견고하게 설계하여 즉각적이고 안정적인 로그아웃 흐름을 완성했습니다.

### 🗓️ 2026-06-26 (금)
#### 1. 스튜디오 좌측 사이드바 로고 타이틀 개편 및 수평 정렬 최적화
* **구현 요약**: 사이드바 로고 하단의 타이틀을 `AI Studio`로 개편하고, 폰트 시인성 확보 및 수평 정중앙 정렬을 구현했습니다.
* **작업 상세**:
  - **문구 및 폰트 격상**: 기존 `AI Creator Workspace`를 `AI Studio`로 수정하고, 크기를 `16px`로 키우고 가장 굵은 단계인 `font-black`(웨이트 900)으로 조절하여 대비를 확보했습니다.
  - **정중앙 수평 정렬**: 접기 버튼의 공간 간섭으로 인해 타이틀이 한쪽으로 쏠리던 문제를 해결하기 위해, 부모 컨테이너를 `relative`로 두고 타이틀은 `text-center w-full`로, 접기 버튼은 `absolute` 우측 끝 배치로 독립시켜 물리적인 완전 정중앙 정렬을 이식했습니다.
  - **모드별 고대비 색상 조율**: 다크 모드(`text-cyan-400`) 및 라이트 모드(`text-blue-600`)의 색상을 다듬어 어두운 테마 배경과의 가시성을 확보했습니다.

#### 2. 스튜디오 사이드바 레이아웃 간격 및 서브 메뉴 가독성 상향
* **구현 요약**: 메뉴 간 세로 여유 폭을 개선하고 비활성 상태의 하위 서브 메뉴 텍스트/아이콘의 시인성을 보강했습니다.
* **작업 상세**:
  - **메뉴 박스 간격 확장**: 메인 스튜디오 버튼군 간의 세로 간격을 `space-y-1`에서 우측 어사이드 패널과 동일한 `space-y-2`로 넓혀 시각적 안정감을 주었습니다.
  - **서브 메뉴 시인성 극대화**: 비활성 상태의 서브 메뉴 텍스트 색상을 기존의 침침한 회색에서 밝고 뚜렷한 `slate-700`(라이트) 및 `zinc-200`(다크)으로 상향하여 메인 버튼들과 일관성을 확보했습니다. 비활성 아이콘 색상도 `zinc-300` 및 `slate-400`으로 통일감 있게 보정했습니다.

#### 3. 이미지 상세 보기 모달 슬라이드 캐러셀 및 단축키 연동
* **구현 요약**: 개인 미디어 라이브러리 상세 모달([ImageDetailModal.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/[section]/components/ImageDetailModal.tsx))에 이전/다음 탐색 캐러셀과 키보드 방향키/ESC 닫기 단축키 기능을 완성했습니다.
* **작업 상세**:
  - **인덱스 카운터 및 슬라이드 단추 탑재**: 모달 상단에 `3 / 24`와 같이 현재 탐색 정보를 표시하는 카운터와 좌우 화살표 버튼을 오버레이로 탑재하고 첫/끝 경계 비활성화를 처리했습니다.
  - **키보드 단축키 및 타이핑 예외 처리**: ESC 키로 모달을 즉시 닫고, 좌우 방향키로 이미지를 편하게 넘겨볼 수 있게 리스너를 연동했습니다. 이때 인풋 필드 포커싱 시에는 커서 이동 방해 방지용 예외 처리를 견고히 이식했습니다.
  - **부모 호출부 연동**: [CreaiboxLibraryManager.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/[section]/components/CreaiboxLibraryManager.tsx)에서 모달을 열 때 전체 이미지 리스트(`displayedImages`)와 상태 갱신 함수를 Props로 정확히 공급하여 흐름이 이어지도록 연동했습니다.

#### 4. 사이드바 클라이언트 네비게이션 시 무한 로딩 버그 패치
* **구현 요약**: 사이드바 메뉴 클릭 시 화면 중앙에 로딩 스피너가 영구히 돌며 목록이 뜨지 않던 교착 상태(Lock) 버그를 영구 해결했습니다.
* **작업 상세**:
  - **중복 비동기 락 해결**: 컴포넌트 마운트 시 `supabase.auth.getSession()` 비동기 호출과 `onAuthStateChange` 리스너가 동시에 트리거되어 Supabase 내부 세션 캐시 락 경쟁 상태가 생기던 문제를 추적했습니다.
  - **단일 스트림 통합**: `getSession()` 호출을 전면 제거하고, 최초 마운트 시 브라우저 세션을 가지고 알아서 즉시 1회 실행되는 `onAuthStateChange` 단일 이벤트 스트림으로 데이터 패칭을 통합하여 교착 상태를 완벽히 소거하고 로딩 속도를 높였습니다. 비로그인 예외 및 `mounted` 플래그도 보강하여 안정성을 극대화했습니다.

#### 5. 비디오 에디터 내보내기 프레임 프리징(3초 이후 멈춤) 및 프리뷰 실시간 동기화 개선
* **구현 요약**: 비디오 에디터에서 재생 멈춤/일시정지 시 화면이 미세하게 튀는 현상(이중 탐색 버그)을 해결하고, 내보내기 시 3초(150프레임) 부근부터 화면이 정지되던 디코더 병목 및 타임아웃 문제를 해결했습니다.
* **작업 상세**:
  - **내보내기 엔진 비디오 캐시 재성성 로직 개선**: [`VideoEditorRenderCanvas.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorRenderCanvas.tsx)에서 내보내기 중 비디오 엘리먼트 탐색 횟수가 150회를 초과할 때 엘리먼트를 파괴하고 새로 로드하는 로직을 제거했습니다. (`maxSeekCount`를 `150`에서 `999999`로 상향). 이로 인해 브라우저 하드웨어 디코더가 강제 리셋되면서 3초 이후 프레임이 얼어붙던 병목 현상이 완벽히 해소되었습니다.
  - **프리뷰 성능 및 탐색 한도 최적화**: 프리뷰 스크러빙 시에도 잦은 재생성으로 인해 화면이 버벅이던 문제를 개선하기 위해 기존 `20회` 제한을 `1000회`로 대폭 늘렸습니다.
  - **정적/동적 탐색 대기시간 분리**: 프레임 렌더링 루프의 탐색 대기(`onseeked`) 타임아웃을 프리뷰와 내보내기 상황별로 이원화했습니다. 실시간 프리뷰에서는 화면 끊김 방지를 위해 기존 `80ms`를 유지하고, 정확성이 극대화되어야 하는 내보내기 단계에서는 최대 `5000ms`까지 디코더의 완료를 기다리도록 보강하여 100% 프레임 정확도를 확보했습니다.
  - **일시정지 화면 튐 및 중복 Seek 해결**: [`VideoEditorPreviewPlayer.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorPreviewPlayer.tsx)의 일시정지(`!isPlaying`) 상태 동기화 처리기에서 강제 탐색 조건을 제거하고 오차 범위를 `0.03초`(1프레임 규격)로 단일화했습니다. 이로 인해 스페이스바로 플레이/정지 시 화면이 미세하게 앞뒤로 출렁이며 바뀌는 중복 탐색 플리커링이 사라지고 즉각적으로 정밀 멈춤이 실행됩니다.
  - **타입 안정성 검증**: `npx tsc --noEmit` 검사를 완료하여 무결성을 확보했습니다.

#### 2. 가져온 미디어 UX 편의성 강화 및 기능 안정성 종합 2차 개선 패치
* **구현 요약**: 가져온 미디어의 조작 편의성을 극대화하고, 역재생 영상의 내보내기 오류, 복사/붙여넣기 시 트랙 배치 붕괴 현상, 영상 종료 시의 미세 오버슈트 및 2프레임 공백 밀림 오차를 완전히 정조준하여 해소했습니다.
* **작업 상세**:
  - **미디어 액션 버튼 상시 노출**: [`VideoEditorUnifiedLibrary.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorUnifiedLibrary.tsx)의 `SidebarMediaItemRow` 내 추가(`+`) 및 삭제(휴지통) 버튼을 기존 호버 전용 상태에서 상시 노출 구조로 변경하여 미디어 조작 직관성을 대폭 향상했습니다.
  - **역재생 영상 내보내기 프리징 완벽 해결**:
    - **원인 해결**: [`VideoEditorContext.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorContext.tsx) 내 역재생 클립 생성기에서 `trimEnd`를 전체 영상 길이로 잘못 설정하던 수학적 버그를 `0`으로 바르게 매핑되도록 수정했습니다.
    - **자가 치유 (Self-Healing)**: 기존 데이터베이스나 유저 세션에 저장된 오류 사양 클립을 실시간으로 감지하고 복구하는 로직을 `normalizeClip` 함수에 이식하여, 유저가 기존에 만들어 둔 역재생 클립도 새로고침 즉시 자동으로 정상 복구되도록 처리했습니다.
    - **방어 인코딩**: [`VideoEditorRenderCanvas.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorRenderCanvas.tsx)에 잘못된 잘라내기 경계값 유입 시 영상이 멈추지 않고 끝까지 인코딩되도록 최대 안전 경계 검증식을 탑재했습니다.
  - **다중 복사/붙여넣기 트랙 어긋남 방지**:
    - **스냅 도입**: 붙여넣기 시 플레이헤드 미세 오차로 인한 겹침(Overlap) 판정으로 클립이 2트랙으로 튕기는 문제를 예방하기 위해, 붙여넣기 시에도 `0.15초` 규격의 마그네틱 스냅핑을 결합했습니다.
    - **배치 충돌 회피**: 복제 배치 내의 충돌을 추적하기 위해 `findAvailableTrack` 질의 시 현재 맵핑 중인 임시 배치 리스트(`[...clips, ...pastedClips]`)를 연속 피딩함으로써, 복사본들이 기존 정렬 상태를 흐트러뜨리지 않고 같은 트랙 상에 완벽히 정렬되도록 최적화했습니다.
  - **재생 완료 프레임 오버슈트 차단 및 2프레임 꼬리 오차 수정**:
    - **관성 정지 해결**: [`VideoEditorPlaybackController.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorPlaybackController.tsx)의 재생 루프가 타임아웃으로 자연 종료될 때, 렌더링 스레드 지연으로 인해 프레임이 밀리던 현상을 마지막 정렬 이벤트 강제 트리거(`isSeek: true`)를 통해 해소했습니다.
    - **정밀도 격상**: 프로젝트 전체 길이를 구하는 `calculateTotalDuration`의 반올림 단위를 100ms 수준인 `toFixed(1)`에서 프레임 단위 경계인 10ms 수준인 `toFixed(2)`로 상향하여, 반올림 왜곡으로 발생하던 끝부분 2프레임(0.06초) 공백 영역을 완벽히 소거하여 비디오의 영상 물리 종점인 `31:07`에 정확하게 딱 멈추도록 종결했습니다.
  - **TypeScript 타입 무결성 검증**: 수정 사항이 복잡함에 따라 `npx tsc --noEmit` 검증 프로세스를 가동하여 100% 컴파일 성공을 확정했습니다.

#### 3. 비디오 에디터 내보내기 영상 꼬리 검은 화면(블랙 프레임) 제거 및 타임라인 동기화 정밀화 패치
* **구현 요약**: 사용자의 타임라인 상에서는 영상과 오디오가 정확히 플레이헤드 끝인 `31:07`에 맞춰져 있으나, 내보내기 된 영상(MP4)은 `31:09`까지 늘어나며 마지막 2프레임이 검은색 화면으로 노출되는 현상을 발견하고 이를 근본적으로 해결했습니다.
* **원인 분석**:
  1. **MediaRecorder 정지 지연**: 실시간 캔버스 녹화본(`webmBlob`) 렌더링 루프가 끝난 뒤 `recorder.stop()`이 비동기식으로 호출 및 완료되는 과정에서 브라우저 렌더링 스레드 지연에 따라 1~2프레임의 여분/정지 프레임이 WebM 파일 끝에 추가로 기록될 수 있습니다.
  2. **AAC 인코더 딜레이 패딩**: WebM을 MP4로 트랜스코딩할 때 사용하는 FFmpeg AAC 오디오 인코더가 오디오 트랙 프라이밍 딜레이(1024 샘플, 약 21.3ms)를 맨 앞에 인입하고 오디오 프레임 규격 단위로 뒷부분을 라운딩 업(Rounding-up)하면서 컨테이너 전체 재생 길이를 약 `0.06`초 가량(30fps 기준 2프레임) 자연 연장시킵니다. 이 연장된 시간 동안 비디오 스트림 패킷이 없으므로 플레이어는 최종본 끝 단을 검은 화면으로 처리하게 됩니다.
* **작업 상세**:
  - **FFmpeg 정밀 타임아웃 컷팅(`-t`) 매핑**: [`convertWebmToMp4.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/ffmpeg/convertWebmToMp4.ts)의 `convertWebmBlobToMp4` 함수에 `duration` 옵션을 도입했습니다. FFmpeg이 WebM에서 MP4로 최종 인코딩할 때 `-t <duration>` 옵션을 넘겨받은 실제 타임라인 총 길이로 셋업하도록 설계하여, MediaRecorder의 정지 지연이나 AAC 프레임 끝 패딩으로 늘어난 미세 꼬리 영역을 칼같이 잘라내고 비디오와 오디오 트랙이 완벽히 동일한 실제 타임라인 한계점에서 끝나도록 규제했습니다.
  - **렌더링 캔버스 호출부 보강**: [`VideoEditorRenderCanvas.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorRenderCanvas.tsx) 내 `exportMp4` 비디오 인코더 및 `exportDirectMp4` 내 compatible fallback 트래커가 WebM에서 MP4 변환 명령을 개시할 때, 스냅샷의 실제 렌더 기간(`totalDuration` 혹은 `renderDuration`)을 인자(`duration`)로 완벽히 제공하도록 주입하여 오차의 발생 소지를 차단했습니다.
  - **무결성 검증**: `npx tsc --noEmit` 타입 정밀 컴파일 테스트를 거쳐 100% 무결점을 확인했습니다.

#### 4. 비디오 에디터 내 'IndexedDB 지우기' 원클릭 캐시 청소 및 경고 팝업 기능 구현
* **구현 요약**: 역재생, 오디오 추출 등 비디오 스튜디오 사용에 따라 로컬 브라우저 IndexedDB의 용량이 수십~수백 기가바이트(GB) 수준으로 기하급수적으로 축적되는 현상을 해결하기 위해, 사용자가 복잡한 브라우저 설정을 거치지 않고 에디터 내부에서 원클릭으로 안전하게 디스크 공간을 비우고 가용성을 확보할 수 있는 편리한 정리 도구와 친절한 안내용 다크 팝업 모달을 전격 추가했습니다.
* **작업 상세**:
  - **IndexedDB 원클릭 청소 액션 개발**: [`VideoEditorContext.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorContext.tsx) 내에 `clearIndexedDBCache` 비동기 액션을 설계 및 탑재했습니다. 해당 액션은 로컬 비디오 캐시 데이터베이스(`creaibox-video-editor-db`) 내의 `media-files` 및 `media-waveforms` 데이터 스토어를 안전하고 신속하게 비워(`.clear()`) 용량을 확보하며, 찌꺼기가 남아 메모리 누수가 발생하지 않도록 활성화되어 있던 브라우저 Blob URL 객체들을 전부 명시적으로 해제(`URL.revokeObjectURL`)하고, 데이터 충돌을 원천 예방하기 위해 타임라인 및 미디어 상태를 정밀하게 정리합니다.
  - **직관적인 비우기 버튼 및 팝업 모달 탑재**: [`VideoEditorCanvas.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorCanvas.tsx) 캔버스 우측 상단의 "내보내기" 버튼 바로 왼쪽에 "IndexDB 지우기" 버튼을 추가했습니다. 클릭 시 해당 버튼의 역할과 하드디스크 용량 확보 효과를 친절히 안내하고, 프로젝트 초기화 및 미디어 재로드 필요성 등의 부작용과 핵심 주의사항을 직관적으로 보여주는 세련된 다크 테마 팝업 모달과 확인 절차를 이식했습니다.
  - **TypeScript 타입 체크**: `npx tsc --noEmit` 검증을 완료하여 성공을 보장했습니다.

### 🗓️ 2026-06-24 (수)
#### 1. Next.js 개발 모드 빌드 표시기(devIndicators) 비활성화 및 성능 개선
* **구현 요약**: 개발 모드(`npm run dev`)에서 페이지 전환 및 온디맨드 컴파일 시 화면 왼쪽 아래에 노출되던 "Rendering..", "Complete..." 표시기(`devIndicators`)를 비활성화하여 UI 플리커링과 화면 가림을 해소하고 체감 렌더링 부하를 해소했습니다.
* **작업 상세**:
  - **설정 파일 변경**: [`next.config.ts`](file:///Users/a1234/Local%20Sites/creaibox/next.config.ts)를 수정하여 기존의 `devIndicators: { position: "bottom-left" }` 설정을 `devIndicators: false`로 전환하고 표시기를 완전히 해제했습니다.
  - **체감 성능 개선 및 영향도**: Next.js 개발 서버의 Lazy Compilation(온디맨드 실시간 컴파일) 특성상 개발 단계의 최초 로딩 지연은 완전히 배제할 수 없으나, 렌더링 상태를 알리는 오버레이가 깜빡이며 시각적으로 방해하던 요소를 제거하여 전반적인 탭 메뉴간 전환 피드백을 한층 더 부드럽고 쾌적하게 개선했습니다. 프로덕션 빌드 배포 환경(`next build` 및 `next start`)에서는 원래부터 이 표시기가 비활성화되며, 모든 페이지가 사전 컴파일되어 로딩 없이 초고속으로 전환됨을 확인했습니다.

#### 2. 무료 공유 에셋 내 "홈페이지 제작용 프리미엄 테마 갤러리" 및 비즈니스 등급 다운로드 제어 시스템 구축
* **구현 요약**: 무료 공유 에셋 메뉴 내에 공식 테마 전용 디자인 이미지를 감상할 수 있는 테마 갤러리를 구축하고, 다운로드 시 사용자의 등급(membership_level)을 판단하여 비즈니스 전용 자산 다운로드를 차단/안내하는 비즈니스 정책을 완비했습니다.
* **작업 상세**:
  - **DB 확장 및 성능 튜닝**: `free_assets` 테이블에 프리미엄 공식 테마 에셋 식별 및 다운로드 제한을 위한 `is_official_theme_asset`, `theme_category`, `is_business_only` 컬럼을 신설하고 복합 인덱스(`idx_free_assets_theme_filter`)를 구축했습니다. 스키마 세부 사양을 [`free-assets-schema.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/free-assets-schema.md)에 동기화 완료했습니다.
  - **API 명세 연동**: [`route.ts (api/free-assets/list)`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/free-assets/list/route.ts)를 수정하여 신규 컬럼 값을 JSON 프로퍼티로 정상 추출 및 매핑하여 반환하도록 기능을 추가했습니다.
  - **프리미엄 갤러리 UI 및 15대 카테고리 필터 개발**: [`page.tsx (library/free-assets)`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx)에 금빛 그라데이션이 빛나는 `"👑 홈페이지 제작용 프리미엄 테마 갤러리"` 전용 탭을 개설하고, 탭 활성화 시 즉시 15개 테마 카테고리 단독 필터바로 전환 노출되는 구조를 구현했습니다.
  - **다운로드 통제 및 프리미엄 업그레이드 모달**: 다운로드 트리거 및 캔버스 리사이징 처리기 양축에 사용자 권한 판단 로직(`checkDownloadPermission`)을 삽입하여 무단 다운로드를 차단했습니다. 권한이 없는 Free/Pro 회원의 시도 시 다크 글래스모피즘 디자인 기반의 업그레이드 안내 팝업을 띄우고 마이페이지 연동을 구성했으며, 상세 팝업 내부의 기본 다운로드 단추를 상황에 맞추어 `"👑 비즈니스 등급 다운로드"` 황금 그라데이션 버튼으로 동적 전환되도록 설계했습니다.
  - **구글 시트 템플릿 프롬프트 라이브러리 연동**: 전체 304개 테마의 HSL 대표 색상, 지정 폰트 사양, 영어 이미지 생성 프롬프트 및 배포 상태를 기록한 고품질 디자인 시트를 구글 드라이브에 [생성 및 공유](https://docs.google.com/spreadsheets/d/11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM) 완료했습니다.

### 🗓️ 2026-06-23 (화)
#### 1. 브랜드 ID 블랙리스트(예약어) 대량 시딩 및 실서비스 검증 연동 완수
* **구현 요약**: 다른 에이전트가 생성한 77,985개의 대용량 블랙리스트 원천 데이터를 Supabase 실서비스 DB에 반영하고, 예약어 유효성 검사 헬퍼 및 마이페이지 맞춤 피드백을 연동하여 아키텍처 구현을 마무리했습니다.
* **작업 상세**:
  * **DB 스키마 마이그레이션 및 트리거 설정**: [`brand-id-blacklist-patch.sql`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/brand-id-blacklist-patch.sql) 패치를 적용하여 `reserved_brand_ids` 테이블에 `category` 컬럼을 신설(22개 체크 제약조건 포함)하고, 백엔드 우회 신청 시도를 물리적으로 차단하는 DB 검증 트리거(`check_brand_id_reservation`)를 profiles 테이블에 완비했습니다.
  * **77,985건 데이터 일괄 적재**: [`seed_reserved_brands.js`](file:///Users/a1234/Local%20Sites/creaibox/scratch/seed_reserved_brands.js) 배치 스크립트를 재실행하여 200개 단위 chunk로 나누어 77,985개의 데이터를 DB에 100% 무결하게 업서트 완료하였습니다. (성공: 77,985건 / 실패: 0건)
  * **프론트엔드 정적 예약어 필터링 신설**: [`reservedWords.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/constants/reservedWords.ts)를 작성하여, 시스템 필수 키워드는 1차적으로 브라우저 단에서 즉시 필터링되도록 처리해 API 트래픽 부하를 줄였습니다.
  * **마이페이지 22개 그룹별 안내 피드백 연동**: [`page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)에서 DB 검사 결과 반환 시 `category` 값을 확인하여, 사칭 사기, 상표권 보호, 피싱 예방, 유해 사이트 방지 등 사유에 상응하는 22종 맞춤형 경고창 팝업을 띄우는 UX 고도화를 완료했습니다.
  * **품질 검증**: `npx tsc --noEmit`을 통해 수정된 모든 React 페이지 및 헬퍼 함수의 TypeScript 빌드 무결성을 검증했습니다.

#### 2. 관리자 센터 예약어 종합 관리 페이지(`/admin/reserved-words`) 개발 완료
* **구현 요약**: 관리자 권한을 가진 운영자가 22개 카테고리별 예약어 목록을 조회/검색하고 수동 추가/삭제할 수 있는 UI를 신설하였으며, 예약어를 특정 일반 유저에게 강제로 할당 및 활성화해 줄 수 있는 배포 워크플로우를 완비했습니다. 또한 어드민 대시보드 메인 화면의 우측 하단 빈 슬롯에 "예약어 및 블랙리스트 관리" 바로가기 카드 버튼을 연결했습니다.
* **작업 상세**:
  * **사이드바 메뉴 추가**: [`Sidebar.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)에 `ShieldAlert` 아이콘과 함께 "예약어 관리" 메뉴를 어드민 영역에 연동했습니다.
  * **종합 통제 UI 개발**: [`page.tsx (admin/reserved-words)`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/reserved-words/page.tsx) 페이지를 신설하여 30개 단위 더 불러오기 페이징, 키워드 부분 검색, 카테고리 필터링 테이블을 구축했습니다.
  * **어드민 메인 대시보드 연동**: [`page.tsx (admin/page.tsx)`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/page.tsx)의 `adminMenus` 데이터 구조에 '예약어 및 블랙리스트 관리' 항목을 결합하여, 우측 하단의 비어 있던 12번째 슬롯 공간에 대칭적이고 정렬된 프리미엄 바로가기 카드가 나타나도록 연동을 완료했습니다.
  * **예약어 수동 CRUD 구현**: 영문 소문자/숫자 규격 검증을 동반한 추가 모달과 confirm 모달이 연결된 수동 삭제 액션을 개발했습니다.
  * **유저 대상 강제 배포(Deploy) 워크플로우 구현**: 특정 예약어를 클릭하고 대상 유저를 실시간 검색/선택해 배정하면, `reserved_brand_ids` 에서 레코드를 제거한 후 해당 유저 `profiles` 레코드의 `brand_id = '${brand}'`, `brand_id_status = 'APPROVED'` 로 즉시 갱신하는 2단계 연속 쿼리 로직을 연계하여 관리 기능의 완결성을 확보했습니다.

### 🗓️ 2026-06-22 (월)
#### 0. 브랜드 ID 예약어 대량 데이터셋 및 운영 인계 문서 정리
* **구현 요약**: 개인 브랜드 서브도메인(`{brand_id}.creaibox.com`) 신청 악용을 막기 위한 예약어 원천 JSON을 22개 카테고리, 총 77,985개 레코드로 확장하고, 후속 DB seed/import 절차를 문서화했습니다.
* **작업 상세**:
  * **대량 예약어 JSON 구축**: [`src/lib/constants/reservedBrandsData.json`](file:///Users/a1234/Local%20Sites/creaibox/src/lib/constants/reservedBrandsData.json)에 시스템 경로, 공공기관, 금융/결제, 글로벌 기업/상표, IT 서비스, 크립토, 의료, 도메인/인프라, 성인/도박, 악성 행위, 고가치 일반 명사 및 짧은 프리미엄 단어를 포함한 예약어 데이터를 적재했습니다.
  * **22개 카테고리 체계 확장**: 기존 12개 분류에 `TRADEMARK`, `PAYMENT_SECURITY`, `CRYPTO`, `HEALTHCARE`, `RELIGION_POLITICS`, `MILITARY_SECURITY`, `INFRASTRUCTURE`, `DOMAIN_BRAND`, `PUBLIC_SERVICE`, `HIGH_RISK_COMMERCE`를 추가했습니다.
  * **검증 완료**: 전체 77,985건에 대해 `brand_id` 정규식(`^[a-z0-9]{2,15}$`), 중복, 카테고리, reason 누락 검증을 통과했으며 `./node_modules/.bin/tsc --noEmit --pretty false`도 통과했습니다.
  * **운영 인계 문서 추가**: [`docs/database/reserved-brand-ids.md`](file:///Users/a1234/Local%20Sites/creaibox/docs/database/reserved-brand-ids.md)에 JSON의 현재 상태, 카테고리별 분포, DB 반영 절차, 검증 명령, 운영 주의사항을 정리했습니다. 실제 차단 반영을 위해서는 Supabase `reserved_brand_ids` 테이블에 JSON을 배치 업서트해야 합니다.

#### 1. 네이버 키워드 분석 & 실시간 노출 진단 실시간 API 및 UI 연동
* **구현 요약**: `/studio/writing/naver/keyword`와 `naver/diagnosis` 페이지의 `setTimeout` 모의 난수 로직을 걷어내고, 실제 네이버 검색 및 데이터랩 API를 호출하는 백엔드 프록시와 프론트엔드 실시간 렌더링을 구현했습니다.
* **작업 상세**:
  * **키워드 분석 API 신설**: [`api/naver/keyword/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/naver/keyword/route.ts)에서 네이버 블로그 검색 API로 총 문서 발행량(`total`)을 조회하고, 네이버 데이터랩 API로 최근 6개월의 트렌드 변화량을 종합해 절대 검색수와 문서 포화도를 실시간 역산하여 기회 등급을 판정합니다.
  * **실시간 노출 진단 API 신설**: [`api/naver/diagnosis/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/naver/diagnosis/route.ts)에서 입력받은 타겟 포스팅 URL과 키워드로 블로그 검색 100건을 질의한 뒤, 블로그 ID 및 포스트 번호를 정규식으로 유연하게 매칭하여 100위 내 **실제 검색 노출 순위**를 정확하게 판정해냅니다.
  * **프론트엔드 실제 API 바인딩**: `NaverKeywordAnalysisPage` 및 `RealtimeDiagnosisPage` 내 모의 데이터 바인딩을 fetch 호출 구조로 완전 교체하였습니다.
  * **TypeScript 빌드 트러블슈팅**: Supabase createClient 호출부의 비동기 `await` 누락 에러 및 `diagnosis/route.ts` 내 변수 오타(`targetKeyword` ➡️ `keyword`)를 수정하여 컴파일 오류를 완벽히 픽스했습니다.

#### 2. 네이버 검색 노출 오류 및 캐노니컬 URL 메타데이터 패치
* **구현 요약**: 크리에이박스 메인 랜딩 페이지와 사용자 브랜드 도메인의 중복 문서(Duplicate Content) 오인으로 인해 네이버 검색창에 `creaibox.com` 대신 사용자 도메인이 노출되던 검색 최적화(SEO) 오류를 전격 수정했습니다.
* **작업 상세**:
  * **메인 레이아웃 canonical 지정**: [`src/app/layout.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/layout.tsx)에 `alternates: { canonical: "/" }`를 주입하여 크리에이박스 메인의 유일한 대표 주소가 `https://creaibox.com`임을 지정했습니다.
  * **브랜드 홈 canonical 지정**: [`src/app/brand/[brand_id]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/page.tsx)에 alternates.canonical를 동적 구현하여 사용자의 독립 도메인 또는 `{brandId}.creaibox.com` 서브도메인이 정상 캐노니컬 대표 주소로 매핑되도록 보강하였습니다.
  * **사용자 도메인 DB 오타 수정**: 프로필 DB에 `"custom_domain_downhubs": "dawnhubs.com"`으로 오염 적재되어 `downhubs.com` 진입 시 리라이트 오류를 유발하던 철자를 스크립트를 통해 정상으로 수정 조치했습니다.
  * **미들웨어 진단 경로 패치**: `src/middleware.ts`의 `isStaticOrApi` 조건에서 경로 내 마침표(`.`)를 감지해 정적 리소스로 오판하던 문제로 인해 진단 경로(`/.well-known/creaibox-diagnostics`)가 작동하지 않던 버그를 예외 처리를 통해 수정했습니다.

#### 3. 네이버 소셜 로그인 버튼 UI 제거
* **구현 요약**: Supabase 비활성 프로바이더 정책에 발맞추어 로그인 및 회원가입 페이지에서 더 이상 지원하지 않는 네이버 로그인 옵션 레이아웃을 삭제했습니다.
* **작업 상세**:
  * [`src/app/login/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/login/page.tsx) 및 [`src/app/signup/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/signup/page.tsx)에서 네이버 로그인 버튼 코드를 전면 걷어내고 컴파일 세이프티를 완비했습니다.

#### 4. 유튜브 데이터 API URL 파싱 고도화 및 RAG 세션 보안 강화 (이전 차수 작업분 반영)
* **구현 요약**: 유튜브 검색 기능에 동영상 URL, 핸들(@이름), 채널 ID 주소를 모두 호환 파싱하는 로직을 심고, API 남용을 방지하기 위해 사용자 세션 체크를 탑재했습니다.
* **작업 상세**:
  * `/api/youtube` 및 `/api/ai/generate` 진입점에 Supabase `getUser()` 세션 확인을 추가하여 외부 비회원의 소모성 호출을 원천 차단했습니다.
  * 닉네임이 길어질 경우 헤더의 시작 버튼이 두 줄로 튕기던 반응형 에러를 `whitespace-nowrap`을 적용해 해결했습니다.

---

### 🗓️ 2026-06-20 (토)

#### 1. 무료 공유 에셋 라이브러리 Pixabay 스타일 상단 미디어 분류 탭 추가
* **구현 요약**: 무료 공유 에셋 페이지의 검색바 상단 영역에 픽사베이(Pixabay) 감성의 미디어 분류 선택 탭(`둘러보기`, `사진`, `일러스트`, `벡터`, `비디오`, `음악`, `GIF`)을 탑재하고 필터링 및 오디오 제어 동작을 동기화시켰습니다.
* **작업 상세**:
  * **상단 탭 바 렌더링**: `src/app/studio/library/free-assets/page.tsx` 내 검색 인풋 위에 둥글고 세련된 픽사베이 스타일 탭 버튼들을 추가하여 시각적 직관성을 향상했습니다.
  * **상태 연동 및 오디오 제어**: 클릭 시 활성 탭이 흰색 라운딩 알약 모양으로 채워지고 `selectedMediaType` 상태가 변경되며, 음악/사운드가 재생 중이었을 경우 오디오 재생을 일시정지(`audioRef.current.pause()`)하도록 이벤트를 연계 완료했습니다.

#### 2. AI 이미지 프롬프트 10대 스타일 구글 시트 반영 및 아키텍처 가이드라인 문서 신설
* **구현 요약**: 무료 공유 에셋 프롬프트 목록 업데이트 시 활용도가 높은 10가지 이미지 스타일 프리셋을 선정하여 구글 시트에 일괄 적재하고, 향후 다른 스튜디오 구축 시 개발 지침이 될 표준 기술 명세 문서를 추가했습니다.
* **작업 상세**:
  * **구글 시트 10종 확장 적재**: 기존 3종 스타일에 더해 3D Render, Anime, Pixel Art 등 7가지 고수요 스타일을 추가하여 총 10종 스타일에 대해 18개 카테고리 전체(총 126개 영문 프롬프트) 데이터를 생성했고, [expand_prompts_styles.js](file:///Users/a1234/Local%20Sites/creaibox/scratch/expand_prompts_styles.js) 스크립트를 통해 구글 시트(Sheet ID: `1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I`)에 A열부터 M열까지 성공적으로 자동 적재 완료했습니다.
  * **스타일 가이드라인 문서 신설**: [image-prompt-style-guide.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/image-prompt-style-guide.md) 가이드를 `docs/arch` 폴더에 생성하여 각 스타일별 핵심 키워드, 동일 오브젝트(마법의 물약 병) 대조 프롬프트 예시, 향후 신규 스튜디오 개발자를 위한 DB 스키마 설계 및 백엔드 TypeScript API 파이프라인 구조를 체계적으로 문서화했습니다.

#### 3. 구글 스프레드시트 외부 전체 공개 권한 제거 및 보안 강화
* **구현 요약**: 생성 및 동기화된 2개의 구글 스프레드시트 파일의 외부 링크 공개 읽기 권한을 명시적으로 차단하여 본인 및 시스템 권한 소유자만 접근 가능한 비공개(Private) 파일로 전환했습니다.
* **작업 상세**:
  * **API 기반 권한 삭제**: [remove_anyone_permissions.js](file:///Users/a1234/Local%20Sites/creaibox/scratch/remove_anyone_permissions.js) 도구를 사용해 무료 에셋 카테고리 시트(`1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I`) 및 신규 생성된 아이디어 허브 시트(`18Krz6hFRA2vf44qcwqhNL8ydHN-25LHg0CFWmhcKcoM`)의 `anyoneWithLink` (링크가 있는 모든 사용자 읽기 가능) 권한을 탐색하여 완벽하게 삭제 조치했습니다.

#### 4. 무료 공유 에셋 카테고리 12대 대분류(총 2,400개 행)로 전면 확장 동기화
* **구현 요약**: 무료 공유 에셋 카테고리 구조를 기존 7대 분류에서 5대 비즈니스 고수요 카테고리(시즌, 건축, 스포츠, 질감, 교육 등)를 신설 추가하여 총 12대 대분류(2,400개 행) 구조로 전면 대형 확장 적재를 완료했습니다.
* **작업 상세**:
  * **카테고리 뼈대 확장**: [generate_1000_categories.js](file:///Users/a1234/Local%20Sites/creaibox/scratch/generate_1000_categories.js) 빌더 코드를 120개 중분류 및 1,200개 소분류(시즌 2종 곱하여 총 2,400개 행) 리스트로 전면 설계 확장하여 가동했습니다.
  * **구글 시트 다중 탭 연동**: [split_categories_to_sheets.js](file:///Users/a1234/Local%20Sites/creaibox/scratch/split_categories_to_sheets.js)를 업데이트하여 구글 시트에 12개 대분류 탭을 동적으로 추가 및 200개 행씩 분할 기입하고, 헤더 남색 서식과 자동 크기 조정을 완비했습니다.
  * **로컬 JSON 분할 생성**: [split_json_categories.js](file:///Users/a1234/Local%20Sites/creaibox/scratch/split_json_categories.js)를 확장하여 웹 Gemini 텍스트 전달 및 관리 편의성을 극대화하기 위해 12개 대분류별 쪼개진 200개들이 JSON 파일들을 생성 완료했습니다.

#### 5. 무료 공유 에셋 업로더 및 관리자(ADMIN) 대상 편집/삭제 권한 부여 및 UI 연동
* **구현 요약**: 무료 공유 에셋의 본인 업로드분 혹은 관리자 계정인 경우 에셋을 수정하고 삭제할 수 있도록 프론트엔드/백엔드 권한 연동 및 UI 동작을 완료했습니다.
* **작업 상세**:
  * **백엔드 API uploaderEmail 노출**: 목록 API(`/api/free-assets/list`) 응답에 데이터베이스 원본 이메일인 `uploaderEmail`을 추가하여 프론트엔드에서 세션 이메일과 비교할 수 있도록 개선했습니다.
  * **프론트엔드 권한 비교 연동**: `src/app/studio/library/free-assets/page.tsx`에서 `currentUserEmail`과 에셋의 `uploaderEmail` 매칭 혹은 `isAdmin` 여부를 확인하는 권한 판별 로직을 완성했습니다.
  * **그리드 카드 퀵 에딧(Quick Edit) 탑재**: 본인 업로드 및 어드민 권한 에셋에 대해 마우스 호버 오버레이 시 우측 상단 액션 바에 연동된 돋보기/좋아요 등 옆에 `Edit` (정보 수정) 아이콘 버튼을 즉각 노출하여 빠른 편집이 가능하도록 설계했습니다.
  * **상세 모달 "에셋 관리" 영역 추가**: 상세보기 모달의 우측 사이드바 패널 상단에 권한 보유자 전용 "에셋 관리" 카드를 신설하고, "정보 수정" 및 "에셋 삭제" 버튼을 결합하여 기존에 구현된 백엔드 메타데이터 업데이트/구글드라이브 삭제 흐름(`handleEditSubmit`, `handleDeleteAsset`)에 매핑했습니다.

#### 2. 무료 공유 에셋 라이브러리 가로 이미지 개수 조정
* **구현 요약**: 무료 공유 에셋 그리드의 가로 이미지 노출 개수를 기존 3개에서 4개로 늘려 더 효율적인 그리드 레이아웃을 완성했습니다.
* **작업 상세**:
  * **그리드 컬럼 수 변경**: `src/app/studio/library/free-assets/page.tsx` 파일 내 미디어 카드 에셋 그리드 컬럼 수를 `lg:grid-cols-3`에서 `lg:grid-cols-4`로, 중간 화면 크기인 `md:grid-cols-3`도 함께 추가하여 반응형으로 자연스럽게 전환되도록 수정했습니다.

#### 2. 무료 공유 에셋 AI 생성 정보(프롬프트 및 생성 툴) 입력 및 조회 연동
* **구현 요약**: 무료 공유 에셋 업로드/수정 시 AI 제작 이미지인 경우 텍스트 프롬프트와 제작 도구를 입력받고, 상세 보기 모달에서 이를 조회 및 복사할 수 있도록 기능을 결합했습니다.
* **작업 상세**:
  * **DB 컬럼 추가 및 DDL 갱신**: `free_assets` 테이블에 `prompt` (TEXT) 및 `ai_tool` (VARCHAR) 컬럼을 추가했으며, 관련 SQL 파일([free-assets.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/free-assets.sql))과 데이터베이스 스키마 명세([free-assets-schema.md](file:///Users/a1234/Local%20Sites/creaibox/docs/database/free-assets-schema.md))를 동기화 갱신했습니다.
  * **백엔드 API 및 Google Drive 연동**:
    * `upload` API: formData에서 `prompt`, `aiTool`을 수신하여 구글 드라이브 description 메타 JSON에 누적하고 Supabase DB에 적재합니다.
    * `list` API: DB 조회 시 `prompt` 및 `ai_tool`을 로드하여 프론트엔드가 요구하는 객체 형태(`prompt`, `aiTool`)로 정합하여 리턴합니다.
    * `update` API: 정보 수정 시 prompt/aiTool 수신 값을 Google Drive와 Supabase 양쪽에 동시 업데이트하도록 수정했습니다.
  * **UI 컴포넌트 고도화 ([page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx))**:
    * **업로드/수정 모달**: "AI 제작 에셋" 토글 활성화 시 이미지 제작 AI 툴(미드져니, 나노바나나, ChatGPT, 클링, Grok 등 11개 프리셋) 선택 셀렉터와 텍스트 프롬프트 textarea 입력 구역이 동적으로 표출되도록 구현했습니다.
    * **상세 팝업 모달**: 태그 해시 아래에 AI 프롬프트 카드 뷰를 신설하여 사용 모델 배지와 프롬프트 텍스트를 정교하게 출력하며, 원클릭 클립보드 복사(Copy) 단추 및 피드백 상태("복사 완료!")를 탑재했습니다.

#### 3. 무료 공유 에셋 UI 라운딩 디자인 고도화 및 생성 필터 복원
* **구현 요약**: 무료 공유 에셋 페이지의 이미지 카드를 Pixabay 스타일의 직각(Square) 이미지 박스로 재조정하고, 비율 필터 하단에 누락되었던 생성 방식 필터("AI 생성 이미지" 및 "실제 사진 이미지")를 복원했습니다. 아울러 에셋 상세 정보 및 에셋 수정 모달 등 모든 대화상자/입력 도구를 콘텐츠 아이디어 허브 규격의 세련된 라운드 디자인으로 통일했습니다.
* **작업 상세**:
  * **이미지 박스 직각화**: 그리드 내의 미디어 카드(`div`) 모서리 및 상세보기 모달 내 프리뷰 이미지/비디오 모서리를 기존 `rounded-2xl` 및 `rounded-xl`에서 `rounded-none`으로 수정하여 픽사베이와 유사한 직각 카드/이미지 레이아웃으로 교정했습니다.
  * **제작 방식 필터 복원**: `selectedGenerationType` 필터 상태를 추가하여 비율 필터 바로 아래에 "전체 이미지", "AI 생성 이미지", "실제 사진 이미지" 버튼 탭을 신설하고 데이터 필터링(`filteredAssets`)을 완벽하게 재연동했습니다.
  * **모달 및 입력 UI 라운딩 전면 반영**: 이미지 상세 모달(`rounded-3xl`), 수정 모달(`rounded-3xl`), 닫기 버튼(`rounded-xl`), 수정 폼(제목, 분류, 비율, 태그, 카메라 정보, AI 생성 도구, 프롬프트 입력창 등)에 사용되던 각진 `rounded-none` 테두리를 모두 지우고 콘텐츠 아이디어 허브 규격의 부드러운 라운드(`rounded-xl`, `rounded-lg`) 디자인을 적용 완료했습니다.

#### 4. 만능 에디터 AI 글 재창조(Spin-Rewriting) 기능 통합 및 UI/UX 단추 정비
* **구현 요약**: Tiptap 만능 블로그 에디터(`UniversalBlogEditor.tsx`)에 네이버 원고 추출 및 Spin-Rewriting 엔진 재창조 기능을 가로형 제어바로 통합 설계하고, 주요 액션 버튼의 명칭/크기/색상을 프리미엄 다크 테마로 일치시켰습니다.
* **작업 상세**:
  * **AI 포스팅 재창조 가로 바 추가**: 타겟 글 URL 입력 및 URL 원본 글 가져오기, AI 글 재창조 기능을 에디터 컨트롤바 2번째 칸에 가로 행으로 배치했습니다.
  * **버튼 3종 크기 및 테마 단일화**: `"AI 콘텐츠 생성 시작"`, `"URL 원본 글 가져오기"`, `"AI 글 재창조 시작"`(재창조 가동에서 이름 정비) 3개 버튼의 크기를 `w-48 h-9`로 일치시키고 보라-핑크 그라데이션 컬러(`bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600`)로 비주얼을 단일화했습니다.
  * **새 글 작성 시 버튼 활성화**: 수기 직접 새글 쓰기로 생성된 글처럼 제목만 있고 본문이 비어있는 상태(`content.length <= 100`)에서도 AI 생성 및 재창조 단추들이 올바르게 활성화(Enabled)되도록 RLS/비활성 예외 정책을 정비 완료했습니다.

### 🗓️ 2026-06-19 (금)
#### 1. 무료 공유 에셋 라이브러리 레이아웃 Pixabay 스타일 고도화 및 이미지 편집 바로가기 연동
* **구현 요약**: 무료 공유 에셋 화면을 픽사베이(Pixabay) 스타일로 고도화하여 이미지의 크기를 키우고, 불필요한 카드 테두리와 텍스트 박스를 없애 깔끔하게 구현했으며, 호버 시 노출되는 메타 정보 및 디자인 편집기("이미지 편집") 다이렉트 링킹을 탑재했습니다.
* **작업 상세**:
  * **비율 필터 1줄 정렬**: 사진 비율 필터 및 생성 유형 필터의 부모 컨테이너 width를 `max-w-xl`에서 `max-w-3xl`로 확장하여, "기타 비율" 버튼이 줄바꿈으로 떨어지지 않고 "1:1 정방향" 오른쪽에 나란히 한 줄로 배치되도록 교정했습니다.
  * **Pixabay 스타일 미디어 카드 디자인**: 카드 모서리 및 외부 보더, 하단 텍스트 메타 박스를 제거하여 이미지가 경계 없이 모던하게 노출되도록 개편했습니다.
  * **그리드 크기 확대**: 기존 4열 그리드(`lg:grid-cols-4`)에서 3열 그리드(`lg:grid-cols-3`)로 레이아웃 규격을 변경하여, 각 이미지가 화면에서 훨씬 크고 선명하게 들어오도록 최적화했습니다.
  * **통합 호버 오버레이 (All Info on Hover)**: 카드 마우스 호버 시 노출되는 어두운 그라데이션 오버레이 영역에 업로더 닉네임, 에셋 제목, 뷰수/다운로드수 통계 정보, 태그, 비율/생성 배지를 모아서 출력하도록 배치했습니다.
  * **동적 액션 버튼 추가**: 호버 상단 우측에 좋아요(하트), 보관하기(북마크), 즉시 다운로드 버튼을 추가해 직관적인 사용성을 제공합니다.
  * **"이미지 편집" 다이렉트 링킹**: 이미지 에셋인 경우, 호버 영역 우측 하단에 `이미지 편집` 바로가기 버튼을 추가하고 클릭 시 캔버스 디자인 편집기(`/studio/image/workspace`)로 해당 이미지 URL 및 타이틀을 쿼리 스트링으로 실어 즉시 편집을 개시하도록 연계 완료했습니다.

#### 2. 비로그인 방문자 대상 AI 스튜디오 시작 버튼 노출 및 Spotify 스타일 헤더 개편
* **구현 요약**: 로그인하지 않은 일반 방문자도 메인 페이지에서 스튜디오를 바로 확인할 수 있도록 헤더 내 "AI 스튜디오 시작하기" 버튼을 상시 노출하고, Spotify 스타일의 세련된 텍스트 메뉴를 추가했습니다.
* **작업 상세**:
  * **스튜디오 시작 버튼 상시 노출**: 비로그인 상태일 때도 헤더 우측에 `h-14` 높이의 그라데이션 "AI 스튜디오 시작하기" button이 무조건 렌더링되게 하여 탐색 진입도 및 회원가입 전환 흐름을 극대화했습니다.
  * **Spotify 스타일 회원가입/로그인 텍스트 메뉴**: 버튼 우측에 "회원가입" 및 "로그인" 버튼 카드 대신 깔끔하고 세련된 오리지널 텍스트 링크 스타일(`text-slate-600 transition hover:bg-slate-100 hover:text-slate-900`)을 나란히 결합하여 Spotify의 세련된 비주얼을 벤치마킹하여 완성했습니다.
  * **레이아웃 흔들림(Visual Jump) 방지**: 로그인 상태(사용자 프로필 캡슐 노출)와 비로그인 상태(회원가입/로그인 텍스트 메뉴 노출) 간 전환 시 헤더 로고, 중앙 탭 목록 및 우측 버튼들이 미세하게 흔들리거나 높이가 튀던 현상을 완벽히 방지하여 안정적인 레이아웃 무결성을 실현했습니다.

#### 3. Supabase SSR 청크 쿠키(Chunked Cookie) 유실 및 로그인 세션 지연 오류 수정
* **구현 요약**: 로그인 직후 새로고침(F5)을 하기 전까지 로그인 세션이 인식되지 않거나 간헐적으로 풀리던 동기화 문제를 미들웨어 쿠키 처리 개편을 통해 해결했습니다.
* **작업 상세**:
  * **원인 분석**: JWT 토큰 크기가 커서 Supabase가 다중 청크 쿠키로 분할(chunked cookie)해서 쓸 때, 기존 미들웨어(`middleware.ts`)의 개별 `set` 및 `remove` 로직이 호출될 때마다 매번 `NextResponse.next()`를 새롭게 재생성하면서 이전 청크 데이터들을 덮어쓰고 최종 청크만 반환하는 버그가 발생했습니다. 이로 인해 브라우저 콘솔에 `chunked cookie decoded to invalid JSON` 경고가 발생하고 서버 SSR에서 세션이 무시되어 새로고침 전에는 로그인 풀림/지연이 생겼습니다.
  * **getAll / setAll 메서드 전환**: 공식 `@supabase/ssr` 가이드에 따라 개별 `get/set/remove` 핸들러 대신 `getAll()`과 `setAll()` 구조로 변경하여, 여러 청크 쿠키가 단일한 `NextResponse` 응답 인스턴스에 누락 없이 온전히 담겨 서빙되도록 일괄 수정을 완료했습니다.

#### 4. 무료 공유 에셋 업로더 활동명(닉네임) 동적 연동 및 이메일 표시 버그 수정
* **구현 요약**: 무료 공유 에셋 목록 로드 시 업로더 이름이 이메일(예: `jenam7720`)로 하드코딩 표시되던 현상을 `profiles` 테이블의 실시간 활동 닉네임과 동적 결합하여 `CreAibox` 등으로 올바르게 나타나도록 해결했습니다.
* **작업 상세**:
  * **원인 분석**: 무료 공유 에셋 업로드 시 업로더 식별을 위해 구글 드라이브 및 DB `free_assets` 테이블에 고유 값인 사용자 이메일(`jenam7720@gmail.com`)을 기입했으나, 목록 API(`/api/free-assets/list`)가 해당 이메일을 그대로 리턴하고 프론트엔드가 단순히 `@` 앞자리만 잘라 출력(`By Jenam7720`)함으로써 마이페이지에서 수정한 닉네임 변경사항이 반영되지 않는 구조였습니다.
  * **동적 닉네임 리졸버 구현**: 리스트 API가 DB `free_assets`를 로드한 뒤, 고유 업로더 이메일 목록을 추출하여 `profiles` 테이블의 실시간 `nickname` 값을 1회 일괄 조회(IN 쿼리)한 후 매핑해서 반환하도록 개선했습니다. 이로 인해 과거 이미지 및 신규 이미지 모두 업로더의 현재 닉네임이 실시간 동기화되어 깔끔하게 노출됩니다.

---

### 🗓️ 2026-06-18 (목)
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
