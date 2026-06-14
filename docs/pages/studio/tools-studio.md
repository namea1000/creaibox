# 스튜디오 Tools 화면 정의서 (Page Specification)

이 문서는 스튜디오 Tools 및 상세 보조 유틸리티 화면들의 라우팅 정보와 스펙을 정리한 정의서입니다.

---

## 1. 메인 홈 화면
* **경로**: `/studio/tools` -> `src/app/studio/tools/page.tsx`
* **설명**: 자주 반복되는 미니 작업들을 빠르게 분기 실행하는 통제 센터. 카테고리 현황 통계 카드, 12개 유틸리티 네비게이션 그리드 링크 및 빠른 변환 가이드 패널 제공.

---

## 2. 동적 상세 도구 화면
* **경로**: `/studio/tools/[section]` -> `src/app/studio/tools/[section]/page.tsx`
* **설명**: URL의 `[section]` 세그먼트 매개변수를 매치하여 아래 상세 컴포넌트를 호출하고 공통 브레드크럼 헤더 레이아웃을 바인딩합니다.

### 2-1. AI 누끼 제거
* **세그먼트**: `/studio/tools/bg-remover` -> [BgRemover.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/BgRemover.tsx)
* **기능**: 이미지 업로드 시 피사체를 투명화한 체크 무늬 배경 카드에 표시 및 PNG 다운로드.

### 2-2. PDF 문서 분석
* **세그먼트**: `/studio/tools/pdf-analyzer` -> [PdfAnalyzer.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/PdfAnalyzer.tsx)
* **기능**: PDF 파일 요약, 키워드 추출 및 문서 내용 챗 Q&A 인터랙션.

### 2-3. AI OCR 문자 추출
* **세그먼트**: `/studio/tools/ocr` -> [OcrExtractor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/OcrExtractor.tsx)
* **기능**: 스캔본 폰트 분석 진행 및 디지털 텍스트 추출 복사.

### 2-4. AI 프롬프트 개선기
* **세그먼트**: `/studio/tools/prompt-enhancer` -> [PromptEnhancer.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/PromptEnhancer.tsx)
* **기능**: 초안 한글 키워드를 입력해 플랫폼에 맞는 파라미터를 갖춘 영어 프롬프트로 튜닝.

### 2-5. AI 프롬프트 번역기
* **세그먼트**: `/studio/tools/prompt-translator` -> [PromptTranslator.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/PromptTranslator.tsx)
* **기능**: 한글 설명을 쉼표 분리 영문 태그 또는 영어 자연어 구조로 번역.

### 2-6. 해시태그 생성기
* **세그먼트**: `/studio/tools/hashtag` -> [HashtagGenerator.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/HashtagGenerator.tsx)
* **기능**: 검색 키워드 기반 대형/세부/소통 해시태그 세트를 일괄 3대 그룹으로 추출.

### 2-7. 유튜브 썸네일 다운로더
* **세그먼트**: `/studio/tools/youtube-thumbnail` -> [YoutubeThumbnail.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/YoutubeThumbnail.tsx)
* **기능**: 유튜브 영상 ID 분석, 최대 해상도 커버 썸네일 노출 및 다운로드 외부 링크 생성.

### 2-8. 색상 추출기
* **세그먼트**: `/studio/tools/color-picker` -> [ColorPicker.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/ColorPicker.tsx)
* **기능**: 업로드 이미지에서 5대 시각 색상을 감별해 HEX/RGB 코드 클립보드 복사.

### 2-9. QR 생성기
* **세그먼트**: `/studio/tools/qr` -> [QrGenerator.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/QrGenerator.tsx)
* **기능**: 입력 텍스트에 연동된 실제 scan-ready QR 코드를 Canvas API로 로딩.

### 2-10. 포맷 변환기
* **세그먼트**: `/studio/tools/converter` -> [FormatConverter.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/FormatConverter.tsx)
* **기능**: 이미지/문서/음악의 가상 변환 진행률 게이지 표시 및 다운로드 링크.

### 2-11. 메타데이터 추출기
* **세그먼트**: `/studio/tools/metadata` -> [MetadataExtractor.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/MetadataExtractor.tsx)
* **기능**: 원본 파일 EXIF 속성값 목록 정리 테이블 뷰.

### 2-12. 코드 뷰티파이어
* **세그먼트**: `/studio/tools/code-beautifier` -> [CodeBeautifier.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/tools/%5Bsection%5D/components/CodeBeautifier.tsx)
* **기능**: HTML/CSS/JS/JSON 텍스트 여백을 들여쓰기로 깔끔히 튜닝 복사.
