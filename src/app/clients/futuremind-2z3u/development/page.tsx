import React from "react";
import type { Metadata } from "next";
import Link from "@/components/common/SmartIntentLink";
import { Code2, Bot, Layers, Cpu, Eye, Smartphone, Database, ArrowRight, Gamepad2, Video, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "개발 (Development) - 퓨처마인드 | 미래교육문화협회",
  description: "AI로 기업을 재정의하다. 기관과 기업을 위한 10대 맞춤형 AI 솔루션 & SW 개발",
};

const DEV_10_PILLARS = [
  {
    icon: Code2,
    num: "01",
    title: "1. 맞춤형 웹 플랫폼",
    desc: "기업 정체성을 담은 초고속 Next.js 모던 웹 구축",
    p1: "기업 정체성 및 목표 분석",
    p2: "UX/UI 설계 및 프로토타입 제작",
    p3: "웹사이트 구축 및 SEO 최적화",
    p4: "0.01초 엣지 렌더링 & 유지보수",
  },
  {
    icon: Bot,
    num: "02",
    title: "2. 24/7 AI 챗봇",
    desc: "고객 응대 및 리드 수집 100% 무인 자동화",
    p1: "고객 문의 패턴 및 데이터 분석",
    p2: "NLP 엔진 개발 및 도메인 지식 학습",
    p3: "카카오톡 / 웹 실시간 연동",
    p4: "통합 테스트 및 24시간 실시간 배포",
  },
  {
    icon: Eye,
    num: "03",
    title: "3. AR 키오스크",
    desc: "증강현실 기반 인터랙티브 체험 시스템",
    p1: "체험 콘텐츠 기획 및 시나리오 작성",
    p2: "AR 3D 인터랙션 엔진 개발",
    p3: "키오스크 하드웨어 시스템 통합",
    p4: "현장 설치 및 운영 매뉴얼 교육",
  },
  {
    icon: Database,
    num: "04",
    title: "4. ERP (전사적 자원관리)",
    desc: "비즈니스 프로세스 통합 관리 시스템",
    p1: "현재 업무 분석 및 요구사항 정의",
    p2: "맞춤형 모듈 설계 및 DB 아키텍처",
    p3: "데이터 마이그레이션 & 기능 통합",
    p4: "실시간 대시보드 및 통계 운영",
  },
  {
    icon: Layers,
    num: "05",
    title: "5. CMS (콘텐츠 관리)",
    desc: "효율적인 블로그 및 콘텐츠 관리 플랫폼",
    p1: "콘텐츠 워크플로우 정밀 분석",
    p2: "사용자 친화적 직관적 인터페이스",
    p3: "SEO 100점 검색엔진 최적화",
    p4: "0.00초 이미지 WebP 압축 배포",
  },
  {
    icon: Cpu,
    num: "06",
    title: "6. 스마트 팩토리 (IoT/AI)",
    desc: "제조/물류 현장 센서 데이터 실시간 공정 자동화",
    p1: "제조 공정 분석 및 IoT 센서 설계",
    p2: "데이터 실시간 수집 파이프라인 구축",
    p3: "AI 기반 불량 감지 & 예지보전",
    p4: "스마트 팩토리 클라우드 연동",
  },
  {
    icon: Gamepad2,
    num: "07",
    title: "7. AR 게임 & 콘텐츠",
    desc: "몰입형 증강현실 인터랙티브 게임 제작",
    p1: "게임 컨셉 및 스토리보드 기획",
    p2: "3D 모델링 및 AR 엔진 개발",
    p3: "팀 협력 미션 및 챌린지 구현",
    p4: "베타 테스트 및 정식 출시",
  },
  {
    icon: Sparkles,
    num: "08",
    title: "8. 맞춤형 AI 솔루션",
    desc: "기업 특화 인공지능 알고리즘 개발",
    p1: "비즈니스 문제 정의 및 데이터 수집",
    p2: "LLM 파인튜닝 & 맞춤형 모델 학습",
    p3: "사내 보안 인프라 연동 API 구축",
    p4: "실시간 성능 모니터링 & 최적화",
  },
  {
    icon: Video,
    num: "09",
    title: "9. 미디어 파사드",
    desc: "건물 외벽 대형 프로젝션 맵핑 미디어 제작",
    p1: "건물 외벽 특성 분석 & 영상 기획",
    p2: "초고화질 3D 프로젝션 맵핑 영상 제작",
    p3: "현장 빔프로젝터 설치 및 캘리브레이션",
    p4: "야간 시연 테스트 및 유지보수",
  },
  {
    icon: Smartphone,
    num: "10",
    title: "10. 크로스플랫폼 앱",
    desc: "iOS & Android 하이브리드 모바일 앱 개발",
    p1: "사용자 여정 맵핑 & 와이어프레임",
    p2: "Flutter / React Native 크로스 앱 개발",
    p3: "앱스토어 & 구글 플레이 심사 등록",
    p4: "푸시 알림 및 자동 업데이트 운영",
  },
];

