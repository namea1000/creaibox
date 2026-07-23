# CreAibox 요금제 정책 및 DB/코드 아키텍처 가이드 (Pricing Plan Guide)

이 문서는 CreAibox 플랫폼의 **공식 4대 요금제 체계, 네이밍 전략, 백엔드/DB 스키마 매핑 아키텍처 및 White-Labeling(출처 표시 온/오프) 정책**을 정의하는 공식 개발 및 서비스 가이드 문서입니다.

---

## 1. 공식 4대 요금제 체계 (Pricing Tier Lineup)

CreAibox는 개인 크리에이터부터 대형 에이전시까지 수용할 수 있는 4단계 직관적 구독 요금제 체계를 갖추고 있습니다.

| 플랜명 (Plan Name) | 월 결제액 | 연 결제액 (할인 적용) | 주요 대상 및 특징 |
| :--- | :--- | :--- | :--- |
| **Free Plan** | **0원** | 0원 | 스타터 크리에이터를 위한 기본 창작 체험 플랜 |
| **Creator Plan** | **9,900원** | 연 94,800원 (7,900원/월) | 블로그, 미디어, 음악 작업을 활발히 하는 창작자 플랜 |
| **Pro Plan** | **19,900원** | 연 190,800원 (15,900원/월) | 도메인 연결 및 독립 홈페이지를 활용하는 고급 창작자 플랜 *(Best)* |
| **Premier Plan** | **29,900원** | 연 286,800원 (23,900원/월) | 협업 기능 및 무제한 DB 저장을 원하는 전문 에이전시 플랜 |

> 💡 **Business 맞춤형 플랜**: 요금제 페이지 하단에 배치된 기업 대행/제휴 전용 커스텀 플랜 (별도 문의 방식).

---

## 2. 요금제 네이밍 전략 (Premier vs Premium 결정 배경)

최상위 플랜(29,900원)의 명칭은 **`Premier Plan` (프리미어)**으로 확정되어 운용됩니다.

* **네이밍 결정 사유**:
  1. **Pro(프로)와의 역할 구분**: `Premium`(프리미엄)을 사용할 경우 3단계의 `Pro`와 뜻이 겹쳐 '고급'이라는 개념이 모호해집니다.
  2. **최상위 클래스 어감 강조**: `Premier`(프리미어)는 *영국 프리미어리그(Premier League)*나 *어도비 프리미어(Premiere)*처럼 **'으뜸가는, 최상위 레벨'**의 독보적인 위상을 전달합니다.
  3. **에이전시/기업 타겟 명확화**: Pro 단계를 넘어선 최고 성능과 멀티 브랜드를 지원하는 최상위 전문가 플랜으로 명확히 인지됩니다.

---

## 3. DB & 백엔드 코드 매핑 아키텍처 (`profiles.membership_level`)

### 3-1. 데이터베이스 스키마 (`profiles` 테이블)
회원의 구독 상태는 `profiles` 테이블의 `membership_level` 컬럼으로 저장 및 관리됩니다.

```sql
-- profiles 테이블 회원 등급 저장 예시
UPDATE profiles 
SET membership_level = 'premier' 
WHERE id = 'user_uuid';
```

### 3-2. 백엔드 코드 호환성 매핑 (`membership_level` 값)
백엔드 API 및 프론트엔드 인가 로직에서는 아래 소문자 문자열 키값을 동적으로 파싱하여 인식합니다:

- `"free"` : 무료 회원
- `"creator"` : 크리에이터 플랜
- `"pro"` : 프로 플랜
- `"premier"` : 프리미어 플랜 (최고 등급)
- `"business"` / `"enterprise"` : 기업 맞춤형 플랜 (Premier와 동등한 최고 권한으로 인가)
- `"admin"` / `"super_admin"` : 관리자 (모든 한도 제한 해제)

### 3-3. 플랜별 주요 권한 및 한도 매핑 ([`mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))

```ts
// 브랜드 ID 최대 보유 한도 계산 함수 (getBrandLimit)
function getBrandLimit(membershipLevel: string, role: string) {
  const cleanLevel = (membershipLevel || "").toLowerCase();
  const cleanRole = (role || "").toUpperCase();

  if (cleanRole === "ADMIN" || cleanRole === "SUPER_ADMIN" || cleanLevel === "admin") {
    return 10; // 관리자 최대 10개
  }
  if (cleanLevel === "pro" || cleanLevel === "business" || cleanLevel === "premier" || cleanLevel === "enterprise") {
    return 3;  // Pro / Premier / Business 회원 3개 보유
  }
  if (cleanLevel === "creator") {
    return 2;  // Creator 회원 2개 보유
  }
  return 1;    // Free 회원 1개 기본 보유
}
```

---

## 4. 백링크 마케팅 & White-Labeling (Creaibox Publisher 뱃지 & 브랜드 프로필 정책)

사용자 커스텀 블로그 및 개인 홈페이지 하단에 표출되는 출처 표시 뱃지 및 브랜드 프로필 정책입니다.

