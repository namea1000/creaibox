import React from "react";
import Link from "next/link";
import { Sparkles, Mail, ShieldCheck, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black">
                <Sparkles size={16} />
              </div>
              <span className="text-base font-black text-white">
                CreativeMedia <span className="text-cyan-400">BLOG</span>
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium max-w-md">
              크리에이티브 미디어 블로그 V1은 AI, IT 기술, 디지털 UI/UX 디자인, 글로벌 트렌드 및 그로스 마케팅 전문 미디어 포털입니다. 독창적인 지식과 최신 기술 뉴스를 매일 전합니다.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck size={13} /> DoFollow SEO Ready</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400"><Globe size={13} /> CreAibox Engine Powered</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">카테고리</h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#articles" className="hover:text-cyan-400 transition-colors">AI & 자율 에이전트</a></li>
              <li><a href="#articles" className="hover:text-cyan-400 transition-colors">디자인 & UI/UX 트렌드</a></li>
              <li><a href="#articles" className="hover:text-cyan-400 transition-colors">그로스 마케팅 전략</a></li>
              <li><a href="#ranking" className="hover:text-cyan-400 transition-colors">실시간 인기 아티클</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">미디어 센터 정보</h4>
            <div className="space-y-1.5 font-medium text-slate-300">
              <p>발행처: 크리에이티브 미디어 랩</p>
              <p>이메일: contact@creativemedia.com</p>
              <p>제휴/기고 문의: media@creativemedia.com</p>
              <p>주소: 서울특별시 강남구 테헤란로 456 크리에이티브 타워 12층</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© 2026 CreativeMedia Blog. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">이용약관</a>
            <a href="#" className="hover:text-white font-bold text-cyan-400">개인정보처리방침</a>
            <a href="#" className="hover:text-white">이메일무단수집거부</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
