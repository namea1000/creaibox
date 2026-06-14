# 커뮤니티 스튜디오 화면 정의서 (Page Specification)

이 문서는 커뮤니티 스튜디오 및 상세 주제별 채팅방 화면의 라우팅 정보와 스펙을 정리한 정의서입니다.

---

## 1. 메인 홈 화면 (Community Lobby)
* **경로**: `/studio/community` -> `src/app/studio/community/page.tsx`
* **설명**: 크리에이터 커뮤니티의 중앙 로비 화면입니다. 실시간 접속 현황 및 주요 지표 요약 패널을 제공하며, 10개의 주제별 대화방 바로가기 그리드를 포함합니다.

---

## 2. 동적 상세 채팅방 화면 (Dynamic Chat Rooms)
* **경로**: `/studio/community/[section]` -> `src/app/studio/community/[section]/page.tsx`
* **설명**: URL의 `[section]` 세그먼트 매개변수를 참조하여 아래의 통합 실시간 채팅방 컴포넌트([ChatRoom.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/community/%5Bsection%5D/components/ChatRoom.tsx))를 바인딩하고 렌더링합니다.

### 2-1. 실시간 채팅 (Lobby Chat)
* **세그먼트**: `/studio/community/chat`
* **기능**: 전체 분야 크리에이터들이 자유롭게 어울려 정보와 노하우를 나눕니다.

### 2-2. 크리아이박스 글쓰기 (Writing Chat)
* **세그먼트**: `/studio/community/writing`
* **기능**: 구글 SEO 블로그 발행 규격, 애드센스 승인 전술, 본문 구조 작성을 논합니다.

### 2-3. 네이버 블로그 (Naver Chat)
* **세그먼트**: `/studio/community/naver`
* **기능**: 스마트블록 매칭 규칙, C-Rank/DIA 로직 분석, 뷰탭 랭킹 정보를 나눕니다.

### 2-4. 뮤직 스튜디오 (Music Chat)
* **세그먼트**: `/studio/community/music`
* **기능**: Suno 모델 생성 피드백, 메타 기법 설정, 오디오 믹싱 노하우를 주고받습니다.

### 2-5. 이미지 스튜디오 (Image Chat)
* **세그먼트**: `/studio/community/image`
* **기능**: Midjourney 파라미터 적용기, Flux 한글 텍스트 및 프롬프트 최적화를 토론합니다.

### 2-6. 비디오 스튜디오 (Video Chat)
* **세그먼트**: `/studio/community/video`
* **기능**: Kling 영상 무빙 설정, 시네마틱 프롬프트, 숏폼 편집 타이밍 팁을 나눕니다.

### 2-7. 유튜브 연구소 (Youtube Chat)
* **세그먼트**: `/studio/community/youtube`
* **기능**: 알고리즘 떡상 지표(시청 지속시간 등), CTR 극대화 썸네일 노하우를 공유합니다.

### 2-8. AI 트렌드 토론방 (AI Trend Chat)
* **세그먼트**: `/studio/community/ai-trend`
* **기능**: OpenAI 신작, Claude 코딩 활용, 온디바이스 AI 등 신기술 뉴스를 브리핑합니다.

### 2-9. 협업 프로젝트 (Collab Chat)
* **세그먼트**: `/studio/community/collab`
* **기능**: 1인 지식창업가, 영상 편집팀장, 음향 아티스트 등 공동 프로젝트 팀원 매칭방입니다.

### 2-10. 수익화 연구소 (Money Chat)
* **세그먼트**: `/studio/community/money`
* **기능**: 애드센스 자동화 부업, 제휴 마케팅, AI 지식 창업 전자책 발간 등 수익화를 의논합니다.
