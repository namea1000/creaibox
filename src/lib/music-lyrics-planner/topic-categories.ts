import type { LyricsHubCategory, LyricsHubSubTopic } from "./types";

export const topicCategories: LyricsHubCategory[] = [
  // ==========================================
  // 1. 장르별 대분류 (Genres)
  // ==========================================
  {
    id: "citypop",
    group: "장르별 대분류",
    name: "시티팝 (City Pop)",
    emoji: "🌃",
    description: "레트로 신스, 도시적인 밤, 한밤의 드라이브 감성",
    featured: true,
  },
  {
    id: "ballad",
    group: "장르별 대분류",
    name: "발라드 (Ballad)",
    emoji: "💔",
    description: "서정적인 멜로디, 애절한 그리움, 새벽 감수성",
    featured: true,
  },
  {
    id: "rnb-soul",
    group: "장르별 대분류",
    name: "R&B / 소울",
    emoji: "🎙️",
    description: "그루비한 비트, 감미로운 고백, 세련된 야간 재즈 라운지",
    featured: true,
  },
  {
    id: "edm-dance",
    group: "장르별 대분류",
    name: "EDM / 댄스",
    emoji: "⚡",
    description: "페스티벌 에너지, 젊음과 해방감, 신나는 비트",
    featured: true,
  },
  {
    id: "hiphop-rap",
    group: "장르별 대분류",
    name: "힙합 / 랩",
    emoji: "🎧",
    description: "자전적 이야기, 트렌디한 비트, 현실적인 사회 비판",
  },
  {
    id: "acoustic-folk",
    group: "장르별 대분류",
    name: "어쿠스틱 / 포크",
    emoji: "🪕",
    description: "통기타와 목소리, 편안한 자연, 소박한 일상 고백",
  },
  {
    id: "rock-metal",
    group: "장르별 대분류",
    name: "락 / 메탈",
    emoji: "🎸",
    description: "폭발적인 에너지, 청춘의 반항, 일렉기타 중심 사운드",
  },
  {
    id: "trot",
    group: "장르별 대분류",
    name: "트로트 (Trot)",
    emoji: "🎵",
    description: "흥겨운 꺾기 멜로디, 인생의 서글픔과 해학",
  },

  // ==========================================
  // 2. 테마별 대분류 (Themes)
  // ==========================================
  {
    id: "love-romance",
    group: "테마별 대분류",
    name: "사랑 / 설렘",
    emoji: "💖",
    description: "첫 만남의 떨림, 연인들의 산책, 고백 직전의 망설임",
    featured: true,
  },
  {
    id: "breakup-sadness",
    group: "테마별 대분류",
    name: "이별 / 슬픔",
    emoji: "🌧️",
    description: "빗속 버스 정류장, 지워지지 않는 번호, 텅 빈 거실",
    featured: true,
  },
  {
    id: "comfort-healing",
    group: "테마별 대분류",
    name: "위로 / 치유",
    emoji: "🍀",
    description: "지친 퇴근길에 건네는 말, 따뜻한 위로, 사소한 행복",
    featured: true,
  },
  {
    id: "youth-freedom",
    group: "테마별 대분류",
    name: "청춘 / 해방",
    emoji: "🚩",
    description: "새로운 도전을 향한 항해, 주말의 일탈, 자유로운 모험",
  },
  {
    id: "retro-nostalgia",
    group: "테마별 대분류",
    name: "레트로 / 추억",
    emoji: "📻",
    description: "카세트 테이프, 옛 시절 골목길, 학창시절 일기장",
  },
  {
    id: "space-dreamy",
    group: "테마별 대분류",
    name: "우주 / 몽환",
    emoji: "🌌",
    description: "은하수 속에 홀로 남은 외로움, 꿈결 속 신비한 행성",
  },
];

