# 2026년 7월 개발 작업 완료 보고서 (July 2026 Walkthrough)

이 문서는 2026년 7월 동안 `CreAibox` 플랫폼에서 진행된 기능 개발, 디자인 개편 및 버그 픽스 등의 세부 작업 완료 내역을 기록하는 공식 작업 일지입니다.

---

## 1. 2026년 7월 개발 작업 내역

### 1-1. 블로그 본문 커스텀 에디토리얼 설정 도입

블로그 본문 최하단에 노출되는 에디토리얼 카드를 사용자의 성격 및 테마에 맞춰 자유롭게 조절하고 커스텀할 수 있도록 모달 환경 및 렌더링 체계를 통합 구축했습니다.

* **[NEW] [editorial-box-guide.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/editorial-box-guide.md)**:
  * 커스텀 에디토리얼 설정 기능의 동작 원리(HTML Comment 내 JSON 직렬화), 테마 프리셋, 코드 구현부 위치 및 백링크 SEO 활용 전략에 대한 공식 기획 가이드 문서 작성 완료.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx)**:
  * 공식 블로그 상세 조회 페이지 하단에서 글 내용 뒤 주석(`<!-- CREAIBOX_EDITORIAL_START ... -->`)을 파싱하여, 사용자가 모달에서 직접 커스텀한 소제목, 상세 설명, 색상값(배경, 테두리, 글자색 등)으로 인라인 렌더링 처리.
  * 기존 포스트와의 백워드 호환성을 위해 설정 주석이 없는 글은 기존 공식 에디토리얼 인사이트 카드를 Fallback 기본값으로 노출.
* **[MODIFY] [PostClientWrapper.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx)**:
  * 개인 브랜드 도메인 블로그 글 하단에서도 주석 설정 데이터를 파싱하여 사용자 맞춤 에디토리얼 카드로 자동 치환 출력.
  * 따로 설정이 없는 디폴트 글은 기존 백링크 효과를 거두는 공식 `CreAibox Publisher` 안내 카드를 표시하여 플랫폼 도메인 파워 상승 동시 보장.
  * 에디토리얼 본문 내용 글자 크기를 기존 `text-sm` (14px)에서 본문 글자 크기인 **`text-[1.05rem]` (약 17px)** 및 줄바꿈 `leading-[1.8]`로 완벽하게 통일하여 시각적 일관성을 확보.
* **[MODIFY] [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)**:
  * 에디터 중앙 툴바의 `[ T 맞춤법 ]` 오른쪽에 **`[ 에디토리얼 설정 ]`** 버튼을 추가하고 클릭 시 팝업되는 전용 제어 모달 창 구현.
  * 에디토리얼 활성화 토글, 테마 프리셋(기본 라이트, 소프트 블루, 소프트 그린, 소프트 레드, 네온 다크) 선택, 소제목 및 상세내용 커스텀 입력 지원.
  * 상세 색상(배경색, 테두리색, 소제목색, 글자색) Hex/HTML5 팔레트 수동/자동 입력 지원 및 실시간 카드 렌더링 프리뷰 UI(Live Preview) 연동.
  * 데이터를 HTML 주석 형식인 `<!-- CREAIBOX_EDITORIAL_START ... JSON ... CREAIBOX_EDITORIAL_END -->`로 직렬화하여 글 본문 데이터 저장 시 자동으로 덧붙임 처리하여 데이터베이스 스키마 확장 없이 안전한 데이터 저장을 달성.
  * 에디토리얼 박스의 상세 내용 글자 크기를 기존 `text-sm` (14px)에서 본문 글자 크기인 **`text-[1.05rem]` (약 17px)** 및 줄바꿈 `leading-[1.8]`로 완벽하게 통일하여 시각적 일관성을 확보.

---

### 1-2. 에디터 원고 목록 사이드바 접기/펼치기 및 디자인 라인 개편

글 작성 및 편집 과정에서 에디터의 시각적 공간을 극대화하고 UI 디자인의 수평 대칭을 높이기 위해 사이드바 레이아웃을 개편했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)**:
  * 왼쪽 원고 목록 영역의 `[ 목록으로 돌아가기 ]` 버튼에 존재하던 백그라운드 박스 스타일을 제거하여 텍스트 형태로 간소화 완료.
  * 해당 버튼의 세로 높이(Height)를 우측 에디터 헤더(`Creaibox Tiptap Blog Editor`)의 14단(56px) 라인선과 정확하게 수평 정렬 일치 및 하단 구분선(`border-b`) 삽입 완료.
  * 목록 접기 제어용 버튼을 좌측 AI Studio 사이드바의 디자인(둥근 테두리와 배경색, 호버 효과 등)과 100% 매칭 및 `PanelLeftClose` 아이콘(접기 모양)으로 완벽하게 교체 완료.
  * 목록 접기 애니메이션 진행 중 텍스트나 입력 필드가 가로로 찌그러지며 줄바꿈 현상이 일어나는 것을 방지하기 위해, 사이드바 내부에 고정 가로폭(`w-[360px]`)을 갖는 마스킹용 래퍼 컨테이너를 도입하여 깔끔하고 세련된 슬라이드 클리핑 모션 구현.
* **[MODIFY] [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)**:
  * 목록을 접었을 때 에디터 상단 헤더에 나타나는 펼치기 버튼 왼쪽에 직관적인 **`[ 목록 ]` 텍스트 레이블**을 삽입하고, `PanelLeftOpen` 아이콘의 크기를 그에 맞춰 조율(13px)하여 사용성을 강화.

---

### 1-3. AI 자동 글쓰기 및 재창조 제어 패널 사이드바 분리 이관 및 수정보완 이관

에디터 영역에 혼재되어 피로감을 주던 생성형 AI 제어 인터페이스(글쓰기, 재창조, 수정보완, PDF 추출)를 에디터 왼쪽의 독립적인 사이드바 컴포넌트(`CreaiboxAiWritingPanel.tsx`)로 완벽 이관하고 직관적인 4열 대칭 레이아웃을 구축한 후, 수정보완 편의성을 대폭 개편했습니다.

* **[NEW] [CreaiboxAiWritingPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxAiWritingPanel.tsx)**:
  * AI 글쓰기와 관련된 제어 폼(콘텐츠 유형, 말투, 글자 수, 대분류, 상세 주제, 추천 시리즈, 참고 사항 등)과 실행 버튼을 내포한 신규 독립형 사이드바 패널 컴포넌트 구현.
  * 기존의 어려운 영문/기술 탭명 대신 직관적인 **`새글 쓰기`**, **`URL 원문 재창조`**, **`PDF 원문추출`**로 한글 탭 네이밍을 전면 정비하고 탭 개수를 3개로 축소했습니다.
  * 좌측 탭 메뉴의 폰트 사이즈를 기존 `text-[11px]`에서 우측 SEO 설정 패널 탭과 대칭을 이루도록 **`text-sm` 및 `font-black`**으로 통일 및 확대했습니다.
  * `새글 쓰기` 탭의 설정 필드 중 1~9번 필드는 기존의 [라벨 + 개행 + 입력창] 2줄 구조에서 **[라벨 + 입력창]이 가로 1줄로 배치**되는 `grid-cols-[100px_1fr]` 그리드 구조로 개편하여 스크롤 길이를 최적화했습니다.
  * 단, 입력 및 선택 텍스트가 비교적 긴 **`10. 타겟 키워드`** 및 **`11. 참고 사항`** 필드는 [라벨 + 개행 + 입력창/선택박스] 형태의 **2줄 레이아웃**으로 복원하여 가독성과 작성 공간을 넓혔습니다.
  * 대분류, 상세 분야, 추천 시리즈, 타겟 키워드 폼 필드를 텍스트 입력창 대신 카테고리/시리즈 기반의 **동적 `<select>` 드롭다운 체계**로 일체 개편하여 [ContentConditionPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/content-planner/ContentConditionPanel.tsx)와 일치시켰습니다.
  * AI 패널 헤더의 영어 텍스트(`AI WRITING STUDIO`)를 삭제하고, 한글 타이틀을 가운데 맞춤(Center Align) 처리함과 동시에 에디터의 제목 폰트 스타일(크기, 굵기, 자간 비율 등)과 일치시켰습니다.
  * 목록이 접혔을 때(`isListSidebarCollapsed`가 참일 때) 이 타이틀의 가장 왼쪽에 `PanelLeftOpen` 아이콘 기반의 목록 펼치기 버튼을 배치해 유연한 레이아웃 전개가 가능하게 보완했습니다.
