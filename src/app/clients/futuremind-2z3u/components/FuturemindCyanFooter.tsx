import React from "react";
import Link from "@/components/common/SmartIntentLink";
import { Mail, MapPin, Sparkles } from "lucide-react";

export default function FuturemindCyanFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 sm:px-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Col 1 */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/logo-transparent.png"
              alt="futuremind"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            AI로 세상과 연결합니다. 혁신적인 AI 교육, 맞춤형 개발, 그리고 전략 컨설팅을 통해 기업과 조직의 미래 성장을 가속화합니다.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-neutral-200">
            핵심 서비스
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/education" className="hover:text-cyan-400 transition-colors">AI 교육 (Education)</Link></li>
            <li><Link href="/planning" className="hover:text-cyan-400 transition-colors">AI 기획 및 IP 로드맵</Link></li>
            <li><Link href="/development" className="hover:text-cyan-400 transition-colors">AI 시스템 및 챗봇 개발</Link></li>
            <li><Link href="/marketing" className="hover:text-cyan-400 transition-colors">90일 성장 마케팅</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-neutral-200">
            협회 & 센터
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/work" className="hover:text-cyan-400 transition-colors">WE WORK & MISSION</Link></li>
            <li><Link href="/#partners" className="hover:text-cyan-400 transition-colors">협력기관</Link></li>
            <li><Link href="/#cases" className="hover:text-cyan-400 transition-colors">성공 사례</Link></li>
            <li><Link href="/#contact" className="hover:text-cyan-400 transition-colors">상담 신청</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-neutral-200">
            고객센터 & 위치
          </h5>
          <div className="space-y-2 text-xs text-neutral-400 font-mono">
            <p className="flex items-center gap-1.5"><Mail size={13} className="text-cyan-400" /> contact@futuremind.kr</p>
            <p className="flex items-center gap-1.5"><MapPin size={13} className="text-cyan-400" /> 충남 천안시 동남구 청수1로 96, 7층</p>
          </div>
          <div className="pt-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-lg text-xs font-black transition-colors"
            >
              <Sparkles size={13} />
              <span>무료 컨설팅 신청</span>
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center text-xs text-neutral-400 border-t border-neutral-800/80 pt-8 font-mono">
        &copy; {new Date().getFullYear()} 미래교육문화협회 (퓨처마인드). All rights reserved. Powered by CreaiBox.
      </div>
    </footer>
  );
}
