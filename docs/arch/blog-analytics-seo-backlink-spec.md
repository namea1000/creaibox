# CreAibox 블로그 통계 대시보드, 권한 시스템 및 SEO 백링크 구축 아키텍처

## 1. 개요 (Overview)
본 문서는 CreAibox 스튜디오 내 **블로그 통계 대시보드의 실측 데이터 처리 원칙**, **포스트 실시간 조회수 카운팅 엔진**, **공식 블로그와 브랜드 블로그의 권한 격리 및 운영 체계**, **맞춤형 커스텀 기업 사이트 라우팅**, 그리고 외부 브랜드 사이트로부터 `creaibox.com` 메인 사이트로의 **SEO 백링크(PageRank Link Equity) 가산점 전달 아키텍처**를 종합 정리한 공식 기술 명세서입니다.

---

## 2. 블로그 통계 대시보드 100% 순수 데이터 원칙
- **가짜/샘플/추정 데이터 100% 제거**:
  - 기존 보조 추정치 및 가짜 샘플 생성 알고리즘을 완벽히 제거.
  - GA4 실측 데이터 및 DB 실측 조회수만 100% 정직하게 표시 (수집 데이터 미존재 시 `0회`, `0명`, `0초`로 투명하게 리턴).
- **상단 주요 지표 카드**:
  - `누적 페이지 뷰 (PV)`: 해당 브랜드의 모든 발행글 DB 조회수(`views`) 실측 합산 수치.
  - `누적 방문자 (UV)`, `평균 체류 시간`, `실시간 동시 접속자`: GA4 API 실측 데이터 기반.
- **발행글 리스트 10개 한눈 패널 및 페이징 컨트롤**:
  - `일간 방문 흐름 (최근 7일)` 대형 차트 제거 ➡️ 2열(Grid) 레이아웃의 `발행글 리스트` 패널로 전면 교체.
  - 10개 항목이 스크롤 없이 한눈에 시원하게 표시됨.
  - 상단 우측 페이징 버튼(`< 이전`, `다음 >`, `1 / N 페이지`) 및 `총 X개 발행됨` 뱃지 배치로 브랜드의 전체 발행 포스트 탐색 가능.
  - 포스트별 우측에 에메랄드 뱃지로 **`👁️ X회 누적`** 실측 조회수 강조.

---

## 3. 포스트 실시간 DB 조회수 (+1) 카운팅 엔진
- **작동 방식**:
  - 방문자 또는 관리자가 블로그 글(`https://creaibox.com/blog/[slug]`, `https://[brand].creaibox.com/[slug]`, 커스텀 사이트 포스트)을 열람할 때 마운트 핸들러에서 Supabase DB `writing_creaibox_posts` 테이블의 `views` 컬럼을 +1 실시간 증가 업데이트:
    ```typescript
    const currentViews = Number(post.views || 0);
    void supabase
      .from("writing_creaibox_posts")
      .update({ views: currentViews + 1 })
      .eq("id", post.id);
    ```
- **효과**:
  - 구글 애널리틱스 24~48시간 집계 딜레이와 무관하게, 크리에이박스 스튜디오 대시보드에서 포스트별 조회수 및 누적 PV가 즉시 실시간 동기화됨.

---

## 4. 공식 블로그(`creaibox.com/blog`) 권한 및 원고 관리 구조
- **공식 블로그 작성 및 발행 권한**:
  - 특정 이메일 단일 계정이 아닌, DB `profiles` 테이블의 **`role = 'ADMIN'`** (관리자) 권한을 부여받은 모든 계정이 공식 블로그에 글을 작성하고 게시할 수 있음.
  - 부관리자/팀원 계정 추가 시 회원 관리 대시보드([`/admin/usermanagement`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx))에서 `ADMIN` 권한을 부여하면 공동 공식 블로그 운영 가능.
- **작성 글 목록 및 수정 권한 격리**:
  - 스튜디오 내 작성 글 목록(`list/page.tsx`) 및 원고 에디터(`list/[id]/page.tsx`)는 보안 및 데이터 보호를 위해 **현재 로그인한 계정의 `user_id`로 작성된 원고만 1:1로 조회 및 수정** 가능.
  - 다른 관리자가 작성한 원고의 무단 오수정을 방지하면서, 발행 완료 시 메인 블로그에는 공동으로 통합 게재됨.

---

## 5. 맞춤형 커스텀 기업 홈페이지 및 전용 블로그 라우트
- **웹사이트 지원 체계 2원화**:
  1. `DB 기반 동적 빌더` (`dynamic-renderer`): `golfgosu`, `guidenara`, `downhubs` 등 범용 프리미엄 템플릿 사용 브랜치.
  2. `100% 맞춤형 독립 기업 홈페이지` (`src/app/clients/[client_id]`): `sotongcheum` (소통과 채움), `commufill` (커뮤필) 등 전용 풀코드 구현 기업 사이트.
- **`sotongcheum` 전용 블로그 라우터 구축 (`/blog` 404 해결)**:
  - `clients/sotongcheum/blog/page.tsx` 및 `clients/sotongcheum/blog/[slug]/page.tsx` 신설.
  - 소통과 채움 브랜드의 전용 헤더/푸터 테마 내에서 발행 포스트 목록 및 "아직 발행된 포스팅이 없습니다" 안내 UI가 정상 렌더링되도록 완비.

---

## 6. 클라이언트 사이트 푸터 'Powered by CreAibox' SEO 백링크 가산점 아키텍처
- **SEO 문제점 분석**:
  - 푸터 하단 문구가 단순 텍스트(`<p>Powered by CreAibox</p>`)일 경우, 검색엔진 봇(Googlebot/Naverbot)은 텍스트로 인식하여 `creaibox.com`으로의 백링크 점수(Link Equity)를 인정하지 않음.
- **DoFollow 앵커 태그 전면 개편**:
  - 독립 클라이언트 도메인(`sotongcheum.com`, `downhubs.com`, `guidenara.com` 등) 푸터 하단 문구를 클릭 가능한 DoFollow 앵커 태그로 구성:
    ```html
    <a 
      href="https://creaibox.com" 
      target="_blank" 
      rel="noopener" 
      title="CreAibox - AI 블로그 포스팅 및 웹사이트 자동화 플랫폼"
    >
      Powered by CreAibox Custom Site
    </a>
    ```
- **검색엔진 지수 상승 효과**:
  1. 외부 다수 독립 도메인으로부터의 고품질 백링크 수십~수백 개 자동 형성.
  2. `creaibox.com` 메인 사이트의 도메인 신뢰도(Domain Authority, DA) 및 상위 노출 점수 대폭 상승.
  3. 추천 유입 트래픽(Referral Traffic) 증대 효과.
