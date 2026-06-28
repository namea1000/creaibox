"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  ArrowLeft,
  Play,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Database,
  Brain,
  Rss,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Loader2,
  Trash2,
  Save,
  Info,
} from "lucide-react";

type Node = {
  id: string;
  type: "trigger" | "filter" | "ai" | "action";
  label: string;
  subLabel: string;
  description: string;
  status: "idle" | "running" | "success" | "failed";
  settings: Record<string, string>;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastRun: string | null;
  nodes: Node[];
};

export default function AutomationWorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "wf-1",
      name: "실시간 급상승 키워드 &rarr; AI 블로그 포스팅 자동화",
      description: "구글/네이버 실시간 급상승 인기 키워드를 감지하여 자동으로 정보를 수집하고 블로그 글을 기획/발행합니다.",
      isActive: true,
      lastRun: "2026-06-27 15:40:12",
      nodes: [
        {
          id: "node-1-1",
          type: "trigger",
          label: "트렌드 감지기",
          subLabel: "트렌드 점수 85점 이상",
          description: "구글 트렌드 및 네이버 데이터랩에서 85점 이상 돌파하는 실시간 주제를 트리거합니다.",
          status: "idle",
          settings: { source: "구글+네이버 트렌드", threshold: "85" },
        },
        {
          id: "node-1-2",
          type: "filter",
          label: "카테고리 필터",
          subLabel: "IT/비즈니스 카테고리만 허용",
          description: "수집된 급상승 검색어 중 사전에 지정한 카테고리(IT/재테크/비즈니스) 키워드만 통과시킵니다.",
          status: "idle",
          settings: { categories: "IT, 비즈니스, 재테크", excludeWords: "연예, 스포츠" },
        },
        {
          id: "node-1-3",
          type: "ai",
          label: "AI 콘텐츠 기획",
          subLabel: "블로그 글쓰기 유형",
          description: "통과된 키워드를 활용해 10종의 시퀀셜 기획 아이템을 자동 수립하고 제목, 아웃라인을 설계합니다.",
          status: "idle",
          settings: { type: "블로그 글쓰기 콘텐츠", tone: "전문적이고 통찰력 있는 분석 (기술 블로그)", count: "10" },
        },
        {
          id: "node-1-4",
          type: "action",
          label: "자동 배포",
          subLabel: "Creaibox 블로그",
          description: "기획이 완료된 아웃라인을 기반으로 AI 글쓰기를 구동해 Creaibox 블로그에 최종 원고로 발행합니다.",
          status: "idle",
          settings: { target: "Creaibox 블로그", autoPublish: "즉시 발행" },
        },
      ],
    },
    {
      id: "wf-2",
      name: "매주 화/목요일 오전 10시 &rarr; 네이버 블로그 콘텐츠 발행",
      description: "지정된 스케줄러 시점에 맞춰 사전에 약정된 메인 키워드로 글을 기획하고 자동 송고합니다.",
      isActive: false,
      lastRun: null,
      nodes: [
        {
          id: "node-2-1",
          type: "trigger",
          label: "예약 타이머",
          subLabel: "매주 화/목 10:00 AM",
          description: "정해진 스케줄링 시점(화요일, 목요일 오전 10시)에 자동으로 파이프라인을 작동시킵니다.",
          status: "idle",
          settings: { cron: "0 10 * * 2,4", timezone: "Seoul" },
        },
        {
          id: "node-2-2",
          type: "filter",
          label: "키워드 큐",
          subLabel: "대기 중인 키워드 풀 사용",
          description: "사전에 키워드 아이디어 풀에 등록해 둔 대기 키워드를 순차적으로 1개씩 꺼내 사용합니다.",
          status: "idle",
          settings: { source: "아이디어 허브 보관함", order: "오래된 순" },
        },
        {
          id: "node-2-3",
          type: "ai",
          label: "AI 기획 & 네이버 초안",
          subLabel: "네이버 글쓰기 포맷",
          description: "네이버 검색 SEO에 최적화된 형식과 어조로 상세 글감 및 아웃라인을 AI 생성합니다.",
          status: "idle",
          settings: { tone: "친근하고 일상적인 대화체", keywordUsage: "본문 내 5회 이상" },
        },
        {
          id: "node-2-4",
          type: "action",
          label: "네이버 자동 업로드",
          subLabel: "네이버 블로그",
          description: "생성 완료된 초안을 연결된 네이버 API를 통해 '비공개 저장글' 상태로 자동 업로드합니다.",
          status: "idle",
          settings: { target: "네이버 블로그 API", uploadStatus: "임시저장 (드래프트)" },
        },
      ],
    },
  ]);

  const [selectedWfId, setSelectedWfId] = useState<string>("wf-1");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-1-1");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedNodeIdx, setSimulatedNodeIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentWorkflow = workflows.find((w) => w.id === selectedWfId) || workflows[0];
  const selectedNode = currentWorkflow.nodes.find((n) => n.id === selectedNodeId) || null;

  // 토스트 타이머
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleWfActive = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === wfId) {
          const nextState = !w.isActive;
          setToastMessage(
            `'${w.name.replace("&rarr;", "→")}' 자동화 규칙이 ${
              nextState ? "활성화" : "비활성화"
            } 되었습니다.`
          );
          return { ...w, isActive: nextState };
        }
        return w;
      })
    );
  };

  const handleUpdateNodeSetting = (key: string, val: string) => {
    if (!selectedNodeId) return;

    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === selectedWfId) {
          const updatedNodes = w.nodes.map((n) => {
            if (n.id === selectedNodeId) {
              return {
                ...n,
                settings: {
                  ...n.settings,
                  [key]: val,
                },
              };
            }
            return n;
          });
          return { ...w, nodes: updatedNodes };
        }
        return w;
      })
    );
  };

  // 워크플로우 시뮬레이터 구동
  const runSimulation = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setToastMessage("워크플로우 자동화 테스트 시뮬레이션을 구동합니다.");

    // 노드 상태 초기화
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === selectedWfId) {
          return {
            ...w,
            nodes: w.nodes.map((n) => ({ ...n, status: "idle" })),
          };
        }
        return w;
      })
    );

    const nodeCount = currentWorkflow.nodes.length;

    // 순차적으로 노드 실행 애니메이션 가동
    for (let i = 0; i < nodeCount; i++) {
      setSimulatedNodeIdx(i);
      
      // 실행 상태 변경
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id === selectedWfId) {
            const nodes = [...w.nodes];
            nodes[i] = { ...nodes[i], status: "running" };
            return { ...w, nodes };
          }
          return w;
        })
      );

      // 1.5초 로딩 효과 대기
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 성공 상태 변경
      setWorkflows((prev) =>
        prev.map((w) => {
          if (w.id === selectedWfId) {
            const nodes = [...w.nodes];
            nodes[i] = { ...nodes[i], status: "success" };
            return { ...w, nodes };
          }
          return w;
        })
      );
    }

    // 최종 성공 완료
    setIsSimulating(false);
    setSimulatedNodeIdx(null);
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === selectedWfId) {
          return { ...w, lastRun: nowStr };
        }
        return w;
      })
    );

    setToastMessage("축하합니다. 모든 파이프라인 노드가 완벽히 구동하여 자동화 발행 테스트에 성공했습니다.");
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 p-6 md:p-10 space-y-6">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400">
            <Bot size={18} />
            <span className="text-xs font-black tracking-wider uppercase">Content Planner</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            자동화 워크플로우
          </h1>
          <p className="text-sm text-slate-400">
            기획 수립부터 콘텐츠 작성, 플랫폼 배포까지 무인으로 연쇄 처리하는 자동화 규칙을 제어합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/studio/content-planner"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-slate-200 hover:border-cyan-300/50 transition"
          >
            <ArrowLeft size={14} />
            플래너로 돌아가기
          </Link>
        </div>
      </div>

      {/* 메인 레이아웃: 좌측 규칙 목록 + 우측 노드 에디터 및 설정 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. 좌측 자동화 규칙 매니저 */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">
              자동화 파이프라인 목록
            </h2>
            <button
              onClick={() => {
                setToastMessage("새로운 워크플로우 템플릿 생성이 준비 중입니다.");
              }}
              className="inline-flex items-center gap-1 text-[11px] font-black text-cyan-400 hover:text-cyan-300 transition"
            >
              <Plus size={12} />
              새 규칙 추가
            </button>
          </div>

          <div className="space-y-3">
            {workflows.map((wf) => {
              const isSelected = wf.id === selectedWfId;
              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    if (isSimulating) return;
                    setSelectedWfId(wf.id);
                    setSelectedNodeId(wf.nodes[0]?.id || null);
                  }}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-950/5"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  } ${isSimulating ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-black leading-snug ${
                        isSelected ? "text-cyan-300" : "text-white"
                      }`}
                      dangerouslySetInnerHTML={{ __html: wf.name }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWfActive(wf.id);
                      }}
                      className="text-slate-400 hover:text-white transition shrink-0"
                    >
                      {wf.isActive ? (
                        <ToggleRight className="text-cyan-400" size={24} />
                      ) : (
                        <ToggleLeft className="text-slate-650" size={24} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {wf.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-slate-500 font-bold">
                    <span>노드 연결: {wf.nodes.length}개</span>
                    <span>
                      최근 실행: {wf.lastRun ? wf.lastRun.substring(5, 16) : "이력 없음"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. 우측 워크플로우 캔버스 및 노드 속성 에디터 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 노드 연결 맵 (중앙) */}
          <div className="md:col-span-2 space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between min-h-[500px]">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-sm font-black text-white">
                  워크플로우 노드 맵
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                  각 노드 카드를 선택하여 세부 매개변수를 교정하세요.
                </p>
              </div>

              <button
                disabled={isSimulating || !currentWorkflow.isActive}
                onClick={runSimulation}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-black text-black transition ${
                  !currentWorkflow.isActive
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : isSimulating
                    ? "bg-cyan-500/80 cursor-wait"
                    : "bg-cyan-400 hover:bg-cyan-300"
                }`}
              >
                {isSimulating ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    시뮬레이션 중...
                  </>
                ) : (
                  <>
                    <Play size={12} fill="currentColor" />
                    테스트 작동 실행
                  </>
                )}
              </button>
            </div>

            {/* 노드 플로우 바디 (수직 체인 맵) */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
              {currentWorkflow.nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                const isLast = index === currentWorkflow.nodes.length - 1;

                // 노드 타입별 컬러
                const borderColors = {
                  idle: isSelected ? "border-cyan-400" : "border-white/10",
                  running: "border-yellow-400 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.2)]",
                  success: "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]",
                  failed: "border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
                };

                const typeLabels = {
                  trigger: "⚡ 트리거",
                  filter: "🔍 필터",
                  ai: "🧠 AI 기획",
                  action: "🚀 액션/배포",
                };

                const typeColors = {
                  trigger: "text-amber-400 bg-amber-400/10",
                  filter: "text-blue-400 bg-blue-400/10",
                  ai: "text-violet-400 bg-violet-400/10",
                  action: "text-emerald-400 bg-emerald-400/10",
                };

                return (
                  <React.Fragment key={node.id}>
                    {/* 노드 바디 */}
                    <div
                      onClick={() => {
                        if (isSimulating) return;
                        setSelectedNodeId(node.id);
                      }}
                      className={`w-full max-w-[280px] rounded-2xl border bg-black/60 p-3.5 cursor-pointer transition flex items-start gap-3 relative ${
                        borderColors[node.status === "idle" && isSimulating ? "idle" : node.status]
                      } ${isSelected ? "bg-white/[0.04] scale-102" : "hover:bg-white/[0.02]"}`}
                    >
                      {/* 상태 인디케이터 아이콘 */}
                      <div className="mt-0.5 shrink-0">
                        {node.status === "running" ? (
                          <Loader2 className="h-4.5 w-4.5 text-yellow-400 animate-spin" />
                        ) : node.status === "success" ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                        ) : (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${typeColors[node.type]}`}>
                            {typeLabels[node.type]}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="text-xs font-black text-white truncate">
                          {node.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {node.subLabel}
                        </p>
                      </div>
                    </div>

                    {/* 커넥터 라인 */}
                    {!isLast && (
                      <div className="w-0.5 h-8 bg-white/10 flex items-center justify-center relative">
                        <div
                          className={`absolute top-0 bottom-0 w-0.5 transition-all duration-500 ${
                            simulatedNodeIdx !== null && index <= simulatedNodeIdx
                              ? "bg-cyan-400"
                              : "bg-transparent"
                          }`}
                        />
                        <ArrowRight
                          size={10}
                          className="text-white/10 rotate-90 absolute translate-y-1"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 우측 노드 매개변수 설정 패널 */}
          <div className="md:col-span-1 space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Settings2 size={16} className="text-slate-400" />
                <h3 className="text-sm font-black text-white">노드 옵션 편집</h3>
              </div>

              {!selectedNode ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                  <HelpCircle size={28} className="text-slate-650" />
                  <p className="text-xs text-slate-500 font-bold">
                    왼쪽 플로우 맵에서<br />노드를 클릭해 수정하세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-cyan-400 uppercase">
                      {selectedNode.type} Node
                    </span>
                    <h4 className="text-sm font-black text-white leading-normal">
                      {selectedNode.label}
                    </h4>
                    <p className="text-xs text-slate-450 leading-relaxed mt-1">
                      {selectedNode.description}
                    </p>
                  </div>

                  {/* 세부 바인딩 폼 */}
                  <div className="border-t border-white/5 pt-4 space-y-3.5">
                    {Object.keys(selectedNode.settings).map((key) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          {key === "source"
                            ? "수집 소스"
                            : key === "threshold"
                            ? "트리거 임계치"
                            : key === "categories"
                            ? "허용 카테고리"
                            : key === "excludeWords"
                            ? "제외 키워드 필터"
                            : key === "type"
                            ? "출력 유형"
                            : key === "tone"
                            ? "기본 어조(말투)"
                            : key === "count"
                            ? "생성 콘텐츠 수"
                            : key === "target"
                            ? "배포 대상"
                            : key === "autoPublish"
                            ? "자동 발행 모드"
                            : key}
                        </label>
                        <input
                          type="text"
                          value={selectedNode.settings[key]}
                          onChange={(e) => handleUpdateNodeSetting(key, e.target.value)}
                          className="w-full h-8.5 rounded-lg border border-white/10 bg-black px-3 text-xs font-bold text-slate-200 outline-none focus:border-cyan-400/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedNode && (
              <button
                onClick={() => {
                  setToastMessage("노드 매개변수 설정 사항이 메모리에 임시 기록되었습니다.");
                }}
                className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] text-xs font-bold text-slate-200 hover:bg-white/[0.1] hover:text-white transition"
              >
                <Save size={13} />
                설정 일시 저장
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 하단 우측 토스트 푸시 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-cyan-400/30 bg-zinc-950 p-4 shadow-2xl max-w-md animate-fade-in flex items-start gap-3">
          <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
              System Notification
            </span>
            <p className="text-xs text-slate-300 font-bold leading-normal">
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
