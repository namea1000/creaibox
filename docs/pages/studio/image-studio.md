# Image Studio - Page Specification

This document details the route pages, visual elements, layout wrappers, and styling guidelines for the upgraded Canva-style Image Studio.

---

## 1. Route Pages Overview

| Path | View Component | Description |
|:---|:---|:---|
| `/studio/image` | `ImageStudioHomePage` | The dashboard featuring template search, aspect presets, tool cards, recent items, and brand colors. |
| `/studio/image/workspace` | `WorkspaceTab` | The Canva drag-and-drop workspace canvas. |
| `/studio/image/templates` | `TemplatesTab` | The design template explore interface. |
| `/studio/image/brand-kit` | `BrandKitTab` | Guidelines for palettes, logos, and custom typography. |
| `/studio/image/magic-design` | `MagicDesignTab` | AI text-to-layout generator drafts. |
| `/studio/image/webp-compressor` | `WebpCompressorTab` | WebP batch compressor file dropzone. |
| `/studio/image/editor` | `ImageEditorTab` | Quick adjustments, filters, and watermark overlay preview. |

---

## 2. Page Specifications

### A. Main Dashboard Page (`/studio/image`)
* **Hero Search Banner**:
  - CSS style: `bg-gradient-to-br from-zinc-900 via-[#180f2d] to-[#12091f] rounded-2xl border border-zinc-800`
  - Purpose: Provides quick template searches and context layout setups.
* **Presets row**:
  - Displays cards representing standard dimensions. Clicking navigates to `/studio/image/workspace?width=W&height=H&type=T` to pre-initialize the canvas ratios.
* **Tool Grid**:
  - Lists 6 tool pathways using deep color blocks (`bg-[#090d16]/20 border border-zinc-800`).
* **Recent Projects**:
  - Custom grid items (`bg-gradient-to-tr border`) representing drafts. Click edit to open the editor.
* **Branding Palette**:
  - Interactive kit showing colors. Copy hex code to clipboard on click.

### B. Dynamic Workspace Canvas (`/studio/image/workspace`)
* **Left Toolbar Tabs**:
  - Visual navigation menu swapping settings panels.
* **Working Canvas**:
  - Centered card showing dynamic elements.
  - Interactive mouse events allow moving text/shapes/images layers in coordinates. Double-click layers to edit content.
* **Export controls**:
  - Prompts compile compression dialog with progress percentages on click.

---

## 3. Styling & Aesthetics
* **Theme**: Deep dark backgrounds (`#06080d` page, `#090d16` cards) offset by signature Canva-like violet and purple highlights (`text-purple-400`, `border-purple-500/20`, `bg-purple-600`).
* **Animations**: Immediate fade effects (`animate-in fade-in duration-200`) and compile progress spin animations.
