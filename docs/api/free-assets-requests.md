# Free Asset Requests API Specification

## 1. Get Requests List
* **URL**: `/api/free-assets/requests`
* **Method**: `GET`
* **Auth Required**: No (공공 오픈 조회)
* **Response**:
  * **Success (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "c7a7e8b6-97ef-4933-85fe-fb429de0bfd0",
          "user_id": "8487e8bf-...",
          "user_email": "user@example.com",
          "user_nickname": "창작자A",
          "media_type": "일러스트",
          "description": "사이버펑크 도시 배경의 가을 하늘 이미지 요청합니다.",
          "status": "pending",
          "comment": null,
          "commenter_email": null,
          "commented_at": null,
          "created_at": "2026-06-20T12:00:00.000Z",
          "updated_at": "2026-06-20T12:00:00.000Z"
        }
      ]
    }
    ```

---

## 2. Create Request
* **URL**: `/api/free-assets/requests`
* **Method**: `POST`
* **Auth Required**: Yes (로그인 계정 필요)
* **Request Body**:
  * `mediaType`: String (예: `'이미지'`, `'일러스트'`, `'벡터'`, `'비디오'`, `'GIF'`)
  * `description`: String (요청 내용, 최소 5자 이상 권장)
* **Response**:
  * **Success (200 OK)**:
    ```json
    {
      "success": true,
      "message": "이미지 제작 요청이 정상적으로 등록되었습니다."
    }
    ```
  * **Error (401 Unauthorized)**: 로그인 정보가 없거나 세션이 만료된 경우.
  * **Error (400 Bad Request)**: 매개변수 유효성 검사 실패 시.

---

## 3. Update Admin Comment & Status
* **URL**: `/api/free-assets/requests/comment`
* **Method**: `POST`
* **Auth Required**: Yes (관리자 권한 필요 - profiles.role 이 ADMIN/STAFF 이거나 admin_whitelist 등록 메일)
* **Request Body**:
  * `requestId`: UUID (업데이트할 요청 건 ID)
  * `comment`: String (관리자 답변 내용. 예: *"요청하신 이미지를 제작하여 무료 공유 에셋에 업로드해 드렸습니다."*)
* **Response**:
  * **Success (200 OK)**:
    ```json
    {
      "success": true,
      "message": "코멘트 작성 및 완료 처리가 완료되었습니다."
    }
    ```
  * **Error (403 Forbidden)**: 관리자 권한이 없는 사용자가 호출을 시도한 경우.
  * **Error (404 Not Found)**: 존재하지 않는 요청 ID를 전달한 경우.