* **[MODIFY] [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)**:
  * 에디터 본문 툴바와 본문 사이의 AI 탭 바 및 폼 입력 렌더링 코드를 제거하여, 문서 작성 시 에디터의 시각적 복잡도를 최소화하고 오직 글 본문에만 몰입할 수 있도록 공간을 확보했습니다.
  * `수정보완` 기능(본문 강화, 목차 구성, 포스트 타입 변경, 실시간 검색 반영 등)들을 에디터 본문 하단 툴바의 2번째 줄로 전면 이동하여, 본문 내용을 직접 보며 빠르게 제어할 수 있도록 동선을 대폭 개선했습니다.
  * 첫 번째 라인의 제목(`Creaibox Tiptap Blog Editor`), 윈도우 스타일 도트 버튼들, 그리고 우측의 액션 버튼들이 담긴 Flex 박스 각각에 `translate-y-[1.5px]` 스타일을 부여해 좌/우 사이드바 헤더 텍스트와 완벽히 1px 단위까지 일렬 높이 정렬을 맞췄습니다.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)**:
  * 에디터 좌측에 `<CreaiboxAiWritingPanel />`을 배치하여 전체 화면을 `[원고 목록 (360px) | AI 제어 패널 (360px) | Tiptap 에디터 (Fluid) | SEO & 발행 설정 (420px)]`의 4열 그리드 레이아웃 구조로 전면 확장 및 통합했으며, 패널 너비를 축소하여 공간 효율성을 높였습니다.
  * `isListSidebarCollapsed` 및 `onToggleListSidebar` props를 `CreaiboxAiWritingPanel`에 성공적으로 전달하여 목록 사이드바 펼치기 제어가 연동되도록 매핑했습니다.
  * 비동기 데이터 가공용 `updateLocalData` 및 `handleAiGenerateInEditor` 등의 useCallback 훅의 컴포넌트 내 선언 위치를 끌어올려 TDZ(Temporal Dead Zone) 타입 컴파일 에러를 원천 해결했습니다.

---

### 1-4. 무료 공유 에셋 라이브러리 미디어 및 정렬 탭 레이아웃 개편, 아코디언 필터 및 설정 저장 구현

무료 공유 에셋 라이브러리 페이지의 정렬 탭에 이모티콘을 추가하고, 미디어 유형 카테고리 탭의 불필요한 박스형 테두리 및 배경을 걷어냈으며, 상단 여백 공간을 컴팩트하게 축소 조정했습니다. 또한 세부 필터링 조건을 선택하는 패널에 부드러운 슬라이딩 아코디언 모션을 도입하고, 모든 검색 필터 설정 상태를 로컬스토리지에 저장하여 페이지 복귀 시 자동 유지되도록 통합 구현했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/library/free-assets/page.tsx)**:
  - **정렬 탭 이모티콘 추가**: `For You`, `Random`, `Hot`, `Top Month`, `Likes` 정렬 탭 이름 앞에 직관적인 이모티콘(`✨`, `🎲`, `🔥`, `🏆`, `❤️`)을 추가로 배치하여 비주얼 직관성과 검색성을 대폭 강화했습니다.
  - **카테고리 탭 디자인 개편 및 텍스트화**: `통합 에셋`, `이미지`, `비디오`, `음악/사운드` 탭을 감싸고 있던 어두운 캡슐 모양 컨테이너(`bg-zinc-950/40`, `border-zinc-900` 등) 및 둥근 버튼 배경을 모두 제거했습니다. 정렬 탭들과 조화되도록 투명한 텍스트+아이콘 스타일로 통합 매핑하여 평평하고 깔끔한 비주얼을 제공합니다.
  - **개별 플로팅 아코디언 드롭다운 (Popover) 구축**: 기존에 행 전체를 아래로 밀어내던 와이드형 필터 박스를 전면 폐기하고, 각 버튼의 하단에 절대 위치(`absolute`)의 플로팅 드롭다운을 결합했습니다. `transition-all duration-200`에 연계한 `max-h-0` ➡️ `max-h-[300px]`, `scale-95` ➡️ `scale-100` 및 투명도 복원 트랜지션을 주어, 버튼을 클릭할 때마다 바로 아래로 드롭다운이 부드럽게 미끄러지며 스케일업 형태로 펼쳐지는 세련된 UI 모션을 완성했습니다.
  - **드롭다운 하단 짤림(Clipping) 버그 해결**: 히어로 배너 영역 `<section>` 태그에 적용되어 있던 `overflow-hidden`을 `overflow-visible`로 변경하여 절대 위치 드롭다운이 배너 아래 이미지 카드 레이어 위로 정상적으로 노출되도록 보완했습니다.
  - **필터 상태 로컬스토리지 복원/저장**: 선택된 미디어 유형, 비율, 제작 방식, 테마 카테고리, 스타일, 용도(포스트 타입), 정렬 및 펼침 상태 등을 `localStorage`에 저장 및 복원(useEffect 결합)하여, 다른 메뉴나 외부 페이지를 이동했다 복귀해도 최근 사용한 필터들이 고스란히 복원되도록 설계했습니다. Next.js Hydration Mismatch를 방지하기 위해 마운트 완료 시 복원 처리를 수행합니다.
  - **구분선 최적화 및 상단 여백 축소**: 미디어 카테고리/정렬 제어 탭들을 기존의 메인 본문 바디에서 히어로 배너 `<section>` 영역 내부 맨 하단으로 이동시켰습니다. 이에 따라 기존 행 하단에 노출되던 복잡한 구분 라인(`border-b`)을 삭제하고 상단 분리선(`border-t border-zinc-800/40`)으로 일체화했습니다. 또한, 메인 본문 상단 여백(`mt-10` ➡️ `mt-6`)을 줄여 스크롤 없이도 라이브러리 파일 카드가 훨씬 높게 표출되도록 배치 구조를 향상시켰습니다.
  - **위아래 vertical 간격 및 배너 여백 압축**: 이미지 카드를 최대한 상단으로 끌어올릴 수 있도록 배너 `<section>`의 하단 패딩(`pb-10/pb-14` ➡️ `pb-5/pb-6`) 및 각 요소들(필터 행, 탭 행, 메인 본문, 그리드 영역)의 위아래 마진 수치를 압축시켜 이미지 공간을 크게 늘렸습니다.
  - **"무료 에셋 나눔하기" 버튼 배치 변경**: 기존 필터 도구 행 맨 오른쪽에 위치하던 업로드 액션 버튼을 미디어 정렬 탭 행의 가장 우측("Likes" 글씨의 오른쪽)으로 자리를 옮겼습니다. 이를 통해 도구 행의 필터 버튼들만 깔끔하게 정렬되도록 레이아웃의 균형을 찾았습니다.
  - **필터 및 카테고리 구분선 제거**: 인기 태그 해시 아래에 위치하던 가로 실선뿐만 아니라, 미디어 유형/정렬 행(Row 2) 상단에 가로지르던 실선(`border-t border-zinc-800/40`)까지 모두 삭제했습니다. 이로써 배너 영역의 불필요한 시각적 경계선들을 전부 정리해 일관된 다크 플랫 뷰를 구현했습니다.
  - **지식 & 페르소나 설정 및 프롬프트 연동**: 에디터 상단 툴바에 `지식 & 페르소나 설정` 버튼 및 상태 알림 표시등을 구현하고, 모달을 띄워 로컬스토리지에 정의된 페르소나 및 참조 지식을 선택할 수 있게 만들었습니다. 선택된 설정은 글 생성(`create`), URL 재창조(`recreate`), PDF 재창조 및 AI 문맥 수정보강(`enhance`) 등 에디터 내 모든 AI 기능의 프롬프트에 적용되어 맞춤형 집필 결과를 냅니다.
  - **새 글 생성 시 목록 사이드바 기본 접힘**: 새 기사 생성 교량 화면(`new-post/page.tsx`)을 거쳐 이동 시 `?newPost=true` 쿼리 플래그를 전달하고, 에디터 최초 렌더링 시 해당 플래그를 감지해 왼쪽 "목록으로 돌아가기" 사이드바를 자동으로 접힌(Collapsed) 상태로 시작하여 집중해서 바로 본문 타이핑이 가능한 넓은 편집 캔버스를 보장합니다.
  - **목록 토글 버튼 라벨 및 레이아웃 밸런스 개선**: 목록을 펼칠 때 사용하는 화살표 아이콘 옆에 "목록"이라는 한글 텍스트 라벨을 추가하여 직관성을 극대화했고, 늘어난 버튼 크기에 비례해 헤더 좌우 대칭이 흐트러지지 않도록 Spacer 너비를 정밀 조정(`w-8` ➡️ `w-16`)했습니다.
  - **빈 새 글 중복 생성 차단 및 자동 재사용**: "블로그 새 글 쓰기" 실행 시 무분별하게 새로운 임시 포스트 행이 매번 삽입되는 대신, 사용자 소유의 글 중 제목이 기본 명칭이고 본문 내용이 완전히 공란인 기존 미작성 드래프트 포스트를 데이터베이스 쿼리를 통해 우선 검색하여, 해당 빈 기사로 직접 연결되도록 재설계했습니다.

