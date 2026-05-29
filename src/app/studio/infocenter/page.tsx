"use client";

import React from 'react';
import {
  Zap, Bell, MessageSquare, HelpCircle, BookOpenCheck,
  Lightbulb, Users, Hash, PenTool, Plus
} from 'lucide-react';
import Link from 'next/link';

export default function InfoCenterHome() {
  // 게시판 섹션 공통 컴포넌트
  const BoardSection = ({ title, icon: Icon, color, items, listHref, writeHref }: any) => (
    <section className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 hover:border-zinc-700 transition-all group shadow-xl mb-6 last:mb-0">
      <div className="flex justify-between items-center mb-6 text-left">
        {/* 🌟 [핵심 수정] 타이틀 클릭 시 해당 리스트로 이동하도록 Link 추가 */}
        <Link href={listHref} className="group/title inline-flex items-center gap-2">
          <h3 className={`text-xl font-black italic text-white uppercase flex items-center gap-2 transition-colors group-hover/title:text-blue-500`}>
            <Icon className={`${color} group-hover/title:scale-110 transition-transform`} size={20} />
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={writeHref} className="text-[10px] font-black uppercase text-blue-500 hover:text-white transition-colors tracking-widest flex items-center gap-1 font-sans">
            <PenTool size={10} /> 글쓰기
          </Link>
          <Link href={listHref} className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors tracking-widest font-sans">
            View All +
          </Link>
        </div>
      </div>

      <ul className="space-y-4 text-left font-sans">
        {items.map((item: any, idx: number) => (
          <li key={idx} className="text-sm font-medium text-zinc-400 hover:text-blue-400 cursor-pointer truncate flex items-center gap-2 group/item">
            <span className="text-[8px] text-zinc-700 group-hover/item:text-blue-500">●</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="mt-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-6">

      {/* 1. 히어로 섹션 (CreAIbox Hub) */}
      <div className="relative overflow-hidden rounded-[40px] p-10 bg-gradient-to-br from-blue-600 to-indigo-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 text-left mb-8">
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">
            CreAIbox <span className="text-blue-300">Hub</span>
          </h2>
          <p className="text-sm font-bold text-blue-100 opacity-80 uppercase tracking-widest leading-relaxed font-sans">
            최신 AI 트렌드와 크리에이터들의 노하우가 모이는 <br className="hidden md:block" /> 전략적 지식 베이스 캠프
          </p>
        </div>

        <Link
          href="/studio/infocenter/writing?category=free"
          className="relative z-10 shrink-0 flex items-center justify-center gap-3 px-8 py-4 bg-yellow-400 text-blue-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-2xl font-sans"
        >
          <Plus size={18} /> Write Post Now
        </Link>

        <Zap className="absolute right-[-20px] bottom-[-40px] w-56 h-56 text-white/10 rotate-12" />
      </div>

      {/* 2. 6대 게시판 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col">
          <BoardSection
            title="NOTICE" icon={Bell} color="text-yellow-400"
            listHref="/studio/infocenter/list/notice"
            writeHref="/studio/infocenter/writing?category=notice"
            items={["AI 콘텐츠 스튜디오 v1.0.4 업데이트 안내", "커뮤니티 이용 가이드 및 매너 수칙", "베타 서비스 기간 무료 이용 정책 공지", "시스템 정기 점검 안내 (5/15)", "개인정보 처리방침 개정 알림"]}
          />
          <BoardSection
            title="FREE LOUNGE" icon={MessageSquare} color="text-blue-400"
            listHref="/studio/infocenter/list/free"
            writeHref="/studio/infocenter/writing?category=free"
            items={["오늘 만든 AI 이미지 한번 봐주세요!", "워드프레스 수익 인증해봅니다", "생성형 AI의 미래에 대해 어떻게 생각하시나요?", "커피 한잔하며 노가다 중입니다..", "다들 주말에 뭐하시나요?"]}
          />
          <BoardSection
            title="Q&A STATION" icon={HelpCircle} color="text-purple-400"
            listHref="/studio/infocenter/list/qna"
            writeHref="/studio/infocenter/writing?category=qna"
            items={["Suno 가사 생성할 때 다국어 팁 좀 주세요", "API 키 등록 에러 해결 방법 아시는 분?", "워드프레스 자동 포스팅 플러그인 추천", "비디오 생성할 때 자꾸 뭉개지는데 어쩌죠?", "닉네임 변경은 어디서 하나요?"]}
          />
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="flex flex-col">
          <BoardSection
            title="MASTER TIPS" icon={Lightbulb} color="text-orange-400"
            listHref="/studio/infocenter/list/tips"
            writeHref="/studio/infocenter/writing?category=tips"
            items={["워드프레스 자동 포스팅으로 수익화 하는 꿀팁", "구글 상위 노출을 위한 SEO 최적화 전략", "프롬프트 하나로 퀄리티 200% 올리는 법", "AI 캐릭터 페르소나 설정 마스터 가이드", "수익형 블로그 셋팅 처음부터 끝까지"]}
          />
          <BoardSection
            title="SHOWCASE" icon={Users} color="text-emerald-400"
            listHref="/studio/infocenter/list/showcase"
            writeHref="/studio/infocenter/writing?category=showcase"
            items={["이번 주 최고의 AI 생성 이미지 작품집", "Suno로 만든 고퀄리티 K-POP 감상하기", "AI로 만든 1분 단편 영화 공개합니다", "실사형 모델 프롬프트 공유", "자동화 수익 파이프라인 구축 사례"]}
          />
          <BoardSection
            title="FAQ STATION" icon={BookOpenCheck} color="text-zinc-400"
            listHref="/studio/infocenter/list/faq"
            writeHref="/studio/infocenter/writing?category=faq"
            items={["회원 탈퇴는 어떻게 하나요?", "결제 수단 변경 방법 안내", "작성한 글을 비공개로 전환하고 싶어요", "크리에이터 등급별 혜택 정리", "서비스 이용약관 전문 보기"]}
          />
        </div>
      </div>
    </div>
  );
}