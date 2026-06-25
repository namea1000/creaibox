"use client";

import React from "react";
import ConsultationForm from "../components/ConsultationForm";

export default function ContactPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Intro header */}
        <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
            ONLINE CONSULTATION
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            입학 상담 및 레벨테스트 신청
          </h1>
          <p className="mt-4 text-sm text-slate-500 font-semibold leading-relaxed">
            학생의 학년과 희망과목 등 간단한 정보를 남겨주시면 <br />
            전문 학습 컨설턴트가 24시간 내에 연락을 드려 자녀의 개별 입학 진단을 도와드립니다.
          </p>
        </div>

        {/* Consultation Form Wrapper */}
        <div className="mx-auto max-w-4xl">
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
}