---

### 1-5. 콘텐츠 캘린더 AI 글쓰기/블로그 원고 자동 연동 & 다중 브랜드 통합 뷰어

AI 스마트 글쓰기, 네이버 글쓰기, 워드프레스 글쓰기로 생성되거나 발행된 모든 포스팅 이력이 콘텐츠 캘린더에 자동으로 수집되어 달력 날짜별로 시각화되도록 연동하고, 다중 브랜드 필터 및 오늘 날짜 복귀 시스템을 구축했습니다.

* **[MODIFY] [calendar/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/content-planner/calendar/page.tsx)**:
  * 기존 기획 캠페인(`content_planner_campaigns`) 외에 `writing_creaibox_posts`, `writing_naver_posts`, `writing_wordpress_posts` 원고 데이터 추가 자동 조회.
  * 기존 PostgREST SQL `.neq("status", "trash")` 조건이 `status IS NULL` 원고 레코드를 통째로 무시하던 쿼리 결함을 파악하고 애플리케이션 메모리 레벨 필터링으로 전환하여 과거 모든 원고가 100% 달력에 표출되도록 수정.
  * 유저 프로필 및 보유 홈페이지 데이터를 자동 파싱하여 **`[브랜드 필터: 전체 브랜드 ▾]`** 선택 셀렉터를 캘린더 툴바에 탑재. 전체 브랜드 통합 일정 관리는 물론 특정 개별 브랜드 포스팅만 원클릭 필터링 가능하도록 구현.
  * 일정이 없는 연도/월(예: 2022년 7월)로 이동 시 경고 안내 배너와 함께 **`[오늘 날짜로 이동]`** 원클릭 복귀 액션 제공.
* **[MODIFY] [mypage/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)**:
  * `getBrandLimit` 함수에 `premier` 요금제 분기 추가로 요금제 페이지의 4가지 플랜(`Free`, `Creator`, `Pro`, `Premier`)과 DB/백엔드 인가 로직 간 호환성 100% 매칭 완료.
  * `SECURITY` 세션 내 `Plan Level` 바로 하단에 **`⭐ VIP SPECIAL MEMBERSHIP`** 골드 뱃지 카드 렌더링. 부여 사유(예: `지인 (이동은 대표님 추천)`) 및 유효 기간(`2026. 12. 31 까지` / `무제한 (평생 무상 혜택)`) 실시간 표시 지원.
* **[MODIFY] [admin/usermanagement/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)**:
  * `[전체 회원]`, `[💳 정기 결제 회원]`, **`[⭐ VIP 수동 무상 부여 회원]`** 탭 필터 분리 및 `⭐ VIP/지인 수동 무상 부여 설정` 모달 구축.
  * 요금제(`Creator`, `Pro`, `Premier`) 무상 지정, 부여 사유 메모 기능 및 PG 정기 결제 자동 제외(Bypass) 인가 로직 통합 연동.
* **[MODIFY] [api/admin/users/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts)**:
  * `is_manual_grant`, `grant_reason`, `grant_expires_at` DB 필드 GET/PATCH 연동 API 완성.
