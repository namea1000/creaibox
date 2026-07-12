// background.js - CreAibox Suno Connector Service Worker

let registeredCreaiboxTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Handshake registration endpoint
  if (message.type === "REGISTER_CREAIBOX_TAB") {
    if (sender.tab && sender.tab.id) {
      registeredCreaiboxTabId = sender.tab.id;
      console.log("[CreAibox Background] Registered active CreAibox Tab ID:", registeredCreaiboxTabId);
      sendResponse({ registered: true });
    } else {
      sendResponse({ registered: false, error: "No tab context" });
    }
    return true;
  }

  // 2. Relay force sync trigger command to Suno tabs
  if (message.type === "REQUEST_FORCE_SYNC_FROM_SUNO") {
    console.log("[CreAibox Background] Relaying force sync request to all Suno.com tabs...");
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) return;

      tabs.forEach((tab) => {
        if (tab.id && tab.url && tab.url.includes("suno.com")) {
          console.log("[CreAibox Background] Nudging Suno.com tab to scrape immediately:", tab.id);
          chrome.tabs.sendMessage(tab.id, { type: "FORCE_TRIGGER_SCRAPE" }, (response) => {
            // Read lastError immediately to prevent Chrome from logging Uncaught Promises
            const err = chrome.runtime.lastError;
            if (err) {
              console.log("[CreAibox Background] Force sync trigger handshake skipped for tab:", tab.id);
            }
          });
        }
      });
    });
    sendResponse({ nudged: true });
    return true;
  }

  // Save prefill data received from CreAibox tab
  if (message.type === "SAVE_PREFILL_DATA") {
    chrome.storage.local.set({ prefillData: message.payload }, () => {
      console.log("[CreAibox Background] Prefill data saved successfully:", message.payload);
      sendResponse({ status: "success", saved: true });
    });
    return true;
  }

  // Retrieve prefill data requested by Suno tab
  if (message.type === "GET_PREFILL_DATA") {
    chrome.storage.local.get("prefillData", (result) => {
      const data = result.prefillData || null;
      console.log("[CreAibox Background] Retrieved prefill data:", data);
      sendResponse({ prefillData: data });
    });
    return true;
  }

  // Sync song metadata generated from Suno.com back to open CreAibox tabs
  if (message.type === "SYNC_SONG_METADATA") {
    console.log("[CreAibox Background] Syncing generated song metadata from Suno.com:", message.payload);
    
    // A. Priority Dispatch: Send directly to the registered tab ID
    if (registeredCreaiboxTabId) {
      console.log("[CreAibox Background] Direct dispatching payload to registered tab:", registeredCreaiboxTabId);
      try {
        chrome.tabs.sendMessage(registeredCreaiboxTabId, {
          type: "SUNO_METADATA_UPDATED",
          payload: message.payload
        }, (response) => {
          // Read lastError immediately to prevent Chrome's red error badge from populating
          const err = chrome.runtime.lastError;
          if (err) {
            console.log("[CreAibox Background] Registered tab connection closed. Clearing cache registry.");
            registeredCreaiboxTabId = null;
          }
        });
      } catch (e) {
        console.log("[CreAibox Background] Caught sendMessage sync exception:", e);
        registeredCreaiboxTabId = null;
      }
    }
    
    // B. Fallback Broadcast: Scan other active tabs
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) return;

      tabs.forEach((tab) => {
        if (tab.id && tab.url && tab.id !== registeredCreaiboxTabId) {
          const url = tab.url.toLowerCase();
          if (url.includes("localhost:") || url.includes("localhost/") || url.includes("creaibox.com")) {
            try {
              chrome.tabs.sendMessage(tab.id, { 
                type: "SUNO_METADATA_UPDATED", 
                payload: message.payload 
              }, (response) => {
                const err = chrome.runtime.lastError;
                if (err) {
                  // Silent catch for other uninitialized developer pages
                }
              });
            } catch (e) {}
          }
        }
      });
    });

    sendResponse({ status: "dispatched" });
    return true;
  }
});
