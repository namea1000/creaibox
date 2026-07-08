"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Send, MessageSquare, Phone, 
  Mail, HelpCircle, FileText, CheckCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

// 🌟 대분류 및 중분류 카테고리 정의 (카카오 비즈센터 대응 + 기타 문의 추가)
const MAIN_CATEGORIES = [
  { id: "account", label: "가입 및 이용문의" },
  { id: "video", label: "비디오 스튜디오" },
  { id: "ai", label: "AI 생성 스튜디오" },
  { id: "billing", label: "결제 및 환불" },
  { id: "suggestion", label: "제안 및 건의" },
  { id: "other", label: "기타 문의" }
] as const;

const SUB_CATEGORIES: Record<string, string[]> = {
  account: ["가입 및 탈퇴", "로그인 및 인증", "내 정보 수정 및 관리", "기타 계정 문의"],
  video: ["동영상 편집/자르기", "자막 및 오디오 삽입", "역재생/배속 오류", "내보내기(렌더링) 지연", "기타 비디오 편집 문의"],
  ai: ["AI 이미지 품질", "AI 음악 생성 라이선스", "크레딧 차감 문의", "기타 AI 생성 문의"],
  billing: ["구독 플랜 결제 오류", "영수증 및 계산서 발행", "환불 규정 및 승인 요청", "기타 결제/환불 문의"],
  suggestion: ["신규 기능 제안", "사이트 속도/성능 개선", "제휴 및 대량 구매 제안", "기타 제안/건의 사항"],
  other: ["기타 일반 문의 사항"]
};

