# 명명 규칙 및 네이밍 가이드 (Naming Conventions)

프로젝트 전반에 걸친 폴더, 파일, 변수 및 DB 명명 일관성 규칙입니다.

---

## 1. 데이터베이스 오브젝트 (Database)
* **테이블명**: 소문자 복수형 스네이크 케이스(`snake_case`)를 적용하며, 도메인 접두사를 배치합니다.
  - *예시*: `writing_naver_posts`, `research_sources`, `ai_generation_usage_logs`
* **컬럼명**: 소문자 단수형 스네이크 케이스(`snake_case`)를 사용합니다.
  - *예시*: `display_id`, `created_at`, `target_keyword`, `meta_description`
* **스토리지 버킷명**: 소문자 케밥 케이스(`kebab-case`)를 적용합니다.
  - *예시*: `generated-images`

---

## 2. 코드 및 파일 시스템 (Frontend & Files)
* **React 컴포넌트 파일**: 파스칼 케이스(`PascalCase`)를 사용합니다.
  - *예시*: `UniversalBlogEditor.tsx`, `VideoEditorShell.tsx`
* **유틸리티 및 일반 스크립트**: 케밥 케이스(`kebab-case`)를 사용합니다.
  - *예시*: `api-vault-crypto.ts`, `get-free-gemini-key.ts`
* **상수(Constant) 변수**: 전체 대문자 스네이크 케이스(`UPPER_SNAKE_CASE`)로 지정합니다.
  - *예시*: `IMAGE_BUCKET`, `GROQ_SAFE_TPM_BUDGET`
* **라우팅 폴더**: Next.js App Router 규격에 맞춰 소문자 케밥 케이스(`kebab-case`)를 적용하며, 동적 라우트는 브라켓 기호(`[section]`)로 감쌉니다.
  - *예시*: `src/app/studio/music/style-format/page.tsx`
