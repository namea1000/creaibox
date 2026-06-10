# API 키 금고 및 보안 설계 (API Vault & Crypto Security)

`CreAibox`는 공용 API 키(Gemini, Groq, Naver/Google Search 등)를 탈취당하지 않으면서 데이터베이스에 보존하고 가동률을 최대화할 수 있도록 암호화 및 자동 복구 메커니즘을 적용하고 있습니다.

---

## 1. API 키 대칭키 암호화 구조 (`src/lib/server/api-vault-crypto.ts`)

API 키 원본은 서버 런타임 외부로 유출되지 않도록 **AES-256-GCM** 암호화 알고리즘을 사용해 암호화된 스트링 형태로 데이터베이스(`admin_api_vault.key` 컬럼)에 기록됩니다.

### 1-1. 마스터 암호화 키
* **환경 변수**: `API_VAULT_ENCRYPTION_KEY`
* **요구사항**: 32바이트 길이의 Base64 인코딩 문자열 형태 대칭키여야 합니다.

### 1-2. 암호화 동작 (`encryptApiKey`)
1. 무작위 12바이트 초기화 벡터(`iv`)를 생성합니다.
2. `crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv)` 인스턴스를 열고 API 키 문자열을 암호화합니다.
3. 데이터의 위변조 방지를 위해 `authTag`를 획득합니다.
4. `[iv_base64].[auth_tag_base64].[encrypted_base64]` 형식의 점(`.`) 구분 문자열로 병합해 반환합니다.

### 1-3. 복호화 동작 (`decryptApiKey`)
1. 입력 텍스트를 점(`.`) 기호 기준으로 파싱해 3개의 파트(iv, authTag, encrypted)로 나눕니다.
2. 각 바이너리를 복원한 뒤 `crypto.createDecipheriv`에 통과시킵니다.
3. `decipher.setAuthTag`에 인증 태그를 주입하고 복호화 최종본을 출력합니다.

---

## 2. 우선순위 기반 Failover 라우팅 알고리즘

공용 API 엔드포인트 `/api/ai/generate` 호출 시 가용한 API 키를 선출하는 절차는 다음과 같이 로직화되어 작동합니다.

```
[API 호출]
   │
   ▼
[supabaseAdmin.from("admin_api_vault") 조회]
   │
   ├─► 조건: status == 'active' & provider == 'gemini'
   ├─► 1차 정렬: priority ASC (우선순위가 높은 것)
   ├─► 2차 정렬: today_count ASC (오늘 덜 사용한 것)
   └─► 3차 정렬: use_count ASC (누적 사용이 적은 것)
   │
   ▼
[가장 알맞은 10개 키 큐(Queue) 빌드]
   │
   ▼
[루프 진입 (Key 순회)]
   │
   ├─► 오늘 한도(today_count >= daily_limit) 넘은 키인가? ──► YES: 다음 키로 스킵
   │
   ├─► 복호화 수행 및 Google API 전송 시도
   │
   ├───► 성공: rpc("increment_api_vault_usage") 호출 ──► 정상 응답 반환 (종료)
   │
   └───► 실패: recordVaultFailure(last_error 업데이트) ──► 루프 계속 (다음 키 시도)
```

### 2-1. 통계 카운터 동기화
* **성공 처리 (`recordVaultSuccess`)**: `supabaseAdmin.rpc("increment_api_vault_usage", { target_id: id })`를 즉각 전송해 해당 키의 요청 카운터를 실시간 누적합니다.
* **실패 처리 (`recordVaultFailure`)**: 예외 발생 시 해당 키 레코드의 `last_error` 항목에 에러 메시지를 500자 크기로 슬라이싱해 업데이트하고 `failure_count`를 수정합니다.
