# 정보센터 설계 명세서 (Info Center Design Spec)

이 문서는 정보센터 모듈의 세부 설계 사양, 데이터베이스 상호작용 및 UI/UX 인터랙션 설계 원칙을 기재한 사양서입니다.

---

## 1. 아키텍처 의사결정 (Architecture Decisions)
* **단일 페이지 컴포넌트 라우팅 스윙 (Single-Page Component Swapping)**:
  - 정보센터의 모든 서브 페이지들을 개별로 관리하던 이전 버전의 성능 문제를 극복하고 즉각적인 사용성을 보장하기 위해, 하나의 `UnifiedInfoCenter.tsx` 컴포넌트 내에서 내부 뷰(`list`, `view`, `write`)를 React Local State로 즉각 스왑 렌더링하도록 변경했습니다.
* **주소창 히스토리 결속 (History State Push Sync)**:
  - 단순 SPA로 구현할 시 발생하는 주소창 불일치 및 뒤로가기 불능 문제를 방지하기 위해, 뷰의 변화가 수반될 때마다 HTML5 `window.history.pushState`를 호출하여 실제 주소를 갱신하도록 설계했습니다.
  - 브라우저 뒤로가기/앞으로가기 액션은 `popstate` 이벤트 리스너를 감지해 로컬 React State를 역으로 다시 주입 동기화함으로써, 완벽한 브라우저 네비게이션 제어 규칙을 충족합니다.

---

## 2. UI/UX 디자인 가이드라인 (UI/UX Decisions)
* **슬라이드업 애니메이션 배제 및 페이드인 적용**:
  - 기존 레이아웃이 지니고 있던 하단에서 위로 솟구쳐 오르는 슬라이드 모션(`slide-in-from-bottom`)은 화면 집중력을 분산시키고 동작 딜레이를 체감하게 하므로 전면 배제했습니다.
  - 탭 클릭 및 화면 전환 시에는 200ms 미만의 즉각적인 투명도 전이(`animate-in fade-in duration-200`)만을 주어, 시각적인 부드러움과 신속한 기기 반응 감각을 극대화했습니다.
* **가로폭 제약과 보드형 디자인 (Constrained Board Width)**:
  - 본문 조회(`InfoBoardView`) 화면이 좌우로 과도하게 넓어 텍스트 시선 추적이 깨지는 현상을 바로잡고자 본문 너비를 홈 레이아웃과 일치하는 `max-w-4xl`로 좁혔습니다.
  - 각 카테고리 태그마다 차별화된 HSL 파스텔 톤 보더 배색을 적용하여 게시판 글들의 성격(예: Notice는 Red, Free는 Blue)이 시각적으로 일목요연하게 분별되도록 꾸몄습니다.

---

## 3. 데이터베이스 및 API 동작 규칙 (Database & API Rationale)
* **조회수 중복 방지 및 증계 RPC 호출**:
  - 상세 조회 진입 시 무차별적인 조회수 어뷰징을 보완하기 위해 클라이언트 다이렉트 UPDATE 대신 Supabase RPC `increment_community_post_view`를 호출해 데이터 쓰기를 안전하게 위임합니다.
* **첨부파일 블롭 다운로드 (Blob Download Execution)**:
  - 웹브라우저에서 이미지나 텍스트 파일 클릭 시 다운로드되지 않고 새 창에서 열리거나 뷰어로 선점되는 현상을 예방하기 위해, 클라이언트 단에서 `fetch(url)`를 통해 Binary Blob으로 변환한 뒤 임시 링크 엘리먼트를 동적 주입해 저장시키는 강제 다운로드 파이프라인을 구축했습니다.
