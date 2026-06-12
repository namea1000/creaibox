# Research Studio DB 설계 문서

## 개요

Research Studio는 PDF, DOCX, PPTX, Excel, 이미지, YouTube, 웹페이지 등의 자료를 업로드하고 텍스트를 추출한 뒤 AI 질의응답 및 콘텐츠 생성까지 연결하는 것을 목표로 한다.

현재 구조는 단순 원고 추출기가 아니라 Google NotebookLM + 콘텐츠 생성기 수준까지 확장 가능한 구조를 기준으로 설계되었다.

---

# Storage Bucket

Bucket Name

research-assets

저장 대상

* PDF
* DOCX
* PPTX
* XLSX
* CSV
* TXT
* 이미지
* 오디오
* 영상
* 웹페이지 추출 이미지

파일 저장 규칙

```txt
{projectId}/{sourceId}/{timestamp}-{slug}.webp
```

예시

```txt
3f1f8a/source-001/20260611-main-image.webp
```

이미지 저장 정책

* WebP 변환 후 저장
* 최대 가로 1600px
* 품질 80
* 목표 용량 1MB 이하
* 원본 URL 별도 저장

---

# 데이터 구조

## research_projects

프로젝트 단위 관리

예시

* OpenAI 보고서 분석
* 경쟁사 벤치마킹
* YouTube 채널 분석
* 시장조사 리포트

역할

* 자료 그룹 관리
* AI 채팅 연결
* 콘텐츠 생성 연결
* 이미지 연결

---

## research_sources

사용자가 업로드한 원본 자료

지원 자료 유형

* pdf
* docx
* pptx
* xlsx
* csv
* txt
* image
* youtube
* webpage
* news
* blog

역할

* 원본 자료 저장
* Storage 파일 연결
* URL 연결
* 추출 상태 관리

상태 예시

```txt
uploaded
extracting
extracted
error
```

---

## research_extractions

추출된 텍스트 저장

Research Studio의 핵심 테이블

저장 내용

* 제목
* 본문
* 요약
* 이미지 정보
* 메타데이터
* 언어
* 문자수
* 단어수

역할

* AI 분석 원본
* 콘텐츠 생성 원본
* Chunk 생성 원본

---

## research_chunks

RAG 검색용 분할 데이터

예시

```txt
PDF 100페이지
↓
500개 Chunk
↓
AI 검색
```

역할

* 벡터 검색
* NotebookLM 스타일 질의응답
* 출처 추적

현재는 미사용

2차 개발 예정

---

## research_chats

프로젝트별 AI 채팅방

역할

* 자료 기반 AI 대화
* 프로젝트별 채팅 분리
* 대화 이력 관리

---

## research_chat_messages

AI 채팅 메시지

저장 내용

* user 질문
* assistant 답변
* 출처 정보

역할

* NotebookLM 스타일 대화
* 답변 출처 추적

---

## research_generated_contents

AI 생성 결과 저장

생성 유형 예시

* 블로그 글
* SEO 글
* 뉴스 요약
* 유튜브 대본
* 쇼츠 대본
* 뉴스레터
* SNS 콘텐츠
* 이미지 프롬프트
* Suno 가사

역할

* 콘텐츠 자산 저장
* 재활용
* 버전 관리

---

## research_images

추출 이미지 저장

대상

* 웹페이지 대표 이미지
* 본문 이미지
* 뉴스 이미지
* PDF 이미지
* OCR 이미지
* YouTube 썸네일

저장 정보

* Storage 경로
* 원본 URL
* 이미지 유형
* 크기 정보

역할

* 이미지 라이브러리
* 콘텐츠 제작 재활용

---

# 개발 단계

## 1차 MVP

현재 사용

* research_projects
* research_sources
* research_extractions
* research_images

구현 기능

* 자료 업로드
* URL 저장
* PDF 추출
* DOCX 추출
* 이미지 저장

---

## 2차 개발

NotebookLM 기능

추가 테이블

* research_chunks
* research_chats
* research_chat_messages

구현 기능

* Chunk 생성
* RAG 검색
* 자료 기반 AI 답변
* 출처 인용

---

## 3차 개발

콘텐츠 생성기

추가 테이블

* research_generated_contents

구현 기능

* 블로그 생성
* SEO 글 생성
* 유튜브 대본 생성
* 뉴스레터 생성
* 쇼츠 생성

---

# 최종 목표

```txt
자료 업로드
↓
텍스트 추출
↓
Chunk 생성
↓
AI 질의응답
↓
출처 기반 답변
↓
콘텐츠 생성
↓
블로그 발행
↓
유튜브 대본 생성
↓
이미지 생성
↓
통합 지식 베이스 구축
```

Research Studio는 장기적으로 Google NotebookLM + Jasper AI + SEO Writing Tool을 통합한 형태를 목표로 한다.
