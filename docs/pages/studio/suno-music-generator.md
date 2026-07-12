# Suno Music Studio (Suno 곡 생성 연동 서비스 개발 명세서)

본 문서는 **CreAibox AI Studio** 내의 **"Suno 곡 생성"** 메뉴에 대한 UI/UX 구조, 연동 플로우 및 기술 명세를 상세하게 기록합니다.

---

## 1. 개요 및 설계 목표
* **목표**: CreAibox의 "AI 앨범 기획" 기능에서 설계된 음악 기획 데이터(스타일, 가사 등)를 글로벌 AI 작곡 서비스인 **Suno.com**의 실시간 세션과 매끄럽게 연결하여, 사용자가 한 번의 흐름으로 고품질의 AI 음악을 생성, 감상, 관리할 수 있도록 지원합니다.
* **디자인 테마**: Suno.com의 다크 프리미엄 테마를 계승하되, CreAibox 디자인 시스템과 일관된 에메랄드/그린 포인트 컬러 및 슬릭한 Glassmorphism 효과를 융합했습니다.

---

## 2. 주요 기능 명세

### 📂 A. One-Stop 기획-생성 연동 워크플로우
* **자동 Prefill 기능**:
  * "AI 앨범 기획" 또는 "생성곡 라이브러리"에서 곡명 옆의 **[Suno 곡 생성]** 버튼을 클릭하면, 해당 곡의 스타일 프롬프트 및 가사가 `sessionStorage`를 통해 자동으로 본 화면의 입력창에 프리필됩니다.
  * 가사 데이터가 존재할 경우, 가사 폼(`Write` 모드)이 활성화되며 고급 옵션 아코디언이 자동으로 개방됩니다.

### ✍️ B. Suno Clone UI 입력 폼 설계 (Suno.com 100% 매칭)
Suno.com의 UX 동선과 일치하도록 세로 스크롤 레이아웃을 전면 개편했습니다.
1. **Suno 생성 모델 버전 선택**: v4 Pro부터 최신 v5.5 Pro 모델까지 드롭다운 형태로 손쉽게 전환할 수 있습니다.
2. **Lyrics (가사) 카드 (최상단)**:
   * `Write` (가사 직접 작성), `Prompt` (테마 제시 자동 가사), `Instrumental` (가사 없는 순수 연주곡) 3대 모드를 제공합니다.
3. **Styles (스타일 프롬프트) 카드 (중간)**:
   * **마법사(Enhancer 🪄)**: 밋밋한 입력 단어 뒤에 고음질 음향 기기 배치 명칭 및 장식용 수식어를 AI 스타일로 자동 덧붙여 줍니다.
   * **🎲 랜덤 셔플**: 미리 조율된 고품질의 장르/템포 프리셋 문장을 무작위로 적재합니다.
   * **추천 스타일 칩**: `anime pop`, `soft punk`, `italodisco` 등 20여 가지의 추천 태그를 가로 스크롤 형태로 제공하며, 클릭 시 프롬프트에 자동 누적됩니다.
4. **More Options 아코디언 (하단 숨김 옵션)**:
   * 가사 모드 스위칭, **보컬 성별(Male / Female / Both) 세그먼트 스위치**, 무작위성(Weirdness) 및 스타일 반영 강도(Style Influence) 조절 슬라이더를 접이식 아코디언 내에 수납했습니다.

### 🗂️ C. 워크스페이스 폴더 관리
* **폴더 생성/이동**: 분위기별, 장르별, 프로젝트별로 워크스페이스 폴더를 무제한으로 생성할 수 있습니다.
* **이동 및 삭제**: 각 폴더 우측의 더보기 메뉴를 통해 폴더를 삭제(Move to Trash)할 수 있으며, 삭제 시 폴더에 속한 곡들이 휴지통으로 이동합니다.

### 💾 D. 고화질 다운로드 엔진
* **단곡 다운로드**: 개별 트랙 우측의 다운로드 메뉴에서 **MP3 고음질 받기**, **WAV 무손실(Pro)**, **앨범 커버 다운**, **Style 프롬프트 클립보드 복사**를 지원합니다.
* **전체 다운로드**: 워크스페이스 내 모든 트랙을 대상으로 **MP3, WAV, 앨범 커버** 자산을 순차 일괄 다운로드할 수 있는 대량 다운로드 배치 매니저가 탑재되었습니다.

