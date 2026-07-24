import React from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#E8E5E0] pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#A8B5A0] flex items-center justify-center text-white font-black">
                <Leaf size={16} />
              </div>
              <span className="text-xl font-serif text-white font-semibold">
                Aura Merino
              </span>
            </div>
            <p className="text-[#AAA] leading-relaxed font-medium max-w-md">
              Aura Merino(아우라 메리노)는 천연 메리노 울과 도심형 기능성을 결합한 프리미엄 수제 스니커즈 브랜드입니다. 자연이 준 선물인 최고의 소재로 타협 없는 편안함과 지속 가능한 라이프스타일을 선도합니다.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#AAA] font-bold">
              <span className="flex items-center gap-1 text-[#A8B5A0]"><ShieldCheck size={13} /> DoFollow SEO Ready</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white"><Globe size={13} /> CreAibox Shopping Template</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">쇼핑 네비게이션</h4>
            <ul className="space-y-2 font-medium text-[#AAA]">
              <li><a href="#products" className="hover:text-white transition-colors">신상품 스니커즈</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">브랜드 스토리</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">천연 울 특장점</a></li>
              <li><a href="#blog" className="hover:text-[#A8B5A0] transition-colors">트렌드 블로그</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">고객 센터</h4>
            <div className="space-y-1.5 font-medium text-[#AAA]">
              <p>대표전화: 1588-4920</p>
              <p>운영시간: 평일 09:00 - 18:00</p>
              <p>이메일: support@auramerino.com</p>
              <p>주소: 서울특별시 성수이로 88 아우라 메리노 쇼룸</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#333] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#888]">
          <p>© 2026 Aura Merino. Crafted with care for people and planet.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">이용약관</a>
            <a href="#" className="hover:text-white font-bold text-[#A8B5A0]">개인정보처리방침</a>
            <a href="#" className="hover:text-white">환불정책</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
