# 🔵 관리자 센터(Admin Center) 16대 메뉴 실무 운용 및 초고속 관리 가이드

> **관련 문서 링크**:
> - 🔴 [관리자 센터 통합 아키텍처 & 0ms 전역 인증 기술 명세서](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/01_core-and-infra/admin-center-architecture.md)
> - 🟡 [관리자 화이트리스트 DB 스키마 명세서](file:///Users/a1234/Local%20Sites/creaibox/docs/database/admin-whitelist-schema.md)
> - 🟢 [관리자 화이트리스트 SQL DDL](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/admin-whitelist.sql)

---

## 1. 개요 및 접근 권한 (Overview & Access)

`CreaiBox` 관리자 센터(`/admin`)는 플랫폼의 모든 회원, 결제, API 키, 도메인 승인 및 시스템 리소스를 통제하는 전용 관리 공간입니다.

### 1-1. 관리자 접근 권한 규정
* **기본 슈퍼 어드민 계정**:
  - `creaiboxofficial@gmail.com`
  - `jenam7720@gmail.com`
  - `namjjang7720@gmail.com`
  - `namjang7720@gmail.com`
* **동적 관리자 추가**:
  - DB `admin_whitelist` 테이블에 이메일을 등록하거나, `profiles.role = 'ADMIN'`으로 지정된 회원은 로그인 즉시 사이드바 하단에 `[ 🛡️ 관리자 센터 ]` 메뉴가 자동으로 노출됩니다.

---

## 2. 16대 서브 메뉴별 실무 조작 매뉴얼 (HOW-TO Guide)

### ① 사용자 관리 (`/admin/usermanagement`)
* **회원 권한 변경**:
  - 회원 목록에서 `FREE`, `PAID`, `MANAGER`, `ADMIN` 뱃지를 클릭하여 즉시 등급 변경.
* **VIP 무상 수동 부여 (Manual VIP Grant)**:
  - `[ 👑 VIP 부여 ]` 버튼을 눌러 Pro/Business 플랜과 무상 부여 사유를 입력하여 즉시 특권 활성화.
* **불량 회원 차단 (Ban)**:
  - 스팸/매크로 의심 계정의 `[ 🚫 차단 ]` 버튼을 누르면 즉시 모든 AI 생성 및 블로그 발행이 물리적으로 중단됨.

### ② 브랜드 ID 및 도메인 관리 (`/admin/brands`)
* **서브도메인(`brand.creaibox.com`) 심사**:
  - 신청 목록에서 `[ 승인 ]` 클릭 시 0.1초 만에 즉시 서브도메인이 자동 프로비저닝되어 전 세계로 활성화됨.
* **AI 상표권 사전 진단 (AI Brand Audit)**:
  - `[ 🤖 AI 브랜드 심사 ]` 클릭 시 Gemini AI가 네이버/구글 검색 및 상표권 침해 위험도를 분석하여 `SAFE / WARNING / DANGER` 3단계 리포트 제공.

### ③ API Gateway Vault (`/admin/apivault`)
* **AI 및 검색 엔진 API Key 등록**:
  - Provider Type (`AI`, `Image`, `Video`, `Voice`, `Search`) 선택 후 키 입력.
  - 입력 즉시 **AES-256-GCM 알고리즘으로 자동 암호화**되어 DB에 저장되며, 목록에는 `••••••••`로 안전하게 마스킹됨.
* **스마트 키 로테이션 (Rotation)**:
  - `일일 한도(Daily Limit)` 및 `우선순위(Priority)`를 설정하여, 한도 초과 시 자동으로 다음 유휴 키로 무중단 스위칭됨.

### ④ 예약어 및 블랙리스트 관리 (`/admin/reserved-words`)
* **선점 방지 예약어 등록**:
  - 공공기관, 대기업 브랜드, 욕설 등 22대 카테고리별로 브랜드 ID 선점 방지 단어 추가.
* **AI 1,600개 자율 스캔 (`[ ⚡ 16개 카테고리 일괄 스캔 ]`)**:
  - 클릭 1번으로 LLaMA 3.3 AI 모델이 16개 카테고리 전역에서 1,600개 미등록 고유 명사를 자동 발굴하여 DB에 일괄 등록.

### ⑤ Resend 이메일 관리 (`/admin/resend`)
* **도메인별 이메일 계정 모니터링**:
  - 사용자들이 생성한 커스텀 이메일 계정 수 및 일일 발송/수신 현황 모니터링.
* **인바운드 웹훅 무상태 포워딩 상태 점검**:
  - 외부에서 수신된 메일이 0.1초 만에 사용자 개인 메일로 정상 포워딩되는지 실시간 상태 확인.

### ⑥ Google & SEO 관리 (`/admin/google`, `/admin/seo`)
* **Google OAuth2 & GA4 연동**:
  - 관리자 구글 계정으로 로그인하여 Search Console 및 GA4 실시간 유입 분석 통계 동기화.
* **사이트맵 및 색인 상태 점검**:
  - `sitemap.xml`, `robots.txt` 무결성 확인 및 canonical 누락 글 원클릭 탐지.

---

## 3. 관리자 센터 초고속 운용 팁 & 트러블슈팅 (Performance & FAQ)

| 상황 | 원인 | 해결 조치 방법 |
|---|---|---|
| **관리자 페이지 진입 시 홈으로 튕김** | 비인가 계정으로 로그인되어 있거나 세션 만료 | 슈퍼 어드민 이메일(`creaiboxofficial@gmail.com` 등)로 구글 로그인 후 재진입 |
| **새로 추가한 관리자가 메뉴가 안 뜸** | `admin_whitelist` DB 등록 누락 | Supabase SQL Editor에서 `INSERT INTO admin_whitelist (email) VALUES ('새이메일');` 실행 |
| **API Vault 키를 등록했는데 작동 안 함** | Google Cloud Console에서 해당 API 서비스 미활성화 | GCP 콘솔에서 `Generative Language API` 또는 `YouTube Data API v3` 활성화 여부 확인 |
| **서브도메인 신청 승인 후 404가 뜸** | Vercel Edge DNS 전파 지연 (최대 10초) | 브라우저 캐시 새로고침(Ctrl+F5 / Cmd+Shift+R) 후 재접속 |

---

## 4. 🚫 금지 패턴 (Anti-Patterns)

1. **DB에 평문 API 키 직접 INSERT 금지**:
   - `admin_api_vault` 테이블에 SQL 툴로 암호화되지 않은 평문 키를 직접 넣지 마세요. (반드시 `/admin/apivault` UI를 통해 AES-256 암호화 저장할 것)
2. **일반 유저에게 ADMIN 권한 남발 금지**:
   - `profiles.role`을 `ADMIN`으로 변경하면 모든 API Key 및 회원 개인정보에 접근할 수 있으므로 신뢰할 수 있는 개발팀에게만 부여하세요.
