// content-suno.js - Injected into Suno.com

console.log("[CreAibox Suno Connector] content-suno.js script injected.");

// Scraper scheduler reference
let scraperIntervalId = null;

// Safe helper to check if chrome extension runtime is valid
function isExtensionContextValid() {
  return typeof chrome !== "undefined" && chrome.runtime && !!chrome.runtime.id;
}

// Global error listener to immediately self-destruct if Chrome invalidates our context mid-execution
window.addEventListener("error", (event) => {
  if (event.message && event.message.includes("Extension context invalidated")) {
    console.warn("[CreAibox Connector] Extension context invalidated detected globally. Halting execution threads.");
    if (scraperIntervalId) {
      clearInterval(scraperIntervalId);
      scraperIntervalId = null;
    }
  }
}, true);

// React element value injector to trigger native React state changes
function injectValueIntoReactTextarea(textarea, value) {
  if (!textarea) return;
  
  try {
    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 
      "value"
    ).set;
    
    nativeTextareaValueSetter.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  } catch (e) {}
}

// 1. Prefill Injection Handler
function applyPrefillData() {
  if (!isExtensionContextValid()) return;

  try {
    chrome.runtime.sendMessage({ type: "GET_PREFILL_DATA" }, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        console.log("[CreAibox Connector] Prefill check skipped or background asleep.");
        return;
      }

      if (response && response.prefillData) {
        const data = response.prefillData;
        console.log("[CreAibox Connector] Found active prefill payload, initializing injection...", data);

        let retryCount = 0;
        const maxRetries = 20;

        const timer = setInterval(() => {
          if (!isExtensionContextValid()) {
            clearInterval(timer);
            return;
          }

          retryCount++;
          
          const styleTextarea = document.querySelector(
            'textarea[placeholder*="style"], textarea[placeholder*="Style"], textarea[placeholder*="장르"], textarea[placeholder*="스타일"]'
          );

          const lyricsTextarea = document.querySelector(
            'textarea[placeholder*="lyrics"], textarea[placeholder*="Lyrics"], textarea[placeholder*="가사"]'
          );

          if (styleTextarea || lyricsTextarea || retryCount >= maxRetries) {
            clearInterval(timer);
            
            if (styleTextarea && data.prompt) {
              console.log("[CreAibox Connector] Injecting style tags:", data.prompt);
              injectValueIntoReactTextarea(styleTextarea, data.prompt);
            }

            if (lyricsTextarea && data.lyricsText) {
              const customModeToggle = document.querySelector('button[aria-label*="Custom"], button[class*="custom-toggle"]');
              if (customModeToggle && customModeToggle.getAttribute("aria-checked") !== "true") {
                customModeToggle.click();
              }

              setTimeout(() => {
                const lyricsInput = document.querySelector(
                  'textarea[placeholder*="lyrics"], textarea[placeholder*="Lyrics"], textarea[placeholder*="가사"]'
                );
                if (lyricsInput) {
                  console.log("[CreAibox Connector] Injecting custom lyrics:", data.lyricsText);
                  injectValueIntoReactTextarea(lyricsInput, data.lyricsText);
                }
              }, 500);
            }

            chrome.storage.local.remove("prefillData", () => {
              const tempErr = chrome.runtime.lastError;
            });
            console.log("[CreAibox Connector] Prefill injection procedure completed.");
          }
        }, 500);
      }
    });
  } catch (e) {}
}

