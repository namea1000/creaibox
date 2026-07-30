"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowLeft,
  PenTool,
  Calendar,
  User,
  Tag,
  Search,
  Eye,
  Plus,
  X,
  Send,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  views: number;
  readTime: string;
  coverImage: string;
  tags: string[];
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "천안 불당동 비상주 오피스 당일 사업자등록 절차 및 수수료 절감 가이드",
    category: "비상주 오피스",
    excerpt: "집 주소 노출 없이 불당동 신뢰성 높은 사업자 주소지가 필요한 1인 기업, 쇼핑몰, 프리랜서를 위한 당일 임대차계약 및 우편물 관리 시스템 완벽 정리.",
    content: `
### 🏢 왜 천안 불당동 비상주 오피스를 선택해야 할까요?

전자상거래, 스마트스토어, 1인 사업자 및 프리랜서 창업 시 **개인 집 주소를 사업자등록 주소지로 등록하면 개인정보 유출** 및 브랜드 신뢰도 하락의 원인이 됩니다.

헬로우워크 천안불당점은 충남 천안시 서북구 불당동의 **핵심 상권(정우프라자 7층) 정식 주소지**를 제공하여 사업자의 신뢰도를 최상으로 높여드립니다.

---

#### 📌 헬로우워크 비상주 오피스의 4대 핵심 혜택

1. **신속 당일 전자 계약**: 방문 없이도 온라인/전자서명으로 10분 만에 임대차계약서 수령 가능.
2. **실시간 우편물/등기 알림**: 수신된 관공서/세무서 우편물을 고화질 스캔하여 SMS 및 알림 전송.
3. **실태조사 미팅룸 지원**: 세무서나 금융기관의 현장 실태조사 시 깔끔한 회의실 공간 지원.
4. **장기 계약 시 파격 할인**: 6개월, 1년 이상 계약 시 매월 파격 할인가 적용.

---

#### 📞 비상주 오피스 당일 상담 문의
- **전화 문의**: 010-8695-5132 (24시간 친절 상담)
- **위치**: 충남 천안시 서북구 불당23로 70 (정우프라자 7층 701~702호)
    `,
    date: "2026-07-29",
    author: "헬로우워크 매니저",
    views: 342,
    readTime: "3분",
    coverImage: "/images/clients/hellowork_hero.png",
    tags: ["비상주오피스", "천안사업자등록", "불당동소호사무실", "1인창업"]
  },
  {
    id: "post-2",
    title: "왜 100% 성인 전용인가? 소음 0% 몰입 스터디카페 & 공유오피스 이용 후기",
    category: "공유오피스",
    excerpt: "중고등학생 출입 제로! 공시생, 전문 자격증 시험 수험생, 직장인, 프리랜서가 극찬한 차분하고 조용한 성인 전용 몰입 환경의 비밀.",
    content: `
### 🤫 소음과 산만함이 없는 100% 성인 전용 스페이스

일반 스터디카페나 도서관에서 중고등학생들의 소음, 잡담, 번잡함 때문에 공부나 업무 흐름이 깨진 경험이 있으신가요?

**헬로우워크 천안불당점**은 100% 성인 전용으로 운영되어 잡담 소음이 0%에 가깝습니다.

---

#### ✨ 성인 회원분들이 극찬한 헬로우워크 이용 포인트

- **완벽한 소음 통제**: 시험 준비생과 전문직 회원들로 구성되어 사소한 타자 소음까지 신경 쓴 차분한 분위기.
- **데스커 & 시디즈 전 좌석 세팅**: 하루 10시간 이상 공부하거나 코딩을 해도 허리와 목이 아프지 않은 명품 가구 세팅.
- **고급 원두커피 무제한 라운지**: 고급 에스프레소 머신으로 뽑아내는 아메리카노와 다양한 건강 티 무료 제공.
    `,
    date: "2026-07-25",
    author: "헬로우워크 매니저",
    views: 518,
    readTime: "4분",
    coverImage: "/images/clients/hellowork_private.png",
    tags: ["성인스터디카페", "천안공유오피스", "공시생합격", "시디즈의자"]
  },
  {
    id: "post-3",
    title: "시디즈 의자와 데스커 워크데스크로 완성한 1인 독립 소호 오피스 시설 안내",
    category: "시설 안내",
    excerpt: "독립된 1인실 공간에서 방해 없이 업무에 집중하세요. 개별 도어락, 개인 난방/냉방 제어, 24시간 보안 출입 시스템 안내.",
    content: `
### 🛋️ 명품 가구와 첨단 시설의 조화

성공적인 프라이빗 업무를 위해 가구와 환경은 무엇보다 중요합니다.

헬로우워크 천안불당점의 모든 독립 1인실 및 다인실 오피스에는 **데스커(DESKER) 최신 워크데스크**와 **시디즈(Sidiz) 인체공학 의자**가 완비되어 있습니다.

---

#### 🌟 1인실 주요 인테리어 & 혜택

- **독립 개별 도어락**: 나만의 비밀번호로 관리되는 안전한 공간.
- **초고속 10G 전용선 Wi-Fi**: 대용량 파일 전송 및 화상 회의도 끊김 없음.
- **24시간 연중무휴 보안 출입**: 캡스 지문/QR 출입 제어로 새벽 시간에도 안심 이용.
- **야외 휴식 테라스**: 집중력이 떨어질 때 야외에서 시원하게 기분 전환 가능.
    `,
    date: "2026-07-20",
    author: "헬로우워크 매니저",
    views: 412,
    readTime: "3분",
    coverImage: "/images/clients/hellowork_lounge.png",
    tags: ["소호사무실", "1인실오피스", "데스커책상", "천안불당동"]
  }
];