### 🔍 E. Suno 실시간 다기능 필터 컨트롤 바
곡 목록 영역 최상단에 Suno.com의 필터 제어 장치를 완벽하게 구현했습니다.
* **🔍 Search 필터**: 곡 제목, 스타일 태그, 프롬프트 본문 검색을 실시간으로 수행합니다.
* **⚙️ Filters 체크리스트**: Liked, Disliked, Public, Private, Uploads 체크 상태에 따라 실시간으로 목록을 거르며, "Hide Disliked(싫어요 곡 숨김)" 옵션을 제공합니다.
* **🔃 Sorting**: Newest(최신순), Oldest(과거순), Most Liked(좋아요 많은순), Least Liked(좋아요 적은순) 기준으로 목록 정렬이 실시간 동기화됩니다.
* **🖼️ 3대 View Modes**:
  * `List`: 가로 1줄 기본 테이블 형태.
  * `Waveform`: 활성 재생 중인 곡 옆에 **춤추는 오디오 이퀄라이저 파형 애니메이션**이 표시됩니다.
  * `Grid`: 앨범 아트를 큼직하게 내세운 **3열 바둑판식 카드 갤러리**로 전환됩니다.
* **단축 필터 칩**: 우측 끝에 Liked / Public / Uploads 퀵 토글 버튼을 마련하여 빠르게 목록을 걸러볼 수 있습니다.

### 🎵 F. 프리미엄 플레이어 및 우측 상세 Aside 패널
* **fixed 하단 플레이어 바**:
  * 높이 `h-20` (80px) 확장 및 솔리드 블랙 `bg-[#020306]/95` 배경 적용.
  * **상단 방향의 짙은 블랙 그림자 음영 (`shadow-[0_-12px_36px_rgba(0,0,0,0.95)]`)**과 `backdrop-blur-md` 필터를 통해 본문 스크롤 영역 위로 붕 떠 있는 듯한 완벽한 레이어 분리감과 시인성을 구현했습니다.
  * 진행률 조절 슬라이더, 볼륨 조절 슬라이더, 트랙 이동(앞/뒤), 곡 공유 및 스타일 복사 핫키를 탑재했습니다.
* **우측 Aside 상세 정보 패널**:
  * 활성 트랙 선택 시 오른쪽에서 슬라이드 오픈됩니다.
  * **가사 복사 버튼**: 가사 영역 헤더 옆에 가사 텍스트를 즉시 복사하는 클립보드 단축 버튼을 제공합니다.
  * **앨범 커버 다운로드**: 커버 이미지 우측 하단(`bottom-3 right-3`)에 절대좌표 오버레이 다운로드 아이콘을 탑재하여 언제든 이미지를 PC에 저장할 수 있습니다.

---

## 3. 크롬 익스텐션 연동 명세 & 배포 가이드

CreAibox와 Suno.com 간의 완벽한 탭 연동을 위해 **Manifest V3** 규격의 전용 크롬 익스텐션을 구축했습니다.

### 💻 A. 개발자 버전 로컬 설치 방법 (Load Unpacked)
웹 스토어 출시 전에 로컬 개발 환경에서 즉시 설치하여 테스트하는 방법입니다.

1. 구글 크롬 브라우저를 열고 주소창에 `chrome://extensions` 를 입력하여 확장 프로그램 관리자 페이지로 이동합니다.
2. 우측 상단의 **[개발자 모드 (Developer mode)]** 스위치를 활성화합니다.
3. 좌측 상단에 노출되는 **[압축해제된 확장 프로그램을 로드합니다 (Load unpacked)]** 버튼을 클릭합니다.
4. 폴더 선택 창에서 아래의 로컬 익스텐션 소스 경로 폴더를 지정합니다:
   * `/Users/a1234/Local Sites/creaibox/suno-chrome-extension`
5. 로드가 완료되면 크롬 툴바에 퍼즐 모양 아이콘을 눌러 `CreAibox Suno Connector`를 고정하고 실시간 프리필 동작을 확인할 수 있습니다.

---

### 📊 B. 확장 프로그램 설치/배포 방식 비교

일반 사용자 배포 시 선택할 수 있는 3가지 방식의 장단점 분석입니다:

