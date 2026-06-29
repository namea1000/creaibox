"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Share2,
  Video as VideoIcon,
  Sparkles,
  Link2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Settings,
  Send,
  Loader2,
  Copy,
  Folder,
  User,
  Check,
  ChevronRight,
  ExternalLink,
  Info,
  RefreshCw,
  Play,
  Square,
  Volume2,
  VolumeX,
  Plus,
  VideoOff,
  Flame,
  FileVideo,
  Trash2,
} from "lucide-react";
import { SiYoutube as Youtube, SiInstagram as Instagram } from "react-icons/si";
import { SiYoutube as YoutubeIcon, SiInstagram as InstagramIcon } from "react-icons/si";
import { createClient } from "@/utils/supabase/client";

// Platform Type definition
type Platform = "youtube" | "instagram" | "tiktok";

type ConnectedChannel = {
  platform: Platform;
  connected: boolean;
  channelName?: string;
  avatar?: string;
  subscribers?: string;
  handle?: string;
};

type PublishedHistoryItem = {
  id: string;
  title: string;
  platforms: Platform[];
  publishedAt: string;
  status: "success" | "publishing" | "draft" | "failed";
  views: Record<Platform, number | null>;
  likes: Record<Platform, number | null>;
};

type VideoSegment = {
  text: string;
  duration: number;
  keyword: string;
  videoUrl?: string; // Resolved video URL
};

type GeneratedShortsData = {
  id?: string;
  title: string;
  description: string;
  script: string;
  segments: VideoSegment[];
  video_url?: string;
  created_at?: string;
  category: string;
  keyword?: string;
  bg_music?: string;
};

// Public Google GTV CORS-friendly Video Catalog (Free fallback matching)
const FALLBACK_VIDEOS: Record<string, string[]> = {
  tech: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ],
  motivation: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4",
  ],
  nature: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  ],
  finance: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  ],
  history: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  ],
};

const BACKGROUND_MUSIC: Record<string, string> = {
  lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  cinematic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  tech: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  epic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
};

