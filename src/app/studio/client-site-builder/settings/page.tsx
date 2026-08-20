"use client";

import React, { useState, useEffect } from "react";
import { useSiteBuilder } from "../context";
import { createClient } from "@/utils/supabase/client";
import { Settings, CheckCircle, Loader2, ArrowRight, CreditCard, HelpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { sites, selectedSite, refreshData } = useSiteBuilder();
  const supabase = createClient();

  // Settings State
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [repName, setRepName] = useState("");
  const [businessNum, setBusinessNum] = useState("");
  const [gaId, setGaId] = useState("");
  
  const [naverBlog, setNaverBlog] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const [isOnePageScroll, setIsOnePageScroll] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  // PG Payment Gateway State
  const [pgProvider, setPgProvider] = useState<string>("none");
  const [pgMid, setPgMid] = useState<string>("");
  const [pgApiKey, setPgApiKey] = useState<string>("");
  const [enableBankTransfer, setEnableBankTransfer] = useState<boolean>(true);
  const [bankAccountInfo, setBankAccountInfo] = useState<string>("");
  const [enableInquiryPayment, setEnableInquiryPayment] = useState<boolean>(true);

  // Sync state with selected site when loaded
  useEffect(() => {
    if (selectedSite) {
      setCompanyName(selectedSite.company_name || "");
      setPhone(selectedSite.phone || "");
      setAddress(selectedSite.address || "");
      setEmail(selectedSite.extra_configs?.email || "");
      setFax(selectedSite.extra_configs?.fax || "");
      setRepName(selectedSite.extra_configs?.representative_name || "");
      setBusinessNum(selectedSite.extra_configs?.business_number || "");
      setGaId(selectedSite.extra_configs?.ga4_measurement_id || "");
      
      setNaverBlog(selectedSite.extra_configs?.sns_links?.naver_blog || "");
      setInstagram(selectedSite.extra_configs?.sns_links?.instagram || "");
      setYoutube(selectedSite.extra_configs?.sns_links?.youtube || "");
      
      setIsOnePageScroll(selectedSite.is_onepage_scroll || false);
      
      setPgProvider(selectedSite.extra_configs?.pgProvider || "none");
      setPgMid(selectedSite.extra_configs?.pgMid || "");
      setPgApiKey(selectedSite.extra_configs?.pgApiKey || "");
      setEnableBankTransfer(selectedSite.extra_configs?.enableBankTransfer ?? true);
      setBankAccountInfo(selectedSite.extra_configs?.bankAccountInfo || "");
      setEnableInquiryPayment(selectedSite.extra_configs?.enableInquiryPayment ?? true);
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
      email: email.trim(),
      fax: fax.trim(),
      representative_name: repName.trim(),
      business_number: businessNum.trim(),
      ga4_measurement_id: gaId.trim(),
      sns_links: {
        naver_blog: naverBlog.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
      pgProvider,
      pgMid: pgMid.trim(),
      pgApiKey: pgApiKey.trim(),
      enableBankTransfer,
      bankAccountInfo: bankAccountInfo.trim(),
      enableInquiryPayment,
    };

    try {
      const { error } = await supabase
        .from("client_sites")
        .update({
          company_name: companyName.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          is_onepage_scroll: isOnePageScroll,
          extra_configs: updatedExtraConfigs,
        })
        .eq("id", selectedSite.id);

      if (error) throw error;

      // Also sync to custom client site config API for custom sites (e.g. sotongcheum)
      if (selectedSite.brand_id) {
        try {
          await fetch("/api/clients/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              brandId: selectedSite.brand_id,
              config: {
                companyName: companyName.trim(),
                phone: phone.trim(),
                address: address.trim(),
                bizNumber: businessNum.trim(),
                ...updatedExtraConfigs,
              },
            }),
          });
        } catch (e) {
          console.warn("Sync to clients config API warn:", e);
        }
      }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5 mb-6 gap-2">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="text-emerald-500" size={20} />
          <span>비즈니스 웹사이트 기본 정보 설정</span>
        </h2>
        {selectedSite.brand_id && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <span>대표 주소: {selectedSite.brand_id}.creaibox.com</span>
          </div>
        )}
      </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">공식 이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sotongcheum@naver.com"
              className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">대표 팩스번호</label>
            <input
              type="text"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              placeholder="031-292-3994"
              className="text-sm text-slate-955 dark:text-white border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>
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

        {/* One-Page Scroll Specs */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">원페이지 스크롤 모드 (메인 화면 확장)</label>
          <p className="text-[10px] text-slate-500 mb-2">활성화 시, 서브페이지 콘텐츠들이 메인 랜딩페이지 하단에 모두 전개되어 풍성한 원페이지 사이트처럼 보이게 됩니다.</p>
          <label className="relative inline-flex items-center cursor-pointer max-w-fit">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isOnePageScroll}
              onChange={(e) => setIsOnePageScroll(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              {isOnePageScroll ? "활성화 됨" : "비활성화"}
            </span>
          </label>
        </div>

        {/* 💳 PG Payment Gateway & Payment Methods */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 space-y-5">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
              <CreditCard size={12} />
              <span>결제 수금 직접 입금 지원</span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>💳 PG 결제 게이트웨이 & 결제 세팅</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              자사몰/커스텀 사이트에서 소비자의 결제금액을 직접 수금할 PG 상점 키 및 결제 수단을 설정하세요.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">주요 PG 결제 게이트웨이 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "portone", name: "포트원 (PortOne)" },
                { id: "toss", name: "토스페이먼츠 (Toss)" },
                { id: "kakaopay", name: "카카오페이 전용" },
                { id: "none", name: "PG 결제 미사용" },
              ].map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => setPgProvider(pg.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    pgProvider === pg.id
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {pg.name}
                </button>
              ))}
            </div>
          </div>

          {pgProvider !== "none" && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">PG 상점 ID (MID)</label>
                <input
                  type="text"
                  value={pgMid}
                  onChange={(e) => setPgMid(e.target.value)}
                  placeholder="예: imp_884920412491 또는 toss_mid_xxxx"
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">API Client Key (공개키)</label>
                <input
                  type="text"
                  value={pgApiKey}
                  onChange={(e) => setPgApiKey(e.target.value)}
                  placeholder="예: pk_live_creaibox_sample_key"
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">🏦 무통장 입금 활성화</label>
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
              </div>
              {enableBankTransfer && (
                <input
                  type="text"
                  value={bankAccountInfo}
                  onChange={(e) => setBankAccountInfo(e.target.value)}
                  placeholder="예: 국민은행 123456-04-123456 (예금주: 홍길동)"
                  className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-300 focus:border-emerald-500 focus:outline-none"
                />
              )}
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200">📄 실시간 견적서 결제 폼 활성화</label>
                <input
                  type="checkbox"
                  checked={enableInquiryPayment}
                  onChange={(e) => setEnableInquiryPayment(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                소비자가 온라인 견적서(PDF) 발행 후 바로 견적 금액 결제 및 예약을 진행할 수 있도록 견적 결제 폼을 활성화합니다.
              </p>
            </div>
          </div>

          {/* PG Merchant Signup Guide Links & Notice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <HelpCircle size={13} className="text-cyan-500 dark:text-cyan-400" />
              <span>PG 가맹점 미신청 상태이신가요? (1초 가입 센터)</span>
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              아래 공식 PG사 포털에서 가맹 신청 후 발급된 상점 MID 및 API Key를 입력하시면 결제가 자동 가동됩니다.
            </p>

            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href="https://portone.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-emerald-500 dark:text-emerald-400" />
                  <span>포트원 (PortOne) 무료 가맹 신청 포털</span>
                </span>
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-mono">portone.io ↗</span>
              </a>

              <a
                href="https://www.tosspayments.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <ExternalLink size={12} className="text-blue-500 dark:text-blue-400" />
                  <span>토스페이먼츠 (Toss) 전자결제 도입</span>
                </span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-mono">tosspayments.com ↗</span>
              </a>
            </div>
          </div>
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
