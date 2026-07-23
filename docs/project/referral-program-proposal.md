 글블로그 (상)

# CreAibox 제휴 파트너십 및 추천 코드(Referral) 시스템 서비스 & 시스템 기안서

이 문서는 인플루언서, 마케터 및 파트너가 CreAibox를 추천하고, 신규 가입자가 추천 코드로 가입 시 혜택을 받으며, 매월 발생 결제금액의 일정 비율(기본 15%~30%)을 지속 수익으로 공유(Revenue Share)하는 **공식 추천 파트너십(Affiliate & Referral Program) 기안서 및 개발 사양 문서**입니다.

---

## 1. 비즈니스 설계 및 수익 공유 구조 (Business Model)

### 1-1. 윈-윈-윈(Win-Win-Win) 삼각 선순환 구조

```
[ 인플루언서 / 파트너 ] ──(추천 코드 배포)──> [ 신규 가입자 (피추천인) ]
        ▲                                                │
        │ (매월 결제액의 20% 수익 정산)                      │ (회원가입 + 10% 할인 / 크레딧 받음)
        └────────────────── [ CreAibox 플랫폼 ] <────────┘
```

1. **신규 가입자 (피추천인) 혜택**:
   - 가입 시 추천 코드 입력 시 **첫 달 결제 10% 할인** 또는 **추가 AI 100 크레딧 무상 제공** (가입 및 결제 전환 유인 강화).
2. **추천 파트너 (인플루언서) 혜택**:
   - 자신이 유치한 피추천인이 유료 요금제(`Creator`, `Pro`, `Premier`)를 결제할 때마다 **매월 결제 금액의 20% (설정 가능)**를 평생/지속 커미션으로 정산 받음.
3. **CreAibox 플랫폼 혜택**:
   - 초기 마케팅 비용 지출 없이 순수 성과 기반(CPA/CPS)으로 신규 유료 고객 대거 확보.

---

## 2. 사용자 및 파트너 프로세스 (Customer & Partner Flow)

### 2-1. 추천 코드 발행 및 유입 경로

1. **파트너 추천 전용 링크**: `https://creaibox.com/signup?ref=GOLF_MASTER`
2. **자동 쿠키/스토리지 연동**: 사용자가 해당 링크로 진입하면 브라우저 쿠키에 `ref=GOLF_MASTER`가 30일간 저장되어 회원가입 시 추천 코드가 자동 입력됨.

### 2-2. 회원가입 절차 (`/signup`)

- 회원가입 폼 하단에 **`[ ⭐ 추천인 코드 (선택)]`** 인풋 필드 배치.
- 추천 코드가 유효할 경우 `"✅ [GOLF_MASTER] 파트너 추천 혜택이 적용되었습니다! (첫 달 10% 할인)"` 메시지 표출.

### 2-3. 정기 결제 및 수익 적립 자동화

- 피추천인이 Pro 플랜(19,900원/월)을 결제하면:
  - 파트너 계정에 **매월 3,980원 (20%)** 자동 적립.
- 피추천인이 구독을 유지하는 한 **매월 정기 결제 시마다 지속 적립**.

---

## 3. 데이터베이스 스키마 설계 (Database Schema)

### 3-1. `referral_codes` (추천 코드 마스터 테이블)

```sql
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL, -- 예: 'GOLF_MASTER', 'JENA2026'
  commission_rate NUMERIC(4, 2) DEFAULT 0.20, -- 커미션 비율 (0.20 = 20%)
  discount_rate NUMERIC(4, 2) DEFAULT 0.10, -- 피추천인 첫달 할인율 (0.10 = 10%)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3-2. `referral_relations` (추천 연결 관계 테이블)

```sql
CREATE TABLE referral_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES profiles(id), -- 추천인 user_id
  referred_user_id UUID REFERENCES profiles(id) UNIQUE, -- 가입한 피추천인 user_id
  referral_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3-3. `referral_earnings` (매월 결제 수익 적립 로그)