| 구분 | 🌐 스토어 정식 배포 (Public) | 🔗 스토어 일부 공개 (Unlisted) | 🛠️ 개발자 로컬 로드 (Unpacked) |
| :--- | :--- | :--- | :--- |
| **일반인 설치 난이도** | **최하 (매우 쉬움)**<br>스토어에서 [Chrome에 추가] 원클릭 | **최하 (매우 쉬움)**<br>링크 클릭 후 [Chrome에 추가] 원클릭 | **최상 (어려움)**<br>설정 활성화 및 수동 폴더 연결 필요 |
| **배포 보안 경고창** | **없음** (완벽히 안전) | **없음** (완벽히 안전) | **매일 발생**<br>브라우저 실행 시 해제 권고 알림 발생 |
| **구글 스토어 검색 노출** | **노출됨** (전 세계 공개) | **비노출** (주소를 가진 회원만 유입) | **비노출** |
| **적합한 사용 시나리오** | 불특정 다수의 신규 회원을 확보하고 스토어 마케팅을 노출할 때 | **CreAibox 기존 유료/무료 회원에게만 특화 툴로 연결하여 배포할 때 (권장 💡)** | 개발 단계에서 로컬 연동 기능을 즉석 디버깅할 때 |

---

### 🚀 C. 크롬 웹 스토어 신청 및 일부 공개 배포 프로세스
"일부 공개" 또한 구글 웹 스토어 인프라를 타므로 아래의 업로드 및 구글 심사 절차를 무조건 거쳐야 합니다.

#### 1단계: 개발자 계정 준비 및 소스 압축
* **개발자 등록**: [Chrome 웹 스토어 개발자 콘솔](https://chrome.google.com/webstore/devconsole/)에 접속하여 개발자 계정을 등록합니다. (최초 1회 구글 등록 비용 **$5** 결제 필요)
* **파일 압축**: `suno-chrome-extension` 폴더 내부의 파일들(`manifest.json`, `background.js`, `content-creaibox.js`, `content-suno.js`, `popup.html`, `popup.js`, `icon.png`)을 드래그하여 하나의 `suno-chrome-extension.zip` 파일로 압축합니다.
* **주의**: `.git`, `node_modules`, `CHROMEWEBSTORE.md` 와 같은 로컬 문서 파일은 zip 파일 압축 영역에서 제외해야 업로드 거절을 피할 수 있습니다.

#### 2단계: 대시보드 업로드 및 메타데이터 작성
* **ZIP 업로드**: 개발자 콘솔에서 [새 항목 추가] 버튼을 누르고 `suno-chrome-extension.zip`을 업로드합니다.
* **심사 소명서 (Permission Justification) 작성**:
  * 구글 심사단은 익스텐션이 요구하는 백그라운드 권한을 민감하게 확인합니다.
  * 제출란의 권한 소명 사유란에 아래의 명확한 문구를 복사하여 제출하십시오:
    * `storage`: "Used to temporarily cache pending prefill style tags and prompt texts when navigating users from the CreAibox platform to Suno.com."
    * `tabs`: "Required to detect open client dashboard tabs and securely relay background track metadata updates between tabs."

#### 3단계: 배포 옵션 선택 및 심사 제출
* **일부 공개 (Unlisted) 지정**: 콘솔의 [이용 가능 여부(Visibility)] 옵션에서 반드시 **`일부 공개 (Unlisted)`**를 라디오 버튼으로 선택합니다.
* **제출 및 대기**: [심사 받기 위해 제출] 버튼을 누르면 구글 보안 팀의 검토가 시작됩니다. (통상 24시간 ~ 72시간 소요)
* **스토어 ID 반영**:
  * 구글 승인이 완료되면 `https://chromewebstore.google.com/detail/creaibox-suno-connector/[고유_확장프로그램_ID]` 형태의 전용 다운로드 링크가 생성됩니다.
  * 이 발급된 ID 값을 `src/app/studio/music/suno-generator/page.tsx` 내의 `YOUR_EXTENSION_ID_PLACEHOLDER`와 치환하여 서비스를 최종 업데이트합니다.

---

## 4. 파일 및 경로 구성
* **페이지 컴포넌트**: [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/music/suno-generator/page.tsx)
* **크롬 커넥터 소스 디렉토리**: [suno-chrome-extension/](file:///Users/a1234/Local%20Sites/creaibox/suno-chrome-extension/)
* **가사 및 스타일 탬플릿 DB**: `SONG_LYRICS_DB`, `SUGGESTED_CHIPS` 등 연동 데이터 셋

---

## 5. 컴파일 검증 완료
* TypeScript 컴파일 테스트 (`npx tsc --noEmit`) 100% 통과 완료.