export const topicSubTopics: LyricsHubSubTopic[] = [
  // 1. 시티팝
  { id: "midnight-drive", categoryId: "citypop", name: "한밤의 드라이브", keywords: ["드라이브", "자동차", "라디오", "밤바람"] },
  { id: "neon-lights", categoryId: "citypop", name: "도시의 네온사인", keywords: ["네온사인", "화려함", "가로등", "야경"] },

  // 2. 발라드
  { id: "sad-dawn", categoryId: "ballad", name: "우울한 새벽", keywords: ["새벽", "외로움", "빗소리", "생각"] },
  { id: "tearful-rain", categoryId: "ballad", name: "비 내리는 거리", keywords: ["우산", "정류장", "버스", "눈물"] },

  // 3. R&B
  { id: "jazz-lounge", categoryId: "rnb-soul", name: "재즈 라운지", keywords: ["피아노", "라운지", "와인", "속삭임"] },
  { id: "sweet-confession", categoryId: "rnb-soul", name: "감미로운 고백", keywords: ["고백", "달콤한", "눈빛", "너와나"] },

  // 4. EDM
  { id: "summer-festival", categoryId: "edm-dance", name: "여름 밤 페스티벌", keywords: ["여름밤", "해변", "페스티벌", "폭죽"] },
  { id: "club-energy", categoryId: "edm-dance", name: "자유와 해방", keywords: ["클럽", "일탈", "비트", "해방감"] },

  // 5. 힙합
  { id: "street-story", categoryId: "hiphop-rap", name: "길거리의 독백", keywords: ["독백", "가로등", "아스팔트", "현실"] },
  { id: "rough-dream", categoryId: "hiphop-rap", name: "거친 현실과 꿈", keywords: ["노력", "열정", "마이크", "성공"] },

  // 6. 어쿠스틱
  { id: "cozy-room", categoryId: "acoustic-folk", name: "방구석 음악회", keywords: ["기타", "침대", "햇살", "커피"] },
  { id: "nature-walk", categoryId: "acoustic-folk", name: "바람 부는 숲길", keywords: ["바람", "숲길", "낙엽", "산책"] },

  // 7. 락
  { id: "youth-rebel", categoryId: "rock-metal", name: "청춘의 불꽃", keywords: ["락밴드", "소리", "질주", "자유"] },
  { id: "heavy-heart", categoryId: "rock-metal", name: "포효하는 울분", keywords: ["울분", "샤우팅", "일렉기타", "가슴"] },

  // 8. 트롯
  { id: "life-stage", categoryId: "trot", name: "인생의 희로애락", keywords: ["술잔", "어머니", "인생길", "고개"] },
  { id: "old-market", categoryId: "trot", name: "정겨운 전통시장", keywords: ["시장", "정", "웃음", "장터"] },

  // 9. 사랑
  { id: "fluttering-start", categoryId: "love-romance", name: "두근거리는 시작", keywords: ["연애", "고백", "설렘", "첫사랑"] },
  { id: "sweet-daily", categoryId: "love-romance", name: "달콤한 나날", keywords: ["산책", "카페", "데이트", "선물"] },

  // 10. 이별
  { id: "after-farewell", categoryId: "breakup-sadness", name: "이별의 흔적", keywords: ["사진", "편지", "반지", "방안"] },
  { id: "painful-memory", categoryId: "breakup-sadness", name: "아픈 추억", keywords: ["미련", "눈물", "습관", "미안함"] },

  // 11. 위로
  { id: "warm-hug", categoryId: "comfort-healing", name: "따뜻한 포옹", keywords: ["친구", "위로", "토닥토닥", "햇살"] },
  { id: "walking-home", categoryId: "comfort-healing", name: "퇴근길의 한마디", keywords: ["퇴근", "지하철", "한숨", "수고했어"] },

  // 12. 청춘
  { id: "new-departure", categoryId: "youth-freedom", name: "새로운 항해", keywords: ["바다", "깃발", "도전", "지도"] },
  { id: "growth-pain", categoryId: "youth-freedom", name: "어른이 되는 법", keywords: ["성장통", "불안", "거울", "시간"] },

  // 13. 레트로
  { id: "cassette-tape", categoryId: "retro-nostalgia", name: "카세트 테이프", keywords: ["카세트", "연필", "이어폰", "옛날노래"] },
  { id: "old-neighborhood", categoryId: "retro-nostalgia", name: "옛 골목길의 저녁", keywords: ["골목", "저녁노을", "동네", "아이들"] },

  // 14. 우주
  { id: "starlight-galaxy", categoryId: "space-dreamy", name: "별빛 은하수", keywords: ["은하수", "망원경", "별자리", "신비함"] },
  { id: "dream-planet", categoryId: "space-dreamy", name: "꿈결 같은 행성", keywords: ["행성", "안개", "공중부양", "유성우"] },
];
