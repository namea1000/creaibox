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

### TODO Roadmap Rule
When the user asks to record or manage future tasks (e.g., "앞으로 할 일에 추가해놔", "할 일 추가"):
- Always update `@docs/project/todo-roadmap.md` with the requested checklist items.
- Maintain checklist status (`- [ ]` / `- [x]`) and keep it synchronized with completed work.

### Project Manual Rule
When creating how-to guides or operation manuals (e.g., "~ 하는 방법", "매뉴얼 작성"):
- Store manual files in `@docs/project/manual/<manual-name>.md`.