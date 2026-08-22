import React from "react";
import type { Metadata } from "next";
import Link from "@/components/common/SmartIntentLink";
import { Lightbulb, Check, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "기획 (Planning) - 퓨처마인드 | 미래교육문화협회",
  description: "IP 로드맵, 특허/저작권 사업화 전략, 정부 지원사업 바우처 및 공공 입찰 100% 낙찰 제안 기획",
};

const BID_NOTICES = [
  {
    title: "AI 기반 대민 챗봇 개발 용역",
    agency: "서울시청",
    budget: "5,000만원",
    date: "11월 5일 ~ 11월 20일",
    status: "수주 성공",
  },
  {
    title: "스마트시티 통합 플랫폼 구축",
    agency: "경기도청",
    budget: "2억원",
    date: "11월 12일 ~ 11월 28일",
    status: "제안서 통과",
  },
  {
    title: "AI 맞춤형 교육용 앱 개발",
    agency: "교육부",
    budget: "8,000만원",
    date: "11월 18일 ~ 12월 5일",
    status: "수주 성공",
  },
  {
    title: "AI 교육 플랫폼 및 CMS 구축",
    agency: "경기도 교육청",
    budget: "1.2억원",
    date: "11월 25일 ~ 12월 10일",
    status: "낙찰 완료",
  },
  {
    title: "스마트팜 센서 IoT 데이터 시스템",
    agency: "농림축산식품부",
    budget: "9,500만원",
    date: "12월 1일 ~ 12월 15일",
    status: "제안서 통과",
  },
  {
    title: "의료 데이터 분석 및 진단 시스템",
    agency: "보건복지부",
    budget: "1.5억원",
    date: "12월 5일 ~ 12월 20일",
    status: "최종 낙찰",
  },
];

const IP_ROADMAP_STEPS = [
  {
    step: "01단계: IP 발굴 (1-2개월)",
    desc: "기업 보유 기술 아이디어 정리, 선행 기술 조사, 경쟁사 특허 회피 및 특허 포트폴리오 전략 수립",
  },
  {
    step: "02단계: IP 출원 (3-4개월)",
    desc: "변리법인 세움 전담 변리사의 정밀 명세서 작성, 특허청 출원 접수, 중간 심사 의견 대응",
  },
  {
    step: "03단계: IP 등록 (5-12개월)",
    desc: "특허청 최종 등록 결정, 등록료 납부 및 독점 배타적 지식재산권 권리화 완료",
  },
  {
    step: "04단계: IP 활용 & 사업화 (지속적)",
    desc: "기술 이전, 라이센싱 계약, 정부 R&D 가산점 확보 및 투자 유치(IR) 밸류에이션 극대화",
  },
];

export default function PlanningPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          STRATEGIC PLANNING & VOUCHERS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          아이디어부터 실행까지,<br />AI 기반 원스톱 기획 솔루션
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-medium">
          브랜드부터 블렌딩까지 <strong>창업자와 기업을 위한 원스톱 기획 및 바우처 컨설팅</strong>을 지원합니다.<br />
          20년 이상의 실무 경험을 보유한 자문 변리사 네트워크와 전문 기획팀이 함께합니다.
        </p>
      </div>

      {/* 1. 6대 기획 핵심 영역 Grid */}
      <div className="space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">6 CORE PILLARS</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">퓨처마인드 6대 종합 기획 솔루션</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 01</span>
              <h3 className="text-lg font-bold text-white">1. 홍보 및 제휴 기획</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                타겟 오디언스 분석, 성공 사례 벤치마킹, 메이저 인플루언서 협력 매칭 및 제휴 상품 기획, 실구매 전환 대시보드 구축
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">실전 마케터 1:1 매칭</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 02</span>
              <h3 className="text-lg font-bold text-white">2. 브랜딩 & 퍼널 설계</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                상품 매력을 극대화하는 BI/CI 브랜딩, 방문자 10,000명 기준 단계별 전환 퍼널 시뮬레이션 (전환율 3.2배 극대화)
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">전문 디자이너 퍼널 설계</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 03</span>
              <h3 className="text-lg font-bold text-white">3. 자금 및 판로 기획</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                R&D 지원사업 및 기술 영업을 통한 매출 혁신. 기업 역량 평가부터 적합 사업 선정, 사업계획서 고도화 및 발표 평가 대비
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">지원사업 선정 성공률 92%</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 04</span>
              <h3 className="text-lg font-bold text-white">4. 정부 바우처 기획</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                K-스타트업, 혁신바우처, 기술개발 바우처 활용 (정부지원 70% + 자부담 30%). 바우처로 마케팅, 웹개발, 디자인 전액 해결
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">최대 1,000만원 정부 지원</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 05</span>
              <h3 className="text-lg font-bold text-white">5. 변리 및 IP 기획</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                저작권·특허·디자인권 기반 성장 전략. IP 디딤돌 지원사업 컨설팅, 특허 기반 기술 개발, 투자 유치(IR) 밸류에이션 극대화
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">변리법인 세움 20년 자문단</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">PILLAR 06</span>
              <h3 className="text-lg font-bold text-white">6. 공공기관 입찰 기획</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                나라장터 공공 입찰을 통한 안정적인 매출 확보. 최적 공고 분석부터 전문가 경쟁력 제안서 작성, 낙찰 및 계약 체결까지 100% 지원
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 pt-2 border-t border-neutral-800">정부·공공 입찰 100% 대행</span>
          </div>
        </div>
      </div>

      {/* 2. 변리법인 세움 20년 자문단 & IP 로드맵 */}
      <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-8 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">PATENT & IP ROADMAP</span>
            <h3 className="text-2xl font-bold text-white">자문 변리사: 변리법인 세움</h3>
            <p className="text-xs text-neutral-400">
              20년 이상의 풍부한 실무 경험을 보유한 전문 변리사가 귀사의 IP 전략과 특허 출원을 함께합니다.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 bg-neutral-900 p-4 rounded-xl border border-neutral-800 font-mono text-center">
            <div>
              <span className="text-2xl font-black text-cyan-400">92%</span>
              <p className="text-[10px] text-neutral-400">특허 출원 등록률</p>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <span className="text-2xl font-black text-white">500+</span>
              <p className="text-[10px] text-neutral-400">기업 자문 완료</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {IP_ROADMAP_STEPS.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400">{step.step}</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 이달의 공공기관 및 대기업 입찰 분석표 */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">PUBLIC BIDDING RADAR</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">이달의 추천 입찰 공고 및 수주 현황</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">나라장터 실시간 분석 연동</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#141414] shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono text-xs">
                <th className="py-4 px-6 font-bold">공고 사업명</th>
                <th className="py-4 px-6 font-bold">발주 기관</th>
                <th className="py-4 px-6 font-bold">사업 예산</th>
                <th className="py-4 px-6 font-bold">공고 및 마감 일정</th>
                <th className="py-4 px-6 font-bold">제안 지원 현황</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
              {BID_NOTICES.map((bid, idx) => (
                <tr key={idx} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{bid.title}</td>
                  <td className="py-4 px-6 font-medium text-neutral-300">{bid.agency}</td>
                  <td className="py-4 px-6 font-mono text-cyan-400 font-bold">{bid.budget}</td>
                  <td className="py-4 px-6 font-mono text-neutral-400">{bid.date}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      <Check size={12} /> {bid.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Lightbulb size={16} />
          <span>정부 바우처 및 입찰 기획 무료 상담 신청하기</span>
        </Link>
      </div>

    </div>
  );
}
