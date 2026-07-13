// content-suno.js - Injected into Suno.com

console.log("[CreAibox Suno Connector] content-suno.js script injected.");

// Scraper scheduler reference
let scraperIntervalId = null;
let globalAccumulatedSongs = [];

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

// Helper function to extract UUID from a hyperlink URL string
function extractClipUuid(url) {
  if (!url) return "";
  const match = url.match(/\/(song|clip)\/([a-f0-9\-]{36})/i);
  return match ? match[2] : "";
}

// Helper to resolve distributed Suno CDN stream urls based on dynamic image domains
function buildDirectStreamUrl(clipId, imgEl, audioEl) {
  if (audioEl && audioEl.src && !audioEl.src.startsWith("blob:")) {
    return audioEl.src;
  }
  
  let baseCdn = "https://cdn1.suno.ai";
  if (imgEl && imgEl.src) {
    const urlStr = imgEl.src;
    if (urlStr.includes("suno.ai") || urlStr.includes("suno.co") || urlStr.includes("suno.zone")) {
      const match = urlStr.match(/^(https?:\/\/[^\/]+)/i);
      if (match) {
        baseCdn = match[1];
      }
    }
  }
  return `${baseCdn}/${clipId}.mp3`;
}

// Helper to parse clean titles from target elements
function extractSongTitle(el) {
  const candidates = el.querySelectorAll('a, h4, h5, [class*="title"], [class*="Title"], [class*="songName"], [class*="trackName"]');
  for (let cand of candidates) {
    const txt = cand.innerText ? cand.innerText.trim() : "";
    if (txt && !txt.includes('\n') && txt.length > 1 && txt.length < 90 && 
        !["play", "pause", "songs", "lyrics", "create", "workspace", "complete", "generating", "remix", "share"].includes(txt.toLowerCase())) {
      return txt;
    }
  }
  return "";
}

