import React from "react";
import Link from "@/components/common/SmartIntentLink";
import { Flame, Mail, MapPin } from "lucide-react";

export default function Futuremind2Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 sm:px-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* Brand Col */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f95700] flex items-center justify-center text-white">
              <Flame size={16} className="fill-white" />
            </div>
            <span className="text-base font-black text-white tracking-tight">
              futuremind
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Enterprise AI Agents & Transformation Platform on Vercel AI Cloud.
          </p>
        </div>

        {/* Col 1 */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-neutral-200">
            핵심 솔루션
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/education" className="hover:text-[#f95700] transition-colors">AI 실무 교육</Link></li>
            <li><Link href="/planning" className="hover:text-[#f95700] transition-colors">IP 로드맵 기획</Link></li>
            <li><Link href="/development" className="hover:text-[#f95700] transition-colors">AI 챗봇 개발</Link></li>
            <li><Link href="/marketing" className="hover:text-[#f95700] transition-colors">90일 마케팅</Link></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-neutral-200">
            협회 & 센터
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/work" className="hover:text-[#f95700] transition-colors">WE WORK</Link></li>
            <li><Link href="/#partners" className="hover:text-[#f95700] transition-colors">협력기관</Link></li>
            <li><Link href="/#case_studies" className="hover:text-[#f95700] transition-colors">성공 사례</Link></li>
            <li><Link href="/#contact" className="hover:text-[#f95700] transition-colors">상담 신청</Link></li>
          </ul>
        </div>

        {/* Col 3: CTA Box */}
        <div className="col-span-2 space-y-4">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-2 text-neutral-200">
            Contact
          </h5>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Ready to build production-grade AI systems & education?
          </p>
          <div className="space-y-1.5 text-xs text-neutral-400 font-mono pb-2">
            <p className="flex items-center gap-1.5"><Mail size={13} className="text-[#f95700]" /> contact@futuremind.kr</p>
            <p className="flex items-center gap-1.5"><MapPin size={13} className="text-[#f95700]" /> 충남 천안시 동남구 청수1로 96, 7층</p>
          </div>
          <Link
            href="/#contact"
            className="inline-block px-5 py-2.5 bg-[#f95700] hover:bg-[#ea4e00] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-orange-500/20"
          >
            TALK TO AN ARCHITECT
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center text-xs text-neutral-400 border-t border-neutral-800/80 pt-8 font-mono">
        &copy; {new Date().getFullYear()} 미래교육문화협회 (퓨처마인드). All rights reserved. Powered by CreaiBox.
      </div>
    </footer>
  );
}
