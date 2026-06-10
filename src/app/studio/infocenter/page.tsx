"use client";

import React from "react";
import {
  Zap,
  Bell,
  MessageSquare,
  HelpCircle,
  BookOpenCheck,
  Lightbulb,
  Users,
  PenTool,
  Plus,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function InfoCenterHome() {
  const boards = [
    {
      title: "NOTICE",
      icon: Bell,
      color: "from-amber-500 to-yellow-500",
      listHref: "/studio/infocenter/list/notice",
      writeHref: "/studio/infocenter/writing?category=notice",
      items: [
        "AI 콘텐츠 스튜디오 v1.0.4 업데이트 안내",
        "커뮤니티 이용 가이드 및 매너 수칙",
        "베타 서비스 기간 무료 이용 정책 공지",
        "시스템 정기 점검 안내 (5/15)",
        "개인정보 처리방침 개정 알림",
      ],
    },
    {
      title: "FREE LOUNGE",
      icon: MessageSquare,
      color: "from-blue-600 to-cyan-500",
      listHref: "/studio/infocenter/list/free",
      writeHref: "/studio/infocenter/writing?category=free",
      items: [
        "오늘 만든 AI 이미지 한번 봐주세요!",
        "워드프레스 수익 인증해봅니다",
        "생성형 AI의 미래에 대해 어떻게 생각하시나요?",
        "커피 한잔하며 노가다 중입니다..",
        "다들 주말에 뭐하시나요?",
      ],
    },
    {
      title: "Q&A STATION",
      icon: HelpCircle,
      color: "from-violet-600 to-fuchsia-500",
      listHref: "/studio/infocenter/list/qna",
      writeHref: "/studio/infocenter/writing?category=qna",
      items: [
        "Suno 가사 생성할 때 다국어 팁 좀 주세요",
        "API 키 등록 에러 해결 방법 아시는 분?",
        "워드프레스 자동 포스팅 플러그인 추천",
        "비디오 생성할 때 자꾸 뭉개지는데 어쩌죠?",
        "닉네임 변경은 어디서 하나요?",
      ],
    },
    {
      title: "MASTER TIPS",
      icon: Lightbulb,
      color: "from-rose-600 to-orange-500",
      listHref: "/studio/infocenter/list/tips",
      writeHref: "/studio/infocenter/writing?category=tips",
      items: [
        "워드프레스 자동 포스팅으로 수익화 하는 꿀팁",
        "구글 상위 노출을 위한 SEO 최적화 전략",
        "프롬프트 하나로 퀄리티 200% 올리는 법",
        "AI 캐릭터 페르소나 설정 마스터 가이드",
        "수익형 블로그 셋팅 처음부터 끝까지",
      ],
    },
    {
      title: "SHOWCASE",
      icon: Users,
      color: "from-emerald-600 to-teal-500",
      listHref: "/studio/infocenter/list/showcase",
      writeHref: "/studio/infocenter/writing?category=showcase",
      items: [
        "이번 주 최고의 AI 생성 이미지 작품집",
        "Suno로 만든 고퀄리티 K-POP 감상하기",
        "AI로 만든 1분 단편 영화 공개합니다",
        "실사형 모델 프롬프트 공유",
        "자동화 수익 파이프라인 구축 사례",
      ],
    },
    {
      title: "FAQ STATION",
      icon: BookOpenCheck,
      color: "from-indigo-600 to-blue-500",
      listHref: "/studio/infocenter/list/faq",
      writeHref: "/studio/infocenter/writing?category=faq",
      items: [
        "회원 탈퇴는 어떻게 하나요?",
        "결제 수단 변경 방법 안내",
        "작성한 글을 비공개로 전환하고 싶어요",
        "크리에이터 등급별 혜택 정리",
        "서비스 이용약관 전문 보기",
      ],
    },
  ];

  return (
    <div className="mt-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-6">
      {/* 1. 히어로 섹션 (CreAIbox Hub) */}
      <section className="relative overflow-hidden rounded-[24px] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-[#0b1020] to-[#111827] p-8 md:p-10 shadow-2xl mb-8">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black text-blue-300">
              <Sparkles size={15} />
              CreAIbox Info Center
            </div>

            <h2 className="break-keep text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              크리에이터들의
              <br />
              전략적 지식 베이스캠프
            </h2>

            <p className="mt-4 max-w-2xl break-keep text-sm font-medium leading-relaxed text-zinc-400">
              최신 AI 트렌드와 크리에이터들의 생생한 노하우를 공유해 보세요.
              질문하고, 자랑하며, 새로운 가치를 만들어 나갑니다.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/studio/infocenter/writing?category=free"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-95 shadow-xl shadow-black/20"
            >
              <Plus size={16} className="stroke-[3px]" />
              Write Post Now
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 6대 게시판 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {boards.map((board, idx) => {
          const Icon = board.icon;
          return (
            <section
              key={idx}
              className="group flex flex-col justify-between rounded-[20px] border border-zinc-800 bg-zinc-950/70 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-blue-500/5 shadow-xl"
            >
              <div>
                {/* Header: Icon badge & Write Link */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-r ${board.color} text-white shadow-lg shadow-black/30`}
                  >
                    <Icon size={22} />
                  </div>
                  
                  {/* Action Link: Write */}
                  <Link
                    href={board.writeHref}
                    className="text-[11px] font-black uppercase text-blue-500/85 hover:text-blue-400 transition-colors tracking-widest flex items-center gap-1 font-sans"
                  >
                    <PenTool size={11} />
                    글쓰기
                  </Link>
                </div>

                {/* Board Title */}
                <Link href={board.listHref} className="group/title inline-block mb-4">
                  <h3 className="text-lg font-black text-white group-hover/title:text-blue-400 transition-colors tracking-tight">
                    {board.title}
                  </h3>
                </Link>

                {/* List items */}
                <ul className="space-y-3 font-sans">
                  {board.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="group/item flex items-center gap-2.5 text-sm font-medium text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer py-0.5"
                    >
                      <ChevronRight
                        size={12}
                        className="text-zinc-700 group-hover/item:text-blue-400 shrink-0 transition-transform duration-300 group-hover/item:translate-x-1"
                      />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom footer: View All */}
              <div className="mt-6 pt-4 border-t border-zinc-900/50 flex justify-end">
                <Link
                  href={board.listHref}
                  className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  View All
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}