// Scrape songs in the current loaded folder view
function scrapeSongsInCurrentFolder(workspaceId) {
  const currentUrl = window.location.href;
  const isValidScrapeRoute = currentUrl.includes("/create") || currentUrl.includes("/library") || currentUrl.includes("wid=");
  const isDiscoverOrHome = currentUrl.includes("/discover") || currentUrl.includes("/explore") || 
                            (!currentUrl.includes("wid=") && !currentUrl.includes("/library") && !currentUrl.includes("/create"));
  
  // CRITICAL BYPASS: Never scrape recommended songs from general discover or landing home views
  if (isDiscoverOrHome || !isValidScrapeRoute) {
    console.log("[CreAibox Scraper] Bypassing song scraping on non-personal home/discover screens.");
    return [];
  }

  const tracksList = [];
  const processedIds = new Set();

  const leafNodes = document.querySelectorAll('*');
  const allBadges = [];
  leafNodes.forEach(el => {
    if (el.children.length > 0) return;
    const txt = el.innerText ? el.innerText.trim() : "";
    if (txt.startsWith("v5") || txt.startsWith("v4") || txt === "v5.5 Preview" || txt === "v5.5") {
      allBadges.push(el);
    }
  });

  allBadges.forEach((badge, idx) => {
    let parentRow = badge.closest('div[class*="Row"], div[class*="row"], div[class*="Card"], div[class*="card"], tr, li, [role="row"]');
    if (!parentRow) {
      parentRow = badge.parentElement?.parentElement;
    }
    if (!parentRow) return;

    // Check if closest card/row text contains platform curated labels, skip those songs
    const rowText = parentRow.innerText || "";
    if (rowText.includes("Suno •") || rowText.includes("suno •") || rowText.includes("Discover") || rowText.includes("Curated")) {
      return;
    }

    let titleText = "";
    const childNodes = Array.from(parentRow.querySelectorAll('div, span, p, h4, h5, a'));
    for (let node of childNodes) {
      const txt = node.innerText ? node.innerText.trim() : "";
      if (txt === badge.innerText.trim()) continue;
      if (/^\d{1,2}:\d{2}$/.test(txt)) continue;
      if (txt.includes('\n')) continue;
      if (txt.length > 1 && txt.length < 80 && !["play", "pause", "remix", "share", "liked", "public", "songs", "lyrics"].includes(txt.toLowerCase())) {
        titleText = txt;
        break;
      }
    }

    if (!titleText || titleText.length < 2) return;

    let clipUuid = "";
    const rowLinks = parentRow.querySelectorAll('a');
    for (let rl of rowLinks) {
      const parsed = extractClipUuid(rl.href);
      if (parsed) {
        clipUuid = parsed;
        break;
      }
    }

    const songId = clipUuid ? `suno_synced_${clipUuid}` : `suno_synced_${idx}_${titleText.replace(/\s+/g, '_')}`;
    if (processedIds.has(songId)) return;
    processedIds.add(songId);

    let duration = "3:00";
    const durationNode = Array.from(parentRow.querySelectorAll('*')).find(el => el.children.length === 0 && /^\d{1,2}:\d{2}$/.test(el.innerText?.trim() || ""));
    if (durationNode) {
      duration = durationNode.innerText.trim();
    }

    const imgEl = parentRow.querySelector('img');
    const audioEl = parentRow.querySelector('audio');
    
    let status = "complete";
    if (parentRow.querySelector('[class*="loading"], [class*="spinner"], [class*="Generating"], [class*="progress"]')) {
      status = "generating";
    }

    const finalAudioUrl = clipUuid ? buildDirectStreamUrl(clipUuid, imgEl, audioEl) : (audioEl ? audioEl.src : "https://cdn.creaibox.com/music/General_Audio/General/morning_sunlight_slow_creaibox.mp3");

    tracksList.push({
      id: songId,
      title: titleText,
      tags: "electronic, pop",
      prompt: "Suno synced style tracks from real account session",
      audioUrl: finalAudioUrl,
      imageUrl: imgEl ? imgEl.src : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80",
      status: status,
      createdAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      duration: duration,
      workspaceId: workspaceId,
      isLiked: idx % 2 === 0,
      isPublic: idx % 3 === 0,
      likeCount: idx * 4
    });
  });

  return tracksList;
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
    
    // Curated playlists names and system keywords blocklist
    const BLOCKED_KEYWORDS = [
      "Create New Workspace", "nameamusic", "Workspaces", "Archived", "Library", 
      "Home", "Explore", "Studio", "Create", "Curated Collections", 
      "Make any song you can imagine", "Fireworks and BBQ", "Songs to Remix", 
      "Pass The Aux", "Pass the Aux", "Undefeated", "Romantic", "Trending", "For You", 
      "Made with Studio", "Because you like", "New Releases", "Showcase"
    ];

    anchors.forEach(el => {
      const text = el.innerText || "";
      
      // Skip folders that carry the public curated list creators
      if (text.includes("Suno •") || text.includes("suno •") || text.includes("Suno  •")) {
        return;
      }

      if (text.includes("Songs") && (text.includes("·") || text.includes("•") || text.includes("ago") || text.includes(" 최신"))) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          const folderName = lines[0];
          
          const isBlocked = BLOCKED_KEYWORDS.some(blocked => 
            folderName.toLowerCase().includes(blocked.toLowerCase())
          );
          if (isBlocked || folderName.length > 50) {
            return;
          }

          const statsLine = lines[1];
          const songCountMatch = statsLine.match(/(\d+)\s*Songs/i);
          const songCount = songCountMatch ? parseInt(songCountMatch[1], 10) : 0;
          
          let timeAgo = "최근";
          if (statsLine.includes("·")) {
            timeAgo = statsLine.split("·")[1]?.trim() || "최근";
          } else if (statsLine.includes("•")) {
            timeAgo = statsLine.split("•")[1]?.trim() || "최근";
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

          folderMap.set(workspaceId, {
            id: workspaceId,
            name: folderName,
            songCount: songCount,
            updatedAt: timeAgo
          });
        }
      }
    });

    const syncedWorkspaces = Array.from(folderMap.values());
    
    // Scrape songs for the currently loaded workspace ID
    const firstRealFolderId = syncedWorkspaces.length > 0 ? syncedWorkspaces[0].id : "ws_2";
    const currentWorkspaceId = activeWid || firstRealFolderId;
    
    const currentFolderSongs = scrapeSongsInCurrentFolder(currentWorkspaceId);

    // Merge current scraping result with globally accumulated songs to maintain total cache state
    currentFolderSongs.forEach(song => {
      if (!globalAccumulatedSongs.some(existing => existing.id === song.id)) {
        globalAccumulatedSongs.push(song);
      }
    });

    if (globalAccumulatedSongs.length === 0 && currentFolderSongs.length > 0) {
      globalAccumulatedSongs = [...currentFolderSongs];
    }

    if (globalAccumulatedSongs.length === 0) {
      console.log("[CreAibox Scraper] Throttled or found 0 songs. Retaining previous storage cache to prevent blanks.");
      return;
    }

    console.log("[CreAibox Connector] Dispatching synced data payload size:", globalAccumulatedSongs.length);
    
    if (!isExtensionContextValid()) return;

    // Write to local storage safely with lastError suppressors
    chrome.storage.local.set({
      sunoSyncedData: {
        songs: globalAccumulatedSongs,
        workspaces: syncedWorkspaces,
        lastUpdated: Date.now()
      }
    }, () => {
      const tempErr = chrome.runtime.lastError;
    });

    chrome.runtime.sendMessage({
      type: "SYNC_SONG_METADATA",
      payload: {
        songs: globalAccumulatedSongs,
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
    if (!isExtensionContextValid()) {
      console.log("[CreAibox Connector] Scraper detected invalidated context. Cleaning scraper interval.");
      if (scraperIntervalId) {
        clearInterval(scraperIntervalId);
        scraperIntervalId = null;
      }
      return;
    }
    runScrapeAndSend();
  }, 6500); // Poll metadata every 6.5 seconds
}

