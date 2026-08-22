import React from "react";
import Link from "@/components/common/SmartIntentLink";
import { Sparkles, MapPin, Mail, Phone, ExternalLink } from "lucide-react";

const PARTNERS = [
  "호서대학교",
  "한국콘텐츠진흥원",
  "통일부",
  "충청남도",
  "소상공인시장진흥공단",
  "백석문화대학교",
  "백석대학교",
  "단국대학교",
  "남서울대학교",
  "충남창업보육협회",
  "백석메이커스",
];

export default function FuturemindFooter() {
  return (
    <footer className="w-full bg-[#04060b] border-t border-cyan-950/60 text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
        
        {/* Partner Logos Bar */}
        <div className="space-y-4 border-b border-white/5 pb-10">
          <span className="text-[11px] font-mono font-bold text-cyan-400/80 uppercase tracking-widest block text-center sm:text-left">
            TRUSTED PARTNERS & COLLABORATIONS
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
            {PARTNERS.map((partner, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-cyan-500/40 hover:text-white transition-all shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Brand & Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xs">
                MI
              </div>
              <span className="text-base font-black text-white tracking-tight">
                미래교육문화협회 (퓨처마인드)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              4차 산업혁명 시대에 맞춰 교육과 문화의 융합을 통해 미래 인재를 양성하고, 기술과 창의성을 결합한 다양한 프로그램을 운영하는 비영리 단체 및 비즈니스 파트너입니다.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 text-cyan-400">
              핵심 솔루션
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/education" className="hover:text-white transition-colors">AI 실무 & 세대별 교육</Link></li>
              <li><Link href="/planning" className="hover:text-white transition-colors">IP 로드맵 & 바우처 기획</Link></li>
              <li><Link href="/development" className="hover:text-white transition-colors">AI 웹/앱 & 챗봇 개발</Link></li>
              <li><Link href="/marketing" className="hover:text-white transition-colors">90일 인플루언서 제휴</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 text-cyan-400">
              체험 프로그램
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-400">어울림 메이커스 힐링캠프</span></li>
              <li><span className="text-slate-400">이동형 4차산업 체험버스</span></li>
              <li><span className="text-slate-400">드론 / VR / 로봇 워크숍</span></li>
              <li><span className="text-slate-400">공공기관 입찰 100% 지원</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 text-cyan-400">
              문의처
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400 font-mono">
              <p className="flex items-center gap-1.5"><Mail size={13} className="text-cyan-400" /> contact@futuremind.kr</p>
              <p className="flex items-center gap-1.5"><MapPin size={13} className="text-cyan-400" /> 충청남도 천안시 동남구 청수1로 96, 7층</p>
              <p className="text-[11px] text-slate-500 pt-1">실습장: 충남 천안시 백석대학로 1, 어울림 메이커스 3층</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            대표: 박경덕 | 상호: 미래교육문화협회 (퓨처마인드) | 사업자정보확인
          </div>
          <div>
            © {new Date().getFullYear()} Futuremind. All rights reserved. Powered by CreaiBox.
          </div>
        </div>
      </div>
    </footer>
  );
}
