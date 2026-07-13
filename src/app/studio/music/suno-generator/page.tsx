"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Music, Sparkles, Wand2, RefreshCw, AlertTriangle, CheckCircle, 
  HelpCircle, Play, Pause, Download, Folder, Radio, Mic2,
  Layers, ChevronDown, ChevronRight, ChevronLeft, FolderOpen, ListMusic, FileAudio, 
  Image as ImageIcon, Dice5, DownloadCloud, MoreVertical,
  Plus, Trash2, Share2, Clipboard, Edit3, Heart, Radio as RadioIcon,
  PlayCircle, MoreHorizontal, X, ExternalLink, Volume2, SkipBack,
  SkipForward, Maximize2, FileText, Compass, Home, Library as LibraryIcon,
  Smile, User, Zap, RefreshCcw, Search, Sliders
} from "lucide-react";

interface SunoSong {
  id: string;
  title: string;
  tags: string;
  prompt: string;
  audioUrl: string;
  wavUrl?: string;
  imageUrl: string; 
  status: "complete" | "generating" | "failed";
  createdAt: string;
  duration?: string;
  workspaceId: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPublic?: boolean;
  isUpload?: boolean;
  likeCount?: number;
}

interface Workspace {
  id: string;
  name: string;
  songCount: number;
  updatedAt: string;
  isAlbum?: boolean;
}

// Synced lyrics database for selected song details view
const SONG_LYRICS_DB: Record<string, string> = {
  suno_mock_1: `[Intro]
(Dramatic taiko drum rolling)
Heroic brass fanfare rising...

[Verse 1]
Standing tall on the boundary line
In the shadow of the ancient drum
We wait for the signal in the sky
Our hearts beat as one

[Chorus]
Taiko strikes! The battle line holds!
With armor of brass and stories untold!
We ride, we fight, we never back down
Till the dawn light covers the town!

[Outro]
Final horns fade into mist...`,
  suno_mock_2: `[Intro]
(Gentle acoustic guitar breeze)
Waves washing on the sand...

[Verse 1]
Walking down the sandy path
Where the sunset meets the blue
Every wave that hits the shore
Brings me back to you

[Chorus]
Along the coastline, we go slow
Underneath the orange glow
No worries in our mind today
Just the ocean wash it away...

[Outro]
Acoustic picking fades out...`,
  suno_mock_3: `[Intro]
(Mysterious Celtic bell chimes)
Flute echo in the deep forest...

[Verse 1]
Under the canopy of green and gold
A quiet spring begins to grow
Secrets of the older worlds
whispering in the stream below

[Chorus]
Oh enchanted lake, guide my hand
Lead me back to the peaceful land
Under the moon we drift so free
In this ancient fantasy

[Outro]
Bell chimes dissolve into silence...`,
  suno_mock_4: `[Intro]
(Fast epic cello arpeggios)
War drums pounding...

[Chorus]
For the crown, we stand together!
Through the thunder and stormy weather!
The war of fate has just begun
We will hold until the sun!

[Verse 1]
Swords clash in the cold night
Shields holding the heavy fight
No retreat, we hear the cry
Underneath the darkened sky!`
};

