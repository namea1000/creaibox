# 콘텐츠 캘린더 및 자동화 워크플로우 실구동 완성형 개발 계획서

이 문서는 Coming Soon 상태였던 **"콘텐츠 캘린더"**와 **"자동화 워크플로우"** 페이지를 실제 데이터베이스(Supabase) 데이터와 연동하고, 복잡한 사용자 설정 및 인터랙션이 구동하는 완성형 대시보드로 론칭하기 위해 수립되었던 개발 계획 명세서의 보관용 백업 파일입니다.

---

## 1. 핵심 기능 및 컴포넌트 설계 명세

### 1.1 콘텐츠 캘린더 (`/studio/content-planner/calendar`)
* **구현 방식**: 외부 라이브러리 의존성을 배제하고 순수 CSS Grid를 활용한 반응형 7x5/6 달력 템플릿을 개발했습니다.
* **데이터 바인딩**: Supabase의 `content_planner_outputs` (발행 아웃풋) 및 `content_planner_items` 테이블의 생성/완료 시점 날짜 정보를 복합 연동해 달력의 개별 일자에 정렬했습니다.
* **인터랙션**: 일자별 콘텐츠 요약을 클릭 시 상세 정보 모달(제목, 플랫폼, 연동 URL, 완료 상태)을 띄우고 즉각 외부 배포 링크로 이동하도록 연결했습니다.

### 1.2 자동화 워크플로우 (`/studio/content-planner/workflow`)
* **구현 방식**: Tailwind CSS 애니메이션 효과를 활용한 완성도 높은 **인터랙티브 노드 플로우 맵**을 빌드했습니다.
* **구체적 기능**:
  * **워크플로우 매니저**: 자동화 규칙(예: "트렌드 키워드 자동 기획", "화요일 10시 블로그 발행") 목록 및 활성/비활성 스위치 토글 기능.
  * **노드 설정 판넬**: 트리거 &rarr; 필터 &rarr; AI 생성 &rarr; 외부 발행 노드를 클릭 시 우측 슬라이드 패널에서 조건(키워드 소스, 발행 어조, 대상 블로그 등)을 직접 변경하고 저장하는 데이터 바인딩.
  * **즉시 구동 시뮬레이터**: "테스트 구동" 버튼 클릭 시 각 노드를 따라 데이터가 흘러가는 로딩 및 완료 애니메이션(빛 효과)을 구동하고 실제 기획 데이터 생성을 모킹/트리거합니다.

---

## 2. 변경 파일 목록

### 2.1 [NEW] page.tsx (콘텐츠 캘린더)
* **경로**: [calendar/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/content-planner/calendar/page.tsx)
* **내용**: 월간 달력 네비게이션, Supabase 발행 이력 연동, 상세 모달 연동.

### 2.2 [NEW] page.tsx (자동화 워크플로우)
* **경로**: [workflow/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/content-planner/workflow/page.tsx)
* **내용**: 노드 맵 렌더러, 우측 매개변수 에디터, 시뮬레이션 동작 제어기.

### 2.3 [MODIFY] Sidebar.tsx
* **경로**: [Sidebar.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/components/layout/Sidebar.tsx)
* **내용**: 미활성 메뉴 정리 및 키워드 트렌드 이전 정비.
