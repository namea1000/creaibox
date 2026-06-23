# Reserved Brand IDs 운영 인계 문서

이 문서는 CreAIbox 브랜드 ID(`{brand_id}.creaibox.com`) 예약어/블랙리스트 데이터 작업 현황과 다음 작업자가 이어받아야 할 DB 반영 절차를 정리한다.

## 현재 상태

- 원천 데이터 파일: `src/lib/constants/reservedBrandsData.json`
- 현재 레코드 수: `77,985`
- 카테고리 수: `22`
- `brand_id` 형식: `^[a-z0-9]{2,15}$`
- 중복 `brand_id`: 없음
- TypeScript 검사: `./node_modules/.bin/tsc --noEmit --pretty false` 통과
- 파일 크기: 약 `11.5MB`

중요: 이 JSON 파일은 현재 "원천 데이터"일 뿐이다. 실제 사용자 브랜드 ID 신청 차단은 Supabase의 `reserved_brand_ids` 테이블 조회 결과로 동작한다. 따라서 JSON만 커밋되어 있고 DB에 seed/import 하지 않으면 실서비스 차단에는 반영되지 않는다.

## JSON 레코드 포맷

```json
{
  "brand_id": "apple",
  "category": "TRADEMARK",
  "reason": "제품명/상표명 선점 및 브랜드 사칭 방지"
}
```

필드 규칙:

- `brand_id`: 영문 소문자와 숫자만 허용, 2~15자.
- `category`: 아래 22개 카테고리 중 하나.
- `reason`: 운영자가 이해할 수 있는 한국어 차단 사유.

## 카테고리 목록

- `SYSTEM`: 시스템 라우팅 및 운영 필수 예약어
- `GOVERNMENT`: 국가/공공기관/지자체 사칭 방지
- `MEDIA`: 언론사/방송사 사칭 방지
- `FINANCE`: 금융기관/증권/결제 피싱 방지
- `COMPANY`: 주요 기업/브랜드 사칭 방지
- `IT_SERVICE`: 글로벌 IT 서비스/플랫폼 사칭 방지
- `INFLUENCER`: 크리에이터/셀럽 사칭 방지
- `EDUCATION`: 대학/교육기관 사칭 방지
- `GEOGRAPHY`: 도시/국가/관광지/지역명 선점 방지
- `COMMON_SERVICE`: 공용 상업 키워드 및 프리미엄 일반어 선점 관리
- `ADULT_GAMBLING`: 성인/도박/사행성 서비스 차단
- `ABUSE`: 욕설/혐오/악성 행위 키워드 차단
- `TRADEMARK`: 제품명/상표명 보호
- `PAYMENT_SECURITY`: 결제/환불/인증/보안 피싱 방지
- `CRYPTO`: 가상자산/거래소/지갑/토큰 사칭 방지
- `HEALTHCARE`: 의료/병원/약국/의약품 사칭 방지
- `RELIGION_POLITICS`: 종교/정당/선거/정치인 사칭 방지
- `MILITARY_SECURITY`: 군사/안보/정보기관 사칭 방지
- `INFRASTRUCTURE`: DNS, CDN, SSL, API 등 인프라 예약어
- `DOMAIN_BRAND`: 도메인/호스팅/인증서 사업자 사칭 방지
- `PUBLIC_SERVICE`: 복지/여권/비자/민원 등 공공서비스 사칭 방지
- `HIGH_RISK_COMMERCE`: 상품권/리셀/명품/투자 등 고위험 상거래 사기 방지

## 카테고리별 현재 분포

| Category | Count |
| --- | ---: |
| `SYSTEM` | 946 |
| `GOVERNMENT` | 2,736 |
| `MEDIA` | 1,244 |
| `FINANCE` | 2,652 |
| `COMPANY` | 2,645 |
| `IT_SERVICE` | 4,874 |
| `INFLUENCER` | 2,221 |
| `EDUCATION` | 1,619 |
| `GEOGRAPHY` | 5,313 |
| `COMMON_SERVICE` | 13,134 |
| `ADULT_GAMBLING` | 2,606 |
| `ABUSE` | 1,875 |
| `TRADEMARK` | 10,662 |
| `PAYMENT_SECURITY` | 2,024 |
| `CRYPTO` | 3,168 |
| `HEALTHCARE` | 2,330 |
| `RELIGION_POLITICS` | 1,262 |
| `MILITARY_SECURITY` | 1,394 |
| `INFRASTRUCTURE` | 2,197 |
| `DOMAIN_BRAND` | 3,092 |
| `PUBLIC_SERVICE` | 1,293 |
| `HIGH_RISK_COMMERCE` | 8,698 |

## 이번 데이터 보강 범위

다음 축을 중심으로 대량 보강했다.

