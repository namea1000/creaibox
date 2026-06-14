# 정보센터 화면 정의서 (Page Specification)

이 문서는 정보센터 모듈 및 관련 SPA 페이지의 라우팅 정보와 스펙을 정리한 정의서입니다.

---

## 1. 정보센터 홈 (Info Center Base)
* **경로**: `/studio/infocenter` -> [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/infocenter/page.tsx)
* **설명**: 정보센터의 엔트리 포인트입니다. 전체 피드(`all` 필터) 뷰 선택 시 1열에 2개씩 총 3행(3x2 그리드)으로 구성된 6대 주제별 미니 게시판 보드 섹션을 마운트합니다. 각 보드는 최신 게시글 5개씩을 줄 맞춰 균등한 높이로 정렬 노출합니다.

---

## 2. 카테고리별 목록 피드 (Category Feeds)
* **경로**: `/studio/infocenter/list/[category]` -> [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/infocenter/list/%5Bcategory%5D/page.tsx)
* **설명**: URL의 `[category]` 세그먼트 매개변수를 참조하여 상단 탭을 하이라이트하고 해당 분류의 글들만 필터링 출력합니다.
* **지원 카테고리**:
  - `notice`: 공지사항 (Notice)
  - `free`: 자유게시판 (Free Lounge)
  - `qna`: 질문 & 답변 (Q&A Station)
  - `tips`: 전문가 팁 (Master Tips)
  - `showcase`: 쇼케이스 (Showcase)
  - `faq`: 자주 묻는 질문 (FAQ Station)

---

## 3. 포스트 상세 조회 (Post Detail Viewer)
* **경로**: `/studio/infocenter/view/[id]` -> [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/infocenter/view/%5Bid%5D/page.tsx)
* **설명**: 특정 게시글 고유 ID(`[id]`)를 매치해 본문 상세 조회를 마운트합니다.
* **세부 기능**:
  - 마크다운 파서 및 첨부파일 목록 제공 (자동 파일 저장 지원).
  - 글 추천(Likes) 토글 버튼.
  - 하위 토론 댓글 타래 및 실시간 이모지 선택기.
  - 작성자 계정 일치 검증을 통한 수정/삭제 단축 아이콘 노출.

---

## 4. 포스트 작성 및 편집 에디터 (Post Drafting & Editing)
* **경로**: `/studio/infocenter/writing` -> [page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/infocenter/writing/page.tsx)
* **설명**: 신규 게시글을 발행하거나 기존 글을 편집하는 기획 화면입니다.
* **세부 기능**:
  - 카테고리 칩 전환 및 실시간 마크다운 텍스트 편집기.
  - 첨부파일 드래그 앤 드롭 및 Supabase community 스토리지와 연동한 퍼블릭 이미지 업로드 기능.
  - 글 등록 전 최종 형상을 가늠할 수 있는 오버레이 미리보기(Preview) 지원.
