# 블로그 에디토리얼 설정 가이드 (Editorial Box Guide)

본 문서는 크리에이박스(CreAibox) 블로그 글 작성 시 본문 마지막에 표시되는 **"프리미엄 에디토리얼 상자"**의 커스터마이징 기능, 데이터 저장 방식 및 검색엔진 최적화(SEO) 연동 구조를 설명합니다.

---

## 1. 기능 개요 (Feature Overview)

블로그 포스팅의 전문성을 더하고 구글(Google) 및 네이버(Naver) 등의 검색 결과에 **"크리에이박스"**, **"CreAibox"** 브랜드명을 강력하게 노출(SEO 색인)시키기 위한 기사 마감 카드입니다. 
기존의 하드코딩 방식에서 탈피하여, 사용자가 글의 성격에 맞춰 직접 카드 노출 여부를 토글하고 문구 및 테마 색상을 변경할 수 있는 커스텀 기능을 탑재했습니다.

---

## 2. 동작 메커니즘 (Under-the-hood Mechanism)

데이터베이스의 추가적인 테이블/컬럼 마이그레이션 없이, 데이터 무결성과 호환성을 유지하기 위해 **HTML 주석 내 JSON 데이터 패키징 메커니즘**을 설계했습니다.

```
[에디터 내용 작성 완료] 
      ⬇️
[설정 모달에서 데이터 변경] 
      ⬇️ (JSON 직렬화)
[HTML 본문 문자열 맨 밑에 아래 주석 자동 은닉 삽입]
<!-- CREAIBOX_EDITORIAL_START {"enabled":true,"bgColor":"#f8f8f9","borderColor":"#e4e4e7",...} CREAIBOX_EDITORIAL_END -->
      ⬇️ (Supabase content 컬럼 저장)
[상세 보기 화면 렌더링 시]
      ⬇️ (정규식 파싱 및 주석 청소)
[사용자 설정에 맞춰 인라인 스타일 CSS 렌더링]
```

### 호환성 유지(Fallback) 규칙
1. **주석 설정 데이터가 없는 기존 글**: 작성되었던 전체 글과의 백워드 호환을 위해, 설정 주석이 발견되지 않으면 **크리에이박스 공식 인사이트 카드**를 Fallback으로 항상 기본 렌더링합니다.
2. **`enabled: false` 설정 시**: 상세 페이지 하단에 에디토리얼 박스를 완전히 생략 처리합니다.
3. **`enabled: true` 설정 시**: 사용자가 설정한 문구, 컬러, 프리셋 값으로 카드를 드로잉합니다.

---

## 3. 사용자 인터페이스 (User Interface)

에디터 상단/중앙 제어바의 `[ T 맞춤법 ]` 오른쪽에 `[ 에디토리얼 설정 ]` 버튼이 배치되어 있습니다.

### 설정 모달의 제어 항목
* **에디토리얼 상자 활성화**: 토글 온/오프 스위치 제공.
* **테마 프리셋 선택**: 원클릭으로 어울리는 테마색을 선택합니다.
  * **기본 라이트**: 회색 배경 + 네이비 소제목 + 차콜 본문
  * **소프트 블루**: 연파랑 배경 + 블루 소제목 + 남색 본문
  * **소프트 그린**: 연초록 배경 + 그린 소제목 + 청록 본문
  * **소프트 레드**: 연빨강 배경 + 레드 소제목 + 딥레드 본문
  * **네온 다크**: 다크네이비 배경 + 퓨어화이트 본문 + 스카이블루 소제목
* **상단 소제목 (Subtitle) & 상세내용 (Content Text)**: 텍스트 박스와 텍스트에리어를 통해 에디토리얼 문구 실시간 변경 지원.
* **상세 색상 커스텀**: `배경색`, `테두리색`, `소제목색`, `본문글자색`을 Hex 코드 입력 및 HTML5 Color Picker를 통해 자유롭게 맞춤 설정 가능.
* **실시간 미리보기 (Live Preview)**: 하단에 가상의 렌더링 박스가 반응형으로 연동되어 변경 사항을 바로 확인 가능.

---

## 4. 코드 구현 상세

### 4-1. 에디터 컴포넌트 (`UniversalBlogEditor.tsx`)
* **경로**: [`src/components/writing/editor/UniversalBlogEditor.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/components/writing/editor/UniversalBlogEditor.tsx)
* **내부 데이터 처리**:
  * Tiptap 에디터 로드 시 `initialHtml`을 가공할 때 `cleanContentComment` 헬퍼를 사용해 에디터 자체 화면에는 원시 주석 코드가 표시되지 않도록 숨깁니다.
  * Tiptap 내용의 실시간 업데이트를 관장하는 `onUpdate` 콜백 내에서 `editorialSettingsRef.current` 설정을 취합해 본문 끝에 주석 문자열을 붙여 부모 페이지의 `setContent`로 전달합니다.

### 4-2. 공식 블로그 상세 템플릿 (`page.tsx`)
* **경로**: [`src/app/blog/[slug]/page.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/blog/%5Bslug%5D/page.tsx)
* **내용**:
  * 본문 `post.content`에서 정규식을 이용해 주석 데이터 객체를 파싱해내고, 본문 내에서 주석 코드를 제거한 상태로 사용자 웹페이지(Markdown 또는 dangerouslySetInnerHTML)에 출력합니다.
  * `editorial.enabled`가 활성화되어 있을 시 하단 기사 꼬리 영역에 CSS 인라인 바인딩을 적용한 카드를 동적 렌더링합니다.

### 4-3. 브랜드 블로그 상세 템플릿 (`PostClientWrapper.tsx`)
* **경로**: [`src/app/brand/[brand_id]/components/PostClientWrapper.tsx`](file:///Users/a1234/Local%20Sites/creaibox/src/app/brand/[brand_id]/components/PostClientWrapper.tsx)
* **내용**:
  * 파싱 로직은 공식 블로그와 동일하게 수반됩니다.
  * 사용자가 에디토리얼을 직접 편집하여 커스텀한 경우(`hasCustomEditorial === true`) 설정대로 렌더링되며, 커스텀하지 않고 공란인 경우에는 CreAibox 공식 사이트로의 연결 백링크(Backlink)가 걸린 기본 `CreAibox Publisher` 카드를 노출하여 사이트 전반의 도메인 점수 향상을 유도합니다.

---

## 5. 검색엔진 최적화(SEO) 전략 팁

* **배경 키워드 유지**: 네이버와 구글 서치콘솔이 사이트 간의 유기적 매핑을 원활히 하도록 소제목이나 본문 텍스트 내에 **"크리에이박스"**, **"CreAibox"** 키워드를 최소 1회 이상 유지하는 것이 검색 인덱싱 노출 확률을 높입니다.
* **앵커 텍스트 활용**: 개별 도메인을 쓰는 브랜드 블로그의 경우 하단 카드 내의 텍스트에 공식 주소(`https://creaibox.com`)로 이어지는 하이퍼링크가 자동 제공되어 대량의 고품질 외부 백링크(External Backlinks)를 누적 구축할 수 있어 자연스러운 메인 도메인 지수 상승 효과를 발휘합니다.
