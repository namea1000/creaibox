# Chrome Web Store Listing - CreAibox Suno Connector

This document holds the store metadata, permission justifications, and developer setups for publishing the **CreAibox Suno Connector** to the Chrome Web Store.

---

## 1. Store Listing Details

* **Product Name**: CreAibox Suno Connector
* **Short Description**: Seamlessly bridges your AI album planners in CreAibox with Suno.com's creation engine in real-time.
* **Detailed Description**:
  The CreAibox Suno Connector acts as an automated bridge between your CreAibox AI Music Studio and Suno.com. 

  **Key Features**:
  1. **One-Click Prefill**: Automatically transfers style tags, lyrics prompts, and vocal gender preferences generated from CreAibox AI Planners directly into Suno's composition inputs.
  2. **Active Metadata Syncing**: Silently tracks generated song links, artwork thumbnails, and audio streams in Suno, sync-pushing them back to your CreAibox workspace.
  3. **Folder Automation**: Syncs folder paths and metadata layouts across browser tabs.

---

## 2. Permissions Justifications

Every permission requested in `manifest.json` is justified in plain English below:

| Permission | Purpose & Justification |
| :--- | :--- |
| **`storage`** | Required to cache pending prefill objects (prompt tags, custom lyrics) temporarily in service worker space before applying them on Suno.com. |
| **`tabs`** | Required to identify open Suno.com or CreAibox.com tabs, enabling real-time background dispatching of synced audio metadata. |
| **`activeTab`** | Grants the extension scripting runtime context on the active creation tab upon user navigation triggers. |

---

## 3. Privacy & Data Use Disclosure

* **Data Collected**:
  * **Website Content**: Read and write access to inputs on `suno.com` (prompts, style tag textareas) solely to automate prefill actions.
  * No personal identity metrics, passwords, cookies, or track records are ever accessed, stored, or transferred.
* **Storage Location**: Local browser storage context only (`chrome.storage.local`).
* **External Transmissions**: Shared strictly between the client-side `suno.com` tab and the user's active `creaibox.com` dashboard tab via secure Chrome Runtime Messages.

---

## 4. Setup Guide for Development (Load Unpacked)

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** (top-right corner).
3. Click **Load unpacked** (top-left corner).
4. Select the directory: `[project_root]/suno-chrome-extension/`.
5. Open your CreAibox Music Studio page and click **"Suno에서 노래 만들기"** to test the automatic redirect and prefill flow!
