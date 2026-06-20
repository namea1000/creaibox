# Free Asset Requests Design Specification

## 1. Design Rationale
사용자들이 필요한 무료 공유 에셋을 적극적으로 요청할 수 있는 통로를 마련함으로써, 단순 일방향성 다운로드 플랫폼에서 쌍방향성 참여형 플랫폼으로 진화하기 위한 설계를 지향한다.
특히, 불필요한 개인적인 디테일 이미지를 과도하게 요청하여 생기는 관리 부하를 막기 위해 **공용 목적 가이드**를 입력 단계에서 명확하게 시각적으로 통제하고 관리자 코멘트 작성을 어드민으로 일원화하는 강력한 보안 제어가 요구된다.

---

## 2. Business Rules & Security Strategy

### 2-1. 공용 에셋 가이드 통제
* 사용자가 요청을 생성하는 모달 진입 시, 경고 문구(Caution/Alert 스타일)로 "모두가 사용할 수 있는 범용 에셋에 한함"을 빨간색 또는 주황색 경고 배너로 가장 상단에 고정 노출한다.
* 세부 디테일이 많은 개인용 이미지(예: "내 고양이 사진이랑 똑같이 만들어줘" 등)는 반려 대상임을 명확하게 인지시킨다.

### 2-2. 요청 권한 제어 (INSERT)
* 비로그인 사용자는 요청 현황을 볼 수는 있지만, "이미지 제작 요청" 버튼 클릭 시 로그인 유도 토스트를 출력하거나 모달 진입을 차단한다.
* 로그인된 사용자(`auth.role() = 'authenticated'`)의 세션 정보 내 이메일과 닉네임만 신뢰하며, 위조 요청을 막기 위해 API 컨트롤러 레벨에서 `profiles`를 확인하여 닉네임을 수급한다.

### 2-3. 관리자 권한 2차 검증 (UPDATE / COMMENT)
* RLS 정책으로 1차 방어하고, 백엔드 API에서 2차 검증을 강제한다.
* 요청자의 세션이 유효한지 확인하고, 해당 이메일이 `admin_whitelist` 테이블에 있거나 `profiles.role`이 `ADMIN` 혹은 `STAFF`인지 검사한다.
* 검증에 실패할 경우 `403 Forbidden` 에러를 반환하여 일반 회원이 API를 위조 호출해 상태를 변경하거나 임의의 완료 댓글을 다는 등의 권한 탈취 시도를 차단한다.

---

## 3. UI/UX & Layout Specs

### 3-1. Aside 패널 레이아웃
* 화면 해상도 `lg (1024px)` 이상일 경우 우측 320px(약 25%~30%) 영역을 `<aside>` 사이드바로 확보하여 요청 목록을 스크롤 가능하게 렌더링한다.
* `lg` 미만(태블릿, 모바일) 화면에서는 에셋 그리드 하단으로 흐르게 하여 모바일 접근성을 확보한다.
* **Loading-Free & Instant Rendering UX 규칙**에 의거:
  * 사이드바 뼈대(Shell)는 페이지 진입 즉시 렌더링되며, 데이터 로딩 중에는 리스트 영역에만 스켈레톤(Skeleton UI)을 노출하여 사용자 인터랙션 흐름을 차단하지 않는다.

### 3-2. 상태 배지 디자인
* `pending` (대기중): 부드러운 황색/오렌지색 배경과 주황색 텍스트 (`bg-amber-500/10 text-amber-500`)
* `completed` (제작완료): 차분한 에메랄드/녹색 배경과 흰색/녹색 텍스트 (`bg-emerald-500/10 text-emerald-400`)

---

## 4. API Response Schema
* **GET `/api/free-assets/requests`**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid-here",
        "user_email": "user@example.com",
        "user_nickname": "홍길동",
        "media_type": "일러스트",
        "description": "우주 배경의 사이버펑크 도시 이미지 요청합니다.",
        "status": "pending",
        "comment": null,
        "commented_at": null,
        "created_at": "2026-06-20T12:00:00Z"
      }
    ]
  }
  ```

* **POST `/api/free-assets/requests/comment`**
  * Request Body: `{ "requestId": "uuid-here", "comment": "요청하신 이미지를 제작하여 무료 공유 에셋에 업로드해 드렸습니다." }`
