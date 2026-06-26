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

---

## Browser Storage (Client-Side) Disk Space Usage: Video Editor IndexedDB

### Issue Description
When using the Video Editor to import media files, extract audio tracks, or perform reverse video transformations, the browser caches these files locally in a persistent database called **IndexedDB** (`creaibox-video-editor-db`). 

Because these files are stored within the browser's internal application support directory on the user's hard drive, **they do not show up in the project directory size**. If a user edits a lot of videos or performs multiple reverse transformations on large files, this "invisible" storage can grow to several gigabytes.

### Key Causes
1. **Local Media Caching (`creaibox-video-editor-db`)**:
   * To achieve extremely fast load times, enable offline timeline scrubbing, and persist files across refreshes, all uploaded or generated files are converted to raw Blobs and stored in the `media-files` store.
   * Files under 500MB are cached automatically.
2. **Audio Pre-extraction & Reversals**:
   * For every video added, an audio-only WAV track is pre-extracted and stored in IndexedDB to bypass decoding latency.
   * Reversing a video generates a brand new reversed MP4 file, which is also cached in the database.
3. **Hidden Browser Directory**:
   * The files are stored in the browser's internal profile directories (e.g., `~/Library/Application Support/Google/Chrome/Default/IndexedDB` on macOS), which are hidden by default and hard to find.

---

## How to Check and Clear Browser Space

### Method 1: Via Browser Settings (Recommended for Users)
1. Open Google Chrome and go to **Settings** -> **Privacy and Security** -> **Site Settings**.
2. Click **View permissions and data stored across sites**.
3. Search for `localhost` (or `creaibox.com` in production).
4. Click the **Trash icon** next to the domain or click **Clear data** to free all occupied space.

### Method 2: Via Browser Developer Tools (For Developers)
1. Open Chrome Developer Tools (`F12` or `Cmd + Option + I`).
2. Go to the **Application** tab (top bar).
3. In the left sidebar, expand **IndexedDB** -> **`creaibox-video-editor-db`**.
4. Right-click the **`media-files`** or **`media-waveforms`** object store, and click **Clear** to delete the cached files.
5. Alternatively, click **Storage** in the left sidebar (under *Application*), and click **Clear site data** (make sure "IndexedDB" is checked).

