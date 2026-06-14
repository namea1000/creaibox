import { Channel, Creator, Message } from "./types";

export const channels: Channel[] = [
  {
    id: "chat",
    title: "실시간 채팅",
    desc: "전체 크리에이터 로비",
    icon: "MessageCircle",
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-500",
    unreadCount: 2,
  },
  {
    id: "writing",
    title: "크리아이박스 글쓰기",
    desc: "SEO, 블로그, 애드센스",
    icon: "PenTool",
    color: "from-violet-600 to-blue-600",
    badgeColor: "bg-violet-500",
    unreadCount: 0,
  },
  {
    id: "naver",
    title: "네이버 블로그",
    desc: "C-Rank, 노출, 키워드",
    icon: "Newspaper",
    color: "from-emerald-600 to-teal-600",
    badgeColor: "bg-emerald-500",
    unreadCount: 4,
  },
  {
    id: "music",
    title: "뮤직 스튜디오",
    desc: "Suno, 가사, 커버 이미지",
    icon: "Music",
    color: "from-rose-600 to-pink-600",
    badgeColor: "bg-rose-500",
    unreadCount: 1,
  },
  {
    id: "image",
    title: "이미지 스튜디오",
    desc: "Midjourney, Flux, 프롬프트",
    icon: "ImageIcon",
    color: "from-purple-600 to-fuchsia-600",
    badgeColor: "bg-purple-500",
    unreadCount: 0,
  },
  {
    id: "video",
    title: "비디오 스튜디오",
    desc: "Kling, Veo, 영상 제작",
    icon: "Video",
    color: "from-cyan-600 to-blue-600",
    badgeColor: "bg-cyan-500",
    unreadCount: 3,
  },
  {
    id: "youtube",
    title: "유튜브 연구소",
    desc: "쇼츠, CTR, 썸네일 전략",
    icon: "PlayCircle",
    color: "from-red-600 to-orange-600",
    badgeColor: "bg-red-500",
    unreadCount: 0,
  },
  {
    id: "ai-trend",
    title: "AI 트렌드 토론방",
    desc: "GPT, Claude, Gemini 뉴스",
    icon: "Bot",
    color: "from-sky-600 to-violet-600",
    badgeColor: "bg-sky-500",
    unreadCount: 2,
  },
  {
    id: "collab",
    title: "협업 프로젝트",
    desc: "팀원 모집과 공동 제작",
    icon: "Share2",
    color: "from-amber-600 to-orange-600",
    badgeColor: "bg-amber-500",
    unreadCount: 0,
  },
  {
    id: "money",
    title: "수익화 연구소",
    desc: "애드센스, 유튜브, 부업",
    icon: "BadgeDollarSign",
    color: "from-green-600 to-emerald-600",
    badgeColor: "bg-green-500",
    unreadCount: 5,
  },
];

