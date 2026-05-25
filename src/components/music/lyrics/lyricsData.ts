import type { Option } from "./types";

export const genres: Option[] = [
  { label: "시티팝", value: "City Pop", icon: "🌃" },
  { label: "K-pop", value: "K-pop", icon: "🎸" },
  { label: "발라드", value: "Ballad", icon: "💔" },
  { label: "R&B", value: "R&B", icon: "🎙️" },
  { label: "힙합", value: "Hip-hop", icon: "🎧" },
  { label: "EDM", value: "EDM", icon: "⚡" },
  { label: "재즈", value: "Jazz", icon: "🎷" },
  { label: "Lo-fi", value: "Lo-fi", icon: "🎧" },
  { label: "트로트", value: "Trot", icon: "🎵" },
  { label: "락", value: "Rock", icon: "🎸" },
  { label: "어쿠스틱", value: "Acoustic", icon: "🪕" },
  { label: "신스팝", value: "Synth Pop", icon: "🔮" },
];

export const moods: Option[] = [
  { label: "잔잔한", value: "Calm", icon: "🌙" },
  { label: "깊은 슬픔", value: "Deep Sadness", icon: "😢" },
  { label: "우울한 새벽", value: "Melancholic Dawn", icon: "🌧️" },
  { label: "희망적", value: "Hopeful", icon: "🙏" },
  { label: "밝고 경쾌한", value: "Bright", icon: "☀️" },
  { label: "몽환적인", value: "Dreamy", icon: "💭" },
  { label: "따뜻한", value: "Warm", icon: "🧡" },
  { label: "강렬한", value: "Intense", icon: "🔥" },
  { label: "로맨틱한", value: "Romantic", icon: "💘" },
  { label: "외로운", value: "Lonely", icon: "🌌" },
  { label: "고급스러운", value: "Luxury", icon: "✨" },
  { label: "도시적인", value: "Urban", icon: "🌆" },
];

export const vocals: Option[] = [
  { label: "여성 솔로", value: "Female Solo", icon: "👩" },
  { label: "남성 솔로", value: "Male Solo", icon: "👨" },
  { label: "여성 보컬 그룹", value: "Female Vocal Group", icon: "👥" },
  { label: "남성 보컬 그룹", value: "Male Vocal Group", icon: "👥" },
  { label: "듀엣", value: "Duet", icon: "🎤" },
  { label: "감미로운", value: "Soft Vocal", icon: "🫧" },
  { label: "파워풀한", value: "Powerful Vocal", icon: "🔥" },
  { label: "속삭이는", value: "Whisper Vocal", icon: "🌙" },
  { label: "랩 포함", value: "Rap Included", icon: "🎧" },
  { label: "오토튠", value: "Auto-tune", icon: "🤖" },
];

export const tempos: Option[] = [
  { label: "초저속 40-50 BPM", value: "40-50 BPM", icon: "🐌" },
  { label: "매우 느림 50-70 BPM", value: "50-70 BPM", icon: "🌙" },
  { label: "느림 70-90 BPM", value: "70-90 BPM", icon: "🧘" },
  { label: "보통 90-110 BPM", value: "90-110 BPM", icon: "🚶" },
  { label: "약간 빠름 110-130 BPM", value: "110-130 BPM", icon: "🟡" },
  { label: "빠름 130-150 BPM", value: "130-150 BPM", icon: "🏃" },
  { label: "매우 빠름 150-170 BPM", value: "150-170 BPM", icon: "💪" },
  { label: "초고속 170+ BPM", value: "170+ BPM", icon: "⚡" },
];

export const instruments: Option[] = [
  { label: "피아노", value: "Piano", icon: "🎹" },
  { label: "어쿠스틱 기타", value: "Acoustic Guitar", icon: "🎸" },
  { label: "일렉 기타", value: "Electric Guitar", icon: "🎸" },
  { label: "신스", value: "Synth", icon: "🔮" },
  { label: "베이스", value: "Bass", icon: "🎚️" },
  { label: "드럼", value: "Drums", icon: "🥁" },
  { label: "스트링", value: "Strings", icon: "🎻" },
  { label: "색소폰", value: "Saxophone", icon: "🎷" },
  { label: "오케스트라", value: "Orchestra", icon: "🎼" },
];

export const songStructures = [
  { label: "[일반적인 노래, 약 3분] Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Bridge - Final Chorus - Outro",
    value: "[일반적인 노래, 약 3분] Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Bridge - Final Chorus - Outro",},
  { label: "[풍부한 팝송, 약 4분] Intro - Verse 1 - Pre-Chorus - Chorus - Post-Chorus Hook - Verse 2 - Pre-Chorus - Chorus - Bridge - Final Chorus - Outro",
    value: "[풍부한 팝송, 약 4분] Intro - Verse 1 - Pre-Chorus - Chorus - Post-Chorus Hook - Verse 2 - Pre-Chorus - Chorus - Bridge - Final Chorus - Outro",},
  { label: "[[중독성 후크형, 약 3분 30초] Intro - Verse 1 - Hook - Pre-Chorus - Chorus - Verse 2 - Hook - Chorus - Bridge - Final Chorus - Outro",
    value: "[중독성 후크형, 약 3분 30초] Intro - Verse 1 - Hook - Pre-Chorus - Chorus - Verse 2 - Hook - Chorus - Bridge - Final Chorus - Outro",},
  { label: "[발라드 감성형, 약 4분] Piano Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Emotional Bridge - Key Change Final Chorus - Outro",
    value: "[발라드 감성형, 약 4분] Piano Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Emotional Bridge - Key Change Final Chorus - Outro",},
  { label: "[EDM 드롭형, 약 3분 30초] Intro - Verse 1 - Build Up - Drop Chorus - Verse 2 - Build Up - Drop Chorus - Bridge - Final Drop - Outro",
    value: "[EDM 드롭형, 약 3분 30초] Intro - Verse 1 - Build Up - Drop Chorus - Verse 2 - Build Up - Drop Chorus - Bridge - Final Drop - Outro",},
  { label: "[K-pop 풀버전, 약 4분] Intro - Verse 1 - Pre-Chorus - Chorus - Post-Chorus - Verse 2 - Rap or Bridge - Pre-Chorus - Chorus - Dance Break - Final Chorus - Outro",
    value: "[K-pop 풀버전, 약 4분] Intro - Verse 1 - Pre-Chorus - Chorus - Post-Chorus - Verse 2 - Rap or Bridge - Pre-Chorus - Chorus - Dance Break - Final Chorus - Outro",},
  { label: "[긴 서사형, 약 5분] Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Bridge - Verse 3 - Final Chorus - Outro",
    value: "[긴 서사형, 약 5분] Intro - Verse 1 - Pre-Chorus - Chorus - Verse 2 - Pre-Chorus - Chorus - Bridge - Verse 3 - Final Chorus - Outro",},
];