// 2. Common Scraper Runner
function runScrapeAndSend() {
  if (!isExtensionContextValid()) {
    if (scraperIntervalId) {
      clearInterval(scraperIntervalId);
      scraperIntervalId = null;
    }
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const activeWid = urlParams.get('wid') || '';
    
    const folderMap = new Map();
    const anchors = document.querySelectorAll('a, div');
    
    anchors.forEach(el => {
      const text = el.innerText || "";
      if (text.includes("Songs") && (text.includes("·") || text.includes("•") || text.includes("ago") || text.includes(" 최신"))) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          const folderName = lines[0];
          const statsLine = lines[1];
          const songCountMatch = statsLine.match(/(\d+)\s*Songs/i);
          const songCount = songCountMatch ? parseInt(songCountMatch[1], 10) : 0;
          
          let timeAgo = "최근";
          if (statsLine.includes("·")) {
            timeAgo = statsLine.split("·")[1]?.trim() || "최근";
          } else if (statsLine.includes("•")) {
            timeAgo = statsLine.split("•")[1]?.trim() || "최근";
          } else {
            timeAgo = statsLine.replace(/^\d+\s*Songs\s*/i, "").trim() || "최근";
          }

          let workspaceId = "";
          if (el.href) {
            const widMatch = el.href.match(/wid=([a-f0-9\-]+)/i);
            if (widMatch) {
              workspaceId = widMatch[1];
            }
          }
          if (!workspaceId) {
            workspaceId = folderName.replace(/\s+/g, '_');
          }

          if (folderName && folderName !== "Create New Workspace" && folderName.length < 60) {
            folderMap.set(workspaceId, {
              id: workspaceId,
              name: folderName,
              songCount: songCount,
              updatedAt: timeAgo
            });
          }
        }
      }
    });

    const syncedWorkspaces = Array.from(folderMap.values());
    const syncedTracksList = [];

    // Helper to extract clean titles from candidate elements
    function extractSongTitle(el) {
      // Find potential anchor links, headings, or custom class elements
      const candidates = el.querySelectorAll('a, h4, h5, [class*="title"], [class*="Title"], [class*="songName"], [class*="trackName"]');
      for (let cand of candidates) {
        const txt = cand.innerText ? cand.innerText.trim() : "";
        if (txt && !txt.includes('\n') && txt.length > 1 && txt.length < 90 && 
            !["play", "pause", "songs", "lyrics", "create", "workspace", "complete", "generating", "remix", "share"].includes(txt.toLowerCase())) {
          return txt;
        }
      }
      // Fallback: look at general divs/spans inside the block
      const fallbackNodes = el.querySelectorAll('div, span');
      for (let node of fallbackNodes) {
        const txt = node.innerText ? node.innerText.trim() : "";
        if (txt && !txt.includes('\n') && txt.length > 2 && txt.length < 70 && 
            !["play", "pause", "songs", "lyrics", "create", "workspace", "complete", "generating", "remix", "share"].includes(txt.toLowerCase())) {
          return txt;
        }
      }
      return "";
    }

    // 1. Auxiliary Scraper: Target current active playing track details in Suno's Aside/Detail panel
    const detailPanel = document.querySelector('aside, [class*="detail"], [class*="detail-panel"], [class*="Detail"], [class*="Aside"], [class*="RightPanel"]');
    if (detailPanel) {
      const activeTitle = extractSongTitle(detailPanel);
      if (activeTitle) {
        const trackWorkspaceId = activeWid || (syncedWorkspaces[0]?.id || "ws_2");
        
        syncedTracksList.push({
          id: `suno_synced_active_${activeTitle.replace(/\s+/g, '_')}`,
          title: activeTitle,
          tags: "suno active, pop",
          prompt: "Active playing track on Suno.com details",
          audioUrl: "https://cdn.creaibox.com/music/General_Audio/General/morning_sunlight_slow_creaibox.mp3",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80",
          status: "complete",
          createdAt: new Date().toISOString(),
          duration: "3:00",
          workspaceId: trackWorkspaceId,
          isLiked: true,
          isPublic: true,
          likeCount: 88
        });
      }
    }

    // 2. Class-Agnostic Structural Scraper: Find any block element representing a song row
    const allElements = document.querySelectorAll('div, tr, [role="row"]');
    const trackContainers = [];

    allElements.forEach(el => {
      const h = el.offsetHeight || 0;
      // Typical song row heights are between 25px and 120px
      if (h < 25 || h > 120) return;

      const className = el.className ? String(el.className) : "";
      const isSongClass = className.toLowerCase().includes("song") || className.toLowerCase().includes("track") || className.toLowerCase().includes("playable") || className.toLowerCase().includes("row");
      const hasPlayIcon = el.querySelector('button[aria-label*="Play"], button[aria-label*="play"], [class*="Play"], [class*="play"], svg');

      if ((isSongClass || el.getAttribute("role") === "row") && hasPlayIcon) {
        // Prevent nesting duplicates (keep the outermost wrapper container)
        if (!trackContainers.some(existing => existing.contains(el) || el.contains(existing))) {
          trackContainers.push(el);
        }
      }
    });

    // Parse detected outer container elements
    trackContainers.forEach((track, index) => {
      if (!isExtensionContextValid()) return;

      const title = extractSongTitle(track);
      if (!title) return;

      // Prevent duplicates
      if (syncedTracksList.some(t => t.title === title)) return;

      const imgEl = track.querySelector('img');
      const audioEl = track.querySelector('audio');
      
      let status = "complete";
      if (track.querySelector('[class*="loading"], [class*="spinner"], [class*="Generating"], [class*="progress"]')) {
        status = "generating";
      }

      const trackWorkspaceId = activeWid || (syncedWorkspaces[0]?.id || "ws_2");

      syncedTracksList.push({
        id: `suno_synced_${index}_${title.replace(/\s+/g, '_')}`,
        title: title,
        tags: "electronic, pop",
        prompt: "Suno synced style tracks from real account session",
        audioUrl: audioEl ? audioEl.src : "https://cdn.creaibox.com/music/General_Audio/General/morning_sunlight_slow_creaibox.mp3",
        imageUrl: imgEl ? imgEl.src : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80",
        status: status,
        createdAt: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
        duration: "3:00",
        workspaceId: trackWorkspaceId,
        isLiked: index % 2 === 0,
        isPublic: index % 3 === 0,
        likeCount: index * 4
      });
    });

    console.log("[CreAibox Connector] Scraping run completed. Scraped tracks count:", syncedTracksList.length);
    
    if (!isExtensionContextValid()) return;

    // Write to local storage safely with lastError suppressors
    chrome.storage.local.set({
      sunoSyncedData: {
        songs: syncedTracksList,
        workspaces: syncedWorkspaces,
        lastUpdated: Date.now()
      }
    }, () => {
      const tempErr = chrome.runtime.lastError;
    });

    chrome.runtime.sendMessage({
      type: "SYNC_SONG_METADATA",
      payload: {
        songs: syncedTracksList,
        workspaces: syncedWorkspaces
      }
    }, () => {
      const tempErr = chrome.runtime.lastError;
    });
  } catch (e) {}
}

// 3. Real-time DOM Scraper Scheduler
function startScrapingGeneratedTracks() {
  scraperIntervalId = setInterval(() => {
    // If context is invalidated, clear interval and exit
    if (!isExtensionContextValid()) {
      console.log("[CreAibox Connector] Scraper detected invalidated context. Cleaning scraper interval.");
      if (scraperIntervalId) {
        clearInterval(scraperIntervalId);
        scraperIntervalId = null;
      }
      return;
    }
    runScrapeAndSend();
  }, 4000); // Poll metadata every 4 seconds
}

// 4. Force Scrape Listener
if (isExtensionContextValid()) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isExtensionContextValid()) return;

    if (message.type === "FORCE_TRIGGER_SCRAPE") {
      console.log("[CreAibox Connector] Force sync scrape requested from dashboard.");
      runScrapeAndSend();
      sendResponse({ executed: true });
    }
    return true;
  });
}

// Initial setup
window.addEventListener("load", () => {
  setTimeout(() => {
    applyPrefillData();
    startScrapingGeneratedTracks();
  }, 1500);
});