export const mockCreators: Record<string, Creator[]> = {
  chat: [
    { name: "창작마스터", role: "종합 크리에이터", status: "online", avatarColor: "bg-blue-500" },
    { name: "비주얼노벨", role: "스토리 작가", status: "online", avatarColor: "bg-purple-500" },
    { name: "미디어아트", role: "영상 편집자", status: "away", avatarColor: "bg-cyan-500" },
    { name: "인플루언서A", role: "마케터", status: "online", avatarColor: "bg-green-500" },
  ],
  writing: [
    { name: "구글SEO전문가", role: "블로거", status: "online", avatarColor: "bg-violet-500" },
    { name: "글쟁이이씨", role: "웹소설 작가", status: "online", avatarColor: "bg-indigo-500" },
    { name: "텍스트에디터", role: "카피라이터", status: "away", avatarColor: "bg-purple-500" },
  ],
  naver: [
    { name: "스마트블록분석기", role: "네이버 마케터", status: "online", avatarColor: "bg-emerald-500" },
    { name: "푸드블로거민", role: "맛집 인플루언서", status: "online", avatarColor: "bg-teal-500" },
    { name: "IT리뷰어한", role: "테크 블로거", status: "away", avatarColor: "bg-green-500" },
    { name: "로직마스터", role: "C-Rank 연구원", status: "online", avatarColor: "bg-emerald-600" },
  ],
  music: [
    { name: "비트메이커K", role: "작곡가", status: "online", avatarColor: "bg-rose-500" },
    { name: "Suno장인", role: "AI 뮤지션", status: "online", avatarColor: "bg-pink-500" },
    { name: "사운드디자이너", role: "엔지니어", status: "away", avatarColor: "bg-red-500" },
  ],
  image: [
    { name: "미드저니마스터", role: "AI 디자이너", status: "online", avatarColor: "bg-purple-500" },
    { name: "Flux매니아", role: "그래픽 아티스트", status: "online", avatarColor: "bg-fuchsia-500" },
    { name: "프롬프트빌더", role: "엔지니어", status: "online", avatarColor: "bg-pink-500" },
  ],
  video: [
    { name: "Kling스튜디오", role: "비디오 디렉터", status: "online", avatarColor: "bg-cyan-500" },
    { name: "모션그래픽스", role: "3D 아티스트", status: "online", avatarColor: "bg-blue-500" },
    { name: "숏폼러너", role: "틱톡커", status: "away", avatarColor: "bg-teal-500" },
  ],
  youtube: [
    { name: "쇼츠마스터", role: "유튜브 크리에이터", status: "online", avatarColor: "bg-red-500" },
    { name: "조회수폭발", role: "채널 분석가", status: "online", avatarColor: "bg-orange-500" },
    { name: "썸네일깎는노인", role: "디자이너", status: "away", avatarColor: "bg-red-600" },
    { name: "알고리즘수혜자", role: "유튜버", status: "online", avatarColor: "bg-amber-500" },
  ],
  "ai-trend": [
    { name: "테크에반젤리스트", role: "AI 연구원", status: "online", avatarColor: "bg-sky-500" },
    { name: "GPT파워유저", role: "프롬프트 엔지니어", status: "online", avatarColor: "bg-blue-500" },
    { name: "클로드의눈", role: "개발자", status: "away", avatarColor: "bg-indigo-500" },
  ],
  collab: [
    { name: "기획자최", role: "PM / 기획자", status: "online", avatarColor: "bg-amber-500" },
    { name: "영상팀장", role: "영상 크리에이터", status: "online", avatarColor: "bg-orange-500" },
    { name: "음악감독", role: "작곡가", status: "online", avatarColor: "bg-yellow-500" },
  ],
  money: [
    { name: "부업러101", role: "수익 다각화", status: "online", avatarColor: "bg-green-500" },
    { name: "애드센스마스터", role: "수익형 블로거", status: "online", avatarColor: "bg-emerald-500" },
    { name: "디지털노마드", role: "1인 지식창업", status: "away", avatarColor: "bg-teal-500" },
  ],
};

