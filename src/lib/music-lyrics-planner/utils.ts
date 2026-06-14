import type { LyricsHubTemplate } from "./types";

// ==========================================
// 1. Planning Page Option Maps (Korean/Emoji)
// ==========================================
export function mapGenreOption(genreQuery: string | null): string | null {
  if (!genreQuery) return null;
  const q = genreQuery.toLowerCase();
  if (q.includes("city") || q.includes("시티팝")) return "🌃 City Pop";
  if (q.includes("ballad") || q.includes("발라드")) return "💔 Ballad";
  if (q.includes("rnb") || q.includes("r&b") || q.includes("소울")) return "🎙️ R&B";
  if (q.includes("edm") || q.includes("dance") || q.includes("댄스")) return "⚡ Eurodance EDM";
  if (q.includes("acoustic") || q.includes("어쿠스틱") || q.includes("포크") || q.includes("folk")) return "🪕 Acoustic";
  if (q.includes("ambient") || q.includes("엠비언트")) return "🌌 Ambient";
  if (q.includes("synth") || q.includes("신스") || q.includes("레트로")) return "🪩 Synthwave";
  if (q.includes("kpop") || q.includes("k-pop") || q.includes("가요")) return "🎸 K-pop";
  if (q.includes("jazz") || q.includes("재즈")) return "🎷 Jazz Pop";
  if (q.includes("movie") || q.includes("cinematic") || q.includes("영화")) return "🎬 Cinematic";
  return null;
}

export function mapMoodOption(moodQuery: string | null): string | null {
  if (!moodQuery) return null;
  const q = moodQuery.toLowerCase();
  if (q.includes("잔잔") || q.includes("cozy") || q.includes("calm")) return "🌙 잔잔한";
  if (q.includes("슬픔") || q.includes("sad") || q.includes("깊은 슬픔")) return "😢 깊은 슬픔";
  if (q.includes("새벽") || q.includes("dawn") || q.includes("우울")) return "☔ 우울한 새벽";
  if (q.includes("희망") || q.includes("hope")) return "🙏 희망적";
  if (q.includes("밝고") || q.includes("경쾌") || q.includes("bright") || q.includes("happy")) return "☀️ 밝고 경쾌한";
  if (q.includes("몽환") || q.includes("dreamy") || q.includes("space") || q.includes("우주")) return "💭 몽환적인";
  if (q.includes("따뜻") || q.includes("warm")) return "🧡 따뜻한";
  if (q.includes("강렬") || q.includes("heavy") || q.includes("powerful") || q.includes("분노")) return "🔥 강렬한";
  if (q.includes("로맨") || q.includes("love") || q.includes("사랑") || q.includes("설렘")) return "💘 로맨틱한";
  if (q.includes("외롭") || q.includes("lonely") || q.includes("쓸쓸")) return "🌃 외로운";
  if (q.includes("고급") || q.includes("jazz") || q.includes("luxury")) return "✨ 고급스러운";
  if (q.includes("도시") || q.includes("neon") || q.includes("city")) return "🏙️ 도시적인";
  return null;
}

export function mapVocalOption(vocalQuery: string | null): string | null {
  if (!vocalQuery) return null;
  const q = vocalQuery.toLowerCase();
  if (q.includes("여성") || q.includes("female") || q.includes("여자")) return "👩 여성 솔로";
  if (q.includes("남성") || q.includes("male") || q.includes("남자")) return "👨 남성 솔로";
  if (q.includes("듀엣") || q.includes("duet") || q.includes("혼성")) return "👥 듀엣";
  if (q.includes("감미") || q.includes("sweet")) return "🌫️ 감미로운";
  if (q.includes("파워") || q.includes("power") || q.includes("샤우팅")) return "🔥 파워풀한";
  if (q.includes("속삭") || q.includes("whisper")) return "🌙 속삭이는";
  if (q.includes("랩") || q.includes("rap") || q.includes("힙합")) return "🎧 랩 포함";
  if (q.includes("오토") || q.includes("autotune")) return "🤖 오토튠";
  if (q.includes("없음") || q.includes("inst") || q.includes("instrumental")) return "🎼 보컬 없음 / Instrumental";
  return null;
}