```sql
CREATE TABLE referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES profiles(id),
  referred_user_id UUID REFERENCES profiles(id),
  payment_amount INT NOT NULL, -- 실제 결제 금액 (예: 19,900원)
  earned_amount INT NOT NULL, -- 적립 수익금 (예: 3,980원)
  commission_rate NUMERIC(4, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3-4. `referral_payouts` (정산/출금 신청 테이블)

```sql
CREATE TABLE referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  requested_amount INT NOT NULL, -- 출금 신청 금액
  bank_name VARCHAR(50) NOT NULL, -- 은행명
  account_number VARCHAR(50) NOT NULL, -- 계좌번호
  account_holder VARCHAR(50) NOT NULL, -- 예금주
  status VARCHAR(20) DEFAULT 'REQUESTED', -- 'REQUESTED', 'APPROVED', 'REJECTED'
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. 파트너 전용 대시보드 (`/mypage/affiliate` 또는 `/studio/affiliate`)

추천 코드를 가진 인플루언서 및 파트너가 자신의 성과를 실시간으로 확인하는 페이지 UI:

1. **실시간 성과 요약 카드**:
   - 👥 총 유입 회원 수: `48명`
   - 💳 유효 결제 회원 수: `12명`
   - 💰 누적 적립 수익금: `142,500원`
   - 🏦 출금 가능 잔액: `85,000원` `[ 💸 정산 신청하기 ]`
2. **나만의 추천 링크 및 홍보용 배너/텍스트 복사 버튼**:
   - `https://creaibox.com/signup?ref=GOLF_MASTER` `[ 📋 링크 복사 ]`
3. **월별 적립 및 정산 신청 내역 피드**:
   - 가입 회원 아이디(일부 마스킹), 결제 날짜, 발생 수익금 및 정산 처리 상태 표출.

---

## 5. 관리자 센터 (`/admin/affiliates`) 시스템

어드민이 전체 추천 코드 파트너십을 총괄 제어하는 관리 기능:

1. **파트너 추천 코드 생성 및 커미션율 커스텀 설정**:
   - 특정 대형 유튜버/인플루언서에게는 기본 20% 대신 **30% 특별 요율** 부여 가능.
2. **정산 신청 승인 및 입금 처리 모달**:
   - 파트너가 5만원 이상 출금 신청 시 예금주/계좌번호 확인 후 `[ 🟢 입금 완료 승인 ]` 버튼 클릭 ➔ 상태 변경 및 영수증 기록.
3. **어뷰징/셀프 추천 차단 안전장치**:
   - 동일 IP, 동일 결제 카드 정보로 자기 자신을 추천하여 셀프 할인 받는 어뷰징 자동 감지 및 차단 알림.

---

## 6. 개발 및 순차 구축 로드맵

- **Phase 1**: DB 테이블 생성 + 회원가입 페이지 추천 코드 입력 및 `referral_relations` 바인딩
- **Phase 2**: 결제 성공 시 매월 커미션 자동 계산 및 `referral_earnings` 테이블 적립 로직 연동
- **Phase 3**: 파트너 대시보드 UI (`/mypage/affiliate`) 및 정산 신청 폼 구현
- **Phase 4**: 관리자 추천 파트너 관리 페이지 (`/admin/affiliates`) 및 어뷰징 방지 시스템 완성

---

## 7. 인플루언서 전용 이중 파격 혜택 전략 (1달 무료 + 첫 유료 결제 50% 반값 할인)

일반 유저 가입과 유튜버/인플루언서 제휴 유입을 명확히 차별화하여, 인플루언서의 홍보 파급력과 유료 전환율(Conversion Rate)을 극대화하는 2단계 이중 혜택 프로모션 정책입니다.

### 7-1. 일반 유저 vs 인플루언서 추천 유저 혜택 비교

| 구분                            | 일반 유저 (일반 가입)          | 🎥 인플루언서 추천 유저 (시크릿 추천 코드)    |
| :------------------------------ | :----------------------------- | :-------------------------------------------- |
| **1달 차 (무료 체험)**    | 1달 무료 체험 (`0원`)        | **1달 무료 체험 (`0원`)**             |
| **2달 차 (첫 유료 결제)** | 정상가 결제 (예: Pro 19,900원) | **🔥 50% 반값 할인 적용 (Pro 9,950원)** |
| **3달 차 이후**           | 정상가 결제                    | **정상가 결제 (Pro 19,900원)**          |
| **인플루언서 커미션**     | 없음                           | **실제 결제 금액의 20% 매월 지속 정산** |

### 7-2. 왜 50% 할인(반값)을 적용해도 100% 이득인가? (수익성 & LTV 분석)