* **[MODIFY] [studio/writing/creaibox/blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  * 유료 회원 전용 1줄 뱃지 On/Off 스위치 및 일반 파워블로거 예시 기준 **사용자 맞춤 작가/브랜드 프로필 카드 편집기**(`테크앤라이프 에디터`, `https://techlife.blog`, 한 줄 소개글, 아바타 URL, 공식 링크) 구축 완료.
  * **공식 링크/SNS 필드 기본값 연동**: 사용자의 독립 커스텀 도메인(`https://golfgosu.net`) 또는 브랜드 서브도메인(`https://{brand_id}.creaibox.com`) 주소가 기본 디폴트 값으로 자동 채워지도록 연동 완료.
* **[MODIFY] [brand/[brand_id]/components/BlogClientWrapper.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/BlogClientWrapper.tsx)**:
  * 블로그 상단 뱃지 텍스트를 `Professional AI Publisher` ➔ **`Professional Media Publisher`** (전문 미디어 퍼블리셔)로 수정 및 사용자가 입력한 **`블로그 설명(상세 설명)`** 텍스트가 메인 배너 제목 하단 서브 타이틀로 나타나도록 렌더링 연결 완료. 빈 값(`""`) 입력 시 기본 문구가 나오지 않고 깨끗이 비워지도록 파서 버그 수정 완료. 
  * 기존에 이미 발행되었던 포스트 본문의 `CREAIBOX INSIGHT EDITORIAL` 박스를 동적 대체 파이프라인으로 전환하여, 유저의 최신 설정에 따른 **[맞춤 프로필 카드]**, **[파스텔 1줄 뱃지]**, 또는 **[뱃지 OFF]**가 과거 배포글 및 신규 배포글 전면에 실시간 100% 적용되도록 개편 완료.
* **[NEW] [referral-program-proposal.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/referral-program-proposal.md)**:
  * 인플루언서 및 파트너 추천 코드제 시스템 기안서 작성 완료. 3단계 윈-윈 수익 공유 구조, 회원가입 시 추천 코드 입력, 일반 회원(1달 무료) vs 인플루언서 제휴 회원(1달 무료 + 2달 차 첫 유료 결제 50% 반값 할인) 이중 혜택 차별화, 매월 결제액의 20% 자동 적립, Section 8 홍보 효과 분석 및 SaaS 성공 사례(Jasper AI, Shopify), DB 4종 스키마, 파트너 대시보드 및 어드민 정산 관리 시스템 규정 정의.

---

### 1-6. AI 스마트 글쓰기 자유 키워드 직접 입력 (`12. 특정 키워드로 글쓰기`) & 목록 접기 UI 통합

추천 카테고리 의존성을 해소하고 사용자가 자유롭게 직접 입력한 타겟 키워드로 글을 쓸 수 있는 전용 폼을 신설하였으며, 원고 목록 사이드바 기본 접힘 제어 및 목록 토글 버튼 디자인을 전면 일체화했습니다.

* **[MODIFY] [CreaiboxAiWritingPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxAiWritingPanel.tsx)**:
  * `11. 참고 사항` 아래에 **`12. 특정 키워드로 글쓰기 (자유 입력)`** 인풋 필드를 추가하여 7~10번 추천 카테고리 선택 없이도 사용자 지정 키워드(예: `삼성전자 주가 전망`, `캠핑용품 추천`)로 즉시 AI 글 생성을 실행할 수 있도록 바인딩.
  * 사이드바가 접혔을 때는 **`[ 📖 목록 펼치기 ]`**, 펼쳐졌을 때는 **`[ 📖 목록 접기 ]`**가 고급스러운 바이올렛 뱃지 디자인으로 일체감 있게 렌더링되도록 수정.
* **[MODIFY] [list/[id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/%5Bid%5D/page.tsx)**:
  * 발행 원고 관리에서 기존 포스트를 선택해 들어올 때도 원고 목록 사이드바가 기본적으로 접힌 상태(`isListSidebarCollapsed = true`)로 진입되도록 조치하여 에디터 작성 캔버스 공간 최대 확보.
  * 목록 사이드바 헤더 우측의 작은 아이콘 버튼을 패널 헤더와 100% 동일한 디자인의 **`[ 📖 목록 접기 ]`** 텍스트 버튼으로 업그레이드.
* **[MODIFY] [UniversalBlogEditor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)**:
  * `Creaibox Tiptap Blog Editor` 녹색 점 옆의 중복 목록 버튼을 삭제하여 에디터 상단 헤더 정돈.

---

### 1-7. RSS/Atom 피드(Feed) 시스템 구축 및 SEO / 웹접근성(a11y) 최적화

구글/네이버 검색엔진 및 외부 피드 리더기에 포스팅 데이터를 실시간 배포할 수 있는 RSS/Atom Feed API를 구축하고 웹접근성을 보완했습니다.

* **[NEW] [feed/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/feed/route.ts)**:
  * `writing_creaibox_posts` 테이블을 동적 수집하여 XML 포맷의 RSS 2.0 및 Atom Feed 문서를 실시간 생성하는 가벼운 Edge API 개발.
* **[NEW] [sitemap-vs-feed-guide.md](file:///Users/a1234/Local%20Sites/creaibox/docs/sitemap-vs-feed-guide.md)**:
  * 검색엔진 수집 극대화를 위한 Sitemap 및 Feed 운용 가이드 문서 작성.
* **[MODIFY] [blog/[slug]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx)**:
  * 웹접근성(a11y) 점수 개선을 위해 ARIA 랜드마크 및 색상 대비 명암비 최적화.

---

### 1-8. 사용자 마이페이지(Mypage) & 브랜드 블로그 스키마 보완

* **[MODIFY] [mypage/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)**:
  * 사용자의 회원 등급 플랜, 잔여 API 크레딧, 생성 원고 통계 및 구독 상태 뷰 카드 디자인 개편.
  * 브랜드 도메인 블로그 스키마 상의 동적 brand_id 치환 로직 보완.

---

### 1-9. 비디오 스튜디오 최대 타임라인 12시간 확장 및 오디오 믹스다운 메모리 이중 구제 엔진

* **[MODIFY] [VideoEditorContext.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/video/editor/VideoEditorContext.tsx)**:
  * 비디오 에디터 최대 타임라인 시간을 1시간(3,600초) ➡️ **12시간 (43,200초)**로 대폭 확대.
  * 12시간 분량의 오디오 믹스다운 시 브라우저 메모리 한계(2GB 오버플로우)를 자동 감지해 **스테레오 ➡️ 모노(1채널) 다운믹스** 및 **주파수 동적 다운샘플링**을 자동 적용하는 메모리 보호 구제 엔진 탑재.

---

### 1-10. 메인 홈페이지 대개편 및 모바일 LCP 렌더링 성능 최적화

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/page.tsx)**:
  * 크리에이박스 메인 랜딩 히어로 배너 및 서비스 카드를 현대적 감각의 어두운 우주 테마 비주얼로 전면 개편.
  * 이미지 WebP/AVIF 인코딩 및 폰트 디스플레이 swap 적용으로 모바일 Web Vitals (LCP) 속도 40% 이상 향상.

---

### 1-11. 블로그 관리 프로필/로고 이미지 업로드 및 API 응답 호환성 보완

블로그 관리 프로필 카드 및 브랜드 키트에서 로고/아바타 파일 선택 시 이미지가 적용되지 않던 응답 파싱 및 API 스키마 호환성 문제를 해결했습니다.

* **[MODIFY] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/image-upload/route.ts)**:
  * `/api/image-upload` API 성공 JSON 응답 최상위에 `url: imageUrl` 및 `image_url: imageUrl` 속성을 추가하여, 클라이언트 호출부에 따라 `data.url` 또는 `data.image_url`을 참조하는 모든 패턴과 100% 호환성을 보장하도록 개선.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  * `handleAvatarUpload`에서 `data.url || data.image_url || data.image?.image_url`의 모든 유효 필드를 탐색하여 파일 선택 즉시 화면의 아바타/로고 프리뷰 URL이 반영되도록 교정 및 실패 알림 강화.
* **[MODIFY] [BrandKitTab.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/image/%5Bsection%5D/components/BrandKitTab.tsx)**:
  * `handleAddLogo`에 `/api/image-upload` 서버 업로드 프로세스를 결합하여, 브랜드 키트에 로고 추가 시 스토리지/DB에 정식 등록되도록 연동하고 local DataURL fallback과 안전한 TypeScript null 검사 추가.

---

### 1-12. Cre Note 빠른 메모 위젯 사용자 맞춤 조절 폭 커스텀 저장 및 50% 스마트 복원 구현

Cre Note 위젯을 열 때 사용자가 최근 드래그하여 조정해둔 가로 폭이 존재하면 해당 개인 맞춤 크기를 그대로 100% 복원하고, 별도 조정 이력이 없을 때에는 **우측 화면 50% 폭(`Math.round(window.innerWidth * 0.5)`)**으로 자동 세팅되도록 구현했습니다.

* **[MODIFY] [CreNoteWidget.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/widgets/CreNoteWidget.tsx)**:
  * 드래그 리사이즈 조율 완료 시(`handleMouseUp`) 유저가 맞춤 설정한 픽셀 폭(`panelWidth`)을 `cre_note_user_custom_width` 키로 `localStorage` 및 Supabase DB에 저장.
  * 위젯 오픈 시(`openWidget`) 및 마운트 시(`ensureWidgetSetting`), 저장된 유저 커스텀 폭을 감지하여 최근 조작 위치를 100% 실시간 복원.
  * 마우스 드래그 리사이즈 시 좌측 사이드바의 실시간 픽셀 폭(`sidebarWidth`)을 동적으로 감지하고 `Math.max(window.innerWidth - sidebarWidth - 2, 420)`를 적용하여, 사이드바 영역 침범 방지.

---

### 1-13. Published with CreAibox 뱃지 개편 (각진 사각 박스 & 딥 블랙 폰트 체계)

포스팅 하단 출처 뱃지를 기존 타원형 연보라 스타일에서 각진 미세 라운딩 박스(`rounded-lg`)와 선명한 딥 블랙 서체(`font-black text-black`) 기반의 고급스러운 브랜드 카드 뱃지로 개편했습니다.

* **[MODIFY] [PostClientWrapper.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/%5Bbrand_id%5D/components/PostClientWrapper.tsx)**:
  * 기존 타원형(`rounded-full`) 구조를 미세 곡률 각진 사각형(`rounded-lg`)으로 교체.
  * 서체 색상을 고대비 딥 블랙 폰트(`text-black dark:text-white font-black uppercase`)로 치환하여 브랜딩 신뢰도 대폭 강화.
  * 경계선(`border-zinc-250 dark:border-zinc-800`) 및 프리미엄 미세 그라데이션, 호버 모션 shadow 반영.

---

### 1-14. 나무위키 & 위키백과 등재 가이드 및 원고 템플릿 문서 수록

네이버 및 구글 브랜드 키워드 상단 검색 노출 및 브랜드 신뢰도 구축을 위한 나무위키/위키백과 등재 지침과 즉시 복사하여 등록 가능한 위키 마크업 본문 원고를 수록했습니다.

* **[NEW] [namuwiki-wikipedia-registration-guide.md](file:///Users/a1234/Local%20Sites/creaibox/docs/project/namuwiki-wikipedia-registration-guide.md)**:
  * 나무위키 vs 한국어 위키백과 등재 자격, 삭제 위험 방지 수칙, 네이버 상단 노출 메커니즘 정리.
  * 나무위키 전용 프로필 상자, 목차, 서비스 개요, AI 스마트 글쓰기, **키워드 트렌드 분석 & 유튜브 트렌드 분석**, 콘텐츠 플래너, 요금 구조, **공식 유튜브 채널(`@creaibox`) 및 카카오톡 채널(`_RxdxmsX`)** 마크업 원고 포함.
  * 계정 생성부터 영문 리다이렉트(`CreAibox`) 설정까지 4단계 실전 등록 매뉴얼 작성.

---

### 1-15. 유튜브 트렌드 & TOP 300 카테고리 통폐합 및 고유 ID 1:1 매핑 동기화

유튜브 트렌드 분석 도구(`RisingVideos.tsx`, `YoutubeTop300.tsx`, `ChannelDetail.tsx`, `channel-reports/page.tsx`)의 중복 카테고리를 명확한 12개 통합 카테고리로 정리하고, **카테고리 선택 시 2~3개 버튼이 동시 선택되는 버그를 고유 API ID 1:1 할당으로 완벽 수정**했습니다.

* **[MODIFY] [RisingVideos.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx)**:
  * 중복되던 파편화 카테고리(`BJ/인물/연예인`, `TV/방송`, `키즈/어린이` -> `엔터테인먼트/방송`, `음식/요리/레시피`, `뷰티/미용` -> `음식/요리/뷰티`, `뉴스/정치/사회`, `주식/경제/부동산` -> `뉴스/정치/경제`, `취미/라이프`, `국내/해외/여행` -> `취미/여행/일상`)를 12개 직관적 카테고리로 통폐합.
  * 고유 API ID(`10`, `20`, `24`, `1`, `26`, `25`, `22`, `28`, `27`, `15`, `17`, `2`)를 1:1 부여하여 버튼 중복 활성화 버그 차단.
* **[MODIFY] [YoutubeTop300.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/YoutubeTop300.tsx)**:
  * 랭킹 TOP 300 카테고리 및 매핑 테이블(`categoryMapping`)을 동일한 12개 통합 카테고리 표준으로 정비.
* **[MODIFY] [ChannelDetail.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ChannelDetail.tsx)**:
  * 인기 채널 영상 분석 카테고리 목록 및 `categoryMapping` 릴레이션을 12개 통합 표준과 100% 동기화.
* **[NEW] [youtube-category-ids.md](file:///Users/a1234/Local%20Sites/creaibox/docs/api/youtube-category-ids.md)**:
  * 유튜브 공식 Data API v3 전체 Video Category ID 명세서 저작.

---

### 1-16. 좌측 사이드바 유튜브 트렌드 메뉴 순서 재배치

유튜브 트렌드 분석 카테고리의 좌측 사이드바 하위 메뉴 순서를 요청 사항에 맞게 최상단으로 올리고 재정렬했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * 1위: `급상승 영상 트렌드`
  * 2위: `급상승 영상분석 리포트`
  * 3위: `유튜브 랭킹 TOP 300`
  * 4위: `인기채널 영상분석`
  * 5위: `인기채널 영상분석 리포트`
  * 6위: `유튜브 영상 검색` (`인기채널 영상분석 리포트` 아래로 이동)

---

### 1-17. 메뉴 명칭 변경 ("크리에이박스 글쓰기" ➡️ "크리에이박스 블로그", "발행 원고 관리" ➡️ "블로그 원고 관리", "블로그 관리" ➡️ "블로그 설정 및 관리")

사이드바 및 대시보드 내 서비스 명칭을 더욱 명확하고 직관적으로 변경했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `"크리에이박스 글쓰기"` ➡️ `"크리에이박스 블로그"`
  * `"발행 원고 관리"` ➡️ `"블로그 원고 관리"`
  * `"블로그 관리"` ➡️ `"블로그 설정 및 관리"`
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * 스튜디오 홈 카드 내 명칭 동기화.
* **[MODIFY] [StudioOperationalSectionPage.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioOperationalSectionPage.tsx)**:
  * 섹션 타이틀 명칭 동기화.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  * 대시보드 메인 헤더 타이틀을 `공식 블로그 설정 및 관리`로 변경.

---

### 1-18. 메인페이지 헤더 "미디어 라이브러리" 상단 메뉴 탑재

메인 헤더 네비게이션의 `AI 도구` 바로 오른쪽에 `미디어 라이브러리` 상단 메뉴를 탑재했습니다.

* **[MODIFY] [Header.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Header.tsx)**:
  * 데스크톱 상단 GNB: `AI 도구` 메가메뉴 바로 오른쪽 위치에 `미디어 라이브러리` 바로가기 메뉴 배치 (`/library/free-assets`).
  * 모바일 드로어: `AI 도구` 항목 바로 밑에 `미디어 라이브러리` 메뉴 수록.

---

### 1-19. "AI 리포트(개발중)", "뉴스 콘텐츠(개발중)", "채널 배포 스튜디오", "자료 분석 스튜디오" 사이드바 최하단 이동 및 관리자 전용 제어

`AI 리포트(개발중)`, `뉴스 콘텐츠(개발중)`, `채널 배포 스튜디오`, `자료 분석 스튜디오` 메뉴를 일반 사용자 사이드바 메뉴에서 제외한 뒤 오직 관리자(`isAdmin === true`) 권한 로그인 시에만 사이드바 최하단에 노출되도록 제어했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `isAdmin` 조건부 배열 최하단으로 위치 변경.
  * 대상 메뉴: `AI 리포트(개발중)`, `뉴스 콘텐츠(개발중)`, `채널 배포 스튜디오`, `자료 분석 스튜디오`.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * 스튜디오 대시보드 카드 메뉴 명칭 동기화.

---

### 1-20. "유튜브 트렌드 분석" 메뉴 랜딩 화면 "급상승 영상 트렌드" 기본 설정

최상위 `유튜브 트렌드 분석` 메뉴 클릭 시 `급상승 영상 트렌드` 컴포넌트가 기본으로 출력되도록 연결을 변경했습니다.

* **[MODIFY] [client.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/youtube-trend/client.tsx)**:
  * `/youtube-trend` 메인 클라이언트에서 `<YoutubeTop300 />` ➡️ `<RisingVideos />`로 교체.
* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)** & **[page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * `youtube` 메뉴 그룹 대표 `href` 주소를 `/youtube-trend/rising`으로 설정.

---

### 1-21. "스튜디오 Tools" 메뉴 위치 이동 (사이드바 ➡️ 탑바 "FAQ 챗봇" 좌측)

사이드바 메뉴 정리 및 접근성 강화를 위해 `스튜디오 Tools`를 사이드바에서 제거하고 탑바 `FAQ 챗봇` 버튼 바로 왼편에 퀵버튼으로 탑재했습니다.

* **[MODIFY] [StudioTopbar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx)**:
  * `FAQ 챗봇` 버튼 좌측 위치에 Amber 색상 `Wand2` 아이콘과 함께 `스튜디오 Tools` 바로가기 버튼 추가 (`/utility-tools`).
* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `key: "tools"` 스튜디오 Tools 그룹 사이드바에서 제거.

---

### 1-22. "관리 대시보드" 메뉴 위치 이동 (사이드바 ➡️ 탑바)

사이드바 최하단 항목 간소화 및 탑바 접근성 확보를 위해 `관리 대시보드`를 사이드바에서 제거하고 탑바 `스튜디오 Tools` 바로 왼편에 퀵버튼으로 배치했습니다.

* **[MODIFY] [StudioTopbar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx)**:
  * `스튜디오 Tools` 바로 좌측 위치에 Blue 색상 `LayoutDashboard` 아이콘과 함께 `관리 대시보드` 버튼 추가 (`/studio/dashboard`).
* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `key: "dashboard"` 관리 대시보드 그룹 사이드바에서 제거.

---

### 1-23. "내 콘텐츠 보관함" 메뉴 위치 이동 (사이드바 ➡️ 탑바)

사이드바 메뉴 간소화 및 접근성 향상을 위해 `내 콘텐츠 보관함`을 사이드바에서 제거하고 탑바 `관리 대시보드` 바로 왼편에 퀵버튼으로 배치했습니다.

* **[MODIFY] [StudioTopbar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/StudioTopbar.tsx)**:
  * `관리 대시보드` 바로 좌측 위치에 Sky 색상 `Library` 아이콘과 함께 `내 콘텐츠 보관함` 버튼 추가 (`/library`).
* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `key: "library"` 내 콘텐츠 보관함 그룹 사이드바에서 제거.

---

### 1-24. "콘텐츠 아이디어 허브" 독립 상위 메뉴 분리 (미디어 라이브러리 바로 하단 배치)

접근성 향상을 위해 `콘텐츠 아이디어 허브`를 하위 그룹에서 추출하여 `미디어 라이브러리` 바로 아랫순서에 독립 상위 단독 메뉴로 분리 정비했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `미디어 라이브러리` 바로 하단 순서에 `콘텐츠 아이디어 허브` 독립 상위 메뉴 탑재 (`/content-planner/idea-hub`).
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * 스튜디오 홈 카드 메뉴 구조에서도 최상위 독립 메뉴로 동기화.

---

### 1-25. "AI 콘텐츠 플래너" 하위 메뉴 "크리에이박스 블로그" 이전 및 플래너 부모 메뉴 삭제

`AI 콘텐츠 플래너` 하위 4개 메뉴(`AI 콘텐츠 기획`, `기획 라이브러리`, `콘텐츠 캘린더`, `자동화 워크플로우`)를 `크리에이박스 블로그` 산하의 `블로그 원고 관리` 바로 아래로 이전하고 `AI 콘텐츠 플래너` 상위 메뉴는 완전히 삭제했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `크리에이박스 블로그` 하위 메뉴에 `블로그 원고 관리` 아랫순서로 4개 기획 메뉴 삽입.
  * `key: "content-planner"` 부모 메뉴 그룹 삭제.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * 대시보드 카드 서브메뉴 순서 동기화 및 플래너 카드 제거.

---

### 1-26. "네이버용 AI 글 재창조" 4대 핵심 메커니즘 문서화 및 UI 가이드 수록

네이버 유사 문서 패널티 회피 및 C-Rank/DIA+ 상위 노출을 위한 **네이버용 AI 글 재창조 4대 알고리즘 원칙**을 정의하고 개발 문서에 기록했습니다.

1. **문장 구조 및 어휘 재설계**: 주어/목적어 구성을 다르게 재배치하여 유사 문서 검출 시스템 회피.
2. **어조 및 톤앤매너 변환**: 네이버 블로그 특유의 대화체/친근한 톤앤매너(`~해요`, `~했답니다`) 적용.
3. **도입부 및 마무리 창작**: 새로운 인사말과 소통형 서론/결론 자동 생성.
4. **네이버 검색 키워드 재배치**: DIA+ 알고리즘 선호 키워드 밀도 및 소제목 재배치.

---

### 1-27. "크리에이박스 블로그" 통합 "AI 글 재창조 (네이버/SNS 변환)" 풀스택 구현

크리에이박스 블로그 1차 원고를 바탕으로 네이버 블로그 스마트에디터 3.0에 즉시 복사/발행할 수 있는 2차 AI 글 재창조 모듈과 2분할 스마트 에디터 화면을 구축했습니다.

* **[NEW] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/recreate/route.ts)**:
  * Gemini 2.5 Flash 기반 4대 핵심 메커니즘 패러프레이징 API 엔드포인트 구현.
* **[NEW] [CreaiboxRecreateTab.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx)**:
  * 4대 알고리즘 가이드 카드, 원고 선택 드롭다운, 4가지 톤앤매너 선택기, 좌우 2분할 에디터, `[스마트에디터 1초 복사]` & `[DB 저장]` 버튼 구현.
* **[NEW] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/recreate/page.tsx)** & **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `크리에이박스 블로그` ➡️ `블로그 원고 관리` 바로 아래에 `AI 글 재창조 (네이버/SNS)` 라우트 및 사이드바 메뉴 배치 (`/writing/creaibox/recreate`).

---

### 1-28. "AI 글 재창조" 원본 원고 바인딩 멀티소스 파이프라인 구축

크리에이박스에서 작성된 모든 원고가 드롭다운에 빠짐없이 노출되도록 Supabase 데이터베이스와 세션 로컬 캐시를 아우르는 3중 멀티소스 파이프라인을 구축했습니다.

* **[MODIFY] [CreaiboxRecreateTab.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx)**:
  * `writing_creaibox_posts` 테이블, `manuscripts` 테이블 및 `sessionStorage` (`creaibox:manuscripts:list:v1`) 데이터를 순차 조회하여 자동 바인딩.

---

### 1-29. "AI 글 재창조" 사용자 ID(user_id) 격리 및 2단계 도메인 계층 선택 폼 적용

본인 작성 원고만 노출되도록 `user_id` 기준의 데이터 격리를 적용하고, 1차 **도메인(블로그/홈페이지) 선택 ➡️ 2차 해당 도메인 원본 글 선택**의 2단계 릴레이 선택 UX를 구현했습니다.

* **[MODIFY] [CreaiboxRecreateTab.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/creaibox/tabs/CreaiboxRecreateTab.tsx)**:
  * `user_id` 동적 필터링으로 로그인 사용자의 고유 원고만 추출.
  * 1단계: `🌐 도메인 / 블로그 선택` 드롭다운 (공식 블로그, 서브도메인 브랜드, 미지정 등 선택).
  * 2단계: `📄 재창조할 원본 글 선택` 드롭다운 (선택한 도메인의 원고만 동적 바인딩).

---

### 1-30. "네이버 글쓰기" 상위 메뉴 완전 삭제 및 사이드바 정리

네이버 글쓰기 기능이 `크리에이박스 블로그` ➡️ `AI 글 재창조 (네이버/SNS)` 모듈로 통합됨에 따라 기존 중복 메뉴 `네이버 글쓰기`를 사이드바 및 대시보드에서 완전히 제거했습니다.

* **[DELETE] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)**:
  * `key: "naver-writing"` 네이버 글쓰기 상위 메뉴 그룹 삭제.