export function mapInstrumentOption(instrumentQuery: string | null): string | null {
  if (!instrumentQuery) return null;
  const q = instrumentQuery.toLowerCase();
  if (q.includes("piano") || q.includes("피아노")) {
    if (q.includes("lofi") || q.includes("lo-fi")) return "🎧 Lo-fi Piano";
    return "🎹 Piano";
  }
  if (q.includes("acoustic") || q.includes("통기타") || q.includes("어쿠스틱")) return "🎸 Acoustic Guitar";
  if (q.includes("electric") || q.includes("일렉") || q.includes("일렉기타")) return "🎸 Electric Guitar";
  if (q.includes("synth") || q.includes("신스") || q.includes("keyboard")) return "🎛️ EDM Synth + Drum";
  if (q.includes("rhodes") || q.includes("로즈")) return "🎷 Rhodes";
  if (q.includes("string") || q.includes("스트링") || q.includes("현악")) return "🎻 Strings";
  if (q.includes("pad") || q.includes("ambient") || q.includes("패드")) return "🌊 Ambient Pad";
  if (q.includes("drum") || q.includes("bass") || q.includes("베이스")) return "🥁 Drum & Bass";
  return null;
}

export function mapTempoOption(tempoQuery: string | null): string | null {
  if (!tempoQuery) return null;
  const q = tempoQuery.toLowerCase();
  if (q.includes("60") || q.includes("70") || q.includes("slow") || q.includes("느린")) return "60-75 BPM";
  if (q.includes("75") || q.includes("80") || q.includes("85")) return "75-90 BPM";
  if (q.includes("90") || q.includes("100")) return "90-110 BPM";
  if (q.includes("110") || q.includes("120")) return "110-128 BPM";
  if (q.includes("128") || q.includes("130") || q.includes("140") || q.includes("fast") || q.includes("빠른")) return "128-140 BPM";
  return null;
}

// ==========================================
// 2. Lyrics Page Option Maps (English Values)
// ==========================================
export function mapLyricsGenreOption(genreQuery: string | null): string | null {
  if (!genreQuery) return null;
  const q = genreQuery.toLowerCase();
  if (q.includes("city") || q.includes("시티팝")) return "City Pop";
  if (q.includes("kpop") || q.includes("k-pop") || q.includes("가요")) return "K-pop";
  if (q.includes("ballad") || q.includes("발라드")) return "Ballad";
  if (q.includes("rnb") || q.includes("r&b") || q.includes("소울")) return "R&B";
  if (q.includes("hiphop") || q.includes("hip-hop") || q.includes("힙합") || q.includes("랩")) return "Hip-hop";
  if (q.includes("edm") || q.includes("dance") || q.includes("댄스")) return "EDM";
  if (q.includes("jazz") || q.includes("재즈")) return "Jazz";
  if (q.includes("lofi") || q.includes("lo-fi")) return "Lo-fi";
  if (q.includes("trot") || q.includes("트로트")) return "Trot";
  if (q.includes("rock") || q.includes("metal") || q.includes("락") || q.includes("메탈")) return "Rock";
  if (q.includes("acoustic") || q.includes("어쿠스틱") || q.includes("포크") || q.includes("folk")) return "Acoustic";
  if (q.includes("synth") || q.includes("신스팝")) return "Synth Pop";
  return null;
}

export function mapLyricsMoodOption(moodQuery: string | null): string | null {
  if (!moodQuery) return null;
  const q = moodQuery.toLowerCase();
  if (q.includes("잔잔") || q.includes("cozy") || q.includes("calm")) return "Calm";
  if (q.includes("슬픔") || q.includes("sadness") || q.includes("깊은 슬픔")) return "Deep Sadness";
  if (q.includes("새벽") || q.includes("dawn") || q.includes("우울")) return "Melancholic Dawn";
  if (q.includes("희망") || q.includes("hopeful")) return "Hopeful";
  if (q.includes("밝고") || q.includes("경쾌") || q.includes("bright") || q.includes("happy")) return "Bright";
  if (q.includes("몽환") || q.includes("dreamy") || q.includes("space") || q.includes("우주")) return "Dreamy";
  if (q.includes("따뜻") || q.includes("warm")) return "Warm";
  if (q.includes("강렬") || q.includes("intense") || q.includes("powerful")) return "Intense";
  if (q.includes("로맨") || q.includes("romantic") || q.includes("사랑") || q.includes("설렘")) return "Romantic";
  if (q.includes("외롭") || q.includes("lonely") || q.includes("쓸쓸")) return "Lonely";
  if (q.includes("고급") || q.includes("luxury")) return "Luxury";
  if (q.includes("도시") || q.includes("urban") || q.includes("city")) return "Urban";
  return null;
}

