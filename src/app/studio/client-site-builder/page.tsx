"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSiteBuilder } from "./context";
import { createClient } from "@/utils/supabase/client";
import { TEMPLATE_REGISTRY } from "@/lib/templates/registry";
import { LayoutDashboard, MessageSquare, Wand2, Palette, Settings, FileText, Calendar, ArrowRight, UserCheck, Shield, Clock, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ClientSiteBuilderHomePage() {
  const router = useRouter();
  const { sites, selectedSite, loading } = useSiteBuilder();
  const supabase = createClient();

  // Dashboard Stats States
  const [sectionsCount, setSectionsCount] = useState(0);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!selectedSite) return;

    const loadDashboardStats = async () => {
      setStatsLoading(true);
      try {
        // 1. Fetch sections count
        const { data: sectionsData } = await supabase
          .from("site_sections")
          .select("id")
          .eq("site_id", selectedSite.id);
        setSectionsCount(sectionsData?.length || 0);

        // 2. Fetch inquiries count & recent inquiries
        const { data: inquiriesData } = await supabase
          .from("site_posts")
          .select("*")
          .eq("site_id", selectedSite.id)
          .eq("post_type", "inquiry")
          .order("created_at", { ascending: false });

        setInquiriesCount(inquiriesData?.length || 0);
        setRecentInquiries((inquiriesData || []).slice(0, 3));

        // 3. Fetch blog posts count
        const { data: postsData } = await supabase
          .from("site_posts")
          .select("id")
          .eq("site_id", selectedSite.id)
          .in("post_type", ["notice", "board"]);
        setPostsCount(postsData?.length || 0);

      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardStats();
  }, [selectedSite]);

  // Case A: User has NO sites created yet (Onboarding UI)
  if (sites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-8 animate-fade-in">
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
            <Wand2 size={32} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              첫 비즈니스 홈페이지를 개설해 보세요
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              블로그 주소나 간단한 소개글만 있으면 AI가 귀사의 브랜드 컨셉에 맞는 전문 홈페이지 기획안을 도출하고 즉시 배포형 사이트를 제작합니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/studio/client-site-builder/builder"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <span>AI 홈페이지 빌더 시작하기</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/studio/client-site-builder/themes"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-extrabold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 rounded-2xl transition-all"
            >
              <span>디자인 테마 먼저 구경하기</span>
            </Link>
          </div>
        </div>

        {/* Informational Grid for beginners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Step 1</div>
            <h3 className="font-extrabold text-slate-900 dark:text-white">자료 입력 및 AI 기획</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              운영 중인 블로그 URL이나 비즈니스 개요를 제공하면 AI가 정교한 사이트 카피와 레이아웃 구조를 자동으로 수립합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Step 2</div>
            <h3 className="font-extrabold text-slate-900 dark:text-white">섹션 검토 및 최종 빌드</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              AI가 기획한 슬라이드 및 대표 서비스 카드를 시각적으로 검토 및 직접 수정한 뒤 최종 개설 승인을 클릭합니다.
            </p>
          </div>
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Step 3</div>
            <h3 className="font-extrabold text-slate-900 dark:text-white">CMS 실시간 운영 및 관리</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              실시간 텍스트 수정, 신규 블로그 포스트 발행, 고객 상담 문의 접수 내역 관리 및 GA4 연동 통계를 간편히 관리합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Case B: User HAS site(s) created (Dashboard Home Overview UI)
  const activeTemplate = selectedSite
    ? TEMPLATE_REGISTRY[selectedSite.template_id] || { name: selectedSite.template_id }
    : null;

  const dateStr = selectedSite
    ? new Date(selectedSite.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview stats and At a Glance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* At a Glance Card */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="text-emerald-500" size={20} />
              <span>홈페이지 현황 요약 (At a Glance)</span>
            </h2>
            <div className="border-b border-slate-100 dark:border-slate-850 pb-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">적용된 디자인 테마</span>
                <span className="text-slate-900 dark:text-white flex items-center gap-1">
                  <Palette size={14} className="text-emerald-400" />
                  {activeTemplate?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">최초 개설 일자</span>
                <span className="text-slate-800 dark:text-slate-200">{dateStr}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">운영 서브 도메인</span>
                <a
                  href={`http://${selectedSite?.brand_id}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:underline flex items-center gap-1"
                >
                  <span>{selectedSite?.brand_id}.creaibox.com</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase">활성 섹션</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{sectionsCount}개</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase">블로그 글</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{postsCount}개</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl text-center space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase">누적 문의</span>
              <span className="text-2xl font-black text-emerald-500">{inquiriesCount}건</span>
            </div>
          </div>
        </div>

        {/* Recent Inquiries Card */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="text-emerald-500" size={20} />
                <span>최근 고객 문의 및 상담 신청</span>
              </h2>
              <Link
                href="/studio/client-site-builder/inquiries"
                className="text-xs font-black text-emerald-500 hover:underline flex items-center gap-1"
              >
                <span>전체 보기</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            {statsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="animate-spin text-emerald-500 mb-2" size={24} />
                <span className="text-xs font-bold">로딩 중...</span>
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-100 dark:border-slate-850 rounded-2xl">
                <Clock className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-355">접수된 문의 없음</h3>
                <p className="text-[10px] text-slate-400">아직 방문자가 남긴 상담 문의글이 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold">
                      <th className="py-2.5 px-2">날짜</th>
                      <th className="py-2.5 px-2">신청자</th>
                      <th className="py-2.5 px-2">연락처</th>
                      <th className="py-2.5 px-2 text-right">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850/40 text-slate-700 dark:text-slate-300 font-bold">
                    {recentInquiries.map((inq) => {
                      const status = inq.extra_data?.status || "접수";
                      const date = new Date(inq.created_at).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      });
                      const statusClass =
                        status === "완료"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : status === "상담중"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20";

                      return (
                        <tr key={inq.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="py-3 px-2 text-slate-400 font-medium">{date}</td>
                          <td className="py-3 px-2 text-slate-900 dark:text-white">{inq.author_name}</td>
                          <td className="py-3 px-2 text-slate-500">{inq.extra_data?.phone || "연락처 없음"}</td>
                          <td className="py-3 px-2 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${statusClass}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Links Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">CMS 스튜디오 핵심 기능 바로가기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Section Editor */}
          <Link
            href="/studio/client-site-builder/builder"
            className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Wand2 size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                디자인 & 섹션 편집
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                메인 홈페이지의 타이틀, 로고, 세부 문구와 이미지 구성 섹션을 실시간으로 직접 편집하고 수정합니다.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>빌더 실행하기</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 2: Themes Store */}
          <Link
            href="/studio/client-site-builder/themes"
            className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Palette size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                디자인 테마 라이브러리
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                워드프레스처럼 전문가가 사전 디자인한 고품격 카테고리별 테마를 탐색하고 원클릭으로 교체 적용합니다.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>테마 둘러보기</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 3: Pages & Posts */}
          <Link
            href="/studio/client-site-builder/posts"
            className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                페이지 & 글 관리
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                독립 서브 페이지들 구조를 확인하고, 공지사항 발행 및 비즈니스 마케팅 블로그 글을 직접 CRUD 관리합니다.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>게시판 관리하기</span>
              <ArrowRight size={10} />
            </div>
          </Link>

          {/* Card 4: Settings */}
          <Link
            href="/studio/client-site-builder/settings"
            className="group bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Settings size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                회사 정보 및 노출 설정
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                공식 회사 정보(연락처, 주소, 사업자번호), 노출할 SNS 링크 및 구글 애널리틱스(GA4) 연동 측정을 설정합니다.
              </p>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>마스터 설정하기</span>
              <ArrowRight size={10} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
