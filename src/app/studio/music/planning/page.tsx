"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Library,
  Mic2,
  Save,
  Search,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  generateGeminiContent,
  getRequiredUserGeminiVaultConfig,
} from "@/lib/client/api-vault";

const ALBUM_PLAN_TO_LYRICS_KEY = "creaibox:music:album-plan-to-lyrics:v1";
const PRESET_STATUS = "option_preset";

const defaultAlbumOptionSettings = {
  genre: "⚡ Eurodance EDM",
  mood: "🌙 잔잔한",
  vocal: "👩 여성 솔로",
  tempo: "128-140 BPM",
  instrument: "🎛️ EDM Synth + Drum",
  language: "Korean",
  trackCount: 10,
  albumTheme: "",
};

const defaultAlbumPresetNames = ["기획1", "기획2", "기획3"];

type AlbumTrack = {
  trackNo: number;
  title: string;
  story: string;
  moodKeywords: string;
  genreInstrument: string;
  tempo: string;
  stylePoint: string;
  addOnPrompt: string;
  lyricsGenerated?: boolean;
};

type AlbumPlan = {
  id: string;
  related_album_id: string | null;
  created_at: string | null;
  title: string | null;
  description: string | null;
  genre: string | null;
  mood: string | null;
  concept: string | null;
  target_song_count: number | null;
  language: string | null;
  vocal_direction: string | null;
  sound_direction: string | null;
  cover_concept: string | null;
  youtube_concept: string | null;
  track_list: AlbumTrack[] | null;
  status: string | null;
  raw_result?: Record<string, unknown> | null;
};

type AlbumOptionSettings = typeof defaultAlbumOptionSettings;

type AlbumOptionPreset = {
  id?: string;
  slotKey: string;
  name: string;
  settings: AlbumOptionSettings;
};

type MusicAlbum = {
  id: string;
  created_at: string | null;
  title: string;
  description: string | null;
  genre: string | null;
  mood: string | null;
  cover_image_url: string | null;
  status: string | null;
};

type ParsedAlbumTrack = Partial<Omit<AlbumTrack, "lyricsGenerated">>;

type ParsedAlbumPlan = {
  albumTitle?: string;
  albumDescription?: string;
  albumConcept?: string;
  coverConcept?: string;
  youtubeConcept?: string;
  tracks?: ParsedAlbumTrack[];
};

const genreOptions = [
  "🎸 K-pop",
  "🌃 City Pop",
  "⚡ Eurodance EDM",
  "🌙 Chill EDM",
  "💔 Ballad",
  "🎙️ R&B",
  "🎧 Lo-fi",
  "🎷 Jazz Pop",
  "🪕 Acoustic",
  "🌌 Ambient",
  "🪩 Synthwave",
  "🎬 Cinematic",
];

const moodOptions = [
  "🌙 잔잔한",
  "😢 깊은 슬픔",
  "☔ 우울한 새벽",
  "🙏 희망적",
  "☀️ 밝고 경쾌한",
  "💭 몽환적인",
  "🧡 따뜻한",
  "🔥 강렬한",
  "💘 로맨틱한",
  "🌃 외로운",
  "✨ 고급스러운",
  "🏙️ 도시적인",
];

const vocalOptions = [
  "👩 여성 솔로",
  "👨 남성 솔로",
  "👥 듀엣",
  "🌫️ 감미로운",
  "🔥 파워풀한",
  "🌙 속삭이는",
  "🎧 랩 포함",
  "🤖 오토튠",
  "🎼 보컬 없음 / Instrumental",
];

const tempoOptions = [
  "60-75 BPM",
  "75-90 BPM",
  "90-110 BPM",
  "110-128 BPM",
  "128-140 BPM",
];

const instrumentOptions = [
  "🎹 Piano",
  "🎸 Acoustic Guitar",
  "🎛️ EDM Synth + Drum",
  "🎧 Lo-fi Piano",
  "🎷 Rhodes",
  "🎸 Electric Guitar",
  "🎻 Strings",
  "🌊 Ambient Pad",
  "🥁 Drum & Bass",
];

