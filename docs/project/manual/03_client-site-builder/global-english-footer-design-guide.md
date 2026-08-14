# 🌐 글로벌 영문 사이트(creaibox.com/en) 푸터(Footer) 디자인 및 법적 규격 가이드

본 문서는 향후 CreaiBox 글로벌 영문 버전 홈페이지(`creaibox.com/en`) 오픈 시, 해외 스타트업(Repaint, Aipress 등) 수준의 세련되고 미니멀한 글로벌 표준 푸터 UI를 구축하기 위한 디자인 및 법률 가이드라인입니다.

---

## 1. 💡 해외 사이트 푸터가 심플한 이유 (배경 및 법적 근거)

### ① 해외(미국/유럽 등) 전자상거래 법률 차이
- **한국 (전자상거래법 제10조)**: 온라인 결제 사이트는 상호명, 대표자명, 사업자등록번호, 통신판매업 신고번호, 사업장 주소, 대표 전화번호/이메일을 푸터에 의무적으로 명시해야 함.
- **글로벌 (미국/유럽 등)**: 사업자등록번호 표기 의무가 없으며, **Terms of Service(이용약관)** 및 **Privacy Policy(개인정보처리방침)** 링크만 명확히 노출되어 있으면 법적으로 충분함. (상세 연락처는 `Contact Us` 독립 페이지로 처리)

### ② MoR (Merchant of Record) 결제 대행 방식 채택
- 해외 SaaS 서비스(Paddle, Lemon Squeezy 등)를 결제대행사로 사용하는 경우, 결제 주체 및 법적 판매자가 결제대행사(MoR)가 되므로 각 국가별 사업자 표기 의무를 결제대행사가 처리함.
- 결과적으로 자사 홈페이지 푸터를 극단적으로 미니멀하고 깨끗하게 유지할 수 있음.

---

## 2. 🎨 글로벌 영문 사이트(`creaibox.com/en`) 푸터 UI 구성 요소

영문 버전에 포함될 필수/권장 요소:

1. **Copyright**: `© 2026 CreaiBox Inc. All rights reserved.`
2. **Legal**:
   - `Terms of Service`
   - `Privacy Policy`
   - `Data Processing Agreement (DPA)` (필요시)
3. **Company / Connect**:
   - `About Us`
   - `Contact Us`
   - `Status` (서비스 상태 모니터링)
   - Social Icons (X/Twitter, LinkedIn, Discord 등)
4. **언어 선택 스위처**: `🌐 English (US)`

---

## 3. 🇰🇷 vs 🌐 한국어/영어 버전 푸터 전략 분리

| 구분 | 한국어 버전 (`creaibox.com`) | 글로벌 영문 버전 (`creaibox.com/en`) |
| :--- | :--- | :--- |
| **디자인 톤앤매너** | 정보 제공형 (상세 법정 사업자 표기) | 미니멀 / 모던 하이엔드 스타트업 스타일 |
| **사업자 정보 표기** | 필수 (상호, 대표자, 사업자번호, 통신판매번호, 주소, 전화번호) | **제거 (약관 링크 및 Copyright만 간결 배치)** |
| **결제 모듈** | 토스페이먼츠, 카카오페이, 포트원 | Paddle, Lemon Squeezy (MoR 방식) |

---

## 4. 📝 AI 에이전트 구축 시 참조 지침
- 영문 버전(`src/app/[locale]/...` 또는 `src/app/en/...`) 푸터 컴포넌트 개발 시 한국어 버전의 사업자 정보 블록을 조건부 분기(`locale === 'en'`)하여 숨기거나 감추고, 해외 스타트업 스타일의 4열 링크 및 미니멀 하단 바만 노출하도록 구현할 것.
