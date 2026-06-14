# 정보센터 (Info Center)

이 문서는 크리에이터들의 전략적 지식 베이스캠프인 정보센터 모듈의 현재 아키텍처 및 화면 구조를 설명하는 상시 운영용 문서입니다.

---

## 1. 목적 (Purpose)
* 크리에이터들이 공지사항, 자유게시판, Q&A, 팁/노하우, 쇼케이스, 자주 묻는 질문 등 다양한 창작 도메인의 지식을 한눈에 교류할 수 있는 지식 베이스캠프 공간을 제공합니다.
* 전체 페이지 이동 및 화면 전환 딜레이를 최소화하기 위해 단일 페이지 내에서 탭 메뉴, 글 상세 조회, 글 작성 및 편집을 끊김 없이 즉각 처리하는 단일 페이지 애플리케이션(SPA) 구조로 설계하여 사용자 경험을 개선합니다.

---

## 2. 주요 기능 (Main Features)
1. **카테고리 탭 네비게이터**: 상단 탭 클릭 시 전체 피드 및 각 카테고리(공지사항, 자유게시판, Q&A, 팁, 쇼케이스, FAQ)의 게시글들을 페이지 리로드 없이 즉시 스위칭합니다.
2. **실시간 데이터 동기화**: Supabase Realtime 리스너를 바인딩하여 새로운 게시글이 작성되거나 수정되면 화면상의 목록을 실시간으로 자동 갱신합니다.
3. **간결한 포스트 뷰어**: 본문 가로 폭을 홈 레이아웃과 동일하게 제한(`max-w-4xl`)하고, Markdown 렌더링, 첨부파일 자동 다운로드, 본문 추천(Likes) 및 토론(Comments) 영역을 한데 엮어 제공합니다.
4. **마크다운 위지윅 에디터**: 제목, 본문 입력과 이모지 선택, 이미지 드래그앤드롭 업로드, 일반 파일 다중 첨부 기능을 지원합니다.
5. **브라우저 히스토리 결속**: SPA 상태 변경(목록 -> 상세 -> 글쓰기) 시 `window.history.pushState`를 활용하여 주소창 URL을 실제 페이지 경로와 매칭시킵니다. 이를 통해 페이지 뒤로가기/앞으로가기 모션이 정상 작동하며 직접 공유 링크 접근 시에도 해당하는 상태를 즉시 재현해냅니다.

---

## 3. UI 및 동적 라우팅 (Routing Structure)
* **메인 컨트롤러**: `src/components/infocenter/UnifiedInfoCenter.tsx`
  - 현재 뷰(`list` | `view` | `write`), 카테고리 필터, 활성 포스트 ID를 중앙 상태로 관리하고 브라우저 `popstate` 이벤트를 감지하여 제어합니다.
* **진입 라우트**:
  - `/studio/infocenter`: 전체 목록 홈
  - `/studio/infocenter/list/[category]`: 카테고리 지정 목록 진입
  - `/studio/infocenter/view/[id]`: 특정 게시글 직접 조회
  - `/studio/infocenter/writing`: 글쓰기 및 수정 폼 진입
  - *모든 진입 경로가 내부적으로 동일한 `<UnifiedInfoCenter>` 컨트롤러를 렌더링하여 통일된 디자인과 SPA의 빠른 상태 전이를 보장합니다.*

---

## 4. 데이터베이스 구조 (Database Structure)
* **`community_posts`**: 게시글 본문 정보
  - `id` (uuid, primary key)
  - `title`, `content` (text)
  - `post_type` (text - notice, free, qna, tips, showcase, faq)
  - `user_email`, `user_nickname` (text)
  - `like_count`, `view_count` (int)
  - `image_urls` (text[])
  - `created_at` (timestamptz)
* **`community_comments`**: 게시글 댓글 정보
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key)
  - `user_email`, `user_nickname` (text)
  - `content` (text)
  - `created_at` (timestamptz)
* **`community_likes`**: 중복 추천 방지용 맵 테이블
  - `id` (int8, primary key)
  - `post_id` (uuid, foreign key)
  - `user_email` (text)
  - `created_at` (timestamptz)

---

## 5. 컴포넌트 구조 (Component Structure)
* `src/components/infocenter/`
  - `UnifiedInfoCenter.tsx`: 헤더 배너, 상단 가로 탭 바 및 뷰 전환 렌더링 담당.
  - `InfoBoardList.tsx`: 게시글 목록 테이블, 조회수/추천수 및 검색 바.
  - `InfoBoardView.tsx`: constrained 뷰어 패널, 첨부파일 리스트, 추천 토글 및 댓글창(수정/삭제/이모지 지원).
  - `InfoBoardWrite.tsx`: 카테고리 칩 선택, 에디터 및 첨부파일 관리 폼.
