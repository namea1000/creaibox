"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/common/SmartIntentLink";
import { Mail, MapPin, Phone, Sparkles, FileText, User } from "lucide-react";

export default function FuturemindCyanFooter() {
  const [siteConfig, setSiteConfig] = useState<{
    companyName?: string;
    phone?: string;
    address?: string;
    email?: string;
    fax?: string;
    ceoName?: string;
    bizNumber?: string;
  }>({
    companyName: "퓨처마인드 - AI로 세상과 연결합니다.",
    phone: "010-7900-7385",
    address: "충청남도 천안시 동남구 청수1로 96, 7층 713-A호",
    email: "master@futuremind.com",
    fax: "031-292-3994",
    ceoName: "박경덕",
    bizNumber: "681-29-01565",
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/clients/config?brandId=futuremind", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setSiteConfig((prev) => ({
              companyName: data.config.companyName || data.config.company_name || prev.companyName,
              phone: data.config.phone || prev.phone,
              address: data.config.address || prev.address,
              email: data.config.email || prev.email,
              fax: data.config.fax || prev.fax,
              ceoName: data.config.ceoName || data.config.ceo_name || prev.ceoName,
              bizNumber: data.config.bizNumber || data.config.biz_number || prev.bizNumber,
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load futuremind site config", e);
      }
    }
    loadConfig();
  }, []);

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 px-6 sm:px-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand Info */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://pub-4d5e9d40c2ef4eeb93a533aee9f1862d.r2.dev/client-sites/futuremind/logo-transparent.png"
              alt="futuremind"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-normal">
            AI로 세상과 연결합니다. 혁신적인 AI 교육, 맞춤형 개발, 그리고 전략 컨설팅을 통해 기업과 조직의 미래 성장을 가속화합니다.
          </p>
        </div>

        {/* Col 2: Core Services */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            핵심 서비스
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/education" className="hover:text-cyan-400 transition-colors">AI 교육 (Education)</Link></li>
            <li><Link href="/planning" className="hover:text-cyan-400 transition-colors">AI 기획 및 IP 로드맵</Link></li>
            <li><Link href="/development" className="hover:text-cyan-400 transition-colors">AI 시스템 및 챗봇 개발</Link></li>
            <li><Link href="/marketing" className="hover:text-cyan-400 transition-colors">90일 성장 마케팅</Link></li>
          </ul>
        </div>

        {/* Col 3: Association */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            협회 & 센터
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link href="/#work" className="hover:text-cyan-400 transition-colors">WE WORK & MISSION</Link></li>
            <li><Link href="/#association" className="hover:text-cyan-400 transition-colors">협회 소개</Link></li>
            <li><Link href="/#visiting-edu" className="hover:text-cyan-400 transition-colors">방문 교육</Link></li>
            <li><Link href="/#partners" className="hover:text-cyan-400 transition-colors">협력기관</Link></li>
            <li><Link href="/#contact" className="hover:text-cyan-400 transition-colors">상담 신청</Link></li>
          </ul>
        </div>

        {/* Col 4: Dynamic Customer Center & Location */}
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
            고객센터 & 위치
          </h5>
          <div className="space-y-2 text-xs text-neutral-300 font-mono">
            {siteConfig.phone && (
              <p className="flex items-center gap-1.5">
                <Phone size={13} className="text-cyan-400 flex-shrink-0" />
                <span>{siteConfig.phone}</span>
              </p>
            )}
            {siteConfig.email && (
              <p className="flex items-center gap-1.5">
                <Mail size={13} className="text-cyan-400 flex-shrink-0" />
                <span>{siteConfig.email}</span>
              </p>
            )}
            {siteConfig.address && (
              <p className="flex items-start gap-1.5 leading-snug">
                <MapPin size={13} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </p>
            )}
          </div>
          <div className="pt-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-sm text-xs font-black transition-colors shadow-md shadow-cyan-500/20"
            >
              <Sparkles size={13} />
              <span>무료 컨설팅 신청</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Dynamic Legal & Business Information Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-800/80 text-xs text-neutral-400 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-neutral-400 font-mono text-[11px]">
          <span>상호명: {siteConfig.companyName}</span>
          {siteConfig.ceoName && <span>대표자: {siteConfig.ceoName}</span>}
          {siteConfig.bizNumber && <span>사업자등록번호: {siteConfig.bizNumber}</span>}
          {siteConfig.phone && <span>대표전화: {siteConfig.phone}</span>}
          {siteConfig.fax && <span>팩스: {siteConfig.fax}</span>}
          {siteConfig.email && <span>이메일: {siteConfig.email}</span>}
          {siteConfig.address && <span>사업장 소재지: {siteConfig.address}</span>}
        </div>
        <div className="text-center text-[11px] text-neutral-500 font-mono">
          &copy; {new Date().getFullYear()} {siteConfig.companyName || "미래교육문화협회 (퓨처마인드)"}. All rights reserved. Powered by CreaiBox.
        </div>
      </div>
    </footer>
  );
}