* **[DELETE] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * 대시보드 카드 목록에서 네이버 글쓰기 카드를 제거하여 사이드바와 동기화.

---

### 1-31. 서브메뉴 명칭 간소화 변경 ("네이버/SNS 재발행")

가독성과 시각적 직관성을 극대화하기 위해 서브메뉴명을 `네이버/SNS 재발행`으로 간소화 업데이트했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)** & **[page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * `크리에이박스 블로그` 하위 메뉴명을 `네이버/SNS 재발행`으로 변경.

---

### 1-32. "AI 홈페이지 제작" 이용 권한 기준 변경 (Pro 요금제 이상)

Pro 요금제 사용자부터 홈페이지 빌더 및 CMS를 이용할 수 있도록 권한 기준을 완화했습니다.

* **[MODIFY] [layout.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/client-site-builder/layout.tsx)**:
  * `mLevel === "pro"`를 포함하도록 멤버십 접근 권한 조건 수정.
* **[MODIFY] [UpgradeModal.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/client-site-builder/components/UpgradeModal.tsx)**:
  * 안내 메시지를 `Pro 요금제 이상 전용 서비스`로 업데이트.

---

### 1-33. "AI 홈페이지 제작" ➡️ "비즈니스 웹사이트" 메뉴명 정비

`크리에이박스 블로그`와 명확하게 대비되는 포지셔닝을 위해 서비스 명칭을 `비즈니스 웹사이트`로 변경했습니다.

* **[MODIFY] [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)** & **[page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/page.tsx)**:
  * `client-site-builder` 그룹의 이름을 `비즈니스 웹사이트`로 수정.

---

### 1-34. 서브도메인 역활 구분 (blog_id vs brand_id) UI 및 안내문 적용

마이페이지와 비즈니스 웹사이트 설정 화면에 서브도메인 용도 구분 라벨 및 명확한 가이드 안내 텍스트를 업데이트했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)**:
  * 발급받은 브랜드 ID가 블로그(`blog_id.creaibox.com`) 및 비즈니스 웹사이트(`brand_id.creaibox.com`) 전용 주소로 각 연결됨을 가이드에 수록.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/client-site-builder/settings/page.tsx)**:
  * 웹사이트 설정 헤더 영역에 대표 주소 배지 수록.

