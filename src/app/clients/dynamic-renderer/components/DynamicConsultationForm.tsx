"use client";

import React, { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface DynamicConsultationFormProps {
  siteId: string;
  title: string;
  subtitle: string;
  fields?: string[];
  buttonText?: string;
}

export default function DynamicConsultationForm({
  siteId,
  title,
  subtitle,
  fields = ["name", "phone", "message"],
  buttonText = "상담 신청하기"
}: DynamicConsultationFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Simple validation
    if (fields.includes("name") && !formData.name?.trim()) {
      setErrorMsg("이름/성함을 입력해 주세요.");
      setLoading(false);
      return;
    }
    if (fields.includes("phone") && !formData.phone?.trim()) {
      setErrorMsg("연락처를 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/client-site-builder/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          siteId,
          formData,
          fields
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "상담 신청에 실패했습니다.");
      }

      setSubmitted(true);
      setFormData({});
    } catch (err: any) {
      setErrorMsg(err.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-emerald-100 rounded-3xl p-8 md:p-12 text-center shadow-lg max-w-lg mx-auto animate-fade-in-up">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
          <CheckCircle size={36} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">신청이 완료되었습니다!</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          보내주신 상담 신청 내역이 정상적으로 접수되었습니다. <br />
          담당자가 신속하게 확인하여 기재해주신 연락처로 연락드리겠습니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-bold text-[var(--primary)] hover:underline"
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  // Helper labels
  const fieldLabels: Record<string, { label: string; placeholder: string; type: string; options?: string[] }> = {
    name: { label: "신청인 이름", placeholder: "이름 또는 학부모 성함을 입력하세요", type: "text" },
    phone: { label: "연락처", placeholder: "'-' 없이 전화번호만 입력하세요", type: "tel" },
    email: { label: "이메일 주소", placeholder: "example@email.com", type: "email" },
    grade: {
      label: "자녀 학년/대상",
      placeholder: "학년을 선택해 주세요",
      type: "select",
      options: ["초등 1~3학년", "초등 4~6학년", "중학교 1학년", "중학교 2학년", "중학교 3학년", "고등 1학년", "고등 2학년", "고등 3학년/N수생", "해당 없음"]
    },
    subject: {
      label: "상담 희망 과목",
      placeholder: "과목을 선택해 주세요",
      type: "select",
      options: ["수학 집중반", "과학 집중반", "수학+과학 종합반", "입시/진로 컨설팅", "대관/단체 예약 문의", "기타 문의"]
    },
    guests: { label: "예약 인원", placeholder: "방문 예정 또는 대관 예약 인원수", type: "number" },
    date: { label: "희망 일시", placeholder: "", type: "date" },
    message: { label: "상세 문의 내용", placeholder: "궁금하신 점이나 전하실 말씀을 자유롭게 적어주세요", type: "textarea" }
  };

  return (
    <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 p-8 md:p-12 rounded-3xl" style={{ borderRadius: "var(--border-radius)" }}>
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm text-slate-500 font-semibold leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((fKey) => {
            const spec = fieldLabels[fKey];
            if (!spec) return null;

            const isFullWidth = fKey === "message" || fKey === "date";

            return (
              <div key={fKey} className={`flex flex-col gap-1.5 ${isFullWidth ? "sm:col-span-2" : ""}`}>
                <label className="text-xs font-bold text-slate-700 tracking-wide">
                  {spec.label}
                  {["name", "phone"].includes(fKey) && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {spec.type === "textarea" ? (
                  <textarea
                    name={fKey}
                    rows={4}
                    required={["name", "phone"].includes(fKey)}
                    placeholder={spec.placeholder}
                    value={formData[fKey] || ""}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-900 border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                ) : spec.type === "select" ? (
                  <select
                    name={fKey}
                    required={["name", "phone"].includes(fKey)}
                    value={formData[fKey] || ""}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-900 border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  >
                    <option value="">{spec.placeholder}</option>
                    {spec.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={spec.type}
                    name={fKey}
                    required={["name", "phone"].includes(fKey)}
                    placeholder={spec.placeholder}
                    value={formData[fKey] || ""}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-900 border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                )}
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-rose-500 text-center bg-rose-50 rounded-xl p-3 border border-rose-100">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
          style={{ borderRadius: "var(--border-radius)" }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>전송 중...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
