# CreaiBox Agent Rules & Branding Guidelines

Before writing code, modifying code, or creating new files, always review:

@/Users/a1234/Local Sites/creaibox/docs/rules/ai-agent-rules.md

### Mandatory Official Brand Name Rule (공식 브랜드 명칭 표기 의무)
- **공식 브랜드 명칭은 반드시 `CreaiBox` (대문자 C, 소문자 r, e, a, i, 대문자 B, 소문자 o, x)로 통일하여 표기한다.** (구형 `CreAibox` 표기 전면 금지)
- 도메인 표기 시에는 `creaibox.com` 소문자를 사용한다.

### Mandatory CreaiBox Infrastructure Branding Rule (클라우드 DB 명칭 의무)
- 사용자 화면(UI), API 응답 메시지, 홍보 자료, 운용 매뉴얼 및 향후 작성할 모든 문서에서 타사 명칭("구글 드라이브", "Google Drive")을 절대 사용하지 않는다.
- 반드시 **"CreaiBox 클라우드 DB"** (또는 **"creaibox.com 클라우드 DB / 원고 보관함"**) 명칭으로 단일화하여 사용한다.

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

### Mandatory Database Table Creation Prompt Rule (DB 테이블 생성 채팅 알림 의무 규칙)
- 신규 DB 테이블이 필요하거나 기존 테이블 DDL이 미실행된 상태를 발견하면, AI 에이전트는 즉시 복사해서 Supabase SQL Editor에서 실행할 수 있는 완성형 SQL 구문과 함께 개발자(사용자)에게 채팅창으로 테이블 생성을 명시적으로 요청해야 한다.
- 테이블 DDL 파일(`docs/database/<table_name>.sql`)을 작성하여 프로젝트에 항상 저장 관리한다.

### Mandatory Background Automation Manual Sync Rule (백그라운드 무인 기능 매뉴얼 최신화 규칙)
- 향후 신규 무인 자동 수집(Cron), 백그라운드 배치 작업, 또는 자동화 기능이 개발/구동되면, AI 에이전트는 백그라운드 무인 자동화 매뉴얼(`docs/project/manual/background-automation-execution-5-methods-guide.md`)의 "4. 🟢 현재 즉시 구동 중 / 서비스 가능한 무인 기능 (Current Services)" 섹션에 신규 기능을 즉시 등록하고 최신화해야 한다.

### Mandatory Client Site Egress & Aspect Ratio Standard Rule (클라이언트 사이트 트래픽 감축 및 16:9 비율 영구 표준 규칙)
- **규칙 1 (카드 썸네일 16:9 비율 고정)**: 향후 신규 제작하는 모든 커스텀 클라이언트 사이트, 비즈니스 홈페이지, 브랜드 블로그의 카드 썸네일 프레임은 반드시 `aspect-[16/9]` (16:9 비율)만 사용하여 썸네일 텍스트 좌우 잘림을 100% 방지한다.
- **규칙 2 (Egress 트래픽 방어 - 목록 조회 시 본문 컬럼 제외)**: 블로그 목록, 카테고리 목록, 포트폴리오 목록 쿼리 작성 시 무거운 원고 본문 전체 HTML(`content`)이나 JSON 덤프(`published_snapshot`) 컬럼을 절대 `select()`에 포함하지 않고 경량 메타 필드만 수집한다.
### Mandatory Strict Separation of Question vs Command Rule (질문 문의와 개발 지시 엄격 분리 및 자의적 선조치 절대 금지 규칙)
- **개발자(사용자)의 대화 중 단순 질문/의문/문의("~해도 되나?", "~인가요?", "~는 어떻게 하나?", "~이 맞나?")와 명시적 개발 지시("~해라", "~수정해줘", "~추가해", "~적용해")를 100% 엄격하게 구분한다.**
- **개발자가 단순 질의나 문의를 할 때 AI 에이전트는 오직 분석, 설명 및 명쾌한 답변만 제공하며, 사용자의 명시적 실행 지시 없이 소스 코드를 임의로 수정/삭제/추가하는 자의적 선조치 행동을 100% 절대 금지한다.**
- **모든 소스 코드 수정, 파일 생성/삭제 등 실제 코드 변경 작업은 오직 개발자의 명시적 실행 지시("적용해", "수정해", "코드 반영해")가 확정되었을 때만 수행한다.**



### Mandatory Daily Devlog & Architecture Update Rule (매일 개발 일지 및 관련 문서 업데이트 의무 규칙)
- 앞으로 코드 수정보완이나 새로운 메뉴를 개발하면 매일 작업 완료 즉시 두 문서(`docs/project/<YYYY><MonthName>Devlog.md` 와 `Walkthrough.md`)를 반드시 기록(업데이트)해야 한다.
- 또한, 해당 수정보완 했던 기능과 관련된 아키텍처 문서(`docs/arch/`)나 매뉴얼 문서(`docs/project/manual/`)를 적극적으로 찾아내어 그 문서도 함께 최신화하여 업데이트해야 한다.

### Mandatory Formal Database Schema Expansion Rule (DB 정석 설계 및 전용 컬럼 추가 의무 규칙)
- 기존 메뉴를 업그레이드하거나 신규 기능을 개발할 때, DB 설계 시 **항상 장기적인 서비스 확장과 데이터 통계(조회 성능)를 최우선으로 고려**한다.
- 임시방편으로 기존 JSONB(`extra_configs` 등) 컬럼에 꼼수 데이터(플래그)를 구겨 넣는 것을 지양하고, **필요하다면 기존 DB 테이블에 명확한 역할을 하는 전용 컬럼(Column)을 정석대로 추가(ALTER TABLE)하여 해결**한다.

### Mandatory Global Edge CDN ISR 60s Rule (전 대중 공개 페이지 및 블로그 글로벌 엣지 캐시 60초 의무 규칙)
- 향후 신규로 제작되는 모든 대중 공개 페이지(메인 랜딩, 소개, 요금제, 인포센터, 고객지원, AI 웹사이트 빌더 홍보 페이지), 사용자 블로그(`brand/[brand_id]/*`), 및 AI 웹사이트 빌더로 제작되는 모든 고객사 홈페이지/서브페이지/내장 블로그에는 반드시 `export const revalidate = 60;` (ISR 60s)를 선언하여 Vercel Global Edge CDN에서 0.01초 만에 즉시 서빙되도록 구축해야 한다.
- Server Component 내부에서 `cookies()`나 `headers()`를 직접 호출하여 정적 캐시가 해제되는 안티 패턴을 100% 금지하며, 테마/인증 상태는 Client Component Wrapper로 분리한다.
- 블로그 상세 페이지 및 공개 데이터 쿼리 작성 시 React `cache()`를 사용하여 메타데이터와 본문 간의 중복 DB 조회를 방지하고, 조회수 증가는 비차단 `<PostViewTracker />`로 분리한다.
