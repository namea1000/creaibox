# Writing Studio Design Specification

This document records the architectural and design decisions for the CreAIbox Writing Studio, with a focus on the AI PDF Text Extractor module.

## 1. Architecture Decisions
* **Rich Text Editing Engine**: Selected TipTap for its extensible schema structure, allowing custom node controls (such as customized local canvas image elements, YouTube embeds, and tables).
* **AI Processing Separation**: Decoupled long-running LLM tasks into asynchronous server actions/clientside utility calls (`generateGeminiContentWithFallback`) to maintain main-thread responsiveness.
* **Hybrid Storage Pattern**: Local editor states are synced with React state, while heavy assets are persisted in Supabase buckets (`generated-images`) to optimize database footprint.

## 2. Database Design Rationale
* **`writing_creaibox_posts`**: Uses text columns for content instead of raw JSON to ensure seamless text indexing and retrieval, while supporting standard Markdown-to-HTML utilities.
* **`generated_images`**: Uses `is_primary` flags to handle banner image logic, reducing lookup overhead. Stores relational mapping via `source_type` and `source_id` to allow multiple studios to reuse the same table schema.

## 3. API Design Rationale
* **LLM Prompts**: Prompts are designed to output structured JSON data, forcing Gemini to output clear properties (`title`, `content`, `targetKeyword`). This eliminates parsing inconsistencies typical of raw string conversions.
* **Image WebP Converter**: All uploaded image blocks are intercepted on the client side and converted to lightweight WebP formats (max width 1600px, 92% quality) to optimize user bandwidth and CDN delivery costs.

## 4. UI/UX Decisions
* **Loading-Free Flow**: Adheres strictly to the CreAIbox UI/UX principles by rendering layouts immediately. We use localized loaders (`추출하는 중...`, `재창조 중...`) instead of global blocking overlays.
* **Ref separation**: To avoid input element conflicts, the image uploader (`fileInputRef`) and the PDF attachment uploader (`pdfFileInputRef`) use completely distinct refs.
* **Visual Theme Harmony**: Integrates cohesive colors (`bg-violet-600/20`, `text-violet-300`) to match the platform's Zinc styling tone.

## 5. Business Rules
* **PDF Extraction Logic**:
  1. PDF File Input or Drag & Drop drop event triggers state mapping (`pdfFile`, `pdfFileName`). Undergoes file type validation to only accept `.pdf` structures.
  2. Drag states are visually reflected in the UI container via dynamic styling classes (using dynamic border and background highlight effects).
  3. Click on "PDF 텍스트 및 이미지 추출" parses PDF contents and updates the editor preview.
  4. Clicking "AI 글 재창조 시작" initiates the Gemini prompt using either the extracted text block or the editor's current HTML body.
  5. The model structures a new blog post that bypasses copyright/duplicate checkers (Copycat filters).
  6. The title, editor content, and focus keywords are auto-replaced with the generated results.

## 6. Scaling Strategy
* **Batch Processing**: Planned transition to server-side PDF stream decoders (`pdf-parse`) or client-side worker threads to handle large (>50MB) multi-page documents without impacting browser performance.
* **Lazy Loading Components**: Panel components (SEO, Thumbnail, etc.) are loaded on-demand using React hooks to minimize initial bundle size.

## 7. Future Roadmap
* **Multi-Format Ingestion**: Expand the PDF extractor tab to ingest `.docx`, `.txt`, and `.xlsx` files.
* **Image Extraction and Vectorization**: Automatic parsing of PDF vector/raster images and saving them directly into the post's asset gallery.
