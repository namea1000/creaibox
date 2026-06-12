"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";



const PLAN_STORAGE_KEY = "creaibox_writing_plan";

const postTypeOptions = [
  "SEO 최적화형",
  "뉴스형",
  "전문 가이드형",
  "애드센스 수익형",
  "AI 인사이트 포스팅",
];

const toneOptions = [
  "전문적",
  "친근한",
  "신뢰감 있는",
  "분석적인",
  "브랜드형",
];

export default function CreaiboxWritingPlanPage() {
  const router = useRouter();



  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [reader, setReader] = useState("");
  const [postType, setPostType] = useState("SEO 최적화형");
  const [tone, setTone] = useState("전문적");
  const [goal, setGoal] = useState("");
  const [outline, setOutline] = useState("");

  const completionScore = useMemo(() => {
    const values = [topic, keyword, reader, postType, tone, goal, outline];
    const filled = values.filter((v) => v.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [topic, keyword, reader, postType, tone, goal, outline]);

  const handleStartWriting = () => {
    const plan = {
      topic,
      keyword,
      reader,
      postType,
      tone,
      goal,
      outline,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
    router.push("/studio/writing/creaibox/create");
  };

  return (
    <div className="min-h-full bg-[#050816] text-slate-100">
      <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      <Sparkles size={14} />
                      Writing Planning Studio
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                      글쓰기 기획서 만들기
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      좋은 글은 생성 버튼을 누르기 전에 방향이 정해져야 합니다.
                      이 페이지에서 글의 목적, 독자, 키워드, 목차를 먼저 잡습니다.
                    </p>
                  </div>

                  <div className="hidden rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right sm:block">
                    <p className="text-xs text-slate-400">기획 완성도</p>
                    <p className="text-2xl font-bold text-cyan-300">
                      {completionScore}%
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldCard
                    icon={<Lightbulb size={18} />}
                    label="글 주제"
                    description="무엇에 대한 글인지 한 문장으로 입력하세요."
                  >
                    <input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="예: 2026년 AI 글쓰기 도구 활용법"
                      className="field-input"
                    />
                  </FieldCard>

                  <FieldCard
                    icon={<Search size={18} />}
                    label="핵심 키워드"
                    description="검색 노출을 노릴 대표 키워드입니다."
                  >
                    <input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="예: AI 글쓰기 도구"
                      className="field-input"
                    />
                  </FieldCard>

                  <FieldCard
                    icon={<Users size={18} />}
                    label="타깃 독자"
                    description="누가 이 글을 읽게 될지 정합니다."
                  >
                    <input
                      value={reader}
                      onChange={(e) => setReader(e.target.value)}
                      placeholder="예: 블로그로 수익화를 시작하려는 초보자"
                      className="field-input"
                    />
                  </FieldCard>

                  <FieldCard
                    icon={<Target size={18} />}
                    label="글의 목표"
                    description="정보 제공, 구매 전환, 브랜딩 등 목적을 입력하세요."
                  >
                    <input
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="예: AI 글쓰기 도구의 필요성을 설득"
                      className="field-input"
                    />
                  </FieldCard>

                  <FieldCard
                    icon={<FileText size={18} />}
                    label="글 유형"
                    description="생성될 글의 기본 구조를 선택합니다."
                  >
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="field-input"
                    >
                      {postTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </FieldCard>

                  <FieldCard
                    icon={<BookOpenText size={18} />}
                    label="문체"
                    description="글의 말투와 분위기를 선택합니다."
                  >
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="field-input"
                    >
                      {toneOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </FieldCard>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        예상 목차 / 글 구성
                      </p>
                      <p className="text-xs text-slate-400">
                        직접 입력하거나, 생성 페이지에서 AI가 이어받을 기준으로 사용합니다.
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    placeholder={`예:
1. AI 글쓰기 도구가 필요한 이유
2. 기존 블로그 작성 방식의 한계
3. Creaibox 글쓰기의 핵심 기능
4. SEO 최적화 글쓰기 흐름
5. 실제 활용 예시
6. 결론 및 추천 사용법`}
                    rows={8}
                    className="min-h-[220px] w-full resize-none rounded-2xl border border-white/10 bg-[#060b1d] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/60"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    기획 내용은 브라우저에 임시 저장되며, 다음 글쓰기 화면에서 활용할 수 있습니다.
                  </p>

                  <button
                    onClick={handleStartWriting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    기획 저장 후 글쓰기 시작
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-sm font-bold text-white">기획 요약</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <SummaryItem label="주제" value={topic} />
                  <SummaryItem label="키워드" value={keyword} />
                  <SummaryItem label="독자" value={reader} />
                  <SummaryItem label="글 유형" value={postType} />
                  <SummaryItem label="문체" value={tone} />
                  <SummaryItem label="목표" value={goal} />
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
                <h3 className="text-sm font-bold text-amber-200">
                  추천 사용 흐름
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  먼저 기획을 잡고, 다음 화면에서 AI 원고 생성, SEO 점검,
                  썸네일 생성, 발행 순서로 이어가면 됩니다.
                </p>
              </div>
            </aside>
          </div>
        </main>

      <style jsx>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #060b1d;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #f8fafc;
          outline: none;
        }

        .field-input::placeholder {
          color: #475569;
        }

        .field-input:focus {
          border-color: rgba(34, 211, 238, 0.6);
        }

        .field-input option {
          background: #060b1d;
          color: #f8fafc;
        }
      `}</style>
    </div>
  );
}

function FieldCard({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm text-slate-200">
        {value || "미입력"}
      </p>
    </div>
  );
}