export const initialMessages: Record<string, Message[]> = {
  chat: [
    { id: "c1", sender: "창작마스터", avatarColor: "bg-blue-500", content: "안녕하세요! 다들 오늘 콘텐츠 작업은 잘 진행되시나요?", timestamp: "오후 2:10", isUser: false },
    { id: "c2", sender: "비주얼노벨", avatarColor: "bg-purple-500", content: "네, 저는 크리아이박스로 웹소설 시놉시스 뽑아보는 중인데 퀄리티 아주 만족스럽네요.", timestamp: "오후 2:12", isUser: false },
    { id: "c3", sender: "미디어아트", avatarColor: "bg-cyan-500", content: "오 대단하시네요. 다들 화이팅입니다!", timestamp: "오후 2:13", isUser: false },
  ],
  writing: [
    { id: "w1", sender: "구글SEO전문가", avatarColor: "bg-violet-500", content: "구글에서 백링크랑 내부 링크 구조 개선했더니 노출 지수가 확실히 올랐네요.", timestamp: "오후 1:45", isUser: false, badge: "SEO" },
    { id: "w2", sender: "글쟁이이씨", avatarColor: "bg-indigo-500", content: "크리아이박스 글쓰기 템플릿 사용해보셨나요? 문맥 매끄럽게 잘 다듬어줍니다.", timestamp: "오후 1:47", isUser: false },
    { id: "w3", sender: "텍스트에디터", avatarColor: "bg-purple-500", content: "아직 안 써봤는데 오늘 밤에 한번 테스트 해봐야겠네요. 정보 감사합니다!", timestamp: "오후 1:50", isUser: false },
  ],
  naver: [
    { id: "n1", sender: "스마트블록분석기", avatarColor: "bg-emerald-500", content: "네이버 뷰탭이 스마트블록으로 완전히 개편되면서 이제 에디터 3.0 구조가 더욱 중요해졌어요.", timestamp: "오후 2:00", isUser: false, badge: "네이버" },
    { id: "n2", sender: "푸드블로거민", avatarColor: "bg-teal-500", content: "맞아요, 텍스트만 꽉 채우기보다는 정보성 이미지랑 글의 배치가 핵심이더라구요.", timestamp: "오후 2:01", isUser: false },
    { id: "n3", sender: "로직마스터", avatarColor: "bg-emerald-600", content: "키워드를 제목에 3번 이상 중복해 쓰는 건 이제 어뷰징 필터 걸리니까 주의하셔야 합니다.", timestamp: "오후 2:03", isUser: false },
  ],
  music: [
    { id: "m1", sender: "Suno장인", avatarColor: "bg-pink-500", content: "Suno로 가요풍 발라드 만드실 때 메탈릭한 목소리 줄이는 팁 있으신가요?", timestamp: "오후 1:15", isUser: false, badge: "Suno" },
    { id: "m2", sender: "비트메이커K", avatarColor: "bg-rose-500", content: "스타일 입력창에 `acoustic guitar, raw vocal, slow tempo` 넣어서 생성하시면 튠이 덜 묻어 나옵니다.", timestamp: "오후 1:18", isUser: false },
    { id: "m3", sender: "Suno장인", avatarColor: "bg-pink-500", content: "오! 그렇게 하니까 확실히 내추럴하네요. 꿀팁 감사합니다!", timestamp: "오후 1:20", isUser: false },
  ],
  image: [
    { id: "i1", sender: "미드저니마스터", avatarColor: "bg-purple-500", content: "이번 Midjourney v6.1 디테일 표현 대단하지 않나요? 솜털이나 유리 반사광이 엄청납니다.", timestamp: "오전 11:30", isUser: false, badge: "Midjourney" },
    { id: "i2", sender: "Flux매니아", avatarColor: "bg-fuchsia-500", content: "Flux도 텍스트 렌더링 면에서는 엄청나요. 영문 텍스트가 정확하게 나옵니다.", timestamp: "오전 11:32", isUser: false },
    { id: "i3", sender: "프롬프트빌더", avatarColor: "bg-pink-500", content: "크리아이박스 이미지 스튜디오에서 프롬프트 고도화해서 입력하면 두 툴 다 훨씬 잘 나와요.", timestamp: "오전 11:35", isUser: false },
  ],
  video: [
    { id: "v1", sender: "Kling스튜디오", avatarColor: "bg-cyan-500", content: "Kling으로 5초짜리 시네마틱 숏츠 씬을 뽑고 있는데 카메라 무빙이 아주 자연스럽네요.", timestamp: "오후 12:05", isUser: false, badge: "Kling" },
    { id: "v2", sender: "모션그래픽스", avatarColor: "bg-blue-500", content: "프롬프트 뒤에 `cinematic panning, 8k resolution, Unreal Engine 5 render` 넣는 거 필수입니다.", timestamp: "오후 12:08", isUser: false },
    { id: "v3", sender: "숏폼러너", avatarColor: "bg-teal-500", content: "유튜브 쇼츠 템플릿용으로 몇 초짜리 씬이 제일 반응 좋나요?", timestamp: "오후 12:10", isUser: false },
  ],
  youtube: [
    { id: "y1", sender: "쇼츠마스터", avatarColor: "bg-red-500", content: "쇼츠 알고리즘 요새 1-2초 루프(Loop) 연출 안하면 조회수가 금방 꺾이네요.", timestamp: "오후 2:00", isUser: false, badge: "쇼츠" },
    { id: "y2", sender: "조회수폭발", avatarColor: "bg-orange-500", content: "시청 지속시간 80% 미만은 아예 피드 노출을 중단하는 느낌이에요. 썸네일도 중요하구요.", timestamp: "오후 2:02", isUser: false },
    { id: "y3", sender: "알고리즘수혜자", avatarColor: "bg-amber-500", content: "크리아이박스 유튜브 썸네일 다운로더로 타 채널 인기 분석해서 벤치마킹하는 거 추천드립니다.", timestamp: "오후 2:04", isUser: false },
  ],
  "ai-trend": [
    { id: "a1", sender: "테크에반젤리스트", avatarColor: "bg-sky-500", content: "이번 OpenAI 신규 모델 벤치마크 보니까 멀티모달 추론 능력이 극대화되었더군요.", timestamp: "오후 1:10", isUser: false, badge: "OpenAI" },
    { id: "a2", sender: "GPT파워유저", avatarColor: "bg-blue-500", content: "Claude 3.5 Sonnet도 코딩이랑 글쓰기 분야에서는 여전히 최고 존엄인 것 같아요.", timestamp: "오후 1:12", isUser: false },
    { id: "a3", sender: "클로드의눈", avatarColor: "bg-indigo-500", content: "국산 AI 모델들도 점점 속도랑 최적화 면에서 메리트가 있어 보입니다.", timestamp: "오후 1:15", isUser: false },
  ],
  collab: [
    { id: "co1", sender: "기획자최", avatarColor: "bg-amber-500", content: "안녕하세요! 지식창업 AI 숏폼 자동화 프로젝트 같이 하실 영상 크리에이터 분 계신가요?", timestamp: "오후 2:10", isUser: false, badge: "모집중" },
    { id: "co2", sender: "영상팀장", avatarColor: "bg-orange-500", content: "어떤 채널 컨셉인가요? 제가 AI 숏폼 영상 제작 및 렌더링 파트는 전문입니다.", timestamp: "오후 2:12", isUser: false },
    { id: "co3", sender: "음악감독", avatarColor: "bg-yellow-500", content: "음원이나 오디오 효과음 믹싱 필요하시면 저도 발라드/Lo-Fi 위주로 참여하고 싶습니다.", timestamp: "오후 2:15", isUser: false },
  ],
  money: [
    { id: "mo1", sender: "애드센스마스터", avatarColor: "bg-emerald-500", content: "워드프레스로 자동 포스팅 사이트 돌리시는 분들 요새 샌드박스 현상 괜찮으신가요?", timestamp: "오후 1:30", isUser: false, badge: "애드센스" },
    { id: "mo2", sender: "부업러101", avatarColor: "bg-green-500", content: "구글 트래픽만 믿으면 위험해요. 핀터레스트나 네이버 외부 유입 믹스하는 게 생존 공식입니다.", timestamp: "오후 1:33", isUser: false },
    { id: "mo3", sender: "디지털노마드", avatarColor: "bg-teal-500", content: "저도 전자책 크리아이박스로 완성해서 크몽 올렸는데 첫 주에 30만 원 들어왔습니다!", timestamp: "오후 1:35", isUser: false },
  ],
};