const albumThemeExamples = [
  "밤 드라이브 중 창밖으로 스쳐 지나가는 네온사인과 잊지 못한 사랑",
  "첫사랑의 설렘과 이별 후에도 남아 있는 따뜻한 기억",
  "여름 밤 클럽, 자유, 청춘, 해방감을 담은 댄스 앨범",
  "비 오는 새벽 혼자 걷는 도시의 감성과 위로",
  "카페 창가에서 계절이 바뀌는 순간을 바라보는 잔잔한 앨범",
  "해변 노을, 파도, 여름의 끝자락을 담은 시티팝 앨범",
  "겨울 새벽, 눈, 고요함, 따뜻한 실내의 대비",
  "새로운 시작을 앞둔 청춘의 불안과 희망",
  "미래 도시를 달리는 사이버펑크 감성의 Synthwave 앨범",
  "별빛 아래에서 혼자 떠나는 감성 여행",
  "이별 후 다시 나를 찾아가는 회복의 앨범",
  "도시 직장인의 퇴근길, 지친 마음을 달래는 음악",
  "유럽 여름 페스티벌 느낌의 밝은 Eurodance EDM 앨범",
  "몽환적인 우주, 은하수, 외로움과 자유를 담은 앨범",
  "피아노 중심의 조용한 밤 공부/작업용 앨범",
  "비밀스러운 라운지, 고급스러운 밤, 재즈와 R&B 분위기",
  "아침 햇살, 산책, 좋은 하루를 여는 밝은 Pop 앨범",
  "가을 낙엽, 오래된 편지, 아련한 추억",
  "운동, 러닝, 에너지, 자신감을 끌어올리는 EDM 앨범",
  "꿈속 도시, 흐릿한 기억, 느린 신스 사운드",
  "사랑 고백 직전의 두근거림과 망설임",
  "긴 여행을 마치고 집으로 돌아오는 평온함",
  "유튜브 Shorts 배경음악에 어울리는 강한 훅 중심 앨범",
  "카페 브이로그, 일상, 햇살, 여유로운 Lo-fi 앨범",
  "게임 배경음악처럼 긴장감 있고 몰입감 있는 전자음악 앨범",
  "아이돌 타이틀곡 후보처럼 강렬하고 중독성 있는 K-pop 앨범",
  "새벽 감성 플레이리스트용 잔잔한 발라드 앨범",
  "봄, 여름, 가을, 겨울 사계절 흐름을 담은 시즌 앨범",
  "혼자 떠난 해외 도시 여행에서 느끼는 낯섦과 설렘",
  "희망, 재시작, 다시 살아나는 감정을 담은 uplifting 앨범",
];

function cleanOption(value: string) {
  return value.replace(/^[^\w가-힣]+/g, "").trim();
}

function extractJson(text: string): ParsedAlbumPlan {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned) as ParsedAlbumPlan;
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as ParsedAlbumPlan;
    }
    throw new Error("AI 응답을 JSON으로 변환하지 못했습니다.");
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || "");
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function makeDefaultPresets(): AlbumOptionPreset[] {
  return defaultAlbumPresetNames.map((name, index) => ({
    slotKey: `preset-${index}`,
    name,
    settings: defaultAlbumOptionSettings,
  }));
}

function normalizePresetSettings(value: unknown): AlbumOptionSettings {
  const raw = value && typeof value === "object" ? value as Partial<AlbumOptionSettings> : {};

  return {
    genre: typeof raw.genre === "string" ? raw.genre : defaultAlbumOptionSettings.genre,
    mood: typeof raw.mood === "string" ? raw.mood : defaultAlbumOptionSettings.mood,
    vocal: typeof raw.vocal === "string" ? raw.vocal : defaultAlbumOptionSettings.vocal,
    tempo: typeof raw.tempo === "string" ? raw.tempo : defaultAlbumOptionSettings.tempo,
    instrument: typeof raw.instrument === "string" ? raw.instrument : defaultAlbumOptionSettings.instrument,
    language: typeof raw.language === "string" ? raw.language : defaultAlbumOptionSettings.language,
    trackCount: typeof raw.trackCount === "number" ? raw.trackCount : defaultAlbumOptionSettings.trackCount,
    albumTheme: typeof raw.albumTheme === "string" ? raw.albumTheme : defaultAlbumOptionSettings.albumTheme,
  };
}