- `admin`, `login`, `api`, `studio`, `blog` 등 시스템 예약어
- 국내외 정부기관, 주요 도시, 국가명, 공공서비스 키워드
- 국내외 은행, 카드사, 증권사, 결제사, 핀테크 브랜드
- 글로벌 대기업, 한국 주요 기업, 제품명, 상표명
- AI, 클라우드, 협업툴, SNS, 스트리밍, 개발 플랫폼
- 유명 크리에이터, 셀럽, 스포츠 스타, K-pop 아티스트
- 글로벌 대학, 교육기관, 학술 키워드
- `apple`, `car`, `star`, `home`, `love`, `music`, `money`, `best`, `top` 등 고가치 일반 명사
- `me`, `my`, `you`, `we`, `our`, `this`, `that`, `go`, `ok` 등 대명사/짧은 프리미엄 단어
- 2글자 도메인형 단어와 `ai`, `io`, `co`, `tv` 같은 가치 높은 짧은 조합
- 성인/도박/유흥/불법 성인 서비스 관련 영문/로마자 키워드
- 욕설, 악성 행위, 피싱, 스캠, 성적 협박/착취 관련 위험 표현

## 실서비스 반영 절차

### 1. DB 스키마 확인

현재 코드의 브랜드 신청 차단은 Supabase `reserved_brand_ids` 테이블을 조회한다.

```ts
.from("reserved_brand_ids")
.eq("brand_id", brand)
```

JSON의 `category`를 살리려면 DB 테이블에 `category` 컬럼이 필요하다.

```sql
ALTER TABLE public.reserved_brand_ids
ADD COLUMN IF NOT EXISTS category TEXT;
```

권장 체크 제약조건:

```sql
ALTER TABLE public.reserved_brand_ids
DROP CONSTRAINT IF EXISTS reserved_brand_ids_category_check;

ALTER TABLE public.reserved_brand_ids
ADD CONSTRAINT reserved_brand_ids_category_check
CHECK (category IN (
  'SYSTEM',
  'GOVERNMENT',
  'MEDIA',
  'FINANCE',
  'COMPANY',
  'IT_SERVICE',
  'INFLUENCER',
  'EDUCATION',
  'GEOGRAPHY',
  'COMMON_SERVICE',
  'ADULT_GAMBLING',
  'ABUSE',
  'TRADEMARK',
  'PAYMENT_SECURITY',
  'CRYPTO',
  'HEALTHCARE',
  'RELIGION_POLITICS',
  'MILITARY_SECURITY',
  'INFRASTRUCTURE',
  'DOMAIN_BRAND',
  'PUBLIC_SERVICE',
  'HIGH_RISK_COMMERCE'
));
```

주의: `docs/database/sql/brand-id-blacklist-patch.sql`이 있다면, 이 파일의 category 체크 목록이 12개 구버전인지 확인하고 22개로 갱신해야 한다.

### 2. JSON을 DB에 업서트

브라우저에서 직접 넣지 말고 서버/관리자 스크립트로 배치 업서트한다.

권장 upsert payload:

```ts
{
  brand_id: item.brand_id,
  category: item.category,
  reason: item.reason
}
```

권장 충돌 기준:

```ts
upsert(rows, { onConflict: "brand_id" })
```

`77,985`건이므로 한 번에 전송하지 말고 500~1,000건 단위로 chunk 처리하는 것이 좋다.

### 3. 관리자 화면 보강

현재 관리자 블랙리스트 화면은 `brand_id`, `reason`, `created_at` 중심으로 표시한다. DB에 `category`를 저장한다면 다음도 같이 반영하는 것이 좋다.

- `reserved_brand_ids` 조회 select에 `category` 추가
- 수동 등록 폼에 category select 추가
- 목록 테이블에 category badge 표시
- 카테고리 필터 추가

## 검증 명령

JSON 원천 파일 검증:

```bash
node -e "const fs=require('fs'); const p='src/lib/constants/reservedBrandsData.json'; const data=JSON.parse(fs.readFileSync(p,'utf8')); const seen=new Set(); const bad=[]; for (const x of data){ if(!/^[a-z0-9]{2,15}$/.test(x.brand_id)||!x.category||!x.reason||seen.has(x.brand_id)) bad.push(x); seen.add(x.brand_id);} console.log({records:data.length, unique:seen.size, bad:bad.length}); if(bad.length) process.exit(1);"
```

TypeScript 검사:

```bash
./node_modules/.bin/tsc --noEmit --pretty false
```

## 운영 주의사항

- 지금 데이터는 보수적으로 넓게 막는 전략이다. 좋은 일반어까지 막아두고, 추후 승인제/추첨제/경매/수동 배정으로 풀 수 있다.
- `brand_id`가 2~15자 제한이므로 한글 금칙어는 직접 저장하지 않는다. 한글 발음의 영문/로마자 변형을 저장한다.
- 대용량 JSON을 클라이언트 번들에 import하면 번들 크기 문제가 생길 수 있다. 이 파일은 DB seed 또는 서버 전용 관리 작업의 원천 데이터로 다루는 것이 좋다.
- 실제 차단 여부의 최종 기준은 DB 테이블이다. JSON과 DB가 불일치하면 DB가 우선한다.