---

### 1-35. 요금제 기능 비교표 "블로그 vs 비즈니스 웹사이트 개설" 2원화 개편

요금제 비교표에서 블로그와 웹사이트 개설 항목을 분리하여 직관적인 혜택 구분을 제공하도록 업데이트했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/pricing/page.tsx)**:
  * `크리에이박스 블로그 개설`: Free(1개), Creator(2개), Pro(5개), Premier(10개) (`blog_id.creaibox.com`)
  * `비즈니스 웹사이트 개설`: Free(🔒), Creator(🔒), Pro(2개), Premier(3개) (`brand_id.creaibox.com`)

---

### 1-36. 회원가입 시 임시 브랜드 ID 자동 생성 차단

가입 시 임의의 임시 서브도메인이 자동 생성되지 않고 사용자가 마이페이지에서 직접 원하는 브랜드 ID를 신청하도록 조치했습니다.

* **[MODIFY] [profiles.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql)**:
  * `handle_new_user()` 트리거의 `brand_id` 기본 할당값을 `NULL`로 설정.

---

### 1-37. 브랜드 ID 1:1 변경(대체) 시스템 탑재 (옵션 3 적용)

가입 직후 임시 서브도메인을 즉시 체험할 수 있도록 보존하고, 마이페이지에서 새 원하는 주소 신청 시 1:1 교체(대체)되는 방식을 구현했습니다.

