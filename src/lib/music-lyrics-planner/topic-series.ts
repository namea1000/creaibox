import type { LyricsHubTemplate } from "./types";

import { cityPopTemplates } from "./idea-series/citypop";
import { balladTemplates } from "./idea-series/ballad";
import { edmDanceTemplates } from "./idea-series/edm-dance";
import { rnbSoulTemplates } from "./idea-series/rnb-soul";
import { hiphopRapTemplates } from "./idea-series/hiphop-rap";
import { acousticFolkTemplates } from "./idea-series/acoustic-folk";
import { rockMetalTemplates } from "./idea-series/rock-metal";
import { trotTemplates } from "./idea-series/trot";
import { spaceDreamyTemplates } from "./idea-series/space-dreamy";
import { themeTemplates } from "./idea-series/themes";

const coreTemplates: LyricsHubTemplate[] = [
  ...cityPopTemplates,
  ...balladTemplates,
  ...edmDanceTemplates,
  ...rnbSoulTemplates,
  ...hiphopRapTemplates,
  ...acousticFolkTemplates,
  ...rockMetalTemplates,
  ...trotTemplates,
  ...spaceDreamyTemplates,
  ...themeTemplates,
];

// Definition of component words for high-quality, category-specific template generation
interface GenerationData {
  subTopics: string[];
  adjectives: string[];
  nouns: string[];
  places: string[];
  storylines: string[];
  vocalStyles: string[];
  instruments: string[];
  tempos: string[];
  keywords: string[];
  moods?: string[];
}

