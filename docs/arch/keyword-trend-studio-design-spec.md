# 키워드 트렌드 분석 스튜디오 설계 명세서 (Keyword Trend Studio Design Spec)

이 문서는 키워드 트렌드 분석 스튜디오 모듈의 설계 의도, 인터랙션 패턴, 라우팅 전략 및 데이터 시뮬레이션 원칙을 보존하기 위해 기술된 설계 사양서입니다.

---

## 1. 아키텍처 결정 (Architecture Decisions)
* **단일 라우트-다중 컴포넌트 구성**: 개별 메뉴마다 10개의 폴더를 물리적으로 생성하여 빌드 및 라우트 트리가 무거워지는 구조 대신, `src/app/studio/keyword/[section]/page.tsx` 동적 세그먼트 단 하나로 라우팅을 통제합니다. 
* **클라이언트 상태 캡슐화**: 각 도구(예: `RankTracker`, `MorphologyAnalyzer`)의 모든 분석 로직과 상태 관리는 각 컴포넌트 내부에서 완결성을 갖습니다. 이를 통해 컴포넌트 간의 예기치 않은 사이드 이펙트를 차단하고 빌드 성능을 확보하였습니다.

---

## 2. UI/UX 및 디자인 가이드라인 (UI/UX Standards)
* **색상 매칭 및 다크 톤**: 전체 테두리는 프리미엄 다크 블루 테마인 `border-zinc-800 bg-zinc-900/40` 조합과 `backdrop-blur-md` 글래스모피즘 패턴을 차용하였습니다.
* **브랜드 아이콘의 명확한 브랜딩**: 
  - `docs/rules/react-icons-brand-icons.md` 규정에 따라 Naver 검색은 `SiNaver`, YouTube는 `SiYoutube`, Google 검색은 `SiGoogle` 등 전용 브랜드 로고 패키지(`react-icons/si`)를 정확하게 바인딩하여 렌더링하도록 강제합니다.
  - 일반 기능성 액션 아이콘들은 `lucide-react`를 사용하여 통일성을 제공합니다.
* **호버 및 액션 피드백**: 모든 버튼 요소에 `hover:bg-`, `active:scale-95` 피드백을 적용하여 프리미엄 반응성을 구현했습니다.

---

## 3. 시뮬레이션 및 데이터 구조 (Simulation Engine)
* **예측 데이터 생성 로직**:
  - `BulkSearch`: 입력 키워드의 글자 길이를 기반으로 월간 검색량, CTR, CPC, 검색 의도 및 난이도를 결정성 공식(Deterministic Hashing)으로 계산하여 사실적인 메트릭을 출력합니다.
  - `MorphologyAnalyzer`: 한글 조사 제거 휴리스틱을 사용하여 명사의 출현 빈도수 및 밀도 비율을 시각화합니다.
  - `RisingTrends`: 24시간 변동폭 시뮬레이션을 위해 SVG 선(Line) 및 면(Area) 차트 패스를 동적으로 연산하여 파도를 그리는 스파크라인을 생성합니다.
  - `RankTracker`: 등록한 URL의 순위 이력을 기록하고, 갱신(`RefreshCw`) 클릭 시 난수 변화를 적용하여 실시간으로 순위 변동 상황을 표시합니다.

---

## 4. 향후 로드맵 및 백엔드 확장 (Future Roadmap)
* **API 연동 설계**:
  - 네이버 검색광고 API, 구글 Ads API 및 유튜브 Data API 파이프라인을 `src/lib/api/keyword`에 순차 연동하여 mock 시뮬레이터와 교체 가능하게 레이어를 분리할 예정입니다.
  - 사용자가 등록한 실시간 순위 추적 키워드 리스트를 DB에 영구 저장하기 위해 Supabase Row Level Security(RLS) 정책을 반영한 `user_tracked_keywords` 테이블 이전을 설계해두었습니다.
