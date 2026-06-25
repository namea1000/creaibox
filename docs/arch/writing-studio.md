# Writing Studio Operational Architecture

This document describes the operational architecture of the Writing Studio within the CreAibox platform.

## 1. Purpose
The Writing Studio is designed to empower content creators with advanced, AI-driven blog editing tools. It helps users generate high-quality SEO-optimized articles, recreate posts from URLs or PDF text inputs, and perform structural content enhancement in a seamless, loading-free dark-mode editor.

## 2. Main Features
* **AI Smart Blog Writing**: Generates standard and SEO-focused posts based on main/subtopics, tone settings, and targeted keywords.
* **AI Post Recreation**: Rewrites external content from articles using URLs.
* **AI PDF Text Extractor**: Allows uploading `.pdf` files, extracts core text/image descriptions, and recreates new plagiarism-free markdown blog articles based on the PDF content.
* **AI Auto Correction & Polishing**: Enhances existing content structure, extends content volume, auto-generates Tables of Contents (TOC), and formats text layout.
* **SEO Optimizer & Schema Markups**: Auto-analyzes focus keywords, builds titles/meta descriptions, suggests SEO tags, and generates JSON-LD Schema markup.
* **Thumbnail & Image Management**: Manages generated blog thumbnails, edits captions, and handles image source optimization (WebP conversion).

## 3. UI Structure
* **Sidebar Navigation**: Quick links to AI Posting Drafts, Asset Libraries, and Blog Settings.
* **Main Tiptap Editor**: A visual rich text editor built on TipTap with markdown support.
* **Tab-based AI Interface**:
  - **AI 포스팅 글쓰기 (Smart Writer)**: Input topics and settings to draft new posts.
  - **AI 포스팅 재창조 (Recreator)**: Copy-paste URL to fetch and recreate.
  - **AI 자동 수정보완 (Auto Enhancer)**: Apply filters like tone adjustments, expansion, or styling.
  - **AI PDF 텍스트 추출기 (PDF Extractor)**: Attach local PDF files, run pixel/text extraction, and rewrite articles instantly.
* **Right Panel Options**: Expandable sections for SEO Optimization, Thumbnails, Content Images, and Schema markups.

## 4. Database Structure
The studio interacts with the following tables under Supabase:
* **`writing_creaibox_posts`**: Stores post metadata, markdown content, title, target keywords, configuration settings, status (`draft`, `saved`, `published`, `trash`), and timestamps.
* **`generated_images`**: Manages uploaded and generated assets, handles image roles (`thumbnail`, `content_image`), and links to post IDs (`source_id`).

## 5. API Structure
* **Gemini LLM Direct/Fallback Gateway**: Orchestrates API calls using `generateGeminiContentWithFallback` for high-quality text generations.
* **`/api/image-upload/external`**: Automatically detects external image URLs pasted into TipTap and uploads them asynchronously to the secure Supabase storage.
* **PDF Parse Integration**: Processes PDF binary streams into plaintext format.

## 6. Component Structure
* **`UniversalBlogEditor.tsx`**: Main editor shell coordinating rich text state, AI input tabs, and sidebar utilities.
* **`CreaiboxAnalysisTower.tsx`**: Conducts Real-time content reading statistics and SEO checks.
* **`CreaiboxThumbnailPanel.tsx`**: Manages featured banner configurations.
* **`CreaiboxContentImagePanel.tsx`**: Aggregates all body images in one dashboard view.
* **`CreaiboxSchemaPanel.tsx`**: Generates and maps JSON-LD structured schema metadata.

## 7. Future Expansion
* **Real-time PDF Parsing Engine**: Full replacement of client-side simulators with backend server-side parsing.
* **Dynamic Table of Contents**: Automatic side nav generation in public blog views.
* **Direct CMS Syncing**: One-click publication to external WordPress/Naver Blog endpoints.
