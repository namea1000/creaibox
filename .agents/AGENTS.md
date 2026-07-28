# CreAibox Agent Rules & Branding Guidelines

Before writing code, modifying code, or creating new files, always review:

@/Users/a1234/Local Sites/creaibox/docs/rules/ai-agent-rules.md

### Mandatory CreAibox Infrastructure Branding Rule (클라우드 DB 명칭 의무)
- 사용자 화면(UI), API 응답 메시지, 홍보 자료, 운용 매뉴얼 및 향후 작성할 모든 문서에서 타사 명칭("구글 드라이브", "Google Drive")을 절대 사용하지 않는다.
- 반드시 **"CreAibox 클라우드 DB"** (또는 **"creaibox.com 클라우드 DB / 원고 보관함"**) 명칭으로 단일화하여 사용한다.

### TODO Roadmap Rule
When the user asks to record or manage future tasks (e.g., "앞으로 할 일에 추가해놔", "할 일 추가"):
- Always update `@docs/project/todo-roadmap.md` with the requested checklist items.
- Maintain checklist status (`- [ ]` / `- [x]`) and keep it synchronized with completed work.

### Project Manual Rule
When creating how-to guides or operation manuals (e.g., "~ 하는 방법", "매뉴얼 작성"):
- Store manual files in `@docs/project/manual/<manual-name>.md`.

### Unauthenticated Access & Unified Login Prompt Rule (비로그인 자유 둘러보기 및 로그인 팝업 통일)
- 모든 서비스/스튜디오 화면은 비로그인 상태에서도 UI/레이아웃/폼 텍스트를 자유롭게 구경할 수 있도록 100% 전면 노출한다. (전체 가림막 카드 금지, 폼은 빈값 + 예시 가이드 텍스트 제공)
- DB 데이터 저장, AI 자동 제작, 원고 작성, 도메인 구매 등 로그인 세션이 필요한 액션 버튼을 클릭할 때는 구식 alert 대신 **"로그인이 필요한 서비스입니다" 전용 팝업 모달**을 띄우고 `[ 🔑 로그인 하러 가기 ]`로 연결한다.
