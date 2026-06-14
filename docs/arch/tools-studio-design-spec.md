# 스튜디오 Tools 설계 명세서 (Tools Studio Design Spec)

이 문서는 스튜디오 Tools 모듈의 인터랙션 정책, 로컬 컴포넌트 튜닝 원칙, 외부 API 통합 규칙을 정리한 설계 사양서입니다.

---

## 1. 아키텍처 및 연동 설계 (Architecture & Integrations)
* **네트워크 독립적 로컬 구동 (Edge Processing First)**:
  - 파일 메타데이터 추출, 코드 정돈, 색상 팔레트 시뮬레이터 및 포맷 변환기는 서버 오버헤드를 막기 위해 브라우저 엔진 자원(Client-side File Reader 및 Regex Parser)을 기반으로 로컬 구동하도록 설계하여 응답 딜레이를 제로화했습니다.
* **실시간 QR API 연동**:
  - QR 생성기는 단순 Mock 대신 외부 API `https://api.qrserver.com/v1/create-qr-code/`를 연계해 실제 스마트폰 카메라로 비추었을 때 사용자가 입력한 링크로 직접 이동 가능한 정밀 스캔코드를 실시간 반환합니다.
* **AI 프롬프트/제목 연동**:
  - `PromptEnhancer` 및 `PromptTranslator`는 내부 공용 Gemini 게이트웨이인 `/api/ai/generate`를 활용하도록 제작되어 있으며, 일일 제한 유닛 소진 시 템플릿 번역 매핑(Template Fallback Mapping)으로 자동 연동 전환됩니다.

---

## 2. UI/UX 디자인 가이드라인
* **글래스모피즘 어두운 배색**:
  - 전체 카드 외형은 다크 그레이 `bg-zinc-900/40` 배경에 반투명 보더라인 `border-zinc-800`로 결속했습니다.
  - 호버 포커스 시 라이트-스파클 보더 이펙트(`hover:border-amber-500/40`)와 미세 햅틱(`active:scale-98`) 모션을 입혀 조작 반응을 개선했습니다.
* **누끼 투명 체크 패턴**:
  - 누끼 제거기(`/studio/tools/bg-remover`)의 배경 투명 상태를 명확히 표현하고자 격자 무늬 그래픽 체커(`checkered-pattern`) 스타일링을 적용했습니다.