export default function HelpInquiryPage() {
  const router = useRouter();
  
  // 유저 세션 및 폼 상태
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 이중 드롭다운 전용 상태
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    title: "",
    content: "",
    agree: false,
  });

  // Supabase 세션 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          setUserEmail(user.email);
        }
      } catch (e) {
        console.error("Auth fetch error:", e);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      alert("회신받으실 이메일 주소를 입력해 주세요.");
      return;
    }
    if (!mainCategory || !subCategory) {
      alert("문의 분류의 대분류와 소분류 카테고리를 모두 선택해 주세요.");
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("문의 제목과 상세 내용을 모두 입력해 주세요.");
      return;
    }
    if (!formData.agree) {
      alert("개인정보 수집 및 이용 방침에 동의해 주셔야 접수가 가능합니다.");
      return;
    }

    setLoading(true);
    try {
      const categoryLabel = MAIN_CATEGORIES.find(c => c.id === mainCategory)?.label || mainCategory;
      const finalCategory = `${categoryLabel} > ${subCategory}`;

      const response = await fetch("/api/customer/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          phone: formData.phone,
          category: finalCategory,
          title: formData.title,
          content: formData.content,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("1:1 접수가 완료되었습니다. 등록하신 이메일로 답변 알림이 발송되며, [내 문의 확인] 메뉴에서도 실시간 진행 상태를 열람하실 수 있습니다.");
        router.push("/help/my-qna");
      } else {
        alert(`접수 실패: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 dark:bg-[#06080d] dark:text-slate-100 pt-20 overflow-hidden relative transition-colors duration-300">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10 space-y-6">
        
        {/* 브레드크럼 및 제목 */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/help")}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={14} /> 도움말 센터로 돌아가기
          </button>
          
          <div className="border-b border-slate-200 dark:border-slate-850 pb-6 space-y-2">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              문의하기
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-450 font-bold leading-relaxed">
              크리에이박스 플랫폼 사용 중의 기술적 불편 사항 접수 또는 기능 개선안을 자유롭게 게시해 주세요.
            </p>
          </div>
        </div>

        {/* 문의 작성 보드 (카카오 비즈센터 스타일의 게시판 폼 구조) */}
        <div className="bg-white dark:bg-[#0b0f19]/80 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">문의/건의 접수 대장</h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">필수 정보 기재 후 등록 단추를 눌러주세요.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. 문의 분류 선택 (이중 셀렉트 박스 콘솔) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                문의 분류 <span className="text-red-500 font-black">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1차 대분류 */}
                <select
                  value={mainCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMainCategory(val);
                    if (val === "other") {
                      setSubCategory("기타 일반 문의 사항");
                    } else {
                      setSubCategory(""); // 대분류 변경 시 소분류 초기화
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 transition shadow-inner cursor-pointer"
                >
                  <option value="">대분류를 선택해 주세요.</option>
                  {MAIN_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                {/* 2차 소분류 */}
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!mainCategory}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 transition shadow-inner cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">소분류를 선택해 주세요.</option>
                  {mainCategory && SUB_CATEGORIES[mainCategory]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* 2. 회신 이메일 주소 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                회신 이메일 주소 <span className="text-red-500 font-black">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="답변 알림을 받으실 메일 주소를 입력하세요"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-550/5 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold leading-relaxed pl-1">
                * 회원님의 로그인 이메일로 자동 기입되어 있습니다. 다른 이메일 주소로 답변 받기를 희망하시는 경우 직접 변경해 주세요.
              </p>
            </div>

            {/* 3. 연락처 번호 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                휴대폰 번호 <span className="text-slate-400 font-bold">(선택)</span>
              </label>
              <input
                type="tel"
                placeholder="예: 010-1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-550/5 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>

            {/* 4. 문의 제목 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                문의 제목 <span className="text-red-500 font-black">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="문의 내용을 잘 나타내는 요약 제목을 입력하세요 (40자 이내)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-550/5 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>

            {/* 5. 상세 내용 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                문의 내용 <span className="text-red-500 font-black">*</span>
              </label>
              <textarea
                rows={6}
                required
                placeholder="문의하실 장애 현상이나 에러 메시지, 혹은 희망하는 새로운 AI 도구에 대한 개선 제안 사항을 명확히 작성해 주세요."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-550/5 dark:bg-slate-950/40 text-slate-900 dark:text-white px-4 py-3.5 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner resize-none leading-relaxed"
              />
            </div>

            {/* 💾 카카오 비즈센터 스타일: 개인정보 수집·이용 동의 안내 보드 */}
            <div className="p-5 md:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* 원형 라디오 체크박스 클릭 영역 (터치 영역 대폭 강화) */}
              <div 
                onClick={() => setFormData({ ...formData, agree: !formData.agree })}
                className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 cursor-pointer select-none group"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  formData.agree
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-950 group-hover:border-blue-400"
                }`}>
                  {formData.agree && (
                    <span className="text-[10px] font-black">✓</span>
                  )}
                </div>
                <span className="text-xs md:text-sm font-black text-slate-850 dark:text-white">
                  (필수) 개인정보 수집·이용에 대한 안내
                </span>
              </div>

              {/* 3열 구조 표 (Table) */}
              <div className="w-full overflow-x-auto pt-1">
                <table className="w-full text-center text-[10px] md:text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-950/60 border-t border-b border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 font-bold">
                      <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800 w-1/3">수집항목</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-800 w-1/3">수집목적</th>
                      <th className="py-2.5 px-3 w-1/3">보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-slate-900/10 border-b border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-bold">
                      <td className="py-3 px-3 border-r border-slate-200 dark:border-slate-800 leading-relaxed">
                        이메일 주소, 휴대폰 번호
                      </td>
                      <td className="py-3 px-3 border-r border-slate-200 dark:border-slate-800 leading-relaxed">
                        문의·요청·불편사항 확인 <br className="hidden md:inline" />및 처리결과 회신
                      </td>
                      <td className="py-3 px-3 font-black text-slate-950 dark:text-white leading-relaxed">
                        3년간 보관 후 지체없이 파기
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 안내 추가 문구 및 개인정보처리방침 링크 */}
              <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                위 동의를 거부할 권리가 있으며, 동의를 거부하실 경우 문의 처리 및 결과 회신이 제한됩니다. 
                요구하지 않은 개인정보는 입력하지 않도록 주의해 주세요. <br className="hidden md:inline" />
                더 자세한 내용에 대해서는 {" "}
                <a 
                  href="/privacy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-650 dark:text-blue-400 underline font-black hover:text-blue-500 transition-colors"
                >
                  개인정보처리방침
                </a>
                을 참고하시기 바랍니다.
              </p>

            </div>

            {/* 접수 버튼 (그라데이션 제거 ➔ 카카오 옐로우 솔리드 버튼 / 미동의 시 비활성화) */}
            <button
              type="submit"
              disabled={loading || !formData.agree}
              className="w-full py-4 rounded-xl bg-[#fee500] hover:bg-[#ebd300] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-450 dark:disabled:text-slate-500 text-[#191919] font-black text-xs md:text-sm shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>문의를 접수하는 중입니다...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>문의접수</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>
      <Footer />
    </div>
  );
}
