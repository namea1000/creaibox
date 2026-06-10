# 데이터베이스 이용 규칙 (Database Rules)

`CreAibox` Supabase 데이터베이스를 쿼리할 때 반드시 준수해야 하는 연동 규칙입니다.

---

## 1. 클라이언트 쿼리 제약
* **안전한 클라이언트 인스턴스 사용**: 브라우저 뷰 컴포넌트(`"use client"`) 내에서는 반드시 `import { createClient } from "@/utils/supabase/client"`로 만들어진 클라이언트 인스턴스만 사용해야 합니다.
* **인증 폴링 헬퍼 결합**: 비동기 조회 및 삽입 시 마운트 시점의 인증 유실을 막기 위해 `waitForAuthenticatedUser`와 같은 대기 루틴을 반드시 접목합니다.
* **RLS (Row Level Security) 준수**: 데이터 저장/조회 시 세션 유저의 고유 식별값(user_id)과 대조하는 RLS 필터를 누락하지 않아야 타 계정에 데이터가 노출되는 대형 보안 사고를 피할 수 있습니다.
  ```typescript
  // 올바른 예시
  const { data } = await supabase
    .from("writing_naver_posts")
    .select("*")
    .eq("user_id", userId);
  ```

---

## 2. 서버/관리자 권한 및 RPC 제한
* **Service Role Key 격리**: RLS를 우회할 수 있는 마스터 롤(`SUPABASE_SERVICE_ROLE_KEY`)을 지닌 `supabaseAdmin`은 오직 **Serverless API Routes (`src/app/api/*`)**에서만 사용해야 하며, 클라이언트로 절대 유출되어서는 안 됩니다.
* **RPC (원격 함수 호출) 가드**: 데이터 누적 및 원자적 증가 기능(예: `increment_api_vault_usage`)은 안전하게 Supabase 내부 SQL Function으로 빌드해 클라이언트가 직접 컬럼값을 조작하지 못하게 우회 차단합니다.
