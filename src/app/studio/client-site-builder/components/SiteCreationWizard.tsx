"use client";

import React, { useState } from "react";
import { Sparkles, Globe, ArrowRight, Loader2, CheckCircle, AlertTriangle, Plus, Trash2, Layers } from "lucide-react";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import { getUserAiVaultConfig } from "@/lib/client/api-vault";

interface SiteCreationWizardProps {
  onSuccess: () => void;
  onCancel?: () => void;
  initialTemplateId?: string;
}

export default function SiteCreationWizard({ onSuccess, onCancel, initialTemplateId }: SiteCreationWizardProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Input, 2: Review Proposal
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Wizard Inputs
  const [brandId, setBrandId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // AI Proposal
  const [proposal, setProposal] = useState<any>(null);

  // Template Selector Modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Validation
    const cleanBrandId = brandId.trim().toLowerCase();
    const brandIdRegex = /^[a-z0-9-]+$/;
    if (!brandIdRegex.test(cleanBrandId) || cleanBrandId.length < 2) {
      setErrorMsg("브랜드 ID는 영문 소문자, 숫자, 하이픈(-)만 포함하여 2자 이상 입력해 주세요.");
      setLoading(false);
      return;
    }
    if (!companyName.trim()) {
      setErrorMsg("회사/학원명을 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const vaultConfig = getUserAiVaultConfig();

      let finalAdditionalInfo = additionalInfo.trim();
      if (initialTemplateId) {
        const templateName = TEMPLATE_REGISTRY[initialTemplateId]?.name || initialTemplateId;
        finalAdditionalInfo = `[시스템 지침] 반드시 사용자가 사전에 선택한 디자인 테마 '${initialTemplateId}' (${templateName})에 최적화된 컨셉과 섹션 구성으로 홈페이지를 기획해 주세요. 기획안 JSON의 'templateId' 필드는 무조건 '${initialTemplateId}'로 채워 반환해야 합니다.\n\n${finalAdditionalInfo}`;
      }

      const res = await fetch("/api/client-site-builder/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl: sourceUrl.trim(),
          additionalInfo: finalAdditionalInfo,
          vaultConfig: vaultConfig ? {
            provider: vaultConfig.provider,
            apiKey: vaultConfig.apiKey,
            model: vaultConfig.model
          } : null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI 기획 수립에 실패했습니다.");
      }

      const parsedProposal = data.proposal;
      if (initialTemplateId && parsedProposal) {
        parsedProposal.templateId = initialTemplateId;
      }

      setProposal(parsedProposal);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "서버 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuildWebsite = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/client-site-builder/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: brandId.trim().toLowerCase(),
          templateId: proposal.templateId,
          companyName: proposal.companyName || companyName.trim(),
          phone: proposal.phone || "",
          address: proposal.address || "",
          sections: proposal.sections
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "홈페이지 최종 빌드에 실패했습니다.");
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "빌드 과정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    const selectedTemplate = TEMPLATE_REGISTRY[proposal.templateId] || TEMPLATE_REGISTRY.business_standard;

    // Available sections definition
    const AVAILABLE_SECTIONS = [
      { type: "hero", name: "메인 히어로 배너", desc: "주요 특징 요약, 배경 이미지 및 대형 문구 노출" },
      { type: "services", name: "서비스/교육 과정 소개", desc: "핵심 프로그램 및 대표 메뉴를 3열 카드 그리드로 구성" },
      { type: "about", name: "회사/학원 대표 소개", desc: "상세 대표 인사말, 비전 및 통계적 수치(Stats) 노출" },
      { type: "portfolio", name: "대표 실적/합격 명예의전당", desc: "합격자 현황, 시공 실적 및 우수 성과 카드를 3열 나열" },
      { type: "rental", name: "대관/장비 이용 안내", desc: "프라이빗 룸 대여 서비스 정보, 전용 장비 및 수칙 제공" },
      { type: "contact", name: "상담/온라인 문의 신청 폼", desc: "이름, 전화번호 등을 입력해 즉시 데이터베이스로 유입하는 접수처" }
    ];

    const handleRemoveSection = (idx: number) => {
      const updated = [...proposal.sections];
      updated.splice(idx, 1);
      setProposal({ ...proposal, sections: updated });
    };

    const handleAddSection = (sectionType: string) => {
      let newSect: any = {
        section_type: sectionType,
        title: "",
        subtitle: "",
        content_data: {}
      };

      if (sectionType === "hero") {
        newSect.title = `${proposal.companyName || companyName || "회사"}의 새로운 도약`;
        newSect.subtitle = "우리는 최고의 가치와 차별화된 맞춤형 솔루션을 제안합니다.";
        newSect.content_data = {
          backgroundImage: "",
          ctaText: "상담 신청하기",
          ctaLink: "#contact",
          features: [
            { text: "독보적인 기술과 전문성" },
            { text: "1:1 맞춤 피드백 보장" }
          ]
        };
      } else if (sectionType === "services") {
        newSect.title = "핵심 프로그램 및 제공 서비스";
        newSect.subtitle = "최상의 성과를 제공하는 우리의 대표 분야입니다.";
        newSect.content_data = {
          items: [
            { title: "첫 번째 전문 컨설팅", description: "상세 분석 및 진단을 통한 효율적인 성장 로드맵 수립", icon: "BookOpen" },
            { title: "두 번째 집중 피드백반", description: "성공을 앞당기는 명품 강사진의 밀착 밀착 피드백 제공", icon: "Award" },
            { title: "세 번째 글로벌 매니지먼트", description: "글로벌 트렌드를 접목한 최적의 마케팅 전략 연계", icon: "Compass" }
          ]
        };
      } else if (sectionType === "about") {
        newSect.title = "대표 소개 및 기업 이념";
        newSect.subtitle = "신뢰와 정성으로 파트너의 성공을 함께 만들어 가겠습니다.";
        newSect.content_data = {
          description: "저희 브랜드는 오랫동안 다져온 노하우와 우수한 파트너 네트워크를 기반으로 차별화된 디지털 성장을 선도합니다. 일방적인 제공이 아닌, 파트너로서 함께 고민하고 상생하는 것이 우리의 최종 비전입니다.",
          stats: [
            { label: "누적 거래 고객 수", value: "300+" },
            { label: "전문 자문 전문가", value: "15명+" },
            { label: "고객 파트너 만족도", value: "98.7%" }
          ]
        };
      } else if (sectionType === "portfolio") {
        newSect.title = "우수 성공 사례 (실적)";
        newSect.subtitle = "땀방울과 노력이 만들어낸 자랑스러운 결과물입니다.";
        newSect.content_data = {
          items: [
            { title: "A사 플랫폼 신규 런칭 성공", description: "작업 능률 극대화 및 32% 매출 향상 달성", image: "" },
            { title: "B 아카데미 입시 전원 합격", description: "체계적인 수준별 킬러 문항 대비의 우수한 성과", image: "" },
            { title: "C 복합 문화 프라이빗 룸 연출", description: "아늑한 조명과 모던 가구를 조합한 최고급 인테리어", image: "" }
          ]
        };
      } else if (sectionType === "rental") {
        newSect.title = "프라이빗 룸 대관 및 장비";
        newSect.subtitle = "모임, 세미나, 행사를 위한 프리미엄 전용 공간 대여";
        newSect.content_data = {
          description: "저희가 운영하는 다목적 세미나 룸은 최대 50인까지 이용하실 수 있으며, 최고급 무선 마이크, 대형 스크린 빔 프로젝터 등을 무상 지원합니다. 행사 성격에 맞는 핑거푸드 및 다이닝 서비스도 추가 연결이 가능합니다.",
          stats: [
            { label: "공간 수용 규모", value: "최대 50인" },
            { label: "이용 예약 기한", value: "최소 2일 전" },
            { label: "대관 예약 평점", value: "99.4%" }
          ]
        };
      } else if (sectionType === "contact") {
        newSect.title = "빠른 상담 및 예약 신청";
        newSect.subtitle = "공부 고민이나 행사 대관 문의를 남겨주시면 정성껏 답변 드리겠습니다.";
        newSect.content_data = {
          fields: ["name", "phone", "message"],
          buttonText: "상담 문의 신청하기"
        };
      }

      const updated = [...(proposal.sections || []), newSect];
      setProposal({ ...proposal, sections: updated });
    };

    return (
      <div className="max-w-6xl mx-auto p-6 md:p-8 animate-fade-in">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">STEP 02</span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              AI 홈페이지 기획안 검토
            </h1>
          </div>
          <button
            onClick={() => setStep(1)}
            disabled={loading}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            기획 정보 수정
          </button>
        </div>

        {/* Info Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white dark:bg-[#0b0f19] p-6 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">회사/학원명</span>
            <input
              type="text"
              value={proposal.companyName || ""}
              onChange={(e) => setProposal({ ...proposal, companyName: e.target.value })}
              className="w-full text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">대표 연락처</span>
            <input
              type="text"
              value={proposal.phone || ""}
              onChange={(e) => setProposal({ ...proposal, phone: e.target.value })}
              className="w-full text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">위치/주소</span>
            <input
              type="text"
              value={proposal.address || ""}
              onChange={(e) => setProposal({ ...proposal, address: e.target.value })}
              className="w-full text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          
          {/* Left Column - Active sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Suggested Theme Info with Switch Button */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 md:p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-emerald-300">
                    AI 매칭 추천 템플릿 테마: <span className="underline font-black">{selectedTemplate.name}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    비즈니스 특징에 맞춘 {selectedTemplate.category} 디자인 레이아웃 및 폰트 세팅이 적용되어 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="flex-shrink-0 px-4 py-2.5 text-xs font-extrabold text-emerald-450 hover:text-white border border-emerald-500/30 hover:bg-emerald-500/80 bg-emerald-550/10 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                디자인 테마 변경
              </button>
            </div>

            {/* Section List Preview */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">구성 섹션 목록 ({proposal.sections?.length || 0}개)</h3>
              {proposal.sections?.length === 0 ? (
                <div className="bg-white dark:bg-[#0b0f19] border border-dashed border-slate-300 dark:border-slate-800/80 p-8 text-center rounded-2xl">
                  <p className="text-xs font-bold text-slate-400">선택된 구성 섹션이 없습니다. 오른쪽 패널에서 원하는 섹션을 추가해 보세요.</p>
                </div>
              ) : (
                proposal.sections.map((sect: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group/card"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black text-blue-555 dark:text-blue-400 bg-blue-500/10 rounded-full">
                        섹션 {idx + 1}: {sect.section_type.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>삭제</span>
                      </button>
                    </div>

                    {/* Section Edit Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">섹션 대제목</label>
                        <input
                          type="text"
                          value={sect.title || ""}
                          onChange={(e) => {
                            const updated = [...proposal.sections];
                            updated[idx].title = e.target.value;
                            setProposal({ ...proposal, sections: updated });
                          }}
                          className="w-full text-xs font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">섹션 소제목 / 설명</label>
                        <input
                          type="text"
                          value={sect.subtitle || ""}
                          onChange={(e) => {
                            const updated = [...proposal.sections];
                            updated[idx].subtitle = e.target.value;
                            setProposal({ ...proposal, sections: updated });
                          }}
                          className="w-full text-xs font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Sticky Available Sections */}
          <div className="lg:col-span-1 bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-850 rounded-3xl p-6 sticky top-6 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-250 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="text-emerald-400" size={16} />
                <span>추가 가능한 섹션</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">원하는 레이아웃 모듈을 내 사이트 구성 목록에 추가할 수 있습니다.</p>
            </div>
            
            <div className="space-y-3 pt-2">
              {AVAILABLE_SECTIONS.map((avail) => {
                const count = proposal.sections?.filter((s: any) => s.section_type === avail.type).length || 0;

                return (
                  <div
                    key={avail.type}
                    className="bg-white dark:bg-slate-900/45 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between gap-2.5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">{avail.name}</h4>
                        {count > 0 && (
                          <span className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {count}개 추가됨
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{avail.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSection(avail.type)}
                      className="w-full py-2 text-xs font-bold text-emerald-550 dark:text-emerald-400 hover:text-white dark:hover:text-slate-950 border border-emerald-500/20 hover:bg-emerald-500 dark:hover:bg-emerald-400 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>추가하기</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-rose-500 text-center bg-rose-50 rounded-xl p-3 border border-rose-100 mb-6">
            {errorMsg}
          </p>
        )}

        {/* Approve / Build CTA */}
        <button
          onClick={handleBuildWebsite}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition-all shadow-md rounded-2xl cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>홈페이지 빌드 중... (잠시만 기다려 주세요)</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              <span>기획안 최종 승인 및 홈페이지 즉시 개설</span>
            </>
          )}
        </button>

        {/* Template Swer Modal Overlay */}
        {showTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/85 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-150 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-slate-900/30">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">디자인 템플릿 라이브러리</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">원하시는 비즈니스 테마를 선택하면 컬러, 폰트, 모서리 곡률이 일괄 주입됩니다.</p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-black border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 rounded-lg px-2.5 py-1 cursor-pointer active:scale-95"
                >
                  닫기
                </button>
              </div>
              
              {/* Modal Content - WordPress style template grid */}
              <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-[#07090e]">
                {Object.values(TEMPLATE_REGISTRY).map((temp) => {
                  const primaryColor = temp.theme.colors.primary;
                  const secondaryColor = temp.theme.colors.secondary;
                  const bgColor = temp.theme.colors.background;
                  
                  return (
                    <div
                      key={temp.templateId}
                      onClick={() => {
                        setProposal({ ...proposal, templateId: temp.templateId });
                        setShowTemplateModal(false);
                      }}
                      className={`group border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        proposal.templateId === temp.templateId
                          ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-550/5"
                          : "border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-[#0b0f19]"
                      }`}
                    >
                      {/* WordPress-style visual wireframe representative */}
                      <div className="h-32 p-4 flex flex-col justify-between relative overflow-hidden" style={{ backgroundColor: bgColor }}>
                        {/* Mock Header */}
                        <div className="flex justify-between items-center">
                          <div className="w-12 h-2.5 rounded" style={{ backgroundColor: primaryColor }} />
                          <div className="flex gap-1">
                            <div className="w-3 h-1.5 rounded" style={{ backgroundColor: secondaryColor }} />
                            <div className="w-3 h-1.5 rounded" style={{ backgroundColor: secondaryColor }} />
                          </div>
                        </div>
                        
                        {/* Mock Hero content */}
                        <div className="my-auto space-y-1">
                          <div className="w-2/3 h-4 rounded" style={{ backgroundColor: primaryColor }} />
                          <div className="w-1/2 h-2.5 rounded" style={{ backgroundColor: secondaryColor, opacity: 0.6 }} />
                        </div>

                        {/* Mock Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/50">
                          <div className="w-1/3 h-2 rounded" style={{ backgroundColor: secondaryColor, opacity: 0.3 }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
                        </div>

                        {/* Template category tag */}
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-900/10 dark:bg-white/15 text-slate-850 dark:text-slate-200 backdrop-blur-sm">
                          {temp.category}
                        </span>
                      </div>

                      {/* Template Info */}
                      <div className="p-4 border-t border-slate-150 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19]">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-450 dark:group-hover:text-emerald-400 transition-colors">
                            {temp.name}
                          </h3>
                          {proposal.templateId === temp.templateId && (
                            <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">SELECTED</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{temp.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in-up">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-6 flex justify-between items-start gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">STEP 01</span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            AI 홈페이지 자동 생성
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            서브도메인 브랜드 아이디를 지정하고, 보유하신 블로그/사이트 주소를 입력해 주시면 AI가 원클릭으로 비즈니스 구조를 기획해 드립니다.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-shrink-0 px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b0f19] rounded-xl transition-all shadow-sm cursor-pointer hover:shadow active:scale-95"
          >
            대시보드로 돌아가기
          </button>
        )}
      </div>

      <form onSubmit={handleGeneratePlan} className="space-y-6">
        {/* Brand ID (Subdomain) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            브랜드 서브도메인 아이디 <span className="text-rose-500 ml-1">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="예: sotongcheum"
              required
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="flex-grow text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-l-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <span className="inline-flex items-center px-4 py-3 bg-slate-100 dark:bg-slate-800 border-t border-b border-r border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 rounded-r-xl">
              .creaibox.com
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            * 소문자, 숫자, 하이픈(-)만 가능하며 개설 후 사용자의 메인 도메인이 됩니다.
          </span>
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            공식 회사/학원명 <span className="text-rose-500 ml-1">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 소통과채움 교육대행사"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Source URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            참고용 블로그/홈페이지 주소 (선택)
          </label>
          <input
            type="url"
            placeholder="https://blog.naver.com/your-blog-id"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          <span className="text-[10px] text-slate-400">
            * 입력 시 AI가 해당 사이트의 최신 글들과 회사 정보를 수집하여 기획안을 더 정확하게 도출합니다.
          </span>
        </div>

        {/* Additional Info / Guidelines */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            추가 요건 및 학원/회사 안내 지침 (선택)
          </label>
          <textarea
            rows={4}
            placeholder="예: 초중고 대상 수학/과학 전문 입시 학원입니다. 일반관, 고등관, 영재관 3개관 운영 중인 사실과 밴드 주소를 강조해 주세요."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full text-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-rose-500 text-center bg-rose-50 rounded-xl p-3 border border-rose-100">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition-all shadow-md rounded-2xl cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>블로그 내용 분석 및 기획안 작성 중...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>AI 홈페이지 기획안 생성</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
