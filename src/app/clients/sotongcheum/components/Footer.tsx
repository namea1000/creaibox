"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { COMPANY_INFO } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-16 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand block */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 border border-blue-200 text-blue-600">
                <HeartHandshake className="h-4.5 w-4.5" />
              </div>
              <span className="text-md font-black tracking-tight text-slate-900">
                {COMPANY_INFO.name}
              </span>
            </Link>
            <p className="text-xs font-bold text-slate-500 max-w-sm leading-relaxed">
              공공행사부터 소규모 공동체 축제까지, 처음부터 끝까지 깔끔하게!
              힐링, 소통, 공감의 감성 교육 서비스와 행사 대행을 전문으로 합니다.
            </p>
          </div>

          {/* Quick links & Contact information */}
          <div className="flex flex-wrap gap-x-16 gap-y-8 text-xs font-bold text-slate-600">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">바로가기</p>
              <ul className="space-y-2.5">
                <li><Link href="/about" className="hover:text-blue-600 transition-colors">회사소개</Link></li>
                <li><Link href="/#business" className="hover:text-blue-600 transition-colors">사업영역</Link></li>
                <li><Link href="/#rental" className="hover:text-blue-600 transition-colors">행사렌탈</Link></li>
                <li><Link href="/#portfolio" className="hover:text-blue-600 transition-colors">실적갤러리</Link></li>
              </ul>
            </div>
            <div className="space-y-4 max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">고객센터</p>
              <ul className="space-y-2 text-slate-500 leading-relaxed font-semibold">
                <li>
                  <span className="font-bold text-slate-700">전화번호: </span>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-blue-600 transition-colors">{COMPANY_INFO.phone}</a>
                </li>
                <li>
                  <span className="font-bold text-slate-700">팩스번호: </span>
                  {COMPANY_INFO.fax}
                </li>
                <li>
                  <span className="font-bold text-slate-700">이메일: </span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-blue-600 transition-colors">{COMPANY_INFO.email}</a>
                </li>
                <li>
                  <span className="font-bold text-slate-700">사업자등록번호: </span>
                  {COMPANY_INFO.licenseNumber}
                </li>
                <li>
                  <span className="font-bold text-slate-700">주소: </span>
                  {COMPANY_INFO.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* copyright and legal */}
        <div className="mt-16 border-t border-slate-200/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <p>Powered by CreAIbox Custom Site</p>
        </div>
      </div>
    </footer>
  );
}
