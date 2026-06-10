# 스토리지 구성 (Storage Buckets)

`CreAibox`는 미디어 파일(이미지, 첨부 파일 등)의 영속적인 저장 및 서빙을 위해 Supabase Storage를 사용합니다. 코드베이스에 하드코딩 및 환경 변수로 정의된 버킷 리스트입니다.

---

## 1. `generated-images` 버킷
* **용도**: AI 이미지 스튜디오 및 썸네일 제너레이터를 통해 인공지능이 생성한 블로그 삽입용 이미지 저장.
* **접근 제어 (RLS)**: Public Read 권한 설정 필요 (HTML 본문 이미지 임베드를 위해 외부 브라우저에서 직접 접근할 수 있어야 함).
* **주요 엔드포인트 연동**:
  - `UniversalBlogEditor` 컴포넌트: 에디터 본문에 드래그앤드롭 혹은 붙여넣기 한 이미지 업로드 처리.
  - `BlogImageStudioPanel` 컴포넌트: 프롬프트 허브에서 호출되어 생성된 결과 이미지 업로드.
* **코드베이스 내 상수 정의**:
  ```typescript
  export const IMAGE_BUCKET = "generated-images";
  ```

---

## 2. `community` 버킷
* **용도**: 고객 센터(Info Center)의 글쓰기 및 커뮤니티 공유 포스트 작성 시 첨부하는 로컬 이미지/파일 저장.
* **접근 제어 (RLS)**: 회원(Authenticated) 업로드 허용, 누구나 다운로드 가능.
* **주요 엔드포인트 연동**:
  - `InfoWritingTab` 컴포넌트: 고객 질문 글작성 시 파일 업로드.
  - `InfoViewTab` 컴포넌트: 등록 완료된 답변 및 피드백 파일 다운로드.
