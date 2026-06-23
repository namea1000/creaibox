"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "행사기획",
    date: "",
    budget: "",
    message: "",
    agree: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agree: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg("성함 또는 회사명을 입력해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("연락처를 입력해주세요.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("이메일 주소를 입력해주세요.");
      return;
    }
    if (!formData.agree) {
      setErrorMsg("개인정보 수집 및 이용 동의에 체크해주세요.");
      return;
    }

    // Submit Action Simulation
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        type: "행사기획",
        date: "",
        budget: "",
        message: "",
        agree: false,
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Contact Card Info (Left) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 h-40 w-40 rounded-full bg-white/5 blur-xl" />
        
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
            CONTACT US
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
            처음부터 끝까지 깔끔하게, <br className="hidden sm:inline" />
            무료 컨설팅 받기
          </h3>
          <p className="mt-4 text-xs font-bold leading-relaxed text-blue-100/90">
            행사 성격, 대상 연령대, 교육 테마 등에 맞춤화된 무료 컨설팅과 견적을 지원해 드립니다. 지금 신청해보세요!
          </p>
        </div>

        <ul className="space-y-6 my-10 text-xs font-bold">
          <li className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm border border-white/5">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-blue-200 text-[10px] uppercase font-black tracking-widest">대표전화</p>
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-blue-100 transition-colors text-sm font-extrabold">
                {COMPANY_INFO.phone}
              </a>
            </div>
          </li>
          <li className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm border border-white/5">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-blue-200 text-[10px] uppercase font-black tracking-widest">이메일</p>
              <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-blue-100 transition-colors text-sm font-extrabold">
                {COMPANY_INFO.email}
              </a>
            </div>
          </li>
          <li className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm border border-white/5">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-blue-200 text-[10px] uppercase font-black tracking-widest">본사 주소</p>
              <span className="text-sm font-extrabold leading-tight">
                {COMPANY_INFO.address}
              </span>
            </div>
          </li>
        </ul>

        <div className="text-[10px] font-black text-blue-200/60 tracking-wider">
          {COMPANY_INFO.name}
        </div>
      </div>

      {/* Form Area (Right) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative bg-white">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-16 flex-grow animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm mb-6">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
              견적 문의가 정상 접수되었습니다!
            </h4>
            <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 max-w-sm">
              소통과 채움을 찾아주셔서 감사드립니다. 남겨주신 연락처로 담당 기획자가 24시간 이내에 신속히 연락드리겠습니다.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="mt-8 rounded-xl border border-slate-200 px-6 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
              추가 문의하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-black text-slate-700 tracking-wide">
                  성함 / 단체명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동 (또는 단체명)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-black text-slate-700 tracking-wide">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-black text-slate-700 tracking-wide">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label htmlFor="type" className="text-xs font-black text-slate-700 tracking-wide">
                  문의 유형
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="행사기획">공공행사 및 축제 기획</option>
                  <option value="교육서비스">힐링 및 소통 감성 체험 교육</option>
                  <option value="가족캠프">가족 힐링 캠프 프로그램</option>
                  <option value="시스템렌탈">행사 장비 렌탈 (음향/무대/천막 등)</option>
                  <option value="기타">기타 맞춤 행사 문의</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-1.5">
                <label htmlFor="date" className="text-xs font-black text-slate-700 tracking-wide">
                  행사 희망 일자
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label htmlFor="budget" className="text-xs font-black text-slate-700 tracking-wide">
                  대략적인 예산 범위
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="예: 500만원 내외 (또는 미정)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-black text-slate-700 tracking-wide">
                세부 의뢰 내용
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="행사 성격, 대상 연령, 필요한 렌탈 품목 등 세부 요구사항을 자유롭게 기재해주세요."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Agreement check */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={formData.agree}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <label htmlFor="agree" className="text-xs font-bold text-slate-500 leading-snug cursor-pointer">
                개인정보 수집 및 이용 동의 <span className="text-blue-600 font-extrabold">(필수)</span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  남겨주신 소중한 상담 정보는 견적 제공 및 컨설팅 연락 외 타 용도로 절대 사용되지 않습니다.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-xs font-extrabold text-red-500 mt-2">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-sm font-black tracking-wide text-white transition-all shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-98 disabled:bg-blue-400 duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  문의 접수 중...
                </>
              ) : (
                <>
                  <Send size={15} />
                  무료 컨설팅 신청하기
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
