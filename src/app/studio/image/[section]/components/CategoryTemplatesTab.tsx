"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layers, Wand2, ArrowRight } from "lucide-react";

interface CategoryTemplateItem {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  description: string;
}

interface CategoryTemplatesTabProps {
  category: string;
}

export default function CategoryTemplatesTab({ category }: CategoryTemplatesTabProps) {
  const router = useRouter();

  // 1. 카테고리별 규격 정보 및 설명 구성
  const categoryConfig = {
    poster: {
      name: "포스터 & 전단지",
      desc: "홍보 포스터, 전단지, 웹 팜플렛에 어울리는 세로형 고해상도 A4 규격 템플릿입니다.",
      width: 2480,
      height: 3508,
      icon: "📄",
      templates: [
        {
          id: "temp-poster-1",
          title: "테크 컨퍼런스 세미나 포스터",
          url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80",
          width: 2480,
          height: 3508,
          description: "어두운 네온 불빛 무드의 AI 컨퍼런스 홍보용 세로 포스터",
        },
        {
          id: "temp-poster-2",
          title: "미니멀리즘 가구 신상품 홍보",
          url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80",
          width: 2480,
          height: 3508,
          description: "화사하고 내추럴한 원목 가구 전시 전단지",
        },
        {
          id: "temp-poster-3",
          title: "뷰티 데일리룩 팝업 스토어",
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
          width: 2480,
          height: 3508,
          description: "몽환적인 보라빛 조명의 패션 뷰티 브랜드 팝업 포스터",
        },
      ]
    },
    "business-card": {
      name: "디지털 명함",
      desc: "비즈니스, 개인 소셜 미디어 홍보에 쓰이는 표준 명함 가로 규격(900x500) 템플릿입니다.",
      width: 900,
      height: 500,
      icon: "💳",
      templates: [
        {
          id: "temp-card-1",
          title: "모던 미니멀 비즈니스 프로필 명함",
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
          width: 900,
          height: 500,
          description: "블랙 앤 퍼플 계열의 심플한 개발자/디자이너 명함 디자인",
        },
        {
          id: "temp-card-2",
          title: "크리에이티브 아티스트 다채로운 명함",
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
          width: 900,
          height: 500,
          description: "우주 성운 배경의 트렌디하고 화려한 아티스트 카드",
        },
      ]
    },
    banner: {
      name: "현수막 & 배너",
      desc: "웹사이트 광고 배너, 유튜브 채널 아트, 이벤트 공지에 최적화된 와이드 가로 규격(1200x400) 템플릿입니다.",
      width: 1200,
      height: 400,
      icon: "📢",
      templates: [
        {
          id: "temp-banner-1",
          title: "신상품 런칭 얼리버드 세일 배너",
          url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
          width: 1200,
          height: 400,
          description: "세련된 고속 스포츠카 레이아웃의 얼리버드 할인 팝업 배너",
        },
        {
          id: "temp-banner-2",
          title: "여름 패션 특별 기획전 와이드 커버",
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
          width: 1200,
          height: 400,
          description: "감각적인 파스텔 톤 뷰티 브랜드 기획전 배너",
        },
      ]
    }
  };

  const config = categoryConfig[category as keyof typeof categoryConfig] || {
    name: "디자인 템플릿 브라우저",
    desc: "원하시는 크기의 템플릿 레이아웃을 선택하여 빠르게 편집을 시작할 수 있습니다.",
    width: 1080,
    height: 1080,
    icon: "🎨",
    templates: []
  };

  const handleStartBlank = () => {
    router.push(`/studio/image/workspace?width=${config.width}&height=${config.height}&title=${encodeURIComponent(config.name + "_작업물")}`);
  };

  const handleStartTemplate = (t: CategoryTemplateItem) => {
    router.push(
      `/studio/image/workspace?width=${t.width}&height=${t.height}&imageUrl=${encodeURIComponent(t.url)}&title=${encodeURIComponent(t.title)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* 💡 Top Banner Description Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#090d16]/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            <span>{config.icon}</span> {config.name} 템플릿 허브
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            {config.desc}
          </p>
          <p className="text-[10px] text-zinc-500 font-bold font-mono">
            기본 권장 규격: {config.width} x {config.height} px
          </p>
        </div>

        <button
          onClick={handleStartBlank}
          className="inline-flex h-10 px-5.5 items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white shadow-md transition-all cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          <Wand2 size={13} /> 빈 규격으로 시작
        </button>
      </div>

      {/* 🖼️ Templates List Grid */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-black text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
          <Layers size={13} className="text-purple-400" /> 인기 추천 템플릿
        </h3>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {config.templates.map((t) => (
            <div
              key={t.id}
              onClick={() => handleStartTemplate(t)}
              className="group rounded-2xl border border-zinc-800 bg-[#090d16]/20 overflow-hidden cursor-pointer hover:border-purple-500/40 hover:-translate-y-0.5 transition-all shadow-lg flex flex-col h-72 justify-between"
            >
              <div className="h-44 w-full overflow-hidden border-b border-zinc-900">
                <img
                  src={t.url}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-all duration-200"
                />
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-purple-400 transition truncate">
                    {t.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold font-mono pt-1">
                  <span>{t.width} x {t.height} px</span>
                  <span className="text-purple-400 group-hover:translate-x-0.5 transition flex items-center gap-0.5 font-sans">
                    편집하기 <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
