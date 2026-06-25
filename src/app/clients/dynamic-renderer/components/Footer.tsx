import React from "react";
import { MapPin, Phone, Clock, Globe } from "lucide-react";

interface FooterProps {
  companyName: string;
  phone?: string;
  address?: string;
  extraConfigs?: any;
}

export default function Footer({ companyName, phone, address, extraConfigs = {} }: FooterProps) {
  const businessNumber = extraConfigs.business_number || "";
  const repName = extraConfigs.representative_name || "";
  const workingHours = extraConfigs.working_hours || "평일 09:00 - 18:00 (주말/공휴일 휴무)";
  
  // SNS links
  const sns = extraConfigs.sns_links || {};
  const blogLink = sns.naver_blog || "";
  const instagramLink = sns.instagram || "";
  const youtubeLink = sns.youtube || "";

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <span className="text-lg font-bold text-white tracking-tight block mb-4">
              {companyName}
            </span>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
              저희는 최상의 가치와 차별화된 서비스를 제공하기 위해 언제나 최선을 다하고 있습니다. 
              문의사항이 있으시면 언제든지 편하게 연락해 주세요.
            </p>
            {/* SNS Links */}
            <div className="flex gap-4">
              {blogLink && (
                <a
                  href={blogLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  네이버 블로그
                </a>
              )}
              {instagramLink && (
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  인스타그램
                </a>
              )}
              {youtubeLink && (
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  유튜브
                </a>
              )}
            </div>
          </div>

          {/* Contact Col */}
          <div>
            <span className="text-sm font-semibold text-white tracking-wider uppercase block mb-4">
              연락처 및 위치
            </span>
            <ul className="space-y-3 text-sm">
              {phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--primary)] flex-shrink-0" />
                  <span>{phone}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                  <span>{address}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--primary)] flex-shrink-0" />
                <span>{workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Business Info Col */}
          <div>
            <span className="text-sm font-semibold text-white tracking-wider uppercase block mb-4">
              사업자 정보
            </span>
            <ul className="space-y-2 text-sm text-slate-400">
              {repName && (
                <li>
                  <span className="text-slate-500 mr-2">대표자</span> {repName}
                </li>
              )}
              {businessNumber && (
                <li>
                  <span className="text-slate-500 mr-2">사업자등록번호</span> {businessNumber}
                </li>
              )}
              <li>
                <span className="text-slate-500 mr-2">호스팅제공</span> CreAIbox
              </li>
            </ul>
          </div>
        </div>

        {/* Copy Line */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {companyName}. All Rights Reserved. Built with CreAIbox.</p>
        </div>
      </div>
    </footer>
  );
}
