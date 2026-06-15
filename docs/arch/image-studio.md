# Image Studio - Operational Architecture

Purpose: This document describes the Canva/MiriCanvas-themed Image Studio architecture, page hierarchy, and component relationships in the CreAIbox project.

---

## 1. Purpose
The Image Studio is a design hub designed to match premium canvas editors (like Canva/MiriCanvas). It provides quick templates, custom canvas scaling presets, an interactive drag-and-drop workspace, branding setups, and quick batch image conversions.

---

## 2. Main Features
* **Template Search & Explore**: Browse categorized designs (YouTube thumbnails, Card News, Poster, Banner, Logo) and pre-initialize them directly into the editor canvas.
* **Canva Workspace Canvas**: Draggable canvas element grid supporting coordinate updates (`left`, `top`, `width`, `height`), text inputs, layer positioning (맨 앞으로/맨 뒤로), shape elements creation, and image additions.
* **Brand Kit Manager**: Custom branding color sets and logo file lists that can be clicked to inject directly into the canvas background or active elements.
* **AI Magic Design**: AI-powered text prompt analyzer mockup that creates matching visual layouts under multiple standard dimensions.
* **WEBP compressor**: Drag-and-drop batch converter that compresses images into WebP formats, calculating compression ratios.
* **Quick Image Editor**: Rapid side-by-side editing deck with filters (sepia, grayscale, invert), brightness/contrast ranges, and custom text watermarks.

---

## 3. UI Structure
```
/studio/image
 ├── Header Search Banner (Canva Search bar)
 ├── Preset dimensions quick actions bar (📺, 🗂️, 📸, 📄...)
 ├── Tool Selector Cards (Workspace, Templates, Brand kit, AI Magic, Compressor, Editor)
 ├── Recent projects list cards
 └── Brand Kit Color palette deck
```

---

## 4. Component Structure
```
src/app/studio/image/
 ├── page.tsx (Canva Dashboard Homepage)
 └── [section]/
      ├── page.tsx (Dynamic Route Router Page)
      └── components/
           ├── TemplatesTab.tsx (Template selection list)
           ├── WorkspaceTab.tsx (Interactive drag-and-drop Canvas editor)
           ├── BrandKitTab.tsx (Branded guidelines palette / fonts kit)
           ├── MagicDesignTab.tsx (AI layouts generator panel)
           ├── WebpCompressorTab.tsx (WEBP batch compressor)
           └── ImageEditorTab.tsx (Filter and watermark preview deck)
```

---

## 5. Future Expansion
* **MiriCanvas/Canva SDK Embedding**: Replace the mock canvas with embedded iframe elements or Canva REST SDK integration.
* **Canvas Exporting**: Add `html2canvas` or fabric.js to support client-side graphic exports.
