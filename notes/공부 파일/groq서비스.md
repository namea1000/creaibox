CreAibox의 글쓰기 스튜디오, 뮤직 스튜디오, AI Assistant 에 연결하면 돼.
참고로 Groq는 이미지 생성은 못하고, 텍스트 생성(글쓰기, 가사, SEO, 채팅) 전용이라고 생각하면 된다.

SDK
= Groq에서 만든 공식 라이브러리

장점
- 코드 짧음
- 타입스크립트 자동완성
- 에러 처리 편함
- 모델 변경 쉬움

단점
- npm 패키지 하나 추가

Gemini = 긴 글, 멀티모달, 이미지 설명
Groq = 빠른 글 생성, 제목 생성, 가사 생성, 요약
OpenAI = 고품질 보정, 구조화
Claude = 긴 문서 분석


Groq를 CreAibox의 “빠른 텍스트 생성용 모델 공급자”로 추가하는 구조로 보면 됩니다.
CreAibox에서는 Groq = 초고속 텍스트 생성 엔진으로 붙이면 좋아요. AI 글쓰기, 뮤직 가사/Suno 프롬프트, 제목 생성, 요약, SEO 분석 등에 바로 사용 가능합니다. Groq는 공식 TypeScript SDK도 제공합니다.

* Groq API 생성오류 해결 
Groq 요청 출력 토큰을 동적으로 낮추도록 변경해서 8192를 무조건 예약하지 않게 했어.
/admin/apivault의 Groq 모델 목록에서 잘못된 llama-3.1-70b-versatile를 제거하고, 현재 Groq 문서 기준 모델로 정리했어.
사용자 /apivault Groq 모델 라벨도 Production/Preview 구분이 보이도록 정리했어.
Groq TPM 에러가 “Google Search 문제”로 잘못 표시되지 않도록 에러 메시지 분기를 고쳤어.
네이버 글쓰기에서 Groq 선택 시 프롬프트에 “구글 검색 활용”이라고 들어가지 않게 했어.
확인한 Groq 공식 문서 기준 Production 모델은 llama-3.1-8b-instant, llama-3.3-70b-versatile, openai/gpt-oss-20b, openai/gpt-oss-120b이고, groq/compound, groq/compound-mini는 Production Systems 쪽이야. 참고: Groq Models docs https://console.groq.com/docs/models


* src/lib/client/api-vault.ts
그래서 모델 목록을 각 글쓰기/가사 생성 페이지마다 넣는 방식 말고, 공통 registry 파일로 빼서 쓰도록 정리했어.
새로 만든 공통 파일:
src/lib/ai/provider-registry.ts
여기에 Gemini, Groq, OpenAI, Claude의 모델 목록, 기본 모델, localStorage 키, /apivault 카드 정보가 한곳에 들어가게 했고, /apivault/page.tsx와 생성 유틸도 이 파일을 참조하도록 바꿨어.
수정한 파일:
src/app/apivault/page.tsx
src/lib/client/api-vault.ts
이제 앞으로 모델 추가는 대체로 provider-registry.ts에만 추가하면 되고, 실제 생성 호출 방식만 api-vault.ts에 어댑터처럼 붙이면 돼. 지금은 Gemini/Groq 생성 라우팅까지 있고, OpenAI/Claude는 API Key/모델 선택 구조는 준비됐지만 실제 호출 함수는 다음 단계에서 붙이면 된다.