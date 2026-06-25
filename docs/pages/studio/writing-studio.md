# Writing Studio Page Specification

This document details the route and page layout specifications for the Writing Studio within the CreAibox platform.

## 1. Page Routes
* **Post List Page**: `src/app/studio/writing/creaibox/list/page.tsx`
  - Route: `/studio/writing/creaibox/list`
  - Function: Displays draft, saved, and published blog posts with pagination, search parameters, and filters.
* **Editor Detail Page**: `src/app/studio/writing/creaibox/list/[id]/page.tsx`
  - Route: `/studio/writing/creaibox/list/[id]`
  - Function: Interactive rich-text writing workspace utilizing the `UniversalBlogEditor` component.

## 2. Page Components & Layout Structure
* **Header Bar**:
  - Displays breadcrumbs, return to list links, and status icons.
  - Action buttons: "전체 복사" (Copy All), "다운로드" (Download HTML), "미리보기" (Preview), and "원고 저장" (Save Draft).
* **Workspace Body**:
  - **Left Sidebar**: Shows draft navigation, post types, and shortcuts.
  - **Center Editor**: Rich text input canvas based on TipTap. Allows manual heading structures, bold, italics, links, images, tables, YouTube embeddings, and line separators.
  - **Right Panel (SEO & Metadata)**: Expandable drawer containing:
    - **SEO 최적화 (SEO Optimizer)**: Real-time readability audits, title, meta description, and keywords.
    - **썸네일 (Thumbnail Banner)**: Banner configuration.
    - **본문 이미지 (Body Images)**: Body image repository.
    - **스키마 (JSON-LD Markups)**: Structured schema config.

## 3. Custom AI Tab Controls
The AI tab bar situated directly below the header controls workspace state modifications:
* **AI 포스팅 글쓰기**: Coordinates tone selections, strategy levels, main themes, and keyword optimizations.
* **AI 포스팅 재창조**: Captures URLs to pull text layouts and start new rewrites.
* **AI 자동 수정보완**: Applies local polishers (tone tweaks, block styling, TOC generations).
* **AI PDF 텍스트 추출기**: Uploads local PDF files via traditional file browser search dialog (`pdfFileInputRef`) or through direct Drag and Drop interface, and initiates structured recreations through custom Gemini LLM templates.