export default function SunoGeneratorPage() {
  const [extensionActive, setExtensionActive] = useState<boolean>(false);
  const [checkingExtension, setCheckingExtension] = useState<boolean>(true);
  
  // Generation Form States
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [lyricsMode, setLyricsMode] = useState<"write" | "prompt" | "instrumental">("instrumental");
  const [customLyrics, setCustomLyrics] = useState<string>("");
  const [styleTags, setStyleTags] = useState<string>("");
  const [modelType, setModelType] = useState<string>("v4.5-all");
  
  // Advanced Controls (Accordion based)
  const [weirdness, setWeirdness] = useState<number>(50);
  const [styleInfluence, setStyleInfluence] = useState<number>(50);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState<boolean>(false);
  const [vocalGender, setVocalGender] = useState<"male" | "female" | "both">("female");
  
  // Magic states
  const [magicianActive, setMagicianActive] = useState<boolean>(false);
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Suno.com Filter & View States
  const [activeSort, setActiveSort] = useState<"newest" | "oldest" | "most-liked" | "least-liked">("newest");
  const [activeViewMode, setActiveViewMode] = useState<"list" | "waveform" | "grid">("list");
  
  // Shortcut segment toggles
  const [likedFilterOnly, setLikedFilterOnly] = useState<boolean>(false);
  const [publicFilterOnly, setPublicFilterOnly] = useState<boolean>(false);
  const [uploadsFilterOnly, setUploadsFilterOnly] = useState<boolean>(false);
  
  // Dropdown menus visibility
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);
  const [isSyncMenuOpen, setIsSyncMenuOpen] = useState<boolean>(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState<boolean>(false);

  // Detailed Filters Checked States
  const [filterLiked, setFilterLiked] = useState<boolean>(false);
  const [filterDisliked, setFilterDisliked] = useState<boolean>(false);
  const [filterPublic, setFilterPublic] = useState<boolean>(false);
  const [filterPrivate, setFilterPrivate] = useState<boolean>(false);
  const [filterUploads, setFilterUploads] = useState<boolean>(false);
  const [filterFullSongs, setFilterFullSongs] = useState<boolean>(false);
  const [filterCovers, setFilterCovers] = useState<boolean>(false);
  const [filterExtensions, setFilterExtensions] = useState<boolean>(false);
  const [filterVoices, setFilterVoices] = useState<boolean>(false);
  const [filterRemasters, setFilterRemasters] = useState<boolean>(false);
  const [filterHideDisliked, setFilterHideDisliked] = useState<boolean>(true);
  const [filterHideStems, setFilterHideStems] = useState<boolean>(true);
  const [filterHideClips, setFilterHideClips] = useState<boolean>(true);
  
  // Workspace State
  // Workspace State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>("");
  const [workspaceMenuId, setWorkspaceMenuId] = useState<string | null>(null);

  // Selected song for the Right Aside Info panel
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  // Bottom Audio Player states
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ref to hold the latest active workspace ID to prevent React Hook size mismatch on Fast Refresh
  const activeWorkspaceIdRef = useRef<string>(activeWorkspaceId);
  useEffect(() => {
    activeWorkspaceIdRef.current = activeWorkspaceId;
  }, [activeWorkspaceId]);

  // Ref to track if client-side mount has completed before enabling localStorage writes
  const isMountedRef = useRef<boolean>(false);

  // Dynamic Workspace Resizing & Collapse States
  const [workspaceWidth, setWorkspaceWidth] = useState<number>(240);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Calculate dynamic width based on cursor position relative to left columns (224px sidebar + 370px control form)
      const newWidth = Math.max(160, Math.min(480, e.clientX - 594));
      setWorkspaceWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Suno Model Definition mapping
  const SUNO_MODELS = [
    { value: "v5.5", label: "v5.5 Pro", desc: "Powers Voices, Custom Models and My Taste" },
    { value: "v5", label: "v5 Pro", desc: "Authentic vocals, superior audio quality and control" },
    { value: "v4.5+", label: "v4.5+ Pro", desc: "Advanced creation methods" },
    { value: "v4.5", label: "v4.5 Pro", desc: "Intelligent prompts" },
    { value: "v4.5-all", label: "v4.5-all (기본)", desc: "Best free model" },
    { value: "v4", label: "v4 Pro", desc: "Improved sound quality" }
  ];

  // Comprehensive recommend style list from screenshots (Horizontal Scrolling Chips)
  const SUGGESTED_CHIPS = [
    "anime pop", "alternativ", "soft punk", "vibraphone melody", "bardic",
    "trompet", "nylon guitar", "brit rock", "minimalist drums", "k-pop group",
    "movie score", "italodisco", "rock blues", "cosmic soundscapes", "tight kicks",
    "aggressive hip hop", "drumandbass", "soulful r&b", "ambient pads", "funk slap bass"
  ];

  // Random presets for Re-roll option
  const RANDOM_STYLE_PRESETS = [
    "liquid drum and bass, atmospheric chords, soothing synth pads, 174 bpm",
    "cozy café acoustic guitar, slow brush snare, warm upright bass, lazy afternoon vibe",
    "cinematic hybrid orchestral theme, powerful brass, staccato strings, massive build-up",
    "chill synthwave, retro 80s drums, nostalgic analog leads, night drive speed 110 bpm",
    "energetic future bass drop, chopped vocal chops, bright positive chords, party energy",
    "minimal lo-fi hip hop beat, dust crackle vinyl, mellow electric piano, chill study mood"
  ];

  // Songs state (with Suno cover art URL placeholders and filter attributes)
  const [songs, setSongs] = useState<SunoSong[]>([]);

  // Active Dropdowns state per song
  const [downloadDropdownId, setDownloadDropdownId] = useState<string | null>(null);
  const [contextMenuSongId, setContextMenuSongId] = useState<string | null>(null);
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState<boolean>(false);

  // Rename song modal state
  const [editingSong, setEditingSong] = useState<SunoSong | null>(null);
  const [editTitleInput, setEditTitleInput] = useState<string>("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genProgress, setGenProgress] = useState<string>("");

  // Setup audio DOM updates
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  // Update volume change on ref
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load prefill data from Music Library redirections (One-Stop Workflow)
  useEffect(() => {
    try {
      const rawPrefill = sessionStorage.getItem("suno_prefill");
      if (rawPrefill) {
        const data = JSON.parse(rawPrefill);
        if (data.prompt) {
          setPrompt(data.prompt);
        }
        if (data.lyrics) {
          setCustomLyrics(data.lyrics);
        }
        if (data.lyricsMode) {
          setLyricsMode(data.lyricsMode);
          // If lyrics exist, open Advanced options and toggle More Options accordion
          if (data.lyricsMode === "write") {
            setIsAdvanced(true);
            setIsMoreOptionsOpen(true);
          }
        }
        sessionStorage.removeItem("suno_prefill");
      }
    } catch (err) {
      console.error("Failed to parse suno prefill payload:", err);
    }
  }, []);

  // Playback control functions
  const playTrack = (song: SunoSong) => {
    if (!audioRef.current) return;

    if (playingSongId === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setPlayingSongId(song.id);
        setSelectedSongId(song.id); 
      }).catch(err => console.log("Audio play request failed: ", err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Skip tracks forward/backward
  const handleSkip = (direction: "forward" | "backward") => {
    if (filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === playingSongId);
    let nextIndex = 0;

    if (direction === "forward") {
      nextIndex = currentIndex + 1 >= filteredSongs.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? filteredSongs.length - 1 : currentIndex - 1;
    }

    const nextSong = filteredSongs[nextIndex];
    if (nextSong) {
      playTrack(nextSong);
    }
  };

  // Convert time duration
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 🪄 Prompt Magician (Enhance Style tags)
  const handlePromptMagic = async () => {
    if (!prompt.trim()) return;
    setMagicianActive(true);

    setTimeout(() => {
      const decorations = [
        "analog hardware warmth, pristine clarity, dynamic shifts, building layer by layer, definitive outro",
        "detailed arrangement, studio mix mastering, acoustic resonance, warm low-end bass",
        "lush atmospheric reverb, crystal bell chimes, organic instrumentation, smooth transitions"
      ];
      const randomDeco = decorations[Math.floor(Math.random() * decorations.length)];
      setPrompt(prev => {
        const base = prev.split(",")[0].trim();
        return `${base}, ${randomDeco}`;
      });
      setMagicianActive(false);
    }, 850);
  };

  // 🎲 Style Re-roll
  const handleReRollStyle = () => {
    const randomPreset = RANDOM_STYLE_PRESETS[Math.floor(Math.random() * RANDOM_STYLE_PRESETS.length)];
    setPrompt(randomPreset);
  };

  // Append clicked chip tag into prompt input box
  const handleAppendStyleChip = (chip: string) => {
    setPrompt(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return chip;
      
      const tagsArray = trimmed.split(",").map(t => t.trim().toLowerCase());
      if (tagsArray.includes(chip.toLowerCase())) return prev;

      return `${trimmed}, ${chip}`;
    });
  };

  // Clipboard Copier
  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text);
    alert(successMessage);
  };

  // Workspace Create Handler
  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    const newWs: Workspace = {
      id: `ws_${Date.now()}`,
      name: newWorkspaceName.trim(),
      songCount: 0,
      updatedAt: "방금 전"
    };
    setWorkspaces(prev => [newWs, ...prev]);
    setActiveWorkspaceId(newWs.id);
    setNewWorkspaceName("");
    setIsCreatingWorkspace(false);
  };

  // Workspace Delete Handler
  const handleDeleteWorkspace = (wsId: string) => {
    const defaultWs = workspaces.find(w => w.id !== wsId);
    if (!defaultWs) {
      alert("최소 하나의 폴더는 보존되어야 합니다.");
      return;
    }
    
    setSongs(prev => prev.filter(s => s.workspaceId !== wsId));
    setWorkspaces(prev => prev.filter(w => w.id !== wsId));
    setActiveWorkspaceId(defaultWs.id);
    setWorkspaceMenuId(null);
    alert("워크스페이스 폴더가 삭제(Move to Trash)되었습니다.");
  };

  // Single Song Context Actions
  const handleSongContextAction = (action: string, song: SunoSong) => {
    setContextMenuSongId(null);
    
    if (action === "remix") {
      setPrompt(song.prompt);
      alert(`"${song.title}"의 스타일 프롬프트를 복사하여 입력창에 로드했습니다.`);
    } else if (action === "share") {
      const mockShareUrl = `https://creaibox.com/shared/suno/${song.id}`;
      copyToClipboard(mockShareUrl, "공유 링크가 클립보드에 복사되었습니다!");
    } else if (action === "edit") {
      setEditingSong(song);
      setEditTitleInput(song.title);
    } else if (action === "delete") {
      setSongs(prev => prev.filter(s => s.id !== song.id));
      setWorkspaces(prev => prev.map(w => w.id === song.workspaceId ? { ...w, songCount: Math.max(0, w.songCount - 1) } : w));
      if (selectedSongId === song.id) setSelectedSongId(null);
      if (playingSongId === song.id) {
        audioRef.current?.pause();
        setPlayingSongId(null);
        setIsPlaying(false);
      }
      alert(`"${song.title}" 트랙이 삭제되었습니다.`);
    } else if (action === "copy_prompt") {
      copyToClipboard(song.prompt, "스타일 프롬프트가 클립보드에 복사되었습니다!");
    }
  };

  // Save renamed song title
  const handleSaveTitle = () => {
    if (!editingSong || !editTitleInput.trim()) return;
    setSongs(prev => prev.map(s => s.id === editingSong.id ? { ...s, title: editTitleInput.trim() } : s));
    setEditingSong(null);
  };

  // Filter songs by selected workspace, search query, dropdown filters, and segment shortcut chips
  const filteredSongs = songs
    .filter(s => {
      // 1. Flexible Workspace Folder filter with global exposure for synced Suno tracks
      const activeFolder = workspaces.find(w => w.id === activeWorkspaceId);
      const songFolder = workspaces.find(w => w.id === s.workspaceId);
      
      const isDemoMock = s.id.startsWith("suno_mock_");
      
      const isMatchedWorkspace = 
        s.workspaceId === activeWorkspaceId ||
        (activeFolder && songFolder && activeFolder.name === songFolder.name) ||
        (activeWorkspaceId.includes("ws_") && s.workspaceId.includes("ws_") && activeWorkspaceId === s.workspaceId) ||
        isDemoMock; // Expose demo mock tracks globally to prevent empty layouts
        
      if (!isMatchedWorkspace) return false;

      // 2. Search Query filter
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesQuery = 
          s.title.toLowerCase().includes(query) ||
          s.prompt.toLowerCase().includes(query) ||
          s.tags.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 3. Segment shortcut toggles
      if (likedFilterOnly && !s.isLiked) return false;
      if (publicFilterOnly && !s.isPublic) return false;
      if (uploadsFilterOnly && !s.isUpload) return false;

      // 4. Detailed Filters Checklist
      if (filterLiked && !s.isLiked) return false;
      if (filterDisliked && !s.isDisliked) return false;
      if (filterPublic && !s.isPublic) return false;
      if (filterPrivate && s.isPublic) return false; // Private = not public
      if (filterUploads && !s.isUpload) return false;

      // Detailed Hiding Filters
      if (filterHideDisliked && s.isDisliked) return false;

      return true;
    })
    .sort((a, b) => {
      // Apply Suno Sort Criteria
      if (activeSort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (activeSort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (activeSort === "most-liked") {
        const aLikes = a.likeCount || (a.isLiked ? 10 : 0);
        const bLikes = b.likeCount || (b.isLiked ? 10 : 0);
        return bLikes - aLikes;
      }
      if (activeSort === "least-liked") {
        const aLikes = a.likeCount || (a.isLiked ? 10 : 0);
        const bLikes = b.likeCount || (b.isLiked ? 10 : 0);
        return aLikes - bLikes;
      }
      return 0;
    });
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const selectedSong = songs.find(s => s.id === selectedSongId);
  const playingSong = songs.find(s => s.id === playingSongId);

  // Bulk folder download dropdown handler
  const handleBulkFolderDownload = (type: "mp3" | "wav" | "cover") => {
    let triggeredCount = 0;
    
    filteredSongs.forEach((song, index) => {
      let downloadUrl = "";
      let extension = "";

      if (type === "mp3") {
        downloadUrl = song.audioUrl;
        extension = ".mp3";
      } else if (type === "wav") {
        downloadUrl = song.wavUrl || "";
        extension = ".wav";
      } else if (type === "cover") {
        downloadUrl = song.imageUrl;
        extension = "_cover.jpg";
      }

      if (!downloadUrl) return;

      triggeredCount++;
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${song.title.replace(/\s+/g, "_")}${extension}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 250);
    });

    if (triggeredCount > 0) {
      alert(`폴더 내 총 ${triggeredCount}개 트랙의 ${type.toUpperCase()} 자산에 대해 순차 일괄 다운로드를 시작합니다.`);
    } else {
      alert("다운로드할 수 있는 파일이 없습니다.");
    }
    setBulkDropdownOpen(false);
  };

  // Trigger Suno Generator Request
  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenProgress("Suno 작업 전송 중...");

    window.postMessage({
      type: "TRIGGER_SUNO_GENERATION",
      payload: {
        prompt,
        lyricsMode,
        lyricsText: lyricsMode === "write" ? customLyrics : "",
        tags: styleTags,
        model: modelType,
        vocalGender,
        advanced: {
          weirdness,
          styleInfluence
        }
      }
    }, "*");

    // Mock simulator fallback
    if (!extensionActive) {
      setTimeout(() => setGenProgress("Suno 작곡 스케치 중... (데모)"), 1000);
      setTimeout(() => setGenProgress("오디오 믹싱 렌더링 중... (60%)"), 3000);
      setTimeout(() => {
        setIsGenerating(false);
        setGenProgress("");
        
        const arts = [
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80",
          "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=150&q=80"
        ];

        const newDemoSong: SunoSong = {
          id: `suno_demo_${Date.now()}`,
          title: prompt.split(" ").slice(0, 2).join(" ") || "Autumn Leaves",
          tags: styleTags || "anime pop, soft punk",
          prompt: prompt,
          audioUrl: "https://cdn.creaibox.com/music/General_Audio/General/morning_sunlight_slow_creaibox.mp3",
          wavUrl: "https://cdn.creaibox.com/music/General_Audio/General/morning_sunlight_slow_creaibox.mp3",
          imageUrl: arts[Math.floor(Math.random() * arts.length)],
          status: "complete",
          createdAt: new Date().toISOString(),
          duration: "3:10",
          workspaceId: activeWorkspaceId
        };
        setSongs(prev => [newDemoSong, ...prev]);
        
        // Update song count of active workspace
        setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, songCount: w.songCount + 1 } : w));
      }, 5000);
    }
  };

  // Synchronize workspaces and songs state to localStorage to prevent resets on routing or refresh
  useEffect(() => {
    if (!isMountedRef.current) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("creaibox_suno_workspaces", JSON.stringify(workspaces));
    }
  }, [workspaces]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("creaibox_suno_songs", JSON.stringify(songs));
    }
  }, [songs]);

  // Load cached workspaces and songs on client-side mount to prevent SSR Hydration mismatches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWS = localStorage.getItem("creaibox_suno_workspaces");
      if (savedWS) {
        try {
          setWorkspaces(JSON.parse(savedWS));
        } catch (e) {}
      }
      const savedSongs = localStorage.getItem("creaibox_suno_songs");
      if (savedSongs) {
        try {
          setSongs(JSON.parse(savedSongs));
        } catch (e) {}
      }
      // Set mounting complete to enable subsequent state saves
      isMountedRef.current = true;
    }
  }, []);

  // Close dropdowns and listen to real-time Chrome Extension sync messages
  useEffect(() => {
    const closeAll = () => {
      setDownloadDropdownId(null);
      setBulkDropdownOpen(false);
      setWorkspaceMenuId(null);
      setContextMenuSongId(null);
      setIsFilterMenuOpen(false);
      setIsSortMenuOpen(false);
      setIsViewMenuOpen(false);
      setIsSyncMenuOpen(false);
    };

    const handleExtensionSyncMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SUNO_SYNCED_METADATA") {
        const payload = event.data.payload;
        console.log("[CreAibox React] Received synced workspace payload:", payload);
        
        if (payload.workspaces && payload.workspaces.length > 0) {
          setWorkspaces(prev => {
            const workspaceMap = new Map<string, Workspace>();
            // 1. Seed existing folders first (preserving cached list)
            prev.forEach(w => workspaceMap.set(w.id, w));
            // 2. Add or update with incoming folder items
            payload.workspaces.forEach((w: Workspace) => {
              workspaceMap.set(w.id, w);
            });
            return Array.from(workspaceMap.values());
          });
          const currentId = activeWorkspaceIdRef.current;
          // Look for active in accumulated list
          setWorkspaces(currWorkspaces => {
            const hasActive = currWorkspaces.some((w: Workspace) => w.id === currentId);
            if (!hasActive && payload.workspaces[0]) {
              setActiveWorkspaceId(payload.workspaces[0].id);
            }
            return currWorkspaces;
          });
        }
        // Perform Map-based Upsert to continuously accumulate scraped tracks (supporting duplicate titles and infinite scroll)
        if (payload.songs && payload.songs.length > 0) {
          setSongs(prev => {
            const songMap = new Map<string, SunoSong>();
            // 1. Seed existing songs first
            prev.forEach(s => songMap.set(s.id, s));
            // 2. Overwrite or append with incoming synced tracks
            payload.songs.forEach((newSong: SunoSong) => {
              songMap.set(newSong.id, newSong);
            });
            return Array.from(songMap.values());
          });
        }
        setExtensionActive(true);
      }
    };

    window.addEventListener("click", closeAll);
    window.addEventListener("message", handleExtensionSyncMessage);

    return () => {
      window.removeEventListener("click", closeAll);
      window.removeEventListener("message", handleExtensionSyncMessage);
    };
  }, []);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] w-full flex flex-col overflow-hidden bg-[#070a13] text-slate-200 font-sans relative">
      
      {/* Upper Main Area container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. Left Sidebar */}
        <aside className="w-56 bg-[#04060c] border-r border-slate-900/60 p-4 flex flex-col justify-between flex-shrink-0 hidden md:flex select-none">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2 py-2">
              <span className="text-2xl font-black tracking-widest text-emerald-400">SUNO</span>
              <span className="text-[11px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold">Studio</span>
            </div>

            {/* Read-Only Live Account Indicator card (Synced with Suno session via extension) */}
            <div className="bg-[#0c111e]/80 border border-slate-900 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-300 font-bold border border-emerald-500/20 text-sm">
                  N
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-200 truncate">nameamusic</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 font-bold rounded">
                      40 Credits
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 font-semibold rounded">
                      Free Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5">
              <a 
                href="/studio" 
                className="flex items-center gap-3 px-3 py-3 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 rounded-xl transition text-[13px]"
              >
                <Home className="w-4.5 h-4.5" /> CreAibox 홈으로
              </a>
              <div className="flex items-center gap-3 px-3 py-3 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[13px]">
                <Sparkles className="w-4.5 h-4.5 text-emerald-400" /> Suno 곡 생성
              </div>
            </nav>

            {/* Suno Chrome Extension install button */}
            <div className="px-1 pt-1.5 space-y-1.5">
              <a
                href="https://chromewebstore.google.com/detail/creaibox-suno-connector/YOUR_EXTENSION_ID_PLACEHOLDER"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="크롬 웹 스토어에서 일부 공개용 커넥터 즉시 설치"
              >
                <Download className="w-4 h-4" />
                <span>Suno 커넥터 설치하기</span>
              </a>
              <p className="text-[10px] text-slate-500 leading-normal text-center">
                ※ 현재 크롬 웹스토어 심사 중입니다.<br/>심사 승인 완료 후 다운로드가 가능합니다.
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-900 pt-4 text-slate-400 text-[10px] font-medium leading-relaxed">
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>크롬 웹스토어 심사 진행 중</span>
            </div>
            <p className="text-slate-500 leading-normal">
              승인 완료 이후에 정식 연동 및 사용이 가능합니다. (로컬 테스트는 개발자 모드 로드로 즉시 가능)
            </p>
          </div>
        </aside>

        {/* 2. Control Form Column (Structured identically to Suno.com) */}
        <section className="w-[340px] md:w-[370px] bg-[#080b13] border-r border-slate-900/60 flex flex-col flex-shrink-0 overflow-y-auto scrollbar-none p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-emerald-400" /> 지시 옵션 설계
            </span>
            
            <div className="bg-[#04060c] p-0.5 rounded-lg border border-slate-855 flex">
              <button
                onClick={() => setIsAdvanced(false)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition ${
                  !isAdvanced ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setIsAdvanced(true)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition ${
                  isAdvanced ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Advanced
              </button>
            </div>
          </div>

          {/* Model Selector Card */}
          <div className="space-y-2 bg-[#0b0e17] border border-slate-900/60 rounded-xl p-4">
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" /> Suno 생성 모델 버전
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="w-full bg-[#04060c] border border-slate-850 text-xs text-slate-200 rounded-xl p-3 focus:outline-none transition font-semibold"
            >
              {SUNO_MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label} ({m.desc})</option>
              ))}
            </select>
          </div>

          {/* A. Lyrics Box (Always at the TOP of content list) */}
          <div className="bg-[#0b0e17] border border-slate-900/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Mic2 className="w-4 h-4 text-emerald-400" /> Lyrics (가사)
              </label>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-bold uppercase">
                {lyricsMode}
              </span>
            </div>

            {lyricsMode === "write" && (
              <div className="space-y-2 animate-fadeIn">
                <textarea
                  value={customLyrics}
                  onChange={(e) => setCustomLyrics(e.target.value)}
                  placeholder="나만의 노래 가사를 여기에 직접 적어보세요..."
                  className="w-full h-36 bg-[#04060c] border border-slate-850 focus:border-emerald-500/50 text-xs text-slate-200 rounded-xl p-3 focus:outline-none transition resize-none leading-relaxed"
                />
              </div>
            )}

            {lyricsMode === "prompt" && (
              <div className="space-y-2 animate-fadeIn">
                <textarea
                  value={customLyrics}
                  onChange={(e) => setCustomLyrics(e.target.value)}
                  placeholder="새 세대를 작곡할 때 가사의 모티프가 될 테마나 아이디어를 간략히 입력하세요..."
                  className="w-full h-24 bg-[#04060c] border border-slate-850 focus:border-emerald-500/50 text-xs text-slate-200 rounded-xl p-3 focus:outline-none transition resize-none"
                />
              </div>
            )}

            {lyricsMode === "instrumental" && (
              <div className="p-4 bg-[#04060c]/80 rounded-xl text-center border border-slate-850 select-none">
                <Music className="w-6 h-6 text-slate-600 mx-auto mb-1.5 opacity-60" />
                <p className="text-xs text-slate-350 font-bold">Instrumental Mode</p>
                <p className="text-[10px] text-slate-500 mt-1">This song will be instrumental, with no vocals or lyrics.</p>
              </div>
            )}
          </div>

          {/* B. Styles Box (Always in the MIDDLE) */}
          <div className="bg-[#0b0e17] border border-slate-900/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Styles (스타일 프롬프트)
              </label>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePromptMagic}
                  disabled={magicianActive || !prompt.trim()}
                  className="p-1.5 bg-[#04060c] hover:bg-emerald-500/10 hover:text-emerald-400 border border-slate-855 hover:border-emerald-500/30 rounded-lg text-slate-400 transition flex items-center gap-1"
                >
                  {magicianActive ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="text-[10px] font-bold">마법사</span>
                </button>
                
                <button
                  onClick={handleReRollStyle}
                  className="p-1.5 bg-[#04060c] hover:bg-sky-500/10 hover:text-sky-400 border border-slate-855 hover:border-sky-500/30 rounded-lg text-slate-400 transition flex items-center gap-1"
                >
                  <Dice5 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[10px] font-bold">랜덤</span>
                </button>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: mid-tempo gentle violin melody, soft upright bass, cozy café jazz..."
              className="w-full h-24 bg-[#04060c] border border-slate-850 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition resize-none leading-relaxed"
            />

            {/* Horizontal recommended tags */}
            <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">추천 스타일 태그 (옆으로 스크롤)</span>
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#0b0e17] to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#0b0e17] to-transparent pointer-events-none z-10" />

                <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
                  {SUGGESTED_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleAppendStyleChip(chip)}
                      className="text-[11px] px-3 py-1.5 bg-[#04060c] hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 font-medium rounded-full border border-slate-850 hover:border-emerald-500/30 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* C. More Options Accordion (Togglable / Hideable, containing sliders & switches) */}
          <div className="bg-[#0b0e17] border border-slate-900/60 rounded-xl overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
              className="w-full px-4 py-3 bg-[#0c0f1b] hover:bg-[#101424] flex items-center justify-between text-slate-200 transition select-none"
            >
              <span className="text-xs font-bold flex items-center gap-1.5 text-[13px]">
                {isMoreOptionsOpen ? (
                  <ChevronDown className="w-4.5 h-4.5 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
                )}
                <span>More Options</span>
              </span>
              <span className="text-[11px] text-slate-400 font-bold">
                {isMoreOptionsOpen ? "숨기기" : "보기"}
              </span>
            </button>

            {isMoreOptionsOpen && (
              <div className="p-4 space-y-4 border-t border-slate-900/60 animate-fadeIn">
                
                {/* A. Lyrics switcher inside options */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mic2 className="w-4 h-4 text-emerald-400" /> Lyrics Mode (가사 설정)
                  </label>
                  <div className="grid grid-cols-3 bg-[#04060c] p-0.5 rounded-xl border border-slate-855">
                    <button
                      onClick={() => setLyricsMode("write")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        lyricsMode === "write" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      onClick={() => setLyricsMode("prompt")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        lyricsMode === "prompt" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Prompt
                    </button>
                    <button
                      onClick={() => setLyricsMode("instrumental")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        lyricsMode === "instrumental" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Instrumental
                    </button>
                  </div>
                </div>

                {/* B. Vocal Gender segment switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Vocal Gender (보컬 성별)</span>
                    <span className="text-emerald-400 uppercase font-extrabold">{vocalGender}</span>
                  </div>
                  <div className="grid grid-cols-3 bg-[#04060c] p-0.5 rounded-xl border border-slate-855">
                    <button
                      onClick={() => setVocalGender("male")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        vocalGender === "male" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setVocalGender("female")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        vocalGender === "female" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Female
                    </button>
                    <button
                      onClick={() => setVocalGender("both")}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                        vocalGender === "both" ? "bg-slate-900 text-emerald-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </div>

                {/* C. Weirdness */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span>무작위성 (Weirdness)</span>
                    <span className="text-emerald-400">{weirdness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weirdness}
                    onChange={(e) => setWeirdness(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-1"
                  />
                </div>

                {/* D. Style Influence */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span>스타일 반영 강도 (Style Influence)</span>
                    <span className="text-emerald-400">{styleInfluence}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={styleInfluence}
                    onChange={(e) => setStyleInfluence(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              disabled={isGenerating || !prompt.trim()}
              onClick={handleGenerate}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 disabled:from-slate-800 disabled:to-slate-800 hover:opacity-90 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition duration-200 text-xs text-[13px]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{genProgress || "Suno 작곡 중..."}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Suno에서 노래 만들기</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 3. Playlist Explorer Panel */}
        <section className="flex-1 flex overflow-hidden bg-[#090c15]">

          {/* Workspace Side with Drag Resizing & Collapse */}
          <div 
            className="bg-[#060910] border-r border-slate-900/60 p-4 flex flex-col space-y-4 overflow-y-auto flex-shrink-0 select-none scrollbar-none transition-all duration-200"
            style={{ width: isWorkspaceCollapsed ? "64px" : `${workspaceWidth}px` }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-900">
              {!isWorkspaceCollapsed ? (
                <>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                    <FolderOpen className="w-3.5 h-3.5 text-emerald-400" /> 워크스페이스
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setIsCreatingWorkspace(!isCreatingWorkspace)}
                      className="p-1 bg-[#04060c] hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/30 text-slate-300 rounded transition"
                      title="새 폴더 추가"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => setIsWorkspaceCollapsed(true)}
                      className="p-1 bg-[#04060c] hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/30 text-slate-300 rounded transition"
                      title="접기"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-450" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsWorkspaceCollapsed(false)}
                  className="w-full py-1 bg-[#04060c] hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/30 text-slate-300 rounded transition flex items-center justify-center"
                  title="펼치기"
                >
                  <ChevronRight className="w-4 h-4 text-emerald-400 animate-pulse" />
                </button>
              )}
            </div>

            {isCreatingWorkspace && !isWorkspaceCollapsed && (
              <div className="bg-[#0c111e] border border-slate-800 p-2.5 rounded-lg space-y-2 animate-fadeIn">
                <input
                  type="text"
                  placeholder="새 폴더 이름..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full bg-[#04060c] border border-slate-850 focus:border-emerald-500/50 p-2 rounded text-[11px] text-slate-200 focus:outline-none"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => setIsCreatingWorkspace(false)} className="text-[10px] text-slate-450">취소</button>
                  <button onClick={handleCreateWorkspace} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded text-[10px] font-bold">생성</button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {workspaces.map((ws) => (
                <div key={ws.id} className="group relative">
                  <button
                    onClick={() => setActiveWorkspaceId(ws.id)}
                    className={`w-full transition flex border ${
                      isWorkspaceCollapsed
                        ? "justify-center p-2.5 rounded-xl"
                        : "text-left p-2.5 rounded-lg flex-col gap-1"
                    } ${
                      activeWorkspaceId === ws.id
                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                        : "bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/20"
                    }`}
                    title={ws.name}
                  >
                    <span className={`flex items-center gap-1.5 truncate ${isWorkspaceCollapsed ? "" : "text-[13px] font-bold pr-4"}`}>
                      <Folder className={`w-3.5 h-3.5 ${isWorkspaceCollapsed ? "w-5 h-5" : ""} ${activeWorkspaceId === ws.id ? "text-emerald-400" : "text-slate-500"}`} />
                      {!isWorkspaceCollapsed && ws.name}
                    </span>
                    {!isWorkspaceCollapsed && (
                      <span className="text-[10px] text-slate-455 pl-5">{ws.songCount} Songs</span>
                    )}
                  </button>

                  {!isWorkspaceCollapsed && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWorkspaceMenuId(workspaceMenuId === ws.id ? null : ws.id);
                        }}
                        className="absolute right-1 top-2.5 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-red-400 transition"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {workspaceMenuId === ws.id && (
                        <div 
                          className="absolute right-1 top-8 bg-[#0f1420] border border-slate-800 rounded-lg shadow-2xl z-30 p-1 min-w-[100px] animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleDeleteWorkspace(ws.id)}
                            className="w-full text-left flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-red-400 hover:bg-red-500/10 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Folder</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resizer Handle Line */}
          {!isWorkspaceCollapsed && (
            <div
              onMouseDown={(e) => {
                setIsResizing(true);
                e.preventDefault();
              }}
              className={`w-[4px] hover:w-[6px] bg-slate-950 hover:bg-emerald-500/40 cursor-col-resize transition-all self-stretch flex-shrink-0 z-40 relative ${
                isResizing ? "bg-emerald-500/50 w-[6px]" : ""
              }`}
            />
          )}


          {/* Tracks list View - responsive flex-1 width */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <ListMusic className="w-4.5 h-4.5 text-emerald-400" />
                  {activeWorkspace?.name || "곡 목록"}
                </h3>
                <p className="text-[10px] text-slate-450">총 {filteredSongs.length}개의 음악 트랙이 연동되어 있습니다.</p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBulkDropdownOpen(!bulkDropdownOpen);
                    }}
                    className="px-3.5 py-2 bg-[#05080e] hover:bg-slate-900 border border-slate-850 rounded-xl text-xs text-emerald-400 font-bold transition flex items-center gap-1"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    <span>전체 다운로드</span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-400/70" />
                  </button>

                  {bulkDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-44 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn">
                      <button onClick={() => handleBulkFolderDownload("mp3")} className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition">
                        <FileAudio className="w-4 h-4 text-sky-400" />
                        <span>MP3 고음질 받기</span>
                      </button>
                      <button onClick={() => handleBulkFolderDownload("wav")} className="w-full text-left flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800">
                        <span className="flex items-center gap-2"><FileAudio className="w-4 h-4 text-emerald-400" />WAV 무손실</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded">Pro</span>
                      </button>
                      <button onClick={() => handleBulkFolderDownload("cover")} className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span>앨범 커버 받기</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        window.postMessage({ type: "FORCE_SUNO_SYNC_REQUEST", payload: { mode: "current", workspaceId: activeWorkspaceId } }, "*");
                        alert("현재 활성화된 폴더의 실시간 곡 동기화 요청을 보냈습니다.");
                      }}
                      className="pl-3 pr-2.5 py-2 bg-[#05080e] hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/20 text-xs text-emerald-400 font-bold rounded-l-xl transition flex items-center gap-1.5 cursor-pointer border-r-0"
                      title="현재 폴더(워크스페이스)의 곡들만 실시간 초고속 동기화"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>현재 폴더 동기화</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSyncMenuOpen(!isSyncMenuOpen);
                      }}
                      className="px-2 py-2 bg-[#05080e] hover:bg-slate-900 border border-slate-850 hover:border-emerald-500/20 text-xs text-emerald-400 rounded-r-xl transition cursor-pointer flex items-center justify-center"
                      title="동기화 방식 선택"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>

                  {isSyncMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn">
                      <button 
                        onClick={() => {
                          window.postMessage({ type: "FORCE_SUNO_SYNC_REQUEST", payload: { mode: "current", workspaceId: activeWorkspaceId } }, "*");
                          setIsSyncMenuOpen(false);
                          alert("현재 활성화된 폴더의 실시간 곡 동기화 요청을 전송했습니다.");
                        }} 
                        className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition"
                      >
                        <RefreshCw className="w-4 h-4 text-emerald-400" />
                        <div className="flex flex-col">
                          <span>현재 폴더만 동기화</span>
                          <span className="text-[9px] text-slate-500 font-normal">현재 활성화된 워크스페이스 (초고속)</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          window.postMessage({ type: "FORCE_SUNO_SYNC_REQUEST", payload: { mode: "folders" } }, "*");
                          setIsSyncMenuOpen(false);
                          alert("Suno.com 폴더 목록 동기화 요청을 보냈습니다. (약 0.5초 소요)");
                        }} 
                        className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800"
                      >
                        <Folder className="w-4 h-4 text-amber-400" />
                        <div className="flex flex-col">
                          <span>폴더 목록만 동기화</span>
                          <span className="text-[9px] text-slate-500 font-normal">전체 워크스페이스 목록만 (초경량)</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          window.postMessage({ type: "FORCE_SUNO_SYNC_REQUEST", payload: { mode: "all" } }, "*");
                          setIsSyncMenuOpen(false);
                          alert("모든 폴더 전체 자동 순회 동기화 요청을 보냈습니다. (약 10~20초 소요)");
                        }} 
                        className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800"
                      >
                        <RefreshCcw className="w-4 h-4 text-sky-400" />
                        <div className="flex flex-col">
                          <span>모든 폴더 전체 동기화</span>
                          <span className="text-[9px] text-slate-500 font-normal">Suno 모든 폴더 자동 이동 순회</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 실시간 곡 검색 및 정렬 필터 컨트롤 바 (Suno.com Clone) */}
            <div className="flex items-center justify-between gap-3 flex-wrap w-full bg-[#070a13] p-2 rounded-xl border border-slate-900/60 z-30 select-none flex-shrink-0">
              
              {/* 왼쪽: 검색 인풋 */}
              <div className="relative flex-1 min-w-[220px]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="곡 제목, 스타일, 프롬프트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#04060c] border border-slate-850 focus:border-emerald-500/50 text-[12px] text-slate-200 pl-9 pr-8 py-2 rounded-lg focus:outline-none transition placeholder-slate-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-350"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 오른쪽: 필터/정렬/보기 드롭다운 그룹 */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* 1. Filters 드롭다운 */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSortMenuOpen(false);
                      setIsViewMenuOpen(false);
                      setIsFilterMenuOpen(!isFilterMenuOpen);
                    }}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
                      isFilterMenuOpen || filterLiked || filterDisliked || filterPublic || filterPrivate || filterUploads
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-[#04060c] text-slate-400 border-slate-850 hover:text-slate-250"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Filters {(filterLiked ? 1 : 0) + (filterDisliked ? 1 : 0) + (filterPublic ? 1 : 0) + (filterPrivate ? 1 : 0) + (filterUploads ? 1 : 0)}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {isFilterMenuOpen && (
                    <div 
                      className="absolute right-0 mt-1.5 w-52 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-3 flex flex-col gap-2.5 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-slate-200">
                        <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-400" /> Liked</span>
                        <input type="checkbox" checked={filterLiked} onChange={() => setFilterLiked(!filterLiked)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                      <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-slate-200">
                        <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-slate-500 rotate-180" /> Disliked</span>
                        <input type="checkbox" checked={filterDisliked} onChange={() => setFilterDisliked(!filterDisliked)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                      <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-slate-200 border-t border-slate-900 pt-2">
                        <span className="flex items-center gap-1.5"><RadioIcon className="w-3.5 h-3.5 text-sky-400" /> Public</span>
                        <input type="checkbox" checked={filterPublic} onChange={() => setFilterPublic(!filterPublic)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                      <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-slate-200">
                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Private</span>
                        <input type="checkbox" checked={filterPrivate} onChange={() => setFilterPrivate(!filterPrivate)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                      <label className="flex items-center justify-between text-slate-300 cursor-pointer hover:text-slate-200 border-t border-slate-900 pt-2">
                        <span className="flex items-center gap-1.5"><FileAudio className="w-3.5 h-3.5 text-amber-400" /> Uploads</span>
                        <input type="checkbox" checked={filterUploads} onChange={() => setFilterUploads(!filterUploads)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                      
                      <div className="border-t border-slate-855 my-1.5" />
                      
                      <label className="flex items-center justify-between text-slate-400 cursor-pointer hover:text-slate-250">
                        <span>Hide Disliked</span>
                        <input type="checkbox" checked={filterHideDisliked} onChange={() => setFilterHideDisliked(!filterHideDisliked)} className="rounded border-slate-800 text-emerald-500 focus:ring-0 w-3.5 h-3.5" />
                      </label>
                    </div>
                  )}
                </div>

                {/* 2. Sort 드롭다운 */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterMenuOpen(false);
                      setIsViewMenuOpen(false);
                      setIsSortMenuOpen(!isSortMenuOpen);
                    }}
                    className="px-3 py-2 bg-[#04060c] hover:bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-400 hover:text-slate-250 font-bold flex items-center gap-1.5 transition"
                  >
                    <span>{activeSort === "newest" ? "Newest" : activeSort === "oldest" ? "Oldest" : activeSort === "most-liked" ? "Most Liked" : "Least Liked"}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {isSortMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-36 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn">
                      <button type="button" onClick={() => { setActiveSort("newest"); setIsSortMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between">
                        <span>Newest</span>{activeSort === "newest" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                      <button type="button" onClick={() => { setActiveSort("oldest"); setIsSortMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between border-t border-slate-900">
                        <span>Oldest</span>{activeSort === "oldest" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                      <button type="button" onClick={() => { setActiveSort("most-liked"); setIsSortMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between border-t border-slate-900">
                        <span>Most Liked</span>{activeSort === "most-liked" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                      <button type="button" onClick={() => { setActiveSort("least-liked"); setIsSortMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between border-t border-slate-900">
                        <span>Least Liked</span>{activeSort === "least-liked" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. View Mode 드롭다운 */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterMenuOpen(false);
                      setIsSortMenuOpen(false);
                      setIsViewMenuOpen(!isViewMenuOpen);
                    }}
                    className="px-3 py-2 bg-[#04060c] hover:bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-400 hover:text-slate-250 font-bold flex items-center gap-1.5 transition"
                  >
                    <span>{activeViewMode === "list" ? "List" : activeViewMode === "waveform" ? "Waveform" : "Grid"}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {isViewMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-32 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn">
                      <button type="button" onClick={() => { setActiveViewMode("list"); setIsViewMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between">
                        <span>List</span>{activeViewMode === "list" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                      <button type="button" onClick={() => { setActiveViewMode("waveform"); setIsViewMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between border-t border-slate-900">
                        <span>Waveform</span>{activeViewMode === "waveform" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                      <button type="button" onClick={() => { setActiveViewMode("grid"); setIsViewMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-350 hover:bg-slate-900 rounded transition flex items-center justify-between border-t border-slate-900">
                        <span>Grid</span>{activeViewMode === "grid" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-4 bg-slate-800 my-auto mx-1" />

                {/* Liked / Public / Uploads 단축 칩 세그먼트 */}
                <button
                  type="button"
                  onClick={() => setLikedFilterOnly(!likedFilterOnly)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    likedFilterOnly ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-[#04060c] text-slate-400 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Liked
                </button>

                <button
                  type="button"
                  onClick={() => setPublicFilterOnly(!publicFilterOnly)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    publicFilterOnly ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-[#04060c] text-slate-400 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Public
                </button>

                <button
                  type="button"
                  onClick={() => setUploadsFilterOnly(!uploadsFilterOnly)}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    uploadsFilterOnly ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-[#04060c] text-slate-400 hover:text-slate-300 border border-transparent"
                  }`}
                >
                  Uploads
                </button>

              </div>
            </div>

            {/* Dynamic Song Viewer (List / Waveform / Grid) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {activeViewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 animate-fadeIn">
                  {filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => setSelectedSongId(song.id)}
                      className={`p-3.5 rounded-xl flex flex-col justify-between border cursor-pointer transition ${
                        selectedSongId === song.id 
                          ? "bg-[#141d30] border-emerald-500/25 shadow-lg" 
                          : "bg-[#0c0f1b]/80 border-slate-900/60 hover:bg-[#0f1425]"
                      }`}
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-855 bg-slate-900 mb-2.5">
                        <img src={song.imageUrl} alt="Art" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(song);
                          }}
                          className={`absolute bottom-2 right-2 p-2.5 rounded-lg border transition ${
                            playingSongId === song.id
                              ? "bg-emerald-500/25 text-emerald-400 border-emerald-500/35"
                              : "bg-slate-900/80 hover:bg-slate-850 text-slate-200 border-slate-850"
                          }`}
                        >
                          {playingSongId === song.id && isPlaying ? (
                            <Pause className="w-4 h-4 fill-emerald-400" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="font-bold text-xs text-slate-200 truncate">{song.title}</h4>
                          <span className="text-[10px] bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded font-bold">{song.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-1">{song.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => setSelectedSongId(song.id)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3.5 cursor-pointer border transition ${
                        selectedSongId === song.id 
                          ? "bg-[#141d30] border-emerald-500/25 shadow-lg" 
                          : "bg-[#0c0f1b]/80 border-slate-900/60 hover:bg-[#0f1425]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(song);
                          }}
                          className={`p-2.5 rounded-lg border transition ${
                            playingSongId === song.id
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-slate-900 hover:bg-slate-850 text-slate-400 border-slate-850"
                          }`}
                        >
                          {playingSongId === song.id && isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-emerald-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-855 bg-slate-900 flex-shrink-0">
                          <img src={song.imageUrl} alt="Art" className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-slate-200 truncate">{song.title}</h4>
                            <span className="text-[10px] bg-slate-900 text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded font-bold flex-shrink-0">{song.duration}</span>
                            
                            {/* Waveform EQ visualizer (Triggered in Waveform view mode when actively playing) */}
                            {activeViewMode === "waveform" && playingSongId === song.id && isPlaying && (
                              <div className="flex items-end gap-[2.5px] h-3.5 px-1.5 flex-shrink-0">
                                <span className="w-[2px] bg-emerald-400 h-3.5 animate-pulse" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                                <span className="w-[2px] bg-emerald-400 h-2.5 animate-pulse" style={{ animationDelay: "150ms", animationDuration: "0.4s" }} />
                                <span className="w-[2px] bg-emerald-400 h-4 animate-pulse" style={{ animationDelay: "300ms", animationDuration: "0.7s" }} />
                                <span className="w-[2px] bg-emerald-400 h-2 animate-pulse" style={{ animationDelay: "100ms", animationDuration: "0.5s" }} />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-[480px]">{song.prompt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() => {
                              setContextMenuSongId(null);
                              setDownloadDropdownId(downloadDropdownId === song.id ? null : song.id);
                            }}
                            className="px-3 py-1.5 bg-[#04060c] hover:bg-slate-900 border border-slate-850 rounded-lg text-[10px] text-emerald-400 font-bold transition flex items-center gap-0.5"
                          >
                            <Download className="w-3 h-3" />
                            <span>PC 다운</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          </button>

                          {downloadDropdownId === song.id && (
                            <div className="absolute right-0 mt-1.5 w-44 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                              <a href={song.audioUrl} download={`${song.title}.mp3`} onClick={() => setDownloadDropdownId(null)} className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition">
                                <FileAudio className="w-4 h-4 text-sky-400" /><span>MP3 고음질</span>
                              </a>
                              {song.wavUrl && (
                                <a href={song.wavUrl} download={`${song.title}.wav`} onClick={() => setDownloadDropdownId(null)} className="flex items-center justify-between px-2.5 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800">
                                  <span className="flex items-center gap-2"><FileAudio className="w-4 h-4 text-emerald-400" />WAV 무손실</span>
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-bold">Pro</span>
                                </a>
                              )}
                              <a href={song.imageUrl} target="_blank" rel="noreferrer" download={`${song.title}_cover.jpg`} onClick={() => setDownloadDropdownId(null)} className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800">
                                <ImageIcon className="w-4 h-4 text-amber-400" /><span>앨범 커버 다운</span>
                              </a>
                              <button onClick={() => { handleSongContextAction("copy_prompt", song); setDownloadDropdownId(null); }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-800">
                                <Clipboard className="w-4 h-4 text-emerald-400" /><span>Style 프롬프트 복사</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => {
                              setDownloadDropdownId(null);
                              setContextMenuSongId(contextMenuSongId === song.id ? null : song.id);
                            }}
                            className="p-2 hover:bg-slate-900 border border-transparent rounded text-slate-500"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {contextMenuSongId === song.id && (
                            <div className="absolute right-0 mt-1.5 w-36 bg-[#0f1420] border border-slate-800 rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5 animate-fadeIn">
                              <button onClick={() => handleSongContextAction("remix", song)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition">
                                <Sparkles className="w-4 h-4 text-amber-400" /><span>Remix</span>
                              </button>
                              <button onClick={() => handleSongContextAction("edit", song)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-855">
                                <Edit3 className="w-4 h-4 text-emerald-400" /><span>Edit</span>
                              </button>
                              <button onClick={() => handleSongContextAction("share", song)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-350 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition border-t border-slate-855">
                                <Share2 className="w-4 h-4 text-sky-400" /><span>Share Link</span>
                              </button>
                              <button onClick={() => handleSongContextAction("delete", song)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition border-t border-slate-855">
                                <Trash2 className="w-4 h-4" /><span>Move to Trash</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#04060c] border border-slate-900 p-3.5 rounded-xl text-slate-500 text-[10px] select-none">
              <span>※ Suno에서 다운로드 링크가 완료되면 이 목록에서 실시간 다운로드를 이용할 수 있습니다.</span>
            </div>

          </div>
        </section>

        {/* 4. Right Side Aside Info Panel -> FIXED width using flex-shrink-0 to prevent clipping/wrapping */}
        {selectedSong && (
          <aside className="w-[340px] md:w-[370px] bg-[#05080e] border-l border-slate-900/60 p-4 flex flex-col justify-start flex-shrink-0 overflow-y-auto scrollbar-thin select-none animate-slideLeft h-full">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-900 mb-3.5 flex-shrink-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> 상세 곡 정보
              </span>
              <button 
                onClick={() => setSelectedSongId(null)}
                className="p-1 hover:bg-slate-900 border border-transparent rounded-lg text-slate-500 hover:text-slate-300 transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Artwork */}
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-855 bg-slate-900 shadow-2xl relative mb-3.5 flex-shrink-0">
              <img 
                src={selectedSong.imageUrl} 
                alt={selectedSong.title}
                className="w-full h-full object-cover"
              />

              {/* Floating Cover Image Download button */}
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedSong.imageUrl;
                  link.download = `${selectedSong.title.replace(/\s+/g, "_")}_cover.jpg`;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert(`"${selectedSong.title}"의 앨범 커버 이미지 다운로드를 시작합니다.`);
                }}
                className="absolute bottom-3 right-3 p-2.5 bg-black/60 hover:bg-black/90 text-white hover:text-emerald-400 border border-white/10 hover:border-emerald-550/30 rounded-full transition shadow-lg flex items-center justify-center cursor-pointer z-10"
                title="앨범 커버 이미지 다운로드"
              >
                <Download className="w-4 h-4" />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex items-end p-3.5 pointer-events-none">
                <div>
                  <h3 className="text-sm font-black text-white">{selectedSong.title}</h3>
                  <p className="text-[10px] text-slate-400">Duration: {selectedSong.duration}</p>
                </div>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-3 mb-3.5 flex-shrink-0">
              <button 
                onClick={() => playTrack(selectedSong)}
                className="py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                {playingSongId === selectedSong.id && isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Play Audio</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => handleSongContextAction("remix", selectedSong)}
                className="py-2.5 bg-slate-900 hover:bg-slate-855 border border-slate-855 text-slate-350 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Remix / Edit</span>
              </button>
            </div>

            {/* Styles */}
            <div className="space-y-1.5 mb-3.5 bg-[#090d16] border border-slate-900 rounded-lg p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Styles</span>
                <button
                  onClick={() => copyToClipboard(selectedSong.prompt, "스타일 프롬프트가 복사되었습니다!")}
                  className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-emerald-400 transition"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-normal font-semibold whitespace-pre-wrap">{selectedSong.prompt}</p>
            </div>

            {/* Lyrics content box */}
            <div className="bg-[#090d16] border border-slate-900 rounded-lg p-4 flex-1 min-h-[160px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 flex-shrink-0">
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Lyrics (가사)</span>
                <button
                  type="button"
                  onClick={() => {
                    const lyricsText = SONG_LYRICS_DB[selectedSong.id] || "이 곡은 연주곡(Instrumental)으로 가사가 없습니다.";
                    copyToClipboard(lyricsText, "가사가 클립보드에 복사되었습니다!");
                  }}
                  className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                  title="가사 전체 복사"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto text-xs text-slate-400 leading-relaxed whitespace-pre-line font-medium pr-1.5 scrollbar-thin">
                {SONG_LYRICS_DB[selectedSong.id] || `[Instrumental]
(This song is instrumental, with no lyrics or vocals.)`}
              </div>
            </div>

          </aside>
        )}

      </div>

      {/* 5. Fixed Bottom Player Bar */}
      <footer className="h-20 bg-[#020306]/95 backdrop-blur-md border-t border-slate-800/90 shadow-[0_-12px_36px_rgba(0,0,0,0.95)] flex items-center justify-between px-6 z-50 flex-shrink-0 select-none relative">
        
        {/* Left info */}
        <div className="flex items-center gap-3.5 w-64 min-w-0">
          {playingSong ? (
            <>
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-855 bg-slate-900 flex-shrink-0">
                <img 
                  src={playingSong.imageUrl} 
                  alt={playingSong.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-200 truncate">{playingSong.title}</h4>
                <p className="text-[10px] text-slate-450 truncate">{playingSong.tags}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5 text-slate-550">
              <PlayCircle className="w-9 h-9 opacity-45" />
              <div>
                <p className="text-[10px] font-bold text-slate-400">재생 중인 곡 없음</p>
                <p className="text-[9px] text-slate-600">곡 리스트에서 플레이 버튼 클릭</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Progress */}
        <div className="flex-1 max-w-lg flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => handleSkip("backward")}
              className="p-1.5 hover:bg-slate-900 border border-transparent rounded text-slate-400 hover:text-slate-250 transition"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => playingSong && playTrack(playingSong)}
              disabled={!playingSong}
              className="p-2.5 bg-white text-slate-950 rounded-full hover:scale-105 disabled:opacity-40 transition flex items-center justify-center shadow-md animate-fadeIn"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button 
              onClick={() => handleSkip("forward")}
              className="p-1.5 hover:bg-slate-900 border border-transparent rounded text-slate-400 hover:text-slate-250 transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full flex items-center gap-3 text-[10px] font-bold text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={!playingSong}
              className="flex-1 accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-1 disabled:opacity-40"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right volume & utils */}
        <div className="flex items-center justify-end gap-4 w-64">
          <div className="flex items-center gap-2 text-slate-400">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-emerald-500 bg-slate-900 rounded-lg cursor-pointer h-1"
            />
          </div>

          <button 
            onClick={() => playingSong && copyToClipboard(`https://creaibox.com/shared/suno/${playingSong.id}`, "곡 공유 주소가 복사되었습니다!")}
            disabled={!playingSong}
            className="p-1.5 hover:bg-slate-900 border border-transparent rounded text-slate-400 hover:text-emerald-400 disabled:opacity-45 transition"
            title="공유 링크 클립보드 복사"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button 
            onClick={() => playingSong && handleSongContextAction("copy_prompt", playingSong)}
            disabled={!playingSong}
            className="p-1.5 hover:bg-slate-900 border border-transparent rounded text-slate-400 hover:text-emerald-400 disabled:opacity-45 transition"
            title="Style 프롬프트 복사"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>

      </footer>

    </div>
  );
}
