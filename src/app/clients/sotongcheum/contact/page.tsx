"use client";

import React from "react";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600">
            ONLINE INQUIRY
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            견적 및 교육 상담 문의
          </h1>
          <p className="mt-4 text-sm text-slate-500 font-semibold leading-relaxed">
            행사기획, 렌탈, 감성체험 교육 등에 대한 문의사항을 남겨주시면 <br />
            전문 기획자가 정성을 다해 상세히 상담해 드리겠습니다.
          </p>
        </div>

        {/* Contact Form Container */}
        <div className="mx-auto max-w-4xl">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
