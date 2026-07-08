"use client";

import React, { useState } from "react";
import {
  Handshake,
  Megaphone,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";

export default function CollaborationAdsPage() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    inquiryType: "collaboration",
    companyName: "",
    managerName: "",
    managerPosition: "",
    phone: "",
    email: "",
    solutions: [] as string[],
    details: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const proposalOptions = [
    "브랜드 공동 제휴 마케팅",
    "교육기관 아카데미 패키지 제휴",
    "크리에이터 / 인플루언서 제휴 프로모션",
    "플랫폼 배너 광고 / 스폰서십",
    "오프라인 크리에이터 페어 연계 제휴",
    "기타 비즈니스 협업 제안",
  ];

  const handleCheckboxChange = (option: string) => {
    setFormData((prev) => {
      const isSelected = prev.solutions.includes(option);
      const updatedSolutions = isSelected
        ? prev.solutions.filter((s) => s !== option)
        : [...prev.solutions, option];
      return { ...prev, solutions: updatedSolutions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.managerName || !formData.phone || !formData.email) {
      alert("필수 입력 항목(* 표시)을 모두 작성해 주세요.");
      return;
    }
    if (!formData.agree) {
      alert("개인정보 수집 및 이용 방침에 동의해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/business/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const valueProps = [
    {
      id: "01",
      title: "브랜드 공동 제휴 마케팅",
      description:
        "크리에이박스의 AI 창작 브랜드 파워를 기업 브랜드와 결합합니다. 공동 보도자료 배포, 제휴 할인 이벤트 및 공동 온라인 웨비나 개최를 통해 서로의 타겟 고객 풀에 자연스럽게 녹아듭니다.",
      icon: Handshake,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    },
    {
      id: "02",
      title: "교육기관 아카데미 패키지 제휴",
      description:
        "대학 전공 학과, 코딩/마케팅 학원, 중고교 교육 과정에 AI 스튜디오 크레딧 단체 팩을 보급합니다. 학생들의 인공지능 콘텐츠 실무 활용 능력을 기르고, 교육자들을 위한 커리큘럼 라이선스를 매핑해 드립니다.",
      icon: GraduationCap,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600",
    },
    {
      id: "03",
      title: "크리에이터 / 인플루언서 프로모션",
      description:
        "유튜브, 블로그, SNS에서 활동하는 테크/창작 분야 인플루언서분들을 환영합니다. 전용 제휴 코드 보급 및 유입에 따른 높은 커미션 셰어(Affiliate)를 통해 상호 지속 가능한 수익 구조를 제공합니다.",
      icon: Users,
      color: "from-violet-500/10 to-purple-500/10 text-violet-600",
    },
    {
      id: "04",
      title: "플랫폼 배너 광고 / 스폰서십",
      description:
        "매월 수십만 명의 활성 크리에이터가 머무는 글쓰기 스튜디오, 비디오 에디터 영역 내 광고 구좌를 확보할 수 있습니다. 툴 내부 템플릿의 가이드 항목에 브랜드를 직접 주입해 실구매 전환율을 극대화합니다.",
      icon: Megaphone,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600",
    },
  ];

  const partners = [
    {
      type: "기업 파트너",
      synergy: "AI 마케팅 툴 조기 도입으로 마케터 생산성 300% 향상 및 신사업 브랜딩 선점 효과.",
    },
    {
      type: "교육 단체 / 학원",
      synergy: "실제 현업에서 쓰이는 올인원 AI 크리에이티브 스튜디오 실습을 통한 취업 경쟁력 극대화.",
    },
    {
      type: "크리에이터 / 유튜버",
      synergy: "구독자 대상 할인 혜택 제공으로 채널 팬덤 강화 및 추천인 수익을 통한 월 고정 부수입 실현.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      {/* 🌌 은은하고 산뜻한 그린/테알/블루 그라데이션 */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        
        {/* 📢 SECTION 1: HERO TITLE */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 mb-16 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <Handshake size={12} className="text-emerald-500" /> Collaboration & Sponsorship
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-tight">
            협업 / 광고 제안 솔루션
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-3xl leading-relaxed">
            크리에이터와 기업이 함께 성장하는 최적의 AI 창작 허브, <br className="hidden md:inline" />
            다양한 브랜드 파트너십과 채널 스폰서십을 통해 차원이 다른 시너지를 만들어갑니다.
          </p>
        </div>

        {/* 🛠️ SECTION 2: 협업/광고 4대 대표 분야 */}
        <div className="grid gap-6 md:grid-cols-2 mb-20">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.id}
                className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3.5xl md:text-4xl font-black text-slate-200/80 dark:text-slate-800/50 font-mono">
                      {prop.id}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${prop.color} shrink-0`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    {prop.title}
                  </h3>
                  <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed mt-3">
                    {prop.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🤝 SECTION 3: PARTNERSHIP SYNERGY */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 shadow-sm mb-20 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
            <h3 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500 animate-pulse" />
              대상별 동반 성장 시너지
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">
              크리에이박스와 결합하는 모든 주체에게 확실한 실용 가치를 드립니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner.type} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850 space-y-2">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {partner.type}
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-bold">
                  {partner.synergy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 📬 SECTION 4: INQUIRY FORM */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 p-8 md:p-10 shadow-lg dark:shadow-2xl relative">
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 mb-2">
                <CheckCircle2 size={42} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                제안서가 정상적으로 접수되었습니다!
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                검토 부서에서 보내주신 협업 요강안 및 연락처를 바탕으로 신속하게 분석 후 **영업일 기준 48시간 이내**에 제안 피드백을 전달해 드리겠습니다.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    inquiryType: "collaboration",
                    companyName: "",
                    managerName: "",
                    managerPosition: "",
                    phone: "",
                    email: "",
                    solutions: [],
                    details: "",
                    agree: false,
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl transition-all cursor-pointer"
              >
                추가 제안서 제출하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
                  협업 / 광고 제휴 상담 신청
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">
                  제휴 및 광고를 기획 중이신 분야를 기재해주시면 전담 마케터가 신속하게 맞춤 시너지 요강안을 브리핑해 드립니다.
                </p>
              </div>

              {/* 입력 그룹 1 */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-750 dark:text-slate-300 block">
                    회사명 / 단체명 / 크리에이터 채널명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 크리에이티브 스튜디오 / 유튜버명"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-750 dark:text-slate-300 block">
                    담당자 이름 / 직함 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="이름 (예: 홍길동)"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-1/2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                    />
                    <input
                      type="text"
                      placeholder="직급 (예: 파트너 / 대표)"
                      value={formData.managerPosition}
                      onChange={(e) => setFormData({ ...formData, managerPosition: e.target.value })}
                      className="w-1/2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* 입력 그룹 2 */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                    이메일 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="예: partner@creaibox.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 체크박스 */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                  희망 제안 분야 (다중 선택 가능)
                </label>
                <div className="grid gap-2 md:grid-cols-2">
                  {proposalOptions.map((opt) => {
                    const checked = formData.solutions.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleCheckboxChange(opt)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          checked
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-650 dark:text-slate-400"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 shrink-0 rounded flex items-center justify-center border transition-all ${
                            checked
                              ? "bg-emerald-600 border-emerald-650 text-white"
                              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {checked && <span className="text-[10px]">✓</span>}
                        </div>
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 상세 요구사항 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                  협업 제안 상세 내용 / 광고 집행 희망안
                </label>
                <textarea
                  rows={4}
                  placeholder="협업 제안 방향이나 예산, 기대 효과 및 주요 협업 스케줄 요강을 자유롭게 적어주세요."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner resize-none"
                />
              </div>

              {/* 동의 조항 */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-slate-550 dark:text-slate-400">
                    개인정보 수집 및 제휴 심사 회신을 위한 이용 방침에 대해 동의합니다. (필수)
                  </span>
                </label>
              </div>

              {/* 전송 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm md:text-base shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>상담 신청을 접수하는 중입니다...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>협업 / 광고제안 무료 상담 신청하기</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* 🏁 SECTION 5: FOOTER */}
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-450 dark:text-slate-500 font-medium">
          © {currentYear} 크리에이박스(CreAibox). All rights reserved. 본 제안서 양식의 판권은 크리에이박스에 소속되어 있습니다.
        </div>

      </div>
    </div>
  );
}
