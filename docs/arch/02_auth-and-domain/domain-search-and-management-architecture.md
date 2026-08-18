# Domain Search & Management Architecture

[서비스 실무 매뉴얼 바로가기](../../project/manual/02_auth-and-domain/domain-search-and-management-manual.md)

## 1. 아키텍처 개요
CreaiBox의 도메인 검색, 구매, 이관, 이메일 연동 등 전반적인 도메인 관리 시스템의 프론트엔드 UI 설계 및 백엔드 파이프라인 명세서입니다.

## 2. Vercel Style Wide Layout System
도메인 관리 시스템은 복잡한 표(테이블)와 정책 텍스트, DNS 설정 폼을 효율적으로 노출하기 위해 **Vercel 스타일의 와이드 모노톤 UI**를 채택합니다.

- **`max-w-[1680px]` 표준 및 패딩 최적화**: 기존 좁은 박스형 레이아웃에서 벗어나 **`max-w-[1680px]`** 와 **`px-5 sm:px-8 lg:px-12`** 패딩을 적용하여, 중앙 정렬되면서도 양옆으로 시원하게 꽉 차는 Vercel 실측 기반의 와이드 컨테이너를 사용합니다.
- **모노톤 컬러 팔레트**: 테마 컬러를 억제하고 Black & White 대비와 얇은 외곽선을 사용하여 정보 전달(텍스트, 표) 가독성을 극대화합니다. (Dark Mode 완벽 호환)
- **독립 서브페이지 분리**: 단일 페이지의 탭 구조 대신, Next.js App Router의 독립된 디렉토리 라우팅(`domain-search`, `comparison`, `email-forwarding` 등)을 사용하여 로딩 부하를 줄이고 개별 URL 공유를 지원합니다.

## 3. 이메일 포워딩 API (Vercel Edge & Static Caching 대응)
`src/app/api/email-forwarding/route.ts` API는 쿠키 기반 인증(`supabase.auth.getUser()`)을 수행합니다.

### 3.1 `force-dynamic` 라우팅 강제
```typescript
export const dynamic = "force-dynamic";
```
Next.js의 빌드 타임 정적 캐싱(Static Caching)을 방지합니다. 이 설정이 누락될 경우, Vercel 실서버에서 쿠키를 무시하고 항상 `401 Unauthorized` 또는 캐시된 빈 데이터를 반환하는 심각한 이슈가 발생합니다.

### 3.2 데이터 파이프라인
1. **GET**: 유저의 도메인(domain_name)에 매핑된 `email_forwarding_rules` 조회. 빈 목록일 경우에도 예외 없이 200(빈 배열) 반환.
2. **POST**: Supabase `upsert`를 사용하여 동일한 도메인+별칭(alias_prefix)에 대해 충돌 시 덮어쓰기 로직 수행.
3. **DELETE**: 해당 규칙 ID 삭제 및 실시간 UI 갱신 (SWR/fetch).