1. **SaaS 한계 비용(Marginal Cost) ~0원에 가까움**:
   - 가입 유저가 1달 무료 후 이탈하면 CreAibox 수익은 **`0원`**입니다.
   - 하지만 50% 할인을 통해 2달 차에 **`9,950원`**을 결제하게 만들면, 이탈했을 0원 대비 **`9,950원` 순수 매출**이 새로 생깁니다.
2. **"50% OFF (반값!)"의 미친 썸네일/타이틀 마케팅 파워**:
   - 인플루언서 유튜브 썸네일에 **"CreAibox 1달 무료 + 첫 결제 반값 50% 쿠폰"** 문구가 박히는 순간 어마어마한 클릭률(CTR)과 가입 폭주가 일어납니다.
3. **60일 사용 후 이탈율(Churn) 급감 (LTV 극대화)**:
   - 1달 무료 + 2달 차 50% 할인으로 **총 60일(2달)**간 사용자를 서비스에 락인(Lock-in)시키면, 사용자는 자신의 블로그, 브랜드 ID, 맞춤 템플릿이 완전히 안착되어 3달 차부터는 정상가(19,900원)를 군말 없이 결제하게 됩니다.

---

## 8. 추천 제휴 시스템의 홍보 파급력 & 비즈니스 효과 분석 (PR & Growth Impact)

추천 제휴 시스템이 CreAibox의 초기 회원 모집 및 서비스 폭발적 성장에 미치는 4가지 핵심 이유와 글로벌 성공 사례 분석입니다.

### 8-1. 4대 핵심 성공 요인 (Growth Factors)

1. **"리스크 Zero" 100% 성과급 마케팅 (CPS / CPA)**:
   - 일반 네이버/구글/페이스북 광고는 결제를 안 해도 클릭당 광고비(CPC)가 날아가 비용 손실 리스크가 높음.
   - 추천 코드제는 **실제 유료 결제 고객이 들어왔을 때만** 결제금의 20%를 떼어주므로, **마케팅 비용 손실 리스크가 0%**임.
2. **인플루언서/블로거의 자발적 콘텐츠 생산 (Passive Income 동기부여)**:
   - IT, AI 툴 소개, 수익형 블로그, 재테크 유튜버 및 네이버 파워블로거들은 매월 고정으로 들어오는 수동 소득(Passive Income)을 간절히 원함.
   - *"CreAibox라는 AI 글쓰기 툴 진짜 좋습니다. 내 추천 코드로 가입하면 1달 무료 + 첫 결제 반값 50% 할인됩니다"* 리뷰 콘텐츠를 자발적으로 정성껏 작성하여 퍼트림.
3. **가입 및 결제 전환율(Conversion Rate) 급증**:
   - 단순히 "가입하세요"보다 "추천 코드 입력 시 **1달 무료 + 첫 결제 50% 반값 쿠폰**" 명분이 주어져 결제 망설임이 사라짐.
4. **수십~수백 명의 자발적 영업사원 군단 형성**:
   - CreAibox 홍보를 본사 혼자 하는 것이 아니라, 외부 파트너 마케터들이 CreAibox의 파트너가 되어 동시에 시장을 개척함.

### 8-2. 글로벌 SaaS 성공 사례 벤치마킹

* **Jasper AI (AI 글쓰기 솔루션)**:
  - 제휴 추천 프로그램(매월 30% 지속 커미션) 단 하나로 **초기 연 매출 1,000억 원(MRR 80억+)을 달성**.
  - 수천 명의 블로거와 유튜버가 자발적으로 *"Jasper AI로 블로그 돈 버는 법"* 콘텐츠를 쏟아냄.
* **Shopify (글로벌 쇼핑몰 플랫폼)**:
  - 제휴 추천 제도로 수많은 유튜버와 강사들이 *"Shopify 쇼핑몰 창업 강좌"*를 무료로 풀면서 세계 1위 쇼핑몰 솔루션으로 등극.

### 8-3. 초기 런칭 섭외 및 운영 실행 전략

1. **타겟 파트너 선제 제안**:
   - 시스템 오픈 직후 AI/블로그/재테크 관련 파워블로거 및 유튜버 20~30명에게 이메일로 **VIP 파트너 우대 요율(30% 커미션) 제안**을 보내 유입 물꼬를 틤.
2. **어뷰징(Self-Referral) 자동 감지 차단**:
   - 동일 IP, 동일 결제 카드 정보로 자기 자신의 코드로 셀프 할인 받는 행위를 차단하여 100% 흑자 구조 마케팅을 유지함.