### 4-1. 3가지 개편 통합 가이드라인 (1안 + 2안 + 3안 결합)
1. **문구 톤앤매너 완화 및 파스텔 1줄 뱃지화 (3안 적용)**:
   - 둔탁하고 긴 "AI 자동화 배포 기사" 기사 박스를 제거하고, 본문 하단에 깔끔한 1줄 파스텔 뱃지(`✨ Published with CreAibox`)로 경량화.
   - 검색엔진 봇은 1줄 파스텔 뱃지의 `href="https://creaibox.com"` 텍스트 앵커를 100% 동등한 최고 품질의 백링크(Backlink)로 인식하여 도메인 파워 상승 보장.
2. **유료 회원 전용 뱃지 On/Off 스위치 & 사용자 맞춤 작가/브랜드 프로필 카드 (1안 + 2안 적용)**:
   - 메뉴 위치: **"크리에이박스 글쓰기" ➔ "블로그 관리"** ([`blog-management/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/writing/creaibox/blog-management/page.tsx))
   - 유료 회원(`Creator`, `Pro`, `Premier`, `Business`, `Admin`)에게 **`[ 뱃지 표시: ON / OFF ]`** 스위치 제공.
   - **`[ 사용자 맞춤 작가 / 브랜드 프로필 카드 ]`** 기능 제공: 유료 회원이 자신의 프로필(닉네임, 소개글, 아바타, 링크 등) 카드를 등록하면 본문 하단에 인플루언서/작가 브랜딩 카드로 자동 대체 렌더링.
3. **유료 회원이 뱃지 끄기(OFF) 시 푸터(Footer) 백링크 보장 엔진**:
   - 유료 회원이 본문 하단 뱃지 표시를 껐더라도(`OFF`), 블로그 최하단 푸터 영역에 `Powered by CreAibox.com` 1줄 앵커 텍스트를 배치.
   - 방문자 시선에는 전혀 거슬리지 않으면서도, 구글/네이버 크롤링 봇은 수천 개 포스트 푸터에서 CreAibox 백링크를 100% 수집하므로 **플랫폼 백링크 SEO 효과 100% 지속 보장.**

---

## 5. 관련 주요 코드 구현 파일

- **요금제 메인 랜딩**: [`src/app/pricing/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/pricing/page.tsx)
- **마이페이지 & 플랜 한도**: [`src/app/mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx)
- **관리자 사용자 관리**: [`src/app/admin/usermanagement/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx)
- **관리자 사용자 관리 API**: [`src/app/api/admin/users/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/admin/users/route.ts)
- **AI 생성 권한 인가 API**: [`src/app/api/ai/generate/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/ai/generate/route.ts)
- **사이트 빌더 인가 API**: [`src/app/api/client-site-builder/upload/route.ts`](file:///Users/a1234/Local%20Sites/creaibox/src/app/api/client-site-builder/upload/route.ts)

---

## 6. VIP / 지인 수동 무상 부여 (Manual Grant) 관리 지침

요금제 틀은 유지하되 지인, VIP 파트너, 마케팅 협찬 대상, 임직원 등에게 유료 결제 없이 수동으로 플랜(`Creator`, `Pro`, `Premier`)을 무상 부여하고 별도 관리하는 시스템 규정입니다.

### 6-1. 데이터베이스 스키마 (`profiles` 테이블)
* `is_manual_grant` (boolean): `true`일 경우 무상 부여 회원 (정기 결제 크론에서 자동 제외)
* `grant_reason` (text): 부여 사유 (예: `지인 (이동은 대표님 추천)`, `VIP 파트너`, `베타테스터`)
* `grant_expires_at` (timestamp): 기한제 무료 제공 시 만료 일자 (평생 무료 시 NULL)

### 6-2. 마이페이지 UI 연동 ([`mypage/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/mypage/page.tsx))
* `SECURITY` 세션의 `Plan Level` 바로 하단에 **`⭐ VIP SPECIAL MEMBERSHIP`** 전용 골드 뱃지 카드 노출.
* 무상 혜택 사유(예: `지인 (이동은 대표님 추천)`)와 함께 월 정기 결제 없이 무료 이용 중임을 안내.
* 무상 이용 유효 기간(예: `2026-12-31 까지` 또는 `무제한 (평생 무상 혜택)`)을 명확히 시각화하여 사용자가 자신의 특별 부여 상태를 직접 인지할 수 있도록 보장.

### 6-3. 관리자 센터 UI 기능 ([`admin/usermanagement/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/admin/usermanagement/page.tsx))
1. **탭 필터 분리**: `[전체 회원]` | `[💳 정기 결제 회원]` | `[⭐ VIP 수동 무상 부여 회원]`원클릭 필터링 지원.
2. **수동 무상 부여 모달**: `[⭐ VIP 설정]` 버튼 클릭으로 요금제 레벨 선택, `[x] 무상 부여 (자동 결제 제외)` 체크, 부여 사유 메모 작성 및 즉시 반영.
3. **자동 결제 스킵 보장**: PG사 정기 결제 스케줄러 가동 시 `is_manual_grant === true` 회원은 청구 시도를 자동으로 스킵하여 과금 사고를 원천 방지함.

