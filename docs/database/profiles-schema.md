# Profiles Database Schema

## 1. Purpose

Profiles 데이터베이스는 CreAibox의 통합 사용자 식별 시스템(Identity System)이다.

모든 회원의 프로필, 브랜드 ID, 권한, API Vault, 블로그 설정, 외부 플랫폼 연동 정보 및 향후 확장 기능의 중심 저장소 역할을 수행한다.

이 스키마는 다음 기능을 지원한다.

* 회원 프로필 관리
* 브랜드 ID 관리
* 회원 등급 관리
* 관리자 권한 관리
* 포인트 시스템
* 개인 API Vault
* WordPress 연동
* 외부 플랫폼 연동
* 사용자 통계 저장
* 확장 설정 저장
* 향후 Stripe 결제 연동
* 향후 조직 및 팀 기능

---

## 2. Identity Policy

CreAibox는 단순 이메일 기반 회원 시스템이 아니라 브랜드 중심 사용자 시스템을 채택한다.

모든 사용자는 다음 3개의 식별 체계를 가진다.

| Field    | Purpose               |
| -------- | --------------------- |
| id       | Supabase Auth User ID |
| email    | 로그인 식별                |
| brand_id | CreAibox 내부 브랜드 식별자   |

---

### brand_id 정책

brand_id는 향후 사용자 전용 블로그 및 브랜드 사이트의 주소로 사용된다.

예시

```txt
namjja2933.creaibox.com
seoexpert.creaibox.com
musiclab.creaibox.com
```

제약 조건

* 2 ~ 15자
* 영문 소문자
* 숫자
* 특수문자 불가
* 중복 불가

예시

```txt
namjja2933
seo2026
musiclab01
```

---

### nickname 정책

nickname은 사용자 활동명이다.

제약 조건

* 2 ~ 10자
* 한글
* 영문
* 숫자
* 특수문자 불가
* 중복 불가

예시

```txt
철수77
홍길동
seo마스터
```

---

## 3. Core Storage Policy

Profiles는 회원 1명당 1 Row를 가진다.

채택한 저장 방식

```txt
회원 1명 = Profiles 1 Row
```

비즈니스 규칙

* 회원가입 시 자동 생성
* 회원 탈퇴 시 자동 삭제
* 모든 Studio가 공통 사용
* API Vault 중앙 저장소 역할 수행

---

## 4. Tables Overview

| Table    | Purpose   |
| -------- | --------- |
| profiles | 회원 통합 프로필 |

현재는 단일 테이블 구조를 사용한다.

향후 조직 기능 추가 시 별도 테이블로 확장 가능하다.

---

## 5. Profiles Table

회원 통합 프로필 저장소이다.

---

### 기본 식별 정보

| Column     | Description   |
| ---------- | ------------- |
| id         | auth.users PK |
| email      | 회원 이메일        |
| nickname   | 활동명           |
| brand_id   | 브랜드 ID        |
| avatar_url | 프로필 이미지       |

---

### 권한 정보

| Column           | Description |
| ---------------- | ----------- |
| role             | 시스템 권한      |
| status           | 계정 상태       |
| membership_level | 회원 등급       |

---

### role

예시

```txt
FREE
STAFF
ADMIN
SUPER_ADMIN
```

목적

* 관리자 메뉴 접근
* 내부 운영 기능 제어
* 권한 분리

---

### status

예시

```txt
ACTIVE
BLOCKED
SUSPENDED
DELETED
```

목적

* 계정 활성화
* 이용 제한
* 휴면 관리

---

### membership_level

예시

```txt
free
pro
business
enterprise
admin
```

목적

* 기능 제한
* AI 사용량 제한
* 향후 결제 시스템 연동

---

## 6. Point System

컬럼

```txt
total_points
```

목적

사용자 크레딧 저장

활용 예정

* AI 생성 사용량
* 이미지 생성
* 음악 생성
* 보상 시스템
* 이벤트 포인트

---

## 7. Blog Settings

사용자 블로그 설정 저장

컬럼

```txt
blog_title
blog_description
```

목적

* 개인 블로그 제목
* 블로그 설명
* SEO 기본값

향후

```txt
brand_id.creaibox.com
```

에 연결된다.

---

## 8. API Vault

사용자 개인 API 키 저장

컬럼

```txt
api_openai_key
api_gemini_key
api_claude_key
api_stability_key
api_suno_key
api_runway_key
```

비즈니스 규칙

사용자 키 존재 시

```txt
사용자 키 우선 사용
```

사용자 키가 없을 경우

```txt
공용 API Pool 사용
```

---

## 9. External Platform Integration

외부 플랫폼 식별 정보 저장

컬럼

```txt
naver_blog_id
tistory_blog_id
youtube_channel_id
insta_user_id
```

목적

* 블로그 발행
* 채널 연동
* 콘텐츠 수집
* 통계 분석

---

## 10. WordPress Integration

컬럼

```txt
wp_blog_url
wp_user_id
wp_app_password
```

목적

WordPress 자동 발행

활용 기능

* 글 발행
* 글 수정
* 카테고리 연동
* 태그 연동

---

## 11. JSONB Extension System

### work_stats

사용자 활동 통계 저장

예시

```json
{
  "writing": 0,
  "visual": 0,
  "music": 0,
  "video": 0
}
```

---

### extra_configs

확장 설정 저장

예시

```json
{}
```

목적

118개 이상의 Studio 기능 확장

새로운 기능이 추가되더라도 DB 컬럼을 계속 추가하지 않기 위해 사용한다.

---

## 12. Automatic Profile Generation

회원가입 시 자동 생성된다.

함수

```sql
handle_new_user()
```

자동 생성 항목

```txt
email
nickname
brand_id
membership_level
role
status
```

생성 규칙

* 이메일 기반 생성
* 랜덤 숫자 추가
* 중복 자동 회피

---

## 13. Relationships

| From        | To            | Rule           |
| ----------- | ------------- | -------------- |
| profiles.id | auth.users.id | cascade delete |

회원 삭제 시 프로필도 자동 삭제된다.

---

## 14. RLS Policy

Profiles 테이블은 RLS를 사용한다.

기본 원칙

* 로그인 사용자만 조회 가능
* 사용자 본인 데이터 접근 가능
* 관리자 기능은 서버 API에서 처리

향후

```txt
관리자
스태프
일반 회원
```

권한 체계로 세분화 가능하다.

---

## 15. updated_at Trigger

Profiles는 수정 시 자동으로 updated_at이 갱신된다.

함수

```sql
update_profiles_updated_at()
```

목적

* 변경 이력 추적
* 관리자 감사 로그
* 최근 수정 정보 관리

---

## 16. Future Expansion

향후 확장 예정

### Billing

* Stripe
* 포인트 충전
* 구독 관리

### Team

* 팀 계정
* 조직 계정
* 기업용 워크스페이스

### Identity

* OAuth 연동
* 브랜드 검증
* Creator 인증

### Statistics

* AI 사용량
* 콘텐츠 생성량
* API 사용량

### Blogging

* 브랜드 블로그
* 멀티 사이트
* 사용자 포털

---

## 17. Related Documents

실행 SQL

```txt
docs/database/sql/profiles.sql
```

관련 문서

```txt
docs/arch/user-system.md
docs/arch/api-vault.md
docs/arch/blog-system.md
```

이 SQL 파일은 Supabase SQL Editor에서 수정 없이 바로 실행 가능한 상태를 유지해야 한다.
