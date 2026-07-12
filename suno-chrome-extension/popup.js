// popup.js - Suno Connector Popup Controller

document.addEventListener("DOMContentLoaded", () => {
  const pendingPrefillVal = document.getElementById("pending-prefill");
  const btnSyncNow = document.getElementById("btn-sync-now");

  // Check if there are any active prefill queue data waiting to be injected
  function updatePendingStatus() {
    chrome.storage.local.get("prefillData", (result) => {
      if (result && result.prefillData) {
        pendingPrefillVal.textContent = "작곡 대기 중";
        pendingPrefillVal.style.color = "#fbbf24"; // Amber-400
      } else {
        pendingPrefillVal.textContent = "없음";
        pendingPrefillVal.style.color = "#10b981"; // Emerald-500
      }
    });
  }

  // Force navigate or focus on Suno create page
  btnSyncNow.addEventListener("click", () => {
    chrome.tabs.query({ url: "*://suno.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        // Switch to the first matching Suno tab and focus window
        const targetTab = tabs[0];
        if (targetTab.id) {
          chrome.tabs.update(targetTab.id, { active: true });
          if (targetTab.windowId) {
            chrome.windows.update(targetTab.windowId, { focused: true });
          }
        }
      } else {
        // Open a new Suno create page if not open
        chrome.tabs.create({ url: "https://suno.com/create" });
      }
      window.close(); // Close extension popup
    });
  });

  updatePendingStatus();
});
