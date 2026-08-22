# CreaiBox AI 웹사이트 정밀 진단 시스템 아키텍처 명세서 (Site Audit Architecture)

관련 문서:
- 🔵 [서비스 실무 매뉴얼](file:///Users/a1234/Local%20Sites/creaibox/docs/project/manual/site-audit-manual.md)
- 🟡 [DB 스키마 명세서](file:///Users/a1234/Local%20Sites/creaibox/docs/database/site-audits-schema.md)
- 🟢 [순수 실행 SQL DDL](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/site-audits.sql)

---

## 1. 시스템 개요 및 목적
`AI 웹사이트 정밀 진단 시스템`은 사용자가 입력한 모든 외부 웹사이트의 소스 코드, HTML 태그, HTTP 응답 헤더, DNS 및 프레임셋 구조를 심층 크롤링·분석하여 다음 5대 영역을 진단합니다:
1. **개발 프로그램 & 엔진 자동 판별** (Figma Site, WordPress, Wix, Imweb, Pure HTML/Frameset, Next.js 등)
2. **도메인 & 프레임셋 포워딩 취약점 검출** (주소창 고정 포워딩, SSL 미적용 등)
3. **검색엔진(SEO) 및 소셜 메타태그 최적화 점수**
4. **CreaiBox 초격차 1:1 비교 분석표 자동 도출**
5. **원클릭 현대화 이관 솔루션 파이프라인 연계**

---

## 2. 진단 파이프라인 아키텍처

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 / 클라이언트
    participant UI as Studio Site Audit UI (/studio/site-audit)
    participant API as Audit API (/api/studio/site-audit/scan)
    participant Scanner as Deep HTML & Engine Parser
    participant DB as Supabase DB (site_audits)
    participant Migration as Migration Pipeline

    User->>UI: 타겟 웹사이트 URL 입력 (예: http://futuremind.kr)
    UI->>API: POST /api/studio/site-audit/scan
    API->>Scanner: 실시간 HTML & 헤더 스캐닝 수행
    Scanner-->>API: 기술스택, 프레임셋, 메타태그, SEO/보안 취약점 판별 결과
    API->>DB: site_audits 테이블에 진단 보고서 레코드 영구 저장 (로그인 유저)
    API-->>UI: 정밀 진단 보고서 JSON 반환 (점수, 비교표, 취약점)
    UI-->>User: 종합 등급(S~F), 1:1 비교표, [CreaiBox로 1초 현대화 이관] 버튼 렌더링
    User->>Migration: 이관 시작 버튼 클릭 시 마이그레이션 파이프라인으로 즉시 인계
```

---

## 3. 핵심 분석 알고리즘

### 3.1. 고정 프레임셋(Frameset) 포워딩 판별
- 정규식 `<frameset[\s\S]*?>` 및 `<frame[\s\S]*?src=["']([^"']+)["']>`를 감지하여 도메인 업체(가비아, 후이즈 등)의 고정 포워딩 여부를 100% 감지.
- 프레임 내부의 실제 호스팅 주소(`frame_src`)를 자동 추출.

### 3.2. 개발 엔진 및 기술 스택 시그니처 매칭
- **Figma Site**: `figma.site`, `figma-iframe`
- **Imweb**: `imweb.me`, `imweb-section`, `cdn.imweb.me`
- **Wix**: `wixsite.com`, `wix-sdk`, `wix-warmup-data`
- **WordPress**: `wp-content`, `wp-includes`, `wp-json`
- **Cafe24**: `cafe24.com`, `cafe24cdn`
- **Next.js / Vercel**: `_next/static`, `__NEXT_DATA__`
- **Pure Frameset**: 본문 없이 프레임셋만 존재하는 레거시 사이트
