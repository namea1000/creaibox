"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Download,
  Edit3,
  Eye,
  Music,
  Search,
  Trash2,
  X,
  RotateCcw,
  ListChecks,
  Save,
  Copy,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const PAGE_SIZE = 15;

type MusicStatus = "saved" | "trash" | "draft";

type MusicSongRow = {
  id: string;
  created_at: string | null;
  updated_at?: string | null;
  batch_id: string | null;
  song_index: number | null;

  title: string | null;
  theme: string | null;
  lyrics: string | null;
  suno_prompt: string | null;
  status: MusicStatus | string | null;

  genre: string | null;
  mood: string | null;
  vocal: string | null;
  tempo: string | null;
  instrument: string | null;
  language: string | null;
  structure: string | null;

  youtube_titles: string[] | null;
  youtube_description: string | null;
  hashtags: string[] | null;

  concept_description: string | null;
  cover_prompt: string | null;
  video_prompt: string | null;

  model_name: string | null;
  source_mode: string | null;
  is_favorite: boolean | null;
  raw_result: Record<string, unknown> | null;
};

type Filters = {
  genre: string;
  mood: string;
  vocal: string;
  language: string;
};

type CopyTarget = "title" | "suno" | "lyrics";
type StatusTab = "all" | "saved" | "suno" | "trash";
type FieldSaveStatus = "idle" | "saving" | "saved" | "error";

