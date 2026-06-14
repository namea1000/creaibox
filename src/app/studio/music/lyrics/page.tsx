"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Sparkles } from "lucide-react";
import {
  mapLyricsGenreOption,
  mapLyricsMoodOption,
  mapLyricsVocalOption,
  mapLyricsTempoOption,
  mapLyricsInstrumentOption,
} from "@/lib/music-lyrics-planner/utils";
import {
  generateGeminiContentWithFallback,
  getPublicGeminiFallbackNotice,
  getUserAiVaultConfig,
} from "@/lib/client/api-vault";

import LyricsInputPanel from "@/components/music/lyrics/LyricsInputPanel";
import LyricsControlPanel from "@/components/music/lyrics/LyricsControlPanel";
import LyricsResultPanel from "@/components/music/lyrics/LyricsResultPanel";
import type {
  MusicFormState,
  MusicResultState,
  SongItem,
} from "@/components/music/lyrics/types";

const AUTH_RETRY_DELAY_MS = 700;
const AUTH_RETRY_ATTEMPTS = 3;
const AI_RETRY_ATTEMPTS = 3;
const AI_RETRY_DELAY_MS = 1200;

const GEMINI_MODEL_FALLBACKS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
];

const DEFAULT_STRUCTURE =
  "[일반적인 노래, 약 3분] Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Bridge - Final Chorus - Outro";

const ALBUM_PLAN_TO_LYRICS_KEY = "creaibox:music:album-plan-to-lyrics:v1";

type AlbumPlanTrackPayload = {
  trackNo?: number;
  title?: string;
};

type AlbumPlanPayload = {
  planId?: string;
  tracks?: AlbumPlanTrackPayload[];
};

const initialForm: MusicFormState = {
  genre: "K-pop",
  mood: "Melancholic Dawn",
  vocal: "Female Solo",
  tempo: "90-110 BPM",
  instrument: "Piano",
  theme: "",
  language: "Korean",
  structure: DEFAULT_STRUCTURE,
  generationCount: 1,
};

const initialResult: MusicResultState = {
  title: "",
  lyrics: "",
  sunoPrompt: "",
  youtubeTitles: [],
  youtubeDescription: "",
  hashtags: [],
  conceptDescription: "",
  visualDescription: "",
  videoDescription: "",
  savedId: "",
  batchId: "",
  songs: [],
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isHighDemandError(error: any) {
  const message = String(error?.message || error || "").toLowerCase();

  return (
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("try again later")
  );
}

function getFriendlyAiErrorMessage(error: any) {
  if (isHighDemandError(error)) {
    return "AI 서버가 현재 혼잡합니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 자동으로 다른 모델을 시도합니다.";
  }

  return "AI 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function extractJson(text: string) {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    if (firstBrace >= 0) {
      let depth = 0;
      let inString = false;
      let escaped = false;

      for (let index = firstBrace; index < cleaned.length; index += 1) {
        const char = cleaned[index];

        if (escaped) {
          escaped = false;
          continue;
        }

        if (char === "\\") {
          escaped = true;
          continue;
        }

        if (char === "\"") {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (char === "{") depth += 1;
        if (char === "}") depth -= 1;

        if (depth === 0) {
          return JSON.parse(cleaned.slice(firstBrace, index + 1));
        }
      }
    }

    throw new Error("AI 응답을 JSON으로 변환하지 못했습니다.");
  }
}

