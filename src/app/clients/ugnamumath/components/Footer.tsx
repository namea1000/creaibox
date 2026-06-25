"use client";

import React from "react";
import Link from "next/link";
import { Trees, Phone, MapPin, Globe } from "lucide-react";
import { COMPANY_INFO, ACADEMY_BRANCHES } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand block */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Trees className="h-4.5 w-4.5" />
              </div>
              <span className="text-md font-black tracking-tight text-white">
                {COMPANY_INFO.name}
              </span>
            </Link>
            <p className="text-xs font-semibold text-slate-400 max-w-sm leading-relaxed">
              생각의 뿌리를 깊게, 수학·과학의 나무를 곧게 세우는 천안 불당 수학·과학 전문 학원입니다. 
              체계적인 3개 관 맞춤 지도로 꿈을 현실로 만듭니다.
            </p>
            {/* Band Link Button */}
            <div className="pt-2">
              <a
                href={COMPANY_INFO.bandUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2db400]/10 border border-[#2db400]/20 hover:bg-[#2db400]/20 px-4 py-2.5 text-xs font-black text-[#2db400] transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-[#2db400] animate-pulse" />
                공식 네이버 밴드 바로가기 &rarr;
              </a>
            </div>
          </div>

          {/* Quick links & Licenses */}
          <div className="flex flex-wrap gap-x-16 gap-y-8 text-xs font-bold">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">바로가기</p>
              <ul className="space-y-2.5">
                <li><Link href="/about" className="hover:text-white transition-colors">학원소개</Link></li>
                <li><Link href="/#branches" className="hover:text-white transition-colors">3개관 안내</Link></li>
                <li><Link href="/#curriculum" className="hover:text-white transition-colors">교육과정</Link></li>
                <li><Link href="/#achievements" className="hover:text-white transition-colors">입시실적</Link></li>
              </ul>
            </div>
            <div className="space-y-4 max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">학원 정보 및 주소</p>
              <ul className="space-y-2.5 text-slate-450 leading-relaxed font-semibold">
                <li>
                  <span className="font-bold text-slate-300">대표전화: </span>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors">{COMPANY_INFO.phone}</a>
                </li>
                <li>
                  <span className="font-bold text-slate-300">학원 주소: </span>
                  {COMPANY_INFO.address}
                </li>
                <li className="pt-2 border-t border-slate-800 text-[11px] space-y-1.5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">설립·운영 등록번호</p>
                  {ACADEMY_BRANCHES.map((b) => (
                    <p key={b.id} className="text-slate-400">
                      &middot; {b.name}: <span className="text-slate-350">{b.licenseNumber}</span>
                    </p>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* copyright */}
        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
          <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <p>Powered by CreAibox Academic Platform</p>
        </div>
      </div>
    </footer>
  );
}
