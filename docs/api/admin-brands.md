# Admin Brands & Custom Domains API Specification

## 1. Overview
브랜드 ID(서브도메인) 및 독립 도메인(Custom Domain) 신청 건을 심사하고 승인/반려/취소 및 시스템 예약어(블랙리스트)를 관리하는 관리자 전용 백엔드 API 명세서이다.

클라이언트 직렬 RLS 제한을 우회하기 위해 `createAdminClient()` (Service Role Key) 기반으로 연동되며, `ADMIN_EMAILS` 및 `admin_whitelist` 테이블을 기반으로 2차 이중 보안 검증을 거친다.

---

## 2. Endpoints

### 2.1 GET `/api/admin/brands`
* **설명**: 관리자 페이지 전용 브랜드 ID 신청 목록 및 예약어(블랙리스트) 통합 조회
* **보안**: Admin Authorization (`ADMIN_EMAILS` 및 `admin_whitelist`)
* **응답 예시**:
  ```json
  {
    "success": true,
    "requests": [
      {
        "id": "user-uuid",
        "nickname": "홍길동",
        "email": "user@example.com",
        "brand_id": "mybrand",
        "requested_brand_id": "newbrand",
        "brand_id_status": "PENDING",
        "extra_configs": {},
        "updated_at": "2026-07-22T04:00:00Z"
      }
    ],
    "blacklist": [
      {
        "id": "reserved-uuid",
        "brand_id": "admin",
        "reason": "시스템 공식 도메인 보호",
        "created_at": "2026-07-22T00:00:00Z"
      }
    ]
  }
  ```

---

### 2.2 POST `/api/admin/brands`
* **설명**: 시스템 예약어(블랙리스트) 추가 및 삭제
* **요청 Body (추가)**:
  ```json
  {
    "action": "add_reserved",
    "brandId": "apple",
    "reason": "상표권 보호"
  }
  ```
* **요청 Body (삭제)**:
  ```json
  {
    "action": "delete_reserved",
    "id": "reserved-uuid"
  }
  ```

---

### 2.3 POST `/api/admin/brands/approve`
* **설명**: 신청된 서브도메인(Brand ID) 최종 승인 및 GA4 Web Data Stream 자동 생성 및 측정 ID 발급
* **요청 Body**:
  ```json
  {
    "userId": "user-uuid",
    "requestedId": "mybrand"
  }
  ```
* **응답 예시**:
  ```json
  {
    "success": true,
    "measurementId": "G-XXXXXXXXXX",
    "brandId": "mybrand"
  }
  ```

---

### 2.4 POST `/api/admin/brands/action`
* **설명**: 서브도메인 및 독립 도메인의 상태 변경 (승인, 반려, 승인 취소)
* **Action 종류**:
  1. `reject-subdomain`: 서브도메인 신청 반려 (`userId`, `brandId`, `reason`)
  2. `cancel-approve-subdomain`: 서브도메인 승인 취소 및 대기(PENDING) 상태로 전환 (`userId`, `brandId`)
  3. `approve-custom-domain`: 독립 도메인 연결 승인 (`userId`, `brandId`, `requestedDomain`)
  4. `reject-custom-domain`: 독립 도메인 신청 반려 (`userId`, `brandId`, `requestedDomain`, `reason`)
  5. `cancel-custom-domain`: 독립 도메인 승인 취소 및 대기(PENDING) 상태로 전환 (`userId`, `brandId`, `requestedDomain`)
