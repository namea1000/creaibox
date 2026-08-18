# 도메인 통합 관리 실무 매뉴얼 (Domain Management Manual)

[아키텍처 기술 명세서 바로가기](../../../arch/02_auth-and-domain/domain-search-and-management-architecture.md)

## 1. 개요

CreaiBox 스튜디오의 [도메인 관리 메뉴]는 사용자가 자신만의 브랜드 도메인을 검색, 구매, 이관하고, 브랜드 전용 맞춤 이메일(예: ceo@creaibox.com)을 개인 메일함으로 자동 전달(포워딩)하는 기능을 제공합니다.

## 2. 서브 메뉴 구성 (6종) 및 세부 기능 명세

도메인 관리 메뉴는 시원한 Vercel 와이드 뷰(최대 폭 1680px, 패딩 최적화 px-5 sm:px-8 lg:px-12)를 기반으로 6개의 독립 메뉴로 나뉘어 있으며, 각 메뉴별로 다음과 같은 실무 기능 및 인터랙션이 구현되어 있습니다.

| 서브페이지 | 새로 추가된 실무 기능 및 인터랙션 |
| --- | --- |
| **1. 검색 & 구매** | • TLD 카테고리 필터 칩스 (글로벌 `.com`, 국내 `.kr`, 테크 `.ai`/`.io`, 쇼핑몰 `.shop`)<br>• 주요 확장자 실시간 도매가 요약 카드 (39%~76% 파격 할인율 표시)<br>• 결제 후 1초 자동 연동 3단계 가이드 배너 |
| **2. 타사 이관** | • 국내외 4대 등록처(가비아, 후이즈, 카페24, GoDaddy) EPP 발급 탭 가이드<br>• 도메인 이관 4단계 실시간 상태 트래커 (신청 ➔ 검증 ➔ 승인 ➔ Edge 바인딩)<br>• ICANN 공통 60일 규정 체크리스트 |
| **3. 이메일 연동** | • 원클릭 빠른 별칭 생성 칩스 (`ceo@`, `contact@`, `cs@`, `support@`, `admin@`)<br>• SPF / DKIM / DMARC 이메일 보안 DNS 레코드 검증 모달<br>• 미등록 시 친절한 안내 빈 화면(Empty State) |
| **4. 가격 비교표** | • 주요 10대 TLD 상세 도매가 vs 타사 비교 테이블<br>• 3개년 숨은 비용(Hidden Cost) 실시간 절감액 시뮬레이터 (도메인 개수/연수별 누적 절감액 계산)<br>• WHOIS 0원 + SSL 0원 정량 수치화 |
| **5. 정책 & 혜택** | • 도메인 5단계 수명 주기(Lifecycle) 타임라인 인포그래픽<br>• Vercel Anycast 300+ Edge 네트워크 스펙 (TTFB 10ms 보장)<br>• 도메인 낙장 방지 안심 알림 정책 (30일/7일 전 알림톡/이메일) |
| **6. FAQ** | • 카테고리별 아코디언 필터링 (구매/결제, 이관, DNS, 이메일, 보안)<br>• 8대 실전 핵심 질문 및 명쾌한 답변<br>• 1:1 도메인 엔지니어 무료 대행 직통 지원 배너 |

## 3. 실서버 환경 트러블슈팅 (API 401 오류)

**증상**: 로컬 서버(`npm run dev`)에서는 커스텀 이메일 연동과 규칙 등록이 정상 작동하지만, Vercel 실서버에 배포한 후 규칙을 불러오지 못하거나 401 에러가 발생함.
**원인**:

1. Vercel 환경 변수 누락 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등)
2. API Route의 동적 캐싱(정적 캐싱 락)

**해결 방법**:

1. Vercel Project 대시보드 -> Settings -> Environment Variables 에 로컬의 `.env.local` 정보 필수 입력.
2. `src/app/api/email-forwarding/route.ts` 파일 최상단에 `export const dynamic = "force-dynamic";`이 선언되어 있는지 확인 후 Vercel 재배포(Redeploy) 수행.