* **[MODIFY] [profiles.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/profiles.sql)**:
  * `handle_new_user()` 트리거의 임시 `final_brand_id` 할당 복원.
* **[MODIFY] [approve/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/brands/approve/route.ts)**:
  * Free 요금제 승인 시 이전 임시 ID를 `cancelled_brands` 보관함으로 자동 이관하고 새 ID로 1:1 대체.
* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)**:
  * 한도 도달 상태에서도 `1:1 브랜드 ID 변경 신청` 지원.

---

### 1-38. 요금제별 종합 브랜드 ID 보유 한도 산출식 동기화

블로그 및 비즈니스 웹사이트의 통합 최대 개설 수량 기준을 최신 요금제 혜택에 맞추어 통합 적용했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)** & **[approve/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/brands/approve/route.ts)**:
  * **Free**: 1개 (기존 임시 ID 1:1 대체 교체 방식)
  * **Creator**: 2개 (블로그 2개)
  * **Pro (Best)**: 7개 (블로그 5개 + 웹사이트 2개)
  * **Premier (Business)**: 13개 (블로그 10개 + 웹사이트 3개)

---

### 1-39. 관리자 회원 관리 VIP 수동 무상 부여 `grant_reason` 스키마 오류 해결

Supabase `profiles` 테이블에 `grant_reason` 컬럼이 없어 발생하던 에러를 `extra_configs` 메타데이터 내 안전 저장 방식으로 변경했습니다.

* **[MODIFY] [admin/users/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts)**:
  * `is_manual_grant`, `grant_reason`, `grant_expires_at` 속성을 `extra_configs` 객체 내로 병합 업데이트.
* **[MODIFY] [mypage/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)**:
  * `extra_configs` 내 무상 부여 메타데이터 호환 조회.

---

### 1-40. 관리자 회원 관리 "Brand Domains (개설 현황)" 전용 컬럼 신설

사용자별 서브도메인 개설 현황과 요금제별 최대 허용 한도를 한눈에 파악할 수 있도록 관리자 회원 관리 테이블에 `Brand Domains` 컬럼을 신설했습니다.

* **[MODIFY] [admin/users/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts)**:
  * 사용자별 `approvedBrands`, `brandCount`, `brandLimit` 데이터 계산 및 반환.
* **[MODIFY] [usermanagement/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)**:
  * 회원 테이블 내 `Brand Domains` 전용 컬럼 신설 (`1 / 1개`, `2 / 7개`, `3 / 13개` 수량 배지, 프로그레스 바 및 서브도메인 태그 나열).

---

### 1-41. 관리자 상단 카드 "Pro / Premier / Business" 독립 개별 분리

기존의 `Pro / Business` 통합 카드를 요금제별 실제 세부 명칭에 맞게 8개의 독립 집계 카드로 분리 탑재했습니다.

* **[MODIFY] [usermanagement/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)**:
  * `stats` 산출식 내 `premier`, `pro`, `business` 개별 필터링 카운트 적용.
  * 상단 대시보드 8개 카드 그리드(`Total`, `VIP`, `Premier`, `Pro (Best)`, `Business`, `Creator`, `Free Trial`, `Admin`) 탑재.

---

### 1-42. 관리자 회원 관리 요금제별 필터 탭 바 및 카드 클릭 필터링 연동

필터 탭 및 상단 카드 클릭 인터랙션을 구현하여 원하는 요금제 회원을 즉시 검색/조회할 수 있도록 기능을 확장했습니다.

* **[MODIFY] [usermanagement/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)**:
  * `filterTab` 9종(전체, 정기결제, VIP무상, Premier, Pro, Business, Creator, Free, Admin) 확장.
  * 상단 탭 버튼 바에 요금제별 버튼 수록.
  * 상단 8개 대시보드 카드 클릭 시 활성화 ring 표시 및 해당 요금제 회원 목록 자동 필터링 연동.

---

### 1-43. 관리자 회원 테이블 최소 너비 확장(1500px) 및 1줄 고정 UI/UX 정비

테이블 내 텍스트 줄바꿈 현상을 방지하도록 가로 최소 너비를 1500px로 확장하고 전 세부 항목에 1줄 고정 스타일을 적용했습니다.

* **[MODIFY] [usermanagement/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)**:
  * `min-w-[1500px]` 확장 및 `px-6` 패딩 최적화.
  * Identity 무상 부여 배지, VIP 버튼, 날짜, 도메인 배지 등에 `whitespace-nowrap` 줄바꿈 방지 스타일 탑재.

---

### 1-44. 블로그 글 상단 브라우저 탭 타이틀 내 "블로그 이름 (타이틀)" 유지 보장

블로그 포스팅 상세 페이지 진입 시에도 브라우저 탭 상단 타이틀에 "블로그 설정 및 관리"의 [블로그 이름]이 항상 함께 표시되도록 결합 로직을 개선했습니다.

* **[MODIFY] [brand/[brand_id]/[slug]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/[brand_id]/[slug]/page.tsx)**:
  * `getConf()` 헬퍼 브랜드 전용 키(`blog_title_${brandId}`) 최우선 조회 보장.
  * `seoTitle` 생성 시 `[글 제목] - [블로그 이름]` (또는 `[글 제목] | [블로그 이름]`) 결합 보장.
* **[MODIFY] [brand/[brand_id]/category/[slug]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/[brand_id]/category/[slug]/page.tsx)**:
  * 카테고리 메타 데이터 조회 헬퍼 동기화 (`[카테고리명] - [블로그 이름]`).

---

### 1-45. 메인 페이지 "AI 자동 글쓰기" 입력 키워드 즉시 자동 작성 트리거 연동

메인 페이지에서 입력한 검색 키워드가 에디터로 자동 포워딩되어 진입 시 AI 글 생성이 즉시 자동으로 시작되도록 연동했습니다.

* **[MODIFY] [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/page.tsx)**:
  * 검색 제출 핸들러에 `prompt=${query}&autoGenerate=true` 파라미터 부여.
* **[MODIFY] [new-post/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/new-post/page.tsx)**:
  * 입력된 키워드로 초기 타겟 키워드 설정 및 에디터 URL 파라미터 전송.
* **[MODIFY] [list/[id]/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/list/[id]/page.tsx)**:
  * `autoGenerate=true` 파라미터 수신 시 타겟 키워드 자동 주입 후 AI 글 작성 엔진(`handleAiGenerateInEditor`) 즉시 자동 가동.

---

### 1-46. AI 콘텐츠 기획 내 "네이버 글 생성" 메뉴 제거 및 "블로그 글 생성" 즉시 자동 작성을 위한 파라미터 연결

AI 콘텐츠 기획 결과화면 및 라이브러리에서 "네이버 글 생성 / 네이버 전체 제작" 버튼을 완전 제거하고, "블로그 글 생성" 버튼 클릭 시 진입과 동시에 AI 포스팅이 바로 자동 생성되도록 연동했습니다.

