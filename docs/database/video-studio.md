# CreAibox Video Studio Database

## 목적

Video Studio는 사용자의 영상, 이미지, 오디오 원본 파일을 Supabase에 저장하지 않는다.

원본 파일은 사용자 PC 또는 브라우저 로컬 환경에 두고, Supabase DB에는 프로젝트 메타데이터, 편집 JSON, 파일명, 클립 정보, 저장 히스토리만 저장한다.

## 저장 원칙

- 원본 영상 파일 저장 안 함
- 원본 오디오 파일 저장 안 함
- 원본 이미지 파일 저장 안 함
- thumbnail base64 저장 안 함
- DB에는 프로젝트 구조와 메타데이터만 저장
- 렌더링 결과물은 사용자 PC에 저장

## 테이블

### video_projects

프로젝트 기본 정보와 전체 편집 JSON을 저장한다.

### video_project_assets

사용자가 프로젝트에 연결한 로컬 파일의 메타데이터를 저장한다.

예:
- 파일명
- 파일 크기
- 파일 타입
- 로컬 파일 키
- 마지막 수정 시간

실제 파일은 저장하지 않는다.

### video_project_clips

타임라인 클립 단위 정보를 저장한다.

예:
- 시작 시간
- 길이
- 트랙 ID
- 트림
- 볼륨
- 전환효과
- 모션/이펙트 설정 JSON

### video_project_versions

프로젝트 저장 버전 기록이다.

자동저장이 많아질 경우 최근 10~20개만 유지하는 정책이 필요하다.

### video_project_events

프로젝트 저장, 열기, 삭제, 렌더링 같은 이벤트 로그를 저장한다.

### video_project_exports

사용자가 내보낸 영상 기록을 저장한다.

실제 MP4 파일은 저장하지 않는다.

Render Queue가 job을 추가하면 로그인 사용자에 한해 `video_project_exports` row를 best-effort로 생성한다. Supabase 요청이 실패하거나 사용자가 로그인하지 않은 경우에도 export 자체는 계속 진행하고 DB 기록만 건너뛴다.

현재 저장 필드:

- `user_id`: Supabase `auth.getUser()` 결과
- `project_id`: 현재 에디터가 안정적인 DB project id를 보유하지 않으면 `null`
- `title`: export 시점 프로젝트 제목
- `export_resolution`: 720p, 1080p, 2k, 4k
- `export_fps`: 24, 30, 60
- `export_quality`: low, standard, high
- `output_file_name`: 사용자 PC에 저장될 파일명
- `output_local_key`: `local-export://<queue-id>/<file-name>` 형식의 로컬 참조 키
- `status`: `created`, `rendering`, `completed`, `failed`, `canceled`
- `progress`: 0~100
- `created_at`: DB 생성 시각

저장하지 않는 값:

- 실제 WebM/MP4 바이너리
- 원본 영상/오디오/이미지 파일
- Supabase Storage path
- 실패 메시지 전문

Export Panel은 최근 export 기록을 조회해 상태, 해상도, FPS, 품질, 파일명, 생성 시간을 표시한다. 실패 메시지 전문은 현재 테이블 컬럼에 없으므로 Render Queue의 로컬 상태에서만 확인 가능하다.

## 용량 정책

사용자가 많아져도 DB에는 메타데이터만 저장되므로 용량 부담은 낮다.

주의할 점:

- project_json 무제한 버전 저장 금지
- thumbnail_data_url 같은 base64 저장 금지
- 자동저장 주기 과도하게 짧게 설정 금지
- 삭제된 프로젝트는 일정 기간 후 정리

## 권장 자동저장 정책

- 30초~60초 단위 자동저장
- 주요 변경 시 수동 저장
- 버전 히스토리는 최근 10~20개 유지
- 오래된 이벤트 로그는 정리 가능

## 보안

모든 테이블은 RLS를 사용한다.

사용자는 자신의 프로젝트, 에셋, 클립, 저장 기록만 조회/수정/삭제할 수 있다.

`video_project_exports`도 `auth.uid() = user_id` 정책을 따른다. 브라우저 클라이언트는 로그인된 사용자의 row만 insert/update/select할 수 있어야 한다.
