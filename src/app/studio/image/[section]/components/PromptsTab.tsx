"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Sparkles, Image as ImageIcon } from "lucide-react";

interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  translation: string;
  thumbnail: string;
}

export default function PromptsTab() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "전체" },
    { id: "cinematic", label: "시네마틱 실사" },
    { id: "cyberpunk", label: "사이버펑크" },
    { id: "fantasy", label: "판타지 & 명화" },
    { id: "illustration", label: "일러스트 & 3D" },
  ];

  const prompts: PromptItem[] = [
    {
      id: "prompt-1",
      category: "cinematic",
      title: "네온 비 내리는 골목길의 고양이",
      prompt: "Cinematic shot of a fluffy white cat sitting on a wet cobblestone street in a rainy city neon alley, reflection of colorful lights in puddles, highly detailed, 8k resolution.",
      translation: "비 내리는 도시의 네온 골목길 젖은 자갈길에 앉아 있는 하얗고 송이송이한 고양이의 영화 같은 샷, 물웅덩이에 반사된 화려한 빛들, 초고화질.",
      thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prompt-2",
      category: "cyberpunk",
      title: "사이버펑크 해커의 워크스테이션",
      prompt: "Cyberpunk hacker workspace, cluttered desk with multiple holographic monitors displaying code, dim room with purple and cyan neon ambient glow, high-tech gadgets, realistic 3d render.",
      translation: "사이버펑크 해커의 작업 공간, 코드가 표시된 여러 홀로그램 모니터가 있는 어수선한 책상, 보라색과 하늘색 네온 조명이 흐르는 어두운 방, 첨단 가젯, 현실적인 3D 렌더링.",
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prompt-3",
      category: "fantasy",
      title: "구름 위의 고대 천공의 섬",
      prompt: "A mystical floating ancient castle on an island above the clouds, waterfalls cascading into the open sky, golden hour light reflecting off stone walls, epic fantasy digital art.",
      translation: "구름 위 섬에 떠 있는 신비로운 고대 성, 하늘로 쏟아지는 폭포수, 석조 성벽에 반사된 골든 아워의 황금빛 조명, 에픽 판타지 디지털 아트.",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prompt-4",
      category: "illustration",
      title: "귀여운 3D 토끼 요리사",
      prompt: "Cute 3D clay rendering of a fluffy white bunny wearing a chef hat baking a giant strawberry cake, soft studio lighting, cute character design, pastel colors.",
      translation: "요리사 모자를 쓰고 거대한 딸기 케이크를 굽는 하얀 솜털 토끼의 귀여운 3D 점토 렌더링, 부드러운 스튜디오 조명, 귀여운 캐릭터 디자인, 파스텔 톤.",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prompt-5",
      category: "cinematic",
      title: "골든 아워 해안가 도로 스포츠카",
      prompt: "A sleek modern red sports car driving fast along a winding coastal highway during golden hour sunset, ocean waves crashing, motion blur, hyper realistic photorealistic.",
      translation: "일몰 골든 아워 시간대 구불구불한 해안 도로를 질주하는 세련된 현대적 빨간색 스포츠카, 부서지는 파도, 모션 블러, 하이퍼 리얼리틱 사진.",
      thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "prompt-6",
      category: "cyberpunk",
      title: "네온 헬멧을 쓴 미래 도시 라이더",
      prompt: "Futuristic motorcycle rider wearing a glowing neon cyberpunk helmet on a high-tech electric bike, speeding through a dark Tokyo-style metropolitan highway at night, colorful motion lines.",
      translation: "빛나는 네온 사이버펑크 헬멧을 쓴 미래의 오토바이 라이더가 첨단 전기 바이크를 타고 밤의 어두운 도쿄 스타일 광역 고속도로를 질주하는 모습, 화려한 모션 라인.",
      thumbnail: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=300&q=80",
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleUsePrompt = (promptText: string) => {
    router.push(`/studio/image/workspace?mode=ai&prompt=${encodeURIComponent(promptText)}`);
  };

  const filteredPrompts = activeCategory === "all" 
    ? prompts 
    : prompts.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 🏷️ Category Selection Tab Header */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === c.id 
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/10" 
                : "bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 🖼️ Grid Cards Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((p) => {
          const isCopied = copiedId === p.id;
          return (
            <div 
              key={p.id}
              className="rounded-2xl border border-zinc-800 bg-[#090d16]/30 overflow-hidden flex flex-col justify-between hover:border-purple-500/30 transition-all group shadow-lg"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="h-40 w-full relative overflow-hidden">
                  <img 
                    src={p.thumbnail} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                    {p.title}
                  </span>
                </div>

                {/* Prompt Details */}
                <div className="p-4.5 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-400 font-sans tracking-widest">
                      AI GENERATION PROMPT
                    </span>
                    <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950/70 border border-zinc-900 rounded-lg p-2.5 select-all break-words h-20 overflow-y-auto custom-scrollbar">
                      {p.prompt}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      한글 설명
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {p.translation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4.5 pt-0 border-t border-zinc-900/60 flex gap-2">
                <button
                  onClick={() => handleCopy(p.id, p.prompt)}
                  className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-zinc-850 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold text-zinc-350 hover:text-white transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check size={13} className="text-emerald-400" /> 복사 완료
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> 프롬프트 복사
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleUsePrompt(p.prompt)}
                  className="inline-flex h-9 px-4.5 items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-black text-white shadow-md shadow-purple-500/10 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles size={13} /> 편집기 사용
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
