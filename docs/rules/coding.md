# 코딩 규칙 및 관례 (Coding Standards)

`CreAibox` 프로젝트 개발에 일관성을 보장하기 위한 코딩 표준 가이드라인입니다.

---

## 1. 컴포넌트 선언 및 구분
* **Client Components**: 상태 관리(`useState`, `useEffect`), 브라우저 API 호출, 혹은 사용자 인터랙션이 발생할 경우 파일 첫 줄에 반드시 `"use client";` 지시어를 명시합니다.
* **Server Components**: DB direct query, 어드민 가드 검증, 보안 연동의 경우 기본값(Server Component)으로 두고 브라우저 관련 API를 차단합니다.

---

## 2. 모듈 임포트 순서 (Import Ordering)
정독과 컴파일 효율을 높이기 위해 아래 우선순위에 맞추어 정렬합니다.
1. React 및 Next.js 네이티브 패키지 (`react`, `next/link`, `next/navigation` 등)
2. 아이콘 라이브러리 및 타사 패키지 (`lucide-react`, `@tanstack/react-query` 등)
3. 절대 경로 별칭을 사용하는 전역 유틸리티 (`@/utils/supabase/...`, `@/lib/ai/...`)
4. 전역 및 공통 컴포넌트 (`@/components/ui/...`)
5. 로컬 스타일 및 타입 바인딩 (`./types`, `./style.css`)

---

## 3. 코드 설계 가이드라인
* **비즈니스 로직 분리**: UI 컴포넌트 내에 비대하게 긴 비즈니스 로직(예: 생성 트리거, 스크래핑 핸들러 등)을 쏟아붓지 않고, Zustand 스토어(`src/lib/stores`)나 커스텀 훅, 혹은 헬퍼 모듈로 작성해 응집성을 높입니다.
* **타입 명시**: `any` 지정을 최소화하고, 외부 연동 데이터 규격(예: API Response, DB Row)은 명시적인 `type` 또는 `interface`로 캐스팅해 바인딩합니다.
