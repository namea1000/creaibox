# CreAibox Agent Rules

Before writing code, modifying code, or creating new files,
always review:

@docs/rules/ai-agent-rules.md

Additional references:

@docs/rules/*
@docs/arch/*
@docs/api/*
@docs/pages/*
@docs/database/*

### Strict Zero Fake Data Rule (가짜 데이터 생성 전면 금지 및 사유 명시 의무)
- **진짜 데이터가 아니면서 진짜인 척 사용자에게 조작/표현하는 행위를 100% 절대 금지한다.** (CreAibox 신뢰성 최우선 1대 규칙)
- 모든 개발, API 구축, 대시보드 및 서비스 기능 개발 시 **가짜(Mock/Dummy/Fake/Seed) 데이터를 임의로 합성하거나 진짜 데이터처럼 꾸며 사용자에게 노출하지 않는다.**
- 데이터가 존재하지 않거나 외부 API/DB 수집 가능 범위를 벗어난 경우:
  1. 가짜 데이터를 임의로 생성하거나 진짜처럼 포장하지 말고, **데이터가 없음**을 명확하고 솔직하게 UI에 표시한다.
  2. 왜 데이터가 없는지 **명확한 사유(예: "CreAibox DB 구축 이전 기간이거나 포털 API 제공 범위 외 데이터입니다")**를 사용자에게 투명하게 설명한다.

### Mandatory Git Push Rule (개발자 직접 명령 전 깃 푸시 절대 금지)
- **개발자(사용자)가 명시적으로 "깃 푸시해", "git push 수행해"라고 직접 명령하기 전에는 AI 에이전트가 자율적으로 `git push`를 절대 수행하지 않는다.**
- 에이전트는 코드 수정, 로컬 테스트 및 빌드 검증(`npx tsc --noEmit`)까지만 진행하고, `git push` 단계는 개발자의 명시적 지시가 있을 때만 실행한다.

### TODO Roadmap Rule
When the user asks to record or manage future tasks (e.g., "앞으로 할 일에 추가해놔", "할 일 추가"):
- Always update `@docs/project/todo-roadmap.md` with the requested checklist items.
- Maintain checklist status (`- [ ]` / `- [x]`) and keep it synchronized with completed work.

### Project Manual Rule
When creating how-to guides or operation manuals (e.g., "~ 하는 방법", "매뉴얼 작성"):
- Store manual files in `@docs/project/manual/<manual-name>.md`.

### Mandatory Vertex AI & Gemini Primary Engine Standard Rule (gemini-3.1-flash-lite 1순위 의무화 규칙)
- 모든 GCP Vertex AI 및 Gemini AI 연동 백엔드 모듈, API 라우트, AI 스캐너 및 배치 스크립트에서 최우선 1순위 기본 구동 엔진은 무조건 `gemini-3.1-flash-lite` 모델로 1순위 배치해야 한다.
- `gemini-3.1-flash-lite`는 극상의 초고속 응답 속도와 최저 토큰 비용(Ultra-low cost)을 자랑하므로 대용량 배치 처리, 트렌드 스캔, 키워드 사유 생성, 자동 검증 엔진의 1순위 표준 모델로 사용한다. (fallback 시에만 `gemini-2.5-flash` 활용)