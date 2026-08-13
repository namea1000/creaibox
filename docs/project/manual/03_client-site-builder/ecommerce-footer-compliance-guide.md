# CreAibox 전자상거래 웹사이트 푸터(Footer) 법적 필수 명시사항 준수 가이드

이 매뉴얼은 대한민국 **전자상거래 등에서의 소비자보호에 관한 법률(제10조 및 동법 시행령 제11조의4)**에 따른 CreAibox 웹사이트 푸터(Footer) 하단 사업자 정보 필수 고지 규정과 **'호스팅 서비스 사업자'** 표기의 정확한 법적 의미 및 실무 구현 방식을 설명합니다.

---

## 1. 📜 전자상거래법상 푸터(Footer) 필수 5대 법적 고지 항목

유료 요금제 결제, 도메인 구매, 커스텀 서비스 등을 제공하는 모든 통신판매업(온라인 비즈니스) 웹사이트는 메인 화면 하단(Footer)에 다음 5가지 핵심 사업자 정보를 **소비자가 쉽게 알아볼 수 있도록 명시**해야 합니다.

| 번호 | 필수 고지 항목 | 법적 기준 및 예시 | CreAibox 적용 내용 |
| :--- | :--- | :--- | :--- |
| **1** | **상호명 및 대표자 성명** | 사업자등록증 상 상호 및 대표자 | 상호명: 크리에이박스(CreAibox) \| 대표자: 남정언 |
| **2** | **사업장 소재지 주소** | 사업자등록증 상 주소 | 충청남도 천안시 서북구 불당23로 70, 7층 702호 H24호 |
| **3** | **연락처 (전화번호/이메일)** | 신속한 소비자 상담/불만 처리용 | 대표전화: 070-8064-8204 \| 이메일: contact@creaibox.com |
| **4** | **사업자등록번호 & 통신판매업신고번호** | 국세청 등록번호 및 지자체 신고번호 | 사업자등록번호: 535-69-00459 |
| **5** | **호스팅 서비스 사업자** | 현재 웹사이트가 구축되어 실행 중인 서버 제공업체 | **호스팅 서비스 사업자: Vercel Inc.** (또는 AWS) |

---

## 2. 🔍 '호스팅 서비스 사업자' 표기의 정확한 법적 의미

### 💡 도입 배경 및 목적
과거 일부 불법 쇼핑몰이나 대포 사이트들이 전자상거래 결제 후 사이트를 폐쇄하고 잠적하는 일명 '먹튀' 사기를 방지하기 위해 공정거래위원회에서 신설한 법적 조항입니다. 소비자와 수사기관이 문제 발생 시 해당 웹사이트가 실제로 거주하는 물리적 서버의 소유자(호스팅사)를 즉시 추적할 수 있도록 고지 의무를 부여했습니다.

### ⚠️ 자주 일어나는 오해와 법적 명확화
- ❌ **오해**: "CreAibox가 유저들에게 커스텀 블로그/독립 도메인/웹호스팅을 제공하므로, '도메인 사업자'나 '웹호스팅 제공자'라고 표기해야 하나요?"
- ⭕ **진실**: **그렇지 않습니다.** 푸터의 '호스팅 서비스 사업자'는 CreAibox의 **사업 종목(비즈니스 모델)을 의미하는 것이 아닙니다.** 
- 🎯 **핵심**: 지금 고객이 접속해 있는 **CreAibox 웹사이트 자체의 소스 코드가 띄워져 있는 인프라 호스팅 제공사(예: Vercel Inc., Amazon Web Services 등)**의 상호를 기술하는 법적 란입니다.

---

## 3. 💻 CreAibox 표준 Footer 코드 구현 예시 (`src/components/layout/Footer.tsx`)

CreAibox 프론트엔드 푸터 컴포넌트에는 국세청 등록 정보와 전자상거래법 기준에 맞춰 다음과 같이 깔끔하고 가독성 있게 반영되어 있습니다.

```tsx
{/* 사업자 정보 명시 (국세청 정식 사업자등록증 및 전자상거래법 제13조 기준) */}
<div className="border-t border-slate-200/60 dark:border-zinc-900/80 pt-8 pb-4 text-xs font-medium text-slate-500 dark:text-zinc-400 leading-relaxed" suppressHydrationWarning>
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2 font-bold text-slate-700 dark:text-zinc-300">
    <span>상호명: 크리에이박스(CreAibox)</span>
    <span className="text-slate-300 dark:text-zinc-800">|</span>
    <span>대표자: 남정언</span>
    <span className="text-slate-300 dark:text-zinc-800">|</span>
    <span>사업자등록번호: 535-69-00459</span>
  </div>
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2">
    <span>사업장 소재지: 충청남도 천안시 서북구 불당23로 70, 7층 702호 H24호(불당동, 정우프라자)</span>
    <span className="text-slate-300 dark:text-zinc-800">|</span>
    <span>이메일 문의: contact@creaibox.com</span>
    <span className="text-slate-300 dark:text-zinc-800">|</span>
    <span>대표전화: 070-8064-8204</span>
  </div>
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
    <span>호스팅 서비스 사업자: Vercel Inc.</span>
    <span className="text-slate-300 dark:text-zinc-800">|</span>
    <a
      href="https://pf.kakao.com/_RxdxmsX"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-400 hover:underline transition-colors"
      title="카카오톡 1:1 채널 상담으로 바로 이동합니다"
    >
      고객상담: 카카오톡 1:1 채널 (CreAibox)
    </a>
  </div>
</div>
```

---

## 4. 🚫 금지 패턴 (Anti-Patterns) & FAQ

### ❌ 금지 패턴 (Anti-Patterns)
1. **임의로 '도메인 사업자', 'AI 솔루션 사업자'로 바꿔 적는 행위**
   - 전자상거래법 시행령 상 명시 문구는 **'호스팅 서비스 사업자'** 또는 **'호스팅 서비스 제공자'**여야 법적 요건을 충족합니다.
2. **실제 인프라 제공사와 다른 타사 입력**
   - Vercel에 배포해 두었으나 임의로 'Google Cloud' 등으로 허위 기재하는 행위 금지.
3. **사업자 정보 숨김 처리**
   - 모바일 화면이나 아코디언 메뉴 등으로 기본 숨김 처리해 두고 클릭해야만 보이게 하는 행위 (소비자 기본 노출 위반).

### ❓ FAQ (자주 묻는 질문)

**Q. 만약 Vercel이 아니라 AWS 서버로 이전하면 푸터도 수정해야 하나요?**  
A. 네, 메인 웹사이트의 배포 인프라 환경이 바뀌면 푸터의 `호스팅 서비스 사업자: Amazon Web Services, Inc.`와 같이 변경해 주셔야 법적 구속력을 충족합니다.

**Q. 크리에이박스가 고객에게 제공하는 '독립 도메인 연동 서비스'는 어디에 표기하나요?**  
A. 이는 사업자 정보 표기란이 아닌, 서비스 소개 페이지, 이용약관(Terms of Service), 또는 요금제 안내(/pricing) 페이지에 크리에이박스만의 자체 서비스 특장점으로 안내하시면 됩니다.

---

*최종 작성일: 2026-08-07 | 작성: CreAibox 기술 및 법무 가이드팀*