const generatorConfig: Record<string, GenerationData> = {
  citypop: {
    subTopics: ["midnight-drive", "neon-lights"],
    adjectives: ["한밤의", "레트로", "네온빛", "도시의", "퍼플", "플라스틱", "한여름 밤의", "올림픽대로의", "시티", "자정의", "에메랄드"],
    nouns: ["드라이브", "네온사인", "가로등", "LP바", "칵테일", "밤바람", "라디오", "한강", "헤드라이트", "스피커", "순환도로", "자유"],
    places: [
      "자정 무렵 올림픽대로를 달리는 은색 차 안",
      "네온사인이 반짝이는 빌딩 숲 루프탑",
      "레트로 신스 음악이 나지막하게 흐르는 LP 바",
      "한강 선착장 뒤편 주황색 가로등 밑",
      "도심 빌딩 가득 내려다보이는 옥탑 평상",
      "자정의 편의점 야외 플라스틱 의자"
    ],
    storylines: [
      "도시의 빌딩 숲 사이를 가로지르며, 네온사인 불빛 아래 희미하게 떠오르는 첫사랑의 기억을 쓸쓸하게 회상하는 감수성.",
      "창문을 열고 밤바람을 맞으며 달리는 고속도로, 카라디오에서 나오는 레트로 팝 멜로디에 실어 보내는 그리움.",
      "화려한 도시 야경을 뒤로한 채 칵테일 잔을 가볍게 흔들며, 지나간 연인과 나누었던 달콤한 미소를 회고함.",
      "오래된 카세트테이프 A면의 마지막 곡처럼 아련하고 소박했던 시절의 고백과, 지금은 닿을 수 없는 마음에 대한 노래."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣"],
    instruments: ["신스", "베이스", "드럼", "일렉기타"],
    tempos: ["110-125 BPM", "100-115 BPM", "115-130 BPM"],
    keywords: ["네온사인", "가로등", "한강", "드라이브", "레트로", "신스팝", "밤바람", "라디오", "LP바"]
  },
  ballad: {
    subTopics: ["sad-dawn", "tearful-rain"],
    adjectives: ["겨울", "마지막", "눈물의", "기억 속", "차가운", "빗방울", "쓸쓸한", "아픈", "그리운", "하얀", "새벽녘의"],
    nouns: ["정류장", "일기", "커피", "편지", "눈물", "약속", "독백", "흔적", "수첩", "그리움", "한숨", "뒷모습"],
    places: [
      "비 내리는 조용한 버스 정류장 벤치",
      "불이 꺼진 자정 무렵의 좁은 방 안",
      "낙엽이 우스스 떨어지는 늦가을 대학 교정",
      "창가에 빗방울이 세차게 부딪히는 카페 구석자리",
      "어두운 새벽 가로등 불빛 아래 놀이터",
      "차가운 바람이 부는 겨울 바닷가"
    ],
    storylines: [
      "아무도 없는 깊은 밤, 홀로 침대에 누워 헤어진 연인의 사진을 정리하며 몰려오는 지독한 고독과 후회를 노래.",
      "버스 정류장 차창 밖으로 떨어지는 빗방울을 보며, 마지막 눈물 흘리며 멀어져 가던 연인의 뒷모습을 회상.",
      "시간이 흘러 식어버린 에스프레소처럼, 차갑게 식어 돌아선 상대방의 마지막 눈빛과 서글픈 감정을 담아냄.",
      "서랍 깊숙이 넣어두었던 보내지 못한 손편지를 꺼내 읽으며 눈물짓는 쓸쓸한 독백을 서정적인 멜로디로 연출."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "감미로운"],
    instruments: ["피아노", "스트링", "어쿠스틱 피아노", "오케스트라"],
    tempos: ["60-75 BPM", "70-85 BPM", "65-80 BPM"],
    keywords: ["새벽", "외로움", "빗소리", "우산", "정류장", "버스", "눈물", "그리움", "미련"]
  },
  "rnb-soul": {
    subTopics: ["jazz-lounge", "sweet-confession"],
    adjectives: ["그루비한", "감미로운", "달콤한", "비밀스런", "벨벳", "나른한", "소울풀한", "로맨틱", "따스한", "속삭이는"],
    nouns: ["라운지", "와인", "속삭임", "고백", "눈빛", "그루브", "숨소리", "미소", "밤하늘", "커피", "촛불", "터치"],
    places: [
      "은은한 붉은 조명이 흐르는 도심 재즈 바",
      "주말 오전 햇살이 길게 늘어지는 침대 위",
      "은은한 아로마 캔들이 켜진 조용한 방 안",
      "밤바람이 신선하게 불어오는 옥상 계단",
      "빈티지한 원목 가구로 가득한 골목 커피숍"
    ],
    storylines: [
      "어스름한 재즈 바 구석 테이블에서 와인 잔을 만지작거리며 연인에게 건네는 부드럽고 끈적한 고백.",
      "비 내리는 휴일 아침, 침대 속에서 연인의 따뜻한 온기와 숨소리를 느끼며 누리는 소박하고 깊은 사랑.",
      "나른한 R&B 리듬에 맞춰 서로를 안고 조용히 춤추는 연인의 그림자를 로맨틱하고 소울풀한 그루브로 묘사.",
      "커피 위에 부드럽게 얹어진 휘핑크림처럼 달콤하고 나른한 연인의 미소에 스며드는 포근한 러브스토리."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "속삭이는"],
    instruments: ["신스", "Rhodes", "베이스", "드럼"],
    tempos: ["75-90 BPM", "80-95 BPM", "85-100 BPM"],
    keywords: ["재즈", "라운지", "와인", "속삭임", "고백", "달콤함", "그루브", "로맨틱", "소울"]
  },
  "edm-dance": {
    subTopics: ["summer-festival", "club-energy"],
    adjectives: ["네온", "형광빛", "일렉트릭", "질주하는", "뜨거운", "자유로운", "터질듯한", "스타라이트", "페스티벌", "짜릿한"],
    nouns: ["축제", "스파크", "폭죽", "탈출", "에너지", "비트", "하트", "심박수", "속도", "질주", "미러볼", "함성"],
    places: [
      "수천 개의 야광봉이 흔들리는 야외 페스티벌 광장",
      "거대한 스피커와 레이저가 뿜어져 나오는 클럽 플로어",
      "조명이 가득 켜진 한여름 밤의 해변 축제 무대",
      "주말 자정의 차가운 빌딩숲 대형 댄스홀",
      "가상의 일렉트로닉 우주 비행선 스테이지"
    ],
    storylines: [
      "한여름 밤 야외 페스티벌 무대, 드롭(Drop) 직전의 터질 것 같은 비트에 맞춰 하늘로 솟구치는 청춘의 에너지.",
      "일상의 답답한 규칙을 던져버리고, 사이키델릭한 레이저 조명 아래에서 땀 흘리며 춤추는 짜릿한 일탈.",
      "질주하는 비트에 맞춰 서로 눈이 마주치는 순간 가슴에 강하게 튀는 사랑의 불꽃을 폭발적인 신스로 연주.",
      "금요일 퇴근 직후 정장을 벗어던지고 클럽 플로어로 뛰어드는 직장인의 유쾌하고 신나는 자유 찬가."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "파워풀한"],
    instruments: ["신스", "드럼", "일렉기타", "베이스"],
    tempos: ["120-135 BPM", "125-140 BPM", "128 BPM"],
    keywords: ["해변", "페스티벌", "폭죽", "클럽", "일탈", "비트", "해방감", "스파크", "에너지"]
  },
  "hiphop-rap": {
    subTopics: ["street-story", "rough-dream"],
    adjectives: ["아스팔트", "거친", "현실적인", "독백의", "회색빛", "뜨거운", "밤샘", "자전적인", "타이트한", "묵직한"],
    nouns: ["독백", "현실", "야망", "성공", "마이크", "가사", "노트북", "허슬", "택시", "가로등", "한숨", "열정"],
    places: [
      "차가운 새벽 공기가 흐르는 주택가 편의점 파라솔 밑",
      "방음재가 다 뜯어진 좁은 지하 래퍼의 작업실",
      "한강 대교를 쓸쓸히 지나가는 심야 택시 뒷좌석",
      "어둠에 잠긴 도심 빌딩 가득한 대학가 밤거리",
      "모니터 불빛만 조용히 켜진 자취방 책상 앞"
    ],
    storylines: [
      "세상의 조롱 and 불확실한 내일 앞에서도 오직 목소리 하나만 믿고 가사지를 써 내려가는 래퍼의 뜨거운 허슬.",
      "차가운 아스팔트 길을 걸으며, 편의점 맥주 한 캔에 지친 하루와 야망을 녹여내는 솔직하고 거친 힙합 스토리.",
      "한강 다리 위를 지나며 빠르게 스쳐 가는 도시 불빛들을 보며 쓸쓸한 자아와 현실의 피로를 토로하는 싱잉 랩.",
      "모두가 잠든 밤 모니터 앞에 앉아 미래를 직접 창조하겠다는 굳은 의지를 타이트한 트랩 드럼에 얹어 노래."
    ],
    vocalStyles: ["남성 솔로", "여성 솔로", "랩 포함", "오토튠"],
    instruments: ["신스", "베이스", "드럼", "피아노"],
    tempos: ["85-100 BPM", "90-110 BPM", "95-115 BPM"],
    keywords: ["독백", "가사", "작업실", "성공", "현실", "야망", "트랩", "붐뱁", "허슬"]
  },
  "acoustic-folk": {
    subTopics: ["cozy-room", "nature-walk"],
    adjectives: ["포근한", "서정적인", "소박한", "나른한", "바람부는", "따스한", "편안한", "빈티지", "수줍은", "싱그러운"],
    nouns: ["침대", "햇살", "산책", "휘파람", "모닥불", "바람", "고양이", "낙엽", "파도", "나무", "기타", "커피"],
    places: [
      "따뜻한 아침 햇살이 가득 쏟아지는 침대 옆 구석",
      "단풍이 노랗게 물든 한적한 숲속 산책로",
      "비 내리는 일요일 오후, 김 서린 창가 테이블",
      "풀벌레 소리 가득한 조용한 캠핑장 모닥불 앞",
      "낡은 책과 고양이가 누워 있는 햇살 드는 다락방",
      "시원한 가을바람이 부는 한적한 해질녘 바닷가"
    ],
    storylines: [
      "침대 옆에서 통기타를 통통 튕기며 부르는 연인과의 평화롭고 소소한 아침의 일상과 포근한 사랑 노래.",
      "바람 부는 숲길을 걸으며 발에 밟히는 낙엽 소리에 묻어둔 어릴 적 소중했던 대화와 기억을 소환.",
      "비 오는 날 따뜻한 차 한 잔을 마주 두고 앉아, 조용히 눈을 맞추며 옛 추억을 나누는 따뜻한 통기타 듀엣곡.",
      "모닥불 앞에서 타닥타닥 타오르는 불빛을 보며 청춘들의 우정과 미래에 대한 다짐을 담아낸 힐링 포크송."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "감미로운"],
    instruments: ["기타", "어쿠스틱 기타", "피아노", "스트링"],
    tempos: ["70-85 BPM", "75-90 BPM", "80-95 BPM"],
    keywords: ["기타", "햇살", "산책", "바람", "모닥불", "고양이", "낮잠", "편안함", "치유"]
  },
  "rock-metal": {
    subTopics: ["youth-rebel", "heavy-heart"],
    adjectives: ["폭발하는", "강렬한", "거친", "차가운", "처절한", "와일드한", "뜨거운", "자유로운", "녹슨", "포효하는"],
    nouns: ["외침", "울분", "샤우팅", "질주", "사슬", "거울", "폭풍", "엔진", "자유", "비명", "희망", "심장"],
    places: [
      "진공관 앰프 소리가 터져 나오는 차고지 안",
      "장대비가 세차게 쏟아지는 도심 빌딩 옥상 위",
      "끝없이 황량하게 뻗은 심야 외곽 국도 위",
      "어둡고 낡은 지하 락 밴드 클럽 무대",
      "차가운 습기가 차오르는 새벽 도심 뒤골목"
    ],
    storylines: [
      "먼지 가득한 차고지에서 볼륨을 한껏 올리고 세상의 편견과 규칙에 거칠게 저항하는 아드레날린 락.",
      "가슴속 깊은 곳에 억눌린 상처와 슬픔을 폭우 내리는 옥상 위에서 소리치며 떨쳐버리는 하드 락/메탈.",
      "끝없는 국도를 거칠게 달리며, 내일이 없는 것처럼 내지르는 자유와 해방에 대한 거침없는 드라이브송.",
      "녹슨 마음의 사슬을 마침내 끊어내고 외치는 처절하지만 승리감 넘치는 모던 락 보컬 듀엣 가사."
    ],
    vocalStyles: ["남성 솔로", "여성 솔로", "듀엣", "파워풀한"],
    instruments: ["기타", "일렉기타", "드럼", "베이스"],
    tempos: ["130-150 BPM", "140-160 BPM", "125-145 BPM"],
    keywords: ["락밴드", "일렉기타", "질주", "울분", "샤우팅", "자유", "반항", "해방", "엔진"]
  },
  trot: {
    subTopics: ["life-stage", "old-market"],
    adjectives: ["흥겨운", "정겨운", "경쾌한", "애절한", "눈물젖은", "구수한", "뜨거운", "사랑스런", "신명나는", "아지랑이"],
    nouns: ["인생길", "술잔", "고개", "야시장", "떡볶이", "등불", "시장", "웃음", "기차", "플랫폼", "사랑", "어머니"],
    places: [
      "노란 포장마차 안, 따뜻한 안주 접시 앞",
      "시끌벅적하고 정이 넘치는 시골 오일장 터",
      "만남과 이별이 교차하는 밤 늦은 서울역 대합실",
      "코스모스가 붉게 피어 있는 고향 동네 버스 정류장",
      "화려한 홍등과 먹거리 냄새 가득한 밤 야시장 골목"
    ],
    storylines: [
      "인생의 모진 바람을 견디며 한 잔 술에 고통을 털어버리고, 희망찬 아침을 노래하는 세미 트로트.",
      "시끌벅적한 야시장에서 연인과 맛있는 떡볶이를 나눠 먹으며 옥신각신 피어나는 서민들의 알콩달콩한 사랑.",
      "님을 찾아가는 고속열차처럼, 머뭇거리지 않고 내 마음의 엑셀을 밟겠다는 시원한 디스코 트로트 가사.",
      "시골 고향 집 안방에서 평생 고생만 하신 어머니의 거친 손을 어루만지며 흐느끼는 정통 슬픈 꺾기 트로트."
    ],
    vocalStyles: ["남성 솔로", "여성 솔로", "듀엣"],
    instruments: ["신스", "베이스", "드럼", "오케스트라"],
    tempos: ["135-155 BPM", "140-160 BPM", "130-145 BPM"],
    keywords: ["인생", "술잔", "어머니", "시장", "정", "웃음", "야시장", "사랑", "기차"]
  },
  "love-romance": {
    subTopics: ["fluttering-start", "sweet-daily"],
    adjectives: ["설레는", "핑크빛", "달콤한", "수줍은", "두근거리는", "눈부신", "싱그러운", "포근한", "봄날의", "우연한", "꿈속의", "눈물겹게 이쁜", "영원한", "어쩌다 만난", "오후의", "행복한", "속삭이는", "따스한", "첫사랑의", "은하수 아래"],
    nouns: ["고백", "산책", "튤립", "소나기", "눈빛", "기차역", "벚꽃", "자전거", "다락방", "정원", "초콜릿", "약속", "선물", "귓속말", "어깨", "바람", "손바닥", "하모니", "웃음", "그림자"],
    places: [
      "벚꽃 잎이 눈처럼 흩날리는 따스한 공원 벤치",
      "오후의 부드러운 햇살이 비치는 북카페 창가석",
      "소나기가 쏟아지는 여름날 정류장의 노란 우산 속",
      "해질녘 오렌지빛 노을이 쏟아지는 한강 잔디밭",
      "초록빛 잔디가 가득 깔린 주말 분수대 광장",
      "조용한 밤하늘의 밝은 보름달 아래 가로등 밑",
      "하얀 눈꽃송이가 피어나는 화이트 가로수길 나무 아래",
      "싱그러운 허브 향기가 흐르는 숲속 오두막 벤치"
    ],
    storylines: [
      "봄바람에 벚꽃이 하얗게 흩날리는 거리에서 오래도록 마음속에 품어온 사랑을 용기 내어 전하는 두근거리는 로맨스.",
      "소나기 속에 좁은 우산 하나를 나눠 쓰고 걸으며 서로 어깨가 부딪힐 때마다 요동치는 심장 소리를 묘사한 러브송.",
      "함께 자전거를 타고 강바람을 쐬며 마주 보는 순간, 연인의 흘러내린 머리카락마저 사랑스러워 미소 짓는 달콤한 일상.",
      "조용하고 평온한 오후의 카페, 마주 앉아 턱을 괸 채 서로의 눈빛 속에서 미래를 그리며 속삭이는 따스한 이야기."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "감미로운"],
    instruments: ["기타", "피아노", "어쿠스틱 기타", "신스"],
    tempos: ["80-95 BPM", "75-90 BPM", "85-100 BPM"],
    keywords: ["고백", "사랑", "설렘", "봄바람", "데이트", "산책", "우산", "두근두근", "미소"]
  },
  "breakup-sadness": {
    subTopics: ["after-farewell", "painful-memory"],
    adjectives: ["지워진", "식어버린", "흐릿한", "아픈", "쓸쓸한", "차가운", "눈물로 쓴", "마지막", "어두운", "비 내리는", "아득한", "가슴 저린", "홀로 남은", "빛바랜", "겨울날의"],
    nouns: ["자취방", "번호", "눈물", "습관", "사진", "액정", "서랍", "겨울비", "미안함", "미련", "독백", "한숨", "전화", "흔적", "정류장"],
    places: [
      "혼자 남겨진 쓸쓸하고 정막한 아파트 거실 소파 위",
      "어둠에 잠긴 차가운 새벽 방 안, 흐릿한 스마트폰 액정 앞",
      "먼지가 살짝 앉은 오래된 서랍장 구석 수첩 사이",
      "겨울비가 세차게 내려앉는 차가운 도심 대로변 카페",
      "우리 함께 자주 걷던 낙엽이 뒹구는 쓸쓸한 강변길"
    ],
    storylines: [
      "이별 후 남겨진 텅 빈 방 안에서 상대방의 옷자락이나 흔적을 보며 뒤늦게 밀려오는 슬픔과 후회의 고백.",
      "휴대전화 연락처 주소록에서 이름을 지웠지만, 머릿속에서 끝내 지워지지 않는 11자리 번호를 곱씹는 아픔.",
      "함께 찍었던 폴라로이드 사진 속 환하게 웃고 있는 우리와, 차갑게 돌아서야 했던 현실의 이별을 대조한 슬픈 노래.",
      "내리는 빗물 속에 미안하다는 말끝으로 냉정하게 떠나버린 연인의 마지막 실루엣을 바라보며 짓는 한숨."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "애절한"],
    instruments: ["피아노", "스트링", "피아노 & 스트링", "오케스트라"],
    tempos: ["60-75 BPM", "65-80 BPM", "70-85 BPM"],
    keywords: ["이별", "슬픔", "눈물", "미련", "추억", "방안", "사진", "미안함", "한숨"]
  },
  "comfort-healing": {
    subTopics: ["warm-hug", "walking-home"],
    adjectives: ["따스한", "든든한", "포근한", "지친", "지하철의", "괜찮은", "희망찬", "사소한", "부드러운", "평온한"],
    nouns: ["위로", "어깨", "포옹", "숨소리", "다짐", "내일", "그늘", "쉼터", "행복", "햇살", "지하철", "퇴근길"],
    places: [
      "밤 11시 30분, 퇴근길 사람들로 붐비는 막차 버스 안 창가",
      "동이 트기 시작하여 은은한 하늘빛이 비쳐 드는 옥상 난간 앞",
      "비가 개고 난 후 따스한 볕이 내리쬐는 조용한 공원 벤치",
      "잔잔한 풀벌레 소리만 들려오는 깊은 밤 시골집 마당 평상",
      "서로 등을 맞대고 누워 온기를 나눌 수 있는 포근한 내 방"
    ],
    storylines: [
      "지친 일과를 끝마치고 피곤한 몸을 실어 집으로 돌아가는 사람들에게 건네는 차분하고 다정한 위로의 한마디.",
      "인생의 힘겨운 파도가 몰아쳐 쓰러지려 할 때, 아무 말 없이 다가와 따뜻하게 등을 토닥이며 안아주는 진실한 포옹.",
      "오늘 흘린 눈물이 내일의 찬란한 해돋이 속에서 마르고, 더 굳건한 희망으로 다시 시작할 수 있다는 위안.",
      "소소한 행복들이 모여 거대한 시련을 이겨낼 수 있는 큰 버팀목이 된다는 아름다운 힐링의 발라드 가사."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "감미로운"],
    instruments: ["기타", "피아노", "어쿠스틱 기타", "Rhodes"],
    tempos: ["70-85 BPM", "75-90 BPM", "80-95 BPM"],
    keywords: ["위로", "포옹", "퇴근길", "지하철", "한숨", "수고했어", "햇살", "내일", "치유"]
  },
  "youth-freedom": {
    subTopics: ["new-departure", "growth-pain"],
    adjectives: ["지도가 없는", "불안한", "찬란한", "스무살의", "엑셀의", "자유로운", "시원한", "푸른", "거침없는", "새로운"],
    nouns: ["바다", "깃발", "도전", "성장통", "거울", "시간", "탈출", "엑셀", "모험", "꿈", "심장", "파도"],
    places: [
      "파란 바다와 하얀 물보라가 끝없이 펼쳐지는 돛배 위",
      "좁고 어수선하지만 밤샘 작업의 흔적이 가득한 청춘의 방",
      "자정이 넘은 시각, 가로등 빛만 꼬리를 무는 외곽 순환 고속도로",
      "불이 환하게 켜진 드넓은 주말 대학 축제 가설 무대",
      "붉게 타오르는 석양을 정면으로 마주하고 서 있는 언덕 끝"
    ],
    storylines: [
      "기존에 정해진 지도가 없더라도, 내 가슴속 심장의 나침반을 나침반 삼아 돛을 올리고 거침없이 나아가는 항해.",
      "사회로 첫발을 내디디며 겪는 쓰라린 성장통과, 완벽하지 않은 내 모습 그대로를 사랑하겠다는 청춘의 자조적 독백.",
      "모든 속박과 스트레스를 백미러 뒤로 날려 보내며 가슴 벅찬 에너지를 품고 고속도로를 질주하는 시원한 락 사운드.",
      "어른이 된다는 것의 무게와 불안 속에서도, 밤하늘의 별처럼 반짝이게 타오를 미래의 내 꿈을 굳건히 노래함."
    ],
    vocalStyles: ["남성 솔로", "여성 솔로", "듀엣", "파워풀한"],
    instruments: ["기타", "일렉기타", "드럼", "신스"],
    tempos: ["120-140 BPM", "128 BPM", "130-150 BPM"],
    keywords: ["도전", "청춘", "자유", "모험", "바다", "깃발", "성장통", "시간", "질주"]
  },
  "retro-nostalgia": {
    subTopics: ["cassette-tape", "old-neighborhood"],
    adjectives: ["카세트", "오래된", "옛 골목길의", "바랜", "아날로그", "수줍던", "연필로 적은", "노을빛", "학창시절의"],
    nouns: ["테이프", "일기장", "골목", "저녁노을", "동네", "비밀", "일기", "추억", "이어폰", "편지", "우표", "친구"],
    places: [
      "먼지 쌓인 카세트 플레이어와 연필꽂이가 놓인 서랍 책상 앞",
      "어스름해지며 붉은 꼬리가 길게 드리워지는 시골 동네 골목길 평상",
      "낡은 종이 상자와 오래된 편지 뭉치들이 가득 든 다락방 구석",
      "학창 시절 함께 하굣길에 수다를 떨던 오래된 떡볶이 가게 안",
      "카세트테이프들이 수북이 꽂혀 있는 조그만 동네 레코드 숍"
    ],
    storylines: [
      "카세트테이프의 늘어진 면을 연필 한 자루로 돌려 감아 다시 듣던 시절, 그 녹음기 너머 속삭임에 가슴 뛰던 추억.",
      "어스름해진 저녁 골목길, 밥 먹으러 들어오라는 어머니의 정겨운 외침과 흙먼지 흘리며 놀던 친구들의 웃음소리.",
      "학창시절 소중하게 주고받던 비밀 일기장을 들춰보며, 지금은 어디선가 어른이 되었을 그 시절 너를 아련하게 회고.",
      "빛바랜 사진 앨범을 넘기며 아날로그 멜로디와 연필로 꾹꾹 눌러 썼던 연서의 구절을 담담한 통기타로 읊조림."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "감미로운"],
    instruments: ["기타", "피아노", "어쿠스틱 기타", "Rhodes"],
    tempos: ["70-85 BPM", "75-90 BPM", "65-80 BPM"],
    keywords: ["카세트", "이어폰", "옛날노래", "골목길", "노을", "추억", "일기장", "아날로그", "학창시절"]
  },
  "space-dreamy": {
    subTopics: ["starlight-galaxy", "dream-planet"],
    adjectives: ["성운 속의", "토성의", "외로운", "초신성", "유성우", "무중력", "신비로운", "은하수", "우주의", "몽환적인"],
    nouns: ["비밀", "고리", "궤도", "폭발", "소원", "유영", "성운", "행성", "탐사선", "신호음", "은하수", "해방"],
    places: [
      "별자리가 눈부시게 쏟아져 내리는 사막 한가운데 전파 천문대",
      "차가운 얼음과 미세먼지가 영롱하게 반짝이는 토성의 고리 위",
      "태양계 끝자락을 소리 없이 홀로 날아가는 고독한 탐사선 내부",
      "오로라와 밤하늘 성운이 눈부신 녹색 커튼을 드리운 가상 지표",
      "푸른 유성우가 빗방울처럼 내리는 어두운 산마루 잔디밭 위"
    ],
    storylines: [
      "무한히 아득한 은하수 성운의 구름 속에 홀로 서서, 우주가 점으로 보일 정도로 멀리 떠난 연인을 그리워하는 노래.",
      "중력이 사라진 무중력 궤도 위를 유영하듯 붕 떠오르며 세상의 속박으로부터 완전히 벗어난 신비로운 해방감.",
      "소멸하는 초신성이 뿜어내는 마지막이자 가장 눈부신 빛의 순간을 빌려 우리의 영원할 찬란한 약속을 찬미함.",
      "보이저 탐사선이 발신하는 기계식 신호음을 피아노 멜로디 삼아 차갑고 검은 진공 공간에 흘려보내는 우주 로맨스."
    ],
    vocalStyles: ["여성 솔로", "남성 솔로", "듀엣", "몽환적인"],
    instruments: ["신스", "드럼", "베이스", "스트링"],
    tempos: ["80-95 BPM", "85-100 BPM", "95-110 BPM"],
    keywords: ["은하수", "성운", "행성", "토성", "우주선", "외로움", "신비함", "유성우", "무중력"]
  }
};

// Generates stable, high-quality, category-specific templates for each of the 14 category IDs
function generateStableTemplates(): LyricsHubTemplate[] {
  const generated: LyricsHubTemplate[] = [];

  for (const [catId, data] of Object.entries(generatorConfig)) {
    // Determine the count based on the category to prioritize love and sadness
    let count = 60; // default to 60 templates per category
    if (catId === "love-romance") {
      count = 150; // 150 templates for love
    } else if (catId === "breakup-sadness") {
      count = 100; // 100 templates for breakup
    }

    for (let index = 0; index < count; index += 1) {
      // Deterministically mix elements to ensure unique, stable, high-quality outcomes
      const subTopicId = data.subTopics[index % data.subTopics.length];
      const adj = data.adjectives[index % data.adjectives.length];
      const noun = data.nouns[(index * 3 + 2) % data.nouns.length];
      
      // Title generation (Ensure English translation in parentheses fits)
      const isLove = catId === "love-romance";
      const suffix = isLove 
        ? ` (${["Love", "Blossom", "Sweet Heart", "Serenade", "Warm Hug", "Destiny", "Spring Stroll", "Daydream", "Whisper", "Harmony"][index % 10]})` 
        : ` (${index + 1})`;
      const title = `${adj} ${noun}${suffix}`;
      
      const place = data.places[index % data.places.length];
      const backgroundTemplate = data.storylines[index % data.storylines.length];
      
      // Customize background slightly based on index to keep them uniquely distinct
      const lyricsBackground = `${backgroundTemplate} (${place}에서 느껴지는 특유의 분위기와 ${adj} 감정을 극대화하여 묘사한 가사.)`;
      
      const mood = data.moods ? data.moods[index % data.moods.length] : "감성적인";
      const vocal = data.vocalStyles[index % data.vocalStyles.length];
      const instrument = data.instruments[index % data.instruments.length];
      const tempo = data.tempos[index % data.tempos.length];
      
      // Extract unique keywords combination
      const kw1 = data.keywords[index % data.keywords.length];
      const kw2 = data.keywords[(index * 2 + 1) % data.keywords.length];
      const kw3 = data.keywords[(index * 3 + 3) % data.keywords.length];
      const keywords = Array.from(new Set([kw1, kw2, kw3])).slice(0, 3);

      const description = `${place}에서 그리는 ${adj} ${noun} 이야기. ${vocal}의 보컬로 전하는 ${mood} 가사 Preset.`;

      generated.push({
        id: `${catId}-generated-preset-${index}`,
        title,
        categoryId: catId,
        subTopicId,
        mood,
        vocal,
        instrument,
        tempo,
        keywords,
        description,
        lyricsBackground,
        placeSetting: place,
        featured: index === 0 || index === 15 || index === 30, // Make a few featured
      });
    }
  }

  return generated;
}

// Combine handcrafted high-quality templates with deterministic expanded templates
export const musicLyricsHubSeries: LyricsHubTemplate[] = [
  ...coreTemplates,
  ...generateStableTemplates(),
];