export const botReplies: Record<string, string[]> = {
  chat: [
    "반갑습니다! 저도 크리아이박스로 1인 미디어 채널 확장하고 있는데 정보 공유 많이 해봐요.",
    "혹시 작업하시는 프로젝트 있으시면 공유해주세요! 피드백 해드리겠습니다.",
    "요즘 콘텐츠 포화 상태라 기획력이 전부인 것 같습니다. 템플릿 많이 활용해보세요!",
  ],
  writing: [
    "구글 서치콘솔 색인 생성 오류는 보통 사이트맵 재제출하고 2-3일 지나면 해결되는 편입니다.",
    "크리아이박스 SEO 글쓰기 툴에서 나온 가이드를 기본으로 채워 넣으면 노출 지수가 팍팍 오릅니다.",
    "애드센스 승인은 전문 분야 하나만 잡고 1,500자 이상 포스팅 15개 정도 꾸준히 발행하는 게 베스트예요.",
  ],
  naver: [
    "스마트블록 노출에는 사진 메타데이터 지우지 마시고 그대로 넣는 게 출처 신뢰도 면에서 유리해요.",
    "인플루언서 탭 노출되려면 메인 키워드를 초반 텍스트 20% 이내에 2번 이상 배치하는 걸 권장합니다.",
    "글 올리실 때 공감/댓글 반응도 첫 1시간 반응도가 랭킹 유지에 큰 영향을 줍니다.",
  ],
  music: [
    "Suno에서 드럼 루프 뽑아서 DAW(큐베이스, 로직 등)에서 믹싱하시면 음장감이랑 베이스가 엄청 꽉 찹니다.",
    "보컬 가사에서 한글과 영어를 섞어서 비트를 유도하면 특이한 싱코페이션(당김음)이 생겨 매력적이에요.",
    "뮤직 스튜디오에 수록할 앨범 자켓 이미지는 크리아이박스 이미지 툴로 뽑는 걸 추천드려요!",
  ],
  image: [
    "미드저니에서 `--ar 16:9 --style raw` 옵션 주면 영화 스틸컷 느낌 제대로 살려줍니다.",
    "Flux 프롬프트 작성 시에는 AI한테 장면 묘사를 자세히 해달라고 주문하는 문법이 더 효과적이에요.",
    "크리아이박스 이미지 스튜디오에서 원하는 무드만 선택하면 알맞은 프롬프트 코드가 자동 완성됩니다.",
  ],
  video: [
    "Kling으로 인물 움직임 만들 때 눈깜빡임이나 입모양 싱크 맞추려면 프롬프트에 `high detailed facial micro-expressions`를 넣어보세요.",
    "비디오 제작은 역시 스토리보드 기획이 80%입니다. 기획 꼼꼼히 하시고 들어가는 게 시간 절약돼요.",
    "쇼츠용 숏폼 영상은 처음 1.5초 이내에 극적인 화면 연출을 넣어야 끝탈 없이 끝까지 시청합니다.",
  ],
  youtube: [
    "유튜브 썸네일은 보색 대비(예: 검정 배경에 노란 텍스트)를 사용하고 글자는 6글자 이내가 모바일 가독성에 제일 좋습니다.",
    "유튜브 쇼츠 조회수 떡상은 보통 시청 시간 120% 이상, 좋아요 클릭률 4% 이상에서 시작됩니다.",
    "키워드 분석 시 유튜브 자동완성 검색어를 긁어와서 태그와 설명란에 녹여내면 알고리즘 타기 쉬워져요.",
  ],
  "ai-trend": [
    "최근 AI 트렌드는 온디바이스(On-device) 경량화와 에이전트 자동화 플랫폼이 이끄는 추세 같습니다.",
    "Claude API 사용 시 프롬프트 캐싱 기능 쓰면 비용을 최대 90%까지 아낄 수 있으니 꼭 참고하세요.",
    "멀티모달 모델들의 프레임 분석 정밀도가 높아져서 조만간 AI 자율 운전이나 로봇 제어가 확 풀릴 것 같네요.",
  ],
  collab: [
    "팀 작업하실 때 슬랙이나 피그마 링크 공유해주시면 함께 들어갈 수 있는 크리에이터 분들 컨택하기 좋습니다.",
    "저는 기획서 작성 및 파트너 매칭 도와드릴 수 있으니 원하시는 프로젝트 정보 알려주세요!",
    "요즘 유튜버랑 AI 디자이너 콜라보 채널들이 트래픽을 아주 잘 모으고 있더군요.",
  ],
  money: [
    "수익형 블로그는 초반 3개월 동안 트래픽이 없어도 하루 1포스팅씩 묵묵히 쌓는 근성이 필수입니다.",
    "유튜브 수익창출 조건이 달성 안 되었다면 공동구매 공동마케팅 링크(제휴마케팅)를 더보기란에 두는 부업도 좋습니다.",
    "수익화 연구소 멤버들 중 AI 전자책 출판으로 월 100만 원 이상 패시브 인컴 만드신 분도 계십니다.",
  ],
};