// 4. Batch Scraper: Auto Navigate & Rotation Scan through all Workspace Folders
function startBatchFolderSyncRotation() {
  if (!isExtensionContextValid()) return;

  const BLOCKED_KEYWORDS = [
    "Create New Workspace", "nameamusic", "Workspaces", "Archived", "Library", 
    "Home", "Explore", "Studio", "Create", "Curated Collections", 
    "Make any song you can imagine", "Fireworks and BBQ", "Songs to Remix", 
    "Pass The Aux", "Pass the Aux", "Undefeated", "Romantic", "Trending", "For You", 
    "Made with Studio", "Because you like", "New Releases", "Showcase"
  ];

  const folderElements = Array.from(document.querySelectorAll('a, div')).filter(el => {
    const text = el.innerText || "";
    
    if (text.includes("Suno •") || text.includes("suno •") || text.includes("Suno  •")) {
      return false;
    }

    if (text.includes("Songs") && (text.includes("·") || text.includes("•") || text.includes("ago") || text.includes(" 최신"))) {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 0) {
        const name = lines[0];
        const isBlocked = BLOCKED_KEYWORDS.some(blocked => name.toLowerCase().includes(blocked.toLowerCase()));
        return !isBlocked && name.length < 50;
      }
    }
    return false;
  });

  if (folderElements.length === 0) {
    console.log("[CreAibox Rotation] Workspace list screen not detected or folders empty. Running single folder scan.");
    runScrapeAndSend();
    return;
  }

  console.log(`[CreAibox Rotation] Found ${folderElements.length} folders. Starting batch navigation sync loop...`);
  
  let folderIndex = 0;
  
  function scanNextFolder() {
    if (!isExtensionContextValid()) return;

    if (folderIndex >= folderElements.length) {
      console.log(`[CreAibox Rotation] All folders scanned successfully! Total songs: ${globalAccumulatedSongs.length}`);
      runScrapeAndSend();
      return;
    }

    const folderEl = folderElements[folderIndex];
    const folderName = folderEl.innerText.split('\n')[0];
    console.log(`[CreAibox Rotation] Processing folder [${folderIndex + 1}/${folderElements.length}]: ${folderName}`);
    
    folderEl.click();
    
    setTimeout(() => {
      let lastScrollHeight = 0;
      let sameHeightCount = 0;
      let scrollsCount = 0;
      const maxScrollAttempts = 30;
      
      const scrollInterval = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);
        
        let currentScrollHeight = document.body.scrollHeight;
        const scrollableDivs = document.querySelectorAll('div, main, [class*="scroll"], [class*="layout"]');
        scrollableDivs.forEach(div => {
          if (div.scrollHeight > div.clientHeight) {
            div.scrollTop = div.scrollHeight;
            if (div.scrollHeight > currentScrollHeight) {
              currentScrollHeight = div.scrollHeight;
            }
          }
        });

        if (currentScrollHeight === lastScrollHeight) {
          sameHeightCount++;
        } else {
          sameHeightCount = 0;
          lastScrollHeight = currentScrollHeight;
        }

        scrollsCount++;

        if (sameHeightCount >= 3 || scrollsCount >= maxScrollAttempts) {
          clearInterval(scrollInterval);
          
          const urlParams = new URLSearchParams(window.location.search);
          const activeWid = urlParams.get('wid') || '';
          const workspaceId = activeWid || folderName.replace(/\s+/g, '_');
          
          const folderSongs = scrapeSongsInCurrentFolder(workspaceId);
          console.log(`[CreAibox Rotation] Successfully scraped ${folderSongs.length} songs from ${folderName}`);
          
          folderSongs.forEach(song => {
            if (!globalAccumulatedSongs.some(existing => existing.id === song.id)) {
              globalAccumulatedSongs.push(song);
            }
          });

          folderIndex++;
          scanNextFolder();
        }
      }, 400);
    }, 1500);
  }

  chrome.storage.local.get("sunoSyncedData", (result) => {
    if (result && result.sunoSyncedData && result.sunoSyncedData.songs) {
      globalAccumulatedSongs = result.sunoSyncedData.songs;
    }
    scanNextFolder();
  });
}

