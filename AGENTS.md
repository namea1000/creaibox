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


### Mandatory SmartIntentLink 0.01s Instant Navigation Rule (스마트 링커 0.01초 가속 개발 의무 규칙)
- 향후 신규로 제작되는 모든 사용자 블로그, 비즈니스 홈페이지, 커스텀 웹사이트 템플릿, 카드 목록 및 아티클 링커에는 맹목적 `Link` 또는 `<a href>` 대신 무조건 `SmartIntentLink` (`@/components/common/SmartIntentLink`) 컴포넌트를 사용해야 한다.
- 0.15초 체류 의도 감지를 통해 Vercel 비용 0원을 철통 방어함과 동시에 클릭 즉시 0.01초 만에 본문이 열리는 네이버 뉴스급 수소폭탄 가속 서빙을 표준으로 100% 영구 적용한다.

### Mandatory Document Role Separation Rule (아키텍처 문서 및 실무 매뉴얼 역할 엄격 분리 규칙)
- 아키텍처 기술 명세서 (`docs/arch/`)와 서비스 실무 매뉴얼 (`docs/project/manual/`)을 절대 동일한 내용으로 중복 작성하지 않고 역할과 목적을 100% 명확히 분리하여 작성한다.
- 아키텍처 문서 (`docs/arch/`)는 시스템 설계자/개발자 관점의 Mermaid 다이어그램, 시퀀스/데이터 파이프라인, 내부 알고리즘, 응답 헤더 스펙 등 **심도 깊은 기술 명세서**로 작성한다.
- 실무 매뉴얼 (`docs/project/manual/`)은 기획자/실무 개발자 관점의 HOW-TO 실전 가이드, 바로 복사 가능한 추천 코드 예시, 금지 패턴(Anti-Patterns), FAQ 등 **실전 운용 가이드**로 차별화 작성한다.

### Mandatory Secret Key Masking Rule in Documentation (문서 내 실제 보안키 및 시크릿 노출 100% 절대 금지 규칙)
- 공용 문서(`.md`), 아키텍처 명세서, 가이드 및 매뉴얼 파일 작성 시 실제 운영/테스트용 보안키(API Secret, Service Account Private Key, OAuth Secret 등)를 절대로 원문 그대로 노출해 작성하지 않는다.
- 모든 문서 내 환경변수 예시 코드에는 반드시 마스킹 문자열(예: `your_api_secret_here`, `sec_xxxx`, `your_private_key_here`)만 사용해야 한다.
- 실제 시크릿 키는 Git에 포함되지 않는 `.env.local` 파일 및 Vercel/서버 환경변수 설정(Environment Variables)에서만 관리한다.