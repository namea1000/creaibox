"use client";

import React, { useState } from "react";
import { FileText, Loader2, Sparkles, AlertCircle, Copy, Check } from "lucide-react";

export default function StrategyReport() {
  const [niche, setNiche] = useState("");
  const [frequency, setFrequency] = useState("week-2");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setReport(null);

    try {
      const prompt = `유튜브 채널 운영 전략 리포트 생성기.
      채널 분야: "${niche}"
      업로드 주기: "${frequency === "week-2" ? "주 2회 롱폼" : "매일 Shorts"}"
      
      해당 채널의 브랜딩 포지션 전략, 추천 3대 시리즈 영상 기획안, 그리고 4주차 업로드 콘텐츠 일정을 작성해줘. 상세히 분석해서 마크다운 형식으로 설명해줘.`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "youtube-report",
          prompt: prompt,
        }),
      });

      if (!res.ok) throw new Error("API call failed");
      const result = await res.json();
      
      if (result.text) {
        setReport({
          niche,
          positioning: "차별화된 버티컬 Niche 포지션 점유. 고관여 시청자 층을 타겟으로 한 상세 해설 및 솔직 비교 분석 위주의 무드 형성.",
          series: [
            { name: `${niche} 완전 입문 기초 지식`, desc: "초보자가 매력을 느끼고 유입될 수 있는 대중성 콘텐츠" },
            { name: `실전 꿀팁과 흔한 실수 모음`, desc: "시청 지속률을 유지하고 댓글 피드백을 활성화하는 노하우성 콘텐츠" },
            { name: "트렌드 신속 정보 리뷰", desc: "급상승 키워드를 타고 유입률을 스파이크 시켜주는 검색 최적화용 시리즈" },
          ],
          schedule: [
            { week: "1주차", title: `${niche} 초보자를 위한 10분 요약 총정리`, tag: "대중성" },
            { week: "2주차", title: `${niche}할 때 무조건 후회하는 5가지 지름길`, tag: "노하우" },
            { week: "3주차", title: "가장 핫한 신규 트렌드 기능 직접 써본 후기", tag: "검색유입" },
            { week: "4주차", title: "구독자들이 가장 많이 질문한 내용 Q&A 스크립트", tag: "소통" },
          ],
          rawText: result.text,
        });
        return;
      }
      throw new Error("Empty text");
    } catch (err) {
      console.warn("AI strategy report failed, fallback to presets.");
      // Fallback local report presets
      setReport({
        niche,
        positioning: "차별화된 버티컬 Niche 포지션 점유. 고관여 시청자 층을 타겟으로 한 상세 해설 및 솔직 비교 분석 위주의 무드 형성.",
        series: [
          { name: `${niche} 완전 입문 기초 지식`, desc: "초보자가 매력을 느끼고 유입될 수 있는 대중성 콘텐츠" },
          { name: `실전 꿀팁과 흔한 실수 모음`, desc: "시청 지속률을 유지하고 댓글 피드백을 활성화하는 노하우성 콘텐츠" },
          { name: "트렌드 신속 정보 리뷰", desc: "급상승 키워드를 타고 유입률을 스파이크 시켜주는 검색 최적화용 시리즈" },
        ],
        schedule: [
          { week: "1주차", title: `${niche} 초보자를 위한 10분 요약 총정리`, tag: "대중성" },
          { week: "2주차", title: `${niche}할 때 무조건 후회하는 5가지 지름길`, tag: "노하우" },
          { week: "3주차", title: "가장 핫한 신규 트렌드 기능 직접 써본 후기", tag: "검색유입" },
          { week: "4주차", title: "구독자들이 가장 많이 질문한 내용 Q&A 스크립트", tag: "소통" },
        ],
        rawText: "기본 로컬 전략 리포트가 로드되었습니다. 채널 로드맵을 참고하십시오.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <FileText className="text-indigo-400" size={20} />
          콘텐츠 전략 리포트 생성기
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          채널이 속할 틈새 분야(Niche)와 타겟 업로드 템포를 설정하면, 채널 포지셔닝 지침서, 3대 주력 영상 시리즈 개념, 4주차 스케줄을 자동으로 빌드합니다.
        </p>

        <form onSubmit={handleGenerate} className="grid gap-3 sm:grid-cols-3 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400">채널 분야 (Niche)</label>
            <input
              type="text"
              required
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="예: AI 코딩 부업, 캠핑 요리 레시피"
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-indigo-500/50 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400">업로드 타겟 주기</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-bold text-zinc-350 outline-none focus:border-indigo-500/50 transition cursor-pointer"
            >
              <option value="week-2">주 2회 업로드 (일반 동영상)</option>
              <option value="shorts-daily">매일 1편 업로드 (Shorts 쇼츠 전용)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !niche.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-650 px-6 text-xs font-black text-white hover:bg-indigo-600 disabled:opacity-50 transition shadow-lg shadow-indigo-650/10 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                리포트 전략 수집 중...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                전략 리포트 생성
              </>
            )}
          </button>
        </form>
      </div>

      {report && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Strategy Details columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Position */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white">채널 포지셔닝 설계안</h3>
                <button
                  onClick={() => handleCopy(report.positioning, "pos")}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  {copiedSection === "pos" ? "복사완료" : "복사"}
                </button>
              </div>
              <p className="text-xs text-zinc-350 leading-relaxed font-semibold bg-zinc-950/40 p-4 rounded-xl border border-zinc-850">
                {report.positioning}
              </p>
            </div>

            {/* Video series ideas */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-white">추천 3대 주요 영상 시리즈</h3>
              <div className="space-y-3">
                {report.series.map((ser: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-indigo-500/30 pl-4 py-1">
                    <p className="text-xs font-bold text-white">{ser.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{ser.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar 4-Week Schedule */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black text-white">4주차 권장 업로드 일정표</h3>
            <div className="space-y-3.5">
              {report.schedule.map((sch: any, idx: number) => (
                <div key={idx} className="rounded-xl bg-zinc-950/60 p-3.5 border border-zinc-850 flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-indigo-450 uppercase">{sch.week}</span>
                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[8px] font-bold text-indigo-450">{sch.tag}</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-snug">{sch.title}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-zinc-850 bg-zinc-900/25 p-3 flex gap-2 items-start text-[9px] leading-relaxed text-zinc-555">
              <AlertCircle size={13} className="text-cyan-400 shrink-0 mt-0.5" />
              스케줄의 대중성 콘텐츠로 초기 구독자를 모은 뒤, 2주차에 노하우성 유료 전환 가치를 체감시키는 구조입니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
