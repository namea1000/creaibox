/**
 * 비주얼 페이지 에디터 블록 템플릿 상수
 * 사용자가 페이지에 새로 추가할 수 있는 섹션 블록들의 HTML 스니펫 모음
 */

export interface PageEditorBlock {
  id: string;
  label: string;
  icon: string;
  category: "layout" | "content" | "media" | "form" | "cta";
  defaultHtml: string;
}

export const PAGE_EDITOR_BLOCKS: PageEditorBlock[] = [
  // ─────── LAYOUT ───────
  {
    id: "hero_banner",
    label: "히어로 배너",
    icon: "🎯",
    category: "layout",
    defaultHtml: `<section class="relative py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center overflow-hidden">
  <div class="max-w-4xl mx-auto relative z-10">
    <p class="text-sm font-bold text-[var(--primary)] mb-4 tracking-widest uppercase">서비스 소개</p>
    <h1 class="text-4xl md:text-5xl font-black leading-tight mb-6">
      여기에 강력한<br/>메인 제목을 입력하세요
    </h1>
    <p class="text-lg text-slate-300 font-semibold max-w-2xl mx-auto leading-relaxed mb-10">
      고객의 문제를 해결하는 핵심 가치를 한 문장으로 요약하세요. 방문자의 관심을 즉시 사로잡는 메시지가 중요합니다.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/contact" class="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-slate-950 bg-[var(--primary)] hover:brightness-110 rounded-2xl shadow-xl transition-all active:scale-95">
        무료 상담 신청하기 →
      </a>
      <a href="/about" class="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white border-2 border-white/20 hover:border-white/50 rounded-2xl transition-all">
        자세히 알아보기
      </a>
    </div>
  </div>
</section>`,
  },
  {
    id: "two_column",
    label: "2열 텍스트",
    icon: "📰",
    category: "layout",
    defaultHtml: `<section class="py-20 px-6 bg-white">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest">우리의 강점</p>
      <h2 class="text-3xl font-black text-slate-900 leading-tight">
        왜 우리를 선택해야 할까요?
      </h2>
      <p class="text-base text-slate-600 leading-relaxed font-semibold">
        오랜 경험과 전문성을 바탕으로 고객 여러분께 최고의 서비스를 제공합니다. 믿을 수 있는 파트너가 되겠습니다.
      </p>
      <ul class="space-y-3">
        <li class="flex items-start gap-3 text-sm font-semibold text-slate-700">
          <span class="text-[var(--primary)] text-lg mt-0.5">✓</span>
          <span>풍부한 경험과 전문 지식 보유</span>
        </li>
        <li class="flex items-start gap-3 text-sm font-semibold text-slate-700">
          <span class="text-[var(--primary)] text-lg mt-0.5">✓</span>
          <span>고객 맞춤형 1:1 전담 서비스</span>
        </li>
        <li class="flex items-start gap-3 text-sm font-semibold text-slate-700">
          <span class="text-[var(--primary)] text-lg mt-0.5">✓</span>
          <span>합리적인 가격과 투명한 비용 정책</span>
        </li>
      </ul>
    </div>
    <div class="rounded-3xl overflow-hidden shadow-2xl bg-slate-100 aspect-[4/3] flex items-center justify-center">
      <span class="text-slate-400 text-sm font-bold">이미지 영역 (클릭하여 교체)</span>
    </div>
  </div>
</section>`,
  },

  // ─────── CONTENT ───────
  {
    id: "cards_grid",
    label: "카드 그리드",
    icon: "🃏",
    category: "content",
    defaultHtml: `<section class="py-20 px-6 bg-slate-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">서비스</p>
      <h2 class="text-3xl font-black text-slate-900">제공 서비스 안내</h2>
      <p class="mt-4 text-sm text-slate-500 font-semibold max-w-xl mx-auto">고객의 성공을 위해 최선을 다하는 핵심 서비스들을 소개합니다.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100">
        <div class="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl mb-6">⭐</div>
        <h3 class="text-lg font-black text-slate-900 mb-3">서비스 제목 1</h3>
        <p class="text-sm text-slate-500 font-semibold leading-relaxed">서비스에 대한 간결하고 매력적인 설명을 여기에 작성하세요. 고객이 얻을 수 있는 핵심 혜택을 강조하세요.</p>
      </div>
      <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100">
        <div class="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl mb-6">🚀</div>
        <h3 class="text-lg font-black text-slate-900 mb-3">서비스 제목 2</h3>
        <p class="text-sm text-slate-500 font-semibold leading-relaxed">서비스에 대한 간결하고 매력적인 설명을 여기에 작성하세요. 고객이 얻을 수 있는 핵심 혜택을 강조하세요.</p>
      </div>
      <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100">
        <div class="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl mb-6">💎</div>
        <h3 class="text-lg font-black text-slate-900 mb-3">서비스 제목 3</h3>
        <p class="text-sm text-slate-500 font-semibold leading-relaxed">서비스에 대한 간결하고 매력적인 설명을 여기에 작성하세요. 고객이 얻을 수 있는 핵심 혜택을 강조하세요.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "stats_counter",
    label: "통계 카운터",
    icon: "📊",
    category: "content",
    defaultHtml: `<section class="py-16 px-6 bg-[var(--primary)]">
  <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div class="space-y-2">
      <p class="text-4xl font-black text-white">1,200+</p>
      <p class="text-sm font-bold text-white/70">누적 고객사</p>
    </div>
    <div class="space-y-2">
      <p class="text-4xl font-black text-white">15년</p>
      <p class="text-sm font-bold text-white/70">업계 경력</p>
    </div>
    <div class="space-y-2">
      <p class="text-4xl font-black text-white">98%</p>
      <p class="text-sm font-bold text-white/70">고객 만족도</p>
    </div>
    <div class="space-y-2">
      <p class="text-4xl font-black text-white">24/7</p>
      <p class="text-sm font-bold text-white/70">고객 지원</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "faq",
    label: "자주 묻는 질문 (FAQ)",
    icon: "❓",
    category: "content",
    defaultHtml: `<section class="py-20 px-6 bg-white">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">FAQ</p>
      <h2 class="text-3xl font-black text-slate-900">자주 묻는 질문</h2>
    </div>
    <div class="space-y-4">
      <details class="group bg-slate-50 rounded-2xl p-6 cursor-pointer">
        <summary class="font-black text-slate-900 flex justify-between items-center list-none">
          <span>Q. 첫 번째 자주 묻는 질문을 여기에 작성하세요.</span>
          <span class="text-[var(--primary)] group-open:rotate-45 transition-transform text-xl">+</span>
        </summary>
        <p class="mt-4 text-sm text-slate-600 font-semibold leading-relaxed">
          답변 내용을 여기에 작성하세요. 고객이 궁금해할 내용에 대해 명확하고 친절하게 설명해 주세요.
        </p>
      </details>
      <details class="group bg-slate-50 rounded-2xl p-6 cursor-pointer">
        <summary class="font-black text-slate-900 flex justify-between items-center list-none">
          <span>Q. 두 번째 자주 묻는 질문을 여기에 작성하세요.</span>
          <span class="text-[var(--primary)] group-open:rotate-45 transition-transform text-xl">+</span>
        </summary>
        <p class="mt-4 text-sm text-slate-600 font-semibold leading-relaxed">
          답변 내용을 여기에 작성하세요. 고객이 궁금해할 내용에 대해 명확하고 친절하게 설명해 주세요.
        </p>
      </details>
      <details class="group bg-slate-50 rounded-2xl p-6 cursor-pointer">
        <summary class="font-black text-slate-900 flex justify-between items-center list-none">
          <span>Q. 세 번째 자주 묻는 질문을 여기에 작성하세요.</span>
          <span class="text-[var(--primary)] group-open:rotate-45 transition-transform text-xl">+</span>
        </summary>
        <p class="mt-4 text-sm text-slate-600 font-semibond leading-relaxed">
          답변 내용을 여기에 작성하세요. 고객이 궁금해할 내용에 대해 명확하고 친절하게 설명해 주세요.
        </p>
      </details>
    </div>
  </div>
</section>`,
  },
  {
    id: "team_grid",
    label: "팀 소개",
    icon: "👥",
    category: "content",
    defaultHtml: `<section class="py-20 px-6 bg-slate-50">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">OUR TEAM</p>
      <h2 class="text-3xl font-black text-slate-900">전문가 팀을 소개합니다</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
        <div class="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
        <h3 class="font-black text-slate-900">홍길동</h3>
        <p class="text-xs font-bold text-[var(--primary)] mt-1">대표이사 / CEO</p>
        <p class="text-xs text-slate-500 font-semibold mt-3 leading-relaxed">전문 분야 및 경력 소개를 간략하게 작성하세요.</p>
      </div>
      <div class="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
        <div class="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
        <h3 class="font-black text-slate-900">김전문</h3>
        <p class="text-xs font-bold text-[var(--primary)] mt-1">기술 이사 / CTO</p>
        <p class="text-xs text-slate-500 font-semibold mt-3 leading-relaxed">전문 분야 및 경력 소개를 간략하게 작성하세요.</p>
      </div>
      <div class="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100">
        <div class="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
        <h3 class="font-black text-slate-900">이매니저</h3>
        <p class="text-xs font-bold text-[var(--primary)] mt-1">마케팅 팀장</p>
        <p class="text-xs text-slate-500 font-semibold mt-3 leading-relaxed">전문 분야 및 경력 소개를 간략하게 작성하세요.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "timeline",
    label: "타임라인 (연혁)",
    icon: "📅",
    category: "content",
    defaultHtml: `<section class="py-20 px-6 bg-white">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">HISTORY</p>
      <h2 class="text-3xl font-black text-slate-900">회사 연혁</h2>
    </div>
    <div class="relative pl-8 border-l-2 border-[var(--primary)]/30 space-y-10">
      <div class="relative">
        <div class="absolute -left-10 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-white shadow"></div>
        <p class="text-xs font-black text-[var(--primary)] mb-1">2024년</p>
        <h3 class="text-base font-black text-slate-900">주요 마일스톤 제목</h3>
        <p class="text-sm text-slate-500 font-semibold mt-1 leading-relaxed">해당 연도의 주요 사건 및 성과를 간략히 작성하세요.</p>
      </div>
      <div class="relative">
        <div class="absolute -left-10 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-white shadow"></div>
        <p class="text-xs font-black text-[var(--primary)] mb-1">2022년</p>
        <h3 class="text-base font-black text-slate-900">주요 마일스톤 제목</h3>
        <p class="text-sm text-slate-500 font-semibold mt-1 leading-relaxed">해당 연도의 주요 사건 및 성과를 간략히 작성하세요.</p>
      </div>
      <div class="relative">
        <div class="absolute -left-10 w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow"></div>
        <p class="text-xs font-black text-slate-400 mb-1">2020년</p>
        <h3 class="text-base font-black text-slate-900">창립</h3>
        <p class="text-sm text-slate-500 font-semibold mt-1 leading-relaxed">회사 창립 및 초기 성장 스토리를 작성하세요.</p>
      </div>
    </div>
  </div>
</section>`,
  },

  // ─────── MEDIA ───────
  {
    id: "image_full",
    label: "전체 이미지 섹션",
    icon: "🖼️",
    category: "media",
    defaultHtml: `<section class="py-20 px-6 bg-slate-50">
  <div class="max-w-5xl mx-auto">
    <div class="rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-[16/7] flex items-center justify-center">
      <div class="text-center space-y-2">
        <p class="text-slate-400 text-4xl">🖼️</p>
        <p class="text-slate-400 text-sm font-bold">이미지 영역 (클릭하여 교체)</p>
      </div>
    </div>
    <p class="text-center text-xs text-slate-400 font-semibold mt-4">이미지 캡션을 여기에 입력하세요</p>
  </div>
</section>`,
  },
  {
    id: "gallery_grid",
    label: "갤러리 그리드",
    icon: "📸",
    category: "media",
    defaultHtml: `<section class="py-20 px-6 bg-white">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-black text-slate-900">포트폴리오 / 갤러리</h2>
      <p class="mt-3 text-sm text-slate-500 font-semibold">작업 사례 및 활동 사진을 소개합니다.</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
      <div class="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-2xl hover:opacity-80 transition-opacity cursor-pointer">📸</div>
    </div>
  </div>
</section>`,
  },

  // ─────── CTA ───────
  {
    id: "cta_banner",
    label: "CTA 배너",
    icon: "📣",
    category: "cta",
    defaultHtml: `<section class="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-center">
  <div class="max-w-3xl mx-auto space-y-6">
    <h2 class="text-3xl font-black">지금 바로 시작하세요</h2>
    <p class="text-base text-slate-300 font-semibold leading-relaxed">
      더 이상 망설이지 마세요. 전문가 팀이 여러분의 성공을 위해 함께합니다.
    </p>
    <a href="/contact" class="inline-flex items-center justify-center px-10 py-4 text-sm font-black text-slate-950 bg-[var(--primary)] hover:brightness-110 rounded-2xl shadow-xl transition-all active:scale-95">
      무료 상담 신청하기 →
    </a>
  </div>
</section>`,
  },
  {
    id: "pricing_table",
    label: "가격표",
    icon: "💰",
    category: "cta",
    defaultHtml: `<section class="py-20 px-6 bg-slate-50">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">PRICING</p>
      <h2 class="text-3xl font-black text-slate-900">투명한 요금제</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <p class="text-xs font-black text-slate-500 uppercase mb-4">Basic</p>
        <p class="text-4xl font-black text-slate-900">₩99,000<span class="text-sm font-bold text-slate-400">/월</span></p>
        <ul class="mt-6 space-y-3 text-sm font-semibold text-slate-600">
          <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> 기능 항목 1</li>
          <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> 기능 항목 2</li>
          <li class="flex items-center gap-2 text-slate-300"><span>✗</span> 기능 항목 3</li>
        </ul>
        <a href="/contact" class="mt-8 block text-center py-3 text-sm font-black text-[var(--primary)] border-2 border-[var(--primary)] rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all">시작하기</a>
      </div>
      <div class="bg-[var(--primary)] rounded-3xl p-8 shadow-xl transform scale-105">
        <p class="text-xs font-black text-white/70 uppercase mb-4">Pro ⭐ 인기</p>
        <p class="text-4xl font-black text-white">₩199,000<span class="text-sm font-bold text-white/70">/월</span></p>
        <ul class="mt-6 space-y-3 text-sm font-semibold text-white">
          <li class="flex items-center gap-2"><span>✓</span> 기능 항목 1</li>
          <li class="flex items-center gap-2"><span>✓</span> 기능 항목 2</li>
          <li class="flex items-center gap-2"><span>✓</span> 기능 항목 3</li>
        </ul>
        <a href="/contact" class="mt-8 block text-center py-3 text-sm font-black text-[var(--primary)] bg-white rounded-2xl hover:bg-white/90 transition-all">시작하기</a>
      </div>
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <p class="text-xs font-black text-slate-500 uppercase mb-4">Enterprise</p>
        <p class="text-4xl font-black text-slate-900">문의<span class="text-sm font-bold text-slate-400"></span></p>
        <ul class="mt-6 space-y-3 text-sm font-semibold text-slate-600">
          <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> 기능 항목 1</li>
          <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> 기능 항목 2</li>
          <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> 기능 항목 3</li>
        </ul>
        <a href="/contact" class="mt-8 block text-center py-3 text-sm font-black text-[var(--primary)] border-2 border-[var(--primary)] rounded-2xl hover:bg-[var(--primary)] hover:text-white transition-all">문의하기</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonials",
    label: "고객 후기",
    icon: "💬",
    category: "content",
    defaultHtml: `<section class="py-20 px-6 bg-white">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-14">
      <p class="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-3">TESTIMONIALS</p>
      <h2 class="text-3xl font-black text-slate-900">고객 후기</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <p class="text-[var(--primary)] text-2xl mb-4">★★★★★</p>
        <p class="text-sm text-slate-600 font-semibold leading-relaxed italic">"정말 만족스러운 서비스였습니다. 전문성과 친절함이 인상적이었고 결과도 탁월했습니다."</p>
        <div class="mt-6 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-black">김</div>
          <div>
            <p class="text-xs font-black text-slate-900">김고객 님</p>
            <p class="text-[10px] text-slate-400 font-bold">서울 / 2024.03</p>
          </div>
        </div>
      </div>
      <div class="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <p class="text-[var(--primary)] text-2xl mb-4">★★★★★</p>
        <p class="text-sm text-slate-600 font-semibold leading-relaxed italic">"기대 이상의 결과를 얻었습니다. 빠른 응답과 섬세한 서비스에 감동받았습니다."</p>
        <div class="mt-6 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-black">이</div>
          <div>
            <p class="text-xs font-black text-slate-900">이고객 님</p>
            <p class="text-[10px] text-slate-400 font-bold">부산 / 2024.06</p>
          </div>
        </div>
      </div>
      <div class="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <p class="text-[var(--primary)] text-2xl mb-4">★★★★★</p>
        <p class="text-sm text-slate-600 font-semibold leading-relaxed italic">"주변에 적극 추천하고 있습니다. 전문적인 조언과 꼼꼼한 사후 관리가 인상적입니다."</p>
        <div class="mt-6 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-black">박</div>
          <div>
            <p class="text-xs font-black text-slate-900">박고객 님</p>
            <p class="text-[10px] text-slate-400 font-bold">대구 / 2024.09</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
];

export const BLOCK_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "layout", label: "레이아웃" },
  { id: "content", label: "콘텐츠" },
  { id: "media", label: "미디어" },
  { id: "cta", label: "CTA" },
] as const;