function safeText(value?: string | null, fallback = "-") {
  const text = value?.trim();
  return text ? text : fallback;
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function getStatusLabel(song: MusicSongRow) {
  if (isSunoGenerationCompleted(song)) return "Suno 생성 완료";
  const status = song.status;

  if (status === "trash") return "휴지통";
  if (status === "draft") return "임시 저장";
  return "저장 완료";
}

function isSunoGenerationCompleted(song: MusicSongRow) {
  return song.raw_result?.suno_generation_completed === true;
}

function getRawResultObject(value: MusicSongRow["raw_result"]) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function getRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function getStringFromRecord(record: Record<string, unknown> | null, keys: string[]) {
  if (!record) return null;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getAlbumTitle(song: MusicSongRow) {
  const raw = getRawResultObject(song.raw_result);
  const rawRecord = getRecord(raw);
  const songRecord = getRecord(rawRecord?.song);
  const albumRecord = getRecord(rawRecord?.album);
  const albumPlanRecord = getRecord(rawRecord?.album_plan) || getRecord(rawRecord?.albumPlan);
  const albumPlanPayloadRecord = getRecord(rawRecord?.album_plan_payload) || getRecord(rawRecord?.albumPlanPayload);
  const originalRawResultRecord = getRecord(rawRecord?.original_raw_result);

  const albumTitle =
    getStringFromRecord(rawRecord, [
      "album_title",
      "albumTitle",
      "album_plan_title",
      "albumPlanTitle",
    ]) ||
    getStringFromRecord(songRecord, ["album_title", "albumTitle"]) ||
    getStringFromRecord(albumRecord, ["title", "album_title", "albumTitle"]) ||
    getStringFromRecord(albumPlanRecord, ["title", "albumTitle"]) ||
    getStringFromRecord(albumPlanPayloadRecord, ["albumTitle", "title"]) ||
    getStringFromRecord(originalRawResultRecord, ["albumTitle", "album_title"]);

  if (albumTitle) return albumTitle;

  const theme = song.theme?.trim();
  const themeAlbumTitle = theme?.split(" - ")[0]?.trim();

  if (themeAlbumTitle && themeAlbumTitle !== theme && themeAlbumTitle.length <= 80) {
    return themeAlbumTitle;
  }

  return "미분류";
}

function makeDownloadText(song: MusicSongRow) {
  return `
제목
${safeText(song.title, "")}

앨범
${getAlbumTitle(song)}

장르
${safeText(song.genre, "")}

감성
${safeText(song.mood, "")}

보컬
${safeText(song.vocal, "")}

BPM
${safeText(song.tempo, "")}

악기
${safeText(song.instrument, "")}

언어
${safeText(song.language, "")}

노래 구조
${safeText(song.structure, "")}

곡의 소재 설명
${safeText(song.concept_description, "")}

Suno 스타일 프롬프트
${safeText(song.suno_prompt, "")}

가사
${safeText(song.lyrics, "")}

Visual Description / Image Prompt
${safeText(song.cover_prompt, "")}

Video Description / 영상 Prompt
${safeText(song.video_prompt, "")}

유튜브 제목 후보
${(song.youtube_titles || []).map((item, index) => `${index + 1}. ${item}`).join("\n")}

유튜브 설명문
${safeText(song.youtube_description, "")}

해시태그
${(song.hashtags || []).join(" ")}
`.trim();
}

function makeSafeFilename(title: string) {
  return (title || "music-result")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

async function copyToClipboard(value?: string | null) {
  const text = safeText(value, "");

  if (!text) {
    return false;
  }

  await navigator.clipboard.writeText(text);
  return true;
}

export default function MusicLibraryPage() {
  const supabase = useMemo(() => createClient(), []);

  const [songs, setSongs] = useState<MusicSongRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<MusicSongRow | null>(null);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [titleSaveStatus, setTitleSaveStatus] = useState<FieldSaveStatus>("idle");
  const [isLyricsEditing, setIsLyricsEditing] = useState(false);
  const [lyricsDraft, setLyricsDraft] = useState("");
  const [lyricsSaveStatus, setLyricsSaveStatus] = useState<FieldSaveStatus>("idle");
  const titleSaveTimerRef = useRef<number | null>(null);
  const lyricsSaveTimerRef = useRef<number | null>(null);
  const openedQueryTargetRef = useRef<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    genre: "all",
    mood: "all",
    vocal: "all",
    language: "all",
  });

  const fetchSongs = useCallback(async (options?: { showLoading?: boolean }) => {
    const showLoading = options?.showLoading ?? true;

    if (showLoading) {
      setIsLoading(true);
    }

    setErrorMessage(null);

    const { data, error } = await supabase
      .from("music_lyrics_projects")
      .select(`
        id,
        created_at,
        batch_id,
        song_index,
        title,
        theme,
        lyrics,
        suno_prompt,
        status,
        genre,
        mood,
        vocal,
        tempo,
        instrument,
        language,
        structure,
        youtube_titles,
        youtube_description,
        hashtags,
        concept_description,
        cover_prompt,
        video_prompt,
        model_name,
        source_mode,
        is_favorite,
        raw_result
      `)
      .order("created_at", { ascending: false });

    if (showLoading) {
      setIsLoading(false);
    }

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSongs((data ?? []) as MusicSongRow[]);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchSongs({ showLoading: true });
    });

    const handleFocus = () => {
      void fetchSongs({ showLoading: false });
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchSongs]);

  useEffect(() => {
    return () => {
      if (titleSaveTimerRef.current) {
        window.clearTimeout(titleSaveTimerRef.current);
      }

      if (lyricsSaveTimerRef.current) {
        window.clearTimeout(lyricsSaveTimerRef.current);
      }
    };
  }, []);

  const filterOptions = useMemo(() => {
    const genres = new Set<string>();
    const moods = new Set<string>();
    const vocals = new Set<string>();
    const languages = new Set<string>();

    songs.forEach((song) => {
      if (song.genre) genres.add(song.genre);
      if (song.mood) moods.add(song.mood);
      if (song.vocal) vocals.add(song.vocal);
      if (song.language) languages.add(song.language);
    });

    return {
      genres: Array.from(genres),
      moods: Array.from(moods),
      vocals: Array.from(vocals),
      languages: Array.from(languages),
    };
  }, [songs]);

  const filteredSongs = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    return songs.filter((song) => {
      const isTrash = song.status === "trash";

      const matchesStatus =
        statusTab === "all"
          ? !isTrash
          : statusTab === "trash"
            ? isTrash
            : statusTab === "suno"
              ? !isTrash && isSunoGenerationCompleted(song)
              : song.status === "saved";

      const matchesSearch =
        !lowerSearch ||
        safeText(song.title, "").toLowerCase().includes(lowerSearch) ||
        safeText(song.genre, "").toLowerCase().includes(lowerSearch) ||
        safeText(song.mood, "").toLowerCase().includes(lowerSearch) ||
        safeText(song.vocal, "").toLowerCase().includes(lowerSearch) ||
        safeText(song.instrument, "").toLowerCase().includes(lowerSearch);

      const matchesGenre = filters.genre === "all" || song.genre === filters.genre;
      const matchesMood = filters.mood === "all" || song.mood === filters.mood;
      const matchesVocal = filters.vocal === "all" || song.vocal === filters.vocal;
      const matchesLanguage = filters.language === "all" || song.language === filters.language;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesGenre &&
        matchesMood &&
        matchesVocal &&
        matchesLanguage
      );
    });
  }, [filters, searchTerm, songs, statusTab]);

  const handleCopyField = useCallback(async (target: CopyTarget, value?: string | null) => {
    const copied = await copyToClipboard(value);
    if (!copied) return;

    setCopiedTarget(target);
    window.setTimeout(() => {
      setCopiedTarget((current) => (current === target ? null : current));
    }, 3000);
  }, []);

  const saveLyricsDraft = useCallback(
    async (song: MusicSongRow, nextLyrics: string) => {
      setLyricsSaveStatus("saving");

      const { error } = await supabase
        .from("music_lyrics_projects")
        .update({ lyrics: nextLyrics })
        .eq("id", song.id);

      if (error) {
        setLyricsSaveStatus("error");
        return;
      }

      setSongs((prev) =>
        prev.map((item) => (item.id === song.id ? { ...item, lyrics: nextLyrics } : item))
      );
      setSelectedSong((current) =>
        current?.id === song.id ? { ...current, lyrics: nextLyrics } : current
      );
      setLyricsSaveStatus("saved");

      window.setTimeout(() => {
        setLyricsSaveStatus((current) => (current === "saved" ? "idle" : current));
      }, 2500);
    },
    [supabase]
  );

  const saveTitleDraft = useCallback(
    async (song: MusicSongRow, nextTitle: string) => {
      const normalizedTitle = nextTitle.trim();

      if (!normalizedTitle) {
        setTitleSaveStatus("error");
        return;
      }

      setTitleSaveStatus("saving");

      const { error } = await supabase
        .from("music_lyrics_projects")
        .update({ title: normalizedTitle })
        .eq("id", song.id);

      if (error) {
        setTitleSaveStatus("error");
        return;
      }

      setTitleDraft(normalizedTitle);
      setSongs((prev) =>
        prev.map((item) => (item.id === song.id ? { ...item, title: normalizedTitle } : item))
      );
      setSelectedSong((current) =>
        current?.id === song.id ? { ...current, title: normalizedTitle } : current
      );
      setTitleSaveStatus("saved");

      window.setTimeout(() => {
        setTitleSaveStatus((current) => (current === "saved" ? "idle" : current));
      }, 2500);
    },
    [supabase]
  );

  useEffect(() => {
    if (!selectedSong || !isTitleEditing) return;
    if (titleDraft.trim() === (selectedSong.title || "").trim()) return;

    if (titleSaveTimerRef.current) {
      window.clearTimeout(titleSaveTimerRef.current);
    }

    titleSaveTimerRef.current = window.setTimeout(() => {
      void saveTitleDraft(selectedSong, titleDraft);
    }, 800);
  }, [isTitleEditing, saveTitleDraft, selectedSong, titleDraft]);

  useEffect(() => {
    if (!selectedSong || !isLyricsEditing) return;
    if (lyricsDraft === (selectedSong.lyrics || "")) return;

    if (lyricsSaveTimerRef.current) {
      window.clearTimeout(lyricsSaveTimerRef.current);
    }

    lyricsSaveTimerRef.current = window.setTimeout(() => {
      void saveLyricsDraft(selectedSong, lyricsDraft);
    }, 800);
  }, [isLyricsEditing, lyricsDraft, saveLyricsDraft, selectedSong]);

  const tabCounts = useMemo(
    () => ({
      all: songs.filter((song) => song.status !== "trash").length,
      saved: songs.filter((song) => song.status === "saved").length,
      suno: songs.filter((song) => song.status !== "trash" && isSunoGenerationCompleted(song)).length,
      trash: songs.filter((song) => song.status === "trash").length,
    }),
    [songs]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSongs.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedSongs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredSongs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredSongs, safeCurrentPage]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleOpenSong = useCallback((song: MusicSongRow) => {
    if (titleSaveTimerRef.current) {
      window.clearTimeout(titleSaveTimerRef.current);
      titleSaveTimerRef.current = null;
    }

    if (lyricsSaveTimerRef.current) {
      window.clearTimeout(lyricsSaveTimerRef.current);
      lyricsSaveTimerRef.current = null;
    }

    setSelectedSong(song);
    setIsTitleEditing(false);
    setTitleDraft(song.title || "");
    setTitleSaveStatus("idle");
    setIsLyricsEditing(false);
    setLyricsDraft(song.lyrics || "");
    setLyricsSaveStatus("idle");
  }, []);

  useEffect(() => {
    if (songs.length === 0) return;

    const searchParams = new URLSearchParams(window.location.search);
    const openTitle = searchParams.get("openTitle")?.trim();
    if (!openTitle || openedQueryTargetRef.current === openTitle) return;

    const targetSong = songs.find(
      (song) => safeText(song.title, "").trim() === openTitle
    );

    if (!targetSong) return;

    openedQueryTargetRef.current = openTitle;
    window.setTimeout(() => {
      handleOpenSong(targetSong);
    }, 0);
  }, [handleOpenSong, songs]);

  const handleMoveToTrash = async (song: MusicSongRow) => {
    if (!window.confirm("이 곡을 휴지통으로 이동할까요?")) return;

    const { error } = await supabase
      .from("music_lyrics_projects")
      .update({ status: "trash" })
      .eq("id", song.id);

    if (error) {
      window.alert(`휴지통 이동 실패: ${error.message}`);
      return;
    }

    setSongs((prev) =>
      prev.map((item) => (item.id === song.id ? { ...item, status: "trash" } : item))
    );
  };

  const handleRestore = async (song: MusicSongRow) => {
    const { error } = await supabase
      .from("music_lyrics_projects")
      .update({ status: "saved" })
      .eq("id", song.id);

    if (error) {
      window.alert(`복원 실패: ${error.message}`);
      return;
    }

    setSongs((prev) =>
      prev.map((item) => (item.id === song.id ? { ...item, status: "saved" } : item))
    );
  };

  const handlePermanentDelete = async (song: MusicSongRow) => {
    if (
      !window.confirm(
        "정말 영구 삭제하시겠습니까? 삭제하면 DB에서 완전히 제거되며 복구할 수 없습니다."
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("music_lyrics_projects")
      .delete()
      .eq("id", song.id);

    if (error) {
      window.alert(`영구 삭제 실패: ${error.message}`);
      return;
    }

    setSongs((prev) => prev.filter((item) => item.id !== song.id));

    if (selectedSong?.id === song.id) {
      setSelectedSong(null);
    }
  };

  const handleToggleSunoCompleted = async (song: MusicSongRow, checked: boolean) => {
    const nextRawResult = {
      ...getRawResultObject(song.raw_result),
      suno_generation_completed: checked,
      suno_generation_completed_at: checked ? new Date().toISOString() : null,
    };

    setSongs((prev) =>
      prev.map((item) => (item.id === song.id ? { ...item, raw_result: nextRawResult } : item))
    );

    setSelectedSong((current) =>
      current?.id === song.id ? { ...current, raw_result: nextRawResult } : current
    );

    const { error } = await supabase
      .from("music_lyrics_projects")
      .update({ raw_result: nextRawResult })
      .eq("id", song.id);

    if (error) {
      setSongs((prev) =>
        prev.map((item) => (item.id === song.id ? { ...item, raw_result: song.raw_result } : item))
      );

      setSelectedSong((current) =>
        current?.id === song.id ? { ...current, raw_result: song.raw_result } : current
      );

      window.alert(`Suno 생성완료 상태 저장 실패: ${error.message}`);
    }
  };

  const handleDownload = (song: MusicSongRow) => {
    downloadTextFile(`${makeSafeFilename(song.title || "music-song")}.txt`, makeDownloadText(song));
  };

  const handleCloseSelectedSong = async () => {
    if (selectedSong && isTitleEditing && titleDraft.trim() !== (selectedSong.title || "").trim()) {
      if (titleSaveTimerRef.current) {
        window.clearTimeout(titleSaveTimerRef.current);
        titleSaveTimerRef.current = null;
      }

      await saveTitleDraft(selectedSong, titleDraft);
    }

    if (selectedSong && isLyricsEditing && lyricsDraft !== (selectedSong.lyrics || "")) {
      if (lyricsSaveTimerRef.current) {
        window.clearTimeout(lyricsSaveTimerRef.current);
        lyricsSaveTimerRef.current = null;
      }

      await saveLyricsDraft(selectedSong, lyricsDraft);
    }

    setSelectedSong(null);
  };

  const paginationControls = (
    <div className="flex items-center gap-1 text-[14px] text-zinc-400">
      <span className="mr-2 text-zinc-500">{filteredSongs.length.toLocaleString()}개 항목</span>

      <button
        onClick={() => setCurrentPage(1)}
        disabled={safeCurrentPage === 1}
        className="h-8 min-w-8 border border-white/10 bg-black/40 px-2 text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-100 disabled:text-zinc-700 disabled:hover:border-white/10"
      >
        «
      </button>

      <button
        onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
        disabled={safeCurrentPage === 1}
        className="h-8 min-w-8 border border-white/10 bg-black/40 px-2 text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-100 disabled:text-zinc-700 disabled:hover:border-white/10"
      >
        ‹
      </button>

      <span className="mx-1 flex items-center gap-1">
        <span className="inline-flex h-8 min-w-10 items-center justify-center border border-cyan-400/50 bg-cyan-400/10 px-2 font-semibold text-cyan-100">
          {safeCurrentPage}
        </span>
        <span>/ {totalPages}</span>
      </span>

      <button
        onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
        disabled={safeCurrentPage === totalPages}
        className="h-8 min-w-8 border border-white/10 bg-black/40 px-2 text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-100 disabled:text-zinc-700 disabled:hover:border-white/10"
      >
        ›
      </button>

      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={safeCurrentPage === totalPages}
        className="h-8 min-w-8 border border-white/10 bg-black/40 px-2 text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-100 disabled:text-zinc-700 disabled:hover:border-white/10"
      >
        »
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050507] px-6 py-8 text-[14px] text-zinc-100">
      <div className="mx-auto max-w-[1800px]">
      <div className="mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-[#111827] to-black px-7 py-6 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-[12px] font-black uppercase tracking-[0.22em] text-cyan-200">
            <Music className="h-4 w-4" />
            Music Library
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            음악 라이브러리
          </h1>
          <p className="mt-3 text-[14px] leading-6 text-zinc-400">
            AI로 생성한 가사, Suno 프롬프트, 이미지/영상 프롬프트, 유튜브 최적화 정보를 관리합니다.
          </p>
        </div>

        <div className="w-full max-w-md pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/70" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="곡 제목, 장르, 감성, 보컬, 악기 검색..."
              className="h-11 w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3 text-[14px] text-white outline-none placeholder:text-zinc-600 transition focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
        {[
          { key: "all", label: "전체 곡", count: tabCounts.all, Icon: ListChecks },
          { key: "saved", label: "저장 완료", count: tabCounts.saved, Icon: Save },
          { key: "suno", label: "Suno 생성 완료", count: tabCounts.suno, Icon: Music },
          { key: "trash", label: "휴지통", count: tabCounts.trash, Icon: Trash2 },
        ].map(({ key, label, count, Icon }) => {
          const active = statusTab === key;

          return (
            <button
              key={key}
              onClick={() => {
                setStatusTab(key as StatusTab);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-2 border px-3 py-1.5 transition ${active
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                : "border-white/10 bg-black/35 text-zinc-300 hover:border-cyan-400/40 hover:text-cyan-100"
                }`}
            >
              <Icon className="h-4 w-4" />
              {label} <span className="ml-1 text-[13px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[14px]">
        {[
          ["genre", "장르", filterOptions.genres],
          ["mood", "감성", filterOptions.moods],
          ["vocal", "보컬", filterOptions.vocals],
          ["language", "언어", filterOptions.languages],
        ].map(([key, label, options]) => (
          <label
            key={String(key)}
            className="flex items-center gap-2 border border-white/10 bg-[#0d0d12] px-3 py-2 text-zinc-300"
          >
            <Music className="h-4 w-4 text-cyan-300" />
            <span className="font-semibold">{String(label)}</span>
            <select
              value={filters[key as keyof Filters]}
              onChange={(event) => handleFilterChange(key as keyof Filters, event.target.value)}
              className="bg-[#0d0d12] text-zinc-100 outline-none"
            >
              <option value="all">전체 선택</option>
              {(options as string[]).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => window.location.href = "/studio/music/lyrics"}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-400 px-4 text-[14px] font-black text-black transition hover:bg-cyan-300"
        >
          <Music className="h-4 w-4" />
          새 가사 생성
        </button>

        {paginationControls}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] shadow-2xl shadow-black/30">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-amber-300/30 bg-amber-400/15 text-left text-[14px] font-black uppercase tracking-wider text-amber-100">
              <th className="w-16 px-3 py-3 text-center">번호</th>
              <th className="w-32 px-3 py-3 text-center">Suno 생성완료</th>
              <th className="min-w-[280px] px-3 py-3">곡 제목</th>
              <th className="w-32 px-3 py-3 text-center">앨범</th>
              <th className="w-28 px-3 py-3 text-center">장르</th>
              <th className="w-40 px-3 py-3 text-center">감성</th>
              <th className="w-36 px-3 py-3 text-center">보컬</th>
              <th className="w-28 px-3 py-3 text-center">BPM</th>
              <th className="w-32 px-3 py-3 text-center">악기</th>
              <th className="w-24 px-3 py-3 text-center">언어</th>
              <th className="w-32 px-3 py-3 text-center">상태</th>
              <th className="w-40 px-3 py-3 text-center">생성일</th>
              <th className="w-36 px-3 py-3 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={13} className="h-40 px-3 py-8 text-center text-zinc-500">
                  음악 라이브러리를 불러오는 중입니다.
                </td>
              </tr>
            )}

            {!isLoading && paginatedSongs.length === 0 && (
              <tr>
                <td colSpan={13} className="h-40 px-3 py-8 text-center text-zinc-500">
                  표시할 곡이 없습니다.
                </td>
              </tr>
            )}

            {paginatedSongs.map((song, index) => {
              const absoluteIndex = (safeCurrentPage - 1) * PAGE_SIZE + index;
              const rowNumber = filteredSongs.length - absoluteIndex;

              return (
                <tr
                  key={song.id}
                  className="group cursor-pointer border-b border-white/5 align-top transition odd:bg-white/[0.02] even:bg-white/[0.04] hover:bg-cyan-400/10"
                  onClick={() => handleOpenSong(song)}
                >
                  <td className="px-3 py-4 text-center text-zinc-400">{rowNumber}</td>

                  <td
                    className="px-3 py-4 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSunoGenerationCompleted(song)}
                      onChange={(event) =>
                        void handleToggleSunoCompleted(song, event.target.checked)
                      }
                      className="h-4 w-4 accent-cyan-400"
                      aria-label={`${safeText(song.title, "곡")} Suno 생성완료`}
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="text-left font-semibold leading-6 text-cyan-200 transition hover:text-cyan-100 hover:underline"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenSong(song);
                      }}
                    >
                      {safeText(song.title, "제목 없음")}
                    </button>
                    <div className="mt-1 text-[13px] leading-6 text-zinc-500">
                      {safeText(song.concept_description, "소재 설명 없음").slice(0, 80)}
                    </div>
                  </td>

                  <td className="px-3 py-4 text-center text-zinc-400">{getAlbumTitle(song)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.genre)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.mood)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.vocal)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.tempo)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.instrument)}</td>
                  <td className="px-3 py-4 text-center text-zinc-300">{safeText(song.language)}</td>

                  <td className="px-3 py-4 text-center">
                    <span className="inline-flex border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[13px] font-semibold text-cyan-100">
                      {getStatusLabel(song)}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-center text-zinc-400">
                    {formatDisplayDate(song.created_at)}
                  </td>

                  <td
                    className="px-3 py-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenSong(song)}
                        className="border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100"
                        title="보기"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDownload(song)}
                        className="border border-emerald-400/30 bg-emerald-400/10 p-2 text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100"
                        title="다운로드"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {song.status === "trash" ? (
                        <>
                          <button
                            onClick={() => void handleRestore(song)}
                            className="border border-indigo-400/30 bg-indigo-400/10 p-2 text-indigo-200 transition hover:border-indigo-300 hover:text-indigo-100"
                            title="복원"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => void handlePermanentDelete(song)}
                            className="border border-rose-400/50 bg-rose-500/15 p-2 text-rose-200 transition hover:border-rose-300 hover:bg-rose-500/25 hover:text-rose-100"
                            title="영구 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => void handleMoveToTrash(song)}
                          className="border border-rose-400/30 bg-rose-400/10 p-2 text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
                          title="휴지통"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-[14px] text-zinc-400">
        <div className="text-zinc-500">
          검색 결과: 총{" "}
          <span className="font-semibold text-cyan-100">{filteredSongs.length}개</span> 중{" "}
          {filteredSongs.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1} -{" "}
          {Math.min(safeCurrentPage * PAGE_SIZE, filteredSongs.length)} 표시
        </div>

        {paginationControls}
      </div>

      {errorMessage && (
        <div className="mt-6 flex items-center gap-3 border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-[14px] text-rose-200">
          <AlertCircle className="h-5 w-5" />
          음악 라이브러리를 불러오지 못했습니다: {errorMessage}
        </div>
      )}

      {selectedSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] text-zinc-100 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-transparent px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {safeText(isTitleEditing ? titleDraft : selectedSong.title, "제목 없음")}
                </h2>
                <p className="mt-1 text-[13px] text-zinc-400">
                  {safeText(selectedSong.genre)} · {safeText(selectedSong.mood)} ·{" "}
                  {safeText(selectedSong.vocal)} · {safeText(selectedSong.tempo)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleCloseSelectedSong()}
                className="border border-white/10 bg-black/35 p-2 text-zinc-400 transition hover:border-cyan-400/50 hover:text-cyan-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-5">
              <div className="mb-5 grid grid-cols-2 gap-3 text-[14px] md:grid-cols-4">
                {[
                  ["앨범", getAlbumTitle(selectedSong)],
                  ["장르", selectedSong.genre],
                  ["감성", selectedSong.mood],
                  ["보컬", selectedSong.vocal],
                  ["BPM", selectedSong.tempo],
                  ["악기", selectedSong.instrument],
                  ["언어", selectedSong.language],
                  ["생성일", formatDisplayDate(selectedSong.created_at)],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-[12px] font-semibold text-zinc-500">{label}</div>
                    <div className="mt-1 font-semibold text-zinc-100">{safeText(String(value))}</div>
                  </div>
                ))}
              </div>

              {[
                { label: "곡의 소재 설명", value: selectedSong.concept_description },
                { label: "제목(Title)", value: selectedSong.title, copyTarget: "title" as const },
                { label: "Suno 스타일 프롬프트", value: selectedSong.suno_prompt, copyTarget: "suno" as const },
                { label: "가사", value: selectedSong.lyrics, copyTarget: "lyrics" as const },
                { label: "Visual Description / Image Prompt", value: selectedSong.cover_prompt },
                { label: "Video Description / 영상 Prompt", value: selectedSong.video_prompt },
                { label: "유튜브 설명문", value: selectedSong.youtube_description },
                { label: "해시태그", value: (selectedSong.hashtags || []).join(" ") },
              ].map(({ label, value, copyTarget }) => {
                const isTitleField = copyTarget === "title";
                const isLyricsField = copyTarget === "lyrics";
                const isEditingField =
                  (isTitleField && isTitleEditing) || (isLyricsField && isLyricsEditing);
                const saveStatus = isTitleField ? titleSaveStatus : lyricsSaveStatus;
                const displayValue = isTitleField && isTitleEditing
                  ? titleDraft
                  : isLyricsField && isLyricsEditing
                    ? lyricsDraft
                    : value;

                return (
                  <section key={String(label)} className="mb-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[14px] font-bold text-zinc-100">{label}</h3>
                        {isEditingField && (
                          <span
                            className={`text-[12px] font-semibold ${saveStatus === "saving"
                              ? "text-cyan-300"
                              : saveStatus === "saved"
                                ? "text-emerald-300"
                                : saveStatus === "error"
                                  ? "text-rose-300"
                                  : "text-zinc-500"
                              }`}
                          >
                            {saveStatus === "saving"
                              ? "자동 저장 중..."
                              : saveStatus === "saved"
                                ? "자동 저장 완료"
                                : saveStatus === "error"
                                  ? "자동 저장 실패"
                                  : "수정하면 자동 저장됩니다"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {(isTitleField || isLyricsField) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (isTitleField && isTitleEditing) {
                                if (titleDraft.trim() !== (selectedSong.title || "").trim()) {
                                  void saveTitleDraft(selectedSong, titleDraft);
                                }
                                setIsTitleEditing(false);
                                return;
                              }

                              if (isLyricsField && isLyricsEditing) {
                                if (lyricsDraft !== (selectedSong.lyrics || "")) {
                                  void saveLyricsDraft(selectedSong, lyricsDraft);
                                }
                                setIsLyricsEditing(false);
                                return;
                              }

                              if (isTitleField) {
                                setTitleDraft(selectedSong.title || "");
                                setTitleSaveStatus("idle");
                                setIsTitleEditing(true);
                              }

                              if (isLyricsField) {
                                setLyricsDraft(selectedSong.lyrics || "");
                                setLyricsSaveStatus("idle");
                                setIsLyricsEditing(true);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-100 transition hover:border-emerald-300"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            {isEditingField ? "수정닫기" : "수정"}
                          </button>
                        )}

                        {copyTarget && (
                          <button
                            type="button"
                            onClick={() => void handleCopyField(copyTarget, displayValue)}
                            className="inline-flex items-center gap-1.5 border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-[12px] font-semibold text-cyan-100 transition hover:border-cyan-300"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copiedTarget === copyTarget ? "복사완료" : "복사"}
                          </button>
                        )}
                      </div>
                    </div>

                    {isTitleField && isTitleEditing ? (
                      <input
                        value={titleDraft}
                        onChange={(event) => {
                          setTitleDraft(event.target.value);
                          setTitleSaveStatus("idle");
                        }}
                        className="h-14 w-full border border-white/10 bg-black/35 px-4 text-[15px] font-semibold text-white outline-none transition focus:border-cyan-400/70"
                      />
                    ) : isLyricsField && isLyricsEditing ? (
                      <textarea
                        value={lyricsDraft}
                        onChange={(event) => {
                          setLyricsDraft(event.target.value);
                          setLyricsSaveStatus("idle");
                        }}
                        className="min-h-[520px] w-full resize-y border border-white/10 bg-black/35 p-4 text-[14px] leading-7 text-zinc-100 outline-none transition focus:border-cyan-400/70"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap border border-white/10 bg-white/[0.04] p-4 text-[14px] leading-7 text-zinc-300">
                        {safeText(String(displayValue), "-")}
                      </div>
                    )}
                  </section>
                );
              })}

              <section className="mb-5">
                <h3 className="mb-2 text-[14px] font-bold text-zinc-100">유튜브 제목 후보</h3>
                <div className="space-y-2">
                  {(selectedSong.youtube_titles || []).map((title, index) => (
                    <div key={`${title}-${index}`} className="border border-white/10 bg-white/[0.04] p-3 text-zinc-300">
                      {index + 1}. {title}
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedSong)}
                  className="inline-flex items-center gap-2 border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 font-semibold text-emerald-100 transition hover:border-emerald-300"
                >
                  <Download className="h-4 w-4" />
                  TXT 다운로드
                </button>

                <button
                  type="button"
                  onClick={() => void handleCloseSelectedSong()}
                  className="border border-white/10 bg-black/35 px-4 py-2 font-semibold text-zinc-200 transition hover:border-cyan-400/50 hover:text-cyan-100"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