export default function DevelopmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          ENGINEERING & AI SOLUTIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          AI로 기업을 재정의하다
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
          기관과 기업을 위한 <strong>맞춤형 AI 솔루션과 10대 핵심 소프트웨어 시스템</strong>을 개발합니다.<br />
          웹/앱부터 챗봇, 스마트 팩토리, 실감형 미디어까지 기술의 한계를 뛰어넘습니다.
        </p>
      </div>

      {/* 3대 기업 전환 비전 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2 text-center shadow-xl">
          <span className="text-xs font-mono font-bold text-cyan-400">VISION 01</span>
          <h3 className="text-lg font-bold text-white">IT 기업으로 전환!</h3>
          <p className="text-xs text-neutral-400">디지털 전환을 위한 핵심 플랫폼 및 모던 웹 솔루션</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2 text-center shadow-xl">
          <span className="text-xs font-mono font-bold text-cyan-400">VISION 02</span>
          <h3 className="text-lg font-bold text-white">스마트 기업으로 전환!</h3>
          <p className="text-xs text-neutral-400">비즈니스 효율을 극대화하는 ERP/CMS 및 24/7 AI 챗봇</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2 text-center shadow-xl">
          <span className="text-xs font-mono font-bold text-cyan-400">VISION 03</span>
          <h3 className="text-lg font-bold text-white">글로벌 기업으로 전환!</h3>
          <p className="text-xs text-neutral-400">인플루언서 IP 활용 및 실감형 미디어/글로벌 인프라</p>
        </div>
      </div>

      {/* 10대 개발 영역 4단계 구축 프로세스 Grid */}
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">10 CORE DEVELOPMENT FIELDS</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">10대 개발 영역 및 4단계 구축 프로세스</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEV_10_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-6 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
                      <Icon size={24} />
                    </div>
                    <span className="text-2xl font-black text-neutral-700 font-mono">{item.num}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-neutral-400">{item.desc}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300 font-mono">
                    <p className="flex items-center gap-2"><Check size={13} className="text-cyan-400" /> <strong className="text-neutral-500">1단계:</strong> {item.p1}</p>
                    <p className="flex items-center gap-2"><Check size={13} className="text-cyan-400" /> <strong className="text-neutral-500">2단계:</strong> {item.p2}</p>
                    <p className="flex items-center gap-2"><Check size={13} className="text-cyan-400" /> <strong className="text-neutral-500">3단계:</strong> {item.p3}</p>
                    <p className="flex items-center gap-2"><Check size={13} className="text-cyan-400" /> <strong className="text-neutral-500">4단계:</strong> {item.p4}</p>
                  </div>
                </div>

                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 hover:bg-cyan-500 hover:text-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
                >
                  <span>개발 상담 신청하기</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Code2 size={16} />
          <span>프로젝트 개발 무료 컨설팅 신청하기</span>
        </Link>
      </div>

    </div>
  );
}
