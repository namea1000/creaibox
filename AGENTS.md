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

### TODO Roadmap Rule
When the user asks to record or manage future tasks (e.g., "앞으로 할 일에 추가해놔", "할 일 추가"):
- Always update `@docs/project/todo-roadmap.md` with the requested checklist items.
- Maintain checklist status (`- [ ]` / `- [x]`) and keep it synchronized with completed work.

### Project Manual Rule
When creating how-to guides or operation manuals (e.g., "~ 하는 방법", "매뉴얼 작성"):
- Store manual files in `@docs/project/manual/<manual-name>.md`.