"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DownloadCloud,
  Globe,
  RefreshCw,
  Zap,
  CheckCircle2,
  HardDrive,
  FileText,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  Database,
} from "lucide-react";

export default function ExternalBlogMigrationPage() {
  const [platform, setPlatform] = useState<"naver" | "tistory" | "wordpress" | "velog" | "rss">("naver");
  const [blogUrl, setBlogUrl] = useState("");
  const [importCount, setImportCount] = useState("30");
  const [isMigrating, setIsMigrating] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  // Platform Details Matrix
  const platformInfo = {
    naver: {
      name: "네이버 블로그 (Naver Blog)",
      color: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      placeholder: "예: https://blog.naver.com/아이디 또는 아이디 입력",
      badge: "네이버 RSS 1초 가져오기 지원",
    },
    tistory: {
      name: "티스토리 (Tistory)",
      color: "from-orange-500 to-amber-600",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
      placeholder: "예: https://myblog.tistory.com",
      badge: "티스토리 XML 피드 1초 수집",
    },
    wordpress: {
      name: "워드프레스 (WordPress)",
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      placeholder: "예: https://my-wordpress-site.com",
      badge: "WP REST API & RSS 1초 연동",
    },
    velog: {
      name: "벨로그 (Velog)",
      color: "from-teal-500 to-cyan-600",
      borderColor: "border-teal-500/30",
      bgColor: "bg-teal-500/10",
      textColor: "text-teal-400",
      placeholder: "예: https://velog.io/@아이디",
      badge: "Velog 개발자 포스팅 1초 이관",
    },
    rss: {
      name: "Medium / 기타 RSS URL",
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      placeholder: "예: https://medium.com/@username 또는 RSS URL",
      badge: "표준 RSS / Atom 피드 수집",
    },
  };

  const handleMigrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogUrl.trim()) return;

    setIsMigrating(true);
    setResultData(null);

    try {
      const res = await fetch("/api/studio/blog-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          blogUrl,
          importCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "블로그 가져오기 실패");

      setResultData(data.data);
    } catch (err: any) {
      alert(err.message || "외부 블로그 이관 중 오류가 발생했습니다.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8 font-sans selection:bg-purple-500/30">
      {/* --- HERO HEADER BANNER --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/70 via-purple-950/60 to-slate-900 border border-purple-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/40 px-3 py-1 text-xs font-black text-purple-300">
              <Sparkles size={14} className="text-purple-400 animate-pulse" />
              <span>CreAibox 블로그 이관 센터</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              기존 블로그 원고 <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">통째 가져오기 & creaibox.com 실시간 이관 센터</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              기존에 사용하시던 네이버 블로그, 티스토리, 워드프레스 등의 글과 이미지를 1초 만에 스크랩하여<br />
              <span className="text-purple-400 font-bold">CreAibox 클라우드 DB 및 '블로그 원고 관리'</span>함으로 통째 수집·저장합니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/writing/creaibox/list"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-700 px-4 py-2.5 text-xs font-black text-slate-200 hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
            >
              <FileText size={14} className="text-purple-400" />
              <span>블로그 원고 관리 바로가기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- PLATFORM SELECTION CARDS --- */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-300 flex items-center gap-2">
          <Layers size={16} className="text-purple-400" /> 1. 이관할 기존 블로그 플랫폼 선택
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.keys(platformInfo) as Array<keyof typeof platformInfo>).map((key) => {
            const info = platformInfo[key];
            const isSelected = platform === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPlatform(key);
                  setBlogUrl("");
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? `${info.borderColor} bg-slate-900 shadow-xl ring-2 ring-purple-500/50 scale-102`
                    : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${info.textColor}`}>{info.name.split(" ")[0]}</span>
                  {isSelected && <CheckCircle2 size={16} className={info.textColor} />}
                </div>

                <div className="text-[11px] font-bold text-slate-200">{info.name.split("(")[1]?.replace(")", "") || info.name}</div>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 self-start">
                  {info.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- INPUT FORM CARD & STORAGE DB INDICATOR --- */}
      <div className="rounded-3xl border border-purple-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
              <DownloadCloud className="text-purple-400" /> {platformInfo[platform].name} 주소 입력 및 수집 옵션
            </h3>
            <p className="text-xs font-medium text-slate-400">
              블로그 메인 주소를 입력하시면 AI 엔진이 포스트 제목, 본문, 이미지, 작성일을 1초 수집합니다.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-300">
            <HardDrive size={14} className="text-emerald-400" />
            <span>CreAibox 클라우드 DB 실시간 연동됨</span>
          </div>
        </div>

        <form onSubmit={handleMigrationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                placeholder={platformInfo[platform].placeholder}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none shadow-inner"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={importCount}
                onChange={(e) => setImportCount(e.target.value)}
                className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-4 text-xs font-bold text-slate-200 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="all">🚀 블로그 전체 글 수집 (120개 통째 이관)</option>
                <option value="120">120개 원고 전량 수집</option>
                <option value="50">최근 50개 원고 수집</option>
                <option value="30">최근 30개 원고 수집</option>
                <option value="10">최근 10개 원고 수집</option>
              </select>

              <button
                type="submit"
                disabled={isMigrating}
                className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-6 py-4 text-xs sm:text-sm font-black text-white hover:brightness-110 transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isMigrating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                <span>1초 가져오기</span>
              </button>
            </div>

            {/* --- LEGAL DISCLAIMER & AI SEO RE-WRITE OPTIONS --- */}
            <div className="md:col-span-12 space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <input
                  type="checkbox"
                  id="terms-check"
                  defaultChecked
                  required
                  className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="terms-check" className="cursor-pointer">
                  본인 소유 또는 정당한 권한을 위임받은 콘텐츠임을 확인하며, 타인 저작권 도용 시 모든 법적 책임은 신청자 본인에게 있음을 동의합니다. (필수)
                </label>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-medium leading-relaxed flex items-start gap-2">
                <Sparkles size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">💡 이관 및 원본 글 AI 재창조 안내</span>: 기존 블로그 포스팅을 삭제 후 옮겨오실 경우 원본 그대로 100% 정상 검색 노출됩니다.<br />
                  기존 블로그 포스팅을 병행 유지하며 이중 발행하시려면, 이관 완료 후 <span className="font-bold text-amber-300">'네이버/SNS AI 재발행'</span> 메뉴의 <span className="font-bold text-emerald-300">'✨ 원본 글 AI 재창조'</span> 버튼을 클릭하여 문장을 원클릭으로 새로 다듬으실 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* --- LIVE RESULT & CREAIBOX DB STATUS DISPLAY --- */}
        {resultData && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-fade-in-up">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-black text-emerald-300">{resultData.message}</div>
                  <div className="text-xs text-slate-400 font-medium">
                    이관 저장소: <span className="font-mono text-purple-300">{resultData.storageFolder || "creaibox.com / Cloud_Storage_DB"}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/writing/creaibox/list"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-md shrink-0"
              >
                <span>블로그 원고 관리함에서 확인</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Imported Articles List Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Database size={14} className="text-purple-400" /> 수집되어 CreAibox 클라우드 DB에 저장된 원고 목록 ({resultData.importedCount}개)
                </span>
                <span className="text-slate-400 font-normal">이관 완료 시간: {new Date().toLocaleTimeString()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resultData.posts?.map((post: any) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 transition-all flex gap-3 items-start group shadow-md"
                  >
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800 group-hover:scale-105 transition-transform"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {post.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <HardDrive size={10} /> CreAibox DB 저장됨
                        </span>
                      </div>

                      <h4 className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                        {post.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>작성일: {post.publishedAt}</span>
                        <a
                          href={post.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-400 underline flex items-center gap-0.5"
                        >
                          원본보기 <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- INSTRUCTION CARD --- */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
        <h4 className="text-xs font-black text-slate-300 flex items-center gap-2">
          <Sparkles size={14} className="text-purple-400" /> 기존 블로그 통째 이관 가이드
        </h4>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
          <li>네이버 블로그, 티스토리, 워드프레스의 전체 원고 텍스트, 본문 이미지 및 SEO 메타데이터가 CreAibox 클라우드 DB 및 원고 보관함으로 자동 이관됩니다.</li>
          <li><span className="text-emerald-400 font-bold">🎬 동영상 임베드 재생 지원:</span> 네이버/티스토리/유튜브 등 포스트 내 동영상은 임베드 링크(iframe)가 자동 추출되어 CreAibox 본문에서 바로 재생됩니다!</li>
          <li>가져온 원고는 <span className="text-purple-300 font-bold">'블로그 원고 관리'</span> 화면에서 자유롭게 수정, SEO 재가공, AI 재발행을 실행하실 수 있습니다.</li>
          <li>원문 작성자의 저작권 규정을 준수하여 본인 소유의 블로그 콘텐츠 이관 용도로 활용해 주세요.</li>
        </ul>
      </div>
    </div>
  );
}
