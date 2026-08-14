"use client";

import React, { useState } from "react";
import { MapPin, Phone, Clock, Copy, Check, Navigation, ExternalLink } from "lucide-react";

export interface LocationMapCardProps {
  companyName: string;
  address: string;
  detailAddress?: string;
  phone?: string;
  workingHours?: string;
  naverMapUrl?: string;
  kakaoMapUrl?: string;
  embedMapHtml?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function LocationMapCard({
  companyName,
  address,
  detailAddress = "",
  phone,
  workingHours,
  naverMapUrl,
  kakaoMapUrl,
  embedMapHtml,
  title = "오시는 길",
  subtitle = "LOCATION & CONTACT",
  className = "",
}: LocationMapCardProps) {
  const [copied, setCopied] = useState(false);

  const fullAddress = `${address} ${detailAddress}`.trim();

  const copyToClipboard = () => {
    if (!fullAddress) return;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultKakaoUrl = kakaoMapUrl || `https://map.kakao.com/link/search/${encodeURIComponent(fullAddress || companyName)}`;
  const defaultNaverUrl = naverMapUrl || `https://map.naver.com/v5/search/${encodeURIComponent(fullAddress || companyName)}`;

  return (
    <div className={`w-full max-w-7xl mx-auto py-12 px-4 md:px-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-10 space-y-3">
          {subtitle && (
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Info Column */}
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-slate-50/50">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">
                VISIT US
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">{companyName}</h3>
            </div>

            {/* Address Row */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">주소</p>
                <p className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
                  {fullAddress || "주소 정보가 준비 중입니다."}
                </p>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="mt-2 text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">주소 복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>주소 복사</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Phone Row */}
            {phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">전화번호</p>
                  <a href={`tel:${phone}`} className="font-bold text-slate-800 text-sm md:text-base hover:underline">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {/* Working Hours Row */}
            {workingHours && (
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">운영 시간</p>
                  <p className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">
                    {workingHours}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200">
            <a
              href={defaultKakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#FEE500] text-[#191919] font-black text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <Navigation className="w-4 h-4 fill-current" />
              카카오맵 길찾기
            </a>
            <a
              href={defaultNaverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#03C75A] text-white font-black text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              네이버지도 보기
            </a>
          </div>
        </div>

        {/* Right Map Embed / Graphic Frame */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] bg-slate-100 flex items-center justify-center overflow-hidden">
          {embedMapHtml ? (
            <div
              className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full border-0"
              dangerouslySetInnerHTML={{ __html: embedMapHtml }}
            />
          ) : (
            <iframe
              title={`${companyName} 지도`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress || companyName)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full border-0 min-h-[380px] lg:min-h-[460px]"
              loading="lazy"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