// 4.5. Light Scraper: Scrapes only workspace folders from the sidebar/main screen and sends instantly
function runScrapeWorkspacesOnly() {
  if (!isExtensionContextValid()) return;

  try {
    const folderMap = new Map();
    const anchors = document.querySelectorAll('a, div');
    
    const BLOCKED_KEYWORDS = [
      "Create New Workspace", "nameamusic", "Workspaces", "Archived", "Library", 
      "Home", "Explore", "Studio", "Create", "Curated Collections", 
      "Make any song you can imagine", "Fireworks and BBQ", "Songs to Remix", 
      "Pass The Aux", "Pass the Aux", "Undefeated", "Romantic", "Trending", "For You", 
      "Made with Studio", "Because you like", "New Releases", "Showcase"
    ];

    anchors.forEach(el => {
      const text = el.innerText || "";
      
      if (text.includes("Suno •") || text.includes("suno •") || text.includes("Suno  •")) {
        return;
      }

      if (text.includes("Songs") && (text.includes("·") || text.includes("•") || text.includes("ago") || text.includes(" 최신"))) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          const folderName = lines[0];
          
          const isBlocked = BLOCKED_KEYWORDS.some(blocked => 
            folderName.toLowerCase().includes(blocked.toLowerCase())
          );
          if (isBlocked || folderName.length > 50) {
            return;
          }

          const statsLine = lines[1];
          const songCountMatch = statsLine.match(/(\d+)\s*Songs/i);
          const songCount = songCountMatch ? parseInt(songCountMatch[1], 10) : 0;
          
          let timeAgo = "최근";
          if (statsLine.includes("·")) {
            timeAgo = statsLine.split("·")[1]?.trim() || "최근";
          } else if (statsLine.includes("•")) {
            timeAgo = statsLine.split("•")[1]?.trim() || "최근";
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

          folderMap.set(workspaceId, {
            id: workspaceId,
            name: folderName,
            songCount: songCount,
            updatedAt: timeAgo
          });
        }
      }
    });

    const syncedWorkspaces = Array.from(folderMap.values());
    console.log("[CreAibox Connector] Folder-only sync complete. Folders count:", syncedWorkspaces.length);

    chrome.runtime.sendMessage({
      type: "SYNC_SONG_METADATA",
      payload: {
        workspaces: syncedWorkspaces
      }
    }, () => {
      const tempErr = chrome.runtime.lastError;
    });
  } catch (e) {}
}