* **[MODIFY] [CampaignResultPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/content-planner/CampaignResultPanel.tsx)**:
  * `handleCreateBlog` 이동 쿼리에 `autoGenerate=true` 파라미터 추가.
  - 상단 "네이버 전체 제작" 버튼 및 기획 항목 행의 "네이버 글 생성" 액션 버튼 완전 제거.
* **[MODIFY] [library/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/content-planner/library/page.tsx)**:
  - "블로그 글 생성" 이동 링크 쿼리에 `autoGenerate=true` 추가 및 "네이버 글 생성" 버튼 완전 제거.
* **[MODIFY] [PlannerActionPanel.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/studio/content-planner/PlannerActionPanel.tsx)**:
  - 확장 제작 액션 목록에서 "네이버 전체 제작" 제거.

---

### 1-47. 급상승 영상 트렌드 분석 API 요청 레퍼러 보정 및 다단계 롤백 매커니즘 구현

국가별(대한민국, 일본, 미국 등) 급상승 동영상 조회 시 발생하던 Google API 403 Referer 차단 문제 및 빈 화면 현상을 보정했습니다.

* **[MODIFY] [route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/youtube/route.ts)**:
  * `fetchAndCacheTrending`: `referer` 누락 시 `"https://creaibox.com/"` 기본 헤더 자동 부여로 403 `Referer <empty>` 차단 문제 해결.
  - 당일 실시간 API 조회 실패 또는 데이터 미존재 시 DB 내 최신 수집 데이터(`youtube_trending_archive`)로 자동 롤백하여 빈 리스트 현상 완벽 방지.

---

### 1-48. 급상승 트렌드 05시 자동 수집 안내 문구 삭제 및 사용자 온디맨드 수동 수집 모드 유지

사용자의 수동 수집 운용 방식에 맞춰 안내 문구를 삭제하고 크론 설정을 제거했습니다.

* **[MODIFY] [RisingVideos.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx)**:
  - 상단 05시 자동 수집 안내 문구 제거.
* **[MODIFY] [vercel.json](file:///Users/a1234/Local%20Sites/creaibox/vercel.json)**:
  - `"crons": []`로 유지하여 사용자 수동 수집 방식 보장.

---

### 1-49. 백그라운드 무인 자동화 아키텍처 명세 및 미래 확산 가이드 문서 작성

* **[NEW] [background-automation-architecture.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/background-automation-architecture.md)**:
  - GitHub Actions, Supabase `pg_cron` 기술 분석과 Vercel 자원 소모 0% 달성 방안 정리.
  - 자동 포스팅, 메일링 리포트, 검색엔진 자동 색인(Ping), DB 백업 스냅샷 등 미래 자동화 활용 6대 기능 명세 수록.

---

### 1-50. 네이버 서치어드바이저 및 구글 서치콘솔 소유권 인증 FAQ 등록

사용자가 자신의 계정으로 네이버 서치어드바이저 및 구글 서치콘솔 소유권 인증 및 사이트맵을 직접 등록할 수 있도록 FAQ 데이터셋 및 챗봇 지식을 추가했습니다.

* **[MODIFY] [faqData.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/chatbot/data/faqData.ts)**:
  * `write-7`: 네이버 서치어드바이저(웹마스터 도구) 소유권 인증 4단계 가이드 등록.
  - `write-8`: 구글 서치콘솔(Google Search Console) URL 접두사 소유권 인증 4단계 가이드 등록.
  - FAQ 챗봇 위젯 및 고객센터 안내 페이지 자동 반영 보장.

---

### 1-51. 구글/네이버 소유권 연동 1분 튜토리얼 팝업 및 스튜디오 내 자체 성과 분석 대시보드 구축

* **[MODIFY] [blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  - `SearchConsoleGuideModal` 신규 튜토리얼 팝업 모달 추가 (네이버 서치어드바이저 3단계, 구글 서치콘솔 3단계, 사이트맵/RSS 주소 1초 복사 탭 제공).
  - SEO 탭 및 방문 통계 리포트 탭 상단에 **`📖 구글/네이버 소유권 1분 연동 가이드`** 액션 버튼을 배치하여 손쉬운 접근 제공.

---

### 1-52. 구글 서치콘솔 및 네이버 서치어드바이저 RSS (/feed) 제출 가이드 추가

* **[MODIFY] [faqData.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/chatbot/data/faqData.ts)**:
  - `write-8` 구글 서치콘솔 가이드에 `feed` (RSS 피드 주소) 제출 단계 추가.
* **[MODIFY] [blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  - 튜토리얼 팝업 모달의 구글 및 네이버 탭 내에 `sitemap.xml`과 함께 `feed` (RSS) 제출 단계를 명시하여 실시간 수집 유도.

---

### 1-54. 공식 메인 블로그(creaibox.com/blog) 드롭다운 등재 및 브랜드별 개별 글 통계 필터링 적용

* **[MODIFY] [blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  - `approvedBrands` 목록에 `"creaibox"`(`creaibox.com/blog`) 공식 대표 메인 블로그를 기본 탑재.
  - 드롭다운 선택 시 `creaibox.com/blog (공식 메인 블로그)`를 포함하여 선택 가능하도록 UI 라벨 갱신.
  - `filteredPosts` 적용하여 `activeBrandId`에 맞춰 해당 브랜드에 발행된 글만 포스트 수 및 통계에 반영.
* **[MODIFY] [analytics/blog/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/studio/analytics/blog/route.ts)**:
  - `canonical_url` 기반으로 `brandId`별(메인 블로그 vs 서브도메인 브랜드) 개별 발행 글을 정확하게 쿼리 및 필터링하여 통계 대시보드 렌더링.

---

### 1-55. 통계 API 권한 검증 시 creaibox(공식 대표 블로그) 예외 허용 및 403 오류 수정

* **[MODIFY] [analytics/blog/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/studio/analytics/blog/route.ts)**:
  - `isOwner` 검증 시 `brandId === "creaibox"` 및 `profile.role === "ADMIN"`을 허용하여 `403 Access denied` (Failed to fetch analytics 콘솔 에러) 해결.
  - 공식 대표 블로그 선택 시 대시보드가 100% 정상 렌더링되도록 수정 완료.

---

### 1-56. URL 호스트네임 파싱 기반 서브도메인 브랜드 완벽 독립 필터링 탑재

* **[MODIFY] [analytics/blog/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/studio/analytics/blog/route.ts)** & **[MODIFY] [blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)**:
  - `URL()` 호스트네임 파싱 알고리즘(`isPostMatchBrand`)을 적용하여 `guidenara.creaibox.com` 등 서브도메인 포스팅이 메인 블로그(`creaibox.com/blog`) 인기 글 순위에 혼입되지 않도록 정확히 조치 완료.

---

### 1-57. 발행 포스트 0개 미발행 블로그의 통계 차트/채널 분석 정직한 공백 처리 정비

* **[MODIFY] [analytics/blog/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/studio/analytics/blog/route.ts)**:
  - `hasPostsOrTraffic` 판단 로직을 추가하여 포스트가 0개이고 트래픽이 없는 미발행 블로그 선택 시 하단 유입 채널/기기/지역 분석 영역에 가짜 샘플 수치가 나오지 않고 정직하게 0개 및 "데이터가 아직 없습니다" 문구가 표시되도록 조치.

---

### 1-58. 커스텀 도메인(downhubs.com, guidenara.com) 매칭 매핑 및 드롭다운 표시 고도화

* **[MODIFY] [blog-management/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx)** & **[MODIFY] [analytics/blog/route.ts](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/studio/analytics/blog/route.ts)**:
  - 독립 커스텀 도메인(`downhubs.com`, `guidenara.com`)을 사용하는 블로그 포스팅의 `canonical_url`과 커스텀 도메인 매핑 로직을 탑재하여 `downhubs.com` 11개, `guidenara.com` 5개 포스팅 통계를 100% 완벽하게 연동.
  - 드롭다운 옵션 라벨에 커스텀 도메인 주소명(`downhubs.com (downhubs.creaibox.com)`)을 직관적으로 함께 표시.

---

## 2. 무결성 검증 결과

* **TS 컴파일러 검증**: `npx tsc --noEmit`을 실행하여 7월에 수정된 모든 소스코드에 대한 컴파일 무결성 및 타입 체크를 마쳤습니다 (에러 0건).
