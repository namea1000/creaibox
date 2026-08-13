# Design Specification: AI Report Studio (AI 리포트 스튜디오)

본 문서는 시장 분석, 산업 연구, 투자 분석, 트렌드 예측 및 AI 보고서 자동 생성을 처리하는 **AI 리포트 스튜디오**의 기술 설계 및 API 요구사항을 정의합니다.

---

## 1. 주요 요구 기능 및 워크플로우

1. **시장 및 산업 리포트 생성**: 특정 시장(예: 반도체, AI 서비스) 및 산업의 현황을 분석하고 구조화된 보고서를 생성합니다.
2. **실시간 트렌드 및 주가/재무 데이터 연동**: 주식 시장 정보, 재무 제표, 기업 동향 등 수치 데이터를 수집하여 리포트에 시각화(차트)합니다.
3. **AI 툴 비교 분석**: 시중에 나와 있는 다양한 AI 솔루션들의 사양, 요금제, 기능별 장단점을 요약 비교해 주는 리포트를 작성합니다.
4. **학술/논문 자료 리서치 (AI 리서치 센터)**: 특정 연구 분야의 학술 논문이나 PDF 자료를 분석하여 요약 및 RAG(검색 증강 생성) 기반 질의응답을 제공합니다.
5. **인사이트 대시보드**: 리포트 작성 이력, 분야별 트렌드 지표, 그리고 수집된 핵심 통계를 차트와 대시보드 형태로 시각화합니다.

---

## 2. 필요 API 및 도구 준비 목록

### ① 실시간 웹 검색 및 리서치 API — 필수
보고서 작성 시 LLM의 정적 지식(Static Knowledge)에만 의존하면 신뢰도가 떨어지므로 실시간 신뢰성 있는 검색 인프라가 필수적입니다.
* **추천 API**:
  * **Gemini Google Search Grounding**: Gemini API에 내장된 웹 검색 도구 활용 (무료 혹은 API 비용에 통합).
  * **Tavily Search API** or **Serper API**: AI 리서치에 최적화된 웹 검색 API로, 검색 결과의 원문 요약 및 신뢰성 있는 소스 링크들을 정제해서 반환합니다.

### ② 시장 및 재무 데이터 API — 필수 (투자/시장 분석 시)
주가, 재무 데이터, 기업 시장 가치를 실시간 또는 주기적으로 수집해야 합니다.
* **추천 API**:
  * **Yahoo Finance API (`yahoo-finance2` npm package)**: 무료로 전 세계 주가, 역사적 데이터, 기본 재무 정보를 파싱할 수 있어 가장 추천됩니다.
  * **Financial Modeling Prep API** or **Alpha Vantage API**: 기업의 재무제표(손익계산서, 대차대조표), 주가, 성장률 등의 구조화된 데이터를 JSON으로 정확히 제공합니다.

### ③ 논문 및 PDF 분석 API (리서치 센터 구축 시) — 필수
* **arXiv API / Semantic Scholar API**:
  * **용도**: 과학 기술 및 AI 분야의 학술 논문 정보(초록, 저자, PDF 링크) 검색 및 수집.
* **Vector DB & RAG (Supabase pgvector)**:
  * **용도**: 사용자가 올린 PDF 파일(시장 보고서, 논문)을 텍스트 추출 후 청킹(Chunking)하여 임베딩을 생성하고 벡터 데이터베이스에 저장. 질문이 들어오면 유사 문서(Context)를 검색하여 답변을 생성하는 RAG 시스템 구축.

### ④ 데이터 시각화 라이브러리 — 필수
* **Recharts** or **Tremor.so**:
  * **용도**: 리포트에 포함할 주가 추이, 시장 점유율, 트렌드 스코어 등의 수치 데이터를 리액트 컴포넌트 내에서 대화형 차트(Line, Bar, Pie Chart)로 시각화.

---

## 3. 데이터베이스 스키마 설계 (Supabase)

### `report_documents` (생성된 AI 보고서)
```sql
CREATE TABLE report_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- 크리에이터 ID
  title TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'market', 'industry', 'investment', 'compare', etc.
  query_params JSONB, -- 보고서 작성 시 입력한 상세 옵션 (예: 대상 기업, 키워드, 기간)
  markdown_content TEXT NOT NULL, -- 생성된 리포트 본문
  charts_data JSONB, -- 시각화용 차트 데이터
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### `research_documents` (PDF 논문 및 RAG 소스)
```sql
CREATE TABLE research_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT, -- Supabase Storage에 업로드된 PDF 파일 경로
  content_extracted TEXT, -- 추출된 원문 텍스트
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### `document_embeddings` (RAG용 벡터 데이터)
```sql
-- pgvector 확장이 활성화되어 있어야 합니다.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_embeddings (
  id BIGSERIAL PRIMARY KEY,
  document_id UUID REFERENCES research_documents(id) ON DELETE CASCADE,
  content_chunk TEXT NOT NULL, -- 분할된 본문 조각
  embedding VECTOR(1536) NOT NULL, -- OpenAI(1536차원) 또는 BGE/Cohere 임베딩 벡터
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
