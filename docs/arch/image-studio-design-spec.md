# Image Studio - Design Specification

Purpose: This document details the design specifications, state architectures, and implementation rationale for the Canva/MiriCanvas-themed Image Studio in the CreAibox project.

---

## 1. UI/UX Decisions (Canva & MiriCanvas Aesthetic)
To create a premium editing layout:
* **Dark violet theme**: The headers and cards are styled with violet accents (`bg-[#180f2d]`, purple icons/borders) to distinguish it from the rest of the application.
* **Aspect ratio canvas**: The editor canvas utilizes CSS aspect ratio (`aspect-ratio: width / height`) to scale dynamically, keeping drawing shapes aligned.
* **Immediate responsive layout**: Quick panels, preset templates, and tool cards respond instantly. 

---

## 2. Workspace State Architecture & Draggable Events
The core Canvas Editor (`WorkspaceTab.tsx`) uses a client-side coordinate array system:
* **State Array**: `elements: CanvasElement[]`
  ```typescript
  interface CanvasElement {
    id: string;
    type: "text" | "shape" | "image";
    content: string; // Text string or Image URI
    x: number;       // Position X as percentage of canvas width (0-100)
    y: number;       // Position Y as percentage of canvas height (0-100)
    width: number;   // Width as percentage (0-100)
    height: number;  // Height as percentage (0-100)
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    shapeType?: "rect" | "circle" | "star";
  }
  ```
* **Draggable Mouse Events**:
  - Drag handlers calculate coordinates as percentages (`%`) relative to the canvas bounding rect box `getBoundingClientRect()`.
  - Mouse down captures click coordinates and offset difference between click point and element `x,y`.
  - Mouse move recalculates percent coordinates and maps them back onto element states.
  - Using percentage-based bounds ensures the canvas scales dynamically on different screen sizes without coordinates breaking.
* **Layers Ordering**:
  - The rendering order in React follows index rankings. Toggling `맨 앞으로` (Bring to Front) splices the active layer and appends it to the end of the array, causing it to render on top of others.

---

## 3. Future Roadmap
1. **Vector Drawing Fabric.js**: Integrate Fabric.js on top of elements coordinate arrays to allow rotational scaling, element alignment snap guides, group edits, and inline vector path scaling.
2. **Supabase Storage upload syncing**: Save drafts and brand palettes directly into database tables `profiles` and `storage`.
