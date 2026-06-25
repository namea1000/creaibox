import { AcademyBranch, CurriculumItem, AchievementItem } from "./types";

export const COMPANY_INFO = {
  name: "어그나무학원",
  phone: "041-577-7022",
  address: "충청남도 천안시 서북구 불당25로 152, 디엠타워 8층",
  bandUrl: "https://www.band.us/@ugnamumath",
  slogan: "생각의 뿌리를 깊게, 수학·과학의 나무를 곧게 세우다",
  ceo: "이정범",
  greetings: `안녕하십니까? 어그나무학원을 믿고 찾아주시는 학부모님과 학생 여러분께 깊은 감사를 드립니다.\n\n저희 어그나무학원은 천안 불당 지역에서 수학 및 과학 명문으로 굳건히 자리매김해 왔습니다. 단순한 공식 암기식 수업이 아닌, 스스로 생각하여 원리와 개념의 본질을 꿰뚫는 ‘생각의 뿌리’ 교육을 실천합니다.\n\n어그나무일반관(수/과/국/영), 어그나무영재관(입시대비), 어그나무고등관(내신/수능)의 유기적인 3개 관 시스템을 통해 학생들의 연령과 학업 수준에 완벽히 밀착된 빈틈없는 지도를 약속드립니다. 우리 아이들이 꿈꾸는 명문고, 명문대, 영재교 합격을 위해 최고의 강사진과 체계적인 커리큘럼으로 끝까지 함께 달리겠습니다.`,
};

export const ACADEMY_BRANCHES: AcademyBranch[] = [
  {
    id: "general-branch",
    name: "어그나무일반관 (초/중등부)",
    licenseNumber: "제3298호",
    description: "초등(3학년 이상) 및 중등부 대상 수학, 과학, 국어, 영어 전 영역의 균형 있는 기초 확립과 내신 최상위권 도약반 운영",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "gifted-branch",
    name: "어그나무영재관 (입시관)",
    licenseNumber: "제4428호",
    description: "영재학교, 과학고, 자사고 및 특목고 진학을 목표로 하는 초/중등 상위권 대상의 창의 사고력 심화 수학 및 탐구 과학 집중 코스",
    imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "high-branch",
    name: "어그나무고등관 (수능/내신관)",
    licenseNumber: "제4660호",
    description: "고등부 전 학년 내신 1등급 확보 및 대학수학능력시험 만점 목표의 수학·과학 영역별 정밀 추적 피드백 프로그램 제공",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
  },
];

export const CURRICULUM_ITEMS: CurriculumItem[] = [
  {
    id: "elem-gifted",
    title: "초등 수학/과학 영재반",
    target: "초3 ~ 초6 상위권 학생",
    description: "올바른 서술 해결력과 창의적 두뇌 개발을 돕는 심화 사고력 교실입니다.",
    details: [
      "창의적 문제를 통한 수학적 추론 능력 강화",
      "실험 위주의 물리, 화학, 생명과학, 지구과학 탐구 교실",
      "수학/과학 올림피아드 및 경시대회 준비 기본기 완성",
      "주간 단위 서술형 개별 오답 분석 노트 제공",
    ],
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mid-intensive",
    title: "중등 수학/과학 심화 내신반",
    target: "중1 ~ 중3 재학생",
    description: "학교 내신 완벽 만점 대비와 고등 선행 수학/과학을 매끄럽게 연결합니다.",
    details: [
      "천안 지역 중학교 기출 완전 정밀 분석 및 실전 모의고사 시행",
      "서술형 수행평가를 대비한 1:1 대면 첨삭 지도",
      "수학 상/하 및 물리/화학Ⅰ 선행 심화 과정 매핑",
      "매주 백지 테스트를 통한 취약 개념 메꿈 피드백",
    ],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "special-exam",
    title: "영재교 & 과학고 입시반",
    target: "영재교/과학고 진학 희망 중등부",
    description: "특목고 합격 신화를 만든 어그나무만의 입시 솔루션을 전수합니다.",
    details: [
      "경기과고, 서울과고, 대전과고 등 영재학교 지필평가 대비 기출 풀이",
      "충남과고 수의계약 및 소집면접 대비 실전 면접 시뮬레이션",
      "자기소개서 작성 가이드 및 독창적인 탐구 보고서 피드백",
      "소수 정예 배치 및 입시 전문 원장 직강반 운영",
    ],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "high-perfect",
    title: "고등 내신 & 수능 1등급반",
    target: "고1 ~ 고3 재학생",
    description: "대입 성패를 결정하는 수학·과학 킬러 문항 정복에 집중합니다.",
    details: [
      "고등 내신 상위 4% 이내 진입을 위한 불당 지역 고교 밀착 대비",
      "평가원 및 수능 수학 공통/선택 과목 최신 트렌드 기출 분석",
      "물리/화학/생명과학 수능 등급 극대화를 위한 실전 팁 전수",
      "1:1 입시 컨설팅 및 대학 정시/수시 최적 지원 전략 상담",
    ],
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
  },
];

export const ACHIEVEMENT_ITEMS: AchievementItem[] = [
  {
    id: "ach-1",
    studentName: "김O우",
    targetSchool: "한국과학영재학교",
    year: "2026",
    status: "합격",
    category: "영재교/과고",
  },
  {
    id: "ach-2",
    studentName: "이O민",
    targetSchool: "충남과학고등학교",
    year: "2026",
    status: "합격",
    category: "영재교/과고",
  },
  {
    id: "ach-3",
    studentName: "박O준",
    targetSchool: "서울과학고등학교",
    year: "2025",
    status: "합격",
    category: "영재교/과고",
  },
  {
    id: "ach-4",
    studentName: "최O서",
    targetSchool: "상산고등학교",
    year: "2025",
    status: "합격",
    category: "특목/자사고",
  },
  {
    id: "ach-5",
    studentName: "정O영",
    targetSchool: "서울대학교 자연과학부",
    year: "2026",
    status: "합격",
    category: "대입",
  },
  {
    id: "ach-6",
    studentName: "한O재",
    targetSchool: "카이스트 (KAIST)",
    year: "2026",
    status: "합격",
    category: "대입",
  },
  {
    id: "ach-7",
    studentName: "윤O하",
    targetSchool: "포항공과대학교 (POSTECH)",
    year: "2025",
    status: "합격",
    category: "대입",
  },
  {
    id: "ach-8",
    studentName: "송O우",
    targetSchool: "연세대학교 신소재공학과",
    year: "2026",
    status: "합격",
    category: "대입",
  },
];
