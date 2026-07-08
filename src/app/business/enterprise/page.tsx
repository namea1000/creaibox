"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Wand2,
  LineChart,
  UserCheck,
  Send,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/layout/Header";

export default function EnterprisePage() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    inquiryType: "enterprise",
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

  const solutionOptions = [
    "사내 안심 프라이빗 AI 튜닝 (보안 특화)",
    "B2B2C 홈페이지 대량 분양/자동 생성 빌더",
    "사내 시스템 연동 API 자동화 파이프라인",
    "부서별 협업 & 권한 제어 대시보드",
    "1:1 밀착 AI 컨설팅 및 전용 템플릿",
    "대규모 검색엔진 최적화(SEO) 및 자동 마케팅 배포",
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

  const solutions = [
    {
      id: "01",
      title: "사내 안심 프라이빗 AI 튜닝",
      subtitle: "보안 특화 RAG 및 커스텀 프롬프트 학습",
      description:
        "사내 핵심 기밀이나 마케팅 비공개 정보가 외부 AI 모델의 재학습 데이터로 유출되지 않도록 완벽히 통제된 격리 보안망 모델을 구축합니다. 기업 고유의 브랜드 말투, 가이드라인, 매뉴얼을 주입해 최적화된 결과물만 보장합니다.",
      icon: ShieldCheck,
      badge: "보안 1등급",
    },
    {
      id: "02",
      title: "홈페이지 & 랜딩페이지 대량 분양 자동화",
      subtitle: "B2B2C 비즈니스를 위한 자동 빌딩 엔진",
      description:
        "프랜차이즈 가맹점, 대리점, 협력 영업점들이 개별 도메인으로 수백 개에 달하는 홈페이지를 스스로 만들고 통합 관리할 수 있는 크리에이박스만의 독점 CMS 솔루션을 기업용 클라우드 아키텍처에 맞춤 빌딩해 드립니다.",
      icon: Layers,
      badge: "대량 배포 특화",
    },
    {
      id: "03",
      title: "기업 시스템 연동형 대용량 API 연계",
      subtitle: "ERP / CRM / DB 자동 적재 파이프라인",
      description:
        "수동으로 마케팅 글을 복사하고 붙여넣는 오버헤드를 종식시킵니다. 사내 업무 시스템과 크리에이박스 AI 분석/창작 서버를 백엔드로 연동하여 필요한 일일 시장 동향 보고서, 영상 스크립트, 광고 소재가 자동 생산 및 발행되도록 구성합니다.",
      icon: Cpu,
      badge: "시스템 자동화",
    },
    {
      id: "04",
      title: "부서별 협업 및 역할 기반 관리 (RBAC)",
      subtitle: "안전하고 투명한 팀 관리 대시보드",
      description:
        "기획팀, 마케팅 부서, 실무 에디터 및 승인권자 등 기업 내 수십 명의 사용자들이 각자 권한 범위 내에서 안전하게 프로젝트를 다듬고 결과물을 승인 결재할 수 있도록 체계화된 다기능 엔터프라이즈 계정 컨트롤 대시보드를 제공합니다.",
      icon: UserCheck,
      badge: "조직 관리",
    },
    {
      id: "05",
      title: "1:1 밀착 AI 컨설팅 및 커스텀 템플릿",
      subtitle: "최고의 AI 엔지니어 및 디자이너 전담 지원",
      description:
        "기업 비즈니스 도메인에 완벽히 정렬된 독점 디자인 레이아웃 세트와 프롬프트 템플릿을 개발해 드립니다. 사내 임직원 대상의 AI 업무 자동화 교육부터 솔루션 고도화 연동 작업까지 전담 기술 지원을 다이렉트로 제공합니다.",
      icon: Wand2,
      badge: "기술 전담",
    },
    {
      id: "06",
      title: "대규모 검색엔진 최적화 (SEO) 및 자동 배포",
      subtitle: "Google / Naver 검색 트래픽 극대화를 위한 자동 엔진",
      description:
        "수십 개의 키워드 분석부터 대량의 마케팅 글이 검색 포털 상위에 노출되도록 SEO 스키마 구조를 AI가 자동으로 주입합니다. 작성된 콘텐츠는 블로그, SNS 등 채널별 포맷으로 가공되어 원클릭으로 멀티채널에 동시 자동 발행됩니다.",
      icon: TrendingUp,
      badge: "트래픽 극대화",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      {/* 🌌 은은하고 품격 있는 기업용 딥 블루/바이올렛 그라데이션 */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        
        {/* 🏢 SECTION 1: HERO TITLE */}
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-10 mb-16 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-650 dark:text-slate-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <Building2 size={12} className="text-blue-600" /> Enterprise Custom-Tailored
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950 dark:text-white leading-tight">
            기업형 맞춤 제작 솔루션
          </h1>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-bold max-w-3xl leading-relaxed">
            안전한 사내 전용 AI 인프라 구축부터 마케팅 자동화 API 연동까지, <br className="hidden md:inline" />
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">크리에이박스(CreAibox)</span>가 기업의 규모와 목표에 맞추어 완전 무결한 비즈니스 스튜디오를 직접 빌딩해 드립니다.
          </p>
        </div>

        {/* 🛠️ SECTION 2: 5대 핵심 솔루션 목록 (Grid Layout) */}
        <div className="grid gap-6 md:grid-cols-2 mb-24">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 flex flex-col justify-between shadow-sm relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3.5xl md:text-4xl font-black text-slate-200/80 dark:text-slate-800/50 font-mono group-hover:text-blue-500/20 transition-colors">
                      {sol.id}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                      {sol.badge}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-550/10 text-blue-600 dark:text-blue-400">
                      <Icon size={18} />
                    </div>
                    {sol.title}
                  </h3>
                  <h4 className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 mt-1 pl-11">
                    {sol.subtitle}
                  </h4>
                  <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed mt-4 pl-11">
                    {sol.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 인프라 스케일업 홍보 카드 */}
          <div className="p-8 rounded-3xl border border-slate-900 dark:border-slate-850 bg-slate-950 dark:bg-[#0b0f19]/80 text-white flex flex-col justify-between md:col-span-2 shadow-xl relative overflow-hidden">
            <div className="absolute right-[-10%] bottom-[-20%] w-[300px] h-[300px] bg-blue-550/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="space-y-3 z-10">
              <span className="text-xs font-black tracking-widest text-blue-400 uppercase">
                Enterprise Infrastructure
              </span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">
                나중에 사업 확장을 가속화할 가장 신뢰할 만한 AI 기술 파트너
              </h3>
              <p className="text-xs md:text-sm text-slate-400 dark:text-slate-400 max-w-3xl leading-relaxed">
                크리에이박스는 안정적인 분산 비동기 큐 렌더링 서버 및 대규모 클라우드 수파베이스 데이터베이스 보안 인프라를 채택하고 있어, 
                소량의 데이터 수집부터 수만 명이 동시에 생성하는 대용량 B2B 비즈니스 스케일까지 무중단 서버 증설이 즉시 가능합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs text-blue-400 font-bold z-10">
              <LineChart size={14} /> 실시간 기업 전용 서버 상태 모니터링 및 SLA 99.9% 보장
            </div>
          </div>
        </div>

        {/* 📬 SECTION 3: B2B CONSULTATION FORM (견적 및 상담 신청 양식) */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19]/80 p-8 md:p-10 shadow-lg dark:shadow-2xl relative">
          <div className="absolute top-[-5%] left-[-5%] w-[120px] h-[120px] bg-blue-500/5 rounded-full blur-[40px] pointer-events-none" />

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 mb-2">
                <CheckCircle2 size={42} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                상담 신청이 성공적으로 접수되었습니다!
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                작성해 주신 연락처와 이메일 정보를 토대로 담당 AI 아키텍트가 검토 후 **24시간 이내(영업일 기준)**에 상세 제안서 및 상담 회신을 보내드리겠습니다.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    inquiryType: "enterprise",
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
                추가 상담 신청하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
                <h3 className="text-xl font-extrabold text-slate-950 dark:text-white">
                  기업형 AI 솔루션 맞춤 상담 신청
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">
                  원하시는 AI 시스템 요구 요소를 선택해 주시면 전문 아키텍트가 맞춤형 아키텍처 가이드와 상세 견적을 검토하여 회신해 드립니다.
                </p>
              </div>

              {/* 입력 그룹 1 */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-750 dark:text-slate-300 block">
                    회사명 / 기관명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 크리에이박스 주식회사"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-750 dark:text-slate-300 block">
                    신청 담당자 이름 / 부서 직함 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="이름 (예: 홍길동)"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-1/2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                    />
                    <input
                      type="text"
                      placeholder="부서명/직급 (예: 기획 파트장)"
                      value={formData.managerPosition}
                      onChange={(e) => setFormData({ ...formData, managerPosition: e.target.value })}
                      className="w-1/2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* 입력 그룹 2 */}
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                    회신 연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                    회사 이메일 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="예: biz@creaibox.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 체크박스 선택 */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-755 dark:text-slate-300 block">
                  필요한 기업 맞춤형 인프라 영역 (다중 선택 가능)
                </label>
                <div className="grid gap-2 md:grid-cols-2">
                  {solutionOptions.map((opt) => {
                    const checked = formData.solutions.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleCheckboxChange(opt)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          checked
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 shrink-0 rounded flex items-center justify-center border transition-all ${
                            checked
                              ? "bg-blue-600 border-blue-650 text-white"
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
                  상세 문의 및 요구사항 내용
                </label>
                <textarea
                  rows={4}
                  placeholder="구축하고자 하시는 AI 연동 방향이나 예산 범위, 주요 요구사항을 자유롭게 기재해 주세요."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs md:text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner resize-none"
                />
              </div>

              {/* 동의 조항 */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>
                    개인정보 수집 및 상담 회신을 위한 이용 방침에 대해 동의합니다. (필수)
                  </span>
                </label>
              </div>

              {/* 전송 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white font-extrabold text-sm md:text-base shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>상담 신청을 접수하는 중입니다...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>기업용 상담 및 무료 견적 신청하기</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* 🏁 SECTION 4: FOOTER COPYRIGHT */}
        <div className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
          © {currentYear} 크리에이박스(CreAibox). All rights reserved. 본 맞춤 제작 제안서의 판권은 크리에이박스에 소속되어 있습니다.
        </div>

      </div>
    </div>
  );
}