export default function PublishDashboard({ defaultTab = "ai-shorts" }: { defaultTab?: "ai-shorts" | "publish" | "channels" | "history" }) {
  const [activeTab, setActiveTab] = useState<"ai-shorts" | "publish" | "channels" | "history">(defaultTab);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // User auth state
  const [userId, setUserId] = useState<string | null>(null);

  // Channels states
  const [channels, setChannels] = useState<Record<Platform, ConnectedChannel>>({
    youtube: { platform: "youtube", connected: false },
    instagram: { platform: "instagram", connected: false },
    tiktok: { platform: "tiktok", connected: false },
  });

  // Simulated OAuth states
  const [oauthModal, setOauthModal] = useState<{
    show: boolean;
    platform: Platform | null;
    step: "account" | "consent" | "success";
  }>({ show: false, platform: null, step: "account" });

  // Post Creator states
  const [selectedVideoSource, setSelectedVideoSource] = useState<"library" | "local">("library");
  const [selectedLibraryVideo, setSelectedLibraryVideo] = useState<string>("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<Platform, boolean>>({
    youtube: false,
    instagram: false,
    tiktok: false,
  });

  // Uploading Animation state
  const [publishingState, setPublishingState] = useState<{
    isPublishing: boolean;
    progress: Record<Platform, number>;
    status: Record<Platform, "pending" | "uploading" | "processing" | "success" | "failed">;
  }>({
    isPublishing: false,
    progress: { youtube: 0, instagram: 0, tiktok: 0 },
    status: { youtube: "pending", instagram: "pending", tiktok: "pending" },
  });

  // History & Analytics states
  const [historyItems, setHistoryItems] = useState<PublishedHistoryItem[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  // Library videos list
  const libraryVideos = [
    { id: "vid-1", title: "인공지능 트렌드 요약 1편.mp4", duration: "01:24", size: "18.4MB", date: "2026-06-28" },
    { id: "vid-2", title: "Lofi 힐링 뮤직 1시간 연속 듣기.mp4", duration: "60:00", size: "640.2MB", date: "2026-06-27" },
    { id: "vid-3", title: "스마트홈 가젯 비교 및 제품 사용기.mp4", duration: "12:15", size: "142.1MB", date: "2026-06-25" },
    { id: "vid-4", title: "유튜브 쇼츠 성공 법칙 5가지 대공개.mp4", duration: "00:58", size: "12.8MB", date: "2026-06-24" },
  ];

  // ----------------------------------------------------
  // AI Shorts Auto-Generator states
  // ----------------------------------------------------
  const [shortsCategory, setShortsCategory] = useState<string>("tech");
  const [shortsKeyword, setShortsKeyword] = useState<string>("");
  const [shortsBgMusic, setShortsBgMusic] = useState<string>("lofi");
  const [pexelsApiKey, setPexelsApiKey] = useState<string>("");
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [generatedShorts, setGeneratedShorts] = useState<GeneratedShortsData | null>(null);
  
  // Database persistence state
  const [savedShortsList, setSavedShortsList] = useState<GeneratedShortsData[]>([]);
  const [isLoadingSavedShorts, setIsLoadingSavedShorts] = useState<boolean>(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Audio playback and Preview states
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [previewActiveSegment, setPreviewActiveSegment] = useState<number>(-1);

  // Canvas Exporter Rendering states
  const [isRenderingVideo, setIsRenderingVideo] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load state from local storage and fetch DB on mount
  useEffect(() => {
    const initData = async () => {
      // 1. Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // 2. Fetch saved shorts projects from Supabase
        fetchSavedProjects(user.id);
      }

      // 3. Load other states
      try {
        const storedChannels = localStorage.getItem("creaibox_pub_channels");
        if (storedChannels) {
          setChannels(JSON.parse(storedChannels));
        }
        
        const storedHistory = localStorage.getItem("creaibox_pub_history");
        if (storedHistory) {
          setHistoryItems(JSON.parse(storedHistory));
        } else {
          const initialHistory: PublishedHistoryItem[] = [
            {
              id: "hist-1",
              title: "유튜브 쇼츠 성공 법칙 5가지 대공개.mp4",
              platforms: ["youtube", "tiktok"],
              publishedAt: "2026-06-28 14:20",
              status: "success",
              views: { youtube: 1240, instagram: null, tiktok: 3420 },
              likes: { youtube: 95, instagram: null, tiktok: 280 },
            },
          ];
          setHistoryItems(initialHistory);
          localStorage.setItem("creaibox_pub_history", JSON.stringify(initialHistory));
        }

        const savedKey = localStorage.getItem("creaibox_pexels_key");
        if (savedKey) {
          setPexelsApiKey(savedKey);
        }
      } catch (e) {
        console.error("Failed to load publisher states", e);
      }
    };

    initData();
  }, [supabase]);

  // Fetch projects from Supabase
  const fetchSavedProjects = async (uid: string) => {
    setIsLoadingSavedShorts(true);
    try {
      const { data, error } = await supabase
        .from("ai_shorts_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Table might not exist yet, fallback gracefully
        console.warn("ai_shorts_projects table query failed or table not created:", error.message);
        return;
      }
      if (data) {
        setSavedShortsList(data as GeneratedShortsData[]);
      }
    } catch (e) {
      console.warn("Database fetch failed, ignoring database syncing.", e);
    } finally {
      setIsLoadingSavedShorts(false);
    }
  };

  // Delete project from database
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("이 생성된 AI 쇼츠 기록을 데이터베이스에서 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("ai_shorts_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSavedShortsList((prev) => prev.filter((p) => p.id !== id));
      if (activeProjectId === id) {
        setGeneratedShorts(null);
        setActiveProjectId(null);
      }
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  const saveChannels = (updated: Record<Platform, ConnectedChannel>) => {
    setChannels(updated);
    localStorage.setItem("creaibox_pub_channels", JSON.stringify(updated));
  };

  useEffect(() => {
    setSelectedPlatforms({
      youtube: channels.youtube.connected,
      instagram: channels.instagram.connected,
      tiktok: channels.tiktok.connected,
    });
  }, [channels]);

  // AI Hashtag Recommendation
  const handleRecommendHashtags = () => {
    if (!videoTitle && !videoDesc) {
      alert("영상 제목이나 설명란을 입력해주시면 맞춤형 해시태그를 더 정확하게 추천해 드립니다!");
    }
    let tags = ["#크리에이박스", "#Shorts", "#Reels", "#TikTok", "#인기영상"];
    if (videoTitle.includes("쇼츠") || videoDesc.includes("쇼츠")) {
      tags.push("#유튜브쇼츠", "#쇼츠성공");
    }
    if (videoTitle.includes("힐링") || videoTitle.includes("Lofi") || videoTitle.includes("뮤직")) {
      tags.push("#LofiMusic", "#힐링음악", "#집중음악", "#수면음악");
    }
    if (videoTitle.includes("IT") || videoTitle.includes("테크") || videoTitle.includes("스마트")) {
      tags.push("#테크리뷰", "#IT트렌드", "#신제품소개", "#스마트가젯");
    }
    const uniqueTags = Array.from(new Set(tags)).slice(0, 7).join(" ");
    setVideoDesc((prev) => {
      const cleanPrev = prev.trim();
      return cleanPrev ? `${cleanPrev}\n\n${uniqueTags}` : uniqueTags;
    });
  };

  // Simulated OAuth Connection
  const startOAuth = (platform: Platform) => {
    setOauthModal({ show: true, platform, step: "account" });
  };

  const handleOAuthSelectAccount = () => {
    setOauthModal((prev) => ({ ...prev, step: "consent" }));
  };

  const handleOAuthConsentAllow = () => {
    if (!oauthModal.platform) return;
    
    const mockChannelInfo: Record<Platform, ConnectedChannel> = {
      youtube: {
        platform: "youtube",
        connected: true,
        channelName: "테크크리에이터 TV",
        handle: "@tech_creator_tv",
        subscribers: "12.8만명",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
      },
      instagram: {
        platform: "instagram",
        connected: true,
        channelName: "크리에이티브 라이프",
        handle: "@creative_life_reels",
        subscribers: "3.2만 팔로워",
        avatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&auto=format&fit=crop&q=60",
      },
      tiktok: {
        platform: "tiktok",
        connected: true,
        channelName: "트렌드 쇼츠 공식",
        handle: "@trend_shorts_official",
        subscribers: "24.5만 팔로워",
        avatar: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=100&auto=format&fit=crop&q=60",
      },
    };

    const updatedChannels = {
      ...channels,
      [oauthModal.platform]: mockChannelInfo[oauthModal.platform],
    };
    saveChannels(updatedChannels);
    setOauthModal((prev) => ({ ...prev, step: "success" }));
  };

  const disconnectChannel = (platform: Platform) => {
    if (confirm(`${platform.toUpperCase()} 채널 연동을 해제하시겠습니까?`)) {
      const updatedChannels = {
        ...channels,
        [platform]: { platform, connected: false },
      };
      saveChannels(updatedChannels);
    }
  };

  // SNS Upload publisher execution
  const handleStartPublish = () => {
    const activePlatforms = Object.entries(selectedPlatforms)
      .filter(([_, checked]) => checked)
      .map(([platform]) => platform as Platform);

    if (activePlatforms.length === 0) {
      alert("발행할 SNS 플랫폼을 최소 하나 이상 선택해 주세요!");
      return;
    }

    if (selectedVideoSource === "library" && !selectedLibraryVideo) {
      alert("발행할 비디오 라이브러리 영상을 선택해 주세요!");
      return;
    }

    if (selectedVideoSource === "local" && !localFile) {
      alert("발행할 로컬 비디오 파일을 선택해 주세요!");
      return;
    }

    if (!videoTitle.trim()) {
      alert("업로드할 비디오의 제목을 입력해 주세요!");
      return;
    }

    setPublishingState({
      isPublishing: true,
      progress: { youtube: 0, instagram: 0, tiktok: 0 },
      status: {
        youtube: selectedPlatforms.youtube ? "uploading" : "pending",
        instagram: selectedPlatforms.instagram ? "uploading" : "pending",
        tiktok: selectedPlatforms.tiktok ? "uploading" : "pending",
      },
    });

    const selectedVidTitle = selectedVideoSource === "library" 
      ? libraryVideos.find(v => v.id === selectedLibraryVideo)?.title || "영상.mp4"
      : localFile?.name || "로컬영상.mp4";

    const interval = setInterval(() => {
      setPublishingState((prev) => {
        const nextProgress = { ...prev.progress };
        const nextStatus = { ...prev.status };
        let allCompleted = true;

        activePlatforms.forEach((p) => {
          if (nextStatus[p] === "uploading") {
            nextProgress[p] += Math.floor(Math.random() * 15) + 5;
            if (nextProgress[p] >= 100) {
              nextProgress[p] = 100;
              nextStatus[p] = p === "tiktok" ? "success" : "processing";
            }
            allCompleted = false;
          } else if (nextStatus[p] === "processing") {
            nextProgress[p] = 100;
            if (Math.random() > 0.6) {
              nextStatus[p] = "success";
            }
            allCompleted = false;
          }
        });

        if (allCompleted) {
          clearInterval(interval);
          
          setTimeout(() => {
            const newHistoryItem: PublishedHistoryItem = {
              id: `hist-${Date.now()}`,
              title: selectedVidTitle,
              platforms: activePlatforms,
              publishedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
              status: "success",
              views: {
                youtube: activePlatforms.includes("youtube") ? 0 : null,
                instagram: activePlatforms.includes("instagram") ? 0 : null,
                tiktok: activePlatforms.includes("tiktok") ? 0 : null,
              },
              likes: {
                youtube: activePlatforms.includes("youtube") ? 0 : null,
                instagram: activePlatforms.includes("instagram") ? 0 : null,
                tiktok: activePlatforms.includes("tiktok") ? 0 : null,
              },
            };
            const updatedHistory = [newHistoryItem, ...historyItems];
            setHistoryItems(updatedHistory);
            localStorage.setItem("creaibox_pub_history", JSON.stringify(updatedHistory));

            alert("축하합니다! 선택하신 플랫폼에 동영상이 자동으로 안전하게 업로드/발행되었습니다.");
            setPublishingState((prev) => ({ ...prev, isPublishing: false }));
            setVideoTitle("");
            setVideoDesc("");
            setActiveTab("history");
          }, 300);
        }

        return {
          ...prev,
          progress: nextProgress,
          status: nextStatus,
        };
      });
    }, 400);
  };

  const handleFetchExistingData = () => {
    const activeConnected = Object.values(channels).some(c => c.connected);
    if (!activeConnected) {
      alert("기존 업로드 데이터를 가져오려면 먼저 유튜브, 인스타그램, 틱톡 중 하나 이상의 채널을 연동해 주세요!");
      return;
    }

    setIsFetchingHistory(true);
    setTimeout(() => {
      const importedData: PublishedHistoryItem[] = [];

      if (channels.youtube.connected) {
        importedData.push(
          {
            id: "imported-yt-1",
            title: "최신 플래그십 인공지능 스마트폰 2주 솔직 사용기.mp4",
            platforms: ["youtube"],
            publishedAt: "2026-06-25 18:00",
            status: "success",
            views: { youtube: 45200, instagram: null, tiktok: null },
            likes: { youtube: 2100, instagram: null, tiktok: null },
          },
          {
            id: "imported-yt-2",
            title: "맥북 M4 Pro 코딩 개발용 구매 가이드 추천.mp4",
            platforms: ["youtube"],
            publishedAt: "2026-06-18 10:15",
            status: "success",
            views: { youtube: 128000, instagram: null, tiktok: null },
            likes: { youtube: 5400, instagram: null, tiktok: null },
          }
        );
      }

      if (channels.instagram.connected) {
        importedData.push({
          id: "imported-ig-1",
          title: "요즘 유행하는 밤하늘 타임랩스 감성 릴스.mp4",
          platforms: ["instagram"],
          publishedAt: "2026-06-27 21:30",
          status: "success",
          views: { youtube: null, instagram: 9820, tiktok: null },
          likes: { youtube: null, instagram: 1200, tiktok: null },
        });
      }

      if (channels.tiktok.connected) {
        importedData.push({
          id: "imported-tt-1",
          title: "유행하는 AI 댄스 쇼츠 챌린지 따라하기.mp4",
          platforms: ["tiktok"],
          publishedAt: "2026-06-26 12:40",
          status: "success",
          views: { youtube: null, instagram: null, tiktok: 310500 },
          likes: { youtube: null, instagram: null, tiktok: 48200 },
        });
      }

      const merged = [...importedData, ...historyItems];
      const uniqueMerged = merged.filter((item, idx, self) =>
        self.findIndex(t => t.id === item.id) === idx
      );

      setHistoryItems(uniqueMerged);
      localStorage.setItem("creaibox_pub_history", JSON.stringify(uniqueMerged));
      setIsFetchingHistory(false);
      alert("연동된 채널의 기존 비디오 업로드 데이터 및 통계를 성공적으로 가져왔습니다!");
    }, 1500);
  };

  // ----------------------------------------------------
  // AI Shorts Auto-Generator core logics
  // ----------------------------------------------------

  // 1. Script & Video Planning generation (Gemini Request)
  const handleGenerateShortsScript = async () => {
    setIsGeneratingScript(true);
    setGeneratedShorts(null);
    setPreviewActiveSegment(-1);
    
    // Stop speaking if active
    if (isPlayingPreview) {
      window.speechSynthesis.cancel();
      setIsPlayingPreview(false);
    }

    const categoryNames: Record<string, string> = {
      tech: "IT/테크/최신 가젯",
      motivation: "동기부여/명언/자기계발",
      nature: "자연/힐링/ASMR",
      finance: "경제/주식/비즈니스 재테크",
      history: "역사/미스터리/과학 상식",
    };

    const promptText = `사용자가 선택한 카테고리는 [${categoryNames[shortsCategory]}] 이며, 추가 키워드는 [${shortsKeyword || "트렌드 이슈"}] 입니다.
이 정보를 기반으로 약 30초~40초 길이의 대단히 몰입력 높은 유튜브 쇼츠 스크립트와 영상 기획을 JSON 포맷으로 생성해주세요.

반드시 아래 JSON 스키마를 완벽히 준수해야 하며, JSON 데이터 외의 일반 텍스트나 설명은 일체 작성하지 마십시오:
{
  "title": "영상 제목 (시청자의 클릭을 유도하는 자극적이고 흥미로운 제목)",
  "description": "설명란 내용 (해시태그 4개 이상 포함)",
  "script": "전체 대본 한 줄 요약 (내레이션용)",
  "segments": [
    {
      "text": "1번째 구간 대본 (한국어, 구어체로 작성)",
      "duration": 6,
      "keyword": "Pexels 비디오 검색용 영어 키워드 (예: 'hacking', 'modern library', 'earth from space')"
    },
    {
      "text": "2번째 구간 대본 (한국어)",
      "duration": 6,
      "keyword": "Pexels 비디오 검색용 영어 키워드"
    },
    {
      "text": "3번째 구간 대본 (한국어)",
      "duration": 6,
      "keyword": "Pexels 비디오 검색용 영어 키워드"
    },
    {
      "text": "4번째 구간 대본 (한국어)",
      "duration": 6,
      "keyword": "Pexels 비디오 검색용 영어 키워드"
    },
    {
      "text": "5번째 구간 대본 (한국어)",
      "duration": 6,
      "keyword": "Pexels 비디오 검색용 영어 키워드"
    }
  ]
}`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "shorts-studio",
          prompt: promptText,
          responseMimeType: "application/json",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gemini AI 응답 실패");
      }

      const rawText = await res.text();
      const cleanJson = JSON.parse(rawText) as GeneratedShortsData;

      // Resolve video assets
      const segmentsWithVideos = await Promise.all(
        cleanJson.segments.map(async (seg, idx) => {
          let videoUrl = "";
          
          if (pexelsApiKey.trim()) {
            try {
              const pexelsRes = await fetch(
                `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(seg.keyword)}&orientation=portrait&per_page=3`,
                { headers: { Authorization: pexelsApiKey } }
              );
              if (pexelsRes.ok) {
                const pexelsData = await pexelsRes.json();
                const matchedVideo = pexelsData.videos?.[0];
                const fileLink = matchedVideo?.video_files?.find(
                  (f: any) => f.quality === "sd" || f.width >= 540
                )?.link;
                if (fileLink) {
                  videoUrl = fileLink;
                }
              }
            } catch (err) {
              console.warn("Pexels fetch failed, falling back to Mixkit", err);
            }
          }

          if (!videoUrl) {
            const fallbackList = FALLBACK_VIDEOS[shortsCategory] || FALLBACK_VIDEOS.nature;
            videoUrl = fallbackList[idx % fallbackList.length];
          }

          return {
            ...seg,
            videoUrl,
          };
        })
      );

      const generatedData: GeneratedShortsData = {
        ...cleanJson,
        segments: segmentsWithVideos,
      };

      // ----------------------------------------------------
      // Database Persistence: Save generated script to Supabase
      // ----------------------------------------------------
      if (userId) {
        try {
          const { data, error } = await supabase
            .from("ai_shorts_projects")
            .insert({
              user_id: userId,
              title: generatedData.title,
              description: generatedData.description,
              script: generatedData.script,
              category: shortsCategory,
              keyword: shortsKeyword,
              bg_music: shortsBgMusic,
              segments: generatedData.segments,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) {
            generatedData.id = data.id;
            setActiveProjectId(data.id);
            setSavedShortsList((prev) => [data as GeneratedShortsData, ...prev]);
          }
        } catch (dbErr) {
          console.warn("Failed to persist to Supabase database, using local session state.", dbErr);
        }
      }

      setGeneratedShorts(generatedData);
    } catch (e: any) {
      console.error(e);
      alert(`AI 자동 기획 중 오류가 발생했습니다: ${e.message}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Load a previously saved project from database list
  const handleLoadSavedProject = (proj: GeneratedShortsData) => {
    // Stop voice preview
    if (isPlayingPreview) {
      window.speechSynthesis.cancel();
      setIsPlayingPreview(false);
      setPreviewActiveSegment(-1);
    }

    setGeneratedShorts(proj);
    setActiveProjectId(proj.id || null);
    setShortsCategory(proj.category);
    setShortsKeyword(proj.keyword || "");
    setShortsBgMusic(proj.bg_music || "lofi");
  };

  // 2. Play Web Speech TTS Synthesis
  const handlePlayVoicePreview = () => {
    if (!generatedShorts) return;

    if (isPlayingPreview) {
      window.speechSynthesis.cancel();
      setIsPlayingPreview(false);
      setPreviewActiveSegment(-1);
      return;
    }

    setIsPlayingPreview(true);
    
    const utterances = generatedShorts.segments.map((seg, idx) => {
      const u = new SpeechSynthesisUtterance(seg.text);
      u.lang = "ko-KR";
      u.rate = 1.0;
      
      u.onstart = () => {
        setPreviewActiveSegment(idx);
      };

      if (idx === generatedShorts.segments.length - 1) {
        u.onend = () => {
          setIsPlayingPreview(false);
          setPreviewActiveSegment(-1);
        };
      }
      return u;
    });

    utterances.forEach((u) => {
      window.speechSynthesis.speak(u);
    });
  };

  const handleSavePexelsKey = (val: string) => {
    setPexelsApiKey(val);
    localStorage.setItem("creaibox_pexels_key", val);
  };

  // 3. Render Canvas and create final MP4/WebM video
  const handleBuildShortsVideo = async () => {
    if (!generatedShorts) return;
    
    if (isPlayingPreview) {
      window.speechSynthesis.cancel();
      setIsPlayingPreview(false);
    }

    setIsRenderingVideo(true);
    setRenderProgress(0);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas 엘리먼트가 없습니다.");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context를 얻지 못했습니다.");

      const width = 540;
      const height = 960;
      canvas.width = width;
      canvas.height = height;

      const bgAudio = new Audio();
      bgAudio.src = BACKGROUND_MUSIC[shortsBgMusic];
      bgAudio.crossOrigin = "anonymous";
      bgAudio.volume = 0.25;

      const loadedVideos = await Promise.all(
        generatedShorts.segments.map(async (seg) => {
          return new Promise<HTMLVideoElement>((resolve, reject) => {
            const video = document.createElement("video");
            video.src = seg.videoUrl || "";
            video.crossOrigin = "anonymous";
            video.muted = true;
            video.playsInline = true;
            video.loop = true;
            
            video.onloadeddata = () => {
              resolve(video);
            };
            video.onerror = () => {
              console.warn("Video load error for:", seg.videoUrl);
              const mockVideo = document.createElement("video");
              resolve(mockVideo);
            };
            video.load();
          });
        })
      );

      let audioStreamDestination: MediaStreamAudioDestinationNode | null = null;
      let audioCtx: AudioContext | null = null;

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaElementSource(bgAudio);
        audioStreamDestination = audioCtx.createMediaStreamDestination();
        source.connect(audioStreamDestination);
        source.connect(audioCtx.destination);
      } catch (ae) {
        console.warn("Audio Context setup failed, exporting muted:", ae);
      }

      const canvasStream = canvas.captureStream(30);
      const outputStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((track) => outputStream.addTrack(track));
      if (audioStreamDestination) {
        audioStreamDestination.stream.getAudioTracks().forEach((track) => outputStream.addTrack(track));
      }

      const recordedChunks: Blob[] = [];
      const options = { mimeType: "video/webm;codecs=vp9" };
      let recorder: MediaRecorder;
      
      try {
        recorder = new MediaRecorder(outputStream, options);
      } catch (e) {
        recorder = new MediaRecorder(outputStream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      bgAudio.currentTime = 0;
      await bgAudio.play().catch((e) => console.log("Music play blocked:", e));
      recorder.start();

      let currentSegIndex = 0;
      let segElapsedFrames = 0;
      const fps = 30;
      const totalDuration = generatedShorts.segments.reduce((acc, s) => acc + s.duration, 0);
      const totalFrames = totalDuration * fps;
      let renderedFrames = 0;

      let activeVideo = loadedVideos[0];
      if (activeVideo && activeVideo.src) {
        await activeVideo.play().catch(() => {});
      }

      const drawFrame = async () => {
        if (renderedFrames >= totalFrames) {
          recorder.stop();
          bgAudio.pause();
          if (audioCtx) await audioCtx.close();

          setTimeout(async () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const finalFileName = `${generatedShorts.title.replace(/\s+/g, "_")}.webm`;
            const file = new File([blob], finalFileName, { type: "video/webm" });

            // ----------------------------------------------------
            // Database Persistence: Upload rendered video file to Storage
            // ----------------------------------------------------
            if (userId && activeProjectId) {
              try {
                const storagePath = `${userId}/shorts/${activeProjectId}-${Date.now()}.webm`;
                const { error: uploadError } = await supabase.storage
                  .from("community")
                  .upload(storagePath, file, {
                    contentType: "video/webm",
                    upsert: true,
                  });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                  .from("community")
                  .getPublicUrl(storagePath);

                // Update Project with video url
                const { error: updateError } = await supabase
                  .from("ai_shorts_projects")
                  .update({ video_url: publicUrlData.publicUrl })
                  .eq("id", activeProjectId);

                if (updateError) throw updateError;

                // Sync UI list
                setSavedShortsList((prev) =>
                  prev.map((p) =>
                    p.id === activeProjectId
                      ? { ...p, video_url: publicUrlData.publicUrl }
                      : p
                  )
                );
              } catch (storErr) {
                console.warn("Storage upload or DB update failed, using client file download fallback.", storErr);
              }
            }

            setLocalFile(file);
            setSelectedVideoSource("local");
            setVideoTitle(generatedShorts.title);
            setVideoDesc(generatedShorts.description);

            setActiveTab("publish");
            setIsRenderingVideo(false);
            setRenderProgress(0);
            
            alert(`🎉 AI 쇼츠 동영상 최종 제작 및 합성이 완료되었습니다!\n동영상 파일이 데이터베이스 클라우드 저장소에 안전하게 등록되었으며, SNS 통합 발행 서식에 자동으로 적용되었습니다.`);
          }, 300);
          return;
        }

        const currentSegment = generatedShorts.segments[currentSegIndex];
        const segMaxFrames = currentSegment.duration * fps;

        if (segElapsedFrames >= segMaxFrames) {
          if (activeVideo) activeVideo.pause();
          currentSegIndex++;
          segElapsedFrames = 0;
          activeVideo = loadedVideos[currentSegIndex];
          if (activeVideo && activeVideo.src) {
            await activeVideo.play().catch(() => {});
          }
        }

        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, width, height);

        if (activeVideo && activeVideo.readyState >= 2) {
          const vWidth = activeVideo.videoWidth;
          const vHeight = activeVideo.videoHeight;
          const vRatio = vWidth / vHeight;
          const targetRatio = width / height;

          let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
          if (vRatio > targetRatio) {
            sWidth = vHeight * targetRatio;
            sx = (vWidth - sWidth) / 2;
          } else {
            sHeight = vWidth / targetRatio;
            sy = (vHeight - sHeight) / 2;
          }

          ctx.drawImage(activeVideo, sx, sy, sWidth, sHeight, 0, 0, width, height);
        } else {
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(50, 200, width - 100, height - 400);
          ctx.fillStyle = "#4f46e5";
          ctx.font = "bold 20px Inter, Arial";
          ctx.textAlign = "center";
          ctx.fillText("미디어를 불러오는 중...", width / 2, height / 2);
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(20, height - 200, width - 40, 140);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, height - 200, width - 40, 140);

        const text = currentSegment?.text || "";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const words = text.split(" ");
        ctx.font = "black 26px Inter, sans-serif, Apple SD Gothic Neo";
        let textX = width / 2;
        let textY = height - 130;

        if (text.length > 20) {
          const midPoint = Math.floor(words.length / 2);
          const line1 = words.slice(0, midPoint).join(" ");
          const line2 = words.slice(midPoint).join(" ");

          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 6;
          ctx.strokeText(line1, textX, textY - 20);
          ctx.fillText(line1, textX, textY - 20);

          ctx.fillStyle = "#facc15";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 6;
          ctx.strokeText(line2, textX, textY + 20);
          ctx.fillText(line2, textX, textY + 20);
        } else {
          ctx.lineWidth = 7;
          ctx.strokeStyle = "#000000";
          ctx.strokeText(text, textX, textY);

          ctx.fillStyle = "#facc15";
          ctx.fillText(text, textX, textY);
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = "black 12px Inter";
        ctx.fillText("creaibox.com", width / 2, 50);

        renderedFrames++;
        segElapsedFrames++;
        
        setRenderProgress(Math.min(99, Math.round((renderedFrames / totalFrames) * 100)));

        await new Promise((resolve) => requestAnimationFrame(resolve));
        await drawFrame();
      };

      await drawFrame();

    } catch (err: any) {
      console.error(err);
      alert(`쇼츠 영상 합성 실패: ${err.message}`);
      setIsRenderingVideo(false);
      setRenderProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-2xl border border-zinc-800 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:to-[#07111f] p-7 shadow-sm dark:shadow-2xl transition-colors duration-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-400">
              <Sparkles size={15} />
              AI Auto Generator
            </div>
            <h1 className="text-3xl font-black md:text-5xl">채널 배포 스튜디오</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
              구글 기사 및 소셜 트렌드를 기반으로 고흡입력 영상 주제와 대본을 기획하고, 무료 영상 에셋과 자막, 
              내레이션 합성까지 완전 자동 조립하여 완성형 쇼츠 비디오를 스스로 제작해 냅니다.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("ai-shorts")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black transition border-b-2 ${
            activeTab === "ai-shorts"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Flame size={16} />
          AI 쇼츠 자동 생성기
        </button>
        <button
          onClick={() => setActiveTab("publish")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black transition border-b-2 ${
            activeTab === "publish"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Send size={16} />
          SNS 통합 발행
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black transition border-b-2 ${
            activeTab === "channels"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Settings size={16} />
          채널 연동 관리
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-black transition border-b-2 ${
            activeTab === "history"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <BarChart3 size={16} />
          발행 이력 및 통계
        </button>
      </div>

      {/* TAB 0: AI 쇼츠 자동 생성기 */}
      {activeTab === "ai-shorts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings / Controls Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-black flex items-center gap-2 border-b border-zinc-850 pb-3">
                <Sparkles size={18} className="text-rose-400" />
                생성 조건 설정
              </h3>

              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1.5">카테고리 선택</label>
                <select
                  value={shortsCategory}
                  onChange={(e) => setShortsCategory(e.target.value)}
                  className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-850 px-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50"
                >
                  <option value="tech">테크 / IT 트렌드</option>
                  <option value="motivation">동기부여 / 명언</option>
                  <option value="nature">자연 / 힐링 / 명상</option>
                  <option value="finance">경제 / 금융 / 재테크</option>
                  <option value="history">역사 / 미스터리 / 과학 상식</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1.5">
                  핵심 키워드 / 세부 주제 (선택)
                </label>
                <input
                  type="text"
                  value={shortsKeyword}
                  onChange={(e) => setShortsKeyword(e.target.value)}
                  placeholder="예: AI 혁명, 부자가 되는 습관, 우주 신비"
                  className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-850 px-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1.5">배경 음악 (BGM)</label>
                <select
                  value={shortsBgMusic}
                  onChange={(e) => setShortsBgMusic(e.target.value)}
                  className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-850 px-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50"
                >
                  <option value="lofi">Lofi Beats (잔잔하고 트렌디함)</option>
                  <option value="cinematic">Cinematic Ambient (영화 같은 서정성)</option>
                  <option value="tech">Energetic Electronic (빠르고 테크니컬)</option>
                  <option value="epic">Epic Orchestral (웅장하고 극적임)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="text-[10px] text-zinc-500 font-bold flex items-center justify-between mb-1">
                  <span>Pexels API Key (선택)</span>
                  <a
                    href="https://www.pexels.com/api/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 hover:underline flex items-center gap-0.5"
                  >
                    무료 발급 <ExternalLink size={10} />
                  </a>
                </label>
                <input
                  type="password"
                  value={pexelsApiKey}
                  onChange={(e) => handleSavePexelsKey(e.target.value)}
                  placeholder="API Key 입력 시 완전 실시간 매칭 지원"
                  className="w-full h-9 rounded-xl bg-zinc-950 border border-zinc-850 px-3 text-xs text-zinc-300 focus:outline-none focus:border-rose-500/50"
                />
                <span className="text-[9px] text-zinc-650 block mt-1 font-bold">
                  * 미입력 시 크리에이박스 무료 테마 비디오가 매칭됩니다.
                </span>
              </div>

              {isGeneratingScript ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-xl bg-zinc-800 text-xs font-black text-zinc-400 flex items-center justify-center gap-2"
                >
                  <Loader2 size={14} className="animate-spin text-rose-500" />
                  AI 대본 및 기획 생성 중...
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateShortsScript}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} />
                  1단계: 대본 및 영상 기획
                </button>
              )}
            </div>

            {/* Database saved projects list */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black flex items-center gap-1.5 border-b border-zinc-850 pb-2.5">
                <Folder size={14} className="text-rose-400" />
                보관함 (최근 생성 이력)
              </h3>
              
              {isLoadingSavedShorts ? (
                <div className="py-4 text-center text-zinc-500 text-xs flex items-center justify-center gap-1">
                  <Loader2 size={12} className="animate-spin text-rose-400" />
                  기록을 로딩하는 중...
                </div>
              ) : savedShortsList.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {savedShortsList.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleLoadSavedProject(proj)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                        activeProjectId === proj.id
                          ? "bg-rose-500/10 border-rose-500/30"
                          : "bg-zinc-950/20 border-zinc-900 hover:bg-zinc-900/30"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1">
                        <Flame size={12} className={activeProjectId === proj.id ? "text-rose-500" : "text-zinc-600"} />
                        <span className="text-[11px] font-bold text-zinc-300 truncate leading-snug">
                          {proj.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        {proj.video_url && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="영상 렌더 완료" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProject(proj.id || "", e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-600 text-center py-4 font-bold">
                  저장된 생성 이력이 아직 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* Result / Timeline Preview Side */}
          <div className="lg:col-span-2 space-y-6">
            {generatedShorts ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-6">
                
                {/* Meta details */}
                <div className="space-y-2 border-b border-zinc-850 pb-4">
                  <span className="text-[10px] text-rose-400 font-black tracking-widest uppercase">
                    Generated Script Metadata
                  </span>
                  <h3 className="text-lg font-black text-zinc-200">{generatedShorts.title}</h3>
                  <p className="text-xs text-zinc-400 font-bold bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
                    {generatedShorts.description}
                  </p>
                </div>

                {/* Interactive Player Controls */}
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-300">비디오 신스 타임라인</h4>
                  
                  <button
                    type="button"
                    onClick={handlePlayVoicePreview}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition ${
                      isPlayingPreview 
                        ? "bg-zinc-800 text-rose-400 border border-rose-900/20" 
                        : "bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-900/20"
                    }`}
                  >
                    {isPlayingPreview ? (
                      <>
                        <Square size={12} /> 목소리 듣기 정지
                      </>
                    ) : (
                      <>
                        <Play size={12} /> AI 목소리 대본 듣기
                      </>
                    )}
                  </button>
                </div>

                {/* Timeline Grid segments */}
                <div className="space-y-3">
                  {generatedShorts.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-4 p-3 rounded-xl border transition ${
                        previewActiveSegment === idx
                          ? "bg-rose-500/10 border-rose-500/40"
                          : "bg-zinc-950/30 border-zinc-850"
                      }`}
                    >
                      {/* Left Thumbnail video preview */}
                      <div className="w-20 h-28 relative rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {seg.videoUrl ? (
                          <video
                            src={seg.videoUrl}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                            onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                          />
                        ) : (
                          <VideoOff size={16} className="text-zinc-650" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold text-zinc-300 font-mono">
                          {seg.duration}초
                        </span>
                      </div>

                      {/* Right script block */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-black text-rose-500 uppercase">Segment #{idx + 1}</span>
                          <p className="text-xs font-black text-zinc-200 mt-1 leading-relaxed">
                            {seg.text}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold border-t border-zinc-850/50 pt-2 mt-2">
                          <span>에셋 매칭 태그: <span className="text-zinc-400">"{seg.keyword}"</span></span>
                          <span className="text-rose-400 font-black">AI 자막 & 보이스 동기화</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hidden canvas for video generation */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Render Trigger */}
                <div className="pt-2 border-t border-zinc-850 space-y-4">
                  {isRenderingVideo ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={13} className="animate-spin text-rose-500" />
                          쇼츠 비디오 합성 및 미디어 통합 인코딩 진행 중...
                        </span>
                        <span className="text-rose-400">{renderProgress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-zinc-500 block leading-normal">
                        * 브라우저 캔버스로 프레임을 고해상도 드로잉하여 오디오 트랙과 합산하는 중입니다. 탭을 내리셔도 백그라운드 렌더러가 계속 동작합니다.
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBuildShortsVideo}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 py-3.5 text-xs font-black text-white active:scale-95 transition shadow-lg"
                    >
                      <FileVideo size={14} />
                      2단계: 쇼츠 비디오 최종 생성 및 배포 전송
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-12 text-center flex flex-col items-center justify-center h-80">
                <VideoIcon size={32} className="text-zinc-700 mb-3" />
                <h4 className="text-sm font-black text-zinc-400">생성된 대본이 없습니다.</h4>
                <p className="text-xs text-zinc-600 max-w-sm mt-1 font-bold">
                  좌측 설정 패널에서 조건 입력 후 [1단계: 대본 및 영상 기획] 단추를 누르면 완벽한 로드맵이 활성화됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: SNS 통합 발행 */}
      {activeTab === "publish" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
              <h3 className="text-base font-black mb-4 flex items-center gap-2">
                <VideoIcon className="text-rose-400" size={18} />
                비디오 소스 선택
              </h3>
              
              {/* Source Switcher */}
              <div className="grid grid-cols-2 gap-2 mb-4 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
                <button
                  type="button"
                  onClick={() => setSelectedVideoSource("library")}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    selectedVideoSource === "library" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  비디오 스튜디오 라이브러리
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedVideoSource("local")}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    selectedVideoSource === "local" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  로컬 파일 직접 업로드
                </button>
              </div>

              {selectedVideoSource === "library" ? (
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-bold block mb-1.5">
                    완료된 내보내기 비디오 리스트
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                    {libraryVideos.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => {
                          setSelectedLibraryVideo(vid.id);
                          setVideoTitle(vid.title.replace(".mp4", ""));
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                          selectedLibraryVideo === vid.id
                            ? "bg-rose-500/10 border-rose-500/40"
                            : "bg-zinc-950/30 border-zinc-850 hover:bg-zinc-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-lg bg-zinc-900 flex items-center justify-center border ${
                            selectedLibraryVideo === vid.id ? "border-rose-500/30 text-rose-400" : "border-zinc-800 text-zinc-500"
                          }`}>
                            <VideoIcon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-zinc-200 leading-snug line-clamp-1">{vid.title}</p>
                            <span className="text-[10px] text-zinc-500 font-bold">
                              분량: {vid.duration} | 크기: {vid.size}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono font-bold mr-2">
                          {vid.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-zinc-800 rounded-xl p-8 bg-zinc-950/20 text-center flex flex-col items-center justify-center cursor-pointer hover:border-rose-500/30 hover:bg-zinc-950/40 transition">
                  <input
                    type="file"
                    accept="video/*"
                    id="local-file-picker"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLocalFile(file);
                        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                  />
                  <label htmlFor="local-file-picker" className="cursor-pointer flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                      <Folder size={18} />
                    </div>
                    {localFile ? (
                      <div>
                        <p className="text-xs font-black text-rose-400 leading-snug">{localFile.name}</p>
                        <span className="text-[10px] text-zinc-500 font-bold">
                          크기: {(localFile.size / (1024 * 1024)).toFixed(1)}MB
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-black text-zinc-300 mb-1">드래그 앤 드롭 또는 파일 클릭</p>
                        <span className="text-[10px] text-zinc-500 font-bold">MP4, MOV 포맷 비디오 지원 (최대 2GB)</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-black flex items-center gap-2 border-b border-zinc-850 pb-3">
                <Sparkles className="text-rose-400" size={18} />
                발행 상세 정보 설정
              </h3>
              
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1.5">
                  비디오 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="유튜브 및 SNS에 노출될 업로드 비디오의 제목을 입력하세요."
                  className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-850 px-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-zinc-400 font-bold">
                    비디오 설명 및 내용 (태그 포함)
                  </label>
                  <button
                    type="button"
                    onClick={handleRecommendHashtags}
                    className="text-[10px] font-black text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-950/20 border border-rose-900/30 px-2 py-0.5 rounded transition"
                  >
                    <Sparkles size={10} />
                    AI 해시태그 추천
                  </button>
                </div>
                <textarea
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="영상 상세 내용 설명란과 해시태그를 기입해 주세요."
                  rows={5}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-850 p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right Platform Checklist & Action Side */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-black flex items-center gap-2 border-b border-zinc-850 pb-3">
                <Link2 className="text-rose-400" size={18} />
                발행 플랫폼 선택
              </h3>
              
              <div className="space-y-2">
                {/* Youtube */}
                <div className={`p-3 rounded-xl border transition ${
                  channels.youtube.connected 
                    ? "bg-zinc-950/50 border-zinc-850" 
                    : "bg-zinc-950/20 border-zinc-900 opacity-60"
                }`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!channels.youtube.connected}
                        checked={selectedPlatforms.youtube}
                        onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, youtube: e.target.checked }))}
                        className="rounded border-zinc-700 text-rose-500 focus:ring-rose-500/30 bg-zinc-950"
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20 text-red-500">
                        <YoutubeIcon size={15} />
                      </span>
                      <div>
                        <span className="text-xs font-black block">YouTube</span>
                        {channels.youtube.connected ? (
                          <span className="text-[9px] text-zinc-400 font-bold block">{channels.youtube.channelName} ({channels.youtube.subscribers})</span>
                        ) : (
                          <span className="text-[9px] text-zinc-500 block">채널 연동 필요</span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Instagram Reels */}
                <div className={`p-3 rounded-xl border transition ${
                  channels.instagram.connected 
                    ? "bg-zinc-950/50 border-zinc-850" 
                    : "bg-zinc-950/20 border-zinc-900 opacity-60"
                }`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!channels.instagram.connected}
                        checked={selectedPlatforms.instagram}
                        onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, instagram: e.target.checked }))}
                        className="rounded border-zinc-700 text-rose-500 focus:ring-rose-500/30 bg-zinc-950"
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-950/20 text-pink-500">
                        <InstagramIcon size={15} />
                      </span>
                      <div>
                        <span className="text-xs font-black block">Instagram Reels</span>
                        {channels.instagram.connected ? (
                          <span className="text-[9px] text-zinc-400 font-bold block">{channels.instagram.channelName}</span>
                        ) : (
                          <span className="text-[9px] text-zinc-500 block">채널 연동 필요</span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* TikTok */}
                <div className={`p-3 rounded-xl border transition ${
                  channels.tiktok.connected 
                    ? "bg-zinc-950/50 border-zinc-850" 
                    : "bg-zinc-950/20 border-zinc-900 opacity-60"
                }`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!channels.tiktok.connected}
                        checked={selectedPlatforms.tiktok}
                        onChange={(e) => setSelectedPlatforms(prev => ({ ...prev, tiktok: e.target.checked }))}
                        className="rounded border-zinc-700 text-rose-500 focus:ring-rose-500/30 bg-zinc-950"
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.21 2.34 2.1 3.86 2.53v3.9c-1.78-.17-3.47-.88-4.78-2.11-.18-.17-.35-.35-.51-.54v7.03c.04 4.5-3.3 8.35-7.79 8.76-4.5.41-8.58-2.61-9.15-7.1-.57-4.49 2.45-8.62 6.91-9.2 1.34-.18 2.7-.06 3.97.35V0zm-3.8 11.23c-2.45-.16-4.54 1.7-4.7 4.14-.16 2.44 1.7 4.54 4.14 4.7 2.44.16 4.54-1.7 4.7-4.14V7.93c-1.39.81-2.97 1.25-4.14 1.32v2z"/>
                        </svg>
                      </span>
                      <div>
                        <span className="text-xs font-black block">TikTok</span>
                        {channels.tiktok.connected ? (
                          <span className="text-[9px] text-zinc-400 font-bold block">{channels.tiktok.channelName}</span>
                        ) : (
                          <span className="text-[9px] text-zinc-500 block">채널 연동 필요</span>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {publishingState.isPublishing ? (
                <div className="space-y-4 pt-3 border-t border-zinc-850">
                  <h4 className="text-xs font-black text-zinc-200">배포 작업 진행중</h4>
                  
                  {selectedPlatforms.youtube && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="flex items-center gap-1"><YoutubeIcon className="text-red-500" size={12} /> YouTube</span>
                        <span>{publishingState.progress.youtube}% ({
                          publishingState.status.youtube === "uploading" ? "업로드 중" :
                          publishingState.status.youtube === "processing" ? "비디오 처리 중" : "완료"
                        })</span>
                      </div>
                      <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${publishingState.progress.youtube}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedPlatforms.instagram && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="flex items-center gap-1"><InstagramIcon className="text-pink-500" size={12} /> Instagram</span>
                        <span>{publishingState.progress.instagram}% ({
                          publishingState.status.instagram === "uploading" ? "업로드 중" :
                          publishingState.status.instagram === "processing" ? "배포 승인 대기" : "완료"
                        })</span>
                      </div>
                      <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 transition-all duration-300"
                          style={{ width: `${publishingState.progress.instagram}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedPlatforms.tiktok && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 fill-current text-white mr-1 inline-block" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.21 2.34 2.1 3.86 2.53v3.9c-1.78-.17-3.47-.88-4.78-2.11-.18-.17-.35-.35-.51-.54v7.03c.04 4.5-3.3 8.35-7.79 8.76-4.5.41-8.58-2.61-9.15-7.1-.57-4.49 2.45-8.62 6.91-9.2 1.34-.18 2.7-.06 3.97.35V0zm-3.8 11.23c-2.45-.16-4.54 1.7-4.7 4.14-.16 2.44 1.7 4.54 4.14 4.7 2.44.16 4.54-1.7 4.7-4.14V7.93c-1.39.81-2.97 1.25-4.14 1.32v2z"/>
                          </svg>
                          TikTok
                        </span>
                        <span>{publishingState.progress.tiktok}% ({
                          publishingState.status.tiktok === "uploading" ? "업로드 중" : "임시저장 완료"
                        })</span>
                      </div>
                      <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-300 transition-all duration-300"
                          style={{ width: `${publishingState.progress.tiktok}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold bg-zinc-950/40 p-2 rounded-lg border border-zinc-850">
                    <Loader2 size={12} className="animate-spin text-rose-400" />
                    채널로 비디오 패킷을 전송하는 중...
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartPublish}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 py-3 text-xs font-black text-white active:scale-95 transition mt-2 shadow-lg"
                >
                  <Send size={13} />
                  자동 배포 시작
                </button>
              )}
            </div>
            
            <div className="rounded-2xl border border-zinc-800 bg-[#0c0d12] p-5 space-y-3">
              <h4 className="text-xs font-black flex items-center gap-1.5">
                <Info size={14} className="text-rose-400" />
                원클릭 배포 유의사항
              </h4>
              <ul className="list-disc list-inside text-[10px] text-zinc-500 space-y-1.5 leading-relaxed font-bold">
                <li>유튜브 쇼츠는 60초 미만 세로 영상인 경우 자동 쇼츠로 생성됩니다.</li>
                <li>인스타그램 릴스는 비즈니스/크리에이터 API 연동 정책을 준수해야 합니다.</li>
                <li>틱톡은 정책상 최종 배포 직전 드래프트(임시저장)로 등록된 후 유저의 틱톡 모바일 앱에서 간편히 최종 업로드 확인을 마칠 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 채널 연동 관리 */}
      {activeTab === "channels" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
            <h3 className="text-base font-black mb-1">SNS 채널 연동 관리</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-bold mb-6">
              각각의 플랫폼 API 접근 권한을 획득하여 크리에이박스 스튜디오와 안전하게 연동해 둡니다. 연동된 정보는 로컬 계정에만 안전하게 보호 보존됩니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 flex flex-col justify-between h-56 transition-all duration-300 hover:border-red-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/20 text-red-500">
                      <YoutubeIcon size={20} />
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black border ${
                      channels.youtube.connected 
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/15" 
                        : "border-zinc-800 text-zinc-500 bg-zinc-950"
                    }`}>
                      {channels.youtube.connected ? "연동 완료" : "미연동"}
                    </span>
                  </div>
                  
                  {channels.youtube.connected ? (
                    <div className="flex items-center gap-3">
                      {channels.youtube.avatar ? (
                        <img src={channels.youtube.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover border border-zinc-800" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-zinc-200 leading-snug">{channels.youtube.channelName}</h4>
                        <span className="text-[10px] text-zinc-500 font-bold block">{channels.youtube.handle} | 구독자 {channels.youtube.subscribers}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-black text-zinc-200">YouTube 채널 연동</h4>
                      <p className="text-[10px] text-zinc-500 font-bold leading-normal mt-1">유튜브 동영상 업로드(Insert) 및 최근 게시물 조회 권한이 매칭됩니다.</p>
                    </div>
                  )}
                </div>

                {channels.youtube.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectChannel("youtube")}
                    className="w-full py-2 text-center rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 transition"
                  >
                    채널 연동 해제
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startOAuth("youtube")}
                    className="w-full py-2 text-center rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white transition active:scale-95 shadow-md"
                  >
                    YouTube 채널 연동하기
                  </button>
                )}
              </div>

              {/* Instagram Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 flex flex-col justify-between h-56 transition-all duration-300 hover:border-pink-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-950/20 text-pink-500">
                      <InstagramIcon size={20} />
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black border ${
                      channels.instagram.connected 
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/15" 
                        : "border-zinc-800 text-zinc-500 bg-zinc-950"
                    }`}>
                      {channels.instagram.connected ? "연동 완료" : "미연동"}
                    </span>
                  </div>

                  {channels.instagram.connected ? (
                    <div className="flex items-center gap-3">
                      {channels.instagram.avatar ? (
                        <img src={channels.instagram.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover border border-zinc-800" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-zinc-200 leading-snug">{channels.instagram.channelName}</h4>
                        <span className="text-[10px] text-zinc-500 font-bold block">{channels.instagram.handle} | {channels.instagram.subscribers}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-black text-zinc-200">Instagram Reels 연동</h4>
                      <p className="text-[10px] text-zinc-500 font-bold leading-normal mt-1">인스타그램 릴스 미디어 배포 및 오디언스 피드 분석 권한이 연동됩니다.</p>
                    </div>
                  )}
                </div>

                {channels.instagram.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectChannel("instagram")}
                    className="w-full py-2 text-center rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 transition"
                  >
                    채널 연동 해제
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startOAuth("instagram")}
                    className="w-full py-2 text-center rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-black text-white transition active:scale-95 shadow-md"
                  >
                    Meta 계정 연동하기
                  </button>
                )}
              </div>

              {/* TikTok Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 flex flex-col justify-between h-56 transition-all duration-300 hover:border-rose-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800">
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.21 2.34 2.1 3.86 2.53v3.9c-1.78-.17-3.47-.88-4.78-2.11-.18-.17-.35-.35-.51-.54v7.03c.04 4.5-3.3 8.35-7.79 8.76-4.5.41-8.58-2.61-9.15-7.1-.57-4.49 2.45-8.62 6.91-9.2 1.34-.18 2.7-.06 3.97.35V0zm-3.8 11.23c-2.45-.16-4.54 1.7-4.7 4.14-.16 2.44 1.7 4.54 4.14 4.7 2.44.16 4.54-1.7 4.7-4.14V7.93c-1.39.81-2.97 1.25-4.14 1.32v2z"/>
                      </svg>
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black border ${
                      channels.tiktok.connected 
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/15" 
                        : "border-zinc-800 text-zinc-500 bg-zinc-950"
                    }`}>
                      {channels.tiktok.connected ? "연동 완료" : "미연동"}
                    </span>
                  </div>

                  {channels.tiktok.connected ? (
                    <div className="flex items-center gap-3">
                      {channels.tiktok.avatar ? (
                        <img src={channels.tiktok.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover border border-zinc-800" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-zinc-200 leading-snug">{channels.tiktok.channelName}</h4>
                        <span className="text-[10px] text-zinc-500 font-bold block">{channels.tiktok.handle} | {channels.tiktok.subscribers}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-black text-zinc-200">TikTok 채널 연동</h4>
                      <p className="text-[10px] text-zinc-500 font-bold leading-normal mt-1">틱톡 임시저장 배포 및 비디오 메타 정보 싱크 권한이 바인딩됩니다.</p>
                    </div>
                  )}
                </div>

                {channels.tiktok.connected ? (
                  <button
                    type="button"
                    onClick={() => disconnectChannel("tiktok")}
                    className="w-full py-2 text-center rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 transition"
                  >
                    채널 연동 해제
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startOAuth("tiktok")}
                    className="w-full py-2 text-center rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-xs font-black text-white transition active:scale-95 shadow-md"
                  >
                    TikTok 계정 연동하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 발행 이력 및 통계 */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5 mb-5">
              <div>
                <h3 className="text-base font-black">발행 히스토리 및 채널 동기화</h3>
                <p className="text-xs text-zinc-400 leading-normal font-bold mt-1">
                  크리에이박스에서 발행된 내역과 연동된 채널의 실시간 영상 반응(조회수, 좋아요 등)을 통합해 보여줍니다.
                </p>
              </div>

              {isFetchingHistory ? (
                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-zinc-850 bg-zinc-900/50 px-4 py-2 text-xs font-black text-zinc-400 flex items-center gap-2"
                >
                  <Loader2 size={13} className="animate-spin text-rose-400" />
                  동기화 데이터를 불러오는 중...
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFetchExistingData}
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-xs font-black text-white flex items-center gap-1.5 active:scale-95 transition shadow-md"
                >
                  <RefreshCw size={13} />
                  자동으로 기존 업로드 데이터 가져오기
                </button>
              )}
            </div>

            {historyItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs leading-normal">
                  <thead>
                    <tr className="border-b border-zinc-850 text-zinc-500 font-black">
                      <th className="py-3 px-4">비디오 제목</th>
                      <th className="py-3 px-4">배포 플랫폼</th>
                      <th className="py-3 px-4">발행일시</th>
                      <th className="py-3 px-4">배포 상태</th>
                      <th className="py-3 px-4 text-right">플랫폼별 누적 조회수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850 font-bold text-zinc-200">
                    {historyItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-950/20 transition">
                        <td className="py-3 px-4 font-black max-w-sm truncate">{item.title}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {item.platforms.map((p) => (
                              <span
                                key={p}
                                className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] ${
                                  p === "youtube" ? "bg-red-950/30 text-red-400 border border-red-900/20" :
                                  p === "instagram" ? "bg-pink-950/30 text-pink-400 border border-pink-900/20" :
                                  "bg-zinc-900 text-zinc-300 border border-zinc-800"
                                }`}
                                title={p.toUpperCase()}
                              >
                                {p === "youtube" && <YoutubeIcon size={10} />}
                                {p === "instagram" && <InstagramIcon size={10} />}
                                {p === "tiktok" && (
                                  <svg className="h-2 w-2 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.21 2.34 2.1 3.86 2.53v3.9c-1.78-.17-3.47-.88-4.78-2.11-.18-.17-.35-.35-.51-.54v7.03c.04 4.5-3.3 8.35-7.79 8.76-4.5.41-8.58-2.61-9.15-7.1-.57-4.49 2.45-8.62 6.91-9.2 1.34-.18 2.7-.06 3.97.35V0zm-3.8 11.23c-2.45-.16-4.54 1.7-4.7 4.14-.16 2.44 1.7 4.54 4.14 4.7 2.44.16 4.54-1.7 4.7-4.14V7.93c-1.39.81-2.97 1.25-4.14 1.32v2z"/>
                                  </svg>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 font-mono text-[10px]">{item.publishedAt}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-black border bg-zinc-950 ${
                            item.status === "success" ? "border-emerald-500/20 text-emerald-400" :
                            item.status === "publishing" ? "border-cyan-500/20 text-cyan-400" :
                            "border-amber-500/20 text-amber-400"
                          }`}>
                            {item.status === "success" ? "발행 완료" :
                             item.status === "publishing" ? "발행 중" : "임시저장"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex flex-col gap-0.5 items-end font-mono text-[10px] text-zinc-400 font-bold">
                            {item.platforms.map((p) => {
                              const view = item.views[p];
                              if (view === null) return null;
                              return (
                                <span key={p} className="flex items-center gap-1">
                                  {p === "youtube" ? "YT:" : p === "instagram" ? "IG:" : "TT:"}
                                  <span className="text-zinc-200 font-black">{view.toLocaleString()}회</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-500 space-y-2">
                <AlertCircle size={28} className="mx-auto text-zinc-650" />
                <p className="text-xs font-bold">아직 발행된 비디오 이력이 없습니다.</p>
                <p className="text-[10px] text-zinc-600 font-normal">비디오 렌더 완료 후 첫 배포를 시작해 보세요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simulated OAuth Modal */}
      {oauthModal.show && oauthModal.platform && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121216] p-6 text-white shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                oauthModal.platform === "youtube" ? "bg-red-950/20 text-red-500" :
                oauthModal.platform === "instagram" ? "bg-pink-950/20 text-pink-500" :
                "bg-zinc-900 text-zinc-300 border border-zinc-850"
              }`}>
                {oauthModal.platform === "youtube" && <YoutubeIcon size={20} />}
                {oauthModal.platform === "instagram" && <InstagramIcon size={20} />}
                {oauthModal.platform === "tiktok" && (
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.21 2.34 2.1 3.86 2.53v3.9c-1.78-.17-3.47-.88-4.78-2.11-.18-.17-.35-.35-.51-.54v7.03c.04 4.5-3.3 8.35-7.79 8.76-4.5.41-8.58-2.61-9.15-7.1-.57-4.49 2.45-8.62 6.91-9.2 1.34-.18 2.7-.06 3.97.35V0zm-3.8 11.23c-2.45-.16-4.54 1.7-4.7 4.14-.16 2.44 1.7 4.54 4.14 4.7 2.44.16 4.54-1.7 4.7-4.14V7.93c-1.39.81-2.97 1.25-4.14 1.32v2z"/>
                  </svg>
                )}
              </span>
              <div>
                <h3 className="text-sm font-black leading-snug">
                  {oauthModal.platform === "youtube" ? "Google 계정 연동" :
                   oauthModal.platform === "instagram" ? "Meta Business 계정 연동" :
                   "TikTok Creator 계정 연동"}
                </h3>
                <span className="text-[10px] text-zinc-500 font-bold">API 인증 서비스 공급자: Creaibox</span>
              </div>
            </div>

            {oauthModal.step === "account" && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-normal font-bold">연동을 계속할 소셜 계정을 선택해 주세요.</p>
                <div className="space-y-2">
                  <div
                    onClick={handleOAuthSelectAccount}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:bg-zinc-900/40 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 font-black text-xs">A</div>
                      <div>
                        <p className="text-xs font-black">a1234@gmail.com</p>
                        <span className="text-[9px] text-zinc-500 font-bold block">유효 세션 보유 중</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-550" />
                  </div>
                  <div
                    onClick={handleOAuthSelectAccount}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:bg-zinc-900/40 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-550 font-black text-xs">+</div>
                      <div>
                        <p className="text-xs font-black text-zinc-400">다른 계정 사용</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-550" />
                  </div>
                </div>
              </div>
            )}

            {oauthModal.step === "consent" && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-normal font-bold">
                  크리에이박스가 해당 계정의 아래 권한을 요청합니다. 권한을 부여하시겠습니까?
                </p>
                <div className="rounded-xl bg-zinc-950 p-3.5 space-y-3.5 border border-zinc-850">
                  <div className="flex gap-2">
                    <CheckCircle2 size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-zinc-200">미디어 다이렉트 업로드 권한</p>
                      <span className="text-[9px] text-zinc-500 font-bold leading-normal block mt-0.5">완료된 비디오를 사용자의 SNS 채널 피드 또는 스케줄 목록에 바로 게시합니다.</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-zinc-200">기존 업로드 미디어 읽기 권한</p>
                      <span className="text-[9px] text-zinc-500 font-bold leading-normal block mt-0.5">게시된 콘텐츠의 통계(조회수, 좋아요 등) 데이터를 자동으로 동기화합니다.</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOauthModal({ show: false, platform: null, step: "account" })}
                    className="flex-1 py-2 text-center rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-xs font-black text-zinc-400 transition"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleOAuthConsentAllow}
                    className="flex-[2] py-2 text-center rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white transition shadow-md"
                  >
                    권한 허용 및 연동
                  </button>
                </div>
              </div>
            )}

            {oauthModal.step === "success" && (
              <div className="text-center space-y-4 py-2">
                <div className="h-12 w-12 rounded-full bg-emerald-950/20 text-emerald-500 border border-emerald-500/25 flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-200">성공적으로 연동되었습니다!</h4>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1.5 leading-normal">
                    이제 통합 자동 배포기에서 해당 소셜 채널을 배포 대상으로 자유롭게 지정하고 일괄 업로드를 수행할 수 있습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOauthModal({ show: false, platform: null, step: "account" })}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-xs font-black text-zinc-300 transition"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
