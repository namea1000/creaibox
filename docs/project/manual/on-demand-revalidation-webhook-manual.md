# [실무 매뉴얼] CreaiBox 온디맨드 웹훅(Webhook) 캐시 무효화 가이드

> **문서 분류**: 서비스 실무 매뉴얼 (HOW-TO & 실전 가이드)
> **연관 아키텍처 명세서**: `docs/arch/01_core-and-infra/on-demand-revalidation-webhook-architecture.md` (심도 깊은 기술/설계 원리는 아키텍처 문서를 참조하세요)
> **연관 데이터베이스 DDL**: `docs/database/sql/webhook-revalidate-blog.sql`

---

## 1. 개요 및 목적 (WHY)
이 매뉴얼은 CreaiBox의 블로그, AI 사이트 빌더 등에서 글을 작성하거나 수정했을 때, **0.5초 이내에 라이브 사이트에 즉시 반영(캐시 폭파)**되도록 구성하는 실전 셋업 방법을 안내합니다.

* **타겟 독자**: 기획자, 실무 개발자, DB 관리자
* **적용 대상**: 무한 캐시(`revalidate = false`)가 설정된 모든 프론트엔드 라우트

## 2. HOW-TO: Supabase Webhook 셋업 방법 (1분 컷)

소스 코드를 한 줄도 수정할 필요 없이, 아래 순서대로 데이터베이스에 센서(트리거)를 부착하면 셋업이 끝납니다.

### 단계 1: Supabase 대시보드 접속
1. 운영 중인 Supabase 프로젝트 대시보드에 로그인합니다.
2. 좌측 메뉴에서 **[SQL Editor]** 탭으로 이동합니다.
3. 새로운 쿼리 탭(New Query)을 엽니다.

### 단계 2: SQL 스크립트 실행
아래 경로에 저장된 DDL 스크립트 파일을 열어 전체 내용을 복사한 뒤, Supabase SQL Editor에 붙여넣습니다.
- **파일 경로**: `docs/database/sql/webhook-revalidate-blog.sql`

```text
-- 주의: 하드코딩된 'https://creaibox.com/api/revalidate-blog' 주소를 
-- 실제 서비스 중인 라이브 도메인으로 확인 후 RUN(실행) 버튼을 클릭하세요.
```

### 단계 3: 동작 테스트
1. CreaiBox 스튜디오(관리자)에 접속하여 기존에 발행된 블로그 글의 제목을 아무거나 수정하고 [저장]합니다.
2. 라이브 사이트(예: `smilekang.creaibox.com/slug`)에 접속하여 새로고침(F5)을 누릅니다.
3. 60초를 기다릴 필요 없이 즉시 바뀐 제목이 보이면 Webhook 셋업이 100% 성공한 것입니다.

---

## 3. 실무 개발자 필수 참고 (금지 패턴 & Anti-Patterns)

> [!WARNING]
> **캐시 무효화 관련 절대 금지 사항**

1. **프론트엔드/백엔드 소스 코드에서 수동으로 API 찌르기 (절대 금지)**
   - "새로운 AI 봇 포스팅 기능"이나 "엑셀 대량 업로드 기능"을 개발하실 때, 코드 안에 `fetch('/api/revalidate-blog')`를 수동으로 넣지 마세요!
   - DB 트리거가 모든 것을 알아서 감지하므로, 실무 개발자는 그냥 `writing_creaibox_posts` 테이블에 데이터를 INSERT/UPDATE 하기만 하면 됩니다.

2. **개발 로컬 환경(Localhost)에서 500 에러 발생 시 대처법**
   - 로컬에서 글을 저장할 때 Webhook 트리거가 발동하여 `creaibox.com` 실서버의 API를 찌르게 됩니다.
   - 만약 로컬 서버의 캐시를 날리며 테스트하고 싶다면, SQL 함수 내부의 URL을 임시로 ngrok 주소(`https://xxxx.ngrok.io/api/revalidate-blog`)로 변경하여 테스트하셔야 합니다. (로컬호스트 주소 `127.0.0.1`로는 Supabase 클라우드에서 쏠 수 없습니다.)

## 4. FAQ
**Q. 새로운 커스텀 템플릿(AI 웹사이트 빌더)을 만들면 트리거를 또 달아야 하나요?**
A. 아닙니다! 데이터를 읽어가는 프론트엔드 화면(껍데기)이 1,000개가 추가되더라도, 글이 저장되는 원본 DB 테이블(`writing_creaibox_posts`)은 1개이므로 트리거는 영구적으로 1번만 셋업해두면 모든 템플릿이 자동으로 캐시 무효화 혜택을 받습니다.