// 5. Force Scrape Listener with Auto-Redirect Safeguard to sync cleanly from any page
if (isExtensionContextValid()) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isExtensionContextValid()) return;

    if (message.type === "FORCE_TRIGGER_SCRAPE") {
      const mode = message.payload?.mode || "current";
      const targetWid = message.payload?.workspaceId || "";
      const currentUrl = window.location.href;
      
      let cleanWid = targetWid;
      // Safeguard to translate initial mock workspace IDs to default My Workspace view
      if (targetWid === "ws_1" || targetWid === "ws_2" || targetWid === "ws_3" || targetWid === "ws_4" || targetWid === "ws_5" || !targetWid) {
        cleanWid = "default";
      }

      console.log(`[CreAibox Connector] Force sync requested. Mode: ${mode}. Target WID: ${cleanWid}. Current URL: ${currentUrl}`);
      
      // Check if we are on a valid workspaces list route and specifically matching the target workspace ID
      const hasCorrectWid = currentUrl.includes("wid=" + cleanWid) || 
                            (cleanWid === "default" && currentUrl.includes("/create") && !currentUrl.includes("wid="));
      const isOnValidSyncRoute = currentUrl.includes("/create") || currentUrl.includes("/library");

      if (!isOnValidSyncRoute || !hasCorrectWid) {
        console.log(`[CreAibox Connector] Not on target workspace route (WID: ${cleanWid}). Redirecting to create folder view...`);
        
        // 1. Save target sync command payload to temp chrome storage so we can auto-trigger it immediately upon page reload!
        chrome.storage.local.set({ 
          pendingSyncTrigger: { mode: mode, workspaceId: cleanWid, timestamp: Date.now() } 
        }, () => {
          // 2. Perform redirect
          window.location.href = "https://suno.com/create?wid=" + cleanWid;
        });
        
        sendResponse({ executed: true, redirected: true });
        return true;
      }

      // We are on a valid route - execute commands immediately!
      if (mode === "all") {
        console.log("[CreAibox Connector] Triggering batch workspaces scan...");
        startBatchFolderSyncRotation();
      } else if (mode === "folders") {
        console.log("[CreAibox Connector] Triggering folders-only fast scan...");
        runScrapeWorkspacesOnly();
      } else {
        console.log("[CreAibox Connector] Triggering fast single-folder scan on current active page...");
        let lastScrollHeight = 0;
        let sameHeightCount = 0;
        let scrollsCount = 0;
        const maxScrollAttempts = 35;
        
        const scrollInterval = setInterval(() => {
          if (!isExtensionContextValid()) {
            clearInterval(scrollInterval);
            return;
          }
          
          window.scrollTo(0, document.body.scrollHeight);
          
          let currentScrollHeight = document.body.scrollHeight;
          const scrollableDivs = document.querySelectorAll('div, main, [class*="scroll"], [class*="layout"]');
          scrollableDivs.forEach(div => {
            if (div.scrollHeight > div.clientHeight) {
              div.scrollTop = div.scrollHeight;
              if (div.scrollHeight > currentScrollHeight) {
                currentScrollHeight = div.scrollHeight;
              }
            }
          });

          if (currentScrollHeight === lastScrollHeight) {
            sameHeightCount++;
          } else {
            sameHeightCount = 0;
            lastScrollHeight = currentScrollHeight;
          }

          scrollsCount++;

          if (sameHeightCount >= 3 || scrollsCount >= maxScrollAttempts) {
            clearInterval(scrollInterval);
            console.log(`[CreAibox Scraper] Single folder scroll finish. Scraped in ${scrollsCount} attempts.`);
            setTimeout(() => {
              runScrapeAndSend();
            }, 500);
          }
        }, 400);
      }
      
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

    // Check if there is a pending sync trigger redirected from another screen
    if (isExtensionContextValid()) {
      chrome.storage.local.get("pendingSyncTrigger", (result) => {
        const err = chrome.runtime.lastError;
        if (err) return;

        if (result && result.pendingSyncTrigger) {
          const trigger = result.pendingSyncTrigger;
          // Check timestamp freshness (must be under 15 seconds old to prevent loops)
          if (Date.now() - trigger.timestamp < 15000) {
            console.log("[CreAibox Connector] Resuming pending sync request from redirect:", trigger.mode);
            
            // Safe cleanup first
            chrome.storage.local.remove("pendingSyncTrigger");
            
            // Execute target mode
            setTimeout(() => {
              if (trigger.mode === "all") {
                startBatchFolderSyncRotation();
              } else if (trigger.mode === "folders") {
                runScrapeWorkspacesOnly();
              } else {
                runScrapeAndSend();
              }
            }, 1000);
          } else {
            chrome.storage.local.remove("pendingSyncTrigger");
          }
        }
      });
    }
  }, 1500);
});
