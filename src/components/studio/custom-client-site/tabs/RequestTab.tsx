import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Cpu, CheckCircle2, Building2, Sparkles, Plus, Search, Tag, Flame, Pencil, Save, Send, ListPlus, Zap, Check, ShieldCheck, Lock, RefreshCw, Store, TrendingUp, Award } from "lucide-react";
import { getDesignPresetsForCategory, CUSTOM_TEMPLATES } from "@/constants/custom-client-site";

interface RequestTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function RequestTab({ requireAuth }: RequestTabProps) {
  const [reqCategory, setReqCategory] = useState<string>("행사/기획/렌탈");
  const [reqConcept, setReqConcept] = useState<string>("");
  const [reqFeatures, setReqFeatures] = useState<string[]>([]);
  const [reqDetail, setReqDetail] = useState<string>("");
  const [reqSuccess, setReqSuccess] = useState<boolean>(false);
  const [reqHeaderMenus, setReqHeaderMenus] = useState<string[]>(["회사소개", "서비스안내", "포트폴리오", "공지사항", "Contact & 1:1 상담"]);
  const [enableAuthDb, setEnableAuthDb] = useState<boolean>(false);
  const [reqAuthMethods, setReqAuthMethods] = useState<string[]>(["카카오 1초 소셜 로그인 (Kakao OAuth)", "일반 이메일 & 비밀번호 회원가입"]);
  const [reqAuthFeatures, setReqAuthFeatures] = useState<string[]>(["회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)", "관리자 CRM 대시보드 연동", "비회원 접근 제한 (B2B 인트라넷 모드)"]);
  const [reqRefUrl, setReqRefUrl] = useState<string>("");
  const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);


  const categories = [
    "전체 테마",
    ...Array.from(new Set(CUSTOM_TEMPLATES.map((t: any) => t.category))),
  ];

  const supabase = createClient();
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!reqConcept) {
      alert("추천 디자인 컨셉을 먼저 선택해 주세요.");
      return;
    }
    
    setIsSubmittingReq(true);
    
    // Get current user to attach profile_id
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get profile nickname or use email
      const { data: profile } = await supabase.from('profiles').select('nickname, full_name').eq('id', user.id).single();
      const userNickname = profile?.nickname || profile?.full_name || user.email?.split('@')[0] || "사용자";
      
      const { error } = await supabase.from('client_site_requests').insert([
        {
          user_id: user.id,
          user_nickname: userNickname,
          company_name: userNickname + "님의 사이트",
          category: reqCategory,
          theme_color: reqConcept,
          features: reqFeatures,
          ref_url: reqRefUrl,
          detail: reqDetail,
          status: "pending"
        }
      ]);
      
      if (error) {
        console.error("Failed to submit request:", error);
        alert("요청 제출 중 오류가 발생했습니다.");
        setIsSubmittingReq(false);
        return;
      }
    } else {
      alert("로그인이 필요합니다.");
      setIsSubmittingReq(false);
      return;
    }
    
    setIsSubmittingReq(false);
    setReqSuccess(true);
  };

  return (
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 px-4 py-1 text-xs font-black text-purple-300">
              <Cpu size={14} /> AI 에이전트 1:1 전담 신규 제작 서비스
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              100% 독창적인 풀코드 커스텀 홈페이지 제작 요청
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed">
              표준 템플릿으로 담아내기 어려운 전용 사업 영역, 특수 렌탈 폼, 갤러리 레이아웃이 필요하시다면 AI 에이전트에게 신청해 주세요! 단 몇 분 만에 풀코드로 제작하여 탑재해 드립니다.
            </p>
          </div>

          {reqSuccess && (
            <div className="rounded-3xl bg-purple-500/10 border border-purple-500/30 p-6 text-center space-y-3">
              <CheckCircle2 size={32} className="mx-auto text-purple-400" />
              <h3 className="text-lg font-black text-white">AI 에이전트에 커스텀 제작 요청이 접수되었습니다!</h3>
              <p className="text-xs font-medium text-purple-200">
                AI 에이전트(Antigravity)가 요청하신 업종 및 명세서를 분석하여 100% 맞춤 풀코드 구축을 시작합니다.
              </p>
            </div>
          )}

          <form onSubmit={handleSendRequest} className="space-y-8">
            {/* Field 1: 업종 / 산업 분야 선택 (Full Width Standalone Block) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Building2 size={16} className="text-purple-400" />
                <span>1️⃣ 제작하려는 업종 / 산업 분야 선택</span>
              </label>
              <select
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-5 py-4 text-sm font-bold text-white focus:border-purple-500 focus:outline-none shadow-inner cursor-pointer"
              >
                {categories.filter((c) => c !== "전체 테마").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Field 2: [{reqCategory}] 업종 맞춤 추천 디자인 컨셉 & 메인 컬러 (Full Width 5-Column Grid) */}
            <div className="space-y-4 rounded-3xl bg-slate-950/60 p-6 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <span>2️⃣ [{reqCategory}] 업종 맞춤 추천 디자인 컨셉 & 메인 컬러 (10개 템플릿 예시 중 선택)</span>
                  </label>
                  <p className="text-xs font-medium text-slate-400">
                    원하시는 느낌의 디자인과 컬러 칩을 클릭하시면 AI 에이전트 생성 명세서로 원클릭 자동 세팅됩니다.
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 shrink-0">
                  원클릭 자동 세팅 ⭕
                </span>
              </div>

              {/* 5-Column Grid (Wide Cards, 5 items per row x 2 rows = 10 items) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {getDesignPresetsForCategory(reqCategory).map((preset: any) => {
                  const isSelected = reqConcept.includes(preset.name);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setReqConcept(
                          `${preset.name} (${preset.vibe}) - Palette: ${preset.colors.join(", ")}`
                        )
                      }
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50 shadow-xl shadow-purple-500/20 scale-102"
                          : "bg-slate-900/90 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {preset.tag}
                          </span>
                          {isSelected && <CheckCircle2 size={16} className="text-purple-400 shrink-0" />}
                        </div>
                        <p className="text-xs font-black text-white leading-snug">{preset.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{preset.description}</p>
                      </div>

                      {/* Color Swatch Circles */}
                      <div className="flex items-center gap-1.5 pt-2.5 border-t border-slate-800">
                        {preset.colors.map((c: any, i: number) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 font-mono ml-auto font-bold truncate max-w-[65px]">
                          {preset.colors[1]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-bold text-slate-400">선택된 디자인 컨셉 & 메인 컬러 명세 (필요 시 직접 세부 수정도 가능)</label>
                <input
                  type="text"
                  value={reqConcept}
                  onChange={(e) => setReqConcept(e.target.value)}
                  className="w-full rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs font-bold text-purple-300 focus:border-purple-500 focus:outline-none shadow-inner"
                  placeholder="상단 10개 예시 중 선택하거나 직접 입력해 주세요"
                />
              </div>
            </div>

            {/* Field 3: GNB 헤더 상단 메뉴 구성 선택 (Header GNB Menu Selection) */}
            <div className="space-y-4 rounded-3xl bg-slate-950/60 p-6 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-black text-white flex items-center gap-2">
                    <ListPlus size={16} className="text-amber-400" />
                    <span>3️⃣ 상단 GNB 헤더 메뉴 구성 선택 (복수 선택 가능)</span>
                  </label>
                  <p className="text-xs font-medium text-slate-400">
                    홈페이지 상단 네비게이션(GNB)에 탑재할 메인 헤더 메뉴를 자유롭게 선택해 주세요. (추천 5~7개 자동 선택)
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shrink-0">
                  권장 5~7개 탑재 📌
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "홈 (Home)", isRequired: true, desc: "메인 비주얼 랜딩 페이지" },
                  { name: "회사소개 / 브랜드 스토리", isRequired: true, desc: "CEO 인사말, 비전, 연혁" },
                  { name: "주요 서비스 / 포트폴리오", isRequired: true, desc: "업종별 핵심 서비스 쇼케이스" },
                  { name: "실적 갤러리 & 성공 사례", isRequired: false, desc: "프로젝트 갤러리 및 성과" },
                  { name: "온라인 견적 / 예약 신청", isRequired: true, desc: "실시간 견적 및 예약 폼" },
                  { name: "고객 후기 / 렌탈 리뷰", isRequired: false, desc: "고객 생생 후기 & 비포애프터" },
                  { name: "자주 묻는 질문 (FAQ)", isRequired: false, desc: "주요 CS 질문 & 답변 모달" },
                  { name: "Blog (공식 블로그)", isRequired: true, desc: "SEO 원고 자동 발행 백링크", isRight: true },
                  { name: "Contact & 1:1 상담", isRequired: true, desc: "GNB 우측 1:1 상담 버튼", isRight: true },
                  { name: "인기 랭킹 & 트렌드 칼럼", isRequired: false, desc: "인기 아티클 랭킹 리스트" },
                ].map((item) => {
                  const isChecked = reqHeaderMenus.includes(item.name);
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        if (isChecked) {
                          setReqHeaderMenus(reqHeaderMenus.filter((m) => m !== item.name));
                        } else {
                          setReqHeaderMenus([...reqHeaderMenus, item.name]);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2.5 transition-all cursor-pointer ${
                        isChecked
                          ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10"
                          : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                            item.isRight
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                              : item.isRequired
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {item.isRight ? "우측 CTA" : item.isRequired ? "필수 메뉴" : "선택 옵션"}
                          </span>
                          {isChecked && <CheckCircle2 size={14} className="text-amber-400 shrink-0" />}
                        </div>
                        <p className="text-xs font-black text-white leading-snug">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 4: 필요한 특수 기능 선택 (복수 선택 가능) */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <span>4️⃣ 필요한 특수 기능 선택 (복수 선택 가능)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "실적/포트폴리오 갤러리 탭",
                  "실시간 온라인 견적신청 폼",
                  "전용 블로그 & 조회수 카운터",
                  "DoFollow SEO 백링크 가산점 엔진",
                  "카카오톡 / 전화 상담 고정 다이얼",
                  "엑박 방지 안전 예외 폴백 핸들러",
                ].map((ft) => {
                  const isChecked = reqFeatures.includes(ft);
                  return (
                    <button
                      type="button"
                      key={ft}
                      onClick={() => {
                        if (isChecked) {
                          setReqFeatures(reqFeatures.filter((f) => f !== ft));
                        } else {
                          setReqFeatures([...reqFeatures, ft]);
                        }
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        isChecked
                          ? "bg-purple-500/20 border-purple-500 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{ft}</span>
                      {isChecked && <Check size={14} className="text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: 👑 전용 회원가입 & 백엔드 DB 서버 구축 옵션 (유료 특수 옵션 - 가격 미정) */}
            <div className="space-y-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-950/80 to-blue-950/40 p-6 border border-purple-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-purple-400" />
                    <h3 className="text-base font-black text-white">
                      5️⃣ 👑 사용자 회원가입 & 백엔드 DB 서버 통합 구축 (유료 추가 옵션)
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed">
                    회원가입 기능 추가 시 소셜 로그인(카카오/네이버/구글), 회원 전용 DB 데이터베이스, 마이페이지 및 보안 세션 엔진이 통째로 백엔드에 구축됩니다.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
                    💰 구축 비용: 가격 미정 (맞춤 견적 협의)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer bg-purple-500/20 px-3.5 py-1.5 rounded-full border border-purple-400/40 hover:bg-purple-500/30 transition-all">
                    <input
                      type="checkbox"
                      checked={enableAuthDb}
                      onChange={(e) => setEnableAuthDb(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                    />
                    <span className="text-xs font-black text-purple-200">
                      {enableAuthDb ? "회원 DB 구축 신청 ⭕" : "회원 DB 미사용 ❌"}
                    </span>
                  </label>
                </div>
              </div>

              {enableAuthDb && (
                <div className="space-y-6 pt-2 animate-fade-in-up">
                  {/* Group A: 🔑 회원가입 & 로그인 인증 수단 선택 */}
                  <div className="space-y-3">
                    <label className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                      <Lock size={14} className="text-purple-400" />
                      <span>🔑 로그인 & 회원가입 인증 수단 선택 (복수 선택 가능)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "카카오 1초 소셜 로그인 (Kakao OAuth)", desc: "국내 모바일 회원 전환율 1위" },
                        { name: "네이버 1초 소셜 로그인 (Naver OAuth)", desc: "네이버 연동 간편인증 시스템" },
                        { name: "구글 소셜 로그인 (Google OAuth)", desc: "글로벌 표준 구글 원클릭 가입" },
                        { name: "일반 이메일 & 비밀번호 회원가입", desc: "이메일 인증 및 암호화 가입" },
                      ].map((item) => {
                        const isChecked = reqAuthMethods.includes(item.name);
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => {
                              if (isChecked) {
                                setReqAuthMethods(reqAuthMethods.filter((m) => m !== item.name));
                              } else {
                                setReqAuthMethods([...reqAuthMethods, item.name]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-purple-500/20 border-purple-400 ring-1 ring-purple-400/40 text-purple-100"
                                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                  Auth
                                </span>
                                {isChecked && <CheckCircle2 size={14} className="text-purple-400 shrink-0" />}
                              </div>
                              <p className="text-xs font-extrabold text-white leading-snug">{item.name}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group B: 👤 회원 전용 마이페이지 & 멤버십 기능 선택 */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <label className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                      <Cpu size={14} className="text-cyan-400" />
                      <span>👤 회원 전용 마이페이지 & 멤버십 엔진 (복수 선택 가능)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)", desc: "개인별 이력 및 진행 상태 확인" },
                        { name: "회원 등급제 엔진 (일반 / VIP / 파트너 혜택 구분)", desc: "회원 등급별 할인 및 혜택 차등" },
                        { name: "회원가입 축하 자동 쿠폰 & 포인트 적립", desc: "가입 즉시 자동 혜택 부여" },
                        { name: "카카오 알림톡 / SMS 본인 인증", desc: "휴대폰 번호 실명 및 봇 방지 인증" },
                      ].map((item) => {
                        const isChecked = reqAuthFeatures.includes(item.name);
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => {
                              if (isChecked) {
                                setReqAuthFeatures(reqAuthFeatures.filter((f) => f !== item.name));
                              } else {
                                setReqAuthFeatures([...reqAuthFeatures, item.name]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                              isChecked
                                ? "bg-cyan-500/20 border-cyan-400 ring-1 ring-cyan-400/40 text-cyan-100"
                                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                  DB Engine
                                </span>
                                {isChecked && <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />}
                              </div>
                              <p className="text-xs font-extrabold text-white leading-snug">{item.name}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">참고하고 싶은 레퍼런스 웹사이트 URL</label>
              <input
                type="url"
                value={reqRefUrl}
                onChange={(e) => setReqRefUrl(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300">요청 상세 내용 (자유 작성)</label>
              <textarea
                rows={4}
                value={reqDetail}
                onChange={(e) => setReqDetail(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-bold text-white focus:border-purple-500 focus:outline-none leading-relaxed"
                placeholder="원하시는 메인 메뉴 구성, 특별히 강조하고 싶은 서비스 내용 등을 자유롭게 작성해 주세요."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmittingReq}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black text-white hover:brightness-110 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
              >
                {isSubmittingReq ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                <span>🤖 AI 에이전트에 커스텀 제작 요청하기</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 4 (REMOVED: Assetization) --- */}
      {false && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Store size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">보유 커스텀 템플릿 자산</p>
              <p className="text-3xl font-black text-white">8개 브랜드 보유</p>
              <p className="text-xs font-medium text-amber-400">100% 템플릿화 모듈 등록 완료</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">템플릿 기반 원클릭 구축 수</p>
              <p className="text-3xl font-black text-white">총 1,240 회 개설</p>
              <p className="text-xs font-medium text-emerald-400">평균 구축 소요시간 1초</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <TrendingUp size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400">월 정기 유지보수 구독 수입</p>
              <p className="text-3xl font-black text-white">월 1,500 만원+</p>
              <p className="text-xs font-medium text-cyan-400">AI 전담 케어 구독 연동</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Award className="text-amber-400" /> 에이전시 파트너를 위한 커스텀 템플릿 리셀링 가이드
              </h2>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                제작된 커스텀 사이트를 나만의 템플릿 자산으로 등록하여, 클라이언트에게 1초 만에 복제·배포하고 월 30~50만 원의 유지보수 플랜을 판매하는 고수익 모델입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 1</span>
                <h4 className="text-sm font-bold text-white">1:1 커스텀 사이트 제작</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI 에이전트를 통해 완성도 높은 풀코드 커스텀 홈페이지를 1:1로 신속 제작합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 2</span>
                <h4 className="text-sm font-bold text-white">마켓플레이스 템플릿화</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  템플릿 레지스트리에 등록하여 신규 고객이 선택 시 1초 만에 자동 복제되도록 설정합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-amber-400">STEP 3</span>
                <h4 className="text-sm font-bold text-white">월 유지보수 정기 구독</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  블로그 포스팅과 기본 정보는 고객이 직접 수정하고, 디자인 개편은 AI가 전담 케어합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
  );
}
