// content-creaibox.js - Injected into localhost:3000 and creaibox.com

console.log("[CreAibox Suno Connector] Content script loaded on CreAibox page.");

// Safe helper to check if chrome extension runtime is valid
function isExtensionContextValid() {
  return typeof chrome !== "undefined" && chrome.runtime && !!chrome.runtime.id;
}

// Global error listener to mute context invalidation events
window.addEventListener("error", (event) => {
  if (event.message && event.message.includes("Extension context invalidated")) {
    console.warn("[CreAibox Connector] Extension context invalidated on CreAibox dashboard tab. Silent catch.");
  }
}, true);

// 1. Handshake: Register this tab's ID with the background service worker on mount
function registerTabWithBackground() {
  if (!isExtensionContextValid()) return;

  try {
    chrome.runtime.sendMessage({ type: "REGISTER_CREAIBOX_TAB" }, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        console.log("[CreAibox Connector] Background worker not ready yet, retrying in 2s...");
        setTimeout(registerTabWithBackground, 2000);
      } else {
        console.log("[CreAibox Connector] Tab successfully registered with service worker.");
      }
    });
  } catch (e) {}
}

// 2. Load cached sync data from chrome storage if available to instantly recover folders/songs
function loadCachedSyncData() {
  if (!isExtensionContextValid()) return;

  try {
    chrome.storage.local.get("sunoSyncedData", (result) => {
      const err = chrome.runtime.lastError;
      if (err) return;
      
      if (result && result.sunoSyncedData) {
        console.log("[CreAibox Connector] Local storage cache found, restoring tracks/folders...", result.sunoSyncedData);
        window.postMessage({
          type: "SUNO_SYNCED_METADATA",
          payload: result.sunoSyncedData
        }, "*");
      }
    });
  } catch (e) {}
}

// Initial mount registration and cache restore
registerTabWithBackground();
loadCachedSyncData();

// Listen to postMessage events fired from the React app window
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  // Trigger Suno generation with prefill payload
  if (event.data && event.data.type === "TRIGGER_SUNO_GENERATION") {
    if (!isExtensionContextValid()) return;

    console.log("[CreAibox Connector] Trigger song generation message detected:", event.data.payload);
    
    try {
      chrome.runtime.sendMessage({
        type: "SAVE_PREFILL_DATA",
        payload: event.data.payload
      }, (response) => {
        const err = chrome.runtime.lastError;
        if (err) {
          console.error("[CreAibox Connector] Failed to save prefill data:", err.message);
          return;
        }
        
        console.log("[CreAibox Connector] Prefill metadata synced. Navigating to Suno.com/create...");
        window.location.href = "https://suno.com/create";
      });
    } catch (e) {}
  }

  // Force trigger sync request from dashboard button click
  if (event.data && event.data.type === "FORCE_SUNO_SYNC_REQUEST") {
    console.log("[CreAibox Connector] Force sync request clicked. Restoring cache & triggering scrape...");
    loadCachedSyncData(); // Instant load from cache
    registerTabWithBackground(); // Refresh tab registration
    if (isExtensionContextValid()) {
      try {
        chrome.runtime.sendMessage({ type: "REQUEST_FORCE_SYNC_FROM_SUNO" });
      } catch (e) {}
    }
  }
});

// Receive synced track metadata updates from background worker and bubble them back up to React application
if (isExtensionContextValid()) {
  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!isExtensionContextValid()) return;

      if (message.type === "SUNO_METADATA_UPDATED") {
        console.log("[CreAibox Connector] Received background song updates, forwarding to React app:", message.payload);
        
        window.postMessage({
          type: "SUNO_SYNCED_METADATA",
          payload: message.payload
        }, "*");
        
        sendResponse({ status: "success", forwarded: true });
      }
      return true;
    });
  } catch (e) {}
}