function MusicLyricsPageContent() {
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const albumAutoRunRef = useRef(false);
  const [albumPlanPayload, setAlbumPlanPayload] = useState<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [userNickname, setUserNickname] = useState("");
  const [form, setForm] = useState<MusicFormState>(initialForm);
  const [result, setResult] = useState<MusicResultState>(initialResult);
  const [rawResult, setRawResult] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatusMessage, setGenerationStatusMessage] = useState("");
  const [generationErrorMessage, setGenerationErrorMessage] = useState("");

  const autoTheme =
    form.theme.trim() ||
    `${form.mood} 감성의 ${form.genre} 곡. ${form.vocal} 보컬이 ${form.instrument} 중심 사운드 위에서 부르는 감성적인 노래`;

  const fallbackSunoPrompt = `${form.vocal}, ${form.genre}, ${form.instrument} driven, ${form.mood}, ${form.tempo}, emotional melody, polished production, clear vocal mix, cinematic atmosphere, ${form.language} lyrics`;

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const startProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    progressTimerRef.current = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 88) return prev;
        const next = prev + Math.floor(Math.random() * 5) + 2;
        return Math.min(next, 88);
      });
    }, 900);
  };

  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const resolveAuthUser = async (): Promise<User | null> => {
    for (let attempt = 0; attempt < AUTH_RETRY_ATTEMPTS; attempt += 1) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) return session.user;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) return user;

      if (attempt < AUTH_RETRY_ATTEMPTS - 1) {
        await wait(AUTH_RETRY_DELAY_MS);
      }
    }

    return null;
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = await resolveAuthUser();

      if (user) {
        setActiveUser(user);

        const { data: prof } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (prof?.nickname) setUserNickname(prof.nickname);
      }
    };

    void loadUser();
  }, [supabase]);

  const copyText = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    alert("복사되었습니다.");
  };

  const getFinalAuthor = (user: User) => {
    return (
      userNickname ||
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Unknown"
    );
  };

  const normalizeSongsForSave = (targetResult: MusicResultState): SongItem[] => {
    if (targetResult.songs.length > 0) {
      const editedFirstSong: SongItem = {
        title: targetResult.title,
        lyrics: targetResult.lyrics,
        sunoPrompt: targetResult.sunoPrompt,
        youtubeTitles: targetResult.youtubeTitles || [],
        youtubeDescription: targetResult.youtubeDescription || "",
        hashtags: targetResult.hashtags || [],
        conceptDescription: targetResult.conceptDescription || "",
        visualDescription: targetResult.visualDescription || "",
        videoDescription: targetResult.videoDescription || "",
      };

      return [editedFirstSong, ...targetResult.songs.slice(1)];
    }

    return [
      {
        title: targetResult.title,
        lyrics: targetResult.lyrics,
        sunoPrompt: targetResult.sunoPrompt,
        youtubeTitles: targetResult.youtubeTitles || [],
        youtubeDescription: targetResult.youtubeDescription || "",
        hashtags: targetResult.hashtags || [],
        conceptDescription: targetResult.conceptDescription || "",
        visualDescription: targetResult.visualDescription || "",
        videoDescription: targetResult.videoDescription || "",
      },
    ];
  };

  const markAlbumPlanLyricsGenerated = async (
    payload?: AlbumPlanPayload | null,
    savedSongs?: SongItem[]
  ) => {
    if (!payload?.planId || !Array.isArray(payload.tracks) || payload.tracks.length === 0) {
      return;
    }

    if (!Array.isArray(savedSongs) || savedSongs.length === 0) {
      return;
    }

    const savedTitles = new Set(
      savedSongs
        .map((song) => String(song.title || "").trim())
        .filter(Boolean)
    );

    const targetTrackNos = new Set(
      payload.tracks
        .filter((track) => savedTitles.has(String(track.title || "").trim()))
        .map((track) => Number(track.trackNo))
        .filter((trackNo) => Number.isFinite(trackNo))
    );
    const targetTitles = new Set(
      payload.tracks
        .map((track) => String(track.title || "").trim())
        .filter((title) => title && savedTitles.has(title))
    );

    const { data, error } = await supabase
      .from("music_album_plans")
      .select("track_list")
      .eq("id", payload.planId)
      .maybeSingle();

    if (error || !data) {
      console.warn("앨범 기획 가사 생성 상태 조회 실패:", error);
      return;
    }

    const currentTracks = Array.isArray(data.track_list) ? data.track_list : [];
    const nextTracks = currentTracks.map((track: any) => {
      const trackNo = Number(track?.trackNo);
      const title = String(track?.title || "").trim();
      const isTarget = targetTrackNos.has(trackNo) || targetTitles.has(title);

      return isTarget
        ? {
          ...track,
          lyricsGenerated: true,
        }
        : track;
    });

    const { error: updateError } = await supabase
      .from("music_album_plans")
      .update({ track_list: nextTracks })
      .eq("id", payload.planId);

    if (updateError) {
      console.warn("앨범 기획 가사 생성 상태 업데이트 실패:", updateError);
    }
  };

  const createBatch = async ({
    user,
    finalAuthor,
    generationCount,
    finalRawResult,
    savedSongIndex,
  }: {
    user: User;
    finalAuthor: string;
    generationCount: number;
    finalRawResult: any;
    savedSongIndex?: number;
  }) => {
    const batchPayload = {
      user_id: user.id,
      user_email: user.email,
      user_nicename: finalAuthor,
      theme: autoTheme,
      genre: form.genre,
      mood: form.mood,
      vocal: form.vocal,
      tempo: form.tempo,
      instrument: form.instrument,
      language: form.language,
      structure: form.structure,
      generation_count: generationCount,
      model_name: "gemini-fallback-chain",
      status: "saved",
      raw_request: {
        form: {
          ...form,
          theme: autoTheme,
        },
        requested_count: form.generationCount,
        saved_song_index: savedSongIndex || null,
        raw_result: finalRawResult,
      },
    };

    const { data, error } = await supabase
      .from("music_generation_batches")
      .insert([batchPayload])
      .select("id")
      .single();

    if (error || !data?.id) {
      console.error("batch 저장 실패:", error);
      throw new Error(error?.message || "생성 묶음 저장 실패");
    }

    return data.id as string;
  };

  const saveToSupabase = async ({
    finalResult = result,
    finalRawResult = rawResult,
    isManual = false,
  }: {
    finalResult?: MusicResultState;
    finalRawResult?: any;
    isManual?: boolean;
  }) => {
    const songs = normalizeSongsForSave(finalResult).filter(
      (song) => song.lyrics && song.lyrics.length >= 10
    );

    if (songs.length === 0) {
      alert("❌ 저장할 가사가 아직 충분하지 않습니다.");
      return { saved: false, savedSongs: [] as SongItem[] };
    }

    try {
      setIsSaving(true);

      const user = activeUser || (await resolveAuthUser());

      if (!user) {
        alert("❌ 로그인 세션을 확인하지 못했습니다.");
        return { saved: false, savedSongs: [] as SongItem[] };
      }

      if (!activeUser) setActiveUser(user);

      const finalAuthor = getFinalAuthor(user);

      const batchId = await createBatch({
        user,
        finalAuthor,
        generationCount: songs.length,
        finalRawResult,
      });

      const songsPayload = songs.map((song, index) => ({
        batch_id: batchId,
        song_index: index + 1,
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: song.title || `Untitled Song ${index + 1}`,
        theme: autoTheme,
        lyrics: song.lyrics,
        suno_prompt: song.sunoPrompt || fallbackSunoPrompt,
        status: "saved",
        genre: form.genre,
        mood: form.mood,
        vocal: form.vocal,
        tempo: form.tempo,
        instrument: form.instrument,
        language: form.language,
        structure: form.structure,
        youtube_titles: song.youtubeTitles || [],
        youtube_description: song.youtubeDescription || "",
        hashtags: song.hashtags || [],
        concept_description: song.conceptDescription || "",
        cover_prompt: song.visualDescription || "",
        video_prompt: song.videoDescription || "",
        raw_result: {
          song,
          album_title: albumPlanPayload?.albumTitle || "",
          album_plan_id: albumPlanPayload?.planId || null,
          album_plan_payload: albumPlanPayload || null,
          concept_description: song.conceptDescription || "",
          original_raw_result: finalRawResult,
        },
        model_name: "gemini-fallback-chain",
        source_mode: "lyrics_suno",
        is_favorite: false,
      }));

      const { data: insertedSongs, error: songsError } = await supabase
        .from("music_lyrics_projects")
        .insert(songsPayload)
        .select("id, song_index");

      if (songsError) {
        console.error("곡 저장 실패:", songsError);
        throw new Error(songsError.message);
      }

      setResult((prev: MusicResultState) => ({
        ...prev,
        savedId: insertedSongs?.[0]?.id || "",
        batchId,
      }));

      alert(
        isManual
          ? `✅ ${songs.length}곡이 라이브러리에 저장되었습니다.`
          : `✅ ${songs.length}곡이 자동 저장되었습니다.`
      );

      return { saved: true, savedSongs: songs };
    } catch (err: any) {
      alert(`❌ 저장 오류: ${err.message}`);
      return { saved: false, savedSongs: [] as SongItem[] };
    } finally {
      setIsSaving(false);
    }
  };

  const saveSingleSongToSupabase = async (song: SongItem, songIndex: number) => {
    if (!song.lyrics || song.lyrics.length < 10) {
      alert("❌ 저장할 가사가 아직 충분하지 않습니다.");
      return false;
    }

    try {
      setIsSaving(true);

      const user = activeUser || (await resolveAuthUser());

      if (!user) {
        alert("❌ 로그인 세션을 확인하지 못했습니다.");
        return false;
      }

      if (!activeUser) setActiveUser(user);

      const finalAuthor = getFinalAuthor(user);

      const batchId = await createBatch({
        user,
        finalAuthor,
        generationCount: 1,
        finalRawResult: rawResult,
        savedSongIndex: songIndex,
      });

      const songPayload = {
        batch_id: batchId,
        song_index: songIndex,
        user_id: user.id,
        user_email: user.email,
        user_nicename: finalAuthor,
        title: song.title || `Untitled Song ${songIndex}`,
        theme: autoTheme,
        lyrics: song.lyrics,
        suno_prompt: song.sunoPrompt || fallbackSunoPrompt,
        status: "saved",
        genre: form.genre,
        mood: form.mood,
        vocal: form.vocal,
        tempo: form.tempo,
        instrument: form.instrument,
        language: form.language,
        structure: form.structure,
        youtube_titles: song.youtubeTitles || [],
        youtube_description: song.youtubeDescription || "",
        hashtags: song.hashtags || [],
        concept_description: song.conceptDescription || "",
        cover_prompt: song.visualDescription || "",
        video_prompt: song.videoDescription || "",
        raw_result: {
          song,
          album_title: albumPlanPayload?.albumTitle || "",
          album_plan_id: albumPlanPayload?.planId || null,
          album_plan_payload: albumPlanPayload || null,
          concept_description: song.conceptDescription || "",
          original_raw_result: rawResult,
        },
        model_name: "gemini-fallback-chain",
        source_mode: "lyrics_suno",
        is_favorite: false,
      };

      const { data: insertedSong, error: songError } = await supabase
        .from("music_lyrics_projects")
        .insert([songPayload])
        .select("id")
        .single();

      if (songError) {
        console.error("선택 곡 저장 실패:", songError);
        throw new Error(songError.message);
      }

      setResult((prev: MusicResultState) => ({
        ...prev,
        savedId: insertedSong?.id || "",
        batchId,
      }));

      alert("✅ 선택한 곡이 라이브러리에 저장되었습니다.");

      return true;
    } catch (err: any) {
      alert(`❌ 저장 오류: ${err.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async (externalAlbumPlanPayload?: any) => {
    const safeCount = Math.min(Math.max(Number(form.generationCount) || 1, 1), 10);

    const finalTheme =
      form.theme.trim() ||
      `${form.mood} 감성의 ${form.genre} 곡. ${form.vocal} 보컬이 ${form.instrument} 중심 사운드 위에서 부르는 감성적인 노래`;
    const activeAlbumPlanPayload =
      externalAlbumPlanPayload || albumPlanPayload;

    const albumPlanTracks = Array.isArray(activeAlbumPlanPayload?.tracks)
      ? activeAlbumPlanPayload.tracks
      : [];

    const albumPlanText =
      albumPlanTracks.length > 0
        ? albumPlanTracks
          .map(
            (track: any, index: number) => `
[Track ${index + 1}]
title: ${track.title}
story: ${track.story}
moodKeywords: ${track.moodKeywords}
genreInstrument: ${track.genreInstrument}
tempo: ${track.tempo}
stylePoint: ${track.stylePoint}
addOnPrompt: ${track.addOnPrompt}
`
          )
          .join("\n")
        : "";

    if (!form.theme.trim()) {
      setForm((prev: MusicFormState) => ({
        ...prev,
        theme: finalTheme,
      }));
    }

    setIsAiLoading(true);
    setGenerationProgress(5);
    setGenerationStatusMessage("AI 생성 준비 중입니다...");
    setGenerationErrorMessage("");
    setResult(initialResult);
    setRawResult(null);
    startProgressTimer();

    try {
      const vaultConfig = getUserAiVaultConfig();

      if (!vaultConfig) {
        alert(getPublicGeminiFallbackNotice());
      }

      const prompt = `
너는 AI 음악 제작 스튜디오의 전문 작곡가, 작사가, Suno 프롬프트 엔지니어다.

아래 조건을 바탕으로 서로 다른 매력을 가진 ${safeCount}곡을 생성하라.

[사용자 선택값]
- 생성 곡 수: ${safeCount}곡
- 곡 주제/상황: ${finalTheme}
- 장르: ${form.genre}
- 분위기/감성: ${form.mood}
- 보컬/창법: ${form.vocal}
- 속도/BPM: ${form.tempo}
- 중심 악기/사운드: ${form.instrument}
- 가사 언어: ${form.language}
- 곡 구성: ${form.structure}

[앨범 기획 트랙 리스트]
${albumPlanText || "별도 앨범 기획 없음"}

[앨범 기획 반영 필수 규칙]
- 위 앨범 기획 트랙 리스트가 있으면 songs 배열은 반드시 트랙 리스트 개수와 동일하게 생성하라.
- 각 song.title은 반드시 해당 Track의 title 값을 글자 그대로 사용하라.
- 절대 새로운 곡 제목을 만들지 마라.
- 절대 title을 번역하거나 변형하지 마라.
- Track 1은 songs[0], Track 2는 songs[1]처럼 순서를 반드시 유지하라.
- 각 song.conceptDescription에는 해당 Track의 story, moodKeywords, stylePoint, addOnPrompt를 반드시 반영하라.
- 각 song.sunoPrompt에는 해당 Track의 genreInstrument, tempo, stylePoint, addOnPrompt를 반드시 반영하라.
- 각 song.lyrics는 해당 Track의 story와 moodKeywords를 바탕으로 작성하라.
- 앨범 기획 트랙 리스트가 있을 때는 사용자가 선택한 일반 theme보다 Track별 기획 정보를 우선하라.

[생성 규칙]
1. 각 곡은 제목, 가사, Suno 프롬프트가 서로 다르게 느껴져야 한다.
2. title은 곡 제목으로 쓸 수 있게 짧고 감성적으로 작성한다.
3. conceptDescription은 곡의 소재, 컨셉, 감정, 분위기를 한국어로 설명한다.
4. sunoPrompt는 Suno 스타일 입력창에 바로 넣을 수 있게 영어로 작성한다.
5. lyrics는 실제 노래 가사처럼 섹션명을 포함해 작성한다.
6. lyrics에는 [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Final Chorus], [Outro] 같은 구조를 사용한다.
7. 한국어 가사일 경우 자연스러운 한국 대중음악 가사처럼 작성한다.
8. 가사는 반드시 3분~5분 길이의 완성곡 분량으로 작성한다.
9. Verse 1과 Verse 2는 서로 다른 내용으로 전개한다.
10. Chorus는 중독성 있게 반복 가능한 핵심 문장과 후크를 포함한다.
11. Post-Chorus 또는 Hook이 있는 구조라면 짧고 반복적인 멜로디성 문장을 넣는다.
12. Final Chorus는 앞 Chorus보다 감정이 고조되도록 변주한다.
13. 전체 가사는 너무 짧게 쓰지 말고 최소 2절 이상, 풍부한 분량으로 작성한다.
14. 각 곡의 가사는 최소 800자 이상으로 작성한다.
15. youtubeTitles는 각 곡마다 유튜브 업로드용 제목 후보 5개를 만든다.
16. youtubeDescription은 각 곡마다 유튜브 설명란에 넣을 수 있는 500자 내외 문장으로 만든다.
17. hashtags는 각 곡마다 핵심 해시태그 10개를 만든다.
18. visualDescription은 앨범 커버 이미지 제작용 영어 프롬프트로 작성한다.
19. videoDescription은 뮤직비디오 또는 Shorts 영상 제작용 영어 프롬프트로 작성한다.
20. visualDescription에는 배경, 색감, 인물/오브젝트, 조명, 분위기를 포함한다.
21. videoDescription에는 카메라 무빙, 장면 전환, 분위기, 연출 방향을 포함한다.

반드시 아래 JSON 형식으로만 반환하라.
마크다운 코드블록은 쓰지 마라.

{
  "songs": [
    {
      "title": "곡 제목",
      "conceptDescription": "곡의 소재, 컨셉, 감정, 분위기 설명",
      "sunoPrompt": "English Suno style prompt",
      "lyrics": "가사 전체",
      "visualDescription": "Image prompt for album cover or cover artwork",
      "videoDescription": "Video generation prompt for music video or shorts",
      "youtubeTitles": ["제목1", "제목2", "제목3", "제목4", "제목5"],
      "youtubeDescription": "유튜브 설명문",
      "hashtags": ["#tag1", "#tag2"]
    }
  ]
}
      `;

      let text = "";
      let parsed: any = null;
      let lastError: any = null;
      const uniqueModelNames = [
        ...new Set(
          vaultConfig?.provider === "groq"
            ? [vaultConfig.model]
            : [vaultConfig?.model || GEMINI_MODEL_FALLBACKS[0], ...GEMINI_MODEL_FALLBACKS]
        ),
      ];

      for (const modelName of uniqueModelNames) {
        for (let attempt = 1; attempt <= AI_RETRY_ATTEMPTS; attempt += 1) {
          try {
            setGenerationStatusMessage(
              attempt === 1
                ? `${modelName} 모델로 생성 중입니다...`
                : `${modelName} 모델 재시도 중입니다. (${attempt}/${AI_RETRY_ATTEMPTS})`
            );

            const generationResult = await generateGeminiContentWithFallback({
              modelName,
              prompt,
              responseMimeType: "application/json",
              type: "music_lyrics",
              userId: activeUser?.id || null,
              userEmail: activeUser?.email || null,
            });
            text = generationResult.text;

            parsed = extractJson(text);
            setGenerationProgress(92);
            setGenerationStatusMessage("AI 응답을 정리하는 중입니다...");
            lastError = null;
            break;
          } catch (error: any) {
            lastError = error;
            console.warn(`[Gemini 생성 실패] model=${modelName}, attempt=${attempt}`, error);
            text = "";
            parsed = null;

            if (attempt < AI_RETRY_ATTEMPTS && isHighDemandError(error)) {
              setGenerationStatusMessage(
                "AI 서버가 혼잡하여 자동으로 다시 시도하고 있습니다..."
              );
              await wait(AI_RETRY_DELAY_MS * attempt);
              continue;
            }

            break;
          }
        }

        if (parsed) break;
      }

      if (!parsed) {
        throw lastError || new Error("AI 응답을 받지 못했습니다.");
      }

      setGenerationProgress(95);

      const songs: SongItem[] = Array.isArray(parsed.songs)
        ? parsed.songs.slice(0, safeCount).map((song: any, index: number) => ({
          title: albumPlanTracks[index]?.title || song.title || `Untitled Song ${index + 1}`,
          conceptDescription:
            song.conceptDescription ||
            [
              albumPlanTracks[index]?.story,
              albumPlanTracks[index]?.moodKeywords,
              albumPlanTracks[index]?.stylePoint,
              albumPlanTracks[index]?.addOnPrompt,
            ]
              .filter(Boolean)
              .join(" / ") ||
            finalTheme,
          sunoPrompt: song.sunoPrompt || fallbackSunoPrompt,
          lyrics: song.lyrics || "",
          visualDescription: song.visualDescription || "",
          videoDescription: song.videoDescription || "",
          youtubeTitles: Array.isArray(song.youtubeTitles) ? song.youtubeTitles : [],
          youtubeDescription: song.youtubeDescription || "",
          hashtags: Array.isArray(song.hashtags) ? song.hashtags : [],
        }))
        : [];

      if (songs.length === 0) {
        throw new Error("AI 응답에서 songs 배열을 찾지 못했습니다.");
      }

      const firstSong = songs[0];

      const nextResult: MusicResultState = {
        title: firstSong.title,
        conceptDescription: firstSong.conceptDescription || "",
        sunoPrompt: firstSong.sunoPrompt,
        lyrics: firstSong.lyrics,
        visualDescription: firstSong.visualDescription || "",
        videoDescription: firstSong.videoDescription || "",
        youtubeTitles: firstSong.youtubeTitles,
        youtubeDescription: firstSong.youtubeDescription,
        hashtags: firstSong.hashtags,
        savedId: "",
        batchId: "",
        songs,
      };

      setResult(nextResult);
      setRawResult(parsed);
      stopProgressTimer();
      setGenerationProgress(100);
      setGenerationStatusMessage("생성이 완료되었습니다. 라이브러리에 자동 저장 중입니다...");
      setIsAiLoading(false);

      const saveResult = await saveToSupabase({
        finalResult: nextResult,
        finalRawResult: parsed,
        isManual: false,
      });

      if (saveResult.saved) {
        await markAlbumPlanLyricsGenerated(activeAlbumPlanPayload, saveResult.savedSongs);
      }

      setGenerationStatusMessage(
        `${saveResult.savedSongs.length}곡 생성과 저장이 완료되었습니다.`
      );
    } catch (err: any) {
      console.error(err);
      stopProgressTimer();

      const friendlyMessage = getFriendlyAiErrorMessage(err);

      setGenerationErrorMessage(friendlyMessage);
      setGenerationStatusMessage("");
      setGenerationProgress(0);
      setIsAiLoading(false);

      alert(friendlyMessage);
    }
  };

  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const moodParam = searchParams.get("mood");
    const vocalParam = searchParams.get("vocal");
    const instrumentParam = searchParams.get("instrument");
    const tempoParam = searchParams.get("tempo");
    const themeParam = searchParams.get("theme");

    if (genreParam || moodParam || vocalParam || instrumentParam || tempoParam || themeParam) {
      const mappedGenre = mapLyricsGenreOption(genreParam);
      const mappedMood = mapLyricsMoodOption(moodParam);
      const mappedVocal = mapLyricsVocalOption(vocalParam);
      const mappedTempo = mapLyricsTempoOption(tempoParam);
      const mappedInstrument = mapLyricsInstrumentOption(instrumentParam);

      setForm((prev) => ({
        ...prev,
        genre: mappedGenre || prev.genre,
        mood: mappedMood || prev.mood,
        vocal: mappedVocal || prev.vocal,
        tempo: mappedTempo || prev.tempo,
        instrument: mappedInstrument || prev.instrument,
        theme: themeParam || prev.theme,
      }));
    }

    if (albumAutoRunRef.current) return;

    const shouldAutoGenerate =
      searchParams.get("autoGenerate") === "1" &&
      searchParams.get("source") === "album-plan";

    if (!shouldAutoGenerate) return;

    const raw = window.sessionStorage.getItem(ALBUM_PLAN_TO_LYRICS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      albumAutoRunRef.current = true;
      setAlbumPlanPayload(parsed);

      setForm((prev: MusicFormState) => ({
        ...prev,
        genre: parsed.genre || prev.genre,
        mood: parsed.mood || prev.mood,
        vocal: parsed.vocal || prev.vocal,
        tempo: parsed.tempo || prev.tempo,
        instrument: parsed.instrument || prev.instrument,
        language: parsed.language || prev.language,
        generationCount: Math.min(Math.max(Number(parsed.generationCount) || 1, 1), 20),
        theme:
          parsed.mode === "single-track"
            ? `${parsed.tracks?.[0]?.title || ""} - ${parsed.tracks?.[0]?.story || ""}`
            : `${parsed.albumTitle || ""} - ${parsed.albumConcept || ""}`,
      }));

      setTimeout(() => {
        void handleAiGenerate(parsed);
      }, 500);
    } catch (error) {
      console.error("앨범 기획 자동 연결 실패:", error);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-[1800px] space-y-8 px-5 py-6 lg:px-8 lg:py-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Sparkles size={14} />
            Gemini Auto Fallback Connected
          </div>

          <h1 className="text-3xl font-black text-white md:text-4xl">
            가사 생성 & Suno 스타일 프롬프트, 이미지, 영상 프롬프트, 유튜브 제목까지!
          </h1>

          <p className="mt-3 max-w-3xl text-lg leading-7 text-zinc-400">
            1곡부터 최대 10곡까지 생성하고, 생성 묶음과 개별 곡을 라이브러리 DB에 자동 저장합니다.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#101014] p-4">
          <div className="mb-3">
            <h3 className="text-lg font-black text-white">다음 작업</h3>
            <p className="mt-1 text-[11px] leading-4 text-zinc-500">
              생성 결과를 다음 제작 단계로 연결합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["커버 이미지(Cover)", "Cover"],
              ["번역(Translate)", "Translate"],
              ["영상 프롬프트(Video)", "Video"],
              ["유튜브 패키지(YouTube)", "YouTube"],
              ["앨범 아트(Artwork)", "Artwork"],
              ["Shorts 제작(Shorts)", "Shorts"],
            ].map(([title]) => (
              <button
                key={title}
                type="button"
                className="h-[40px] rounded-md border border-zinc-700/80 bg-gradient-to-br from-zinc-900/90 to-black/80 px-4 py-2 text-left backdrop-blur-sm transition-all duration-200 hover:border-amber-400 hover:from-amber-500/15 hover:to-orange-500/10 hover:shadow-[0_0_20px_rgba(251,191,36,0.12)]"
              >
                <div className="truncate whitespace-nowrap text-[15px] font-black text-white">
                  {title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.35fr)_380px_minmax(420px,0.9fr)]">
        <LyricsInputPanel form={form} setForm={setForm} />

        <div className="2xl:sticky 2xl:top-24 2xl:self-start">
          {generationErrorMessage && !isAiLoading && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
              {generationErrorMessage}
            </div>
          )}

          <LyricsControlPanel
            form={form}
            setForm={setForm}
            previewPrompt={result.sunoPrompt || fallbackSunoPrompt}
            isAiLoading={isAiLoading}
            generationProgress={generationProgress}
            generationStatusMessage={generationStatusMessage}
            onGenerate={handleAiGenerate}
            onCopy={copyText}
          />
        </div>

        <div className="2xl:sticky 2xl:top-24 2xl:self-start">
          <LyricsResultPanel
            result={result}
            setResult={setResult}
            isSaving={isSaving}
            onSaveSong={saveSingleSongToSupabase}
            onCopy={copyText}
          />
        </div>
      </div>
    </div>
  );
}

export default function MusicLyricsPage() {
  return (
    <Suspense fallback={null}>
      <MusicLyricsPageContent />
    </Suspense>
  );
}
