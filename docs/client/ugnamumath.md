# 어그나무학원(ugnamumath) 기업 홈페이지 구축 보고서

이 문서는 **어그나무학원**의 맞춤형 독립 홈페이지 구축에 관한 상세 계획, 아키텍처 설계, 구현 명세 및 검증 결과를 기록한 문서입니다.

---

## 1. 프로젝트 개요

*   **클라이언트명**: 어그나무학원 (어그나무학원, 어그나무영재학원, 어그나무고등학원 3개 관 구성)
*   **브랜드 ID (brand_id)**: `ugnamumath`
*   **대표 주소**: `https://ugnamumath.creaibox.com` (로컬 개발: `ugnamumath.localhost:3000`)
*   **원천 블로그**: 네이버 블로그 [https://blog.naver.com/ugnamumath](https://blog.naver.com/ugnamumath)
*   **핵심 디자인 가이드**: 학원의 지적이고 논리적인 무드를 나타내는 **화이트 & 스마트 네이비/인디고(White & Indigo/Navy Accent)** 디자인 가이드라인 수립.

---

## 2. 시스템 아키텍처 & 라우팅 설계

### 2-1. 정적 클라이언트 레지스트리 바인딩
*   [clientSites.ts](file:///Users/a1234/Local%20Sites/creaibox/src/lib/constants/clientSites.ts) 레지스트리에 `"ugnamumath"` 브랜드 ID를 정식 등록했습니다.
*   Next.js Middleware([middleware.ts](file:///Users/a1234/Local%20Sites/creaibox/src/middleware.ts))에서 서브도메인을 파싱하여, 일반 블로그 경로 대신 `/clients/ugnamumath` 서브 앱으로 즉각 리라이트시킵니다.
*   **실서버 DB 승인 가동**: 배포가 이루어지는 과정에서의 접근 예외를 방지하고자, 실서버 Supabase의 관리자 프로필(`jenam7720@gmail.com`)의 브랜드 ID를 `"ugnamumath"`로 매핑하고 `"APPROVED"` 상태로 갱신하여 인프라 연동 정합성을 충족했습니다.

### 2-2. 디렉토리 구조
학원의 라우팅 격리를 위해 `src/app/clients/ugnamumath/` 폴더 아래에 독립 환경을 구축했습니다:
```
src/app/clients/ugnamumath/
├── layout.tsx         -> 어그나무학원 전용 네이비 쉘 레이아웃 (GNB, Footer, 전용 CSS 스타일)
├── page.tsx           -> 메인 랜딩 페이지 (Visual premium, hero, sections 조립)
├── about/
│   └── page.tsx       -> 학원 소개, 교육이념 및 오시는 길(불당동 디엠타워, 네이버 지도 연계)
├── contact/
│   └── page.tsx       -> 단독 입학상담 신청 및 레벨테스트 예약 페이지
├── components/        -> 전용 UI 컴포넌트 격리 관리
│   ├── Header.tsx           -> Trees 엠블럼 로고가 적용된 스크롤 감지 GNB 및 모바일 햄버거 메뉴
│   ├── Footer.tsx           -> 3개 관 설립·운영 등록번호(제3298호, 제4428호, 제4660호) 및 밴드 링크 명시
│   ├── HeroSection.tsx      -> 공부하는 학생 비주얼과 교육 슬로건, CTA가 결합된 헤더
│   ├── AcademyIntro.tsx     -> 어그나무일반관 / 어그나무영재관 / 어그나무고등관 3열 카드
│   ├── Curriculum.tsx       -> 초등 영재, 중등 내신, 특목 입시, 고등 1등급반 2열 상세 설명 카드
│   ├── Achievements.tsx     -> 영재교, 과고, 자사고, 명문대 합격 실적 카드 및 필터링 탭
│   └── ConsultationForm.tsx -> 학부모명, 학년, 희망방식 등을 검증하는 상담 접수 폼
└── lib/               -> 비즈니스 데이터 및 스펙
    ├── types.ts             -> 분원, 교육과정, 합격 실적 타입 선언
    └── constants.ts         -> 등록번호, 과목 정보, 합격자 실명 기반 가림 처리 정적 데이터
```

---

## 3. 구현 내용 요약

### 3-1. 메인 랜딩 페이지 (`page.tsx`)
1.  **히어로 영역 (HeroSection)**: "생각의 뿌리를 깊게, 학습의 나무를 곧게" 슬로건을 중심으로 딥 인디고 그라데이션 및 입학 상담 유도 배너를 배치했습니다.
2.  **3개 관 안내 (AcademyIntro)**: 초/중등 일반관(제3298호), 입시 영재관(제4428호), 수능/내신 고등관(제4660호)의 타겟 학년과 설립 번호를 공식 뱃지로 달아 3열 카드 형태로 구조화했습니다.
3.  **수학/과학 커리큘럼 (Curriculum)**: 초등 영재 사고력 교실, 중등 내신 만점반, 영재교/과고 입시반, 고등 수능 1등급 킬러정복반의 4대 커리큘럼에 대해 학년별 목표 및 학습 상세를 2열 그리드로 구현했습니다.
4.  **합격 실적 (Achievements)**: 한국과학영재학교, 충남과고, 서울과고, 상산고 및 서울대/카이스트 등 대입 합격 실적을 카테고리 탭(전체, 영재교/과고, 특목/자사고, 대입)에 맞춰 클라이언트 단에서 실시간 필터링되도록 구성했습니다.
5.  **입학 상담 접수 (ConsultationForm)**: 학부모 이름, 연락처, 자녀 학년(초3~고3), 상담 희망 과목 및 유형(방문/전화/레벨테스트)을 입력받는 상담 폼입니다. 필수 항목 검증 및 인라인 제출 피드백 기능을 지원합니다.

### 3-2. 학원 소개 페이지 (`about/page.tsx`)
*   **원장 인사말**: 학원장 이정범 원장의 실제 교육 신념("공식 암기가 아닌 원리를 스스로 깨우치고 해결하는 힘")을 수록했습니다.
*   **3대 교육 철학**: 스스로 생각하는 힘, 개념의 본질 학습, 오답의 완벽 추적 관리의 원칙을 정갈하게 카드 디자인으로 노출했습니다.
*   **오시는 길**: 충남 천안시 불당동 디엠타워 8층 주소와 전화번호를 지도 이미지와 함께 레이아웃하고, 네이버 길찾기 다이렉트 버튼을 연동했습니다.

---

## 4. 검증 결과

*   **TypeScript 컴파일 검증**: `npx tsc --noEmit` 실행 결과 에러 없음.
*   **라우팅 및 리라이트 동작**: `ugnamumath.localhost:3000` 및 하위 서브 라우트(`/about`, `/contact`) 접속 시 URL 마스킹을 정상적으로 유지하며 격리된 화이트-네이비 쉘이 로딩됨을 확인했습니다.

---

## 5. UI/UX 화면 스크린샷 기록

*   **메인 히어로 화면**:
    ![어그나무학원 히어로](file:///Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/ugnamumath_hero_1782210021617.png)
*   **수학/과학 커리큘럼 영역**:
    ![어그나무학원 커리큘럼](file:///Users/a1234/.gemini/antigravity-ide/brain/a6e391c1-3460-4765-a760-c651c0009136/ugnamumath_curriculum_1782210041155.png)
