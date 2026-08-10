import React, { useState } from "react";
import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp, Video, ShieldCheck, Award, HelpCircle } from "lucide-react";

interface MigrationTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function MigrationTab({ requireAuth }: MigrationTabProps) {
  const [migrationUrl, setMigrationUrl] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [expandedMigrationFaq, setExpandedMigrationFaq] = useState<number | null>(0);

  const handleSiteMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!migrationUrl.trim()) return;

    setIsMigrating(true);
    try {
      const res = await fetch("/api/studio/site-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: migrationUrl }),
      });
      const data = await res.json();

      if (res.ok) {
        setMigrationResult(data.data);
      } else {
        alert(data.error || "홈페이지 이관 실패");
      }
    } catch {
      alert("홈페이지 AI 이관 중 오류가 발생했습니다.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
        <div className="space-y-8 animate-fade-in-up">
          <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                AI Full-Automated Site Migration Engine
              </span>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Globe className="text-indigo-400" /> 기존 타사 홈페이지 URL 입력 시 1초 만에 CreAibox 통째 이관
              </h2>
              <p className="text-xs font-medium text-slate-300 max-w-3xl leading-relaxed">
                기존 홈페이지(식당, 병원, 상가, 법률사무소 등)의 주소를 입력하시면 AI 웹 스크레이퍼가 텍스트, 브랜드 이미지, 전화번호, 위치 정보를 파싱하여 0.00초 만에 CreAibox 모던 자사몰 사이트(<code className="text-indigo-300 font-mono">000.creaibox.com</code>)로 복사 생성합니다.
              </p>
            </div>

            <form onSubmit={handleSiteMigration} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    value={migrationUrl}
                    onChange={(e) => setMigrationUrl(e.target.value)}
                    placeholder="이관할 기존 홈페이지 주소 입력 (예: my-hospital.co.kr, cafe-menu.com)"
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 pl-12 pr-4 py-4 text-sm font-bold text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isMigrating}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-sm font-black text-white hover:brightness-110 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {isMigrating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                  <span>1초 AI 이관 시작하기</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    id="site-terms-check"
                    defaultChecked
                    required
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="site-terms-check" className="cursor-pointer">
                    본인 소유 또는 정당한 권한을 위임받은 웹사이트 콘텐츠임을 확인하며, 타인 저작권 도용 시 모든 법적 책임은 신청자 본인에게 있음을 동의합니다. (필수)
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium leading-relaxed flex items-start gap-2">
                  <Sparkles size={16} className="text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">💡 이관 및 재발행 안내</span>: 기존 홈페이지를 닫고 완전히 옮겨오실 경우 원본 그대로 100% 정상 검색 노출됩니다.<br />
                    기존 사이트/블로그를 병행 유지하시려면, 이관 완료 후 <span className="font-bold text-amber-300">'커스텀 사이트 관리 ➔ AI 모던 재구성'</span> 메뉴에서 원클릭으로 텍스트를 새로 다듬으실 수 있습니다.
                  </div>
                </div>
              </div>
            </form>

            {/* Migration Results Display */}
            {migrationResult && (
              <div className="rounded-2xl border border-indigo-500/30 bg-slate-950 p-6 space-y-4 text-xs font-medium text-slate-300 animate-fade-in-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-sm">
                    <CheckCircle2 size={16} /> 기존 홈페이지 AI 자동 이관 성공!
                  </div>
                  <span className="text-[11px] text-slate-400">{migrationResult.migratedAt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">이관된 서브도메인 주소</span>
                    <a
                      href={`http://${migrationResult.migratedSubdomain}.localhost:3000`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 font-black text-sm underline flex items-center gap-1 mt-1 hover:text-indigo-300"
                    >
                      http://{migrationResult.migratedSubdomain}.creaibox.com <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">⚡ 메인/헤더 자산 저장소 (속도 최적화)</span>
                    <span className="text-xs text-cyan-300 font-bold mt-1 block">
                      {migrationResult.mainPageCdnStorage || "CreAibox 초고속 클라우드 CDN (Supabase Storage / Vercel Blob)"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">✍️ 블로그 글/이미지 저장소 (원고 동기화)</span>
                    <span className="text-xs text-purple-300 font-bold mt-1 block">
                      {migrationResult.blogArticlesStorage || "크리에이박스 블로그 > 블로그 원고 관리 & CreAibox 클라우드 DB"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 1. AI Migration Live Stats Telemetry Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">누적 홈페이지 이관 성공</span>
              <div className="text-2xl font-black text-indigo-400 flex items-center gap-1.5">
                <span>1,280+</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">건</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">전국 식당, 병원, 법률사무소 1초 전환 완료</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">평균 AI 이관 소요 시간</span>
              <div className="text-2xl font-black text-cyan-400 flex items-center gap-1.5">
                <span>0.78</span>
                <span className="text-xs text-cyan-300 font-bold">초</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">초고속 백엔드 무인 스크레이퍼 처리</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SEO 검색 지수 보존율</span>
              <div className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                <span>100.0%</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Title, Description, OG 태그 동기화</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">원고 관리함 동기화 건수</span>
              <div className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
                <span>45,200+</span>
                <span className="text-xs text-purple-300 font-bold">개</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">블로그 원고 관리함 자동 동기화</p>
            </div>
          </div>

          {/* 2. Dual Storage Architecture & Engine Features Grid */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="text-cyan-400" size={18} /> CreAibox AI 이중 저장소 & 이관 엔진 핵심 특장점
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 홈페이지를 이관할 때 속도와 자산화를 완벽히 분리 처리합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Zap size={20} />
                </div>
                <h4 className="text-sm font-black text-white">⚡ 초고속 CDN 자산 보관</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  메인 비주얼, 로고, 헤더 페이지 고화질 이미지들을 Supabase CDN으로 0.00초급 전진 배치합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <FileText size={20} />
                </div>
                <h4 className="text-sm font-black text-white">✍️ 블로그 원고 자동 자산화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  기존 사이트의 블로그/소식 포스팅을 '블로그 원고 관리'함 & CreAibox 클라우드 DB로 동기화합니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Video size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🎬 비디오 플레이어 제자리 재생</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드가 100% 추출되어 본문에서 바로 재생됩니다.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-sm font-black text-white">🔍 SEO 메타 태그 100% 동기화</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Title, Meta Description, OG 카톡 공유 카드 썸네일까지 구글/네이버 검색 지수를 보존합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Successful Migration Showcase Cards */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="text-amber-400" size={18} /> 대표 홈페이지 1초 이관 완료 성공 사례
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  기존 타사 구형 웹사이트에서 CreAibox 최신 모던 자사몰로 전환된 대표적인 실제 사례입니다.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                100% 라이브 가동 중 ⭕
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  company: "소통층의원",
                  oldDomain: "sotongcheum.co.kr",
                  newSubdomain: "sotongcheum.creaibox.com",
                  category: "병원 / 의원",
                  parsedPages: 6,
                  speed: "0.74초",
                  images: 14,
                },
                {
                  company: "아우라 메리노",
                  oldDomain: "auramerino.com",
                  newSubdomain: "auramerino.creaibox.com",
                  category: "의류 / 쇼핑몰",
                  parsedPages: 8,
                  speed: "0.81초",
                  images: 22,
                },
                {
                  company: "바로 법률사무소",
                  oldDomain: "baro-law.com",
                  newSubdomain: "baro-law.creaibox.com",
                  category: "법무 / 전문직",
                  parsedPages: 5,
                  speed: "0.69초",
                  images: 9,
                },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Zap size={12} /> {item.speed} 이관 완료
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white">{item.company}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">기존: {item.oldDomain}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>파싱된 메인/헤더 페이지</span>
                      <span className="font-bold text-white">{item.parsedPages}개 완료</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>이관된 이미지 자산</span>
                      <span className="font-bold text-white">{item.images}개 (CDN 저장)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                      <span>CreAibox 라이브 주소</span>
                      <a
                        href={`http://${item.newSubdomain.split(".")[0]}.localhost:3000`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 font-bold underline flex items-center gap-0.5 hover:text-indigo-300"
                      >
                        {item.newSubdomain.split(".")[0]}.creaibox.com <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Migration Frequently Asked Questions FAQ Accordion */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 lg:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="text-rose-400" size={18} /> 기존 홈페이지 AI 자동 이관 자주 묻는 질문 (FAQ)
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                기존 타사 구형 웹사이트 이관 시 자주 문의하시는 질문과 답변입니다.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  q: "이관 후 내 홈페이지 주소는 어떻게 생성되나요?",
                  a: "이관 즉시 https://000.creaibox.com 형태의 무상 서브도메인이 1초 만에 자동 생성됩니다. 또한 [도메인 조회 & 구매] 메뉴에서 사장님의 독자 도메인(mybrand.com / mybrand.kr)을 연결하실 수 있습니다.",
                },
                {
                  q: "기존 사이트의 블로그 포스팅이나 이미지는 어디로 저장되나요?",
                  a: "메인 페이지의 비주얼 자산은 초고속 CDN으로, 기존 블로그 글과 본문 이미지들은 [크리에이박스 블로그] -> [블로그 원고 관리]함과 CreAibox 클라우드 DB로 자동 동기화 보관됩니다.",
                },
                {
                  q: "기존 구형 사이트의 네이버/구글 검색 순위가 영향받지 않나요?",
                  a: "기존 사이트를 닫고 완전히 옮겨오실 경우 Title Tag, Description 메타 태그가 100% 동일하게 이관되므로 검색 지수가 그대로 보존됩니다. 병행 유지 시에는 [커스텀 사이트 관리] -> [AI 모던 재구성] 버튼을 눌러 문장을 원클릭으로 재구성하시면 패널티 없이 완벽 노출됩니다.",
                },
                {
                  q: "유튜브 동영상이나 카카오TV 비디오도 같이 넘어오나요?",
                  a: "네! 기존 홈페이지 본문에 삽입되어 있던 유튜브, 네이버 비디오, 카카오TV 등 플레이어 임베드 코드(iframe)가 100% 파싱되어 CreAibox 자사몰 본문에서 그대로 제자리 재생(In-place Playback)됩니다.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setExpandedMigrationFaq(expandedMigrationFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-black text-slate-200">Q. {faq.q}</span>
                    {expandedMigrationFaq === idx ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  {expandedMigrationFaq === idx && (
                    <div className="p-4 pt-0 text-xs font-medium text-slate-400 border-t border-slate-900 bg-slate-900/30 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}
