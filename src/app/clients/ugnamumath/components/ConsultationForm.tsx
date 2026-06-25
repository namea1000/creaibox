"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    studentGrade: "중등 2학년",
    subject: "수학",
    type: "방문상담",
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

    if (!formData.parentName.trim()) {
      setErrorMsg("학부모 성함을 입력해주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("연락처를 입력해주세요.");
      return;
    }
    if (!formData.agree) {
      setErrorMsg("개인정보 수집 및 이용 동의에 체크해주세요.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        parentName: "",
        phone: "",
        studentGrade: "중등 2학년",
        subject: "수학",
        type: "방문상담",
        message: "",
        agree: false,
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Information Panel (Left) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 h-40 w-40 rounded-full bg-white/5 blur-xl" />
        
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
            ADMISSION CONSULTING
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
            개념의 힘을 기르는 <br />
            입학 및 상담 신청
          </h3>
          <p className="mt-4 text-xs font-bold leading-relaxed text-indigo-150">
            간단한 상담 정보를 남겨주시면 학원 전문 상담 실장이 연락을 드려 자녀에게 가장 알맞은 학습 배정 테스트 및 상담 일정을 안내해 드립니다.
          </p>
        </div>

        <ul className="space-y-6 my-10 text-xs font-bold">
          <li className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm border border-white/5">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-indigo-200 text-[10px] uppercase font-black tracking-widest">상담문의</p>
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-indigo-100 transition-colors text-sm font-extrabold">
                {COMPANY_INFO.phone}
              </a>
            </div>
          </li>
          <li className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm border border-white/5">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-indigo-200 text-[10px] uppercase font-black tracking-widest">학원 주소</p>
              <span className="text-sm font-extrabold leading-tight">
                {COMPANY_INFO.address}
              </span>
            </div>
          </li>
        </ul>

        <div className="text-[10px] font-black text-indigo-200/60 tracking-wider">
          {COMPANY_INFO.name} &middot; 천안 불당
        </div>
      </div>

      {/* Form Panel (Right) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative bg-white">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-16 flex-grow animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm mb-6">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
              입학 상담이 정상 접수되었습니다!
            </h4>
            <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-500 max-w-sm">
              어그나무학원을 믿고 신청해주셔서 감사드립니다. 남겨주신 연락처로 상담 실장이 신속히 연락을 드려 자녀의 개별 진단평가(레벨 테스트) 및 학습 로드맵 상담 예약을 조율해 드리겠습니다.
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
              {/* Parent Name */}
              <div className="space-y-1.5">
                <label htmlFor="parentName" className="text-xs font-black text-slate-700 tracking-wide">
                  학부모 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  required
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="학부모님 성함"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Student Grade */}
              <div className="space-y-1.5">
                <label htmlFor="studentGrade" className="text-xs font-black text-slate-700 tracking-wide">
                  자녀 학년
                </label>
                <select
                  id="studentGrade"
                  name="studentGrade"
                  value={formData.studentGrade}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="초등 3~4학년">초등 3~4학년</option>
                  <option value="초등 5~6학년">초등 5~6학년</option>
                  <option value="중등 1학년">중등 1학년</option>
                  <option value="중등 2학년">중등 2학년</option>
                  <option value="중등 3학년">중등 3학년</option>
                  <option value="고등 1학년">고등 1학년</option>
                  <option value="고등 2학년">고등 2학년</option>
                  <option value="고등 3학년">고등 3학년</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-black text-slate-700 tracking-wide">
                  상담 과목
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="수학">수학 집중반</option>
                  <option value="과학">과학 탐구반</option>
                  <option value="수학+과학">수학 + 과학 융합반</option>
                  <option value="국어/영어">국어 / 영어</option>
                  <option value="영재대비">특목/영재 입시반</option>
                </select>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label htmlFor="type" className="text-xs font-black text-slate-700 tracking-wide">
                  상담 방식
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="방문상담">학원 방문 상담</option>
                  <option value="전화상담">전화 상담</option>
                  <option value="레벨테스트">진단평가 예약</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-black text-slate-700 tracking-wide">
                상담 및 건의 내용
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="학생의 현재 진도 상황이나 특이사항, 질문 내용을 자유롭게 작성해주세요."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
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
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
              />
              <label htmlFor="agree" className="text-xs font-bold text-slate-500 leading-snug cursor-pointer">
                개인정보 수집 및 이용 동의 <span className="text-indigo-600 font-extrabold">(필수)</span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  남겨주신 소중한 상담 정보는 상담 통화 및 상담 예약을 위한 연락 용도 외 타 목적으로 활용하지 않습니다.
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-4 text-sm font-black tracking-wide text-white transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-98 disabled:bg-indigo-400 duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  상담 신청 접수 중...
                </>
              ) : (
                <>
                  <Send size={15} />
                  무료 입학상담 신청하기
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