export default function HelloWorkBlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    category: "공유오피스",
    excerpt: "",
    content: "",
    tags: ""
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert("제목과 본문 내용을 입력해 주세요.");
      return;
    }

    const created: BlogPost = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      category: newPost.category,
      excerpt: newPost.excerpt || newPost.content.slice(0, 100) + "...",
      content: newPost.content,
      date: new Date().toISOString().split("T")[0],
      author: "헬로우워크 매니저",
      views: 1,
      readTime: "3분",
      coverImage: "/images/clients/hellowork_hero.png",
      tags: newPost.tags ? newPost.tags.split(",").map((t) => t.trim()) : ["헬로우워크"]
    };

    setPosts([created, ...posts]);
    setIsWriteModalOpen(false);
    setNewPost({ title: "", category: "공유오피스", excerpt: "", content: "", tags: "" });
    alert("🎉 새 블로그 글이 성공적으로 등록되었습니다!");
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === "전체" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 🌟 1. Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link
              href="/client-site-builder/hellowork"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft size={16} />
              메인 홈으로 돌아가기
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-sm font-black text-white flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              헬로우워크 천안불당점 공식 블로그
            </span>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-black text-slate-950 hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
          >
            <PenTool size={15} />
            ✏️ 새 블로그 글 쓰기
          </button>

        </div>
      </header>

      {/* 🌟 2. Hero Banner */}
      <section className="py-12 bg-gradient-to-b from-slate-900/80 to-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-black tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            OFFICIAL BLOG & NEWS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            헬로우워크 천안불당점 <span className="text-amber-400">생생 소식 & 이용 가이드</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
            비상주 오피스 사업자등록 절차부터 성인 전용 몰입 스터디룸 이용 팁까지 검증된 정보를 전해드립니다.
          </p>

          {/* Search & Category Filter */}
          <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="블로그 포스팅 제목 또는 키워드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-3 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-bold text-amber-400 focus:outline-none"
            >
              <option value="전체">카테고리: 전체</option>
              <option value="비상주 오피스">비상주 오피스</option>
              <option value="공유오피스">공유오피스</option>
              <option value="시설 안내">시설 안내</option>
            </select>
          </div>
        </div>
      </section>

      {/* 🌟 3. Posts Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold space-y-3">
              <p className="text-lg">검색 조건에 맞는 블로그 글이 없습니다.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("전체"); }}
                className="text-xs text-amber-400 underline"
              >
                검색 조건 초기화하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                        {post.category}
                      </div>
                    </div>

                    {/* Post Content Excerpt */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {post.views}회</span>
                        <span>•</span>
                        <span>{post.readTime} 읽기</span>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <User size={12} className="text-amber-400" /> {post.author}
                    </span>
                    <span className="text-xs font-black text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      자세히 읽기 ➔
                    </span>
                  </div>

                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 🌟 4. Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-full bg-slate-950 border border-slate-800"
            >
              <X size={20} />
            </button>

            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                {selectedPost.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-4">
                <span>작성자: {selectedPost.author}</span>
                <span>•</span>
                <span>발행일: {selectedPost.date}</span>
                <span>•</span>
                <span>조회수: {selectedPost.views + 1}회</span>
              </div>
            </div>

            {/* Post Image Banner */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-800">
              <Image src={selectedPost.coverImage} alt={selectedPost.title} fill className="object-cover" />
            </div>

            {/* Post Body Content */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line font-medium">
              {selectedPost.content}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
              {selectedPost.tags.map((t, idx) => (
                <span key={idx} className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  #{t}
                </span>
              ))}
            </div>

            {/* Footer Contact Callout */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-amber-400">헬로우워크 천안불당점 입주 문의</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">전화: 010-8695-5132 | 24시간 당일 임대차계약 지원</p>
              </div>
              <a
                href="tel:010-8695-5132"
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-400 transition-all"
              >
                전화 걸기
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 🌟 5. Create New Post Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <PenTool size={20} className="text-amber-400" />
                새 블로그 포스팅 작성
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                헬로우워크 천안불당점의 소식이나 이용 팁 원고를 작성하여 발행해 보세요.
              </p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-bold text-slate-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-400">포스팅 제목 *</label>
                  <input
                    type="text"
                    placeholder="예: 천안 불당동 비상주 오피스 수수료 할인 이벤트"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">카테고리</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-amber-400 focus:outline-none"
                  >
                    <option value="공유오피스">공유오피스</option>
                    <option value="비상주 오피스">비상주 오피스</option>
                    <option value="시설 안내">시설 안내</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">요약 설명 (Excerpt)</label>
                <input
                  type="text"
                  placeholder="포스팅 목록 카드에 표출될 간단한 요약글"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">본문 내용 *</label>
                <textarea
                  rows={6}
                  placeholder="블로그 포스팅 본문 내용을 작성해 주세요."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: 천안공유오피스, 불당동비상주, 스터디카페"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-sm font-black text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                <Send size={16} /> 🚀 블로그 포스팅 즉시 발행하기
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
