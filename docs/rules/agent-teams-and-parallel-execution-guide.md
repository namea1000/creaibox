# 에이전트 팀 (Agent Teams) 및 병렬 처리 가이드

본 문서는 Anthropic Claude Agent와 Google Antigravity 등 최신 AI 자율 수행형 에이전트 시스템의 핵심 기능과, 그 중 **에이전트 팀(Agent Teams) 및 병렬 처리(Parallel Execution)**의 개념, 구축 방법, 그리고 실용적 활용 사례 3가지를 정리한 가이드입니다.

---

## 1. AI 자율 수행 에이전트 비교 및 핵심 역량

| 구분 | 클로드 에이전트 (Claude Agent / Code) | 구글 안티 그래비티 (Google Antigravity) |
| :--- | :--- | :--- |
| **기반 AI 모델** | Claude 3.5 / 3.7 계열 | Gemini 3 / 3.5 계열 |
| **작업 환경** | CLI, 터미널 중심 | 전용 Desktop IDE, CLI, 브라우저 연동 |
| **자율 작업 (Agentic)** | 지원 (파일 제어, Git, API 연동) | 지원 (`replace_file_content`, 브라우저 녹화 검증) |
| **에이전트 팀 & 병렬** | 지원 (서브 에이전트 병렬 할당) | 지원 (Orchestrator - Subagent 스폰 구조) |
| **지식 & 메모리 관리** | 지원 (`CLAUDE.md`, Dreaming 커스텀) | 지원 (`AGENTS.md`, Knowledge Items 저장소) |

---

## 2. 에이전트 팀 (Agent Teams) & 병렬 처리의 개념

에이전트 팀 구조는 **메인 에이전트(Orchestrator / 팀 리더)**가 사용자의 복잡한 요구사항을 분석한 뒤, 이를 여러 독립된 서브 과제로 분할하고 **전문 서브 에이전트(Sub-agents / 팀원)**들에게 할당하여 동시에 실행하는 메커니즘입니다.

* **독립적 컨텍스트 유지:** 서브 에이전트별로 별도의 작업 공간과 대화 맥락 로그를 유지하여 대규모 병렬 리팩토링이나 멀티 서비스 작업 시 대화가 엉키는 현상을 방지합니다.
* **리소스 및 시간 절약:** 연구, 분석, 테스팅, 백엔드 개발, 프론트엔드 작성을 동시 진행하여 작업 시간을 대폭 단축합니다.

---

## 3. 에이전트 팀 및 병렬 처리 3가지 실용적 활용법

### 💡 활용법 1: 대화 인터페이스(IDE/CLI)에서 프롬프트로 병렬 지시하기

별도의 코드 설정 없이, 메인 에이전트에게 **역할 분담과 병렬 처리를 명시하여 요청**하면 에이전트가 알아서 Sub-agent를 생성(Spawn)하여 작업을 분할 수행합니다.

* **사례 A (UI 브라우저 검증 & 백엔드 개발 동시 진행):**
  > *"새로 추가한 대시보드 컴포넌트의 반응성 및 테마 전환 검증은 `browser_subagent`를 실행해서 실제 브라우저 녹화로 확인하게 하고, 동시에 메인 에이전트는 API 엔드포인트 수정 작업을 진행해줘."*
* **사례 B (문서/스키마 분석 & 프론트엔드 개발 동시 진행):**
  > *"현재 `docs/database/` 하위 스키마 문서를 서브 에이전트에게 분석하게 해서 영향도 보고서를 작성하게 하고, 동시에 메인 에이전트는 프론트엔드 폼 유효성 검사 로직을 구현해줘."*

---

### 🛠️ 활용법 2: 커스텀 서브 에이전트 팀원(스킬/규칙) 구성하기

프로젝트 환경에 **특정 역할만 전문적으로 수행하는 서브 에이전트**를 미리 정의해 둘 수 있습니다.

1. **프로젝트 디렉토리 구조 설정:**
   ```text
   .agents/
   ├── AGENTS.md                          # 에이전트 전역 규칙
   └── skills/
       ├── code-reviewer/
       │   └── SKILL.md                   # 코드 리뷰 전문 서브 에이전트 스킬
       └── db-architect/
           └── SKILL.md                   # DB 마이그레이션 전문 서브 에이전트 스킬
   ```
2. **서브 에이전트 스킬 정의 예시 (`.agents/skills/code-reviewer/SKILL.md`):**
   ```yaml
   ---
   name: code-reviewer
   description: "작성된 TypeScript/React 코드를 분석하고 `@docs/rules/ai-agent-rules.md` 컨벤션 위반 및 성능 이슈를 검토하는 서브 에이전트 스킬입니다."
   ---
   # 코드 리뷰어 서브 에이전트 지침
   1. docs/rules/ai-agent-rules.md 수칙 준수 여부를 검토합니다.
   2. 메모리 누수 및 컴포넌트 불필요 재렌더링 유무를 체크합니다.
   ```
3. **실행 지시:**
   > *"DB 스키마 변경 건은 `db-architect` 스킬을 탑재한 서브 에이전트를 띄워서 영향도를 검토하게 해줘."*

---

### 💻 활용법 3: 구글 안티 그래비티 SDK 기반 멀티 에이전트 구축하기 (코드 개발 시)

애플리케이션이나 무인 자동화 파이프라인을 구축할 때 `google-antigravity` Python SDK를 사용해 커스텀 에이전트 팀 오케스트레이션을 구현할 수 있습니다.

```python
from google_antigravity import Agent, LocalAgentConfig

# 1. 전문 서브 에이전트 (코드 리뷰 및 접근성 검증 담당)
reviewer_agent = Agent(
    name="CodeReviewer",
    instructions="코드를 분석하여 성능 이슈, 웹 접근성(a11y) 위반 사항 및 프로젝트 규칙 준수 여부를 리포트합니다."
)

# 2. 메인 오케스트레이터 에이전트 (팀 리더)
leader_agent = Agent(
    name="TeamLeader",
    instructions="사용자의 요구사항을 파악하여 서브 에이전트들에게 작업을 할당하고, 그 결과를 종합하여 응답합니다.",
    subagents=[reviewer_agent]  # 서브 에이전트 팀원으로 추가
)

# 3. 팀 실행 지시 (리더 에이전트가 필요 시 reviewer_agent를 동적으로 스폰하여 위임)
response = leader_agent.run("새로 구현된 크리에이박스 썸네일 컴포넌트의 코드 리뷰 및 최적화 안을 제출해줘.")
print(response)
```

---

## 4. 크리에이박스(CreAibox) 프로젝트 적용 가이드

* **개발 규칙 상시 참고:** 새로운 기능 구현 시 [ai-agent-rules.md](file:///Users/a1234/Local%20Sites/creaibox/docs/rules/ai-agent-rules.md)를 서브 에이전트에 기본 지침으로 전달합니다.
* **문서 동기화 의무:** 멀티 에이전트를 활용해 기능 구현을 마친 경우, 주 에이전트는 완료 전 operational doc 및 design spec 문서 수정을 반드시 마무리해야 합니다.