export default function MusicPlanningPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [plans, setPlans] = useState<AlbumPlan[]>([]);
  const [albums, setAlbums] = useState<MusicAlbum[]>([]);
  const [optionPresets, setOptionPresets] = useState<AlbumOptionPreset[]>(makeDefaultPresets);
  const [activePresetKey, setActivePresetKey] = useState("preset-0");
  const [arePresetsLoaded, setArePresetsLoaded] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<MusicAlbum | null>(null);
  const [isAlbumPickerOpen, setIsAlbumPickerOpen] = useState(false);
  const [albumSearchTerm, setAlbumSearchTerm] = useState("");
  const [planPage, setPlanPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const presetSaveTimerRef = useRef<number | null>(null);
  const presetTabRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [form, setForm] = useState<AlbumOptionSettings>(defaultAlbumOptionSettings);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("music_album_plans")
      .select("*")
      .eq("status", "saved")
      .order("created_at", { ascending: false });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    let savedTitleSet = new Set<string>();

    if (user) {
      const { data: savedSongs } = await supabase
        .from("music_lyrics_projects")
        .select("title")
        .eq("user_id", user.id)
        .neq("status", "trash");

      savedTitleSet = new Set(
        (savedSongs ?? [])
          .map((song) => String(song.title || "").trim())
          .filter(Boolean)
      );
    }

    const hydratedPlans = ((data ?? []) as AlbumPlan[]).map((plan) => ({
      ...plan,
      track_list: Array.isArray(plan.track_list)
        ? plan.track_list.map((track) => ({
          ...track,
          lyricsGenerated:
            Boolean(track.lyricsGenerated) || savedTitleSet.has(track.title.trim()),
        }))
        : plan.track_list,
    }));

    setPlans(hydratedPlans);
  }, [supabase]);

  const fetchOptionPresets = useCallback(async () => {
    const { data, error } = await supabase
      .from("music_album_plans")
      .select("*")
      .eq("status", PRESET_STATUS)
      .order("created_at", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setArePresetsLoaded(true);
      return;
    }

    const defaults = makeDefaultPresets();
    const rows = (data ?? []) as AlbumPlan[];
    const defaultSlotKeys = new Set(defaults.map((preset) => preset.slotKey));
    const merged = defaults.map((fallback) => {
      const matched = rows.find((row) => row.raw_result?.preset_slot === fallback.slotKey);

      if (!matched) return fallback;

      return {
        id: matched.id,
        slotKey: fallback.slotKey,
        name: matched.title || fallback.name,
        settings: normalizePresetSettings(matched.raw_result?.settings),
      };
    });
    const extraPresets: AlbumOptionPreset[] = rows
      .map((row) => {
        const slotKey =
          typeof row.raw_result?.preset_slot === "string" ? row.raw_result.preset_slot : row.id;

        return {
          id: row.id,
          slotKey,
          name: row.title || `기획${defaults.length + 1}`,
          settings: normalizePresetSettings(row.raw_result?.settings),
        };
      })
      .filter((preset) => !defaultSlotKeys.has(preset.slotKey));

    const nextPresets = [...merged, ...extraPresets];

    setOptionPresets(nextPresets);
    setActivePresetKey(nextPresets[0]?.slotKey || "preset-0");
    setForm(nextPresets[0]?.settings || defaultAlbumOptionSettings);
    setArePresetsLoaded(true);
  }, [supabase]);

  const fetchAlbums = useCallback(async () => {
    const { data, error } = await supabase
      .from("music_albums")
      .select("id,created_at,title,description,genre,mood,cover_image_url,status")
      .neq("status", "trash")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setAlbums((data ?? []) as MusicAlbum[]);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPlans();
      void fetchAlbums();
      void fetchOptionPresets();
    });
  }, [fetchAlbums, fetchOptionPresets, fetchPlans]);

  useEffect(() => {
    return () => {
      if (presetSaveTimerRef.current) {
        window.clearTimeout(presetSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const activeTab = presetTabRefs.current[activePresetKey];

    activeTab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activePresetKey]);

  const saveOptionPreset = useCallback(
    async (preset: AlbumOptionPreset) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const rawResult = {
        preset_slot: preset.slotKey,
        settings: preset.settings,
      };

      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Unknown",
        title: preset.name,
        description: "앨범 생성 조건 프리셋",
        genre: cleanOption(preset.settings.genre),
        mood: cleanOption(preset.settings.mood),
        concept: preset.settings.albumTheme,
        target_song_count: preset.settings.trackCount,
        language: preset.settings.language,
        vocal_direction: cleanOption(preset.settings.vocal),
        sound_direction: `${cleanOption(preset.settings.instrument)}, ${preset.settings.tempo}`,
        track_list: [],
        related_album_id: null,
        status: PRESET_STATUS,
        is_favorite: false,
        raw_result: rawResult,
      };

      if (preset.id) {
        const { error } = await supabase
          .from("music_album_plans")
          .update(payload)
          .eq("id", preset.id);

        if (error) setErrorMessage(error.message);
        return;
      }

      const { data, error } = await supabase
        .from("music_album_plans")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data?.id) {
        setOptionPresets((prev) =>
          prev.map((item) =>
            item.slotKey === preset.slotKey ? { ...item, id: data.id as string } : item
          )
        );
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (!arePresetsLoaded) return;

    const activePreset = optionPresets.find((preset) => preset.slotKey === activePresetKey);
    if (!activePreset) return;

    if (presetSaveTimerRef.current) {
      window.clearTimeout(presetSaveTimerRef.current);
    }

    presetSaveTimerRef.current = window.setTimeout(() => {
      void saveOptionPreset(activePreset);
    }, 700);
  }, [activePresetKey, arePresetsLoaded, optionPresets, saveOptionPreset]);

  const updateActivePreset = (nextSettings: AlbumOptionSettings) => {
    setForm(nextSettings);
    setOptionPresets((prev) =>
      prev.map((preset) =>
        preset.slotKey === activePresetKey
          ? {
            ...preset,
            settings: nextSettings,
          }
          : preset
      )
    );
  };

  const updateActivePresetName = (name: string) => {
    setOptionPresets((prev) =>
      prev.map((preset) =>
        preset.slotKey === activePresetKey
          ? {
            ...preset,
            name,
          }
          : preset
      )
    );
  };

  const selectPreset = (preset: AlbumOptionPreset) => {
    setActivePresetKey(preset.slotKey);
    setForm(preset.settings);
  };

  const addOptionPreset = () => {
    const nextIndex = optionPresets.length + 1;
    const nextPreset: AlbumOptionPreset = {
      slotKey: `preset-${Date.now()}`,
      name: `기획${nextIndex}`,
      settings: form,
    };

    setOptionPresets((prev) => [nextPreset, ...prev]);
    setActivePresetKey(nextPreset.slotKey);
    setForm(nextPreset.settings);
  };

  const deleteActiveOptionPreset = async () => {
    const activePreset = optionPresets.find((preset) => preset.slotKey === activePresetKey);
    if (!activePreset) return;

    const isDefaultPreset = defaultAlbumPresetNames.some(
      (_, index) => activePreset.slotKey === `preset-${index}`
    );

    if (isDefaultPreset) {
      window.alert("기본 기획 탭은 삭제할 수 없습니다.");
      return;
    }

    if (!window.confirm(`"${activePreset.name}" 기획 탭을 삭제할까요?`)) return;

    if (presetSaveTimerRef.current) {
      window.clearTimeout(presetSaveTimerRef.current);
      presetSaveTimerRef.current = null;
    }

    if (activePreset.id) {
      const { error } = await supabase
        .from("music_album_plans")
        .update({ status: "trash" })
        .eq("id", activePreset.id);

      if (error) {
        window.alert(`기획 탭 삭제 실패: ${error.message}`);
        return;
      }
    }

    const nextPresets = optionPresets.filter(
      (preset) => preset.slotKey !== activePreset.slotKey
    );
    const nextActivePreset = nextPresets[0] || makeDefaultPresets()[0];

    setOptionPresets(nextPresets.length > 0 ? nextPresets : [nextActivePreset]);
    setActivePresetKey(nextActivePreset.slotKey);
    setForm(nextActivePreset.settings);
  };

  const filteredAlbums = useMemo(() => {
    const keyword = albumSearchTerm.trim().toLowerCase();

    return albums.filter((album) => {
      if (!keyword) return true;

      return (
        album.title.toLowerCase().includes(keyword) ||
        (album.description || "").toLowerCase().includes(keyword) ||
        (album.genre || "").toLowerCase().includes(keyword) ||
        (album.mood || "").toLowerCase().includes(keyword)
      );
    });
  }, [albumSearchTerm, albums]);

  const visiblePlans = useMemo(() => {
    return plans;
  }, [plans]);

  const totalPlanPages = Math.max(1, visiblePlans.length);
  const safePlanPage = Math.min(planPage, totalPlanPages);
  const paginatedVisiblePlans = visiblePlans.slice(safePlanPage - 1, safePlanPage);

  const moveToAlbumPlanPage = (album: MusicAlbum) => {
    const targetIndex = visiblePlans.findIndex(
      (plan) => plan.related_album_id === album.id
    );

    if (targetIndex < 0) {
      window.alert("이 앨범에 연결된 기획을 찾지 못했습니다.");
      return;
    }

    setSelectedAlbum(album);
    setPlanPage(targetIndex + 1);
    setIsAlbumPickerOpen(false);
  };

  const handleGenerateAlbumPlan = async () => {
    setIsGenerating(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      const vaultConfig = getRequiredUserGeminiVaultConfig();

      const pureGenre = cleanOption(form.genre);
      const pureMood = cleanOption(form.mood);
      const pureVocal = cleanOption(form.vocal);
      const pureInstrument = cleanOption(form.instrument);

      const prompt = `
너는 전문 음악 프로듀서이자 앨범 기획자다.

아래 조건으로 Suno 가사 생성 전에 사용할 앨범 기획안을 만들어라.

[선택 조건]
- 장르: ${pureGenre}
- 분위기: ${pureMood}
- 보컬: ${pureVocal}
- 속도: ${form.tempo}
- 중심 악기: ${pureInstrument}
- 언어: ${form.language}
- 목표 트랙 수: ${form.trackCount}
- 사용자가 입력한 앨범 방향: ${form.albumTheme || "선택 조건을 바탕으로 자동 기획"}

[출력 방향]
1. 앨범 제목은 자동으로 만든다.
2. 앨범 설명은 상업적이고 감성적으로 작성한다.
3. 트랙은 반드시 ${form.trackCount}개 만든다.
4. 각 트랙은 첨부 예시처럼 곡명, 스토리/주요 장면, 감성/키워드, 장르/악기 구성, Tempo, Style/특징, 추가 프롬프트를 포함한다.
5. 모든 트랙은 이후 가사 생성 메뉴에서 바로 사용할 수 있을 만큼 구체적이어야 한다.
6. 트랙별 분위기는 서로 겹치지 않게 앨범 전체 흐름을 만든다.
7. lyricsGenerated는 false로 둔다.

반드시 아래 JSON만 반환하라. 마크다운 금지.

{
  "albumTitle": "앨범 제목",
  "albumDescription": "앨범 설명",
  "albumConcept": "앨범 전체 콘셉트",
  "coverConcept": "앨범 커버 이미지 콘셉트",
  "youtubeConcept": "유튜브 업로드 방향",
  "tracks": [
    {
      "trackNo": 1,
      "title": "곡명",
      "story": "스토리 / 주요 장면",
      "moodKeywords": "감성 / 키워드",
      "genreInstrument": "장르 / 악기 구성",
      "tempo": "Tempo",
      "stylePoint": "Style / 특징, 포인트",
      "addOnPrompt": "추가 프롬프트",
      "lyricsGenerated": false
    }
  ]
}
      `;

      const text = await generateGeminiContent({
        apiKey: vaultConfig.apiKey,
        modelName: vaultConfig.model || "gemini-3-flash-preview",
        prompt,
        responseMimeType: "application/json",
      });

      const parsed = extractJson(text);

      const tracks: AlbumTrack[] = Array.isArray(parsed.tracks)
        ? parsed.tracks.slice(0, form.trackCount).map((track, index) => ({
          trackNo: Number(track.trackNo) || index + 1,
          title: track.title || `Track ${index + 1}`,
          story: track.story || "",
          moodKeywords: track.moodKeywords || "",
          genreInstrument: track.genreInstrument || pureGenre,
          tempo: track.tempo || form.tempo,
          stylePoint: track.stylePoint || "",
          addOnPrompt: track.addOnPrompt || "",
          lyricsGenerated: false,
        }))
        : [];

      if (tracks.length === 0) {
        throw new Error("트랙 리스트를 생성하지 못했습니다.");
      }

      const albumPayload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Unknown",

        title: parsed.albumTitle || `${pureGenre} Album`,
        description: parsed.albumDescription || "",
        genre: pureGenre,
        mood: pureMood,
        cover_image_url: null,
        status: "saved",
        is_favorite: false,
      };

      const { data: createdAlbum, error: albumError } = await supabase
        .from("music_albums")
        .insert([albumPayload])
        .select("id")
        .single();

      if (albumError || !createdAlbum?.id) {
        throw new Error(albumError?.message || "앨범 자동 생성 실패");
      }

      const payload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Unknown",

        title: parsed.albumTitle || `${pureGenre} Album Plan`,
        description: parsed.albumDescription || "",
        genre: pureGenre,
        mood: pureMood,
        concept: parsed.albumConcept || form.albumTheme || "",
        target_song_count: form.trackCount,
        language: form.language,
        vocal_direction: pureVocal,
        sound_direction: `${pureInstrument}, ${form.tempo}`,
        cover_concept: parsed.coverConcept || "",
        youtube_concept: parsed.youtubeConcept || "",
        track_list: tracks,
        reference_keywords: [pureGenre, pureMood, pureVocal, form.tempo],
        related_album_id: createdAlbum.id,
        status: "saved",
        is_favorite: false,
        raw_result: parsed,
      };

      const { data, error } = await supabase
        .from("music_album_plans")
        .insert([payload])
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      setPlans((prev) => [data as AlbumPlan, ...prev]);
      setPlanPage(1);
      void fetchAlbums();
      window.alert("✅ 앨범 기획안이 생성되어 저장되었습니다.");
    } catch (error: unknown) {
      const message = getErrorMessage(error) || "앨범 기획 생성 실패";
      setErrorMessage(message);
      window.alert(`❌ ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlanAsAlbum = async (plan: AlbumPlan) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.alert("로그인 정보를 확인할 수 없습니다.");
        return;
      }

      if (plan.related_album_id) {
        window.alert("이미 앨범 관리에 저장된 기획안입니다.");
        router.push("/studio/music/albums");
        return;
      }

      const albumPayload = {
        user_id: user.id,
        user_email: user.email,
        user_nicename:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Unknown",

        title: plan.title || "제목 없는 앨범",
        description: plan.description || plan.concept || "",
        genre: plan.genre || null,
        mood: plan.mood || null,
        cover_image_url: null,
        status: "saved",
        is_favorite: false,
      };

      const { data: createdAlbum, error: albumError } = await supabase
        .from("music_albums")
        .insert([albumPayload])
        .select("id")
        .single();

      if (albumError || !createdAlbum?.id) {
        throw new Error(albumError?.message || "앨범 저장 실패");
      }

      const { error: updateError } = await supabase
        .from("music_album_plans")
        .update({
          related_album_id: createdAlbum.id,
        })
        .eq("id", plan.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setPlans((prev) =>
        prev.map((item) =>
          item.id === plan.id
            ? {
              ...item,
              related_album_id: createdAlbum.id,
            }
            : item
        )
      );

      window.alert("✅ 앨범 관리에 저장되었습니다.");
      router.push("/studio/music/albums");
    } catch (error: unknown) {
      window.alert(`❌ 앨범 저장 실패: ${getErrorMessage(error)}`);
    }
  };

  const startLyricsGeneration = async (plan: AlbumPlan, track?: AlbumTrack) => {
    const tracks = Array.isArray(plan.track_list) ? plan.track_list : [];
    const targetTracks = track ? [track] : tracks;

    const payload = {
      mode: track ? "single-track" : "album-plan",
      autoGenerate: true,
      planId: plan.id,
      albumTitle: plan.title || "",
      albumConcept: plan.concept || plan.description || "",
      genre: plan.genre || cleanOption(form.genre),
      mood: plan.mood || cleanOption(form.mood),
      vocal: plan.vocal_direction || cleanOption(form.vocal),
      tempo: track?.tempo || form.tempo,
      instrument: plan.sound_direction || cleanOption(form.instrument),
      language: plan.language || form.language,
      generationCount: Math.min(Math.max(targetTracks.length || 1, 1), 20),
      tracks: targetTracks,
    };

    window.sessionStorage.setItem(ALBUM_PLAN_TO_LYRICS_KEY, JSON.stringify(payload));
    router.push("/studio/music/lyrics?autoGenerate=1&source=album-plan");
  };

  const openTrackLyricsInLibrary = (track: AlbumTrack) => {
    router.push(`/studio/music/library?openTitle=${encodeURIComponent(track.title)}`);
  };


  return (
    <div className="min-h-full bg-[#050507] px-6 py-8 text-white">
      <div className="mx-auto max-w-[1800px] space-y-8">
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-[#111827] to-black p-8 shadow-2xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                <Wand2 size={15} />
                Album Planning AI
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                AI 앨범 기획(앨범 자동 생성)
              </h1>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
                장르, 분위기, 보컬, BPM, 악기만 선택하면 앨범 제목과 트랙 리스트를 자동 생성합니다.
                생성된 트랙은 바로 가사 & Suno 자동 생성으로 연결됩니다.
              </p>
            </div>

          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-6">
              <div className="mb-5 overflow-x-auto border-b border-white/10 pb-4">
                <div className="flex min-w-max items-stretch">
                  <button
                    type="button"
                    onClick={addOptionPreset}
                    className="min-w-[80px] border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-center text-xs font-black text-cyan-200 hover:bg-cyan-400/20"
                  >
                    + 기획 추가
                  </button>

                  {optionPresets.map((preset) => {
                    const active = preset.slotKey === activePresetKey;

                    return (
                      <div
                        key={preset.slotKey}
                        ref={(element) => {
                          presetTabRefs.current[preset.slotKey] = element;
                        }}
                        className={`min-w-[110px] border px-3 py-2 ${active
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 bg-black/30"
                          }`}
                      >
                        {active ? (
                          <input
                            value={preset.name}
                            onChange={(event) => updateActivePresetName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.currentTarget.blur();
                              }
                            }}
                            className="w-full bg-transparent text-center text-xs font-black text-cyan-100 outline-none"
                            aria-label="프리셋 이름 수정"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => selectPreset(preset)}
                            className="w-full text-center text-xs font-black text-zinc-400 hover:text-white"
                          >
                            {preset.name}
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => void deleteActiveOptionPreset()}
                    className="min-w-[100px] border border-red-400/35 bg-red-500/10 px-3 py-2 text-center text-xs font-black text-red-200 hover:bg-red-500/20"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Trash2 size={13} />
                      앨범 삭제하기
                    </span>
                  </button>
                </div>
              </div>

              <h2 className="mb-5 flex items-center gap-2 text-xl font-black">
                <Sparkles className="text-cyan-300" />
                앨범 생성 조건
              </h2>

              <div className="space-y-3">
                {[
                  ["장르", "genre", genreOptions],
                  ["분위기", "mood", moodOptions],
                  ["보컬", "vocal", vocalOptions],
                  ["속도", "tempo", tempoOptions],
                  ["중심 악기", "instrument", instrumentOptions],
                ].map(([label, key, options]) => (
                  <label
                    key={String(key)}
                    className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3"
                  >
                    <span className="text-xs font-bold text-zinc-500">{String(label)}</span>
                    <select
                      value={form[key as keyof typeof form] as string}
                      onChange={(event) =>
                        updateActivePreset({
                          ...form,
                          [key as string]: event.target.value,
                        } as AlbumOptionSettings)
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan-400"
                    >
                      {(options as string[]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}

                <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
                  <span className="text-xs font-bold text-zinc-500">언어</span>
                  <select
                    value={form.language}
                    onChange={(event) =>
                      updateActivePreset({ ...form, language: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Korean">Korean</option>
                    <option value="English">English</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </label>

                <label className="grid grid-cols-[86px_minmax(0,1fr)] items-center gap-3">
                  <span className="text-xs font-bold text-zinc-500">트랙 수</span>
                  <select
                    value={form.trackCount}
                    onChange={(event) =>
                      updateActivePreset({
                        ...form,
                        trackCount: Number(event.target.value),
                      })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-cyan-400"
                  >
                    {Array.from({ length: 16 }).map((_, index) => {
                      const count = index + 5;
                      return (
                        <option key={count} value={count}>
                          {count}곡 기획
                        </option>
                      );
                    })}
                  </select>
                </label>

                <textarea
                  value={form.albumTheme}
                  onChange={(event) =>
                    updateActivePreset({ ...form, albumTheme: event.target.value })
                  }
                  placeholder="선택 입력: 앨범 방향 예) 밤 드라이브, 첫사랑, 여름 클럽, 계절 앨범..."
                  className="min-h-24 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={handleGenerateAlbumPlan}
                  disabled={isGenerating}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-black text-black hover:bg-cyan-300 disabled:opacity-50"
                >
                  <Save size={17} />
                  {isGenerating ? "앨범 기획 생성 중..." : "앨범 AI 자동 생성"}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-black text-white">
                  선택 입력 예시
                </h3>

                <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                  {albumThemeExamples.map((example, index) => (
                    <button
                      key={`${example}-${index}`}
                      type="button"
                      onClick={() =>
                        updateActivePreset({ ...form, albumTheme: example })
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-left text-xs leading-5 text-zinc-400 hover:border-cyan-400 hover:text-white"
                    >
                      <span className="mr-2 font-black text-cyan-300">
                        {index + 1}.
                      </span>
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}
          </aside>

          <main className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="mb-1 text-2xl font-black">생성된 앨범 기획 리스트</h2>
                  <p className="text-sm text-zinc-500">
                    각 트랙의 가사 생성 버튼을 누르면 가사 & Suno 메뉴로 이동한 뒤 자동 생성이 바로 실행됩니다.
                  </p>
                  {selectedAlbum && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                      <Disc3 size={13} />
                      {selectedAlbum.title} 위치로 이동됨
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAlbum(null);
                        }}
                        className="ml-1 rounded-full p-0.5 text-cyan-100 hover:bg-cyan-400/20"
                        aria-label="앨범 선택 해제"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAlbumPickerOpen(true)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 text-sm font-black text-cyan-200 hover:bg-cyan-400/20"
                  >
                    <Library size={16} />
                    생성한 앨범 불러오기
                  </button>

                  <div className="inline-flex h-11 items-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAlbum(null);
                        setPlanPage((current) => Math.max(1, current - 1));
                      }}
                      disabled={safePlanPage <= 1}
                      className="inline-flex h-full w-11 items-center justify-center text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
                      aria-label="이전 앨범 기획"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex h-full min-w-[76px] items-center justify-center border-x border-white/10 px-3 text-sm font-black text-white">
                      {visiblePlans.length === 0 ? 0 : safePlanPage}
                      <span className="mx-1 text-zinc-500">/</span>
                      {visiblePlans.length}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAlbum(null);
                        setPlanPage((current) => Math.min(totalPlanPages, current + 1));
                      }}
                      disabled={safePlanPage >= totalPlanPages || visiblePlans.length === 0}
                      className="inline-flex h-full w-11 items-center justify-center text-zinc-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-700"
                      aria-label="다음 앨범 기획"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-zinc-500">
                앨범 기획 목록을 불러오는 중입니다.
              </div>
            ) : visiblePlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-10 text-center text-zinc-500">
                {selectedAlbum
                  ? "선택한 앨범 기획을 찾지 못했습니다."
                  : "아직 생성된 앨범 기획이 없습니다."}
              </div>
            ) : (
              paginatedVisiblePlans.map((plan) => {
                const tracks = Array.isArray(plan.track_list) ? plan.track_list : [];
                const generatedCount = tracks.filter((track) => track.lyricsGenerated).length;
                const hasPendingTracks = generatedCount < tracks.length;
                const metadataItems = [
                  formatDate(plan.created_at),
                  plan.genre,
                  plan.mood,
                  plan.vocal_direction,
                  tracks[0]?.tempo,
                  plan.sound_direction,
                  plan.language,
                ].filter(Boolean);

                return (
                  <article
                    key={plan.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]"
                  >
                    <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-fuchsia-500/10 to-black p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                            {metadataItems.join(" · ")}
                          </div>

                          <h3 className="text-3xl font-black text-white">
                            {plan.title || "제목 없는 앨범"}
                          </h3>

                          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-400">
                            {plan.description || plan.concept || "앨범 설명 없음"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                            {tracks.length} Tracks
                          </span>
                          <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                            가사 생성 {generatedCount}/{tracks.length}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (hasPendingTracks) void startLyricsGeneration(plan);
                          }}
                          disabled={!hasPendingTracks}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-400 px-5 text-xs font-black text-black hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/15 disabled:text-cyan-200"
                        >
                          {hasPendingTracks ? <Mic2 size={15} /> : <CheckCircle2 size={15} />}
                          {hasPendingTracks
                            ? "이 앨범 콘셉트로 전체 가사 자동 생성"
                            : "전체 가사생성 완료"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleSavePlanAsAlbum(plan)}
                          disabled={Boolean(plan.related_album_id)}
                          className="inline-flex h-11 items-center gap-2 rounded-xl bg-fuchsia-500 px-5 text-xs font-black text-white hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Disc3 size={15} />
                          {plan.related_album_id ? "앨범 저장완료" : "앨범으로 저장"}
                        </button>

                        <Link
                          href="/studio/music/albums"
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-5 text-xs font-black text-indigo-100 hover:border-indigo-300 hover:bg-indigo-500/25"
                        >
                          <Disc3 size={15} />
                          앨범 관리로 이동
                        </Link>

                        <Link
                          href="/studio/music/library"
                          className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-5 text-xs font-black text-emerald-100 hover:border-emerald-300 hover:bg-emerald-500/25"
                        >
                          <Library size={15} />
                          음악 라이브러리
                        </Link>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1320px] border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-amber-300/30 bg-amber-400/15 text-left text-[14px] font-black uppercase tracking-wider text-amber-100">
                            <th className="w-16 px-4 py-3 text-center">No</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">스토리 / 주요 장면</th>
                            <th className="px-4 py-3">감성 / 키워드</th>
                            <th className="px-4 py-3">장르 / 악기</th>
                            <th className="w-28 px-4 py-3">Tempo</th>
                            <th className="px-4 py-3">Style</th>
                            <th className="w-40 px-4 py-3 text-center">가사 생성</th>
                            <th className="w-36 px-4 py-3 text-center">가사 보기</th>
                          </tr>
                        </thead>

                        <tbody>
                          {tracks.map((track) => {
                            const isLyricsGenerated = Boolean(track.lyricsGenerated);

                            return (
                              <tr
                                key={`${plan.id}-${track.trackNo}`}
                                className="border-b border-white/5 hover:bg-white/[0.03]"
                              >
                                <td className="px-4 py-4 text-center text-zinc-500">
                                  {track.trackNo}
                                </td>
                                <td className="px-4 py-4 font-black text-white">
                                  {track.title}
                                  <div
                                    className={`mt-1 text-xs ${isLyricsGenerated ? "text-cyan-300" : "text-zinc-500"}`}
                                  >
                                    {isLyricsGenerated ? "가사 생성 완료" : "가사 생성 전"}
                                  </div>
                                </td>
                                <td className="max-w-[280px] px-4 py-4 leading-6 text-zinc-400">
                                  {track.story}
                                </td>
                                <td className="max-w-[220px] px-4 py-4 leading-6 text-zinc-400">
                                  {track.moodKeywords}
                                </td>
                                <td className="max-w-[220px] px-4 py-4 leading-6 text-zinc-400">
                                  {track.genreInstrument}
                                </td>
                                <td className="px-4 py-4 text-zinc-400">
                                  {track.tempo}
                                </td>
                                <td className="max-w-[240px] px-4 py-4 leading-6 text-zinc-400">
                                  {track.stylePoint}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!isLyricsGenerated) void startLyricsGeneration(plan, track);
                                    }}
                                    disabled={isLyricsGenerated}
                                    className={
                                      isLyricsGenerated
                                        ? "inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 text-xs font-black text-cyan-200 disabled:cursor-not-allowed"
                                        : "inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-400 px-4 text-xs font-black text-black hover:bg-cyan-300"
                                    }
                                  >
                                    {isLyricsGenerated ? (
                                      <CheckCircle2 size={15} />
                                    ) : (
                                      <Mic2 size={15} />
                                    )}
                                    {isLyricsGenerated ? "가사생성 완료" : "가사 생성"}
                                  </button>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isLyricsGenerated) openTrackLyricsInLibrary(track);
                                    }}
                                    disabled={!isLyricsGenerated}
                                    className={
                                      isLyricsGenerated
                                        ? "inline-flex h-10 items-center justify-center rounded-xl bg-emerald-400 px-4 text-xs font-black text-black hover:bg-emerald-300"
                                        : "inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-black text-zinc-600 disabled:cursor-not-allowed"
                                    }
                                  >
                                    가사 보기
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </article>
                );
              })
            )}
          </main>
        </section>
      </div>

      {isAlbumPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-8 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-black">생성한 앨범 불러오기</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  앨범 관리에 저장된 앨범을 선택하면 전체 기획 목록 안에서 해당 앨범 페이지로 이동합니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAlbumPickerOpen(false)}
                className="rounded-xl border border-white/10 bg-black/30 p-2 text-zinc-400 hover:text-white"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-white/10 px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={albumSearchTerm}
                  onChange={(event) => setAlbumSearchTerm(event.target.value)}
                  placeholder="앨범명, 장르, 감성 검색"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="max-h-[calc(88vh-190px)] overflow-y-auto px-6 py-5">
              {filteredAlbums.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] px-5 py-12 text-center text-zinc-500">
                  불러올 앨범이 없습니다.
                </div>
              ) : (
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAlbum(null);
                      setPlanPage(1);
                      setIsAlbumPickerOpen(false);
                    }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4 text-left hover:border-cyan-400/50"
                  >
                    <div>
                      <div className="font-black text-white">전체 앨범 기획 보기</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        최신 앨범 기획이 있는 1페이지로 이동합니다.
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                      {plans.length}개
                    </span>
                  </button>

                  {filteredAlbums.map((album) => {
                    const planCount = plans.filter(
                      (plan) => plan.related_album_id === album.id
                    ).length;
                    const isSelected = selectedAlbum?.id === album.id;

                    return (
                      <button
                        key={album.id}
                        type="button"
                        onClick={() => moveToAlbumPlanPage(album)}
                        disabled={planCount === 0}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${isSelected
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-white/10 bg-black/30 hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-45"
                          }`}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-cyan-600/30 to-fuchsia-700/30">
                          {album.cover_image_url ? (
                            <img
                              src={album.cover_image_url}
                              alt={album.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Disc3 className="h-7 w-7 text-white/30" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate font-black text-white">
                            {album.title}
                          </div>
                          <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                            {album.description || "앨범 설명 없음"}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] font-bold text-cyan-200">
                              {album.genre || "Genre"}
                            </span>
                            <span className="rounded-full bg-fuchsia-400/10 px-2.5 py-1 text-[11px] font-bold text-fuchsia-200">
                              {album.mood || "Mood"}
                            </span>
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                              {formatDate(album.created_at)}
                            </span>
                          </div>
                        </div>

                        <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                          기획 {planCount}개
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
