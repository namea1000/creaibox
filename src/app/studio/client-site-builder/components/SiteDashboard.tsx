"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import SectionEditor from "./SectionEditor";
import InquiryManager from "./InquiryManager";
import TemplateSelector from "./TemplateSelector";
import { Globe, Settings, Eye, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";

interface SiteDashboardProps {
  site: any;
  allSites?: any[];
  onSelectSite?: (site: any) => void;
  onCreateNewSite?: () => void;
  onRefresh: () => void;
}

type TabType = "sections" | "inquiries" | "templates" | "settings";

export default function SiteDashboard({ site, allSites = [], onSelectSite, onCreateNewSite, onRefresh }: SiteDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("sections");
  
  // Settings State
  const [companyName, setCompanyName] = useState(site.company_name);
  const [phone, setPhone] = useState(site.phone || "");
  const [address, setAddress] = useState(site.address || "");
  const [repName, setRepName] = useState(site.extra_configs?.representative_name || "");
  const [businessNum, setBusinessNum] = useState(site.extra_configs?.business_number || "");
  const [gaId, setGaId] = useState(site.extra_configs?.ga4_measurement_id || "");
  
  const [naverBlog, setNaverBlog] = useState(site.extra_configs?.sns_links?.naver_blog || "");
  const [instagram, setInstagram] = useState(site.extra_configs?.sns_links?.instagram || "");
  const [youtube, setYoutube] = useState(site.extra_configs?.sns_links?.youtube || "");

  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedExtraConfigs = {
      ...(site.extra_configs || {}),
      representative_name: repName.trim(),
      business_number: businessNum.trim(),
      ga4_measurement_id: gaId.trim(),
      sns_links: {
        naver_blog: naverBlog.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim()
      }
    };

    try {
      const { error } = await supabase
        .from("client_sites")
        .update({
          company_name: companyName.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          extra_configs: updatedExtraConfigs
        })
        .eq("id", site.id);

      if (error) throw error;
      alert("홈페이지 설정 정보가 정상 저장되었습니다.");
      onRefresh();
    } catch (err) {
      console.error("Save settings error:", err);
      alert("설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from("client_sites")
        .update({ template_id: templateId })
        .eq("id", site.id);

      if (error) throw error;
      alert("디자인 템플릿 테마가 성공적으로 변경되었습니다.");
      onRefresh();
    } catch (err) {
      console.error("Template change failed:", err);
      alert("템플릿 변경에 실패했습니다.");
    }
  };

  // Build live link URL
  const liveUrl = `http://${site.brand_id}.localhost:3000`;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Site Master Header */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              운영 중
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {site.brand_id}.creaibox.com
            </span>

            {/* Multi-site switcher dropdown */}
            {allSites && allSites.length > 1 && (
              <select
                value={site.id}
                onChange={(e) => {
                  const selected = allSites.find(s => s.id === e.target.value);
                  if (selected && onSelectSite) {
                    onSelectSite(selected);
                  }
                }}
                className="ml-3 text-xs font-black text-slate-700 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {allSites.map(s => (
                  <option key={s.id} value={s.id} className="dark:bg-slate-900 dark:text-white">
                    🏢 {s.company_name} ({s.brand_id})
                  </option>
                ))}
              </select>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {site.company_name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-3">
            {site.phone && <span className="flex items-center gap-1"><Phone size={12} /> {site.phone}</span>}
            {site.address && <span className="flex items-center gap-1"><MapPin size={12} /> {site.address}</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onCreateNewSite && (
            <button
              onClick={onCreateNewSite}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/85 dark:hover:bg-slate-750 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>➕ 새 홈페이지 추가</span>
            </button>
          )}
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Eye size={16} />
            <span>내 홈페이지 바로가기</span>
          </a>
        </div>
      </div>

      {/* Tabs GNB */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-px flex gap-2 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "sections"
              ? "border-[var(--primary)] dark:border-emerald-500 text-[var(--primary)] dark:text-emerald-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          디자인 & 섹션 편집
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "inquiries"
              ? "border-[var(--primary)] dark:border-emerald-500 text-[var(--primary)] dark:text-emerald-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          고객 상담 문의 내역
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "templates"
              ? "border-[var(--primary)] dark:border-emerald-500 text-[var(--primary)] dark:text-emerald-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          템플릿 테마 선택
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "settings"
              ? "border-[var(--primary)] dark:border-emerald-500 text-[var(--primary)] dark:text-emerald-400 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          회사 마스터 정보 설정
        </button>
      </div>

      {/* Dynamic Tab Renderer */}
      <div className="min-h-[400px]">
        {activeTab === "sections" && (
          <SectionEditor siteId={site.id} />
        )}
        
        {activeTab === "inquiries" && (
          <InquiryManager siteId={site.id} />
        )}

        {activeTab === "templates" && (
          <TemplateSelector
            selectedTemplateId={site.template_id}
            onSelect={handleTemplateChange}
          />
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="text-emerald-500" size={20} />
              <span>기본 정보 및 노출 설정</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">공식 회사/학원명</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">대표 연락처</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">대표 주소/위치</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              {/* Corporate business specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">대표자 성명</label>
                  <input
                    type="text"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">사업자등록번호</label>
                  <input
                    type="text"
                    value={businessNum}
                    onChange={(e) => setBusinessNum(e.target.value)}
                    className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* SNS links specs */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">노출 SNS 링크</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">네이버 블로그</label>
                    <input
                      type="url"
                      value={naverBlog}
                      onChange={(e) => setNaverBlog(e.target.value)}
                      placeholder="https://blog.naver.com/id"
                      className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">인스타그램</label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/id"
                      className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">유튜브 채널</label>
                    <input
                      type="url"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="https://youtube.com/c/channel"
                      className="text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* GA ID Specs */}
              <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">구글 애널리틱스 (GA4) 측정 ID</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              {/* Commit save button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>마스터 설정 저장 및 즉시 배포</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
