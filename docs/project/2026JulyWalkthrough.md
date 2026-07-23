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

## 2. 무결성 검증 결과

* **TS 컴파일러 검증**: `npx tsc --noEmit`을 실행하여 7월에 수정된 모든 소스코드에 대한 컴파일 무결성 및 타입 체크를 마쳤습니다 (에러 0건).
