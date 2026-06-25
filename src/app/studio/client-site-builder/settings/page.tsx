"use client";

import React, { useState, useEffect } from "react";
import { useSiteBuilder } from "../context";
import { createClient } from "@/utils/supabase/client";
import { Settings, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { sites, selectedSite, refreshData } = useSiteBuilder();
  const supabase = createClient();

  // Settings State
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [repName, setRepName] = useState("");
  const [businessNum, setBusinessNum] = useState("");
  const [gaId, setGaId] = useState("");
  
  const [naverBlog, setNaverBlog] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const [saving, setSaving] = useState(false);

  // Sync state with selected site when loaded
  useEffect(() => {
    if (selectedSite) {
      setCompanyName(selectedSite.company_name || "");
      setPhone(selectedSite.phone || "");
      setAddress(selectedSite.address || "");
      setRepName(selectedSite.extra_configs?.representative_name || "");
      setBusinessNum(selectedSite.extra_configs?.business_number || "");
      setGaId(selectedSite.extra_configs?.ga4_measurement_id || "");
      
      setNaverBlog(selectedSite.extra_configs?.sns_links?.naver_blog || "");
      setInstagram(selectedSite.extra_configs?.sns_links?.instagram || "");
      setYoutube(selectedSite.extra_configs?.sns_links?.youtube || "");
    }
  }, [selectedSite]);

  // If no sites exist
  if (sites.length === 0 || !selectedSite) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
          <Settings size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">운영 중인 홈페이지가 없습니다</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            홈페이지를 개설하면 공식 비즈니스 정보, SNS 프로필 링크 및 구글 애널리틱스(GA4) 트래픽 추적 ID를 이곳에서 상세 관리할 수 있습니다.
          </p>
        </div>
        <Link
          href="/studio/client-site-builder/builder"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-xl transition-all"
        >
          <span>첫 홈페이지 제작하러 가기</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedExtraConfigs = {
      ...(selectedSite.extra_configs || {}),
      representative_name: repName.trim(),
      business_number: businessNum.trim(),
      ga4_measurement_id: gaId.trim(),
      sns_links: {
        naver_blog: naverBlog.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
    };

    try {
      const { error } = await supabase
        .from("client_sites")
        .update({
          company_name: companyName.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          extra_configs: updatedExtraConfigs,
        })
        .eq("id", selectedSite.id);

      if (error) throw error;
      alert("홈페이지 설정 정보가 성공적으로 저장되었습니다.");
      await refreshData();
    } catch (err) {
      console.error("Save settings error:", err);
      alert("설정 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-sm animate-fade-in">
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
              className="text-sm text-slate-950 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
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
          className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-955 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
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
  );
}
