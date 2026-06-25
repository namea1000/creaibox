# Disk Space Troubleshooting: `.next` Cache Usage

This document provides information on analyzing and resolving high disk space usage issues in the creaibox project, specifically caused by the hidden `.next` directory.

---

## Issue Description

The creaibox project folder may unexpectedly show a very large size (e.g., 20GB+), even though individual visible folders (like `src`, `public`, `node_modules`) do not account for this volume. 

The primary cause is the hidden **`.next`** directory, which is created and populated automatically by Next.js during local development and production builds.

### Space Distribution Example
* **`.next` (Hidden)**: ~24GB
  * **`.next/dev/cache/turbopack`**: ~23GB (Incremental bundler cache files generated when running with `next dev --turbo`)
* **`node_modules`**: ~1.1GB (Standard project dependencies)
* **Other folders (`src`, `public`, etc.)**: Under 300MB

---

## Key Causes

1. **Turbopack Cache (`.next/dev/cache/turbopack`)**:
   * Next.js uses Turbopack (with the `--turbo` flag) to compile code incrementally.
   * To achieve extremely fast hot module replacement (HMR) and fast refreshes, Turbopack maintains highly granular caches of compile states.
   * Over a long development period, these cache files accumulate and can grow to tens of gigabytes.
2. **Hidden by Default**:
   * Folders starting with a dot (`.`) are hidden by default in macOS Finder, making the source of the high disk usage difficult to identify during manual folder size checks.

---

## How to Resolve

### 1. View Hidden Files in macOS Finder
To inspect the `.next` folder in Finder:
1. Open the `creaibox` project folder in Finder.
2. Press **`Cmd + Shift + .`** (Command + Shift + Period) to toggle hidden files.

### 2. Delete the `.next` Folder
The `.next` folder contains only compiled assets and caches. It is completely safe to delete. 

#### Via Terminal:
Run the following command from the project root directory:
```bash
rm -rf .next
```

#### Re-generation:
After deletion, the folder will be automatically re-created the next time you run:
* Local development: `npm run dev`
* Production build: `npm run build`