export function mapLyricsVocalOption(vocalQuery: string | null): string | null {
  if (!vocalQuery) return null;
  const q = vocalQuery.toLowerCase();
  if (q.includes("여성 솔로") || q.includes("female solo") || (q.includes("여성") && q.includes("솔로"))) return "Female Solo";
  if (q.includes("남성 솔로") || q.includes("male solo") || (q.includes("남성") && q.includes("솔로"))) return "Male Solo";
  if (q.includes("여성 그룹") || q.includes("female group") || q.includes("여성 보컬 그룹")) return "Female Vocal Group";
  if (q.includes("남성 그룹") || q.includes("male group") || q.includes("남성 보컬 그룹")) return "Male Vocal Group";
  if (q.includes("듀엣") || q.includes("duet") || q.includes("혼성")) return "Duet";
  if (q.includes("감미") || q.includes("soft")) return "Soft Vocal";
  if (q.includes("파워") || q.includes("powerful") || q.includes("샤우팅")) return "Powerful Vocal";
  if (q.includes("속삭") || q.includes("whisper")) return "Whisper Vocal";
  if (q.includes("랩") || q.includes("rap") || q.includes("힙합")) return "Rap Included";
  if (q.includes("오토") || q.includes("autotune") || q.includes("auto-tune")) return "Auto-tune";
  return null;
}

export function mapLyricsTempoOption(tempoQuery: string | null): string | null {
  if (!tempoQuery) return null;
  const q = tempoQuery.toLowerCase();
  if (q.includes("40-50")) return "40-50 BPM";
  if (q.includes("50-70")) return "50-70 BPM";
  if (q.includes("70-90") || q.includes("slow") || q.includes("느린") || q.includes("60") || q.includes("70") || q.includes("80")) return "70-90 BPM";
  if (q.includes("90-110") || q.includes("90") || q.includes("100")) return "90-110 BPM";
  if (q.includes("110-130") || q.includes("110") || q.includes("120")) return "110-130 BPM";
  if (q.includes("130-150") || q.includes("130") || q.includes("140")) return "130-150 BPM";
  if (q.includes("150-170") || q.includes("150") || q.includes("160")) return "150-170 BPM";
  if (q.includes("170")) return "170+ BPM";
  return null;
}

export function mapLyricsInstrumentOption(instrumentQuery: string | null): string | null {
  if (!instrumentQuery) return null;
  const q = instrumentQuery.toLowerCase();
  if (q.includes("piano") || q.includes("피아노")) return "Piano";
  if (q.includes("acoustic") || q.includes("어쿠스틱") || q.includes("통기타")) return "Acoustic Guitar";
  if (q.includes("electric") || q.includes("일렉") || q.includes("일렉기타")) return "Electric Guitar";
  if (q.includes("synth") || q.includes("신스") || q.includes("keyboard")) return "Synth";
  if (q.includes("bass") || q.includes("베이스")) return "Bass";
  if (q.includes("drum") || q.includes("드럼")) return "Drums";
  if (q.includes("string") || q.includes("스트링") || q.includes("현악")) return "Strings";
  if (q.includes("sax") || q.includes("색소폰")) return "Saxophone";
  if (q.includes("orchestra") || q.includes("오케스트라")) return "Orchestra";
  return null;
}

// ==========================================
// 3. Link Builders
// ==========================================
export function buildPlanningHref(item: LyricsHubTemplate): string {
  const params = new URLSearchParams({
    genre: item.categoryId,
    mood: item.mood,
    vocal: item.vocal,
    instrument: item.instrument,
    tempo: item.tempo,
    theme: `${item.title}: ${item.lyricsBackground} (공간적 배경: ${item.placeSetting})`
  });
  return `/studio/music/planning?${params.toString()}`;
}

export function buildLyricsHref(item: LyricsHubTemplate): string {
  const params = new URLSearchParams({
    genre: item.categoryId,
    mood: item.mood,
    vocal: item.vocal,
    instrument: item.instrument,
    tempo: item.tempo,
    theme: `${item.title}: ${item.lyricsBackground} (공간적 배경: ${item.placeSetting})`
  });
  return `/studio/music/lyrics?${params.toString()}`;
}
